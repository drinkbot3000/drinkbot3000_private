/**
 * Tests for BAC Calculation Service
 */

import {
  getBodyWaterConstant,
  calculateLiveBAC,
  calculateBAC,
  calculateSoberTime,
  getBACStatus,
  calculateStandardDrinks,
  isValidBAC,
} from './bacCalculation.service';
import { CONSTANTS } from '../constants';

describe('BAC Calculation Service', () => {
  describe('getBodyWaterConstant', () => {
    it('should return male body water constant for male gender', () => {
      expect(getBodyWaterConstant('male')).toBe(CONSTANTS.MALE_BODY_WATER);
    });

    it('should return female body water constant for female gender', () => {
      expect(getBodyWaterConstant('female')).toBe(CONSTANTS.FEMALE_BODY_WATER);
    });

    it('should return female constant for unrecognized gender', () => {
      expect(getBodyWaterConstant('other')).toBe(CONSTANTS.FEMALE_BODY_WATER);
    });
  });

  describe('calculateStandardDrinks', () => {
    it('should calculate standard drinks correctly for beer', () => {
      // 12oz beer at 5% ABV = 1 standard drink
      const result = calculateStandardDrinks(12, 5);
      expect(result).toBeCloseTo(1, 1);
    });

    it('should calculate standard drinks correctly for wine', () => {
      // 5oz wine at 12% ABV = 1 standard drink
      const result = calculateStandardDrinks(5, 12);
      expect(result).toBeCloseTo(1, 1);
    });

    it('should calculate standard drinks correctly for spirits', () => {
      // 1.5oz spirits at 40% ABV = 1 standard drink
      const result = calculateStandardDrinks(1.5, 40);
      expect(result).toBeCloseTo(1, 1);
    });

    it('should return 0 for invalid inputs', () => {
      expect(calculateStandardDrinks(0, 5)).toBe(0);
      expect(calculateStandardDrinks(12, 0)).toBe(0);
      expect(calculateStandardDrinks(null, 5)).toBe(0);
      expect(calculateStandardDrinks(12, null)).toBe(0);
      expect(calculateStandardDrinks('invalid', 5)).toBe(0);
    });
  });

  describe('calculateLiveBAC', () => {
    it('should calculate BAC for single drink just consumed', () => {
      const drinks = [
        {
          id: 1,
          standardDrinks: 1,
          timestamp: Date.now(),
        },
      ];

      const result = calculateLiveBAC({
        drinks,
        weight: 180,
        gender: 'male',
        useSlowMetabolism: false,
      });

      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(0.05);
    });

    it('should calculate BAC for multiple drinks', () => {
      const now = Date.now();
      const drinks = [
        { id: 1, standardDrinks: 1, timestamp: now - 60 * 60 * 1000 }, // 1 hour ago
        { id: 2, standardDrinks: 1, timestamp: now - 30 * 60 * 1000 }, // 30 min ago
        { id: 3, standardDrinks: 1, timestamp: now }, // Just now
      ];

      const result = calculateLiveBAC({
        drinks,
        weight: 180,
        gender: 'male',
        useSlowMetabolism: false,
      });

      expect(result).toBeGreaterThan(0);
    });

    it('should return 0 for old drinks that metabolized', () => {
      const drinks = [
        {
          id: 1,
          standardDrinks: 1,
          timestamp: Date.now() - 24 * 60 * 60 * 1000, // 24 hours ago
        },
      ];

      const result = calculateLiveBAC({
        drinks,
        weight: 180,
        gender: 'male',
        useSlowMetabolism: false,
      });

      expect(result).toBe(0);
    });

    it('should return 0 for empty drinks array', () => {
      const result = calculateLiveBAC({
        drinks: [],
        weight: 180,
        gender: 'male',
        useSlowMetabolism: false,
      });

      expect(result).toBe(0);
    });

    it('should handle invalid drink data gracefully', () => {
      const drinks = [
        { id: 1, standardDrinks: 1, timestamp: Date.now() },
        { id: 2, standardDrinks: null, timestamp: null }, // Invalid drink
        { id: 3, standardDrinks: 1, timestamp: Date.now() },
      ];

      const result = calculateLiveBAC({
        drinks,
        weight: 180,
        gender: 'male',
        useSlowMetabolism: false,
      });

      expect(result).toBeGreaterThan(0);
    });
  });

  describe('calculateBAC', () => {
    it('should calculate BAC for live tracking with drinks', () => {
      const drinks = [{ id: 1, standardDrinks: 1, timestamp: Date.now() }];

      const result = calculateBAC({
        gender: 'male',
        weight: 180,
        drinks,
        startTime: Date.now(),
        useSlowMetabolism: false,
      });

      expect(result).toBeGreaterThan(0);
    });

    it('should return 0 when gender is missing', () => {
      const drinks = [{ id: 1, standardDrinks: 1, timestamp: Date.now() }];

      const result = calculateBAC({
        gender: '',
        weight: 180,
        drinks,
        startTime: Date.now(),
        useSlowMetabolism: false,
      });

      expect(result).toBe(0);
    });

    it('should return 0 when weight is invalid', () => {
      const drinks = [{ id: 1, standardDrinks: 1, timestamp: Date.now() }];

      const result = calculateBAC({
        gender: 'male',
        weight: 'invalid',
        drinks,
        startTime: Date.now(),
        useSlowMetabolism: false,
      });

      expect(result).toBe(0);
    });

    it('should return 0 when startTime is missing', () => {
      const drinks = [{ id: 1, standardDrinks: 1, timestamp: Date.now() }];

      const result = calculateBAC({
        gender: 'male',
        weight: 180,
        drinks,
        startTime: null,
        useSlowMetabolism: false,
      });

      expect(result).toBe(0);
    });

    it('should return 0 when drinks array is empty', () => {
      const result = calculateBAC({
        gender: 'male',
        weight: 180,
        drinks: [],
        startTime: Date.now(),
        useSlowMetabolism: false,
      });

      expect(result).toBe(0);
    });
  });

  describe('calculateSoberTime', () => {
    it('should calculate future sober time for positive BAC', () => {
      const now = Date.now();
      const soberTime = calculateSoberTime(0.08, false);

      expect(soberTime.getTime()).toBeGreaterThan(now);
    });

    it('should return current time for zero BAC', () => {
      const now = Date.now();
      const soberTime = calculateSoberTime(0, false);

      expect(soberTime.getTime()).toBeCloseTo(now, -2); // Within 100ms
    });

    it('should return current time for negative BAC', () => {
      const now = Date.now();
      const soberTime = calculateSoberTime(-0.01, false);

      expect(soberTime.getTime()).toBeCloseTo(now, -2);
    });

    it('should take longer to sober with slow metabolism', () => {
      const normalSober = calculateSoberTime(0.08, false);
      const slowSober = calculateSoberTime(0.08, true);

      expect(slowSober.getTime()).toBeGreaterThan(normalSober.getTime());
    });
  });

  describe('getBACStatus', () => {
    it('should return safe status for 0 BAC', () => {
      const status = getBACStatus(0);
      expect(status.level).toBe('safe');
      expect(status.color).toBe('green');
    });

    it('should return safe status for minimal impairment', () => {
      const status = getBACStatus(0.01);
      expect(status.level).toBe('safe');
      expect(status.color).toBe('green');
    });

    it('should return caution status for light impairment', () => {
      const status = getBACStatus(0.03);
      expect(status.level).toBe('caution');
      expect(status.color).toBe('yellow');
    });

    it('should return warning status for moderate impairment', () => {
      const status = getBACStatus(0.06);
      expect(status.level).toBe('warning');
      expect(status.color).toBe('orange');
    });

    it('should return danger status for legal intoxication', () => {
      const status = getBACStatus(0.08);
      expect(status.level).toBe('danger');
      expect(status.color).toBe('red');
    });

    it('should return danger status for severe intoxication', () => {
      const status = getBACStatus(0.2);
      expect(status.level).toBe('danger');
      expect(status.message).toContain('Severe');
    });
  });

  describe('isValidBAC', () => {
    it('should return true for valid BAC values', () => {
      expect(isValidBAC(0)).toBe(true);
      expect(isValidBAC(0.08)).toBe(true);
      expect(isValidBAC(0.25)).toBe(true);
    });

    it('should return false for negative BAC', () => {
      expect(isValidBAC(-0.01)).toBe(false);
    });

    it('should return false for excessively high BAC', () => {
      expect(isValidBAC(0.6)).toBe(false);
      expect(isValidBAC(1.0)).toBe(false);
    });

    it('should return false for NaN', () => {
      expect(isValidBAC(NaN)).toBe(false);
    });

    it('should return false for Infinity', () => {
      expect(isValidBAC(Infinity)).toBe(false);
      expect(isValidBAC(-Infinity)).toBe(false);
    });
  });
});
