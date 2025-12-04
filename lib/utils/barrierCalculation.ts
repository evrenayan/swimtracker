import { BarrierValue, BarrierEvaluation } from '../types';

/**
 * Get applicable barriers for a swimmer based on age, gender, pool type, and swimming style
 * @param age - Swimmer's age
 * @param gender - Swimmer's gender ('Erkek' or 'Kadın')
 * @param poolType - Pool type ('25m' or '50m')
 * @param swimmingStyle - Swimming style name
 * @param allBarriers - All available barrier values from database
 * @returns Array of applicable barrier values
 */
export function getApplicableBarriers(
  age: number,
  gender: 'Erkek' | 'Kadın',
  poolType: string,
  swimmingStyle: string,
  allBarriers: BarrierValue[]
): BarrierValue[] {
  return allBarriers.filter((barrier) => {
    // Match gender, pool type, and swimming style
    const matchesGender = barrier.gender === gender;
    const matchesPoolType = barrier.pool_type_id === poolType;
    const matchesStyle = barrier.swimming_style_id === swimmingStyle;

    // Age-based filtering: strict match
    const matchesAge = barrier.age === age;

    return matchesGender && matchesPoolType && matchesStyle && matchesAge;
  });
}

/**
 * Evaluate which barriers a swimmer has achieved
 * @param swimmerTime - Swimmer's best time in milliseconds
 * @param barriers - Applicable barrier values
 * @param barrierNames - Map of barrier type IDs to barrier names
 * @returns Array of barrier evaluation results
 */
export function evaluateBarriers(
  swimmerTime: number,
  barriers: BarrierValue[],
  barrierNames: Map<string, string>
): BarrierEvaluation[] {
  return barriers.map((barrier) => {
    const barrierName = barrierNames.get(barrier.barrier_type_id) || 'Unknown';
    const achieved = swimmerTime <= barrier.time_milliseconds;

    return {
      barrierName,
      achieved,
      swimmerTime,
      barrierTime: barrier.time_milliseconds,
    };
  });
}
