---
canonical_id: jarvis.architecture.cost-resource-finops
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: jarvis
document_class: canonical-specification
effective_from: 2026-09-29
authoritative_for:
  - jarvis runtime cost governance
  - jarvis AI FinOps semantics
  - jarvis resource budgets
  - jarvis model and provider cost attribution
  - jarvis workflow cost attribution
  - jarvis business and organization cost attribution
  - jarvis cost estimation
  - jarvis cost settlement
  - jarvis cost budgets
  - jarvis budget enforcement
  - jarvis concurrency quotas
  - jarvis workload quotas
  - jarvis runaway-workflow containment
  - jarvis cost anomaly detection
  - jarvis cost-aware model routing
  - jarvis cost-per-successful-task semantics
  - jarvis expensive-workload approval
  - jarvis AI resource utilization
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - ../charter.md
  - ../architecture.md
  - ../core-runtime.md
  - model-gateway-routing.md
  - agent-registry.md
  - skill-registry.md
  - tool-capability.md
  - execution-verification-recovery.md
  - observability-audit-incident.md
  - security-secrets-environment.md
  - data-privacy-retention.md
  - ai-evaluation-regression-autonomy-promotion.md
  - ../../../../docs/governance/cross-system-risk-classification.md
  - ../../../../docs/governance/autonomy-levels.md
  - ../../../../docs/governance/approval-policy.md
supersedes: null
implementation_status: NOT_IMPLEMENTED
target_runtime_location: systems/jarvis/
default_reporting_currency: IDR
open_owner_decisions:
  - production_daily_ai_budget
  - production_monthly_ai_budget
  - organization_budget_allocations
  - expensive_workload_thresholds
  - provider_spend_limits
---

# JARVIS Cost, Resource & FinOps Architecture v1.0

## 1. Purpose

Dokumen ini mendefinisikan bagaimana JARVIS menggunakan:

```text
models
tools
providers
compute
storage
network
human attention
```

secara ekonomis tanpa membiarkan automation berkembang menjadi:

```text
unbounded cost
unbounded loops
unbounded concurrency
```

---

# 2. Golden Principle

> **JARVIS optimizes cost per verified useful outcome—not cost per token and not intelligence at any price.**

---

# 3. Second Golden Principle

> **Cost optimization may reduce waste. It may never lower correctness, security, evidence, or business-integrity floors.**

---

# 4. Why FinOps Is Architectural

Dalam AI-native system, biaya dapat tumbuh karena:

```text
more Agents

more events

more retries

longer contexts

deeper models

multi-model review

research

media generation

tool/API usage
```

tanpa pertumbuhan headcount yang langsung terlihat.

Karena itu AI cost harus menjadi first-class runtime concern.

---

# 5. FinOps Is Not Accounting

JARVIS FinOps answers:

```text
What consumed resources?

Why?

Was it useful?

Was it within policy?

Could it have been cheaper?
```

Accounting answers:

```text
What expense was actually incurred
and booked financially?
```

Keep separate.

---

# 6. Runtime Estimate ≠ Provider Invoice

A runtime estimate such as:

```text
Rp1,240 estimated
```

is not necessarily equivalent to:

```text
actual provider invoice
```

---

# 7. Three Cost States

Canonical:

```text
ESTIMATED

REPORTED

BILLED
```

---

# 8. ESTIMATED

Derived by JARVIS before or after execution from known pricing/configuration.

Useful for:

```text
budget gating
routing
forecasting
```

---

# 9. REPORTED

Provider returns measured usage/cost information through API.

---

# 10. BILLED

Provider/accounting source confirms actual financial charge.

BILLED is stronger for accounting reconciliation.

---

# 11. Cost Classes

JARVIS SHOULD distinguish:

```text
MODEL_COST

TOOL_COST

PROVIDER_COST

COMPUTE_COST

STORAGE_COST

NETWORK_COST

HUMAN_REVIEW_COST
```

where useful.

---

# 12. Model Cost

Examples:

```text
input tokens

output tokens

reasoning usage

cached tokens

image generation

voice generation

embedding calls
```

---

# 13. Tool Cost

Examples:

```text
paid research API

email provider charge

maps/geocoding

OCR service

media service
```

---

# 14. Compute Cost

Examples:

```text
VPS

worker execution

GPU runtime

serverless execution
```

Initially much of this may be fixed infrastructure expense.

---

# 15. Human Review Cost

Future analytics MAY estimate:

```text
human correction time

approval burden

manual recovery effort
```

because cheap AI that creates excessive review can be economically worse.

---

# 16. Cost Attribution Dimensions

Every measurable runtime cost SHOULD eventually be attributable to some combination of:

```text
organization

business

workflow

Agent

Skill

model profile

model

provider

Tool

environment

execution
```

---

# 17. Primary Attribution Chain

```text
ORGANIZATION
     ↓
WORKFLOW
     ↓
AGENT / SKILL
     ↓
MODEL + TOOL CALLS
     ↓
COST
```

---

# 18. Execution-Level Attribution

Each execution SHOULD eventually answer:

```text
How much did this execution cost?
```

---

# 19. Workflow-Level Attribution

Examples:

```text
Morning Briefing
Rp X / run

Content Production
Rp Y / asset

Lead Qualification
Rp Z / lead
```

---

# 20. Business-Level Attribution

Example future dashboard:

```text
TeeStock
AI spend this month: ...

MultiGraph
AI spend this month: ...

RizkyBuild
AI spend this month: ...
```

---

# 21. Shared Platform Costs

Some infrastructure supports multiple businesses.

It may be:

```text
UNALLOCATED_PLATFORM_COST
```

initially rather than pretending precise allocation exists.

---

# 22. Allocation Can Mature Later

Possible methods:

```text
execution count

compute usage

tokens

workflow ownership

revenue share
```

but no sophisticated cost allocation is required now.

---

# 23. Cost Event

Logical:

```ts
type CostRecord = {
  costRecordId: string

  executionId?: string
  traceId?: string

  organizationId?: string

  workflowId?: string
  agentId?: string
  skillId?: string

  providerId?: string
  modelId?: string
  toolId?: string

  costType: string

  usageQuantity?: number
  usageUnit?: string

  originalAmount?: number
  originalCurrency?: string

  reportingAmount?: number
  reportingCurrency: string

  costState:
    | "ESTIMATED"
    | "REPORTED"
    | "BILLED"

  occurredAt: string
}
```

---

# 24. Default Reporting Currency

For BisnisHub internal decision-making:

```text
IDR
```

is the preferred default reporting currency.

---

# 25. Original Currency Must Be Preserved

Provider may charge:

```text
USD
EUR
SGD
```

Do not discard original financial context during conversion.

---

# 26. FX Conversion

When normalized into IDR, preserve where useful:

```text
FX rate

source

effective timestamp/date
```

---

# 27. Runtime FX Is Analytical

Currency conversion for AI FinOps is:

```text
analytical reporting
```

not the company's accounting ledger.

---

# 28. Budget

Budget is an allowed resource envelope.

Canonical scopes MAY include:

```text
REQUEST

EXECUTION

WORKFLOW

AGENT

ORGANIZATION

PROVIDER

DAY

MONTH
```

---

# 29. Budget Dimensions

A budget may constrain:

```text
money

tokens

model calls

Tool calls

wall-clock time

concurrency

media generation count
```

---

# 30. Monetary Budget

Example conceptual:

```text
maxEstimatedCost
```

for one execution.

---

# 31. Token Budget

Limits:

```text
input tokens

output tokens

total tokens
```

where useful.

---

# 32. Model-Call Budget

Prevents:

```text
model calls model
which calls critic
which calls researcher
which calls critic again
```

without bound.

---

# 33. Tool-Call Budget

Prevents uncontrolled integration loops.

---

# 34. Time Budget

Execution should have bounded:

```text
max elapsed time
```

appropriate to workflow.

---

# 35. Concurrency Budget

Limits how many executions of a category may run simultaneously.

---

# 36. Budget Types

Canonical:

```text
SOFT

HARD
```

---

# 37. Soft Budget

Crossing threshold may:

```text
warn

change routing

require approval

delay lower-priority work
```

but does not automatically block.

---

# 38. Hard Budget

Crossing ceiling blocks further spending unless a valid exception/override policy exists.

---

# 39. Hard Budget Is Not Business Invariant

It protects resources/economics.

It does not redefine MGBOS business truth.

---

# 40. Budget Hierarchy

Conceptually:

```text
GLOBAL
  ↓
ORGANIZATION
  ↓
WORKFLOW
  ↓
EXECUTION
```

Lower-level budget cannot silently exceed a higher-level ceiling.

---

# 41. Multiple Applicable Budgets

Effective budget is constrained by:

```text
all relevant ceilings
```

not whichever one is easiest to satisfy.

---

# 42. Budget Reservation

Before expensive work, runtime MAY estimate and reserve expected budget.

---

# 43. Why Reservation

Without reservation:

```text
100 concurrent jobs
```

may each believe budget remains available and overspend collectively.

---

# 44. Cost Preflight

Before an expensive workflow:

```text
estimate expected calls

estimate expected cost

check remaining budget

decide route
```

---

# 45. Estimate Is Not Exact

Provider pricing or actual token use may differ.

Therefore:

```text
estimated ≠ guaranteed final cost
```

---

# 46. Budget Settlement

After execution:

```text
estimated reservation
      ↓
actual/reported usage
      ↓
settle budget
```

---

# 47. Cost Overrun

If actual spend exceeds estimate:

```text
record

attribute

adjust forecast

investigate if material
```

Do not falsify the execution record.

---

# 48. Expensive Workload

Some workflows may intentionally consume large resources.

Examples:

```text
deep research

large codebase analysis

video generation

mass content generation

large document processing
```

---

# 49. Expensive Workload Policy

May require:

```text
higher budget

scheduled batch

explicit approval

different model profile
```

depending on consequence.

---

# 50. Cost Approval Is Separate From Action Approval

Example:

```text
Generate 100 videos
```

may be operationally low-risk but financially expensive.

Cost approval can be required even if business-action risk is modest.

---

# 51. Cost Approval Does Not Grant Business Authority

Budget approval:

```text
spend up to X
```

does not authorize:

```text
publish publicly
send to customer
transfer money
```

---

# 52. Open Budget Decisions

As of this specification, these remain:

```text
OPEN OWNER DECISION
```

- production daily AI spend ceiling;
- monthly AI spend ceiling;
- per-business allocation;
- expensive-workload approval threshold;
- provider-specific spending limits.

---

# 53. Why No Numbers Yet

There is not yet enough:

```text
production usage

workflow volume

provider mix

verified ROI
```

to choose defensible values.

---

# 54. Initial Budget Method

After first runtime:

```text
measure baseline
→ classify essential vs optional workloads
→ compare value
→ set soft limits
→ observe
→ introduce hard limits where useful
```

---

# 55. Cost per Successful Task

Canonical north-star metric:

```text
COST PER SUCCESSFUL TASK
=
all attributable execution cost
/
verified useful completed tasks
```

---

# 56. Successful Means Verified

Do not count:

```text
API returned 200
```

as success when workflow outcome failed verification.

---

# 57. Failed Work Still Costs Money

Costs from:

```text
failed

partial

unknown

retried

reconciled
```

executions remain part of economics.

---

# 58. Example

Model A:

```text
Rp100 / call
80% successful
many retries
```

Model B:

```text
Rp170 / call
98% successful
few retries
```

Model B may have lower:

```text
cost per successful task
```

despite higher per-call price.

---

# 59. Cost per Token Is Secondary

Useful for provider analysis.

Not a system-level optimization objective.

---

# 60. Cost per Workflow

Useful:

```text
Morning Briefing
cost/run

Lead Qualification
cost/lead

Content Script
cost/script

Customer Support
cost/resolved case
```

