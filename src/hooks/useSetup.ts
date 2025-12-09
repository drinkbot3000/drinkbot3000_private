/**
 * useSetup Hook
 * Handles initial setup and miscellaneous operations (jokes, payments) with type safety
 */

import { useCallback } from 'react';
import { validateWeight } from '../services/validation.service';
import { generateReceipt } from '../services/receipt.service';
import { getRandomGreeting, getRandomJoke, EMOJIS, CONSTANTS } from '../constants';
import type { Receipt } from '../services/receipt.service';

type SetFieldFunction = (field: string, value: any) => void;
type SetMultipleFunction = (updates: Record<string, any>) => void;
type AddReceiptFunction = (receipt: Receipt) => void;
type ShowRobotMessageFunction = (message: string) => void;

interface SetupHandlers {
  handleSetup: () => void;
  tellJoke: () => void;
  handlePaymentSuccess: () => void;
}

/**
 * Hook for managing setup and miscellaneous operations
 * @param state - Current tracker state
 * @param setField - Function to update a single state field
 * @param setMultiple - Function to update multiple state fields
 * @param addReceipt - Function to add receipt to state
 * @param showRobotMessage - Function to display robot messages
 * @returns Setup handler functions
 */
export const useSetup = (
  state: any, // TODO: Refine type in Phase 3
  setField: SetFieldFunction,
  setMultiple: SetMultipleFunction,
  addReceipt: AddReceiptFunction,
  showRobotMessage: ShowRobotMessageFunction
): SetupHandlers => {
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

    const greeting = getRandomGreeting();
    showRobotMessage(greeting);
  }, [state.gender, state.weight, setField, setMultiple, showRobotMessage]);

  const tellJoke = useCallback(() => {
    const randomJoke = getRandomJoke();
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
