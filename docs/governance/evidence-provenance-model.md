---
canonical_id: docs.governance.evidence-provenance-model
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: ecosystem
document_class: governance
effective_from: 2026-09-29
authoritative_for:
  - ecosystem evidence semantics
  - provenance semantics
  - claim-source relationships
  - source authority classification
  - evidence verification status
  - freshness semantics
  - fact-inference-assumption separation
  - evidence requirements by risk
  - decision-package provenance
  - JARVIS synthesis evidence rules
  - execution and verification evidence
  - memory and research provenance boundaries
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - documentation-constitution.md
  - canonical-source-map.md
  - cross-system-risk-classification.md
  - autonomy-levels.md
  - approval-policy.md
  - ../architecture/master-system-blueprint.md
  - ../architecture/system-boundaries.md
  - ../architecture/architectural-laws.md
  - ../../mgbos/docs/architecture/command-event-model.md
  - ../../mgbos/docs/architecture/business-invariants.md
  - ../../mgbos/docs/engineering/agent-system/evidence-model.md
supersedes: null
---

# Cross-System Evidence & Provenance Model v1.0

## 1. Purpose

Dokumen ini mendefinisikan bagaimana BisnisHub mengetahui:

```text
WHAT do we know?

WHERE did it come from?

WHO or WHAT produced it?

WHEN was it observed?

HOW authoritative is the source
for this particular claim?

IS it still fresh?

WAS it verified?

IS it fact, inference,
recommendation, memory,
research, or assumption?
```

Tujuan akhirnya:

> **Setiap keputusan penting harus dapat ditelusuri dari claim → evidence → source → action → outcome.**

---

# 2. Core Principle

> **No source is authoritative for everything. Authority is claim-specific.**

Contoh:

```text
MGBOS
→ authoritative for invoice state

GitHub
→ authoritative for repository revision

Canonical Documentation
→ authoritative for intended architecture

Courier Provider
→ authoritative for courier-side tracking observation

Human Owner
→ authoritative for business intent / approval

AI Model
→ authoritative for none of the above
```

---

# 3. Evidence vs Provenance

These concepts are related but distinct.

## Evidence

Information used to support:

```text
claim
decision
verification
```

## Provenance

Information describing:

```text
where that evidence originated
how it was obtained
which revision/state it represents
what transformations occurred
```

Canonical:

```text
Evidence
=
what supports the claim

Provenance
=
where the supporting information came from
and how it reached us
```

---

# 4. Evidence Is Not Truth by Itself

A piece of evidence can be:

```text
incorrect
stale
partial
conflicting
misinterpreted
```

Therefore:

```text
EVIDENCE
   ↓
SOURCE AUTHORITY
   ↓
VALIDATION
   ↓
FRESHNESS
   ↓
VERIFICATION
   ↓
CLAIM
```

---

# 5. Provenance Is Mandatory for Material Claims

A material factual claim SHOULD be traceable to evidence.

Especially:

```text
financial claims
inventory claims
customer status
production status
security state
approval state
deployment state
high-risk recommendations
```

---

# 6. Evidence-First Principle

For factual operational output:

```text
CLAIM
must follow
EVIDENCE
```

not:

```text
MODEL GENERATES CLAIM
then searches for something
that sounds supportive
```

---

# 7. Evidence Is Part of Runtime Correctness

Evidence is not merely UI decoration.

For JARVIS:

```text
response correctness
=
reasoning quality
+
source correctness
+
evidence linkage
+
freshness
+
verification
```

---

# 8. Claim Types

Every meaningful output SHOULD conceptually belong to one of these classes:

```text
AUTHORITATIVE_FACT
OBSERVED_FACT
DERIVED_FACT
INFERENCE
RECOMMENDATION
ASSUMPTION
HYPOTHESIS
INTENT
DECISION
PREFERENCE
PLAN
```

---

# 9. AUTHORITATIVE_FACT

A fact obtained from the system that owns that business meaning.

Example:

```text
Invoice balance:
Rp5.000.000

Source:
MGBOS invoice projection
```

---

# 10. OBSERVED_FACT

A directly observed fact from a source that may not be the final internal authority.

Example:

```text
Courier provider reports:
DELIVERED
```

That is authoritative for:

```text
provider-side tracking observation
```

but internal MGBOS fulfillment state may still require reconciliation.

---

# 11. DERIVED_FACT

A deterministically calculated fact from authoritative inputs.

Example:

```text
available inventory
=
quantity_on_hand - quantity_reserved
```

or:

```text
margin percentage
```

when calculated by canonical business logic.

Derived facts SHOULD retain provenance to their input facts.

---

# 12. INFERENCE

A conclusion produced through interpretation.

Example:

```text
Vendor A is likely to miss the customer deadline.
```

This is not a raw fact.

It may derive from:

```text
current production status
historical SLA
remaining work
deadline
```

---

# 13. RECOMMENDATION

A proposed course of action.

Example:

```text
Recommend moving finishing to Vendor B.
```

Recommendation SHOULD point to:

```text
supporting evidence
assumptions
risk
tradeoffs
```

---

# 14. ASSUMPTION

A proposition temporarily accepted because required evidence is unavailable.

Example:

```text
Assumption:
Vendor B can accept work tomorrow.
```

until capacity is verified.

Assumption MUST be visibly distinguishable from fact.

---

# 15. HYPOTHESIS

A proposition intentionally awaiting investigation.

Example:

```text
Hypothesis:
Margin degradation is caused by vendor cost variance.
```

Hypothesis is not an assumption used silently for execution.

---

# 16. INTENT

Intent records what an actor wants.

Example:

```text
Rizky wants Vendor B used for this job.
```

Authenticated human intent can be authoritative for:

```text
decision intention
```

but not automatically for:

```text
current vendor capacity
```

---

# 17. DECISION

Decision is an authoritative choice by an eligible actor/policy.

Example:

```text
Approve Vendor B reassignment.
```

Decision provenance SHOULD link to:

```text
decision maker
decision package
approval record
supporting evidence
```

---

# 18. PREFERENCE

Preference describes how an actor tends to want something done.

Example:

```text
Rizky prefers concise vendor reports.
```

Preference is lower authority than:

```text
security rule
business invariant
approval policy
```

---

# 19. PLAN

Plan describes intended future execution.

Plan is not proof that execution occurred.

```text
PLAN
≠
ACTION
≠
VERIFIED OUTCOME
```

---

# 20. Source Classes

Canonical source classes:

```text
AUTHORITATIVE_INTERNAL_SYSTEM

AUTHORITATIVE_EXTERNAL_SYSTEM

CANONICAL_DOCUMENT

EXECUTION_EVIDENCE

HUMAN_DECISION_OR_OBSERVATION

EXTERNAL_CONTENT

RESEARCH_SOURCE

MEMORY

MODEL_DERIVATION

ASSUMPTION
```

---

# 21. Authoritative Internal System

Examples:

```text
MGBOS
Git repository
approved identity service
future internal systems of record
```

Authority remains domain-specific.

---

# 22. MGBOS Authority

MGBOS is authoritative for MGBOS-controlled business domains.

Examples:

```text
customer account
quote
order
invoice
payment
inventory
production job
shipment
procurement
```

JARVIS MUST prefer current MGBOS state over remembered state.

---

# 23. Git Repository Authority

Git is authoritative for:

```text
repository content
commit history
versioned source
```

It is not authoritative for:

```text
whether production deployment succeeded
```

unless deployment evidence confirms it.

---

# 24. Canonical Documentation Authority

ACTIVE canonical documentation is authoritative for:

```text
intended architecture
policy
contract semantics
system boundaries
```

It does not automatically prove:

```text
runtime implementation exists
production is configured
tests passed
```

---

# 25. Authoritative External System

Some facts originate outside BisnisHub.

Examples:

```text
payment provider transaction acknowledgement
courier tracking observation
GitHub hosted CI state
email provider delivery acknowledgement
```

The external system can be authoritative for its own domain.

---

# 26. External Authority Is Scope-Limited

Example:

```text
Payment Provider:
transaction SUCCESS
```

means:

```text
provider reports transaction success
```

It does NOT directly mean:

```text
MGBOS invoice is PAID
```

Internal reconciliation determines that.

---

# 27. Execution Evidence

Execution evidence records what actually happened during:

```text
test
tool execution
deployment
business command
verification
```

Examples:

```text
CI run
command result
database re-read
provider acknowledgement
test report
restore drill result
```

---

# 28. Engineering Evidence

Engineering evidence SHOULD preserve:

```text
repository
base revision
head revision
execution time
executor
result
observed behavior
limitations
```

A successful test from an old revision MUST NOT be presented as evidence for a newer incompatible revision.

---

# 29. Human Decision / Observation

Authenticated humans may provide:

```text
approval
business decision
physical observation
preference
manual confirmation
```

Human evidence must still be interpreted by domain.

Example:

```text
Operator:
"Barang sudah diterima."
```

may be the authorized observation that produces a Goods Receipt command.

---

# 30. Human Assertion Is Not Universally Authoritative

Customer says:

```text
"Saya sudah transfer."
```

This is:

```text
customer claim
```

not automatically:

```text
payment fact
```

---

# 31. External Content

Examples:

```text
email
web page
PDF
customer message
vendor file
social post
GitHub issue
uploaded document
```

Default status:

```text
UNTRUSTED CONTENT
```

unless provenance establishes stronger authority for a specific claim.

---

# 32. Research Source

Research supports understanding.

Examples:

```text
industry report
documentation
web research
benchmark
paper
article
```

Research may support:

```text
strategy
recommendation
technical understanding
```

It does not automatically own business runtime truth.

---

# 33. Memory

Memory is contextual evidence.

Examples:

```text
past discussion
past preference
previous summary
episodic event
```

Canonical law:

> **Memory is context, not transactional truth.**

---

# 34. Model Derivation

Model-generated:

```text
summary
classification
interpretation
forecast
recommendation
```

is derived reasoning.

Its provenance SHOULD include the supporting source evidence.

---

# 35. Assumption Source

When evidence is unavailable, an assumption may be explicitly recorded.

Assumption SHOULD include:

```text
what is assumed
why
impact if wrong
how it can be verified
```

---

# 36. Authority Is Claim-Specific

Never assign a universal score such as:

```text
GitHub = authority 9/10
MGBOS = authority 10/10
```

Authority depends on the question.

Example:

```text
"What code is currently in main?"
→ GitHub

"What invoice is outstanding?"
→ MGBOS

"What architecture should the repo follow?"
→ ACTIVE canonical docs
```

---

# 37. Source Authority Matrix

| Claim | Preferred Authority |
|---|---|
| Customer payment state | MGBOS |
| Provider-side payment state | Payment provider |
| Current order state | MGBOS |
| Current source revision | Git |
| Hosted CI result | CI provider |
| Intended architecture | Canonical docs |
| Physical receipt | Approved observation + MGBOS Goods Receipt |
| Founder approval | Authenticated approval record |
| Customer request | Customer communication/request |
| AI interpretation | Model derivation backed by evidence |

---

# 38. Source Discovery Is Not Source Authority

Finding a document through:

```text
search
vector database
memory retrieval
```

does not make the retrieval mechanism authoritative.

Canonical:

```text
RETRIEVAL
→ points to source

SOURCE
→ carries authority
```

---

# 39. Vector Search Is Not a Source of Truth

Vector index answers:

```text
"what seems semantically relevant?"
```

It does not answer:

```text
"what is authoritative?"
```

---

# 40. Cached Data Is Not New Authority

A cache preserves or accelerates access.

It does not create a competing source of truth.

Evidence must preserve:

```text
original source
freshness
observation time
```

---

# 41. Evidence Record

Canonical logical evidence record:

```yaml
evidence_id: uuid

source:
  type: MGBOS
  source_id: invoice:uuid
  reference: optional

claim_scope:
  organization_id: uuid

observed_at: timestamp
retrieved_at: timestamp

revision: optional

description: "Invoice balance is Rp5.000.000"

verification:
  status: VERIFIED

freshness:
  status: FRESH

data_classification: INTERNAL
```

Exact implementation may remain simpler initially.

---

# 42. Evidence ID

Every persisted evidence item SHOULD have stable identity:

```text
evidence_id
```

so claims can reference it.

---

# 43. Source ID

`source_id` identifies the authoritative or observed source entity.

Examples:

```text
invoice UUID
Git commit SHA
CI run ID
provider transaction ID
canonical document ID
```

---

# 44. Source Reference

Reference MAY contain a resolvable pointer such as:

```text
document path
API resource reference
tool result reference
run URL
```

It MUST NOT expose secrets.

---

# 45. `observed_at`

`observed_at` answers:

> When was the source state being represented actually observed/generated?

This is crucial for current-state claims.

---

# 46. `retrieved_at`

`retrieved_at` answers:

> When did JARVIS/system fetch this evidence?

These can differ.

---

# 47. `revision`

Revision should be used when evidence depends on versioned content.

Examples:

```text
Git SHA
document version
schema version
provider API version
model version
```

---

# 48. Organization Scope

Business evidence SHOULD preserve its organizational scope.

This prevents:

```text
TeeStock evidence
```

from silently supporting:

```text
another business context
```

---

# 49. Data Classification

Evidence SHOULD eventually carry data classification where relevant:

```text
PUBLIC
INTERNAL
CONFIDENTIAL
RESTRICTED
```

This governs:

```text
storage
model-provider eligibility
display
retention
```

Detailed classification belongs to Data Governance.

---

# 50. Verification Status

Canonical verification states:

```text
UNVERIFIED
VERIFIED
FAILED
CONFLICTED
```

---

# 51. UNVERIFIED

Evidence exists but no required verification has yet been completed.

It may still be useful.

It MUST NOT be presented as verified.

---

# 52. VERIFIED

Required checks passed.

Verification scope must be understood.

Example:

```text
verified:
GitHub CI run passed for commit ABC
```

does not mean:

```text
production deployment accepted
```

---

# 53. FAILED

Evidence or claimed result failed required verification.

Example:

```text
tool returned success
but postcondition missing
```

---

# 54. CONFLICTED

Two or more relevant sources materially disagree.

Example:

```text
Courier:
DELIVERED

MGBOS:
DISPATCHED
```

Correct behavior:

```text
CONFLICTED
→ reconcile
```

not silently choose whichever result is convenient.

---

# 55. Freshness Status

Canonical freshness states:

```text
FRESH
STALE
HISTORICAL
UNKNOWN
```

---

# 56. FRESH

Evidence falls inside the freshness requirement for the current use case.

---

# 57. STALE

Evidence was once valid but is too old for the current claim.

Example:

```text
inventory snapshot from yesterday
```

for:

```text
"Do we have stock right now?"
```

---

# 58. HISTORICAL

Evidence intentionally describes past state.

Historical evidence is not defective.

It simply MUST NOT be misrepresented as current state.

---

# 59. UNKNOWN Freshness

Timestamp/freshness rule is insufficient to determine whether evidence is current.

The system must disclose uncertainty.

---

# 60. Freshness Is Capability-Specific

No universal freshness window exists.

Examples:

```text
live inventory:
seconds/minutes

daily KPI:
hours/day

canonical architecture:
revision-based

historical invoice:
historical snapshot
```

---

# 61. Freshness Policy

Each important query capability SHOULD eventually define freshness expectations.

Example:

```yaml
capability: mgbos.inventory.availability.read
max_age: 60s
```

Exact configuration remains future implementation.

---

# 62. Stale Evidence Can Still Support Historical Claims

Example:

```text
"On 25 September, inventory was 500 units."
```

Older evidence may be perfectly valid if the claim itself is historical.

---

# 63. Verification Is Claim-Specific

A source can be verified without verifying every interpretation derived from it.

Example:

```text
VERIFIED FACT:
Vendor A delivery history = 5, 6, 8 days

INFERENCE:
Vendor A is likely to be late again
```

The inference remains reasoning, not verified fact.

---

# 64. Model Confidence Is Not Evidence Status

These concepts are separate:

```text
verification status
source authority
model confidence
```

A model can be:

```text
99% confident
```

about an unsupported inference.

That does not turn it into evidence-backed fact.

---

# 65. Confidence Applies to Inference

Where useful, confidence MAY accompany:

```text
classification
forecast
inference
recommendation
```

It SHOULD NOT replace source provenance.

---

# 66. Evidence Chain

A decision may rely on a chain:

```text
SOURCE
  ↓
OBSERVATION
  ↓
DERIVED FACT
  ↓
INFERENCE
  ↓
RECOMMENDATION
  ↓
DECISION
  ↓
ACTION
  ↓
VERIFICATION
```

Each step SHOULD preserve links to prior relevant evidence.

---

# 67. Provenance Graph

Conceptual model:

```text
MGBOS Order
     ↓
Evidence E1

Vendor Performance
     ↓
Evidence E2

Deadline
     ↓
Evidence E3

E1 + E2 + E3
     ↓
Inference I1
"Vendor A likely to miss deadline"
     ↓
Recommendation R1
"Switch to Vendor B"
     ↓
Approval A1
     ↓
Command C1
     ↓
Verification E4
```

This is the desired auditability chain.

---

# 68. Evidence Dependencies

Derived evidence SHOULD reference parent evidence IDs when practical.

Example:

```yaml
evidence_id: margin-analysis-1
derived_from:
  - quote-revenue-1
  - estimated-cost-1
```

---

# 69. Derived Evidence Must Not Hide Inputs

A summary such as:

```text
"Margin = 18%"
```

should remain traceable to:

```text
net revenue
estimated cost
calculation rule
```

---

# 70. Evidence Snapshot vs Live Reference

Evidence may store:

```text
reference only
```

or:

```text
sanitized snapshot
```

depending on need.

Do not copy entire authoritative databases into evidence storage.

---

# 71. Evidence Store Is Not a System of Record

JARVIS evidence storage exists for:

```text
traceability
decision support
runtime verification
```

It does NOT replace:

```text
MGBOS
Git
provider system
canonical docs
```

---

# 72. Evidence Storage Direction

JARVIS may later persist:

```text
evidence_id
request_id
source_type
source_reference
observed_at
verification status
freshness
```

without persisting unnecessary full source payload.

---

# 73. Data Minimization

Evidence SHOULD preserve enough information to support the claim while minimizing:

```text
PII
financial secrets
tokens
credentials
large raw payloads
```

---

# 74. Secrets Are Not Evidence Payloads

Never store as normal evidence:

```text
password
API key
service-role secret
OAuth token
webhook secret
raw bank credential
```

A record may indicate:

```text
credential verification succeeded
```

without retaining secret value.

---

# 75. Evidence Immutability

Persisted evidence supporting completed high-risk decisions SHOULD be append-oriented.

Do not rewrite historical evidence to make a later action appear better supported.

---

# 76. Superseded Evidence

Newer evidence does not erase old evidence.

Example:

```text
09:00 Inventory = 100
10:00 Inventory = 80
```

Both can be historically true.

Current claims use the freshest appropriate evidence.

---

# 77. Evidence Conflict

When relevant evidence conflicts:

```text
do not average truth
```

Determine:

```text
source ownership
freshness
verification
domain authority
```

and reconcile.

---

# 78. Authority Conflict Example

```text
Memory:
Invoice paid.

MGBOS:
Invoice partially paid.
```

Result:

```text
MGBOS wins for current invoice state.
```

Memory becomes stale contextual evidence.

---

# 79. External/Internal Conflict Example

```text
Payment Provider:
SUCCESS

MGBOS:
no payment recorded
```

Correct conclusion:

```text
provider-side transaction may have succeeded
internal reconciliation incomplete
```

not:

```text
invoice is definitely paid
```

---

# 80. Documentation/Implementation Conflict

```text
Canonical spec:
Capability exists.

Runtime:
tool not deployed.
```

Conclusion:

```text
intended architecture exists
runtime implementation is missing
```

Neither source should be misrepresented.

---

# 81. Verification Engine

JARVIS Verification Engine SHOULD check, as applicable:

```text
tool succeeded
schema valid
source authority appropriate
organization scope correct
timestamp available
freshness acceptable
required fields present
expected identity matches
conflict absent/resolved
postcondition valid
```

---

# 82. Verification Is Deterministic Where Possible

Known verification rules SHOULD be encoded deterministically.

Examples:

```text
invoice balance
tool schema
organization ID
revision match
timestamp age
command result
```

Do not ask an LLM to “feel” whether evidence seems valid.

---

# 83. AI-Assisted Verification

AI MAY assist with:

```text
document interpretation
semantic comparison
anomaly explanation
```

but deterministic authority checks remain system-owned.

---

# 84. Verification Before Recommendation

Material recommendation SHOULD verify critical input evidence before synthesis.

---

# 85. Verification Before Execution

High-risk execution requires precondition evidence.

Examples:

```text
current invoice balance
current vendor status
current stock availability
current deployment revision
```

---

# 86. Verification After Execution

Consequential execution SHOULD produce postcondition evidence.

Example:

```text
Command:
RecordPayment

Postcondition evidence:
payment exists
invoice balance updated
audit exists
```

---

# 87. Execution Receipt Is Evidence

A tool response may be evidence that:

```text
request was accepted
```

but not necessarily that:

```text
business outcome occurred
```

Postcondition determines that.

---

# 88. HTTP Success Is Weak Evidence

```text
HTTP 200
```

only proves what that API contract says it proves.

It MUST NOT automatically be generalized into:

```text
business success
```

---

# 89. Provider Acknowledgement

Provider acknowledgement can support:

```text
provider accepted action
```

Final business fact may still require:

```text
provider state lookup
MGBOS reconciliation
```

---

# 90. Evidence Requirements Scale With Risk

General trend:

```text
R0
minimal/no operational evidence

R1
source reference

R2
source + mutation result

R3
precondition + execution + verification

R4
multiple relevant evidence + approval +
verification + recovery awareness

R5
authoritative pre-state + approval +
command identity + execution +
independent postcondition + audit/reconciliation
```

---

# 91. R5 Evidence Example — Payment

Decision package might require:

```text
invoice ID
current balance
customer
amount
payment proof/provider evidence
approval
command ID
payment record
invoice post-state
audit record
```

---

# 92. Evidence for Approval

Approval Center consumes:

```text
PRE-EXECUTION EVIDENCE
```

It should not rely on post-execution claims.

---

# 93. Evidence After Approval

Approval itself becomes provenance for the resulting command.

```text
Decision
→ Command
```

---

# 94. Evidence After Action

Post-action evidence feeds:

```text
verification
audit
autonomy evaluation
incident investigation
```

---

# 95. Decision Package Provenance

Every significant Decision Package SHOULD preserve:

```text
facts
sources
inferences
recommendation
risk
assumptions
```

as distinct layers.

---

# 96. Fact vs Recommendation UI

Good:

```text
FACT
Vendor A is 2 days behind SLA.

INFERENCE
Current pace suggests deadline risk.

RECOMMENDATION
Move finishing to Vendor B.
```

Bad:

```text
Vendor B is obviously the correct choice.
```

with no source separation.

---

# 97. Assumptions in Decision Inbox

If a recommendation depends materially on assumptions, they SHOULD be visible.

Example:

```text
ASSUMPTION
Vendor B's capacity is still available.
```

Approval may require verification first.

---

# 98. Recommendation Provenance

A recommendation SHOULD link to:

```text
supporting evidence IDs
inference
risk
alternatives
```

where decision consequence warrants it.

---

# 99. Research Provenance

Research output SHOULD retain:

```text
source
publication/version date where available
retrieval date
scope
```

especially when decisions depend on time-sensitive information.

---

# 100. Research Is Not Runtime Fact

Example:

```text
industry report says average print lead time = X
```

cannot override:

```text
actual Vendor A lead time
```

stored in current business evidence.

---

# 101. Canonical Documentation Provenance

AI reading canonical documentation SHOULD retain:

```text
canonical_id
version
status
```

where practical.

Draft and archived docs MUST NOT silently support current normative claims.

---

# 102. Documentation Status Matters

Evidence from:

```text
ACTIVE
```

canonical specification has different authority from:

```text
DRAFT
ARCHIVED
SESSION NOTE
```

for architecture/policy claims.

---

# 103. Repository Evidence Must Bind to Revision

Engineering claim:

```text
"The fix passed tests."
```

requires:

```text
which revision?
which run?
which tests?
```

---

# 104. Stale Engineering Evidence

If code changes after the test:

```text
previous test result
```

may no longer support the new revision.

Evidence must be rebound/rerun as appropriate.

---

# 105. Deployment Evidence

Code merged to main does not prove:

```text
deployed
```

Deployment needs separate evidence.

---

# 106. Operational Acceptance

Deployment does not prove:

```text
operationally accepted
```

Operational readiness may require:

```text
health checks
monitoring
restore capability
business verification
```

---

# 107. Evidence State Progression

Engineering-style evidence progression MAY use:

```text
PLANNED
IMPLEMENTED
TESTS_DEFINED
LOCALLY_VERIFIED
HOSTED_CI_VERIFIED
DEPLOYED
OPERATIONALLY_ACCEPTED
```

One state does not imply the next.

---

# 108. `NOT_RUN` Is Not PASS

If verification was not executed:

```text
NOT_RUN
```

must remain visible.

Never convert lack of evidence into success.

---

# 109. `BLOCKED` Is Not PASS

Missing environment/tool/credential required for verification means:

```text
BLOCKED
```

not:

```text
VERIFIED
```

---

# 110. Partial Evidence

A task may have:

```text
some verified claims
some unresolved claims
```

Response SHOULD express partial confidence rather than collapse everything into success/failure.

---

# 111. Partial Failure

JARVIS can still produce useful output when one source fails.

Example:

```text
Finance data available
Inventory data unavailable
```

Correct briefing:

```text
Finance section verified.
Inventory section unavailable.
```

---

# 112. Missing Evidence

If required evidence is absent:

```text
MISSING_EVIDENCE
```

is a valid result.

Do not fabricate substitute facts.

---

# 113. Unknown State

If evidence cannot establish current truth:

```text
UNKNOWN
```

is an acceptable and often safest business conclusion.

---

# 114. Evidence Quality Does Not Require Multiple Sources Everywhere

One authoritative source may be sufficient.

Example:

```text
MGBOS invoice balance
```

does not require three independent sources just to look rigorous.

---

# 115. Multiple Sources Are Useful When

Use corroboration when:

```text
authority is distributed
external reconciliation is needed
source reliability is uncertain
high-risk action requires independent confirmation
```

---

# 116. Independent Verification

For high-risk outcomes, verification SHOULD preferably come from a source independent of the execution request when practical.

Example:

```text
send command
↓
re-read resulting authoritative state
```

rather than only trusting:

```text
command says success
```

---

# 117. Evidence Duplication

Do not create many evidence objects for the same identical observation merely to inflate apparent support.

Quality matters more than count.

---

# 118. Evidence Aggregation

A summary evidence object MAY aggregate lower-level sources.

It MUST preserve links to underlying evidence.

---

# 119. Evidence Normalization

Tool adapters SHOULD normalize common provenance fields.

Example:

```text
sourceType
sourceId
observedAt
revision
```

while preserving provider-specific details where necessary.

---

# 120. Provider-Neutral Evidence

JARVIS core SHOULD not require each provider's raw response shape.

Adapters translate into normalized evidence contracts.

---

# 121. Preserve Provider Reference

Normalization should not destroy original reference needed for investigation.

Example:

```text
provider transaction ID
GitHub run ID
courier tracking number
```

---

# 122. Evidence and Tool Results

Tool result contract SHOULD conceptually return:

```text
data
+
evidence
+
verification metadata
```

not data alone.

---

# 123. Evidence and Query Capabilities

Read capabilities SHOULD naturally produce evidence representing:

```text
source
observation
timestamp
scope
```

This enables evidence-first JARVIS without requiring extra work at synthesis time.

---

# 124. Evidence and Commands

Mutation commands SHOULD produce:

```text
execution identity
result
audit reference
postcondition evidence
```

proportional to risk.

---

# 125. Evidence and Events

Business Event can itself be historical evidence that:

```text
a fact occurred
```

but consumers needing current state SHOULD re-read authoritative state.

---

# 126. Event Provenance

Events SHOULD preserve:

```text
event ID
aggregate
occurred_at
correlation
causation
actor
```

This connects event history to evidence chains.

---

# 127. Evidence and Audit

Audit supports:

```text
who/why/how
```

Evidence supports:

```text
what supports this claim/decision
```

An audit record can be used as evidence, but the concepts remain distinct.

---

# 128. Evidence and Observability

Observability provides:

```text
logs
traces
metrics
```

These can become evidence during:

```text
verification
incident investigation
```

Observability itself is not business truth.

---

# 129. Trace ID

Runtime requests SHOULD eventually carry:

```text
trace_id
```

or equivalent.

This connects:

```text
request
planner
tool calls
evidence
verification
response
```

---

# 130. Correlation ID

Business workflow correlation connects:

```text
decision
command
event
integration
```

Evidence may preserve correlation to reconstruct the complete business chain.

---

# 131. Evidence vs Chain of Thought

