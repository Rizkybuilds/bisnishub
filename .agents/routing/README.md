---
canonical_id: agents.engineering.routing
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository-engineering
document_class: registry-guide
effective_from: 2026-10-01

authoritative_for:
  - engineering task classification semantics
  - engineering routing composition
  - task-type versus concern separation
  - engineering risk-floor composition
  - role routing composition
  - expertise routing composition
  - engineering routing escalation semantics

last_reviewed: 2026-10-01
review_cadence: quarterly

depends_on:
  - ../../docs/engineering/engineering-ai-control-plane.md
  - ../../docs/governance/cross-system-risk-classification.md
  - ../../docs/governance/evidence-provenance-model.md
  - ../roles/contracts.json
  - ../expertise/registry.yaml
  - ../../docs/engineering/repository-release-gates.md
  - ../../systems/mgbos/docs/engineering/agent-system/risk-classification.md

machine_registry:
  - task-types.yaml

supersedes: null
---

# BisnisHub Engineering Task & Routing Model v1

## 1. Purpose

Directory ini menentukan bagaimana engineering work diklasifikasikan dan diterjemahkan menjadi bounded execution requirements.

Routing menjawab:

```text
What kind of work is this?

What consequence domains does it touch?

What is the minimum risk?

Which roles are required?

Which expertise must be loaded?

Which Skills may be relevant?

Which assurance is required?

Which conditions require escalation?
```

Machine-readable source:

```text
.agents/routing/task-types.yaml
```

---

# 2. Core Routing Model

Canonical:

```text
USER INTENT
    ↓
RESOLVE TARGET SYSTEM
    ↓
TASK TYPE
    +
CROSS-CUTTING CONCERNS
    +
ENVIRONMENT
    ↓
RISK COMPOSITION
    ↓
ROLE COMPOSITION
    ↓
EXPERTISE COMPOSITION
    ↓
SKILL SELECTION
    ↓
WORK CONTRACT
```

Routing is constraint resolution.

Routing is not free-form persona selection.

---

# 3. Task Type and Concern Are Different

Task Type answers:

> **What engineering operation are we performing?**

Examples:

```text
backend-command-change

database-schema-change

frontend-ui-change
```

Concern answers:

> **What consequential property does this work affect?**

Examples:

```text
financial-truth

authorization

external-side-effect
```

One task type may carry several concerns.

Example:

```text
TASK TYPE
backend-command-change

CONCERNS
financial-truth
authorization
concurrency-idempotency
historical-integrity
```

Do not create a new combined task type for every combination.

---

# 4. Why Composition Is Required

A payment implementation might involve:

```text
Type:
backend-command-change

Concern:
financial-truth

Concern:
authorization

Concern:
concurrency-idempotency
```

A UI display change might involve:

```text
Type:
frontend-ui-change

Concern:
none
```

A customer notification workflow might involve:

```text
Type:
workflow-automation-change

Concern:
external-side-effect
```

This prevents taxonomy explosion.

---

# 5. Primary Task Type

Every governed work package SHOULD have one:

```text
primary_task_type
```

representing the dominant engineering activity.

Example:

```text
primary_task_type:
database-schema-change
```

The primary type does not hide secondary consequences.

---

# 6. Concerns

A task MAY have zero or more:

```text
concerns
```

All applicable material concerns MUST be preserved.

Do not select only the concern that produces the easiest route.

---

# 7. Effective Risk

Effective risk is the highest applicable risk from:

```text
task-type risk floor

concern risk floor

environment rule

affected capability risk

explicit policy floor
```

Conceptually:

```text
effective_risk =
max(
  task_floor,
  concern_floors,
  environment_floor,
  capability_floor,
  policy_floor
)
```

Risk meaning remains owned by:

```text
docs/governance/cross-system-risk-classification.md
```

---

# 8. No Downward Override

Runtime may raise risk.

Runtime MUST NOT reduce below any hard floor contributed by:

```text
task type

concern

capability

environment

policy
```

without explicit governance change.

---

# 9. Example — Payment Change

Input:

```text
Modify payment allocation command.
```

Classification:

```yaml
primary_task_type: backend-command-change

concerns:
  - financial-truth
  - authorization
  - concurrency-idempotency
  - historical-integrity
```

Risk composition:

```text
backend-command-change
→ R2 floor

financial-truth
→ R5 floor

authorization
→ R4 floor

effective
→ R5
```

---

# 10. Example — Read-Only Founder Attention View

Classification:

```yaml
primary_task_type: read-model-change

concerns:
  - authorization
```

Because the read model must preserve organization scope.

