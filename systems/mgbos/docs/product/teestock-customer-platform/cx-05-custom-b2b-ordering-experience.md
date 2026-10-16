---
canonical_id: proposed.mgbos.product.teestock-customer-platform.cx-05
status: DRAFT
version: 0.1.1
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: PENDING_OWNER_APPROVAL
scope: teestock-customer-platform-custom-and-business-ordering-experience
document_class: product-specification
normative_authority: NONE_UNTIL_APPROVED_AND_ROUTED
product_program: PROPOSED_TEESTOCK_CUSTOMER_EXPERIENCE_COMMERCE
product_maturity: PROPOSED_CUSTOM_B2B_EXPERIENCE_CONTRACT
engineering_readiness: NOT_READY_FOR_ENGINEERING
implementation_status: PRODUCT_DEFINITION_ONLY
repository: Rizkybuilds/bisnishub
repository_branch: main
source_baseline_commit: 2800c474563309bda49d84d712f79b68c9dde36a
source_baseline_checked: 2026-10-16
source_inspection: SELECTED_CANONICAL_DOCUMENTS_AND_ACTIVE_APP_NOT_FULL_RUNTIME_AUDIT
created: 2026-10-16
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/cx-05-custom-b2b-ordering-experience.md
supersedes: null
remediation_package: CX-REM-R1
remediation_review: AUTHOR_SELF_REVIEW_NOT_INDEPENDENT
companion_drafts:
  - cx-00-source-gap-audit.md
  - cx-01-master-prd.md
  - cx-02-customer-journeys-service-blueprint.md
  - cx-03-experience-design-interaction-spec.md
  - cx-04-commerce-checkout-experience.md
proposed_authoritative_for_after_approval:
  - teestock_customer_facing_custom_inquiry_and_b2b_ordering_journeys
  - customer_input_and_review_interaction_requirements
  - distinctions_between_estimate_quote_approval_proof_and_production_release
  - customer_custom_artwork_upload_review_and_revision_experience
  - proposed_customer_b2b_commercial_documents_and_reorder_experience
  - product_quality_acceptance_and_human_escalation_gates
not_authoritative_for:
  - teestock_product_service_catalog_or_commercial_policies
  - exact_pricing_formula_cost_or_margin_thresholds
  - production_methods_capacity_or_supplier_contracts
  - legal_ip_usage_terms_or_customer_artwork_ownership_policy
  - mgbos_entities_states_invariants_permissions_commands_or_database_migrations
  - exact_artwork_storage_security_or_file_processing_architecture
  - customer_identity_or_organization_authorization_implementation
  - payment_tax_credit_or_refund_authority
  - jarvis_agent_autonomy_or_external_provider_api_entitlements
  - production_readiness_pilot_scope_or_launch_authorization
  - multigraph_printing_specific_customer_product_requirements
source_dependencies:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - docs/operating-model/solo-founder-operating-system.md
  - bisnis/teestock/04-services/custom.md
  - bisnis/teestock/04-services/business.md
  - bisnis/teestock/04-services/studio.md
  - bisnis/teestock/08-finance/pricing-framework.md
  - bisnis/teestock/07-operations/production-system.md
  - bisnis/teestock/07-operations/quality-control.md
  - bisnis/teestock/07-operations/order-fulfillment.md
  - bisnis/teestock/07-operations/customer-service.md
  - bisnis/teestock/10-product-tech/digital-product-vision.md
  - bisnis/teestock/10-product-tech/website-information-architecture.md
  - bisnis/teestock/10-product-tech/commerce-platform.md
  - bisnis/teestock/11-data-mgbos/mgbos-integration.md
  - systems/mgbos/docs/architecture/domain-map-capability-ownership.md
  - systems/mgbos/docs/architecture/business-invariants.md
  - systems/mgbos/docs/architecture/business-state-machines.md
  - systems/mgbos/docs/architecture/permission-authorization-model.md
  - systems/mgbos/docs/product/teestock-founder-control-prd.md
  - systems/mgbos/docs/product/teestock-operational-pilot-plan.md
  - systems/mgbos/docs/product/teestock-design-library-spec.md
---

# CX-05 — TeeStock Custom & B2B Ordering Experience Specification v0.1.1

> **DRAFT / SELF-REVIEWED / NOT CANONICAL / NO BUILDER AUTHORITY.** This specification defines proposed customer experience requirements only. Existing canonical business and MGBOS semantics override any conflict. No application, database, branch, workflow, vendor, payment provider, marketplace, or production environment has been changed. Acceptance tests here are proposed, **not executed**. This is NOT a claim that a customer-facing configurator, upload service, B2B portal, payment, approval flow, or retail checkout is implemented.

## 0. Executive product contract

**North star:** A customer should be able to describe a desired custom apparel outcome, understand realistic options, receive a transparent reviewed offer, approve the correct commercial terms and artwork, and follow the job's progress with minimal repeated explanation—without needing to understand TeeStock's internal production or vendor system.

**Dual-success promise:**

1. **Customer:** the process feels like a premium, guided digital service—fast to start, explicit about uncertainty, safe to resume, and unusually clear about next actions.
2. **Solo founder:** a valid customer submission flows into structured, authorized MGBOS work exactly once; routine questions, status chasing, repetitive data transfer, document preparation and reminders are eliminated where governance permits, while physical procurement, material checks, vendor coordination and QC remain evidence-based work.

**Hard rule:** `CUSTOMER APPROVES PROOF` is not equivalent to `PRICE ACCEPTED`, `PAYMENT CONFIRMED`, `STOCK RESERVED`, `PRODUCTION READY`, or `SHIPPED`. The customer UI must never collapse these facts into a single optimistic "approved" badge.

**Progressive capability:**

- `P0`: premium guided public pages, structured Custom/Business **assisted-sales** request, honest acknowledgment, human-reviewed quote and documented/manual approval channels. This is a PRODUCT TARGET; it is not an implemented P0 claim.
- `P1`: authenticated or otherwise securely verified customer quote/proof actions, B2B documents, order status and simplified reorder, after dependency and authorization gates.
- `P2`: guided product configuration and preview with automatic estimate/final-price eligibility **only when** commercial, technical, artwork, capacity and transaction rules are proven deterministic. No mandatory 3D builder.

**Why the staged model matters:** the current approved operational pilot is TeeStock Custom/Business assisted-sales, and does **not** require a full public commerce storefront. The active TeeStock app at the pinned main revision still contains a placeholder Custom Atelier route. The PRD does not modify that pilot's authority.

## 1. Source provenance, authority, and relationship to CX-00..04

### 1.1 Audited baseline

- Repository: <https://github.com/Rizkybuilds/bisnishub>
- Pinned code revision: <https://github.com/Rizkybuilds/bisnishub/commit/2800c474563309bda49d84d712f79b68c9dde36a>.
- Custom business contract: `bisnis/teestock/04-services/custom.md` — Custom funnel, configuration, artwork review, quotation and production handoff.
- Business commercial contract: `bisnis/teestock/04-services/business.md` — formal B2B quote, PO, terms, quote versions, account pricing, repeat ordering.
- Technical production and QC business sources: `bisnis/teestock/07-operations/production-system.md` and `quality-control.md`.
- Design draft/unknown integration boundary: `systems/mgbos/docs/product/teestock-design-library-spec.md`; existence of a design-library concept does not prove supported runtime file/version/approval commands.
- Canonical domain and permission authority: `systems/mgbos/docs/architecture/`; CX-05 does not create new canonical `Project`, `Opportunity`, `Design Approval`, or `Customer Organization` entities.
- Product relationship: CX-01 owns master intent; CX-02 owns service blueprint; CX-03 owns interaction grammar; CX-04 owns retail cart/checkout; CX-05 owns Custom/Business **customer-facing behavior**, not backend rules.

### 1.2 Non-duplication rule

| Topic | True owner | CX-05 may define | CX-05 must not decide |
|---|---|---|---|
| Eligible garment and service offers | TeeStock business Custom/Business | How choices are explained and routed | New products, production methods or MOQ |
| Margin, price floors, taxes, payment terms | TeeStock finance + MGBOS invariants | Estimate/quote copy and review flow | Numbers, formulas, credit entitlement |
| Quote, order, payment, production and QC | MGBOS canonical semantics | Safe user-facing projection and action request | Database state machine, command or permission |
| Artwork/IP policy | TeeStock Custom, Legal/IP + governed asset spec | User consent, file-error explanation, version-approval experience | Ownership transfer, license terms, technical sanitization |
| Company contacts / organization | MGBOS identity/authorization | Role-sensitive B2B UI and safe actor checks | New org model or cross-tenant role grants |
| Customer support/return | TeeStock customer service + MGBOS | Contextual contact/handoff | Refund decision or case lifecycle |
| AI review/execution | JARVIS/governance + approved tools | Optional explain/draft/fallback user experience | Autonomous legal, financial or production authority |
| Marketplace/provider channels | Provider contracts + CX-07 | Explain source and communication channel | Provider API permission or prohibited off-platform flow |