JARVIS SHOULD NOT persist hidden chain-of-thought.

Persist:

```text
plan summary
decision rationale
tool calls
evidence
verification
final reasoning summary
```

This is sufficient for accountability.

---

# 132. Reasoning Summary

Reasoning summary SHOULD explain:

```text
which facts mattered
which inference was made
why recommendation followed
what uncertainty remains
```

without needing private internal reasoning traces.

---

# 133. Evidence Memory

JARVIS may maintain Evidence Memory containing references to prior verified evidence.

Evidence Memory MUST preserve:

```text
original source reference
observation time
verification status
```

---

# 134. Evidence Memory Is Not Freshness Exemption

Stored verified evidence can become stale.

Verification status:

```text
VERIFIED
```

does not imply:

```text
still FRESH
```

---

# 135. Semantic Memory Provenance

Semantic memory SHOULD ideally be derived from known sources.

Example:

```text
"TeeStock uses X policy."
```

should point to:

```text
canonical document
```

rather than exist as unsupported free-floating memory.

---

# 136. Preference Memory Provenance

Preference memory may originate from:

```text
explicit human statement
repeated approved edits
```

but inferred preference SHOULD remain distinguishable from explicit preference.

---

# 137. Inferred Preference

Example:

```text
Observed:
Rizky edited 8 reports to be shorter.

Inference:
Rizky may prefer shorter reports.
```

Do not rewrite inference as:

```text
Rizky explicitly requires reports under 200 words.
```

---

# 138. Memory Conflict

When memory conflicts with:

```text
current explicit instruction
current canonical policy
authoritative business data
```

the higher appropriate authority wins.

---

# 139. Assumption Lifecycle

Assumption SHOULD ideally move:

```text
ASSUMED
   ↓
VERIFIED
or
REJECTED
```

when evidence becomes available.

---

# 140. Unverified Assumption and High-Risk Action

R4/R5 action SHOULD NOT depend on a material unverified assumption unless policy explicitly permits it and human decision acknowledges the uncertainty.

---

# 141. Provenance Loss

If source origin is lost:

```text
provenance quality degrades
```

A floating statement like:

```text
"I remember margin was 22%."
```

should not be treated as high-confidence current fact.

---

# 142. Source Mutation

If source itself changes:

```text
document version
Git commit
MGBOS state
```

old evidence remains tied to the version/state observed.

---

# 143. Evidence Integrity

High-value persisted evidence MAY later use:

```text
content hash
signed receipt
immutable storage
```

if real audit requirements justify it.

Do not build cryptographic evidence infrastructure prematurely.

---

# 144. Evidence Retention

Retention should depend on:

```text
business need
risk
audit value
privacy
legal requirement
cost
```

Detailed retention periods belong to Data Governance.

---

# 145. High-Risk Evidence Retention

R4/R5 decision/execution evidence SHOULD generally receive stronger retention than routine R0 reasoning output.

---

# 146. Privacy and Evidence

Evidence collection SHOULD follow:

```text
minimum necessary data
```

Do not preserve entire customer records when:

```text
invoice ID + amount + verified source reference
```

is sufficient.

---

# 147. Evidence Redaction

Human-facing evidence may redact:

```text
secret
unnecessary PII
internal security detail
```

while retaining enough source reference for authorized investigation.

---

# 148. Evidence Access Control

Evidence can itself contain sensitive information.

Access SHOULD follow:

```text
organization
role/capability
data classification
purpose
```

---

# 149. Cross-Business Provenance

Evidence from one business MUST preserve business scope.

It MUST NOT silently enter another business's Decision Package.

---

# 150. Holding-Level Evidence

Holding-level JARVIS may legitimately aggregate:

```text
MultiGraph
TeeStock
other businesses
```

only with explicit cross-business authorization.

---

# 151. Evidence for Founder Briefing

Morning Briefing SHOULD make each material finding traceable.

Example:

```text
3 invoices overdue
Evidence:
MGBOS finance projection
generated 09:57
```

---

# 152. Briefing Claim Rule

JARVIS synthesis MUST NOT add factual operational claims that have no supporting evidence.

---

# 153. Recommendation Without Evidence

For creative brainstorming, evidence may not be necessary.

For operational recommendation:

```text
evidence normally required
```

The system should know which mode it is in.

---

# 154. Evidence Requirement by Output Type

```text
creative idea
→ evidence optional

architecture claim
→ canonical/repository evidence

business current-state claim
→ authoritative runtime evidence

recommendation
→ supporting evidence proportional to risk

high-risk decision
→ verified evidence required
```

---

# 155. Facts vs Forecasts

Forecast:

```text
future sales may increase 20%
```

is not current fact.

Forecast SHOULD preserve:

```text
inputs
method/model
assumptions
date
uncertainty
```

---

# 156. Scenario vs Forecast

Scenario:

```text
"If conversion rises to 5%, revenue becomes..."
```

is conditional analysis.

Do not present scenario as prediction.

---

# 157. Evidence and Financial Analytics

Financial claim SHOULD preserve distinctions between:

```text
revenue
cash
cost
shipping pass-through
estimated
committed
actual
```

Provenance must point to the correct underlying economic facts.

---

# 158. Evidence and Physical Reality

Physical facts require trusted observation.

Examples:

```text
goods received
QC passed
package dispatched
```

Evidence may come from:

```text
operator confirmation
scanner
provider acknowledgement
photo
machine
```

according to process policy.

---

# 159. Photo Evidence

A photo can support an observation.

It does not necessarily prove:

```text
time
location
quantity
identity
```

unless those semantics are established.

---

# 160. Evidence and AI Vision

AI interpreting a photo produces:

```text
MODEL_DERIVATION
```

from:

```text
IMAGE OBSERVATION
```

Keep the layers separate.

---

# 161. Evidence for Security Actions

Security-critical evidence may include:

```text
target environment
principal
permission state
change set
post-change access verification
```

Sensitive secrets themselves should remain redacted.

---

