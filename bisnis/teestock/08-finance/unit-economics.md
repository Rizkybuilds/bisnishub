---
title: "TeeStock Unit Economics"
date: "2026-09-28"
bisnis: teestock
kategori: keuangan
status: active
tags:
  - bisnis/teestock
  - kategori/keuangan
  - teestock/canonical
  - teestock/finance
document_id: "TS-FIN-002"
version: "1.0"
category: "finance"
business: "teestock"
last_updated: "2026-09-28"
path: "08-finance/unit-economics.md"
depends_on:
  - "TS-FIN-001"
  - "TS-STR-002"
  - "TS-COM-001"
  - "TS-COM-002"
  - "TS-COM-003"
  - "TS-SVC-001"
  - "TS-ORG-001"
  - "TS-PRG-002"
  - "TS-PRG-003"
  - "TS-PRG-005"
  - "TS-OPS-003"
  - "TS-OPS-006"
  - "TS-OPS-008"
---


# TeeStock Unit Economics v1.0

> [!important] **Canonical TeeStock Transaction-Level Economics Framework  **
> Dokumen ini mendefinisikan unit of analysis, order economics, product economics, service economics, contribution margin layers, channel cost, payment fee, fulfillment cost, royalty, affiliate commission, discount, acquisition cost, returns, rework, shipping subsidy, customer profitability, margin floors, break-even logic, dan unit-economics integration dengan MGBOS.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/08-finance/financial-model|TS-FIN-001: TeeStock Financial Model]] • [[bisnis/teestock/01-strategy/business-model|TS-STR-002: TeeStock Business Model]] • [[bisnis/teestock/03-commerce/commerce-overview|TS-COM-001: TeeStock Commerce Overview]] • [[bisnis/teestock/03-commerce/teestock-selects|TS-COM-002: TeeStock Selects]] • [[bisnis/teestock/03-commerce/teestock-essentials|TS-COM-003: TeeStock Essentials]] • [[bisnis/teestock/04-services/services-overview|TS-SVC-001: TeeStock Services Overview]] • [[bisnis/teestock/05-originals/originals-master-plan|TS-ORG-001: TeeStock Originals Master Plan]] • [[bisnis/teestock/06-programs/creator-program|TS-PRG-002: TeeStock Creator Program]] • [[bisnis/teestock/06-programs/reseller-program|TS-PRG-003: TeeStock Reseller Program]] • [[bisnis/teestock/06-programs/affiliate-program|TS-PRG-005: TeeStock Affiliate Program]] • [[bisnis/teestock/07-operations/production-system|TS-OPS-003: TeeStock Production System]] • [[bisnis/teestock/07-operations/order-fulfillment|TS-OPS-006: TeeStock Order Fulfillment System]] • [[bisnis/teestock/07-operations/returns-and-warranty|TS-OPS-008: TeeStock Returns & Warranty System]]


---

# 1. Purpose

Unit Economics menjawab:

> **Setelah satu transaksi benar-benar terjadi, berapa economic value yang TeeStock ciptakan atau hancurkan?**

Canonical principle:

> **Every transaction should know its economics.**

---

# 2. Canonical Definition

> **TeeStock Unit Economics adalah management framework yang mengukur revenue, direct cost, variable operating cost, acquisition cost, program payout, fulfillment cost, returns, dan contribution pada level unit transaksi yang cukup granular untuk mendukung pricing, channel, product, customer, dan scale decisions.**

---

# 3. Why Unit Economics Matter

Revenue dapat tumbuh sambil bisnis memburuk.

Canonical:

```text id="ue001"
MORE ORDERS
×
NEGATIVE UNIT ECONOMICS
=
FASTER LOSSES
```

---

# 4. Unit of Analysis

Tidak ada satu unit universal untuk semua TeeStock.

Potential units:

```text id="ue002"
ORDER
ORDER ITEM
PRODUCT
SKU
SERVICE JOB
PROJECT
CUSTOMER
CHANNEL
CAMPAIGN
COLLECTION
LABEL
```

---

# 5. Primary Unit

Untuk Commerce:

```text id="ue003"
ORDER ITEM
+
ORDER
```

adalah primary unit.

Untuk Services:

```text id="ue004"
PROJECT / SERVICE ORDER
```

lebih relevan.

---

# 6. Product Economics vs Order Economics

Critical distinction:

```text id="ue005"
PRODUCT ECONOMICS
economics of the item itself.

ORDER ECONOMICS
economics after basket-level costs.
```

---

# 7. Example

Product may have strong margin.

But Order may have weak contribution due to:

```text id="ue006"
FREE SHIPPING
DISCOUNT
PAYMENT FEE
AFFILIATE COMMISSION
```

---

# 8. Revenue Basis

Start from:

```text id="ue007"
GROSS SELLING VALUE
```

then account for adjustments.

---

# 9. Gross Merchandise Value

GMV can be useful operationally.

But:

```text id="ue008"
GMV
≠
NET REVENUE
≠
CONTRIBUTION
```

---

# 10. Net Sales

Conceptually:

```text id="ue009"
GROSS SALES
-
DISCOUNTS
-
REFUNDS / CANCELLATIONS
=
NET SALES
```

subject to formal accounting treatment.

---

# 11. Discount

A Rp20.000 discount is real lost selling value.

Do not hide it as:

> marketing saja.

---

# 12. Product Direct Cost

Potential:

```text id="ue010"
BASE GARMENT
DECORATION
LABEL
DIRECT PACKAGING
DIRECT MATERIAL
```

---

# 13. Production Cost

Can include:

```text id="ue011"
INTERNAL PROCESS
MULTIGRAPH TRANSFER COST
EXTERNAL PARTNER RATE
```

depending route.

---

# 14. Standard vs Actual Cost

