---
canonical_id: bisnishub.strategy.internal-business-os.parallel-pilots
status: ACTIVE
version: 1.0.0
owner: Rizky
author: ChatGPT / AI Co-Founder & Strategic Product Architect
approver: Rizky
scope: cross-business-portfolio-pilot-strategy
document_class: canonical-strategy
effective_from: 2026-10-20
normative_authority: CANONICAL_DUAL_PILOT_OPERATING_STRATEGY
authoritative_for:
  - Dual-pilot strategic operating model and portfolio coordination policy
  - Cross-pilot hypothesis, outcome and evidence boundary
  - Portfolio-level pilot interaction and prioritization guidance, subordinate to accepted launch sequencing
source_main_sha: 8c7731a13867f38b391ea2f38e9ae7b1f0a7e540
source_observed_date: 2026-10-20
last_reviewed: 2026-10-20
owner_direction_recorded_on: 2026-10-20
teestock_primary_business: CURATED_DESIGN_APPAREL
teestock_business_custom_role: SECONDARY_OR_SEPARATELY_GOVERNED_OPERATING_VALIDATION
teestock_strategy_reconciliation:
  status: REQUIRED_NOT_COMPLETED
  conflicting_existing_operational_priority: DEC-TS-2026-009
  existing_retail_presentation_decision: DEC-TS-2026-011
  no_automatic_supersession: true
revision_reason: "Owner clarification: TeeStock curated-design-led brand and primary product, not Business/Custom-primary"
review_cadence: quarterly
review_independence: OWNER_ADOPTED
content_readiness: ACTIVE
implementation_authorization: NONE
merge_authorization: NONE
deployment_authorization: NONE
pilot_execution_authorization: NONE
supersedes: null
dependency_path_base: repository-root
depends_on:
  - docs/strategy/internal-business-os/strategic-anchor.md
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/architecture/master-system-blueprint.md
  - docs/architecture/system-boundaries.md
  - docs/operating-model/solo-founder-operating-system.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - bisnis/teestock/00-foundation/decision-register.md
  - bisnis/teestock/14-roadmap/current-quarter.md
  - bisnis/multigraph/README.md
  - systems/mgbos/docs/architecture/domain-map-capability-ownership.md
  - systems/mgbos/docs/architecture/business-invariants.md
  - systems/mgbos/docs/architecture/business-state-machines.md
  - systems/mgbos/docs/engineering/operational-readiness.md
  - systems/jarvis/docs/charter.md
  - systems/mgbos/docs/product/teestock-operational-pilot-plan.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md
consulted_non_authoritative_sources:
  - bisnis/multigraph/riset/arsitektur-ekosistem-multigraph.md
  - bisnis/multigraph/keuangan/sistem-keuangan-multiunit-cfo.md
---

# BisnisHub — Dual Pilot Operating Strategy

**Document ID:** `bisnishub.strategy.internal-business-os.parallel-pilots`  
**Target path:** `docs/strategy/internal-business-os/parallel-pilots.md`  
**Document version:** `0.2.0`  
**Snapshot:** `Rizkybuilds/bisnishub@8c7731a13867f38b391ea2f38e9ae7b1f0a7e540`  
**Disposition:** complete strategic operating strategy, ACTIVE upon Owner adoption; not an independently verified runtime/production approval.

---

## 0. Contract for human, AI and system readers

### 0.1 Purpose

This document specifies a **proposed portfolio operating strategy** for two parallel, deliberately asymmetric Internal Business OS pilots: **TeeStock as curated-design apparel** and **MultiGraph as print-service solutions**. The founder clarified this primary brand/product distinction on 2026-10-20; earlier Business/Custom-prioritized operating documents are a **separate reconciliation issue**, not the definition of TeeStock. It establishes the relationship between the two business lanes, their minimum operating envelopes, learning objectives, coordination boundaries, candidate evidence, risk controls, escalation rules, and dependency-respecting priorities.

It answers:

1. What exactly is meant by *two parallel pilots*?
2. Which pilot behaviors differ, and which need the same trustworthy MGBOS foundation?
3. What is eligible for discovery, limited implementation, or live commercial commitments?
4. Which existing documents already determine current priorities and gates?
5. How do we prevent double operating burden, duplicate financial truth, and premature automation?
6. What facts and evidence would justify subsequent investment or expansion?

It intentionally does **not** establish new SQL entities, public release permission, MGBOS business invariants, TeeStock retail policy, MultiGraph pricing policy, supplier contracts, production SLAs, payment limits, legal entity structure, or a replacement for the existing launch roadmap.

### 0.2 Reading and authority rules

- `SOURCE_ACTIVE`: claim grounded in an `ACTIVE` document/decision in the pinned snapshot; read the cited source for its exact authoritative scope.
- `SOURCE_DOCUMENTED`: current text present in a repository business document without asserting that its metadata has the `ACTIVE` lifecycle status.
- `OWNER_SELECTED_DIRECTION`: user-selected portfolio strategy reflected here; **not** by itself a signed repository ADR or runtime authorization.
- `PROPOSED`: recommended design, threshold, workflow, allocation, or pilot policy pending adoption in the proper semantic-owner document.
- `NOT_VERIFIED`: real-world capacity, live payments, organization mapping, supplier performance, production readiness, demand, and any other fact without qualifying evidence.
- `BLOCKED_BY_GATE`: activity cannot be represented as authorized merely because documents, prototypes, or CI results exist.

The frontmatter status `REVIEW` takes precedence over confident wording within this document. Copying the document into the repository is **not** automatic activation. The root documentation constitution and canonical source map govern activation and conflict resolution. A later accepted decision can alter this proposal only through explicit reconciliation.

### 0.3 Claims this document must not make

The existence of:

- a merged feature;
- a passing CI run;
- a completed mockup or PRD;
- a planned or approved software architecture;
- an owner-selected business direction;
- a successful synthetic transaction;

**does not, by itself, prove** legal readiness, actual demand, vendor quality, a reconciled real payment, production readiness, live checkout eligibility, or pilot success.

### 0.4 Source freshness and conflict handling

The baseline SHA above is a source-identification anchor, **not** a statement that `main` will remain unchanged. Before adopting or executing this strategy, check current `main`, relevant open PRs, the current launch-roadmap stage, operational-readiness evidence, and any post-baseline TeeStock/MultiGraph decisions. If a source differs, mark the affected claim `NEEDS_RECONCILIATION`; do not silently prefer this document because it is newer.

---

## 1. Adopted portfolio intent and unresolved authority

