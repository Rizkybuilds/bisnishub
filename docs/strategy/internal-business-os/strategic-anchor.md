---
canonical_id: bisnishub.strategy.internal-business-os.anchor
status: ACTIVE
version: 1.0.0
owner: Rizky
author: ChatGPT / AI Co-Founder & Strategic Product Architect
approver: Rizky
scope: cross-business-portfolio-strategy
document_class: canonical-strategy
effective_from: 2026-10-20
normative_authority: CANONICAL_PORTFOLIO_STRATEGY
authoritative_for:
  - Internal Business OS portfolio intent and strategic boundaries
  - Dual-pilot strategic rationale and strategic success hypotheses
  - Portfolio-level product direction, excluding implementation sequencing authority
source_main_sha: 8c7731a13867f38b391ea2f38e9ae7b1f0a7e540
source_observed_at_utc: 2026-10-20T03:13:31Z
last_reviewed: 2026-10-20
owner_direction_recorded_on: 2026-10-20
teestock_primary_business: CURATED_DESIGN_APPAREL
teestock_business_custom_role: SECONDARY_OR_SEPARATELY_GOVERNED_OPERATING_VALIDATION
teestock_strategy_reconciliation:
  status: REQUIRED_NOT_COMPLETED
  conflicting_existing_operational_priority: DEC-TS-2026-009
  existing_retail_presentation_decision: DEC-TS-2026-011
  no_automatic_supersession: true
revision_reason: "Owner clarification: TeeStock curated-design apparel is primary, Business/Custom is not primary business positioning"
review_cadence: quarterly
review_independence: OWNER_ADOPTED
content_readiness: ACTIVE
implementation_authorization: NONE
merge_authorization: NONE
deployment_authorization: NONE
supersedes: null
dependency_path_base: repository-root
depends_on:
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
  - systems/jarvis/docs/charter.md
---

# BisnisHub Internal Business OS — Strategic Anchor

## 0. Document contract and AI reading instructions

**Identity:** `bisnishub.strategy.internal-business-os.anchor`.

**Repository target:** `docs/strategy/internal-business-os/strategic-anchor.md`.

**Document function:** This is a self-contained, cross-portfolio *strategic anchor* for a future Internal Business Operating System serving MultiGraph Group, with **TeeStock as a curated-design apparel brand** and MultiGraph as printing/production solutions, operating as parallel, asymmetric pilot businesses. It explains *why*, *for whom*, *what outcomes*, *what must remain separate*, and *which strategic boundaries* govern subsequent planning. It is **not** the domain model, business pricing policy, launch approval, product requirements specification, software architecture, or release plan.

**Lifecycle:** `ACTIVE` reflects Owner adoption of cross-portfolio strategic intent and boundaries. The Owner has explicitly adopted and activated this strategic anchor; however, it does not by itself grant live transactional deployment authority or supersede active operational readiness gates, which remain independently governed.

**Mandatory interpretation for AI readers:**

1. Read the frontmatter before the body. Do not infer authority from document length or confidence of prose.
2. Resolve claim-specific authority using `docs/governance/documentation-constitution.md` and `docs/governance/canonical-source-map.md`.
3. Treat `ACCEPTED_DIRECTION` as owner-selected strategic intent; treat `PROPOSAL` as pending formal adoption; treat `CURRENT_SOURCE` as reported by the pinned Git source; treat `NOT_VERIFIED` as unknown operational reality.
4. Do not interpret a proposed gate as a passed gate, a drafted PRD as an implemented capability, or a merged commit as customer/production acceptance.
5. On source drift, identify the changed upstream source and reconcile; do not silently rewrite this document or override its dependencies.
6. Never use this document by itself to authorize code changes, financial actions, merge, deployment, provider credentials, or customer commitments.

## 1. Strategic identity and North Star

**BOS-INTENT-01 — ACCEPTED_DIRECTION:** BisnisHub is intended to be an **Internal Business Operating System** for the MultiGraph Group business portfolio, not a horizontal SaaS product for unrelated tenants.

**BOS-INTENT-02 — ACCEPTED_DIRECTION:** TeeStock and MultiGraph will be two *parallel business pilots* that share an operational foundation while preserving their different commercial journeys.

