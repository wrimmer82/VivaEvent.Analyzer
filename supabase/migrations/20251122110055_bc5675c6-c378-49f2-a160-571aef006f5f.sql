-- Add missing fields to venues table
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS biografia text,
ADD COLUMN IF NOT EXISTS telefono text,
ADD COLUMN IF NOT EXISTS sito_web text;