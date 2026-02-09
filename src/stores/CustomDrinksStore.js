/**
 * Custom Drinks Store
 * Manages custom drinks and validation errors
 * Fields: 8 (customDrinkOz, customDrinkABV, customDrinkName, showCustomDrink,
 *         savedCustomDrinks, weightError, tipError, customTipAmount)
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

const CustomDrinksContext = createContext(undefined);

// Initial state - 9 fields
export const initialCustomDrinksState = {
  // Custom drink form
  customDrinkOz: '',
  customDrinkABV: '5',
  customDrinkName: '',
  showCustomDrink: false,

  // Saved drinks
  savedCustomDrinks: [],

  // Validation errors
  weightError: '',
  tipError: '',
  customTipAmount: '',
};

/**
 * Custom Drinks Reducer
 */
function customDrinksReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };

    case 'SET_MULTIPLE':
      return {
        ...state,
        ...action.values,
      };

    case 'ADD_CUSTOM_DRINK':
      return {
        ...state,
        savedCustomDrinks: [...state.savedCustomDrinks, action.drink],
      };

    case 'DELETE_CUSTOM_DRINK':
      return {
        ...state,
        savedCustomDrinks: state.savedCustomDrinks.filter((d) => d.id !== action.id),
      };

    case 'RESET_CUSTOM_DRINKS':
      return initialCustomDrinksState;

    default:
      return state;
  }
}

/**
 * Custom Drinks Provider Component
 */
export function CustomDrinksProvider({ children }) {
  const [state, dispatch] = useReducer(customDrinksReducer, initialCustomDrinksState);

  // Add custom drink
  const addCustomDrink = useCallback((drink) => {
    dispatch({ type: 'ADD_CUSTOM_DRINK', drink });
  }, []);

  // Delete custom drink
  const deleteCustomDrink = useCallback((id) => {
    dispatch({ type: 'DELETE_CUSTOM_DRINK', id });
  }, []);

  // Update field helper
  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  // Update multiple fields helper
  const setMultiple = useCallback((values) => {
    dispatch({ type: 'SET_MULTIPLE', values });
  }, []);

  // Reset custom drinks state
  const resetCustomDrinks = useCallback(() => {
    dispatch({ type: 'RESET_CUSTOM_DRINKS' });
  }, []);

  // Memoize context value
  const value = useMemo(
    () => ({
      state,
      dispatch,
      addCustomDrink,
      deleteCustomDrink,
      setField,
      setMultiple,
      resetCustomDrinks,
    }),
    [state, addCustomDrink, deleteCustomDrink, setField, setMultiple, resetCustomDrinks]
  );

  return <CustomDrinksContext.Provider value={value}>{children}</CustomDrinksContext.Provider>;
}

CustomDrinksProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useCustomDrinks Hook
 */
export function useCustomDrinks() {
  const context = useContext(CustomDrinksContext);
  if (!context) {
    throw new Error('useCustomDrinks must be used within CustomDrinksProvider');
  }
  return context;
}
