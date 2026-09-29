---
title: "TeeStock Pricing Framework"
date: "2026-09-28"
bisnis: teestock
kategori: keuangan
status: active
tags:
  - bisnis/teestock
  - kategori/keuangan
  - teestock/canonical
  - teestock/finance
document_id: "TS-FIN-003"
version: "1.0"
category: "finance"
business: "teestock"
last_updated: "2026-09-28"
path: "08-finance/pricing-framework.md"
depends_on:
  - "TS-FIN-001"
  - "TS-FIN-002"
  - "TS-STR-002"
  - "TS-BRD-001"
  - "TS-COM-001"
  - "TS-COM-005"
  - "TS-SVC-001"
  - "TS-PRG-003"
  - "TS-PRG-005"
---


# TeeStock Pricing Framework v1.0

> [!important] **Canonical TeeStock Pricing, Quoting & Commercial Guardrail Framework  **
> Dokumen ini mendefinisikan pricing architecture, price books, retail pricing, wholesale/reseller pricing, B2B account pricing, service quotation, value-based pricing, cost-based pricing, markup vs margin, price floors, discount authority, promotional pricing, volume tiers, rush fees, customization premiums, channel pricing, price testing, dan pricing automation melalui MGBOS.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/08-finance/financial-model|TS-FIN-001: TeeStock Financial Model]] • [[bisnis/teestock/08-finance/unit-economics|TS-FIN-002: TeeStock Unit Economics]] • [[bisnis/teestock/01-strategy/business-model|TS-STR-002: TeeStock Business Model]] • [[bisnis/teestock/02-brand/master-brand-strategy|TS-BRD-001: TeeStock Master Brand Strategy]] • [[bisnis/teestock/03-commerce/commerce-overview|TS-COM-001: TeeStock Commerce Overview]] • [[bisnis/teestock/03-commerce/product-taxonomy|TS-COM-005: TeeStock Product Taxonomy]] • [[bisnis/teestock/04-services/services-overview|TS-SVC-001: TeeStock Services Overview]] • [[bisnis/teestock/06-programs/reseller-program|TS-PRG-003: TeeStock Reseller Program]] • [[bisnis/teestock/06-programs/affiliate-program|TS-PRG-005: TeeStock Affiliate Program]]


---

# 1. Purpose

Pricing Framework menjawab:

> **Berapa harga yang harus TeeStock kenakan untuk produk atau layanan tertentu, kepada customer tertentu, melalui channel tertentu, dengan tetap menjaga positioning, contribution, cash, dan fairness?**

Canonical principle:

> **Price for value. Guard for economics.**

---

# 2. Canonical Definition

> **TeeStock Pricing Framework adalah system of commercial rules yang mengubah product value, service complexity, direct cost, channel economics, customer segment, volume, urgency, risk, dan strategic positioning menjadi prices, discounts, fees, dan approval boundaries yang konsisten serta auditable.**

---

# 3. Pricing Is Strategic

Pricing menentukan:

```text id="prc001"
POSITIONING
DEMAND
MARGIN
CUSTOMER MIX
CASH
CAPACITY UTILIZATION
```

---

# 4. Pricing Is Not Only Cost-Plus

Canonical:

```text id="prc002"
COST
sets the economic boundary.

VALUE
influences willingness to pay.

POSITIONING
sets brand context.

MARKET
provides reference.

CAPACITY
creates scarcity.

STRATEGY
determines final commercial choice.
```

---

# 5. Core Pricing Objectives

TeeStock pricing should balance:

```text id="prc003"
CUSTOMER VALUE
+
HEALTHY CONTRIBUTION
+
MARKET FIT
+
BRAND POSITIONING
+
OPERATIONAL SIMPLICITY
```

---

# 6. Price Architecture

Canonical:

```text id="prc004"
BASE PRICE
+
OPTION / CONFIGURATION
+
SERVICE COMPLEXITY
+
URGENCY
+
CHANNEL / ACCOUNT RULE
-
APPROVED DISCOUNT
=
FINAL SELLING PRICE
```

---

# 7. Price vs Cost

Critical:

```text id="prc005"
PRICE
what customer pays.

COST
what TeeStock incurs.
```

Price should not automatically move one-for-one with cost.

---

# 8. Price vs Value

Two products with equal cost may reasonably have different prices because perceived/customer value differs.

---

# 9. Markup vs Margin

Critical distinction.

Markup:

```text id="prc006"
(PRICE - COST)
/
COST
```

Margin:

```text id="prc007"
(PRICE - COST)
/
PRICE
```

---

# 10. Example

If cost = 60 and price = 100:

```text id="prc008"
MARKUP
66.7%

MARGIN
40%
```

Do not confuse them.

---

# 11. TeeStock Default Financial Language

Prefer:

```text id="prc009"
CONTRIBUTION
and
MARGIN %
```

for commercial control.

---

# 12. Cost-Based Pricing

Useful when:

```text id="prc010"
COSTS ARE KNOWN
MARKET IS COMMODITIZED
SERVICE IS STANDARDIZED
```

---

# 13. Cost-Plus

Conceptually:

```text id="prc011"
COST
+
REQUIRED RETURN
=
PRICE
```

---

# 14. Cost-Plus Limitation

It ignores:

- willingness to pay,
- competitive value,
- brand positioning.

