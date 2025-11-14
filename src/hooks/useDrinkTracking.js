/**
 * useDrinkTracking Hook
 * Manages drink tracking with CRUD operations
 */

import { useState, useCallback } from 'react';
import { calculateStandardDrinks } from '../utils/bacCalculations';
import { validateDrinkOunces, validateABV } from '../utils/validation';
import { validateDrinkName } from '../utils/sanitization';

/**
 * Hook for managing drink tracking
 *
 * @param {Array} initialDrinks - Initial drinks array
 * @param {number} initialStartTime - Initial start time
 * @returns {Object} Drinks data and CRUD functions
 *
 * @example
 * const {
 *   drinks,
 *   startTime,
 *   addDrink,
 *   removeDrink,
 *   clearDrinks,
 *   undoLastDrink
 * } = useDrinkTracking();
 */
export const useDrinkTracking = (initialDrinks = [], initialStartTime = null) => {
  const [drinks, setDrinks] = useState(initialDrinks);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [error, setError] = useState(null);

  /**
   * Add a drink to the tracking list
   *
   * @param {Object} params - Drink parameters
   * @param {string} params.name - Drink name/type
   * @param {number} params.oz - Volume in ounces
   * @param {number} params.abv - Alcohol by volume percentage
   * @returns {Object} Result with success status and drink data
   */
  const addDrink = useCallback((params) => {
    const { name, oz, abv } = params;

    // Validate inputs
    const ozValidation = validateDrinkOunces(oz);
    if (!ozValidation.valid) {
      setError(ozValidation.error);
      return { success: false, error: ozValidation.error };
    }

    const abvValidation = validateABV(abv);
    if (!abvValidation.valid) {
      setError(abvValidation.error);
      return { success: false, error: abvValidation.error };
    }

    // Sanitize name if provided
    let sanitizedName = name || 'Drink';
    if (name) {
      const nameValidation = validateDrinkName(name);
      if (nameValidation.valid) {
        sanitizedName = nameValidation.sanitized;
      } else {
        // Use sanitized version even if not fully valid, or default
        sanitizedName = nameValidation.sanitized || 'Drink';
      }
    }

    try {
      // Calculate standard drinks
      const standardDrinks = calculateStandardDrinks(oz, abv);

      // Create drink object
      const drink = {
        id: Date.now() + Math.random(), // Unique ID
        timestamp: Date.now(),
        name: sanitizedName,
        type: sanitizedName,
        oz: parseFloat(oz),
        abv: parseFloat(abv),
        standardDrinks
      };

      // Update state
      setDrinks(prevDrinks => {
        const newDrinks = [...prevDrinks, drink];

        // Set start time if this is the first drink
        if (prevDrinks.length === 0) {
          setStartTime(Date.now());
        }

        return newDrinks;
      });

      setError(null);

      return {
        success: true,
        drink
      };

    } catch (err) {
      const errorMsg = 'Failed to add drink';
      setError(errorMsg);
      console.error('Error adding drink:', err);
      return {
        success: false,
        error: errorMsg
      };
    }
  }, []);

  /**
   * Remove a specific drink by ID
   *
   * @param {number|string} drinkId - ID of drink to remove
   * @returns {boolean} True if successful
   */
  const removeDrink = useCallback((drinkId) => {
    try {
      setDrinks(prevDrinks => {
        const newDrinks = prevDrinks.filter(d => d.id !== drinkId);

        // Clear start time if no drinks left
        if (newDrinks.length === 0) {
          setStartTime(null);
        }

        return newDrinks;
      });

      setError(null);
      return true;

    } catch (err) {
      const errorMsg = 'Failed to remove drink';
      setError(errorMsg);
      console.error('Error removing drink:', err);
      return false;
    }
  }, []);

  /**
   * Remove the last drink added (undo)
   *
   * @returns {boolean} True if successful
   */
  const undoLastDrink = useCallback(() => {
    try {
      if (drinks.length === 0) {
        return false;
      }

      setDrinks(prevDrinks => {
        const newDrinks = prevDrinks.slice(0, -1);

        // Clear start time if no drinks left
        if (newDrinks.length === 0) {
          setStartTime(null);
        }

        return newDrinks;
      });

      setError(null);
      return true;

    } catch (err) {
      const errorMsg = 'Failed to undo drink';
      setError(errorMsg);
      console.error('Error undoing drink:', err);
      return false;
    }
  }, [drinks.length]);

  /**
   * Clear all drinks
   *
   * @returns {boolean} True if successful
   */
  const clearDrinks = useCallback(() => {
    try {
      setDrinks([]);
      setStartTime(null);
      setError(null);
      return true;

    } catch (err) {
      const errorMsg = 'Failed to clear drinks';
      setError(errorMsg);
      console.error('Error clearing drinks:', err);
      return false;
    }
  }, []);

  /**
   * Replace all drinks (for loading from storage)
   *
   * @param {Array} newDrinks - New drinks array
   * @param {number} newStartTime - New start time
   */
  const setDrinksData = useCallback((newDrinks, newStartTime) => {
    setDrinks(Array.isArray(newDrinks) ? newDrinks : []);
    setStartTime(newStartTime || null);
    setError(null);
  }, []);

  /**
   * Get total number of standard drinks
   *
   * @returns {number} Total standard drinks
   */
  const getTotalStandardDrinks = useCallback(() => {
    return drinks.reduce((sum, drink) => sum + (drink.standardDrinks || 0), 0);
  }, [drinks]);

  /**
   * Get drink by ID
   *
   * @param {number|string} drinkId - Drink ID
   * @returns {Object|null} Drink object or null
   */
  const getDrinkById = useCallback((drinkId) => {
    return drinks.find(d => d.id === drinkId) || null;
  }, [drinks]);

  return {
    drinks,
    startTime,
    error,
    addDrink,
    removeDrink,
    undoLastDrink,
    clearDrinks,
    setDrinksData,
    getTotalStandardDrinks,
    getDrinkById,
    hasDrinks: drinks.length > 0,
    drinkCount: drinks.length
  };
};

export default useDrinkTracking;
