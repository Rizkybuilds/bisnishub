---
canonical_id: jarvis.architecture.command-center-decision-experience
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: jarvis
document_class: canonical-specification
effective_from: 2026-09-30
authoritative_for:
  - jarvis command center semantics
  - jarvis founder decision experience
  - jarvis decision inbox
  - jarvis approval experience
  - jarvis exception queue
  - jarvis incident presentation
  - jarvis recovery item presentation
  - jarvis learning candidate presentation
  - jarvis morning briefing presentation
  - jarvis health overview
  - jarvis FinOps overview
  - jarvis workflow status surfaces
  - jarvis notification tiers
  - jarvis attention routing
  - jarvis priority presentation
  - jarvis evidence drill-down
  - jarvis ownership and escalation presentation
  - jarvis multi-business command view
  - jarvis founder-by-exception interaction model
last_reviewed: 2026-09-30
review_cadence: quarterly
depends_on:
  - ../charter.md
  - ../architecture.md
  - ../core-runtime.md
  - event-proactive-intelligence.md
  - execution-verification-recovery.md
  - observability-audit-incident.md
  - security-secrets-environment.md
  - data-privacy-retention.md
  - ai-evaluation-regression-autonomy-promotion.md
  - cost-resource-finops.md
  - lifecycle-versioning-deprecation.md
  - feedback-learning-continuous-improvement.md
  - ../../../../docs/governance/cross-system-risk-classification.md
  - ../../../../docs/governance/autonomy-levels.md
  - ../../../../docs/governance/approval-policy.md
  - ../../../../docs/governance/evidence-provenance-model.md
  - human-accountability-ownership-operating-model.md
supersedes: null
implementation_status: NOT_IMPLEMENTED
target_runtime_location: systems/jarvis/
first_vertical_slice:
  - business.morning_briefing
---

# JARVIS Command Center & Decision Experience Architecture v1.0

## 1. Purpose

Command Center adalah human-facing control surface untuk mengubah kompleksitas operasional menjadi:

```text
a few clear decisions
```

bukan sekadar menampilkan data.

Ia menjawab:

```text
Apa yang perlu gue tahu?

Apa yang berubah?

Apa yang butuh keputusan gue?

Apa yang bisa sistem tangani sendiri?

Apa yang sedang rusak?

Apa yang sedang dipulihkan?

Apa yang akan terjadi kalau gue tidak bertindak?

Apa evidence-nya?

Siapa owner-nya?

Apa yang perlu di-ACC sekarang?
```

---

# 2. Golden Principle

> **Command Center optimizes human attention, not dashboard density.**

---

# 3. Second Golden Principle

> **Every item shown should help a human understand, decide, supervise, or recover.**

---

# 4. Command Center Is Not a Dashboard Dump

The wrong interface:

```text
Revenue chart

CPU chart

Token chart

53 Agent statuses

143 logs

31 notifications

17 arbitrary AI scores
```

without decision relevance.

---

# 5. Desired Experience

```text
3 things need attention

2 decisions need approval

1 process is degraded

everything else is operating normally
```

---

# 6. Founder-by-Exception Interface

Canonical target:

```text
NORMAL
→ invisible

AUTOMATICALLY RECOVERABLE
→ handled

MATERIAL EXCEPTION
→ surfaced

DECISION REQUIRED
→ inbox

CRITICAL
→ interrupt
```

---

# 7. Command Center Is a Projection Layer

It does NOT own:

```text
business truth

permissions

risk rules

approvals

incident truth

audit truth

evidence truth

workflow state
```

It projects them.

---

# 8. Source Systems Remain Authoritative

Examples:

```text
MGBOS
→ business state

JARVIS Runtime
→ workflow/execution state

Approval Store
→ decision authority state

Incident Registry
→ incident state

Evidence Store
→ evidence

FinOps
→ AI runtime cost

Ownership Registry
→ accountable owner
```

---

# 9. UI Must Never Invent State

If Command Center cannot determine status:

```text
UNKNOWN
```

is preferable to false certainty.

---

# 10. Primary Surfaces

Canonical initial information architecture:

```text
COMMAND CENTER
│
├── Home
├── Morning Briefing
├── Decision Inbox
├── Exceptions
├── Incidents & Recovery
├── Workflows
├── Systems
├── AI & Costs
├── Learning
└── History / Evidence
```

Not all surfaces must be implemented immediately.

---

# 11. Home

Home answers:

> **What deserves my attention right now?**

It is not a complete business BI dashboard.

---

# 12. Home Priority Order

Default conceptual ordering:

```text
critical incidents

high-impact decisions

blocked workflows

material exceptions

recovery items

expiring approvals

important findings

routine informational items
```

---

# 13. Home Must Stay Small

The first viewport should ideally communicate:

```text
business status

urgent decisions

critical exceptions

system degradation
```

without scrolling through dozens of widgets.

---

# 14. Home Summary

Example:

```text
Good Morning

Businesses
Mostly Normal

Decisions
2 awaiting you

Critical Incidents
0

Material Exceptions
3

Recovery Items
1

AI Spend
Normal
```

---

# 15. No False “All Good”

If required source is unavailable:

```text
Mostly Normal
1 source unavailable
```

is better than:

```text
All systems healthy.
```

---

# 16. Morning Briefing

Morning Briefing is the first true vertical slice.

Its job:

```text
summarize material business state

surface meaningful exceptions

suggest bounded next actions

attach evidence
```

---

# 17. Morning Briefing Is Not Daily Data Dump

Do not show:

```text
all invoices

all inventory

all orders

all GitHub runs
```

unless user drills down.

---

# 18. Canonical Briefing Structure

Initial:

```text
Morning Briefing

Top Priorities

Finance

Operations

Inventory

Engineering

Suggested Actions

Evidence
```

consistent with current Core Runtime design.

---

# 19. Briefing Information Unit

Every significant item should ideally answer:

```text
SIGNAL

MEANING

PRIORITY

NEXT ACTION

EVIDENCE
```

---

# 20. Finding Severity

Existing canonical direction remains:

```text
info

attention

important

critical
```

---

# 21. Severity Is Rule-Based

Model MUST NOT randomly decide:

```text
critical
```

because prose sounds dramatic.

---

# 22. Severity ≠ Risk

Example:

```text
critical production delay
```

is operational severity.

An action to resolve it may have:

```text
R2
```

or another risk class.

Keep distinct.

---

