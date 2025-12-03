/**
 * Application Constants
 * Centralized configuration values
 */

export const CONSTANTS = {
  // Conservative BAC elimination rate based on Jones, A.W. (2010)
  // "Evidence-based survey of the elimination rates of ethanol from blood with applications in forensic casework"
  // Forensic Science International, 200(1-3), 1-20.
  // Using 10 mg/100mL/h (0.010% per hour) - the lower end of the physiological range
  // for fasted subjects, providing safer, more conservative estimates for sobriety time.
  METABOLISM_RATE: 0.01,

  // Slow metabolism rate (0.005% per hour) - accounting for the margin of error where
  // modern studies show metabolism can be twice as slow for some individuals
  SLOW_METABOLISM_RATE: 0.005,

  GRAMS_PER_STANDARD_DRINK: 14,
  LBS_TO_KG: 0.453592,
  MALE_BODY_WATER: 0.68,
  FEMALE_BODY_WATER: 0.55,
  STANDARD_DRINK_OZ: 0.6,
  LEGAL_LIMIT: 0.08,
  MIN_WEIGHT: 50,
  MAX_WEIGHT: 500,
  ROBOT_MESSAGE_DURATION: 5000,
  JOKE_DURATION: 7000,
  MIN_TIP_AMOUNT: 3,
  LEGAL_DRINKING_AGE: 21,
  REFUND_WINDOW_DAYS: 30,
};

// Environment-based configuration
export const CONFIG = {
  STRIPE_PAYMENT_LINK:
    process.env.REACT_APP_STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/aFa14m7kE8UfdjB00g5sA01',
  SUPPORT_EMAIL: process.env.REACT_APP_SUPPORT_EMAIL || 'drinkbot3000@gmail.com',
};

// Emojis kept here for synchronous use in receipts/services
export const EMOJIS = {
  ROBOT: '\uD83E\uDD16', // 🤖
  HEART: '\uD83D\uDC9A', // 💚
  TOP_HAT: '\uD83C\uDFA9', // 🎩
  SHIELD: '\uD83D\uDEE1\uFE0F', // 🛡️
  WATER: '\uD83D\uDCA7', // 💧
  WIZARD: '\uD83E\uDDD9', // 🧙
  DROPLET: '\uD83D\uDCA6', // 💦
};

// Non-critical jokes and robot messages are in ./messages.js for code splitting
