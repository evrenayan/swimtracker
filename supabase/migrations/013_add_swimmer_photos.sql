-- Add photo_url column to swimmers table
ALTER TABLE swimmers ADD COLUMN photo_url TEXT;

-- Create storage bucket for swimmer photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('swimmer-photos', 'swimmer-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for swimmer photos
CREATE POLICY "Public Access for Swimmer Photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'swimmer-photos');

CREATE POLICY "Authenticated users can upload swimmer photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'swimmer-photos' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update their swimmer photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'swimmer-photos' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete swimmer photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'swimmer-photos' AND
  auth.role() = 'authenticated'
);
