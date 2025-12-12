import * as fc from 'fast-check';
import { timeToMilliseconds, millisecondsToTime, formatTime } from './timeFormat';
import { SwimTime } from '../types';

describe('Time Format Utilities', () => {
  // Feature: swimmer-performance-tracker, Property 5: Time format validation
  describe('Property 5: Time format validation', () => {
    test('time conversion round trip preserves values (centiseconds)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 59 }), // minutes
          fc.integer({ min: 0, max: 59 }), // seconds
          fc.integer({ min: 0, max: 99 }), // centiseconds (now 0-99)
          (min, sec, cs) => {
            const time: SwimTime = {
              minutes: min,
              seconds: sec,
              milliseconds: cs // represents centiseconds now
            };

            const totalMs = timeToMilliseconds(time);
            const converted = millisecondsToTime(totalMs);

            return (
              converted.minutes === min &&
              converted.seconds === sec &&
              converted.milliseconds === cs
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    test('formatTime produces correct MM:SS:ss format (2-digit centiseconds)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 3599990 }), // 0 to 59:59:99 (in ms)
          (totalMs) => {
            const formatted = formatTime(totalMs);

            // Check format: MM:SS:ss (2-digit centiseconds)
            const regex = /^\d{2}:\d{2}:\d{2}$/;
            if (!regex.test(formatted)) {
              return false;
            }

            // Verify the formatted string represents the same time (truncated to centiseconds)
            const parts = formatted.split(':');
            const minutes = parseInt(parts[0], 10);
            const seconds = parseInt(parts[1], 10);
            const centiseconds = parseInt(parts[2], 10);

            // Reconstruct milliseconds from formatted value
            const reconstructed = minutes * 60 * 1000 + seconds * 1000 + centiseconds * 10;
            // Original should be within 10ms (centisecond precision)
            return Math.abs(reconstructed - totalMs) < 10;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('formatTime uses truncation not rounding', () => {
      // 01:23:459 ms should become 01:23:45, not 01:23:46
      expect(formatTime(83459)).toBe('01:23:45');
      // 00:30:999 ms should become 00:30:99, not 00:31:00
      expect(formatTime(30999)).toBe('00:30:99');
      // 01:26:995 ms should become 01:26:99
      expect(formatTime(86995)).toBe('01:26:99');
    });
  });
});
