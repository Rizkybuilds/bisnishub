---
canonical_id: jarvis.architecture.lifecycle-versioning-deprecation
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: jarvis
document_class: canonical-specification
effective_from: 2026-09-29
authoritative_for:
  - jarvis runtime component lifecycle
  - jarvis component versioning
  - jarvis compatibility semantics
  - jarvis dependency version semantics
  - jarvis deprecation
  - jarvis retirement
  - jarvis component replacement
  - jarvis migration semantics
  - jarvis provider sunset handling
  - jarvis rollback compatibility
  - jarvis dependency graph
  - jarvis orphan detection
  - jarvis runtime archive semantics
  - jarvis removal gates
  - jarvis lifecycle audit
  - jarvis automation inventory hygiene
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - ../charter.md
  - ../architecture.md
  - ../core-runtime.md
  - agent-registry.md
  - skill-registry.md
  - tool-capability.md
  - model-gateway-routing.md
  - memory.md
  - event-proactive-intelligence.md
  - execution-verification-recovery.md
  - observability-audit-incident.md
  - security-secrets-environment.md
  - data-privacy-retention.md
  - ai-evaluation-regression-autonomy-promotion.md
  - cost-resource-finops.md
  - ../../../../docs/governance/documentation-constitution.md
supersedes: null
implementation_status: PARTIALLY_DEFINED_NOT_IMPLEMENTED
target_runtime_location: systems/jarvis/
---

# JARVIS Lifecycle, Versioning & Deprecation Architecture v1.0

## 1. Purpose

Dokumen ini mendefinisikan bagaimana komponen JARVIS:

```text
dibuat
diversioning
dievaluasi
diaktifkan
diganti
didepresiasi
dipensiunkan
dan akhirnya dibersihkan
```

tanpa kehilangan historical reproducibility atau menciptakan puluhan automation zombie.

---

# 2. Core Principle

> **Everything that can change behavior must have identity, version, lifecycle, dependencies, and an exit path.**

---

# 3. Second Principle

> **Retirement ends future authority. It does not erase history.**

---

# 4. Why Lifecycle Governance Matters

Tanpa lifecycle discipline, beberapa tahun kemudian sistem akan berisi:

```text
CFO Agent lama
CFO Agent baru

skill lama
skill baru

workflow lama

provider API v1/v2/v3

prompt lama

deprecated tools

orphan credentials

unused n8n workflows
```

dan tidak ada yang tahu:

```text
mana masih dipakai?
mana aman dihapus?
mana dibutuhkan workflow lama?
```

---

# 5. Runtime Lifecycle ≠ Documentation Lifecycle

Documentation Constitution already owns document lifecycle:

```text
DRAFT
REVIEW
ACTIVE
DEPRECATED
SUPERSEDED / ARCHIVED
```

This document governs:

```text
runtime/configuration components
```

not canonical-document status.

---

# 6. Lifecycle ≠ Health

Canonical distinction:

```text
Lifecycle
→ should this component exist/be used?

Health
→ can it currently operate?
```

An ACTIVE model may be:

```text
DEGRADED
```

operationally.

---

# 7. Lifecycle ≠ Administrative State

Separate:

```text
ACTIVE lifecycle
+
DISABLED administrative state
```

is valid during an incident.

---

# 8. Lifecycle ≠ Evaluation Qualification

Evaluation states such as:

```text
PASSED_OFFLINE
PASSED_SHADOW
PASSED_CANARY
```

describe evidence.

They are not component lifecycle states.

---

# 9. Lifecycle ≠ Deployment State

A component may be:

```text
ACTIVE
```

as an approved definition while deployed only in:

```text
STAGING
```

Deployment/environment activation remains separate.

---

# 10. Canonical Common Lifecycle

Cross-component lifecycle:

```text
CANDIDATE
    ↓
ACTIVE
    ↓
DEPRECATED
    ↓
RETIRED
```

---

# 11. CANDIDATE

A defined component that is not yet approved for ordinary production selection.

May be:

```text
under implementation

under evaluation

shadowing

canarying

awaiting review
```

---

# 12. CANDIDATE Has No Implicit Production Authority

Merely existing in registry does not allow production execution.

---

# 13. ACTIVE

Approved for selection within its declared:

```text
scope

environment

capability

data class

risk/autonomy constraints
```

---

# 14. ACTIVE Does Not Mean Universally Usable

Example:

```text
Tool v2 ACTIVE
```

may still be limited to:

```text
STAGING

Organization A

R1/R2 only
```

---

# 15. DEPRECATED

Still present for compatibility or controlled migration, but:

> **should receive no new dependency unless explicitly justified.**

---

# 16. Deprecated Component Requirements

SHOULD identify:

```text
replacement

reason

deprecation date

migration guidance

sunset target where known
```

---

# 17. RETIRED

Component must not be selected for new normal runtime work.

Historical references remain resolvable.

---

# 18. RETIRED ≠ Deleted

The identifier, version metadata, and material provenance may remain indefinitely.

---

# 19. RETIRED ≠ Disabled

Disabled:

```text
temporary operational control.
```

Retired:

```text
lifecycle conclusion.
```

---

# 20. RETIRED ≠ Broken

A retired component may still technically function.

It is simply no longer supported/authorized for new use.

---

# 21. Physical Removal

Physical deletion from source/storage is a separate operation occurring only after Removal Gates pass.

---

# 22. Optional Historical Archive

After retirement, source/artifacts may move to:

```text
archive/
```

or equivalent history location.

This is organizational storage, not lifecycle authority itself.

---

# 23. Current Repository Example

Current repo correctly treats:

```text
archive/mgbos-vite-prototype/
```

as retired reference.

Likewise:

```text
bisnis/teestock/archive/
```

preserves old TeeStock source/history while preventing ordinary active use.

---

# 24. Archive Does Not Make Runtime Active

Archived deployment instructions, SQL, credentials references, and scripts are:

```text
HISTORICAL
```

until explicitly promoted through current governance.

---

# 25. No Resurrection by Accident

A retired artifact must not become active because:

