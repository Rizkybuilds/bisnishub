---
title: "TeeStock Design Licensing Policy"
document_id: "TS-LEG-002"
version: "1.0"
status: "CANONICAL"
category: "legal-ip"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-LEG-001"
  - "TS-COM-002"
  - "TS-ORG-001"
  - "TS-PRG-002"
  - "TS-TEC-004"
  - "TS-FIN-002"
  - "TS-FIN-005"
  - "TS-DAT-001"
---

# TeeStock Design Licensing Policy v1.0

> **Canonical TeeStock Artwork, Design, Creative Asset Licensing & Commercial-Rights Framework**  
> Dokumen ini mendefinisikan license types, licensors, licensees, ownership boundaries, exclusivity, scope, product rights, territory, channels, duration, modification, sublicensing, royalty, minimum guarantees, commissioned artwork, creator licensing, stock assets, fonts, photography, derivative works, renewal, termination, sell-off rights, reporting, audits, rights recordation, dan hubungan License → Product → Order → Earning di TeeStock.

---

# 1. Purpose

Design Licensing Policy menjawab:

> **Dalam kondisi apa TeeStock boleh menggunakan sebuah desain atau creative asset yang tidak sepenuhnya dimiliki TeeStock, seberapa luas penggunaannya, berapa lama, pada produk apa, di channel mana, dan bagaimana hak ekonomi pihak yang memberikan lisensi dihitung serta dikendalikan?**

Canonical principle:

> **License the exact rights the business needs—no less, no more, and never more than the licensor can grant.**

---

# 2. Canonical Definition

> **TeeStock Design Licensing Policy adalah governance framework yang mengatur pemberian dan penerimaan hak penggunaan creative assets melalui explicit licenses yang mengidentifikasi asset, licensor, licensee, permitted rights, commercial scope, territory, duration, exclusivity, modification, compensation, restrictions, evidence, termination, and post-termination obligations.**

---

# 3. Licensing Role in TeeStock

Licensing enables TeeStock to monetize legitimate creative work without requiring TeeStock to own every asset outright.

---

# 4. Strategic Licensing Uses

Potential:

```text id="lic001"
TEEStock SELECTS
CREATOR COLLECTIONS
COLLABORATIONS
CREATOR MERCH
LICENSED ARTWORK
BRAND PARTNERSHIPS
LIMITED DROPS
```

---

# 5. Ownership vs License

Canonical:

```text id="lic002"
OWNERSHIP
defines who owns rights.

LICENSE
defines what another party may do.
```

---

# 6. License Does Not Automatically Transfer Ownership

Canonical.

---

# 7. Assignment

Separate legal/commercial mechanism.

Conceptually:

```text id="lic003"
ASSIGNMENT
=
transfer of defined rights.

LICENSE
=
permission to exercise defined rights.
```

---

# 8. Licensor

Party granting rights.

Potential:

```text id="lic004"
CREATOR
DESIGNER
PHOTOGRAPHER
BRAND
RIGHTS HOLDER
AGENCY
OTHER AUTHORIZED PARTY
```

---

# 9. Licensee

Party receiving rights.

Typically:

```text id="lic005"
TEEStock
```

or relevant MultiGraph Group entity when formally required.

---

# 10. Licensor Authority

Canonical:

> **A party cannot safely license rights it does not possess or have authority to license.**

---

# 11. Authority Verification

TeeStock should establish reasonable evidence that licensor has authority.

---

# 12. Authority Evidence

Potential:

```text id="lic006"
CREATOR DECLARATION
OWNERSHIP DOCUMENT
ASSIGNMENT
PRIOR LICENSE
REGISTRATION
EMPLOYMENT / COMMISSION TERMS
```

---

# 13. License Object

Canonical data object:

```text id="lic007"
LICENSE
├── Licensor
├── Licensee
├── Asset Scope
├── Rights Granted
├── Restrictions
├── Territory
├── Term
├── Exclusivity
├── Compensation
└── Status
```

---

# 14. Asset Scope

License must identify what exactly is covered.

---

# 15. Asset Identification

Use:

```text id="lic008"
IP ASSET ID
ARTWORK ID
VERSION
TITLE
ATTACHMENT / SCHEDULE
```

---

# 16. Avoid Vague Scope

Bad:

> Semua desain creator.

Preferred:

> Defined artworks listed in Schedule A.

---

# 17. License Scope Principle

Canonical:

> **Rights should be machine-readable enough that MGBOS can determine whether a proposed use falls inside or outside the agreement.**

---

# 18. Rights Granted

Potential:

```text id="lic009"
REPRODUCE
PRINT
DISPLAY
DISTRIBUTE
SELL
ADVERTISE
MODIFY
ADAPT
CREATE DERIVATIVE ASSETS
USE IN DIGITAL CONTENT
```

as applicable.

---

# 19. No Assumed Rights

Rights not clearly granted should not be assumed operationally.

---

# 20. Product Scope

License should state permitted product categories.

Potential:

```text id="lic010"
T_SHIRT
HOODIE
APPAREL
ACCESSORIES
PACKAGING
ALL APPROVED MERCHANDISE
```

---

# 21. Narrow Product License

Example:

```text id="lic011"
T_SHIRT ONLY
```

must not automatically authorize tote bags.

---

# 22. Broad Product License

Potential:

```text id="lic012"
ALL APPAREL AND ACCESSORIES
```

where deliberately negotiated.

---

# 23. Product Scope Expansion

Requires:

```text id="lic013"
AMENDMENT
or
NEW LICENSE
```

if original rights do not cover expansion.

---

# 24. Channel Scope

Potential:

```text id="lic014"
TEEStock WEBSITE
MARKETPLACES
OFFLINE EVENTS
RETAIL
WHOLESALE
CREATOR STORE
SOCIAL COMMERCE
```

---

# 25. Marketing Channel Rights

Commercial-sale rights and advertising rights should both be clear.

---

# 26. Paid Advertising

If material, license should clarify whether asset can be used in:

```text id="lic015"
PAID SOCIAL
SEARCH ADS
DISPLAY ADS
MARKETPLACE ADS
```

---

# 27. Content Rights

Potential:

```text id="lic016"
SOCIAL POST
PRODUCT PAGE
EMAIL
CAMPAIGN
LOOKBOOK
```

---

# 28. Territory

Canonical:

> **Territory defines where TeeStock is permitted to exercise licensed rights.**

---

# 29. Territory Examples

```text id="lic017"
INDONESIA
SOUTHEAST ASIA
WORLDWIDE
DEFINED COUNTRIES
```

---

# 30. Online Sales Do Not Automatically Mean Worldwide Rights

Canonical.

---

# 31. Cross-Border Sales

Before selling internationally:

verify:

```text id="lic018"
TERRITORY
DELIVERY
CHANNEL
MARKETING
```

rights.

---

# 32. License Term

Every license should specify:

```text id="lic019"
START DATE
END DATE
```

or clearly defined perpetual/ongoing basis where legally and commercially appropriate.

---

# 33. Fixed-Term License

Example:

```text id="lic020"
12 MONTHS
24 MONTHS
36 MONTHS
```

---

# 34. Perpetual License

Should be used deliberately.

Not inserted automatically for convenience.

---

# 35. Evergreen / Auto-Renew

If used:

define:

```text id="lic021"
RENEWAL PERIOD
NOTICE DEADLINE
TERMINATION PROCESS
```

---

# 36. Effective Date

Separate from signature date where necessary.

---

# 37. Expiry Date

Must become structured MGBOS field.

---

# 38. License Status

Canonical:

```text id="lic022"
DRAFT
PENDING_SIGNATURE
ACTIVE
EXPIRING
EXPIRED
SUSPENDED
TERMINATED
SUPERSEDED
DISPUTED
```

---

# 39. Active License

Means rights are currently usable within defined scope.

---

# 40. Expired License

Canonical default:

```text id="lic023"
NO NEW USE
```

subject to defined sell-off/post-termination provisions.

---

# 41. Exclusivity

Canonical types:

```text id="lic024"
EXCLUSIVE
NON_EXCLUSIVE
LIMITED_EXCLUSIVE
```

---

# 42. Exclusive License

TeeStock receives exclusivity as specifically defined.

---

# 43. Exclusivity Must Have Dimensions

Exclusive:

```text id="lic025"
WHERE?
FOR WHAT?
FOR HOW LONG?
AGAINST WHOM?
```

---

# 44. Example

```text id="lic026"
Exclusive:
Indonesia
Apparel
12 months
```

is materially different from worldwide unrestricted exclusivity.

---

# 45. Limited Exclusivity

Can apply by:

```text id="lic027"
PRODUCT
CHANNEL
TERRITORY
CUSTOMER SEGMENT
TIME
```

---

# 46. Non-Exclusive License

Licensor may generally license/use the work elsewhere subject to agreement.

---

# 47. Exclusivity Economics

Broader exclusivity usually deserves stronger commercial justification.

---

# 48. TeeStock Licensing Principle

Canonical:

> **Do not pay for broad exclusivity unless the strategic value of exclusivity is identifiable.**

---

# 49. Originals vs Selects

Typical strategic direction:

```text id="lic028"
SELECTS
can often use non-exclusive licensing.

ORIGINALS
should seek stronger ownership/control where long-term brand value depends on the asset.
```

---

# 50. Creator Collaboration

May justify limited exclusivity around:

```text id="lic029"
DROP
COLLECTION
PRODUCT CATEGORY
LAUNCH WINDOW
```

---

# 51. Modification Rights

License should specify whether TeeStock may:

```text id="lic030"
RESIZE
RECOLOR
CROP
ADD TEXT
COMBINE
ADAPT
ANIMATE
REDESIGN
```

---

# 52. Technical Modification

Production often requires:

```text id="lic031"
COLOR SEPARATION
RESIZING
FORMAT CONVERSION
VECTOR CLEANUP
```

License should accommodate necessary production adaptation.

---

# 53. Creative Modification

Different from technical preparation.

---

# 54. Material Creative Change

May require creator approval.

---

# 55. Approval Right

Potential:

```text id="lic032"
NO APPROVAL REQUIRED
CONSULTATION
APPROVAL REQUIRED
```

for defined changes.

---

# 56. Approval SLA

If approval required:

set response window to prevent operational deadlock.

---

# 57. Derivative Work

Potentially includes adaptation/transformation.

TeeStock should not assume derivative rights without an appropriate grant.

---

# 58. Ownership of Derivatives

Must be explicitly addressed where material.

---

# 59. TeeStock Additions

Example:

```text id="lic033"
LICENSED ARTWORK
+
TEEStock TYPOGRAPHY / LAYOUT
=
COMPOSITE ASSET
```

ownership of underlying artwork remains distinct from new TeeStock elements unless agreement says otherwise.

---

# 60. Sublicensing

Canonical:

> **Sublicensing determines whether TeeStock may authorize another party to exercise licensed rights.**

---

# 61. Production Partner Use

TeeStock commonly needs limited third-party production use.

---

# 62. Recommended Production Permission

License should permit TeeStock to provide assets to:

```text id="lic034"
APPROVED MANUFACTURERS
PRINTERS
FULFILLMENT PARTNERS
```

