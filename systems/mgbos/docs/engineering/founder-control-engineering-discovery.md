---
canonical_id: mgbos.engineering.founder-control-engineering-discovery
status: DRAFT
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
scope: mgbos-founder-control-engineering-discovery
document_class: engineering-discovery
prepared_at: 2026-10-06

repository_baseline:
  repository: Rizkybuilds/bisnishub
  branch: main
  commit: 88a8a28f1b64a624717a8e03038c63f4520f8978
  tree: 98572c0186f08ec92d53290ec464c4a88f123bcc

program:
  workstream: W3_ENGINEERING_DISCOVERY
  w2_status: POST_MERGE_VERIFIED
  engineering_discovery_status: ANALYSIS_COMPLETE
  active_implementation_phase: NONE
  phase_2: NOT_OPEN
  pilot_execution: BLOCKED

authoritative_for:
  - W3 repository-grounded engineering discovery findings
  - current Founder Control implementation-gap inventory
  - recommended physical-design direction
  - reusable implementation-pattern inventory
  - detector source-readiness classification
  - Founder Attention physical read-model recommendation
  - engineering risk classification direction
  - verification-design direction
  - recommended Phase 2 sequencing

not_authoritative_for:
  - Founder Control product semantics
  - MGBOS canonical entity semantics
  - MGBOS canonical lifecycle semantics
  - business materiality thresholds
  - commercial SLA values
  - production readiness
  - implementation authorization
  - Phase 2 execution authority
  - deployment authority

depends_on:
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
  - founder-control-architecture-reconciliation-audit.md
  - operational-readiness.md
---

# MGBOS Founder Control Engineering Discovery — W3 v1.0

## 1. Purpose

Dokumen ini merekam W3 Engineering Discovery Founder Control berdasarkan inspeksi langsung terhadap current repository:

```text
Rizkybuilds/bisnishub
main@88a8a28f1b64a624717a8e03038c63f4520f8978
```

W3 menjawab:

```text
Apa yang sudah benar-benar ada?

Apa yang belum ada?

Pola implementasi mana yang dapat digunakan ulang?

Physical model apa yang paling kecil tetapi benar?

Apa yang dapat dideteksi deterministically?

Apa yang masih membutuhkan business policy?

Apa risiko engineering-nya?

Bagaimana sebaiknya Phase 2 dipecah?

Apa yang TIDAK perlu dibangun?
```

W3 tidak memberi Builder authority.

---

# 2. Discovery Method

Discovery memeriksa current:

```text
Supabase migrations

PostgreSQL schema

PostgreSQL functions / RPC

RLS / grants

audit patterns

MGBOS domain package

MGBOS authorization package

generated database types

Next.js MGBOS application

server actions

server-side query paths

Founder Command Center

Phase 1 database tests

authorization unit tests

Founder Control D1–D4

six canonical architecture specifications v1.1
```

Historical reports tidak digunakan sebagai pengganti current source.

---

# 3. Executive Finding

Founder Control **tidak membutuhkan arsitektur platform baru**.

Current architecture sudah menyediakan fondasi yang cukup:

```text
NEXT.JS MODULAR MONOLITH

+

POSTGRESQL / SUPABASE

+

SERVER ACTIONS

+

GOVERNED POSTGRES RPC

+

ROLE / PERMISSION PACKAGE

+

DOMAIN PACKAGE

+

AUDIT TABLE PATTERN

+

PGTAP DATABASE TESTS
```

Recommended direction:

```text
EXTEND EXISTING MGBOS
```

not:

```text
MICROSERVICE

EVENT PLATFORM

KAFKA

NEW BACKEND

NEW DATABASE

GENERIC WORKFLOW ENGINE

GENERIC ALERT PLATFORM
```

---

# 4. W3 Top-Level Result

```text
CURRENT OPERATING SPINE
=
SUFFICIENT FOUNDATION

OPERATIONAL EXCEPTION
=
NOT IMPLEMENTED

FOUNDER ATTENTION
=
NOT IMPLEMENTED

FOUNDER HOME
=
PRODUCT TARGET EXISTS
CURRENT /dashboard IS REUSABLE

EVENT RUNTIME
=
NOT REQUIRED FOR INITIAL IMPLEMENTATION

SERVICE PRINCIPAL
=
NOT IMPLEMENTED

RESOURCE-SCOPED AUTHORIZATION
=
NOT IMPLEMENTED

ORGANIZATION TIMEZONE DATA
=
IMPLEMENTED

ORGANIZATION TIMEZONE IN SESSION CONTEXT
=
MISSING

PHASE 2
=
TECHNICALLY FEASIBLE

PHASE 2
=
NOT YET OPEN
```

---

# 5. Existing MGBOS Application Architecture

Current MGBOS application lives under:

```text
systems/mgbos/apps/mgbos/
```

and already contains operational surfaces for:

```text
dashboard

leads

customers

requirements

quotes

orders

production

vendors

QC

invoices

payments

ledger

inventory

procurement

shipments
```

This means Founder Control does not require a new application.

---

# 6. Founder Home Existing Surface

Current:

```text
systems/mgbos/apps/mgbos/src/app/(app)/dashboard/page.tsx
```

already identifies itself as:

```text
FOUNDER COMMAND CENTER
```

but its current content is primarily:

```text
organization status

brand context

static platform description

vertical-slice status
```

It does not currently aggregate live cross-domain operational attention.

Recommended:

```text
/dashboard
=
FOUNDER HOME EVOLUTION TARGET
```

Do not create another founder application unless later evidence requires it.

---

# 7. Existing Brand Context

Current application already has:

```text
ACTIVE_BRAND_COOKIE_NAME
```

and a visible brand switcher.

Session exposes:

```text
activeBrand.code

activeBrand.name
```

This is reusable for Founder Control scope.

