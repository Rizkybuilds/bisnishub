---
title: "TeeStock KPI Framework"
document_id: "TS-MET-001"
version: "1.0"
status: "CANONICAL"
category: "metrics-experiments"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-STR-002"
  - "TS-STR-004"
  - "TS-FIN-001"
  - "TS-FIN-002"
  - "TS-FIN-005"
  - "TS-MKT-001"
  - "TS-MKT-002"
  - "TS-MKT-003"
  - "TS-OPS-001"
  - "TS-OPS-004"
  - "TS-OPS-005"
  - "TS-DAT-006"
---

# TeeStock KPI Framework v1.0

> **Canonical TeeStock Performance Measurement, KPI Hierarchy, Metric Ownership & Management-Control Framework**

Dokumen ini mendefinisikan North Star, company-level KPIs, business-line KPIs, functional KPIs, operational metrics, metric ownership, formulas, targets, thresholds, alerting, review cadence, drill-down logic, data quality, and future MGBOS/Jarvis performance intelligence.

---

# 1. Purpose

KPI Framework menjawab:

> **Bagaimana TeeStock mengetahui apakah bisnis benar-benar semakin sehat—bukan hanya semakin sibuk atau semakin besar omzetnya?**

Canonical principle:

> **Measure what creates durable business value, not what merely looks active.**

---

# 2. Canonical Definition

> **TeeStock KPI Framework adalah governed performance system yang mengubah business strategy, unit economics, customer outcomes, operational execution, and cash discipline menjadi hierarchical KPIs dengan explicit definitions, owners, formulas, targets, thresholds, data lineage, and management actions.**

---

# 3. KPI Is Not Every Number

Canonical:

```text
METRIC
=
something measured.

KPI
=
metric important enough
to influence management decisions.
```

---

# 4. KPI Test

A metric becomes KPI only if:

```text
MATERIAL TO BUSINESS OUTCOME
+
CLEAR OWNER
+
RELIABLE DATA
+
ACTIONABLE
```

---

# 5. Vanity Metric

Examples:

```text
FOLLOWERS
IMPRESSIONS
PAGE VIEWS
```

may be useful diagnostic metrics.

They are not automatically business KPIs.

---

# 6. Activity ≠ Performance

Canonical:

```text
MORE POSTS
≠
BETTER MARKETING

MORE ORDERS
≠
BETTER ECONOMICS

MORE REVENUE
≠
MORE CASH

MORE INVENTORY
≠
BETTER AVAILABILITY
```

---

# 7. KPI Architecture

Canonical hierarchy:

```text
BUSINESS OUTCOME
↓
COMPANY KPI
↓
BUSINESS LINE KPI
↓
FUNCTION KPI
↓
OPERATING METRIC
↓
EVENT / TRANSACTION
```

---

# 8. Four KPI Layers

```text
L0 — NORTH STAR
L1 — COMPANY HEALTH
L2 — BUSINESS / FUNCTION PERFORMANCE
L3 — OPERATIONAL CONTROL
```

---

# 9. L0 — North Star

Represents primary accumulated business value.

---

# 10. L1 — Company Health

Protects against optimizing North Star while damaging:

```text
CASH
CUSTOMER
QUALITY
DELIVERY
```

---

# 11. L2 — Business / Function Performance

Explains where outcomes come from.

---

# 12. L3 — Operational Control

Helps teams act today.

---

# 13. TeeStock North Star

Canonical strategic North Star:

> **Sustainable Contribution from Fulfilled Customer Demand**

---

# 14. North Star Meaning

TeeStock should optimize neither:

```text
ORDERS ALONE
nor
REVENUE ALONE
```

but demand that:

```text
CONVERTS
↓
FULFILLS
↓
SATISFIES CUSTOMER
↓
GENERATES POSITIVE ECONOMICS
```

---

# 15. North Star Financial Representation

Primary company-level representation:

```text
CM4
from eligible completed customer demand
```

for the reporting period.

---

# 16. Why CM4

CM4 attempts to reflect:

```text
NET SALES
-
DIRECT PRODUCT COST
-
TRANSACTION / CHANNEL COST
-
FULFILLMENT / VARIABLE OPS
-
VARIABLE ACQUISITION / PROGRAM COST
```

according to TS-FIN canonical definitions.

---

# 17. Why Not Revenue

Revenue can grow while:

```text
DISCOUNTS
CAC
RETURNS
FULFILLMENT COST
```

destroy economics.

---

# 18. Why Not Profit Alone

Operating profit can be distorted by:

```text
INVESTMENT TIMING
FIXED COST
EARLY STAGE BUILDING
```

and can be too lagging for daily management.

---

# 19. Why Not Order Count

One low-value order and one large B2B project are economically different.

---

# 20. North Star Guardrails

Sustainable Contribution must be observed alongside:

```text
CASH
CUSTOMER RETENTION
QUALITY
ON-TIME DELIVERY
RETURN / REFUND
```

---

# 21. North Star Equation

Conceptually:

```text
SUSTAINABLE CONTRIBUTION
=
ELIGIBLE CM4
+
HEALTHY CUSTOMER OUTCOMES
+
CONTROLLED OPERATING RISK
```

CM4 is the numeric anchor.

Other dimensions act as guardrails.

---

# 22. Do Not Create Black-Box Composite Score

Canonical.

TeeStock should not collapse:

```text
MARGIN
QUALITY
CASH
CUSTOMER
```

into one mysterious score.

---

# 23. Company KPI Set

Canonical initial Company KPIs:

```text
NET SALES
CM4
CM4 MARGIN %
OPERATING CASH MOVEMENT
AVAILABLE CASH
REPEAT CUSTOMER CONTRIBUTION
ON-TIME FULFILLMENT
RETURN / REFUND RATE
```

---

# 24. Company KPI Philosophy

At founder level, fewer trusted KPIs are better than dozens of dashboards.

---

# 25. KPI-01 — Net Sales

Metric ID:

```text
MET-COM-001
```

Definition:

> Eligible selling value after defined discounts, cancellations, and returns according to Finance policy.

---

# 26. Formula

Conceptual:

```text
GROSS ELIGIBLE SALES
-
DISCOUNTS
-
CANCELLED / RETURNED SALES
=
NET SALES
```

---

# 27. Owner

Commercial / Finance.

---

