---
canonical_id: docs.governance.cross-system-risk-classification
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: ecosystem
document_class: governance
effective_from: 2026-09-29
authoritative_for:
  - ecosystem risk semantics
  - R0-R5 risk classification
  - action and capability risk classification
  - risk escalation rules
  - risk assessment dimensions
  - cross-system risk vocabulary
  - risk-to-control-strength relationship
  - risk classification for human, AI, automation, and services
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - documentation-constitution.md
  - canonical-source-map.md
  - ../architecture/master-system-blueprint.md
  - ../architecture/system-boundaries.md
  - ../architecture/architectural-laws.md
  - ../../systems/mgbos/docs/architecture/permission-authorization-model.md
  - ../../systems/mgbos/docs/architecture/command-event-model.md
supersedes: null
---

# Cross-System Risk Classification v1.0

## 1. Purpose

Dokumen ini mendefinisikan satu bahasa risiko untuk seluruh ekosistem BisnisHub.

Ia berlaku untuk:

```text
MGBOS commands
JARVIS tools
runtime agents
automation
n8n workflows
external integrations
engineering operations
production changes
financial operations
security operations
customer communication
data access
future systems
```

Tujuan utamanya:

> **Semakin besar potensi konsekuensi suatu tindakan, semakin kuat control yang harus mengelilinginya.**

---

# 2. Canonical Risk Scale

Cross-system risk menggunakan:

```text
R0
R1
R2
R3
R4
R5
```

dengan arti:

```text
R0 — Informational / No Material Effect

R1 — Read-Only / Low Consequence

R2 — Reversible Low-Impact Mutation

R3 — Significant Operational / External Mutation

R4 — Sensitive or High-Impact Mutation

R5 — Money / Security / Production-Critical
```

---

# 3. Risk Is About Consequence

Risk tidak ditentukan oleh:

```text
berapa baris code
berapa lama task
seberapa pintar agent
nama tool
siapa yang meminta
```

Risk ditentukan oleh:

> **Apa yang dapat terjadi jika tindakan salah, disalahgunakan, dieksekusi dua kali, atau tidak dapat dipulihkan?**

---

# 4. Highest Applicable Risk Wins

Jika sebuah action memenuhi beberapa kategori:

```text
R2
R3
R5
```

maka classification adalah:

```text
R5
```

Canonical rule:

> **Choose the highest applicable risk dimension.**

---

# 5. Risk Is Not Permission

Risk answers:

> Seberapa besar konsekuensinya?

Permission answers:

> Apakah actor boleh melakukannya?

Contoh:

```text
mgbos.payment.record
```

dapat diklasifikasikan:

```text
R5
```

tetapi:

```text
FINANCE
```

mungkin authorized untuk meminta command tersebut.

Keduanya tetap konsep terpisah.

---

# 6. Risk Is Not Autonomy

Risk:

```text
R0–R5
```

dan Autonomy:

```text
L0–L4
```

adalah dua axis berbeda.

Contoh:

```text
R3 + L4
```

dapat terjadi setelah capability terbukti sangat aman.

Sebaliknya:

```text
R5 + L3
```

mungkin tetap memerlukan approval manusia selamanya.

---

# 7. Risk Is Not Approval

Risk menentukan **control expectation**.

Approval adalah salah satu control.

Contoh:

```text
R4
```

tidak berarti setiap R4 selalu menggunakan jenis approval yang sama.

Approval Policy menentukan detailnya.

---

# 8. Risk Is Not Prohibition

Beberapa action dapat:

```text
R5
```

dan tetap legitimate melalui control yang kuat.

Sebaliknya beberapa action dapat:

```text
FORBIDDEN
```

terlepas dari risk score.

Contoh:

```text
expose production secrets to public model
```

bukan sekadar:

```text
R5
```

tetapi dapat menjadi:

```text
PROHIBITED
```

oleh security policy.

---

# 9. Risk Assessment Dimensions

Risk SHOULD dinilai berdasarkan beberapa dimension.

Canonical dimensions:

```text
1. Financial Impact
2. Operational Impact
3. Customer / External Impact
4. Data Sensitivity
5. Security / Access Impact
6. Production Criticality
7. Reversibility
8. Blast Radius
9. Legal / Contractual Impact
10. Automation Amplification
```

---

# 10. Financial Impact

Pertanyaan:

```text
Can this action:
move money?
recognize money?
create liability?
alter financial truth?
change pricing commitment?
```

Semakin nyata financial consequence, semakin tinggi risk.

---

# 11. Operational Impact

Pertanyaan:

```text
Can this stop production?
change fulfillment?
affect inventory?
change vendor execution?
interrupt business operations?
```

---

# 12. Customer / External Impact

Pertanyaan:

```text
Will an external party see or experience this action?
```

Contoh:

```text
send customer message
publish social content
confirm order
cancel shipment
issue invoice
```

lebih tinggi daripada internal draft.

---

# 13. Data Sensitivity

Pertanyaan:

```text
What information can be exposed?
```

Possible categories may later include:

```text
PUBLIC
INTERNAL
CONFIDENTIAL
RESTRICTED
```

Read-only action can still become high risk if it exposes:

```text
credentials
financial data
customer PII
security material
```

---

# 14. Security Impact

Actions modifying:

```text
permissions
credentials
secrets
authentication
network access
security policy
```

carry elevated risk because they can unlock many downstream capabilities.

---

# 15. Production Criticality

An action affecting:

```text
production database
production deployment
live payment provider
live customer communication
live infrastructure
```

has higher consequences than equivalent sandbox action.

---

# 16. Reversibility

Ask:

```text
Can this action be safely undone?
```

Risk rises when reversal is:

```text
impossible
uncertain
expensive
legally meaningful
externally visible
```

---

# 17. Blast Radius

Ask:

```text
How many:
customers
orders
businesses
records
systems
people
can this affect?
```

Bulk action can carry higher risk than the same single-record capability.

---

# 18. Legal / Contractual Impact

Actions may create:

```text
commercial commitment
financial obligation
customer promise
vendor commitment
legal record
```

These often require stronger control even if technically reversible.

---

# 19. Automation Amplification

A small error repeated automatically may create major consequences.

Therefore classification considers:

```text
single action
vs
bulk
vs
recurring
vs
event-driven automatic execution
```

Automation can raise effective risk.

---

# 20. R0 — Informational

Definition:

> Action has no meaningful external or authoritative side effect.

Typical examples:

```text
reason about architecture
summarize public documentation
format internal text
calculate a hypothetical scenario
draft a recommendation
inspect non-sensitive static metadata
```

R0 normally does not mutate authoritative systems.

---

# 21. R0 Characteristics

Typical profile:

```text
mutation: none
external effect: none
business truth change: none
sensitive access: none/minimal
reversibility: irrelevant
```

Control expectation:

```text
normal validation
no special approval
```

---

# 22. R0 Is Not “Anything AI Does”

AI action can be R0 only if it remains informational.

Example:

```text
AI drafts an invoice email
→ R0/R1-like preparation
```

but:

```text
AI sends the invoice email
→ higher risk
```

because external effect occurs.

---

# 23. R1 — Read-Only

Definition:

> Action reads authoritative or operational data without mutating the source.

Typical examples:

```text
mgbos.order.read
mgbos.customer.read
mgbos.production.exceptions.read
GitHub repository read
business summary query
read current invoice state
```

---

# 24. Typical R1 Characteristics

```text
mutation: none
external mutation: none
authoritative state change: none
reversible: yes/not applicable
```

Control expectation:

```text
authenticated identity
least-privilege read scope
source evidence
```

---

# 25. Read-Only Does Not Always Mean R1

A read operation MUST be raised if it exposes sensitive material.

Examples:

```text
read production secrets
read raw payment credentials
export full customer database
read private cross-business financial dataset
```

may be:

```text
R4
or
R5
```

despite being technically read-only.

---

# 26. R2 — Reversible Low-Impact Mutation

Definition:

> Action changes state, but impact is limited, internal, and safely reversible.

Typical examples:

```text
create internal draft
create low-impact internal task
update non-critical metadata
prepare message without sending
save recommendation
change sandbox/test data
```

---

# 27. R2 Characteristics

Typical:

```text
mutation: yes
external effect: none/minimal
financial impact: none
reversible: easy
blast radius: narrow
```

Control expectation:

```text
authorization
basic audit
validation
```

Automated execution may become reasonable relatively early when evidence is strong.

---

# 28. R2 Example — Draft

```text
JARVIS
→ prepare customer follow-up draft
```

No message sent.

No external party affected.

Likely:

```text
R2
```

if draft is stored internally.

---

# 29. R3 — Significant Operational / External Mutation

Definition:

> Action affects real operations or an external party, but remains reasonably recoverable and does not directly control critical money/security infrastructure.

Examples:

```text
send individual customer email
send WhatsApp operational update
assign vendor
schedule fulfillment
publish approved low-risk content
update non-critical operational status
create normal purchase request
```

---

# 30. R3 Characteristics

Typical:

```text
external visibility: yes
operational effect: meaningful
reversibility: possible but not perfect
customer/vendor impact: possible
blast radius: bounded
```

Control expectation:

```text
explicit authorization
strong validation
audit/evidence
often human approval during early autonomy stages
postcondition verification when applicable
```

---

# 31. External Communication Baseline

A real external communication normally starts at least around:

```text
R3
```

because once sent:

```text
the recipient has seen it
```

and it cannot truly be “unsent.”

Drafting remains lower risk.

---

# 32. R3 Example — Customer Notification

```text
Send:
"Order lo sudah masuk produksi."
```

Potential consequence:

```text
customer expectation
reputation
support burden
```

Therefore higher than internal drafting.

---

# 33. R4 — Sensitive / High-Impact Mutation

Definition:

> Action can materially affect business operation, customer commitment, sensitive data, production availability, or large external scope.

Examples may include:

```text
production deployment
bulk external communication
significant pricing exception
major inventory adjustment
cancel meaningful customer fulfillment
high-value vendor commitment
change production routing for critical order
change sensitive access configuration
```

---

# 34. R4 Characteristics

Typical:

```text
high operational consequence
significant external impact
sensitive resource
large blast radius
or difficult recovery
```

