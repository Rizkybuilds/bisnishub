---
canonical_id: proposed.mgbos.product.teestock-customer-platform.dp04-custom-b2b-experience-r2
status: DRAFT
version: 0.2.0
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: PENDING_OWNER_AND_INDEPENDENT_PRODUCT_REVIEW
document_class: product-experience-research-and-change-proposal
scope: teestock-customer-platform-cx05-custom-b2b-deepening
normative_authority: NONE
repository: Rizkybuilds/bisnishub
source_ref: main
source_baseline_commit: 57eaafbb0ceef99a5fc6b2d77d724f6ff510727d
source_cx05_blob_sha: 4058e96a53a10feefe565fcb789ad6c59bd2534f
source_cx01_blob_sha: 3602550f5d54c8b58512014b54ec916d9b75f3e4
source_cx02_blob_sha: f77bca68b26ebf1132b1076f152e72dcbba0a7df
source_cx03_blob_sha: e6dd0801cbfd6171cec90b1d9ec1f1f66c094bd1
source_cx08_blob_sha: 96ea99276255189a12fe59084f94f91337b5062d
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DP04-CUSTOM-B2B-EXPERIENCE-R2.md
baseline_checked: 2026-10-17
research_mode: SOURCE_GROUNDED_PRODUCT_DISCOVERY_AND_EXTERNAL_UX_RESEARCH
self_review: PERFORMED
independent_review: NOT_PERFORMED
actual_user_research: NOT_PERFORMED
prototype_execution: NOT_PERFORMED
engineering_readiness: NOT_ASSESSED
implementation_authorization: NONE
merge_authorization: NONE
deployment_authorization: NONE
supersedes: null
depends_on:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - bisnis/teestock/04-services/custom.md
  - bisnis/teestock/04-services/business.md
  - bisnis/teestock/08-finance/pricing-framework.md
  - bisnis/teestock/10-product-tech/digital-product-vision.md
  - bisnis/teestock/10-product-tech/website-information-architecture.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-05-custom-b2b-ordering-experience.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md
  - systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-TRACE-R1.csv
  - systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DECISIONS-R1.md
---

# DP-04 — TeeStock Custom & B2B Experience Deepening R2

**Disposition:** `COPY_READY / AUTHOR_SELF_REVIEWED / DRAFT / NON-CANONICAL`

**Purpose:** A bounded, source-grounded *experience-deepening proposal* for existing `cx-05-custom-b2b-ordering-experience.md`. This is **not** a second canonical CX-05, a new MGBOS domain contract, an approved price or production policy, or permission to implement an AI/customization builder. It should be used to evaluate and eventually integrate precise product-experience deltas into the existing package via a separately authorized documentation review.

**Freeze boundary:** Product behavior may be specified at future-state depth; no statement here implies that corresponding UI, API, artwork processor, login, vendor connection, quote approval, payment, or fulfillment feature has been implemented or released. Any field labels and screen layouts are *candidates* pending product/brand review; no changes to active TeeStock service scope or existing launch roadmap are authorized.

---

## 0. Executive product decision

### 0.1 The experience problem

Customer wants personalized apparel or formal organizational procurement without learning garment construction, decoration methods, vendor coordination, or ERP concepts. Meanwhile, the solo founder cannot afford to repeatedly decode incomplete chats, recalculate uncertain quotes, chase stale artwork versions, or reconstruct approvals. A website that merely moves a WhatsApp conversation into a long form does not solve this problem.

**Design objective:** customer-facing simplicity must produce structured, reviewable operational intent. Build a *guided service experience* first and an advanced *capability-aware product studio* later. Both must use the same trustworthy commercial and operational boundaries.

**North Star:** **Powerful underneath, effortless on the surface.**

### 0.2 Defined product outcomes

| Stakeholder | Desired observable improvement | Anti-outcome |
| --- | --- | --- |
| First-time Custom customer | Can express needed product, quantity, deadline, design readiness, and contact choice; knows actual next step | Abandons from production jargon or forced design upload |
| Repeat Custom customer | Can reference prior permitted specification without repeating everything; current eligibility checked | Old pricing or approval silently reused |
| Business purchaser | Can express organization need, procurement constraints, and review a legitimate versioned offer | Confuses quotation, PO, invoice, payment, or production commitment |
| Business approver | Reviews exact authorized version, understands consequences and required follow-up | Shared URL alone grants commercial approval |
| Founder | Receives one coherent summary, missing-fact flags, and useful actionable next steps | Re-enters details from chat or supervises an expensive unreliable AI agent |

### 0.3 Priority distinction

- **`CX-S0` / P0 assisted experience:** Public information, supported Custom/Business routing, concise guided request *where actual intake is approved*, real contact fallback, durable acknowledgement only if a governed handler accepted it, and manually reviewed quotation. Existing approved Business/Custom pilot does **not** depend on a public storefront.
- **`CX-S1` retail commerce:** A separate eligible catalog/checkout capability owned by CX-04; not implied by Custom inquiry.
- **`CX-S2` / selective P1 advanced service:** Scoped quote/proof review, secure customer/B2B self-service and permitted reorders only after identity, security and operational evidence.
- **`CX-S3` / P2 optional intelligence:** Eligible configurator, accurately qualified visual preview, deterministic estimates on a standardized subset, and evaluated AI assistance. No promise of a universal instant-custom builder.

The priority labels in CX-05 (`P0/P1/P2`) and the release slices (`CX-S0..S3`) are **not interchangeable**. Existing CX-PKG-STAGE-CROSSWALK-R1 governs their proposed mapping. This R2 proposal may deepen each stage without rescheduling it.

### 0.4 Canonical boundaries

- Business offer, service, assortment, legal/IP, and pricing policy belong to TeeStock canonical business documents.
- MGBOS owns commercial records, permissions, order/payment/production state and audit/transaction semantics.
- CX-05 owns **customer-facing interaction requirements** and reviewable product behavior only.
- CX-03 owns global interaction/design grammar; CX-08 owns measurement and independent quality gates; CX-09 owns product validation/slicing.
- Optional JARVIS/AI may draft, structure and explain with grounded information. It cannot grant commercial authority or technical print certification.

**No new data entities, status enums, endpoints, roles, payment commands, legal terms, or hardware decisions are proposed here.**

---

## 1. Evidence and source reconciliation

### 1.1 Exact inspected baseline

- Repository `main` at `57eaafbb0ceef99a5fc6b2d77d724f6ff510727d`.
- Existing CX-05 v0.1.1 at blob `4058e96a53a10feefe565fcb789ad6c59bd2534f`, 46 `CX5-FR-001..046`, 26 `CX5-BR-001..026`, 40 `CX5-AC-001..040`, 8 named `CX5-JRN-01..08`, decision/unknown/risk sections.
- PR #75 (CX documentation) and PR #76 (public entry) were already merged at inspected main. Their merge status **does not prove** customer intake, public ordering or live site readiness.
- Earlier DP-01/DP-02/DP-03 conversational artifacts were prepared locally. They were **not found on inspected main** and thus are design inputs only; they are not cited as repository-authoritative evidence.
- The DP-04 target path did **not** exist on inspected main when checked.
- PR #73 was open/draft for separate documentation entrypoint routing. No file under that PR's declared four-file scope is to be modified by this proposal.

### 1.2 Existing capabilities already specified

| Existing CX-05 scope | Existing contract | DP-04 value-add |
| --- | --- | --- |
| P0 minimal intake | `CX5-FR-003..015`, `CX5-JRN-01` | Conditional decision map; specific screen/error behavior; founder handoff fixture |
| Formal B2B service | `CX5-JRN-02`, `CX5-FR-014..020` | Decision-maker and procurement role experience, quote comparison and handoff |
| Guided builder | `CX5-JRN-03`, `CX5-FR-039..043` | Constraint-driven decision logic and visible eligibility effects, not a new pricing engine |
| Artwork | `CX5-JRN-04`, `CX5-FR-008..009`, `029..030` | Clear upload/preview/proof-state vocabulary and recovery |
| Proof/quote lifecycle | `CX5-JRN-05..06`, `CX5-BR-008..012` | Exact-version customer decisions and adverse concurrent-change scenarios |
| Production, reorder | `CX5-JRN-07..08`, `CX5-FR-031..038` | Action center boundaries, sourcing/physical-work map, current-term reconfirmation |
| Protection and acceptance | `CX5-BR-001..026`, `CX5-AC-001..040` | Focused adversarial tests, research fixtures, measurable founder impact |

