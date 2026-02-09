/**
 * useSetup Hook
 * Handles initial setup and miscellaneous operations (jokes) with type safety
 */

import { useCallback } from 'react';
import { validateWeight } from '../services/validation.service';
import { getRandomGreeting, getRandomJoke, CONSTANTS } from '../constants';

type SetFieldFunction = (field: string, value: any) => void;
type SetMultipleFunction = (updates: Record<string, any>) => void;
type ShowRobotMessageFunction = (message: string) => void;

interface SetupHandlers {
  handleSetup: () => void;
  tellJoke: () => void;
}

/**
 * Hook for managing setup and miscellaneous operations
 * @param state - Current tracker state
 * @param setField - Function to update a single state field
 * @param setMultiple - Function to update multiple state fields
 * @param _unused - Unused parameter kept for call-site compatibility
 * @param showRobotMessage - Function to display robot messages
 * @returns Setup handler functions
 */
export const useSetup = (
  state: any,
  setField: SetFieldFunction,
  setMultiple: SetMultipleFunction,
  _unused: any,
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

  return {
    handleSetup,
    tellJoke,
  };
};