### 1.3 Status vocabulary

`VERIFIED_SOURCE` = directly observed canonical text/current source on pinned revision. `DOCUMENTED_TARGET` = expressed in existing authoritative business documentation. `PROPOSED_CX` = requirement described here pending approval. `NOT_VERIFIED` = operational/provider/runtime evidence missing. `BLOCKED` = action must not be enabled without a prerequisite. `P0/P1/P2` = proposed customer-product sequencing, **not** deployment or implementation authorization.

## 2. Primary user jobs and eligibility classification

| Persona | Job to be done | Customer-facing entry | Complexity signal | Proposed default |
|---|---|---|---|---|
| `ACT-01` Personal Custom buyer | Produce apparel with own design | Customize | Known product, limited quantity, ready artwork | Guided assisted inquiry P0 |
| `ACT-02` New small team buyer | Order coordinated group apparel | Customize/For Business | Sizes, quantity, multiple recipients | Business qualification P0 |
| `ACT-03` Corporate purchasing contact | Obtain legitimate formal quotation for procurement | For Business | PO, tax/commercial terms, approval hierarchy | Reviewed formal quote P0 |
| `ACT-04` Brand/creator buyer | Produce launch merch | Build Merch if active; otherwise Business | Ownership/license, campaign inventory, fulfillment | Human-reviewed service path |
| `ACT-05` Returning organization buyer | Reorder approved apparel spec | Business account context (future) | Existing assets, changed quantities/addresses | Secure reorder P1 after verification |
| `ACT-06` Customer with unfinished artwork | Request advice or design assistance | Customize | No print-ready file, uncertain placement | Submit need; human/design escalation |
| `ACT-07` Customer with unusual high-risk job | Verify feasibility before commitment | Business/contact | Rush, bespoke garment, multiple processes | Assisted only, no instant promise |
| `ACT-08` Authorized client approver | Review quote or exact proof version | Verified link/account when enabled | Price/asset/legal authority | Explicit scoped approve/reject P1 |

**Never infer business eligibility from customer-visible simplicity.** Standard-looking requests can still be disallowed by size, IP risk, supply availability, date, unit economics or current production capacity.

## 3. Customer intent routing and product-surface separation

### 3.1 Intent-based entrance

A public visitor should see meaningful, clearly named paths such as `Shop`, `Customize`, `For Business` and only currently active `Build Merch`. Do not expose MGBOS's internal departments, physical vendor names, financial margin dashboards or internal taxonomies just to explain a customer journey.

| Customer intent | Route | Primary conversion | Stop condition |
|---|---|---|---|
| "Cetak kaos pribadi" | Customize | Qualified requirement/request | Unsupported material/method or unclear feasibility |
| "Seragam untuk 100 staf" | For Business | Account-aware reviewed quotation | Unverified quantity, schedule, samples/PO terms |
| "Beli kaos siap pakai" | Shop | Approved P1 retail checkout; assisted alternative until enabled | Checkout eligibility missing |
| "Saya punya desain tapi belum siap cetak" | Customize | Design-review intake or Studio referral | No deceptive auto-approved artwork |
| "Cetak ulang produk tahun lalu" | Reorder P1/assisted | Fresh reviewed offer | No old-price/old-asset reuse by assumption |
| "Produksi dan kirim ke banyak alamat" | Business | Reviewed fulfillment scope | Shipping data/packaging/privacy/cost not approved |

### 3.2 No premature commitment

Browse, request details, submit inquiry, accept reviewed quote, approve artwork, pay, and authorize production are distinct customer actions. Each actionable surface must show the current factual capability and the actual next step. Where the self-service action does not yet exist, provide a real supported assisted path; do not create a button leading to a mock success state.

## 4. Capability stages and explicit exclusions

| Capability | P0 (assisted) | P1 (governed self-service) | P2 (advanced) |
|---|---|---|---|
| Custom service landing | Clear approved offer, examples, process, CTA | Contextual saved state if secure | Personalized eligible options |
| Structured intake | Guided form or verified assisted capture | Resume with verified identity, drafts if approved | More dynamic choice constraints |
| Artwork | Approved assisted submission or securely implemented basic upload | Secure version review and scoped proof approval | Rule-checked preview/customizer |
| Quote | Human-reviewed, bounded delivery channel | Secure version-specific review/accept/reject | Deterministic instant pricing only for eligible subset |
| Business documents | Requirements for formal quote, PO handling by operator | Role-scoped quote/order/invoice document view | Account catalog and reorder templates |
| Payment | Governed transaction after agreed terms | Customer payment experience if safely integrated | Policy-bounded automation, never unapproved credit |
| Production visibility | True assisted status communication | Permitted customer progress projection | Event-driven milestone views if reliable |
| Supplier workflow | Founder/operator-managed | Governed work queue | Advanced scheduling only after operational evidence |
| AI assistant | Optional drafts internal only; no dependence | Grounded help with fallback if approved | Eligibility guidance, no autonomous commitment |

**Excluded until separate approval:** unrestricted public 3D designer; arbitrary DTF/DTG/screen print/embroidery combinations; real-time factory slot bidding; uncontrolled instant B2B credit; public vendor selection; licensing certification by AI; automatic PO acceptance; complex fulfillment promise; generic Project/Opportunity schema; independent MultiGraph-specific printing configurator; changes to existing live pilot scope.

## 5. P0 Custom guided inquiry — detailed journey

### 5.1 Journey `CX5-JRN-01`: discovery to durable request

| Step | Customer experience | System/product responsibility | Founder / role boundary | Failure / recovery |
|---|---|---|---|---|
| 01 | Understand products, custom methods and process in accessible language | Present only published eligible service information | None | Unavailable offer shows truthful contact path |
| 02 | Select approximate product / purpose | Show curated choices, not supplier's full inventory | None | Unknown item becomes custom review, not invalid fake SKU |
| 03 | Enter quantity and size/color needs | Field guidance and transparent optionality | Review only unresolved feasibility | Missing sizes may be captured for clarification if allowed |
| 04 | Provide artwork or choose "belum punya desain" | Clarify allowed intake method and optionality | Review / Studio escalation when required | Upload failure does not erase form |
| 05 | Enter required/desired date and destination | Say `requested date`, not confirmed delivery date | Verify capacity, vendor and courier feasibility | Rush request gets review state, no auto guarantee |
| 06 | Enter contact and consent as applicable | Validate minimization, duplicate guard and privacy | None unless exception | Expired session preserves input locally only within policy |
| 07 | Review readable request summary | Separates assumptions, customer statements and estimated values | None | Customer can go back without erasing answers |
| 08 | Submit once | Acknowledge only durable accepted request with reference | Request assigned via actual approved source owner | Timeout/duplicate click produces lookup/retry, not fake receipt |
| 09 | Receive truthful next step | `Permintaan diterima, menunggu pemeriksaan` where factual | Founder gets one coherent actionable handoff | Notification failure does not invalidate source request |
| 10 | Provide clarification if asked | Carry previous answers forward; request only missing facts | Human reviews ambiguous / high-risk need | Missing info does not create silent order |

**Moment of truth:** customer can see a compact summary that reflects the exact request; founder can recover the same request and any evidence without retyping chat messages.

### 5.2 Form contract

Minimum early collection should be demand-driven, not a fixed 20-field questionnaire. The following is the proposed semantic field map, **not** a proposed database schema.

| Field group | Customer wording | Collection rule | Validation / uncertainty | System mapping intent |
|---|---|---|---|---|
| Intent | `Mau buat apa?` | Required | Custom vs Business vs not supported | Lead/Requirement origin context |
| Garment | `Produk yang ingin dicustom` | Required as product family or flexible description | Curated/approved alternatives only | Product/requirement draft |
| Quantity | `Berapa jumlahnya?` | Required if known; clarify if exploratory | Positive quantity, MOQ rules from business | Requirement quantities |
| Sizes | `Pembagian ukuran` | Conditional | Sum should match quantity when final | Size breakdown snapshot |
| Colors | `Warna produk` | Conditional | Actual availability not assumed | Configuration selection |
| Decoration | `Lokasi / jenis cetak` | Optional/conditional | Plain-language help; unapproved method needs review | Production requirement intent |
| Artwork | `Sudah ada file desain?` | Always ask as choice; file conditional | `not ready` is a valid assisted path | Artwork intake and source |
| Deadline | `Dibutuhkan kapan?` | Ask only if relevant | Customer request; not seller promise | Requested date/urgency |
| Delivery | `Kirim ke area mana?` | Progressive | No invented shipping amount before calculation | Destination context |
| Contact | Name, allowed contact route | Minimum required for follow-up | Validate contact method, privacy | Customer or Lead contact |
| Business info | Company name, procurement context | Conditional if B2B | No forced legal-account creation in simple inquiry | Business lead context |
| Notes | Special constraints | Optional | Free text is untrusted, not instruction to AI/system | Supporting requirement context |

