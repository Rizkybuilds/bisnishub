'use client';

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from 'react';
import type {
  DemoCartActionResult,
  DemoCartState,
  DemoCartSummary,
} from './types';
import {
  demoCartReducer,
  INITIAL_DEMO_CART_STATE,
  calculateDemoCartSummary,
  validateAddDemoCartItem,
} from './reducer';

interface DemoCartContextValue {
  state: DemoCartState;
  summary: DemoCartSummary;
  addItem: (
    productSlug: string,
    colorId: string,
    size: string,
    printToneId: string,
    quantity?: number,
  ) => DemoCartActionResult;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  completeSimulation: () => boolean;
  resetSimulation: () => void;
}

const DemoCartContext = createContext<DemoCartContextValue | null>(null);

export function DemoCartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    demoCartReducer,
    INITIAL_DEMO_CART_STATE,
  );

  const summary = useMemo(
    () => calculateDemoCartSummary(state.lines),
    [state.lines],
  );

  const value = useMemo<DemoCartContextValue>(() => {
    return {
      state,
      summary,
      addItem: (productSlug, colorId, size, printToneId, quantity = 1) => {
        const payload = { productSlug, colorId, size, printToneId, quantity };
        const result = validateAddDemoCartItem(state, payload);
        dispatch({
          type: 'ADD_ITEM',
          payload,
        });
        return result;
      },
      updateQuantity: (lineId, quantity) => {
        dispatch({
          type: 'UPDATE_QUANTITY',
          payload: { lineId, quantity },
        });
      },
      removeItem: (lineId) => {
        dispatch({
          type: 'REMOVE_ITEM',
          payload: { lineId },
        });
      },
      clearCart: () => {
        dispatch({ type: 'CLEAR_CART' });
      },
      completeSimulation: () => {
        if (state.lines.length === 0) {
          return false;
        }
        dispatch({ type: 'COMPLETE_SIMULATION' });
        return true;
      },
      resetSimulation: () => {
        dispatch({ type: 'RESET_SIMULATION' });
      },
    };
  }, [state, summary]);

  return (
    <DemoCartContext.Provider value={value}>
      {children}
      {/* Accessible live region for cart updates */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {state.lastActionNotice}
      </div>
    </DemoCartContext.Provider>
  );
}

export function useDemoCart(): DemoCartContextValue {
  const context = useContext(DemoCartContext);
  if (!context) {
    throw new Error('useDemoCart must be used within a DemoCartProvider');
  }
  return context;
}
