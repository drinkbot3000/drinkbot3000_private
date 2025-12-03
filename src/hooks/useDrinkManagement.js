/**
 * useDrinkManagement Hook
 * Handles all drink-related operations (add, remove, clear, custom drinks)
 */

import { useCallback } from 'react';
import { EMOJIS } from '../constants';

/**
 * Hook for managing drink operations
 * @param {Object} state - Current tracker state
 * @param {Object} actions - Tracker context actions
 * @param {Function} showRobotMessage - Function to display robot messages
 * @returns {Object} Drink management functions
 */
export const useDrinkManagement = (state, actions, showRobotMessage) => {
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
    async (name = 'Standard Drink', oz = null, abv = null) => {
      if (!state.setupComplete || !state.gender || !state.weight) {
        showRobotMessage('Please complete setup first before adding drinks.');
        return;
      }

      if (!state.startTime) {
        setField('startTime', Date.now());
      }

      addDrinkAction(name, oz, abv);

      // Lazy-load robot comments
      const { ROBOT_COMMENTS } = await import('../constants/messages');
      const comment = ROBOT_COMMENTS[Math.floor(Math.random() * ROBOT_COMMENTS.length)];
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
    (id) => {
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
    });
    showRobotMessage(`*beep boop* Custom drink saved! ${EMOJIS.ROBOT}`);
  }, [state, addCustomDrinkAction, setMultiple, showRobotMessage]);

  const handleDeleteCustomDrink = useCallback(
    (id) => {
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
    });
  }, [state, addDrink, setMultiple, showRobotMessage]);

  const handleCancelCustomDrink = useCallback(() => {
    setMultiple({
      customDrinkName: '',
      customDrinkOz: '',
      customDrinkABV: '5',
      showCustomDrink: false,
    });
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