# 23. Severity ≠ Incident Severity

Finding severity and:

```text
SEV-1 / SEV-2 / ...
```

incident semantics remain separate.

---

# 24. Priority Model

Morning Briefing priority SHOULD use structured inputs such as:

```text
financial materiality

deadline pressure

operational impact

customer impact

risk
```

with qualitative AI interpretation on top.

---

# 25. No Opaque “AI Priority Score”

Do not show:

```text
Priority Score: 93.7
```

unless every factor has clear meaning.

---

# 26. Explain Priority

Useful:

```text
Important because:
- customer deadline tomorrow
- production job already one day late
- no confirmed finishing capacity
```

---

# 27. Decision Inbox

Decision Inbox contains items that genuinely require an authorized human decision.

---

# 28. Decision Inbox Is Not Notification Inbox

Informational alerts do not belong there.

---

# 29. Decision Item Families

Possible:

```text
APPROVAL

BUSINESS_EXCEPTION

BUDGET_EXCEPTION

RECOVERY_DECISION

INCIDENT_DECISION

LIFECYCLE_DECISION

POLICY_REVIEW
```

---

# 30. Learning Candidate Is Usually Not Immediate Decision

Most learning candidates belong in Learning.

Only material changes requiring owner approval become Decision Inbox items.

---

# 31. Decision Package

Every meaningful decision SHOULD arrive as a:

```text
Decision Package
```

rather than an isolated button.

---

# 32. Decision Package Must Answer

```text
What exactly am I deciding?

Why now?

What does JARVIS recommend?

What are the alternatives?

What happens if I approve?

What happens if I reject?

What happens if I do nothing?

What is the risk?

What evidence supports this?

Who owns the process?
```

---

# 33. Logical Decision Package

```ts
type DecisionPackage = {
  decisionId: string
  revision: number

  organizationId: string

  type: string

  title: string
  summary: string

  processOwnerId: string

  requestedBy?: string

  recommendedAction?: ProposedAction

  alternatives?: DecisionAlternative[]

  riskClass?: RiskLevel
  autonomyLevel?: AutonomyLevel

  consequenceSummary: string

  deadline?: string
  expiresAt?: string

  evidenceIds: string[]

  costImpact?: CostImpact

  approvalPolicyRef?: string

  createdAt: string

  status: DecisionStatus
}
```

---

# 34. Decision Revision

Every material edit increments:

```text
revision
```

or generates equivalent immutable revision identity.

---

# 35. Approval Binds Exact Revision

Canonical:

```text
Approve Decision D-184 revision 3
```

not:

```text
Approve whatever this decision later becomes.
```

---

# 36. Material Edit Invalidates Old Approval

If target, amount, action, risk, recipient, or other material payload changes:

```text
re-approval
```

is required.

---

# 37. Decision Status

Canonical direction:

```text
PROPOSED

AWAITING_DECISION

APPROVED

REJECTED

DEFERRED

EXPIRED

SUPERSEDED

CANCELED
```

---

# 38. Decision Status ≠ Execution Status

An APPROVED decision may later have execution:

```text
PENDING

SUCCEEDED

FAILED

UNKNOWN.
```

---

# 39. Approved ≠ Executed

UI must never show:

```text
Payment complete
```

merely because human approved payment execution.

---

# 40. Approved + Execution State

Example:

```text
Decision
APPROVED

Execution
UNKNOWN

Reconciliation
IN PROGRESS
```

---

# 41. Decision Actions

Baseline:

```text
APPROVE

EDIT

REJECT

DEFER
```

and where appropriate:

```text
DISMISS
```

for non-action findings.

---

# 42. EDIT

Edit is not silent payload mutation.

It creates a new proposal/revision.

---

# 43. REJECT

Reject blocks current proposal.

Optional feedback reason may follow.

---

# 44. DEFER

Human intentionally postpones a decision.

---

# 45. Deferred Items Need Return Condition

Prefer:

```text
return tomorrow

return before deadline

return when evidence changes
```

rather than indefinite disappearance.

---

# 46. DISMISS

Used for:

```text
finding

recommendation

notification
```

that does not need action.

Not appropriate for every approval request.

---

# 47. Dismiss ≠ Resolve

Dismissed finding may still represent true state.

---

# 48. Already Handled

Useful action:

```text
ALREADY_HANDLED
```

for proactive findings.

This becomes feedback.

---

# 49. Decision Card Summary

Collapsed card SHOULD show only:

```text
title

business

why now

impact

risk

deadline

recommended action
```

---

# 50. Drill-Down

Detailed view reveals:

```text
full rationale

payload

alternatives

evidence

audit context

history

owner

execution plan
```

---

# 51. Progressive Disclosure

Default UI:

```text
small amount of decision-ready information
```

with deeper information on demand.

---

# 52. Evidence-First Decision UX

Each material claim must allow drill-down to supporting evidence.

---

# 53. Evidence Presentation

Prefer human-readable:

```text
Invoice INV-104
Outstanding Rp8.200.000
Due 2 days ago

Source: MGBOS
Observed: 07:14
```

over raw JSON by default.

---

# 54. Raw Evidence Remains Available

Technical/audit users may inspect original evidence where authorized.

---

# 55. Evidence Freshness

UI should make stale evidence visible.

Example:

```text
Last verified 6 hours ago
```

---

# 56. Stale Critical Evidence

For consequential decisions, system SHOULD refresh before approval/execution where required.

---

# 57. Evidence Conflict

If sources disagree:

```text
CONFLICTING EVIDENCE
```

must be visible.

---

# 58. Never Hide Missing Evidence

Use:

```text
Evidence unavailable
```

instead of omitting the issue.

---

# 59. Recommended Action

Recommendation is advisory.

Human sees:

```text
JARVIS recommends
```

not:

```text
System decision
```

unless deterministic policy itself made an approved automated decision.

---

# 60. Recommendation Rationale

Keep concise:

```text
why this action

why now

why this option.
```

---

# 61. Alternatives

For material decisions, show viable alternatives when they meaningfully exist.

---

# 62. Avoid Fake Choices

Do not generate three artificial alternatives merely to look sophisticated.

---

# 63. Consequence of Inaction

Important field:

```text
If no action:
shipment likely misses tomorrow's dispatch window.
```

---

# 64. Consequence Is Not Fear Language

Keep factual and evidence-based.

---

# 65. Decision Deadline

Display absolute time/date when material.

---

# 66. Expiry