| ID | Statement | Classification | Semantic owner |
| --- | --- | --- | --- |
| `DP-INT-01` | BisnisHub is intended primarily as an Internal Business Operating System for the MultiGraph Group portfolio; it is not presently being optimized as third-party horizontal SaaS. | `OWNER_SELECTED_DIRECTION` | Portfolio strategy / Owner |
| `DP-INT-02` | TeeStock and MultiGraph are selected as **parallel pilots**. | `OWNER_SELECTED_DIRECTION` | Portfolio strategy / Owner |
| `DP-INT-03` | The pilots should use one governed operational foundation and preserve distinct commercial experiences. | `PROPOSED` design interpretation; consistent with existing boundaries | Root architecture + MGBOS semantic owners |
| `DP-INT-04` | TeeStock's principal brand identity, intended product business and commercial growth proposition are **curated design apparel**, not Business/Custom. Its existing assisted Business/Custom D4/Q4 operating-validation program remains documented but must be reconciled; do not conflate pilot technique with brand strategy. | `OWNER_SELECTED_DIRECTION` (2026-10-20); **MATERIAL_RECONCILIATION_REQUIRED** vs `SOURCE_ACTIVE` `DEC-TS-2026-009`; consistent with retail presentation part of `DEC-TS-2026-011` | TeeStock business / Owner |
| `DP-INT-05` | MultiGraph currently has a documented role as TeeStock packaging supporting arm and external B2B research; a bounded external quotation pilot is an additional direction, not an already active commercial policy. | `SOURCE_DOCUMENTED` for existing role (`README` has `status: supporting-arm`); `OWNER_SELECTED_DIRECTION` for new pilot | MultiGraph business |
| `DP-INT-06` | Current launch-stage strategic sequencing remains owned by the active solo-founder launch roadmap, not by this proposal. | `SOURCE_ACTIVE` | Root roadmap |
| `DP-INT-07` | No pilot is implicitly cleared for real customer transactions, production deployment, financial execution, or autonomous business action. | `BLOCKED_BY_GATE` | Applicable business, system, assurance and Owner authorities |
| `DP-INT-08` | TeeStock curated products/collections and customer demand take product-strategy precedence; MultiGraph takes print-service/quotation responsibility. Existing TeeStock Business/Custom tests are neither suppressed nor counted as curated apparel product-market validation. | `OWNER_SELECTED_DIRECTION` and `PROPOSED` governance reconciliation | TeeStock and MultiGraph business owners + root portfolio strategy |

### 1.1 Working meaning of "parallel"

**Parallel discovery:** both brands can investigate users, offers, suppliers, service feasibility, product requirements and customer experience in the same planning period.

**Parallel bounded product definition:** both brands may define their smallest useful customer-to-outcome journeys and requirements, subject to shared semantic ownership.

**Shared engineering path:** changes to common Order, Payment, Production, Vendor, QC, Fulfillment and Cost/Margin contracts are coordinated through MGBOS. They are **not** forked independently for each brand.

**Asymmetric activation:** one lane can be valid for assisted sales while the other is limited to research, nontransactional UI, or internal rehearsal. They have separate commercial and readiness gates.

**Independent learning:** the results of each lane are recorded separately; a success or failure in one lane does not imply the same result in the other.

**Not implied:** simultaneous production launch, two independently deployable ERPs, two teams working unsafely on the same core module, equal spending, equal feature count, same sales channel, or equal revenue targets.

### 1.2 Business portfolio versus legal company

`MultiGraph Group` is a strategic portfolio umbrella in this document. `MultiGraph` is the printing-services brand/pilot. `MGBOS` is the operational system. These are distinct concepts.

**NOT_VERIFIED:** exact legal entities, contracts, tax scope, bank accounts, beneficial ownership, intercompany transaction policy, and MGBOS organization/brand mappings. The two pilot labels MUST NOT be assumed to mean two incorporated companies, two settlement accounts, or interchangeable organizational access scopes.

These questions belong to owner-approved business, finance and identity authority. Until resolved, implement no artificial intercompany payments, duplicated revenue recognition, or cross-organization data access based solely on brand names.

---

## 2. Pilot topology — curated TeeStock first, MultiGraph print service second

### 2.1 Portfolio-to-system conceptual map

```text
                         INTERNAL BUSINESS OS
                    Portfolio intent: MultiGraph Group
                                    |
                +-------------------+---------------------+
                |                                         |
   TEESTOCK — CURATED-DESIGN APPAREL          MULTIGRAPH — PRINTING SOLUTIONS
                |                                         |
     TS-B: Curated design, collections,         MG-A: TeeStock packaging
           retail-led brand experience               supporting work
     TS-D: Curated product demand +             MG-B: Bounded external
           fulfillment validation (gated)             quotation research/pilot
     TS-C: Curated retail checkout
           self-service (future gated)
     TS-A: Existing D4 Business/Custom
           operating validation (supporting)
                |                                         |
                +-------------------+---------------------+
                                    |
                       GOVERNED MGBOS CORE
               Customer / Requirement / Quote / Order
                Payment / Production / Vendor / QC
                    Fulfillment / Cost / Margin
                                    |
                         JARVIS / AUTOMATIONS
                       permission-bound consumers
                                    |
                     PHYSICAL WORK / PROVIDERS
```

This is a **conceptual responsibility map**, not an implemented system diagram, new domain-state machine, approved business offer, or readiness assertion. The previous `TS-A`, `TS-B`, `TS-C` identifiers retain their draft meanings for continuity; new `TS-D` denotes curated-design real-product validation and does not inherit D4 operational approval.

### 2.2 TeeStock primary business: curated design and collections — `TS-B`

**Owner-selected business identity (2026-10-20):** TeeStock is a **curated design apparel brand**. Design selection, coherence, creative direction, collection identity, product/fit/material quality, editorial story and retail relationships are the main business value proposition. TeeStock is **not** primarily a made-to-order logo printing shop, B2B garment procurement service, blank-apparel reseller or generic print-on-demand listing engine. Collaboration/original artwork may be evaluated within this identity, but no particular source, license, revenue share, exclusivity or creator marketplace is assumed authorized.

**Portfolio responsibility:** TeeStock owns curation, merchandising, product identity, retail customer proposition, assortment selection, product-specific customer expectation and applicable apparel business policy. MultiGraph owns the strategic commercial-printing solutions lane; MGBOS owns governed shared transaction representations.

**Target customer job:** discover apparel artwork and collections with a recognizable point of view; understand what is offered, fit and quality; obtain honest availability and pricing; confidently buy an eligible curated garment; receive accurate fulfillment and support.

**Customer-facing journey (nontransactional until separately authorized):**

```text
collection/design discovery -> understand design & garment attributes
 -> compare eligible pieces / sizes / fit / quality / price if verified
 -> express genuine interest or use an approved safe sales route
 -> understand clear availability, terms and next steps
```

**Relevant existing authority:** `DEC-TS-2026-011` (`ACTIVE`) supports retail-first presentation. `CX-09` proposed `CX-S0` design is `DRAFT` (not a release permission). The new owner instruction broadens identity from "retail-first UI" to **curated-design-first product and business priority**; this needs a versioned TeeStock-business canonical decision update.

**Curated-design validation prerequisites:** art provenance and rights, truthful product imagery/claims, review of actual design originality/selection process, practical production sample and garment quality, size/spec consistency, supplier route, price/cost and returns policy. No invented scarcity, stock, revenue, supplier quality or creator agreement.

**Non-goals:** making Custom/Business the dominant hero, conversion objective or catalog taxonomy; treating curation as arbitrary print graphics without an identity; full creator marketplace before demand; or nonfunctional checkout CTA. **Existing `DEC-TS-2026-011` accessibility/discoverability requirements for Custom/Business remain in force until explicitly reconciled**, even though those services are not the flagship offering.

### 2.3 TeeStock primary operating hypothesis: curated-product validation — `TS-D`

**Classification:** `OWNER_SELECTED_DIRECTION` (business focus), `PROPOSED` (validation method), `BLOCKED_BY_GATE` for live money/production actions.

**Purpose:** prove TeeStock's **curated designs** attract real buyers and can be fulfilled with acceptable quality, founder workload and unit economics. A retail catalog must not be treated as evidence of commercial demand merely because it is attractive.

**Possible bounded validation design (not an approved implementation):**

