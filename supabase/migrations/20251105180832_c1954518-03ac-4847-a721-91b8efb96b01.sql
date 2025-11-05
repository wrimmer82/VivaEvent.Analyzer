-- Add profile_completed field to users table
ALTER TABLE public.users 
ADD COLUMN profile_completed BOOLEAN NOT NULL DEFAULT false;

-- Add comment to explain the field
COMMENT ON COLUMN public.users.profile_completed IS 'Indicates if user has completed their profile setup after registration';