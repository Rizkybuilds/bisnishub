---
title: "TeeStock Website Information Architecture"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/product-tech
document_id: "TS-TEC-002"
version: "1.0"
category: "product-tech"
business: "teestock"
last_updated: "2026-09-28"
path: "10-product-tech/website-information-architecture.md"
depends_on:
  - "TS-TEC-001"
  - "TS-BRD-001"
  - "TS-BRD-002"
  - "TS-BRD-003"
  - "TS-BRD-004"
  - "TS-COM-001"
  - "TS-COM-004"
  - "TS-COM-005"
  - "TS-SVC-001"
  - "TS-ORG-001"
  - "TS-PRG-001"
  - "TS-MKT-001"
  - "TS-MKT-002"
  - "TS-MKT-003"
  - "TS-MKT-004"
---


# TeeStock Website Information Architecture v1.0

> [!abstract] **Canonical TeeStock Public Website, Navigation, Content Hierarchy & User-Routing Framework  **
> Dokumen ini mendefinisikan sitemap, navigation, homepage architecture, Shop, Custom, Business, Merch, Originals, services, programs, account, support, SEO structure, landing-page templates, content hierarchy, URL principles, search, filters, and progressive website evolution untuk TeeStock.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/10-product-tech/digital-product-vision|TS-TEC-001: TeeStock Digital Product Vision]] • [[bisnis/teestock/02-brand/master-brand-strategy|TS-BRD-001: TeeStock Master Brand Strategy]] • [[bisnis/teestock/02-brand/brand-architecture|TS-BRD-002: TeeStock Brand Architecture]] • [[bisnis/teestock/02-brand/brand-identity-system|TS-BRD-003: TeeStock Brand Identity System]] • [[bisnis/teestock/02-brand/voice-and-copy-system|TS-BRD-004: TeeStock Voice & Copy System]] • [[bisnis/teestock/03-commerce/commerce-overview|TS-COM-001: TeeStock Commerce Overview]] • [[bisnis/teestock/03-commerce/catalog-merchandising-system|TS-COM-004: TeeStock Catalog & Merchandising System]] • [[bisnis/teestock/03-commerce/product-taxonomy|TS-COM-005: TeeStock Product Taxonomy]] • [[bisnis/teestock/04-services/services-overview|TS-SVC-001: TeeStock Services Overview]] • [[bisnis/teestock/05-originals/originals-master-plan|TS-ORG-001: TeeStock Originals Master Plan]] • [[bisnis/teestock/06-programs/programs-overview|TS-PRG-001: TeeStock Programs Overview]] • [[bisnis/teestock/09-marketing/go-to-market|TS-MKT-001: TeeStock Go-To-Market Strategy]] • [[bisnis/teestock/09-marketing/audience-segmentation|TS-MKT-002: TeeStock Audience Segmentation]] • [[bisnis/teestock/09-marketing/content-engine|TS-MKT-003: TeeStock Content Engine]] • [[bisnis/teestock/09-marketing/channel-strategy|TS-MKT-004: TeeStock Channel Strategy]]


---

# 1. Purpose

Website Information Architecture menjawab:

> **Bagaimana seluruh ecosystem TeeStock diterjemahkan menjadi website yang mudah dipahami, ditemukan, dinavigasi, dan digunakan tanpa memaksa customer memahami struktur internal bisnis TeeStock?**

Canonical principle:

> **Expose customer jobs. Hide organizational complexity.**

---

# 2. Canonical Definition

> **TeeStock Website Information Architecture adalah struktur canonical untuk mengorganisasi halaman, navigation, content, user journeys, product discovery, service discovery, programs, account, dan support berdasarkan customer jobs serta commercial intent sehingga website TeeStock tetap sederhana di permukaan namun mampu berkembang bersama kompleksitas ecosystem di belakangnya.**

---

# 3. Website Is a Router

Canonical:

```text
VISITOR
↓
UNDERSTAND TEEStock
↓
IDENTIFY THEIR JOB
↓
ENTER RELEVANT PATH
↓
TAKE ACTION
```

---

# 4. Homepage Is Not the Entire Business

Homepage should not attempt to explain:

```text
COMMERCE
SERVICES
ORIGINALS
PROGRAMS
OPERATIONS
MGBOS
```

in organizational language.

It should answer:

```text
WHAT IS TEEStock?
WHAT CAN I DO HERE?
WHY SHOULD I TRUST IT?
WHERE SHOULD I GO NEXT?
```

---

# 5. Public Architecture Principle

Canonical:

> **Internal architecture organizes the business. External architecture organizes customer intent.**

---

# 6. Primary Jobs

TeeStock public website should initially optimize around:

```text
SHOP
CUSTOMIZE
FOR BUSINESS
BUILD MERCH
```

---

# 7. Why Four Primary Jobs

They map closely to distinct customer intents:

```text
SHOP
I want to buy apparel.

CUSTOMIZE
I want to make apparel.

FOR BUSINESS
My organization needs apparel / merchandise.

BUILD MERCH
I have an audience / brand / community and want merch.
```

---

# 8. Secondary Jobs

Potential:

```text
LEARN
WORK WITH TEEStock
GET SUPPORT
MANAGE MY ACCOUNT
```

---

# 9. Information Architecture Layers

Canonical:

```text
L0 — GLOBAL NAVIGATION
L1 — PRIMARY EXPERIENCE
L2 — CATEGORY / SERVICE
L3 — PRODUCT / OFFER
L4 — TRANSACTION / ACTION
```

