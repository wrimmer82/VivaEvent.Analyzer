-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

-- Create booking_requests table
CREATE TABLE public.booking_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  proposed_compensation INTEGER NOT NULL,
  personal_message TEXT,
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own sent requests
CREATE POLICY "Users can view their sent requests"
ON public.booking_requests
FOR SELECT
USING (auth.uid() = sender_id);

-- Policy: Users can view their received requests
CREATE POLICY "Users can view their received requests"
ON public.booking_requests
FOR SELECT
USING (auth.uid() = receiver_id);

-- Policy: Users can create their own requests
CREATE POLICY "Users can create requests"
ON public.booking_requests
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Policy: Receivers can update request status
CREATE POLICY "Receivers can update requests"
ON public.booking_requests
FOR UPDATE
USING (auth.uid() = receiver_id);

-- Trigger to update updated_at column
CREATE TRIGGER update_booking_requests_updated_at
BEFORE UPDATE ON public.booking_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();