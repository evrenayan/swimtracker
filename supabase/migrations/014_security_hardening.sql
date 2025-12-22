-- ============================================================================
-- SECURITY HARDENING & CLEANUP
-- ============================================================================

-- 1. REVOKE ANONYMOUS ACCESS
-- Ensure no anonymous access remains on any critical tables since we enforced authentication via Middleware.
-- This effectively removes any risk from leftover policies in 005_allow_anon_access.sql

DO $$
BEGIN
    -- Drop anon policies on swimmers
    DROP POLICY IF EXISTS "Allow anon users to read swimmers" ON swimmers;
    DROP POLICY IF EXISTS "Allow anon users to insert swimmers" ON swimmers;
    DROP POLICY IF EXISTS "Allow anon users to update swimmers" ON swimmers;
    DROP POLICY IF EXISTS "Allow anon users to delete swimmers" ON swimmers;

    -- Drop anon policies on race_records
    DROP POLICY IF EXISTS "Allow anon users to read race_records" ON race_records;
    DROP POLICY IF EXISTS "Allow anon users to insert race_records" ON race_records;
    DROP POLICY IF EXISTS "Allow anon users to update race_records" ON race_records;
    DROP POLICY IF EXISTS "Allow anon users to delete race_records" ON race_records;

    -- Drop anon policies on barrier_values
    DROP POLICY IF EXISTS "Allow anon users to read barrier_values" ON barrier_values;
    DROP POLICY IF EXISTS "Allow anon users to insert barrier_values" ON barrier_values;
    DROP POLICY IF EXISTS "Allow anon users to update barrier_values" ON barrier_values;
    DROP POLICY IF EXISTS "Allow anon users to delete barrier_values" ON barrier_values;

    -- Drop anon policies on reference tables (Optional: keep if public pages need them, but safer to drop)
    DROP POLICY IF EXISTS "Allow anon users to read pool_types" ON pool_types;
    DROP POLICY IF EXISTS "Allow anon users to read swimming_styles" ON swimming_styles;
    DROP POLICY IF EXISTS "Allow anon users to read barrier_types" ON barrier_types;
    
    -- In case 005 policies are still active with different names or generic
    -- We can also explicitly REVOKE
    REVOKE ALL ON swimmers FROM anon;
    REVOKE ALL ON race_records FROM anon;
    REVOKE ALL ON barrier_values FROM anon;
    REVOKE ALL ON user_profiles FROM anon;
END $$;

-- 2. ENSURE SECURE USER PROFILE UPDATES
-- Verify that regular users cannot escalate their privileges to 'admin'

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND 
    -- Important: Ensure the new role matches the existing role (prevent change)
    -- This subquery is safe from recursion because "Users can read own profile" relies only on ID match
    role = (SELECT role FROM user_profiles WHERE id = auth.uid())
  );

-- 3. ENSURE SWIMMERS CANNOT BE CREATED BY NON-ADMINS (Double Check)
-- We only want Admins to CREATE swimmer profiles. Athletes should only be linked.
-- Drop any potential insert policy for non-admins (there shouldn't be any, but to be safe)

DROP POLICY IF EXISTS "Athletes can insert swimmers" ON swimmers;

-- Re-affirm Admin insert policy (if missing)
-- This is already in 008, but we make sure.
DROP POLICY IF EXISTS "Admins can insert swimmers" ON swimmers;
CREATE POLICY "Admins can insert swimmers"
  ON swimmers FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());