```text
old deployment config still exists

old workflow is discovered

old SQL can still execute.
```

---

# 26. Reactivation

If a retired component must return:

```text
do not silently flip RETIRED → ACTIVE.
```

Treat it as:

```text
new candidate
→ current security/eval review
→ activation
```

possibly under a new version.

---

# 27. Stable Component Identity

Every governed runtime component SHOULD have a stable logical ID.

Examples:

```text
agent.business.finance-analyst

skill.business.review-receivables

tool.mgbos.invoice.read

workflow.business.morning-briefing
```

---

# 28. Identity ≠ Version

Canonical:

```text
skill.business.review-receivables
```

is logical identity.

```text
2.1.0
```

is a version of that identity.

---

# 29. Display Name Is Not Identity

Rename:

```text
Finance Analyst
→ Finance Advisor
```

need not change canonical ID if semantics remain continuous.

---

# 30. New Identity

Create a new component ID when semantics become fundamentally different rather than pretending continuity.

---

# 31. Version

Version identifies a materially defined state of one logical component.

---

# 32. Version Immutability

Once a version has been used as material production/evaluation evidence:

> **do not silently mutate its semantics.**

Create a new version.

---

# 33. Semantic Versioning Direction

Preferred format:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
2.3.1
```

---

# 34. MAJOR

Increment when compatibility or expected behavior changes materially.

Examples:

```text
Tool input/output contract breaking

Skill procedure fundamentally changed

Agent mandate materially changed

event payload breaking change
```

---

# 35. MINOR

Backward-compatible capability/behavior addition.

Examples:

```text
new optional field

new supported workflow branch

additional safe Tool
```

---

# 36. PATCH

Non-breaking correction/refinement.

Examples:

```text
typo

bug fix

clarification

non-contract implementation correction
```

---

# 37. Semantic Version Is About Contract Impact

Do not choose version bump based only on:

```text
number of changed lines.
```

---

# 38. Behavioral Changes Matter

AI components may change behavior without changing schema.

A major prompt/Agent behavior shift can require:

```text
new version
+
new eval
```

even when JSON shape is unchanged.

---

# 39. Versioning Is Component-Specific

Semantic interpretation depends on component contract.

This document provides common governance, not identical rules for everything.

---

# 40. Agent Version

Material changes include:

```text
mandate

context access

capability ceiling

handoff rules

decision behavior
```

---

# 41. Skill Version

Material changes include:

```text
procedure

preconditions

allowed capabilities

failure handling

verification requirements
```

---

# 42. Tool Version

Material changes include:

```text
semantic capability

input schema

output schema

side effects

idempotency

verification semantics
```

---

# 43. Provider Adapter Version

Implementation may change while the logical Tool contract remains stable.

Keep:

```text
Tool semantic version
```

separate from:

```text
adapter implementation version
```

where useful.

---

# 44. Model Definition Version

Model registry tracks provider/model/revision and eligibility.

Provider model name is not the JARVIS component lifecycle itself.

---

# 45. Prompt Version

Trusted prompts materially influencing behavior SHOULD be versioned.

---

# 46. Workflow Version

Workflow version captures orchestration semantics such as:

```text
steps

waits

dependencies

failure policy

approval points
```

---

# 47. Policy Version

Permission, routing, approval, risk, and cost policy revisions may materially change execution behavior.

Consequential execution should preserve applicable policy version where useful.

---

# 48. Event Contract Version

Event schema/semantics are versioned independently from producer implementation.

---

# 49. API Contract Version

External/internal APIs should avoid accidental breaking changes.

---

# 50. Database Schema Version

Database evolution follows migration history.

It is not equivalent to runtime semantic version.

---

# 51. MGBOS Migration Law

Current MGBOS rule remains:

```text
new schema change
→ new migration
```

Never rewrite applied migration history.

---

# 52. Migration Version History Is Immutable Evidence

Changing an old migration changes history and reproducibility.

Therefore migration immutability remains stronger than ordinary source-file editing.

---

# 53. Catalog Schema Version

Current:

```text
.agents/roles/contracts.json
schemaVersion: 1
```

means:

```text
format version of that catalog.
```

It does NOT mean:

```text
Planner role version = 1.
```

---

# 54. Engineering Skills Current State

Current `.agents/skills/.../SKILL.md` files generally have:

```text
name
description
```

but do not yet form a canonical JARVIS runtime version/lifecycle registry.

---

# 55. Engineering Skills Remain Engineering Scope

Do not silently convert current `.agents/skills` into production JARVIS Agent/Skill registry.

---

# 56. Component Registry

Each runtime component family SHOULD eventually expose lifecycle metadata.

Logical:

```ts
type ComponentVersion = {
  id: string
  version: string

  lifecycle:
    | "CANDIDATE"
    | "ACTIVE"
    | "DEPRECATED"
    | "RETIRED"

  administrativeState:
    | "ENABLED"
    | "DISABLED"

  owner: string

  introducedAt: string

  deprecatedAt?: string
  retiredAt?: string

  replacement?: ComponentRef

  dependencies: DependencyRef[]

  sourceRef: string
}
```

---

# 57. Health Remains Separate

Add independently:

```text
HEALTHY
DEGRADED
UNAVAILABLE
UNKNOWN
```

where component type requires health.

---

# 58. Evaluation Qualification Remains Separate

Example:

```text
lifecycle = CANDIDATE

qualification = PASSED_SHADOW
```

---

# 59. Active Resolution

New runtime work MAY reference:

```text
logical component ID
```

and registry resolves it to approved active version.

---

# 60. No Unbounded `latest`

Avoid production dependency:

```text
use latest.
```

Preferred:

```text
resolve currently ACTIVE version
through governed registry.
```

---

# 61. Active Pointer

Conceptually:

```text
skill.foo
    ↓
ACTIVE → 2.3.1
```

---

# 62. Active Pointer Changes Are Releases

Changing:

```text
2.3.1 → 2.4.0
```

changes production behavior.

It requires appropriate evaluation/release evidence.

---

# 63. Exact Version Pinning

Durable executions SHOULD preserve exact component versions.

---

# 64. Why Pin Durable Workflows

A workflow waiting eight hours for approval must not silently resume under:

```text
different Skill