Control expectation:

```text
strong authorization
human approval by default
explicit evidence
precondition checks
rollback/recovery path
postcondition verification
```

---

# 35. R4 Does Not Necessarily Mean Financial Transfer

A change may be R4 even with no money movement.

Example:

```text
deploy broken production software
```

can stop business.

Or:

```text
send 50,000 customer messages
```

can create major reputational impact.

---

# 36. R5 — Money / Security / Production-Critical

Definition:

> Action can directly change critical financial truth, transfer/reverse money, alter privileged security authority, destructively affect authoritative production state, or create similarly severe consequences.

Examples:

```text
record/reverse/refund payment
execute money transfer
pay vendor bill
change production payment credentials
rotate/revoke critical secrets
grant privileged production access
destructive production database operation
production schema migration with material data risk
irreversible production data correction
```

---

# 37. R5 Characteristics

Typical:

```text
money: direct
security authority: privileged
production truth: critical
recovery: difficult or costly
audit requirement: strong
human accountability: mandatory
```

---

# 38. R5 Control Expectation

R5 normally requires:

```text
explicit identity
explicit permission
strong business validation
human approval or equivalent accountable control
evidence
idempotency
verification
audit
recovery/reconciliation path
```

where applicable.

---

# 39. R5 Does Not Mean “Never Automate”

Risk and autonomy remain separate.

A tightly bounded R5 capability MAY theoretically gain higher automation if governance explicitly permits it.

However:

> Some R5 capabilities may permanently remain human-gated.

Examples can include:

```text
large money transfer
privileged security escalation
destructive production recovery
```

---

# 40. Financial Risk Rule

Direct financial mutation SHOULD normally be treated as:

```text
R5
```

Examples:

```text
mgbos.payment.record
mgbos.payment.reverse
mgbos.vendor_bill.pay
refund customer
execute bank/payment transfer
```

---

# 41. Financial Read Rule

Reading normal financial summary may be:

```text
R1
```

if authorized and scope is limited.

Reading highly restricted financial credentials:

```text
R5 / prohibited
```

depending on policy.

Again:

```text
read-only
≠ automatically low risk
```

---

# 42. Inventory Risk Rule

Typical:

```text
inventory.read
→ R1

inventory.reserve
→ R2/R3 depending operational consequence

inventory.adjust
→ R3/R4

large destructive stock correction
→ potentially R4
```

Classification considers value, quantity, and operational impact.

---

# 43. Production Risk Rule

Typical:

```text
production.read
→ R1

assign normal job
→ R3

reroute critical/high-value production
→ R4

destructive production-system infrastructure change
→ R5
```

---

# 44. Communication Risk Rule

Typical:

```text
draft email
→ R0/R2

send individual routine email
→ R3

send contractual/high-impact communication
→ R4

bulk campaign across large customer base
→ R4
```

Legal/financial communication may rise further depending context.

---

# 45. Publishing Risk Rule

Typical:

```text
draft social content
→ R0/R2

publish normal approved content
→ R3

publish sensitive crisis/legal statement
→ R4
```

---

# 46. Pricing Risk Rule

Examples:

```text
read pricing
→ R1

prepare pricing recommendation
→ R2

send normal quote
→ R3

override pricing below floor
→ R4
```

If pricing action creates extreme financial exposure, contextual classification MAY rise.

---

# 47. Procurement Risk Rule

Typical:

```text
vendor.read
→ R1

prepare PO draft
→ R2

issue normal PO
→ R3/R4 depending value

pay vendor
→ R5
```

---

# 48. Infrastructure Risk Rule

Typical:

```text
inspect logs
→ R1

change staging config
→ R2/R3

deploy production
→ R4

change privileged production database/security
→ R5
```

---

# 49. Secret Management Risk Rule

Actions involving live credentials are high risk.

Examples:

```text
view secret metadata
→ R1/R2

rotate low-impact sandbox secret
→ R2/R3

read raw production secret
→ R5 or prohibited

rotate production payment credential
→ R5
```

---

# 50. Permission Management Risk

Changing authority can indirectly unlock many actions.

Typical:

```text
view permission
→ R1

grant ordinary limited capability
→ R3/R4

grant privileged finance/security capability
→ R5
```

---

# 51. Database Risk Rule

Typical:

```text
read ordinary projection
→ R1

write disposable local DB
→ R2

staging migration
→ R3

production schema change
→ R4/R5

direct destructive production mutation
→ R5 / possibly prohibited
```

---

# 52. Bulk Operations Raise Risk

Example:

```text
send one routine message
→ R3
```

versus:

```text
send 20,000 messages
→ R4
```

Same technical capability.

Different blast radius.

---

# 53. Value Threshold Can Raise Risk

Example:

```text
Issue Rp300.000 purchase order
```

may differ from:

```text
Issue Rp300.000.000 purchase order
```

Future Approval Policy MAY define monetary thresholds.

Risk classifier MUST support contextual escalation.

---

# 54. Environment Can Raise Risk

Same action:

```text
database migration
```

may be:

```text
LOCAL
→ R2

STAGING
→ R3

PRODUCTION
→ R4/R5
```