---

# 10. Proposed Public Sitemap

```text
TEEStock.id

├── Home
│
├── Shop
│   ├── New
│   ├── Selects
│   ├── Essentials
│   ├── Originals
│   ├── Collections
│   ├── Categories
│   └── Search
│
├── Customize
│   ├── Custom Overview
│   ├── Choose Product
│   ├── How It Works
│   ├── Printing / Decoration
│   ├── FAQ
│   └── Start Custom Order
│
├── For Business
│   ├── Business Overview
│   ├── Uniform & Team Apparel
│   ├── Event & Promotional Merch
│   ├── Corporate Merchandise
│   ├── Case Studies
│   ├── Process
│   └── Request Quote
│
├── Build Merch
│   ├── Merch Overview
│   ├── For Creators
│   ├── For Communities
│   ├── How It Works
│   ├── Case Studies
│   └── Start a Merch Project
│
├── Originals
│   ├── Originals Overview
│   ├── Collections
│   └── Labels
│
├── Learn
│   ├── Apparel Guides
│   ├── Custom Guides
│   ├── Business Merch Guides
│   └── Stories / Journal
│
├── Work With Us
│   ├── Creator Program
│   ├── Reseller Program
│   ├── Affiliate Program
│   └── Partner Program
│
├── Support
│   ├── Help Center
│   ├── Order Tracking
│   ├── Shipping
│   ├── Returns
│   ├── Size Guide
│   ├── Contact
│   └── FAQ
│
├── Account
│   ├── Profile
│   ├── Orders
│   ├── Tracking
│   ├── Returns
│   └── Reorder
│
├── Cart
└── Checkout
```

---

# 11. Global Navigation

Recommended V1 desktop navigation:

```text
SHOP
CUSTOM
FOR BUSINESS
BUILD MERCH
```

with utility navigation for:

```text
SEARCH
ACCOUNT
CART
```

---

# 12. Do Not Put Everything in Main Navigation

Avoid:

```text
SHOP
CUSTOM
BUSINESS
MERCH
STUDIO
SUPPLY
FULFILL
ORIGINALS
CREATOR
RESELLER
AFFILIATE
PARTNER
```

all with equal prominence.

---

# 13. Navigation Hierarchy

Canonical:

```text
PRIMARY NAV
high-frequency customer jobs.

SECONDARY NAV
important but lower-frequency routes.

FOOTER
full ecosystem / support / corporate access.
```

---

# 14. Mobile Navigation

Mobile should preserve the same conceptual hierarchy.

Do not create an entirely different information architecture.

---

# 15. Homepage Role

Homepage should perform five jobs:

```text
1. EXPLAIN
2. ROUTE
3. PROVE
4. INSPIRE
5. CONVERT
```

---

# 16. Homepage Section Architecture

Recommended conceptual flow:

```text
HERO
↓
PRIMARY JOB ROUTING
↓
FEATURED PRODUCTS / COLLECTIONS
↓
CUSTOM / BUSINESS / MERCH PROOF
↓
WHY TEEStock
↓
CREATOR / COMMUNITY
↓
CONTENT / EDUCATION
↓
FINAL CTA
```

---

# 17. Homepage Hero

Hero should answer rapidly:

```text
WHAT IS TEEStock?
WHAT CAN I DO?
```

Possible conceptual direction:

> Apparel untuk beli, bikin, dan bangun merchandise.

Exact final copy belongs to execution.

---

# 18. Homepage Primary CTA

Prefer limited CTAs.

Potential:

```text
SHOP NOW
START CUSTOM
```

with secondary routing to Business/Merch.

---

# 19. Homepage Personalization

Not required initially.

Clear static routing is sufficient.

---

# 20. Homepage Should Not Become Portal Dashboard

Anonymous visitor needs orientation, not internal complexity.

---

# 21. Shop Architecture

Canonical:

```text
SHOP
├── SELECTS
├── ESSENTIALS
└── ORIGINALS PRODUCTS
```

---

# 22. Originals Structural Note

Originals is organizationally separate from Commerce.

But customer can still discover/buy Originals through Shop.

---

# 23. Customer-Facing Product Sources

Potential presentation:

```text
SELECTS
ESSENTIALS
ORIGINALS
COLLABORATIONS
```

without exposing internal ownership taxonomy unless useful.

---

# 24. Shop Landing Page

Should support:

```text
DISCOVERY
CATEGORY ENTRY
COLLECTION ENTRY
PRODUCT SEARCH
```

---

# 25. Shop Taxonomy

Customer-facing categories may include:

```text
T-SHIRTS
TOPS
OUTERWEAR
ACCESSORIES
```

as assortment grows.

---

# 26. Category ≠ Business Line

Canonical:

```text
CATEGORY
describes what the product is.

COMMERCE LINE
describes TeeStock's business relationship to it.
```

---

# 27. Product Family Hierarchy

Customer-facing:

```text
CATEGORY
↓
PRODUCT
↓
VARIANT
```

while internal model may include:

```text
GARMENT PLATFORM
DESIGN
APPLICATION
SKU
```

---

# 28. Product Listing Page

Should prioritize:

```text
PRODUCT IMAGE
NAME
PRICE
VARIANTS
AVAILABILITY
RELEVANCE
```

---

# 29. Product Filters

Potential:

```text
CATEGORY
SIZE
COLOR
FIT
PRICE
COLLECTION
```

Add only when assortment justifies them.

---

# 30. Filter Principle

Canonical:

> **Do not create filters that return almost identical product sets.**

---

# 31. Product Sorting

Potential:

```text
FEATURED
NEWEST
PRICE
POPULAR
```

---

# 32. Default Sorting

Should be merchandising-driven, not random database order.

---

# 33. Search

Search should support:

```text
PRODUCT
COLLECTION
LABEL
DESIGN
CATEGORY
```

where data exists.

---

# 34. Search Results

Should gracefully handle:

```text
TYPO
NO RESULT
RELATED PRODUCT
```

as system matures.

---

# 35. Product Detail Page

Canonical information hierarchy:

```text
1. PRODUCT VISUAL
2. PRODUCT NAME / PRICE
3. VARIANT SELECTION
4. PRIMARY CTA
5. FIT / MATERIAL / PRODUCT INFO
6. DELIVERY / AVAILABILITY
7. STORY / DESIGN CONTEXT
8. CARE
9. RECOMMENDATIONS
```

---

# 36. Product Truth Before Story

Canonical:

> **Never make customers search through storytelling to find material, size, or price.**

---

# 37. Product Story

Useful for:

```text
SELECTS
ORIGINALS
COLLABORATIONS
```

where story adds value.

---

# 38. Essentials PDP

Should prioritize:

```text
FIT
MATERIAL
WEIGHT
COLOR
CARE
```

---

# 39. Selects PDP

Should additionally support:

```text
ARTWORK
CREATOR
DESIGN STORY
```

where relevant.

---

# 40. Originals PDP

Can include:

```text
LABEL
COLLECTION
WORLD / STORY
```

without sacrificing commerce clarity.

---

# 41. Collaboration PDP

Should clearly identify collaborators and relationship.

---

# 42. Size Guide

Should be accessible from product context.

Not hidden solely in footer.

---

# 43. Product Availability

Customer sees simplified status:

```text
IN STOCK
LOW STOCK
MADE TO ORDER
PREORDER
SOLD OUT
```

as applicable.

---

# 44. Internal Inventory States Stay Internal

Do not expose:

```text
ALLOCATED
QC_HOLD
QUARANTINE
```

to normal storefront users.

---

# 45. Collections Architecture

Canonical:

```text
COLLECTION PAGE
↓
STORY / CONCEPT
↓
PRODUCTS
```

---

# 46. Collection Landing Page

Can provide stronger editorial presentation than standard category.

---

# 47. Selects Curated Edits

Can use landing pages such as:

```text
STAFF PICKS
GRAPHIC EDIT
CREATOR PICKS
```

without creating permanent taxonomy.

---

# 48. Originals Architecture

Public Originals section:

```text
ORIGINALS
├── ABOUT
├── COLLECTIONS
└── LABELS
```

---

# 49. Originals Overview

Should explain:

> TeeStock's internally created concepts, collections, and labels.

---

# 50. Label Page

Future label page may include:

```text
IDENTITY
STORY
COLLECTIONS
PRODUCTS
CONTENT
```

---

# 51. Label Navigation

Independent labels do not need top-level global navigation until sufficiently important.

---

# 52. Label Autonomy and URLs

Potential evolution:

```text
teestock.id/originals/label-name
```

then later:

```text
label.teestock.id
```

or independent domain only after autonomy is earned.

---

# 53. Custom Architecture

Primary URL concept:

```text
/custom
```

---

# 54. Custom Overview

Should answer:

```text
WHAT CAN I CUSTOMIZE?
HOW DOES IT WORK?
WHAT QUANTITY?
WHAT METHODS?
HOW LONG?
HOW DO I START?
```

---

# 55. Custom Page Structure

Recommended:

```text
HERO
↓
PRODUCT OPTIONS
↓
HOW IT WORKS
↓
PRINT / DECORATION OPTIONS
↓
PROOF / EXAMPLES
↓
FAQ
↓
START CUSTOM
```

---

# 56. Custom Product Selection

V1 can begin with curated product/platform options.

---

# 57. Avoid Overwhelming Choices

Do not show all supplier blanks.

Show TeeStock-approved options.

---

# 58. Custom CTA

Canonical:

```text
START CUSTOM ORDER
```

or equivalent.

---

# 59. Custom Intake

Structured form should capture:

```text
PRODUCT
QTY
NEED
DEADLINE
ARTWORK
CONTACT
```

as appropriate.

---

# 60. Custom vs Business Routing

If inquiry indicates:

```text
ORGANIZATION
LARGE QTY
FORMAL PROJECT
RECURRING NEED
```

route toward Business flow.

---

# 61. Business Architecture

Primary:

```text
/business
```

---

# 62. Business Overview

Should answer:

```text
WHO WE HELP
WHAT WE MAKE
HOW IT WORKS
WHY TEEStock
WHAT HAPPENS NEXT
```

---

# 63. Business Subpages

Potential:

```text
/business/uniform
/business/event-merch
/business/corporate-merch
```

only when search/commercial demand justifies dedicated pages.

---

# 64. Avoid Services Menu Dump

Business customer cares about outcome.

Not internal service architecture.

---

# 65. Business Offer Mapping

Behind one Business route TeeStock may orchestrate:

```text
STUDIO
SUPPLY
CUSTOM
PRODUCTION
FULFILL
```

