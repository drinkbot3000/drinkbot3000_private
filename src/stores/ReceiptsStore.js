/**
 * Receipts Store
 * Manages receipts and payment history
 * Fields: 2 (currentReceipt, receipts)
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { generateReceipt } from '../services/receipt.service';

const ReceiptsContext = createContext(undefined);

// Initial state - 2 fields
export const initialReceiptsState = {
  currentReceipt: null,
  receipts: [],
};

/**
 * Receipts Reducer
 */
function receiptsReducer(state, action) {
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

    case 'ADD_RECEIPT':
      return {
        ...state,
        receipts: [...state.receipts, action.receipt],
        currentReceipt: action.receipt,
      };

    case 'RESET_RECEIPTS':
      return initialReceiptsState;

    default:
      return state;
  }
}

/**
 * Receipts Provider Component
 */
export function ReceiptsProvider({ children }) {
  const [state, dispatch] = useReducer(receiptsReducer, initialReceiptsState);

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

  // Reset receipts
  const resetReceipts = useCallback(() => {
    dispatch({ type: 'RESET_RECEIPTS' });
  }, []);

  // Memoize context value
  const value = useMemo(
    () => ({
      state,
      dispatch,
      addReceipt,
      setField,
      setMultiple,
      resetReceipts,
    }),
    [state, addReceipt, setField, setMultiple, resetReceipts]
  );

  return <ReceiptsContext.Provider value={value}>{children}</ReceiptsContext.Provider>;
}

ReceiptsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useReceipts Hook
 */
export function useReceipts() {
  const context = useContext(ReceiptsContext);
  if (!context) {
    throw new Error('useReceipts must be used within ReceiptsProvider');
  }
  return context;
}
