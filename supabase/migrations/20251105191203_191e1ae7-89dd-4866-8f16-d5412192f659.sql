-- Add biografia field to artisti table
ALTER TABLE public.artisti ADD COLUMN IF NOT EXISTS biografia TEXT;

-- Add warning/gold color tokens for the design system
COMMENT ON COLUMN public.artisti.biografia IS 'Artist biography text';