---
canonical_id: jarvis.architecture.tool-capability
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: jarvis
document_class: canonical-specification
effective_from: 2026-09-29
authoritative_for:
  - jarvis capability semantics
  - jarvis capability namespace
  - jarvis tool semantics
  - jarvis tool registry
  - jarvis adapter boundary
  - jarvis provider replacement
  - jarvis tool lifecycle
  - jarvis tool health
  - jarvis tool availability
  - jarvis tool schema contracts
  - jarvis tool verification requirements
  - jarvis tool risk metadata
  - jarvis tool credential boundary
  - jarvis tool selection and resolution
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - ../charter.md
  - ../architecture.md
  - ../core-runtime.md
  - ../../../../docs/governance/cross-system-risk-classification.md
  - ../../../../docs/governance/autonomy-levels.md
  - ../../../../docs/governance/approval-policy.md
  - ../../../../docs/governance/evidence-provenance-model.md
  - ../../../mgbos/docs/architecture/permission-authorization-model.md
  - ../../../mgbos/docs/architecture/command-event-model.md
supersedes: null
implementation_status: NOT_IMPLEMENTED
target_runtime_location: systems/jarvis/
---

# JARVIS Tool & Capability Architecture v1.0

## 1. Purpose

Dokumen ini mendefinisikan bagaimana JARVIS memperoleh kemampuan untuk:

```text
READ
SEARCH
ANALYZE
PREPARE
EXECUTE
VERIFY
```

sesuatu di luar reasoning runtime-nya.

Ia menjawab:

```text
What can JARVIS logically do?

Which implementation performs it?

Which system/provider owns the operation?

Which input/output contract applies?

What risk does it carry?

Can it mutate the world?

Which environment supports it?

How is success verified?

Where are credentials kept?

What happens if the provider fails?

How can an implementation be replaced?
```

---

# 2. Fundamental Principle

> **JARVIS reasons in capabilities, not provider APIs.**

Planner SHOULD think:

```text
mgbos.invoice.read
```

not:

```text
call Supabase RPC xyz()
```

And:

```text
email.message.send
```

not:

```text
POST /v3/messages
to provider X
```

---

# 3. Core Separation

Canonical hierarchy:

```text
CAPABILITY
    ↓
TOOL
    ↓
ADAPTER
    ↓
PROVIDER / SYSTEM
    ↓
CREDENTIAL BOUNDARY
```

These MUST remain separate concepts.

---

# 4. Capability

A Capability describes:

> **what JARVIS wants to accomplish against the outside world.**

Examples:

```text
mgbos.invoice.read

mgbos.payment.record

github.pull_request.read

email.message.send

calendar.event.create
```

Capability expresses business/operational semantics.

---

# 5. Tool

A Tool is:

> **a registered executable implementation of one or more capabilities.**

Example:

```text
Capability
mgbos.invoice.read

Tool
mgbos-internal-api.invoice-read.v1
```

---

# 6. Adapter

An Adapter translates between:

```text
JARVIS canonical contract
        ↕
provider/system-specific contract
```

Adapter owns implementation-specific transformation.

---

# 7. Provider

Provider is the external or authoritative system actually performing/providing the operation.

Examples:

```text
MGBOS

GitHub

email provider

calendar provider

payment provider

browser/research service
```

---

# 8. Credential Boundary

Credential Boundary supplies authentication material to adapters/providers.

JARVIS reasoning layer does NOT need raw credentials.

---

# 9. Capability ≠ Tool

This distinction is foundational.

```text
Capability:
email.message.send

Tool A:
gmail-send-adapter

Tool B:
resend-send-adapter

Tool C:
microsoft-graph-send-adapter
```

The capability can remain stable while implementation changes.

---

# 10. Tool ≠ Provider

A tool may wrap:

```text
one provider
multiple provider APIs
an internal gateway
an MCP server
```

Provider identity is implementation metadata.

---

# 11. Adapter ≠ Capability

Adapter may change while capability semantics remain stable.

This prevents provider migration from contaminating reasoning contracts.

---

# 12. Capability Namespace

Canonical naming format:

```text
<system-or-domain>.<resource>.<action>
```

Examples:

```text
mgbos.invoice.read

mgbos.payment.record

github.repository.read

github.pull_request.read

email.message.send

calendar.event.create
```

---

# 13. Capability Names Describe Semantics

Good:

```text
mgbos.inventory.reserve
```

Bad:

```text
supabase_inventory_rpc
```

Good:

```text
email.message.send
```

Bad:

```text
gmail_api_post
```

---

# 14. Namespace Ownership

Namespaces SHOULD have clear owners.

Examples:

```text
mgbos.*
→ MGBOS contracts

github.*
→ GitHub integration boundary

email.*
→ messaging capability domain

calendar.*
→ calendar capability domain

research.*
→ external research capabilities
```

---

# 15. Capability Granularity

Capabilities SHOULD be narrow enough for permission governance.

Prefer:

```text
mgbos.payment.read

mgbos.payment.record

mgbos.payment.reverse
```

over:

```text
mgbos.payment.manage
```

---

# 16. Avoid Hyper-Granularity

Do not create:

```text
mgbos.invoice.read_id

mgbos.invoice.read_customer

mgbos.invoice.read_amount

mgbos.invoice.read_status
```

unless permissions/business semantics genuinely differ.

---

# 17. Read and Mutation Must Be Separate

Never combine:

```text
read + write
```

under one broad capability when they have different risk.

Correct:

```text
email.message.read

email.message.send
```

---

# 18. Prepare and Execute Should Be Separate Where Material

Future:

```text
procurement.purchase_order.prepare

procurement.purchase_order.issue
```

may have different risk/autonomy.

Likewise:

```text
content.post.prepare

content.post.publish
```

---

# 19. Query Capability

A read capability does not change authoritative external state.

Example:

```text
mgbos.finance.summary.read
```

Baseline risk often:

```text
R1
```

subject to data sensitivity.

---

# 20. Mutation Capability

A mutation capability intentionally changes external/authoritative state.

Example:

```text
mgbos.payment.record
```

It MUST declare:

```text
mutation = true
```

---

# 21. Capability Definition

Canonical logical contract:

```ts
type CapabilityDefinition = {
  id: string

  version: number

  description: string

  domain: string
  resource: string
  action: string

  mutation: boolean

  baselineRisk:
    | "R0"
    | "R1"
    | "R2"
    | "R3"
    | "R4"
    | "R5"

  supportedEnvironments: Environment[]

  inputSchemaId: string
  outputSchemaId: string

  verificationPolicyId: string

  idempotency?: {
    required: boolean
  }

  enabled: boolean
}
```

---

# 22. Capability Version

Capability version changes only when semantic contract changes materially.

Changing provider does NOT necessarily change capability version.

---

# 23. Baseline Risk

Every consequential capability MUST declare a baseline R0–R5 risk.

Example:

```text
mgbos.invoice.read
→ R1

email.message.send
→ R3

mgbos.payment.record
→ R5
```

---

# 24. Effective Risk

Runtime policy may raise risk according to:

```text
environment
amount
volume
data sensitivity
blast radius
customer impact
```

Capability registry only defines baseline/floor.

---

# 25. Tool Risk Cannot Downgrade Capability Risk

A tool implementation cannot say:

```text
payment.record
risk = R2
```

if canonical capability floor is:

```text
R5
```

Most restrictive applicable classification wins.

---

# 26. Environment Declaration

Capability/tool availability is explicit for:

```text
LOCAL
TEST
STAGING
PRODUCTION
```

---

# 27. Environment Is Part of Tool Resolution

A tool that exists in staging may not be usable in production.

```text
tool registered
≠
tool available in every environment
```

---

# 28. First Production Registry

The first JARVIS runtime SHOULD contain only read capabilities such as:

```text
mgbos.business.briefing.read

mgbos.finance.summary.read

mgbos.operations.summary.read

mgbos.inventory.summary.read

github.ci.summary.read
```

---

# 29. First Production Registry Must Be Structurally Read-Only

Testable invariant:

```text
for every enabled production tool:

mutation == false
```

during the first milestone.

---

# 30. Tool Definition

Canonical logical contract:

```ts
type ToolDefinition = {
  id: string

  version: string

  capabilityIds: string[]

  adapterId: string

  providerId: string

  lifecycle:
    | "EXPERIMENTAL"
    | "ACTIVE"
    | "RETIRED"

  administrativeState:
    | "ENABLED"
    | "DISABLED"

  health:
    | "HEALTHY"
    | "DEGRADED"
    | "UNAVAILABLE"
    | "UNKNOWN"

  environments: Environment[]

  inputSchemaId: string
  outputSchemaId: string

  verificationPolicyId: string

  credentialProfileId?: string

  timeoutPolicyId?: string
  retryPolicyId?: string

  enabled: boolean
}
```

---

# 31. Lifecycle and Health Are Separate

Important correction to earlier design notes.

Do NOT use one linear sequence:

```text
EXPERIMENTAL
→ ACTIVE
→ DEGRADED
→ DISABLED
→ RETIRED
```

because:

```text
DEGRADED
```

is not an end-of-life stage.

---

# 32. Canonical Tool Lifecycle

Lifecycle:

```text
EXPERIMENTAL
    ↓
ACTIVE
    ↓
RETIRED
```

Possible future addition:

```text
DEPRECATED
```

if migration needs justify it.

---

# 33. EXPERIMENTAL

Tool exists for:

```text
development
evaluation
sandbox
staging
```

It MUST NOT silently become production-authorized.

---

# 34. ACTIVE

Tool is an accepted implementation for its supported environments/capabilities.

ACTIVE does NOT mean:

```text
always healthy

authorized for everyone

L4 autonomous
```

---

# 35. RETIRED

Tool implementation must no longer be selected for new executions.

Historical execution records remain preserved.

---

# 36. Operational Health

Health is independent:

```text
HEALTHY

DEGRADED

UNAVAILABLE

UNKNOWN
```

---

# 37. HEALTHY

Tool is functioning within accepted operational expectations.

---

# 38. DEGRADED

Tool is available but exhibits a known limitation such as:

```text
high latency

partial provider outage

higher error rate

limited endpoint availability

verification degradation
```

---

# 39. UNAVAILABLE

Tool cannot currently perform the capability reliably.

---

# 40. UNKNOWN Health

System does not currently have enough evidence to determine health.

High-risk autonomous execution SHOULD NOT assume:

```text
UNKNOWN = HEALTHY
```

---

# 41. Administrative State

Independent:

```text
ENABLED
DISABLED
```

---

# 42. DISABLED

Tool selection is prohibited regardless of provider health.

Reasons may include:

```text
security incident

policy decision

maintenance

credential compromise

operator kill switch

unsafe behavior
```

---

# 43. Recovering From Degraded

Example:

```text
ACTIVE
health = DEGRADED
```

may later return to:

```text
ACTIVE
health = HEALTHY
```

without lifecycle change.

---

# 44. Tool Selectability

A tool is normally selectable only when:

```text
lifecycle = ACTIVE

AND
administrativeState = ENABLED

AND
health is acceptable

AND
environment supported

AND
capability supported
```

Policy may impose further constraints.

---

# 45. Tool Registry

Tool Registry is the canonical runtime catalog of executable implementations.

It answers:

```text
Which capability exists?

Which tool implements it?

Which environment?

What risk?

What schemas?

What verification?

What health?

What provider?

Is it enabled?
```

---

# 46. Registry Does Not Grant Authority

Critical:

```text
REGISTERED
≠
AUTHORIZED
```

Registry says:

```text
the capability can technically be performed.
```

Permission says:

```text
this principal may request it.
```

---

# 47. Registry Is Not Planner Memory

Planner SHOULD receive an appropriate filtered view of available capabilities.

It should not rely on memorizing tool IDs from prompts.

---

# 48. Capability Discovery

Planner asks:

```text
what capability satisfies this step?
```

Execution resolves the actual tool.

---

# 49. Tool Resolution

Conceptually:

```text
CAPABILITY
   ↓
environment filter
   ↓
lifecycle
   ↓
enabled state
   ↓
health
   ↓
policy
   ↓
compatible implementation
   ↓
TOOL
```

---

# 50. Deterministic Tool Resolution

Where one valid tool exists:

```text
select deterministically.
```

No LLM needed.

---

# 51. Multiple Tool Implementations

When multiple implementations exist, selection MAY consider:

```text
health
cost
latency
data policy
provider availability
required feature set
```

---

# 52. Model Does Not Freely Pick Provider Credentials

AI may reason about desired capability.

Trusted runtime resolves implementation.

---

# 53. Default Tool

A capability MAY declare a preferred tool/provider.

Fallback remains separate.

---

# 54. Fallback Tool

Example:

```text
email.message.send

Primary:
Provider A

Fallback:
Provider B
```

Fallback is allowed only if contracts and policy remain compatible.

---

# 55. Fallback Cannot Circumvent Policy

If Provider A is disallowed for restricted data:

```text
failure
```

does not justify automatically sending the same data through an unapproved Provider B.

---

# 56. Adapter Contract

Canonical logical adapter:

```ts
interface ToolAdapter<I, O> {
  execute(
    input: I,
    context: ToolExecutionContext
  ): Promise<AdapterResult<O>>
}
```

---

# 57. Tool Execution Context

May contain:

```text
request ID

trace ID

environment

organization scope

credential reference

timeout

idempotency key

correlation
```

It MUST NOT expose unnecessary model reasoning.

---

# 58. Adapter Responsibilities

Adapter owns:

```text
provider request transformation

authentication integration

transport call

provider-response parsing

provider error normalization

provider-reference capture
```

---

# 59. Adapter Does Not Own Business Authorization

Adapter MUST NOT decide:

```text
this user is finance,
so payment is allowed.
```

Authorization occurs before execution and again inside authoritative business systems where required.

---

# 60. Adapter Does Not Own Business Invariants

MGBOS adapter does not reproduce:

```text
invoice arithmetic

stock invariants

state machines
```

MGBOS owns them.

---

# 61. Internal Gateway Adapter

Some capabilities SHOULD call internal application gateways.

Example:

```text
JARVIS
→ MGBOS Adapter
→ MGBOS Internal API
→ authoritative command/query
```

Preferred over raw database coupling.

---

# 62. Native API Adapter

Valid for external provider integrations.

---

# 63. MCP Adapter

MCP MAY implement a tool adapter.

Canonical:

```text
Capability
   ↓
Tool Registry
   ↓
MCP Adapter
   ↓
MCP Server
```

---

# 64. MCP Is Not Tool Governance

Using MCP does not remove need for:

```text
risk

permission

schema

verification

health

lifecycle
```

---

# 65. n8n Adapter

n8n MAY be used when capability is best implemented through an orchestration workflow.

But capability semantics remain outside n8n.

---

# 66. Browser / Computer Adapter

Future browser/computer capabilities MUST be represented as bounded semantic actions where practical.

Avoid exposing:

```text
arbitrary unrestricted computer control
```

as a normal business capability.

---

# 67. Input Schema

Every tool MUST have machine-validatable input.

Input should represent:

```text
caller intent
```

not caller-calculated authoritative consequences.

---

# 68. Bad Input Contract

Bad:

```text
RecordPayment {
  invoiceBalanceAfter: 0
}
```

---

# 69. Good Input Contract

Good:

```text
RecordPayment {
  invoiceId
  amount
  paymentReference
}
```

MGBOS calculates consequences.

---

# 70. Input Schema Versioning

Breaking input changes require:

```text
tool/capability contract versioning
```

rather than silent interpretation.

---

# 71. Output Schema

Every tool MUST have machine-validatable output.

Provider raw payload SHOULD NOT flow directly throughout JARVIS Core.

---

# 72. Output Normalization

Canonical tool output might include:

```text
data

provider reference

observation timestamp

execution status

evidence
```

---

# 73. Provider-Specific Data

Provider-specific fields MAY be retained inside:

```text
metadata
```

when needed for debugging/reconciliation.

They should not contaminate the canonical contract.

---

# 74. Input Validation

Before provider call:

```text
Tool Input
   ↓
Schema Validation
   ↓
Policy Validation
   ↓
Adapter
```

---

# 75. Output Validation

After provider call:

```text
Provider Output
   ↓
Adapter Normalization
   ↓
Schema Validation
   ↓
Verification
```

---

# 76. Malformed Output

HTTP 200 + malformed payload equals:

```text
TOOL_OUTPUT_INVALID
```

not success.

---

# 77. Verification Policy

Every capability SHOULD have a verification policy.

Read example:

```text
schema valid

source identity valid

organization valid

freshness valid
```

---

# 78. Mutation Verification Policy

Future mutation example:

```text
request accepted

then re-read authoritative state

verify expected postcondition
```

---

# 79. High-Risk Verification

R4/R5 tools SHOULD normally require stronger evidence than their initial execution receipt.

---

