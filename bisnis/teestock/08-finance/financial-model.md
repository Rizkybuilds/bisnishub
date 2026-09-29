---
title: "TeeStock Financial Model"
date: "2026-09-28"
bisnis: teestock
kategori: keuangan
status: active
tags:
  - bisnis/teestock
  - kategori/keuangan
  - teestock/canonical
  - teestock/finance
document_id: "TS-FIN-001"
version: "1.0"
category: "finance"
business: "teestock"
last_updated: "2026-09-28"
path: "08-finance/financial-model.md"
depends_on:
  - "TS-FND-001"
  - "TS-STR-001"
  - "TS-STR-002"
  - "TS-STR-003"
  - "TS-STR-004"
  - "TS-COM-001"
  - "TS-SVC-001"
  - "TS-ORG-001"
  - "TS-PRG-001"
  - "TS-OPS-001"
  - "TS-OPS-005"
  - "TS-OPS-006"
  - "TS-OPS-008"
---


# TeeStock Financial Model v1.0

> [!important] **Canonical TeeStock Financial Architecture & Management Economics Framework  **
> Dokumen ini mendefinisikan revenue architecture, cost structure, contribution margin, operating expenses, working capital, inventory economics, receivables, payables, cash conversion, business-line P&L, shared-cost allocation, internal transfer economics, capital allocation, runway, planning, dan financial data integration untuk TeeStock.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/01-strategy/business-thesis|TS-STR-001: TeeStock Business Thesis]] • [[bisnis/teestock/01-strategy/business-model|TS-STR-002: TeeStock Business Model]] • [[bisnis/teestock/01-strategy/ecosystem-architecture|TS-STR-003: TeeStock Ecosystem Architecture]] • [[bisnis/teestock/01-strategy/growth-strategy|TS-STR-004: TeeStock Growth Strategy]] • [[bisnis/teestock/03-commerce/commerce-overview|TS-COM-001: TeeStock Commerce Overview]] • [[bisnis/teestock/04-services/services-overview|TS-SVC-001: TeeStock Services Overview]] • [[bisnis/teestock/05-originals/originals-master-plan|TS-ORG-001: TeeStock Originals Master Plan]] • [[bisnis/teestock/06-programs/programs-overview|TS-PRG-001: TeeStock Programs Overview]] • [[bisnis/teestock/07-operations/operating-model|TS-OPS-001: TeeStock Operating Model]] • [[bisnis/teestock/07-operations/inventory-system|TS-OPS-005: TeeStock Inventory System]] • [[bisnis/teestock/07-operations/order-fulfillment|TS-OPS-006: TeeStock Order Fulfillment System]] • [[bisnis/teestock/07-operations/returns-and-warranty|TS-OPS-008: TeeStock Returns & Warranty System]]


---

# 1. Purpose

Financial Model menjawab:

> **Bagaimana TeeStock mengetahui apakah bisnis benar-benar menghasilkan economic value, bukan hanya menghasilkan transaksi dan omzet?**

Canonical principle:

> **Revenue is activity. Contribution is economics. Cash is survival.**

---

# 2. Canonical Definition

> **TeeStock Financial Model adalah management framework yang mengubah transactions, inventory, production, services, programs, partner costs, refunds, payouts, dan shared infrastructure menjadi measurable revenue, cost, contribution, operating profit, working-capital requirement, dan cash position untuk mendukung keputusan bisnis.**

---

# 3. Finance Is Not Only Accounting

Critical distinction:

```text id="fin001"
ACCOUNTING
records financial reality.

FINANCIAL MANAGEMENT
uses financial reality to make decisions.
```

TeeStock membutuhkan keduanya.

---

# 4. Core Financial Questions

TeeStock harus selalu mampu menjawab:

```text id="fin002"
HOW MUCH DID WE SELL?

HOW MUCH DID WE ACTUALLY EARN?

WHAT DID IT COST?

WHERE IS CASH TIED UP?

WHICH BUSINESS LINE CREATES VALUE?

WHICH CUSTOMER / PRODUCT DESTROYS MARGIN?

HOW MUCH CASH DO WE HAVE?

HOW LONG CAN WE OPERATE?

WHERE SHOULD THE NEXT RUPIAH GO?
```

---

# 5. Financial Architecture

Canonical:

```text id="fin003"
REVENUE
↓
COGS / DIRECT COST
↓
GROSS MARGIN
↓
VARIABLE OPERATING COST
↓
CONTRIBUTION
↓
FIXED OPERATING EXPENSE
↓
OPERATING PROFIT
↓
CAPITAL / CASH MOVEMENT
```

---

# 6. Revenue Is Not Cash

Critical:

```text id="fin004"
REVENUE
economic earning.

CASH RECEIPT
actual money received.
```

They may occur at different times.

---

# 7. Cash Is Not Profit

Canonical:

```text id="fin005"
CASH IN BANK
≠
PROFIT
```

Examples:

- customer deposit,
- supplier credit,
- owner capital,

can increase cash without creating profit.

---

# 8. Profit Is Not Cash Flow

A profitable month can still create cash stress because money is trapped in:

```text id="fin006"
INVENTORY
RECEIVABLES
PREPAID COSTS
```

---

# 9. TeeStock Economic Layers

Canonical financial layers:

```text id="fin007"
COMMERCE
SERVICES
ORIGINALS
PROGRAMS
SHARED INFRASTRUCTURE
```

---

# 10. Commerce Economics

Commerce monetizes:

```text id="fin008"
PRODUCT SALES
```

including:

- Selects,
- Essentials,
- Originals products sold via Commerce.

---

# 11. Services Economics

Services monetize:

```text id="fin009"
CAPABILITY
+
PROJECT EXECUTION
+
OPERATING SERVICES
```

including:

- Custom,
- Business,
- Merch,
- Studio,
- Supply,
- Fulfill.

---

# 12. Originals Economics

Originals creates financial value through:

```text id="fin010"
PRODUCT MARGIN
+
OWNED IP
+
BRAND EQUITY
+
FUTURE LICENSING / BRAND OPTIONALITY
```

Not all value is immediately visible in accounting profit.

---

# 13. Programs Economics

Programs influence economics through:

```text id="fin011"
ROYALTY
COMMISSION
RESELLER MARGIN
PARTNER COST
```

but Programs themselves are usually operating mechanisms, not standalone customer revenue lines.

---

# 14. Shared Infrastructure Economics

Shared infrastructure creates leverage by reducing duplicated cost across:

```text id="fin012"
COMMERCE
SERVICES
ORIGINALS
PROGRAMS
```

---

# 15. Revenue Architecture

Canonical revenue categories:

```text id="fin013"
PRODUCT REVENUE
SERVICE REVENUE
FULFILLMENT / OPERATING REVENUE
OTHER APPROVED REVENUE
```

---

# 16. Product Revenue

Includes sale of:

```text id="fin014"
ESSENTIALS
SELECTS
ORIGINALS
SUPPLY PRODUCTS
```

depending commercial channel.

---

# 17. Service Revenue

Includes:

```text id="fin015"
CUSTOM
BUSINESS
MERCH SERVICES
STUDIO
FULFILLMENT SERVICES
```

---

# 18. Hybrid Revenue

Some engagements combine:

```text id="fin016"
PRODUCT
+
SERVICE
```

Example:

Business apparel project may include:

- garments,
- printing,
- design,
- packing.

---

# 19. Revenue Attribution

Each revenue transaction should ideally know:

```text id="fin017"
BUSINESS LINE
PRODUCT / SERVICE
CUSTOMER
CHANNEL
ORDER
CAMPAIGN
PROGRAM ATTRIBUTION
```

---

# 20. Revenue Source of Truth

Canonical:

```text id="fin018"
TRANSACTION / ORDER SYSTEM
→
FINANCIAL LEDGER
```

not manually entered summary where avoidable.

---

# 21. Gross Sales

Gross Sales represents transaction value before adjustments.

---

# 22. Net Sales

Conceptually:

```text id="fin019"
GROSS SALES
-
DISCOUNT
-
REFUND
-
CANCELLATION
=
NET SALES
```

tax treatment handled according to applicable accounting/tax rules.

---

# 23. Discount Is Economic Cost

Discount should not disappear from analysis.

It reduces realized selling value.

---

# 24. Refund

Refund reverses part or all of prior commercial value.

Must remain traceable to original order.

---

# 25. Revenue by Channel

Track:

```text id="fin020"
OWN WEBSITE
MARKETPLACE
RESELLER
DIRECT SALES
SOCIAL COMMERCE
```

because channel economics differ.

---

# 26. Channel Revenue Is Not Channel Profitability

Marketplace may produce high revenue but also:

```text id="fin021"
PLATFORM FEES
PROMOTION FEES
SHIPPING SUBSIDY
AD COST
```

---

# 27. COGS

Canonical:

> **Cost of Goods Sold adalah direct cost required to deliver sold product.**

Potential:

```text id="fin022"
BASE GARMENT
MATERIAL
PRODUCTION
DIRECT PACKAGING
DIRECT PARTNER COST
```

depending accounting policy.

---

# 28. Service Direct Cost

For services:

```text id="fin023"
DIRECT LABOR
FREELANCER / PARTNER
MATERIAL
PROJECT PRODUCTION
```

may form service delivery cost.

---

# 29. Direct vs Indirect Cost

Critical:

```text id="fin024"
DIRECT COST
can be reasonably linked to transaction / product / project.

INDIRECT COST
supports broader operation.
```

---

# 30. Variable vs Fixed Cost

Separate dimension:

```text id="fin025"
VARIABLE
changes with activity.

FIXED
largely persists regardless of short-term volume.
```

---

# 31. A Cost Can Be Direct and Variable

Example:

```text id="fin026"
GARMENT COST
```

---

# 32. A Cost Can Be Indirect and Fixed

Example:

```text id="fin027"
CORE SOFTWARE SUBSCRIPTION
```

---

# 33. Gross Margin

Conceptually:

```text id="fin028"
NET SALES
-
COGS
=
GROSS MARGIN
```

---

# 34. Gross Margin %

```text id="fin029"
GROSS MARGIN
/
NET SALES
```

---

# 35. Gross Margin Is Not Enough

It can ignore:

```text id="fin030"
PAYMENT FEES
MARKETPLACE FEES
AFFILIATE COMMISSION
ROYALTY
FULFILLMENT
CUSTOMER SUPPORT
```

---

# 36. Contribution Margin

TeeStock should use contribution analysis.

Canonical:

```text id="fin031"
NET SALES
-
ALL RELEVANT VARIABLE COSTS
=
CONTRIBUTION
```

---

# 37. Contribution Is Decision Metric

Contribution helps answer:

> Does each additional transaction create more economic value or more loss?

---

# 38. Contribution Layering

Recommended conceptual layers:

```text id="fin032"
CM1
Product Gross Margin

CM2
after transaction/channel variable cost

CM3
after fulfillment/program variable cost

CM4
after directly attributable acquisition/service cost
```

Exact implementation belongs in Unit Economics.

---

# 39. CM1

Conceptually:

```text id="fin033"
NET SALES
-
PRODUCT / DIRECT DELIVERY COST
```

---

# 40. CM2

Potentially after:

```text id="fin034"
PAYMENT FEE
MARKETPLACE FEE
```

---

# 41. CM3

Potentially after:

```text id="fin035"
FULFILLMENT
PACKAGING
ROYALTY
AFFILIATE COMMISSION
```

---

# 42. CM4

Potentially after transaction-attributable:

```text id="fin036"
PAID ACQUISITION
SALES COMMISSION
OTHER VARIABLE SERVICING COST
```

---

# 43. Do Not Force One Universal CM Definition Blindly

Different business models may require slightly different layers.

But definitions must be stable and documented.

---

# 44. Product Economics

Each recurring Product should ideally know:

```text id="fin037"
SELLING PRICE
COGS
VARIABLE FEES
FULFILLMENT
ROYALTY if any
CONTRIBUTION
```

---

# 45. Service Economics

Each Service Order/Project should know:

```text id="fin038"
REVENUE
DIRECT MATERIAL
DIRECT PRODUCTION
PARTNER / FREELANCER
DIRECT LABOR
VARIABLE OVERHEAD where useful
CONTRIBUTION
```

---

# 46. Customer Economics

Important for B2B/recurring accounts.

Track:

```text id="fin039"
REVENUE
MARGIN
SUPPORT LOAD
CREDIT COST
RETURNS
```

---

# 47. Revenue Without Contribution Is Not Growth

Canonical:

```text id="fin040"
MORE SALES
+
NEGATIVE CONTRIBUTION
=
FASTER VALUE DESTRUCTION
```

---

# 48. Contribution Before Scale

Every repeatable offer should ideally demonstrate positive contribution before aggressive scaling.

Exceptions must be strategic and intentional.

---

# 49. Loss Leader

Possible but should be explicit.

Canonical:

```text id="fin041"
INTENTIONAL LOSS
≠
UNKNOWN LOSS
```

---

# 50. Customer Acquisition Cost

CAC should be measured where acquisition spend exists.

Conceptually:

```text id="fin042"
ACQUISITION SPEND
/
NEW CUSTOMERS
```

with careful attribution.

---

# 51. CAC vs Affiliate Commission

Affiliate commission is performance-based acquisition cost.

---

# 52. CAC vs Creator Royalty

Creator royalty is IP/economic sharing cost.

Do not classify identically without reason.

---

# 53. Customer Lifetime Value

Future useful metric when repeat purchase data becomes meaningful.

Avoid fake precision early.

