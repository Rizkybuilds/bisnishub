---
canonical_id: jarvis.architecture
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: jarvis
document_class: canonical-specification
effective_from: 2026-09-29
authoritative_for:
  - jarvis system architecture
  - jarvis runtime topology
  - jarvis core module boundaries
  - jarvis orchestration architecture
  - jarvis context and planning architecture
  - jarvis policy coordination
  - jarvis execution and verification architecture
  - jarvis evidence integration
  - jarvis model gateway boundary
  - jarvis memory boundary
  - jarvis agent-skill-tool relationships
  - jarvis event intake architecture
  - jarvis datastore ownership
  - jarvis command center architecture
  - jarvis external system boundaries
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - charter.md
  - ../../../docs/governance/documentation-constitution.md
  - ../../../docs/governance/canonical-source-map.md
  - ../../../docs/governance/cross-system-risk-classification.md
  - ../../../docs/governance/autonomy-levels.md
  - ../../../docs/governance/approval-policy.md
  - ../../../docs/governance/evidence-provenance-model.md
  - ../../../docs/architecture/master-system-blueprint.md
  - ../../../docs/architecture/system-boundaries.md
  - ../../../docs/architecture/architectural-laws.md
  - ../../mgbos/docs/architecture/permission-authorization-model.md
  - ../../mgbos/docs/architecture/command-event-model.md
supersedes:
  - ../../../catatan/sesi/2026-09-27 - JARVIS Architecture v0.1.md
implementation_status: NOT_IMPLEMENTED
target_runtime_location: systems/jarvis/
---

# JARVIS Architecture v1.0

## 1. Purpose

Dokumen ini mendefinisikan arsitektur canonical JARVIS.

Charter menjawab:

```text
WHY does JARVIS exist?
```

Dokumen ini menjawab:

```text
HOW is JARVIS structurally organized?
```

Arsitektur ini mencakup:

```text
Core Runtime
Intent
Context
Planning
Policy Coordination
Execution
Verification
Evidence
Models
Memory
Agents
Skills
Tools
Events
Datastore
Interfaces
Observability
Failure Handling
```

---

# 2. Architectural Style

JARVIS uses:

```text
Provider-neutral
Capability-oriented
Tool-mediated
Evidence-first
Human-governed
Event-ready
Modular
Contract-driven
```

architecture.

It is intentionally NOT:

```text
model-centric
provider-centric
agent-swarm-centric
workflow-engine-centric
database-centric
```

---

# 3. Primary Architectural Law

> **JARVIS may reason about the world, but it interacts with the world only through governed capabilities.**

Canonical:

```text
INTENT
  ↓
CONTEXT
  ↓
PLAN
  ↓
POLICY
  ↓
CAPABILITY
  ↓
EXECUTION
  ↓
VERIFICATION
  ↓
EVIDENCE
```

---

# 4. Core Topology

```text
┌─────────────────────────────────────────────┐
│                 INTERFACES                  │
│ Chat / API / CLI / Command Center / Events │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│                JARVIS CORE                  │
│                                             │
│ Intent Router                               │
│ Context Builder                             │
│ Planner                                     │
│ Policy Coordinator                          │
│ Execution Coordinator                       │
│ Verification Coordinator                    │
│ Synthesis                                   │
└──────┬─────────┬──────────┬──────────┬──────┘
       │         │          │          │
       ▼         ▼          ▼          ▼
   AGENTS      SKILLS      TOOLS     MODELS
                              │
                              ▼
                      EXTERNAL SYSTEMS
```

Supporting layers:

```text
Memory
Evidence
Events
Observability
Runtime Datastore
```

---

# 5. JARVIS Core

JARVIS Core is:

> **the deterministic and reasoning-assisted coordinator of a JARVIS request or event.**

Core MUST remain thin.

It does NOT own:

```text
business truth
credentials
business invariants
provider SDK behavior
specialist domain personas
```

---

# 6. Core Responsibility

Core coordinates:

```text
request lifecycle
intent
context
plan
policy checks
capability resolution
execution
verification
synthesis
evidence
failure
```

It should answer:

```text
What are we trying to accomplish?

What context matters?

What capabilities are needed?

Are they allowed?

What should execute?

Did it work?

What can we safely conclude?
```

---

# 7. Core Is Not a Giant Model Prompt

Forbidden architecture:

```text
Everything
   ↓
One huge system prompt
   ↓
One model
   ↓
All tools
```

This makes:

```text
authority opaque
context excessive
testing difficult
failure coupled
provider replacement expensive
```

---

# 8. Runtime Entry Points

JARVIS may eventually accept input through:

```text
Chat
HTTP/API
CLI
Event Intake
Schedule
Command Center
Voice
Desktop
Mobile
```

All inputs MUST normalize into a shared runtime request.

---

# 9. Request Sources

Logical source types:

```text
HUMAN
API
EVENT
SCHEDULE
AUTOMATION
SYSTEM
```

Source affects:

```text
identity
authority
context
response expectations
```

but does not bypass governance.

---

# 10. Request Contract

Target logical shape:

```text
JarvisRequest

request_id
trace_id
source
actor
environment
organization_scope
intent_hint
input
context_refs
created_at
```

Exact implementation belongs to Core Runtime specification.

---

