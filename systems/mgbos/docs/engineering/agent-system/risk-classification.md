---
canonical_id: mgbos.engineering.agent-system.risk-application-profile
status: ACTIVE
version: 2.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-engineering
document_class: standard
effective_from: 2026-10-01

authoritative_for:
  - application of canonical R0-R5 risk to MGBOS engineering work
  - MGBOS engineering risk-floor rules
  - MGBOS risk-proportional engineering assurance
  - MGBOS risk-proportional verification expectations
  - MGBOS engineering escalation for unresolved risk

last_reviewed: 2026-10-01
review_cadence: quarterly

depends_on:
  - ../../../../../docs/governance/cross-system-risk-classification.md
  - ../../../../../docs/governance/evidence-provenance-model.md
  - ../../../../../docs/architecture/architectural-laws.md
  - ../../../../../docs/engineering/engineering-ai-control-plane.md
  - ../../../AGENTS.md
  - workflow.md
  - permission-matrix.md
  - evidence-model.md
  - release-gates.md

supersedes: null
supersedes_note: >
  Replaces the historical local R0-R3 engineering scale previously stored
  at this same path. R0-R5 semantics are now inherited exclusively from
  repository-wide cross-system governance.

implementation_status: ACTIVE
---

# MGBOS Engineering Risk Application Profile v2.0

## 1. Purpose

Dokumen ini menerapkan canonical BisnisHub risk model ke engineering work pada:

```text
systems/mgbos/
```

Dokumen ini menjawab:

> **Seberapa kuat planning, review, verification, evidence, dan release controls yang dibutuhkan untuk sebuah perubahan MGBOS?**

Dokumen ini tidak mendefinisikan arti baru untuk:

```text
R0
R1
R2
R3
R4
R5
```

Canonical meaning dimiliki oleh:

```text
docs/governance/cross-system-risk-classification.md
```

---

# 2. Canonical Risk Source

MGBOS engineering MUST use the repository-wide scale:

```text
R0 — Informational / No Material Effect

R1 — Read-Only / Low Consequence

R2 — Reversible Low-Impact Mutation

R3 — Significant Operational / External Mutation

R4 — Sensitive or High-Impact Mutation

R5 — Money / Security / Production-Critical
```

Jika dokumen MGBOS lain menggunakan arti R0–R5 yang berbeda:

```text
ROOT CANONICAL RISK MODEL WINS
```

dan conflicting MGBOS documentation MUST be reconciled.

---

# 3. Historical Scale Is Retired

Historical MGBOS engineering governance previously used a local:

```text
R0
R1
R2
R3
```

scale with meanings different from current repository-wide semantics.

That local taxonomy is:

```text
SUPERSEDED SEMANTICS
```

and MUST NOT be used for new engineering classification.

In particular:

```text
historical engineering R2
≠
canonical R2
```

and:

```text
historical engineering R3
≠
canonical R3
```

No runtime, skill, role, report, or future routing registry may infer the old meanings from historical evidence.

---

# 4. Risk Is Inherited, Not Redefined

This profile answers:

```text
How does canonical risk affect MGBOS engineering?
```

It does NOT answer:

```text
What does R5 mean globally?
```

Global meaning belongs to root governance.

System-specific engineering requirements MAY be stricter.

They MUST NOT weaken canonical risk semantics.

---

# 5. Engineering Effective Risk

For MGBOS work, engineering risk is based on potential consequence if the change is:

```text
incorrect

bypassed

duplicated

misconfigured

released

executed in the wrong environment
```

A small source-code diff can therefore carry high risk.

Example:

```text
5-line payment allocation change
```

may remain:

```text
R5
```

because the affected authoritative capability changes financial truth.

---

# 6. Risk Inputs

Engineering risk assessment SHOULD consider at least:

```text
task type

affected business capability

affected invariants

authorization impact

financial impact

data sensitivity

external side effects

production impact

environment

blast radius

reversibility

migration impact

automation amplification

recovery complexity
```

