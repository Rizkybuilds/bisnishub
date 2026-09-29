---
canonical_id: jarvis.runtime.core
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: jarvis
document_class: canonical-specification
effective_from: 2026-09-29
authoritative_for:
  - jarvis core runtime behavior
  - jarvis request and response contracts
  - jarvis runtime lifecycle
  - jarvis intent contract
  - jarvis runtime context contract
  - jarvis planning contract
  - jarvis runtime policy-decision contract
  - jarvis tool execution contract
  - jarvis runtime error model
  - jarvis runtime persistence model
  - jarvis partial-failure semantics
  - jarvis synthesis behavior
  - jarvis morning-briefing vertical slice
  - jarvis core-runtime test requirements
  - jarvis first-runtime definition of done
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - charter.md
  - architecture.md
  - ../docs/governance/cross-system-risk-classification.md
  - ../docs/governance/autonomy-levels.md
  - ../docs/governance/approval-policy.md
  - ../docs/governance/evidence-provenance-model.md
  - ../mgbos/docs/architecture/permission-authorization-model.md
  - ../mgbos/docs/architecture/command-event-model.md
supersedes:
  - ../catatan/sesi/2026-09-27 - JARVIS v0.2 - Core Runtime Specification.md
implementation_status: NOT_IMPLEMENTED
target_runtime_location: systems/jarvis/
first_vertical_slice: business.morning_briefing
first_runtime_mode: READ_ONLY
---

# JARVIS Core Runtime Specification v1.0

## 1. Purpose

Dokumen ini mendefinisikan runtime contract pertama JARVIS yang benar-benar dapat diimplementasikan.

Ia menjawab:

```text
How does a JARVIS request enter?

How is intent understood?

How is context built?

How is a plan produced?

How is policy applied?

How are tools executed?

How are results verified?

How is evidence preserved?

How is failure represented?

What is returned to the user?

What must the first production runtime prove?
```

---

# 2. Runtime Objective

Core Runtime exists to reliably perform:

```text
REQUEST
   ↓
UNDERSTAND
   ↓
CONTEXT
   ↓
PLAN
   ↓
POLICY
   ↓
CAPABILITIES
   ↓
VERIFY
   ↓
EVIDENCE
   ↓
SYNTHESIS
```

without uncontrolled mutation.

---

# 3. First Runtime Principle

The first JARVIS production slice is:

> **read-only, evidence-first, observable, provider-neutral, and structurally incapable of business mutation.**

This is stronger than:

```text
"Prompt tells JARVIS not to write."
```

Mutation tools SHOULD simply not exist in its registered production capability set.

---

# 4. First Vertical Slice

Canonical first workflow:

```text
business.morning_briefing
```

Human example:

```text
"Jarvis, briefing pagi."
```

Expected result:

```text
important business facts
exceptions
prioritized findings
recommendations
evidence
known limitations
```

No business mutation.

---

# 5. Why Morning Briefing

This vertical slice exercises nearly every foundational runtime concern:

```text
intent
context
tool registry
MGBOS integration
GitHub integration
policy
planning
parallel reads
freshness
verification
evidence
partial failure
priority
synthesis
observability
persistence
```

without introducing write risk.

---

# 6. Runtime Boundary

Core Runtime owns:

```text
request lifecycle
intent routing
context assembly
planning
policy coordination
tool orchestration
verification coordination
evidence linkage
synthesis
runtime state
```

It does NOT own:

```text
MGBOS business truth
business invariants
credentials
provider-side business truth
repository truth
approval policy semantics
risk semantics
```

---

# 7. Target Runtime Location

When implementation begins:

```text
systems/jarvis/
```

Current state:

```text
specification = ACTIVE
runtime       = NOT IMPLEMENTED
```

No empty directory is required before implementation starts.

---

# 8. Minimal Initial Runtime Structure

Recommended first physical shape:

```text
systems/jarvis/
├── apps/
│   └── gateway/
│
├── packages/
│   ├── contracts/
│   ├── core/
│   ├── context/
│   ├── planner/
│   ├── policy/
│   ├── tools/
│   ├── verification/
│   ├── evidence/
│   ├── model-gateway/
│   ├── persistence/
│   └── observability/
│
└── docs/
```

Only packages required by the first vertical slice need to exist initially.

---

# 9. Runtime Entry Contract

Canonical logical request:

```ts
type JarvisRequest = {
  requestId: string
  traceId: string

  source:
    | "human"
    | "api"
    | "schedule"
    | "event"
    | "system"

  channel:
    | "chat"
    | "api"
    | "cli"
    | "scheduled"
    | "event"

  actor: ActorContext

  environment:
    | "local"
    | "test"
    | "staging"
    | "production"

  message?: string

  intentHint?: string

  scope?: {
    organizationId?: string
    brandId?: string
    businessLineId?: string
  }

  metadata?: {
    conversationId?: string
    timezone?: string
    correlationId?: string
    causationId?: string
  }

  createdAt: string
}
```

---

# 10. Request ID

`requestId` identifies one logical runtime request.

