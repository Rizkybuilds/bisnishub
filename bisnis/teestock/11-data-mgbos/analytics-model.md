---
title: "TeeStock Analytics Model"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/data-mgbos
document_id: "TS-DAT-006"
version: "1.0"
category: "data-mgbos"
business: "teestock"
last_updated: "2026-09-28"
path: "11-data-mgbos/analytics-model.md"
depends_on:
  - "TS-DAT-001"
  - "TS-DAT-002"
  - "TS-DAT-003"
  - "TS-DAT-004"
  - "TS-DAT-005"
  - "TS-FIN-001"
  - "TS-FIN-002"
  - "TS-FIN-004"
  - "TS-MKT-001"
  - "TS-MKT-005"
  - "TS-TEC-006"
---


# TeeStock Analytics Model v1.0

> [!abstract] **Canonical TeeStock Metrics, Facts, Dimensions, Semantic Layer & Decision-Intelligence Framework  **
> Dokumen ini mendefinisikan analytical facts, dimensions, metric definitions, semantic layer, revenue and contribution analytics, customer and cohort analysis, product, channel, creator, partner, production, inventory, finance, cash, attribution, forecasting, experiments, dashboards, data freshness, lineage, data quality, and future AI/Jarvis analytical access.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/11-data-mgbos/canonical-data-model|TS-DAT-001: TeeStock Canonical Data Model]] • [[bisnis/teestock/11-data-mgbos/entity-hierarchy|TS-DAT-002: TeeStock Entity Hierarchy]] • [[bisnis/teestock/11-data-mgbos/sku-and-id-convention|TS-DAT-003: TeeStock SKU & ID Convention]] • [[bisnis/teestock/11-data-mgbos/event-model|TS-DAT-004: TeeStock Event Model]] • [[bisnis/teestock/11-data-mgbos/mgbos-integration|TS-DAT-005: TeeStock MGBOS Integration]] • [[bisnis/teestock/08-finance/financial-model|TS-FIN-001: TeeStock Financial Model]] • [[bisnis/teestock/08-finance/unit-economics|TS-FIN-002: TeeStock Unit Economics]] • [[bisnis/teestock/08-finance/cost-accounting|TS-FIN-004: TeeStock Cost Accounting]] • [[bisnis/teestock/09-marketing/go-to-market|TS-MKT-001: TeeStock Go-To-Market Strategy]] • [[bisnis/teestock/09-marketing/retention-and-community|TS-MKT-005: TeeStock Retention & Community]] • [[bisnis/teestock/10-product-tech/automation-architecture|TS-TEC-006: TeeStock Automation Architecture]]


---

# 1. Purpose

Analytics Model menjawab:

> **Bagaimana TeeStock mengubah canonical operational data menjadi metrics dan decision intelligence yang konsisten, dapat ditelusuri, dapat dibandingkan, dan dapat digunakan manusia maupun AI tanpa setiap dashboard menghitung angka dengan definisinya sendiri?**

Canonical principle:

> **One metric. One definition. Many views.**

---

# 2. Canonical Definition

> **TeeStock Analytics Model adalah shared analytical framework yang mengubah canonical entities, transactions, events, ledgers, operational records, and business rules menjadi governed facts, dimensions, metrics, cohorts, forecasts, and decision-support views dengan explicit definitions, lineage, grain, time context, and ownership.**

---

# 3. Analytics Is Not Source of Operational Truth

Critical:

```text id="an001"
OPERATIONAL SYSTEM
records what happened.

ANALYTICS
interprets what happened.
```

---

# 4. Analytics Should Not Mutate Core Operations

Canonical.

Analytics may:

```text id="an002"
MEASURE
COMPARE
EXPLAIN
FORECAST
RECOMMEND
```

but business actions return through MGBOS/domain workflows.

---

# 5. Analytical Architecture

Canonical:

```text id="an003"
CANONICAL OPERATIONAL DATA
+
EVENTS
+
LEDGERS
        │
        ▼
TRANSFORMATION / VALIDATION
        │
        ▼
ANALYTICAL FACTS + DIMENSIONS
        │
        ▼
SEMANTIC / METRIC LAYER
        │
        ├── DASHBOARDS
        ├── REPORTS
        ├── EXPERIMENTS
        ├── FORECASTS
        └── JARVIS / AI
```

---

# 6. Analytics Design Principle

Canonical:

> **Analytics should derive from business objects, not from whichever spreadsheet happens to be available.**

---

# 7. Analytical Layers

Recommended:

```text id="an004"
SOURCE
↓
STANDARDIZED
↓
FACT / DIMENSION
↓
SEMANTIC METRICS
↓
DECISION VIEWS
```

---

# 8. Source Layer

Canonical operational records.

Examples:

```text id="an005"
ORDER
ORDER ITEM
PAYMENT
INVENTORY TRANSACTION
WORK ORDER
SHIPMENT
COST ENTRY
EARNING
```

---

# 9. Standardized Layer

Cleans and normalizes:

```text id="an006"
IDs
timestamps
currency
status
channels
categories
```

---

# 10. Fact Layer

Represents measurable business activity.

---

# 11. Dimension Layer

Provides descriptive context.

---

# 12. Semantic Layer

Defines reusable business meaning.

Example:

```text id="an007"
Net Sales
Contribution Margin
Repeat Customer
On-Time Delivery
```

---

# 13. Decision View

Presents analytics for specific management questions.

---

# 14. Grain

Canonical:

> **Every analytical fact must define exactly what one row represents.**

---

# 15. Example Grain

```text id="an008"
FACT_ORDER_ITEM
one row
=
one Order Item.
```

---

# 16. Grain Prevents Double Counting

Critical.

---

# 17. Example Problem

Joining:

```text id="an009"
ORDER
×
PAYMENTS
×
SHIPMENTS
```

carelessly may duplicate sales.

---

# 18. Facts and Dimensions

Canonical architecture:

```text id="an010"
FACTS
measurable events.

DIMENSIONS
descriptive context.
```

---

# 19. Core Fact Tables — Conceptual

Potential:

```text id="an011"
FACT_ORDER
FACT_ORDER_ITEM
FACT_PAYMENT
FACT_REFUND
FACT_INVENTORY_MOVEMENT
FACT_PRODUCTION_JOB
FACT_WORK_ORDER
FACT_SHIPMENT
FACT_RETURN
FACT_COST
FACT_EARNING
FACT_PAYOUT
FACT_CONTENT_PERFORMANCE
FACT_LEAD
FACT_CAMPAIGN
```

---

# 20. Core Dimensions — Conceptual

Potential:

```text id="an012"
DIM_DATE
DIM_CUSTOMER
DIM_PRODUCT
DIM_SKU
DIM_BRAND
DIM_LABEL
DIM_COLLECTION
DIM_CHANNEL
DIM_CREATOR
DIM_PARTNER
DIM_LOCATION
DIM_CAMPAIGN
DIM_SEGMENT
```

---

# 21. Facts May Initially Be Reporting Views

A dedicated warehouse is not required V1.

---

# 22. Operational Reporting Stage

Early:

```text id="an013"
CANONICAL DB
↓
REPORTING VIEWS
```

is acceptable.

---

# 23. Warehouse Gate

Move toward analytical warehouse when:

```text id="an014"
DATA VOLUME
+
CROSS-DOMAIN COMPLEXITY
+
PERFORMANCE NEED
+
HISTORICAL MODELING
```

justify it.

---

# 24. Semantic Layer Principle

Canonical:

> **Dashboards should consume metric definitions, not invent calculations independently.**

---

# 25. Metric Definition

Every metric should define:

```text id="an015"
NAME
PURPOSE
FORMULA
GRAIN
TIME BASIS
INCLUSIONS
EXCLUSIONS
OWNER
SOURCE
```

---

# 26. Metric ID

Potential:

```text id="an016"
MET-SALES-001
MET-CUST-001
MET-OPS-001
```

---

# 27. Metric Versioning

If definition changes materially:

create new metric version or effective-period definition.

---

# 28. Historical Consistency

Do not silently change old dashboard meaning.

---

# 29. KPI vs Metric

Critical:

```text id="an017"
METRIC
measurement.

KPI
metric selected as important performance indicator.
```

---

# 30. Not Every Metric Is KPI

Canonical.

---

# 31. Leading vs Lagging Metrics

```text id="an018"
LEADING
signals future performance.

LAGGING
records realized outcomes.
```

---

# 32. Example

Leading:

```text id="an019"
qualified leads
quote pipeline
preorder demand
```

Lagging:

```text id="an020"
net sales
contribution
cash generated
```

---

# 33. Guardrail Metrics

Metrics protecting against optimization side effects.

Example:

```text id="an021"
CONVERSION increases
but
RETURN RATE must not deteriorate materially.
```

---

# 34. Revenue Analytics

Canonical levels:

```text id="an022"
GROSS SALES
DISCOUNTS
RETURNS / CANCELLATIONS
NET SALES
```

---

# 35. Gross Sales

Conceptual:

```text id="an023"
sum of merchandise/service selling value
before discounts/returns
```

according to canonical Finance definition.

---

# 36. Discounts

Track separately.

---

# 37. Net Sales

Must follow TS-FIN definitions.

---

# 38. GMV

If used:

must distinguish from TeeStock recognized revenue.

---

# 39. Marketplace GMV

Not equal to TeeStock retained economics.

---

# 40. Revenue Reporting Dimensions

Potential:

```text id="an024"
TIME
PRODUCT
CHANNEL
BUSINESS LINE
BRAND
CUSTOMER
CREATOR
```

---

# 41. Contribution Analytics

Canonical contribution ladder follows TS-FIN-001 / TS-FIN-002.

---

# 42. CM1–CM4

Should use same definitions everywhere.

---

# 43. Example Analytical Flow

```text id="an025"
NET SALES
-
DIRECT PRODUCT COST
=
CM1

CM1
-
TRANSACTION / CHANNEL COST
=
CM2

CM2
-
FULFILLMENT / VARIABLE OPS
=
CM3

CM3
-
ACQUISITION / PROGRAM VARIABLE COST
=
CM4
```

Exact inclusion follows Finance canonical docs.

---

# 44. Contribution Is More Useful Than Revenue Alone

For commercial decisions.

---

# 45. Contribution Grain

Prefer at least:

```text id="an026"
ORDER ITEM
```

where allocation quality allows.

---

# 46. Shared Cost Allocation

Should remain explicit.

Do not hide arbitrary allocation.

---

# 47. Cost Allocation Method

Every allocated cost should identify methodology.

---

# 48. Expected vs Actual Cost

Canonical analytical distinction:

```text id="an027"
EXPECTED COST
before execution.

ACTUAL COST
after execution.
```

---

# 49. Cost Variance

```text id="an028"
ACTUAL COST
-
EXPECTED COST
```

---

# 50. Price Variance

Can compare:

```text id="an029"
LIST PRICE
TRANSACTION PRICE
```

---

# 51. Margin Variance

Useful for quote/project review.

---

# 52. Customer Analytics

Core dimensions:

```text id="an030"
NEW / REPEAT
LIFECYCLE
COHORT
CHANNEL
SEGMENT
VALUE
```

---

# 53. Customer Identity Requirement

Customer analytics depend on identity resolution.

---

# 54. Anonymous Orders

Can remain distinct until reliable identity resolution.

---

# 55. New Customer Definition

Must be explicit.

Example:

> Customer whose first completed eligible order occurs in period.

---

# 56. Repeat Customer Definition

Must specify whether:

```text id="an031"
second order created
second order paid
second order completed
```

defines repeat.

Recommended definition belongs KPI framework later.

---

# 57. Purchase Frequency

Potential:

```text id="an032"
eligible orders
/
active customers
```

over defined period.

---

# 58. Average Order Value

Define:

```text id="an033"
NET ORDER SALES
/
ELIGIBLE ORDERS
```

with exclusions documented.

---

# 59. Customer Lifetime Value

Do not use simplistic revenue-only LTV.

---

# 60. Preferred Future Direction

```text id="an034"
LIFETIME CONTRIBUTION
```

is more economically useful.

---

# 61. Customer Acquisition Cost

Must define:

```text id="an035"
acquisition spend
/
new acquired customers
```

with channel/period allocation rules.

---

# 62. Blended CAC

Useful high-level.

---

# 63. Paid CAC

Separate from blended CAC.

---

# 64. CAC Payback

Compare cumulative contribution to acquisition cost.

---

# 65. Cohort

Canonical:

> **Cohort groups entities by a shared starting event/time for longitudinal analysis.**

---

# 66. Customer Cohort

Potential:

```text id="an036"
FIRST PURCHASE MONTH
```

---

# 67. Creator Cohort

Potential:

```text id="an037"
ACTIVATION MONTH
```

---

# 68. Partner Cohort

Potential:

```text id="an038"
FIRST WORK ORDER PERIOD
```

---

# 69. Cohort Metrics

Potential:

```text id="an039"
REPEAT
RETENTION
CONTRIBUTION
ORDER FREQUENCY
```

---

# 70. Retention Analytics

Should respect natural purchase cycle.

---

# 71. Consumer Retention

May use:

```text id="an040"
repeat within X days
```

but X must reflect category behavior.

---

# 72. B2B Retention

Better measured using:

```text id="an041"
REORDER
ACCOUNT REVENUE RETENTION
ACTIVE RELATIONSHIP
```

---

# 73. Creator Retention

Potential:

```text id="an042"
repeat collaboration
active creator relationship
```

---

# 74. Product Analytics

Core levels:

```text id="an043"
PRODUCT
VARIANT
SKU
COLLECTION
BRAND / LABEL
```

---

# 75. Product Performance

Potential:

```text id="an044"
VIEWS
ADD TO CART
UNITS
NET SALES
CONTRIBUTION
RETURN RATE
SELL-THROUGH
```

---

# 76. Product Performance Should Include Economics

Not sales only.

---

# 77. SKU Performance

Useful for:

```text id="an045"
SIZE
COLOR
STOCK
BUYING
```

decisions.

---

# 78. Variant Demand

Can guide assortment.

---

# 79. Sell-Through

Conceptual:

```text id="an046"
UNITS SOLD
/
AVAILABLE UNITS FOR SALE
```

Exact denominator/time basis must be defined.

---

# 80. Inventory Turn

Future:

```text id="an047"
COGS
/
AVERAGE INVENTORY
```

or unit-based operational equivalent.

---

# 81. Stockout Rate

Potential:

```text id="an048"
time / demand affected by unavailable stock
```

definition must be operationally feasible.

---

# 82. Dead Stock

Needs threshold definition.

Avoid arbitrary label.

---

# 83. Aging Inventory

Potential bands:

```text id="an049"
0–30
31–60
61–90
90+
```

adapt by product category.

---

# 84. Inventory Analytics

Core:

```text id="an050"
ON HAND
RESERVED
AVAILABLE
IN TRANSIT
QC HOLD
AGED
```

---

# 85. Inventory Accuracy

Compare system quantity to physical count.

---

# 86. Inventory Adjustment Rate

Useful operational control metric.

---

# 87. Reorder Analytics

Potential input:

```text id="an051"
DEMAND
LEAD TIME
SAFETY STOCK
CURRENT INVENTORY
```

---

# 88. Forecasted Demand

Should remain separate from actual demand.

---

# 89. Channel Analytics

Canonical:

```text id="an052"
CHANNEL
≠
ACQUISITION SOURCE
```

---

# 90. Channel Metrics

Potential:

```text id="an053"
ORDERS
NET SALES
CONTRIBUTION
CAC
RETURN
REPEAT
```

---

# 91. Channel Quality

Evaluate:

```text id="an054"
CUSTOMER QUALITY
CONTRIBUTION
RETURN
RETENTION
```

not only volume.

---

# 92. Marketplace Economics

Include:

```text id="an055"
FEES
ADS
PROMOTIONS
RETURNS
```

where attributable.

---

# 93. Website Economics

Include payment, fulfillment, acquisition costs as applicable.

---

# 94. Channel Concentration

Potential:

```text id="an056"
share of sales / contribution
from top channel
```

---

# 95. Acquisition Source Analytics

Potential:

```text id="an057"
ORGANIC
PAID
CREATOR
AFFILIATE
REFERRAL
DIRECT
```

---

# 96. First Source vs Order Channel

Store separately.

---

# 97. Attribution Analytics

Canonical principle:

> **Attribution is a model, not objective truth.**

---

# 98. Attribution Types

Potential:

```text id="an058"
FIRST TOUCH
LAST TOUCH
CREATOR
AFFILIATE
CAMPAIGN
DIRECT PRODUCT ATTRIBUTION
```

---

# 99. Marketing Attribution vs Financial Attribution

Critical.

---

# 100. Creator Royalty Attribution

Must follow deterministic commercial rule.

---

# 101. Marketing Attribution

Can remain analytical model.

---

# 102. Do Not Use Marketing Attribution to Override Contractual Earnings

Canonical.

---

# 103. Creator Analytics

Potential:

```text id="an059"
ACTIVE CREATORS
LIVE PRODUCTS
NET SALES
CONTRIBUTION
EARNINGS
REPEAT COLLABS
TIME TO LAUNCH
```

---

# 104. Creator Sales ≠ Creator Earnings

Canonical.

---

# 105. Creator Product Economics

Analyze:

```text id="an060"
SALES
ROYALTY
COGS
CHANNEL COST
CONTRIBUTION
```

---

# 106. Creator Cohort

Useful to understand onboarding effectiveness.

---

# 107. Creator Activation

Must define what counts as activated.

Potential:

```text id="an061"
first live product
```

or other canonical milestone.

---

# 108. Time to First Product

Potential:

```text id="an062"
product live timestamp
-
creator approval timestamp
```

---

# 109. Creator Earnings Accuracy

Compare calculated vs approved/reconciled earnings.

---

# 110. Payout Timeliness

Potential:

```text id="an063"
completed payout date
-
scheduled payout date
```

---

# 111. Partner Analytics

Core:

```text id="an064"
QUALITY
ON-TIME
LEAD TIME
COST
REWORK
CLAIMS
CAPACITY
```

---

# 112. Partner Performance Must Be Capability-Specific

A partner may excel at one capability and underperform at another.

---

# 113. On-Time Delivery

Must account for approved deadline changes.

---

# 114. Lead Time

Potential:

```text id="an065"
accepted completion
-
work order acknowledged/start
```

depending process.

---

# 115. QC Pass Rate

Must define inspection denominator.

---

# 116. First-Pass Yield

Potential:

```text id="an066"
output accepted without rework
/
total eligible output
```

---

# 117. Rework Rate

Can be measured by:

```text id="an067"
jobs
units
cost
```

Different views answer different questions.

---

# 118. Partner Effective Cost

Canonical analytical direction:

```text id="an068"
BASE COST
+
LOGISTICS
+
REWORK
+
CLAIMS
+
DELAY IMPACT
+
COORDINATION COST if measurable
```

---

# 119. Partner Scorecard

Should display dimensions separately before introducing composite score.

---

# 120. Production Analytics

Core:

```text id="an069"
THROUGHPUT
LEAD TIME
WIP
CAPACITY
QC
REWORK
ON-TIME
```

---

# 121. Production Job Cycle Time

Potential:

```text id="an070"
completed_at
-
released_at
```

---

# 122. Work Order Cycle Time

Separate from Production Job cycle time.

---

# 123. WIP

Work currently in production.

---

# 124. Throughput

Units/jobs completed over period.

---

# 125. Capacity Utilization

Use cautiously until capacity measurement is reliable.

---

# 126. Estimated Capacity ≠ Actual Throughput

Canonical.

---

# 127. Bottleneck Analytics

Potential:

```text id="an071"
queue time
work time
blocked time
```

by process/capability.

---

# 128. Blocked Time

Important for identifying coordination issues.

---

# 129. Production SLA