**BOS-INTENT-04 — OWNER_CLARIFICATION (2026-10-20):** The PRIMARY identity, product value proposition and growth focus of **TeeStock is curated design apparel**. It MUST NOT be represented as primarily a custom printing/B2B garment services business. Business/Custom paths are optional secondary services and/or a separately governed existing operating validation track, not TeeStock brand primacy. This is a new owner-level business direction requiring explicit reconciliation with older ACTIVE Q4 operating-priority sources; it does not grant commercial deployment authority.

**BOS-INTENT-03 — PROPOSAL:** Parallel means concurrent *learning, planning, offer validation, and selected scoped execution*, not simultaneous unrestricted launch of both complete websites or every possible product category.

**North Star:** Make it feasible for a resource-constrained founder to operate multiple commercial business lines reliably, with fewer unnecessary manual handoffs, better visibility of cash/margin/capacity, and explicit human control of consequential decisions.

**Value test:** A real customer need becomes an accurate commercial commitment, an executable production job, verified quality, completed fulfillment, and reconciled cost/margin—with founder handling time and exceptional decisions visible. A beautiful website, many agents, high CI pass counts, and long documentation are **inputs**, not proof of that outcome.

### 1.1 Terminology and naming boundaries

| Term | Meaning in this program | Is not |
| --- | --- | --- |
| **BisnisHub** | Umbrella repository, systems program, and integration context | An independently proven revenue-generating SaaS |
| **MultiGraph Group** | Intended multi-business portfolio umbrella | A verified legal holding structure, tax entity, or intercompany contract |
| **MultiGraph** | Commercial printing/print-service business lane | Synonym for the portfolio umbrella or MGBOS |
| **TeeStock** | Curated-design-led apparel brand: selected artworks, collections, fit/quality and retail customer experience; Custom/Business are optional secondary service paths | The only intended MGBOS consumer |
| **MGBOS** | Shared authoritative operational business core | A replacement for distinct brands' commercial strategies or physical truth |
| **JARVIS** | Planned governed intelligence, coordination, and owner-support system | A second ERP, transaction ledger, permission authority, or assumed live agent fleet |
| **Customer platform** | Brand-specific public or assisted customer experience | Source of truth for payment, stock, production completion, or margin |
| **Pilot** | Bounded test with explicit authority, operational capacity, evidence, and rollback | Permission for public launch, autonomous transactions, or scale |

The actual legal-company, account, tax, organizational-unit, and contractual mapping remains **NOT_VERIFIED**. It MUST be decided through the appropriate owner/business policies before implementation assumes distinct legal entities or combines financial flows.

## 2. Constraints that shape the product

The strategy must respect the following facts and design constraints:

- **Founder capacity:** The initial operator may concurrently handle procurement, vendor communication, physical logistics, customer follow-up, and exception resolution. Software must not quietly increase commitments beyond manageable capacity.
- **Capital discipline:** Use a practical, asset-light approach where appropriate; large inventory, machine purchase, headcount, and advanced integration require separate economics and capacity evidence.
- **Business truth first:** MGBOS domain invariants, authorization, state transitions, and actual cost records take precedence over convenient interface shortcuts.
- **Graceful degradation:** Critical operations must have an auditable manual path when AI models, automation, messaging, marketplace APIs, or other providers fail.
- **No fabricated certainty:** Estimated production capacity, supplier reliability, customer demand, gross margin, and automation savings remain hypotheses until evidenced.
- **Selective complexity:** Prefer existing canonical capabilities and simple extensions over new entities, duplicate accounting, or premature microservices. The implementation architecture itself is owned by canonical MGBOS and cross-system architecture sources.

These constraints are portfolio product requirements in principle. They are not new SQL constraints, permission grants, financial thresholds, or exact runtime rules.

## 3. Two pilots with asymmetric demand journeys

### 3.1 TeeStock — curated-design-led apparel, with separate maturity gates

**Primary founder-selected business identity — OWNER_CLARIFICATION (2026-10-20):** TeeStock is a **curated design apparel brand**. Its main promise is discerning selection of designs, creative direction, recognizable collections, apparel quality, and a considered end-to-end retail brand experience. It is **not** primarily a custom-printing/B2B services business, a generic blank-garment reseller, or an undifferentiated print-on-demand catalog. Curated design means a coherent selection and editorial/commercial treatment of artworks and collections; it does not, by itself, assume ownership of every artwork, a particular creator revenue-sharing model, licensed rights, artificial scarcity, or a verified supplier.

