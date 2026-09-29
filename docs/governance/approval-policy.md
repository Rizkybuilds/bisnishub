---
canonical_id: docs.governance.approval-policy
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: ecosystem
document_class: governance
effective_from: 2026-09-29
authoritative_for:
  - cross-system approval semantics
  - approval lifecycle
  - approver eligibility
  - action-specific approval
  - approval scope binding
  - approval expiry and invalidation
  - re-approval requirements
  - founder approval and override semantics
  - separation-of-duties expectations
  - decision inbox approval contract
  - standing policy approval
  - delegated execution approval evidence
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - documentation-constitution.md
  - canonical-source-map.md
  - cross-system-risk-classification.md
  - autonomy-levels.md
  - ../architecture/master-system-blueprint.md
  - ../architecture/system-boundaries.md
  - ../architecture/architectural-laws.md
  - ../../mgbos/docs/architecture/permission-authorization-model.md
  - ../../mgbos/docs/architecture/command-event-model.md
  - ../../mgbos/docs/architecture/business-invariants.md
supersedes: null
---

# Cross-System Approval Policy v1.0

## 1. Purpose

Dokumen ini mendefinisikan bagaimana approval bekerja di seluruh ekosistem BisnisHub.

Approval menjawab:

> **Siapa harus menyetujui action tertentu sebelum action tersebut boleh dieksekusi?**

Ia berlaku untuk:

```text
MGBOS commands
JARVIS actions
runtime agents
automation
n8n workflows
engineering operations
production releases
external communication
financial operations
security operations
future systems
```

---

# 2. Core Principle

> **Approval authorizes a specific decision. It does not create unlimited authority.**

Approval:

```text
may authorize
one bounded action
```

Approval MUST NOT silently become:

```text
permanent permission
global delegation
business-rule bypass
security bypass
future-action approval
```

---

# 3. Approval Position in the Control Chain

Canonical execution order:

```text
IDENTITY
   ↓
PERMISSION
   ↓
RISK
   ↓
AUTONOMY
   ↓
APPROVAL REQUIREMENT
   ↓
APPROVAL EVIDENCE
   ↓
COMMAND
   ↓
BUSINESS VALIDATION
   ↓
EXECUTION
   ↓
VERIFICATION
   ↓
EVIDENCE
```

Each layer has a distinct responsibility.

---

# 4. Approval Is Not Permission

Permission answers:

> May this principal attempt this capability?

Approval answers:

> May this specific instance proceed?

Example:

```text
SALES
has:
mgbos.quote.send
```

but:

```text
margin < hard floor
```

may require:

```text
OWNER approval
```

Sales permission remains unchanged.

---

# 5. Approval Is Not Risk

Risk:

```text
R0–R5
```

measures consequence.

Approval is a control applied based on:

```text
risk
autonomy
business policy
context
scope
```

---

# 6. Approval Is Not Business Validation

Approved action may still fail.

Example:

```text
Rizky approves payment recording
```

but:

```text
allocation > invoice balance
```

means:

```text
MGBOS rejects command
```

Correct.

Approval cannot make invalid business state valid.

---

# 7. Approval Is Not Authentication

An approval record must come from an authenticated, authorized approver.

A string saying:

```text
"Rizky approved"
```

is not sufficient evidence by itself.

---

# 8. Approval Is Not Execution

Approval expresses authorization to proceed.

Execution remains a separate event.

Canonical:

```text
PROPOSAL
   ↓
APPROVAL
   ↓
EXECUTION
   ↓
VERIFICATION
```

This separation is essential for auditability.

---

# 9. Approval Is Not Success

Even after approval:

```text
execution may fail
```

or result may become:

```text
UNKNOWN
NEEDS_RECONCILIATION
```

Approval does not imply successful outcome.

---

# 10. Approval Types

Cross-system governance recognizes four primary approval forms:

```text
ACTION APPROVAL
POLICY APPROVAL
EXCEPTION APPROVAL
EMERGENCY APPROVAL
```

---

# 11. Action Approval

Action Approval authorizes one specific execution.

Example:

```text
Send this quotation
to Customer A
version 3
for Rp18.500.000
```

This is the default model for:

```text
L3 execution
```

---

# 12. Policy Approval

Policy Approval authorizes a bounded class of future actions.

This enables:

```text
L4 autonomy
```

Example:

```text
Allow TeeStock routine follow-up messages

only if:
template approved
existing customer
09:00–17:00
max 1 reminder / 48 hours
no legal/financial dispute
```

The human approves the policy.

Individual actions execute automatically only inside that policy.

---

# 13. Exception Approval

Exception Approval authorizes a specific deviation from normal policy.

Example:

```text
quote margin = 18%

normal floor = 20%

OWNER approves exception
with reason
```

Exception does not change the normal policy.

---

# 14. Emergency Approval

Emergency Approval may allow faster decision flow during:

```text
security incident
production outage
data recovery
business continuity event
```

Emergency approval MUST still preserve:

```text
actor identity
reason
scope
evidence
post-action review
```

Emergency does not mean ungoverned.

---

# 15. Approval Lifecycle

Canonical lifecycle:

```text
PROPOSED
   ↓
AWAITING_APPROVAL
   ├── APPROVED
   ├── REJECTED
   ├── EDIT_REQUESTED
   ├── DEFERRED
   └── EXPIRED
```

After approval:

```text
APPROVED
   ↓
PENDING_EXECUTION
   ↓
EXECUTED
```

or:

```text
APPROVED
   ↓
INVALIDATED
```

if material context changes.

---

# 16. `PROPOSED`

The system has created a candidate action.

It is not yet ready for human decision if required evidence/context is incomplete.

---

# 17. `AWAITING_APPROVAL`

The proposal contains enough information for an eligible approver to decide.

At minimum, approver should understand:

```text
what
why
impact
risk
scope
evidence
```

---

# 18. `APPROVED`

The specific action or policy has received valid approval.

Approval does not execute automatically unless orchestration is configured to proceed.

---

# 19. `REJECTED`

Approver explicitly declines the proposal.

Rejected action MUST NOT be executed using that approval request.

---

# 20. `EDIT_REQUESTED`

Approver wants material modification.

Example:

```text
change amount
change wording
change vendor
change date
```

The original approval request is no longer directly executable.

A revised proposal must be generated.

---

# 21. `DEFERRED`

Approver intentionally postpones decision.

Deferred is not:

```text
approved
rejected
expired
```

The action remains pending until policy decides otherwise.

---

# 22. `EXPIRED`

Approval window ended before valid execution.

Expired approval MUST NOT be reused.

---

# 23. `INVALIDATED`

Approval was valid but a material condition changed before execution.

Examples:

```text
amount changed
recipient changed
risk increased
resource state changed
vendor suspended
tool changed materially
policy changed
```

Execution requires reassessment.

---

# 24. Approval Request Identity

Every material approval request SHOULD have stable identity.

Example:

```yaml
approval_request_id: uuid
```

This allows:

```text
audit
deduplication
status tracking
execution binding
```

---

# 25. Approval Decision Identity

The decision itself SHOULD have:

```yaml
approval_decision_id: uuid
```

separate from the request.

This distinguishes:

```text
proposal
```

from:

```text
human decision
```

---

# 26. Approval Must Bind to an Action Fingerprint

For consequential actions, approval SHOULD bind to material execution parameters.

Conceptually:

```text
ACTION FINGERPRINT
=
capability
+
target
+
material parameters
+
scope
+
environment
+
risk context
```

---

# 27. Example Action Fingerprint — Payment

```text
capability:
mgbos.payment.record

invoice:
INV-001

amount:
Rp10.000.000

payment_date:
2026-09-29

organization:
MultiGraph

environment:
PRODUCTION
```

Changing:

```text
Rp10 juta → Rp100 juta
```

MUST invalidate the original approval.

---

# 28. Example Action Fingerprint — Communication

Approval:

```text
recipient:
Customer A

message:
"Pesanan siap dikirim."
```

must not authorize:

```text
recipient:
all customers
```

or materially different content.

---

# 29. Material Parameters

Parameters considered material SHOULD include, where relevant:

```text
amount
recipient
resource ID
vendor
quantity
price
discount
target environment
scope
message content
deployment revision
permission being granted
data classification
```

---

# 30. Non-Material Parameters

Minor technical values may not require re-approval if they do not change business intent.

Example:

```text
internal correlation ID
transport retry ID
logging metadata
```

---

# 31. Approval Invalidation Rule

Approval MUST be reconsidered if:

```text
material intent changed
risk increased
resource changed materially
approval expired
approver lost authority
policy changed
environment changed
```

---

# 32. State Freshness

Approval does not freeze business reality.

Before execution the system MUST revalidate relevant current state.

Example:

```text
approved:
reserve 50 units
```

but now:

```text
available inventory = 20
```

The old approval does not bypass the stock invariant.

---

# 33. Risk Reassessment Before Execution

Effective risk SHOULD be recalculated before consequential execution.

If:

```text
approved at R3
```

but runtime context makes it:

```text
R4
```

the approval MUST satisfy R4 policy.

Otherwise:

```text
RE-APPROVAL REQUIRED
```

---

# 34. Approval Expiry

Approval validity MUST be bounded when stale execution could create material risk.

Approval policy MAY use:

```text
expires_at
```

or:

```text
valid_until
```

---

# 35. No Universal Expiry Duration

This constitution does NOT define one universal:

```text
15-minute
1-hour
24-hour
```

expiry.

Expiry depends on:

```text
risk
state volatility
financial exposure
business process
environment
```

---

# 36. High-Risk Approval Expiry

R4/R5 action approvals SHOULD normally include explicit validity bounds.

Highly dynamic state may require short validity.

Stable administrative decision may permit longer validity.

---

# 37. Approval Consumption

Action-specific approval SHOULD normally be:

```text
single-use
```

Once executed successfully, it cannot authorize the same action again.

---

# 38. Retry After Approved Execution

Technical retries SHOULD reuse the same logical command/idempotency identity.

They should not require another approval when:

```text
same business intent
same action fingerprint
same approval
same idempotent operation
```

---

# 39. Retry After Unknown Outcome

If execution outcome is unknown:

```text
do not create new approval
and blindly execute again
```

First:

```text
RECONCILE
```

whether the original action happened.

---

# 40. Approval Replay Protection

An approval token/record MUST NOT be reusable for another materially different action.

This is especially important for:

```text
payments
refunds
permission grants
deployments
bulk communication
```

---

# 41. Approver Eligibility

Valid approver must satisfy:

```text
authenticated identity
+
active authority
+
correct organization/scope
+
required approval capability
```

---

# 42. Approver Eligibility Is Evaluated at Decision Time

Being eligible yesterday does not mean eligibility today.

Example:

```text
user suspended
```

means future approval attempts fail.

Historical approvals remain attributable.