**Reconciliation policy:** Do not overwrite the existing 96 KB CX-05 with a compressed rewrite. Add carefully reviewed deltas to the relevant sections later; preserve existing requirement IDs and traceability.

### 1.3 External UX methodology

The form and approval patterns are informed by publicly available W3C accessible-form guidance and WCAG 2.2 error-prevention requirements. Ecommerce variation/product-detail patterns can be studied via Baymard's public research, but are **hypotheses for TeeStock**, not evidence that TeeStock customers have been tested. File safety is governed by security review; OWASP's unrestricted-upload guidance reinforces that upload is not merely a visual widget. References and limitations appear in section 17.

---

## 2. Personas, trigger conditions and route decisions

| Product actor | Situation/trigger | Primary job | Appropriate early experience | Special protection |
| --- | --- | --- | --- | --- |
| `DP04-SEG-01` Individual custom beginner | Has an idea but no technical terms | Explain needs, learn next step | Assisted Custom guided inquiry | No forced printing-method expertise |
| `DP04-SEG-02` Prepared custom buyer | Knows artwork, sizes and quantities | Submit accurate requirements | Structured summary and optional supported file | No false print-ready inference |
| `DP04-SEG-03` Small community/event organizer | Quantity and date may be uncertain | Determine feasibility | Custom or Business by real complexity | Requested date ≠ accepted delivery promise |
| `DP04-SEG-04` Organizational buyer | Multiple products/docs/procurement rules | Obtain reviewed quote | Business assisted intake | No fake consumer-cart contract |
| `DP04-SEG-05` Organizational approver | Has delegated commercial authority | Review exact quote/proof/terms | Assisted initially, scoped digital action later | Authorization verified server-side |
| `DP04-SEG-06` Returning B2B buyer | Wants to repeat or amend last order | Reuse permitted specification | Assisted initially; governed reorder later | Old amount/stock/terms revalidated |
| `DP04-SEG-07` Founder/operator | Must source, inspect, pack, ship | Work from one consistent requirement | Actionable intake and exception queue | No AI approval of irreversible actions |

### 2.1 Intent router

**Customer-visible choice:** `Customize` is for a personal/community garment project; `For Business` is for organization/procurement need. Route by **intent and procurement complexity**, not an invented minimum quantity or revenue threshold.

| Customer answer | Experience branch | Ask next | Never assume |
| --- | --- | --- | --- |
| “Kaos dengan desain saya sendiri” | Custom, simple guided | Garment family, rough amount, artwork readiness | Print method already known |
| “Seragam tim, perlu quotation untuk kantor” | Business assisted | Organization, purchase context, volume/date | Instant credit/contract |
| “Belum tahu teknik sablon” | Plain-language guidance, review | Desired visual outcome and material context | AI can certify method |
| “Bahan dari saya sendiri” | Special feasibility review | Material/source details if needed | Standard production eligibility |
| “Butuh cepat untuk event” | Deadline qualification | Needed-by date and destination | Vendor capacity available |
| “Perlu PO, beberapa pihak menyetujui” | Business procurement | Required docs, stakeholder responsibilities | PO equals seller acceptance or payment |
| “Mau desain 3D sendiri” | Future optional builder only when eligible | Explain supported limits and assisted alternative | Universal live builder exists |

The router must preserve non-sensitive context when the customer legitimately changes path. It must not send confidential B2B inputs across organizations or expose hidden offerings.

---

## 3. Signature Custom experience — start simple, grow deep

### 3.1 Experience architecture

The user is guided through **four conceptual customer decisions**, not necessarily four full-page wizard steps. A short form is preferable if moderated testing proves it quicker; a stepper is appropriate only if decisions are genuinely distinct. Layout selection remains a CX-03 prototype/test decision.

| Stage | Question on screen | Primary input | Customer understands after this stage | Founder receives |
| --- | --- | --- | --- | --- |
| `DP04-CUS-01` Intention | “Produk seperti apa yang ingin dibuat?” | Garment family, purpose, descriptive option | Supported options vs custom review | Valid need category + original words |
| `DP04-CUS-02` Quantity & context | “Berapa jumlah dan kapan dibutuhkan?” | Quantity, optional sizes/colors, requested date, destination context | Quantity may need correction, date not guaranteed | Quantity/size breakdown and urgency flag |
| `DP04-CUS-03` Artwork | “Sudah punya desain?” | Owned artwork if supported, help, or not ready | File received ≠ approved; assistance possible | Artwork readiness and allowed receipt reference |
| `DP04-CUS-04` Review | “Periksa permintaan sebelum dikirim” | Editable summary, contact, permission choices | Inquiry vs quote vs order; exact next step | One structured accepted request, only after validated submit |

For early assisted intake, technical production/placement questions remain conditional. Every customer has an explicit route for “belum tahu/belum ditentukan” **where approved business policy permits**. This is not a blanket waiver of required data before an actual quote or production release.

### 3.2 Screen anatomy — Custom entry

**Top region:** Brand-consistent short heading, a truthful description of the service and whether the current experience is assisted or self-service. Never show “Pesan Sekarang” if no real order path exists.

**Decision region:** One visually primary customer action (start a legitimately operating inquiry, or published contact/consultation if not yet active). Secondary information: supported product families, approximate process, artwork expectations and FAQ/help.

**Progress region (only if long form):** Meaningful stage names, current stage, a Back route, and indication whether changes are saved within the approved privacy model. Do not promise auto-save without actual durable mechanism.

**Evidence region:** Customer can review quantity, requested date, artwork status, conditional unknowns, and contact route before submission. Unconfirmed cost/lead time must be explicitly labelled.

**Recovery region:** Useful field error, unavailable backend, session expiration, file issue and human-assisted fallback. A notification does not substitute for an accepted backend receipt.

### 3.3 Conditional-field design contract

| Predicate / customer context | Reveal next | Don't force or hide silently | Revalidation |
| --- | --- | --- | --- |
| Garment selected | Eligible variant context if published | Supplier catalog or unverified availability | Garment change rechecks applicable options |
| Quantity supplied | Size distribution if necessary at this stage | Exact sizes in exploratory inquiry without policy | Final size totals must reconcile before approved commitment |
| Artwork “ready” | Approved upload/help | Unsupported active file preview | File receipt and review remain separate |
| Artwork “not ready” | Studio/help request and next-step explanation | Mandatory file input | Quotation must reflect design work if priced by policy |
| External material / unknown printing method | Special review explanation | Instant-price promise | Feasibility review gate |
| Tight requested deadline | Date + destination + warning that review is needed | Guaranteed slot or invented rush fee | Capacity confirmation required |
| Organization/procurement selected | Business fields and optional preservation of prior Custom context | Anonymous access to private company records | Permission and commercial requirements revalidated |
| Multiple delivery sites | Assisted Business context where needed | Unsupported automatic shipping total | Delivery plan and costs reviewed |

When switching choices invalidates dependent selections, explain which fields changed or need re-entry. Hidden stale values must not silently commit new print/price terms. Any input stored on the client must respect privacy, PII, artwork and retention policy.

### 3.4 Review-before-submit contract

An intended inquiry summary should disclose: garment/purpose; requested quantity and any size/color specification; decoration/artwork readiness; requested date and destination area where provided; unresolved details; contact method and consent; and the **meaning** of submission.

**Illustrative UI copy (not approved final marketing copy):**

