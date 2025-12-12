import { SwimTime } from '../types';

/**
 * Convert SwimTime object to total milliseconds
 * @param time - SwimTime object with minutes, seconds, and centiseconds
 * @returns Total time in milliseconds
 */
export function timeToMilliseconds(time: SwimTime): number {
  return (
    time.minutes * 60 * 1000 +
    time.seconds * 1000 +
    time.milliseconds * 10  // centiseconds to milliseconds
  );
}

/**
 * Convert total milliseconds to SwimTime object
 * Uses truncation (no rounding) for centiseconds
 * @param ms - Total time in milliseconds
 * @returns SwimTime object with minutes, seconds, and centiseconds (stored as milliseconds field)
 */
export function millisecondsToTime(ms: number): SwimTime {
  const minutes = Math.floor(ms / (60 * 1000));
  const remainingAfterMinutes = ms % (60 * 1000);
  const seconds = Math.floor(remainingAfterMinutes / 1000);
  const remainingMs = remainingAfterMinutes % 1000;
  // Truncate to centiseconds (2 digits) - no rounding
  const centiseconds = Math.floor(remainingMs / 10);

  return {
    minutes,
    seconds,
    milliseconds: centiseconds, // Now represents centiseconds (0-99)
  };
}

/**
 * Format time in milliseconds to MM:SS:ss string (centiseconds)
 * Uses truncation (no rounding) for the last 2 digits
 * @param ms - Total time in milliseconds
 * @returns Formatted time string (e.g., "01:23:45")
 */
export function formatTime(ms: number): string {
  const time = millisecondsToTime(ms);

  const minutes = time.minutes.toString().padStart(2, '0');
  const seconds = time.seconds.toString().padStart(2, '0');
  const centiseconds = time.milliseconds.toString().padStart(2, '0');

  return `${minutes}:${seconds}:${centiseconds}`;
}

/**
 * Parse time string in MM:SS:ss format to milliseconds
 * @param timeString - Time string in format MM:SS:ss (e.g., "1:23:45")
 * @returns Total time in milliseconds
 */
export function parseTime(timeString: string): number {
  const parts = timeString.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid time format. Expected MM:SS:ss');
  }

  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  const centiseconds = parseInt(parts[2], 10);

  if (isNaN(minutes) || isNaN(seconds) || isNaN(centiseconds)) {
    throw new Error('Invalid time values');
  }

  return timeToMilliseconds({ minutes, seconds, milliseconds: centiseconds });
}