different Agent

different workflow semantics
```

without compatibility handling.

---

# 65. Execution Provenance

Material execution may preserve:

```text
Agent version

Skill version

Tool semantic version

workflow version

prompt version

routing version

model revision
```

as applicable.

---

# 66. New Request vs Existing Execution

Canonical:

```text
NEW REQUEST
→ may resolve current ACTIVE version

EXISTING DURABLE EXECUTION
→ resumes with pinned compatible version
```

---

# 67. Breaking Upgrade During Wait

If old pinned version can no longer safely execute:

```text
BLOCK / MIGRATE / REPLAN
```

instead of silently switching.

---

# 68. Dependency

A dependency describes one component requiring another.

---

# 69. Dependency Graph

Example:

```text
Morning Briefing Workflow
├── briefing Skill
├── BALANCED Model Profile
├── finance read Tool
├── operations read Tool
└── GitHub read Tool
```

---

# 70. Dependency Types

Canonical direction:

```text
REQUIRED

OPTIONAL

FALLBACK

MIGRATION_ONLY
```

---

# 71. REQUIRED

Workflow cannot correctly operate without it.

---

# 72. OPTIONAL

Loss causes degraded/partial operation but not total failure.

---

# 73. FALLBACK

Used if preferred dependency unavailable.

---

# 74. MIGRATION_ONLY

Temporarily required during transition between generations.

---

# 75. Dependency Version Constraint

A consumer may depend on:

```text
exact version

compatible major range

logical active ID
```

depending on contract.

---

# 76. Exact Pin

Useful for:

```text
durable workflow

reproducibility

high-risk execution.
```

---

# 77. Compatible Range

Useful for implementation components with established backward-compatible contracts.

---

# 78. Logical Active Dependency

Useful for new short-lived requests where registry controls safe active version.

---

# 79. Dependency Resolution Must Be Deterministic

Same release configuration should not unpredictably choose different versions.

---

# 80. Dependency Graph Enables Impact Analysis

Before retiring Tool X:

```text
who depends on it?
```

must be answerable.

---

# 81. Transitive Dependency

If:

```text
Workflow A
→ Skill B
→ Tool C
```

then Tool C retirement affects Workflow A.

---

# 82. Deprecation Propagation

When a dependency becomes deprecated, consumers should become visible as:

```text
MIGRATION_REQUIRED
```

or equivalent.

---

# 83. Deprecation Does Not Automatically Break Consumers

It starts migration pressure.

---

# 84. Deprecated Dependency Warning

Registry/CI SHOULD eventually flag:

```text
new component
→ deprecated dependency
```

---

# 85. New Dependency Rule

New ACTIVE components SHOULD NOT depend on DEPRECATED components except explicit migration/compatibility cases.

---

# 86. Retired Dependency

New runtime resolution must fail.

Expected:

```text
DEPENDENCY_RETIRED
```

or equivalent.

---

# 87. Existing Workflow With Retired Dependency

May:

```text
finish with pinned safe version

migrate

replan

block
```

depending on reason for retirement.

---

# 88. Security Retirement

If retirement happened because of:

```text
credential compromise

critical vulnerability

unsafe provider
```

old execution MUST NOT continue merely because it was pinned.

---

# 89. Lifecycle Owner

Each governed component has accountable owner.

Owner responsibilities include:

```text
activation

deprecation

replacement

retirement

migration completion.
```

---

# 90. Consumer Owner

Consumer owners are responsible for migrating dependencies before sunset.

---

# 91. Deprecation Record

Logical:

```ts
type DeprecationRecord = {
  component: ComponentRef

  reason: string

  deprecatedAt: string

  replacement?: ComponentRef

  migrationGuide?: string

  targetRetirementAt?: string

  blockingIssues?: string[]
}
```

---

# 92. Deprecation Reason

Examples:

```text
better replacement

provider sunset

security

architecture consolidation

cost

low usage

obsolete business process
```

---

# 93. Deprecation Without Replacement

Valid when capability itself is no longer required.

---

# 94. Sunset Date

Date when support/use is intended to stop.

It can originate from:

```text
internal decision

external provider deadline.
```

---

# 95. Sunset Is Not Automatically Retirement

Before internal retirement verify migration readiness.

Exception:

```text
security or external forced shutdown
```

may require immediate retirement.

---

# 96. Provider Sunset

External providers may announce:

```text
API retirement

model retirement

SDK EOL

product shutdown.
```

---

# 97. Provider Sunset Is Operational Risk

Registry should capture:

```text
deadline

affected Tools/models

replacement

migration status.
```

---

# 98. Provider Sunset Detection

Possible sources:

```text
provider announcement

API warning

SDK warning

contract update

failed request.
```

---

# 99. No Last-Day Migration

Material provider sunsets should trigger migration before the deadline.

---

# 100. Model Sunset

Because JARVIS uses logical model profiles:

```text
provider model retired
```

should normally require:

```text
evaluate replacement
→ update routing
```

rather than rewrite Agents.

---

# 101. Tool Provider Sunset

Logical Tool can survive if a new adapter implements the same contract.

---

# 102. Provider-Neutrality Pays Here

Desired:

```text
tool.email.message.send
        ↓
Provider A sunset
        ↓
Provider B adapter
```

without changing Agent/Skill semantics.

---

# 103. Compatibility

Compatibility means a newer component can safely satisfy consumers expecting an older contract.

---

# 104. Compatibility Dimensions

May include:

```text
schema

semantics

authority

side effects

data class

error behavior

idempotency

verification.
```

---

# 105. Schema Compatibility Is Not Enough

A Tool may retain identical JSON fields while changing:

```text
business meaning

side effect

provider guarantees.
```

That can be breaking.

---

# 106. Behavioral Compatibility

Especially important for:

```text
Agents

Skills

prompts

models.
```

---

# 107. Backward-Compatible Additions

Examples:

```text
optional output field

