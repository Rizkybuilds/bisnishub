---
canonical_id: docs.governance.autonomy-levels
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: ecosystem
document_class: governance
effective_from: 2026-09-29
authoritative_for:
  - ecosystem autonomy semantics
  - L0-L4 autonomy levels
  - capability autonomy grants
  - autonomy scope and environment boundaries
  - autonomy promotion and demotion
  - autonomy evidence requirements
  - autonomous execution constraints
  - autonomy lifecycle governance
  - human-control expectations
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - documentation-constitution.md
  - canonical-source-map.md
  - cross-system-risk-classification.md
  - ../architecture/master-system-blueprint.md
  - ../architecture/system-boundaries.md
  - ../architecture/architectural-laws.md
  - ../../systems/mgbos/docs/architecture/permission-authorization-model.md
  - ../../systems/mgbos/docs/architecture/command-event-model.md
supersedes: null
---

# Cross-System Autonomy Levels L0–L4 v1.0

## 1. Purpose

Dokumen ini mendefinisikan tingkat autonomy untuk AI, agents, automation, dan sistem eksekusi di seluruh ekosistem BisnisHub.

Ia menjawab:

> **Seberapa jauh sistem boleh bertindak sendiri setelah capability, permission, risk, dan business validity diketahui?**

Canonical levels:

```text id="7zlo5k"
L0 — Observe

L1 — Recommend

L2 — Prepare

L3 — Execute With Approval

L4 — Execute Automatically Within Policy
```

---

# 2. Core Principle

> **Autonomy is earned capability-by-capability, not granted globally.**

Tidak ada konsep canonical seperti:

```text id="9r90ky"
CFO Agent = L4

JARVIS = Autonomous

Marketing Agent = L3
```

Yang valid adalah:

```text id="mpzmwb"
Principal:
JARVIS / CFO Agent

Capability:
mgbos.finance.summary.read

Scope:
MultiGraph Group

Environment:
PRODUCTION

Autonomy:
L4
```

dan secara bersamaan:

```text id="i8xbdd"
Capability:
mgbos.payment.record

Autonomy:
L3
```

atau bahkan:

```text id="avqac6"
L0 / DENIED
```

---

# 3. Autonomy Grant Identity

Autonomy MUST be interpreted as a tuple:

```text id="e5ouau"
PRINCIPAL
+
CAPABILITY
+
RESOURCE SCOPE
+
ENVIRONMENT
+
POLICY
=
AUTONOMY GRANT
```

Optional contextual limits may additionally include:

```text id="g5aj8x"
business
brand
value threshold
time window
data class
recipient scope
volume
risk ceiling
```

---

# 4. Autonomy Does Not Create Permission

A principal cannot receive meaningful autonomy for a capability it does not possess.

Canonical sequence:

```text id="gw67ef"
IDENTITY
   ↓
PERMISSION
   ↓
RISK
   ↓
AUTONOMY
   ↓
APPROVAL if required
   ↓
EXECUTION
```

Therefore:

```text id="07l21d"
L4
+
no permission
=
DENIED
```

Autonomy never overrides authorization.

---

# 5. Autonomy Does Not Override Business Rules

Even L4 execution still passes:

```text id="l0joso"
authentication
permission
policy
state-machine guards
business invariants
idempotency
verification
```

Example:

```text id="9b8d5d"
inventory.reserve
Autonomy = L4
```

does NOT mean the system may reserve stock that does not exist.

---

# 6. Autonomy Does Not Change Risk

A capability remains intrinsically:

```text id="m99dl3"
R3
R4
R5
```

regardless of autonomy level.

Successful historical execution may justify higher autonomy.

It does not lower the risk classification itself.

---

# 7. Autonomy Is Revocable

Every autonomy grant above trivial observation MUST be conceptually revocable.

Canonical principle:

> **Autonomy is a privilege based on current evidence, not a permanent property.**

System behavior must support:

```text id="g7jcqu"
promotion
restriction
suspension
demotion
revocation
```

without redesigning the entire agent.

---

# 8. L0 — Observe

Definition:

> The system may observe, collect, retrieve, or monitor permitted information but does not independently make operational recommendations or initiate consequential actions.

Typical behavior:

```text id="njtqy4"
read authorized data
monitor metrics
collect evidence
detect raw conditions
surface requested facts
```

---

# 9. L0 Example

```text id="ejv04a"
JARVIS
reads:
mgbos.finance.summary.read

returns:
current cash/invoice facts
```

No recommendation.

No prepared action.

No mutation.

---

# 10. L0 Is Not Unrestricted Read

L0 still requires:

```text id="a05zg0"
permission
organization scope
data classification
least privilege
```

Autonomy level does not replace read authorization.

---

# 11. L0 Appropriate Uses

Typical uses include:

```text id="vpmpgs"
dashboard retrieval
monitoring
data collection
evidence gathering
system inspection
status lookup
```

L0 is especially suitable for the first integration of a new tool or data source.

---

# 12. L1 — Recommend

Definition:

> The system may interpret observed facts and propose what should happen, but it does not prepare an executable side effect.

Pattern:

```text id="84hv5i"
OBSERVE
   ↓
ANALYZE
   ↓
RECOMMEND
   ↓
HUMAN DECIDES WHAT TO DO
```

---

# 13. L1 Example

```text id="h59ae6"
Observation:
Vendor A terlambat dua hari.

Recommendation:
Pertimbangkan memindahkan finishing ke Vendor B.
```

The system has not yet:

```text id="vmkd64"
created a reassignment command
sent vendor communication
reserved another vendor
```

---

# 14. L1 Recommendation Requirements

Recommendation SHOULD distinguish:

```text id="wkyu3u"
facts
interpretation
recommended action
risk
supporting evidence
uncertainty
```

Higher-risk recommendations require stronger evidence.

---

# 15. L1 Does Not Grant Execution

A recommendation can mention:

```text id="tn9s6x"
mgbos.payment.record
```

without having permission or autonomy to execute it.

Thinking about an action and performing it remain separate.

---

# 16. L2 — Prepare

Definition:

> The system may prepare a concrete action artifact or executable proposal, but MUST NOT create the consequential external/business side effect.

Pattern:

```text id="igyr9e"
OBSERVE
  ↓
RECOMMEND
  ↓
PREPARE
  ↓
HUMAN / OTHER AUTHORITY REVIEWS
```

---

# 17. L2 Examples

Examples include:

```text id="gcbnsl"
draft customer email

prepare quotation proposal

prepare vendor reassignment

prepare purchase order

prepare content post

prepare command payload

prepare payment reconciliation proposal
```

but not send/commit them.

---

# 18. Prepared Action Must Be Inspectable

A prepared action SHOULD expose:

```text id="orkm4n"
what will happen
target
important values
risk
evidence
expected effect
required approval
```

This is essential for efficient Founder approval.

---

# 19. Prepared Action Must Not Hide Mutation

L2 MUST NOT perform consequential mutation under labels such as:

```text id="tm1xxo"
prepare
preview
draft
simulation
```

Example:

```text id="jglq2z"
"prepare purchase order"
```

must not secretly issue the PO.

---

# 20. Internal Draft Storage

Storing an internal draft MAY itself be a low-risk mutation.

That does not change the autonomy semantics if the consequential external/business effect has not occurred.

Example:

```text id="dzpcqi"
save email draft
```

can remain L2.

---

# 21. L3 — Execute With Approval

Definition:

> The system may execute a consequential capability only after the specific action has received the required approval.

Pattern:

```text id="gi3yvu"
OBSERVE
  ↓
RECOMMEND
  ↓
PREPARE
  ↓
APPROVAL
  ↓
EXECUTE
  ↓
VERIFY
  ↓
EVIDENCE
```

---

# 22. L3 Is Real Execution

At L3, the system may create actual effects such as:

```text id="lvfbbu"
send message
issue command
publish content
assign vendor
record approved transaction
deploy approved change
```

but only after approval conditions are satisfied.

---

# 23. L3 Approval Is Action-Specific

Approval SHOULD normally bind to a specific action context.

Example:

```text id="wzah62"
Approve:
send this customer message
to this customer
with this content
```

It does not grant:

```text id="tcxzfa"
general future authority
to send any customer message
```

---

# 24. L3 Approval Must Bind to Material Parameters

For consequential actions, approval SHOULD be invalidated if material parameters change after approval.

Examples:

```text id="96t40b"
amount
recipient
vendor
quantity
price
target environment
scope
content
```

Changing material intent requires re-evaluation and often re-approval.

---

# 25. L3 Example — External Message

```text id="fht9r0"
JARVIS prepares follow-up
        ↓
Rizky approves
        ↓
email.message.send
        ↓
verify provider acceptance
        ↓
evidence
```

Autonomy:

```text id="763v6z"
L3
```

---

# 26. L3 Example — Financial Mutation

```text id="mmdra2"
JARVIS reconciles payment evidence
        ↓
prepares RecordPayment
        ↓
Rizky / authorized human approves
        ↓
mgbos.payment.record
        ↓
MGBOS validates
        ↓
verification
        ↓
evidence
```

This remains:

```text id="34976e"
R5 risk
+
L3 autonomy
```

under normal governance.

---

# 27. L4 — Execute Automatically Within Policy

Definition:

> The system may execute a capability without per-action human approval when all predefined policy conditions are satisfied.

Canonical flow:

```text id="4puwwf"
TRIGGER
  ↓
CONTEXT
  ↓
POLICY
  ↓
PERMISSION
  ↓
RISK
  ↓
WITHIN AUTONOMY GRANT?
  ↓ YES
EXECUTE
  ↓
VERIFY
  ↓
EVIDENCE
  ↓
REPORT / ESCALATE IF NEEDED
```

---

# 28. L4 Is Not Unlimited Autonomy

L4 means:

```text id="82czr9"
automatic within bounded policy
```

not:

```text id="t102vb"
do anything needed
```

A valid L4 grant may specify:

```text id="5cs489"
capability
organization
brand
resource scope
risk ceiling
amount ceiling
volume ceiling
time window
environment
allowed recipients
required verification
```

---

# 29. L4 Example — Read Intelligence

A safe early example:

```text id="wln46w"
mgbos.finance.summary.read

principal:
JARVIS

environment:
PRODUCTION

autonomy:
L4
```

JARVIS may automatically read authorized summary data for Morning Briefing.

---

# 30. L4 Example — Low-Risk Operational Action

Future example:

```text id="dsoje6"
send routine internal reminder

only if:
recipient = internal
template = approved
no sensitive data
volume <= threshold
business hours only
```

This may eventually become L4.

---

# 31. L4 Example — Content Publishing

Future:

```text id="j5b7sv"
social.content.publish
```

could become L4 only for a constrained category such as:

```text id="cmv9zu"
approved content templates
non-sensitive topics
specific brand account
daily volume ceiling
no legal/financial claims
```

---

# 32. L4 Requires Verification

Autonomous execution does NOT reduce verification requirements.

In fact:

> **The less human involvement before execution, the more important machine verification becomes after execution.**

---

# 33. Autonomy Is Capability-Specific

Correct:

```text id="4z2g9n"
CMO Agent

content.analyze
→ L4

content.prepare
→ L4

content.publish
→ L3
```