D2 still leaves the default:

```text
ACTIVE BRAND
vs
ORGANIZATION-WIDE
```

unresolved.

Therefore engineering MUST support explicit scope semantics and MUST NOT silently define the product default.

---

# 8. Organization Timezone

Physical Organization already stores:

```text
app.organizations.timezone
```

with current default:

```text
Asia/Jakarta
```

Canonical architecture correctly establishes Organization timezone as business-time authority.

However current:

```text
SessionContext.organization
```

contains only:

```text
id

code

displayName
```

and current session lookup does not select Organization timezone.

Therefore:

```text
TIMEZONE DATA
=
AVAILABLE

TIMEZONE APPLICATION CONTEXT
=
GAP
```

Founder Attention business-time evaluation must close this gap before implementing overdue/deadline rules.

---

# 9. Existing Authorization Architecture

Current TypeScript authorization lives in:

```text
systems/mgbos/packages/auth/src/permissions.ts
```

Current roles:

```text
OWNER
ADMIN
SALES
OPERATIONS
FINANCE
QC
```

Current runtime uses a role-to-permission map.

Examples:

```text
orders:read

production:update

payments:record

shipments:dispatch
```

This is sufficient as the starting authorization mechanism.

No generic IAM rewrite is required.

---

# 10. Authorization Limitation

Current runtime authorization primarily answers:

```text
Does ROLE have PERMISSION?
```

It does not yet natively answer:

```text
May this role manage
this specific Exception Type
or
this specific resource?
```

Therefore current architecture does NOT yet provide a general:

```text
RESOURCE-SCOPED CAPABILITY ENGINE
```

This matters because canonical Founder Control eventually expects scoped:

```text
SALES

OPERATIONS

FINANCE

QC
```

Exception authority.

---

# 11. Authorization Recommendation

Do not build a generic ABAC/policy engine for Founder Control v1.

Recommended incremental model:

```text
P2-A
OWNER / ADMIN bounded exception management

        ↓

later bounded extension

domain/resource-scoped roles
```

Canonical responsibility roles are preserved from day one.

But full delegated operator authorization need not block the first founder-facing vertical slice.

---

# 12. Accepted-Risk Authority

Canonical rule must be enforced in physical implementation:

```text
ACCEPTED_RISK
=
RESOLUTION TYPE

AND

OWNER AUTHORITY REQUIRED
```

Even if ADMIN has:

```text
operational_exception:resolve
```

a command whose:

```text
resolution_type = ACCEPTED_RISK
```

must independently fail unless Owner authority or a future explicitly approved delegation exists.

---

# 13. Current Mutation Pattern

Current Next.js server actions typically perform:

```text
requireAuth()

↓

checkPermission()

↓

validate input

↓

POST /rest/v1/rpc/<business-command>

↓

PostgreSQL command

↓

organization validation

↓

role validation

↓

state / invariant validation

↓

transaction

↓

audit

↓

revalidatePath()
```

This pattern is mature enough to reuse for Operational Exception.

---

# 14. Current Database Command Pattern

Existing MGBOS mutations use:

```text
SECURITY DEFINER PostgreSQL functions
```

with:

```text
p_organization_id

p_actor_id
```

and domain-specific actor-role helpers such as:

```text
production_actor_role

invoice_actor_role

payment_actor_role

shipment_actor_role
```

Commands perform explicit same-Organization queries and often:

```text
SELECT ... FOR UPDATE
```

for concurrency-sensitive work.

Operational Exception should follow the same established pattern.

---

# 15. Existing Audit Pattern

Current domains generally use dedicated append-oriented audit/history tables, for example:

```text
order_audit

production_job_audit

invoice_audit

payment_audit

shipment_audit
```

This provides a strong precedent for:

```text
operational_exception_history
```

rather than embedding all lifecycle history into the current Exception row.

---

# 16. Current Read Pattern

Application reads are primarily:

```text
server-only

+

authenticated session

+

permission check

+

service-role REST client

+

explicit Organization filtering
```

Existing example:

```text
requirementContext()

readRows()
```

This is reusable for Founder Attention.

---

# 17. Existing Read-Model Precedent

MGBOS already contains:

```text
app.order_financial_summaries
```

as a SQL view.

It aggregates:

```text
Order

Invoice

Payment

Production Cost
```

into one read model.

This proves cross-domain read projection already fits current architecture.

---

# 18. Founder Attention Is Different From Financial Summary

Founder Attention additionally depends on:

```text
business date

Organization timezone

evaluation coverage

exception state

policy

priority

urgency

responsibility

Founder Decision Required
```

These semantics are more dynamic than a normal analytical SQL view.

Therefore W3 does NOT recommend creating:

```text
app.founder_attention_items
```

as a transactional table.

---

# 19. Founder Attention Physical Recommendation

Initial Founder Attention SHOULD be:

```text
COMPUTE-ON-READ
```

through a bounded server-side evaluator.

Recommended structure:

```text
source queries
        ↓
normalized facts
        ↓
pure deterministic evaluator
        ↓
AttentionItem[]
+
EvaluationCoverage
        ↓
Founder Home
```

---

# 20. Founder Attention Persistence

Initial recommendation:

```text
NO PERSISTENT ATTENTION TABLE

NO ATTENTION HISTORY TABLE

NO MATERIALIZED VIEW
```

Reason:

```text
current scale is small

Attention is derived

rules are still maturing

business time is dynamic

event runtime does not exist

cache invalidation is unnecessary complexity
```

If performance later becomes measurable:

```text
cache / materialization
```

may be introduced without changing semantic ownership.

---

# 21. Recommended Attention Code Boundary

Future implementation candidate:

```text
systems/mgbos/packages/domain/src/
founderAttention.ts
```

owns pure:

```text
types

rule evaluation

ordering

coverage semantics
```

