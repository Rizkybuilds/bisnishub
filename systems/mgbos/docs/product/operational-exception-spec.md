---
canonical_id: mgbos.product.operational-exception
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-founder-control-operational-exception
document_class: product-specification
effective_from: 2026-10-05

parent_product:
  canonical_id: mgbos.product.teestock-founder-control
  version: 1.0

upstream_product_spec:
  canonical_id: mgbos.product.founder-attention-experience
  version: 1.0

product_program: FOUNDER_CONTROL
maturity: SPEC_MATURE
design_readiness: READY_FOR_OPERATIONAL_PILOT_PLAN
engineering_readiness: NOT_READY_FOR_ENGINEERING
implementation_status: PRODUCT_SPECIFICATION_ONLY
architecture_lifecycle_status: PENDING_ARCHITECTURE_RECONCILIATION

repository_baseline:
  repository: Rizkybuilds/bisnishub
  branch: main
  commit: 65ad026fc0d6cf8da1eec15b2de39bd72b0343e5
  reviewed_at: 2026-10-05

authoritative_for:
  - Operational Exception product definition
  - Operational Exception qualification criteria
  - Operational Exception product taxonomy
  - Operational Exception severity semantics
  - Operational Exception product lifecycle requirements
  - Operational Exception lifecycle behavior required for architecture evaluation
  - Operational Exception ownership semantics
  - Operational Exception acknowledgement semantics
  - Operational Exception resolution semantics
  - Operational Exception dismissal semantics
  - Operational Exception reopen semantics
  - Operational Exception evidence requirements
  - Operational Exception deduplication product rules
  - Operational Exception escalation product rules
  - Operational Exception history requirements
  - Operational Exception relationship to Founder Attention
  - Operational Exception relationship to Customer Case
  - Operational Exception relationship to technical incident
  - Operational Exception relationship to automation failure
  - Operational Exception relationship to approval and business decision
  - product-level Operational Exception acceptance criteria

not_authoritative_for:
  - canonical Operational Exception state vocabulary
  - canonical Operational Exception lifecycle state machine
  - canonical allowed Operational Exception transitions
  - physical Operational Exception database schema
  - Operational Exception table design
  - primary key strategy
  - SQL design
  - RPC design
  - REST or server-action design
  - persistence technology
  - event infrastructure
  - notification infrastructure
  - exact permission implementation
  - exact exception command names
  - exact deterministic trigger thresholds
  - commercial SLA values
  - financial materiality thresholds
  - customer-service case lifecycle
  - technical incident lifecycle
  - deployment architecture
  - implementation work packages
  - production-readiness certification

depends_on:
  - teestock-founder-control-prd.md
  - founder-attention-experience-spec.md
  - founder-control-documentation-plan.md
  - README.md
  - ../architecture/domain-map-capability-ownership.md
  - ../architecture/business-state-machines.md
  - ../architecture/business-invariants.md
  - ../architecture/command-event-model.md
  - ../architecture/permission-authorization-model.md
  - ../implementation/phase-1-operating-spine/completion-report.md
  - ../engineering/operational-readiness.md
  - ../../../../docs/operating-model/solo-founder-operating-system.md
  - ../../../../bisnis/teestock/07-operations/operating-model.md
  - ../../../../bisnis/teestock/07-operations/returns-and-warranty.md
  - ../../../../bisnis/teestock/14-roadmap/current-quarter.md

downstream:
  - teestock-operational-pilot-plan.md
  - future MGBOS architecture impact review
  - future Founder Control engineering discovery

supersedes: null
---

# MGBOS Operational Exception Product Specification v1.0

## 1. Purpose

Dokumen ini mendefinisikan product semantics untuk:

```text id="j1w7fu"
OPERATIONAL EXCEPTION
```

di dalam Founder Control.

Operational Exception menjawab:

> **Kapan kondisi abnormal dalam operasi bisnis cukup material untuk menjadi fakta operasional eksplisit yang harus dimiliki, dilacak, dijelaskan, diselesaikan, dan dipertahankan historinya?**

---

# 2. Core Definition

Operational Exception adalah:

> **Representasi eksplisit dan durable atas kondisi operasional abnormal yang memiliki dampak bisnis material atau membutuhkan ownership, resolution tracking, escalation, atau evidence history melampaui sekadar derived attention sementara.**

---

# 3. Core Principle

Canonical product principle:

```text id="h5f4f9"
ABNORMAL
≠
AUTOMATICALLY EXCEPTION
```

Dan:

```text id="05n40t"
ATTENTION
≠
AUTOMATICALLY EXCEPTION
```

Dan:

```text id="i9agt0"
EXCEPTION
≠
BUSINESS LIFECYCLE STATE
```

---

# 4. Why Operational Exception Exists

Current MGBOS domains already know many important facts:

```text id="xm60d8"
Production status

QC result

Payment state

Shipment state

Vendor Assignment state

Invoice balance

Actual Cost
```

But durable abnormal operational management needs additional questions answered:

```text id="9l0usz"
What abnormality happened?

When was it detected?

Who owns resolution?

Has anyone acknowledged it?

What is the impact?

What evidence proves it?

What was done?

Was it resolved?

Was it dismissed?

Did it reopen?

What caused it?
```

---

# 5. Architecture Basis

Current MGBOS Domain Map already classifies:

```text id="u50xps"
Operational Exception
=
NEXT
P1 FOUNDER-CONTROL CAPABILITY
```

and defines its purpose as persistent representation for abnormal conditions such as:

```text id="va8983"
production late

payment mismatch

vendor no-response

missing artwork

QC failure

shipment problem

automation failure

margin exception
```

D3 converts that architectural direction into mature product semantics.

---

# 6. Founder-by-Exception Basis

Target operating model:

```text id="60zjjh"
NORMAL WORK
→ quiet

ABNORMAL CONDITION
→ explicit where material

MATERIAL EXCEPTION
→ owned and tracked

FOUNDER
→ involved only when needed
```

Operational Exception exists to make abnormal business reality manageable without making founder monitor everything.

---

# 7. Exception Qualification Rule

A condition SHOULD become an Operational Exception only when all of the following are sufficiently true:

```text id="lwzvyj"
1.
Condition is outside expected normal operation.

2.
Condition is materially relevant to business outcome,
risk, quality, cash, delivery, or operational control.

3.
Condition requires explicit tracking across time,
ownership, remediation, escalation,
or durable evidence.

4.
Existing domain lifecycle alone does not provide
sufficient operational resolution management.

5.
Condition is not merely a duplicate
of another active exception.
```

---

# 8. Persistence Test

Use the following product test:

> **If the founder closes the browser and returns tomorrow, does the business still need to remember that this abnormal condition exists, who owns it, and whether it has been resolved?**

If:

```text id="vphxlm"
YES
```

persistent Operational Exception is likely appropriate.

If:

```text id="qd4cba"
NO
```

derived Attention may be sufficient.

---

# 9. Tracking Test

Operational Exception is especially appropriate when the business must preserve:

```text id="uuh6fu"
owner

acknowledgement

resolution work

escalation

evidence

root cause

historical outcome
```

across multiple interactions.

