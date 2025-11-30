/**
 * useRobotMessage Hook
 * Display temporary robot messages
 */

import { useCallback } from 'react';
import { CONSTANTS } from '../constants';

/**
 * Hook to show robot messages
 * @param {Function} dispatch - Dispatch function from reducer
 * @returns {Function} showMessage function
 */
export const useRobotMessage = (dispatch) => {
  const showMessage = useCallback(
    (message) => {
      dispatch({ type: 'SET_FIELD', field: 'robotMessage', value: message });
      setTimeout(() => {
        dispatch({ type: 'SET_FIELD', field: 'robotMessage', value: '' });
      }, CONSTANTS.ROBOT_MESSAGE_DURATION);
    },
    [dispatch]
  );

  return showMessage;
};