---

# 54. LTV Principle

LTV should derive from:

```text id="fin043"
ACTUAL REPEAT BEHAVIOR
+
MARGIN
+
RETENTION
```

not optimistic assumptions.

---

# 55. Operating Expenses

Canonical categories may include:

```text id="fin044"
PEOPLE
SOFTWARE
RENT
UTILITIES
MARKETING
PROFESSIONAL FEES
ADMIN
TECHNOLOGY
```

---

# 56. Fixed Operating Cost

Costs that largely remain regardless of short-term volume.

---

# 57. Variable Operating Cost

Costs scaling with:

- orders,
- projects,
- participants.

---

# 58. Semi-Variable Cost

Some costs have base + usage component.

Example:

software platform with transaction fees.

---

# 59. Founder Compensation

Founder labor is not economically free.

Even if no salary is paid initially, management should understand founder time burden.

---

# 60. Founder Time as Shadow Cost

May be tracked separately early to evaluate scalability.

---

# 61. Hidden Manual Labor

If each order requires:

```text id="fin045"
45 MINUTES FOUNDER WORK
```

that is real economic friction even if payroll says zero.

---

# 62. Automation ROI

Evaluate automation against:

```text id="fin046"
TIME SAVED
ERROR REDUCTION
SPEED
CAPACITY
CASH IMPACT
```

not technology novelty.

---

# 63. Headcount Economics

Hire when role creates/captures more value than cost and persistent workload exists.

---

# 64. Shared Costs

TeeStock shares:

```text id="fin047"
WAREHOUSE
SOFTWARE
OPERATIONS
FINANCE
TECH
```

across multiple business lines.

---

# 65. Shared Cost Allocation

Needed for management insight.

But avoid fake precision.

---

# 66. Allocation Principle

Use allocation driver that reasonably reflects consumption.

Examples:

```text id="fin048"
ORDERS
REVENUE
LABOR HOURS
STORAGE SPACE
TRANSACTIONS
```

---

# 67. Shared Cost Allocation Is Management View

It does not necessarily equal legal accounting/tax treatment.

---

# 68. Avoid Arbitrary Equal Split

Canonical:

```text id="fin049"
25% / 25% / 25% / 25%
```

is poor allocation unless actual resource use supports it.

---

# 69. Business-Line P&L

TeeStock should eventually view:

```text id="fin050"
COMMERCE P&L
SERVICES P&L
ORIGINALS P&L
```

with appropriate sub-lines.

---

# 70. Commerce P&L

May separate:

```text id="fin051"
SELECTS
ESSENTIALS
ORIGINALS DISTRIBUTION
```

---

# 71. Services P&L

May separate:

```text id="fin052"
CUSTOM
BUSINESS
MERCH
STUDIO
SUPPLY
FULFILL
```

---

# 72. Originals P&L

Should measure:

```text id="fin053"
LABEL / COLLECTION REVENUE
PRODUCT COST
CREATIVE COST
MARKETING
CONTRIBUTION
INVENTORY
```

---

# 73. Originals Investment View

New brand/collection costs may be partially experimental investment.

Still must be visible.

---

# 74. Label Economics

Each label should eventually know:

```text id="fin054"
NET SALES
COGS
MARKETING
CREATIVE
FULFILLMENT
CONTRIBUTION
INVENTORY VALUE
```

---

# 75. Collection Economics

Each collection should have post-launch P&L.

---

# 76. Selects Economics

Need to include creator royalty where applicable.

---

# 77. Merch Economics

Need to include:

```text id="fin055"
PARTNER PAYOUT
ROYALTY / REVENUE SHARE
FULFILLMENT
PRODUCT COST
```

---

# 78. Creator Economics

Canonical:

```text id="fin056"
ELIGIBLE SALE
↓
ROYALTY RULE
↓
CREATOR EARNING
```

---

# 79. Affiliate Economics

Canonical:

```text id="fin057"
ATTRIBUTED ELIGIBLE SALE
↓
COMMISSION RULE
↓
AFFILIATE EARNING
```

---

# 80. Reseller Economics

TeeStock economics occur at reseller selling price to reseller:

```text id="fin058"
RESELLER BUY PRICE
-
TEEStock DIRECT COST
=
TEEStock CONTRIBUTION
```

Reseller customer selling price belongs to reseller economics.

---

# 81. Partner Economics

Operational partners contribute to:

```text id="fin059"
COGS
FULFILLMENT COST
SERVICE COST
PROCUREMENT COST
```

depending role.

---

# 82. Program Payouts

Payouts should reconcile to:

```text id="fin060"
UNDERLYING TRANSACTION
+
RULE
+
LEDGER
```

---

# 83. Payout Liability

Validated but unpaid creator/affiliate earnings represent obligation.

---

# 84. Gross vs Net Payout

Any tax/admin treatment should be explicitly defined.

---

# 85. Returns Economics

Refunds create:

```text id="fin061"
REVENUE REVERSAL
+
POTENTIAL RETURN COST
+
POTENTIAL INVENTORY RECOVERY
```

---

# 86. Return Cost Attribution

Should know whether cost arises from:

```text id="fin062"
PRODUCT
PRODUCTION
FULFILLMENT
CARRIER
CUSTOMER PREFERENCE
```

---

# 87. Replacement Cost

Replacement is real failure cost.

Do not bury it.

---

# 88. Warranty / Claim Recovery

Supplier/partner/carrier recovery reduces net failure cost.

---

# 89. Inventory Economics

Canonical:

> **Inventory is cash that has been converted into stock and has not yet returned as customer cash.**

---

# 90. Inventory Investment

Track:

```text id="fin063"
ON HAND VALUE
WIP VALUE
INBOUND COMMITMENT
DEAD STOCK
```

---

# 91. Inventory Carrying Cost

Potential components:

```text id="fin064"
CAPITAL
STORAGE
DAMAGE
OBSOLESCENCE
HANDLING
```

Even if not formally allocated per SKU early.

---

# 92. Dead Stock

Represents both:

- cash trapped,
- forecasting/assortment learning.

---

# 93. Inventory Turn

Useful to understand how efficiently inventory converts into sales.

---

# 94. Inventory Days

Useful working-capital metric.

---

# 95. Working Capital

Canonical:

```text id="fin065"
INVENTORY
+
ACCOUNTS RECEIVABLE
-
ACCOUNTS PAYABLE
```

as simplified operating working-capital view.

---

# 96. Working Capital Matters

Growth can consume cash if:

```text id="fin066"
BUY FIRST
SELL LATER
COLLECT EVEN LATER
```

---

# 97. Negative Working Capital

Some commerce models may receive cash before paying supplier.

This can be financially attractive if sustainable.

---

# 98. Customer Deposit

Custom/Business projects may use:

```text id="fin067"
DEPOSIT
```

to finance production.

---

# 99. Deposit Is Not Automatically Earned Revenue

