/**
 * BAC Calculation Service
 * Pure functions for Blood Alcohol Content calculations
 * All functions are testable and side-effect free
 */

import { CONSTANTS } from '../constants';

/**
 * Get body water constant based on gender
 * @param {string} gender - 'male' or 'female'
 * @returns {number} Body water constant
 */
export const getBodyWaterConstant = (gender) => {
  return gender === 'male' ? CONSTANTS.MALE_BODY_WATER : CONSTANTS.FEMALE_BODY_WATER;
};

/**
 * Calculate BAC for live tracking
 * @param {Object} params
 * @param {Array} params.drinks - Array of drink objects
 * @param {number} params.weight - Weight in pounds
 * @param {string} params.gender - 'male' or 'female'
 * @param {boolean} params.useSlowMetabolism - Use slow metabolism rate
 * @returns {number} BAC percentage
 */
export const calculateLiveBAC = ({ drinks, weight, gender, useSlowMetabolism }) => {
  if (!drinks || drinks.length === 0 || !weight || !gender) return 0;
  if (isNaN(weight) || weight <= 0) return 0;

  const weightKg = weight * CONSTANTS.LBS_TO_KG;
  const bodyWater = getBodyWaterConstant(gender);
  const currentTime = Date.now();
  const metabolismRate = useSlowMetabolism
    ? CONSTANTS.SLOW_METABOLISM_RATE
    : CONSTANTS.METABOLISM_RATE;

  let adjustedBAC = 0;

  drinks.forEach(drink => {
    // Defensive check for drink data
    if (!drink || typeof drink.standardDrinks !== 'number' || !drink.timestamp) {
      console.warn('Invalid drink data encountered');
      return;
    }

    const standardDrinks = drink.standardDrinks || 1;
    const alcoholGrams = standardDrinks * CONSTANTS.GRAMS_PER_STANDARD_DRINK;
    const hoursElapsed = (currentTime - drink.timestamp) / (1000 * 60 * 60);

    const drinkBAC = (alcoholGrams / (weightKg * bodyWater * 1000)) * 100;
    const metabolized = metabolismRate * hoursElapsed;
    const currentDrinkBAC = Math.max(0, drinkBAC - metabolized);

    adjustedBAC += currentDrinkBAC;
  });

  return Math.max(0, adjustedBAC);
};

/**
 * Main BAC calculation function
 * @param {Object} params
 * @param {string} params.gender - 'male' or 'female'
 * @param {number} params.weight - Weight in pounds
 * @param {Array} params.drinks - Array of drink objects
 * @param {number|null} params.startTime - Start time
 * @param {boolean} params.useSlowMetabolism - Use slow metabolism rate
 * @returns {number} BAC percentage
 */
export const calculateBAC = ({
  gender,
  weight,
  drinks,
  startTime,
  useSlowMetabolism,
}) => {
  try {
    // Defensive checks for required data
    if (!gender || !weight) return 0;

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      console.warn('Invalid weight value for BAC calculation');
      return 0;
    }

    if (!startTime || drinks.length === 0) return 0;

    return calculateLiveBAC({
      drinks,
      weight: weightValue,
      gender,
      useSlowMetabolism,
    });
  } catch (error) {
    console.error('Error calculating BAC:', error);
    return 0;
  }
};

/**
 * Calculate time until sober (BAC = 0)
 * @param {number} currentBAC - Current BAC percentage
 * @param {boolean} useSlowMetabolism - Use slow metabolism rate
 * @returns {Date} Estimated sober time
 */
export const calculateSoberTime = (currentBAC, useSlowMetabolism) => {
  if (!currentBAC || currentBAC <= 0) {
    return new Date();
  }

  const metabolismRate = useSlowMetabolism
    ? CONSTANTS.SLOW_METABOLISM_RATE
    : CONSTANTS.METABOLISM_RATE;
  const hoursUntilSober = currentBAC / metabolismRate;
  const msUntilSober = hoursUntilSober * 60 * 60 * 1000;

  return new Date(Date.now() + msUntilSober);
};

/**
 * Get BAC status information
 * @param {number} bac - Current BAC percentage
 * @returns {Object} Status object with level, message, color, and icon
 */
export const getBACStatus = (bac) => {
  if (bac === 0) {
    return {
      level: 'safe',
      message: 'Sober - Safe to drive',
      color: 'green',
      icon: 'CheckCircle',
    };
  }

  if (bac < 0.02) {
    return {
      level: 'safe',
      message: 'Minimal impairment',
      color: 'green',
      icon: 'CheckCircle',
    };
  }

  if (bac < 0.05) {
    return {
      level: 'caution',
      message: 'Light impairment - Do not drive',
      color: 'yellow',
      icon: 'AlertCircle',
    };
  }

  if (bac < 0.08) {
    return {
      level: 'warning',
      message: 'Moderate impairment - Do not drive',
      color: 'orange',
      icon: 'AlertTriangle',
    };
  }

  if (bac < 0.15) {
    return {
      level: 'danger',
      message: 'Legally intoxicated - Do not drive',
      color: 'red',
      icon: 'ShieldAlert',
    };
  }

  return {
    level: 'danger',
    message: 'Severe intoxication - Seek medical attention',
    color: 'red',
    icon: 'ShieldAlert',
  };
};

/**
 * Calculate standard drinks from oz and ABV
 * @param {number} oz - Fluid ounces
 * @param {number} abv - Alcohol by volume percentage
 * @returns {number} Number of standard drinks
 */
export const calculateStandardDrinks = (oz, abv) => {
  if (!oz || !abv || isNaN(oz) || isNaN(abv)) return 0;
  return (oz * (abv / 100)) / CONSTANTS.STANDARD_DRINK_OZ;
};

/**
 * Validate BAC calculation result
 * @param {number} bac - Calculated BAC
 * @returns {boolean} True if BAC is valid
 */
export const isValidBAC = (bac) => {
  return !isNaN(bac) && isFinite(bac) && bac >= 0 && bac <= 0.5;
};
