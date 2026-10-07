---
canonical_id: mgbos.implementation.phase-2-founder-control.index
status: ACTIVE
version: 0.2
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-phase-2-founder-control
document_class: implementation-phase-index
effective_from: 2026-10-06
last_reviewed: 2026-10-07

repository_baseline:
  repository: Rizkybuilds/bisnishub
  branch: main
  commit: b8262cca87a7d2644cf1738bf54fe72e8c4545f1
  tree: 5e6f3f9b6921ce191863fe2ee42b46541b62057e

phase:
  id: PHASE_2_FOUNDER_CONTROL
  status: IN_PROGRESS_BOUNDED

current_slice:
  id: P2-A_OPERATIONAL_EXCEPTION_FOUNDATION
  status: IN_PROGRESS

completed_work_packages:
  - WP-P2A-01
  - WP-P2A-02

active_work_package: NONE

next_candidate:
  id: WP-P2A-03
  status: NOT_AUTHORIZED

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

# Phase 2 — Founder Control Implementation Index v0.2

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

ACTIVE WORK PACKAGE
=
NONE

NEXT ENGINEERING CANDIDATE
=
WP-P2A-03 (OPERATIONAL EXCEPTION CONSOLE)
STATUS: NOT_AUTHORIZED

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

## 5. Current Boundaries & What Is NOT Implemented

While the database, domain, validation, authorization, and server command boundary are **CURRENT**, the following boundaries remain strictly in effect:

```text
NO active Builder work package
NO Operational Exception console UI yet (packages/ui, apps/mgbos console screens not implemented)
NO manual-open UI form yet
NO resource candidate selector yet
NO detail/history screen yet
NO lifecycle action UI buttons/dialogs yet
NO sidebar Operational Exception navigation entry yet
NO Founder Attention projection layer implemented
NO Founder Home interface implemented
NO automated background exception detectors
NO service principal automation
NO production deployment authorization
NO real business pilot execution
```

Operational Exception classification:

```text
Operational Exception
=
CANONICAL_TARGET
+
IMPLEMENTED THROUGH DATABASE, DOMAIN,
VALIDATION, AUTHORIZATION,
AND APPLICATION COMMAND BOUNDARY

BUT

OPERATOR CONSOLE UI
=
NOT IMPLEMENTED
```

---

## 6. Next Candidate: WP-P2A-03

The next engineering slice identified by the P2-A Technical Plan is:

```text
Work Package:
WP-P2A-03 — Operational Exception Console

Scope:
- Exception list view
- Manual-open form
- Resource candidate selector
- Exception detail page
- Audit history display
- Governed lifecycle action UI
- Sidebar navigation entry

Status:
NEXT CANDIDATE / NOT AUTHORIZED
```

### Governing Rule for WP03 Entry

Antigravity / Builder MUST NOT begin code implementation on WP03 until:

1. Head Engineering (ChatGPT) authors and audits an Implementation Contract for WP-P2A-03;
2. Bounded Work Package `WP-P2A-03` is authored;
3. Owner / governed authority grants explicit execution authorization;
4. The candidate binds to the exact verified baseline.

### Engineering Follow-Up (Non-Blocking)

Before or during WP-P2A-03 planning, Head Engineering should decide whether public UI-facing read APIs should always create trusted context internally rather than accepting optional injected context. This is tracked as `FOLLOW_UP / NON_BLOCKING` for WP03.

---

## 7. Document Routing & Reading Order

For Phase 2 engineering and product navigation, read in this order:

1. [MGBOS Implementation Index](../README.md) — Top-level implementation phase routing.
2. [Founder Control Documentation Plan](../../product/founder-control-documentation-plan.md) — Overall documentation program.
3. [TeeStock Founder Control PRD](../../product/teestock-founder-control-prd.md) — Core product definition (D1).
4. [Operational Exception Specification](../../product/operational-exception-spec.md) — Exception product specification (D3).
5. [Founder Attention Experience Specification](../../product/founder-attention-experience-spec.md) — Attention projection specification (D2).
6. [Founder Control P2-A Technical Plan](../../engineering/founder-control-p2a-operational-exception-technical-plan.md) — Active technical plan for P2-A.
7. [Phase 1 Operating Spine Completion Report](../phase-1-operating-spine/completion-report.md) — Provenance of the closed foundational phase.