Approval may expire if:

```text
state changes

deadline passes

evidence becomes stale

policy requires fresh approval.
```

---

# 67. Decision Queue Ordering

Ordering SHOULD consider:

```text
severity

deadline

business impact

blocked work

risk

customer impact

age
```

---

# 68. Queue Ordering Must Be Explainable

System should answer:

```text
Why is this above that item?
```

---

# 69. Risk Does Not Automatically Mean Top Priority

A high-risk action with no urgency may rank below a current severe incident.

---

# 70. Urgent Does Not Mean Authorized

Priority ranking cannot bypass approval/security.

---

# 71. Exceptions

Exception Queue contains workflow/business states requiring non-standard attention.

---

# 72. Exception ≠ Incident

Example:

```text
customer requested unusual specification
```

may be exception.

Not system incident.

---

# 73. Exception ≠ Approval

Exception may require:

```text
manual investigation
```

without an approval decision.

---

# 74. Exception Contract

Useful fields:

```text
exception type

business

process

severity

owner

blocked state

evidence

next action

age.
```

---

# 75. Exception Ownership

Every exception should route to an accountable operational owner.

---

# 76. No Anonymous Exception Queue

Items must not accumulate with:

```text
Owner: nobody.
```

---

# 77. Exception Age

Old unresolved exceptions should become more visible.

---

# 78. Aging Is Not Automatic Criticality

A low-impact old item may remain low priority.

Use context.

---

# 79. Blocked Workflow

UI should surface:

```text
what is blocked

since when

why

who can unblock it.
```

---

# 80. Incident Surface

Incidents must show:

```text
severity

category

affected capability

business impact

owner

status

mitigation

latest update.
```

---

# 81. Incident Lifecycle

Display current state:

```text
DETECTED

TRIAGED

CONTAINED

RECOVERING

RESOLVED

REVIEWED
```

---

# 82. Incident Card

Collapsed:

```text
Payment reconciliation degraded

SEV-2

Finance

Contained

Owner: ...
```

---

# 83. Incident Drill-Down

May include:

```text
timeline

affected executions

evidence

containment

recovery

runbook

decision requests.
```

---

# 84. Incident Decisions

Critical incident may generate Decision Inbox items such as:

```text
activate global mutation kill switch?

switch provider?

restore database?

use break-glass?
```

---

# 85. Incident Status Is Not Alert Count

Do not show:

```text
28 alerts
```

when all represent one provider incident.

---

# 86. Recovery Items

Recovery Queue contains specific executions requiring reconciliation/repair.

---

# 87. Recovery Item Examples

```text
payment outcome UNKNOWN

message send uncertain

external provider timed out

workflow state inconsistent.
```

---

# 88. Recovery Card

Show:

```text
operation

affected entity

risk

current evidence

recommended reconciliation step

owner.
```

---

# 89. Recovery First, Retry Later

UI must not make:

```text
RETRY
```

the primary button for UNKNOWN consequential effects.

---

# 90. Reconciliation Action

Primary may be:

```text
CHECK PROVIDER STATE
```

or:

```text
RECONCILE
```

---

# 91. Workflows Surface

Shows operating workflows, not every individual log.

---

# 92. Workflow View

Useful:

```text
name

business

owner

lifecycle

health

current executions

last success

failure trend

autonomy

cost.
```

---

# 93. Workflow Health

Possible:

```text
HEALTHY

DEGRADED

UNAVAILABLE

UNKNOWN.
```

---

# 94. Workflow Health ≠ Execution Status

One execution may fail while overall workflow remains healthy.

---

# 95. Workflow Autonomy Visibility

Display current:

```text
L0–L4
```

where relevant.

---

# 96. Autonomy Tooltip / Detail

Explain what the level permits.

Do not expect operators to memorize numbers.

---

# 97. High-Autonomy Visibility

L4 workflows SHOULD make:

```text
kill switch

owner

recent incidents

evaluation status
```

easy to find.

---

# 98. Systems Surface

System overview shows operational dependencies:

```text
MGBOS

JARVIS

n8n

model providers

important Tool providers

storage/databases.
```

---

# 99. Systems View Is Operational

Not a giant infrastructure observability console.

---

# 100. Health Presentation

Example:

```text
MGBOS
Healthy

GitHub
Degraded

AI Primary Provider
Unavailable
Fallback active

n8n
Healthy
```

---

# 101. Partial Degradation

Do not collapse to one global:

```text
System healthy.
```

---

# 102. Capability-Oriented Health

Prefer:

```text
Morning Briefing
PARTIAL

Reason:
GitHub unavailable
```

when this matters more to the human.

---

# 103. Systems Drill-Down

Technical owner can inspect:

```text
latency

error rate

health checks

recent incidents

provider status

trace links.
```

---

# 104. AI & Costs Surface

Founder needs economics at decision level.

---

# 105. Initial FinOps View

Show:

```text
AI spend today

month-to-date

budget status

top workflows by spend

cost anomalies

cost per successful task.
```

---

# 106. No Token Vanity

Do not lead with:

```text
2.3M tokens consumed.
```

unless diagnostic context needs it.

---

# 107. Useful Cost Finding

```text
Content Generation cost/run increased 41%

Primary cause:
DEEP model escalation frequency doubled.
```

---

# 108. Cost Status

May surface:

```text
NORMAL

ELEVATED

ANOMALOUS

BUDGET_WARNING

BUDGET_EXCEEDED.
```

---

# 109. Budget Decision

Persistent/large budget exception may enter Decision Inbox.

---

# 110. Learning Surface

Learning should not spam ordinary business operations.

---

# 111. Learning View

Useful:

```text
recurring correction patterns

open learning candidates

recent improvements

eval result

release impact.
```

---

# 112. Learning Candidate Card

Show:

```text
problem

supporting pattern

affected component

proposed improvement

expected benefit

risk.
```

---

# 113. Founder Should Not Review Every Learning Candidate

Only:

```text
material

cross-business

policy-changing

high-impact
```

ones need founder attention.

---

# 114. History

History allows reconstruction of:

```text
decisions

approvals

executions

incidents

changes

feedback.
```

---

# 115. History Is Not Raw Log Viewer

Default presentation should remain human meaningful.

---

# 116. Audit Drill-Down

Technical/compliance users can follow:

```text
decision
→ approval
→ execution
→ verification
→ evidence.
```

---

# 117. Search

Command Center SHOULD eventually support search across authorized:

```text
decisions

entities

workflows

incidents

evidence.
```

---

# 118. Search Respects Scope

Search must not become cross-business data leakage.

---

# 119. Organization Context

Every Command Center item SHOULD preserve:

```text
organization/business
```

where applicable.

---

# 120. Group View

Founder can see:

```text
MultiGraph

TeeStock

future businesses
```

in one high-level surface.

---

# 121. Group View Is Aggregated Governance View

It does not erase tenant/business boundaries.

---

# 122. Group-Level Default

Prefer:

```text
business health

major exceptions

capital/risk decisions
```

instead of raw customer data across companies.

---

# 123. Business View

Allows drill-down into one business.

---

# 124. Cross-Business Comparison

May compare:

```text
operational health

AI spend

critical exceptions
```

where authorized.

---

# 125. Customer Data Minimization

Founder group view should rarely require full personal customer details.

---

# 126. My Inbox

As team grows, default becomes:

```text
items assigned to me
```

not every organization's decisions.

---

# 127. Founder Inbox

Eventually contains:

```text
strategic exceptions

capital

major risk

critical incidents

cross-business decisions.
```

---

# 128. Process Owner Inbox

Contains:

```text
routine exceptions

workflow approvals

operational decisions

performance issues.
```

---

# 129. Owner Routing

Use Ownership Registry.

Do not hardcode:

```text
all approvals → Rizky.
```

---

# 130. Escalation Routing

If primary owner fails to respond according to process:

```text
escalation path
```

determines next destination.

---

# 131. Notifications

Command Center is the canonical interaction surface.

Notifications bring attention back to it.

---

# 132. Notification Is Not Decision Authority

A push message saying:

```text
Payment awaiting approval
```

does not itself execute payment.

---

# 133. Notification Tiers

Canonical:

```text
N0 — IN_APP

N1 — DIGEST

N2 — DIRECT

N3 — INTERRUPT
```

---

# 134. N0 — IN_APP

Visible when user opens Command Center.

No active interruption.

---

# 135. N1 — DIGEST

Included in scheduled briefing/digest.

---

# 136. N2 — DIRECT

Direct notification because timely attention matters.

---

# 137. N3 — INTERRUPT

Reserved for critical conditions requiring immediate awareness.

---

# 138. Notification Tier ≠ Risk Class

`N3` is attention urgency.

`R5` is action consequence.

Keep separate.

---

# 139. Notification Tier ≠ Finding Severity

Related but not identical.

An important item may not need interruption if deadline is days away.

---

# 140. Critical Finding May Not Always Page

If already contained and owned:

```text
N2
```

may suffice.

---

# 141. Alert Fatigue Rule

If everything interrupts:

```text
nothing is effectively critical.
```

---

# 142. Notification Content

Minimize sensitive information.

Example lock screen:

```text
Finance decision requires attention
```

instead of:

```text
Customer X owes Rp82,400,000.
```

---

# 143. Notification Channels

Possible:

```text
in-app

push

email

WhatsApp
```

depending on integration and policy.

---

# 144. Secure Decision Surface

Consequential approvals SHOULD normally return the user to an authenticated Command Center.

---

# 145. Approval From Notification

May eventually be allowed only if:

```text
identity

payload binding

risk policy

channel security
```

are sufficient.

Not an initial requirement.

---

# 146. Voice

Voice MAY:

```text
read briefing

summarize decisions

prepare response.
```

---

# 147. Voice Approval

High-impact voice approval SHOULD NOT be assumed safe merely because a voice session exists.

Requires explicit authenticated approval architecture if ever supported.

---

# 148. Mobile Experience

Decision cards should work well on a phone because founder decisions may happen away from desktop.

---

# 149. Mobile Does Not Mean Less Evidence

Use progressive disclosure, not evidence removal.

---

# 150. Desktop Experience

Supports:

```text
broader comparison

workflow management

incident investigation

evidence detail.
```

---

# 151. One Decision, Multiple Surfaces

The same Decision Package may appear:

```text
mobile

desktop

notification

chat
```

while maintaining one canonical decision state.

---

# 152. Chat Integration

JARVIS conversation may say:

```text
2 decisions need your attention.
```

Then present/route to canonical packages.

---

# 153. Chat Approval

Can be supported if authenticated interaction binds exact Decision Package revision.

---

# 154. Natural Language Ambiguity

Message:

```text
oke
```

must not accidentally approve whichever high-risk decision happens to be nearby.

---

# 155. Explicit Binding

Consequential conversational approval needs identifiable target.

Example:

```text
Approve decision PAY-184 revision 2.
```

UI may hide complexity while backend preserves it.

---

# 156. Bulk Approval

Bulk actions can reduce human burden.

---

# 157. Bulk Approval Is Risky

Do not allow:

```text
approve all
```

across heterogeneous high-risk items.

---

# 158. Safe Batch Approval

May be appropriate for:

```text
same workflow

same risk

same action type

bounded amount/context
```

when Approval Policy permits.

---

# 159. Batch Preview

Show:

```text
item count

total impact

exceptions

aggregate cost/value.
```

---

# 160. One Exceptional Item

Must not hide inside a batch.

---

# 161. Decision Packages Need Exact Targets

Display:

```text
business

customer/vendor where relevant

amount

document

action.
```

---

# 162. Entity Identity UX

Ambiguous names should show enough disambiguation.

Example:

```text
PT ABC
Customer ID ...
Jakarta
```

rather than relying only on name.

---

# 163. Stable IDs Need Not Dominate UI

Human-readable labels first.

Canonical identity available underneath.

---

# 164. Wrong-Target Prevention

For high-risk action, emphasize exact target.

---

# 165. Money Presentation

Use clear formatting:

```text
Rp 12.500.000
```

and distinguish:

```text
payment amount

invoice amount

budget impact.
```

---

# 166. Cost vs Business Money

AI execution cost must not visually blur with business transaction amount.

---

# 167. Risk Presentation

Show risk in understandable language.

Example:

```text
High-impact:
sends money externally
```

not only:

```text
R4.
```

---

# 168. Risk Code Remains Available

For audit/power users.

---

# 169. Autonomy Presentation

Human-readable:

```text
JARVIS can prepare this,
but cannot execute without approval.
```

better than L3 alone.

---

# 170. Ownership Presentation

Every material item can show:

```text
Process Owner

Decision Owner

Current Assignee.
```

where relevant.

---