> **Tinjau permintaan custom** — Ini adalah permintaan penawaran, bukan pesanan yang sudah dibayar atau jadwal produksi yang dikonfirmasi. Tim akan meninjau spesifikasi dan kesiapan bahan sebelum menyampaikan penawaran resmi.

**On accepted submit:** Show actual authorized reference, customer-safe summary, and approved next contact expectations. **On timeout/uncertain result:** “Kami belum dapat memastikan permintaan diterima”; offer safe status checking or governed recovery, not blind duplicate creation. **On rejected submit:** no fabricated reference or “success” banner.

### 3.5 Customer support and exit routes

A customer can correct fields, ask clarification, abandon without accidental order, or switch to an approved human channel without losing permitted context. If no approved digital contact route exists, the site must state that transparently; do not create a dead or fabricated WhatsApp destination.

---

## 4. Advanced Custom Studio — capability-aware, not an animation demo

### 4.1 Eligibility before visual richness

The future Studio (`CX-S3` target, not launch scope) only offers supported combinations. It uses a **proposal for product-level eligibility questions**, not an invented decision algorithm or pricing schema.

| Eligibility question | Required authoritative evidence | If absent or negative | Customer-facing result |
| --- | --- | --- | --- |
| Is the garment published/approved? | Product and commercial ownership | Show other legitimate offer or review | “Pilihan ini memerlukan konfirmasi” |
| Is this color/size/order mode valid? | Product variant/stock or make-to-order terms | Cannot directly commit | Clarify availability mode |
| Is the decoration method supported on this material? | Production technique/recipe policy | Human review | Explain incompatible combination |
| Is placement and area supported? | Approved method/product constraints | Human review or accessible alternative | Show eligible locations only |
| Is artwork technically suitable? | Human/approved specialized validation | Unapproved, not print-ready | Specific issue and next review |
| Is price determinable? | Valid pricebook/cost/discount authorization | No instant payable total | Indicative or reviewed-quote path |
| Is requested timeline feasible? | Verified vendor/material/capacity and logistics | No guaranteed date | Pending feasibility review |
| Are rights and approvals sufficient? | Approved IP/commercial/organization authority | Cannot release | Show remaining required action |

**Any unresolved required gate breaks the instant-commit path without breaking the customer's ability to request a human-reviewed quote.** The UI must not call the configuration “ready to produce” merely because a 2D/3D canvas rendered successfully.

### 4.2 Progressive builder layout (future-state specimen)

- **Desktop:** Product summary and preview adjacent to a focused option panel; commercial uncertainty and next step remain visible without hiding in a tooltip.
- **Mobile:** Product/preview in an expandable or contextual region, options in ordered groups, a persistent *accurate* action summary, no floating controls obscuring keyboard/focus, and a clear way to exit builder back to simple assisted request.
- **All devices:** Controls work without mandatory dragging; color swatches have readable names; selections are keyboard/AT operable; size labels explicit; focus/order preserved on change.
- **Advanced modes:** A 2D placement preview is the initial candidate. 3D/AR is research-led future enhancement, not a requirement for primary browsing or a proven conversion lever.

### 4.3 Derived-value invalidation

Changing a product, variant, quantity, decoration method, placement or artwork may invalidate earlier eligibility, estimate, lead-time context and visual composition. The experience must: (a) identify impacted selections, (b) preserve unaffected original customer input, (c) visibly mark stale derived results, (d) recompute only from authorized valid services when available, and (e) allow safe human review when it is not possible.

Examples: switch from cotton tee to an unverified fabric => old DTF estimate becomes `perlu pemeriksaan`, not reused; change 30 units to 300 => pricing/turnaround cannot silently stay approved; upload artwork v3 => previously approved v2 is not approval for v3.

### 4.4 Performance isolation

Basic Custom entry, FAQ and assisted inquiry must not eagerly download or initialize editor engines, 3D models, paid AI SDKs, or large design assets. Heavy preview is opt-in/route-scoped and has explicit download state, low-capability fallback, media-size and memory evaluation. Performance budgets and test hardware follow CX-03/CX-08 after actual profiling, not arbitrary numbers in this proposal.

---

## 5. Artwork intake, trust and preview/proof truth

### 5.1 Distinct conceptual events

| Event | What customer may see | What it DOES NOT mean |
| --- | --- | --- |
| Artwork absent | “Belum ada desain” + supported help path | Request itself must be rejected |
| Local file selected | File name/size, optional local visual preview | Server has received it |
| Upload in progress | Real transfer/progress if measurable | Stored, virus-checked or approved |
| Authoritative file receipt | “File diterima”, permitted reference | Rights verified, print-ready, or approved proof |
| Technical/rights review | Review or specific correction status | Acceptance automatically guaranteed |
| Illustration/mockup generated | “Pratinjau ilustratif” with accuracy limitations | Exact printable colors, position, scale, substrate |
| Official proof version issued | Exact version, scope, date and review choices | Customer has approved it |
| Customer approves exact proof | Durable authorized proof acceptance for exact version | Quote/order/payment/production automatically approved |
| Production release | Only if canonical business requirements independently satisfied | A visual UI action can bypass MGBOS |

Customer-visible text in this matrix is proposed wording, **not** canonical backend lifecycle enumeration.

### 5.2 Upload UI and file security

Candidate upload experience: explain supported formats/maximum size **only when verified by Production + Security**, label file purpose and privacy treatment, support mobile picker, show accessible failure message, allow replacement/removal where policy permits, and preserve non-sensitive inquiry context on failure. Do not hardcode `.AI`, `.SVG`, `.EPS`, `.PDF`, `.PNG` acceptance based on print-industry familiarity: production usability and safe browser/server processing are different questions.

Security owner must decide extension/MIME/content checking, malware scanning, quarantine, storage access, active-content handling, thumbnail generation, signed/private URLs, retention/deletion, and abuse limits. The customer experience must not embed raw active SVG or reveal file URLs that escape customer/organization scopes.

Customer ownership/licensing attestation is governed by approved terms. Upload alone never transfers IP rights or establishes permission to reproduce third-party marks.

### 5.3 Visual preview specification

A preview is intended to help customers inspect *relative placement, composition and scale*, not to assert physical color matching or printability. Show:

- garment style and selected variant context;
- decoration region / placement with readable labels;
- uploaded artwork identity/version and crop/orientation indicators where supported;
- preview fidelity qualifier and any known omissions;
- a text description / accessible alternative for critical decisions;
- controls to compare or reset without losing original source file;
- clear next action (request reviewed proof, send inquiry, or seek human help).

If the selected technique, color profile, garment dimensions or artwork pipeline is not modeled accurately, say so. No undemonstrated “1:1 accurate mockup”, DPI sufficiency or color-guarantee copy.

### 5.4 Exact-version proof review specimen

**Header:** `Periksa bukti desain — versi {verified version}`.

**Context:** Relevant order/inquiry reference, product/material, location, size/quantity scope, version creation or issue time, actor's legitimate relationship to order.

**Media:** Human-readable artwork or safe derived preview; keyboard-accessible zoom/contrast, no mandatory drag, downloadable artifact only if authorized.

**Difference panel:** Describe material changes versus prior approved/reviewed version, including position, colors, artwork, quantity or effects on pricing/date if verified.

**Consequences:** Explain precisely what proof approval confirms and what it **does not** confirm (commercial price, legal rights beyond policy, payment receipt, production readiness).

**Actions:** `Setujui versi ini`, `Minta revisi`, `Tanyakan detail` only for an authorized, current, unexpired, actionable version. Stale link or unauthorized actor gets safe recovery without leaking protected document existence.

**Acknowledgement:** After durable success, show the *exact version and action reference*; after timeout, show unknown-result recovery, not assumed approval.

### 5.5 Version safety: test fixture

Synthetic example: `proof-v2` submitted; approver sees v2; seller creates `proof-v3` from a substantive change. Any pending v2 approval must be rejected or treated as no longer sufficient for v3 according to governing source rules. The user receives a new current-version review path, without an accidentally production-ready status. If quote scope changed, formal commercial re-review is separate.