**Primary strategic product direction:** build a differentiated TeeStock assortment and collections; test actual audience appeal, willingness to buy, repeat purchase and sustainable fulfillment; design the storefront around the collection, story, material/fit/quality and trustworthy shopping. Any designer, artwork, licensing, collaboration and usage rights MUST be verified under appropriate business/IP policy before commercialization; do not treat AI-generated or third-party imagery as automatically cleared.

**Existing-source tension — NEEDS_EXPLICIT_RECONCILIATION:**

- `DEC-TS-2026-011` (`ACTIVE`) already requires retail-led public presentation; this new owner clarification makes curated design the **core brand and commercial priority**, not only website decoration.
- `DEC-TS-2026-009`, the Q4 TeeStock plan, the solo-founder launch roadmap and existing D4 pilot (`ACTIVE`) prioritize **Business/Custom assisted-sales** as an earlier *operating-spine validation strategy*. Those sources retain their documented authority and historical requirements until specifically amended/superseded by their rightful owner. They are **not** evidence that the founder wants Business/Custom as TeeStock's long-term principal business model.
- A future accepted reconciliation may retain bounded D4 operational assurance for MGBOS as a supporting technical/business validation while redirecting TeeStock's primary brand/product roadmap to curated design. No existing D4 cohort is silently waived, replaced or counted as validation of curated collections.

**TeeStock capability tracks (conceptual; do not infer release authorization):**

- **TS-LANE-B — PRIMARY BRAND / DISCOVERY:** Design curation, assortment and collection selection, creative/product storytelling, truthful retail-led public presentation and demand research. Its brand/product priority is high; any public release still needs relevant approval, content rights and quality controls.
- **TS-LANE-D — PRIMARY CURATED PRODUCT VALIDATION / GATED:** Evidence-driven, bounded commercial validation of curated-design apparel (for example eligible manual/assisted fulfillment before a self-service checkout exists). The exact pricing, licensing, SKU/variant, supplier, returns, payment and fulfillment rules require their own adopted business policy, system contract-fit and live-transaction approval. Do not claim this pathway is already supported or approved by MGBOS.
- **TS-LANE-C — TARGET CURATED RETAIL SELF-SERVICE / GATED:** Catalog-to-order buying for approved curated-design SKUs/variants with truthful stock/availability, price, payment, fulfillment and after-sales controls. Advanced customization is not a prerequisite for the curated brand.
- **TS-LANE-A — EXISTING SUPPORTING OPERATING-VALIDATION TRACK / GATED:** Business/Custom inquiries and quotations under existing `ACTIVE` D4/operational sources, retained as a separately governed optional/supporting lane until explicit roadmap and business-decision reconciliation. It MUST NOT be represented as the core TeeStock positioning, curated-product commercial validation, or primary future growth KPI.

**Forbidden shortcut:** Do not force each eligible curated retail purchase through a manual quotation solely because the existing D4 technical pilot does that. Do not claim that a curated-design commercial order can safely bypass established MGBOS Order/Payment authorization and integrity requirements, nor that a public checkout exists. Avoid imposing custom artwork/proof workflows on ordinary fixed curated SKUs when no customer alteration is requested.

### 3.2 MultiGraph — quotation-first printing and packaging

**Existing business source:** `bisnis/multigraph/README.md` currently positions MultiGraph as a **supporting arm for TeeStock packaging** and B2B printing research. This anchor does **not** silently override that status.

**ACCEPTED_DIRECTION:** MultiGraph is additionally designated as a parallel pilot for learning about printing services and specification-led customer demand.

**PROPOSAL pending business-policy adoption:** Choose one bounded service family and a qualified customer cohort; validate real customer requirements, production feasibility, supplier costs, quotation, proof/approval, and fulfillment through governed MGBOS transactions. The exact offer, pricing/deposit policy, proof terms, claims, and external sales eligibility are not yet approved here.

**Intended journey:** Inquiry → structured requirement → feasibility/cost review → versioned quotation → customer acceptance → authorized order and payment terms → production/vendor execution → QC → fulfillment → cost/margin reconciliation. The actual state/command behavior must follow canonical MGBOS documents.