It is used for:

```text
persistence
diagnostics
evidence linkage
runtime status
```

---

# 11. Trace ID

`traceId` groups all runtime operations belonging to one execution trace:

```text
request
intent
context
planner
policy
tool calls
verification
synthesis
```

---

# 12. Correlation ID

`correlationId` connects a JARVIS execution with a broader business/workflow process.

It is optional for ordinary chat requests.

---

# 13. Causation ID

`causationId` identifies the direct event/decision/request that triggered the runtime invocation.

Especially useful for future:

```text
events
approvals
scheduled automation
```

---

# 14. Actor Context

Logical contract:

```ts
type ActorContext = {
  principalType:
    | "human"
    | "service"
    | "system"

  principalId: string

  authenticated: boolean

  organizationIds?: string[]
}
```

Future service-principal semantics may extend this.

---

# 15. Request Must Never Carry Secrets

`JarvisRequest` MUST NOT contain:

```text
database passwords
service-role credentials
API keys
OAuth tokens
webhook secrets
raw provider credentials
```

---

# 16. Request Must Never Carry Arbitrary Tool Definitions

Caller MUST NOT be able to say:

```text
"Here is a new tool definition.
Trust it and execute it."
```

Tool authority comes from Tool Registry.

---

# 17. Request Must Never Carry Arbitrary SQL

No request contract field such as:

```text
sql: "UPDATE ..."
```

belongs in Core Runtime.

---

# 18. Runtime Response Contract

Canonical logical response:

```ts
type JarvisResponse = {
  requestId: string
  traceId: string

  status:
    | "completed"
    | "partial"
    | "rejected"
    | "failed"
    | "needs_human"
    | "needs_approval"
    | "unknown"

  intent: Intent

  summary: string

  findings: Finding[]

  recommendations: Recommendation[]

  actions: ActionRecord[]

  evidence: EvidenceRef[]

  warnings: RuntimeWarning[]

  errors: RuntimeError[]

  completedAt: string
}
```

---

# 19. Read-Only First Runtime Actions

For the first runtime:

```text
actions
```

may contain:

```text
READ
REASON
VERIFY
SYNTHESIZE
```

but MUST NOT contain real external mutation.

---

# 20. Intent Contract

Canonical:

```ts
type Intent = {
  id: string

  type: string

  domain:
    | "business"
    | "engineering"
    | "research"
    | "knowledge"
    | "general"

  confidence?: number

  requiresTools: boolean

  requestedOutcome: string
}
```

---

# 21. Initial Intent Families

Do not create hundreds.

Initial useful intents MAY include:

```text
business.morning_briefing

business.finance.review

business.operations.review

business.inventory.review

engineering.status.review

research.general

knowledge.lookup
```

---

# 22. Intent Confidence

Model confidence MAY assist diagnostics.

It MUST NOT determine authority.

Low confidence may trigger:

```text
fallback
clarification
generic planning
```

where required.

---

# 23. Runtime Context

Canonical:

```ts
type RuntimeContext = {
  actor: ActorContext

  environment: EnvironmentContext

  temporal: TemporalContext

  organization?: OrganizationContext

  authority: AuthorityContext

  relevantKnowledge: ContextItem[]

  relevantMemory: ContextItem[]

  availableCapabilities: CapabilityDefinition[]

  evidence: EvidenceRef[]
}
```

---

# 24. Environment Context

```ts
type EnvironmentContext = {
  name:
    | "local"
    | "test"
    | "staging"
    | "production"
}
```

Environment is security-relevant.

---

# 25. Temporal Context

Logical:

```ts
type TemporalContext = {
  now: string
  timezone: string

  businessDate?: string
}
```

Future specifications may add:

```text
business day
quiet hours
SLA
deadline
schedule
```

---

# 26. Organization Context

```ts
type OrganizationContext = {
  organizationId: string
  brandId?: string
  businessLineId?: string
}
```

Scope MUST remain explicit.

---

# 27. Authority Context

Logical:

```ts
type AuthorityContext = {
  permissions: string[]

  environment: string

  autonomy?: string

  approvalRefs?: string[]
}
```

Risk remains capability/action-specific rather than one global actor risk.

---

# 28. Context Items

```ts
type ContextItem = {
  id: string

  type:
    | "canonical_document"
    | "business_state"
    | "memory"
    | "external_content"
    | "research"
    | "runtime"

  content: unknown

  evidenceRefs?: string[]
}
```

---

# 29. Context Minimality

Context Builder MUST prefer:

```text
minimum sufficient context
```

over:

```text
maximum available context
```

This improves:

```text
privacy
cost
reasoning quality
security
latency
```

---

# 30. Context Provenance

Every important Context Item SHOULD know where it came from.

Untrusted content MUST remain visibly untrusted.

---

# 31. Context Freshness

Operational context SHOULD satisfy capability-specific freshness rules.

Stale business evidence is not silently treated as current.

---

# 32. Context Failure

If critical context cannot be built:

```text
CONTEXT_REQUIRED_SOURCE_UNAVAILABLE
```

