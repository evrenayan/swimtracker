-- Allow authenticated users to perform CRUD operations on barrier_values table
CREATE POLICY "Allow authenticated users to insert barrier_values"
  ON barrier_values FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update barrier_values"
  ON barrier_values FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete barrier_values"
  ON barrier_values FOR DELETE
  TO authenticated
  USING (true);

-- Allow anonymous users to perform CRUD operations on barrier_values table
CREATE POLICY "Allow anon users to insert barrier_values"
  ON barrier_values FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon users to update barrier_values"
  ON barrier_values FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon users to delete barrier_values"
  ON barrier_values FOR DELETE
  TO anon
  USING (true);
