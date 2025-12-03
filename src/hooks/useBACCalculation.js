/**
 * useBACCalculation Hook
 * Manages BAC calculation and updates
 */

import { useEffect, useRef } from 'react';
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
  // Use refs to track frequently-changing values without causing effect re-runs
  const drinksRef = useRef(state.drinks);
  const startTimeRef = useRef(state.startTime);
  const hasBeenImpairedRef = useRef(state.hasBeenImpaired);
  const genderRef = useRef(state.gender);
  const weightRef = useRef(state.weight);
  const useSlowMetabolismRef = useRef(state.useSlowMetabolism);

  // Keep refs synchronized with state
  useEffect(() => {
    drinksRef.current = state.drinks;
  }, [state.drinks]);

  useEffect(() => {
    startTimeRef.current = state.startTime;
  }, [state.startTime]);

  useEffect(() => {
    hasBeenImpairedRef.current = state.hasBeenImpaired;
  }, [state.hasBeenImpaired]);

  useEffect(() => {
    genderRef.current = state.gender;
  }, [state.gender]);

  useEffect(() => {
    weightRef.current = state.weight;
  }, [state.weight]);

  useEffect(() => {
    useSlowMetabolismRef.current = state.useSlowMetabolism;
  }, [state.useSlowMetabolism]);

  // Main BAC calculation effect - only recreates interval on setup completion
  useEffect(() => {
    if (!state.setupComplete) return;

    const interval = setInterval(() => {
      const currentBAC = calculateBAC({
        gender: genderRef.current,
        weight: weightRef.current,
        drinks: drinksRef.current,
        startTime: startTimeRef.current,
        useSlowMetabolism: useSlowMetabolismRef.current,
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
        console.error('Drinks:', drinksRef.current);
        console.error('Weight:', weightRef.current, 'Gender:', genderRef.current);
      }

      dispatch({ type: 'SET_FIELD', field: 'bac', value: currentBAC });

      // Track if user has been impaired (at or above legal limit)
      if (currentBAC >= CONSTANTS.LEGAL_LIMIT && !hasBeenImpairedRef.current) {
        dispatch({ type: 'SET_FIELD', field: 'hasBeenImpaired', value: true });
      }

      // Reset impairment flag only when completely sober
      if (currentBAC === 0 && hasBeenImpairedRef.current) {
        dispatch({ type: 'SET_FIELD', field: 'hasBeenImpaired', value: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.setupComplete, dispatch]);
};
