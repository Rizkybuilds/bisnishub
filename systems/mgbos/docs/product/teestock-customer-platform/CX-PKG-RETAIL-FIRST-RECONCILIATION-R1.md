---
canonical_id: proposed.mgbos.product.teestock-customer-platform.retail-first-reconciliation-r1
status: ACTIVE
version: 1.0.0
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: Rizky
effective_from: 2026-10-20
document_class: product-strategy-reconciliation
scope: teestock-customer-platform-retail-first-product-priority
normative_authority: CANONICAL_PRODUCT_RECONCILIATION
product_activation: NOT_AUTHORIZED
implementation_authorization: NONE
deployment_authorization: NONE
merge_authorization: NONE
production_access_authorization: NONE
repository: Rizkybuilds/bisnishub
source_main_sha: 8c7731a13867f38b391ea2f38e9ae7b1f0a7e540
source_review_date: 2026-10-20
review_type: owner-adopted-product-reconciliation
author_review: PERFORMED
owner_adoption: ADOPTED_2026_10_20
runtime_validation: NOT_PERFORMED
user_research: NOT_PERFORMED
supersedes: null
depends_on:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - bisnis/teestock/00-foundation/decision-register.md
  - bisnis/teestock/01-strategy/growth-strategy.md
  - bisnis/teestock/03-commerce/commerce-overview.md
  - bisnis/teestock/03-commerce/teestock-selects.md
  - bisnis/teestock/07-operations/operating-model.md
  - bisnis/teestock/10-product-tech/digital-product-vision.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-04-commerce-checkout-experience.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md
---

# BISNISHUB — TEESTOCK RETAIL-FIRST CX & PRD RECONCILIATION R1

## 0. Executive Disposition

**Disposition: STRATEGIC_RECONCILIATION_ACTIVE / OWNER_ADOPTED**

TeeStock Owner telah mengklarifikasi bahwa prioritas bisnis fase awal adalah **retail curated graphic apparel**, melalui katalog desain yang dikurasi, kolaborasi kreator, koleksi original TeeStock, dan potensi pengembangan Independent Labels.

Clarification tersebut mengubah fokus yang harus diuji oleh program customer platform.

Namun hal ini tidak berarti:

- Business/Custom dihapus;
- MGBOS operating spine tidak lagi digunakan;
- checkout langsung siap diaktifkan;
- seluruh CX-00..09 harus ditulis ulang;
- existing requirement IDs boleh diganti;
- roadmap aktif otomatis tersupersesi;
- Antigravity memperoleh implementasi baru;
- active security and financial assurance gates boleh dilewati.

**Proposed resolution:** bedakan strategic commercial focus, customer experience emphasis, backend validation sequence, dan actual transaction release readiness.

Dokumen ini mengusulkan rekonsiliasi product priority tanpa mengambil alih semantic ownership dokumen lain.

---

## 1. Source & Evidence Register

### 1.1 Exact source baseline

| Source                              | Verified state                                      |
| ----------------------------------- | --------------------------------------------------- |
| Repository                          | Rizkybuilds/bisnishub                               |
| Main                                | `57eaafbb0ceef99a5fc6b2d77d724f6ff510727d`          |
| Existing CX-00..09                  | DRAFT v0.1.1 on inspected main                      |
| Local documentation intake          | Draft PR #77                                        |
| PR #77 HEAD                         | `fb487a470505da5a592239eeccce75931a7c3c53`          |
| Local R2 DP-01..10                  | Present in PR #77, non-canonical                    |
| Retail Commerce Operating Blueprint | Present as imported source in PR #77, non-canonical |

Source state applies to the named Git revision only.

Do not interpret source file presence as production readiness.

### 1.2 Source authority

Claims must be routed to their semantic owners:

| Claim                                         | Governing source                                                    |
| --------------------------------------------- | ------------------------------------------------------------------- |
| TeeStock business identity                    | Master Definition                                                   |
| Retail/business strategy                      | Growth Strategy / approved Decision Register                        |
| Selects, Essentials, Originals                | Commerce and Originals canonical documents                          |
| Creator IP/economics                          | Creator Program, IP/License and Finance documents                   |
| Physical operations                           | TeeStock operating, inventory, production and fulfillment documents |
| Customer-facing experience                    | Approved CX product requirements                                    |
| Financial, order and authorization invariants | MGBOS canonical architecture and verified implementation            |
| Launch strategy                               | Solo-Founder Launch Roadmap                                         |
| Source implementation reality                 | Exact Git revision, tests and runtime evidence                      |
| PR approval                                   | Engineering governance and authorized human decision                |

A draft R2 companion may propose an improvement but cannot supersede active policy by itself.

### 1.3 Reviewed input scope

This reconciliation uses:

- Existing CX-00..09 structure and master requirement catalog.
- CX-PKG-STAGE-CROSSWALK-R1 and Owner decision packet.
- Existing business strategy and operating model.
- PR #77 inventory and relevant imported R2 product deepening proposals, especially DP-01, DP-05, DP-09 and DP-10.
- Imported Retail Commerce Operating Blueprint.
- Current repository governance and financial/authorization boundary definitions.

The 20 imported files have been identified in PR #77. This document does not claim every line of every imported proposal has passed independent semantic verification.

### 1.4 PR #77 provenance concern

Independent comparison of the current Git tree against PR #77's manifest found three byte-size mismatches:

| File                                     | Manifest bytes | HEAD bytes |
| ---------------------------------------- | -------------: | ---------: |
| `CX-PKG-PRODUCT-DEFINITION-PLAN-R2.md`   |         28,070 |     27,325 |
| `retail-commerce-operating-blueprint.md` |         52,558 |     51,075 |
| `verify_cx_r1_preacceptance.py`          |          3,339 |      3,290 |

The differences are consistent with possible CRLF-to-LF normalization but the explanation and SHA-256 checks are not independently confirmed.

PR #77 also currently changes `systems/mgbos/.prettierignore`, and its description references a previous intake HEAD.

These findings require bounded source-integrity reconciliation before accepting PR #77 as byte-for-byte source evidence.

They do not establish that substantive product content was changed.

---

## 2. Precise Product Problem

The existing CX documentation defines a powerful future customer platform.

However, the initial rollout sequence places premium assisted Custom/Business entry before complete retail commerce.

That direction followed the operational readiness of MGBOS.

The Owner's current business objective instead prioritizes:

> Enable customers to discover and buy curated apparel with minimum effort, while TeeStock centrally manages design sourcing, product preparation, production, fulfillment, and business performance.

The distinction matters because **the product must validate the business TeeStock intends to build**, not only the backend workflow that was easiest to verify first.

### 2.1 Four different priorities

Do not collapse these concepts:

**A. Brand and market focus**

What customers should know TeeStock for: curated graphic apparel, distinctive designs, quality and creator collections.

**B. Website experience focus**

What a visitor should primarily discover: products and collections through a premium Shop experience.

**C. Engineering validation order**

What the backend must prove: valid commercial commitments, payments, inventory, production, QC, fulfillment and financial integrity.

**D. First real transaction type**

Whether the first actual validated commercial transaction is assisted Custom/Business, paid retail, or another approved bounded pilot.

A and B can be retail-first without prematurely changing C or D.

D requires explicit business and operational readiness decisions.

### 2.2 Strategic conflict

The active TeeStock decision `DEC-TS-2026-009` gives Q4 priority to the Business/Custom operating vertical.

The newer retail-first direction challenges the business-priority implication of that decision.

It does **not** invalidate the need to verify the operating spine.

**Proposed disposition:** review the decision, document which parts remain valid, and formally supersede only the part that no longer matches Owner's commercial intent.

No decision-register mutation is made here.

---

## 3. Proposed Product Positioning

### 3.1 Primary customer proposition

TeeStock is a curated apparel commerce destination where customers can discover apparel designs that suit their identity, interests and everyday use, with dependable product quality and an understandable purchase experience.

This is a proposed product proposition, not a finalized brand slogan.

### 3.2 Product portfolio

| Portfolio              | Customer meaning                                        | Internal ownership                      |
| ---------------------- | ------------------------------------------------------- | --------------------------------------- |
| Selects                | Curated graphic apparel from approved design sources    | Commerce / curation                     |
| Essentials             | Apparel basics and garment fundamentals                 | Commerce                                |
| Originals collections  | TeeStock-created design and IP collections              | Originals creates; Commerce distributes |
| Creator collaborations | Approved collaborations and creator-attributed products | Creator Program governs relationship    |
| Independent Labels     | Distinct brand identities after successful incubation   | Originals / label governance            |

**Important:** Originals is not a competing Commerce transaction engine.

All eligible products may use shared storefront, inventory, payment, production and fulfillment capabilities.

### 3.3 Services remain available

Custom, Business and Merch remain legitimate paths.

Their prominence should reflect actual availability, audience needs and strategic purpose.

They do not need to dominate the retail-focused homepage.

---

## 4. Initial Customer & Founder Jobs

### 4.1 Core retail customer jobs

**JTBD-RF-01 — Discover**

Find apparel designs by style, theme, interest, collection or creator.

**JTBD-RF-02 — Evaluate**

Understand garment quality, fit, sizing, design appearance, price and availability.

**JTBD-RF-03 — Purchase**

Select an eligible variant and complete a trustworthy purchase with minimal unnecessary effort.

**JTBD-RF-04 — Understand fulfillment**

Know whether the item is ready-stock, made-to-order, or preorder, with accurate expectations.

**JTBD-RF-05 — Recover**

Recover from unavailable stock, payment uncertainty, invalid delivery details or interrupted checkout without duplicate commitments.