Incorrect:

```text id="jz54z4"
CMO Agent
→ L4
```

---

# 34. Autonomy Is Environment-Specific

Correct:

```text id="jy97bp"
production.deploy

STAGING
→ L4 possible later

PRODUCTION
→ L3
```

The same capability can have different autonomy by environment.

---

# 35. Autonomy Is Scope-Specific

Example:

```text id="uq8dtj"
inventory.adjust

warehouse sandbox
→ L4

production inventory
→ L3

high-value correction
→ L3 + stronger approval
```

---

# 36. Autonomy Is Business-Specific

An agent may have:

```text id="e6thau"
TeeStock content.publish
→ L4
```

without receiving:

```text id="rh8ldc"
MultiGraph content.publish
```

Autonomy does not cross organizational or brand boundaries implicitly.

---

# 37. Autonomy Is Value-Specific

Future policy MAY permit:

```text id="sphvei"
issue PO <= threshold
→ L4
```

while:

```text id="ew3g9s"
larger PO
→ L3
```

Threshold semantics belong to Approval Policy.

---

# 38. Autonomy Is Volume-Specific

Example:

```text id="gozsbg"
send one routine reminder
→ L4
```

does not imply:

```text id="w0okj1"
send 10,000 reminders
→ L4
```

Bulk scale changes effective risk.

---

# 39. Autonomy Is Time-Specific

Policy MAY restrict autonomy to:

```text id="o5yzvo"
business hours
campaign period
temporary delegation window
```

Outside scope:

```text id="12ybqu"
fallback to lower autonomy
```

or deny.

---

# 40. Effective Autonomy

Runtime effective autonomy is the minimum allowed by all applicable constraints.

Conceptually:

```text id="q5kzxu"
effective_autonomy =
min(
  capability grant,
  principal grant,
  environment limit,
  risk policy limit,
  business scope limit,
  temporary restriction,
  tool health limit
)
```

---

# 41. Permission Ceiling

Autonomy cannot exceed permission.

```text id="znftjc"
not authorized
→ no execution at any L-level
```

The principal may still be able to observe/recommend based on separate read capabilities.

---

# 42. Risk Ceiling

Policy MAY define maximum autonomy by risk.

Conceptual baseline:

```text id="2ijllq"
R0
→ L4 commonly acceptable

R1
→ L4 commonly acceptable

R2
→ L4 possible

R3
→ L4 only after strong evidence

R4
→ tightly bounded; often max L3

R5
→ normally max L3;
  some capabilities may permanently remain human-gated
```

This is directional.

Approval Policy may define stricter ceilings.

---

# 43. R5 Is Not Automatically Forbidden at L4

The architecture intentionally does not make:

```text id="pl0qnz"
R5 → L4 impossible
```

a universal law.

But any such exception would require extraordinary governance evidence and explicit policy.

Default remains:

```text id="65yhq1"
R5
→ L3 maximum
```

until intentionally changed for a specific capability.

---

# 44. Autonomy Promotion Principle

> **Autonomy is promoted only after demonstrated reliability.**

Default progression:

```text id="v5lggi"
L0
 ↓
L1
 ↓
L2
 ↓
L3
 ↓
L4
```

Skipping levels MAY be justified for trivial/low-risk capabilities, but should not be the norm for consequential mutation.

---

# 45. Promotion Is Not Time-Based

A capability does not become autonomous simply because:

```text id="qfszjc"
it has existed for 30 days
```

Promotion requires evidence.

---

# 46. Promotion Evidence

Useful evidence includes:

```text id="xsduus"
eval pass rate
tool success rate
verification success
human approval rate
human correction rate
false-positive rate
false-negative rate
incident history
reconciliation rate
retry behavior
cost stability
latency reliability
policy violations
```

---

# 47. Human Approval Rate

For L2 → L3 or L3 → L4 consideration:

```text id="q1lx6c"
how often did humans accept the proposed action unchanged?
```

is useful.

But high approval rate alone is not sufficient.

---

# 48. Correction Rate

Track:

```text id="s0925w"
approved as-is
approved after edit
rejected
```

A high edit rate means preparation quality may not justify promotion.

---

# 49. Execution Reliability

For mutation autonomy, evidence SHOULD include:

```text id="0wbjex"
tool success
postcondition verified
duplicate prevention
failure recovery
provider reliability
```

Recommendation accuracy alone cannot justify autonomous execution.

---

# 50. Verification Reliability

A capability SHOULD NOT receive L4 if the system cannot reliably determine whether execution succeeded.

Principle:

> **Unverifiable mutation is a poor candidate for high autonomy.**

---

# 51. Evidence Quality

Promotion evidence must itself be trustworthy.

Synthetic happy-path demos are not sufficient for high-risk production autonomy.

---

# 52. Representative Evaluation

Evidence SHOULD reflect realistic:

```text id="wvx6u4"
data
failure modes
edge cases
environment
volume
```

before production L4.

---

# 53. Promotion Requires Stable Boundaries

Capability SHOULD NOT be promoted if:

```text id="0585f8"
tool contract unstable
permission semantics changing
verification incomplete
provider degraded
business rules unclear
```

---

# 54. L0 → L1 Promotion

Requires confidence that the system can:

```text id="m1bv6y"
observe correct facts
interpret them reasonably
link evidence
express uncertainty
```

No execution capability required.

---

# 55. L1 → L2 Promotion

Requires confidence that recommendations can be translated into useful concrete preparation.

Evidence SHOULD show:

```text id="tsnyf0"
high relevance
low material correction rate
correct targets
correct parameters
```

---

# 56. L2 → L3 Promotion

Requires:

```text id="pfnvq3"
reliable preparation
clear approval UX
explicit capability permission
safe execution path
verification
audit/evidence
failure behavior
```

At this level real side effects begin.

---

# 57. L3 → L4 Promotion

This is the most important promotion.

It SHOULD require:

```text id="kl6wp7"
stable command/tool contract
stable policy
sufficient successful approved executions
low correction/rejection rate
reliable verification
known failure handling
idempotency where needed
bounded blast radius
observability
kill/disable mechanism
accountable owner
```

---

# 58. Promotion Decision Owner

AI MAY recommend promotion.

AI MUST NOT grant itself higher autonomy.

Autonomy promotion requires an authoritative governance decision.

Currently:

```text id="xd86f4"
Rizky
```

is the ultimate authority for material production autonomy promotion.

---

# 59. Promotion Granularity

Promote:

```text id="6jku3i"
capability
+
scope
+
environment
```

not entire agent.

Example:

```text id="tydmg0"
social.content.publish
TeeStock Instagram
PRODUCTION
L3 → L4
```

without affecting other social accounts.

---

# 60. Autonomy Demotion

Autonomy MUST be able to move downward.

Examples:

```text id="9dbpje"
L4 → L3
L3 → L2
L2 → L0
```

Demotion can occur immediately when safety or reliability requires it.

---

# 61. Demotion Triggers

Possible triggers include:

```text id="hba1mh"
incident
verification failure
unexpected external effect
increased rejection rate
provider behavior change
tool degradation
policy violation
security incident
data drift
model regression
business-process change
increased blast radius
```

---

# 62. Automatic Demotion Direction

Future policy MAY support automatic demotion.

Example:

```text id="vjvvyh"
verification failure rate > threshold
→ L4 suspended
→ fallback L3
```

This is preferable to continuing autonomous execution blindly.

---

# 63. Tool Health Can Lower Autonomy

A tool marked:

```text id="vs2duo"
DEGRADED
```

may cause:

```text id="8a92fo"
L4 → L3
```

or:

```text id="kwq33h"
mutation disabled
```

without changing the principal's permanent capability permissions.

---

# 64. Model Regression Can Lower Autonomy

If an AI model change causes:

```text id="x915k6"
lower recommendation quality
more malformed tool inputs
higher correction rate
```

autonomy MAY be demoted until re-evaluated.

---

# 65. Business Rule Change Can Invalidate Autonomy Evidence

If the underlying business process materially changes:

```text id="my0bio"
old evidence
```

may no longer justify current autonomy.

Example:

```text id="wp0umj"
new pricing policy
new payment provider
new fulfillment workflow
```

requires reassessment.

---

# 66. Kill Switch

High-autonomy mutation capabilities SHOULD eventually support rapid disablement.

Conceptually:

```text id="us75mv"
GLOBAL:
disable all autonomous mutation

SYSTEM:
disable JARVIS mutation

DOMAIN:
disable finance mutation

CAPABILITY:
disable social.content.publish
```

---

# 67. Kill Switch Does Not Need to Stop Reads

Incident response SHOULD be granular.

Example:

```text id="bj0xl0"
disable all mutation
```

while preserving:

```text id="6lhjv5"
read
analysis
recommendation
```

when safe.

---

# 68. Suspension vs Revocation

Suspension:

```text id="7r2x4c"
temporary reduction
pending investigation
```

Revocation:

```text id="o0lcz5"
grant intentionally removed
```

Both should preserve historical evidence.

---

# 69. Autonomy History

Material autonomy changes SHOULD be auditable.

Future record SHOULD answer:

```text id="0ix76w"
which capability?
from what level?
to what level?
who approved?
why?
which evidence?
when?
which scope/environment?
```

---

# 70. Autonomy Grant Expiry

Temporary L4 grants MAY use:

```text id="i7dvyn"
expires_at
```

where appropriate.

After expiry, system falls back to the configured lower level.

---

# 71. Autonomy Policy Representation

Future conceptual record:

```yaml id="698sjq"
principal: jarvis-content-agent
capability: social.content.publish
organization: multigraph-group
brand: teestock
environment: production

autonomy_level: L4
max_risk: R3

constraints:
  max_actions_per_day: 3
  approved_content_classes:
    - educational
    - evergreen
  prohibited_topics:
    - legal
    - crisis
    - financial

verification_required: true
enabled: true
```

Exact storage is future implementation.

---

# 72. Autonomy and Scheduled Work

A schedule only triggers evaluation.

Example:

```text id="q6mhin"
09:00
→ publish scheduled content
```

still requires:

```text id="om6u6y"
valid L4 grant
policy satisfied
tool healthy
content still valid
```

---

# 73. Autonomy and Event-Driven Work

Event-triggered execution follows the same rule.

```text id="47ff8q"
payment.overdue
↓
JARVIS
```

does not automatically mean:

```text id="5cjm9y"
send customer demand
```

unless the relevant communication capability has adequate autonomy.

---

# 74. Autonomy and Bulk Actions

L4 for single-item operation MUST NOT automatically apply to bulk operation.

Example:

```text id="c4pc1v"
send individual routine reminder
→ L4
```

does not imply:

```text id="8arv9r"
send reminder to all overdue customers
→ L4
```

Bulk scope requires its own grant/evaluation.

---

# 75. Autonomy and Recurring Actions

Recurring automation amplifies errors.

Therefore:

```text id="7yb4ro"
frequency
volume
duplicate prevention
quiet hours
```

must be part of policy for recurring L4 workflows.

---

# 76. Autonomy and External Communication

External communication becomes a real-world side effect.

Recommended progression:

```text id="xg3ppx"
L1
recommend message

L2
draft message

L3
send after approval

L4
send automatically under narrow policy
```

