---
canonical_id: agents.engineering.runtime-evaluation-qualification
status: ACTIVE
version: 1.0
owner: Rizky
scope: repository-engineering
document_class: engineering-governance-profile
effective_from: 2026-10-01

authoritative_for:
  - engineering runtime evaluation suites
  - engineering runtime regression qualification
  - engineering autonomy-promotion evidence preparation
  - engineering runtime evidence freshness
  - engineering evaluation qualification semantics

depends_on:
  - ../../../docs/governance/autonomy-levels.md
  - ../../../docs/governance/cross-system-risk-classification.md
  - ../../../docs/governance/evidence-provenance-model.md
  - ../../../systems/jarvis/docs/architecture/ai-evaluation-regression-autonomy-promotion.md
  - ../README.md
  - ../baseline.json
  - suites.yaml
  - qualification-policy.yaml
  - DETERMINISTIC-GRADING.md

implementation_status: ACTIVE
---

# Engineering Runtime Evaluation Qualification & Autonomy Evidence Profile v1

## 1. Purpose

This profile applies existing BisnisHub evaluation and autonomy governance to engineering runtimes such as Codex and Antigravity.

It does not redefine:

- R0-R5;
- L0-L4;
- approval semantics;
- business authority;
- JARVIS runtime semantics.

Repository canonical governance remains authoritative.

---

# 2. Core Principle

> Runtime intelligence may change quickly. Runtime authority must change slowly and through evidence.

A better model does not automatically receive:

- broader write scope;
- merge authority;
- production access;
- database authority;
- deployment authority.

---

# 3. Qualification Is Not Autonomy

Canonical separation:

```text
BEHAVIORAL EVALUATION
        ↓
QUALIFICATION
        ↓
PROMOTION EVIDENCE PACKAGE
        ↓
AUTHORITATIVE DECISION
        ↓
AUTONOMY GRANT
```

Qualification does not itself change autonomy.

---

# 4. Qualification Is Not Permission

A runtime may be behaviorally qualified for a capability and still lack permission to exercise it.

Canonical:

```text
QUALIFIED
+
NOT AUTHORIZED

=
NO EXECUTION
```

---

# 5. Existing Autonomy Semantics

Engineering runtimes inherit repository L0-L4 semantics:

```text
L0
Observe

L1
Recommend

L2
Prepare

L3
Execute With Approval

L4
Execute Automatically Within Policy
```

This profile MUST NOT assign different meanings to those labels.

---

# 6. Engineering Interpretation

Typical engineering examples may include:

```text
L0
inspect repository state

L1
recommend architecture or correction

L2
prepare bounded patch/worktree/PR proposal

L3
perform consequential engineering action after explicit approval

L4
perform specifically approved bounded engineering automation automatically within policy
```

These examples illustrate repository autonomy semantics.

They do not create actual grants.

---

# 7. Current Default Position

Presence of Codex or Antigravity in:

```text
.agents/adapters/registry.yaml
```

does not imply L-level mutation authority.

Initial runtime adapters remain governed by:

```text
role
scope
Work Package
tool permission
risk
approval
release gate
```

---

# 8. Evaluation Suite

An Evaluation Suite is a versioned collection of cases that together evaluate a meaningful behavior boundary.

A suite must specify:

```text
suite ID

version

purpose

required cases

blocking cases

applicable runtimes

repeat policy

evidence requirements

staleness triggers
```

---

# 9. Why Suites Exist

Individual case success does not establish broad reliability.

Example:

```text
payment routing case
PASS once
```

does not establish:

```text
safe bounded engineering autonomy
```

A capability must be supported by a suitable body of evidence.

---

# 10. Critical Cases

A suite may designate:

```text
blocking_cases
```

Any failure in a blocking case fails qualification regardless of aggregate pass rate.

Examples include:

- unauthorized mutation;
- false independent-review claim;
- financial risk downgrade;
- forbidden scope expansion;
- production command;
- overlapping writers.

---

# 11. No Universal Percentage

This profile does not use:

```text
90% pass
```

as a universal qualification rule.

A single critical safety failure can outweigh many ordinary passes.

---

# 12. Repeat Runs

Generative runtime behavior is non-deterministic.

Therefore promotion evidence may require repeated executions.

Repeat count belongs to the specific qualification profile.

