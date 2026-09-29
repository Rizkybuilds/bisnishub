---
title: "TeeStock Decision Thresholds"
date: "2026-09-28"
bisnis: teestock
kategori: riset
status: active
tags:
  - bisnis/teestock
  - kategori/riset
  - teestock/canonical
  - teestock/metrics-experiments
document_id: "TS-MET-003"
version: "1.0"
category: "metrics-experiments"
business: "teestock"
last_updated: "2026-09-28"
path: "13-metrics-experiments/decision-thresholds.md"
depends_on:
  - "TS-MET-001"
  - "TS-MET-002"
  - "TS-FIN-001"
  - "TS-FIN-002"
  - "TS-FIN-003"
  - "TS-FIN-005"
  - "TS-OPS-001"
  - "TS-OPS-004"
  - "TS-OPS-005"
  - "TS-DAT-006"
  - "TS-TEC-006"
---


# TeeStock Decision Thresholds v1.0

> [!tip] **Canonical TeeStock Threshold, Guardrail, Escalation, Stop-Loss & Decision-Gate Framework**
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/13-metrics-experiments/kpi-framework|TS-MET-001: TeeStock KPI Framework]] • [[bisnis/teestock/13-metrics-experiments/experimentation-framework|TS-MET-002: TeeStock Experimentation Framework]] • [[bisnis/teestock/08-finance/financial-model|TS-FIN-001: TeeStock Financial Model]] • [[bisnis/teestock/08-finance/unit-economics|TS-FIN-002: TeeStock Unit Economics]] • [[bisnis/teestock/08-finance/pricing-framework|TS-FIN-003: TeeStock Pricing Framework]] • [[bisnis/teestock/08-finance/treasury-policy|TS-FIN-005: TeeStock Treasury Policy]] • [[bisnis/teestock/07-operations/operating-model|TS-OPS-001: TeeStock Operating Model]] • [[bisnis/teestock/07-operations/quality-control|TS-OPS-004: TeeStock Quality Control System]] • [[bisnis/teestock/07-operations/inventory-system|TS-OPS-005: TeeStock Inventory System]] • [[bisnis/teestock/11-data-mgbos/analytics-model|TS-DAT-006: TeeStock Analytics Model]] • [[bisnis/teestock/10-product-tech/automation-architecture|TS-TEC-006: TeeStock Automation Architecture]]


Dokumen ini mendefinisikan bagaimana TeeStock menentukan kapan sebuah metric membutuhkan perhatian, approval, intervention, escalation, stop-loss, pause, rollback, scale, reorder, repricing, atau perubahan keputusan melalui configurable threshold rules di MGBOS.

---

# 1. Purpose

Decision Thresholds menjawab:

> **Pada angka atau kondisi apa TeeStock berhenti hanya “melihat dashboard” dan mulai melakukan tindakan tertentu?**

Canonical principle:

> **Metrics describe reality. Thresholds decide when reality requires action.**

---

# 2. Canonical Definition

> **TeeStock Decision Thresholds adalah governed rule framework yang menerjemahkan canonical metrics, financial floors, operational tolerances, risk limits, experiment guardrails, and business conditions menjadi explicit action triggers dengan owner, severity, effective period, exceptions, and escalation paths.**

---

# 3. Threshold ≠ Target

Critical:

```text
TARGET
=
performance we want.

THRESHOLD
=
point at which action is required.
```

---

# 4. Example

```text
TARGET:
On-Time Fulfillment ≥ 97%

WATCH THRESHOLD:
< 95%

CRITICAL THRESHOLD:
< 90%
```

Illustrative only.

Exact production values must be calibrated.

---

# 5. Threshold ≠ Forecast

Forecast estimates future value.

Threshold determines response.

---

# 6. Threshold ≠ KPI

KPI measures performance.

Threshold evaluates KPI state.

---

# 7. Threshold ≠ Policy

Policy defines principle/rule.

Threshold defines measurable trigger inside policy.

---

# 8. Threshold Architecture

Canonical:

```text
METRIC / CONDITION
↓
THRESHOLD
↓
SEVERITY
↓
OWNER
↓
ACTION
↓
ESCALATION
↓
RESOLUTION
```

---

# 9. Decision State

Canonical states:

```text
HEALTHY
WATCH
ACTION_REQUIRED
CRITICAL
```

---

# 10. Healthy

Performance within acceptable operating range.

---

# 11. Watch

Early signal.

Requires monitoring or light investigation.

---

# 12. Action Required

Material deviation requiring assigned intervention.

---

# 13. Critical

Business/customer/financial risk requiring immediate escalation or protective action.

---

# 14. Threshold Categories

Canonical:

```text
PERFORMANCE THRESHOLD
FINANCIAL FLOOR
RISK LIMIT
QUALITY TOLERANCE
CAPACITY LIMIT
APPROVAL GATE
STOP-LOSS
SCALE GATE
```

---

# 15. Performance Threshold

Indicates degraded performance.

---

# 16. Financial Floor

Minimum acceptable economics.

---

# 17. Risk Limit

Maximum acceptable exposure.

---

# 18. Quality Tolerance

Maximum defect/error tolerance.

---

# 19. Capacity Limit

Maximum safe operating load.

---

# 20. Approval Gate

Point above which human authorization is required.

---

# 21. Stop-Loss

Condition requiring pause/termination.

---

# 22. Scale Gate

Minimum evidence required before expanding.

---

# 23. Canonical Rule

> **A threshold without a defined action is only decoration.**

---

# 24. Threshold Record

Every material threshold should eventually contain:

```text
threshold_id
metric_id / condition
scope
operator
value
severity
action
owner
effective_from
effective_to
version
```

---

