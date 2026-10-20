---
title: "TeeStock Brand Architecture"
date: "2026-09-27"
bisnis: teestock
kategori: brand
status: active
tags:
  - bisnis/teestock
  - kategori/brand
  - teestock/canonical
  - teestock/brand
document_id: "TS-BRD-002"
canonical_id: teestock.brand.brand-architecture
schema_version: "1.0"
document_class: canonical-brand-architecture
owner: "Rizky / Founder"
author: "ChatGPT / AI Co-Founder — Brand & Product Architecture"
approver: "Rizky / Founder (curated-design-first direction)"
scope: teestock-brand-hierarchy-naming-activation-relationships
primary_business_positioning: CURATED_DESIGN_APPAREL
primary_commercial_experience: CURATED_COLLECTION_DISCOVERY
primary_merchandising_line: TEESTOCK_SELECTS
supporting_commerce_line: TEESTOCK_ESSENTIALS
originals_role: SEPARATE_OWNED_IP_AND_LABEL_GOVERNANCE
services_role: SECONDARY_CONDITIONALLY_ACTIVATED
four_domain_architecture: RETAINED
brand_architecture_not_equal_website_navigation: true
retail_checkout_authorization: NONE
production_readiness_claim: NONE
implementation_authorization: NONE
source_control:
  repository: Rizkybuilds/bisnishub
  pull_request: 85
  inspected_head: ec5b2412debb41ec667f01e9436ae54b7dc8d3f7
  original_blob_sha: 88e6072e4cbc652eca4d63991c4315f086f6fb00
  source_version: "1.0"
  date: "2026-10-20"
reconciles_decisions:
  - DEC-TS-2026-009
  - DEC-TS-2026-011
  - DEC-TS-2026-012
supersedes: "TS-BRD-002@1.0"
version: "2.0"
category: "brand"
business: "teestock"
last_updated: "2026-10-20"
path: "02-brand/brand-architecture.md"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-STR-001"
  - "TS-STR-002"
  - "TS-STR-003"
  - "TS-STR-004"
  - "TS-BRD-001"
---


# TeeStock Brand Architecture v2.0

> [!info] **Canonical Brand Architecture Document  **
> Dokumen ini mendefinisikan bagaimana seluruh brand, business line, commerce line, program, collection, collaboration, dan independent label di dalam TeeStock harus dinamai, ditampilkan, dihubungkan, dan dikembangkan.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/00-foundation/glossary|TS-FND-002: TeeStock Glossary]] • [[bisnis/teestock/01-strategy/business-thesis|TS-STR-001: TeeStock Business Thesis]] • [[bisnis/teestock/01-strategy/business-model|TS-STR-002: TeeStock Business Model]] • [[bisnis/teestock/01-strategy/ecosystem-architecture|TS-STR-003: TeeStock Ecosystem Architecture]] • [[bisnis/teestock/01-strategy/growth-strategy|TS-STR-004: TeeStock Growth Strategy]] • [[bisnis/teestock/02-brand/master-brand-strategy|TS-BRD-001: TeeStock Master Brand Strategy]]


---

# 1. Purpose

> [!important] **Current canonical application — curated-design-first (20 October 2026)**
> TeeStock is first experienced as a brand for **selected graphic apparel designs and curated collections**. Its current primary commercial line is **TeeStock Selects**; Essentials complements the assortment; Originals separately governs TeeStock-created intellectual property; Services and Programs remain in the valid four-domain architecture but are secondary or gated. Brand taxonomy is **not** a mandate to expose all lines in top navigation, launch them commercially, or claim transaction readiness. This v2.0 reconciles DEC-TS-2026-012 with DEC-TS-2026-009 (operating-spine validation) and DEC-TS-2026-011 (retail-first presentation). No checkout, payment, production, external marketplace, or deployment permission is granted by this document.


Dokumen ini menjawab:

- apa yang merupakan brand,
- apa yang bukan brand,
- kapan nama TeeStock digunakan,
- kapan offering cukup menggunakan descriptor,
- bagaimana Originals bekerja,
- bagaimana Independent Label memperoleh autonomy,
- bagaimana collaboration ditampilkan,
- kapan akun sosial atau domain baru layak dibuat,
- dan bagaimana kita mencegah portfolio TeeStock menjadi kumpulan nama yang membingungkan.

Core principle:

> **Not everything needs to become a brand.**

---

# 2. Canonical Brand Architecture

**Current application priority (a commercial hierarchy, not a new root domain):**

```text
TEESTOCK MASTER BRAND
└── PRIMARY: COMMERCE → TEESTOCK SELECTS → CURATED APPAREL COLLECTIONS
    ├── SUPPORTING: ESSENTIALS (GARMENT / TEXTILE FUNDAMENTALS)
    ├── SEPARATELY GOVERNED: ORIGINALS (OWNED IP / EXPERIMENTAL LABELS)
    ├── SECONDARY / CONDITIONAL: SERVICES
    └── FUTURE / CONDITIONAL: PROGRAMS
```

The full diagram below continues to define **capability and relationship taxonomy**. It does not rank simultaneous marketing, customer navigation, launch sequencing, or operational activation.


TeeStock menggunakan hybrid architecture.

Pada operating layer:

> **Branded House**

Pada consumer IP layer:

> **Endorsed Brand Portfolio**

Canonical structure:

```text
TEESTOCK
│
├── COMMERCE
│   ├── TeeStock Selects
│   └── TeeStock Essentials
│
├── SERVICES
│   ├── TeeStock Custom
│   ├── TeeStock Business
│   ├── TeeStock Merch
│   ├── TeeStock Studio
│   ├── TeeStock Supply
│   └── TeeStock Fulfill
│
├── PROGRAMS
│   ├── TeeStock Creator Program
│   ├── TeeStock Reseller Program
│   ├── TeeStock Partner Program
│   └── TeeStock Affiliate Program
│
└── ORIGINALS
    │
    ├── Originals Collections
    │
    └── Independent Labels
        ├── Label A
        ├── Label B
        └── Label C
```

---

# 3. Architecture Logic