**Forbidden shortcut:** A customer-facing price, delivery date, proof, or production status cannot be invented by AI or inferred from a visually completed workflow. The supporting-arm use case and external-revenue pilot outcomes must be reported separately.

### 3.3 The meaning of parallel execution

The lanes may conduct discovery, vendor research, content preparation, requirement mapping, and controlled experiments simultaneously. They do **not** automatically share readiness approval: each lane has its own commercial policies, operational prerequisites, incident response, and evidence. Neither a failure nor a success of one pilot is hidden by aggregate reporting across both.

Where an MGBOS change affects shared domain contracts, it requires a single governed implementation path with integration and regression review. Scheduling, work-in-progress limits, pilot volumes, financial exposure ceilings, and owner availability are **NOT_VERIFIED** until measured and agreed.

## 4. One shared core, specialized customer/business policies

### 4.1 Boundary contract

- **Business domain owners (TeeStock, MultiGraph):** own offer, brand, merchandising, customer proposition, commercial eligibility, policy, pricing strategy, discount philosophy, production commitments, and relevant business economics.
- **MGBOS:** owns canonical customer and business transaction representations; valid commands, permissions, commitments, independent lifecycle states, audit evidence, accounting-relevant records, and operational projections within its existing accepted architecture.
- **Customer platforms:** own presentation, input capture, UX, and appropriate interaction workflows; they consume governed business commands and projections rather than becoming a separate ledger.
- **JARVIS:** may observe, summarize, prepare, prioritize, and coordinate within explicit capability permissions. It does not own or bypass MGBOS truth or commercial authority.
- **Automation / n8n:** executes eligible deterministic workflows and external side effects under governed commands and deduplication, not authoritative business-state changes by direct database mutations.
- **Physical actors/providers:** supply independent evidence of stock, production, QC, shipment, delivered work, and provider commitments; software progress alone is not proof of physical completion.

**Cross-business reuse is by capability, not by assumption of one universal workflow.** Shared customer identity, order, money, vendor, and production semantics must honor organization/brand scoping, business policy, evidence provenance, and legal mapping where applicable. A shared founder or supplier does not implicitly grant cross-organization data access.

### 4.2 Minimum capability alignment questions

Before authorizing a customer-facing transactional slice, engineering and product work must establish answers, with source references and tests, for the relevant subset of:

1. Who is the customer, organization/brand owner, and permitted actor?
2. What are the accepted product/service specification, variant, artwork, proof, and revisions?
3. Which pricing authority and approved version support the commercial promise?
4. What transition creates an actual order and under what authorization?
5. What constitutes recorded payment, refund, invoice, liability, and cost?
6. Which actor/vendor owns production work and how is physical progress verified?
7. How are QC, shipment, partial fulfillment, cancellation, failure, and retry represented independently?
8. How does the founder see exceptions, deadlines, exposure, and true contribution margin?
9. What recovery path exists when a provider, agent, workflow, or operator fails?
10. Which current code, database, CI, and operational evidence demonstrate these answers?

The questions are *alignment checks*, not an instruction to create ten new root entities. Canonical MGBOS domain sources decide whether a representation already exists or a bounded change is necessary.

## 5. Strategic outcomes and measurement model

| Stable ID | Strategic outcome | Preliminary evidence to seek | Current measurement status |
| --- | --- | --- | --- |
| `BOS-OBJ-01` | Trustworthy business commitment and execution facts | Linked requirement/quote/order/payment/production/QC/fulfillment/cost evidence for scoped transactions | `NOT_VERIFIED` for dual-pilot field operations |
| `BOS-OBJ-02` | Both commerce-led and quotation-led demand can use one governed core without a duplicate ledger | Verified cross-lane acceptance tests and bounded live examples for distinct intake patterns | `NOT_VERIFIED` as dual-pilot integrated outcome |
| `BOS-OBJ-03` | Less founder coordination burden without degraded quality or control | Measured founder touch-time, rework/clarifications, handoffs, exceptions, and transaction quality | `BASELINE_NOT_SET` |
| `BOS-OBJ-04` | TeeStock validates appeal and economics of curated-design apparel as its PRIMARY proposition | Documented collection/design selection, attributable product demand, actual eligible curated sales/returns, design rights, verified product quality and contribution after costs | `NOT_VERIFIED`; existing assisted Business/Custom cohort does not establish it |