This describes the desired product safety property. Atomic version locking and authorization design are Head Engineering responsibilities, not UI inventions.

---

## 6. Business procurement — premium, accountable, not ERP-shaped

### 6.1 Information architecture for buyer outcomes

An eligible Business buyer should think in familiar tasks rather than internal modules. The **future** business workspace may use these conceptual groups, conditional on secure account/role capabilities:

| Buyer task | Frontstage entry | Backstage obligation | Initial alternative |
| --- | --- | --- | --- |
| Submit organization need | `Ajukan kebutuhan` | Capture permitted structured requirement and origin | Assisted Business contact |
| Review actual offer | `Penawaran untuk ditinjau` | Exact governed quote version, amount and validity | Approved manual PDF/message process |
| Request change | `Minta revisi` | Link request to current version and preserve prior history | Human reviewed revision |
| Approve offer | `Setujui penawaran` if actor/terms valid | Server-scoped identity, actor rights and exact-version effect | Authorized documented acceptance channel |
| Provide procurement reference | `Informasi PO / dokumen` where supported | Store/associate only authorized evidence | Human verification of required paperwork |
| Review artwork | `Bukti desain perlu ditinjau` | Link exact proof/version/actor | Assisted proof exchange |
| Track fulfillment | `Status pesanan` | Safe projections from governed operational records | Valid human-assisted status inquiry |
| Repeat procurement | `Pesan ulang dengan peninjauan` | New context and reconfirmed current terms | Founder prepares new quotation |

Do **not** introduce internal labels such as “Lead Domain”, “RPC”, “Work Order State”, “Tenant Resource”, “Financial Reconciliation” or “Vendor Margin” to purchaser navigation. The internal workflow can be sophisticated while the public information architecture remains calm.

### 6.2 Business intake by actual complexity

**Common minimum:** Organization/contact context, objective/use case, product and rough volume, desired date, destination area and approved contact route. **Conditional only:** size/recipient breakdown, multiple products, multiple delivery addresses, sample request, artwork/IP constraints, procurement documents, number of approvers, invoice/tax requirements, purchase order process, special packing and documented fulfillment constraints.

A buyer may express “belum dipastikan” where permissible and be routed for review; unknown financial/legal terms cannot become approved defaults. Request budget only if there is a clear permitted qualification purpose, and present it as customer-provided context rather than an automatic price ceiling or eligibility rule.

**Business routing edge case:** An organization may request only 20 items with formal procurement; a community may request 200 items without formal PO. Do not automatically identify B2B solely from quantity. Respect customer intention and verified contractual context.

### 6.3 Quote review — exact-version commercial comprehension

Quote card/specimen layout:

| Region | Required customer-facing detail | Negative case |
| --- | --- | --- |
| Identity | Actual quote reference, revision/version, prepared/issued date | Two PDFs with same title but ambiguous authoritative revision |
| Party & authority | Customer organization, permitted recipient and action rights | Company URL shared to an unverified employee grants approval |
| Scope | Garment items, quantities, size distribution, artwork scope, decoration, packing/delivery terms included | Unpriced extras appear implied or hidden |
| Price | Authorized unit/subtotal, applicable taxes, fees, delivery and total with reliable qualifiers | Estimate displayed as binding amount |
| Validity | Actual expiry, current/replaced status, controlled next step | Expired version still has clickable Accept |
| Schedule | Requested need date versus verified delivery commitment | Deadline assumption reads as guarantee |
| Payment | Deposit/terms only as authorized; pending receipt distinguished from confirmed | PO/document or screenshot marks paid |
| Decisions | Accept, request revision, decline, request clarification where eligible | Client-local UI success before actual effect |
| Evidence | Version-specific accepted result/reference, audit-visible underlying record | Status updated without durable accepted command |

**Example illustrative copy:** “Penawaran resmi versi 3, berlaku hingga [tanggal terverifikasi]. Periksa jumlah, desain, biaya, dan syarat sebelum menyetujui. Persetujuan penawaran tidak berarti pembayaran telah diterima atau produksi sudah dimulai.”

Do not fabricate the due date, amount, tax figure, SLA or invoice structure. Their authoritative rules remain with business/finance and MGBOS.

### 6.4 Distinguish business decisions precisely

| Business concept | Relevant experience | Separate from |
| --- | --- | --- |
| Request/Requirement | Customer describes need | Quote, accepted order, payment |
| Estimate | Informational calculation or pending review | Approved formal offer |
| Draft quotation | Operator preparation | Issued/approved customer offer |
| Issued official quote | Reviewed version within validity | Customer acceptance, order/payment |
| Quote acceptance | Authorized actor accepts exact terms | Artwork approval, PO receipt, cash received |
| Purchase Order | Buyer procurement evidence | Seller obligation, credit facility or bank settlement |
| Deposit obligation | Terms require payment | Payment actually captured/posted |
| Payment evidence | Verified financial event/status | Browser redirect, screenshot or verbal statement |
| Artwork proof acceptance | Exact visual version/scope approval | Legal clearance, capacity, production release |
| Production release | Separately governed eligibility fulfilled | Frontend clicking “approve” |

Every public CTA must match the actual action's authority and effect. Where full digital acceptance is not yet supported, the interface explains an approved manual step rather than simulating acceptance.

### 6.5 Stakeholder permissions and organization scope

Potential participants: request submitter, procurement buyer, authorized commercial approver, artwork reviewer, delivery contact and internal operator. One person can occupy multiple roles but **the system must not infer authority merely from email domain, document URL or possession of a purchase order**. The only valid method is a proven authorization model reviewed by Security/Head Engineering.

An approver may legitimately view quote terms while a delivery contact should see only allowed shipping data; an artwork reviewer may need a proof but no invoice. The screen should show authorized actions and a safe “Minta akses” or approved handoff where applicable, without revealing whether protected records exist to unauthorized callers.

### 6.6 Revision, conflicting edits and stale links

Fixture: buyer opens quote v3; seller issues v4 due to materials change; buyer presses Accept on v3. The old action must not commit v4 (or revive v3). Customer sees that terms changed, can inspect current version, and may explicitly reconsider. Where approvals were accepted before change, affected scope must be evaluated under canonical business rules; UI cannot quietly carry them forward.

If two organizational reviewers make conflicting actions, show the authoritative outcome or an uncertainty/reconciliation path. No optimistic toast should claim a formal agreement in the absence of accepted evidence.

### 6.7 Reorders are new decisions

Reorder can prefill **permitted historical specifications** to reduce repeat typing, but the customer must confirm quantities, sizes, dates, artwork rights/current version, shipping location, existing contact authority, current cost/price conditions, and availability. Reorder is a new business intent; it must not copy payments, previous approvals or fulfilled status.

---

## 7. Guided customer actions and accurate operational progress

### 7.1 Customer Action Center candidate

When authorized self-service is available, an overview should emphasize actions requiring buyer input rather than showing the internal process graph. Examples:

- “Lengkapi pembagian ukuran” (only if current requirement actually needs it).
- “Tinjau penawaran versi 2” (only if a valid issued version and actor authorization are present).
- “Periksa revisi desain” (only for a valid exact proof).
- “Pembayaran sedang diverifikasi” (never “Lunas” from a redirect alone).
- “Tidak ada tindakan yang diperlukan sekarang” (only when current dependable state confirms none).

Every card needs an accessible title, reason, data freshness/last verified label where important, valid destination, and safe recovery. Internal vendor identity, margin and unrelated organization data are never exposed.

### 7.2 Customer-friendly progress vs physical evidence