# 28. Why It Matters

Measures realized commercial demand.

---

# 29. Guardrail

Net Sales without Contribution is incomplete.

---

# 30. KPI-02 — CM4

Metric ID:

```text
MET-FIN-001
```

Definition:

> Contribution after defined variable product, channel, fulfillment, operating, acquisition, and program costs.

---

# 31. Owner

Finance.

---

# 32. Why It Matters

Primary economic North Star.

---

# 33. KPI-03 — CM4 Margin %

Metric ID:

```text
MET-FIN-002
```

Formula:

```text
CM4
/
NET SALES
× 100
```

---

# 34. Why Both CM4 and CM4 %

Because:

```text
CM4
shows absolute economic contribution.

CM4 %
shows quality of revenue.
```

---

# 35. KPI-04 — Operating Cash Movement

Metric ID:

```text
MET-CASH-001
```

Conceptual:

```text
OPERATING CASH INFLOW
-
OPERATING CASH OUTFLOW
```

for defined period.

---

# 36. Owner

Finance / Treasury.

---

# 37. Why It Matters

Contribution that never becomes cash cannot fund operations indefinitely.

---

# 38. KPI-05 — Available Cash

Metric ID:

```text
MET-CASH-002
```

Definition:

> Cash actually available for operating commitments after recognized restrictions/reserves.

---

# 39. Bank Balance ≠ Available Cash

Canonical.

---

# 40. KPI-06 — Repeat Customer Contribution

Metric ID:

```text
MET-CUST-001
```

Definition:

> CM4 generated by customers who had at least one earlier eligible completed purchase before the current transaction.

---

# 41. Why Contribution Rather Than Repeat Revenue

Repeat behavior matters most when economically valuable.

---

# 42. KPI-07 — On-Time Fulfillment

Metric ID:

```text
MET-OPS-001
```

Formula conceptually:

```text
FULFILLMENTS COMPLETED
ON OR BEFORE COMMITTED DATE
/
ELIGIBLE FULFILLMENTS
```

---

# 43. Owner

Operations.

---

# 44. KPI-08 — Return / Refund Health

Use separate metrics:

```text
RETURN RATE
REFUND RATE
```

rather than one combined opaque score.

---

# 45. Return Rate

Metric ID:

```text
MET-CUST-002
```

Preferred unit-based initial definition:

```text
RETURNED ELIGIBLE UNITS
/
DELIVERED ELIGIBLE UNITS
```

---

# 46. Refund Rate

Metric ID:

```text
MET-CUST-003
```

Potential value-based definition:

```text
REFUNDED ORDER VALUE
/
ELIGIBLE NET SALES
```

---

# 47. Company KPI Tree

```text
SUSTAINABLE CONTRIBUTION
│
├── DEMAND
│   ├── Customers
│   ├── Orders
│   ├── Conversion
│   └── Repeat
│
├── ECONOMICS
│   ├── Net Sales
│   ├── CM1
│   ├── CM2
│   ├── CM3
│   └── CM4
│
├── DELIVERY
│   ├── Production
│   ├── QC
│   ├── Fulfillment
│   └── On-Time
│
├── CUSTOMER
│   ├── Returns
│   ├── Refunds
│   ├── Cases
│   └── Repeat
│
└── CASH
    ├── Collections
    ├── Available Cash
    ├── AR
    └── AP
```

---

# 48. Leading vs Lagging

Every KPI should be classified.

---

# 49. Lagging Metrics

Examples:

```text
NET SALES
CM4
CASH GENERATED
RETURNS
```

represent realized outcomes.

---

# 50. Leading Metrics

Examples:

```text
QUALIFIED LEADS
QUOTE PIPELINE
CHECKOUT STARTS
PREORDER DEMAND
PRODUCTION BLOCKERS
```

signal likely future outcomes.

---

# 51. Leading Metrics Are Not Guaranteed Outcomes

Canonical.

---

# 52. Commerce KPI Architecture

TeeStock Commerce:

```text
DEMAND
↓
CONVERSION
↓
ORDER
↓
CONTRIBUTION
↓
RETENTION
```

---

# 53. Commerce KPI — Conversion Rate

Metric:

```text
MET-COM-002
```

Concept:

```text
ELIGIBLE ORDERS
/
ELIGIBLE COMMERCE SESSIONS
```

Exact session methodology must be consistent.

---

# 54. Commerce KPI — AOV

```text
MET-COM-003
```

Formula:

```text
NET ORDER SALES
/
ELIGIBLE ORDERS
```

---

# 55. Commerce KPI — Units per Order

```text
MET-COM-004
```

---

# 56. Commerce KPI — CM4 per Order

```text
MET-COM-005
```

Useful for measuring demand quality.

---

# 57. Commerce KPI — Full-Price Share

Potential:

```text
NET SALES WITHOUT PROMOTIONAL DISCOUNT
/
NET SALES
```

for businesses where discount discipline matters.

---

# 58. Commerce KPI — Sell-Through

Used particularly for stocked collections.

---

# 59. Sell-Through Definition

Must specify denominator and period.

Do not use ambiguous “% sold.”

---

# 60. Commerce KPI — Stockout Exposure

Potential measure:

```text
DEMAND EVENTS AFFECTED BY UNAVAILABLE STOCK
```

when tracking becomes reliable.

---

# 61. Selects KPI System

Primary questions:

```text
ARE WE CURATING WHAT PEOPLE WANT?

DOES IT MAKE MONEY?

WHAT SIGNALS SHOULD FEED ORIGINALS?
```

---

# 62. Selects KPIs

Potential canonical set:

```text
NET SALES
CM4
SELL-THROUGH
RETURN RATE
FULL-PRICE SHARE
DESIGN HIT RATE
```

---

# 63. Design Hit Rate

Potential:

```text
designs meeting predefined launch threshold
/
designs launched
```

Exact threshold belongs TS-MET-003.

---

# 64. Selects Is Market Sensor

Analytics should identify:

```text
THEMES
GRAPHICS
COLORS
FITS
PRICE POINTS
```

that repeatedly generate profitable demand.

---

# 65. Essentials KPI System

Focus:

```text
AVAILABILITY
REPEAT DEMAND
MARGIN
INVENTORY EFFICIENCY
```

---

# 66. Essentials KPIs

Potential:

```text
SKU AVAILABILITY
SELL-THROUGH
INVENTORY TURN
STOCKOUT RATE
CM4
REPEAT PURCHASE
```

---

# 67. Services KPI Architecture

TeeStock Services:

```text
LEAD
↓
QUALIFICATION
↓
QUOTE
↓
WIN
↓
PROJECT
↓
CONTRIBUTION
↓
REORDER
```

---

# 68. Services KPI — Qualified Leads

```text
MET-SVC-001
```

---

# 69. Qualified Lead Must Use Canonical Criteria

Do not manually redefine by salesperson.

---

# 70. Services KPI — Qualification Rate

```text
QUALIFIED LEADS
/
ELIGIBLE LEADS
```

---

# 71. Services KPI — Quote Rate

```text
QUOTED OPPORTUNITIES
/
QUALIFIED OPPORTUNITIES
```

---

# 72. Services KPI — Quote Win Rate

Recommended denominator:

```text
WON QUOTES
/
RESOLVED ELIGIBLE QUOTES
```

---

# 73. Open Quotes Are Not Losses

Canonical.

---

# 74. Services KPI — Sales Cycle

Potential:

```text
WON DATE
-
QUALIFIED DATE
```

---

# 75. Services KPI — Project CM4

Primary project economic metric.

---

# 76. Project Revenue Alone Is Insufficient

Canonical.

---

# 77. Services KPI — Quote-to-Actual Margin Variance

Conceptually:

```text
ACTUAL CONTRIBUTION
-
QUOTED / EXPECTED CONTRIBUTION
```

---

# 78. Why It Matters

Detects:

```text
UNDERQUOTING
SCOPE CREEP
PRODUCTION OVERRUN
PARTNER COST VARIANCE
```

---

# 79. Services KPI — On-Time Project Completion

---

# 80. Services KPI — Rework Rate

---

# 81. Services KPI — Account Reorder

Measures B2B relationship quality.

---

# 82. Custom KPI Focus

```text
CONVERSION
PROOF APPROVAL TIME
PRODUCTION CYCLE
REWORK
CONTRIBUTION
```

---

# 83. Business KPI Focus

```text
QUALIFIED PIPELINE
QUOTE WIN
PROJECT CONTRIBUTION
ON-TIME
ACCOUNT REORDER
AR
```

---

# 84. Merch KPI Focus

```text
MERCH PROJECT LAUNCH
SELL-THROUGH
CLIENT / CREATOR ECONOMICS
FULFILLMENT
REPEAT PROJECTS
```

---

# 85. Studio KPI Focus

```text
BILLABLE / REVENUE WORK
PROJECT CONTRIBUTION
REVISION LOAD
ON-TIME DELIVERY
CROSS-SELL
```

---

# 86. Supply KPI Focus

```text
ORDER VALUE
MARGIN
REPEAT
SKU AVAILABILITY
PROCUREMENT RELIABILITY
```

---

# 87. Fulfill KPI Focus

```text
ORDERS HANDLED
FULFILLMENT ACCURACY
CYCLE TIME
ON-TIME
COST PER ORDER
```

---

# 88. Originals KPI Architecture

Originals must answer:

```text
IS THIS IP BUILDING DEMAND?

IS IT BUILDING ECONOMIC VALUE?

SHOULD THIS COLLECTION / LABEL SCALE?
```

---

# 89. Originals KPI — Collection Net Sales

Useful but not sufficient.

---

# 90. Originals KPI — Collection CM4

Primary economic outcome.

---

# 91. Originals KPI — Sell-Through

Important for stocked capsules.

---

# 92. Originals KPI — Full-Price Sell-Through

Measures brand/product demand without discount dependence.

---

# 93. Originals KPI — Repeat Buyer Rate

Useful after sufficient customer base exists.

---

# 94. Originals KPI — Collection Launch Velocity

Potential:

```text
TIME TO REACH DEFINED SALES / CONTRIBUTION THRESHOLD
```

---

# 95. Originals KPI — Inventory Aging

Protects against creative overproduction.

---

# 96. Originals KPI — Label Contribution

For incubated independent labels.

---

# 97. Label Does Not Graduate on Social Hype Alone

Canonical.

---

# 98. Label Graduation Requires Evidence

Potential dimensions:

```text
DEMAND
CONTRIBUTION
REPEAT
BRAND SIGNAL
OPERATIONAL VIABILITY
```

Thresholds defined later.

---

# 99. Programs KPI Architecture

Programs should measure network value, not participant count alone.

---

# 100. Creator Program KPI

Primary:

```text
ACTIVE CREATORS
LIVE CREATOR PRODUCTS
CREATOR-SOURCED CM4
CREATOR EARNINGS
PAYOUT ACCURACY
```

---

# 101. Registered Creators ≠ Active Creators

Canonical.

---

# 102. Active Creator

Definition must use meaningful activity.

Potential:

```text
has eligible active product
or qualifying project/activity
within period
```

---

# 103. Creator Activation Rate

Potential:

```text
CREATORS REACHING ACTIVATION
/
APPROVED CREATORS
```

---

# 104. Time to First Live Product

Measures onboarding efficiency.

---

# 105. Creator-Sourced CM4

Economic contribution from creator-attributable products after creator/program variable cost.

---

# 106. Creator Earnings Accuracy

Potential:

```text
VALIDATED EARNINGS WITHOUT CORRECTION
/
VALIDATED EARNINGS RECORDS
```

---

# 107. Creator Payout Timeliness

```text
PAYOUTS COMPLETED ON SCHEDULE
/
ELIGIBLE PAYOUTS
```

---

# 108. Reseller Program KPIs

Potential:

```text
ACTIVE RESELLERS
RESELLER NET SALES
RESELLER CM4
REORDER RATE
```

---

# 109. Affiliate Program KPIs

Potential:

```text
VALIDATED CONVERSIONS
AFFILIATE CM4
COMMISSION
ACTIVE AFFILIATES
```

---

# 110. Affiliate Revenue Alone Is Weak

Need contribution after commission and channel costs.

---

# 111. Partner Program KPIs

Potential:

```text
ACTIVE CAPABILITIES
ON-TIME EXECUTION
FIRST-PASS YIELD
EFFECTIVE COST
CLAIM RATE
```

---

# 112. Marketing KPI Architecture

Canonical:

```text
ATTENTION
↓
QUALIFIED TRAFFIC
↓
INTENT
↓
ACQUISITION
↓
CONTRIBUTION
↓
RETENTION
```

---

# 113. Marketing KPI — Qualified Traffic

More useful than raw traffic when intent can be identified.

---

# 114. Marketing KPI — Customer Acquisition Cost

```text
MET-MKT-001
```

---

# 115. Paid CAC

```text
ELIGIBLE PAID ACQUISITION COST
/
NEW CUSTOMERS ATTRIBUTED TO PAID ACQUISITION
```

---

# 116. Blended CAC

Includes broader acquisition spend.

---

# 117. Paid CAC and Blended CAC Must Not Be Mixed

Canonical.

---

# 118. Marketing KPI — CAC Payback

Time required for cumulative customer contribution to recover CAC.

---

# 119. Marketing KPI — Contribution After Acquisition

Better than ROAS alone.

---

# 120. ROAS Is Diagnostic

Not primary economic KPI.

---

# 121. Marketing KPI — New Customer CM4

Measures acquired customer quality.

---

# 122. Marketing KPI — Repeat Contribution

Measures whether acquisition creates durable demand.

---

# 123. Content KPI Architecture

Content should measure movement:

```text
REACH
↓
ENGAGEMENT
↓
INTENT
↓
TRAFFIC
↓
LEAD / ORDER
```

---

# 124. Content Views

Diagnostic metric.

---

# 125. Content Saves / Shares

Possible signal of resonance.

Still not final business outcome.

---

# 126. Content-Assisted Demand

Potential metric where attribution is reliable enough.

---

# 127. Content-to-Lead

Important for B2B/Services content.

---

# 128. Content-to-Commerce

Relevant for Shop/Originals.

---

# 129. Marketing Guardrails

Growth should not materially worsen:

```text
CM4
RETURN RATE
CUSTOMER QUALITY
```

---

# 130. Customer KPI Architecture

Canonical:

```text
ACQUIRE
↓
DELIVER
↓
SATISFY
↓
RETAIN
```

---

# 131. Customer KPI — Repeat Rate

Requires defined time horizon.

---

# 132. Repeat Purchase Rate

Potential:

```text
CUSTOMERS WITH ≥2 ELIGIBLE PURCHASES
/
CUSTOMERS ELIGIBLE TO REPEAT
```

over defined cohort/window.

---

# 133. Customer KPI — Support Contact Rate

```text
ORDER-RELATED CASES
/
ELIGIBLE ORDERS
```

---

# 134. Customer KPI — Resolution Time

Median preferred over average when distribution is skewed.

---

# 135. Median vs Average

Canonical:

> Use the statistic that best represents operational reality.

---

# 136. Customer KPI — Reopen Rate

Signals poor resolution quality.

---

# 137. Customer KPI — Return Rate

Previously defined.

---

# 138. Customer KPI — Refund Rate

Previously defined.

---

# 139. Customer Satisfaction Surveys

Optional.

---

# 140. NPS

May be used later.

Not required as early core KPI.

---

# 141. Why

Behavioral outcomes:

```text
REPEAT
RETURN
COMPLAINT
```

may initially be more actionable.

---

# 142. Operations KPI Architecture

Canonical:

```text
DEMAND
↓
QUEUE
↓
EXECUTION
↓
QC
↓
FULFILLMENT
```

---

# 143. Operations KPI — Order-to-Ship

Potential:

```text
SHIPMENT SHIPPED AT
-
ORDER READY / CONFIRMED AT
```

segmented by fulfillment type.

---

# 144. Do Not Mix Ready Stock and MTO Cycle Time

Canonical.

---

# 145. Operations KPI — Production Cycle Time

```text
PRODUCTION COMPLETED
-
PRODUCTION RELEASED
```

---

# 146. Operations KPI — Work Order On-Time Rate

---

# 147. Operations KPI — First-Pass Yield

```text
OUTPUT ACCEPTED WITHOUT REWORK
/
ELIGIBLE OUTPUT
```

---

# 148. Operations KPI — Rework Rate

Measure separately by:

```text
JOB
UNIT
COST
```

as diagnostic dimensions.

---

# 149. Operations KPI — Defect Rate

---

# 150. Operations KPI — Fulfillment Accuracy

Potential:

```text
ORDERS SHIPPED CORRECTLY
/
ELIGIBLE SHIPPED ORDERS
```

---

# 151. Fulfillment Accuracy Includes

Potential:

```text
RIGHT SKU
RIGHT QUANTITY
RIGHT CUSTOMIZATION
RIGHT DESTINATION
```

---

# 152. Operations KPI — Blocked Time

Tracks operational waiting.

---

# 153. Blocked Time May Reveal More Than Work Time

Canonical.

---

# 154. Inventory KPI Architecture

```text
AVAILABILITY
+
VELOCITY
+
ACCURACY
+
CAPITAL EFFICIENCY
```

---

# 155. Inventory KPI — ATS Accuracy

Compare sellable system quantity with physical reality.

---

# 156. Inventory KPI — Inventory Accuracy

```text
SYSTEM QTY MATCHING VERIFIED PHYSICAL QTY
/
COUNTED ITEMS
```

using defined tolerance.

---

# 157. Inventory KPI — Inventory Turn

Future:

```text
COGS
/
AVERAGE INVENTORY VALUE
```

---

# 158. Inventory KPI — Aging

Track inventory value/units by age.

---

# 159. Inventory KPI — Stockout Rate

Use once stockout measurement becomes reliable.

---

# 160. Inventory KPI — Dead Stock Exposure

Requires configurable aging/velocity threshold.

---

# 161. Inventory Guardrail

High availability should not be achieved by excessive stock.

---

# 162. Partner KPI Architecture

Canonical:

```text
QUALITY
SPEED
RELIABILITY
COST
```

---

# 163. Partner KPI — On-Time Rate

---

# 164. Partner KPI — First-Pass Yield

---

# 165. Partner KPI — Effective Cost

Includes:

```text
BASE RATE
+
LOGISTICS
+
REWORK
+
CLAIM / FAILURE COST
```

where measurable.

---

# 166. Partner KPI — Claim Rate

---

# 167. Partner KPI — Acknowledgment Time

Useful for execution responsiveness.

---

# 168. Partner KPI — Capacity Reliability

