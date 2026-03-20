-- Migration: Update status system for client portal
-- Run in: Supabase Dashboard > SQL Editor > New Query > Run

-- 1. Drop old constraint
ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_status_check;

-- 2. Add new statuses
ALTER TABLE public.requests ADD CONSTRAINT requests_status_check
  CHECK (status IN ('awaiting_review', 'approved', 'call_scheduled', 'strategy_review', 'declined'));

-- 3. Change default
ALTER TABLE public.requests ALTER COLUMN status SET DEFAULT 'awaiting_review';

-- 4. Migrate any existing data from old statuses
UPDATE public.requests SET status = 'awaiting_review' WHERE status IN ('new', 'reviewed');
UPDATE public.requests SET status = 'call_scheduled' WHERE status = 'contacted';
UPDATE public.requests SET status = 'declined' WHERE status = 'closed';
