-- Add notes column to booking_requests table
ALTER TABLE public.booking_requests 
ADD COLUMN IF NOT EXISTS venue_notes text;