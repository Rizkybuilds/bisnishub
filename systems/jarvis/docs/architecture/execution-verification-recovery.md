---
canonical_id: jarvis.architecture.execution-verification-recovery
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: jarvis
document_class: canonical-specification
effective_from: 2026-09-29
authoritative_for:
  - jarvis execution semantics
  - jarvis execution lifecycle
  - jarvis execution attempts
  - jarvis execution receipts
  - jarvis verification lifecycle
  - jarvis idempotency orchestration
  - jarvis retry semantics
  - jarvis timeout handling
  - jarvis unknown-outcome handling
  - jarvis reconciliation
  - jarvis durable waits
  - jarvis resumability
  - jarvis partial completion
  - jarvis compensation coordination
  - jarvis recovery queue
  - jarvis cancellation
  - jarvis execution kill switches
  - jarvis workflow crash recovery
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - ../charter.md
  - ../architecture.md
  - ../core-runtime.md
  - tool-capability.md
  - event-proactive-intelligence.md
  - ../../../../docs/governance/cross-system-risk-classification.md
  - ../../../../docs/governance/autonomy-levels.md
  - ../../../../docs/governance/approval-policy.md
  - ../../../../docs/governance/evidence-provenance-model.md
  - ../../../mgbos/docs/architecture/command-event-model.md
  - ../../../mgbos/docs/architecture/business-invariants.md
  - ../../../mgbos/docs/architecture/business-state-machines.md
  - ../../../mgbos/docs/adr/005-transactional-outbox.md
supersedes: null
implementation_status: NOT_IMPLEMENTED
target_runtime_location: systems/jarvis/
first_runtime_mode: SYNCHRONOUS_READ_ONLY
---

# JARVIS Execution, Verification & Recovery Architecture v1.0

## 1. Purpose

Dokumen ini mendefinisikan bagaimana JARVIS menjalankan pekerjaan dengan aman ketika realitas tidak berjalan sempurna.

Ia menjawab:

```text
What exactly was attempted?

Did the request reach the provider?

Did the provider merely accept it?

Did the intended outcome actually happen?

Can the operation be retried safely?

What if the process crashes?

What if approval arrives hours later?

What if state changes while waiting?

What if only half the workflow succeeds?

What does cancellation mean?

What can actually be undone?

When do we reconcile?

When do we escalate to a human?
```

---

# 2. Core Principle

> **Execution attempt is not outcome, and outcome is not verified success until verification establishes it.**

Canonical:

```text
INTENT
  ↓
AUTHORIZED EXECUTION
  ↓
ATTEMPT
  ↓
RECEIPT
  ↓
VERIFICATION
  ↓
VERIFIED OUTCOME
```

---

# 3. Never Collapse These Concepts

These are distinct:

```text
REQUESTED

PLANNED

AUTHORIZED

ATTEMPTED

ACCEPTED

EXECUTED

OBSERVED

VERIFIED
```

A mature runtime preserves those distinctions.

---

# 4. Most Dangerous False Assumption

Incorrect:

```text
API returned 200
      ↓
business action succeeded
```

Correct:

```text
API returned 200
      ↓
provider response interpreted
      ↓
expected postcondition verified
      ↓
business outcome classified
```

---

# 5. Execution ≠ Verification

Execution asks:

```text
Did we issue the operation?
```

Verification asks:

```text
Did the intended consequence actually occur?
```

---

# 6. Verification ≠ Evidence

Verification evaluates evidence.

Evidence records:

```text
what was observed
where
when
from which source
```

---

# 7. JARVIS Does Not Own Domain Transaction Semantics

For MGBOS-owned operations:

```text
JARVIS
→ command
→ MGBOS authorization
→ MGBOS invariants
→ MGBOS transaction
```

JARVIS does not emulate MGBOS transaction integrity externally.

---

# 8. Local Atomicity vs Distributed Workflow

Inside one authoritative transactional system:

```text
atomic transaction
```

may be possible.

Across:

```text
MGBOS
email provider
payment provider
social platform
shipping provider
```

global atomicity generally is not.

---

# 9. No Distributed-Transaction Fantasy

JARVIS SHOULD NOT pretend it can atomically commit:

```text
database update
+
email
+
payment provider
+
social publish
```

as one transaction.

Distributed workflows require:

```text
idempotency
verification
reconciliation
recovery
compensation
```

instead.

---

# 10. Exactly-Once Is Not the Default Guarantee

Across distributed systems, JARVIS should generally assume:

```text
delivery may duplicate
responses may be lost
timeouts may occur
workers may crash
```

Therefore target:

> **effectively-once business effects where required, achieved through idempotency + deduplication + verification + reconciliation.**

---

# 11. Execution Hierarchy

Canonical:

```text
WORKFLOW EXECUTION
      │
      ├── STEP
      │    ├── ATTEMPT 1
      │    ├── ATTEMPT 2
      │    └── ...
      │
      ├── STEP
      │
      └── STEP
```

---

# 12. Workflow Execution

Represents one logical fulfillment of a JARVIS objective.

Examples:

```text
Morning Briefing

Prepare customer follow-up

Record approved payment

Reassign production job
```

---

# 13. Step

A bounded unit inside the workflow.

Examples:

```text
read invoice

prepare message

execute command

verify postcondition
```

---

# 14. Attempt

One actual attempt to perform a step.

Retries create:

```text
new attempt
```

but should normally remain part of:

```text
the same logical step.
```

---

# 15. Logical Operation Identity

A consequential step SHOULD have a stable:

```text
operation_id
```

across execution retries.

---

# 16. Attempt Identity

Each technical try gets:

```text
attempt_id
```

---

# 17. Example

```text
operation_id:
record-payment-abc

attempt_1:
timeout

attempt_2:
provider confirms duplicate/idempotent replay
```

Both attempts belong to the same logical business operation.

---

# 18. Execution Contract

Logical:

```ts
type WorkflowExecution = {
  executionId: string
  requestId: string
  traceId: string

  workflowType: string

  actorId: string

  organizationId?: string

  state: WorkflowExecutionState

  startedAt: string
  completedAt?: string

  correlationId?: string
}
```

---

# 19. Workflow State

Canonical high-level states:

```text
PENDING

RUNNING

WAITING

VERIFYING

RECONCILING

COMPENSATING

COMPLETED

PARTIAL

BLOCKED

FAILED

CANCELLED
```

