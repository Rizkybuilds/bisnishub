# ADR-015: MGBOS workspace under systems

Date: 2026-09-29
Status: ACCEPTED

## Decision

The official workspace is now `systems/mgbos/`. This supersedes the root
location in ADR-007, while preserving its isolated toolchain, database,
application ports, package identities and modular-monolith boundaries.

The repository root owns navigation and cross-system governance. MGBOS owns
its applications, packages, local Supabase and technical documentation.
Business knowledge remains under `bisnis/`; session history remains under
`catatan/`. A future JARVIS runtime must have its own explicit system boundary;
this relocation does not implement or deploy it.

## Migration and recovery

The workspace moves as one unit. Existing migration files retain their relative
names and Git blobs/modes. The migration guard compares both approved roots,
rejects split roots and duplicates, and supports a whole-root rollback without
allowing SQL history changes. Root scripts, CI, skills, role references and links
move with the workspace. Application/package renaming is a separate change.

Use `npm run dev:mgbos` from the repository root or run the pinned workspace
commands from `systems/mgbos/`. Do not use the obsolete root Supabase junction.
No database reset, remote schema mutation or hosting relocation is implicit.

Rollback the directory move together with its consumers and rerun the same
application, governance and database gates. Git does not restore local secrets
or provider settings; preserve those separately without copying values into Git.
