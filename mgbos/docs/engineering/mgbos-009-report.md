# MGBOS-009 — Quote versioning and pricing floor

Implemented and verified locally, completed 2026-09-25. No production changes.

## Delivered

- `/quotes`: active-brand quote list, new draft form, live integer-rupiah costing preview, component rows, discount and customer shipping separation, payment terms, validity and lead time.
- A quote version references one requirement line with its quantity, unit and specification snapshot. Customer details and commercial terms are snapshotted.
- Corrections create immutable revisions. Previous DRAFT/SENT versions become SUPERSEDED. Expected-version checks reject stale edits; repeated identical request IDs return the original result without duplicating records.
- Exact margin bands: target 30%; caution below 30%; strong warning below 25%; owner approval required below 20%. Customer shipping does not inflate margin. Discount reduces product revenue.
- Owner override requires a reason. Approval is bound to a version, recorded with actor identity and never inherited by revisions.
- Marking a quote sent requires a current READY/LOCKED requirement, active customer/brand, valid date and any necessary approval. Requirement locking and the sent audit record commit atomically. This records manual sending; no external message is transmitted.
- OWNER/ADMIN/SALES create and mark sent; OWNER alone approves; FINANCE can read. Internal HPP is not exposed to OPERATIONS/QC or the public storefront.

## Files and setup

Core rules: `packages/domain/src/quote.ts`; validation: `packages/validation/src/quote.ts`; permissions: `packages/auth/src/permissions.ts`; UI/server commands: `apps/mgbos/src/app/(app)/quotes/`.

Migration `20260924090000_quote_versioning_pricing.sql` creates quote/version/item/cost/approval/audit tables and guarded commands. It was applied transactionally to the local MGBOS database without reset, recorded in local CLI migration history, and database types were regenerated. New quote tables have RLS, no browser grants, and service-role read-only access; mutations require explicitly granted RPCs.

React Hook Form and its Zod resolver were added for dynamic cost-component forms. Existing card, button and form styles were reused. Architecture choices and pilot scope are documented in ADR-008. Root legacy apps and their Supabase link were not changed.

## Verification

- `pnpm check`: formatting, lint, strict type checks, 99 tests across 19 files, and both Next.js production builds passed.
- Database suite: 145 assertions across 11 files passed, including exact floor boundaries, shipping exclusion, discount effects, approval authority, immutable snapshots, atomic locking, retry behavior and stale revisions.
- Production HTTP smoke on temporary ports 3111/3112: both apps, Custom Atelier shell, health endpoints and 404 checks passed. Authenticated quote-page rendering and guest login redirect passed. No business records were created by these checks.
- 21st static review: 6 files, zero findings. Component search required login; no hosted generation was used.
- Browser inspection is limited to local page access/login and empty-state rendering; a complete successful create/revise/approve/send browser journey and mobile visual QA have not been certified.

## Remaining boundaries

This pilot supports one requirement line per version, multiple cost components, IDR integer amounts and no tax calculation. Cost entry is manual; vendor selection and live vendor rates are not integrated. Lists show at most 100 recent records. Draft corrections deliberately create a new version rather than silently editing an existing snapshot.

PDF output/manual sharing belongs to MGBOS-010; acceptance and order creation follow later. Automatic expiry/rejection/cancellation transitions and external event delivery are not exposed. Quote audit records are transactional; no outbox consumer is configured. Existing MGBOS-007/008 limitations remain outside this slice.
