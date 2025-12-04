-- Backfill missing user profiles for existing users
INSERT INTO public.user_profiles (id, role, full_name)
SELECT 
  id, 
  'athlete', 
  COALESCE(raw_user_meta_data->>'full_name', email)
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles);

-- Function to easily promote a user to admin by email
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;

  IF target_user_id IS NULL THEN
    RETURN 'User not found';
  END IF;

  -- Update role
  UPDATE public.user_profiles
  SET role = 'admin'
  WHERE id = target_user_id;

  RETURN 'User promoted to admin successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (so you can run it from SQL editor easily, 
-- though in prod you might want to restrict this)
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin(TEXT) TO service_role;
