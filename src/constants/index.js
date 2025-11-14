/**
 * Application Constants
 * Centralized configuration values
 */

/**
 * Core application constants
 */
export const CONSTANTS = {
  // BAC Calculation Constants
  // Conservative BAC elimination rate based on Jones, A.W. (2010)
  // "Evidence-based survey of the elimination rates of ethanol from blood with applications in forensic casework"
  // Forensic Science International, 200(1-3), 1-20.
  // Using 10 mg/100mL/h (0.010% per hour) - the lower end of the physiological range
  // for fasted subjects, providing safer, more conservative estimates for sobriety time.
  METABOLISM_RATE: 0.010,

  // Standard drink definitions (US CDC standard)
  GRAMS_PER_STANDARD_DRINK: 14,
  STANDARD_DRINK_OZ: 0.6,

  // Body water distribution constants (Widmark formula)
  // Source: Widmark, E. M. P. (1932). Die theoretischen Grundlagen und die praktische
  // Verwendbarkeit der gerichtlich-medizinischen Alkoholbestimmung
  MALE_BODY_WATER: 0.68,
  FEMALE_BODY_WATER: 0.55,

  // Conversion constants
  LBS_TO_KG: 0.453592,

  // Safety thresholds
  LEGAL_LIMIT: 0.08,
  IMPAIRMENT_THRESHOLD: 0.02,

  // Input bounds
  MIN_WEIGHT: 50,
  MAX_WEIGHT: 500,
  MIN_AGE: 21,
  MAX_DRINK_OZ: 64,
  MAX_ABV: 100,
  MIN_TIP_AMOUNT: 3,
  MAX_TIP_AMOUNT: 1000,

  // UI timing constants (milliseconds)
  ROBOT_MESSAGE_DURATION: 5000,
  JOKE_DURATION: 7000,
  SPLASH_DURATION: 3000,
  PWA_INSTALL_DELAY: 5000,
  PWA_DISMISS_CACHE_DAYS: 7,

  // Legal/compliance constants
  LEGAL_DRINKING_AGE: 21,
  REFUND_WINDOW_DAYS: 30,

  // Payment link
  STRIPE_PAYMENT_LINK: 'https://buy.stripe.com/aFa14m7kE8UfdjB00g5sA01',

  // Storage keys
  STORAGE_KEYS: {
    TRACKER_DATA: 'bacTrackerData',
    AGE_VERIFIED: 'ageVerified',
    DISCLAIMER_ACCEPTED: 'disclaimerAccepted',
    SAFETY_SCREENS_COMPLETE: 'safetyScreensComplete',
    RECEIPTS: 'bacTrackerReceipts',
    GEO_VERIFIED: 'geoVerified',
    USER_COUNTRY: 'userCountry',
    USER_COUNTRY_CODE: 'userCountryCode',
    PWA_INSTALL_DISMISSED: 'pwa-install-dismissed',
    GEO_RATE_LIMIT: 'geoRateLimitUntil',
    GEO_ERROR_LOGGED: 'geoErrorLogged'
  }
};

/**
 * Predefined drink types with standard measurements
 */
export const DRINK_TYPES = {
  BEER: { name: 'Beer', oz: 12, abv: 5 },
  LIGHT_BEER: { name: 'Light Beer', oz: 12, abv: 4.2 },
  WINE: { name: 'Wine', oz: 5, abv: 12 },
  SHOT: { name: 'Shot', oz: 1.5, abv: 40 },
  MIXED_DRINK: { name: 'Mixed Drink', oz: 4, abv: 15 },
  COCKTAIL: { name: 'Cocktail', oz: 3, abv: 20 },
  HARD_SELTZER: { name: 'Hard Seltzer', oz: 12, abv: 5 },
  MALT_LIQUOR: { name: 'Malt Liquor', oz: 12, abv: 7 },
  CRAFT_BEER: { name: 'Craft Beer', oz: 12, abv: 7 },
  CHAMPAGNE: { name: 'Champagne', oz: 5, abv: 12 }
};

/**
 * Robot messages for user feedback
 */
