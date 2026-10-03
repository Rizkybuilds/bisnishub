---
canonical_id: docs.engineering.vibe-engineering.post-merge-reflection
status: ACTIVE
version: 1.1.1
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository-engineering
document_class: runbook
effective_from: 2026-10-03

authoritative_for:
  - vibe engineering post-merge verification procedure
  - vibe engineering merge-confirmation procedure
  - vibe engineering integration-revision verification
  - vibe engineering main-advancement analysis
  - vibe engineering post-integration evidence handling
  - vibe engineering post-merge interference handling
  - vibe engineering reflection-to-plan procedure
  - vibe engineering completed-package closure
  - vibe engineering next-package preparation

last_reviewed: 2026-10-03
reviewed_against_revision: 26871da802706fba5bc033576fbb0a487f6c9255
review_cadence: quarterly

depends_on:
  - ./README.md
  - ./state-and-vocabulary.md
  - ./operating-model.md
  - ./session-protocol.md
  - ./change-package-template.md
  - ./implementation-contract-template.md
  - ./pr-audit-protocol.md
  - ./remediation-protocol.md
  - ../../governance/documentation-constitution.md
  - ../../governance/canonical-source-map.md
  - ../../governance/cross-system-risk-classification.md
  - ../../governance/evidence-provenance-model.md
  - ../../governance/approval-policy.md
  - ../engineering-ai-control-plane.md
  - ../../../.agents/contracts/README.md
  - ../../../.agents/contracts/assurance-report.schema.json
  - ../../../.agents/contracts/verification-matrix.schema.json
  - ../../../.agents/contracts/release-packet.schema.json
  - ../../../.agents/routing/README.md
  - ../../../.agents/capabilities/README.md
  - ../../../AGENTS.md
  - ../../../systems/mgbos/docs/runbooks/release-and-recovery.md

supersedes: null
---

# Vibe Engineering Post-Merge Verification & Reflection

## 1. Purpose

This protocol defines what Vibe Engineering does after an expected pull request is reported as merged.

Its purpose is to prevent:

```text id="hjyyxa"
"merged"
```

from being incorrectly interpreted as:

```text id="o66ykx"
verified
released
deployed
healthy
complete
```

Canonical principle:

```text id="3r78fi"
MERGED
≠
POST-MERGE VERIFIED
```

and:

```text id="mjzsrd"
POST-MERGE VERIFIED
≠
PRODUCTION VERIFIED
```

---

# 2. Owner Command `merged`

When the Owner says:

```text id="79a99g"
merged
```

treat that statement as:

> Start post-merge verification for the expected package/PR.

It is a procedure trigger.

It is not repository evidence.

---

# 3. Session Type

Post-merge verification uses:

```text id="1zf63g"
VE_SESSION.POST_MERGE
```

The normal procedure begins with:

```text id="c2k17h"
VE_PHASE.RESTORE
```

before:

```text id="159iyy"
VE_PHASE.POST_INTEGRATION
```

---

# 4. Source of Merge Truth

For repository merge state, use authoritative repository/GitHub evidence.

Conversation statements are contextual evidence only.

Canonical:

```text id="agcat4"
GIT / REPOSITORY STATE
>
CHAT MEMORY
```

for repository revision claims.

---

# 5. Required Identities

Post-merge verification SHOULD establish:

```text id="ywwvmo"
repository
expected PR
expected PR head
PR merge state
integration/merge revision
current main revision
intervening revisions where relevant
relevant current checks
```

Do not collapse these identities.

---

# 6. PR Head and Merge Revision Are Different Concepts

Never assume:

```text id="ys5bx8"
PR_HEAD_SHA
=
MERGE_SHA
```

Different GitHub merge strategies may produce different relationships.

Possible strategies include:

```text id="duzkdz"
merge commit
squash merge
rebase merge
```

Observe actual repository result.

---

# 7. Merge Confirmation

First question:

> Did the expected PR actually merge?

Confirm:

```text id="55v0fb"
correct repository
correct PR
merged state
integration identity
```

If authoritative evidence does not confirm the merge:

```text id="yziui5"
VE_POST_MERGE.BLOCKED
```

with:

```text id="vfc4dh"
VE_STOP.MERGE_NOT_CONFIRMED
```

---

# 8. Closed Is Not Merged

A PR may be:

```text id="n3tuuf"
closed
```

without being:

```text id="skfpqf"
merged
```

Do not infer integration from closed state alone.

---

# 9. User Statement Does Not Override Repository Evidence

If Owner says:

```text id="w0g9re"
merged
```

but repository shows:

```text id="t8r8su"
open
```

or:

```text id="i3g35x"
closed without merge
```

report:

```text id="tf0zvo"
VE_POST_MERGE.BLOCKED

STOP_REASON
VE_STOP.MERGE_NOT_CONFIRMED
```

Do not pretend repository state matches the statement.

---

# 10. Integration Revision

Record the actual integration revision.

Example:

```text id="vfhvzh"
EXPECTED PR
#27

PR HEAD
abc123...

INTEGRATION REVISION
def456...
```

The integration revision becomes important evidence for post-merge checks.

---

# 11. Current Main

After integration, observe:

```text id="svelqu"
CURRENT_MAIN
```

Do not assume current main equals the integration revision.

Other packages may have merged afterward.

---

# 12. Main Advancement Is Normal

Example:

```text id="e1tj2g"
PACKAGE INTEGRATION REVISION
M1

CURRENT MAIN
M3
```

This does not automatically mean the package is invalid.

The system must determine what happened between:

```text id="eoju6h"
M1
```

and:

```text id="0nklzh"
M3
```

---

# 13. Intervening Changes

Inspect relevant changes after package integration.

Classify them as:

```text id="7xlm5f"
unrelated
compatible
overlapping
semantically interfering
```

Do not automatically block verification merely because main advanced.

---

# 14. Unrelated Main Advancement

If intervening commits are clearly unrelated to the package:

```text id="kpya0o"
post-merge verification may continue
```

while recording:

```text id="0y2ndf"
integration revision
current main
```

separately.

---

# 15. Compatible Main Advancement

A later commit may touch related code without invalidating the package.

Example:

```text id="49l6vk"
package adds validator
later package adds additional tests
```

If semantic compatibility is established:

verification may continue against current state.

---

# 16. Material Interference

If intervening changes materially modify:

```text id="3qroci"
same behavior
same validator
same permission path
same schema
same migration
same critical dependency
```

use:

```text id="9vmnaw"
VE_STOP.POST_MERGE_INTERFERENCE
```

until the combined current state is reviewed.

---

# 17. Interference Does Not Mean Later Change Is Wrong

`VE_STOP.POST_MERGE_INTERFERENCE` means:

> The package cannot be verified independently of later overlapping changes.

It does not mean:

```text id="ap7blj"
later commit is defective
```

The system must review the combined state.

---

# 18. Post-Merge Verification Target

Depending on repository state, verification may need to consider:

```text id="gg8poc"
integration revision
```

and/or:

```text id="zj7bci"
current main
```

Use the revision appropriate to the claim.

---

# 19. Historical Integration Claim

Claim:

```text id="dphb2o"
PR #27 successfully integrated as revision M1.
```

may be supported by merge evidence for `M1`.

This is a historical claim.

It does not require pretending `M1` is current main forever.

---

# 20. Current Repository Health Claim

Claim:

```text id="wrrk85"
The package remains healthy in current main.
```

requires evidence about the current applicable repository state.

Old package merge evidence alone is insufficient if relevant code changed later.

---

# 21. Evidence Provenance

Every material claim SHOULD identify:

```text id="h96018"
what was observed
source
revision
result
limitations
```

Post-merge verification must preserve provenance.

---

# 22. Historical Evidence Remains Valid Historically

A successful PR test for:

```text id="mb95kv"
PR_HEAD A
```

may remain valid evidence that:

> A passed those tests.

It does not automatically prove:

```text id="djig6f"
merge revision B
```

or:

```text id="06dmyt"
current main C
```

if relevant content differs.

---

# 23. PR CI vs Main CI

Distinguish:

```text id="hzo674"
PR CI
```

from:

```text id="hnqpl1"
post-merge / push CI
```

PR CI tests the candidate revision/configuration represented by that run.

Post-merge CI tests the integrated repository state represented by its run.

Both may matter.

---

# 24. PR CI Does Not Prove Integration

Even if PR CI passed:

```text id="s1agwq"
merge may still fail
integration may differ
main may move
post-merge checks may fail
```

Therefore merge confirmation and integration evidence remain necessary.

---

# 25. Main CI

Where relevant, inspect CI associated with:

```text id="n1ns5r"
integration revision
```

or:

```text id="ipva0m"
current main
```

depending on the claim being verified.

---

# 26. Exact Revision CI

Do not say:

```text id="au037u"
main CI passed
```

without knowing which main revision the observed run applies to when revision precision matters.

---

# 27. Required Check Failure

If relevant post-merge checks fail:

do not mark:

```text id="9tpgy2"
VE_POST_MERGE.VERIFIED
```

The package remains unresolved at the Vibe post-integration level.

Use:

```text id="dldxmw"
VE_POST_MERGE.BLOCKED
```

and preserve the actual underlying failure evidence.

---

# 28. Blocked vs Failed Evidence

Vibe coordination may be:

```text id="6iux4b"
VE_POST_MERGE.BLOCKED
```

while an underlying canonical Verification Matrix may be:

```text id="1nx7qv"
FAIL
```

These terms answer different questions.

Do not collapse them.

---

# 29. CI Missing

If required post-merge CI/evidence is unavailable:

use:

```text id="k28414"
VE_POST_MERGE.BLOCKED
```

with the applicable upstream reason such as:

```text id="aiy6sc"
REQUIRED_EVIDENCE_UNAVAILABLE
```

Do not infer success.

---

# 30. CI Cancelled

Cancelled CI does not equal PASS.

Determine whether another valid run supersedes it.

Otherwise required evidence remains incomplete.

---

# 31. CI Skipped

A skipped job/check may be correct due to workflow conditions.

But if the skipped job was required for the package claim:

verification remains incomplete.

---

# 32. Changed CI / Validator

If the merged package changed its own:

```text id="z1toic"
CI
validator
security checker
permission resolver
routing validator
test harness
```

apply the self-modifying-evidence rule.

---

# 33. Self-Modifying Evidence Rule

Hard rule:

> **A changed evaluator is not sufficiently trusted solely because that changed evaluator reports PASS after merge.**

Use additional evidence.

---

# 34. Post-Merge Evidence Mechanism Review

Where applicable, check:

```text id="go83vu"
semantic evaluator diff
negative cases
bypass behavior
old-vs-new behavior
alternate validation
independent assurance
```

according to canonical routing.

---

# 35. Integration Does Not Reset Risk

Merge does not lower risk.

A package classified:

```text id="wxx9eg"
R5
```

before merge remains a material R5 engineering change after merge.

Do not downgrade post-merge scrutiny because integration succeeded.

---

# 36. Integration Does Not Grant Production Authority

A merged feature does not imply authority to:

```text id="mk41l1"
deploy
mutate production
run destructive production operations
enable provider side effects
```

Those remain separate governed actions.

---

# 37. Merge Does Not Prove Deployment

Canonical evidence principle:

```text id="otpyux"
GIT MERGE
≠
DEPLOYMENT
```

Repository state is authoritative for source revision.

It is not authoritative for production deployment success.

---

# 38. Merge Does Not Prove Runtime Health

Likewise:

```text id="g7o0hs"
MERGED CODE
≠
HEALTHY RUNTIME
```

Runtime health requires runtime evidence.

---

# 39. Merge Does Not Prove Business Outcome

Example:

```text id="z66x75"
payment fix merged
```

does not prove:

```text id="pm66qx"
customer payment corrected
```

Business state requires authoritative business evidence.

---

# 40. Post-Merge Repository Verification

Post-merge Vibe verification normally focuses on repository-level integration.

Possible checks:

```text id="bhb4qg"
merge fact
integration revision
current main
repository integrity
governance validation
relevant push CI
current source state
intervening changes
```

---

# 41. Runtime Verification Is Separate

If the package objective explicitly requires runtime verification:

perform it through the applicable canonical runtime/release procedure.

Do not overload `VE_POST_MERGE.VERIFIED`.

---

# 42. Release Preparation

If merge is followed by release preparation:

transition into:

```text id="sn59b7"
VE_SESSION.RELEASE_PREPARATION
```

and use the canonical Release Packet where required.

---

# 43. Release Packet Recommendation

Canonical release recommendation may include:

```text id="8tsvuh"
READY_FOR_AUTHORIZED_RELEASE
NOT_READY
BLOCKED
```

This recommendation remains separate from post-merge status.

---

# 44. Release Recommendation Is Not Authority

Even:

```text id="33gf78"
READY_FOR_AUTHORIZED_RELEASE
```

does not mean:

```text id="f7yoxq"
deploy now
```

Execution authority remains separate.

---

# 45. MGBOS Release / Recovery

Where MGBOS release is involved, use the canonical MGBOS release/recovery runbook.

Do not use this Vibe document to redefine:

```text id="juw055"
migration recovery
application rollback compatibility
production release checks
```

---

# 46. Rollback After Merge

A repository revert may restore source state.

It may not reverse:

```text id="ccapyg"
database migration
external communication
payment effect
provider mutation
physical production
```

Recovery planning remains domain-specific.

---

# 47. Post-Merge Defect

If post-merge verification finds a defect:

do not rewrite the merged PR.

Start:

```text id="62ducj"
VE_SESSION.REMEDIATION
```

or:

```text id="ey17xr"
VE_SESSION.NEW_WORK
```

depending on scope.

---

# 48. Post-Merge Remediation Baseline

A corrective package after merge should normally bind to:

```text id="e0gwqt"
CURRENT MAIN
```

or another current accepted base.

Not the historical PR branch.

---

# 49. When to Use Remediation

Use remediation when:

```text id="t9rk54"
the post-merge defect is a bounded correction
of the original accepted objective
```

---

# 50. When to Use New Work

Use new work when fixing the problem requires:

```text id="1yc0ni"
new objective
new architecture
new product behavior
material scope expansion
new routing
new authority
```

---

# 51. Revert Decision

Do not automatically revert every failing merge.

Determine:

```text id="17j2xa"
severity
blast radius
reversibility
migration state
compatibility
current main changes
alternative forward fix
```

and follow applicable authority.

---

# 52. No Automatic Revert by AI

Vibe Engineering does not grant:

```text id="1scjsf"
automatic revert authority
```

for material repository or production effects.

Use governed decision-making.

---

# 53. Package Completion Boundary

A package should not reach:

```text id="ddbyyx"
VE_OBJECTIVE.COMPLETE
```

merely because the PR merged.

Where post-merge verification is required:

completion requires:

```text id="f06g9s"
VE_POST_MERGE.VERIFIED
```

plus remaining package completion criteria.

---

# 54. Post-Merge Result

Vibe-specific coordination result:

```text id="vb1i8e"
VE_POST_MERGE.VERIFIED
```

or:

```text id="l1dlab"
VE_POST_MERGE.BLOCKED
```

These are the only Vibe post-merge result tokens defined by the vocabulary.

---

# 55. `VE_POST_MERGE.VERIFIED`

Use when:

```text id="czd8ci"
expected integration confirmed
+
required repository-level post-integration checks support the claim
+
no unresolved material interference blocks closure
```

---

# 56. `VE_POST_MERGE.VERIFIED` Does Not Mean Everything Verified

It does not automatically claim:

```text id="tbwt1o"
deployment verified
production verified
customer outcome verified
business process verified
```

State those separately where applicable.

---

# 57. `VE_POST_MERGE.BLOCKED`

Use when the Vibe procedure cannot truthfully close the package.

Possible reasons:

```text id="glnbib"
merge not confirmed
material interference
required CI failure
required evidence unavailable
post-merge regression
unresolved canonical conflict
```

Record the actual cause.

---

# 58. Merge Not Confirmed

Use:

```text id="8oj8k4"
VE_STOP.MERGE_NOT_CONFIRMED
```

only for the Vibe-specific condition:

> Expected repository integration cannot be authoritatively confirmed.

---

# 59. Post-Merge Interference

Use:

```text id="jswf1p"
VE_STOP.POST_MERGE_INTERFERENCE
```

when later changes prevent isolated verification of the package.

---

# 60. Interference Review

When interference exists:

```text id="27wcta"
identify intervening commits
identify overlapping files
identify overlapping semantics
identify affected evidence
```

Then determine whether:

```text id="e8ijgg"
combined current state can be verified
```

or requires new remediation/audit.

---

# 61. Package Integration vs Current State

Keep both:

```text id="l2sacl"
PACKAGE INTEGRATION FACT
```

and:

```text id="mh1ypk"
CURRENT REPOSITORY FACT
```

This prevents historical revision confusion.

---

# 62. Example — Main Unchanged

```text id="9rz5rn"
PR HEAD
A

MERGE REVISION
M

CURRENT MAIN
M
```

Post-merge verification can directly evaluate `M`.

---

# 63. Example — Main Advanced Unrelated

```text id="aefz5w"
MERGE REVISION
M1

CURRENT MAIN
M3

M2 / M3
only unrelated documentation outside package dependency closure
```

Package may still reach:

```text id="j9ln11"
VE_POST_MERGE.VERIFIED
```

when required evidence supports it.

---

# 64. Example — Main Advanced Materially

