/**
 * BAC Calculation Utilities
 * Pure functions for calculating Blood Alcohol Content
 * Based on the Widmark formula
 */

import { BAC_CONSTANTS } from './constants';

/**
 * Get body water constant based on gender
 * @param {string} gender - 'male' or 'female'
 * @returns {number} Body water percentage
 */
export const getBodyWaterConstant = (gender) => {
  return gender === 'male' ? BAC_CONSTANTS.MALE_BODY_WATER : BAC_CONSTANTS.FEMALE_BODY_WATER;
};

/**
 * Convert pounds to kilograms
 * @param {number} pounds - Weight in pounds
 * @returns {number} Weight in kilograms
 */
export const poundsToKilograms = (pounds) => {
  return pounds * BAC_CONSTANTS.LBS_TO_KG;
};

/**
 * Calculate BAC from a single drink
 * Uses the Widmark formula: BAC = (A / (W * r)) * 100
 * Where:
 *   A = grams of alcohol consumed
 *   W = body weight in kilograms
 *   r = body water constant (gender-dependent)
 *
 * @param {Object} params - Calculation parameters
 * @param {number} params.standardDrinks - Number of standard drinks
 * @param {number} params.weightLbs - Body weight in pounds
 * @param {string} params.gender - 'male' or 'female'
 * @param {number} params.hoursElapsed - Hours since consumption
 * @returns {number} Estimated BAC as decimal (e.g., 0.08)
 */
export const calculateDrinkBAC = ({ standardDrinks, weightLbs, gender, hoursElapsed }) => {
  // Convert weight to kg
  const weightKg = poundsToKilograms(weightLbs);

  // Get gender-specific body water constant
  const bodyWater = getBodyWaterConstant(gender);

  // Calculate total alcohol in grams
  const alcoholGrams = standardDrinks * BAC_CONSTANTS.GRAMS_PER_STANDARD_DRINK;

  // Calculate initial BAC using Widmark formula
  // Multiply by 100 to convert to percentage
  const initialBAC = (alcoholGrams / (weightKg * bodyWater * 1000)) * 100;

  // Calculate amount metabolized over time
  const metabolized = BAC_CONSTANTS.METABOLISM_RATE * hoursElapsed;

  // Return current BAC (can't go below 0)
  return Math.max(0, initialBAC - metabolized);
};

/**
 * Calculate BAC from multiple drinks (live tracking mode)
 * @param {Object} params - Calculation parameters
 * @param {Array} params.drinks - Array of drink objects with timestamp and standardDrinks
 * @param {number} params.weightLbs - Body weight in pounds
 * @param {string} params.gender - 'male' or 'female'
 * @param {number} params.currentTime - Current timestamp (Date.now())
 * @returns {number} Total estimated BAC
 */
export const calculateTotalBAC = ({ drinks, weightLbs, gender, currentTime }) => {
  if (!drinks || drinks.length === 0) {
    return 0;
  }

  let totalBAC = 0;

  // Calculate contribution of each drink
  drinks.forEach((drink) => {
    // Calculate hours elapsed since this drink
    const hoursElapsed = (currentTime - drink.timestamp) / (1000 * 60 * 60);

    // Calculate BAC contribution from this drink
    const drinkBAC = calculateDrinkBAC({
      standardDrinks: drink.standardDrinks || 1,
      weightLbs,
      gender,
      hoursElapsed,
    });

    totalBAC += drinkBAC;
  });

  return Math.max(0, totalBAC);
};

/**
 * Calculate estimated BAC (quick estimate mode)
 * Used when user inputs total drinks and time elapsed
 * @param {Object} params - Calculation parameters
 * @param {number} params.totalDrinks - Total number of standard drinks
 * @param {number} params.hoursElapsed - Hours since first drink
 * @param {number} params.weightLbs - Body weight in pounds
 * @param {string} params.gender - 'male' or 'female'
 * @returns {number} Estimated BAC
 */
export const calculateEstimatedBAC = ({ totalDrinks, hoursElapsed, weightLbs, gender }) => {
  return calculateDrinkBAC({
    standardDrinks: totalDrinks,
    weightLbs,
    gender,
    hoursElapsed,
  });
};

/**
 * Calculate time until sober (BAC reaches 0)
 * @param {number} currentBAC - Current BAC level
 * @returns {number} Minutes until sober
 */
