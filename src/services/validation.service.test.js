/**
 * Tests for Validation Service
 */

import {
  validateWeight,
  validateCustomDrink,
  validateCalculatorInput,
  validateAge,
} from './validation.service';
import { CONSTANTS } from '../constants';

describe('Validation Service', () => {
  describe('validateWeight', () => {
    it('should return empty string for valid weight', () => {
      expect(validateWeight(150)).toBe('');
      expect(validateWeight('180')).toBe('');
      expect(validateWeight(CONSTANTS.MIN_WEIGHT)).toBe('');
      expect(validateWeight(CONSTANTS.MAX_WEIGHT)).toBe('');
    });

    it('should return error for weight below minimum', () => {
      const error = validateWeight(CONSTANTS.MIN_WEIGHT - 1);
      expect(error).toContain('at least');
    });

    it('should return error for weight above maximum', () => {
      const error = validateWeight(CONSTANTS.MAX_WEIGHT + 1);
      expect(error).toContain('less than');
    });

    it('should return error for non-numeric weight', () => {
      expect(validateWeight('abc')).toContain('valid number');
      expect(validateWeight('')).toContain('valid number');
      expect(validateWeight(null)).toContain('valid number');
    });
  });

  describe('validateCustomDrink', () => {
    it('should return valid for correct custom drink', () => {
      const result = validateCustomDrink({
        name: 'Custom Beer',
        oz: '12',
        abv: '5',
      });

      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should return error for empty name', () => {
      const result = validateCustomDrink({
        name: '',
        oz: '12',
        abv: '5',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('name');
    });

    it('should return error for whitespace-only name', () => {
      const result = validateCustomDrink({
        name: '   ',
        oz: '12',
        abv: '5',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('name');
    });

    it('should return error for invalid oz', () => {
      const result = validateCustomDrink({
        name: 'Custom Beer',
        oz: 'abc',
        abv: '5',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('fluid ounce');
    });

    it('should return error for negative oz', () => {
      const result = validateCustomDrink({
        name: 'Custom Beer',
        oz: '-5',
        abv: '5',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('fluid ounce');
    });

    it('should return error for oz above 100', () => {
      const result = validateCustomDrink({
        name: 'Custom Beer',
        oz: '101',
        abv: '5',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('less than 100');
    });

    it('should return error for invalid ABV', () => {
      const result = validateCustomDrink({
        name: 'Custom Beer',
        oz: '12',
        abv: 'abc',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('ABV');
    });

    it('should return error for negative ABV', () => {
      const result = validateCustomDrink({
        name: 'Custom Beer',
        oz: '12',
        abv: '-5',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('ABV');
    });

    it('should return error for ABV above 100', () => {
      const result = validateCustomDrink({
        name: 'Custom Beer',
        oz: '12',
        abv: '101',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('less than 100%');
    });
  });

  describe('validateCalculatorInput', () => {
    it('should return valid for correct input', () => {
      const result = validateCalculatorInput({
        drinks: '4',
        hours: '2',
      });

      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should return error for invalid drinks', () => {
      const result = validateCalculatorInput({
        drinks: 'abc',
        hours: '2',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('drinks');
    });

    it('should return error for negative drinks', () => {
      const result = validateCalculatorInput({
        drinks: '-1',
        hours: '2',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('drinks');
    });

    it('should return error for non-integer drinks', () => {
      const result = validateCalculatorInput({
        drinks: '3.5',
        hours: '2',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('whole number');
    });

    it('should return error for unrealistically high drinks', () => {
      const result = validateCalculatorInput({
        drinks: '51',
        hours: '2',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('unrealistically high');
    });

    it('should return error for invalid hours', () => {
      const result = validateCalculatorInput({
        drinks: '4',
        hours: 'abc',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('hours');
    });

    it('should return error for negative hours', () => {
      const result = validateCalculatorInput({
        drinks: '4',
        hours: '-1',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('hours');
    });

    it('should return error for hours above 72', () => {
      const result = validateCalculatorInput({
        drinks: '4',
        hours: '73',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too long');
    });

    it('should accept zero drinks', () => {
      const result = validateCalculatorInput({
        drinks: '0',
        hours: '2',
      });

      expect(result.isValid).toBe(true);
    });

    it('should accept zero hours', () => {
      const result = validateCalculatorInput({
        drinks: '4',
        hours: '0',
      });

      expect(result.isValid).toBe(true);
    });
  });

  describe('validateAge', () => {
    it('should return true for age at legal drinking age', () => {
      expect(validateAge(CONSTANTS.LEGAL_DRINKING_AGE)).toBe(true);
    });

    it('should return true for age above legal drinking age', () => {
      expect(validateAge(CONSTANTS.LEGAL_DRINKING_AGE + 1)).toBe(true);
      expect(validateAge(30)).toBe(true);
      expect(validateAge(100)).toBe(true);
    });

    it('should return false for age below legal drinking age', () => {
      expect(validateAge(CONSTANTS.LEGAL_DRINKING_AGE - 1)).toBe(false);
      expect(validateAge(18)).toBe(false);
      expect(validateAge(0)).toBe(false);
    });

    it('should return false for invalid age', () => {
      expect(validateAge(NaN)).toBe(false);
      expect(validateAge('abc')).toBe(false);
    });
  });
});