Filename, line count, and implementation effort are insufficient.

---

# 7. Three Risk Components

For engineering classification, consider:

```text
CHANGE RISK

AFFECTED CAPABILITY RISK

EXECUTION / ENVIRONMENT RISK
```

Effective engineering risk is at least the highest materially applicable component.

Conceptually:

```text
effective_risk =
max(
  change_risk,
  affected_capability_risk,
  environment_risk,
  policy_floor
)
```

This is an application rule.

It does not replace canonical risk semantics.

---

# 8. Change Risk

Change Risk considers the engineering operation itself.

Examples:

```text
documentation clarification

test-only change

reversible UI change

database migration

authorization logic modification

CI governance modification
```

A change may be technically local while affecting higher-risk behavior.

Therefore Change Risk alone is not sufficient.

---

# 9. Affected Capability Risk

When code controls or materially affects a governed business capability, engineering risk MUST consider that capability's consequence.

Example:

```text
mgbos.payment.record
```

is canonical:

```text
R5
```

Therefore a change capable of altering the correctness, authorization, idempotency, accounting effect, or verification of payment recording MUST NOT be classified below R5 merely because implementation occurs in development.

---

# 10. Environment Risk

Environment can raise effective risk.

Example:

```text
migration design only
→ lower execution consequence

disposable local migration execution
→ bounded consequence

staging migration
→ higher consequence

production migration
→ R4 / R5 depending actual impact
```

Risk follows actual environment and consequence.

Engineering planning MUST distinguish:

```text
code preparation

local execution

hosted CI

staging action

production action
```

---

# 11. Risk Floor

A task category or affected capability MAY establish a minimum:

```text
risk_floor
```

Runtime reasoning may raise risk.

Runtime MUST NOT lower risk below a declared floor.

Example:

```text
financial-truth-change
risk_floor: R5
```

This rule is intended to become machine-enforced through future routing governance.

---

# 12. Highest Applicable Risk Wins

If one change affects:

```text
frontend behavior        → R2

customer notification    → R3

authorization boundary   → R4

payment integrity        → R5
```

the engineering change is treated as:

```text
R5
```

for required control strength.

---

# 13. Unknown Risk

Missing material information does not mean low risk.

Use:

```text
UNKNOWN_RISK
```

when classification cannot safely be resolved.

Examples:

```text
target environment unknown

affected capability unclear

production credentials involved but scope unknown

migration consequence unknown

business invariant conflicts
```

If the plausible consequence includes R4 or R5:

```text
STOP
or
classify conservatively
```

until resolved.

---

# 14. Risk Does Not Grant Permission

Risk answers:

> **How consequential is this?**

Permission answers:

> **May this actor perform this action?**

A change classified:

```text
R1
```

may still be unauthorized.

A change classified:

```text
R5
```

may be legitimate when all required authority and controls exist.

Risk MUST NOT be used as permission.

---

# 15. Risk Does Not Grant Release Authority

A completed:

```text
risk assessment
```

does not authorize:

```text
merge

deploy

production database mutation

branch deletion

external communication
```

Those remain governed separately by:

```text
role permissions

release gates

environment policy

explicit authorization
```

---

# 16. Risk Does Not Replace Business Invariants

Human approval or high engineering confidence MUST NOT override hard MGBOS invariants.

Examples:

```text
tenant isolation

money arithmetic

payment allocation integrity

state-machine validity

inventory constraints

idempotency

historical immutability
```

If an exception is legitimate, it requires an explicit governed capability.

---

# 17. R0 — Informational / No Material Effect

Canonical R0 means no meaningful authoritative or external effect.

Typical MGBOS engineering examples:

```text
typo correction

wording clarification

non-semantic documentation formatting

link repair

comment-only clarification

read-only architectural analysis
```

provided they do NOT change:

```text
permissions

routing

governance semantics

runtime behavior

test enforcement

release behavior
```

---

# 18. R0 Required Engineering Evidence

Minimum expected evidence:

```text
identified scope

focused diff

reference/link validation where applicable

confirmation that behavior/permission semantics did not change
```