Difference between committed and actually deliverable capacity.

---

# 169. Do Not Collapse Partner Performance Into One Score Initially

Canonical.

Display dimensions separately.

---

# 170. Finance KPI Architecture

Canonical:

```text
ECONOMICS
+
LIQUIDITY
+
WORKING CAPITAL
+
CONTROL
```

---

# 171. Finance KPI — CM4

North Star economic metric.

---

# 172. Finance KPI — Available Cash

---

# 173. Finance KPI — Operating Cash Movement

---

# 174. Finance KPI — AR Aging

Track:

```text
CURRENT
1–30
31–60
61–90
90+
```

or finance-approved buckets.

---

# 175. Finance KPI — Overdue AR %

Potential:

```text
OVERDUE AR
/
OPEN AR
```

---

# 176. Finance KPI — AP Due Coverage

Potential:

```text
AVAILABLE OPERATING CASH
/
NEAR-TERM APPROVED PAYABLES
```

defined over chosen horizon.

---

# 177. Finance KPI — Reconciliation Completion

Measures financial control.

---

# 178. Finance KPI — Quote Margin Accuracy

For Services.

---

# 179. Finance KPI — Cost Variance

```text
ACTUAL COST
-
EXPECTED COST
```

---

# 180. Finance KPI — Refund Leakage

Potential diagnostic:

unexpected/unapproved refund losses.

---

# 181. Cash Runway

May be useful during periods of negative cash generation.

---

# 182. Runway Formula

Should use realistic forward cash burn assumptions.

Not a permanent vanity metric.

---

# 183. Founder Dashboard

Recommended compact view:

```text
NET SALES
CM4
CM4 %
AVAILABLE CASH
OPERATING CASH MOVEMENT
REPEAT CONTRIBUTION
ON-TIME FULFILLMENT
RETURN RATE
MAJOR EXCEPTIONS
```

---

# 184. Founder Dashboard Purpose

Answer:

```text
ARE WE GROWING?
IS THE GROWTH ECONOMIC?
ARE WE LIQUID?
ARE CUSTOMERS COMING BACK?
CAN OPERATIONS HANDLE IT?
WHAT NEEDS ATTENTION?
```

---

# 185. Business Line Dashboard — Commerce

Recommended:

```text
NET SALES
CM4
CONVERSION
AOV
REPEAT
SELL-THROUGH
RETURN
```

---

# 186. Business Line Dashboard — Services

```text
QUALIFIED PIPELINE
QUOTE WIN
PROJECT CM4
CYCLE TIME
ON-TIME
REORDER
```

---

# 187. Business Line Dashboard — Originals

```text
COLLECTION CM4
SELL-THROUGH
FULL-PRICE SHARE
INVENTORY AGING
REPEAT
LABEL TRACTION
```

---

# 188. Business Line Dashboard — Programs

```text
ACTIVE PARTICIPANTS
PROGRAM-SOURCED CM4
PAYOUT / COMMISSION
ACTIVATION
QUALITY
```

---

# 189. Functional Dashboard — Marketing

```text
QUALIFIED TRAFFIC
CAC
CONTRIBUTION AFTER ACQUISITION
NEW CUSTOMER QUALITY
CONTENT-ASSISTED DEMAND
```

---

# 190. Functional Dashboard — Operations

```text
OPEN WORK
LATE WORK
CYCLE TIME
FIRST-PASS YIELD
REWORK
FULFILLMENT ACCURACY
```

---

# 191. Functional Dashboard — Finance

```text
CM4
CASH
AR
AP
RECONCILIATION
COST VARIANCE
```

---

# 192. Operator Dashboard

Operator should primarily see:

```text
QUEUE
OWNER
DUE DATE
SLA
BLOCKER
EXCEPTION
```

not company-level financial noise.

---

# 193. KPI Ownership

Every canonical KPI requires:

```text
BUSINESS OWNER
DATA OWNER
```

---

# 194. Business Owner

Responsible for performance.

---

# 195. Data Owner

Responsible for source integrity/definition.

---

# 196. Example

```text
On-Time Fulfillment

Business Owner:
Operations

Data Owner:
Fulfillment / Data
```

---

# 197. KPI Owner Cannot Change Definition Casually

Canonical metric definition is governed.

---

# 198. Metric Registry

Future MGBOS registry:

```text
Metric ID
Name
Definition
Formula
Owner
Data Owner
Grain
Source
Freshness
Target
Threshold
Status
```

---

# 199. Metric Status

```text
EXPLORATORY
VALIDATED
CANONICAL
DEPRECATED
```

---

# 200. Canonical Metrics

Used for:

```text
BUSINESS REVIEWS
TARGETS
AUTOMATION
JARVIS
```

---

# 201. Exploratory Metrics

Can inform investigation.

Should not silently become management truth.

---

# 202. KPI Targets

Canonical:

> **Target is a desired outcome, not the definition of the metric.**

---

# 203. Example

```text
Metric:
CM4 Margin %

Target:
X%

Definition stays constant
even when target changes.
```

---

# 204. Target Dimensions

Targets may vary by:

```text
TIME
BUSINESS LINE
CHANNEL
PRODUCT
```

where justified.

---

# 205. Target Versioning

Targets must preserve effective period.

---

# 206. Target Source

Possible:

```text
BUDGET
OPERATING PLAN
EXPERIMENT
MANAGEMENT DECISION
```

---

# 207. Threshold ≠ Target

Canonical:

```text
TARGET
desired performance.

THRESHOLD
point requiring attention/action.
```

---

# 208. Threshold States

Recommended:

```text
HEALTHY
WATCH
ACTION_REQUIRED
CRITICAL
```

---

# 209. Do Not Use Arbitrary Colors Without Defined Rules

Status must map to actual threshold.

---

# 210. Example Threshold

Conceptually:

```text
ON-TIME FULFILLMENT

HEALTHY      ≥ target floor
WATCH        below target
ACTION       materially below
CRITICAL     severe SLA risk
```

Exact numbers belong TS-MET-003.

---

# 211. Alerting

Alert only if:

```text
THRESHOLD BREACH
+
DEFINED OWNER
+
DEFINED ACTION
```

---

# 212. Alert Without Action Is Noise

Canonical.

---

# 213. Repeated Alert

Should not spam humans if existing unresolved incident already covers it.