---

# 77. Autonomy and Finance

Recommended progression:

```text id="8lfoyw"
L0
observe finance

L1
recommend action

L2
prepare reconciliation/payment action

L3
execute approved financial command

L4
only if explicitly permitted by future governance
```

Some financial capabilities may remain permanently at L3.

---

# 78. Autonomy and Procurement

Example progression:

```text id="vp5054"
compare vendors
→ L1/L2

prepare PO
→ L2

issue PO after approval
→ L3

auto-issue low-value routine PO
→ possible future L4 within threshold
```

---

# 79. Autonomy and Inventory

Examples:

```text id="jh8k2m"
inventory.read
→ L4

inventory.reserve for validated retail checkout
→ potentially L4

stock adjustment
→ typically L3

large adjustment
→ L3 with stronger approval
```

---

# 80. Autonomy and Production

Examples:

```text id="u539m5"
detect delayed job
→ L4 observation

recommend vendor reassignment
→ L1

prepare reassignment
→ L2

execute approved reassignment
→ L3

routine automated routing
→ possible L4 only after strong evidence
```

---

# 81. Autonomy and Engineering

Engineering-agent autonomy follows the same general principles but remains subject to its own control plane.

Examples:

```text id="idtn4x"
run local tests
→ high autonomy possible

prepare PR
→ high autonomy possible

merge
→ depends governance

production deploy
→ normally approval-gated
```

Engineering permission matrix remains authoritative for engineering roles.

---

# 82. Autonomy and Direct Production Database Work

No autonomy level grants a prohibited action.

If engineering governance says:

```text id="d6c07e"
direct production DB mutation
→ PROHIBITED
```

then:

```text id="t7d0m0"
L4
```

cannot make it allowed.

---

# 83. L4 Must Still Respect Human Accountability

Autonomous execution does not erase accountable ownership.

Every material L4 workflow SHOULD have a human accountable owner.

Example:

```text id="1wyh1m"
Capability:
social.content.publish

Autonomy:
L4

Accountable owner:
Rizky / designated future marketing owner
```

---

# 84. Founder-by-Exception Model

Higher autonomy exists to move routine work toward:

```text id="tgm1oy"
SYSTEM HANDLES NORMAL
        ↓
FOUNDER HANDLES EXCEPTION
```

not to remove human accountability entirely.

---

# 85. Exception Escalation

L4 workflow MUST know when to stop being autonomous.

Example outcomes:

```text id="myqiti"
NEEDS_HUMAN
POLICY_DENIED
AMBIGUOUS
VERIFICATION_FAILED
OUT_OF_SCOPE
RISK_ESCALATED
TOOL_DEGRADED
```

Escalation is successful safe behavior.

---

# 86. Autonomy Does Not Require Forced Completion

A mature autonomous system may decide:

```text id="a5ssde"
I do not have enough confidence/evidence/authority.
```

and escalate.

Forced execution is not the goal.

---

# 87. Uncertainty Boundary

When material uncertainty exceeds policy:

```text id="ryeib2"
L4 execution
```

must fall back to:

```text id="d5wloy"
L3 / L2 / NEEDS_HUMAN
```

depending on situation.

---

# 88. Risk Escalation Boundary

If runtime context raises effective risk above the autonomy grant's ceiling:

```text id="36a3o9"
do not execute automatically
```

Example:

```text id="k8j67d"
Routine external message
Baseline R3
L4 allowed

but content becomes legal dispute communication
Effective R4
→ fall back to approval
```

---

# 89. Parameter Drift

Prepared/approved action must be re-evaluated if material state changes before execution.

Example:

```text id="dqwsoc"
approved PO
```

but before execution:

```text id="ji9e3m"
vendor price changed
quantity changed
vendor suspended
```

Old autonomy/approval decision may no longer apply.

---

# 90. Freshness Requirement

Autonomous execution SHOULD use sufficiently fresh authoritative data.

Stale evidence may require fallback.

Example:

```text id="rayk3i"
inventory availability
```

must be revalidated before reservation.

---

# 91. Autonomy and Cache

Cached context can aid reasoning.

Consequential L4 execution SHOULD revalidate critical current facts rather than rely on stale cache alone.

---

# 92. Autonomy and Memory

Memory may guide:

```text id="a5y23l"
preferences
style
past decisions
```

It MUST NOT silently grant higher autonomy or override policy.

---

# 93. Preference Cannot Grant Autonomy

Memory like:

```text id="xa6mne"
"Rizky biasanya approve post seperti ini."
```

does not mean:

```text id="dzo010"
content.publish automatically becomes L4
```

Promotion requires governance decision.

---

# 94. Autonomy and Skills

Skill contract MAY specify:

```text id="rsdbgl"
supported autonomy ceiling
human confirmation requirement
```

but runtime policy remains authoritative.

A skill cannot grant itself L4.

---

# 95. Autonomy and Tools

Tool Registry SHOULD eventually expose:

```text id="3p0fr7"
mutation
baseline risk
verification support
autonomy ceiling
health
```

Tools without reliable verification may have lower maximum autonomy.

---

# 96. Tool Availability

If required tool becomes unavailable:

```text id="cgom7o"
autonomy pauses
```

The agent MUST NOT substitute an unapproved bypass mechanism.

---

# 97. Tool Replacement

Changing provider implementation does not automatically preserve autonomy certification.

If behavior materially changes:

```text id="qtmkcr"
re-evaluate tool
```

before restoring previous L4 grant.

---

# 98. Model Replacement

Replacing model provider/version MAY require autonomy re-evaluation if reasoning quality affects the capability.

Read-only deterministic tool routing may need less reevaluation than judgment-heavy preparation.