Application aggregation candidate:

```text
systems/mgbos/apps/mgbos/src/app/(app)/dashboard/
data.ts
```

owns:

```text
bounded source queries

scope resolution

normalization

projection invocation
```

Founder Home remains:

```text
/dashboard
```

---

# 22. Attention Query Must Remain State-Neutral

Founder Attention evaluation MUST NOT:

```text
open Exception

acknowledge Exception

resolve Exception

change severity

modify Order

modify Production

modify Invoice

modify Shipment
```

A dashboard refresh is not a business command.

---

# 23. Operational Exception Current Implementation

Repository inspection found no implemented:

```text
operational_exceptions table

operational_exception_history table

operational_exception domain module

operational_exception RPC family

operational_exception application routes

operational_exception permission entries
```

Classification:

```text
CANONICAL_TARGET
+
ZERO CURRENT RUNTIME IMPLEMENTATION
```

---

# 24. Operational Exception Physical Model Options

W3 evaluated three broad options.

## Option A — Generic JSON inside source domains

Example:

```text
orders.exception_metadata
```

Decision:

```text
REJECT
```

Reason:

```text
no independent identity

poor lifecycle ownership

poor cross-domain querying

violates canonical promotion
```

---

# 25. Option B — Wide Sparse Foreign-Key Model

Example:

```text
production_job_id

production_assignment_id

qc_inspection_id

invoice_id

shipment_id

order_id
...
```

on one Exception table.

Advantages:

```text
strong direct foreign keys
```

Disadvantages:

```text
large sparse table

schema mutation for every new source type

cross-domain overlay becomes structurally coupled
to every domain
```

Decision:

```text
NOT PREFERRED FOR V1
```

---

# 26. Option C — Typed Primary Resource Reference

Recommended.

Store explicit first-class fields:

```text
primary_resource_type

primary_resource_id
```

plus useful relational anchors such as:

```text
organization_id

brand_id

order_id
```

where derivable.

This is NOT arbitrary JSON polymorphism.

The typed reference itself is a governed first-class relation.

---

# 27. Typed Resource Integrity

Because:

```text
primary_resource_id
```

cannot have a universal SQL foreign key across heterogeneous tables, authoritative Open command MUST:

```text
validate resource type

load the exact source table

verify source exists

verify Organization

derive Brand where applicable

derive Order where applicable

reject unknown resource

reject foreign-Organization resource
```

Direct business writes to the table remain prohibited.

This creates semantic referential integrity through the governed command boundary.

---

# 28. Recommended Operational Exception Table

Recommended conceptual physical table:

```text
app.operational_exceptions
```

Minimum fields:

```text
id UUID

organization_id UUID

brand_id UUID nullable

order_id UUID nullable

exception_category

exception_type

status

severity

source_kind

primary_resource_type

primary_resource_id

dedup_key

summary

responsible_role_id

responsible_user_id nullable

opening_evidence JSONB

resolution_type nullable

resolution_summary nullable

dismissal_reason nullable

opened_at

acknowledged_at nullable

closed_at nullable

last_reopened_at nullable

created_at

updated_at
```

Exact migration syntax remains Implementation Contract work.

---

# 29. Why Brand Is Nullable

Some future Organization-level exceptions may not belong to one Brand.

Therefore:

```text
organization_id
=
mandatory

brand_id
=
optional
```

Organization remains hard tenant boundary.

---

# 30. Why Order Is a Useful Optional Anchor

Most pilot operational objects eventually belong to an Order:

```text
Production Job

Assignment

QC

Invoice

Shipment

Cost
```

A nullable:

```text
order_id
```

provides efficient Founder Control drill-down and grouping.

It must be derived/validated from source truth rather than trusted from caller input.

---

# 31. Exception Category and Type

Use stable D3 categories/types.

Examples:

```text
production.deadline_breached

vendor.no_response

quality.qc_failed

financial.actual_cost_missing

fulfillment.delivery_problem
```

`OTHER` remains the controlled D3 escape hatch.

Do NOT add a free-form:

```text
MANUAL_OTHER
```

category outside approved taxonomy.

---

# 32. Recommended History Table

Recommended:

```text
app.operational_exception_history
```

Minimum conceptual fields:

```text
id

organization_id

operational_exception_id

actor_id

action

from_status nullable

to_status nullable

details JSONB

created_at
```

History captures:

```text
OPENED

ACKNOWLEDGED

ASSIGNED

REASSIGNED

SEVERITY_CHANGED

RESOLVED

DISMISSED

REOPENED
```

---

# 33. History Is Append-Oriented

No ordinary command may:

```text
UPDATE historical action

DELETE historical action
```

Correction happens by adding a new governed history fact.

---

# 34. Current-Row vs History Semantics

`operational_exceptions` stores:

```text
CURRENT OPERATIONAL STATE
```

History stores:

```text
HOW CURRENT STATE WAS REACHED
```

On Reopen:

```text
current status
→ OPEN

closed_at
→ cleared for current lifecycle projection

prior resolution/dismissal
→ remains preserved in history
```

---

# 35. Deduplication Recommendation

Every Exception receives a server-generated:

```text
dedup_key
```

Caller MUST NOT be authoritative for this value.

Recommended uniqueness:

```text
UNIQUE
(
  organization_id,
  exception_type,
  dedup_key
)

WHERE status IN (
  'OPEN',
  'ACKNOWLEDGED'
)
```

Conceptual result:

```text
one active logical abnormal episode
→ one active Exception
```

---

# 36. Closed Episode Behavior

After:

```text
RESOLVED

or

DISMISSED
```

the same logical key may later create a new Exception row if evidence proves an independent new episode.

Explicit:

```text
REOPEN
```

instead preserves the same Exception identity when the original episode resumes or prior resolution proves ineffective.

---

# 37. Dedup Is Not Idempotency

