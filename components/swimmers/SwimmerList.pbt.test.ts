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
import { getAllSwimmers, createSwimmer, deleteSwimmer } from '@/lib/supabase/queries';
import type { Swimmer } from '@/lib/types';

// Feature: swimmer-performance-tracker, Property 13: Swimmer list completeness
// Validates: Requirements 8.1

const describeIfConfigured = isSupabaseConfigured() ? describe : describe.skip;

describeIfConfigured('SwimmerList Completeness Property Tests', () => {
  // Helper to clean up test swimmers
  const cleanupSwimmers = async (swimmerIds: string[]) => {
    for (const id of swimmerIds) {
      await deleteSwimmer(id);
    }
  };

  test('Property 13: Swimmer list completeness - all created swimmers appear in list', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 20 }),
            surname: fc.string({ minLength: 1, maxLength: 20 }),
            age: fc.integer({ min: 1, max: 99 }),
            gender: fc.constantFrom('Erkek' as const, 'Kadın' as const),
          }),
          { minLength: 1, maxLength: 5 } // Test with 1-5 swimmers
        ),
        async (swimmerData) => {
          const createdIds: string[] = [];

          try {
            // Create swimmers
            for (const data of swimmerData) {
              const result = await createSwimmer(data);
              if (result.data) {
                createdIds.push(result.data.id);
              }
            }

            // Get all swimmers
            const listResult = await getAllSwimmers();

            if (!listResult.data) {
              return false;
            }

            // Check that all created swimmers are in the list
            const listIds = listResult.data.map((s: Swimmer) => s.id);
            const allPresent = createdIds.every(id => listIds.includes(id));

            return allPresent;
          } finally {
            // Cleanup
            await cleanupSwimmers(createdIds);
          }
        }
      ),
      { numRuns: 10 } // Reduced runs due to database operations
    );
  });

  test('Property 13: Swimmer list completeness - deleted swimmers do not appear in list', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 20 }),
          surname: fc.string({ minLength: 1, maxLength: 20 }),
          age: fc.integer({ min: 1, max: 99 }),
          gender: fc.constantFrom('Erkek' as const, 'Kadın' as const),
        }),
        async (swimmerData) => {
          let createdId: string | null = null;

          try {
            // Create a swimmer
            const createResult = await createSwimmer(swimmerData);
            if (!createResult.data) {
              return false;
            }
            createdId = createResult.data.id;

            // Verify it's in the list
            const listResult1 = await getAllSwimmers();
            if (!listResult1.data) {
              return false;
            }
            const beforeDelete = listResult1.data.some((s: Swimmer) => s.id === createdId);

            // Delete the swimmer
            await deleteSwimmer(createdId);

            // Verify it's not in the list
            const listResult2 = await getAllSwimmers();
            if (!listResult2.data) {
              return false;
            }
            const afterDelete = listResult2.data.some((s: Swimmer) => s.id === createdId);

            return beforeDelete && !afterDelete;
          } finally {
            // Cleanup (in case deletion failed)
            if (createdId) {
              await deleteSwimmer(createdId);
            }
          }
        }
      ),
      { numRuns: 10 } // Reduced runs due to database operations
    );
  });
});
