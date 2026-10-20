# BisnisHub — PR NOV15-02 TeeStock Demo Commerce Browser QA Evidence Package

**Repository:** Rizkybuilds/bisnishub
**Work Package:** NOV15-02 / Nontransactional Cart & Checkout Simulation
**Program:** TEESTOCK-NOV15 — Sales-Readiness Acceleration
**Tracking Issue:** https://github.com/Rizkybuilds/bisnishub/issues/90
**Branch:** `feat/teestock-nov15-02-demo-commerce`
**Base Main Commit:** `f24d50dc5dd92ebb2aca6cae8768bcbec1d8f1e1`
**Date:** 2026-10-20
**Browser Identity:** Google Chrome 155.0.8059.84 (Windows headless)
**Test Environment:** Next.js 16.3.8 (Turbopack) standalone production server on `http://127.0.0.1:3102`
**Harness:** Chrome DevTools Protocol (CDP) WebSocket Automation

---

## Evidence Inventory

| File | Viewport | Flow Step / Description |
|---|---|---|
| `01-home-1440-header-zero.png` | 1440x900 | Homepage header initial badge displaying "Simulasi (0)" |
| `02-shop-1440-catalog.png` | 1440x900 | /shop catalog with preview products and illustrative price badges |
| `03-pdp-1440-slow-sunday.png` | 1440x900 | PDP initial state: "Tahap Preview Desain" disabled, demo CTA enabled |
| `04-pdp-1440-added-notice.png` | 1440x900 | PDP after click: success notification and header badge updated to (1) |
| `04b-pdp-1440-max-limit-error.png` | 1440x900 | PDP rejection alert: role="alert" message when line already has max 10 items (R2-CART-02) |
| `05-cart-1440-one-item.png` | 1440x900 | /demo/cart: line item, variant specs, subtotal Rp 189.000, disclosure banner |
| `06-cart-1440-quantity-stepper-two.png` | 1440x900 | /demo/cart: quantity stepper incremented to 2, subtotal Rp 378.000 |
| `07-checkout-1440-review.png` | 1440x900 | /demo/checkout: review simulation with 0 PII inputs and non-commercial disclaimers |
| `08-complete-1440-confirmed.png` | 1440x900 | /demo/complete: completion confirmation with explicit non-transactional safeguards |
| `09-cart-1440-empty-state.png` | 1440x900 | /demo/cart empty state after resetting simulation |
| `10-checkout-1440-empty-guard.png` | 1440x900 | /demo/checkout empty guard preventing review without items |
| `11-complete-1440-empty-guard.png` | 1440x900 | /demo/complete guard preventing access when simulation was not completed |
| `11b-complete-invalidated-guard.png` | 1440x900 | /demo/complete guard after cart was modified following completion (R2-CART-01) |
| `12-mobile-390-menu-cart-link.png` | 390x844 | Mobile navigation drawer with "Keranjang Simulasi (1)" link |
| `13-mobile-390-cart.png` | 390x844 | Mobile cart layout without horizontal scroll overflow |
| `14-mobile-390-checkout.png` | 390x844 | Mobile checkout layout without horizontal scroll overflow |
| `15-mobile-390-complete.png` | 390x844 | Mobile complete layout without horizontal scroll overflow |
| `16-compact-320-cart.png` | 320x640 | Compact mobile 320px cart with zero horizontal scroll overflow |
| `17-compact-320-checkout.png` | 320x640 | Compact mobile 320px checkout with zero horizontal scroll overflow |
| `18-compact-320-complete.png` | 320x640 | Compact mobile 320px complete confirmation with zero horizontal overflow |
| `19-tablet-640-cart.png` | 640x900 | Tablet 640px cart reflow without horizontal overflow |
| `20-tablet-640-checkout.png` | 640x900 | Tablet 640px checkout reflow without horizontal overflow |
| `nov15-02-browser-qa-results.json` | N/A | Machine-readable execution logs and assertion results |

---

## Verified Invariants
1. **Frontend-Only / Transient In-Memory State:**
   - Survives client router navigation without localStorage, sessionStorage, or IndexedDB.
   - Browser refresh / reload resets state cleanly to initial values.
2. **Authoritative Pricing:**
   - Unit prices strictly resolved from `product.illustrativePriceIdr` (Rp 189.000).
   - Accurate integer line total and subtotal math.
3. **Zero Financial & Operational Exposure:**
   - Strictly 0 network fetch/POST calls to external APIs.
   - Strictly 0 Supabase RPCs, database connections, or tables.
   - Strictly 0 PII collection inputs (no name, email, phone, or address forms).
   - Strictly 0 payment gateway integrations (no QRIS, Midtrans, or Xendit).
4. **Accessible UI & Design Integrity:**
   - Full responsive reflow down to 320px with zero horizontal scrollbar overflow.
   - Accessible `role="status"` and `aria-live="polite"` screen reader announcements.
   - Prominent simulation disclosure banners on every demo commerce route.