# 80. Tool Result ≠ Verified Outcome

Canonical distinction:

```text
TOOL EXECUTION
        ↓
TOOL RESULT
        ↓
VERIFICATION
        ↓
OUTCOME
```

---

# 81. Verification Failure

Tool may report success but verification may produce:

```text
FAILED

UNKNOWN

NEEDS_RECONCILIATION
```

---

# 82. Evidence Production

Tool/adapter SHOULD provide enough provenance to construct evidence.

Examples:

```text
source ID

provider reference

observed timestamp

revision

resource ID
```

---

# 83. Read Evidence

Example:

```text
Capability:
mgbos.invoice.read

Evidence:
invoice UUID
observed_at
MGBOS source
current version/state
```

---

# 84. External Mutation Evidence

Future:

```text
email.message.send

provider message ID

provider accepted_at
```

supports provider acceptance.

It does not necessarily prove human recipient read the email.

---

# 85. Evidence Semantics Remain Claim-Specific

Tool metadata does not decide what the evidence proves.

Evidence & Provenance Model remains authority.

---

# 86. Credential Profile

Tool definitions MAY reference:

```text
credentialProfileId
```

instead of raw credential.

Example:

```text
github.production.readonly
```

---

# 87. Credential Broker Boundary

Preferred:

```text
Execution Runtime
      ↓
Credential Profile
      ↓
Secret Broker / Environment
      ↓
Adapter
```

---

# 88. Model Never Receives Raw Secret

Normal architecture:

```text
Model sees:
"github.pull_request.read"

Model does NOT see:
GITHUB_TOKEN=...
```

---

# 89. Credentials Are Environment-Specific

```text
staging credential
≠
production credential
```

---

# 90. Tool Permission Does Not Imply Credential Exposure

Runtime can execute a capability without revealing provider credentials to the requesting agent/model.

---

# 91. Credential Rotation

Secret rotation SHOULD ideally not require capability contract changes.

---

# 92. Credential Compromise

If credential integrity is questionable:

```text
tool → DISABLED

credential → revoked/rotated
```

until verified.

---

# 93. Read Credential Principle

Read-only tools SHOULD use read-only provider credentials where available.

---

# 94. Least Privilege at Provider Layer

Even if JARVIS permission is bounded, provider credentials should also be bounded when practical.

Defense in depth.

---

# 95. Mutation Flag

`mutation` is a high-value registry attribute.

It indicates whether capability/tool may create consequential external state change.

---

# 96. Mutation Flag Is Not Full Risk Classification

Example:

```text
secret.read

mutation = false
```

could still be:

```text
R5
```

because of sensitive data exposure.

---

# 97. Side-Effect Semantics

Future Tool Definition MAY classify side effects more precisely:

```text
NONE

INTERNAL

EXTERNAL_REVERSIBLE

EXTERNAL_IRREVERSIBLE

FINANCIAL

SECURITY
```

Only introduce if policy needs it.

---

# 98. Idempotency Metadata

Mutation capabilities SHOULD state whether idempotency is required.

Example:

```text
payment.record
→ required
```

---

# 99. Idempotency Key

Runtime SHOULD pass stable logical request identity where target system supports it.

---

# 100. Idempotency Belongs to Business Effect

Transport retry ID and business idempotency key should not be confused.

---

# 101. Retry Policy

Tool SHOULD declare normalized retry behavior.

Examples:

```text
read timeout
→ retryable

rate limit
→ retryable with delay

invalid request
→ non-retryable

authorization denied
→ non-retryable
```

---

# 102. Mutation Retry

Future mutation retry requires:

```text
idempotency
+
known provider semantics
```

---

# 103. Unknown Outcome

If external mutation times out after request may have reached provider:

```text
status = UNKNOWN
```

Correct next action:

```text
reconcile
```

not blind retry.

---

# 104. Timeout Policy

Tool MAY define separate:

```text
connect timeout

execution timeout

verification timeout
```

when needed.

Do not overcomplicate first read runtime.

---

# 105. Rate Limit Metadata

Adapters SHOULD normalize provider:

```text
rate limit

retry-after

quota exhaustion
```

where available.

---

# 106. Cost Metadata

Tool/provider usage MAY expose:

```text
per-call cost

quota unit

estimated cost
```

when relevant to later cost governance.

---

# 107. Tool Health

Tool health SHOULD derive from evidence such as:

```text
recent success rate

latency

provider outage

verification failure

credential status
```

---

# 108. Health Is Not Pure AI Judgment

Prefer deterministic telemetry/rules where possible.

---

# 109. DEGRADED Behavior

When degraded, runtime may:

```text
allow reads with warning

lower autonomy

prefer fallback

require approval

disable mutation
```

depending on policy.

---

# 110. UNAVAILABLE Behavior

Tool should not be selected.

If alternative implementation exists:

```text
resolver may use fallback
```

subject to policy.

---

# 111. Circuit Breaker Direction

Future high-volume integrations MAY use circuit breakers.

Do not build before repeated provider failure makes it valuable.

---

# 112. Health Checks

Tools SHOULD have health checks appropriate to their nature.

Avoid health checks that create real business effects.

---

# 113. Registry Health Projection

Command Center may later show:

```text
MGBOS Read      HEALTHY

GitHub          DEGRADED

Email           HEALTHY

Payment         DISABLED
```

---

# 114. Tool Lifecycle Promotion

Tool promotion:

```text
EXPERIMENTAL
      ↓
ACTIVE
```

requires appropriate evidence.

---

# 115. Promotion Evidence

Depending on risk:

```text
contract tests

adapter tests

schema validation

environment tests

failure tests

verification tests

security tests

sandbox/staging execution
```

---

# 116. High-Risk Tool Promotion