Preserve:

```text
request_id
→ duplicate command transport

dedup_key
→ duplicate business abnormality
```

Both protections may exist independently.

---

# 38. Operational Exception Commands

Physical implementation should map canonical logical commands to existing RPC style:

```text
open_operational_exception

acknowledge_operational_exception

assign_operational_exception

reassign_operational_exception

change_operational_exception_severity

resolve_operational_exception

dismiss_operational_exception

reopen_operational_exception
```

Exact function names may differ if Implementation Contract establishes a better consistent convention.

---

# 39. Direct Mutation Rule

Application code MUST NOT directly issue:

```text
UPDATE app.operational_exceptions
```

for lifecycle mutation.

Use governed commands.

Read operations remain separate.

---

# 40. Source-Domain Isolation

No Exception command may directly:

```text
complete Production Job

mark Shipment delivered

record Payment

pass QC

change Order status
```

Exception commands mutate Exception truth only.

---

# 41. Accepted Risk

`resolve_operational_exception` must inspect:

```text
resolution_type
```

If:

```text
ACCEPTED_RISK
```

then runtime must require:

```text
OWNER
```

regardless of ordinary resolve capability.

---

# 42. First-Slice Service Principal Decision

Current repository has no explicit:

```text
SYSTEM principal

AUTOMATION principal

JARVIS principal
```

authorization model.

Therefore Phase 2 first slice SHOULD NOT introduce automatic authoritative Exception opening.

Recommended first implementation:

```text
HUMAN GOVERNED OPENING
```

only.

This avoids impersonating a User or silently granting automation business authority.

---

# 43. Automatic Detection Later

Automatic Exception opening belongs to a later bounded slice after:

```text
detector policy approved

system/service identity designed

automation authority bounded

dedup verified

negative tests exist
```

This does not prevent derived Attention from detecting conditions read-only.

---

# 44. Detector Readiness Classification

W3 classifies the D4 pilot catalog by current source readiness.

---

# 45. EXC-PILOT-01 — Production Deadline Breach

Source readiness:

```text
READY
```

Current source:

```text
production_jobs.target_completion_date

production_jobs.status

organizations.timezone
```

Objective breach condition can be derived without inventing an SLA:

```text
target_completion_date
<
Organization business date

AND

job not terminal
```

Remaining policy:

```text
severity mapping

Attention priority mapping
```

---

# 46. EXC-PILOT-02 — Vendor No-Response

Source readiness:

```text
SOURCE DATA READY
POLICY BLOCKED
```

Available:

```text
production_assignments.status

assigned_at

accepted_at
```

Missing approved policy:

```text
Vendor response window
```

Therefore:

```text
AUTO DETECTOR
=
BLOCKED
```

until business policy exists.

---

# 47. EXC-PILOT-03 — QC Failure / Rework

Source readiness:

```text
READY
```

Current source:

```text
qc_inspections.result

qc_inspections.defect_severity

production_job status
```

Deterministic abnormal conditions exist for:

```text
REWORK

REJECTED
```

Exact exception severity/Attention policy remains independently governed.

---

# 48. EXC-PILOT-04 — Fulfillment Blocker / Delivery Problem

Source readiness:

```text
PARTIAL
```

Current MGBOS already deterministically evaluates fulfillment readiness.

But:

```text
when a blocker becomes
a durable Operational Exception
```

requires a persistent-tracking qualification rule.

A normal temporary readiness blocker is not automatically an Exception.

---

# 49. EXC-PILOT-05 — Past-Due Receivable

Source readiness:

```text
READY
```

Current source:

```text
invoices.due_date

invoices.balance_due

invoices.status

organizations.timezone
```

Critical W3 finding:

```text
Invoice status OVERDUE
is NOT currently maintained
as authoritative runtime condition.
```

`OVERDUE` exists in allowed lifecycle vocabulary, but current payment/runtime code does not automatically transition invoices into that state.

Therefore Founder Control MUST derive overdue condition from:

```text
due_date

+

balance_due

+

Organization business date

+

eligible invoice lifecycle
```

not from:

```text
status = OVERDUE
```

alone.

---

# 50. EXC-PILOT-06 — Required Actual Cost Missing

Source readiness:

```text
SOURCE DATA READY
POLICY / ELIGIBILITY GATED
```

Available:

```text
production_jobs.actual_cost

order_financial_summaries.is_cost_settled
```

Unknown:

```text
at which lifecycle point
Actual Cost becomes required
enough to create a durable Exception
```

Engineering MUST NOT invent this timing rule.

---

# 51. EXC-PILOT-07 — Material Margin Exception

Data readiness:

```text
READY
```

Current:

```text
order_financial_summaries.realized_margin_pct

margin_health
```

already exists.

However existing analytical margin-health thresholds MUST NOT automatically become Founder Control materiality policy.

Canonical D2/D3 explicitly leave exact materiality policy unresolved.

Therefore:

```text
AUTO EXCEPTION
=
POLICY BLOCKED
```

---

# 52. EXC-PILOT-08 — Business-Impacting Automation Failure

Source readiness:

```text
NOT READY
```

Current repository does not yet contain a durable, business-impact-aware automation failure model sufficient to distinguish:

```text
technical retry

from

business-impacting failure
```

Defer.

---

# 53. D4 Does Not Require All Eight Types

D4 explicitly states:

```text
Pilot does NOT need to implement
every D3 category before starting.
```

and:

```text
Only actually supported exception types
may be automatically detected.
```

Therefore implementation must not fake full coverage.

---

# 54. Recommended First Detector Candidates

When automatic detection is eventually authorized, strongest initial source-ready candidates are:

```text
production.deadline_breached

quality.qc_failed

financial.receivable_past_due
```

They span:

```text
Production

Quality

Finance
```

and require no invented duration threshold for condition existence.