---

# 10. When Derived Attention Is Enough

A persistent exception is generally unnecessary when:

```text id="u2yknz"
condition is transient

source state already fully manages the workflow

no durable resolution tracking is required

no ownership handoff is required

no historical exception record is useful

condition disappears naturally
when authoritative source state changes
```

---

# 11. Derived Attention Example

Example:

```text id="8lwcmm"
Qualified Lead
needs Requirement continuation.
```

This may be:

```text id="15iayn"
ACTION
```

in D2.

It is not an Operational Exception merely because action is required.

---

# 12. Waiting Example

Example:

```text id="q1ijpe"
Vendor Assignment
awaiting acknowledgement
within approved response window.
```

This may be:

```text id="273l6h"
WAITING
```

without opening an exception.

---

# 13. Exception Promotion Example

If:

```text id="hutsgv"
Vendor acknowledgement
exceeds approved response window
```

and the delay requires explicit coordination/resolution:

it may become:

```text id="puf1g5"
Operational Exception
=
VENDOR_NO_RESPONSE
```

---

# 14. Lifecycle State Is Not Exception

Example:

```text id="6ljdmt"
Production Job
=
IN_PRODUCTION
```

is normal business lifecycle.

No exception exists solely because the job is active.

---

# 15. Abnormal Condition Is Not Lifecycle State

Current canonical architecture already states:

```text id="a9t3cc"
Production Job
=
IN_PRODUCTION

Condition
=
DELAYED
```

instead of:

```text id="jy4opn"
Production Job
=
PRODUCTION_DELAYED
```

Operational Exception must preserve this separation.

---

# 16. Exception vs Derived Condition

A condition such as:

```text id="mhnvg2"
DELAYED
```

may be derived from current state and deadline.

Operational Exception is the durable business record created only when that abnormality qualifies for explicit operational tracking.

---

# 17. Logical Operational Exception Contract

A product-level Operational Exception must be capable of expressing:

```text id="bgchve"
logical identity

organization

brand context where applicable

category

exception type

severity

primary related object

supporting related objects

source

detected time

opened time

responsible role

responsible principal where assigned

status

business impact

evidence

root cause where known

resolution

resolution type

acknowledgement

dismissal reason where applicable

reopen history

attention relationship

audit/history
```

Exact physical representation is architecture work.

---

# 18. Exception Category

D3 v1 defines these controlled product categories:

```text id="w3gd4g"
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

---

# 19. Category Purpose

Category answers:

```text id="ol7kzu"
WHICH BROAD
BUSINESS CONTROL AREA
OWNS THIS ABNORMALITY?
```

It is not the same as exception type.

---

# 20. CATEGORY-COMMERCIAL

For abnormal conditions affecting:

```text id="3dwglv"
quote

commercial commitment

customer scope

commercial terms

commercial approval
```

when durable exception tracking is actually required.

---

# 21. CATEGORY-FINANCIAL

For abnormality involving:

```text id="q3y828"
payment mismatch

receivable problem

cost problem

material margin issue

financial reconciliation
```

without redefining canonical Payment/Invoice state.

---

# 22. CATEGORY-PRODUCTION

For abnormal production execution such as:

```text id="pkiu2n"
material delay

production blockage

execution failure

unresolved production dependency
```

---

# 23. CATEGORY-VENDOR

For abnormality attributable primarily to external production/provider relationship such as:

```text id="0nwlpf"
no response

commitment failure

material Vendor delay

Vendor unable to execute
```

---

# 24. CATEGORY-QUALITY

For material quality-control abnormality requiring explicit resolution tracking.

Examples may include:

```text id="nt0wf2"
failed QC

repeated rework

quality defect requiring higher-level response
```

---

# 25. CATEGORY-FULFILLMENT

For material abnormalities affecting:

```text id="vuo34i"
dispatch

delivery

address

carrier

shipment completion
```

where existing Shipment lifecycle alone is insufficient for resolution tracking.

---

# 26. CATEGORY-INVENTORY_PROCUREMENT

For applicable abnormal conditions involving:

```text id="t7w9nm"
missing stock

procurement failure

Goods Receipt discrepancy

Vendor Bill / procurement blockage
```

when in Founder Control scope.

---

# 27. CATEGORY-DATA_INTEGRITY

For business-data conditions such as:

```text id="4aip0e"
required information missing

conflicting operational records

required evidence absent

business fact cannot be established
```

that materially impair operation.

---

# 28. Data Integrity ≠ Technical Database Incident

Example:

```text id="r83eq9"
required artwork approval missing
```

may be business Data Integrity.

Example:

```text id="av8vkb"
PostgreSQL server unavailable
```

is a technical incident.

---

# 29. CATEGORY-AUTOMATION_IMPACT

For business-impacting failure of an automation that was expected to perform a meaningful operational responsibility.

Example:

```text id="znfgaf"
required payment reminder workflow
failed repeatedly

and

collection follow-up is now at risk
```

---

# 30. Automation Failure Is Not Automatically Exception

A transient retryable workflow failure that self-recovers and creates no material business impact SHOULD remain automation/runtime evidence.

Do not generate business exceptions for every technical retry.

---

# 31. CATEGORY-POLICY_COMPLIANCE

For material abnormalities involving:

```text id="k0bi5n"
IP hold

policy breach

compliance requirement

approval control failure
```

where operational tracking is required.

---

# 32. CATEGORY-OTHER

`OTHER` exists only as a controlled escape hatch for real operating evidence not covered by current taxonomy.

It requires:

```text id="dz6a96"
explicit description

reason existing categories do not fit
```

Repeated use of `OTHER` is taxonomy-debt evidence.

---

# 33. Exception Type

Category is broad.

Exception Type identifies the specific abnormal condition.

Logical examples:

```text id="b2zp5x"
production.deadline_breached

vendor.no_response

quality.qc_failed

financial.payment_mismatch

financial.actual_cost_missing

fulfillment.delivery_problem

automation.required_workflow_failed
```

---

# 34. Stable Exception Types

Exception Types SHOULD be:

```text id="vq8e42"
stable

machine-readable

business-meaningful

provider-neutral
```

Avoid:

```text id="9u4eud"
supabase_error_42

n8n_node_failed
```

as business exception types.

---

# 35. Provider Detail Belongs In Evidence

Provider/runtime detail may be supporting evidence.

Business exception identity should describe the business abnormality.

---

# 36. Exception Severity

D3 v1 defines:

```text id="2gy49j"
LOW

MEDIUM

HIGH

CRITICAL
```

This aligns with TeeStock operating vocabulary.

---

# 37. Severity Definition

Severity answers:

> **How serious is the business impact or risk represented by this exception if it remains unresolved?**

It does not answer:

```text id="fl7er9"
How quickly should the founder look at it?
```

That is D2 Attention Priority.

---

# 38. Severity ≠ Priority

Canonical separation:

```text id="s7r13r"
EXCEPTION SEVERITY
=
business impact

ATTENTION PRIORITY
=
attention ordering / immediacy
```

---

# 39. SEVERITY-LOW

A localized abnormality with:

```text id="zsjda5"
limited impact

low near-term business risk

