import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  demoCartReducer,
  INITIAL_DEMO_CART_STATE,
  validateAndBuildDemoLine,
  calculateDemoCartSummary,
} from '../apps/teestock/src/features/demo-commerce/reducer';
import {
  getAllPreviewProducts,
  ILLUSTRATIVE_UX_PRICE_IDR,
} from '../apps/teestock/src/data/products';

const here = path.dirname(fileURLToPath(import.meta.url));
const teestockRoot = path.resolve(here, '../apps/teestock/src');
const read = (relativePath: string) =>
  fs.readFileSync(path.join(teestockRoot, relativePath), 'utf8');

describe('TeeStock Demo Commerce Simulation (NOV15-02)', () => {
  describe('Reducer & Domain Validation', () => {
    it('validates and builds demo lines for all 4 preview products with authoritative pricing', () => {
      const products = getAllPreviewProducts();
      expect(products.length).toBe(4);

      for (const product of products) {
        const color = product.previewColors[0]!;
        const size = product.previewSizes[0]!;
        const tone = product.previewPrintTones[0]!;

        const line = validateAndBuildDemoLine(
          product.slug,
          color.id,
          size,
          tone.id,
          1,
        );

        expect(line).toBeDefined();
        expect(line?.productSlug).toBe(product.slug);
        expect(line?.productTitle).toBe(product.title);
        expect(line?.size).toBe(size);
        expect(line?.colorId).toBe(color.id);
        expect(line?.colorName).toBe(color.name);
        expect(line?.printToneId).toBe(tone.id);
        expect(line?.printToneName).toBe(tone.name);
        expect(line?.unitPriceIdr).toBe(product.illustrativePriceIdr);
        expect(line?.unitPriceIdr).toBe(ILLUSTRATIVE_UX_PRICE_IDR);
        expect(line?.quantity).toBe(1);
      }
    });

    it('rejects invalid product slug, size, or variant parameters', () => {
      // Unknown product slug
      expect(
        validateAndBuildDemoLine(
          'fake-tshirt',
          'forest-ink',
          'M',
          'vintage-wash',
          1,
        ),
      ).toBeUndefined();

      // Invalid size for legitimate product
      expect(
        validateAndBuildDemoLine(
          'slow-sunday',
          'forest-ink',
          'XXXXL',
          'vintage-wash',
          1,
        ),
      ).toBeUndefined();

      // Invalid color ID
      expect(
        validateAndBuildDemoLine(
          'slow-sunday',
          'neon-yellow',
          'M',
          'vintage-wash',
          1,
        ),
      ).toBeUndefined();

      // Invalid print tone ID
      expect(
        validateAndBuildDemoLine(
          'slow-sunday',
          'forest-ink',
          'M',
          'gold-foil',
          1,
        ),
      ).toBeUndefined();

      // Non-integer or out of bounds quantity
      expect(
        validateAndBuildDemoLine(
          'slow-sunday',
          'forest-ink',
          'M',
          'vintage-wash',
          0,
        ),
      ).toBeUndefined();
      expect(
        validateAndBuildDemoLine(
          'slow-sunday',
          'forest-ink',
          'M',
          'vintage-wash',
          11,
        ),
      ).toBeUndefined();
      expect(
        validateAndBuildDemoLine(
          'slow-sunday',
          'forest-ink',
          'M',
          'vintage-wash',
          1.5,
        ),
      ).toBeUndefined();
    });

    it('consolidates identical variants and keeps distinct variants separate', () => {
      let state = INITIAL_DEMO_CART_STATE;

      // Add Slow Sunday M Forest Ink Vintage
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'slow-sunday',
          colorId: 'forest-ink',
          size: 'M',
          printToneId: 'vintage-wash',
          quantity: 1,
        },
      });
      expect(state.lines.length).toBe(1);
      expect(state.lines[0]!.quantity).toBe(1);

      // Add identical item again -> consolidates to quantity 2
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'slow-sunday',
          colorId: 'forest-ink',
          size: 'M',
          printToneId: 'vintage-wash',
          quantity: 1,
        },
      });
      expect(state.lines.length).toBe(1);
      expect(state.lines[0]!.quantity).toBe(2);

      // Add same product but different size (L) -> creates separate line
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'slow-sunday',
          colorId: 'forest-ink',
          size: 'L',
          printToneId: 'vintage-wash',
          quantity: 1,
        },
      });
      expect(state.lines.length).toBe(2);
      expect(state.lines[0]!.size).toBe('M');
      expect(state.lines[0]!.quantity).toBe(2);
      expect(state.lines[1]!.size).toBe('L');
      expect(state.lines[1]!.quantity).toBe(1);

      // Add different product (Making Things) -> creates separate line
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'making-things',
          colorId: 'chalk-bone',
          size: 'XL',
          printToneId: 'standard-screen',
          quantity: 3,
        },
      });
      expect(state.lines.length).toBe(3);
    });

    it('enforces quantity bounds (1..10) and handles item removal', () => {
      let state = INITIAL_DEMO_CART_STATE;
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'stay-curious',
          colorId: 'chalk-bone',
          size: 'S',
          printToneId: 'standard-screen',
          quantity: 9,
        },
      });
      const lineId = state.lines[0]!.id;

      // Increment exceeding 10 clamps at 10
      state = demoCartReducer(state, {
        type: 'UPDATE_QUANTITY',
        payload: { lineId, quantity: 15 },
      });
      expect(state.lines[0]!.quantity).toBe(10);

      // Adding to a line that would exceed 10 clamps at 10
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'stay-curious',
          colorId: 'chalk-bone',
          size: 'S',
          printToneId: 'standard-screen',
          quantity: 5,
        },
      });
      expect(state.lines[0]!.quantity).toBe(10);

      // Update quantity to 0 removes the line
      state = demoCartReducer(state, {
        type: 'UPDATE_QUANTITY',
        payload: { lineId, quantity: 0 },
      });
      expect(state.lines.length).toBe(0);

      // Explicit REMOVE_ITEM
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'ordinary-magic',
          colorId: 'forest-ink',
          size: 'XXL',
          printToneId: 'vintage-wash',
          quantity: 2,
        },
      });
      expect(state.lines.length).toBe(1);
      state = demoCartReducer(state, {
        type: 'REMOVE_ITEM',
        payload: { lineId: state.lines[0]!.id },
      });
      expect(state.lines.length).toBe(0);
    });

    it('calculates accurate illustrative subtotal math', () => {
      let state = INITIAL_DEMO_CART_STATE;
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'slow-sunday',
          colorId: 'forest-ink',
          size: 'M',
          printToneId: 'vintage-wash',
          quantity: 2,
        },
      });
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'making-things',
          colorId: 'chalk-bone',
          size: 'L',
          printToneId: 'standard-screen',
          quantity: 3,
        },
      });

      const summary = calculateDemoCartSummary(state.lines);
      expect(summary.totalQuantity).toBe(5);
      expect(summary.illustrativeSubtotalIdr).toBe(
        5 * ILLUSTRATIVE_UX_PRICE_IDR,
      );
      expect(summary.formattedIllustrativeSubtotal).toContain('945');
      expect(summary.isEmpty).toBe(false);

      // Clear cart
      state = demoCartReducer(state, { type: 'CLEAR_CART' });
      const emptySummary = calculateDemoCartSummary(state.lines);
      expect(emptySummary.totalQuantity).toBe(0);
      expect(emptySummary.illustrativeSubtotalIdr).toBe(0);
      expect(emptySummary.isEmpty).toBe(true);
    });

    it('rejects simulation completion on empty cart and manages completion lifecycle', () => {
      // Cannot complete empty cart
      let state = INITIAL_DEMO_CART_STATE;
      state = demoCartReducer(state, { type: 'COMPLETE_SIMULATION' });
      expect(state.isSimulationCompleted).toBe(false);

      // Add item and complete
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'slow-sunday',
          colorId: 'forest-ink',
          size: 'M',
          printToneId: 'vintage-wash',
          quantity: 1,
        },
      });
      state = demoCartReducer(state, { type: 'COMPLETE_SIMULATION' });
      expect(state.isSimulationCompleted).toBe(true);

      // Reset simulation
      state = demoCartReducer(state, { type: 'RESET_SIMULATION' });
      expect(state.isSimulationCompleted).toBe(false);
      expect(state.lines.length).toBe(0);
    });
  });

  describe('Non-Transactional & Security Invariants', () => {
    const demoCartPage = read('app/demo/cart/page.tsx');
    const demoCheckoutPage = read('app/demo/checkout/page.tsx');
    const demoCompletePage = read('app/demo/complete/page.tsx');
    const contextFile = read('features/demo-commerce/context.tsx');
    const reducerFile = read('features/demo-commerce/reducer.ts');
    const allDemoCode = [
      demoCartPage,
      demoCheckoutPage,
      demoCompletePage,
      contextFile,
      reducerFile,
    ];

    it('contains strictly zero external network fetch or backend API calls', () => {
      for (const code of allDemoCode) {
        expect(code).not.toContain('fetch(');
        expect(code).not.toContain('axios');
        expect(code).not.toContain('/api/');
      }
    });

    it('contains strictly zero Supabase or database references', () => {
      for (const code of allDemoCode) {
        expect(code).not.toContain('supabase');
        expect(code).not.toContain('from(');
        expect(code).not.toContain('rpc(');
      }
    });

    it('contains strictly zero persistent browser storage (in-memory only)', () => {
      for (const code of allDemoCode) {
        expect(code).not.toContain('localStorage');
        expect(code).not.toContain('sessionStorage');
        expect(code).not.toContain('indexedDB');
      }
    });

    it('contains strictly zero PII collection inputs or payment processing forms', () => {
      for (const code of allDemoCode) {
        // No input forms for PII
        expect(code).not.toContain('<input type="text"');
        expect(code).not.toContain('<input type="email"');
        expect(code).not.toContain('<input type="tel"');
        expect(code).not.toContain('<textarea');
        expect(code).not.toContain('<form');
        expect(code).not.toContain('method="post"');
        expect(code).not.toContain('Midtrans');
        expect(code).not.toContain('Xendit');
      }
    });

    it('prominently includes simulation disclosures and reload-reset notices across all demo pages', () => {
      const normalizedCart = demoCartPage.replace(/\s+/g, ' ');
      expect(normalizedCart).toContain('SIMULASI FRONTEND');
      expect(normalizedCart).toContain('Pratinjau Alur Demo Keranjang Belanja');
      expect(normalizedCart).toContain('Memuat ulang halaman');
      expect(normalizedCart).toContain('reset');

      const normalizedCheckout = demoCheckoutPage.replace(/\s+/g, ' ');
      expect(normalizedCheckout).toContain('SIMULASI DEMO');
      expect(normalizedCheckout).toContain(
        'Ini simulasi checkout. Tidak ada pesanan atau pembayaran sungguhan.',
      );
      expect(normalizedCheckout).toContain('tanpa pengumpulan data pribadi');

      const normalizedComplete = demoCompletePage.replace(/\s+/g, ' ');
      expect(normalizedComplete).toContain(
        'Simulasi Selesai — Tidak Ada Pesanan atau Pembayaran yang Dibuat.',
      );
      expect(normalizedComplete).toContain('Tanpa Penarikan Dana');
      expect(normalizedComplete).toContain('Tanpa Pesanan Komersial');
    });

    it('preserves negative routing invariant: real commercial routes remain absent', () => {
      const header = read('components/Header.tsx');
      const home = read('app/page.tsx');
      const shop = read('app/shop/page.tsx');

      // Real checkout or cart routes must never exist
      expect(header).not.toContain('href="/cart"');
      expect(header).not.toContain('href="/checkout"');
      expect(home).not.toContain('href="/cart"');
      expect(home).not.toContain('href="/checkout"');
      expect(shop).not.toContain('href="/cart"');
      expect(shop).not.toContain('href="/checkout"');

      // Only /demo/cart is linked in Header
      expect(header).toContain('href="/demo/cart"');
    });
  });
});