# 11. Runtime Lifecycle

Canonical lifecycle:

```text
RECEIVED
   ↓
IDENTIFYING_INTENT
   ↓
BUILDING_CONTEXT
   ↓
PLANNING
   ↓
POLICY_CHECK
   ↓
EXECUTING
   ↓
VERIFYING
   ↓
SYNTHESIZING
   ↓
COMPLETED
```

Failure/alternate states:

```text
DENIED
NEEDS_APPROVAL
NEEDS_HUMAN
PARTIAL
FAILED
UNKNOWN
NEEDS_RECONCILIATION
```

---

# 12. Intent Router

Intent Router determines:

> **What kind of outcome is being requested?**

Examples:

```text
business.daily_briefing
business.finance.review
business.operations.review
business.customer.followup
engineering.code.change
research.market.analysis
content.prepare
```

---

# 13. Intent Is Not Execution Plan

Intent:

```text
"review business health"
```

does not define:

```text
which tools
which model
which agent
which sequence
```

Planner handles those decisions.

---

# 14. Intent Taxonomy Should Remain Small

Do NOT start with:

```text
500 handcrafted intents
```

Prefer broad durable intent families.

Specific detail remains in structured context.

---

# 15. Intent Classification May Use AI

Natural-language requests may require model reasoning.

But the output SHOULD be structured and validated.

---

# 16. Intent Does Not Grant Permission

Recognizing:

```text
payment.record
```

does not mean the caller may execute it.

Permission is evaluated separately.

---

# 17. Context Builder

Context Builder creates:

> **the minimum sufficient trusted context required for the task.**

Possible context sources:

```text
actor identity
organization
environment
current request
canonical policies
current business data
memory
documents
events
previous workflow state
tool registry
```

---

# 18. Context Builder Principle

> **Retrieve what the task needs, not everything JARVIS knows.**

Avoid:

```text
all MGBOS records
all memories
all files
all conversation history
all policies
```

in every model request.

---

# 19. Context Classes

Logical context classes include:

```text
AUTHORITY_CONTEXT
BUSINESS_CONTEXT
KNOWLEDGE_CONTEXT
MEMORY_CONTEXT
TEMPORAL_CONTEXT
TOOL_CONTEXT
EXECUTION_CONTEXT
```

---

# 20. Authority Context

Contains relevant:

```text
identity
permissions
risk policy
autonomy
approval status
environment
organization scope
```

Authority context MUST come from trusted sources.

---

# 21. Business Context

Contains current business state such as:

```text
invoice
order
production
inventory
vendor
customer
```

through governed query capabilities.

---

# 22. Knowledge Context

May include:

```text
canonical documentation
SOP
business strategy
research
technical documentation
```

with provenance preserved.

---

# 23. Memory Context

May include:

```text
preferences
past decisions
episodic context
previous findings
```

Memory does NOT become current transactional truth.

---

# 24. Temporal Context

Should eventually include:

```text
current time
timezone
business date
deadline
SLA
schedule
quiet hours
```

Explicit time semantics become essential for proactive JARVIS.

---

# 25. Context Trust Labels

Context SHOULD be distinguishable by trust/source class:

```text
AUTHORITATIVE
CANONICAL
OBSERVED
MEMORY
EXTERNAL
INFERRED
UNTRUSTED
```

This helps prevent external-content authority leakage.

---

# 26. External Content Boundary

Content retrieved from:

```text
website
email
PDF
customer message
vendor message
GitHub issue
```

enters Context as:

```text
DATA
```

not policy.

---

# 27. Context Budget

Context Builder SHOULD control:

```text
token size
data sensitivity
freshness
relevance
duplication
```

More context is not automatically better.

---

# 28. Context Summarization

Large sources MAY be summarized before reasoning.

Summary MUST preserve:

```text
source reference
important factual distinctions
uncertainty
```

---

# 29. Planner

Planner transforms:

```text
intent + context
```

into:

```text
ExecutionPlan
```

---

# 30. Planner Output

A plan SHOULD describe:

```text
goal
steps
capabilities
dependencies
expected evidence
risk expectations
verification expectations
```

---

# 31. Planner Chooses Capabilities

Correct:

```text
mgbos.finance.summary.read
```

Not:

```text
call Supabase function xyz
```

Provider-specific resolution belongs downstream.

---

# 32. Planner Does Not Grant Permission

Planner can propose:

```text
mgbos.payment.record
```

even if policy later denies it.

Planning and authority remain separate.

---

# 33. Planner May Produce No-Tool Plan

Some tasks need only:

```text
reasoning
known context
creative generation
```

No tool call is required.

---

# 34. Planner May Produce Clarification/Exception

If essential information cannot be established:

```text
NEEDS_HUMAN
```

or equivalent is a valid plan outcome.

---

# 35. Planner Should Prefer Simplicity

Use:

```text
fewest capabilities necessary
```

for the task.

Do not create elaborate multi-agent workflows for trivial work.

---

# 36. Policy Coordinator

Policy Coordinator evaluates whether proposed steps may proceed.

It coordinates canonical governance covering:

```text
permission
risk
autonomy
approval
environment
data policy
tool state
```

---

# 37. Policy Coordinator Does Not Invent Policy

Policy semantics come from authoritative governance.

The model may help identify context.