For decision before sale:

```text id="ue012"
STANDARD / EXPECTED COST
```

For post-transaction analysis:

```text id="ue013"
ACTUAL COST
```

---

# 15. Expected Economics

Used before accepting/launching transaction.

---

# 16. Actual Economics

Used after fulfillment for learning and reconciliation.

---

# 17. Cost Variance

Canonical:

```text id="ue014"
ACTUAL COST
-
EXPECTED COST
=
UNIT COST VARIANCE
```

---

# 18. CM1

Recommended TeeStock definition:

```text id="ue015"
NET SALES
-
DIRECT PRODUCT / SERVICE DELIVERY COST
=
CM1
```

---

# 19. CM1 Includes

Depending business line:

```text id="ue016"
GARMENT
MATERIAL
PRODUCTION
DIRECT PARTNER
DIRECT SERVICE DELIVERY
```

---

# 20. CM1 Purpose

Answers:

> Does the product/service itself have healthy direct economics?

---

# 21. CM2

Recommended:

```text id="ue017"
CM1
-
TRANSACTION / CHANNEL COST
=
CM2
```

---

# 22. Transaction / Channel Cost

Potential:

```text id="ue018"
PAYMENT FEE
MARKETPLACE FEE
CHANNEL COMMISSION
TRANSACTION PLATFORM FEE
```

---

# 23. CM3

Recommended:

```text id="ue019"
CM2
-
FULFILLMENT
-
PACKAGING
-
PROGRAM PAYOUT
-
SHIPPING SUBSIDY
=
CM3
```

---

# 24. Program Payout

Potential:

```text id="ue020"
CREATOR ROYALTY
AFFILIATE COMMISSION
REVENUE SHARE
```

---

# 25. CM4

Recommended:

```text id="ue021"
CM3
-
ATTRIBUTABLE ACQUISITION / SERVICING COST
=
CM4
```

---

# 26. CM4 Purpose

Answers:

> After transaction-specific selling and servicing cost, how much value remains to pay fixed operating costs and profit?

---

# 27. Contribution Margin %

For any layer:

```text id="ue022"
CONTRIBUTION
/
NET SALES
```

---

# 28. Do Not Compare Different CM Definitions

Canonical:

> **CM3 at one dashboard cannot be called CM2 somewhere else.**

Definitions must remain consistent.

---

# 29. Commerce Unit Economics

Canonical structure:

```text id="ue023"
NET SALES

- PRODUCT COGS
= CM1

- PAYMENT / CHANNEL FEES
= CM2

- PACKAGING
- FULFILLMENT
- ROYALTY / AFFILIATE
- SHIPPING SUBSIDY
= CM3

- ATTRIBUTABLE ACQUISITION
= CM4
```

---

# 30. Selects Economics

May include:

```text id="ue024"
BASE GARMENT
PRINT
ROYALTY
PACKAGING
FULFILLMENT
CHANNEL COST
```

---

# 31. Essentials Economics

Usually simpler:

```text id="ue025"
PURCHASE / MANUFACTURING COST
+
PACKAGING
+
FULFILLMENT
+
CHANNEL COST
```

---

# 32. Originals Economics

Should include:

```text id="ue026"
PRODUCT COST
PACKAGING
FULFILLMENT
CHANNEL COST
ATTRIBUTABLE CAMPAIGN COST
```

Creative development may be treated separately or allocated depending analysis.

---

# 33. Originals Development Cost

Potentially classify as:

```text id="ue027"
COLLECTION DEVELOPMENT INVESTMENT
```

rather than forcing all cost into first unit sold.

But visibility must remain.

---

# 34. Creator Product Economics

Potential:

```text id="ue028"
NET SALES
-
PRODUCT COST
-
CREATOR ROYALTY
-
FULFILLMENT
-
CHANNEL COST
=
CONTRIBUTION
```

---

# 35. Royalty Base

Must define explicitly.

Possible:

```text id="ue029"
GROSS SALES
NET SALES
ELIGIBLE NET SALES
FIXED / UNIT
```

---

# 36. Royalty Is Not Percentage of Undefined Revenue

Canonical.

---

# 37. Affiliate Economics

Affiliate transaction adds:

```text id="ue030"
AFFILIATE COMMISSION
```

to variable acquisition cost.

---

# 38. Creator + Affiliate Stack

Potential:

```text id="ue031"
CREATOR ROYALTY
+
AFFILIATE COMMISSION
```

must be intentionally supported by margin.

---

# 39. Accidental Stacking

Should be prevented by system rules.

---

# 40. Marketplace Economics

Must include:

```text id="ue032"
MARKETPLACE COMMISSION
SERVICE FEE
PROMOTION FEE
SHIPPING SUBSIDY
PAYMENT FEE
```

where applicable.

---

# 41. Marketplace Revenue Can Mislead

Higher marketplace volume can produce worse contribution than own-store volume.

---

# 42. Own-Store Economics

May include:

```text id="ue033"
PAYMENT GATEWAY
HOSTING / PLATFORM VARIABLE COST
FULFILLMENT
ACQUISITION
```

---

# 43. Channel Comparison

Compare:

```text id="ue034"
NET SALES
CONTRIBUTION
CAC
RETURN RATE
REPEAT RATE
```

not revenue alone.

---

# 44. Shipping Economics

Critical distinction:

```text id="ue035"
CUSTOMER SHIPPING CHARGE
vs
ACTUAL SHIPPING COST
```

---

# 45. Shipping Margin

Potential:

```text id="ue036"
SHIPPING CHARGE
-
CARRIER COST
=
SHIPPING CONTRIBUTION / SUBSIDY
```

---

# 46. Free Shipping

Creates:

```text id="ue037"
SHIPPING SUBSIDY
```