export const ROBOT_MESSAGES = {
  DRINK_ADDED: 'Drink logged! Stay safe! 🤖',
  DRINK_REMOVED: 'Last drink removed 👍',
  ALL_DRINKS_CLEARED: 'All drinks cleared! Fresh start 🎯',
  CUSTOM_DRINK_SAVED: (name) => `Custom drink "${name}" saved! 💾`,
  CUSTOM_DRINK_DELETED: 'Custom drink deleted 🗑️',
  SETTINGS_SAVED: 'Settings saved! 💾',
  PROFILE_UPDATED: 'Profile updated successfully! 🎉',
  TIP_THANK_YOU: 'Thank you for your support! You\'re awesome! 🙏',
  ERROR_OCCURRED: 'Oops! Something went wrong 😅',
  SHARED_SUCCESS: 'Shared successfully! 📤',
  RECEIPT_DOWNLOADED: 'Receipt downloaded! 📄',
  WEIGHT_LOCKED: 'Weight is now locked for safety 🔒',
  INVALID_INPUT: 'Please check your input 🤔',
  NETWORK_ERROR: 'Network error. Please check your connection 📡',
  STORAGE_FULL: 'Storage full. Some data may not be saved ⚠️'
};

/**
 * Jokes for entertainment
 */
export const JOKES = [
  "Why did the hipster burn his mouth? He drank his coffee before it was cool!",
  "I'm not drunk, I'm just chemically off-balanced! 🧪",
  "Water is the cure for hangovers. The trick is to drink it BEFORE bed! 💧",
  "I'm not an alcoholic, I'm a quality control expert! 🍷",
  "Alcohol: Because no great story ever started with someone eating a salad! 🥗",
  "I only drink on days that end in 'Y'... wait, what?! 📅",
  "Beer: Helping ugly people have fun since 1862! 🍺",
  "I'm on a whiskey diet. I've lost three days already! 🥃",
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "I told my wife she was drawing her eyebrows too high. She looked surprised! 😮"
];

/**
 * Safety warning messages
 */
export const SAFETY_MESSAGES = {
  DUI_WARNING: 'DO NOT DRIVE if you have consumed ANY alcohol. You can be impaired to ANY degree.',
  IMPAIRED_WARNING: 'You are currently impaired. DO NOT drive, operate machinery, or make important decisions.',
  BENZOS_WARNING: 'NEVER mix alcohol with benzodiazepines (Xanax, Valium, Ativan, Klonopin). This combination can be FATAL.',
  OPIATES_WARNING: 'NEVER mix alcohol with opiates (pain pills, codeine, morphine). This combination can be FATAL.',
  SLEEP_WARNING: 'DO NOT sleep on your back if highly intoxicated. Sleep on your side to prevent choking.',
  ESTIMATION_DISCLAIMER: 'This is an ESTIMATE. Individual metabolism varies. When in doubt, DO NOT drive.',
  UNDER_LIMIT_WARNING: 'Even below 0.08%, you can still be impaired and arrested for DUI.',
  MEDICATION_WARNING: 'Many medications interact dangerously with alcohol. Always check with your doctor.'
};

/**
 * BAC status levels with colors and descriptions
 */
export const BAC_LEVELS = {
  ZERO: {
    range: [0, 0],
    label: 'Sober',
    color: 'green',
    description: 'No alcohol in system',
    canDrive: true
  },
  MINIMAL: {
    range: [0.01, 0.029],
    label: 'Minimal Impairment',
    color: 'yellow',
    description: 'Slight impairment of judgment',
    canDrive: false
  },
  MILD: {
    range: [0.03, 0.059],
    label: 'Mild Impairment',
    color: 'yellow',
    description: 'Noticeable impairment of coordination',
    canDrive: false
  },
  MODERATE: {
    range: [0.06, 0.079],
    label: 'Moderate Impairment',
    color: 'orange',
    description: 'Significant impairment of judgment and coordination',
    canDrive: false
  },
  LEGALLY_IMPAIRED: {
    range: [0.08, 0.099],
    label: 'LEGALLY IMPAIRED',
    color: 'red',
    description: 'Over legal limit. Severe impairment.',
    canDrive: false
  },
  HIGH: {
    range: [0.10, 0.199],
    label: 'HIGH IMPAIRMENT',
    color: 'red',
    description: 'Dangerously intoxicated',
    canDrive: false
  },
  VERY_HIGH: {
    range: [0.20, 0.299],
    label: 'VERY HIGH - DANGEROUS',
    color: 'red',
    description: 'Extremely dangerous. Seek help immediately.',
    canDrive: false
  },
  CRITICAL: {
    range: [0.30, Infinity],
    label: 'CRITICAL - CALL 911',
    color: 'red',
    description: 'Life-threatening. Call emergency services NOW.',
    canDrive: false
  }
};

/**
 * App modes
 */
export const APP_MODES = {
  LIVE: 'live',
  ESTIMATE: 'estimate'
};

/**
 * Tab types
 */
export const TAB_TYPES = {
  TRACKER: 'tracker',
  CALCULATOR: 'calculator'
};

/**
 * Gender options
 */
export const GENDER_OPTIONS = {
  MALE: 'male',
  FEMALE: 'female'
};

export default CONSTANTS;
