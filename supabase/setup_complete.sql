-- Complete Database Setup for Swimmer Performance Tracker
-- This file combines all migrations for easy setup
-- Execute this file in your Supabase SQL Editor or via psql

-- ============================================================================
-- STEP 1: CREATE TABLES
-- ============================================================================

-- Create swimmers table
CREATE TABLE swimmers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 100),
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('Erkek', 'Kadın')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create race_records table
CREATE TABLE race_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swimmer_id UUID NOT NULL REFERENCES swimmers(id) ON DELETE CASCADE,
  pool_type VARCHAR(10) NOT NULL CHECK (pool_type IN ('25m', '50m')),
  swimming_style VARCHAR(50) NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2100),
  total_milliseconds INTEGER NOT NULL CHECK (total_milliseconds > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance optimization
CREATE INDEX idx_race_records_swimmer_id ON race_records(swimmer_id);
CREATE INDEX idx_race_records_date ON race_records(year DESC, month DESC);

-- Create pool_types table
CREATE TABLE pool_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(10) NOT NULL UNIQUE,
  length_meters INTEGER NOT NULL
);

-- Create swimming_styles table
CREATE TABLE swimming_styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  distance_meters INTEGER NOT NULL,
  stroke_type VARCHAR(20) NOT NULL
);

-- Create barrier_types table
CREATE TABLE barrier_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(20) NOT NULL UNIQUE,
  category VARCHAR(20) NOT NULL
);

-- Create barrier_values table
CREATE TABLE barrier_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barrier_type_id UUID NOT NULL REFERENCES barrier_types(id),
  swimming_style_id UUID NOT NULL REFERENCES swimming_styles(id),
  pool_type_id UUID NOT NULL REFERENCES pool_types(id),
  age INTEGER NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('Erkek', 'Kadın')),
  time_milliseconds INTEGER NOT NULL CHECK (time_milliseconds > 0),
  UNIQUE(barrier_type_id, swimming_style_id, pool_type_id, age, gender)
);

-- Create index for barrier_values lookup
CREATE INDEX idx_barrier_values_lookup ON barrier_values(
  swimming_style_id, pool_type_id, age, gender
);

-- ============================================================================
-- STEP 2: SEED REFERENCE DATA
-- ============================================================================

-- Seed pool_types table
INSERT INTO pool_types (name, length_meters) VALUES
  ('25m', 25),
  ('50m', 50);

-- Seed swimming_styles table
INSERT INTO swimming_styles (name, distance_meters, stroke_type) VALUES
  ('50m Serbest', 50, 'Serbest'),
  ('100m Serbest', 100, 'Serbest'),
  ('200m Serbest', 200, 'Serbest'),
  ('400m Serbest', 400, 'Serbest'),
  ('800m Serbest', 800, 'Serbest'),
  ('1500m Serbest', 1500, 'Serbest'),
  ('50m Sırtüstü', 50, 'Sırtüstü'),
  ('100m Sırtüstü', 100, 'Sırtüstü'),
  ('200m Sırtüstü', 200, 'Sırtüstü'),
  ('50m Kelebek', 50, 'Kelebek'),
  ('100m Kelebek', 100, 'Kelebek'),
  ('200m Kelebek', 200, 'Kelebek'),
  ('50m Kurbağalama', 50, 'Kurbağalama'),
  ('100m Kurbağalama', 100, 'Kurbağalama'),
  ('200m Kurbağalama', 200, 'Kurbağalama'),
  ('200m Karışık', 200, 'Karışık');

-- Seed barrier_types table
INSERT INTO barrier_types (name, category) VALUES
  ('B1', '12 Yaş'),
  ('B2', '12 Yaş'),
  ('A1', '12 Yaş'),
  ('A2', '12 Yaş'),
  ('A3', '12 Yaş'),
  ('A4', '12 Yaş'),
  ('SEM', 'SEM');

-- ============================================================================
-- STEP 3: SEED SAMPLE BARRIER VALUES
-- ============================================================================

-- Sample barrier values for 50m Serbest, 25m pool, 12 years old, Male
INSERT INTO barrier_values (barrier_type_id, swimming_style_id, pool_type_id, age, gender, time_milliseconds)
SELECT 
  bt.id,
  ss.id,
  pt.id,
  12,
  'Erkek',
  CASE bt.name
    WHEN 'B1' THEN 35000
    WHEN 'B2' THEN 33000
    WHEN 'A1' THEN 31000
    WHEN 'A2' THEN 29000
    WHEN 'A3' THEN 27500
    WHEN 'A4' THEN 26000
    WHEN 'SEM' THEN 24500
  END
FROM barrier_types bt
CROSS JOIN swimming_styles ss
CROSS JOIN pool_types pt
WHERE ss.name = '50m Serbest' AND pt.name = '25m';

-- Sample barrier values for 50m Serbest, 25m pool, 12 years old, Female
INSERT INTO barrier_values (barrier_type_id, swimming_style_id, pool_type_id, age, gender, time_milliseconds)
SELECT 
  bt.id,
  ss.id,
  pt.id,
  12,
  'Kadın',
  CASE bt.name
    WHEN 'B1' THEN 38000
    WHEN 'B2' THEN 36000
    WHEN 'A1' THEN 34000
    WHEN 'A2' THEN 32000
    WHEN 'A3' THEN 30000
    WHEN 'A4' THEN 28500
    WHEN 'SEM' THEN 27000
  END
FROM barrier_types bt
CROSS JOIN swimming_styles ss
CROSS JOIN pool_types pt
WHERE ss.name = '50m Serbest' AND pt.name = '25m';