They still require approved:

```text
severity

Attention priority

Founder visibility policy
```

before complete automatic behavior.

---

# 55. Direct Founder Decision Source Already Exists

Quote pricing already provides deterministic Owner-only approval semantics:

```text
pricing_guard = APPROVAL_REQUIRED
```

with:

```text
quote_price_approvals
```

and:

```text
Only OWNER may approve pricing override
```

This is a strong future Founder Attention source.

It does NOT require Operational Exception merely to be visible.

---

# 56. Attention Policy Gap

D2 has decided:

```text
Kind

Priority vocabulary

Urgency vocabulary

Flow Impact

Founder Decision Required vocabulary
```

but exact mappings from every business condition into Priority remain policy-dependent.

Examples still unresolved include:

```text
Vendor response window

Due-soon window

material margin threshold

high-value threshold
```

Therefore Phase 2 MUST NOT hard-code guessed thresholds.

---

# 57. Scope-Default Gap

D2 explicitly leaves unresolved:

```text
GLOBAL
vs
ACTIVE BRAND
```

default Founder Home scope.

Current application already has active Brand context.

TeeStock is the approved pilot context.

W3 recommendation:

```text
ACTIVE BRAND
```

is the smallest initial default for the TeeStock pilot, with a clearly visible scope label.

But this remains an Owner/product decision until approved.

Architecture should still allow organization-wide evaluation later.

---

# 58. Founder Attention Coverage

Attention evaluator should return explicit coverage.

Conceptually:

```text
coverage.status
=
COMPLETE
PARTIAL
UNAVAILABLE
```

plus source evaluation information.

Example:

```text
Production source
=
EVALUATED

Invoice source
=
EVALUATED

Margin policy
=
POLICY_UNAVAILABLE
```

The UI must not convert incomplete coverage into:

```text
ALL CLEAR
```

---

# 59. Source Query Boundedness

Founder Home MUST NOT naïvely fetch entire domain histories.

Source queries should filter for relevant current facts, for example:

```text
active/open Production Jobs

active QC abnormalities

unsettled Invoices

active Operational Exceptions

current pricing approvals

current financial summary
```

bounded by:

```text
Organization

explicit Brand scope

active lifecycle
```

---

# 60. Founder Attention Identity

Because Attention is derived, its identity SHOULD be deterministic rather than a database UUID.

Conceptually:

```text
<reason-code>
+
<source-type>
+
<source-id>
+
<scope>
```

This allows stable React/UI identity and dedup without promoting Attention to transaction truth.

Exact encoding belongs to implementation design.

---

# 61. Current RLS / Service-Role Reality

Current MGBOS application queries business data server-side using:

```text
SUPABASE_SERVICE_ROLE_KEY
```

with explicit Organization filtering and application-level permission checks.

This is current architecture truth.

W3 does NOT recommend rewriting the entire application to a new auth transport as part of Founder Control.

---

# 62. Exception Database Security Recommendation

Operational Exception tables should:

```text
enable RLS

deny anonymous/public mutation

avoid direct client mutation

use governed RPC for lifecycle mutation

restrict server-side reads through
application permission + Organization filter
```

Cross-Organization tests are mandatory.

---

# 63. Runtime Permission Naming

Canonical logical capability:

```text
mgbos.operational_exception.resolve
```

may physically map to existing TypeScript permission convention such as:

```text
operational_exceptions:resolve
```

provided the mapping is explicit and one-to-one.

Do not rewrite all current permission naming merely for cosmetic consistency.

---

# 64. Recommended First-Slice Permission Scope

P2-A recommendation:

```text
OWNER
=
full exception management

ADMIN
=
broad routine exception management

SALES / OPERATIONS / FINANCE / QC
=
no new exception mutation authority yet
unless resource-scoped authorization
is explicitly implemented
```

Why:

Current permission engine cannot safely express the canonical scoped semantics without overgranting whole-Organization exception mutation.

Responsible Role should still be stored from day one.

---

# 65. Solo-Founder Compatibility

D3 explicitly permits:

```text
Responsible Role = OPERATIONS

Responsible Principal = Rizky
```

even if Rizky's actual Organization membership role is OWNER.

Therefore first founder-facing slice can preserve future delegation semantics without prematurely building role-specific queues.

---

# 66. Resource-Scoped Operator Access

Later implementation may introduce a bounded Exception scope evaluator, for example:

```text
FINANCE
→ finance-owned exception types

QC
→ QC-owned exception types

OPERATIONS
→ production/fulfillment types
```

Do not introduce generic ABAC merely to achieve this.

---

# 67. Event Architecture

Initial Founder Control requires no:

```text
Kafka

Outbox

event broker

event sourcing
```

Current scheduled/read-based architecture is sufficient.

Do not implement `packages/events` runtime merely because candidate event names exist canonically.

---

# 68. JARVIS

No JARVIS dependency exists for Phase 2 foundation.

Initial architecture:

```text
MGBOS
→ deterministic truth
→ Founder Home
```

Later:

```text
MGBOS
→ Founder Attention
→ JARVIS explanation/recommendation
```

---

# 69. Notification Infrastructure

No outbound:

```text
WhatsApp

email

push

SMS
```

is required for Founder Control v1 foundation.

In-product attention comes first.

---

# 70. Recommended Phase 2 Sequencing

W3 recommends several bounded slices rather than one large Founder Control implementation.

---

# 71. P2-A — Operational Exception Foundation

**Recommended first implementation slice.**

Scope:

```text
Operational Exception schema

Exception history

deduplication

domain contracts

validation

authorization permissions

governed RPC commands

read/query surface

minimal operational UI

database tests

authorization tests
```

Opening is initially:

```text
HUMAN-GOVERNED
```

No automatic detector.

No Attention engine required yet.

---