---

# 20. `PENDING`

Workflow exists but execution has not meaningfully begun.

---

# 21. `RUNNING`

One or more executable steps are currently progressing.

---

# 22. `WAITING`

Progress intentionally pauses for:

```text
approval
timer
external callback
human input
dependency
```

---

# 23. `VERIFYING`

Execution occurred and runtime is determining the actual outcome.

---

# 24. `RECONCILING`

Outcome or state is uncertain/conflicting and requires fresh investigation.

---

# 25. `COMPENSATING`

Runtime is executing explicit remedial actions for previously completed side effects.

---

# 26. `COMPLETED`

Required workflow outcome is verified complete.

---

# 27. `PARTIAL`

Some useful required/optional work succeeded, but full workflow objective was not achieved.

---

# 28. `BLOCKED`

Workflow cannot currently progress safely.

Example:

```text
ambiguous identity
missing approval
source unavailable
policy conflict
```

---

# 29. `FAILED`

Workflow is known not to have achieved its required outcome and no automatic recovery path currently remains.

---

# 30. `CANCELLED`

Future work in the workflow has been intentionally stopped.

Cancellation does NOT imply previous side effects were undone.

---

# 31. Outcome Is Separate From Workflow State

Important distinction:

```text
Workflow State:
RECONCILING

Operation Outcome:
UNKNOWN
```

This is cleaner than making `UNKNOWN` carry every lifecycle meaning.

---

# 32. Operation Outcome

Canonical:

```text
NOT_ATTEMPTED

KNOWN_FAILED

ACCEPTED_UNVERIFIED

VERIFIED_SUCCESS

VERIFIED_FAILURE

UNKNOWN
```

---

# 33. `NOT_ATTEMPTED`

Provider/system side effect was not invoked.

---

# 34. `KNOWN_FAILED`

System knows the operation did not achieve the effect.

Example:

```text
provider rejected request before mutation.
```

---

# 35. `ACCEPTED_UNVERIFIED`

Provider accepted the request but final intended business result has not yet been established.

---

# 36. `VERIFIED_SUCCESS`

Required postconditions were positively established.

---

# 37. `VERIFIED_FAILURE`

Verification established that expected postcondition did not occur.

---

# 38. `UNKNOWN`

Runtime cannot safely establish whether the side effect occurred.

This is a first-class valid outcome.

---

# 39. UNKNOWN Is Not Failure

If a payment request timed out after dispatch:

```text
FAILED
```

may be false.

It may have succeeded.

Therefore:

```text
UNKNOWN
```

is safer.

---

# 40. UNKNOWN Is Not Success

Likewise:

```text
maybe provider processed it
```

cannot become:

```text
SUCCESS
```

without evidence.

---

# 41. Step State

Logical:

```text
PENDING

READY

RUNNING

WAITING

VERIFYING

SUCCEEDED

FAILED

SKIPPED

BLOCKED

UNKNOWN
```

---

# 42. Required vs Optional Step

Planner/Skill contract SHOULD identify whether a step is:

```text
REQUIRED

OPTIONAL
```

---

# 43. Required Failure

A required step failure often causes:

```text
workflow FAILED
```

or:

```text
BLOCKED
```

depending on recoverability.

---

# 44. Optional Failure

May yield:

```text
PARTIAL
```

while preserving useful result.

---

# 45. Execution Attempt Contract

```ts
type ExecutionAttempt = {
  attemptId: string
  operationId: string

  stepId: string

  capabilityId: string
  toolId: string

  idempotencyKey?: string

  dispatchedAt?: string
  respondedAt?: string

  attemptStatus:
    | "NOT_DISPATCHED"
    | "DISPATCHED"
    | "RESPONDED"
    | "TIMED_OUT"
    | "FAILED"

  providerReference?: string
}
```

---

# 46. Dispatch Boundary Matters

A timeout before sending anything is different from:

```text
request transmitted
but acknowledgement lost.
```

---

# 47. Pre-Dispatch Failure

Examples:

```text
input validation failure

policy denied

credential unavailable

tool disabled
```

Outcome:

```text
NOT_ATTEMPTED
```

No external side effect occurred.

---

# 48. Post-Dispatch Failure

Examples:

```text
network connection drops

provider response lost

worker crashes after request
```

Outcome may be:

```text
UNKNOWN
```

---

# 49. Execution Receipt

A receipt records what the execution layer observed.

Logical:

```ts
type ExecutionReceipt = {
  operationId: string
  attemptId: string

  capabilityId: string

  providerReference?: string

  providerStatus?: string

  acceptedAt?: string

  observedAt: string

  evidenceIds: string[]
}
```

---

# 50. Receipt Is Not Outcome

Provider saying:

```text
queued
accepted
processing
```

is a receipt.

Not necessarily completed outcome.

---

# 51. Idempotency

Idempotency ensures repeating the same logical request does not unintentionally create repeated business effects.

---

# 52. Strong Idempotency Principle

For material mutation:

```text
same logical operation
+
same material payload
+
same idempotency key
```

should result in:

```text
same business effect
```

or safe replay response.

---

# 53. Same Key, Different Payload

This MUST NOT silently proceed.

Expected:

```text
IDEMPOTENCY_CONFLICT
```

---

# 54. Stable Key Across Retry

Retry of the same operation MUST reuse:

```text
same idempotency key
```

where target contract supports it.

---

# 55. New Key on Retry Is Dangerous

Incorrect:

```text
attempt 1 timeout
→ generate new key
→ retry
```

This can duplicate side effects.

---

# 56. Idempotency Scope

Key interpretation must be scoped appropriately by:

```text
capability
organization
resource
provider/system
```

as required by the target contract.

---

# 57. Idempotency Is Not Deduplication Alone

Deduplication answers:

```text
Have I seen this request/event?
```

Idempotency answers:

```text
Can repeating this operation safely preserve one logical effect?
```

---

# 58. JARVIS Does Not Override Target Idempotency Semantics

For MGBOS commands:

```text
MGBOS owns command-level idempotency behavior.
```

JARVIS supplies appropriate operation identity.

---

# 59. External Provider Without Idempotency

If provider cannot safely deduplicate mutation requests:

```text
automatic retry policy must become stricter.
```

Verification/reconciliation becomes more important.

---

# 60. Retry Classification

