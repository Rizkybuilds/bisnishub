# MGBOS-015 — Payment Recording, Cash-In Allocation & Ledger Reconciliation

Implemented locally on 2026-09-25. Second vertical slice of Sprint 5 (Invoicing, Cash Movements & Analytical Ledger).

## Delivered

1. **Payment & Allocation Schema (`app.payments`, `app.payment_allocations`, `app.payment_audit`):**
   - Tables created in `supabase/migrations/20260925150000_payment_recording_and_allocation.sql`:
     - Standard payment methods: `BANK_TRANSFER`, `QRIS`, `CASH`, `GIRO`, `PAYMENT_GATEWAY`, `OTHER`.
     - Standard payment statuses: `DRAFT`, `CONFIRMED`, `REJECTED`, `REVERSED`.
     - Canonical document numbering: `{BRAND}-PAY-{YEAR}-{SEQUENCE}` (e.g. `TS-PAY-2026-000001`).
     - Zero-Float arithmetic (`bigint` integer rupiah) for `amount` and `allocated_amount`.
     - Strict multi-tenant isolation via `organization_id` foreign keys and Row-Level Security (RLS) policies.
     - Destination bank coordinate logging and audit trail capturing payer name, payer bank, reference number, and internal notes.

2. **Database Integrity & Stored Procedures:**
   - **Trigger `app.payment_snapshot_guard`:**
     - Enforces immutability once a payment transitions to `CONFIRMED` or `REVERSED`. Payment numbers, nominal amounts, and currency cannot be modified.
   - **Stored Procedure `app.record_payment_and_allocate`:**
     - Generates canonical payment numbers atomically from `app.document_sequences`.
     - Validates and creates `app.payments` record before inserting invoice allocations.
     - For each allocated invoice: validates invoice state (`ISSUED`, `PARTIALLY_PAID`), verifies allocation does not exceed `balance_due`, updates `amount_paid` and `balance_due`, and updates invoice status (`PARTIALLY_PAID` or `PAID` with `paid_at` timestamp).
     - Logs creation and allocations in `app.payment_audit` and `app.invoice_audit`.
   - **Stored Procedure `app.allocate_existing_payment`:**
     - Allows allocating unallocated payment balance (deposit) to invoices incrementally.
   - **Stored Procedure `app.revert_payment`:**
     - Reverts confirmed payments and rolls back invoice balances atomically.
     - Decrements `amount_paid` and increments `balance_due` on affected invoices.
     - Transitions invoice status back to `ISSUED` or `PARTIALLY_PAID`, clearing `paid_at`.
     - Marks payment as `REVERSED` and requires a mandatory reason logged in `app.payment_audit`.

3. **Domain, Validation & Auth Packages:**
   - `packages/domain/src/payment.ts`:
     - Pure domain contracts: `PAYMENT_METHODS`, `PAYMENT_STATUSES`, `VALID_PAYMENT_TRANSITIONS`, `calculatePaymentAllocations`, and `calculateInvoicePaymentOutcome`.
     - Unit tests in `packages/domain/src/payment.test.ts`.
   - `packages/validation/src/payment.ts`:
     - Zod schemas with RFC 4122 UUID validation and zero-float string/BigInt coercion: `recordPaymentSchema`, `allocateExistingPaymentSchema`, `revertPaymentSchema`.
     - Unit tests in `packages/validation/src/payment.test.ts`.
   - `packages/auth/src/permissions.ts`:
     - Added permissions: `payments:read`, `payments:record`, `payments:revert`.
     - Role assignments: `OWNER`, `ADMIN`, `FINANCE` equipped with full payment recording and reversal authority.

4. **Internal Application & Finance UI (`apps/mgbos`):**
   - **Sidebar Navigation (`layout.tsx`):**
     - Activated `Payments & Kas Masuk` (`/payments`) navigation link gated by `payments:read`.
   - **Payment Directory (`/payments`):**
     - Financial KPI summary cards: Total Kas Masuk (Confirmed), Teralokasi ke Faktur, Sisa Dana Belum Teralokasi, Total Transaksi Kas.
     - Filterable and sortable table with status badges (`CONFIRMED`, `REVERSED`, `DRAFT`, `REJECTED`), formatted IDR rupiah, customer name, and direct links to payment details.
     - Embedded `<RecordPaymentModal>` for quick entry of incoming funds.
   - **Payment Detail View (`/payments/[paymentId]`):**
     - Canonical header with payment number, method badge, and timestamp.
     - Overview cards for incoming cash, allocated cash, and remaining deposit balance.
     - Detailed allocation breakdown table linking to allocated invoices with invoice status and remaining balance due.
     - Payer details, destination bank coordinates, and notes.
     - `<RevertPaymentButton>` with confirmation modal and cancellation reason requirement.
     - Chronological payment audit log.
   - **Invoice Detail Integration (`/invoices/[invoiceId]`):**
     - Added "Riwayat Pembayaran & Kas Masuk" table under the invoice breakdown.
     - Integrated `<RecordPaymentModal>` into the invoice action panel and payment table header, prefilled with invoice ID, invoice number, exact balance due, and frozen company bank coordinates.

## Verification

- **Unit & Domain Tests (Vitest):** 173 passed across 37 test files (11 new tests covering payment transitions, zero-float allocation math, Zod validation, and role permissions).
- **pgTAP Database Tests:** 267 assertions passed across 16 test files (24 new assertions in `supabase/tests/payment_recording.test.sql`).
- **End-to-End Verification (`scripts/verify-e2e-flow.mjs`):**
  - Full end-to-end integration test executed against live local database.
  - Successfully verified Requirement $\to$ Quote $\to$ Order Contract $\to$ Split Production Jobs $\to$ QC $\to$ DP Invoicing $\to$ Partial Payment $\to$ Over-Allocation Prevention $\to$ Full Settlement (LUNAS) $\to$ Final Invoicing $\to$ Payment Reversal & Balance Restoration.
- **Strict Quality Gates:**
  - TypeScript: Strict typecheck passed across 11 workspace packages and Next.js applications (`pnpm typecheck`).
  - ESLint: Passed with 0 warnings (`pnpm lint`).
  - Prettier: 100% compliant formatting (`pnpm format:check`).
  - Production Build: Both `@mgbos/app` and `@mgbos/teestock` compiled successfully via Next.js Turbopack (`pnpm build`).

## Next Slice

**MGBOS-016: Analytical Ledger, Pass-Through Courier Separation & Margin Analytics (Sprint 5 Milestone Completion)**.
