# MGBOS-018 — Inventory, SKU Variants & Multi-Location Stock Allocation Engine

Implemented locally on 2026-09-26. Primary milestone completion of **Sprint 7 (Inventory, SKU Variants & Multi-Location Allocation Engine / TS-PLAN-07)**.

## Delivered

1. **Inventory & Stock Schema (`app.inventory_items`, `app.inventory_levels`, `app.inventory_mutations`, `app.inventory_reservations`):**
   - Created in `supabase/migrations/20260926200000_inventory_and_stock_allocation.sql`:
     - **Master SKU Table (`app.inventory_items`):** Multi-tenant SKU registry, categorical classification (`BLANK_GARMENT`, `PRINT_MATERIAL`, `PACKAGING`, `FINISHED_GOOD`, `OTHER`), dynamic JSONB attributes (color, size, material, brand, GSM), Zero-Float integer cost price (`bigint`), and alert threshold.
     - **Stock Levels per Location (`app.inventory_levels`):** Multi-location tracking (`location_code`, `bin_location`), tracking `quantity_on_hand` and `quantity_reserved`. Constraint enforced: `quantity_on_hand >= quantity_reserved`.
     - **Append-Only Mutation Ledger (`app.inventory_mutations`):** Complete audit trail recording mutation types (`INBOUND_PURCHASE`, `RESERVATION`, `RELEASE_RESERVATION`, `CONSUMED_PRODUCTION`, `SCRAP_DEFECT`, `OUTBOUND_SHIPMENT`, `STOCK_OPNAME`), quantity delta, post-mutation snapshots, reference entity links, and actor tracking.
     - **Active Order Reservations (`app.inventory_reservations`):** Tracks committed stock tied to specific sales orders (`ACTIVE`, `CONSUMED`, `RELEASED`).
     - **Ledger Immutability Trigger (`trg_inventory_mutation_guard`):** Rejects any UPDATE or DELETE operations on `app.inventory_mutations`, enforcing strict audit immutability.
     - Multi-tenant isolation with strict Row-Level Security (RLS) policies on all tables.

2. **Inventory Stored Procedures & Business Guards:**
   - **`app.create_inventory_item`:**
     - Validates actor permissions (`OWNER`, `ADMIN`, `OPERATIONS`).
     - Normalizes uppercase SKU and item name.
     - Inserts master item and initializes default workshop stock level.
     - Automatically logs initial stock mutation in the audit ledger if initial quantity > 0.
   - **`app.record_inventory_mutation`:**
     - Atomically locks `app.inventory_levels` row with `FOR UPDATE`.
     - Supports direct physical mutations: `INBOUND_PURCHASE`, `SCRAP_DEFECT`, and `OUTBOUND_SHIPMENT`.
     - Guards against negative available stock for scrap or outbound shipments.
     - Appends mutation audit entry with post-transaction balances.
   - **`app.reserve_inventory_for_order` (Anti-Overselling Guard):**
     - Atomically locks inventory levels with `FOR UPDATE`.
     - Computes available unreserved stock: `quantity_on_hand - quantity_reserved`.
     - Strictly rejects over-reservation with Indonesian user-friendly exception: `"Stok tidak mencukupi untuk SKU {sku} ({name}). Dibutuhkan: {qty}, Tersedia: {available}"`.
     - Increments `quantity_reserved` and logs `RESERVATION` mutation event.
   - **`app.release_inventory_reservation`:**
     - Releases active reservations on order cancellation or modification.
     - Decrements `quantity_reserved` and restores available stock.
     - Marks reservation status as `RELEASED`.
   - **`app.consume_inventory_for_order`:**
     - Executed when blanks/materials are physically fed into production (DTF print/heat press).
     - Decrements both `quantity_on_hand` and `quantity_reserved`.
     - Marks reservation as `CONSUMED` and logs `CONSUMED_PRODUCTION`.
   - **`app.perform_stock_opname`:**
     - Reconciles physical warehouse count with system on-hand balances.
     - Validates mandatory variance explanation note.
     - Calculates difference delta and logs `STOCK_OPNAME` mutation audit record.