---

# 214. Alert Severity

Potential:

```text
INFO
WATCH
ACTION
CRITICAL
```

---

# 215. KPI Review Cadence

Canonical:

```text
REAL-TIME / DAILY
operational.

WEEKLY
performance management.

MONTHLY
business economics.

QUARTERLY
strategy / resource allocation.
```

---

# 216. Daily Review

Focus:

```text
ORDERS
BLOCKERS
PAYMENT
FULFILLMENT
CASH EXCEPTIONS
```

---

# 217. Weekly Review

Focus:

```text
DEMAND
CONVERSION
CONTRIBUTION
OPERATIONS
CUSTOMER
```

---

# 218. Monthly Review

Focus:

```text
P&L
CASH
COHORT
PRODUCT
CHANNEL
PARTNER
INVENTORY
```

---

# 219. Quarterly Review

Focus:

```text
STRATEGY
BUSINESS LINES
CAPITAL
CAPABILITIES
PORTFOLIO
```

---

# 220. One Metric Can Have Different Review Cadence

Example:

```text
CASH
daily operations
+
weekly treasury
+
monthly planning
```

---

# 221. Period Comparison

Canonical views:

```text
CURRENT PERIOD
VS PREVIOUS PERIOD
VS TARGET
VS TREND
```

---

# 222. Year-over-Year

Use only when enough history exists and seasonality makes comparison meaningful.

---

# 223. Percentage Change

Should not be emphasized when denominator is tiny.

---

# 224. Absolute + Relative

Where useful display both.

---

# 225. Metric Segmentation

Every core KPI should be drillable where meaningful by:

```text
CHANNEL
PRODUCT
CUSTOMER
BUSINESS LINE
BRAND
CREATOR
PARTNER
```

---

# 226. Drill-Down Rule

Canonical:

> **A management KPI should eventually resolve to the transactions or events that explain it.**

---

# 227. Example CM4 Drill-Down

```text
CM4
↓
BUSINESS LINE
↓
CHANNEL
↓
PRODUCT
↓
ORDER ITEM
↓
COST
```

---

# 228. Example Return Drill-Down

```text
RETURN RATE
↓
PRODUCT
↓
SIZE
↓
REASON
↓
ROOT CAUSE
```

---

# 229. KPI Lineage

Every canonical KPI should have:

```text
FORMULA
↓
FACTS
↓
CANONICAL ENTITIES
```

---

# 230. Data Freshness

KPI registry declares:

```text
REAL_TIME
NEAR_REAL_TIME
DAILY
MONTHLY CLOSE
```

---

# 231. Operational KPI Freshness

Near-real-time where needed.

---

# 232. Financial KPI Freshness

Can show:

```text
PROVISIONAL
```

until reconciliation/close.

---

# 233. Provisional Data

Must be visibly distinguished.

---

# 234. Finalized Data

Period reconciled according to Finance controls.

---

# 235. KPI Data Quality

Canonical KPIs should not publish silently if critical data quality checks fail.

---

# 236. Quality State

Potential:

```text
VALID
PARTIAL
STALE
FAILED
```

---

# 237. Example

If payment integration is down:

revenue/cash dashboard may display freshness warning.

---

# 238. Missing Data ≠ Zero

Canonical.

---

# 239. Zero

Means measured value is zero.

---

# 240. Missing

Means value is unknown.

---

# 241. KPI and Forecast

Actual KPI and forecast remain separate.

---

# 242. Example

```text
ACTUAL CM4
FORECAST CM4
TARGET CM4
```

are three different objects.

---

# 243. Forecast Accuracy

Should itself become diagnostic metric.

---

# 244. KPI and Experiments

Experiments may move KPIs.

---

# 245. Experiment Metrics

Every experiment must predefine:

```text
PRIMARY METRIC
SECONDARY METRIC
GUARDRAIL
```

---

# 246. Primary Metric

Metric the experiment intends to improve.

---

# 247. Guardrail

Metric that should not materially deteriorate.

---

# 248. Example

Checkout experiment:

```text
PRIMARY:
conversion.

GUARDRAIL:
refund rate,
CM4 per order.
```

---

# 249. Local Optimization Risk

Canonical:

> **A function may improve its own KPI while harming company economics.**

---

# 250. Example Marketing Failure

```text
CAC ↓
```

but:

```text
RETURN ↑
REPEAT ↓
CM4 ↓
```

may mean lower-quality acquisition.

---

# 251. Example Operations Failure

```text
CYCLE TIME ↓
```

but:

```text
QC FAIL ↑
```

is not improvement.

---

# 252. Example Purchasing Failure

```text
UNIT COST ↓
```

but:

```text
DEFECT ↑
LEAD TIME ↑
```

may worsen total economics.

---

# 253. KPI Guardrail Principle

Every optimization KPI should have relevant counter-metrics.

---

# 254. KPI Cascading

Company KPI should cascade into controllable team metrics.

---

# 255. Example

Company:

```text
CM4
```

Marketing controls:

```text
CAC
customer quality
```

Operations controls:

```text
fulfillment cost
rework
```

Product controls:

```text
pricing
product margin
```

---

# 256. Accountability

Team should own metrics it can meaningfully influence.

---

# 257. Do Not Give Teams KPIs They Cannot Control

Canonical.

---

# 258. Shared KPIs

Some outcomes require joint ownership.

Example:

```text
RETURN RATE
```

involves:

```text
PRODUCT
OPERATIONS
FULFILLMENT
CUSTOMER EXPECTATION
```

---

# 259. Shared KPI Still Needs One Primary Owner

Canonical.

---

# 260. KPI Gaming

Every metric creates behavior.

---

# 261. Example

If support KPI is:

```text
CASES CLOSED
```

agents may close cases prematurely.

---

# 262. Better

Combine:

```text
RESOLUTION TIME
+
REOPEN RATE
```

---

# 263. Example Sales Gaming

If salesperson measured only on Revenue:

discounting can destroy margin.

---

# 264. Better Sales KPI

Use:

```text
WON CONTRIBUTION
+
QUALITY / COLLECTION
```

where relevant.

---

# 265. KPI Design Principle

Canonical:

> **Measure outcomes with the behavior the business actually wants.**

---

# 266. Metric Complexity

Prefer simple explainable formulas.

---

