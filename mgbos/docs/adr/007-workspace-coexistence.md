# ADR-007: Isolated MGBOS workspace inside Bisnis Hub

Date: 2026-09-23
Status: ACCEPTED

## Context

The existing repository contains 641 tracked/untracked source files and extensive uncommitted changes.
Root package scripts deploy and run the existing Vite TeeStock application.
apps/mgbos is an untracked Vite prototype. Root supabase is a filesystem link to bisnis/teestock/supabase.
The tracker marks issues 001–004 complete but differs from 0.5.4: Vite instead of Next.js, a context helper instead of authentication, and formatting instead of transactional numbering.

## Decision

Implement the user-requested 0.5.4 MGBOS-001 at mgbos/, as a self-contained pnpm monorepo.
Its internal apps/mgbos, apps/teestock, packages and supabase layout follows the specification.
Do not alter or migrate the existing apps, notes, root package scripts, Vercel setup, SQL or lockfiles.
Use app ports 3101/3102 and local Supabase ports 55431–55439 with a separate project ID.
GitHub workflow lives at the enclosing Git root and sets working-directory to mgbos.
The current explicit task and 0.5.4 issue definitions override the tracker's completion claims for this execution.

## Alternatives

Converting the old root workspace would couple installs and deployment to ongoing unrelated changes.
Replacing the Vite prototype would overwrite work that has not been committed.

## Consequences

Developers first cd into mgbos. The legacy prototype remains separate and operational.
This is a workspace inside the existing Git repository, not a nested Git repository or separate remote.
Future consolidation requires its own migration task. No MGBOS-002–004 implementation is reused or certified here.