Treatment depends on accounting/revenue recognition rules.

Management system should preserve distinction.

---

# 100. Accounts Receivable

For approved credit customers:

```text id="fin068"
INVOICE
DUE DATE
OUTSTANDING
PAYMENT
```

must be tracked.

---

# 101. Credit Is Capital Allocation

Granting payment terms means TeeStock finances customer temporarily.

---

# 102. Credit Terms

Should be granted intentionally.

Not because:

> “customer langganan.”

---

# 103. Credit Risk

Evaluate:

```text id="fin069"
PAYMENT HISTORY
ORDER VALUE
CUSTOMER QUALITY
OUTSTANDING EXPOSURE
```

---

# 104. Credit Limit

Future B2B account may have:

```text id="fin070"
CREDIT LIMIT
```

---

# 105. Past-Due Receivable

Should create collection action.

---

# 106. Bad Debt

Uncollectible receivable is real economic loss.

---

# 107. Accounts Payable

Track supplier/partner obligations:

```text id="fin071"
INVOICE
DUE DATE
AMOUNT
STATUS
```

---

# 108. Payables Strategy

Longer supplier terms can improve cash flow.

But damaging supplier relationships for short-term cash is not good finance.

---

# 109. Payment Schedule

MGBOS should eventually surface:

```text id="fin072"
WHAT MUST BE PAID
WHEN
HOW MUCH
TO WHOM
```

---

# 110. Cash Conversion Cycle

Conceptually combines:

```text id="fin073"
INVENTORY DAYS
+
RECEIVABLE DAYS
-
PAYABLE DAYS
```

---

# 111. Cash Conversion Objective

Reduce unnecessary time between:

```text id="fin074"
CASH OUT
→
CASH BACK IN
```

without damaging service.

---

# 112. Preorder Economics

Preorder can reduce inventory/cash exposure.

But creates:

- fulfillment commitment,
- customer patience requirement.

---

# 113. Made-to-Order Economics

Can reduce finished inventory.

But may increase:

- production cost,
- lead time,
- handling complexity.

---

# 114. Ready-Stock Economics

Can improve conversion/speed.

But consumes:

- inventory capital,
- obsolescence risk.

---

# 115. Hybrid Inventory Model

TeeStock preferred early architecture:

```text id="fin075"
STANDARD BASE INVENTORY
+
CONTROLLED ON-DEMAND DECORATION
+
SELECTIVE FINISHED STOCK
```

---

# 116. Capital Expenditure

CapEx includes investment in longer-lived assets such as:

```text id="fin076"
MACHINES
EQUIPMENT
WAREHOUSE FITOUT
TECH INFRASTRUCTURE
```

depending accounting treatment.

---

# 117. Operating Expense vs CapEx

Do not mix business cash decisions purely because accounting categories differ.

Both consume cash.

---

# 118. CapEx Decision

Should answer:

```text id="fin077"
WHAT PROBLEM DOES IT SOLVE?

HOW MUCH VOLUME?

WHAT SAVING / MARGIN?

WHAT PAYBACK?

WHAT RISK?

WHAT ALTERNATIVE?
```

---

# 119. Vertical Integration Economics

For buying production equipment:

compare:

```text id="fin078"
OUTSOURCED COST
vs
INTERNAL FIXED + VARIABLE COST
```

---

# 120. Break-Even Volume

Potentially calculate volume where internal capability becomes economically attractive.

---

# 121. CapEx Is Not Prestige

Do not buy machines because:

> “biar kelihatan punya pabrik sendiri.”

---

# 122. Asset Utilization

Owned equipment must earn its capital.

---

# 123. MultiGraph Transfer Economics

Critical for ecosystem clarity.

If MultiGraph produces for TeeStock:

```text id="fin079"
TEEStock
should record
TRANSFER / MANAGEMENT COST
```

---

# 124. Related Party Is Not Free Production

Canonical.

Otherwise TeeStock margin appears artificially high.

---

# 125. Transfer Price

Can be based on:

```text id="fin080"
STANDARD COST + MARKUP
MARKET-COMPARABLE RATE
AGREED MANAGEMENT RATE
```

subject to legal/accounting guidance where applicable.

---

# 126. Management vs Legal Transfer Pricing

Internal managerial economics may differ from formal tax/legal transfer-pricing requirements.

Legal/accounting compliance must be handled separately.

---

# 127. MultiGraph Shared Infrastructure

Shared resources may include:

```text id="fin081"
WAREHOUSE
PRODUCTION
ADMIN
FINANCE
TECH
```

---

# 128. Shared Infrastructure Charge

Use reasonable allocation rather than hiding cost.

---

# 129. Contribution by Business Unit

MultiGraph ecosystem should eventually compare:

```text id="fin082"
TEEStock CONTRIBUTION
MULTIGRAPH CONTRIBUTION
SHARED INFRASTRUCTURE COST
```

without double-counting.

---

# 130. Intercompany Elimination

At consolidated group level, internal revenue/cost may need elimination in formal consolidated reporting.

Management systems should preserve both operational and group views.

---

# 131. Cash Architecture

Canonical cash categories:

```text id="fin083"
OPERATING CASH
RESERVE
TAX / STATUTORY
CAPITAL / INVESTMENT
```

Exact bank-account structure can follow Treasury Policy.

---

# 132. Cash Position

At minimum know:

```text id="fin084"
CASH AVAILABLE
EXPECTED INFLOWS
EXPECTED OUTFLOWS
NEAR-TERM OBLIGATIONS
```

---

# 133. Cash Forecast

Future rolling forecast:

```text id="fin085"
OPENING CASH
+
EXPECTED CASH IN
-
EXPECTED CASH OUT
=
ENDING CASH
```

---

# 134. Cash Forecast Horizon

Potential:

```text id="fin086"
13-WEEK
```

rolling cash forecast can become useful once operations mature.

---

# 135. Cash Runway

Conceptually:

```text id="fin087"
AVAILABLE CASH
/
NET CASH BURN
```

for periods of negative cash flow.

---

# 136. Runway Caveat

If business is profitable/cash-generative, runway becomes less useful than liquidity buffer.

---

# 137. Minimum Cash Buffer

Future Treasury Policy may define:

```text id="fin088"
OPERATING RESERVE
```

---

# 138. Cash Burn

Should separate:

```text id="fin089"
OPERATING LOSS
CAPEX
INVENTORY BUILD
ONE-OFF INVESTMENT
```

to understand why cash declines.

---

# 139. Growth Investment

Growth spending can include:

- inventory,
- marketing,
- people,
- product development.

Each should have explicit thesis.

---

# 140. Capital Allocation

Canonical:

> **Every meaningful use of cash competes against every other use of cash.**

---

# 141. Capital Allocation Categories

Potential:

```text id="fin090"
WORKING CAPITAL
GROWTH
CAPABILITY
TECH
BRAND / ORIGINALS
RESERVE
```

