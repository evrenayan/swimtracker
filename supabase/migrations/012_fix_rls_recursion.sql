-- Fix infinite recursion in user_profiles RLS policies
-- The previous policy caused an infinite loop because it queried user_profiles table within the policy check for user_profiles table without SECURITY DEFINER bypass.

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;

-- Re-create policies using the SECURITY DEFINER function is_admin()
-- This function runs with owner privileges and bypasses RLS, avoiding the infinite loop.

CREATE POLICY "Admins can read all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update any profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert profiles"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Ensure is_admin function exists and is correct (just in case)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- This query runs as the function owner (SECURITY DEFINER), bypassing RLS
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
