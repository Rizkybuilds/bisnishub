---
canonical_id: mgbos.engineering.founder-control-p2a-operational-exception-technical-plan
status: ACTIVE
version: 1.4
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-founder-control-p2a-operational-exception-foundation
document_class: technical-implementation-plan
effective_from: 2026-10-07

program:
  parent_program: FOUNDER_CONTROL
  workstream: W3_ENGINEERING_DISCOVERY
  target_slice: P2-A_OPERATIONAL_EXCEPTION_FOUNDATION
  implementation_phase: PHASE_2_FOUNDER_CONTROL
  phase_2_execution_status: IN_PROGRESS_BOUNDED
  implementation_progress:
    wp01: POST_MERGE_VERIFIED
    wp02: POST_MERGE_VERIFIED
    wp03: POST_MERGE_VERIFIED
    wp04: POST_MERGE_VERIFIED
  active_work_package: NONE
  implementation_authorization: NONE
  builder_authorization: NONE_CURRENT
  deployment_authorization: NONE

repository_baseline:
  repository: Rizkybuilds/bisnishub
  branch: main
  commit: 77fbcbf08f2699ab85a0682ec4c981235c9c18cf
  tree: bd8c5061c5cadb87d09793fd7e39e35ed1370066
  reviewed_at: 2026-10-09

risk:
  proposed_classification: R4
  reason:
    - new authoritative business entity
    - authorization boundary change
    - database schema migration
    - durable lifecycle mutation
    - organization-isolation requirements
    - historical-integrity requirements
  reassessment_required_if:
    - source-domain mutation is introduced
    - production deployment is requested
    - financial truth is directly mutated
    - service-principal authority is introduced
    - automatic exception opening is introduced

authoritative_for:
  - P2-A technical implementation direction
  - P2-A physical schema design
  - P2-A command implementation design
  - P2-A runtime permission mapping
  - P2-A idempotency and concurrency design
  - P2-A application-surface design
  - P2-A implementation sequencing
  - P2-A verification requirements
  - P2-A acceptance criteria
  - P2-A stop conditions

not_authoritative_for:
  - Founder Control product semantics
  - canonical MGBOS entity semantics
  - canonical lifecycle semantics
  - business materiality policy
  - Founder Attention rules
  - Founder Home default scope
  - service-principal architecture
  - automatic detector policy
  - production readiness
  - pilot readiness
  - implementation execution authority

depends_on:
  - founder-control-engineering-discovery.md
  - ../architecture/canonical-data-model.md
  - ../architecture/business-state-machines.md
  - ../architecture/business-invariants.md
  - ../architecture/command-event-model.md
  - ../architecture/permission-authorization-model.md
  - ../architecture/domain-map-capability-ownership.md
  - ../product/teestock-founder-control-prd.md
  - ../product/founder-attention-experience-spec.md
  - ../product/operational-exception-spec.md
  - ../product/teestock-operational-pilot-plan.md
  - agent-system/risk-classification.md
  - ../../../../docs/engineering/vibe-engineering/implementation-contract-template.md
  - ../../../../.agents/contracts/implementation-contract.schema.json
  - ../../../../.agents/contracts/work-package.schema.json

supersedes:
  - mgbos.engineering.founder-control-p2a-operational-exception-technical-plan@1.3
---

# Founder Control P2-A — Operational Exception Foundation Technical Implementation Plan v1.4

## 1. Purpose

P2-A establishes the first runtime implementation of canonical:

```text
Operational Exception
```

inside MGBOS.

Primary objective:

> Introduce durable, governed, Organization-isolated Operational Exception truth using existing MGBOS architecture without introducing Founder Attention persistence, automatic detectors, service principals, generic workflow infrastructure, or source-domain mutation coupling.

P2-A answers:

```text
What physical data model should be built?

What commands should exist?

Who may execute them initially?

How is business deduplication enforced?

How are command retries made safe?

How is history preserved?

How is source business context validated?

How is cross-Organization access prevented?

How will humans operate the lifecycle?

How is the implementation proven correct?
```

---

# 2. Current State

At baseline:

```text
main
=
23d4fd3d184d5bf60c9d41e57a1c01fe3517c132

tree
=
1f8b7f60848d000e405410f4574d0306b923fa56

W2 ARCHITECTURE RECONCILIATION
=
POST-MERGE VERIFIED

W3 ENGINEERING DISCOVERY
=
ANALYSIS COMPLETE

P2-A TECHNICAL PLAN
=
ACTIVE (v1.3)

P2-A IMPLEMENTATION
=
IN PROGRESS (BOUNDED)

WP-P2A-01
=
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #42)

WP-P2A-02
=
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #44)

WP-P2A-03
=
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #46)

Operational Exception database & domain foundation
=
CURRENT (LANDED IN WP-P2A-01)

Operational Exception runtime command boundary
=
CURRENT (LANDED IN WP-P2A-02)

Operational Exception UI / Operator Console
=
CURRENT (LANDED IN WP-P2A-03)

Operational Exception Assurance & Reflection
=
CURRENT (LANDED IN WP-P2A-04, PR #48 @ 77fbcbf08f2699ab85a0682ec4c981235c9c18cf)

Founder Attention runtime
=
NOT IMPLEMENTED

ACTIVE WORK PACKAGE
=
NONE

NEXT WORK PACKAGE CANDIDATE
=
P2-B FOUNDER ATTENTION PLANNING (NOT AUTHORIZED FOR BUILDER)
```

No active Work Package or unreviewed PR exists at baseline.

---

# 3. P2-A Success Definition

P2-A succeeds when an authorized human actor can safely:

```text
OPEN

READ

ACKNOWLEDGE

ASSIGN

REASSIGN

CHANGE SEVERITY

RESOLVE

DISMISS

REOPEN
```

an Operational Exception while preserving:

```text
Organization isolation

stable identity

business deduplication

command idempotency

concurrency safety

responsibility

evidence

history

source-domain independence
```

---

# 4. P2-A Is Not Founder Home

P2-A does NOT implement:

```text
Founder Attention

Founder Home aggregation

attention priority

attention urgency

Founder Decision Required

evaluation coverage

dashboard cross-domain attention
```

Those belong to P2-B.

---

# 5. P2-A Is Not Automatic Detection

P2-A does NOT authorize:

```text
background scanner opens exception

cron mutates exception state

n8n opens exception

JARVIS opens exception

external provider opens exception

automatic resolution
```

All authoritative lifecycle mutation in P2-A is initiated by an authenticated human actor.

---

# 6. Why Human-Governed First

Current runtime has:

```text
HUMAN USER
+
ORGANIZATION MEMBERSHIP
+
ROLE
```

but does not yet have a canonical runtime:

```text
SERVICE PRINCIPAL
```

or:

```text
TRUSTED BACKGROUND SYSTEM IDENTITY
```

Therefore automation MUST NOT impersonate a human user merely to create Operational Exceptions.

---

# 7. Architecture Strategy

P2-A reuses existing:

```text
Next.js MGBOS application

PostgreSQL / Supabase

SECURITY DEFINER command functions

server actions

packages/domain

packages/validation

packages/auth

service-role server-side reads

pgTAP

Vitest

existing Organization membership
```

No new backend service is required.

---

# 8. Physical Persistence Decision

Create two authoritative physical structures:

```text
app.operational_exceptions

app.operational_exception_audit
```

Responsibilities:

```text
operational_exceptions
=
current authoritative exception state

operational_exception_audit
=
append-only lifecycle / mutation / request evidence
```

---

# 9. No Separate Event Table

P2-A MUST NOT create:

```text
operational_exception_events

outbox_events

Kafka topic

event store
```

Canonical candidate event contracts remain architecture targets only.

Audit rows are NOT automatically integration events.

---

# 10. Main Table

Physical table:

```text
app.operational_exceptions
```

Recommended columns:

| Column                       | Type          | Rule                                       |
| ---------------------------- | ------------- | ------------------------------------------ |
| `id`                         | `uuid`        | PK, generated                              |
| `organization_id`            | `uuid`        | NOT NULL, FK Organization                  |
| `brand_id`                   | `uuid`        | nullable, derived from source              |
| `order_id`                   | `uuid`        | nullable, derived from source              |
| `exception_category`         | `text`        | controlled canonical category              |
| `exception_type`             | `text`        | controlled P2-A type                       |
| `status`                     | `text`        | OPEN / ACKNOWLEDGED / RESOLVED / DISMISSED |
| `severity`                   | `text`        | LOW / MEDIUM / HIGH / CRITICAL             |
| `source_kind`                | `text`        | canonical source vocabulary                |
| `primary_resource_type`      | `text`        | governed resource vocabulary               |
| `primary_resource_id`        | `uuid`        | source identity                            |
| `summary`                    | `text`        | concise abnormality statement              |
| `business_impact`            | `text`        | why business cares                         |
| `root_cause`                 | `text`        | nullable                                   |
| `responsible_role_code`      | `text`        | logical responsible role                   |
| `responsible_user_id`        | `uuid`        | nullable active Organization member        |
| `opening_evidence`           | `jsonb`       | bounded source/evidence snapshot           |
| `other_category_reason`      | `text`        | required only for OTHER                    |
| `detected_at`                | `timestamptz` | nullable                                   |
| `opened_at`                  | `timestamptz` | NOT NULL                                   |
| `acknowledged_at`            | `timestamptz` | nullable                                   |
| `closed_at`                  | `timestamptz` | nullable                                   |
| `resolution_type`            | `text`        | nullable                                   |
| `resolution_summary`         | `text`        | nullable                                   |
| `closure_evidence`           | `jsonb`       | nullable                                   |
| `dismissal_reason`           | `text`        | nullable                                   |
| `duplicate_of_exception_id`  | `uuid`        | nullable self-FK                           |
| `superseded_by_exception_id` | `uuid`        | nullable self-FK                           |
| `current_revision`           | `bigint`      | optimistic-concurrency revision            |
| `created_at`                 | `timestamptz` | NOT NULL                                   |
| `updated_at`                 | `timestamptz` | NOT NULL                                   |

---

# 11. Canonical Categories

Database must permit only:

```text
COMMERCIAL

FINANCIAL

PRODUCTION

VENDOR

QUALITY

FULFILLMENT

INVENTORY_PROCUREMENT

DATA_INTEGRITY

AUTOMATION_IMPACT

POLICY_COMPLIANCE

OTHER
```

P2-A does not necessarily implement usable exception types for every category.

Canonical vocabulary being representable does not mean feature availability.

---

# 12. Severity Vocabulary

Only:

```text
LOW

MEDIUM

HIGH

CRITICAL
```

Severity remains independent from future Founder Attention Priority.

---

# 13. Lifecycle Vocabulary

Only:

```text
OPEN

ACKNOWLEDGED

RESOLVED

DISMISSED
```

There is no persisted:

```text
REOPENED
```

state.

Reopen returns current state to:

```text
OPEN
```

while audit preserves the reopen transition.

---

# 14. Source Vocabulary

Schema may represent canonical:

```text
DETERMINISTIC_RULE

HUMAN_REPORT

AUTOMATION_SIGNAL

EXTERNAL_SIGNAL

RECONCILIATION
```

but P2-A Open command permits only:

```text
HUMAN_REPORT

RECONCILIATION
```

Other sources require later trusted-principal implementation.

---

# 15. Resolution Vocabulary

Only:

```text
REMEDIATED

WORKAROUND

SOURCE_CORRECTED

ACCEPTED_RISK

SUPERSEDED
```

---

# 16. Dismissal Vocabulary

Only:

```text
FALSE_POSITIVE

DUPLICATE

NOT_APPLICABLE

OPENED_IN_ERROR
```

No:

```text
IGNORE

NOT_IMPORTANT

ACCEPTED_RISK
```

dismissal reason may exist.

---

# 17. Logical Responsible Roles

P2-A stores logical role identity using:

```text
OWNER

ADMIN

SALES

OPERATIONS

FINANCE

QC
```

This role represents:

```text
WHO SHOULD OWN THIS BUSINESS PROBLEM
```

and is separate from the actual membership role of the responsible principal.

Therefore this remains valid:

```text
Responsible Role
=
OPERATIONS

Responsible Principal
=
Rizky

Actual Membership Role
=
OWNER
```

---

# 18. Responsible Principal

`responsible_user_id` is optional for:

```text
OPEN
```

but must refer to an active user with active membership in the same Organization when present.

P2-A runtime should only allow OWNER / ADMIN principals to become actionable assignees because domain-scoped staff Exception permissions are deferred.

Logical responsible role may still be:

```text
SALES

OPERATIONS

FINANCE

QC
```

---

# 19. ACKNOWLEDGED Ownership Rule

An Exception cannot become:

```text
ACKNOWLEDGED
```

without:

```text
responsible_user_id
```

If an OPEN Exception has no principal and an authorized actor acknowledges it:

```text
responsible_user_id
=
acknowledging actor
```

may be established atomically.

If already assigned to another principal:

```text
different actor acknowledgement
=
REJECT
```

---

# 20. Initial Exception-Type Catalog

P2-A implements a deliberately bounded manual catalog:

```text
production.deadline_breached

vendor.commitment_problem

quality.qc_failed

fulfillment.delivery_problem

financial.receivable_past_due

financial.actual_cost_missing

financial.margin_exception

other.operational_abnormality
```

Not implemented in P2-A:

```text
automation.required_workflow_failed
```

because current automation-impact business source model is insufficient.

---

# 21. Category Mapping

Exact mapping:

```text
production.deadline_breached
→ PRODUCTION

vendor.commitment_problem
→ VENDOR

quality.qc_failed
→ QUALITY

fulfillment.delivery_problem
→ FULFILLMENT

financial.receivable_past_due
→ FINANCIAL

financial.actual_cost_missing
→ FINANCIAL

financial.margin_exception
→ FINANCIAL

other.operational_abnormality
→ OTHER
```

Category is derived by command implementation.

Caller does NOT choose category independently from type.

---

# 22. Why `vendor.no_response` Is Not Initial Type

Exact Vendor response window remains unresolved.

Therefore P2-A MUST NOT claim:

```text
vendor.no_response
```

using an invented timer.

`vendor.commitment_problem` can be opened manually when a real explicit commitment abnormality is known.

A future approved SLA may introduce:

```text
vendor.no_response
```

as deterministic type.

---

# 23. Why Margin May Be Manual Only

Current MGBOS has margin calculations.

However exact Founder-Control materiality threshold remains unresolved.

Therefore:

```text
financial.margin_exception
```

may be manually established through explicit business judgment/evidence.

P2-A MUST NOT automatically interpret an arbitrary percentage as a durable margin exception.

---

# 24. Why Actual-Cost Missing May Be Manual Only

Current system knows whether:

```text
actual_cost IS NULL
```

but does not yet have approved universal policy describing exactly when Actual Cost becomes materially overdue.

Therefore manual tracking is allowed.

Automatic opening is not.

---

# 25. Primary Resource Vocabulary

P2-A supports:

```text
ORDER

PRODUCTION_JOB

PRODUCTION_ASSIGNMENT

QC_INSPECTION

INVOICE

SHIPMENT
```

No arbitrary table names may be passed.

---

# 26. Type → Resource Mapping

Required mapping:

```text
production.deadline_breached
→ PRODUCTION_JOB

vendor.commitment_problem
→ PRODUCTION_ASSIGNMENT

quality.qc_failed
→ QC_INSPECTION

fulfillment.delivery_problem
→ SHIPMENT

financial.receivable_past_due
→ INVOICE

financial.actual_cost_missing
→ PRODUCTION_JOB

financial.margin_exception
→ ORDER
```

For:

```text
other.operational_abnormality
```

the caller may select one of the supported resource types.

---

# 27. `OTHER` Guard

When:

```text
exception_type
=
other.operational_abnormality
```

require:

```text
other_category_reason
```