solely to execute TeeStock-authorized work.

---

# 63. Production Permission ≠ Commercial Sublicense

Canonical.

---

# 64. Marketplace Use

Uploading product images/assets to marketplaces may require platform-use permissions under applicable service terms.

License architecture should support necessary operational usage.

---

# 65. Broad Sublicensing

Should not be granted/assumed unnecessarily.

---

# 66. Creator Licensing Models

Canonical potential models:

```text id="lic035"
FIXED LICENSE FEE
ROYALTY
MINIMUM GUARANTEE + ROYALTY
ADVANCE AGAINST ROYALTY
HYBRID
```

---

# 67. Fixed License Fee

TeeStock pays predefined fee for licensed scope.

---

# 68. Royalty

Creator compensation varies with eligible commercial activity.

---

# 69. Minimum Guarantee

TeeStock guarantees minimum compensation regardless of actual royalty generation, subject to contract.

---

# 70. Advance Against Royalty

Advance may be recouped from future earned royalties if terms specify.

---

# 71. Advance Is Not Automatically Additional Royalty

Canonical accounting/commercial distinction.

---

# 72. Hybrid Model

Potential:

```text id="lic036"
UPFRONT FEE
+
PER-UNIT ROYALTY
```

or similar.

---

# 73. Royalty Basis

Canonical options:

```text id="lic037"
FIXED PER UNIT
% OF DEFINED NET SALES
% OF DEFINED GROSS BASIS
FIXED PER ORDER
OTHER EXPLICIT BASIS
```

---

# 74. Avoid “Percentage of Sales”

Too ambiguous.

---

# 75. Royalty Definition Must State

```text id="lic038"
PERCENTAGE
BASE
DISCOUNTS
RETURNS
TAX
SHIPPING
CHANNEL FEES
CURRENCY
```

where relevant.

---

# 76. Fixed Per Unit

Example conceptual:

```text id="lic039"
Rp X
per eligible unit
```

---

# 77. Percentage Royalty

Formula:

```text id="lic040"
ROYALTY RATE
×
DEFINED ROYALTY BASE
```

---

# 78. Royalty Base

Must be canonical and versioned.

---

# 79. Royalty Rule Entity

Link:

```text id="lic041"
LICENSE
→ ROYALTY RULE
```

---

# 80. Royalty Rule Effective Period

Canonical.

---

# 81. Royalty Rule Changes

New rule version applies prospectively according to agreement.

---

# 82. Historical Sales

Must retain original royalty rule snapshot.

---

# 83. Returns

License should define impact of:

```text id="lic042"
CANCELLED ORDERS
RETURNS
REFUNDS
CHARGEBACKS
FRAUD
```

on royalties.

---

# 84. Pending Royalty

Eligible sale can initially create:

```text id="lic043"
PENDING EARNING
```

---

# 85. Validation Window

After return/fraud/payment conditions:

```text id="lic044"
PENDING
→ VALIDATED
→ PAYABLE
```

---

# 86. Royalty Reversal

Refund may produce negative adjustment/reversal rather than rewriting old earning.

---

# 87. Creator Earnings Ledger

Canonical:

```text id="lic045"
ORDER ITEM
↓
ATTRIBUTION
↓
ROYALTY RULE
↓
EARNING
↓
PAYOUT
```

---

# 88. License → Product Relationship

Canonical:

```text id="lic046"
LICENSE
↔
IP ASSET
↔
PRODUCT
```

---

# 89. Product Can Have Multiple Licensed Assets

Example:

```text id="lic047"
ILLUSTRATION
FONT
PHOTO
BRAND MARK
```

---

# 90. Product Rights Eligibility

All material required rights must be valid.

---

# 91. Weakest-Link Principle

Canonical:

> **A Product is not fully rights-cleared if one material required asset lacks valid rights.**

---

# 92. Product Rights Graph

```text id="lic048"
PRODUCT
├── Artwork License
├── Font License
├── Photo Rights
└── Collaboration Rights
```

---

# 93. License → Order Relationship

Orders should not need to duplicate full agreements.

Instead:

```text id="lic049"
ORDER ITEM
→ PRODUCT
→ ACTIVE LICENSE CONTEXT
```

with transaction snapshot of royalty basis where needed.

---

# 94. Rights Snapshot

At transaction time preserve enough to know:

```text id="lic050"
LICENSE ID
ROYALTY RULE VERSION
CREATOR RELATIONSHIP
```

---

# 95. Creator Earnings

Must derive from eligible transaction evidence.

---

# 96. Licensing Reporting

Creator/licensor may receive periodic statements if agreed.

---

# 97. Statement Minimum

Potential:

```text id="lic051"
PERIOD
ELIGIBLE UNITS
ROYALTY BASE
ROYALTY
REVERSALS
PAYMENTS
```

---

# 98. Statement Granularity

Balance transparency with customer privacy.

---

# 99. Customer PII

Generally unnecessary for creator royalty statement.

---

# 100. Audit Rights

Some licenses may give licensor rights to verify royalty calculations.

---

# 101. Audit Clause

If included, define:

```text id="lic052"
NOTICE
FREQUENCY
SCOPE
CONFIDENTIALITY
COST
RECORD PERIOD
```

---

# 102. TeeStock Recordkeeping

Royalty records should be reproducible from canonical transactions.

---

# 103. Manual Spreadsheet Royalty

May serve as temporary V1 tooling.

Should not become unverifiable permanent source.

---

# 104. Currency

License must define payment currency where needed.

---

# 105. Foreign Currency

If royalty base/payment differs by currency:

define FX methodology.

---

# 106. Taxes / Withholding

Tax treatment should follow applicable tax/finance policy and professional advice.