**Non-equivalence rule:** a functional line's canonical name/identity may remain defined while its public availability is `NOT_ACTIVE`, its top-navigation visibility is `HIDDEN`, and transaction readiness is `NOT_VERIFIED`. Every downstream system must treat **brand structure**, **merchandising priority**, **surface placement**, **business activation**, and **technical production readiness** as distinct facts. Selects is a curated offering; the TeeStock master brand remains the consumer-trust identity.


TeeStock harus menggunakan master brand sebanyak mungkin sampai terdapat alasan strategis kuat untuk menciptakan brand identity independen.

Canonical rule:

```text
FUNCTIONAL OFFERING
→ use TeeStock master brand

CULTURAL / IDENTITY IP
→ may become independent label
```

Contoh:

```text
Custom printing
→ TeeStock Custom

Blank apparel retail
→ TeeStock Essentials

Creator fulfillment
→ TeeStock Merch / Fulfill

Consumer philosophy brand
→ Independent Label
```

---

# 4. Four Brand Architecture Layers

Portfolio TeeStock mempunyai empat layer berbeda.

```text
LAYER 1
MASTER BRAND
TeeStock

LAYER 2
FUNCTIONAL LINES
Selects / Essentials / Services / Programs

LAYER 3
ORIGINALS COLLECTIONS
Internal creative experiments

LAYER 4
INDEPENDENT LABELS
Consumer brands with their own identity
```

Setiap layer mempunyai tingkat autonomy berbeda.

---

# 5. Layer 1 — Master Brand

**Master-brand promise for the present stage:** TeeStock earns trust through visual taste, thoughtfully selected graphic designs, clear collection storytelling, disclosed apparel/size details, lawful artwork use, credible garment and print quality, and dependable order communication. Do not describe TeeStock's primary reason to exist as custom printing, a generalist merch factory or a B2B uniform vendor. Those may be separate scoped capabilities.


## TeeStock

TeeStock adalah primary trust brand.

TeeStock membawa equity pada:

- apparel expertise,
- quality,
- curation,
- reliability,
- production capability,
- operational competence.

Master brand menjawab:

> **Siapa yang membuat pengalaman ini dapat dipercaya?**

Jawaban:

> TeeStock.

---

# 6. When TeeStock Must Be Dominant

Nama TeeStock harus dominan pada:

```text
Commerce
Services
Programs
Operational Interfaces
B2B Communication
Customer Service
Fulfillment
Platform Experience
```

Contoh:

```text
TeeStock Custom
TeeStock Business
TeeStock Supply
```

Bukan:

```text
Atelier X
Corporate Works
Supply Lab
```

tanpa alasan yang kuat.

---

# 7. Layer 2 — Functional Lines

Functional Lines menggunakan:

```text
TEESTOCK + FUNCTIONAL DESCRIPTOR
```

Tujuannya:

- cepat dipahami,
- mengurangi brand fragmentation,
- memindahkan trust TeeStock ke offering baru.

---

# 8. Commerce Naming

**Present priority:** `TeeStock Selects` is the leading curated-design apparel merchandising line, expressed under **TeeStock**; it is not an independent brand. `TeeStock Essentials` supports quality, fit and fundamentals, not an equally promoted alternative identity. Neither line's name changes ownership of the artwork or grants permission to print it.


Canonical names:

```text
TeeStock Selects
TeeStock Essentials
```

## TeeStock Selects

Meaning:

> curated by TeeStock.

Tidak perlu menjadi independent brand.

---

## TeeStock Essentials

Meaning:

> apparel fundamentals selected by TeeStock.

Tidak perlu identity terpisah dari TeeStock master brand.

---

# 9. Services Naming

**Visibility is governed separately from naming.** The six canonical Service names remain valid. Their presence here does **not** authorize an equal-prominence header link, homepage hero, campaign, quote turnaround promise or activated service offering. Services may receive scoped supporting routes only when business and operational gates permit. They must not displace curated collections in TeeStock's first impression.


Canonical public names:

```text
TeeStock Custom
TeeStock Business
TeeStock Merch
TeeStock Studio
TeeStock Supply
TeeStock Fulfill
```

Semua menggunakan TeeStock secara eksplisit.

---

# 10. Why Functional Names

Functional naming memberikan tiga keuntungan.

## Clarity

Customer langsung tahu offering-nya.

## Equity Transfer

Trust TeeStock langsung digunakan oleh line baru.

## Lower Brand Management Cost

Tidak perlu membangun awareness dari nol untuk setiap service.

---

# 11. Services Are Not Independent Brands

Service Line tidak boleh memiliki:

- worldview sendiri,
- consumer culture sendiri,
- independent personality yang bertentangan,
- separate brand strategy

kecuali kemudian dipisahkan secara strategis sebagai Business Unit baru.

Contoh:

```text
TeeStock Custom
```

adalah service line.

Bukan clothing brand.

---

# 12. Layer 2 — Programs

Programs menggunakan TeeStock endorsement penuh.

Canonical naming:

```text
TeeStock Creator Program
TeeStock Reseller Program
TeeStock Partner Program
TeeStock Affiliate Program
```

Dalam UX, dapat dipersingkat menjadi:

```text
Creator Program
Reseller Program
```

jika context TeeStock sudah jelas.

---

# 13. Programs Are Not Brands

Program adalah relationship framework.

Jangan membuat:

```text
TeeStock Creator Club
Creator Nation
Reseller Society
```

hanya untuk terlihat lebih besar.

Nama khusus hanya dibuat jika program benar-benar berkembang menjadi community/property yang memiliki strategic value sendiri.

---

# 14. Layer 3 — TeeStock Originals

TeeStock Originals bukan sekadar product category.

Canonical definition:

> **Consumer IP & Brand Creation Division.**

Originals merupakan tempat TeeStock:

- menciptakan,
- menguji,
- mengembangkan,
- dan mengelola

consumer intellectual property.

---

# 15. TeeStock Originals Brand Role

**Selects ≠ Originals.** Curation and commercialization of third-party, licensed, commissioned or creator artwork under Selects must not imply TeeStock owns all related IP. Originals is the governed TeeStock-created IP/label system with its own rights evidence and brand-promotion gates. A successful curated collection does not automatically become an independent Originals label.


Originals harus terlihat sebagai:

```text
creative signature
```