3. **Domain, Validation & Auth Packages:**
   - `packages/domain/src/inventory.ts`:
     - Pure domain types & constants: `InventoryCategory`, `InventoryMutationType`, `ReservationStatus`, `InventoryItem`, `InventoryLevel`, `InventoryMutation`, `InventoryReservation`.
     - Pure calculation helpers: `calculateAvailableStock`, `isStockAlertTriggered`, `calculateInventoryValuation`, `formatInventoryCategoryLabel`, `formatMutationTypeLabel`.
     - Unit tests in `packages/domain/src/inventory.test.ts`.
   - `packages/validation/src/inventory.ts`:
     - Zod schemas: `createInventoryItemSchema`, `recordInventoryMutationSchema`, `reserveInventorySchema`, `performStockOpnameSchema`.
     - Unit tests in `packages/validation/src/inventory.test.ts`.
   - `packages/auth/src/permissions.ts`:
     - Added permissions: `inventory:read`, `inventory:create`, `inventory:mutate`, `inventory:opname`.
     - Role mappings across `OWNER`, `ADMIN`, `OPERATIONS`, `FINANCE`, `SALES`, `QC`.

4. **Web Application Features (`apps/mgbos`):**
   - **Data Access & Server Actions:**
     - `apps/mgbos/src/app/(app)/inventory/data.ts`: PostgREST query layer with KPI calculations (Total SKU, Available Units, Reserved Units, Total Valuation, Low Stock Alerts).
     - `apps/mgbos/src/app/(app)/inventory/actions.ts`: Next.js Server Actions calling RPCs with cache revalidation.
   - **UI Components & Modals (`apps/mgbos/src/app/(app)/inventory/components.tsx`):**
     - `<InventoryCategoryBadge>`: Categorical badges with color indicators.
     - `<StockStatusBadge>`: Dynamic badges (`AMAN`, `MENIPIS`, `HABIS (0)`).
     - `<MutationTypeBadge>`: Color-coded mutation type pill.
     - `<CreateInventoryItemModal>`: Master SKU registration modal.
     - `<AdjustStockModal>`: Inbound restock and scrap defect adjustment modal.
     - `<StockOpnameModal>`: Physical opname count dialog with mandatory justification.
   - **Pages & Navigation:**
     - `apps/mgbos/src/app/(app)/inventory/page.tsx`: Directory page with KPI stat cards, categorical filter tabs (All, Blanks, DTF Materials, Packaging, Finished Goods), and interactive table.
     - `apps/mgbos/src/app/(app)/inventory/[itemId]/page.tsx`: SKU detail page displaying multi-location breakdown, active order reservations table, and append-only mutation ledger history.
     - `apps/mgbos/src/app/(app)/layout.tsx`: Navigation menu updated with `Persediaan & Stok` (`/inventory`) gated by `inventory:read`.

5. **Verification & Quality Gates:**
   - **Database Tests (pgTAP):** `supabase/tests/inventory_and_stock.test.sql` (21 assertions passed). Full test suite: 20 files, 337 assertions passed (0 failures).
   - **Unit & Domain Tests (Vitest):** 46 test files, 210 tests passed (0 failures).
   - **E2E Flow (`scripts/verify-e2e-flow.mjs`):** Section 9 added, testing blank garment registration, DTF material creation, inbound purchase mutation (+40), stock reservation (50 pcs), anti-overselling rejection check, consumption for production, and stock opname adjustment (-2 pcs).
   - **Lint & Format:** `pnpm format:check` and `pnpm lint` passed with 0 errors, 0 warnings.
   - **TypeScript Typecheck:** `pnpm typecheck` passed with 0 errors across all 11 workspace packages and applications.
   - **Production Next.js Builds:** `pnpm build` compiled both `apps/teestock` and `apps/mgbos` successfully.
