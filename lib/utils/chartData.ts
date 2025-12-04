import { RaceRecord, ChartDataPoint } from '../types';
import { formatTime } from './timeFormat';

/**
 * Prepare race records for chart display
 * Sorts records chronologically (oldest to newest) and formats data
 * @param records - Array of race records
 * @returns Array of chart data points sorted chronologically
 */
export function prepareChartData(records: RaceRecord[]): ChartDataPoint[] {
  // Sort records chronologically (oldest to newest)
  const sortedRecords = [...records].sort((a, b) => {
    const dateA = a.year * 12 + a.month;
    const dateB = b.year * 12 + b.month;
    return dateA - dateB;
  });

  // Convert to chart data points
  return sortedRecords.map((record) => ({
    date: `${record.month}/${record.year}`,
    time: record.total_milliseconds,
    formattedTime: formatTime(record.total_milliseconds),
  }));
}

/**
 * Calculate time differences between consecutive races
 * Adds difference field to each data point (except the first)
 * Negative difference = improvement (faster), Positive = slower
 * @param data - Array of chart data points (should be chronologically sorted)
 * @returns Array of chart data points with difference calculations
 */
export function calculateTimeDifferences(
  data: ChartDataPoint[]
): ChartDataPoint[] {
  if (data.length === 0) {
    return [];
  }

  return data.map((point, index) => {
    if (index === 0) {
      // First race has no previous race to compare
      return { ...point };
    }

    const previousTime = data[index - 1].time;
    const currentTime = point.time;
    const difference = currentTime - previousTime;

    return {
      ...point,
      difference,
    };
  });
}