routine resolution path
```

but still worth durable tracking.

---

# 40. SEVERITY-MEDIUM

A meaningful abnormality that:

```text id="rccs2q"
requires active ownership

can affect timing, cost,
quality, or customer outcome

but remains operationally recoverable
without high-impact escalation
```

---

# 41. SEVERITY-HIGH

A material abnormality that threatens:

```text id="p7qwmp"
customer commitment

material financial outcome

quality

delivery

operational continuity
```

and may require management/founder awareness.

---

# 42. SEVERITY-CRITICAL

A critical exception may involve:

```text id="ckxhym"
major customer impact

legal/compliance risk

large financial loss

widespread operational disruption

material business-integrity risk
```

consistent with TeeStock Operating Model.

---

# 43. Critical Must Qualify For Founder Attention Visibility

A:

```text id="1lawkg"
CRITICAL
```

Operational Exception MUST qualify for Founder Control visibility evaluation under D2.

D3 defines the exception severity and business impact. The founder-facing representation, attention projection, and Founder Home placement are strictly owned by D2 (`founder-attention-experience-spec.md`).

Furthermore:

- CRITICAL severity does NOT automatically imply `Founder Decision Required = YES`.
- CRITICAL severity does NOT automatically imply `Priority = INTERRUPT`.
- Attention Priority and Founder Decision Required remain independently evaluated under D2 semantics.

---

# 44. Severity Factors

Severity assessment may consider:

```text id="zvfpaf"
customer impact

financial exposure

quality impact

delivery impact

legal/compliance impact

scope of affected work

reversibility

operational continuity impact
```

Exact numeric thresholds belong to business policy.

---

# 45. No Invented Materiality Threshold

D3 MUST NOT invent:

```text id="rx8yvj"
Rp amount

percentage margin

hours late

days late

customer-count threshold
```

without an authoritative business decision.

---

# 46. Severity Can Change

An active exception may:

```text id="5w9nl6"
escalate

or

de-escalate
```

when business impact changes.

Severity history must remain explainable where material.

---

# 47. Product Lifecycle Requirements

D3 v1 lifecycle:

```text id="u2rzp3"
OPEN
  ↓
ACKNOWLEDGED
  ↓
RESOLVED
```

Alternative terminal path:

```text id="9sbju7"
OPEN / ACKNOWLEDGED
        ↓
DISMISSED
```

Reopen transition:

```text id="8b4nno"
RESOLVED / DISMISSED
        ↓
OPEN
```

when justified.

---

# 48. Proposed Product-Required Lifecycle Vocabulary

PROPOSED PRODUCT-REQUIRED LIFECYCLE VOCABULARY:

```text id="vtsb0d"
OPEN

ACKNOWLEDGED

RESOLVED

DISMISSED
```

`REOPENED` is an event/transition concept, not a long-lived status.

### Canonical Architecture Separation

These states express product-required behavior for architecture impact review.

They are NOT yet canonical MGBOS state-machine semantics.

Canonical lifecycle vocabulary, allowed transitions, guards, terminal semantics, storage classification, and transition authority belong to:

`../architecture/business-state-machines.md`

after applicable architecture reconciliation.

---

# 49. STATUS-OPEN

`OPEN` means:

> An exception has been established as a durable abnormal business condition and remains unresolved.

---

# 50. OPEN Does Not Require Root Cause

An exception may open before root cause is known.

Required:

```text id="8kjuin"
credible abnormal condition

business relevance

supporting evidence
```

Root-cause investigation may follow.

---

# 51. STATUS-ACKNOWLEDGED

`ACKNOWLEDGED` means:

> A responsible actor has explicitly accepted awareness/ownership of the active exception.

---

# 52. Acknowledgement Does Not Mean Resolution

Canonical:

```text id="e9uz8a"
ACKNOWLEDGED
≠
RESOLVED
```

It means:

```text id="ulv86b"
someone owns the problem
```

not:

```text id="86foh3"
the problem is gone
```

---

# 53. Acknowledgement Requirements

Acknowledgement SHOULD establish:

```text id="4wqzbn"
responsible actor/principal

acknowledged_at

acknowledged_by
```

where applicable.

---

# 54. STATUS-RESOLVED

`RESOLVED` means:

> The active abnormal condition has been remediated, otherwise legitimately concluded, or explicitly accepted through an authorized resolution path.

---

# 55. Resolution Must Be Explicit

Resolution SHOULD record:

```text id="ss9a3b"
resolution type

resolution summary

resolver

resolved_at

supporting evidence
```

where applicable.

---

# 56. Resolution Is Not Hide

A card disappearing from Founder Home is not sufficient evidence that the Operational Exception is resolved.

---

# 57. STATUS-DISMISSED

`DISMISSED` means:

> The exception record should not remain an active business exception because the exception was invalid, duplicate, not applicable, or otherwise incorrectly opened.

---

# 58. Dismissal Is Not “Ignore”

D3 explicitly prohibits:

```text id="ka4l65"
DISMISSED
=
we know the problem exists
but do not want to see it
```

That would hide business risk.

---

# 59. Valid Dismissal Reasons

Product-level dismissal reasons include:

```text id="2wghx4"
FALSE_POSITIVE

DUPLICATE

NOT_APPLICABLE

OPENED_IN_ERROR
```

Additional reasons require product review.

---

# 60. Accepted Risk Is Not Dismissal

If an abnormal condition is real but OWNER explicitly accepts the risk:

do not classify it as:

```text id="z563d9"
FALSE_POSITIVE
```

Instead it may resolve through:

```text id="jo9vke"
resolution_type
=
ACCEPTED_RISK
```

where policy permits.

---

# 61. Reopen

A RESOLVED exception may reopen when:

```text id="k8h54g"
the same underlying abnormal episode
becomes active again

or

the previous resolution proves ineffective
```

---

# 62. Reopen From Dismissed

A DISMISSED exception may reopen only when new evidence establishes that the prior dismissal was incorrect or no longer applicable.

Reopening a dismissed duplicate should normally be unnecessary if its canonical duplicate remains active.

---

# 63. Reopen Evidence

Reopen must record:

```text id="e4ugmy"
reason

actor/system source

reopened_at

supporting evidence
```

---

# 64. Reopen Preserves History

Reopening MUST NOT erase:

```text id="qolh2k"
previous resolution

previous dismissal

previous acknowledgement

prior history
```

---

# 65. New Exception vs Reopen

Default product rule:

Use:

```text id="kvcwg2"
REOPEN
```

when it is the same causal operational episode.

Use:

```text id="5c0jko"
NEW EXCEPTION
```

when the business returned to normal and a new independent abnormal episode occurred later.

---

# 66. Example — Production Delay Reopen

If one Production Job:

```text id="guf2mu"
deadline breached
→ remediated
→ same production episode slips again
```

reopen may be appropriate.

---

# 67. Example — New Independent Episode

A new Order months later using the same Vendor and suffering another delay should normally create a new exception.

It is not a reopen of the older Order's exception.

---

# 68. Resolution Types

D3 v1 logical resolution types:

```text id="dmuo5t"
REMEDIATED

WORKAROUND