without customer navigating each capability.

---

# 66. Business Proof

High-value components:

```text
CASE STUDIES
PROCESS
CLIENT EXAMPLES
MATERIAL OPTIONS
REORDER CAPABILITY
```

---

# 67. Business CTA

Primary:

```text
REQUEST QUOTE
```

or:

```text
DISCUSS PROJECT
```

---

# 68. B2B Lead Form

Ask only information useful for qualification.

Potential:

```text
ORGANIZATION
NEED
QTY
DEADLINE
BUDGET RANGE if appropriate
CONTACT
```

---

# 69. Build Merch Architecture

Primary:

```text
/merch
```

---

# 70. Merch Overview

Should answer:

```text
WHO IT IS FOR
WHAT TEEStock HANDLES
HOW MONEY WORKS
HOW WE LAUNCH
```

at appropriate detail.

---

# 71. Merch Audiences

Potential sections:

```text
CREATORS
COMMUNITIES
BRANDS
```

---

# 72. Merch Positioning

Publicly focus on outcome:

> Build merchandise without building the entire merchandise operation yourself.

---

# 73. Merch Flow

Potential:

```text
APPLY / TALK
↓
PILOT
↓
PRODUCT
↓
LAUNCH
↓
OPERATE
```

---

# 74. Merch CTA

Potential:

```text
START A MERCH PROJECT
```

---

# 75. Studio Visibility

TeeStock Studio should not necessarily be top-level nav.

---

# 76. Studio Discovery

Can appear through:

```text
CUSTOM
BUSINESS
MERCH
FOOTER / SERVICES
SEO LANDING PAGE
```

---

# 77. Supply Visibility

Supply can be lower-navigation/targeted page:

```text
/supply
```

when activated.

---

# 78. Fulfill Visibility

Similarly:

```text
/fulfill
```

primarily for B2B targeted acquisition once service is proven.

---

# 79. Services Overview

Optional route:

```text
/services
```

can summarize capabilities without competing with primary job navigation.

---

# 80. Services Overview Role

Useful for:

- corporate visitors,
- search,
- ecosystem explanation.

Not required as primary homepage path.

---

# 81. Programs Architecture

Potential:

```text
/work-with-us
├── creators
├── resellers
├── affiliates
└── partners
```

---

# 82. Programs Are Participation Paths

Do not mix Programs into normal customer purchasing navigation.

---

# 83. Creator Program Page

Should explain:

```text
WHO CAN JOIN
WAYS TO WORK TOGETHER
RIGHTS / ECONOMICS OVERVIEW
APPLICATION
```

---

# 84. Reseller Page

Should explain:

```text
PRODUCT ACCESS
COMMERCIAL MODEL
ELIGIBILITY
APPLICATION
```

---

# 85. Affiliate Page

Should explain:

```text
HOW REFERRAL WORKS
COMMISSION MODEL
RULES
APPLICATION
```

---

# 86. Partner Page

Should target operational businesses.

Explain:

```text
CAPABILITY NEED
QUALITY EXPECTATION
ONBOARDING
```

---

# 87. Program Pages Should Filter

Not every visitor should automatically become approved participant.

---

# 88. Learn Architecture

Potential:

```text
/learn
```

or:

```text
/journal
```

depending brand direction.

---

# 89. Learn Role

Supports:

```text
SEARCH
EDUCATION
TRUST
CONTENT DISCOVERY
```

---

# 90. Content Categories

Potential:

```text
APPAREL
CUSTOM
BUSINESS
MERCH
STORIES
```

---

# 91. Avoid Content Taxonomy Explosion

Start broad.

Create topic clusters as content volume grows.

---

# 92. Content Detail Page

Should naturally connect to:

```text
RELATED CONTENT
RELATED PRODUCT
RELATED SERVICE
```

without aggressive selling.

---

# 93. SEO Architecture

Canonical:

```text
SEARCH INTENT
↓
DEDICATED USEFUL PAGE
↓
RELEVANT OFFER
```

---

# 94. SEO Page Types

Potential:

```text
CATEGORY
PRODUCT
SERVICE
GUIDE
CASE STUDY
COLLECTION
```

---

# 95. Avoid SEO Doorway Pages

Do not create hundreds of nearly identical location/keyword pages with little unique value.

---

# 96. Search Intent vs Site Structure

Create permanent route only if intent is:

```text
RECURRING
MATERIAL
RELEVANT
```

---

# 97. Geographic SEO

Can later support meaningful local service pages if TeeStock actually operates differently in those markets.

---

# 98. URL Principles

Canonical:

```text
SHORT
HUMAN
STABLE
DESCRIPTIVE
```

---

# 99. Example URLs

```text
/shop
/shop/selects
/shop/essentials
/originals
/custom
/business
/merch
/learn
/support
```

---

# 100. Product URL

Potential:

```text
/products/{product-slug}
```

or under Shop architecture.

Choose one canonical pattern and keep stable.

---

# 101. Collection URL

Potential:

```text
/collections/{collection-slug}
```

---

# 102. Label URL

Potential:

```text
/originals/{label-slug}
```

or equivalent.

---

# 103. URL Should Not Mirror Internal Database

Avoid:

```text
/business-unit/commerce-line/product-family/...
```

---

# 104. Breadcrumb

Useful for:

```text
SHOP
CONTENT
DEEP CATEGORY
```

---

# 105. Breadcrumb Example