Risk follows actual consequence.

---

# 55. Data Classification Can Raise Risk

Example:

```text
export 10 public catalog rows
→ R1
```

versus:

```text
export all customer PII
→ R4
```

Read operation, different sensitivity.

---

# 56. Customer Impact Can Raise Risk

An internal state mutation may look reversible technically but can cause irreversible external consequences.

Example:

```text
mark shipment dispatched
```

may trigger:

```text
customer notification
courier action
expectation
```

Therefore contextual classification should include downstream effects.

---

# 57. Composite Workflow Risk

Workflow classification equals at least the highest-risk consequential step.

Example:

```text
Read invoice       R1
Analyze payment    R0
Record payment     R5
Send receipt       R3
```

Overall workflow:

```text
R5
```

---

# 58. Agent Risk Does Not Exist Globally

Do NOT classify:

```text
CFO Agent = R5
```

An agent can perform several tasks with different risk.

Correct:

```text
CFO Agent:
finance.summary.read → R1
payment.prepare      → R2
payment.record       → R5
```

Risk belongs primarily to capability/action.

---

# 59. Skill Risk

A skill contract MAY declare:

```text
max_risk
default_risk
```

but runtime action classification still follows actual capability/context.

Skill label does not override execution-time risk.

---

# 60. Tool Risk

Tool Registry SHOULD eventually declare baseline risk.

Example:

```yaml
tool: mgbos.payment.record
baseline_risk: R5
mutation: true
```

Context MAY raise risk.

Context SHOULD NOT normally lower below a hard minimum without explicit governance.

---

# 61. Baseline Risk vs Effective Risk

Each capability may have:

```text
BASELINE RISK
```

Then execution context produces:

```text
EFFECTIVE RISK
```

Conceptually:

```text
effective_risk =
max(
  baseline,
  environment,
  data sensitivity,
  amount/value,
  blast radius,
  irreversibility,
  policy escalation
)
```

---

# 62. Example — Message

Capability:

```text
email.message.send
```

Baseline:

```text
R3
```

Routine single customer message:

```text
R3
```

Bulk sensitive announcement:

```text
R4
```

---

# 63. Example — Payment

Capability:

```text
mgbos.payment.record
```

Baseline:

```text
R5
```

A small amount does not reduce it below R5 under current governance because financial truth is critical.

---

# 64. Example — Inventory Adjustment

Capability:

```text
mgbos.inventory.adjust
```

Baseline might be:

```text
R3
```

Small verified correction:

```text
R3
```

Large destructive adjustment affecting major stock:

```text
R4
```

---

# 65. Uncertainty Raises Risk

If material facts required for classification are unknown:

```text
do not classify downward
```

Preferred:

```text
UNKNOWN_RISK
```

or conservatively use the higher plausible class.

---

# 66. Unknown Risk Is Not R0

Missing information does not equal low risk.

Example:

```text
"Run this database command."
```

but environment unknown.

Correct:

```text
risk unresolved
```

not:

```text
R1 because command looks small
```

---

# 67. Risk Reassessment at Execution Time

Planning-time classification may become stale.

Before high-risk execution, system SHOULD re-evaluate:

```text
environment
resource
amount
scope
actor
approval
current state
```

---

# 68. Risk Can Increase During a Workflow

Example:

Initial request:

```text
prepare vendor alternatives
→ R1/R2
```

Later user says:

```text
switch production to Vendor B
→ R3/R4
```

Workflow risk must be updated.

---

# 69. Risk Must Not Silently Decrease

Once new context reveals greater consequence:

```text
risk classification increases
```

automatically.

Reducing risk class requires justification, not optimism.

---

# 70. Human Request Does Not Lower Risk

If founder explicitly asks:

```text
"Transfer Rp100 juta."
```

the action remains:

```text
R5
```

User intent may satisfy part of approval.

It does not change consequence.

---

# 71. Trusted Agent Does Not Lower Risk

A reliable agent executing payment still performs an R5 action.

Model quality does not change intrinsic risk.

---

# 72. Historical Success Does Not Lower Intrinsic Risk

A capability performing successfully 10,000 times may earn higher autonomy.

Its intrinsic risk class remains based on consequence.

This is why:

```text
Risk
≠
Autonomy
```

---

# 73. Risk Controls Scale With Risk

General control trend:

```text
R0
minimal control

R1
identity + scoped read

R2
authorization + basic audit

R3
authorization + evidence + verification

R4
strong approval + rollback/recovery + verification

R5
strict approval/authority + strong evidence +
idempotency + verification + audit + reconciliation
```

Exact requirements belong to Approval/Autonomy policies.

---

# 74. R0 Default Control

Minimum:

```text
valid context
normal quality checks
```

No mutation authority required.

---

# 75. R1 Default Control

Minimum:

```text
authenticated principal
least privilege
organization/data scope
source evidence
```

---

# 76. R2 Default Control

Minimum:

```text
explicit capability authorization
validation
bounded scope
basic audit
```

---

# 77. R3 Default Control

Minimum:

```text
explicit capability authorization
evidence
external-effect awareness
postcondition verification where useful
human approval during low-maturity automation
```

---