SOURCE_CORRECTED

ACCEPTED_RISK

SUPERSEDED
```

---

# 69. RESOLUTION-REMEDIATED

The abnormal condition has been properly corrected.

---

# 70. RESOLUTION-WORKAROUND

Business operation recovered through an explicit workaround while deeper root cause may remain.

Workaround use should remain visible for learning.

---

# 71. RESOLUTION-SOURCE_CORRECTED

Exception existed because authoritative business data was wrong/incomplete and has now been corrected through a governed path.

---

# 72. RESOLUTION-ACCEPTED_RISK

The condition remains materially understood but an authorized decision accepts continuation without full remediation.

This requires suitable authority.

---

# 73. RESOLUTION-SUPERSEDED

The original exception is no longer independently relevant because a broader/more accurate exception now owns the operational problem.

This must preserve links/history.

---

# 74. Root Cause

Operational Exception SHOULD support:

```text id="6zj6j3"
root cause
```

when known.

Root cause is not required to open the exception.

---

# 75. Symptom vs Root Cause

Example:

```text id="jvu6pt"
SYMPTOM
Production deadline missed

ROOT CAUSE
Vendor capacity failure
```

Both may be useful.

---

# 76. Root Cause May Remain Unknown

Valid:

```text id="l8p5o7"
Root Cause
=
UNKNOWN
```

during active resolution.

Do not invent causal explanation.

---

# 77. Exception Source

D3 v1 logical detection/source types:

```text id="aczvbp"
DETERMINISTIC_RULE

HUMAN_REPORT

AUTOMATION_SIGNAL

EXTERNAL_SIGNAL

RECONCILIATION
```

---

# 78. SOURCE-DETERMINISTIC_RULE

Exception is opened because authoritative state and approved policy deterministically establish an abnormality.

Example:

```text id="mwbyzx"
production deadline breached
```

when opening policy says persistent exception is required.

---

# 79. SOURCE-HUMAN_REPORT

An authorized operator identifies an abnormal business condition not yet deterministically detectable.

Human-reported exception still requires:

```text id="3ftbaz"
related business context

reason

evidence where available
```

---

# 80. SOURCE-AUTOMATION_SIGNAL

An automation reports an operationally relevant failure/condition.

The automation does not become business authority merely by reporting it.

---

# 81. SOURCE-EXTERNAL_SIGNAL

An external provider/partner supplies an external fact that indicates abnormality.

MGBOS must still govern how that signal becomes a business exception.

---

# 82. SOURCE-RECONCILIATION

Exception is discovered during:

```text id="ybohzx"
reconciliation

audit

integrity review
```

rather than during normal transaction processing.

---

# 83. Detected Time

`detected_at` means:

> Earliest reliably established time the abnormal condition was detected.

---

# 84. Opened Time

`opened_at` means:

> Time the condition was promoted into a durable Operational Exception.

---

# 85. Detected ≠ Opened

A condition may be detected first and opened later.

Do not fabricate a historical detected timestamp if it cannot be established reliably.

---

# 86. Last Observed Time

An exception may optionally retain:

```text id="zrwtvo"
last_observed_at
```

to support persistent-condition monitoring.

Exact persistence is architecture work.

---

# 87. Ownership

Every active Operational Exception SHOULD have:

```text id="9nb04m"
RESPONSIBLE ROLE
```

and, where assigned:

```text id="qmsmty"
RESPONSIBLE PRINCIPAL
```

---

# 88. Role vs Principal

Example:

```text id="8bmykl"
Responsible Role
=
OPERATIONS

Responsible Principal
=
Rizky
```

is valid in solo-founder operation.

---

# 89. Unassigned Exception

An exception MAY open before a principal is assigned.

But:

```text id="v4cffe"
UNASSIGNED MATERIAL EXCEPTION
```

must itself remain visible and require ownership assignment.

---

# 90. Acknowledged Requires Ownership

An exception cannot meaningfully become:

```text id="9zyv6e"
ACKNOWLEDGED
```

without a responsible actor accepting it.

---

# 91. Reassignment

Ownership may move between actors.

Reassignment must preserve:

```text id="60ws2o"
previous owner

new owner

time

reason where material
```

---

# 92. Founder Is Not Default Owner

Operational Exception must not default every problem to:

```text id="7pl56c"
OWNER
```

merely because Founder Control shows the exception.

---

# 93. Founder Escalation

Founder should preferentially receive exceptions that are:

```text id="qnff3j"
STRATEGIC

HIGH-RISK

HIGH-VALUE

UNUSUAL
```

or otherwise require OWNER authority.

---

# 94. Founder Visibility vs Ownership

An exception may be visible to founder while owned by:

```text id="ajdlh8"
OPERATIONS

FINANCE

QC

SALES
```

---

# 95. Operational Exception → Attention

An active Operational Exception may produce one or more D2-derived Attention representations.

The exception itself remains the durable abnormal business fact.

---

# 96. Exception ≠ Attention

Canonical:

```text id="x2nmli"
Operational Exception
=
durable abnormality

Attention
=
what someone needs to care about now
```

---

# 97. Exception Can Exist Without Founder Attention

Example:

```text id="oqaejs"
MEDIUM Vendor delay

Operations acknowledged

recovery underway

no founder decision required
```

The exception remains active.

Founder Home may present it quietly or outside the primary action queue according to D2 rules.

---

# 98. Attention Can Exist Without Exception

Example:

```text id="15j5kk"
Quote requires OWNER pricing approval.
```

This may create:

```text id="6qt8qm"
DECISION attention
```

without requiring persistent Operational Exception.

---

# 99. Exception Severity ≠ Attention Priority

Example:

```text id="61yiqb"
Exception Severity
=
HIGH

Attention Priority
=
QUEUE
```

may be valid when:

```text id="7d7wi7"
owner assigned

resolution active

no immediate founder action
```

---

# 100. Critical Visibility Preservation

An active CRITICAL Operational Exception must not disappear from Founder Control visibility evaluation solely because another actor has acknowledged it.

Acknowledgement changes ownership state, not business impact. Routing and display on Founder Home remain governed by D2 visibility rules.

---

# 101. Deduplication

Operational Exception MUST avoid multiple active records representing the same underlying abnormal episode.

---

# 102. Logical Exception Fingerprint

D3 defines a conceptual deduplication fingerprint based on enough semantic context such as:

```text id="owd17x"
organization

exception type

primary business object

causal episode
```

Exact persistence/key implementation is deferred.

---

# 103. Active Duplicate Rule

If an equivalent active exception already exists:

a repeated detector SHOULD:

```text id="84ac20"
update observation/evidence

or

link to existing exception
```

rather than create another indistinguishable active exception.

---

# 104. Duplicate Dismissal

If a duplicate record is accidentally created:

it may be:

```text id="eegdh3"
DISMISSED
reason = DUPLICATE
```

and linked to the surviving canonical exception.

---

# 105. Cross-Domain Duplicate

One underlying problem may manifest in several domains.

Example:

```text id="iocu6m"
Vendor failure
→ Production late
→ Shipment risk
```

D3 should avoid blindly creating three competing exceptions if they form one causal operational episode.

---

# 106. Multiple Exceptions Can Still Be Valid

Separate exception records are appropriate when there are materially independent:

```text id="rql13i"
causes

