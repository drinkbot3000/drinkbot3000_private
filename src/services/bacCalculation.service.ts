/**
 * BAC Calculation Service
 * Pure functions for Blood Alcohol Content calculations
 * All functions are testable and side-effect free with strong type safety
 */

import { CONSTANTS } from '../constants';
import type { Gender, Drink } from '../types';

/**
 * BAC status levels
 */
export type BACLevel = 'safe' | 'caution' | 'warning' | 'danger';

/**
 * BAC status information
 */
export interface BACStatus {
  level: BACLevel;
  message: string;
  color: string;
  icon: string;
}

/**
 * BAC calculation parameters
 */
export interface BACCalculationParams {
  drinks: Drink[];
  weight: number;
  gender: Gender;
  useSlowMetabolism?: boolean;
}

/**
 * Main BAC calculation parameters
 */
export interface MainBACParams extends BACCalculationParams {
  startTime: number | null;
}

/**
 * Get body water constant based on gender
 * @param gender - 'male' or 'female'
 * @returns Body water constant
 */
export const getBodyWaterConstant = (gender: Gender): number => {
  return gender === 'male' ? CONSTANTS.MALE_BODY_WATER : CONSTANTS.FEMALE_BODY_WATER;
};

/**
 * Calculate BAC for live tracking
 * @param params - Calculation parameters
 * @returns BAC percentage
 */
export const calculateLiveBAC = ({
  drinks,
  weight,
  gender,
  useSlowMetabolism = false,
}: BACCalculationParams): number => {
  if (!drinks || drinks.length === 0 || !weight || !gender) return 0;
  if (isNaN(weight) || weight <= 0) return 0;

  const weightKg = weight * CONSTANTS.LBS_TO_KG;
  const bodyWater = getBodyWaterConstant(gender);
  const currentTime = Date.now();
  const metabolismRate = useSlowMetabolism
    ? CONSTANTS.SLOW_METABOLISM_RATE
    : CONSTANTS.METABOLISM_RATE;

  let adjustedBAC = 0;

  drinks.forEach((drink) => {
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
 * @param params - Calculation parameters including start time
 * @returns BAC percentage
 */
export const calculateBAC = ({
  gender,
  weight,
  drinks,
  startTime,
  useSlowMetabolism = false,
}: MainBACParams): number => {
  try {
    // Defensive checks for required data
    if (!gender || !weight) return 0;

    const weightValue = parseFloat(String(weight));
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
 * @param currentBAC - Current BAC percentage
 * @param useSlowMetabolism - Use slow metabolism rate
 * @returns Estimated sober time
 */
export const calculateSoberTime = (
  currentBAC: number,
  useSlowMetabolism = false
): Date => {
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
 * @param bac - Current BAC percentage
 * @returns Status object with level, message, color, and icon
 */
export const getBACStatus = (bac: number): BACStatus => {
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
 * @param oz - Fluid ounces
 * @param abv - Alcohol by volume percentage
 * @returns Number of standard drinks
 */
export const calculateStandardDrinks = (oz: number, abv: number): number => {
  if (!oz || !abv || isNaN(oz) || isNaN(abv)) return 0;
  return (oz * (abv / 100)) / CONSTANTS.STANDARD_DRINK_OZ;
};

/**
 * Validate BAC calculation result
 * @param bac - Calculated BAC
 * @returns True if BAC is valid
 */
export const isValidBAC = (bac: number): boolean => {
  return !isNaN(bac) && isFinite(bac) && bac >= 0 && bac <= 0.5;
};