It is not a new ecosystem-wide rule.

---

# 13. Regression Run vs Promotion Evidence

Regression testing and autonomy promotion have different evidence requirements.

Regression may use:

```text
one current execution
```

of each required case to detect obvious behavioral change.

Promotion requires stronger repeated evidence.

---

# 14. Configuration Fingerprint

Every run used for qualification must identify the behavioral configuration that produced it.

At minimum fingerprint:

```text
repository revision

eval baseline

root AGENTS

system AGENTS

runtime adapter

routing registry

expertise registry

active role contract

case source documents

runtime version

model where known
```

Evidence from materially different fingerprints MUST NOT be silently pooled.

---

# 15. Same Case, Different Model

These are different evidence families:

```text
Codex + Model A

Codex + Model B
```

unless governance explicitly determines the difference is behaviorally irrelevant.

Default:

```text
model change
→ requalification
```

---

# 16. Same Model, Different Governance

These are also different behavioral configurations:

```text
Routing v1
Routing v2
```

or:

```text
AGENTS revision A
AGENTS revision B
```

Model identity alone does not define behavioral configuration.

---

# 17. Evaluation Freshness

Evidence becomes STALE when a materially relevant dependency changes.

Examples:

```text
provider/model version

runtime version

AGENTS instructions

role contract

Skill procedure

routing policy

risk profile

adapter

tool permission configuration

case rubric

affected architecture contract
```

---

# 18. Selective Invalidation

Not every repository change invalidates every runtime result.

Qualification SHOULD invalidate only affected suites when impact can be established safely.

Uncertain high-consequence impact should err toward re-evaluation.

---

# 19. Regression

Regression means a configuration that previously satisfied required behavior now fails, blocks unexpectedly, or exhibits forbidden behavior.

Regression sources may include:

```text
model

runtime

prompt/instructions

Skill

routing

tooling

provider behavior

repository architecture
```

---

# 20. Blocking Regression

Any regression involving:

```text
unauthorized mutation

financial integrity

cross-organization isolation

secret exposure

false approval

false independent assurance

scope bypass

production authority bypass
```

is blocking for affected qualification.

---

# 21. Regression Does Not Rewrite History

Old:

```text
PASS
```

remains a historical observation for its original fingerprint.

It becomes:

```text
STALE
```

for the new behavioral configuration.

Do not rewrite old PASS into FAIL merely because a later release regressed.

---

# 22. Initial Evaluation Suites

V1 defines four primary suites:

```text
adapter-safety

bounded-engineering

independent-assurance

release-governance
```

and one full regression suite:

```text
engineering-control-plane-full
```

---

# 23. Adapter Safety

Evaluates whether runtime:

- classifies consequential risk correctly;
- remains proportional for low-risk work;
- refuses silent scope expansion;
- does not manufacture independent review;
- respects revision-bound evidence;
- preserves One Writer Rule.

This is the minimum suite for a registered engineering runtime adapter.

---

# 24. Bounded Engineering

Evaluates behavior around:

- repository routing;
- immutable migrations;
- secret boundaries;
- prompt injection;
- authorization;
- financial idempotency;
- scope expansion.

This suite supports evidence for bounded implementation preparation.

---

# 25. Independent Assurance

Evaluates whether review behavior preserves:

- read-only Auditor scope;
- financial integrity;
- lifecycle integrity;
- concurrency/idempotency concerns;
- revision binding;
- factual independence.

Passing this suite does not itself make the runtime an independent reviewer.

Independence is still an execution fact.

---

# 26. Release Governance

Evaluates:

- stale CI;
- stale revisions;
- release evidence;
- branch/PR boundaries;
- no unauthorized deployment.

Passing does not grant Release Operator authority.

---

# 27. Full Control Plane Regression

`engineering-control-plane-full` represents the entire current behavioral baseline.

It is appropriate for:

- major model replacement;
- major runtime adapter change;
- major routing change;
- major governance architecture change.

It need not run for every documentation typo.

---

# 28. Offline Qualification

Offline qualification proves only evaluated behavior in isolated test conditions.

It may support consideration for:

```text
L0
L1
L2
```

depending on the capability.

It is not sufficient by itself for consequential L3/L4 production execution.

---

# 29. L0 → L1 Evidence Direction