R4/R5 tool activation SHOULD require significantly stronger evidence and governance.

---

# 117. Production Activation Is Separate

A tool may be:

```text
ACTIVE in STAGING
```

while:

```text
not enabled in PRODUCTION
```

---

# 118. Tool Retirement

When provider/tool implementation is no longer used:

```text
lifecycle = RETIRED
```

Historical execution references remain resolvable.

---

# 119. Retired Tool Must Not Be Deleted From History

Audit may depend on:

```text
which implementation executed an old action?
```

---

# 120. Provider Migration

Canonical migration:

```text
Capability stays stable

Old Tool
→ retire

New Tool
→ experimental
→ test
→ active

Registry resolver
→ switches implementation
```

---

# 121. Provider Migration Does Not Change Agent Contract

Agent should continue asking for:

```text
email.message.send
```

without caring whether implementation changed.

---

# 122. Capability Contract Change

If provider migration changes actual business semantics:

```text
that may require capability version change.
```

Do not hide semantic changes behind an adapter.

---

# 123. Tool Version

Tool version identifies implementation contract/revision.

Example:

```text
github-pr-read.v1
```

---

# 124. Version Must Be Traceable

Execution record SHOULD preserve:

```text
tool ID

tool version

adapter version if material
```

---

# 125. Semantic Versioning Direction

Implementation MAY use semver where helpful.

Canonical requirement is explicit version identity, not a specific version syntax.

---

# 126. Tool Deprecation

If migration periods become necessary, a future:

```text
DEPRECATED
```

lifecycle state MAY be added.

Do not add complexity before it is needed.

---

# 127. Tool Observability

Every tool call SHOULD expose:

```text
tool ID

capability

duration

status

provider

verification result

error

environment
```

---

# 128. Sensitive Observability

Never log:

```text
raw secrets

tokens

full restricted payloads
```

merely for debugging convenience.

---

# 129. Tool Audit

Consequential future tool calls SHOULD also preserve:

```text
actor

permission decision

risk

autonomy

approval

correlation

evidence
```

---

# 130. Tool Metrics

Useful future metrics:

```text
success rate

verification success rate

latency

timeout rate

provider failure rate

retry rate

cost

usage volume
```

---

# 131. Tool Quality Is Not Only API Success

Important metric:

```text
verified successful outcome rate
```

not merely:

```text
HTTP success rate
```

---

# 132. Capability Metrics

Metrics SHOULD eventually aggregate across implementations.

This lets us compare providers without changing capability semantics.

---

# 133. Tool Selection Evidence

When multiple providers exist, runtime SHOULD be able to explain:

```text
why this implementation was selected.
```

Examples:

```text
primary healthy

fallback unavailable

data policy

cost policy

environment
```

---

# 134. Planner Visibility

Planner generally needs capability metadata such as:

```text
ID

description

input shape

risk

mutation
```

It should not need:

```text
credentials

provider implementation detail

internal endpoint
```

---

# 135. Agent Visibility

Specialist agents receive only relevant capability subset.

CFO agent should not receive marketing publish tools by default.

---

# 136. Skill Visibility

Skill contracts MAY narrow tools further.

Example:

```text
Skill:
reconcile-payment

Allowed capabilities:
invoice.read
provider.payment.read
payment.record
```

Permission still determines actual execution authority.

---

# 137. Principle of Capability Intersection

Effective available capabilities are approximately:

```text
REGISTERED
∩
ENVIRONMENT
∩
PRINCIPAL PERMISSION
∩
AGENT SCOPE
∩
SKILL SCOPE
∩
POLICY
∩
TOOL HEALTH
```

---

# 138. Empty Intersection

If nothing valid remains:

```text
TOOL_NOT_AVAILABLE
```

or:

```text
CAPABILITY_UNAVAILABLE
```

is correct.

Do not improvise an unregistered workaround.

---

# 139. Tool Substitution

Planner/runtime MUST NOT substitute:

```text
arbitrary browser action
```

for:

```text
payment.record
```

just because the approved tool is unavailable.

---

# 140. Browser Escape Hatch Anti-Pattern

Giving an AI browser access MUST NOT become a universal way around missing APIs/permissions.

Browser capabilities require their own governance.

---

# 141. Raw Database Escape Hatch Anti-Pattern

Likewise:

```text
tool unavailable
→ just run SQL
```

is prohibited.

---

# 142. Shell Escape Hatch Anti-Pattern

Runtime agents should not receive unrestricted shell solely so they can bypass missing tool contracts.

---

# 143. Generic HTTP Escape Hatch

An unrestricted:

```text
http.request
```

tool can undermine capability governance.

Prefer bounded adapters.

If generic HTTP exists, scope it tightly.

---

# 144. Capability Composition

A higher-level capability MAY internally coordinate lower-level tools.

Example:

```text
mgbos.business.briefing.read
```

may compose deterministic projections.

Composition should remain explicit.

---

# 145. Composite Tool Risk

Composite capability inherits at least the highest relevant risk of consequential sub-capabilities.

---

# 146. Composite Tool Permission

Caller should receive authority to the composite capability.

Internal steps must remain within its defined contract.

---

# 147. Composite Tool Must Not Smuggle Authority

A seemingly read-only tool MUST NOT internally perform hidden mutations.

---

# 148. Read Capability Purity

Read capability SHOULD have:

```text
mutation = false
```

and no hidden business side effects.

Telemetry/cache updates are infrastructure effects and should not change business truth.

---

# 149. Tool Data Classification Direction

Future registry SHOULD declare supported input/output data classifications.

Example:

```text
max_data_class = CONFIDENTIAL
```

---

# 150. Provider Eligibility

Tool resolution may later consider:

```text
provider approved for data class?
```