dari TeeStock.

Possible expression:

> **TeeStock Originals**

atau:

> **A TeeStock Original**

---

# 16. Originals Is Not the Main Master Brand

TeeStock tetap master brand.

Hierarchy:

```text
TEESTOCK
└── ORIGINALS
```

Bukan:

```text
TEESTOCK ORIGINALS
└── TeeStock
```

Originals adalah brand division.

---

# 17. Originals Collection Architecture

Collection adalah level experimental.

Example:

```text
TEESTOCK ORIGINALS

Collection 001
Start Anyway

Collection 002
After Hours

Collection 003
Raw Identity
```

Collection tidak memerlukan:

- domain sendiri,
- account sendiri,
- legal entity,
- independent brand strategy.

---

# 18. Collection Naming Rule

Recommended pattern:

```text
TeeStock Originals
Collection 001 — [Name]
```

atau secara consumer-facing:

```text
START ANYWAY
TeeStock Originals — Collection 001
```

Urutan visual dapat disesuaikan berdasarkan campaign.

---

# 19. Collection Lifecycle

```text
CONCEPT
↓
CAPSULE
↓
DROP
↓
MARKET RESPONSE
↓
DECISION
```

Decision:

```text
ARCHIVE
ITERATE
REPEAT
PROMOTE TO LABEL
```

---

# 20. Collection Does Not Equal Label

A collection adalah:

> creative/product concept.

A label adalah:

> consumer identity system.

Satu design sukses tidak cukup untuk membuat brand baru.

---

# 21. Layer 4 — Independent Labels

Independent Label adalah consumer brand yang dimiliki atau dikendalikan TeeStock tetapi mempunyai identity sendiri.

Canonical structure:

```text
TEESTOCK
└── TEEStock ORIGINALS
    └── Independent Label
```

Possible labels:

```text
DO YOUR BEST
WORK IN PROGRESS
AFTER HOURS CLUB
```

Nama-nama tersebut tetap concept sampai melalui formal incubation.

---

# 22. Independent Label Criteria

Sebuah concept hanya layak menjadi Independent Label jika memiliki:

1. Core belief
2. Distinct audience
3. Clear worldview
4. Recognizable visual language
5. Distinct voice
6. Multiple product possibilities
7. Multiple collection possibilities
8. Storytelling depth
9. Community potential
10. Evidence of demand

Tidak harus semuanya sempurna.

Namun mayoritas harus hadir.

---

# 23. Label Promotion Model

Canonical lifecycle:

```text
IDEA
↓
ORIGINALS CONCEPT
↓
CAPSULE COLLECTION
↓
REPEAT COLLECTION
↓
PROVEN CONCEPT
↓
ENDORSED LABEL
↓
INDEPENDENT OPERATING BRAND
```

Tidak ada shortcut langsung dari:

```text
IDEA
→ BRAND
```

---

# 24. Label Endorsement Architecture

Default early-stage endorsement:

```text
DO YOUR BEST
A TEESTOCK ORIGINAL
```

Alternative:

```text
DO YOUR BEST
by TeeStock Originals
```

Master brand relationship harus terlihat sampai label mempunyai equity cukup kuat.

---

# 25. Brand Autonomy Levels

Independent Labels memiliki empat autonomy levels.

## Level 0 — Collection

No independent brand.

```text
TeeStock Originals
Collection 001
```

---

## Level 1 — Endorsed Label

Own name + identity.

```text
DO YOUR BEST
A TEESTOCK ORIGINAL
```

Shared:

- website,
- checkout,
- social infrastructure,
- fulfillment.

---

## Level 2 — Semi-Independent Label

May have:

- dedicated landing area,
- dedicated campaign identity,
- dedicated social account.

Still shares:

- commerce backend,
- fulfillment,
- data,
- finance,
- MGBOS.

---

## Level 3 — Independent Frontend Brand

May have:

- own domain,
- own storefront,
- own social ecosystem.

Still may share:

- production,
- fulfillment,
- operations,
- finance,
- MGBOS.

---

## Level 4 — Independent Business Unit

Only if strategically justified.

May have:

- independent P&L,
- dedicated team,
- independent operations.

This is rare.

---

# 26. Default Autonomy Rule

Default state:

> **Keep brands integrated until independence creates more value than complexity.**

Autonomy is earned.

Not assumed.

---

# 27. Social Account Rule

Do not create separate social account just because a label name exists.

Separate account requires evidence such as:

- regular content pipeline,
- distinct audience,
- recurring product roadmap,
- meaningful engagement,
- ability to maintain consistency.

Otherwise use TeeStock / TeeStock Originals channels.

Canonical principle:

> **Audience first. Account later.**

---

# 28. Domain Rule

Do not buy/build separate domain as primary storefront unless:

- label is validated,
- search/direct demand exists,
- independent experience materially improves conversion or positioning,
- sufficient product roadmap exists.

Early:

```text
teestock.id/originals/do-your-best
```

Later:

```text
doyourbest.[domain]
```

if justified.

---

# 29. Checkout Rule

Even if label has independent frontend:

```text
BRAND FRONTEND
↓
SHARED COMMERCE ENGINE
↓
SHARED CHECKOUT
↓
SHARED FULFILLMENT
```

is acceptable.

Brand independence does not require operational duplication.

---

# 30. Data Rule

All Labels must remain connected to canonical TeeStock/MGBOS data.

Track:

- brand,
- collection,
- product,
- SKU,
- order,
- customer,
- channel.

Never create inaccessible data silos merely for brand independence.

---

# 31. Financial Rule

Every Label must be measurable separately.

At minimum:

```text
Revenue
COGS
Contribution Margin
Marketing Spend
Creative Cost
Inventory
Returns
```

Shared infrastructure cost can later be allocated.

---

# 32. Label Identity Rule

Independent Labels may differ radically in:

- tone,
- typography,
- visual system,
- culture,
- campaign style.

Example:

```text
DO YOUR BEST
→ optimistic / disciplined

WORK IN PROGRESS
→ introspective / imperfect

AFTER HOURS CLUB
→ nocturnal / builder culture
```

But product and operational standard cannot fall below TeeStock minimum.

---

# 33. TeeStock Master Brand Equity vs Label Equity

