/**
 * Local Storage Utilities
 * Secure storage operations with error handling and quota management
 */

import { CONSTANTS } from '../constants';
import { sanitizeStorageData } from './sanitization';

/**
 * Safely get item from localStorage
 *
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found or error
 * @returns {any} Stored value or default
 *
 * @example
 * getItem('bacTrackerData', null)
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);

    if (item === null || item === undefined) {
      return defaultValue;
    }

    // Try to parse as JSON
    try {
      return JSON.parse(item);
    } catch {
      // Return as string if not JSON
      return item;
    }
  } catch (error) {
    console.error(`Error getting item from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Safely set item in localStorage
 *
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} True if successful
 *
 * @example
 * setItem('bacTrackerData', { gender: 'male', weight: '180' })
 */
export const setItem = (key, value) => {
  try {
    const stringValue = typeof value === 'string'
      ? value
      : JSON.stringify(value);

    localStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded');
      // Attempt to free up space
      clearOldReceipts();
      // Try again
      try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    }

    console.error(`Error setting item in localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Safely remove item from localStorage
 *
 * @param {string} key - Storage key
 * @returns {boolean} True if successful
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item from localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Clear all app data from localStorage
 *
 * @returns {boolean} True if successful
 */
export const clearAll = () => {
  try {
    const keys = Object.values(CONSTANTS.STORAGE_KEYS);
    keys.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get validated tracker data from storage
 * Includes schema validation to prevent injection
 *
 * @returns {Object|null} Validated tracker data or null
 */
export const getTrackerData = () => {
  const data = getItem(CONSTANTS.STORAGE_KEYS.TRACKER_DATA);

  if (!data) {
    return null;
  }

  // Define expected schema
  const schema = {
    gender: {
      type: 'string',
      enum: ['male', 'female'],
      required: false
    },
    weight: {
      type: 'string',
      pattern: /^\d+(\.\d+)?$/,
      required: false
    },
    mode: {
      type: 'string',
      enum: ['live', 'estimate'],
      required: false
    },
    drinks: {
      type: 'object', // Will be array but typeof array is 'object'
      required: false
    },
    startTime: {
      type: 'number',
      required: false
    },
    savedCustomDrinks: {
      type: 'object',
      required: false
    },
    estimateDrinks: {
      type: 'string',
      required: false
    },
    estimateHours: {
      type: 'string',
      required: false
    }
  };

  const validation = sanitizeStorageData(data, schema);

  if (!validation.valid) {
    console.warn('Invalid tracker data in localStorage:', validation.errors);
    return null;
  }

  // Additional validation for arrays
  if (validation.data.drinks && !Array.isArray(validation.data.drinks)) {
    console.warn('Drinks data is not an array');
    delete validation.data.drinks;
  }

  if (validation.data.savedCustomDrinks && !Array.isArray(validation.data.savedCustomDrinks)) {
    console.warn('savedCustomDrinks is not an array');
    delete validation.data.savedCustomDrinks;
  }

  return validation.data;
};

/**
 * Save tracker data to storage
 *
 * @param {Object} data - Tracker data to save
 * @returns {boolean} True if successful
 */
export const saveTrackerData = (data) => {
  return setItem(CONSTANTS.STORAGE_KEYS.TRACKER_DATA, data);
};

/**
 * Get receipts from storage
 *
 * @returns {Array} Array of receipts
 */
export const getReceipts = () => {
  const receipts = getItem(CONSTANTS.STORAGE_KEYS.RECEIPTS, []);
  return Array.isArray(receipts) ? receipts : [];
};

/**
 * Save receipts to storage
 *
 * @param {Array} receipts - Array of receipts
 * @returns {boolean} True if successful
 */
export const saveReceipts = (receipts) => {
  return setItem(CONSTANTS.STORAGE_KEYS.RECEIPTS, receipts);
};

/**
 * Add a receipt to storage
 *
 * @param {Object} receipt - Receipt object
 * @returns {boolean} True if successful
 */
export const addReceipt = (receipt) => {
  const receipts = getReceipts();
  receipts.push(receipt);
  return saveReceipts(receipts);
};

/**
 * Clear old receipts (older than 90 days)
 * Helps manage storage quota
 *
 * @returns {number} Number of receipts removed
 */
export const clearOldReceipts = () => {
  const receipts = getReceipts();
  const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);

  const filtered = receipts.filter(receipt => {
    return receipt.timestamp && receipt.timestamp > ninetyDaysAgo;
  });

  const removed = receipts.length - filtered.length;

  if (removed > 0) {
    saveReceipts(filtered);
    console.log(`Cleared ${removed} old receipts`);
  }

  return removed;
};

/**
 * Get age verification status
 *
 * @returns {boolean} True if age verified
 */
export const getAgeVerified = () => {
  return getItem(CONSTANTS.STORAGE_KEYS.AGE_VERIFIED, false);
};

/**
 * Set age verification status
 *
 * @param {boolean} verified - Verification status
 * @returns {boolean} True if successful
 */
export const setAgeVerified = (verified) => {
  return setItem(CONSTANTS.STORAGE_KEYS.AGE_VERIFIED, verified);
};

/**
 * Get disclaimer accepted status
 *
 * @returns {boolean} True if disclaimer accepted
 */
export const getDisclaimerAccepted = () => {
  return getItem(CONSTANTS.STORAGE_KEYS.DISCLAIMER_ACCEPTED, false);
};

/**
 * Set disclaimer accepted status
 *
 * @param {boolean} accepted - Acceptance status
 * @returns {boolean} True if successful
 */
export const setDisclaimerAccepted = (accepted) => {
  return setItem(CONSTANTS.STORAGE_KEYS.DISCLAIMER_ACCEPTED, accepted);
};

/**
 * Get safety screens completion status
 *
 * @returns {boolean} True if safety screens completed
 */
export const getSafetyScreensComplete = () => {
  return getItem(CONSTANTS.STORAGE_KEYS.SAFETY_SCREENS_COMPLETE, false);
};

/**
 * Set safety screens completion status
 *
 * @param {boolean} complete - Completion status
 * @returns {boolean} True if successful
 */
export const setSafetyScreensComplete = (complete) => {
  return setItem(CONSTANTS.STORAGE_KEYS.SAFETY_SCREENS_COMPLETE, complete);
};

/**
 * Check available storage quota
 *
 * @returns {Promise<Object>} Storage quota information
 */
export const checkStorageQuota = async () => {
  if (!navigator.storage || !navigator.storage.estimate) {
    return {
      supported: false,
      usage: 0,
      quota: 0,
      percentUsed: 0
    };
  }

  try {
    const estimate = await navigator.storage.estimate();
    return {
      supported: true,
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      percentUsed: estimate.quota ? (estimate.usage / estimate.quota * 100) : 0
    };
  } catch (error) {
    console.error('Error checking storage quota:', error);
    return {
      supported: false,
      usage: 0,
      quota: 0,
      percentUsed: 0
    };
  }
};

/**
 * Export all data for backup
 *
 * @returns {Object} All stored data
 */
export const exportAllData = () => {
  const data = {};

  Object.entries(CONSTANTS.STORAGE_KEYS).forEach(([name, key]) => {
    data[name] = getItem(key);
  });

  return data;
};

/**
 * Import data from backup
 * Warning: This will overwrite existing data
 *
 * @param {Object} data - Data to import
 * @returns {boolean} True if successful
 */
export const importAllData = (data) => {
  try {
    Object.entries(data).forEach(([name, value]) => {
      const key = CONSTANTS.STORAGE_KEYS[name];
      if (key) {
        setItem(key, value);
      }
    });
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