Application/database test execution is generally unnecessary when the change is genuinely R0.

Do not run destructive or irrelevant checks merely to create more evidence.

---

# 19. R0 Review Direction

Routine R0 MAY use proportionate self-review.

Independent assurance is normally unnecessary unless another rule requires it.

A documentation change that alters governance meaning is NOT R0 merely because it changes only Markdown.

---

# 20. R1 — Read-Only / Low Consequence

Canonical R1 applies to low-consequence, primarily read-only behavior.

Possible MGBOS engineering examples include:

```text
ordinary read projection changes

read-only operational queries

non-sensitive diagnostic surfaces

safe inspection tooling

limited read-only observability behavior
```

provided no higher-risk data or operational consequence applies.

---

# 21. R1 Can Escalate

Read-only does not automatically remain R1.

Examples:

```text
cross-organization data exposure

raw production secret access

bulk customer data export

restricted financial data exposure
```

may be:

```text
R4
or
R5
```

depending on canonical governance.

Engineering MUST evaluate data sensitivity and blast radius.

---

# 22. R1 Required Engineering Evidence

Expected:

```text
R0 evidence
+
affected read-contract verification
+
authorization/read-scope checks where applicable
+
relevant focused tests
```

If a read path crosses organization, privacy, security, or sensitive financial boundaries, classify higher.

---

# 23. R2 — Reversible Low-Impact Mutation

Canonical R2 covers bounded, internal, safely reversible mutation.

Possible MGBOS engineering examples:

```text
low-impact internal metadata behavior

internal draft-state behavior

reversible local/test-only mutation

low-consequence internal UX state
```

provided it does not materially affect:

```text
financial truth

security authority

customer commitments

production execution

critical transactional state
```

---

# 24. R2 Required Engineering Evidence

Expected:

```text
R1 evidence as applicable

positive behavior tests

reversal/retry behavior where relevant

affected authorization checks

scope validation

focused regression checks
```

A reversible implementation does not remain R2 if the affected business consequence is higher.

---

# 25. R3 — Significant Operational / External Mutation

Canonical R3 covers meaningful operational or external mutation that remains reasonably bounded and recoverable.

Possible MGBOS engineering examples include behavior enabling or modifying:

```text
routine customer communication

routine vendor communication

normal vendor assignment

normal operational scheduling

bounded fulfillment coordination

normal external integration mutation
```

when no R4/R5 condition applies.

---

# 26. R3 Required Engineering Evidence

Expected:

```text
canonical-source audit

authorization checks

affected state-transition tests

retry/idempotency tests where networked

external-side-effect isolation

failure-path verification

postcondition verification strategy

audit/evidence behavior

applicable application/database gates
```

If the action can be triggered automatically, automation amplification MUST be considered.

---

# 27. R3 External-Side-Effect Rule

Any real external side effect requires verification that testing cannot accidentally affect:

```text
real customers

real vendors

real payments

real production providers
```

Use:

```text
synthetic data

mock/sandbox

suppressed delivery

disposable environment
```

as appropriate.

---

# 28. R4 — Sensitive / High-Impact Mutation

Canonical R4 applies when a change can materially affect:

```text
business operations

customer commitments

sensitive access

large data scope

production availability

high-value operational decisions

large external blast radius
```

Possible MGBOS engineering examples include changes to:

```text
sensitive authorization behavior

high-impact inventory adjustment logic

critical fulfillment cancellation

production deployment behavior

significant pricing exception behavior

bulk external communication paths

high-impact vendor/production routing
```

when the consequence does not meet R5.

---

# 29. R4 Required Engineering Evidence

Expected:

```text
all applicable R3 evidence

explicit risk reasoning

canonical security/authority review

negative permission tests

cross-organization tests where applicable

failure atomicity

recovery / rollback strategy

precondition verification

postcondition verification

revision-bound audit

QA on exact candidate revision
```

Human review SHOULD be the default direction for material R4 work.

---