**JTBD-RF-06 — Track and resolve**

Obtain trustworthy post-order information and request help when something goes wrong.

**JTBD-RF-07 — Return**

Explore other suitable products, collections or creators, and reorder where eligible.

### 4.2 Founder jobs

The founder should be able to:

- approve curated artwork;
- inspect IP and licensing evidence;
- prepare products for publication;
- manage pricing and availability;
- see orders that genuinely require physical work;
- identify stock/capacity exceptions;
- execute or delegate production and QC;
- fulfill eligible orders;
- understand economic contribution by design;
- identify unfulfilled customer commitments;
- track creator obligations when relevant.

### 4.3 No unnecessary manual quotation

A standardized retail product should not require the buyer to negotiate production specifications that TeeStock has already defined.

Unusual, unsupported or genuinely custom configurations may be routed to the appropriate assisted process.

---

## 5. Retail-First Information Architecture

This section defines product emphasis, not new canonical URLs or a final sitemap.

### 5.1 Recommended homepage priority

1. Curated product discovery and visual brand identity.
2. Featured eligible collections or themes.
3. Product standard and buying confidence.
4. Approved creator collaborations and Originals storytelling.
5. Helpful category discovery.
6. Secondary Custom/Business/Merch paths.
7. Customer support and brand information.

Do not infer that all content must appear in the first viewport.

Progressive disclosure and mobile readability remain controlled by CX-03 and CX-08.

### 5.2 Navigation concept

A proposed customer-facing navigation hierarchy is:

- Shop
- Collections
- Creators, when verified content exists
- Originals, when an approved collection exists
- Custom
- For Business
- Support

The final number of top-level items, labels and URLs require IA validation.

Creator and Independent Label pages must not appear as operational when there is no eligible content or approved rights.

### 5.3 Product card minimum

Product cards should show meaningful, validated information:

- product image;
- product name;
- collection or appropriate attribution;
- verified price basis;
- availability qualification where appropriate;
- a relevant, permitted action.

Do not expose complex manufacturing details merely because they exist in the backend.

### 5.4 Product detail page

A product detail page should answer:

- What exactly am I buying?
- How does it look?
- What garment and material is used?
- Which size should I choose?
- What colors or variations exist?
- What will I actually pay?
- When and how will it be fulfilled?
- What if there is a problem?

Artist/storytelling content can enhance discovery without obscuring key commercial information.

---

## 6. Pre-Transaction vs Transactional Experience

### 6.1 Retail discovery before checkout readiness

The first retail-facing experience can be nontransactional when the financial and operational backend is not ready for live orders.

Allowed target capabilities, subject to IP and publication policies:

- curated brand storytelling;
- product/collection preview;
- garment information;
- creator attribution;
- verified size and quality information;
- truthful availability/launch information;
- real support/contact routes.

Prohibited misleading behavior:

- working-looking checkout with no real order contract;
- invented live stock count;
- invented payment success;
- fabricated shipping promises;
- treating a wishlist or inquiry as a paid order;
- publishing artwork lacking sufficient usage rights.

### 6.2 Transactional retail

A paid retail customer journey requires:

1. Sellable published product and variant.
2. Valid commercial and rights eligibility.
3. Approved final price and applicable charges.
4. Honest stock/capacity/delivery basis.
5. Checkout and relevant customer protections.
6. Authorized payment flow.
7. Correct order creation and reconciliation.
8. Proper downstream production or fulfillment.
9. Customer support and recovery.
10. Independent release assurance.

The checkout may be postponed without postponing retail-focused product strategy work.

---

## 7. End-to-End Customer and Operating Journey

### Journey RF-JRN-01 — Curated product discovery

**Customer:** lands on TeeStock, finds a theme, browses products, opens a product detail page.

**Frontstage:** responsive product imagery, relevant filters when justified, coherent category navigation, accurate product descriptions.

**Backstage:** approved catalog, source of design, rights, product/variant and channel publication status.

**Founder activity:** maintain curation and product approval; no manual processing per anonymous page view.

**Failure:** no results or unavailable content yields useful alternatives, not a false empty state.

### Journey RF-JRN-02 — Product evaluation

**Customer:** selects garment/size/color and reviews price and fulfillment mode.

**Frontstage:** accurate size chart, variant imagery, material description, availability mode and delivery qualification.

**Backstage:** canonical product, variant, pricing and stock/capacity data.

**Founder activity:** exception review only when information cannot be verified.

**Failure:** invalid combination does not become a purchasable configuration.

### Journey RF-JRN-03 — Retail purchase

**Customer:** reviews cart, delivery and final terms; initiates approved payment.

**Frontstage:** clear total amount, deliberate confirmation, honest pending/confirmed outcome.

**Backstage:** trusted order, payment and inventory command boundaries with stable identity and recovery.