---

# 99. Model Independence Does Not Mean Evaluation Independence

Provider replaceability is architectural.

Autonomy still requires evidence that the replacement behaves within required quality bounds.

---

# 100. Shadow Mode

Before high autonomy, system MAY run in:

```text id="ak3j85"
SHADOW
```

where it independently decides what it would have done without causing actual side effects.

Compare:

```text id="jpifsk"
AI proposed action
vs
human actual action
```

---

# 101. Shadow Mode Does Not Equal L4

Shadow is an evaluation mode.

No real-world mutation occurs.

It supports promotion evidence.

---

# 102. Canary Autonomy

Future high-volume capability MAY be promoted through limited:

```text id="w4i0hu"
CANARY
```

scope.

Example:

```text id="9z53pp"
5% of eligible routine cases
```

before broad L4.

---

# 103. Canary Scope Must Be Explicit

Canary may be limited by:

```text id="o2fvu2"
brand
customer subset
volume
time
value
workflow class
```

---

# 104. Autonomy Promotion Lifecycle

Canonical lifecycle:

```text id="9mrci5"
UNASSESSED
    ↓
L0
    ↓
L1
    ↓
L2
    ↓
L3
    ↓
L4

At any point:
↓
SUSPENDED
↓
DEMOTED / REVOKED
```

---

# 105. No Requirement to Reach L4

Success does not mean every capability reaches L4.

A healthy steady state can be:

```text id="ldga0s"
R5 financial capability
→ permanently L3

R1 reporting
→ L4

R3 routine notification
→ L4

R4 strategic customer commitment
→ permanently L3
```

---

# 106. Autonomy Ceiling

Each capability MAY have governance-defined:

```text id="jnhrg9"
maximum_autonomy
```

Example:

```text id="8nrwko"
mgbos.payment.record
max_autonomy: L3
```

This prevents accidental promotion beyond accepted governance.

---

# 107. Default New Capability Level

New capability SHOULD begin at the lowest practical autonomy level.

Read tools may begin:

```text id="wj3802"
L0/L1
```

New mutation tools usually begin:

```text id="384vz0"
L2 or L3
```

depending on architecture and testing.

Not L4 by default.

---

# 108. Existing Deterministic Automation

Not all L4 execution needs AI.

A deterministic workflow may be L4.

Example:

```text id="pd7k83"
create routine internal alert
when inventory threshold crossed
```

Autonomy classification applies to system behavior, not only LLM-driven behavior.

---

# 109. Autonomy vs Determinism

A deterministic system can have:

```text id="0m3jay"
high autonomy
```

with low reasoning complexity.

An AI system can have:

```text id="a9fkpl"
low autonomy
```

despite sophisticated intelligence.

These are separate axes.

---

# 110. Autonomy vs Intelligence

Smarter model:

```text id="wn6od5"
≠
more authority
```

Autonomy is granted through governance and evidence.

---

# 111. Autonomy vs Confidence

Model confidence:

```text id="ry0w6v"
0.99
```

does not equal:

```text id="327c8u"
L4
```

Confidence may be one signal.

It is never the authority source.

---

# 112. Autonomy vs Cost

Lower operating cost does not justify higher autonomy.

Higher autonomy should be based on:

```text id="g68opy"
correctness
reliability
recoverability
policy compliance
business value
```

---

# 113. Autonomy vs Speed

Human approval introducing latency may motivate automation.

But speed alone is not sufficient reason for promotion.

---

# 114. Autonomy and Business Continuity

If JARVIS autonomy is disabled:

```text id="z4l43w"
MGBOS business operations must continue
```

through human/manual paths.

Autonomy is leverage.

Not a single point of business survival.

---

# 115. Autonomy Fallback Chain

Preferred future fallback:

```text id="c8ikst"
L4 automatic execution unavailable
          ↓
L3 request approval
          ↓
L2 prepare manually reviewable action
          ↓
L1 recommendation
          ↓
L0 observation
```

Capability should degrade gracefully where practical.

---

# 116. Example — Morning Briefing

Capability:

```text id="tu33zz"
mgbos.finance.summary.read
mgbos.operations.summary.read
```

Risk:

```text id="wkxn47"
R1
```

Target autonomy:

```text id="kqph7o"
L4
```

JARVIS may read automatically and synthesize briefing.

No mutation occurs.

---

# 117. Example — Lead Qualification

Potential progression:

```text id="m9c27y"
L0
observe lead

L1
recommend qualified/not qualified

L2
prepare qualification result

L3
apply after approval

L4
apply automatically
only when deterministic criteria and confidence policy support it
```

Business command still validates.

---

# 118. Example — Customer Follow-Up

```text id="bb7pbr"
L1
recommend follow-up

L2
draft follow-up

L3
send after approval

L4
send routine reminder automatically
within approved template/timing/frequency policy
```

---

# 119. Example — Vendor Selection

```text id="zncrfb"
L1
rank vendor options

L2
prepare assignment

L3
assign after approval

L4
routine routing
only within approved vendor pool,
capacity,
cost,
and risk limits
```

---

# 120. Example — Payment

```text id="bblabl"
L0
observe invoice/payment data

L1
recommend reconciliation

L2
prepare payment record

L3
record after explicit approval

L4
not granted by default
```

---

# 121. Example — Social Media

```text id="tglgkv"
L1
recommend content

L2
generate final post

L3
publish after approval

L4
publish approved content classes automatically
within frequency/brand/policy limits
```

---

# 122. Example — Engineering Release

```text id="6tsnyv"
L0
inspect status

L1
recommend release

L2
prepare release packet

L3
release after authorization

L4
only for specifically governed low-risk release classes
if engineering policy permits
```

