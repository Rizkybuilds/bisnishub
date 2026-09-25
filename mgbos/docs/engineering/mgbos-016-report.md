# MGBOS-016 — Analytical Ledger, The Cost Trilogy & Margin Realization

Implemented locally on 2026-09-25. Final vertical slice and milestone completion of **Sprint 5 (Invoicing, Cash Movements & Analytical Ledger)**.

## Delivered

1. **Analytical Financial Ledger Schema (`app.financial_ledger_entries`):**
   - Created in `supabase/migrations/20260925160000_analytical_ledger_and_margin_realization.sql`:
     - Standard entry types: `ORDER_COMMITTED`, `INVOICE_ISSUED`, `PAYMENT_RECEIVED`, `PAYMENT_REVERSED`, `PRODUCTION_COMMITTED`, `PRODUCTION_ACTUAL_SETTLED`, `SHIPPING_ESCROW_RECORDED`, `COURIER_EXPENSE_DISBURSED`, `MARGIN_REALIZATION_SNAPSHOT`.
     - Ledger categories: `REVENUE`, `COST_OF_GOODS`, `PASS_THROUGH_SHIPPING`, `CASH_MOVEMENT`, `ADJUSTMENT`.
     - Canonical document numbering: `{BRAND}-LED-{YEAR}-{SEQUENCE}` (e.g. `TS-LED-2026-000001`).
     - Zero-Float arithmetic (`bigint` integer rupiah) for `amount`.
     - Direction check: `DEBIT` / `CREDIT`.
     - Multi-tenant isolation with strict Row-Level Security (RLS) policies.
   - **Immutability Guard (`trg_financial_ledger_immutability`):**
     - Financial ledger entries are strictly immutable and append-only. Any attempt to update or delete rows raises an exception immediately.

2. **Automated Event Triggers & Actual Cost Settlement Stored Procedure:**
   - **Trigger `trg_orders_ledger_event` (`app.trg_order_confirmed_ledger_event`):**
     - Fires on order creation; records `ORDER_COMMITTED` for Net Product Revenue (`subtotal - discount_total`) under category `REVENUE`.
   - **Trigger `trg_invoices_ledger_event` (`app.trg_invoice_issued_ledger_event`):**
     - Fires on invoice issuance (`ISSUED`); records `INVOICE_ISSUED` (`REVENUE`) and `SHIPPING_ESCROW_RECORDED` (`PASS_THROUGH_SHIPPING`) for courier fees.
   - **Trigger `trg_payments_ledger_event` (`app.trg_payment_ledger_event`):**
     - Records `PAYMENT_RECEIVED` (`CASH_MOVEMENT`, `DEBIT`) on payment confirmation and `PAYMENT_REVERSED` on payment cancellation.
   - **Stored Procedure `app.record_actual_job_cost`:**
     - Atomically locks production job and order records.
     - Validates actor permissions (`OWNER`, `ADMIN`, `FINANCE`, `OPERATIONS`).
     - Updates `actual_cost` on `app.production_jobs`.
     - Computes cost variance against commitment (`actual_cost - committed_cost`).
     - Inserts `PRODUCTION_ACTUAL_SETTLED` (`COST_OF_GOODS`, `DEBIT`) into `app.financial_ledger_entries`.
     - Records audit trail event `job.actual_cost_settled` in `app.production_job_audit`.

3. **Courier Pass-Through Shipping Fee Isolation & Analytical View (`app.order_financial_summaries`):**
   - Implemented as a `security_invoker = true` analytical view.
   - **Strict Financial Separation (CFO Rule):**
     - `net_product_revenue = subtotal - discount_total`.
     - `courier_shipping_margin = 0`: Shipping fees are isolated into a pass-through escrow account with strictly zero gross margin.
     - `realized_gross_profit = net_product_revenue - total_effective_cost`.
     - `realized_margin_pct = round((realized_gross_profit / net_product_revenue) * 100, 2)`.
   - **The Cost Trilogy:**
     - `estimated_cost` (BOM benchmark).
     - `committed_cost` (SPK contract / vendor agreed rate).
     - `actual_cost` (settled manufacturing costs).
     - `effective_cost` (`coalesce(actual_cost, committed_cost, estimated_cost)`).
     - `is_cost_settled` (`bool_and(pj.actual_cost is not null)`: true only when all manufacturing jobs in the order have settled actual costs).
   - **Financial Health Tier Classification:**
     - `HEALTHY`: Realized margin $\ge 35\%$.
     - `MODERATE`: Realized margin $25\% - 34.99\%$.
     - `LOW_MARGIN`: Realized margin $20\% - 24.99\%$.
     - `CRITICAL`: Realized margin $< 20\%$.

