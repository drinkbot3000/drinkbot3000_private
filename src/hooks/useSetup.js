/**
 * useSetup Hook
 * Handles initial setup and miscellaneous operations (jokes, payments)
 */

import { useCallback } from 'react';
import { validateWeight } from '../services/validation.service';
import { generateReceipt } from '../services/receipt.service';
import { ROBOT_GREETINGS, JOKES, EMOJIS, CONSTANTS } from '../constants';

/**
 * Hook for managing setup and miscellaneous operations
 * @param {Object} state - Current tracker state
 * @param {Function} setField - Function to update a single state field
 * @param {Function} setMultiple - Function to update multiple state fields
 * @param {Function} addReceipt - Function to add receipt to state
 * @param {Function} showRobotMessage - Function to display robot messages
 * @returns {Object} Setup handler functions
 */
export const useSetup = (state, setField, setMultiple, addReceipt, showRobotMessage) => {
  const handleSetup = useCallback(() => {
    if (!state.gender) {
      showRobotMessage('Please select your gender to continue.');
      return;
    }
    if (!state.weight) {
      showRobotMessage('Please enter your weight to continue.');
      return;
    }
    const error = validateWeight(state.weight);
    if (error) {
      setField('weightError', error);
      showRobotMessage(error);
      return;
    }

    setMultiple({
      weightError: '',
      setupComplete: true,
      startTime: Date.now(),
    });

    const greeting = ROBOT_GREETINGS[Math.floor(Math.random() * ROBOT_GREETINGS.length)];
    showRobotMessage(greeting);
  }, [state.gender, state.weight, setField, setMultiple, showRobotMessage]);

  const tellJoke = useCallback(() => {
    const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
    setMultiple({ currentJoke: randomJoke, showJoke: true });
    setTimeout(() => {
      setField('showJoke', false);
    }, CONSTANTS.JOKE_DURATION);
  }, [setField, setMultiple]);

  const handlePaymentSuccess = useCallback(() => {
    const amount = parseFloat(state.customTipAmount) || 5;
    const receipt = generateReceipt(amount);
    addReceipt(receipt);
    setField('showReceipt', true);
    showRobotMessage(
      `*beeps gratefully* Thank you for your support! ${EMOJIS.ROBOT}${EMOJIS.HEART}`
    );
  }, [state.customTipAmount, addReceipt, setField, showRobotMessage]);

  return {
    handleSetup,
    tellJoke,
    handlePaymentSuccess,
  };
};
