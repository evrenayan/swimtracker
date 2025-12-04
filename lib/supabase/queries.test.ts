/**
 * Basic structure tests for Supabase queries
 * These tests verify the query functions are properly exported and structured
 */

// Mock environment variables before importing
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock the Supabase client
jest.mock('./client', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn(),
      maybeSingle: jest.fn(),
    })),
  },
}));

import * as queries from './queries';

describe('Supabase Queries', () => {
  describe('Swimmer Queries', () => {
    it('should export createSwimmer function', () => {
      expect(typeof queries.createSwimmer).toBe('function');
    });

    it('should export getSwimmer function', () => {
      expect(typeof queries.getSwimmer).toBe('function');
    });

    it('should export getAllSwimmers function', () => {
      expect(typeof queries.getAllSwimmers).toBe('function');
    });

    it('should export updateSwimmer function', () => {
      expect(typeof queries.updateSwimmer).toBe('function');
    });

    it('should export deleteSwimmer function', () => {
      expect(typeof queries.deleteSwimmer).toBe('function');
    });
  });

  describe('Race Record Queries', () => {
    it('should export createRaceRecord function', () => {
      expect(typeof queries.createRaceRecord).toBe('function');
    });

    it('should export getRaceRecord function', () => {
      expect(typeof queries.getRaceRecord).toBe('function');
    });

    it('should export getRaceRecordsBySwimmer function', () => {
      expect(typeof queries.getRaceRecordsBySwimmer).toBe('function');
    });

    it('should export getRaceRecordsBySwimmerAndStyle function', () => {
      expect(typeof queries.getRaceRecordsBySwimmerAndStyle).toBe('function');
    });

    it('should export updateRaceRecord function', () => {
      expect(typeof queries.updateRaceRecord).toBe('function');
    });

    it('should export deleteRaceRecord function', () => {
      expect(typeof queries.deleteRaceRecord).toBe('function');
    });
  });

  describe('Reference Data Queries', () => {
    it('should export getAllPoolTypes function', () => {
      expect(typeof queries.getAllPoolTypes).toBe('function');
    });

    it('should export getAllSwimmingStyles function', () => {
      expect(typeof queries.getAllSwimmingStyles).toBe('function');
    });

    it('should export getAllBarrierTypes function', () => {
      expect(typeof queries.getAllBarrierTypes).toBe('function');
    });

    it('should export getBarrierValues function', () => {
      expect(typeof queries.getBarrierValues).toBe('function');
    });

    it('should export getAllBarrierValues function', () => {
      expect(typeof queries.getAllBarrierValues).toBe('function');
    });
  });

  describe('Helper Queries', () => {
    it('should export getBestTimeForStyle function', () => {
      expect(typeof queries.getBestTimeForStyle).toBe('function');
    });

    it('should export getSwimmerWithRaceCount function', () => {
      expect(typeof queries.getSwimmerWithRaceCount).toBe('function');
    });
  });
});
