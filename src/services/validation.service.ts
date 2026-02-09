/**
 * Validation Service
 * Pure validation functions for user input with strong type safety
 */

import { CONSTANTS } from '../constants';
import type { ValidationResult } from '../types';

/**
 * Validate weight input
 * @param weight - Weight value to validate (string or number)
 * @returns Error message or empty string if valid
 */
export const validateWeight = (weight: string | number): string => {
  const w = parseFloat(String(weight));

  if (isNaN(w)) {
    return 'Please enter a valid number';
  }

  if (w < CONSTANTS.MIN_WEIGHT) {
    return `Weight must be at least ${CONSTANTS.MIN_WEIGHT} lbs`;
  }

  if (w > CONSTANTS.MAX_WEIGHT) {
    return `Weight must be less than ${CONSTANTS.MAX_WEIGHT} lbs`;
  }

  return '';
};

interface CustomDrinkInput {
  oz: string | number;
  abv: string | number;
  name: string;
}

/**
 * Validate custom drink input
 * @param params - Drink parameters (oz, abv, name)
 * @returns Validation result with isValid flag and error message
 */
export const validateCustomDrink = ({ oz, abv, name }: CustomDrinkInput): ValidationResult => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      error: 'Please enter a drink name',
    };
  }

  const ozValue = parseFloat(String(oz));
  if (isNaN(ozValue) || ozValue <= 0) {
    return {
      isValid: false,
      error: 'Please enter a valid fluid ounce amount',
    };
  }

  if (ozValue > 100) {
    return {
      isValid: false,
      error: 'Fluid ounces must be less than 100',
    };
  }

  const abvValue = parseFloat(String(abv));
  if (isNaN(abvValue) || abvValue <= 0) {
    return {
      isValid: false,
      error: 'Please enter a valid ABV percentage',
    };
  }

  if (abvValue > 100) {
    return {
      isValid: false,
      error: 'ABV must be less than 100%',
    };
  }

  return {
    isValid: true,
    error: '',
  };
};

interface CalculatorInput {
  drinks: string | number;
  hours: string | number;
}

/**
 * Validate calculator input
 * @param params - Calculator parameters (drinks, hours)
 * @returns Validation result with isValid flag and error message
 */
export const validateCalculatorInput = ({ drinks, hours }: CalculatorInput): ValidationResult => {
  const drinksValue = parseFloat(String(drinks));
  const hoursValue = parseFloat(String(hours));

  if (isNaN(drinksValue) || drinksValue < 0) {
    return {
      isValid: false,
      error: 'Please enter a valid number of drinks',
    };
  }

  if (drinksValue > 50) {
    return {
      isValid: false,
      error: 'Number of drinks seems unrealistically high',
    };
  }

  if (isNaN(hoursValue) || hoursValue < 0) {
    return {
      isValid: false,
      error: 'Please enter a valid number of hours',
    };
  }

  if (hoursValue > 72) {
    return {
      isValid: false,
      error: 'Time period too long (max 72 hours)',
    };
  }

  return {
    isValid: true,
    error: '',
  };
};

/**
 * Validate age (for age verification)
 * @param age - Age to validate
 * @returns True if age is valid (meets legal drinking age)
 */
export const validateAge = (age: number): boolean => {
  return !isNaN(age) && age >= CONSTANTS.LEGAL_DRINKING_AGE;
};