4. **Domain, Validation & Auth Packages:**
   - `packages/domain/src/ledger.ts`:
     - Pure domain constants: `LEDGER_ENTRY_TYPES`, `LEDGER_CATEGORIES`, `FINANCIAL_HEALTH_STATUSES`.
     - Zero-Float arithmetic helpers: `calculateOrderFinancialSummary`, `classifyMarginHealth`, `calculateCostVariance`.
     - Unit tests in `packages/domain/src/ledger.test.ts`.
   - `packages/validation/src/ledger.ts`:
     - Zod schemas with zero-float string/BigInt coercion: `recordActualJobCostSchema`, `ledgerQueryFilterSchema`.
     - Unit tests in `packages/validation/src/ledger.test.ts`.
   - `packages/auth/src/permissions.ts`:
     - Added permissions: `ledger:read`, `ledger:manage_cost`.
     - Assigned to `OWNER`, `ADMIN`, `FINANCE`, and `OPERATIONS` (`ledger:manage_cost`).
     - Unit tests in `packages/auth/src/ledger-permissions.test.ts`.
   - `packages/domain/src/documentNumber.ts`:
     - Registered prefix `LED` for canonical financial journal numbering.

5. **Internal Application & Executive UI (`apps/mgbos`):**
   - **Sidebar Navigation (`layout.tsx`):**
     - Activated `Buku Kas & Margin` (`/ledger`) navigation link gated by `ledger:read`.
   - **Financial Ledger & Margin Dashboard (`/ledger`):**
     - Executive KPI cards: Total Net Revenue, Realized Gross Profit, Weighted Holding Realized Margin %, and Total Courier Shipping Pass-Through Escrow (Margin: Rp 0).
     - Order Performance & Margin Realization table: Order Number, Customer, Net Revenue, The Cost Trilogy (Estimasi, Komitmen, Aktual Settled), Realized Gross Profit, Realized Margin %, and `<MarginHealthBadge>`.
     - Immutable Journal Audit Trail table: Filterable by entry type and category with canonical document badges.
   - **Order Detail Integration (`/orders/[orderId]`):**
     - "Cost Trilogy & Margin" card in right sidebar with real-time health badge.
     - Production SPK table updated with Cost Trilogy columns: Biaya Estimasi, Komitmen SPK, Biaya Aktual (Settled), and `<RecordActualCostModal>`.
   - **Production Job Detail Integration (`/production/[jobId]`):**
     - Cost breakdown panel displaying Estimasi, Komitmen, and Aktual Settled.
     - Embedded `<RecordActualCostModal>` allowing authorized operators to settle actual production costs.

## Verification

- **Unit & Domain Tests (Vitest):** 183 passed across 40 test files (10 new tests covering margin health tiers, zero-float ledger calculations, and permissions).
- **pgTAP Database Tests:** 283 assertions passed across 17 test files (16 new assertions in `supabase/tests/analytical_ledger.test.sql`).
- **End-to-End Verification (`scripts/verify-e2e-flow.mjs`):**
  - Section 7 verified against live local database:
    - Settle actual job costs for multiple production jobs (`app.record_actual_job_cost`).
    - Verify immutable ledger event emission (`ORDER_COMMITTED`, `INVOICE_ISSUED`, `SHIPPING_ESCROW_RECORDED`, `PAYMENT_RECEIVED`, `PRODUCTION_ACTUAL_SETTLED`).
    - Verify immutability guard strictly blocks any ledger modification (HTTP 400).
    - Verify analytical view `order_financial_summaries` isolates shipping fee at Rp 0 margin and computes realized margin % and health tier (`HEALTHY`).
- **Strict Quality Gates:**
  - TypeScript: Strict typecheck passed across 11 workspace packages and Next.js applications (`pnpm typecheck`).
  - ESLint: Passed with 0 warnings (`pnpm lint`).
  - Prettier: 100% compliant formatting (`pnpm format:check`).
  - Production Build: Both `@mgbos/app` and `@mgbos/teestock` compiled successfully via Next.js Turbopack (`pnpm build`).

## Milestone Completion

With the delivery of **MGBOS-016**, **Sprint 5 (Invoicing, Cash Movements & Analytical Ledger)** is officially **100% complete**. MultiGraph Business OS now possesses end-to-end commercial integrity from sales lead to bank reconciliation, production cost settlement, and realized net profit reporting.