```text
Shop
→ Selects
→ Graphic Tee
→ Product
```

---

# 106. Search Engine Crawlability

Core public content should remain indexable where appropriate.

---

# 107. Internal Portal URLs

Account/portal areas may not need search indexing.

---

# 108. Account Architecture

Potential:

```text
/account
├── profile
├── orders
├── returns
├── addresses
└── preferences
```

---

# 109. Business Account Architecture

Future:

```text
/account/business
├── dashboard
├── quotes
├── orders
├── projects
├── invoices
└── reorder
```

---

# 110. Role-Aware Account

One identity can surface different modules.

---

# 111. Do Not Create Separate Login Systems

Avoid:

```text
CUSTOMER LOGIN
CREATOR LOGIN
BUSINESS LOGIN
```

with duplicated identity unless technically necessary.

---

# 112. Account Navigation

Show only role-relevant modules.

---

# 113. Guest Order Tracking

Potential:

```text
/tracking
```

without forcing account creation.

---

# 114. Support Architecture

Canonical:

```text
/support
├── order-tracking
├── shipping
├── returns
├── size-guide
├── custom-help
├── payment
└── contact
```

---

# 115. Help Center

Should answer frequent issues before customer contacts support.

---

# 116. Self-Service Before Contact

Where reliable:

```text
TRACK
RETURN REQUEST
ORDER INFO
```

should be self-service.

---

# 117. Human Support Remains Visible

Do not create chatbot wall.

---

# 118. Contact Page

Should route intent:

```text
ORDER HELP
CUSTOM
BUSINESS
MERCH
PROGRAMS
GENERAL
```

---

# 119. Support Search

Future Help Center should support search.

---

# 120. FAQ

FAQs belong close to relevant context.

Do not place all FAQ only on one giant page.

---

# 121. Contextual FAQ

Examples:

```text
PRODUCT PAGE
size / shipping.

CUSTOM PAGE
MOQ / artwork / production.

BUSINESS PAGE
lead time / quote / payment.
```

---

# 122. Footer Architecture

Footer can expose broader ecosystem.

Recommended groups:

```text
SHOP
SERVICES
WORK WITH US
HELP
TEEStock
LEGAL
```

---

# 123. Footer — Shop

Potential:

```text
Selects
Essentials
Originals
Collections
```

---

# 124. Footer — Services

Potential:

```text
Custom
Business
Merch
Studio
Supply
Fulfill
```

subject to activation.

---

# 125. Footer — Work With Us

```text
Creator
Reseller
Affiliate
Partner
```

---

# 126. Footer — Help

```text
Order Tracking
Shipping
Returns
Size Guide
Contact
```

---

# 127. Footer — TeeStock

Potential:

```text
About
Journal / Learn
Careers if relevant
```

---

# 128. Footer — Legal

Potential:

```text
Privacy
Terms
Commerce Policy
IP / Copyright
```

---

# 129. Activation Awareness

Canonical:

> **Defined pages do not all need to be publicly active immediately.**

---

# 130. Page Lifecycle

Potential:

```text
PLANNED
DRAFT
LIVE
HIDDEN
ARCHIVED
REDIRECTED
```

---

# 131. Service Activation

If Fulfill is not ready for external sale:

do not market it aggressively merely because architecture defines it.

---

# 132. Navigation Must Reflect Active Business

Canonical:

```text
ARCHITECTURE
can anticipate future.

NAVIGATION
should represent current reality.
```

---

# 133. Landing Page System

TeeStock should use reusable landing-page patterns.

---

# 134. Product Landing Template

Structure:

```text
VALUE
PRODUCT
PROOF
DETAIL
CTA
```

---

# 135. Service Landing Template

Structure:

```text
PROBLEM
OUTCOME
HOW IT WORKS
PROOF
FAQ
CTA
```

---

# 136. Campaign Landing Template

Structure:

```text
CAMPAIGN IDEA
OFFER
PRODUCT
URGENCY if genuine
PROOF
CTA
```

---

# 137. Creator / Program Landing Template

Structure:

```text
WHY JOIN
HOW IT WORKS
ECONOMICS / VALUE
ELIGIBILITY
PROOF
APPLY
```

---

# 138. Collection Landing Template

Structure:

```text
CONCEPT
VISUAL WORLD
PRODUCTS
CONTENT
```

---

# 139. Case Study Template

Structure:

```text
CONTEXT
PROBLEM
SOLUTION
PROCESS
RESULT
CTA
```

---

# 140. Landing Page Principle

One page should support one dominant commercial intent.

---

# 141. CTA Architecture

Canonical CTA hierarchy:

```text
PRIMARY ACTION
SECONDARY LEARN
```

---

# 142. Avoid CTA Overload

Do not give 8 equal actions.

---

# 143. Commerce CTA

```text
ADD TO CART
BUY
```

---

# 144. Custom CTA

```text
START CUSTOM
```

---

# 145. Business CTA

```text
REQUEST QUOTE
```

---

# 146. Merch CTA

```text
START MERCH PROJECT
```

---

# 147. Program CTA

```text
APPLY
```

---

# 148. Support CTA

```text
GET HELP
```

---

# 149. Information Scent

Links should clearly indicate what user will find.

Avoid vague:

```text
EXPLORE MORE
LEARN MORE
```

everywhere.

---

# 150. Search vs Navigation

Navigation supports known high-priority routes.

