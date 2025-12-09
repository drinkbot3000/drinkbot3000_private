/**
 * User Store
 * Manages user-related state: onboarding, profile, and geographic verification
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback, ReactNode } from 'react';
import type { Gender } from '../types';

// ============================================================================
// Types
// ============================================================================

export interface UserState {
  // Onboarding & verification
  ageVerified: boolean;
  disclaimerAccepted: boolean;
  safetyScreensComplete: boolean;
  currentSafetyScreen: number;

  // User profile
  setupComplete: boolean;
  gender: Gender | '';
  weight: string;

  // Geographic verification
  geoConsentGiven: boolean;
  geoVerified: boolean;
  geoBlocked: boolean;
  geoCountry: string;
  geoError: string | null;
}

type UserAction =
  | { type: 'SET_FIELD'; field: string; value: unknown }
  | { type: 'SET_MULTIPLE'; values: Partial<UserState> }
  | { type: 'NEXT_SAFETY_SCREEN' }
  | { type: 'RESET_USER' };

interface UserContextValue {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  setField: (field: string, value: unknown) => void;
  setMultiple: (values: Partial<UserState>) => void;
  nextSafetyScreen: () => void;
  resetUser: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

// ============================================================================
// Initial State
// ============================================================================

export const initialUserState: UserState = {
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

// ============================================================================
// Context
// ============================================================================

const UserContext = createContext<UserContextValue | undefined>(undefined);

// ============================================================================
// Reducer
// ============================================================================

function userReducer(state: UserState, action: UserAction): UserState {
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

// ============================================================================
// Provider Component
// ============================================================================

export function UserProvider({ children }: UserProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  const setField = useCallback((field: string, value: unknown) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const setMultiple = useCallback((values: Partial<UserState>) => {
    dispatch({ type: 'SET_MULTIPLE', values });
  }, []);

  const nextSafetyScreen = useCallback(() => {
    dispatch({ type: 'NEXT_SAFETY_SCREEN' });
  }, []);

  const resetUser = useCallback(() => {
    dispatch({ type: 'RESET_USER' });
  }, []);

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

// ============================================================================
// Hook
// ============================================================================

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