---

# 142. Capital Allocation Questions

```text id="fin091"
WHAT RETURN DO WE EXPECT?

HOW CERTAIN IS IT?

HOW REVERSIBLE IS IT?

HOW MUCH CASH IS LOCKED?

WHAT ELSE COULD WE DO WITH THE MONEY?
```

---

# 143. Reversible Before Irreversible

Early-stage principle:

```text id="fin092"
TEST WITH LOW CAPITAL
BEFORE
HIGH-CAPITAL COMMITMENT
```

---

# 144. Inventory vs Marketing

Both compete for cash.

More inventory with no demand is not automatically safer than marketing spend.

---

# 145. Marketing Spend

Should distinguish:

```text id="fin093"
BRAND
PERFORMANCE
CONTENT
CREATOR
PROMOTION
```

where useful.

---

# 146. Performance Marketing

Should eventually connect spend to:

```text id="fin094"
ORDERS
CUSTOMERS
CONTRIBUTION
```

---

# 147. Brand Marketing

Harder to attribute directly.

Still needs budget and hypothesis.

---

# 148. Promotion Economics

Discount campaign should model:

```text id="fin095"
EXPECTED VOLUME LIFT
MARGIN LOSS
INVENTORY EFFECT
CUSTOMER QUALITY
```

---

# 149. Revenue Growth vs Margin Growth

Both matter.

Do not assume highest-growth channel is best channel.

---

# 150. Profitability Layers

Recommended management views:

```text id="fin096"
ORDER
PRODUCT
CUSTOMER
CHANNEL
BUSINESS LINE
TOTAL COMPANY
```

---

# 151. Order Profitability

Useful for:

- Custom,
- Business,
- complex Commerce orders.

---

# 152. Product Profitability

Shows whether specific SKU/product creates value.

---

# 153. Customer Profitability

Important for recurring B2B.

---

# 154. Channel Profitability

Includes channel-specific:

- fees,
- promotions,
- acquisition.

---

# 155. Business-Line Profitability

Shows strategic engine performance.

---

# 156. Total Company Profitability

Includes all operating expenses and shared infrastructure.

---

# 157. Management P&L

Recommended structure conceptually:

```text id="fin097"
NET REVENUE

- DIRECT PRODUCT / SERVICE COST

= GROSS MARGIN

- TRANSACTION VARIABLE COST

- FULFILLMENT VARIABLE COST

- PROGRAM PAYOUTS

- ATTRIBUTABLE ACQUISITION COST

= CONTRIBUTION

- FIXED / SHARED OPERATING EXPENSE

= OPERATING PROFIT
```

---

# 158. EBITDA

Can be used later if relevant.

Do not let finance vocabulary replace operational understanding.

---

# 159. Accounting Profit

Formal accounting statements must follow applicable accounting/tax standards and professional advice.

This document defines management architecture.

---

# 160. Balance Sheet Awareness

TeeStock should understand at minimum:

```text id="fin098"
CASH
INVENTORY
RECEIVABLE
PAYABLE
OWNER EQUITY / CAPITAL
DEBT if any
```

---

# 161. Income Statement Awareness

Understand:

```text id="fin099"
REVENUE
COST
EXPENSE
PROFIT
```

---

# 162. Cash Flow Awareness

Understand movement across:

```text id="fin100"
OPERATING
INVESTING
FINANCING
```

---

# 163. Three Financial Statements

Long term:

```text id="fin101"
INCOME STATEMENT
BALANCE SHEET
CASH FLOW
```

should reconcile.

---

# 164. Early Management Finance

V1 does not need enterprise FP&A tooling.

But core transaction truth should be structured from day one.

---

# 165. Budget

Budget answers:

> What do we plan to spend/earn?

---

# 166. Forecast

Forecast answers:

> What do we now expect based on latest reality?

---

# 167. Budget ≠ Forecast

Canonical:

```text id="fin102"
BUDGET
plan.

FORECAST
updated expectation.
```

---

# 168. Actual

What actually happened.

---

# 169. Variance Analysis

Canonical:

```text id="fin103"
ACTUAL
vs
BUDGET
vs
FORECAST
```

---

# 170. Revenue Variance

Could come from:

```text id="fin104"
VOLUME
PRICE
MIX
CHANNEL
```

---

# 171. Margin Variance

Could come from:

```text id="fin105"
INPUT COST
DISCOUNT
PRODUCT MIX
SCRAP
RETURNS
CHANNEL FEES
```

---

# 172. Cash Variance

Could come from:

```text id="fin106"
INVENTORY BUY
SLOW COLLECTION
EARLY PAYMENT
CAPEX
LOW SALES
```

---

# 173. Scenario Planning

Useful scenarios:

```text id="fin107"
BASE
UPSIDE
DOWNSIDE
```

---

# 174. Scenario Drivers

Potential:

```text id="fin108"
SALES GROWTH
MARGIN
INVENTORY
CAC
HEADCOUNT
CAPEX
```

---

# 175. Scenario Planning Is Not Prediction

It is preparation.

---

# 176. Break-Even

Conceptually:

> At what activity level does contribution cover fixed operating cost?

---

# 177. Break-Even Revenue

Depends on blended contribution margin.

---

# 178. Break-Even by Service

Can help understand viability of new capability.

---

# 179. Fixed Cost Leverage

As volume grows:

fixed cost per unit may decline.

But only if new complexity/headcount does not grow equally fast.

---

# 180. Operating Leverage

TeeStock's long-term system/automation thesis seeks:

```text id="fin109"
REVENUE GROWTH
>
OPERATING COST GROWTH
```

---

# 181. Automation Leverage

Canonical:

```text id="fin110"
MORE TRANSACTIONS
WITHOUT
PROPORTIONAL HEADCOUNT
```

---

# 182. AI Economics

AI infrastructure itself has cost:

```text id="fin111"
MODEL USAGE
COMPUTE
TOOLS
MONITORING
HUMAN REVIEW
```

---

# 183. AI ROI

Measure against:

```text id="fin112"
LABOR SAVED
ERROR REDUCTION
REVENUE ENABLED
FASTER CYCLE
```

---

# 184. No AI for Cost-Blind Prestige

Canonical.

---

# 185. Financial Controls

Critical actions require controls:

```text id="fin113"
REFUND
CREDIT
DISCOUNT
PURCHASE
PAYOUT
WRITE-OFF
```

---

# 186. Approval Thresholds

Exact values belong in Decision Thresholds.

---

# 187. Segregation of Duties

As team grows, avoid one person controlling:

```text id="fin114"
REQUEST
APPROVE
PAY
RECONCILE
```

for material transactions.

---

# 188. Small-Team Reality

Early founder may perform multiple roles.

Still preserve:

```text id="fin115"
REQUEST
APPROVAL
EXECUTION
RECORD
```