**Interaction rules:** visible required/optional labels; inline errors next to fields; example values for unclear inputs; progress indication for long flows; back navigation without destructive reset; mobile-friendly file picker; accessible field names; avoid requiring a customer account for a simple inquiry unless risk/compliance demands it.

### 5.3 Conditional question tree

`Product type` → relevant garment options. `Size breakdown` → visible only when meaningful. `Artwork available?` → upload route or design-service route. `Company/order complexity?` → Business intake. `Multiple locations/PO/credit/recurring need?` → human assisted Business. Do not assign commercial/legal standing from a naive budget/quantity threshold without approved policy.

## 6. Business/B2B inquiry, quote and procurement journey

### 6.1 Journey `CX5-JRN-02`: organization request

1. Visitor chooses **For Business**, understands target offers, evidence/samples and what will be reviewed.
2. Contact submits needs, quantity, sizes, logos/artwork, required date, multiple delivery points and relevant buyer/procurement facts.
3. System assembles one request with source and submitted version; operator can see it without reconstructing WhatsApp conversation.
4. Commercial team/founder clarifies requirements, product feasibility, sample need, approved unit economics, lead time, tax/PO/deposit requirements as applicable.
5. Authorized quote is created and delivered with a clear version, validity, specification, amount, inclusions/exclusions and a secure acceptance method.
6. Customer accepts, rejects, or requests revision on a **specific** quote version through approved channels; acceptance does not automatically approve newer versions, artwork or credit.
7. Purchase Order, agreement, contact authorization and any payment prerequisites are reconciled before order/production transitions.
8. Customer receives accurate next steps; business account self-service is P1 and not a P0 requirement.

### 6.2 Formal B2B quote presentation

| Element | Required UX behavior | Do not claim |
|---|---|---|
| Quote number + version | High visibility; link actions to exact version | Silent overwriting of earlier quote |
| Customer/account/contact | Scope and actor clear; only permitted recipient sees private terms | Any company email can approve |
| Product/specification | Garment, variant, quantities, decoration, materials and extras that are actually agreed | Implicit inclusion of unpriced extras |
| Money | Unit/subtotal, discount/tax/shipping if applicable, total, payment/deposit conditions | Discount/credit authorization not verified |
| Validity | Explicit expiration and version state | Old PDF is permanently valid |
| Lead time | Verified or conditional language | Guaranteed slot for a requested date |
| Terms / PO | Clear required documents and next action | PO equals paid order |
| Action options | Accept / ask revision / contact / download where legitimate | "Approved" if submit failed or lacked authority |

**Approved business quote content follows `bisnis/teestock/04-services/business.md`; CX-05 owns only how a customer understands and interacts with it.**

### 6.3 PO, account and credit boundary

A PO represents buyer procurement authorization, not necessarily seller quote acceptance or an actual bank payment. Company-specific pricing, negotiated discounts, deposit schedules and net terms must come from approved commercial authority. The UI may help the buyer upload/provide a PO or reference **if this capability is implemented and authorized**; it must not silently grant credit or mark a transaction paid.

### 6.4 Multiple stakeholders

Buyer, request submitter, artwork reviewer, financial approver and delivery contact may be different individuals. The interface should communicate **which specific person/action** is needed. It must not expose confidential invoices, artwork, employee address lists or account-wide information to someone who only possesses a shareable URL. Actual roles/access policy require Head Engineering review.

## 7. Guided configuration and eligibility (`P2`)

### 7.1 Journey `CX5-JRN-03`: eligible guided builder

Target progressive steps: garment → color/size mix → decoration area/method → artwork → quantity → time/destination → price indication → review/submit. Some steps may be reordered by research and product context; this is an experience model, not a frozen technical implementation.

The builder must be **capability-aware**, not merely a decorative canvas. A customer cannot select unsupported combinations only to be disappointed at final submission. Changes to garment, fabric, print method or quantity must re-evaluate downstream eligibility and clear stale derived values. Support explicit `need help / request review` throughout.

### 7.2 Eligibility matrix

| Candidate | Self-service eligible? | Product decision |
|---|---|---|
| Curated approved garment + standardized known method + known pricing + suitable artwork | MAY after approved evidence | P2 gated direct quote/configuration |
| Approved garment but artwork needs technical/IP judgment | Not for instant-final commitment | Human/authorized review |
| Unverified vendor capacity or requested rush deadline | Not instant | Review date/capacity |
| Customer-provided fabric or unknown substrate | Not instant | Special feasibility/liability review |
| Complex placements / multiple production passes | Only if specifically standardized | Human quote otherwise |
| Bulk B2B bespoke packaging or multi-destination | Not automatically | Formal requirement/quote |
| Missing cost, unclear quantity, price floor/permission issue | NO | No fabricated amount or order |

A **rendered mockup or configuration estimate is never a certificate of print readiness**. Product and sales eligibility, technical feasibility, supply/capacity, commercial authority, artwork rights, customer approval and production release are independent gates.

### 7.3 Estimate versus final quote

Three distinct presentation labels are proposed: `perkiraan biaya` (indicative, uncommitted), `penawaran resmi` (versioned, approved commercial offer) and `jumlah transaksi disetujui` (agreed terms under verified state). The exact localization and commercial copy must be reconciled with Brand Voice and Finance policies. If the figure lacks authoritative input or required approvals, **do not fabricate a price or present placeholder zero**. Show `Perlu peninjauan harga` and a path to a reviewed quote.

## 8. Artwork submission, technical review and file security boundary

### 8.1 Journey `CX5-JRN-04`: submit or declare not ready

A customer may select `Saya punya desain`, `Perlu bantuan menyiapkan file`, or `Belum ada desain`. Upload is only shown when a supported secure implementation exists. Declaring "not ready" must not block an otherwise legitimate request for assistance. The design Studio referral is an explicit service choice with any extra fee requiring a reviewed offer.

### 8.2 Artwork UX states — **projections only**

| UX state | Safe customer meaning | Must not imply |
|---|---|---|
| `Belum diunggah` | No accepted file received | Customer failed unrelated intake |
| `Mengunggah` | Network transfer in progress | Stored/accepted/technically approved |
| `File diterima` | Server confirmed accepted upload receipt | Print-ready/legal clearance |
| `Dalam peninjauan` | Authorized review underway | Approvals guaranteed |
| `Perlu perbaikan` | Specific blocking corrections communicated | Commercial cancellation |
| `Bukti desain untuk ditinjau` | Particular preview/proof offered | Exact printed color/size guarantee |
| `Disetujui pelanggan` | A named authorized customer accepted exact version/scope | Product/production/commercial readiness |
| `Siap produksi` | Only after separate authoritative technical/commercial gates | Proof approval alone creates readiness |
| `Tidak tersedia` | State cannot be verified right now | No asset exists or automatically rejected |

**These are illustrative customer projections, not proposed canonical enums or schema columns.** Existing business artwork-stage vocabulary and source transaction semantics remain authoritative.

### 8.3 Upload behavior

- Publish exact file format, per-file limit and allowed artwork guidance from a **verified production/security policy**. Sample `PNG/JPG/PDF/SVG/AI/EPS` in business docs is NOT proof those types can safely be rendered/processed today.
- Never trust extension alone or preview active/untrusted SVG directly. Virus/content scanning, MIME sniffing, quarantine, private storage, signed/short-lived access and server-side protections are Head Engineering/security responsibilities; UX shall accurately reflect every failure/limitation.
- If upload fails, preserve non-sensitive request fields and permit a safe retry; do not silently submit a reference to an absent file.
- Show clear ownership/license affirmation according to approved policy; do not turn customer upload into a transfer of customer IP.
- File receipt, suitability review, rights review, customer proof approval and print-ready file generation remain separate.
- Do not expose one customer's proprietary artwork to another tenant, account, user or untrusted preview/share route.
- If storage/processing is down, offer approved alternate channel or submit an honest unverified request with `artwork pending`, without claiming upload completion.

## 9. Proof/preview, revision and approval experience

### 9.1 Journey `CX5-JRN-05`: exact-version proof loop