Compare actual to promised/target cycle.

---

# 130. Quality Analytics

Core:

```text id="an072"
DEFECT RATE
QC PASS
FIRST-PASS YIELD
REWORK
SCRAP
CLAIMS
RETURNS
```

---

# 131. Customer Return Is Not Automatically Production Defect

Need reason/root cause.

---

# 132. Defect Reason vs Root Cause

Keep separate analytically.

---

# 133. Cost of Quality

Potential:

```text id="an073"
INSPECTION
REWORK
SCRAP
REFUND
REPLACEMENT
CLAIM
```

---

# 134. Fulfillment Analytics

Core:

```text id="an074"
PICK / PACK TIME
SHIP TIME
DELIVERY TIME
ON-TIME DELIVERY
FAILURE
RETURN TO SENDER
```

---

# 135. Order-to-Ship

Potential:

```text id="an075"
shipment.shipped
-
order.confirmed
```

with MTO vs ready-stock segmentation.

---

# 136. Ship-to-Deliver

Potential:

```text id="an076"
shipment.delivered
-
shipment.shipped
```

---

# 137. Delivery Promise Accuracy

Compare:

```text id="an077"
actual delivery
vs
promised delivery
```

---

# 138. Customer Service Analytics

Potential:

```text id="an078"
CASE VOLUME
FIRST RESPONSE
RESOLUTION TIME
REOPEN
REASON
ROOT CAUSE
```

---

# 139. Support Contact Rate

Potential:

```text id="an079"
cases
/
orders
```

for eligible order-related cases.

---

# 140. Support Contact Avoidance

Use carefully.

Goal is not preventing customers from contacting support.

Goal is reducing avoidable friction.

---

# 141. Returns Analytics

Potential:

```text id="an080"
RETURN RATE
REFUND RATE
REASON
ROOT CAUSE
DISPOSITION
COST
```

---

# 142. Return Rate Denominator

Could be:

```text id="an081"
units
orders
customers
```

Metric must specify one.

---

# 143. Refund Rate ≠ Return Rate

Canonical.

---

# 144. Exchange Rate

Separate.

---

# 145. Marketing Analytics

Core funnel:

```text id="an082"
REACH / DISCOVERY
↓
VISIT
↓
INTENT
↓
LEAD / CART
↓
ORDER
↓
REPEAT
```

---

# 146. Content Metrics

Potential:

```text id="an083"
IMPRESSION
VIEW
ENGAGEMENT
CLICK
INTENT
CONVERSION
ASSISTED CONVERSION
```

---

# 147. Content Should Not Be Judged by Views Alone

Canonical.

---

# 148. Content Asset vs Publication

Analytics should preserve both.

---

# 149. One Asset, Many Publications

Allows repurposing analysis.

---

# 150. Campaign Analytics

Potential:

```text id="an084"
SPEND
REACH
TRAFFIC
LEADS
ORDERS
NET SALES
CONTRIBUTION
```

---

# 151. Campaign P&L

Preferred over ROAS alone where enough data exists.

---

# 152. ROAS

Useful but incomplete.

---

# 153. Marketing Contribution

Potential:

```text id="an085"
ATTRIBUTED CONTRIBUTION
-
CAMPAIGN SPEND
```

with attribution caveats.

---

# 154. Lead Analytics

Potential:

```text id="an086"
LEADS
QUALIFIED
QUOTE
WON
REVENUE
CONTRIBUTION
```

---

# 155. Qualification Rate

```text id="an087"
QUALIFIED LEADS
/
ELIGIBLE LEADS
```

---

# 156. Lead-to-Quote

Useful service sales metric.

---

# 157. Quote Win Rate

Must define denominator:

```text id="an088"
won quotes
/
resolved eligible quotes
```

rather than including still-open quotes indiscriminately.

---

# 158. Sales Cycle

Potential:

```text id="an089"
won_at
-
lead_created_at
```

or opportunity start.

Definition must be consistent.

---

# 159. B2B Pipeline

Snapshot view of open opportunities/quotes.

---

# 160. Pipeline Is Not Revenue

Canonical.

---

# 161. Weighted Pipeline

A forecast model, not realized value.

---

# 162. Programs Analytics

Creator, Reseller, Affiliate, Partner programs need separate metrics.

---

# 163. Affiliate Analytics

Potential:

```text id="an090"
CLICKS
ORDERS
VALIDATED CONVERSIONS
COMMISSION
CONTRIBUTION AFTER COMMISSION
```

---

# 164. Referral Analytics

Separate from affiliate.

---

# 165. Reseller Analytics

Potential:

```text id="an091"
ACTIVE RESELLERS
ORDERS
REVENUE
CONTRIBUTION
REORDER
```

---

# 166. Finance Analytics

Core:

```text id="an092"
P&L
CONTRIBUTION
CASH
AR
AP
WORKING CAPITAL
INVENTORY
```

---

# 167. Profit vs Cash

Canonical:

```text id="an093"
PROFIT
≠
CASH
```

---

# 168. Revenue vs Cash Collected

Separate.

---

# 169. Payable vs Cash Paid

Separate.

---

# 170. Cash Analytics

Potential:

```text id="an094"
OPENING CASH
INFLOWS
OUTFLOWS
CLOSING CASH
AVAILABLE CASH
RESERVED CASH
```

---

# 171. Cash Envelope Analytics

Potential:

```text id="an095"
OPERATING
RESERVE
TAX
CAPEX
```

from Treasury Policy.

---

# 172. AR Analytics

Potential:

```text id="an096"
OPEN AR
AGING
OVERDUE
COLLECTION TIME
```

---

# 173. AP Analytics

Potential:

```text id="an097"
OPEN AP
DUE SOON
OVERDUE
SUPPLIER / PARTNER
```

---

# 174. Working Capital

Potential:

```text id="an098"
AR
+
INVENTORY
-
AP
```

depending management definition.

---

# 175. Cash Conversion Cycle

Future metric after data quality is strong.

---

# 176. Forecasting

Canonical:

> **Forecast is an explicit estimate of future state, not a disguised actual.**

---

# 177. Forecast Types

Potential:

```text id="an099"
SALES
CASH
DEMAND
INVENTORY
CAPACITY
```

---

# 178. Forecast Versioning

Every forecast should preserve version/date.

---

# 179. Forecast Horizon

Potential:

```text id="an100"
DAILY
WEEKLY
MONTHLY
QUARTERLY
```

depending use.

---

# 180. Scenario

Canonical:

```text id="an101"
BASE
UPSIDE
DOWNSIDE
STRESS
```

---

# 181. Scenario Assumptions

Must be visible.

---

# 182. Forecast Error

Potential:

```text id="an102"
ACTUAL
-
FORECAST
```

---

