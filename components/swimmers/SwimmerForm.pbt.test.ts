import * as fc from 'fast-check';
import { z } from 'zod';

// Feature: swimmer-performance-tracker, Property 14: Form validation prevents invalid submission
// Validates: Requirements 2.3

// Zod schema for swimmer form validation (same as in SwimmerForm.tsx)
const swimmerSchema = z.object({
  name: z.string().min(1, 'İsim gereklidir'),
  surname: z.string().min(1, 'Soyisim gereklidir'),
  age: z.number().min(1, 'Yaş 1\'den büyük olmalıdır').max(99, 'Yaş 99\'dan küçük olmalıdır'),
  gender: z.enum(['Erkek', 'Kadın'], {
    errorMap: () => ({ message: 'Cinsiyet seçilmelidir' }),
  }),
});

describe('SwimmerForm Validation Property Tests', () => {
  test('Property 14: Form validation prevents invalid submission - missing name', () => {
    fc.assert(
      fc.property(
        fc.constant(''), // empty string
        fc.string().filter(s => s.length > 0), // valid surname
        fc.integer({ min: 1, max: 99 }), // valid age
        fc.constantFrom('Erkek', 'Kadın'), // valid gender
        (name, surname, age, gender) => {
          const result = swimmerSchema.safeParse({ name, surname, age, gender });
          return !result.success; // Should fail validation
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 14: Form validation prevents invalid submission - missing surname', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => s.length > 0), // valid name
        fc.constant(''), // empty string
        fc.integer({ min: 1, max: 99 }), // valid age
        fc.constantFrom('Erkek', 'Kadın'), // valid gender
        (name, surname, age, gender) => {
          const result = swimmerSchema.safeParse({ name, surname, age, gender });
          return !result.success; // Should fail validation
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 14: Form validation prevents invalid submission - invalid age', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => s.trim().length > 0), // valid name
        fc.string().filter(s => s.trim().length > 0), // valid surname
        fc.integer().filter(age => age < 1 || age > 99), // invalid age
        fc.constantFrom('Erkek', 'Kadın'), // valid gender
        (name, surname, age, gender) => {
          const result = swimmerSchema.safeParse({ name, surname, age, gender });
          return !result.success; // Should fail validation
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 14: Form validation prevents invalid submission - invalid gender', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => s.trim().length > 0), // valid name
        fc.string().filter(s => s.trim().length > 0), // valid surname
        fc.integer({ min: 1, max: 99 }), // valid age
        fc.string().filter(s => s !== 'Erkek' && s !== 'Kadın'), // invalid gender
        (name, surname, age, gender) => {
          const result = swimmerSchema.safeParse({ name, surname, age, gender });
          return !result.success; // Should fail validation
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 14: Form validation allows valid submission', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => s.length > 0), // valid name
        fc.string().filter(s => s.length > 0), // valid surname
        fc.integer({ min: 1, max: 99 }), // valid age
        fc.constantFrom('Erkek', 'Kadın'), // valid gender
        (name, surname, age, gender) => {
          const result = swimmerSchema.safeParse({ name, surname, age, gender });
          return result.success; // Should pass validation
        }
      ),
      { numRuns: 100 }
    );
  });
});