which belongs in order economics.

---

# 47. Free Shipping Threshold

Should be based on basket contribution, not arbitrary competitor copying.

---

# 48. Packaging Cost

Should be recognized per order/product where material.

---

# 49. Packaging Complexity

Premium packaging may improve brand but reduces contribution.

Must be intentional.

---

# 50. Payment Fee

Percentage fee + fixed fee can create different economics for low-ticket orders.

---

# 51. Low-AOV Problem

A Rp50.000 order can suffer disproportionately from fixed transaction/fulfillment cost.

---

# 52. Average Order Value

AOV:

```text id="ue038"
NET ORDER SALES
/
ORDERS
```

---

# 53. AOV Is Not Margin

Higher AOV can still have low contribution if basket mix is poor.

---

# 54. Units per Order

Useful for understanding fulfillment leverage.

---

# 55. Contribution per Order

Canonical:

```text id="ue039"
ORDER CONTRIBUTION
```

is one of the most important operating measures.

---

# 56. Contribution per Item

Useful for assortment/product decisions.

---

# 57. Bundle Economics

Bundle should measure combined:

```text id="ue040"
PRICE
-
COMPONENT COST
-
DISCOUNT
-
FULFILLMENT EFFECT
```

---

# 58. Bundle Can Increase Contribution

If it:

- raises AOV,
- spreads shipping/transaction cost.

---

# 59. Bundle Can Destroy Contribution

If excessive discount exceeds operational leverage.

---

# 60. Service Unit Economics

For Custom/Business/Merch/Studio:

```text id="ue041"
SERVICE REVENUE
-
DIRECT MATERIAL
-
DIRECT PRODUCTION
-
PARTNER / FREELANCER
-
DIRECT LABOR
=
SERVICE CONTRIBUTION
```

---

# 61. Direct Labor

Should eventually include actual/standard labor cost for scalable analysis.

---

# 62. Founder Labor

Early:

track as:

```text id="ue042"
SHADOW LABOR COST
```

if unpaid.

---

# 63. Service Gross Margin Illusion

A service may appear highly profitable if founder labor is treated as zero.

---

# 64. Custom Economics

Potential:

```text id="ue043"
GARMENT
PRINT / EMBROIDERY
ARTWORK PREP
PACKAGING
FULFILLMENT
MANUAL HANDLING
```

---

# 65. Business Economics

Also include:

```text id="ue044"
ACCOUNT MANAGEMENT
SAMPLE
PROCUREMENT
MULTI-LOCATION DELIVERY
CREDIT COST
```

where material.

---

# 66. Merch Economics

Potential:

```text id="ue045"
PRODUCT COST
+
CREATOR SHARE
+
STORE / OPS COST
+
FULFILLMENT
+
SUPPORT
```

---

# 67. Studio Economics

Direct cost may be primarily:

```text id="ue046"
DESIGN LABOR
FREELANCER
REVISION TIME
```

---

# 68. Revision Cost

Unlimited revisions can destroy Studio economics.

Track where material.

---

# 69. Supply Economics

Potential:

```text id="ue047"
SELLING PRICE
-
PRODUCT LANDED COST
-
PICK / PACK
-
PAYMENT / ACCOUNT COST
=
CONTRIBUTION
```

---

# 70. Supply Margin

May be lower than retail but justified by:

- higher volume,
- lower acquisition cost,
- operational simplicity.

---

# 71. Fulfill Economics

Possible unit:

```text id="ue048"
ORDER FULFILLED
```

or:

```text id="ue049"
ITEM PICKED
```

depending pricing.

---

# 72. Fulfill Direct Cost

Potential:

```text id="ue050"
LABOR
PACKAGING
SPACE VARIABLE COST
SYSTEM VARIABLE COST
RETURN HANDLING
```

---

# 73. Fulfillment Pricing Must Cover Complexity

Simple 1-item order and complex kitting should not always be priced identically.

---

# 74. B2B Customer Economics

Recurring account should be viewed as:

```text id="ue051"
TOTAL CONTRIBUTION
-
ACCOUNT-SPECIFIC SERVICING COST
```

---

# 75. Customer Profitability

Canonical:

```text id="ue052"
CUSTOMER REVENUE
-
DIRECT COST
-
VARIABLE SERVICE COST
-
RETURNS
-
ACCOUNT-SPECIFIC SUPPORT / ACQUISITION
=
CUSTOMER CONTRIBUTION
```

---

# 76. Revenue Concentration vs Contribution Concentration

Largest customer by revenue may not be largest by profit.

---

# 77. High-Maintenance Customer

May have:

- low margin,
- many revisions,
- long credit,
- support burden.

Track full economics.

---

# 78. Payment Terms Cost

Credit terms have economic value.

A 60-day payer is economically different from prepaid customer.

---

# 79. Cost of Credit

Can include:

```text id="ue053"
CAPITAL DELAY
COLLECTION EFFORT
BAD DEBT RISK
```

---

# 80. Rush Economics

Rush orders may incur:

```text id="ue054"
OVERTIME
EXPRESS SHIPPING
CAPACITY DISRUPTION
PARTNER RUSH FEE
```

---

# 81. Rush Fee

Should cover incremental cost + scarcity where appropriate.

---

# 82. Complexity Premium

Non-standard work should pay for complexity.

Canonical:

> **Complexity should be priced, standardized, or rejected.**

---

# 83. MOQ Economics

Small production quantities may face high setup cost per unit.

---

# 84. Setup Cost Allocation

Conceptually:

```text id="ue055"
TOTAL SETUP COST
/
UNITS
```

---

# 85. Small Batch Pricing

Should reflect setup burden.

---

# 86. Volume Discount

Discount is justified only if volume creates actual economic advantage such as:

```text id="ue056"
LOWER UNIT INPUT COST
LOWER SETUP COST PER UNIT
LOWER SALES COST
LOWER FULFILLMENT COST
```

---

# 87. Discount Without Cost Advantage

Simply gives margin away.

---

# 88. Discount Ladder

Should be based on:

```text id="ue057"
CONTRIBUTION AFTER DISCOUNT
```

not revenue size alone.

---

# 89. Price Floor

Canonical:

> **Price Floor is the lowest price a transaction can accept under normal policy while preserving required economics.**

---

# 90. Price Floor Components

Potential:

```text id="ue058"
DIRECT COST
VARIABLE FEES
REQUIRED CONTRIBUTION
```

---

# 91. Margin Floor

Can be defined as:

```text id="ue059"
MINIMUM CONTRIBUTION AMOUNT
```

and/or:

```text id="ue060"
MINIMUM CONTRIBUTION %
```

---

# 92. Margin Floor Should Be Contextual

Different business lines can have different acceptable economics.

---

# 93. Strategic Margin Exception

Possible:

```text id="ue061"
LANDMARK CUSTOMER
MARKET ENTRY
TEST
INVENTORY CLEARANCE
```

but explicit approval required.

---

# 94. Never Hide Exception

Flag:

```text id="ue062"
BELOW FLOOR
```

in system.

---

# 95. Break-Even Price

Conceptually:

```text id="ue063"
VARIABLE COST
```

is zero-contribution break-even before fixed costs.

But this is not normal target price.

---

# 96. Full Business Break-Even

Requires enough aggregate contribution to cover fixed cost.

---

# 97. Break-Even Units

Conceptually:

```text id="ue064"
FIXED COST
/
CONTRIBUTION PER UNIT
```

for sufficiently stable product.

---

# 98. Break-Even Orders

Can use contribution per order.

---

# 99. Capacity Break-Even

For internal production equipment:

compare:

```text id="ue065"
FIXED OWNED COST
+
INTERNAL VARIABLE COST
```

against outsourced rate.

---

# 100. Returns Economics

Return should update original unit economics.

---

# 101. Refund

Reduces net revenue.

---

# 102. Restocked Return

May recover product value.

---

# 103. Scrapped Return

Creates full product loss.

---

# 104. Replacement

Adds new variable cost without new customer revenue.

---

# 105. Return-Adjusted Contribution

Conceptually:

```text id="ue066"
ORIGINAL CONTRIBUTION
-
RETURN / REPLACEMENT COST
+
RECOVERY
```

---

# 106. Expected Return Cost

At scale, products can use expected return cost based on history.

---

# 107. Expected Quality Cost

Similarly:

```text id="ue067"
EXPECTED DEFECT / REWORK COST
```

may inform standard economics.

---

# 108. Rework Economics

Rework is cost.

Never ignore because no cash invoice was issued.

---

# 109. Scrap Economics

Scrapped garment/material increases actual unit cost of good output.

---

# 110. Yield-Adjusted Cost

Conceptually:

```text id="ue068"
TOTAL INPUT COST
/
GOOD OUTPUT
```

---

# 111. Example

If 100 garments cost Rp5.000.000 and only 95 good units result:

economic cost per good unit is not Rp50.000.

---

# 112. Partner Failure Cost

May include:

```text id="ue069"
REWORK
DELAY
EXPRESS SHIPPING
CUSTOMER COMPENSATION
```

even if partner's quoted rate was cheapest.

---

# 113. Effective Partner Cost

Canonical:

```text id="ue070"
QUOTED COST
+
LOGISTICS
+
EXPECTED FAILURE COST
+
HANDLING
=
EFFECTIVE COST
```

---

# 114. Channel Fee Allocation

Order/item-level fees should be assigned consistently.

---

# 115. Fixed Per-Order Fee Allocation

Could allocate:

```text id="ue071"
EQUALLY
BY ITEM VALUE
BY QUANTITY
```

depending analysis.

Use one documented rule.

---

# 116. Shipping Cost Allocation

For multi-item orders, may remain order-level for operational economics.

No need fake precision at item level if not decision-useful.

---

# 117. Cost Allocation Principle

Canonical:

> **Allocate only as granularly as decision quality requires.**

---

# 118. Avoid Precision Theater

Do not allocate Rp317 of warehouse electricity to one tee unless it materially improves decisions.

---

# 119. Customer Acquisition Cost

Potential channel-level CAC:

```text id="ue072"
PAID ACQUISITION SPEND
/
NEW CUSTOMERS ACQUIRED
```

---

# 120. Blended CAC

Includes total acquisition spend across channels.

---

# 121. Paid CAC

Only paid media/acquisition.

Keep definitions distinct.

---

# 122. CAC vs Contribution

Critical:

```text id="ue073"
FIRST-ORDER CONTRIBUTION
-
CAC
```

reveals first-order payback.

---

# 123. First-Order Profitability

TeeStock may choose:

```text id="ue074"
PROFITABLE FIRST ORDER
```

or accept acquisition loss based on reliable repeat economics.

---

# 124. Do Not Assume Future LTV

Early-stage default should favor strong first-order economics unless evidence proves repeat behavior.

---

# 125. CAC Payback

Conceptually:

> How long/how many purchases until cumulative contribution recovers acquisition cost?

---

# 126. Affiliate CAC

Affiliate commission can be directly linked to attributed conversion.

---

# 127. Creator Audience Economics

Creator collaboration may combine:

```text id="ue075"
ROYALTY
+
LOWER ACQUISITION COST
```

Potentially attractive even with higher product payout.

---

# 128. Influencer Flat Fee

If TeeStock later uses fixed sponsorship:

allocate against attributed campaign contribution for performance analysis.

---

# 129. Organic Acquisition

