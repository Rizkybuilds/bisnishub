# TeeStock V1 — retired implementation

Reference only. Owner retired the storefront and legacy BisnisHub admin.
The admin was removed in commit `05e8b18`; its history remains in Git.
The remaining storefront, shared code and historical SQL are stored here,
outside active systems and business knowledge.

- `apps/storefront/`: retired Vite storefront.
- `packages/shared/`: retired shared implementation.
- `supabase/`, `database/`, `test/`: historical SQL and tests, never a MGBOS fallback.
- `scripts/`: historical verification/seed utilities; do not run against live services.

Internal legacy paths are preserved as historical source, not supported launch
instructions. No root install/build aliases consume this archive. Business
documents, catalog references and HTML planning tools remain under
`bisnis/teestock/`; session history remains under `catatan/`.

Local ignored metadata moved with its owning directory and was not staged.
Archiving source does not remove an existing hosted deployment. Root Vercel
configuration remains disabled until a separately verified release target is selected.
