/**
 * Custom hook for BAC tracking functionality
 */

import { useState, useEffect, useCallback } from 'react';
import {
  calculateBACFromDrinks,
  calculateBACFromEstimate,
  calculateStandardDrinks,
} from '../utils/bacCalculations.js';
import { BAC_CONSTANTS, MODES } from '../constants/index.js';

/**
 * Hook for managing BAC tracking state and calculations
 * @param {string} mode - Tracking mode ('live' or 'estimate')
 * @param {string} gender - User's gender
 * @param {string} weight - User's weight in lbs
 * @returns {Object} BAC tracker state and methods
 */
export const useBACTracker = (mode, gender, weight) => {
  const [bac, setBac] = useState(0);
  const [drinks, setDrinks] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [estimateDrinks, setEstimateDrinks] = useState('');
  const [estimateHours, setEstimateHours] = useState('');

  // Calculate BAC based on current mode
  const calculateBAC = useCallback(() => {
    if (mode === MODES.ESTIMATE) {
      return calculateBACFromEstimate(
        estimateDrinks,
        estimateHours,
        weight,
        gender
      );
    }

    if (mode === MODES.LIVE) {
      return calculateBACFromDrinks(drinks, weight, gender);
    }

    return 0;
  }, [mode, drinks, estimateDrinks, estimateHours, weight, gender]);

  // Update BAC every second
  useEffect(() => {
    if (!gender || !weight) return;

    const interval = setInterval(() => {
      setBac(calculateBAC());
    }, BAC_CONSTANTS.UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [calculateBAC, gender, weight]);

  // Initialize start time in live mode
  useEffect(() => {
    if (mode === MODES.LIVE && !startTime) {
      setStartTime(Date.now());
    }
  }, [mode, startTime]);

  /**
   * Add a standard drink
   */
  const addDrink = useCallback(() => {
    const newDrink = {
      id: Date.now(),
      timestamp: Date.now(),
      standardDrinks: 1,
      type: 'Standard Drink',
    };
    setDrinks(prev => [...prev, newDrink]);
  }, []);

  /**
   * Add a custom drink with specific volume and ABV
   * @param {number} volumeOz - Volume in ounces
   * @param {number} abv - Alcohol by volume percentage
   */
  const addCustomDrink = useCallback((volumeOz, abv) => {
    const standardDrinks = calculateStandardDrinks(volumeOz, abv);
    const newDrink = {
      id: Date.now(),
      timestamp: Date.now(),
      standardDrinks,
      type: `${volumeOz}oz @ ${abv}%`,
    };
    setDrinks(prev => [...prev, newDrink]);
    return standardDrinks;
  }, []);

  /**
   * Remove the last drink
   */
  const undoDrink = useCallback(() => {
    setDrinks(prev => prev.slice(0, -1));
  }, []);

  /**
   * Remove a specific drink by ID
   * @param {number} id - Drink ID to remove
   */
  const removeDrink = useCallback((id) => {
    setDrinks(prev => prev.filter(drink => drink.id !== id));
  }, []);

  /**
   * Clear all drinks and reset
   */
  const resetDrinks = useCallback(() => {
    setDrinks([]);
    setBac(0);
    setStartTime(Date.now());
  }, []);

  return {
    bac,
    drinks,
    startTime,
    estimateDrinks,
    estimateHours,
    setEstimateDrinks,
    setEstimateHours,
    addDrink,
    addCustomDrink,
    undoDrink,
    removeDrink,
    resetDrinks,
  };
};