```text id="2xvbzh"
MERGE REVISION
M1

CURRENT MAIN
M3

M2
changes the same permission resolver
```

Result:

```text id="4832vj"
VE_POST_MERGE.BLOCKED

STOP_REASON
VE_STOP.POST_MERGE_INTERFERENCE
```

until combined behavior is reviewed.

---

# 65. Current Main Recheck

Before finalizing post-merge conclusion:

refresh:

```text id="gjq9jp"
CURRENT_MAIN
```

where tooling permits.

This reduces race conditions.

---

# 66. Post-Merge Race

Possible race:

```text id="w22tgb"
verify M1
↓
M2 merges
↓
report current main healthy based on M1
```

Avoid by recording exact observed current main at conclusion time.

---

# 67. Evidence Freshness

Evidence may be:

```text id="79a8tc"
FRESH
STALE
HISTORICAL
UNKNOWN
```

according to canonical Evidence Provenance semantics.

Use freshness relative to the actual claim.

---

# 68. Historical PR Evidence

Old PR CI can remain:

```text id="ouhsib"
HISTORICAL
```

evidence.

Do not delete or rewrite it.

---

# 69. Stale Engineering Evidence

If current implementation materially differs from the tested revision:

old evidence may be:

```text id="s1u0o0"
STALE
```

for the current-state claim.

Re-run/rebind evidence as appropriate.

---

# 70. Append-Oriented Evidence

Completed high-risk evidence should remain append-oriented.

Do not change old evidence to make later work appear better supported.

---

# 71. Post-Merge Verification Checklist — Identity

```text id="rsqsux"
[ ] repository confirmed
[ ] expected PR identified
[ ] PR merge state observed
[ ] PR head recorded
[ ] integration revision identified
[ ] current main observed
```

---

# 72. Post-Merge Verification Checklist — Main Advancement

```text id="v2yuev"
[ ] integration revision compared with current main
[ ] intervening commits identified if any
[ ] overlapping paths reviewed
[ ] overlapping semantics reviewed
[ ] interference status determined
```

---

# 73. Post-Merge Verification Checklist — Evidence

```text id="h69j8t"
[ ] relevant PR evidence retained
[ ] relevant integration/main checks identified
[ ] CI bound to actual revision
[ ] failed/skipped/cancelled checks understood
[ ] evidence freshness appropriate
[ ] self-modifying evaluator risk handled
```

---

# 74. Post-Merge Verification Checklist — Repository Health

As applicable:

```text id="vsbuhq"
[ ] repository integrity passes
[ ] governance validation passes
[ ] target-system checks pass
[ ] schema/reference validation passes
[ ] no unexpected integration regression observed
```

Only list checks actually relevant and executed.

---

# 75. Post-Merge Verification Checklist — Claims

```text id="s58y3t"
[ ] repository merge claim supported
[ ] integration revision claim supported
[ ] current-main claim supported
[ ] runtime claims separated
[ ] deployment claims separated
[ ] business claims separated
```

---

# 76. Post-Merge Verification Checklist — Closure

```text id="bd5990"
[ ] VE_POST_MERGE result truthful
[ ] blockers explicit
[ ] remaining unverified areas explicit
[ ] remediation/new-work decision made if needed
[ ] reflection completed
[ ] roadmap updated conceptually
[ ] next package identified
```

---

# 77. Owner-Facing Success Pattern

When package integration is healthy:

```text id="yxmhos"
POST-MERGE
VE_POST_MERGE.VERIFIED

PR
#27

PR HEAD
<sha>

INTEGRATION REVISION
<sha>

CURRENT MAIN
<sha>

RELEVANT CHECKS
passed

INTERVENING CHANGES
none material

REPOSITORY RESULT
verified

NOT VERIFIED BY THIS STEP
production/runtime state unless separately checked

NEXT
reflection / next bounded package
```

---

# 78. Owner-Facing Blocked Pattern

```text id="53k785"
POST-MERGE
VE_POST_MERGE.BLOCKED

PR
#27

INTEGRATION REVISION
<sha>

CURRENT MAIN
<sha>

BLOCKER
<reason>

STOP_REASON
<applicable code>

NEXT
<remediation / additional audit / evidence recovery>
```

---

# 79. Owner-Facing Interference Pattern

```text id="wsgw2j"
POST-MERGE
VE_POST_MERGE.BLOCKED

INTEGRATION REVISION
M1

CURRENT MAIN
M3

INTERFERENCE
M2 modified the same governance validator.

STOP_REASON
VE_STOP.POST_MERGE_INTERFERENCE

NEXT
audit the combined current state
```

---

# 80. Reflection Begins After Truth Restoration

Do not reflect first and verify later.

Correct:

```text id="kntoya"
VERIFY CURRENT RESULT
        ↓
REFLECT
```

Reflection built on wrong repository state creates bad roadmap decisions.

---

# 81. Reflection Purpose

Reflection converts verified engineering history into better future planning.

It answers:

```text id="6fhava"
What happened?

What was actually proven?

What was not proven?

What surprised us?

What did the previous plan miss?

What should change next?
```

---

# 82. Reflection Is Not a Celebration Summary

Avoid:

```text id="vi1a0l"
Everything worked great.
```

Prefer:

```text id="q366py"
The intended authorization guard is integrated and repository checks pass at revision X. Trusted approval verification remains intentionally unavailable and fail-closed.
```

Reflection should preserve uncertainty.

---

# 83. Reflection Sources

Use:

```text id="k0j5xf"
contracts
Engineering Report
Assurance Report
Verification Matrix
PR
merge evidence
CI
current repository state
```

as appropriate.

Do not rely solely on chat recollection.

---

# 84. Reflection Categories

Recommended reflection categories:

```text id="8h76st"
DELIVERED
PROVEN
NOT_PROVEN
FINDINGS
PROCESS_LESSONS
ARCHITECTURE_LESSONS
RISK_LESSONS
ROADMAP_IMPACT
NEXT_PACKAGE
```