Do not embed unsupported assumptions into Creator Platform.

---

# 107. Payment Schedule

Potential:

```text id="lic053"
MONTHLY
QUARTERLY
MILESTONE
```

---

# 108. Payment Threshold

Can exist if contract clearly defines it.

---

# 109. Payout Approval

Treasury controls movement of funds.

---

# 110. License Team Does Not Execute Cash Directly

Canonical.

---

# 111. Commissioned Artwork

Commission can use:

```text id="lic054"
ASSIGNMENT
or
LICENSE
```

depending strategic objective.

---

# 112. Commission With Assignment

Useful when TeeStock requires strong long-term control.

---

# 113. Commission With License

Useful where creator retains ownership while TeeStock receives defined commercialization rights.

---

# 114. Commission Decision Framework

Ask:

```text id="lic055"
IS THIS CORE LONG-TERM TEEStock IP?

DO WE NEED EXCLUSIVITY?

DO WE NEED FUTURE PRODUCT FLEXIBILITY?

IS CREATOR OWNERSHIP STRATEGICALLY IMPORTANT?

WHAT DOES EACH MODEL COST?
```

---

# 115. Originals Commission

Preferred direction:

stronger long-term ownership/control than ordinary Selects licensing where feasible.

---

# 116. Selects Commission

May economically favor:

```text id="lic056"
LIMITED LICENSE
+
ROYALTY
```

where appropriate.

---

# 117. One-Off Campaign

Can justify narrow:

```text id="lic057"
SHORT TERM
CHANNEL-LIMITED
CAMPAIGN-SPECIFIC
```

license.

---

# 118. Creator Merch

Creator typically retains its brand/creative assets.

TeeStock receives operational/commercial rights sufficient to:

```text id="lic058"
DEVELOP
MANUFACTURE
LIST
MARKET
FULFILL
```

under project terms.

---

# 119. Creator Merch Is Not Automatically TeeStock Selects

Commercial relationship differs.

---

# 120. Collaboration License

May combine:

```text id="lic059"
TEEStock BACKGROUND IP
+
CREATOR BACKGROUND IP
+
NEW COLLAB IP
```

requiring explicit rights matrix.

---

# 121. Rights Matrix

Recommended for complex collaboration:

| Asset | Owner | TeeStock Use | Creator Use | Term |
|---|---|---|---|---|
| Creator logo | Creator | Defined collaboration use | Retained | Agreement term |
| TeeStock logo | TeeStock | Collaboration | Defined | Agreement term |
| New artwork | Contract-defined | Contract-defined | Contract-defined | Contract-defined |

---

# 122. Background Assets

Remain owned as defined before collaboration unless expressly transferred.

---

# 123. New Collaboration Assets

Need explicit rule.

Do not rely on assumptions.

---

# 124. Stock Assets

TeeStock may license:

```text id="lic060"
PHOTOGRAPHY
ILLUSTRATIONS
TEXTURES
TEMPLATES
MOCKUPS
```

from commercial providers.

---

# 125. Stock License Review

Check:

```text id="lic061"
COMMERCIAL USE
MERCHANDISE
PRINT-ON-DEMAND
RESALE
MODIFICATION
USER / SEAT LIMIT
```

as applicable.

---

# 126. Asset Subscription

Subscription access does not necessarily mean perpetual unrestricted rights.

---

# 127. Proof of License

Store:

```text id="lic062"
PROVIDER
LICENSE VERSION
PURCHASE / DOWNLOAD DATE
ASSET ID
RECEIPT
```

where practical.

---

# 128. Provider Terms Change

Historical use may depend on terms effective when acquired.

Preserve evidence.

---

# 129. Font Licenses

Potential categories:

```text id="lic063"
DESKTOP
WEB
APP
LOGO / BRAND
MERCHANDISE
```

depending font provider's licensing model.

---

# 130. Font Use Review

Do not assume desktop-license purchase covers every digital or commercial use.

---

# 131. Font Modification

May have separate restrictions.

---

# 132. Open-Source Fonts

Open license still has conditions.

Store license source where used strategically.

---

# 133. Photography Licenses

Potential rights include:

```text id="lic064"
EDITORIAL
COMMERCIAL
ADVERTISING
MERCHANDISE
```

which may differ.

---

# 134. Model Release

A photographer's copyright license does not necessarily resolve likeness/model permissions.

---

# 135. Property / Location Rights

May matter for certain commercial photography.

---

# 136. Music and Audio

For future video/content:

licenses may involve multiple layers.

Do not treat music streaming access as commercial-content license.

---

# 137. Website Content License

Licensed asset for website use does not automatically authorize apparel printing.

---

# 138. Marketing Asset License

Licensed campaign image does not automatically authorize resale merchandise.

---

# 139. Marketplace Product Image

Must stay within image/content rights.

---

# 140. License Scope Check

MGBOS rule:

```text id="lic065"
PROPOSED USE
∈
LICENSED USE
?
```

---

# 141. License Scope Dimensions

Machine-readable dimensions:

```text id="lic066"
ASSET
PRODUCT
CHANNEL
TERRITORY
TERM
MODIFICATION
COMMERCIAL USE
```

---

# 142. Rights Decision

Potential:

```text id="lic067"
ELIGIBLE
NOT_ELIGIBLE
REVIEW_REQUIRED
```

---

# 143. License Expiration Automation

Potential:

```text id="lic068"
90 DAYS BEFORE
→ review task

30 DAYS
→ escalation

EXPIRY
→ rights state update
```

---

# 144. Expiration Impact Analysis

Identify:

```text id="lic069"
ACTIVE PRODUCTS
LISTINGS
CAMPAIGNS
INVENTORY
OPEN ORDERS
PRODUCTION JOBS
```