---

# 43. Approval Capability

Future capability architecture SHOULD represent approval authority explicitly.

Examples:

```text
mgbos.quote.price_override.approve

mgbos.payment.record.approve

production.release.approve

security.privileged_access.approve
```

Exact registry remains future implementation.

---

# 44. OWNER Authority

Current solo-founder environment places Rizky as ultimate accountable business authority.

OWNER may approve broad classes of business actions.

OWNER still cannot approve violation of hard invariants.

---

# 45. Founder Authority Is Not Technical Root

Founder approval does not mean:

```text
database superuser execution
```

or:

```text
bypass security infrastructure
```

Approval remains business authority.

Execution remains through controlled capabilities.

---

# 46. Founder Override

A Founder Override may authorize an exceptional business decision that policy would normally reject but architecture explicitly supports as overridable.

Example:

```text
below-floor pricing
```

if MGBOS exposes:

```text
pricing override capability
```

---

# 47. Founder Override Cannot Override Non-Overridable Invariants

Examples:

```text
negative invoice balance
cross-organization data leakage
invalid financial arithmetic
corrupt UUID relationship
confirmed payment history deletion
```

cannot become valid merely because Founder approves.

---

# 48. Explicit Override Capability

If an invariant/policy supports exception, the exception SHOULD have an explicit capability.

Correct:

```text
mgbos.quote.price_override
```

Not:

```text
force=true
```

on every command.

---

# 49. Override Reason

Exceptional approval SHOULD require a reason proportional to consequence.

Current quote pricing approval already follows this principle.

---

# 50. Separation of Duties

For sufficiently sensitive actions, the person preparing/requesting an action SHOULD differ from the person approving it.

Concept:

```text
PREPARE
≠
APPROVE
```

where organizational maturity supports it.

---

# 51. Solo-Founder Exception

Current reality may require Rizky to:

```text
prepare
approve
execute
```

or hold overlapping roles.

That is acceptable during solo-founder stage.

The architecture MUST nevertheless preserve the distinction so responsibilities can separate later.

---

# 52. Self-Approval

Self-approval MAY be allowed when:

```text
organizational structure requires it
policy explicitly permits it
```

It MUST NOT be assumed universally.

---

# 53. Future Separation-of-Duties Examples

Potential future requirements:

```text
finance staff prepares payment
OWNER approves

procurement prepares high-value PO
finance/owner approves

engineer prepares production release
release operator/owner approves
```

Exact rules belong to domain policy.

---

# 54. Approval by Agent Is Not Human Approval

An AI agent recommending:

```text
APPROVE
```

does not satisfy a policy requiring accountable human approval.

AI may act as:

```text
reviewer
critic
second opinion
```

but human-required approval remains human.

---

# 55. Independent AI Review

High-risk decisions MAY use:

```text
primary reasoning model
+
independent critic/reviewer
```

before human approval.

This strengthens evidence.

It does not replace the human gate where required.

---

# 56. Approval vs Review

Review asks:

> Is this good/correct?

Approval asks:

> May this proceed?

A reviewer may identify issues without having execution authority.

---

# 57. Approval vs Confirmation

Simple confirmation:

```text
"yes"
```

may be sufficient only when the system clearly binds that decision to a specific approval request.

Ambiguous conversational confirmation MUST NOT authorize unrelated high-risk actions.

---

# 58. Conversational Approval

JARVIS may receive:

```text
"approve"
"ACC"
"gas"
"lanjut"
```

but approval is valid only if the conversation context unambiguously identifies:

```text
which action
which parameters
which risk
```

For high-risk actions, explicit structured confirmation is preferred.

---

# 59. Ambiguous Approval

If multiple requests are pending:

```text
"approve"
```

is insufficient.

System must resolve the target before execution.

---

# 60. Decision Inbox

The canonical human approval interface is conceptually:

```text
DECISION INBOX
```

It may later exist inside:

```text
JARVIS Command Center
MGBOS UI
mobile interface
chat
```

The surface can change.

The approval semantics do not.

---

# 61. Decision Inbox Goal

Decision Inbox exists to compress complexity into:

```text
small number
of high-quality
evidence-backed decisions
```

It MUST NOT simply display every automation action to the founder.

---

# 62. Decision Inbox Entry

A strong entry SHOULD show:

```text
What happened?
What is proposed?
Why?
What is the impact?
What is the risk?
What is the evidence?
What will happen if approved?
What happens if rejected?
How reversible is it?
When does approval expire?
```

---

# 63. Minimum Decision Card

Conceptually:

```text
ACTION
Assign Production Job PJ-219 → Vendor B

WHY
Vendor A is 2 days behind SLA.

RISK
R3

IMPACT
Estimated +Rp150k cost
1-day schedule recovery

EVIDENCE
Vendor A current job
Vendor B capacity
Deadline
Rate card

PROPOSED EXECUTION
mgbos.production.assign

[ APPROVE ]
[ EDIT ]
[ REJECT ]
[ DEFER ]
```

---

# 64. High-Risk Decision Card

For R4/R5, card SHOULD additionally expose:

```text
current authoritative state
amount/value
verification method
rollback/reconciliation path
approval expiry
accountable owner
```

---

# 65. No Blind “Are You Sure?”

Bad approval UX:

```text
Are you sure?

[Yes] [No]
```

without context.

The approver should not need to reconstruct business state manually.

---

# 66. Evidence in Decision Inbox

Evidence SHOULD point to authoritative sources.

Example:

```text
Invoice balance:
MGBOS invoice projection

Payment proof:
provider record

Vendor capacity:
MGBOS vendor data

Deployment revision:
Git commit / CI evidence
```

---

# 67. Recommendation Must Be Distinguishable From Evidence

Decision card MUST NOT present:

```text
AI inference
```

as if it were:

```text
authoritative fact
```

Example:

```text
FACT:
Vendor A missed SLA by 2 days.

INFERENCE:
Vendor B is probably the safer choice.
```

---

# 68. Confidence Is Optional Context

Model confidence MAY be displayed where useful.

It MUST NOT substitute for evidence.

---

# 69. Approval Actions

Canonical human outcomes SHOULD support:

```text
APPROVE
EDIT
REJECT
DEFER
REQUEST_INFO
```

depending on interface.

---

# 70. `APPROVE`

Authorizes the proposal as currently fingerprinted.

---

# 71. `EDIT`

Creates a modified proposal.

Material edits produce:

```text
new action fingerprint
```

and therefore a new approval decision.

---

# 72. `REJECT`

Stops the proposal.

System MAY capture rejection reason.

---

# 73. `DEFER`

Keeps decision open without execution.

System MAY schedule resurfacing.

---

# 74. `REQUEST_INFO`

Approver asks JARVIS/system for additional evidence before deciding.

This SHOULD NOT be interpreted as rejection.

---

# 75. Approval Reason

Approval reason may be optional for routine actions.

It SHOULD become required for:

```text
exception approvals
overrides
high-impact deviations
emergency approvals
```

---

# 76. Rejection Reason

Capturing rejection reason is valuable for:

```text
agent improvement
skill improvement
policy tuning
autonomy evaluation
```

but should not create unnecessary founder friction for every trivial decision.

---

# 77. Approval Evidence

Material approval record SHOULD preserve:

```text
approval request ID
decision ID
approver
timestamp
action fingerprint
risk
scope
decision
reason where required
policy version
evidence references
expiry
```

---

# 78. Approval Record Is Historical Evidence

Once used for a consequential execution, approval history SHOULD be append-oriented/immutable.

Correction should create:

```text
new record
or
explicit amendment
```

not rewrite history.

---

# 79. Approval and Correlation

Approval SHOULD connect to:

```text
correlation_id
```

so full chain can be reconstructed:

```text
recommendation
→ approval
→ command
→ execution
→ verification
```

---

# 80. Approval and Causation

Command executed because of approval MAY carry:

```text
causation_id = approval decision
```

or equivalent evidence link.

---

# 81. Approval and Idempotency

Approval binds to business intent.

Idempotency protects repeated technical execution.

They complement each other.

```text
Approval:
May this happen?

Idempotency:
Ensure it happens at most once logically.
```

---

# 82. Default Approval by Risk

Canonical baseline direction:

```text
R0
No approval normally required

R1
No per-action approval if authorized

R2
No per-action approval by default

R3
Approval required for L3;
L4 possible after policy approval/evidence

R4
Human approval required by default

R5
Strict accountable approval required by default
```

Domain policy MAY be stricter.

---

# 83. R0 Approval

R0 information/reasoning SHOULD NOT generate founder approval noise.

Example:

```text
summarize dashboard
```

does not need approval.

---

# 84. R1 Approval

Authorized read operations normally do not require per-action approval.

Sensitive read policies may impose stronger requirements.

---

# 85. R2 Approval

Internal reversible low-impact work SHOULD usually execute without per-action founder approval once authorized.

Otherwise the approval system becomes noise.

---

# 86. R3 Approval

New AI-driven R3 mutation SHOULD generally begin at:

```text
L3
```

meaning:

```text
prepare
→ human approve
→ execute
```

After sufficient evidence, bounded R3 capabilities may reach L4.

---

# 87. R4 Approval

R4 SHOULD default to:

```text
L3
+
human approval
```

Policy-approved L4 should be exceptional and tightly constrained.

---

# 88. R5 Approval

R5 SHOULD default to:

```text
explicit accountable human approval
+
L3
```

Examples:

```text
record/reverse financial transaction
vendor payment
critical privileged security action
destructive production recovery
```

---

# 89. R5 Standing Approval

Broad standing approval for R5 SHOULD be avoided.

If eventually allowed, it must be extremely narrow and explicitly governed.

---

# 90. Approval by Autonomy Level

```text
L0
No execution approval needed

L1
No execution approval needed

L2
Preparation does not itself require execution approval

L3
Valid approval required before execution

L4
Per-action approval waived only because prior policy approval explicitly covers the case
```

---

# 91. L4 Still Depends on Approval

L4 does not mean:

```text
approval disappeared
```

It means approval moved from:

```text
per action
```

to:

```text
policy boundary
```

---

# 92. Standing Policy Approval

Example:

```text
Approve automatic routine reminder policy

Scope:
TeeStock

Recipients:
existing customers only

Template:
approved template set

Frequency:
bounded

Risk ceiling:
R3
```

Individual matching actions may then execute at L4.

---

# 93. Standing Approval Must Be Bounded

Every standing policy approval SHOULD define:

```text
capability
principal
scope
environment
risk ceiling
constraints
effective date
review/expiry
owner
```

---

# 94. Standing Approval Is Revocable

Founder/authorized governance must be able to:

```text
disable
suspend
reduce
```

the policy without deleting history.

---

# 95. Standing Approval Does Not Survive Material Policy Change Automatically

If:

```text
capability semantics change
risk changes
scope expands
tool/provider behavior changes materially
```

standing approval may require reassessment.

---

# 96. Approval Policy Version

Execution SHOULD eventually record:

```text
approval_policy_version
```

or equivalent.

This enables historical explanation.

---

# 97. Approval Scope

Approval scope MAY include:

```text
organization
brand
business line
resource
customer segment
vendor pool
environment
amount range
action type
```

Narrow scope is preferred.

---

# 98. Cross-Business Approval

Approval for TeeStock MUST NOT implicitly authorize MultiGraph action.

Cross-business approval requires explicit holding/group scope.

---

# 99. Production vs Staging Approval

Approval for:

```text
STAGING deployment
```

does not automatically authorize:

```text
PRODUCTION deployment
```

Environment is material scope.

---

# 100. Amount Thresholds

Future policy MAY define thresholds such as:

```text
PO below threshold
→ lower approval requirement

above threshold
→ owner approval
```

Exact Rupiah thresholds belong in operational policy/configuration.

Not in this constitutional document.

---

# 101. Percentage Thresholds

Similarly:

```text
discount
margin override
budget variance
```

may influence required approval.

Canonical risk/pricing rules remain authoritative.

---

# 102. Bulk Scope Escalation

Approval for:

```text
send one customer message
```

MUST NOT authorize:

```text
send to 10,000 customers
```

unless bulk scope is explicitly covered.

---

# 103. Approval and Physical Commitment

Actions that initiate expensive physical work MAY require approval before irreversible commitment.

Examples:

```text
mass production
large material purchase
vendor production assignment
```

---

# 104. Approval and Contractual Commitment

Issuing:

```text
quote
PO
customer promise
legal response
```

may create external commitment.

Policy should reflect that consequence.

---

# 105. Approval and Financial Truth

Recording financial truth and moving money are both high-impact but distinct.

Example:

```text
record verified incoming payment
```

versus:

```text
initiate bank transfer
```

Both may be R5 but may use different approvers/policies.

---

# 106. Approval and External Provider

Approval authorizes the business action.

It does not guarantee provider execution.

Postcondition still requires verification.

---

# 107. Approval and Tool Health

If tool health is:

```text
DEGRADED
```

policy may block execution even with valid approval.

Approval does not override unsafe tooling.

---

# 108. Approval and Missing Evidence

High-risk action with missing required evidence SHOULD NOT be presented as ready-to-approve.

Correct status:

```text
NEEDS_EVIDENCE
```

or equivalent.

---

# 109. Approval and Contradictory Evidence

If sources materially disagree:

```text
AUTHORITY_CONFLICT
```

must be resolved before high-risk approval.

---

# 110. Approval and Uncertainty

Decision Inbox SHOULD expose material uncertainty.

Example:

```text
Payment provider reports success,
but invoice reconciliation has not completed.
```

Do not present:

```text
"Record payment?"
```

as if state were certain.

---

# 111. Approval and Verification Plan

For R4/R5 proposal, approval card SHOULD know:

```text
how success will be verified
```

before execution.

---

# 112. Approval and Recovery Plan

Where consequence requires it, approver SHOULD be able to see:

```text
rollback
reversal
reconciliation
manual recovery
```

strategy.

---

# 113. Approval Does Not Require Reading Raw Technical Logs

Decision Inbox should compress evidence.

Approver MAY drill down.

Default card should surface decision-relevant facts.

---

# 114. Founder Cognitive Load

Approval system SHOULD optimize:

```text
decisions per founder attention unit
```

not:

```text
number of approvals displayed
```

This is essential to founder-by-exception operation.

---

# 115. Approval Noise Is Governance Failure

If founder receives hundreds of low-risk approvals:

```text
people will rubber-stamp
```

and the approval system loses safety value.

Therefore R0–R2 routine work SHOULD progressively avoid per-action approval.

---

# 116. Approval Batching

Similar low-risk decisions MAY be batched where:

```text
scope is clear
each item remains inspectable
batch does not hide high-risk outlier
```

---

# 117. High-Risk Actions Should Not Hide Inside Batch

A batch containing:

```text
20 × R2
1 × R5
```

MUST NOT appear as:

```text
Approve 21 actions
```

without highlighting the R5 action.

---

# 118. Decision Prioritization

Decision Inbox MAY prioritize based on:

```text
urgency
risk
deadline
business impact
blocking status
```

But risk and urgency remain distinct.

---

# 119. Approval SLA

Future business processes MAY define:

```text
decision due time
escalation time
backup approver
```

This belongs to operational policy.

---

# 120. Backup Approver

As organization grows, policy MAY define backup approvers.

Backup authority must be explicit.

Absence of primary approver does not automatically escalate authority to anyone available.

---

# 121. Delegated Approval Authority

Founder may later delegate approval authority by capability/scope.

Example:

```text
Operations Lead
may approve vendor assignments
under defined limits
```

This is not equivalent to OWNER role.

---

# 122. Delegation Must Be Revocable

Delegated approval authority should support:

```text
scope
effective_from
expiry
revocation
```

where appropriate.

---

# 123. Delegated Approval Must Not Cascade Automatically

Someone receiving approval authority MUST NOT automatically delegate it further unless policy explicitly allows.

---

# 124. Approval Through Chat

Chat-based approval is acceptable if system can securely bind:

```text
authenticated user
approval request
decision
timestamp
```

and resolve ambiguity.

---

# 125. Approval Through UI

UI approval is acceptable when it preserves the same semantic contract.