Every failed attempt should conceptually fall into one of:

```text
SAFE_TO_RETRY

RETRY_WITH_SAME_IDEMPOTENCY_KEY

RECONCILE_BEFORE_RETRY

DO_NOT_RETRY
```

---

# 61. `SAFE_TO_RETRY`

No possible external side effect occurred.

Example:

```text
DNS failure before connection.
```

---

# 62. `RETRY_WITH_SAME_IDEMPOTENCY_KEY`

Operation may safely replay because target contract guarantees idempotency.

---

# 63. `RECONCILE_BEFORE_RETRY`

Side effect may have occurred.

First discover current/provider state.

---

# 64. `DO_NOT_RETRY`

Examples:

```text
invalid input

permission denied

business invariant rejected

non-retryable provider rejection
```

---

# 65. Retry Budget

Every retryable operation SHOULD have bounded:

```text
max attempts

maximum elapsed time

backoff
```

---

# 66. No Infinite Retry

Prohibited:

```text
retry until it works forever
```

---

# 67. Exponential Backoff

Useful for:

```text
rate limits

transient provider failure

temporary network outage
```

where appropriate.

---

# 68. Retry Jitter

May help avoid synchronized retry storms at higher scale.

Not required for first runtime.

---

# 69. Rate-Limit Retry

Respect provider:

```text
Retry-After
```

where available.

---

# 70. Retry Is an Execution Decision

A model SHOULD NOT decide retry safety by intuition.

Use Tool/Capability failure semantics.

---

# 71. Timeout Categories

Runtime SHOULD distinguish where useful:

```text
CONNECT_TIMEOUT

REQUEST_TIMEOUT

PROVIDER_PROCESSING_TIMEOUT

VERIFICATION_TIMEOUT

WORKFLOW_TIMEOUT
```

---

# 72. Connect Timeout

If request never reached provider with high confidence:

```text
retry may be safe.
```

---

# 73. Request Timeout

If transmission may have completed:

```text
outcome may be UNKNOWN.
```

---

# 74. Provider Processing Timeout

Provider accepted work but has not finished within expected window.

Correct action may be:

```text
WAIT
POLL
CALLBACK
RECONCILE
```

not duplicate request.

---

# 75. Verification Timeout

Execution may have occurred, but verification source is unavailable.

Outcome remains:

```text
UNKNOWN / ACCEPTED_UNVERIFIED
```

depending on evidence.

---

# 76. Workflow Timeout

Overall workflow exceeded its allowed completion window.

This does not automatically determine individual side-effect outcomes.

---

# 77. Verification

Verification checks expected postconditions.

Every material mutation SHOULD define:

```text
what success means
```

before execution.

---

# 78. Verification Contract

Logical:

```ts
type VerificationPolicy = {
  policyId: string

  requiredPostconditions: Postcondition[]

  freshnessRequirement?: string

  maxVerificationDelay?: string

  failureBehavior: string
}
```

---

# 79. Postcondition

Examples:

```text
invoice status = PAID

shipment status = DISPATCHED

provider message ID exists

deployment revision = expected SHA

inventory reservation exists
```

---

# 80. Postcondition Should Be Observable

Avoid vague:

```text
"everything looks fine"
```

Prefer deterministic/observable conditions.

---

# 81. Verification Source

Strongest useful source is generally:

```text
the authoritative system for the claimed outcome
```

---

# 82. Same Response May Be Insufficient

A mutation endpoint returning:

```text
success
```

may be weaker evidence than a fresh query showing expected state.

---

# 83. State Re-Read

For important mutation:

```text
execute
   ↓
re-read authoritative state
   ↓
verify
```

is preferred where feasible.

---

# 84. Verification Independence

Independence has degrees.

Strong verification may use:

```text
separate query

separate endpoint

separate evidence

separate system observation
```

from the execution attempt.

---

# 85. Same Provider Self-Confirmation

Useful but not always independent.

Example:

```text
POST /payment
returns payment_id
```

and:

```text
GET /payment/payment_id
```

is stronger than trusting only POST response.

---

# 86. Cross-System Verification

Sometimes actual outcome requires multiple systems.

Example:

```text
provider payment confirmed

+
MGBOS payment recorded
```

These are distinct facts.

---

# 87. Verification Must Be Claim-Specific

Evidence sufficient for:

```text
message accepted by provider
```

does not prove:

```text
customer read message.
```

---

# 88. Verification Result

Logical:

```ts
type VerificationResult = {
  status:
    | "VERIFIED_SUCCESS"
    | "VERIFIED_FAILURE"
    | "PARTIAL"
    | "UNKNOWN"

  postconditions: PostconditionResult[]

  evidenceIds: string[]

  verifiedAt: string
}
```

---

# 89. Partial Verification

Some postconditions may pass while others remain unknown.

Workflow policy determines whether this is acceptable.

---

# 90. Verification Failure Does Not Automatically Mean Rollback

The effect may already exist.

First classify the actual situation.

---

# 91. Reconciliation

Reconciliation answers:

> **What actually happened when execution and observation disagree or remain uncertain?**

---

# 92. Reconciliation Trigger

Typical cases:

```text
timeout after dispatch

provider accepted but callback lost

execution record missing after worker crash

state inconsistent across systems

verification unavailable

duplicate provider response

approval/action history disagreement
```

---

# 93. Reconciliation Is Current-State Investigation

Canonical:

```text
UNKNOWN
  ↓
query relevant authoritative/provider state
  ↓
compare evidence
  ↓
classify actual outcome
```

---

# 94. Reconciliation Result

Possible:

```text
CONFIRMED_SUCCESS

CONFIRMED_FAILURE

STILL_UNKNOWN

CONFLICT

HUMAN_REQUIRED
```

---

# 95. Reconciliation Can Discover Success

Example:

```text
send request timed out
```

but provider lookup returns:

```text
message exists
```

Then:

```text
CONFIRMED_SUCCESS
```

No retry required.

---

# 96. Reconciliation Can Discover Failure

Provider reports:

```text
no request with idempotency key
```

then retry may be safe according to contract.

---

# 97. Reconciliation Can Remain Unknown

When no reliable evidence exists:

```text
HUMAN_REQUIRED
```

may be the only safe next step.

---

# 98. Recovery Queue

Unresolved recoverable cases SHOULD eventually enter a dedicated:

```text
Recovery Queue
```

