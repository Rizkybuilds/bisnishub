---
canonical_id: jarvis.architecture.model-gateway-routing
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: jarvis
document_class: canonical-specification
effective_from: 2026-09-29
authoritative_for:
  - jarvis model gateway semantics
  - jarvis model routing
  - logical model profiles
  - model provider adapters
  - model registry
  - model fallback
  - model health
  - model eligibility
  - model structured-output requirements
  - model cost and latency governance
  - model evaluation and promotion
  - model-version provenance
  - provider replacement
  - model data-class eligibility
  - model escalation routing
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - ../charter.md
  - ../architecture.md
  - ../core-runtime.md
  - tool-capability.md
  - agent-registry.md
  - skill-registry.md
  - memory.md
  - ../../../../docs/governance/evidence-provenance-model.md
  - ../../../../docs/governance/cross-system-risk-classification.md
  - ../../../../docs/governance/autonomy-levels.md
  - ../../../../docs/architecture/architectural-laws.md
  - ../../../mgbos/docs/adr/006-ai-gateway.md
supersedes: null
implementation_status: NOT_IMPLEMENTED
target_runtime_location: systems/jarvis/
historical_design_inputs:
  - ../catatan/sesi/2026-09-27 - Chat GPT Sesi Model AI.md
  - ../catatan/sesi/2026-09-27 - JARVIS Architecture v0.1.md
  - ../catatan/sesi/2026-09-27 - JARVIS v0.2 - Core Runtime Specification.md
---

# JARVIS Model Gateway & Routing Architecture v1.0

## 1. Purpose

Dokumen ini mendefinisikan bagaimana JARVIS menggunakan AI models tanpa menjadikan satu provider atau satu model sebagai identitas JARVIS.

Ia menjawab:

```text
Which cognitive capability is needed?

Which model profile fits the task?

Which providers/models are eligible?

Which model should be selected now?

What happens if it fails?

How is structured output validated?

How much may the call cost?

How much latency is acceptable?

Can sensitive data be sent to this provider?

Which exact model/version produced the result?

How does a new model earn production status?
```

---

# 2. Core Principle

> **Models are replaceable cognitive compute. JARVIS is the system.**

Model:

```text
reasons
generates
interprets
classifies
```

JARVIS:

```text
provides context
governs tools
owns routing
applies policy
verifies outcomes
preserves evidence
```

---

# 3. JARVIS Must Not Equal a Model

Incorrect:

```text
JARVIS = GPT-X
```

Correct:

```text
JARVIS
   │
   ▼
MODEL GATEWAY
   │
   ▼
MODEL ROUTER
   │
   ├── Provider A
   ├── Provider B
   ├── Provider C
   └── Local / future provider
```

---

# 4. Provider-Neutrality

JARVIS Core MUST NOT unnecessarily depend on:

```text
provider SDKs

provider-specific model names

provider-specific response shapes

provider-specific tool schemas
```

These belong behind Model Gateway adapters.

---

# 5. Strategic Asset vs Replaceable Compute

Replaceable:

```text
model
provider
API SDK
model version
embedding provider
voice model
vision model
```

Strategic:

```text
business data
skills
agents
memory
evidence
tool contracts
policies
evals
feedback history
```

---

# 6. Model Gateway

Model Gateway is:

> **the canonical JARVIS boundary for invoking cognitive models through provider-neutral contracts.**

Core calls the Gateway.

Core does not directly instantiate provider clients.

---

# 7. Canonical Topology

```text
JARVIS CORE
     │
     ▼
MODEL GATEWAY
     │
     ▼
MODEL ROUTER
     │
     ▼
MODEL REGISTRY
     │
     ├── Provider Adapter A
     ├── Provider Adapter B
     ├── Provider Adapter C
     └── Future Adapter
```

---

# 8. Gateway Responsibilities

Model Gateway owns:

```text
canonical request contract
routing request
provider abstraction
response normalization
structured-output validation
usage metadata normalization
provider error normalization
provenance
```

---

# 9. Gateway Does Not Own Business Authority

It MUST NOT determine:

```text
whether payment is allowed

whether approval is required

whether business invariant passes

whether actor may access data
```

Those decisions happen elsewhere.

---

# 10. Model Router

Model Router answers:

> **Which eligible model implementation should handle this cognitive task?**

---

# 11. Router Inputs

Routing may consider:

```text
task type
logical model profile
risk context
data classification
required modality
quality requirement
latency target
cost budget
context size
structured-output support
provider health
evaluation status
```

---

# 12. Router Output

Logical:

```ts
type ModelRoute = {
  profileId: string

  providerId: string
  modelId: string
  modelVersion?: string

  adapterId: string

  reasonCode: string

  fallbackRoutes: string[]
}
```

---

# 13. Logical Model Profiles

JARVIS SHOULD reason about model profiles, not hardcoded model names.

Initial canonical profiles:

```text
FAST

BALANCED

DEEP

CRITIC

CREATIVE

VISION

VOICE
```

Additional profile:

```text
EMBEDDING
```

when semantic retrieval is implemented.

---

# 14. Profiles Describe Required Behavior

Profile describes:

```text
capability expectation

quality tier

latency preference

cost tolerance

modality
```

It does NOT specify permanent vendor assignment.

---

# 15. FAST

Optimized for:

```text
classification

simple extraction

tagging

routing assistance

high-volume summarization

simple transformation
```

Typical characteristics:

```text
low latency
low cost
adequate structured output
```

---

# 16. BALANCED

Default general reasoning profile.

Suitable for:

```text
routine JARVIS reasoning

planning

business analysis

summarization

normal tool-use reasoning
```

---

# 17. DEEP

Used when task requires substantially stronger reasoning.

Examples:

```text
complex architecture

difficult debugging

multi-constraint planning

high-stakes analysis

complex reconciliation reasoning
```

---

