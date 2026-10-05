---
canonical_id: mgbos.product.teestock-founder-control
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-teestock-founder-control
document_class: product-requirements
effective_from: 2026-10-05

product_program: FOUNDER_CONTROL
maturity: PRD_MATURE
design_readiness: READY_FOR_SUPPORTING_PRODUCT_SPECS
engineering_readiness: NOT_READY_FOR_ENGINEERING
implementation_status: PRODUCT_DEFINITION_ONLY

repository_baseline:
  repository: Rizkybuilds/bisnishub
  branch: main
  commit: d0686b7f752c85a090c4f719d4aeb974451418c5
  reviewed_at: 2026-10-05

authoritative_for:
  - Founder Control parent product problem
  - Founder Control target product outcomes
  - Founder Control actor model
  - Founder Control parent scope
  - Founder Control product-level functional requirements
  - Founder Control business-rule constraints
  - Founder Control non-functional product requirements
  - Founder Control parent acceptance criteria
  - Founder Control product risks
  - Founder Control product decision record
  - downstream D2 D3 D4 requirement routing

not_authoritative_for:
  - TeeStock commercial policy
  - exact attention taxonomy
  - exact attention scoring algorithm
  - exact exception taxonomy
  - exact exception lifecycle
  - MGBOS canonical entity semantics
  - MGBOS canonical state semantics
  - MGBOS business invariants
  - MGBOS authorization semantics
  - physical database schema
  - API design
  - RPC design
  - application component design
  - notification architecture
  - deployment architecture
  - operational-readiness certification
  - JARVIS runtime architecture
  - Phase 2 implementation scope
  - implementation work packages

depends_on:
  - founder-control-documentation-plan.md
  - README.md
  - ../README.md
  - ../architecture/README.md
  - ../architecture/domain-map-capability-ownership.md
  - ../architecture/canonical-data-model.md
  - ../architecture/business-state-machines.md
  - ../architecture/business-invariants.md
  - ../architecture/command-event-model.md
  - ../architecture/permission-authorization-model.md
  - ../implementation/README.md
  - ../implementation/phase-1-operating-spine/completion-report.md
  - ../implementation/phase-1-operating-spine/operator-acceptance-test.md
  - ../engineering/operational-readiness.md
  - ../../../../docs/operating-model/solo-founder-operating-system.md
  - ../../../../docs/roadmaps/solo-founder-launch-roadmap.md
  - ../../../../bisnis/teestock/07-operations/operating-model.md
  - ../../../../bisnis/teestock/07-operations/order-fulfillment.md
  - ../../../../bisnis/teestock/08-finance/financial-model.md
  - ../../../../bisnis/teestock/11-data-mgbos/mgbos-integration.md
  - ../../../../bisnis/teestock/14-roadmap/current-quarter.md

supporting_product_specs:
  - founder-attention-experience-spec.md
  - operational-exception-spec.md
  - teestock-operational-pilot-plan.md

supersedes: null
---

# MGBOS × TeeStock Founder Control PRD v1.0

## 1. Purpose

Dokumen ini adalah parent Product Requirements Document untuk:

```text
MGBOS FOUNDER CONTROL
```

dengan TeeStock sebagai primary operating context.

Founder Control menjawab pertanyaan:

> **Bagaimana MGBOS membantu solo founder mengetahui apa yang benar-benar membutuhkan perhatian, memahami kenapa hal itu penting, menentukan apa yang harus dilakukan berikutnya, dan hanya melibatkan founder ketika judgment atau authority founder memang diperlukan?**

---

# 2. Product Thesis

Canonical product thesis:

> **Phase 1 made business transactions governable. Founder Control must make founder attention governable.**

Phase 1 telah membuktikan bahwa transaksi dapat bergerak melalui operating spine.

Masalah berikutnya adalah:

```text
THE SYSTEM KNOWS
WHAT THE BUSINESS IS DOING

BUT

THE FOUNDER STILL NEEDS
A RELIABLE WAY TO KNOW
WHAT DESERVES ATTENTION
```

---

# 3. Product Objective

Founder Control harus mengubah MGBOS dari:

```text
SYSTEM OF RECORD
+
TRANSACTIONAL WORKFLOW
```

menjadi:

```text
SYSTEM OF RECORD
+
TRANSACTIONAL WORKFLOW
+
OPERATIONAL ATTENTION CONTROL
```

tanpa menjadikan:

```text
dashboard

automation

notification

JARVIS
```

sebagai sumber kebenaran bisnis baru.

---

# 4. Current Verified Product Context

Current repository evidence establishes that the Phase 1 Operating Spine is:

```text
CLOSED
```

with material coverage across:

```text
Lead
→ Customer
→ Requirement
→ Quote
→ Order
→ Invoice
→ Payment
→ Production Job
→ Production Assignment
→ Work Order / SPK
→ QC
→ Shipment
→ Actual Cost
→ Realized Margin
→ Order Completion
```

Operator acceptance is recorded as:

```text
PASS
```

with:

```text
BLOCKERS
=
0
```

within the documented Phase 1 acceptance boundary.

---

# 5. What Phase 1 Changed

Before Phase 1, material founder burden existed because the founder often had to connect individual modules mentally.

Phase 1 reduced:

```text
TRANSACTION ROUTING BURDEN
```

by making the core transaction more coherent.

Founder Control addresses the next burden:

```text
ATTENTION ROUTING BURDEN
```

---

# 6. Current Dashboard Reality

Current application source contains:

```text
/dashboard
```

with a surface labeled:

```text
FOUNDER COMMAND CENTER
```

The current surface primarily presents:

```text
organization identity

brand context

static KPI summaries

operating-track description

document-number examples

vertical-slice status
```

It does not currently provide a mature authoritative model of:

```text
material attention

operational exception

urgency

decision requirement

responsible actor

next action

exception evidence
```

Therefore:

```text
FOUNDER COMMAND CENTER LABEL
≠
FOUNDER CONTROL CAPABILITY
```

---

# 7. Business Basis

TeeStock's canonical Operating Model already requires:

```text
ONE SOURCE OF TRUTH

CLEAR OWNER

CLEAR STATUS

CLEAR NEXT ACTION

CLEAR APPROVAL

CLEAR HANDOFF

CLEAR EXCEPTION

CLEAR ECONOMICS
```

Founder Control productizes those operational principles inside MGBOS.

---

# 8. Business Management Direction

TeeStock's long-term operating direction is:

```text
NORMAL WORK
flows normally

EXCEPTIONS
receive human attention
```

Founder Control therefore does not exist to maximize founder visibility.

It exists to minimize unnecessary founder attention while preserving visibility into material abnormality.

---

# 9. Founder Attention Constraint

Founder attention is a scarce resource.

It should preferentially be spent on:

```text
HIGH IMPACT

HIGH UNCERTAINTY

HIGH RISK

HIGH LEVERAGE
```

rather than:

```text
manual status checking

remembering deadlines

searching chats

rebuilding reports

checking every order

routine reminders
```

---

# 10. Founder-by-Exception Target

Target operating model:

```text
NORMAL BUSINESS
        ↓
GOVERNED MGBOS WORKFLOW
        ↓
RESPONSIBLE ACTOR
        ↓
NO FOUNDER INTERRUPTION
```

Abnormal model:

```text
ABNORMAL CONDITION
        ↓
EXPLICIT SIGNAL
        ↓
PRIORITIZATION
        ↓
RESPONSIBLE ACTOR
        ↓
NEXT ACTION
        ↓
FOUNDER
only if materially required
```

