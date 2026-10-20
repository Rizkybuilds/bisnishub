---
canonical_id: proposed.mgbos.product.teestock-customer-platform.cx-01
status: ACTIVE
version: 0.1.1
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: Rizky
scope: teestock-customer-platform-product-requirements
document_class: product-requirements
normative_authority: CANONICAL_PRODUCT_REQUIREMENTS
product_program: PROPOSED_TEESTOCK_CUSTOMER_EXPERIENCE_COMMERCE
product_maturity: PROPOSED_PRODUCT_CONTRACT
engineering_readiness: NOT_READY_FOR_ENGINEERING
implementation_status: PRODUCT_DEFINITION_ONLY
repository: Rizkybuilds/bisnishub
repository_branch: main
source_baseline_commit: 2800c474563309bda49d84d712f79b68c9dde36a
source_baseline_checked: 2026-10-16
source_inspection: selected_sources_and_active_teestock_app_not_full_monorepo
created: 2026-10-16
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md
supersedes: null
remediation_package: CX-REM-R1
remediation_review: AUTHOR_SELF_REVIEW_NOT_INDEPENDENT
source_reconciliation: cx-00-source-gap-audit.md
not_authoritative_for:
  - teestock_business_strategy_or_pricing_policy
  - mgbos_canonical_entities_states_invariants_or_commands
  - database_schema_or_api_design
  - jarvis_runtime_authority_or_agent_security
  - engineering_implementation_contract_or_work_package
  - production_deployment_and_operational_readiness
  - multigraph_customer_platform_product_requirements
  - marketplace_provider_api_entitlements_or_external_policies
  - design_system_final_visual_assets
  - release_date_or_implementation_authorization
proposed_authoritative_for_after_approval:
  - teestock_customer_platform_product_problem_and_objectives
  - customer_platform_actor_and_job_hierarchy
  - product_surface_scope_and_capability_priorities
  - customer_facing_requirement_baseline
  - high_level_customer_interaction_and_failure_outcomes
  - product_nongoals_and_deferred_capabilities
  - product_level_acceptance_conditions_and_success_metrics
  - product_decision_and_unknown_register
  - cx_02_to_cx_09_requirement_routing
source_dependencies:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/engineering/repository-layout.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - docs/operating-model/solo-founder-operating-system.md
  - docs/architecture/master-system-blueprint.md
  - bisnis/teestock/00-foundation/decision-register.md
  - bisnis/teestock/10-product-tech/digital-product-vision.md
  - bisnis/teestock/10-product-tech/website-information-architecture.md
  - bisnis/teestock/10-product-tech/commerce-platform.md
  - bisnis/teestock/10-product-tech/automation-architecture.md
  - bisnis/teestock/04-services/custom.md
  - bisnis/teestock/04-services/business.md
  - bisnis/teestock/07-operations/customer-service.md
  - bisnis/teestock/07-operations/order-fulfillment.md
  - bisnis/teestock/07-operations/returns-and-warranty.md
  - bisnis/teestock/08-finance/pricing-framework.md
  - bisnis/teestock/09-marketing/channel-strategy.md
  - bisnis/teestock/11-data-mgbos/mgbos-integration.md
  - systems/mgbos/docs/architecture/domain-map-capability-ownership.md
  - systems/mgbos/docs/product/teestock-founder-control-prd.md
  - systems/mgbos/docs/product/teestock-operational-pilot-plan.md
  - systems/jarvis/docs/charter.md

effective_from: 2026-10-20---

# CX-01 — TeeStock Customer Platform Master PRD v0.1.1

> **DOCUMENT STATUS: DRAFT — PRODUCT DEFINITION ONLY.** This document is a proposed product contract prepared from the read-only CX-00 audit. It is neither an approved canonical specification nor authorization to build. All CURRENT claims are restricted to source files inspected at `2800c474563309bda49d84d712f79b68c9dde36a`. External availability, runtime, user feedback, and service integrations have **not** been verified. Owner product approval, canonical routing, architectural impact review and bounded engineering work packages are separate later gates.

## 0. Executive contract

**Product name:** TeeStock Customer Experience & Commerce Platform (working program name).

**Product statement:** TeeStock will provide a premium, fast, mobile-first digital experience through which individual and business customers can understand offers, discover products, request customization, obtain trustworthy commercial information, order when eligible, monitor progress, obtain support and repeat purchases—without learning TeeStock's internal business structure or relying on fragmented chat/manual follow-ups. The underlying transaction and operational truth must remain in the governed MGBOS domain boundaries; AI and channel connectors may assist but never invent monetary or operational authority.

**North Star:** _Feature-rich in capability, minimal in cognitive burden, fast in interaction, reliable in commitments, and efficient for a solo founder._

**Product promise:** _Customers should spend their attention on what they want to make or buy—not on navigating our organization, translating printing terminology, chasing an update, or recovering from our systems' mistakes._

**Near-term practical reality:** Per strategic decision `DEC-TS-2026-011`, the first public customer presentation is retail-first: curated apparel collections, product presentation, discovery, and brand identity are front-and-center. Concurrently, Custom and Business pathways remain clearly visible, discoverable, and directly accessible from navigation and prominent entry points. Operational priority remains governed by active decision `DEC-TS-2026-009` (Business/Custom Lead → Quote → Order/Project → Production → QC → Fulfillment → Cost/Cash). Public retail discovery is non-transactional in initial presentation; no live checkout, payment gateway, or inventory reservation is active without independent operational and financial verification. The customer-facing journey must nonetheless be intentionally designed, legible, trustworthy and pleasant from its first public release.

**Strategic direction:** Define the complete _future_ experience now, while implementing capabilities in evidence-gated slices rather than a simultaneous feature launch. Retail brand discovery leads the customer experience front-of-house, while the assisted Custom/Business operational spine is intended to validate operations and generate initial business cash flow backstage as a gated future outcome (`DEC-TS-2026-009`), recognizing that real customer transactions remain unproven and production readiness remains gated. P0 quality standards are not a license for P2 functionality, and P2 vision is not an immediate implementation promise.

### 0.1 Product status vocabulary

| Label                      | Meaning                                                                                          | Authority                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| `CURRENT_SOURCE`           | Seen in actual repository source at inspected SHA; successful runtime not inferred               | Evidence only                                        |
| `EXISTING_BUSINESS_INTENT` | Defined by upstream TeeStock business strategy/commerce/operations documentation                 | Preserved external authority                         |
| `PROPOSED_REQUIREMENT`     | Intended new customer product behavior expressed in CX-01                                        | Draft until Owner approval and canonical integration |
| `P0_DEFINITION`            | Define and verify for the initial high-quality assisted-sales/customer-entry surface             | Does not imply immediate implementation              |
| `P1_TARGET`                | Target self-service/commerce expansion gated by dependency evidence                              | Planned                                              |
| `P2_FUTURE`                | Advanced, expensive, risky or unvalidated capability                                             | Proposed, not release commitment                     |
| `NOT_VERIFIED`             | No sufficient evidence of implementation, customer outcome, provider support or runtime behavior | Must not be reported as PASS                         |
| `NON_GOAL`                 | Explicitly not included in this product program/slice                                            | Normative only after approval                        |

### 0.2 Evidence snapshot and source reality

- Branch `main` checked 2026-10-16: `2800c474563309bda49d84d712f79b68c9dde36a` (historical audit baseline).
- Subsequent implementation baseline: PR #76 (commit `2458718`) merged CX-S0-A public informational entry (`/business`, `/custom`, `/support/contact`, and homepage shell).
- Strategic decision baseline: PR #78 (commit `3e5fb3d`) registered canonical decision `DEC-TS-2026-011` (retail-first presentation with governed Business/Custom operational priority preserving `DEC-TS-2026-009`).
- `systems/mgbos/apps/teestock/src/app/page.tsx` was initially observed as a placeholder and later updated in PR #76 with informational Custom/Business entry. In accordance with `DEC-TS-2026-011`, public presentation evolves to retail-led collection discovery without implying live transactional checkout.
- `systems/mgbos/apps/mgbos/src/app/(app)/` includes operational routes such as customers, leads, requirements, quotes, orders, payments, production, procurement, inventory, shipment and exception work. Their presence does **not** verify a public commerce contract.
- `systems/mgbos/packages/integrations/src/index.ts`, `packages/ai/src/index.ts`, and `packages/ui/src/index.ts` were observed as reserved exports. Do not infer real external connectors, consumer AI, or final shared design components from package names.
- Source business product vision, IA, commerce platform, Custom/Business services, customer-service policy and MGBOS integration descriptions contain much of the target direction and must be **reused**, not re-owned.
- Founder Control has an explicit separate product scope; full storefront and retail commerce were out of scope. This is **division of scope**, not a defect in the Founder Control PRD.
- The controlled operational pilot spec is Business/Custom **assisted-sales**, with no full public storefront prerequisite. The pilot does not validate retail direct checkout by proxy.
- PR #73 is an active documentation-entrypoint reconciliation candidate at time of preparation; do not edit overlapping routing/index files without current-state review.

**Audit provenance:** See companion `cx-00-source-gap-audit.md` for file-by-file sources, limitations, findings `CXF-01..CXF-11`, risks `CX-R01..CX-R12`, and source mappings. The CX-00 companion itself is a _DRAFT research input_, not a second normative requirements document.

---

## 1. Product mandate, product boundaries and business rationale

### 1.1 Why this product exists

TeeStock's Owner is a solo founder with finite capital, time, energy, attention and technical capacity. He will personally perform physical and exception-heavy operations early: sourcing, physical vendor coordination, packaging, quality inspection, courier handoff, and important approvals. The digital platform must offload repeatable information work, make customer requests structured at source, protect the business from wrong promises and limit follow-up fragmentation. In parallel it must provide a memorable, premium retail-first front-of-house experience—curated apparel collections, distinctive graphics, and brand prestige—rather than exposing MGBOS's internal operational complexity, while maintaining prominent direct routing to Custom and Business services (`DEC-TS-2026-011`).

**Two simultaneous product outcomes:**

1. **CUSTOMER VALUE:** Customer can discover curated apparel, understand garment standards, or submit a custom/business inquiry with minimum unnecessary effort and clear, reliable expectations.
2. **FOUNDER CAPACITY:** Each successful customer action creates governed, reusable information and a clear next operational step, instead of additional transcription, detective work and manual messaging for the founder.

A feature that impresses visually but increases failed orders, support contacts or manual touches is not a product success.

### 1.2 Product in / product out

**IN — customer experience ownership:** public routes and customer-specific journeys; what customers see, enter, choose and confirm; product/price/status **presentation**; guest/account experience; request/quote/checkout experience; support and reorder entrypoints; accessible and performant interaction; channel continuity as experienced by customers; AI assistance presentation/consent/escalation; product-level acceptance and measurement.

**OUT — governed elsewhere:** commercial pricing formulas, discount authority, product assortment policy, vendor and production eligibility, authoritative customer/order/payment/refund/inventory records, MGBOS transactions and state machines, authentication implementation details, JARVIS runtime permissions, marketplace API implementation, accounting, fulfillment operation, real-world delivery guarantees, production deployment approval, legal terms drafted without review.

**Related but separate programs:** MGBOS Founder Control (internal attention and operational exceptions); TeeStock brand identity and pricing policy; JARVIS intelligence/runtime; future MultiGraph print-focused customer platform; future creator/partner portals. This PRD may request interface requirements but does not define their canonical semantics.