Not zero cost.

It may require:

```text id="ue076"
CONTENT
TEAM
CREATIVE
```

but attribution is less direct.

---

# 130. Contribution after CAC

Strong primary scale metric for performance-driven channels.

---

# 131. Repeat Purchase Economics

Repeat customer may have:

```text id="ue077"
LOWER ACQUISITION COST
```

and higher cumulative contribution.

---

# 132. Retention Economics

Retention is valuable only when repeat purchases have healthy contribution.

---

# 133. Discount-Driven Repeat

Repeat purchases that require permanent heavy discount may not be high-quality retention.

---

# 134. LTV

Future canonical basis:

```text id="ue078"
CUMULATIVE CUSTOMER CONTRIBUTION
```

not cumulative revenue alone.

---

# 135. Historical LTV

Based on observed cohorts.

---

# 136. Forecast LTV

Uses assumptions.

Must be clearly labeled forecast.

---

# 137. Cohort Analysis

Compare customers acquired:

```text id="ue079"
BY MONTH
BY CHANNEL
BY CAMPAIGN
BY CREATOR
```

when sample size permits.

---

# 138. Cohort Contribution

Better than just cohort revenue.

---

# 139. Customer Payback Quality

An acquisition channel is stronger if customers:

```text id="ue080"
CONVERT
RETAIN
RETURN LESS
CONTRIBUTE MORE
```

---

# 140. Product Mix

Overall business economics depend on mix.

---

# 141. Mix Shift

Revenue may rise but blended margin fall if low-margin products gain share.

---

# 142. Channel Mix

Same issue with marketplace vs own-store.

---

# 143. Customer Mix

Large B2B volume may reduce margin % but increase absolute contribution.

Both views matter.

---

# 144. Absolute Contribution vs Margin %

Canonical:

```text id="ue081"
CONTRIBUTION Rp
and
CONTRIBUTION %
```

should be viewed together.

---

# 145. High Margin, Low Contribution

Small transaction.

---

# 146. Low Margin %, High Contribution

Large B2B job may still be strategically attractive.

---

# 147. Margin % Alone Is Not Decision

Need:

```text id="ue082"
CONTRIBUTION
CAPACITY
CASH
RISK
```

---

# 148. Contribution per Constraint

When capacity is constrained, measure:

```text id="ue083"
CONTRIBUTION
/
BOTTLENECK RESOURCE
```

---

# 149. Example

For printing capacity:

```text id="ue084"
CONTRIBUTION PER PRINT HOUR
```

may matter more than contribution per unit.

---

# 150. Contribution per Founder Hour

Early service business can use:

```text id="ue085"
CONTRIBUTION
/
FOUNDER HOURS
```

to expose non-scalable offers.

---

# 151. Contribution per Production Hour

Useful for make-vs-buy and scheduling.

---

# 152. Contribution per Square Meter

Could matter for warehouse/retail later.

Only use relevant constraints.

---

# 153. Cash Conversion Economics

Two equally profitable orders differ if one requires large upfront cash.

---

# 154. Capital-Adjusted View

Consider:

```text id="ue086"
CONTRIBUTION
relative to
CASH TIED UP
```

for inventory-heavy decisions.

---

# 155. Prepaid B2B

Can be economically attractive due to positive cash timing.

---

# 156. Long-Credit B2B

May need higher margin to compensate for working-capital/risk.

---

# 157. Inventory Risk Cost

Products requiring deep stock deserve higher expected returns than flexible MTO products, all else equal.

---

# 158. Dead Stock Allocation

Management can attribute markdown/write-off back to product/collection for lifecycle economics.

---

# 159. Collection Economics

Canonical:

```text id="ue087"
COLLECTION SALES
-
PRODUCT COST
-
DIRECT CAMPAIGN
-
RETURNS
-
DISCOUNT
-
DEAD STOCK / MARKDOWN IMPACT
```

---

# 160. Collection Sell-Through

Strong sales do not imply good economics if inventory remainder is large.

---

# 161. Label Economics

Evaluate:

```text id="ue088"
CONTRIBUTION
+
GROWTH QUALITY
+
INVENTORY EFFICIENCY
```

---

# 162. Experimental Product

Can intentionally have weaker economics while learning.

But experiment budget should be capped.

---

# 163. Learning Cost

Canonical:

```text id="ue089"
EXPERIMENT LOSS
```

should be intentionally labeled—not hidden as normal operations.

---

# 164. Unit Economics by Stage

Early test:

focus on:

```text id="ue090"
DIRECT COST
CONTRIBUTION
CASH
```

Scale stage:

add:

```text id="ue091"
CAC
RETURNS
SUPPORT
CAPACITY
```

---

# 165. Unit Economics by Business Model

One framework, different cost components.

Do not force retail logic onto Studio or Fulfillment.

---

# 166. Revenue Share

For Merch/partners:

must define:

```text id="ue092"
BASE
PERCENTAGE
ELIGIBILITY
ADJUSTMENTS
```

---

# 167. Net Revenue Share Trap

Term “net revenue” must have exact definition.

---

# 168. Fixed Fee + Revenue Share

Some Merch deals may use:

```text id="ue093"
SERVICE FEE
+
REVENUE SHARE
```

Economics must model both.

---

# 169. Minimum Guarantee

If ever offered to creator/partner:

it creates fixed commitment risk.

Use only intentionally.

---

# 170. Affiliate Coupon Economics

If affiliate provides discount and earns commission:

```text id="ue094"
DISCOUNT
+
COMMISSION
```

both reduce contribution.

---

# 171. Promotion Stacking

Potential:

```text id="ue095"
SALE PRICE
+
COUPON
+
AFFILIATE
+
FREE SHIPPING
```

can destroy economics quickly.

---