# 72. Why P2-A Is the Smallest Coherent Slice

It establishes durable business truth required by everything else:

```text
identity

lifecycle

ownership

history

deduplication

resolution

dismissal

reopen
```

without requiring unresolved:

```text
priority policy

Vendor SLA

material margin threshold

service principal

event runtime

notification infrastructure
```

---

# 73. P2-B — Founder Attention + Founder Home

After P2-A is verified:

```text
Organization timezone in SessionContext

pure Attention evaluator

Evaluation Coverage

bounded source queries

active Exception projection

pricing-approval attention

source-derived attention

dashboard Founder Home
```

No Attention persistence.

No source mutation during read.

---

# 74. P2-B Product Decisions Required

Before final P2-B Implementation Contract, approve:

```text
initial Founder Home default scope

initial deterministic priority rule matrix

due-soon policy if used

which source-derived rules are enabled
```

Unknown policy must remain:

```text
UNKNOWN / DISABLED
```

rather than guessed.

---

# 75. P2-C — Deterministic Detection / Persistence

Only after policy and actor authority mature:

```text
automatic eligible detector

service/system principal

automatic Open command

automatic deterministic Resolve where allowed

scheduled evaluator

dedup under concurrent detection
```

This is intentionally NOT part of P2-A.

---

# 76. P2-D — Pilot Hardening

Then:

```text
synthetic scenarios

operator acceptance

pilot-support tooling

monitoring

operational readiness

recovery evidence

real pilot
```

D4 remains blocked until its readiness gates pass.

---

# 77. Recommended P2-A Physical Files

Potential implementation footprint includes:

```text
systems/mgbos/supabase/migrations/
<new_founder_control_migration>.sql

systems/mgbos/supabase/tests/
operational_exceptions.test.sql

systems/mgbos/packages/domain/src/
operationalException.ts

systems/mgbos/packages/domain/src/
operationalException.test.ts

systems/mgbos/packages/validation/src/
operationalException.ts

systems/mgbos/packages/validation/src/
operationalException.test.ts

systems/mgbos/packages/auth/src/
permissions.ts

systems/mgbos/packages/auth/src/
operational-exception-permissions.test.ts

systems/mgbos/apps/mgbos/src/app/(app)/
exceptions/
```

Exact paths remain Implementation Contract work.

---

# 78. Recommended P2-B Physical Files

Likely:

```text
systems/mgbos/packages/domain/src/
founderAttention.ts

systems/mgbos/packages/domain/src/
founderAttention.test.ts

systems/mgbos/apps/mgbos/src/app/(app)/dashboard/
data.ts

systems/mgbos/apps/mgbos/src/app/(app)/dashboard/
page.tsx

systems/mgbos/apps/mgbos/src/lib/
session.server.ts

systems/mgbos/packages/domain/src/
auth.ts
```

No new application is needed.

---

# 79. P2-A Engineering Risk

P2-A changes:

```text
database schema

business lifecycle

authorization

cross-domain references

audit/history

deduplication
```

Authorization boundary creates an engineering risk floor above ordinary schema work.

Recommended classification:

```text
R4
SENSITIVE / HIGH-IMPACT MUTATION
```

even though deployment to production is not authorized.

---

# 80. Why Not R5 By Default

P2-A does NOT directly mutate:

```text
Payment truth

financial amounts

critical inventory quantities

production deployment

production credentials
```

Therefore R5 is not automatically required.

If implementation later couples Exception commands to high-consequence source-domain mutation:

```text
RISK MUST BE REASSESSED
```

Such coupling is currently forbidden anyway.

---

# 81. P2-B Engineering Risk

Founder Attention is mostly read-only.

However it aggregates:

```text
cross-domain data

financial data

operational ownership

Organization context
```

and modifies authorization/read surfaces.

Recommended risk floor:

```text
R4
```

for the overall Founder Home package because cross-tenant/sensitive-read failure could expose business data.

---

# 82. P2-C Engineering Risk

Automatic authoritative Exception creation introduces:

```text
automation amplification

non-human authority

dedup concurrency

scheduled mutation
```

Recommended:

```text
R4 MINIMUM
```

with reassessment based on exact automation authority.

---

# 83. P2-A Verification Contract Direction

At minimum require:

```text
clean migration replay

upgrade migration verification

generated database types

schema constraints

Organization isolation

wrong-role rejection

cross-Organization rejection

lifecycle transition matrix

ACKNOWLEDGED != RESOLVED

accepted risk Owner-only

dismissal semantics

reopen history

deduplication

concurrent duplicate attempt

assignment validation

history immutability

source-domain mutation isolation

direct mutation restriction

domain unit tests

validation tests

authorization tests

application build/typecheck

full relevant MGBOS regression suite
```

---

# 84. Required Dedup Tests

Test at least:

```text
same active episode
opened twice
→ one active Exception

same request ID
same payload
→ idempotent result

same request ID
different payload
→ conflict

closed prior episode
+
new independent episode
→ new Exception allowed

closed prior episode
+
explicit reopen
→ same Exception identity
```

---

# 85. Required Organization Tests

Must prove:

```text
Organization A cannot read Organization B Exception

Organization A cannot mutate Organization B Exception

source resource from B
cannot create Exception in A

responsible user from B
cannot be assigned to A Exception
```

---

# 86. Required Lifecycle Tests

Canonical matrix:

```text
OPEN → ACKNOWLEDGED

ACKNOWLEDGED → RESOLVED

OPEN → DISMISSED

ACKNOWLEDGED → DISMISSED

RESOLVED → OPEN via REOPEN

DISMISSED → OPEN via REOPEN
```

Invalid transitions must fail closed.

---

# 87. Required Historical Integrity Tests

After resolution + reopen:

```text
previous resolution

previous actor

previous evidence

previous timestamps
```

must remain recoverable.