conceptually in system.

---

# 189. Financial Audit Trail

Every material money movement should answer:

```text id="fin116"
WHAT?
WHY?
RELATED TO WHAT?
WHO APPROVED?
WHO EXECUTED?
WHEN?
```

---

# 190. No Cash Movement Without Category

Canonical:

> **Every meaningful cash transaction must have a business reason and accounting/management category.**

---

# 191. Payment Reconciliation

Customer payment should reconcile to:

```text id="fin117"
ORDER
INVOICE
CUSTOMER
```

---

# 192. Supplier Payment Reconciliation

Should reconcile to:

```text id="fin118"
PO
GOODS RECEIPT
INVOICE
```

where applicable.

---

# 193. Program Payout Reconciliation

Should reconcile:

```text id="fin119"
TRANSACTION
→ EARNING
→ PAYOUT
```

---

# 194. Bank Reconciliation

Future finance process should compare:

```text id="fin120"
BOOK / SYSTEM
vs
BANK
```

---

# 195. Marketplace Settlement

Marketplace may settle:

```text id="fin121"
GROSS SALES
-
FEES
-
REFUNDS
-
OTHER DEDUCTIONS
=
NET CASH RECEIVED
```

Need reconciliation.

---

# 196. Payment Gateway Settlement

Same principle.

---

# 197. Financial Data Integrity

Do not infer profit purely from bank balance.

---

# 198. Order Economics Before Commit

For B2B/custom work:

expected economics should be visible before quote acceptance.

---

# 199. Margin Floor

Future pricing rules may define minimum acceptable contribution.

---

# 200. Margin Override

Below-floor deal requires explicit rationale/approval.

---

# 201. Strategic Exception

Possible reasons:

```text id="fin122"
CUSTOMER ACQUISITION
PORTFOLIO ENTRY
CAPACITY UTILIZATION
LEARNING
STRATEGIC PARTNERSHIP
```

but should remain visible.

---

# 202. No Hidden Subsidy

If one business line subsidizes another:

make it explicit.

---

# 203. Originals Subsidy

Early Originals may consume more creative/marketing investment than current profit.

Track intentionally as incubation investment.

---

# 204. Service Subsidy

Do not let profitable Services unknowingly subsidize unvalidated Commerce indefinitely.

---

# 205. Cash Discipline

Canonical:

```text id="fin123"
PROFITABILITY
+
LIQUIDITY
+
CAPITAL EFFICIENCY
```

all matter.

---

# 206. Capital Efficiency

Ask:

> How much capital is required to generate each unit of sustainable contribution/revenue?

---

# 207. Asset-Light Advantage

TeeStock can initially reduce capital requirements through:

```text id="fin124"
PARTNER PRODUCTION
SHARED INFRASTRUCTURE
ON-DEMAND PRODUCTION
LOW FINISHED INVENTORY
```

---

# 208. Asset-Light Does Not Mean Zero Cost

Partner margins and coordination still cost money.

---

# 209. Vertical Integration Threshold

Own capability only after economic and strategic evidence.

---

# 210. Financial Risk Categories

Potential:

```text id="fin125"
LIQUIDITY
MARGIN
INVENTORY
CREDIT
SUPPLIER
CONCENTRATION
FOREIGN EXCHANGE
FRAUD
```

---

# 211. Liquidity Risk

Not enough cash to meet obligations.

---

# 212. Margin Risk

Revenue grows while profitability weakens.

---

# 213. Inventory Risk

Too much cash trapped in low-demand products.

---

# 214. Credit Risk

Customers fail to pay.

---

# 215. Supplier Risk

Cost/availability changes reduce economics.

---

# 216. Concentration Risk

Too much revenue depends on:

```text id="fin126"
ONE CUSTOMER
ONE CHANNEL
ONE PRODUCT
ONE CREATOR
```

---

# 217. Revenue Concentration

Monitor top-customer/top-channel share where meaningful.

---

# 218. Supplier Concentration

Monitor critical input concentration.

---

# 219. Cash Risk Dashboard

Future MGBOS can surface:

```text id="fin127"
LOW CASH
LARGE PAYMENT DUE
HIGH RECEIVABLE
HIGH INVENTORY
LOW-MARGIN ORDERS
```

---

# 220. Financial Cadence

Potential:

```text id="fin128"
DAILY
cash / urgent payments

WEEKLY
collections / payables / sales / inventory cash

MONTHLY
P&L / margin / working capital

QUARTERLY
capital allocation / strategy
```

---

# 221. Daily Financial View

Focus:

```text id="fin129"
BANK / CASH
PAYMENTS DUE
COLLECTIONS
CRITICAL OBLIGATIONS
```

---

# 222. Weekly Financial Review

Focus:

```text id="fin130"
SALES
CONTRIBUTION
RECEIVABLES
PAYABLES
INVENTORY BUY
```

---

# 223. Monthly Close

Should reconcile:

```text id="fin131"
REVENUE
COST
INVENTORY
REFUNDS
PAYOUTS
OPERATING EXPENSE
```

---

# 224. Monthly Management P&L

Compare:

```text id="fin132"
ACTUAL
BUDGET
PRIOR PERIOD
```

when useful.

---

# 225. Quarterly Capital Review

Ask:

```text id="fin133"
WHERE DID CASH GO?

WHAT CREATED RETURN?

WHAT SHOULD RECEIVE MORE CAPITAL?

WHAT SHOULD STOP?
```

---

# 226. Financial KPIs

Top-level categories:

```text id="fin134"
REVENUE
MARGIN
CASH
WORKING CAPITAL
EFFICIENCY
RISK
```

---

# 227. Revenue KPIs

Potential:

```text id="fin135"
Net Sales
Revenue Growth
Revenue by Business Line
```

---

# 228. Margin KPIs

```text id="fin136"
Gross Margin
Contribution Margin
Contribution by Business Line
```

---

# 229. Cash KPIs

```text id="fin137"
Cash Balance
Operating Cash Flow
Cash Burn / Generation
Runway where relevant
```

---

# 230. Working Capital KPIs

```text id="fin138"
Inventory Days
Receivable Days
Payable Days
Cash Conversion Cycle
```

---

# 231. Efficiency KPIs

Potential:

```text id="fin139"
Revenue per Employee
Contribution per Employee
Automation Cost / Savings
```

later.

---

# 232. Risk KPIs

Potential:

```text id="fin140"
Revenue Concentration
Past-Due AR
Dead Stock
Low-Margin Orders
```

---

# 233. KPI Definitions Must Be Canonical

Same KPI cannot use different formulas in different dashboards.

---

# 234. Financial Data Model

Core future entities:

```text id="fin141"
TRANSACTION
PAYMENT
REFUND
INVOICE
RECEIVABLE
PAYABLE
EXPENSE
PAYOUT
COST ALLOCATION
BUDGET
FORECAST
```