It MUST NOT make arbitrary exceptions.

---

# 38. Policy Decision

Logical results include:

```text
ALLOW
DENY
REQUIRE_APPROVAL
NEEDS_HUMAN
OUT_OF_SCOPE
```

---

# 39. Policy Is Evaluated Per Consequential Step

Do not assume:

```text
plan approved
→ every future step approved
```

A later step may have different:

```text
risk
capability
scope
state
```

---

# 40. Policy Re-evaluation

Policy SHOULD be re-evaluated when:

```text
material parameters change
effective risk rises
tool changes
environment changes
approval expires
resource state changes materially
```

---

# 41. Execution Coordinator

Execution Coordinator performs approved plan steps.

Responsibilities:

```text
resolve tool
validate input
apply policy result
invoke tool
record execution state
handle retries safely
collect result
route to verification
```

---

# 42. Execution Coordinator Is Not Business Logic

It should not decide:

```text
payment allocation
stock validity
order transition legality
```

Those remain with MGBOS/domain systems.

---

# 43. Tool Registry

Tool Registry defines the capabilities JARVIS can access.

Logical record includes:

```text
tool_id
capability_id
provider/adapter
input contract
output contract
risk floor
environments
mutation flag
verification policy
health
```

---

# 44. Capability vs Tool

Capability:

```text
what JARVIS wants to do
```

Tool:

```text
how that capability is currently implemented
```

Example:

```text
Capability:
mgbos.invoice.read

Tool implementation:
MGBOS Internal API Adapter
```

---

# 45. Tool Registry Is Not Permission Registry

A tool existing means:

```text
system can potentially execute it
```

not:

```text
every actor may execute it
```

---

# 46. Tool Adapter

Adapter converts canonical JARVIS contracts into provider/system-specific interfaces.

Examples:

```text
MGBOS API adapter
GitHub adapter
Email provider adapter
Browser adapter
MCP adapter
```

---

# 47. Provider Details Stop at Adapter Boundary

Core SHOULD NOT need to know:

```text
Supabase RPC name
GitHub REST endpoint
WhatsApp API version
provider OAuth semantics
```

unless required by capability semantics.

---

# 48. Credentials Boundary

Credentials belong behind adapters/gateways.

Preferred:

```text
JARVIS
→ capability
→ adapter/gateway
→ secret retrieval
→ provider
```

Model context should not contain raw credential values.

---

# 49. Tool Result

Canonical tool result SHOULD contain:

```text
status
structured data
evidence
provider reference
error classification
```

---

# 50. Tool Status Is Not Business Success

Example:

```text
tool_result.status = success
```

may only mean:

```text
provider accepted request
```

Verification determines business outcome.

---

# 51. Verification Engine

Verification Engine answers:

> **Did the intended result actually occur, and what can we safely claim?**

---

# 52. Verification Types

Possible verification includes:

```text
schema validation
source validation
freshness
state re-read
postcondition
provider lookup
audit existence
business invariant
cross-source reconciliation
```

---

# 53. Verification Policy

Each consequential capability SHOULD eventually define:

```text
what success means
how it is verified
what evidence is required
what happens if verification fails
```

---

# 54. Read Verification

For read capability:

```text
schema valid
source correct
organization correct
freshness valid
```

may be sufficient.

---

# 55. Mutation Verification

For mutation:

```text
request accepted
+
authoritative postcondition
```

is preferred.

---

# 56. Verification Failure

Possible result:

```text
VERIFICATION_FAILED
```

does not necessarily mean:

```text
execution failed
```

The outcome may be uncertain.

---

# 57. Unknown Outcome

Canonical:

```text
EXECUTION ATTEMPTED
+
OUTCOME UNCONFIRMED
=
UNKNOWN / NEEDS_RECONCILIATION
```

not:

```text
SUCCESS
```

---

# 58. Reconciliation

Reconciliation is required where external side effects may have occurred but response is uncertain.

Typical cases:

```text
payment
email
social publish
purchase order
external booking
```

---

# 59. Evidence Layer

Every material runtime flow SHOULD preserve evidence supporting:

```text
input facts
policy decisions
execution
verification
final claims
```

---

# 60. Evidence Is Shared Infrastructure

Evidence is used by:

```text
Core
Verification
Synthesis
Decision Inbox
Observability
Autonomy evaluation
Incident analysis
```

---

# 61. Evidence Layer Is Not Business SoR

JARVIS evidence references MGBOS truth.

It does not replace MGBOS.

---

# 62. Synthesis Layer

Synthesis transforms verified outputs into human-usable understanding.

Examples:

```text
briefing
answer
finding
recommendation
decision package
execution report
```

---

# 63. Synthesis Does Not Add Unsupported Facts

Canonical rule:

> **Every material factual claim must be supportable from evidence.**

---

# 64. Synthesis Separates Fact and Interpretation

Preferred:

```text
FACT
Production Job A is two days behind schedule.

INFERENCE
Customer deadline is now at risk.

RECOMMENDATION
Consider Vendor B.
```

---

# 65. Model Gateway

Model Gateway provides a provider-neutral interface to cognitive models.

Core should call logical profiles.

---

# 66. Model Profiles

Target profiles may include:

```text
FAST
BALANCED
DEEP
CRITIC
CREATIVE
VISION
VOICE
```