especially for model/external SaaS integrations.

---

# 151. Tool Scope

Tool MAY have explicit scope constraints:

```text
organization

brand

repository

account

environment
```

---

# 152. Scope Comes From Trusted Runtime

Model SHOULD NOT be able to change:

```text
organization_id
```

to escape its authorized scope.

---

# 153. Cross-Business Tool Use

Cross-business read capability requires explicit group-level authorization.

Same JARVIS runtime does not imply cross-business access.

---

# 154. Provider Account Identity

External provider account identity SHOULD be explicit.

Example:

```text
TeeStock Instagram
```

must not be confused with:

```text
MultiGraph Instagram
```

---

# 155. Resource Identity

Prefer stable IDs instead of display names where possible.

---

# 156. Tool Error Model

Adapters normalize errors into runtime categories.

Examples:

```text
AUTHENTICATION_FAILED

AUTHORIZATION_DENIED

NOT_FOUND

INVALID_INPUT

RATE_LIMITED

TIMEOUT

PROVIDER_UNAVAILABLE

PROVIDER_REJECTED

OUTPUT_INVALID

UNKNOWN_OUTCOME
```

---

# 157. Provider Error Text Is Not Policy

Provider responses remain data.

They cannot instruct JARVIS to modify policy.

---

# 158. Retryable Error

Adapter SHOULD indicate whether error is known retryable.

Runtime policy makes final retry decision.

---

# 159. Authentication Failure

Repeated authentication failure SHOULD often degrade/disable the tool instead of endless retry.

---

# 160. Authorization Failure

Provider-side authorization failure should not cause runtime to seek stronger credentials automatically.

---

# 161. Tool Health and Autonomy

If tool health drops:

```text
L4
```

may effectively fall to:

```text
L3 / disabled
```

according to governance.

---

# 162. Tool Health and Approval

Human approval cannot make a technically unsafe/unavailable tool healthy.

---

# 163. Verification Availability and Autonomy

A mutation tool whose postconditions can no longer be verified SHOULD have reduced autonomy or be disabled.

---

# 164. Tool Kill Switch

Runtime SHOULD eventually support:

```text
disable capability implementation

disable all mutation tools

disable provider

disable domain tools
```

without shutting down read-only JARVIS.

---

# 165. Domain Kill Switch

Example:

```text
disable finance mutations
```

while preserving:

```text
finance reads
```

---

# 166. Provider Kill Switch

Example:

```text
disable WhatsApp provider
```

without disabling email.

---

# 167. Tool Governance Change

Changes involving:

```text
risk

mutation classification

production environment

credentials

verification

capability semantics
```

deserve explicit review.

---

# 168. Tool Registry Should Be Version-Controlled

Registry configuration SHOULD eventually live in:

```text
versioned source/configuration
```

rather than exist only as hidden runtime database state.

---

# 169. Runtime Overrides

Temporary operational state such as:

```text
DISABLED

DEGRADED
```

MAY live in runtime state.

Canonical tool definition remains version-controlled.

---

# 170. Static vs Dynamic Registry

Initial runtime MAY use a static registry in code/config.

A database-driven dynamic registry is unnecessary until runtime needs justify it.

---

# 171. First Tool Registry Implementation

Simple code:

```text
registered tool definitions
+
typed adapter map
+
schema validation
```

is sufficient.

---

# 172. Do Not Build Plugin Marketplace Yet

JARVIS does not need a marketplace of dynamically installed business tools in v1.

Every production capability should be explicitly governed.

---

# 173. Tool Installation Is Governance-Relevant

Adding a new production tool means introducing:

```text
new capability surface
new provider trust
new data flow
new failure mode
possibly new authority
```

It deserves review.

---

# 174. Tool Removal

Before removing an implementation, verify:

```text
active workflows

fallback

historical traceability

dependency references
```

---

# 175. Tool Contract Tests

Every tool SHOULD have tests for:

```text
input validation

output normalization

provider success

provider error

timeout

invalid output

scope handling
```

---

# 176. Read Tool Tests

Also verify:

```text
no mutation

freshness metadata

evidence source

organization isolation
```

---

# 177. Mutation Tool Tests

Before future production activation:

```text
permission denial

approval boundary

idempotency

duplicate call

concurrency where relevant

unknown outcome

verification

reconciliation

audit/evidence
```

---

# 178. Tool Security Tests

Potential checks:

```text
secret leakage

cross-org access

prompt-injection payload

unexpected provider fields

overbroad credential

environment mix-up
```

---

# 179. Provider Contract Fixture

Adapters SHOULD have stable fixtures/mocks for deterministic testing.

---

# 180. Live Provider Tests

Staging/sandbox live tests MAY complement fixtures.

They do not replace deterministic contract tests.

---

# 181. Production Test Rule

Do not run destructive integration tests against production merely to validate a tool.

---

# 182. Tool Promotion Gate

Before production ACTIVE:

```text
contract known

schemas validated

risk assigned

environment explicit

credential boundary established

verification defined

error model normalized

tests pass

evidence available
```

---

# 183. High-Risk Activation Gate

For R4/R5 add:

```text
approval semantics

idempotency

reconciliation

postcondition verification

strong audit

kill switch

recovery
```

---

# 184. First Read-Only Tool Candidate — MGBOS

Recommended:

```text
mgbos.business.briefing.read
```

or focused summary capabilities.

---

# 185. MGBOS Tool Principle

MGBOS tool should expose:

```text
business-level projections
```

not raw tables.

---

# 186. MGBOS Adapter Must Not Own MGBOS Rules

It merely invokes authoritative queries/commands.

---

# 187. First Read-Only Tool Candidate — GitHub

Examples:

```text
github.ci.summary.read

github.pull_requests.read
```

