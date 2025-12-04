/**
 * Storage Service
 * Type-safe abstraction layer for localStorage operations
 * Provides error handling and generic type support
 */

/**
 * Safely get item from localStorage with type safety
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Parsed value or default
 */
export const getItem = <T>(key: string, defaultValue: T | null = null): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely set item in localStorage
 * @param key - Storage key
 * @param value - Value to store
 * @returns True if successful
 */
export const setItem = <T>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded');
    }
    return false;
  }
};

/**
 * Remove item from localStorage
 * @param key - Storage key
 * @returns True if successful
 */
export const removeItem = (key: string): boolean => {
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
 * @param key - Storage key
 * @param defaultValue - Default value
 * @returns Boolean value
 */
export const getBoolean = (key: string, defaultValue = false): boolean => {
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
 * @param key - Storage key
 * @param value - Boolean value
 * @returns True if successful
 */
export const setBoolean = (key: string, value: boolean): boolean => {
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
 * @returns True if successful
 */
export const clearAll = (): boolean => {
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
 * @returns True if localStorage is available
 */
export const isAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Storage keys constants for type-safe access
 */
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
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
