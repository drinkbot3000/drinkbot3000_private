/**
 * Blood Alcohol Content (BAC) calculation utilities
 */

import { BAC_CONSTANTS, GENDERS } from '../constants/index.js';

/**
 * Get the body water constant based on gender
 * @param {string} gender - 'male' or 'female'
 * @returns {number} Body water constant
 */
export const getBodyWaterConstant = (gender) => {
  return gender === GENDERS.MALE
    ? BAC_CONSTANTS.MALE_BODY_WATER
    : BAC_CONSTANTS.FEMALE_BODY_WATER;
};

/**
 * Calculate BAC from drinks array (live tracking mode)
 * @param {Array} drinks - Array of drink objects with timestamp and standardDrinks
 * @param {number} weight - Weight in pounds
 * @param {string} gender - 'male' or 'female'
 * @returns {number} Current BAC percentage
 */
export const calculateBACFromDrinks = (drinks, weight, gender) => {
  if (!drinks || drinks.length === 0) return 0;
  if (!weight || !gender) return 0;

  const weightKg = parseFloat(weight) * BAC_CONSTANTS.LBS_TO_KG;
  const bodyWater = getBodyWaterConstant(gender);
  const currentTime = Date.now();

  let adjustedBAC = 0;

  drinks.forEach(drink => {
    const standardDrinks = drink.standardDrinks || 1;
    const alcoholGrams = standardDrinks * BAC_CONSTANTS.GRAMS_PER_STANDARD_DRINK;
    const hoursElapsed = (currentTime - drink.timestamp) / (1000 * 60 * 60);

    // Calculate initial BAC from this drink
    const drinkBAC = (alcoholGrams / (weightKg * bodyWater * 1000)) * 100;

    // Subtract metabolized alcohol
    const metabolized = BAC_CONSTANTS.METABOLISM_RATE * hoursElapsed;
    const currentDrinkBAC = Math.max(0, drinkBAC - metabolized);

    adjustedBAC += currentDrinkBAC;
  });

  return Math.max(0, adjustedBAC);
};

/**
 * Calculate BAC from total drinks and hours (estimate mode)
 * @param {number} numDrinks - Total number of standard drinks
 * @param {number} hours - Hours since first drink
 * @param {number} weight - Weight in pounds
 * @param {string} gender - 'male' or 'female'
 * @returns {number} Estimated BAC percentage
 */
export const calculateBACFromEstimate = (numDrinks, hours, weight, gender) => {
  if (!numDrinks || !hours || !weight || !gender) return 0;

  const weightKg = parseFloat(weight) * BAC_CONSTANTS.LBS_TO_KG;
  const bodyWater = getBodyWaterConstant(gender);

  const totalAlcoholGrams = parseFloat(numDrinks) * BAC_CONSTANTS.GRAMS_PER_STANDARD_DRINK;
  const initialBAC = (totalAlcoholGrams / (weightKg * bodyWater * 1000)) * 100;
  const metabolized = BAC_CONSTANTS.METABOLISM_RATE * parseFloat(hours);

  return Math.max(0, initialBAC - metabolized);
};

/**
 * Calculate number of standard drinks from volume and ABV
 * @param {number} volumeOz - Volume in ounces
 * @param {number} abv - Alcohol by volume percentage
 * @returns {number} Number of standard drinks
 */
export const calculateStandardDrinks = (volumeOz, abv) => {
  const pureAlcoholOz = parseFloat(volumeOz) * (parseFloat(abv) / 100);
  return pureAlcoholOz / BAC_CONSTANTS.STANDARD_DRINK_OZ;
};

/**
 * Get the time when user will be sober (BAC = 0)
 * @param {number} bac - Current BAC percentage
 * @returns {Date|null} Estimated sober time, or null if already sober
 */
export const getSoberTime = (bac) => {
  if (bac === 0) return null;

  const minutesToSober = Math.ceil((bac / BAC_CONSTANTS.METABOLISM_RATE) * 60);
  return new Date(Date.now() + minutesToSober * 60000);
};

/**
 * Validate weight input
 * @param {number|string} weight - Weight in pounds
 * @returns {string} Error message, or empty string if valid
 */
export const validateWeight = (weight) => {
  const w = parseFloat(weight);

  if (isNaN(w)) {
    return 'Please enter a valid number';
  }
  if (w < BAC_CONSTANTS.MIN_WEIGHT) {
    return `Weight must be at least ${BAC_CONSTANTS.MIN_WEIGHT} lbs`;
  }
  if (w > BAC_CONSTANTS.MAX_WEIGHT) {
    return `Weight must be less than ${BAC_CONSTANTS.MAX_WEIGHT} lbs`;
  }

  return '';
};
