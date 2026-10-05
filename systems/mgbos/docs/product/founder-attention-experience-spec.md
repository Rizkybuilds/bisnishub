---
canonical_id: mgbos.product.founder-attention-experience
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-founder-control-attention
document_class: product-experience-specification
effective_from: 2026-10-05

parent_product:
  canonical_id: mgbos.product.teestock-founder-control
  version: 1.0

product_program: FOUNDER_CONTROL
maturity: SPEC_MATURE
design_readiness: READY_FOR_OPERATIONAL_EXCEPTION_SPEC
engineering_readiness: NOT_READY_FOR_ENGINEERING
implementation_status: PRODUCT_SPECIFICATION_ONLY

repository_baseline:
  repository: Rizkybuilds/bisnishub
  branch: main
  commit: d0686b7f752c85a090c4f719d4aeb974451418c5
  reviewed_at: 2026-10-05

authoritative_for:
  - Founder Control attention experience semantics
  - founder-facing attention classification
  - founder-facing decision-required semantics
  - attention priority semantics
  - attention urgency semantics
  - responsible-actor presentation
  - next-action presentation
  - waiting and watch semantics
  - unknown and incomplete-coverage semantics
  - Founder Home information architecture
  - attention ordering behavior
  - attention grouping and deduplication product rules
  - attention source traceability requirements
  - Founder Control empty-state semantics
  - product-level attention acceptance criteria

not_authoritative_for:
  - operational-exception canonical entity representation
  - operational-exception persistence model
  - operational-exception canonical lifecycle
  - TeeStock commercial thresholds
  - margin-floor values
  - payment-term values
  - vendor-response SLA values
  - exact database schema
  - SQL view design
  - API design
  - RPC design
  - cache design
  - notification infrastructure
  - event infrastructure
  - JARVIS runtime
  - implementation work packages
  - production-readiness certification

depends_on:
  - teestock-founder-control-prd.md
  - founder-control-documentation-plan.md
  - README.md
  - ../architecture/domain-map-capability-ownership.md
  - ../architecture/business-state-machines.md
  - ../architecture/business-invariants.md
  - ../architecture/permission-authorization-model.md
  - ../implementation/phase-1-operating-spine/completion-report.md
  - ../implementation/phase-1-operating-spine/operator-acceptance-test.md
  - ../engineering/operational-readiness.md
  - ../../../../docs/operating-model/solo-founder-operating-system.md
  - ../../../../docs/roadmaps/solo-founder-launch-roadmap.md
  - ../../../../bisnis/teestock/07-operations/operating-model.md
  - ../../../../bisnis/teestock/08-finance/financial-model.md
  - ../../../../bisnis/teestock/14-roadmap/current-quarter.md

downstream:
  - operational-exception-spec.md
  - teestock-operational-pilot-plan.md

supersedes: null
---

# MGBOS Founder Attention & Decision Experience Specification v1.0

## 1. Purpose

Dokumen ini mendefinisikan bagaimana MGBOS mengubah authoritative business conditions menjadi founder-facing operational attention.

Pertanyaan utama:

> **Apa yang harus dilihat founder, kenapa hal itu penting, siapa yang bertanggung jawab, apa tindakan berikutnya, dan apakah founder benar-benar harus mengambil keputusan?**

---

# 2. Product Experience Objective

Founder Control harus mengubah pengalaman dari:

```text
OPEN DASHBOARD
↓
CHECK LEADS
↓
CHECK ORDERS
↓
CHECK PRODUCTION
↓
CHECK INVOICES
↓
CHECK PAYMENTS
↓
CHECK SHIPMENTS
↓
MENTALLY DECIDE
WHAT MATTERS
```

menjadi:

```text
OPEN FOUNDER CONTROL
↓
SEE MATERIAL ATTENTION
↓
UNDERSTAND WHY
↓
KNOW OWNER
↓
KNOW NEXT ACTION
↓
DECIDE ONLY WHEN REQUIRED
```

---

# 3. Core Experience Principle

Founder Control optimizes for:

```text
TRUSTWORTHY ATTENTION
```

not:

```text
MAXIMUM INFORMATION DENSITY
```

---

# 4. Business Basis

TeeStock Operating Model requires:

```text
CLEAR OWNER

CLEAR STATUS

CLEAR NEXT ACTION

CLEAR APPROVAL

CLEAR EXCEPTION
```

and explicitly targets:

```text
NORMAL WORK
→ flows normally

EXCEPTIONS
→ receive human attention
```

---

# 5. Founder-Control Basis

Solo-Founder Operating System defines the founder-facing questions:

```text
WHAT NEEDS ATTENTION?

WHAT IS LATE?

WHAT IS BLOCKED?

WHAT IS UNPAID?

WHAT IS AT RISK?

WHAT NEEDS A DECISION?
```

D2 translates those questions into product semantics.

---

# 6. Current Product Gap

Current MGBOS contains a page labeled:

```text
FOUNDER COMMAND CENTER
```

but current source primarily displays:

```text
organization information

brand context

static KPI

system-description content

document-number examples

vertical-slice implementation status
```

There is no mature implementation-level model for:

```text
attention

decision-required

responsible actor

next action

materiality

attention deduplication
```

at the reviewed repository baseline.

---

# 7. Foundational Separation

D2 establishes:

```text
BUSINESS STATE
≠
ATTENTION
≠
OPERATIONAL EXCEPTION
≠
APPROVAL
≠
DECISION
```

This separation is mandatory.

---

# 8. Business State

Business State answers:

```text
WHAT IS TRUE
ABOUT THE BUSINESS OBJECT?
```

Examples:

```text
Invoice = OUTSTANDING

Production Job = IN_PRODUCTION

QC Result = REJECTED
```

Business State is owned by its canonical MGBOS domain.

---

# 9. Attention

Attention answers:

```text
DOES SOMEONE
NEED TO CARE ABOUT THIS NOW?
```

Attention is a product interpretation over business truth.

It is not automatically a new canonical entity.

---

# 10. Operational Exception

Operational Exception answers:

```text
IS THERE A MATERIAL
ABNORMAL OPERATIONAL CONDITION
THAT DESERVES EXPLICIT TRACKING?
```

Its detailed product semantics belong to D3.

---

# 11. Approval

Approval answers:

```text
DOES THIS SPECIFIC ACTION
REQUIRE AN AUTHORITY
BEFORE EXECUTION?
```

Approval is not the same as attention.

---

# 12. Founder Decision

Founder Decision answers:

```text
IS FOUNDER JUDGMENT
OR FOUNDER AUTHORITY
REQUIRED TO PROCEED?
```

An attention item may require action without requiring founder decision.

---

# 13. Not Every Business Object Is Attention

Example:

```text
Order = ACTIVE
```

does not imply:

```text
Attention = YES
```

An active order operating normally should usually remain quiet.

---

# 14. Not Every Attention Item Is An Exception

Example:

```text
New qualified Lead
needs normal commercial continuation
```

may require:

```text
ACTION
```

without being an abnormal operational exception.

---

# 15. Not Every Exception Requires Founder

Example:

```text
Production delayed
```

may create an Operational Exception.

If Operations can resolve it:

```text
Founder Decision Required
=
NO
```

---

# 16. Not Every Founder Decision Is An Exception

Example:

```text
Quote below approved margin floor
requires explicit OWNER approval.
```

This may be a governed approval situation without necessarily becoming an Operational Exception.

---

# 17. Logical Attention Item

D2 defines a logical product concept:

```text
ATTENTION ITEM
```

An Attention Item is:

> A founder/operator-facing representation of one material condition requiring action, decision, waiting awareness, monitoring, or data verification.

---

# 18. Attention Item Is Not Yet A Canonical Entity

`Attention Item` in D2 is a product contract.

It does NOT pre-decide:

```text
attention_items table

Attention aggregate

persistent row

database ID

event stream
```

Architecture review decides representation.

---

# 19. ATTN-001 — Logical Attention Contract

A usable Attention Item must be capable of communicating:

```text
logical identity

primary business object

related business objects

attention kind

priority

urgency

reason

responsible actor

next action

founder decision requirement

flow impact

time context

supporting evidence

evaluation status

last evaluation time
```

where applicable.

---

# 20. Logical Identity

Attention should have enough logical identity to support:

```text
stable rendering

deduplication

testing

traceability
```

without D2 requiring persisted UUID storage.

---

# 21. Primary Business Object

Each Attention Item should identify one primary anchor.

Examples:

```text
Invoice

Production Job

Production Assignment

Order

Quote
```

---

# 22. Related Business Objects

Supporting context may include:

```text
Customer

Order

Vendor

Invoice

Shipment

QC Inspection
```

but one item must retain a clear primary anchor.

---

# 23. Attention Kind

Canonical D2 product vocabulary:

```text
DECISION

ACTION

WAITING

WATCH

DATA_GAP
```

These are product-experience categories.

They are not domain lifecycle states.

---

# 24. ATTN-KIND-DECISION

`DECISION` means:

> A material business path cannot safely continue without judgment or approval from the applicable authority.

For Founder Control:

```text
Founder Decision Required
=
YES
```

when OWNER is the required authority.

---

# 25. DECISION Examples

Potential examples:

```text
margin exception approval

unusual customer remedy

material commercial exception

high-risk operational choice
```

only where current policy establishes a decision requirement.

---

# 26. ATTN-KIND-ACTION

`ACTION` means:

> A valid operational next action exists and should be performed by a responsible actor.

Examples:

```text
follow up overdue payment

resolve QC rework

continue qualified Lead

address blocked fulfillment
```

---

# 27. ACTION Does Not Mean Founder Action

Example:

```text
Attention Kind
=
ACTION

Responsible Actor
=
FINANCE

Founder Decision Required
=
NO
```

is valid.

---

# 28. ATTN-KIND-WAITING

`WAITING` means:

> The workflow is materially dependent on another actor, external party, or prerequisite, and there is no immediate productive internal action except monitoring or later follow-up.

Examples:

```text
waiting Vendor acknowledgement

waiting customer approval

waiting external payment confirmation
```

where supported.

---

# 29. WAITING Is Not Healthy Silence

A Waiting condition may still be important.

But it should not be presented as:

```text
ACTION REQUIRED NOW
```

unless another rule becomes true.

---

# 30. ATTN-KIND-WATCH

`WATCH` means:

> No intervention is required now, but an approved deterministic condition makes the item worth monitoring.

Example:

```text
deadline approaching
but still within expected window
```

where due-soon policy exists.

---

# 31. WATCH Must Be Rare

WATCH must not become:

```text
all active records
```

or Founder Control recreates module browsing.

Only materially useful forward-looking signals should qualify.

---

# 32. ATTN-KIND-DATA_GAP

`DATA_GAP` means:

> Required information is missing, stale, unavailable, or conflicting enough that MGBOS cannot safely determine the expected attention state.

---

# 33. DATA_GAP Example

Example:

```text
Order completed operationally

but required Actual Cost
cannot be established
```

Expected:

```text
DATA_GAP
```

not:

```text
ALL GOOD
```

---

# 34. Attention Priority

D2 defines founder-attention priority as:

```text
INTERRUPT

TODAY

QUEUE

WATCH
```

This vocabulary is intentionally different from exception severity.

---

# 35. Priority ≠ Exception Severity

Example:

```text
Operational Exception Severity
=
HIGH

Attention Priority
=
QUEUE
```

may be valid if:

```text
issue already owned

resolution underway

no immediate founder action
```

Conversely:

```text
Attention Priority
=
TODAY
```

may exist without a persistent Operational Exception.

---

# 36. PRIORITY-INTERRUPT

`INTERRUPT` means:

> The condition is sufficiently material and time-sensitive that delaying attention behind normal operating work creates unacceptable risk under approved policy.

This should be rare.

---

# 37. INTERRUPT Does Not Mean Push Notification

In D2:

```text
INTERRUPT
```

defines in-product priority.

It does NOT automatically authorize:

```text
WhatsApp

SMS

email

push notification
```

Notification channels are separate future product/implementation decisions.

---

# 38. PRIORITY-TODAY

`TODAY` means:

> The item should be addressed during the current operating day.

Exact rule for reaching TODAY must be deterministic and policy-backed.

---

# 39. PRIORITY-QUEUE

`QUEUE` means:

> The item is material and actionable, but can be handled through the normal operating queue without interrupting higher-priority work.

---

# 40. PRIORITY-WATCH

`WATCH` means:

> The item is worth observing but does not currently require intervention.

---

# 41. Priority Ordering

Default ordering:

```text
INTERRUPT
↓
TODAY
↓
QUEUE
↓
WATCH
```

Within each priority class, additional deterministic ordering applies.

---

# 42. Priority Must Not Be Invented By AI

Core v1 priority must be deterministically explainable.

Avoid:

```text
priority = HIGH
because model says so
```

