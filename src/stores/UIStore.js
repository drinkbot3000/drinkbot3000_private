/**
 * UI Store
 * Manages UI state: display flags and settings edit mode
 * Fields: 9 (showSplash, showSettings, showHelp, showGeoConsent,
 *         geoVerifying, geoTechnicalError, settingsEditMode, settingsEditGender,
 *         settingsEditWeight)
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

const UIContext = createContext(undefined);

// Initial state - 9 fields
export const initialUIState = {
  // Display state
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

/**
 * UI Reducer
 */
function uiReducer(state, action) {
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

/**
 * UI Provider Component
 */
export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(uiReducer, initialUIState);

  // Update field helper
  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  // Update multiple fields helper
  const setMultiple = useCallback((values) => {
    dispatch({ type: 'SET_MULTIPLE', values });
  }, []);

  // Reset UI state (keeping splash hidden)
  const resetUI = useCallback(() => {
    dispatch({ type: 'RESET_UI' });
  }, []);

  // Memoize context value
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

UIProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useUI Hook
 */
export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
}