These are headings/prose, not formal machine enums.

---

# 85. Delivered

`DELIVERED` describes what repository change actually integrated.

Example:

```text id="jwldir"
Approval-required engineering execution now fails closed when trusted approval evidence is unavailable.
```

Only state what is supported.

---

# 86. Proven

`PROVEN` lists evidence-backed claims.

Example:

```text id="ib4eyb"
Focused positive and negative governance tests pass.

Agent Governance CI passes on the integration revision.

Remote mutation remains outside enabled authority.
```

Use exact evidence.

---

# 87. Not Proven

Always consider:

```text id="fwrtvz"
NOT_PROVEN
```

Examples:

```text id="egvgft"
production deployment
real external provider behavior
future routing profile
trusted approval verifier
manual branch-protection behavior not experimentally verified
```

This prevents documentation inflation.

---

# 88. Process Lessons

Ask:

```text id="yugiwl"
What process caught the defect?

What process missed the defect?

Was context too broad?

Was contract ambiguous?

Was a negative test missing?

Did stale evidence nearly pass?
```

---

# 89. Architecture Lessons

Ask:

```text id="2gez2c"
Did the implementation reveal a hidden coupling?

Did canonical ownership remain correct?

Did adapter boundaries hold?

Did the target architecture need adjustment?
```

---

# 90. Risk Lessons

Ask:

```text id="e25sqv"
Was original risk correct?

Did a new concern appear?

Should routing floors change?

Was any risk underestimated?
```

Do not retroactively rewrite original classification without preserving history.

---

# 91. Evidence Lessons

Ask:

```text id="oxtr6q"
Did required evidence actually prove the intended claim?

Was any check too weak?

Was a validator self-certifying?

Was environment provenance clear?
```

---

# 92. Assurance Lessons

Ask:

```text id="u3rv0x"
Was required independence available?

Was self-review represented honestly?

Did role separation work?

Should future packages require stronger assurance?
```

---

# 93. Owner Experience Lessons

Ask:

```text id="wxudb6"
Did Owner receive only decisions that genuinely required Owner judgment?

Was too much technical noise surfaced?

Was a critical decision hidden?
```

The goal is high leverage without hidden risk.

---

# 94. Context Lessons

Ask:

```text id="36gi46"
Did agents receive too much context?

Did they miss a canonical source?

Did stale conversation memory interfere?

Can a thin rule/Skill improve future context loading?
```

---

# 95. Deterministic Hardening Lesson

When a recurring error can be deterministically prevented:

consider:

```text id="tu0azv"
schema
validator
test
CI rule
permission guard
database constraint
```

instead of only adding prompt instructions.

---

# 96. Do Not Globalize Every Lesson

Not every defect deserves a global rule.

Promote a lesson into:

```text id="7t02k2"
rule
Skill
validator
architecture policy
```

only when reusable and justified.

Otherwise keep it local.

---

# 97. Roadmap Update

Reflection should answer:

```text id="twzkhi"
Is the current roadmap still correct?
```

Possible outcomes:

```text id="i67jqz"
continue planned next package
insert remediation/hardening package
split next package
defer lower-value work
reorder dependencies
```

---

# 98. Roadmap State

Where Vibe coordination labels are useful:

```text id="dz30vp"
VE_ROADMAP.PLANNED
VE_ROADMAP.ACTIVE
VE_ROADMAP.BLOCKED
VE_ROADMAP.COMPLETE
VE_ROADMAP.DEFERRED
```

Target-system canonical roadmap terminology remains authoritative if it defines its own semantics.

---

# 99. Next Package Must Be Bounded

Reflection should produce:

```text id="kzmdhc"
one recommended next bounded objective
```

not:

```text id="a5u0ol"
continue building everything
```

---

# 100. Next Package Dependency

Before starting the next package:

identify whether previous work created:

```text id="i3rm0d"
new dependency
new route
new risk
new evidence requirement
new architecture decision
```

that changes planning.

---

# 101. Reflection Before Next Material Package

Hard Vibe invariant:

```text id="rzkmaj"
REFLECTION
BEFORE
NEXT MATERIAL PACKAGE
```

This reduces roadmap drift and repeated defects.

---

# 102. Reflection Does Not Block Tiny Follow-Ups

For trivial non-semantic work, reflection may be proportionally concise.

Do not create bureaucracy for a typo.

Material work requires meaningful reflection.

---

# 103. Package Completion

Use:

```text id="yks76x"
VE_OBJECTIVE.COMPLETE
```

when the Vibe coordination objective is genuinely complete.

For packages requiring merge verification, that normally means:

```text id="jsklpv"
integration confirmed
+
required post-merge verification satisfied
+
blocking findings resolved/governed
+
reflection completed
```

---

# 104. Complete Does Not Mean Released

`VE_OBJECTIVE.COMPLETE` may describe a repository-engineering package.

It does not imply:

```text id="uh54y5"
production released
```

unless release itself was in objective and verified separately.

---

# 105. Complete Does Not Mean Business Outcome

Likewise package completion does not mean:

```text id="c1kfss"
sales improved
payment settled
order fulfilled
customer notified
```

Business outcomes belong to authoritative business systems.

---

# 106. Unverified Claims Must Stay Unverified

Never close a package by upgrading:

```text id="f9b65o"
NOT VERIFIED
```

into:

```text id="900f14"
probably fine
```

because implementation is complete.

---

# 107. Post-Merge Finding Outside Scope

If verification finds unrelated debt:

record it.

Do not automatically reopen the completed package unless the issue materially invalidates it.

---

# 108. Post-Merge Finding Inside Scope

If a new defect invalidates package acceptance:

the package cannot truthfully close.

Start remediation/new work as appropriate.

---

# 109. Deferred Work

Reflection may create deferred findings.

Each should state:

```text id="aklruf"
what
why deferred
impact
suggested owner/package
```

Deferral is not accepted risk.