```text
curated collection candidate + documented design-rights/production feasibility
 -> approved small assortment and truthful purchase terms
 -> genuine in-scope customer interest / request
 -> manual/assisted retail purchase only if commercially and technically authorized
 -> governed Order/Payment/Production/QC/Fulfillment/Cost-Margin path
 -> actual customer fit/quality feedback, returns/rework and founder time
 -> evidence-led keep / iterate / stop collection decision
```

An assisted **curated-product sale** is different from a **custom logo-printing quote**: the buyer chooses an existing curated garment/design rather than commissioning a client-owned design. The exact supported MGBOS command path must be verified before transactions; no unapproved workaround through D4's custom order flow is acceptable. The size of the cohort, collection, SKUs, creator terms, pricing, inventory commitments and launch authorization remain undecided and require business-policy adoption.

This track may run market/visual/design learning before retail checkout. It does not automatically satisfy the existing D4 Business/Custom operating-pilot cohort or inherit its three-real-transaction requirement.

### 2.4 TeeStock curated retail self-service — `TS-C`

**Classification:** `PROPOSED / FUTURE_GATED`. The retail checkout path is a medium-term target for eligible curated garments, not a custom-pricing wizard.

**Relevant design input:** `CX-09` proposed `CX-S1`, currently `DRAFT`, plus applicable product/commerce, privacy, payment and independent QA contracts once adopted.

**Potential customer path:** approved curated design collection -> eligible apparel SKU/size/color -> verified availability/price -> safe cart/checkout/payment -> authorized Order -> production or pick/pack -> verified QC/fulfillment -> support/return as needed.

**Separate gate domains:** rights and sellable design/asset, publication approval, SKU/variant truth, available-to-sell/inventory or made-to-order promise, price and tax/shipping display, payment-provider outcome/idempotency/reconciliation, order/fulfillment reliability, returns, complaints, privacy, security, founder capacity and accessible/premium UX. Passing retail display acceptance `TS-B` does not authorize `TS-C`.

### 2.5 TeeStock existing D4/Business/Custom operational validation — `TS-A`

**Existing governing sources:** `DEC-TS-2026-009`, `bisnis/teestock/14-roadmap/current-quarter.md`, `docs/roadmaps/solo-founder-launch-roadmap.md`, `systems/mgbos/docs/product/teestock-operational-pilot-plan.md` (`ACTIVE` at pinned snapshot).

**What it actually proves:** whether existing MGBOS can execute a valid assisted Business/Custom quote-to-fulfillment spine and help the founder; it does **not** prove TeeStock's curated design collection appeal, retail conversion, merchandising thesis, rights readiness or repeat retail demand.

**Existing D4 cohort — unchanged pending formal reconciliation:** minimum **three real transactions**, minimum **two end-to-end completed**, one additional materially progressed, at least one external vendor-backed job, subject to real customer, commercial commitment, real payment, physical execution and existing safety/operating gates. The cohort is a requirement of existing D4 if that program is executed, **not** a TeeStock curated-design validation quota. Existing D4 documentation and launch roadmap are not silently waived or superseded here.

**Strategic treatment:** This is a **separately governed, supporting operating-validation workstream**, not TeeStock's core brand, strategic customer proposition or default revenue focus. The Owner has changed the intended brand/product priority; the business decision register, Q4 roadmap, D4 plan and upstream launch sequencing require an explicit, authority-correct owner-approved reconciliation before this strategy can be claimed as fully canonical. Pending that, do not use old primary-project labels to rewrite the latest owner intent and do not deploy an alternative new pilot bypassing gates.

### 2.6 MultiGraph supporting-arm work — `MG-A`

**Existing source:** `bisnis/multigraph/README.md` (supporting-arm role at pinned snapshot).

**Current documented role:** MultiGraph supplies or plans printing/packaging collateral for TeeStock and uses internal work as production/cost/quality learning. Estimates of savings or costs in old business models must not be treated as audited actual results.

**Measurement:** materials, vendor/in-house process, proof/preflight, quality, lead time, founder touch-time and documented actual attributable cost. Internal activity is not evidence of independently acquired print customers or new consolidated revenue. Any intra-portfolio transfer or charge must use approved legal/accounting policy.

### 2.7 MultiGraph bounded external printing/quotation pilot — `MG-B`

**Classification:** `OWNER_SELECTED_DIRECTION` for dual business learning; exact external offer and transaction authority `PROPOSED / BLOCKED_BY_GATE`.

**Customer job:** receive a defensible and versioned quote for a printing requirement and accurate real-world production, QC and delivery. Examples for scope research: print collateral, stickers, hangtags or tightly constrained print services; neither product catalog nor offer/price is approved here.

**Potential customer path:**

```text
print inquiry -> structured specifications and feasibility
 -> actual vendor/material/production cost review
 -> versioned quote, terms and customer acceptance
 -> governed order and payment obligation
 -> executable job, artwork/proof and QC
 -> dispatch/delivery and attributable cost/margin evidence
```

**Commercial control:** service eligibility, quote validity, proof and IP rights, vendor route, material/quantity tolerances, payment/deposit terms, taxes, cancellation/refund/reprint, realistic promised lead time and capacity all require approval under MultiGraph business ownership. No direct AI pricing promise or duplicate MGBOS ledger is authorized.

**Proposed validation:** maintain actual customer need/quote/acceptance evidence distinctly from TeeStock curated collection demand. Do not invent outcomes, force fake orders, or conflate print-service B2B learning with TeeStock design retail growth.

---

## 3. The shared core and the non-shared contracts

### 3.1 Shared **capabilities**, not identical workflows

| Area | Shared MGBOS responsibility / target | TeeStock CURATED-DESIGN brand surface | MultiGraph PRINT-SERVICE surface | Semantic owner / restrictions |
| --- | --- | --- | --- | --- |
| Brand and assortment | No cross-brand creative-policy ownership assumed | Curated artwork/design selection, collection identity, garment quality, SKU/fit/color and approved product claims | Print service menu, substrate, finishing and production capability | Respective business policies; MGBOS does **not** choose brand creative direction |
| Organization and actors | Identity, permission and organization/brand isolation | TeeStock approved operators, shoppers, design/artwork contributors where legally qualified | MultiGraph authorized staff and external commercial buyers | Canonical MGBOS identity and business/legal policy; legal mapping unresolved |
| Customer and demand | Attributable customer/lead representation under valid scoped access | Curated collection interest, eligible product buyer; separate D4 custom lead only if retained | Print buyers, specifications, business quote leads | MGBOS CRM; per-business demand vocabulary |
| Artwork, rights and product data | Stable references/snapshots and appropriate provenance subject to approved domain contracts | Preselected curated design, collection/SKU/variant, rights/licensing, fit/material, image and availability integrity | Customer-supplied artwork, print preflight, proofs, dimensions, finishing requirements | TeeStock/MultiGraph commercial-IP policy; canonical data/requirement contract-fit |
| Pricing and quotations | Versioned quotes and applicable governed calculation/approval under current contract | Retail price-book/eligible SKU where approved; **not every curated SKU requires a customer-specific quote**; custom price rules only in secondary D4 lane | Specific project estimate and accepted versioned quotation | Business pricing owners + MGBOS quote and financial invariants |
| Order | Authorized commercial commitment; independent payment/production/QC/fulfillment lifecycle | Curated product order from eligible approved offer; exact command path to be proven; D4 assisted order separate | Order follows accepted print specification/quote | MGBOS Order and transactional rules |
| Payment/invoice | Reconciled payment, idempotency, audit and legitimate refund/receivable model | Retail payment, partial fulfillment, returns and after-sales policies where approved | Deposits, invoice/credit, collection and dispute terms | Finance policy + MGBOS transactional controls |
| Production/vendor | Job, assignment, work-order artifact and vendor factual evidence where contract permits | Curated design licensed/approved sample, garment decoration, size and QC, supplier route | Printing material, press/finishing, preflight/proof and vendor scheduling | MGBOS operational domain + each business's SOP |
| QC | Verifiable QC result independent of UI optimistic status | Print alignment, garment defects, size/fit and approved art/label | Color/proof, material, trimming, finishing and quantity | MGBOS QC + business quality SOP |
| Fulfillment | Physical shipment/hand-over and exception records | Apparel packing, delivery, size/return support | Finished print hand-over/delivery | MGBOS fulfillment + business terms |
| Cost/margin | Source-backed cost evidence and governed margin projections | Artwork/license royalty where applicable, garment, print, packaging, fulfillment/return/rework | Material, finishing, makeready, waste, production and delivery | Canonical financial contracts + actual business costs |
| Founder Control | Real exceptions and scoped attention/read models | Curated sellability, stock, quality, returns, drop readiness; D4 exceptions segregated | Proof/quote disputes, vendor failures, print rework | MGBOS Founder Control contracts |
| JARVIS and automation | Controlled tools, approvals, provenance and fail-safe operation | Assortment/customer research and content **assistance**, never invented art-rights or availability facts | Specification/quotation preparation **assistance**, no invented pricing promises | Root/JARVIS governance; explicit MGBOS permission and evidence |

