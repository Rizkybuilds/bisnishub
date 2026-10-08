---
canonical_id: mgbos.implementation.phase-2-founder-control.index
status: ACTIVE
version: 0.3
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-phase-2-founder-control
document_class: implementation-phase-index
effective_from: 2026-10-06
last_reviewed: 2026-10-08

repository_baseline:
  repository: Rizkybuilds/bisnishub
  branch: main
  commit: 23d4fd3d184d5bf60c9d41e57a1c01fe3517c132
  tree: 1f8b7f60848d000e405410f4574d0306b923fa56

phase:
  id: PHASE_2_FOUNDER_CONTROL
  status: IN_PROGRESS_BOUNDED

current_slice:
  id: P2-A_OPERATIONAL_EXCEPTION_FOUNDATION
  status: IN_PROGRESS

completed_work_packages:
  - WP-P2A-01
  - WP-P2A-02
  - WP-P2A-03

active_work_package: WP-P2A-04 (BRANCH_CANDIDATE)

next_candidate:
  id: WP-P2A-04
  status: IN_REVIEW_CANDIDATE

deployment_status: NOT_AUTHORIZED
pilot_status: BLOCKED

authoritative_for:
  - Phase 2 Founder Control implementation navigation
  - Phase 2 work package lifecycle status
  - Phase 2 slice execution tracking
  - Phase 2 reading order and document routing

not_authoritative_for:
  - MGBOS canonical architecture
  - Founder Control product semantics
  - TeeStock business strategy
  - work package authorization grant
  - production readiness certification
  - deployment authorization

depends_on:
  - ../README.md
  - ../../architecture/README.md
  - ../../product/founder-control-documentation-plan.md
  - ../../product/teestock-founder-control-prd.md
  - ../../product/operational-exception-spec.md
  - ../../product/founder-attention-experience-spec.md
  - ../../engineering/founder-control-p2a-operational-exception-technical-plan.md
  - ../../../../../docs/governance/documentation-constitution.md
  - ../../../../../docs/governance/canonical-source-map.md
  - ../../../../../docs/engineering/vibe-engineering/README.md

supersedes: null
---

# Phase 2 — Founder Control Implementation Index v0.3

## 1. Purpose

Directory:

```text
systems/mgbos/docs/implementation/phase-2-founder-control/
```

owns implementation-level documentation, work package tracking, and execution governance for:

```text
PHASE 2 — FOUNDER CONTROL
```

This phase translates approved Founder Control product requirements (D1–D4) and reconciled canonical architecture into bounded software increments inside MGBOS.

---

## 2. Current Phase Status

```text
PHASE 2 STATUS
=
IN_PROGRESS_BOUNDED

CURRENT SLICE
=
P2-A OPERATIONAL EXCEPTION FOUNDATION (IN PROGRESS)

COMPLETED WORK PACKAGES
=
WP-P2A-01 (COMPLETE / MERGED / POST-MERGE VERIFIED)
WP-P2A-02 (COMPLETE / MERGED / POST-MERGE VERIFIED)
WP-P2A-03 (COMPLETE / MERGED / POST-MERGE VERIFIED)

ACTIVE WORK PACKAGE
=
WP-P2A-04 (ASSURANCE & REFLECTION — BRANCH CANDIDATE)

CANDIDATE STATUS
=
READY FOR PULL REQUEST & INDEPENDENT AUDIT (IN_REVIEW_CANDIDATE)

DEPLOYMENT STATUS
=
NOT_AUTHORIZED

REAL PILOT STATUS
=
BLOCKED
```

> [!important] **Bounded Implementation Rule**
> The existence of an active bounded implementation phase does **NOT** mean all Phase 2 work is authorized.
> In accordance with repository control-plane governance, implementation authority is strictly Work-Package-scoped:
> **ONE WRITER = ONE BOUNDED WORK PACKAGE = ONE GOVERNED CONTRACT**.

---

## 3. Completed Achievement: WP-P2A-01

The first bounded increment of Phase 2 landed in PR #42:

```text
Work Package:
WP-P2A-01 — Operational Exception Database + Domain Foundation

Contract:
IC-MGBOS-P2A-WP01-OPERATIONAL-EXCEPTION-FOUNDATION (SATISFIED / CLOSED)

Pull Request:
#42 (feat(mgbos): add operational exception database foundation)

Integration Revision:
aad21534c369829d408db424bb0546aad0d28bd2

Status:
COMPLETE / MERGED / POST-MERGE VERIFIED
```

### Verified Runtime Foundation Landed by WP01

1. **Durable Persistence:**
   - Table `app.operational_exceptions` (Organization-isolated, typed abnormalities, severity, status, revision).
   - Table `app.operational_exception_audit` (append-only trigger-protected audit journal).
2. **Strict Trust Boundary:**
   - RPC execution revoked from `public`, `anon`, and `authenticated`; granted exclusively to `service_role`.
   - Direct table mutations (`INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`) denied to `service_role` and `authenticated`.
   - Browser authenticated `SELECT` guarded by Row Level Security (RLS) via `app.can_read_operational_exceptions(organization_id)` (`security definer`), restricting access strictly to active users with active `OWNER` or `ADMIN` roles in active organizations.
3. **Governed Human Lifecycle RPCs:**
   - `app.open_operational_exception`
   - `app.acknowledge_operational_exception`
   - `app.assign_operational_exception`
   - `app.reassign_operational_exception`
   - `app.change_operational_exception_severity`
   - `app.resolve_operational_exception`
   - `app.dismiss_operational_exception`
   - `app.reopen_operational_exception`
4. **Transactional Safety & Concurrency:**
   - Request-scoped advisory locking (`pg_advisory_xact_lock` on hashed `oe_req:` tuple) before receipt lookup.
   - Active business deduplication with dedicated advisory locking (`oe_dedup:` tuple) preventing duplicate open exceptions for the same abnormality on the same resource.
   - Optimistic revision control (`current_revision` bump and check).
   - OWNER-only permission required for `ACCEPTED_RISK` resolution.
   - Strict observation text limit `<= 4000` characters.
5. **Domain Package:**
   - Pure domain models, state machines, transition validators, deduplication fingerprints, and 25 unit tests in `@mgbos/domain`.
6. **Automated Test Evidence:**
   - 84 pgTAP regression tests in `systems/mgbos/supabase/tests/operational_exceptions.test.sql` proving all positive transitions, security denials, direct mutation blocks, and RLS rules.
7. **Generated Types:**
   - Verified deterministically generated TypeScript database types in `systems/mgbos/packages/database/generated/database.types.ts`.

---

## 4. Completed Achievement: WP-P2A-02

The second bounded increment of Phase 2 landed in PR #44:

```text
Work Package:
WP-P2A-02 — Validation + Authorization + Runtime Command Boundary

Contract:
IC-MGBOS-P2A-WP02-OPERATIONAL-EXCEPTION-RUNTIME-BOUNDARY (SATISFIED / CLOSED)

Pull Request:
#44 (feat(mgbos): add operational exception runtime command boundary)

Integration Revision:
b8262cca87a7d2644cf1738bf54fe72e8c4545f1

Status:
COMPLETE / MERGED / POST-MERGE VERIFIED
```

### Verified Runtime Boundary Landed by WP02

1. **Zod Command Schemas:**
   - Strict input validation schemas for all eight lifecycle commands in `@mgbos/validation` (`openOperationalExceptionSchema`, `acknowledgeOperationalExceptionSchema`, `assignOperationalExceptionSchema`, `reassignOperationalExceptionSchema`, `changeOperationalExceptionSeveritySchema`, `resolveOperationalExceptionSchema`, `dismissOperationalExceptionSchema`, `reopenOperationalExceptionSchema`) with strict character bounds, typed enum validations, and conditional reason requirements.
2. **Authoritative Permission Mapping:**
   - 10 typed permission codes registered in `@mgbos/auth`, strictly granting authority to active `OWNER` and `ADMIN` roles while denying all staff roles (`SALES`, `OPERATIONS`, `FINANCE`, `QC`).
3. **Server-Only Data Context & Isolation:**
   - Server-only context helper (`exceptionsContext`) in `apps/mgbos` ensuring service-role credentials never leak to the client, enforcing active session resolution, and applying non-bypassable Organization filtering (`organization_id=eq...`).