| Customer message candidate | Minimum evidence before display | Forbidden shortcut |
| --- | --- | --- |
| “Permintaan diterima” | Durable accepted intake or documented operator receipt | Local form success animation |
| “Penawaran siap ditinjau” | Correct issued/authorized quote | AI-generated draft |
| “Menunggu persetujuan desain” | Valid current proof/version and customer action permission | Uploaded image automatically turned into approved proof |
| “Dalam produksi” | Appropriate governed production evidence | Timer, ETA, automated assumption |
| “Sedang diperiksa kualitasnya” | QC process actually reached supported state | Scheduled completion date |
| “Diserahkan ke kurir” | Required real carrier/handoff evidence | Printed shipping label alone |
| “Selesai” | Appropriate terminal fulfillment/service evidence | Page closed or notification sent |

These labels are **illustrative safe customer projections**, not database enum definitions or guaranteed status availability. If evidence is incomplete or unreachable, display `Belum dapat dikonfirmasi` with next step rather than a fabricated state.

---

## 8. Founder delegation and service blueprint

### 8.1 Work ownership labels

- `C`: customer enters/accepts permitted information.
- `F`: customer-facing UI and approved assisted communication.
- `B`: governed MGBOS/operator commands and canonical business evidence.
- `D`: deterministic validation, notification request or workflow **only if implemented/authorized**.
- `A?`: optional bounded AI extraction, explanation, draft or issue categorization; not canonical truth.
- `H`: founder commercial judgment and required physical task.
- `X`: actual vendor, carrier, payment/messaging provider or marketplace where involved.

### 8.2 Synthetic 100-shirt Custom/B2B rehearsal

**Fixture:** Customer requests 100 printed shirts for a community event, with incomplete sizes and a potentially tight requested date. This is *not* an assertion about TeeStock MOQ, cost, capacity or actual vendor lead times.

| Step | Customer-facing result | Source / automation candidate | Founder required action | Evidence / exception |
| --- | --- | --- | --- | --- |
| 1. Discover | Correct Custom/Business path | `F`: approved information, no pageview lead spam | None | Public offer factual |
| 2. Specify | Guided request with quantity/date/artwork status | `F` validation, `D` conditional prompts | None by default | Missing sizes marked pending, not assumed |
| 3. Submit | Confirmed inquiry reference or clear unknown state | `B` durable accepted record; `D` after-success notification | Review only qualified/exception item | Double-submit and network retry handled |
| 4. Qualify | Customer receives clarification request as needed | `D` structured missing facts, `A?` draft summary | Confirm uncommon specifications | AI output never commits price |
| 5. Source | Buyer sees quote pending feasibility | `B` tracks requirement and approved vendor/cost process | Contact physical vendor, verify materials/capacity | No guaranteed deadline while unknown |
| 6. Quote | Valid reviewed offer, or explicit decline | `B` quote issuance and versioning | Commercial approval/exception decision | Cost/margin and approval authority retained |
| 7. Proof | Named current proof and revision path if supported | `F` version-specific review; `B` evidence | Human artwork/production suitability checks | Version changes invalidate stale actions |
| 8. Payment | Correct deposit/payment state when applicable | Financial-authority verified `B` event | Handle exceptions per business policy | Screenshot/redirect not payment truth |
| 9. Produce | Truthful customer milestone only if evidence | `B` governed work context; `D` routine notice | Buy/source, carry to vendor, arrange work | Physical labor cannot be “AI completed” |
| 10. QC | Valid inspection progress | `B` actual QC result | Inspect garments, resolve defect with vendor | Rework triggers exception and honest comms |
| 11. Dispatch | Verified shipping milestone | `B` shipment evidence, `X` actual courier | Pack, label as approved, hand parcel to courier | Label creation ≠ carrier acceptance |
| 12. Close | Accurate completion/help route | `B` fulfilled evidence; `D` permitted notifications | Exceptions, follow-up judgment | Track founder touch count and rework |

### 8.3 Founder operating economics

Instrument conceptually (subject to approved implementation and privacy): `time_to_complete_valid_inquiry`, `number_of_missing_specs`, `founder_retyping_minutes`, `quote_revisions_by_reason`, `artwork_revision_count`, `unnecessary_status_messages`, `customer_task_completions`, `true_required_physical_touches`, `provider_AI_cost_per_completed_request`, `exceptions_per_order`, and `manual_fallback_count`.

**Net benefit:** founder administrative minutes saved **minus** time spent monitoring/fixing automation, with costs and quality failures reported separately. Do not count a generated chatbot message as successful automation if founder still has to recreate the order or correct false expectations. Physical tasks must never be classified as eliminated by digital automation.

No numerical success baseline, conversion lift or saving estimate is claimed here. The evidence plan and metrics owner are CX-08/CX-09.

---

## 9. Experience-state and recovery matrix

| Situation | Customer-visible behavior | System/operator response | Must not happen |
| --- | --- | --- | --- |
| Invalid quantity | Identify format/range, keep other inputs | Server validates under business rules | Silent coercion to valid quantity |
| Sizes do not total quantity | Explain mismatch if totals are required now | Preserve individual sizes, request correction | Auto-adjust sizes invisibly |
| Unknown method/fabric | Offer eligible alternatives or reviewed quote | Classify feasibility pending | Generate final production price |
| File type/size unsupported | Explain approved rule, alternative path | Secure rejection/quarantine according to policy | Render active malicious content |
| Upload interrupted | Explain unknown/failed receipt, retain other data | Retry/resume only when supported | File selected locally displayed as approved |
| Inquiry submit times out | State outcome cannot be confirmed | Safe lookup/retry under idempotency | Duplicate accepted request or fake receipt |
| Founder unavailable | Honest response expectation and approved support fallback | Queue by priority, no SLA invention | Claim human already replied |
| Quote v3 superseded by v4 | Current-version comparison/review | Reject stale action | Accept v3 as v4 |
| Quote expired | Display expired state and review path | Authorized reissue/requote if valid | Implicitly renew price |
| Customer lacks approval rights | Generic safe access explanation | Enforce server authorization | Reveal confidential quote contents |
| PO added | Explain receipt/status without monetary leap | Record procurement evidence if supported | Grant credit / mark paid |
| Payment confirmation delayed | `Sedang diverifikasi` with allowed help | Governed financial reconciliation | Show paid from redirect/chat |
| Proof v2 superseded by v3 | Current design needs review; old action invalid | Version-safe approval boundary | Release v3 from v2 signature |
| Vendor material unavailable | State feasibility/production change as supported | Founder decides alternative and quote impact | Hide changed fabric or delivery expectation |
| QC defect found | Safe factual delay/next step | Real QC, vendor rework, financial implications | Mark packed/completed optimistically |
| Preview/AI feature down | Lightweight normal inquiry continues | Optional tool failure isolated | Fail entire public Custom experience |
| Portal data unavailable | Unknown vs empty differentiated | Retry/assisted route, access unchanged | Return “no orders” with failed backend |

**Recovery acceptance property:** The system must preserve only data it may lawfully retain, confirm only accepted effects, and offer useful next steps without requiring the customer or founder to reconstruct already authorized information.

---

## 10. Proposed DP-04 requirement additions — refine, do not fork

`DP04-RQ-*` are **temporary product review handles**, not new canonical CX-05 functional IDs or automatic build tickets. Proposed integration must map each to the existing parent and demonstrate an actual semantic gap before adding any new ID.