**Founder activity:** no recurring manual re-entry for ordinary eligible purchases.

**Failure:** duplicate click, timeout or callback loss cannot produce misleading confirmation or uncontrolled duplicate financial effects.

**Release condition:** CX-S1 transactional gate passed.

### Journey RF-JRN-04 — Made-to-order production

**Customer:** waits for fulfillment of an eligible made-to-order product.

**Frontstage:** realistic status and delivery expectations.

**Backstage:** inventory allocation, production assignment, correct artwork/version, QC and shipment readiness.

**Founder activity:** perform or delegate physical production, QC and packing as needed.

**Failure:** material shortage, wrong artwork or QC failure enters a traceable exception path.

### Journey RF-JRN-05 — Customer recovery

**Customer:** checks order status or reports an issue.

**Frontstage:** verified, privacy-preserving status and accessible support.

**Backstage:** canonical order, shipment, financial and case/return information.

**Founder activity:** handle material cases, not answer repetitive factual questions manually where safe automation is available.

**Failure:** unknown provider/operation status is shown as unknown or under review, not falsely marked successful.

### Journey RF-JRN-06 — Creator collaboration product

**Customer:** discovers a product associated with an approved creator.

**Frontstage:** appropriate creator identification, storytelling and product details.

**Backstage:** artwork provenance, license, attribution, product linkage and applicable royalty policy.

**Founder activity:** approve creator participation and material rights/commercial terms.

**Failure:** expired or unapproved rights prevent unauthorized new sales.

Creator earnings and payouts must follow their canonical Finance/Legal governance, not a customer-facing product UI assumption.

---

## 8. Existing CX-01 Requirement Reconciliation

**Default decision: preserve all 46 existing `CX1-FR-001..046` identifiers and all 15 `CX1-NFR-001..015`.**

Do not rename, delete or renumber merely because the strategic emphasis is changing.

### 8.1 Parent requirement groups

| Existing IDs  | Current concern                         | Retail-first interpretation                                                                    |
| ------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `FR-001..005` | Discovery and public trust              | Make Shop more prominent while preserving valid Custom/Business routing                        |
| `FR-006..008` | Search, PDP and personalization         | Product discovery becomes a key retail design priority; personalization remains optional       |
| `FR-009..019` | Custom and Business                     | Preserve functionality, but do not make the customer platform's overall identity service-first |
| `FR-020..028` | Retail commerce                         | Primary customer transaction journey when CX-S1 gates pass                                     |
| `FR-029..037` | Account, status and customer care       | Prioritize trustworthy post-order outcomes; retain authorization gates                         |
| `FR-038..040` | Founder operations and fallback         | Apply founder-burden reduction to ordinary retail orders as well as assisted inquiries         |
| `FR-041..042` | Channel integration and notification    | Keep bounded; do not equate retail-first with marketplace-first                                |
| `FR-043..046` | AI, telemetry and advanced integrations | Preserve staged, optional rollout based on proof of value                                      |

### 8.2 No automatic P0 rewrite

Existing P0/P1/P2 priorities were defined relative to the assisted-sales-first program.

Retail-first introduces a different product emphasis but does not automatically convert every P1 retail requirement to P0.

Recommended distinction:

- **Strategic priority:** retail curated apparel becomes the commercial/product focus.
- **Discovery-design priority:** Shop and authentic curated product presentation receive earlier attention.
- **Binding transaction release:** remains gated by CX-S1 dependencies.

The existing numerical priority field should only be changed through a controlled, approved PRD revision with traceability updates.

### 8.3 CX-S0 interpretation

Current CX-S0 is a premium public entry and assisted-services slice.

Proposed retail-first correction is **not to redefine CX-S0 as a paid retail launch**.

Instead evaluate a bounded Shop discovery component alongside the currently permitted public-entry capabilities, without fictional sellability.

If that cannot be delivered honestly within the existing CX-S0 scope, define a separately governed nontransactional design slice rather than silently expanding a committed work package.

### 8.4 CX-S1 interpretation

CX-S1 remains the earliest candidate for eligible customer-controlled retail transactions.

Product planning should give CX-S1 high strategic attention while engineering continues verifying financial integrity, authorization, inventory, provider and operational capacity prerequisites.

### 8.5 Existing crosswalk preservation

`CX-PKG-STAGE-CROSSWALK-R1.md` remains the current draft crosswalk for all 46 requirements until reviewed and formally replaced or amended.

Proposed retail-first alignment must identify the exact changed cells and reasons. A wholesale rebuild of the crosswalk without evidence is prohibited.

---

## 9. CX-00..09 Document-by-Document Change Matrix