# 30. R4 Independent Assurance

Independent assurance SHOULD be required when R4 involves:

```text
authorization

sensitive data

production availability

large customer/vendor blast radius

critical operational state
```

If true independence is unavailable:

```text
SELF_REVIEW
```

must be recorded explicitly and residual risk remains visible.

---

# 31. R5 — Money / Security / Production-Critical

Canonical R5 is the strongest risk class.

MGBOS engineering MUST treat changes as R5 when they can directly alter or materially compromise:

```text
financial truth

payment record/reversal/refund

vendor payment

privileged security authority

production-critical secrets

destructive authoritative production state

critical production database integrity

high-consequence production schema migration
```

---

# 32. Financial Truth Rule

Changes affecting authoritative financial truth are R5 by default.

Examples:

```text
payment recording

payment reversal

payment allocation

refund

vendor payment

invoice balance mutation

financial ledger integrity

money reconciliation
```

A small amount or small code diff does not lower the classification.

---

# 33. Security Authority Rule

Changes capable of granting or modifying privileged authority are R5 when they affect:

```text
finance privilege

security administration

production privilege

critical credentials

privileged database authority
```

Possession of service credentials does not reduce risk.

---

# 34. Production-Critical Database Rule

A local schema edit is not automatically R5.

However changes whose failure can destructively affect authoritative production state MAY be R5.

Examples:

```text
destructive production data correction

production migration with material data-loss risk

critical privilege/grant migration

production financial-schema migration
```

Classification considers actual consequence and environment.

---

# 35. R5 Required Engineering Evidence

R5 engineering work SHOULD include all applicable lower-level controls plus:

```text
explicit canonical-source audit

explicit invariant inventory

authorization review

organization-isolation verification

integer-money boundary verification where financial

illegal-state verification

duplicate/retry verification

idempotency verification

failure atomicity

concurrency testing where relevant

historical-integrity checks

migration upgrade + clean replay where schema changes

recovery/reconciliation strategy

independent assurance

exact-revision QA

hosted CI evidence where applicable

explicit release blockers

human accountable decision for consequential release/action
```

Not every R5 task requires every unrelated test.

Omissions MUST be justified against affected invariants.

---

# 36. R5 Independent Assurance

Independent assurance is REQUIRED for material R5 implementation before release recommendation.

Canonical:

```text
IMPLEMENTER
≠
INDEPENDENT AUDITOR
```

If only the same runtime is available:

```text
SELF_REVIEW
```

may provide useful feedback but MUST NOT satisfy the independent-assurance claim.

Release evidence MUST state the gap.

---

# 37. R5 QA

R5 QA MUST target the actual command/system boundary, not only:

```text
domain unit function

UI rendering

SQL definition
```

where the authoritative behavior crosses multiple layers.

As applicable, verify:

```text
caller identity

authorization

organization isolation

validation

state guard

money boundary

transaction

audit

idempotency

retry

concurrency

postcondition
```

---

# 38. R5 Release Direction

R5 implementation completion does not imply release readiness.

Before release recommendation, applicable evidence SHOULD include:

```text
exact candidate revision

independent assurance

QA

current CI

target environment

backup/recovery readiness

monitoring ownership

reconciliation plan

explicit authorization
```

Missing material evidence blocks release recommendation for the affected flow.

---

# 39. Migrations

Migration risk is contextual.

Examples:

```text
documentation describing migration
→ R0

new local migration affecting low-impact schema
→ typically R2

staging operational migration
→ may be R3

production-sensitive migration
→ R4

production money/security/destructive migration
→ R5
```

Regardless of risk:

```text
applied/base migration history remains immutable
```

under current MGBOS policy.

---

# 40. Schema Verification

For schema work, applicable verification SHOULD include:

```text
upgrade from prior schema/data

clean replay

constraint verification

grants

RLS

functions

generated types

application compatibility
```

Use an identified disposable MGBOS target for destructive local reproducibility tests.

Do not use production as substitute test infrastructure.

---

# 41. Authorization Changes