new optional Tool metadata

new non-breaking event property.
```

---

# 108. Breaking Changes

Examples:

```text
required field removed

meaning changed

default action changed

side-effect semantics changed

authorization assumptions weakened.
```

---

# 109. Compatibility Adapter

Temporary adapter MAY bridge:

```text
old consumer
→ new provider/component.
```

---

# 110. Compatibility Adapter Is Temporary Debt

It should have:

```text
owner

migration target

retirement plan.
```

---

# 111. Do Not Let Compatibility Layers Become Permanent Maze

Each shim increases:

```text
complexity

testing

failure modes.
```

---

# 112. Migration

Migration moves consumers/state from old component semantics to new.

---

# 113. Migration Types

Canonical:

```text
CONFIGURATION_MIGRATION

DEPENDENCY_MIGRATION

STATE_MIGRATION

DATA_MIGRATION

WORKFLOW_MIGRATION

PROVIDER_MIGRATION
```

---

# 114. Configuration Migration

Example:

```text
active model route A → B.
```

---

# 115. Dependency Migration

Example:

```text
Skill v1
→ Tool v1

becomes

Skill v2
→ Tool v2.
```

---

# 116. State Migration

Used when component has durable internal runtime state.

---

# 117. Data Migration

Changes stored data/schema representation.

MGBOS data migrations follow MGBOS migration governance.

---

# 118. Workflow Migration

Needed when long-running workflows cross a breaking workflow-version boundary.

---

# 119. Provider Migration

Moves one logical capability to new provider/adapter.

---

# 120. Migration Is Not Rewrite-in-Place

Preserve rollback/history.

---

# 121. Side-by-Side Migration

Preferred for material behavioral changes:

```text
OLD ACTIVE

NEW CANDIDATE
      ↓
SHADOW
      ↓
CANARY
      ↓
NEW ACTIVE

OLD DEPRECATED
```

---

# 122. One Active Version?

Default preference:

```text
one normal ACTIVE version per identity/environment
```

to reduce ambiguity.

---

# 123. Multiple Active Versions

Allowed only with explicit reason such as:

```text
tenant-specific migration

API compatibility window

canary

regional constraint.
```

---

# 124. Multiple Active Versions Need Deterministic Routing

No arbitrary selection.

---

# 125. Dual Write

Avoid unless migration absolutely requires it.

Dual writes create consistency complexity.

---

# 126. Dual Read

May be useful for migration comparison.

---

# 127. Shadow Comparison

Useful for:

```text
new Agent

new model

new provider

new Skill.
```

---

# 128. Migration Completion

Not complete because:

```text
new version exists.
```

Complete when:

```text
all intended consumers moved

old dependency no longer receives normal work

recovery/rollback decision made

retirement gates pass.
```

---

# 129. Rollback

Rollback returns selection/configuration to a previously qualified version.

---

# 130. Rollback ≠ Business Undo

Actions already performed remain handled through Execution/Recovery architecture.

---

# 131. Rollback Candidate

Should be:

```text
known

compatible

still secure

still available

previously qualified.
```

---

# 132. Rollback Window

After material release, keep previous viable configuration available for a bounded period where practical.

---

# 133. No Universal Rollback Duration

Depends on:

```text
risk

provider constraints

migration reversibility

storage cost.
```

---

# 134. Irreversible Migration

Some data/provider migrations cannot cleanly roll back.

They require:

```text
forward-fix plan

backup

explicit gate.
```

---

# 135. Rollback Compatibility

Old application/runtime must be compatible with current schema/state before rollback.

---

# 136. Rollback of Model Route

Usually easier:

```text
new model
→ previous qualified model.
```

---

# 137. Rollback of Prompt

Requires exact prior prompt version available.

---

# 138. Rollback of Agent/Skill

Requires compatibility with:

```text
current Tools

policies

data contracts.
```

---

# 139. Version Artifact Retention

Keep enough previous artifacts to satisfy:

```text
rollback

audit

reproducibility

incident investigation.
```

---

# 140. Artifact Retention ≠ Unlimited Runtime Support

Old version may remain stored while RETIRED.

---

# 141. Retirement Gate

Before ordinary retirement, verify:

```text
no intended new consumers

replacement ready if required

migration completed

active workflows assessed

rollback needs resolved

documentation updated

monitoring updated.
```

---

# 142. High-Risk Retirement Gate

Also verify:

```text
recovery dependency

audit/evidence references

credential implications

data migration

event consumers

external commitments.
```

---

# 143. Removal Gate

Before physical removal:

```text
component RETIRED

no active runtime dependency

no durable workflow requires executable artifact

historical provenance retained

required rollback window closed

migration complete

data retention handled

credential cleanup handled

alerts/config references removed.
```

---

# 144. Physical Removal Is Not Required

If artifact is cheap and historically useful, retirement + archive may be safer.

---

# 145. Source Removal

May still leave:

```text
metadata

version record

hash

release reference

documentation.
```

---

# 146. Credential Cleanup

Retired integrations SHOULD trigger review of:

```text
API keys

OAuth grants

webhook secrets

provider accounts.
```

---

# 147. Retired Tool With Active Credential

This is security debt.

---

# 148. Webhook Cleanup

Retired provider integration SHOULD disable:

```text
old webhook endpoint

old callback

unused secret
```

where appropriate.

---

# 149. Schedule Cleanup

Retired workflow must not leave:

```text
cron

n8n trigger

scheduler
```

still firing.

---

# 150. Event Subscription Cleanup

Retired consumers should release unnecessary event subscriptions.

---

# 151. Notification Cleanup

Remove stale alert/notification routes associated solely with retired component.

---

# 152. Monitoring Cleanup

Retired component should not continue creating false health alerts.

Historical dashboards may remain.

---

# 153. Data Cleanup

Retirement may leave:

```text
runtime state

cache

temporary data

provider IDs.
```

Handle according to Data/Retention architecture.

---

# 154. Audit Preservation

Do not delete historical audit because component was retired.

---

# 155. Evidence Preservation

Past execution evidence should still resolve component/version identity.

---

# 156. Orphan

An orphan is something with unclear active ownership/dependency status.

---

# 157. Orphan Types

Canonical:

```text
UNREFERENCED_COMPONENT