# 18. CRITIC

Used to:

```text
challenge
review
find gaps
test assumptions
critique proposed reasoning
```

CRITIC is a behavioral role.

It does not require a permanently different provider.

---

# 19. CREATIVE

Optimized for:

```text
campaign ideation

scripts

branding concepts

creative writing

content alternatives
```

Creative quality should not weaken factual-source requirements when factual claims are included.

---

# 20. VISION

Used for:

```text
image interpretation

document visual understanding

design/visual analysis
```

Vision output is model-derived interpretation.

It does not become direct physical truth automatically.

---

# 21. VOICE

Used for:

```text
speech interaction
transcription/generation
live conversational interface
```

Voice layer SHOULD remain separate from authoritative reasoning where practical.

---

# 22. EMBEDDING

Used to produce:

```text
semantic retrieval vectors
```

Embeddings are derived retrieval indexes.

They are not semantic truth.

---

# 23. Profile IDs Are Stable

Agent and Skill contracts SHOULD reference:

```text
DEEP
```

not:

```text
provider-model-name-2026
```

---

# 24. Profile Configuration Is Mutable

A configuration might temporarily map:

```text
BALANCED
→ provider/model A
```

and later:

```text
BALANCED
→ provider/model B
```

without changing Agent semantics.

---

# 25. Historical Model Assignments Are Not Canonical

Prior design notes include dated examples of named models/providers.

Those assignments are:

```text
historical evaluation ideas
```

not permanent architectural decisions.

---

# 26. Model Selection Requires Current Evaluation

No provider/model becomes canonical merely because a historical note recommended it.

Production selection depends on:

```text
current eval evidence
availability
cost
privacy
quality
```

---

# 27. Model Registry

Model Registry is the catalog of candidate model implementations.

It answers:

```text
Which model exists?

Which provider?

Which capabilities?

Which profiles can it satisfy?

Which context size?

Which modalities?

Which data classes?

Which environments?

Which health?

Which evaluation status?
```

---

# 28. Model Definition

Canonical logical contract:

```ts
type ModelDefinition = {
  id: string

  providerId: string
  providerModelId: string

  revision?: string

  supportedProfiles: ModelProfile[]

  modalities: ModelModality[]

  structuredOutput: boolean
  toolReasoning: boolean

  maxContextTokens?: number

  supportedDataClasses: DataClass[]

  environments: Environment[]

  lifecycle:
    | "EVALUATING"
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

  evalSuiteIds: string[]
}
```

---

# 29. Model ID vs Provider Model ID

Internal:

```text
model_definition.id
```

should be stable within JARVIS configuration.

Provider-specific:

```text
providerModelId
```

is implementation metadata.

---

# 30. Provider Adapter

Adapter translates:

```text
ModelRequest
        ↕
provider-specific API
```

---

# 31. Provider Adapter Owns

```text
authentication integration
API shape
provider-specific request fields
response parsing
usage normalization
provider errors
```

---

# 32. Provider Adapter Does Not Own Routing Policy

Adapter executes a chosen model.

Router decides which eligible model to choose.

---

# 33. Provider Adapter Does Not Own JARVIS Policy

It does not determine:

```text
permission
risk
approval
business truth
```

---

# 34. Provider SDK Isolation

Provider SDK imports SHOULD be contained in adapter/provider packages.

Avoid:

```text
Core imports OpenAI SDK
Planner imports Gemini SDK
Agent imports Anthropic SDK
```

---

# 35. Gateway Contract

Logical:

```ts
interface ModelGateway {
  generateStructured<T>(
    request: ModelRequest<T>
  ): Promise<ModelResult<T>>
}
```

Additional methods MAY later include:

```text
generateText
embed
vision
voice
```

if truly needed.

---

# 36. Structured Output First

Where runtime expects structured data:

> **Structured output is the contract. Free-form parsing is the fallback, not the architecture.**

---

# 37. Model Request

Logical:

```ts
type ModelRequest<T> = {
  requestId: string
  traceId: string

  taskType: string

  profile: ModelProfile

  context: ModelContext

  outputSchema: unknown

  dataClass: DataClass

  budget?: ModelBudget

  routingConstraints?: ModelRoutingConstraints
}
```

---

# 38. Model Context

Model Context should contain:

```text
minimum sufficient information
```

for the cognitive task.

It MUST NOT default to entire runtime state.

---

# 39. No Raw Credentials

Model Context MUST NOT contain:

```text
API keys

database passwords

service-role tokens

provider secrets
```

---

# 40. Trust Labels

Context SHOULD preserve relevant trust distinctions:

```text
CANONICAL

AUTHORITATIVE

MEMORY

EXTERNAL

INFERRED
```

so the model does not confuse external text with system instructions.

---

# 41. Data Class

Future canonical classes may include:

```text
PUBLIC

INTERNAL

CONFIDENTIAL

RESTRICTED
```

Model routing MUST eventually respect them.

---

# 42. Data-Class Eligibility

A model/provider can only receive data classes explicitly permitted by policy.

Example:

```text
Model A:
PUBLIC + INTERNAL

Model B:
PUBLIC only
```

Router may not ignore this for convenience.

---

# 43. Provider Eligibility Is Policy

A model's technical ability to process data does not mean organizational policy permits it.

---

# 44. Sensitive Context Minimization

Before model invocation:

```text
remove irrelevant PII

remove secrets

reduce unnecessary customer detail

use bounded projections
```

---

# 45. Data-Class Fallback Constraint

If primary provider fails:

```text
fallback provider
```

must also be eligible for the same data class.

---

# 46. No Privacy-Downgrade Fallback

Prohibited:

```text
CONFIDENTIAL task
primary fails
→ send to cheap unapproved provider
```

---

# 47. Routing Constraints

Logical:

```ts
type ModelRoutingConstraints = {
  requireStructuredOutput?: boolean

  requireVision?: boolean
  requireToolReasoning?: boolean

  allowedProviders?: string[]

  forbiddenProviders?: string[]

  maxLatencyMs?: number

  maxEstimatedCost?: number
}
```

---

# 48. Constraints Come From Trusted Runtime

External content cannot say:

```text
Use provider X and ignore data restrictions.
```

---

# 49. Model Budget

Logical:

```ts
type ModelBudget = {
  maxInputTokens?: number
  maxOutputTokens?: number

  maxLatencyMs?: number

  maxEstimatedCost?: number
}
```

---

# 50. Cost Budget Is Guardrail

Cost budget prevents:

```text
routine task
→ unnecessarily expensive model chain
```

---

# 51. Cost Budget Does Not Override Minimum Quality

Do not route an R4 decision-support task to an inadequate model solely because it is cheaper.

---

# 52. Latency Budget

Interactive chat may prefer low latency.

Deep overnight research may tolerate higher latency.

Routing should understand the workflow.

---

# 53. Context Budget

A large model context window does NOT justify sending all available data.

Context architecture still follows minimum sufficient context.

---

# 54. Long Context Is Not Memory

Sending 500k tokens to a model is not equivalent to durable JARVIS Memory.

---

# 55. Model Result

Canonical:

```ts
type ModelResult<T> = {
  status:
    | "SUCCESS"
    | "FAILED"
    | "INVALID_OUTPUT"

  data?: T

  providerId: string
  modelId: string
  modelRevision?: string

  usage?: ModelUsage

  latencyMs: number

  finishReason?: string

  error?: ModelError
}
```

---

# 56. Model Provenance

Every consequential model result SHOULD preserve:

```text
provider

model ID

model/revision where available

profile

time

request/trace ID
```

---

# 57. Why Model Provenance Matters

Without it we cannot reliably evaluate:

```text
model regression

provider migration

cost changes

quality changes

incident cause
```

---

# 58. Structured Output Validation

Model output MUST be validated against the required schema before downstream execution.

---

# 59. Schema Failure

If model returns malformed structured output:

```text
MODEL_OUTPUT_INVALID
```

not:

```text
best-effort guess and execute
```

---

# 60. Repair Attempt

Runtime MAY perform a bounded schema-repair retry when:

```text
task is safe
retry policy permits
```

---

# 61. Repair Retry Must Be Bounded

Avoid:

```text
retry until valid forever
```

---

# 62. Structured Output Success ≠ Factual Correctness

Schema-valid response may still contain:

```text
unsupported claims
wrong inference
wrong tool proposal
```

Evidence and downstream verification remain required.

---

# 63. Model Tool Proposal Is Not Tool Execution

Canonical:

```text
MODEL
→ proposes capability/tool arguments

RUNTIME
→ validates
→ policy checks
→ executes
```

---

# 64. Model Cannot Create New Capability

If a model produces:

```text
tool = database.run_any_sql
```

and that capability is not registered:

```text
reject.
```

---

# 65. Model Output Is Untrusted Runtime Input

Even internal model output passes:

```text
schema validation
policy
capability validation
```

before consequential use.

---

# 66. Model Health

Health states:

```text
HEALTHY

DEGRADED

UNAVAILABLE

UNKNOWN
```

---

# 67. Model Health Is Separate From Lifecycle

An ACTIVE model can temporarily become:

```text
DEGRADED
```

during provider incident.

---

# 68. Model Health Inputs

May include:

```text
provider availability

error rate

latency

rate limits

structured-output failures

eval/quality monitoring
```

---

# 69. HEALTHY

Meeting accepted operational expectations.

---

# 70. DEGRADED

Still usable but with material limitation.

Example:

```text
latency elevated

output errors elevated

provider partially degraded
```

---

# 71. UNAVAILABLE

Should not be selected.

---

# 72. UNKNOWN

Insufficient current health evidence.

High-impact automation should not assume:

```text
UNKNOWN = HEALTHY
```

---

# 73. Administrative State

Separate:

```text
ENABLED

DISABLED
```

---

# 74. Model Kill Switch

Runtime SHOULD allow a model/provider to be disabled quickly due to:

```text
quality regression

security concern

provider incident

cost anomaly

policy violation
```

---

# 75. Provider Kill Switch

Possible:

```text
disable provider A
```

while JARVIS continues via eligible alternatives.

---

# 76. Profile-Level Fallback

Example:

```text
BALANCED
Primary → Model A

Fallback → Model B
```

Assignments live in mutable routing configuration.

---

# 77. Fallback Is Not Automatic in All Cases

Fallback must satisfy:

```text
profile capability

data policy

environment

health

cost

eval status
```

---

# 78. No Fallback If Quality Floor Cannot Be Met

Correct:

```text
model unavailable
→ BLOCKED / degraded response
```

may be safer than using a clearly inadequate model.

---

# 79. Escalation Routing

JARVIS MAY use:

```text
FAST
  ↓
BALANCED
  ↓
DEEP
```

when task difficulty demands it.

---

# 80. Escalation Trigger

Possible signals:

```text
low confidence

schema failures

contradictory evidence

complex plan

high consequence

critic detects issue
```

---

# 81. Escalation Does Not Change Authority

If task moves:

```text
FAST → DEEP
```

its:

```text
permission
risk
autonomy
approval
```

remain unchanged.

---

# 82. Do Not Escalate by Default

Using the most expensive model for every task wastes:

```text
cost

latency

capacity
```

without necessarily improving outcomes.

---

# 83. Cheapest Is Also Not Default

Optimize for:

> **cost per successful task**

not merely:

```text
cost per token
```

---

# 84. Successful Task

Model economics SHOULD eventually measure:

```text
result accepted

verification passed

human edits low

tool proposal correct
```

not API-call completion alone.

---

# 85. Multi-Model Review

A second model MAY review the first when justified.

