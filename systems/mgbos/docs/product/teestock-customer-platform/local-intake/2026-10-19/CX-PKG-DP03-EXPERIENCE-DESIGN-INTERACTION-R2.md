---
canonical_id: proposed.mgbos.product.teestock-customer-platform.dp03-experience-design-r2
status: DRAFT
version: 0.2.0
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: PENDING_OWNER_AND_INDEPENDENT_PRODUCT_REVIEW
document_class: product-design-and-interaction-change-proposal
scope: teestock-customer-platform-cx03-experience-design-deepening
normative_authority: NONE
repository: Rizkybuilds/bisnishub
source_ref: main
source_baseline_commit: 57eaafbb0ceef99a5fc6b2d77d724f6ff510727d
source_cx03_blob_sha: e6dd0801cbfd6171cec90b1d9ec1f1f66c094bd1
source_cx01_blob_sha: 3602550f5d54c8b58512014b54ec916d9b75f3e4
source_cx02_blob_sha: f77bca68b26ebf1132b1076f152e72dcbba0a7df
source_cx08_blob_sha: 96ea99276255189a12fe59084f94f91337b5062d
source_brand_blob_sha: c96f83cd1d990899cabe8f8765318c0ec61e7f24
source_ia_blob_sha: bb99d0ce520a01a19970eb7bc5c4c8b955e6ac6c
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DP03-EXPERIENCE-DESIGN-INTERACTION-R2.md
baseline_checked: 2026-10-17
research_mode: SOURCE_GROUNDED_PRODUCT_DESIGN_AND_EXTERNAL_STANDARDS
self_review: PERFORMED
independent_review: NOT_PERFORMED
customer_research: NOT_PERFORMED
prototype_execution: NOT_PERFORMED
performance_measurement: NOT_PERFORMED
engineering_readiness: NOT_ASSESSED
implementation_authorization: NONE
merge_authorization: NONE
deployment_authorization: NONE
supersedes: null
depends_on:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - bisnis/teestock/02-brand/brand-identity-system.md
  - bisnis/teestock/02-brand/voice-and-copy-system.md
  - bisnis/teestock/10-product-tech/digital-product-vision.md
  - bisnis/teestock/10-product-tech/website-information-architecture.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md
  - systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-TRACE-R1.csv
---

# DP-03 — TeeStock Next-Level Experience Design & Interaction Contract R2

> **Disposition:** `COPY_READY / AUTHOR_SELF_REVIEWED / DRAFT / NON-CANONICAL`. This is a bounded design-deepening proposal that **augments** the existing `cx-03-experience-design-interaction-spec.md`. It is not a second canonical design system, not a brand revision, not working UI code, and not authorization to implement. Proposed behavior remains subject to Owner product approval, applicable business and security policies, and governed technical feasibility review.

## 0. Executive outcome and definition of “next level”

**North Star:** *Powerful underneath, effortless on the surface.*

**Customer promise:** TeeStock should be pleasant, clear, fast, capable, and dependable from first impression through product selection, Custom/B2B inquiry, eligible purchase, progress tracking and after-sales support. The customer should not be required to understand internal apparel production, databases, vendors or organizational structure.

**Founder promise:** Every accepted customer action should produce useful, authorized, reusable information and clear next actions instead of duplicate manual data entry and repetitive explanations. Physical procurement, human QC, packing, courier handoff and consequential decisions remain visible and assigned.

**Design signature:** **Neutral Core + Expressive Product Layer** (existing brand source). Calm visual structure, excellent product media, precise typography, unambiguous actions, refined feedback, and functional depth revealed only as needed. Feature density is an implementation capability, not a reason to overwhelm the first screen.

**Four independent quality tests:**

1. **Comprehension:** Can a new customer identify an available action without internal jargon?
2. **Capability:** Can an eligible customer finish the task and recover from predictable failures?
3. **Trust:** Does the interface represent commercial and operational facts without exaggeration?
4. **Efficiency:** Does the task avoid unnecessary customer effort and reduce founder admin work?

An attractive mockup alone is not product acceptance. This document specifies testable intentions, not measured success.

## 1. Source, boundaries and evidence

### 1.1 Exact source situation

Inspected `main`: `57eaafbb0ceef99a5fc6b2d77d724f6ff510727d` (2026-10-17). PR #75 merged the CX-00..09 DRAFT package; PR #76 merged the initial TeeStock premium public entry. Actual inspected UI source offers informational `/`, `/custom`, `/business` and `/support/contact`; it does **not** establish operational public intake, live checkout, logged-in customer workspace, visual custom builder, live AI help or marketplace adapters. Contact activation remains gated in customer-facing copy. These are repository observations, **not deployment/runtime certification**.

CX-03 existing v0.1.1 already defines fifteen design principles (`CX3-DP-01..15`), twelve token categories (`CX3-DS-001..12`), twelve universal presentation states (`CX3-STATE-01..12`), twenty component behavior obligations (`CX3-IC-01..20`), sixteen interaction rules (`CX3-IX-01..16`), twelve screen patterns (`CX3-SP-01..12`), quality contracts and thirty candidate acceptance cases (`CX3-AC-001..030`). **Do not renumber or replace these IDs.**

The local chat-generated DP-01 and DP-02 artifacts exist as proposed drafting inputs but were **not observed on inspected GitHub `main`**. If adopted later, pin their actual repository commits. The six proposed `SX-01..06` names are conceptual groupings that map into existing `CX2-BP-01..08`, not new system lifecycles.

### 1.2 Semantic ownership table

| Subject | Authority to respect | DP-03 contribution |
|---|---|---|
| TeeStock identity, official palette, logo, photo and voice | `bisnis/teestock/02-brand/` | Recommend usage in product UI; do not replace approved assets |
| Customer jobs, homepage and navigation taxonomy | `website-information-architecture.md` | Specify interaction and visible behavior; do not rename the four jobs |
| Parent FR/NFR, journey goals | Existing CX-01 and CX-02 | Refine cross-screen UI evidence and interaction scenarios |
| Visual patterns, component states | Existing CX-03 | Add implementation-independent specimens, design decisions, prototype checklist |
| Product selection, checkout, quotation, customer account | CX-04/05/06 | Present required UI states only; no new business facts |
| Marketplace and message provider rights | CX-07 and provider policy | Presentation of actual provider context and failures |
| Performance/accessibility/release evidence | CX-08 | Specify experience constraints to be assessed by CX-08 |
| Timing and business launch | Solo-Founder Roadmap and CX-09 | No implicit delivery commitment |
| Payment, identity, financial, stock and production state | Governed MGBOS architecture and business policy | UI projections only; no database enum, API, permission or command definition |
| AI tools, capabilities and delegation authority | JARVIS/Head Engineering owners | Optional UI experience; no automatic high-risk actions |

### 1.3 Design maturity vocabulary