1. Existing version is associated with the correct request/order context; review identifies file or design version, placement, scale, garment context and known limitation.
2. Seller prepares a preview/proof using a supported process; optional AI may help draft comments but cannot certify print readiness.
3. Customer receives a scoped review action through an appropriately authenticated/verified channel.
4. Customer may `approve`, `request change`, or `ask question`; the UI makes consequences clear.
5. If revision occurs, create a new version or otherwise preserve immutable historical evidence through existing governed semantics.
6. Approval of version `v2` must not accidentally approve `v3`; acceptance of a former link must fail safely once obsolete.
7. If material change impacts price or deadline, return to appropriate commercial re-approval, not silent production.
8. An accepted proof alone never starts production unless **all independently required authorized gates** permit release.

### 9.2 Proof panel minimum

| Region | User-facing information |
|---|---|
| Context | Product, size/color or sample scope, order/requirement reference |
| Identity | Exact proof revision, upload/review date, responsible permitted approver |
| Design | Preview with crop/placement context; fallback accessible description |
| Accuracy | Visual approximation disclaimer; sample/material variance where applicable |
| Changes | What differs from prior version; revision impact and unresolved questions |
| Actions | Approve specified version, request correction, contact support |
| Consequence | What approval confirms; what still requires separate checks |
| Evidence | Confirmed action reference/time visible only after durable accepted result |

### 9.3 Example customer notice (illustrative copy)

> **Periksa desain versi 2.** Pratinjau ini membantu memastikan posisi dan komposisi. Warna cetak dan hasil akhir dapat berbeda sesuai bahan/metode yang telah disepakati. Menyetujui desain ini tidak dengan sendirinya berarti pembayaran atau jadwal produksi sudah dikonfirmasi.

**Copy status:** draft example, not approved legal contract wording or universal warranty disclaimer.

### 9.4 Concurrent revisions and stale actions

If customer A approves `v2` while operator replaces it with `v3`, the action must have a version/authority check and a truthful conflict outcome. A user must be shown the latest reviewable version, not a success message for a stale command. Idempotent retries must not produce duplicate approvals, revised prices or production jobs; exact concurrency/transaction implementation belongs to MGBOS engineering.

## 10. Commercial quote, revisions and acceptance

### 10.1 Journey `CX5-JRN-06`: accept/revise/expire quote

| State visible to customer | Allowed action | Critical distinction |
|---|---|---|
| `Sedang disusun` | Await/contact | Draft not a commercial commitment |
| `Siap diperiksa` | Review latest delivered quote | Issued quote may still require customer action |
| `Minta revisi` | Provide correction with context | Customer feedback not a new accepted price |
| `Menunggu persetujuan pihak TeeStock` | Await authorized review | No seller commitment yet |
| `Diterima` | View accepted exact terms | No implicit payment/production release |
| `Kedaluwarsa / diganti` | Ask for updated quote | Must not accept old terms silently |
| `Tidak dapat dipastikan` | Retry/secure contact | Missing status is not rejection |

Labels are illustrative projections. Do not introduce or override quote lifecycle states in MGBOS on the basis of this table.

### 10.2 Review content and commercial authority

Customer must review the approved specification, quantity and size breakup, materials/methods, artwork revision basis if relevant, price/taxes/shipping/fees, expected lead time **subject to approved conditions**, payment terms, validity and required approvals. Quote version and ID should be apparent before any acceptance decision.

A discount, lower margin, rush date, nonstandard material or credit term that crosses a policy gate must reach an authorized operator, not an AI-generated `approved` state. An official quote is only issued from the business's governed source. UI previews, PDFs and messaging snapshots alone are not necessarily proof of accepted business state.

### 10.3 Changes after acceptance

Customer changes to garment, quantity, design, decoration, due date, addresses or other material terms trigger explicit evaluation of price/lead-time/production consequences. The system must identify **what changed, what remains valid, what requires reapproval, and what cannot be safely undone**. No silently edited historical accepted quote or work-order snapshot.

## 11. Payment, deposit and production release boundary

This spec does NOT introduce payment methods, credit rules or financial commands. Customer UI shall display approved payment obligations and any existing confirmed payment state without conflating:

`Quote accepted` → `Order eligible` → `Payment requirement satisfied where required` → `Artwork production requirements satisfied` → `Materials/capacity/production assignment eligible` → `Released to production`.

The sequence may vary with approved business policy; arrows do **not** mandate a single universal MGBOS lifecycle. Payment status is authoritative only when verified through the approved payment/ledger workflow, not screenshots, client redirects or unverifiable chat messages. Bank-transfer assistance, deposits, installments, refunds and credit are **out of autonomous CX/AI control**.

**P0 promise:** a buyer can understand whether the business is reviewing, waiting on a customer, or actively executing authorized work. If the exact real-time state cannot be verified, show `status belum tersedia` and appropriate support, not manufactured progress.

## 12. Production readiness and customer communication

### 12.1 Journey `CX5-JRN-07`: approved work to QC/shipment

| Business milestone | Customer projection | Founder/vendor physical truth | Guard |
|---|---|---|---|
| Requirement captured | We received your request | No materials purchased | Inquiry ≠ accepted order |
| Reviewed quote delivered | Please review offer | Price and feasibility assessment | Quote ≠ guaranteed slot |
| Customer commercial approval | Terms acknowledged | Payment/supply pending as applicable | No auto production |
| Artwork proof approved | Design vN approved | Correct approved snapshot available | No source version drift |
| Production ready/released | Preparation/production when supported | Material sourcing, vendor acceptance, work order | Preconditions must pass |
| Physical production | Order being produced when evidenced | Founder/vendor processes goods | Don't infer from elapsed time |
| Quality check | Being inspected when evidenced | Person physically checks actual output | Virtual preview ≠ QC |
| Packing/shipment | Prepared/dispatched when evidenced | Founder packs and hands package to courier | Label generation ≠ collection |
| Delivery | Delivered only when carrier/evidence supports | Customer receives product | Manual `done` not proof of delivery |

### 12.2 Solo founder execution boundary

System may create a **review queue, shopping/materials checklist, approved supplier request draft, SPK/Work Order artifact preparation, QC checklist, shipping documentation preparation, reminders, customer status draft, and margin/cost reconciliation views** from actual governed records. Founder still physically buys/picks up materials where needed, checks incoming goods, coordinates real vendors, confirms physical output, performs/arranges QC, packs and delivers to a courier.

**High-leverage design measure:** how many times does founder type the same customer specification, chase a status that already exists, or send an identical explanatory message? These are candidate tasks to remove. Requiring founder to retype online form contents into MGBOS means the online journey is not fully implemented.

### 12.3 Capacity and promise honesty

A requested date is not a verified completion promise. Real commitment requires approved stock/material lead time, vendor capability, production duration, QC buffer and fulfillment feasibility, as applicable. The platform must offer alternate timings or reviewed follow-up when uncertain. "Rush" is a request/qualified service, not a premium paid button that conjures capacity.

## 13. Reorder, account context and B2B multi-actor UX (`P1`)

### 13.1 Journey `CX5-JRN-08`: repeat from approved specification

Eligible repeat buyers should be able to inspect an allowed prior item/configuration, pick new quantities/sizes/delivery choices, and request a **new** offer or a governed purchase under current approved rules. Current price, stock, artwork license/expiry, production capability, account authority and terms must be revalidated. Reorder cannot clone the previous invoice/payment or overwrite the prior snapshot.

### 13.2 Privacy and organizational scopes

- Corporate documents and designs must be accessible only to approved actors within correct organization/account context.
- A contact form declaring `I work for Company X` is not an access grant to Company X's order history.
- Email matching alone is insufficient evidence for high-impact approval where stronger verification is required.
- Invitation, delegation and approver changes require reviewed identity and authorization design; no CX-05 role invention.
- Full production costs, supplier rates, internal margin, privileged notes, other customer addresses and unapproved documents must not leak to public users.
- Signed viewing links must have an intentionally constrained lifetime/scope and supported revocation behavior if adopted by engineering.

### 13.3 Business portal does not need an ERP-shaped navigation

For the customer, the essential jobs are: review quote, approve proof, upload correct documents, see order status, request a change, receive invoice when entitled, and reorder. Avoid exposing internal inventory or finance modules. A role-aware mobile-first customer workspace is a future possibility, not a guarantee that B2B account hierarchy is implemented today.

## 14. Frontend interaction, accessibility and resilience

### 14.1 Experience principles inherited from CX-03

- Apply `Neutral Core + Expressive Product Layer`; this document does not define brand colors/font assets.
- Reveal technical fields when relevant and explain their consequence in non-specialist language.
- Favor summaries, reviewable versions, large interactive targets, visible focus, keyboard support, screen-reader labeling, responsive layouts and reduced motion.
- Keep transient draft/upload UI status separate from authoritative business status; allow correction, retries and human escalation.
- Preserve context across form validation errors, internal route changes and review stages, under approved privacy policy.
- User should never need a high-powered desktop to submit an ordinary inquiry; rich previews should degrade gracefully.
- Avoid blocking request submission on optional AI, 3D rendering or noncritical analytics.

