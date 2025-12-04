-- Sample barrier_values data for testing
-- This creates sample data for 50m Serbest in 25m pool for 12-year-old males and females
-- Times are in milliseconds (MM:SS:mmm format converted)

-- Get IDs for reference (these will be used in the INSERT statements)
-- Note: In actual execution, you may need to adjust these based on your database

-- Sample barrier values for 50m Serbest, 25m pool, 12 years old, Male
-- B1: 00:35:000 = 35000ms, B2: 00:33:000 = 33000ms, A1: 00:31:000 = 31000ms
-- A2: 00:29:000 = 29000ms, A3: 00:27:500 = 27500ms, A4: 00:26:000 = 26000ms, SEM: 00:24:500 = 24500ms
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
-- B1: 00:38:000 = 38000ms, B2: 00:36:000 = 36000ms, A1: 00:34:000 = 34000ms
-- A2: 00:32:000 = 32000ms, A3: 00:30:000 = 30000ms, A4: 00:28:500 = 28500ms, SEM: 00:27:000 = 27000ms
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
-- B1: 01:20:000 = 80000ms, B2: 01:15:000 = 75000ms, A1: 01:10:000 = 70000ms
-- A2: 01:05:000 = 65000ms, A3: 01:00:000 = 60000ms, A4: 00:57:000 = 57000ms, SEM: 00:54:000 = 54000ms
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
-- B1: 01:25:000 = 85000ms, B2: 01:20:000 = 80000ms, A1: 01:15:000 = 75000ms
-- A2: 01:10:000 = 70000ms, A3: 01:05:000 = 65000ms, A4: 01:02:000 = 62000ms, SEM: 00:59:000 = 59000ms
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
-- B1: 00:34:000 = 34000ms, B2: 00:32:000 = 32000ms, A1: 00:30:000 = 30000ms
-- A2: 00:28:000 = 28000ms, A3: 00:26:500 = 26500ms, A4: 00:25:000 = 25000ms, SEM: 00:23:500 = 23500ms
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
-- B1: 00:37:000 = 37000ms, B2: 00:35:000 = 35000ms, A1: 00:33:000 = 33000ms
-- A2: 00:31:000 = 31000ms, A3: 00:29:000 = 29000ms, A4: 00:27:500 = 27500ms, SEM: 00:26:000 = 26000ms
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
  24500 - ((age_val - 12) * 500) -- Gets progressively faster with age
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
  27000 - ((age_val - 12) * 500) -- Gets progressively faster with age
FROM barrier_types bt
CROSS JOIN swimming_styles ss
CROSS JOIN pool_types pt
CROSS JOIN (SELECT generate_series(13, 18) as age_val) ages
WHERE ss.name = '50m Serbest' AND pt.name = '25m' AND bt.name = 'SEM';