---

# 11. Primary Product Problem

## PROB-001 — Manual Status Reconstruction

Current domain information is distributed across:

```text
Leads

Requirements

Quotes

Orders

Invoices

Payments

Production

Vendor Assignments

QC

Shipments

Costs
```

Even when each domain is correct, a founder may still need to inspect multiple modules to understand current operational risk.

Founder Control must reduce this reconstruction burden.

---

# 12. PROB-002 — Healthy and Abnormal Work Are Not Sufficiently Separated

A normal transaction and a materially problematic transaction may both exist as valid domain records.

The founder needs to know:

```text
WHICH ONE REQUIRES ATTENTION?
```

without inspecting every active record manually.

---

# 13. PROB-003 — Business State Alone Does Not Express Attention

Example:

```text
Production Job
=
IN_PRODUCTION
```

does not by itself answer:

```text
healthy?

late?

Vendor unresponsive?

customer deadline at risk?

founder decision needed?
```

Business lifecycle and attention semantics are related but not equivalent.

---

# 14. PROB-004 — Exceptions Can Remain Implicit

Conditions such as:

```text
production delay

QC failure

payment problem

missing cost

fulfillment blocker

Vendor acknowledgement gap
```

may be discoverable from individual modules but may not yet exist as one explicit operational concern that can be tracked to resolution.

---

# 15. PROB-005 — Founder May Be Interrupted for Non-Founder Work

A founder may currently become involved in work that should remain owned by:

```text
Sales

Operations

Finance

QC

Vendor coordination

deterministic automation
```

Founder Control must help separate:

```text
NEEDS ACTION
```

from:

```text
NEEDS FOUNDER
```

---

# 16. PROB-006 — No Unified Next-Action Model

Seeing current status is insufficient.

The operating model requires:

```text
CLEAR NEXT ACTION
```

Founder Control must make the next meaningful action discoverable where one exists.

---

# 17. PROB-007 — Financial Risk Can Require Manual Discovery

Business finance requires visibility into issues such as:

```text
past-due receivable

near-term obligation

payment mismatch

missing Actual Cost

unhealthy contribution / margin
```

where underlying policy and authoritative data exist.

These should not depend entirely on manual investigation.

---

# 18. PROB-008 — Production Risk Can Require Manual Discovery

Material production concerns may include:

```text
assignment not acknowledged

production late

deadline at risk

QC failed

rework active

handoff blocked

shipment blocked
```

These should become discoverable without reviewing every Production Job manually.

---

# 19. PROB-009 — AI Cannot Safely Fix Missing Operational Structure

If abnormal business conditions remain implicit, asking an LLM to infer them from raw records or chats creates fragile operational truth.

Founder Control requires deterministic and explicit foundations before JARVIS reasoning.

---

# 20. PROB-010 — Real Pilot Needs Founder-Control Evidence

The next TeeStock operating stage requires real transaction validation.

To learn from real operations, the system must be able to identify:

```text
where founder intervened

why intervention happened

what abnormality occurred

what workaround was used

what repeatedly required attention
```

without relying only on founder memory.

---

# 21. Primary Actor

## ACTOR-001 — Founder / OWNER

Primary user:

```text
OWNER
```

Current MGBOS authorization semantics define OWNER as the highest operational business authority inside the organization.

For the current solo-founder context, this actor is responsible for:

```text
material judgment

material exception approval

high-risk commercial decisions

high-impact operational decisions

capital-related decisions
```

while still remaining subject to system invariants.

---

# 22. Secondary Actors

## ACTOR-002 — Operations

Needs to understand operational work requiring action without escalating routine work unnecessarily.

## ACTOR-003 — Sales / Commercial

Needs visibility into commercial follow-up and customer-related action where applicable.

## ACTOR-004 — Finance

Needs visibility into payment, receivable, cost, and financial-control issues.

## ACTOR-005 — QC / Production Operator

Needs visibility into production/QC-related work within their responsibility.

---

# 23. System Actors

## ACTOR-006 — MGBOS

Owns authoritative business facts and deterministic business controls.

## ACTOR-007 — Deterministic Automation

May later perform predictable routing/reminder work through governed boundaries.

## ACTOR-008 — JARVIS

May later:

```text
READ

ANALYZE

SUMMARIZE

RECOMMEND

DRAFT
```

over trusted Founder Control inputs.

JARVIS is not required for Founder Control to function.

---

# 24. Primary Jobs-To-Be-Done

## JTBD-001

When I begin operating the business, I need to see what materially requires attention so I do not manually inspect every module.

## JTBD-002

When something appears abnormal, I need to understand why it is abnormal and which business object proves it.

## JTBD-003

When an item requires action, I need to know what the next valid action is.

## JTBD-004

When work belongs to another actor, I need to know who owns it without automatically taking over.

## JTBD-005

When founder judgment is truly necessary, I need that requirement surfaced explicitly.

## JTBD-006

When an issue is resolved, I need active attention to disappear without destroying historical evidence.

## JTBD-007

When the system cannot establish reliable status, I need uncertainty surfaced explicitly rather than receiving false reassurance.

---

# 25. Target Product Outcomes

## OUTCOME-001 — Attention Compression

Founder can identify material current concerns from one primary operational entrypoint.

---

# 26. OUTCOME-002 — Healthy Work Stays Quiet

Normal business that requires no intervention should not dominate founder attention.

---

# 27. OUTCOME-003 — Abnormality Becomes Explicit

Material abnormal operational conditions can be surfaced, understood, owned, and resolved.

---

# 28. OUTCOME-004 — Explainability

Every surfaced attention item explains:

```text
WHAT

WHY

SOURCE

OWNER

NEXT ACTION
```

where applicable.

---

# 29. OUTCOME-005 — Founder Escalation Is Intentional

The system distinguishes:

```text
ACTION REQUIRED
```

from:

```text
FOUNDER DECISION REQUIRED
```

---

# 30. OUTCOME-006 — Existing Business Truth Remains Canonical

Founder Control consumes authoritative MGBOS facts without creating parallel copies of:

```text
Order truth

Payment truth

Production truth

QC truth

Shipment truth

Cost truth
```

---

# 31. OUTCOME-007 — Real Operations Become Learnable

Pilot transactions generate structured evidence about:

```text
founder burden

exceptions

manual touches

workarounds

missed follow-up

repeated abnormality
```

---

# 32. OUTCOME-008 — JARVIS Receives Better Inputs Later

JARVIS can eventually reason from:

```text
structured attention

structured exceptions

trusted evidence
```

instead of reconstructing reality from raw operational noise.

---

# 33. Product Scope — IN

Founder Control v1 product scope includes:

```text
Founder-facing operational attention entrypoint

cross-domain material attention aggregation

attention reason

attention priority / urgency concept

responsible actor visibility

next-action visibility

founder-decision-required distinction

source-object traceability

drill-down to authoritative domain

operational-exception product capability

exception resolution visibility

commercial attention where policy exists

financial attention where policy exists

production attention

QC attention

fulfillment attention

Vendor-assignment attention

TeeStock Business / Custom operating context

pilot measurement support
```

---

# 34. Product Scope — OUT

Explicitly out of scope:

```text
full TeeStock storefront

full retail commerce platform

generic Opportunity domain

generic Project domain

generic Partner abstraction

full Customer Support platform

advanced Vendor marketplace

advanced Vendor ranking

full notification platform

generic workflow engine

multi-agent autonomous company

autonomous financial approvals

autonomous refund authority

autonomous contract authority

general BI platform

production deployment

backup implementation

monitoring infrastructure

full JARVIS runtime
```