---

# 61. Unit Economics

Future business analysis MAY compare:

```text
automation cost
vs
labor saved
vs
revenue/margin impact
```

---

# 62. Value ≠ Spend

An expensive workflow may be excellent if it creates significant verified value.

---

# 63. Cheap ≠ Efficient

Cheap automation producing low-quality outputs and rework is wasteful.

---

# 64. Model Routing Economics

Routing SHOULD balance:

```text
minimum required quality

risk

latency

cost
```

---

# 65. Deterministic First

If deterministic code can solve the problem reliably:

```text
use deterministic code.
```

Do not invoke a model for prestige.

---

# 66. Example

Correct:

```text
invoice total sum
→ deterministic calculation
```

not:

```text
ask DEEP model to add numbers.
```

---

# 67. FAST Profile

Preferred for:

```text
routing

classification

simple extraction

high-volume low-complexity tasks
```

when evals prove it adequate.

---

# 68. BALANCED Profile

Preferred general default where reasoning is actually needed.

---

# 69. DEEP Profile

Reserved for tasks where additional reasoning quality materially justifies:

```text
higher cost

higher latency
```

---

# 70. Deep Escalation

Better:

```text
FAST/BALANCED
     ↓
detect complexity/failure
     ↓
DEEP
```

than:

```text
DEEP everywhere.
```

---

# 71. Deep Escalation Must Be Bounded

A workflow should not repeatedly escalate:

```text
BALANCED → DEEP → CRITIC → DEEP → ...
```

without a call budget.

---

# 72. Multi-Model Review

Use only when:

```text
risk

uncertainty

value
```

justify the additional expense.

---

# 73. Default No Multi-Model Voting

Routine work SHOULD NOT call three models just to vote.

---

# 74. Model Quality Floor

Router must not choose cheaper model below the evaluated quality/safety floor.

---

# 75. Cost Cannot Override Privacy

Cheap provider cannot receive CONFIDENTIAL data if not eligible.

---

# 76. Cost Cannot Override Risk Controls

Cheap execution cannot bypass:

```text
approval

verification

recovery
```

---

# 77. Cost Cannot Override Evidence

Do not remove essential evidence queries merely to save API calls.

---

# 78. Cost-Aware Fallback

Fallback selection MAY consider price.

But only after eligibility requirements pass.

---

# 79. Provider Economics

Track provider-specific:

```text
price

error rate

latency

successful outcome rate
```

together.

---

# 80. Provider Effective Cost

Conceptually:

```text
effective provider cost
=
direct cost
+
retry cost
+
failure cost
+
human correction burden
```

---

# 81. Context Economics

Large context costs:

```text
tokens

latency

privacy exposure

attention dilution
```

---

# 82. Context Minimization Is FinOps

Good Context Builder reduces:

```text
cost
+
privacy risk
+
noise
```

simultaneously.

---

# 83. Cached Context

Caching MAY reduce provider cost where freshness rules permit.

---

# 84. Cache Economics Never Override Freshness

Financial/current business facts should not be cached aggressively merely to reduce spend.

---

# 85. Prompt Optimization

Reducing unnecessary repetitive instructions/context MAY lower cost.

Do not sacrifice clarity or security.

---

# 86. Structured Output Economics

Structured output can reduce:

```text
repair calls

parsing failures

retries
```

and therefore total workflow cost.

---

# 87. Resource Governance

FinOps includes resources beyond money.

Canonical dimensions:

```text
CONCURRENCY

CALLS

TOKENS

TIME

STORAGE

NETWORK

COMPUTE
```

---

# 88. Concurrency

Unbounded concurrency can create:

```text
provider rate limits

cost spikes

duplicate contention

database load

workflow storms
```

---

# 89. Concurrency Scope

Potential quotas:

```text
global

organization

workflow

provider

Tool
```

---

# 90. Priority-Aware Concurrency

When capacity is constrained:

```text
high-priority operational workflows
```

may take precedence over:

```text
bulk content generation.
```

---

# 91. Resource Queue

Lower-priority work MAY be queued rather than rejected.

---

# 92. Queue ≠ Unlimited Backlog

Backlog itself needs:

```text
size

age

priority
```

controls.

---

# 93. Queue Expiry

Stale low-value tasks may expire instead of consuming future budget.

---

# 94. Bulk Workload

Examples:

```text
generate 500 descriptions

re-embed entire knowledge base

analyze 10,000 records
```

should not be modeled as 10,000 uncontrolled interactive requests.

---

# 95. Batch Planning

Bulk workflows SHOULD estimate:

```text
item count

expected cost

rate limits

completion time
```

before execution.

---

# 96. Sample Before Full Batch

Useful approach:

```text
run 10
evaluate
estimate
then expand
```

for expensive workloads.

---

# 97. Runaway Workflow

A runaway workflow consumes resources beyond intended bounds due to:

```text
loop

recursive Agent calls

repeated retries

event feedback

bad planner

provider errors
```

---

# 98. Runaway Containment

Every nontrivial workflow SHOULD eventually have bounded:

```text
steps

model calls

Tool calls

retries

elapsed time

cost
```

---

# 99. Step Budget

Example conceptual:

```text
maxSteps
```

prevents infinite planning loops.

---

# 100. Tool-Call Budget

Example:

```text
maxToolCalls
```

---

# 101. Model-Call Budget

Example:

```text
maxModelCalls
```

---

# 102. Retry Budget

Already defined by execution architecture.

FinOps additionally tracks its economic consequence.

---

# 103. Wall-Clock Budget

Long-running work should have:

```text
max execution duration
```

or durable-wait semantics.

---

# 104. Cost Budget

Final containment:

```text
maxEstimatedCost
```

and/or hard cumulative spend ceiling.

---

# 105. Runaway Kill

When hard execution budget is exceeded:

```text
STOP FURTHER OPTIONAL EXECUTION
```

and surface reason.

---

# 106. Critical Workflow Exception