owners

resolution paths

business impacts
```

even if they affect one Order.

---

# 107. Exception Evidence

An Operational Exception must preserve enough evidence to explain:

```text id="c66pg2"
WHY IT OPENED
```

even after current source state later changes.

---

# 108. Evidence May Include

Applicable evidence may include:

```text id="qlagkv"
source object reference

source status

deadline

amount

QC result

Vendor assignment

Shipment state

rule evaluation

external reference

human note
```

---

# 109. Evidence Snapshot Principle

The system should preserve enough historical context to avoid:

```text id="7iq9ez"
exception says production was late

but current production now looks normal

and nobody can explain
why the exception ever existed
```

Exact snapshot strategy is architecture work.

---

# 110. Evidence Must Not Duplicate Entire Domain Record

Preserve sufficient explanation.

Do not blindly clone every source table into Exception history.

---

# 111. Evidence Truth

Evidence should identify:

```text id="9ps9cb"
observed fact

source

time
```

rather than subjective unsupported conclusion.

---

# 112. History Requirements

Operational Exception history SHOULD preserve material transitions including:

```text id="419u4z"
opened

acknowledged

reassigned

severity changed

resolved

dismissed

reopened
```

---

# 113. History Actor

For human or agent-triggered lifecycle mutation, history should identify the responsible principal where applicable.

---

# 114. History Is Durable

Resolved/dismissed exceptions must not simply be hard-deleted to clean the dashboard.

---

# 115. Resolution Verification

For deterministic exceptions, resolution SHOULD preferably be supported by authoritative source state.

Example:

```text id="k22fiv"
production.deadline_breached
```

may not be resolvable merely through:

```text id="tnk1k3"
operator clicks resolved
```

while the condition remains unchanged, unless resolution type/policy explicitly permits accepted risk or workaround.

---

# 116. Manual Resolution

Some human-reported exceptions may not have a deterministic source condition.

Authorized manual resolution remains valid when:

```text id="12fhza"
resolution summary

evidence

actor

time
```

are captured.

---

# 117. Automatic Resolution

Automatic resolution MAY be allowed for exception types with explicit deterministic exit conditions.

Example:

```text id="p9n59q"
required data missing
→ data supplied correctly
```

Exact automatic-resolution policy belongs to architecture/engineering after type semantics are approved.

---

# 118. Resolution Must Not Bypass Domain Commands

Closing an exception must not silently fix:

```text id="ae93mx"
Payment

Order

Production

Shipment

Inventory
```

outside their governed mutation paths.

---

# 119. Exception Commands — Product-Level Logical Operations

D3 requires the product to support equivalent concepts for:

```text id="oy6pw2"
OPEN

ACKNOWLEDGE

ASSIGN / REASSIGN

UPDATE SEVERITY
where authorized

RESOLVE

DISMISS

REOPEN
```

Product-level operations express required operational capabilities. Exact command contracts, allowed canonical transitions, authorization enforcement, atomicity, event contracts, and persistence remain architecture and engineering concerns.

---

# 120. Open Operation

Opening should validate at product level:

```text id="bqyp10"
real abnormal condition

category

exception type

primary object/context

source

severity

evidence

organization scope
```

as applicable.

---

# 121. Acknowledge Operation

Acknowledge must not:

```text id="b3rri1"
alter source business lifecycle

resolve condition

grant broader permissions
```

---

# 122. Resolve Operation

Resolve must capture a legitimate conclusion and preserve history.

---

# 123. Dismiss Operation

Dismiss requires an allowed dismissal reason.

It is not a generic hide action.

---

# 124. Reopen Operation

Reopen requires evidence/reason demonstrating active abnormality again.

---

# 125. Authorization Principle

Operational Exception mutation remains subject to:

```text id="xcizku"
actor

organization

capability

current state

policy
```

consistent with MGBOS authorization architecture.

---

# 126. OWNER Is Not Exception Bypass

OWNER may have the broadest exception authority.

OWNER still cannot violate:

```text id="jcjf2u"
business invariants

organization isolation

historical integrity

canonical state
```

---

# 127. Customer Case Boundary

Customer Case answers:

> **What customer-facing issue/request/remedy must be managed?**

Operational Exception answers:

> **What abnormal internal/operational business condition must be controlled?**

They may be related.

They are not the same object.

---

# 128. Customer Case Examples

Customer Case categories may include:

```text id="rcfbcf"
complaint

scope-change request

refund request

delivery problem

quality complaint
```

according to current Domain Map direction.

---

# 129. Customer Case Does Not Replace Exception

Example:

```text id="xxddgx"
Customer reports defective product.
```

This may create:

```text id="70y4bl"
Customer Case
=
quality complaint
```

and separately expose:

```text id="h9dokm"
Operational Exception
=
production quality-control failure
```

if internal abnormality requires tracking.

---

# 130. Exception Does Not Require Customer Case

Example:

```text id="w9vj85"
Vendor misses production deadline
before customer is affected.
```

May be an Operational Exception with no Customer Case.

---

# 131. Return / Refund Boundary

TeeStock business semantics already distinguish:

```text id="o0xzp6"
RETURN

REFUND

EXCHANGE

CLAIM
```

Operational Exception must not replace these business concepts.

---

# 132. Product Claim Boundary

A defect claim is customer/remedy semantics.

Its underlying quality failure may separately produce an Operational Exception.

---

# 133. Technical Incident Boundary

Technical Incident answers:

> **What software/infrastructure/system failure must engineering/operations recover?**

Operational Exception answers:

> **What business operation is abnormally affected and needs business tracking?**

---

# 134. Technical Incident ≠ Operational Exception

Example:

```text id="qc54o0"
database unavailable
```

is a technical incident.

Do not automatically create one Operational Exception for every Order in the database.

---

# 135. Technical Incident May Cause Business Exception

If a system outage causes a specific material business commitment to become endangered:

a separate Operational Exception may be justified.

Example:

```text id="w2kdvb"
System incident
→ dispatch could not be confirmed
→ customer delivery commitment at risk
```

---

# 136. Avoid Exception Fan-Out

One technical incident affecting many records SHOULD NOT automatically create thousands of duplicate business exceptions.

Product/architecture should support summarized or selectively material business-impact tracking.

Exact implementation is deferred.

---

# 137. Automation Failure Boundary

Automation Failure describes:

```text id="hw04gv"
an automated workflow did not execute
as intended
```

This is not automatically an Operational Exception.

---

# 138. Automation Failure Promotion

Promote to Operational Exception only when the failure causes or materially threatens a business outcome requiring durable operational tracking.

---

# 139. Example — No Promotion

```text id="rfj70d"
n8n retry fails once
then succeeds automatically

no business deadline missed

no manual action required
```

Result:

```text id="60iz8s"
NO OPERATIONAL EXCEPTION
```

---

# 140. Example — Promotion

```text id="bepoqx"
required payment follow-up automation
remains failed

collection deadline now at risk