# 171. Owner ≠ Assignee

An operator may currently handle an item while Process Owner remains another person.

---

# 172. Status Language

Prefer operationally meaningful:

```text
Waiting for Rizky

Waiting for vendor response

Reconciling payment

Blocked by missing evidence.
```

---

# 173. Avoid Generic “Processing”

For long waits, explain what is actually happening.

---

# 174. Time Information

Useful:

```text
created

age

deadline

last updated

last verified.
```

---

# 175. Relative + Absolute

Can show:

```text
2h ago
```

with drill-down:

```text
30 Sep 2026, 05:18 WIB
```

---

# 176. Data Freshness

Every dynamic business view should know:

```text
freshness

source

last observation.
```

---

# 177. Freshness Warning

Example:

```text
Inventory data last verified 9 hours ago.
```

---

# 178. Refresh

User MAY request:

```text
refresh evidence
```

before decision.

---

# 179. Refresh Does Not Mutate Business State

A read refresh remains bounded read.

---

# 180. UI Optimistic State

Do not show consequential action as successful before authoritative verification.

---

# 181. Button State After Approval

Possible:

```text
Approved
Executing...
```

then:

```text
Verified complete
```

or:

```text
Outcome unknown — reconciling
```

---

# 182. Unknown Is First-Class UI State

Never collapse into generic error.

---

# 183. Partial Is First-Class UI State

Morning Briefing may show:

```text
PARTIAL
Engineering source unavailable.
```

---

# 184. Retry UX

Retry button only when execution semantics declare retry safe.

---

# 185. Cancel UX

Cancellation availability depends on underlying state machine.

Do not show universal Cancel button.

---

# 186. Reversal UX

For already-committed effects:

```text
reverse / compensate
```

may be appropriate instead of cancel.

---

# 187. Edit UX

Edit surfaces only fields legitimately editable.

---

# 188. Human Edit Cannot Bypass Server Validation

Final proposal still goes through:

```text
authorization

state guards

invariants.
```

---

# 189. Confirmation Dialogs

Do not use generic:

```text
Are you sure?
```

as primary safety mechanism.

---

# 190. Good High-Risk Confirmation

Show:

```text
You are approving:

Vendor: ABC
Amount: Rp25.000.000
Bank destination: ending 7281
Reason: invoice VB-184
```

---

# 191. Confirmation Is Not Approval Policy

It's UI.

Backend still enforces policy.

---

# 192. Kill Switch Surface

Authorized operators should be able to see key kill-switch state.

---

# 193. Kill Switch UX

Example:

```text
JARVIS Mutations
ENABLED
```

with protected controls.

---

# 194. Kill Switch Must Not Be Easy to Trigger Accidentally

Stronger confirmation/authority applies.

---

# 195. Kill Switch Off State

Clearly show operational consequence:

```text
All JARVIS write capabilities disabled.
Reads remain available.
```

---

# 196. System Degraded Mode

Command Center should make current mode obvious:

```text
NORMAL

READ_ONLY

AI_OFF

AUTOMATION_OFF

RECOVERY_MODE

COST_CONSTRAINED
```

where implemented.

---

# 197. Mode ≠ Health

A deliberate READ_ONLY mode can be:

```text
healthy
```

within its intended operating mode.

---

# 198. Search and Filter

Useful filters:

```text
business

owner

type

severity

risk

status

age.
```

---

# 199. Default Filter

Show:

```text
what needs this user's attention
```

first.

---

# 200. Saved Views

Future teams MAY maintain:

```text
Finance

Operations

Engineering

Group Owner
```

views.

---

# 201. Role-Specific Views

A Finance operator does not need developer traces on Home.

---

# 202. Drill-Down Authorization

Seeing summary does not automatically grant access to every underlying sensitive source.

---

# 203. Data Redaction in UI

Apply:

```text
role

purpose

classification.
```

---

# 204. Multi-Tenant Isolation

One business user's Command Center must not leak another business.

---

# 205. Cross-Business Founder View

Explicit group-level authority required.

---

# 206. Actionability

Every non-informational item should offer one of:

```text
act

assign

defer

dismiss

investigate.
```

---

# 207. Dead-End Alert Anti-Pattern

Bad:

```text
Something failed.
```

with no next step.

---

# 208. Good Failure Item

```text
Shipment creation failed

Cause:
provider unavailable

Business effect:
order not yet dispatched

Current action:
retry scheduled

Owner:
Operations

No decision needed yet.
```

---

# 209. “No Decision Needed” Is Valuable

It prevents founder from feeling every problem needs manual intervention.

---

# 210. Automated Recovery Presentation

Example:

```text
Email provider failed at 07:12

Recovered automatically at 07:16

3 queued messages sent

No action required.
```

May remain in history/digest, not Decision Inbox.

---

# 211. Decision Suppression

If system can safely handle condition automatically:

```text
do not create unnecessary decision.
```

---

# 212. Duplicate Suppression

Same underlying condition should not create:

```text
briefing item

alert

decision

notification

incident
```

as four independent problems.

---

# 213. Correlation

UI links them to one underlying issue.

---

# 214. Parent/Child Items

Example:

```text
Provider Incident
├── 3 failed workflows
├── 7 recovery items
└── 1 decision required
```

---

# 215. Notification Deduplication

One condition → coherent communication.

---

# 216. Acknowledgement

Acknowledging an alert means:

```text
someone has seen it.
```

It does not mean:

```text
resolved.
```

---

# 217. Assignment

Exception/incident MAY be assigned to another responsible human.

---

# 218. Assignment ≠ Ownership Transfer

Process Owner remains accountable.

---

# 219. Handoff

Assignment changes should preserve:

```text
from

to

reason

time.
```

---

# 220. Comments / Collaboration

Future teams may discuss a decision/incident.

Comments are contextual collaboration data.

They do not overwrite canonical state/evidence.

---

# 221. Attachments

Attachments inherit data/security rules.

---

# 222. UI Feedback

Decision actions feed Feedback architecture.

---

# 223. Approve Feedback

May create:

```text
positive operational signal
```

but not automatic trust.

---

# 224. Edit Feedback

Capture:

```text
what changed

why if available.
```

---

# 225. Reject Feedback

Optional quick reason taxonomy.

---

# 226. Dismiss Feedback

Useful to improve proactive signal quality.

---

# 227. Feedback Without Friction

Do not require long forms for every action.

---

# 228. Learning Suggestion