- `SOURCE_APPROVED`: existing applicable brand/business/IA decision, preserved.
- `PROPOSED_DESIGN`: design behavior or option recommended in this packet, **not approved**.
- `DEPENDENCY_GATED`: requires approved data, policy, provider, identity or financial assurance.
- `NOT_IMPLEMENTED_OR_NOT_VERIFIED`: no evidence sufficient to claim real working capability.
- `RESEARCH_REQUIRED`: must be tested with representative users before final product adoption.
- `LAB_NOT_MEASURED` / `FIELD_NOT_VERIFIED`: no actual performance result; never translate to PASS.

## 2. Visual direction — one calm system, many rich experiences

### 2.1 Brand expression, without inventing a rebrand

Use the existing TeeStock brand philosophy: **neutral, confident, deliberate, contemporary, product-led**. Identity should feel capable and dependable for a B2B buyer yet tasteful for a retail customer. Product imagery, Originals labels and selected editorial content may be expressive. Critical actions, pricing, account security, confirmation and checkout retain the shared calm visual grammar.

**Do:** restrained page structure; confident typographic hierarchy; real product images; intentional white space; readable differences among commercial states; consistent controls and copy.

**Do not:** prescribe a new logo, font family, proprietary image pack, unapproved campaign colors, or decorative 3D as mandatory UI. Neither website product photography nor social proof can be fabricated. Temporary neutral UI may use existing implementation tokens only as source observations, not as newly approved canonical brand hex values.

### 2.2 UI design language proposal (`DP03-VL-*`)

| ID | Direction | Expected visible behavior | Anti-pattern |
|---|---|---|---|
| `DP03-VL-01` | Calm canvas | Sections are ordered by customer decision; decoration never competes with the next action | Four equal-priority hero buttons or cluttered carousel |
| `DP03-VL-02` | Product-first editorial | Garment material, cut, size, color and work quality presented with licensed/approved evidence | Generic fake catalog imagery masquerading as sellable SKU |
| `DP03-VL-03` | Hierarchy by meaning | Each screen has identifiable page title, context, primary action and optional details | Heading hierarchy only encoded in font size |
| `DP03-VL-04` | Deliberate accents | Brand accent highlights actual action/focus, not every card | Color alone determines paid, approved or error status |
| `DP03-VL-05` | Structured density | Simple views breathe; B2B details may be denser with progressive sections | Shopping page looks like internal ERP |
| `DP03-VL-06` | Trustful information | Price qualifiers, uncertainty, revision and lead time visible before decisions | Fine print conceals material conditions |
| `DP03-VL-07` | Functional animation | Motion explains transitions/feedback without adding steps | Scroll-jacking, obligatory autoplay, distracting parallax |
| `DP03-VL-08` | Resilient beauty | Content and controls survive missing images, web fonts, reduced motion and slow networks | Empty hero/CTA when assets fail |

### 2.3 Design token dictionary: semantics, not arbitrary constants

CX-03's twelve `CX3-DS-*` categories remain the sole proposed token family. For implementation-facing design review, maintain a **token decision ledger** with: `token category`, `semantic role`, `source brand reference`, `proposed value`, `contrast validation`, `responsive usage`, `owner decision`, `status`, `tested artifact`.

| Existing category | Reviewable decision to make | Example purpose (NOT approved token names/values) |
|---|---|---|
| `CX3-DS-001` Brand core | Which brand source version controls the product surface? | Logo and accent provenance |
| `CX3-DS-002` Surfaces | Which layers are visible in bright/dim media scenarios? | Base, raised, inset, inverse |
| `CX3-DS-003` Text | What does each text role mean and how is contrast confirmed? | Primary, secondary, supporting, error |
| `CX3-DS-004` Border/focus | How does keyboard focus differ from hover and semantic errors? | Focus ring and separators |
| `CX3-DS-005` Actions | Which action hierarchy and states are consistently used? | Primary, secondary, tertiary, material/danger |
| `CX3-DS-006` Feedback | How are pending, success, information, stale and uncertain facts distinct? | Status icon + plain-language text |
| `CX3-DS-007` Typography | Which source-approved fonts and responsive scales are used? | Display/heading/body/numerals/labels |
| `CX3-DS-008` Spacing/sizing | What rhythm and safe hit areas work on mobile? | Reading width, form gap, sticky spacing |
| `CX3-DS-009` Shape/elevation | When is a card, sheet, menu or dialog used? | Grouping without shadow overload |
| `CX3-DS-010` Media | What rendition and fallback applies per context? | Hero, PDP gallery, proof rendition |
| `CX3-DS-011` Motion | Which duration/easing families and no-motion equivalents? | Feedback, disclosure, overlay |
| `CX3-DS-012` Layering | How do focus, sticky, popover and dialog coexist? | No obscured CTA, error or keyboard focus |

**Freeze rule:** Product may approve the *meaning* of a token before Head Engineering chooses exact CSS values, system fonts, responsive breakpoints or library implementation. Do not paste proposed values into upstream brand identity without brand ownership approval.

### 2.4 Typography and imagery experience rules

- Headline explains the offer or task before campaign language; avoid oversized type that pushes the actual CTA off common mobile viewports.
- Body copy stays readable at normal and zoomed text sizes; numerals for prices, quantities and quote versions should remain unambiguous.
- Product photography shows real variations, fit and material where available; if images do not represent final options, disclose that.
- Image gallery makes still images usable without hover; zoom is optional and accessible; layout space is reserved to avoid shifting.
- AI-generated or speculative visual output must be distinguishable from approved product/production imagery; artwork preview is not a proof of output quality.
- Missing imagery has descriptive text and useful fallback; never hide size/price/CTA because image retrieval failed.

## 3. Information hierarchy and public navigation

### 3.1 Shared navigation contract

Reuse the four existing primary jobs: **Shop, Customize, For Business, Build Merch**. Each job routes to a genuinely available experience or is visibly informational/unavailable. Other customer capabilities belong in contextual secondary navigation. The homepage is a router, not the entire company or a portal dashboard.

- On desktop: clear brand anchor, limited primary destinations, search/account only when functional, and easily discoverable support.
- On mobile: closed-by-default navigation, open/close state, keyboard operation, Escape behavior when appropriate, managed focus and no underlying unwanted scroll on overlays.
- Deep link: customer can identify location and next step without visiting homepage first; expired/retired offer links show helpful and truthful recovery.
- Returning users: navigation does not change unpredictably just because optional personalization/AI is unavailable.
- Visually rich product landing may have campaign-specific compositions but the essential action grammar must remain unchanged.

### 3.2 Context hierarchy for six signatures

| Signature | Primary decision | Secondary content | Deferred content |
|---|---|---|---|
| `SX-01` Discovery | Find an available product or correct route | Category, size, material, filters | Personalized recommendations/AI |
| `SX-02` Custom | Explain requested result and submit complete enough intent | Garment/options/artwork readiness | Advanced 2D/3D editor, exact preview |
| `SX-03` Business | Request credible quote/approval path | Procurement documents, revisions, stakeholders | Multi-role workspace until verified |
| `SX-04` Commerce | Verify current amount and commit when eligible | Fees, shipping, returns disclosures | Promotion complexity not relevant to purchase |
| `SX-05` Living Order | See verified state and next required action | Milestones, proof, support, reorder | Proactive AI if unverified |
| `SX-06` Connected Commerce | Understand source platform and actionable status | Provider-specific terms, support/reconciliation | Universal live sync dashboard until proven |