---

# 35. FUTURE Scope

Potential later scope:

```text
role-specific operational queues

delegated team queues

mobile alerts

notification preferences

automation-driven remediation

customer-case integration

Vendor reliability analytics

JARVIS Morning Briefing

cross-business-unit founder control

predictive risk
```

These are not v1 requirements unless promoted separately.

---

# 36. Product Non-Goals

## NON-GOAL-001

Founder Control is not a redesign of every existing MGBOS module.

## NON-GOAL-002

Founder Control is not a replacement for authoritative domain lifecycle.

## NON-GOAL-003

Founder Control is not a mega-status system.

## NON-GOAL-004

Founder Control is not a generic notification center.

## NON-GOAL-005

Founder Control is not an excuse to introduce speculative ERP entities.

## NON-GOAL-006

Founder Control is not dependent on AI.

## NON-GOAL-007

Founder Control is not production-readiness certification.

---

# 37. Product Model Separation

The product MUST preserve:

```text
BUSINESS STATE

ATTENTION

OPERATIONAL EXCEPTION

APPROVAL

FOUNDER DECISION
```

as distinct concepts.

Canonical rule:

```text
BUSINESS STATE
≠
ATTENTION STATE
≠
EXCEPTION
≠
APPROVAL
≠
DECISION
```

---

# 38. Example Separation

Example:

```text
Production Job
=
IN_PRODUCTION

Condition
=
DELAYED

Operational Exception
=
PRODUCTION_DELAY

Attention
=
MATERIAL

Responsible Actor
=
OPERATIONS

Founder Decision Required
=
NO
```

Another example:

```text
Quote
=
DRAFT

Margin Policy
=
BELOW APPROVED FLOOR

Attention
=
MATERIAL

Approval Required
=
OWNER

Founder Decision Required
=
YES
```

Exact taxonomy belongs to D2/D3 and applicable canonical architecture.

---

# 39. Functional Requirements

## FR-001 — Primary Founder Control Entry Point

MGBOS MUST provide one primary founder-facing entrypoint for current operational attention.

The product may evolve the existing Dashboard / Command Center or use another governed application surface.

Exact UI implementation is not decided by this PRD.

---

# 40. FR-002 — Cross-Domain Attention Aggregation

The Founder Control entrypoint MUST be able to surface material attention derived from multiple applicable domains without requiring the founder to open each module individually.

Applicable sources may include:

```text
Lead

Requirement

Quote

Order

Invoice

Payment

Production Job

Production Assignment

QC

Shipment

Cost / Margin
```

---

# 41. FR-003 — Quiet Healthy Operations

Founder Control MUST NOT treat every active business object as an attention item.

A healthy active transaction SHOULD remain outside the active founder-attention queue unless another applicable rule makes it material.

---

# 42. FR-004 — Source Traceability

Every attention item MUST reference the authoritative business object or objects that justify the signal.

A user must be able to identify:

```text
WHAT OBJECT?

WHAT CURRENT FACT?

WHAT RULE / CONDITION?
```

produced the attention item.

---

# 43. FR-005 — Attention Reason

Every surfaced attention item MUST explain why it deserves attention.

Examples of reason shape:

```text
Invoice is past due.

Production deadline exceeded.

Vendor has not acknowledged current assignment.

QC result requires resolution.

Shipment cannot proceed because readiness criteria are not satisfied.

Actual Cost required for completed work is missing.
```

Exact rule definitions are downstream work.

---

# 44. FR-006 — Priority / Urgency

Founder Control MUST support a deterministic way to distinguish relative attention importance.

Exact:

```text
labels

levels

ordering

scoring

thresholds
```

belong to D2 and applicable business policy.

---

# 45. FR-007 — Responsible Actor

Where ownership can be established, an attention item MUST identify who currently owns the next operational response.

Examples:

```text
Founder

Sales

Operations

Finance

QC
```

Exact role mapping must align with MGBOS authorization semantics.

---

# 46. FR-008 — Next Action

Where a valid next action is known, Founder Control MUST make that action discoverable.

The product should answer:

```text
WHAT SHOULD HAPPEN NEXT?
```

without inventing an unauthorized action.

---

# 47. FR-009 — Founder Decision Requirement

Founder Control MUST distinguish:

```text
work requiring action
```

from:

```text
work requiring founder judgment / authority
```

The founder must not be escalated merely because an item is abnormal.

---

# 48. FR-010 — Domain Drill-Down

The founder MUST be able to navigate from a surfaced concern into the authoritative source context.

Founder Control MUST NOT force the user to act only from a summarized representation.

---

# 49. FR-011 — Authoritative-State Derivation

Attention MUST be derived from authoritative MGBOS state and approved policy/rules.

It MUST NOT depend on manually duplicated summary fields when the authoritative facts already exist elsewhere.

---

# 50. FR-012 — Operational Exception Capability

Founder Control MUST support explicit handling of material abnormal operational conditions that require tracking beyond a transient visual warning.

Detailed semantics are owned by:

```text
operational-exception-spec.md
```

---

# 51. FR-013 — Exception Resolution

A trackable operational exception MUST support a product-level concept of:

```text
OPEN

OWNED / ACKNOWLEDGED

RESOLVED
```

or equivalent lifecycle semantics sufficient to distinguish active concern from resolved history.

Exact canonical state vocabulary is NOT decided here.

---

# 52. FR-014 — Exception Evidence

A material exception MUST be explainable using relevant evidence such as:

```text
related business object

current source state

deadline

QC result

payment status

assignment status

financial fact

rule evaluation
```

as applicable.

---

# 53. FR-015 — Commercial Attention

Founder Control SHOULD support commercial attention when deterministic business policy exists.

Potential concerns include:

```text
qualified Lead requiring continuation

Quote awaiting material action

commercial approval requirement

stale commercial follow-up
```

Exact follow-up policy must not be invented by this PRD.

---

# 54. FR-016 — Receivable Attention

Where Invoice due-date and payment state establish a past-due obligation, Founder Control MUST be capable of surfacing the issue.

The signal should identify applicable:

```text
Invoice

Customer

Order

amount / outstanding context

due-date context
```

without redefining financial truth.

---

# 55. FR-017 — Payment Integrity Attention

Where authoritative payment state produces a reconciliation or allocation problem, Founder Control SHOULD surface that material condition.

Exact financial exception semantics must preserve MGBOS invariants.

---

# 56. FR-018 — Production Deadline Attention

Where a production deadline/commitment exists and current state establishes lateness or material deadline risk under approved policy, Founder Control MUST be able to surface it.

---

# 57. FR-019 — Vendor Acknowledgement Attention

Where an external production assignment requires acknowledgement and the current assignment remains unacknowledged beyond an approved operational rule, Founder Control SHOULD surface the concern.

Exact SLA is not defined by this PRD.

---

# 58. FR-020 — QC Attention

Founder Control MUST surface material QC outcomes requiring operational response.

Examples include applicable:

```text
REWORK

REJECTED

ON_HOLD
```

conditions.

It MUST preserve QC's existing domain semantics.

---

# 59. FR-021 — Fulfillment Blocker Attention

Where fulfillment cannot proceed because authoritative readiness criteria fail, Founder Control SHOULD make the blocker discoverable.

This may include:

```text
unfinished production

unresolved QC

other governed readiness blocker
```

without reimplementing shipment rules separately.

---