| Document | Current owner scope               | Proposed bounded reconciliation                                                                               |
| -------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| CX-00    | Source and gap audit              | Append strategic source change and current PR #77 research intake context                                     |
| CX-01    | Master product outcomes           | Clarify retail-first business goal, primary customer cohort, Shop-focused outcome hierarchy                   |
| CX-02    | Customer journeys                 | Promote retail journey study to primary product-research focus without deleting service journeys              |
| CX-03    | Interaction and experience design | Study retail-led homepage, collection discovery, PDP, size choice, progressive disclosure                     |
| CX-04    | Commerce & checkout               | Use existing detailed retail spec; reconcile additional requirements only where a genuine gap is demonstrated |
| CX-05    | Custom/B2B experience             | Preserve current semantics and gated scope; do not rewrite merely to reduce visual prominence                 |
| CX-06    | Customer account and service      | Strengthen eligible retail order/status, returns and guest recovery trace                                     |
| CX-07    | Omnichannel                       | Reorder future business value hypotheses without activating provider integrations                             |
| CX-08    | Quality and acceptance            | Add retail-centered customer tasks and founder-minute evidence, preserving existing gates                     |
| CX-09    | Delivery and validation           | Separate strategic retail priority from technical readiness and pilot sequencing                              |

### 9.1 R2 companion disposition

Imported DP-01..10 are **candidate deepening proposals**, not independent replacements for CX-01..09.

Any accepted R2 detail must be mapped to the correct existing document owner.

Examples:

- DP-01 → CX-01 outcomes and requirement clarity.
- DP-02 → CX-02 storyboards.
- DP-03 → CX-03 interaction.
- DP-05 → CX-04 commerce.
- DP-06 → CX-06 account and service.
- DP-07 → CX-07 channel boundaries.
- DP-08 → CX-08 evidence.
- DP-09 → CX-09 staging.
- DP-10 → documentation integrity and adoption review.

The separate Retail Commerce Operating Blueprint supplies operating context, not an alternative CX-04 transactional specification.

### 9.2 Source consolidation rule

Do not permanently maintain three competing versions of the same normative requirement.

Adopt approved deltas into their established owner documents, preserving historical source references and IDs.

Keep intake/research material non-authoritative until disposition is recorded.

---

## 10. Candidate Retail Design Clarifications

These are proposed refinements, not new canonical requirement IDs.

| Candidate  | Product outcome                                                                | Primary owner                    | Existing anchors             |
| ---------- | ------------------------------------------------------------------------------ | -------------------------------- | ---------------------------- |
| `RF-CR-01` | Retail discovery is easy to find and understand                                | CX-01/03                         | `FR-001`, `FR-005`           |
| `RF-CR-02` | Selects/Originals/Essentials are presented without confusing business taxonomy | CX-03/04                         | `FR-001`, `FR-006`           |
| `RF-CR-03` | Product attribution and rights-sensitive publication are truthful              | Commerce/IP + CX-04 presentation | `FR-002`, `FR-007`, `FR-020` |
| `RF-CR-04` | Customer can choose correct garment, color and size                            | CX-04                            | `FR-007`, `FR-020`           |
| `RF-CR-05` | Customer understands ready stock vs made-to-order vs preorder                  | CX-04                            | `FR-007`, `FR-027`           |
| `RF-CR-06` | Purchase completion never relies on invented provider truth                    | CX-04/08                         | `FR-023..026`                |
| `RF-CR-07` | Post-order status does not require unnecessary founder intervention            | CX-06/08                         | `FR-029..032`, `FR-044`      |
| `RF-CR-08` | Collection and creator discovery can support later repeat purchase             | CX-03/04/06                      | `FR-006`, `FR-035`           |
| `RF-CR-09` | Custom/Business remain accessible but not dominant by default                  | CX-01/03/05                      | `FR-001`, `FR-009..015`      |
| `RF-CR-10` | Full customer experience remains fast without optional AI                      | CX-03/08                         | `NFR-001..015`               |

Each candidate requires semantic trace review before changing a parent PRD.

---

## 11. Product Staging & Delivery Boundary

### Stage A — Retail Product Definition

Scope:

- retail positioning;
- customer cohorts;
- design/garment/collection presentation;
- Shop navigation;
- product card and PDP concepts;
- synthetic journey testing;
- licensing and product eligibility study.

No payment or production changes.

### Stage B — Nontransactional Retail Discovery

Scope, only when separately approved:

- truthful Shop/collection/product content;
- accessible browsing experience;
- links to actually supported customer actions;
- honest unavailable states;
- basic performance evidence.

No checkout implied.

### Stage C — Controlled Retail Transaction

Scope, only after respective gates:

- eligible sellable catalog;
- cart and total amount;
- secure checkout and payment;
- canonical order and inventory behavior;
- production/fulfillment;
- customer recovery.

This maps conceptually to CX-S1, not a new entitlement or existing release milestone.

### Stage D — Repeatable Curated Operations

After actual transactions provide evidence:

- measure contribution;
- identify popular designs;
- reduce manual interventions;
- improve inventory and production;
- pilot creator economics;
- validate channel expansion.

