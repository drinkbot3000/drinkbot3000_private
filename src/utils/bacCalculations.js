/**
 * BAC Calculation Utilities
 * Implements Widmark formula with conservative metabolism rates
 *
 * References:
 * - Widmark, E. M. P. (1932). Die theoretischen Grundlagen und die praktische Verwendbarkeit
 *   der gerichtlich-medizinischen Alkoholbestimmung
 * - Jones, A.W. (2010). Evidence-based survey of the elimination rates of ethanol from blood
 *   with applications in forensic casework. Forensic Science International, 200(1-3), 1-20.
 */

import { CONSTANTS, BAC_LEVELS } from '../constants';

/**
 * Get body water distribution constant based on gender
 * Males have higher body water percentage than females
 *
 * @param {string} gender - 'male' or 'female'
 * @returns {number} Body water constant
 *
 * @example
 * getBodyWaterConstant('male')  // Returns: 0.68
 * getBodyWaterConstant('female') // Returns: 0.55
 */
export const getBodyWaterConstant = (gender) => {
  return gender === 'male'
    ? CONSTANTS.MALE_BODY_WATER
    : CONSTANTS.FEMALE_BODY_WATER;
};

/**
 * Calculate standard drinks from volume and ABV
 *
 * @param {number} oz - Volume in ounces
 * @param {number} abv - Alcohol by volume percentage
 * @returns {number} Number of standard drinks
 *
 * @example
 * calculateStandardDrinks(12, 5) // 12oz beer at 5% ABV
 * // Returns: ~1.0 standard drinks
 */
export const calculateStandardDrinks = (oz, abv) => {
  if (!oz || !abv || oz <= 0 || abv <= 0) {
    return 0;
  }

  // Formula: (oz * ABV% / 100) / standard drink oz
  const alcoholOz = (oz * abv) / 100;
  const standardDrinks = alcoholOz / CONSTANTS.STANDARD_DRINK_OZ;

  return Math.max(0, standardDrinks);
};

/**
 * Calculate total grams of alcohol consumed
 *
 * @param {Array} drinks - Array of drink objects with standardDrinks property
 * @returns {number} Total grams of alcohol
 */
export const calculateTotalAlcoholGrams = (drinks) => {
  if (!Array.isArray(drinks) || drinks.length === 0) {
    return 0;
  }

  const totalStandardDrinks = drinks.reduce((sum, drink) => {
    return sum + (drink.standardDrinks || 0);
  }, 0);

  return totalStandardDrinks * CONSTANTS.GRAMS_PER_STANDARD_DRINK;
};

/**
 * Calculate elapsed time since drinking started
 *
 * @param {number} startTime - Timestamp when first drink was consumed
 * @returns {number} Hours elapsed (can be fractional)
 */
export const calculateElapsedHours = (startTime) => {
  if (!startTime) {
    return 0;
  }

  const elapsedMs = Date.now() - startTime;
  const elapsedHours = elapsedMs / (1000 * 60 * 60);

  return Math.max(0, elapsedHours);
};

/**
 * Calculate current BAC using Widmark formula
 * BAC = (A × 5.14 / (W × r)) - (β × t)
 * Where:
 *   A = grams of alcohol consumed
 *   W = body weight in kg
 *   r = body water constant (gender-specific)
 *   β = metabolism rate (0.010% per hour - conservative)
 *   t = time elapsed in hours
 *
 * @param {Object} params - Calculation parameters
 * @param {string} params.gender - 'male' or 'female'
 * @param {number} params.weight - Weight in pounds
 * @param {Array} params.drinks - Array of drink objects
 * @param {number} params.startTime - Timestamp of first drink
 * @param {string} params.mode - 'live' or 'estimate'
 * @param {number} params.estimateDrinks - For estimate mode: number of drinks
 * @param {number} params.estimateHours - For estimate mode: hours elapsed
 * @returns {number} Current BAC percentage (0.000 to potentially > 0.400)
 *
 * @example
 * calculateBAC({
 *   gender: 'male',
 *   weight: 180,
 *   drinks: [{ standardDrinks: 1 }, { standardDrinks: 1 }],
 *   startTime: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
 *   mode: 'live'
 * })
 * // Returns: ~0.032 (approximate, varies by exact timing)
 */