This is **responsibility routing** and `PROPOSED` contract-fit analysis, not evidence that every SKU, royalty, catalog, direct-order command or integration already exists. `systems/mgbos/docs/architecture/domain-map-capability-ownership.md` remains authoritative for MGBOS capability ownership and maturity. The older `TS-A` D4 quote-first operating process remains distinct from primary curated SKU commerce.

### 3.2 Four separation rules

**`DP-BND-01` — Presentation versus transaction truth.** Customer websites own language, content, accessibility and interaction. They consume authorized MGBOS operations; the website response cannot independently certify paid, produced, delivered, or stock-reserved states.

**`DP-BND-02` — Business policy versus transaction invariants.** A brand owns its approved offer, price policy, proof/acceptance terms and obligations. MGBOS owns the representation, authorization, snapshot and lifecycle rules. Neither can silently replace the other.

**`DP-BND-03` — AI suggestion versus delegated command.** JARVIS and other models may help clarify, recommend or prepare within approved capability boundaries, but confidence is not permission. Deterministic guards, approvals, audit and recoverable manual operation remain necessary.

**`DP-BND-04` — Internal supply versus external sales.** TeeStock packaging from MultiGraph may be one physical flow supporting another brand; counting it as external demand and group revenue without financial authority is prohibited. Financial entity/account segregation cannot be guessed from brands.

### 3.3 Mandatory contract-fit questions before technical scoping

For each specific pilot journey, the Product Architect and Head Engineering must record exact source/document/evidence references answering:

| Check ID | Question | Fail-closed implication |
| --- | --- | --- |
| `DP-CF-01` | Who is the legal/operational party, brand, customer, scoped user and authorized operator? | No unsupported org visibility or cross-org write |
| `DP-CF-02` | How are configurable items/specifications/artwork versions linked to requirement and commercial promise? | No ambiguous or untraceable production commitment |
| `DP-CF-03` | Which approved policy and version yield the quoted/retail price, taxes/fees and payment terms? | No invented binding price or customer total |
| `DP-CF-04` | Which canonical command creates/updates a Quote or Order, and how are duplicate/retry effects prevented? | No direct DB writes or optimistic success message |
| `DP-CF-05` | Which payment states, provider unknown-outcomes, refund and reconciliation controls are actually supported? | No unsupported paid/refunded claim or retry charge |
| `DP-CF-06` | How does valid production assignment, proof acceptance, physical QC and vendor handoff work? | No unsupported production release |
| `DP-CF-07` | How are delivery readiness, shipping evidence, customer notice and recovery represented? | No false dispatch/delivery claim |
| `DP-CF-08` | How are costs, rework, fees and outstanding cash recorded without duplicate portfolio revenue? | No fabricated contribution metric |
| `DP-CF-09` | How are exceptions, failures, rollback and manual fallback handled by an accountable operator? | No unowned customer/financial obligation |
| `DP-CF-10` | What tests, environment identity, exact revision and field observations verify the actual behavior? | Do not mark capability or pilot ready |

If a canonical capability exists, **reuse it**. If it is missing or unsuitable, document the smallest contract change with its owner and affected consumers. This proposal does not pre-authorize new root entities or free-form schema shortcuts.

---

## 4. Operational envelope before demand growth

### 4.1 Founder capacity is a binding constraint

The initial operator may handle sales, supplier contact, purchasing, physical QC, packing, courier drop-off, customer recovery, cash reconciliation, and product/engineering oversight. Therefore two independent marketing funnels can exceed real capacity even if each appears small.

**Proposed constraint:** accepted demand must fit the lowest demonstrably available capacity among owner response time, vendor production, proof review, QC, packing, shipping, financial reconciliation and exception handling. Do not treat speculative supplier capacity as committed capacity.

### 4.2 Required operating-policy parameters

The following values are **unknown until set and evidenced**. Each must be set by its business/operations/finance owner before the applicable live exposure occurs:

| Parameter ID | Required choice | Current state |
| --- | --- | --- |
| `DP-CAP-01` | Founder hours available for each lane and maximum concurrent obligations | `NOT_VERIFIED` |
| `DP-CAP-02` | Accepted in-progress order/job limit and queue priority | `NOT_VERIFIED` |
| `DP-CAP-03` | Cash-at-risk: committed vendor cost, inventory/prepayment and refund exposure | `NOT_VERIFIED` |
| `DP-CAP-04` | Approved customer response expectations and escalation owner | `NOT_VERIFIED` |
| `DP-CAP-05` | Verified provider capacities, alternatives, deadlines and QC arrangements | `NOT_VERIFIED` |
| `DP-CAP-06` | Production release authority, deposit/payment eligibility and change terms | `NOT_VERIFIED` |
| `DP-CAP-07` | Incident/failure/recovery owner and customer communication route | `NOT_VERIFIED` |
| `DP-CAP-08` | Legal, brand, tax, accounts and settlement interpretation | `NOT_VERIFIED` |
| `DP-CAP-09` | Measurement method and baseline for founder touch-time | `NOT_VERIFIED` |
| `DP-CAP-10` | Supported channel/feature cohort and accessible manual fallback | `NOT_VERIFIED` |

No default numeric WIP, SLA, margin floor, deposit percentage, staffing allocation or launch date is invented here. A later accepted business policy may specify those values and should be linked by reference, not copied into competing policy documents.

### 4.3 Admission control: candidate decision algorithm

```text
for each proposed incoming customer commitment:
  verify offer and customer eligibility
  verify required specifications and accepted version
  verify current, permitted order/payment and production capabilities
  verify supplier/material route and realistic promised date
  verify founder/QC/fulfillment capacity and cash exposure
  if any hard gate fails:
      do not accept a binding commitment through that route
      offer an honest inquiry/waitlist/manual review when permitted
      record blocker, decision owner and customer-safe next step
  else:
      process through canonical authorized business commands
      preserve evidence, exception owner and customer recovery route
```

This algorithm is a **business candidate for future implementation**, not an approved executable policy or an AI authorization grant.

### 4.4 MultiGraph internal packaging handling