### Stage E — Extended Ecosystem

Evidence-gated:

- deeper creator participation;
- repeat-purchase features;
- selected marketplace integration;
- advanced Originals collections;
- potential Independent Labels;
- bounded AI assistance.

Stages A–E are a **business product reasoning sequence**, not replacement identifiers for canonical launch Stages A–H or customer-platform `CX-S0..S3`.

---

## 12. No-Regret Work vs Gated Work

| Work                                 | Can be prepared now?       | Notes                                          |
| ------------------------------------ | -------------------------- | ---------------------------------------------- |
| Retail customer journey research     | Yes                        | Nontransactional                               |
| Product information taxonomy review  | Yes                        | Reuse canonical model                          |
| Product card/PDP specifications      | Yes                        | UI design, not live sellability                |
| Creator licensing workflow design    | Yes                        | Legal review needed before real agreement use  |
| Sample/garment standard definition   | Yes                        | Actual sample proof required                   |
| Synthetic cart and checkout research | Yes, nonbinding            | No real charge or order effect                 |
| Live retail order creation           | No automatic authorization | Canonical command / security gates             |
| Live payment                         | No automatic authorization | Independent financial assurance                |
| Automated inventory reservations     | No automatic authorization | Concurrency and source-of-truth assurance      |
| Automatic creator payout             | No automatic authorization | Agreement, finance and authorization gates     |
| Marketplace synchronization          | No automatic authorization | Provider/reconciliation gates                  |
| Autonomous AI commitments            | Deferred                   | Permissions, evaluations and recovery required |

---

## 13. Retail Acceptance Research Matrix

These are **candidate scenarios, NOT_EXECUTED**.

| ID            | Given / When                                 | Required observation                                                      |
| ------------- | -------------------------------------------- | ------------------------------------------------------------------------- |
| `RF-CX-AC-01` | First-time shopper opens the homepage        | Understands TeeStock's retail offer and can find Shop                     |
| `RF-CX-AC-02` | Visitor explores Selects                     | Does not misinterpret creator artwork as necessarily TeeStock-owned       |
| `RF-CX-AC-03` | Visitor explores Originals                   | Understands collections without requiring knowledge of internal divisions |
| `RF-CX-AC-04` | Visitor encounters an unavailable item       | No misleading buy CTA                                                     |
| `RF-CX-AC-05` | Visitor changes size/color                   | Media and information reflect valid variant                               |
| `RF-CX-AC-06` | Variant is unavailable                       | Safe explanation, no invented stock                                       |
| `RF-CX-AC-07` | Buyer compares MTO with ready stock          | Understands differences in fulfillment expectations                       |
| `RF-CX-AC-08` | Product image fails                          | Material buying facts remain accessible                                   |
| `RF-CX-AC-09` | Buyer navigates by keyboard/mobile           | Essential tasks remain accessible                                         |
| `RF-CX-AC-10` | Buyer returns from interrupted checkout      | No uncontrolled duplicate payment/order                                   |
| `RF-CX-AC-11` | Payment remains unknown                      | No false success or unsupported retry                                     |
| `RF-CX-AC-12` | Stock changes during checkout                | Final availability revalidated                                            |
| `RF-CX-AC-13` | Unauthorized visitor requests order data     | No customer data leak                                                     |
| `RF-CX-AC-14` | Production encounters wrong artwork version  | No fulfillment-ready claim                                                |
| `RF-CX-AC-15` | Customer reports defect                      | Clear safe recovery path                                                  |
| `RF-CX-AC-16` | Creator agreement expires                    | No unauthorized new sale                                                  |
| `RF-CX-AC-17` | Founder faces several standard retail orders | Avoidable data re-entry can be measured                                   |
| `RF-CX-AC-18` | Shop encounters empty results                | Offers helpful next action without fabricating catalog                    |
| `RF-CX-AC-19` | Custom customer enters from homepage         | Can still reach valid Custom path                                         |
| `RF-CX-AC-20` | AI is unavailable                            | Standard shopping and support remain usable                               |

Product research completion is not financial or production release acceptance.

---

## 14. Founder Burden & Business Outcomes

### 14.1 Minimum outcome scorecard

| Measure                                    | Question                                                                      |
| ------------------------------------------ | ----------------------------------------------------------------------------- |
| Retail discovery task success              | Can shoppers find relevant products?                                          |
| PDP comprehension                          | Can buyers explain fit, size, price and fulfillment mode?                     |
| Eligible checkout completion               | Can buyers finish valid purchases?                                            |
| Failed/unknown payment recovery            | Can problems resolve without duplicated financial effects?                    |
| Manual founder touches per order           | How often must the founder intervene?                                         |
| Manual founder minutes per completed order | How much actual work remains?                                                 |
| Order contribution                         | Does a transaction create positive contribution at the defined finance layer? |
| Defect/rework rate                         | Is production repeatable?                                                     |
| Support contacts per order                 | Does self-service reduce unnecessary communication?                           |
| Creator obligations accuracy               | Can royalty-eligible transactions be explained and reconciled?                |