BROKEN_DEPENDENCY

UNOWNED_COMPONENT

ORPHAN_CREDENTIAL

ORPHAN_SCHEDULE

ORPHAN_WEBHOOK

ORPHAN_DATA

ORPHAN_PROVIDER_ACCOUNT
```

---

# 158. Unreferenced Component

Exists in registry but has no active consumer.

This does not automatically mean safe to delete.

---

# 159. Broken Dependency

Consumer references:

```text
missing

retired

invalid
```

component version.

---

# 160. Unowned Component

No accountable lifecycle owner.

Governance debt.

---

# 161. Orphan Credential

Credential exists but no active Tool/integration should require it.

Security debt.

---

# 162. Orphan Schedule

Scheduler still runs for a retired or missing workflow.

Potential cost/side-effect risk.

---

# 163. Orphan Webhook

External provider continues delivering data to a dead integration.

---

# 164. Orphan Data

Persistent state exists after owning component is retired with no retention justification.

---

# 165. Orphan Detection

Future lifecycle audit SHOULD compare:

```text
registry

dependency graph

scheduler

credentials

webhooks

runtime executions

data stores.
```

---

# 166. Orphan Does Not Mean Auto-Delete

Detection creates:

```text
cleanup candidate.
```

Review before destructive action.

---

# 167. Stale Component

Different from orphan.

A stale component may still be referenced but has:

```text
no recent evaluation

deprecated dependency

old provider version.
```

---

# 168. Lifecycle Debt

Includes:

```text
deprecated components past target date

unused versions

orphan credentials

missing owners

broken dependencies

obsolete workflows.
```

---

# 169. Lifecycle Debt Is Observable

Command Center MAY later show:

```text
3 deprecated components

1 provider sunset in 45 days

2 orphan schedules

4 unused Tool versions.
```

---

# 170. Automation Cemetery

Canonical anti-goal:

```text
hundreds of workflows
nobody understands
but nobody dares delete.
```

---

# 171. Preventing Automation Cemetery

Every recurring automation SHOULD have:

```text
owner

purpose

version

dependencies

lifecycle

last-used/usage evidence

retirement path.
```

---

# 172. Usage Telemetry

Useful lifecycle signal:

```text
last executed

execution count

last successful execution

consumer count.
```

---

# 173. No-Usage ≠ Safe to Retire

Rare disaster-recovery workflow may intentionally run infrequently.

Purpose matters.

---

# 174. High Usage ≠ Keep Forever

Widely used obsolete component may still require migration.

---

# 175. Lifecycle Review Cadence

Periodic review SHOULD inspect:

```text
deprecated

provider sunsets

orphaned

unowned

security-unsupported

unused.
```

Exact cadence can scale with system maturity.

---

# 176. Provider Support Status

External integration MAY expose:

```text
SUPPORTED

DEPRECATED

SUNSET_SCHEDULED

UNAVAILABLE.
```

Keep provider state separate from logical Tool lifecycle.

---

# 177. Example

```text
tool.email.message.send
ACTIVE

provider A adapter
DEPRECATED

provider B adapter
ACTIVE
```

Logical Tool remains active.

---

# 178. Provider Health ≠ Provider Lifecycle

Provider may be:

```text
SUPPORTED
+
UNAVAILABLE
```

during an outage.

---

# 179. Model Provider Alias Risk

Provider aliases may silently point to newer model behavior.

Exact revision provenance is preferable where available.

---

# 180. Moving Alias

Treat as:

```text
potential behavior change
```

requiring monitoring/requalification where material.

---

# 181. API Version Sunset

Tool Adapter SHOULD isolate provider API versions from higher-level capability contracts where possible.

---

# 182. API Compatibility Window

During migration, support:

```text
provider API v1
+
provider API v2
```

only as long as required.

---

# 183. Legacy Compatibility

Legacy code may remain because:

```text
current consumer still depends on it.
```

Make the dependency explicit rather than pretending it is retired.

---

# 184. Current Repo Example

`packages/shared/` is marked:

```text
legacy shared
```

but current consumers still exist.

Therefore:

```text
LEGACY
≠
RETIRED.
```

---

# 185. Historical vs Legacy vs Deprecated vs Retired

Canonical distinctions:

```text
HISTORICAL
→ evidence/reference of past state

LEGACY
→ older architecture still potentially consumed

DEPRECATED
→ supported temporarily but migration expected

RETIRED
→ no normal runtime use.
```

---

# 186. Archive Location ≠ Lifecycle Status

Lifecycle comes from canonical registry/source map.

Folder name alone is insufficient.

---

# 187. Supersession

One component/version may explicitly supersede another.

---

# 188. Supersession Record

Should identify:

```text
old

new

reason

effective date.
```

---

# 189. Superseded Component May Remain Deprecated First

Example:

```text
v1 ACTIVE
→ v2 ACTIVE
→ v1 DEPRECATED
→ v1 RETIRED.
```

---

# 190. Emergency Replacement

Critical vulnerability may force:

```text
ACTIVE
→ DISABLED
→ RETIRED
```

without long deprecation period.

Safety takes precedence.

---

# 191. Emergency Replacement Evidence

Still preserve:

```text
reason

incident

affected consumers

recovery path.
```

---

# 192. Lifecycle Transitions Are Auditable

Material transitions SHOULD record:

```text
component

version

from

to

actor

time

reason

replacement.
```

---

# 193. Who May Change Lifecycle

Lifecycle mutation is governance authority.

Agent/component cannot self-activate, self-deprecate, or self-retire except through explicit authorized automation.

---

# 194. Candidate Cannot Promote Itself

Evaluation can recommend.

Owner/governance activates.

---

# 195. Retirement Cannot Be Model Suggestion Alone

AI may identify cleanup candidates.

Destructive retirement/removal still follows governance.

---

# 196. Lifecycle and Autonomy

Autonomy grants bind to:

```text
component/capability version or compatible policy scope.
```

---

# 197. New Major Version Does Not Automatically Inherit High Autonomy

Especially for:

```text
Agent