The design must support cases where a future signature is only **informational** in an earlier slice, with no fake action.

## 4. Screen anatomy contract and specimens

Each screen specimen must name: `screen ID`, `signature`, `stage`, `actor`, `job`, `entry route`, `essential content`, `primary/secondary CTA`, `permission/eligibility`, `loading-empty-error-uncertain-recovery`, `mobile adaptations`, `keyboard/screen reader behavior`, `source of displayed truth`, `analytics exclusions`, and `linked acceptance ID`.

### 4.1 Twelve existing screens: deeper acceptance shapes

| Existing pattern | Minimum screen anatomy to preserve | Required difficult state |
|---|---|---|
| `CX3-SP-01` Home/offer router | Positioning, four intents with honest capabilities, truthful proof, usable next actions | Unsupported offer and invalid deep link |
| `CX3-SP-02` Shop discovery | Category/collections, published catalog, applied filters, sort state, product media | Legitimately empty catalog vs failed retrieval |
| `CX3-SP-03` PDP | Title, images, size/color/mode, pricing basis, availability, CTA | Variant became unavailable or price became stale |
| `CX3-SP-04` Custom entry/intake | Purpose, quantity, product type, requested date, artwork readiness, review | Missing file, incomplete spec, uncertain submission |
| `CX3-SP-05` Business inquiry | Organization use case, contact, quantity, procurement needs, review process | Unsupported due date or unknown procurement term |
| `CX3-SP-06` Confirmation | Accurate event title, stable valid reference, summary, next step, support | Server timed out: no false accepted receipt |
| `CX3-SP-07` Artwork/proof | File receipt, safety/review state, approved proof version, permitted next action | New proof supersedes old version |
| `CX3-SP-08` Cart/checkout | Items, current options, fees, delivery, reviewed amount, deliberate payment action | Price/stock shift; pending payment |
| `CX3-SP-09` Tracking | Verified status, freshness, next customer action, supported help | Backend unavailable or delayed vendor event |
| `CX3-SP-10` Account/quote/reorder | Authorized identity, contextual actions, history, quote/proof versions | Unauthorized org access; stale reorder offer |
| `CX3-SP-11` Support/returns | Problem context, evidence request, acknowledgment, next step | Request received but refund not approved |
| `CX3-SP-12` AI/editor | Explicit opt-in, supported capability, fallback, source limits, cost/latency guard | Model/provider offline, unsupported configuration |

These are refinements of existing proposed screen contracts, not instructions to ship all screens at once.

### 4.2 Screen specimen `DP03-SCR-01` — Premium homepage

**Goal:** First-time mobile visitor understands TeeStock, its capabilities and the correct next step.

**Proposed visual composition:** unobstructed skip-to-content; brand/header; concise hero promise; one dominant CTA for the currently active primary journey and visible alternative paths; approved garment/product image; honest capability labels; proof-of-work/process explanation; help/contact status and footer. The identity panel can be visually expressive but must not displace meaningful first-screen information.

**Mobile:** media may appear below headline and actionable CTA; no mandatory video; menu works with touch/keyboard; no horizontal scroll or sticky element that conceals focus. **Empty/error:** a missing hero image leaves text and CTA working; no live contact provider → informational guidance, not a fake WhatsApp button.

**Acceptance intent:** a new participant identifies relevant active path and correctly distinguishes available versus future capabilities.

**Trace:** `SX-01`, `CX3-SP-01`, `CX3-IC-01..03`, `CX1-FR-001..005`, `DP03-AC-01..03`.

### 4.3 Screen specimen `DP03-SCR-02` — Guided Custom inquiry

**Goal:** Customer who does not know print terminology can express a viable request without guessing.

**Initial group:** product kind, intended use, approximate quantity, requested date, artwork status, acceptable contact path. **Progressive group:** print placement, sizes, decoration method, delivery details, procurement constraints — **only if required by chosen option and business intake policy**. The choice of one-page form versus wizard remains a usability hypothesis.

**Review:** structured customer-readable summary; unknown answers clearly marked; estimate/formal quote wording never conflated; consent separate from marketing. **Upload:** selected → transferring → received (file only) → review pending / needs correction → approved proof only via authorized process. **Submit:** `SUBMITTING` → `RECEIVED` only on durable authorized receipt; if outcome unknown, `RECOVERY_REQUIRED` with safe status-check path.

**Mobile:** labels persist, virtual keyboard does not hide bottom action, field errors visible and associated, back navigation preserves safe work when lawful. **Founder benefit:** single structured intent instead of WhatsApp transcription.

**Trace:** `SX-02`, `CX3-SP-04/07`, `CX3-IC-04..09`, `CX1-FR-009..015`, `DP03-AC-04..09`.

### 4.4 Screen specimen `DP03-SCR-03` — Business quote request / review

**Goal:** Company procurement contact understands what is being requested and what TeeStock is actually committing to.

**Proposed visual composition:** B2B intent with examples grounded in real offers; project basics; volume and distribution requirements; procurement document needs only as appropriate; request summary; factual review/quotation stage. If digital quote approval is separately activated, show **exact version**, scope, validity, approver rights and deliberate acceptance action. Do not treat a buyer's job title or client-supplied organization ID as proven authority.

**Mobile:** long specifications grouped by decision, table/card adaptation without suppressing legally or commercially material fields. **Unknown data:** no instant fixed quote or production slot promise. **Founder:** price/capacity and approval exceptions explicitly routed for review.

**Trace:** `SX-03`, `CX3-SP-05/10`, `CX1-FR-014..017`, `DP03-AC-10..12`.

### 4.5 Screen specimen `DP03-SCR-04` — Retail PDP → cart → checkout

**Goal:** eligible customer confidently selects an actual product and pays only after viewing authoritative terms.

**Proposed visual composition:** product media plus text; variant names and values; material/sizing; truthful price/availability and fulfillment mode; obvious cart action for eligible item. Cart groups line items, changes, charges, stock and reconfirmation. Checkout requests necessary delivery/contact details and shows total before commitment. Guest route subject to approved identity/security policy.

**Critical divergence:** normal cart emptiness differs from unavailable catalog API; client redirect differs from verified payment; stale stock requires reconfirmation, not a hidden adjustment. Loading skeleton must not masquerade as product availability. **Mobile:** sticky CTA must not occlude fields, keyboard focus or terms; price summary always reachable.

**Trace:** `SX-01/SX-04`, `CX3-SP-02/03/08`, `CX1-FR-020..027`, `DP03-AC-13..16`.

### 4.6 Screen specimen `DP03-SCR-05` — Living order and customer action center

**Goal:** customer understands verified progress, next action and how to seek help.

**Proposed visual composition:** permitted order/request reference; readable current status and freshness; primary next required action (or no-action-needed); concise milestone history; authorized proof/quotation documents; direct service/help action. If customer does not own the resource, the response must not reveal private existence or details.

**Critical:** `production started`, `QC passed`, `handed to courier`, `paid` derive only from authoritative facts; planned progress is visually distinct. Unavailable data is not an empty order list. No raw vendor cost, internal margin or secret production notes.

