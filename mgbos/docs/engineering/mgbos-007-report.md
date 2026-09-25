# MGBOS-007: Requirement aggregate and versioning

Implemented locally; production deployment is not in scope.

## Behavior

- /requirements lists the active brand's latest 100 requirements and lets permitted users create requirements, revise snapshots, request information, mark ready, lock versions and cancel.
- OWNER, ADMIN and SALES can create/transition/lock; OPERATIONS can create revisions; FINANCE and QC can read.
- Each revision keeps previous content, including structured specification data. Generic summary, unit, quantity, budget and date are shared across brands; the specialized apparel builder remains MGBOS-008.
- Budget input is integer rupiah. Bigint values travel as decimal strings to avoid JavaScript rounding.
- Snapshot content is append-only, even before locking. Once locked, neither content nor lock metadata can be rewritten.
- Locking historical versions does not lock the active version. New revisions start in DRAFT.
- READY requires a summary and positive quantity. Current-version locking requires READY.
- Cancelled requirements reject new versions and locks.

## Upgrade

Migration 20260924070000_requirement_integrity_upgrade.sql replays hardened lead/customer RPC definitions, removes obsolete overloads, fixes requirement locks and adds parent/version ownership constraints. Earlier applied migrations remain unchanged by this implementation.
Applied to local mgbos-foundation without reset; CLI migration history repaired to record that application. Generated database types were introspected.

## Verification

Verified on 2026-09-24:

- `pnpm check`: formatting, lint, strict type checks, 78 unit tests and production builds for both applications passed.
- `node scripts/database.mjs test`: 102 database assertions across 9 files passed.
- Production HTTP smoke on temporary ports 3111/3112: both app pages, Custom Atelier, health endpoints and 404 responses passed. Existing development ports were left running.
- Authenticated founder request to `/requirements`: page and create form rendered successfully. Unauthenticated requests redirect to `/login`.
- PostgREST budget-to-text projection succeeded, preserving bigint transport semantics.
- 21st static UI review: 5 files checked, 0 findings. Interactive browser and responsive visual QA were not performed; HTTP rendering is not an end-to-end form submission test.
- No business records were created by the HTTP checks. Database regression fixtures run in rolled-back transactions.

## Boundaries

No production changes, automated quotation, external notifications or legacy data migration.
Lists currently show up to 100 records; pagination is future work.
Full transactional outbox/audit events and command retry idempotency for creation are not yet implemented. Repeated create submissions must not be treated as idempotent.