### 14.2 Recovery design by failure type

| Failure | Safe experience | Unsafe experience |
|---|---|---|
| Network timeout on submit | Check accepted reference before idempotent retry | Send another order/request blindly |
| Uploaded file rejected | Specific format/size guidance; retain other inputs | Silent discard or claim uploaded |
| Approval link expired | Explain and offer secure new route | Accept obsolete quote/proof |
| Price estimate stale | Clear re-evaluation and changed terms | Silent final-price change |
| Vendor unavailable | Feasibility pending and alternatives | Guarantee production date |
| Payment provider redirect without confirmation | `Menunggu verifikasi`, check authoritative status | Mark paid from client redirect |
| Session expires | Safe reauthentication and preserved eligible draft | Leak private quote in URL |
| AI down / inaccurate | Deterministic forms, approved FAQ or human handoff | Block checkout/inquiry or accept AI guesses |
| Order data temporarily unavailable | Unknown state and support route | False `canceled`, `delivered`, `no orders` |
| Partial customer changes | Explicit unsaved/accepted distinction | Overwrite accepted version |

## 15. Evidence and interaction artifacts

Proposed product design handoff for this domain shall include:

1. Customer-visible process map for Custom P0 and B2B P0, with assisted fallback.
2. Form/question decision tree, validation and mobile-first examples.
3. Clear exemplar quotation and version comparison, including official/not-official indication.
4. Proof panel states: upload, scan/review, correction, version-specific approval.
5. Multi-actor organization/PO scenario covering role and privacy risk.
6. Production-status communications that explain customer action and bounded uncertainty.
7. Recoverable error states and the `what next` copy for every high-value action.
8. Trace from customer submission through approved MGBOS source and relevant evidence IDs.
9. A proposed test fixture set for low-bandwidth mobile, a first-time buyer, an uncertain deadline, a stale proof and a duplicate submission.
10. A founder-burden baseline/measurement proposal showing routine manual steps removed without confusing them with physical work.

**Artifact readiness ≠ runtime availability**; these are expected downstream UX/engineering deliverables after approval and bounded work packages.

## 16. Proposed functional requirements — `CX5-FR-001..046`

All rows are PROPOSED product behavior only. `P0/P1/P2` denote proposed delivery sequence, not an approved code backlog.

| ID | Priority | Product requirement | Proposed acceptance evidence | Trace |
|---|---|---|---|---|
| `CX5-FR-001` | P0 | Discover Custom/Business offer by customer intent | Correct real action and accurate scope | CX1-FR-001 / CX1-FR-005 |
| `CX5-FR-002` | P0 | Show eligible service options and understandable process | No dead-end fake offer | CX2-BP-01 |
| `CX5-FR-003` | P0 | Guided minimal Custom intake | Customer enters only relevant questions | CX1-FR-009 / CX1-FR-010 |
| `CX5-FR-004` | P0 | Capture garment/product family accurately | Unknown product routes to review | Custom §34 |
| `CX5-FR-005` | P0 | Capture quantities, sizes/colors conditionally | Invalid sum/out-of-range corrected | Custom §34 |
| `CX5-FR-006` | P0 | Capture decoration/placement in plain language | Unknown method is review-needed | Custom §34 |
| `CX5-FR-007` | P0 | Capture requested deadline separately | No unverified delivery promise | CX1-FR-012 |
| `CX5-FR-008` | P0 | Capture artwork readiness with alternative routes | `No artwork` remains valid inquiry | CX1-FR-011 |
| `CX5-FR-009` | P0 | Support real authorized artwork receipt or assisted path | No false upload-ready claims | CX2-BP-05 |
| `CX5-FR-010` | P0 | Validate and explain contact/consent inputs | Accessible error and privacy handling | CX3 forms |
| `CX5-FR-011` | P0 | Allow summary/review before submission | Original inputs and assumptions visible | CX1-FR-009 |
| `CX5-FR-012` | P0 | Durable request acknowledgment | Source-issued reference before `received` | CX1-FR-013 |
| `CX5-FR-013` | P0 | Retry without duplicate accepted requests | Repeated submits do not create double work | CX2-BP-02 |
| `CX5-FR-014` | P0 | Route complex/org request to Business | No lost intake context | CX1-FR-014 |
| `CX5-FR-015` | P0 | Clarification/revision preserves initial need | No founder copy/paste requirement | CX1-FR-038 |
| `CX5-FR-016` | P0 | Clearly distinguish estimate/draft/formal quote | Customer recognizes commitment stage | CX1-FR-015 |
| `CX5-FR-017` | P0 | Support reviewed quote communication | Actual authorized content, version, validity | Business §26/27 |
| `CX5-FR-018` | P0 | Present realistic lead-time caveats | Requested date not guaranteed | Custom/Business |
| `CX5-FR-019` | P0 | Preserve commercial approval through approved mechanism | Traceable accepted version/actor | CX2-BP-03 |
| `CX5-FR-020` | P0 | Separate artwork approval, payment and production release | UI never collapses gates | CX2-BP-05 |
| `CX5-FR-021` | P0 | Produce actionable structured operator handoff | Founder not retyping submitted spec | CX1-FR-038 / CX1-FR-039 |
| `CX5-FR-022` | P0 | Support assistance when digital flow unavailable | Human route still legitimate | CX1-FR-040 |
| `CX5-FR-023` | P0 | Explain customer-facing factual next steps | No fabricated production status | CX2-BP-06 |
| `CX5-FR-024` | P1 | Verified secure quote review surface | Only authorized recipient/account | CX1-FR-016 |
| `CX5-FR-025` | P1 | Quote version comparison, expiry and decline/revision | Stale actions blocked | CX1-FR-016 |
| `CX5-FR-026` | P1 | Record scoped customer quote acceptance when approved | Command outcome verifiable; no client-only success | MGBOS commands |
| `CX5-FR-027` | P1 | Capture PO details/document if supported | PO not treated as payment | Business §29/30 |
| `CX5-FR-028` | P1 | Provide role-scoped Business documents/actions | Cross-account views denied | CX1-FR-017 |
| `CX5-FR-029` | P1 | Render proof with exact version and limitation | Preview clearly non-production guarantee | CX1-FR-034 |
| `CX5-FR-030` | P1 | Record authorize/revise proof actions | Old-version or wrong-actor blocked | CX2-BP-05 |
| `CX5-FR-031` | P1 | Show action requests from verified state | Customer knows who needs to act | CX2-BP-06 |
| `CX5-FR-032` | P1 | Project governed order/production statuses safely | No invented completion state | CX1-FR-030 / CX1-FR-031 / CX2-BP-06 |
| `CX5-FR-033` | P1 | Secure specification/quote artifacts for returning customers | No cross-org disclosure | CX1-FR-017 |
| `CX5-FR-034` | P1 | Enable controlled change/revision requests | Impact and reapproval explained | Custom §48 |
| `CX5-FR-035` | P1 | Allow approved account reorder initiation | Fresh commercial and asset validation | Business §71–75 |
| `CX5-FR-036` | P1 | Communicate deposit/payment requirement accurately | No fake paid/credit state | Business §32–34 |
| `CX5-FR-037` | P1 | Ensure customer document access is scoped and revocable | Access test on expired/foreign actor | MGBOS permission model |
| `CX5-FR-038` | P1 | Recover from failed or stale approval actions | Truthful conflict and retry | CX3/CX8 |
| `CX5-FR-039` | P2 | Offer eligible guided configurator | Invalid combination blocked at selection | CX1-FR-018 |
| `CX5-FR-040` | P2 | Dynamically assess approved sellability | Unknown state routes to review | Custom §70 |
| `CX5-FR-041` | P2 | Show preview without overclaiming accuracy | Limitations and proof stage explicit | CX1-FR-019 |
| `CX5-FR-042` | P2 | Provide instant estimate for verified deterministic subset | No unknown cost shown as zero | Pricing policy |
| `CX5-FR-043` | P2 | Reevaluate downstream constraints when selection changes | No stale price/artwork/lead-time | CX3 interaction |
| `CX5-FR-044` | P2 | Offer structured AI assistance only when authorized | Grounded help, safe fallback, no commitments | JARVIS/CX7 |
| `CX5-FR-045` | P2 | Support sample/multi-destination structured review when proven | No fictitious instant multi-site quote | Business special cases |
| `CX5-FR-046` | P2 | Measure self-service vs founder effort reliably | Traceable touch count not inflated claims | CX1 outcomes |

## 17. Proposed business and experience rules — `CX5-BR-001..026`