explaining why the controlled existing categories/types are insufficient.

Recommended minimum:

```text
10 characters
```

Repeated `OTHER` usage is taxonomy-debt evidence.

---

# 28. Source Reference Is Not Caller-Trusted

`primary_resource_id` must be loaded from the appropriate authoritative source table.

Open command MUST verify:

```text
resource exists

resource belongs to Organization

resource type matches Exception type

derived Brand belongs to same Organization

derived Order belongs to same Organization
```

Caller-provided:

```text
brand_id

order_id

customer_id

vendor_id
```

must NOT be treated as authority.

---

# 29. Derived Relational Anchors

Open command derives:

```text
brand_id

order_id
```

where available.

Examples:

```text
PRODUCTION_JOB
→ production_jobs.brand_id
→ production_jobs.order_id

PRODUCTION_ASSIGNMENT
→ production_assignments.production_job_id
→ production_jobs.brand_id
→ production_jobs.order_id

QC_INSPECTION
→ qc_inspections.production_job_id
→ production_jobs.brand_id
→ production_jobs.order_id

INVOICE
→ invoices.brand_id
→ invoices.order_id

SHIPMENT
→ shipments.brand_id
→ shipments.order_id

ORDER
→ orders.brand_id
→ orders.id
```

---

# 30. Supporting Related Objects

P2-A does NOT introduce a generic polymorphic relationship table.

Supporting references may exist inside bounded evidence such as:

```text
vendor

customer

production job

shipment

invoice
```

but:

```text
dedup

authorization

Organization ownership

primary identity
```

MUST NOT depend on unvalidated JSON supporting references.

---

# 31. Evidence Design

`opening_evidence` must preserve enough historical facts to answer:

```text
WHY WAS THIS EXCEPTION OPENED?
```

It is NOT a clone of the source record.

---

# 32. Authoritative Source Snapshot

Open command itself builds a bounded snapshot from authoritative source state.

Examples:

### Production Job

```text
job_number
status
target_completion_date
estimated_cost
committed_cost
actual_cost
```

### Production Assignment

```text
assignment_id
status
vendor_id
vendor_name
assigned_at
accepted_at
assigned_cost
job_number
```

### QC

```text
inspection_number
result
defect_category
defect_severity
inspected_at
job_number
```

### Invoice

```text
invoice_number
status
due_date
amount_total
balance_due
order_id
```

### Shipment

```text
shipment_number
status
courier_name
tracking_number
dispatch_date
delivered_date
```

### Order

```text
order_number
status
grand_total
financial-summary fields where applicable
```

---

# 33. Supplemental Human Evidence

Caller may provide bounded:

```text
observation

human note

external reference

additional structured evidence
```

but P2-A validation must reject:

```text
secrets

credentials

unbounded payloads

full binary data
```

Recommended structured supplementary evidence maximum:

```text
16 KiB serialized JSON
```

---

# 34. Detected Time

`detected_at` may be:

```text
NULL
```

when reliable detection time is unknown.

Do not fabricate historical time.

When supplied:

```text
detected_at <= opened_at
```

must hold.

---

# 35. Business Deduplication Decision

P2-A does NOT need a stored opaque:

```text
dedup_key
```

column.

The W3 conceptual recommendation is tightened into first-class relational identity.

Active deduplication fingerprint:

```text
organization_id
+
exception_type
+
primary_resource_type
+
primary_resource_id
```

This represents:

> one active exception of one business abnormality type on one primary object inside one Organization.

---

# 36. Active-Duplicate Constraint

Create partial unique index equivalent to:

```text
UNIQUE
(
  organization_id,
  exception_type,
  primary_resource_type,
  primary_resource_id
)

WHERE status IN (
  'OPEN',
  'ACKNOWLEDGED'
)
```

This is the final P2-A physical dedup key.

---

# 37. Why Closed Rows Do Not Block New Episodes

After:

```text
RESOLVED

or

DISMISSED
```

a later independent episode may create a new Exception with the same logical type/resource identity.

Therefore uniqueness applies only to active states.

---

# 38. Reopen vs New Episode

Use:

```text
REOPEN
```

for same causal episode.

Use:

```text
NEW OPEN
```

for a genuinely new episode after normal operation was restored.

P2-A does not attempt AI classification of this distinction.

The human actor chooses the governed operation.

---

# 39. Concurrency Protection

Open command should combine:

```text
business-key advisory transaction lock

+

partial unique active index
```

Advisory-lock input should derive from:

```text
organization_id

exception_type

primary_resource_type

primary_resource_id
```

Unique index remains final database defense.

---

# 40. Optimistic Revision

Every Exception contains:

```text
current_revision
```

Initial:

```text
1
```

Every successful mutation increments revision.

All mutation commands other than Open accept:

```text
expected_revision
```

If:

```text
expected_revision
!=
current_revision
```

command fails with stale-state conflict.

---

# 41. Why Revision Exists

It protects against:

```text
two browser tabs

stale detail screen

concurrent Owner/Admin action

overwriting a reassignment

overwriting a severity change
```

without introducing a general event-sourcing architecture.

---

# 42. Command Idempotency

Every mutation command receives:

```text
request_id UUID
```

Request IDs are separate from business deduplication.

---

# 43. Audit Table

Physical table:

```text
app.operational_exception_audit
```

Recommended columns:

```text
id uuid

organization_id uuid

operational_exception_id uuid

actor_id uuid

action text

from_status text nullable

to_status text nullable

request_id uuid

request_payload jsonb

result_snapshot jsonb

details jsonb

created_at timestamptz
```

---

# 44. Command Receipt Identity

Create uniqueness:

```text
UNIQUE
(
  organization_id,
  actor_id,
  request_id
)
```

Each successful or deduplicated governed command receives one durable command/audit receipt.

---

# 45. Idempotent Retry Algorithm

Before executing a command:

```text
lookup audit receipt
by
organization + actor + request_id
```

If found:

```text
same command
+
same normalized request_payload
→ return stored result_snapshot
```

If:

```text
same request_id
+
different command/payload
→ REJECT
```

This is the P2-A strong idempotency rule.

---

# 46. Business Dedup ≠ Command Idempotency

Preserve:

```text
same request_id
=
transport / execution replay protection

same active exception fingerprint
=
business duplicate protection
```

Different request IDs can still point at one already-active business exception.

---

# 47. Deduplicated Open

If a different valid request attempts to open an already-active equivalent Exception:

```text
DO NOT CREATE SECOND EXCEPTION
```

Return existing Exception.

Record an audit/command receipt equivalent to:

```text
exception.open_deduplicated
```

including the surviving Exception ID.

---

# 48. Audit Immutability

`operational_exception_audit` must be append-only.

Database trigger should reject:

```text
UPDATE

DELETE
```

on audit rows.

---

# 49. Exception Hard Deletion

P2-A has no:

```text
delete_operational_exception
```

command.

Application role receives no DELETE path.

Historical exceptions are resolved or dismissed, not erased.

---

# 50. Database Privileges

Recommended pattern follows Production domain:

```text
RLS
=
ENABLED

public
=
NO ACCESS

anon
=
NO ACCESS

authenticated
=
NO DIRECT MUTATION

service_role
=
SELECT
+
EXECUTE GOVERNED RPC
```

Do not grant browser-side direct table mutation.

---

# 51. DB Authorization Helper

Introduce bounded helper:

```text
app.operational_exception_actor_role(
  p_organization_id uuid,
  p_actor_id uuid
)
```

It resolves active:

```text
user

membership

Organization

role
```

and fails closed when membership is invalid.

---

# 52. Runtime TypeScript Permissions

Extend:

```text
systems/mgbos/packages/auth/src/permissions.ts
```

with:

```text
operational_exceptions:read

operational_exceptions:history_read

operational_exceptions:open

operational_exceptions:acknowledge

operational_exceptions:assign

operational_exceptions:reassign

operational_exceptions:change_severity

operational_exceptions:resolve

operational_exceptions:dismiss

operational_exceptions:reopen
```

---

# 53. P2-A Role Mapping

