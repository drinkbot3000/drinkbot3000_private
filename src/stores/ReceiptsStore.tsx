/**
 * Receipts Store
 * Manages receipts and payment history
 */

import React, { createContext, useContext, useReducer, useMemo, useCallback, ReactNode } from 'react';
import { generateReceipt, type Receipt } from '../services/receipt.service';

// ============================================================================
// Types
// ============================================================================

export interface ReceiptsState {
  currentReceipt: Receipt | null;
  receipts: Receipt[];
}

type ReceiptsAction =
  | { type: 'SET_FIELD'; field: string; value: unknown }
  | { type: 'SET_MULTIPLE'; values: Partial<ReceiptsState> }
  | { type: 'ADD_RECEIPT'; receipt: Receipt }
  | { type: 'RESET_RECEIPTS' };

interface ReceiptsContextValue {
  state: ReceiptsState;
  dispatch: React.Dispatch<ReceiptsAction>;
  addReceipt: (amount: number, paymentMethod?: string) => Receipt;
  setField: (field: string, value: unknown) => void;
  setMultiple: (values: Partial<ReceiptsState>) => void;
  resetReceipts: () => void;
}

interface ReceiptsProviderProps {
  children: ReactNode;
}

// ============================================================================
// Initial State
// ============================================================================

export const initialReceiptsState: ReceiptsState = {
  currentReceipt: null,
  receipts: [],
};

// ============================================================================
// Context
// ============================================================================

const ReceiptsContext = createContext<ReceiptsContextValue | undefined>(undefined);

// ============================================================================
// Reducer
// ============================================================================

function receiptsReducer(state: ReceiptsState, action: ReceiptsAction): ReceiptsState {
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

// ============================================================================
// Provider Component
// ============================================================================

export function ReceiptsProvider({ children }: ReceiptsProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(receiptsReducer, initialReceiptsState);

  const addReceipt = useCallback((amount: number, paymentMethod = 'Stripe'): Receipt => {
    const receipt = generateReceipt(amount, paymentMethod);
    dispatch({ type: 'ADD_RECEIPT', receipt });
    return receipt;
  }, []);

  const setField = useCallback((field: string, value: unknown) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const setMultiple = useCallback((values: Partial<ReceiptsState>) => {
    dispatch({ type: 'SET_MULTIPLE', values });
  }, []);

  const resetReceipts = useCallback(() => {
    dispatch({ type: 'RESET_RECEIPTS' });
  }, []);

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

// ============================================================================
// Hook
// ============================================================================

export function useReceipts(): ReceiptsContextValue {
  const context = useContext(ReceiptsContext);
  if (!context) {
    throw new Error('useReceipts must be used within ReceiptsProvider');
  }
  return context;
}