**Trace:** `SX-05`, `CX3-SP-09/10/11`, `CX1-FR-029..036`, `DP03-AC-17..20`.

### 4.7 Screen specimen `DP03-SCR-06` — Connected channel + optional intelligence

**Goal:** customer understands where order/payment rights live when they entered through a marketplace or external channel.

**Proposed visual composition:** source label, permitted status, verified next step, channel-specific resolution link if approved, recent update recency or uncertainty. Notifications state facts only after governed events. Optional AI explains from permitted retrieval and escalates; it never authorizes discounts, refunds, production, payment or confidential data access on its own.

**Failure:** provider outage shows `status temporarily unavailable` with safe channel-owned path; duplicate callback does not appear as duplicate purchase; AI failure leaves normal navigation and service available.

**Trace:** `SX-06`, `CX3-SP-11/12`, `CX1-FR-040..046`, `DP03-AC-21..23`.

## 5. Component specification matrix

The following is a **presentation contract** for existing `CX3-IC-01..20`. Each row is a design review obligation, not an instruction to add a new component package or database object.

| Existing ID | Component group | Visible states / interaction anatomy | Accessibility and recovery |
|---|---|---|---|
| `CX3-IC-01` | Primary CTA | Clear label, true destination, active/unavailable state | Focus visible; no dummy link |
| `CX3-IC-02` | Global menu | Closed/open/selected; active route | Escape and focus restoration where relevant |
| `CX3-IC-03` | Offer eligibility notice | Published, not-yet-available, assisted-only | Text plus icon; not color alone |
| `CX3-IC-04` | Input field | Label, hint, requiredness, value, inline error | Error association; retains other safe values |
| `CX3-IC-05` | Conditional group | Reveal, skip, revalidate | Predictable focus; hidden stale value not silently submitted |
| `CX3-IC-06` | File/artwork input | Selected, uploading, received, under review, rejected | Type/limit guidance, non-drag alternative |
| `CX3-IC-07` | Date expectation | Requested vs verified schedule separately labelled | Not only badge color; no guaranteed date guess |
| `CX3-IC-08` | Submission receipt | Sending, authoritative receipt, unknown outcome | Stable reference; retriable/status-check path |
| `CX3-IC-09` | Quote summary | Estimate, draft, approved version, expired | Version and action meaning visible |
| `CX3-IC-10` | Data result | Legitimate empty, backend unavailable, unauthorized | Separate text and recovery; no data existence leakage |
| `CX3-IC-11` | Search/filter/sort | Applied filters, loading, no matches, fetch failed | Keyboard controls, clear-all affordance |
| `CX3-IC-12` | Variant picker | Available, unselected, selected, unavailable | Size/color explicit text alternative |
| `CX3-IC-13` | Cart summary | Eligible, changed price/stock, reconfirm needed | No hidden price adjustment |
| `CX3-IC-14` | Payment result | Awaiting, pending, verified success, failed, uncertain | Provider-backed truth; no redirect-as-success |
| `CX3-IC-15` | Customer status | Verified, stale, absent, unavailable | Identity scoped; freshness and help visible |
| `CX3-IC-16` | Support action | Help, case request received, review pending | No auto refund/approval claims |
| `CX3-IC-17` | Proof panel | Illustrative preview, proof vN, superseded, approved | Exact version and accessible zoom alternatives |
| `CX3-IC-18` | B2B workspace | Authorized org, role action, restricted | Server-enforced rights, not front-end hiding only |
| `CX3-IC-19` | Optional AI helper | Idle, working, grounded reply, unsupported, offline | Labeled assistant, handoff, non-AI exit |
| `CX3-IC-20` | Heavy editor | Not loaded, loading, ready, unsupported, failure | Isolated bundle; non-editor fallback |

### 5.1 Minimum interactive component anatomy (`DP03-COMP-*`)

- `DP03-COMP-01` Button: meaningful verb, visible state, keyboard activation, only truly disabled when necessary, explaining unmet prerequisites nearby; irreversible actions require appropriately scoped confirmation.
- `DP03-COMP-02` Input: persistent label, example where useful, unit, helper/error text, required/optional semantics, safe autofill; never placeholder-only labeling.
- `DP03-COMP-03` Select/swatch: visible textual selected value, keyboard alternatives and availability; color swatches never solely distinguish variants.
- `DP03-COMP-04` Multi-step form: current step, previous safe review path, non-destructive back, field scope rationale and completion status; choose wizard vs single-page only after task testing.
- `DP03-COMP-05` Status banner: semantic category plus plain-language meaning, affected scope, next action, and freshness where necessary; pending must differ from success.
- `DP03-COMP-06` Dialog/drawer: role/label, managed initial/return focus, escape/close rules, background interaction control, not used for harmless notices.
- `DP03-COMP-07` Product card: confirmed image/content, variant/price basis and truthfully eligible next step; loading and image-error fallback.
- `DP03-COMP-08` Proof viewer: exact artifact/version, fidelity disclaimer, review decision rights, non-drag operation, accessible document fallback.
- `DP03-COMP-09` Help handoff: approved real route, context preservation with consent, response expectation only from business policy, no fake agent presence.
- `DP03-COMP-10` Inline assistance: clear machine-assistance label, grounding limits, ordinary task remains possible when assistant is unavailable.

Component design acceptance must reference the parent `CX3-IC-*` instead of replacing it.

## 6. Global interaction grammar and truthful state language

### 6.1 Twelve existing UI states

Existing `CX3-STATE-01..12` remain the canonical **proposed presentational vocabulary** for this package: `READY`, `NOT_APPLICABLE`, `UNAVAILABLE`, `LOADING`, `SUBMITTING`, `RECEIVED`, `VALIDATION_ERROR`, `UNAVAILABLE_DATA`, `EMPTY_RESULT`, `UNAUTHORIZED`, `STALE`, `RECOVERY_REQUIRED`.

**These are UI states, not MGBOS persisted enums.** A domain can expose more business transitions; the customer-facing state must be an authorized projection rather than a parallel mutable record.

### 6.2 Truth-first message grammar (`DP03-COPY-*`)

| ID | Context | Appropriate illustrative copy | Must not imply |
|---|---|---|---|
| `DP03-COPY-01` | Assisted request sent | “Permintaan diterima. Kami akan meninjau detailnya.” **only after confirmed receipt** | Paid order exists |
| `DP03-COPY-02` | Submit result unknown | “Kami belum bisa memastikan permintaan berhasil dikirim.” | Guaranteed rejection or acceptance |
| `DP03-COPY-03` | Artwork uploaded | “File diterima; kesesuaian produksi belum diperiksa.” | Final print proof approved |
| `DP03-COPY-04` | Requested deadline | “Tanggal yang diinginkan” | Committed handover date |
| `DP03-COPY-05` | Estimate | “Perkiraan biaya, menunggu peninjauan.” | Authorized binding quotation |
| `DP03-COPY-06` | Payment redirect | “Pembayaran sedang diverifikasi.” | Payment confirmed |
| `DP03-COPY-07` | No matching products | “Belum ada produk yang cocok dengan filter ini.” | Database service unavailable |
| `DP03-COPY-08` | Data fetch failed | “Data belum dapat ditampilkan. Coba lagi.” | User has no orders |
| `DP03-COPY-09` | Outdated quote/proof | “Ada versi terbaru yang perlu ditinjau.” | Old version may still be accepted |
| `DP03-COPY-10` | External channel | “Pesanan ini mengikuti ketentuan platform asal.” | TeeStock can override platform refunds |