| Candidate | Proposed experience refinement | Existing CX-05 owner | Verifiable outcome |
| --- | --- | --- | --- |
| `DP04-RQ-01` | Route Custom vs Business from intent + procurement needs, not arbitrary quantity threshold | FR-001, 014 | Appropriate path; previously entered permitted facts preserved |
| `DP04-RQ-02` | Guide with four conceptual decisions and conditional depth | FR-003..008 | Beginner can express valid inquiry without production jargon |
| `DP04-RQ-03` | Provide explicit legitimate “artwork not ready” route | FR-008, 009 | Request advances without pretending upload exists |
| `DP04-RQ-04` | Distinguish optional, unknown, unsupported and required information | FR-003, 005, 015 | Review summary displays unresolved items truthfully |
| `DP04-RQ-05` | Show a reviewable accurate inquiry before durable submission | FR-010..013 | Edit before submit; no fake receipt/double effect |
| `DP04-RQ-06` | Attribute file selection, receipt, review, proof and production readiness distinctly | FR-009, 020, 029, 030 | Each stage evidenced and visually distinct |
| `DP04-RQ-07` | Permit placement visual preview only as illustration of modeled context | FR-039..043 | Fidelity limitation and accessible alternative visible |
| `DP04-RQ-08` | Revalidate dependent eligibility/price/lead time after configuration changes | FR-040, 043 | Stale estimate/claim cannot remain silently authoritative |
| `DP04-RQ-09` | Offer review-only fallbacks for unmodeled methods/materials or vendor capacity | FR-018, 039..042 | Customer can request manual quote; no unsupported instant commit |
| `DP04-RQ-10` | Version-accurate proof review and changed-version rejection | FR-029, 030, 038 | Old approval cannot approve new proof |
| `DP04-RQ-11` | Formal B2B quote presentation with exact scope, version and terms | FR-016, 017, 024..026 | Authorized buyer understands offer and next action |
| `DP04-RQ-12` | Separate PO, quote acceptance, deposit due and payment received | FR-019, 020, 027, 036 | No unauthorized financial status shortcut |
| `DP04-RQ-13` | Role-scoped buyer/artwork approver/delivery contact actions | FR-026, 028, 037, 038 | User cannot act outside actual organization permission |
| `DP04-RQ-14` | Make material revision impacts visible and require authoritative re-review | FR-025, 034, 038 | Price/date/scope change is not silently accepted |
| `DP04-RQ-15` | Action-focused B2B home and protected status projections | FR-031..033 | Legitimate next action visible without raw ERP vocabulary |
| `DP04-RQ-16` | Reorder copies permitted specification only, not old financial effects | FR-033, 035 | Fresh terms/stock/authority reviewed |
| `DP04-RQ-17` | Preserve founder-operable lightweight path if advanced builder/AI fails | FR-022, 044 | Assisted intake still usable without extra AI |
| `DP04-RQ-18` | Measure real founder re-entry/workload and customer friction | FR-021, 046 | Repeatable method distinguishes admin, physical and error cost |

### 10.1 Exact functional requirement coverage

The reconciliation groups below cover the **existing 46** `CX5-FR-001..046` IDs without creating a new requirement inventory:

| Existing requirement set | DP-04 coverage | Intended integration placement |
| --- | --- | --- |
| `CX5-FR-001..008` | Sections 2–3 | CX-05 §2–5 Custom discovery/intake |
| `CX5-FR-009..015` | Sections 3, 5, 9 | CX-05 §5/8/14 submission/artwork/recovery |
| `CX5-FR-016..023` | Sections 6–9 | CX-05 §6/10–12 commercial and founder handoff |
| `CX5-FR-024..030` | Sections 5–6 | CX-05 §6/9/10 protected quote/proof |
| `CX5-FR-031..038` | Sections 6–9 | CX-05 §12/13 protected action and reorder |
| `CX5-FR-039..046` | Sections 4/8/11/12 | CX-05 §7/19 advanced eligibility, AI, measurement |

Coverage here means **documentary mapping**, not that all features are implemented, independently accepted, or semantically promoted. The existing acceptance and traceability matrices remain authoritative for the proposed CX package until governed updates are approved.

---

## 11. Proposed negative and positive acceptance scenarios

All `DP04-AC-*` scenarios are **PROPOSED / NOT EXECUTED**. They describe user-observable expectations and required evidence types, not claims of live product functionality. Each scenario must be reconciled into existing `CX5-AC-*` cases or added only if demonstrably new.

| Candidate | Given / When / Then | Evidence type | Existing acceptance owner |
| --- | --- | --- | --- |
| `DP04-AC-01` | Given new mobile Custom visitor, when selecting purpose and garment, then correct legitimate path is understandable without unexplained print jargon | Moderated task + mobile prototype | CX5-AC-001, 003 |
| `DP04-AC-02` | Given valid buyer without artwork, when choosing “belum ada desain”, then eligible request can continue with transparent review expectation | Prototype/browser flow | CX5-AC-002 |
| `DP04-AC-03` | Given invalid/unknown quantity, when reviewing, then only legitimate data becomes eligible and previous valid input remains | Browser and validation | CX5-AC-004, 005 |
| `DP04-AC-04` | Given urgent requested date, when submitting, then no deadline guarantee or unverified rush fee is shown | Content audit + browser | CX5-AC-006 |
| `DP04-AC-05` | Given organization/PO context, when route changes, then Business request preserves permitted inputs and does not create a consumer checkout commitment | Journey replay | CX5-AC-007 |
| `DP04-AC-06` | Given duplicate clicks and an accepted first request, when customer retries after timeout, then only one actionable source request and a legitimate recovery path exist | Server idempotency + browser integration | CX5-AC-008..010 |
| `DP04-AC-07` | Given backend rejects submission, when UI reports result, then no reference, success, quote or order confirmation is invented | Fault injection + UI | CX5-AC-010 |
| `DP04-AC-08` | Given accepted inquiry, when founder opens work, then permitted product/quantity/date/artwork/unknowns are available without chat transcription | Operator rehearsal + source evidence | CX5-AC-011 |
| `DP04-AC-09` | Given formal quote v3 issued, when customer reviews, then exact scope, authorized amount, version, validity and relevant actions are understandable | Buyer usability + doc inspection | CX5-AC-013 |
| `DP04-AC-10` | Given quote v3 superseded/expired, when user tries old approval, then no stale accepted effect and useful current-review guidance | Version concurrency/security test | CX5-AC-020, 021 |
| `DP04-AC-11` | Given buyer has PO but no confirmed funds, when viewing progress, then PO is not payment or credit approval | Financial negative test + customer UI | CX5-AC-022, 034 |
| `DP04-AC-12` | Given organization non-approver, when attempting quote/proof approval, then rights are denied without sensitive data disclosure | Cross-role/organization negative test | CX5-AC-023, 033 |
| `DP04-AC-13` | Given file selected locally but upload fails, when returning to form, then only authoritative file receipt may show `diterima`, other safe fields persist | Upload failure/browser test | CX5-AC-024, 025 |
| `DP04-AC-14` | Given unsafe/unsupported file, when inspected, then it is not served as active trusted media or marked print-ready; customer receives safe next step | Security + accessibility | CX5-AC-025 |
| `DP04-AC-15` | Given proof v2 approved and v3 supersedes it, when v2 action is replayed, then v3 remains unapproved and production cannot start from old evidence | Exact-version/authorization test | CX5-AC-026, 028 |
| `DP04-AC-16` | Given customer rejects proof, when revision requested, then exact source version and requested correction stay linked | Workflow and UI evidence | CX5-AC-027 |
| `DP04-AC-17` | Given vendor/QC evidence absent, when customer views progress, then no speculative production/dispatch-complete claim is displayed | Operator + customer read model | CX5-AC-016, 029 |
| `DP04-AC-18` | Given unusual material/unsupported placement, when user asks for custom, then reviewed quote alternative is available without unsupported instant-final claim | Eligibility negative test | CX5-AC-030, 036, 038 |
| `DP04-AC-19` | Given changed approved configuration, when material/quantity updates, then prior estimate/lead-time is visibly invalidated and requires valid recalculation/review | Configurator boundary test | CX5-AC-031, 037 |
| `DP04-AC-20` | Given historical order, when initiating reorder, then old specs are referenced only with permission, and current price/stock/rights require fresh confirmation | Reorder business test | CX5-AC-032 |
| `DP04-AC-21` | Given AI/preview tool outage, when buyer submits simple Custom inquiry, then core assisted path remains functioning and clear | Failure injection + mobile flow | CX5-AC-017, 040 |
| `DP04-AC-22` | Given keyboard/AT user, when completing intake and proof review, then labels, focus, error and alternatives permit the same legitimate action | Accessibility manual + AT | CX5-AC-035 |
| `DP04-AC-23` | Given preview mockup visual, when customer decides, then label explicitly distinguishes illustration from technical proof and print readiness | Prototype comprehension study | CX5-AC-039 |
| `DP04-AC-24` | Given Customer/Business request fixture, when end-to-end journey is rehearsed, then actual admin touch reductions, physical work and error/rework costs are recorded separately | Founder-controlled synthetic rehearsal | CX5-AC-011, 016, FR-046 |