No history rewriting.

---

# 88. Required Source-Domain Isolation Test

Example:

```text
ResolveOperationalException
for delayed Shipment
```

must prove Shipment itself did NOT automatically become:

```text
DELIVERED
```

Similar negative tests should exist for relevant source domains.

---

# 89. P2-B Verification Direction

Founder Attention tests require deterministic fixture-time behavior.

Test:

```text
Organization timezone

business date boundary

Attention Kind

Priority

Urgency

Flow Impact

Founder Decision Required

exception projection

active CRITICAL visibility

acknowledged CRITICAL visibility

DATA_GAP

coverage COMPLETE

coverage PARTIAL

coverage UNAVAILABLE

Brand scope

Organization isolation

deduplication

deterministic ordering

read produces no mutation
```

---

# 90. Past-Due Receivable Test

Explicitly prove:

```text
ISSUED invoice
+
balance_due > 0
+
due_date before Organization business date
```

produces overdue business condition even if:

```text
invoice.status != OVERDUE
```

This protects Founder Control from current lifecycle/runtime drift.

---

# 91. Timezone Test

Test at least two Organization timezone contexts around a date boundary.

Do not only test:

```text
Asia/Jakarta
```

because the invariant is Organization-owned timezone, not Jakarta-specific behavior.

---

# 92. Attention Performance

Initial evaluator should use bounded filtered queries.

No premature cache.

Performance should be measured with representative pilot data before introducing:

```text
materialized views

cache invalidation

event-driven projection
```

---

# 93. Existing Documentation Drift Found During W3

Several current navigation/planning frontmatters still carry pre-W2 reviewed baseline:

```text
63dec5a78462e3eff994ebdd0c15e31676b12bee
```

while repository truth is now:

```text
88a8a28f1b64a624717a8e03038c63f4520f8978
```

This is not runtime drift.

It is provenance/current-baseline ambiguity.

---

# 94. Founder Control Documentation Plan Drift

`founder-control-documentation-plan.md` contains both:

```text
W3 = NEXT (ACTIVE FOCUS)
```

and older lower sections still claiming:

```text
W2 = NEXT

ENGINEERING DISCOVERY = NOT YET OPEN
```

This stale lower section must be reconciled in the W3 documentation package.

Do not rewrite genuinely historical evidence.

---

# 95. Documentation Recommendation

Future W3 persistence PR should:

```text
add this Engineering Discovery report

update engineering navigation

reconcile current Founder Control plan routing

bind current reviewed baseline
to main@88a8a28...

preserve historical revision-bound evidence
```

This documentation reconciliation is separate from P2 code.

---

# 96. Explicit Non-Goals

W3 rejects the need to build now:

```text
microservices

Kafka

event sourcing

new database

generic command bus

generic workflow engine

generic task management

generic alert system

generic ABAC engine

full IAM platform

Attention history table

Attention source-of-truth table

service principal framework in P2-A

automatic detectors in P2-A

JARVIS integration

outbound notifications

full eight-type automatic pilot coverage

organization-wide Founder Home default without approval
```

---

# 97. Current Implementation Gap Matrix

```text
Operational Exception identity
=
MISSING

Exception lifecycle persistence
=
MISSING

Exception history
=
MISSING

Exception dedup
=
MISSING

Exception commands
=
MISSING

Exception runtime permissions
=
MISSING

Founder Attention evaluator
=
MISSING

Evaluation Coverage
=
MISSING

Founder Home live operational content
=
MISSING

Organization timezone storage
=
CURRENT

Organization timezone session context
=
MISSING

cross-domain source facts
=
LARGELY CURRENT

pricing Owner approval source
=
CURRENT

Production deadline source
=
CURRENT

QC abnormality source
=
CURRENT

past-due receivable source
=
CURRENT BUT MUST BE DERIVED

Vendor response source
=
CURRENT / POLICY BLOCKED

Actual Cost source
=
CURRENT / POLICY GATED

Margin source
=
CURRENT / POLICY GATED

automation-impact source
=
NOT READY

event runtime
=
NOT NEEDED FOR INITIAL SLICE

service principal
=
NOT NEEDED FOR P2-A
```

---

# 98. Reuse Matrix

```text
Session/authentication
→ REUSE

Organization membership
→ REUSE

roles
→ REUSE

TypeScript permission map
→ EXTEND

server action pattern
→ REUSE

PostgreSQL RPC command pattern
→ REUSE

domain package
→ EXTEND

validation package
→ EXTEND

per-domain audit pattern
→ REUSE

pgTAP tests
→ REUSE

Vitest permission/domain tests
→ REUSE

/dashboard
→ EVOLVE INTO FOUNDER HOME

order_financial_summaries
→ REUSE AS SOURCE, NOT ATTENTION MODEL

events package
→ DO NOT EXPAND YET
```

---

# 99. Recommended Phase 2 Creation Gate

Phase 2 should remain closed until W3 produces and Owner accepts:

```text
1.
this discovery conclusion

2.
P2-A technical implementation plan

3.
exact migration design

4.
exact permission mapping

5.
Implementation Contract

6.
bounded Work Package

7.
verification matrix

8.
stop conditions
```

---

# 100. Recommended First Phase 2 Package

Recommended package name:

```text
P2-A
FOUNDER CONTROL —
OPERATIONAL EXCEPTION FOUNDATION
```

Objective:

> Introduce durable, governed Operational Exception truth into the existing MGBOS modular monolith without introducing automatic detectors, Founder Attention persistence, event infrastructure, or source-domain mutation coupling.

---

# 101. P2-A Completion Boundary

P2-A is complete when a valid human actor can:

```text
open

read

acknowledge

assign / reassign

change severity

resolve

dismiss

reopen
```

an Organization-isolated Operational Exception with:

```text
stable identity

deduplication

responsibility

bounded evidence

durable history
```

