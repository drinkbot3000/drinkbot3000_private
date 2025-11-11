import CONSTANTS from '../constants/appConstants';

/**
 * Get body water constant based on gender
 * @param {string} gender - 'male' or 'female'
 * @returns {number} Body water constant
 */
export const getBodyWaterConstant = (gender) =>
  gender === 'male' ? CONSTANTS.MALE_BODY_WATER : CONSTANTS.FEMALE_BODY_WATER;

/**
 * Calculate BAC based on mode, drinks, and user data
 * @param {Object} params - Calculation parameters
 * @returns {number} Calculated BAC
 */
export const calculateBAC = ({ mode, gender, weight, drinks, startTime, estimateDrinks, estimateHours }) => {
  if (mode === 'estimate') {
    if (!estimateDrinks || !estimateHours) return 0;

    const weightKg = parseFloat(weight) * CONSTANTS.LBS_TO_KG;
    const bodyWater = getBodyWaterConstant(gender);
    const numDrinks = parseFloat(estimateDrinks);
    const hours = parseFloat(estimateHours);

    const totalAlcoholGrams = numDrinks * CONSTANTS.GRAMS_PER_STANDARD_DRINK;
    const initialBAC = (totalAlcoholGrams / (weightKg * bodyWater * 1000)) * 100;
    const metabolized = CONSTANTS.METABOLISM_RATE * hours;

    return Math.max(0, initialBAC - metabolized);
  }

  if (mode === 'live') {
    if (!startTime || drinks.length === 0) return 0;

    const weightKg = parseFloat(weight) * CONSTANTS.LBS_TO_KG;
    const bodyWater = getBodyWaterConstant(gender);
    const currentTime = Date.now();

    let adjustedBAC = 0;

    drinks.forEach(drink => {
      const standardDrinks = drink.standardDrinks || 1;
      const alcoholGrams = standardDrinks * CONSTANTS.GRAMS_PER_STANDARD_DRINK;
      const hoursElapsed = (currentTime - drink.timestamp) / (1000 * 60 * 60);

      const drinkBAC = (alcoholGrams / (weightKg * bodyWater * 1000)) * 100;
      const metabolized = CONSTANTS.METABOLISM_RATE * hoursElapsed;
      const currentDrinkBAC = Math.max(0, drinkBAC - metabolized);

      adjustedBAC += currentDrinkBAC;
    });

    return Math.max(0, adjustedBAC);
  }

  return 0;
};

/**
 * Get BAC status information
 * @param {number} bac - Current BAC value
 * @returns {Object} Status information
 */
export const getBACStatus = (bac) => {
  if (bac === 0) {
    return {
      label: 'Sober',
      message: 'You are sober. Safe to drive.',
      bgColor: 'bg-gradient-to-br from-green-500 to-emerald-600',
      textColor: 'text-green-600',
      lightBg: 'bg-green-50'
    };
  }
  if (bac < 0.03) {
    return {
      label: 'Mild',
      message: 'Slight impairment. DO NOT DRIVE.',
      bgColor: 'bg-gradient-to-br from-yellow-500 to-amber-600',
      textColor: 'text-yellow-600',
      lightBg: 'bg-yellow-50'
    };
  }
  if (bac < CONSTANTS.LEGAL_LIMIT) {
    return {
      label: 'Impaired',
      message: 'Significantly impaired. NEVER DRIVE.',
      bgColor: 'bg-gradient-to-br from-orange-500 to-red-500',
      textColor: 'text-orange-600',
      lightBg: 'bg-orange-50'
    };
  }
  return {
    label: 'Intoxicated',
    message: 'Highly intoxicated. DANGER ZONE.',
    bgColor: 'bg-gradient-to-br from-red-600 to-red-700',
    textColor: 'text-red-600',
    lightBg: 'bg-red-50'
  };
};