-- Sample barrier values for 100m Serbest, 25m pool, 12 years old, Male
INSERT INTO barrier_values (barrier_type_id, swimming_style_id, pool_type_id, age, gender, time_milliseconds)
SELECT 
  bt.id,
  ss.id,
  pt.id,
  12,
  'Erkek',
  CASE bt.name
    WHEN 'B1' THEN 80000
    WHEN 'B2' THEN 75000
    WHEN 'A1' THEN 70000
    WHEN 'A2' THEN 65000
    WHEN 'A3' THEN 60000
    WHEN 'A4' THEN 57000
    WHEN 'SEM' THEN 54000
  END
FROM barrier_types bt
CROSS JOIN swimming_styles ss
CROSS JOIN pool_types pt
WHERE ss.name = '100m Serbest' AND pt.name = '25m';

-- Sample barrier values for 100m Serbest, 25m pool, 12 years old, Female
INSERT INTO barrier_values (barrier_type_id, swimming_style_id, pool_type_id, age, gender, time_milliseconds)
SELECT 
  bt.id,
  ss.id,
  pt.id,
  12,
  'Kadın',
  CASE bt.name
    WHEN 'B1' THEN 85000
    WHEN 'B2' THEN 80000
    WHEN 'A1' THEN 75000
    WHEN 'A2' THEN 70000
    WHEN 'A3' THEN 65000
    WHEN 'A4' THEN 62000
    WHEN 'SEM' THEN 59000
  END
FROM barrier_types bt
CROSS JOIN swimming_styles ss
CROSS JOIN pool_types pt
WHERE ss.name = '100m Serbest' AND pt.name = '25m';

-- Sample barrier values for 50m Serbest, 50m pool, 12 years old, Male
INSERT INTO barrier_values (barrier_type_id, swimming_style_id, pool_type_id, age, gender, time_milliseconds)
SELECT 
  bt.id,
  ss.id,
  pt.id,
  12,
  'Erkek',
  CASE bt.name
    WHEN 'B1' THEN 34000
    WHEN 'B2' THEN 32000
    WHEN 'A1' THEN 30000
    WHEN 'A2' THEN 28000
    WHEN 'A3' THEN 26500
    WHEN 'A4' THEN 25000
    WHEN 'SEM' THEN 23500
  END
FROM barrier_types bt
CROSS JOIN swimming_styles ss
CROSS JOIN pool_types pt
WHERE ss.name = '50m Serbest' AND pt.name = '50m';

-- Sample barrier values for 50m Serbest, 50m pool, 12 years old, Female
INSERT INTO barrier_values (barrier_type_id, swimming_style_id, pool_type_id, age, gender, time_milliseconds)
SELECT 
  bt.id,
  ss.id,
  pt.id,
  12,
  'Kadın',
  CASE bt.name
    WHEN 'B1' THEN 37000
    WHEN 'B2' THEN 35000
    WHEN 'A1' THEN 33000
    WHEN 'A2' THEN 31000
    WHEN 'A3' THEN 29000
    WHEN 'A4' THEN 27500
    WHEN 'SEM' THEN 26000
  END
FROM barrier_types bt
CROSS JOIN swimming_styles ss
CROSS JOIN pool_types pt
WHERE ss.name = '50m Serbest' AND pt.name = '50m';

-- Sample SEM barrier values for other ages (13-18 years old) for 50m Serbest, 25m pool, Male
INSERT INTO barrier_values (barrier_type_id, swimming_style_id, pool_type_id, age, gender, time_milliseconds)
SELECT 
  bt.id,
  ss.id,
  pt.id,
  age_val,
  'Erkek',
  24500 - ((age_val - 12) * 500)
FROM barrier_types bt
CROSS JOIN swimming_styles ss
CROSS JOIN pool_types pt
CROSS JOIN (SELECT generate_series(13, 18) as age_val) ages
WHERE ss.name = '50m Serbest' AND pt.name = '25m' AND bt.name = 'SEM';

-- Sample SEM barrier values for other ages (13-18 years old) for 50m Serbest, 25m pool, Female
INSERT INTO barrier_values (barrier_type_id, swimming_style_id, pool_type_id, age, gender, time_milliseconds)
SELECT 
  bt.id,
  ss.id,
  pt.id,
  age_val,
  'Kadın',
  27000 - ((age_val - 12) * 500)
FROM barrier_types bt
CROSS JOIN swimming_styles ss
CROSS JOIN pool_types pt
CROSS JOIN (SELECT generate_series(13, 18) as age_val) ages
WHERE ss.name = '50m Serbest' AND pt.name = '25m' AND bt.name = 'SEM';

-- ============================================================================
-- STEP 4: SETUP ROW LEVEL SECURITY
-- ============================================================================

-- Enable Row Level Security on all tables
ALTER TABLE swimmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE race_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE swimming_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE barrier_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE barrier_values ENABLE ROW LEVEL SECURITY;

-- Swimmers table policies
CREATE POLICY "Allow authenticated users to read swimmers"
  ON swimmers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert swimmers"
  ON swimmers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update swimmers"
  ON swimmers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete swimmers"
  ON swimmers FOR DELETE
  TO authenticated
  USING (true);

-- Race records table policies
CREATE POLICY "Allow authenticated users to read race_records"
  ON race_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert race_records"
  ON race_records FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update race_records"
  ON race_records FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete race_records"
  ON race_records FOR DELETE
  TO authenticated
  USING (true);

-- Reference tables policies (read-only for authenticated users)
CREATE POLICY "Allow authenticated users to read pool_types"
  ON pool_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read swimming_styles"
  ON swimming_styles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read barrier_types"
  ON barrier_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read barrier_values"
  ON barrier_values FOR SELECT
  TO authenticated
  USING (true);