Authorization concern may raise required assurance even though the projection itself is read-only.

---

# 11. Example — UI Styling

Classification:

```yaml
primary_task_type: frontend-ui-change

concerns: []
```

If actual diff only changes presentation:

```text
risk may remain low
```

If implementation introduces a mutation or authorization change:

```text
reclassify
```

Do not keep the original classification merely because the request began as UI work.

---

# 12. Example — n8n Reminder

Classification:

```yaml
primary_task_type: workflow-automation-change

concerns:
  - external-side-effect
  - concurrency-idempotency
```

If workflow later records payments:

```text
financial-truth
```

must also be added.

Effective risk becomes R5.

---

# 13. Target System Resolution Comes First

Before routing:

```text
resolve the workspace
```

Current supported routing profiles:

```text
mgbos
→ systems/mgbos/

repository-engineering
→ ./
```

Archive or historical implementation MUST NOT be selected from similarity alone.

Future systems may add routing profiles.

---

# 14. Routing Profile

Machine registry may contain:

```text
profiles
```

A profile binds shared routing semantics to a concrete system.

Current active profiles:

```text
mgbos
→ systems/mgbos/

repository-engineering
→ ./
```

Future examples:

```text
jarvis
kaskita
```

They MUST NOT redefine repository-wide role/risk/expertise semantics.

---

# 15. Classification Is Evidence-Based

Classification SHOULD inspect:

```text
requested outcome

current implementation

changed paths

canonical contracts

actual capability affected

environment

external effects
```

Do not classify from request keywords alone.

---

# 16. Classification May Change

Initial classification is not permanent.

During implementation:

```text
new consequential behavior discovered
        ↓
reclassify
        ↓
recompute controls
```

Example:

```text
planned UI change
```

reveals:

```text
authorization logic must change
```

Then authorization concern MUST be added.

---

# 17. Role Composition

Each task type and concern may contribute required roles.

Effective role set is:

```text
union of all required roles
```

Role execution order follows canonical order:

```text
planner
→ engineer
→ auditor
→ qa
→ release-operator
```

Only roles required for the actual work are activated.

---

# 18. Role Union Example

Task type:

```text
backend-command-change
```

requires:

```text
planner
engineer
qa
```

Concern:

```text
financial-truth
```

adds:

```text
auditor
```

Effective:

```text
planner
→ engineer
→ auditor
→ qa
```

Release Operator is not automatically included unless release work is requested or required by the current stage.

---

# 19. Release Is a Separate Stage

Implementation completion does not mean release work is underway.

Canonical:

```text
IMPLEMENT
→ ASSURE
→ VERIFY
```

Then, if release is actually requested:

```text
RELEASE OPERATOR
```

is activated.

Do not introduce deployment authority into ordinary implementation routing.

---

# 20. Expertise Composition

Required expertise is also composed through union.

Example:

```text
backend-command-change
→ EXP-002
→ EXP-003

financial-truth
→ EXP-006

authorization
→ EXP-005
→ EXP-007
```

Effective expertise:

```text
EXP-002
EXP-003
EXP-005
EXP-006
EXP-007
```

---

# 21. Assurance Expertise

Some concerns also require:

```text
EXP-011
Independent Business Integrity Assurance
```

Loading EXP-011 does not create actual review independence.

Execution facts determine independence.

---

# 22. Expertise Maturity

Automatic mandatory routing SHOULD normally use:

```text
ACTIVE
```

expertise.

`PROVISIONAL` expertise MAY be:

```text
recommended

explicitly selected

Planner-selected
```

but SHOULD NOT become an unconditional automatic requirement until its canonical semantics mature.

---

# 23. Skill Selection

Routing registry may provide:

```text
skill_candidates
```

Candidate does not mean mandatory loading.

Skill selection considers:

```text
active role

actual implementation layer

task target

existing Skill contract
```

Do not load every candidate Skill.

---

# 24. Role Skills Still Apply

Role-owned Skills in:

```text
.agents/roles/contracts.json
```

remain valid.

Routing Skills supplement them.

They do not replace role contracts.

---

# 25. Required Skills Should Be Rare

A Skill should be `required` only when the procedure itself is essential to correct execution.

Otherwise use:

```text
skill_candidates
```

This avoids unnecessary context.

---

# 26. Assurance Composition

Machine routing may contribute:

```text
qa

audit

independent_review

recovery

release_review

owner_decision
```

Effective assurance uses the strictest applicable requirement.

---

# 27. Assurance Levels

Registry uses:

```text
NONE

PROPORTIONAL

REQUIRED

INDEPENDENT_REQUIRED
```

Meaning:

`NONE`