Internal print work used for TeeStock packaging should be measured as **physical operational work**. Any intra-portfolio charge/settlement follows approved legal/accounting policy; the strategy does not require real bank transfers between not-yet-established entities. Report the physical job cost independently from external customer acquisition and do not combine internal transfers with consolidated revenue as though both were new sales.

The historical `bisnis/multigraph/keuangan/sistem-keuangan-multiunit-cfo.md` contains useful modeling ideas, but no proposed wallet/transfer or margin threshold in it should be treated as a live accounting directive without reconciliation against current financial contracts and actual legal/account setup.

---

## 5. Priority, scheduling and dependency model

### 5.1 Source ownership of sequencing

The active `docs/roadmaps/solo-founder-launch-roadmap.md` is the **launch-stage sequencing authority**. This document only suggests cross-pilot dependencies and analytical scheduling overlays; it does not modify its Stage A–H semantics or the current Founder Control program.

TeeStock Q4's existing P0–P3 business priority levels retain their `ACTIVE` status **pending owner-approved reconciliation**. They describe historically accepted operating sequencing, not the founder's newly clarified primary curated-design brand/business direction. Priority labels below are **`DP-*` portfolio proposals**, not a unilateral amendment to P0–P3, D4 or Stage A–H authority.

### 5.2 Priority policy (`PROPOSED`)

1. **`DP-PRI-0` — Trust and integrity:** protect authorization, organization isolation, payment/Order correctness, QC/fulfillment promises, artwork rights, actual vendor capacity and real customer obligations before any public transaction or sales scale.
2. **`DP-PRI-1` — Canonical strategy/roadmap reconciliation:** make TeeStock curated-design-first explicit in the TeeStock-owned business decision register and reconcile prior `DEC-TS-2026-009`/Q4/D4/CX and the cross-system launch roadmap **without falsely erasing historical evidence or gates**. Preserve valid prior operating-spine assurance as a supporting program where still justified.
3. **`DP-PRI-2` — Primary TeeStock curated product learning:** define limited curated design collection, creative/rights/garment quality, truthful brand experience and actual customer demand hypotheses; validate physical supplier/cost/fit and eligible retail customer tasks. Market learning can proceed without unapproved public checkout or real orders.
4. **`DP-PRI-3` — MultiGraph narrow print-service learning:** validate one bounded print-service offer, requirements, quote calculation, vendor/quality economics and MGBOS contract fit, separately from TeeStock design interest.
5. **`DP-PRI-4` — Authorized transaction slices:** expand curated-design commerce and MultiGraph external quotation-to-order only after **each lane's own** approved product/financial/security/operational gates; no implicit precedence of custom quote over curated product demand.
6. **`DP-PRI-5` — Evidence-led automation/expansion:** add JARVIS, marketplace, creative tooling, advanced configurators and further services based on measured need and risk approval rather than feature abundance.

**Implementation sequencing remains governed by the existing launch roadmap until formally changed.** This proposal records that the owner has revised business priority; it does NOT claim the older `ACTIVE` sequencing has already been amended.

### 5.3 Dependency graph — proposed portfolio overlay

```text
[Owner clarification: TeeStock curated-design-first]
                      |
                      v
[TeeStock business decision + Q4/D4/launch roadmap reconciliation]
                      |
      +---------------+--------------------+
      |                                    |
      v                                    v
[TeeStock curated collection,      [MultiGraph bounded offer,
art rights, supplier/sample        print specification/vendor,
quality + retail discovery]        quote and margin feasibility]
      |                                    |
      v                                    v
[Curated-product MGBOS fit         [Print-service MGBOS fit
and distinct eligibility gates]   and distinct readiness gates]
      |                                    |
      +----------------+-------------------+
                       |
                       v
         [Shared MGBOS integrity + exact
         per-lane live operation authority]
                       |
                       v
          [Controlled, separately evidenced
              product/service pilots]
                       |
                       v
          [Founder time, cost, quality,
             customer and margin review]

Existing prior D4 Business/Custom operating-validation track:
[ACTIVE source, pilot execution GATED, cohort retained]
 -> [separate reconciliation/decision on supporting scope]
 -> [never counted as curated-design demand evidence]
```

**Interpretation:** graph edges show prerequisites, not authorization, rollout dates or proof of completeness. Existing D4 can retain independent assurance value but cannot quietly steer TeeStock's primary brand roadmap against the latest Owner direction. Source and exact integration/CI state must be checked before an implementation work item is authorized.

### 5.4 Work-in-progress management (`PROPOSED`)

- Maintain a **single cross-pilot portfolio backlog** linking each item to business lane, capability owner, source decision, risk class, affected MGBOS contracts, prerequisites, verification artifact, and current readiness.
- Shared-core code changes must pass a **single** Head Engineering integration review path; do not let two pilot implementations independently change the same contract.
- Reserve discovery capacity for both lanes, but do not impose a fixed `50/25/25` development ratio without measured effort and benefit.
- Limit concurrent integration-critical changes until regression and merge ordering are clear. Prefer finishing a safe vertical slice over partially building many unrelated features.
- Do not replace existing engineering PR/Issue governance with a parallel chat-based task system.
- Owner availability, cash, real customer obligations and high-risk remediation are first-class scheduling inputs.

### 5.5 Candidate portfolio backlog record (informational shape)

```yaml
work_item_id: DP-WI-EXAMPLE
status: PROPOSED
lane: MG-B
business_outcome_id: DP-OUT-02
capability: quotation_to_order
semantic_owner: mgbos
business_policy_owner: multigraph
upstream_decision: DP-DEC-03
required_source_revision: null
blocking_dependencies:
  - approved_multigraph_offer
  - exact_quote_contract_fit
risk_classification: PENDING_AUTHORITY
acceptance_evidence: []
operational_evidence: []
owner_approval: NOT_GRANTED
implementation_authorization: NONE
```

The shape above is **illustrative** and is not a new registry schema or a user instruction to commit an example task. Existing engineering contracts remain authoritative.

---

## 6. Pilot outcome model and evidence protocol

### 6.1 Outcomes and testable hypotheses

| Outcome ID | Desired result | Hypothesis to test | Minimum useful evidence type |
| --- | --- | --- | --- |
| `DP-OUT-01` | **TeeStock curated-design retail proposition is meaningful** | Recognizable curation/collection and reliable garment quality create customer preference beyond generic blank/custom print offers. | Documented curation criteria, legitimate rights, product/customer task tests, actual qualified demand, price/fit interest, and (if separately authorized) retail curated-product transactions |
| `DP-OUT-02` | **MultiGraph print solutions are feasible and commercially useful** | A bounded approved print offer can turn material/customer specifications into accurate governed quotes and physical results. | Approved offer, contract-fit assessment, vendor/margin evidence; authorized print jobs only if gates passed |
| `DP-OUT-03` | **TeeStock storefront expresses curated design truthfully** | Editorial collection storytelling, fit/quality clarity and trustworthy shopping steps reduce uncertainty without false inventory/payment claims. | User task observation, content rights audit, accuracy testing, inquiry/customer feedback; no fake conversion counts |
| `DP-OUT-04` | **One MGBOS core can support two different buying models** | Eligible curated product purchase does not require arbitrary customer-specific quotation; print service quotation preserves quote/version approval, both respecting same financial truth. | Evidence-grounded contract-fit and scoped acceptance tests, later real transaction examples if authorized |
| `DP-OUT-05` | **Founder workload remains bounded** | Right-sized offers, true status and controlled automation reduce manual handoffs/exception burden. | Time logs, rework/support records, physical capacity and error-recovery evidence |
| `DP-OUT-06` | **Expansion respects real contribution and cash** | Curated apparel and print work can meet quality and cost promises without unsupported volume/inventory spending. | Verified costs, item/job contribution, returns/rework, cash exposure and reconciled supplier evidence |
| `DP-OUT-07` | **Existing D4 assisted Business/Custom cohort proves only its own historical operating-spine scope** | Shared core can handle a bounded service quote-to-fulfillment path if operator-ready, without being TeeStock brand validation. | Existing D4 cohort and its own gate evidence, kept **separate** from curated-design demand |

