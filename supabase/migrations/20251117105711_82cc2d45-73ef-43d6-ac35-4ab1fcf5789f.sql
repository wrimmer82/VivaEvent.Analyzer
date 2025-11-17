-- Create landing_logs table for tracking title/tagline changes
CREATE TABLE IF NOT EXISTS public.landing_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  content_type TEXT NOT NULL, -- 'title' or 'tagline'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.landing_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to logs
CREATE POLICY "Anyone can view landing logs"
  ON public.landing_logs
  FOR SELECT
  USING (true);

-- Only authenticated users can insert logs (for future admin functionality)
CREATE POLICY "Authenticated users can insert landing logs"
  ON public.landing_logs
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create index for faster queries
CREATE INDEX idx_landing_logs_timestamp ON public.landing_logs(timestamp DESC);