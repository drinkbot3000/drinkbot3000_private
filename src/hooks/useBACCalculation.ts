/**
 * useBACCalculation Hook
 * Manages BAC calculation and updates with type safety
 */

import { useEffect, useRef } from 'react';
import { calculateBAC, isValidBAC } from '../services/bacCalculation.service';
import { CONSTANTS } from '../constants';
import type { TrackerAction, TrackerState, Gender, Drink } from '../types';

interface UseBACCalculationParams {
  dispatch: React.Dispatch<TrackerAction>;
  state: TrackerState;
}

/**
 * Hook to calculate and update BAC
 * @param params - Dispatch function and current state
 */
export const useBACCalculation = ({ dispatch, state }: UseBACCalculationParams): void => {
  // Use refs to track frequently-changing values without causing effect re-runs
  const drinksRef = useRef<Drink[]>(state.drinks);
  const startTimeRef = useRef<number | null>(state.startTime);
  const hasBeenImpairedRef = useRef<boolean>(state.hasBeenImpaired);
  const genderRef = useRef<Gender | null>(state.userProfile?.gender ?? null);
  const weightRef = useRef<number | null>(state.userProfile?.weight ?? null);
  const useSlowMetabolismRef = useRef<boolean>(false); // TODO: Add to state if needed
  const lastBACRef = useRef<number>(state.currentBAC);

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
    genderRef.current = state.userProfile?.gender ?? null;
  }, [state.userProfile?.gender]);

  useEffect(() => {
    weightRef.current = state.userProfile?.weight ?? null;
  }, [state.userProfile?.weight]);

  useEffect(() => {
    lastBACRef.current = state.currentBAC;
  }, [state.currentBAC]);

  // Main BAC calculation effect - only recreates interval on setup completion
  useEffect(() => {
    // Check if we have required data to calculate BAC
    if (!genderRef.current || !weightRef.current) return;

    const interval = setInterval(() => {
      const gender = genderRef.current;
      const weight = weightRef.current;

      if (!gender || !weight) return;

      const currentBAC = calculateBAC({
        gender,
        weight,
        drinks: drinksRef.current,
        startTime: startTimeRef.current,
        useSlowMetabolism: useSlowMetabolismRef.current,
      });

      // Validate BAC calculation result
      if (!isValidBAC(currentBAC)) {
        console.error('Invalid BAC calculation result:', currentBAC);
        dispatch({
          type: 'UPDATE_BAC',
          payload: {
            bac: 0,
            peakBAC: 0,
            soberTime: null,
            totalDrinks: 0,
            isImpaired: false,
            hasBeenImpaired: false,
          },
        });
        return;
      }

      // Sanity check for unrealistically high BAC values
      if (currentBAC > 0.5) {
        console.error('Unrealistically high BAC calculated:', currentBAC);
        console.error('Drinks:', drinksRef.current);
        console.error('Weight:', weight, 'Gender:', gender);
      }

      // Only update if BAC has meaningfully changed (avoid unnecessary re-renders)
      const bacChanged = Math.abs(currentBAC - lastBACRef.current) >= 0.001;
      if (bacChanged) {
        dispatch({
          type: 'UPDATE_BAC',
          payload: {
            bac: currentBAC,
            peakBAC: Math.max(currentBAC, state.peakBAC),
            soberTime: null, // TODO: Calculate sober time
            totalDrinks: drinksRef.current.length,
            isImpaired: currentBAC >= CONSTANTS.LEGAL_LIMIT,
            hasBeenImpaired: state.hasBeenImpaired || currentBAC >= CONSTANTS.LEGAL_LIMIT,
          },
        });
      }

      // Track if user has been impaired (at or above legal limit)
      if (currentBAC >= CONSTANTS.LEGAL_LIMIT && !hasBeenImpairedRef.current) {
        hasBeenImpairedRef.current = true;
      }

      // Reset impairment flag only when completely sober
      if (currentBAC === 0 && hasBeenImpairedRef.current) {
        hasBeenImpairedRef.current = false;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, state.peakBAC, state.hasBeenImpaired]);
};
