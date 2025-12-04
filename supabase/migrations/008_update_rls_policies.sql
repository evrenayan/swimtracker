-- Drop all existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read swimmers" ON swimmers;
DROP POLICY IF EXISTS "Allow authenticated users to insert swimmers" ON swimmers;
DROP POLICY IF EXISTS "Allow authenticated users to update swimmers" ON swimmers;
DROP POLICY IF EXISTS "Allow authenticated users to delete swimmers" ON swimmers;
DROP POLICY IF EXISTS "Allow anon users to read swimmers" ON swimmers;
DROP POLICY IF EXISTS "Allow anon users to insert swimmers" ON swimmers;
DROP POLICY IF EXISTS "Allow anon users to update swimmers" ON swimmers;
DROP POLICY IF EXISTS "Allow anon users to delete swimmers" ON swimmers;

DROP POLICY IF EXISTS "Allow authenticated users to read race_records" ON race_records;
DROP POLICY IF EXISTS "Allow authenticated users to insert race_records" ON race_records;
DROP POLICY IF EXISTS "Allow authenticated users to update race_records" ON race_records;
DROP POLICY IF EXISTS "Allow authenticated users to delete race_records" ON race_records;
DROP POLICY IF EXISTS "Allow anon users to read race_records" ON race_records;
DROP POLICY IF EXISTS "Allow anon users to insert race_records" ON race_records;
DROP POLICY IF EXISTS "Allow anon users to update race_records" ON race_records;
DROP POLICY IF EXISTS "Allow anon users to delete race_records" ON race_records;

DROP POLICY IF EXISTS "Allow anon users to read barrier_values" ON barrier_values;
DROP POLICY IF EXISTS "Allow anon users to insert barrier_values" ON barrier_values;
DROP POLICY IF EXISTS "Allow anon users to update barrier_values" ON barrier_values;
DROP POLICY IF EXISTS "Allow anon users to delete barrier_values" ON barrier_values;

-- ============================================================================
-- SWIMMERS TABLE POLICIES
-- ============================================================================

-- Admins can do everything with swimmers
CREATE POLICY "Admins can read all swimmers"
  ON swimmers FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert swimmers"
  ON swimmers FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update all swimmers"
  ON swimmers FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can delete swimmers"
  ON swimmers FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Athletes can only read their own swimmer profile
CREATE POLICY "Athletes can read own swimmer"
  ON swimmers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Athletes can update their own swimmer profile (except user_id)
CREATE POLICY "Athletes can update own swimmer"
  ON swimmers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- RACE_RECORDS TABLE POLICIES
-- ============================================================================

-- Admins can do everything with race records
CREATE POLICY "Admins can read all race_records"
  ON race_records FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert race_records"
  ON race_records FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update all race_records"
  ON race_records FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can delete race_records"
  ON race_records FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Athletes can read their own race records
CREATE POLICY "Athletes can read own race_records"
  ON race_records FOR SELECT
  TO authenticated
  USING (
    swimmer_id IN (
      SELECT id FROM swimmers WHERE user_id = auth.uid()
    )
  );

-- Athletes can insert their own race records
CREATE POLICY "Athletes can insert own race_records"
  ON race_records FOR INSERT
  TO authenticated
  WITH CHECK (
    swimmer_id IN (
      SELECT id FROM swimmers WHERE user_id = auth.uid()
    )
  );

-- Athletes can update their own race records
CREATE POLICY "Athletes can update own race_records"
  ON race_records FOR UPDATE
  TO authenticated
  USING (
    swimmer_id IN (
      SELECT id FROM swimmers WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    swimmer_id IN (
      SELECT id FROM swimmers WHERE user_id = auth.uid()
    )
  );

-- Athletes can delete their own race records
CREATE POLICY "Athletes can delete own race_records"
  ON race_records FOR DELETE
  TO authenticated
  USING (
    swimmer_id IN (
      SELECT id FROM swimmers WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- BARRIER_VALUES TABLE POLICIES
-- ============================================================================

-- Everyone can read barrier values (reference data)
CREATE POLICY "Authenticated users can read barrier_values"
  ON barrier_values FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can modify barrier values
CREATE POLICY "Admins can insert barrier_values"
  ON barrier_values FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update barrier_values"
  ON barrier_values FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can delete barrier_values"
  ON barrier_values FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- REFERENCE TABLES POLICIES (pool_types, swimming_styles, barrier_types)
-- ============================================================================

-- Drop old anon policies for reference tables
DROP POLICY IF EXISTS "Allow anon users to read pool_types" ON pool_types;
DROP POLICY IF EXISTS "Allow anon users to read swimming_styles" ON swimming_styles;
DROP POLICY IF EXISTS "Allow anon users to read barrier_types" ON barrier_types;

-- Everyone can read reference tables
CREATE POLICY "Authenticated users can read pool_types"
  ON pool_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read swimming_styles"
  ON swimming_styles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read barrier_types"
  ON barrier_types FOR SELECT
  TO authenticated
  USING (true);
