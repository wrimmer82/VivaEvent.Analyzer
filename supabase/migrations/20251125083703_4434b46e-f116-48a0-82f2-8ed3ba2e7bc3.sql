-- Create collaboration_requests table for professionals
CREATE TABLE public.collaboration_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  receiver_type TEXT NOT NULL CHECK (receiver_type IN ('artista', 'venue')),
  service_description TEXT NOT NULL,
  personal_message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;

-- Policies for collaboration_requests
CREATE POLICY "Users can create collaboration requests"
ON public.collaboration_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view their sent requests"
ON public.collaboration_requests
FOR SELECT
TO authenticated
USING (auth.uid() = sender_id);

CREATE POLICY "Users can view their received requests"
ON public.collaboration_requests
FOR SELECT
TO authenticated
USING (auth.uid() = receiver_id);

CREATE POLICY "Receivers can update requests"
ON public.collaboration_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = receiver_id);

-- Trigger for updated_at
CREATE TRIGGER update_collaboration_requests_updated_at
BEFORE UPDATE ON public.collaboration_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();