Skill

Workflow.
```

Re-evaluation may be required.

---

# 198. Minor/Patch Autonomy Inheritance

May remain valid only if:

```text
behavioral impact analysis

evaluation policy
```

supports it.

---

# 199. Lifecycle and Permission

Retired Tool is not executable even if old role policy references it.

---

# 200. Lifecycle and Approval

Approval for action prepared under old version may become stale if migration materially changes:

```text
payload

risk

target

semantics.
```

---

# 201. Lifecycle and Durable Execution

Old workflow version may remain executable solely to:

```text
finish

recover

reconcile
```

existing operations.

---

# 202. Legacy Execution Mode

Future runtime MAY classify:

```text
NEW_WORK

LEGACY_CONTINUATION

RECOVERY_ONLY.
```

---

# 203. Retired Version Recovery

Keeping a retired adapter available for reconciliation may be justified.

It should not receive new ordinary work.

---

# 204. Lifecycle and Events

Event producer changes must preserve consumer compatibility or introduce a new event contract version.

---

# 205. Event Consumers Need Version Declaration

Consumer should state supported versions where necessary.

---

# 206. Event Version Removal

Before stopping old event version:

```text
all consumers migrated.
```

---

# 207. Lifecycle and Memory

Memory referencing retired components remains historical context.

It does not reactivate them.

---

# 208. Memory About Old Procedure

Should be revalidated against current active Skill before operational use.

---

# 209. Lifecycle and Data

Retiring software does not automatically delete associated business data.

Data lifecycle is separately governed.

---

# 210. Lifecycle and Security

Unsupported provider/library/version can trigger accelerated deprecation/retirement.

---

# 211. End-of-Security-Support

May be stronger retirement signal than low usage.

---

# 212. Lifecycle and FinOps

Unused/deprecated integrations may create:

```text
subscriptions

minimum fees

storage

background calls.
```

Retirement should eliminate unnecessary cost.

---

# 213. Cost Is Not Sole Retirement Criterion

A costly component may remain critical.

---

# 214. Lifecycle and DR

Recovery plans should not depend on inaccessible retired versions without preserving required artifacts.

---

# 215. Lifecycle and Backup

Backup may contain retired components/data.

Restore should not automatically reactivate them.

---

# 216. Restore Lifecycle Reconciliation

After restoring old configuration:

```text
reapply current retirement

revocation

deprecation

kill-switch
```

state.

---

# 217. Lifecycle and Observability

Registry/Command Center should expose:

```text
lifecycle

health

qualification

admin state
```

separately.

---

# 218. Example Projection

```text
Finance Analyst v2.1
Lifecycle: ACTIVE
Qualification: PRODUCTION_OBSERVED
Health: HEALTHY
Admin: ENABLED
```

---

# 219. Another Example

```text
Email Adapter A v1.8
Lifecycle: DEPRECATED
Qualification: PASSED_CANARY
Health: HEALTHY
Admin: ENABLED
Retires: 2026-12-01
Replacement: Adapter B v2
```

---

# 220. Lifecycle and Evals

CANDIDATE normally requires evaluation before ACTIVE.

---

# 221. Deprecated Component Eval

May still require critical regression maintenance until all consumers migrate.

---

# 222. Retired Component Eval

No routine eval required unless needed for:

```text
recovery

migration

historical reproducibility.
```

---

# 223. New Major Version

Should normally begin:

```text
CANDIDATE
```

even when previous major is ACTIVE.

---

# 224. Patch Release

May use lighter gate if behavioral impact is genuinely small.

---

# 225. Version Bump Does Not Replace Risk Assessment

A one-line patch can be high-risk.

---

# 226. Release Manifest

Material JARVIS release MAY identify a set of component versions:

```text
runtime

Agent

Skill

Tool Registry

Prompt

Policy

Router.
```

---

# 227. Behavior Release

The AI Evaluation architecture may use:

```text
behavior_release_id
```

to represent this combination.

---

# 228. Release Manifest Is Not Component Version

It bundles versions.

---

# 229. Dependency Lock

Production release SHOULD make selected versions reconstructable.

---

# 230. Mutable External Dependencies

Where exact pinning is impossible:

```text
record external alias/version

monitor drift

re-evaluate.
```

---

# 231. Lifecycle Governance Should Be Machine-Readable

Registry metadata SHOULD eventually support automated:

```text
dependency checks

sunset warnings

orphan reports

release gates.
```

---

# 232. Human-Readable Documentation Remains Required

Registry metadata does not replace explanation/migration guides.

---

# 233. CI Lifecycle Checks

Future checks MAY detect:

```text
new dependency on deprecated component

missing component ID

retired dependency

duplicate active version

missing owner

missing replacement metadata

invalid version relation.
```

---

# 234. CI Cannot Prove Migration Complete Alone

Runtime consumers/external integrations may require operational evidence.

---

# 235. Dependency Scan

Runtime and repo SHOULD eventually be able to answer:

```text
show everything depending on tool X.
```

---

# 236. Reverse Dependency Graph

Essential for safe retirement.

---

# 237. External Dependencies

Registry may include dependencies not stored in repo:

```text
provider API

SaaS

model

webhook

cloud runtime.
```

---

# 238. External Dependency Ownership

Each material provider integration SHOULD have internal owner.

---

# 239. Provider Contract Change

Must not silently rewrite higher-level JARVIS semantics.

Adapter absorbs changes where possible.

---

# 240. Retirement Checklist

Canonical minimum:

```text
identify consumers

stop new consumers

provide replacement

migrate

observe

disable new execution

revoke unused credentials

remove schedules/webhooks

retain provenance

archive/remove artifact.
```

---

# 241. Removal Checklist

Additional:

```text
no rollback requirement

no recovery requirement

no active durable execution

no unresolved legal/audit dependency