All example strings need final brand voice and business policy approval. They are **not** legal disclosures or approved service-level commitments.

### 6.3 Feedback, time and interruption

- Trigger response must be perceptible immediately as an interaction state; feedback may confirm only that the UI received an action, not that a remote action succeeded.
- Determinate upload progress only when meaningful bytes/progress are known; do not simulate a backend percentage.
- Duplicate taps may be guarded on the UI but only canonical command idempotency/reconciliation may prevent duplicate business effects.
- On slow response, provide context; for material delays, allow safe status check/cancel where supported; never recommend a blind financial retry.
- Back/reload should preserve non-sensitive draft fields where lawful and feasible. Retention after close/session expiry is an explicit privacy and security product decision, not implicit local storage consent.
- For errors: identify affected field/task, explain how to fix it, preserve valid input, return focus to useful location and offer safe assistance.
- Notification toasts are supplemental: durable confirmations, quote versions and payment states must remain discoverable after a toast disappears.

### 6.4 Motion grammar and graceful reduction (`DP03-MOTION-*`)

| ID | Motion purpose | Proposal | Fallback / test |
|---|---|---|---|
| `DP03-MOTION-01` | Interactive acknowledgement | Subtle pressed/hover/focus cues with no layout shift | Text/state visible with animations disabled |
| `DP03-MOTION-02` | Disclosure | Short intentional reveal only for newly relevant content | Immediate content switch with reduced motion |
| `DP03-MOTION-03` | Navigation | Preserve spatial continuity without scroll hijack | Native navigation and stable focus |
| `DP03-MOTION-04` | Form progress | Honest spinner/skeleton only while awaiting known action | Accessible status text and non-animation fallback |
| `DP03-MOTION-05` | Product media | Optional non-blocking transitions | Static imagery, manual controls, no autoplay requirement |
| `DP03-MOTION-06` | Editor preview | Local optional motion, visually explains object changes | No-motion and button-based equivalent when applicable |

No arbitrary duration or animation payload is mandated here; the design team proposes values based on prototype observation, media constraints and approved token decisions. Avoid high-cost scroll listeners and large render-blocking motion libraries on ordinary routes. Honor `prefers-reduced-motion` in implemented UX.

## 7. Responsive adaptation contract

**Principle:** Responsive means adapting *tasks*, not simply shrinking desktop layouts.

| Situation | Required product behavior | Validation |
|---|---|---|
| Compact mobile viewport | One primary action visible or easily reachable; navigation does not consume screen | Common small-viewport browser tasks |
| Mobile software keyboard open | Focused field, inline error and submit/next controls not obscured | Real/representative device or reliable emulation |
| Sticky header/footer actions | Do not obscure focus, consent, price or form feedback; safe inset respected | Keyboard/zoom/reflow checks |
| Tablet/touch landscape | Product details and form flow preserve reading order | Portrait/landscape comparison |
| Desktop wide viewport | Richer comparison layout without requiring hover to understand functionality | Keyboard and pointer checks |
| Zoom/text enlarged | Preserve reflow, text and controls; no loss of content or functionality | WCAG 2.2 relevant zoom/reflow checks |
| Slow data connection | Meaningful content and safe navigation before optional enhancements | Declared throttled profile |
| Reduced motion or high contrast | Essential state readable without animation or color alone | Device/browser preference testing |

**Suggested product preference:** approximately 44 × 44 CSS-pixel targets for frequent tap controls where appropriate. This is not the WCAG 2.2 AA minimum: SC 2.5.8 is generally 24 × 24 CSS pixels **with exceptions**, whereas 44 × 44 relates to enhanced Level AAA SC 2.5.5. The actual applicable criterion and spacing exceptions must be checked. Do not force a literal 44px rule into dense inline links or all UI categories.

For reflow, follow WCAG criteria at the applicable viewing equivalence (including 320 CSS pixels wide at 400% zoom from a 1280 CSS-pixel reference) rather than inventing a blanket screenshot-based rule for inherently two-dimensional editor media. Any justified horizontal interaction must be limited to the media/data region and have accessible alternatives where applicable.

## 8. Accessibility and inclusive experience gates

**Proposed target:** WCAG 2.2 AA for released customer-controlled UI and relevant third-party content, not a certification or legal claim. The applicable W3C success criteria govern detailed evaluation; automated scans alone do not prove conformance.

**Keyboard and focus:** meaningful order, skip link, visible focus, focus not fully obscured by author-created sticky elements, managed dialog entry/exit, Escape only where pattern supports it; do not steal focus during background updates.

**Screen reader and language:** appropriate document language, semantic headings/forms, text equivalents, programmatic error descriptions, distinguish updated statuses, avoid noisy live regions that announce every keystroke.

**Touch and alternatives:** no hover-only information, sufficient target sizing/spacing, no mandatory dragging for artwork positioning when an accessible single-pointer non-drag alternative is needed by WCAG 2.2 SC 2.5.7; provide controls for move, resize or alignment if functionality is offered.

**Perception:** applicable contrast, icons combined with words, no color-only approval/payment indicators, content readable after zoom, images with meaningful alternatives, media with relevant accessible support.

**Authentication and commerce:** accessible sign-in/verification where deployed, minimize redundant entry, support password-manager/copy-paste where applicable, do not force puzzle-like cognitive tasks as sole identity mechanism.

**Evaluation requirement:** record exact URLs/screens/states, devices, browsers, assistive technologies, tested versions, severity, and user tasks. Use both automated screening and manual journey review. Treat untested capability as `NOT_VERIFIED`, not as PASS.

## 9. Performance-first rich capability contract

### 9.1 Core Web Vitals proposed quality targets

Reuse CX-08 goals at **75th percentile of sufficient relevant real visits**, reported separately for mobile and desktop:

| Metric | Proposed good threshold | Meaning |
|---|---|---|
| LCP | ≤ 2.5 seconds | Main visible content loads promptly |
| INP | ≤ 200 milliseconds | Interaction responsiveness |
| CLS | ≤ 0.1 | Visual stability |

**Evidence states:** `FIELD_VERIFIED` only after enough representative measurements; `LAB_MEASURED` is separately reported; `NOT_VERIFIED_FIELD` when traffic insufficient. No current values were measured for this proposal.

### 9.2 Route isolation and planned budgets (`DP03-PERF-*`)