### 11.1 Test environment constraints

Start with consented prototype tasks and synthetic data. Any integration security or financial tests must use separately authorized disposable environments with proven isolation; this document does not request real financial operations or access to production. A passing author checklist, mocked prototype, or static screenshot does **not** verify transaction guarantees or WCAG conformity.

---

## 12. Research and prototype plan

### 12.1 Critical research tasks

| ID | Target participant | Task | Hypothesis to challenge | Observe |
| --- | --- | --- | --- | --- |
| `DP04-UX-01` | Custom novice | Ask for ~30 customized shirts without knowing print method | Plain-language prompts remove jargon dependency | Completion, confusion, help requests |
| `DP04-UX-02` | Custom buyer without art | Submit legitimate idea with no file | No-artwork route does not feel like failure | Drop-offs, next-step comprehension |
| `DP04-UX-03` | Prepared buyer | Correct size distribution then preview | Conditional questions prevent omissions | Mismatch errors and unnecessary fields |
| `DP04-UX-04` | Business purchaser | Request 250 uniforms and procurement quote | Buyer knows difference between inquiry and quote | Misinterpretation, form effort |
| `DP04-UX-05` | Procurement approver | Compare quote v2 and v3 | Exact version and changes visible | Wrong-version acceptance intent |
| `DP04-UX-06` | Design reviewer | Identify proof versus mockup | Visual labelling makes limitations understood | Incorrect print-ready assumptions |
| `DP04-UX-07` | Returning buyer | Reorder after price/size changes | Prefill saves time without silent old commitment | Reconfirm behavior |
| `DP04-UX-08` | Mobile user, constrained network | Continue when preview/download fails | Basic assisted path survives | Lost data, abandoned form |
| `DP04-UX-09` | Authorized and unauthorized B2B roles | Locate own quote without seeing others' data | Role-limited content is understandable | Access confusion, leakage |
| `DP04-UX-10` | Solo founder | Process 100-shirt fixture with vendor exception | Workflow reduces transcription, not just shifts it | Real admin vs physical effort |

The quantities here are synthetic scenarios. They are not declared TeeStock MOQ, selling price, vendor capacity, validated user preference, or contractual terms.

### 12.2 Prototype deliverables

- **P0 low/high-fidelity:** Custom landing, guided simple form, conditional details, no-artwork variant, invalid quantity/size state, failed upload, review, accepted receipt, uncertain submit, Business intake, quote pending/human contact.
- **B2B candidate:** versioned quote detail/compare, invalid/expired quote, user without approval, PO detail, role-safe Business action overview, proof review and revised proof.
- **Advanced gated:** supported garment/decoration selector, preview fidelity notice, unsupported combination, recalculation/stale indication, mobile editor fallback and disabled AI path.
- **Cross-cutting:** keyboard focus, screen-reader announcements, mobile software keyboard, slow network, high zoom, reduced motion, blocked third-party media, uncertain provider state.

Prototype review must include the actual task context and normal/error/recovery states. Beautiful screenshots without functioning branching decisions are not sufficient evidence for UX acceptance.

### 12.3 Research record schema (not database design)

For each task capture: tested prototype/revision; date; participant category and selection limitations; device/network and accessibility context; exact prompt; expected and observed outcome; critical misinterpretations; time observed; abandoned/restarted tasks; manual founder burden; severity; supporting evidence location; consent/privacy handling; follow-up decision; and explicit `NOT_TESTED` areas. Avoid storing participant personal data in public GitHub documentation.

### 12.4 Proposed measurement

Do not invent thresholds before baseline. Product team should pre-register task-success thresholds and unacceptable error classes before real evaluation. **Blocking qualitative failures** include: customer believes quote automatically approved when it is not; wrong proof/version approved; customer treats a mockup as guaranteed production proof; buyer believes PO means paid; unauthorized actor sees another organization's document; frontend claims a request/payment accepted without canonical evidence.

---

## 13. Open decisions and ownership

The existing `CX5-DEC-01..16` and consolidated `CX-DP-*` remain open or deferred as originally classified; **this document does not answer them on Owner's behalf**. Product recommendation can be issued without silently granting authority.

| Priority | Relevant existing decision IDs | Recommended decision discipline | Accountable owner |
| --- | --- | --- | --- |
| First public assisted service and supported offer | `CX5-DEC-01..04`, `CX-DP-01..05` | Confirm only actual capabilities/contact channels/offer terms; P0 not instant checkout | Owner/Product + Business |
| Upload/rights/proof fidelity | `CX5-DEC-06..08`, `CX-DP-17` | Verify file handling/security/legal terms and actual printing review process | Business/Production + Legal/Security |
| Secure quote/proof actions | `CX5-DEC-05`, `09`, `11`, `CX-DP-09` | Defer activation pending organization authorization and exact-version integrity | Head Engineering/Security + Product |
| Discount, rush, deposits and credit | `CX5-DEC-10`, `CX-DP-04` | Use existing pricing/finance authority; no unilateral UX policy | Owner/Finance |
| Reorder/multi-address | `CX5-DEC-12`, `15`, `CX-DP-10` | Gate by real repeat demand, workflow capability and permissions | Owner/Product + Operations |
| Instant custom prices and Studio | `CX5-DEC-13`, `CX-DP-12` | Require standardized approved product/production/pricing eligibility and performance evidence | Owner/Product + Head Engineering |
| AI assistance | `CX5-DEC-14`, `CX-DP-13` | Evaluate usefulness, tool authority, privacy, budget and outage fallback | Owner/JARVIS/Head Engineering |
| Evidence and ROI | `CX5-DEC-16`, `CX-DP-14` | Establish realistic baseline before making ROI commitments | Owner/Product Operations |

**Escalation rule:** An unresolved material owner decision becomes a named review question only when it blocks the next intended product acceptance. Do not burden Owner with selecting schemas, code libraries, API endpoints or numerical budgets lacking evidence.

---

## 14. Controlled integration plan — CX-05, not parallel canonical PRD

This candidate does **not** replace `cx-05-custom-b2b-ordering-experience.md`. If Owner and reviewers accept its content, integration should follow an exact scoped documentation PR with reconciliation rather than copy-replacing the existing 96 KB document.

| Existing CX-05 section | Material refinement candidate | Required validation before merge |
| --- | --- | --- |
| §2–3 | More explicit beginner vs procurement intent routing | No contradiction with TeeStock Website IA/Custom/Business policy |
| §5 | Four conceptual Custom decisions, field/summary/error states | Preserve required/optional existing fields and current P0 behavior |
| §6 | Buyer role-focused B2B quote anatomy/PO/terms distinctions | Preserve finance and org-authorization semantic owners |
| §7 | Constraint-driven builder with exact recovery and mobile fallback | No unsupported instant price, material combo, or capacity promise |
| §8–9 | Upload/preview/proof fidelity and exact-version consequences | Security/legal/production checks; do not assert file type approval |
| §10–11 | Quote revisions and separate deposit/payment/release | Reconcile R4/R5 assurance and MGBOS canonical invariants |
| §12–13 | Customer action projections, founder physical handoff, reorder revalidation | No new internal status state or shared record authority |
| §14–15 | Accessibility, component states, prototype specimens | CX-03 ownership; avoid duplicate design-system policy |
| §16–18 | Reconcile only genuinely new acceptance refinements | Preserve `CX5-FR-001..046`, `CX5-BR-001..026`, `CX5-AC-001..040` |
| §19–25 | Research, risk/decision trace, source refresh | No claim of executed user testing or currently live adapter |

