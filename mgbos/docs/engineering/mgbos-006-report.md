# MGBOS-006 execution report

Date: 2026-09-24

## Status

**Certified Complete.**
MGBOS-006 (Inbound Lead Pipeline & Qualification Engine) is fully implemented, verified, and certified.
Database schema migration, triggers for automatic canonical document numbering, seed data, pgTAP tests (56/56 passing across 6 test suites), domain logic, Zod validation schemas, regenerated database types, and Next.js Leads & Inquiries pipeline UI with server actions and active brand filters pass all quality gates.

## Implemented Scope

Following [MGBOS 0.5.4](../../../catatan/sesi/2026-09-23%20-%20MGBOS%200.5.4.md), [MGBOS 0.5.1](../../../catatan/sesi/2026-09-23%20-%20MGBOS%200.5.1.md), [MGBOS 0.3](../../../catatan/sesi/2026-09-23%20-%20MGBOS%200.3%20%E2%80%94%20Business%20State%20Machines.md), and [MGBOS 0.2.1](../../../catatan/sesi/2026-09-23%20-%20MGBOS%200.2.1%20Logical%20Data%20Model.md):

### 1. Database Schema (`mgbos/supabase/migrations/20260924040000_leads_pipeline.sql`)

- Created in isolated `app` schema:
  - `app.leads`: Inbound lead and prospect tracking table with fields `id`, `organization_id`, `brand_id`, `business_line_id`, `channel_id`, `customer_account_id` (nullable for anonymous inquiries), `customer_contact_id`, `lead_number` (canonical format e.g. `TS-L-2026-000001`), `title`, `contact_name`, `company_name`, `email`, `phone`, `raw_inquiry`, `estimated_quantity`, `estimated_budget` (bigint integer rupiah, zero float policy), `status` (`NEW`, `CONTACTED`, `QUALIFYING`, `QUALIFIED`, `DISQUALIFIED`, `CONVERTED`, `LOST`), `qualification_result`, `qualification_score` (0-100), `qualification_notes`, `disqualification_reason` (`OUT_OF_SCOPE`, `SPAM`, `INVALID_CONTACT`, `QUANTITY_NOT_SUPPORTED`, `DEADLINE_IMPOSSIBLE`, `BUDGET_MISMATCH`, `OTHER`), `assigned_user_id`, `created_at`, `contacted_at`, `qualified_at`, `disqualified_at`, `converted_at`, `lost_at`, `lost_reason`, `updated_at`, `archived_at`.
  - Unique constraint on `(organization_id, lead_number)`.
  - Composite indexes on `(brand_id, status, created_at desc)`, `(organization_id)`, `(channel_id)`, `(customer_account_id)`, and `(lead_number)`.
- Automatic Canonical Numbering Trigger:
  - `app.trg_leads_generate_number`: `BEFORE INSERT` trigger calling `app.generate_document_number(NEW.organization_id, NEW.brand_id, 'L', year, 6)` if `lead_number` is null or empty, guaranteeing collision-safe sequential numbers for every lead.
- Row Level Security (RLS):
  - Enabled on `app.leads` with policies granting full access to `service_role` and select/insert/update access to active members of the organization.

### 2. Seed Data (`mgbos/supabase/seed.sql`)

- Seeded 3 multi-brand leads reflecting holding operations:
  1. `TS-L-2026-000001` (TeeStock - `NEW`): WhatsApp inbound inquiry for 75 pcs community motorcycle t-shirts (NSA 7200 + DTF).
  2. `TS-L-2026-000002` (TeeStock - `QUALIFIED`): Website / Custom Atelier corporate uniform inquiry (120 pcs polo shirt) linked to customer account `PT ABC`.
  3. `MG-L-2026-000001` (MultiGraph - `DISQUALIFIED`): Instagram DM spam inquiry with reason `SPAM`.

### 3. Database Testing (`mgbos/supabase/tests/leads_pipeline.test.sql`)

- 12 pgTAP assertions verifying:
  - Table existence for `app.leads`.
  - Total seeded lead records count.
  - Canonical format validation regex `^TS-L-\d{4}-\d{6}$`.
  - Status and channel verification for WhatsApp lead.
  - Customer account linkage and qualification score for B2B lead.
  - Disqualification reason structure enforcement.
  - Trigger automatic lead number generation on insert.
  - Check constraint rejection for invalid status.
  - Check constraint rejection for invalid disqualification reason.
  - Check constraint rejection for negative estimated quantity.
  - Per-brand lead query isolation.
  - Unique constraint violation on duplicate lead number.
- Total pgTAP test suite: **56/56 passing** across 6 test files (`infrastructure`, `organization_foundation`, `auth_owner_membership`, `document_sequences`, `customer_foundation`, `leads_pipeline`).

### 4. Code Packages

- `packages/domain`: Pure TypeScript domain logic in `src/lead.ts`:
  - `LeadStatus`, `QualificationResult`, `DisqualificationReason` types.
  - `LEAD_TRANSITIONS` state machine transition map.
  - `canTransitionLead` and `validateLeadTransition` guards.
  - `evaluateLeadQualification` implementing Qualification Rules v1 (evaluating valid contact method, clear inquiry, positive estimated quantity, scoring from 0 to 100).
  - Indonesian label formatters: `formatLeadStatus`, `getLeadStatusBadgeColor`, `formatDisqualificationReason`.
  - 7 Vitest unit tests in `src/lead.test.ts`.