# 162. Evidence for Production Deployment

Strong deployment evidence may include:

```text
revision
CI run
target environment
deployment result
health checks
rollback/recovery readiness
```

---

# 163. Evidence for Recovery

A written recovery procedure is:

```text
plan evidence
```

A successful restore drill is:

```text
execution evidence
```

These are different.

---

# 164. Evidence and Readiness

Claim:

```text
"Backups work."
```

requires more than:

```text
"backup config exists."
```

Strong evidence includes:

```text
restore test
```

---

# 165. Evidence and Implementation Claims

Claim:

```text
"Feature implemented."
```

should point to:

```text
code/revision
```

Claim:

```text
"Feature verified."
```

also requires:

```text
executed test evidence
```

---

# 166. Evidence and Production Claims

Claim:

```text
"Feature is live."
```

requires:

```text
deployment evidence
```

not just merged source.

---

# 167. Evidence and Operational Claims

Claim:

```text
"System is production-ready."
```

requires appropriate operational evidence.

Architecture documents alone are insufficient.

---

# 168. Evidence Conflict Resolution

When evidence conflicts:

```text
1. Identify claim domain

2. Identify authoritative owner

3. Compare observation times

4. Compare revisions

5. Check verification status

6. Identify whether facts describe
   different layers rather than true contradiction

7. Reconcile

8. Preserve conflict if unresolved
```

---

# 169. Different Layers May Both Be True

Example:

```text
Provider:
payment succeeded

MGBOS:
payment not reconciled
```

Both may be true simultaneously.

Avoid false conflict by understanding system boundaries.

---

# 170. Evidence Cannot Override Policy

Strong evidence that an action would work does not mean it is permitted.

Example:

```text
technical proof shows direct SQL can fix payment
```

does not override:

```text
direct production SQL prohibited
```

---

# 171. Evidence Cannot Override Risk

Evidence may justify autonomy promotion.

It does not lower intrinsic risk class.

---

# 172. Evidence and Autonomy

Autonomy promotion SHOULD rely on evidence such as:

```text
successful cases
human approval rate
verification pass rate
incident history
```

Evidence supports governance.

It does not automatically make the promotion decision.

---

# 173. Evidence and Approval

Approval should consume evidence.

Approval then becomes additional evidence in the execution chain.

---

# 174. Evidence and Kill Switch

If evidence quality/verification degrades:

```text
autonomous capability may be suspended
```

This is a legitimate operational response.

---

# 175. Evidence and Tool Health

Tool status may be informed by:

```text
success rate
latency
verification failures
provider incidents
```

A degraded tool may no longer supply trustworthy execution evidence.

---

# 176. Evidence and Model Evaluation

AI eval result should preserve:

```text
model/provider/version
case
criteria
observed behavior
forbidden behavior checks
result
```

Do not evaluate models only from final prose.

---

# 177. Factuality Evaluation

AI factuality tests SHOULD verify whether claims are supported by supplied evidence.

This is especially important for JARVIS synthesis.

---

# 178. Hallucinated Evidence Is Critical Failure

The system MUST NOT fabricate:

```text
source ID
citation
transaction ID
test run
provider result
approval
```

Fabricated evidence is worse than admitting evidence is unavailable.

---

# 179. Evidence Reference Validation

Where practical, evidence references SHOULD be validated as:

```text
existing
accessible
matching claimed source
```

before presentation.

---

# 180. Evidence Availability Failure

If the original evidence source becomes unavailable:

```text
historical evidence reference may remain
```

but system should indicate source availability limitations.

---

# 181. Evidence Portability

Provider-specific evidence SHOULD be normalized sufficiently that JARVIS reasoning does not depend entirely on one vendor format.

---

# 182. Evidence Contract — Target

Logical target:

```ts
type Evidence = {
  id: string

  sourceType:
    | "mgbos"
    | "github"
    | "canonical_document"
    | "external_provider"
    | "human"
    | "tool"
    | "research"
    | "memory"
    | "derived"

  sourceId: string
  reference?: string

  organizationId?: string

  observedAt: string
  retrievedAt?: string

  revision?: string

  description: string

  verificationStatus:
    | "UNVERIFIED"
    | "VERIFIED"
    | "FAILED"
    | "CONFLICTED"

  freshnessStatus:
    | "FRESH"
    | "STALE"
    | "HISTORICAL"
    | "UNKNOWN"

  derivedFrom?: string[]
}
```

This is semantic direction.

Exact implementation may evolve.

---

# 183. JARVIS v0.2 Compatibility

Existing v0.2 Evidence contract:

```text
id
sourceType
sourceId
observedAt
description
revision
reference
```

remains a valid minimal starting point.

This v1 governance model extends its semantics.

It does NOT require immediate implementation of every field.

---

# 184. Minimum JARVIS v0.2 Evidence

For the first Morning Briefing, minimum evidence MAY remain:

```text
id
sourceType
sourceId/reference
observedAt
description
```

plus deterministic freshness/verification state in runtime.

---

# 185. Do Not Overbuild Evidence Infrastructure Yet

Initial JARVIS does NOT require:

```text
graph database
blockchain audit
cryptographic evidence chain
complex provenance engine
enterprise data catalog
```

A relational/logical evidence store is sufficient.

---

# 186. First Implementation Priority

For JARVIS v0.2:

```text
1. Normalize source reference

2. Capture observed timestamp

3. Verify scope

4. Apply freshness

5. Attach evidence IDs to findings

6. Prevent unsupported factual synthesis

7. Persist execution/evidence records
```

---

# 187. Future Provenance Graph

A provenance graph may become valuable when:

```text
agents multiply
automation chains grow
cross-business reasoning grows
regulatory/audit demand increases
```

Do not implement it before need.

---

# 188. Evidence Status Is Not Stored Truth Status

Evidence record may be:

```text
VERIFIED
```

while the source fact later changes.

Example:

```text
09:00 stock = 100
```

was verified.

At 12:00 stock may be 50.