without explicit business evidence.

---

# 43. Urgency

Urgency describes time relationship separately from business impact.

D2 vocabulary:

```text
OVERDUE

DUE_TODAY

DUE_SOON

NO_IMMEDIATE_DEADLINE

UNKNOWN
```

---

# 44. Urgency ≠ Priority

Example:

```text
Urgency
=
OVERDUE

Priority
=
QUEUE
```

can be valid if business impact is small and another actor already owns resolution.

---

# 45. URGENCY-OVERDUE

Used when an applicable authoritative deadline has passed.

---

# 46. URGENCY-DUE_TODAY

Used when an applicable authoritative due point falls within the current operating day.

---

# 47. URGENCY-DUE_SOON

Used only when an approved policy defines a meaningful forward-looking warning window.

D2 does not invent the numeric window.

---

# 48. URGENCY-NO_IMMEDIATE_DEADLINE

Used when a material issue exists without meaningful immediate time pressure.

---

# 49. URGENCY-UNKNOWN

Used when due-time interpretation cannot be reliably established.

---

# 50. Timezone Rule

Terms such as:

```text
TODAY

OVERDUE

DUE SOON
```

must use an explicit organizational/business time context.

Do not rely silently on browser-local timezone.

Exact architecture is deferred.

---

# 51. Flow Impact

D2 defines another independent dimension:

```text
BLOCKING

DEGRADING

NON_BLOCKING

UNKNOWN
```

---

# 52. FLOW-BLOCKING

Means:

> The affected workflow cannot safely proceed through its normal next step.

Examples may include:

```text
QC unresolved

required approval missing

fulfillment readiness failed
```

where canonical rules establish blockage.

---

# 53. FLOW-DEGRADING

Means:

> Work may continue, but the condition materially increases operational risk, delay, cost, or customer-impact risk.

---

# 54. FLOW-NON_BLOCKING

Means:

> Attention is useful but normal workflow remains valid.

---

# 55. Responsible Actor

Each actionable Attention Item SHOULD identify:

```text
RESPONSIBLE ACTOR
```

where authoritative responsibility can be determined.

---

# 56. Responsible Role vs Principal

D2 distinguishes:

```text
RESPONSIBLE ROLE
```

from:

```text
RESPONSIBLE PRINCIPAL
```

Example:

```text
Role
=
FINANCE

Principal
=
Rizky
```

may occur during solo-founder operation.

---

# 57. Solo Founder Does Not Erase Role Semantics

Even if one human currently performs:

```text
Sales

Operations

Finance

Owner
```

the product should preserve the logical role responsible for the work.

This supports future delegation without redesigning all attention semantics.

---

# 58. Founder Decision Required

D2 product vocabulary:

```text
YES

NO

UNKNOWN
```

---

# 59. FOUNDER-DECISION-YES

Means:

> Current work cannot safely proceed without OWNER judgment or authority.

---

# 60. FOUNDER-DECISION-NO

Means:

> The item may deserve founder awareness, but another actor or deterministic system can perform the required action.

---

# 61. FOUNDER-DECISION-UNKNOWN

Means:

> Current policy/authorization context is insufficient to determine whether founder involvement is required.

This should become visible rather than guessed.

---

# 62. Founder Decision Is Not Founder Visibility

An item may be visible to founder because it is material while:

```text
Founder Decision Required
=
NO
```

---

# 63. Founder Visibility Rule

The default Founder Home SHOULD prominently include an Attention Item if at least one applies:

```text
Founder Decision Required = YES

Responsible Principal = Founder

Priority = INTERRUPT

material policy requires founder awareness

no responsible owner can be established

material DATA_GAP prevents safe understanding
```

---

# 64. Non-Founder Routine Work

Routine operator work with:

```text
Founder Decision Required = NO

Priority = QUEUE
```

and clear ownership SHOULD NOT dominate the default Founder Home merely because it exists.

---

# 65. Current Solo-Founder Adaptation

Because current operations may use one founder as several operational roles:

the initial implementation MAY show more operator-owned attention to OWNER.

However role labels MUST remain visible to avoid encoding:

```text
everything
=
OWNER work
```

as product truth.

---

# 66. Next Action

Attention Item SHOULD provide a next-action representation when one is known.

Next Action answers:

```text
WHAT SHOULD HAPPEN NEXT?
```

---

# 67. Next Action Types

Logical D2 types include:

```text
OPEN_SOURCE

PERFORM_GOVERNED_ACTION

MAKE_DECISION

VERIFY_INFORMATION

FOLLOW_UP

WAIT
```

These are product-experience semantics.

---

# 68. NEXT-OPEN_SOURCE

Navigate to authoritative domain context for deeper inspection.

---

# 69. NEXT-PERFORM_GOVERNED_ACTION

Use an existing authorized business action.

Example:

```text
Record Payment

Resolve QC

transition governed lifecycle
```

where current domain permits it.

---

# 70. NEXT-MAKE_DECISION

Founder/authorized authority must decide before workflow can proceed.

---

# 71. NEXT-VERIFY_INFORMATION

Used when source information must be checked or completed.

---

# 72. NEXT-FOLLOW_UP

Represents human communication/coordination need.

It does NOT automatically authorize automated outbound communication.

---

# 73. NEXT-WAIT

Used when no productive action exists before a dependency changes.

---

# 74. Next Action Must Not Invent Commands

If no governed action exists:

D2 must not fabricate a button that mutates state through an unsafe shortcut.

---

# 75. Founder Home

Founder Home is the primary Founder Control experience.

Its top-level question is:

```text
WHAT NEEDS ATTENTION TODAY?
```

---

# 76. Founder Home Is Not Domain Navigation

Existing side navigation remains useful for domain operations.

Founder Home exists to answer:

```text
WHAT MATTERS ACROSS DOMAINS?
```

---

# 77. Default Founder Home Sections

Default experience:

```text
NEEDS DECISION

NEEDS ACTION

WAITING

WATCH

DATA GAPS
```

Sections represent Attention Kind.

---

# 78. NEEDS DECISION

Contains:

```text
Attention Kind
=
DECISION
```

ordered by product priority and urgency.

---

# 79. NEEDS ACTION

Contains:

```text
Attention Kind
=
ACTION
```

that passes founder-visibility rules.

---

# 80. WAITING

Contains important dependency-bound work.

It should answer:

```text
WAITING FOR WHOM / WHAT?

SINCE WHEN?

WHEN DOES FOLLOW-UP BECOME DUE?
```