---

# 188. GitHub Evidence

Should preserve:

```text
repository

revision / run ID

observed time

reference
```

---

# 189. Future Email Capability

Separate:

```text
email.message.read

email.message.draft

email.message.send
```

because risk/autonomy differ.

---

# 190. Future Social Capability

Separate:

```text
social.content.read

social.content.prepare

social.content.publish
```

---

# 191. Future Calendar Capability

Separate:

```text
calendar.event.read

calendar.event.prepare

calendar.event.create

calendar.event.update

calendar.event.cancel
```

---

# 192. Future Finance Capability

Separate:

```text
mgbos.payment.read

mgbos.payment.prepare

mgbos.payment.record

mgbos.payment.reverse
```

if the prepare abstraction is useful.

---

# 193. Capability Reuse

Same capability may be used by:

```text
human-triggered JARVIS

scheduled automation

specialist agent

skill

event-driven workflow
```

provided governance allows it.

---

# 194. Capability Does Not Know Who Uses It

Authorization belongs outside capability implementation.

---

# 195. Tool Does Not Know Agent Persona

Tool should not contain:

```text
if CFO agent...
```

unless that distinction maps to a real authorization policy outside the adapter.

---

# 196. Agent-to-Tool Coupling

Avoid hardcoding provider tool IDs inside prompts.

Use capability IDs.

---

# 197. Skill-to-Tool Coupling

Skills SHOULD primarily reference capabilities.

Exact tool implementation remains resolver-owned.

---

# 198. Capability Registry and Permission Registry

Target relationship:

```text
Capability Registry
→ what can technically be done

Permission
→ who may request it

Risk
→ consequence

Autonomy
→ independence

Approval
→ action gate

Tool Registry
→ how it is currently done
```

---

# 199. Capability Registry and Model Gateway

Models are cognitive providers.

Tool capabilities are external-world capabilities.

Keep registries conceptually separate.

---

# 200. Capability Registry and Events

Event consumers may request capabilities.

Event itself does not grant access.

---

# 201. Capability Registry and Command Center

Command Center may eventually display:

```text
capability

risk

autonomy

tool implementation

health

environment

recent usage
```

---

# 202. Tool Status Projection

Example:

```text
Capability
mgbos.finance.summary.read

Tool
mgbos-api-finance-summary.v1

Lifecycle
ACTIVE

Health
HEALTHY

Admin
ENABLED

Environment
PRODUCTION

Risk
R1

Mutation
false
```

---

# 203. Capability Status Projection

If one tool fails but another remains healthy:

```text
capability
=
AVAILABLE
```

even though one implementation is degraded.

---

# 204. Capability Availability

Possible derived runtime states:

```text
AVAILABLE

DEGRADED

UNAVAILABLE

DISABLED
```

These are projections from available tools/policy, not lifecycle state.

---

# 205. Tool Health Does Not Rewrite History

Historical tool execution should retain health/result observed at execution time.

---

# 206. Tool Selection Must Be Reproducible

Execution trace SHOULD make it possible to determine:

```text
which capability?

which tool?

which adapter?

which provider?

which version?

why selected?
```

---

# 207. Provider Lock-In Test

Architecture should pass:

```text
Can provider implementation be replaced
without changing agent/planner semantic contracts?
```

for replaceable integrations.

---

# 208. Capability Stability Test

Capability is well-defined when humans can understand what it means without reading provider API docs.

---

# 209. Tool Boundary Test

Tool is well-designed when:

```text
its inputs are bounded,
outputs validated,
side effects known,
risk explicit,
verification defined.
```

---

# 210. Tool Anti-Patterns

```text
god_tool.execute_anything

database.query_any_sql

browser.do_whatever

shell.run_any_command

provider.raw_api_call

service_role_supabase

agent_admin_tool
```

are dangerous default production capability patterns.

Generic infrastructure tools may exist in specialized engineering sandboxes, but they MUST NOT become normal runtime business capabilities.

---

# 211. Hidden Side Effect Anti-Pattern

A tool named:

```text
customer.read
```

MUST NOT:

```text
mark customer contacted
```

as hidden business behavior.

---

# 212. Tool-by-Provider Architecture Anti-Pattern

Avoid making planner reason:

```text
Use Gmail
Use Supabase
Use Twilio
```

when actual intent is:

```text
send email
read invoice
send message
```

---

# 213. Permission-in-Prompt Anti-Pattern

Tool eligibility is not established through:

```text
"You may use payment tool."
```

in a model prompt.

---

# 214. Tool-Existence-as-Permission Anti-Pattern

Just because model sees tool schema does not mean execution should be accepted.

Runtime policy revalidates.

---

# 215. Health-by-LLM Anti-Pattern

Do not let model casually declare:

```text
tool looks healthy.
```

Operational health should come from system evidence.

---

# 216. Provider Success-as-Business-Success Anti-Pattern

```text
provider 200
→ business success
```

is invalid unless the contract explicitly proves that outcome.

---

# 217. Automatic Fallback Anti-Pattern

Fallback MUST NOT silently change:

```text
privacy

semantics

risk

account

business scope
```

---

# 218. First Implementation Scope

For the initial Morning Briefing runtime, implement only enough Tool Runtime to support:

```text
static registry

read capability definitions

MGBOS read adapter

optional GitHub read adapter

schemas

health

evidence

verification
```

---

# 219. Initial Non-Goals

Do NOT initially build:

```text
dynamic tool marketplace

runtime plugin installation

mutation tools

provider bidding engine

complex circuit breaker infrastructure

tool billing system

automatic provider benchmarking

generic shell/browser escape hatches
```

---

# 220. Recommended Implementation Sequence