### OWNER

Receives every P2-A permission.

### ADMIN

Receives every P2-A permission.

However:

```text
accepted-risk resolution
```

remains OWNER-only through database/business guard.

### SALES / OPERATIONS / FINANCE / QC

Receive:

```text
NO new Operational Exception runtime permission
```

during P2-A.

Domain/resource-scoped delegation is later scope.

---

# 54. Why Staff Permissions Are Deferred

Current TypeScript permission engine is role-wide.

It cannot safely express:

```text
FINANCE
may mutate finance-owned Exceptions
but not quality Exceptions
```

without additional resource-scope logic.

P2-A MUST NOT solve this by granting all staff Organization-wide exception authority.

---

# 55. Accepted Risk Guard

For:

```text
resolution_type = ACCEPTED_RISK
```

database command MUST verify:

```text
actor role = OWNER
```

independently from TypeScript permission.

ADMIN receiving:

```text
operational_exceptions:resolve
```

does not override this rule.

---

# 56. Open Command

Logical command:

```text
mgbos.operational_exception.open
```

Proposed physical RPC:

```text
app.open_operational_exception(...)
```

Inputs:

```text
organization_id

actor_id

request_id

exception_type

severity

source_kind

primary_resource_type

primary_resource_id

responsible_role_code

responsible_user_id optional

summary

business_impact

observation

root_cause optional

detected_at optional

other_category_reason optional

supplementary_evidence optional
```

Not accepted from caller:

```text
category

brand_id

order_id

opened_at

status

dedup identity

current_revision
```

Those are system-derived.

---

# 57. Open Authorization

P2-A:

```text
OWNER
ADMIN
```

only.

---

# 58. Open Validation Order

Command should approximately enforce:

```text
1. active membership

2. role authorization

3. request-id replay check

4. input vocabulary

5. P2-A source-kind availability

6. type ↔ category mapping

7. type ↔ resource mapping

8. authoritative resource lookup

9. Organization ownership

10. derive Brand / Order

11. responsible role

12. responsible principal membership

13. evidence normalization

14. active business deduplication

15. insert Exception

16. insert audit receipt

17. return result
```

All inside one database transaction.

---

# 59. Open Result

Return at minimum:

```text
exception_id

status

severity

current_revision

is_retry

is_existing_active_exception
```

---

# 60. Acknowledge Command

Physical RPC:

```text
app.acknowledge_operational_exception(...)
```

Inputs:

```text
organization_id

actor_id

request_id

exception_id

expected_revision

note optional
```

Valid state:

```text
OPEN
```

Result:

```text
ACKNOWLEDGED
```

---

# 61. Acknowledge Ownership

If no responsible principal exists:

```text
responsible_user_id = actor_id
```

If another principal is already assigned:

```text
ACKNOWLEDGE
by different actor
=
REJECT
```

---

# 62. Assign Command

Physical:

```text
app.assign_operational_exception(...)
```

Purpose:

```text
establish responsible principal
for an active previously-unassigned Exception
```

Inputs:

```text
organization_id

actor_id

request_id

exception_id

expected_revision

responsible_role_code

responsible_user_id

reason optional
```

Valid states:

```text
OPEN
```

If a principal already exists:

```text
use REASSIGN
```

---

# 63. Reassign Command

Physical:

```text
app.reassign_operational_exception(...)
```

Inputs:

```text
organization_id

actor_id

request_id

exception_id

expected_revision

new_responsible_role_code

new_responsible_user_id

reason
```

Valid states:

```text
OPEN

ACKNOWLEDGED
```

Reason required.

Reassignment does NOT automatically alter lifecycle state.

---

# 64. Reassignment Principal Availability

P2-A target principal must:

```text
belong to same Organization

have active user

have active membership

have OWNER or ADMIN runtime role
```

Logical responsible role may still differ from membership role.

---

# 65. Change Severity Command

Physical:

```text
app.change_operational_exception_severity(...)
```

Inputs:

```text
organization_id

actor_id

request_id

exception_id

expected_revision

new_severity

reason
```

Valid:

```text
OPEN

ACKNOWLEDGED
```

If new severity equals current severity:

```text
REJECT AS NO CHANGE
```

instead of creating meaningless history.

---

# 66. Resolve Command

Physical:

```text
app.resolve_operational_exception(...)
```

Inputs:

```text
organization_id

actor_id

request_id

exception_id

expected_revision

resolution_type

resolution_summary

closure_evidence

superseded_by_exception_id optional
```

Valid source states:

```text
OPEN

ACKNOWLEDGED
```

Target:

```text
RESOLVED
```

---

# 67. Resolve Rules

Required:

```text
resolution summary

resolution type

resolution evidence

actor

closed time
```

No source-domain state changes occur.

---

# 68. SUPERSEDED Rule

When:

```text
resolution_type = SUPERSEDED
```

require:

```text
superseded_by_exception_id
```

Target Exception must:

```text
exist

belong to same Organization

not equal source Exception

represent an active canonical replacement
```

---

# 69. Dismiss Command

Physical:

```text
app.dismiss_operational_exception(...)
```

Inputs:

```text
organization_id

actor_id

request_id

exception_id

expected_revision

dismissal_reason

reason_summary

closure_evidence

duplicate_of_exception_id optional
```

Valid:

```text
OPEN

ACKNOWLEDGED
```

Target:

```text
DISMISSED
```

---

# 70. DUPLICATE Dismissal

When:

```text
dismissal_reason = DUPLICATE
```

require:

```text
duplicate_of_exception_id
```

Target must:

```text
exist

belong to same Organization

not be same Exception

normally remain the surviving canonical record
```

---

# 71. Reopen Command

Physical:

```text
app.reopen_operational_exception(...)
```

Inputs:

```text
organization_id

actor_id

request_id

exception_id

expected_revision

reason

supporting_evidence
```

Valid source:

```text
RESOLVED

DISMISSED
```

Target:

```text
OPEN
```

---

# 72. Reopen Projection Reset

Current-row closure projection should be cleared:

```text
resolution_type

resolution_summary

closure_evidence

dismissal_reason

duplicate_of_exception_id

superseded_by_exception_id

closed_at

acknowledged_at
```

Historical closure remains preserved in audit.

---

# 73. Reopen Responsibility

Reopen SHOULD retain:

```text
responsible_role_code

responsible_user_id
```

unless a later explicit assignment/reassignment changes them.

This preserves continuity of the same episode.

Status returns to:

```text
OPEN
```

because the renewed abnormality has not yet been acknowledged in its reopened cycle.

---

# 74. Reopen Dedup Guard

Before reopening, verify no other active Exception already owns the same active business fingerprint.

If one exists:

```text
REOPEN
=
REJECT
```

rather than violating active uniqueness.

---

# 75. Current Revision Mutation

Every successful:

```text
ACKNOWLEDGE

ASSIGN

REASSIGN

CHANGE SEVERITY

RESOLVE

DISMISS

REOPEN
```

does:

```text
current_revision
=
current_revision + 1
```

and updates:

```text
updated_at
```

---

# 76. Audit Actions

P2-A audit vocabulary should include:

```text
exception.opened

exception.open_deduplicated

exception.acknowledged

exception.assigned

exception.reassigned

exception.severity_changed

exception.resolved

exception.dismissed

exception.reopened
```

Audit vocabulary is internal evidence.

It is NOT automatically the canonical integration-event vocabulary.

---

# 77. Audit Details

Each audit row should preserve relevant differences.

Examples:

### Severity

```text
previous_severity

new_severity

reason
```

### Reassignment

```text
previous_role

previous_user

new_role

new_user

reason
```

### Resolution

```text
resolution_type

resolution_summary

closure_evidence
```

### Reopen

```text
prior_status

prior_closure_type

reason

supporting_evidence
```

---

# 78. Conditional Database Integrity

Main table should enforce coherent current state.

### OPEN

Required:

```text
closed_at IS NULL

resolution_type IS NULL

dismissal_reason IS NULL
```

### ACKNOWLEDGED