# 60. FR-022 — Cost Completeness Attention

Where applicable business policy requires Actual Cost before a transaction is considered economically complete, Founder Control SHOULD surface materially missing cost information.

It MUST NOT fabricate cost.

---

# 61. FR-023 — Margin Attention

Where an approved commercial/financial policy defines an unacceptable or exceptional margin condition, Founder Control SHOULD surface that condition.

This PRD does not define the numeric margin floor.

---

# 62. FR-024 — Data-Uncertainty Visibility

If Founder Control cannot establish a required signal because source data is:

```text
missing

unavailable

conflicting

stale beyond applicable tolerance
```

it MUST NOT silently classify the situation as healthy.

The uncertainty itself must become visible where material.

---

# 63. FR-025 — Active vs Historical Attention

Active attention MUST be distinguishable from resolved historical concerns.

Resolution must not require destruction of useful evidence.

---

# 64. FR-026 — No Duplicate Attention Flooding

One underlying material business concern SHOULD NOT produce multiple indistinguishable founder-attention items merely because several projections observe the same condition.

Deduplication semantics belong to D2/D3.

---

# 65. FR-027 — Organization Isolation

Founder Control MUST preserve MGBOS organization boundaries.

No attention item may expose another organization's data.

---

# 66. FR-028 — Brand Context

Where MGBOS brand context materially affects interpretation, Founder Control SHOULD make that context visible.

The founder must not mistake an issue from one active brand for another.

---

# 67. FR-029 — Existing Governed Action Reuse

When Founder Control presents an action that already exists elsewhere in MGBOS, it SHOULD route through the existing governed command/action boundary rather than create parallel mutation logic.

---

# 68. FR-030 — No Hidden State Mutation

Rendering, opening, sorting, or reading Founder Control MUST NOT silently change authoritative business state.

Observation and mutation remain separate.

---

# 69. FR-031 — Approval Awareness

Where an action requires approval, Founder Control MUST be able to indicate that:

```text
APPROVAL IS REQUIRED
```

without pretending the underlying user already possesses approval.

---

# 70. FR-032 — Owner Is Not Invariant Bypass

Founder-facing controls MUST preserve:

```text
state machines

business invariants

financial integrity

organization isolation

historical immutability
```

OWNER authority is not:

```text
bypass_all_rules()
```

---

# 71. FR-033 — JARVIS-Independent Operation

Founder Control MUST remain usable when:

```text
JARVIS
=
OFF
```

or unavailable.

---

# 72. FR-034 — Automation-Independent Truth

Founder Control MUST continue to reflect MGBOS business truth if an automation runtime such as n8n is unavailable.

Automation state and business state remain distinct.

---

# 73. FR-035 — Pilot Measurement Support

Founder Control and its supporting product model SHOULD enable collection of pilot evidence around:

```text
manual status checks

founder interventions

operational exceptions

system bypasses

manual reminders

unclear next actions

time-consuming reconstruction
```

without requiring a new general analytics platform.

---

# 74. Business Rules

## BR-001 — MGBOS Owns Business Truth

Founder Control consumes MGBOS authoritative state.

It does not become a parallel transactional database.

---

# 75. BR-002 — Normal Work Should Be Quiet

Healthy work requiring no material action should not compete aggressively for founder attention.

---

# 76. BR-003 — Material Abnormality Should Be Explicit

If a condition materially threatens:

```text
customer outcome

cash

margin

quality

delivery

operational continuity

business integrity
```

and an approved deterministic rule can establish that condition, the product should be capable of surfacing it.

---

# 77. BR-004 — Founder Escalation Is Selective

Founder should preferentially receive:

```text
STRATEGIC

HIGH-RISK

HIGH-VALUE

UNUSUAL
```

decisions as TeeStock matures.

Routine operational work should remain with the appropriate actor/system.

---

# 78. BR-005 — Deterministic Before AI

If a condition can reliably be expressed as:

```text
IF authoritative fact X
AND policy Y
THEN attention Z
```

prefer deterministic implementation.

---

# 79. BR-006 — AI Is Not Business Authority

JARVIS or another model MAY later explain or prioritize an already trustworthy attention set.

It MUST NOT become the only mechanism determining authoritative business truth.

---

# 80. BR-007 — Attention Does Not Mutate Lifecycle

An attention classification MUST NOT change canonical business lifecycle state merely to make the dashboard easier to implement.

---

# 81. BR-008 — Delay Is A Condition, Not Necessarily A Lifecycle State

Where canonical architecture already defines a condition such as:

```text
Production status
=
IN_PRODUCTION

Condition
=
DELAYED
```

Founder Control must preserve that separation.

---

# 82. BR-009 — Approval Is Not Permission

An actor may possess permission to work with an object while a specific exceptional action still requires separate approval.

Founder Control must preserve this distinction.

---

# 83. BR-010 — Approval Is Not Invariant Override

Even OWNER-approved actions must continue to satisfy applicable:

```text
state validity

money arithmetic

historical integrity

organization isolation
```

---

# 84. BR-011 — Opportunity Remains Deferred

Founder Control MUST NOT introduce a generic Opportunity entity merely to improve attention grouping.

Current commercial flow may continue:

```text
Lead
→ Qualified
→ Requirement
→ Quote
```

until independent Opportunity lifecycle evidence exists.

---

# 85. BR-012 — Generic Project Remains Deferred

Founder Control MUST NOT introduce generic Project solely to group Custom/Business operations.

Use current:

```text
Requirement
+
Order
+
Production Jobs
```

until repeated operational evidence proves the need for independent Project semantics.

---

# 86. BR-013 — Work Order Remains Current Artifact Model

Founder Control must not silently promote Work Order/SPK into a new aggregate.

Current artifact semantics remain authoritative until architecture promotion is justified.

---

# 87. BR-014 — Operational Exception ≠ Customer Case

Do not assume all operational exceptions are customer-facing cases.

Example:

```text
Vendor late
```

may be internal operational exception.

Example:

```text
Customer quality complaint
```

may require Customer Case semantics.

D3 must define the boundary.

---

# 88. BR-015 — Missing Information Is Not Normal

Missing required information must not be silently interpreted as:

```text
NO PROBLEM
```

where that information is required to determine safety/materiality.

---

# 89. BR-016 — No Invented Threshold

The product MUST NOT invent numeric thresholds for:

```text
late

high value

low margin

material amount

follow-up age

Vendor response SLA
```

without an authoritative policy or explicit product decision.

---

# 90. BR-017 — One Exception Should Have One Durable Meaning

Different UI views may project the same exception.

They must not create conflicting operational truth.

---

# 91. BR-018 — Founder Control Is Read-First

Founder Control v1 is primarily an:

```text
OBSERVE

UNDERSTAND

PRIORITIZE

ROUTE
```

product layer.

Consequential actions remain governed by their underlying domain command boundaries.

---

# 92. Non-Functional Requirements

## NFR-001 — Determinism

Given the same:

```text
authoritative state
+
applicable policy
+
time context
```

the same deterministic attention rule SHOULD produce the same classification.

---

# 93. NFR-002 — Explainability

Every material attention item MUST be explainable without requiring interpretation of hidden AI reasoning.

---

# 94. NFR-003 — Traceability

A user MUST be able to trace a surfaced concern to the authoritative source object and relevant evidence.

---

# 95. NFR-004 — Security

Founder Control MUST preserve:

```text
authentication

organization isolation

role/capability authorization
```

for all source objects and actions.

---

# 96. NFR-005 — Read Safety