Candidate measures must be calculated separately for TeeStock and MultiGraph before a combined portfolio view:

- TeeStock **curated collection/design** interest, product-level conversion (only where denominator is actually measurable), qualified demand, first/repeat purchase, return reasons, stock/availability accuracy and attributable design/production economics; do not substitute Business/Custom quote counts for curated apparel demand.
- MultiGraph print-service inquiry quality, eligible quote acceptance, job completion, cancellation, refund and rework.
- Net contribution per completed order, with explicit treatment of vendor cost, shipping, payment fees, reject/reprint, discounts, and any known variable costs; do not confuse gross sales with owner-available cash.
- Founder touch-time per completed order and number of material interventions.
- On-time fulfillment within an *honestly promised* time window.
- Quality outcome, complaint/remediation frequency, and supplier performance with real sample sizes.
- Automation completion correctness, retries, human escalation and recovery failures.

**No numerical success threshold is fixed in this anchor.** Any initial 3–5 orders may serve as a technical/operational smoke test only, not as statistically valid product-market-fit evidence. Baselines, measurement definitions, sample sizes, operating limits, and release thresholds require a subsequent controlled protocol.

## 6. Strategic sequencing and dependency rules

This document proposes priority themes but **does not supersede** the `ACTIVE` source `docs/roadmaps/solo-founder-launch-roadmap.md`, which owns current launch-stage sequencing. Before any approved roadmap change, conduct explicit reconciliation against its stages and active candidates.

1. **Source and authority reconciliation:** establish exact Git revision, active documentation, pending PR conflicts, and current operational-readiness evidence.
2. **Offer and operating-envelope validation:** define TeeStock *curated designs/collections* and MultiGraph print-service scope separately, including artwork rights, supplier commitments, commercial rules, founder capacity and legal/account boundaries.
3. **Shared safety and operational readiness:** verify the existing MGBOS spine and resolve specific cross-lane acceptance gaps; do not reimplement accepted domain semantics by default.
4. **Curated-design demand and fulfillment validation:** prioritize one bounded TeeStock curated collection/design experiment with verifiable customer interest, honest offer terms, rights and supplier feasibility; actual money/order/fulfillment only after distinct operating gates. Existing D4 Business/Custom testing remains a separately governed operating-spine track, not proxy evidence for curated brand success.
5. **Curated retail transaction activation:** enable eligible curated product purchase (manual/assisted or self-service as explicitly approved) only when its exact product, SKU, rights, availability, price, payment, returns, fulfillment and support gates are independently satisfied; the live self-service slice requires additional UI/payment/recovery assurance.
6. **Measured deterministic automation:** automate repeatable, rule-bound bottlenecks only after manual truth, idempotency, authorization, recovery and measurable value are demonstrated.
7. **JARVIS Lite followed by selective expansion:** begin with source-linked read-only owner briefing where reliable projections and permissions exist; promote write autonomy only capability-by-capability through existing approval and evidence governance.

These are dependency themes, not a mandatory fixed calendar, a claim that each phase is unfinished, or a launch authorization. Independent work may proceed in parallel only where actual dependencies permit it.

## 7. Non-goals and prohibited interpretations

This program intentionally does **not** require:

- Selling BisnisHub as SaaS or supporting arbitrary external business tenants.
- Building an unrelated general-purpose ERP, a second financial ledger, or a new universal customer database.
- Fully automated production, immediate owned factories, enterprise WMS, or unlimited apparel inventory.
- A full autonomous agent organization before transactions and permissions are proven.
- Universal marketplace integrations, 3D product configurators, or advanced forecasting as pilot-launch prerequisites.
- New microservices, global partnership generalization, or fresh domain entities solely because they appear convenient in a PRD.
- A legal holding/group identity assertion based on branding or repository folders.
- Treating customer storefront prototypes, planning tables, AI memory, marketing mockups, or a completed CI workflow as evidence of physical or commercial readiness.

Explicit exclusions are *current program boundaries*, not a permanent prohibition on later evidence-driven expansion.

## 8. Portfolio risk posture and stop/review triggers

