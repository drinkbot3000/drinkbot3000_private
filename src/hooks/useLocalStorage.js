/**
 * useLocalStorage Hook
 * Sync state with localStorage
 */

import { useState, useEffect } from 'react';
import { getItem, setItem } from '../services/storage.service';

/**
 * Hook to sync state with localStorage
 * @param {string} key - localStorage key
 * @param {*} initialValue - Initial value if key doesn't exist
 * @returns {[*, Function]} State value and setter function
 */
export const useLocalStorage = (key, initialValue) => {
  // Initialize state with value from localStorage or initial value
  const [storedValue, setStoredValue] = useState(() => {
    return getItem(key, initialValue);
  });

  // Update localStorage when state changes
  useEffect(() => {
    setItem(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