---

# 110. Accepted Risk

Where actual risk acceptance is required:

follow canonical authority.

Do not mark a concern accepted simply because Owner wants to move on unless applicable policy supports the decision/evidence.

---

# 111. Branch Cleanup

Deleting a merged branch is repository mutation.

Do not assume automatic permission.

Branch cleanup is operational hygiene, not package-verification evidence.

---

# 112. Worktree Cleanup

Similarly, local worktree cleanup should preserve any unrelated work and follow actual environment context.

It is not required to prove package correctness.

---

# 113. Artifact Finalization

After successful integration, canonical artifacts remain historical engineering evidence.

Do not rewrite:

```text id="h53a4h"
Implementation Contract
Engineering Report
Assurance Report
Verification Matrix
```

to describe later main revisions.

Use new evidence for new revisions.

---

# 114. Change Package Closure

Vibe Change Package may record:

```text id="7s0wez"
final integration revision
current main at verification
post-merge result
reflection
next package
```

for continuity.

It remains a coordination artifact.

---

# 115. Session Handoff After Closure

A future session should be able to recover:

```text id="z3x68a"
completed objective
merge revision
post-merge result
remaining debt
next planned package
```

without needing old chat history.

---

# 116. Long Gap After Merge

If post-merge verification happens much later:

do not assume current main remains close to merge revision.

Perform a broader intervening-change audit.

---

# 117. Multiple Subsequent Merges

If many packages merged after the target package:

focus comparison on:

```text id="4oc6ks"
affected paths
reverse dependencies
semantic boundaries
```

rather than re-auditing the entire repository without reason.

---

# 118. Current Main Failure

If current main has failing required repository checks:

do not automatically blame the target package.

Determine provenance.

Possible causes:

```text id="66hkno"
target package
later package
environment
flaky check
infrastructure
```

---

# 119. Provenance Before Blame

A post-merge regression finding should identify which revision introduced or exposed the issue where evidence supports that conclusion.

Do not attribute causality based only on timing.

---

# 120. Flaky Evidence

If a check is suspected flaky:

do not simply retry until green and ignore failures.

Investigate whether the failure indicates real instability.

---

# 121. Intermittent Security / Financial Failures

For high-risk checks:

intermittent failure is material.

Do not average it away.

---

# 122. Repository Integrity

Where the repo has repository-integrity validation:

post-merge procedure SHOULD consider its current result when relevant.

Do not claim it passed if it was not observed for the relevant revision.

---

# 123. Governance Integrity

Control-plane/governance changes SHOULD verify relevant governance checks after integration.

The exact workflows/commands may evolve.

Always observe current repository configuration.

---

# 124. Branch Protection

Documentation about branch protection may describe:

```text id="7zno9e"
OBSERVED CURRENT STATE
NOT VERIFIED
DESIRED TARGET STATE
```

Do not convert a documented target into observed enforcement.

---

# 125. Direct-Push Assumption

Even if policy prohibits direct push:

do not claim server-side direct-push rejection has been experimentally proven unless authoritative evidence establishes it.

Policy and enforcement evidence are separate.

---

# 126. Release vs Merge

Keep the lifecycle clear:

```text id="2rnzbb"
PR MERGE
        ↓
REPOSITORY POST-MERGE VERIFICATION
        ↓
RELEASE PREPARATION
        ↓
AUTHORIZED RELEASE
        ↓
DEPLOYMENT / RUNTIME VERIFICATION
```

where release exists.

Not every repository package goes to production immediately.

---

# 127. Release Recovery

For actual MGBOS releases, use the dedicated runbook for:

```text id="9bafoh"
compatibility
migration
rollback
forward repair
recovery
```

This document coordinates engineering reflection only.

---

# 128. Runtime Postcondition

Consequential execution outside Git should produce postcondition evidence.

Example:

```text id="kpr6du"
deployment request accepted
```

is weaker than:

```text id="zf4db4"
target revision observed running and healthy
```

Use domain-specific verification.

---

# 129. HTTP Success Is Not Universal Proof

A deployment/provider API returning success may only prove acknowledgement.

It may not prove final runtime state.

Use authoritative postcondition evidence where required.

---

# 130. Reflection Template

Use this default structure.

```markdown id="77p02q"
# Post-Merge Verification — <Package / PR>

## 1. Identity

REPOSITORY:
Rizkybuilds/bisnishub

PR:
#___

PR_HEAD:
<sha>

INTEGRATION_REVISION:
<sha>

CURRENT_MAIN:
<sha>

---

## 2. Merge Confirmation

MERGE_CONFIRMED:
YES | NO

EVIDENCE:
...

STOP_REASON:
none | VE_STOP.MERGE_NOT_CONFIRMED

---

## 3. Main Advancement

MAIN_ADVANCED_AFTER_INTEGRATION:
YES | NO

INTERVENING_REVISIONS:

- ...

OVERLAP:

- none
- ...

INTERFERENCE:
YES | NO

STOP_REASON:
none | VE_STOP.POST_MERGE_INTERFERENCE

---

## 4. Repository Verification

CHECKS:

- <check> — <result> — <revision>
- <check> — <result> — <revision>

FAILED_CHECKS:

- none

UNAVAILABLE_CHECKS:

- none

---

## 5. Evidence Mechanism

EVIDENCE_MECHANISM_CHANGED:
YES | NO

SELF_VALIDATION_RISK:
YES | NO

ADDITIONAL_ASSURANCE:

- ...

---

## 6. Post-Merge Result

POST_MERGE:
VE_POST_MERGE.VERIFIED | VE_POST_MERGE.BLOCKED

WHAT_THIS_PROVES:

- ...

WHAT_THIS_DOES_NOT_PROVE:

- ...

---

## 7. Delivered

- ...

---

## 8. Proven

- ...

---

## 9. Not Proven

- ...

---

## 10. Findings

- ...

---

## 11. Lessons

PROCESS:

- ...

ARCHITECTURE:

- ...

RISK:

- ...

EVIDENCE:

- ...

OWNER_EXPERIENCE:

- ...

---

## 12. Roadmap Impact

CURRENT_ITEM:
...

RESULT:
...

NEXT_ITEM:
...

DEPENDENCY_CHANGE:
...

---

## 13. Objective Closure

VE_OBJECTIVE:
VE_OBJECTIVE.COMPLETE | VE_OBJECTIVE.BLOCKED

BLOCKER:
none | ...

NEXT_GOVERNED_ACTION:
...
```