where policy exists.

---

# 81. WATCH

Contains forward-looking material signals that require observation rather than action.

WATCH should normally be visually quieter than ACTION/DECISION.

---

# 82. DATA GAPS

Contains material cases where trustworthy evaluation is currently impossible.

This section prevents false reassurance.

---

# 83. Home Summary

Founder Home MAY show compact counts such as:

```text
Decision

Action

Waiting

Watch

Data Gap
```

Counts must clearly belong to the currently evaluated scope.

---

# 84. Overdue and Blocked Indicators

`OVERDUE` and `BLOCKING` are cross-cutting dimensions.

They should appear as badges/attributes within relevant Attention Items rather than becoming competing primary categories.

---

# 85. Why Blocked Is Not A Primary Section

An item can be:

```text
ACTION
+
BLOCKING
```

or:

```text
DECISION
+
BLOCKING
```

Making `BLOCKED` a separate primary bucket would obscure what kind of response is needed.

---

# 86. Why Overdue Is Not A Primary Section

An item can be:

```text
WAITING
+
OVERDUE
```

or:

```text
ACTION
+
OVERDUE
```

Urgency and actionability must remain separate.

---

# 87. Attention Card Minimum

A material Attention Item should display enough context to answer:

```text
WHAT IS IT?

WHY IS IT HERE?

HOW IMPORTANT?

WHO OWNS IT?

WHAT NEXT?

DOES FOUNDER NEED TO DECIDE?
```

---

# 88. Attention Card Core Fields

Product-level minimum:

```text
title

primary object identity

reason

priority

attention kind

responsible role

next action

founder decision indicator
```

---

# 89. Contextual Fields

When materially useful:

```text
customer

brand

amount

due date

Vendor

shipment

margin

time waiting

related exception
```

may be displayed.

Do not overload every card with every possible field.

---

# 90. Evidence Expansion

An Attention Item SHOULD allow the user to inspect:

```text
source facts

related object

rule/condition

relevant timeline
```

where useful.

---

# 91. Reason Code

Attention rules SHOULD expose stable machine-readable reason identifiers.

Examples of logical form:

```text
invoice.past_due

production.deadline_breached

assignment.awaiting_acknowledgement

qc.rejected

cost.actual_missing
```

Exact final codes belong to downstream product/architecture reconciliation.

---

# 92. Human Reason

Machine-readable reason must be accompanied by a human-readable explanation.

Example:

```text
Invoice TS-INV-... has an outstanding balance
and its due date has passed.
```

---

# 93. Reason Must Explain Evidence

Avoid vague:

```text
Needs attention
```

without explaining why.

---

# 94. Decision Experience

A Founder Decision item must present:

```text
DECISION QUESTION

WHY DECISION IS NEEDED

BUSINESS CONTEXT

DEADLINE / URGENCY

SUPPORTING EVIDENCE

AVAILABLE GOVERNED ACTIONS
```

where applicable.

---

# 95. Decision Question

A decision experience should ask one clear question.

Example:

```text
Approve this pricing exception?
```

rather than:

```text
Check Quote TS-Q-...
```

---

# 96. Decision Evidence

Founder should not need to reconstruct context from multiple modules merely to understand a decision.

Relevant supporting facts may include:

```text
Customer

Quote

Order

amount

margin

deadline

current lifecycle state

reason approval is required
```

---

# 97. Decision Options

D2 permits displaying decision options only when those options correspond to valid governed actions.

Do not fabricate:

```text
APPROVE

REJECT
```

if no such domain/approval semantics exist yet.

---

# 98. Decision Recommendation

AI recommendation is NOT required for Founder Control v1.

The first requirement is:

```text
TRUSTWORTHY DECISION CONTEXT
```

not:

```text
AI TELLS FOUNDER WHAT TO DO
```

---

# 99. Decision Audit

If a founder decision produces a consequential mutation:

that action must continue through the applicable governed command/approval boundary.

The Attention UI itself is not an authorization bypass.

---

# 100. Waiting Experience

Waiting must communicate:

```text
WAITING FOR

WAITING SINCE

EXPECTED NEXT EVENT

FOLLOW-UP CONDITION
```

where deterministically available.

---

# 101. Waiting Example

```text
Waiting for Vendor acknowledgement

Assignment:
TS-...

Waiting since:
<timestamp>

Follow-up becomes due:
according to approved SLA
```

If no SLA exists:

do not invent one.

---

# 102. Waiting Escalation

A WAITING item may become ACTION when:

```text
approved waiting window expires

dependency fails

manual follow-up becomes required
```

Exact rule must be deterministic.

---

# 103. Waiting May Create Exception

Persistent abnormal waiting may also become an Operational Exception under D3 semantics.

D2 does not decide that boundary alone.

---

# 104. Watch Experience

WATCH should answer:

```text
WHAT ARE WE WATCHING?

WHAT CONDITION WOULD TURN THIS
INTO ACTION?
```

where possible.

---

# 105. Watch Example

```text
Production deadline approaching

No action required yet.

Escalates if:
approved deadline-risk condition becomes true.
```

---

# 106. Data Gap Experience

DATA_GAP must communicate:

```text
WHAT CANNOT BE DETERMINED?

WHAT INFORMATION IS MISSING?

WHAT BUSINESS DECISION IS AFFECTED?

WHAT SHOULD BE VERIFIED?
```

where applicable.

---

# 107. Data Gap Is Not Technical Error By Default

Example:

```text
Actual Cost missing
```

may be a business-data gap.

Example:

```text
database unavailable
```

is a technical incident.

Do not collapse both into one concept.

---

# 108. Technical Incident Boundary

Technical/system incidents remain separate from business Operational Exception.

Founder Control may show that its evaluation coverage is impaired.

It does not redefine technical incident management.

---

# 109. Coverage Status

Founder Control MUST communicate whether its attention evaluation is trustworthy.

D2 vocabulary:

```text
COMPLETE

PARTIAL

UNAVAILABLE
```

---

# 110. COVERAGE-COMPLETE

Means:

> All product-required sources for the current evaluated scope were successfully evaluated.

---

# 111. COVERAGE-PARTIAL

Means:

> Some required sources could not be evaluated.

The Founder Home must make this visible.

---

# 112. COVERAGE-UNAVAILABLE

Means:

> Founder Control cannot produce a trustworthy current attention view.

---

# 113. All-Clear Rule

The product may show an all-clear state only when:

```text
Coverage
=
COMPLETE
```

and:

```text
Active material attention
=
0
```

