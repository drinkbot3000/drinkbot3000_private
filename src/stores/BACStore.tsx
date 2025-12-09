/**
 * BAC Store
 * Manages BAC tracking and calculator state
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback, ReactNode } from 'react';
import { calculateStandardDrinks } from '../services/bacCalculation.service';

// ============================================================================
// Types
// ============================================================================

export interface DrinkRecord {
  id: number;
  name: string;
  oz: number;
  abv: number;
  standardDrinks: number;
  timestamp: number;
}

export interface BACState {
  // BAC tracking
  bac: number;
  drinks: DrinkRecord[];
  startTime: number | null;
  hasBeenImpaired: boolean;
  useSlowMetabolism: boolean;

  // Calculator
  calcDrinks: string;
  calcHours: string;
  calcBAC: number | null;
}

type BACAction =
  | { type: 'SET_FIELD'; field: string; value: unknown }
  | { type: 'SET_MULTIPLE'; values: Partial<BACState> }
  | { type: 'ADD_DRINK'; drink: DrinkRecord }
  | { type: 'REMOVE_DRINK'; id: number }
  | { type: 'UNDO_DRINK' }
  | { type: 'CLEAR_DRINKS' }
  | { type: 'RESET_BAC' };

interface BACContextValue {
  state: BACState;
  dispatch: React.Dispatch<BACAction>;
  addDrink: (name?: string, oz?: string | number | null, abv?: string | number | null) => void;
  removeDrink: (id: number) => void;
  undoDrink: () => void;
  clearDrinks: () => void;
  setField: (field: string, value: unknown) => void;
  setMultiple: (values: Partial<BACState>) => void;
  resetBAC: () => void;
}

interface BACProviderProps {
  children: ReactNode;
}

// ============================================================================
// Initial State
// ============================================================================

export const initialBACState: BACState = {
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

// ============================================================================
// Context
// ============================================================================

const BACContext = createContext<BACContextValue | undefined>(undefined);

// ============================================================================
// Reducer
// ============================================================================

function bacReducer(state: BACState, action: BACAction): BACState {
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

// ============================================================================
// Provider Component
// ============================================================================

export function BACProvider({ children }: BACProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(bacReducer, initialBACState);

  const addDrink = useCallback(
    (name = 'Standard Drink', oz: string | number | null = null, abv: string | number | null = null) => {
      const drinkOz = oz !== null ? parseFloat(String(oz)) : 12;
      const drinkABV = abv !== null ? parseFloat(String(abv)) : 5;

      const standardDrinks = calculateStandardDrinks(drinkOz, drinkABV);

      const drink: DrinkRecord = {
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

  const removeDrink = useCallback((id: number) => {
    dispatch({ type: 'REMOVE_DRINK', id });
  }, []);

  const undoDrink = useCallback(() => {
    dispatch({ type: 'UNDO_DRINK' });
  }, []);

  const clearDrinks = useCallback(() => {
    dispatch({ type: 'CLEAR_DRINKS' });
  }, []);

  const setField = useCallback((field: string, value: unknown) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const setMultiple = useCallback((values: Partial<BACState>) => {
    dispatch({ type: 'SET_MULTIPLE', values });
  }, []);

  const resetBAC = useCallback(() => {
    dispatch({ type: 'RESET_BAC' });
  }, []);

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

// ============================================================================
// Hook
// ============================================================================

export function useBAC(): BACContextValue {
  const context = useContext(BACContext);
  if (!context) {
    throw new Error('useBAC must be used within BACProvider');
  }
  return context;
}
