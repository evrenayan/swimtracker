import * as fc from 'fast-check';
import { evaluateBarriers, getApplicableBarriers } from './barrierCalculation';
import { BarrierValue } from '../types';

describe('Barrier Calculation Utilities', () => {
  // Feature: swimmer-performance-tracker, Property 10: Barrier evaluation correctness
  describe('Property 10: Barrier evaluation correctness', () => {
    test('barrier achieved when swimmer time is less than or equal to barrier time', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 10000, max: 300000 }), // swimmer time in ms
          fc.integer({ min: 10000, max: 300000 }), // barrier time in ms
          fc.uuid(), // barrier type id
          (swimmerTime, barrierTime, barrierTypeId) => {
            const barriers: BarrierValue[] = [
              {
                id: 'test-barrier-1',
                barrier_type_id: barrierTypeId,
                swimming_style_id: 'style-1',
                pool_type_id: '25m',
                age: 12,
                gender: 'Erkek',
                time_milliseconds: barrierTime,
              },
            ];

            const barrierNames = new Map<string, string>([
              [barrierTypeId, 'B1'],
            ]);

            const evaluations = evaluateBarriers(swimmerTime, barriers, barrierNames);

            // Property: achieved should be true if and only if swimmer time <= barrier time
            return evaluations[0].achieved === (swimmerTime <= barrierTime);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('evaluation includes correct swimmer and barrier times', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 10000, max: 300000 }),
          fc.integer({ min: 10000, max: 300000 }),
          fc.uuid(),
          (swimmerTime, barrierTime, barrierTypeId) => {
            const barriers: BarrierValue[] = [
              {
                id: 'test-barrier-1',
                barrier_type_id: barrierTypeId,
                swimming_style_id: 'style-1',
                pool_type_id: '25m',
                age: 12,
                gender: 'Erkek',
                time_milliseconds: barrierTime,
              },
            ];

            const barrierNames = new Map<string, string>([
              [barrierTypeId, 'A1'],
            ]);

            const evaluations = evaluateBarriers(swimmerTime, barriers, barrierNames);

            return (
              evaluations[0].swimmerTime === swimmerTime &&
              evaluations[0].barrierTime === barrierTime
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: swimmer-performance-tracker, Property 11: Age-based barrier filtering
  describe('Property 11: Age-based barrier filtering', () => {
    test('12-year-old swimmers get all barriers, others only get SEM', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 8, max: 18 }), // age
          fc.constantFrom('Erkek' as const, 'Kadın' as const), // gender
          (age, gender) => {
            const allBarriers: BarrierValue[] = [
              // 12 yaş barriers
              {
                id: 'barrier-b1',
                barrier_type_id: 'b1-id',
                swimming_style_id: 'style-1',
                pool_type_id: 'pool-1',
                age: 12,
                gender,
                time_milliseconds: 50000,
              },
              {
                id: 'barrier-a1',
                barrier_type_id: 'a1-id',
                swimming_style_id: 'style-1',
                pool_type_id: 'pool-1',
                age: 12,
                gender,
                time_milliseconds: 45000,
              },
              // SEM barrier (not age-specific, but marked with different age)
              {
                id: 'barrier-sem',
                barrier_type_id: 'sem-id',
                swimming_style_id: 'style-1',
                pool_type_id: 'pool-1',
                age: 0, // SEM barriers use age 0 or similar to indicate "all ages"
                gender,
                time_milliseconds: 40000,
              },
            ];

            const applicable = getApplicableBarriers(
              age,
              gender,
              'pool-1',
              'style-1',
              allBarriers
            );

            if (age === 12) {
              // 12-year-olds should get all barriers (including age 12 barriers)
              return applicable.length >= 2; // At least the two age-12 barriers
            } else {
              // Others should only get non-age-12 barriers (SEM)
              const hasAge12Barriers = applicable.some((b) => b.age === 12);
              return !hasAge12Barriers;
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    test('barriers are filtered by gender, pool type, and swimming style', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('Erkek' as const, 'Kadın' as const),
          fc.constantFrom('25m' as const, '50m' as const),
          fc.string({ minLength: 1, maxLength: 20 }),
          (gender, poolType, swimmingStyle) => {
            const allBarriers: BarrierValue[] = [
              {
                id: 'matching-barrier',
                barrier_type_id: 'b1-id',
                swimming_style_id: swimmingStyle,
                pool_type_id: poolType,
                age: 12,
                gender,
                time_milliseconds: 50000,
              },
              {
                id: 'wrong-gender',
                barrier_type_id: 'b2-id',
                swimming_style_id: swimmingStyle,
                pool_type_id: poolType,
                age: 12,
                gender: gender === 'Erkek' ? 'Kadın' : 'Erkek',
                time_milliseconds: 50000,
              },
              {
                id: 'wrong-pool',
                barrier_type_id: 'a1-id',
                swimming_style_id: swimmingStyle,
                pool_type_id: poolType === '25m' ? '50m' : '25m',
                age: 12,
                gender,
                time_milliseconds: 50000,
              },
            ];

            const applicable = getApplicableBarriers(
              12,
              gender,
              poolType,
              swimmingStyle,
              allBarriers
            );

            // Should only get the matching barrier
            return (
              applicable.length === 1 &&
              applicable[0].id === 'matching-barrier'
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