---

# 15. Value-Based Pricing

Sets price based on:

```text id="prc012"
CUSTOMER VALUE
OUTCOME
DIFFERENTIATION
ALTERNATIVES
```

while respecting margin floor.

---

# 16. Value-Based Pricing Is Not Random Premium

Need evidence.

---

# 17. Market-Referenced Pricing

Competitor prices are useful reference.

Not pricing authority.

---

# 18. Competitor Price Trap

Canonical:

> **Never copy competitor pricing without understanding their product, channel, cost structure, and business objective.**

---

# 19. Price Positioning

Possible positioning:

```text id="prc013"
ENTRY
ACCESSIBLE
MID-MARKET
PREMIUM
```

TeeStock should not shift randomly between them.

---

# 20. TeeStock Brand Pricing Intent

Pricing should reinforce:

```text id="prc014"
ACCESSIBLE
+
TASTEFUL
+
RELIABLE
```

rather than compete purely on cheapest price.

---

# 21. Price Book

Canonical:

> **Price Book adalah controlled set of commercial prices applicable to a customer, channel, or business model.**

---

# 22. Potential Price Books

```text id="prc015"
RETAIL
MARKETPLACE
RESELLER
SUPPLY
BUSINESS ACCOUNT
CUSTOM PROJECT
```

---

# 23. One Product, Multiple Price Books

Same SKU may legitimately have different prices by:

- customer type,
- volume,
- channel,
- service level.

---

# 24. Price Book ≠ Product Duplication

Product master remains one canonical product.

---

# 25. Price Book Fields

Potential:

```text id="prc016"
Price Book ID
Currency
Customer / Segment
Channel
Product / Service
Price
Minimum Qty
Effective Date
Expiry Date
```

---

# 26. Price Versioning

Price changes should preserve:

```text id="prc017"
OLD PRICE
NEW PRICE
EFFECTIVE DATE
```

---

# 27. Price Snapshot

Order should snapshot accepted price.

Future price changes must not rewrite historical order economics.

---

# 28. Retail Pricing

Retail should consider:

```text id="prc018"
PRODUCT VALUE
PRODUCT COST
BRAND POSITION
CHANNEL
EXPECTED PROMOTION
FULFILLMENT
```

---

# 29. Recommended Retail Price

Potential:

```text id="prc019"
RRP / MSRP
```

may exist for channel consistency.

---

# 30. Street Price

Actual selling price may differ because:

- promotion,
- channel,
- campaign.

---

# 31. Everyday Price vs Promotional Price

Canonical distinction:

```text id="prc020"
BASE PRICE
vs
TEMPORARY PROMOTIONAL PRICE
```

---

# 32. Permanent Discount Is New Price

If product is almost always discounted:

the nominal list price is not meaningful.

---

# 33. Selects Pricing

Should account for:

```text id="prc021"
BASE GARMENT
DECORATION
ROYALTY
DESIGN VALUE
CURATION
```

---

# 34. Essentials Pricing

Should reflect:

```text id="prc022"
QUALITY
FIT
MATERIAL
RELIABILITY
```

not only blank garment commodity price.

---

# 35. Originals Pricing

May support stronger premium where:

```text id="prc023"
BRAND
STORY
DESIGN
SCARCITY
PRODUCT DEVELOPMENT
```

create value.

---

# 36. Originals Premium Must Be Earned

Brand ownership alone does not justify arbitrary premium.

---

# 37. Collection Pricing

A collection should have coherent internal price architecture.

---

# 38. Hero Product Pricing

Can anchor customer perception of collection.

---

# 39. Good-Better-Best

Some assortments may use:

```text id="prc024"
GOOD
BETTER
BEST
```

tiers.

Only if product differences are genuine.

---

# 40. Product Tiering

Price tiers may be based on:

```text id="prc025"
GARMENT
CONSTRUCTION
DECORATION
DESIGN
FINISH
```

---

# 41. Service Pricing

Services should price:

```text id="prc026"
OUTPUT
+
COMPLEXITY
+
TIME
+
RISK
+
VALUE
```

---

# 42. Hourly Pricing

Useful internally.

Not always best customer-facing price.

---

# 43. Project Pricing

Customer receives agreed scope for agreed fee.

Often better for Studio/Business.

---

# 44. Unit Pricing

Suitable for:

```text id="prc027"
CUSTOM APPAREL
BUSINESS APPAREL
SUPPLY
```

where quantity drives economics.

---

# 45. Hybrid Service Pricing

Potential:

```text id="prc028"
SETUP FEE
+
UNIT PRICE
```

---

# 46. Setup Fee

Used when work includes fixed preparation cost such as:

```text id="prc029"
ARTWORK PREP
SCREEN SETUP
EMBROIDERY DIGITIZATION
PROJECT SETUP
```

---

# 47. Setup Cost Should Not Be Hidden

Especially for small orders.

---

# 48. Custom Pricing Architecture

Potential:

```text id="prc030"
GARMENT
+
DECORATION
+
SETUP
+
CUSTOMIZATION
+
PACKAGING
+
SHIPPING
```

---

# 49. Business Pricing

May additionally include:

```text id="prc031"
PROJECT MANAGEMENT
SAMPLING
MULTI-LOCATION
ACCOUNT TERMS
```

