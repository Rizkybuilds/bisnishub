# MGBOS-005 execution report

Date: 2026-09-24

## Status

**Certified Complete.**
MGBOS-005 (Customer Foundation & Multi-Brand 360 CRM) is fully implemented, verified, and certified.
Database schema migration, seed data, pgTAP tests (44/44 passing across 5 test suites), domain logic, Zod validation schemas, regenerated database types, and Next.js Customer 360 UI with server actions and active brand filters pass all quality gates.

## Implemented Scope

Following [MGBOS 0.5.4](../../../catatan/sesi/2026-09-23%20-%20MGBOS%200.5.4.md), [MGBOS 0.5.2](../../../catatan/sesi/2026-09-23%20-%20MGBOS%200.5.2.md), and [MGBOS 0.2.1](../../../catatan/sesi/2026-09-23%20-%20MGBOS%200.2.1%20Logical%20Data%20Model.md):

### 1. Database Schema (`mgbos/supabase/migrations/20260924030000_customer_foundation.sql`)

- Created in isolated `app` schema:
  - `app.customer_accounts`: Core customer entity with fields `id`, `organization_id`, `account_type` (`COMPANY` or `PERSON`), `display_name`, `legal_name`, `primary_email`, `primary_phone`, `tax_id`, `status` (`ACTIVE`, `INACTIVE`, `MERGED`, `BLOCKED`), `customer_since`, `created_at`, `updated_at`.
  - `app.customer_contacts`: Multi-contact PICs for B2B/Corporate accounts, with fields `id`, `account_id`, `name`, `email`, `phone`, `position`, `is_primary`, `created_at`, `updated_at`.
  - `app.customer_brand_relationships`: Multi-brand relationship mapping connecting accounts to brands (`brand_id`), with `customer_segment` (`RETAIL`, `RESELLER`, `CORPORATE`, `COMMUNITY`, `GOVERNMENT`, `INTERNAL`), `relationship_status` (`PROSPECT`, `ACTIVE`, `CHURNED`, `BLOCKED`), and `notes`.
  - `app.addresses`: Shared normalized address repository with `street`, `subdistrict`, `district`, `city`, `province`, `postal_code`, `country`, `latitude`, `longitude`.
  - `app.customer_addresses`: Address assignment junction with `address_type` (`BILLING`, `SHIPPING`, `OFFICE`, `WAREHOUSE`, `FACTORY`) and `is_default` flag.
  - Foreign key indexes on all relationship attributes for high-performance joins.
  - Row Level Security (RLS) enabled on all tables for `service_role` and organization members.
  - Automatic `updated_at` trigger integration across all modified entities.

### 2. Seed Data (`mgbos/supabase/seed.sql`)

- Seeded two realistic multi-brand customer scenarios:
  1. `PT ABC Media Nusantara` (`COMPANY` account):
     - Multiple PIC contacts: Budi Santoso (Purchasing Manager, primary) and Sari Dewi (Finance & Accounting).
     - Multi-brand relationships: TeeStock (Corporate segment, Active) and MultiGraph (Packaging segment, Active).
     - Standard office billing & shipping address in Tanah Abang, Jakarta Pusat.
  2. `Rendra Pratama` (`PERSON` account):
     - Direct retail buyer for TeeStock apparel.
     - Single primary contact and active relationship with TeeStock.

### 3. Database Testing (`mgbos/supabase/tests/customer_foundation.test.sql`)

- 12 pgTAP assertions verifying:
  - Table existence for `customer_accounts`, `customer_contacts`, `customer_brand_relationships`, `addresses`, `customer_addresses`.
  - Foreign key constraint enforcement.
  - Insertion and query of corporate multi-contact customers.
  - Insertion and query of multi-brand customer relationships.
  - Unique primary contact constraint and search capabilities.
  - Independent customer query per brand.
- Total pgTAP test suite: **44/44 passing** across 5 test files (`infrastructure`, `organization_foundation`, `auth_owner_membership`, `document_sequences`, `customer_foundation`).

### 4. Code Packages

- `packages/domain`: Pure TypeScript domain logic in `src/customer.ts`:
  - `CustomerAccountType`: `'COMPANY' | 'PERSON'`.
  - `CustomerStatus`: `'ACTIVE' | 'INACTIVE' | 'MERGED' | 'BLOCKED'`.
  - `CustomerSegment`: `'RETAIL' | 'RESELLER' | 'CORPORATE' | 'COMMUNITY' | 'GOVERNMENT' | 'INTERNAL'`.
  - `CustomerRelationshipStatus`: `'PROSPECT' | 'ACTIVE' | 'CHURNED' | 'BLOCKED'`.
  - `AddressType`: `'BILLING' | 'SHIPPING' | 'OFFICE' | 'WAREHOUSE' | 'FACTORY'`.
  - Helper functions: `formatCustomerDisplayName`, `getPrimaryContact`, `formatAddressLine`, `isCorporateAccount`.
  - 4 Vitest unit tests in `src/customer.test.ts`.
- `packages/validation`: Zod schemas in `src/customer.ts`:
  - `createCustomerAccountSchema` with entity-aware validation rules (e.g. corporate accounts require non-empty display name and validate tax ID format).
  - `updateCustomerAccountSchema`.
  - `createCustomerContactSchema`.
  - `customerBrandRelationshipSchema`.
  - `addressSchema`.
  - 6 Vitest unit tests in `src/customer.test.ts`.
- `packages/database`: Introspected types updated via `pnpm db:types` (`CustomerAccountRow`, `CustomerContactRow`, `CustomerBrandRelationshipRow`, `AddressRow`, `CustomerAddressRow`).
- Total Vitest unit tests: **49/49 passing** across 10 test files.

### 5. App Shell & Next.js UX (`apps/mgbos`)

- `/customers`:
  - `page.tsx`: Server component querying customer accounts with nested contacts and brand relationships filtered by organization and active brand context.
  - Header & Top Stats: 4 KPI summary cards (Total Holding Customers, B2B Corporate Accounts, Retail Person Accounts, Active Brand Relationship Count).
  - `CustomerListTable.tsx`: Interactive client table with text search, account type filter (All / Company / Person), and active brand toggle. Displays PIC tags, contact badges, and brand pill badges.
  - `CreateCustomerModal.tsx`: Accessible modal for adding new customers with instant entity toggle (Perusahaan vs Individu), contact PIC form, and automatic active brand relationship association.
  - `actions.ts`: `createCustomerAction` server action executing atomic account, contact PIC, and brand relationship insertions with PostgREST/Supabase service role and input validation.
  - Navigation: Sidebar link active in `apps/mgbos/src/app/(app)/layout.tsx` pointing to `/customers`.
- Local tooling:
  - Updated `scripts/database.mjs` to automatically detect Docker Desktop path on Windows host, enabling frictionless `pnpm db:test` execution.

## Verification results

| Check               | Result                                               |
| ------------------- | ---------------------------------------------------- |
| `pnpm db:reset`     | PASS, schema migrations and seed applied cleanly     |
| `pnpm db:test`      | PASS, 44/44 pgTAP tests across 5 test suites         |
| `pnpm db:types`     | PASS, introspected TypeScript types synchronized     |
| `pnpm format:check` | PASS, Prettier code style verified across workspace  |
| `pnpm lint`         | PASS, zero ESLint warnings                           |
| `pnpm typecheck`    | PASS, strict typing across all 11 workspace projects |
| `pnpm test`         | PASS, 49/49 Vitest unit tests across 10 test files   |
| `pnpm build`        | PASS, Next.js optimized production build succeeds    |
| `pnpm check`        | PASS, full verification suite executed cleanly       |