# 267. Composite Metrics

Use sparingly.

---

# 268. Black-Box Scores

Avoid for:

```text
PARTNER
CUSTOMER
CREATOR
BUSINESS HEALTH
```

until components are well understood.

---

# 269. Diagnostic Metrics

Not all diagnostics belong dashboard.

---

# 270. Investigation Metrics

Can be queried when KPI changes.

---

# 271. Dashboard Hierarchy

Canonical:

```text
KPI
↓
DRIVER
↓
DIAGNOSTIC
↓
SOURCE RECORD
```

---

# 272. KPI Example

```text
CM4 ↓
```

Drivers:

```text
PRICE
MIX
COGS
CHANNEL COST
FULFILLMENT
CAC
RETURNS
```

---

# 273. Driver Tree

MGBOS/Jarvis should eventually understand driver relationships.

---

# 274. Jarvis KPI Role

Canonical:

> **Jarvis explains performance by resolving user language to canonical metrics and tracing those metrics to drivers and source data.**

---

# 275. Jarvis Question

> Kenapa profit turun minggu ini?

Jarvis must clarify internally whether user means:

```text
CM4
OPERATING PROFIT
NET PROFIT
```

based on canonical vocabulary/context.

---

# 276. Jarvis Should Not Guess Metric Meaning Silently

Canonical.

---

# 277. Jarvis Diagnostic Flow

```text
QUESTION
↓
METRIC
↓
PERIOD
↓
COMPARISON
↓
DRIVER BREAKDOWN
↓
SOURCE
↓
EXPLANATION
```

---

# 278. Jarvis KPI Output

Should distinguish:

```text
FACT
DRIVER
HYPOTHESIS
RECOMMENDATION
```

---

# 279. Example

```text
FACT:
CM4 declined.

DRIVER:
fulfillment cost increased.

HYPOTHESIS:
mix shifted toward low-AOV distant shipments.
```

---

# 280. Jarvis Must Not Present Hypothesis as Fact

Canonical.

---

# 281. KPI Tooling

Potential tools:

```text
GET_KPI
COMPARE_KPI
BREAKDOWN_KPI
TRACE_KPI
GET_TARGET
GET_THRESHOLD
```

---

# 282. KPI Alerts to Jarvis

Potential:

```text
THRESHOLD BREACH
↓
JARVIS ANALYSIS
↓
HUMAN SUMMARY
```

---

# 283. Jarvis Does Not Automatically Fix Everything

Action remains permission/risk based.

---

# 284. Low-Risk Response

Potential:

```text
CREATE INVESTIGATION TASK
```

---

# 285. High-Risk Response

Potential:

```text
RECOMMEND PRICING CHANGE
```

with human approval.

---

# 286. KPI and MGBOS

MGBOS should connect:

```text
METRIC
↓
OWNER
↓
THRESHOLD
↓
ALERT
↓
TASK
↓
DECISION
```

---

# 287. KPI Alert Example

```text
ON-TIME FULFILLMENT
falls below threshold
↓
Exception
↓
Operations owner
↓
root-cause analysis
```

---

# 288. KPI Management Loop

Canonical:

```text
MEASURE
↓
COMPARE
↓
DIAGNOSE
↓
DECIDE
↓
ACT
↓
MEASURE
```

---

# 289. KPI Review Record

Material review can capture:

```text
METRIC
PERIOD
VARIANCE
DRIVER
DECISION
OWNER
FOLLOW-UP
```

---

# 290. KPI-to-Decision Lineage

Future MGBOS should answer:

> Which decision was made because this KPI deteriorated?

---

# 291. KPI and Strategy

If KPI repeatedly fails despite execution:

strategy assumption may be wrong.

---

# 292. KPI ≠ Strategy

Canonical.

Metrics tell what happened.

Strategy decides what to do.

---

# 293. KPI Lifecycle

```text
PROPOSED
↓
VALIDATED
↓
CANONICAL
↓
DEPRECATED
```

---

# 294. Metric Introduction Gate

Require:

```text
BUSINESS QUESTION
FORMULA
SOURCE
OWNER
ACTION
```

---

# 295. KPI Promotion Gate

Require:

```text
RELIABLE DATA
+
REPEATED DECISION USE
+
STRATEGIC IMPORTANCE
```

---

# 296. KPI Deprecation

When no longer useful:

mark deprecated.

Do not silently delete history.

---

# 297. KPI Definition Change

Material formula change requires:

```text
VERSION
EFFECTIVE DATE
MIGRATION
```

---

# 298. Historical Reporting

Should preserve old definition where needed.

---

# 299. V1 KPI System

Start with:

```text
10–20 TRUSTED CORE KPIs
```

not hundreds.

---

# 300. V1 Founder Dashboard

Mandatory initial:

```text
NET SALES
CM4
CM4 %
AVAILABLE CASH
OPERATING CASH MOVEMENT
ORDERS
REPEAT CONTRIBUTION
ON-TIME FULFILLMENT
RETURN RATE
```

---

# 301. V1 Commerce Dashboard

```text
NET SALES
CM4
CONVERSION
AOV
REPEAT
RETURN
```

---

# 302. V1 Services Dashboard

```text
QUALIFIED LEADS
QUOTE WIN
PROJECT CM4
ON-TIME
REWORK
```

---

# 303. V1 Operations Dashboard

```text
OPEN ORDERS
LATE ORDERS
PRODUCTION CYCLE
QC FAIL
FULFILLMENT ACCURACY
```

---

# 304. V1 Finance Dashboard

```text
CM4
CASH
AR
AP
COST VARIANCE
```

---

# 305. V1 Inventory Dashboard

```text
ON HAND
ATS
RESERVED
AGING
STOCKOUT
```

where data supports it.

---

# 306. V1 Creator Dashboard

```text
ACTIVE CREATORS
LIVE PRODUCTS
CREATOR-SOURCED CM4
EARNINGS
PAYOUT DUE
```

---

# 307. V1 Partner Dashboard

```text
OPEN WORK ORDERS
ON-TIME
QC PASS
REWORK
```

---

# 308. V1 Avoid

Do not immediately build:

```text
100+ KPIs
BLACK-BOX BUSINESS SCORE
PREDICTIVE KPI ENGINE
AI AUTONOMOUS MANAGEMENT
REAL-TIME EVERYTHING
```

