'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartDataPoint } from '@/lib/types';
import { formatTime } from '@/lib/utils/timeFormat';

interface PerformanceChartProps {
  data: ChartDataPoint[];
  swimmingStyle: string;
}

export default function PerformanceChart({
  data,
  swimmingStyle,
}: PerformanceChartProps) {
  // Handle empty data state
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-pink-50 rounded-lg border border-pink-200">
        <p className="text-pink-600">
          Bu stil için henüz yarış kaydı bulunmamaktadır.
        </p>
      </div>
    );
  }

  // Convert milliseconds to seconds for Y-axis display
  const chartData = data.map((point) => ({
    ...point,
    timeInSeconds: point.time / 1000,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
          <XAxis
            dataKey="date"
            stroke="#ec4899"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#ec4899"
            style={{ fontSize: '12px' }}
            label={{
              value: 'Süre (saniye)',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#ec4899' },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fdf2f8',
              border: '1px solid #f9a8d4',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#831843' }}
            formatter={(value: number) => [
              formatTime(value * 1000), // Convert seconds back to milliseconds for formatTime
              'Süre',
            ]}
          />
          <Line
            type="monotone"
            dataKey="timeInSeconds"
            stroke="#ec4899"
            strokeWidth={2}
            dot={{ fill: '#ec4899', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