export const calculateBAC = (params) => {
  try {
    const { gender, weight, drinks, startTime, mode, estimateDrinks, estimateHours } = params;

    // Defensive checks
    if (!gender || !weight) {
      return 0;
    }

    const numWeight = parseFloat(weight);
    if (isNaN(numWeight) || numWeight <= 0) {
      return 0;
    }

    // Calculate based on mode
    let gramsAlcohol = 0;
    let hoursElapsed = 0;

    if (mode === 'estimate') {
      // Estimate mode: use provided values
      const numDrinks = parseFloat(estimateDrinks);
      const numHours = parseFloat(estimateHours);

      if (isNaN(numDrinks) || numDrinks <= 0) {
        return 0;
      }

      gramsAlcohol = numDrinks * CONSTANTS.GRAMS_PER_STANDARD_DRINK;
      hoursElapsed = isNaN(numHours) ? 0 : Math.max(0, numHours);

    } else {
      // Live mode: calculate from actual drinks logged
      if (!Array.isArray(drinks) || drinks.length === 0) {
        return 0;
      }

      gramsAlcohol = calculateTotalAlcoholGrams(drinks);
      hoursElapsed = calculateElapsedHours(startTime);
    }

    if (gramsAlcohol <= 0) {
      return 0;
    }

    // Widmark formula
    const weightKg = numWeight * CONSTANTS.LBS_TO_KG;
    const bodyWaterConstant = getBodyWaterConstant(gender);

    // Peak BAC calculation
    const peakBAC = (gramsAlcohol * 5.14) / (weightKg * bodyWaterConstant);

    // Account for metabolism over time
    const metabolizedBAC = CONSTANTS.METABOLISM_RATE * hoursElapsed;

    // Current BAC
    const currentBAC = peakBAC - metabolizedBAC;

    // BAC cannot be negative
    return Math.max(0, currentBAC);

  } catch (error) {
    console.error('Error calculating BAC:', error);
    return 0;
  }
};

/**
 * Get estimated time until sober (BAC = 0)
 *
 * @param {number} currentBAC - Current BAC percentage
 * @returns {Date|null} Estimated time when BAC reaches 0, or null if already sober
 *
 * @example
 * getSoberTime(0.08)
 * // Returns: Date object ~8 hours in the future
 */
export const getSoberTime = (currentBAC) => {
  if (!currentBAC || currentBAC <= 0) {
    return null;
  }

  const hoursUntilSober = currentBAC / CONSTANTS.METABOLISM_RATE;
  const soberTime = new Date(Date.now() + (hoursUntilSober * 60 * 60 * 1000));

  return soberTime;
};

/**
 * Get BAC status object with color, label, and driving safety
 *
 * @param {number} bac - Current BAC percentage
 * @returns {Object} Status object with color, label, message, canDrive
 *
 * @example
 * getBACStatus(0.05)
 * // Returns: {
 * //   level: 'MILD',
 * //   color: 'yellow',
 * //   label: 'Mild Impairment',
 * //   description: 'Noticeable impairment of coordination',
 * //   canDrive: false,
 * //   warning: 'DO NOT DRIVE'
 * // }
 */
export const getBACStatus = (bac) => {
  const numBAC = parseFloat(bac);

  if (isNaN(numBAC) || numBAC < 0) {
    return {
      level: 'ZERO',
      ...BAC_LEVELS.ZERO,
      warning: null
    };
  }

  // Find appropriate level
  for (const [level, config] of Object.entries(BAC_LEVELS)) {
    const [min, max] = config.range;
    if (numBAC >= min && numBAC <= max) {
      return {
        level,
        ...config,
        warning: config.canDrive ? null : 'DO NOT DRIVE'
      };
    }
  }

  // Default to ZERO if no match
  return {
    level: 'ZERO',
    ...BAC_LEVELS.ZERO,
    warning: null
  };
};

/**
 * Format BAC for display
 *
 * @param {number} bac - BAC percentage
 * @param {number} decimals - Number of decimal places (default: 3)
 * @returns {string} Formatted BAC string
 *
 * @example
 * formatBAC(0.08534) // Returns: "0.085"
 * formatBAC(0.08534, 2) // Returns: "0.09"
 */
export const formatBAC = (bac, decimals = 3) => {
  const numBAC = parseFloat(bac);

  if (isNaN(numBAC) || numBAC < 0) {
    return '0.000';
  }

  return numBAC.toFixed(decimals);
};

/**
 * Format time duration in human-readable format
 *
 * @param {number} hours - Duration in hours
 * @returns {string} Formatted duration
 *
 * @example
 * formatDuration(1.5) // Returns: "1h 30m"
 * formatDuration(0.25) // Returns: "15m"
 */
export const formatDuration = (hours) => {
  if (!hours || hours <= 0) {
    return '0m';
  }

  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (h === 0) {
    return `${m}m`;
  }

  if (m === 0) {
    return `${h}h`;
  }

  return `${h}h ${m}m`;
};

/**
 * Check if user is currently impaired (any BAC > 0)
 *
 * @param {number} bac - Current BAC
 * @returns {boolean} True if impaired
 */
export const isImpaired = (bac) => {
  return parseFloat(bac) > CONSTANTS.IMPAIRMENT_THRESHOLD;
};

/**
 * Check if BAC is over legal limit
 *
 * @param {number} bac - Current BAC
 * @returns {boolean} True if over legal limit
 */
export const isOverLegalLimit = (bac) => {
  return parseFloat(bac) >= CONSTANTS.LEGAL_LIMIT;
};

/**
 * Estimate BAC from number of drinks and time (quick calculator)
 *
 * @param {Object} params - Calculation parameters
 * @param {string} params.gender - Gender
 * @param {number} params.weight - Weight in pounds
 * @param {number} params.drinks - Number of standard drinks
 * @param {number} params.hours - Hours since first drink
 * @returns {number} Estimated BAC
 */
export const estimateBAC = (params) => {
  return calculateBAC({
    ...params,
    mode: 'estimate',
    estimateDrinks: params.drinks,
    estimateHours: params.hours,
    drinks: [],
    startTime: null
  });
};