No additional assurance imposed by this route.

`PROPORTIONAL`

Use judgment based on actual change.

`REQUIRED`

A distinct review/verification step is required.

`INDEPENDENT_REQUIRED`

Required review must satisfy actual independence semantics.

---

# 28. Self-Review

A runtime may sequentially perform:

```text
Engineer
→ Auditor
```

for useful self-review.

But if route says:

```text
INDEPENDENT_REQUIRED
```

same-runtime sequential review does NOT satisfy the requirement.

Record:

```text
SELF_REVIEW
```

and leave independent assurance unresolved.

---

# 29. Environment Composition

Environment can raise effective risk.

Machine registry recognizes:

```text
local-disposable

local-nondisposable

ci

staging

production
```

Environment alone does not define business consequence.

Environment rules apply together with mutation and capability risk.

---

# 30. Production Mutation

A real production mutation has minimum:

```text
R4
```

unless a higher canonical floor applies.

Examples:

```text
production payment
→ R5

production privileged-security change
→ R5

destructive authoritative-data change
→ R5
```

---

# 31. Local Does Not Lower Capability Risk

Developing payment logic locally does not make the affected engineering change low consequence.

Distinguish:

```text
execution environment risk
```

from:

```text
affected capability risk
```

A payment-integrity implementation may still require R5 assurance while being tested only against local disposable infrastructure.

---

# 32. Stop Conditions

Routing may contribute stop conditions.

Canonical examples:

```text
CANONICAL_CONFLICT

UNKNOWN_HIGH_RISK

SCOPE_EXPANSION_REQUIRED

REQUIRED_SOURCE_MISSING

PERMISSION_UNCLEAR

ENVIRONMENT_UNVERIFIED

FINANCIAL_INVARIANT_AMBIGUOUS

DESTRUCTIVE_CHANGE_REQUIRED

REQUIRED_EVIDENCE_UNAVAILABLE

UNRELATED_WORK_COLLISION

SECURITY_BOUNDARY_UNCLEAR
```

When any blocking condition applies:

```text
do not silently continue
```

---

# 33. Fail Closed

Unknown consequential routing state MUST NOT default to:

```text
documentation-change
R0
Engineer only
```

Correct:

```text
UNRESOLVED_CLASSIFICATION
```

followed by planning/escalation.

---

# 34. Governance Changes

Governance changes deserve special treatment because they can alter future agent behavior without touching runtime code.

Changes involving:

```text
AGENTS.md

.agents/

governance validator

CI guards

permission matrix

routing registry

risk profile
```

should classify as:

```text
governance-change
```

even if the physical files are Markdown/YAML/Python only.

---

# 35. Guard Self-Validation

A modified governance validator MUST NOT be trusted solely because the modified validator passes.

Governance changes SHOULD include:

```text
positive tests

negative tests

review of bypass possibilities
```

and applicable independent inspection.

---

# 36. Architecture Contract Changes

Architecture contract work includes changes to:

```text
canonical entity semantics

system boundaries

state machine semantics

command/event architecture

permission model

architectural laws
```

This is distinct from ordinary documentation maintenance.

A Markdown architecture change can therefore be consequential.

---

# 37. Test Changes

Tests can alter acceptance authority.

Removing or weakening:

```text
financial tests

authorization tests

migration immutability tests

security tests

release gates
```

must be evaluated according to the protection lost.

Test-only does not automatically mean low risk.

---

# 38. Cross-Cutting Financial Truth

`financial-truth` applies when work can materially affect:

```text
payment

payment allocation

refund

reversal

invoice balance

vendor payment

financial ledger

financial reconciliation
```

Canonical floor:

```text
R5
```

---

# 39. Cross-Cutting Authorization

`authorization` applies when work changes or materially relies upon:

```text
identity

role resolution

organization scope

permission

RLS

privileged execution

service principal

capability eligibility
```

Canonical engineering floor:

```text
R4
```

Raise to R5 for privileged financial/security/production authority.

---

# 40. Cross-Cutting External Side Effect

`external-side-effect` applies when behavior can materially affect:

```text
customer

vendor

provider

external communication

external operational state
```

Baseline:

```text
R3
```

unless a higher consequence applies.

---

# 41. Cross-Cutting Sensitive Data

`sensitive-data` applies when work can expose or materially alter protected data.

Typical minimum:

```text
R4
```

Raw production secrets or equivalent critical credentials may be:

```text
R5
or prohibited
```

under applicable policy.

---

# 42. Cross-Organization Boundary

`cross-organization-boundary` applies whenever tenant isolation can be affected.

Minimum:

```text
R4
```

