-- Create logs table
CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('info', 'warning', 'error')),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert logs
CREATE POLICY "Authenticated users can insert logs"
ON logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow anonymous users to insert logs (e.g. login errors)
CREATE POLICY "Anon users can insert logs"
ON logs FOR INSERT
TO anon
WITH CHECK (true);

-- Only admins can view logs
CREATE POLICY "Admins can view logs"
ON logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role = 'admin'
  )
);
