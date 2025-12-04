-- Allow anonymous users to perform CRUD operations on swimmers table
CREATE POLICY "Allow anon users to read swimmers"
  ON swimmers FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon users to insert swimmers"
  ON swimmers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon users to update swimmers"
  ON swimmers FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon users to delete swimmers"
  ON swimmers FOR DELETE
  TO anon
  USING (true);

-- Allow anonymous users to perform CRUD operations on race_records table
CREATE POLICY "Allow anon users to read race_records"
  ON race_records FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon users to insert race_records"
  ON race_records FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon users to update race_records"
  ON race_records FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon users to delete race_records"
  ON race_records FOR DELETE
  TO anon
  USING (true);

-- Allow anonymous users to read reference tables
CREATE POLICY "Allow anon users to read pool_types"
  ON pool_types FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon users to read swimming_styles"
  ON swimming_styles FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon users to read barrier_types"
  ON barrier_types FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon users to read barrier_values"
  ON barrier_values FOR SELECT
  TO anon
  USING (true);