| ID | Rule |
|---|---|
| `CX5-BR-001` | Accepted inquiry, quote, order, proof and payment each have independent meaning and evidence. |
| `CX5-BR-002` | Customer request date and verified production/delivery commitment are not interchangeable. |
| `CX5-BR-003` | No unsupported garment/method/placement is exposed as safely orderable. |
| `CX5-BR-004` | Unknown cost, supply or capacity must never be converted into zero or guaranteed values. |
| `CX5-BR-005` | Public request form does not create a confirmed order by itself. |
| `CX5-BR-006` | Founder must not re-enter accepted customer data if an approved system handoff exists. |
| `CX5-BR-007` | Repeat requests/retries should not create duplicate accepted effects. |
| `CX5-BR-008` | Quote acceptance is version-specific and authority-dependent. |
| `CX5-BR-009` | Customer PO is not itself payment, credit entitlement or seller fulfillment acceptance. |
| `CX5-BR-010` | Proof approval is exact-asset/version/scope acceptance, not a production-ready certificate. |
| `CX5-BR-011` | New artwork/version invalidates stale approval path where relevant. |
| `CX5-BR-012` | Material change after quote/proof approval requires evaluated impact and reapproval where policy says so. |
| `CX5-BR-013` | Customer-owned artwork stays protected by existing rights/privacy policy; upload does not transfer IP. |
| `CX5-BR-014` | File receipt does not prove malware safety, IP rights, print suitability or proof approval. |
| `CX5-BR-015` | Public-facing private quote/assets may be accessed only through approved authorization context. |
| `CX5-BR-016` | AI may structure, explain and draft only within governed scope; it cannot grant discounts, credit, legal rights or production readiness. |
| `CX5-BR-017` | Mobile, accessible, non-AI assisted entry remains usable when rich features fail. |
| `CX5-BR-018` | No success state before durable acceptance from the actual source. |
| `CX5-BR-019` | Payment status must be verified through approved financial authority, not client redirects or chat screenshots. |
| `CX5-BR-020` | Vendor assignment, procurement, QC and delivery must reflect actual physical evidence where required. |
| `CX5-BR-021` | Internal costs, vendor rates, organization private content and other customers' assets must not leak to buyer interface. |
| `CX5-BR-022` | No unrestricted third-party data or production file is publicly accessible via arbitrary URLs. |
| `CX5-BR-023` | Reorder is a new reviewed transaction, not silent duplication of historic payment/terms. |
| `CX5-BR-024` | Public site may simplify status presentation without inventing new canonical lifecycle facts. |
| `CX5-BR-025` | Full production builder does not become P0 dependency or first-pilot scope. |
| `CX5-BR-026` | Product specification does not itself authorize schema/command/role changes or a Builder work package. |

## 18. Proposed acceptance scenarios — `CX5-AC-001..040`

These are **unexecuted scenario contracts** for eventual independent verification. They do not certify feature availability.

| ID | Stage | Scenario, input, and expected result |
|---|---|---|
| `CX5-AC-001` | P0 | First-time mobile Custom visitor finds supported service and a real inquiry action without searching internal domains. |
| `CX5-AC-002` | P0 | Customer chooses no artwork; legitimate request continues and routes to assistance, not forced upload. |
| `CX5-AC-003` | P0 | Customer selects uncertain garment/printing method; interface requests review, not instant-price guarantee. |
| `CX5-AC-004` | P0 | Quantity is invalid; accessible inline guidance prevents invalid submission while retaining other fields. |
| `CX5-AC-005` | P0 | Mixed garment sizes do not total quantity; review/correction required when final breakdown is necessary. |
| `CX5-AC-006` | P0 | Customer requests unrealistic delivery date; status reflects requested date and feasibility review. |
| `CX5-AC-007` | P0 | Corporate procurement, bulk and formal terms route to Business without losing prior inputs. |
| `CX5-AC-008` | P0 | Submission is accepted and returns actual durable reference and truthful awaiting-review status. |
| `CX5-AC-009` | P0 | Network timeout with accepted request resolves by safe lookup/retry; no duplicate actionable request. |
| `CX5-AC-010` | P0 | Failed submission produces no false request reference/success badge; customer has working retry or contact. |
| `CX5-AC-011` | P0 | Operator retrieves all authorized submitted specification fields without manual transcription. |
| `CX5-AC-012` | P0 | Quote not yet approved for sending is labeled draft/unavailable; customer cannot accept an invalid offer. |
| `CX5-AC-013` | P0 | Reviewed quote makes identity/version, totals, scope, validity and conditions intelligible. |
| `CX5-AC-014` | P0 | Customer requests revision and earlier facts remain traceable; accepted old terms not silently rewritten. |
| `CX5-AC-015` | P0 | Customer approves artwork, but production prerequisites absent; production does not start. |
| `CX5-AC-016` | P0 | Founder buying supplies/doing QC and handing shipment to courier require actual physical evidence, not AI-generated state. |
| `CX5-AC-017` | P0 | AI or rich media unavailable; inquiry and human-assisted contact remain functional. |
| `CX5-AC-018` | P0 | UI unavailable state is not misrepresented as no quote, canceled order or delivered product. |
| `CX5-AC-019` | P1 | Buyer with correct authorization views permitted own quote; unrelated account actor cannot read it. |
| `CX5-AC-020` | P1 | Old or expired quote version cannot be accepted through stale client action. |
| `CX5-AC-021` | P1 | Concurrent quote update and customer approval are detected; customer sees current reviewable version. |
| `CX5-AC-022` | P1 | PO upload/reference does not mark payment confirmed or grant credit without policy. |
| `CX5-AC-023` | P1 | User who is not designated approver cannot approve confidential B2B terms. |
| `CX5-AC-024` | P1 | Uploaded file receipt does not display `print-ready` before technical and rights review. |
| `CX5-AC-025` | P1 | Disallowed size/type/untrusted SVG or unsafe file is safely rejected/quarantined with recovery guidance. |
| `CX5-AC-026` | P1 | Design `v2` approved; new `v3` uploaded; old approval cannot release `v3`. |
| `CX5-AC-027` | P1 | Proof rejection returns actionable correction request linked to exact version. |
| `CX5-AC-028` | P1 | Proof approval result records authorized actor/version only after durable accepted effect. |
| `CX5-AC-029` | P1 | Customer-visible production status is based on governed evidence, not elapsed timer or optimistic UI. |
| `CX5-AC-030` | P1 | Customer supplied garment or atypical substrate remains review-only unless controlled policy allows. |
| `CX5-AC-031` | P1 | A material change after approval triggers price/date/production impact review before next commitment. |
| `CX5-AC-032` | P1 | Reorder references permitted spec, creates new review context and checks present availability/price. |
| `CX5-AC-033` | P1 | Cross-org/expired document link cannot expose artwork, quote or invoice; error reveals no privileged data. |
| `CX5-AC-034` | P1 | Deposit/client payment screenshot does not mark payment booked absent authoritative payment evidence. |
| `CX5-AC-035` | P1 | Keyboard/screen-reader/mobile buyer can review error, versioned proof and correct actions. |
| `CX5-AC-036` | P2 | Guided builder hides/disables invalid garment-decoration placement combinations and explains why. |
| `CX5-AC-037` | P2 | Changing quantity or material invalidates outdated price/lead-time or preview dependencies. |
| `CX5-AC-038` | P2 | Unknown cost or vendor capacity blocks instant-final price, offering human quote instead. |
| `CX5-AC-039` | P2 | Mockup differs from approved production proof; user sees explicit difference/limitation and no automatic release. |
| `CX5-AC-040` | P2 | Automated inquiry assistance disabled; non-AI route still produces correct governed request and evidence. |

### 18.1 Required test dimensions

Every approval/upload/quote scenario should eventually be exercised with happy path, invalid input, duplicate retry, stale version, concurrent change, unauthorized account, missing authority, network/processor failure and fallback. Production-affecting scenarios must be independently reviewed in appropriate ephemeral/disposable environments, never casually against a live production database. Any real pilot or launch requires separate approval.

## 19. Metrics and research plan

### 19.1 Instrumentation proposal (subject to CX-08/CX-09 privacy review)