UI itself is not authority.

Authenticated decision is.

---

# 126. Approval Through Mobile

Same rules apply.

Approval channel does not change risk.

---

# 127. Approval Security

Approval interface for high-risk actions SHOULD resist:

```text
CSRF-like unintended execution
session confusion
request swapping
replay
stale action
ambiguous target
```

Exact implementation belongs to security architecture.

---

# 128. Approval Credentials

No approval mechanism should require exposing:

```text
raw production credentials
bank credentials
service-role keys
```

to human-facing decision surfaces.

---

# 129. Approval Audit

Material decision evidence SHOULD support answering:

```text
who proposed?
who approved?
what exactly was approved?
what evidence existed?
what risk?
what policy?
when?
what command executed?
did verification succeed?
```

---

# 130. Approval Feedback Loop

Decision outcomes:

```text
APPROVE
EDIT
REJECT
```

are useful signals for improving:

```text
skills
prompts
models
routing
policy
autonomy
```

---

# 131. Feedback Must Not Alter Policy Automatically

High approval rate MUST NOT cause:

```text
automatic L3 → L4 promotion
```

without explicit governance decision.

---

# 132. Approval Preference Memory

JARVIS may remember patterns such as:

```text
Rizky prefers concise vendor summaries.
```

It MUST NOT infer:

```text
Rizky usually approves this,
therefore approval is unnecessary.
```

---

# 133. Approval and Autonomy Promotion

Approval data contributes evidence:

```text
unchanged approval rate
edit rate
rejection rate
```

for autonomy review.

It is one signal among several.

---

# 134. Approval Failure Modes

Important failure cases:

```text
approval applied to wrong action
approval replayed
action changed after approval
approval expired
approver unauthorized
execution duplicated
evidence missing
execution result unknown
```

Architecture must explicitly handle them.

---

# 135. Wrong-Action Binding

Approval Request A MUST NOT authorize Command B.

Capability and target must match.

---

# 136. Changed Proposal

If material action data changes after approval:

```text
invalidate
→ regenerate proposal
→ re-evaluate risk
→ re-approve if needed
```

---

# 137. Approver Revoked Before Execution

If approver authority is revoked after approval but before execution, policy MAY require revalidation.

For high-risk actions, revalidation SHOULD be mandatory.

---

# 138. Policy Revoked Before Execution

If the policy allowing action is disabled:

```text
execution stops
```

even if proposal had previously been approved, unless emergency/business continuity policy explicitly states otherwise.

---

# 139. Approval Status vs Execution Status

Keep separate.

Approval:

```text
AWAITING
APPROVED
REJECTED
EXPIRED
```

Execution:

```text
NOT_STARTED
RUNNING
SUCCEEDED
FAILED
UNKNOWN
```

---

# 140. Approval Success Does Not Close Workflow

Workflow closes only after:

```text
execution
+
verification
```

where required.

---

# 141. Action Preparation Contract

Before approval, system SHOULD prepare:

```text
proposed command
material parameters
expected result
risk
scope
evidence
verification plan
```

This forms the Decision Package.

---

# 142. Decision Package

Canonical logical package:

```yaml
decision_id: uuid

proposal:
  capability: mgbos.production.assign
  target_id: PJ-219
  parameters:
    vendor_id: vendor-b

risk:
  level: R3
  reasons:
    - external_vendor_commitment

impact:
  schedule: "-1 day delay"
  cost_delta: 150000

evidence:
  - current_job
  - vendor_capacity
  - rate_card
  - customer_deadline

approval:
  required: true
  eligible_roles:
    - OWNER
    - OPERATIONS

verification:
  expected_state: ASSIGNED
```

Exact implementation may differ.

---

# 143. Decision Package Must Be Snapshot-Like

The human should approve a stable representation of the proposed action.

If the underlying proposal changes materially, the package is invalidated.

---

# 144. Approval Receipt

After decision:

```yaml
approval_decision_id: uuid
decision_id: uuid
decision: APPROVED
approver_id: uuid
decided_at: timestamp
action_fingerprint: hash-or-equivalent
expires_at: timestamp
```

Hash is an implementation option, not a mandatory storage technology.

---

# 145. Execution Receipt

Execution SHOULD link back:

```yaml
command_id: uuid
approval_decision_id: uuid
result: SUCCEEDED
```

when approval caused execution.

---

# 146. Human Accountable Owner

Every material approval policy SHOULD have an accountable human owner.

Currently many group-level policies will default to:

```text
Rizky
```

until responsibility is delegated.

---

# 147. AI Cannot Be Final Accountable Owner

AI may:

```text
recommend
prepare
review
execute
verify
```

but organizational accountability remains human.

---

# 148. Approval for Automated Systems

Deterministic automation also follows approval governance.

Example:

```text
n8n workflow
```

may execute L4 because policy was approved.

Automation does not bypass approval rules simply because no LLM is involved.

---

# 149. Approval for External Integrations

Marketplace/payment/provider events may trigger commands.

External event itself is NOT approval.

Internal policy determines whether resulting action:

```text
auto executes
needs review
needs approval
```

---

# 150. Approval for Security Actions

Security-sensitive operations may require stronger:

```text
identity verification
multiple evidence sources
separation of duties
```

than ordinary business approval.

Detailed security approval policies belong to Security Governance.

---

# 151. Approval for Engineering Releases

Engineering Control Plane may define stricter release gates.

This cross-system document defines semantic meaning of approval but does not replace existing engineering release governance.

---