Loading Founder Control MUST be safe and non-destructive.

A read failure must not mutate business state.

---

# 97. NFR-006 — Graceful Incompleteness

When one required source cannot be evaluated, Founder Control SHOULD communicate:

```text
INCOMPLETE

UNAVAILABLE

UNKNOWN
```

rather than displaying false healthy state.

---

# 98. NFR-007 — No Required AI Provider

Core Founder Control functionality MUST NOT depend on availability of a third-party LLM provider.

---

# 99. NFR-008 — Existing Domain Integrity

Founder Control implementation MUST preserve existing domain invariants.

It may project business facts.

It must not create shortcut mutation paths.

---

# 100. NFR-009 — Machine-Readable Semantics

Attention and exception outputs SHOULD be structured enough that future:

```text
automation

JARVIS

reporting

testing
```

can consume them without parsing presentation text.

Exact representation is architecture work.

---

# 101. NFR-010 — Bounded Complexity

Founder Control v1 MUST prefer minimum sufficient capability over:

```text
generic workflow framework

generic rule engine

general notification platform

distributed event infrastructure
```

unless current requirements prove them necessary.

---

# 102. Primary Product Journey

Target journey:

```text
FOUNDER OPENS MGBOS
        ↓
FOUNDER CONTROL LOADS
        ↓
SYSTEM SURFACES MATERIAL ATTENTION
        ↓
FOUNDER SEES:
WHAT
WHY
URGENCY
OWNER
NEXT ACTION
DECISION NEED
        ↓
FOUNDER DRILLS INTO SOURCE
        ↓
EXISTING GOVERNED ACTION
OR
EXPLICIT DECISION
        ↓
SOURCE BUSINESS STATE CHANGES
        ↓
ATTENTION RE-EVALUATES
        ↓
RESOLVED ISSUE LEAVES ACTIVE QUEUE
```

---

# 103. Healthy Journey

Example healthy operation:

```text
Order
=
ACTIVE

Production
=
IN_PRODUCTION

deadline
=
not breached

Vendor
=
accepted

QC
=
not yet due

Payment
=
within terms
```

Expected Founder Control behavior:

```text
NO MATERIAL FOUNDER ATTENTION
```

unless another applicable rule establishes concern.

---

# 104. Production Delay Journey

Example:

```text
Production
=
IN_PRODUCTION

deadline
=
breached
```

Expected:

```text
attention surfaced

reason visible

Production Job linked

responsible actor visible

next operational action visible

founder decision required
only if policy/materiality requires it
```

---

# 105. QC Failure Journey

Example:

```text
QC
=
REJECTED
```

Expected:

```text
material concern visible

Production Job / QC evidence linked

normal fulfillment not shown as healthy

resolution path discoverable
```

---

# 106. Receivable Journey

Example:

```text
Invoice
=
OUTSTANDING

due date
<
current date
```

subject to canonical invoice/payment semantics.

Expected:

```text
past-due attention visible

Customer / Order / Invoice traceable

responsible actor known

collection next action discoverable
```

---

# 107. Founder Decision Journey

Example:

```text
Quote margin
<
approved policy floor
```

Expected:

```text
commercial issue visible

approval requirement visible

founder decision explicitly requested

approval applies to specific business context

no general permission expansion
```

---

# 108. Uncertainty Journey

Example:

```text
required data source
=
unavailable
```

Expected:

```text
DO NOT
show "all clear"
```

Instead:

```text
status confidence incomplete

affected scope identifiable

manual verification required if material
```

---

# 109. D2 Contract — Founder Attention Experience

D2 must define detailed product semantics for:

```text
Founder Home

Attention Queue

attention grouping

priority

urgency

ordering

waiting

overdue

responsible actor

decision required

next action

evidence presentation

drill-down

empty state

unknown state

resolved-state presentation

deduplication experience
```

D1 intentionally does not define the detailed UI/state vocabulary.

---

# 110. D3 Contract — Operational Exception

D3 must define:

```text
what qualifies as operational exception

exception category

severity

materiality

source

ownership

acknowledgement

resolution

dismissal

reopen

deduplication

history

customer-case boundary

technical-incident boundary

automation-failure boundary
```

D3 does not independently select physical database architecture.

---

# 111. D4 Contract — Real Operational Pilot

D4 must define:

```text
pilot scope

real transaction boundary

approved environment

readiness gate

pilot evidence

founder-friction measurement

exception measurement

manual fallback

stop conditions

pilot exit criteria
```

D1 does not invent pilot volume or commercial targets.

---

# 112. Success Measurement Philosophy

Founder Control success is not:

```text
number of dashboard cards

number of alerts

number of exception types

number of automations
```

It is:

```text
LESS MANUAL RECONSTRUCTION

LESS FOUNDER STATUS HUNTING

CLEARER NEXT ACTION

BETTER EXCEPTION VISIBILITY

LESS UNNECESSARY FOUNDER INTERRUPTION

TRUSTWORTHY BUSINESS ATTENTION
```

---

# 113. Product Success Metrics

## METRIC-001 — Manual Status Checks

Measure how often the founder must leave Founder Control and manually inspect multiple modules merely to determine what needs attention.

---

# 114. METRIC-002 — Founder Interventions Per Transaction

Measure material founder interventions.

Classify:

```text
required judgment

routine workaround

missing system capability

unclear process
```

where practical.

---

# 115. METRIC-003 — Manual Touch Count

Track human interventions required for representative transactions.

This aligns with TeeStock's existing operational maturity model.

---

# 116. METRIC-004 — Attention Explainability

Measure whether an attention item has:

```text
reason

source

owner

next action
```

without manual reconstruction.

---

# 117. METRIC-005 — False Positive Attention

Track attention items repeatedly surfaced that do not require meaningful action.

High false positives create attention fatigue.

---

# 118. METRIC-006 — Missed Material Condition

Track material operational issues that occur without being surfaced when Founder Control should have detected them.

---

# 119. METRIC-007 — System Bypass

Track cases requiring:

```text
spreadsheet truth

chat-only coordination

manual SQL

manual hidden calculation

out-of-band state correction
```

for Founder Control-relevant operations.

---

# 120. METRIC-008 — Exception Resolution Visibility

Track whether material abnormal conditions can be followed from discovery to resolution without disappearing into chat or memory.

---

# 121. Numeric Target Policy

D1 intentionally does not invent targets such as:

```text
80% fewer interventions

under 2 minute review

zero exceptions

95% automation
```

without pilot baseline.

Numeric success thresholds belong to D4 after baseline evidence is available.

---

# 122. Product Acceptance Criteria

## AC-001 — Healthy Operations Stay Quiet

Given a transaction where all evaluated conditions are within approved operating expectations:

```text
Founder Control
MUST NOT
create false urgent attention.
```

---

# 123. AC-002 — Past-Due Receivable Is Discoverable

Given an Invoice that is authoritatively past due and has outstanding balance:

Founder Control must expose a traceable attention item containing sufficient context to identify:

```text
Invoice

Customer

related Order

reason

next action / owner
```

according to approved product semantics.

---

# 124. AC-003 — Production Delay Is Discoverable

Given a Production Job that violates an approved deterministic deadline rule:

Founder Control must surface the concern without changing the underlying Production state merely to represent lateness.

---

# 125. AC-004 — QC Failure Is Discoverable

Given a material QC failure:

Founder Control must surface the condition and provide traceability to the relevant QC/Production context.

---

# 126. AC-005 — Fulfillment Blocker Is Discoverable