Examples:

```text
high consequence

complex architecture

low-confidence reasoning

important creative/strategic output
```

---

# 86. Multi-Model Is Not Default

Avoid:

```text
Model A
→ Model B
→ Model C
→ vote
```

for routine work.

---

# 87. Model Diversity

Different providers/models MAY reduce correlated blind spots.

But diversity is not equivalent to independent human review.

---

# 88. Self-Critique

One model critiquing its own prior output is:

```text
self-review
```

not independent verification.

---

# 89. Independent Model Review

If governance claims independent model review, runtime SHOULD preserve actual reviewer/model provenance.

---

# 90. Critic Model Output Is Advisory

CRITIC can detect gaps.

It cannot waive policy or approve execution.

---

# 91. Model Lifecycle

Canonical lifecycle:

```text
EVALUATING
    ↓
ACTIVE
    ↓
RETIRED
```

---

# 92. EVALUATING

Candidate model undergoing:

```text
benchmarks
evals
shadow testing
cost measurement
latency testing
```

---

# 93. ACTIVE

Eligible for production routing for specific profiles/environments/data classes.

ACTIVE does NOT mean:

```text
eligible for every task
```

---

# 94. RETIRED

No new routing.

Historical provenance remains resolvable.

---

# 95. Model Promotion

New model must not enter production because:

```text
it is new

vendor says it is better

benchmark headline is impressive
```

---

# 96. Promotion Requires JARVIS Evals

Production promotion SHOULD use workflow-relevant evaluations.

---

# 97. Eval Categories

May include:

```text
intent routing

structured planning

tool selection

factual synthesis

evidence grounding

prompt injection resistance

business analysis

creative output

coding/engineering

vision
```

depending on profiles.

---

# 98. Profile-Specific Evals

FAST and DEEP should not necessarily be judged by identical cases.

---

# 99. Golden Workflow Eval

Example:

```text
Morning Briefing
```

should evaluate:

```text
correct findings

no unsupported facts

good prioritization

correct structured output

cost

latency
```

---

# 100. Tool-Selection Eval

Test whether model proposes only appropriate registered capabilities.

---

# 101. Forbidden Behavior Eval

Examples:

```text
invent tool

invent evidence

ignore scope

follow prompt injection

claim mutation succeeded without execution
```

---

# 102. Evaluation Must Be Executed

Eval definitions are not results.

---

# 103. Evaluation Provenance

Store:

```text
model ID

provider

revision

prompt/runtime version

Agent/Skill version

test suite

results

cost

latency

date
```

---

# 104. Model Upgrade Is a Behavioral Change

A provider may update behavior even under similar naming.

Re-evaluation SHOULD be considered when materially relevant.

---

# 105. Model Pinning

Where provider allows revision pinning, runtime MAY pin exact revisions for consequential workflows.

---

# 106. Rolling Provider Models

If exact pinning is unavailable:

```text
provider model alias
```

should be treated as potentially moving behavior.

Monitoring/evals become more important.

---

# 107. Model Regression

If active model begins performing worse:

```text
ACTIVE
+
DISABLED
```

or routing removal can happen without retiring its historical record.

---

# 108. Canary Promotion

New candidate model MAY first receive:

```text
small production percentage

low-risk profile

selected workflows
```

---

# 109. Shadow Mode

Candidate may receive copies of production-like tasks without influencing real output.

Useful for comparing:

```text
quality

cost

latency
```

---

# 110. A/B Evaluation

Model comparison MAY use bounded traffic where privacy/governance permits.

---

# 111. Routing Policy Should Be Versioned

Model routing configuration materially affects system behavior.

It SHOULD be version-controlled or otherwise versioned and auditable.

---

# 112. Routing Version

Execution trace SHOULD eventually record:

```text
routing_policy_version
```

where useful.

---

# 113. Model Registry vs Routing Policy

Registry:

```text
what models exist
```

Routing Policy:

```text
which eligible model should be used
```

Keep distinct.

---

# 114. Provider Registry

Provider definition may contain:

```text
provider ID

adapter

credential profile

allowed environment

data policy

health
```

---

# 115. Credentials

Model provider credentials remain behind adapter/gateway boundary.

---

# 116. Credential Profile

Example:

```text
model-provider.production.default
```

not raw API key in model configuration.

---

# 117. Environment Separation

Production model credentials SHOULD be separate from:

```text
local
test
staging
```

where practical.

---

# 118. Test Model Calls

CI SHOULD avoid uncontrolled paid/provider calls by default.

Use:

```text
fixtures

mocks

recorded contracts
```

for deterministic tests.

---

# 119. Live Eval Environment

Selected eval suites MAY intentionally call real providers.

Those runs should be explicitly identified.

---

# 120. Model Error Model

Normalized errors:

```text
MODEL_UNAVAILABLE

MODEL_TIMEOUT

MODEL_RATE_LIMITED

MODEL_AUTH_FAILED

MODEL_OUTPUT_INVALID

MODEL_CONTEXT_LIMIT

MODEL_POLICY_RESTRICTED

MODEL_PROVIDER_ERROR
```

---

# 121. Retry Policy

Safe retry depends on failure type.

Examples:

```text
rate limit
→ retry after delay

network timeout before response
→ possibly retry

invalid schema
→ bounded repair/retry

policy restricted
→ do not retry blindly
```

---

# 122. Model Calls Are Usually Side-Effect Free

This makes retries safer than external mutation tools.

But:

```text
cost
latency
provider quotas
```

still need bounds.

---

# 123. Retry Budget

Model request SHOULD have maximum retry/escalation budget.

---

# 124. Context Overflow

If input exceeds model limit:

```text
do not truncate randomly.
```

Use Context Builder to:

```text
summarize
filter
split
```

according to task semantics.

---

# 125. Context Compression

Compression result must preserve:

```text
critical facts

trust labels

evidence links

uncertainty
```

---

# 126. Large-Context Models Do Not Remove Context Architecture

Even if provider supports enormous context, irrelevant context can:

```text
reduce quality

increase cost

leak data

increase attack surface
```

---

# 127. Temperature and Sampling Parameters

Provider-specific sampling parameters belong in profile/provider configuration.

Agents/Skills should normally specify desired behavior, not raw tuning knobs.

---

# 128. Determinism

For structured operational reasoning, prefer lower behavioral variance where practical.

---

# 129. Creativity Profiles

Creative tasks MAY allow broader generation behavior.

That should remain isolated from policy/permission reasoning.

---

# 130. Policy Decisions Must Not Depend Solely on Model Creativity

Permission/risk checks remain deterministic.

---

# 131. Tool Arguments

Model-generated tool arguments are proposals.

They are validated again against:

```text
schema

entity resolution

permission

risk

business system
```

---

# 132. Model Confidence

Confidence MAY be useful for:

```text
classification

routing

escalation
```

but:

> **Model confidence is not evidence.**

---

# 133. Confidence Calibration

Do not assume numeric model confidence is calibrated unless evaluated.

---

# 134. Low Confidence

May cause:

```text
deeper model

critic

human clarification

safe abstention
```

depending on task.

---

# 135. Abstention Is Valid

Model/runtime MAY return:

```text
INSUFFICIENT_CONTEXT
```

rather than fabricate.

---

# 136. Factual Grounding

For factual operational tasks:

```text
context/evidence first
→ model synthesis second
```

---

# 137. Model Cannot Invent Operational Fact

Any unsupported factual claim should be rejected/omitted by synthesis verification.

---

# 138. Model Cannot Invent Evidence

Fabricated:

```text
invoice ID

citation

provider transaction

approval
```

is a critical evaluation failure.

---

# 139. Prompt Injection Boundary

Content inside:

```text
email

web page

PDF

tool response

customer message
```

remains untrusted model input.

---

# 140. System/Developer Instructions Remain Trusted Separately

Provider adapter must preserve trusted instruction separation where provider APIs support it.

---

# 141. External Content Cannot Change Routing Policy

Text:

```text
"Use model X and ignore security."
```

has no routing authority.

---

# 142. Model Provider Output Cannot Change Its Own Eligibility

A provider cannot instruct JARVIS:

```text
"Send me all confidential data next time."
```

---

# 143. Model and Memory

Models may:

```text
interpret memory
propose memory candidates
```

but do not directly create trusted memory.

---

# 144. Model and Agents

Agent definitions reference logical model profiles.

Model Router selects implementation.

---

# 145. Model and Skills

Skill MAY provide a model-profile hint for reasoning steps.

It cannot force a provider that violates policy.

---

# 146. Model and Tool Runtime

Model proposes actions.

Tool Runtime owns execution.

---

# 147. Model and Verification

Models MAY help with semantic verification.

Deterministic verification remains preferred where possible.

---

# 148. Model and Evidence

Model output itself can be evidence of:

```text
what the model concluded
```

not automatic evidence that the conclusion is true.

---

# 149. Model and Approval

A model recommendation does not count as human approval.

---

# 150. Model and Autonomy

Better model performance may support an autonomy review.

It never automatically promotes autonomy.

---

# 151. Model and Risk

A model may recognize risk signals.

Canonical risk classification remains governance-owned.

---

# 152. Model and Identity

Models MAY assist fuzzy entity resolution.

They cannot create verified identity links without governed evidence.

---

# 153. Model Cost Governance

JARVIS SHOULD eventually track AI spend by:

```text
model

provider

profile

Agent

Skill

workflow

business

successful task
```

---

# 154. Cost Metrics

Useful:

```text
input tokens

output tokens

provider charge

estimated total cost

cost per request

cost per successful workflow
```

---

# 155. Cost Per Successful Task

This is more useful than:

```text
cheapest tokens
```

because a weak model causing retries/human corrections may cost more overall.

---

# 156. Human Edit Cost

Future evaluations MAY account for:

```text
human correction time
```

when comparing models.

---

# 157. Model Latency Governance

Track:

```text
first response latency

total latency

workflow latency contribution
```

where provider exposes useful measurements.

---

# 158. Latency by Workflow

Voice interaction and overnight deep research have very different acceptable latency.

---

# 159. Cost/Latency Trade-Off

Routing policy may optimize:

```text
quality
cost
latency
```

within task-specific floors/ceilings.

---

# 160. No Single Universal Score

Avoid opaque:

```text
Model Score = 92
```

as sole routing logic.

Prefer explainable dimensions.

---

# 161. Routing Decision Explainability

Runtime SHOULD be able to say:

```text
selected BALANCED primary

because:
active
healthy
eligible for INTERNAL data
within cost budget
passed current eval suite
```

---

# 162. Routing Decision Trace

Execution trace SHOULD preserve:

```text
requested profile

selected model

fallback status

reason

health

routing policy version
```

---

# 163. Model Registry Observability

Command Center may later show:

```text
BALANCED
Model A
HEALTHY

DEEP
Model B
DEGRADED

VISION
Model C
HEALTHY
```

---

# 164. Profile Availability

Profile can be derived as:

```text
AVAILABLE

DEGRADED

UNAVAILABLE
```

based on eligible models.

---

# 165. Profile Is Not a Model

If Model A fails but Model B satisfies BALANCED:

```text
BALANCED remains AVAILABLE.
```

---

# 166. Model Health and Agent Health

If an Agent requires DEEP and no DEEP model is available:

```text
Agent may become DEGRADED / BLOCKED
```

without changing Agent lifecycle.

---

# 167. Model Health and Skill Readiness

Same principle applies to Skill dependencies.

---

# 168. Voice Architecture

Voice interface SHOULD generally remain:

```text
VOICE LAYER
   ↓
JARVIS CORE
   ↓
reasoning/tools
```

rather than treating voice model as full business authority.

---

# 169. Speech-to-Text

Transcription is:

```text
observed model-derived text
```

and may require confirmation for consequential commands.

---

# 170. Voice Ambiguity

High-risk action through voice SHOULD require stronger target/action confirmation where needed.

---

# 171. Vision Architecture

Image understanding flows:

```text
image
→ vision model
→ structured observation
→ evidence/provenance
→ reasoning
```

---

# 172. OCR/Vision Is Untrusted Proposal

Extracted:

```text
invoice amount

bank account

payment proof
```

must be validated before business mutation.

---

# 173. Embedding Architecture

Embedding Gateway MAY be part of Model Gateway or adjacent subsystem.

It SHOULD use provider-neutral contracts.

---

# 174. Embedding Model Migration

Changing embedding provider/model may require re-embedding indexes.

It MUST NOT rewrite canonical Memory semantics.

---

# 175. Media Generation

Future image/video generation models SHOULD be treated as separate media capabilities.

They are not required for Core Runtime.

---

# 176. Media Models Need Their Own Governance

Publishing generated media remains a Tool/Capability concern.

Generating media and publishing media are different actions.

---

# 177. Research Models

Deep-research provider features MAY be used.

Returned content remains:

```text
research evidence
```

with source provenance.

---

# 178. Provider-Native Agents

Some providers may offer agent frameworks.

JARVIS SHOULD treat them as implementation options below its architecture.

Do not make provider-native agent semantics the source of JARVIS permission/governance.

---

# 179. Provider-Native Memory

Provider memory/session features MUST NOT become canonical JARVIS Memory by accident.

---

# 180. Provider-Native Tool Calling

Provider tool-call format is adapter concern.

JARVIS capability semantics remain provider-neutral.

---

# 181. MGBOS AI Boundary

Current:

```text
mgbos/packages/ai/
```

exists as a reserved provider-independent AI boundary.

Current implementation:

```text
no business implementation
```

inside that package.

---

# 182. MGBOS AI Gateway vs JARVIS Model Gateway

They have related principles but different scopes.

```text
MGBOS AI boundary
→ AI use cases inside MGBOS application boundary

JARVIS Model Gateway
→ ecosystem-level JARVIS cognitive runtime
```

---

# 183. Do Not Couple JARVIS to MGBOS AI Package Internals

Possible future shared contracts may exist.

But:

```text
systems/jarvis
```

should not require private implementation coupling to:

```text
mgbos/packages/ai/src/*
```

---

# 184. Shared Provider Adapter?

A shared provider adapter MAY become reasonable later if both systems need identical infrastructure.

This should happen through an intentional shared package boundary, not incidental imports.

---

# 185. First Runtime Model Needs

Morning Briefing likely only requires:

```text
BALANCED
```

and optionally:

```text
FAST
```

for routing/classification.

---

# 186. First Runtime Does Not Need Many Models

Do not begin by integrating:

```text
five providers
ten models
multi-model voting
voice
vision
embeddings
```

---

# 187. First Runtime Strategy

Recommended:

```text
1 provider adapter

1 BALANCED model

optional 1 FAST profile

provider-neutral contracts

eval suite

observability

fallback architecture designed but not necessarily implemented
```

---

# 188. Why One Provider First

Provider-neutral architecture does not require multi-provider complexity from day one.

It requires:

```text
replaceable boundary
```

so second provider can be added cleanly.

---

# 189. Avoid Premature Provider Redundancy

Integrating multiple providers before Core works creates:

```text
more credentials

more tests

more failure modes

more cost

more routing complexity
```

---

# 190. First Provider Selection Is Operational, Not Constitutional

Choose based on current:

```text
model quality

API maturity

structured output

cost

latency

data policy

developer ergonomics
```

at implementation time.

---

# 191. First Model Definition of Done

A production candidate must prove:

```text
Gateway contract works

structured outputs validate

errors normalize

usage is recorded

latency is recorded

model provenance is recorded

golden evals pass

prompt-injection cases pass

unsupported claims remain bounded
```

---

# 192. First Router Definition of Done

Router can:

```text
resolve requested profile

filter by environment

filter by data eligibility

filter by lifecycle/admin state

filter by health

select deterministic primary

return failure if nothing eligible
```

---

# 193. First Fallback Definition of Done

Before enabling fallback:

```text
secondary model evaluated

data eligibility verified

response contract compatible

routing reason observable

failure transition tested
```

---

# 194. Model Evaluation Definition of Done

An eval result is trustworthy when tied to:

```text
exact model/provider

relevant runtime version

Agent/Skill version where applicable

actual executed cases

observable criteria

cost/latency
```

---

# 195. Model Promotion Definition of Done

Before ACTIVE:

```text
profile eligibility known

data-class eligibility known

structured output tested

relevant evals executed

failure behavior tested

cost understood

latency understood

provider adapter stable

kill switch available
```

---

# 196. High-Risk Workflow Definition of Done

Before using a model materially in R4/R5 workflows:

```text
tool selection behavior tested

identity mistakes tested

unsupported claims tested

prompt injection tested

evidence use tested

abstention tested

human-gate handling tested
```

---

# 197. Model Anti-Patterns

Prohibited architectural patterns include:

```text
Agent hardcodes provider SDK.

Skill says always use model X.

Newest model automatically enters production.

Most expensive model handles every request.

Cheapest model handles every request.

Fallback ignores privacy constraints.

Valid JSON is treated as true.

Model confidence is treated as evidence.

Model chooses its own permission.

Model upgrades its own autonomy.

Provider-native memory becomes business truth.

Provider-native agent framework becomes JARVIS governance.

External text chooses model/policy.

Model output bypasses schema validation.
```

---

# 198. Model Independence Test