### 1.3 Architectural product invariant

`CUSTOMER EXPERIENCE ≠ SYSTEM OF RECORD`. Public-facing price/status/availability/quote/fulfillment views derive from authorized services over canonical MGBOS facts or explicitly marked drafts/estimates. Presentation logic cannot silently become monetary or operational authority. No new tables, command names or entity lifecycle transitions are authorized by this PRD.

### 1.4 Premium is behavior, not decoration

A premium customer experience must exhibit: clear visual hierarchy; persuasive but honest information; accessible controls; deliberate motion; predictable recovery; continuity after interruptions; mobile-first layout; consistent brand expression; and low latency under representative conditions. It does **not** mean heavy animations, unnecessary 3D, mandatory chatbots, intrusive personalization or exposing every possible option in one screen.

### 1.5 Definition of product success

A release is not accepted merely because all routes render. It must demonstrate that a target user can complete the relevant job, understand price/status/lead-time implications, recover from expected failures and leave the business with a valid next action. Performance and accessibility must be measured, and founder manual work must be visible rather than hidden.

---

## 2. Target customer and actor model

| Actor ID    | Segment / actor            | Primary job                                                            | Early mode                                                 | Expansion condition                                          |
| ----------- | -------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| `ACT-CX-01` | First-time retail visitor  | Decide what fits, compare options, buy without confusion               | Discovery; selected purchase channels                      | Retail sellable catalog/checkout verified                    |
| `ACT-CX-02` | Returning retail customer  | Track, find prior products, repeat purchase or request support         | Guest/assisted status as approved                          | Verified self-service account/order model                    |
| `ACT-CX-03` | Personal custom buyer      | Explain garment, quantity, artwork and deadline, obtain credible quote | Structured inquiry + human review                          | Stable price/production config and self-service eligibility  |
| `ACT-CX-04` | Business buyer / purchaser | Specify larger or recurring order, obtain quote, document decision     | Business inquiry + assisted quote                          | Repeat-order, account authority and credit rules proven      |
| `ACT-CX-05` | Business approver/contact  | Review and approve commercial proposal within delegated authority      | Documented assisted approval                               | Organization-scoped digital approvals with audit trail       |
| `ACT-CX-06` | Guest customer             | Access own inquiry/order without unwanted account creation             | Secure minimal access where approved                       | Secure identity and object-claim verification                |
| `ACT-CX-07` | Founder / operating staff  | Resolve only operational actions not safely automated                  | Physical work, commercial judgment, QC, exception handling | Automated deterministic routing, QA and integration maturity |
| `ACT-CX-08` | MGBOS / governed services  | Own business transactions and immutable evidence                       | Authoritative backend                                      | Existing owned semantics preserved                           |
| `ACT-CX-09` | JARVIS / bounded AI        | Explain, draft, extract, recommend, triage under policy                | Optional assistance; never required for transaction truth  | Tool and evaluation contract approved                        |
| `ACT-CX-10` | External channel/provider  | Originate authorized orders and confirmations                          | Manual/semi-manual where needed                            | Provider-specific rights and reconciliation tested           |

**Identity note:** A retail customer, an organizational buyer, a guest inquiry, and an internal operator are not automatically interchangeable identities. Public actor permissions must be explicitly designed and independently reviewed against organization isolation; this PRD does not assume current internal authentication already solves customer access.

### 2.1 Jobs-to-be-done (JTBD)

- `JTBD-01 DISCOVER`: "Show me the right offer quickly; do not make me understand your divisions."
- `JTBD-02 TRUST`: "Tell me what the product is, what I can expect and whether the offer is actually available."
- `JTBD-03 CUSTOMIZE`: "Help me express my design and constraints without knowing apparel/print production terminology."
- `JTBD-04 DECIDE`: "Make the price/estimate, inclusions, lead time and next action clear."
- `JTBD-05 TRANSACT`: "Let me submit, pay or approve when eligible, without duplication or uncertainty."
- `JTBD-06 FOLLOW`: "Let me know what is happening, when I need to act and whom to contact."
- `JTBD-07 RESOLVE`: "Help me fix errors, changes or service issues without starting from zero."
- `JTBD-08 REPEAT`: "Make a valid repeat purchase or quote simpler than the first."
- `JTBD-09 FOUNDER`: "Convert customer intent into structured work, with minimal administrative reconstruction."

### 2.2 Experience principles (proposed stable standards)

| Principle ID | Principle                                                  | Failure that violates it                                         |
| ------------ | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| `XP-01`      | Expose customer intent; hide internal departments          | Customer must know CRM vs production module to request a product |
| `XP-02`      | High capability, low initial complexity                    | Every advanced option loads or appears before user needs it      |
| `XP-03`      | Price and delivery truth over conversion tricks            | Unsupported price/date presented as guaranteed                   |
| `XP-04`      | A mobile customer is a first-class user                    | Critical CTA/form is inaccessible or requires desktop            |
| `XP-05`      | Every irreversible action provides clear acknowledgement   | Customer cannot tell whether request/order was submitted         |
| `XP-06`      | Recover instead of restart                                 | Network failure erases lengthy custom requirements               |
| `XP-07`      | Accessible design is not optional polish                   | Keyboard or assistive technology users cannot complete task      |
| `XP-08`      | AI is assistive, bounded and replaceable                   | Customer cannot finish a deterministic workflow without AI       |
| `XP-09`      | Channel experience is coherent, not falsely uniform        | Website promises actions that external marketplace forbids       |
| `XP-10`      | Every customer self-service win reduces back-office effort | Same details must be retyped manually by founder                 |

---

## 3. Product surfaces, navigation and channel roles

**Authority boundary:** Existing `TS-TEC-002` owns the TeeStock business website IA. CX-01 defines **requirements for user outcomes**, and CX-02/CX-03 later refine navigation/interaction without silently replacing that IA. The `SHOP / CUSTOMIZE / FOR BUSINESS / BUILD MERCH` intent framework is reused per `DEC-TS-2026-011`, leading with retail presentation while keeping Custom and Business immediately accessible.

| Surface                             | Customer-facing purpose                                                                             | Definition stage                                  | Contract owner after this PRD |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------- |
| Public homepage + retail router     | Curated apparel showcase, brand identity and collection discovery; prominent Custom/Business routes | `P0_DEFINITION`                                   | CX-02/03                      |
| Curated collection / shop discovery | Nontransactional apparel discovery, lookbooks, garment specs; no live checkout                      | `P0_DEFINITION` (nontransactional)                | CX-03/04                      |
| Custom entry + structured inquiry   | Ask for personalized products or production (prominent secondary pathway)                           | `P0_DEFINITION`                                   | CX-05                         |
| Business entry + qualified request  | Request business/uniform/merch quote (prominent secondary pathway)                                  | `P0_DEFINITION`                                   | CX-05                         |
| Transactional catalog / products    | Browse verified sellable products with active purchasing eligibility                                | `P1_GATED` (requires operational readiness)       | CX-04                         |
| Product detail / variant selection  | Review garment attributes, sizing, photos, design story (`CX1-FR-007`; static preview in S0)        | `P1_TARGET` (earliest delivery candidate `CX-S1`) | CX-04                         |
| Cart and direct checkout            | Transact safely for eligible items                                                                  | P1, not pilot prerequisite; R5 assurance required | CX-04                         |
| Guest inquiry/order access          | Receive acknowledgement, access permitted own status                                                | P0 minimum; expanded P1                           | CX-06                         |
| Customer account and self-service   | Track, reorder, contact support, manage authorized profile                                          | P1                                                | CX-06                         |
| B2B account workspace               | Quotes, approvals, documents and repeats                                                            | P1/P2 gated by demand/authority                   | CX-05/06                      |
| Guided custom configurator          | Select standardized options, upload assets, receive estimate/quote                                  | Structured intake P0; advanced builder P2         | CX-05                         |
| Support/help and returns request    | Resolve real issues with minimal customer burden                                                    | Basic P0, expanded P1                             | CX-06                         |
| Marketplace/social channels         | External discovery/order context, consistent internal record                                        | Manual P0 if used; integrations P1/P2             | CX-07                         |
| AI customer assistant               | Inform, qualify, summarize; escalate uncertainty                                                    | Optional P1; autonomy P2 subject to policy        | CX-06/08 and JARVIS owner     |
| Creator/partner portals             | Participant tools and separate ecosystems                                                           | OUT OF SCOPE for CX-01 first package              | Future product tracks         |

**Route labels here are conceptual only.** Final paths/subdomains must honor existing IA, URLs, SEO, redirects and any approved brand decisions. P0 may be accomplished through an intentionally small set of exceptionally designed pages. A simple nontransactional collection/product content preview MAY form part of S0 presentation; however, this must not imply that the complete interactive product-detail/variant capability defined by `CX1-FR-007` has moved into P0. `CX1-FR-007` remains strictly P1 with candidate first delivery slice `CX-S1`. No new P0 product-detail requirement or mandatory retail catalog implementation is authorized.

### 3.1 Public vs internal separation

- Public user must never see internal margin, vendor rate, financial ledger, raw production notes, internal exception taxonomy, organization data outside authority, or unapproved operational commitments.
- Customer-friendly order states are authorized projections from canonical source, with plain-language meaning; not a cloned business lifecycle.
- Personalized and organizational views must be scoped by verified identity/authorization; no trust in an opaque client-supplied organization identifier.
- Provider events/webhooks are untrusted until validated through their own integration boundary.

---

## 4. Customer journeys (master-level contracts)

Full storyboard, swimlanes, field sets, step timing and recovery tests belong to CX-02/04/05/06. CX-01 freezes the _intent and outcomes_, not individual screens or APIs.

### `JRN-01` — First-time customer → appropriate offer (Retail-led discovery + prominent service routing)

**Start:** Visitor reaches website by search, social, marketplace bio or direct URL. **Proposed presentation:** Lands on curated apparel collections, product presentation, and brand identity front-and-center (`DEC-TS-2026-011`). **Proposed target journey:** Within a short, intuitive target journey the visitor discovers curated products (`Shop`) or navigates directly to clearly visible, prominent pathways for `Custom`, `For Business`, or `Build Merch` without needing to understand internal organizational structures. **Nontransactional clarity:** Visitor browsing retail items sees curated designs and garment standards with transparent availability context (e.g. preview, drop info, or assisted inquiry); no misleading instant checkout CTA is presented prior to operational readiness. **Failure path:** irrelevant/no-result content yields helpful next options, not a dead end. **Intended business outcome:** anonymous browsing is designed to build brand prestige (as an intended design objective, not yet demonstrated by customer evidence) without creating CRM noise; genuine Custom/Business inquiries are intended to become structured intent once public submission into the governed MGBOS operational spine is authorized and connected (`DEC-TS-2026-009`), distinguishing this proposed product behavior from the current public website where self-service intake is not yet active at runtime.

### `JRN-02` — Standard custom inquiry → governed assisted quotation (initial P0)

**Start:** Customer wants customized garments, may not know printing methods. **Inputs:** product class, approximate quantity/sizes where relevant, intended use, artwork availability, needed-by date and contact permission; conditional information only when required. **Outcome:** clear preview of submitted details, explicit request receipt/identifier, whether pricing is an estimate or pending quote, realistic next action and contact expectation according to approved policy. **Backstage:** MGBOS receives a permitted lead/requirement; founder performs review, sourcing and physical execution when required. **Failure:** missing/invalid artwork, unknown stock or unsupported timeline cannot be converted to false instant quote.

