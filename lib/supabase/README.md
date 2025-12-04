# Supabase Client and Queries

This directory contains the Supabase client configuration and all database query functions for the Swimmer Performance Tracker application.

## Files

- `client.ts` - Supabase client configuration
- `queries.ts` - All database query functions with error handling

## Setup

Ensure you have the following environment variables set in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Usage

### Importing

```typescript
import {
  createSwimmer,
  getAllSwimmers,
  createRaceRecord,
  getRaceRecordsBySwimmer,
  getAllPoolTypes,
  // ... other functions
} from '@/lib/supabase/queries';
```

### Error Handling

All query functions return a `QueryResult<T>` object with the following structure:

```typescript
interface QueryResult<T> {
  data: T | null;
  error: Error | null;
}
```

Example usage:

```typescript
const { data, error } = await createSwimmer({
  name: 'John',
  surname: 'Doe',
  age: 15,
  gender: 'Erkek',
});

if (error) {
  console.error('Failed to create swimmer:', error.message);
  return;
}

console.log('Created swimmer:', data);
```

## Available Functions

### Swimmer Queries

- `createSwimmer(swimmer)` - Create a new swimmer
- `getSwimmer(id)` - Get a swimmer by ID
- `getAllSwimmers()` - Get all swimmers
- `updateSwimmer(id, updates)` - Update a swimmer
- `deleteSwimmer(id)` - Delete a swimmer

### Race Record Queries

- `createRaceRecord(record)` - Create a new race record
- `getRaceRecord(id)` - Get a race record by ID
- `getRaceRecordsBySwimmer(swimmerId)` - Get all race records for a swimmer (sorted by date descending)
- `getRaceRecordsBySwimmerAndStyle(swimmerId, poolType, swimmingStyle)` - Get race records filtered by style (sorted chronologically)
- `updateRaceRecord(id, updates)` - Update a race record
- `deleteRaceRecord(id)` - Delete a race record

### Reference Data Queries

- `getAllPoolTypes()` - Get all pool types (25m, 50m)
- `getAllSwimmingStyles()` - Get all swimming styles
- `getAllBarrierTypes()` - Get all barrier types (B1, B2, A1, A2, A3, A4, SEM)
- `getBarrierValues(age, gender, poolTypeId, swimmingStyleId)` - Get barrier values for specific criteria
- `getAllBarrierValues()` - Get all barrier values

### Helper Queries

- `getBestTimeForStyle(swimmerId, poolType, swimmingStyle)` - Get the best time for a specific style
- `getSwimmerWithRaceCount(id)` - Get a swimmer with their total race count

## Requirements Validation

This implementation satisfies the following requirements:

- **2.2**: Swimmer data persistence (create, read, update, delete)
- **3.2**: Race record association with swimmers
- **4.2**: Race record updates
- **4.3**: Race record deletion
- **6.1**: Pool types loading
- **6.2**: Swimming styles loading
- **6.3**: Barrier types loading
- **6.4**: Barrier values loading