| Risk ID | Failure mode | Initial control / trigger |
| --- | --- | --- |
| `BOS-RISK-01` | Founder becomes the hidden workflow engine and bottleneck | Track workload, pending exceptions, and customer wait time; constrain intake when agreed limits breach |
| `BOS-RISK-02` | Curated-design storefront is mistaken for approved live checkout or unsanctioned products are sold | Separate discovery from content/IP clearance, stock, payment, returns and fulfillment gates |
| `BOS-RISK-03` | MultiGraph external pilot is launched solely from supporting-arm research | Explicit offer, terms, capacity, qualification and business-policy adoption |
| `BOS-RISK-04` | Parallel pilots create two duplicated products or a generic ERP monster | One shared semantic ownership route and bounded brand-specific lanes |
| `BOS-RISK-05` | Cross-business data access or actor authorization is incorrect | Canonical identity/authorization, scoped tools, negative tests and audit |
| `BOS-RISK-06` | Payment retry or unknown provider response is counted as commercial success | Idempotency, reconciliation, explicit unknown state and no duplicate financial effect |
| `BOS-RISK-07` | Apparel catalog/stock ambiguity leads to oversell or false availability | Truthful UX, governed stock/price authority and negative-path tests |
| `BOS-RISK-08` | Printing specification, proof or finishing changes after commitment | Versioned requirement/quote/proof, explicit consent and reapproval when needed |
| `BOS-RISK-09` | Vendor failures, unverified cost or deposit/cash exposure destabilize fulfillment | Qualified suppliers, true HPP, production evidence, contingency and cash controls |
| `BOS-RISK-10` | Multiple documents or PRs define incompatible authority | Exact-revision traceability, semantic owner routing and explicit reconciliation |
| `BOS-RISK-11` | Green CI is mistaken for real operational or production certification | Keep implementation, test, readiness and field evidence as separate states |
| `BOS-RISK-12` | AI invents facts or exceeds allowed mutation authority | Source-linked reasoning, governed tools, human escalation, no arbitrary SQL |
| `BOS-RISK-13` | Workflow retries multiply customer or financial side effects | Deterministic idempotency, recovery contract and exception visibility |
| `BOS-RISK-14` | Tiny cohorts or inter-unit sales create false evidence of market viability | Segment external demand; record sample size and separate smoke testing from demand validation |
| `BOS-RISK-15` | Public intake/artwork uploads leak data or silently lose customer requests | Authorization, data classification, retention policy, acknowledgments and failure tests |
| `BOS-RISK-16` | Documentation program becomes endless work disconnected from revenue | Limit scope per artifact; require named decision, trace link and usable adoption outcome |
| `BOS-RISK-17` | TeeStock remains defined or measured chiefly by Business/Custom services instead of curated designs | Brand charter, curated-design KPI and roadmap reconciliation; never equate existing D4 test with curated demand |

Risk IDs are reserved for the wider Dual Pilot Strategy model included in the review package; detailed ratings, owners, thresholds and treatment belong in a dedicated risk register after adoption. This anchor is not a substitute for a full security, finance or operations threat model.

**Stop/review principle:** If authorization evidence, transaction invariants, actual capacity, margin calculation, quality, or customer commitments cannot be trusted, pause or constrain the *affected scope* and reconcile. A portfolio decision should not silently cancel unrelated safe work, but commercial pressure must not override hard security or money-integrity gates.

## 9. Decision ownership and unresolved material parameters

### 9.1 Direction already selected by owner

- `OWNER-DIRECTION-BOS-01`: BisnisHub is an **internal** Business Operating System for the MultiGraph Group portfolio.
- `OWNER-DIRECTION-BOS-02`: **TeeStock and MultiGraph** are parallel pilot businesses.
- `OWNER-DIRECTION-BOS-03` (2026-10-20): **TeeStock is curated-design-first in brand, primary product and intended commercial value proposition**, not Business/Custom-first. This is a newly expressed owner clarification and must be reconciled into TeeStock-owned canonical business decisions before silently changing older ACTIVE Q4 sequencing.

These are recorded from owner conversation, not represented as newly approved, signed repository ADRs in the pinned snapshot.

### 9.2 Decisions still requiring explicit adoption or operating policy