---

# 145. Expiry Does Not Automatically Mean Destroy Inventory

Post-term action depends on agreement.

---

# 146. Sell-Off Rights

Canonical:

> **Sell-Off Rights define whether TeeStock may continue selling already-produced inventory after license expiration or termination.**

---

# 147. Sell-Off Terms

Must define:

```text id="lic070"
ELIGIBILITY
DURATION
PRODUCTS
CHANNELS
TERRITORY
ROYALTY
```

---

# 148. Example

Conceptually:

```text id="lic071"
90-DAY SELL-OFF
for finished inventory existing on termination date.
```

Actual term must come from agreement.

---

# 149. Sell-Off Does Not Mean New Production

Unless agreement specifically allows it.

---

# 150. Inventory Freeze

At expiry:

```text id="lic072"
NO NEW PRODUCTION
```

may coexist with:

```text id="lic073"
SELL EXISTING INVENTORY
```

if permitted.

---

# 151. Sell-Off Inventory Snapshot

Capture eligible quantity at relevant cutoff.

---

# 152. Sell-Off Royalty

Continue according to agreement.

---

# 153. Unsold Inventory After Sell-Off

Possible options depending contract:

```text id="lic074"
DE-BRAND
DESTROY
RETURN
ARCHIVE
OTHER AGREED DISPOSITION
```

---

# 154. Termination

Potential causes:

```text id="lic075"
CONVENIENCE
BREACH
EXPIRY
MUTUAL AGREEMENT
RIGHTS DISPUTE
INSOLVENCY / OTHER CONTRACT EVENT
```

as agreement permits.

---

# 155. Termination ≠ Historical Erasure

Canonical.

---

# 156. Historical Orders

Remain records.

---

# 157. Historical Earnings

Remain financial records.

---

# 158. Post-Termination Checklist

Potential:

```text id="lic076"
STOP NEW PRODUCTION
REVIEW SALES
REMOVE LISTINGS
STOP ADS
SELL-OFF if allowed
FINAL ROYALTY
RETURN / DELETE FILES where required
ARCHIVE RECORDS
```

---

# 159. Suspension

Temporary restriction before final termination.

---

# 160. Suspension Trigger

Potential:

```text id="lic077"
DISPUTE
UNVERIFIED AUTHORITY
BREACH ALLEGATION
LEGAL NOTICE
```

---

# 161. Suspension Scope

Should be targeted where possible.

---

# 162. License Renewal

Renewal should occur before expiry.

---

# 163. Renewal Review

Assess:

```text id="lic078"
SALES
CONTRIBUTION
ROYALTY COST
BRAND VALUE
RIGHTS PERFORMANCE
FUTURE DEMAND
```

---

# 164. Automatic Renewal

Should still create monitoring.

---

# 165. Renewal Economics

Do not renew merely because product existed historically.

---

# 166. License Portfolio Review

Potential cadence:

```text id="lic079"
QUARTERLY
or
SEMIANNUAL
```

for active material licenses.

---

# 167. License Performance

Potential:

```text id="lic080"
NET SALES
UNITS
CONTRIBUTION
ROYALTY
RETURN RATE
```

---

# 168. Royalty Burden

Potential:

```text id="lic081"
ROYALTY
/
ROYALTY BASE
```

---

# 169. License Contribution

Measure economics after royalty and related variable costs.

---

# 170. License Utilization

How much of licensed scope is actually being used.

---

# 171. Unused License

Can signal over-buying rights.

---

# 172. Exclusivity Utilization

Particularly important where TeeStock paid premium for exclusivity.

---

# 173. Renewal Decision

Must consider both:

```text id="lic082"
ECONOMICS
+
STRATEGIC BRAND VALUE
```

---

# 174. Minimum Guarantee Risk

Before agreeing:

model downside.

---

# 175. MG Scenario

Potential:

```text id="lic083"
EXPECTED SALES
DOWNSIDE SALES
ROYALTY GENERATED
UNRECOUPED GUARANTEE
```

---

# 176. Advance Recoupment

Finance must track:

```text id="lic084"
ADVANCE
ROYALTIES ACCRUED
RECOUPED
UNRECOUPED
```

---

# 177. Advance Ledger

Separate from payable royalty if needed.

---

# 178. Royalty Cap

Can exist if negotiated.

---

# 179. Royalty Floor

Can exist through guarantee/minimum structures.

---

# 180. Tiered Royalty

Potential:

```text id="lic085"
0–500 units
rate A

501–2,000
rate B
```

only if operational complexity is justified.

---

# 181. Tier Rule

Must define whether rate is:

```text id="lic086"
MARGINAL
or
RETROACTIVE
```

to prevent disputes.

---

# 182. Product-Specific Royalty

Different products may have different economics.

---

# 183. Channel-Specific Royalty

Possible but increases complexity.

Avoid unless commercially necessary.

---

# 184. Promotion Treatment

License should define how discounts influence royalty base.

---

# 185. Bundles

Need allocation methodology if royalty asset appears in bundle.

---

# 186. Bundle Allocation

Potential:

```text id="lic087"
STANDALONE SELLING PRICE
DEFINED FIXED VALUE
OTHER CONTRACT METHOD
```

---

# 187. Free Promotional Product

Agreement should determine whether royalty applies to free units.

---

# 188. Samples

Clarify:

```text id="lic088"
PRODUCTION SAMPLE
CREATOR SAMPLE
MARKETING GIVEAWAY
```

treatment if material.

---

# 189. Damaged / Scrapped Units

Normally distinguish from eligible sold units according to royalty basis.

---

# 190. Wholesale