Required:

```text
responsible_user_id IS NOT NULL

acknowledged_at IS NOT NULL

closed_at IS NULL
```

### RESOLVED

Required:

```text
closed_at IS NOT NULL

resolution_type IS NOT NULL

resolution_summary IS NOT NULL

dismissal_reason IS NULL
```

### DISMISSED

Required:

```text
closed_at IS NOT NULL

dismissal_reason IS NOT NULL

resolution_type IS NULL
```

---

# 79. Closure Reference Integrity

Require:

```text
resolution_type = SUPERSEDED
→ superseded_by_exception_id IS NOT NULL

dismissal_reason = DUPLICATE
→ duplicate_of_exception_id IS NOT NULL
```

And inversely:

```text
non-SUPERSEDED resolution
→ superseded_by_exception_id IS NULL

non-DUPLICATE dismissal
→ duplicate_of_exception_id IS NULL
```

---

# 80. Self-Reference Guard

Database must reject:

```text
duplicate_of_exception_id = id

superseded_by_exception_id = id
```

Command validates same-Organization target.

---

# 81. Recommended Indexes

At minimum:

```text
active dedup partial unique index

organization + status + opened_at DESC

organization + severity + status

organization + brand_id + status + opened_at DESC

organization + order_id + status

organization + primary_resource_type + primary_resource_id

responsible_user_id + status

audit exception_id + created_at ASC

audit unique organization + actor + request_id
```

---

# 82. Migration File

At current baseline, planned migration:

```text
systems/mgbos/supabase/migrations/
20261006000000_operational_exception_foundation.sql
```

Implementation Contract MUST re-check latest migration before execution.

If another migration already occupies or supersedes that chronological slot:

```text
STOP
```

and allocate the next monotonic migration name.

Never edit previously applied migration history.

---

# 83. Database Test File

Planned:

```text
systems/mgbos/supabase/tests/
operational_exceptions.test.sql
```

---

# 84. Domain Package

New:

```text
systems/mgbos/packages/domain/src/
operationalException.ts
```

Update:

```text
systems/mgbos/packages/domain/src/index.ts
```

Domain module owns pure vocabulary and lifecycle validation.

---

# 85. Domain Constants

Domain should export:

```text
OPERATIONAL_EXCEPTION_CATEGORIES

OPERATIONAL_EXCEPTION_TYPES

OPERATIONAL_EXCEPTION_STATUSES

OPERATIONAL_EXCEPTION_SEVERITIES

OPERATIONAL_EXCEPTION_SOURCE_KINDS

OPERATIONAL_EXCEPTION_RESOLUTION_TYPES

OPERATIONAL_EXCEPTION_DISMISSAL_REASONS

OPERATIONAL_EXCEPTION_RESOURCE_TYPES

RESPONSIBLE_ROLE_CODES
```

---

# 86. Pure Domain Functions

Expected examples:

```text
validateOperationalExceptionTransition()

canChangeOperationalExceptionSeverity()

requiresOwnerForResolution()

requiresDuplicateTarget()

requiresSupersededTarget()

getOperationalExceptionCategoryForType()

getRequiredPrimaryResourceType()

isOperationalExceptionActive()
```

Pure functions MUST NOT query database.

---

# 87. Domain Tests

New:

```text
systems/mgbos/packages/domain/src/
operationalException.test.ts
```

Cover canonical transition matrix and helper behavior.

---

# 88. Validation Package

New:

```text
systems/mgbos/packages/validation/src/
operationalException.ts
```

Update:

```text
systems/mgbos/packages/validation/src/index.ts
```

---

# 89. Server Validation Contracts

Validation schemas:

```text
openOperationalExceptionSchema

acknowledgeOperationalExceptionSchema

assignOperationalExceptionSchema

reassignOperationalExceptionSchema

changeOperationalExceptionSeveritySchema

resolveOperationalExceptionSchema

dismissOperationalExceptionSchema

reopenOperationalExceptionSchema
```

---

# 90. Recommended Text Bounds

At minimum:

```text
summary:
5–240

business impact:
5–2000

human observation:
5–4000

root cause:
max 2000

reason:
5–2000

resolution summary:
5–2000

OTHER category reason:
10–1000
```

Exact bounds become part of Implementation Contract.

---

# 91. Validation Tests

New:

```text
systems/mgbos/packages/validation/src/
operationalException.test.ts
```

Must include negative payload tests.

---

# 92. Authorization Package

Modify:

```text
systems/mgbos/packages/auth/src/permissions.ts
```

New focused test:

```text
systems/mgbos/packages/auth/src/
operational-exception-permissions.test.ts
```

---

# 93. Generated Database Types

After migration:

```text
pnpm db:types
```

must update:

```text
systems/mgbos/packages/database/generated/database.types.ts
```

Generated output must not be manually approximated.

---

# 94. Application Route

Create:

```text
systems/mgbos/apps/mgbos/src/app/(app)/exceptions/
```

Suggested structure:

```text
page.tsx

data.ts

actions.ts

ExceptionCreateForm.tsx

[exceptionId]/
  page.tsx

ExceptionActionPanel.tsx
```

Component splitting may be adjusted by Builder if semantically equivalent and scope remains bounded.

---

# 95. Exception Context

`data.ts` should implement a server-only context similar to current domains:

```text
requireAuth()

assert operational_exceptions:read

resolve database endpoint

service-role server credential

Organization filter
```

---

# 96. List Page

Initial list should expose:

```text
type

category

severity

status

summary

business context

responsible role

responsible principal

opened time
```

with deterministic ordering:

```text
active before closed

CRITICAL → HIGH → MEDIUM → LOW

opened_at DESC
```

This ordering is Exception-console ordering.

It is NOT Founder Attention priority.

---

# 97. List Scope

Exception Console may use:

```text
active Brand context
```

consistent with current MGBOS operational pages.

This does NOT decide future Founder Home default scope.

Organization isolation remains mandatory.

---

# 98. Detail Page

Detail page should show:

```text
stable Exception identity

status

severity

type

business impact

primary resource

source evidence

responsible role

responsible principal

root cause

resolution/dismissal projection

complete audit history
```

---

# 99. Manual Open UI

P2-A requires a human-usable Open flow.

Do NOT require founder to manually copy raw UUIDs.

Open UI should provide bounded candidate resource options for the selected Exception type.

---

# 100. Resource Candidate Queries

For active Brand, load bounded candidates such as:

```text
recent/current Production Jobs

active Production Assignments

QC REWORK / REJECTED inspections

active/relevant Shipments

outstanding Invoices

active Orders
```

Recommended query limit:

```text
100 per resource family
```

for pilot-scale data.

Candidate availability is a selection aid.

It is NOT automatic abnormality detection.

---

# 101. Human Labels

Resource options should display human-readable identity:

```text
TS-J-...

TS-QC-...

TS-INV-...

TS-O-...

shipment number

vendor name

customer/order context
```

while submitting authoritative UUID internally.

---

# 102. Lifecycle Actions UI

Detail page should expose only actions allowed by:

```text
current status

TypeScript permission

business restrictions
```

Client-side visibility is convenience only.

Server action + database command remain authoritative.

---

# 103. Accepted Risk UI

For ADMIN:

```text
ACCEPTED_RISK
```

should not be offered as an available resolution choice.

Even if UI error exposes it:

```text
database command
MUST REJECT
```

---

# 104. Sidebar

Modify:

```text
systems/mgbos/apps/mgbos/src/app/(app)/layout.tsx
```

Add:

```text
Operational Exceptions
```

navigation only when:

```text
operational_exceptions:read
```

is granted.

---

# 105. Dashboard Boundary

P2-A MUST NOT convert `/dashboard` into Founder Home.

Dashboard work is P2-B.

This keeps P2-A focused on establishing durable Exception truth first.

---

# 106. Server Actions

Expected actions:

```text
openOperationalExceptionAction

acknowledgeOperationalExceptionAction

assignOperationalExceptionAction

reassignOperationalExceptionAction

changeOperationalExceptionSeverityAction

resolveOperationalExceptionAction

dismissOperationalExceptionAction

reopenOperationalExceptionAction
```