# 183. Forecast Accuracy

Should be measured to improve model.

---

# 184. AI Forecast

Must retain:

```text id="an103"
MODEL
GENERATED_AT
INPUT PERIOD
ASSUMPTIONS
```

---

# 185. AI Forecast ≠ Canonical Truth

Canonical.

---

# 186. Experiments

Analytics must support future:

```text id="an104"
EXPERIMENT
VARIANT
EXPOSURE
OUTCOME
```

---

# 187. Experiment Assignment

Needs stable unit:

```text id="an105"
USER
SESSION
CUSTOMER
ORDER
```

depending experiment.

---

# 188. Exposure Event

Critical:

> A subject must actually see/be exposed to a variant before being counted.

---

# 189. Experiment Metrics

Define:

```text id="an106"
PRIMARY
SECONDARY
GUARDRAIL
```

before launch.

---

# 190. Experiment Integrity

Do not choose winning metric after results without documenting it.

---

# 191. Decision Thresholds

Defined later in TS-MET framework.

---

# 192. Statistical Infrastructure

Should match experiment maturity.

No need for complex experimentation platform V1.

---

# 193. Operational Experiment

Can be simpler controlled pilot.

---

# 194. Data Time Model

Analytics requires multiple date concepts.

---

# 195. Order Dates

Potential:

```text id="an107"
created_at
paid_at
confirmed_at
completed_at
```

---

# 196. Revenue Time Basis

Must define whether reporting uses:

```text id="an108"
ORDER DATE
PAYMENT DATE
FULFILLMENT DATE
ACCOUNTING RECOGNITION DATE
```

---

# 197. Management Reporting

May use different time basis from statutory accounting.

Must be explicit.

---

# 198. Date Dimension

Should support:

```text id="an109"
DAY
WEEK
MONTH
QUARTER
YEAR
```

---

# 199. Business Timezone

Canonical reporting timezone initially:

```text id="an110"
Asia/Jakarta
```

unless policy changes.

---

# 200. Timestamp Storage

Implementation should remain timezone-safe.

---

# 201. Late-Arriving Data

External records may arrive after business occurrence.

---

# 202. Analytics Must Distinguish

```text id="an111"
OCCURRED_AT
vs
RECORDED_AT
```

---

# 203. Restatement

Historical reports may change when late data/corrections arrive.

---

# 204. Metric Restatement Policy

Material restatements should be explainable.

---

# 205. Snapshot Facts

Useful for:

```text id="an112"
INVENTORY
PIPELINE
AR
AP
CASH
```

at a point in time.

---

# 206. Transaction Facts

Represent movements/events.

---

# 207. Snapshot vs Transaction

Canonical:

```text id="an113"
TRANSACTION
explains movement.

SNAPSHOT
shows state at time.
```

---

# 208. Slowly Changing Dimensions

Historical attributes may change.

Examples:

```text id="an114"
CUSTOMER SEGMENT
PRODUCT CATEGORY
PARTNER STATUS
```

---

# 209. Historical Reporting Question

Need to decide:

```text id="an115"
REPORT USING
CURRENT ATTRIBUTE
or
ATTRIBUTE AT EVENT TIME?
```

---

# 210. Transaction Context Snapshot

Recommended when historical context materially matters.

---

# 211. Brand Context

Order Item may preserve Brand/Label at sale time.

---

# 212. Channel Context

Preserve channel at transaction time.

---

# 213. Price Context

Always snapshot transaction pricing.

---

# 214. Creator Context

Preserve relevant attribution/economic rule.

---

# 215. Data Freshness

Every analytical view should declare expected freshness.

---

# 216. Freshness Classes

Potential:

```text id="an116"
REAL_TIME
NEAR_REAL_TIME
HOURLY
DAILY
PERIOD_CLOSE
```

---

# 217. Real-Time Need

Examples:

```text id="an117"
ORDER EXCEPTION
INVENTORY ATS
PAYMENT FAILURE
```

These are primarily operational.

---

# 218. Daily Analytics

Sufficient for many management metrics.

---

# 219. Period-Close Analytics

Useful for finalized finance reporting.

---

# 220. Provisional vs Final

Canonical:

```text id="an118"
PROVISIONAL
still subject to late data/reconciliation.

FINAL
period reconciled/closed.
```

---

# 221. Dashboard Should Indicate Freshness

Canonical.

---

# 222. Dashboard Layers

Recommended:

```text id="an119"
EXECUTIVE
FUNCTIONAL
OPERATIONAL
DIAGNOSTIC
```

---

# 223. Executive Dashboard

Focus:

```text id="an120"
NET SALES
CONTRIBUTION
CASH
CUSTOMER
ORDERS
MAJOR RISKS
```

---

# 224. Functional Dashboard

Examples:

```text id="an121"
MARKETING
FINANCE
OPERATIONS
CREATOR
PARTNER
```

---

# 225. Operational Dashboard

Focus:

```text id="an122"
TODAY
QUEUE
SLA
EXCEPTIONS
```

---

# 226. Diagnostic Dashboard

Used for deeper investigation.

---

# 227. Dashboard Principle

Canonical:

> **A dashboard should support a decision or action, not merely display numbers.**

---

# 228. Dashboard Metric Limit

Prefer focused set.

Avoid 80 widgets without hierarchy.

---

# 229. Metric Context

Show:

```text id="an123"
CURRENT
COMPARISON
TARGET
TREND
```

where useful.

---

# 230. Comparison Period

Must be clear:

```text id="an124"
vs yesterday
vs previous week
vs previous month
vs same period last year
```

---

# 231. Seasonal Comparison

Later when historical depth exists.

---

# 232. Targets

Targets are management inputs.

Not actual data.

---

# 233. Target Versioning

Targets may change by period.

---

# 234. Variance to Target

```text id="an125"
ACTUAL
-
TARGET
```

or percentage variance.

---

# 235. Alerting

Analytics may generate alerts when thresholds are crossed.

---

# 236. Alert ≠ Dashboard

Alerts are exception-based attention.

---

# 237. Alert Examples

Potential:

```text id="an126"
MARGIN BELOW FLOOR
CASH BELOW BUFFER
RETURN RATE SPIKE
PARTNER SLA DETERIORATION
```

---

# 238. Alert Threshold

Should come from Decision Thresholds, not random dashboard config.

---

# 239. Alert Fatigue

Do not alert on every normal fluctuation.

---

# 240. Analytical Drill-Down

Canonical:

```text id="an127"
BUSINESS UNIT
↓
CHANNEL / LINE
↓
PRODUCT / CUSTOMER
↓
TRANSACTION
```

where appropriate.

---

# 241. Metrics Should Be Explainable

User should be able to drill to supporting records where permission allows.

---

# 242. Metric Lineage