Search supports long-tail discovery.

---

# 151. Internal Search Analytics

Useful signal:

```text
WHAT USERS SEARCH
NO-RESULT QUERIES
```

---

# 152. Zero-Result Search

Can reveal:

- missing products,
- content gaps,
- vocabulary mismatch.

---

# 153. Merchandising Surfaces

Potential:

```text
FEATURED
NEW
TRENDING
STAFF PICKS
RELATED
RECENTLY VIEWED
```

---

# 154. Merchandising Surface Governance

Do not claim:

```text
BEST SELLER
TRENDING
```

without defined basis.

---

# 155. Recommendation Architecture

Stages:

```text
MANUAL
↓
RULE-BASED
↓
BEHAVIORAL
↓
AI-ASSISTED
```

---

# 156. Manual Recommendations

Best initial stage.

---

# 157. Rule-Based Recommendations

Example:

```text
SAME COLLECTION
SAME PRODUCT FAMILY
RELATED STYLE
```

---

# 158. Behavioral Recommendations

Future:

```text
VIEWED TOGETHER
BOUGHT TOGETHER
```

---

# 159. AI Recommendations

Only after adequate data and relevance controls.

---

# 160. Personalization

V1 does not require deep personalization.

---

# 161. Useful Early Personalization

Potential:

```text
RECENTLY VIEWED
ORDER HISTORY
REORDER
```

for known users.

---

# 162. Avoid Creepy Personalization

Use signals customer reasonably expects.

---

# 163. Information Architecture and Brand

The website should visually communicate:

```text
CLEAR
MODERN
STRUCTURED
TASTEFUL
```

from Brand Identity System.

---

# 164. Visual Hierarchy

Canonical:

```text
PRIMARY MESSAGE
↓
PRIMARY ACTION
↓
SUPPORTING INFORMATION
```

---

# 165. Page Density

Avoid dense enterprise-style information on consumer pages.

---

# 166. B2B Pages Can Be Deeper

Because customer consideration is higher.

---

# 167. Mobile-First IA

Prioritize:

```text
SHORT PATH
CLEAR CTA
FAST PRODUCT DISCOVERY
```

---

# 168. Sticky Actions

Potential:

```text
ADD TO CART
START CUSTOM
REQUEST QUOTE
```

on mobile where useful.

---

# 169. Website Performance

Critical pages:

```text
HOME
PLP
PDP
CART
CHECKOUT
```

should remain performant.

---

# 170. Image Strategy

Product images can be rich without destroying load performance.

---

# 171. Accessibility

Information architecture should support:

```text
KEYBOARD NAV
SEMANTIC HEADINGS
ALT TEXT
READABLE TEXT
```

where applicable.

---

# 172. Empty States

Need intentional states for:

```text
NO ORDERS
NO SEARCH RESULTS
NO SAVED ITEMS
EMPTY CART
```

---

# 173. Error States

Should tell user:

```text
WHAT HAPPENED
WHAT TO DO NEXT
```

---

# 174. 404 Page

Should route users back to useful destinations.

---

# 175. Redirect Governance

When URL changes:

use proper redirects where appropriate.

---

# 176. Archive Governance

Expired campaign pages need decision:

```text
KEEP
UPDATE
REDIRECT
ARCHIVE
```

---

# 177. Sold-Out Product

Do not automatically delete page.

Potential:

```text
SOLD OUT
↓
RELATED PRODUCT
↓
NOTIFY / WAITLIST
```

---

# 178. Discontinued Product

Can redirect when there is meaningful replacement.

---

# 179. Preorder Product

PDP must make:

```text
PREORDER STATUS
EXPECTED DELIVERY
```

clear.

---

# 180. Made-to-Order Product

Make production lead time explicit.

---

# 181. Custom vs MTO

Do not confuse:

```text
MADE-TO-ORDER STANDARD PRODUCT
```

with:

```text
CUSTOMIZED PRODUCT
```

---

# 182. Case Studies

Potential route:

```text
/case-studies
```

or nested under relevant service.

---

# 183. Case Study Navigation

Can filter by:

```text
BUSINESS
MERCH
CUSTOM
```

once enough volume exists.

---

# 184. About Page

Should explain:

```text
TEEStock
WHY IT EXISTS
HOW IT WORKS
WHAT IT BELIEVES
```

without internal corporate detail overload.

---

# 185. MultiGraph Relationship

May be disclosed where strategically/legal relevant.

Does not need to dominate consumer experience.

---

# 186. Brand Architecture Disclosure

Customers need enough to understand:

```text
TEEStock
ORIGINALS
LABELS
```

not full corporate taxonomy.

---

# 187. Contact Architecture

One contact entry can route internally.

Avoid separate random phone numbers/pages for every service early.

---

# 188. Website Form Architecture

Forms should share:

```text
IDENTITY
CONTACT
SOURCE
INTENT
```

where possible.

---

# 189. Form Context

Form should automatically know:

```text
PAGE
OFFER
CAMPAIGN
```

rather than ask user.

---

# 190. Lead Source Capture

Preserve:

```text
UTM
REFERRAL
CREATOR
CAMPAIGN
```

where applicable.

---

# 191. Form Submission

Should create canonical:

```text
LEAD
APPLICATION
CASE
```

depending intent.

---

# 192. Form Success State

Tell user:

```text
WHAT HAPPENS NEXT
```

---

# 193. Estimated Response Time