# 25. Threshold Scope

Potential:

```text
COMPANY
BUSINESS LINE
CHANNEL
PRODUCT
PROJECT
PARTNER
CREATOR
WORKFLOW
AGENT
```

---

# 26. Same Metric, Different Threshold

Allowed when economics differ materially.

Example:

```text
Retail Product Margin Floor
≠
B2B Project Margin Floor
```

---

# 27. Scope Must Be Explicit

Canonical.

---

# 28. Threshold Operators

Potential:

```text
<
<=
>
>=
=
BETWEEN
COUNT
DURATION
```

---

# 29. Condition-Based Thresholds

Not all thresholds are numeric.

Example:

```text
Payment reconciliation unresolved
> X hours
```

or:

```text
Rights status = EXPIRED
```

---

# 30. Threshold Hierarchy

Canonical:

```text
ENTERPRISE / BUSINESS
↓
DOMAIN
↓
PROCESS
↓
ENTITY
```

---

# 31. Threshold Precedence

More specific approved threshold can override generic threshold where intentionally configured.

---

# 32. No Hidden Override

Canonical.

---

# 33. Threshold Versioning

Threshold changes must preserve history.

---

# 34. Effective Period

Store:

```text
effective_from
effective_to
```

---

# 35. Historical Decision

Should remain explainable using threshold active at that time.

---

# 36. Threshold Calibration

Canonical:

> **Do not invent precision before the business has evidence.**

---

# 37. Initial Threshold Sources

Potential:

```text
LEGAL REQUIREMENT
CONTRACT
FINANCIAL MODEL
HISTORICAL BASELINE
SLA
EXPERIMENT
MANAGEMENT DECISION
```

---

# 38. Initial Stage

Where historical data is insufficient:

use:

```text
PROVISIONAL THRESHOLD
```

---

# 39. Provisional Threshold

Must be labeled.

---

# 40. Provisional Threshold Review

Review after enough real operational data exists.

---

# 41. Threshold Confidence

Potential:

```text
PROVISIONAL
VALIDATED
CANONICAL
```

---

# 42. Canonical Threshold

Has sufficient operational evidence and approval.

---

# 43. Financial Threshold Architecture

Core categories:

```text
MARGIN
CASH
AR
AP
CAC
DISCOUNT
QUOTE
INVENTORY
```

---

# 44. Margin Floor

Canonical:

> **No transaction should knowingly fall below its applicable economic floor without explicit authority.**

---

# 45. Margin Floors

Potential hierarchy:

```text
CM1 FLOOR
CM2 FLOOR
CM3 FLOOR
CM4 FLOOR
```

depending transaction type.

---

# 46. Primary Commercial Floor

Recommended long-term:

```text
CM4
```

where allocation reliability is sufficient.

---

# 47. Early Stage Floor

If CM4 attribution is immature:

use simpler:

```text
GROSS MARGIN
or
CM1 / CM2
```

temporarily.

---

# 48. Margin Floor ≠ Target Margin

Canonical.

---

# 49. Example

```text
TARGET CM4:
20%

FLOOR:
12%

EXCEPTION:
8–12% requires approval

STOP:
<8%
```

Illustrative only.

---

# 50. Margin Floor Scope

May differ by:

```text
COMMERCE
B2B
CUSTOM
CREATOR
WHOLESALE
```

---

# 51. Strategic Loss-Leader

Possible only when:

```text
PURPOSE
BUDGET
DURATION
OWNER
```

are explicit.

---

# 52. No Permanent “Strategic” Loss

Canonical.

---

# 53. Discount Threshold

Discount beyond configured limit requires approval.

---

# 54. Discount Guardrail

Evaluate:

```text
DISCOUNT %
+
CM4 AFTER DISCOUNT
```

not discount alone.

---

# 55. Promotion Stop-Loss

Pause promotion if:

```text
CM4 < floor
```

or other guardrail breached.

---

# 56. Quote Margin Floor

B2B/Services quote must not be approved below minimum contribution floor without exception authority.

---

# 57. Quote Approval Bands

Potential:

```text
ABOVE TARGET
auto/manual normal approval

BETWEEN TARGET AND FLOOR
commercial review

BELOW FLOOR
senior approval / reject
```

---

# 58. Price Exception

Must record reason.

---

# 59. Pricing Override Audit

Store:

```text
WHO
WHY
OLD PRICE
NEW PRICE
EXPECTED MARGIN
```

---

# 60. Cash Threshold Architecture

Canonical:

```text
AVAILABLE CASH
↓
OPERATING BUFFER
↓
COMMITMENT CONTROL
```

---

# 61. Minimum Operating Cash Buffer

Should be expressed as:

```text
WEEKS OF CORE OPERATING CASH NEED
```

rather than arbitrary rupiah only.

---

# 62. Initial Cash Buffer

Exact target should be calibrated from real burn profile.

---

# 63. Cash Watch

Triggered when Available Cash approaches minimum buffer.

---

# 64. Cash Action Required

Potential actions:

```text
FREEZE NONESSENTIAL SPEND
ACCELERATE COLLECTIONS
DEFER OPTIONAL CAPEX
REVIEW INVENTORY BUY
```

---

# 65. Cash Critical

Potential:

```text
AVAILABLE CASH
<
near-term committed obligations
```

requires immediate Treasury escalation.

---

# 66. Cash Runway Threshold

Useful during negative cash generation.

---

# 67. Runway Watch

Could trigger when projected runway falls below management-approved horizon.

---

# 68. Runway Must Use Forecast

Not current bank balance only.

---

# 69. Purchase Commitment Gate

Before significant PO:

```text
POST-PURCHASE CASH
>=
required buffer
```

unless specifically approved.

---