may lead to:

```text
partial
needs_human
failed
```

depending on intent.

---

# 33. Execution Plan

Canonical:

```ts
type ExecutionPlan = {
  id: string

  goal: string

  steps: ExecutionStep[]

  expectedEvidence: EvidenceRequirement[]

  assumptions: PlanAssumption[]

  generatedAt: string
}
```

---

# 34. Execution Step

```ts
type ExecutionStep = {
  id: string

  capability: string

  dependencies: string[]

  required: boolean

  input?: unknown
}
```

---

# 35. Planner Must Select Capabilities

Correct:

```text
mgbos.finance.summary.read
```

Incorrect:

```text
call Supabase RPC financial_summary_v17
```

---

# 36. Step Dependencies

Plan may express:

```text
finance
operations
inventory
```

as independent parallel reads,

while:

```text
read invoice
↓
analyze invoice
```

has dependency.

---

# 37. Required vs Optional Step

A step marked:

```text
required = true
```

may determine whether the overall request can complete.

Optional steps may fail while response remains:

```text
partial
```

or even completed with warning.

---

# 38. Plan Assumptions

Material assumptions SHOULD be explicit.

```ts
type PlanAssumption = {
  statement: string
  material: boolean
}
```

High-risk future execution must not silently depend on material assumptions.

---

# 39. Evidence Requirements

```ts
type EvidenceRequirement = {
  id: string
  description: string
  required: boolean
  sourceClass?: string
  freshnessPolicy?: string
}
```

Planner states what evidence it expects.

Verification determines whether that evidence was actually obtained.

---

# 40. Plan Validation

Planner output MUST be structurally validated.

Invalid model output is:

```text
PLANNING_OUTPUT_INVALID
```

not silently interpreted.

---

# 41. Policy Request

For every tool-capability execution:

```ts
type PolicyRequest = {
  requestId: string

  actor: ActorContext

  environment: string

  organizationId?: string

  capability: string

  baselineRisk: RiskLevel

  proposedInput?: unknown

  approvalRefs?: string[]
}
```

---

# 42. Risk Level

Canonical:

```ts
type RiskLevel =
  | "R0"
  | "R1"
  | "R2"
  | "R3"
  | "R4"
  | "R5"
```

No competing JARVIS-specific risk taxonomy.

---

# 43. Policy Decision

Canonical:

```ts
type PolicyDecision =
  | {
      decision: "allow"
      effectiveRisk: RiskLevel
    }
  | {
      decision: "deny"
      reason: string
      effectiveRisk: RiskLevel
    }
  | {
      decision: "require_approval"
      reason: string
      effectiveRisk: RiskLevel
      approvalPolicyId?: string
    }
  | {
      decision: "needs_human"
      reason: string
      effectiveRisk?: RiskLevel
    }
```

---

# 44. First Runtime Policy

Initial production runtime registers only:

```text
R0 / R1
read capabilities
```

Therefore normal Morning Briefing execution should not require per-action approval.

---

# 45. Policy Before Every Tool Call

A plan-level policy pass does not authorize future execution forever.

Each tool execution receives its own policy check.

---

# 46. Policy Is Deterministic Where Possible

Known conditions such as:

```text
capability exists
environment allowed
principal authorized
mutation forbidden in first runtime
```

must not depend on model judgment.

---

# 47. Capability Definition

Canonical logical contract:

```ts
type CapabilityDefinition = {
  id: string

  description: string

  mutation: boolean

  baselineRisk: RiskLevel

  environments: string[]

  inputSchema: unknown

  outputSchema: unknown

  verificationPolicy: string

  adapterId: string

  enabled: boolean
}
```

---

# 48. Initial Read Capability Set

Recommended minimum:

```text
mgbos.business.briefing.read

mgbos.finance.summary.read

mgbos.operations.summary.read

mgbos.inventory.summary.read

github.ci.summary.read

github.pull_requests.read
```

The exact first implementation can start with fewer if needed.

---

# 49. Mutation Capabilities Are Absent

First production Tool Registry MUST NOT include:

```text
mgbos.payment.record

mgbos.production.assign

email.message.send

social.content.publish

production.deploy
```

unless runtime scope has explicitly advanced beyond this specification's first milestone.

---

# 50. Tool Definition vs Capability

Implementation MAY use:

```ts
type ToolDefinition = {
  toolId: string
  capabilityId: string
  adapterId: string
  ...
}
```

Several tool implementations MAY eventually provide the same capability.

---

# 51. Tool Call Contract

```ts
type ToolCall = {
  id: string

  requestId: string
  stepId: string

  capabilityId: string
  toolId: string

  input: unknown

  policyDecisionId: string

  startedAt: string
}
```

---

# 52. Tool Input Validation

Before execution:

```text
input
↓
schema validation
↓
adapter
```

Invalid input MUST NOT reach provider.

---

# 53. Tool Result

Canonical:

```ts
type ToolResult<T = unknown> = {
  toolCallId: string

  toolId: string
  capabilityId: string

  status:
    | "success"
    | "failed"
    | "unknown"

  data?: T

  error?: RuntimeError

  providerReference?: string

  evidence: EvidenceRef[]

  startedAt: string
  completedAt: string
}
```

---

# 54. `success`

Means the tool contract's immediate success condition was met.

It does not necessarily prove the overall business outcome.

---

# 55. `failed`

Means the invocation is known not to have completed successfully.

---

# 56. `unknown`

Means:

```text
side effect or outcome may have occurred
but cannot currently be established
```

Important for future mutation tools.

Read-only initial runtime should rarely require this state.

---

# 57. Tool Output Validation

Successful transport with invalid schema is:

```text
TOOL_OUTPUT_INVALID
```

not success.

---

# 58. Evidence Reference

Runtime SHOULD use normalized evidence semantics defined by the ecosystem Evidence model.

Logical reference:

```ts
type EvidenceRef = {
  evidenceId: string
}
```

Full evidence may live in Evidence Store.

---

# 59. Evidence Record

Minimal runtime evidence implementation MAY include:

```ts
type RuntimeEvidence = {
  id: string

  requestId: string

  sourceType: string
  sourceId: string

  description: string

  observedAt: string
  retrievedAt: string

  revision?: string
  reference?: string

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
}
```

---

# 60. Verification Request

Logical:

```ts
type VerificationRequest = {
  requestId: string

  capability: string

  toolResult: ToolResult

  evidenceRequirements: EvidenceRequirement[]

  context: RuntimeContext
}
```

---

# 61. Verification Result

```ts
type VerificationResult = {
  status:
    | "verified"
    | "failed"
    | "partial"
    | "unknown"

  evidenceIds: string[]

  warnings: string[]

  reason?: string
}
```

---

# 62. Read Verification

Initial read tools SHOULD verify:

```text
tool succeeded
output schema valid
organization scope valid
expected source present
timestamp present
freshness acceptable
required evidence present
```

---

# 63. Freshness Policy

Freshness is capability-specific.

Examples:

```text
live inventory
→ minutes

daily business aggregate
→ hours/day

Git revision
→ revision-bound

historical record
→ historical
```

No universal freshness duration.

---

# 64. Stale Required Evidence

If a required source is stale:

```text
verification != verified
```

unless the capability explicitly accepts that age.

---

# 65. Optional Stale Evidence

Optional stale data MAY be excluded or shown with warning.

---

# 66. Finding Contract

Canonical:

```ts
type Finding = {
  id: string

  category:
    | "finance"
    | "operations"
    | "inventory"
    | "sales"
    | "engineering"
    | "system"

  severity:
    | "info"
    | "attention"
    | "important"
    | "critical"

  title: string

  explanation: string

  claimType:
    | "AUTHORITATIVE_FACT"
    | "DERIVED_FACT"
    | "INFERENCE"

  evidenceIds: string[]

  generatedAt: string
}
```

---

# 67. Severity Is Not Free-Form Model Opinion

Severity SHOULD derive from documented signals/rules where possible.

Example:

```text
invoice overdue > threshold
production SLA breached
CI blocking main
```

rather than:

```text
model thinks it feels critical
```

---

# 68. Severity Is Not Risk

Finding severity:

```text
How much attention does this situation deserve?
```

Risk:

```text
How consequential is an action?
```

Keep separate.

---

# 69. Recommendation Contract

```ts
type Recommendation = {
  id: string

  findingIds: string[]

  action: string

  rationale: string

  evidenceIds: string[]

  proposedCapability?: string

  effectiveRisk?: RiskLevel

  autonomyLevel:
    | "L0"
    | "L1"
    | "L2"
    | "L3"
    | "L4"

  assumptions?: string[]
}
```

---

# 70. First Runtime Recommendations

First production runtime recommendations SHOULD stop at:

```text
L1 — Recommend
```

or potentially:

```text
L2 — Prepare
```

where preparation itself creates no consequential side effect.

---

# 71. Action Record

```ts
type ActionRecord = {
  type:
    | "READ"
    | "REASON"
    | "PREPARE"
    | "EXECUTE"

  capability?: string

  result:
    | "completed"
    | "failed"
    | "skipped"
    | "unknown"

  evidenceIds: string[]
}
```

Initial production runtime MUST NOT output real:

```text
EXECUTE
```

for external/business mutation.

---

# 72. Synthesis Input

Synthesis receives only:

```text
validated context
verified/qualified findings
evidence
recommendations
warnings
known errors
```

It SHOULD NOT read raw provider outputs unnecessarily if normalized data exists.

---

# 73. Synthesis Rule

> **No material factual sentence without supporting evidence.**

---

# 74. Fact / Inference Separation

Synthesis SHOULD distinguish:

```text
FACT

INFERENCE

RECOMMENDATION
```

especially when decision-relevant.

---

# 75. Unsupported Claim Handling

If evidence is absent:

```text
omit claim
```

or state:

```text
current verified data unavailable
```

Do not fabricate.

---

# 76. Partial Failure