---

# 99. Recovery Queue Purpose

Contains workflows requiring:

```text
reconciliation

manual review

retry decision

compensation

external follow-up

state repair
```

---

# 100. Recovery Item

Logical:

```ts
type RecoveryItem = {
  recoveryId: string

  executionId: string
  stepId?: string

  category: string

  currentOutcome: string

  evidenceIds: string[]

  recommendedNextAction:
    | "RETRY"
    | "RECONCILE"
    | "COMPENSATE"
    | "ESCALATE"
    | "ABORT"
    | "RESUME"

  status:
    | "OPEN"
    | "IN_PROGRESS"
    | "RESOLVED"
}
```

---

# 101. Recovery Queue ≠ Exception Queue

Exception Queue focuses on business/decision exceptions.

Recovery Queue focuses on execution integrity.

They may link to one another.

---

# 102. Example

```text
Business exception:
customer refund needed

Execution recovery:
refund API timed out
and result is unknown
```

Separate concerns.

---

# 103. Durable Waits

Long-running workflows may intentionally pause for:

```text
human approval

scheduled time

external callback

resource availability

human input
```

---

# 104. Wait Is a Legitimate Workflow State

A workflow waiting 8 hours for approval is not:

```text
failed
```

---

# 105. Wait Types

Canonical direction:

```text
WAITING_APPROVAL

WAITING_TIMER

WAITING_EXTERNAL

WAITING_HUMAN

WAITING_DEPENDENCY
```

These may be encoded as details under workflow state:

```text
WAITING
```

---

# 106. Durable Wait Requirement

If process may outlive one runtime process:

```text
waiting state must be durably persisted.
```

---

# 107. No In-Memory Sleep for Long Waits

Incorrect:

```text
sleep(8 hours)
```

inside one worker.

---

# 108. Wait Record

Should preserve:

```text
what we are waiting for

correlation identity

deadline

resume condition

current workflow state

required context references
```

---

# 109. Resume

Resume continues an existing workflow.

It MUST NOT silently create a brand-new unrelated operation.

---

# 110. Resume Requires Revalidation

After a material wait, re-check:

```text
actor/service authority

approval validity

entity identity

current business state

effective risk

tool health

environment

plan assumptions
```

---

# 111. Approval Can Become Stale

Example:

```text
approve purchase at Rp10m
```

but before execution:

```text
price changed to Rp15m.
```

Old approval may no longer cover the new operation.

---

# 112. Entity Can Change During Wait

Vendor may become:

```text
inactive
```

before approved assignment executes.

Revalidate.

---

# 113. Tool Can Become Unhealthy During Wait

Approved plan does not require runtime to execute through an unavailable provider.

---

# 114. Risk Can Increase During Wait

Context change may push effective risk higher.

New approval may be required.

---

# 115. Durable Execution

Durable workflow means execution can survive:

```text
process restart

worker crash

deployment

provider delay

human approval delay
```

without losing logical state.

---

# 116. Durable Does Not Mean Complex Infrastructure Immediately

First JARVIS read-only runtime can remain synchronous.

Durability is introduced when a real workflow needs waits/recovery.

---

# 117. Workflow Engine Decision

Possible future implementations include:

```text
database-backed state machine

n8n

dedicated durable-workflow engine
```

Architecture does not mandate one yet.

---

# 118. n8n May Handle Waiting

n8n MAY support:

```text
timer
approval wait
webhook continuation
retry
```

for suitable workflows.

JARVIS still owns:

```text
reasoning
policy coordination
execution semantics
verification expectations
```

---

# 119. Do Not Adopt Temporal Prematurely

A specialized durable workflow engine becomes justified when:

```text
many long-lived workflows

complex retries

high reliability

many callbacks

workflow versioning

state recovery
```

make simpler orchestration painful.

---

# 120. Worker Crash

Runtime must assume crash may happen:

```text
before provider call

during provider call

after side effect

before receipt persistence

during verification
```

---

# 121. Crash Before Dispatch

Normally safe to resume/retry.

---

# 122. Crash After Side Effect

Most dangerous case:

```text
provider acted

runtime crashed

execution record incomplete
```

Recovery MUST reconcile before retry unless idempotency guarantee is strong.

---

# 123. Persist Before External Side Effect

Where architecture permits:

```text
persist intended operation
        ↓
dispatch
```

so recovery knows what was being attempted.

---

# 124. Persist After Result

Store:

```text
attempt receipt

provider reference

observed outcome
```

as soon as practical.

---

# 125. Cannot Make External Side Effect + Local Record Atomic

Across independent systems there is a failure gap.

Design must acknowledge it.

---

# 126. Operation Journal

A durable execution journal can reduce ambiguity by recording:

```text
operation created

dispatch started

provider response

verification

recovery action
```

---

# 127. Operation Journal Is Not Business SoR

It is operational execution evidence.

---

# 128. Worker Lease

Future distributed workers MAY use:

```text
lease
heartbeat
```

to avoid multiple workers concurrently processing one execution.

---

# 129. Lease Is Infrastructure State

It does not become business authority.

---

# 130. Expired Lease

A new worker may resume only after inspecting persisted state and operation identities.

It does not blindly restart from step 1.

---

# 131. Concurrency

Two legitimate workflow instances may target the same business resource.

Source system must enforce its own concurrency/invariants.

---

# 132. JARVIS Should Pass Version/Expected State When Available

Example:

```text
update order if current version = X
```

may reduce stale-plan execution.

Exact mechanism belongs to authoritative system contract.

---

# 133. JARVIS Does Not Directly Lock MGBOS Tables

Concurrency control belongs inside MGBOS command/database boundary.

---

# 134. Partial Completion

Distributed workflow may achieve some effects before another step fails.

Example:

```text
order created ✓

email failed ✗
```

Correct result:

```text
PARTIAL
```

not pretend everything failed.

---

# 135. Do Not Undo Successful Business Transaction Because Notification Failed

Example:

```text
order creation succeeded

email notification failed
```

Normally retry notification.

Do not delete order.

---

# 136. Required vs Auxiliary Effects

Workflow design SHOULD distinguish:

```text
PRIMARY BUSINESS EFFECT

AUXILIARY SIDE EFFECT
```

---

# 137. Example

```text
payment recorded
→ primary

receipt email
→ auxiliary
```

Email failure should not falsely classify payment as failed.