### 14.1 Future documentation PR guardrails

If the Owner later authorizes Antigravity to integrate accepted deltas:

1. Restore fresh `main`, CX-05, CX-01/02/03/08, companion artifacts, and current open PRs.
2. Produce a semantic diff and exact proposed file list before implementation; do not rely solely on this document's older baseline.
3. Preserve existing requirement IDs, traceability matrix and all correct business rules; flag conflicts instead of inventing replacements.
4. Edit only authorized documentation paths; add companion links/routing only after checking PR #73 and current document-routing owner.
5. Run local Markdown/link/reference/ID validators and relevant repository governance tests; capture command, environment, exit status and exact commit SHA.
6. Open draft documentation PR only under approved scope; request independent Product/UX/Documentation QA.
7. **Do not** edit application/SQL, call production systems, create external provider credentials, merge, or deploy under this proposal.

When unresolved source conflict, missing approved policy, duplicated normative owner or version ambiguity would make integration unsafe, halt the affected portion and report a bounded decision rather than silently synthesizing policy.

---

## 15. Dependency and quality gate

### 15.1 Product completeness gates

- [x] Distinguishes Custom vs Business jobs and staged capability readiness.
- [x] Preserves CX-05 requirement hierarchy, core business boundaries, and customer intent.
- [x] Defines normal, failed, stale, unavailable and unauthorized experience paths.
- [x] Separates illustration, file receipt, approved proof, commercial quote, payment and production release.
- [x] Designs workable founder handoff without pretending physical production is automated.
- [x] Provides exact integration targets, temporary IDs and non-duplicative crosswalk.
- [x] Provides falsification-oriented acceptance candidates and research plan.
- [x] Uses source-verified standards references without asserting test execution.
- [x] Leaves decisions open where only Owner/other semantic authority may approve.

### 15.2 Not accepted or not executed

- [ ] Owner approval of this product candidate.
- [ ] Independent Product/UX review.
- [ ] Tested high-fidelity prototype with target users.
- [ ] Authorized preview upload/pipeline and actual file policy.
- [ ] Actual production-capacity or pricing eligibility calibration.
- [ ] Security test for guest/organization/approver rights.
- [ ] Confirmed R4/R5 transactional assurance applicable to future commands.
- [ ] Measured performance, live field Core Web Vitals, WCAG conformance or user success.
- [ ] Governed merge and canonical activation.

### 15.3 Promotion blockers

Block promotion of affected public action if it fabricates accepted requests or payments; allows cross-organization access; accepts outdated quotes/proofs; promises unsupported price/date/method/capacity; hides material commercial terms; exposes untrusted artwork; or makes basic assisted flow depend on a speculative expensive AI/visual editor.

The *documentation draft* can remain complete while these capability gates are pending, provided pending statuses are explicit. Product-definition acceptance is not operational launch acceptance.

---

## 16. Change impact and reproducibility register

| Concern | Status at inspected baseline | Action on future review |
| --- | --- | --- |
| Current CX-05 source | Verified at pinned blob SHA | Re-fetch latest and compare before modifying |
| All 46 functional IDs | Exact source inventory observed | Preserve IDs and link to requirement trace |
| All 26 business rules / 40 acceptance IDs | Exact source inventory observed | Reconcile; no mass regeneration |
| DP-01/02/03 repository presence | NOT_FOUND on inspected `main` | Treat as local design input, do not create broken references |
| This DP-04 destination in repository | NOT_FOUND on inspected `main` | Confirm absence before copying/PR |
| Website live intake/quote portal | NOT_VERIFIED | Head Engineering + operator evidence required |
| Authorized artwork file types and preview stack | NOT_VERIFIED | Production/Security evaluation required |
| Service conversion & founder time saved | NOT_VERIFIED | Product research and operational pilot data required |
| Current marketplace, shipping, payment contract | Outside DP-04 evidence scope | Consult CX-04/CX-07 and business/security owners |
| Any newly approved product decision after baseline | NOT_VERIFIED | Review current canonical policy and PR history |

---

## 17. Research and source register

### 17.1 Repository sources — pinned and claim-specific

All pinned links refer to inspected source material, not necessarily current live implementation:

- [CX-05 Custom & B2B Ordering Experience v0.1.1](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-05-custom-b2b-ordering-experience.md)
- [CX-01 Master PRD v0.1.1](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md)
- [CX-02 Service Blueprint v0.1.1](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md)
- [CX-03 Interaction Design v0.1.1](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md)
- [CX-08 Quality & Acceptance v0.1.1](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md)
- [TeeStock Custom canonical business source](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/04-services/custom.md)
- [TeeStock Business canonical business source](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/04-services/business.md)
- [TeeStock Pricing Framework canonical source](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/08-finance/pricing-framework.md)
- [TeeStock Digital Product Vision](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/10-product-tech/digital-product-vision.md)
- [TeeStock Website IA](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/bisnis/teestock/10-product-tech/website-information-architecture.md)
- [Solo-Founder Launch Roadmap](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/docs/roadmaps/solo-founder-launch-roadmap.md)
- [Documentation Constitution](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/docs/governance/documentation-constitution.md)
- [CX Package Consolidated Decision Register](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DECISIONS-R1.md)
- [CX Package Trace Matrix](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-TRACE-R1.csv)

### 17.2 External research — methodology, not TeeStock verification

- [W3C WAI — Form instructions](https://www.w3.org/WAI/tutorials/forms/instructions/): labels, formats, required/optional guidance and accessible descriptions.
- [W3C WAI — Validating input](https://www.w3.org/WAI/tutorials/forms/validation/): accessible errors and independent server validation.
- [W3C WCAG 2.2 SC 3.3.4 — Error Prevention (Legal, Financial, Data)](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html): verification/correction/reversibility for important commitments.
- [W3C WCAG 2.2 — Understanding](https://www.w3.org/WAI/WCAG22/Understanding/): current accessibility criteria for the applicable journey.
- [Baymard — Product Page UX 2026](https://baymard.com/research-articles/current-state-ecommerce-product-page-ux): observed ecommerce variation and product decision challenges; not a TeeStock-specific usability result.
- [OWASP — Unrestricted File Upload](https://community.owasp.org/vulnerabilities/Unrestricted_File_Upload): risks of accepting and rendering user-uploaded assets, subject to engineering security review.

---

## 18. Final author QA and release disposition

**Author self-review checks for this candidate:**

- Source-baseline / path existence check: **PASS at inspected SHA**.
- Preservation of previous `CX5-FR-001..046`, `CX5-BR-001..026`, `CX5-AC-001..040` identifiers: **PASS — references only, none renumbered**.
- New proposed ID prefixes (`DP04-SEG`, `DP04-CUS`, `DP04-RQ`, `DP04-AC`, `DP04-UX`) separated from canonical IDs: **PASS**.
- Business vs product vs MGBOS/JARVIS semantic ownership: **AUTHOR SELF-REVIEW PASS**.
- Stage/P0/P1/P2 boundary and premium-but-lightweight UX consistency: **AUTHOR SELF-REVIEW PASS**.
- User-visible uncertainty and negative paths: **AUTHOR SELF-REVIEW PASS**.
- Repository link/format/structure static review: **AUTHOR SELF-REVIEW; post-copy validators NOT_EXECUTED**.
- Real UX participants, proof/quote/payment runtime E2E, actual vendor pricing, authorized production pipeline, independent reviewer: **NOT_VERIFIED / NOT_PERFORMED**.

**Candidate status:** `COPY_READY / AUTHOR_SELF_REVIEWED / DRAFT / NON-CANONICAL`.

**Integration status:** `NOT_INTEGRATED_INTO_CX05`.

**Next planned document:** `DP-05 — Commerce & Checkout Experience Deepening`, owned by CX-04. Before that step, restore current main and current saved/PR state of DP-01..04; do not assume local copy is merged or canonically activated.

**End of document.**
