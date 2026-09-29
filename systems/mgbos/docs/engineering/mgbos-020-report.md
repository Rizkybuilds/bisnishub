# MGBOS-020 — Fast Retail Ordering & Direct POS Checkout

Implemented locally on 2026-09-26. Primary milestone completion of **Sprint 9 (Pemesanan Ritel Cepat & Kasir POS / TS-PLAN-09)**.

## Delivered

1. **Schema & Database Modifications (`app.orders`, `app.order_items`, `app.create_retail_order`):**
   - Created in `supabase/migrations/20260926400000_fast_retail_ordering.sql`:
     - **Order Type Architecture:** Added `order_type text not null default 'CUSTOM_B2B' check(order_type in ('CUSTOM_B2B', 'RETAIL_DIRECT'))` to `app.orders`.
     - **Flexible Source Constraints:** Relaxed `source_quote_id`, `source_quote_version_id`, `source_requirement_id`, and `source_requirement_version_id` to allow `NULL` specifically for `RETAIL_DIRECT` orders, while enforcing them strictly for `CUSTOM_B2B` via `check_order_type_sources`.
     - **Direct SKU Master Link:** Added `inventory_item_id uuid references app.inventory_items(id)` to `app.order_items` for instant link to blanks and retail merchandise.
     - **Indexes:** Added `idx_orders_order_type` and `idx_order_items_inventory_item` for query performance.

2. **Atomic Stored Procedure `app.create_retail_order`:**
   - **Permission Enforcement:** Checks that actor holds `orders:create`.
   - **Zero-Float Bigint Calculation:** Pure integer rupiah arithmetic for subtotal, discount, courier shipping, and grand total.
   - **Document Number Generation:** Automatically assigns canonical document number `{BRAND}-O-{YEAR}-{SEQUENCE}` via `app.generate_document_number`.
   - **Atomic Stock Reservation (Anti-Overselling Guard):** Automatically executes `app.reserve_inventory_for_order` within the transaction. If unreserved stock is insufficient, raises an exception and cleanly rolls back the transaction.
   - **Automated Commercial Invoice Issuance:** Automatically creates commercial invoice in `app.invoices` with type `FULL_PAYMENT`, status `ISSUED`, canonical number `{BRAND}-INV-{YEAR}-{SEQUENCE}`, and copies line items with strict constraint conformance (`check(subtotal = unit_price * quantity)`).
   - **POS Instant Payment Settlement (`auto_pay = true`):**
     - Automatically creates payment record in `app.payments` (`{BRAND}-PAY-{YEAR}-{SEQUENCE}`, status `CONFIRMED`).
     - Allocates payment to invoice, moving invoice to `PAID` with `balance_due = 0`.
     - Automatically emits `PAYMENT_RECEIVED` (`DEBIT`, `CASH_MOVEMENT`) into `app.financial_ledger_entries`.
   - **Financial Separation Guard:** Emits `ORDER_COMMITTED` for Net Product Revenue (`subtotal - discount_total`), strictly isolating courier shipping fee as pass-through escrow in accordance with the CFO Rule.

3. **Domain, Validation & Auth Packages:**
   - `packages/domain/src/order.ts`:
     - Pure domain types: `OrderType`, `ORDER_TYPES`.
     - Pure domain functions: `formatOrderTypeLabel`, `calculateRetailOrderTotals`.
     - Unit tests in `packages/domain/src/order.test.ts`.
   - `packages/validation/src/order.ts`:
     - Zod schemas: `retailOrderItemInputSchema`, `createRetailOrderSchema`.
     - Unit tests in `packages/validation/src/order.test.ts`.

4. **Web Application Features (`apps/mgbos`):**
   - **Data Access & Server Actions:**
     - `apps/mgbos/src/app/(app)/orders/data.ts`: Extended `OrderRow` with `order_type`, added `RetailItemOption` interface.
     - `apps/mgbos/src/app/(app)/orders/actions.ts`: Added `createRetailOrderAction` calling `app.create_retail_order` RPC with active brand resolution and automatic revalidation of `/orders`, `/inventory`, `/invoices`, `/payments`, `/ledger`.
   - **POS Checkout Modal (`apps/mgbos/src/app/(app)/orders/RetailOrderCreateModal.tsx`):**
     - Customer selector with active customer accounts.
     - Multi-item line builder with live inventory SKU selector, live stock indicators (Available / On-Hand / Reserved), quantity selector with available stock ceiling warnings, dynamic discount and unit pricing.
     - Delivery options: Store/Workshop Pickup (Rp 0) vs Expedition Courier (J&T/SiCepat/JNE) with full shipping address input.
     - POS Instant Payment toggle: Cash, QRIS, Bank Transfer with payment reference.
     - Real-time CFO Margin Preview: gross revenue, total discount, net revenue, courier shipping (pass-through indicator), and estimated gross profit margin.
   - **Pages & Badging:**
     - `apps/mgbos/src/app/(app)/orders/page.tsx`: Embedded `<RetailOrderCreateModal>` in page header alongside active brand, fetched customer accounts and inventory levels, and added `⚡ Ritel (POS)` vs `🏢 B2B Custom` badges in the orders table.
     - `apps/mgbos/src/app/(app)/orders/[orderId]/page.tsx`: Added `order_type` badge in the header card, context subtitle distinguishing retail POS from B2B custom contracts, and `📦 Item Persediaan Langsung` badge in line items.

5. **Verification & Quality Gates:**
   - **Database Tests (pgTAP):** `supabase/tests/fast_retail_ordering.test.sql` (19 assertions passed). Full test suite: 22 test files, 379 assertions passed (0 failures).
   - **Unit & Domain Tests (Vitest):** 48 test files, 223 tests passed (0 failures).
   - **E2E Flow (`scripts/verify-e2e-flow.mjs`):** Section 11 added, verifying:
     - Pre-order available stock check.
     - Anti-Overselling Guard blocking order exceeding available stock (999 pcs).
     - Direct retail order placement with immediate QRIS payment.
     - Canonical document numbers (`TS-O-YYYY-XXXXXX`, `TS-INV-YYYY-XXXXXX`, `TS-PAY-YYYY-XXXXXX`).
     - Order contract structure with `order_type = 'RETAIL_DIRECT'` and null quote sources.
     - Inventory reservation creation and level deduction.
     - Invoice status `PAID` with `balance_due = 0`.
     - POS payment record with status `CONFIRMED`.
     - Financial ledger emissions: `ORDER_COMMITTED` (Rp 700.000 net product revenue) and `PAYMENT_RECEIVED` (Rp 715.000 cash movement).
   - **Lint & Format:** `pnpm format` and `pnpm lint` passed with 0 errors and 0 warnings.
   - **TypeScript Typecheck:** `pnpm typecheck` passed with 0 errors across all 11 workspace packages and applications.
   - **Production Next.js Builds:** `pnpm build` compiled both `apps/teestock` and `apps/mgbos` successfully.