Authorization changes have a minimum engineering direction of:

```text
R4
```

when they materially change access.

Raise to R5 when changing:

```text
privileged finance access

production security authority

critical credential authority

production administrative access
```

Expected verification includes:

```text
allowed role

denied role

cross-organization reference

direct command/RPC access

privileged execution context

browser/UI bypass attempt
```

UI visibility is not authorization evidence.

---

# 42. Business State-Machine Changes

A state-machine change is classified by the consequence of the state it controls.

Examples:

```text
internal low-impact draft state
→ may be R2

normal operational transition
→ may be R3

high-impact production/fulfillment state
→ may be R4

financial/security-critical transition
→ R5
```

Do not classify all state transitions identically.

---

# 43. AI Capability Changes

AI-related code is NOT automatically high risk.

Risk follows capability.

Examples:

```text
read-only summarization
→ R1

internal draft generation
→ R2

customer-facing send capability
→ R3/R4

AI invoking payment mutation
→ R5
```

AI confidence MUST NOT reduce the underlying capability risk.

---

# 44. AI Mutation Rule

AI-generated interpretation, extraction, OCR, classification, or recommendation MUST NOT directly become authoritative MGBOS mutation solely because model confidence is high.

Required conceptual flow:

```text
UNTRUSTED / AI OUTPUT
        ↓
STRUCTURED PROPOSAL
        ↓
VALIDATION
        ↓
AUTHORIZATION / POLICY
        ↓
CANONICAL COMMAND
        ↓
VERIFICATION
```

Risk follows the final capability and context.

---

# 45. Automation Changes

Automation is classified by the highest consequential step it may trigger.

Example:

```text
read invoice          R1
prepare reminder      R2
send reminder         R3
record payment        R5
```

If one workflow can reach payment recording:

```text
workflow effective risk ≥ R5
```

unless capability separation provably prevents that path.

---

# 46. Governance Changes

Governance-only changes are not automatically R0.

Examples:

```text
typo
→ R0

routing semantics
→ may be R1/R2

permission model instructions
→ may be R4/R5 consequence

CI bypass / release gate weakening
→ may be R4/R5
```

Evaluate what future actions the governance change can enable or disable.

---

# 47. CI / Guard Changes

Changes to:

```text
governance validator

migration immutability guard

release gates

security checks

repository integrity checks
```

must consider bypass consequence.

A change that can disable protection around higher-risk behavior inherits corresponding consequence for review purposes.

Do not classify a guard change low merely because no application code changed.

---

# 48. Documentation Changes

Documentation may be:

```text
R0
```

only when normative behavior is unchanged.

A documentation-only change that alters:

```text
authority

permission

risk

release rules

business semantics

security boundary
```

inherits the consequence of that semantic change.

Markdown is not inherently low risk.

---

# 49. Test-Only Changes

Tests do not automatically have low risk.

Changing tests can:

```text
hide regressions

weaken gates

normalize incorrect behavior

remove negative-path coverage
```

Risk classification SHOULD consider whether the test change changes acceptance authority.

Deleting critical R5 regression coverage can itself require high-assurance review.

---

# 50. Release / Deployment

Preparing a release plan without executing it is lower consequence than executing production deployment.

Actual production deployment normally begins around:

```text
R4
```

under canonical governance.

Raise to:

```text
R5
```

when deployment includes or directly controls:

```text
money-critical infrastructure

privileged security changes

destructive production database operations

similarly severe production consequences
```

Release classification does not grant deployment authority.

---

# 51. Secrets

Reading or exposing raw production secrets may be:

```text
R5
or
PROHIBITED
```

depending on policy.

Engineering artifacts MUST NOT contain:

```text
API keys

service-role values

passwords

OAuth tokens

bank credentials

production secrets
```

Evidence may record that credential validation occurred without storing credential values.

---

# 52. Risk-Proportional Role Flow

Risk influences default engineering flow.

Typical direction:

```text
R0
Engineer
+
proportionate review

R1
Engineer
→ QA as applicable

R2
Planner or bounded Engineer
→ QA

R3
Planner
→ Engineer
→ QA
→ Auditor where consequence requires

R4
Planner
→ Engineer
→ Auditor
→ QA

R5
Planner
→ Engineer
→ Independent Auditor
→ QA
→ Release Operator
→ accountable human decision where release/action is consequential
```

This is a default routing direction.

Specific task routing may be stricter.

---

# 53. Role Flow Is Not Permission

Being routed to:

```text
Release Operator
```

does not authorize release.

Being routed to:

```text
Engineer
```

does not authorize writing outside scope.

Role flow organizes responsibility.

Permission remains separately enforced.

---

# 54. Evidence Strength

Risk increases expected evidence depth.

Conceptually:

```text
R0
focused change evidence

R1
source + read behavior evidence

R2
mutation + reversal/retry evidence

R3
preconditions + mutation + verification

R4
strong review + recovery + exact-revision evidence

R5
authoritative pre-state
+ strong authorization analysis
+ exact command behavior
+ verification
+ independent assurance
+ audit/reconciliation/recovery
```

Evidence quantity alone does not establish quality.

---

# 55. Old Reports

Historical implementation reports remain valid historical evidence for the revision and risk semantics used when written.

Do NOT rewrite old reports merely because this profile changed.

When consuming historical report terminology:

```text
interpret its risk label in historical context
```

unless the report explicitly uses the canonical R0–R5 model.

New reports MUST use this profile.

---

# 56. Existing Behavioral Eval Cases

Existing behavioral cases under:

```text
.agents/evals/
```

remain valid test definitions unless their expected criteria explicitly depend on the retired R0–R3 meanings.

When such dependency exists:

```text
update the eval deliberately
```

and preserve revision/evaluation history.

Do not mark runtime behavior passed merely because the schema remains valid.

---

# 57. Risk Reassessment

Risk MUST be reassessed when material facts change.

Examples:

```text
local-only task becomes production task

read-only design gains mutation

single-customer action becomes bulk action

new financial effect appears

authorization scope expands

migration becomes destructive

automation becomes recurring
```

Planning-time risk is not permanently fixed.

---

# 58. Risk Escalation During Implementation

Engineer MUST escalate when implementation reveals a higher-risk consequence than the accepted plan.

Example:

```text
planned:
UI-only R2

discovered:
server authorization must change
```

Result:

```text
RISK_ESCALATION_REQUIRED
```

before silently continuing under R2 controls.

---

# 59. Risk De-Escalation

Risk may be lowered only when material evidence proves the originally assumed higher-risk consequence does not apply.

De-escalation SHOULD be explicit.

For hard risk floors defined by canonical policy or machine routing:

```text
runtime MUST NOT lower below the floor
```

without governance change.

---

# 60. Critical Unknowns

Any unresolved unknown affecting:

```text
money

authorization

tenant isolation

historical integrity

production state

data loss

recovery
```

blocks release recommendation for the affected flow.

Valid outcome:

```text
BLOCKED
```

is preferable to unsupported PASS.

---

# 61. Tests Defined vs Tests Executed

Risk planning may specify required tests without executing them.

Record:

```text
TESTS_DEFINED
```

separately from:

```text
LOCALLY_VERIFIED
```

or:

```text
HOSTED_CI_VERIFIED
```

Never convert intended validation into executed evidence.

---

# 62. Missing Environment

If required environment is unavailable:

```text
BLOCKED
or
NOT_RUN
```

must remain visible.

Do not use:

```text
old report

SQL definition

README claim

prior green commit
```

as substitute for current required execution evidence.

---

# 63. Proportionality

High risk does not mean:

```text
run every test in existence
```

Required checks SHOULD map to actual affected invariants and failure modes.

For omitted checks, record why they are irrelevant.

The goal is:

```text
strong relevant assurance
```

not:

```text
maximum test count
```

---

# 64. Risk and Recovery

As risk increases, recovery expectations increase.

Consider:

```text
rollback

reversal

reconciliation

restore

safe retry

manual recovery

unknown-outcome handling
```

A change with no plausible recovery path may require higher risk classification or may be unacceptable under current policy.

---

# 65. Risk and Observability

Consequential behavior SHOULD be observable enough to determine:

```text
what happened

which revision

which actor

which command

which target

whether it succeeded

whether verification succeeded
```

Higher autonomy or risk without sufficient observability is not acceptable evidence of readiness.

---

# 66. Risk and Founder Load

Risk governance SHOULD protect the owner without generating unnecessary ceremony.

Do not require owner attention for routine low-risk changes solely because AI performed them.

Do require accountable human judgment where canonical policy or consequence warrants it.

The goal is:

```text
high-value human decisions
```

not:

```text
approval noise
```

---

# 67. Risk Classification Output

Material plans SHOULD record risk in a structured form similar to:

```yaml
risk:
  level: R5

  reasons:
    - authoritative financial truth
    - payment allocation
    - concurrency-sensitive mutation

  affected_capabilities:
    - mgbos.payment.record

  required_assurance:
    independent_audit: true
    qa: true

  recovery:
    required: true
```

Exact schema is defined by future Control Plane contracts.

---

# 68. Example — Documentation Typo

Change:

```text
fix typo in MGBOS README
```

No semantic effect.

Classification:

```text
R0
```

Expected:

```text
focused diff

link/format check if applicable

no application/database execution required
```

---

# 69. Example — Read-Only Attention Query

Change:

```text
add bounded read-only production-attention projection
```

If:

```text
no sensitive cross-org exposure
no mutation
```

classification may be:

```text
R1
```

Required:

```text
read authorization

organization isolation

projection correctness

focused tests
```

---

# 70. Example — Internal Draft

Change:

```text
store internal follow-up draft
```

No external send.

May be:

```text
R2
```

if reversible and low impact.

If the same change also sends the message:

```text
risk rises
```

---

# 71. Example — Customer Reminder

Change enables:

```text
send routine payment reminder to customer
```

Typical baseline:

```text
R3
```

unless sensitivity, scale, or contractual impact raises it.

Required concerns:

```text
authorization

recipient correctness

duplicate send

external side effect

delivery evidence

safe test environment
```

---

# 72. Example — Authorization Boundary

Change:

```text
modify organization membership resolution
```

Minimum direction:

```text
R4
```

because wrong behavior may expose or mutate another organization's data.

If it grants privileged finance/production authority:

```text
R5
```

may apply.

---

# 73. Example — Record Payment

Change:

```text
modify record-payment command
```

Classification:

```text
R5
```

Relevant assurance includes:

```text
integer money

invoice eligibility

allocation ceiling

organization isolation

idempotency

duplicate/retry behavior

failure atomicity

concurrency

audit

reversal/reconciliation

exact-revision verification
```

---

# 74. Example — Migration

Change:

```text
add nullable non-critical local metadata column
```

may be:

```text
R2
```

Change:

```text
alter production payment tables
with material data-loss possibility
```

may be:

```text
R5
```

Both still obey migration immutability.

---

# 75. Example — AI Receipt Processor

Change:

```text
OCR receipt
→ draft structured payment proposal
```

may remain below R5 if it cannot mutate authoritative payment truth.

Change:

```text
OCR receipt
→ automatically record payment
```

inherits:

```text
R5
```

because the final capability changes financial truth.

Model confidence does not lower it.

---

# 76. Example — Governance Guard

Change:

```text
modify migration-immutability checker
```

Risk is NOT based on script size.

Assess:

```text
Can this allow historical migration mutation to pass?
```

If yes, review strength must reflect the consequence of the protection being changed.

The modified guard MUST NOT be trusted solely to validate itself.

---

# 77. Release Blocking Principle

A release recommendation MUST be blocked when an unresolved issue materially threatens:

```text
money

unauthorized access

tenant isolation

historical integrity

data loss

production recovery

critical state correctness
```