Canonical:

```text id="an128"
METRIC
↓
FORMULA
↓
FACTS
↓
SOURCE ENTITIES
```

---

# 243. Example Net Sales Lineage

```text id="an129"
Net Sales
↓
Order Items
↓
Discounts / Returns
↓
Canonical Orders
```

---

# 244. Lineage Is Critical for Jarvis

AI should be able to explain where number came from.

---

# 245. Semantic Metric Registry

Future MGBOS should maintain:

```text id="an130"
Metric ID
Name
Definition
Formula
Grain
Owner
Sources
Freshness
Status
```

---

# 246. Metric Status

Potential:

```text id="an131"
DRAFT
CANONICAL
DEPRECATED
```

---

# 247. Metric Owner

Each metric needs business owner.

---

# 248. Data Owner vs Metric Owner

Can differ.

Example:

```text id="an132"
Order data owner:
Commerce

AOV metric owner:
Commercial / Analytics
```

---

# 249. Metric Certification

Canonical metrics should be marked certified/approved in future tooling.

---

# 250. Avoid Metric Proliferation

Do not create:

```text id="an133"
Sales
Sales2
NetSalesNew
RevenueFinal
RealRevenue
```

---

# 251. Metric Synonyms

UI aliases can exist.

Canonical metric ID remains one.

---

# 252. Data Quality for Analytics

Dimensions:

```text id="an134"
COMPLETENESS
CONSISTENCY
FRESHNESS
ACCURACY
UNIQUENESS
LINEAGE
```

---

# 253. Data Quality Checks

Potential:

```text id="an135"
Orders without customer/source
Order Items without Product
Payments without Order
Earnings without source transaction
Work Orders without Production Job
```

---

# 254. Referential Data Quality

Critical.

---

# 255. Financial Quality Checks

Potential:

```text id="an136"
order total mismatch
payment mismatch
negative unexpected margin
unreconciled settlement
```

---

# 256. Inventory Quality Checks

Potential:

```text id="an137"
negative stock
orphan movement
reservation > available
```

where policy disallows.

---

# 257. Creator Quality Checks

Potential:

```text id="an138"
earning without active rule
payout without payable earning
```

---

# 258. Partner Quality Checks

Potential:

```text id="an139"
Work Order without eligible capability
invoice without acceptance
```

---

# 259. Quality Issue Severity

Should distinguish:

```text id="an140"
WARNING
ERROR
BLOCKING
```

---

# 260. Data Quality Dashboard

Potential:

```text id="an141"
FAILED CHECKS
AFFECTED RECORDS
AGE
OWNER
```

---

# 261. Data Completeness Before AI

Canonical:

> **An AI analyst cannot compensate for missing or contradictory canonical data.**

---

# 262. Analytics Access Control

Not everyone sees every metric.

---

# 263. Sensitive Analytics

Examples:

```text id="an142"
MARGIN
CASH
PAYROLL-like data
CREATOR PAYOUT
PARTNER COST
```

---

# 264. Row-Level Access

External creator sees only authorized creator analytics.

---

# 265. Field-Level Access

Creator should not see TeeStock internal margin unless agreement explicitly requires.

---

# 266. Business Client Analytics

Future B2B client can see own account/project data only.

---

# 267. Partner Analytics

Partner sees its own permitted performance/work context.

---

# 268. Internal Executive Access

Broader scope.

---

# 269. Analytical Privacy

Avoid unnecessary customer-level PII.

---

# 270. Aggregation

Prefer aggregate reporting when individual identity unnecessary.

---

# 271. Export

Controlled export may support:

```text id="an143"
FINANCE
OPERATIONS
BUSINESS REVIEW
```

---

# 272. Spreadsheet Export

Useful.

But exported spreadsheet is snapshot, not new source of truth.

---

# 273. Manual Spreadsheet Analysis

Can exist for exploration.

Canonical metric definitions should remain unchanged.

---

# 274. Ad Hoc Analytics

Allowed.

Must be labeled:

```text id="an144"
EXPLORATORY
```

when not canonical.

---

# 275. Exploratory Metric

Should not silently become executive KPI.

---

# 276. Metric Promotion

Potential lifecycle:

```text id="an145"
EXPLORATORY
↓
VALIDATED
↓
CANONICAL
```

---

# 277. Analytics and MGBOS

MGBOS should expose analytics alongside actions.

---

# 278. Example Order Operations

Dashboard:

```text id="an146"
OPEN ORDERS
LATE ORDERS
EXCEPTIONS
```

with direct drill-down to affected Orders.

---

# 279. Example Partner Review

```text id="an147"
QUALITY
ON-TIME
REWORK
COST VARIANCE
```

with Work Order evidence.

---

# 280. Analytics Should Close the Loop

Canonical:

```text id="an148"
MEASURE
↓
UNDERSTAND
↓
DECIDE
↓
ACT
↓
MEASURE AGAIN
```

---

# 281. Jarvis Analytical Role

Canonical:

> **Jarvis may interpret canonical metrics, compare periods, investigate drivers, and produce recommendations, but it must retrieve figures from governed analytical data rather than calculate critical numbers from memory or prose.**

---

# 282. Jarvis Example

User:

> Kenapa margin turun minggu ini?

Jarvis should decompose:

```text id="an149"
NET SALES
PRICE / DISCOUNT
COGS
CHANNEL COST
FULFILLMENT
RETURN
PRODUCT MIX
```

---

# 283. Jarvis Diagnostic Pattern

```text id="an150"
QUESTION
↓
CANONICAL METRIC
↓
COMPARISON
↓
DIMENSION BREAKDOWN
↓
SOURCE FACTS
↓
EXPLANATION
```

---

# 284. Jarvis Must Distinguish Fact vs Interpretation

Example:

```text id="an151"
FACT:
CM3 fell 4.2%.

DRIVER:
shipping cost increased.

INTERPRETATION:
may reflect product/channel mix.
```

---

# 285. Jarvis Cannot Invent Missing Data

Canonical.

---

# 286. Missing Metric

Jarvis should state:

```text id="an152"
data insufficient
```

rather than fabricate.

---

# 287. Jarvis Metric Resolution

Natural language:

> omzet

must map to specific canonical definition:

```text id="an153"
Gross Sales?
Net Sales?
Recognized Revenue?
```

Context/semantic registry should resolve.

---

# 288. Ambiguous Metric

Jarvis should use defined default only if canonical business vocabulary establishes one.

---

# 289. Jarvis Tooling

Potential analytical tools:

```text id="an154"
GET_METRIC
COMPARE_METRIC
BREAKDOWN_METRIC
GET_COHORT
GET_FORECAST
TRACE_METRIC
```

---

# 290. AI Should Not Generate SQL Unrestricted Against Production

