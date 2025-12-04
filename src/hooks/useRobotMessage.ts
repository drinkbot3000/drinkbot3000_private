/**
 * useRobotMessage Hook
 * Display temporary robot messages with type safety
 */

import { useCallback } from 'react';
import { CONSTANTS } from '../constants';
import type { TrackerAction } from '../types';

/**
 * Hook to show robot messages
 * @param dispatch - Dispatch function from reducer
 * @returns showMessage function
 */
export const useRobotMessage = (
  dispatch: React.Dispatch<TrackerAction>
): ((message: string) => void) => {
  const showMessage = useCallback(
    (message: string): void => {
      dispatch({
        type: 'SET_FIELD',
        payload: { field: 'robotMessage', value: message }
      });

      setTimeout(() => {
        dispatch({
          type: 'SET_FIELD',
          payload: { field: 'robotMessage', value: '' }
        });
      }, CONSTANTS.ROBOT_MESSAGE_DURATION);
    },
    [dispatch]
  );

  return showMessage;
};