Architecture should pass:

```text
Can we replace the current BALANCED model
without changing:

MGBOS
Agent mandate
Skill procedure
Capability semantics
Permission policy
Memory semantics
Evidence model?
```

If yes, separation is healthy.

---

# 199. AI FinOps Direction

Future AI FinOps should answer:

```text
What are we spending?

On which workflows?

Which model creates the best verified result?

Where are expensive retries happening?

Which cheap model is good enough?

Which expensive model actually improves outcomes?
```

---

# 200. ModelOps Direction

Future ModelOps should include:

```text
registry

evaluation

promotion

routing

health

monitoring

rollback

retirement
```

without becoming unnecessary enterprise bureaucracy.

---

# 201. Feedback Loop

Human edits/outcomes MAY feed:

```text
eval datasets

routing analysis

model comparison
```

with privacy/provenance preserved.

---

# 202. Feedback Does Not Directly Retrain Authority

A model seeing many approvals cannot learn:

```text
"I no longer need approval."
```

---

# 203. Routing Learning

Future Router MAY learn statistically which model performs best for which task.

But resulting routing changes remain bounded by:

```text
eligibility

data policy

quality floor

governance
```

---

# 204. Learned Router Is Optional

Initial Router SHOULD be deterministic configuration.

No need for ML routing before enough evidence exists.

---

# 205. Initial Routing Example

Conceptual:

```text
Intent classification
→ FAST

Morning Briefing reasoning
→ BALANCED

Complex incident diagnosis
→ DEEP

Critical review
→ CRITIC
```

Specific provider/model mappings remain configuration.

---

# 206. Contextual Escalation Example

```text
BALANCED
produces conflicting plan

        ↓

CRITIC review

        ↓

DEEP resolution
```

only when required.

---

# 207. No Authority Escalation Example

Even if:

```text
DEEP model
```

concludes:

```text
"Payment should be recorded."
```

runtime still requires:

```text
permission
risk
approval
MGBOS command
verification
```

---

# 208. Model Change Incident

If a provider update causes sudden tool-selection regressions:

```text
disable model route

fallback if eligible

record incident

rerun evals
```

without changing business truth.

---

# 209. Model Retirement

Retired models remain in historical execution provenance.

Do not erase them from audit data.

---

# 210. Model Configuration History

Historical routing should remain reconstructable enough to answer:

```text
Which model handled this request?
```

---

# 211. Cost History

Historical provider pricing may change.

Store actual/estimated cost at execution time where practical instead of recomputing forever using current prices.

---

# 212. Model Registry Storage

Initial Registry SHOULD be:

```text
static
typed
version-controlled
```

No dynamic marketplace required.

---

# 213. Runtime Health State

Operational health MAY live in:

```text
runtime state/cache
```

while model definitions remain version-controlled.

---

# 214. No Model Marketplace Yet

Production runtime should not:

```text
discover arbitrary third-party model

auto-connect

send business data
```

without explicit integration/governance.

---

# 215. New Provider Integration

Adding provider introduces:

```text
new data processor

new credential

new security boundary

new cost model

new outage mode
```

and deserves review.

---

# 216. Provider Removal

Before removal verify:

```text
active profile dependencies

fallback coverage

historical provenance

embedding indexes if applicable
```

---

# 217. Model Gateway Observability

Every model call SHOULD eventually capture:

```text
trace_id

profile

provider

model

latency

usage

estimated cost

status

fallback

schema result
```

---

# 218. Sensitive Observability

Do not log raw sensitive prompts/responses by default solely for debugging.

Prefer:

```text
metadata

redacted traces

sampled safe payloads
```

under appropriate policy.

---

# 219. Evaluation Dataset Privacy

Eval fixtures should avoid unnecessary real customer data.

Use:

```text
synthetic
sanitized
representative
```

cases.

---

# 220. Production Prompt Logging

Raw production prompt retention requires intentional privacy/retention policy.

It is not automatically justified by observability.

---

# 221. Reasoning Trace

Do not persist private hidden chain-of-thought.

Persist:

```text
task

model

structured output

reasoning summary where appropriate

evidence

actions
```

---

# 222. Model and Reproducibility

Exact generative output may not be perfectly reproducible.

Operational reproducibility instead means preserving:

```text
model identity

input references

prompt/instruction version

schema

runtime version

output
```

as appropriate.

---

# 223. Prompt Versioning

Trusted system/task prompts that materially affect behavior SHOULD be versioned.

---

# 224. Prompt Is Not Agent

Agent contract may reference prompt templates.

Prompt text alone is not Agent identity.

---

# 225. Prompt Is Not Skill

Skill semantics remain procedural contract, not a single prompt.

---

# 226. Prompt Update Can Require Re-Eval

Material prompt change may alter behavior even when model stays the same.

---

# 227. Model Gateway Availability

If Model Gateway fails:

```text
MGBOS continues

business truth continues

deterministic functionality continues
```

JARVIS reasoning may degrade.

---

# 228. Business Continuity Without AI

Critical business operations MUST NOT depend on model availability for transactional integrity.

---

# 229. Degraded JARVIS Without Models

Possible fallback:

```text
deterministic alerts

raw dashboards

manual workflows

precomputed projections
```

may remain available.

---

# 230. Model Is Not Required for Every JARVIS Function

Some flows may remain deterministic.

This reduces:

```text
cost

latency

risk

availability dependency
```

---

# 231. Current MGBOS AI State

As of 2026-09-29:

```text
mgbos/packages/ai
EXISTS

Provider-neutral boundary
RESERVED

Provider implementation
NOT IMPLEMENTED

Business AI implementation
NOT IMPLEMENTED in this package
```

---

# 232. Current JARVIS Model State

