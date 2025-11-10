/**
 * Application Constants
 * Centralized location for all constant values used throughout the app
 */

/**
 * BAC Calculation Constants
 * Based on Widmark formula and standard metabolism rates
 */
export const BAC_CONSTANTS = {
  // Average alcohol metabolism rate (% BAC per hour)
  METABOLISM_RATE: 0.015,

  // Grams of alcohol in one standard drink (US definition)
  GRAMS_PER_STANDARD_DRINK: 14,

  // Conversion factor: pounds to kilograms
  LBS_TO_KG: 0.453592,

  // Body water content by gender (used in Widmark formula)
  MALE_BODY_WATER: 0.68,
  FEMALE_BODY_WATER: 0.55,

  // Fluid ounces of pure alcohol in a standard drink
  STANDARD_DRINK_OZ: 0.6,

  // Legal BAC limit in most US states
  LEGAL_LIMIT: 0.08,
};

/**
 * Validation Constants
 */
export const VALIDATION = {
  // Weight bounds (pounds)
  MIN_WEIGHT: 50,
  MAX_WEIGHT: 500,

  // Age requirement
  LEGAL_DRINKING_AGE: 21,

  // Payment minimums
  MIN_TIP_AMOUNT: 3,

  // Refund window (days)
  REFUND_WINDOW_DAYS: 30,
};

/**
 * UI Timing Constants (milliseconds)
 */
export const TIMING = {
  // Robot message display duration
  ROBOT_MESSAGE_DURATION: 5000,

  // Joke display duration
  JOKE_DURATION: 7000,

  // PWA install prompt delay
  PWA_PROMPT_DELAY: 5000,

  // PWA install prompt dismissal period (milliseconds in 7 days)
  PWA_DISMISS_PERIOD: 7 * 24 * 60 * 60 * 1000,

  // BAC update interval
  BAC_UPDATE_INTERVAL: 1000,

  // Service worker update check interval
  SW_UPDATE_INTERVAL: 60000,
};

/**
 * LocalStorage Keys
 * Centralized to prevent typos and make refactoring easier
 */
export const STORAGE_KEYS = {
  TRACKER_DATA: 'bacTrackerData',
  RECEIPTS: 'bacTrackerReceipts',
  AGE_VERIFIED: 'ageVerified',
  DISCLAIMER_ACCEPTED: 'disclaimerAccepted',
  SAFETY_SCREENS_COMPLETE: 'safetyScreensComplete',
  PWA_INSTALL_DISMISSED: 'pwa-install-dismissed',
};

/**
 * HTTP Status Codes
 * For future API integration
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

/**
 * Standard Drink Definitions
 * Common drink types and their standard drink equivalents
 */
export const STANDARD_DRINKS = {
  BEER_12OZ_5ABV: 1.0, // 12 oz beer at 5% ABV
  WINE_5OZ_12ABV: 1.0, // 5 oz wine at 12% ABV
  SHOT_1_5OZ_40ABV: 1.0, // 1.5 oz spirits at 40% ABV (80 proof)
  MALT_LIQUOR_8OZ_7ABV: 1.0, // 8-9 oz malt liquor at 7% ABV
  HARD_SELTZER_12OZ_5ABV: 1.0, // 12 oz hard seltzer at 5% ABV
};

/**
 * Payment Processing Constants
 * For future Stripe integration
 */
export const PAYMENT = {
  STRIPE_FEE_PERCENTAGE: 0.029, // 2.9%
  STRIPE_FEE_FIXED: 0.30, // $0.30
  CURRENCY: 'USD',
  MIN_AMOUNT: 3, // Minimum payment amount
  MAX_AMOUNT: 10000, // Maximum payment amount
};

/**
 * BAC Level Descriptions
 * Educational information about BAC levels and effects
 */
export const BAC_LEVELS = {
  SOBER: {
    threshold: 0,
    label: 'Sober',
    color: '#10B981', // green
    description: 'No alcohol in system',
  },
  MILD: {
    threshold: 0.03,
    label: 'Mild Effects',
    color: '#F59E0B', // yellow
    description: 'Slight impairment of judgment and coordination',
  },
  IMPAIRED: {
    threshold: 0.05,
    label: 'Impaired',
    color: '#F97316', // orange
    description: 'Reduced coordination, impaired judgment. DO NOT DRIVE.',
  },
  LEGALLY_IMPAIRED: {
    threshold: 0.08,
    label: 'Legally Intoxicated',
    color: '#EF4444', // red
    description: 'Illegal to drive. Severely impaired. Seek safe transportation.',
  },
  DANGEROUS: {
    threshold: 0.15,
    label: 'Dangerous',
    color: '#DC2626', // dark red
    description: 'Extremely dangerous. Risk of blackout, injury. Seek medical help.',
  },
};

/**
 * Safety Numbers (US)
 * Emergency contacts and resources
 */
export const EMERGENCY = {
  EMERGENCY: '911',
  SUICIDE_PREVENTION: '988',
  SUBSTANCE_ABUSE_HELPLINE: '1-800-662-4357',
  POISON_CONTROL: '1-800-222-1222',
};

/**
 * App Metadata
 */
export const APP = {
  NAME: 'DrinkBot3000',
  VERSION: '1.0.0',
  DESCRIPTION: 'Responsible Drinking Companion',
  AUTHOR: 'DrinkBot3000',
  SUPPORT_EMAIL: 'support@drinkbot3000.com',
  WEBSITE: 'https://drinkbot3000.netlify.app',
};

/**
 * Feature Flags
 * Enable/disable features easily
 */
export const FEATURES = {
  PWA_INSTALL_PROMPT: true,
  RECEIPT_GENERATION: true,
  ANALYTICS: false,
  TIPS: true,
  JOKES: true,
  ROBOT_MESSAGES: true,
  CUSTOM_DRINKS: true,
};

/**
 * Regular Expressions
 */
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_US: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
  NUMBER_ONLY: /^[0-9]*\.?[0-9]*$/,
};

export default {
  BAC_CONSTANTS,
  VALIDATION,
  TIMING,
  STORAGE_KEYS,
  HTTP_STATUS,
  STANDARD_DRINKS,
  PAYMENT,
  BAC_LEVELS,
  EMERGENCY,
  APP,
  FEATURES,
  REGEX,
};
