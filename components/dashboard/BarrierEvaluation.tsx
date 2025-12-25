'use client';

import React, { useEffect, useState } from 'react';
import { BarrierEvaluation as BarrierEvaluationType } from '@/lib/types';
import { formatTime } from '@/lib/utils/timeFormat';
import { evaluateBarriers, getApplicableBarriers } from '@/lib/utils/barrierCalculation';
import {
  getAllBarrierValues,
  getAllBarrierTypes,
  getBestTimeForStyle,
  getAllPoolTypes,
  getAllSwimmingStyles,
} from '@/lib/supabase/queries';
import { logger } from '@/lib/logger';

interface BarrierEvaluationProps {
  swimmerId: string;
  age: number;
  gender: 'Erkek' | 'Kadın';
  poolType: '25m' | '50m';
  swimmingStyle: string;
}

export default function BarrierEvaluation({
  swimmerId,
  age,
  gender,
  poolType,
  swimmingStyle,
}: BarrierEvaluationProps) {
  const [evaluations, setEvaluations] = useState<BarrierEvaluationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasRaces, setHasRaces] = useState(true);

  useEffect(() => {
    async function fetchAndEvaluate() {
      setLoading(true);

      try {
        // Get best time for this style
        const bestTimeResult = await getBestTimeForStyle(
          swimmerId,
          poolType,
          swimmingStyle
        );

        if (bestTimeResult.error || !bestTimeResult.data) {
          setHasRaces(false);
          setLoading(false);
          return;
        }

        const bestTime = bestTimeResult.data.total_milliseconds;

        // Get all barrier values and types, plus pool types and styles for ID lookup
        const [barriersResult, typesResult, poolTypesResult, stylesResult] = await Promise.all([
          getAllBarrierValues(),
          getAllBarrierTypes(),
          getAllPoolTypes(),
          getAllSwimmingStyles(),
        ]);

        if (barriersResult.error || typesResult.error || poolTypesResult.error || stylesResult.error) {
          logger.error('barrier_data_fetch_error', {
            error: barriersResult.error || typesResult.error || poolTypesResult.error || stylesResult.error
          });
          setLoading(false);
          return;
        }

        const allBarriers = barriersResult.data || [];
        const barrierTypes = typesResult.data || [];
        const poolTypes = poolTypesResult.data || [];
        const swimmingStyles = stylesResult.data || [];

        // Find IDs for current pool type and swimming style
        const currentPoolType = poolTypes.find(pt => pt.name === poolType);
        const currentStyle = swimmingStyles.find(s => s.name === swimmingStyle);

        if (!currentPoolType || !currentStyle) {
          logger.error('barrier_eval_missing_types', { poolType, swimmingStyle });
          setEvaluations([]);
          setLoading(false);
          return;
        }

        // Create map of barrier type IDs to names
        const barrierNames = new Map(
          barrierTypes.map((type) => [type.id, type.name])
        );

        // Get applicable barriers for this swimmer using IDs
        const applicableBarriers = getApplicableBarriers(
          age,
          gender,
          currentPoolType.id,
          currentStyle.id,
          allBarriers
        );

        // Evaluate barriers
        const results = evaluateBarriers(bestTime, applicableBarriers, barrierNames);

        // Sort by barrier name (B1, B2, A1, A2, A3, A4, SEM)
        const sortOrder = ['B1', 'B2', 'A1', 'A2', 'A3', 'A4', 'SEM'];
        results.sort((a, b) => {
          const indexA = sortOrder.indexOf(a.barrierName);
          const indexB = sortOrder.indexOf(b.barrierName);
          return indexA - indexB;
        });

        setEvaluations(results);
        setHasRaces(true);
      } catch (error) {
        logger.error('barrier_eval_error', { error });
      } finally {
        setLoading(false);
      }
    }

    fetchAndEvaluate();
  }, [swimmerId, age, gender, poolType, swimmingStyle]);

  const isMale = gender === 'Erkek';
  const colorClasses = {
    bg: isMale ? 'bg-blue-50' : 'bg-pink-50',
    border: isMale ? 'border-blue-200' : 'border-pink-200',
    text: isMale ? 'text-blue-600' : 'text-pink-600',
    textDark: isMale ? 'text-blue-900' : 'text-pink-900',
    textMedium: isMale ? 'text-blue-700' : 'text-pink-700',
  };

  if (loading) {
    return (
      <div className={`mt-4 p-4 ${colorClasses.bg} rounded-lg border ${colorClasses.border}`}>
        <p className={`${colorClasses.text} text-sm`}>Barajlar yükleniyor...</p>
      </div>
    );
  }

  if (!hasRaces) {
    return (
      <div className={`mt-4 p-4 ${colorClasses.bg} rounded-lg border ${colorClasses.border}`}>
        <p className={`${colorClasses.text} text-sm`}>
          Bu stil için yarış kaydı bulunmadığından baraj değerlendirmesi yapılamıyor.
        </p>
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div className={`mt-4 p-4 ${colorClasses.bg} rounded-lg border ${colorClasses.border}`}>
        <p className={`${colorClasses.text} text-sm`}>
          {age} yaş grubu için bu stilde baraj değeri tanımlanmamış.
        </p>
      </div>
    );
  }

  return (
    <div className={`mt-4 p-4 ${colorClasses.bg} rounded-lg border ${colorClasses.border}`}>
      <h4 className={`text-sm font-semibold ${colorClasses.textDark} mb-3`}>
        Baraj Değerlendirmesi
      </h4>
      <div className="space-y-2">
        {evaluations.map((evaluation, index) => (
          <div
            key={`${evaluation.barrierName}-${index}`}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-3">
              <span className={`${colorClasses.textMedium} font-medium min-w-[60px]`}>
                {evaluation.barrierName}
              </span>
              <span className={`${colorClasses.text} text-xs`}>
                (Baraj: {formatTime(evaluation.barrierTime)})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${evaluation.achieved
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
                  }`}
              >
                {evaluation.achieved ? '✓ Geçti' : '✗ Geçemedi'}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={`mt-3 pt-3 border-t ${colorClasses.border}`}>
        <p className={`text-xs ${colorClasses.text}`}>
          En İyi Süre: {formatTime(evaluations[0]?.swimmerTime || 0)}
        </p>
      </div>
    </div>
  );
}