No outcome here is proven merely by documentation. A few transactions test execution but do not establish product-market fit. Curated-design measurement needs actual collection/design denominators where possible and must not inherit the D4 business/custom pilot's minimum cohort or success label.

### 6.2 Evidence record required per transaction

For an authorized **real** transaction, capture at least the applicable fields using the existing accepted domain and assurance mechanisms:

```yaml
record_kind: pilot_observation
pilot_lane: TS-D  # curated-design validation; or separately authorized TS-A / MG-B / TS-C
observation_status: NOT_VERIFIED
customer_and_organization_scope: REDACTED_REFERENCE_ONLY
requirement_or_product_snapshot_ref: null
quote_and_acceptance_ref: null
order_ref: null
invoice_or_payment_evidence_ref: null
production_job_and_vendor_ref: null
artwork_or_proof_approval_ref: null
qc_evidence_ref: null
fulfillment_evidence_ref: null
actual_cost_and_margin_ref: null
founder_touch_time_record_ref: null
exceptions_and_recovery_ref: null
environment_identity: null
source_revision: null
evidence_review_owner: null
```

This is a proposed **evidence checklist illustration**, not permission to store personal data in Git, invent a new table, or reclassify an existing runtime event schema. Customer-identifying data, payment details, artwork and credentials must be protected under the existing policies. Redacted references can point to controlled evidence stores.

### 6.3 Measurement definitions to adopt in the proper owner docs

- **Qualified demand:** genuine, distinct, in-scope inquiry meeting approved lane criteria; quote opportunities are not equivalent to paid orders.
- **Commercial conversion:** explicitly accepted eligible quote/order divided by qualifying opportunities over a stated period; name the cohort and count cancellations separately.
- **Operational completion:** verified fulfillment and required QC/cost/payment steps under the canonical pilot contract; success cannot be inferred from an `Order` display badge.
- **Contribution:** revenue net of the specified attributable variable costs, with method, exceptions and missing costs disclosed; do not report estimated markup as cash profit.
- **Founder touch-time:** measured human minutes per order and by stage (sales, proof, vendor, procurement, QC, fulfillment, recovery), not simply elapsed system workflow time.
- **Reliability:** number of incorrect commits, lost/duplicate effects, manual recoveries, privacy incidents and missed realistic deadlines with denominators.
- **Quality and customer trust:** rejected QC, reprints/rework, complaints, refunds and promise accuracy.
- **Physical throughput:** verified completion per available operator/vendor capacity, not estimated utilization from a tool dashboard.

**Portfolio reporting:** each metric must retain its **lane**, sample size, measurement window and confidence/unknowns. Portfolio rollups are secondary and must exclude duplicate internal revenue and avoid hiding a failing lane behind aggregate averages.

### 6.4 Evidence hierarchy

1. **Business documents and approved policies:** intended scope and obligations; not proof of actual work.
2. **Code and database contracts:** implemented behavior at an exact revision; not automatically deployed or operator-accepted.
3. **CI/QA/audit:** measured verification for a named code revision, test suite and environment; not necessarily live payment or vendor truth.
4. **Operator acceptance / readiness:** verified ability to operate within stated environment and recovery constraints; scope-specific.
5. **Real customer/financial/physical evidence:** observations of actual accepted commitments and outcomes, with protected provenance.
6. **Pilot review decision:** separate acceptance of evidence and decision to continue, adjust or stop.

Do not collapse layers 1–6 into a single `PASS`.

---

## 7. Entry, exit and failure gates

### 7.1 Portfolio common entry conditions (`PROPOSED`)

`DP-GATE-COMMON` is satisfied **only when its components have approved evidence**, not when this document is accepted:

- `DP-GC-01`: applicable owner/brand/legal identity and authorized users are resolved for the transaction scope;
- `DP-GC-02`: offer and terms approved by the correct business owner;
- `DP-GC-03`: domain contract fit, current authorization and financial invariants verified on target revision/environment;
- `DP-GC-04`: practical supplier, materials, lead-time and physical operating route verified;
- `DP-GC-05`: founder, production, QC, cash-at-risk and support limits approved;
- `DP-GC-06`: privacy/credentials, backup, monitoring, incident response and recovery readiness satisfy current gates;
- `DP-GC-07`: support/returns/rework/cancellation obligations are operationally owned;
- `DP-GC-08`: separate written authorization exists for the actual target pilot/runtime action where required.

A failure in a hard gate must not be waived by marketing need or an AI judgement. Actual owners and formal gate definitions remain those of the existing risk and engineering contracts.

### 7.2 Lane-specific readiness matrix

| Lane | Design/research | Public nontransactional surface | Real transaction | Expansion |
| --- | --- | --- | --- | --- |
| **`TS-B` primary curated-design brand** | Curated artwork, collection, audience, quality, rights diligence | Retail-led premium UX only with truthful statements and its own product/QA/publication authorization | **Not in TS-B scope** | May progress to TS-D/TS-C only through independent gates |
| **`TS-D` primary curated-product validation** | Small assortment, supplier/sample/size/rights, unit economics and demand tests | Authorized safe expression of interest or clearly manual nonbinding next step | `BLOCKED_BY_GATE`: approved SKU/rights/price, MGBOS path, payment, vendor, return and capacity authorization required | Collection scale only with actual sales/quality/margin evidence |
| **`TS-C` curated retail self-service** | Cart/checkout/returns design and contract fit | Prototype only if clearly nontransactional | `BLOCKED_BY_GATE` pending product catalog, inventory, money integrity, security/privacy, operator support and CX approval | Separate evidence-based decision |
| **`TS-A` existing D4 Business/Custom** | Existing governed product/operating scope | Assisted contact under approved channels | `BLOCKED_BY_GATE` until existing D4/operational readiness gates are satisfied | Cannot stand in for curated design retail evidence |
| **`MG-A` existing supporting arm** | Internal print packaging research | Internal communications under permitted business terms | Only separately authorized internal physical/accounting activity | No inference of independent external customer acquisition |
| **`MG-B` print service** | Offer feasibility, supplier, print specification and quote research | Truthful inquiry concept as authorized | `BLOCKED_BY_GATE` pending MultiGraph charter, MGBOS fit and operating readiness | Separate print-service market and capacity evidence |

`Allowed research` never grants production access, permission to publish a fake collection, rights to artwork, binding commercial promises, or ability to spend/charge customer money. `TS-D` is a proposed strategic validation track; D4's approved three-transaction cohort remains explicitly attached only to `TS-A`.

### 7.3 Stop/pause conditions (`PROPOSED` mandatory review triggers)

Stop the **affected capability/intake**, secure existing customer obligations, and begin authorized incident response if evidence indicates:

- unauthorized organizational/customer data access, credentials exposure or material privacy incident;
- duplicate, missing or untraceable Order/Payment/Invoice effects;
- ambiguous payment-provider outcome presented as settled or duplicated charge after retry;
- production initiated without valid approved quote/specification/proof or payment condition;
- false stock, price, courier, QC, production or delivery claims;
- vendor failure that invalidates previously promised lead-time or practical capacity;
- unreconciled actual costs or unacceptable cash exposure under approved finance limits;
- loss of ability to contact/recover affected customers;
- incident response/recovery environment that cannot be established with confidence.