A safety-critical recovery workflow may need to exceed ordinary budget.

This requires explicit policy/authority rather than silent overspend.

---

# 107. Budget Service Failure

Cost-governance infrastructure may itself fail.

---

# 108. Fail Behavior by Workload

Low-priority expensive work:

```text
fail closed / defer
```

Essential bounded business-read workflow:

```text
may continue under conservative local ceiling
```

if policy permits.

---

# 109. No Unlimited Fail-Open

Budget service unavailable MUST NOT mean:

```text
spend without limits.
```

---

# 110. Cost Anomaly

A Cost Anomaly is an unexpected spending/resource pattern.

---

# 111. Anomaly Examples

```text
10× normal token usage

50 model calls instead of 2

sudden provider-price change

event storm

retry storm

unexpected media generation

workflow daily cost spike
```

---

# 112. Cost Anomaly ≠ Fraud by Default

Could indicate:

```text
legitimate workload growth

bug

provider change

attack

loop
```

Investigate.

---

# 113. Baseline

Anomaly detection may compare against:

```text
historical workflow cost

expected call count

volume-normalized cost

provider baseline
```

---

# 114. Absolute Threshold

Useful for hard safety limits.

---

# 115. Relative Threshold

Useful for detecting:

```text
normal Rp500
→ suddenly Rp15,000.
```

---

# 116. Cost Anomaly Response

Depending on severity:

```text
record

notify

throttle

route cheaper

pause workflow

disable Agent

activate kill switch
```

---

# 117. Cost Incident

A sustained/material uncontrolled spend can become:

```text
COST INCIDENT
```

under Incident Architecture.

---

# 118. Cost Spike During Incident

Do not let incident recovery loops themselves create unbounded spend.

---

# 119. Rate Limits

External provider limits are both:

```text
availability constraint
```

and:

```text
resource constraint.
```

---

# 120. Rate-Limit Aware Scheduling

Bulk workloads SHOULD respect provider quotas.

---

# 121. Rate-Limit Errors

Do not trigger immediate unbounded retry.

Use execution retry semantics.

---

# 122. Provider Quota

Provider account may expose:

```text
requests/minute

tokens/minute

monthly credits
```

These can become routing constraints.

---

# 123. Internal Quota

JARVIS MAY enforce stricter limits than provider maximum.

---

# 124. Organization Quota

Future multi-business setup MAY assign:

```text
TeeStock monthly AI allowance

MultiGraph monthly AI allowance
```

without requiring separate provider accounts.

---

# 125. Organization Budget Is Not Accounting Transfer Price

Initially it is an operational allocation.

---

# 126. Shared Provider Account

If multiple businesses share provider billing:

```text
cost attribution
```

still uses organization/workflow metadata.

---

# 127. Missing Organization Context

Business workflow without organization identity SHOULD NOT silently charge a random business.

Use:

```text
PLATFORM / UNALLOCATED
```

or block where scope is required.

---

# 128. Cost Ownership

Every recurring production workflow SHOULD eventually have an accountable budget owner.

---

# 129. Early Owner

Initially:

```text
Rizky
```

can own global budget decisions.

---

# 130. Later Delegation

Possible:

```text
Marketing owns content budget

Engineering owns coding Agent budget

Operations owns operational automation budget
```

while central ceilings remain.

---

# 131. Spend Authorization

Ordinary low-cost usage within policy should not require founder approval per call.

---

# 132. Founder-by-Exception FinOps

Desired:

```text
normal spending
→ automatic

minor variation
→ observed

material anomaly
→ surfaced

major budget exception
→ founder decision
```

---

# 133. Budget Change

Material increases to persistent production budget SHOULD be auditable.

---

# 134. Temporary Budget Override

May be:

```text
scope-bound

amount-bound

time-bound

actor-bound
```

---

# 135. Override Expiry

Temporary exception should expire automatically where possible.

---

# 136. Override Does Not Change Default Policy Permanently

---

# 137. Cost Forecast

JARVIS MAY forecast:

```text
remaining daily spend

monthly projection

workflow batch cost
```

from historical usage.

---

# 138. Forecast Is Estimate

Not an accounting guarantee.

---

# 139. Forecast Useful for Batch Decisions

Example:

```text
2,000 products remaining
estimated cost Rp...
```

before proceeding.

---

# 140. Cost and Scheduling

Low-priority expensive jobs MAY run:

```text
off-peak

batched

when provider pricing/capacity favorable
```

if business semantics permit.

---

# 141. Time-Sensitive Work Overrides Cheapest Schedule

Customer-facing urgent work may justify higher cost.

---

# 142. Cost Optimization Hierarchy

Preferred order:

```text
1. Remove unnecessary work

2. Use deterministic logic

3. Reduce context

4. Use appropriate cheaper model

5. Batch/cache safely

6. Escalate only when needed

7. Negotiate/change provider
```

---

# 143. Do Not Optimize by Removing Verification First

Verification is not optional waste.

---

# 144. Do Not Optimize by Dropping Privacy

Cheaper provider with weaker eligibility is not optimization.

---

# 145. Do Not Optimize by Lowering Reliability Blindly

Measure overall task economics.

---

# 146. Human Cost

Eventually compare:

```text
AI spend

human approval time

human correction time

incident/recovery burden
```

---

# 147. Approval UX Cost

If every trivial action requires founder approval:

```text
software cost may be low
human cost becomes enormous.
```

---

# 148. Autonomy Can Reduce Human Cost

But only after safety/evaluation support it.

---

# 149. FinOps Does Not Promote Autonomy

Economic benefit may motivate review.

It cannot override autonomy governance.

---

# 150. Cost per Human Decision Saved

Future useful metric:

```text
AI operating cost
/
meaningful founder decisions avoided
```

for founder-by-exception workflows.

---

# 151. Cost per Business Outcome

More advanced:

```text
cost / qualified lead

cost / completed content asset

cost / resolved support request
```

where attribution is defensible.

---

# 152. Cost per Revenue Is Not Always Causal