# 70. CapEx Gate

Same principle.

---

# 71. AR Threshold Architecture

Potential:

```text
CURRENT
WATCH
OVERDUE
CRITICAL
```

---

# 72. Customer Credit Limit

Each approved B2B credit account should have:

```text
CREDIT LIMIT
PAYMENT TERMS
OVERDUE TOLERANCE
```

---

# 73. Credit Hold

Potential condition:

```text
OVERDUE BALANCE
>
defined threshold
```

---

# 74. Credit Hold Action

Prevent new credit order release.

Cash/prepaid orders may remain possible depending policy.

---

# 75. Customer-Level Credit Risk

Should not rely only on aggregate AR.

---

# 76. AP Threshold

Prioritize by:

```text
DUE DATE
CRITICALITY
CASH
SUPPLIER IMPACT
```

---

# 77. AP Critical

Potential when approved payable cannot be funded by due date.

---

# 78. CAC Threshold Architecture

Canonical:

```text
CAC
must be evaluated against
CONTRIBUTION
```

---

# 79. CAC Ceiling

Long-term preferred:

```text
CAC
<=
expected recoverable contribution
within approved payback horizon
```

---

# 80. CAC Payback Threshold

Different business lines may use different acceptable horizons.

---

# 81. Paid Acquisition Stop-Loss

Pause scale when:

```text
CAC > ceiling
```

for sufficient sample/window.

---

# 82. Small Sample Protection

Do not kill campaign based on one conversion.

---

# 83. Channel Scale Gate

Scale only when:

```text
CAC acceptable
+
CM4 acceptable
+
refund acceptable
+
customer quality acceptable
```

---

# 84. Inventory Threshold Architecture

Core:

```text
REORDER
SAFETY STOCK
STOCKOUT
AGING
DEAD STOCK
```

---

# 85. Reorder Point

Canonical conceptual formula:

```text
EXPECTED DEMAND DURING LEAD TIME
+
SAFETY STOCK
```

---

# 86. Reorder Point ≠ Static Number Forever

Update as demand/lead time changes.

---

# 87. Safety Stock

Depends on:

```text
DEMAND VARIABILITY
LEAD TIME
SERVICE LEVEL
```

---

# 88. Early V1

Can use simple manually calibrated min/max levels.

---

# 89. Stockout Watch

Triggered when ATS approaches safety floor.

---

# 90. Stockout Critical

When expected demand cannot be fulfilled.

---

# 91. Aging Threshold

Example bands:

```text
0–30
31–60
61–90
90+
```

are analytical starting points, not universal business truth.

---

# 92. Category-Specific Aging

Essentials may tolerate different inventory life than trend-driven Originals.

---

# 93. Dead Stock Threshold

Should combine:

```text
AGE
+
VELOCITY
+
FUTURE DEMAND
```

---

# 94. Dead Stock Action

Potential:

```text
REMERCHANDISE
BUNDLE
DISCOUNT
LIQUIDATE
WRITE DOWN
```

---

# 95. Markdown Gate

Discount inventory only if resulting economics remain understood.

---

# 96. Inventory Investment Gate

New stock buy requires:

```text
DEMAND EVIDENCE
+
CASH CAPACITY
+
EXPECTED ECONOMICS
```

---

# 97. Originals Inventory Gate

Higher caution due fashion/design uncertainty.

---

# 98. Small-Batch First

Canonical.

---

# 99. Product Threshold Architecture

Potential:

```text
LAUNCH
SCALE
REORDER
PAUSE
RETIRE
```

---

# 100. Product Launch Gate

Requires:

```text
RIGHTS CLEAR
PRODUCT READY
PRICE VALID
ECONOMICS ACCEPTABLE
FULFILLMENT READY
```

---

# 101. Product Scale Gate

Potential evidence:

```text
DEMAND
CM4
RETURN
SELL-THROUGH
```

---

# 102. Reorder Gate

Potential:

```text
SELL-THROUGH
+
REMAINING ATS
+
EXPECTED DEMAND
+
LEAD TIME
```

---

# 103. Product Pause Gate

Potential:

```text
DEFECT SPIKE
RETURN SPIKE
RIGHTS ISSUE
NEGATIVE MARGIN
```

---

# 104. Product Retirement Gate

Potential:

```text
LOW DEMAND
POOR CONTRIBUTION
HIGH AGING
STRATEGIC EXIT
```

---

# 105. Originals Collection Thresholds

Collection decisions:

```text
SCALE
ITERATE
ARCHIVE
```

---

# 106. Collection Scale Gate

Should evaluate:

```text
FULL-PRICE DEMAND
SELL-THROUGH
CM4
RETURN
CUSTOMER SIGNAL
```

---

# 107. Label Graduation Gate

A concept label should not become independent label merely due social engagement.

---

# 108. Graduation Evidence

Potential:

```text
MULTIPLE SUCCESSFUL RELEASES
REPEAT DEMAND
POSITIVE CONTRIBUTION
DISTINCT AUDIENCE
OPERATIONAL VIABILITY
```

---

# 109. Label Pause Gate

If repeated releases fail economic/demand thresholds.

---

# 110. Services Threshold Architecture

Core:

```text
LEAD QUALIFICATION
QUOTE
PROJECT
SCOPE
AR
```

---

# 111. Lead Qualification

Current canonical starting rule already established:

```text
BUDGET ≥ RP10,000,000
+
NEED LENGTH ≥ 20 CHARACTERS
+
VALID EMAIL
```

for the existing Decision Engine context.

---

# 112. Qualification Rule Is Versioned

Canonical.

This threshold may evolve with actual sales data.

---

# 113. Qualification ≠ Acceptance

Qualified lead still requires commercial assessment.