Given a Shipment/fulfillment attempt that cannot proceed because an authoritative readiness condition is unsatisfied:

Founder Control must make the blocker understandable.

---

# 127. AC-006 — Missing Cost Can Be Surfaced

Given a transaction for which approved policy says Actual Cost should already exist but the authoritative cost is missing:

Founder Control must be able to surface that gap without estimating the missing value.

---

# 128. AC-007 — Founder Need Is Explicit

Given an abnormal condition that does not require founder authority:

```text
Founder Decision Required
=
NO
```

or equivalent meaning must be representable.

Given a governed condition that requires OWNER approval:

```text
Founder Decision Required
=
YES
```

must be representable.

---

# 129. AC-008 — Source Traceability Works

For every active attention item in the acceptance set:

the user can identify and access the authoritative business object supporting it.

---

# 130. AC-009 — Resolution Removes Active Attention

When authoritative business state establishes that the underlying material problem is resolved:

the concern must leave active attention according to approved semantics while historical evidence remains available where required.

---

# 131. AC-010 — No Read Mutation

Opening Founder Control repeatedly without taking an explicit action must not mutate authoritative transactional business state.

---

# 132. AC-011 — Organization Isolation Holds

A user from organization A must not receive Founder Control attention derived from organization B.

---

# 133. AC-012 — Invariant Enforcement Holds

An action initiated from Founder Control must not bypass the same business invariants that apply when the action is initiated from its native domain surface.

---

# 134. AC-013 — JARVIS Can Be Disabled

With JARVIS unavailable:

core Founder Control attention remains usable.

---

# 135. AC-014 — Automation Can Be Unavailable

With automation unavailable:

authoritative business state and deterministic Founder Control results remain valid.

Automation failure may itself become visible where material.

---

# 136. AC-015 — Unknown Does Not Become Healthy

When a required source cannot be evaluated:

Founder Control must not silently report that area as healthy.

---

# 137. AC-016 — Phase 1 Flow Remains Valid

Founder Control implementation must not regress the core Phase 1 operating-spine journey.

---

# 138. AC-017 — No New Opportunity Dependency

Founder Control acceptance must not require creation of a generic Opportunity entity.

---

# 139. AC-018 — No New Project Dependency

Founder Control acceptance must not require creation of a generic Project entity.

---

# 140. AC-019 — Pilot Can Operate Assisted-Sales

Founder Control product design must support the planned TeeStock Business/Custom assisted-sales operating context without requiring completion of the full public storefront.

---

# 141. AC-020 — Product Remains Evidence-Driven

Any new entity proposed during architecture/engineering must map to an approved product requirement or documented repeated operational evidence.

---

# 142. Risks

## RISK-001 — Dashboard Theater

Risk:

The team builds visually impressive cards that do not reduce founder work.

Mitigation:

Every major surface must map to:

```text
problem

action

decision

exception

evidence
```

---

# 143. RISK-002 — Alert Fatigue

Risk:

Too many items cause the founder to ignore the system.

Mitigation:

Healthy work stays quiet.

D2 must define materiality, prioritization, grouping, and deduplication.

---

# 144. RISK-003 — Mega-State Architecture

Risk:

Attention semantics get inserted into Order/Production lifecycle states.

Mitigation:

Preserve:

```text
BUSINESS STATE
≠
ATTENTION
```

---

# 145. RISK-004 — Duplicate Business Truth

Risk:

Founder Control stores copies of authoritative domain status and they drift.

Mitigation:

Prefer projections/references over independent duplicate truth.

Architecture review decides required persistence.

---

# 146. RISK-005 — Premature Operational Exception Entity

Risk:

Product need gets translated directly into a new root table/aggregate.

Mitigation:

D3 first defines product semantics.

Architecture then determines representation.

---

# 147. RISK-006 — AI Hallucination

Risk:

AI inference creates false operational concern or false reassurance.

Mitigation:

Core attention deterministic first.

AI may explain trusted facts later.

---

# 148. RISK-007 — Undefined Thresholds

Risk:

Engineering invents arbitrary:

```text
lateness

margin floor

high-value amount

follow-up timeout
```

Mitigation:

Unknown policy remains explicit and is resolved by the appropriate semantic owner.

---

# 149. RISK-008 — Founder Becomes Default Assignee

Risk:

Every exception reaches OWNER because Founder Control is founder-facing.

Mitigation:

Separate:

```text
RESPONSIBLE ACTOR
```

from:

```text
FOUNDER DECISION REQUIRED
```

---

# 150. RISK-009 — Founder Control Becomes Notification Platform

Risk:

Scope expands into email, WhatsApp, push, SMS, and external alert infrastructure before core attention semantics are stable.

Mitigation:

Notification channels are out of parent v1 scope unless separately promoted.

---

# 151. RISK-010 — Production Readiness Confusion

Risk:

Founder Control software completion is mistaken for permission to run production transactions.

Mitigation:

Operational readiness remains separately governed.

---

# 152. RISK-011 — Performance Through Unbounded Cross-Domain Queries

Risk:

A naive Founder Home performs expensive live queries across every operational table.

Mitigation:

Architecture/engineering must select bounded read-model/query strategy after product semantics are stable.

This PRD does not prescribe the solution.

---

# 153. RISK-012 — Hidden Policy Inside UI

Risk:

Materiality/priority business rules exist only in component code.

Mitigation:

Rules that affect business interpretation must have an explicit semantic owner and deterministic tests where applicable.

---

# 154. Assumptions

## ASM-001 — TeeStock Is Primary Validation Context

Founder Control will initially be validated through TeeStock operations.

Impact if false:

Product examples and pilot scope may require adjustment.

---

# 155. ASM-002 — Business + Custom Remain Primary Q4 Vertical

Current TeeStock roadmap prioritizes:

```text
TEEStock BUSINESS
+
TEEStock CUSTOM
```

for Q4.

This provides the primary initial operational context.

---

# 156. ASM-003 — Assisted Sales Is Sufficient for Initial Validation

A complete customer self-service storefront is not assumed necessary for the first Founder Control pilot.

If future pilot design requires self-service commerce, D4 must update the dependency.

---

# 157. ASM-004 — Existing Spine Remains Primary Transactional Backbone

Founder Control assumes the Phase 1 operating spine remains the primary near-term backbone.

Current-source audit must verify this again before engineering.

---

# 158. Unknowns

## UNK-001 — Exact Attention Taxonomy

To be resolved in D2.

---

# 159. UNK-002 — Exact Priority Vocabulary

Potential forms may include:

```text
critical

high

normal

waiting
```

but no taxonomy is approved by D1.

D2 owns this.

---

# 160. UNK-003 — Exact Materiality Rules

Exact thresholds for:

```text
late

high-value

low margin

collection urgency

Vendor response
```

remain policy-specific.

---

# 161. UNK-004 — Operational Exception Canonical Representation

Product need is established.

Architecture representation is not.

Possible representation must be decided after D3.

---

# 162. UNK-005 — Exception Severity Model

TeeStock business documentation proposes concepts such as:

```text
LOW

MEDIUM

HIGH

CRITICAL
```

but D3 must reconcile the final product model before architecture adoption.

---

# 163. UNK-006 — Customer Case Boundary

Exact relationship between:

```text
Customer Case

Operational Exception
```

requires D3 and future Customer Case work.

---

# 164. UNK-007 — Notification Channels

No decision yet on:

```text
in-app only

email

WhatsApp

push

other channel
```

for Founder Control notifications.