---

# 114. All-Clear Wording

Prefer:

> **No material attention detected in the evaluated scope.**

Avoid absolute:

```text
Everything is perfect.
```

---

# 115. Partial Coverage Empty State

If:

```text
Active Attention
=
0

Coverage
=
PARTIAL
```

the product MUST NOT show ordinary all-clear messaging.

---

# 116. Evaluation Timestamp

Founder Control SHOULD expose:

```text
LAST EVALUATED
```

or equivalent freshness context where material.

---

# 117. Freshness

A business condition may be logically correct but based on stale upstream data.

Where freshness materially affects reliability:

the product must be capable of indicating it.

Exact freshness policies are downstream work.

---

# 118. Attention Evaluation Is Read-Only

Merely evaluating attention must not change:

```text
Order state

Invoice state

Production state

Exception state

approval state
```

---

# 119. Derived Attention Lifecycle

A derived Attention Item may appear and disappear as authoritative conditions change.

This does not require historical persistence for every transient signal.

---

# 120. Historical Evidence Boundary

History is mandatory only where another governed semantic owner requires it.

Examples:

```text
Operational Exception history
→ D3 / architecture

Approval decision
→ approval/audit owner

business lifecycle transition
→ domain owner
```

---

# 121. Generic Attention History Is Not Required V1

D2 does not require storing every generated attention card forever.

Doing so would prematurely create a new historical business aggregate.

---

# 122. Deduplication Principle

Canonical product principle:

```text
ONE UNDERLYING PROBLEM
SHOULD NOT BECOME
MANY INDISTINGUISHABLE
FOUNDER PROBLEMS
```

---

# 123. Duplicate Example

Avoid simultaneously showing:

```text
Invoice overdue

Customer owes payment

Order payment incomplete

Collection needed
```

as four independent items if they represent one actionable financial concern.

---

# 124. Primary Concern

Where multiple signals describe the same underlying concern:

the product should select one primary attention representation and expose supporting context beneath it.

---

# 125. Persistent Exception Takes Precedence

When D3 establishes a persistent Operational Exception for a condition:

derived signals for the same concern SHOULD normally attach to or project through that exception rather than creating a competing duplicate.

Exact architecture remains TBD.

---

# 126. When Separate Items Are Valid

Separate Attention Items are appropriate when the concerns require materially different:

```text
owner

action

decision

deadline

resolution
```

even if they relate to the same Order.

---

# 127. Aggregation

Multiple homogeneous items MAY be summarized.

Example:

```text
5 invoices past due
```

but founder must retain the ability to inspect individual underlying business objects.

---

# 128. Aggregation Safety

Do not aggregate items when aggregation hides:

```text
different decisions

different owners

materially different urgency

materially different customer impact
```

---

# 129. Deterministic Ordering

Within a section, default ordering SHOULD be deterministic.

Recommended product-level precedence:

```text
1. Priority

2. Urgency

3. Founder decision requirement

4. Due time

5. Age of unresolved condition

6. Stable identifier
```

Exact implementation is engineering work.

---

# 130. Stable Ordering

Repeated refresh with unchanged source facts should not randomly reorder equivalent Attention Items.

---

# 131. Filters

Founder Control SHOULD support relevant filtering such as:

```text
brand

domain

responsible role

priority

attention kind
```

when needed.

---

# 132. Filter Safety

A filter must clearly indicate when the user is not seeing the complete attention set.

---

# 133. Brand Context

MGBOS currently supports active brand context.

Founder Control must prevent confusion between:

```text
current brand view

organization-wide view
```

---

# 134. Brand Scope Must Be Visible

If Founder Control is filtered to TeeStock:

the user should not assume other brand attention is included.

---

# 135. Organization Scope

Organization isolation remains mandatory.

Founder Control must never aggregate across unauthorized organizations.

---

# 136. New Lead Example

Scenario:

```text
Lead
=
QUALIFIED

Requirement
=
not yet created
```

If current business policy expects continuation:

possible D2 representation:

```text
Kind:
ACTION

Responsible Role:
SALES

Decision Required:
NO

Reason:
Qualified Lead needs requirement continuation.
```

This is not inherently an Operational Exception.

---

# 137. Quote Waiting Example

Scenario:

```text
Quote
=
SENT
```

If current follow-up policy says no action yet:

```text
Kind:
WAITING
```

If follow-up becomes due:

```text
Kind:
ACTION
```

No arbitrary follow-up age may be invented by D2.

---

# 138. Margin Approval Example

Scenario:

```text
Quote condition
violates approved margin policy

OWNER approval required
```

Representation:

```text
Kind:
DECISION

Responsible Role:
OWNER

Founder Decision Required:
YES

Flow Impact:
BLOCKING
```

subject to actual approval policy.

---

# 139. Vendor Acknowledgement Example

Before response deadline:

```text
Kind:
WAITING
```

After deterministic response SLA breach:

potential:

```text
Kind:
ACTION

Urgency:
OVERDUE

Related concern:
Vendor acknowledgement delay
```

D3 determines whether this becomes a persistent exception.

---

# 140. Production Deadline Example

Scenario:

```text
Production Job
=
IN_PRODUCTION

committed deadline
<
current approved business time
```

Representation:

```text
Kind:
ACTION

Urgency:
OVERDUE

Reason:
Production deadline breached
```

Do NOT change Production state to:

```text
PRODUCTION_DELAYED
```

merely for attention purposes.

---

# 141. QC REWORK Example

Scenario:

```text
QC
=
REWORK
```

Representation may be:

```text
Kind:
ACTION

Responsible Role:
OPERATIONS / QC

Flow Impact:
BLOCKING
```

Founder decision may remain:

```text
NO
```

unless materiality/policy says otherwise.

---

# 142. QC REJECTED Example

Scenario:

```text
QC
=
REJECTED

Production
=
ON_HOLD
```

Representation:

```text
Kind:
ACTION or DECISION
```

depending on whether ordinary operational resolution exists or founder judgment is required.

---

# 143. Fulfillment Block Example

Scenario:

```text
Shipment cannot be created
because required QC is unresolved.
```

Representation:

```text
Kind:
ACTION

Flow Impact:
BLOCKING

Reason:
Fulfillment readiness not satisfied
```

Primary object selection should point to the most actionable business context.

---

# 144. Past-Due Invoice Example

Scenario:

```text
Invoice outstanding
+
due date passed
```

Representation:

```text
Kind:
ACTION

Responsible Role:
FINANCE

Urgency:
OVERDUE

Decision Required:
NO
```