---

# 107. Server Action Pipeline

Each action:

```text
authenticate

check TypeScript permission

validate Zod input

call database RPC

handle database rejection

revalidate list/detail paths

return structured result
```

No direct update through PostgREST.

---

# 108. Request ID Ownership

UI submission should create one:

```text
requestId
```

for a logical command attempt and preserve it across retry of that attempt.

Do NOT create a new idempotency key merely because a network response was uncertain.

---

# 109. Error Semantics

At minimum distinguish:

```text
UNAUTHORIZED

NOT_FOUND

CROSS_ORG

INVALID_STATE

STALE_REVISION

IDEMPOTENCY_CONFLICT

BUSINESS_DUPLICATE

INVALID_RESOURCE

VALIDATION_ERROR

UNKNOWN_FAILURE
```

Exact transport representation may remain current MGBOS error style in P2-A.

Do not introduce a generic error framework solely for this slice.

---

# 110. No Source-Domain Mutation

No P2-A command may invoke:

```text
transition_order_status

transition_production_job_status

record_qc_inspection

issue_invoice

record_payment

dispatch_shipment

mark_shipment_delivered
```

or equivalent source mutation.

Operational Exception commands own Exception state only.

---

# 111. P2-A Work Breakdown

Bounded implementation sequence and current status:

```text
P2A-WP01
Database + domain foundation
= COMPLETE / MERGED / POST-MERGE VERIFIED (PR #42)

P2A-WP02
Validation + authorization + server command path
= COMPLETE / MERGED / POST-MERGE VERIFIED (PR #44)

P2A-WP03
Operational Exception console UI
= COMPLETE / MERGED / POST-MERGE VERIFIED (PR #46 @ 23d4fd3d184d5bf60c9d41e57a1c01fe3517c132)

P2A-WP04
Integrated verification + documentation reflection
= COMPLETE / MERGED / POST-MERGE VERIFIED (PR #48 @ 77fbcbf08f2699ab85a0682ec4c981235c9c18cf)
```

All four P2-A work packages are completed and post-merge verified. Active work package is currently NONE. Implementation authorization is NONE.

---

# 112. P2A-WP01 — Database + Domain Foundation

Scope:

```text
migration

tables

constraints

indexes

audit immutability

RPC functions

domain module

domain tests

database pgTAP

generated DB types
```

No application UI required.

---

# 113. WP01 Acceptance

WP01 must prove:

```text
schema replay succeeds

Organization isolation enforced

valid state transitions work

invalid transitions fail

Owner accepted-risk rule works

dedup works

idempotent command replay works

request payload conflict fails

stale revision fails

history is append-only

hard delete unavailable

source resource validation works

cross-Organization resource fails

source-domain state remains unchanged
```

---

# 114. P2A-WP02 — Runtime Command Boundary

Status:

```text
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #44 @ b8262cca87a7d2644cf1738bf54fe72e8c4545f1)
```

Scope:

```text
validation schemas

auth permissions

auth tests

server-only data context

server actions

error handling

focused integration tests
```

No Founder Home work.

WP02 delivered and verified:

- Strict Zod command validation schemas for all eight Operational Exception lifecycle commands in `@mgbos/validation` (`systems/mgbos/packages/validation/src/operationalException.ts`), verified by unit tests in `systems/mgbos/packages/validation/src/operationalException.test.ts`;
- 10 authoritative RBAC permissions registered in `@mgbos/auth` (`systems/mgbos/packages/auth/src/permissions.ts`), granting authority to active `OWNER` and `ADMIN` roles while denying staff roles (`SALES`, `OPERATIONS`, `FINANCE`, `QC`), verified by regression tests in `systems/mgbos/packages/auth/src/operational-exception-permissions.test.ts`;
- Server-only authenticated action context and Organization-scoped read queries in `apps/mgbos` (`systems/mgbos/apps/mgbos/src/app/(app)/exceptions/data.ts`), containing `exceptionsContext`, `listOperationalExceptions`, `getOperationalException`, and `getOperationalExceptionHistory`, deriving read models directly from `@mgbos/database` while keeping the PostgREST read primitive private;
- 8 governed application server actions in `apps/mgbos` (`systems/mgbos/apps/mgbos/src/app/(app)/exceptions/actions.ts`), executing WP01 RPC endpoints with session-derived actor and Organization identity, requestId and expectedRevision preservation, path revalidation, and zero direct table mutations;
- Next.js framework redirect control flow preservation handled directly within `systems/mgbos/apps/mgbos/src/app/(app)/exceptions/actions.ts` via `unstable_rethrow`, ensuring authentication redirects are never caught as application failures;
- Application-boundary test suite in `systems/mgbos/scripts/operational-exception-command-boundary.test.ts` with 32 focused tests covering validation rejections, permission gates, RPC payload mappings, idempotency handling, redirect rethrowing, target principal error classification, and read boundary isolation.

Follow-up note resolved by WP03:

```text
RESOLVED BY WP03:
Public UI-facing read queries in `exceptions/data.ts` construct trusted context internally with active session verification and service-role derivation (`exceptionsContext`), and no mutable exported context holder or test seam remains.
```

---

# 115. P2A-WP03 — Exception Console

Status:

```text
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #46 @ 23d4fd3d184d5bf60c9d41e57a1c01fe3517c132)
```

Scope:

```text
exception list
manual-open form
resource candidate selector
detail page
history display
lifecycle action UI
sidebar navigation
```

WP03 delivered and verified:

- Dedicated operator list console at `/exceptions` with Organization-scoped filtering, triage tabs, and manual-open trigger;
- Manual-open modal form with compile-time payload conformance to @mgbos/validation input types, while authoritative runtime Zod validation remains enforced by the existing WP02 server-action boundary;
- Bounded resource candidate selector covering `PRODUCTION_JOB`, `PRODUCTION_ASSIGNMENT`, `QC_INSPECTION`, `INVOICE`, `ORDER`, and `SHIPMENT`, filtered server-side by active Brand (`resolveActiveBrandId`, `limit = 100`) and failing closed (`[]`) if the active Brand cannot be resolved;
- Same-Organization active member selector for assignment;
- Exception detail page at `/exceptions/[exceptionId]` rendering severity, lifecycle status, entity target link, assignee, timestamps, immutable observation card, and append-only audit history timeline;
- Governed human lifecycle action dialogs: Acknowledge, Assign, Reassign, Change Severity, Resolve, Dismiss, Reopen, with OWNER-only Accepted Risk presentation and bounded candidate selection for `SUPERSEDED` (active only) and `DUPLICATE` (all same-org);
- Stable client-generated `requestId` propagation, optimistic `expectedRevision` verification, and bounded operator-facing error classification without leaking database traces;
- Permission-gated sidebar navigation via `canReadOperationalExceptions`;
- Amendment A1: Synchronous helper `classifyDatabaseError` inside top-level `'use server'` module unexported to satisfy Next.js production build without changing command semantics;
- Integration revision `23d4fd3d184d5bf60c9d41e57a1c01fe3517c132` (PR #46).

---

# 116. P2A-WP04 — Assurance & Reflection

Status:

```text
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #48 @ 77fbcbf08f2699ab85a0682ec4c981235c9c18cf)
```

Scope Executed & Verified:

```text
full regression: format, lint, lint:sql, typecheck (11 pkgs), full Vitest (66 files / 535 tests passed, 5 skipped)
DB replay: disposable local Supabase reset, 28 pgTAP files / 578 tests passed (integrated with SEC-01 baseline)
type generation: determinism confirmed (database.types.ts unchanged)
migration upgrade rehearsal: forward migration from prior Phase 1 schema on isolated clone
concurrency race: 20-request concurrent open proving active deduplication, 1 active row, 20 audit receipts
lifecycle assurance: trusted service-role RPC lifecycle with database actor-role enforcement
source-domain independence: verified on Order and Production Job
security tests: direct mutation denial, anon RPC denial (42501), staff denial, cross-tenant denial
application build & smoke: Next.js production builds and HTTP smoke (:3101 & :3102)
documentation state reflection: completed and verified
```

Residual Evidence Limitation:

WP04 verified trusted service-role RPC lifecycle execution and database actor-role enforcement. Durable hosted browser → GoTrue authenticated session → Next.js operator journey E2E remains to be established prior to real operational pilot or production readiness.

PR #48 was independently audited, merged, and post-merge verified at `77fbcbf08f2699ab85a0682ec4c981235c9c18cf`.

---

# 117. Database Verification Scenarios

Mandatory scenarios include:

```text
open valid exception

duplicate open suppressed

cross-Organization source rejected

invalid Exception type rejected

wrong resource type rejected

unsupported source_kind rejected

acknowledge valid

acknowledge wrong principal rejected

assign valid

reassign valid

severity change valid

severity no-op rejected

resolve valid

ADMIN accepted-risk rejected

OWNER accepted-risk allowed

dismiss false positive

dismiss duplicate with surviving target

resolve superseded with target

reopen resolved

reopen dismissed

reopen blocked by another active duplicate

history cannot update

history cannot delete
```

---

# 118. Authorization Tests

TypeScript tests must prove:

```text
OWNER
→ all P2-A permissions

ADMIN
→ all P2-A ordinary permissions

SALES
→ none

OPERATIONS
→ none

FINANCE
→ none

QC
→ none
```

This is explicitly P2-A runtime mapping, not the final canonical delegation model.

---

# 119. Database Negative Authorization

Database tests must independently prove:

```text
no membership
→ rejected

inactive membership
→ rejected

inactive user
→ rejected

wrong Organization
→ rejected

SALES
→ rejected

OPERATIONS
→ rejected

FINANCE
→ rejected

QC
→ rejected
```

for mutation RPCs.

---

# 120. Same-Organization Principal Test

Assignment to a user outside the owning Organization must fail.

Assignment to inactive member must fail.

---

# 121. Logical Role / Membership Role Test

Explicitly prove:

```text
Owner membership

assigned as logical:
OPERATIONS

responsible principal:
same Owner user
```

is valid.

This protects solo-founder semantics.

---

# 122. Business-Dedup Tests

Mandatory:

```text
same Organization
+
same type
+
same resource
+
active
→ one Exception
```

but:

```text
same type/resource
+
prior RESOLVED
+
new independent Open
→ new Exception allowed
```

---

# 123. Reopen Identity Test

Explicit Reopen after Resolution must:

```text
retain same Exception ID

increment revision

return status OPEN

preserve previous resolution in audit
```

---

# 124. Idempotency Tests

For every command family where practical:

```text
same request_id
+
same normalized payload
→ same result / no duplicate effect
```

and:

```text
same request_id
+
different payload
→ conflict
```

---

# 125. Concurrency Test

At minimum verify active partial uniqueness under concurrent/open race.

Preferred assurance:

```text
two independent attempts

same business fingerprint

different request IDs

→ maximum one active Exception row
```

If pgTAP cannot exercise true concurrency adequately, add a bounded local integration test.

Do not weaken the database unique guard.

---

# 126. Source-Domain Independence Tests

Example:

```text
resolve fulfillment.delivery_problem
```

must not modify Shipment.

Example:

```text
resolve financial.receivable_past_due
```

must not modify Invoice balance/status.

Example:

```text
dismiss quality.qc_failed
```

must not alter QC inspection.

---

# 127. History Tests

History must preserve:

```text
original open evidence

acknowledgement

assignment

reassignment

severity history

resolution/dismissal

reopen

actor

request ID

time
```

---

# 128. Migration Verification

Applicable verification:

```text
clean db reset

upgrade from previous schema

constraint verification

function grant verification

RLS verification

generated types

pgTAP
```

Applied migration history must remain immutable.

---

# 129. Required Commands During Verification

Expected applicable checks:

```text
pnpm format:check

pnpm lint

pnpm lint:sql

pnpm typecheck

pnpm test

pnpm build

pnpm db:reset

pnpm db:test
```

plus repository-required CI gates.

---

# 130. Repository Required Checks

Current protected `main` requires:

```text
application

database

pr-gate

agent-governance

migration-immutability

repository-integrity
```

A candidate PR cannot be accepted merely because local tests pass.

---

# 131. P2-A Non-Goals

Explicitly forbidden from this slice:

```text
Founder Attention implementation

Founder Home implementation

attention priority calculation

Attention persistence

evaluation coverage

automatic exception detectors

automatic resolution

service principal

JARVIS mutation

n8n mutation

webhook mutation

outbox

Kafka

event bus

generic task management

generic workflow engine

generic alert system

generic IAM rewrite

generic ABAC engine

role-specific operator queue

outbound notification

production deployment

real pilot execution
```

---

# 132. Forbidden Architecture Expansion

Builder MUST NOT:

```text
create microservice

create second database

introduce queue infrastructure

replace existing auth system

change canonical lifecycle

invent commercial SLA

invent margin threshold

invent Vendor response duration

modify source-domain business semantics
```

---

# 133. Exact Initial File Impact

Expected new/modified implementation files include:

```text
systems/mgbos/supabase/migrations/
20261006000000_operational_exception_foundation.sql

systems/mgbos/supabase/tests/
operational_exceptions.test.sql

systems/mgbos/packages/domain/src/
operationalException.ts

systems/mgbos/packages/domain/src/
operationalException.test.ts

systems/mgbos/packages/domain/src/index.ts

systems/mgbos/packages/validation/src/
operationalException.ts

systems/mgbos/packages/validation/src/
operationalException.test.ts

systems/mgbos/packages/validation/src/index.ts

systems/mgbos/packages/auth/src/
permissions.ts

systems/mgbos/packages/auth/src/
operational-exception-permissions.test.ts

systems/mgbos/packages/database/generated/
database.types.ts

systems/mgbos/apps/mgbos/src/app/(app)/exceptions/
...

systems/mgbos/apps/mgbos/src/app/(app)/layout.tsx
```

Exact file allowlist will be frozen by Implementation Contract / Work Package.

---

# 134. Files That Should Not Change

Absent an explicit discovered blocker, P2-A should NOT require edits to:

```text
payment migration history

invoice migration history

order migration history

production migration history

shipment migration history

canonical architecture v1.1

Founder Attention product spec

TeeStock storefront app

JARVIS

n8n integration

events runtime
```

---

# 135. Documentation Impact — Phase Entry Gate Satisfied

The Phase 2 implementation directory:

```text
systems/mgbos/docs/implementation/
phase-2-founder-control/
```

was previously governed by the gate that it must not be created before implementation execution actually opened.

With WP-P2A-01 merged and post-merge verified, that creation gate is satisfied:

```text
phase-2-founder-control/
=
CREATED

reason
=
WP-P2A-01 landed and Phase 2 bounded implementation began
```

Expected future documentation artifacts across Phase 2 may optionally include:

```text
README.md (created as navigation index)

current-founder-control-audit.md

founder-control-implementation-plan.md

backlog.md

synthetic-scenarios.md

operator-acceptance-test.md

completion-report.md
```

These support artifacts remain optional future additions; only create files genuinely required as Phase 2 progresses.

---

# 136. Phase 2 Execution Status

Phase 2 implementation status:

```text
PHASE 2 BOUNDED IMPLEMENTATION
=
IN PROGRESS (BOUNDED TO AUTHORIZED WORK PACKAGES ONLY)

WP-P2A-01
=
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #42)

WP-P2A-02
=
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #44)

WP-P2A-03
=
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #46)

WP-P2A-04
=
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #48 @ 77fbcbf08f2699ab85a0682ec4c981235c9c18cf)

P2-A
=
SOFTWARE COMPLETE (INTEGRATION LAYER)

ACTIVE WORK PACKAGE
=
NONE

NEXT WORK PACKAGE CANDIDATE
=
P2-B FOUNDER ATTENTION PLANNING (NOT AUTHORIZED FOR BUILDER)
```

Presence of this technical plan provides technical direction. It does NOT authorize blanket implementation. Each work package requires its own governed contract and approval.

---

# 137. Implementation Contract Gate (Historical for WP01–WP04 — Satisfied)

Pre-WP01 through Pre-WP04 Gate Status:

```text
SATISFIED (IC-MGBOS-P2A-WP01, IC-MGBOS-P2A-WP02 & IC-MGBOS-P2A-WP03 PROMOTED, EXECUTED, & CLOSED; WP04 EXECUTION/CONTRACT GATE SUFFICIENT FOR GOVERNED EXECUTION; WP-P2A-04 COMPLETE / MERGED / POST-MERGE VERIFIED IN PR #48)
```

Before Builder receives code authority, Head Engineering must produce a schema-valid:

```text
Implementation Contract
```

containing at least:

```text
exact base revision

objective

exact scope

routing

R4 risk

canonical sources

invariants

acceptance criteria

planned checks

stop conditions

work-package IDs
```

This gate was satisfied for WP01 through WP04. It remains mandatory for subsequent programs and work packages (P2-B).

---

# 138. Work Package Gate (Historical for WP01, WP02, WP03 & WP04 — Satisfied)

Pre-WP01 through Pre-WP04 Gate Status:

```text
SATISFIED (WP-P2A-01 COMPLETED & MERGED IN PR #42; WP-P2A-02 COMPLETED & MERGED IN PR #44; WP-P2A-03 COMPLETED & MERGED IN PR #46; WP-P2A-04 COMPLETED & MERGED IN PR #48)
```

After the Implementation Contract is accepted, produce one bounded work package first.

Do NOT send Antigravity the whole P2-A program at once.

---

# 139. Initial Builder Package Recommendation (Completed)

Status:

```text
COMPLETE / MERGED / POST-MERGE VERIFIED (PR #42)
```

First Builder work was:

```text
P2A-WP01
DATABASE + DOMAIN FOUNDATION
```

Reason:

```text
durable truth first

UI later

no automation

smaller assurance surface

schema/lifecycle verified before application dependency
```

---

# 140. P2A-WP01 Stop Conditions (Historical / Executed)

Status:

```text
EXECUTED WITHOUT STOP CONDITION VIOLATION; CLOSED
```

Pre-WP01 stop conditions were defined as:

```text
main no longer matches accepted base revision

migration filename conflicts

canonical architecture changed

requested type requires unresolved business policy

implementation needs automatic detector

implementation needs service principal

implementation needs source-domain mutation

implementation needs new role

implementation needs generic authorization engine

same-Organization validation cannot be preserved

active dedup cannot be represented safely

accepted-risk Owner-only authority cannot be enforced

existing migration would need modification

tests expose pre-existing conflicting invariant

scope expands into Founder Attention

production credentials become necessary
```

---

# 141. No Silent Scope Repair

If implementation exposes adjacent issue such as:

```text
invoice overdue state drift

service-role architecture weakness

generic idempotency inconsistency

staff capability gap
```

Builder may report it.

Builder must NOT automatically fix it unless required for P2A-WP01 correctness.

---

# 142. P2-A Completion Gate

Gate Status:

```text
SATISFIED (SOFTWARE COMPLETE AT GOVERNED INTEGRATION LAYER)
```

P2-A software-completion criteria satisfied:

```text
database foundation verified (WP01, PR #42)

all lifecycle commands verified (WP01, WP02, WP03, WP04)

all negative transitions verified (WP01, WP04)

Owner accepted-risk rule verified (WP01, WP02, WP03, WP04)

Organization isolation verified (WP01, WP02, WP04)

business dedup verified (WP01, WP04)

idempotency verified (WP01, WP02, WP04)

stale-revision behavior verified (WP01, WP02, WP03, WP04)

audit immutability verified (WP01, WP04)

source-domain independence verified (WP01, WP04)

application lifecycle console verified (WP03, PR #46)

required CI green (PR #42, PR #44, PR #46, PR #48)

candidate PR independently audited (PR #48)

merged revision post-merge verified (77fbcbf08f2699ab85a0682ec4c981235c9c18cf)
```

---

# 143. What P2-A Completion Does Not Mean

P2-A completion does NOT certify:

```text
Founder Control complete

Founder Home complete

Founder Attention complete

automatic detection complete

JARVIS complete

real pilot ready

production ready

operational readiness complete
```

---

# 144. P2-B Dependency

Only after P2-A provides trustworthy Operational Exception facts should P2-B implement:

```text
Organization timezone in SessionContext

Founder Attention evaluator

Evaluation Coverage

Exception projection

source-derived transient attention

pricing approval attention

Founder Home
```

---

# 145. P2-C Dependency

Only after P2-A/P2-B and required business policies should engineering evaluate:

```text
trusted service principal

scheduled detector

automatic Open

automatic deterministic Resolve
```

---

# 146. Risk Classification

P2-A engineering risk:

```text
R4
```

Reason:

```text
authorization change

new authoritative mutable entity

database migration

Organization-sensitive data

durable operational lifecycle

historical integrity
```

P2-A does not directly mutate money or production source state, therefore current plan does not default to R5.

Risk must be reclassified if scope changes.

---

# 147. Assurance Direction

R4 assurance should include independent review of:

```text
authorization

Organization isolation

schema constraints

migration

state transitions

idempotency

deduplication

historical integrity

negative paths

source-domain isolation

test completeness
```

Head Engineering must audit the exact PR rather than rely on Builder summary.

---

# 148. Owner Decisions Required Now

P2-A deliberately avoids unresolved commercial-policy decisions.

No Vendor SLA, margin threshold, Due-Soon window, or automation authority decision was required to build the manual Exception foundation.

With P2-A software complete, commercial policies for attention derivation (P2-B) and automated detection (P2-C) will be evaluated during subsequent program planning under governed authority.

---

# 149. Next Program Governance Boundary

With P2-A work packages completed and post-merge verified, the governance boundary transitions to P2-B:

```text
TECHNICAL PLAN (ACTIVE v1.4)
        ↓
WP-P2A-01 (COMPLETE / MERGED / POST-MERGE VERIFIED)
        ↓
WP-P2A-02 (COMPLETE / MERGED / POST-MERGE VERIFIED)
        ↓
WP-P2A-03 (COMPLETE / MERGED / POST-MERGE VERIFIED)
        ↓
WP-P2A-04 (COMPLETE / MERGED / POST-MERGE VERIFIED)
        ↓
P2-A SOFTWARE COMPLETION GATE (SATISFIED)
        ↓
P2-B FOUNDER ATTENTION PLANNING & TECHNICAL DESIGN
(HEAD ENGINEERING / NO BUILDER IMPLEMENTATION AUTHORIZED)
```

---

# 150. Recommended Next Artifact

Immediate next Head Engineering artifact:

```text
P2-B FOUNDER ATTENTION
TECHNICAL SPECIFICATION / IMPLEMENTATION PLANNING
```

The future P2-B planning candidate will bind:

```text
main@77fbcbf08f2699ab85a0682ec4c981235c9c18cf
```

unless repository state changes before authoring. Builder has no active implementation authorization.

---

# 151. Final Technical Decision

P2-A architecture is:

```text
EXISTING MGBOS
        ↓
POSTGRESQL OPERATIONAL EXCEPTION
        +
APPEND-ONLY AUDIT
        ↓
GOVERNED HUMAN COMMANDS
        ↓
OWNER / ADMIN INITIAL AUTHORITY
        ↓
MINIMAL EXCEPTION CONSOLE
```

Not:

```text
AI ALERT PLATFORM

GENERIC TASK SYSTEM

EVENT-SOURCED PLATFORM

AUTOMATIC DETECTOR ENGINE
```

---

# 152. Final Principle

> **First make abnormal business truth durable, isolated, auditable, deduplicated, and governable. Then derive founder attention from it.**

And:

> **P2-A must create one trustworthy operational control capability—not a second ERP, a generic workflow platform, or an AI automation layer.**
