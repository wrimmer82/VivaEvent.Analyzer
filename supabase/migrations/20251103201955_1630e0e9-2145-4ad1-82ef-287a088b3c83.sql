-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('artista', 'venue', 'professionista');

-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  user_type user_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create artisti table
CREATE TABLE public.artisti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  genere_musicale TEXT NOT NULL,
  citta TEXT NOT NULL,
  cachet_desiderato INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create venues table
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  nome_locale TEXT NOT NULL,
  email TEXT NOT NULL,
  indirizzo TEXT NOT NULL,
  citta TEXT NOT NULL,
  capacita INTEGER NOT NULL,
  generi_preferiti TEXT[] NOT NULL,
  budget_medio INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create professionisti table
CREATE TABLE public.professionisti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL,
  ruolo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisti ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionisti ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for artisti
CREATE POLICY "Artisti can view their own profile"
  ON public.artisti FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Artisti can insert their own profile"
  ON public.artisti FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Artisti can update their own profile"
  ON public.artisti FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view artisti profiles"
  ON public.artisti FOR SELECT
  USING (true);

-- RLS Policies for venues
CREATE POLICY "Venues can view their own profile"
  ON public.venues FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Venues can insert their own profile"
  ON public.venues FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Venues can update their own profile"
  ON public.venues FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view venues profiles"
  ON public.venues FOR SELECT
  USING (true);

-- RLS Policies for professionisti
CREATE POLICY "Professionisti can view their own profile"
  ON public.professionisti FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Professionisti can insert their own profile"
  ON public.professionisti FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Professionisti can update their own profile"
  ON public.professionisti FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- The actual user data will be inserted by the application
  -- This trigger is just a placeholder for future enhancements
  RETURN NEW;
END;
$$;