unless exceptional commercial judgment is required.

---

# 145. Missing Actual Cost Example

Scenario:

```text
Operational work materially complete

Actual Cost
=
missing

policy requires cost completion
```

Potential representation:

```text
Kind:
DATA_GAP or ACTION
```

depending on whether the missing value simply needs entry or cannot yet be established.

---

# 146. Margin Exception Example

Scenario:

```text
Realized Margin
below approved business threshold
```

Possible representation:

```text
Kind:
WATCH

or

ACTION

or

DECISION
```

depending on whether the issue concerns retrospective learning, corrective action, or founder approval.

D2 does not invent the threshold.

---

# 147. Waiting vs Blocked

A workflow may be:

```text
WAITING
```

without:

```text
BLOCKING
```

Example:

waiting customer feedback while other preparation continues.

---

# 148. Blocked vs Decision

A workflow may be:

```text
BLOCKING
+
DECISION
```

Example:

commercial approval needed before Quote can proceed.

---

# 149. Decision vs Approval

A founder decision may lead to:

```text
approval
```

but D2 keeps the terms conceptually separate.

The decision is the human judgment.

Approval is governed evidence/authority allowing action.

---

# 150. Owner Context

Each Attention Item should make clear whether the founder is:

```text
DOER

APPROVER

DECISION MAKER

OBSERVER
```

where practical.

This supports founder-by-exception behavior.

---

# 151. No Generic Dismiss Button V1

D2 does not require a universal:

```text
DISMISS
```

button for all attention.

Generic dismissal risks turning:

```text
hide problem
```

into:

```text
problem resolved
```

---

# 152. No Generic Snooze Requirement V1

D2 does not require universal Snooze.

Waiting and future due conditions should be represented semantically first.

A future snooze feature requires clear safety rules.

---

# 153. D3 Dismissal Ownership

If Operational Exception supports:

```text
DISMISSED
```

D3 must define its meaning separately from:

```text
RESOLVED
```

---

# 154. No Generic Mark-As-Done

Attention Item should not generally expose:

```text
MARK DONE
```

unless that action maps to an actual governed domain/exception operation.

---

# 155. Accessibility

Founder Control must not rely on color alone to communicate:

```text
priority

urgency

blocked state

decision requirement
```

Text/icon/label semantics must remain understandable.

---

# 156. Mobile / Narrow-Screen Principle

Founder attention hierarchy must remain understandable on narrow screens.

Critical decision/action context should not disappear because of desktop-oriented dashboard layout.

Exact responsive design is design/engineering work.

---

# 157. Scanability

A founder should be able to quickly distinguish:

```text
DECIDE

ACT

WAIT

WATCH

VERIFY
```

without opening each item.

---

# 158. Domain Detail Remains Available

Founder Control compresses reality.

It does not replace domain detail pages.

---

# 159. Home Is Not Full BI

Founder Home is not required to include comprehensive:

```text
sales charts

revenue analytics

inventory analytics

marketing dashboards
```

unless directly relevant to current attention.

---

# 160. KPI Boundary

A KPI belongs in Founder Control only if it materially supports:

```text
attention

decision

risk

current operating control
```

Static vanity KPI should not dominate the surface.

---

# 161. Existing Dashboard Migration Direction

Current `/dashboard` may evolve into Founder Control.

This is a product direction, not a mandatory implementation decision.

Engineering Discovery decides whether to:

```text
replace

refactor

compose

introduce another route
```

---

# 162. Vertical Slice Status Boundary

Engineering implementation-status cards currently shown on the dashboard are useful development information.

They are not core Founder Control business attention.

They SHOULD NOT dominate the production founder experience.

---

# 163. System Health Boundary

Engineering/system health may be relevant to founder operations.

But technical incidents remain a separate concept.

Founder Control may surface:

```text
Attention coverage impaired
```

without becoming the monitoring system.

---

# 164. Automation Failure

A material automation failure may create business attention if it affects business operation.

Example:

```text
payment reminder automation failed
```

does not automatically alter Invoice state.

D3 defines exception handling boundaries.

---

# 165. JARVIS Integration Direction

Future JARVIS should consume structured Founder Control context such as:

```text
active material attention

open exceptions

decision-required items

evidence references
```

rather than querying unrestricted raw tables and inventing priority.

---

# 166. Morning Briefing Relationship

Future JARVIS Morning Briefing may summarize D2 attention.

D2 remains useful even without the briefing.

---

# 167. JARVIS Must Preserve D2 Semantics

JARVIS may reorder or explain attention according to approved scope.

It must not silently redefine:

```text
priority

decision requirement

business state

exception status
```

as authoritative facts.

---

# 168. D2 Acceptance Criteria

## ATTN-AC-001 — Healthy Work Is Quiet

Given normal evaluated work with no material attention rule true:

the work does not appear as active founder attention.

---

# 169. ATTN-AC-002 — Decision Is Distinct

Given an OWNER approval requirement:

the item appears as:

```text
DECISION
```

rather than generic:

```text
ACTION
```

---

# 170. ATTN-AC-003 — Operator Action Is Distinct

Given a material issue with a clear non-founder owner:

the item can represent:

```text
ACTION

Founder Decision Required
=
NO
```

---

# 171. ATTN-AC-004 — Waiting Is Distinct

Given a material dependency with no immediate internal action:

the item is representable as:

```text
WAITING
```

without falsely instructing founder to act.

---

# 172. ATTN-AC-005 — Watch Is Distinct

Given a deterministic risk condition that requires monitoring but no current action:

the item is representable as:

```text
WATCH
```

---

# 173. ATTN-AC-006 — Data Gap Is Visible

Given material evaluation cannot complete:

the product surfaces:

```text
DATA_GAP
```

or partial coverage rather than false all-clear.

---

# 174. ATTN-AC-007 — Priority Is Explainable

For every:

```text
INTERRUPT

TODAY
```

item in the acceptance set:

the product can explain why its priority is higher than ordinary queue work.

---

# 175. ATTN-AC-008 — Urgency Is Time-Consistent

Overdue/due-today classification uses an explicit business timezone and authoritative due-time context.

---

# 176. ATTN-AC-009 — Blocking Is Independent

An Attention Item can express:

```text
BLOCKING
```

without requiring creation of a new business lifecycle status.

---

# 177. ATTN-AC-010 — Owner Is Visible

Every actionable acceptance item with determinable ownership displays a responsible role or actor.

---