Pause triggers are not instructions to erase evidence, cancel valid obligations, or halt unrelated safe work. An authorized owner determines remediation, communication, resumption criteria and whether the problem is business, product, security, or engineering driven.

### 7.4 Exit conditions and allowed decisions

For each pilot lane, preserve a named cohort and report:

- accepted versus attempted transactions or user tasks;
- complete source-linked evidence and missing data;
- successful, failed and recoverable operational paths;
- founder workload, quality and supplier performance;
- cash exposure, actual variable costs and contribution where measurable;
- unresolved customer obligations and root-cause actions;
- exact product/software/environment revision and independent QA scope;
- next recommended action with rationale and owner approval status.

Allowed classifications (proposal only): `NOT_STARTED`, `IN_DISCOVERY`, `GATED`, `CONTROLLED_PILOT`, `EVIDENCE_SUFFICIENT_FOR_SCOPED_DECISION`, `INSUFFICIENT_EVIDENCE`, `PAUSED`, `STOPPED`, `EXPANSION_APPROVED`. These are **portfolio reporting labels**; do not overwrite canonical MGBOS state machines or existing readiness enums.

Possible Owner decisions: `CONTINUE_SCOPED`, `RESTRICT_INTAKE`, `REDESIGN_OFFER`, `FIX_CONTRACT_GAP`, `PAUSE`, `TERMINATE_LANE`, `AUTHORIZE_NEXT_SLICE`. A passed small pilot does not prove sustainable acquisition economics or justify autonomous execution at scale.

---

## 8. Risk register excerpt and required treatment

The following is an **initial portfolio-level qualitative assessment**, not the security risk class assigned by engineering governance.

| Risk ID | Scenario | Initial concern | Prevention / early detection | Mitigation owner |
| --- | --- | --- | --- | --- |
| `DP-RSK-01` | Founder overload from two funnels and physical jobs | Critical | Per-lane WIP/capacity limits, touch-time and obligations review | Owner / operations |
| `DP-RSK-02` | Shared core is copied or forked per brand | Critical | Canonical capability owner and change-contract fit | Head Engineering / MGBOS |
| `DP-RSK-03` | Retail UI implies unapproved price, stock, checkout | High | `CX-S0` truthfulness/interaction acceptance | TeeStock product + QA |
| `DP-RSK-04` | External print quote misstates feasibility/price/proof | Critical | Versioned approval, vendor/material validation | MultiGraph business/operations |
| `DP-RSK-05` | Real payments or organization scopes mishandled | Critical | Independent financial/security gates and authorization | MGBOS + Security/Finance |
| `DP-RSK-06` | Group/internal print charge treated as new external revenue | High | Separate internal work evidence and approved finance policy | Finance / Owner |
| `DP-RSK-07` | Customer burden grows from duplicate manual transcription | High | Verify governed intake and actual owner workflow | Product / Founder Control |
| `DP-RSK-08` | Vendor quality/delivery fails for both brands | High | Supplier validation, backup, QC, realistic promises | Operations / vendors |
| `DP-RSK-09` | Documentation conflicts after PR merge or source update | High | Exact-SHA refresh, claim-specific ownership and traceability | Documentation governance |
| `DP-RSK-10` | Premature JARVIS automation causes unauthorized action | Critical | Permission-first tool use, human approval, trace and fallback | JARVIS/MGBOS security |
| `DP-RSK-11` | Live pilot reported successful on synthetic/CI evidence | High | Separate evidence levels and cohort audit | Independent QA / Owner |
| `DP-RSK-12` | Capital consumed on broad feature build before demand | High | Small offer/cohort, reusable core, gate-based investments | Owner / Finance |
| `DP-RSK-13` | TeeStock becomes perceived primarily as B2B custom printing, diluting curated-design brand | Critical | Keep curated apparel primary in positioning, PRD, merchandising, collection and growth measures | TeeStock / Owner |
| `DP-RSK-14` | Unlicensed artwork, unverified originality or unusable creator rights enter curated assortment | Critical | Provenance, rights and usage-scope review, approved asset register and stop-sale protocol | TeeStock / IP owner |

The canonical risk-class definitions, acceptance authority, R4/R5 engineering gates and incident procedures stay in their existing owner documents. This table must not become a competing security policy.

---

## 9. Decision register and open questions

### 9.1 Decisions already taken versus to be approved

| Proposed record | Decision / needed policy | Current disposition | Owning scope |
| --- | --- | --- | --- |
| `DP-DEC-01` | Internal Business OS, not generalized external SaaS as primary target | `OWNER_SELECTED_DIRECTION` | Portfolio |
| `DP-DEC-02` | TeeStock curated-design apparel and MultiGraph printing solutions as parallel, asymmetric pilots | `OWNER_SELECTED_DIRECTION` | Portfolio |
| `DP-DEC-03` | Exact MultiGraph first external offer, ICP, quote/deposit/proof terms | `OPEN / NOT_APPROVED` | MultiGraph |
| `DP-DEC-04` | TeeStock retail checkout eligibility and scoped SKU/variant/return rules | `OPEN / NOT_APPROVED` | TeeStock, later CX-S1 |
| `DP-DEC-05` | Legal/organization/account and internal transfer mapping | `OPEN / NOT_VERIFIED` | Owner / Finance / Identity |
| `DP-DEC-06` | Capacity, WIP, cash-at-risk and customer recovery limits | `OPEN / NOT_APPROVED` | Owner / Operations / Finance |
| `DP-DEC-07` | Exact MGBOS contract adaptations required for print-specific quote path | `OPEN / CONTRACT_FIT_REQUIRED` | MGBOS architecture |
| `DP-DEC-08` | Document adoption, source-map/index updates and roadmap reconciliation | `OPEN / GOVERNANCE_ACTION_REQUIRED` | Documentation governance / Owner |
| `DP-DEC-09` | Authorization to start actual commercial pilots and any corresponding deployment | `OPEN / NO_AUTHORIZATION` | Owner + applicable technical/operational gates |
| `DP-DEC-10` | Increase AI write autonomy for commercial actions | `OPEN / NO_AUTHORIZATION` | Owner / JARVIS / security |
| `DP-DEC-11` | Amend canonical TeeStock strategy, decision register, Q4 roadmap, D4 pilot dependencies and CX mappings so curated designs are primary without erasing historical operating pilot requirements | `OWNER_DIRECTION_GIVEN; RECONCILIATION_REQUIRED` | TeeStock business / root roadmap / MGBOS product owners |

`DP-DEC-*` IDs are local tracking labels, **not** automatically new canonical ADR or TeeStock decision-register entries. Actual adopted decisions must be recorded under the relevant existing decision systems. Avoid duplicating already active `DEC-TS-*` facts in new authoritative registers.

### 9.2 Minimum structured decision prompt for future AI

When a decision is requested, prepare one concise decision package with:

```yaml
decision_key: DP-DEC-03
current_status: OPEN
scope_owner: multigraph
business_problem: null
options: []
recommended_option: null
rationale: null
tradeoffs: []
assumptions: []
required_evidence: []
conflicting_active_sources: []
impact_on_existing_roadmap: null
requires_owner_approval: true
recorded_approval_reference: null
```

The AI may recommend but must not fill `recorded_approval_reference` with a fabricated value or treat silence as acceptance.

