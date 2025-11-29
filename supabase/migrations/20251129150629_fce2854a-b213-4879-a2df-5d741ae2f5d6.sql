-- Create table for venue calendar notes
CREATE TABLE IF NOT EXISTS public.venue_calendar_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id uuid NOT NULL,
  note_date date NOT NULL,
  note_text text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.venue_calendar_notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Venues can view their own calendar notes" 
ON public.venue_calendar_notes 
FOR SELECT 
USING (auth.uid() = venue_id);

CREATE POLICY "Venues can insert their own calendar notes" 
ON public.venue_calendar_notes 
FOR INSERT 
WITH CHECK (auth.uid() = venue_id);

CREATE POLICY "Venues can update their own calendar notes" 
ON public.venue_calendar_notes 
FOR UPDATE 
USING (auth.uid() = venue_id);

CREATE POLICY "Venues can delete their own calendar notes" 
ON public.venue_calendar_notes 
FOR DELETE 
USING (auth.uid() = venue_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_venue_calendar_notes_updated_at
BEFORE UPDATE ON public.venue_calendar_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create unique constraint to prevent duplicate notes for same date
CREATE UNIQUE INDEX venue_calendar_notes_venue_date_idx 
ON public.venue_calendar_notes(venue_id, note_date);