# 78. R4 Default Control

Minimum:

```text
strong authorization
human approval by default
explicit impact preview
evidence
recovery/rollback consideration
post-execution verification
```

---

# 79. R5 Default Control

Minimum:

```text
strong identity
least privilege
explicit authorization
explicit accountable human control
business invariant enforcement
idempotency
precondition verification
postcondition verification
audit
evidence
reconciliation/recovery path
```

unless a later policy explicitly defines a narrower safe exception.

---

# 80. Evidence Strength Scales With Risk

R1 evidence may be:

```text
source reference
```

R5 evidence may require:

```text
source state
approval
request identity
execution response
postcondition read
audit record
correlation ID
```

---

# 81. Verification Strength Scales With Risk

For R2:

```text
tool success
+
simple re-read
```

may suffice.

For R5:

```text
independent authoritative postcondition
```

is normally expected.

---

# 82. Reversibility Must Be Proven, Not Assumed

An action is not R2 just because a developer says:

```text
"we can undo it."
```

Safe reversibility means:

```text
known inverse operation
preserved history
limited external effect
tested recovery
```

---

# 83. External Visibility Reduces Reversibility

An email can technically be followed by a correction.

That does not make sending it fully reversible.

The recipient already received the original.

---

# 84. Financial History Is Not Freely Reversible

Payment reversal preserves historical record.

Therefore:

```text
record payment
```

remains high-risk even though reversal exists.

Compensation is not identical to undo.

---

# 85. Production Data Mutation

Changing production truth may affect:

```text
real customer order
staff action
vendor work
inventory
finance
```

Therefore risk considers real-world propagation, not only database rollback.

---

# 86. Physical World Escalation

Actions that initiate irreversible physical work may be higher risk.

Examples:

```text
start mass production
release goods
dispatch shipment
```

Once physical execution starts, software rollback cannot fully undo reality.

---

# 87. Security Privilege Escalation

Granting privileged access is high-risk because it enables future actions.

Risk considers potential capability unlocked, not only immediate mutation.

---

# 88. Sensitive Read Escalation

A tool:

```text
secrets.read
```

could expose credentials that enable R5 actions.

Therefore it should itself be treated as R5 or prohibited depending policy.

---

# 89. Risk and Data Export

Exporting data increases blast radius.

Example:

```text
read one customer record
→ R1/R2 contextually

export all customers
→ R4
```

even though both technically use SELECT.

---

# 90. Cross-Business Risk

Cross-business access increases sensitivity.

Example:

```text
JARVIS executive group briefing
```

may legitimately combine business data.

It requires explicit holding-level authority and appropriate risk handling.

---

# 91. Production Release Risk

Production deployment baseline:

```text
R4
```

may escalate to:

```text
R5
```

when it materially changes:

```text
money
authorization
production database schema
security boundaries
critical recovery mechanisms
```

---

# 92. Direct Production Database Mutation

General direct production DB mutation should normally be treated as:

```text
R5
```

and may additionally be:

```text
PROHIBITED
```

for specific actors such as general engineering agents.

Risk classification never grants permission to perform it.

---

# 93. Emergency Actions

Emergency recovery may involve R5 action.

Emergency does not remove:

```text
accountability
evidence
post-incident review
```

Some approval sequencing MAY differ under a future Emergency Policy.

---

# 94. Risk vs Incident Severity

Risk classification predicts potential consequence **before action**.

Incident severity measures actual impact **after failure/event**.

They are related but distinct.

```text
R5 action
```

can complete safely.

```text
R2 action
```

could still cause an unexpected incident.

---

# 95. Risk vs Priority

Risk answers:

```text
How dangerous is this action?
```

Priority answers:

```text
How urgently should we act?
```

An R5 action may be low urgency.

An R1 alert may be extremely urgent.

---

# 96. Risk vs Confidence

AI confidence does not lower risk.

```text
99.9% confidence
```

on an R5 financial action does not transform it into R2.

---

# 97. Risk vs Model Strength

Using a stronger reasoning model may reduce decision error.

It does not change underlying action consequence.

---

# 98. Risk vs Human Approval

Human approval reduces execution uncertainty/accountability risk.

It does not change intrinsic action classification.

Payment remains R5 after approval.

---

# 99. Risk vs Environment Example

```text
Delete synthetic test customer
→ R2

Delete production customer with transaction history
→ R4/R5 or prohibited
```

Same verb.

Different context.

---

# 100. Risk vs Scale Example

```text
Adjust 1 blank-shirt unit after opname
→ R3
```

versus:

```text
Reduce warehouse stock by 80,000 units
→ R4
```

---

# 101. Risk vs Monetary Value Example

Future Approval Policy MAY create thresholds:

```text
PO < X
→ R3

PO between X and Y
→ R4

very high contractual exposure
→ R5 contextual
```

Exact numbers should not live in this constitutional risk taxonomy.

---

# 102. Risk Classification Algorithm

Default process:

```text
1. Identify capability/action

2. Determine baseline risk

3. Determine environment

4. Determine mutation/read

5. Determine financial/security impact

6. Determine data sensitivity

7. Determine external/customer impact

8. Determine reversibility

9. Determine blast radius

10. Determine physical/production consequence

11. Choose highest applicable class
```

