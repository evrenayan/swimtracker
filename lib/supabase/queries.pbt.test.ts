/**
 * Property-Based Tests for Supabase Queries
 * 
 * These tests validate the correctness properties defined in the design document.
 * They require a working Supabase database connection with the proper schema.
 * 
 * To run these tests, ensure:
 * 1. NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
 * 2. The database schema is properly set up
 * 3. You have a test database (not production!)
 */

// Check if Supabase is configured before importing
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key && url !== 'https://test.supabase.co' && key !== 'test-anon-key';
};

// Set up mock environment variables if not configured
if (!isSupabaseConfigured()) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
}

import * as fc from 'fast-check';
import {
  createSwimmer,
  getSwimmer,
  deleteSwimmer,
  createRaceRecord,
  getRaceRecordsBySwimmer,
  updateRaceRecord,
  getRaceRecord,
  deleteRaceRecord,
} from './queries';

const describeIfConfigured = isSupabaseConfigured() ? describe : describe.skip;

describeIfConfigured('Supabase Query Property-Based Tests', () => {
  // Arbitraries for generating test data
  const swimmerArbitrary = fc.record({
    name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
    surname: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
    age: fc.integer({ min: 5, max: 99 }),
    gender: fc.constantFrom('Erkek' as const, 'Kadın' as const),
  });

  const raceRecordArbitrary = (swimmerId: string) =>
    fc.record({
      swimmer_id: fc.constant(swimmerId),
      pool_type: fc.constantFrom('25m' as const, '50m' as const),
      swimming_style: fc.constantFrom(
        '50m Serbest',
        '100m Serbest',
        '200m Serbest',
        '50m Sırtüstü',
        '100m Kelebek'
      ),
      month: fc.integer({ min: 1, max: 12 }),
      year: fc.integer({ min: 2020, max: 2025 }),
      total_milliseconds: fc.integer({ min: 10000, max: 300000 }),
    });

  describe('Property 2: Swimmer data persistence', () => {
    // Feature: swimmer-performance-tracker, Property 2: Swimmer data persistence
    test('for any valid swimmer data, after creating a swimmer, querying should return the same data', async () => {
      await fc.assert(
        fc.asyncProperty(swimmerArbitrary, async (swimmerData) => {
          // Create swimmer
          const createResult = await createSwimmer(swimmerData);
          
          if (createResult.error || !createResult.data) {
            throw new Error(`Failed to create swimmer: ${createResult.error?.message}`);
          }

          const createdSwimmer = createResult.data;

          try {
            // Query the swimmer back
            const getResult = await getSwimmer(createdSwimmer.id);

            if (getResult.error || !getResult.data) {
              throw new Error(`Failed to get swimmer: ${getResult.error?.message}`);
            }

            const retrievedSwimmer = getResult.data;

            // Verify all fields match
            expect(retrievedSwimmer.name).toBe(swimmerData.name);
            expect(retrievedSwimmer.surname).toBe(swimmerData.surname);
            expect(retrievedSwimmer.age).toBe(swimmerData.age);
            expect(retrievedSwimmer.gender).toBe(swimmerData.gender);
            expect(retrievedSwimmer.id).toBe(createdSwimmer.id);
          } finally {
            // Cleanup: delete the swimmer
            await deleteSwimmer(createdSwimmer.id);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 3: Race record association', () => {
    // Feature: swimmer-performance-tracker, Property 3: Race record association
    test('for any race record created for a swimmer, it should be retrievable by swimmer ID', async () => {
      await fc.assert(
        fc.asyncProperty(
          swimmerArbitrary,
          fc.integer({ min: 1, max: 5 }),
          async (swimmerData, numRecords) => {
            // Create a swimmer first
            const swimmerResult = await createSwimmer(swimmerData);
            if (swimmerResult.error || !swimmerResult.data) {
              throw new Error(`Failed to create swimmer: ${swimmerResult.error?.message}`);
            }

            const swimmer = swimmerResult.data;

            try {
              // Create multiple race records
              const createdRecordIds: string[] = [];
              
              for (let i = 0; i < numRecords; i++) {
                const recordData = await fc.sample(raceRecordArbitrary(swimmer.id), 1);
                const recordResult = await createRaceRecord(recordData[0]);
                
                if (recordResult.error || !recordResult.data) {
                  throw new Error(`Failed to create race record: ${recordResult.error?.message}`);
                }
                
                createdRecordIds.push(recordResult.data.id);
              }

              // Query all race records for this swimmer
              const recordsResult = await getRaceRecordsBySwimmer(swimmer.id);

              if (recordsResult.error || !recordsResult.data) {
                throw new Error(`Failed to get race records: ${recordsResult.error?.message}`);
              }

              const retrievedRecords = recordsResult.data;

              // Verify all created records are retrievable
              expect(retrievedRecords.length).toBeGreaterThanOrEqual(numRecords);
              
              for (const recordId of createdRecordIds) {
                const found = retrievedRecords.some(r => r.id === recordId);
                expect(found).toBe(true);
              }

              // Verify all retrieved records belong to this swimmer
              for (const record of retrievedRecords) {
                expect(record.swimmer_id).toBe(swimmer.id);
              }
            } finally {
              // Cleanup: delete the swimmer (cascade will delete records)
              await deleteSwimmer(swimmer.id);
            }
          }
        ),
        { numRuns: 50 } // Fewer runs since this creates multiple records
      );
    });
  });

  describe('Property 6: Race record update preservation', () => {
    // Feature: swimmer-performance-tracker, Property 6: Race record update preservation
    test('for any race record, after updating, the updated values should be retrievable while preserving ID and swimmer association', async () => {
      await fc.assert(
        fc.asyncProperty(
          swimmerArbitrary,
          fc.integer({ min: 10000, max: 300000 }),
          fc.integer({ min: 10000, max: 300000 }),
          async (swimmerData, originalTime, updatedTime) => {
            // Create a swimmer
            const swimmerResult = await createSwimmer(swimmerData);
            if (swimmerResult.error || !swimmerResult.data) {
              throw new Error(`Failed to create swimmer: ${swimmerResult.error?.message}`);
            }

            const swimmer = swimmerResult.data;

            try {
              // Create a race record
              const recordData = await fc.sample(raceRecordArbitrary(swimmer.id), 1);
              recordData[0].total_milliseconds = originalTime;
              
              const createRecordResult = await createRaceRecord(recordData[0]);
              if (createRecordResult.error || !createRecordResult.data) {
                throw new Error(`Failed to create race record: ${createRecordResult.error?.message}`);
              }

              const originalRecord = createRecordResult.data;

              // Update the race record
              const updateResult = await updateRaceRecord(originalRecord.id, {
                total_milliseconds: updatedTime,
              });

              if (updateResult.error || !updateResult.data) {
                throw new Error(`Failed to update race record: ${updateResult.error?.message}`);
              }

              // Query the record back
              const getResult = await getRaceRecord(originalRecord.id);

              if (getResult.error || !getResult.data) {
                throw new Error(`Failed to get race record: ${getResult.error?.message}`);
              }

              const updatedRecord = getResult.data;

              // Verify the update
              expect(updatedRecord.total_milliseconds).toBe(updatedTime);
              
              // Verify ID and swimmer association are preserved
              expect(updatedRecord.id).toBe(originalRecord.id);
              expect(updatedRecord.swimmer_id).toBe(swimmer.id);
            } finally {
              // Cleanup
              await deleteSwimmer(swimmer.id);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 7: Race record deletion', () => {
    // Feature: swimmer-performance-tracker, Property 7: Race record deletion
    test('for any race record, after deletion, querying should not return that record', async () => {
      await fc.assert(
        fc.asyncProperty(swimmerArbitrary, async (swimmerData) => {
          // Create a swimmer
          const swimmerResult = await createSwimmer(swimmerData);
          if (swimmerResult.error || !swimmerResult.data) {
            throw new Error(`Failed to create swimmer: ${swimmerResult.error?.message}`);
          }

          const swimmer = swimmerResult.data;

          try {
            // Create a race record
            const recordData = await fc.sample(raceRecordArbitrary(swimmer.id), 1);
            const createRecordResult = await createRaceRecord(recordData[0]);
            
            if (createRecordResult.error || !createRecordResult.data) {
              throw new Error(`Failed to create race record: ${createRecordResult.error?.message}`);
            }

            const record = createRecordResult.data;

            // Delete the race record
            const deleteResult = await deleteRaceRecord(record.id);

            if (deleteResult.error) {
              throw new Error(`Failed to delete race record: ${deleteResult.error.message}`);
            }

            // Try to query the record
            const getResult = await getRaceRecord(record.id);

            // The record should not be found (error expected)
            expect(getResult.data).toBeNull();
            expect(getResult.error).not.toBeNull();
          } finally {
            // Cleanup
            await deleteSwimmer(swimmer.id);
          }
        }),
        { numRuns: 100 }
      );
    });
  });
});