human intervention required
```

Possible:

```text id="qd4io5"
Operational Exception
=
AUTOMATION_IMPACT
```

---

# 141. Approval Request Boundary

Approval answers:

```text id="th1gis"
Does this specific exceptional action
require another authority?
```

An approval request is not automatically an Operational Exception.

---

# 142. Approval Example

```text id="5bqflq"
Quote below margin floor
requires OWNER approval.
```

May create:

```text id="t4f0yr"
D2 DECISION attention
```

without persistent exception.

---

# 143. Approval May Become Exception

If an approval remains unresolved beyond an approved policy and materially blocks business:

a separate Operational Exception may become justified.

The existence of approval itself is not the exception.

---

# 144. Business Decision Boundary

Founder Decision is a human judgment need.

Operational Exception is an abnormal condition.

One exception may require a decision.

One decision may exist without an exception.

---

# 145. Exception Escalation

Escalation means the operational handling requirement becomes more serious.

Possible changes include:

```text id="w9cy1n"
severity increase

attention priority increase

owner change

founder visibility

founder decision requirement
```

These remain distinct fields/concepts.

---

# 146. Escalation Is Not One Status

Do not create one mega-state:

```text id="r56ijb"
ESCALATED
```

that hides:

```text id="bx95fu"
why

how severe

who owns it

what action is required
```

unless architecture later establishes a precise semantic need.

---

# 147. Founder Escalation Rule

An exception SHOULD reach founder attention if applicable:

```text id="xq36qk"
OWNER decision required

critical severity

high materiality

unassigned material exception

resolution stalled materially

exception is strategic / unusual
```

according to D2 attention rules.

---

# 148. Escalation Does Not Transfer Ownership Automatically

Founder visibility does not automatically mean:

```text id="3efw6k"
Responsible Role
=
OWNER
```

---

# 149. SLA / Time Rule

D3 supports SLA-aware exception behavior.

But exact:

```text id="rqpm60"
response time

acknowledgement time

resolution time
```

must come from approved business policy.

---

# 150. Exception Age

Useful product concepts include:

```text id="spq4n3"
age since opened

age since acknowledged

age since last meaningful update
```

where these support attention/escalation.

---

# 151. Stale Exception

D3 recognizes the product need to identify exceptions that remain active without meaningful progress.

Exact stale threshold is not defined here.

---

# 152. No Silent Stale Exception

An old active exception must not disappear simply because nobody updated it.

---

# 153. Exception Update

Exception handling may record meaningful progress/update context.

D3 does not require a general chat/comments system.

---

# 154. Root-Cause Learning

Resolved exceptions SHOULD support later learning about:

```text id="obsstj"
repeated root causes

Vendor reliability

process weakness

automation weakness

policy weakness

training gaps
```

without creating a general analytics platform in v1.

---

# 155. Repeated Exception Signal

Repeated exceptions of the same type are evidence for:

```text id="a9ke5q"
process standardization

automation candidate

Vendor review

policy change

system capability promotion
```

---

# 156. Exception Metrics

D4 SHOULD measure at least:

```text id="wxhwot"
exceptions opened

exceptions by type

exceptions by severity

time to acknowledgement

time to resolution

reopens

dismissals

founder escalations

repeated root causes
```

where practical.

---

# 157. Exception Count Is Not Success Metric

Product success is not:

```text id="jydw0m"
fewer exception records
```

by itself.

A system that fails to detect real problems could show zero exceptions.

---

# 158. Healthy Direction

Desired long-term pattern:

```text id="07qj4b"
REAL ABNORMALITY
→ detected

REAL EXCEPTION
→ explicit

NORMAL WORK
→ quiet

RESOLUTION
→ traceable

REPEATED PROBLEM
→ learning
```

---

# 159. Product Acceptance Criteria

## EXC-AC-001 — Normal Work Does Not Open Exception

A normal transaction progressing within expected policy does not produce an Operational Exception merely because it is active.

---

# 160. EXC-AC-002 — Derived Attention Can Exist Without Exception

A qualified Lead requiring ordinary continuation can appear as D2 ACTION without persistent Operational Exception.

---

# 161. EXC-AC-003 — Durable Abnormality Can Be Opened

A material abnormal condition requiring ownership/resolution tracking can be represented as one OPEN Operational Exception.

---

# 162. EXC-AC-004 — Business State Remains Separate

Opening a production-delay exception does not rewrite:

```text id="w8b95r"
Production Job status
```

into a fake delay lifecycle state.

---

# 163. EXC-AC-005 — Category and Type Are Distinct

Every acceptance exception has:

```text id="exh3n1"
broad category

specific exception type
```

with distinct meanings.

---

# 164. EXC-AC-006 — Severity Is Explicit

Every active exception has an explainable severity.

---

# 165. EXC-AC-007 — Severity Does Not Replace Attention Priority

The product can represent differing:

```text id="4hm99w"
Exception Severity

Attention Priority
```

for the same exception.

---

# 166. EXC-AC-008 — Ownership Is Visible

An active exception identifies responsible role.

If principal is unassigned:

that state remains visible.

---

# 167. EXC-AC-009 — Acknowledgement Is Durable

Acknowledging an exception records ownership/acknowledgement without resolving the underlying condition.

---

# 168. EXC-AC-010 — Resolution Requires Meaning

A user cannot clear a real exception merely by hiding its card.

---

# 169. EXC-AC-011 — Dismissal Is Constrained

Dismissal requires an approved reason such as:

```text id="d85slo"
FALSE_POSITIVE

DUPLICATE

NOT_APPLICABLE

OPENED_IN_ERROR
```

---

# 170. EXC-AC-012 — Accepted Risk Is Not False Positive

A real exception accepted by OWNER remains historically represented as a legitimate exception resolution, not dismissed as invalid.

---

# 171. EXC-AC-013 — Reopen Preserves History

Reopening retains previous acknowledgement/resolution/dismissal history.

---

# 172. EXC-AC-014 — Duplicate Detector Does Not Flood

Repeated observation of one active abnormal episode does not create multiple indistinguishable active exceptions.

---

# 173. EXC-AC-015 — Independent Episodes Remain Independent

A new unrelated abnormal episode creates a separate exception rather than incorrectly reopening old history.

---

# 174. EXC-AC-016 — Opening Evidence Survives Source Change

After source state changes, historical exception still contains enough information to explain why it opened.

---

# 175. EXC-AC-017 — Customer Case Remains Separate

A quality complaint can coexist with related Operational Exception without one replacing the other's lifecycle.

---

# 176. EXC-AC-018 — Technical Incident Remains Separate

A technical outage does not automatically rewrite business exception state.

---

# 177. EXC-AC-019 — Automation Retry Does Not Create Noise

A transient self-recovered automation retry does not create business Operational Exception.

---

# 178. EXC-AC-020 — Material Automation Failure Can Promote

A materially business-impacting automation failure can be promoted to Operational Exception with traceable evidence.

---

# 179. EXC-AC-021 — Approval Remains Separate

A normal approval request does not automatically create Operational Exception.

---

# 180. EXC-AC-022 — Founder Visibility Does Not Reassign Owner

Escalating an exception to Founder Control does not automatically change Responsible Role to OWNER.

---

# 181. EXC-AC-023 — Organization Isolation Holds

No exception from another organization is visible or mutable through current organization context.

---

# 182. EXC-AC-024 — History Is Preserved

Resolved and dismissed exceptions are not hard-deleted merely to clean active views.

---

# 183. EXC-AC-025 — Domain Invariants Still Hold

Opening/resolving exception cannot bypass:

```text id="k5tnji"
Payment invariants