---

# 103. Simplified Decision Tree

```text
Does it directly affect money,
critical security authority,
or production-critical truth?
        │
       YES
        ↓
       R5
        │
       NO
        ↓
Does it have high/sensitive impact,
large blast radius, or difficult recovery?
        │
       YES
        ↓
       R4
        │
       NO
        ↓
Does it mutate real operations
or create external visible effects?
        │
       YES
        ↓
       R3
        │
       NO
        ↓
Is it a reversible low-impact mutation?
        │
       YES
        ↓
       R2
        │
       NO
        ↓
Is it scoped read-only?
        │
       YES
        ↓
       R1
        │
       NO
        ↓
       R0
```

Sensitive reads can override this tree upward.

---

# 104. Baseline Risk Registry Direction

Future Tool/Capability Registry SHOULD declare:

```yaml
capability_id: mgbos.payment.record
baseline_risk: R5
```

Runtime calculates effective risk from context.

---

# 105. Example Baseline Registry

Conceptual examples:

```text
mgbos.order.read
R1

mgbos.customer.read
R1

mgbos.quote.prepare
R2

mgbos.inventory.reserve
R2/R3 baseline depending final command contract

email.message.send
R3

mgbos.production.assign
R3

mgbos.quote.override_price
R4

production.deploy
R4

mgbos.payment.record
R5

mgbos.payment.reverse
R5

mgbos.vendor_bill.pay
R5

security.production_secret.rotate
R5
```

Final registry belongs to Tool/Capability architecture.

---

# 106. Risk Classification Must Be Deterministic Where Possible

Risk should not be decided freely by an LLM each time.

Where capability and context are known:

```text
baseline risk
+
deterministic escalation rules
```

should produce classification.

AI may assist identifying context.

Policy engine owns final classification.

---

# 107. AI Cannot Downgrade Risk

AI recommendation:

```text
"This seems safe."
```

does not override policy-defined risk floor.

---

# 108. Human May Not Arbitrarily Downgrade Canonical Risk

Even OWNER SHOULD NOT casually label:

```text
payment.record = R2
```

for convenience.

Changing baseline risk semantics requires governance change.

---

# 109. Risk Exception

If a legitimate special case needs different treatment, use an explicit:

```text
policy exception
```

with:

```text
scope
reason
owner
expiry
evidence
```

rather than redefining the risk taxonomy.

---

# 110. Forbidden Capability

Future registries SHOULD support:

```text
risk: FORBIDDEN
```

or an equivalent policy state.

Examples may include:

```text
AI direct production SQL
public secret export
agent disabling audit history
```

Forbidden is not R6.

It is a separate execution policy.

---

# 111. Risk Review Trigger

Classification SHOULD be reviewed when:

```text
capability semantics change
environment changes
blast radius changes
financial limit changes
new customer/external effect appears
new data class is exposed
automation becomes recurring/bulk
recovery behavior changes
```

---

# 112. Risk Classification and Versioning

A material risk reclassification is a governance-relevant change.

Example:

```text
R3 → R5
```

may require updates to:

```text
approval policy
autonomy policy
tool registry
agent contracts
tests
runbooks
```

---

# 113. Existing Engineering Risk Taxonomy

MGBOS Engineering Control Plane currently defines a scoped:

```text
R0
R1
R2
R3
```

classification for software-change/release risk.

That taxonomy is:

```text
CURRENT
VALID
SCOPED TO ENGINEERING CHANGE GOVERNANCE
```

---

# 114. Engineering Risk Does Not Override Ecosystem Risk

Current engineering example:

```text
money/authorization change
→ engineering R2
```

does NOT mean:

```text
record payment
→ ecosystem R2
```

They classify different things.

One classifies:

```text
software change risk
```

The other:

```text
runtime/action consequence
```

---

# 115. Future Engineering Mapping

Engineering taxonomy SHOULD eventually map to cross-system R0–R5 or adopt the shared vocabulary when doing so improves clarity.

Do not perform a rushed rename that destroys current engineering evidence/history.

---

# 116. Example — Payment Code Change

Two classifications may coexist:

```text
Engineering Change Risk:
current engineering taxonomy R2

Runtime Capability Risk:
mgbos.payment.record = R5
```

No contradiction.

Different scopes.

---

# 117. Example — Production Deployment

Engineering:

```text
release operation
→ current engineering R3
```

Cross-system runtime:

```text
production deployment
→ ecosystem R4
```

and possibly:

```text
R5
```

when affecting critical security/database/financial controls.

---

# 118. Risk and Approval Center

Future Approval Center SHOULD display:

```text
Action
Risk Class
Impact
Affected Resource
Evidence
Reversibility
Required Approval
```

Example:

```text
Record payment Rp10.000.000

Risk:
R5

Affected:
Invoice TS-INV-...

Evidence:
provider receipt
invoice balance
customer
```

---

# 119. Risk and Founder UX

Founder should not have to mentally infer risk from technical detail.

Command Center should surface:

```text
why this matters
what could happen
how reversible it is
what system verified
```

not just:

```text
"Are you sure?"
```