```text
Capability contract
      ↓
Tool contract
      ↓
Static registry
      ↓
Schema validation
      ↓
MGBOS read adapter
      ↓
Evidence production
      ↓
Verification
      ↓
Health
      ↓
GitHub read adapter
      ↓
Tool observability
```

---

# 221. First Definition of Done

Tool & Capability Runtime is ready for Morning Briefing when:

```text
capability IDs are canonical

registry resolves them deterministically

production registry contains no mutation tools

inputs validate

outputs validate

environment restrictions work

organization scope is preserved

evidence is produced

freshness can be checked

tool health is observable

adapter failure is normalized

optional provider failure produces partial response

Core never needs raw provider credentials
```

---

# 222. Future Mutation Definition of Done

Before first L3 tool:

```text
permission integrated

risk integrated

approval linked

idempotency defined

unknown outcome handled

verification defined

reconciliation exists

evidence complete

kill switch available

audit traceable
```

---

# 223. Relationship to Core Runtime

```text
Planner
→ selects capability

Policy
→ authorizes proposed use

Tool Registry
→ resolves implementation

Adapter
→ invokes provider

Verification
→ determines result

Evidence
→ proves what happened
```

---

# 224. Relationship to Agents

```text
Agent
→ reasons

Capability
→ expresses required external action

Tool
→ implements capability
```

---

# 225. Relationship to Skills

```text
Skill
→ defines procedural HOW

Capability
→ defines WHAT operation

Tool
→ provides executable implementation
```

---

# 226. Relationship to Governance

```text
Permission
→ may principal request capability?

Risk
→ how consequential?

Autonomy
→ how independently?

Approval
→ does this instance require human decision?

Tool Registry
→ which implementation may execute it?
```

---

# 227. Relationship to Evidence

Tool result should generate evidence.

Verification determines what that evidence supports.

---

# 228. Relationship to MGBOS

MGBOS capabilities should map to bounded:

```text
queries

commands
```

not direct table mutation.

---

# 229. Relationship to n8n

n8n may implement some tool workflows.

It never becomes semantic owner of the capability.

---

# 230. Relationship to MCP

MCP may transport tool calls.

It never becomes semantic owner of capability governance.

---

# 231. Relationship to Provider APIs

Provider APIs are implementation detail below adapters.

---

# 232. Canonical Ownership

```text
Capability semantics
→ JARVIS Tool & Capability Architecture
  or authoritative domain contract

Business command semantics
→ MGBOS

Permissions
→ Permission governance

Risk
→ Cross-System Risk

Autonomy
→ Autonomy governance

Approval
→ Approval Policy

Evidence
→ Evidence & Provenance

Provider implementation
→ Adapter
```

---

# 233. Canonicalization Effect

Before this document, Tool architecture semantics were distributed across:

```text
JARVIS Architecture v0.1

JARVIS Core Runtime v0.2

Governance & Operations notes
```

After activation:

```text
jarvis.architecture.tool-capability
```

becomes the canonical semantic owner for JARVIS capabilities, tools, registry, adapters, provider resolution, tool lifecycle, and tool health.

---

# 234. Current State Declaration

As of 2026-09-29:

```text
Tool & Capability Architecture
ACTIVE

Canonical Runtime Registry
NOT IMPLEMENTED

systems/jarvis/
NOT PRESENT

Production JARVIS Tools
NOT IMPLEMENTED

Production JARVIS Mutation Tools
NOT GRANTED
```

---

# 235. Architectural Invariants

1. JARVIS reasons in capabilities, not provider APIs.
2. Capability and Tool are separate concepts.
3. Tool and Adapter are separate concepts.
4. Adapter and Provider are separate concepts.
5. Credentials remain behind trusted boundaries.
6. Tool existence never grants permission.
7. Read and mutation capabilities remain distinct.
8. Material prepare and execute capabilities SHOULD remain distinguishable.
9. Every capability has explicit baseline risk.
10. Effective risk may rise but cannot silently fall below the governance floor.
11. Every tool has validated input and output contracts.
12. Tool result does not automatically equal verified business outcome.
13. Consequential capabilities require explicit verification policy.
14. Environment availability is explicit.
15. Provider credentials are environment-scoped where practical.
16. Tool lifecycle and tool health remain separate.
17. `DEGRADED` is health, not lifecycle.
18. `DISABLED` is administrative control, not lifecycle.
19. Tool history survives retirement.
20. Provider migration should not change capability semantics unnecessarily.
21. Planner selects capabilities; trusted runtime resolves tools.
22. Generic escape-hatch tools do not replace bounded capability design.
23. Fallback providers may not bypass privacy, risk, permission, or scope.
24. First production JARVIS Tool Registry is structurally read-only.
25. Mutation tools are introduced one capability at a time.

---

# 236. North Star

The runtime should eventually be able to answer before every tool execution:

```text
What capability is being requested?

What does that capability mean?

Is it read or mutation?

What is its risk floor?

Is the principal authorized?

Which environment?

Which implementation will execute it?

Is that tool healthy?

Which provider/account?

Which credentials will be used?

What schema must the input satisfy?

What proves success?

What happens if the provider times out?

Can another provider safely replace it?

Can this tool be disabled without disabling JARVIS?
```

---

# 237. Final Principle

> **JARVIS should gain power by adding explicit, bounded capabilities—not by giving an AI increasingly unrestricted access to computers, databases, and provider APIs.**

The ideal architecture is not:

```text
AI
→ everything
```

It is:

```text
INTENT
   ↓
CAPABILITY
   ↓
AUTHORITY
   ↓
TOOL
   ↓
ADAPTER
   ↓
PROVIDER
   ↓
VERIFICATION
   ↓
EVIDENCE
```

That gives JARVIS increasingly powerful hands while keeping every finger individually governable.