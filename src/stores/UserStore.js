/**
 * User Store
 * Manages user-related state: onboarding, profile, and geographic verification
 * Fields: 12 (ageVerified, disclaimerAccepted, safetyScreensComplete, currentSafetyScreen,
 *         setupComplete, gender, weight, geoConsentGiven, geoVerified, geoBlocked,
 *         geoCountry, geoError)
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext(undefined);

// Initial state - 12 fields
export const initialUserState = {
  // Onboarding & verification
  ageVerified: false,
  disclaimerAccepted: false,
  safetyScreensComplete: false,
  currentSafetyScreen: 0,

  // User profile
  setupComplete: false,
  gender: '',
  weight: '',

  // Geographic verification
  geoConsentGiven: false,
  geoVerified: false,
  geoBlocked: false,
  geoCountry: '',
  geoError: null,
};

/**
 * User Reducer
 */
function userReducer(state, action) {
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

    case 'NEXT_SAFETY_SCREEN':
      return {
        ...state,
        currentSafetyScreen: state.currentSafetyScreen + 1,
      };

    case 'RESET_USER':
      return {
        ...initialUserState,
        ageVerified: true,
        disclaimerAccepted: true,
        safetyScreensComplete: true,
      };

    default:
      return state;
  }
}

/**
 * User Provider Component
 */
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  // Update field helper
  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  // Update multiple fields helper
  const setMultiple = useCallback((values) => {
    dispatch({ type: 'SET_MULTIPLE', values });
  }, []);

  // Next safety screen
  const nextSafetyScreen = useCallback(() => {
    dispatch({ type: 'NEXT_SAFETY_SCREEN' });
  }, []);

  // Reset user data (keeping onboarding flags)
  const resetUser = useCallback(() => {
    dispatch({ type: 'RESET_USER' });
  }, []);

  // Memoize context value
  const value = useMemo(
    () => ({
      state,
      dispatch,
      setField,
      setMultiple,
      nextSafetyScreen,
      resetUser,
    }),
    [state, setField, setMultiple, nextSafetyScreen, resetUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useUser Hook
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