Avoid misleading ROI claims without attribution evidence.

---

# 153. Evaluation Costs

AI evals themselves consume resources.

Track separately:

```text
EVALUATION
```

from:

```text
PRODUCTION
```

usage.

---

# 154. Shadow Costs

Shadow model calls are:

```text
R&D / QUALITY cost
```

not production fulfillment cost.

---

# 155. Canary Costs

Canary production costs should remain identifiable.

---

# 156. Development Costs

LOCAL/TEST/STAGING cost should not pollute production unit economics.

---

# 157. Environment Attribution

Every cost record SHOULD identify:

```text
LOCAL

TEST

STAGING

PRODUCTION
```

---

# 158. Cost Dashboard

Future Command Center should show:

```text
AI spend today

AI spend this month

cost vs budget

top workflows by cost

top providers by cost

cost anomalies

cost per successful task
```

---

# 159. Avoid Vanity Dashboard

Do not optimize for:

```text
tokens consumed
```

as if more tokens means more progress.

---

# 160. Useful Drill-Down

Example:

```text
TeeStock content workflow
cost ↑ 42%

why?
→ context size doubled
→ more DEEP escalations
```

---

# 161. Cost Attribution to Agent

Agent cost is useful operationally.

It does NOT mean:

```text
Agent has its own financial account.
```

---

# 162. Cost Attribution to Skill

Can reveal expensive procedural steps.

---

# 163. Tool Cost Attribution

Useful when APIs themselves charge per call.

---

# 164. Provider Billing Reconciliation

Future FinOps may reconcile runtime usage with provider billing data.

---

# 165. Reconciliation Purpose

Detect:

```text
missing usage

pricing errors

unexpected provider account activity

unattributed spend
```

---

# 166. Unattributed Spend

Provider bill with no matching runtime attribution may indicate:

```text
manual use

other application

credential misuse

telemetry gap.
```

---

# 167. Unattributed Spend Is FinOps Finding

Material unexplained spend MAY become incident/security investigation.

---

# 168. Pricing Registry

Model/provider registry MAY include current pricing metadata.

---

# 169. Pricing Changes

Provider price change does not require Agent changes.

It may require routing/economic reevaluation.

---

# 170. Pricing Version

For reliable historical analysis, preserve:

```text
price effective period
```

or actual observed cost.

---

# 171. Historical Recalculation

Do not reprice old execution using today's provider price and call it actual historical cost.

---

# 172. Storage Cost

As JARVIS accumulates:

```text
logs

evals

evidence

Memory

embeddings
```

storage becomes a FinOps concern.

---

# 173. Retention Is Also Cost Governance

Keeping useless telemetry forever consumes money.

Data retention policy therefore influences FinOps.

---

# 174. Do Not Delete Required Audit for Cost

Cost optimization cannot violate retention obligations.

---

# 175. Embedding Economics

Before embedding large datasets:

```text
estimate source volume

embedding cost

storage cost

re-embedding cost
```

---

# 176. Re-Embedding Cost

Changing embedding model can require full rebuild.

Consider before provider/model migration.

---

# 177. Media Economics

Image/video/voice generation can dominate AI cost.

Treat them separately from text model budgets.

---

# 178. Media Budget

Possible limits:

```text
images per campaign

video minutes

voice characters/minutes
```

plus money ceiling.

---

# 179. Preview Before Expensive Media

For high-cost generation:

```text
draft / low-cost preview
→ approve direction
→ expensive final render
```

may reduce waste.

---

# 180. Research Economics

Deep web research can generate:

```text
many searches

many model calls

large context
```

---

# 181. Research Budget

Define:

```text
max sources

max search rounds

max model calls

time budget
```

appropriate to task.

---

# 182. Stop Condition

Research Skill should know when:

```text
enough evidence exists
```

rather than search indefinitely.

---

# 183. Diminishing Returns

Additional model/tool calls often yield less marginal value.

FinOps should encourage bounded stopping criteria.

---

# 184. Agent Handoffs

Multi-Agent workflows can create hidden cost multiplicatively.

---

# 185. Handoff Budget

Planner/Supervisor SHOULD restrict:

```text
number of Agent delegations
```

where appropriate.

---

# 186. Agent Cannot Spawn Unlimited Agents

Dynamic spawning is bounded by runtime policy.

---

# 187. Recursive Delegation

Prohibited unless explicitly controlled.

---

# 188. Planner Cost Awareness

Planner MAY know abstract budget constraints such as:

```text
LOW

NORMAL

HIGH
```

or numeric budget.

It should not own budget authority.

---

# 189. Model Need Not Know Provider Price Details

Routing layer can handle provider economics.

---

# 190. Tool Need Not Decide Global Budget

Tool reports usage/cost.

FinOps/policy layer governs aggregate budget.

---

# 191. Cost and Risk Relationship

Cost and risk are independent dimensions.

---

# 192. Example

```text
Generate one 4K video
```

may be:

```text
low business risk
high financial cost.
```

---

# 193. Another Example

```text
reverse payment Rp5,000
```

may be:

```text
low API cost
high business risk.
```

---

# 194. Never Use Spend as Proxy for Risk

---

# 195. Cost and Priority

High-priority business task may receive larger budget.

Priority itself still needs evidence.

---

# 196. Emergency Cost

During critical incident, spending more on diagnostics may be justified.

Use bounded incident policy.

---

# 197. Emergency Does Not Mean Unlimited

---

# 198. Budget Exhaustion

Possible responses:

```text
continue essential only

defer optional work

switch eligible cheaper route

request override

stop
```

---

# 199. Essential Work Classification

Only explicit workflows should bypass ordinary soft budget pressure.

---

# 200. Budget Exhaustion Must Be Visible

Do not silently degrade critical output quality.

---

# 201. Cost Degraded Mode

Runtime may enter:

```text
COST_CONSTRAINED
```

where optional expensive operations are reduced.

---

# 202. Cost-Constrained Mode Must Preserve Quality Floors

---

# 203. Example

