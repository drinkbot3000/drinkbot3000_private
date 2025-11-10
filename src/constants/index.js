/**
 * Application constants for BAC calculations and configuration
 */

export const BAC_CONSTANTS = {
  // Metabolism and calculation constants
  METABOLISM_RATE: 0.015, // BAC decrease per hour
  GRAMS_PER_STANDARD_DRINK: 14, // Grams of pure alcohol per standard drink
  LBS_TO_KG: 0.453592, // Conversion factor
  MALE_BODY_WATER: 0.68, // Body water percentage for males
  FEMALE_BODY_WATER: 0.55, // Body water percentage for females
  STANDARD_DRINK_OZ: 0.6, // Ounces of pure alcohol per standard drink

  // Legal and safety thresholds
  LEGAL_LIMIT: 0.08, // Legal BAC limit in most US states
  MILD_THRESHOLD: 0.03, // Threshold for mild impairment

  // Validation constraints
  MIN_WEIGHT: 50, // Minimum weight in lbs
  MAX_WEIGHT: 500, // Maximum weight in lbs
  MIN_ABV: 0, // Minimum alcohol by volume percentage
  MAX_ABV: 100, // Maximum alcohol by volume percentage

  // UI timing
  ROBOT_MESSAGE_DURATION: 5000, // Duration to show robot messages (ms)
  JOKE_DURATION: 5000, // Duration to show jokes (ms)
  UPDATE_INTERVAL: 1000, // BAC update interval (ms)
};

export const DRINK_PRESETS = {
  BEER_5: { abv: 5, label: '5% (Regular Beer)' },
  BEER_7: { abv: 7, label: '7% (IPA)' },
  BEER_9: { abv: 9, label: '9% (Strong Beer)' },
  WINE_12: { abv: 12, label: '12% (Wine)' },
  WINE_15: { abv: 15, label: '15% (Fortified Wine)' },
  LIQUOR_20: { abv: 20, label: '20% (Liqueur)' },
  LIQUOR_40: { abv: 40, label: '40% (Spirits)' },
  LIQUOR_55: { abv: 55, label: '55% (Cask Strength)' },
  LIQUOR_75: { abv: 75.5, label: '75.5% (Overproof)' },
  LIQUOR_95: { abv: 95, label: '95% (Everclear)' },
};

export const TAB_NAMES = {
  TRACKER: 'tracker',
  CALCULATOR: 'calculator',
  SETTINGS: 'settings',
};

export const MODES = {
  LIVE: 'live',
  ESTIMATE: 'estimate',
};

export const GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
};

export const BAC_STATUS_LEVELS = {
  SOBER: 'sober',
  MILD: 'mild',
  IMPAIRED: 'impaired',
  INTOXICATED: 'intoxicated',
};
