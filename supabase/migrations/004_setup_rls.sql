-- Enable Row Level Security on all tables
ALTER TABLE swimmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE swimming_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE barrier_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE barrier_values ENABLE ROW LEVEL SECURITY;

-- Swimmers table policies
-- Allow authenticated users to read all swimmers
CREATE POLICY "Allow authenticated users to read swimmers"
  ON swimmers FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert swimmers
CREATE POLICY "Allow authenticated users to insert swimmers"
  ON swimmers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update swimmers
CREATE POLICY "Allow authenticated users to update swimmers"
  ON swimmers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete swimmers
CREATE POLICY "Allow authenticated users to delete swimmers"
  ON swimmers FOR DELETE
  TO authenticated
  USING (true);

-- Race records table policies
-- Allow authenticated users to read all race records
CREATE POLICY "Allow authenticated users to read race_records"
  ON race_records FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert race records
CREATE POLICY "Allow authenticated users to insert race_records"
  ON race_records FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update race records
CREATE POLICY "Allow authenticated users to update race_records"
  ON race_records FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete race records
CREATE POLICY "Allow authenticated users to delete race_records"
  ON race_records FOR DELETE
  TO authenticated
  USING (true);

-- Reference tables policies (read-only for authenticated users)
-- Pool types
CREATE POLICY "Allow authenticated users to read pool_types"
  ON pool_types FOR SELECT
  TO authenticated
  USING (true);

-- Swimming styles
CREATE POLICY "Allow authenticated users to read swimming_styles"
  ON swimming_styles FOR SELECT
  TO authenticated
  USING (true);

-- Barrier types
CREATE POLICY "Allow authenticated users to read barrier_types"
  ON barrier_types FOR SELECT
  TO authenticated
  USING (true);

-- Barrier values
CREATE POLICY "Allow authenticated users to read barrier_values"
  ON barrier_values FOR SELECT
  TO authenticated
  USING (true);

-- Allow public read access to reference tables (optional, for unauthenticated access)
-- Uncomment these if you want to allow public access to reference data

-- CREATE POLICY "Allow public to read pool_types"
--   ON pool_types FOR SELECT
--   TO anon
--   USING (true);

-- CREATE POLICY "Allow public to read swimming_styles"
--   ON swimming_styles FOR SELECT
--   TO anon
--   USING (true);

-- CREATE POLICY "Allow public to read barrier_types"
--   ON barrier_types FOR SELECT
--   TO anon
--   USING (true);

-- CREATE POLICY "Allow public to read barrier_values"
--   ON barrier_values FOR SELECT
--   TO anon
--   USING (true);