| Metric | User/business meaning | Initial target posture |
|---|---|---|
| Qualified inquiry completion | Eligible customer completes one real request | Baseline first; target after testing |
| Time to submit | Friction in discovery and form | Measure p50/p75 by device; no invented SLA |
| Missing requirement rate | Inquiries requiring clarification for skipped spec | Compare before/after guided form |
| Duplicate inquiry rate | Retries creating two accepted tickets/records | Target **zero accepted duplicate effects** |
| Quote turnaround | Delay between accepted valid request and issued quote | Baseline by offer complexity |
| Quote revision cause | Ambiguity or wrong specs | Categorized root cause, no vanity percentage |
| Wrong proof/version incidents | Commercial/production rework risk | Target **zero unauthorized version acceptances** |
| Artwork rework rounds | Production clarity and customer workload | Measure by artwork readiness/complexity |
| Founder touches per inquiry | Manual administrative burden | Baseline vs structured intake; physical tasks separate |
| Manual transcription minutes | Re-entry of already submitted data | Target zero for integrated accepted requests |
| Customer status questions | Customer effort due to unclear progress | Trend by order cohort |
| Gross margin leakage caused by incorrect promises | Business economics risk | Audit exception causes; do not claim zero until measured |

### 19.2 Discovery fixtures

Test with real or realistic, privacy-safe users: (a) first-time buyer needing ten custom tees without print vocabulary; (b) 100-piece staff uniform, six sizes and a date requirement; (c) brand team with artwork but uncertain legal rights; (d) returning company with changed uniform color; (e) buyer with two possible decoration methods; (f) custom garment not in approved catalog; (g) authorized purchasing approver and non-approver; (h) low-end mobile device and poor network; (i) delayed vendor response; (j) proof `v2` vs `v3` concurrency.

No fake claim of actual research sessions. The fixtures are **proposed** until research is run and results recorded.

## 20. Risks, unknowns and decisions

### 20.1 Material risk register

| ID | Risk | Consequence | Required mitigation/gate |
|---|---|---|---|
| `CX5-RISK-01` | Attractive custom builder sells unsupported configuration | Refund/rework/brand damage | Approved offer and production eligibility model |
| `CX5-RISK-02` | Requested date treated as promised | Missed customer deadline | Capacity/lead-time verification |
| `CX5-RISK-03` | Old quote/proof approval applied to new version | Wrong work produced | Version/authority/concurrency controls |
| `CX5-RISK-04` | Private artwork exposed | IP/privacy/customer harm | Security design and authorization review |
| `CX5-RISK-05` | Unsafe file accepted/displayed | Security incident | Secure upload/processing/preview controls |
| `CX5-RISK-06` | B2B PO/credit misclassified as payment | Financial loss | Finance/permission gate |
| `CX5-RISK-07` | Unverified instant quotation erodes margin | Cashflow and supply risk | Governed price/cost floors and human fallback |
| `CX5-RISK-08` | Duplicate click or retry creates duplicate jobs | Founder/vendor confusion | Idempotent accepted effects |
| `CX5-RISK-09` | Frontend shows fictitious progress | Misleading customer | Evidence-backed read model |
| `CX5-RISK-10` | Too many dynamic questions | Lower inquiry conversion | Progressive disclosure/usability testing |
| `CX5-RISK-11` | AI answer overstates technical suitability | Customer loss/unsafe commitments | Grounding, limited authority, evaluation |
| `CX5-RISK-12` | Ambiguous distinction between TeeStock and MultiGraph services | Scope and commercial confusion | Brand routing and separate later printing PRD |
| `CX5-RISK-13` | Rich preview slows mobile | Lost customers | Lazy progressive preview/performance gate |
| `CX5-RISK-14` | Duplicate semantic ownership in docs | Builder implements contradictory rules | Canonical source/routing reconciliation |

### 20.2 Owner decision register — **OPEN / PROPOSED**

| ID | Decision to freeze before activation | Working recommendation | Owner/reviewer |
|---|---|---|---|
| `CX5-DEC-01` | First eligible P0 offer subset | Custom + Business assisted; only actual supported offers | Owner/Product |
| `CX5-DEC-02` | Public intake implementation readiness | No fake online submit until genuine source link | Head Engineering |
| `CX5-DEC-03` | Minimum inquiry fields by product | Minimal intent/product/qty/date/artwork/contact, conditional extra | Owner/Product |
| `CX5-DEC-04` | Quote issuance/approval channels P0 | Authorized existing channel with traceable evidence | Owner/Operations |
| `CX5-DEC-05` | P1 approval channel and authentication | Choose based on threat model/permissions | Head Engineering/Security |
| `CX5-DEC-06` | Acceptable file types/size/storage | Determined by verified production/security policy | Owner + Engineering |
| `CX5-DEC-07` | Customer artwork rights/retention | Reference Legal/IP; no new owner rule | Legal/IP Owner |
| `CX5-DEC-08` | Proof preview limitations and customer copy | Disclosure based on real method and sample risk | Owner/Production |
| `CX5-DEC-09` | Client roles and delegated approval | Require explicit authority design | Head Engineering |
| `CX5-DEC-10` | Discount, rush and credit approvals | Existing finance authority; never AI default | Owner/Finance |
| `CX5-DEC-11` | Production-readiness gates | Existing MGBOS + true physical evidence | Head Engineering/Operations |
| `CX5-DEC-12` | Reorder and account portal timing | P1 only if real repeat demand and identity ready | Owner/Product |
| `CX5-DEC-13` | Instant price / builder eligibility | P2 constrained to proven deterministic catalog | Owner + Engineering |
| `CX5-DEC-14` | AI assistance launch | Optional only after policy, cost and eval evidence | JARVIS/Owner |
| `CX5-DEC-15` | Multi-address/B2B project handling | Assisted until supported governed workflow | Owner/Operations |
| `CX5-DEC-16` | Validation KPIs and sampling cohorts | Measure real founder admin savings and buyer success | Product/Owner |

### 20.3 Explicit research and implementation unknowns

- Which SKU/garment sizes and methods are actually sellable under current TeeStock commercial policy and vendor agreements?
- Do artwork versions and scoped approval command semantics already exist as current implementation, or are only target/specification?
- Which file formats are technically safe to ingest and preview in the chosen processing pipeline?
- Which customer-visible state projections can MGBOS actually derive reliably today?
- What is the authorized quote acceptance mechanism and evidence chain in active operations?
- How are organization contacts, approvers and external purchasers validated against MGBOS permissions?
- What are the actual transaction/communication costs and vendor response lead times?
- Is the quality of legacy TeeStock mockup data sufficient to reuse after rights/source audit?
- Are B2B multi-destination or creator merchandise offers economically justified by early orders?
- Is an approved secure portal better than assisted links for the first repeating B2B account cohort?
- What is the actual impact on founder work minutes and customer completion from progressive intake?
- Are real customer privacy/data retention and notification channels ready for such a flow?

These unknowns are NOT evidence that the missing behavior already works.

## 21. Traceability: upstream requirements and downstream ownership

| CX-05 area | CX-01 Master | CX-02 blueprint | CX-03/CX-04 | Downstream owner |
|---|---|---|---|---|
| Custom inquiry | `CX1-FR-009..015`, `038` | `CX2-BP-02` | CX-03 forms | Product CX-05; MGBOS leads/requirements |
| Business formal quote | `CX1-FR-014..017` | `CX2-BP-03` | CX-03 review | TeeStock Business + MGBOS quote/identity |
| Artwork | `CX1-FR-011/019/034` | `CX2-BP-05` | CX-03 file/review | TeeStock Custom/Legal/IP + governed asset owner |
| Proof approval | `CX1-FR-016/019/034` | `CX2-BP-05` | CX-03 state | MGBOS permission/command review |
| Order/payment handoff | `CX1-FR-015/038..040` | `CX2-BP-02/03/05` | CX-04 payment boundary | MGBOS invariants/finance/production |
| Business portal/reorder | `CX1-FR-017/035` | `CX2-BP-03/06` | CX-03 portal interaction | CX-06 account/support; MGBOS auth |
| AI support | `CX1-FR-040/043/046` | `CX2-BP-08` | CX-03 fallback | JARVIS + CX-07 + Head Engineering |
| Performance / a11y | CX1 NFR series | All journeys | CX-03 | CX-08 quality contracts |
| Release sequencing | CX1 P0/P1/P2 | All | CX-04 retail separate | CX-09 roadmap; Owner/Head Engineering |

**Special cross-scope caution:** CX-05 is TeeStock apparel Custom/Business. It must NOT silently become the master product contract for **MultiGraph general printing or packaging**. Those need their own customer/revenue model and release package using shared MGBOS primitives only where appropriate.

## 22. Acceptance gates, definitions of ready and stop conditions

### 22.1 Product draft complete (this document)

- [x] Establish actual source provenance and authority/non-goal boundary.
- [x] Separate customer Custom, Business, retail and future creator contexts.
- [x] Define P0 assisted, P1 scoped self-service and P2 deterministic advanced UI.
- [x] Define artwork receipt, review, proof approval, commercial acceptance and production as distinct gates.
- [x] Define failure/recovery, privacy, upload, identity and cash integrity requirements.
- [x] Provide draft functional requirements, business/UX rules and testable scenarios.
- [x] Map author-known dependencies, research unknowns and review owners.
- [ ] Independent cross-document semantic audit, latest branch reconciliation and owner approval **not performed**.

