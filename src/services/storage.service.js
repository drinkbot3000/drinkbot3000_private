/**
 * Storage Service
 * Abstraction layer for localStorage operations
 * Provides error handling and type safety
 */

/**
 * Safely get item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Parsed value or default
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely set item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} True if successful
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded');
    }
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} True if successful
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Get boolean value from localStorage
 * @param {string} key - Storage key
 * @param {boolean} defaultValue - Default value
 * @returns {boolean} Boolean value
 */
export const getBoolean = (key, defaultValue = false) => {
  try {
    const value = localStorage.getItem(key);
    return value === 'true';
  } catch (error) {
    console.error(`Error reading boolean from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Set boolean value in localStorage
 * @param {string} key - Storage key
 * @param {boolean} value - Boolean value
 * @returns {boolean} True if successful
 */
export const setBoolean = (key, value) => {
  try {
    localStorage.setItem(key, value.toString());
    return true;
  } catch (error) {
    console.error(`Error setting boolean in localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Clear all localStorage data
 * @returns {boolean} True if successful
 */
export const clearAll = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
export const isAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

// Storage keys constants
export const STORAGE_KEYS = {
  BAC_TRACKER_DATA: 'bacTrackerData',
  AGE_VERIFIED: 'ageVerified',
  DISCLAIMER_ACCEPTED: 'disclaimerAccepted',
  SAFETY_SCREENS_COMPLETE: 'safetyScreensComplete',
  RECEIPTS: 'bacTrackerReceipts',
  GEO_VERIFIED: 'geoVerified',
  GEO_COUNTRY: 'userCountry',
  GEO_COUNTRY_CODE: 'userCountryCode',
  GEO_CONSENT_GIVEN: 'geoConsentGiven',
  PWA_INSTALL_DISMISSED: 'pwa-install-dismissed',
};