Only show if TeeStock can reliably meet it.

---

# 194. Website Analytics Architecture

Track meaningful events.

Potential:

```text
page_view
product_view
search
add_to_cart
checkout_started
purchase
custom_started
business_lead_submitted
merch_lead_submitted
```

---

# 195. Analytics Naming

Should align with canonical Event Model later.

---

# 196. Do Not Track Everything

Track what supports decisions.

---

# 197. Website Funnel — Commerce

```text
LANDING
↓
PRODUCT VIEW
↓
ADD TO CART
↓
CHECKOUT
↓
PURCHASE
```

---

# 198. Website Funnel — Custom

```text
CUSTOM PAGE
↓
START CUSTOM
↓
FORM
↓
QUALIFIED
↓
QUOTE
```

---

# 199. Website Funnel — Business

```text
BUSINESS PAGE
↓
PROOF / OFFER
↓
REQUEST QUOTE
↓
LEAD
```

---

# 200. Website Funnel — Merch

```text
MERCH PAGE
↓
CASE / PROCESS
↓
START PROJECT
↓
QUALIFICATION
```

---

# 201. Website KPIs

Potential categories:

```text
DISCOVERY
NAVIGATION
CONVERSION
LEAD
SELF-SERVICE
```

---

# 202. Discovery Metrics

Potential:

```text
ORGANIC LANDINGS
SEARCH USAGE
CATEGORY ENTRY
```

---

# 203. Navigation Metrics

Potential:

```text
JOB ROUTE CLICK
SEARCH REFINEMENT
```

---

# 204. Commerce Metrics

Potential:

```text
PDP CONVERSION
ADD-TO-CART
CHECKOUT
PURCHASE
```

---

# 205. Service Metrics

Potential:

```text
LEAD SUBMISSION
QUALIFIED LEAD
QUOTE
```

---

# 206. Self-Service Metrics

Potential:

```text
TRACKING USE
RETURN REQUEST
REORDER
```

---

# 207. Bounce Rate Caution

One page/session metric alone does not define page quality.

---

# 208. IA Validation

Use:

```text
USER BEHAVIOR
SEARCH QUERIES
SUPPORT QUESTIONS
LEAD QUALITY
CONVERSION
```

to improve structure.

---

# 209. Navigation Testing

Potential methods:

```text
TREE TEST
USABILITY TEST
ANALYTICS
```

as maturity increases.

---

# 210. Naming Tests

If users do not understand:

```text
SELECTS
ORIGINALS
MERCH
```

support them with descriptors/context.

---

# 211. Brand Name vs Functional Label

Example:

```text
TeeStock Selects
Curated graphic apparel
```

during early education.

---

# 212. Internal Brand Terms Need Translation

Canonical:

> **Do not assume customers understand internal naming because the team does.**

---

# 213. Commerce Architecture Maturity

```text
LEVEL 0
Simple product catalog

LEVEL 1
Structured Shop

LEVEL 2
Merchandising + content

LEVEL 3
Account + personalization

LEVEL 4
Dynamic / behavior-aware experience
```

---

# 214. Service Architecture Maturity

```text
LEVEL 0
Contact page

LEVEL 1
Dedicated service landing

LEVEL 2
Structured intake

LEVEL 3
Self-service configuration

LEVEL 4
Integrated service workspace
```

---

# 215. Program Architecture Maturity

```text
LEVEL 0
Manual invitation

LEVEL 1
Program pages

LEVEL 2
Application

LEVEL 3
Participant workspace
```

---

# 216. Website Evolution

Canonical:

```text
BROCHURE
↓
COMMERCE + LEADS
↓
CONTENT + ACCOUNT
↓
SELF-SERVICE
↓
ECOSYSTEM FRONTEND
```

---

# 217. V1 Website Scope

Recommended:

```text
HOME
SHOP
SELECTS
ESSENTIALS
PRODUCT
CUSTOM
BUSINESS
MERCH
ABOUT
SUPPORT
CART
CHECKOUT
```

---

# 218. V1 Originals

Can start as:

```text
ORIGINALS OVERVIEW
+
COLLECTION PAGES
```

only when active.

---

# 219. V1 Programs

At minimum:

```text
CREATOR PROGRAM
```

if actively recruiting.

Other program pages can remain hidden/planned.

---

# 220. V1 Learn

Can begin with a small set of high-value guides.

---

# 221. V1 Account

Minimum:

```text
ORDER HISTORY
TRACKING
PROFILE
```

or delayed if guest checkout is primary.

---

# 222. V1 Avoid

Do not immediately build:

```text
MEGA MENU WITH EVERYTHING
FULL CUSTOM VISUAL BUILDER
SEPARATE PORTALS FOR EVERY ROLE
HUGE BLOG TAXONOMY
HEAVY PERSONALIZATION
```

---

# 223. V2 Expansion

Possible:

```text
CONTENT HUB
CASE STUDIES
RETURNS SELF-SERVICE
REORDER
PROGRAM APPLICATIONS
ADVANCED SEARCH
```

---

# 224. V3 Expansion

Possible:

```text
CUSTOM BUILDER
BUSINESS ACCOUNT
CREATOR WORKSPACE
ROLE-AWARE ACCOUNT
```

---

# 225. V4 Expansion

Possible:

```text
MULTI-LABEL EXPERIENCE
DYNAMIC MERCHANDISING
AI SEARCH
AI PRODUCT DISCOVERY
```