---

# 120. Risk and Notification Noise

Risk classification MAY influence notification priority.

But:

```text
risk
≠
notification priority
```

A low-risk event may require urgent attention.

A high-risk capability may simply be waiting for future approval.

---

# 121. Risk and Evidence Retention

Higher-risk actions SHOULD normally retain stronger/longer traceability.

Detailed retention periods belong to Data Governance.

---

# 122. Risk and Testing

Higher-risk capabilities require stronger tests.

Trend:

```text
R0
basic correctness

R1
scope/read authorization

R2
mutation + rollback/idempotency

R3
external-effect verification

R4
failure/recovery + approval boundaries

R5
negative tests + concurrency + idempotency +
audit + reconciliation + security + recovery
```

---

# 123. Risk and Simulation

Before granting autonomy to R3+ capability, realistic simulation/shadow/eval SHOULD be preferred where practical.

---

# 124. Risk and Kill Switch

Higher-risk autonomous capabilities SHOULD eventually be individually disableable.

Example:

```text
disable:
social.content.publish

without disabling:
mgbos.order.read
```

---

# 125. Risk and Tool Lifecycle

If a high-risk tool is:

```text
DEGRADED
```

or verification becomes unreliable, policy SHOULD restrict or disable mutation authority.

---

# 126. Risk and Verification Failure

If R4/R5 postcondition cannot be verified:

```text
do not claim success
```

Correct state may be:

```text
UNKNOWN
NEEDS_RECONCILIATION
```

---

# 127. Risk and External Provider Failure

For high-risk external effects:

```text
timeout
```

does not automatically justify retry.

First determine whether provider may already have executed the effect.

---

# 128. Risk and Bulk Automation

A capability initially safe as single action MAY require escalation when used as:

```text
bulk
scheduled
recursive
event-triggered
```

because automation amplifies mistake rate.

---

# 129. Risk and Recurrence

Example:

```text
send one reminder
→ R3
```

A malformed recurring workflow sending 100 reminders/hour:

```text
effective risk escalates
```

because blast radius changes.

---

# 130. Risk and Physical Production

Actions authorizing actual physical production deserve assessment of:

```text
material cost
vendor commitment
customer deadline
irreversibility
quantity
```

A prototype sample and mass production release need not share effective risk.

---

# 131. Risk and AI Creativity

Creative generation itself can be low risk.

Publishing externally changes classification.

```text
generate caption
→ R0/R2

publish caption
→ R3

publish sensitive brand statement
→ R4
```

---

# 132. Risk and Research

Research/read-only web activity is normally:

```text
R0/R1
```

unless it accesses restricted or privileged systems.

---

# 133. Risk and Engineering Read

Reading repository source normally:

```text
R1
```

Reading exposed production secrets from repository:

```text
security incident
+
high risk
```

Content sensitivity overrides read-only baseline.

---

# 134. Risk and Destructive Local Test

Resetting a verified disposable local database can be:

```text
R2
```

Resetting an uncertain/shared database can become:

```text
R4/R5
```

because environment identity changes consequence.

---

# 135. Risk and Human Error

Risk classification assumes:

> Any actor can make mistakes.

Higher controls exist not because actors are untrusted, but because consequences differ.

---

# 136. Risk and AI Error

Likewise, better model accuracy reduces probability of error.

Risk classification captures:

```text
impact if error occurs
```

not only likelihood.

---

# 137. Risk Formula Is Not Numeric Score

This model intentionally avoids fake precision such as:

```text
Risk Score = 73.42
```

R0–R5 is a categorical governance model.

Quantitative scoring MAY be added later for specific domains.

---

# 138. Risk Class Summary

| Class | Meaning | Typical Example |
|---|---|---|
| R0 | Informational | analysis/draft |
| R1 | Read-only | read order |
| R2 | Reversible low-impact mutation | internal draft/task |
| R3 | Operational/external mutation | customer message/vendor assignment |
| R4 | Sensitive/high-impact mutation | prod deploy/major override/bulk action |
| R5 | Money/security/production-critical | payment/refund/privileged security |

---

# 139. Default Human Involvement Direction

Not final Approval Policy, but baseline direction:

```text
R0
no approval

R1
no approval if authorized

R2
normally no per-action approval once authorized

R3
approval initially for autonomous AI execution

R4
human approval by default

R5
strict human/accountable control by default
```

Dedicated Approval Policy will define exact semantics.

---

# 140. Default Autonomy Direction

Not final Autonomy Policy:

```text
R0
can reach high autonomy quickly

R1
commonly safe for high autonomy

R2
may earn high autonomy

R3
may earn bounded autonomy with evidence

R4
autonomy tightly constrained

R5
strongly constrained; some capabilities may never reach L4
```

---

# 141. Risk Classification Anti-Patterns

### Based on Agent Name

```text
CFO = R5
```

Wrong.

### Based Only on Mutation

```text
read = R1 always
```

Wrong.

### Based Only on Amount

```text
small payment = R2
```

Wrong under current financial governance.

### Based on Confidence

```text
AI confidence 99%
→ lower risk
```

Wrong.

### Based on Founder Request

