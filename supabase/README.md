# Supabase Database Setup

This directory contains SQL migration files for setting up the Swimmer Performance Tracker database schema.

## Migration Files

1. **001_create_tables.sql** - Creates all database tables and indexes
   - swimmers
   - race_records
   - pool_types
   - swimming_styles
   - barrier_types
   - barrier_values

2. **002_seed_reference_data.sql** - Seeds reference data
   - Pool types (25m, 50m)
   - Swimming styles (all 16 styles)
   - Barrier types (B1, B2, A1, A2, A3, A4, SEM)

3. **003_seed_barrier_values.sql** - Seeds sample barrier values for testing
   - Sample data for 50m and 100m Serbest
   - Both 25m and 50m pool types
   - Male and female categories
   - Ages 12-18 for SEM barriers

4. **004_setup_rls.sql** - Sets up Row Level Security policies
   - Enables RLS on all tables
   - Creates policies for authenticated users
   - Reference tables are read-only

## How to Apply Migrations

### Option 1: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Initialize Supabase (if not already done)
supabase init

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each migration file in order (001, 002, 003, 004)
4. Execute each file

### Option 3: Manual Execution

If you have direct database access:

```bash
# Execute each migration in order
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/001_create_tables.sql
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/002_seed_reference_data.sql
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/003_seed_barrier_values.sql
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/004_setup_rls.sql
```

## Database Schema Overview

### Tables

- **swimmers**: Stores swimmer information (name, surname, age, gender)
- **race_records**: Stores race times for swimmers
- **pool_types**: Reference table for pool types (25m, 50m)
- **swimming_styles**: Reference table for swimming styles
- **barrier_types**: Reference table for barrier categories
- **barrier_values**: Stores barrier time values for different combinations

### Indexes

- `idx_race_records_swimmer_id`: Optimizes queries by swimmer
- `idx_race_records_date`: Optimizes date-based sorting
- `idx_barrier_values_lookup`: Optimizes barrier lookups

## Row Level Security

All tables have RLS enabled. Authenticated users have full CRUD access to swimmers and race_records. Reference tables (pool_types, swimming_styles, barrier_types, barrier_values) are read-only for authenticated users.

## Notes

- All times are stored in milliseconds for precision
- The barrier_values table includes sample data for testing purposes
- You may need to add more barrier values for production use
- The SEM barrier is available for all ages, while other barriers (B1-A4) are only for 12-year-olds
