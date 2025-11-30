-- Enable RLS on critical tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisti ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionisti ENABLE ROW LEVEL SECURITY;

-- Add public SELECT policy for professionisti (matching artisti and venues)
CREATE POLICY "Everyone can view professionisti profiles" 
ON public.professionisti 
FOR SELECT 
USING (true);