### 14.2 Measurement discipline

Before live activity, use explicit synthetic baselines and moderated task research.

After pilot transactions, use observed data with source and measurement period.

Do not claim conversion, product-market fit, founder-hour savings or AI effectiveness merely from a prototype or documentation review.

All thresholds must be registered before using outcomes to justify expansion.

---

## 15. Material Risks and Decision Gates

### `RF-RISK-01` — Strategic drift

**Risk:** Technical implementation readiness determines brand direction instead of business evidence.

**Response:** Separate strategic priority from technical rollout and preserve Owner decision authority.

### `RF-RISK-02` — Premature checkout

**Risk:** Retail-first urgency bypasses payment/authorization assurance.

**Response:** Block live binding transaction until independently verified relevant gates pass.

### `RF-RISK-03` — Product catalog without commercial feasibility

**Risk:** Attractive designs cannot be produced, fulfilled or sold profitably.

**Response:** Require rights, material, sample, costing and capacity readiness.

### `RF-RISK-04` — Founder overload

**Risk:** Demand increases faster than physical ability to fulfill it.

**Response:** Capacity-aware order admission and honest lead times.

### `RF-RISK-05` — Creator/IP exposure

**Risk:** Unlicensed artwork is published or used beyond its agreement.

**Response:** Rights validation and publication hold.

### `RF-RISK-06` — Document sprawl

**Risk:** Existing CX-00..09, DP-01..10, operational blueprint and retail-first proposal become multiple competing normative sources.

**Response:** One semantic owner per requirement; research proposals remain non-authoritative until integrated.

### `RF-RISK-07` — Imported source integrity uncertainty

**Risk:** Manifest SHA/size claims do not match committed content.

**Response:** Independently reconcile PR #77 against original local bytes and current HEAD, update provenance accurately, and resolve out-of-scope changes.

---

## 16. Owner Decision Proposal

### Proposed Decision `RF-DEC-01`

**Subject:** Initial TeeStock Commercial/Product Focus.

**Recommended statement:**

> TeeStock will prioritize curated graphic apparel retail as its initial consumer-facing commercial and product strategy, supported by Selects, limited Essentials, carefully scoped Originals experiments, and selected licensed creator collaborations. Custom and Business remain valid secondary services and existing verified MGBOS capabilities remain reusable. Retail transaction activation remains independently gated by finance, security, inventory, operational readiness and explicit release authorization.

**Status:** ADOPTED_BY_OWNER (2026-10-20; recorded via DEC-TS-2026-012).

### Proposed Decision `RF-DEC-02`

**Subject:** Retail Customer Platform Product Emphasis.

**Recommended statement:**

> TeeStock customer experience planning shall make curated retail discovery and eventual eligible retail purchase its primary consumer journey. Existing Custom/Business customer journeys shall be retained. Early nontransactional retail discovery may be separately planned without presuming the platform can yet accept paid retail transactions.

**Status:** ADOPTED_BY_OWNER (2026-10-20; recorded via DEC-TS-2026-012).

### Proposed Decision `RF-DEC-03`

**Subject:** Documentation Adoption Method.

**Recommended statement:**

> Retain the existing CX-00..09 documentation as the product-definition baseline. Reconcile and selectively incorporate independently reviewed R2/Retail-First deltas into their semantic owner documents, preserving existing requirement identifiers, source provenance, launch gates and history. Avoid creating a competing Master PRD.

**Status:** ADOPTED_BY_OWNER (2026-10-20).

These proposals require formal Owner adoption under repository governance before corresponding source documents are changed.

---

## 17. Engineering HQ Review Mandate

After Owner decision and PR #77 source-integrity closure, request independent read-only Engineering HQ assessment:

1. Verify exact current main and all affected PR HEADs.
2. Resolve PR #77 source integrity and documentation routing.
3. Revalidate `DEC-TS-2026-009` scope and dependencies.
4. Identify any capability already implemented that is directly reusable for retail.
5. Identify missing product/catalog/artwork/variant/checkout capabilities without speculating new root entities.
6. Assess R4/R5 and remaining finance/security dependencies for retail payment.
7. Classify which changes belong to business canon, CX-01..09, engineering architecture and implementation work packages.
8. Produce a bounded change plan for documentation reconciliation.
9. Keep active Custom/Business pilot obligations intact unless explicitly revised.
10. Return independent QA requirements before any adoption or implementation.

No independent implementation or GitHub write is authorized by this document.

---

## 18. Documentation Integration Plan

The eventual integration sequence should be:

### Step 1 — Source integrity

Close PR #77 provenance discrepancies, verify all imported source identities, and maintain source distinction between research and canon.