---

# 131. Owner-Facing Closure Summary

After detailed verification, the Owner should receive something like:

```text id="zwwdbl"
PR #27

MERGE
confirmed

INTEGRATION REVISION
<sha>

CURRENT MAIN
<sha>

POST-MERGE
VE_POST_MERGE.VERIFIED

REPOSITORY CHECKS
pass

INTERFERENCE
none material

WHAT WAS PROVEN
<brief>

NOT PROVEN
<brief>

NEXT
<next bounded package>
```

---

# 132. Owner-Facing Failure Summary

```text id="us7u6r"
PR #27

MERGE
confirmed

POST-MERGE
VE_POST_MERGE.BLOCKED

PROBLEM
relevant main CI fails on integration revision

IMPACT
package cannot be closed

NEXT
bounded remediation
```

---

# 133. Owner-Facing Interference Summary

```text id="72s8ml"
PR #27

MERGE
confirmed at M1

CURRENT MAIN
M3

POST-MERGE
VE_POST_MERGE.BLOCKED

WHY
M2 materially changed the same enforcement path.

NEXT
review combined current state
```

---

# 134. Owner Should Not Need Git Forensics

The Owner should not need to manually determine:

```text id="tathxk"
PR head
merge SHA
main ancestry
workflow run SHA
```

The engineering system should resolve those details and present the decision-quality result.

---

# 135. Reflection Should Be Actionable

A good reflection ends with:

```text id="gyfu8v"
NEXT GOVERNED ACTION
```

not only:

```text id="co422l"
lessons learned
```

---

# 136. Reflection Should Not Automatically Create Work

A reflection may recommend a next package.

Actual next work still follows:

```text id="fgbjh6"
Owner intent
+
priority
+
governed planning
```

---

# 137. Roadmap Drift

If repeated implementation shows the roadmap assumption is wrong:

update the roadmap deliberately.

Do not continue because the old sequence exists.

---

# 138. Dependency Drift

A completed package may reveal that the next package depends on newly discovered work.

Record it before continuing.

---

# 139. Architecture Drift

If implementation repeatedly fights canonical architecture:

investigate whether:

```text id="kixras"
implementation is wrong
```

or:

```text id="3kdw9d"
architecture needs governed revision
```

Do not normalize drift silently.

---

# 140. Risk Drift

If repeated work consistently triggers higher risk than roadmap expected:

consider updating route/risk planning.

Do not repeatedly classify too low then escalate late.

---

# 141. Evidence Drift

If required evidence repeatedly cannot be produced:

the testing/verification architecture may need improvement.

Do not solve by declaring the evidence optional without governance.

---

# 142. Owner Decision Drift

If Owner is repeatedly asked low-level technical questions:

the engineering operating model is leaking implementation complexity.

Improve the planning/decision package.

---

# 143. Agent Context Drift

If agents repeatedly miss rules because context is too large or dispersed:

consider a thin canonical projection.

Do not simply load more documents forever.

---

# 144. Rule Candidate

A lesson may justify a global invariant when:

```text id="jecaxd"
recurring
high consequence
generalizable
not already canonical
```

Otherwise keep it local.

---

# 145. Skill Candidate

A repeated multi-step procedure may justify a reusable Skill.

Skills should encode procedure.

They should not create new authority.

---

# 146. Validator Candidate

A deterministic invariant should preferably become a validator where feasible.

Examples:

```text id="tka1tw"
schema validation
forbidden path detection
routing reference validation
unknown VE token detection
```

---

# 147. CI Candidate

A repeatable repository-wide check may belong in CI when:

```text id="r3j9ch"
stable
deterministic
valuable
not prohibitively expensive
```

CI should not be used to hide uncertain semantics behind a green badge.

---

# 148. Post-Merge Verification Is Not Permanent Monitoring

This protocol verifies integration at a bounded point in time.

It does not continuously guarantee future main health.

Later regressions require new evidence.

---

# 149. Future Package Invalidating Old Package

A future legitimate package may intentionally supersede earlier behavior.

That does not mean the old package was incorrectly verified historically.

Historical truth and current truth differ.

---

# 150. Historical Closure

A completed package should preserve:

```text id="0bp41x"
what was true
at which revision
under which evidence
```

This allows future engineering forensic work.

---

# 151. Exact Revision Finalization

Before final closure:

recheck:

```text id="01np71"
current main
```

where practical.

Record the exact observed revision.

Do not write:

```text id="f0eutp"
latest main
```

without identity.

---

# 152. Post-Merge Invariants

```text id="xt5z66"
PM-INV-001
Owner saying merged triggers verification; it does not prove merge.

PM-INV-002
PR head, integration revision and current main remain distinct identities.

PM-INV-003
Repository merge evidence comes from authoritative repository state.

PM-INV-004
PR CI does not prove post-merge repository health.

PM-INV-005
Evidence remains revision-bound.

PM-INV-006
Historical evidence is not silently presented as current.

PM-INV-007
Current main advancement does not automatically invalidate a package.

PM-INV-008
Material overlapping advancement requires interference review.

PM-INV-009
Changed evaluators do not certify themselves alone.

PM-INV-010
Merge does not prove deployment.

PM-INV-011
Merge does not prove runtime health.

PM-INV-012
Merge does not prove business outcome.

PM-INV-013
Post-merge verification does not grant release authority.

PM-INV-014
Merged history is not rewritten by remediation.

PM-INV-015
Reflection follows verified reality.

PM-INV-016
Reflection preserves unknown and unverified areas.

PM-INV-017
Next material package begins from reflection, not momentum alone.

PM-INV-018
Package completion does not imply production completion.
```