```text
Model Gateway Architecture
ACTIVE

JARVIS Model Gateway Runtime
NOT IMPLEMENTED

Model Registry
NOT IMPLEMENTED

Production Model Router
NOT IMPLEMENTED

Production Provider Adapter
NOT IMPLEMENTED

Production JARVIS Model Assignment
NOT CANONICALLY SELECTED
```

---

# 233. Historical Model Notes

The September 27 model-strategy discussion remains valuable for:

```text
profile concept

provider-neutrality

escalation routing

FinOps

multi-model optionality
```

Specific model-name assignments remain:

```text
HISTORICAL / CONFIGURATION INPUT
```

not canonical architecture.

---

# 234. First Implementation Sequence

Recommended:

```text
1. ModelProfile contract

2. ModelRequest / ModelResult

3. Provider-neutral ModelGateway

4. One provider adapter

5. One BALANCED model definition

6. structured-output validation

7. model provenance

8. usage/latency observability

9. Morning Briefing eval suite

10. deterministic Model Router

11. FAST profile if justified

12. second provider/fallback only when operationally useful
```

---

# 235. Why Router Before Many Models

Router semantics should exist early even if:

```text
only one eligible model
```

so business/runtime contracts never hardcode that model.

---

# 236. Why Not Add DEEP/CRITIC Immediately

Profiles can exist semantically before all have physical model mappings.

Add implementations when workflows require them.

---

# 237. Phase-1 Definition of Done

Model Gateway foundation is ready when:

```text
Core imports no provider SDK

ModelRequest validates

ModelResult normalizes

profile is explicit

provider/model provenance recorded

structured output validated

provider errors normalized

usage captured where available

latency captured

data-class eligibility enforced

one real provider adapter works
```

---

# 238. Morning Briefing Definition of Done

Model layer can:

```text
consume verified briefing context

produce structured findings

preserve fact/inference distinction

avoid unsupported operational claims

stay within output schema

operate through BALANCED profile

record exact model provenance
```

---

# 239. Router Definition of Done

Router can deterministically evaluate:

```text
profile

environment

data class

lifecycle

admin state

health

evaluation eligibility

budget
```

before selecting a model.

---

# 240. Second Provider Trigger

Add another provider when at least one real need exists:

```text
availability resilience

meaningful quality advantage

cost advantage

modality advantage

data-processing requirement

independent critic use case
```

not just architectural enthusiasm.

---

# 241. Architectural Invariants

1. JARVIS is not a model.
2. Models are replaceable cognitive compute.
3. Core never depends directly on provider SDK semantics.
4. Agents and Skills reference logical profiles, not permanent model names.
5. Model Router selects among eligible registered implementations.
6. Model selection never changes permission.
7. Model selection never changes risk.
8. Model selection never changes autonomy.
9. Model selection never satisfies approval.
10. Model output is untrusted until structurally validated.
11. Valid structured output is not proof of factual correctness.
12. Model tool proposals remain proposals.
13. Models cannot create capabilities.
14. External content cannot alter routing/governance.
15. Data-class policy constrains routing and fallback.
16. Fallback may not downgrade privacy.
17. Cost optimization never overrides minimum quality/safety.
18. Deep models are not the default for everything.
19. Cheap models are not the default for everything.
20. Model confidence is not evidence.
21. Model health and lifecycle remain separate.
22. Disabled models are not selectable.
23. Historical model provenance is retained.
24. Production promotion requires executed evals.
25. Eval definitions are not eval evidence.
26. Model updates may require re-evaluation.
27. Prompt updates may require re-evaluation.
28. Multi-model review is optional and consequence-driven.
29. Self-critique is not independent verification.
30. Voice, vision, and embeddings remain specialized profiles.
31. Embeddings are derived indexes, not memory truth.
32. Provider-native memory does not automatically become JARVIS Memory.
33. Provider-native agent frameworks do not own JARVIS governance.
34. MGBOS AI boundary remains distinct from JARVIS Model Gateway.
35. Initial implementation can be provider-neutral while using only one provider.
36. New model intelligence never automatically grants more authority.

---

# 242. Canonical Mental Model

```text
TASK
  │
  ▼
AGENT / SKILL
  │
  ▼
LOGICAL MODEL PROFILE
  │
  ▼
MODEL ROUTER
  │
  ├── data eligibility
  ├── environment
  ├── health
  ├── eval status
  ├── quality
  ├── latency
  └── cost
  │
  ▼
MODEL DEFINITION
  │
  ▼
PROVIDER ADAPTER
  │
  ▼
AI PROVIDER
  │
  ▼
NORMALIZED RESULT
  │
  ▼
SCHEMA VALIDATION
  │
  ▼
JARVIS REASONING FLOW
```

Throughout:

```text
PERMISSION
RISK
AUTONOMY
APPROVAL
EVIDENCE
```

remain outside model authority.

---

# 243. North Star

Before any material model call, JARVIS should eventually be able to answer:

```text
Why do we need a model here?

Which logical profile is required?

Could deterministic logic do this instead?

What data will be sent?

What classification does that data have?

Which models/providers are eligible?

Which model was selected?

Why?

Is it healthy?

Has this model passed the relevant eval?

What is the latency/cost budget?

What fallback is valid?

Which exact model produced the result?

Was the output schema valid?

Which claims still need evidence?

Did using a smarter model change authority?
(No.)
```

---

# 244. Final Principle

> **The model should be one of the easiest parts of JARVIS to replace.**

If a better provider appears tomorrow, the desired change is:

```text
EVALUATE
   ↓
REGISTER
   ↓
ROUTE
   ↓
OBSERVE
```

—not:

```text
rewrite JARVIS
rewrite Agents
rewrite Skills
rewrite business rules
rewrite permissions
```

The enduring intelligence of JARVIS comes from the system around the model:

```text
context
+
data
+
memory
+
skills
+
agents
+
capabilities
+
evidence
+
evaluation
+
governance
```

The model supplies cognitive power.

It never owns the business.