---

# 138. Compensation

Compensation is:

> **a new action intended to mitigate or counteract an already completed action.**

It is not magical rollback.

---

# 139. Rollback

Rollback means:

```text
transaction was not committed
or changes are reversed within transactional boundary.
```

Use the term only where technically true.

---

# 140. Reversal

Reversal is a domain-defined counter-transaction preserving history.

Example:

```text
payment confirmed
→ payment reversal
```

---

# 141. Compensation

Examples:

```text
booking made
→ cancel booking

wrong email sent
→ send correction

inventory reserved
→ release reservation
```

---

# 142. Cleanup

Technical cleanup may remove temporary resources.

Cleanup is different from business compensation.

---

# 143. Never Fake Undo

Some effects are irreversible.

Example:

```text
customer already read email.
```

You cannot “unsend history.”

You can only compensate.

---

# 144. Compensation Requires Its Own Capability

Do not embed secret rollback magic into execution engine.

Examples:

```text
mgbos.payment.reverse

calendar.event.cancel

inventory.reservation.release
```

are explicit capabilities.

---

# 145. Compensation Requires Governance

Compensating action has its own:

```text
risk

permission

autonomy

approval

verification
```

---

# 146. Compensation Can Fail

A recovery workflow must anticipate:

```text
COMPENSATION_FAILED
```

---

# 147. Compensation Failure Escalates

Do not pretend original workflow is restored.

Enter:

```text
Recovery Queue / human escalation
```

---

# 148. Compensation Should Preserve History

Do not erase original action merely because a compensating action followed.

---

# 149. Cancellation

Cancellation means:

> Stop future workflow progression where possible.

---

# 150. Cancellation Does Not Reverse Completed Effects

If:

```text
message already sent
```

cancelling workflow cannot make it unsent.

---

# 151. Cancellation of Waiting Workflow

Can often simply:

```text
stop future resume.
```

---

# 152. Cancellation of Running Attempt

May be:

```text
best effort only
```

depending on provider.

---

# 153. Provider Cancellation

If provider supports cancellation, expose it as an explicit capability/contract.

---

# 154. Cancellation Evidence

Record:

```text
who requested cancellation

when

which steps were already completed

what remained running
```

---

# 155. Approval Withdrawal

If approval is withdrawn before execution:

```text
workflow should not execute.
```

If execution already occurred:

```text
withdrawal does not undo it.
```

---

# 156. Plan Drift

A plan may become stale between planning and execution.

Causes:

```text
business state change

tool change

price change

identity change

risk change

approval delay
```

---

# 157. Pre-Execution Revalidation

Before consequential mutation:

```text
re-read critical preconditions
```

especially after any meaningful delay.

---

# 158. Plan Replanning

If assumptions no longer hold:

```text
do not force original plan.
```

Return to:

```text
planning / human review
```

as appropriate.

---

# 159. Verification Drift

Even after action, current state may continue changing.

Verification should be scoped to:

```text
specific expected postcondition
at relevant time.
```

---

# 160. Recovery Strategy

Canonical recovery actions:

```text
RETRY

RECONCILE

RESUME

REPLAN

COMPENSATE

ESCALATE

ABORT
```

---

# 161. RETRY

Re-attempt same logical operation safely.

---

# 162. RECONCILE

Discover actual state before deciding next action.

---

# 163. RESUME

Continue paused workflow from persisted state.

---

# 164. REPLAN

Current context invalidated previous execution plan.

---

# 165. COMPENSATE

Mitigate completed effect through explicit new action.

---

# 166. ESCALATE

Require human/process owner intervention.

---

# 167. ABORT

Stop workflow without additional side effects.

---

# 168. Recovery Decision Should Be Deterministic Where Possible

Failure class + capability contract should guide the safe recovery path.

Model reasoning can help complex diagnosis.

It should not invent retry safety.

---

# 169. Recovery Plan

Logical:

```ts
type RecoveryPlan = {
  executionId: string

  action:
    | "RETRY"
    | "RECONCILE"
    | "RESUME"
    | "REPLAN"
    | "COMPENSATE"
    | "ESCALATE"
    | "ABORT"

  reason: string

  requiredCapabilities: string[]

  evidenceIds: string[]
}
```

---

# 170. Recovery Itself Is Governed

A recovery operation is still an operation.

It must pass:

```text
permission
risk
autonomy
approval
verification
```

---

# 171. Kill Switches

JARVIS SHOULD eventually support execution kill switches.

---

# 172. Global Mutation Kill Switch

Emergency:

```text
DISABLE ALL JARVIS MUTATIONS
```

while retaining:

```text
reads
analysis
verification
briefing
```

---

# 173. Domain Kill Switch

Examples:

```text
disable finance mutations

disable customer messaging

disable social publishing
```

---

# 174. Capability Kill Switch

Example:

```text
email.message.send
→ DISABLED
```

---

# 175. Provider Kill Switch

Disable a broken provider while preserving compatible alternatives.

---

# 176. Agent/Skill Kill Switch

Can prevent a specific workflow path without disabling underlying tools globally.

---

# 177. Kill Switch Does Not Undo Past Effects

It prevents further execution.

Recovery of existing side effects remains explicit.

---

# 178. In-Flight Execution During Kill Switch

Policy should define whether to:

```text
allow already-dispatched work to finish

block next steps

cancel where safely possible
```

---

# 179. Default Emergency Behavior

For consequential mutation:

```text
block future undispatched steps
```

is generally safer.

Already-unknown effects require reconciliation.

---

# 180. Verification Kill Switch

If trustworthy verification becomes unavailable, high-autonomy mutation may need to stop.

---

# 181. Tool Health Degradation

Tool health can cause:

```text
automatic retry restriction

fallback

autonomy reduction

execution block
```

according to policy.

---

# 182. Execution Autonomy Degradation

Possible direction:

```text
L4 automatic
   ↓
L3 approval
   ↓
L2 prepare only
   ↓
L1 recommend
```

when operational confidence degrades.

---

# 183. Autonomy Degradation Is Safer Than Pretending Normality

If verification is broken:

```text
reduce execution authority
```

rather than continue blind L4 operation.

---

# 184. Recovery and Human Attention

Founder should only receive recovery cases that need human judgment.

Routine safe retries/reconciliation can remain automatic.

---

# 185. Founder-by-Exception Recovery