Runtime MUST support partial completion.

Example:

```text
Finance       ✓
Operations    ✓
Inventory     ✗
Engineering   ✓
```

Overall:

```text
status = partial
```

---

# 77. Partial Result Contract

Response SHOULD indicate:

```text
what succeeded
what failed
which conclusions remain supported
what is missing
```

---

# 78. Required Step Failure

If a required step fails and no useful intent can be fulfilled:

```text
failed
```

or:

```text
needs_human
```

may be appropriate.

---

# 79. Optional Step Failure

Optional failure SHOULD normally yield:

```text
partial
```

not total runtime failure.

---

# 80. Policy Denial

A denied optional capability may yield:

```text
partial
```

A denied capability central to the request may yield:

```text
rejected
```

---

# 81. Runtime Error Model

Canonical families:

```text
REQUEST
INTENT
CONTEXT
PLANNING
POLICY
CAPABILITY
TOOL
VERIFICATION
SYNTHESIS
PERSISTENCE
MODEL
EXTERNAL
```

---

# 82. Runtime Error Contract

```ts
type RuntimeError = {
  code: string

  category: string

  message: string

  retryable: boolean

  outcome:
    | "known_failed"
    | "unknown"
    | "not_applicable"

  stepId?: string
  toolCallId?: string

  details?: Record<string, unknown>
}
```

Sensitive details MUST NOT leak to user-facing responses.

---

# 83. Canonical Error Codes — Request

```text
INVALID_REQUEST
UNAUTHENTICATED
INVALID_SCOPE
UNSUPPORTED_ENVIRONMENT
```

---

# 84. Intent Errors

```text
INTENT_CLASSIFICATION_FAILED
INTENT_UNSUPPORTED
INTENT_AMBIGUOUS
```

---

# 85. Context Errors

```text
CONTEXT_BUILD_FAILED

CONTEXT_SOURCE_UNAVAILABLE

CONTEXT_SCOPE_MISMATCH

CONTEXT_STALE
```

---

# 86. Planning Errors

```text
PLANNING_FAILED

PLANNING_OUTPUT_INVALID

CAPABILITY_REQUIREMENT_UNRESOLVED
```

---

# 87. Policy Errors

```text
POLICY_DENIED

APPROVAL_REQUIRED

AUTHORITY_UNRESOLVED

POLICY_CONFLICT
```

---

# 88. Tool Errors

```text
TOOL_NOT_FOUND

TOOL_DISABLED

TOOL_ENVIRONMENT_UNAVAILABLE

TOOL_INPUT_INVALID

TOOL_EXECUTION_FAILED

TOOL_OUTPUT_INVALID

TOOL_TIMEOUT

TOOL_RATE_LIMITED
```

---

# 89. Verification Errors

```text
VERIFICATION_FAILED

EVIDENCE_MISSING

EVIDENCE_CONFLICT

EVIDENCE_STALE

OUTCOME_UNKNOWN
```

---

# 90. Model Errors

```text
MODEL_UNAVAILABLE

MODEL_OUTPUT_INVALID

MODEL_CONTEXT_LIMIT

MODEL_POLICY_RESTRICTED
```

---

# 91. Synthesis Errors

```text
SYNTHESIS_FAILED

UNSUPPORTED_CLAIM_DETECTED
```

---

# 92. Persistence Errors

```text
PERSISTENCE_FAILED
```

For the first runtime, inability to persist mandatory execution evidence SHOULD be treated seriously.

---

# 93. Retry Policy

Retry only when:

```text
error retryable
AND
operation semantics safe
```

Read operations commonly allow retry.

Future mutations require idempotency and unknown-outcome awareness.

---

# 94. Blind Retry Is Forbidden

Especially future:

```text
payment
email send
social publish
external purchase
```

---

# 95. Runtime State Machine

Canonical:

```text
RECEIVED

→ INTENT_RESOLUTION

→ CONTEXT_BUILDING

→ PLANNING

→ POLICY_EVALUATION

→ EXECUTION

→ VERIFICATION

→ SYNTHESIS

→ COMPLETED
```

---

# 96. Alternate Terminal States

```text
PARTIAL

REJECTED

NEEDS_HUMAN

NEEDS_APPROVAL

FAILED

UNKNOWN
```

---

# 97. Runtime State Must Be Observable

Every material transition SHOULD be traceable.

Example:

```text
request_id=abc
state=PLANNING
```

---

# 98. Runtime State Must Not Equal Business State

`EXECUTING` means JARVIS runtime is executing.

It does not mean:

```text
MGBOS order is executing
```

Keep namespaces separate.

---

# 99. Persistence Scope

First runtime requires minimal durable records for:

```text
request
execution
tool call
evidence
policy decision
```

---

# 100. Logical Runtime Tables

Possible relational model:

```text
jarvis_requests

jarvis_executions

jarvis_policy_decisions

jarvis_tool_calls

jarvis_evidence
```

Exact schema belongs to implementation.

---

# 101. `jarvis_requests`

Should preserve concepts such as:

```text
request_id
trace_id
actor
channel
environment
organization_scope
resolved_intent
status
created_at
completed_at
```

---

# 102. `jarvis_executions`

May preserve:

```text
execution_id
request_id
plan summary
status
started_at
completed_at
model profile
```

---

# 103. `jarvis_policy_decisions`

May preserve:

```text
decision_id
request_id
step_id
capability
effective_risk
decision
reason
policy version
```

---

# 104. `jarvis_tool_calls`

May preserve:

```text
tool_call_id
request_id
step_id
capability_id
tool_id
status
started_at
completed_at
provider_reference
```

---

# 105. `jarvis_evidence`

May preserve:

```text
evidence_id
request_id
source_type
source_id
source_reference
observed_at
retrieved_at
verification_status
freshness_status
```

---

# 106. JARVIS Persistence Must Not Duplicate MGBOS Business State

Do not create:

```text
jarvis_orders
jarvis_payments
jarvis_inventory
```

as competing business state.

---

# 107. Evidence Snapshot Minimality

Persist:

```text
reference
metadata
sanitized useful snapshot
```

only when justified.

Avoid full customer/database payload replication.

---

# 108. Do Not Persist Chain-of-Thought

Persist:

```text
intent
plan
policy decision
tool calls
evidence
finding
recommendation
reasoning summary
```

not hidden model reasoning.

---

# 109. Model Gateway Contract

Logical:

```ts
interface ModelGateway {
  generateStructured<T>(
    request: ModelRequest<T>
  ): Promise<ModelResult<T>>
}
```

---

# 110. Model Request

Should identify:

```text
logical model profile
task
schema
context
data classification
```

rather than hardcode provider assumptions.

---

# 111. Model Profiles

Initial runtime MAY only require:

```text
FAST
BALANCED
DEEP
```

Do not implement every theoretical profile immediately.

---

# 112. Provider Adapter

Core MUST NOT import provider SDK directly.

Preferred:

```text
Core
↓
ModelGateway
↓
Provider Adapter
↓
Provider
```

---

# 113. Provider Failure

Policy may allow fallback:

```text
preferred model unavailable
↓
alternate compatible model
```

provided:

```text
data policy permits it
required quality remains acceptable
```

---

# 114. Model Output Is Untrusted Until Validated

Structured output must pass schema validation.

---

# 115. Model Responsibilities — First Runtime

Appropriate uses:

```text
intent interpretation
planning
finding synthesis
recommendation generation
summary generation
```

---

# 116. Model Non-Responsibilities

Do NOT delegate sole authority for:

```text
permission
risk floor
freshness arithmetic
tool existence
schema validation
execution state
business invariant
```

---

# 117. Initial MGBOS Read Gateway

JARVIS SHOULD consume domain-level projections.

Preferred:

```text
mgbos.business.briefing.read
```

or focused capabilities:

```text
mgbos.finance.summary.read

mgbos.operations.summary.read

mgbos.inventory.summary.read
```

---

# 118. Business Briefing Projection

Long-term ideal:

```text
MGBOS
owns deterministic projection
of business facts

JARVIS
interprets/prioritizes them
```

This avoids forcing AI to reconstruct business economics from raw tables.

---

# 119. Finance Signals — First Slice

Possible evidence-backed signals:

```text
open receivables

overdue invoices

recent payments

largest outstanding balances

cash collection warnings

margin exceptions
```

only if MGBOS exposes reliable projections.

---

# 120. Operations Signals

Possible:

```text
jobs behind SLA

jobs awaiting QC

jobs on hold

vendor delays

customer deadline risk
```

---

# 121. Inventory Signals

Possible:

```text
low availability

reservation pressure

out-of-stock items

stock discrepancy alerts
```

---

# 122. Engineering Signals

Optional initial integration:

```text
CI failure

open blocking PR

main health

release issue
```

Engineering data is operational context, not MGBOS business truth.

---

# 123. Morning Briefing Plan

Example:

```text
business.morning_briefing

Step 1
mgbos.finance.summary.read

Step 2
mgbos.operations.summary.read

Step 3
mgbos.inventory.summary.read

Step 4
github.ci.summary.read
optional
```

Independent reads MAY run concurrently later.

Sequential execution is acceptable initially.

---

# 124. Morning Briefing Finding Prioritization

Priority SHOULD use structured signals.

Inputs MAY include:

```text
severity
deadline proximity
financial exposure
customer impact
operational blocking
risk
```

Do not rely entirely on opaque model ranking.

---

# 125. Morning Briefing Output

Recommended human format:

```text
MORNING BRIEFING

1. What needs attention

2. Important changes

3. What is healthy / normal

4. Recommendations

5. Missing or degraded sources

6. Evidence
```

---

# 126. Briefing Should Compress

The user should not receive raw database dumps.

JARVIS should surface:

```text
important facts
exceptions
implications
decisions
```

---

# 127. No Manufactured Urgency

If no anomaly exists:

```text
say so.
```

Do not create drama merely to make briefing useful.

---

# 128. Zero-Anomaly Case