and all forbidden transitions/access fail.

---

# 102. What P2-A Does Not Prove

P2-A completion does NOT mean:

```text
Founder Home complete

automatic detection complete

JARVIS complete

Pilot ready

production ready

Phase 2 fully complete
```

---

# 103. Recommended P2-B Objective

After P2-A:

> Turn existing governed MGBOS facts and active Operational Exceptions into a deterministic, state-neutral Founder Attention projection on `/dashboard`.

---

# 104. Recommended Initial Product Decision — Scope

W3 recommendation for TeeStock pilot:

```text
DEFAULT SCOPE
=
ACTIVE BRAND
```

Reason:

```text
existing application already has
explicit active-brand context

TeeStock is pilot business

simpler authorization/read query

lower founder ambiguity

lower query cost

does not preclude later Organization-wide mode
```

Must remain clearly labeled in UI.

Owner approval is required before this becomes product truth.

---

# 105. Recommended Initial Engineering Decision — Automation

W3 recommendation:

```text
P2-A AUTOMATIC EXCEPTION OPENING
=
NO
```

Use governed human opening first.

Reason:

```text
no service principal

no system authority model

several policy gaps

query must remain state-neutral

manual path proves lifecycle first
```

---

# 106. Recommended Initial Engineering Decision — Attention Persistence

W3 recommendation:

```text
FOUNDER ATTENTION PERSISTENCE
=
NONE IN V1 FOUNDATION
```

Compute on read.

---

# 107. Recommended Initial Engineering Decision — Event Runtime

W3 recommendation:

```text
EVENT RUNTIME
=
NOT REQUIRED
```

No Outbox/Kafka work in initial Founder Control implementation.

---

# 108. Recommended Initial Engineering Decision — Delegated Operator Mutation

W3 recommendation:

```text
RESOURCE-SCOPED
SALES / OPERATIONS / FINANCE / QC
EXCEPTION MUTATION
=
DEFER FROM P2-A
```

until bounded resource-scope authorization is designed.

Do not overgrant whole-Organization access merely to satisfy future delegation.

---

# 109. Residual Product Decisions

Before full Founder Attention implementation:

```text
DECISION-01
Founder Home default:
active Brand or Organization-wide?

DECISION-02
initial deterministic priority-rule matrix

DECISION-03
Due-Soon window
if Due-Soon is enabled

DECISION-04
Vendor response SLA
before vendor.no_response automation

DECISION-05
Actual Cost required-point rule

DECISION-06
material margin threshold

DECISION-07
which Attention source rules ship in P2-B
```

These are product/business policy decisions.

Engineering MUST NOT invent them.

---

# 110. Operational Readiness Remains Separate

W3 technical feasibility does NOT change:

```text
PRODUCTION READINESS
=
NOT VERIFIED

REAL PILOT
=
BLOCKED
```

Outstanding readiness areas remain separately governed, including:

```text
environment isolation

credentials

backups

restore proof

monitoring

rollback/recovery

RPO

RTO
```

---

# 111. W3 Discovery Conclusion

Current MGBOS architecture is sufficiently mature to support Founder Control without structural rewrite.

The correct implementation direction is:

```text
CURRENT MODULAR MONOLITH
        ↓
OPERATIONAL EXCEPTION FOUNDATION
        ↓
FOUNDER ATTENTION COMPUTE-ON-READ
        ↓
FOUNDER HOME
        ↓
DETERMINISTIC AUTOMATION
when authority/policy exists
        ↓
JARVIS
later
```

---

# 112. W3 Engineering Decision

Recommended physical direction:

```text
Operational Exception
=
PERSISTENT TABLE
+
APPEND-ORIENTED HISTORY

Primary Source
=
TYPED RESOURCE REFERENCE
+
COMMAND-LEVEL REFERENTIAL VALIDATION

Active Dedup
=
PARTIAL UNIQUE CONSTRAINT

Founder Attention
=
COMPUTE-ON-READ DERIVED PROJECTION

Founder Home
=
EXISTING /dashboard

Mutation
=
EXISTING SERVER ACTION
+
POSTGRES RPC PATTERN

Authorization
=
EXTEND EXISTING PERMISSION MAP
NOT GENERIC IAM

Automatic Detection
=
DEFER FROM FIRST SLICE

Event Infrastructure
=
NOT REQUIRED
```

---

# 113. W3 State

```text
REPOSITORY SOURCE AUDIT
=
COMPLETE

PHYSICAL DESIGN DIRECTION
=
RECOMMENDED

DETECTOR READINESS
=
CLASSIFIED

AUTHORIZATION GAP
=
IDENTIFIED

RISK DIRECTION
=
CLASSIFIED

VERIFICATION DIRECTION
=
DEFINED

IMPLEMENTATION SEQUENCING
=
RECOMMENDED

PHASE 2
=
NOT OPEN

ANTIGRAVITY IMPLEMENTATION
=
NOT AUTHORIZED
```

---

# 114. Next Engineering Artifact

The next Head Engineering artifact should be:

```text
P2-A
FOUNDER CONTROL
OPERATIONAL EXCEPTION FOUNDATION
TECHNICAL IMPLEMENTATION PLAN
```

That plan should convert this discovery into:

```text
exact schema

exact constraints

exact command signatures

exact permission matrix

exact source-reference validation

exact migration scope

exact test matrix

exact source-file scope

acceptance criteria

stop conditions
```

Only after technical plan audit should Head Engineering generate:

```text
Implementation Contract
        ↓
bounded Work Package
        ↓
Antigravity handoff
```

---

# 115. Final Principle

> **Founder Control should extend the trustworthy system MGBOS already has, not create a second platform around it.**

And:

> **The first Phase 2 change should establish durable abnormal-business truth before attempting to automate detection or add AI intelligence.**