4. **Generated Read Models & Boundary Queries:**
   - Read models derived directly from `@mgbos/database` contracts (`OperationalExceptionRow`, `OperationalExceptionAuditRow`), unexported private PostgREST primitives, and Organization-scoped query helpers (`listOperationalExceptions`, `getOperationalException`, `getOperationalExceptionHistory`).
5. **Governed Server Actions:**
   - Eight application server actions in `apps/mgbos` wrapping WP01 RPC endpoints with session-derived actor and Organization identity, requestId and expectedRevision preservation, path revalidation, and zero direct table mutations.
6. **Bounded Error Model & Framework Control Flow:**
   - Error classifier mapping database and PostgREST rejections into bounded application error codes (`UNAUTHORIZED`, `CROSS_ORG`, `INVALID_STATE`, `STALE_REVISION`, `IDEMPOTENCY_CONFLICT`, `BUSINESS_DUPLICATE`, `INVALID_RESOURCE`, `VALIDATION_ERROR`, `UNKNOWN_FAILURE`).
   - Next.js framework redirect preservation via `unstable_rethrow` ensuring `requireAuth()` redirects to `/login` are not swallowed into application failures.
7. **Automated Test Evidence:**
   - 32 focused Vitest command-boundary tests in `systems/mgbos/scripts/operational-exception-command-boundary.test.ts` covering validation rejections, permission gates, RPC payload mappings, idempotency handling, redirect rethrowing, target principal error classification, and read boundary isolation.

---

## 5. Completed Achievement: WP-P2A-03

The third bounded increment of Phase 2 landed in PR #46:

```text
Work Package:
WP-P2A-03 — Operational Exception Console

Contract:
IC-MGBOS-P2A-WP03-OPERATIONAL-EXCEPTION-CONSOLE (SATISFIED / CLOSED)

Pull Request:
#46 (feat(mgbos): add operational exception console)

Integration Revision:
23d4fd3d184d5bf60c9d41e57a1c01fe3517c132

Integration Tree:
1f8b7f60848d000e405410f4574d0306b923fa56

Status:
COMPLETE / MERGED / POST-MERGE VERIFIED
```

### Verified Runtime Capability Landed by WP03

1. **Operator Console List (`/exceptions`):**
   - Organization-scoped list view with severity, lifecycle status, entity reference, assignment, and human-readable badges.
   - Filter tabs for fast triage and manual opening trigger.
2. **Manual-Open Workflow & Resource Scoping:**
   - Manual-open modal with strict `@mgbos/validation` contract compliance.
   - Bounded resource candidate selector covering `PRODUCTION_JOB`, `PRODUCTION_ASSIGNMENT`, `QC_INSPECTION`, `INVOICE`, `ORDER`, and `SHIPMENT`.
   - Server-derived active-Brand filtering via `resolveActiveBrandId(ctx)` (`limit = 100`) ensuring cross-brand or invalid resource candidates cannot be selected; fails closed (`[]`) if the active brand cannot be resolved.
   - Same-Organization active member selector for assignment.
3. **Detail Page & Audit History (`/exceptions/[exceptionId]`):**
   - Detailed header with severity, status, entity target link, assignee, timestamps, and optimistic revision indicator.
   - Observation card displaying immutable human report notes.
   - Append-only audit history timeline rendering trigger-journaled lifecycle transitions.
4. **Governed Human Lifecycle Actions:**
   - Dedicated modal forms for all lifecycle commands: Acknowledge, Assign, Reassign, Change Severity, Resolve, Dismiss, Reopen.
   - OWNER-only Accepted Risk resolution option with explicit risk rationale requirements.
   - Bounded candidate selection for `SUPERSEDED` resolution (active `OPEN`/`ACKNOWLEDGED` exceptions, excluding self) and `DUPLICATE` dismissal (all same-org exceptions, excluding self).
   - Compile-time payload conformance using `satisfies ...Input` types from `@mgbos/validation` across all eight console command payloads, while authoritative runtime validation remains the strict WP02 Zod validation performed inside the existing server actions.
