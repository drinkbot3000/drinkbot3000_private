/**
 * Type definitions and interfaces
 * JSDoc types for better IDE support (will migrate to TypeScript later)
 */

/**
 * @typedef {'male' | 'female'} Gender
 */

/**
 * @typedef {'tracker' | 'calculator'} ActiveTab
 */

/**
 * @typedef {Object} Drink
 * @property {string} id - Unique identifier
 * @property {string} name - Drink name
 * @property {number} oz - Fluid ounces
 * @property {number} abv - Alcohol by volume percentage
 * @property {number} standardDrinks - Calculated standard drinks
 * @property {number} timestamp - Time drink was added
 */

/**
 * @typedef {Object} CustomDrink
 * @property {string} id - Unique identifier
 * @property {string} name - Custom drink name
 * @property {number} oz - Fluid ounces
 * @property {number} abv - Alcohol by volume percentage
 */

/**
 * @typedef {Object} Receipt
 * @property {string} id - Receipt number
 * @property {string} date - ISO date string
 * @property {number} amount - Payment amount
 * @property {string} stripeFee - Processing fee
 * @property {string} netAmount - Net amount after fees
 * @property {string} paymentMethod - Payment method used
 * @property {string} description - Transaction description
 * @property {string} status - Payment status
 * @property {string} refundableUntil - ISO date string for refund deadline
 */

/**
 * @typedef {Object} AppState
 * @property {boolean} ageVerified
 * @property {boolean} setupComplete
 * @property {Gender} gender
 * @property {string} weight
 * @property {number} bac
 * @property {Drink[]} drinks
 * @property {number|null} startTime
 * @property {string} currentJoke
 * @property {boolean} showJoke
 * @property {ActiveTab} activeTab
 * @property {string} calcDrinks
 * @property {string} calcHours
 * @property {number|null} calcBAC
 * @property {boolean} showSettings
 * @property {boolean} showHelp
 * @property {string} customDrinkOz
 * @property {string} customDrinkABV
 * @property {string} customDrinkName
 * @property {boolean} showCustomDrink
 * @property {CustomDrink[]} savedCustomDrinks
 * @property {string} robotMessage
 * @property {boolean} showSplash
 * @property {boolean} showConfirmModal
 * @property {string} confirmModalMessage
 * @property {Function|null} confirmModalAction
 * @property {boolean} showDrinkHistory
 * @property {string} weightError
 * @property {string} customTipAmount
 * @property {boolean} showDisclaimerModal
 * @property {boolean} disclaimerAccepted
 * @property {string} tipError
 * @property {boolean} showRefundPolicy
 * @property {boolean} showReceipt
 * @property {Receipt|null} currentReceipt
 * @property {Receipt[]} receipts
 * @property {number} currentSafetyScreen
 * @property {boolean} safetyScreensComplete
 * @property {boolean} showGeoConsent
 * @property {boolean} geoConsentGiven
 * @property {boolean} geoVerified
 * @property {boolean} geoBlocked
 * @property {string} geoCountry
 * @property {string|null} geoError
 * @property {boolean} geoVerifying
 * @property {boolean} geoTechnicalError
 * @property {Gender} settingsEditGender
 * @property {string} settingsEditWeight
 * @property {boolean} settingsEditMode
 * @property {boolean} hasBeenImpaired
 * @property {boolean} useSlowMetabolism
 */

/**
 * @typedef {Object} BACCalculationParams
 * @property {Gender} gender
 * @property {number} weight - Weight in pounds
 * @property {Drink[]} drinks
 * @property {number|null} startTime
 * @property {boolean} useSlowMetabolism
 */

/**
 * @typedef {Object} BACStatus
 * @property {string} level - Status level: 'safe', 'caution', 'warning', 'danger'
 * @property {string} message - Status message
 * @property {string} color - Color code for UI
 * @property {string} icon - Icon name
 */

export {};