---

# 114. Opportunity Priority Threshold

Potential score based on:

```text
BUDGET
FIT
TIMELINE
DECISION AUTHORITY
PROBABILITY
```

later.

---

# 115. Quote Expiry

Expired quote requires refresh before conversion.

---

# 116. Scope-Change Gate

Material change triggers:

```text
CHANGE ORDER
or
REQUOTE
```

---

# 117. Scope Change Threshold

Can be triggered by:

```text
QUANTITY
SPEC
DEADLINE
MATERIAL
DESIGN
```

change beyond permitted tolerance.

---

# 118. Project Margin Watch

Expected contribution dropping toward floor triggers review.

---

# 119. Project Margin Stop

Do not continue uncontrolled scope creep below floor without approval.

---

# 120. Project Delay Threshold

Compare to committed milestone.

---

# 121. Operations Threshold Architecture

Core:

```text
SLA
CYCLE TIME
BACKLOG
QUALITY
REWORK
CAPACITY
```

---

# 122. SLA Watch

Potential when due date risk becomes probable before actual lateness.

---

# 123. SLA Breach

When committed time is missed.

---

# 124. Proactive Threshold

Canonical:

> **Good operational thresholds trigger before failure, not only after failure.**

---

# 125. Work Queue Aging

Tasks/jobs older than normal process window become Watch.

---

# 126. Critical Queue Aging

Escalate when customer/financial outcome at risk.

---

# 127. Backlog Threshold

Should consider:

```text
OPEN WORK
/
AVAILABLE CAPACITY
```

not raw count only.

---

# 128. Capacity Utilization

Do not target 100%.

---

# 129. Why

100% planned utilization destroys buffer for:

```text
VARIABILITY
REWORK
URGENT JOBS
```

---

# 130. Capacity Watch

Trigger when planned load approaches safe operational capacity.

---

# 131. Capacity Critical

Block new commitments or reroute work when overload threatens SLA.

---

# 132. QC Threshold Architecture

Core:

```text
PASS RATE
DEFECT RATE
FIRST-PASS YIELD
REWORK
SCRAP
```

---

# 133. QC Pass Threshold

Should vary by process/product where needed.

---

# 134. Critical Defect

Certain defect classes may trigger immediate hold regardless aggregate rate.

---

# 135. Critical Defect Examples

Potential:

```text
WRONG CUSTOMER ARTWORK
WRONG PERSONALIZATION
SAFETY ISSUE
MATERIAL RIGHTS VIOLATION
```

---

# 136. First-Pass Yield Watch

Repeated decline indicates process instability.

---

# 137. Rework Threshold

Set by:

```text
RATE
COST
or
JOB FREQUENCY
```

---

# 138. Scrap Threshold

Financial + process control.

---

# 139. Quality Hold

Product/lot may be blocked when defect signal exceeds tolerance.

---

# 140. Fulfillment Threshold Architecture

Core:

```text
PICK ACCURACY
PACK ACCURACY
SHIP SLA
DELIVERY FAILURE
```

---

# 141. Fulfillment Accuracy Critical

Wrong customer personalization/order is high severity even if rare.

---

# 142. Shipment Delay Threshold

Should consider carrier service promise.

---

# 143. Delivery Failure Spike

May trigger carrier review/routing change.

---

# 144. Customer Service Threshold Architecture

Core:

```text
FIRST RESPONSE
RESOLUTION
REOPEN
CASE VOLUME
ESCALATION
```

---

# 145. First Response Threshold

Depends on support channel/business hours.

---

# 146. Resolution Threshold

Depends on case severity/category.

---

# 147. Reopen Rate Watch

Signals superficial resolutions.

---

# 148. Complaint Spike

Significant increase by product/reason triggers root-cause investigation.

---

# 149. Return Threshold Architecture

Monitor:

```text
PRODUCT
SKU
SIZE
REASON
CHANNEL
```

---

# 150. Product Return Watch

If rate exceeds normal baseline by material amount.

---

# 151. Return Critical

May trigger product pause when:

```text
NONCONFORMITY
DEFECT
MISLEADING DESCRIPTION
```

appears systematic.

---

# 152. Refund Threshold

High refund value/rate requires investigation.

---

# 153. Large Refund Approval

Above configured value requires elevated authorization.

---

# 154. Customer Remedy Authority Bands

Potential:

```text
LOW VALUE
frontline authority

MEDIUM VALUE
manager approval

HIGH VALUE
finance/management approval
```

---

# 155. Creator Threshold Architecture

Core:

```text
ACTIVATION
RIGHTS
EARNINGS
PAYOUT
PERFORMANCE
```

---

# 156. Creator Activation Gate

Potential:

```text
AGREEMENT ACTIVE
+
ARTWORK APPROVED
+
PRODUCT LIVE
```

---

# 157. Creator Inactivity

Can be flagged after defined period without qualifying activity.

---

# 158. Creator Product Scale Gate

Use:

```text
DEMAND
CM4 AFTER ROYALTY
RETURN
```

---

# 159. Creator Earnings Threshold

Unusual earning variance triggers reconciliation.

---

# 160. Payout Minimum

If contract allows minimum payout threshold:

system enforces exact agreed rule.

---

# 161. Payout Hold Threshold

Potential trigger:

```text
DISPUTE
FRAUD SIGNAL
MISSING PAYMENT DETAILS
```

not arbitrary performance.

---

# 162. Partner Threshold Architecture

Core:

```text
QUALITY
ON-TIME
COST
CAPACITY
CLAIMS
```

---

# 163. Partner Approval Gate

Before Active:

```text
CAPABILITY VERIFIED
+
TEST / SAMPLE
+
COMMERCIAL TERMS
+
AGREEMENT
```