### `JRN-03` — Business inquiry → quote review → acceptance (initial assisted, later self-service)

**Start:** Organization requests volume uniforms/merch/multi-product work. **Outcome:** request is categorized and acknowledged, needed approvals and documents are clear, quote version and validity are visible when authorized. **Backstage:** approved MGBOS quote/order lifecycle; decision remains with the correct commercial authority. **Failure:** ambiguous price, changed quote version or missing approver prevents misleading acceptance.

### `JRN-04` — Product discovery → eligible retail transaction (P1)

**Start:** Visitor finds sellable item. **Outcome:** sees accurate product/SKU/variant, price presentation, availability mode, fulfillment expectation and fee disclosures; cart/checkout is accessible and recoverable. **Backstage:** inventory/price/payment/order commands are delegated to authoritative systems. **Failure:** stock change, invalid promotion, payment pending or callback loss must not create duplicated/untraceable orders.

### `JRN-05` — Artwork/approval loop (P0 assisted; P1+ governed self-service)

**Start:** Customer uploads file or requests change. **Outcome:** understands file received vs reviewed vs approved; sees version, requested correction and whether production has started. **Backstage:** approved design/artwork and production semantics; no public approval state invents a new production state. **Failure:** unsupported files, unsafe content, size/quality warnings and repeated submissions receive recoverable, traceable outcomes.

### `JRN-06` — Post-order status → support → resolution/reorder

**Start:** Customer asks "where is my order?" or reports a problem. **Outcome:** safe summary of current status and next customer action, support path linked to order when authorized, and clear resolution expectations; eligible reorder avoids full re-entry. **Backstage:** governed shipments, customer-case/return semantics, exception work and manual physical actions. **Failure:** unavailable data is labeled unavailable rather than incorrectly "no order" or delivered.

### `JRN-07` — External-channel purchase → internal fulfillment (P1+)

**Start:** Order originates on an approved marketplace. **Outcome:** customer receives only platform-permitted status and service handling; no conflicting guarantee from TeeStock. **Backstage:** external identifiers preserve source, ingestion handles retry and can be reconciled; founder sees action only when genuinely needed. **Failure:** webhook duplicates, mapping mismatches and provider outages must not duplicate transactions or silently oversell.

### `JRN-08` — AI-supported clarification → controlled human handoff (optional)

**Start:** User requests help with product choice, sizing, artwork or status. **Outcome:** AI explains supported information, indicates uncertainty, captures structured intent with consent and escalates when fact/authority is missing. **Failure:** no unsupported discount, payment promise, production deadline or order mutation; a normal form/contact path remains available.

---

## 5. Requirements discipline and release semantics

**Identifier format:** `CX1-FR-###` for proposed functional requirements, `CX1-BR-###` for cross-cutting product rules, `CX1-NFR-###` for quality outcomes, `CX1-AC-###` for acceptance. These IDs are **DRAFT**; CX-02..09 should reference rather than redefine them. Each implemented slice must later map to exact source/test evidence, not simply a ticket marked done.

**Priority `P0`:** product contract necessary for a premium assisted-sales/inquiry launch and safe founder operations, subject to active roadmap and technical gates. **Priority `P1`:** self-service commerce/customer operations, after required business truth and identity readiness. **Priority `P2`:** advanced platform features, after validation of repeated demand, cost/benefit, rules and reliability.

**Acceptance syntax:** `Given/When/Then` descriptions in this PRD are product acceptance _requirements_, not reports that tests have passed. The independent engineering acceptance suite and precise synthetic datasets belong to CX-08 and implementation IC/WP.

---

## 6. Functional requirement inventory

### 6.1 Discovery, navigation and public trust

| ID           | Priority | Proposed requirement                                                                                                | Product acceptance obligation                                                                                | Detailed spec |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------- |
| `CX1-FR-001` | P0       | Route users by primary job (`Shop`, `Customize`, `For Business`, `Build Merch`) instead of internal divisions       | User can identify relevant path and reach corresponding actionable destination using desktop/mobile/keyboard | CX-02/03      |
| `CX1-FR-002` | P0       | Distinguish available offer, planned capability, and currently unavailable service without false purchase CTAs      | Unavailable feature does not suggest a working checkout or instant production promise                        | CX-02/03      |
| `CX1-FR-003` | P0       | Make core contact/quote action visually clear with contextual CTA and readable expectations                         | Visitor can see next action and key constraints without reading organizational documentation                 | CX-02/03      |
| `CX1-FR-004` | P0       | Show material service facts: available garment/print categories, indicative scope, quantity and lead-time qualifier | Information uses approved business source; unknown values are marked as needing confirmation                 | CX-02/05      |
| `CX1-FR-005` | P0       | Provide mobile-first navigation and recoverable deep links                                                          | Major customer job remains reachable at supported viewport sizes and accessible focus order                  | CX-03/08      |
| `CX1-FR-006` | P1       | Provide search, filtering and sorting over actually published sellable product data                                 | Filter/search empty/error/offline states are useful; unpublished products are not accidentally exposed       | CX-04         |
| `CX1-FR-007` | P1       | Product detail presents variant, imagery, sizing, availability mode, price basis and expectations                   | Product information is versioned/fresh per approved source; uncertainty is not presented as in-stock         | CX-04         |
| `CX1-FR-008` | P2       | Offer recommendation/personalization without hiding ordinary browsing                                               | User can navigate without recommendation engine, consent choices honored, performance unaffected             | CX-03/08      |

### 6.2 Assisted custom and B2B customer intake

| ID           | Priority | Proposed requirement                                                                             | Product acceptance obligation                                                                                                | Detailed spec |
| ------------ | -------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `CX1-FR-009` | P0       | Collect structured Custom inquiry inputs with minimum necessary fields                           | Valid submission creates one traceable permitted request; missing required info produces field-level guidance                | CX-05         |
| `CX1-FR-010` | P0       | Dynamically reveal advanced questions only if customer type/selection requires them              | Simple customer not forced to answer production-level questions unrelated to request                                         | CX-03/05      |
| `CX1-FR-011` | P0       | Allow approved artwork submission or explicit "not ready" path                                   | Errors/format limits shown before or during upload; file receipt ≠ artwork/production approval                               | CX-05/08      |
| `CX1-FR-012` | P0       | Capture deadlines as requested dates, not automatic guaranteed dates                             | Impossible/unverified deadline produces qualification/escalation rather than firm promise                                    | CX-05         |
| `CX1-FR-013` | P0       | Acknowledge request receipt with stable reference and truthful next step                         | Repeated submission/network retry does not silently create duplicate actionable requests                                     | CX-02/05/08   |
| `CX1-FR-014` | P0       | Route complexity/organizational requirements to Business assisted flow                           | Complex quote path retains entered data and clearly communicates need for human review                                       | CX-05         |
| `CX1-FR-015` | P0       | Display quote/estimate terminology honestly                                                      | Estimate, draft, human-approved quote, and accepted offer cannot be confused visually/textually                              | CX-05         |
| `CX1-FR-016` | P1       | Provide secure digital quote review, revision/expiration and acceptance where authorized         | Wrong quote version or missing approver cannot be submitted as an accepted commercial commitment                             | CX-05/08      |
| `CX1-FR-017` | P1       | Provide signed-in organization workspace for proven repeat B2B needs                             | Only authorized roles see scoped quotes/orders/invoices; all changes traceable                                               | CX-05/06      |
| `CX1-FR-018` | P2       | Guided sellable custom configuration over standardized product/method/placement/quantity options | No self-service instant-price/production assertion outside approved deterministic eligibility                                | CX-05         |
| `CX1-FR-019` | P2       | Accurate, bounded preview/proof lifecycle for custom artwork                                     | Preview limitations explicit; customer proof acceptance version and scope cannot be mistaken for production-ready validation | CX-05/08      |

### 6.3 Retail commerce, order and payment experience

| ID           | Priority | Proposed requirement                                                                               | Product acceptance obligation                                                                 | Detailed spec |
| ------------ | -------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------- |
| `CX1-FR-020` | P1       | Browse eligible products/SKUs/variants and current price context                                   | Invalid or retired variant cannot be added as a valid order line                              | CX-04         |
| `CX1-FR-021` | P1       | Cart preserves selected eligible items, quantity and clear recalculation boundaries                | Cart changes are visible and require transparent revalidation at checkout                     | CX-04         |
| `CX1-FR-022` | P1       | Guest checkout when approved by commercial, security and payment policies                          | Guest can complete without forced account; identity/order lookup remains protected            | CX-04/06/08   |
| `CX1-FR-023` | P1       | Checkout shows product, taxes/fees/shipping where applicable, price status and payment choice      | Before committing, customer sees authoritative final payable amount and policy disclosures    | CX-04         |
| `CX1-FR-024` | P1       | Payment UX distinguishes not started, awaiting action, pending confirmation, success and failure   | Customer never sees confirmed success merely because browser redirected or webhook is delayed | CX-04/08      |
| `CX1-FR-025` | P1       | Order confirmation has stable reference, next steps, expected status availability and help path    | Browser refresh/retry cannot make customer uncertain about already-completed accepted command | CX-04/06/08   |
| `CX1-FR-026` | P1       | Unavailable stock/price changes trigger controlled reconciliation before purchase                  | Customer can correct cart, remove item, request assistance or stop without hidden charges     | CX-04         |
| `CX1-FR-027` | P1       | Represent ready-stock/MTO/preorder availability distinctly according to approved assortment policy | Product detail and checkout use compatible fulfillment language; no fictitious ATS            | CX-04         |
| `CX1-FR-028` | P2       | Optional advanced promotions, bundles and personalization                                          | Promotion rules deterministic, auditable and consistent across order confirmation             | CX-04         |

### 6.4 Customer account, tracking, support and lifecycle

| ID           | Priority | Proposed requirement                                                                             | Product acceptance obligation                                                                        | Detailed spec |
| ------------ | -------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ------------- |
| `CX1-FR-029` | P0       | Give an inquiry customer a clear acknowledgement and legitimate follow-up route                  | Contact and response expectations use approved policy, no invented SLA                               | CX-02/06      |
| `CX1-FR-030` | P0       | Where authorized, provide customer-readable status/help without exposing internal order details  | Invalid/unauthorized lookup discloses no customer, order or organization secrets                     | CX-06/08      |
| `CX1-FR-031` | P1       | Account shows scoped order history and current understandable status                             | Current, delayed, canceled and unavailable states are distinguished accurately                       | CX-06         |
| `CX1-FR-032` | P1       | Surface support entrypoint tied to selected customer/order context                               | Customer does not retype accessible facts; case creation respects customer service ownership         | CX-06         |
| `CX1-FR-033` | P1       | Allow eligible return/service request with reason and evidence                                   | Form is a request; automatic approval only where existing policy explicitly allows                   | CX-06         |
| `CX1-FR-034` | P1       | Explain artwork corrections, approval and required customer actions safely                       | Customer sees only relevant and authorized artifacts; approval relates to exact version              | CX-05/06      |
| `CX1-FR-035` | P1       | Enable repeat purchase/inquiry using permitted immutable prior order context                     | Customer must reconfirm current price, availability, size, quantity and policy before placing repeat | CX-06         |
| `CX1-FR-036` | P1       | Allow user to manage limited profile/preferences and notification consent as lawful and approved | Data changes are explicit, scoped, reversible where appropriate and consistent with privacy policy   | CX-06/08      |
| `CX1-FR-037` | P2       | B2B customer workspace supports account-approved products, documents and reorders                | Multiple contacts/roles remain authorization-scoped with audit trails                                | CX-05/06      |

