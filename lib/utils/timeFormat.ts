import { SwimTime } from '../types';

/**
 * Convert SwimTime object to total milliseconds
 * @param time - SwimTime object with minutes, seconds, and milliseconds
 * @returns Total time in milliseconds
 */
export function timeToMilliseconds(time: SwimTime): number {
  return (
    time.minutes * 60 * 1000 +
    time.seconds * 1000 +
    time.milliseconds
  );
}

/**
 * Convert total milliseconds to SwimTime object
 * @param ms - Total time in milliseconds
 * @returns SwimTime object with minutes, seconds, and milliseconds
 */
export function millisecondsToTime(ms: number): SwimTime {
  const minutes = Math.floor(ms / (60 * 1000));
  const remainingAfterMinutes = ms % (60 * 1000);
  const seconds = Math.floor(remainingAfterMinutes / 1000);
  const milliseconds = remainingAfterMinutes % 1000;

  return {
    minutes,
    seconds,
    milliseconds,
  };
}

/**
 * Format time in milliseconds to MM:SS:mmm string
 * @param ms - Total time in milliseconds
 * @returns Formatted time string (e.g., "01:23:456")
 */
export function formatTime(ms: number): string {
  const time = millisecondsToTime(ms);

  const minutes = time.minutes.toString().padStart(2, '0');
  const seconds = time.seconds.toString().padStart(2, '0');
  const milliseconds = time.milliseconds.toString().padStart(3, '0');

  return `${minutes}:${seconds}:${milliseconds}`;
}

/**
 * Parse time string in MM:SS:mmm format to milliseconds
 * @param timeString - Time string in format MM:SS:mmm (e.g., "1:23:456")
 * @returns Total time in milliseconds
 */
export function parseTime(timeString: string): number {
  const parts = timeString.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid time format. Expected MM:SS:mmm');
  }

  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  const milliseconds = parseInt(parts[2], 10);

  if (isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) {
    throw new Error('Invalid time values');
  }

  return timeToMilliseconds({ minutes, seconds, milliseconds });
}