export const calculateTimeToSober = (currentBAC) => {
  if (currentBAC <= 0) {
    return 0;
  }

  // Hours to sober = BAC / metabolism rate
  const hoursToSober = currentBAC / BAC_CONSTANTS.METABOLISM_RATE;

  // Convert to minutes
  return Math.ceil(hoursToSober * 60);
};

/**
 * Calculate timestamp when user will be sober
 * @param {number} currentBAC - Current BAC level
 * @returns {Date} Timestamp when BAC reaches 0
 */
export const calculateSoberTime = (currentBAC) => {
  const minutesToSober = calculateTimeToSober(currentBAC);
  return new Date(Date.now() + minutesToSober * 60000);
};

/**
 * Format sober time as readable string
 * @param {number} currentBAC - Current BAC level
 * @returns {string} Formatted time (e.g., "11:30 PM")
 */
export const formatSoberTime = (currentBAC) => {
  if (currentBAC <= 0) {
    return 'Now';
  }

  const soberTime = calculateSoberTime(currentBAC);
  return soberTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Calculate number of standard drinks from volume and ABV
 * @param {Object} params - Drink parameters
 * @param {number} params.volumeOz - Volume in fluid ounces
 * @param {number} params.abv - Alcohol by volume (percentage, e.g., 5 for 5%)
 * @returns {number} Number of standard drinks
 */
export const calculateStandardDrinks = ({ volumeOz, abv }) => {
  // Calculate ounces of pure alcohol
  const pureAlcoholOz = volumeOz * (abv / 100);

  // Divide by standard drink definition
  const standardDrinks = pureAlcoholOz / BAC_CONSTANTS.STANDARD_DRINK_OZ;

  // Round to 1 decimal place
  return Math.round(standardDrinks * 10) / 10;
};

/**
 * Validate weight input
 * @param {number} weight - Weight to validate
 * @param {number} min - Minimum allowed weight
 * @param {number} max - Maximum allowed weight
 * @returns {Object} { valid: boolean, error: string|null }
 */
export const validateWeight = (weight, min = 50, max = 500) => {
  const w = parseFloat(weight);

  if (isNaN(w) || !isFinite(w)) {
    return { valid: false, error: 'Please enter a valid number' };
  }

  if (w < min) {
    return { valid: false, error: `Weight must be at least ${min} lbs` };
  }

  if (w > max) {
    return { valid: false, error: `Weight must be less than ${max} lbs` };
  }

  return { valid: true, error: null };
};

/**
 * Get BAC status and description
 * @param {number} bac - Current BAC level
 * @returns {Object} { level: string, color: string, description: string }
 */
export const getBACStatus = (bac) => {
  if (bac === 0) {
    return {
      level: 'Sober',
      color: '#10B981',
      bgColor: '#D1FAE5',
      description: 'No alcohol in system',
    };
  }

  if (bac < 0.03) {
    return {
      level: 'Mild',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      description: 'Slight impairment',
    };
  }

  if (bac < BAC_CONSTANTS.LEGAL_LIMIT) {
    return {
      level: 'Impaired',
      color: '#F97316',
      bgColor: '#FFEDD5',
      description: 'DO NOT DRIVE',
    };
  }

  if (bac < 0.15) {
    return {
      level: 'Intoxicated',
      color: '#EF4444',
      bgColor: '#FEE2E2',
      description: 'Illegal to drive',
    };
  }

  return {
    level: 'Dangerous',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    description: 'Seek medical help',
  };
};

/**
 * Calculate drink cost efficiency (for pricing features)
 * @param {number} cost - Cost in dollars
 * @param {number} standardDrinks - Number of standard drinks
 * @returns {number} Cost per standard drink
 */
export const calculateCostPerDrink = (cost, standardDrinks) => {
  if (standardDrinks <= 0) return 0;
  return Math.round((cost / standardDrinks) * 100) / 100;
};

/**
 * Estimate calories from alcohol
 * Alcohol contains ~7 calories per gram
 * @param {number} standardDrinks - Number of standard drinks
 * @returns {number} Approximate calories from alcohol only
 */
export const calculateAlcoholCalories = (standardDrinks) => {
  const gramsAlcohol = standardDrinks * BAC_CONSTANTS.GRAMS_PER_STANDARD_DRINK;
  const caloriesPerGram = 7;
  return Math.round(gramsAlcohol * caloriesPerGram);
};