Current engineering control plane may impose stricter limits.

---

# 123. Approval Feedback as Evidence

At L3, Approval Center generates valuable learning data:

```text id="9xcrgp"
approved unchanged
approved with edits
rejected
deferred
```

This data supports future promotion decisions.

---

# 124. Rejection Reason

Where useful, rejected or edited proposals SHOULD capture structured reason.

Examples:

```text id="4dc7we"
wrong timing
wrong amount
wrong recipient
insufficient evidence
tone issue
strategy disagreement
policy violation
```

This helps improve capability quality.

---

# 125. Outcome Feedback

Approval quality alone is insufficient.

System SHOULD eventually measure actual outcomes.

Example:

```text id="rcvkfj"
message approved
sent correctly
but caused high complaint rate
```

may indicate L4 is inappropriate despite high approval rate.

---

# 126. Autonomy Metrics

Useful future metrics include:

```text id="mchrn6"
approval rate
unchanged approval rate
correction rate
rejection rate
execution success rate
verification pass rate
incident rate
reconciliation rate
fallback rate
human intervention rate
cost per successful action
```

---

# 127. Metrics Must Be Capability-Specific

Global metric like:

```text id="pvmkbk"
"JARVIS accuracy = 97%"
```

is insufficient.

Need:

```text id="xm46fi"
capability-specific reliability
```

because different actions have different consequences.

---

# 128. Promotion Evidence Window

Autonomy promotion SHOULD use a meaningful sample of recent representative cases.

Old historical success should not dominate after:

```text id="j5n3it"
model change
tool change
policy change
business change
```

---

# 129. Autonomy Review Trigger

Review autonomy when:

```text id="6i7mny"
risk class changes
tool implementation changes
model changes materially
policy changes
business process changes
scope expands
volume expands
incident occurs
verification degrades
new external consequence appears
```

---

# 130. High-Risk Promotion Review

R4/R5 promotion SHOULD require explicit documented rationale.

Promotion should not happen silently through configuration drift.

---

# 131. Audit of Automatic Actions

L4 actions SHOULD remain inspectable after execution.

Evidence should answer:

```text id="o3hz0r"
why was it eligible for automatic execution?
which policy matched?
which autonomy grant?
which capability?
what risk?
what happened?
what was verified?
```

---

# 132. Explainability of Eligibility

System SHOULD be able to state:

```text id="jj5ykw"
Executed automatically because:

capability = X
autonomy = L4
risk = R2
scope = TeeStock
amount < threshold
tool healthy
verification available
policy version = Y
```

This is more useful than:

```text id="paxnya"
"AI decided to do it."
```

---

# 133. Policy Version

Autonomous execution SHOULD eventually record which policy version authorized it.

This supports historical audit after policies change.

---

# 134. Autonomy Does Not Replace Approval Policy

L3 explicitly depends on Approval Policy.

L4 depends on policy conditions proving per-action approval is unnecessary within the bounded grant.

Detailed approver requirements belong to the next canonical governance document.

---

# 135. Autonomy Does Not Replace Permission Model

A capability grant remains required.

Autonomy only determines how independently it can be exercised.

---

# 136. Autonomy Does Not Replace Risk Model

Risk determines consequence.

Autonomy determines execution independence.

Keep both recorded.

---

# 137. Autonomy Does Not Replace Tool Policy

A principal may have L4 but tool may be:

```text id="ggcb8q"
DISABLED
```

Execution stops.

---

# 138. Autonomy Does Not Override Data Governance

L4 does not permit data to be sent to an external model/provider if data policy prohibits it.

---

# 139. Autonomy Does Not Override Quiet Hours

Future communication policy may prohibit automatic customer messaging at certain times.

L4 remains constrained by those policies.

---

# 140. Autonomy Does Not Override Rate Limits

L4 workflow must respect:

```text id="q7b31w"
frequency
volume
provider rate
business policy
```

---

# 141. Autonomy Does Not Override Budget

Future AI/automation budget controls may suspend an otherwise valid L4 workflow.

Autonomy is one permission dimension among several runtime controls.

---

# 142. Autonomy Conflict Resolution

If multiple policies disagree:

```text id="fa60n9"
use most restrictive applicable autonomy
```

until authority conflict is resolved.

Example:

```text id="lpf5ih"
Capability grant L4
Risk policy max L3
→ effective L3
```

---

# 143. Missing Autonomy Policy

If no autonomy grant exists:

```text id="yakz77"
default to lowest safe behavior
```

typically:

```text id="mh4b7i"
L0/L1
```

for reads/recommendations,

or no mutation execution for write capabilities.

---

# 144. Autonomy Cannot Be Inferred From Past Behavior

If someone manually allowed an action several times, the system MUST NOT infer:

```text id="ju4a44"
"therefore future executions are L4"
```

Promotion must be explicit.

---

# 145. Explicit Promotion

Canonical promotion should identify:

```text id="zl15pg"
principal
capability
old level
new level
scope
environment
risk ceiling
constraints
owner
evidence
effective date
```

---

# 146. Explicit Demotion

Demotion should identify:

```text id="kzcku8"
reason
incident/evidence
new level
scope
effective time
```

Emergency demotion may occur immediately.

Documentation can follow as evidence.

---

# 147. Autonomy Registry Direction

Future canonical runtime registry may contain:

```text id="v6ow9c"
principal
capability
scope
environment
level
constraints
max risk
approval policy
verification policy
status
effective_from
expires_at
```

Exact implementation should remain simple until real L3/L4 mutation begins.

---

# 148. Do Not Build a Complex Autonomy Engine Yet

Current JARVIS first slice is read-only.