```text
Rizky asked
→ risk decreases
```

Wrong.

### Based on Reversibility Claim

```text
"we can undo it"
→ R2
```

without proven recovery.

Wrong.

---

# 142. Risk Classification Checklist

For consequential action ask:

```text
Does it mutate authoritative state?

Does it affect external parties?

Does it affect money?

Does it alter security/access?

Does it affect production?

Does it expose sensitive data?

How reversible is it?

How many records/people/businesses?

Does it trigger physical action?

Does it create contractual obligation?

Is it bulk/recurring/automated?

Is the environment production?

What happens if duplicated?

What happens if result is uncertain?
```

Then assign highest applicable class.

---

# 143. Machine-Enforceable Direction

Future capability registry MAY encode:

```yaml
baseline_risk: R3
risk_escalators:
  production: +1
  bulk: +1
  restricted_data: R5
```

Exact representation is future implementation.

Semantics defined here are canonical.

---

# 144. Deterministic Policy Direction

Where rules are known:

```text
payment.record
→ always at least R5
```

should be encoded deterministically.

Do not ask LLM to rediscover risk from scratch every execution.

---

# 145. Risk Evidence

Classification SHOULD be explainable.

Example:

```yaml
risk: R4
reasons:
  - production_environment
  - external_customer_effect
  - bulk_scope
```

This is especially useful for Approval Center.

---

# 146. Override Transparency

If policy escalates action:

```text
R3 baseline
→ R4 effective
```

system SHOULD expose why.

Hidden risk escalation makes approvals hard to trust.

---

# 147. Canonical Risk Examples

```text
Read customer order
→ R1

Read business summary
→ R1

Create internal follow-up task
→ R2

Prepare quotation
→ R2

Send customer follow-up
→ R3

Assign normal vendor production
→ R3

Issue normal PO
→ R3/R4 context-dependent

Publish approved social content
→ R3

Below-floor pricing override
→ R4

Production deploy
→ R4

Bulk customer communication
→ R4

Record customer payment
→ R5

Reverse customer payment
→ R5

Pay vendor bill
→ R5

Rotate payment provider secret
→ R5

Destructive production DB mutation
→ R5 or prohibited
```

---

# 148. Relationship to Permission Model

```text
Permission
→ may you attempt?

Risk
→ how consequential?

Approval
→ who must authorize this instance?

Autonomy
→ how independently may system execute?

Business Invariants
→ is resulting state valid?
```

All are required for trustworthy mutation.

---

# 149. Relationship to JARVIS

JARVIS Planner MAY propose risk.

Policy Engine MUST determine or verify final risk classification.

JARVIS reasoning alone is not risk authority.

---

# 150. Relationship to MGBOS

MGBOS commands SHOULD eventually expose baseline risk through a capability registry.

MGBOS remains responsible for business validity.

Cross-system governance owns R0–R5 meaning.

---

# 151. Relationship to n8n

Workflow definitions do not set their own risk classification arbitrarily.

Risk derives from the capabilities/actions executed.

A workflow containing R5 mutation is an R5 workflow.

---

# 152. Relationship to Engineering Agents

Engineering risk taxonomy remains scoped to engineering change governance.

This document governs cross-system runtime/action risk.

Future harmonization SHOULD preserve historical meaning.

---

# 153. Canonicalization Effect

Before this document, R0–R5 existed mainly in:

```text
JARVIS design notes
Governance session notes
```

After activation:

```text
docs.governance.cross-system-risk-classification
```

becomes the canonical semantic owner of ecosystem R0–R5.

The 27 September notes become provenance.

---

# 154. Architectural Invariants

1. Risk class reflects consequence, not actor intelligence.
2. Highest applicable risk wins.
3. Risk is separate from permission.
4. Risk is separate from approval.
5. Risk is separate from autonomy.
6. Risk is separate from priority.
7. Risk is separate from incident severity.
8. Read-only actions may still be high risk.
9. Financial mutations are normally R5.
10. Sensitive security mutations are normally R5.
11. Production-critical destructive operations are R5.
12. External communication has higher risk than drafting.
13. Blast radius may raise risk.
14. Environment may raise risk.
15. Data sensitivity may raise risk.
16. Automation scale may raise risk.
17. Uncertainty never justifies lowering risk.
18. Human request does not lower intrinsic risk.
19. AI confidence does not lower risk.
20. Successful history affects autonomy, not intrinsic consequence.
21. Composite workflow inherits its highest consequential risk.
22. Baseline capability risk may be escalated by context.
23. Risk should be deterministic where rules are known.
24. Forbidden action is distinct from R5.
25. Higher risk requires stronger controls and evidence.

---

# 155. North Star

The risk system succeeds when any future action can answer:

```text
What could go wrong?

How serious would it be?

How reversible is it?

Who or what could be affected?

Does it touch money, security, production, or sensitive data?

What is its baseline risk?

Did context raise the risk?

Which controls must become stronger because of that?
```

before execution occurs.

---

# 156. Final Principle

> **Risk measures consequence, not trust.**

The purpose of R0–R5 is not to prevent automation.

It is to make sure that as automation grows, the strength of control grows proportionally to what the system is capable of affecting.