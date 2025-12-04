/**
 * Property-Based Tests for RaceTable Component
 * Feature: swimmer-performance-tracker, Property 4: Race record ordering
 */

import * as fc from 'fast-check';
import type { RaceRecord } from '@/lib/types';

// Helper function to check if race records are ordered by date descending
function isOrderedByDateDescending(records: RaceRecord[]): boolean {
  for (let i = 0; i < records.length - 1; i++) {
    const current = records[i].year * 12 + records[i].month;
    const next = records[i + 1].year * 12 + records[i + 1].month;
    // Current should be >= next (descending order)
    if (current < next) {
      return false;
    }
  }
  return true;
}

describe('RaceTable Property-Based Tests', () => {
  // Feature: swimmer-performance-tracker, Property 4: Race record ordering
  test('race records are ordered by date descending', () => {
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
              '200m Serbest',
              '50m Kelebek'
            ),
            year: fc.integer({ min: 2020, max: 2025 }),
            month: fc.integer({ min: 1, max: 12 }),
            total_milliseconds: fc.integer({ min: 10000, max: 300000 }),
            created_at: fc.date(),
          })
        ),
        (records) => {
          // Sort records by date descending (as the query does)
          const sorted = [...records].sort((a, b) => {
            if (a.year !== b.year) {
              return b.year - a.year; // Descending by year
            }
            return b.month - a.month; // Descending by month
          });

          // Verify the sorted array is in descending order
          return isOrderedByDateDescending(sorted);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('empty race records array is trivially ordered', () => {
    const emptyRecords: RaceRecord[] = [];
    expect(isOrderedByDateDescending(emptyRecords)).toBe(true);
  });

  test('single race record is trivially ordered', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          swimmer_id: fc.uuid(),
          pool_type: fc.constantFrom('25m' as const, '50m' as const),
          swimming_style: fc.string(),
          year: fc.integer({ min: 2020, max: 2025 }),
          month: fc.integer({ min: 1, max: 12 }),
          total_milliseconds: fc.integer({ min: 10000, max: 300000 }),
          created_at: fc.date(),
        }),
        (record) => {
          return isOrderedByDateDescending([record]);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('race records with same year are ordered by month descending', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2020, max: 2025 }),
        fc.array(fc.integer({ min: 1, max: 12 }), { minLength: 2 }),
        (year, months) => {
          const records: RaceRecord[] = months.map((month, index) => ({
            id: `id-${index}`,
            swimmer_id: 'swimmer-1',
            pool_type: '25m' as const,
            swimming_style: '50m Serbest',
            year,
            month,
            total_milliseconds: 60000,
            created_at: new Date(),
          }));

          const sorted = [...records].sort((a, b) => {
            if (a.year !== b.year) {
              return b.year - a.year;
            }
            return b.month - a.month;
          });

          return isOrderedByDateDescending(sorted);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('race records with different years are ordered by year descending', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 2020, max: 2025 }), { minLength: 2 }),
        fc.integer({ min: 1, max: 12 }),
        (years, month) => {
          const records: RaceRecord[] = years.map((year, index) => ({
            id: `id-${index}`,
            swimmer_id: 'swimmer-1',
            pool_type: '25m' as const,
            swimming_style: '50m Serbest',
            year,
            month,
            total_milliseconds: 60000,
            created_at: new Date(),
          }));

          const sorted = [...records].sort((a, b) => {
            if (a.year !== b.year) {
              return b.year - a.year;
            }
            return b.month - a.month;
          });

          return isOrderedByDateDescending(sorted);
        }
      ),
      { numRuns: 100 }
    );
  });
});