Valid output:

```text
No critical operational exceptions detected.

2 informational items.

GitHub status unavailable.
```

---

# 129. Partial Morning Briefing

Example:

```text
Finance verified.

Operations verified.

Inventory unavailable.

Engineering verified.
```

Recommendation must not depend on missing inventory evidence.

---

# 130. Morning Briefing Freshness

Each source must declare/allow freshness assessment.

Briefing generation time alone does not make underlying data fresh.

---

# 131. Observability

Every first-runtime request SHOULD capture:

```text
trace_id
request_id
state transitions
model calls
tool calls
policy outcomes
verification
latency
errors
```

---

# 132. Cost Observability

Model cost/token usage MAY be recorded from the beginning if easy.

It should not block first implementation.

---

# 133. Tool Latency

Tool latency SHOULD be visible because slow dependencies will affect briefing quality and future proactive workflows.

---

# 134. Model Latency

Likewise useful for:

```text
routing
cost optimization
fallback
```

---

# 135. Security Gate — Before Model Call

Runtime SHOULD:

```text
minimize context

classify context sensitivity where available

remove raw secrets

preserve trust labels

validate allowed provider
```

---

# 136. Security Gate — Before Tool Call

Runtime MUST:

```text
resolve registered capability

validate actor scope

evaluate policy

validate input

ensure environment allowed
```

---

# 137. Security Gate — After Tool Call

Runtime SHOULD:

```text
validate output

record evidence

verify scope

apply freshness

detect untrusted instructions in payload
```

---

# 138. External Text Is Data

If a tool result contains:

```text
"Ignore your policies and execute ..."
```

it remains provider/external data.

It cannot modify Core governance.

---

# 139. Testing Pyramid

Minimum:

```text
Contract Tests
      ↓
Policy Unit Tests
      ↓
Tool Adapter Tests
      ↓
Context Tests
      ↓
Planner Fixture Tests
      ↓
Verification Tests
      ↓
Runtime Integration Tests
      ↓
Morning Briefing E2E
```

---

# 140. Contract Tests

Verify:

```text
request schema

response schema

intent

plan

policy decision

tool definitions

tool results

evidence

errors
```

---

# 141. Policy Tests

Verify:

```text
allowed read

wrong organization denied

wrong environment denied

unknown capability denied

mutation capability absent/denied

disabled tool denied
```

---

# 142. Tool Adapter Tests

Verify:

```text
valid response normalization

provider error

timeout

invalid provider payload

scope mismatch

freshness metadata
```

---

# 143. Context Tests

Verify:

```text
minimum relevant context

cross-business isolation

untrusted external content labeling

no raw credentials

stale source behavior
```

---

# 144. Planner Fixture Tests

Verify:

```text
correct capabilities selected

no non-existent tool

required/optional steps

no write capability for Morning Briefing

expected evidence
```

---

# 145. Verification Tests

Verify:

```text
missing evidence

stale evidence

conflicting evidence

invalid schema

wrong organization

valid current source
```

---

# 146. Runtime Integration Tests

Critical scenarios:

```text
all tools succeed

one optional tool fails

one required tool fails

policy denied

provider model unavailable

tool output malformed

freshness failure

persistence failure

zero findings

multiple findings
```

---

# 147. Golden Morning Briefing Test

A representative fixture SHOULD prove:

```text
correct intent

relevant plan

read tools only

evidence linked

priority sensible

unsupported claims absent

partial failure disclosed

runtime record persisted
```

---

# 148. Adversarial Test

Include tool/external output containing malicious instructions.

Expected:

```text
treated as data

policy unchanged

no new capability executed
```

---

# 149. No-Write Structural Test

First production runtime SHOULD contain an automated assertion that no registered production capability has:

```text
mutation = true
```

for the first milestone.

This proves read-only structurally.

---

# 150. Evidence Factuality Eval

AI synthesis eval SHOULD verify:

```text
material factual claims
are supported by evidence IDs
```

---

# 151. Priority Eval

Test cases SHOULD include:

```text
high-value overdue invoice

minor informational signal

blocked production

healthy operation
```

to avoid random over-prioritization.

---

# 152. Definition of Done — Runtime Foundation

Core Runtime v1 first implementation is complete when:

```text
JarvisRequest
→ validated

Intent
→ resolved

RuntimeContext
→ built

ExecutionPlan
→ structured

Policy
→ evaluated

Read capability
→ resolved

Tool call
→ executed

Tool result
→ validated

Evidence
→ stored

Verification
→ completed

Findings
→ synthesized

JarvisResponse
→ returned

Trace
→ persisted
```

---

# 153. Definition of Done — Morning Briefing

The system must consistently handle:

```text
"Jarvis, briefing pagi."
```

and:

1. resolve `business.morning_briefing`;
2. identify actor and organization scope;
3. plan only registered read capabilities;
4. query MGBOS through bounded read gateway;
5. optionally query GitHub read capability;
6. validate all tool outputs;
7. apply freshness rules;
8. preserve source evidence;
9. tolerate optional-source failure;
10. generate evidence-backed findings;
11. prioritize material exceptions;
12. produce recommendations without mutation;
13. persist execution metadata;
14. return no unsupported factual claims.