After repeated edits, UI MAY surface:

```text
You shortened similar briefs 14 times.
Create a preference?
```

---

# 229. Learning Suggestion Is Optional

No silent preference promotion.

---

# 230. Lifecycle Items

Command Center MAY surface:

```text
provider sunsets

deprecated workflow past target

orphan credential

unowned automation.
```

---

# 231. Lifecycle Noise Control

Only material lifecycle debt goes to main Home.

Full inventory belongs deeper.

---

# 232. Provider Sunset Example

```text
Model Provider X retires Model Y in 21 days

Affected:
2 workflows

Replacement candidate:
evaluation in progress

Owner:
JARVIS Platform
```

---

# 233. Security Surface

Security-relevant items may include:

```text
credential expiry

repeated access denial

prompt-injection spike

cross-org attempt

break-glass use.
```

---

# 234. Security Detail Minimization

Do not expose exploit-enabling detail to unauthorized users.

---

# 235. Break-Glass Banner

Active emergency access SHOULD be prominently visible to authorized operators.

---

# 236. Evaluation Surface

Not every eval result belongs on founder Home.

---

# 237. Material Regression

Surface when:

```text
production release blocked

autonomy demoted

critical workflow affected.
```

---

# 238. Autonomy Change

Promotion/demotion decisions should appear with:

```text
current level

proposed level

evidence

incidents

scope.
```

---

# 239. No “AI Intelligence Score”

Avoid:

```text
JARVIS Intelligence: 94%
```

This has no operational meaning.

---

# 240. No Generic Confidence Gauge

Confidence should appear only where:

```text
defined

calibrated

decision-relevant.
```

---

# 241. No Sci-Fi Agent Wall

Do not show 40 animated Agents as if activity itself is value.

---

# 242. Agent Drill-Down

When needed show:

```text
owner

version

lifecycle

health

qualification

recent workflows

cost

incidents.
```

---

# 243. Tool Activity

Normal Tool activity belongs in execution detail.

Not founder Home.

---

# 244. Trace View

Technical users can inspect:

```text
request

Agent

Skill

Tool

model

verification.
```

---

# 245. Founder Default

Founder sees outcomes and decisions first.

---

# 246. System Owner Default

System owner sees health and operational exceptions.

---

# 247. Operator Default

Operator sees assigned work and exceptions.

---

# 248. Design Rule — Decision Density

Each screen should maximize:

```text
useful decision context per unit of attention
```

not information volume.

---

# 249. Design Rule — Clear Hierarchy

At a glance distinguish:

```text
needs action

being handled

informational.
```

---

# 250. Design Rule — Evidence Nearby

Evidence must never be buried so deeply that a consequential decision becomes blind approval.

---

# 251. Design Rule — State Continuity

After human action, UI should show:

```text
what changed next.
```

---

# 252. Example

```text
Approved
↓
Execution started
↓
Provider accepted
↓
Verification complete
```

---

# 253. Design Rule — No Phantom Success

Never stop at:

```text
Request sent successfully.
```

for real-world consequential action.

---

# 254. Design Rule — Honest Partiality

If one data source failed:

```text
show partial.
```

---

# 255. Design Rule — Explain Automation

For L4 action history, human should know:

```text
why it executed automatically

which policy allowed it.
```

---

# 256. Design Rule — Reversible Where Possible

Where action is safely reversible, show available reversal path.

---

# 257. Design Rule — Recovery Over Panic

Failure card should provide:

```text
current containment

next recovery step

owner.
```

---

# 258. Design Rule — Contextual Detail

Finance decision displays finance evidence.

Do not clutter it with unrelated infrastructure data.

---

# 259. Accessibility

Important state must not rely solely on color.

Use:

```text
text

icon

label.
```

---

# 260. Responsive Information Hierarchy

Critical decision semantics must survive mobile layout.

---

# 261. Keyboard Efficiency

Desktop power users MAY use shortcuts.

Consequential action shortcuts still require safe confirmation semantics.

---

# 262. Performance

Command Center should feel operationally fast.

A decision surface that takes 20 seconds to render undermines human oversight.

---

# 263. Slow Sources

Use:

```text
cached safe summary

freshness labels

asynchronous detail loading
```

where semantics permit.

---

# 264. Never Show Stale Data as Fresh

---

# 265. Offline / Connectivity Loss

Future client MAY preserve:

```text
last-known read-only view
```

clearly marked stale.

---

# 266. Offline Mutation

Not a default Command Center capability.

---

# 267. Command Center Audit

Material actions through UI produce normal audit trail.

---

# 268. UI Click Is Not the Final Audit Fact

Backend-approved action remains canonical.

---

# 269. Client-Side State Is Not Authority

The browser cannot mark an approval successful independently.

---

# 270. Security

Command Center is a privileged control surface.

Requires strong authentication appropriate to environment/risk.

---

# 271. Session Security

Sensitive actions must not rely indefinitely on stale authenticated sessions.

---

# 272. Reauthentication

High-impact actions MAY require stronger/recent authentication according to security policy.

---

# 273. CSRF / Request Integrity

Mutation controls require standard secure web protections.

Implementation detail, but architectural requirement exists.

---

# 274. Decision Link Security

Notification links must not contain reusable privileged approval credentials.

---

# 275. Shared Device

UI SHOULD support safe logout/session expiration.

---

# 276. Founder Account Is High Value

Do not use one unrestricted session/token as universal infrastructure credential.

---

# 277. First Command Center Scope

Do NOT build all modules initially.

Start with:

```text
Morning Briefing

Finding drill-down

Evidence drill-down

runtime status

basic health.
```

---

# 278. Phase 1 — Read-Only

```text
Morning Briefing

Top findings

recommendations

evidence

source freshness

workflow execution status.
```

---

# 279. Phase 2 — Decision Inbox

When first approval-gated mutation arrives:

```text
Decision Package

Approve

Edit

Reject

execution follow-up.
```

---

# 280. Phase 3 — Operations

Add:

```text
exceptions

incidents

recovery

workflow health.
```

---

# 281. Phase 4 — Governance

Add:

```text
FinOps

learning

lifecycle

autonomy review

ownership routing.
```

---

# 282. Phase 5 — Multi-Business Mission Control

Add:

```text
group overview

business switching

owner-specific inboxes

cross-business priorities.
```

---

# 283. First Morning Briefing Definition of Done

UI can show:

```text
Top Priorities

Finance

Operations

Inventory

Engineering

Suggested Actions

Evidence

freshness

partial-source failure.
```

---

# 284. First Decision Inbox Definition of Done

Each decision has:

```text
exact target

business

summary

recommended action

consequence

risk

evidence

owner

expiry

Approve / Edit / Reject.
```

---

# 285. First Approval Definition of Done

On approval:

```text
exact package revision bound

actor authenticated

approval persisted

execution initiated through authorized path

result tracked independently.
```

---

# 286. First Exception Queue Definition of Done

Each item has:

```text
owner

cause

impact

age

status

next action.
```

---

# 287. First Incident View Definition of Done

Can show:

```text
severity

status

affected capabilities

owner

containment

recovery state

decision requirements.
```

---

# 288. First Recovery View Definition of Done

UNKNOWN outcomes remain visible until:

```text
reconciled

compensated

resolved.
```

---

# 289. First FinOps View Definition of Done

Can show:

```text
today

month-to-date

budget state

top workflow cost

cost anomalies.
```

---

# 290. First Ownership View Definition of Done

Every material item routes to:

```text
accountable owner

current assignee

escalation owner.
```

---

# 291. First Notification Definition of Done

Notifications are:

```text
deduplicated

tiered

privacy-aware

linked to canonical state

actionable.
```

---

# 292. First Multi-Business Gate

Before consolidated view:

```text
organization isolation tested

group authorization explicit

personal data minimized

business context always visible.
```

---

# 293. Command Center Data Model

Do not create one giant:

```text
command_center_items
```

table that becomes source of truth for everything.

---

# 294. Projection Model

Prefer:

```text
materialized/read projections
```

over duplicating source semantics.

---

# 295. Inbox Projection

A Decision Inbox may aggregate references to:

```text
approval item

incident decision

budget exception

recovery decision
```

without owning those objects.

---

# 296. Counter / Badge Accuracy

Badge:

```text
2 decisions
```

should be derived from real actionable state.

---

# 297. Stale Badges

Must update as items:

```text
expire

execute

resolve

reassign.
```

---

# 298. Command Center Event Updates

Event system MAY update projection/reactivity.

It does not become truth.

---

# 299. Polling Fallback

If real-time event delivery is unavailable:

```text
safe polling
```

is acceptable.

---

# 300. Real-Time Is Not Mandatory for Everything

Morning Briefing can remain scheduled.

Critical incident state needs faster freshness.

---

# 301. User Activity History

Useful:

```text
recent decisions

recent approvals

recent overrides.
```

---

# 302. No Dark Patterns

Do not visually manipulate human into approving AI recommendations.

---

# 303. Recommendation Neutrality

Approve and Reject should both remain legitimate paths.

---

# 304. Default Button

For high-impact action, avoid dangerous default selection that can be triggered accidentally.

---

# 305. Approval Friction Should Match Consequence

R1:

```text
lightweight.
```

R5:

```text
more explicit.
```

---

# 306. Too Much Friction Is Also Risk

Humans will develop:

```text
approval fatigue

rubber stamping

workarounds.
```

---

# 307. Good UX Is a Governance Control

Approval architecture fails if humans cannot understand the decision quickly.

---

# 308. Founder Decision Load

Command Center SHOULD eventually measure:

```text
decisions/day

approval time

repeat decisions

avoidable founder escalations.
```

---

# 309. Founder Load Is a System Metric

Goal:

```text
reduce routine founder decisions
```

while preserving high-value judgment.

---

# 310. Decision Compression

JARVIS should transform:

```text
hundreds of operational signals
```

into:

```text
few material decision packages.
```

---

# 311. Compression Must Preserve Evidence

Less UI information does not mean less traceability.

---

# 312. Automatic Decision Suppression

If policy clearly resolves a bounded low-risk case:

```text
execute/handle automatically
```

according to autonomy policy instead of asking human.

---

# 313. Approval Promotion Feedback

Repeated routine approval may become:

```text
autonomy review candidate
```

not automatic autonomy.

---

# 314. Rejection Feedback

Repeated rejection should trigger learning/evaluation before more autonomy.

---

# 315. Command Center Is Not a Chatbot Skin

Conversation is one interface.

Command Center is persistent operational state/decision UX.

---

# 316. Chat Is Good For

```text
asking

exploring

requesting analysis

navigating.
```

---

# 317. Command Center Is Good For

```text
persistent decisions

status

exceptions

evidence

ownership

history.
```

---

# 318. Both Should Share Runtime Contracts

Do not create separate authority rules for chat and web.

---

# 319. Same Decision Everywhere

A Decision Package opened from chat and web is the same canonical object.

---

# 320. Current State Declaration

As of 2026-09-30:

```text
JARVIS Command Center Architecture
ACTIVE specification

Morning Briefing UX
DEFINED

Core Finding Severity
DEFINED

Decision Inbox Concept
DEFINED

Command Center Runtime UI
NOT IMPLEMENTED

Decision Package Runtime
NOT IMPLEMENTED

Approval Center
NOT IMPLEMENTED

Exception Queue
NOT IMPLEMENTED

Incident / Recovery UI
NOT IMPLEMENTED

FinOps UI
NOT IMPLEMENTED

Learning UI
NOT IMPLEMENTED

Multi-Business Mission Control
NOT IMPLEMENTED

Notification Tier Runtime
NOT IMPLEMENTED
```

---

# 321. Canonicalization Effect

Before this document, presentation/interaction semantics were distributed across:

```text
Governance & Operations notes

JARVIS Architecture v0.1

Core Runtime v0.2

Approval architecture

Observability

FinOps

Feedback

Human Accountability.
```

After activation:

```text
jarvis.architecture.command-center-decision-experience
```

becomes canonical semantic owner for JARVIS human-facing operational decision experience.

---

# 322. Architectural Invariants