Desired:

```text
1,000 executions
   ↓
950 normal
   ↓
45 automatically recovered
   ↓
5 genuine human exceptions
```

---

# 186. Recovery Decision Package

Human-facing recovery package SHOULD include:

```text
what was intended

what was attempted

what evidence exists

what remains unknown

possible next actions

risk of retry

risk of not acting
```

---

# 187. No Generic “Retry” Button for High-Risk Unknowns

For R4/R5 operations, UI should not encourage blind repeated side effects.

---

# 188. Execution Persistence

Durable runtime should eventually persist:

```text
workflow execution

steps

attempts

receipts

verification results

recovery state

wait state
```

---

# 189. Logical Persistence

Possible:

```text
jarvis_executions

jarvis_execution_steps

jarvis_execution_attempts

jarvis_execution_receipts

jarvis_verifications

jarvis_recovery_items

jarvis_waits
```

Do not implement all before need.

---

# 190. Minimal Initial Persistence

Read-only Morning Briefing likely needs only:

```text
execution

tool calls

verification

evidence
```

No durable wait engine required.

---

# 191. Execution History Is Append-Oriented

Important material history should not be casually overwritten.

---

# 192. Current Status Projection

A current status field may exist for efficiency.

Historical transitions remain traceable.

---

# 193. Execution State Transition Audit

Material transitions should preserve:

```text
from

to

time

reason

actor/system
```

---

# 194. Evidence Linkage

Each execution attempt and verification result SHOULD link to relevant evidence.

---

# 195. Correlation

Execution should preserve:

```text
request ID

trace ID

correlation ID

causation ID

event ID where relevant

approval ID where relevant
```

---

# 196. Crash Recovery

After restart:

```text
load incomplete executions

classify last durable state

do not assume last in-memory step

resume/reconcile safely
```

---

# 197. Incomplete `RUNNING` Step

A step left RUNNING after worker crash must be inspected.

Do not simply mark:

```text
FAILED
```

or blindly re-run.

---

# 198. Crash-Recovery Classification

Possible:

```text
not dispatched
→ retry

dispatched with idempotency
→ reconcile/replay safely

dispatched without confirmation
→ reconcile

provider ref persisted
→ query provider

verified before crash
→ continue
```

---

# 199. Recovery Scan

Runtime MAY periodically identify:

```text
stuck RUNNING

expired WAITING

UNKNOWN

failed verification

retryable transient failures
```

---

# 200. Stuck Workflow

Definition should be workflow-specific.

Do not declare a 24-hour approval wait “stuck” merely because it is old.

---

# 201. Deadline

Wait/execution may have:

```text
deadline
```

after which workflow escalates or expires.

---

# 202. Expired Workflow

An expired plan may require:

```text
REPLAN
```

rather than execution.

---

# 203. Versioned Workflow Definition

Long-running workflow may resume after Skill/Agent code changed.

This requires explicit version handling.

---

# 204. Preserve Definition Version

Persist:

```text
Skill version

Agent version

workflow contract version
```

for long-running executions.

---

# 205. Do Not Silently Resume Under New Semantics

If a breaking workflow update occurs:

```text
migrate explicitly
or
complete using compatible old definition
```

where possible.

---

# 206. Deployment Safety

Deploying new JARVIS code should not corrupt active durable workflows.

---

# 207. Workflow Migration

Only needed when actual long-lived execution exists.

Do not build generic workflow migration framework yet.

---

# 208. Verification and AI

AI MAY assist semantic verification.

Examples:

```text
does generated document satisfy requirements?

does customer reply indicate acceptance?
```

---

# 209. Deterministic Verification Preferred

For:

```text
money
state
permissions
IDs
status
counts
```

deterministic/system queries are preferred.

---

# 210. AI Verification Needs Evidence

AI cannot simply say:

```text
"looks successful."
```

without source data.

---

# 211. Independent Critic Is Not Outcome Verification

A second model agreeing with first model does not prove an external action happened.

---

# 212. Verification Cost Should Match Risk

R0/R1:

```text
light verification
```

may be enough.

R4/R5:

```text
strong postcondition
fresh evidence
reconciliation path
```

is expected.

---

# 213. Execution and External Messaging

Example send flow:

```text
prepare message
      ↓
approval if required
      ↓
send
      ↓
provider receipt
      ↓
verify provider message exists
      ↓
record outcome
```

Do not claim:

```text
recipient read it
```

unless separate evidence supports that claim.

---

# 214. Execution and Payment

Conceptual:

```text
approved payment operation
      ↓
provider/system command
      ↓
possible receipt
      ↓
current authoritative state
      ↓
verify
      ↓
reconcile if timeout/conflict
```

Never blindly repeat uncertain money movement.

---

# 215. Execution and Publishing

Social/content publishing may produce:

```text
provider post ID
```

Verification should re-read/confirm expected publication.

---

# 216. Execution and Production Deployment

Deployment success requires more than:

```text
deployment API accepted.
```

Verification may include:

```text
expected revision live

health check

smoke test
```

under engineering governance.

---

# 217. Execution and MGBOS Command

MGBOS command result may be strong evidence for transaction commit.

JARVIS still uses appropriate query/audit evidence where needed.

---

# 218. MGBOS Invariants Win

If MGBOS rejects:

```text
invalid state
insufficient permission
business invariant
```

JARVIS does not retry hoping the rule disappears.

---

# 219. Business Rejection Is Not Infrastructure Failure

Separate:

```text
DOMAIN_REJECTED
```

from:

```text
PROVIDER_UNAVAILABLE
```

---

# 220. Error Families

Execution/recovery layer SHOULD distinguish:

```text
VALIDATION

AUTHORIZATION

DOMAIN_REJECTION

TRANSIENT_INFRASTRUCTURE

RATE_LIMIT

TIMEOUT

UNKNOWN_OUTCOME

VERIFICATION_FAILURE

CONFLICT

CANCELLED
```

---

# 221. Domain Rejection

Usually:

```text
DO_NOT_RETRY
```

until business/context state changes.

---

# 222. Concurrency Conflict

May require:

```text
refresh state
→ REPLAN
```

rather than same blind retry.

---

# 223. Stale State Conflict

Example:

```text
expected order ACTIVE
but now COMPLETED
```

Old plan should stop.

---

# 224. Observability

Execution architecture requires visibility into:

```text
active workflows

waiting workflows

retrying workflows

unknown outcomes

reconciliation

partial completion

recovery queue
```

---

# 225. Critical Metrics

Future metrics:

```text
verified success rate

unknown-outcome rate

retry rate

reconciliation rate

recovery success rate

duplicate-side-effect incidents

verification failure rate

mean recovery time
```

---

# 226. Tool Success Rate Is Insufficient

More important:

```text
verified outcome success
```

---

# 227. UNKNOWN Rate Is Important

A high UNKNOWN rate means provider/tool contracts are weak or verification is insufficient.

---

# 228. Recovery Effectiveness

Measure:

```text
automatically recovered

human escalated

permanently failed
```

---

# 229. Duplicate Side Effect Is Critical Incident

Examples:

```text
double payment

duplicate customer email

duplicate purchase order
```

should be tracked separately.

---

# 230. Execution Evals

Before consequential production execution, test:

```text
normal success

provider rejection

timeout before dispatch

timeout after dispatch

lost acknowledgement

duplicate request

worker crash

verification failure

stale approval

stale plan

partial completion

cancel during wait

compensation failure

kill switch
```

---

# 231. Duplicate Request Test

Same logical operation submitted twice.

Expected:

```text
one business effect
```

where idempotency is required.

---

# 232. Same Key / Different Payload Test

Expected:

```text
IDEMPOTENCY_CONFLICT
```

---

# 233. Worker Crash Test — Before Dispatch

Expected:

```text
safe resume
```

without duplicate effect.

---

# 234. Worker Crash Test — After Dispatch

Expected:

```text
reconcile first
```

unless target idempotency contract proves replay safe.

---

# 235. Lost Response Test

Provider executed operation but response is lost.

Expected:

```text
UNKNOWN
→ reconcile
→ discover success
```

not duplicate action.

---

# 236. Verification Failure Test

Provider receipt exists but postcondition absent.

Expected:

```text
VERIFIED_FAILURE
or
UNKNOWN
```

depending on source evidence.

---

# 237. Approval Expiry Test

Approval expires while waiting.

Expected:

```text
do not execute.
```

---

# 238. State Drift Test

Business state materially changes after approval.

Expected:

```text
revalidate
→ replan / reapproval
```

---

# 239. Cancellation Test

Cancellation after step 1 completes and before step 2.

Expected:

```text
stop step 2
preserve step 1 history
```

No fake rollback.

---

# 240. Compensation Test

Original side effect succeeds.

Later workflow requires correction.

Expected:

```text
explicit compensation capability
+
its own verification
```

---

# 241. Compensation Failure Test

Expected:

```text
Recovery Queue
+
human escalation where required
```

---

# 242. Kill Switch Test

While mutation workflow is queued:

```text
global mutation disabled
```

Expected:

```text
future mutation steps blocked
```

with read/analysis remaining available.

---

# 243. First Read-Only Runtime

Morning Briefing remains simple:

```text
synchronous reads
      ↓
verification
      ↓
partial failure handling
      ↓
response
```

---

# 244. No Durable Workflow Engine Needed Yet

Read-only briefing does not justify:

```text
Temporal
Kafka
distributed worker cluster
```

---

# 245. First Durable Workflow Trigger

Durable execution becomes useful when we introduce something like:

```text
prepare action
→ wait for approval
→ execute later
→ verify
```

---

# 246. Strong First Durable Candidate

A future moderate-risk operation with:

```text
clear approval
clear idempotency
clear verification
reversible/compensatable effect
```

is better than payment as the first experiment.

---

# 247. Do Not Make R5 Money Movement the First Durable Mutation

Learn execution/recovery mechanics on lower-consequence workflows first.

---

# 248. Implementation Sequence

Recommended:

```text
1. execution/attempt contracts

2. read-only synchronous execution

3. verification contracts

4. operation IDs

5. idempotent mutation facade

6. UNKNOWN semantics

7. reconciliation

8. durable waits

9. Recovery Queue

10. compensation

11. distributed workers only if justified
```

---

# 249. Phase 1 Definition of Done

Read execution engine is ready when:

```text
steps are identifiable

attempts are traceable

tool results validate

verification is separate

partial failure works

receipts/evidence persist

workflow result is honest
```

---

# 250. First Mutation Definition of Done

Before first consequential mutation:

```text
operation ID stable

idempotency contract defined

retry classification defined

timeout behavior defined

postcondition defined

verification implemented

UNKNOWN represented

reconciliation implemented

permission/risk/approval enforced

execution receipt persisted
```

---

# 251. First Durable Wait Definition of Done

Before a workflow waits across processes:

```text
wait state durable

resume correlation stable

deadline explicit

workflow version preserved

approval/current state revalidated

duplicate resume safe
```

---

# 252. First Recovery Queue Definition of Done

Runtime can:

```text
detect unresolved execution

preserve evidence

classify recovery action

assign/escalate

resume/reconcile

record resolution
```

---

# 253. First Compensation Definition of Done

Before automated compensation:

```text
compensation is explicit capability

authority defined

risk defined

idempotency defined

verification defined

history preserved

failure escalation exists
```

---

# 254. Architectural Anti-Patterns

Prohibited:

```text
HTTP 200 = business success

timeout = failure

timeout = retry immediately

new idempotency key on every retry

same idempotency key with changed payload

worker crash = start workflow from beginning

cancel = undo everything

compensation = hidden rollback

provider receipt = verified business state

retry business-rule rejection

approval remains valid forever

resume old plan without revalidation

verification failure ignored because action "probably worked"

exactly-once claimed without supporting architecture

global transaction assumed across independent providers
```

---

# 255. Relationship to Core Runtime

Core owns request/workflow coordination.

This architecture defines deeper semantics of:

```text
execution
verification
recovery
```

---

# 256. Relationship to Tool Architecture

Tool contract declares:

```text
mutation

idempotency characteristics

retry semantics

verification policy

provider behavior
```

Execution Engine consumes those semantics.

---

# 257. Relationship to Skill Architecture

Skill defines:

```text
procedure
failure behavior
required verification
```

Execution runtime performs governed steps.

---

# 258. Relationship to Agents

Agent can propose execution.

It does not control retry/idempotency semantics.

---

# 259. Relationship to Event Architecture

Events may:

```text
start
resume
reconcile
```

