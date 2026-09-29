# MGBOS-008 — TeeStock Custom Atelier requirement builder

Implemented in the isolated MGBOS workspace on 2026-09-24. Local development only.

## Delivered behavior

- TeeStock has a dedicated Custom Atelier form at `/requirements`, alongside generic requirements for the other brands.
- Garment type, fit, material (including Combed 24s/30s), base color, optional GSM and blank preference.
- S–XXL quantity breakdown. All blank means unknown; partially filled means zero for remaining sizes. Known totals must equal the requirement quantity.
- Up to seven distinct decoration locations, with method, dimensions in cm, optional color count, artwork reference and notes. Supports DTF, screen printing, DTG, embroidery, heat transfer and other methods.
- Optional label, hangtag and packaging notes.
- Structured `teestock.custom_atelier.v1` snapshots, human-readable history, editable new revisions, and missing-information hints. Original snapshots remain immutable.
- Validation errors preserve entered values and focus the error message. Forms reset only on successful save when JavaScript is available.

## Implementation and compatibility

`packages/domain/src/customAtelier.ts` owns vocabulary and missing-information rules. `packages/validation/src/customAtelier.ts` validates the strict contract and quantity consistency. Server commands retain existing authorization and actor checks; generic revisions also validate any retained typed snapshot.

Migration `20260924080000_custom_atelier_validation.sql` validates new typed snapshots at the database boundary, including TeeStock brand ownership, positive PCS quantities, size totals and distinct decorations. Generic snapshots without a schema code remain supported. Unknown explicit schema codes are rejected. Existing immutable historical rows were not rewritten.

The local migration was applied transactionally without a reset, recorded in CLI migration history, and database types were regenerated. New dependencies are workspace links only; no new external packages were added. Existing card, form-input, requirement-grid and button styles were reused. 21st component search required login; static review ran successfully with 8 files and zero findings.

## Verification

- Database suite: 115 assertions passed across 10 files, including typed creation, invalid payload rejection and revision preserving the previous material.
- Browser: founder opened the form, submitted a size-total mismatch, received the expected validation error, and retained all entered values after the form-state fix. Desktop screenshot inspected. The test did not create a business record; the original user tab was left untouched.
- `pnpm check`: formatting, lint, strict type checks, 88 tests in 16 files and both production builds passed.
- Production HTTP smoke on temporary ports 3111/3112: app pages, Custom Atelier storefront shell, health and 404 checks passed. Authenticated requirement rendering, TeeStock-only Atelier visibility and unauthenticated login redirect also passed. Temporary servers were stopped afterward; the existing development server was left running.

## Boundaries and next stage

Artwork is a text reference, not file storage/upload. Unknown sizes and incomplete decoration details can be recorded and are shown as missing information; these hints do not imply production readiness. The inherited MGBOS-007 READY/lock gate remains unchanged.

Automated quotation, costing, pricing-floor approval and PDF quotation are the following MGBOS-009/010 stages. Existing outbox/audit and retry-idempotency limitations documented for MGBOS-007 remain. No production deployment or remote database changes. No claim of a full successful browser create/revise/lock end-to-end test or mobile visual QA.