Canonical separation:

```text
TEESTOCK EQUITY
Trust
Quality
Capability
Reliability
Curation

LABEL EQUITY
Identity
Belonging
Culture
Story
Desire
```

This separation allows TeeStock to support very different labels.

---

# 34. Example — Do Your Best

Architecture:

```text
MULTIGRAPH GROUP
└── TeeStock
    └── TeeStock Originals
        └── DO YOUR BEST
            ├── Chapter 001 — Start Anyway
            ├── Chapter 002 — ...
            └── Products
```

Public presentation:

```text
DO YOUR BEST
A TEESTOCK ORIGINAL
```

---

# 35. Example — Work In Progress

```text
TeeStock Originals
└── WORK IN PROGRESS
    ├── Version 0.1
    ├── Version 0.2
    └── Future Collections
```

Its worldview may be:

> Humans are never finished.

---

# 36. Example — After Hours Club

```text
TeeStock Originals
└── AFTER HOURS CLUB
    ├── The Night Shift
    ├── 18:00+
    └── Future Collections
```

Audience:

- creators,
- builders,
- designers,
- founders,
- developers,
- freelancers.

---

# 37. Anti-Cannibalization Principle

Labels must not exist merely as visual variations of the same idea.

Each Label should answer a different identity need.

Example:

```text
DO YOUR BEST
= effort / discipline

WORK IN PROGRESS
= becoming / imperfection

AFTER HOURS CLUB
= tribe / context
```

If two concepts target the same audience, worldview, and aesthetic:

> merge them or keep one as collection.

---

# 38. Portfolio Gap Rule

New Label should fill a meaningful portfolio gap.

Ask:

```text
What audience is underserved?

What worldview is missing?

What creative territory is distinct?

What demand signal supports it?
```

If answer is unclear:

> do not launch a new Label.

---

# 39. Collaboration Architecture

Collaborations are not automatically Originals.

Canonical forms:

```text
TeeStock × Creator
TeeStock Originals × Artist
Independent Label × Creator
```

IP ownership must determine classification.

---

# 40. Collaboration Classification

## TeeStock owns resulting IP

Can potentially become:

```text
TeeStock Original
```

subject to contract.

## Shared ownership

Classify as:

```text
Collaboration
```

## Creator retains ownership

Classify as:

```text
Creator Collaboration
```

not internal Original.

---

# 41. Collaboration Naming

Recommended:

```text
TEESTOCK × [CREATOR]
```

or:

```text
[LABEL] × [CREATOR]
```

Avoid inventing new standalone brand names for one-time collaborations.

---

# 42. TeeStock Selects Architecture

**Current Selects application:** browse a small, credible assortment of curated graphic apparel; enter through collection/design discovery, then evaluate product detail, sizing, availability and the actual purchasing path allowed by readiness gates. Use creator attribution when required. Every publishable artwork needs rights/provenance, approved product compatibility and evidence of truthful merchandising. For curation-level rules use `TS-COM-002`; for intellectual-property controls use `TS-LEG-001`.


Selects is curated commerce.

Possible content sources:

```text
Licensed Artwork
Creator Artwork
Commissioned Artwork
External Collaboration
```

Everything appears under:

```text
TeeStock Selects
```

unless another arrangement requires creator attribution.

---

# 43. Selects Attribution

Where relevant:

```text
TeeStock Selects
Artwork by [Creator]
```

This gives creator credit without creating a new brand hierarchy.

---

# 44. Essentials Architecture

Essentials stays close to master brand.

Examples:

```text
TeeStock Essentials
Essential Tee

TeeStock Essentials
Heavyweight Tee
```

Do not create:

```text
ESSENTIAL LAB
CORE BASIC CO.
```

unless there is future strategic reason.

---

# 45. Custom Architecture

Public name:

```text
TeeStock Custom
```

Could use campaign messaging such as:

> Made by you. Produced by TeeStock.

But campaign phrase does not become brand name.

---

# 46. Business Architecture

Public name:

```text
TeeStock Business
```

Potential navigation wording:

```text
For Business
```

This is UX language, not brand rename.

---

# 47. Merch Architecture

Public name:

```text
TeeStock Merch
```

TeeStock Merch may power external brands invisibly.

Example:

```text
CREATOR BRAND
↓
Powered operationally by TeeStock Merch
```

Visibility can vary by agreement.

---

# 48. Studio Architecture

TeeStock Studio may operate as:

```text
TeeStock Studio
```

but remains capability of TeeStock.

Do not spin off as creative agency before external demand proves it deserves independent positioning.

---

# 49. Supply Architecture

Public name:

```text
TeeStock Supply
```

Should communicate:

- technical clarity,
- reliability,
- availability.

Supply should not adopt consumer fashion tone unnecessarily.

---

# 50. Fulfill Architecture

Public name:

```text
TeeStock Fulfill
```

It may become more infrastructure-oriented over time.

Still stays TeeStock-branded until external scale creates reason to separate.

---

# 51. Master Brand Visibility Matrix

**Interpretation warning:** the `TeeStock visibility` column below measures **which trust identity is visible when an entity is actually presented**. It is NOT a priority ranking for homepage, navigation, marketing or launch. A secondary Service can require high TeeStock identity visibility when it is activated while still having **low public prominence** for the curated-design-first launch. Public placement is governed by Sections 58–62 and owned CX / website information architecture contracts.


Recommended:

| Entity | TeeStock visibility | Independent identity |
|---|---:|---:|
| Selects | Very high | Low |
| Essentials | Very high | Low |
| Custom | Very high | Low |
| Business | Very high | Low |
| Merch | Very high | Low |
| Studio | Very high | Low |
| Supply | Very high | Low |
| Fulfill | Very high | Low |
| Creator Program | High | Low |
| Originals Collection | High | Medium |
| New Label | Medium-high | High |
| Mature Label | Low-medium | Very high |

---

# 52. Brand Relationship Types

Canonical relationship types:

```text
MASTER BRANDED
ENDORSED
COLLABORATION
POWERED BY
INVISIBLE INFRASTRUCTURE
```

---

# 53. Master Branded

Example:

```text
TeeStock Custom
```

TeeStock is primary identity.