---

## 10. Documentation relationships and next artifacts

### 10.1 Owner map (read; do not duplicate)

| Claim family | Existing semantic owner / reference |
| --- | --- |
| Cross-system/documentation authority | `docs/governance/documentation-constitution.md`, `docs/governance/canonical-source-map.md` |
| Existing strategic program and intended architecture | `docs/architecture/master-system-blueprint.md`, `docs/architecture/system-boundaries.md`, `docs/operating-model/solo-founder-operating-system.md` |
| Launch-stage dependencies and timing | `docs/roadmaps/solo-founder-launch-roadmap.md` |
| TeeStock business strategy and decisions | `bisnis/teestock/00-foundation/decision-register.md`, `bisnis/teestock/14-roadmap/current-quarter.md` |
| Existing TeeStock Business/Custom D4 operating-validation program **only** | `systems/mgbos/docs/product/teestock-operational-pilot-plan.md` |
| TeeStock customer CX/release slice *proposal* (`DRAFT`, not sequencing authority) | `systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md` |
| MultiGraph current business role | `bisnis/multigraph/README.md` |
| MGBOS domain and capability ownership | `systems/mgbos/docs/architecture/domain-map-capability-ownership.md` |
| MGBOS transaction invariants and status | `systems/mgbos/docs/architecture/business-invariants.md`, `systems/mgbos/docs/architecture/business-state-machines.md` |
| JARVIS intent and authority boundary | `systems/jarvis/docs/charter.md` |

**Note:** The TeeStock operational pilot plan is `ACTIVE`, while CX-09 is `DRAFT` at the pinned revision. CX-09 contains proposed requirement IDs and validation gates, which must not be treated as activated product or release authority. This proposal does **not** renumber either source or rewrite any active normative language.

### 10.2 Recommended follow-on artifacts, one at a time

1. **First reconcile TeeStock-owned strategy/decision and Q4/D4 source conflicts** in a bounded, versioned business decision update; only then issue final primary-product execution priorities. This dual-pilot proposal is not a license to rewrite `ACTIVE` owners.
2. `docs/strategy/internal-business-os/shared-core-capability-ownership.md` — **crosswalk only** from curated-design product demand and print-service quotation to existing MGBOS capability semantic owners, with current/proposed/evidence flags. This MUST NOT duplicate or override MGBOS Domain Map.
3. `bisnis/multigraph/01-strategy/quotation-pilot-charter.md` — proposed first external print offer/business rules, after qualified market/supplier and policy review. The preexisting business README remains current until explicit business adoption and backlink.
4. `systems/mgbos/docs/product/multigraph-quotation-pilot/prd.md` — source-linked bounded product requirements after business charter and MGBOS contract-fit discovery; no premature architecture commitments.
5. `docs/strategy/internal-business-os/roadmap-dependencies-gates.md` — dependency overlay and gate trace to the existing *ACTIVE* launch roadmap; not an alternative sequencing authority.
6. Registry/index integration only after adoption, with owner-approved routing changes and source-revision checks. Do **not** copy a whole draft ZIP as canonical in one operation.

The filenames are **proposed destinations**, not statements that such files already exist or have been activated.

### 10.3 Integration policy for old documentation

Prefer **additive, scoped documentation** before editing broad active files. If an old source must be amended, deliver the **entire exact replacement file** after reviewing its current HEAD and all affected incoming references. Do not replace an `ACTIVE` document with an abbreviated summary or change its `canonical_id`, authority, lifecycle or version semantics silently.

In particular, do **not** overwrite `bisnis/multigraph/README.md` just to mark the new external pilot active; its current supporting role and provenance remain valid until an explicit recorded business-policy expansion. Do **not** silently discard TeeStock decisions 009/011: add an owner-approved, traceable business decision or revision for curated-design-first positioning and explicitly reconcile affected Q4/D4/roadmap/CX owners. Do **not** modify MGBOS financial or permission rules in a strategy document.

---

## 11. Acceptance checklist for document adoption

This document is adopted as `ACTIVE` by Owner decision on 2026-10-20:

- [x] `DP-QA-01`: YAML frontmatter conforms to root documentation constitution; statuses and authority boundaries are readable by a fresh AI.
- [x] `DP-QA-02`: Existing upstream source references resolve at the recorded Git baseline; Strategic Anchor path is present in the target repository state.
- [x] `DP-QA-03`: New owner clarification (curated-design-first TeeStock) and existing `DEC-TS-2026-009`/`011` are clearly distinguished, with a **declared unresolved canonical reconciliation**, not falsely claimed to be simultaneously the same priority.
- [x] `DP-QA-04`: Current TeeStock D4 cohort values are accurate and **not** mistaken for primary curated-design validation or a MultiGraph cohort.
- [x] `DP-QA-05`: MultiGraph supporting-arm reality and proposed external offer are explicitly separated.
- [x] `DP-QA-06`: Portfolio priority overlay does not claim authority over active Stage D/roadmap transitions.
- [x] `DP-QA-07`: Business, MGBOS, website, JARVIS, automation, physical provider and finance claims have distinct semantic owners.
- [x] `DP-QA-08`: No default legal/tax/entity, capacity, deposit, margin, vendor or readiness facts are invented.
- [x] `DP-QA-09`: The proposed gate model requires actual evidence and explicit owner authorization for consequential actions.
- [x] `DP-QA-10`: Decision trace, risk treatment, independent QA boundaries and follow-on artifact destinations are self-consistent.
- [x] `DP-QA-11`: Latest main/PR/source drift is reconciled when activating; canonical source-map and index updates occur through the owning governance mechanism.

Owner adoption confirms this document as the active dual-pilot operating strategy. Implementation and transaction execution remain gated.

---

## 12. AI continuation instructions

A new AI entering this program SHOULD:

1. Retrieve `docs/governance/documentation-constitution.md` and `docs/governance/canonical-source-map.md` to resolve authority.
2. Inspect the latest current Git revision, relevant open PRs, active TeeStock decisions, current launch roadmap and operational-readiness registry; do not assume the pinned snapshot is live.
3. Read `docs/strategy/internal-business-os/strategic-anchor.md` and this document as `REVIEW` proposals until adoption is recorded.
4. Read latest owner clarification (2026-10-20): **TeeStock primarily curated design apparel**. Treat `DEC-TS-2026-009`/`011`, D4 and CX-09 as contextual active/draft sources with a **material reconciliation task**, not permission to rewrite TeeStock as mainly Business/Custom. Keep D4 assurance separate from curated-product demand and checkout eligibility.
5. Read MultiGraph's existing business README and other accepted business policy before proposing external print offers.
6. For each requested change, resolve **business policy owner**, **MGBOS semantic owner**, **customer experience owner**, and **evidence authority** separately.
7. Recommend one bounded artifact/work package at a time; preserve existing gates and decision provenance.
8. Separate `DRAFT`, `REVIEW`, `ACTIVE`, code-merged, CI-tested, operator-ready and real-transaction-proven states.
9. Never claim a real order, payment, production, customer, supplier contract, operational readiness or approval without source evidence.
10. If an apparent contradiction remains, report the exact claim, competing authority paths, scope and required owner decision; do not solve it by guesswork.

**Next logical work item:** resolve TeeStock-owned canonical strategic/quarterly priority conflicts and confirm how the prior D4 program is retained, revised, or superseded through the correct authority. Only then prepare the shared-core capability crosswalk (curated-product-first versus print-quotation-first) and any launch-specific PRD.

**End of document.**