---

# 50. Studio Pricing

Can use:

```text id="prc032"
FIXED PACKAGE
PROJECT
DAY / HOUR
RETAINER
```

depending service maturity.

---

# 51. Studio Revision Policy

Pricing must define included revisions.

---

# 52. Revision Beyond Scope

Should trigger:

```text id="prc033"
CHANGE REQUEST
+
ADDITIONAL FEE
```

---

# 53. Merch Pricing

TeeStock may monetize via:

```text id="prc034"
PRODUCT MARGIN
SERVICE FEE
REVENUE SHARE
MANAGEMENT FEE
```

depending deal.

---

# 54. Supply Pricing

Usually:

```text id="prc035"
LOWER MARGIN %
+
HIGHER VOLUME
```

than consumer retail.

---

# 55. Supply Price Book

May define quantity tiers.

---

# 56. Fulfill Pricing

Potential components:

```text id="prc036"
INBOUND FEE
STORAGE
PICK
PACK
PACKAGING
RETURN
SPECIAL HANDLING
```

---

# 57. Fulfillment Complexity Pricing

Complex handling should not use standard simple-order rate.

---

# 58. Volume Pricing

Canonical:

> **Volume discount should reflect real economic efficiencies created by volume.**

---

# 59. Volume Tier

Potential:

```text id="prc037"
1–9
10–49
50–99
100+
```

Actual tiers depend on observed economics.

---

# 60. Do Not Invent Tiers for Appearance

Only create tier where price/cost/operations change meaningfully.

---

# 61. Volume Discount Sources

Possible efficiency:

```text id="prc038"
LOWER INPUT PRICE
SETUP LEVERAGE
LOWER SALES COST
LOWER HANDLING COST
```

---

# 62. Volume Discount Floor

Each tier must remain above approved contribution floor.

---

# 63. MOQ

Minimum order may protect:

```text id="prc039"
SETUP COST
ADMIN
PRODUCTION
FULFILLMENT
```

---

# 64. Low-Quantity Surcharge

Alternative to high MOQ:

```text id="prc040"
SMALL ORDER FEE
```

---

# 65. Customization Premium

Personalization creates:

```text id="prc041"
MORE DATA
MORE ERROR RISK
MORE HANDLING
LOWER RESALE VALUE
```

and may justify fee.

---

# 66. Per-Name / Per-Number Fee

Useful when production cost scales per personalized unit.

---

# 67. Complexity Fee

Can cover unusual:

- sorting,
- packaging,
- labeling,
- data handling.

---

# 68. Rush Fee

Canonical:

> **Rush pricing compensates TeeStock for capacity disruption, additional cost, and scarcity.**

---

# 69. Rush Fee Inputs

Potential:

```text id="prc042"
TIME COMPRESSION
OVERTIME
EXPRESS SUPPLY
SCHEDULE DISRUPTION
RISK
```

---

# 70. Rush Is Not Guaranteed

A fee cannot create nonexistent capacity.

---

# 71. Rush Approval

Only offer when execution is feasible.

---

# 72. Peak Pricing

May be appropriate during constrained seasonal capacity.

Use cautiously and transparently.

---

# 73. Geographic Pricing

Possible future difference due to:

- logistics,
- taxes,
- currencies.

Not early priority.

---

# 74. Channel Pricing

Different channel prices can be legitimate due to:

```text id="prc043"
CHANNEL FEES
PROMOTIONS
CUSTOMER EXPECTATION
SERVICE LEVEL
```

---

# 75. Price Consistency

Different prices should still feel commercially coherent.

---

# 76. Marketplace Pricing

May require higher list price to absorb:

```text id="prc044"
PLATFORM FEE
PROMOTION
COMMISSION
```

if market supports it.

---

# 77. Own-Store Pricing

Can preserve higher contribution or better customer value.

---

# 78. Channel Price Parity

If TeeStock adopts parity policy:

must define what counts as equivalent offer.

---

# 79. Equivalent Offer

Same:

```text id="prc045"
PRODUCT
SERVICE
SHIPPING
PROMOTION
```

context.

---

# 80. Reseller Pricing

Reseller price should leave enough economic room for:

```text id="prc046"
TEEStock CONTRIBUTION
+
RESELLER MARGIN
```

---

# 81. Reseller Discount Is Not Consumer Coupon

It represents distribution economics.

---

# 82. Reseller Tier

May depend on:

```text id="prc047"
VOLUME
PAYMENT RELIABILITY
ORDER FREQUENCY
COMMITMENT
```

---

# 83. Reseller Price Book

Should be controlled and not publicly leak unintentionally.

---

# 84. Supply vs Reseller Pricing

Critical:

```text id="prc048"
SUPPLY
B2B product procurement.

RESELLER
distribution relationship.
```

Prices may differ.

---

# 85. B2B Account Pricing

Recurring customers may receive account-specific pricing.

---

# 86. Account Price

Should consider:

```text id="prc049"
VOLUME
ORDER FREQUENCY
SERVICE COMPLEXITY
PAYMENT TERMS
CREDIT RISK
```

---

# 87. Contract Pricing

Potential:

```text id="prc050"
FIXED PRICE
for defined period.
```

Need cost-change protection where relevant.

---

# 88. Price Validity

Quotes should specify validity period.

---