1. Command Center is a projection layer, never business source of truth.
2. Human attention is treated as scarce resource.
3. Normal state should generate minimal noise.
4. Decision Inbox contains real decisions, not generic notifications.
5. Decision Package binds exact action/context.
6. Approval binds exact decision revision.
7. Approved does not mean executed.
8. Executed does not mean verified.
9. UNKNOWN and PARTIAL are first-class UI states.
10. Evidence remains accessible from consequential decisions.
11. Evidence freshness is visible.
12. Missing evidence is visible.
13. Conflicting evidence is not silently resolved by UI.
14. Finding severity remains rule-based.
15. Finding severity, risk, and incident severity remain separate.
16. Priority uses structured business signals, not opaque AI ranking alone.
17. Risk never bypasses priority logic or authority.
18. Recommendation remains distinguishable from decision.
19. Decision consequences include inaction where material.
20. Exception, incident, approval, and recovery remain different object types.
21. Automated recovery does not create unnecessary founder work.
22. Notifications are tiered and deduplicated.
23. Notification is not approval authority.
24. Consequential approvals require secure authenticated binding.
25. Natural-language ambiguity cannot approve arbitrary high-impact action.
26. Batch approval is bounded by risk and semantic similarity.
27. Cross-business views require explicit authority.
28. Cross-business consolidation does not collapse tenant isolation.
29. Owner routing follows Ownership Registry.
30. Founder is not permanent default owner for every decision.
31. Command Center supports founder-by-exception.
32. Sensitive notification content is minimized.
33. Client-side state does not become authority.
34. UI confirmation does not replace backend governance.
35. Retry appears only when semantically safe.
36. Edit creates a revised proposal where material.
37. Dismiss does not falsely resolve underlying state.
38. Acknowledgement does not mean incident resolved.
39. Assignment does not transfer process accountability.
40. System modes are explicit.
41. Degraded capability is presented honestly.
42. Health is capability-aware.
43. Founder surfaces outcomes before traces.
44. Technical users retain drill-down observability.
45. Cost metrics emphasize useful outcomes, not token vanity.
46. Learning and lifecycle debt only interrupt humans when material.
47. Command Center does not expose meaningless AI intelligence/confidence scores.
48. Approval friction scales with consequence.
49. UX must reduce—not create—rubber-stamp behavior.
50. Every material UI action remains auditable.

---

# 323. Canonical Mental Model

```text
BUSINESS + SYSTEM REALITY
          │
          ▼
       SIGNALS
          │
          ▼
     JARVIS CORE
          │
     ┌────┼────┐
     │    │    │
     ▼    ▼    ▼
 FINDING EVENT EXCEPTION
     │    │    │
     └────┼────┘
          ▼
   MATERIALITY FILTER
          │
     ┌────┼─────────────┐
     │                  │
     ▼                  ▼
NO HUMAN NEEDED     HUMAN NEEDED
     │                  │
     ▼                  ▼
 automate /         Decision Package
 log / digest            │
                         ▼
                    RIGHT OWNER
                         │
                         ▼
                  DECIDE / APPROVE
                         │
                         ▼
                      EXECUTE
                         │
                         ▼
                      VERIFY
                         │
                         ▼
                  STATUS + EVIDENCE
```

---

# 324. Founder Mission-Control Mental Model

```text
                 MULTIGRAPH GROUP

                       RIZKY
                         │
                         ▼
                  COMMAND CENTER
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
    MULTIGRAPH        TEESTOCK       FUTURE BUSINESS
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                     JARVIS
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
      MGBOS          AUTOMATION        PROVIDERS
```

Rizky sees:

```text
decisions

exceptions

capital

risk

business health
```

not every underlying task.

---

# 325. Daily Founder Experience

Desired future:

```text
07:xx
Morning Briefing

3 important items

1 decision required

0 critical incidents
```

Then through the day:

```text
normal operations
→ silent

recoverable problems
→ automatic

material exception
→ relevant owner

founder-only issue
→ direct notification
```

---

# 326. Decision Experience Example

```text
Vendor PO Approval

TeeStock

Why now:
Blank stock required for confirmed order.
Supplier cutoff is today.

Recommended:
Approve PO-184

Amount:
Rp18.400.000

Risk:
Financial commitment

Evidence:
- confirmed order
- stock shortage
- supplier quote
- margin still above policy floor

If approved:
MGBOS submits approved PO.

If rejected:
Procurement remains blocked.

[Approve]
[Edit]
[Reject]
```

After approval:

```text
APPROVED

Execution:
Submitted

Verification:
Supplier reference received

Evidence:
...
```

---

# 327. No-Decision Example

```text
Email provider degraded

3 sends retried automatically

All succeeded

No business impact

No action required
```

This belongs in:

```text
history / digest
```

not founder Decision Inbox.

---

# 328. Critical Example

```text
Financial Mutations Paused

Reason:
Possible duplicate payment execution

State:
Contained

Affected:
Vendor payments

Current owner:
Finance / Incident Owner

Decision required:
Keep payments paused
or initiate recovery procedure?

Evidence:
...
```

---

# 329. First Implementation Sequence

Recommended:

```text
1. Morning Briefing response UI

2. Finding cards

3. Evidence drawer

4. execution / partial-state visibility

5. Home attention summary

6. DecisionPackage contract

7. Approval Inbox

8. execution-follow-up state

9. Exception Queue

10. Incident / Recovery view

11. ownership routing

12. notifications

13. FinOps summary

14. Learning / Lifecycle views

15. multi-business mission control
```

---

# 330. Initial Non-Goals

Do NOT begin with:

```text
3D mission-control dashboard

animated AI avatars

40 Agent panels

complex custom charting

full BI replacement

universal admin panel

voice approval

bulk high-risk approval

hundreds of notifications

opaque AI confidence gauges.
```

---

# 331. North Star

When Rizky opens JARVIS, he should eventually be able to understand within seconds:

```text
Are my businesses okay?

What changed?

What is urgent?

What is blocked?

What needs my decision?

What can everyone else handle?

What is JARVIS already handling?

What is broken?

Is anything financially or operationally dangerous?

How much is AI costing?

Which business needs attention?

What evidence supports each claim?

Who owns each problem?

What happens next after I press Approve?
```

---

# 332. Final Principle

> **The Command Center succeeds when the founder sees less information but gains more control.**

The wrong mission control is:

```text
MORE AGENTS
+
MORE METRICS
+
MORE ALERTS
+
MORE DASHBOARDS
=
MORE COGNITIVE LOAD
```

The desired mission control is:

```text
ALL BUSINESS SIGNALS
        ↓
FILTER
        ↓
CORRELATE
        ↓
VERIFY
        ↓
PRIORITIZE
        ↓
ROUTE TO RIGHT OWNER
        ↓
FEW CLEAR DECISIONS
        ↓
EVIDENCE-BACKED ACTION
```

The ultimate measure is not:

```text
How impressive does the dashboard look?
```

It is:

```text
How many businesses can one founder govern
without becoming the bottleneck?
```git