These are behavioral/capability profiles.

Not permanent provider names.

---

# 67. Model Router

Model Router selects an implementation based on:

```text
task type
risk
quality need
latency
cost
context size
modality
availability
```

---

# 68. Model Router Does Not Own Business Policy

It may choose:

```text
which model
```

It cannot choose:

```text
whether payment approval is required
```

---

# 69. Model Provider Failure

If preferred provider fails:

```text
fallback model
```

MAY be used if:

```text
policy permits
capability quality remains adequate
data classification permits provider
```

---

# 70. Model Output Validation

Structured model output SHOULD be validated before use in downstream deterministic systems.

Never assume valid JSON/tool arguments merely because model generated them.

---

# 71. Deterministic Core Functions

Prefer deterministic implementation for:

```text
permissions
risk floor
schema validation
tool lookup
execution state
idempotency
evidence linking
freshness arithmetic
approval status
```

---

# 72. Reasoning Functions

AI reasoning is suitable for:

```text
intent interpretation
planning
prioritization
summarization
recommendation
ambiguity analysis
document interpretation
```

---

# 73. Agent Layer

Agents are optional specialist reasoning components.

They should be added only when specialization improves:

```text
quality
context isolation
evaluation
governance
maintainability
```

---

# 74. Initial Agent Strategy

Early Core Runtime SHOULD work:

```text
without multi-agent orchestration
```

One planner/reasoning flow is enough for the first vertical slice.

---

# 75. Specialist Agent Examples

Future agents MAY include:

```text
CFO
COO
Sales
Researcher
Content
Auditor
Engineering
```

But each requires a distinct mandate.

---

# 76. Agent Contract

Each agent SHOULD eventually define:

```text
purpose
scope
allowed intents
allowed capabilities
forbidden capabilities
context policy
output contract
evaluation criteria
```

---

# 77. Agent Does Not Own Tools

An agent may be eligible to use a subset of tools.

Tools remain registry-owned capabilities.

---

# 78. Agent Does Not Own Skills

Agent invokes/reasons through Skills.

Skill itself remains reusable operating knowledge.

---

# 79. Agent Does Not Own Memory

Agents may consume scoped memory.

They do not independently create competing memory silos without architecture.

---

# 80. Skill Layer

Skills encode repeatable procedural knowledge.

A mature skill may contain:

```text
human-readable procedure
machine-readable contract
allowed capabilities
risk hints
verification
evidence rules
failure handling
```

---

# 81. Skill Is Not Tool

Example:

```text
Skill:
reconcile-customer-payment

Tools:
mgbos.invoice.read
provider.payment.read
mgbos.payment.record
```

---

# 82. Skill Is Not Agent

The same payment reconciliation skill may be used by:

```text
CFO Agent
Finance Assistant
Founder workflow
```

subject to permissions.

---

# 83. Skill Cannot Grant Authority

If skill declares:

```text
allowed_tools:
mgbos.payment.record
```

runtime policy still determines whether the principal may call it.

---

# 84. Memory Architecture Boundary

Detailed Memory Architecture belongs to a dedicated canonical spec.

This architecture reserves logical classes:

```text
Working Memory
Episodic Memory
Semantic Memory
Preference Memory
Evidence References
```

---

# 85. Working Memory

Short-lived task state:

```text
current goal
current plan
current findings
temporary context
```

Should normally expire.

---

# 86. Episodic Memory

Historical experience:

```text
past interaction
past incident
past execution
past decision
```

Useful for continuity.

Not current operational truth.

---

# 87. Semantic Memory

Stable learned knowledge such as:

```text
concept
business relationship
known operational pattern
```

should preserve provenance where possible.

---

# 88. Preference Memory

Contains:

```text
style
workflow preference
communication preference
decision preference
```

Preference MUST NOT override:

```text
permission
security
policy
business invariant
```

---

# 89. Evidence Memory

May retain references to verified prior evidence.

It must still respect freshness.

---

# 90. Memory Retrieval

Memory retrieval is:

```text
context discovery
```

not truth arbitration.

Current authoritative source wins.

---

# 91. Vector Search

Embeddings MAY help retrieve:

```text
documents
memory
knowledge
```

Vector database is NOT mandatory for v1 runtime.

---

# 92. JARVIS Datastore

JARVIS SHOULD have logical datastore ownership distinct from MGBOS.

Owns runtime data such as:

```text
requests
executions
tool calls
evidence references
policy decisions
runtime state
future memory
event intake metadata
```

---

# 93. MGBOS Tables Must Not Become JARVIS Runtime Tables

Avoid inserting:

```text
jarvis_execution
jarvis_memory
jarvis_agent_state
```

inside MGBOS business schemas merely for convenience.

---

# 94. Physical Infrastructure May Initially Be Shared

Logical ownership does not require separate database server immediately.

Early environments MAY share infrastructure.

Schema/ownership boundaries must remain explicit.

---

# 95. JARVIS Datastore Is Not a Business Database

JARVIS datastore MUST NOT become the canonical home for:

```text
orders
payments
inventory
production jobs
```

---

# 96. Event Intake

JARVIS eventually needs an Event Intake boundary accepting:

```text
MGBOS business events
engineering events
external events
schedules
monitoring events
```

---

