-- Create artist_calendar_notes table for storing artist's personal calendar notes
CREATE TABLE IF NOT EXISTS public.artist_calendar_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL,
  note_date DATE NOT NULL,
  note_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_artist_date UNIQUE (artist_id, note_date)
);

-- Enable Row Level Security
ALTER TABLE public.artist_calendar_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for artist calendar notes
CREATE POLICY "Artists can view their own calendar notes"
ON public.artist_calendar_notes
FOR SELECT
USING (auth.uid() = artist_id);

CREATE POLICY "Artists can insert their own calendar notes"
ON public.artist_calendar_notes
FOR INSERT
WITH CHECK (auth.uid() = artist_id);

CREATE POLICY "Artists can update their own calendar notes"
ON public.artist_calendar_notes
FOR UPDATE
USING (auth.uid() = artist_id);

CREATE POLICY "Artists can delete their own calendar notes"
ON public.artist_calendar_notes
FOR DELETE
USING (auth.uid() = artist_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_artist_calendar_notes_updated_at
BEFORE UPDATE ON public.artist_calendar_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();