### 6.5 Cross-channel, AI and solo-founder operations

| ID           | Priority | Proposed requirement                                                                           | Product acceptance obligation                                                                                    | Detailed spec |
| ------------ | -------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------- |
| `CX1-FR-038` | P0       | Customer submissions result in structured records/queues, not chat-only memory                 | Founder can find submitted context, source and next action without duplicate transcription                       | CX-02/05      |
| `CX1-FR-039` | P0       | Define operator-required physical actions separately from candidate AI/system actions          | Sample journey shows what founder buys, inspects, packs, hands to courier, approves and does not manually repeat | CX-02/09      |
| `CX1-FR-040` | P0       | When AI or third-party service unavailable, preserve assisted/manual intake path               | User can reach safe human-assisted resolution without losing validated information                               | CX-02/07/08   |
| `CX1-FR-041` | P1       | Channel-sourced orders preserve provider/source identity and customer expectation boundaries   | Duplicate external event/order cannot create duplicate canonical order; mismatches route to reconciliation       | CX-07/08      |
| `CX1-FR-042` | P1       | Customer notification uses event/permission-appropriate state, not guessed workflow completion | Failed notification does not mutate financial/production truth; retry/reconciliation visible internally          | CX-06/07      |
| `CX1-FR-043` | P1       | Optional AI provides grounded explanation, qualification and drafts with human escalation      | AI output is clearly non-authoritative; no unsupported price/date/refund/credit promises                         | CX-06/08      |
| `CX1-FR-044` | P1       | Capture where customer friction generates operational work                                     | Metrics distinguish normal inquiries, avoidable support contacts and genuine exceptions                          | CX-02/09      |
| `CX1-FR-045` | P2       | Channel sync of eligible listing/price/ATS/status under approved adapters                      | Provider capabilities, idempotency, reconciliation and conflict handling verified per channel                    | CX-07         |
| `CX1-FR-046` | P2       | AI-supported configuration and proactive account help within granted tools                     | Every execution authorized, traceable, rate/cost bounded, undo/compensate if supported; failing safe             | CX-05/06/08   |

**Coverage check:** `CX1-FR-001..046` are _product-level requirement candidates_. They do not imply 46 implementation stories, 46 new database objects or that all can be released in one version. CX-02..09 will refine and de-duplicate before conversion to engineering work packages.

---

## 7. Cross-cutting business and interaction rules

These `CX1-BR-*` rules describe public-product obligations **derived from** upstream policies; they do not override those policies, and conflicting interpretation must be resolved at the canonical owner.

| Rule         | Requirement                                                                                                                                                                 | Referenced authority                                         |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `CX1-BR-001` | Only approved commercial data can become a final payable price or accepted quote; AI text and UI calculations alone are never authority                                     | TeeStock Pricing Framework; MGBOS financial/quote invariants |
| `CX1-BR-002` | Estimated delivery or requested deadline must not be presented as a guaranteed operational commitment absent governed promise authority                                     | TeeStock Custom/Business, fulfillment policy                 |
| `CX1-BR-003` | Any apparent inventory availability must reflect approved availability mode, reservation and freshness policy                                                               | TeeStock Commerce Platform / MGBOS inventory owner           |
| `CX1-BR-004` | Customer-facing order/payment/progress states are projections; they do not write alternate domain lifecycles                                                                | MGBOS state machines and command model                       |
| `CX1-BR-005` | Customer actions that can create money/order/approval consequences go through existing approved commands and authorization checks                                           | MGBOS architecture/authorization                             |
| `CX1-BR-006` | Customer file upload, receipt, technical validation, proof approval and production release must be distinct concepts                                                        | TeeStock Custom/Business and production policies             |
| `CX1-BR-007` | Customer-facing errors shall distinguish unavailable data, empty result, unauthorized result, invalid input and true operational failure                                    | UX reliability and security review                           |
| `CX1-BR-008` | A lost network response must not create ambiguous repeated money/order/lead side effects                                                                                    | Idempotency and MGBOS transaction contracts                  |
| `CX1-BR-009` | Guest link/account ownership and organization visibility must be independently authorization-reviewed; no "ID-in-URL = access" model                                        | MGBOS security/identity authority                            |
| `CX1-BR-010` | Public UX must not expose privileged internal margin, vendor costs, production identity, logs or raw exception data                                                         | MGBOS authorization and data ownership                       |
| `CX1-BR-011` | External marketplace policy and actual channel truth take precedence where the transaction is contractually owned by the marketplace; internal MGBOS truth still reconciles | Channel Strategy / integration provider agreements           |
| `CX1-BR-012` | Return/refund/credit approval is not created by merely displaying a support request or AI response                                                                          | Customer Service, Returns & Warranty, payment policy         |
| `CX1-BR-013` | AI recommendations remain replaceable with deterministic/manual journey; AI has no free-standing pricing, credit, contract or refund authority                              | MGBOS/JARVIS governance and AI boundaries                    |
| `CX1-BR-014` | Automation and notifications are consumers of business facts, not new master ledgers or status authorities                                                                  | Automation Architecture / MGBOS integration                  |
| `CX1-BR-015` | Rich interaction uses progressive disclosure, feature gating and progressive enhancement rather than mandatory advanced frontend for every route                            | Customer experience mandate                                  |
| `CX1-BR-016` | Public copy states what is actually available now and what is planned; no "coming soon" disguised as working functionality                                                  | Truthful customer trust requirement                          |
| `CX1-BR-017` | Solo-founder physical tasks must remain explicit; AI cannot be credited with buying, inspecting, packing or courier handoff without real integration/evidence               | Solo-founder operating model                                 |
| `CX1-BR-018` | Product/business policy may differ by retail, Custom, B2B, channel and label; no generic frontend rule silently erases those distinctions                                   | Commerce and Business/Custom policies                        |
| `CX1-BR-019` | Customer contact/marketing preferences are not implied by ordering or asking for a quote; lawful permissions and provider rules apply                                       | Marketing / privacy and legal review                         |
| `CX1-BR-020` | High-value or irreversible commitments must be gated by correct identity, version, consent and delegated approval                                                           | Business authority and MGBOS permission model                |

### 7.1 Public information confidence levels

The product must consistently distinguish:

- `CONFIRMED`: reliable state from approved current source, within its allowed freshness and scope.
- `ESTIMATED`: approximation with visible assumptions or explicit confirmation caveat.
- `SUBMITTED`: information has been accepted as a request, but is not an accepted order/quote/payment.
- `PENDING_REVIEW`: requires human/system review; no promise of outcome.
- `UNAVAILABLE`: authoritative data cannot be loaded; do not replace with "zero", "no orders" or "complete".
- `EXPIRED/STALE`: quote/session/availability may need refresh before action.

These are **product communication categories**, not proposals for new MGBOS database enums or lifecycle states. CX-03/04/05/06 may map them to UI state tables once architecture owners review source-of-truth mapping.

### 7.2 Failure and recovery matrix

| Scenario                                                       | Required customer behavior                                                         | Backstage evidence/guard                               | Priority |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------ | -------- |
| Form required field missing                                    | Show field-specific help; preserve correct entered values                          | No accidental submission                               | P0       |
| Large/unsupported artwork                                      | State reason and allowed remedy; retain other fields                               | No false file approval; upload policy                  | P0       |
| Customer deadline not yet assessed                             | "Requested date—confirmation required"                                             | No unsupported production SLA                          | P0       |
| Network timeout during inquiry                                 | Safe retry/check status if available; avoid duplicate actionable record            | Stable request correlation/idempotency                 | P0       |
| Submitted request returns success but email notification fails | Reference and receipt still available; notification failure does not erase request | Notification out-of-band state                         | P0       |
| Login/guest link invalid or expired                            | Clear safe recovery path without leaking object's existence                        | Authorization/expiration proof                         | P0/P1    |
| Catalog source temporarily unavailable                         | Honest service state, retry, help route; not "no products"                         | Data health observed separately                        | P1       |
| Price changes between cart and checkout                        | Revalidate, explain changed amount, reconfirm; no silent charge                    | Authoritative checkout price snapshot                  | P1       |
| Stock becomes unavailable after selection                      | Explain, offer options/correction, never oversell via UI assumption                | Inventory and reservation checks                       | P1       |
| Payment returns but provider callback pending                  | Pending confirmation; no false paid banner                                         | Approved gateway/provider truth and idempotent replay  | P1       |
| Repeat purchase after price/stock changed                      | Prepopulate permissible historical context; reconfirm current terms                | Fresh validation and separate new order ID             | P1       |
| Customer cancels after irreversible production point           | Explain eligibility and contact path; do not auto-refund                           | Canonical return/cancellation policy                   | P1       |
| External marketplace sends duplicate event                     | Customer status unaffected by duplicate event                                      | Canonical dedupe and reconciliation                    | P1/P2    |
| External channel stock sync lag                                | Avoid guaranteed cross-channel live inventory promise                              | Channel buffer/reconciliation where justified          | P2       |
| AI offers unsupported deadline/price                           | Disallow commitment; provide grounded clarification and escalation                 | Evaluated guardrails and recorded failure case         | P1/P2    |
| Service outage after order accepted                            | Inform without losing order or fabricating data; support/recovery path             | Operational incident vs customer order state separated | P1/P2    |

---

## 8. Non-functional product requirements (experience quality)

**NFR status:** all thresholds are _proposed product acceptance direction_, **not current measured performance**. Device mix, network profile, traffic cohorts, visual assets, legal/accessibility compliance obligations, and production monitoring must be determined before converting them to release gates. The Head Engineering team owns technical budget/tooling choices. CX-08 will define tests, environments, evidence and exception policy.

### `CX1-NFR-001` — Responsive interaction, mobile-first

P0 critical tasks must be usable on modern phone widths without horizontal scrolling for core content, blocked CTAs or keyboard covering active field/control. Tablet and desktop should remain coherent. Layout criteria, viewport coverage and input method matrix belong to CX-03/08.

### `CX1-NFR-002` — Core Web Vitals direction

**Provisional target for real-user monitoring (when sufficient qualified data exists):**

- LCP <= **2.5 seconds** at the 75th percentile.
- INP <= **200 ms** at the 75th percentile.
- CLS <= **0.1** at the 75th percentile.

