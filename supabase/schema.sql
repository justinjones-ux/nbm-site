-- ─────────────────────────────────────────────────────────────────────────────
-- NBM Site — Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Requests table
CREATE TABLE IF NOT EXISTS public.requests (
  id           UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID         REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email        TEXT         NOT NULL,                        -- from verified session, not user input
  name         TEXT         NOT NULL,
  company      TEXT,
  website      TEXT,
  message      TEXT         NOT NULL,
  status       TEXT         DEFAULT 'new'
                            CHECK (status IN ('new', 'reviewed', 'contacted', 'closed'))
                            NOT NULL,
  admin_notes  TEXT,
  created_at   TIMESTAMPTZ  DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ  DEFAULT NOW() NOT NULL
);

-- 2. Keep updated_at fresh automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_requests_updated_at ON public.requests;
CREATE TRIGGER set_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. Row-Level Security
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Users can read only their own submissions
CREATE POLICY "users_select_own_requests"
  ON public.requests FOR SELECT
  USING (auth.uid() = user_id);

-- Verified users can insert their own requests
-- (email verification is enforced at the API layer too)
CREATE POLICY "users_insert_own_requests"
  ON public.requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- No UPDATE/DELETE for regular users — only the service-role key can do that
-- (admin operations bypass RLS via the service-role key)

-- 4. Useful index
CREATE INDEX IF NOT EXISTS idx_requests_user_id   ON public.requests (user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status     ON public.requests (status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON public.requests (created_at DESC);
