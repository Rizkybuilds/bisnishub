# MGBOS-017 — Fulfillment, Delivery Orders (Surat Jalan), Courier Tracking & Thermal Label A6

Implemented locally on 2026-09-26. Primary milestone completion of **Sprint 6 (Fulfillment, Logistics & Order Completion / TS-PLAN-06)**.

## Delivered

1. **Shipments & Delivery Orders Schema (`app.shipments`, `app.shipment_items`, `app.shipment_audit`):**
   - Created in `supabase/migrations/20260926100000_fulfillment_and_delivery_orders.sql`:
     - Standard shipment lifecycle statuses: `DRAFT`, `READY_TO_DISPATCH`, `DISPATCHED`, `IN_TRANSIT`, `DELIVERED`, `FAILED`, `RETURNED`, `CANCELLED`.
     - Supported couriers: `JNE`, `JNT`, `SICEPAT`, `LALAMOVE`, `GOSEND`, `INTERNAL_COURIER`, `CUSTOMER_PICKUP`, `OTHER`.
     - Canonical document numbering: `{BRAND}-DO-{YEAR}-{SEQUENCE}` (e.g. `TS-DO-2026-000001`).
     - Zero-Float arithmetic (`bigint` integer rupiah) for `actual_shipping_cost`.
     - Multi-tenant isolation with strict Row-Level Security (RLS) policies.
   - **Immutability Guard (`trg_shipment_snapshot_guard`):**
     - Shipments marked `DELIVERED` are permanently immutable. Any update (other than updated_at/notes) or delete raises an exception immediately. Active shipments cannot be deleted; they must be explicitly cancelled.

2. **Fulfillment Stored Procedures & Business Guards:**
   - **`app.create_delivery_order`:**
     - Atomically locks order row.
     - Validates actor authorization (`OWNER`, `ADMIN`, `OPERATIONS`, `FINANCE`).
     - Generates canonical DO number via `app.generate_document_number(p_org_id, v_brand_id, 'DO')`.
     - **Strict Ceiling Guard:** Verifies across active shipments that cumulative shipped quantity does not exceed `order_items.quantity`. Prevents over-shipping.
     - Inserts items and logs audit trail event `shipment.created`.
   - **`app.dispatch_shipment`:**
     - Transitions status to `DISPATCHED`.
     - Records tracking number (mandatory for external couriers).
     - **CFO Pass-Through Escrow Integration:** If `actual_shipping_cost > 0`, automatically emits a `COURIER_EXPENSE_DISBURSED` (`PASS_THROUGH_SHIPPING`, `DEBIT`) entry into `app.financial_ledger_entries`.
   - **`app.mark_shipment_delivered`:**
     - Transitions status to `DELIVERED`.
     - Records delivery timestamp and recipient details. Locks document permanently.
   - **`app.cancel_shipment`:**
     - Reverts shipment to `CANCELLED` and releases allocated item quantities back to the unshipped quota. Blocked if already `DELIVERED`.

3. **Domain, Validation & Auth Packages:**
   - `packages/domain/src/shipment.ts`:
     - Pure domain types & constants: `SHIPMENT_STATUSES`, `COURIER_NAMES`, `SHIPMENT_STATUS_LABELS`, `COURIER_LABELS`.
     - Lifecycle state machine: `canTransitionShipment`.
     - Allocation calculator & ceiling validation: `calculateShipmentAllocation`.
     - Unit tests in `packages/domain/src/shipment.test.ts`.
   - `packages/domain/src/documentNumber.ts` & `packages/validation/src/documentNumber.ts`:
     - Added canonical document type `'DO'` and aliases (`SHIPMENT`, `DELIVERY_ORDER`, `SURAT_JALAN`).
   - `packages/validation/src/shipment.ts`:
     - Zod schemas: `createDeliveryOrderSchema`, `dispatchShipmentSchema`, `markShipmentDeliveredSchema`, `cancelShipmentSchema`.
     - Unit tests in `packages/validation/src/shipment.test.ts`.
   - `packages/auth/src/permissions.ts`:
     - New permissions: `shipments:read`, `shipments:create`, `shipments:dispatch`, `shipments:cancel`.
     - Role mappings across `OWNER`, `ADMIN`, `OPERATIONS`, `FINANCE`, `SALES`, `QC`.

4. **Web Application Features (`apps/mgbos`):**
   - **Data Access & Server Actions:**
     - `apps/mgbos/src/app/(app)/shipments/data.ts`: PostgREST query layer with role assertion.
     - `apps/mgbos/src/app/(app)/shipments/actions.ts`: Next.js Server Actions calling RPCs with cache revalidation.
   - **UI Components & Modals (`apps/mgbos/src/app/(app)/shipments/components.tsx`):**
     - `<ShipmentStatusBadge>`: Indonesian status pills with visual indicators.
     - `<CreateShipmentModal>`: Item allocation with remaining quota ceilings, courier selection, weight & koli.
     - `<DispatchShipmentModal>`: Resi tracking number and actual courier cost input with CFO pass-through escrow reminder.
     - `<MarkDeliveredModal>`: Delivery confirmation and permanent lock.
     - `<CancelShipmentModal>`: Cancellation with reason recording.
     - `<PrintableSuratJalanA4>`: Standard Indonesian Surat Jalan A4 format with 3-party signature blocks (Pengirim, Kurir, Penerima).
     - `<PrintableThermalLabelA6>`: A6 Thermal Shipping Label (100x150mm) with courier header, simulated barcode, destination city highlight, package itemization, and print CSS.
   - **Pages & Navigation:**
     - `apps/mgbos/src/app/(app)/shipments/page.tsx`: Shipment directory with KPI cards and tracking list.
     - `apps/mgbos/src/app/(app)/shipments/[shipmentId]/page.tsx`: Detailed shipment view with status tracker, items, tracking info, action modals, and printable previews.
     - `apps/mgbos/src/app/(app)/orders/[orderId]/page.tsx`: Integrated "Surat Jalan & Pengiriman (DO)" section with fulfillment progress and DO creation trigger.
     - `apps/mgbos/src/app/(app)/layout.tsx`: Sidebar navigation link `Fulfillment & DO` under Operations.

5. **Verification & Testing:**
   - **pgTAP Test Suite (`supabase/tests/fulfillment_and_shipments.test.sql`):**
     - 17 assertions verifying table schemas, RLS, DO numbering, ceiling guards, dispatch ledger integration, delivered immutability, and cancellation quota release.
     - Full test suite passed: 19 test files, 316 assertions, 0 failures.
   - **End-to-End Flow Script (`scripts/verify-e2e-flow.mjs`):**
     - Extended Section 8 covering partial fulfillment (35 pcs DO 1), over-shipping block (ceiling guard), second DO (25 pcs DO 2), dispatch with tracking number, automatic `COURIER_EXPENSE_DISBURSED` ledger emission, delivered sign-off, and immutability lock.
     - Verified end-to-end against local Supabase container.
   - **Quality Gates:**
     - `pnpm typecheck`: Clean across all packages and apps (0 errors).
     - `pnpm test`: 44 test suites, 201 unit tests passed.
     - `pnpm lint`: Clean across codebase (0 warnings, 0 errors).
     - `pnpm format:check`: All files match Prettier standards.
     - `pnpm build`: Both Next.js applications (`apps/teestock`, `apps/mgbos`) compiled and built successfully.