---

# 235. Transaction Entity

Represents commercial economic event.

---

# 236. Payment Entity

Represents actual customer cash movement.

---

# 237. Invoice Entity

Represents amount billed.

---

# 238. Receivable Entity

Outstanding customer obligation.

---

# 239. Payable Entity

Outstanding TeeStock obligation.

---

# 240. Expense Entity

Operating/non-inventory spending.

---

# 241. Payout Entity

Creator/affiliate/partner economic settlement where relevant.

---

# 242. Cost Allocation Entity

Management allocation of shared cost.

---

# 243. Budget Entity

Approved planned financial amount.

---

# 244. Forecast Entity

Latest expected financial outcome.

---

# 245. Financial Dimensions

Every relevant financial record should support:

```text id="fin142"
BUSINESS UNIT
BUSINESS LINE
CUSTOMER
PRODUCT / SERVICE
CHANNEL
PROJECT
CAMPAIGN
PROGRAM
```

where meaningful.

---

# 246. Chart of Accounts

Formal accounting should use a structured Chart of Accounts.

Detailed account architecture can be created with accounting/tax input.

---

# 247. Management Dimensions vs Accounts

Canonical:

```text id="fin143"
ACCOUNT
what type of money event.

DIMENSION
where / why it happened.
```

---

# 248. Example

```text id="fin144"
ACCOUNT
Packaging Expense

DIMENSION
Originals / Label A / Collection 02
```

---

# 249. Financial Event Integration

Operational events should create finance-relevant records.

Examples:

```text id="fin145"
order.paid
inventory.received
shipment.created
refund.completed
creator_earning.validated
supplier_invoice.approved
```

---

# 250. MGBOS Role

MGBOS should eventually answer:

```text id="fin146"
How much did we sell?

How much contribution did we generate?

What cash came in?

What cash must go out?

Where is cash tied up?

Which products / customers / channels are profitable?

Which orders are below margin?

What obligations are unpaid?

What can we afford next?
```

---

# 251. Financial Dashboard

Potential:

```text id="fin147"
NET SALES
GROSS MARGIN
CONTRIBUTION
CASH
AR
AP
INVENTORY VALUE
REFUNDS
PAYOUTS
```

---

# 252. Business-Line Dashboard

Potential:

```text id="fin148"
REVENUE
CONTRIBUTION
OPERATING COST
CAPITAL EMPLOYED
```

---

# 253. Cash Dashboard

Potential:

```text id="fin149"
CASH TODAY
EXPECTED IN
EXPECTED OUT
13-WEEK FORECAST
LARGE OBLIGATIONS
```

---

# 254. Order Profitability View

Potential:

```text id="fin150"
SELLING PRICE
DIRECT COST
FEES
FULFILLMENT
PROGRAM PAYOUT
CONTRIBUTION
```

---

# 255. Product Profitability View

Potential:

```text id="fin151"
SALES
UNITS
AVERAGE PRICE
COGS
RETURN COST
CONTRIBUTION
INVENTORY VALUE
```

---

# 256. Automation Opportunities

Potential:

```text id="fin152"
Payment Reconciliation
Margin Calculation
Payout Accrual
AR Reminder
AP Schedule
Cash Forecast Update
Budget Variance
```

---

# 257. Automated Margin Check

Routine order can be checked against approved margin rules before acceptance.

---

# 258. Automatic Payout Accrual

Creator/affiliate earnings can accrue from validated transactions.

---

# 259. Automatic Refund Accounting

Refund event should update transaction economics.

---

# 260. Automatic Cash Forecast

Can incorporate:

```text id="fin153"
AR
AP
OPEN POs
PAYROLL
RECURRING COST
```

once data is reliable.

---

# 261. AI Role

AI may assist with:

```text id="fin154"
Variance Explanation
Cash-Risk Summary
Scenario Analysis
Cost Anomaly Detection
Management Reporting
```

---

# 262. AI Finance Boundary

AI should not independently:

```text id="fin155"
MOVE MONEY
APPROVE CREDIT
WRITE OFF ASSETS
CHANGE PRICE FLOORS
APPROVE LARGE PURCHASES
```

outside approved rules.

---

# 263. AI Forecasting

AI may improve forecasts.

But deterministic financial records remain source of truth.

---

# 264. AI Financial Narrative

Useful future example:

> Revenue rose 18%, but contribution rose only 4% because marketplace mix and promotional discount increased.

AI can explain, not redefine numbers.

---

# 265. Financial Maturity Model

```text id="fin156"
LEVEL 0
Bank balance thinking

LEVEL 1
Basic bookkeeping + cash tracking

LEVEL 2
Business-line revenue / cost / contribution

LEVEL 3
Working capital + forecasts + allocations

LEVEL 4
Integrated operational finance automation

LEVEL 5
Exception-based AI-assisted financial management
```

---

# 266. Level 0

Anti-goal:

> “Saldo masih banyak berarti bisnis untung.”

---

# 267. Level 1

Minimum:

```text id="fin157"
SALES
EXPENSE
CASH
INVENTORY BUY
PAYABLE
RECEIVABLE
```

---

# 268. Level 2

Adds:

```text id="fin158"
COGS
CONTRIBUTION
BUSINESS LINE
PRODUCT / PROJECT ECONOMICS
```

---

# 269. Level 3

Adds:

```text id="fin159"
BUDGET
FORECAST
WORKING CAPITAL
COST ALLOCATION
```

---

# 270. Level 4

Adds:

```text id="fin160"
REAL-TIME MARGIN
AUTOMATED RECONCILIATION
PAYOUT
CASH FORECAST
```

---

# 271. Level 5

System automatically surfaces:

```text id="fin161"
MARGIN RISK
CASH RISK
ANOMALY
CAPITAL ALLOCATION OPTIONS
```

for human decision.

---

# 272. Current Recommended Stage

TeeStock should target:

```text id="fin162"
LEVEL 1
→
LEVEL 2
```

first.

---

# 273. V1 Required Finance Truth

Priority:

```text id="fin163"
ORDER REVENUE
PAYMENT
PRODUCT / SERVICE COST
REFUND
EXPENSE
PAYABLE
RECEIVABLE
CASH
```

---

# 274. V1 Management View

At minimum:

```text id="fin164"
REVENUE
GROSS MARGIN
CONTRIBUTION
CASH
INVENTORY VALUE
AR
AP
```

monthly.

---

# 275. V1 Business-Line View

Track separately:

```text id="fin165"
COMMERCE
SERVICES
ORIGINALS
```

without overcomplicated cost allocation.

---

# 276. V1 Originals

Track actual:

```text id="fin166"
PRODUCT COST
CREATIVE COST
MARKETING COST
SALES
INVENTORY
```

even if small.

---

# 277. V1 MultiGraph Transfers

Record production/service cost instead of treating related-party work as free.