---

# 226. Page Creation Gate

Create a permanent page when:

```text
RECURRING USER INTENT
+
MEANINGFUL CONTENT
+
CLEAR OWNER
```

exists.

---

# 227. Navigation Gate

Add to primary navigation only when:

```text
HIGH IMPORTANCE
+
HIGH FREQUENCY
+
BROAD RELEVANCE
```

---

# 228. Subdomain Gate

Use subdomain only when experience becomes sufficiently distinct.

Potential future:

```text
creator.teestock.id
partner.teestock.id
```

not early default.

---

# 229. Independent Label Domain Gate

Requires:

```text
PROVEN LABEL
+
MEANINGFUL AUTONOMY
+
OWN AUDIENCE
+
OPERATIONAL VALUE
```

---

# 230. Account Gate

Require login only when it creates more value than friction.

---

# 231. Self-Service Gate

Expose self-service only when backend process is reliable enough to honor it.

---

# 232. SEO Page Gate

Create when:

```text
REAL SEARCH INTENT
+
UNIQUE VALUE
+
OFFER FIT
```

---

# 233. IA Failure Modes

## Mirror Internal Org Chart

Customer confusion.

## Everything in Main Nav

No hierarchy.

## Homepage Explains Everything

No focus.

## Separate Page for Every Tiny Service

Fragmentation.

## Product Story Hides Product Facts

Conversion friction.

## Blog Taxonomy Explosion

Content chaos.

## New Domain for Every Brand Idea

Premature fragmentation.

## Customer Needs to Know Internal Department

Bad routing.

---

# 234. What Website IA Must Not Become

## Corporate Sitemap

Customer jobs come first.

## Mega-Menu Museum

Navigation is prioritization.

## SEO Page Factory

Useful content before keyword volume.

## Portal Maze

One identity and contextual modules.

## Feature-Led Frontend

The site should expose outcomes, not internal technology.

---

# 235. Website IA Success Definition

The architecture succeeds when TeeStock can answer:

```text
CAN A NEW VISITOR
understand TeeStock quickly?

CAN A SHOPPER
find relevant products?

CAN SOMEONE
start a custom order?

CAN A BUSINESS
understand the solution and request a quote?

CAN A CREATOR
discover the merch pathway?

CAN A CUSTOMER
track and manage an order?

CAN SEARCH ENGINES
understand valuable public content?

CAN TEEStock
add future capabilities without breaking navigation?

DO USERS
SEE THEIR JOB RATHER THAN OUR ORG CHART?
```

---

# 236. Canonical Website IA Summary

```text
HOMEPAGE
orients.

NAVIGATION
prioritizes.

SHOP
supports buying.

CUSTOM
supports making.

BUSINESS
supports organizational needs.

MERCH
supports audience-led commerce.

ORIGINALS
supports owned IP.

PROGRAMS
support participation.

LEARN
builds authority and search.

ACCOUNT
reduces repeat friction.

SUPPORT
resolves customer needs.

CANONICAL DATA
powers all surfaces.
```

---

# 237. Canonical Website IA Principles

```text
EXPOSE CUSTOMER JOBS. HIDE ORGANIZATIONAL COMPLEXITY.

HOMEPAGE ROUTES; IT DOES NOT EXPLAIN EVERYTHING.

PRIMARY NAVIGATION IS A PRIORITY SYSTEM.

CUSTOMER LANGUAGE BEFORE INTERNAL LANGUAGE.

PRODUCT TRUTH BEFORE STORY.

ONE IDENTITY BEFORE MANY PORTALS.

SELF-SERVICE ONLY AFTER BACKEND RELIABILITY.

NAVIGATION SHOULD REFLECT ACTIVE BUSINESS.

SEO SHOULD SERVE REAL INTENT.

LABEL AUTONOMY IS EARNED.

ONE PAGE SHOULD HAVE ONE DOMINANT JOB.

BUILD THE SMALLEST CLEAR ARCHITECTURE THAT CAN GROW.
```

---

# 238. Dependency

Dokumen berikut harus follow Website Information Architecture:

1. [[bisnis/teestock/10-product-tech/commerce-platform|commerce-platform.md]]
2. [[bisnis/teestock/10-product-tech/creator-platform|creator-platform.md]]
3. [[bisnis/teestock/10-product-tech/partner-platform|partner-platform.md]]
4. [[bisnis/teestock/10-product-tech/automation-architecture|automation-architecture.md]]
5. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
6. [[bisnis/teestock/11-data-mgbos/entity-hierarchy|entity-hierarchy.md]]
7. [[bisnis/teestock/11-data-mgbos/sku-and-id-convention|sku-and-id-convention.md]]
8. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
9. [[bisnis/teestock/11-data-mgbos/mgbos-integration|mgbos-integration.md]]
10. [[bisnis/teestock/11-data-mgbos/analytics-model|analytics-model.md]]
11. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]
12. [[bisnis/teestock/13-metrics-experiments/experimentation-framework|experimentation-framework.md]]
13. [[bisnis/teestock/14-roadmap/capability-roadmap|capability-roadmap.md]]

TeeStock Website Information Architecture boleh berkembang dari simple commerce-and-lead website menjadi role-aware ecosystem frontend, tetapi setiap layer baru harus mempertahankan customer-job clarity, one-identity principles, canonical data, stable URLs, measurable user paths, dan progressively revealed complexity.