# 178. ATTN-AC-011 — Next Action Is Visible

Every actionable acceptance item with a valid known next step presents that next step.

---

# 179. ATTN-AC-012 — Source Is Traceable

Every attention item can be traced to authoritative source context.

---

# 180. ATTN-AC-013 — Duplicate Concern Is Not Flooded

One past-due Invoice does not become several indistinguishable founder cards solely because several views can derive the same concern.

---

# 181. ATTN-AC-014 — Distinct Actions Remain Distinct

Two concerns on the same Order remain separate when they require different:

```text
owners

actions

decisions

resolution paths
```

---

# 182. ATTN-AC-015 — Resolution Updates Attention

When authoritative source condition is corrected:

derived active attention is reevaluated and no longer remains active without cause.

---

# 183. ATTN-AC-016 — Read Does Not Mutate

Opening Founder Home does not alter source business lifecycle state.

---

# 184. ATTN-AC-017 — OWNER Cannot Bypass Rules

Any consequential action reached through Founder Control continues to satisfy applicable authorization, lifecycle, and invariants.

---

# 185. ATTN-AC-018 — JARVIS Is Optional

With JARVIS unavailable:

D2 core experience remains functional.

---

# 186. ATTN-AC-019 — Coverage Is Visible

User can determine whether the current view is based on:

```text
COMPLETE

PARTIAL

UNAVAILABLE
```

evaluation coverage.

---

# 187. ATTN-AC-020 — All Clear Is Honest

All-clear messaging appears only under COMPLETE evaluated coverage with no active material attention.

---

# 188. ATTN-AC-021 — Brand Scope Is Understandable

If the view is scoped to one brand:

the user can tell that the view is not organization-wide.

---

# 189. ATTN-AC-022 — Founder Decision Is Selective

Acceptance test includes at least one material issue that:

```text
requires action
but not founder decision
```

to prove the product does not escalate everything.

---

# 190. ATTN-AC-023 — Role Semantics Survive Solo Founder

Even when the founder performs the action personally:

the product can still identify the logical responsible role.

---

# 191. ATTN-AC-024 — Technical Failure Is Not Business Truth

A Founder Control evaluation failure does not mutate or fabricate underlying business state.

---

# 192. ATTN-AC-025 — Existing Phase 1 Flow Still Works

Founder Control experience must not regress the accepted Phase 1 operating-spine journey.

---

# 193. Product Risks

## ATTN-RISK-001 — Attention Fatigue

Cause:

too many normal items appear.

Mitigation:

```text
healthy work quiet

founder-visibility filter

WATCH used sparingly

deduplication
```

---

# 194. ATTN-RISK-002 — Priority Inflation

Cause:

everything becomes TODAY/INTERRUPT.

Mitigation:

priority requires deterministic explainable criteria.

---

# 195. ATTN-RISK-003 — Founder Ownership Inflation

Cause:

solo-founder reality causes every responsibility to become semantically OWNER.

Mitigation:

preserve responsible role separately from responsible principal.

---

# 196. ATTN-RISK-004 — Hide-The-Problem UX

Cause:

generic dismiss/snooze/mark-done actions make unresolved problems disappear.

Mitigation:

do not introduce generic hiding controls in D2 v1.

---

# 197. ATTN-RISK-005 — False All-Clear

Cause:

failed data source yields empty queue.

Mitigation:

explicit coverage state.

---

# 198. ATTN-RISK-006 — Dashboard Becomes BI

Cause:

unbounded KPI accumulation.

Mitigation:

Founder Home optimized for operational attention.

---

# 199. ATTN-RISK-007 — Business State Pollution

Cause:

new attention labels get added into existing domain state machines.

Mitigation:

keep attention as separate product dimension.

---

# 200. ATTN-RISK-008 — Exception Duplication

Cause:

derived attention and persistent exception both appear independently.

Mitigation:

D3 must define source-of-truth and projection relationship.

---

# 201. ATTN-RISK-009 — Hidden Thresholds

Cause:

hard-coded lateness/materiality rules appear in UI code.

Mitigation:

thresholds require explicit semantic ownership.

---

# 202. ATTN-RISK-010 — Recommendation Before Truth

Cause:

AI recommendations are built before attention facts are trustworthy.

Mitigation:

deterministic attention first.

---

# 203. Product Decisions

## ATTN-DEC-001 — Attention Uses Independent Dimensions

Status:

```text
DECIDED
```

Attention uses separate:

```text
Kind

Priority

Urgency

Flow Impact

Responsible Actor

Founder Decision Required
```

rather than one mega-status.

---

# 204. ATTN-DEC-002 — Attention Kinds

Status:

```text
DECIDED
```

D2 v1 kinds are:

```text
DECISION

ACTION

WAITING

WATCH

DATA_GAP
```

---

# 205. ATTN-DEC-003 — Priority Vocabulary

Status:

```text
DECIDED
```

D2 v1 founder-attention priorities are:

```text
INTERRUPT

TODAY

QUEUE

WATCH
```

---

# 206. ATTN-DEC-004 — Priority Is Not Exception Severity

Status:

```text
DECIDED
```

Exception severity and founder-attention priority remain separate semantics.

---

# 207. ATTN-DEC-005 — Urgency Vocabulary

Status:

```text
DECIDED
```

D2 v1 urgency values:

```text
OVERDUE

DUE_TODAY

DUE_SOON

NO_IMMEDIATE_DEADLINE

UNKNOWN
```

---

# 208. ATTN-DEC-006 — Flow Impact Vocabulary

Status:

```text
DECIDED
```

D2 v1:

```text
BLOCKING

DEGRADING

NON_BLOCKING

UNKNOWN
```

---

# 209. ATTN-DEC-007 — No Generic Dismiss

Status:

```text
DECIDED
```

Founder Control v1 has no universal semantic:

```text
Dismiss attention
```

---

# 210. ATTN-DEC-008 — No Generic Snooze Requirement

Status:

```text
DECIDED
```

Generic Snooze is not a v1 requirement.

---

# 211. ATTN-DEC-009 — Founder Home Is Attention-First

Status:

```text
DECIDED
```

Founder Home prioritizes:

```text
Decision

Action

Waiting

Watch

Data Gap
```

over general business analytics.

---

# 212. ATTN-DEC-010 — Derived Attention May Be Ephemeral

Status:

```text
DECIDED
```

Not every derived Attention Item requires persistent historical storage.

---

# 213. ATTN-DEC-011 — Operational Exception Owns Durable Abnormality

Status:

```text
DECIDED
```

Where abnormality requires persistent explicit business tracking, D3 Operational Exception becomes the owning product capability.

---

# 214. ATTN-DEC-012 — Coverage State Is Required

Status:

```text
DECIDED
```

Founder Control must distinguish:

```text
COMPLETE

PARTIAL

UNAVAILABLE
```

evaluation coverage.

---

# 215. ATTN-DEC-013 — All Clear Requires Complete Coverage

Status:

```text
DECIDED
```

No empty queue may silently imply healthy business when evaluation coverage is incomplete.

---

# 216. ATTN-DEC-014 — Logical Roles Survive Solo-Founder Operation

Status:

```text
DECIDED
```

Responsible Role remains visible even if the same founder currently executes several roles.

---

# 217. ATTN-DEC-015 — Notification Channels Deferred

Status:

```text
DEFERRED
```

D2 defines in-product attention, not outbound notification infrastructure.

---

# 218. Unknowns

## ATTN-UNK-001 — Exact Numeric SLA Windows

Still unresolved:

```text
Lead follow-up age

Quote follow-up age

Vendor response window

Due-soon window
```

These require business policy.

---

# 219. ATTN-UNK-002 — Exact Margin Materiality Threshold

Owned by TeeStock commercial/financial policy.

---

# 220. ATTN-UNK-003 — Exact High-Value Threshold

No universal numeric threshold is approved.

---

# 221. ATTN-UNK-004 — Persistent Attention Representation

Whether any Attention Items require persistence remains architecture work.

---

# 222. ATTN-UNK-005 — Global vs Brand Default

Founder Control may eventually support:

```text
brand-level

organization-level
```

default views.

Initial default requires product/design validation.

---

# 223. ATTN-UNK-006 — Operator-Specific Queues

Role-specific queues are useful future scope.

Founder Control v1 primarily defines founder-facing experience.

---

# 224. ATTN-UNK-007 — Notification Escalation

Outbound escalation channels remain deferred.

---

# 225. D3 Handoff Questions

Operational Exception specification must now answer:

```text
What abnormality deserves persistence?

When is a derived condition enough?

When does an exception open?

What severity means?

Who owns an exception?

What does acknowledged mean?

What does resolved mean?

What does dismissed mean?

Can it reopen?

How are duplicates prevented?

How do derived Attention Items relate to Exceptions?

How are Customer Cases different?

How are automation failures different?

How are technical incidents different?
```

---

# 226. D3 Constraint From D2

D3 MUST preserve:

```text
Operational Exception
≠
Attention
```

A persistent exception may create attention.

An attention item does not automatically require persistent exception state.

---

# 227. D3 Priority Constraint

D3 exception severity MUST NOT replace:

```text
Attention Priority
```

They serve different purposes.

---

# 228. D3 Owner Constraint

Exception ownership may contribute to:

```text
Responsible Actor
```

but the attention experience may also derive responsible actor directly from underlying workflow.

---

# 229. D3 Resolution Constraint

Exception resolution may remove related active attention.

But D2 must also support derived attention that resolves without persistent exception lifecycle.

---

# 230. Architecture Entry Gate

D2 does NOT authorize architecture changes yet.

Architecture impact review begins after D3 and product-package audit.

---

# 231. Potential Architecture Questions

Future review must decide:

```text
derived query vs persisted read model?

persistent exception vs derived condition?

attention identity strategy?

evaluation freshness?

time-zone source?

deduplication key?

ownership reference?

cross-domain query strategy?

authorization projection?
```

These are intentionally unanswered here.

---

# 232. Engineering Entry Gate

D2 is NOT an implementation handoff.

Before engineering:

```text
D3
=
ACTIVE / MATURE

D4
=
ACTIVE / BOUNDED

product package audit
=
PASS

architecture reconciliation
=
PASS

current implementation audit
=
COMPLETE

risk/routing
=
RESOLVED
```

---

# 233. Current Package State

```text
D0
Founder Control Documentation Plan
=
ACTIVE

D1
Founder Control PRD
=
PREPARED / MUST BE APPLIED BEFORE D2

D2
Founder Attention & Decision Experience
=
ACTIVE / SPEC_MATURE

D3
Operational Exception
=
NEXT

D4
Real Operational Pilot
=
AFTER D3

PHASE 2 IMPLEMENTATION
=
NOT OPEN
```

---

# 234. Requirement Trace — Founder Home

```text
D1 PROB-001
Manual Status Reconstruction
        ↓
D1 FR-001
Primary Founder Control Entry Point
        ↓
D1 FR-002
Cross-Domain Attention
        ↓
D2
Founder Home
+
Attention Item
+
Ordering
+
Traceability
```

---

# 235. Requirement Trace — Decision

```text
D1 PROB-005
Founder Interrupted For Non-Founder Work
        ↓
D1 FR-007
Responsible Actor
        ↓
D1 FR-009
Founder Decision Requirement
        ↓
D2
DECISION
vs
ACTION
```

---

# 236. Requirement Trace — Uncertainty

```text
D1 FR-024
Data-Uncertainty Visibility
        ↓
D2
DATA_GAP
+
Coverage Status
+
Honest All-Clear Rule
```

---

# 237. Requirement Trace — Exceptions

```text
D1 FR-012
Operational Exception Capability
        ↓
D2
Attention / Exception separation
        ↓
D3
Persistent Operational Exception semantics
```

---

# 238. Product Success Condition

D2 succeeds when the founder can open one surface and quickly understand:

```text
WHAT REQUIRES A DECISION?

WHAT REQUIRES ACTION?

WHAT ARE WE WAITING FOR?

WHAT SHOULD BE WATCHED?

WHAT CANNOT CURRENTLY BE DETERMINED?
```

without confusing those concepts with raw lifecycle state.

---

# 239. Final Principle

The Founder Control experience must behave like:

```text
BUSINESS FACTS
        ↓
DETERMINISTIC INTERPRETATION
        ↓
MATERIAL ATTENTION
        ↓
CLEAR OWNER
        ↓
CLEAR NEXT ACTION
        ↓
FOUNDER ONLY WHEN NEEDED
```

not:

```text
EVERY ACTIVE RECORD
        ↓
DASHBOARD
        ↓
FOUNDER FIGURES IT OUT
```

Canonical D2 objective:

> **MGBOS should not merely show the founder what exists. It should clearly separate what requires decision, what requires action, what is waiting, what should be watched, and what cannot yet be known—while every signal remains traceable to authoritative business truth.**