This applies regardless of aggregate test count.

---

# 78. Relationship to Workflow

`workflow.md` determines the engineering sequence.

This document determines:

```text
how strongly that sequence must be applied
```

based on risk.

Risk does not replace workflow.

---

# 79. Relationship to Permission Matrix

`permission-matrix.md` defines process permissions.

Risk does not expand those permissions.

Higher risk may require stricter control.

Lower risk does not create permission where none exists.

---

# 80. Relationship to Evidence Model

`evidence-model.md` defines MGBOS engineering evidence recording.

This profile determines risk-proportional evidence expectations.

Evidence must remain:

```text
revision-bound

honest

environment-specific

sanitized
```

---

# 81. Relationship to Release Gates

`release-gates.md` defines gate categories.

This profile determines which evidence becomes material enough to block release for the affected change.

Passing unrelated gates does not compensate for missing risk-specific evidence.

---

# 82. Relationship to Future Routing Registry

Future:

```text
.agents/routing/
```

will encode machine-validatable risk floors and required role/expertise routing.

This document remains the human-readable MGBOS application profile.

Machine routing MUST reference canonical R0–R5 semantics rather than duplicate them inconsistently.

---

# 83. Relationship to Expertise

Risk may activate required specialist expertise.

Examples:

```text
authorization
→ Authorization / IAM / Capability
→ Security & Trust Boundary

financial truth
→ Financial Integrity
→ PostgreSQL Transaction
→ Authorization

production release
→ Platform / SRE / Recovery
```

Risk alone does not define every expertise requirement.

Task routing owns the final machine mapping.

---

# 84. Anti-Patterns

Forbidden interpretations include:

```text
"Only docs changed, so risk is always R0."

"Only five lines changed, so risk is low."

"It's local code, so payment logic is not R5."

"Tests are green, so authorization risk no longer matters."

"Service role bypass makes the problem easier."

"The model is confident, so AI mutation risk is lower."

"The user approved it, so business invariants can be bypassed."

"The previous commit passed CI, so this revision is verified."

"The same runtime reviewed itself, so independent assurance is complete."

"R5 means run every test regardless of relevance."
```

---

# 85. Classification Checklist

For material MGBOS changes ask:

```text
What capability changes?

What authoritative truth can change?

Can money change?

Can permission change?

Can cross-org data become visible?

Can customer/vendor expectations change?

Can physical operations be affected?

Can production availability be affected?

Can sensitive data or secrets be exposed?

Can the change be safely reversed?

What is the blast radius?

What environment is involved?

Can automation amplify an error?

What recovery path exists?
```

Choose the highest applicable canonical class.

---

# 86. Fail-Closed Rule

If risk classification materially affects required controls and cannot be resolved safely:

```text
DO NOT GUESS DOWNWARD
```

Use:

```text
UNKNOWN_RISK
```

and escalate.

---

# 87. Migration From Historical R0-R3

For new work after this document becomes ACTIVE:

```text
use canonical R0-R5 only
```

For old reports:

```text
preserve historical labels
```

For active templates, skills, validators, or routing logic that encode old meanings:

```text
reconcile them deliberately
```

Do not perform blind string replacement.

---

# 88. Acceptance of This Profile

This profile is correctly applied when:

```text
one risk language is used across BisnisHub

MGBOS adds application detail without redefining risk

risk follows consequence

small critical diffs remain high risk

low-risk work remains proportionate

unknown risk fails closed

review and QA strength increase with consequence

financial/security/production-critical changes receive R5 treatment

historical evidence remains historically honest
```

---

# 89. Final Principle

> **Engineering risk is not a measure of how difficult a change is.  
> It is a measure of how much damage an incorrect change can cause.**

For MGBOS:

```text
CONSEQUENCE
    ↓
RISK
    ↓
CONTROL STRENGTH
    ↓
EVIDENCE
    ↓
ASSURANCE
    ↓
RELEASE DECISION
```

Canonical risk remains owned by repository governance.

MGBOS engineering applies it faithfully.