Measure separately for mobile and desktop; report route type, relevant time window, valid sample count and cohort limitations. For pre-launch with low or no field traffic, record **NOT_VERIFIED_FIELD** and execute reproducible lab/mobile throttling tests; do not claim p75 success using synthetic Lighthouse alone. Source: [Google web.dev Core Web Vitals](https://web.dev/articles/vitals). These are candidate quality goals, not an assertion that TeeStock currently passes.

### `CX1-NFR-003` — Page and interaction budgets

CX-08 must propose measurable per-template budgets for JavaScript transferred/executed, largest visual asset, route HTML/data, critical font loading, render work and long tasks after measuring a representative baseline. The budgets should aim to protect initial interaction on affordable mid-range mobile devices and constrained network conditions. **No fabricated fixed KB/CPU figure** is inserted here without engineering baseline.

### `CX1-NFR-004` — Progressive feature loading

Heavy custom design editors, personalization, live previews, carousel video, analytics widgets and AI clients must not be prerequisites for browsing normal catalog/Custom entry or using an ordinary quote form. Load features based on journey and capability state; prefer accessible low-complexity defaults and intentional graceful fallback. Require evidence that P2 feature additions do not regress P0 routes.

### `CX1-NFR-005` — Accessibility

**Proposed acceptance aim:** WCAG **2.2 Level AA** for all new customer-controlled routes, subject to appropriate expert assessment and any known third-party restrictions. Full-page interaction paths must include visible focus, logical focus order, semantic form errors, accessible names, sufficient contrast, robust touch targets, reduced-motion support, non-color-only states and predictable focus restoration. Automated tooling is supplementary, not full conformance proof. Source: [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/). No claim of current conformance is made.

### `CX1-NFR-006` — Core task availability and useful outage modes

A transient failure in a nonessential enhancement (AI assistant, analytics, recommendations, external channel status) must not block the core allowed customer action. A critical service outage must show truthful degraded state, preserve local draft when feasible and provide a viable customer recovery/human contact route; data must never be invented to maintain appearance of availability.

### `CX1-NFR-007` — Security and privacy by design

Customer/guest/org visibility, session expiry, file access and payment transitions must be threat-modeled and reviewed by the technical security owner. Public frontend must avoid leakage of PII, signed links, secrets, internal MGBOS identifiers that confer no authorization, business margin and other customers' order metadata. No customer lookup by guessable identifier alone. Payment card/regulated handling stays within the chosen approved provider model and its compliance boundary.

### `CX1-NFR-008` — Input, file and data safety

Validate public input server-side; handle file type/size/content safely under independently designed upload/storage policy. UI validation improves feedback but is not business/security correctness. Failure messages should be actionable without revealing sensitive internals. No proposal for storage provider or antivirus implementation is implied by this requirement.

### `CX1-NFR-009` — SEO and discoverability

Index only relevant public, stable, permitted commercial pages. Product availability and structured data must not promise nonexistent stock/services or produce misleading results. Include canonical URL, meaningful metadata, accessible headings and redirects for altered paths. Technical SEO gates belong to CX-03/08; marketing content policy remains under business owners.

### `CX1-NFR-010` — Localization, currency and content

Near-term language is Indonesian where suitable to target cohorts. All user-facing currency is unambiguous; rounding/tax/payment semantics follow authoritative business policy. Allow later extensibility, but avoid premature multi-region financial policy. Content/readability should target non-expert printing buyers and explain jargon contextually.

### `CX1-NFR-011` — Interruption and draft resilience

For multi-step Custom/Business requests, interruption should not require unnecessary re-entry where technically/legal feasible. Draft persistence, data retention, consent and device-sharing risks must be resolved in CX-05/08. On resumed action, stale quotes/availability must be revalidated, not reused as guaranteed.

### `CX1-NFR-012` — Observability and product event integrity

Capture anonymized/appropriately permissioned analytics for task start/completion, friction points, validation failures and manual-handoff triggers. Avoid collecting PII, artwork content or payment details into analytics indiscriminately. Correlation from customer action to governed operation should be possible with approved IDs and role-limited tools. Analytics never redefines source-of-truth state.

### `CX1-NFR-013` — Design consistency

Components, copy vocabulary, empty/loading/error/success states, spacing, typography, motion and focus semantics should be consistent across routes without forcing all experiences to look identical. Design tokens and component library authority remain with the future CX-03 contract and TeeStock existing brand identity sources; PRD does not mandate a particular CSS/UI framework.

### `CX1-NFR-014` — Cost-efficiency

Customer UX and AI/integrations should have measurable cost-to-serve impact. Avoid requiring per-visit paid AI inference for normal navigation, per-interaction unnecessary provider calls, excessive asset delivery or complex maintenance when a simpler experience achieves the same user outcome. Financial thresholds need observed workloads and owner-approved budget ceilings.

### `CX1-NFR-015` — Compatibility and recovery

Each critical journey requires an approved browser/device matrix and deterministic fallback expectations. P0 forms must remain usable without nonessential JavaScript enhancements when feasible within chosen architecture. Full no-JS checkout is not automatically promised; explicit supported mode must be documented by CX-08.

---

## 9. Product-level acceptance tests (draft contracts, NOT executed)

Each clause identifies what must be demonstrated when the corresponding capability enters a bounded delivery package. `ACCEPTED` cannot be claimed based on this document alone.

### P0 product contract

**`CX1-AC-001` — Correct intent routing**  
Given an unfamiliar mobile/desktop visitor, when they arrive through a public entry route, then they can find Shop, Custom, Business or Merch without encountering internal subsystem terminology or unreachable primary CTA. Evidence: UX task test + accessibility/browser acceptance.

**`CX1-AC-002` — Truthful capability disclosure**  
Given a currently unavailable direct checkout/configurator, when customer views an offer, then the interface does not imply it is working and offers a truthful inquiry/contact path. Evidence: static/content tests + journey review.

**`CX1-AC-003` — Structured Custom request**  
Given a valid supported Custom inquiry, when customer submits once, then an authorized traceable request and customer acknowledgement are produced with appropriate intent, relevant fields and next action. Evidence: approved integration test and response/UI proof.

**`CX1-AC-004` — Invalid and conditional form inputs**  
Given incomplete details or unsupported artwork, when submitted, then the customer sees precise remedy without losing unrelated valid inputs; no accepted order/quote/production approval is fabricated. Evidence: negative browser and API tests.

**`CX1-AC-005` — Non-final quote/date wording**  
Given an unreviewed configuration or deadline, when customer requests an estimate, then text distinguishes requested/estimated from approved commercial commitment and routes human review. Evidence: decision table/copy audit + domain integration assertion.

**`CX1-AC-006` — Retry and uncertain acknowledgement**  
Given a timeout after server-side acceptance, when the customer retries/reloads, then the system does not create an unauthorized duplicate request and can communicate safe next steps. Evidence: negative replay tests and source-level idempotency review.

**`CX1-AC-007` — Solo founder responsibility visibility**  
Given a P0 order/inquiry rehearsal, when the business processes it, then the mapped backstage workflow identifies necessary physical founder actions and demonstrates which administrative steps are no longer manually duplicated. Evidence: CX-02 service blueprint + controlled operator rehearsal.

**`CX1-AC-008` — Premium accessible initial experience**  
Given approved P0 routes and critical mobile/device matrix, when tested under CX-08 conditions, then no release-blocking accessibility/task-completion failures remain and performance is within approved evidence-based budgets. Evidence: independent browser, accessibility and lab measurements; field metrics NOT_VERIFIED until sample exists.

**`CX1-AC-009` — AI/provider optional**  
Given disabled/unavailable AI assistant or outbound notification provider, when visitor takes a permitted core inquiry action, then they can complete or receive honest safe recovery without relying on an AI answer as record of truth. Evidence: fault-injection browser/integration test.

**`CX1-AC-010` — No cross-customer information disclosure**  
Given forged/unrecognized guest/account request, when accessing protected status/quote/order data, then server-side authorization denies access without object leakage. Evidence: independently reviewed security cases against exact test revision.

### P1 gated commerce / customer self-service contract

**`CX1-AC-011` — Retail checkout integrity**  
Given an eligible product with valid price/stock, when checkout completes, then authorized order/payment outcomes are consistent with canonical MGBOS records. Evidence: hosted CI + isolated end-to-end transaction test; production payment/provider is separate approval.

**`CX1-AC-012` — Pending and failed payment honesty**  
Given a browser redirect while provider confirmation is pending or failed, when confirmation page renders, then it does not state "paid" until authorized source confirms it. Evidence: negative provider callback simulation.

**`CX1-AC-013` — Cross-account privacy**  
Given accounts A and B / organization contexts O1 and O2, when they access each other's deep links/resources, then role-scoped reads/writes deny data and changes. Evidence: genuine public actor auth negative tests, not UI-only checks.

**`CX1-AC-014` — Quote versioning and approval**  
Given an expired/revised quote or unauthorized buyer, when approval is attempted, then action is blocked or rerouted with clear explanation; accepted quote references exact authorized version. Evidence: domain and browser assertion.

**`CX1-AC-015` — Returns and support are requests, not auto-awards**  
Given product with ineligible or special-handling return, when support request is submitted, then receipt does not falsely issue credit/refund/approval. Evidence: eligibility/policy and UI review.

**`CX1-AC-016` — Customer order readability**  
Given a valid order, when customer views status, then detailed internal states are projected as safe, understandable customer messages and unavailable data remains visibly distinct. Evidence: status mapping table/negative state tests.

**`CX1-AC-017` — Reorder freshness**  
Given a historic order with changed stock or pricing, when customer reorders, then current terms are revalidated and accepted explicitly. Evidence: before/after price/availability simulation.

**`CX1-AC-018` — Marketplace deduplication**  
Given duplicate/out-of-order external order events, when ingestion occurs, then canonical order is not duplicated and failure is observable/reconcilable. Evidence: provider adapter contract & test on exact candidate.

### P2 evidence-gated capability contract

**`CX1-AC-019` — Custom builder truth**  
Given a custom configuration, when price or production suitability is displayed, then only approved deterministic combinations receive a verified price; ambiguous options route to assisted quote. Evidence: product matrix and configuration/pricing assertions.

**`CX1-AC-020` — Feature richness does not break baseline**  
Given new custom editor, AI, personalization or real-time channel integration, when baseline P0/P1 journeys are rerun, then core usability, accessibility, privacy and performance gates still pass. Evidence: regression suite and field monitoring plan.

**`CX1-AC-021` — AI governance**  
Given ambiguous high-value/refund/deadline request, when AI responds or offers an action, then it discloses uncertainty and does not take unauthorized financial/contract/production action. Evidence: adversarial evals, negative permission tests, tool-call trace.

**`CX1-AC-022` — Founder benefit after expansion**  
Given comparable order cohorts, when a feature is activated, then manual touch count, avoidable support contacts, exception false-positive and service cost are measured rather than assumed. Evidence: representative pilot/production outcome analysis; thresholds set from baseline.

**`CX1-AC-023` — Transaction resilience**  
Given lost responses, repeated requests or conflicting external statuses, when the system recovers, then it does not infer completion from UI client state and provides a reconciliation trail. Evidence: negative, concurrency/replay and recovery tests applicable to approved slice.

---

## 10. Product quality scorecard and observability

**No synthetic number represents current business performance.** The table defines what to measure, how it relates to the founder/customer promise, and conditions for calling the metric meaningful.

| Metric                               | Working definition                                                                                                         | Why                          | Initial evidence status |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------------------- |
| `CX-M01 Task completion`             | Completed valid customer job / initiated comparable eligible jobs, segmented by funnel/cohort                              | Effectiveness                | `NOT_VERIFIED`          |
| `CX-M02 Quote request completion`    | Valid accepted Custom/Business inquiries / started qualified intake attempts; keep abandon reasons                         | Friction                     | `NOT_VERIFIED`          |
| `CX-M03 Founder manual touches`      | Human administrative actions per completed eligible transaction; physical actions separate                                 | Founder capacity             | `NOT_VERIFIED`          |
| `CX-M04 Duplicate data entry`        | Count of required re-keyings of customer-submitted structured information                                                  | Automation value             | `NOT_VERIFIED`          |
| `CX-M05 Quote handling time`         | Recorded interval from complete qualified request to reviewed customer quote, excluding separately labeled waiting periods | Customer speed, founder time | `NOT_VERIFIED`          |
| `CX-M06 Customer contacts per order` | Avoidable status/questions/complaints divided by comparable fulfilled orders                                               | Self-service effectiveness   | `NOT_VERIFIED`          |
| `CX-M07 Order-to-action clarity`     | Fraction of accepted customer actions creating traceable owner/next step                                                   | Operational readiness        | `NOT_VERIFIED`          |
| `CX-M08 Return or rework friction`   | Eligible return/service requests requiring repeat customer input                                                           | Service quality              | `NOT_VERIFIED`          |
| `CX-M09 p75 Core Web Vitals`         | Mobile/desktop LCP, INP, CLS measured by route groups with valid sample metadata                                           | Performance                  | `NOT_VERIFIED_FIELD`    |
| `CX-M10 Task accessibility defects`  | Severity of independently observed critical-path failures                                                                  | Inclusive usability          | `NOT_VERIFIED`          |
| `CX-M11 False commitments`           | Unsupported price/stock/date/approval claims observed in UX or AI                                                          | Trust/financial risk         | `NOT_VERIFIED`          |
| `CX-M12 Recovery rate`               | Successful safe recovery from expected retry/error scenarios in tested journeys                                            | Resilience                   | `NOT_VERIFIED`          |
| `CX-M13 Channel margin`              | Contribution after platform fees, fulfillment and operational cost per channel using canonical figures                     | Sustainability               | `NOT_VERIFIED`          |
| `CX-M14 Provider/AI cost-to-serve`   | Actual integration/model/provider cost per eligible supported task                                                         | Capital efficiency           | `NOT_VERIFIED`          |
| `CX-M15 Repeat customer effort`      | Inputs/actions required for valid reorder vs first order, with term reconfirmation                                         | Retention/efficiency         | `NOT_VERIFIED`          |
| `CX-M16 Trust/comprehension`         | Research measure of customer understanding of price status, deadline and next step                                         | Prevent misinterpretation    | `NOT_VERIFIED`          |

### 10.1 Measurement contract

For any adoption or improvement claim, record: `metric_id`, `route/journey`, `customer_cohort`, `eligible_denominator`, `baseline_window`, `comparison_window`, `data_source`, `sample_size`, `exclusions`, `confidence/limitations`, `owner`, and `evidence_revision`. A "0 support tickets" result with no customers is not success. Similarly, 100% conversion in three self-selected tests is not broad market proof.

### 10.2 Prioritized outcome hierarchy

1. **Safety and transactional truth** before conversion optimizations.
2. **Customer task completion and understanding** before visual novelty.
3. **Founder workload reduction** before feature-count growth.
4. **Performance/accessibility consistency** before heavy interaction expansion.
5. **Unit economics and maintainability** before universal omnichannel coverage.

---

## 11. Release slices and product gates

These describe **product planning candidates**. The existing repository roadmap/Founder Control program remains authoritative until explicitly revised by the Owner and relevant engineering governance. No release date, deployment permission or implementation authorization is issued here.

### Slice `CX-S0` — Retail-led public presentation & governed assisted Custom/Business entry

**Customer value:** Discover curated apparel collections, garment fundamentals, and brand identity front-and-center per `DEC-TS-2026-011`; access clearly visible Custom and Business pathways; submit well-structured inquiries; receive truthful next steps; avoid dead ends. **Founder value:** Establish premium brand positioning while capturing structured customer requirements into the MGBOS operational spine (`DEC-TS-2026-009`) without manual transcription. **Not required in S0:** integrated direct checkout, instant binding quotes, real-time marketplace stock, elaborate custom editor, customer-portal suite.

**Nontransactional retail boundary:** Retail presentation in CX-S0 encompasses curated catalog display, lookbooks, collection storytelling, and garment quality education. It is strictly non-transactional: it does not imply live stock availability, cart checkout, payment processing, or automated inventory reservation. Transactional retail is explicitly gated in `CX-S1`.

**Proposed included:** `FR-001..005` (incorporating retail discovery and job routing), `FR-009..015` where authorized and viable, `FR-029..030` if secure status is implemented, `FR-038..040`, cross-cutting NFR and P0 acceptance. **Important:** Even `FR-030` secure status is subject to identity readiness and may initially be fulfilled through an approved authenticated/manual communication mechanism rather than a self-serve portal.

**Entry dependencies:** curated apparel collection assets and brand copy, final customer offer menu, approved contact/quote policies, compatible MGBOS lead/requirement write contract, input/upload review, security/privacy and error handling; retail presentation does not create a prerequisite for the independent Business/Custom operational pilot.

**Exit evidence:** accepted P0 tasks on representative devices (verifying both retail discovery comprehension and assisted intake completion); negative duplicate/authorization/upload tests; qualitative comprehension test confirming users perceive retail excellence and can easily reach Custom/Business; known founder manual steps; performance and accessibility lab reports; product copy does not claim unavailable functions or functioning checkout.

### Slice `CX-S1` — Customer-controlled retail and order visibility

**Customer value:** Browse sellable catalog, place eligible orders, see true payment/order status, request support and reorder when safe. **Founder value:** Reduced repetitive updates/data entry. **Not required:** real-time every-channel synchronization, multi-agent autonomy or full 3D configurator.

**Entry dependencies:** product/SKU/cost/price inventory truth, secure checkout/payment provider and customer identity boundaries, recovery/idempotency, owner-approved service/return policy, release environment evidence.

**Exit evidence:** independent real browser acceptance on exact candidate, transaction negative paths and reconciliation, actual provider agreement/access, representative pilot outcome metrics.

### Slice `CX-S2` — Extended self-service and selective omnichannel

**Customer value:** Quote versioning/approval, account tracking and legitimate repeats, selected channel coverage, optional grounded support. **Founder value:** More exceptions resolved through governed workflows without extra handling.

**Entry dependencies:** repeated customer demand, proof that self-service is less work, per-channel business economics, approved public account/org authorization, provider access, valid support/returns model.

**Exit evidence:** channel duplicate/out-of-order tests, valid org/case authorization negative tests, customer satisfaction and per-order workload comparisons.

### Slice `CX-S3` — Advanced intelligent commerce/custom production experience

**Customer value:** Rich guided custom builder, advanced previews, intelligent assistance, personalization and sophisticated multi-channel experiences. **Founder value:** Low-touch standard configuration and governed exception management.

**Entry dependencies:** standardized sellable and producible configurations; deterministic pricing and production recipe eligibility; artwork revision/version rules; approved AI evals and tool authority; measured cost and performance; stable inventory/transaction integrations.

**Exit evidence:** no unsupported auto-commitments, accessibility/fallback equivalence, cross-channel reconciliation, measured cost-to-serve, no regression of fast baseline journeys.

### 11.1 Promotion gate across all slices

`OWNER_PRODUCT_DIRECTION → CANONICAL_SOURCE_RECONCILIATION → HEAD_ENGINEERING_FEASIBILITY_AND_SECURITY → BOUNDED_SCOPE_APPROVAL → EXACT_SOURCE_IMPLEMENTATION → INDEPENDENT_QA/EVIDENCE → DEPLOYMENT_READINESS → EXPLICIT_RELEASE_APPROVAL`.

No single CI green mark, attractive demo or complete PRD skips a gate. Validation in isolated test environments does not imply pilot/production authorization.

---

## 12. Non-goals, exclusions and explicit deferrals

1. This PRD **does not replace** Founder Control or reopen its approved ongoing PRs.
2. It **does not authorize** a parallel MGBOS database, commerce ledger or speculative ERP domain.
3. It **does not require** a complete storefront before the current Business/Custom assisted-sales pilot.
4. It **does not create** public AI with autonomous money, refund, credit, contract or production-promise authority.
5. It **does not require** all marketplace APIs or real-time stock synchronization in the first release.
6. It **does not require** 3D/AR custom design tools, advanced live render, full dynamic pricing or complex loyalty in the first release.
7. It **does not imply** every customer must register an account to ask for a quote or complete eligible guest purchase.
8. It **does not include** creator, affiliate, reseller or partner management back-office portals. Their links and marketing entrypoints may be presented in IA if currently relevant, but separate actor products need separate definition.
9. It **does not specify** MultiGraph general printing frontend or all sister brands, though a future shared experience framework may reuse patterns.
10. It **does not choose** infrastructure provider, frontend framework, component package, API endpoint, database schema or AI model.
11. It **does not certify** accessibility/performance/production readiness before measured tests.
12. It **does not claim** external marketplace integration rights, website live deployment or existing customer data.
13. It **does not choose** commercial terms or actual product combinations for launch beyond what authoritative business sources already approve.
14. It **does not supersede** brand strategy/visual identity, commerce economics or canonical technical architecture.
15. It **does not make** speculative release-date promises or approve new spend.

---

## 13. Product dependency and canonical ownership map

| Concern                                             | Upstream owner (do not redefine)                                               | CX-01 representation                                        | Downstream contract                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------- |
| Brand character and identity                        | `bisnis/teestock/02-brand/`                                                    | Experience expectations; no new logo/color policy           | CX-03                                                 |
| Homepage, job paths, public IA                      | `bisnis/teestock/10-product-tech/website-information-architecture.md`          | Customer outcomes and surface scope                         | CX-02/03                                              |
| Assortment, labels, product sellability             | `bisnis/teestock/03-commerce/`                                                 | Valid product discovery requirements                        | CX-04                                                 |
| Business pricing, discounts and commercial policy   | `bisnis/teestock/08-finance/pricing-framework.md`, `04-services/`              | Truthful price, terms and review UX                         | CX-04/05                                              |
| Payment, ledger, refunds, business commands         | `systems/mgbos/docs/architecture/`                                             | Safe customer presentation and authorization outcomes       | Engineering contract after architecture impact review |
| Inventory availability and production               | TeeStock `07-operations/` and MGBOS canonical model                            | Valid stock/lead-time display and customization eligibility | CX-04/05                                              |
| Core identity and organization isolation            | MGBOS permission/auth ownership                                                | Customer/guest/buyer authorization UX requirement           | CX-06/08, independent security review                 |
| Customer service/return eligibility                 | `bisnis/teestock/07-operations/customer-service.md`, `returns-and-warranty.md` | Status/help/return request UX                               | CX-06                                                 |
| Marketplace roles and commercial feasibility        | `bisnis/teestock/09-marketing/channel-strategy.md`, commerce platform          | Customer expectation and source-preservation requirements   | CX-07                                                 |
| Channel adapter, retries, settlement implementation | Existing MGBOS architecture, integration boundary                              | Product desired consequences and recovery                   | CX-07 -> Head Engineering                             |
| AI autonomy, execution permissions, tool semantics  | JARVIS docs + MGBOS authorization + root governance                            | Optional assistance, uncertainty and escalation             | CX-06/08 -> JARVIS/Head Engineering                   |
| Founder attention / operational exceptions          | Existing Founder Control D0-D4 and MGBOS domain authority                      | Manual action reduction, correct backstage handoff          | CX-02/09                                              |
| Launch gating / production readiness                | `docs/roadmaps/solo-founder-launch-roadmap.md`, MGBOS readiness and governance | Proposal for customer-specific slices only                  | CX-09 -> Owner/Head Engineering                       |

### 13.1 Forward-only reconciliation rule

When CX-01 requirements conflict with a canonical source, **do not patch or override the canonical source within CX-01**. Classify the matter as: `SEMANTIC_CONFLICT`, `PRODUCT_TRADEOFF`, `TECHNICAL_CONSTRAINT`, `OUTDATED_CURRENT_SNAPSHOT`, `PROVIDER_DEPENDENCY`, or `OWNER_DECISION`. Route it to the source owner with a proposed decision. Existing intended rules remain in force unless formally changed.

### 13.2 Interface architecture is not committed by this document

The desired high-level interaction is `CUSTOMER UI → AUTHORIZED PUBLIC APPLICATION INTERFACE → GOVERNED MGBOS BUSINESS CAPABILITY → VERIFIED BUSINESS RESULT → SAFE CUSTOMER VIEW`, with automation/AI/provider effects attached through explicitly approved boundaries. This is an **experience ownership principle**, not an API schema, backend architecture or microservice choice. Existing MGBOS modular-monolith direction is preserved until Head Engineering evaluates justified change.

---

## 14. Owner decision register

The following proposals are _drafting defaults_. Explicit owner approval of CX-01 does not automatically approve spending, implementation, deployment, changed financial policies, or wider autonomy.

| ID            | Product decision or tension           | Proposed default                                                                                  | Owner action trigger                                  |
| ------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `CX1-DEC-001` | What defines premium?                 | Fast, clear, trustworthy, effortless, visually refined; do not optimize novelty over task success | Approve/change North Star                             |
| `CX1-DEC-002` | First business validation route       | Retain existing Business/Custom assisted-sales pilot                                              | Only decide if changing canonical roadmap             |
| `CX1-DEC-003` | First public customer release         | High-quality entry, Custom/Business inquiry, honest next steps; no fake checkout                  | Approve before engineering planning                   |
| `CX1-DEC-004` | Full retail checkout as P0?           | No automatic prerequisite; P1 dependent on core truth and provider readiness                      | Owner if revenue strategy warrants different ordering |
| `CX1-DEC-005` | Custom builder at first launch?       | No; structured request first, governed builder later                                              | Owner if changing scope and funding                   |
| `CX1-DEC-006` | Guest vs mandatory account            | Prefer low-friction guest inquiry, account only when warranted by security/business need          | Approve customer policy with privacy/security review  |
| `CX1-DEC-007` | Customer portal breadth               | Start with status/help; expand after demonstrated repeat customer demand                          | Owner product phase selection                         |
| `CX1-DEC-008` | First marketplace integration         | Undecided; determine from channel contribution, actual rights and operational workload            | Owner selects channel after CX-07 discovery           |
| `CX1-DEC-009` | Frontend visual expression            | Reference existing TeeStock brand identity; CX-03 proposes interaction grammar not new brand      | Owner on significant visual identity changes          |
| `CX1-DEC-010` | Accessible quality target             | WCAG 2.2 AA proposed with testable full-journey methodology                                       | Owner and compliance/engineering acceptance           |
| `CX1-DEC-011` | Performance target                    | Core Web Vitals good thresholds proposed; per-template budgets after baseline                     | Head Engineering/Owner budget discussion              |
| `CX1-DEC-012` | AI customer assistant first release   | Not required; deterministic flow/manual fallback wins first                                       | Owner if AI is considered business-critical initially |
| `CX1-DEC-013` | MultiGraph reuse                      | Shared principles possible, but MultiGraph customer PRD is separate                               | Owner for future portfolio scope                      |
| `CX1-DEC-014` | Does PRD approval open builder scope? | No, explicit engineering work package required                                                    | Always maintain approval boundary                     |

**Current disposition:** All entries are `PROPOSED` unless an upstream canonical source already makes the decision. `DEC-002`, for example, **restates the existing assisted-sales pilot boundary**, not a brand-new strategic ruling. No Owner decision is presumed merely because this file exists.

---

## 15. Assumptions, research unknowns and risks

### 15.1 Unknown register

| ID           | Unknown                                                                 | Why material                                                           | Evidence needed                                                    | Accountable discipline    |
| ------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------- |
| `CX1-UNK-01` | Actual priority customer segments and early demand split                | Determines whether custom/business or retail receives initial UX depth | Interviews, inbound inquiry patterns, real transactions            | Owner/Product             |
| `CX1-UNK-02` | Exact launch sellable assortment and cost/margin                        | Product detail, availability and checkout cannot be truthful otherwise | Approved offer/product list, cost/pricing policy, vendor readiness | Business/Owner            |
| `CX1-UNK-03` | Public identity model, guests, privacy and org boundaries               | Critical security and data exposure risk                               | Existing auth contracts + threat model + tests                     | Head Engineering/Security |
| `CX1-UNK-04` | Reliable actual artwork types, allowed sizes and QC workflow            | Determines upload, preview and rework rate                             | Print/sample specs, file handling decisions, legal/IP review       | Business/Production       |
| `CX1-UNK-05` | Realistic performance baseline and user devices                         | Avoids ornamental speed promises and unrealistic budgets               | Representative instrumented build and device/network profiles      | UX/Frontend/QA            |
| `CX1-UNK-06` | Real-world quote time and founder manual touch baseline                 | Determines ROI and release priorities                                  | Controlled operator rehearsals, live pilot timing                  | Owner/Product Ops         |
| `CX1-UNK-07` | Customer comprehension of price estimate and deadline                   | Prevents conversion-by-confusion                                       | Moderated usability tests and inquiry transcripts                  | UX/Product                |
| `CX1-UNK-08` | Marketplace permissions, API access, seller obligations and rate limits | Integration feasibility varies by channel                              | Provider documentation/account eligibility and sandbox             | Integration/Business      |
| `CX1-UNK-09` | Payment, logistics, WhatsApp provider capability/cost                   | Critical channel/transaction dependencies                              | Contract/access, sandbox, economic viability                       | Head Engineering/Business |
| `CX1-UNK-10` | Real support/returns frequency and patterns                             | Sets portal and self-service priorities                                | Customer cohort/real issue classification                          | Business/Product          |
| `CX1-UNK-11` | Source/component reuse potential from archived TeeStock V1              | Could speed delivery but stale dependencies may carry risks            | Read-only review with dependency/license/security evaluation       | Head Engineering          |
| `CX1-UNK-12` | Future MultiGraph platform commonality                                  | Avoids overabstracting TeeStock prematurely                            | Dedicated MultiGraph customer jobs and revenue process research    | Portfolio Product         |
| `CX1-UNK-13` | Customer demand for advanced 2D/3D custom preview                       | Potential high cost and false production expectation                   | Task testing, willingness-to-pay, revision/rework evidence         | Product/Design            |
| `CX1-UNK-14` | Accessibility/legal requirements of third-party components              | May block release despite internal UI compliance                       | W3C assessment, provider reviews, legal as applicable              | QA/Legal                  |
| `CX1-UNK-15` | Source SHA and active PR changes before PRD integration                 | Could invalidate current gaps and routing                              | Fresh `main`/PR review and semantic diff                           | Head Engineering          |

### 15.2 Risk register

| ID            | Risk                                                            | Impact                                 | Mitigation / stop condition                                              |
| ------------- | --------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| `CX1-RISK-01` | "Premium" becomes visually heavy, slow or inaccessible          | Loss of conversion/trust/mobile reach  | CX-03/08 budgets, field/lab proof, progressive loading                   |
| `CX1-RISK-02` | Massive launch scope delays first business validation           | Burnout, delay, capital risk           | Controlled P0, evidence-gated P1/P2, no raw PRD builder handoff          |
| `CX1-RISK-03` | Public interface bypasses MGBOS transaction invariants          | Financial/security integrity           | Head Engineering review, approved commands, independent negative tests   |
| `CX1-RISK-04` | AI offers unverified price/date/refund promise                  | Customer harm, cost/claim risk         | Deterministic facts, no autonomous high-risk actions, evals + escalation |
| `CX1-RISK-05` | Marketplace/webhook replay duplicates order/payment             | Loss, ops confusion                    | Idempotency, correlation, reconciliation and tested manual fallback      |
| `CX1-RISK-06` | Upload, account or guest access leaks sensitive data            | Privacy/security harm                  | Threat model, scoped permissions, private storage policy, abuse tests    |
| `CX1-RISK-07` | Overautomation forces founder to babysit systems                | No operational efficiency              | Manual touch count, actionable exceptions, cost-to-serve metrics         |
| `CX1-RISK-08` | Static/historical information displayed as real-time truth      | False availability/commitments         | Freshness and confidence labels, source-owned status projection          |
| `CX1-RISK-09` | Documentation duplicates commerce policy or scope               | Conflicting AI interpretation          | Source mapping, reference-not-copy, one semantic owner                   |
| `CX1-RISK-10` | Public customer experience is mistaken for deployment-readiness | Premature live financial flows         | Release and operational readiness gates; no PRD-to-prod promotion        |
| `CX1-RISK-11` | Internal MGBOS and public TeeStock UI evolve inconsistently     | Rework and brittle integrations        | Explicit capability contracts, cross-project impact review               |
| `CX1-RISK-12` | One-size-fits-all retail/custom/B2B flow                        | User frustration and false assumptions | Separate intent journeys and conditional routing                         |

**Risk governance:** this is a product risk description, not a replacement for BisnisHub's formal engineering risk classification. Head Engineering determines any R-classification and security assurance obligations at the work-package stage.

---

## 16. Downstream documentation routing (CX-02..CX-09)

The following docs may be created only after CX-01 semantic review and scope agreement. They should not restate master requirements in full; they refine them with traced acceptance details.

| Document                                        | Owns                                                                                | Consumes CX-01 requirements                                       | Must deliver / major prohibitions                                                                                               |
| ----------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `CX-02 — Customer Journeys & Service Blueprint` | Service journeys and frontstage/backstage handoffs                                  | `FR-001..005`, `009..015`, `029..030`, `038..040`, `044`; `JRN-*` | Detailed persona scenarios, decision table, founder physical vs software vs AI swimlanes, duplicate effort; no new domain model |
| `CX-03 — Experience Design & Interaction Spec`  | Layout and interaction quality, tokens ownership, responsiveness, accessible states | `FR-001..008`, `010`, `NFR-001..005`, `013`                       | Component behavior, design constraints, error/empty/loading patterns, prototypes; no unilateral brand rewrite                   |
| `CX-04 — Commerce & Checkout Experience`        | Customer-facing retail transaction journey                                          | `FR-006..008`, `020..028`, `BR-001..005`, `AC-011..012`           | Cart/checkout behavior, failure matrix, validation; no ledger/pricing reimplementation                                          |
| `CX-05 — Custom & B2B Ordering Experience`      | Custom/business request, quote, proofs, configuration eligibility                   | `FR-009..019`, `034`, `BR-002`, `BR-006`                          | Field sets, versioned quote/artwork interactions, upgrade gates; no unsupported instant price promise                           |
| `CX-06 — Customer Account & Service Experience` | Secure customer status, support/returns, reorder, AI-facing help UX                 | `FR-029..037`, `042..043`                                         | Scoped views, user-friendly states, permissions questions, service recovery; no new case/refund authority                       |
| `CX-07 — Omnichannel Integration Requirements`  | Channel experience consistency and business dependency requests                     | `FR-040..042`, `045`, `BR-008`, `BR-011`, `AC-018`                | External ID, source labels, retries, economic/adaptor readiness matrix; no invented platform API rights                         |
| `CX-08 — Experience Quality & Acceptance`       | Acceptance matrix, browser/visual/accessibility/performance/security evidence       | All `NFR-*`, `AC-*`, critical negative scenarios                  | Measured thresholds, reproducible environments, CI, manual assessment; no unverified PASS                                       |
| `CX-09 — Phased Delivery & Validation Plan`     | Product slices, research/pilot and outcome gates                                    | `CX-S0..S3`, scorecard, risk/unknown register                     | Exit criteria, human/customer evidence, cost-benefit; does not override existing roadmap without Owner decision                 |

### 16.1 Detailed flow hierarchy for future CX-02

1. `DISCOVERY`: homepage / channel entry -> correct path -> intent decision.
2. `EXPRESSION`: product discovery or Custom/Business requirement -> validation -> summary.
3. `COMMITMENT`: inquiry submitted / versioned quote / authorized order or payment according to flow.
4. `FULFILLMENT`: clear customer state while backend performs real procurement, production, QC and shipping.
5. `CARE`: questions, changes, claims, returns, repeat purchase.
6. `OPERATIONAL HANDOFF`: an actual founder physical task vs delegated system/AI task, with exception visibility.

This hierarchy is intentionally **not** a mandate to place six navigation tabs into the website.

### 16.2 Requirements traceability starter matrix

| CX-00 finding / candidate | New CX-01 primary owner                                                    | Upstream source family                   |
| ------------------------- | -------------------------------------------------------------------------- | ---------------------------------------- |
| `CXF-01 / CAND-01`        | `FR-001..005`, `XP-01..05`                                                 | Digital Product Vision; Website IA       |
| `CXF-02`                  | Snapshot and `FR-002`; product gap remains unresolved until implementation | Active TeeStock source                   |
| `CXF-03 / CAND-12`        | `NFR-001`, `004`, `005`, `013`; `XP-02`, `XP-07`                           | Website IA; brand identity               |
| `CXF-04 / CAND-13`        | `NFR-002..005`, `AC-008`, `AC-020`                                         | Digital Product Vision; web.dev; W3C     |
| `CXF-05 / CAND-18`        | `CX-S0..S3`, `DEC-002..005`                                                | Solo-Founder Roadmap; Pilot Plan         |
| `CXF-06 / CAND-04..07`    | `FR-009..019`, `AC-004..005`, `AC-014`, `AC-019`                           | Custom/Business; Commerce Platform       |
| `CXF-07 / CAND-14`        | `FR-041`, `045`, `AC-018`                                                  | Commerce Platform; MGBOS Integration     |
| `CXF-08 / CAND-09..11`    | `FR-029..037`, `BR-004`, `BR-009`, `AC-010`, `AC-013`, `AC-016`            | Customer Service/Returns; MGBOS Security |
| `CXF-09 / CAND-16..17`    | `FR-040`, `043`, `046`, `AC-009`, `AC-021`                                 | Automation Architecture; JARVIS; MGBOS   |
| `CXF-10`                  | Section 13 authority map / integration gate                                | Documentation Constitution / Source Map  |
| `CXF-11 / CAND-15`        | `FR-038..040`, scorecard `CX-M03..M04`, `AC-007`, `AC-022`                 | Founder Control; Solo-Founder Roadmap    |

---

## 17. Source register (stable audit references)

All GitHub links below are pinned to the inspected `main` commit for evidence repeatability. They identify _source material_, not necessarily current deployed functionality. Review the updated HEAD and authoritative source map before publishing this PRD.

**Governance and operating direction**

- [G-01 Documentation Constitution](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/governance/documentation-constitution.md)
- [G-02 Canonical Source Map](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/governance/canonical-source-map.md)
- [G-03 Solo-Founder Operating Model](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/operating-model/solo-founder-operating-system.md)
- [G-04 Solo-Founder Launch Roadmap](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/roadmaps/solo-founder-launch-roadmap.md)
- [G-05 BisnisHub Master System Blueprint](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/architecture/master-system-blueprint.md)

**TeeStock business/product upstream**

- [B-01 Digital Product Vision](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/digital-product-vision.md)
- [B-02 Website Information Architecture](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/website-information-architecture.md)
- [B-03 Commerce Platform](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/commerce-platform.md)
- [B-04 Automation Architecture](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/automation-architecture.md)
- [B-05 Custom Service](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/04-services/custom.md)
- [B-06 Business Service](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/04-services/business.md)
- [B-07 Commerce Overview](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/03-commerce/commerce-overview.md)
- [B-08 Customer Service](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/07-operations/customer-service.md)
- [B-09 Returns & Warranty](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/07-operations/returns-and-warranty.md)
- [B-10 Fulfillment](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/07-operations/order-fulfillment.md)
- [B-11 Pricing Framework](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/08-finance/pricing-framework.md)
- [B-12 Channel Strategy](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/09-marketing/channel-strategy.md)
- [B-13 MGBOS Integration](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/11-data-mgbos/mgbos-integration.md)
- [B-14 TeeStock Master Roadmap](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/14-roadmap/master-roadmap.md)

**MGBOS/JARVIS authority**

- [A-01 MGBOS Domain Map and Capability Ownership](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/architecture/domain-map-capability-ownership.md)
- [A-02 MGBOS Canonical Data Model](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/architecture/canonical-data-model.md)
- [A-03 MGBOS Business State Machines](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/architecture/business-state-machines.md)
- [A-04 MGBOS Permissions / Authorization](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/architecture/permission-authorization-model.md)
- [A-05 Founder Control PRD](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/product/teestock-founder-control-prd.md)
- [A-06 TeeStock Operational Pilot Plan](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/product/teestock-operational-pilot-plan.md)
- [A-07 JARVIS Charter](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/jarvis/docs/charter.md)

**Active source-level observations**

- [S-01 TeeStock homepage](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/apps/teestock/src/app/page.tsx)
- [S-02 TeeStock Custom placeholder](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/apps/teestock/src/app/custom-atelier/page.tsx)
- [S-03 TeeStock app root routes](https://github.com/Rizkybuilds/bisnishub/tree/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/apps/teestock/src/app)
- [S-04 Shared integrations reserved boundary](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/packages/integrations/src/index.ts)
- [S-05 AI reserved boundary](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/packages/ai/src/index.ts)
- [S-06 UI reserved boundary](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/packages/ui/src/index.ts)

**External quality reference (not current-system evidence)**

- [Google — Web Vitals](https://web.dev/articles/vitals): p75 Core Web Vitals interpretation, field vs lab distinction.
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/): testable accessibility success criteria/conformance.

---

## 18. Internal PRD quality checklist and handoff status

### 18.1 Content integrity review (author self-check, not independent QA)

- [x] Explicit product problem, target experience, customers and actor jobs.
- [x] Existing business vision preserved and separated from new product requirements.
- [x] Current implementation claims pinned to exact reviewed source revision and limited scope.
- [x] Founder Control and assisted-sales pilot boundaries preserved.
- [x] P0/P1/P2 capability distinctions and staged product slices defined.
- [x] Functional requirements have stable _draft_ IDs and acceptance obligations.
- [x] Cross-cutting rules prevent false pricing, stock, deadline and AI promises.
- [x] Customer errors, timeouts, file problems and external event replay have proposed recovery outcomes.
- [x] Proposed performance/accessibility direction includes evidence distinction; no fabricated existing scores.
- [x] Solo-founder physical execution and administrative offloading both represented.
- [x] User/customer/guest/organization identity treated as a security dependency, not an existing guarantee.
- [x] Platform integration and JARVIS semantics defer to existing owners.
- [x] Source register and mapping from CX-00 candidates present.
- [x] Unknowns, risks, owner decisions and release evidence gates disclosed.
- [x] MultiGraph and participant portals explicitly remain outside this PRD.
- [x] No code, GitHub PR, merge, production database, provider credential or deployment change performed by drafting this file.

### 18.2 Before promotion from DRAFT to ACTIVE

- [ ] Re-check current `main` SHA, CX-00 source claims and PR #73 documentation-entrypoint overlap; update source baseline if warranted.
- [ ] Product peer review of requirement normalization: no duplicate or contradictory normative requirements with business, MGBOS or JARVIS sources.
- [ ] Owner reviews and approves actual product scope/non-goals and any roadmap deviation; unresolved business decisions remain explicit rather than guessed.
- [ ] Determine final canonical ID, location, and route/reading order with Source Map and MGBOS Product Index, including relative link validity.
- [ ] Confirm accessibility/compliance intent with appropriate specialists; final test devices and quality budgets with Frontend/QA.
- [ ] Confirm each P0 public write action's governance and actor auth feasibility before it becomes a release commitment.
- [ ] Create CX-02..09 only as dependent specifications with traceability, not as parallel versions of commerce strategy.
- [ ] Head Engineering performs architecture impact/discovery and proposes bounded IC/WP with Owner authorization before any implementation.

### 18.3 Acceptance of this drafting task

`DOCUMENT_DRAFT_COMPLETENESS`: **SELF_REVIEWED** (see checklist).

`INDEPENDENT_PRODUCT_QA`: **NOT_PERFORMED**.

`OWNER_PRODUCT_APPROVAL`: **PENDING**.

`CANONICAL_INTEGRATION`: **NOT_PERFORMED**.

`TECHNICAL_FEASIBILITY`: **NOT_VERIFIED for newly proposed capabilities**.

`IMPLEMENTATION / TEST / DEPLOYMENT`: **NONE AUTHORIZED**.

### 18.4 Exactly one next document

**`CX-02 — Customer Journeys & Service Blueprint`** should be drafted next, using the `JRN-*` scenarios and `CX1-FR-*` traceability from this PRD. CX-02 must explicitly map actions to **customer / frontend / MGBOS / deterministic automation / optional AI / founder physical work / external vendor/provider**, and test that founder workload actually decreases without making promises the business cannot meet.

**Stop before builder handoff.** Product documents are not executable instructions for Antigravity. Route to Head Engineering only after product and source authority checks.

---

_Prepared 2026-10-16, Asia/Jakarta. Product planning proposal, not a canonical engineering mandate. Source proof is revision-bound; business outcome proof requires actual controlled validation._

---

## CX-REM-R1 — governed package traceability correction (draft, non-authoritative)

- The complete bidirectional mapping of **all 46** `CX1-FR-001..046` lives in [`CX-PKG-TRACE-R1.csv`](CX-PKG-TRACE-R1.csv): parent ID, exact existing child ID(s), existing acceptance case, candidate delivery slice, and approval/verification status.
- Prior incomplete direct-reference counting (26/46) must not be read as missing feature coverage. All 46 rows now have exact declared downstream IDs, but **semantic verification is an author self-review, not independent acceptance**.
- Stage and priority interpretation is refined in [`CX-PKG-STAGE-CROSSWALK-R1.md`](CX-PKG-STAGE-CROSSWALK-R1.md). `P0/P1/P2` are requirement priority; `CX-S0..S3` are customer-product slice gates, not implementation approvals.
- Package-wide `R1` status: `DRAFT`, `NOT_AUTHORIZED_FOR_DIRECT_BUILDER_HANDOFF`, source and engineering risk governance remain authoritative.
- Unresolved Owner/product tradeoffs, including master P1 optional AI versus proposed detail P2, belong to [`CX-PKG-DECISIONS-R1.md`](CX-PKG-DECISIONS-R1.md). Do not silently change priorities.
