-- Create professional_calendar_notes table for storing professional's personal calendar notes
CREATE TABLE IF NOT EXISTS public.professional_calendar_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL,
  note_date DATE NOT NULL,
  note_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_professional_date UNIQUE (professional_id, note_date)
);

-- Enable Row Level Security
ALTER TABLE public.professional_calendar_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for professional calendar notes
CREATE POLICY "Professionals can view their own calendar notes"
ON public.professional_calendar_notes
FOR SELECT
USING (auth.uid() = professional_id);

CREATE POLICY "Professionals can insert their own calendar notes"
ON public.professional_calendar_notes
FOR INSERT
WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Professionals can update their own calendar notes"
ON public.professional_calendar_notes
FOR UPDATE
USING (auth.uid() = professional_id);

CREATE POLICY "Professionals can delete their own calendar notes"
ON public.professional_calendar_notes
FOR DELETE
USING (auth.uid() = professional_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_professional_calendar_notes_updated_at
BEFORE UPDATE ON public.professional_calendar_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();