workflow execution.

Event redelivery must not duplicate effects.

---

# 260. Relationship to Approval

Approval creates authorization context for a bounded future action.

After wait:

```text
approval + state
```

must still be valid.

---

# 261. Relationship to Risk

Higher-risk effects require:

```text
stronger verification

stronger recovery

tighter retry

better evidence
```

---

# 262. Relationship to Autonomy

L4 execution is only trustworthy if recovery mechanics are mature.

Autonomy without recovery is fragile automation.

---

# 263. Relationship to Evidence

Execution receipt and verification evidence together support claims about outcome.

---

# 264. Relationship to MGBOS

MGBOS owns:

```text
business command integrity

transaction atomicity

state-machine validity

business idempotency where implemented

reversal semantics
```

JARVIS owns:

```text
cross-system orchestration

execution attempts

verification coordination

distributed recovery
```

---

# 265. Relationship to n8n

n8n MAY execute:

```text
wait
retry
schedule
callback routing
```

but MUST preserve JARVIS/MGBOS execution semantics.

It is not allowed to improvise duplicate business side effects.

---

# 266. Relationship to Provider Adapters

Adapters normalize:

```text
timeout

rejection

provider receipt

provider ID
```

so recovery logic does not depend on provider-specific error text.

---

# 267. Current State Declaration

As of 2026-09-29:

```text
Execution / Recovery Architecture
ACTIVE specification

JARVIS Execution Runtime
NOT IMPLEMENTED

JARVIS Durable Workflow Runtime
NOT IMPLEMENTED

JARVIS Recovery Queue
NOT IMPLEMENTED

JARVIS Reconciliation Runtime
NOT IMPLEMENTED

JARVIS Compensation Runtime
NOT IMPLEMENTED

Morning Briefing
FIRST SYNCHRONOUS READ-ONLY TARGET

MGBOS critical-command boundary
CURRENT

MGBOS outbox
TARGET WHEN REAL CONSUMER EXISTS
```

---

# 268. Architectural Invariants

1. Execution attempt is not verified outcome.
2. Provider acceptance is not automatically business success.
3. UNKNOWN is a first-class outcome.
4. UNKNOWN is neither success nor failure.
5. Consequential mutations require defined postconditions.
6. Verification is claim-specific.
7. Current authoritative state should be re-read where required.
8. Idempotency keys remain stable across retries of the same logical operation.
9. Same idempotency key with materially different payload is a conflict.
10. Retry safety comes from capability/provider semantics, not model intuition.
11. Post-dispatch timeout may require reconciliation before retry.
12. Infinite retry is prohibited.
13. Worker crash does not justify blind restart.
14. Durable workflows persist state across process lifetime.
15. Resume must revalidate current authority and business state.
16. Approval may become stale.
17. Plan assumptions may become stale.
18. Cancellation stops future work; it does not erase completed effects.
19. Rollback, reversal, compensation, and cleanup remain distinct.
20. Compensation is an explicit governed action.
21. Compensation can fail.
22. Partial completion is represented honestly.
23. Auxiliary failure does not automatically invalidate a successful primary transaction.
24. MGBOS retains ownership of MGBOS transaction integrity.
25. JARVIS does not implement distributed global database transactions.
26. Cross-system exactly-once is not assumed.
27. Effective-once effects rely on idempotency, dedupe, verification, and reconciliation.
28. Recovery state is observable.
29. Kill switches prevent future execution but do not rewrite history.
30. Verification degradation may reduce autonomy.
31. High-risk automation requires stronger recovery mechanics.
32. Execution history remains traceable.
33. Recovery actions themselves pass governance.
34. First JARVIS runtime does not require durable orchestration.
35. Complexity is introduced only when real workflows require it.

---

# 269. Canonical Mental Model

```text
                AUTHORIZED PLAN
                      │
                      ▼
                OPERATION ID
                      │
                      ▼
                  ATTEMPT
                      │
          ┌───────────┴────────────┐
          │                        │
     KNOWN FAILURE             DISPATCHED
                                   │
                                   ▼
                                RECEIPT
                                   │
                                   ▼
                             VERIFICATION
                          ┌────────┼────────┐
                          ▼        ▼        ▼
                       SUCCESS   FAILURE  UNKNOWN
                                           │
                                           ▼
                                      RECONCILE
                                   ┌───────┼───────┐
                                   ▼       ▼       ▼
                                SUCCESS  FAILURE  HUMAN
```

Across the lifecycle:

```text
IDEMPOTENCY
PERSISTENCE
EVIDENCE
OBSERVABILITY
RECOVERY
GOVERNANCE
```

---

# 270. Founder-by-Exception Recovery Model

Mature runtime should aim for:

```text
NORMAL EXECUTION
→ automatic verification

TRANSIENT FAILURE
→ automatic safe retry

UNCERTAIN OUTCOME
→ automatic reconciliation

KNOWN RECOVERABLE ISSUE
→ automatic recovery

MATERIAL UNRESOLVED CASE
→ founder / process owner
```

Founder receives only the cases where judgment is actually needed.

---

# 271. North Star

Before retrying, resuming, compensating, or declaring success, JARVIS should be able to answer:

```text
What exactly was intended?

Was the operation dispatched?

Which logical operation ID was used?

Which attempt is this?

Which idempotency key?

Could the side effect already have happened?

What did the provider actually confirm?

What postcondition defines success?

Was it verified?

What evidence supports that?

If outcome is unknown, can I reconcile?

Is retry safe?

Has state changed since the plan/approval?

Can this effect actually be undone?

Would reversal or compensation be required?

What happens if recovery also fails?

Does a human actually need to see this?
```

---

# 272. Final Principle

> **Reliable automation is not automation that never fails. It is automation that knows exactly what to do when failure, ambiguity, duplication, timeout, and partial completion inevitably occur.**

The dangerous system is:

```text
TRY
 ↓
timeout
 ↓
TRY AGAIN
 ↓
probably success
```

The trustworthy system is:

```text
PLAN
  ↓
AUTHORIZE
  ↓
EXECUTE
  ↓
OBSERVE
  ↓
VERIFY
  ↓
RECONCILE IF UNCERTAIN
  ↓
RECOVER SAFELY
  ↓
ESCALATE ONLY WHEN NEEDED
```

That is the execution foundation required before JARVIS deserves meaningful autonomous authority.