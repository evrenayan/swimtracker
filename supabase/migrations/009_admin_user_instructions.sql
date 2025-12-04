-- This migration creates a seed admin user
-- Note: In production, you should create admin users through Supabase Dashboard
-- and manually update their role in user_profiles table

-- Function to create admin user (to be called manually or through Supabase Dashboard)
-- Example usage after creating a user through Supabase Auth:
-- UPDATE user_profiles SET role = 'admin' WHERE id = 'user-uuid-here';

-- For development, you can create a test admin account through Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Create a new user with email/password
-- 3. Copy the user's UUID
-- 4. Run: UPDATE user_profiles SET role = 'admin' WHERE id = 'copied-uuid';

-- Add a comment for documentation
COMMENT ON TABLE user_profiles IS 'User profiles with role-based access control. Roles: admin (full access), athlete (own data only)';
COMMENT ON COLUMN user_profiles.role IS 'User role: admin = system administrator with full access, athlete = can only access own swimmer data';
COMMENT ON COLUMN swimmers.user_id IS 'Links swimmer to a user account. One user can be linked to one swimmer only.';