| Proposal ID | Material decision | Must be resolved before |
| --- | --- | --- |
| `DEC-BOS-01` | Adopt this strategy anchor and register its authority/routing | Treating the new document as `ACTIVE` source |
| `DEC-BOS-02` | TeeStock retail transaction scope, terms, stock/pricing and customer support promise | Live retail checkout acceptance |
| `DEC-BOS-03` | MultiGraph first external offer, customer cohort, pricing/deposit and proof acceptance policy | External pilot commercial commitments |
| `DEC-BOS-04` | Brand, operating unit, legal entity, bank/tax and authorized actor mappings | Implementing legal/account isolation assumptions |
| `DEC-BOS-05` | Recovery, operational envelope, supported channels and exposure limits | Running transactions beyond manual experiment boundaries |
| `DEC-BOS-06` | Founder capacity budgets and measurable thresholds | Increasing intake or automation based on claimed efficiency |
| `DEC-BOS-07` | Integration with existing indices, source map, PRs and roadmap | Promoting package-level documentation authority |
| `DEC-BOS-08` | Per-capability automation/JARVIS promotion approval and evidence | Any expanded autonomous write authority |
| `DEC-BOS-09` | Amend TeeStock canonical strategy/decision register and reconcile D4/Q4/CX/roadmap precedence to curated-design-first primary product direction | Declaring revised TeeStock launch priorities canonical or builder-ready |

`DEC-BOS-*` here are **reserved proposals**, not accepted decisions. The owner need not manually audit every line of the document, but material business risk and governance approvals remain owner-reserved until explicitly delegated through accepted controls.

## 10. Documentation and engineering traceability rules

1. **Business rationale:** This anchor owns only proposed cross-portfolio intent after adoption. TeeStock and MultiGraph own their respective offer and commercial semantics.
2. **Product definition:** Per-pilot journeys, PRD requirements, nonfunctional expectations, UI acceptance and data dependencies belong in bounded follow-on documents. Reuse existing TeeStock CX and Founder Control documentation rather than copying their requirements into a competing parent.
3. **Shared technical ownership:** MGBOS canonical data, state machines, invariants, permissions, commands, and implementation ADRs govern transaction mechanics. JARVIS documents govern intelligence semantics. Root architectural governance governs cross-system boundaries.
4. **Delivery trace:** Each proposed feature should link `objective → business lane/journey → existing or proposed capability → requirement → acceptance → implementation work item → exact revision → verification evidence → operational observation`.
5. **Observed-state separation:** Preserve fields for `intent_status`, `design_status`, `implementation_status`, `test_status`, `operational_status`, source revision, and evidence URI. Do not collapse them into a single `done` checkbox.
6. **Quality order:** Inventory canonical sources → analyze source drift and conflicts → draft one bounded document → semantic and technical self-audit → validate machine metadata and references → revise → deliver exact target filename → adopt via established governance if approved.
7. **No quiet authority promotion:** Copying this file into Git is only a proposed addition. It cannot silently modify existing `ACTIVE` files, resolve a pending PR, approve release, or create new engineering work scope.

## 11. Conflict register — explicit compatibility with current sources

| Conflict or ambiguity | Correct interpretation |
| --- | --- |
| TeeStock curated-design-first owner direction vs older Business/Custom operating priority | **New founder direction owns proposed brand/product primacy**; `DEC-TS-2026-009`, D4 and active Q4/launch roadmap still govern their existing operating-validation scope until a versioned TeeStock-owned reconciliation. They must not be interpreted as founder endorsement of Business/Custom as TeeStock primary brand; nor silently superseded by this REVIEW anchor. |
| MultiGraph supporting arm vs new pilot | Existing supporting role remains documented; the owner-selected pilot direction requires separate offer/policy and operating-authority adoption before external commercial activation |
| One operational core vs distinct brand workflows | Share domain capability and governed transactions; specialize commercial intake, pricing, customer UX and policy where business evidence requires it |
| Canonical `ACTIVE` document vs runtime readiness | `ACTIVE` proves accepted design authority in its scope, **not** implemented runtime or commercial release |
| Repo/CI proof vs real customer proof | Code/CI and field operational outcomes are distinct evidence classes |
| Founder approval vs arbitrary AI permission | Owner approval of direction grants no implicit financial, data, production, Git merge or deployment permissions |
| New strategy proposal vs existing roadmap | Existing `ACTIVE` launch roadmap remains sequencing authority until a coordinated accepted amendment |

## 12. Source map for direct machine/human resolution

