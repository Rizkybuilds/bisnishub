import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  demoCartReducer,
  INITIAL_DEMO_CART_STATE,
  validateAndBuildDemoLine,
  validateAddDemoCartItem,
  calculateDemoCartSummary,
  MAX_LINE_QUANTITY,
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

    it('rejects invalid product slug, size, or variant parameters (R2-CART-02)', () => {
      const state = INITIAL_DEMO_CART_STATE;

      // 1. Unknown product slug
      const invalidSlugResult = validateAddDemoCartItem(state, {
        productSlug: 'fake-tshirt',
        colorId: 'forest-ink',
        size: 'M',
        printToneId: 'vintage-wash',
        quantity: 1,
      });
      expect(invalidSlugResult.success).toBe(false);
      if (!invalidSlugResult.success) {
        expect(invalidSlugResult.reason).toBe('INVALID_PRODUCT');
        expect(invalidSlugResult.error).toContain('tidak ditemukan');
      }

      // 2. Invalid color
      const invalidColorResult = validateAddDemoCartItem(state, {
        productSlug: 'slow-sunday',
        colorId: 'neon-yellow',
        size: 'M',
        printToneId: 'vintage-wash',
        quantity: 1,
      });
      expect(invalidColorResult.success).toBe(false);
      if (!invalidColorResult.success) {
        expect(invalidColorResult.reason).toBe('INVALID_VARIANT');
        expect(invalidColorResult.error).toContain('warna garmen tidak valid');
      }

      // 3. Invalid size
      const invalidSizeResult = validateAddDemoCartItem(state, {
        productSlug: 'slow-sunday',
        colorId: 'forest-ink',
        size: 'XXXXL',
        printToneId: 'vintage-wash',
        quantity: 1,
      });
      expect(invalidSizeResult.success).toBe(false);
      if (!invalidSizeResult.success) {
        expect(invalidSizeResult.reason).toBe('INVALID_VARIANT');
        expect(invalidSizeResult.error).toContain('ukuran garmen tidak valid');
      }

      // 4. Invalid print treatment
      const invalidToneResult = validateAddDemoCartItem(state, {
        productSlug: 'slow-sunday',
        colorId: 'forest-ink',
        size: 'M',
        printToneId: 'gold-foil',
        quantity: 1,
      });
      expect(invalidToneResult.success).toBe(false);
      if (!invalidToneResult.success) {
        expect(invalidToneResult.reason).toBe('INVALID_VARIANT');
        expect(invalidToneResult.error).toContain(
          'karakteristik cetak tidak valid',
        );
      }
    });

    it('enforces strict quantity bounds: rejects 0, 11, fractional, and nonfinite values (R2-CART-02)', () => {
      const state = INITIAL_DEMO_CART_STATE;

      // Quantity 0
      const zeroResult = validateAddDemoCartItem(state, {
        productSlug: 'slow-sunday',
        colorId: 'forest-ink',
        size: 'M',
        printToneId: 'vintage-wash',
        quantity: 0,
      });
      expect(zeroResult.success).toBe(false);
      if (!zeroResult.success) {
        expect(zeroResult.reason).toBe('INVALID_QUANTITY');
      }

      // Quantity 11
      const elevenResult = validateAddDemoCartItem(state, {
        productSlug: 'slow-sunday',
        colorId: 'forest-ink',
        size: 'M',
        printToneId: 'vintage-wash',
        quantity: 11,
      });
      expect(elevenResult.success).toBe(false);
      if (!elevenResult.success) {
        expect(elevenResult.reason).toBe('INVALID_QUANTITY');
      }

      // Fractional quantity 1.5
      const fractionalResult = validateAddDemoCartItem(state, {
        productSlug: 'slow-sunday',
        colorId: 'forest-ink',
        size: 'M',
        printToneId: 'vintage-wash',
        quantity: 1.5,
      });
      expect(fractionalResult.success).toBe(false);
      if (!fractionalResult.success) {
        expect(fractionalResult.reason).toBe('INVALID_QUANTITY');
      }

      // Nonfinite quantity NaN / Infinity
      const nanResult = validateAddDemoCartItem(state, {
        productSlug: 'slow-sunday',
        colorId: 'forest-ink',
        size: 'M',
        printToneId: 'vintage-wash',
        quantity: Number.NaN,
      });
      expect(nanResult.success).toBe(false);
      if (!nanResult.success) {
        expect(nanResult.reason).toBe('INVALID_QUANTITY');
      }

      const infResult = validateAddDemoCartItem(state, {
        productSlug: 'slow-sunday',
        colorId: 'forest-ink',
        size: 'M',
        printToneId: 'vintage-wash',
        quantity: Number.POSITIVE_INFINITY,
      });
      expect(infResult.success).toBe(false);
      if (!infResult.success) {
        expect(infResult.reason).toBe('INVALID_QUANTITY');
      }
    });

    it('handles legitimate consolidation within 1..10 and rejects overflow beyond 10 (R2-CART-02)', () => {
      let state = INITIAL_DEMO_CART_STATE;

      // Add Slow Sunday M Forest Ink (qty 6)
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'slow-sunday',
          colorId: 'forest-ink',
          size: 'M',
          printToneId: 'vintage-wash',
          quantity: 6,
        },
      });
      expect(state.lines.length).toBe(1);
      expect(state.lines[0]!.quantity).toBe(6);
      expect(state.lastActionResult?.success).toBe(true);

      // Add another 3 of the identical variant -> total 9 (valid consolidation)
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'slow-sunday',
          colorId: 'forest-ink',
          size: 'M',
          printToneId: 'vintage-wash',
          quantity: 3,
        },
      });
      expect(state.lines.length).toBe(1);
      expect(state.lines[0]!.quantity).toBe(9);
      expect(state.lastActionResult?.success).toBe(true);

      // Attempting to add 2 more would result in 11 -> MUST REJECT (not silently clamp)
      const initialSummary = calculateDemoCartSummary(state.lines);
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
      // Verification: State, lines, and subtotal must remain completely unchanged
      expect(state.lines.length).toBe(1);
      expect(state.lines[0]!.quantity).toBe(9);
      const afterRejectSummary = calculateDemoCartSummary(state.lines);
      expect(afterRejectSummary.totalQuantity).toBe(
        initialSummary.totalQuantity,
      );
      expect(afterRejectSummary.illustrativeSubtotalIdr).toBe(
        initialSummary.illustrativeSubtotalIdr,
      );
      expect(state.lastActionResult?.success).toBe(false);
      if (state.lastActionResult && !state.lastActionResult.success) {
        expect(state.lastActionResult.reason).toBe('MAX_QUANTITY_EXCEEDED');
        expect(state.lastActionResult.error).toContain(
          `Jumlah maksimum (${MAX_LINE_QUANTITY} pcs) tercapai`,
        );
      }
    });

    it('preserves distinct variants as independent cart lines', () => {
      let state = INITIAL_DEMO_CART_STATE;

      // Add Slow Sunday M Forest Ink
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

      // Add same product, different size (L)
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

      // Add same product and size, different color (Chalk Bone)
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'slow-sunday',
          colorId: 'chalk-bone',
          size: 'M',
          printToneId: 'vintage-wash',
          quantity: 1,
        },
      });

      // Add different product (Making Things)
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'making-things',
          colorId: 'chalk-bone',
          size: 'XL',
          printToneId: 'standard-screen',
          quantity: 2,
        },
      });

      expect(state.lines.length).toBe(4);
      expect(state.lines[0]!.size).toBe('M');
      expect(state.lines[0]!.colorId).toBe('forest-ink');
      expect(state.lines[1]!.size).toBe('L');
      expect(state.lines[1]!.colorId).toBe('forest-ink');
      expect(state.lines[2]!.size).toBe('M');
      expect(state.lines[2]!.colorId).toBe('chalk-bone');
      expect(state.lines[3]!.productSlug).toBe('making-things');
    });

    it('enforces UPDATE_QUANTITY bounds (1..10) without clamping or bypassing explicit REMOVE_ITEM (R2-CART-02)', () => {
      let state = INITIAL_DEMO_CART_STATE;
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
      const lineId = state.lines[0]!.id;

      // 1. UPDATE_QUANTITY with 11 must be REJECTED (not clamped)
      state = demoCartReducer(state, {
        type: 'UPDATE_QUANTITY',
        payload: { lineId, quantity: 11 },
      });
      expect(state.lines[0]!.quantity).toBe(5); // Still 5
      expect(state.lastActionResult?.success).toBe(false);

      // 2. UPDATE_QUANTITY with 0 must be REJECTED (must not remove item)
      state = demoCartReducer(state, {
        type: 'UPDATE_QUANTITY',
        payload: { lineId, quantity: 0 },
      });
      expect(state.lines.length).toBe(1);
      expect(state.lines[0]!.quantity).toBe(5); // Still 5
      expect(state.lastActionResult?.success).toBe(false);

      // 3. UPDATE_QUANTITY with negative or non-integer must be REJECTED
      state = demoCartReducer(state, {
        type: 'UPDATE_QUANTITY',
        payload: { lineId, quantity: -2 },
      });
      expect(state.lines[0]!.quantity).toBe(5);

      state = demoCartReducer(state, {
        type: 'UPDATE_QUANTITY',
        payload: { lineId, quantity: 4.5 },
      });
      expect(state.lines[0]!.quantity).toBe(5);

      // 4. Valid UPDATE_QUANTITY within [1, 10]
      state = demoCartReducer(state, {
        type: 'UPDATE_QUANTITY',
        payload: { lineId, quantity: 8 },
      });
      expect(state.lines[0]!.quantity).toBe(8);
      expect(state.lastActionResult?.success).toBe(true);

      // 5. Explicit REMOVE_ITEM is the authoritative removal operation
      state = demoCartReducer(state, {
        type: 'REMOVE_ITEM',
        payload: { lineId },
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
      expect(summary.formattedIllustrativeSubtotal).toContain('495');
      expect(summary.isEmpty).toBe(false);

      // Clear cart
      state = demoCartReducer(state, { type: 'CLEAR_CART' });
      const emptySummary = calculateDemoCartSummary(state.lines);
      expect(emptySummary.totalQuantity).toBe(0);
      expect(emptySummary.illustrativeSubtotalIdr).toBe(0);
      expect(emptySummary.isEmpty).toBe(true);
    });
  });

  describe('Completion Lifecycle & Invalidation (R2-CART-01)', () => {
    it('EMPTY → COMPLETE → NOT_COMPLETED (fails closed on empty cart)', () => {
      let state = INITIAL_DEMO_CART_STATE;
      expect(state.lines.length).toBe(0);

      state = demoCartReducer(state, { type: 'COMPLETE_SIMULATION' });
      expect(state.isSimulationCompleted).toBe(false);
      expect(state.lines.length).toBe(0);
    });

    it('ADD → COMPLETE → UPDATE → NOT_COMPLETED (updating quantity invalidates completion)', () => {
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
      const lineId = state.lines[0]!.id;

      // Complete simulation
      state = demoCartReducer(state, { type: 'COMPLETE_SIMULATION' });
      expect(state.isSimulationCompleted).toBe(true);

      // Now mutate quantity
      state = demoCartReducer(state, {
        type: 'UPDATE_QUANTITY',
        payload: { lineId, quantity: 3 },
      });
      expect(state.lines[0]!.quantity).toBe(3);
      expect(state.isSimulationCompleted).toBe(false); // Invalidation verified!
    });

    it('ADD → COMPLETE → REMOVE → NOT_COMPLETED (removing item invalidates completion)', () => {
      let state = INITIAL_DEMO_CART_STATE;
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
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'making-things',
          colorId: 'chalk-bone',
          size: 'L',
          printToneId: 'standard-screen',
          quantity: 1,
        },
      });
      expect(state.lines.length).toBe(2);

      // Complete simulation
      state = demoCartReducer(state, { type: 'COMPLETE_SIMULATION' });
      expect(state.isSimulationCompleted).toBe(true);

      // Remove one item
      state = demoCartReducer(state, {
        type: 'REMOVE_ITEM',
        payload: { lineId: state.lines[0]!.id },
      });
      expect(state.lines.length).toBe(1);
      expect(state.isSimulationCompleted).toBe(false); // Invalidation verified!
    });

    it('ADD → COMPLETE → CLEAR → NOT_COMPLETED (clearing cart invalidates completion)', () => {
      let state = INITIAL_DEMO_CART_STATE;
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'stay-curious',
          colorId: 'chalk-bone',
          size: 'S',
          printToneId: 'standard-screen',
          quantity: 1,
        },
      });

      // Complete simulation
      state = demoCartReducer(state, { type: 'COMPLETE_SIMULATION' });
      expect(state.isSimulationCompleted).toBe(true);

      // Clear cart
      state = demoCartReducer(state, { type: 'CLEAR_CART' });
      expect(state.lines.length).toBe(0);
      expect(state.isSimulationCompleted).toBe(false); // Invalidation verified!
    });

    it('ADD → COMPLETE → ADD (new variant) → NOT_COMPLETED (adding variant invalidates completion)', () => {
      let state = INITIAL_DEMO_CART_STATE;
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

      // Add a second product
      state = demoCartReducer(state, {
        type: 'ADD_ITEM',
        payload: {
          productSlug: 'ordinary-magic',
          colorId: 'forest-ink',
          size: 'XL',
          printToneId: 'standard-screen',
          quantity: 1,
        },
      });
      expect(state.lines.length).toBe(2);
      expect(state.isSimulationCompleted).toBe(false); // Invalidation verified!
    });

    it('ADD → COMPLETE → RESET → EMPTY_AND_NOT_COMPLETED (resetting resets cleanly)', () => {
      let state = INITIAL_DEMO_CART_STATE;
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

      state = demoCartReducer(state, { type: 'RESET_SIMULATION' });
      expect(state.lines.length).toBe(0);
      expect(state.isSimulationCompleted).toBe(false);
    });
  });

  describe('Non-Transactional & Security Invariants', () => {
    const demoCartPage = read('app/demo/cart/page.tsx');
    const demoCheckoutPage = read('app/demo/checkout/page.tsx');
    const demoCompletePage = read('app/demo/complete/page.tsx');
    const contextFile = read('features/demo-commerce/context.tsx');
    const reducerFile = read('features/demo-commerce/reducer.ts');
    const viewerFile = read('components/ProductDetailViewer.tsx');
    const allDemoCode = [
      demoCartPage,
      demoCheckoutPage,
      demoCompletePage,
      contextFile,
      reducerFile,
      viewerFile,
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

    const demoFlowCode = [
      demoCartPage,
      demoCheckoutPage,
      demoCompletePage,
      contextFile,
      reducerFile,
    ];

    it('contains strictly zero PII collection inputs or payment processing forms in demo flow', () => {
      for (const code of demoFlowCode) {
        expect(code).not.toContain('<input type="text"');
        expect(code).not.toContain('<input type="email"');
        expect(code).not.toContain('<input type="tel"');
        expect(code).not.toContain('<textarea');
        expect(code).not.toContain('<form');
        expect(code).not.toContain('method="post"');
        expect(code).not.toContain('Midtrans');
        expect(code).not.toContain('Xendit');
      }
      expect(viewerFile).not.toContain('<input type="email"');
      expect(viewerFile).not.toContain('<input type="tel"');
      expect(viewerFile).not.toContain('Midtrans');
      expect(viewerFile).not.toContain('Xendit');
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

      expect(header).not.toContain('href="/cart"');
      expect(header).not.toContain('href="/checkout"');
      expect(home).not.toContain('href="/cart"');
      expect(home).not.toContain('href="/checkout"');
      expect(shop).not.toContain('href="/cart"');
      expect(shop).not.toContain('href="/checkout"');

      // Only /demo/cart is linked in Header
      expect(header).toContain('href="/demo/cart"');
    });

    it('guards /demo/complete against rendering stale completed state when lines are empty', () => {
      expect(demoCompletePage).toContain(
        'state.isSimulationCompleted && state.lines.length > 0',
      );
      expect(demoCompletePage).toContain(
        'Belum Ada Simulasi yang Diselesaikan',
      );
    });

    it('provides truthful error feedback container in ProductDetailViewer', () => {
      expect(viewerFile).toContain('retail-demo-cart-error');
      expect(viewerFile).toContain('role="alert"');
      expect(viewerFile).toContain('aria-live="assertive"');
    });
  });
});
