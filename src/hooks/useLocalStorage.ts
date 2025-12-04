/**
 * useLocalStorage Hook
 * Sync state with localStorage with type safety
 */

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { getItem, setItem } from '../services/storage.service';

/**
 * Hook to sync state with localStorage
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns State value and setter function
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  // Initialize state with value from localStorage or initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getItem<T>(key, initialValue) ?? initialValue;
  });

  // Update localStorage when state changes
  useEffect(() => {
    setItem<T>(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