Required expertise includes authorization and security.

Negative isolation testing is required.

---

# 43. Concurrency / Idempotency

`concurrency-idempotency` does not always raise risk by itself.

It adds mandatory reasoning/testing requirements when:

```text
retry

duplicate delivery

concurrent mutation

lost response
```

can produce incorrect business effects.

Underlying capability determines final risk.

---

# 44. Historical Integrity

`historical-integrity` applies to work affecting:

```text
immutable snapshots

quote versions

order contract history

financial history

audit records

migration history
```

Concern adds integrity requirements.

Actual risk follows affected truth.

---

# 45. Production-Critical

`production-critical` applies when failure can materially disrupt:

```text
production availability

business operations

authoritative production data

critical infrastructure
```

Typical minimum:

```text
R4
```

Destructive authoritative production effects may become:

```text
R5
```

---

# 46. Bulk Operation

`bulk-operation` applies when one action or defect may affect many:

```text
customers

orders

records

organizations

external recipients
```

Minimum direction:

```text
R4
```

unless the underlying capability is already R5.

---

# 47. Migration Concern

`migration` applies to schema/history changes.

It adds:

```text
forward-only migration discipline

upgrade verification

clean replay

constraint verification

grants/RLS review

generated-type compatibility
```

Migration risk remains contextual.

---

# 48. AI Mutation

`ai-authoritative-mutation` applies when AI-derived output can reach an authoritative mutation.

It does not establish its own lower risk class.

It inherits the target capability's risk.

Required control includes:

```text
structured proposal

validation

authorization

canonical command

postcondition verification
```

---

# 49. Security Privilege

`privileged-security` applies to:

```text
critical credentials

privileged grants

security administration

production administrative authority
```

Minimum:

```text
R5
```

where authority is materially critical.

---

# 50. Skill Candidates

Current candidate mapping may include existing Skills such as:

```text
mgbos-change-planner

mgbos-business-integrity-auditor

mgbos-pr-reviewer

agent-skill-maintainer

api-backend-engineer

supabase-architect

integrated-erp-engine

fullstack-web-dev

ui-ux-pro-max

web-qa-testing

web-sec-perf

ai-automation-engine

ai-copilot-builder

git-deploy-ops
```

Candidate mapping MUST respect each Skill's actual contract.

---

# 51. No Business Persona Skills in Engineering Routing

Skills such as business personas MUST NOT be selected merely because their label sounds relevant.

Examples include:

```text
cfo
coo
cmo
mentor-bisnis
```

unless a future explicit engineering contract legitimately requires them.

Engineering expertise is not business-agent roleplay.

---

# 52. Routing Output

A resolved route SHOULD be representable as:

```yaml
profile: mgbos

primary_task_type: backend-command-change

concerns:
  - financial-truth
  - authorization
  - concurrency-idempotency

effective_risk: R5

roles:
  - planner
  - engineer
  - auditor
  - qa

expertise:
  - EXP-002
  - EXP-003
  - EXP-005
  - EXP-006
  - EXP-007
  - EXP-011

skill_candidates:
  - api-backend-engineer
  - integrated-erp-engine
  - mgbos-business-integrity-auditor

assurance:
  qa: REQUIRED
  audit: INDEPENDENT_REQUIRED
```

---

# 53. Routing Output Is Not a Work Contract

Route answers:

```text
what controls apply
```

Work Contract answers:

```text
what exact work is authorized
```

Routing occurs before Work Contract generation.

---

# 54. Machine Validation

Future governance validator MUST reject:

```text
unknown task type

unknown concern

unknown role

unknown expertise

unknown Skill reference

invalid risk value

risk below hard concern floor

missing independent assurance for hard requirement

duplicate registry ID

duplicate YAML key

repository path escape
```

---

# 55. Routing Does Not Prove Runtime Compliance

Valid registry means:

```text
routing configuration is structurally coherent
```

It does not prove:

```text
Codex followed it

Antigravity followed it

Claude followed it
```

Behavioral evaluation remains separate.

---

# 56. Versioning

Material changes to:

```text
task meaning

concern risk floor

mandatory role

mandatory expertise

assurance requirement
```

require routing registry version change and impact review.

---

# 57. Final Principle

> **Task Type tells us what engineering work is being done.  
> Concerns tell us what can go wrong.  
> Environment tells us where consequence occurs.  
> Routing combines them into the minimum safe execution contract.**

Canonical flow:

```text
TASK
+
CONCERNS
+
ENVIRONMENT
        ↓
RISK
+
ROLES
+
EXPERTISE
+
ASSURANCE
        ↓
BOUNDED WORK
```
