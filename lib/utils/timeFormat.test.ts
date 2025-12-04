import * as fc from 'fast-check';
import { timeToMilliseconds, millisecondsToTime, formatTime } from './timeFormat';
import { SwimTime } from '../types';

describe('Time Format Utilities', () => {
  // Feature: swimmer-performance-tracker, Property 5: Time format validation
  describe('Property 5: Time format validation', () => {
    test('time conversion round trip preserves values', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 59 }), // minutes
          fc.integer({ min: 0, max: 59 }), // seconds
          fc.integer({ min: 0, max: 999 }), // milliseconds
          (min, sec, ms) => {
            const time: SwimTime = { 
              minutes: min, 
              seconds: sec, 
              milliseconds: ms 
            };
            
            const totalMs = timeToMilliseconds(time);
            const converted = millisecondsToTime(totalMs);
            
            return (
              converted.minutes === min &&
              converted.seconds === sec &&
              converted.milliseconds === ms
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    test('formatTime produces correct MM:SS:mmm format', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 3599999 }), // 0 to 59:59:999
          (totalMs) => {
            const formatted = formatTime(totalMs);
            
            // Check format: MM:SS:mmm
            const regex = /^\d{2}:\d{2}:\d{3}$/;
            if (!regex.test(formatted)) {
              return false;
            }
            
            // Verify the formatted string represents the same time
            const parts = formatted.split(':');
            const minutes = parseInt(parts[0], 10);
            const seconds = parseInt(parts[1], 10);
            const milliseconds = parseInt(parts[2], 10);
            
            const reconstructed = minutes * 60 * 1000 + seconds * 1000 + milliseconds;
            return reconstructed === totalMs;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