| ID | Route group | Mandatory base experience | Optional load guard | Budget status |
|---|---|---|---|---|
| `DP03-PERF-01` | Home/public landing | Readable copy, real navigation, hero/CTA | No editor/AI/marketplace SDK prerequisite | `TBD_PROFILE` |
| `DP03-PERF-02` | Custom inquiry | Form/summary/recovery functional | Upload/preview tools only when actually used | `TBD_PROFILE` |
| `DP03-PERF-03` | Business | Procurement explanation and approved intake | No B2B portal bundle on informational entry | `TBD_PROFILE` |
| `DP03-PERF-04` | Catalog/PDP | Product info, variant/price/availability truth | Media variants and recommendation deferred | `TBD_PROFILE` |
| `DP03-PERF-05` | Checkout | Trusted amount and payment steps | Campaign effects and AI excluded from critical path | `TBD_PROFILE` |
| `DP03-PERF-06` | Account/tracking | Verified status/help | AI summaries loaded only by legitimate intent | `TBD_PROFILE` |
| `DP03-PERF-07` | Advanced editor | Governed opt-in and clear loading | Isolate canvas/3D/fonts/assets from regular routes | `TBD_PROFILE` |

Before implementation acceptance, Head Engineering/Frontend QA shall derive specific per-template JS/CSS/font/media/network, CPU and responsiveness budgets from reproducible representative profiling, not numbers invented from a static page. Record device/network/cache profile, page version, test conditions, route and regression comparator.

**Optimization intention:** reserved media dimensions, responsive images, necessary hero/LCP asset prioritization, below-fold media deferral, restrained fonts, bounded third-party scripts, reduced expensive client-side hydration when unnecessary, progressive editor loading, resilient fallback when CDN/AI fails.

**Nonregression law:** Each new P1/P2 feature must be tested against the existing approved P0 critical routes. Advanced tools cannot degrade public task completion or performance merely because they are bundled into the application.

## 10. AI and 2D/3D configurator experience safety

### 10.1 AI assistance

Optional assistant may explain choices, organize input, propose questions, summarize approved catalog information and prepare nonauthoritative drafts. It must visibly acknowledge uncertainty and use a source-backed/context-limited answer. Customer task remains usable without the assistant. Do not claim live availability or instant quotes from generative text alone.

No AI tool/action may independently approve payment, refund, credit, price, customer rights, production readiness, or cross-organization data access. Tool permission, evaluation, costs, human escalation and data privacy must be approved by their semantic owners. UI never implies a human is online unless an actual approved operator/channel is staffed.

### 10.2 Advanced visual editor

Only after garments/placements, print/embroidery methods, production restrictions and proof rules are standardized and approved. **Illustrative visualization ≠ manufacturing proof ≠ valid commercial price ≠ permission to produce.**

Editor prototype must expose: model/product basis, supported zones, garment/color, position/scale controls, preview fidelity/disclaimer, explicit file/version, undo/redo only where supported, saved draft status, change consequences, error states, exit/fallback to assisted request. Drag-only placement is insufficient when alternative control is required for accessible operation.

Before eligible release, independently verify memory/resource use on mobile, image processing fallback, risky uploads, accessible controls, loss/resume behavior, revision semantics and performance regression on normal catalog routes.

## 11. Research prototypes and validation contract

### 11.1 Deliverables, not evidence of execution

| Artifact | Required content | Review owner | Current status |
|---|---|---|---|
| `DP03-DL-01` Screen inventory | All `CX3-SP-01..12`, stage, state, authoritative data source | Product/UX | PLANNED |
| `DP03-DL-02` Low-fidelity task flows | Six signatures; normal, error and interruption branches | UX research | PLANNED |
| `DP03-DL-03` High-fidelity specimens | Source-aligned branding, mobile/desktop, no invented real offers | Design/brand | PLANNED |
| `DP03-DL-04` Component and token decisions | Existing `CX3-DS-*` and `CX3-IC-*`; accessibility audit | Design+Frontend | PLANNED |
| `DP03-DL-05` Clickable prototype | At least critical P0 task paths; advanced ones as research prototypes only | UX | PLANNED |
| `DP03-DL-06` Moderated usability report | Participant segments, tasks, failed steps and fixes | Independent Product/UX | NOT_EXECUTED |
| `DP03-DL-07` Performance feasibility note | Route load strategy, lab budget proposal with evidence | Head Engineering | NOT_EXECUTED |
| `DP03-DL-08` Approval/decision log | Explicit Owner/semantic-owner approvals or deferrals | Owner/Head Engineering | OPEN |

### 11.2 Research task cards (`DP03-UR-*`)

- `DP03-UR-01` First-time visitor chooses between Shop, Customize, Business and Build Merch; recognizes unavailable capabilities.
- `DP03-UR-02` Custom buyer with no artwork completes request draft and understands reviewed-quote next step.
- `DP03-UR-03` Custom buyer whose upload fails corrects it without losing other form work.
- `DP03-UR-04` B2B buyer with procurement and approval needs identifies quotation version and appropriate approver action.
- `DP03-UR-05` Retail customer selects size/color and detects stock or price change before payment.
- `DP03-UR-06` Customer after slow payment redirect explains whether purchase is paid, pending or uncertain.
- `DP03-UR-07` Customer with proof v2 recognizes v1 is not the current approvable document.
- `DP03-UR-08` Returning customer finds current order stage and next action without contacting founder.
- `DP03-UR-09` Customer understands marketplace support and refund boundary.
- `DP03-UR-10` Founder receives accepted Custom intent and identifies next physical versus administrative actions without retyping.

For every test record participant segment (not personally identifying data), prompt, prototype revision, device, tasks, observables, failures, critical misunderstanding, assistance requests, evidence limitations and corrective proposal. Team roleplay may check flow completeness but is **not** representative external user evidence. Do not invent participant counts, completion percentages or user outcomes.

## 12. Proposed acceptance scenarios (not executed)

These IDs (`DP03-AC-01..26`) are local to this design proposal. They do not replace or renumber `CX3-AC-001..030` or `CX8-AC-*`. Evidence below is **required future proof**, not test results.

