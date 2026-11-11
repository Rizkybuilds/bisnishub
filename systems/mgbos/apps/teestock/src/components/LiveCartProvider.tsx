'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  StorefrontProduct,
  StorefrontVariant,
} from '../lib/storefront-product';
import {
  addToCart,
  cartLineKey,
  cartTotal,
  cartUnits,
  MAX_TOTAL_UNITS,
  normalizeCart,
  type LiveCartLine,
} from '../lib/live-cart';

const KEY = 'teestock-real-cart-v1';

interface LiveCartContextValue {
  lines: LiveCartLine[];
  count: number;
  subtotal: number;
  loaded: boolean;
  add: (
    product: StorefrontProduct,
    variant: StorefrontVariant,
  ) => string | null;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const LiveCartContext = createContext<LiveCartContextValue | null>(null);

export function LiveCartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<LiveCartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setLines(
          normalizeCart(JSON.parse(window.localStorage.getItem(KEY) || '[]')),
        );
      } catch {
        setLines([]);
      } finally {
        setLoaded(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      // Storage may be unavailable; in-memory cart remains usable.
    }
  }, [lines, loaded]);

  const add = useCallback(
    (product: StorefrontProduct, variant: StorefrontVariant) => {
      const incoming: LiveCartLine = {
        slug: product.slug,
        sku: variant.sku,
        productTitle: product.title,
        color: variant.color,
        size: variant.size,
        priceIdr: variant.priceIdr,
        quantity: 1,
      };
      const result = addToCart(lines, incoming);
      if (result.error) return result.error;
      setLines(result.lines);
      return null;
    },
    [lines],
  );

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((current) => {
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10)
        return current;
      const next = current.map((item) =>
        cartLineKey(item) === key ? { ...item, quantity } : item,
      );
      return cartUnits(next) <= MAX_TOTAL_UNITS ? next : current;
    });
  }, []);
  const remove = useCallback((key: string) => {
    setLines((current) => current.filter((item) => cartLineKey(item) !== key));
  }, []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      count: cartUnits(lines),
      subtotal: cartTotal(lines),
      loaded,
      add,
      setQuantity,
      remove,
      clear,
    }),
    [lines, loaded, add, setQuantity, remove, clear],
  );

  return (
    <LiveCartContext.Provider value={value}>
      {children}
    </LiveCartContext.Provider>
  );
}

export function useLiveCart(): LiveCartContextValue {
  const ctx = useContext(LiveCartContext);
  if (!ctx) throw new Error('Cart provider is missing');
  return ctx;
}