---

# 309. V2 Expansion

Potential:

```text
COHORT KPIs
CHANNEL QUALITY
CREATOR COHORT
PARTNER ECONOMICS
DATA QUALITY KPIs
```

---

# 310. V3 Expansion

Potential:

```text
FORECAST KPIs
EXPERIMENT METRICS
ANOMALY DETECTION
DRIVER TREES
```

---

# 311. V4 Expansion

Potential:

```text
PREDICTIVE DEMAND
CUSTOMER VALUE
INVENTORY OPTIMIZATION
PARTNER ROUTING
```

---

# 312. V5 Expansion

Potential:

```text
JARVIS BUSINESS REVIEW
AUTOMATED ROOT-CAUSE ANALYSIS
DECISION RECOMMENDATIONS
```

with governed human authority.

---

# 313. KPI Governance Owner

Canonical owner:

```text
DATA / MGBOS
+
BUSINESS FUNCTION OWNER
```

---

# 314. Finance Authority

Finance owns definitions involving:

```text
REVENUE
COST
CONTRIBUTION
CASH
```

---

# 315. Marketing Authority

Marketing owns acquisition definitions subject to canonical Finance/Data reconciliation.

---

# 316. Operations Authority

Operations owns operational SLA/process definitions.

---

# 317. Cross-Functional Review

Metrics crossing domains require joint review.

---

# 318. KPI Failure Modes

## Revenue as Only KPI

Can hide bad economics.

## Orders as Only KPI

Can hide low-value demand.

## Followers as Growth KPI

Can hide zero commercial value.

## Profit Without Cash

Liquidity blind spot.

## Average Without Distribution

Can hide operational outliers.

---

# 319. Dashboard Failure Modes

## Too Many Widgets

No focus.

## No Owner

No action.

## No Threshold

No decision context.

## No Drill-Down

No explanation.

## Stale Data Without Warning

False confidence.

---

# 320. Target Failure Modes

## Target Changes Metric Definition

Invalid comparison.

## Impossible Target

Destroys credibility.

## Target Without Baseline

Guessing.

## Local Target Harms Company KPI

Misaligned incentives.

---

# 321. AI KPI Failure Modes

## AI Calculates From Memory

Hallucination.

## AI Mixes Gross and Net Sales

Semantic failure.

## AI Calls Forecast Actual

False certainty.

## AI Explains Correlation as Cause

Analytical error.

---

# 322. What KPI Framework Must Not Become

## Dashboard Theater

Metrics must drive decisions.

## Productivity Surveillance

Focus on business/process outcomes, not arbitrary employee activity.

## Metric Competition Between Teams

Company outcome comes first.

## Target Worship

Targets are tools, not truth.

## AI Oracle

Jarvis interprets governed numbers.

---

# 323. KPI Framework Success Definition

The framework succeeds when TeeStock can answer:

```text
ARE WE
growing?

IS GROWTH
economically healthy?

ARE WE
generating cash?

ARE CUSTOMERS
coming back?

ARE PRODUCTS
selling without excessive discount?

IS INVENTORY
productive?

IS PRODUCTION
reliable?

ARE PARTNERS
delivering?

ARE CREATOR PROGRAMS
creating contribution?

WHICH CHANNEL
creates valuable demand?

WHAT KPI
is deteriorating?

WHY
is it deteriorating?

WHO
owns the response?

WHAT
should happen next?

CAN MGBOS
trigger attention automatically?

CAN JARVIS
explain the number from canonical data?
```

---

# 324. Canonical KPI Summary

```text
STRATEGY
defines what matters.

KPI
measures what matters.

TARGET
defines desired outcome.

THRESHOLD
defines required attention.

DRIVER
explains movement.

DIAGNOSTIC
finds cause.

OWNER
creates accountability.

MGBOS
connects metric to action.

JARVIS
explains performance and supports decisions.
```

---

# 325. Canonical KPI Principles

```text
MEASURE WHAT CREATES DURABLE BUSINESS VALUE, NOT WHAT MERELY LOOKS ACTIVE.

SUSTAINABLE CONTRIBUTION IS THE PRIMARY ECONOMIC NORTH STAR.

REVENUE IS NOT CONTRIBUTION.

PROFIT IS NOT CASH.

ORDER COUNT IS NOT DEMAND QUALITY.

KPI IS NOT EVERY METRIC.

ONE METRIC SHOULD HAVE ONE CANONICAL DEFINITION.

DEFINE THE GRAIN BEFORE THE FORMULA.

TARGET IS NOT METRIC DEFINITION.

THRESHOLD IS NOT TARGET.

LEADING INDICATORS ARE NOT GUARANTEED OUTCOMES.

EVERY KPI NEEDS A BUSINESS OWNER AND DATA OWNER.

EVERY KPI SHOULD HAVE TRACEABLE SOURCE DATA.

SHARED OUTCOMES STILL NEED PRIMARY OWNERSHIP.

LOCAL KPI OPTIMIZATION MUST NOT DAMAGE COMPANY ECONOMICS.

GUARDRAIL METRICS PROTECT AGAINST GAMING.

MISSING DATA IS NOT ZERO.

FORECAST IS NOT ACTUAL.

DASHBOARDS SHOULD SUPPORT DECISIONS, NOT DECORATION.

AI MAY EXPLAIN, COMPARE, AND DIAGNOSE. CANONICAL METRICS REMAIN THE NUMERIC TRUTH.

MGBOS SHOULD CONNECT KPI → THRESHOLD → OWNER → ACTION → DECISION.
```

---

# 326. Dependency

Dokumen berikut harus follow KPI Framework:

1. `13-metrics-experiments/experimentation-framework.md`
2. `13-metrics-experiments/decision-thresholds.md`
3. `14-roadmap/master-roadmap.md`
4. `14-roadmap/capability-roadmap.md`
5. `14-roadmap/current-quarter.md`

TeeStock KPI Framework boleh berkembang dari small canonical KPI set menjadi semantic metric registry, automated performance reviews, forecasting, anomaly detection, experiment measurement, driver trees, dan akhirnya Jarvis-powered management intelligence untuk seluruh MultiGraph Group. Tetapi sophistication hanya boleh bertambah setelah metric definitions, ownership, targets, thresholds, data lineage, and management actions sudah disiplin dan dapat dipercaya.