If permitted, define royalty basis separately if economics differ materially.

---

# 191. Reseller Channel

Same principle.

---

# 192. Marketplace Fees

Whether deducted before royalty depends on agreement definition.

Never assume.

---

# 193. Shipping

Whether included/excluded must be defined.

---

# 194. Taxes

Royalty base should specify treatment as appropriate.

---

# 195. License Recordation

Indonesia currently maintains an active government framework for recording IP license agreements through PP No. 36/2018 and related procedures. TeeStock should therefore flag agreements for legal review where official recordation may be required or strategically advisable rather than treating signature alone as the end of all administrative steps.

---

# 196. Recordation Status

Potential MGBOS field:

```text id="lic089"
NOT_APPLICABLE
NOT_REVIEWED
REVIEW_REQUIRED
PREPARING
SUBMITTED
RECORDED
REJECTED
```

---

# 197. Recordation ≠ License Status

A commercial agreement and administrative recordation are distinct states.

---

# 198. Legal Review Flag

Canonical:

```text id="lic090"
recordation_required_review = true/false
```

rather than hardcoding assumptions across every license type.

---

# 199. License Documents

Potential:

```text id="lic091"
MAIN AGREEMENT
SCHEDULE A — ASSETS
SCHEDULE B — COMMERCIAL TERMS
AMENDMENTS
RENEWALS
TERMINATION NOTICE
```

---

# 200. Asset Schedule

Strongly recommended when multiple artworks are covered.

---

# 201. Amendment

Use amendment when changing:

```text id="lic092"
TERM
TERRITORY
PRODUCTS
ROYALTY
ASSETS
EXCLUSIVITY
```

without replacing entire agreement.

---

# 202. Amendment Version

Must preserve lineage.

---

# 203. Superseded Terms

Remain accessible historically.

---

# 204. License Data Model

Core entities:

```text id="lic093"
LICENSE
LICENSE ASSET
LICENSE SCOPE
LICENSE TERM
ROYALTY RULE
LICENSE AMENDMENT
LICENSE EVIDENCE
LICENSE RECORDATION
```

---

# 205. License Asset

Relationship:

```text id="lic094"
LICENSE
↔
IP ASSET
```

---

# 206. License Scope

Potential structured attributes:

```text id="lic095"
product_scope
channel_scope
territory
commercial_use
modification
sublicensing
exclusivity
```

---

# 207. Royalty Rule

References:

```text id="lic096"
LICENSE
CREATOR / LICENSOR
BASIS
RATE
EFFECTIVE DATES
```

---

# 208. License Amendment

References original License.

---

# 209. License Evidence

Signed documents/supporting proof.

---

# 210. License Recordation

Stores relevant government/administrative record information where applicable.

---

# 211. License Product Relationship

Potential:

```text id="lic097"
LICENSE
↔
PRODUCT
```

derived via asset relationships but materialized where operationally useful.

---

# 212. License Campaign Relationship

Potential:

```text id="lic098"
LICENSE
↔
CAMPAIGN
```

for limited campaign rights.

---

# 213. License Creator Relationship

```text id="lic099"
LICENSOR
↔
CREATOR
```

where creator is rights holder.

---

# 214. License Events

Potential:

```text id="lic100"
license.created
license.signed
license.activated
license.amended
license.expiring
license.expired
license.suspended
license.terminated
license.renewed
```

---

# 215. Royalty Events

Potential:

```text id="lic101"
royalty_rule.activated
earning.created
earning.reversed
earning.payable
```

---

# 216. Recordation Events

Potential:

```text id="lic102"
license_recordation.submitted
license_recordation.completed
license_recordation.rejected
```

---

# 217. MGBOS License Dashboard

Potential:

```text id="lic103"
ACTIVE LICENSES
EXPIRING 90 DAYS
EXPIRING 30 DAYS
SUSPENDED
MISSING ASSET SCHEDULE
RECORDATION REVIEW
```

---

# 218. Product Rights Dashboard

Potential:

```text id="lic104"
PRODUCT
ASSETS
LICENSES
CLEARANCE
EXPIRY
```

---

# 219. Creator Licensing View

Potential:

```text id="lic105"
CREATOR
ACTIVE LICENSES
PRODUCTS
ROYALTY RULES
EARNINGS
```

---

# 220. License Economics Dashboard

Potential:

```text id="lic106"
NET SALES
ROYALTIES
CONTRIBUTION
MG / ADVANCE
RECOVERY
```

---

# 221. Automation Opportunities

Safe candidates:

```text id="lic107"
EXPIRY REMINDER
SCOPE VALIDATION
MISSING DOCUMENT CHECK
ROYALTY CALCULATION
STATEMENT GENERATION
```

---

# 222. License Scope Automation

System can deterministically check:

```text id="lic108"
PRODUCT TYPE
CHANNEL
TERRITORY
DATE
```

against structured license scope.

---

# 223. Royalty Automation

Canonical:

```text id="lic109"
ELIGIBLE ORDER ITEM
+
ROYALTY RULE VERSION
=
PENDING EARNING
```

---

# 224. Royalty Calculation Should Be Deterministic

Do not use AI to calculate contractual royalty where formula is explicit.

---

# 225. Statement Generation

Can be automated from Earnings Ledger.

---

# 226. Renewal Reminder

Event-driven/scheduled.

---

# 227. License Impact Analysis

On expiry:

```text id="lic110"
LICENSE
→ ASSETS
→ PRODUCTS
→ LISTINGS
→ INVENTORY
→ CAMPAIGNS
```

---

# 228. AI Role

AI may assist:

```text id="lic111"
CONTRACT SUMMARY
CLAUSE EXTRACTION
ASSET SCHEDULE EXTRACTION
TERM EXTRACTION
DIFFERENCE COMPARISON
```