# 89. Quote Expiry

Protects against:

- material price changes,
- capacity changes.

---

# 90. Quote Architecture

Canonical:

```text id="prc051"
REQUIREMENT
↓
COST ESTIMATE
↓
PRICE RULE
↓
MARGIN CHECK
↓
QUOTE
↓
APPROVAL
```

---

# 91. Quote Components

Potential:

```text id="prc052"
PRODUCT
DECORATION
DESIGN
SETUP
PACKAGING
SHIPPING
TAX
OTHER FEE
```

---

# 92. Bundled Quote

Customer-facing quote may simplify components.

Internal economics should retain detail.

---

# 93. Quote Version

Material scope/price change creates new version.

---

# 94. Quote Price Lock

Once accepted:

price should not change unless:

```text id="prc053"
SCOPE CHANGES
or
VALID COMMERCIAL CONDITION
```

---

# 95. Change Request Pricing

New scope should receive new commercial impact.

---

# 96. Discount

Canonical:

> **Discount is a deliberate reduction from normal commercial price in exchange for a defined strategic or transactional benefit.**

---

# 97. Discount Reasons

Potential:

```text id="prc054"
VOLUME
PROMOTION
CUSTOMER RECOVERY
ACCOUNT AGREEMENT
CLEARANCE
STRATEGIC EXCEPTION
```

---

# 98. No Reason, No Discount

Canonical.

---

# 99. Discount Authority

Potential levels:

```text id="prc055"
SYSTEM
STANDARD APPROVED RULE

COMMERCIAL OWNER
SMALL DISCOUNT

MANAGER
HIGHER DISCOUNT

FOUNDER / LEADERSHIP
EXCEPTION
```

Exact thresholds belong in Decision Thresholds.

---

# 100. Discount Floor

Discount must not silently cross margin floor.

---

# 101. Manual Discount

Requires:

```text id="prc056"
REASON
APPROVER
AMOUNT
```

---

# 102. Discount Stacking

Canonical control should evaluate:

```text id="prc057"
BASE PROMO
+
COUPON
+
AFFILIATE
+
FREE SHIPPING
+
ACCOUNT DISCOUNT
```

---

# 103. Promotion Stack

Should have explicit compatibility rules.

---

# 104. Coupon

A coupon is a mechanism, not pricing strategy.

---

# 105. Promotion Types

Potential:

```text id="prc058"
PERCENTAGE OFF
FIXED AMOUNT
BUNDLE
BUY X GET Y
FREE SHIPPING
MEMBER PRICE
```

---

# 106. Promotion Objective

Every campaign should have objective:

```text id="prc059"
ACQUISITION
CONVERSION
AOV
CLEARANCE
RETENTION
```

---

# 107. Promotion Economics

Canonical:

```text id="prc060"
INCREMENTAL CONTRIBUTION
```

matters more than promotional revenue.

---

# 108. Promotion Cannibalization

Discount may subsidize customers who would have paid full price.

---

# 109. Clearance

Useful for:

```text id="prc061"
DEAD STOCK
SEASONAL EXIT
DISCONTINUED PRODUCTS
```

---

# 110. Clearance Price

May be below normal margin floor intentionally.

Must remain clearly classified.

---

# 111. Markdown

A structured price reduction over product lifecycle.

---

# 112. Markdown Strategy

Should avoid permanent uncontrolled discounting.

---

# 113. Psychological Pricing

Potential:

```text id="prc062"
199,000
vs
200,000
```

Can influence perception.

But should not overpower brand clarity.

---

# 114. Price Presentation

Must be:

```text id="prc063"
CLEAR
TRANSPARENT
EASY TO UNDERSTAND
```

---

# 115. Hidden Fee

Avoid surprise costs late in checkout/quote.

---

# 116. Fee Transparency

Setup/rush/custom fees should be communicated before commitment.

---

# 117. Price Anchoring

Can use:

- comparison,
- tier,
- bundle.

Must reflect real offer differences.

---

# 118. Artificial Anchoring

Do not create fake inflated reference prices purely to manufacture discount perception.

---

# 119. Price Test

Canonical:

```text id="prc064"
HYPOTHESIS
↓
PRICE VARIANT
↓
CUSTOMER RESPONSE
↓
CONTRIBUTION
↓
DECISION
```

---

# 120. Price Testing Metrics

Evaluate:

```text id="prc065"
CONVERSION
AOV
UNITS
CONTRIBUTION
CUSTOMER MIX
```

---

# 121. Higher Conversion Is Not Automatically Better

If contribution falls more than volume rises.

---

# 122. Price Elasticity

Future data may estimate how demand changes with price.

Do not assume precise elasticity early.

---

# 123. Price Test Guardrails

Do not test prices in ways that violate:

- customer trust,
- contracts,
- legal requirements.

---

# 124. Geographic / Individualized Pricing

Potentially sensitive.

Not recommended as early personalization strategy.

---

# 125. Customer-Specific B2B Pricing

Different because of negotiated commercial relationship, not covert behavioral discrimination.

---

# 126. Margin Floor Architecture

Recommended:

```text id="prc066"
STANDARD PRICE
↓
TARGET CONTRIBUTION
↓
WARNING FLOOR
↓
HARD FLOOR
```

---

# 127. Target Contribution

Desired economics under normal sale.

