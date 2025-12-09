/**
 * BAC Store
 * Manages BAC tracking and calculator state
 * Fields: 8 (bac, drinks, startTime, hasBeenImpaired, useSlowMetabolism,
 *         calcDrinks, calcHours, calcBAC)
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { calculateStandardDrinks } from '../services/bacCalculation.service';

const BACContext = createContext(undefined);

// Initial state - 8 fields
export const initialBACState = {
  // BAC tracking
  bac: 0,
  drinks: [],
  startTime: null,
  hasBeenImpaired: false,
  useSlowMetabolism: true,

  // Calculator
  calcDrinks: '',
  calcHours: '',
  calcBAC: null,
};

/**
 * BAC Reducer
 */
function bacReducer(state, action) {
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

    case 'ADD_DRINK':
      return {
        ...state,
        drinks: [...state.drinks, action.drink],
      };

    case 'REMOVE_DRINK':
      return {
        ...state,
        drinks: state.drinks.filter((d) => d.id !== action.id),
      };

    case 'UNDO_DRINK':
      return {
        ...state,
        drinks: state.drinks.slice(0, -1),
      };

    case 'CLEAR_DRINKS':
      return {
        ...state,
        drinks: [],
        bac: 0,
        startTime: null,
        hasBeenImpaired: false,
      };

    case 'RESET_BAC':
      return initialBACState;

    default:
      return state;
  }
}

/**
 * BAC Provider Component
 */
export function BACProvider({ children }) {
  const [state, dispatch] = useReducer(bacReducer, initialBACState);

  // Add drink action
  const addDrink = useCallback(
    (name = 'Standard Drink', oz = null, abv = null) => {
      const drinkOz = oz !== null ? parseFloat(oz) : 12;
      const drinkABV = abv !== null ? parseFloat(abv) : 5;

      const standardDrinks = calculateStandardDrinks(drinkOz, drinkABV);

      const drink = {
        id: Date.now(),
        name,
        oz: drinkOz,
        abv: drinkABV,
        standardDrinks,
        timestamp: Date.now(),
      };

      dispatch({ type: 'ADD_DRINK', drink });

      // Set start time if first drink
      if (state.drinks.length === 0) {
        dispatch({ type: 'SET_FIELD', field: 'startTime', value: Date.now() });
      }
    },
    [state.drinks.length]
  );

  // Remove specific drink
  const removeDrink = useCallback((id) => {
    dispatch({ type: 'REMOVE_DRINK', id });
  }, []);

  // Undo last drink
  const undoDrink = useCallback(() => {
    dispatch({ type: 'UNDO_DRINK' });
  }, []);

  // Clear all drinks
  const clearDrinks = useCallback(() => {
    dispatch({ type: 'CLEAR_DRINKS' });
  }, []);

  // Update field helper
  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  // Update multiple fields helper
  const setMultiple = useCallback((values) => {
    dispatch({ type: 'SET_MULTIPLE', values });
  }, []);

  // Reset BAC state
  const resetBAC = useCallback(() => {
    dispatch({ type: 'RESET_BAC' });
  }, []);

  // Memoize context value
  const value = useMemo(
    () => ({
      state,
      dispatch,
      addDrink,
      removeDrink,
      undoDrink,
      clearDrinks,
      setField,
      setMultiple,
      resetBAC,
    }),
    [state, addDrink, removeDrink, undoDrink, clearDrinks, setField, setMultiple, resetBAC]
  );

  return <BACContext.Provider value={value}>{children}</BACContext.Provider>;
}

BACProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useBAC Hook
 */
export function useBAC() {
  const context = useContext(BACContext);
  if (!context) {
    throw new Error('useBAC must be used within BACProvider');
  }
  return context;
}