---

# 229. AI Contract Extraction Boundary

Extracted values remain:

```text id="lic112"
PROPOSED
```

until validated.

---

# 230. AI May Flag

Potential:

```text id="lic113"
NO TERRITORY
NO TERM
AMBIGUOUS ROYALTY BASE
NO SELL-OFF
```

---

# 231. AI Does Not Approve License

Canonical.

---

# 232. AI Does Not Determine Ownership

Canonical.

---

# 233. AI Does Not Rewrite Commercial Terms

Without authorized negotiation/approval.

---

# 234. License Negotiation Support

AI may generate comparison:

```text id="lic114"
CURRENT TERMS
PROPOSED TERMS
ECONOMIC IMPACT
RISK QUESTIONS
```

---

# 235. Licensing Decision Framework

Before signing:

```text id="lic115"
RIGHTS VALID?
SCOPE SUFFICIENT?
TERM SUFFICIENT?
ECONOMICS WORK?
EXCLUSIVITY JUSTIFIED?
POST-TERM CLEAR?
OPERATIONS CAN TRACK IT?
```

---

# 236. Licensing Economics Gate

Estimate:

```text id="lic116"
EXPECTED SALES
-
COGS
-
CHANNEL COST
-
ROYALTY
-
OTHER VARIABLE COST
=
CONTRIBUTION
```

---

# 237. Minimum Guarantee Gate

Run downside case.

---

# 238. Exclusivity Gate

Require strategic justification.

---

# 239. Complexity Gate

Avoid complex royalty structure unless value exceeds:

```text id="lic117"
ACCOUNTING
SYSTEM
DISPUTE
ADMINISTRATION
```

burden.

---

# 240. Creator Experience Principle

Canonical:

> **Creator economics should be understandable by the creator without requiring TeeStock's internal accounting knowledge.**

---

# 241. TeeStock Economics Principle

Canonical:

> **Creator transparency does not require exposing TeeStock's confidential internal costs unless contractually required.**

---

# 242. Licensing Failure Modes

## Asset Not Listed

Unclear coverage.

## “Commercial Use” Only

Scope too vague.

## No Term

Expiry ambiguity.

## No Territory

Geographic ambiguity.

## No Product Scope

Merchandise expansion ambiguity.

## No Royalty Base Definition

Financial disputes.

---

# 243. Operational Failure Modes

## Agreement in Google Drive Only

No system enforcement.

## Expiry in Someone's Calendar

Single-point failure.

## Product Not Linked to License

No impact analysis.

## Royalty in Spreadsheet Only

Weak traceability.

## License Expires but Ads Continue

Rights leak.

---

# 244. Strategic Failure Modes

## Exclusive Everything

Unnecessary cost.

## Perpetual Everything

Overbuying rights.

## Too-Narrow Rights

Repeated renegotiation.

## Complex Royalty for Small Collaboration

Administrative drag.

---

# 245. Creator Failure Modes

## Creator Does Not Understand Basis

Trust failure.

## Returns Not Defined

Payout dispute.

## Collaboration Ends, Inventory Unclear

Operational conflict.

## Royalty Rule Changed Retroactively

Trust and financial-control failure.

---

# 246. AI Failure Modes

## AI Summarizes Wrong Term

Operational error.

## Extracted Clause Auto-Writes Canonical State

Governance failure.

## Model Calculates Royalty

Unnecessary probabilistic risk.

---

# 247. What Design Licensing Policy Must Not Become

## Legal Complexity for Every Small Asset

Controls should be proportional.

## One Template for Every Relationship

Commercial models differ.

## Creator Exploitation Mechanism

Rights and economics should be transparent.

## Spreadsheet Royalty Company

Transactions should become traceable.

## AI Contract Judge

Material terms require governed review.

---

# 248. V1 License Requirements

Every material creative license should capture:

```text id="lic118"
LICENSOR
LICENSEE
ASSET
RIGHTS
PRODUCT SCOPE
CHANNEL
TERRITORY
TERM
EXCLUSIVITY
MODIFICATION
COMPENSATION
TERMINATION
```

---

# 249. V1 Royalty Requirements

Capture:

```text id="lic119"
BASIS
RATE
ELIGIBILITY
RETURN TREATMENT
PAYMENT SCHEDULE
```

---

# 250. V1 System

Can initially use:

```text id="lic120"
SIGNED AGREEMENT
+
MGBOS LICENSE RECORD
+
ARTWORK LINK
+
ROYALTY RULE
```

---

# 251. V1 Clearance

Human validates license data before status becomes:

```text id="lic121"
ACTIVE
```

---

# 252. V1 Expiry Monitoring

Automated reminders strongly recommended.

---

# 253. V1 Sell-Off

Must be explicitly documented for material inventory-bearing licensed products.

---

# 254. V1 Recordation Review

Flag agreements requiring legal/admin review for possible official license recordation.

---

# 255. V1 Avoid

Do not immediately build:

```text id="lic122"
ADVANCED LICENSING MARKETPLACE
AUTOMATED CONTRACT NEGOTIATION
BLOCKCHAIN ROYALTY
DYNAMIC ROYALTY ENGINE
MULTI-JURISDICTION LICENSE PLATFORM
```

---

# 256. V2 Expansion

Potential:

```text id="lic123"
RIGHTS SCOPE ENGINE
LICENSE IMPACT GRAPH
ROYALTY AUTOMATION
CREATOR STATEMENTS
```

---

# 257. V3 Expansion

Potential:

```text id="lic124"
RECORDATION WORKFLOW
AI CONTRACT EXTRACTION
AUTOMATED RENEWAL REVIEW
```