---

# 164. Partner Scale Gate

Increase volume only after acceptable pilot performance.

---

# 165. Partner On-Time Watch

Repeated SLA degradation triggers review.

---

# 166. Partner Quality Critical

Critical defects can suspend routing immediately.

---

# 167. Partner Claim Threshold

Repeated claims trigger:

```text
CORRECTIVE ACTION
CAPABILITY REVIEW
or
SUSPENSION
```

---

# 168. Partner Cost Variance

Actual cost above approved rate/quote requires investigation.

---

# 169. Partner Capacity Threshold

Do not route above accepted capacity without explicit confirmation.

---

# 170. Partner Suspension Gate

Potential:

```text
CRITICAL QUALITY FAILURE
REPEATED SLA FAILURE
RIGHTS / CONFIDENTIALITY BREACH
FRAUD
```

---

# 171. Marketing Threshold Architecture

Core:

```text
CAC
CONVERSION
CM4
SPEND
FREQUENCY
CUSTOMER QUALITY
```

---

# 172. Campaign Learning Phase

Avoid premature scale decisions.

---

# 173. Campaign Stop-Loss

Potential:

```text
SPEND reaches X
with no qualifying outcome
```

---

# 174. Spend Threshold

Should be linked to acceptable CAC/economic risk.

---

# 175. ROAS Threshold

Diagnostic only.

Do not use alone.

---

# 176. Campaign Scale Gate

Canonical:

```text
ACQUISITION WORKS
+
CM4 WORKS
+
GUARDRAILS HEALTHY
```

---

# 177. Creative Fatigue Threshold

Potential based on:

```text
FREQUENCY
CTR DECLINE
CONVERSION DECLINE
```

where applicable.

---

# 178. Channel Concentration Threshold

Watch if too much contribution depends on one external channel.

---

# 179. Concentration Risk

Could apply to:

```text
MARKETPLACE
CREATOR
PARTNER
SUPPLIER
CUSTOMER
```

---

# 180. Supplier Concentration Threshold

If one supplier becomes critical single point of failure, contingency required.

---

# 181. Customer Concentration Threshold

Large B2B customer dependence may require risk review.

---

# 182. Experiment Threshold Architecture

Canonical:

```text
LAUNCH
STOP
SCALE
GUARDRAIL
```

---

# 183. Experiment Launch Gate

Require:

```text
HYPOTHESIS
PRIMARY METRIC
GUARDRAIL
DECISION RULE
INSTRUMENTATION
```

---

# 184. Experiment Success Gate

Must be defined pre-test.

---

# 185. Experiment Scale Gate

Require:

```text
PRIMARY OUTCOME ACCEPTABLE
+
GUARDRAILS ACCEPTABLE
+
DATA QUALITY VALID
```

---

# 186. Experiment Stop-Loss

Stop when:

```text
CUSTOMER HARM
FINANCIAL LOSS
LEGAL RISK
QUALITY FAILURE
```

crosses predefined limit.

---

# 187. Experiment Inconclusive Gate

If:

```text
SAMPLE INSUFFICIENT
INSTRUMENTATION BROKEN
CONFOUNDING MATERIAL
```

do not call result win/loss.

---

# 188. Automation Threshold Architecture

Core:

```text
SUCCESS
ERROR
RETRY
EXCEPTION
LATENCY
```

---

# 189. Automation Success Rate

Track outcome, not workflow completion only.

---

# 190. Automation Error Threshold

Different by risk.

Example:

```text
CONTENT TAGGING
can tolerate more errors

PAYMENT WORKFLOW
cannot.
```

---

# 191. Critical Automation

Potential:

```text
PAYMENT
REFUND
INVENTORY
PAYOUT
```

requires near-zero uncontrolled business-error tolerance.

---

# 192. Retry Threshold

Limit retries to avoid infinite loops.

---

# 193. Dead-Letter Trigger

After retry policy exhausted:

```text
CREATE EXCEPTION
```

---

# 194. Automation Exception Rate

Rising exception rate may indicate process not ready for automation.

---

# 195. Rollback Threshold

If automation causes material errors:

```text
DISABLE
↓
FALLBACK TO MANUAL
```

---

# 196. AI Threshold Architecture

Canonical:

```text
TASK SUCCESS
CRITICAL ERROR
HUMAN CORRECTION
CONFIDENCE
COST
LATENCY
```

---

# 197. AI Autonomy Levels

```text
L0 OBSERVE
L1 RECOMMEND
L2 DRAFT
L3 EXECUTE WITH APPROVAL
L4 LOW-RISK EXECUTION
L5 EXCEPTION-BASED AUTONOMY
```

---

# 198. AI Promotion Gate

Move to higher autonomy only when:

```text
QUALITY THRESHOLD MET
+
CRITICAL ERROR BELOW LIMIT
+
AUDIT WORKS
+
ESCALATION WORKS
```

---

# 199. AI Critical Error

One severe error may justify immediate rollback regardless average success.

---

# 200. Critical Error Examples

```text
WRONG PAYMENT
WRONG REFUND
INVENTED PRICE
INVENTED STOCK
DATA LEAK
UNAUTHORIZED CUSTOMER MESSAGE
```

---

# 201. AI Confidence Threshold

Model self-reported confidence alone is insufficient.

---

# 202. Decision Confidence

Should combine:

```text
TASK TYPE
VALIDATION
POLICY
DATA COMPLETENESS
```

---

# 203. AI Escalation Threshold

Escalate when:

```text
DATA MISSING
POLICY CONFLICT
LOW CONFIDENCE
HIGH RISK
```

---

# 204. AI Cost Threshold

Agent run should have maximum:

```text
TOKEN / MODEL COST
TOOL CALLS
STEPS
TIME
```

---

# 205. Agent Loop Limit

Prevents runaway orchestration.

---

# 206. AI Latency Threshold

Use task-specific limit.

Customer chat differs from overnight analysis.

---

# 207. AI Tool Permission Gate

No new tool authority until:

```text
RISK REVIEW
+
PERMISSION SCOPE
+
TEST
+
AUDIT
```

---

# 208. Jarvis Threshold Role

Jarvis should not invent thresholds.

---

# 209. Jarvis Reads Active Threshold Registry

Canonical.

---

# 210. Example

User:

> Kenapa campaign ini dihentikan?

Jarvis should trace:

```text
CAMPAIGN
→ CAC THRESHOLD
→ BREACH
→ AUTOMATION / OWNER DECISION
```

---

# 211. Jarvis Threshold Explanation

Should explain:

```text
CURRENT VALUE
THRESHOLD
SEVERITY
ACTION
OWNER
```

---

# 212. Jarvis May Recommend Threshold Review

But cannot silently alter canonical threshold.

---

# 213. Threshold Change Authority

Depends on domain.

---

# 214. Finance Threshold Owner

Finance for:

```text
MARGIN
CASH
CREDIT
```

---

# 215. Operations Threshold Owner

Operations for:

```text
SLA
CAPACITY
QUALITY
```

with Quality/Data input.

---

# 216. Marketing Threshold Owner

Marketing + Finance for:

```text
CAC
SPEND
```

---

# 217. AI Threshold Owner

MGBOS/AI Governance + affected business owner.

---

# 218. Legal Threshold Owner

Legal/policy owner for rights/compliance gates.

---

# 219. Threshold Change Request

Should record:

```text
CURRENT
PROPOSED
RATIONALE
EVIDENCE
EFFECTIVE DATE
APPROVER
```

---

# 220. Threshold Change Must Not Rewrite History

Canonical.

---

# 221. Threshold Calibration Loop

```text
INITIAL THRESHOLD
↓
OPERATING DATA
↓
REVIEW
↓
CALIBRATION
↓
VALIDATED THRESHOLD
```

---

# 222. Too Tight Threshold

Causes excessive alerts and unnecessary blockage.

---

# 223. Too Loose Threshold

Allows damage before action.

---

# 224. Alert Fatigue

Canonical risk.

---

# 225. Threshold Alert Deduplication

If existing incident is open:

do not create duplicate alert every minute.

---

# 226. Hysteresis

Useful for noisy metrics.

---

# 227. Example

Do not switch repeatedly:

```text
WATCH
HEALTHY
WATCH
HEALTHY
```

from tiny fluctuations.

---

# 228. Recovery Threshold

Can differ from breach threshold.

---

# 229. Example

```text
BREACH:
< 95%

RECOVER:
≥ 96%
```

illustrative.

---

# 230. Consecutive Breach Rule

Some metrics should trigger only after:

```text
N consecutive periods
```

to reduce noise.

---

# 231. Immediate-Breach Metrics

Certain risks should trigger on first occurrence.

Examples:

```text
UNAUTHORIZED PAYOUT
RIGHTS EXPIRED
CRITICAL DEFECT
DATA BREACH
```

---

# 232. Threshold Window

Every metric threshold needs time context.

---

# 233. Example

```text
RETURN RATE > X
over trailing 30 days
```

differs from one-day spike.

---

# 234. Rolling Window

Potential:

```text
7 DAY
30 DAY
90 DAY
```

---

# 235. Period Threshold

Potential:

```text
DAILY
WEEKLY
MONTHLY
```

---

# 236. Cohort Threshold

Useful for:

```text
RETENTION
CREATOR ACTIVATION
CUSTOMER QUALITY
```

---

# 237. Sample-Size Gate

No threshold conclusion if denominator too small.

---

# 238. Example

Return rate of:

```text
1 / 2 orders
```

should not automatically trigger portfolio shutdown.

---

# 239. Minimum Observation Count

Configure where needed.

---

# 240. Statistical Control

Later-stage operations may use:

```text
CONTROL LIMITS
ANOMALY DETECTION
```

instead of static thresholds.

---

# 241. Anomaly ≠ Threshold Breach

Canonical.

---

# 242. Anomaly

Unexpected relative change.

---

# 243. Threshold

Explicit business limit.

---

# 244. Both Can Trigger Investigation

But differently.

---

# 245. Threshold Data Quality Gate

Before acting automatically:

```text
DATA FRESH?
COMPLETE?
VALID?
```

---

# 246. Stale Data

May trigger:

```text
DATA_EXCEPTION
```

rather than business action.

---

# 247. Example

Do not pause ads because analytics import failed and CAC appears infinite.

---

# 248. Missing Data Guard

Canonical.

---

# 249. Automation Action Levels

Threshold action classes:

```text
NOTIFY
CREATE TASK
REQUEST APPROVAL
PAUSE
BLOCK
ROLLBACK
```

---

# 250. Notify

Low consequence.

---

# 251. Create Task

Assigned human follow-up.

---

# 252. Request Approval

Decision required.

---

# 253. Pause

Temporary operational hold.

---

# 254. Block

Prevent action that would violate hard constraint.

---

# 255. Rollback

Return to prior safe state.

---

# 256. Hard Threshold

Canonical:

```text
cannot be overridden
without authorized exception
```

---

# 257. Soft Threshold

Creates warning/recommendation.

---

# 258. Hard Threshold Examples

Potential:

```text
EXPIRED RIGHTS
UNAUTHORIZED PAYMENT
INVALID APPROVAL
```

---

# 259. Soft Threshold Examples

Potential:

```text
CAC WATCH
INVENTORY AGING
CONVERSION DROP
```

---

# 260. Exception Authority

Certain thresholds may be overridden.

---

# 261. Exception Record

Must include:

```text
THRESHOLD
ENTITY
REASON
APPROVER
EXPIRY
```

---

# 262. Temporary Exception

Preferred over permanent manual override.

---

# 263. Exception Expiry

Canonical.

---

# 264. Permanent Override

Should instead become formal threshold/policy change.

---

# 265. Founder Override

Founder authority should still be auditable.

---

# 266. “Founder Said So” Is Not Data Model

Canonical.

---

# 267. Decision Threshold Registry

Future MGBOS should maintain:

```text
Threshold ID
Metric / Condition
Scope
Severity
Rule
Action
Owner
Approver
Effective Period
Status
```

---

# 268. Threshold Status

Potential:

```text
DRAFT
PROVISIONAL
ACTIVE
SUSPENDED
SUPERSEDED
ARCHIVED
```

---

# 269. Threshold Evaluation

Future:

```text
NEW METRIC VALUE
↓
RULE ENGINE
↓
THRESHOLD EVALUATION
↓
ACTION
```

---

# 270. Threshold Event

Potential:

```text
threshold.breached
threshold.recovered
threshold.exception_granted
```

---

# 271. Breach Record

Potential:

```text
threshold_id
entity_id
metric_value
occurred_at
severity
status
```

---

# 272. Breach Lifecycle

```text
OPEN
ACKNOWLEDGED
ACTIONING
RESOLVED
CLOSED
```

---

# 273. Recovery

Threshold recovery does not automatically prove root cause fixed.

---

# 274. Post-Incident Review

Material Critical breaches should produce learning.

---

# 275. Threshold-to-Decision Lineage

Canonical:

```text
METRIC
↓
THRESHOLD BREACH
↓
EXCEPTION / TASK
↓
DECISION
↓
ACTION
```

---

# 276. Founder Control Center

Potential threshold widgets:

```text
CASH CRITICAL
MARGIN BELOW FLOOR
LATE ORDERS
RETURN SPIKE
CRITICAL EXCEPTIONS
```

---

# 277. Operations Control Center

Potential:

```text
SLA BREACH
CAPACITY
QC
REWORK
BLOCKED JOBS
```

---

# 278. Finance Control Center

Potential:

```text
CASH
AR
AP
MARGIN
REFUNDS
```

---

# 279. Marketing Control Center

Potential:

```text
CAC
SPEND
CONVERSION
GUARDRAILS
```

---

# 280. AI Control Center

Potential:

```text
CRITICAL ERROR
FAILED RUNS
COST
LATENCY
ESCALATIONS
```

---

# 281. Recommended V1 Threshold Philosophy

Start with:

```text
FEW
MATERIAL
ACTIONABLE
```

thresholds.

---

# 282. V1 Financial Thresholds

Prioritize:

```text
MARGIN FLOOR
CASH BUFFER
CREDIT HOLD
QUOTE FLOOR
```

---

# 283. V1 Operations Thresholds

Prioritize:

```text
LATE ORDER
QC FAILURE
REWORK
CAPACITY OVERLOAD
```

---

# 284. V1 Inventory Thresholds

Prioritize:

```text
REORDER
LOW STOCK
AGING
```

---

# 285. V1 Marketing Thresholds

Prioritize:

```text
SPEND STOP-LOSS
CAC WATCH
CM4 GUARDRAIL
```

---

# 286. V1 Creator Thresholds

Prioritize:

```text
RIGHTS ACTIVE
EARNING VALIDATION
PAYOUT ELIGIBILITY
```

---

# 287. V1 Partner Thresholds

Prioritize:

```text
QC
ON-TIME
CLAIM
```

---

# 288. V1 Automation Thresholds

Prioritize:

```text
FAILURE
RETRY
DLQ
```

---

# 289. V1 AI Thresholds

Prioritize:

```text
CRITICAL ERROR
PERMISSION
ESCALATION
COST CAP
```

---

# 290. V1 Avoid

Do not immediately implement:

```text
HUNDREDS OF THRESHOLDS
PREDICTIVE RISK ENGINE
AUTONOMOUS PRICE CHANGES
AUTONOMOUS CASH ALLOCATION
BLACK-BOX AI RISK SCORE
```

---

# 291. V2 Expansion

Potential:

```text
CHANNEL-SPECIFIC FLOORS
COHORT THRESHOLDS
PARTNER ROUTING RULES
ALERT DEDUPLICATION
```

---

# 292. V3 Expansion

Potential:

```text
DYNAMIC REORDER
ANOMALY DETECTION
CONTROL LIMITS
FORECAST-BASED CASH ALERTS
```

---

# 293. V4 Expansion

Potential:

```text
PREDICTIVE THRESHOLDS
DYNAMIC CAPACITY
RISK-BASED AUTONOMY
```

---

# 294. V5 Expansion

Potential:

```text
JARVIS
monitoring thresholds,
diagnosing breaches,
preparing actions,
and escalating only material exceptions.
```

---

# 295. Threshold Creation Gate

Require:

```text
MEANINGFUL METRIC / CONDITION
+
BUSINESS CONSEQUENCE
+
DEFINED ACTION
+
OWNER
```

---

# 296. Threshold Automation Gate

Before automatic action:

```text
DATA RELIABLE
+
RULE DETERMINISTIC
+
ACTION REVERSIBLE / SAFE
+
EXCEPTION PATH
```

---

# 297. Hard Block Gate

Use only when violating rule creates unacceptable risk.

---

# 298. Dynamic Threshold Gate

Only after enough stable historical data.

---