---

# 128. Warning Floor

Below this:

requires attention/approval.

---

# 129. Hard Floor

Normally prohibited except explicit high-authority exception.

---

# 130. Margin Floor Can Differ

By:

```text id="prc067"
COMMERCE LINE
SERVICE
CHANNEL
CUSTOMER SEGMENT
```

---

# 131. Absolute vs Percentage Floor

Use both where appropriate.

---

# 132. Example Logic

A low-ticket product may have adequate margin % but insufficient absolute contribution to cover fulfillment.

---

# 133. Pricing and Capacity

Scarce capacity should not be consumed by low-contribution work without reason.

---

# 134. Contribution per Bottleneck

Potential input to service pricing.

---

# 135. Pricing and Cash

Prepaid price may differ economically from long-credit price.

---

# 136. Credit Pricing

Long payment terms can justify different commercial terms.

---

# 137. Early Payment Discount

May be offered if cash benefit exceeds discount cost.

---

# 138. Deposit

Custom/Business pricing may require deposit.

---

# 139. Deposit % Is Commercial Term

Not price itself.

But affects risk/cash economics.

---

# 140. Cancellation Economics

Pricing/terms should define non-refundable components where lawful/appropriate.

---

# 141. Sample Fee

Potentially chargeable for:

- physical sample,
- custom prototype.

May be credited toward larger order if strategically useful.

---

# 142. Design Fee

Should be explicit when Studio work has independent value.

---

# 143. Design Bundling

Can bundle into large order if economics support it.

---

# 144. Free Design Trap

If design effort is always “free,” service cost becomes hidden.

---

# 145. Minimum Project Fee

Useful for Custom/Studio/Business to cover admin/setup.

---

# 146. Minimum Order Value

Useful for:

- Supply,
- Fulfill,
- low-margin operations.

---

# 147. Delivery Pricing

Shipping can be:

```text id="prc068"
PASS-THROUGH
FLAT
SUBSIDIZED
FREE ABOVE THRESHOLD
```

---

# 148. Shipping Strategy Must Match Economics

---

# 149. Taxes

Customer-facing price treatment should follow applicable tax/legal requirements.

Detailed tax policy requires professional/local compliance input.

---

# 150. Currency

If TeeStock later sells internationally:

each Price Book should define currency.

---

# 151. FX Risk

Foreign-currency quote should include validity/risk policy.

Not early priority.

---

# 152. Inflation / Input Cost

Price should not remain permanently frozen while cost structure materially changes.

---

# 153. Cost Review Trigger

Potential:

```text id="prc069"
SUPPLIER PRICE CHANGE
PRODUCTION RATE CHANGE
CHANNEL FEE CHANGE
```

---

# 154. Price Review Cadence

Possible:

```text id="prc070"
MONTHLY
for volatile costs

QUARTERLY
for core pricing

EVENT-DRIVEN
for major cost changes
```

---

# 155. Avoid Constant Customer Price Changes

Operational review does not require changing retail price every week.

---

# 156. Price Stability

Has customer trust/value.

---

# 157. Product Lifecycle Pricing

Potential:

```text id="prc071"
LAUNCH
NORMAL
PROMOTION
MARKDOWN
CLEARANCE
```

---

# 158. Launch Discount

Not automatically necessary.

Use if it serves specific objective.

---

# 159. Preorder Price

May reward early commitment if economics/strategy support it.

---

# 160. Early Bird

Can compensate customer for waiting/risk.

---

# 161. Limited Edition Pricing

Scarcity alone should not become exploitation.

Price should remain consistent with brand value.

---

# 162. Dynamic Pricing

Not early priority.

Could later adjust within controlled ranges based on:

```text id="prc072"
CAPACITY
DEMAND
INPUT COST
```

---

# 163. Dynamic Pricing Guardrails

Never let algorithm cross:

```text id="prc073"
APPROVED MIN
APPROVED MAX
POLICY
```

---

# 164. Price Governance

Every price must originate from:

```text id="prc074"
PRICE BOOK
QUOTE
PROMOTION RULE
AUTHORIZED OVERRIDE
```

---

# 165. Price Override

Requires:

```text id="prc075"
OLD PRICE
NEW PRICE
REASON
APPROVER
```

---

# 166. No Chat-Only Price

Canonical.

Customer-facing commercial commitment should exist in quote/order system.

---

# 167. Sales Authority

Sales should know:

```text id="prc076"
WHAT THEY CAN OFFER
WITHOUT APPROVAL
```

---

# 168. Approval Friction

Too many approvals slow sales.

Too little control destroys margin.

---

# 169. Standardize Common Deals

If same exception happens repeatedly:

create formal price rule.

---

# 170. Pricing Policy Hierarchy

Canonical:

```text id="prc077"
PRICING STRATEGY
↓
PRICE BOOK
↓
DISCOUNT / PROMO RULE
↓
QUOTE
↓
ORDER PRICE SNAPSHOT
```

---

# 171. Price Components

Future data model may support:

```text id="prc078"
BASE PRICE
OPTION PRICE
FEE
DISCOUNT
SHIPPING
TAX
```

---

# 172. Configuration Pricing

Customizable product may add:

```text id="prc079"
GARMENT
+
PRINT LOCATION
+
PERSONALIZATION
+
QUANTITY
```