# 97. Event Intake Normalization

Raw event:

```text
provider-specific payload
```

should normalize into:

```text
EventEnvelope
```

before Core processing.

---

# 98. Event Envelope

Logical event metadata:

```text
event_id
event_type
source
occurred_at
organization_scope
correlation_id
causation_id
payload
```

---

# 99. Event Is Trigger, Not Authority

Event starts:

```text
context evaluation
```

not arbitrary execution.

---

# 100. Event Deduplication

Repeated event delivery SHOULD NOT produce repeated consequential effects.

Event identity must be retained.

---

# 101. Scheduled Intake

Scheduled jobs should enter through a similar governed intake path.

Example:

```text
08:00 Morning Briefing Trigger
```

means:

```text
evaluate business.daily_briefing
```

not unrestricted workflow execution.

---

# 102. Event Intelligence

Future Event Intelligence determines:

```text
is this event meaningful?
is it duplicate?
does it require context?
does it require notification?
does it require action?
```

---

# 103. Proactive Intelligence

Proactive JARVIS combines:

```text
events
current state
policy
memory
priority
```

to decide whether something deserves attention.

---

# 104. Proactive Intelligence Does Not Mean Auto-Mutation

A proactive finding may yield:

```text
ignore
log
notify
recommend
prepare
request approval
execute within L4 policy
```

depending on governance.

---

# 105. Notification Layer

Notifications are delivery surfaces.

They should not contain independent decision logic.

Future channels may include:

```text
Command Center
mobile push
email
WhatsApp
desktop
voice
```

---

# 106. Command Center

Command Center is the human management interface for JARVIS.

It SHOULD eventually present:

```text
briefing
exceptions
Decision Inbox
execution status
tool activity
evidence
incidents
automation status
```

---

# 107. Command Center Is Not Core

UI may change without changing JARVIS architecture.

Core operates independently of one presentation surface.

---

# 108. Decision Inbox

Decision Inbox consumes:

```text
prepared actions
approval policy
risk
evidence
impact
```

and provides authenticated human decisions.

---

# 109. Exception Queue

Exception Queue stores work that cannot safely progress automatically.

Examples:

```text
NEEDS_HUMAN
NEEDS_RECONCILIATION
AMBIGUOUS
POLICY_CONFLICT
VERIFICATION_FAILED
```

---

# 110. Exception Queue Is First-Class

JARVIS MUST NOT force every workflow into:

```text
SUCCESS / FAILURE
```

Business reality often requires:

```text
waiting for human
waiting for provider
waiting for evidence
```

---

# 111. Observability Architecture

Every significant execution SHOULD produce a trace.

Logical hierarchy:

```text
trace
├── request
├── intent
├── context
├── planning
├── policy
├── agent/skill
├── tool call
├── verification
└── synthesis
```

---

# 112. Trace Data

Useful metadata:

```text
trace_id
request_id
duration
model
tool
agent
skill
policy result
risk
status
cost
error
```

---

# 113. Observability Is Not Evidence

Logs/traces tell us what the runtime did.

Evidence tells us what supports a factual/business claim.

They overlap but are distinct.

---

# 114. Audit Architecture

Consequential activity SHOULD preserve an audit record sufficient to reconstruct:

```text
who
what
when
why
authority
tool
outcome
evidence
```

---

# 115. Failure Architecture

Failure is a normal state.

Categories include:

```text
model failure
tool failure
policy denial
schema failure
context failure
provider failure
verification failure
timeout
rate limit
partial execution
```

---

# 116. Failure Classification

Errors SHOULD distinguish:

```text
RETRYABLE
NON_RETRYABLE
UNKNOWN_OUTCOME
POLICY
VALIDATION
```

Blind retry is forbidden for consequential unknown outcomes.

---

# 117. Retry

Safe retry requires understanding:

```text
idempotency
side effect state
provider behavior
```

---

# 118. Partial Failure

If:

```text
finance query succeeds
inventory query fails
```

Morning Briefing MAY still complete as:

```text
PARTIAL
```

with limitations disclosed.

---

# 119. Failure Containment

A failing:

```text
GitHub tool
```

should not unnecessarily break:

```text
MGBOS finance query
```

Subsystem failures should be contained where possible.

---

# 120. Durable Workflow Direction

Long-running workflows eventually require persistence beyond one process lifetime.

Need arises when workflows:

```text
wait hours/days
cross providers
require approval
have uncertain callbacks
need recovery after restart
```

---

# 121. Durable Workflow Is Not Required for v0.2

Do not introduce:

```text
Temporal
complex workflow engine
Kafka
```

before a real workflow requires durable orchestration.

---

# 122. n8n May Provide Durable-Orchestration Help

n8n MAY handle:

```text
schedule
wait
retry
routing
provider integration
```

where suitable.

JARVIS still owns reasoning/policy coordination.

---

# 123. Environment Architecture

Canonical environments:

```text
LOCAL
TEST/CI
STAGING
PRODUCTION
```

---

# 124. Local

Suitable for:

```text
development
experimentation
synthetic data
destructive sandbox tests
```

---

# 125. Test / CI

Suitable for:

```text
deterministic tests
contract tests
agent evals
integration fixtures
```

No real external business side effects by default.

---

# 126. Staging

Suitable for:

```text
realistic integration
sandbox provider
shadow behavior
approval-flow testing
```

---

# 127. Production

Uses strongest controls:

```text
real identity
least privilege
real evidence
approval
observability
restricted mutation
```

---

# 128. Environment Is Part of Authority

Capability permitted in:

```text
LOCAL
```

does not imply permission in:

```text
PRODUCTION
```

---

# 129. Synthetic Data Principle

Testing JARVIS SHOULD prefer:

```text
fixtures
synthetic customers
sandbox providers
ephemeral test environments
```

over uncontrolled production-data cloning.

---

# 130. Security Architecture

Security relies on layered controls:

```text
identity
least privilege
tool gateway
environment isolation
data classification
secret boundary
external-content trust boundary
audit
```

---

# 131. Prompt Injection Defense

Core architectural requirement:

```text
EXTERNAL CONTENT
cannot become
POLICY OR AUTHORITY
```

without a trusted transformation/decision boundary.

---

# 132. Tool Output Injection

Even tool/provider output may contain text attempting to instruct the model.

Tool output remains data.

---

# 133. Model Input Minimization

Sensitive context sent to model SHOULD be minimized to what the task needs.

---

# 134. Data Provider Eligibility

Future policy may restrict which models/providers can process:

```text
PUBLIC
INTERNAL
CONFIDENTIAL
RESTRICTED
```

data.

---

# 135. Rate Limit Architecture

External tools should surface:

```text
rate limits
quota
retry-after
```

as operational state.

JARVIS should not hammer providers blindly.

---

# 136. Cost Governance

Model/tool usage should be observable by:

```text
request
workflow
agent
business
capability
```

where meaningful.

---

# 137. Cost-Aware Routing

Model Router MAY choose cheaper profiles when:

```text
quality/risk requirements remain satisfied
```

---

# 138. Contracts Architecture

Cross-module boundaries SHOULD use versionable contracts.

Important contracts include:

```text
JarvisRequest
JarvisResponse
Intent
RuntimeContext
ExecutionPlan
ExecutionStep
PolicyDecision
ToolDefinition
ToolCall
ToolResult
Evidence
AgentResult
EventEnvelope
RuntimeError
```

---

# 139. Contract Validation

Runtime contracts SHOULD be machine-validatable.

TypeScript/Zod or equivalent is suitable.

Specific library is not constitutional.

---

# 140. Contract Versioning

Breaking contract changes require explicit version/migration.

Do not silently change semantics used by:

```text
tools
events
agents
workflows
```

---

# 141. Repository Boundary

Target runtime location:

```text
systems/jarvis/
```

when implementation begins.

Current repository MUST NOT create empty JARVIS runtime directories merely to represent this target.

---

# 142. Current Repository Reality

As of activation:

```text
systems/
└── kaskita/
```

JARVIS runtime is not currently present.

Therefore:

```text
JARVIS Architecture
=
ACTIVE specification

JARVIS runtime
=
NOT IMPLEMENTED
```

---

# 143. Target Repository Shape

A reasonable future structure:

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
│   ├── execution/
│   ├── verification/
│   ├── evidence/
│   ├── tools/
│   ├── model-gateway/
│   ├── observability/
│   └── persistence/
│
└── docs/
```

Not every package must exist on day one.

---

# 144. Agents Location — Future

Possible:

```text
systems/jarvis/agents/
```

or package-based organization.

Exact physical structure should follow implementation pressure.

Semantic ownership matters more than folder aesthetics.

---

# 145. Skills Boundary

Runtime JARVIS skills and current engineering `.agents/skills/` MUST NOT be confused.

Current `.agents/skills/` is primarily engineering-agent control material.

Runtime business skills require explicit JARVIS ownership when implemented.

---

# 146. Integration Boundary With MGBOS

Preferred:

```text
JARVIS
  ↓
MGBOS Query / Command Capabilities
  ↓