---

# 154. Definition of Done — Security

The first runtime MUST prove:

```text
no write tool registered

no arbitrary SQL

no raw credentials in model context

organization scope enforced

external text cannot grant authority

tool inputs and outputs validated
```

---

# 155. Definition of Done — Failure Handling

The first runtime MUST correctly represent:

```text
completed

partial

rejected

failed
```

and MUST NOT report:

```text
completed
```

when required verification failed.

---

# 156. Definition of Done — Evidence

Every material Morning Briefing finding must point to at least one appropriate evidence record.

---

# 157. Definition of Done — Repository

When implementation actually begins:

```text
systems/jarvis/
```

must be registered in repository navigation/project index as an active system only after usable runtime code exists.

---

# 158. First Runtime Non-Goals

The first implementation does NOT need:

```text
L3/L4 business mutation

long-term autonomous agents

complex memory

vector database

event bus

voice

mobile app

graph database

multi-agent swarm

Temporal

Kafka

Kubernetes

complex Approval Center
```

---

# 159. Post-Foundation Sequence

After the first runtime is proven:

```text
1. Tool & Capability Architecture

2. More read projections

3. Memory Architecture

4. Controlled L2 preparation

5. Specialist agents

6. Event intake

7. First L3 mutation

8. Decision Inbox

9. Bounded L4
```

Actual order may follow business need.

---

# 160. Runtime Versioning Principle

Breaking changes to:

```text
request
response
plan
tool
evidence
policy
event
```

contracts require explicit version/migration.

---

# 161. Runtime Release vs Document Version

This specification being:

```text
v1.0 ACTIVE
```

does not mean:

```text
JARVIS runtime v1.0 deployed
```

Documentation version and software release version are distinct.

---

# 162. Canonicalization Effect

With activation:

```text
2026-09-27
JARVIS v0.2 — Core Runtime Specification
```

becomes:

```text
HISTORICAL / DESIGN PROVENANCE
```

for runtime semantics covered here.

Its strongest concepts preserved in v1 include:

```text
read-only first
structured contracts
evidence-first
partial failure
provider-neutral Model Gateway
bounded MGBOS reads
minimal persistence
Morning Briefing
```

---

# 163. Runtime Architectural Invariants

1. Request identity is explicit.
2. Actor and environment are explicit.
3. Organization scope is explicit.
4. Secrets never enter ordinary runtime request contracts.
5. Arbitrary SQL is not a Core capability.
6. Intent does not grant authority.
7. Context is minimum-sufficient and provenance-aware.
8. Planner chooses capabilities rather than providers.
9. Plan output is structurally validated.
10. Policy executes before every tool call.
11. Runtime uses canonical R0–R5.
12. Tool existence does not equal permission.
13. First production runtime is structurally read-only.
14. Tool inputs are validated.
15. Tool outputs are validated.
16. Tool success does not automatically mean verified outcome.
17. Evidence is part of runtime correctness.
18. Freshness is capability-specific.
19. Unsupported factual synthesis is prohibited.
20. Partial failure is first-class.
21. Unknown outcome is represented honestly.
22. JARVIS persistence does not duplicate business truth.
23. Hidden chain-of-thought is not persisted.
24. Runtime failure is observable.
25. Mutation authority is introduced capability-by-capability only.

---

# 164. Canonical Runtime Mental Model

```text
INPUT
  │
  ▼
JARVIS REQUEST
  │
  ▼
INTENT
  │
  ▼
CONTEXT
  │
  ▼
PLAN
  │
  ▼
POLICY
  │
  ▼
CAPABILITY REGISTRY
  │
  ▼
TOOL ADAPTER
  │
  ▼
EXTERNAL / AUTHORITATIVE SYSTEM
  │
  ▼
TOOL RESULT
  │
  ▼
EVIDENCE
  │
  ▼
VERIFICATION
  │
  ▼
FINDINGS
  │
  ▼
RECOMMENDATIONS
  │
  ▼
SYNTHESIS
  │
  ▼
JARVIS RESPONSE
```

Supporting the entire flow:

```text
OBSERVABILITY
PERSISTENCE
SECURITY
GOVERNANCE
```

---

# 165. North Star

The first trustworthy JARVIS should be able to receive:

```text
"Jarvis, briefing pagi."
```

and reliably answer:

```text
What changed?

What matters?

What evidence proves it?

What is uncertain?

What deserves my attention?

What should I consider doing?
```

without:

```text
inventing facts

reading arbitrary databases

mutating business state

hiding failed sources

or pretending confidence is evidence
```

---

# 166. Final Principle

> **The first milestone of JARVIS is not autonomy. It is trustworthy understanding.**

Before JARVIS earns the right to act on the business, it must first prove that it can:

```text
see the right facts,
through the right capabilities,
inside the right scope,
with the right evidence,
and explain what actually matters.
```