---

# 173. Avoid SKU Explosion for Pricing

Sellable Configuration can calculate price without creating permanent SKU for every customization.

---

# 174. Pricing Engine

Future MGBOS can compute:

```text id="prc080"
CUSTOMER
+
PRODUCT
+
CONFIGURATION
+
QTY
+
CHANNEL
+
DATE
=
ELIGIBLE PRICE
```

---

# 175. Pricing Engine Inputs

Potential:

```text id="prc081"
PRICE BOOK
COST
MARGIN RULE
PROMOTION
CUSTOMER TIER
VOLUME TIER
CONFIGURATION
```

---

# 176. Pricing Engine Output

```text id="prc082"
LIST PRICE
DISCOUNT
FINAL PRICE
EXPECTED CONTRIBUTION
APPROVAL STATUS
```

---

# 177. Expected Margin Check

Before order/quote approval:

```text id="prc083"
EXPECTED PRICE
-
EXPECTED VARIABLE COST
=
EXPECTED CONTRIBUTION
```

---

# 178. Pricing Warning

Potential:

```text id="prc084"
LOW MARGIN
EXPIRED PRICE
UNAUTHORIZED DISCOUNT
MISSING COST
```

---

# 179. Pricing Events

Potential:

```text id="prc085"
price.created
price.changed
quote.generated
discount.applied
margin_floor_breached
price_override.approved
```

---

# 180. MGBOS Pricing Dashboard

Potential:

```text id="prc086"
AVERAGE SELLING PRICE
DISCOUNT RATE
CONTRIBUTION BY PRICE BOOK
MARGIN OVERRIDES
PROMOTION PERFORMANCE
```

---

# 181. Discount Rate

Track:

```text id="prc087"
DISCOUNT VALUE
/
GROSS LIST VALUE
```

with clear definition.

---

# 182. Average Selling Price

Useful by:

```text id="prc088"
PRODUCT
CHANNEL
CUSTOMER
```

---

# 183. Price Realization

Concept:

```text id="prc089"
ACTUAL SELLING PRICE
/
LIST PRICE
```

Useful for B2B/discount-heavy businesses.

---

# 184. Quote Win Rate

Can be analyzed against price levels.

---

# 185. Win Rate Alone Is Dangerous

Very high quote win rate may indicate underpricing.

---

# 186. Lost Deal Reason

Capture:

```text id="prc090"
PRICE
TIMING
QUALITY
SCOPE
COMPETITOR
NO DECISION
```

---

# 187. Price Sensitivity Signal

If many qualified deals are lost primarily on price, investigate.

Do not immediately discount.

---

# 188. Sales Feedback

Useful.

But pricing should not be controlled solely by salesperson anecdotes.

---

# 189. Customer Research

Can help understand:

```text id="prc091"
VALUE PERCEPTION
ALTERNATIVES
WILLINGNESS TO PAY
```

---

# 190. Pricing Experimentation

Use controlled tests where appropriate.

---

# 191. Pricing and Brand

Canonical:

> **Price is part of the brand experience.**

Unstable discounting can undermine trust/positioning.

---

# 192. Premium Without Proof

Bad.

---

# 193. Cheap Without Strategy

Also bad.

---

# 194. Pricing Communication

Focus customer on:

```text id="prc092"
WHAT THEY GET
WHAT IT COSTS
WHAT IS INCLUDED
```

---

# 195. B2B Quote Transparency

Enough detail to build trust.

Not necessarily expose internal margins.

---

# 196. Price Negotiation

Negotiation should trade value.

Potential exchanges:

```text id="prc093"
LOWER PRICE
for
HIGHER QTY

LOWER PRICE
for
SIMPLER SCOPE

LOWER PRICE
for
PREPAYMENT
```

---

# 197. Never Give Without Getting

Canonical negotiation principle:

> **Every meaningful concession should ideally receive a meaningful commitment in return.**

---

# 198. Negotiation Variables

Potential:

```text id="prc094"
PRICE
QTY
SCOPE
LEAD TIME
PAYMENT TERMS
PACKAGING
DELIVERY
```

---

# 199. Preserve Price, Change Scope

Often better than arbitrary discount.

---

# 200. Price Matching

Not default policy.

Only if strategically useful and comparison is genuinely equivalent.

---

# 201. Loss-Making Deal

Can only be intentional.

Should be labeled:

```text id="prc095"
STRATEGIC EXCEPTION
```

---

# 202. Strategic Exception Review

Ask:

```text id="prc096"
WHAT ARE WE BUYING WITH THIS LOSS?
```

Examples:

- data,
- relationship,
- market entry,
- inventory exit.

---

# 203. Pricing Data Model

Core:

```text id="prc097"
PRICE BOOK
PRICE
PRICE RULE
DISCOUNT RULE
PROMOTION
QUOTE
PRICE OVERRIDE
MARGIN RULE
```

---

# 204. Price Book Entity

Commercial context.

---

# 205. Price Entity

Specific amount for product/service.

---

# 206. Price Rule Entity

Logic based on:

- quantity,
- configuration,
- account.

---

# 207. Discount Rule Entity

Defines:

```text id="prc098"
ELIGIBILITY
AMOUNT
STACKING
DATES
```

---

# 208. Promotion Entity