Order invariants

Production state machine

Shipment guards

organization ownership
```

---

# 184. EXC-AC-026 — Root Cause May Be Unknown

An exception can legitimately open with:

```text id="3ywm1w"
Root Cause
=
UNKNOWN
```

without fabricating an explanation.

---

# 185. EXC-AC-027 — Other Is Controlled

Use of:

```text id="4kk0iw"
Category = OTHER
```

requires explicit classification explanation.

---

# 186. EXC-AC-028 — Critical Exception Is Visible

A CRITICAL active exception cannot silently disappear because it has been acknowledged.

---

# 187. EXC-AC-029 — Resolution Does Not Mutate Source Illegally

Resolving an exception never silently modifies authoritative source domain state outside governed command boundaries.

---

# 188. EXC-AC-030 — Founder Control Can Project Exception

An active Operational Exception can be surfaced through D2 Attention without duplicating its authoritative exception identity.

---

# 189. Product Risks

## EXC-RISK-001 — Exception Inflation

Risk:

Every imperfect condition becomes persistent exception.

Result:

```text id="io25hd"
noise

maintenance burden

founder fatigue
```

Mitigation:

strict persistence qualification.

---

# 190. EXC-RISK-002 — Hidden Mega-State

Risk:

Exception becomes substitute state machine for every domain.

Mitigation:

source domain state remains authoritative.

---

# 191. EXC-RISK-003 — Duplicate Truth

Risk:

Exception copies source status and drifts.

Mitigation:

reference authoritative facts; preserve only necessary evidence.

---

# 192. EXC-RISK-004 — Dismiss Abuse

Risk:

operators dismiss real problems to clean queues.

Mitigation:

constrained dismissal semantics and audit history.

---

# 193. EXC-RISK-005 — Founder Becomes Default Owner

Risk:

every exception is assigned to OWNER.

Mitigation:

logical responsible roles and selective escalation.

---

# 194. EXC-RISK-006 — Severity Inflation

Risk:

everything becomes HIGH/CRITICAL.

Mitigation:

severity criteria tied to business impact.

---

# 195. EXC-RISK-007 — Technical Noise

Risk:

runtime retries generate thousands of business exceptions.

Mitigation:

technical/automation failure requires business-impact promotion.

---

# 196. EXC-RISK-008 — Duplicate Customer Issue Models

Risk:

Customer Case and Operational Exception become competing representations of the same concept.

Mitigation:

customer-facing remedy vs internal abnormality boundary.

---

# 197. EXC-RISK-009 — Manual Resolution Lies

Risk:

operator marks resolved while source problem remains.

Mitigation:

deterministic resolution evidence where possible.

---

# 198. EXC-RISK-010 — Permanent Exception Graveyard

Risk:

exceptions accumulate without ownership or lifecycle discipline.

Mitigation:

ownership, acknowledgement, stale monitoring, lifecycle metrics.

---

# 199. Product Decisions

## EXC-DEC-001 — Operational Exception Is Durable

Status:

```text id="qukp2g"
DECIDED
```

Operational Exception exists for abnormality requiring durable business tracking.

---

# 200. EXC-DEC-002 — Exception Is Not Business Lifecycle State

Status:

```text id="xnhxuh"
DECIDED
```

Exception remains separate from source-domain lifecycle.

---

# 201. EXC-DEC-003 — Attention And Exception Are Separate

Status:

```text id="a8zv91"
DECIDED
```

Attention may exist without Exception.

Exception may exist without immediate founder action.

---

# 202. EXC-DEC-004 — Severity Vocabulary

Status:

```text id="msklaf"
DECIDED
```

D3 v1 uses:

```text id="rd0r04"
LOW

MEDIUM

HIGH

CRITICAL
```

---

# 203. EXC-DEC-005 — Lifecycle Vocabulary

Status:

```text id="w4dqag"
DECIDED
```

D3 v1 uses:

```text id="930mvz"
OPEN

ACKNOWLEDGED

RESOLVED

DISMISSED
```

---

# 204. EXC-DEC-006 — Reopen Is Transition

Status:

```text id="k8w67i"
DECIDED
```

`REOPENED` is not a persistent lifecycle state.

Reopen returns the exception to OPEN while preserving history.

---

# 205. EXC-DEC-007 — Dismissal Is Not Hide

Status:

```text id="tsg34i"
DECIDED
```

Dismissal is reserved for invalid/duplicate/not-applicable exception records.

---

# 206. EXC-DEC-008 — Accepted Risk Is Resolution

Status:

```text id="8ksmy3"
DECIDED
```

Accepted risk remains a real exception outcome, not false-positive dismissal.

---

# 207. EXC-DEC-009 — Root Cause Optional At Open

Status:

```text id="es2oyp"
DECIDED
```

Root cause may remain unknown while the exception is active.

---

# 208. EXC-DEC-010 — Customer Case Remains Separate

Status:

```text id="gducl7"
DECIDED
```

Customer-facing issue/remedy lifecycle is not Operational Exception lifecycle.

---

# 209. EXC-DEC-011 — Technical Incident Remains Separate

Status:

```text id="pbynzb"
DECIDED
```

Infrastructure/software incidents remain distinct.

---

# 210. EXC-DEC-012 — Automation Failure Requires Business Impact

Status:

```text id="jtw09e"
DECIDED
```

Automation failure becomes Operational Exception only when business impact justifies durable operational tracking.

---

# 211. EXC-DEC-013 — Approval Request Is Not Automatically Exception

Status:

```text id="j8g19y"
DECIDED
```

Normal approval semantics remain distinct.

---

# 212. EXC-DEC-014 — One Active Exception Per Logical Episode

Status:

```text id="s5i7b5"
DECIDED
```

Duplicate detection must converge on one active logical exception for the same abnormal episode.

---

# 213. EXC-DEC-015 — History Must Survive Resolution

Status:

```text id="hyeo6d"
DECIDED
```

Exception records cannot disappear because the active queue should be clean.

---

# 214. EXC-DEC-016 — Physical Persistence Design Deferred

Status:

```text id="4g8qhc"
DEFERRED_TO_ARCHITECTURE
```

D3 does not decide:

```text id="f09zgm"
table

schema

event implementation