The following paths are **repository-root relative** and were observed at pinned main `8c7731a13867f38b391ea2f38e9ae7b1f0a7e540`. The file paths themselves are locators, not permission to ignore later approved revisions.

| Source role | Canonical/reference file |
| --- | --- |
| Documentation authority and lifecycle | `docs/governance/documentation-constitution.md` |
| Canonical semantic-owner routing | `docs/governance/canonical-source-map.md` |
| Ecosystem and cross-system design | `docs/architecture/master-system-blueprint.md` |
| Integration and trust boundaries | `docs/architecture/system-boundaries.md` |
| Root architectural constraints | `docs/architecture/architectural-laws.md` |
| Founder operating model | `docs/operating-model/solo-founder-operating-system.md` |
| Current launch-stage sequencing authority | `docs/roadmaps/solo-founder-launch-roadmap.md` |
| TeeStock decisions (including 009 and 011) | `bisnis/teestock/00-foundation/decision-register.md` |
| TeeStock current-quarter commercial priorities | `bisnis/teestock/14-roadmap/current-quarter.md` |
| MultiGraph existing supporting-arm status | `bisnis/multigraph/README.md` |
| MGBOS capability ownership | `systems/mgbos/docs/architecture/domain-map-capability-ownership.md` |
| MGBOS transaction representations | `systems/mgbos/docs/architecture/canonical-data-model.md` |
| MGBOS state and invariants | `systems/mgbos/docs/architecture/business-state-machines.md`, `systems/mgbos/docs/architecture/business-invariants.md` |
| MGBOS commands and security | `systems/mgbos/docs/architecture/command-event-model.md`, `systems/mgbos/docs/architecture/permission-authorization-model.md` |
| Founder Control and first real pilot | `systems/mgbos/docs/product/teestock-founder-control-prd.md`, `systems/mgbos/docs/product/teestock-operational-pilot-plan.md` |
| TeeStock customer-platform product direction | `systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md` (DRAFT at pinned main) |
| JARVIS mandate and runtime boundary | `systems/jarvis/docs/charter.md`, `systems/jarvis/docs/core-runtime.md` |
| Operational-readiness registry | `systems/mgbos/docs/engineering/operational-readiness.md` |

**Source freshness:** The source SHA and observations describe a point-in-time audit, not continuous monitoring. Every new adoption, engineering work package, or release candidate MUST refresh the relevant source and candidate revisions. If a path no longer exists, AI must report the resolution failure instead of inventing a replacement.

## 13. Strategic acceptance and promotion conditions

This document is adopted as `ACTIVE` by Owner decision on 2026-10-20. Strategic adoption satisfies:

- `SC-01` [ADOPTED]: Frontmatter conforms to `docs/governance/documentation-constitution.md`.
- `SC-02` [VERIFIED]: Existing upstream source references resolve at the pinned baseline.
- `SC-03` [RECORDED]: Explicitly flags the **material reconciliation needed** between the owner's curated-design-first primary business direction and older ACTIVE TeeStock assisted Business/Custom operating-priority documents (`DEC-TS-2026-009`, `DEC-TS-2026-011`, and `DEC-TS-2026-012`). Preserves MultiGraph, MGBOS, JARVIS and launch-governance boundaries.
- `SC-04` [VERIFIED]: Accepted owner directions are distinct from proposed operating rules and unknown runtime states.
- `SC-05` [VERIFIED]: The strategic anchor does not overwrite an existing file or duplicate canonical semantics.
- `SC-06` [ADOPTED]: Owner adoption is recorded with exact-head source baseline pinned to `8c7731a13867f38b391ea2f38e9ae7b1f0a7e540`.

**Separate operational proof:** No acceptance of this document provides `pilot_ready`, `checkout_ready`, `production_ready`, `finance_ready`, or `autonomy_ready` status. Each requires its own target, test, evidence, and authorized decision under existing governance.

---

**End of strategic anchor.** This revision corrects TeeStock brand/product primacy; reconcile earlier operational priorities through TeeStock-owned accepted decisions before authorizing a curated-sales launch. Next logical artifact is the matching amended *parallel pilots and shared capability boundary* document, followed by a crosswalk, after review-state continuity or repository integration. Neither that document nor any subsequent PRD should be generated by duplicating existing canonical MGBOS or TeeStock requirements.