---

# 258. V4 Expansion

Potential:

```text id="lic125"
MULTI-TERRITORY LICENSING
ADVANCED LICENSE ECONOMICS
PORTFOLIO OPTIMIZATION
```

---

# 259. License Activation Gate

Canonical:

```text id="lic126"
SIGNED TERMS
+
IDENTIFIED ASSETS
+
VALID LICENSOR
+
STRUCTURED SCOPE
+
COMMERCIAL TERMS
+
REVIEW
=
ACTIVE
```

---

# 260. Product Activation Gate

```text id="lic127"
ACTIVE LICENSE
+
PRODUCT WITHIN SCOPE
+
CHANNEL WITHIN SCOPE
+
TERRITORY WITHIN SCOPE
+
DATE WITHIN TERM
```

---

# 261. Royalty Activation Gate

```text id="lic128"
ACTIVE LICENSE
+
VALID ROYALTY RULE
+
ATTRIBUTION LINK
```

---

# 262. Earning Gate

```text id="lic129"
ELIGIBLE TRANSACTION
+
RULE VERSION
+
VALID LICENSE CONTEXT
=
EARNING
```

---

# 263. Renewal Gate

```text id="lic130"
RIGHTS STILL NEEDED
+
ECONOMICS ACCEPTABLE
+
RELATIONSHIP ACCEPTABLE
+
UPDATED TERMS
```

---

# 264. Termination Gate

Before closure verify:

```text id="lic131"
OPEN ORDERS
INVENTORY
SELL-OFF
EARNINGS
MARKETING
FILES
```

---

# 265. License Success Definition

The policy succeeds when TeeStock can answer:

```text id="lic132"
WHO
licensed this work?

DID THEY
have authority?

WHAT ASSET
is covered?

WHAT MAY
TEEStock do?

WHAT PRODUCTS
are permitted?

WHICH CHANNELS?

WHICH TERRITORY?

FOR HOW LONG?

IS IT EXCLUSIVE?

MAY IT BE MODIFIED?

MAY PARTNERS
produce it?

HOW IS
THE LICENSOR PAID?

WHAT HAPPENS
ON RETURN?

WHAT HAPPENS
WHEN THE LICENSE ENDS?

CAN EXISTING STOCK
still be sold?

WHICH PRODUCTS
depend on this license?

CAN MGBOS
stop use automatically when scope becomes invalid?
```

---

# 266. Canonical Design Licensing Summary

```text id="lic133"
IP ASSET
defines the work.

LICENSOR
defines who grants rights.

LICENSE
defines permitted use.

SCOPE
defines where and how.

TERM
defines when.

EXCLUSIVITY
defines competitive restriction.

ROYALTY RULE
defines economic participation.

PRODUCT LINK
connects rights to commerce.

EARNING
connects commerce to creator economics.

SELL-OFF
defines post-term inventory treatment.

MGBOS
enforces operational rights.
```

---

# 267. Canonical Design Licensing Principles

```text id="lic134"
LICENSE THE EXACT RIGHTS THE BUSINESS NEEDS.

NO ASSET IDENTIFICATION, NO RELIABLE LICENSE.

OWNERSHIP IS NOT LICENSE.

LICENSE IS NOT ASSIGNMENT.

LICENSOR MUST HAVE AUTHORITY TO GRANT RIGHTS.

COMMERCIAL USE MUST FIT THE AGREED SCOPE.

PRODUCT, CHANNEL, TERRITORY, AND TERM SHOULD BE EXPLICIT.

EXCLUSIVITY MUST HAVE BOUNDARIES.

DO NOT BUY BROAD EXCLUSIVITY WITHOUT STRATEGIC VALUE.

MODIFICATION RIGHTS SHOULD BE CLEAR.

PRODUCTION PARTNER ACCESS SHOULD BE LIMITED TO EXECUTION NEED.

ROYALTY BASIS MUST BE MATHEMATICALLY UNAMBIGUOUS.

HISTORICAL SALES RETAIN HISTORICAL ROYALTY RULES.

RETURNS AND REFUNDS MUST HAVE DEFINED ROYALTY TREATMENT.

SELL-OFF RIGHTS MUST NEVER BE ASSUMED.

EXPIRY MUST TRIGGER OPERATIONAL ACTION.

ROYALTY CALCULATION SHOULD BE DETERMINISTIC.

AI MAY EXTRACT AND SUMMARIZE TERMS. HUMANS VALIDATE MATERIAL RIGHTS.

LICENSES SHOULD EXIST AS STRUCTURED BUSINESS DATA, NOT JUST SIGNED PDFs.

MGBOS SHOULD KNOW WHICH PRODUCTS DEPEND ON WHICH RIGHTS.
```

---

# 268. Dependency

Dokumen berikut harus follow Design Licensing Policy:

1. `12-legal-ip/creator-agreement-framework.md`
2. `12-legal-ip/trademark-framework.md`
3. `12-legal-ip/customer-commerce-policy.md`
4. `13-metrics-experiments/kpi-framework.md`
5. `13-metrics-experiments/decision-thresholds.md`
6. `14-roadmap/master-roadmap.md`
7. `14-roadmap/capability-roadmap.md`

TeeStock Design Licensing Policy boleh berkembang dari structured creator/artwork licensing menjadi automated royalty ledger, license portfolio management, official recordation workflows, multi-territory rights management, dan AI-assisted licensing administration, tetapi scale hanya boleh meningkat dengan mempertahankan clear licensor authority, explicit asset scope, precise commercial rights, historical royalty integrity, expiry controls, post-termination rules, and auditable Product → License → Transaction → Earning lineage.