Allowed:

```text
skip optional critic review
```

for R1 content ideation if policy permits.

Not allowed:

```text
skip payment verification.
```

---

# 204. Resource Health

FinOps may monitor:

```text
budget remaining

provider quota

queue capacity

concurrency headroom.
```

---

# 205. Cost State ≠ Component Health

A provider can be healthy but:

```text
budget exhausted.
```

---

# 206. Resource Availability

Model Router may see:

```text
eligible but budget blocked.
```

---

# 207. FinOps Decision Result

Logical:

```ts
type CostPolicyDecision = {
  status:
    | "ALLOW"
    | "ALLOW_WITH_WARNING"
    | "REQUIRE_APPROVAL"
    | "DEFER"
    | "DENY"

  budgetRefs: string[]

  estimatedCost?: number

  reportingCurrency: string

  reasonCodes: string[]
}
```

---

# 208. Cost Policy Happens Before Expensive Execution

But final actual usage is recorded afterward.

---

# 209. Cost Prediction Failure

If runtime cannot estimate accurately:

```text
use conservative bound
```

or require approval for unusually expensive workload.

---

# 210. Cost Model Calibration

Compare:

```text
estimated
vs
actual
```

and improve estimates.

---

# 211. Budget Policy Is Versioned

Persistent cost policy changes system behavior and should be auditable/versioned.

---

# 212. Budget Changes Do Not Modify Historical Usage

---

# 213. FinOps Observability

Every material model call SHOULD eventually expose:

```text
input usage

output usage

provider/model

cost estimate/reported cost

workflow

organization
```

---

# 214. FinOps Evidence

Provider usage receipt can support cost claims.

---

# 215. Estimated Cost Must Be Labeled

Do not display:

```text
Rp50,000 spent
```

when only estimated.

Use:

```text
Estimated spend
```

---

# 216. Billed Reconciliation

When actual invoice becomes available, differences can be reconciled.

---

# 217. Privacy of Cost Data

Provider bills and business-level AI spend may be:

```text
CONFIDENTIAL.
```

---

# 218. Cost Telemetry Retention

Follow Data Governance.

Do not store unnecessary prompt content merely for FinOps.

---

# 219. Security and FinOps

Unexpected provider spending can signal stolen credential or unauthorized use.

---

# 220. Credential Compromise Signal

Example:

```text
provider spend continues
while JARVIS execution count = 0.
```

Investigate.

---

# 221. FinOps Security Correlation

Cost anomaly + unknown external calls may escalate to Security Incident.

---

# 222. Disaster Recovery and FinOps

Recovery drills and backup infrastructure also have costs.

They remain reliability investments, not waste.

---

# 223. Do Not Optimize Away Resilience Blindly

Saving RpX by removing backup/monitoring can create unacceptable risk.

---

# 224. AI FinOps and ROI

At maturity, compare:

```text
AI operating cost
+
human oversight cost
+
incident cost
```

against:

```text
labor saved
revenue enabled
cycle time reduced
quality improvement
```

carefully.

---

# 225. ROI Must Be Evidence-Based

Do not claim:

```text
Agent saved 100 hours
```

without measurement basis.

---

# 226. Time Savings

May be estimated from:

```text
manual baseline

automated execution time

human review time
```

---

# 227. Human Time Has Economic Value

But internal labor valuation is a business-management decision.

---

# 228. Build vs Buy

FinOps also helps answer:

```text
custom system
vs
external SaaS
vs
manual process.
```

---

# 229. Cheapest Infrastructure Is Not Always Best

Consider:

```text
reliability

maintenance burden

recovery

security

operator time.
```

---

# 230. Self-Hosted Model Economics

Local models may appear cheap per call.

Actual cost includes:

```text
GPU hardware

power

maintenance

availability

engineering time.
```

---

# 231. Local Model Is Not Automatically Cheaper

Benchmark total cost per successful task.

---

# 232. Model Provider Diversity

Multiple providers can improve resilience/quality but also increase:

```text
minimum spend

integration complexity

billing fragmentation.
```

---

# 233. Add Provider Only With Economic or Capability Reason

Not because multi-provider looks sophisticated.

---

# 234. First Runtime Strategy

Morning Briefing FinOps can begin with:

```text
model calls

tokens

estimated model cost

workflow total cost

latency
```

only.

---

# 235. No Budget Engine Required Before Baseline

Initially:

```text
observe first.
```

---

# 236. Initial Safe Ceiling

Execution-level limits such as:

```text
max model calls

max Tool calls

max tokens
```

SHOULD exist before sophisticated monthly budgeting.

---

# 237. Why Runtime Bounds First

They prevent catastrophic loops even without knowing ideal monthly spend.

---

# 238. Phase 1

Instrument:

```text
tokens

calls

latency

estimated cost

workflow attribution.
```

---

# 239. Phase 2

Establish:

```text
typical cost/run

variance

successful-task cost.
```

---

# 240. Phase 3

Introduce:

```text
soft workflow budgets

daily alerts

anomaly detection.
```

---

# 241. Phase 4

Add:

```text
hard ceilings

business allocations

expensive-workload approval

batch reservations.
```

---

# 242. Phase 5

Optimize routing based on real:

```text
quality

cost

latency

successful outcomes.
```

---

# 243. No Premature Optimization

Do not spend weeks saving:

```text
Rp10 per workflow
```

before proving the workflow creates useful value.

---

# 244. First Solve Correctness

Canonical optimization order:

```text
CORRECT

SAFE

OBSERVABLE

USEFUL

THEN
ECONOMICALLY OPTIMIZED
```

---

# 245. But Prevent Catastrophic Spend From Day One

Simple hard bounds remain required.

---

# 246. Morning Briefing Definition of Done — FinOps

Each run can answer:

```text
Which model?

How many model calls?

How many tokens?

How much estimated cost?

How many Tools?

Was result successful/partial/failed?

Cost per successful run?
```

---

# 247. First Batch Workflow Definition of Done

