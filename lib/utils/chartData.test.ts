import * as fc from 'fast-check';
import { prepareChartData, calculateTimeDifferences } from './chartData';
import { RaceRecord } from '../types';

describe('Chart Data Utilities', () => {
  // Feature: swimmer-performance-tracker, Property 8: Chart data chronological ordering
  describe('Property 8: Chart data chronological ordering', () => {
    test('race records are ordered chronologically from oldest to newest', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              swimmer_id: fc.uuid(),
              pool_type: fc.constantFrom('25m' as const, '50m' as const),
              swimming_style: fc.string({ minLength: 1, maxLength: 20 }),
              month: fc.integer({ min: 1, max: 12 }),
              year: fc.integer({ min: 2020, max: 2025 }),
              total_milliseconds: fc.integer({ min: 10000, max: 300000 }),
              created_at: fc.date(),
            }),
            { minLength: 0, maxLength: 20 }
          ),
          (records) => {
            const chartData = prepareChartData(records);

            // Verify chronological ordering (oldest to newest)
            for (let i = 0; i < chartData.length - 1; i++) {
              const [month1, year1] = chartData[i].date.split('/').map(Number);
              const [month2, year2] = chartData[i + 1].date.split('/').map(Number);

              const date1 = year1 * 12 + month1;
              const date2 = year2 * 12 + month2;

              // Each subsequent date should be >= previous date
              if (date1 > date2) {
                return false;
              }
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('chart data preserves all race records', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              swimmer_id: fc.uuid(),
              pool_type: fc.constantFrom('25m' as const, '50m' as const),
              swimming_style: fc.string({ minLength: 1, maxLength: 20 }),
              month: fc.integer({ min: 1, max: 12 }),
              year: fc.integer({ min: 2020, max: 2025 }),
              total_milliseconds: fc.integer({ min: 10000, max: 300000 }),
              created_at: fc.date(),
            }),
            { minLength: 0, maxLength: 20 }
          ),
          (records) => {
            const chartData = prepareChartData(records);

            // Should have same number of data points as records
            return chartData.length === records.length;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: swimmer-performance-tracker, Property 9: Time difference calculation
  describe('Property 9: Time difference calculation', () => {
    test('time difference equals current time minus previous time', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              swimmer_id: fc.uuid(),
              pool_type: fc.constantFrom('25m' as const, '50m' as const),
              swimming_style: fc.string({ minLength: 1, maxLength: 20 }),
              month: fc.integer({ min: 1, max: 12 }),
              year: fc.integer({ min: 2020, max: 2025 }),
              total_milliseconds: fc.integer({ min: 10000, max: 300000 }),
              created_at: fc.date(),
            }),
            { minLength: 2, maxLength: 20 } // Need at least 2 records for differences
          ),
          (records) => {
            const chartData = prepareChartData(records);
            const dataWithDifferences = calculateTimeDifferences(chartData);

            // First record should have no difference
            if (dataWithDifferences.length > 0 && dataWithDifferences[0].difference !== undefined) {
              return false;
            }

            // Check all subsequent records
            for (let i = 1; i < dataWithDifferences.length; i++) {
              const expectedDifference = dataWithDifferences[i].time - dataWithDifferences[i - 1].time;
              const actualDifference = dataWithDifferences[i].difference;

              if (actualDifference !== expectedDifference) {
                return false;
              }
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('negative difference indicates improvement (faster time)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 10000, max: 300000 }),
          fc.integer({ min: 10000, max: 300000 }),
          (time1, time2) => {
            const chartData = [
              { date: '1/2024', time: time1, formattedTime: '00:10:000' },
              { date: '2/2024', time: time2, formattedTime: '00:09:000' },
            ];

            const dataWithDifferences = calculateTimeDifferences(chartData);

            const difference = dataWithDifferences[1].difference!;
            const isImprovement = time2 < time1;

            // Negative difference should mean improvement (time2 < time1)
            return (difference < 0) === isImprovement;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('positive difference indicates slower time', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 10000, max: 300000 }),
          fc.integer({ min: 10000, max: 300000 }),
          (time1, time2) => {
            const chartData = [
              { date: '1/2024', time: time1, formattedTime: '00:10:000' },
              { date: '2/2024', time: time2, formattedTime: '00:11:000' },
            ];

            const dataWithDifferences = calculateTimeDifferences(chartData);

            const difference = dataWithDifferences[1].difference!;
            const isSlower = time2 > time1;

            // Positive difference should mean slower (time2 > time1)
            return (difference > 0) === isSlower;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
