-- Add fit assessment column to requests table
ALTER TABLE public.requests ADD COLUMN IF NOT EXISTS fit_assessment TEXT;

-- Add constraint for valid values
ALTER TABLE public.requests ADD CONSTRAINT requests_fit_check
  CHECK (fit_assessment IS NULL OR fit_assessment IN ('strong', 'possible', 'weak'));