Canonical.

---

# 291. Analytical Query Gateway

Future:

```text id="an155"
JARVIS
↓
SEMANTIC QUERY LAYER
↓
ANALYTICAL MODEL
```

---

# 292. Why Semantic Layer for AI

Prevents:

```text id="an156"
wrong joins
double counting
metric definition drift
```

---

# 293. Natural-Language BI

Long-term capability.

Not V1 requirement.

---

# 294. AI Analytical Recommendations

Potential:

```text id="an157"
PRODUCT TO RESTOCK
CHANNEL TO REVIEW
PARTNER TO INVESTIGATE
CUSTOMER COHORT TO REACTIVATE
```

---

# 295. Recommendation ≠ Decision

Canonical.

---

# 296. Recommendation Record

Future may preserve:

```text id="an158"
MODEL
INPUT DATA
RECOMMENDATION
EVIDENCE
TIME
```

---

# 297. Recommendation Outcome

Can later measure whether recommendation helped.

---

# 298. AI Evaluation

Analytical agent should be evaluated on:

```text id="an159"
NUMERIC ACCURACY
SOURCE TRACEABILITY
REASONING QUALITY
UNCERTAINTY HANDLING
```

---

# 299. No “Confident Math” Without Source

Canonical.

---

# 300. Forecasting AI

Should operate over governed historical facts.

---

# 301. Forecasting Maturity

```text id="an160"
MANUAL ASSUMPTION
↓
RULE / RUN RATE
↓
STATISTICAL MODEL
↓
AI / HYBRID MODEL
```

---

# 302. Simple Model First

Do not use sophisticated ML before baseline accuracy is measured.

---

# 303. Baseline Forecast

Examples:

```text id="an161"
LAST PERIOD
MOVING AVERAGE
RUN RATE
```

---

# 304. Model Comparison

Advanced forecast must outperform simple baseline enough to justify complexity.

---

# 305. Analytics Pipeline Maturity

```text id="an162"
LEVEL 0
Spreadsheet reports

LEVEL 1
Canonical reporting views

LEVEL 2
Semantic metric layer + dashboards

LEVEL 3
Warehouse + historical dimensions + experimentation

LEVEL 4
Forecasting + automated anomaly detection

LEVEL 5
Jarvis analytical operating intelligence
```

---

# 306. Level 0

Anti-goal:

```text id="an163"
each team
has different spreadsheet
for "revenue".
```

---

# 307. Level 1

Build:

```text id="an164"
CANONICAL SOURCES
REPORTING VIEWS
CORE METRICS
```

---

# 308. Level 2

Add:

```text id="an165"
METRIC REGISTRY
DASHBOARDS
COHORTS
DRILL-DOWNS
```

---

# 309. Level 3

Add:

```text id="an166"
ANALYTICAL STORE
HISTORICAL DIMENSIONS
EXPERIMENT DATA
```

---

# 310. Level 4

Add:

```text id="an167"
FORECASTING
ANOMALY DETECTION
ALERTING
```

---

# 311. Level 5

Jarvis provides:

```text id="an168"
QUESTION
→ METRIC
→ DIAGNOSIS
→ RECOMMENDATION
→ APPROVED ACTION
```

---

# 312. Current Recommended Stage

TeeStock should target:

```text id="an169"
LEVEL 1
→
LEVEL 2
```

first.

---

# 313. V1 Analytics Priorities

Recommended:

```text id="an170"
ORDERS
NET SALES
CONTRIBUTION
CASH
PRODUCT
CUSTOMER
CHANNEL
PRODUCTION
INVENTORY
```

---

# 314. V1 Executive Metrics

Potential:

```text id="an171"
NET SALES
CM3 / CM4
ORDERS
AOV
NEW VS REPEAT
CASH
OPEN AR
OPEN AP
```

final KPI selection belongs TS-MET-001.

---

# 315. V1 Commerce Metrics

Potential:

```text id="an172"
CONVERSION
ADD TO CART
CHECKOUT
AOV
UNITS / ORDER
RETURN
```

---

# 316. V1 Operations Metrics

Potential:

```text id="an173"
OPEN ORDERS
LATE ORDERS
PRODUCTION CYCLE
QC FAIL
SHIPMENT STATUS
```

---

# 317. V1 Product Metrics

Potential:

```text id="an174"
UNITS
NET SALES
CONTRIBUTION
STOCK
RETURN
```

---

# 318. V1 Customer Metrics

Potential:

```text id="an175"
NEW
REPEAT
ORDER FREQUENCY
```

---

# 319. V1 Creator Metrics

Potential:

```text id="an176"
ACTIVE CREATORS
LIVE PRODUCTS
SALES
EARNINGS
PAYOUT DUE
```

---

# 320. V1 Partner Metrics

Potential:

```text id="an177"
OPEN WORK
ON-TIME
QC PASS
REWORK
```

---

# 321. V1 Data Freshness

Potential:

```text id="an178"
OPERATIONS
near-real-time.

MANAGEMENT
daily.

FINANCE
daily + reconciliation.
```

---

# 322. V1 Analytics Infrastructure

Recommended:

```text id="an179"
CANONICAL DATABASE
+
REPORTING VIEWS
+
LIGHTWEIGHT BI / DASHBOARD
```

---

# 323. V1 Avoid

Do not immediately build:

```text id="an180"
DATA LAKEHOUSE
REAL-TIME STREAMING ANALYTICS
ML FEATURE STORE
CUSTOM BI PLATFORM
AI ANALYST WITH RAW DB ROOT ACCESS
```

---

# 324. V2 Expansion

Possible:

```text id="an181"
COHORTS
ATTRIBUTION
METRIC REGISTRY
DATA QUALITY DASHBOARD
```

---

# 325. V3 Expansion

Possible:

```text id="an182"
WAREHOUSE
HISTORICAL DIMENSIONS
EXPERIMENT ANALYTICS
FORECASTING
```

---

# 326. V4 Expansion

Possible:

```text id="an183"
ANOMALY DETECTION
PREDICTIVE DEMAND
CAPACITY FORECAST
```

---

# 327. V5 Expansion

Potential:

```text id="an184"
SEMANTIC ANALYTICS API
+
JARVIS BUSINESS INTELLIGENCE
+
DECISION RECOMMENDATION LOOP
```

---

# 328. Metric Creation Gate

Create canonical metric only when:

```text id="an185"
BUSINESS QUESTION
+
CLEAR FORMULA
+
RELIABLE SOURCE
+
OWNER
```

exist.

---

# 329. Dashboard Creation Gate

Build dashboard when:

```text id="an186"
DEFINED AUDIENCE
+
RECURRING DECISION
+
ACTIONABLE METRICS
```

exist.

---

