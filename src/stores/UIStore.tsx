/**
 * UI Store
 * Manages UI state: tabs, display flags, and settings edit mode
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback, ReactNode } from 'react';
import type { Gender } from '../types';

// ============================================================================
// Types
// ============================================================================

export type TabType = 'tracker' | 'calculator';

export interface UIState {
  // Tab & display state
  activeTab: TabType;
  showSplash: boolean;
  showSettings: boolean;
  showHelp: boolean;

  // Geographic UI state
  showGeoConsent: boolean;
  geoVerifying: boolean;
  geoTechnicalError: boolean;

  // Settings edit mode
  settingsEditMode: boolean;
  settingsEditGender: Gender | '';
  settingsEditWeight: string;
}

type UIAction =
  | { type: 'SET_FIELD'; field: string; value: unknown }
  | { type: 'SET_MULTIPLE'; values: Partial<UIState> }
  | { type: 'RESET_UI' };

interface UIContextValue {
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
  setField: (field: string, value: unknown) => void;
  setMultiple: (values: Partial<UIState>) => void;
  resetUI: () => void;
}

interface UIProviderProps {
  children: ReactNode;
}

// ============================================================================
// Initial State
// ============================================================================

export const initialUIState: UIState = {
  // Tab & display state
  activeTab: 'tracker',
  showSplash: true,
  showSettings: false,
  showHelp: false,

  // Geographic UI state
  showGeoConsent: false,
  geoVerifying: false,
  geoTechnicalError: false,

  // Settings edit mode
  settingsEditMode: false,
  settingsEditGender: '',
  settingsEditWeight: '',
};

// ============================================================================
// Context
// ============================================================================

const UIContext = createContext<UIContextValue | undefined>(undefined);

// ============================================================================
// Reducer
// ============================================================================

function uiReducer(state: UIState, action: UIAction): UIState {
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

    case 'RESET_UI':
      return {
        ...initialUIState,
        showSplash: false,
      };

    default:
      return state;
  }
}

// ============================================================================
// Provider Component
// ============================================================================

export function UIProvider({ children }: UIProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(uiReducer, initialUIState);

  const setField = useCallback((field: string, value: unknown) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const setMultiple = useCallback((values: Partial<UIState>) => {
    dispatch({ type: 'SET_MULTIPLE', values });
  }, []);

  const resetUI = useCallback(() => {
    dispatch({ type: 'RESET_UI' });
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      setField,
      setMultiple,
      resetUI,
    }),
    [state, setField, setMultiple, resetUI]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
}
