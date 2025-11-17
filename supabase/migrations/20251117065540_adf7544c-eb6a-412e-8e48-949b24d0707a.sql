-- Add media fields to artisti table for file attachments
ALTER TABLE public.artisti 
ADD COLUMN IF NOT EXISTS epk_pdf text[],
ADD COLUMN IF NOT EXISTS foto_professionali text[],
ADD COLUMN IF NOT EXISTS accenni_brani text[],
ADD COLUMN IF NOT EXISTS video_artistici text[];

-- Set default values for existing records
UPDATE public.artisti 
SET 
  epk_pdf = COALESCE(epk_pdf, '{}'),
  foto_professionali = COALESCE(foto_professionali, '{}'),
  accenni_brani = COALESCE(accenni_brani, '{}'),
  video_artistici = COALESCE(video_artistici, '{}')
WHERE 
  epk_pdf IS NULL OR 
  foto_professionali IS NULL OR 
  accenni_brani IS NULL OR 
  video_artistici IS NULL;