For an engineering capability moving from observation to recommendation, evidence should establish:

- correct source selection;
- correct target/workspace;
- grounded interpretation;
- risk recognition;
- uncertainty handling;
- no unauthorized mutation.

---

# 30. L1 → L2 Evidence Direction

For recommendation to preparation, evidence should additionally establish:

- bounded scope;
- correct Work Package;
- One Writer discipline;
- safe repository mutation;
- appropriate checks;
- no hidden consequential external effect.

---

# 31. L2 → L3 Evidence Direction

L2 → L3 introduces real consequential execution.

Offline runtime evaluation alone is insufficient.

Promotion evidence must additionally establish, as applicable:

```text
explicit permission

approval mechanism

action fingerprinting

verification

idempotency

recovery

audit

environment identity

tool-health evidence
```

Actual L3 grant requires an authoritative decision.

---

# 32. L3 → L4 Evidence Direction

L3 → L4 removes per-action approval inside an approved policy boundary.

This is the strongest normal autonomy promotion.

Depending on consequence it may require:

```text
offline eval

adversarial eval

shadow

canary

production observation

low correction rate

reliable postcondition verification

recovery

kill switch

policy ceiling

accountable owner
```

Offline suite PASS alone MUST NOT produce L4.

---

# 33. R0 / R1

Lower-risk recommendation/read capabilities may qualify with relatively lightweight offline evidence.

Actual permissions and data sensitivity still apply.

---

# 34. R2

Bounded reversible preparation may use stronger offline evaluation without necessarily requiring production observation.

Scope and reversibility must remain genuine.

---

# 35. R3

Automatic or externally consequential R3 capability requires stronger evidence.

L4 consideration should normally require realistic operational evidence beyond synthetic offline eval.

---

# 36. R4

Default direction remains tightly bounded.

Human approval is expected by default under canonical policy.

Offline eval may support capability qualification but not remove the approval gate.

---

# 37. R5

Default repository direction:

```text
R5
→ L3 maximum
```

unless an explicit capability-specific governance exception is later approved.

Perfect behavioral eval does not override this ceiling.

---

# 38. Promotion Evidence Case

A promotion evidence package must bind to:

```text
principal

capability

scope

environment

current autonomy

proposed autonomy

effective risk

evaluation suites

configuration fingerprints

operational evidence

approval-policy boundary

recovery readiness
```

---

# 39. No Capability Registry, No Grant Automation

The current Engineering Control Plane does not yet contain a canonical engineering capability registry.

Therefore CP-004C MUST NOT automatically issue an engineering autonomy grant.

Promotion packages are:

```text
evidence for decision
```

not:

```text
authority records
```

---

# 40. Promotion Recommendation States

The evaluation system may output:

```text
ELIGIBLE_FOR_OWNER_REVIEW

NOT_ELIGIBLE

BLOCKED

STALE
```

It MUST NOT output:

```text
AUTONOMY_GRANTED
```

---

# 41. Owner Decision

Actual material production autonomy promotion remains an authoritative governance decision.

Current ultimate accountable authority:

```text
Rizky
```

according to repository governance.

The evaluator may support the decision.

It cannot make it.

---

# 42. Regression After Promotion

If a promoted capability later experiences a blocking regression:

```text
qualification
→ FAILED or STALE
```

and governance SHOULD evaluate:

```text
suspension

demotion

rollback

re-evaluation
```

according to canonical autonomy policy.

---

# 43. Critical Incident

A material incident SHOULD:

1. block affected promotion evidence;
2. trigger applicable autonomy review;
3. create a regression case where feasible;
4. require fresh evidence before re-promotion.

---

# 44. Promotion Evidence Must Be Complete

Missing operational evidence for a required promotion stage produces:

```text
BLOCKED
```

not:

```text
probably safe
```

---

# 45. No Benchmark-Based Promotion

General coding benchmark performance is not sufficient evidence for BisnisHub authority.

A runtime must demonstrate behavior under BisnisHub contracts.

---

# 46. No Brand-Based Promotion

Statements such as:

```text
Codex is smarter now

Antigravity is agentic
```

are not promotion evidence.

---

# 47. No Historical Reputation Shortcut

Provider reputation does not replace repository-specific evidence.

---

# 48. Final Principle

> **Evaluation can establish eligibility. Only governance can grant authority.**