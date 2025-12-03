/**
 * Modal Store
 * Manages all modal and dialog state
 * Fields: 10 (showJoke, currentJoke, robotMessage, showConfirmModal, confirmModalMessage,
 *         confirmModalAction, showDisclaimerModal, showRefundPolicy, showReceipt,
 *         showAgeRestrictionModal)
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { JOKES, ROBOT_GREETINGS, ROBOT_COMMENTS } from '../constants';

const ModalContext = createContext(undefined);

// Initial state - 10 fields
export const initialModalState = {
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

/**
 * Modal Reducer
 */
function modalReducer(state, action) {
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

/**
 * Modal Provider Component
 */
export function ModalProvider({ children }) {
  const [state, dispatch] = useReducer(modalReducer, initialModalState);

  // Show confirmation modal
  const showConfirm = useCallback((message, action) => {
    dispatch({ type: 'SHOW_CONFIRM', message, action });
  }, []);

  // Hide confirmation modal
  const hideConfirm = useCallback(() => {
    dispatch({ type: 'HIDE_CONFIRM' });
  }, []);

  // Update field helper
  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  // Update multiple fields helper
  const setMultiple = useCallback((values) => {
    dispatch({ type: 'SET_MULTIPLE', values });
  }, []);

  // Get random joke
  const getRandomJoke = useCallback(() => {
    return JOKES[Math.floor(Math.random() * JOKES.length)];
  }, []);

  // Get random robot greeting
  const getRandomRobotGreeting = useCallback(() => {
    return ROBOT_GREETINGS[Math.floor(Math.random() * ROBOT_GREETINGS.length)];
  }, []);

  // Get random robot comment
  const getRandomRobotComment = useCallback(() => {
    return ROBOT_COMMENTS[Math.floor(Math.random() * ROBOT_COMMENTS.length)];
  }, []);

  // Reset modals
  const resetModals = useCallback(() => {
    dispatch({ type: 'RESET_MODALS' });
  }, []);

  // Memoize context value
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

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useModal Hook
 */
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}