5. **Runtime Hardening & Framework Integrity:**
   - Stable client-generated `requestId` propagation across all actions.
   - Optimistic revision verification (`expectedRevision`).
   - Bounded operator-facing error classification without leaking database credentials or traces.
   - Server-only trusted context execution without exported mutable test seams.
   - Permission-gated sidebar navigation (`canReadOperationalExceptions`).
6. **Amendment A1 Provenance:**
   - Authorized Amendment A1 resolved Next.js production build failure caused by synchronous exported helper `classifyDatabaseError` in top-level `'use server'` module `actions.ts`. Delta was strictly removing the `export` keyword. No command semantics changed.
7. **Closed Audit Findings:**
   - UI form payload alignment with `@mgbos/validation` (`satisfies ...Input` across all 8 actions).
   - Exported context test seam removed (`internalContextHolder` removed).
   - Candidate active-Brand scoping enforced server-side.
   - Candidate lifecycle eligibility enforced.
   - SUPERSEDED target active-state eligibility enforced.

---

## 6. Current Boundaries & What Is NOT Implemented

While the database, domain, validation, authorization, runtime command boundary, and operator console UI are **CURRENT**, the following boundaries remain strictly in effect:

```text
NO active Builder work package
NO Founder Attention projection layer implemented
NO Founder Home interface implemented
NO automated background exception detectors
NO service principal automation
NO production deployment authorization
NO real business pilot execution
FINAL ASSURANCE / REFLECTION (WP04) NOT YET COMPLETE
```

Operational Exception classification:

```text
OPERATIONAL EXCEPTION P2-A
=
IMPLEMENTED THROUGH OPERATOR CONSOLE

BUT

FINAL ASSURANCE / REFLECTION
=
NOT YET COMPLETE
```

---

## 7. Current Candidate: WP-P2A-04 (Assurance & Reflection)

The bounded assurance slice for P2-A is executed and documented in:

- [WP-P2A-04 Assurance Report](./wp-p2a-04-assurance.md)

```text
Work Package:
WP-P2A-04 — Assurance & Reflection

Contract:
IC-MGBOS-P2A-WP04 (READY_FOR_REVIEW)

Branch:
assurance/mgbos-p2a-wp04

Scope Executed:
- full workspace check: format, lint, lint:sql, typecheck (11 pkgs), full Vitest (65 files / 527 tests), Next.js builds
- local HTTP production smoke (:3101 & :3102)
- disposable local Supabase reset, 27 pgTAP files / 541 tests passed
- double database type generation determinism (database.types.ts unchanged)
- forward migration upgrade rehearsal from prior Phase 1 schema on isolated clone
- 20-request concurrency race proving active deduplication, 1 active row, 20 audit receipts (CHK-008 / AC-004)
- live local operator console lifecycle: Open -> Assign -> Acknowledge -> Reassign -> Severity -> Non-owner ACCEPTED_RISK denial -> Owner ACCEPTED_RISK resolution -> Reopen -> Dismiss (CHK-009 / AC-006)
- source-domain independence verified on Order and Production Job (AC-005)
- negative security: direct table INSERT/UPDATE/DELETE denied, anon denied, staff denied, cross-tenant denied (AC-008)

Status:
IN_REVIEW_CANDIDATE (Awaiting Pull Request audit by Head Engineering)
```

---

## 8. Document Routing & Reading Order

For Phase 2 engineering and product navigation, read in this order:

1. [MGBOS Implementation Index](../README.md) — Top-level implementation phase routing.
2. [Founder Control Documentation Plan](../../product/founder-control-documentation-plan.md) — Overall documentation program.
3. [TeeStock Founder Control PRD](../../product/teestock-founder-control-prd.md) — Core product definition (D1).
4. [Operational Exception Specification](../../product/operational-exception-spec.md) — Exception product specification (D3).
5. [Founder Attention Experience Specification](../../product/founder-attention-experience-spec.md) — Attention projection specification (D2).
6. [Founder Control P2-A Technical Plan](../../engineering/founder-control-p2a-operational-exception-technical-plan.md) — Active technical plan for P2-A.
7. [Phase 1 Operating Spine Completion Report](../phase-1-operating-spine/completion-report.md) — Provenance of the closed foundational phase.