---

# 278. V1 Avoid

Do not immediately build:

```text id="fin167"
complex ERP finance
20-layer contribution model
fake LTV models
daily valuation models
advanced treasury optimization
```

before transaction data is reliable.

---

# 279. V2 Expansion

Possible:

```text id="fin168"
CM1–CM4
BUSINESS-LINE P&L
WORKING CAPITAL
ROLLING CASH FORECAST
BUDGET / FORECAST
```

---

# 280. V3 Expansion

Possible:

```text id="fin169"
CUSTOMER PROFITABILITY
CHANNEL PROFITABILITY
LABEL P&L
CAPITAL ALLOCATION DASHBOARD
AUTOMATED RECONCILIATION
```

---

# 281. V4 Expansion

Possible:

```text id="fin170"
INTEGRATED THREE-STATEMENT FORECAST
SCENARIO ENGINE
PREDICTIVE CASH MANAGEMENT
AI MANAGEMENT FINANCE
```

---

# 282. New Product Financial Gate

Before scaling product:

```text id="fin171"
PRICE KNOWN
+
DIRECT COST KNOWN
+
CONTRIBUTION POSITIVE / INTENTIONAL
+
INVENTORY RISK UNDERSTOOD
```

---

# 283. New Service Financial Gate

Before scaling service:

```text id="fin172"
DELIVERY COST
+
CAPACITY
+
CONTRIBUTION
+
FOUNDER / LABOR LOAD
```

must be understood.

---

# 284. Inventory Buy Gate

Large stock commitment requires:

```text id="fin173"
DEMAND EVIDENCE
+
CASH CAPACITY
+
SELL-THROUGH PLAN
+
MARGIN BENEFIT
```

---

# 285. Hiring Gate

Hire when:

```text id="fin174"
REPEATABLE WORKLOAD
+
ECONOMIC CAPACITY
+
EXPECTED VALUE
```

justify it.

---

# 286. CapEx Gate

Buy capability when:

```text id="fin175"
STRATEGIC CONTROL
+
SUFFICIENT VOLUME
+
ECONOMIC RETURN
+
CASH CAPACITY
```

are credible.

---

# 287. Discount Gate

Promotion must preserve intentional economics.

---

# 288. Credit Gate

Customer credit only with:

```text id="fin176"
APPROVED ACCOUNT
+
LIMIT
+
PAYMENT TERMS
+
RISK REVIEW
```

---

# 289. Payout Gate

Creator/affiliate payout only after:

```text id="fin177"
EARNING VALIDATED
+
REFUND / FRAUD CONDITIONS CLEARED
```

---

# 290. Financial Failure Modes

## Revenue = Profit

False economics.

## Bank Balance = Business Health

False liquidity interpretation.

## Related Party Work = Free

Distorted margin.

## Inventory Purchase = Expense Only

Poor working-capital view.

## No Refund Attribution

Product economics inaccurate.

## No Program Payout Accrual

Hidden liabilities.

## Shared Costs Ignored

Business lines look artificially profitable.

## Shared Costs Overallocated

Good businesses look bad.

## Growth Without Cash Forecast

Liquidity crisis.

---

# 291. What Financial Model Must Not Become

## Accounting Theater

Reports must support decisions.

## Dashboard Vanity

Revenue charts without margin/cash are insufficient.

## Precision Theater

Avoid complex allocation based on weak data.

## Founder Bank-Account Management

Cash and obligations belong in structured system.

## Growth-at-All-Costs Engine

Growth must eventually create contribution and cash.

---

# 292. Financial Success Definition

The system succeeds when TeeStock can answer:

```text id="fin178"
HOW MUCH DID WE SELL?

HOW MUCH DID WE KEEP?

WHAT DID EACH ORDER COST?

WHICH PRODUCTS MAKE MONEY?

WHICH SERVICES MAKE MONEY?

WHICH CHANNELS MAKE MONEY?

WHERE IS OUR CASH?

WHERE IS CASH TRAPPED?

WHAT DO WE OWE?

WHAT ARE CUSTOMERS OWING US?

HOW MUCH CAN WE SAFELY INVEST?

WHAT SHOULD RECEIVE THE NEXT RUPIAH?
```

---

# 293. Canonical Financial Summary

```text id="fin179"
REVENUE
measures commercial activity.

COGS
measures direct delivery cost.

CONTRIBUTION
measures transaction economics.

OPERATING EXPENSE
measures infrastructure cost.

WORKING CAPITAL
measures cash trapped in operations.

CASH FLOW
measures survival.

CAPITAL ALLOCATION
determines future direction.

MGBOS
connects operational reality to economic reality.
```

---

# 294. Canonical Financial Principles

```text id="fin180"
REVENUE IS NOT PROFIT.

PROFIT IS NOT CASH.

CASH IS SURVIVAL.

CONTRIBUTION BEFORE SCALE.

DIRECT COST BEFORE MARGIN CLAIMS.

RELATED-PARTY WORK IS NOT FREE.

INVENTORY IS CASH IN PHYSICAL FORM.

CREDIT IS CAPITAL ALLOCATION.

REFUNDS AND RETURNS BELONG IN PRODUCT ECONOMICS.

SHARED COSTS SHOULD BE VISIBLE, NOT FICTIONAL.

FORECAST IS NOT BUDGET.

ACTUALS MUST WIN OVER ASSUMPTIONS.

CAPITAL FOLLOWS EVIDENCE.

GROWTH MUST EVENTUALLY PRODUCE CASH AND CONTRIBUTION.
```

---

# 295. Dependency

Dokumen berikut harus follow Financial Model:

1. [[bisnis/teestock/08-finance/unit-economics|unit-economics.md]]
2. [[bisnis/teestock/08-finance/pricing-framework|pricing-framework.md]]
3. [[bisnis/teestock/08-finance/cost-accounting|cost-accounting.md]]
4. [[bisnis/teestock/08-finance/treasury-policy|treasury-policy.md]]
5. [[bisnis/teestock/09-marketing/go-to-market|go-to-market.md]]
6. [[bisnis/teestock/09-marketing/channel-strategy|channel-strategy.md]]
7. [[bisnis/teestock/10-product-tech/commerce-platform|commerce-platform.md]]
8. [[bisnis/teestock/10-product-tech/automation-architecture|automation-architecture.md]]
9. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
10. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
11. [[bisnis/teestock/11-data-mgbos/mgbos-integration|mgbos-integration.md]]
12. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]
13. [[bisnis/teestock/13-metrics-experiments/decision-thresholds|decision-thresholds.md]]

TeeStock Financial Model boleh berkembang menjadi integrated planning, forecasting, automated reconciliation, dan AI-assisted capital allocation system, tetapi financial sophistication hanya boleh dibangun di atas reliable transaction data, inventory truth, traceable costs, controlled payouts, disciplined cash management, dan consistent management definitions.