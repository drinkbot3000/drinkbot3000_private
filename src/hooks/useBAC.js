import { useMemo, useCallback } from 'react';

/**
 * Custom hook for BAC calculations with performance optimization
 * Uses useMemo to cache expensive calculations
 */

const CONSTANTS = {
  METABOLISM_RATE: 0.015,
  GRAMS_PER_STANDARD_DRINK: 14,
  LBS_TO_KG: 0.453592,
  MALE_BODY_WATER: 0.68,
  FEMALE_BODY_WATER: 0.55,
  LEGAL_LIMIT: 0.08,
};

export const useBAC = (state) => {
  const { gender, weight, drinks, startTime, mode, estimateDrinks, estimateHours } = state;

  // Memoize body water constant based on gender
  const bodyWaterConstant = useMemo(() => {
    return gender === 'male' ? CONSTANTS.MALE_BODY_WATER : CONSTANTS.FEMALE_BODY_WATER;
  }, [gender]);

  // Memoize weight in kg conversion
  const weightKg = useMemo(() => {
    return parseFloat(weight) * CONSTANTS.LBS_TO_KG;
  }, [weight]);

  // Memoize BAC calculation
  const calculateBAC = useCallback(() => {
    if (mode === 'estimate') {
      if (!estimateDrinks || !estimateHours) return 0;

      const numDrinks = parseFloat(estimateDrinks);
      const hours = parseFloat(estimateHours);

      const totalAlcoholGrams = numDrinks * CONSTANTS.GRAMS_PER_STANDARD_DRINK;
      const initialBAC = (totalAlcoholGrams / (weightKg * bodyWaterConstant * 1000)) * 100;
      const metabolized = CONSTANTS.METABOLISM_RATE * hours;

      return Math.max(0, initialBAC - metabolized);
    }

    if (mode === 'live') {
      if (!startTime || drinks.length === 0) return 0;

      const currentTime = Date.now();
      let adjustedBAC = 0;

      drinks.forEach((drink) => {
        const standardDrinks = drink.standardDrinks || 1;
        const alcoholGrams = standardDrinks * CONSTANTS.GRAMS_PER_STANDARD_DRINK;
        const hoursElapsed = (currentTime - drink.timestamp) / (1000 * 60 * 60);

        const drinkBAC = (alcoholGrams / (weightKg * bodyWaterConstant * 1000)) * 100;
        const metabolized = CONSTANTS.METABOLISM_RATE * hoursElapsed;
        const currentDrinkBAC = Math.max(0, drinkBAC - metabolized);

        adjustedBAC += currentDrinkBAC;
      });

      return Math.max(0, adjustedBAC);
    }

    return 0;
  }, [mode, estimateDrinks, estimateHours, weightKg, bodyWaterConstant, startTime, drinks]);

  // Calculate current BAC
  const currentBAC = useMemo(() => {
    return calculateBAC();
  }, [calculateBAC]);

  // Calculate time to sober (in minutes)
  const minutesToSober = useMemo(() => {
    if (currentBAC === 0) return 0;
    return Math.ceil((currentBAC / CONSTANTS.METABOLISM_RATE) * 60);
  }, [currentBAC]);

  // Calculate estimated sober time
  const soberTime = useMemo(() => {
    if (currentBAC === 0) return null;
    return new Date(Date.now() + minutesToSober * 60000);
  }, [currentBAC, minutesToSober]);

  // Get BAC status (sober, mild, impaired, intoxicated)
  const bacStatus = useMemo(() => {
    if (currentBAC === 0) {
      return { text: 'Sober', color: 'text-green-600', bg: 'bg-green-50', level: 'safe' };
    }
    if (currentBAC < 0.03) {
      return { text: 'Mild', color: 'text-yellow-600', bg: 'bg-yellow-50', level: 'caution' };
    }
    if (currentBAC < CONSTANTS.LEGAL_LIMIT) {
      return { text: 'Impaired', color: 'text-orange-600', bg: 'bg-orange-50', level: 'warning' };
    }
    return { text: 'Intoxicated', color: 'text-red-600', bg: 'bg-red-50', level: 'danger' };
  }, [currentBAC]);

  // Check if user is over legal limit
  const isOverLegalLimit = useMemo(() => {
    return currentBAC >= CONSTANTS.LEGAL_LIMIT;
  }, [currentBAC]);

  return {
    currentBAC,
    minutesToSober,
    soberTime,
    bacStatus,
    isOverLegalLimit,
    calculateBAC,
  };
};

/**
 * Custom hook for optimized event handlers with useCallback
 */
export const useOptimizedHandlers = (dispatch, state) => {
  const handleAddDrink = useCallback(
    (drink) => {
      dispatch({ type: 'ADD_DRINK', drink });
    },
    [dispatch]
  );

  const handleRemoveDrink = useCallback(
    (id) => {
      dispatch({ type: 'REMOVE_DRINK', id });
    },
    [dispatch]
  );

  const handleUndoDrink = useCallback(() => {
    if (state.drinks.length > 0) {
      dispatch({ type: 'UNDO_DRINK' });
    }
  }, [dispatch, state.drinks.length]);

  const handleClearDrinks = useCallback(() => {
    dispatch({ type: 'CLEAR_DRINKS' });
  }, [dispatch]);

  const handleFieldChange = useCallback(
    (field, value) => {
      dispatch({ type: 'SET_FIELD', field, value });
    },
    [dispatch]
  );

  const handleMultipleFields = useCallback(
    (values) => {
      dispatch({ type: 'SET_MULTIPLE', values });
    },
    [dispatch]
  );

  return {
    handleAddDrink,
    handleRemoveDrink,
    handleUndoDrink,
    handleClearDrinks,
    handleFieldChange,
    handleMultipleFields,
  };
};

/**
 * Custom hook for time formatting with memoization
 */
export const useTimeFormatting = () => {
  const formatTime = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }, []);

  const formatSoberTime = useCallback((soberTime) => {
    if (!soberTime) return '--:--';
    return soberTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }, []);

  return {
    formatTime,
    formatSoberTime,
  };
};

export default useBAC;