---

# 54. Endorsed

Example:

```text
DO YOUR BEST
A TEESTOCK ORIGINAL
```

Label is primary.

TeeStock gives credibility.

---

# 55. Collaboration

Example:

```text
TeeStock × Creator
```

Both identities visible.

---

# 56. Powered By

Example:

```text
Creator Store
Powered by TeeStock
```

Useful when infrastructure relationship matters.

---

# 57. Invisible Infrastructure

Possible B2B/white-label situation:

Customer brand fully visible.

TeeStock operates backend.

TeeStock customer-facing visibility:

```text
none or minimal
```

Commercial/legal records still track TeeStock.

---

# 58. Architecture by Customer Journey

**First-party consumer journey currently prioritized:**

```text
TEEStock DISCOVERY → CURATED COLLECTION → SELECTED DESIGN / PRODUCT
→ CLEAR GARMENT & SIZE INFORMATION → AVAILABILITY / PURCHASE ELIGIBILITY
→ GOVERNED TRANSACTION OR HONEST NON-TRANSACTIONAL INTEREST CAPTURE
→ ACCURATE FULFILLMENT / COMMUNICATION (WHEN ACTIVATED)
```

The Custom, Business and Creator flows below remain legitimate secondary entry patterns **when separately offered**; they are not equivalent launch requirements. Do not infer live checkout from this journey map.


Consumer may see:

```text
TeeStock
↓
Selects / Essentials / Originals
```

Custom customer:

```text
TeeStock
↓
Custom
```

Business:

```text
TeeStock
↓
Business
```

Creator:

```text
TeeStock
↓
Creator Program / Merch
```

This keeps entry points simple.

---

# 59. Website Architecture

Recommended top-level consumer-facing IA:

```text
teestock.id
│
├── Shop                       # dominant consumer path
│   ├── Curated Collections    # merchandising entry / design discovery
│   ├── Selects                # curated design line
│   ├── Essentials             # supporting apparel essentials (if active)
│   └── Originals              # only approved products / labels if active
│
├── About / Our Approach       # curation, quality, trust
└── [Conditional Services]     # contextual routes, not default top nav
```

**This is an intended information-architecture priority, not a deployed sitemap.** Route names are examples only; the live URL scheme, exact labels and accessible navigation behavior belong to the Website Information Architecture and customer-platform CX contract. Services must be accessible when valid offers exist, but must not be promoted as equal protagonists during the curated-design pilot.

Additional service pages may exist without being top-navigation items.

---

# 60. Originals Website Architecture

```text
/originals
│
├── Collections
└── Labels
    ├── do-your-best
    ├── work-in-progress
    └── after-hours-club
```

Only active/validated concepts should appear.

---

# 61. Programs Website Architecture

Programs can live under context-specific paths:

```text
/creator
/reseller
/affiliate
/partner
```

No need to expose all programs prominently to consumers.

---

# 62. Homepage Architecture Principle

Homepage should not display organizational complexity.

Homepage should answer:

1. What is TeeStock?
2. What can I do here?
3. Why should I trust it?
4. Where should I go?

Possible routing:

```text
EXPLORE CURATED COLLECTIONS   # primary CTA / visually dominant
SHOP SELECTED DESIGNS          # primary consumer task
SEE GARMENT & QUALITY DETAILS  # trust and product clarity
LEARN ABOUT TEESTOCK           # master-brand story
[CONTEXTUAL SERVICES]          # conditional secondary route only
```

**Avoid presenting five equally weighted CTAs.** Hero, primary categories and featured storytelling must privilege curated design. The labels above are conceptual; copy, accessibility and conversion experiments remain governed by CX / voice-and-copy documents. Services are not required to appear in the primary hero.

---

# 63. Packaging Architecture

Master-brand product:

```text
TeeStock dominant
```

Originals Collection:

```text
Collection identity
+
TeeStock Originals
```

Independent Label:

```text
Label dominant
+
subtle TeeStock endorsement
```

---

# 64. Garment Label Architecture

Early Independent Label example:

```text
DO YOUR BEST

A TEESTOCK ORIGINAL
```

Back/secondary label may contain:

- TeeStock manufacturing/operational information,
- care information.

---

# 65. Customer Support Architecture

Regardless of brand frontend, early-stage support can remain:

```text
TeeStock Support
```

with brand context attached to ticket/order.

Customer should not need to discover different operational teams.

---

# 66. Fulfillment Branding

Outer logistics packaging may remain TeeStock-neutral/shared.

Consumer-facing unboxing can follow relevant:

- TeeStock,
- Collection,
- Independent Label.

Shared operations do not require identical experience.

---

# 67. Legal Architecture

Brand architecture does not automatically determine legal entity architecture.

Example:

```text
DO YOUR BEST
```

may be a brand owned by:

```text
MultiGraph Group / TeeStock entity
```

without becoming separate legal company.

Legal separation occurs only if there is strategic/legal reason.

---

# 68. Trademark Architecture

Priority trademark candidates generally include:

```text
TeeStock
validated Independent Labels
critical proprietary marks
```

Do not file every collection name automatically.

Trademark strategy must follow actual usage and legal review.

---

# 69. IP Ownership Rule

Every creative property must have explicit ownership classification:

```text
TEESTOCK OWNED
LICENSED
CREATOR OWNED
JOINT / SHARED
CUSTOMER OWNED
```

Brand architecture must reflect this classification.

---

# 70. Naming Governance

Before approving a new name:

1. Determine entity type.
2. Determine whether name is actually necessary.
3. Check conflict with existing architecture.
4. Check long-term extensibility.
5. Check language/meaning.
6. Check current trademark/domain/social availability when concept approaches activation.

A name should never be treated as available based on internal brainstorming alone.

---

# 71. New Brand Creation Gate

A new brand name requires answers to:

```text
Why can't this live under TeeStock?

Who is the audience?

What distinct worldview exists?

What does the brand let us do that TeeStock cannot?

Is there repeatable product territory?

Is there evidence?
```

If weak:

> remain Collection or functional line.

---

# 72. Brand Creation Cost

Every new brand creates hidden costs:

```text
Strategy
Identity
Content
Social
Website
Photography
Campaign
Customer Education
Trademark
Operations
Management Attention
```