query model
```

---

# 215. Unknowns

## EXC-UNK-001 — Initial Approved Exception Type Catalog

Resolution status:

```text
RESOLVED_BY_D4
```

Owner:
`mgbos.product.teestock-operational-pilot`

D4 (`teestock-operational-pilot-plan.md`) Section 38–46 selects the bounded initial validation catalog:

1. Production deadline breach
2. Vendor no-response / commitment problem
3. QC failure / rework
4. Fulfillment blocker / delivery problem
5. Past-due receivable / payment issue
6. Required Actual Cost missing
7. Material margin exception
8. Business-impacting automation failure

Preserved rule: Only exception types supported by approved implementation may be automatically detected.

---

# 216. EXC-UNK-002 — Exact Severity Thresholds

Numeric or business thresholds require authoritative business policy.

---

# 217. EXC-UNK-003 — Exact SLA Thresholds

Vendor response, acknowledgement, stale-exception and resolution windows remain unresolved until policy/pilot definition.

---

# 218. EXC-UNK-004 — Physical Exception Identity

Exact database identity and deduplication-key implementation remain architecture work.

---

# 219. EXC-UNK-005 — Automatic Open Types

Which exception types should open automatically versus human-confirmed remains to be resolved through product/architecture review.

---

# 220. EXC-UNK-006 — Automatic Resolution Types

Same for automatic resolution.

---

# 221. EXC-UNK-007 — Customer Case Canonical Lifecycle

Customer Case remains NEXT-LITE in Domain Map.

D3 only defines its boundary relative to Operational Exception.

---

# 222. EXC-UNK-008 — Cross-Exception Root-Cause Linking

Future product may need one root-cause issue linked to several exceptions.

Not required for Founder Control v1 unless pilot evidence proves need.

---

# 223. EXC-UNK-009 — Exception Comments / Activity Feed

A general discussion/comment system is not currently required.

History/evidence needs should be solved minimally.

---

# 224. EXC-UNK-010 — Notification Policy

Outbound notification/escalation channels remain outside D3.

---

# 225. D4 Handoff

```text
D4 HANDOFF
=
SATISFIED BY ACTIVE D4 v1
```

D4 (`teestock-operational-pilot-plan.md`) has satisfied this handoff by selecting the bounded initial pilot exception catalog (Section 38–46). The original handoff guidance is preserved for historical and traceability context:

Candidate evidence areas included:

```text id="a2b0gh"
production delay

Vendor no-response

QC failure

fulfillment blocker

past-due receivable

missing Actual Cost

material margin exception

material business-impacting automation failure
```

---

# 226. D4 Must Define Evidence

For each pilot exception type, D4 should identify:

```text id="o0j95t"
trigger / observation

source

expected severity

expected owner

expected attention behavior

resolution evidence

pilot measurement
```

without turning D4 into physical architecture.

---

# 227. D4 Must Test False Positives

Pilot must test:

```text id="z6ggkd"
normal work does not create exception
```

not only successful detection of abnormalities.

---

# 228. D4 Must Test Founder Selectivity

Pilot must include exception cases that:

```text id="8g7xbq"
require operational action
but do not require founder decision
```

to prove founder-by-exception semantics.

---

# 229. Architecture Impact Review

After D4 and cross-document product audit, architecture must determine whether Operational Exception becomes:

```text id="5sxni0"
a first-class persistent MGBOS entity

another durable representation

or a combination of derived and persistent models
```

based on these approved semantics.

---

# 230. Likely Architecture Owners

If persistent representation is approved, likely canonical documents requiring review include:

```text id="x12ysb"
canonical-data-model.md

business-state-machines.md

business-invariants.md

command-event-model.md

permission-authorization-model.md

domain-map-capability-ownership.md
```

Not all must necessarily change.

---

# 231. Architecture Must Preserve D3

Any physical design must preserve:

```text id="32htlh"
exception ≠ source state

exception ≠ attention

exception ≠ customer case

exception ≠ technical incident

severity ≠ attention priority

dismissed ≠ resolved

acknowledged ≠ resolved

history survives closure
```

---

# 232. Engineering Entry Gate

D3 does NOT open engineering implementation.

Before Phase 2:

```text id="uusfgh"
D4 operational pilot plan
=
ACTIVE / BOUNDED

cross-document product audit
=
PASS

Owner product package approval
=
ESTABLISHED

architecture impact review
=
COMPLETE

current source audit
=
COMPLETE

routing / risk
=
RESOLVED

implementation contract
=
READY
```

---

# 233. Current Product Package State

```text id="e6og1h"
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
ACTIVE / SPEC_MATURE

D3
Operational Exception Spec
=
ACTIVE / SPEC_MATURE

D4
Real Operational Pilot Plan
=
ACTIVE / PILOT_PLAN_MATURE

CROSS-DOCUMENT PRODUCT AUDIT
=
PASS (POST-RECONCILIATION)

OWNER PRODUCT PACKAGE APPROVAL
=
PENDING

ARCHITECTURE LIFECYCLE STATUS
=
PENDING_ARCHITECTURE_RECONCILIATION

ARCHITECTURE IMPACT REVIEW
=
NOT STARTED

ENGINEERING READINESS
=
NOT READY

PHASE 2 IMPLEMENTATION
=
NOT OPEN
```

---

# 234. Requirement Trace — Persistent Exception

```text id="oz8c6o"
D1 PROB-004
Exceptions Can Remain Implicit
        ↓
D1 FR-012
Operational Exception Capability
        ↓
D2
Attention / Exception Separation
        ↓
D3
Durable Exception Qualification
+
Lifecycle
+
Ownership
+
Resolution
```

---

# 235. Requirement Trace — Founder Selectivity

```text id="1c4klq"
D1 OUTCOME-005
Founder Escalation Is Intentional
        ↓
D2
Responsible Actor
+
Founder Decision Required
        ↓
D3
Exception Ownership
+
Founder Escalation
```

---

# 236. Requirement Trace — Evidence

```text id="ug2uet"
D1 FR-014
Exception Evidence
        ↓
D3
Opening Evidence
+
Historical Evidence
+
Resolution Evidence
```

---

# 237. Requirement Trace — History

```text id="v49nuu"
D1 FR-025
Active vs Historical Attention
        ↓
D3
RESOLVED / DISMISSED
+
History Preservation
+
Reopen
```

---

# 238. Product Success Condition

D3 succeeds when MGBOS can eventually distinguish:

```text id="274hr7"
NORMAL WORK

TRANSIENT ATTENTION

DURABLE OPERATIONAL EXCEPTION

CUSTOMER CASE

TECHNICAL INCIDENT

AUTOMATION FAILURE

APPROVAL

FOUNDER DECISION
```

without collapsing them into one generic:

```text id="sn670x"
ISSUE
```

concept.

---

# 239. Final Principle

Operational Exception must create durable operational clarity, not another source of status noise.

Target behavior:

```text id="fk22gl"
NORMAL CONDITION
→ no exception

TRANSIENT ACTION
→ attention only where needed

MATERIAL ABNORMALITY
→ exception opened

EXCEPTION
→ owned

OWNED
→ acknowledged

WORK
→ resolved

INVALID RECORD
→ dismissed with reason

RECURRENCE
→ reopened or new episode
   according to causal reality

HISTORY
→ preserved

FOUNDER
→ involved only where material
```

Canonical D3 definition:

> **An Operational Exception is the durable MGBOS representation of a materially abnormal business condition that must remain owned, explainable, and traceable until legitimately resolved or dismissed. It is not a replacement for domain state, Founder Attention, Customer Case, technical incident, automation telemetry, approval, or human decision.**