Before bulk AI execution:

```text
item count known

sample run measured

cost estimated

provider quota known

concurrency bounded

hard stop exists

progress observable.
```

---

# 248. First Expensive Workflow Definition of Done

Runtime can:

```text
estimate cost

compare budget

request approval if required

stop at ceiling

attribute actual cost.
```

---

# 249. First Organization Budget Definition of Done

Costs reliably carry:

```text
organizationId
```

and shared platform costs are handled explicitly.

---

# 250. First Hard Budget Definition of Done

Test:

```text
multiple concurrent executions

retry storms

estimation error

provider usage delays

override expiry.
```

---

# 251. Runaway Protection Definition of Done

Workflow has enforced maximum:

```text
steps

model calls

Tool calls

retries

time

cost.
```

---

# 252. Cost Anomaly Definition of Done

Runtime can detect at least:

```text
abnormal cost/run

unexpected call count

daily spend spike

unattributed provider usage.
```

---

# 253. Routing Economics Definition of Done

Router can compare eligible candidates using:

```text
eval qualification

cost

latency

health
```

without violating quality/privacy floors.

---

# 254. AI FinOps Dashboard — Initial

Useful minimal view:

```text
Today
Rp...

Month to date
Rp...

Morning Briefing
Rp... / successful run

Top model
...

Failures/retries cost
...

Budget state
NORMAL / WARNING / BLOCKED
```

---

# 255. Mature View

Later:

```text
cost by business

cost by Agent

cost by Skill

cost per workflow

cost per successful task

human correction burden

model/provider efficiency

budget forecasts

anomalies
```

---

# 256. Cost Classification

FinOps events can be classified:

```text
NORMAL

ELEVATED

ANOMALOUS

BUDGET_WARNING

BUDGET_EXCEEDED
```

---

# 257. Cost Warning Is Not Incident

Only material abnormal impact becomes incident.

---

# 258. Cost Policy Does Not Own Provider Billing Truth

Provider/accounting sources own actual billed charges.

---

# 259. FinOps Data Does Not Belong in MGBOS Core by Default

JARVIS runtime usage/cost telemetry belongs to JARVIS/platform operational data.

---

# 260. Business Accounting Integration

If actual AI expenses later need accounting allocation:

```text
verified provider bills
```

can feed the accounting/business finance process separately.

---

# 261. Model Router Relationship

Model Router selects only among:

```text
qualified

eligible

healthy
```

models.

FinOps helps choose economically among that valid set.

---

# 262. Agent Relationship

Agent may have budget envelope.

It cannot modify its own envelope.

---

# 263. Skill Relationship

Skill may define:

```text
expected resource profile

maximum iterations
```

but cannot grant extra money authority.

---

# 264. Tool Relationship

Tool reports:

```text
usage

provider cost

rate limits
```

where available.

---

# 265. Execution Relationship

Execution Engine enforces:

```text
step

retry

time

operation
```

limits.

FinOps overlays economic/resource limits.

---

# 266. Evaluation Relationship

Model/workflow evaluation includes:

```text
cost

latency
```

alongside correctness.

---

# 267. Autonomy Relationship

Autonomy level does not imply unlimited budget.

---

# 268. L4 Needs Stronger Budget Guard

Because human is no longer approving each execution.

---

# 269. Event Architecture Relationship

Event-driven automation requires:

```text
event storm protection

dedupe

model-call suppression

cost anomaly protection.
```

---

# 270. Observability Relationship

Observability supplies:

```text
usage

cost

latency

call counts

queue state.
```

---

# 271. Incident Relationship

Cost anomaly may trigger:

```text
COST incident

AUTOMATION incident

SECURITY incident
```

depending on cause.

---

# 272. Data Governance Relationship

FinOps minimizes payload/context partly to reduce cost.

It still obeys retention/privacy policy.

---

# 273. Security Relationship

Budget override, provider billing access, and cost configuration are privileged operations.

---

# 274. DR Relationship

FinOps cannot eliminate required:

```text
backup

monitoring

recovery
```

simply because they have ongoing cost.

---

# 275. Architectural Anti-Patterns

Prohibited:

```text
use DEEP for every task

always choose cheapest model

optimize only cost/token

remove verification to save money

send confidential data to cheaper unapproved provider

unlimited Agent delegation

unlimited retries

unlimited model calls

unlimited context

one global budget with no attribution

one Agent allowed to raise its own budget

budget approval treated as business-action approval

estimate displayed as actual billed cost

test/staging cost mixed into production economics

failed work excluded from cost-per-success metrics

event storms allowed to spawn unlimited AI calls

hard budget outage treated as unlimited fail-open

optimize backups/security away without risk analysis
```

---

# 276. Current State Declaration

As of 2026-09-29:

```text
JARVIS FinOps Architecture
ACTIVE specification

Model cost telemetry concept
DEFINED

Cost per successful task concept
DEFINED

Production cost telemetry
NOT IMPLEMENTED

Production daily AI budget
OPEN OWNER DECISION

Production monthly AI budget
OPEN OWNER DECISION

Organization budget allocation
OPEN OWNER DECISION

Expensive workload threshold
OPEN OWNER DECISION

Workflow budget enforcement
NOT IMPLEMENTED

Cost anomaly detection
NOT IMPLEMENTED

Concurrency quota system
NOT IMPLEMENTED

AI FinOps Command Center
NOT IMPLEMENTED
```

---

# 277. Canonicalization Effect

Before this document, cost semantics were distributed across:

```text
Governance & Operations notes

Model strategy

Model Gateway

Observability

AI Evaluation
```

After activation:

```text
jarvis.architecture.cost-resource-finops
```

becomes canonical owner for JARVIS runtime cost and resource-governance semantics.

---

# 278. Architectural Invariants

