-- Force update admin role for specific user (replace email with actual email)
-- This is a template file. Run the content in Supabase SQL Editor.

DO $$
DECLARE
  target_email TEXT := 'evrenayan@gmail.com'; -- Change this if needed
BEGIN
  -- 1. Ensure profile exists and is admin
  INSERT INTO public.user_profiles (id, role, full_name)
  SELECT id, 'admin', COALESCE(raw_user_meta_data->>'full_name', email)
  FROM auth.users
  WHERE email = target_email
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin';
  
  RAISE NOTICE 'User % promoted to admin', target_email;
END $$;
