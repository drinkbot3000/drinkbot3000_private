/**
 * useBACCalculation Hook
 * Manages BAC calculation and updates
 */

import { useEffect } from 'react';
import { calculateBAC, isValidBAC } from '../services/bacCalculation.service';
import { CONSTANTS } from '../constants';

/**
 * Hook to calculate and update BAC
 * @param {Object} params
 * @param {Function} params.dispatch - Dispatch function from reducer
 * @param {Object} params.state - Current state
 * @returns {void}
 */
export const useBACCalculation = ({ dispatch, state }) => {
  useEffect(() => {
    if (!state.setupComplete) return;

    const interval = setInterval(() => {
      const currentBAC = calculateBAC({
        gender: state.gender,
        weight: state.weight,
        drinks: state.drinks,
        startTime: state.startTime,
        useSlowMetabolism: state.useSlowMetabolism,
      });

      // Validate BAC calculation result
      if (!isValidBAC(currentBAC)) {
        console.error('Invalid BAC calculation result:', currentBAC);
        dispatch({ type: 'SET_FIELD', field: 'bac', value: 0 });
        return;
      }

      // Sanity check for unrealistically high BAC values
      if (currentBAC > 0.5) {
        console.error('Unrealistically high BAC calculated:', currentBAC);
        console.error('Drinks:', state.drinks);
        console.error('Weight:', state.weight, 'Gender:', state.gender);
      }

      dispatch({ type: 'SET_FIELD', field: 'bac', value: currentBAC });

      // Track if user has been impaired (at or above legal limit)
      if (currentBAC >= CONSTANTS.LEGAL_LIMIT && !state.hasBeenImpaired) {
        dispatch({ type: 'SET_FIELD', field: 'hasBeenImpaired', value: true });
      }

      // Reset impairment flag only when completely sober
      if (currentBAC === 0 && state.hasBeenImpaired) {
        dispatch({ type: 'SET_FIELD', field: 'hasBeenImpaired', value: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    state.drinks,
    state.setupComplete,
    state.gender,
    state.weight,
    state.startTime,
    state.hasBeenImpaired,
    state.useSlowMetabolism,
    dispatch,
  ]);
};