---

# 153. Anti-Pattern — Trust `merged`

Forbidden:

```text id="mgtq72"
Owner:
merged

Assistant:
great, package complete
```

Correct:

```text id="9jd509"
Owner:
merged

Assistant:
VE_SESSION.POST_MERGE
→ verify repository
```

---

# 154. Anti-Pattern — Head Equals Merge

Forbidden assumption:

```text id="r57t6j"
PR head
=
merge SHA
```

Observe actual integration strategy/result.

---

# 155. Anti-Pattern — Ignore Main Advancement

Forbidden:

```text id="1r4pg1"
package merged yesterday
current main changed
use yesterday's result as current proof
```

Assess relevant intervening changes.

---

# 156. Anti-Pattern — Re-Audit Entire Repository Blindly

Main advancement does not require reading every file again.

Use dependency and overlap analysis.

---

# 157. Anti-Pattern — PR CI Equals Main CI

Forbidden:

```text id="sq4vh6"
PR checks green
→ post-merge verified
```

Integration evidence remains separate.

---

# 158. Anti-Pattern — Merge Equals Deployment

Forbidden:

```text id="rzxmmy"
GitHub says merged
→ production updated
```

Deployment requires separate evidence.

---

# 159. Anti-Pattern — Deployment Equals Business Success

Forbidden:

```text id="5smiyp"
deployment healthy
→ customer order fixed
```

Business truth remains domain-authoritative.

---

# 160. Anti-Pattern — Green Self-Modified Validator

Forbidden:

```text id="p3rykt"
validator changed
validator green
→ validator safe
```

Apply independent/alternate evidence.

---

# 161. Anti-Pattern — Rewrite Old Evidence

Forbidden:

```text id="d1ixf9"
new fix works
→ edit old audit to remove old failure
```

Preserve engineering history.

---

# 162. Anti-Pattern — Skip Reflection

Forbidden:

```text id="b1sbov"
merged
→ immediately next package
```

for material work.

First:

```text id="04emza"
verify
reflect
then plan
```

---

# 163. Anti-Pattern — Reflection as Praise

Forbidden:

```text id="hk1oqo"
Great work, everything is solid.
```

without evidence.

Reflection is engineering analysis.

---

# 164. Anti-Pattern — Every Lesson Becomes Global Rule

Too many global rules increase context and contradiction risk.

Promote only durable generalizable lessons.

---

# 165. Anti-Pattern — Deferred Means Safe

A deferred finding remains real.

Do not treat deferral as:

```text id="7hjadf"
resolved
```

or:

```text id="j0sbob"
accepted risk
```

without actual governance.

---

# 166. Completion Checklist

A material merged package may close when:

```text id="d5ewx2"
[ ] expected PR merge confirmed
[ ] integration revision identified
[ ] current main observed
[ ] intervening changes assessed
[ ] relevant post-merge checks reviewed
[ ] self-modifying evidence risk handled
[ ] no unresolved material interference exists
[ ] Vibe post-merge result recorded
[ ] remaining runtime/deployment claims separated
[ ] reflection completed
[ ] next package/decision identified
```

---

# 167. Blocked Closure Checklist

If closure is blocked:

```text id="6namtl"
[ ] blocker identified
[ ] evidence preserved
[ ] impact explained
[ ] current revision recorded
[ ] remediation/new-work path selected
[ ] no false completion claim made
```

---

# 168. Reflection Checklist

```text id="2vhr0g"
[ ] delivered state recorded
[ ] proven claims recorded
[ ] not-proven claims recorded
[ ] findings recorded
[ ] process lesson recorded
[ ] architecture lesson considered
[ ] risk lesson considered
[ ] evidence lesson considered
[ ] roadmap impact considered
[ ] next bounded action identified
```

---

# 169. Final Closure Pattern

```text id="zuc9ea"
PACKAGE
VECP-___

VE_OBJECTIVE
VE_OBJECTIVE.COMPLETE

PR
#___

PR HEAD
<sha>

INTEGRATION REVISION
<sha>

CURRENT MAIN AT VERIFICATION
<sha>

POST_MERGE
VE_POST_MERGE.VERIFIED

WHAT WAS PROVEN
- ...

WHAT REMAINS OUTSIDE THIS CLAIM
- ...

NEXT GOVERNED ACTION
<next package / none>
```

---

# 170. Final Blocked Pattern

```text id="tlhn36"
PACKAGE
VECP-___

VE_OBJECTIVE
VE_OBJECTIVE.BLOCKED

PR
#___

INTEGRATION REVISION
<sha>

CURRENT MAIN
<sha>

POST_MERGE
VE_POST_MERGE.BLOCKED

BLOCKER
...

STOP_REASON
...

NEXT GOVERNED ACTION
...
```

---

# 171. Final Principle

The engineering lifecycle does not end when GitHub displays:

```text id="svgwyi"
Merged
```

It ends when the system can truthfully answer:

```text id="jqofl5"
WHAT WAS INTEGRATED?

AT WHICH REVISION?

IS IT PRESENT IN THE EXPECTED REPOSITORY STATE?

WHAT EVIDENCE SUPPORTS THAT?

DID LATER CHANGES INTERFERE?

WHAT DID WE ACTUALLY PROVE?

WHAT DID WE NOT PROVE?

WHAT DID WE LEARN?

WHAT SHOULD HAPPEN NEXT?
```

The correct flow is:

```text id="kt3ybb"
MERGE
    ↓
VERIFY
    ↓
REFLECT
    ↓
PLAN
```

not:

```text id="xr3lzr"
MERGE
    ↓
ASSUME DONE
```

That is the Vibe Engineering post-merge verification and reflection protocol.