# 299. AI-Based Threshold Gate

AI may recommend thresholds later.

Canonical thresholds still require human/governed approval.

---

# 300. Decision Threshold Failure Modes

## Threshold Without Action

Dashboard decoration.

## Threshold Without Owner

No accountability.

## Too Many Alerts

Alert fatigue.

## One Threshold for Every Product

Poor context.

## Constant Manual Overrides

Threshold probably wrong.

---

# 301. Financial Failure Modes

## Revenue Floor Instead of Margin Floor

Can scale losses.

## Cash Balance Without Commitments

False liquidity.

## CAC Without Contribution

Bad acquisition decisions.

## Discount Without Margin Check

Margin leakage.

---

# 302. Operations Failure Modes

## Alert Only After Customer Is Late

Too late.

## 100% Capacity Target

No buffer.

## Quality Threshold Based Only on Average

Critical defects hidden.

---

# 303. Experiment Failure Modes

## Success Rule Chosen After Result

Bias.

## No Stop-Loss

Unbounded risk.

## Guardrail Ignored

Local optimization.

---

# 304. AI Failure Modes

## Average Accuracy Hides Critical Error

Unsafe autonomy.

## Model Confidence = Decision Confidence

False.

## No Kill Switch

Operational risk.

## Agent Can Change Its Own Threshold

Governance failure.

---

# 305. What Decision Thresholds Must Not Become

## Arbitrary Red/Green Dashboard

Rules need business meaning.

## Founder Gut Feeling Hidden as Math

Assumptions should be explicit.

## Static Numbers Forever

Thresholds require calibration.

## Automation Trap

Not every breach should auto-act.

## Management by Exception Only

Healthy trends still require strategic review.

---

# 306. Threshold Success Definition

The framework succeeds when TeeStock can answer:

```text
WHAT
is outside acceptable range?

HOW BAD
is it?

WHO
owns the issue?

WHAT
should happen now?

IS THIS
a warning or hard block?

CAN IT
be overridden?

WHO
may override it?

WHEN
does the exception expire?

WHAT DATA
caused the breach?

WHAT THRESHOLD
was active at that time?

DID WE
recover?

DID THE BREACH
produce a decision?

CAN MGBOS
trigger the right response automatically?

CAN JARVIS
explain why the response happened?
```

---

# 307. Canonical Decision Threshold Summary

```text
METRIC
describes reality.

TARGET
describes desired performance.

THRESHOLD
defines required attention.

FLOOR
defines minimum acceptable economics.

LIMIT
defines maximum acceptable exposure.

GUARDRAIL
protects against side effects.

STOP-LOSS
limits downside.

SCALE GATE
controls expansion.

EXCEPTION
permits governed override.

MGBOS
evaluates the rule.

JARVIS
explains the breach and supports the decision.
```

---

# 308. Canonical Decision Threshold Principles

```text
METRICS DESCRIBE REALITY. THRESHOLDS DECIDE WHEN REALITY REQUIRES ACTION.

TARGET IS NOT THRESHOLD.

THRESHOLD IS NOT METRIC DEFINITION.

A THRESHOLD WITHOUT AN ACTION IS DECORATION.

DO NOT INVENT PRECISION BEFORE THE BUSINESS HAS EVIDENCE.

PROVISIONAL THRESHOLDS SHOULD BE CALIBRATED WITH REAL DATA.

MARGIN FLOORS PROTECT ECONOMICS.

CASH BUFFERS PROTECT SURVIVAL.

REORDER POINTS PROTECT AVAILABILITY WITHOUT ENCOURAGING EXCESS INVENTORY.

QUALITY THRESHOLDS MUST RECOGNIZE CRITICAL DEFECTS, NOT ONLY AVERAGES.

PROACTIVE THRESHOLDS SHOULD TRIGGER BEFORE CUSTOMER FAILURE WHERE POSSIBLE.

SAMPLE SIZE MATTERS.

MISSING OR STALE DATA MUST NOT TRIGGER BLIND AUTOMATION.

HARD THRESHOLDS SHOULD BE RESERVED FOR HARD RISKS.

SOFT THRESHOLDS SHOULD CREATE INVESTIGATION, NOT FALSE CERTAINTY.

OVERRIDES SHOULD BE EXPLICIT, TEMPORARY, AND AUDITABLE.

REPEATED OVERRIDES ARE EVIDENCE THAT THE RULE NEEDS REVIEW.

EXPERIMENT SUCCESS AND STOP CONDITIONS SHOULD BE DEFINED BEFORE RESULTS.

AI AUTONOMY SHOULD BE LIMITED BY CRITICAL-ERROR THRESHOLDS, NOT AVERAGE QUALITY ALONE.

AI MAY RECOMMEND THRESHOLDS. IT MUST NOT SECRETLY REWRITE GOVERNANCE.

MGBOS SHOULD CONNECT METRIC → THRESHOLD → OWNER → ACTION → EXCEPTION → DECISION.
```

---

# 309. Dependency

Dokumen berikut harus follow Decision Thresholds:

1. [[bisnis/teestock/14-roadmap/master-roadmap|master-roadmap.md]]
2. [[bisnis/teestock/14-roadmap/capability-roadmap|capability-roadmap.md]]
3. [[bisnis/teestock/14-roadmap/current-quarter|current-quarter.md]]

TeeStock Decision Thresholds boleh berkembang dari simple rule-based warning and approval gates menjadi forecast-aware cash controls, dynamic reorder points, statistical process controls, anomaly detection, risk-based agent autonomy, dan akhirnya Jarvis-driven exception management. Namun automation hanya boleh meningkat setelah threshold semantics, business ownership, data reliability, override governance, and post-action accountability sudah matang.