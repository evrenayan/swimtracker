'use client';

import React from 'react';
import { ChartDataPoint } from '@/lib/types';
import { formatTime } from '@/lib/utils/timeFormat';

interface ChartLegendProps {
  data: ChartDataPoint[];
}

export default function ChartLegend({ data }: ChartLegendProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Order from newest to oldest (reverse chronological)
  const orderedData = [...data].reverse();

  return (
    <div className="mt-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
      <h4 className="text-sm font-semibold text-pink-900 mb-3">
        Yarış Geçmişi
      </h4>
      <div className="space-y-2">
        {orderedData.map((point, index) => {
          const hasDifference = point.difference !== undefined;
          const isImprovement = hasDifference && point.difference! < 0;
          const isSlower = hasDifference && point.difference! > 0;

          return (
            <div
              key={`${point.date}-${index}`}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-pink-700 font-medium min-w-[80px]">
                  {point.date}
                </span>
                <span className="text-pink-900 font-mono">
                  {point.formattedTime}
                </span>
              </div>
              {hasDifference && (
                <span
                  className={`font-medium ${
                    isImprovement
                      ? 'text-green-600'
                      : isSlower
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {isImprovement ? '-' : '+'}
                  {formatTime(Math.abs(point.difference!))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
