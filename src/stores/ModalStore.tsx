/**
 * Modal Store
 * Manages all modal and dialog state
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback, ReactNode } from 'react';
import { JOKES, ROBOT_GREETINGS, ROBOT_COMMENTS } from '../constants';

// ============================================================================
// Types
// ============================================================================

export interface ModalState {
  // Robot messages & jokes
  showJoke: boolean;
  currentJoke: string;
  robotMessage: string;

  // Confirmation modal
  showConfirmModal: boolean;
  confirmModalMessage: string;
  confirmModalAction: (() => void) | null;

  // Other modals
  showDisclaimerModal: boolean;
  showRefundPolicy: boolean;
  showReceipt: boolean;
  showAgeRestrictionModal: boolean;
}

type ModalAction =
  | { type: 'SET_FIELD'; field: string; value: unknown }
  | { type: 'SET_MULTIPLE'; values: Partial<ModalState> }
  | { type: 'SHOW_CONFIRM'; message: string; action: () => void }
  | { type: 'HIDE_CONFIRM' }
  | { type: 'RESET_MODALS' };

interface ModalContextValue {
  state: ModalState;
  dispatch: React.Dispatch<ModalAction>;
  showConfirm: (message: string, action: () => void) => void;
  hideConfirm: () => void;
  setField: (field: string, value: unknown) => void;
  setMultiple: (values: Partial<ModalState>) => void;
  getRandomJoke: () => string;
  getRandomRobotGreeting: () => string;
  getRandomRobotComment: () => string;
  resetModals: () => void;
}

interface ModalProviderProps {
  children: ReactNode;
}

// ============================================================================
// Initial State
// ============================================================================

export const initialModalState: ModalState = {
  // Robot messages & jokes
  showJoke: false,
  currentJoke: '',
  robotMessage: '',

  // Confirmation modal
  showConfirmModal: false,
  confirmModalMessage: '',
  confirmModalAction: null,

  // Other modals
  showDisclaimerModal: false,
  showRefundPolicy: false,
  showReceipt: false,
  showAgeRestrictionModal: false,
};

// ============================================================================
// Context
// ============================================================================

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

// ============================================================================
// Reducer
// ============================================================================

function modalReducer(state: ModalState, action: ModalAction): ModalState {
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

    case 'SHOW_CONFIRM':
      return {
        ...state,
        showConfirmModal: true,
        confirmModalMessage: action.message,
        confirmModalAction: action.action,
      };

    case 'HIDE_CONFIRM':
      return {
        ...state,
        showConfirmModal: false,
        confirmModalMessage: '',
        confirmModalAction: null,
      };

    case 'RESET_MODALS':
      return initialModalState;

    default:
      return state;
  }
}

// ============================================================================
// Provider Component
// ============================================================================

export function ModalProvider({ children }: ModalProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(modalReducer, initialModalState);

  const showConfirm = useCallback((message: string, action: () => void) => {
    dispatch({ type: 'SHOW_CONFIRM', message, action });
  }, []);

  const hideConfirm = useCallback(() => {
    dispatch({ type: 'HIDE_CONFIRM' });
  }, []);

  const setField = useCallback((field: string, value: unknown) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const setMultiple = useCallback((values: Partial<ModalState>) => {
    dispatch({ type: 'SET_MULTIPLE', values });
  }, []);

  const getRandomJoke = useCallback(() => {
    return JOKES[Math.floor(Math.random() * JOKES.length)] ?? '';
  }, []);

  const getRandomRobotGreeting = useCallback(() => {
    return ROBOT_GREETINGS[Math.floor(Math.random() * ROBOT_GREETINGS.length)] ?? '';
  }, []);

  const getRandomRobotComment = useCallback(() => {
    return ROBOT_COMMENTS[Math.floor(Math.random() * ROBOT_COMMENTS.length)] ?? '';
  }, []);

  const resetModals = useCallback(() => {
    dispatch({ type: 'RESET_MODALS' });
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      showConfirm,
      hideConfirm,
      setField,
      setMultiple,
      getRandomJoke,
      getRandomRobotGreeting,
      getRandomRobotComment,
      resetModals,
    }),
    [
      state,
      showConfirm,
      hideConfirm,
      setField,
      setMultiple,
      getRandomJoke,
      getRandomRobotGreeting,
      getRandomRobotComment,
      resetModals,
    ]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useModal(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}