data cleanup complete.
```

---

# 242. No Big-Bang Cleanup

Lifecycle hygiene SHOULD be continuous.

---

# 243. Quarterly Cleanup Direction

As runtime matures, review:

```text
deprecated

sunset

orphan

unused

unowned

unsupported.
```

Exact operational cadence may evolve.

---

# 244. Lifecycle Debt Budget

System MAY eventually set tolerance such as:

```text
no critical deprecated provider
past sunset
```

rather than arbitrary component-count targets.

---

# 245. Command Center Lifecycle View

Future view:

```text
ACTIVE          24

CANDIDATE        3

DEPRECATED       4

RETIRING SOON    1

ORPHANED         2
```

---

# 246. Important Detail

Do not optimize for:

```text
zero deprecated components.
```

Temporary deprecation is a healthy migration mechanism.

---

# 247. Bad Signal

Problem is:

```text
deprecated forever
+
no owner
+
no migration.
```

---

# 248. First Implementation Scope

Do NOT begin with a huge software asset-management platform.

Start with registry metadata.

---

# 249. Phase 1

Add canonical fields to JARVIS runtime registries:

```text
id

version

lifecycle

owner

dependencies.
```

---

# 250. Phase 2

Add:

```text
active version resolution

exact execution provenance.
```

---

# 251. Phase 3

Add:

```text
deprecation

replacement

sunset metadata

reverse dependency scan.
```

---

# 252. Phase 4

Add:

```text
retirement guard

orphan detection

credential/schedule cleanup checks.
```

---

# 253. Phase 5

Integrate lifecycle with:

```text
Command Center

CI

provider-sunset monitoring

release tooling.
```

---

# 254. First Agent Lifecycle Definition of Done

Agent has:

```text
stable ID

version

owner

lifecycle

capability ceiling

evaluation linkage

dependency metadata

retirement path.
```

---

# 255. First Skill Lifecycle Definition of Done

Skill has:

```text
stable ID

version

procedure contract

dependencies

owner

lifecycle

replacement/deprecation metadata

evaluation linkage.
```

---

# 256. First Tool Lifecycle Definition of Done

Tool has:

```text
stable semantic ID

semantic version

adapter/provider mapping

lifecycle

admin state

health

credential profile

replacement/migration plan.
```

---

# 257. First Workflow Lifecycle Definition of Done

Workflow has:

```text
ID

version

owner

required dependencies

durable-version persistence

migration rules

retirement rules.
```

---

# 258. Provider Sunset Definition of Done

System can answer:

```text
Which provider capability is ending?

When?

Which components depend on it?

What replaces it?

Has replacement passed eval?

Which consumers remain?

Can old credentials be revoked?
```

---

# 259. Retirement Definition of Done

Component reaches RETIRED only after:

```text
new work blocked

consumers accounted for

migration/recovery plan resolved

audit/provenance preserved.
```

---

# 260. Removal Definition of Done

Physical removal only after:

```text
retirement complete

no executable dependency remains

historical references preserved

security/data cleanup resolved.
```

---

# 261. Automation-Cemetery Prevention Definition of Done

For every recurring production automation we can answer:

```text
Who owns it?

Why does it exist?

Which version runs?

What triggers it?

What does it depend on?

When did it last run?

How do we disable it?

How do we replace it?

How do we retire it?
```

---

# 262. Architectural Anti-Patterns

Prohibited:

```text
use latest everywhere

mutate old production version in place

delete old version before rollback closes

new component depends on deprecated component silently

retired Tool still callable

orphan credential kept forever

old cron continues after workflow retirement

provider sunset discovered after shutdown

schema-compatible change assumed behavior-compatible

old approval automatically applies to changed semantics

durable workflow resumes under arbitrary new Skill

archive folder accidentally redeployed

deprecated = broken

legacy = retired

retired = delete all historical evidence

component self-promotes to ACTIVE

component self-removes dependency history
```

---

# 263. Current State Declaration

As of 2026-09-29:

```text
JARVIS Lifecycle Architecture
ACTIVE specification

JARVIS Runtime Component Registry
NOT IMPLEMENTED

Agent Runtime Version Registry
NOT IMPLEMENTED

Skill Runtime Version Registry
NOT IMPLEMENTED

Tool Runtime Lifecycle Registry
NOT IMPLEMENTED

Workflow Version Registry
NOT IMPLEMENTED

Reverse Dependency Graph
NOT IMPLEMENTED

Provider Sunset Tracking
NOT IMPLEMENTED

Orphan Detection
NOT IMPLEMENTED

Retirement Automation
NOT IMPLEMENTED

Engineering role catalog schema
EXISTS

Engineering runtime component versioning
NOT EQUIVALENT TO JARVIS LIFECYCLE

TeeStock Legacy Storefront
RETIRED / ARCHIVED

MGBOS Vite Prototype
RETIRED / ARCHIVED

packages/shared
LEGACY BUT STILL POTENTIALLY CONSUMED
```

---

# 264. Canonicalization Effect

Before this document, lifecycle concepts were distributed across:

```text
Governance notes

Agent architecture

Skill architecture

Tool architecture

Model Gateway

AI Evaluation

project-index

