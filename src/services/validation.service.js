/**
 * Validation Service
 * Pure validation functions for user input
 */

import { CONSTANTS } from '../constants';

/**
 * Validate weight input
 * @param {string|number} weight - Weight value to validate
 * @returns {string} Error message or empty string if valid
 */
export const validateWeight = (weight) => {
  const w = parseFloat(weight);

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

/**
 * Validate tip amount
 * @param {string|number} amount - Tip amount to validate
 * @returns {string} Error message or empty string if valid
 */
export const validateTipAmount = (amount) => {
  const tipValue = parseFloat(amount);

  if (isNaN(tipValue)) {
    return 'Please enter a valid amount';
  }

  if (tipValue < CONSTANTS.MIN_TIP_AMOUNT) {
    return `Minimum tip amount is $${CONSTANTS.MIN_TIP_AMOUNT}`;
  }

  if (tipValue > 1000) {
    return 'Maximum tip amount is $1000';
  }

  return '';
};

/**
 * Validate custom drink input
 * @param {Object} params
 * @param {string} params.oz - Fluid ounces
 * @param {string} params.abv - Alcohol by volume percentage
 * @param {string} params.name - Drink name
 * @returns {Object} Validation result with isValid and error message
 */
export const validateCustomDrink = ({ oz, abv, name }) => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      error: 'Please enter a drink name',
    };
  }

  const ozValue = parseFloat(oz);
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

  const abvValue = parseFloat(abv);
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

/**
 * Validate calculator input
 * @param {Object} params
 * @param {string} params.drinks - Number of drinks
 * @param {string} params.hours - Number of hours
 * @returns {Object} Validation result
 */
export const validateCalculatorInput = ({ drinks, hours }) => {
  const drinksValue = parseFloat(drinks);
  const hoursValue = parseFloat(hours);

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
 * @param {number} age - Age to validate
 * @returns {boolean} True if age is valid and meets minimum
 */
export const validateAge = (age) => {
  return !isNaN(age) && age >= CONSTANTS.LEGAL_DRINKING_AGE;
};
