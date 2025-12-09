/**
 * Custom Drinks Store
 * Manages custom drinks, drink history, and validation errors
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback, ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface SavedCustomDrink {
  id: number;
  name: string;
  oz: number;
  abv: number;
  createdAt: number;
}

export interface CustomDrinksState {
  // Custom drink form
  customDrinkOz: string;
  customDrinkABV: string;
  customDrinkName: string;
  showCustomDrink: boolean;

  // Saved drinks
  savedCustomDrinks: SavedCustomDrink[];
  showDrinkHistory: boolean;

  // Validation errors
  weightError: string;
  tipError: string;
  customTipAmount: string;
}

type CustomDrinksAction =
  | { type: 'SET_FIELD'; field: string; value: unknown }
  | { type: 'SET_MULTIPLE'; values: Partial<CustomDrinksState> }
  | { type: 'ADD_CUSTOM_DRINK'; drink: SavedCustomDrink }
  | { type: 'DELETE_CUSTOM_DRINK'; id: number }
  | { type: 'RESET_CUSTOM_DRINKS' };

interface CustomDrinksContextValue {
  state: CustomDrinksState;
  dispatch: React.Dispatch<CustomDrinksAction>;
  addCustomDrink: (drink: SavedCustomDrink) => void;
  deleteCustomDrink: (id: number) => void;
  setField: (field: string, value: unknown) => void;
  setMultiple: (values: Partial<CustomDrinksState>) => void;
  resetCustomDrinks: () => void;
}

interface CustomDrinksProviderProps {
  children: ReactNode;
}

// ============================================================================
// Initial State
// ============================================================================

export const initialCustomDrinksState: CustomDrinksState = {
  // Custom drink form
  customDrinkOz: '',
  customDrinkABV: '5',
  customDrinkName: '',
  showCustomDrink: false,

  // Saved drinks
  savedCustomDrinks: [],
  showDrinkHistory: false,

  // Validation errors
  weightError: '',
  tipError: '',
  customTipAmount: '',
};

// ============================================================================
// Context
// ============================================================================

const CustomDrinksContext = createContext<CustomDrinksContextValue | undefined>(undefined);

// ============================================================================
// Reducer
// ============================================================================

function customDrinksReducer(state: CustomDrinksState, action: CustomDrinksAction): CustomDrinksState {
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

// ============================================================================
// Provider Component
// ============================================================================

export function CustomDrinksProvider({ children }: CustomDrinksProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(customDrinksReducer, initialCustomDrinksState);

  const addCustomDrink = useCallback((drink: SavedCustomDrink) => {
    dispatch({ type: 'ADD_CUSTOM_DRINK', drink });
  }, []);

  const deleteCustomDrink = useCallback((id: number) => {
    dispatch({ type: 'DELETE_CUSTOM_DRINK', id });
  }, []);

  const setField = useCallback((field: string, value: unknown) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const setMultiple = useCallback((values: Partial<CustomDrinksState>) => {
    dispatch({ type: 'SET_MULTIPLE', values });
  }, []);

  const resetCustomDrinks = useCallback(() => {
    dispatch({ type: 'RESET_CUSTOM_DRINKS' });
  }, []);

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

// ============================================================================
// Hook
// ============================================================================

export function useCustomDrinks(): CustomDrinksContextValue {
  const context = useContext(CustomDrinksContext);
  if (!context) {
    throw new Error('useCustomDrinks must be used within CustomDrinksProvider');
  }
  return context;
}
