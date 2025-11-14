/**
 * Input Validation Utilities
 * Comprehensive validation for all user inputs
 */

import { CONSTANTS } from '../constants';

/**
 * Validate weight input
 *
 * @param {string|number} weight - Weight in pounds
 * @returns {{valid: boolean, error: string|null}}
 *
 * @example
 * validateWeight(150)
 * // Returns: { valid: true, error: null }
 */
export const validateWeight = (weight) => {
  const numWeight = parseFloat(weight);

  if (isNaN(numWeight) || !isFinite(numWeight)) {
    return {
      valid: false,
      error: 'Weight must be a valid number'
    };
  }

  if (numWeight < CONSTANTS.MIN_WEIGHT) {
    return {
      valid: false,
      error: `Weight must be at least ${CONSTANTS.MIN_WEIGHT} lbs`
    };
  }

  if (numWeight > CONSTANTS.MAX_WEIGHT) {
    return {
      valid: false,
      error: `Weight must be at most ${CONSTANTS.MAX_WEIGHT} lbs`
    };
  }

  return {
    valid: true,
    error: null
  };
};

/**
 * Validate gender selection
 *
 * @param {string} gender - Gender value
 * @returns {{valid: boolean, error: string|null}}
 */
export const validateGender = (gender) => {
  const validGenders = ['male', 'female'];

  if (!gender || !validGenders.includes(gender)) {
    return {
      valid: false,
      error: 'Please select a valid gender'
    };
  }

  return {
    valid: true,
    error: null
  };
};

/**
 * Validate drink volume in ounces
 *
 * @param {string|number} oz - Volume in ounces
 * @returns {{valid: boolean, error: string|null}}
 */
export const validateDrinkOunces = (oz) => {
  const numOz = parseFloat(oz);

  if (isNaN(numOz) || !isFinite(numOz)) {
    return {
      valid: false,
      error: 'Ounces must be a valid number'
    };
  }

  if (numOz <= 0) {
    return {
      valid: false,
      error: 'Ounces must be greater than 0'
    };
  }

  if (numOz > 64) {
    return {
      valid: false,
      error: 'Ounces must be at most 64 oz'
    };
  }

  return {
    valid: true,
    error: null
  };
};

/**
 * Validate alcohol by volume (ABV) percentage
 *
 * @param {string|number} abv - ABV percentage
 * @returns {{valid: boolean, error: string|null}}
 */
export const validateABV = (abv) => {
  const numABV = parseFloat(abv);

  if (isNaN(numABV) || !isFinite(numABV)) {
    return {
      valid: false,
      error: 'ABV must be a valid number'
    };
  }

  if (numABV <= 0) {
    return {
      valid: false,
      error: 'ABV must be greater than 0%'
    };
  }

  if (numABV > 100) {
    return {
      valid: false,
      error: 'ABV cannot exceed 100%'
    };
  }

  return {
    valid: true,
    error: null
  };
};

/**
 * Validate custom drink input (combined validation)
 *
 * @param {Object} drink - Drink object
 * @param {string} drink.name - Drink name
 * @param {string|number} drink.oz - Volume in ounces
 * @param {string|number} drink.abv - ABV percentage
 * @returns {{valid: boolean, errors: Object}}
 */
export const validateCustomDrink = (drink) => {
  const errors = {};

  // Validate ounces
  const ozValidation = validateDrinkOunces(drink.oz);
  if (!ozValidation.valid) {
    errors.oz = ozValidation.error;
  }

  // Validate ABV
  const abvValidation = validateABV(drink.abv);
  if (!abvValidation.valid) {
    errors.abv = abvValidation.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate tip amount
 *
 * @param {string|number} amount - Tip amount in dollars
 * @returns {{valid: boolean, error: string|null}}
 */
export const validateTipAmount = (amount) => {
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || !isFinite(numAmount)) {
    return {
      valid: false,
      error: 'Amount must be a valid number'
    };
  }

  if (numAmount < CONSTANTS.MIN_TIP_AMOUNT) {
    return {
      valid: false,
      error: `Minimum tip amount is $${CONSTANTS.MIN_TIP_AMOUNT}`
    };
  }

  if (numAmount > 1000) {
    return {
      valid: false,
      error: 'Maximum tip amount is $1000'
    };
  }

  return {
    valid: true,
    error: null
  };
};

/**
 * Validate estimate mode inputs
 *
 * @param {Object} params - Estimation parameters
 * @param {string|number} params.drinks - Number of drinks
 * @param {string|number} params.hours - Hours elapsed
 * @returns {{valid: boolean, errors: Object}}
 */
export const validateEstimateInputs = (params) => {
  const errors = {};

  const numDrinks = parseFloat(params.drinks);
  if (isNaN(numDrinks) || numDrinks <= 0) {
    errors.drinks = 'Number of drinks must be greater than 0';
  }
  if (numDrinks > 50) {
    errors.drinks = 'Number of drinks seems unrealistic (max 50)';
  }

  const numHours = parseFloat(params.hours);
  if (isNaN(numHours) || numHours < 0) {
    errors.hours = 'Hours must be 0 or greater';
  }
  if (numHours > 24) {
    errors.hours = 'Hours cannot exceed 24';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate calculator inputs
 *
 * @param {Object} params - Calculator parameters
 * @param {string|number} params.drinks - Number of drinks
 * @param {string|number} params.hours - Hours elapsed
 * @returns {{valid: boolean, errors: Object}}
 */
export const validateCalculatorInputs = (params) => {
  // Same validation as estimate mode for now
  return validateEstimateInputs(params);
};

/**
 * Validate age
 *
 * @param {number} age - User's age
 * @returns {{valid: boolean, error: string|null}}
 */
export const validateAge = (age) => {
  if (typeof age !== 'number' || isNaN(age)) {
    return {
      valid: false,
      error: 'Age must be a number'
    };
  }

  if (age < CONSTANTS.LEGAL_DRINKING_AGE) {
    return {
      valid: false,
      error: `You must be at least ${CONSTANTS.LEGAL_DRINKING_AGE} years old`
    };
  }

  if (age > 120) {
    return {
      valid: false,
      error: 'Please enter a valid age'
    };
  }

  return {
    valid: true,
    error: null
  };
};

/**
 * Validate profile setup
 *
 * @param {Object} profile - User profile
 * @param {string} profile.gender - Gender
 * @param {string|number} profile.weight - Weight
 * @returns {{valid: boolean, errors: Object}}
 */
export const validateProfile = (profile) => {
  const errors = {};

  const genderValidation = validateGender(profile.gender);
  if (!genderValidation.valid) {
    errors.gender = genderValidation.error;
  }

  const weightValidation = validateWeight(profile.weight);
  if (!weightValidation.valid) {
    errors.weight = weightValidation.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
