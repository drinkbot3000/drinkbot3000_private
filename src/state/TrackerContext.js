/**
 * Tracker Context
 * Global state management using React Context API
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { trackerReducer, initialState } from './trackerReducer';
import { calculateStandardDrinks } from '../services/bacCalculation.service';
import { generateReceipt } from '../services/receipt.service';

const TrackerContext = createContext(undefined);

/**
 * Tracker Provider Component
 * Wraps app with global state
 */
export function TrackerProvider({ children }) {
  const [state, dispatch] = useReducer(trackerReducer, initialState);

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

  // Reset app
  const resetApp = useCallback(() => {
    dispatch({ type: 'RESET_APP' });
  }, []);

  // Show confirmation modal
  const showConfirm = useCallback((message, action) => {
    dispatch({ type: 'SHOW_CONFIRM', message, action });
  }, []);

  // Hide confirmation modal
  const hideConfirm = useCallback(() => {
    dispatch({ type: 'HIDE_CONFIRM' });
  }, []);

  // Add receipt
  const addReceipt = useCallback((amount, paymentMethod = 'Stripe') => {
    const receipt = generateReceipt(amount, paymentMethod);
    dispatch({ type: 'ADD_RECEIPT', receipt });
    return receipt;
  }, []);

  // Update field helper
  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  // Update multiple fields helper
  const setMultiple = useCallback((values) => {
    dispatch({ type: 'SET_MULTIPLE', values });
  }, []);

  // Add custom drink
  const addCustomDrink = useCallback((drink) => {
    dispatch({ type: 'ADD_CUSTOM_DRINK', drink });
  }, []);

  // Delete custom drink
  const deleteCustomDrink = useCallback((id) => {
    dispatch({ type: 'DELETE_CUSTOM_DRINK', id });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      state,
      dispatch,
      // Actions
      addDrink,
      removeDrink,
      undoDrink,
      clearDrinks,
      resetApp,
      showConfirm,
      hideConfirm,
      addReceipt,
      setField,
      setMultiple,
      addCustomDrink,
      deleteCustomDrink,
    }),
    [
      state,
      addDrink,
      removeDrink,
      undoDrink,
      clearDrinks,
      resetApp,
      showConfirm,
      hideConfirm,
      addReceipt,
      setField,
      setMultiple,
      addCustomDrink,
      deleteCustomDrink,
    ]
  );

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
}

TrackerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useTracker Hook
 * Access tracker context
 */
export function useTracker() {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within TrackerProvider');
  }
  return context;
}