# 152. Scoped Engineering Approval

Example:

```text
production deploy approved
```

does not authorize:

```text
production database manual mutation
```

unless separately in scope.

---

# 153. Approval Hierarchy

When multiple approval policies apply:

```text
all mandatory applicable gates
must be satisfied
```

unless one policy explicitly supersedes another.

---

# 154. Most Restrictive Rule Wins

If:

```text
domain policy:
no approval

risk policy:
approval required
```

then:

```text
approval required
```

until policy conflict is explicitly resolved.

---

# 155. Approval Conflict

If two authoritative policies contradict each other:

```text
POLICY_CONFLICT
```

must be raised.

Do not guess.

---

# 156. Missing Approval Policy

If a consequential action requires approval semantics but none exists:

```text
do not execute autonomously
```

Fallback:

```text
PREPARE
+
NEEDS_HUMAN
```

---

# 157. Unknown Approver

If required approver cannot be resolved:

```text
NEEDS_HUMAN / GOVERNANCE_CONFIGURATION
```

not:

```text
pick highest role-looking user
```

---

# 158. Approval Policy Must Be Deterministic Where Possible

Policy Engine, not free-form LLM reasoning, SHOULD decide:

```text
approval required?
eligible approvers?
expiry?
```

when rules are known.

---

# 159. AI Can Explain Approval Policy

JARVIS may explain:

```text
"This requires owner approval because it is R5."
```

It does not decide the policy itself.

---

# 160. Approval Anti-Patterns

The following are prohibited patterns:

```text
"Founder said do whatever is needed."

"Agent usually gets approved."

"Tool succeeded in the past."

"User clicked yes yesterday."

"Approval exists somewhere in chat."

"ADMIN can approve everything."

"service_role means approved."

"Rizky owns company, so JARVIS inherits OWNER."

"Approval means skip validation."

"Approval means retry until success."
```

---

# 161. Default Risk / Approval Matrix

| Risk | Default Per-Action Approval Direction |
|---|---|
| R0 | None |
| R1 | None when authorized |
| R2 | Normally none |
| R3 | L3 initially; L4 possible under approved policy |
| R4 | Human approval by default |
| R5 | Strict accountable approval by default |

This matrix sets ecosystem defaults.

Specific policy can be stricter.

---

# 162. Default Autonomy / Approval Matrix

| Autonomy | Approval Semantics |
|---|---|
| L0 | No execution |
| L1 | Human receives recommendation |
| L2 | Human receives prepared action |
| L3 | Specific valid approval required |
| L4 | Per-action approval replaced by prior bounded policy approval |

---

# 163. Example — Quote Override

```text
Quote margin:
18%

Risk:
R4

Authorization:
SALES may prepare quote

Approval:
OWNER

Execution:
approve_quote_price

Evidence:
quote economics
margin
reason
```

Current MGBOS already implements the core version of this model.

---

# 164. Example — Payment Recording

```text
Capability:
mgbos.payment.record

Risk:
R5

Principal:
JARVIS CFO

Autonomy:
L3

Evidence:
invoice
provider proof
amount
customer

Approval:
Rizky / future authorized finance approver

Execution:
MGBOS command

Verification:
payment exists
invoice balance changed correctly
```

---

# 165. Example — Customer Follow-Up

Initial:

```text
Risk:
R3

Autonomy:
L3

JARVIS drafts
Rizky approves
system sends
```

Later after evidence:

```text
Risk:
R3

Autonomy:
L4

Policy:
approved routine reminder class
```

No per-message approval needed inside policy.

---

# 166. Example — Vendor Payment

```text
Prepare vendor payment
→ L2

Risk
→ R5

Human approval
→ required

Pay vendor
→ L3 execution

Verification
→ vendor bill balance + payment record
```

---

# 167. Example — Production Reassignment

```text
JARVIS detects delay
↓
compares vendors
↓
prepares reassignment
↓
R3/R4 depending value/deadline
↓
eligible operations/owner approval
↓
MGBOS command
↓
verification
```

---

# 168. Example — Production Deployment

```text
Release Operator prepares deployment

Risk:
R4

Evidence:
CI
staging
backup/recovery
target revision

Approval:
required according to engineering policy

Execution:
deployment

Verification:
health checks
```

---

# 169. Example — L4 Morning Briefing

```text
Capability:
business-summary.read

Risk:
R1

Autonomy:
L4

Approval:
no per-action approval

Why?
Standing governance permits authorized read-only briefing.
```

---

# 170. Decision Inbox Future Structure

Target Command Center concept:

```text
JARVIS COMMAND CENTER

TODAY
├── 2 Awaiting Approval
├── 3 Needs Attention
├── 1 Needs Reconciliation
└── 0 Critical Incidents

APPROVALS

[ R5 ] Record Customer Payment
Rp10.000.000
Confidence is not the decision basis.
Evidence: 4 verified sources

[APPROVE] [EDIT] [REJECT]

[ R3 ] Switch Production Vendor
Cost +Rp150.000
Deadline improvement: 1 day

[APPROVE] [EDIT] [REJECT] [DEFER]
```

---

# 171. Founder Decision Compression

The ideal founder experience is:

```text
1000 raw operational events
        ↓
JARVIS / systems
        ↓
20 meaningful exceptions
        ↓
5 recommendations
        ↓
2 actual founder decisions
```

not:

```text
1000 events
→ 1000 approval popups
```

---

# 172. Approval Quality Metric

Success of Approval Center should eventually include:

```text
time-to-decision
decision reversal rate
approval edit rate
approval rejection rate
incident-after-approval rate
unnecessary approval rate
founder intervention rate
```

---

# 173. Approval System Maturity

Suggested progression:

```text
STAGE 1
manual structured confirmation

STAGE 2
Decision Inbox

STAGE 3
action fingerprints + policy engine

STAGE 4
standing policy approvals

STAGE 5
bounded L4 autonomy

STAGE 6
founder-by-exception
```

---

# 174. Do Not Overbuild Now

Current read-only JARVIS does NOT require:

```text
enterprise approval workflow engine
multi-approver quorum system
complex policy DSL
cryptographic signing infrastructure
```

today.

The semantic model should be stable first.

Implementation grows with real mutation use cases.

---

# 175. First Implementation Need

The first full Approval Policy implementation should appear when JARVIS gains its first real:

```text
L3 mutation capability
```

Before that, static/manual approval semantics are sufficient.

---

# 176. First L3 Candidate

A sensible first L3 capability SHOULD be:

```text
reversible
well-verified
bounded
operational
```

rather than financial R5.

Examples:

```text
send routine approved communication
create bounded operational task
controlled vendor/production action
```

depending on real business need.

---

# 177. Financial L3 Comes Later

Payment mutation should wait until:

```text
identity
permission
tool registry
approval binding
verification
evidence
reconciliation
observability
```

are mature.

---

# 178. Approval Policy Change

Changing material approval requirements is a governance change.

Examples:

```text
R5 no longer requires human approval

SALES may approve pricing override

JARVIS may approve its own actions
```

require explicit architecture/governance review.

---

# 179. Approval Policy Versioning

Material semantic changes require version update.

Execution evidence SHOULD eventually preserve which policy version applied.

---

# 180. Relationship to Permission Model

```text
Permission:
Can actor request the action?

Approval:
May this specific instance proceed?
```

---

# 181. Relationship to Risk

```text
Risk:
How consequential is it?

Approval:
How much accountable human control is required?
```

---

# 182. Relationship to Autonomy

```text
L3:
specific approval before execution

L4:
prior policy approval covers eligible future executions
```

---

# 183. Relationship to Business Invariants

Approval NEVER invalidates hard business invariants.

---

# 184. Relationship to Evidence

Approval depends on evidence.

Execution produces further evidence.

```text
PRE-EXECUTION EVIDENCE
       ↓
APPROVAL
       ↓
EXECUTION
       ↓
POST-EXECUTION EVIDENCE
```

---

# 185. Relationship to Decision Inbox

Approval Policy defines semantics.

Decision Inbox is the human interaction surface implementing those semantics.

---

# 186. Relationship to JARVIS

JARVIS MAY:

```text
identify decisions
prepare decision package
recommend
request approval
execute approved capability
verify
```

JARVIS MUST NOT:

```text
fabricate approval
approve itself where human required
reuse unrelated approval
hide material parameter changes
```

---

# 187. Relationship to n8n

n8n MAY:

```text
route approval notifications
wait for decision
resume approved workflow
```

n8n MUST NOT create approval merely because a workflow path says:

```text
approved = true
```

without trusted approval evidence.

---

# 188. Relationship to MGBOS

MGBOS remains responsible for:

```text
business authorization
state validation
business invariants
transaction
```

even after valid approval.

---

# 189. Architectural Invariants

1. Approval authorizes a bounded decision, not unlimited authority.
2. Approval is separate from permission.
3. Approval is separate from risk.
4. Approval is separate from execution.
5. Approval never bypasses hard invariants.
6. Approval must come from an eligible authenticated authority.
7. L3 requires valid action-specific approval.
8. L4 relies on prior bounded policy approval.
9. Material action parameters must be bound to approval.
10. Material changes invalidate approval.
11. Risk escalation may require re-approval.
12. High-risk approval should expire when stale execution becomes unsafe.
13. Action-specific approvals should normally be single-use.
14. Technical retry does not require new approval when intent is unchanged and execution is idempotent.
15. Unknown external outcome requires reconciliation before retry.
16. Founder override requires explicit overridable capability.
17. Founder approval cannot bypass non-overridable invariants.
18. AI cannot satisfy a human-required approval gate.
19. Approval and review are distinct.
20. Decision Inbox must expose evidence, impact, and risk.
21. Low-risk routine work should not create approval noise.
22. High-risk actions must not be hidden in bulk approvals.
23. Standing approval must be bounded, auditable, and revocable.
24. Missing approval policy defaults toward no autonomous mutation.
25. Human accountability remains explicit even under L4 automation.

---

# 190. North Star

A trustworthy approval system should make it possible for Rizky to see:

```text
WHAT needs my decision?

WHY does it need me?

WHAT exactly will happen?

WHAT is the risk?

WHAT evidence supports it?

WHAT happens if I approve?

WHAT happens if I reject?

CAN it be reversed?

WHEN does this approval expire?
```

and make a high-quality decision in seconds without reconstructing the entire operational context.

---

# 191. Final Principle

> **The goal of approval governance is not to keep humans inside every workflow.  
> The goal is to keep humans exactly where judgment and accountability still matter.**

As BisnisHub matures:

```text
routine work
→ policy

repeatable decisions
→ bounded autonomy

material exceptions
→ Decision Inbox

strategic judgment
→ Founder
```

That is the architecture behind the future model:

> **“Sistem jalan sendiri. Gue tinggal ACC yang memang perlu gue putuskan.”**