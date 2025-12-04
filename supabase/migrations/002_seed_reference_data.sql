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