Campaign-level temporary commercial rule.

---

# 209. Quote Entity

Customer-specific commercial offer.

---

# 210. Margin Rule Entity

Defines required economics.

---

# 211. Price Override Entity

Tracks approved manual deviation.

---

# 212. Price Data Lineage

Canonical:

```text id="prc099"
PRODUCT / SERVICE
↓
PRICE BOOK
↓
PRICE RULE
↓
DISCOUNT / PROMOTION
↓
QUOTE / CHECKOUT
↓
ORDER SNAPSHOT
↓
ACTUAL ECONOMICS
```

---

# 213. Automation Opportunities

Potential:

```text id="prc100"
Price Lookup
Volume Tier
Configuration Pricing
Quote Generation
Margin Validation
Discount Approval
Promotion Guardrail
```

---

# 214. Quote Automation

Strong use case after service components are standardized.

---

# 215. Automatic Discount

Safe only from approved deterministic rule.

---

# 216. Dynamic Margin Warning

System should warn before acceptance.

---

# 217. AI Role

AI may assist with:

```text id="prc101"
Quote Draft
Pricing Scenario
Competitive Context Summary
Negotiation Preparation
Price-Test Analysis
```

---

# 218. AI Pricing Recommendation

Can recommend:

```text id="prc102"
PRICE RANGE
```

with reasoning.

---

# 219. AI Pricing Boundary

AI should not independently:

```text id="prc103"
BREAK HARD FLOOR
CREATE UNAPPROVED DISCOUNT
CHANGE CONTRACT PRICE
```

---

# 220. AI Negotiation Support

Can suggest:

> keep price, reduce scope

or:

> offer lower rate only above quantity threshold.

---

# 221. Pricing Maturity Model

```text id="prc104"
LEVEL 0
Founder guesses price

LEVEL 1
Basic price list + manual quote

LEVEL 2
Price books + margin floors

LEVEL 3
Rules + automated quoting

LEVEL 4
Experiment-driven pricing

LEVEL 5
AI-assisted optimization within guardrails
```

---

# 222. Level 0

Anti-goal:

```text id="prc105"
MODAL × 2
```

used blindly for everything.

---

# 223. Level 1

Minimum:

```text id="prc106"
PRODUCT PRICE
SERVICE RATE
QUOTE
DISCOUNT RECORD
```

---

# 224. Level 2

Adds:

```text id="prc107"
PRICE BOOK
MARGIN FLOOR
VOLUME TIER
APPROVAL
```

---

# 225. Level 3

Adds:

```text id="prc108"
CONFIGURATION PRICING
AUTOMATED QUOTE
MARGIN CHECK
```

---

# 226. Level 4

Adds:

```text id="prc109"
A/B PRICE TESTS
PROMOTION OPTIMIZATION
CHANNEL PRICING ANALYTICS
```

---

# 227. Level 5

AI recommends:

```text id="prc110"
PRICE
PROMO
DISCOUNT
NEGOTIATION
```

within deterministic limits.

---

# 228. Current Recommended Stage

TeeStock should target:

```text id="prc111"
LEVEL 1
→
LEVEL 2
```

first.

---

# 229. V1 Required Pricing

Establish:

```text id="prc112"
RETAIL PRICE BOOK
SUPPLY / B2B PRICE LOGIC
RESELLER PRICE BOOK
SERVICE QUOTE STRUCTURE
MARGIN CHECK
```

---

# 230. V1 Discount Control

At minimum record:

```text id="prc113"
LIST PRICE
DISCOUNT
FINAL PRICE
REASON
```

---

# 231. V1 Service Quote

Build standardized components.

Do not calculate each quote from scratch forever.

---

# 232. V1 Price Floors

Use actual cost data from Unit Economics before setting rigid final thresholds.

---

# 233. V1 Avoid

Do not immediately build:

```text id="prc114"
dynamic pricing
complex personalized prices
hundreds of customer tiers
AI-controlled discounts
```

---

# 234. V2 Expansion

Possible:

```text id="prc115"
CONFIGURATION PRICING
ACCOUNT CONTRACT PRICING
RUSH FEES
VOLUME AUTOMATION
PROMOTION STACK CONTROL
```

---

# 235. V3 Expansion

Possible:

```text id="prc116"
PRICING EXPERIMENTS
ELASTICITY ANALYSIS
CHANNEL OPTIMIZATION
QUOTE ANALYTICS
```

---

# 236. V4 Expansion

Possible:

```text id="prc117"
DYNAMIC RECOMMENDATIONS
CAPACITY-AWARE PRICING
AI NEGOTIATION SUPPORT
```

---

# 237. Price Creation Gate

New price should have:

```text id="prc118"
PRODUCT / SERVICE
MARKET CONTEXT
COST BASIS
POSITIONING
EXPECTED CONTRIBUTION
```

---

# 238. Price Change Gate

Change price when evidence exists:

```text id="prc119"
COST CHANGE
DEMAND SIGNAL
POSITIONING CHANGE
MARKET CHANGE
STRATEGIC TEST
```

---

# 239. Discount Gate

Discount only if:

```text id="prc120"
ELIGIBLE REASON
+
AUTHORIZED LEVEL
+
ACCEPTABLE CONTRIBUTION
```

---

# 240. Promotion Gate

Launch promo only after:

```text id="prc121"
OBJECTIVE
+
ECONOMIC MODEL
+
STACKING RULE
+
MEASUREMENT PLAN
```

---

# 241. B2B Quote Gate

Before sending:

```text id="prc122"
SCOPE CLEAR
+
COST ESTIMATE
+
CONTRIBUTION
+
PAYMENT TERMS
+
VALIDITY
```

---

# 242. Rush Pricing Gate

Rush offer only when:

```text id="prc123"
CAPACITY CONFIRMED
+
INCREMENTAL COST KNOWN
+
CUSTOMER ACCEPTS PREMIUM
```

---

# 243. Reseller Pricing Gate

Must preserve:

```text id="prc124"
TEEStock ECONOMICS
+
RESELLER ECONOMIC ROOM
```

---

# 244. Strategic Exception Gate

Below-floor price requires:

```text id="prc125"
APPROVAL
+
DOCUMENTED STRATEGIC BENEFIT
+
DEFINED LIMIT
```

---

# 245. Pricing Failure Modes

## Cost × Arbitrary Multiplier

Ignores value and cost layers.

## Discount Without Reason

Margin leakage.

## Different Salespeople, Different Prices

Commercial inconsistency.

## Quote Without Margin Check

Hidden losses.

## Free Design Everywhere

Hidden service cost.

## Unlimited Revisions

Margin destruction.

## Marketplace Price Same Despite High Fees

Channel economics ignored.

## Volume Discount Without Efficiency

Giving away margin.

## Promo Stacking Without Guardrail

Negative contribution.

---

# 246. What Pricing Must Not Become

## Cheapest-Wins Strategy

Unsustainable positioning.

## Margin-Maximization at Any Cost

Can destroy demand/customer value.

## Permanent Discount Brand

Weakens price integrity.

## Founder Guessing Engine

Pricing must become institutional knowledge.

## AI Pricing Black Box

Commercial rules must remain explainable.

---

# 247. Pricing Success Definition

Pricing succeeds when TeeStock can answer:

```text id="prc126"
WHAT IS THE NORMAL PRICE?

WHY IS THAT THE PRICE?

WHAT DOES THIS CUSTOMER / CHANNEL PAY?

WHAT DISCOUNT IS ALLOWED?

WHAT VOLUME TIER APPLIES?

WHAT EXTRA FEES APPLY?

WHAT CONTRIBUTION REMAINS?

DOES THIS PRICE REQUIRE APPROVAL?

WHAT PRICE DID THE CUSTOMER ACTUALLY ACCEPT?
```

---

# 248. Canonical Pricing Summary

```text id="prc127"
VALUE
informs willingness to pay.

COST
defines economic boundary.

POSITIONING
defines commercial context.

PRICE BOOK
defines standard price.

RULES
handle quantity and configuration.

DISCOUNT
creates controlled exception.

QUOTE
creates customer commitment.

MARGIN FLOOR
protects economics.

MGBOS
turns pricing into repeatable commercial control.
```

---

# 249. Canonical Pricing Principles

```text id="prc128"
PRICE FOR VALUE. GUARD FOR ECONOMICS.

MARKUP IS NOT MARGIN.

PRICE IS NOT COST.

VOLUME DISCOUNT MUST EARN ITS DISCOUNT.

COMPLEXITY SHOULD BE PRICED.

RUSH SHOULD PAY FOR DISRUPTION.

NO REASON, NO DISCOUNT.

NO QUOTE WITHOUT ECONOMICS.

NO PRICE OVERRIDE WITHOUT TRACE.

PROMOTION MUST HAVE AN OBJECTIVE.

STACKING MUST HAVE A GUARDRAIL.

PRICE BOOK BEFORE COMMERCIAL CHAOS.

EXPECTED CONTRIBUTION BEFORE COMMITMENT.

AI MAY RECOMMEND. POLICY DEFINES THE BOUNDARY.
```

---

# 250. Dependency

Dokumen berikut harus follow Pricing Framework:

1. [[bisnis/teestock/08-finance/cost-accounting|cost-accounting.md]]
2. [[bisnis/teestock/08-finance/treasury-policy|treasury-policy.md]]
3. [[bisnis/teestock/09-marketing/go-to-market|go-to-market.md]]
4. [[bisnis/teestock/09-marketing/channel-strategy|channel-strategy.md]]
5. [[bisnis/teestock/09-marketing/audience-segmentation|audience-segmentation.md]]
6. [[bisnis/teestock/10-product-tech/commerce-platform|commerce-platform.md]]
7. [[bisnis/teestock/10-product-tech/automation-architecture|automation-architecture.md]]
8. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
9. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
10. [[bisnis/teestock/11-data-mgbos/mgbos-integration|mgbos-integration.md]]
11. [[bisnis/teestock/13-metrics-experiments/experimentation-framework|experimentation-framework.md]]
12. [[bisnis/teestock/13-metrics-experiments/decision-thresholds|decision-thresholds.md]]

TeeStock Pricing Framework boleh berkembang menjadi configuration-aware, experiment-driven, capacity-aware, dan AI-assisted pricing system, tetapi advanced pricing hanya boleh berdiri di atas reliable unit economics, disciplined price books, explicit margin floors, controlled discount authority, versioned quotes, dan clear commercial strategy.