1. Cost is a first-class runtime signal.
2. Cost estimate is not provider billing truth.
3. ESTIMATED, REPORTED, and BILLED remain distinct.
4. Original provider currency is preserved where material.
5. IDR is preferred internal reporting currency.
6. Every measurable cost should become attributable.
7. Failed and partial executions still consume cost.
8. Cost per successful task uses verified success.
9. Cost per token is not the north-star metric.
10. Deterministic logic is preferred where it solves the task reliably.
11. Expensive models are not default.
12. Cheapest models are not default.
13. Quality, privacy, security, and integrity floors dominate cost optimization.
14. Model escalation is bounded.
15. Multi-model review is consequence-driven, not routine.
16. Context minimization is both privacy and FinOps control.
17. Budget and risk remain independent dimensions.
18. Budget approval does not grant business authority.
19. Agents cannot raise their own budgets.
20. Skills cannot create budget authority.
21. Runtime loops always have resource bounds.
22. Retry cost remains visible.
23. Event storms cannot create unlimited AI spend.
24. Provider rate limits are treated as constraints.
25. Concurrency is bounded where workloads can materially amplify cost.
26. Bulk workloads are estimated before large execution.
27. Sampling before large batch is preferred where practical.
28. Hard budget exhaustion is explicit.
29. Budget-system failure never means unlimited fail-open.
30. Cost anomalies are observable.
31. Unattributed provider spend is investigated.
32. Evaluation/shadow costs remain distinguishable from production fulfillment cost.
33. Environment cost attribution remains explicit.
34. L4 automation receives stronger cost/resource bounds.
35. FinOps cannot silently remove required safety/recovery infrastructure.
36. Cost optimization follows useful correctness, not precedes it.
37. Simple catastrophic-spend controls exist before sophisticated optimization.
38. Persistent budget changes are auditable.
39. Temporary overrides are bounded and expire.
40. FinOps complexity grows from real usage and economics.

---

# 279. Canonical Mental Model

```text
                   WORK REQUEST
                        │
                        ▼
                 RESOURCE PREFLIGHT
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
       QUALITY         RISK          BUDGET
        FLOOR          FLOOR          STATE
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                 MODEL / TOOL ROUTE
                        │
                        ▼
                    EXECUTION
                        │
                        ▼
                       USAGE
                        │
                        ▼
                 COST ATTRIBUTION
                        │
                        ▼
                VERIFIED OUTCOME
                        │
                        ▼
            COST PER SUCCESSFUL TASK
```

---

# 280. Resource Containment Model

```text
WORKFLOW
   │
   ├── max steps
   ├── max model calls
   ├── max Tool calls
   ├── max retries
   ├── max duration
   ├── max concurrency
   └── max spend
```

One runaway dimension cannot be allowed to expand indefinitely.

---

# 281. Routing Economics Model

```text
CAN DETERMINISTIC CODE SOLVE IT?
           │
      ┌────┴────┐
      │         │
     YES        NO
      │         │
      ▼         ▼
    CODE       FAST?
                 │
            ┌────┴────┐
            │         │
           YES        NO
            │         │
            ▼         ▼
           FAST    BALANCED
                       │
              complexity / failure?
                       │
                  ┌────┴────┐
                  │         │
                 NO        YES
                  │         │
                  ▼         ▼
               FINISH      DEEP
```

All candidates must first satisfy quality/security/privacy eligibility.

---

# 282. Founder-by-Exception FinOps

Desired mature behavior:

```text
ordinary spend
→ automatic

routine daily variance
→ telemetry

material cost drift
→ FinOps finding

runaway workflow
→ auto containment

monthly budget pressure
→ routing/scheduling adjustment

large budget exception
→ founder decision
```

Founder should not approve every Rp500 model call.

Founder should decide:

```text
Does this workflow deserve RpX/month?

Should this business receive more AI budget?

Is higher-quality AI producing enough value?

Should this expensive automation scale?
```

---

# 283. First Implementation Sequence

Recommended:

```text
1. CostRecord contract

2. model token/usage capture

3. estimated model-cost calculation

4. organization/workflow attribution

5. per-execution model/tool call ceilings

6. Morning Briefing cost/run metric

7. cost per successful run

8. simple daily/monthly telemetry

9. anomaly detection

10. soft budgets

11. expensive-workload approval

12. hard aggregate budgets after real usage exists

13. cost-aware routing optimization
```

---

# 284. First Production FinOps Gate

Morning Briefing must be able to report:

```text
execution status

model/profile

model calls

Tool calls

tokens

estimated spend

latency

organization

verified outcome
```

before sophisticated budgeting is needed.

---

# 285. Open Owner Decisions

Intentionally unresolved:

```text
Daily AI spend ceiling = ?

Monthly AI spend ceiling = ?

Per-business allocations = ?

Expensive-workload approval threshold = ?

Provider ceilings = ?
```

These become good decisions only after we have measured:

```text
cost/run

workflow volume

business value

quality differences

provider behavior.
```

---

# 286. North Star

Before scaling any AI workflow, JARVIS should eventually be able to answer:

```text
How much does this workflow cost?

Per run?

Per successful run?

Which business pays for it?

Which model consumes most of the spend?

Why are we using that model?

Could deterministic code do this part?

Could FAST do it as well?

Where are retries wasting money?

Are humans correcting cheap models too often?

What happens if usage doubles?

Can this workflow run away?

What hard bounds stop it?

Is the current spend creating enough value to justify scaling?
```

---

# 287. Final Principle

> **The goal of AI FinOps is not to make JARVIS cheap. It is to make every unit of intelligence economically intentional.**

The weak system optimizes:

```text
CHEAPEST MODEL

FEWEST TOKENS

LOWEST API BILL
```

The mature system optimizes:

```text
RIGHT TASK
    ↓
RIGHT METHOD
    ↓
RIGHT MODEL
    ↓
RIGHT RESOURCE BUDGET
    ↓
VERIFIED USEFUL OUTCOME
    ↓
LOWEST SUSTAINABLE TOTAL COST
```

That is the economics required for JARVIS to scale from a handful of AI calls into thousands of daily autonomous operations without turning invisible API spend into the AI equivalent of uncontrolled headcount.