### Step 2 — Material Owner decision

Record or explicitly reject `RF-DEC-01..03` through the applicable TeeStock Decision Register process.

Preserve superseded decisions historically.

### Step 3 — Canonical strategy reconciliation

Update the governing business strategy and roadmap documents to reflect the adopted commercial focus without deleting verified operational achievements.

### Step 4 — CX master reconciliation

Update CX-01 product outcomes and CX-02 customer-journey emphasis; preserve all 46 parent FRs and 15 NFRs unless an approved semantic change requires a clearly documented revision.

### Step 5 — CX specialist reconciliation

Apply accepted, bounded content to CX-03/04/05/06/07/08/09 according to ownership.

Maintain `CX-PKG-TRACE-R1.csv`, stage crosswalk and decision records.

### Step 6 — Independent documentation QA

Audit changed requirements, acceptance semantics, customer journey coverage, contradictory stages, source links, metadata and authority boundaries.

### Step 7 — Governed engineering planning

After product authority is established, separately plan implementation IC/WP and staged testing.

Do not turn the documentation integration PR into an application implementation PR.

---

## 19. Acceptance Criteria for This Reconciliation

| ID             | Acceptance obligation                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `RF-DOC-AC-01` | Retail-first intent is precisely stated without claiming formal roadmap supersession               |
| `RF-DOC-AC-02` | Current main and PR #77 sources are pinned                                                         |
| `RF-DOC-AC-03` | Product focus, experience focus, engineering sequence and first live transaction are distinguished |
| `RF-DOC-AC-04` | All 46 CX1-FR IDs remain intact                                                                    |
| `RF-DOC-AC-05` | All 15 CX1-NFR IDs remain intact                                                                   |
| `RF-DOC-AC-06` | Retail checkout remains gated                                                                      |
| `RF-DOC-AC-07` | Custom/Business workflows are preserved                                                            |
| `RF-DOC-AC-08` | Selects, Originals and Creator Program semantic ownership remains correct                          |
| `RF-DOC-AC-09` | IP, financial and inventory rules reference existing owners                                        |
| `RF-DOC-AC-10` | No new MGBOS entity, RPC or ledger is implicitly created                                           |
| `RF-DOC-AC-11` | PR #77 source integrity concerns are documented                                                    |
| `RF-DOC-AC-12` | Independent review and actual user research are not falsely marked as passed                       |
| `RF-DOC-AC-13` | Proposed decisions are not labeled active                                                          |
| `RF-DOC-AC-14` | Existing CX-00..09 are not silently replaced                                                       |
| `RF-DOC-AC-15` | Owner can approve the commercial consequence without answering low-level technical questions       |
| `RF-DOC-AC-16` | Any future engineering write remains separately governed                                           |

These are documentary acceptance requirements, not records of completed runtime testing.

---

## 20. Review Status and Limits

### Author-level verification

Performed:

- exact current main discovery;
- PR #77 HEAD discovery;
- existing CX package inventory review;
- retail requirement and stage crosswalk inspection;
- relevant R2 proposal reading;
- business and MGBOS authority-boundary review;
- bounded priority and semantic collision analysis;
- PR #77 manifest-to-tree size comparison;
- design-level consistency review of this reconciliation.

Not performed:

- SHA-256 verification against Owner's original local files;
- full independent line-by-line acceptance of all imported files;
- actual customer usability testing;
- approved retail pricing and SKU setup;
- running MGBOS security/financial integration tests;
- runtime deployment or live retail checkout;
- repository validators executed against this new document;
- independent Product/UX/Engineering HQ signoff.

### Final document disposition

**Status:** ACTIVE.

**Product direction:** RETAIL_FIRST_ADOPTED.

**Canonical adoption:** ADOPTED (2026-10-20).

**Implementation:** NOT_AUTHORIZED.

**Required next authority:** Formal Owner decision and independent cross-source reconciliation.

---

# Final Product Principle

**Retail-first does not mean building everything immediately.**

It means designing the customer platform and its supporting operating capabilities around the business TeeStock actually intends to prioritize.

The future platform should make curated apparel easy to discover, evaluate, purchase and receive.

The backend should make each successfully sold product easier to produce, fulfill, reconcile and learn from.

The founder should spend less time re-entering data, reconstructing customer conversations and manually managing avoidable exceptions.

The system must remain truthful and controlled even when more designs, creators, brands, products and sales channels are added.

**Build the right retail business. Preserve trustworthy operations. Expand from verified demand and capacity.**

---

**END — CX-PKG-RETAIL-FIRST-RECONCILIATION-R1 v0.1.0**

**Authority:** NON-CANONICAL RESEARCH / REVIEW  
**Implementation authorization:** NONE  
**Deployment authorization:** NONE  
**Next action:** PR #77 source-integrity closure, then Owner and Engineering HQ strategic reconciliation