Not required to define core attention semantics.

---

# 165. UNK-008 — Real Pilot Volume

D1 does not set the number of transactions required for the real operational pilot.

D4 owns pilot design.

---

# 166. UNK-009 — Production Environment

Current operational-readiness register does not certify production environment readiness.

D4 must obey the applicable readiness gate.

---

# 167. UNK-010 — RPO / RTO

Current readiness register identifies RPO and RTO as not yet set by Owner.

These are operational-risk decisions, not Founder Control product decisions.

---

# 168. Product Decisions

## DEC-001 — Founder Control Is The Next MGBOS Product Program

Status:

```text
DECIDED
```

Decision:

After Phase 1 closure, current MGBOS product work focuses on Founder Control rather than reopening the operating-spine backlog.

---

# 169. DEC-002 — Founder Control Is Founder-by-Exception

Status:

```text
DECIDED
```

Decision:

Founder Control should reduce unnecessary founder attention rather than maximize visibility.

---

# 170. DEC-003 — Deterministic-First

Status:

```text
DECIDED
```

Decision:

Deterministically knowable attention conditions should use deterministic product/system semantics before AI reasoning.

---

# 171. DEC-004 — JARVIS Is Not Required For V1

Status:

```text
DECIDED
```

Decision:

Founder Control must remain useful without JARVIS runtime.

---

# 172. DEC-005 — Existing Business Domains Remain Authoritative

Status:

```text
DECIDED
```

Decision:

Founder Control projects and coordinates attention over existing MGBOS domain truth.

It does not replace those domains.

---

# 173. DEC-006 — No Generic Opportunity For Founder Control

Status:

```text
DECIDED
```

Decision:

Founder Control v1 must not require Opportunity.

---

# 174. DEC-007 — No Generic Project For Founder Control

Status:

```text
DECIDED
```

Decision:

Founder Control v1 must not require generic Project.

---

# 175. DEC-008 — Operational Exception Is A Product Capability Candidate

Status:

```text
DECIDED
```

Decision:

Explicit Operational Exception semantics belong in the Founder Control product package.

Physical/canonical representation remains undecided until D3 and architecture review.

---

# 176. DEC-009 — Public Storefront Is Not A Founder Control Prerequisite

Status:

```text
DECIDED
```

Decision:

Initial TeeStock Business/Custom Founder Control validation may use assisted sales.

---

# 177. DEC-010 — Current Dashboard Label Is Not Product Completion

Status:

```text
DECIDED
```

Decision:

The current `FOUNDER COMMAND CENTER` label does not constitute evidence that Founder Control requirements are already implemented.

---

# 178. DEC-011 — Read-First Product Layer

Status:

```text
DECIDED
```

Decision:

Founder Control v1 primarily focuses on:

```text
OBSERVE

PRIORITIZE

UNDERSTAND

ROUTE
```

while consequential mutations remain owned by governed domain commands.

---

# 179. DEC-012 — D1 Does Not Authorize Engineering

Status:

```text
DECIDED
```

Decision:

This active parent PRD is not an implementation handoff.

Engineering remains blocked until supporting product specs, architecture review, and Engineering Discovery satisfy the entry gate.

---

# 180. Product Dependency — Phase 1

Founder Control depends on Phase 1 because reliable attention requires reliable source state.

This does not mean Phase 1 must be reopened.

Relationship:

```text
PHASE 1
provides transactional truth

FOUNDER CONTROL
provides attention control
```

---

# 181. Product Dependency — Operational Readiness

Founder Control can be developed before full production readiness.

However:

```text
REAL BUSINESS PILOT

PRODUCTION RELEASE
```

remain subject to operational-readiness gates.

---

# 182. Product Dependency — TeeStock Business Policy

Attention rules requiring commercial policy must defer to TeeStock business authority.

Examples:

```text
margin floor

payment term

Vendor SLA

customer follow-up SLA

material-value threshold
```

must not be invented inside MGBOS engineering.

---

# 183. Product Dependency — Canonical Architecture

If D2/D3 require new system semantics:

```text
architecture impact review
```

must determine whether current MGBOS architecture can represent them.

---

# 184. Product Dependency — Permission Model

Founder Control must compose with current roles/capabilities.

The product must not assume:

```text
founder-facing
=
every action allowed
```

---

# 185. Product Dependency — Current Time

Some attention signals depend on current time, for example:

```text
overdue

late

due soon
```

Architecture/engineering must define reliable time evaluation and testing.

D1 only establishes the product need.

---

# 186. Founder Home Product Direction

Founder Home should answer, in decreasing order of importance:

```text
WHAT NEEDS ATTENTION?

WHY?

WHAT HAPPENS IF NOTHING IS DONE?

WHO OWNS IT?

WHAT SHOULD HAPPEN NEXT?

DO I NEED TO DECIDE?
```

rather than maximizing operational data density.

---

# 187. Attention Queue Product Direction

Founder should be able to distinguish at minimum:

```text
material active attention

waiting / dependency-bound work

decision-required work

resolved / historical context
```

Exact presentation and vocabulary belong to D2.

---

# 188. Founder Decision Product Direction

When founder judgment is required, the system should present enough context to decide without forcing the founder to reconstruct the entire case.

Useful context may include:

```text
business object

material facts

current state

reason for escalation

relevant amount

deadline

available governed actions

supporting evidence
```

depending on issue type.

---

# 189. No Decision Recommendation Requirement Yet

D1 does not require AI-generated:

```text
recommended decision
```

for v1.

A deterministic attention item can be valuable even if decision preparation remains manual.

---

# 190. Attention Resolution Principle

Attention should generally resolve because authoritative underlying business facts changed or an approved exception lifecycle changed.

Avoid arbitrary:

```text
hide card
=
problem solved
```

semantics.

---

# 191. Dismissal Principle

If D3 permits dismissal:

```text
DISMISSED
```

must have clear product meaning distinct from:

```text
RESOLVED
```

A founder hiding an issue must not silently rewrite operational truth.

---

# 192. Reopen Principle

If a resolved abnormal condition reoccurs or underlying facts regress, the product must be capable of representing renewed attention without destroying prior resolution history.

Exact semantics belong to D3.

---

# 193. Deduplication Principle

Founder Control should avoid:

```text
Invoice overdue

Order at financial risk

Customer balance overdue

Payment needed
```

appearing as four unrelated founder problems when they represent one underlying concern.

D2/D3 must define grouping without hiding materially different concerns.

---

# 194. Explainability Principle

No founder-attention item should depend on:

```text
"AI thinks this is important"
```

as its sole explanation.

The product must be able to point to business evidence.

---

# 195. False-Reassurance Principle

Founder Control must be conservative about:

```text
ALL CLEAR
```

when required data is unavailable.

False reassurance is more dangerous than visible uncertainty.

---

# 196. Founder-Control Data Principle

Founder Control data should primarily consist of:

```text
REFERENCES

DERIVED CONDITIONS

EXPLICIT EXCEPTION FACTS

OWNERSHIP

ACTION / DECISION CONTEXT
```

not duplicated transactional master records.

Architecture decides the exact representation.

---

# 197. Product Validation Questions

D4 must help answer:

```text
Did Founder Control reduce status hunting?

Did it catch real material problems?

Did it generate noise?

Did it miss material issues?

Did founder involvement become more selective?

Were next actions clearer?

Did real operations reveal missing domains?

Did any workaround bypass MGBOS?

Was any threshold wrong?
```

---

# 198. Product Failure Conditions

