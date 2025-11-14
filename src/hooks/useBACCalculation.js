/**
 * useBACCalculation Hook
 * Manages BAC calculation with real-time updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  calculateBAC,
  getBACStatus,
  getSoberTime,
  calculateElapsedHours,
  isImpaired,
  isOverLegalLimit,
  formatBAC
} from '../utils/bacCalculations';

/**
 * Hook for managing BAC calculations
 *
 * @param {Object} params - Calculation parameters
 * @param {string} params.gender - User gender
 * @param {string|number} params.weight - User weight in pounds
 * @param {Array} params.drinks - Array of drinks
 * @param {number} params.startTime - Timestamp of first drink
 * @param {string} params.mode - Calculation mode ('live' or 'estimate')
 * @param {string|number} params.estimateDrinks - Number of drinks for estimate mode
 * @param {string|number} params.estimateHours - Hours for estimate mode
 * @returns {Object} BAC data and helper functions
 *
 * @example
 * const {
 *   bac,
 *   status,
 *   soberTime,
 *   elapsedTime,
 *   isCurrentlyImpaired
 * } = useBACCalculation({ gender, weight, drinks, startTime, mode });
 */
export const useBACCalculation = (params) => {
  const {
    gender,
    weight,
    drinks = [],
    startTime,
    mode,
    estimateDrinks,
    estimateHours
  } = params;

  const [bac, setBAC] = useState(0);
  const [lastImpairmentState, setLastImpairmentState] = useState(false);
  const intervalRef = useRef(null);

  // Calculate BAC
  const recalculateBAC = useCallback(() => {
    const newBAC = calculateBAC({
      gender,
      weight,
      drinks,
      startTime,
      mode,
      estimateDrinks,
      estimateHours
    });

    setBAC(newBAC);
    return newBAC;
  }, [gender, weight, drinks, startTime, mode, estimateDrinks, estimateHours]);

  // Set up real-time BAC updates (every second)
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Initial calculation
    recalculateBAC();

    // Set up interval for live mode
    if (mode === 'live' && drinks.length > 0) {
      intervalRef.current = setInterval(() => {
        recalculateBAC();
      }, 1000); // Update every second
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [mode, drinks.length, recalculateBAC]);

  // Track impairment state changes
  useEffect(() => {
    const currentlyImpaired = isImpaired(bac);

    // Detect transition from not impaired to impaired
    if (!lastImpairmentState && currentlyImpaired) {
      setLastImpairmentState(true);
    }

    // Don't reset impairment flag even if BAC drops
    // This is intentional - once impaired, always consider impaired for safety
  }, [bac, lastImpairmentState]);

  // Get current BAC status
  const status = getBACStatus(bac);

  // Get estimated sober time
  const soberTime = getSoberTime(bac);

  // Get elapsed time since drinking started
  const elapsedTime = startTime ? calculateElapsedHours(startTime) : 0;

  // Check various impairment states
  const isCurrentlyImpaired = isImpaired(bac);
  const isOverLimit = isOverLegalLimit(bac);
  const hasEverBeenImpaired = lastImpairmentState;

  // Format BAC for display
  const formattedBAC = formatBAC(bac);

  // Reset impairment tracking
  const resetImpairment = useCallback(() => {
    setLastImpairmentState(false);
  }, []);

  return {
    bac,
    formattedBAC,
    status,
    soberTime,
    elapsedTime,
    isCurrentlyImpaired,
    isOverLimit,
    hasEverBeenImpaired,
    recalculateBAC,
    resetImpairment
  };
};

export default useBACCalculation;