Therefore we do NOT need immediately:

```text id="ysn488"
dynamic policy DSL
autonomy database
complex promotion service
real-time adaptive permissions
```

Initially, autonomy contracts may be static/configuration-driven.

---

# 149. JARVIS v0.2 Compatibility

Current JARVIS v0.2 design is:

```text id="918ygo"
read-only
evidence-first
human-governed
```

Therefore its initial autonomy effectively lives within:

```text id="atb43v"
L0–L2
```

for recommendations/preparation,

with read capabilities potentially operating automatically.

Mutation capability is intentionally absent.

---

# 150. First Production Autonomy Target

Recommended first production L4 target:

```text id="ogqtb1"
authorized read-only briefing capabilities
```

not money mutation.

This proves:

```text id="izcdzq"
runtime stability
tool routing
permission
evidence
verification
observability
```

before consequential autonomy.

---

# 151. Autonomy Maturity Path

Ecosystem progression:

```text id="3ubp4l"
OBSERVE
   ↓
TRUST RECOMMENDATIONS
   ↓
TRUST PREPARATION
   ↓
TRUST APPROVED EXECUTION
   ↓
TRUST BOUNDED AUTOMATIC EXECUTION
```

This is organizational trust backed by evidence.

Not marketing terminology.

---

# 152. Anti-Patterns

```text id="xix115"
"Make JARVIS fully autonomous."

"Give CFO Agent L4."

"AI has been good lately, let it execute everything."

"Founder approved similar action yesterday, so no approval needed."

"Tool exists, therefore it can run automatically."

"Low model temperature means safe L4."

"R1 means automatically L4."

"L4 means skip verification."

"Autonomous means never ask human."

"One successful demo is enough for production autonomy."
```

All violate this specification.

---

# 153. Canonical Level Summary

| Level | System May | Consequential Execution |
|---|---|---|
| L0 | Observe | No |
| L1 | Recommend | No |
| L2 | Prepare | No consequential side effect |
| L3 | Execute after required approval | Yes |
| L4 | Execute automatically within policy | Yes |

---

# 154. Relationship to Risk

Example matrix:

| Capability | Risk | Autonomy Example |
|---|---:|---:|
| Business summary read | R1 | L4 |
| Customer-message draft | R2 | L2/L4 preparation |
| Customer message send | R3 | L3 → possibly L4 |
| Production reassignment | R3/R4 | L3 |
| Production deploy | R4 | L3 |
| Payment record | R5 | L3 |
| Payment read | R1 | L4 |

There is intentionally no universal risk-to-autonomy one-to-one mapping.

---

# 155. Canonical Execution Formula

Automatic execution is allowed only when:

```text id="0vxt7f"
Principal Authorized
AND
Capability Authorized
AND
Scope Matches
AND
Environment Matches
AND
Effective Risk <= Autonomy Risk Ceiling
AND
Autonomy Level = L4
AND
Policy Conditions Pass
AND
Tool Healthy
AND
Current State Valid
AND
Business Invariants Pass
```

L3 replaces automatic execution with valid approval evidence.

---

# 156. Architectural Invariants

1. Autonomy belongs to capabilities, not agents globally.
2. Autonomy grants are scope-specific.
3. Autonomy grants are environment-specific.
4. Permission is prerequisite to execution.
5. Risk and autonomy remain separate axes.
6. Higher autonomy never bypasses business invariants.
7. L0 observes.
8. L1 recommends.
9. L2 prepares without consequential side effect.
10. L3 executes only after required approval.
11. L4 executes automatically only within explicit policy.
12. L4 is bounded, not unlimited.
13. New consequential capabilities do not start at L4 by default.
14. Promotion requires evidence.
15. AI cannot promote itself.
16. Human approval history does not implicitly create L4.
17. High approval rate alone is insufficient for L4.
18. Verification reliability is required for high autonomy.
19. Autonomy can be demoted immediately.
20. Tool/model/policy changes may invalidate prior autonomy evidence.
21. Runtime risk escalation can force fallback to a lower autonomy level.
22. Missing policy defaults toward lower autonomy.
23. Prohibited actions remain prohibited at every autonomy level.
24. L4 actions remain auditable.
25. Business must continue when autonomy is disabled.

---

# 157. Relationship to Other Governance

```text id="c71cj2"
Permission Model
→ CAN this principal use the capability?

Risk Classification
→ HOW CONSEQUENTIAL is the capability/action?

Autonomy Level
→ HOW INDEPENDENTLY may it act?

Approval Policy
→ WHO must approve a specific L3/high-risk action?

Evidence
→ WHAT proves it worked?

Kill Switch
→ HOW can execution be stopped quickly?
```

---

# 158. Canonicalization Effect

Before this document, autonomy semantics lived primarily in:

```text id="0o0xt8"
JARVIS Architecture v0.1
Governance & Operations Blueprint
JARVIS v0.2 design notes
```

After activation:

```text id="dk9wzi"
docs.governance.autonomy-levels
```

becomes canonical semantic owner for L0–L4.

Historical notes become provenance.

---

# 159. North Star

A mature system should be able to answer before every autonomous action:

```text id="t22l2q"
Which principal is acting?

Which capability?

What risk?

What autonomy level?

For which business and environment?

What constraints apply?

Why is this action eligible for automatic execution?

What will happen if verification fails?

Can the capability be disabled immediately?

Which human remains accountable?
```

---

# 160. Final Principle

> **Autonomy is not the absence of control.  
> Autonomy is execution inside proven, explicit, observable boundaries.**

The goal is not to make JARVIS independent from Rizky.

The goal is to make routine work increasingly independent from **manual intervention**, while strategic authority, accountability, and control remain explicit.