Founder Control v1 should be considered product-invalid if real validation shows recurring conditions such as:

```text
founder still checks every module manually

attention queue is mostly noise

important problems are regularly missed

signals cannot be explained

signals depend on hidden manual state

the system regularly requires database investigation

healthy work constantly interrupts founder

Founder Control becomes a second source of transactional truth
```

---

# 199. Engineering Entry Gate

This PRD does NOT pass the engineering-entry gate by itself.

Before:

```text
PRD_READY_FOR_ENGINEERING
```

all must be sufficiently true:

```text
D2 Founder Attention spec
=
ACTIVE / mature

D3 Operational Exception spec
=
ACTIVE / mature

D4 Real Pilot plan
=
ACTIVE / bounded

cross-document product audit
=
PASS

material business policy
=
resolved or explicitly deferred

architecture impact
=
reconciled

current implementation audit
=
completed

routing / risk
=
resolved
```

---

# 200. Phase 2 Directory Gate

Do NOT create:

```text
systems/mgbos/docs/implementation/
phase-2-founder-control/
```

because this PRD now exists.

Creation requires Engineering Discovery readiness.

---

# 201. Architecture Promotion Gate

When D2/D3 are mature, evaluate each requirement:

```text
CAN CURRENT CANONICAL
MGBOS SEMANTICS
REPRESENT THIS?
```

If:

```text
YES
```

reuse existing semantics.

If:

```text
NO
```

change the minimum canonical owner required.

---

# 202. Likely Architecture Review Areas

Potentially affected canonical sources include:

```text
canonical-data-model.md

business-state-machines.md

business-invariants.md

command-event-model.md

permission-authorization-model.md

domain-map-capability-ownership.md
```

This is a review set.

It is not a requirement that every file change.

---

# 203. No Architecture-by-PRD

D1 MUST NOT be interpreted as approval for:

```text
operational_exceptions table

attention_items table

new event bus

new cache

new notification service

new queue

new workflow engine
```

These are implementation/architecture possibilities, not product decisions.

---

# 204. No Implementation-by-UI Mock

A future screen specification must not become architecture authority.

Example:

```text
UI says "High"
```

does not automatically create:

```text
attention.severity = HIGH
```

as canonical persisted state.

Semantic ownership must be resolved explicitly.

---

# 205. Current Product Maturity

This document is:

```text
STATUS
=
ACTIVE

MATURITY
=
PRD_MATURE
```

Meaning:

```text
parent problem
=
bounded

actors
=
defined

scope
=
defined

outcomes
=
defined

parent requirements
=
defined

constraints
=
defined

risks
=
defined

supporting-spec contracts
=
defined
```

---

# 206. Why It Is Not PRD_READY_FOR_ENGINEERING

Detailed product semantics remain intentionally delegated to:

```text
D2
Founder Attention Experience

D3
Operational Exception

D4
Real Operational Pilot
```

and architecture impact has not yet been reconciled.

Therefore:

```text
ENGINEERING READINESS
=
NOT_READY_FOR_ENGINEERING
```

is the correct state.

---

# 207. Requirement Traceability

Current parent trace examples:

```text
PROB-001
Manual Status Reconstruction
        ↓
OUTCOME-001
Attention Compression
        ↓
FR-001
Primary Founder Control Entry Point
        ↓
FR-002
Cross-Domain Attention Aggregation
        ↓
D2
Founder Attention Experience
```

---

# 208. Exception Trace

```text
PROB-004
Exceptions Can Remain Implicit
        ↓
OUTCOME-003
Abnormality Becomes Explicit
        ↓
FR-012
Operational Exception Capability
        ↓
D3
Operational Exception Spec
        ↓
Architecture Impact Review
```

---

# 209. Pilot Trace

```text
PROB-010
Real Pilot Needs Founder-Control Evidence
        ↓
OUTCOME-007
Real Operations Become Learnable
        ↓
FR-035
Pilot Measurement Support
        ↓
D4
Real Operational Pilot Plan
```

---

# 210. Founder-Escalation Trace

```text
PROB-005
Founder Interrupted For Non-Founder Work
        ↓
OUTCOME-005
Founder Escalation Is Intentional
        ↓
FR-007
Responsible Actor

FR-009
Founder Decision Requirement
        ↓
D2
Attention & Decision Experience
```

---

# 211. Product Package Reading Order

For Founder Control product work:

```text
1.
founder-control-documentation-plan.md

2.
teestock-founder-control-prd.md

3.
founder-attention-experience-spec.md
when created

4.
operational-exception-spec.md
when created

5.
teestock-operational-pilot-plan.md
when created
```

---

# 212. Engineering Reading Rule

Engineering MUST NOT use this PRD alone as:

```text
IMPLEMENT EVERYTHING IN THIS FILE
```

The PRD includes:

```text
product outcomes

future boundaries

supporting requirements

architecture questions
```

that must first be converted into bounded engineering work.

---

# 213. Builder Safety Rule

Antigravity must eventually receive:

```text
exact base revision

approved Implementation Contract

bounded Work Package

allowed paths

forbidden scope

requirement IDs

invariants

tests

stop conditions
```

not this PRD as open-ended Builder authority.

---

# 214. Product Decision Authority

Owner remains final business/product decision maker.

Downstream engineering may make bounded implementation decisions only within current repository governance.

No implementation convenience may silently alter:

```text
FR

BR

DEC
```

defined here.

---

# 215. Change-Control Rule

Material changes to:

```text
product thesis

primary actors

core scope

Founder-by-Exception principle

deterministic-first principle

JARVIS boundary

Opportunity / Project decisions

primary pilot context
```

require an explicit PRD revision.

---

# 216. Supporting-Spec Change Rule

Changes that only refine:

```text
attention presentation

priority labels

exception categories

pilot procedure
```

may be owned by D2/D3/D4 where they do not contradict this parent PRD.

---

# 217. Current Program Status

```text
W0
Current-State Documentation Reconciliation
=
SUFFICIENT FOR D1 AUTHORING

D0
Founder Control Documentation Plan
=
ACTIVE

D1
Founder Control PRD
=
ACTIVE / PRD_MATURE

D2
Founder Attention Experience
=
NEXT

D3
Operational Exception
=
AFTER D2

D4
Real Operational Pilot Plan
=
AFTER D3

ARCHITECTURE RECONCILIATION
=
NOT STARTED

PHASE 2 IMPLEMENTATION
=
NOT OPEN
```

---

# 218. Next Product Artifact

Next document:

```text
systems/mgbos/docs/product/
founder-attention-experience-spec.md
```

Purpose:

> **Define exactly how authoritative business conditions become a useful founder-facing attention and decision experience without collapsing business state, exception state, approval, and founder judgment into one concept.**

---

# 219. Final Product Principle

Founder Control is successful when:

```text
THE BUSINESS
CAN HAVE MANY ACTIVE THINGS

WITHOUT

THE FOUNDER
NEEDING TO WATCH EVERYTHING
```

Target:

```text
NORMAL
→ QUIET

ABNORMAL
→ EXPLICIT

ACTIONABLE
→ OWNED

MATERIAL
→ PRIORITIZED

FOUNDER JUDGMENT
→ REQUESTED

RESOLVED
→ TRACEABLE
```

The product must therefore optimize not for maximum visibility, but for:

```text
TRUSTWORTHY ATTENTION
```

over:

```text
TRUSTWORTHY BUSINESS TRUTH
```

without weakening either.

That is the product definition of **MGBOS Founder Control v1**.