Historical verification remains valid.

Freshness determines current usability.

---

# 189. Evidence Quality Dimensions

Evidence quality can be assessed through:

```text
source authority
verification
freshness
completeness
scope correctness
revision correctness
```

Avoid reducing all quality into one opaque score.

---

# 190. Evidence Strength Should Be Explainable

Instead of:

```text
Evidence Score = 93
```

prefer:

```text
Authoritative source
Verified
Fresh
Correct organization
No conflict
```

---

# 191. Unsupported Factual Claim

If JARVIS lacks evidence, response SHOULD use language like:

```text
"I don't have verified current data for that."
```

or:

```text
"This is an inference, not a confirmed fact."
```

depending on context.

---

# 192. Evidence and Uncertainty

Uncertainty is information.

It should not be hidden merely to make output sound decisive.

---

# 193. Decision Confidence

Decision quality can still be high even when some uncertainty exists, provided:

```text
uncertainty is explicit
impact is understood
risk policy permits action
```

---

# 194. Canonical Evidence Chain Example — Payment

```text
Payment Provider Observation
        │
        ▼
External Evidence E1
        │
        ▼
ReconcilePayment Command
        │
        ▼
MGBOS Payment Record
        │
        ├── Audit
        └── Ledger
        │
        ▼
Authoritative Evidence E2
        │
        ▼
Invoice Re-read Evidence E3
        │
        ▼
Verified Claim
"Invoice balance = Rp0"
```

---

# 195. Canonical Evidence Chain Example — Vendor Decision

```text
Production Job
→ E1

Deadline
→ E2

Vendor A SLA
→ E3

Vendor B Capacity
→ E4

        ↓

Inference:
Vendor A likely late

        ↓

Recommendation:
Move job to Vendor B

        ↓

Approval

        ↓

Assignment Command

        ↓

Postcondition Evidence
```

---

# 196. Canonical Evidence Chain Example — Engineering

```text
Git Revision
   ↓
Implementation

Git SHA
   ↓
CI Run

CI Evidence
   ↓
Review

Approval
   ↓
Deploy

Deployment Evidence
   ↓
Health Verification
```

---

# 197. Canonical Evidence Chain Example — Physical Receipt

```text
Vendor delivery
      ↓
Operator / scanner observation
      ↓
Goods Receipt Command
      ↓
MGBOS Goods Receipt
      ↓
Inventory Mutation
      ↓
Verified inventory state
```

---

# 198. Evidence Review Checklist

Before using evidence for material claim:

```text
What is the source?

What domain does it own?

What exactly was observed?

When?

Which revision?

Which organization?

Is it verified?

Is it fresh enough?

Does another source conflict?

Is this fact or inference?

Does the claim exceed what the evidence proves?
```

---

# 199. JARVIS Synthesis Rule

Before producing a factual sentence, JARVIS SHOULD be able to answer:

```text
Which evidence supports this?
```

If none exists:

```text
do not present it as operational fact.
```

---

# 200. Decision Rule

Before a high-impact recommendation, JARVIS SHOULD be able to answer:

```text
Which facts support this?

Which are inferred?

Which are assumed?

Which evidence is stale?

What uncertainty could change the decision?
```

---

# 201. Architectural Invariants

1. Evidence and provenance are distinct but linked.
2. Authority is claim-specific.
3. No source is universally authoritative.
4. MGBOS owns MGBOS business truth.
5. Canonical docs own intended architecture/policy.
6. Git owns repository revision truth.
7. External providers own only their provider-side facts.
8. Memory is context, not current transactional truth.
9. Retrieval mechanism is not source authority.
10. Vector similarity does not establish truth.
11. Facts, inference, recommendations, and assumptions remain distinguishable.
12. Material factual claims require traceable evidence.
13. Evidence may be verified yet stale.
14. Historical evidence is not invalid merely because it is old.
15. Missing evidence is not PASS.
16. Blocked verification is not PASS.
17. Conflicting evidence remains visible until reconciled.
18. Execution success requires appropriate postcondition evidence.
19. Tool response alone may be insufficient evidence of outcome.
20. Higher risk requires stronger evidence.
21. Approval consumes evidence and becomes evidence itself.
22. Evidence does not override permission, risk, or policy.
23. Evidence stores do not replace systems of record.
24. Sensitive evidence follows data minimization.
25. Unsupported evidence must never be fabricated.

---

# 202. Relationship to Other Governance

```text
SOURCE
   ↓
EVIDENCE & PROVENANCE
   ↓
CLAIM
   ↓
RISK
   ↓
RECOMMENDATION
   ↓
APPROVAL
   ↓
COMMAND
   ↓
EXECUTION
   ↓
VERIFICATION
   ↓
NEW EVIDENCE
```

This closes the trust loop.

---

# 203. Canonicalization Effect

Before this document, evidence semantics were distributed across:

```text
JARVIS Architecture v0.1
JARVIS v0.2
Governance Blueprint
MGBOS Engineering Evidence Model
MGBOS audits
Operational Readiness
```

After activation:

```text
docs.governance.evidence-provenance-model
```

becomes the ecosystem-level semantic owner.

Engineering evidence model remains authoritative for the more detailed evidence requirements of software-change/release work.

---

# 204. North Star

A future JARVIS response should be able to say:

```text
FACT
3 invoices are overdue.

SOURCE
MGBOS finance projection.

OBSERVED
09:57.

FRESHNESS
Fresh.

INFERENCE
Cash collection risk increased.

RECOMMENDATION
Follow up INV-102 first because it is
the largest overdue balance.

EVIDENCE
INV-102 balance
customer payment history
due date
```

rather than:

```text
"Looks like cashflow may be bad."
```

without traceability.

---

# 205. Final Principle

> **JARVIS should never merely sound informed.  
> It should know what it knows, know where it came from, know what is inferred, and know when the evidence is no longer good enough.**

That distinction is what turns AI output from:

```text
plausible language
```

into:

```text
operational intelligence
```