archive conventions
```

After activation:

```text
jarvis.architecture.lifecycle-versioning-deprecation
```

becomes canonical semantic owner for JARVIS runtime lifecycle/version/deprecation semantics.

Component-specific architecture documents remain owners of their domain-specific contract details.

---

# 265. Architectural Invariants

1. Every mutable behavioral runtime component has stable identity.
2. Identity and version remain separate.
3. Material production versions are immutable in semantics.
4. Lifecycle, health, admin state, qualification, and deployment state remain separate.
5. Common lifecycle is CANDIDATE → ACTIVE → DEPRECATED → RETIRED.
6. Candidate components do not receive implicit production authority.
7. Deprecated components receive no new dependency by default.
8. Retired components receive no new normal runtime work.
9. Retirement does not erase history.
10. Archive location does not determine authority.
11. Legacy does not automatically mean retired.
12. Historical does not mean executable.
13. Runtime dependency resolution is deterministic.
14. New short-lived requests may resolve governed ACTIVE version.
15. Durable workflows preserve exact relevant versions.
16. Long waits do not silently switch workflow semantics.
17. Major behavioral change normally begins as candidate.
18. Evaluation evidence is version-specific.
19. New major versions do not automatically inherit autonomy.
20. Component self-promotion is prohibited.
21. Component self-retirement/removal is prohibited without authority.
22. Dependency graph is a first-class lifecycle asset.
23. Transitive dependencies are considered before retirement.
24. Retired dependency cannot silently resolve.
25. Security retirement can override ordinary migration grace.
26. Deprecated state includes owner/reason/replacement where applicable.
27. Provider sunset is treated as lifecycle risk.
28. Provider-neutral contracts reduce migration cost.
29. Compatibility includes semantics and side effects, not schema alone.
30. Temporary compatibility adapters have explicit exit plans.
31. Migration preserves rollback/history where possible.
32. Rollback does not undo real-world side effects.
33. Previous rollback candidate must remain secure and compatible.
34. Physical removal occurs only after retirement/removal gates.
35. Credentials, schedules, webhooks, and data are included in retirement cleanup.
36. Orphan detection never implies automatic deletion.
37. Deprecated forever with no migration is lifecycle debt.
38. Usage alone does not determine retirement.
39. Rare recovery components are not considered dead solely due to low usage.
40. Restoring old backup/configuration does not resurrect retired authority.
41. Event/API compatibility is versioned.
42. Applied MGBOS migration history remains immutable.
43. Registry metadata should become machine-checkable.
44. CI lifecycle checks do not replace operational evidence.
45. Automation should always have a known owner and exit path.
46. Lifecycle governance should reduce, not increase, permanent compatibility complexity.

---

# 266. Canonical Mental Model

```text
                   NEW COMPONENT
                         │
                         ▼
                     CANDIDATE
                         │
                  evaluate / test
                         │
                         ▼
                       ACTIVE
                         │
                 replacement needed?
                         │
                         ▼
                    DEPRECATED
                         │
                     migrate
                         │
                         ▼
                      RETIRED
                         │
             ┌───────────┴────────────┐
             │                        │
             ▼                        ▼
       KEEP HISTORICAL            REMOVE
          ARTIFACT              after gates
```

Throughout:

```text
IDENTITY
VERSION
OWNER
DEPENDENCIES
PROVENANCE
```

remain preserved.

---

# 267. Dependency Mental Model

```text
WORKFLOW
   │
   ▼
SKILL
   │
   ▼
CAPABILITY / TOOL
   │
   ▼
PROVIDER ADAPTER
   │
   ▼
EXTERNAL PROVIDER
```

If the bottom layer changes, the goal is to migrate as low in the stack as possible.

Example:

```text
provider changes
```

should ideally NOT require:

```text
Agent rewrite.
```

---

# 268. Release Mental Model

```text
v1 ACTIVE

     new candidate
          │
          ▼
       v2 CANDIDATE
          │
       evaluate
          │
       shadow
          │
       canary
          │
          ▼
       v2 ACTIVE
          │
          ▼
     v1 DEPRECATED
          │
       migrate
          │
          ▼
       v1 RETIRED
```

---

# 269. Automation Hygiene Model

```text
REGISTRY
   │
   ├── owner?
   ├── purpose?
   ├── version?
   ├── consumers?
   ├── usage?
   ├── provider?
   ├── credential?
   ├── schedule?
   └── retirement?
          │
          ▼
     CLEAN INVENTORY
```

not:

```text
"gue rasa workflow ini masih dipakai."
```

---

# 270. Founder-by-Exception Lifecycle

Long-term desired behavior:

```text
normal patch/minor lifecycle
→ automated checks

provider sunset detected
→ migration finding

unused component
→ cleanup candidate

deprecated dependency
→ engineering backlog

critical security EOL
→ containment

material retirement/removal
→ founder/owner decision when needed
```

Founder should not manually inventory hundreds of automation objects.

Founder should see:

```text
what is aging

what needs replacement

what costs money but adds no value

what creates risk if not migrated.
```

---

# 271. First Implementation Sequence

Recommended:

```text
1. ComponentRef contract

2. common lifecycle enum

3. version fields in JARVIS Agent/Skill/Tool/Workflow registries

4. owner metadata

5. dependency references

6. exact version execution provenance

7. ACTIVE version resolver

8. deprecation/replacement metadata

9. reverse dependency report

10. retirement guard

11. orphan schedule/credential detection

12. provider-sunset monitoring when external integration count justifies it
```

---

# 272. Non-Goals

Do NOT initially build:

```text
enterprise CMDB

complex service catalog

automatic mass migration engine

hundreds of lifecycle states

generic package-manager replacement

fully autonomous component deletion.
```

---

# 273. North Star

Before changing or retiring any important automation component, BisnisHub should eventually be able to answer:

```text
What is its stable ID?

Which version is active?

Who owns it?

Which workflows depend on it?

Which businesses depend on it?

Is it healthy?

Is it qualified?

Is it deprecated?

Why?

What replaces it?

When does its provider sunset?

Are durable workflows pinned to it?

Can we roll back?

Are credentials still attached?

Are schedules/webhooks still active?

Which historical evidence references it?

Can it now be retired?

Can it actually be physically removed?
```

---

# 274. Final Principle

> **The mature system is not the one with the most Agents, Skills, Tools, and workflows. It is the one where every component has a known reason to exist—and a safe way to stop existing.**

The weak architecture grows like:

```text
V1
+ V2
+ workaround
+ duplicate workflow
+ old provider
+ temporary script
+ old credential
+ nobody knows
```

The desired architecture grows like:

```text
IDENTIFY
   ↓
VERSION
   ↓
EVALUATE
   ↓
ACTIVATE
   ↓
OBSERVE
   ↓
REPLACE
   ↓
DEPRECATE
   ↓
MIGRATE
   ↓
RETIRE
   ↓
CLEAN
```

That is what prevents BisnisHub from eventually becoming a graveyard of forgotten automation that everyone is afraid to touch.