# 330. Real-Time Analytics Gate

Only when:

```text id="an187"
DECISION VALUE
depends materially on seconds/minutes.
```

---

# 331. Warehouse Gate

Only when reporting from operational system becomes materially limiting.

---

# 332. Forecast Model Gate

Require:

```text id="an188"
SUFFICIENT HISTORY
+
BASELINE
+
MEASURABLE ACCURACY
```

---

# 333. AI Analytics Gate

Require:

```text id="an189"
SEMANTIC METRICS
+
GOVERNED ACCESS
+
TRACEABILITY
```

before allowing high-trust business analysis.

---

# 334. Alert Gate

Only when threshold breach leads to defined action.

---

# 335. Metric Retirement

Deprecated metric should retain historical documentation.

---

# 336. Analytics Failure Modes

## Revenue Has Multiple Definitions

Decision confusion.

## Dashboard Calculates Its Own Logic

Metric drift.

## Joining Raw Tables Carelessly

Double counting.

## Current Dimension Rewrites History

False historical analysis.

## Pipeline Reported as Revenue

Decision error.

## Sales Reported Without Contribution

Growth illusion.

---

# 337. Customer Analytics Failure Modes

## Duplicate Customer IDs

Retention/CAC distortion.

## New Customer Defined Differently by Channel

Inconsistent cohorts.

## Revenue-Only LTV

Weak economics.

---

# 338. Product Analytics Failure Modes

## Product and SKU Mixed

Inventory insight distorted.

## Bestseller by Revenue Only

May ignore low contribution/returns.

## Stock Balance Without Movements

Poor traceability.

---

# 339. Marketing Analytics Failure Modes

## ROAS as Sole Truth

Ignores margin/retention.

## Attribution Presented as Fact

False certainty.

## Views = Business Success

Vanity optimization.

---

# 340. Operations Analytics Failure Modes

## Cycle Time Without Blocked-Time Context

Wrong diagnosis.

## Partner Score as Black Box

Poor governance.

## Return = Production Defect

Incorrect root cause.

---

# 341. AI Analytics Failure Modes

## Model Calculates Numbers from Prose

Hallucination risk.

## Raw SQL Without Semantic Model

Double counting.

## Stale Data Presented as Current

Decision risk.

## Forecast Presented as Fact

False certainty.

## Recommendation Directly Executes

Governance failure.

---

# 342. What Analytics Model Must Not Become

## Dashboard Museum

Every view needs a purpose.

## Metric Factory

Fewer trusted metrics > hundreds of inconsistent metrics.

## Data Warehouse Project Before Business Need

Infrastructure follows decisions.

## Attribution Religion

Attribution is a model.

## AI Oracle

AI interprets governed data; it does not create truth.

---

# 343. Analytics Success Definition

The model succeeds when TeeStock can answer:

```text id="an190"
WHAT
did we sell?

HOW MUCH
did we actually earn?

WHAT
did it cost?

WHICH PRODUCTS
create contribution?

WHICH CHANNELS
create valuable customers?

WHO
is buying again?

WHAT INVENTORY
is moving or aging?

WHERE
is production slowing?

WHICH PARTNERS
are reliable?

WHAT
are creators earning?

HOW MUCH CASH
is available?

WHAT
is likely to happen next?

WHY
did a metric change?

CAN WE
trace the number back to canonical transactions?

CAN JARVIS
answer without inventing the number?
```

---

# 344. Canonical Analytics Summary

```text id="an191"
CANONICAL DATA
provides truth.

FACTS
provide measurable activity.

DIMENSIONS
provide context.

METRICS
provide consistent meaning.

COHORTS
provide longitudinal understanding.

DASHBOARDS
support decisions.

FORECASTS
estimate future outcomes.

EXPERIMENTS
test causal hypotheses.

LINEAGE
explains the number.

JARVIS
translates analytical truth into understandable decisions.
```

---

# 345. Canonical Analytics Principles

```text id="an192"
ONE METRIC. ONE DEFINITION. MANY VIEWS.

DEFINE GRAIN BEFORE CALCULATION.

CANONICAL DATA BEFORE DASHBOARDS.

FACTS BEFORE OPINIONS.

CONTRIBUTION BEFORE VANITY REVENUE.

PROFIT IS NOT CASH.

PIPELINE IS NOT REVENUE.

FORECAST IS NOT ACTUAL.

ATTRIBUTION IS A MODEL, NOT OBJECTIVE TRUTH.

PRODUCT IS NOT SKU.

RETURN IS NOT REFUND.

SALES ARE NOT CREATOR EARNINGS.

CURRENT DIMENSIONS MUST NOT SILENTLY REWRITE HISTORY.

EVERY CANONICAL METRIC NEEDS AN OWNER.

EVERY IMPORTANT METRIC NEEDS LINEAGE.

DASHBOARDS SHOULD SUPPORT DECISIONS.

REAL-TIME ONLY WHEN THE DECISION REQUIRES IT.

AI SHOULD QUERY SEMANTIC BUSINESS MEANING, NOT GUESS RAW TABLE JOINS.

AI MAY EXPLAIN AND RECOMMEND. CANONICAL DATA REMAINS TRUTH.

IF THE NUMBER CANNOT BE TRACED, IT SHOULD NOT DRIVE A HIGH-CONFIDENCE DECISION.
```

---

# 346. Dependency

Dokumen berikut harus follow Analytics Model:

1. [[bisnis/teestock/12-legal-ip/ip-policy|ip-policy.md]]
2. [[bisnis/teestock/12-legal-ip/design-licensing-policy|design-licensing-policy.md]]
3. [[bisnis/teestock/12-legal-ip/creator-agreement-framework|creator-agreement-framework.md]]
4. [[bisnis/teestock/12-legal-ip/trademark-framework|trademark-framework.md]]
5. [[bisnis/teestock/12-legal-ip/customer-commerce-policy|customer-commerce-policy.md]]
6. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]
7. [[bisnis/teestock/13-metrics-experiments/experimentation-framework|experimentation-framework.md]]
8. [[bisnis/teestock/13-metrics-experiments/decision-thresholds|decision-thresholds.md]]
9. [[bisnis/teestock/14-roadmap/master-roadmap|master-roadmap.md]]
10. [[bisnis/teestock/14-roadmap/capability-roadmap|capability-roadmap.md]]

TeeStock Analytics Model boleh berkembang dari canonical reporting views menjadi governed semantic layer, warehouse, experimentation system, forecasting platform, anomaly detection, dan akhirnya Jarvis-powered business intelligence untuk seluruh MultiGraph Group, tetapi analytical complexity hanya boleh bertambah setelah metric definitions, grain, canonical IDs, historical context, source lineage, data quality, and decision ownership menjadi reliable.