Therefore:

> brand proliferation is operational debt.

---

# 73. Brand Deletion / Sunset

Brands are not permanent by default.

Possible lifecycle:

```text
ACTIVE
↓
PAUSED
↓
SUNSET
↓
ARCHIVED
```

Customer obligations and IP records remain preserved.

---

# 74. Label Portfolio Review

Independent Labels should periodically be reviewed on:

- brand equity,
- demand,
- contribution,
- creative runway,
- customer overlap,
- operational burden.

Possible actions:

```text
INVEST
MAINTAIN
REPOSITION
MERGE
SUNSET
```

---

# 75. Brand Portfolio Roles

A future label may have a specific portfolio role.

Examples:

```text
Growth Label
Community Label
Experimental Label
Premium Label
Evergreen Label
```

Portfolio role must be intentional.

Not every Label needs identical economics.

---

# 76. Original Collection Roles

Collections may function as:

```text
DESIGN TEST
AUDIENCE TEST
PRICE TEST
STORY TEST
FIT TEST
CULTURE TEST
```

This reinforces that Originals is also an experimentation engine.

---

# 77. Brand Cannibalization Rules

Cannibalization becomes concerning when two Labels:

- target same audience,
- use same aesthetic,
- sell same product,
- tell same story,
- compete at same price.

If overlap only occurs at base garment/infrastructure level:

> not necessarily cannibalization.

---

# 78. Shared Product, Different Brand

One base garment can serve:

```text
TeeStock Essentials
Do Your Best
After Hours Club
Creator Merch
```

Backend similarity is allowed.

Consumer proposition must remain distinct.

---

# 79. Shared Infrastructure Rule

Independent branding must never cause unnecessary duplication of:

```text
Inventory
Payment
Customer Identity
Finance
Fulfillment
Analytics
```

unless scale justifies it.

---

# 80. Architecture and MGBOS

MGBOS must represent hierarchy explicitly:

```text
ORGANIZATION
↓
BUSINESS UNIT
↓
DOMAIN
↓
BUSINESS LINE / BRAND DIVISION
↓
LABEL
↓
COLLECTION
↓
PRODUCT
↓
SKU
```

Programs and Channels exist as parallel entities.

---

# 81. Canonical Entity Examples

Example Commerce product:

```text
Organization:
MultiGraph Group

Business Unit:
TeeStock

Domain:
Commerce

Commerce Line:
Selects

Product:
Coffee Graphic Tee
```

---

# 82. Canonical Originals Example

```text
Organization:
MultiGraph Group

Business Unit:
TeeStock

Domain:
Originals

Brand Division:
TeeStock Originals

Label:
Do Your Best

Collection:
Chapter 001 — Start Anyway

Product:
Essential Tee

SKU:
DYB-C01-TEE-BLK-L
```

---

# 83. Canonical Service Example

```text
Organization:
MultiGraph Group

Business Unit:
TeeStock

Domain:
Services

Service Line:
TeeStock Custom

Order:
Custom apparel project
```

No Label entity needed.

---

# 84. External Simplicity Rule

Internal structure can be sophisticated.

Customer-facing structure should remain simple.

```text
INTERNAL
Commerce / Services / Originals / Programs / Infrastructure

EXTERNAL
Shop / Make / Build
```

---

# 85. Portfolio Brand Promise

All customer-visible entities backed by TeeStock must maintain minimum:

```text
QUALITY
CLARITY
RELIABILITY
```

Independent Label can differ in taste.

It cannot violate core operating standards.

---

# 86. Architecture Anti-Patterns

Avoid:

## Every Feature Gets a Brand

Wrong:

```text
TeeStock Shipping Pro
TeeStock Print Lab
TeeStock Pack Works
```

if they are merely internal capabilities.

---

## Every Collection Gets Social Account

Creates fragmentation.

---

## Every Audience Gets a New Brand

Use segmentation first.

Brand creation later.

---

## Rebranding to Fix Product Problems

Brand identity cannot repair weak product economics.

---

## Architecture Based on Website Menu

Business architecture determines website.

Not the other way around.

---

# 87. Brand Architecture Decision Tree

```text
NEW THING
│
├── Is it an operational capability?
│      └── Infrastructure
│
├── Is it a customer service?
│      └── TeeStock + functional descriptor
│
├── Is it a participation mechanism?
│      └── Program
│
├── Is it curated consumer product?
│      └── TeeStock Selects
│
├── Is it consumer basic?
│      └── TeeStock Essentials
│
├── Is it internal creative IP?
│      │
│      ├── experimental
│      │    └── Originals Collection
│      │
│      └── validated identity
│           └── Independent Label
│
└── Is it created with external party?
       └── Collaboration
```

---

# 88. Brand Independence Decision Tree

```text
CONCEPT
↓
Does it have distinct identity?
├── NO → Collection
└── YES
     ↓
Does it have repeatable product territory?
├── NO → Collection
└── YES
     ↓
Is there market evidence?
├── NO → Incubate
└── YES
     ↓
Endorsed Label
     ↓
Does independent distribution create value?
├── NO → Stay endorsed
└── YES
     ↓
Semi-independent / Independent Frontend
```

---

# 89. Architecture Maturity

## Stage 1

```text
TeeStock
├── Selects
├── Essentials
└── Custom
```

Very strong master brand.

---

## Stage 2

```text
TeeStock
├── Commerce
├── Services
└── Originals Collections
```

---

## Stage 3

```text
TeeStock
├── Functional Lines
└── TeeStock Originals
    └── Endorsed Labels
```

---

## Stage 4

```text
TeeStock Ecosystem
+
Multiple Consumer Brands
+
Shared Infrastructure
```

---

# 90. Current Recommended Architecture

For the current stage, TeeStock should operate primarily as:

```text
BRANDED HOUSE
```

Recommended visible portfolio:

```text
TeeStock                              # dominant master brand
├── SELECTS / CURATED COLLECTIONS     # primary current consumer focus
├── Essentials                        # supportive, conditionally visible
├── Originals                         # owned IP only when approved
└── Services                          # secondary, activated per service
    ├── Custom
    ├── Business
    └── Merch / Studio / Supply / Fulfill (only if separately approved)
```

