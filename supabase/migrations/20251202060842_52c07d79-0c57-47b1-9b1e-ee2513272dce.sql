-- Add unique constraint on artist_calendar_notes for upsert to work
ALTER TABLE public.artist_calendar_notes 
ADD CONSTRAINT artist_calendar_notes_artist_date_unique 
UNIQUE (artist_id, note_date);

-- Add unique constraint on venue_calendar_notes for upsert to work
ALTER TABLE public.venue_calendar_notes 
ADD CONSTRAINT venue_calendar_notes_venue_date_unique 
UNIQUE (venue_id, note_date);

-- Add unique constraint on professional_calendar_notes for upsert to work
ALTER TABLE public.professional_calendar_notes 
ADD CONSTRAINT professional_calendar_notes_professional_date_unique 
UNIQUE (professional_id, note_date);