# 172. Promotion Stack Guardrail

MGBOS should calculate expected contribution before allowing stack where possible.

---

# 173. Minimum Order Value

Can protect low-AOV fulfillment economics.

---

# 174. Shipping Threshold

Can encourage basket growth.

Must be tested against contribution.

---

# 175. Wholesale / Reseller Price

Price should reflect:

```text id="ue096"
LOWER SELLING COST
+
LARGER VOLUME
+
LOWER SERVICE COMPLEXITY
```

where true.

---

# 176. Wholesale Price Is Not Arbitrary Discount

Canonical.

---

# 177. Price Book Economics

Every Price Book should map to expected contribution logic.

---

# 178. Customer-Specific Pricing

B2B account pricing should preserve:

```text id="ue097"
ACCOUNT-LEVEL ECONOMICS
```

---

# 179. Special Quote Economics

Quote should calculate expected contribution before approval.

---

# 180. Quote Inputs

Potential:

```text id="ue098"
SELLING PRICE
QTY
PRODUCT COST
PRODUCTION
DESIGN
PACKAGING
SHIPPING
PARTNER
SALES / PROJECT COST
```

---

# 181. Quote Contribution

Canonical:

```text id="ue099"
EXPECTED NET SALES
-
EXPECTED VARIABLE COST
=
EXPECTED CONTRIBUTION
```

---

# 182. Quote vs Actual

After project:

```text id="ue100"
EXPECTED CONTRIBUTION
vs
ACTUAL CONTRIBUTION
```

---

# 183. Quote Variance

Can reveal:

- underquoting,
- operational waste,
- scope creep.

---

# 184. Scope Creep Economics

Additional work without commercial change creates hidden margin loss.

---

# 185. Change Request Economics

Should update expected revenue and cost.

---

# 186. Cancellation Economics

Cancelled custom order may still incur:

```text id="ue101"
DESIGN
MATERIAL
PRODUCTION
PARTNER
```

cost.

---

# 187. Cancellation Fee

If commercially/legal appropriate, should reflect irreversible cost.

Exact policy belongs elsewhere.

---

# 188. Service Capacity Economics

If Studio is fully booked, accepting low-contribution work has opportunity cost.

---

# 189. Opportunity Cost

Not always recorded accounting cost, but important decision input.

---

# 190. Bottleneck Pricing

Scarce capability may justify higher price.

---

# 191. Peak Pricing

Rush/peak fees can protect contribution and capacity.

---

# 192. Unit Economics Dashboard

Potential:

```text id="ue102"
NET SALES
CM1
CM2
CM3
CM4
AOV
CAC
REFUND RATE
CONTRIBUTION / ORDER
```

---

# 193. Product Economics View

Potential:

```text id="ue103"
PRODUCT
PRICE
DIRECT COST
ROYALTY
FULFILLMENT
CONTRIBUTION
RETURN RATE
```

---

# 194. Channel Economics View

Potential:

```text id="ue104"
CHANNEL
NET SALES
FEES
CAC
RETURNS
CONTRIBUTION
```

---

# 195. Service Economics View

Potential:

```text id="ue105"
PROJECT
REVENUE
DIRECT COST
HOURS
PARTNER COST
CONTRIBUTION
```

---

# 196. Customer Economics View

Potential:

```text id="ue106"
REVENUE
CONTRIBUTION
ORDERS
SUPPORT
RETURNS
AR DAYS
```

---

# 197. Data Lineage

Canonical Commerce:

```text id="ue107"
ORDER
↓
ORDER ITEM
↓
PRICE / DISCOUNT
↓
COGS
↓
CHANNEL FEE
↓
FULFILLMENT
↓
PROGRAM PAYOUT
↓
RETURN / REFUND
↓
CONTRIBUTION
```

---

# 198. Service Data Lineage

```text id="ue108"
QUOTE
↓
PROJECT / ORDER
↓
DIRECT MATERIAL
↓
WORK ORDERS
↓
LABOR / PARTNER
↓
FULFILLMENT
↓
ACTUAL CONTRIBUTION
```

---

# 199. MGBOS Unit Economics Entity Model

Core concepts:

```text id="ue109"
COST COMPONENT
REVENUE COMPONENT
CONTRIBUTION SNAPSHOT
PRICE RULE
MARGIN RULE
ALLOCATION RULE
```

---

# 200. Cost Component

Represents one cost source:

```text id="ue110"
GARMENT
PRINT
PAYMENT FEE
ROYALTY
PACKAGING
```

---

# 201. Cost Component Type

Potential:

```text id="ue111"
FIXED / ORDER
VARIABLE / UNIT
PERCENTAGE
TIERED
ACTUAL
```

---

# 202. Contribution Snapshot

Stores calculated economics at point in time.

Useful because costs/rates may change later.

---

# 203. Expected Snapshot

At:

```text id="ue112"
QUOTE
ORDER
LAUNCH
```

---

# 204. Actual Snapshot

After:

```text id="ue113"
FULFILLMENT
RETURN WINDOW
PROJECT CLOSE
```

as appropriate.

---

# 205. Margin Rule

Can define:

```text id="ue114"
MIN CM3 %
MIN CONTRIBUTION Rp
```

by business line.

---

# 206. Margin Check

Potential:

```text id="ue115"
PASS
WARNING
REQUIRES_APPROVAL
BLOCK
```

---

# 207. Unit Economics Events

Potential:

```text id="ue116"
order.economics_estimated
order.margin_below_floor
order.cost_updated
order.economics_finalized
```

---

# 208. Dynamic Economics

Costs may update throughout lifecycle.

Example:

```text id="ue117"
EXPECTED SHIPPING
→
ACTUAL SHIPPING
```

---

# 209. Actualization

Canonical:

> **Replace estimates with actuals as reality becomes known.**

---

# 210. Don't Rewrite History

Preserve original expected economics alongside actual.

This enables learning.

---

# 211. Margin Variance Analysis

Potential categories:

```text id="ue118"
PRICE
DISCOUNT
MATERIAL
PRODUCTION
FULFILLMENT
RETURN
ACQUISITION
```

---

# 212. Pricing Feedback Loop

Canonical:

```text id="ue119"
EXPECTED ECONOMICS
↓
ACTUAL ECONOMICS
↓
VARIANCE
↓
PRICING / PROCESS UPDATE
```

---

# 213. Product Feedback Loop

```text id="ue120"
LOW CONTRIBUTION
↓
COST / PRICE / PRODUCT REVIEW
```

---

# 214. Channel Feedback Loop

```text id="ue121"
CHANNEL REVENUE HIGH
+
CONTRIBUTION LOW
→
CHANNEL STRATEGY REVIEW
```

---

# 215. Customer Feedback Loop

Low-margin/high-complexity accounts may need:

```text id="ue122"
REPRICE
STANDARDIZE
REDUCE SERVICE
EXIT
```

---

# 216. Unit Economics and Experimentation

Each experiment should define economic success metric.

---

# 217. Discount Experiment

Measure:

```text id="ue123"
CONVERSION LIFT
vs
CONTRIBUTION LOSS
```

---

# 218. Free Shipping Experiment

Measure:

```text id="ue124"
AOV LIFT
vs
SHIPPING SUBSIDY
```

---

# 219. Creator Experiment

Measure:

```text id="ue125"
ROYALTY COST
vs
INCREMENTAL DEMAND
```

---

# 220. Affiliate Experiment

Measure:

```text id="ue126"
COMMISSION
vs
INCREMENTAL CONTRIBUTION
```

---

# 221. Marketplace Experiment

Measure:

```text id="ue127"
INCREMENTAL ORDERS
vs
CHANNEL MARGIN LOSS
```

---

# 222. AI Role

AI may assist with:

```text id="ue128"
Cost Variance Explanation
Margin Anomaly Detection
Scenario Comparison
Customer Profitability Summary
Pricing Recommendation Support
```

---

# 223. AI Pricing Boundary

AI may recommend price.

It should not override approved price floors autonomously.

---

# 224. AI Cost Classification

Can suggest cost categories.

Financial rules remain deterministic.

---

# 225. AI Anomaly Detection

Potential:

```text id="ue129"
Order margin unusually low.

Packaging cost doubled.

Affiliate stack created negative CM3.
```

---

# 226. AI Scenario Analysis

Potential:

> If retail price increases 5% and conversion falls 2%, what happens to contribution?

Useful decision support.

---

# 227. Unit Economics Maturity

```text id="ue130"
LEVEL 0
Price minus product cost

LEVEL 1
Gross margin

LEVEL 2
Full variable contribution

LEVEL 3
Channel / customer / acquisition economics

LEVEL 4
Real-time pre-transaction margin control

LEVEL 5
AI-assisted optimization within guardrails
```

---

# 228. Level 0

Anti-goal:

```text id="ue131"
SELLING PRICE
-
GARMENT COST
=
"PROFIT"
```

---

# 229. Level 1

Adds all direct product/service delivery costs.

---

# 230. Level 2

Adds:

```text id="ue132"
PAYMENT
CHANNEL
FULFILLMENT
ROYALTY
COMMISSION
SHIPPING SUBSIDY
```

---

# 231. Level 3

Adds:

```text id="ue133"
CAC
RETURN COST
SUPPORT
CUSTOMER ECONOMICS
```

---

# 232. Level 4

System evaluates economics before:

```text id="ue134"
QUOTE
DISCOUNT
PROMOTION
ORDER APPROVAL
```

---

# 233. Level 5

AI/rules recommend:

```text id="ue135"
PRICE
CHANNEL
OFFER
DISCOUNT
```

while protecting minimum economics.

---

# 234. Current Recommended Stage

TeeStock should target:

```text id="ue136"
LEVEL 1
→
LEVEL 2
```

first.

---

# 235. V1 Required Cost Components

Commerce:

```text id="ue137"
SELLING PRICE
PRODUCT COST
PRODUCTION
PAYMENT FEE
PACKAGING
FULFILLMENT
ROYALTY / COMMISSION
SHIPPING SUBSIDY
```

---

# 236. V1 Service Cost Components

```text id="ue138"
REVENUE
MATERIAL
PRODUCTION
PARTNER
DIRECT LABOR / ESTIMATED EFFORT
SHIPPING
```

---

# 237. V1 Contribution

Calculate at least:

```text id="ue139"
CM1
and
CM3
```

if data allows.

---

# 238. V1 Margin Floor

Establish business-line-specific minimums after real cost data begins accumulating.

Do not invent arbitrary numbers without evidence.

---

# 239. V1 Avoid

Do not immediately build:

```text id="ue140"
perfect LTV
customer-level activity-based costing
microsecond real-time margin system
complex overhead allocation
```

---

# 240. V2 Expansion

Possible:

```text id="ue141"
CM1–CM4
CAC
RETURN-ADJUSTED CONTRIBUTION
CHANNEL ECONOMICS
CUSTOMER PROFITABILITY
```

---

# 241. V3 Expansion

Possible:

```text id="ue142"
COHORT CONTRIBUTION
LTV
CAPITAL-ADJUSTED RETURNS
BOTTLENECK CONTRIBUTION
```

---

# 242. V4 Expansion

Possible:

```text id="ue143"
DYNAMIC PRICE RECOMMENDATION
REAL-TIME MARGIN GUARDRAILS
AI SCENARIO ENGINE
```

---

# 243. Product Launch Gate

Before scaling:

```text id="ue144"
EXPECTED CONTRIBUTION KNOWN
+
DIRECT COST VERIFIED
+
RETURN / QUALITY RISK UNDERSTOOD
```

---

# 244. Promotion Gate

Before campaign:

```text id="ue145"
DISCOUNT
+
COMMISSION
+
SHIPPING
+
CHANNEL COST
```

must be modeled together.

---

# 245. Quote Approval Gate

B2B/custom quote should know expected contribution before customer acceptance.

---

# 246. Low-Margin Gate

If below normal floor:

```text id="ue146"
EXPLICIT APPROVAL
+
STRATEGIC REASON
```

required.

---

# 247. Creator Deal Gate

Before agreeing creator economics:

```text id="ue147"
ROYALTY / SHARE
+
PRODUCT ECONOMICS
+
ACQUISITION VALUE
```

must be modeled.

---

# 248. Affiliate Campaign Gate

Commission should fit:

```text id="ue148"
PRODUCT MARGIN
+
CUSTOMER VALUE
+
INCREMENTALITY
```

---

# 249. Free Shipping Gate

Threshold should preserve acceptable contribution at expected basket mix.

---

# 250. Volume Discount Gate

Only grant when:

```text id="ue149"
TOTAL CONTRIBUTION
+
OPERATIONAL EFFICIENCY
```

remain healthy.

---

# 251. Customer Credit Gate

Long payment terms should be evaluated alongside contribution and risk.

---

# 252. Internalization Gate

Production investment should compare:

```text id="ue150"
CONTRIBUTION IMPROVEMENT
+
CAPACITY
+
CAPITAL REQUIRED
```

---

# 253. Unit Economics Failure Modes

## Price Minus Material = Profit

Incomplete economics.

## Revenue-Based Channel Decisions

Ignores fees and acquisition.

## Free Shipping Not Counted

Margin distortion.

## Royalty Hidden Outside Product Economics

False contribution.

## Affiliate Commission Hidden in Marketing

Transaction economics distorted.

## Founder Labor = Zero

Service economics overstated.

## Returns Ignored

Bad products appear profitable.

## Actual Cost Never Reconciled

Pricing never improves.

---

# 254. What Unit Economics Must Not Become

## Spreadsheet Numerology

Every number needs source and definition.

## Margin Theater

Do not choose flattering cost layers.

## Overhead Allocation Obsession

Focus first on controllable variable economics.

## Revenue Optimization Engine

Contribution matters.

## AI Price Roulette

Pricing must obey strategy and guardrails.

---

# 255. Unit Economics Success Definition

The system succeeds when TeeStock can answer:

```text id="ue151"
FOR THIS ORDER:

How much did customer pay?

How much discount did we give?

What did the product cost?

What did production cost?

What did the channel cost?

What did payment processing cost?

What did fulfillment cost?

What did shipping subsidy cost?

What did creator / affiliate receive?

Did it return or require replacement?

What contribution remained?

Was it above our required floor?
```

---

# 256. Canonical Unit Economics Summary

```text id="ue152"
PRICE
creates revenue.

DIRECT COST
creates CM1.

CHANNEL COST
creates CM2.

FULFILLMENT + PROGRAM COST
creates CM3.

ACQUISITION / SERVICING
creates CM4.

RETURNS
correct reality.

ACTUAL COST
tests assumptions.

MGBOS
turns economics into operational guardrails.
```

---

# 257. Canonical Unit Economics Principles

```text id="ue153"
EVERY TRANSACTION SHOULD KNOW ITS ECONOMICS.

PRICE IS NOT MARGIN.

REVENUE IS NOT CONTRIBUTION.

DISCOUNT IS A COST TO SELLING VALUE.

FREE SHIPPING IS NOT FREE.

ROYALTY BELONGS IN TRANSACTION ECONOMICS.

AFFILIATE COMMISSION BELONGS IN ACQUISITION ECONOMICS.

REWORK IS COST.

RETURNS CHANGE PRODUCT ECONOMICS.

FOUNDER LABOR IS NOT ECONOMICALLY FREE.

EXPECTED BEFORE COMMITMENT.

ACTUAL AFTER EXECUTION.

COMPARE LIKE-FOR-LIKE CONTRIBUTION DEFINITIONS.

MARGIN FLOOR BEFORE SCALE.

CAPITAL AND CAPACITY MATTER ALONGSIDE MARGIN.
```

---

# 258. Dependency

Dokumen berikut harus follow Unit Economics:

1. [[bisnis/teestock/08-finance/pricing-framework|pricing-framework.md]]
2. [[bisnis/teestock/08-finance/cost-accounting|cost-accounting.md]]
3. [[bisnis/teestock/08-finance/treasury-policy|treasury-policy.md]]
4. [[bisnis/teestock/09-marketing/go-to-market|go-to-market.md]]
5. [[bisnis/teestock/09-marketing/channel-strategy|channel-strategy.md]]
6. [[bisnis/teestock/09-marketing/retention-and-community|retention-and-community.md]]
7. [[bisnis/teestock/10-product-tech/commerce-platform|commerce-platform.md]]
8. [[bisnis/teestock/10-product-tech/automation-architecture|automation-architecture.md]]
9. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
10. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
11. [[bisnis/teestock/11-data-mgbos/mgbos-integration|mgbos-integration.md]]
12. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]
13. [[bisnis/teestock/13-metrics-experiments/decision-thresholds|decision-thresholds.md]]

TeeStock Unit Economics boleh berkembang menjadi real-time margin engine dan AI-assisted commercial optimization layer, tetapi advanced optimization hanya boleh dibangun setelah direct cost, transaction fees, fulfillment, payouts, returns, acquisition, dan actual-vs-expected economics benar-benar reliable.