| ID | Given / when | Then (visible acceptance) | Required proof |
|---|---|---|---|
| `DP03-AC-01` | Mobile visitor opens home | Active primary route and capability boundaries are understandable without jargon | Prototype task + browser review |
| `DP03-AC-02` | Mobile nav expanded then Escape/back | User can close and focus returns without hidden interaction | Keyboard/mobile trace |
| `DP03-AC-03` | Hero image/font fails | Core copy, routing and CTA remain readable; no material layout loss | Fault-injected browser |
| `DP03-AC-04` | User starts simple Custom inquiry | Only necessary questions shown; optional details explain why | Task observation + state trace |
| `DP03-AC-05` | User has no artwork | Explicit valid “not ready” route avoids fabricated proof | Prototype + business policy review |
| `DP03-AC-06` | Upload fails type/size or network | Specific error and permitted alternative; valid fields preserved | Fault injection + form trace |
| `DP03-AC-07` | User submits twice or network times out | No fabricated receipt; safe check/recovery design; backend idempotency independently gated | Negative E2E and authorized backend test |
| `DP03-AC-08` | Request accepted durably | Stable receipt/reference, review status and next permitted action shown | Governed intake simulation + UI |
| `DP03-AC-09` | Customer inputs requested date | UI does not label it as committed delivery date | Copy and task comprehension review |
| `DP03-AC-10` | B2B buyer opens contact/quote path | Organization context and review requirements are understandable | Task test |
| `DP03-AC-11` | Buyer sees estimate/draft/approved quote | Visible vocabulary makes them distinguishable | Specimen comparison + usability test |
| `DP03-AC-12` | Wrong approver or superseded quote | No approval can succeed; no protected details leaked | Server authorization + UI negative test |
| `DP03-AC-13` | Retail picks variant | Size/color selected with text; truth and availability clear | Touch/keyboard/PDP test |
| `DP03-AC-14` | Shop returns zero vs backend fails | Empty and unavailable-data screens differ and allow recovery | Fault injection |
| `DP03-AC-15` | Stock/price changes in cart | Customer explicitly revalidates before charge | Browser + commerce command assurance |
| `DP03-AC-16` | Payment redirect without confirmation | Page shows pending/uncertain, not confirmed success | Provider sandbox/controlled simulation |
| `DP03-AC-17` | Authorized customer opens order | Verified status, freshness and next permitted action visible | Scoped-read E2E |
| `DP03-AC-18` | Unauthorized user probes another order | No existence/data leakage | Security negative tests |
| `DP03-AC-19` | Tracking provider stale/unavailable | No fictitious delivered milestone; safe help route shown | Provider failure simulation |
| `DP03-AC-20` | Proof changed from v1 to v2 | v1 action is visibly invalid and cannot be accepted | Version/authorization negative test |
| `DP03-AC-21` | Marketplace-origin purchase opens | Source platform and relevant terms are clear | Channel journey specimen |
| `DP03-AC-22` | AI unavailable or unsupported response | Customer's primary task remains usable and human fallback accurate | AI disabled/failure run |
| `DP03-AC-23` | Rich editor cannot load | User can still reach permitted assisted request; no false preview/proof | Editor failure simulation |
| `DP03-AC-24` | Keyboard, zoom and reduced motion used | No critical task becomes inaccessible in tested scope | Manual accessibility walkthrough |
| `DP03-AC-25` | P2 editor deployed | P0 routes still meet approved usability/performance regression gates | Measured lab/field as available |
| `DP03-AC-26` | Founder reviews accepted structured inquiry | Information is reusable; avoidable retyping and physical work separately recorded | Controlled operator rehearsal |

### 12.1 Trace to existing CX-03

| DP-03 group | Source requirement/contract | Related CX-02 / CX-01 | Downstream evidence owner |
|---|---|---|---|
| `AC-01..03` Home/nav | `CX3-SP-01`, `CX3-IC-01..03`, `CX3-AC-001..008` | `CX2-BP-01`, `CX1-FR-001..005` | CX-08 + CX-03 |
| `AC-04..09` Custom/forms | `CX3-SP-04/07`, `CX3-IC-04..09`, `CX3-AC-009..017` | `CX2-BP-02/05`, `CX1-FR-009..015` | CX-05 + CX-08 |
| `AC-10..12` B2B | `CX3-SP-05/10`, `CX3-IC-09/18` | `CX2-BP-03`, `CX1-FR-014..017` | CX-05 + security |
| `AC-13..16` Commerce | `CX3-SP-02/03/08`, `CX3-IC-11..14` | `CX2-BP-04`, `CX1-FR-020..027` | CX-04 + financial assurance |
| `AC-17..20` Account/order/proof | `CX3-SP-07/09..11`, `CX3-IC-15..17` | `CX2-BP-05/06`, `CX1-FR-029..036` | CX-05/06 + CX-08 |
| `AC-21..23` Channel/AI/editor | `CX3-SP-11/12`, `CX3-IC-19/20` | `CX2-BP-07/08`, `CX1-FR-040..046` | CX-07 + JARVIS + CX-08 |
| `AC-24..26` Quality/founder | `CX3-DP-08..15`, `CX1-NFR-001..015` | `CX2-OPS-01`, `CX1-FR-038..040` | CX-08/09 |

**Trace note:** All range references are to declared existing families; individual acceptance-case semantic fit must be rechecked at actual integration. This table is a planning crosswalk, not a generated rewrite of `CX-PKG-TRACE-R1.csv`.

## 13. Decision register, conflicts and staged scope

### 13.1 Proposed design decisions (`DP03-DEC-*`)

| ID | Proposed decision | Authority/status | Gate |
|---|---|---|---|
| `DP03-DEC-01` | Adopt calm master UI with expressive real products | Product + existing brand owner / PROPOSED | Source-aligned high-fidelity prototypes |
| `DP03-DEC-02` | Preserve four canonical customer jobs | Existing IA / SOURCE_APPROVED | No independent renaming |
| `DP03-DEC-03` | Design one strong active primary action per context | Product/UX / PROPOSED | User comprehension testing |
| `DP03-DEC-04` | Do not hardcode unapproved design tokens into product contract | Brand + Head Engineering / PROPOSED | Token decision ledger |
| `DP03-DEC-05` | Guided intake progressive by relevance; wizard not assumed | Product/UX + Business / PROPOSED | Prototype task tests |
| `DP03-DEC-06` | Require strong visible distinctions for request/quote/payment/proof | CX-01 + business/MGBOS / SOURCE_ALIGNED | Semantic and security reviews |
| `DP03-DEC-07` | Advanced editor and AI are opt-in, isolated, not base-page dependencies | Product + Head Engineering / PROPOSED | Profiling, cost, security review |
| `DP03-DEC-08` | Apply WCAG 2.2 AA and CWV target methodology from CX-08 | Existing CX-08 draft / PROPOSED | Independent QA + baseline |
| `DP03-DEC-09` | Prioritize zero re-entry for accepted founder-readable data | Product + MGBOS source owner / PROPOSED | Rehearsal and admin-work measurement |
| `DP03-DEC-10` | Freeze UI scope separately per CX-S0..S3 readiness | CX-09 + Launch Roadmap / PROPOSED | Product + Owner decision |

### 13.2 Existing open decisions not silently closed

Preserve `CX-PKG-DECISIONS-R1.md` status, especially `CX-DP-01..06` on first public entry, intake/channel/offer/budget, `CX-DP-11` first actual marketplace integration, `CX-DP-12/17` visual builder versus reviewed proofs, `CX-DP-13` AI timing, and `CX-DP-16` outbound availability sync. Owner agreement to the **vision** does not equal approval of costs, integrations, commercial terms or release scope.

### 13.3 Key product design risks (`DP03-RISK-*`)

| ID | Risk | Severity direction | Countermeasure |
|---|---|---|---|
| `DP03-RISK-01` | Visual ambition makes mobile basic task slow | Material for acquisition | Route isolation, image budgets and performance baselines |
| `DP03-RISK-02` | UI implies payment/production success without authority | Critical trust/financial | Customer projection reviewed against MGBOS invariants |
| `DP03-RISK-03` | User cannot recover long form after failure | High usability/founder re-entry | Safe draft handling and precise recovery cases |
| `DP03-RISK-04` | Stock/quote/proof shown stale but actionable | High transaction/service | Refresh, explicit reconfirmation and exact version controls |
| `DP03-RISK-05` | Sticky/overlay controls obscure keyboard content | High accessibility | WCAG reflow and focus audits |
| `DP03-RISK-06` | AI answers with fabricated policy or a fake human handoff | High trust | Grounded response, safe exit and tool boundary |
| `DP03-RISK-07` | Heavy editor dictates base frontend architecture | High maintenance/performance | Dynamic isolation, prototype cost and feasibility review |
| `DP03-RISK-08` | Duplicated design tokens drift away from business identity | Brand inconsistency | Token ledger with existing brand authority |
| `DP03-RISK-09` | Checkout concepts treated as currently sellable | High user harm | Honest state/capability flags and separate slice approval |
| `DP03-RISK-10` | Attractive self-service transfers admin burden to founder | Strategic failure | Structured intake, touch ledger and exception studies |

