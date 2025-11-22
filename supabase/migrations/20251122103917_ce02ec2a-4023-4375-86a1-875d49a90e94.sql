-- Add links field to venues table
ALTER TABLE venues ADD COLUMN IF NOT EXISTS links jsonb DEFAULT '{}'::jsonb;