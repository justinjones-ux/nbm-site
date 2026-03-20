-- Add booking column to requests table
ALTER TABLE public.requests ADD COLUMN IF NOT EXISTS booked_at TIMESTAMPTZ;

-- Allow users to update their own request (only booked_at and status to call_scheduled)
CREATE POLICY "users_update_own_booking"
  ON public.requests FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