This is **brand architecture**, not evidence all entries are live or that a given channel may take payment. Existing Q4 assisted-sales operating-spine validation can remain a separate engineering track without changing TeeStock's primary curated-design business positioning.

Other Services can be activated as customer-facing names only when relevant.

---

# 91. What Not to Launch Simultaneously

Do not simultaneously launch public identities for:

```text
Custom
Business
Merch
Studio
Supply
Fulfill
4 Programs
3 Independent Labels
```

even though architecture supports them.

Architecture defines future structure.

Roadmap defines what is currently active.

---

# 92. Architecture vs Activation

**Activation state is multi-dimensional.** Maintain separately: `architecture_defined`, `brand_approved`, `product_offer_approved`, `artwork_rights_cleared`, `sample_qc_passed`, `vendor_capacity_verified`, `payment_and_checkout_authorized`, `fulfillment_ready`, and `publicly_visible`. Neither a name nor a product page implies the rest. No AI/agent may promote a candidate to live commercial availability solely from this document.


Important distinction:

```text
DEFINED
≠
ACTIVE
```

Example:

```text
TeeStock Fulfill
```

can exist in architecture while current lifecycle status remains:

```text
FUTURE
```

MGBOS and documentation must track activation state.

---

# 93. Canonical Naming Summary

```text
MASTER BRAND
TeeStock

COMMERCE
TeeStock Selects
TeeStock Essentials

SERVICES
TeeStock Custom
TeeStock Business
TeeStock Merch
TeeStock Studio
TeeStock Supply
TeeStock Fulfill

PROGRAMS
TeeStock Creator Program
TeeStock Reseller Program
TeeStock Partner Program
TeeStock Affiliate Program

IP DIVISION
TeeStock Originals

INDEPENDENT LABEL
[Label Name]
A TeeStock Original
```

---

# 94. Canonical Relationship Summary

```text
TeeStock
= trust brand

Selects
= curated by TeeStock

Essentials
= fundamentals by TeeStock

Services
= capabilities delivered by TeeStock

Programs
= ways to participate with TeeStock

Originals
= IP created by TeeStock

Independent Labels
= identities created and owned within TeeStock Originals
```

---

# 95. Canonical Architecture Map

```text
MULTIGRAPH GROUP
│
└── TEESTOCK
    │
    ├── COMMERCE
    │   ├── Selects
    │   └── Essentials
    │
    ├── SERVICES
    │   ├── Custom
    │   ├── Business
    │   ├── Merch
    │   ├── Studio
    │   ├── Supply
    │   └── Fulfill
    │
    ├── PROGRAMS
    │   ├── Creator
    │   ├── Reseller
    │   ├── Partner
    │   └── Affiliate
    │
    └── ORIGINALS
        │
        ├── Collections
        │
        └── Independent Labels
            │
            ├── Label A
            ├── Label B
            └── Label C
```

---

# 96. Brand Architecture Principles

```text
CURATED DESIGN DISCOVERY BEFORE SERVICE PROMOTION.
MASTER BRAND BEFORE LINE BRAND.
APPROVED ARTWORK RIGHTS BEFORE PUBLICATION.
CUSTOMER TRUST BEFORE UNSUBSTANTIATED QUALITY CLAIMS.
BUSINESS-ACTIVATION EVIDENCE BEFORE PUBLIC AVAILABILITY.
```

These additional rules govern the current curated-design-first priority without replacing the canonical anti-proliferation and shared-infrastructure principles below.


```text
CLARITY BEFORE CREATIVITY.

FUNCTION BEFORE NEW NAME.

COLLECTION BEFORE LABEL.

AUDIENCE BEFORE ACCOUNT.

TRACTION BEFORE DOMAIN.

SHARED INFRASTRUCTURE BEFORE DUPLICATION.

TEEStock TRUST BEFORE BRAND PROLIFERATION.
```

---

# 97. Dependency

Dokumen berikut harus mengikuti Brand Architecture ini:

1. [[bisnis/teestock/02-brand/brand-identity-system|brand-identity-system.md]]
2. [[bisnis/teestock/02-brand/voice-and-copy-system|voice-and-copy-system.md]]
3. [[bisnis/teestock/03-commerce/commerce-overview|commerce-overview.md]]
4. [[bisnis/teestock/03-commerce/teestock-selects|teestock-selects.md]]
5. [[bisnis/teestock/03-commerce/teestock-essentials|teestock-essentials.md]]
6. [[bisnis/teestock/04-services/services-overview|services-overview.md]]
7. [[bisnis/teestock/05-originals/originals-master-plan|originals-master-plan.md]]
8. [[bisnis/teestock/05-originals/brand-incubation-framework|brand-incubation-framework.md]]
9. [[bisnis/teestock/05-originals/label-governance|label-governance.md]]
10. [[bisnis/teestock/06-programs/programs-overview|programs-overview.md]]
11. [[bisnis/teestock/10-product-tech/website-information-architecture|website-information-architecture.md]]
12. [[bisnis/teestock/11-data-mgbos/entity-hierarchy|entity-hierarchy.md]]

Setiap proposal brand baru harus terlebih dahulu diklasifikasikan terhadap architecture ini sebelum diberikan nama, identity, domain, atau akun sosial.

---

# 98. Current Curated-Design-First Operating Application (2026-10-20)

> **Normative scope:** current TeeStock brand/portfolio expression, internal to TS-BRD-002. Detailed artwork rights remain owned by TS-LEG-001; detailed Selects curation by TS-COM-002; actual website acceptance by CX contracts; operational and financial controls by MGBOS. This section does not create new independent business entities.

