/**
 * useDrinkManagement Hook
 * Handles all drink-related operations (add, remove, clear, custom drinks) with type safety
 */

import { useCallback } from 'react';
import { getRandomComment, EMOJIS } from '../constants';
import type { TrackerState } from '../types';

interface DrinkManagementActions {
  setField: (field: string, value: any) => void;
  setMultiple: (updates: Partial<TrackerState>) => void;
  addDrink: (name: string, oz?: number | null, abv?: number | null) => void;
  removeDrink: (id: string) => void;
  undoDrink: () => void;
  clearDrinks: () => void;
  addCustomDrink: (drink: any) => void;
  deleteCustomDrink: (id: string | number) => void;
}

interface DrinkManagementHandlers {
  addDrink: (name?: string, oz?: number | null, abv?: number | null) => void;
  clearDrinks: () => void;
  deleteDrink: (id: string) => void;
  undoDrink: () => void;
  handleSaveCustomDrink: () => void;
  handleDeleteCustomDrink: (id: string | number) => void;
  handleAddCustomDrink: () => void;
  handleCancelCustomDrink: () => void;
}

/**
 * Hook for managing drink operations
 * @param state - Current tracker state
 * @param actions - Tracker context actions
 * @param showRobotMessage - Function to display robot messages
 * @returns Drink management functions
 */
export const useDrinkManagement = (
  state: any, // TODO: Refine type in Phase 3
  actions: DrinkManagementActions,
  showRobotMessage: (message: string) => void
): DrinkManagementHandlers => {
  const {
    setField,
    setMultiple,
    addDrink: addDrinkAction,
    removeDrink,
    undoDrink,
    clearDrinks: clearDrinksAction,
    addCustomDrink: addCustomDrinkAction,
    deleteCustomDrink: deleteCustomDrinkAction,
  } = actions;

  const addDrink = useCallback(
    (name = 'Standard Drink', oz: number | null = null, abv: number | null = null) => {
      if (!state.setupComplete || !state.gender || !state.weight) {
        showRobotMessage('Please complete setup first before adding drinks.');
        return;
      }

      if (!state.startTime) {
        setField('startTime', Date.now());
      }

      addDrinkAction(name, oz, abv);

      const comment = getRandomComment();
      showRobotMessage(comment);
    },
    [
      state.setupComplete,
      state.gender,
      state.weight,
      state.startTime,
      addDrinkAction,
      setField,
      showRobotMessage,
    ]
  );

  const clearDrinks = useCallback(() => {
    if (state.drinks.length > 0) {
      clearDrinksAction();
      showRobotMessage(
        `*whirrs loudly* All drinks cleared from memory! Starting fresh! ${EMOJIS.ROBOT}`
      );
    } else {
      showRobotMessage('No drinks to clear!');
    }
  }, [state.drinks.length, clearDrinksAction, showRobotMessage]);

  const deleteDrink = useCallback(
    (id: string) => {
      removeDrink(id);
      showRobotMessage(`*whirrs* Drink removed from records! ${EMOJIS.ROBOT}`);
    },
    [removeDrink, showRobotMessage]
  );

  const handleSaveCustomDrink = useCallback(() => {
    const { customDrinkName, customDrinkOz, customDrinkABV } = state;
    if (!customDrinkName || !customDrinkOz || !customDrinkABV) {
      showRobotMessage('Please fill in all fields for custom drink.');
      return;
    }

    const drink = {
      id: Date.now(),
      name: customDrinkName,
      oz: parseFloat(customDrinkOz),
      abv: parseFloat(customDrinkABV),
    };

    addCustomDrinkAction(drink);
    setMultiple({
      customDrinkName: '',
      customDrinkOz: '',
      customDrinkABV: '5',
      showCustomDrink: false,
    } as any);
    showRobotMessage(`*beep boop* Custom drink saved! ${EMOJIS.ROBOT}`);
  }, [state, addCustomDrinkAction, setMultiple, showRobotMessage]);

  const handleDeleteCustomDrink = useCallback(
    (id: string | number) => {
      deleteCustomDrinkAction(id);
      showRobotMessage(`Custom drink deleted! ${EMOJIS.ROBOT}`);
    },
    [deleteCustomDrinkAction, showRobotMessage]
  );

  const handleAddCustomDrink = useCallback(() => {
    const { customDrinkName, customDrinkOz, customDrinkABV } = state;
    if (!customDrinkOz || !customDrinkABV) {
      showRobotMessage('Please fill in volume and ABV for custom drink.');
      return;
    }
    const name = customDrinkName || 'Custom Drink';
    addDrink(name, parseFloat(customDrinkOz), parseFloat(customDrinkABV));
    setMultiple({
      customDrinkName: '',
      customDrinkOz: '',
      customDrinkABV: '5',
      showCustomDrink: false,
    } as any);
  }, [state, addDrink, setMultiple, showRobotMessage]);

  const handleCancelCustomDrink = useCallback(() => {
    setMultiple({
      customDrinkName: '',
      customDrinkOz: '',
      customDrinkABV: '5',
      showCustomDrink: false,
    } as any);
  }, [setMultiple]);

  return {
    addDrink,
    clearDrinks,
    deleteDrink,
    undoDrink,
    handleSaveCustomDrink,
    handleDeleteCustomDrink,
    handleAddCustomDrink,
    handleCancelCustomDrink,
  };
};