MGBOS
```

JARVIS SHOULD NOT import MGBOS internal modules directly.

---

# 147. Contractual Coupling

Acceptable coupling:

```text
API
published contract
tool definition
event contract
```

Avoid:

```text
jarvis imports mgbos/src/private/*
```

---

# 148. MGBOS Read Gateway

Early JARVIS should use business-level read capabilities such as:

```text
mgbos.business.briefing.read
mgbos.finance.summary.read
mgbos.production.exceptions.read
mgbos.inventory.alerts.read
```

rather than arbitrary DB access.

---

# 149. MGBOS Mutation Gateway

Future mutation:

```text
mgbos.payment.record
mgbos.production.assign
```

must map to canonical MGBOS commands.

---

# 150. GitHub Integration Boundary

JARVIS may use GitHub capabilities such as:

```text
repository.read
pull_request.read
ci.status.read
```

subject to engineering governance.

Write capabilities require separate authority.

---

# 151. Browser / Research Boundary

Research capabilities access external information.

All returned content enters as:

```text
EXTERNAL / RESEARCH EVIDENCE
```

not system policy.

---

# 152. Email / Messaging Boundary

Messaging capabilities distinguish:

```text
read
draft
send
```

because these have different risk and autonomy.

---

# 153. Calendar Boundary

Calendar should likewise distinguish:

```text
read
propose
create/update/cancel
```

---

# 154. Architecture of a Read Request

```text
Request
  ↓
Intent
  ↓
Context
  ↓
Plan
  ↓
Policy
  ↓
Read Capability
  ↓
Tool
  ↓
Evidence
  ↓
Verification
  ↓
Synthesis
```

---

# 155. Architecture of an L3 Mutation

```text
Request / Event
      ↓
Intent
      ↓
Context
      ↓
Plan
      ↓
Risk / Permission
      ↓
Prepare Action
      ↓
Decision Inbox
      ↓
Human Approval
      ↓
Revalidate
      ↓
Tool / Command
      ↓
Verification
      ↓
Evidence
      ↓
Result
```

---

# 156. Architecture of L4 Mutation

```text
Trigger
  ↓
Intent
  ↓
Context
  ↓
Plan
  ↓
Policy
  ↓
Capability L4 grant?
  ↓
Current risk within ceiling?
  ↓
Execute
  ↓
Verify
  ↓
Evidence
  ↓
Notify/escalate if needed
```

---

# 157. Architecture of Unknown External Outcome

```text
Execute external action
       ↓
Timeout
       ↓
UNKNOWN
       ↓
Reconciliation
       ├── Confirmed succeeded
       ├── Confirmed failed
       └── Needs human
```

No blind mutation retry.

---

# 158. Architecture of a Proactive Event

```text
Event
  ↓
Deduplicate
  ↓
Normalize
  ↓
Context Builder
  ↓
Materiality / Priority
  ↓
Policy
  ├── ignore
  ├── record
  ├── notify
  ├── recommend
  ├── request approval
  └── execute within L4
```

---

# 159. Morning Briefing Architecture

First vertical slice:

```text
Human / Schedule
       ↓
business.daily_briefing
       ↓
Context
       ↓
Planner
       ↓
Read-only Tool Registry
       ├── Finance
       ├── Operations
       ├── Inventory
       └── Engineering optional
       ↓
Verification
       ↓
Findings
       ↓
Priority
       ↓
Synthesis
       ↓
Evidence-backed Briefing
```

---

# 160. Morning Briefing Must Handle Partial Failure

Example:

```text
Finance ✓
Operations ✓
Inventory ✗
Engineering ✓
```

Response remains useful but explicitly partial.

---

# 161. First Runtime Mutation Boundary

JARVIS MUST NOT receive mutation tools merely because architecture supports them.

The first runtime can register only:

```text
*.read
```

capabilities.

---

# 162. Progressive Capability Expansion

Evolution:

```text
Read
  ↓
Recommend
  ↓
Prepare
  ↓
L3 mutation
  ↓
Bounded L4
```

Capability by capability.

---

# 163. Testing Architecture

JARVIS testing SHOULD include:

```text
contract tests
policy tests
context tests
planner fixture tests
tool adapter tests
verification tests
model evals
runtime integration tests
golden workflows
failure tests
security/adversarial tests
```

---

# 164. Deterministic Unit Tests

Best for:

```text
policy
schemas
risk mapping
tool registry
freshness
state machine
idempotency helpers
```

---

# 165. Model Evals

Needed for:

```text
intent
planning
prioritization
factual synthesis
recommendation quality
prompt-injection resilience
```

---

# 166. Golden Workflow Tests

Example:

```text
"briefing pagi"
```

should verify:

```text
correct intent
correct tools
correct evidence
no unsupported facts
partial failure behavior
no write capabilities
```

---

# 167. Mutation Evaluation

Before L3/L4 production use, tests should include:

```text
wrong target
wrong amount
duplicate execution
expired approval
tool timeout
unknown outcome
verification mismatch
permission denial
```

---

# 168. AI Behavior Release Lifecycle

Changes to:

```text
prompt
model
skill
agent
routing
```

that materially affect production behavior SHOULD eventually flow:

```text
DEV
→ EVAL
→ SHADOW
→ CANARY
→ PRODUCTION
```

for consequential capabilities.

---

# 169. Model Upgrade Is a Behavior Change

Changing model may alter:

```text
planning
tool selection
language
risk interpretation
```

It deserves appropriate evaluation.

---

# 170. Shadow Mode

Shadow JARVIS may:

```text
observe real input
produce proposed decisions
```

without side effects.

Useful for proving L3/L4 readiness.

---

# 171. Canary Mode

Canary autonomy limits real execution to:

```text
small scope
limited volume
selected business
limited capability
```

---

# 172. Command Center Architecture

Later Command Center may present:

```text
Morning Briefing
Decision Inbox
Exception Queue
Agent Activity
Tool Health
Automation Health
Incidents
Evidence
Spend
```

---

# 173. Command Center Should Be Projection-Driven

UI should consume runtime projections.

It should not be the owner of orchestration logic.

---

# 174. Architecture Complexity Principle

Do not add:

```text
Redis
Kafka
Temporal
Kubernetes
Neo4j
dedicated vector DB
multi-agent framework
```

until a real architectural requirement appears.

---

# 175. Start With Modular Runtime

Initial implementation can remain:

```text
one deployable runtime
clear internal packages
PostgreSQL
simple API
provider adapters
```

---

# 176. Modular Monolith Is Acceptable

JARVIS does NOT need microservices at the beginning.

Logical boundaries matter more.

---

# 177. Extract Services Only When Required

Potential future extraction reasons:

```text
independent scaling
security isolation
failure containment
specialized infrastructure
team ownership
```

---

# 178. Avoid Framework-Led Architecture

Do not define JARVIS as:

```text
LangGraph system
CrewAI system
n8n system
MCP system
OpenAI Agents system
```

Those are implementation choices.

---

# 179. MCP Position

MCP MAY serve as one standardized tool interface.

It is not JARVIS itself.

Tool Registry remains the semantic capability layer.

---

# 180. n8n Position

n8n MAY be used for external workflow orchestration.

It is not:

```text
brain
policy authority
system of record
```

---

# 181. Vector Store Position

Vector search MAY optimize retrieval.

It is not:

```text
truth database
policy store
transaction store
```

---

# 182. Runtime Persistence Minimum

First runtime likely needs only:

```text
requests
executions
tool calls
evidence
traces
```

Memory can mature later.

---

# 183. First Runtime Non-Goals

JARVIS first implementation does NOT need:

```text
multi-agent workforce
L4 business mutation
event bus
long-term vector memory
voice
mobile app
graph database
distributed workers
complex approval engine
```

---

# 184. Architectural Maturity Sequence

Recommended:

```text
1. Core Runtime
2. Read Tool Runtime
3. Verification + Evidence
4. Observability
5. Controlled Mutation
6. Memory
7. Specialist Agents
8. Event Intelligence
9. Proactive Intelligence
10. Bounded Autonomy
```

Some steps may overlap when business value requires.

---

# 185. Canonical Ownership Matrix

| Concern | Owner |
|---|---|
| Mission | JARVIS Charter |
| Runtime topology | JARVIS Architecture |
| Runtime lifecycle/contracts | Core Runtime Specification |
| Business truth | MGBOS / relevant system |
| Permission | Canonical permission policy/system |
| Risk | Cross-System Risk |
| Autonomy | Cross-System Autonomy |
| Approval | Approval Policy |
| Evidence semantics | Evidence & Provenance |
| Model provider | Model Gateway implementation |
| Tool implementation | Tool Adapter |
| Workflow integration | n8n / adapter |
| UI | Command Center / interfaces |

---

# 186. Architectural Invariants

1. Core coordinates; it does not own business truth.
2. Models never receive authority merely because they reason.
3. Intent does not imply permission.
4. Planner proposes capabilities, not provider internals.
5. Policy is evaluated before consequential tool execution.
6. Capability availability is separate from permission.
7. Tools are bounded external-world interfaces.
8. Credentials remain behind trusted adapters.
9. Business systems revalidate commands.
10. Tool execution is not automatically verified success.
11. Verification produces evidence.
12. Unsupported factual synthesis is prohibited.
13. Memory remains context, not transaction truth.
14. External content is data, not authority.
15. Events trigger evaluation, not automatic unrestricted action.
16. Agents, Skills, and Tools remain separate concepts.
17. JARVIS datastore remains separate in ownership from MGBOS business data.
18. Provider implementations remain replaceable.
19. Runtime can degrade without corrupting business truth.
20. Unknown outcome is represented honestly.
21. High-risk execution requires stronger verification.
22. JARVIS does not require multi-agent architecture to be useful.
23. Production mutation is introduced capability-by-capability.
24. Architectural complexity must be earned by execution needs.
25. Runtime implementation status must never be inferred from documentation existence.

---

# 187. Canonicalization Effect

With activation of this document:

```text
2026-09-27 - JARVIS Architecture v0.1.md
```

changes from:

```text
DESIGN_INPUT
```

to:

```text
HISTORICAL / DESIGN PROVENANCE
```

for architecture semantics covered here.

Its deeper implementation ideas remain valid provenance where not yet superseded by a dedicated canonical specification.

---

# 188. Current State Declaration

As of 2026-09-29:

```text
JARVIS Charter
ACTIVE

JARVIS Architecture
ACTIVE

JARVIS Production Runtime
NOT IMPLEMENTED

systems/jarvis/
NOT PRESENT

Mutation Authority
NOT GRANTED

First Target
READ-ONLY MORNING BUSINESS BRIEFING
```

---

# 189. North Star Architecture

```text
                 HUMAN / EVENTS
                       │
                       ▼
                ┌──────────────┐
                │ JARVIS CORE  │
                ├──────────────┤
                │ Intent       │
                │ Context      │
                │ Planner      │
                │ Policy       │
                │ Execution    │
                │ Verification │
                │ Synthesis    │
                └──────┬───────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
        AGENTS       SKILLS       TOOLS
                                    │
                   ┌────────────────┼────────────────┐
                   ▼                ▼                ▼
                 MGBOS            GitHub          External
                   │
                   ▼
             BUSINESS TRUTH

Supporting all layers:

MEMORY
EVIDENCE
EVENTS
OBSERVABILITY
RUNTIME DATASTORE
```

---

# 190. Final Principle

> **JARVIS Core should know enough to coordinate everything, but own as little external authority and domain truth as possible.**

A mature JARVIS is not powerful because every subsystem is inside it.

It is powerful because it can reliably coordinate:

```text
the right context
the right reasoning
the right specialist
the right capability
the right authority
the right evidence
and the right human judgment
```

without collapsing those responsibilities into one opaque AI.