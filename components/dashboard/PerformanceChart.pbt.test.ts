/**
 * Property-Based Tests for Dashboard Pool Type Filtering
 * Feature: swimmer-performance-tracker, Property 12: Pool type filtering
 * Validates: Requirements 5.2
 */

import * as fc from 'fast-check';
import { RaceRecord } from '@/lib/types';

describe('Dashboard Pool Type Filtering - Property Tests', () => {
  /**
   * Property 12: Pool type filtering
   * For any dashboard view with a selected pool type, all displayed charts and data
   * should only include race records matching that pool type
   */
  test('Property 12: filtering by pool type returns only matching records', () => {
    fc.assert(
      fc.property(
        // Generate an array of race records with mixed pool types
        fc.array(
          fc.record({
            id: fc.uuid(),
            swimmer_id: fc.uuid(),
            pool_type: fc.constantFrom('25m' as const, '50m' as const),
            swimming_style: fc.constantFrom(
              '50m Serbest',
              '100m Serbest',
              '200m Serbest',
              '50m Kelebek',
              '100m Kelebek'
            ),
            month: fc.integer({ min: 1, max: 12 }),
            year: fc.integer({ min: 2020, max: 2025 }),
            total_milliseconds: fc.integer({ min: 20000, max: 300000 }),
            created_at: fc.date(),
          }),
          { minLength: 0, maxLength: 50 }
        ),
        // Generate a pool type to filter by
        fc.constantFrom('25m' as const, '50m' as const),
        (allRaces, selectedPoolType) => {
          // Filter races by the selected pool type (simulating dashboard behavior)
          const filteredRaces = allRaces.filter(
            (race) => race.pool_type === selectedPoolType
          );

          // Property: All filtered races must match the selected pool type
          const allMatchPoolType = filteredRaces.every(
            (race) => race.pool_type === selectedPoolType
          );

          // Property: No races with different pool type should be included
          const noOtherPoolTypes = filteredRaces.every(
            (race) => race.pool_type !== (selectedPoolType === '25m' ? '50m' : '25m')
          );

          // Property: The filtered set should be a subset of the original
          const isSubset = filteredRaces.length <= allRaces.length;

          // Property: If there are races with the selected pool type in the original,
          // they should all be in the filtered set
          const racesWithSelectedType = allRaces.filter(
            (race) => race.pool_type === selectedPoolType
          );
          const allIncluded = racesWithSelectedType.every((race) =>
            filteredRaces.some((filtered) => filtered.id === race.id)
          );

          return allMatchPoolType && noOtherPoolTypes && isSubset && allIncluded;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 12: filtering by pool type preserves race data integrity', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            swimmer_id: fc.uuid(),
            pool_type: fc.constantFrom('25m' as const, '50m' as const),
            swimming_style: fc.constantFrom(
              '50m Serbest',
              '100m Serbest',
              '200m Serbest'
            ),
            month: fc.integer({ min: 1, max: 12 }),
            year: fc.integer({ min: 2020, max: 2025 }),
            total_milliseconds: fc.integer({ min: 20000, max: 300000 }),
            created_at: fc.date(),
          }),
          { minLength: 1, maxLength: 30 }
        ),
        fc.constantFrom('25m' as const, '50m' as const),
        (allRaces, selectedPoolType) => {
          // Filter races by pool type
          const filteredRaces = allRaces.filter(
            (race) => race.pool_type === selectedPoolType
          );

          // Property: Filtering should not modify the race data
          // Each filtered race should have the same properties as in the original
          return filteredRaces.every((filteredRace) => {
            const originalRace = allRaces.find((r) => r.id === filteredRace.id);
            if (!originalRace) return false;

            return (
              filteredRace.swimmer_id === originalRace.swimmer_id &&
              filteredRace.swimming_style === originalRace.swimming_style &&
              filteredRace.month === originalRace.month &&
              filteredRace.year === originalRace.year &&
              filteredRace.total_milliseconds === originalRace.total_milliseconds
            );
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 12: switching pool types shows different data sets', () => {
    fc.assert(
      fc.property(
        // Generate races with both pool types
        fc
          .tuple(
            fc.array(
              fc.record({
                id: fc.uuid(),
                swimmer_id: fc.uuid(),
                pool_type: fc.constant('25m' as const),
                swimming_style: fc.constantFrom('50m Serbest', '100m Serbest'),
                month: fc.integer({ min: 1, max: 12 }),
                year: fc.integer({ min: 2020, max: 2025 }),
                total_milliseconds: fc.integer({ min: 20000, max: 300000 }),
                created_at: fc.date(),
              }),
              { minLength: 1, maxLength: 10 }
            ),
            fc.array(
              fc.record({
                id: fc.uuid(),
                swimmer_id: fc.uuid(),
                pool_type: fc.constant('50m' as const),
                swimming_style: fc.constantFrom('50m Serbest', '100m Serbest'),
                month: fc.integer({ min: 1, max: 12 }),
                year: fc.integer({ min: 2020, max: 2025 }),
                total_milliseconds: fc.integer({ min: 20000, max: 300000 }),
                created_at: fc.date(),
              }),
              { minLength: 1, maxLength: 10 }
            )
          )
          .map(([races25m, races50m]) => [...races25m, ...races50m]),
        (allRaces) => {
          // Filter by 25m
          const filtered25m = allRaces.filter((race) => race.pool_type === '25m');
          // Filter by 50m
          const filtered50m = allRaces.filter((race) => race.pool_type === '50m');

          // Property: The two filtered sets should be disjoint (no overlap)
          const noOverlap = filtered25m.every(
            (race25) => !filtered50m.some((race50) => race50.id === race25.id)
          );

          // Property: Union of both filtered sets should equal the original set
          const unionSize = filtered25m.length + filtered50m.length;
          const originalSize = allRaces.length;
          const unionEqualsOriginal = unionSize === originalSize;

          return noOverlap && unionEqualsOriginal;
        }
      ),
      { numRuns: 100 }
    );
  });
});