- `packages/validation`: Zod schemas in `src/lead.ts`:
  - `createLeadSchema`.
  - `qualifyLeadSchema`.
  - `disqualifyLeadSchema`.
  - `convertLeadSchema`.
  - 5 Vitest unit tests in `src/lead.test.ts`.
- `packages/database`: Introspected types updated (`LeadRow`, `LeadInsert`, `LeadUpdate`).
- Total Vitest unit tests: **61/61 passing** across 12 test files.

### 5. App Shell & Next.js UX (`apps/mgbos`)

- `/leads`:
  - `page.tsx`: Server component querying leads with nested channel, brand, and customer account relations.
  - Header & Top Stats: 4 KPI summary cards (Total Inbound Leads, Inquiry Baru Untouched, Siap Quote Qualified, Aktif di Brand Context).
  - `LeadListTable.tsx`: Interactive table with search, status filters (All, New, Qualified, Disqualified, Converted), and brand filter toggle.
  - `CreateLeadModal.tsx`: Accessible modal to record new inbound leads from WhatsApp, Website, Instagram DM, or Direct Sales.
  - `LeadDetailModal.tsx`: Comprehensive inquiry viewer with direct `wa.me` link, customer account linkage, and 1-click action tabs to Qualify, Disqualify, or Convert to Customer Account.
  - `actions.ts`: Server actions for `createLeadAction`, `qualifyLeadAction`, `disqualifyLeadAction`, and `convertLeadAction`.
  - Navigation: Sidebar link active in `apps/mgbos/src/app/(app)/layout.tsx` pointing to `/leads` with `ACTIVE` badge.
  - Dashboard: Updated Vertical Slices Status list in `apps/mgbos/src/app/(app)/dashboard/page.tsx` marking MGBOS-006 as `CERTIFIED` and MGBOS-007 as `UP NEXT`.

### 6. Atomic Procedures & Authorization Hardening (Remediation)

- **Database-Backed Session & Membership Guard (`apps/mgbos/src/lib/session.server.ts`)**:
  - Replaced hardcoded owner session with dynamic PostgreSQL lookup against `app.users`, `app.organization_members`, `app.organizations`, and `app.roles`.
  - Enforced active membership requirement (`m.status === 'ACTIVE' && m.organizations?.status === 'ACTIVE'`); users without active organization memberships are rejected immediately.
  - Dynamic active brand resolution against `app.brands` in the database.
- **Strict Lead Qualification Requirement on Conversion (`app.convert_lead_to_customer`)**:
  - Strictly requires `QUALIFIED` status: converting un-qualified leads (`NEW`, `CONTACTED`, `QUALIFYING`, `DISQUALIFIED`, `LOST`) is rejected with an explicit error.
  - Completeness verification: valid contact method (phone/email), contact or company name, non-empty inquiry/title, and positive estimated quantity.
- **Elimination of Direct CONVERTED Path (`app.transition_lead_status`)**:
  - Direct transition to `CONVERTED` via `transition_lead_status` is strictly prohibited; `CONVERTED` can only be set through atomic `convert_lead_to_customer`.
- **Role-Based Authority Boundaries (`packages/auth/src/permissions.ts` & Server Actions)**:
  - Implemented authoritative permission matrix (`ROLE_PERMISSIONS`) restricting mutation commands to `OWNER`, `ADMIN`, and `SALES`.
  - Roles `QC`, `FINANCE`, and `OPERATIONS` are strictly denied from creating, qualifying, disqualifying, or converting leads, and from creating customer accounts.
  - Dual-layer enforcement: client/server actions reject unauthorized commands with structured error messages before touching Supabase `service_role`; stored procedures enforce actor roles in PostgreSQL via `p_actor_id`.
- **Atomic Customer Creation (`app.create_customer_with_contact`)**:
  - Creates account, contact, and brand relationship in one atomic transaction, preventing orphaned records.
- **Routing Fixes**:
  - Corrected all 7 route references from `/app/dashboard` and `/app/settings` to canonical Next.js routes `/dashboard` and `/settings`.
- **Database Testing Suite (`atomic_leads_and_customers.test.sql`)**:
  - Expanded to 18 pgTAP test cases verifying state transition guards, backward transition rejection, completeness requirements, atomic conversion, idempotency, rejection of direct `CONVERTED` transitions, and rejection of unauthorized actor roles (`QC`, `FINANCE`).

## Verification results

| Check               | Result                                               |
| ------------------- | ---------------------------------------------------- |
| `pnpm db:reset`     | PASS, 7 migrations and seed applied cleanly          |
| `pnpm db:test`      | PASS, 74/74 pgTAP tests across 7 test suites         |
| `pnpm db:types`     | PASS, introspected TypeScript types synchronized     |
| `pnpm format:check` | PASS, Prettier code style verified across workspace  |
| `pnpm lint`         | PASS, zero ESLint warnings                           |
| `pnpm typecheck`    | PASS, strict typing across all 11 workspace projects |
| `pnpm test`         | PASS, 64/64 Vitest unit tests across 12 test files   |
| `pnpm build`        | PASS, Next.js optimized production build succeeds    |
| `pnpm check`        | PASS, full verification suite executed cleanly       |