These are product-level risks; they are not engineering R-classifications, threat-model findings or release dispositions.

## 14. Controlled integration plan

**Target semantic owner:** `systems/mgbos/docs/product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md` (existing DRAFT v0.1.1).

This packet should remain as a **companion design-deepening proposal** until source and product review. When approved, integrate only well-evidenced, non-duplicative content into the existing CX-03 and update affected traceability/document indexes through a separately scoped PR.

| Proposed integration area | Existing CX-03 section | Delta to review | Do not modify |
|---|---|---|---|
| Premium character and brand application | 2, 5 | `DP03-VL-*`, token decision ledger, real-media hierarchy | Brand identity, logo or palette canon |
| Navigation and hierarchy | 4 | Four-intent mobile and deep-link specimens | Canonical IA names |
| Components and states | 6, 7 | `DP03-COMP-*`, copy/state matrix | `CX3-IC/STATE/IX` ID definitions |
| Custom and forms | 8 | Detailed form/upload/retry anatomy | Quote/production financial authority |
| Screen patterns | 9 | `DP03-SCR-01..06` grouped specifications | `CX3-SP-01..12` IDs |
| Responsive and accessibility | 10, 11 | Mobile keyboard/sticky/focus and WCAG checks | Upstream W3C success criterion meaning |
| Motion and performance | 12, 13 | Opt-in animation, route performance isolation | Invented runtime/performance PASS |
| Prototype and testing | 15..17 | Deliverables, `DP03-UR-*`, `DP03-AC-*` | Existing acceptance IDs or executed status |
| Decisions and risk | 18..20 | Explicit Owner decisions/uncertainty; stable QA | Head Engineering implementation scope |

**Integration prerequisites:**

1. Confirm current `main`, the latest CX-03 blob and relevant PR overlap; do not assume the inspected SHA remains current.
2. Reconcile this packet with actual DP-01/DP-02 GitHub revision if those files are subsequently committed, and existing CX-01/02/04..09.
3. Check source-approved brand tokens, copy policy and actual SKU/offer validity before approving visual specimens.
4. Review every proposed `DP03-*` acceptance against existing `CX3-AC-*` and traceability, remove duplication and preserve prior history.
5. Run document link, ID, Markdown and governance checks after repository edits.
6. Independent Product/UX review, accessibility-specialist review and Head Engineering feasibility review of material changes.
7. Obtain applicable Owner authorization before any IC/WP, app implementation, merge or deployment.

**Concurrency:** PR #73 documentation entrypoint routing remains separate; no direct change to root index, root README, product index or existing CX-03 is authorized by merely copying this companion file.

## 15. Delivery status, source register and self-review

### 15.1 Self-review checklist

- [x] Existing CX-03 design principles, twelve token categories, twelve states, twenty component groups, sixteen interaction rules and twelve screen patterns retained by reference.
- [x] Six signature experiences translated into distinct screen anatomy and truth-first action states.
- [x] Brand authority, navigation authority and MGBOS transaction boundaries preserved.
- [x] Performance ambition paired with measurable methodology, baseline unknowns and no invented byte/CPU figures.
- [x] WCAG 2.2 AA distinction from a 44px product preference preserved, with practical mobile/focus/reduced-motion behavior.
- [x] Optional AI and editor isolated from default user flow and authorizations.
- [x] Proposed new `DP03-*` IDs scoped to this document; no redefinition of existing CX3 IDs.
- [x] Negative cases cover unknown payments, unsupported offer, stale proof, cross-org privacy, outages and upload errors.
- [x] Owner decisions not silently marked approved and no technical implementation authority asserted.
- [x] Exact new path and inspected SHA identified.

### 15.2 Evidence classification

| Check | Disposition |
|---|---|
| Repo exact-source inspection | PERFORMED on named files at pinned SHA |
| Existing CX-03 identifier preservation | AUTHOR_SELF_REVIEWED |
| Original brand / IA ownership | SOURCE_ALIGNED |
| External W3C + web.dev standards lookup | PERFORMED (reference only) |
| Real prototype usability study | NOT_PERFORMED |
| Actual mobile/assistive technology usability verification | NOT_PERFORMED |
| Real Core Web Vitals field or lab measurements | NOT_PERFORMED |
| Independent product, design, accessibility or security acceptance | NOT_PERFORMED |
| Repository integration or CI | NOT_PERFORMED |
| Actual implementation/deployment | NOT_AUTHORIZED |

### 15.3 Internal sources (pinned at `main@57eaafbb0ceef99a5fc6b2d77d724f6ff510727d`)

- [Governance — Documentation Constitution](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/docs/governance/documentation-constitution.md)
- [Business — TeeStock Brand Identity System](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/02-brand/brand-identity-system.md)
- [Business — Website IA](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/10-product-tech/website-information-architecture.md)
- [CX-01 Master PRD](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md)
- [CX-02 Journeys](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md)
- [CX-03 Experience Design](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md)
- [CX-08 Quality](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md)
- [Traceability Matrix R1](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-TRACE-R1.csv)
- [Owner Decision Register R1](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DECISIONS-R1.md)

### 15.4 External methodology references (not implementation evidence)

- [W3C WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
- [W3C What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [web.dev Web Vitals](https://web.dev/articles/vitals/)
- [web.dev Core Web Vitals threshold definition](https://web.dev/articles/defining-core-web-vitals-thresholds)
- [GOV.UK patterns](https://design-system.service.gov.uk/patterns/)
- [GOV.UK form structure](https://www.gov.uk/service-manual/design/form-structure)
- [NN/g Ecommerce Product Page UX research](https://www.nngroup.com/reports/ecommerce-ux-product-pages-including-reviews/)

### 15.5 Final author disposition

**`DOCUMENT_STATUS = COPY_READY / AUTHOR_SELF_REVIEWED / DRAFT / NON-CANONICAL`**

This is a complete design-deepening packet for a governed future CX-03 integration review. It is suitable to copy as a new DRAFT companion file at the stated path **only at the inspected baseline**. No independent UX/QA results, performance scores, customer studies, or production behavior are claimed. Do not directly authorize builders from this packet.

**Next documentation work, after repository integration/baseline restoration:** `DP-04 — Custom & B2B Experience Deepening` (CX-05), followed by CX-04 commerce, CX-06 account, CX-07 omnichannel, CX-08 quality and CX-09 delivery, according to the documentation work plan. Each remains a separate reviewed document.

**End of document.**