| Level | Consumer-facing role | Default priority | Required gate | Non-decision |
|---|---|---|---|---|
| TeeStock master brand | Consumer trust and taste | Always dominant | Truthful claims, consistent identity | No new root brand |
| Selects | Curated graphic apparel designs | PRIMARY | Rights, quality, unit economics and product readiness | Not proof of ownership of all artwork |
| Collection/edit | Helps discover designs | HIGH when active | Curation thesis, availability, editorial fit | Not automatically an independent label |
| Essentials | Garment fundamentals | SUPPORTING | Product quality and availability | Not a rival hero brand |
| Originals | TeeStock-created consumer IP | SEPARATE / CONDITIONAL | Owned-IP evidence and label governance | Not equivalent to licensed Selects |
| Services | Custom, Business, Merch, Studio, Supply, Fulfill | SECONDARY / OPTIONAL | Per-offer readiness and capacity | Not core brand promise |
| Programs | Creators, resellers, partners, affiliates | DEFERRED / CONDITIONAL | Program-specific approval and controls | Not public by taxonomy alone |
| MultiGraph | Printing services sister business | DISTINCT PARALLEL PILOT | Separate service readiness and business policies | Not a TeeStock sub-brand |

## 98.1 Boundaries across collection, artwork, product and label

- **Artwork** is a rights-governed asset with provenance and permitted uses.
- **Product / sellable variant** is an offering that may combine garment, artwork, size, color and print method.
- **Collection** is a merchandising/editorial grouping; it is not necessarily a copyright ownership unit.
- **Selects** is the retail curation context; source artists may retain ownership.
- **Originals** is the governance lane for TeeStock-controlled IP and potential distinct identities.
- **Independent label** requires separate formal promotion gates; a collection title alone does not qualify.
- **Brand promise** is what is credibly shown to a customer; the supplier or vendor must not be misrepresented.

## 98.2 Primary storefront placement rule

For a curated-design-first TeeStock customer entry, the intended visual and semantic order is:

1. TeeStock as trusted apparel curator / brand identity.
2. Collection and design discovery, with meaningful visual choice and accessible information.
3. Product pages that accurately describe material, print, fit, size, price, availability and rights-compatible design attribution.
4. Clear and honest purchase eligibility; no fake checkout capability.
5. Secondary service paths only when a real, capacity-bounded offer exists.

A high-quality experience does not require a large catalog or the simultaneous release of every domain. The current product/UX contracts own real interaction details and accessibility expectations.

## 98.3 Collection and design publication gates

- Gate `CUR-01` — lawful artwork origin, ownership or license verified, including permitted commercial print/use scope.
- Gate `CUR-02` — visual quality, brand fit, distinctiveness, audience hypothesis and relevant creative attribution reviewed.
- Gate `CUR-03` — product/garment compatibility, approved photography/mockup truth and physical sample criteria defined.
- Gate `CUR-04` — available size/color/production method and feasible vendor lead time not assumed from a UI fixture.
- Gate `CUR-05` — proposed pricing and expected contribution economics documented; actual margin not fabricated.
- Gate `CUR-06` — sales/checkout/order/payment controls applied only upon existing technical and operational authorization.
- Gate `CUR-07` — post-order support, delivery and failure handling are defined for any actual public sale.

These are coordination checkpoints, not replacements for legal or engineering gates. A future AI must consult the detailed owning policy for every decision.

# 99. Machine-Readable Authority and Conflict Resolution

```yaml
teestock_brand_architecture_v2:
  identity:
    canonical_document_id: TS-BRD-002
    canonical_id: teestock.brand.brand-architecture
    architectural_roots: [COMMERCE, SERVICES, PROGRAMS, ORIGINALS]
    master_brand: TeeStock
  near_term_priority:
    strategy: CURATED_DESIGN_APPAREL
    primary_commerce_line: TeeStock Selects
    supporting_line: TeeStock Essentials
    owned_ip_lane: TeeStock Originals
    secondary_services: [Custom, Business, Merch, Studio, Supply, Fulfill]
  source_authority:
    repository_document_constitution: docs/governance/documentation-constitution.md
    business_definition: TS-FND-001
    owner_decision_register: TS-FND-004
    curated_first_decision: DEC-TS-2026-012
    master_brand_strategy: TS-BRD-001
    this_brand_architecture: TS-BRD-002
    selects_curation: TS-COM-002
    intellectual_property: TS-LEG-001
  prohibited_inferences:
    - DEFINED_LINE_IS_LIVE_OFFER
    - RETAIL_FIRST_MEANS_CHECKOUT_READY
    - CURATED_ARTWORK_MEANS_TEESTOCK_OWNS_COPYRIGHT
    - ORIGINALS_IS_SYNONYM_OF_SELECTS
    - SERVICES_ARE_PRIMARY_BRAND_POSITIONING
    - COLLECTION_AUTOMATICALLY_BECOMES_LABEL
    - MULTIGRAPH_IS_TEESTOCK_SUB_BRAND
```

**Decision boundaries:** DEC-TS-2026-012 sets TeeStock's commercial/brand priority; DEC-TS-2026-011 concerns retail-first presentation; DEC-TS-2026-009 retains historical scope for Q4 assisted-sales operational-spine validation unless explicitly superseded by its owning decision authority. These are not contradictory if **business positioning** is separated from **test sequencing**. When actual delivery plans change, update the owning roadmap and operational pilot contract rather than treating this brand document as release authorization.

# 100. Traceability, Validation, and Revision Controls

- [ ] Confirm source TS-BRD-002 v1.0 Git blob is exactly `88e6072e4cbc652eca4d63991c4315f086f6fb00` before any replace.
- [ ] Retain all 97 historical numbered headings and the original brand/label relationship policies.
- [ ] Verify metadata `document_id`, `canonical_id`, `version`, `last_updated` and source control agree.
- [ ] Confirm DEC-TS-2026-012 is adopted into Decision Register within PR #85.
- [ ] Confirm TS-FND-001 and TS-BRD-001 v2.0 are present on the exact PR head being edited.
- [ ] Validate 17 referenced canonical/source files resolve in the same PR branch.
- [ ] Verify customer-platform CX requirements remain the owner for actual navigation, checkout and accessibility acceptance.
- [ ] Run applicable reference, repository layout, format and governance checks on final PR HEAD.
- [ ] Conduct independent review of diff before treating the documentation package as merge-ready.

**Evidence as of file design:** PR #85 was OPEN at `ec5b2412debb41ec667f01e9436ae54b7dc8d3f7`; source `brand-architecture.md` remained v1.0 and brand/definition/decision documents were aligned to the owner direction within the PR. This statement is a recorded source snapshot, not a claim of current CI or runtime acceptance.