### 22.2 Product-to-architecture handoff (`NOT_STARTED`)

Before any approved implementation, Head Engineering should examine the exact current source and canonical model for: file/version/proof identity, quote acceptance, customer actor/organization roles, price/production authorization, concurrency/idempotency, event/outbox/projected statuses, upload security and customer-portal identity. Reuse current source where valid. Do not add root tables/entities merely because CX-05 lists a customer experience object.

### 22.3 Product-to-engineering gate (`BLOCKED`)

Required sequence: `approved product requirement → architecture impact review → current-code and risk audit → technical plan → independent approval → bounded implementation contract/work package → Antigravity implementation → independent tests → authorized release`. This DRAFT is not an IC/WP.

### 22.4 Stop conditions

Stop an action/release if a quote or proof is stale, approver identity cannot be verified, quote authority absent, production inputs unknown, artwork legal/technical review incomplete where required, file handling insecure, money/credit conditions unverified, duplicate effects possible, cross-org access possible, provider claim unsupported, or any high-risk test lacks credible evidence. Show customer an honest pending or assisted next action instead.

## 23. Research and UX scenarios for illustrative 100-piece custom order

**Example, not verified capacity or a commercial offer:** Business customer requests 100 custom tees in six sizes with logo front/back and delivery for an event. Website collects garment family, size distribution, design readiness, requested event date, estimated destination and authorized contact; system creates one structured request if the real intake handler accepts. Founder reviews garment pricing, method, vendor, material capacity and delivery feasibility; an authorized quote with version and validity is issued. Customer approves commercial terms and proof `v2` through the appropriate verified channels. Payment/deposit and production gates are evaluated by actual governed business rules; founder physically procures materials and coordinates vendor. After production, founder/QC checks 100 items against approved specification, packs and hands them to courier with evidence. Customer sees each milestone only when supported by authoritative records.

**Two negative variants:** (a) customer uploads proof `v3` after approving `v2` — automatic production of `v3` is blocked and the correct approval is requested; (b) an enthusiastic AI says "bisa sampai besok" while vendor capacity is unknown — actual offer remains under review, with no firm date or unapproved financial commitment.

**Founder-leverage outcome:** accepted request and proofs remain structured and traceable; founder is not reconstructing brief, price, size lists and asset versions in WhatsApp after each handoff. Physical tasks remain explicit and are not misrepresented as automated.

## 24. Proposed source register and reproducibility

Source URLs point to the audited baseline; before canonical promotion or later builder use, re-check fresh main and pending PRs.

| Canonical/existing source | Relevant authority |
|---|---|
| [`TS Custom`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/04-services/custom.md) | Custom product, artwork, funnel, print and quote policies |
| [`TS Business`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/04-services/business.md) | B2B quotes, PO, payment terms, account and reorder |
| [`TS Digital Vision`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/digital-product-vision.md) | Staged Custom/Business experience and single truth |
| [`Website IA`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/website-information-architecture.md) | Customer intent routes, Custom and Business UX |
| [`MGBOS Integration`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/11-data-mgbos/mgbos-integration.md) | Website command/read integration boundary |
| [`Production System`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/07-operations/production-system.md) | Job/work-order production truth |
| [`Quality Control`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/07-operations/quality-control.md) | Inspection against approved spec |
| [`Design Library Spec`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/product/teestock-design-library-spec.md) | Proposed asset/version/security requirements, subject to implementation evidence |
| [`MGBOS Domain Ownership`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/architecture/domain-map-capability-ownership.md) | Canonical system ownership and non-entity discipline |
| [`MGBOS Business Invariants`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/architecture/business-invariants.md) | Truth, transactions, permissions, enforcement layers |
| [`Founder Control PRD`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/product/teestock-founder-control-prd.md) | Owner attention program; not a customer storefront PRD |
| [`Operational Pilot Plan`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/product/teestock-operational-pilot-plan.md) | Approved assisted-sales pilot sequencing constraints |
| [`Current TeeStock Custom route`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/apps/teestock/src/app/custom-atelier/page.tsx) | Public application placeholder at pinned revision |
| `cx-00..cx-04` local working drafts | Proposed product planning context, NOT yet merged canonical documentation |

## 25. Final disposition

`CX5_DOCUMENT_STATUS: DRAFT_SELF_REVIEWED`

`PRODUCT_DIRECTION: READY_FOR_CROSS_DOCUMENT_AUDIT`

`OWNER_CANONICAL_APPROVAL: PENDING`

`ENGINEERING_READINESS: NOT_READY_FOR_ENGINEERING`

`IMPLEMENTATION_MERGE_DEPLOY_PRODUCTION_AUTHORITY: NONE`

**Recommended next action:** draft CX-06 Customer Account & Service Experience; after completing CX-07..CX-09, reconcile CX-00..CX-09 against current main, canonical source map, active PR documentation routing and founder-control roadmap. Require independent semantic/UX review and Owner acceptance before Head Engineering derives bounded work packages. No direct Antigravity coding handoff from this raw PRD.

---

## Remediation R1 — explicit master requirement trace (generated draft, non-authoritative)

The rows below are generated from `CX-PKG-TRACE-R1.csv` (the sole package-wide mapping table). They do not introduce additional product requirements, approve a release stage, change any domain/architecture policy, or prove acceptance. Only exact locally declared IDs are linked; review the complete matrix for gates, ambiguities and candidate staging.

| CX-01 master ID | Exact declared detail IDs in this document | Selected existing acceptance | Candidate slice |
|---|---|---|---|
| `CX1-FR-003` | `CX5-FR-001` | `CX8-AC-001` | `CX-S0` |
| `CX1-FR-004` | `CX5-FR-002` | `CX9-AC-005` | `CX-S0` |
| `CX1-FR-009` | `CX5-FR-003`, `CX5-FR-011` | `CX8-AC-006` | `CX-S0` |
| `CX1-FR-010` | `CX5-FR-003`, `CX5-FR-005` | `CX8-AC-006` | `CX-S0` |
| `CX1-FR-011` | `CX5-FR-008`, `CX5-FR-009` | `CX8-AC-028` | `CX-S0` |
| `CX1-FR-012` | `CX5-FR-007`, `CX5-FR-018` | `CX8-AC-007` | `CX-S0` |
| `CX1-FR-013` | `CX5-FR-012`, `CX5-FR-013` | `CX8-AC-005` | `CX-S0` |
| `CX1-FR-014` | `CX5-FR-014` | `CX5-AC-007` | `CX-S0` |
| `CX1-FR-015` | `CX5-FR-016` | `CX9-AC-005` | `CX-S0` |
| `CX1-FR-016` | `CX5-FR-024`, `CX5-FR-025` | `CX8-AC-027` | `CX-S2` |
| `CX1-FR-017` | `CX5-FR-028` | `CX8-AC-025` | `CX-S2` |
| `CX1-FR-018` | `CX5-FR-039`, `CX5-FR-040` | `CX9-AC-025` | `CX-S3` |
| `CX1-FR-019` | `CX5-FR-041` | `CX8-AC-029` | `CX-S3` |
| `CX1-FR-034` | `CX5-FR-029` | `CX5-AC-027` | `CX-S2` |
| `CX1-FR-035` | `CX5-FR-035` | `CX8-AC-034` | `CX-S2` |
| `CX1-FR-038` | `CX5-FR-021` | `CX8-AC-005` | `CX-S0` |
| `CX1-FR-039` | `CX5-FR-021` | `CX9-AC-035` | `CX-S0` |
| `CX1-FR-040` | `CX5-FR-022` | `CX8-AC-012` | `CX-S0` |
| `CX1-FR-044` | `CX5-FR-046` | `CX6-AC-044` | `CX-S2` |
| `CX1-FR-046` | `CX5-FR-044` | `CX6-AC-043` | `CX-S3` |

**Review state:** `R1_AUTHOR_SEMANTIC_MAPPING_ONLY`; requires Owner/Head Engineering decision and independent product review before canonical activation.

### CX-REM-R1-001 — Corrected invalid journey IDs and parent-semantic link

- Eight previous `CX2-JRN-*` references in functional requirement rows now point to actual declared `CX2-BP-01/02/03/05/06` headings, chosen per row meaning. No new blueprint ID was invented.
- `CX5-FR-032` formerly linked to master `CX1-FR-032/033` (support and return request). Its product meaning is governed order/production-status presentation, and it now links to `CX1-FR-030` (authorized status/help), `CX1-FR-031` (scoped order status) and `CX2-BP-06` (customer progress/service blueprint).
- These updates fix trace semantics only. They **do not** upgrade the public portal, formal approval system, or current physical order state to implemented.
