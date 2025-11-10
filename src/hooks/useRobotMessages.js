/**
 * Custom hook for managing robot personality messages
 */

import { useState, useCallback } from 'react';
import { BAC_CONSTANTS } from '../constants/index.js';

/**
 * Hook for displaying timed robot messages
 * @returns {Object} Robot message state and methods
 */
export const useRobotMessages = () => {
  const [robotMessage, setRobotMessage] = useState('');

  /**
   * Show a robot message for a specified duration
   * @param {string} message - Message to display
   * @param {number} duration - Duration in milliseconds (default from constants)
   */
  const showMessage = useCallback((message, duration = BAC_CONSTANTS.ROBOT_MESSAGE_DURATION) => {
    setRobotMessage(message);
    setTimeout(() => {
      setRobotMessage('');
    }, duration);
  }, []);

  /**
   * Clear the current message immediately
   */
  const clearMessage = useCallback(() => {
    setRobotMessage('');
  }, []);

  return {
    robotMessage,
    showMessage,
    clearMessage,
  };
};
