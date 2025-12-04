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
