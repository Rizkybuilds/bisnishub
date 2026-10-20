---
canonical_id: proposed.mgbos.product.teestock-customer-platform.cx-02
status: ACTIVE
version: 0.1.1
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: Rizky
scope: teestock-customer-platform-customer-journeys-service-blueprint
document_class: product-specification
normative_authority: CANONICAL_PRODUCT_SPECIFICATION
product_program: PROPOSED_TEESTOCK_CUSTOMER_EXPERIENCE_COMMERCE
product_maturity: PROPOSED_SERVICE_EXPERIENCE_CONTRACT
engineering_readiness: NOT_READY_FOR_ENGINEERING
implementation_status: PRODUCT_DEFINITION_ONLY
repository: Rizkybuilds/bisnishub
repository_branch: main
source_baseline_commit: 2800c474563309bda49d84d712f79b68c9dde36a
source_baseline_checked: 2026-10-16
source_inspection: focused_document_and_source_audit_not_complete_runtime_test
created: 2026-10-16
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md
supersedes: null
remediation_package: CX-REM-R1
remediation_review: AUTHOR_SELF_REVIEW_NOT_INDEPENDENT
companion_drafts:
  - cx-00-source-gap-audit.md
  - cx-01-master-prd.md
proposed_authoritative_for_after_approval:
  - teestock_customer_journey_outcomes_and_handoffs
  - customer_frontstage_to_internal_backstage_visibility
  - founder_physical_versus_administrative_work_distinction
  - customer_recovery_and_safe_fallback_expectations
  - journey_level_acceptance_scenarios_and_measurement
not_authoritative_for:
  - tee_stock_commercial_prices_discount_moq_or_promise_policies
  - mgbos_entity_or_state_machine_definitions
  - financial_payment_or_transaction_authority
  - production_qc_or_shipment_semantics
  - physical_schema_rpc_api_or_connector_contracts
  - jarvis_agent_tool_or_autonomy_permissions
  - customer_identity_and_access_policy
  - production_deployment_or_provider_readiness
  - changes_to_founder_control_or_operational_pilot_scope
  - implementation_approval_or_work_package
source_dependencies:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/architecture/master-system-blueprint.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - docs/operating-model/solo-founder-operating-system.md
  - bisnis/teestock/10-product-tech/digital-product-vision.md
  - bisnis/teestock/10-product-tech/website-information-architecture.md
  - bisnis/teestock/10-product-tech/commerce-platform.md
  - bisnis/teestock/10-product-tech/automation-architecture.md
  - bisnis/teestock/04-services/custom.md
  - bisnis/teestock/04-services/business.md
  - bisnis/teestock/07-operations/operating-model.md
  - bisnis/teestock/07-operations/order-fulfillment.md
  - bisnis/teestock/07-operations/customer-service.md
  - bisnis/teestock/07-operations/returns-and-warranty.md
  - bisnis/teestock/08-finance/pricing-framework.md
  - bisnis/teestock/09-marketing/channel-strategy.md
  - bisnis/teestock/11-data-mgbos/mgbos-integration.md
  - systems/mgbos/docs/architecture/domain-map-capability-ownership.md
  - systems/mgbos/docs/architecture/business-state-machines.md
  - systems/mgbos/docs/architecture/business-invariants.md
  - systems/mgbos/docs/architecture/permission-authorization-model.md
  - systems/mgbos/docs/product/teestock-founder-control-prd.md
  - systems/mgbos/docs/product/founder-attention-experience-spec.md
  - systems/mgbos/docs/product/operational-exception-spec.md
  - systems/mgbos/docs/product/teestock-operational-pilot-plan.md
  - systems/jarvis/docs/charter.md

effective_from: 2026-10-20---

# CX-02 — TeeStock Customer Journeys & Service Blueprint v0.1.1

> **DRAFT / PRODUCT DESIGN ONLY / READ-ONLY REPOSITORY INVESTIGATION.** This is a proposed downstream service-experience specification derived from CX-01. It is **not** an amendment to canonical business policy, the governed MGBOS data model, operational pilot scope, JARVIS authority or Head Engineering work packages. Source observations are tied to commit `2800c474563309bda49d84d712f79b68c9dde36a`; live usability, payment provider behavior, customer analytics, production operations and all proposed journeys remain **NOT_VERIFIED** unless separate exact-revision evidence exists.

## 0. Executive service-design contract

**Objective:** Transform eight CX-01 customer journeys into observable handoffs between customers, TeeStock public surfaces, governed MGBOS capabilities, deterministic automation, optional AI, external providers, and the solo founder's real-world physical work.

**Outcome:** A buyer experiences one coherent, premium and understandable service; the founder experiences fewer avoidable administrative interruptions without disguising physical labor, increasing business risk, or inventing unsupported automation.

**North Star:** **Customer self-service should reduce customer effort and founder administration, not transfer work or uncertainty to either party.**

**First public presentation & controlled path:** Per strategic decision `DEC-TS-2026-011`, TeeStock's public customer presentation is retail-first: curated graphic apparel collections, product presentation, discovery, and brand identity are front-and-center. Concurrently, Custom and Business pathways remain clearly visible, discoverable, and directly accessible from navigation and prominent entry points. Operational execution priority remains governed by active decision `DEC-TS-2026-009` (Business/Custom Lead → Quote → Order/Project → Production → QC → Fulfillment → Cost/Cash). Public retail discovery in initial presentation (`CX-S0`) is strictly non-transactional: no live cart, checkout, payment gateway, or inventory reservation is active without independent operational and financial verification. Transactions in early phases may begin through approved assisted inquiries; a complete public storefront or live checkout is **not** a precondition to the existing bounded pilot.

**Long-term direction:** Premium discovery → guided expression → truthful commitment → progress visibility → service/recovery → reliable repeat. Each stage is defined now and only implemented once its technical, policy, financial and operational readiness gates are satisfied.

### 0.1 Precise interpretation of this document

| Marker           | Meaning                                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `P0`             | Proposed definition for a high-quality customer-entry/assisted-sales experience; not an implementation assertion or mandatory gate for the existing Business/Custom operational pilot |
| `P1`             | Defined self-service/retail expansion, gated by canonical transaction truth, authorization and proven readiness                                                                       |
| `P2`             | Advanced configuration, AI or omnichannel experience; optional and evidence-gated                                                                                                     |
| `HUMAN`          | Founder/person must perform a physical act, commercial decision or authority-bearing review unless genuine alternative evidence exists                                                |
| `SYSTEM`         | Candidate deterministic software behavior only when approved application functionality exists                                                                                         |
| `AI?`            | Optional, non-authoritative assistant; provider/tool/consent boundaries must be approved separately                                                                                   |
| `EXTERNAL`       | Channel, vendor, carrier or payment service; no provider availability/contract is assumed                                                                                             |
| `CURRENT_SOURCE` | Observed within files at audited commit; not the same as operational effectiveness                                                                                                    |
| `NOT_VERIFIED`   | No adequate executed/runtime/business proof; never translated to PASS by presence in this PRD                                                                                         |
| `BLOCKED`        | Cannot be promised or activated unless its owner-specific guard is satisfied                                                                                                          |

### 0.2 Product constraints inherited from CX-01

- **Customer:** abundant capabilities must be discoverable progressively, not dumped onto one screen; core steps must work on mobile and via accessible controls.
- **Truth:** a submitted inquiry is not a quote, a quote is not an order, a payment redirect is not a payment confirmation, an uploaded file is not an approved proof, and a carrier handoff is not necessarily delivery.
- **Authority:** MGBOS retains governed customer, requirement, quote, order, payment, production, QC, and shipment semantics. No new domain entity, aggregate or state machine is authorized here.
- **Human:** the founder initially buys materials, coordinates physical vendor work, inspects, packs and brings packages to a carrier when required. System/AI may prepare or record the work, not claim to have physically performed it.
- **Pilot:** existing Founder Control Business/Custom assisted-sales pilot remains a separate product and validation authority.
- **Integrity:** errors, retries, duplicates, permissions, partial fulfillment, provider downtime and unknown status must receive safe treatment.

---

## 1. Service boundaries, evidence and canonical ownership

### 1.1 Inspected state, not an imagined launch

Repository `main` was confirmed at `2800c474563309bda49d84d712f79b68c9dde36a` on 2026-10-16. Selected active TeeStock files show a holding page, a Custom Atelier page declaring ordering unavailable, and no catalog/cart/checkout/account routes in the inspected active `src/app` surface. `@mgbos/integrations`, `@mgbos/ai` and `@mgbos/ui` index exports inspected during CX-00/CX-01 are reserved boundaries. The internal MGBOS app has substantial operating routes; this **does not** mean public customer flows exist. All CX-02 blueprints therefore depict **target service behavior**, not current deployed behavior.

Source anchors (immutable at inspected commit):

- [TeeStock public homepage](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/apps/teestock/src/app/page.tsx)
- [Custom Atelier public placeholder](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/apps/teestock/src/app/custom-atelier/page.tsx)
- [Digital Product Vision / `TS-TEC-001`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/digital-product-vision.md)
- [Website Information Architecture / `TS-TEC-002`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/website-information-architecture.md)
- [Commerce Platform / `TS-TEC-003`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/commerce-platform.md)
- [Custom commercial policy](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/04-services/custom.md)
- [Business commercial policy](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/04-services/business.md)
- [Customer service policy](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/07-operations/customer-service.md)
- [Order fulfillment policy](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/07-operations/order-fulfillment.md)
- [MGBOS integration requirements](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/11-data-mgbos/mgbos-integration.md)
- [Existing Founder Control PRD](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/product/teestock-founder-control-prd.md)
- [Operational pilot plan](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/product/teestock-operational-pilot-plan.md)
- [Solo-Founder Launch Roadmap](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/roadmaps/solo-founder-launch-roadmap.md)
- [Documentation Constitution](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/governance/documentation-constitution.md) and [Canonical Source Map](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/governance/canonical-source-map.md)

### 1.2 Claim-specific authority routing

| Claim / decision                                         | Existing authoritative source                                                 | What CX-02 owns as a _proposal_                     | Explicit exclusion                 |
| -------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------- |
| Business offering, approved products and quantity limits | `bisnis/teestock/03-commerce/`, `04-services/`                                | Customer understanding, handoffs, states, questions | No new product/price policy        |
| Navigation / job families                                | `TS-TEC-002` website IA                                                       | User intent branching, task continuity              | No silent IA rewrite               |
| Quote and price validity                                 | `08-finance/pricing-framework.md`, Business/Custom; MGBOS financial semantics | Distinguish estimate/reviewed quote/acceptance      | No amount calculation rules        |
| Customer/order/production/financial truth                | `systems/mgbos/docs/architecture/`                                            | Required evidence and safe customer projection      | No new command, status, schema     |
| Founder attention and exception                          | Existing Founder Control D0–D4                                                | Separate normal work, physical tasks, exceptions    | No new exception taxonomy          |
| Customer case/returns                                    | Customer Service and Returns & Warranty; governed MGBOS boundary              | Intake, visibility, expectation and escalation      | No auto-refund/eligibility rewrite |
| Provider/channel obligations                             | Channel Strategy; actual provider rules when available                        | Source-aware support and recovery                   | No assumption of API access        |
| AI decision tools/autonomy                               | JARVIS/MGBOS/root governance                                                  | Assistive/non-authoritative places in journeys      | No grant of agent privileges       |
| Launch order and readiness                               | Cross-system launch roadmap, pilot plan, Owner/Head Engineering               | Proposed validation sequence and dependency map     | No release or deployment approval  |

### 1.3 Actor keys and responsibility nomenclature

| Actor key | Role in blueprint                                                                 | Is that actor guaranteed to exist as software integration today?     |
| --------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `C`       | Individual, B2B, guest or returning customer                                      | Customer is real-world; digital UI may not exist                     |
| `F`       | Customer-facing webpage, portal or assisted channel presentation                  | **No** for proposed flows; only selected placeholder source observed |
| `B`       | Approved MGBOS business authority or authorized operator of its existing commands | Partial internal capability, not public API readiness                |
| `D`       | Deterministic rules/workflow/notifications                                        | **No**; applies only where implemented and approved                  |
| `A?`      | Optional AI for drafting/extraction/explanation                                   | **No**; optional and not authoritative                               |
| `H`       | Founder performing physical work and human judgment                               | **Yes**, human operating assumption, capacity limited                |
| `X`       | Vendor, carrier, payment provider, marketplace, external communication service    | **Not assumed connected**                                            |

**Authority reminder:** `H` may represent one person acting as Sales, Production Coordinator, QC, Finance and Fulfillment. Role separation, organization scoping and audit should still be respected by any eventual implementation; a solo founder does **not** justify bypassing authorization boundaries.

### 1.4 Swimlane: customer outcome vs operational truth

```text
CUSTOMER INTENT / ACTION (C)
       |
       v
FRONTSTAGE EXPERIENCE (F) --- human-assisted contact where applicable
       |
       v
AUTHORIZED INTAKE / VALIDATION / COMMAND (B)
       |                  \
       |                   +--> D: deterministic follow-up / next-action preparation
       |                   +--> A?: explanation / extraction / drafting only
       |
       v
CANONICAL BUSINESS STATE / EVIDENCE (B)
       |
       +--> H: approve, source, physically move, inspect, pack, hand off
       +--> X: approved vendor/carrier/payment/channel actions and facts
       |
       v
SAFE, AUTHORIZED CUSTOMER PROJECTION (F)
       |
       v
CLEAR NEXT STEP / HELP / RECOVERY (C)
```

**No sidecar truth:** Email threads, WhatsApp chat, AI memory, external channel events, browser-local state and notifications can _inform_ or _transport_ actions but are not substitute masters for accepted internal commercial/operational facts.

---

## 2. Journey portfolio and service entrypoints

### 2.1 Journey inventory, outcomes and rollout

| Journey  | Customer job                           | Early route                                               | Target result                                                                  | Stage          | Master PRD ref                |
| -------- | -------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------- | ----------------------------- |
| `JRN-01` | Retail-led discovery + service routing | Public retail discovery; prominent Custom/Business routes | Curated apparel discovery + accessible Custom/Business pathways without jargon | P0             | `FR-001..005`                 |
| `JRN-02` | Request personal Custom                | Assisted contact/structured intake                        | Accurate request captured once, reviewed quote path                            | P0             | `FR-009..015`, `038..040`     |
| `JRN-03` | Request Business/B2B order             | Assisted lead-to-quote                                    | Buyer understands review/acceptance, no fictitious instant terms               | P0             | `FR-014..017`                 |
| `JRN-04` | Buy retail item                        | Future approved catalog/cart/checkout                     | True order/payment/stock confirmation                                          | P1             | `FR-020..028`                 |
| `JRN-05` | Upload, revise, approve artwork        | Human-assisted initial proof; scoped self-service later   | Exact-file/version clarity and production gating                               | P0 assisted/P1 | `FR-011`, `016`, `019`, `034` |
| `JRN-06` | Track, get help, return/reorder        | Contact + authorized limited visibility; portal later     | Reliable customer status and low-friction issue resolution                     | P0/P1          | `FR-029..037`, `042`          |
| `JRN-07` | Order through external channel         | Manual reconciliation first; approved adapter later       | One legitimate channel-linked internal order                                   | P1/P2          | `FR-041`, `045`               |
| `JRN-08` | Ask AI to explain/assist               | Optional; deterministic/non-AI route always available     | Useful grounded help without unauthorized action                               | Optional P1/P2 | `FR-040`, `043`, `046`        |

**No scope inflation:** `JRN-04` through `JRN-08` are not added to the existing pilot entry requirements. `JRN-01` and structured P0 experience are **product-definition targets**; actual readiness must be proven before publishing an interactive claim. Do not imply that a public inquiry form, purchase flow, payment, or MGBOS customer submission is already functional at runtime today.

### 2.2 Customer intent router (decision model)

| What customer says / does                            | Route presented                                                                                        | Data asked first                                                    | Avoid                                                                      | Human decision if needed                             |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------- |
| "I want to explore retail collections / buy apparel" | `Shop` with curated apparel storytelling & garment specs (nontransactional in S0; transactional in S1) | Intent or collection interest (no premature cart/checkout)          | Fake catalog, invalid price, unavailable buy button, fake instant checkout | Special stock/pricing uncertainty or drop scheduling |
| "I want apparel with my design"                      | `Customize`                                                                                            | Product kind, rough quantity, deadline need, artwork readiness      | Asking for technical print spec before explaining choices                  | Complex/unsupported custom configuration             |
| "Our team/company needs uniforms or bulk merch"      | `For Business`                                                                                         | Company/contact, purpose, quantities, required date, relevant specs | Consumer-cart assumptions for complex B2B                                  | Commercial conditions, approval/credit/complex quote |
| "I want to create merch for my community"            | `Build Merch` conceptual entry, only if offer is actually active                                       | Project context and preferred contact                               | Pretending a creator portal is operational                                 | Project feasibility and IP rights                    |
| "Where is my order?"                                 | Status/help route                                                                                      | Legitimate verification, not just order ID                          | Data leakage, invented delivered state                                     | Dispute, discrepancy, missing evidence               |
| "My order is wrong / I want a return"                | Support/case request                                                                                   | Relevant order, issue, evidence where appropriate                   | Automatic refund promises                                                  | Eligibility and liability judgment                   |
| "Can the AI handle it?"                              | Optional assistant with clear boundaries                                                               | Customer's question; consent for personal data                      | Invented authoritative price/date/order status                             | Human escalation if unsupported facts or permission  |

**Decision authority & action availability:** Exact navigation taxonomy, eligibility and commercial offer activation remain owned by existing TeeStock strategy and approved implementation; this is a **routing UX model**, not an authorization protocol. Visitors must clearly understand which actions are informational (collection exploration, lookbooks, garment quality specs), which are available (assisted contact available only through verified, approved and reachable channels), which are unavailable (live direct retail cart/checkout), and which are proposed future capabilities (public website inquiry submission remains a proposed future capability until independently implemented and activated). A visitor must not be promised a functioning submission, response guarantee, or order-processing path that does not exist at runtime. Where no approved channel exists, the experience must truthfully communicate unavailability or provide an informational next step.

### 2.3 Service blueprints are not domain lifecycles

A journey state such as `Customer understands order is in production` is an **experience outcome**, not permission to introduce `customer_production_status` as a canonical mutable business state. The UI uses a governed projection from existing business records. Terms in later flow examples are **illustrative customer copy**, not frozen database enumerations.

---

## 3. Blueprint `CX2-BP-01` / `JRN-01` — Retail-led discovery, collection storytelling and service routing

**Persona:** first-time mobile visitor; seeks curated graphic apparel, collection storytelling, or personal Custom / Business uniform / merch services.

**Entry:** organic search, social link, direct visit, QR/referral, approved marketplace informational link where allowed.

**Successful end:** visitor encounters curated apparel collections and brand identity front-and-center (`DEC-TS-2026-011`); easily discovers `Shop`, `Customize`, `For Business`, or `Build Merch` without department jargon; understands which actions are informational (collection exploration, lookbooks, garment specs), which are available (assisted contact available only through a verified, approved and reachable channel), which are proposed future capabilities (public website inquiry submission awaiting independent implementation and activation), which are unavailable (live direct retail checkout), and which are awaiting operational/approval readiness; no non-existent submission, response, or order-processing path is promised; where no approved channel exists, unavailability is truthfully communicated; anonymous viewing causes no unwanted sales tasks.

| Step                       | Customer / frontstage (`C` + `F`)                                                                                                                                           | Governed backstage (`B` + `D` + `A?`)                                   | Founder / physical (`H`)                        | Failure, uncertainty and recovery                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `01.1` Arrive              | Retail-led brand showcase, curated collection spotlight, immediate discoverable routes to `Custom` and `For Business`                                                       | Serve approved public content; no lead creation for passive visit       | None                                            | Content unavailable: resilient informational fallback and contact option, never fake products           |
| `01.2` Choose intent       | Explore `Shop` collections or navigate directly to `Customize`, `For Business`, or active `Build Merch`                                                                     | Route to appropriate published experience; content ownership respected  | None                                            | Hidden/not-yet-active offer does not present a fake action                                              |
| `01.3` Learn constraints   | Apparel lookbooks, garment quality specs, and clear availability mode (preview/drop/inquiry; no premature live checkout CTA)                                                | Read only permitted current catalog/content/policy data                 | None                                            | Unknown price/quantity/delivery is marked as review-needed; unverified checkout is never displayed      |
| `01.4` Commit to next step | Explore collection stories, initiate assisted retail inquiry via reachable contact channel, or route to Custom/Business intake (website form is proposed future capability) | If inquiry begins, preserve only consented minimum inputs; no order yet | Review exceptions only where actually submitted | Network/link error shows retriable next path; where channel unavailable, truthfully communicates status |
| `01.5` Continue elsewhere  | Consistent selected intent between routes; deep links land with full brand and service orientation                                                                          | Validate deep-link destination and current published status             | None                                            | Expired or unavailable deep link suggests relevant safe navigation                                      |

**Moment of truth `MOT-01`:** within the visited surface, the customer can answer "Is TeeStock relevant to what I want, and what do I do next?" without asking a human to interpret the website, while immediately understanding that retail presentation is currently informational discovery and that Custom/Business services are fully accessible via verified assisted channels.

**Runtime reality constraint:** blueprint steps depict proposed target customer outcomes only; public website inquiry submission is a proposed future capability until independently implemented, verified, and activated; assisted contact is available only through verified, approved, and reachable channels; a visitor must not be promised a functioning submission, response guarantee, or order-processing path that does not exist; where no approved channel exists, the interface truthfully communicates unavailability or provides an informational next step.

**Do not automate:** turning pageviews into sales leads, fabricating sold-out/ready stock, automatically classifying all inquiries as qualified.

**Trace:** `CX1-FR-001..005`, `CX1-BR-015..016`, `CX1-AC-001..003`; `XP-01/02/04`.

---

## 4. Blueprint `CX2-BP-02` / `JRN-02` — Personal Custom inquiry → reviewed quote

**Persona:** personal customer who wants a custom t-shirt/garment, possibly with only a rough design.

**Entry:** active approved Custom contact channel; future high-quality structured intake form as a P0 product target.

**Precondition:** no assumption that public file uploads or a website form are implemented. Only state a request is _received_ after durable confirmation from the authorized intake process or authenticated human record.

| Step                      | Customer / frontstage                                                                                            | Governed backstage                                                                                                       | Founder / physical                                                                   | Failure and recovery                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `02.1` Orient             | Explains product, purpose and quantity in plain language                                                         | Offer guided, conditional questions; no provider promise                                                                 | None                                                                                 | Customer unsure of print method: offer choices/explanation rather than reject                             |
| `02.2` Specify            | Enters product class, desired quantity/size mix if relevant, desired date, artwork readiness, contact permission | Validate minimum requirement; collect source context; optional `A?` structures free text without silently changing it    | None                                                                                 | Missing data: inline correction; save entered values without pretending unsubmitted draft is canonical    |
| `02.3` Artwork choice     | File if supported/approved, or explicit "artwork not ready"                                                      | Separate upload receipt / technical check / formal approval; do not parse unsafe files without approved controls         | Human artwork judgment if needed                                                     | Unsupported file/size: explain, preserve other inputs, provide alternative safe submission                |
| `02.4` Review submission  | Customer confirms readable summary and marketing/contact choices separately                                      | Validate submitter and privacy; accepted request has stable internal identity via approved handler                       | None                                                                                 | Double click/timeouts: dedup and status lookup design; do not make false accepted claim                   |
| `02.5` Acknowledge        | Honest receipt/reference, **request pending review**, next contact step using approved policy                    | MGBOS lead/requirement routed according to existing owner; `D` may prepare notification only after authoritative receipt | Founder only if review/action is required                                            | Notification failure must not erase accepted request; non-accepted submission remains clearly unconfirmed |
| `02.6` Review feasibility | May be asked for clarification once, with original context preserved                                             | Approved item/pricing/vendor capacity/production suitability review; `A?` may draft request summary                      | Founder checks vendor/cost and feasibility; real supplier confirmation when required | No verified material/capacity/price: no instant-final amount or guaranteed deadline                       |
| `02.7` Deliver proposal   | Understands estimate vs reviewed quote, version, assumptions and next action                                     | Quote created/reviewed using existing MGBOS authority; follow-ups may be drafted `D/A?`                                  | Founder approves exceptions, commercial commitments where required                   | Price/version change triggers correction, not silent acceptance                                           |
| `02.8` Accept or revise   | Explicitly approves current authorized commercial terms through available approved mechanism                     | If command supported and permitted, accepted quote advances via governed order lifecycle                                 | Founder may confirm physical execution starts after valid prerequisites              | Expired quote, missing payment/authority: no invented order or production release                         |

**Moment of truth `MOT-02`:** after a real request is accepted, the customer knows exactly what was submitted, what is still being checked, and how the next step will arrive.

**Avoidable founder load to eliminate:** retyping form data into spreadsheets, searching messages for quantity/deadline/artwork, rebuilding summaries, sending identical acknowledgement manually, and remembering follow-up due dates. Do **not** equate AI draft generation with automatically finalized quotation.

**Trace:** `CX1-FR-009..015`, `CX1-FR-038..040`, `CX1-BR-001/002/006/008/014/017`, `CX1-AC-004..007/009/023`.

---

## 5. Blueprint `CX2-BP-03` / `JRN-03` — Business inquiry → authorized quote/order

**Persona:** purchasing contact for uniforms, team apparel, corporate/event merchandise, possibly with multi-item, deadlines and approvals.

**Entry:** `For Business` or an existing assisted business channel; organizational roles must not be conflated with personal accounts.

| Step                           | Customer / frontstage                                                                              | Governed backstage                                                                               | Founder / physical                                                     | Failure and recovery                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `03.1` Express project         | State company context, intended use, volume, requested delivery, budget expectation where relevant | Minimum approved B2B lead fields; no assumed cross-org identity                                  | None                                                                   | Incomplete inquiry: explain requirements, preserve non-sensitive input               |
| `03.2` Qualify complexity      | See whether request needs specialist review, sample, artwork or formal quote                       | Policy-driven assisted routing; avoid consumer checkout for complex work                         | Founder commercial feasibility review                                  | Risk/complexity triggers human review, not invented price or production date         |
| `03.3` Clarify proposal        | Provide artwork/spec, shipping destination(s), time constraints and decision authority             | Requirement history and version/evidence retained by authoritative source; AI can summarize only | Founder may consult supplier, request sample, confirm purchasing terms | Changed specification needs updated quote; no chat-only scope change                 |
| `03.4` Issue quote             | Quote details, validity/conditions, clear approval path                                            | Approved MGBOS quote issuance; cost and risk checks are policy/transactional concerns            | Founder authority on exceptions and significant commitments            | Incorrect/missing approval means not accepted; no unauthorized quote issuance        |
| `03.5` Internal buyer approval | B2B stakeholder reviews exact current quote version, commercial terms and any formal documents     | Actor/organization authorization; record acceptance only via existing governed mechanisms        | Founder may coordinate with actual purchasing contact                  | Link forwarding or stale quote cannot authorize access or acceptance                 |
| `03.6` Order activation        | Understands deposit/payment/production milestones **only when confirmed**                          | Governed order/invoice/payment/production readiness; no UI-created financial state               | Founder coordinates materials, vendor and timelines physically         | Unpaid/ambiguous payment or missing artwork approval cannot silently open production |
| `03.7` Manage change           | Clear process for revision after acceptance                                                        | Scope change routed to approved requirement/quote/order change capability; no new entity assumed | Founder assesses feasibility and cost                                  | Large quantity / delivery change requires re-approval before new promise             |
| `03.8` Repeat account          | If permitted later, reorder/quote access and approved account products                             | P1/P2 scoped workspace only after auth and repeat-demand evidence                                | Physical tasks as needed                                               | Multi-contact cross-org views denied until authority model proven                    |

**Moment of truth `MOT-03`:** buyer understands what is binding vs still under negotiation and which exact actor is responsible for approval.

**Avoidable founder load:** repeatedly requesting the same specs, reassembling customer/company history, manually comparing revisions, chasing internal approvals without next-action tracking.

**Non-negotiable:** human business decision for terms outside stable authority; eventual B2B organization access requires security review, not merely account registration.

**Trace:** `CX1-FR-014..017/037..040`, `CX1-BR-001/002/005/009/020`, `CX1-AC-005/014`.

---

## 6. Blueprint `CX2-BP-04` / `JRN-04` — Retail discovery → eligible checkout → authoritative order (`P1`)

**Persona:** shopper purchasing an approved standard TeeStock product or eligible made-to-order item.

**Scope gate:** not an entry requirement for the current Business/Custom assisted-sales pilot; customer retail flow remains target-only until actual sellable catalog, financial, stock, security and payment provider readiness are independently proven.

| Step              | Customer / frontstage                                                                                | Governed backstage                                                                    | Founder / physical                                                 | Failure and recovery                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `04.1` Discover   | Search, filter, view approved catalog products                                                       | Product/variant/sellability from approved source                                      | No normal involvement                                              | Empty search ≠ backend unavailable; inaccessible item not displayed as purchasable       |
| `04.2` Evaluate   | Review photos, sizing, ready-stock/MTO/preorder truth, delivery qualifier, return implications       | Current valid price context, availability/ATS and operational policy                  | Physical stock reality must be reflected by governed stock process | Conflicting stock freshness: mark unavailable to transact or require verification        |
| `04.3` Configure  | Select variant/size/quantity eligible under business policy                                          | Deterministic sellable configuration, correct valid SKU                               | No normal involvement                                              | Invalid variant or retired offer blocks checkout and explains alternatives               |
| `04.4` Cart       | Clearly see items and provisional totals                                                             | Cart/session persistence subject to security, privacy and expiry constraints          | None                                                               | Session/network issue: recover if supported; cannot assert reservation unless authorized |
| `04.5` Revalidate | Customer sees shipping, fees, price, availability and fulfillment conditions before final acceptance | Governed pricing, inventory reservation/check, eligibility and updated terms          | None unless operational exception                                  | Any price/stock change requires customer reconfirmation; no silent total increase        |
| `04.6` Pay        | Select approved payment method; understands whether payment requires external action                 | Payment intent/command and provider results handled via approved transaction boundary | Founder sees exception only, not each normal callback              | Redirect != success; timeout/duplicate events do not create extra charge/order           |
| `04.7` Confirm    | One stable order reference; truthful payment/order state and next steps                              | Canonical order/payment confirmation only after verified approved results             | Physical picking/pack/transfer queued later                        | Pending stays pending; failed remains recoverable; unsupported callback state escalated  |
| `04.8` Fulfill    | Status/help and any required customer action accessible                                              | Governed production/inventory/shipment steps                                          | Founder performs picking, QC, packing, dispatch when required      | No auto-complete on label printed or courier booked                                      |

**Moment of truth `MOT-04`:** shopper can accurately distinguish `cart`, `checkout initiated`, `payment pending`, `paid`, and `order confirmed` without being charged twice or shown false success.

**Trace:** `CX1-FR-006/007/020..028`, `CX1-BR-001/003..005/008`, `CX1-AC-011..012/023`.

---

## 7. Blueprint `CX2-BP-05` / `JRN-05` — Artwork intake → revision → exact proof approval

**Persona:** personal Custom/B2B buyer using customer's design or requesting design assistance.

**Scope:** approval can be handled by documented assisted communication in early operations; a secure self-service approval portal, advanced preview/customizer and automated print-file validation are **not** presumed implemented.

| Step                          | Customer / frontstage                                                                 | Governed backstage                                                                                  | Founder / physical                                                  | Failure and recovery                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `05.1` Provide artwork        | Upload via approved interface or assisted channel; get instructions and limits        | Accept only within approved file-handling security/privacy boundary; persist provenance             | May receive/inspect physical sample where needed                    | Upload can fail without losing other requirements; unsupported file does not advance approval |
| `05.2` Receive acknowledgment | "File received" with reference where available                                        | Capture file receipt separately from technical validation and approval                              | No physical act inferred                                            | Network interruption: verify accepted receipt; no duplicated unrelated artwork                |
| `05.3` Check suitability      | Transparent reason if low quality, licensing ambiguity or unsuitable placement        | Governed review/validation from applicable policy; `A?` may flag issues but not certify suitability | Human reviewer checks material production constraints               | A confident AI answer cannot equal technical sign-off                                         |
| `05.4` Request correction     | Explain what must change in plain language                                            | Keep version/correlation in governed source; customer-facing message links to exact item            | Founder may provide annotated correction; no re-entry from scratch  | Wrong revision references blocked; prior accepted version not silently overwritten            |
| `05.5` Preview/proof          | Show visual approximation and explicit limitations when offered                       | Preview is not production guarantee; exact artwork/placement/spec snapshot needed                   | Founder/production operator ensures actual method suitability       | Mis-scaled mockup or preview limitation disclosed; no auto-production                         |
| `05.6` Approve exact version  | Customer with authority accepts designated proof and scope through approved mechanism | Version, identity, consent/approval evidence recorded in existing legitimate artifact model         | Founder checks subsequent production readiness                      | Outdated file/link/unauthorized actor cannot approve newer file                               |
| `05.7` Release to production  | Customer sees status only after all approved prerequisites                            | Governed approved quote/payment/production assignment/QC state transitions                          | Founder physically arranges materials and vendor; performs QC later | Any missing artwork/financial requirement blocks release; exception surfaced                  |

**Moment of truth `MOT-05`:** customer can say _"Saya menyetujui desain versi ini"_ without that being interpreted as acceptance of unverified material, price, or production scheduling.

**Technical uncertainty to Head Engineering:** exact design/artwork identity, versioning, permission, source snapshot and event implications must be reconciled with existing Design Library and production semantics. CX-02 **does not** create new assets/entities.

**Trace:** `CX1-FR-011/016/019/034`, `CX1-BR-006/020`, `CX1-AC-014/019`.

---

## 8. Blueprint `CX2-BP-06` / `JRN-06` — Order progress → customer care → resolution / reorder

**Persona:** buyer wanting to avoid repeatedly messaging "pesanan saya sudah sampai mana?" or reporting a genuine problem.

**Scope:** P0 may rely on existing assisted contact and legitimate status communication; P1 gated secure portal, returns self-service and reorder. `Customer Case` and `Operational Exception` remain separate concepts governed by their respective owners.

| Step                    | Customer / frontstage                                                                    | Governed backstage                                                                       | Founder / physical                                                            | Failure and recovery                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `06.1` Identify order   | Customer supplies appropriate authenticated/verified reference or permitted contact      | Identity/authorization checked at server before revealing data                           | None by default                                                               | Unknown/forged link does not leak existence, organization or private order details |
| `06.2` Understand state | Plain-language status and factual next step; show last reliable update where appropriate | Safe read-only projection of governed order, production, QC, shipment and payment state  | Founder only for needed action, not routine status explanation                | Data temporarily unavailable ≠ canceled/delivered/no order; show uncertainty/help  |
| `06.3` Action required  | Customer knows if approval/address/payment correction is needed                          | Relevant authorized action mapped to current business process                            | Founder not interrupted for customer-only step unless operational impact      | Expired/unauthorized action blocked; current valid option offered                  |
| `06.4` Ask question     | Help contextual to order/service with human route                                        | Approved knowledge policy and customer contact context; optional `A?` draft              | Founder handles novel/irreversible issue                                      | No AI revelation of internal margin, vendor details or another buyer's data        |
| `06.5` Report issue     | Provide order, reason, optional evidence; confirmation that _request_ was received       | Service request/case through approved owner; does not automatically refund/release stock | Founder inspects physical defect, handles replacement and liability decisions | Malformed claim preserved for correction; no auto-approval outside policy          |
| `06.6` Resolution       | Understand decision, evidence required, and actual authorized outcome                    | Follow existing return/cancellation/payment/production rules                             | Founder receives/reviews returned goods where necessary, arranges rework/ship | Dispute/return ambiguity communicated honestly, no invented SLA                    |
| `06.7` Reorder          | Prior products/preferences can be referenced when permitted                              | **New** purchase/quote revalidates current price, stock, lead time and permission        | Founder performs only necessary physical work                                 | Old order is not silently duplicated; expired quote must be reviewed               |
| `06.8` Close loop       | Customer sees what is resolved and what remains open                                     | Existing case/order/source truth remains separate; notifications not source of truth     | Founder confirms physical completion/QC if applicable                         | Notification failure does not mark case/order closed                               |

**Moment of truth `MOT-06`:** customer receives a truthful next step, not just a generic "processing" badge, and does not have to reconstruct the problem from scratch on every channel.

**Trace:** `CX1-FR-029..036/042..044`, `CX1-BR-004/007/009/012/014`, `CX1-AC-010/013/015..017`.

---

## 9. Blueprint `CX2-BP-07` / `JRN-07` — Marketplace-originated purchase → one canonical fulfillment (`P1/P2`)

**Persona:** customer transacting under terms of an approved external channel; founder needs one internal operational view.

**Critical distinction:** marketplace _order integration_ is not the same as operating an independent TeeStock marketplace. Provider-specific actions, customer identity rights, message rules, cancellation/refunds, access and API availability require external verification. Initial volume may justify approved manual/semi-manual reconciliation.

| Step                        | Customer / frontstage                                              | Governed backstage                                                                                   | Founder / physical                           | Failure and recovery                                                                         |
| --------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `07.1` External browse/buy  | Customer purchases according to marketplace UI and rules           | No TeeStock customer session can be assumed to own provider transaction                              | None                                         | TeeStock must not override channel promises without contractual basis                        |
| `07.2` Receive source event | Customer sees provider-issued reference                            | `X` event validated for authenticity and source identity; mapped IDs/SKUs if adapter approved        | None unless manual import currently chosen   | Spoofed, absent or incomplete event is rejected/quarantined, not accepted as canonical truth |
| `07.3` Normalize            | Marketplace-specific data mapped into appropriate internal context | Approved ingress, idempotent external source/order identity, organization scoping and reconciliation | Founder may resolve unmapped product/SKU     | Duplicate/out-of-order event cannot duplicate order or payment                               |
| `07.4` Operational queue    | Channel source and actual work visible to operator                 | Existing MGBOS workflow owns accepted order; external status remains distinguishable                 | Founder sources/produces/packs as required   | Data mismatch becomes visible reconciliation, not silent fulfillment                         |
| `07.5` Ship                 | Provider-compatible shipment and tracking expectations             | Only supported outbound actions and evidence; carrier facts verified                                 | Founder hands physical package to courier    | Printed label/manifest != collected package != delivered item                                |
| `07.6` Handle issue         | Customer uses required channel dispute/return pathway              | Internal support evidence reconciles with marketplace authority                                      | Founder handles real return/QC issues        | Provider-customer policy mismatch escalated; never double-refund                             |
| `07.7` Reconcile finance    | Customer sees channel settlement/receipt where applicable          | External payout/fees/returns reconcile to existing financial semantics by approved process           | Founder reviews exceptions, cash uncertainty | Channel payout pending is not equivalent to cash received                                    |

**Moment of truth `MOT-07`:** one real channel order produces one governed internal operating obligation, with no channel-specific leakage or duplicate charges/orders.

**Trace:** `CX1-FR-041/042/045`, `CX1-BR-008/011/014`, `CX1-AC-018/023`; CX-07 is owner for detailed provider contract.

---

## 10. Blueprint `CX2-BP-08` / `JRN-08` — Optional AI-assisted help → bounded human handoff (`P1/P2`)

**Persona:** customer unsure about sizing, product, artwork readiness, current order state or special request.

**Activation gate:** **not required for P0**, and not part of first pilot assurance. Available model, tool, policy evaluation, privacy consent, costs, fallback and permission must be decided by JARVIS/Head Engineering before any customer agent deployment.

| Step              | Customer / frontstage                                                        | Governed backstage                                                                                                       | Founder / physical                                            | Failure and recovery                                                               |
| ----------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `08.1` Ask        | Customer optionally invokes assistant, or uses ordinary contact/form instead | AI input restricted by data classification and permitted purpose                                                         | None                                                          | No model/service: ordinary journey remains reachable                               |
| `08.2` Understand | Clear, grounded explanatory answer with visible uncertainty                  | `A?` may retrieve approved public or authorized account-specific context under auth; no direct private table exploration | None                                                          | Unknown product/date/price: assistant admits uncertainty and offers verified route |
| `08.3` Structure  | Optional summary of customer request shown for review                        | AI proposal is draft; validated deterministic schema may reject/repair input                                             | None                                                          | AI guessed size/qty/method: confirmation required before submission                |
| `08.4` Handoff    | Customer consents to transmit approved context                               | `B/D` accepts only validated input via authorized normal command/queue                                                   | Founder gets concise context when material judgment required  | AI must not invent accepted status, order or promise                               |
| `08.5` Respond    | Human-reviewed answer or verified existing public policy response            | State and permissions tracked by actual business source; no shadow AI status ledger                                      | Founder handles rare nonstandard commercial/quality decisions | Prompt injection, jailbreak, hallucination or unsupported tool denied/logged       |
| `08.6` Recover    | Customer can return to form/help without restarting unnecessarily            | Only consented safe context retained; deletion/privacy governed separately                                               | None when routine                                             | Model timeout/cost limit does not block customer inquiry                           |

**Moment of truth `MOT-08`:** AI helps clarify, but cannot independently commit the business to a discount, delivery date, refund, invoice, credit, production release or cross-account disclosure.

**Trace:** `CX1-FR-040/043/046`, `CX1-BR-001/002/009/012/013/019`, `CX1-AC-009/021`.

---

## 11. End-to-end physical operations: a separate service blueprint

### 11.1 Example operating scenario `CX2-OPS-01` — 100 custom t-shirts with external vendor

**Illustrative test fixture, not current operational throughput, live inventory or quoted service level.** Customer requests 100 custom t-shirts with an artwork and desired date. The service promise must follow reviewed feasibility and actual policy. Founder may remain the only person doing physical coordination.

| Operational checkpoint                | Customer sees                                              | System / deterministic candidate                                                   | Optional AI candidate                                   | Founder MUST do if not genuinely delegated                    | Verification/evidence before advancing                             |
| ------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| `O-01` Request received               | Request/reference; not a confirmed order                   | Store permitted structured demand once; route owner                                | Summarize specification                                 | Review only complex/unclear details                           | Accepted request persisted; provenance known                       |
| `O-02` Product and method feasibility | Pending review; constraints explained                      | Check approved reference data/known constraints                                    | Flag missing details (not approve)                      | Verify actual vendor/material capacity, method                | Quote/requirement verified by authority                            |
| `O-03` Quote and terms                | Reviewed commercial offer; version/expiry                  | Calculate only where approved deterministic policy exists; record authorized quote | Draft plain-language explanation                        | Approve nonstandard commercial terms                          | Valid current quote and acceptance evidence                        |
| `O-04` Payment condition              | Paid/pending only from actual source                       | Record/reconcile approved payment commands                                         | No money authority                                      | Verify exception or assisted payment as policy dictates       | Governed financial preconditions satisfied                         |
| `O-05` Artwork approval               | Exact file/proof version, or correction required           | Track permissible artifact reference/approval evidence                             | Draft feedback only                                     | Check production-ready spec; approve when responsible         | Approved proof/requirements as required                            |
| `O-06` Material acquisition           | Customer-facing production prep only if true               | Generate pick/procurement checklist and required quantities                        | Summarize supplier comparison                           | **Physically buy/source materials**; receive/inspect          | Actual materials and cost receipt logged                           |
| `O-07` Vendor production              | Plain-language in-process status when evidence supports it | Existing production assignment/SPK and due-action tracking                         | Draft reminders                                         | **Hand materials to vendor, coordinate physically** if needed | Vendor acceptance / start evidence, not inferred from message sent |
| `O-08` Receive & QC                   | Quality check underway as factual                          | QC checklist/record and exceptions through governed process                        | Organize checklist, no visual/physical sign-off assumed | **Inspect physical print, size, quantity, defects**           | Actual QC evidence; rework blocks dispatch                         |
| `O-09` Pack and label                 | Preparing dispatch                                         | Generate packing list/shipping label only via approved integration                 | No physical packing                                     | **Fold, count, pack, label**                                  | Packed quantity reconciled to order/QC                             |
| `O-10` Courier handoff                | Handover/tracking only after evidence                      | Shipment and carrier tracking linked to governed source                            | Draft customer update                                   | **Take parcel to courier/drop-off** (or verified pickup)      | Carrier receipt/scan; label alone insufficient                     |
| `O-11` Actual cost and closure        | Genuine shipped/completed status when warranted            | Record actual vendor/material/shipping and reconcile margin under MGBOS            | Summarize variance for founder                          | Resolve missing receipts/claims                               | Realized cost/margin and completion per canonical policy           |

**Interpretation:** In the first stage, no software can truthfully mark `O-06`, `O-07`, `O-08`, `O-09`, or `O-10` complete merely by creating a task, displaying a button, or sending an AI instruction. An actual evidence-bearing actor must finish the work. An integration or employee can replace a founder physical step _only after operational evidence demonstrates the delegation is real_.

### 11.2 Normal vs abnormal path (`CX2-OPS-02`)

```text
NORMAL, EXPECTED ACTION
  -> governed task/record
  -> appropriate operator (often founder physically at first)
  -> evidence of action
  -> customer-safe status update

ABNORMAL OR UNKNOWN
  -> hold unsupported commitment
  -> identify source and impact
  -> route to existing exception/customer-case/incident owner
  -> present clear customer next step
  -> escalate to founder only when judgment, authority or physical action required
```

Do not equate: `operational exception` = `customer complaint` = `technical incident` = `founder notification`. Those concepts already have separate authorities and must be routed, not unified by a UI-level status.

### 11.3 Handoff evidence minimum (`CX2-HO-01..08`)

| Handoff ID  | From → to                   | Minimum meaning required                                                    | Forbidden assumption                |
| ----------- | --------------------------- | --------------------------------------------------------------------------- | ----------------------------------- |
| `CX2-HO-01` | Visitor → intent route      | Recognized chosen purpose and viable next action                            | View ≠ sales lead                   |
| `CX2-HO-02` | Customer → submitted intake | Accepted request identity, source, consent, validated details               | Click ≠ durable receipt             |
| `CX2-HO-03` | Intake → commercial review  | Requirement snapshot, missing data, responsible role and next action        | AI summary ≠ final spec             |
| `CX2-HO-04` | Quote → approval/order      | Exact quote version, actor authority, current terms and governed result     | Opened link ≠ accepted quote        |
| `CX2-HO-05` | Artwork → production        | Reviewed required version, customer approval and production eligibility     | Upload ≠ release                    |
| `CX2-HO-06` | Payment/order → execution   | Governed readiness, no duplicate money/order effect                         | Redirect ≠ payment complete         |
| `CX2-HO-07` | QC → fulfillment → carrier  | Physical quantity, QC outcome, shipment and handoff evidence                | Label generated ≠ shipped/delivered |
| `CX2-HO-08` | Case/return → resolution    | Correct policy decision, authorized financial outcome and physical evidence | Request receipt ≠ refund approval   |

Any unavailable item above must become a documented _gap_ or appropriately handled unknown, **not** a fictitious complete state.

---

## 12. Detailed founder burden and delegation matrix

### 12.1 Categories

- `PHYSICAL`: requires real material interaction, transport, packaging, production or inspection; may be delegated to actual provider/person later.
- `DETERMINISTIC`: structured repetitive administrative logic where rule/input/authority can be validated.
- `JUDGMENT`: commercial, quality, fairness, exception or high-impact decision requiring authorized person/policy.
- `ASSISTIVE_AI`: drafting, extraction, explanation and suggestions; always subject to verification and rollback/fallback.
- `EXTERNAL_DEPENDENCY`: proof from marketplace, carrier, payment gateway, supplier or messaging channel.

### 12.2 Responsibility assignment by job

| Founder job                               | Initial reality                         | Delegation goal                                                          | Gate before software/AI claims success                          | Owner of truth                           |
| ----------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------- | ---------------------------------------- |
| Answer repeated general product questions | Manual messages                         | Published FAQ/structured product info; optional AI grounded response     | Content valid/versioned; answer uncertainty and contact route   | TeeStock product/service policy          |
| Collect order requirements                | Chat/form + manual interpretation       | Customer structured intake + human-friendly summary                      | Accepted durable command; consent and de-dup                    | MGBOS lead/requirement owner             |
| Calculate standard quotations             | Manual + pricing review                 | Deterministic reviewed rules; AI explanation only                        | Policy snapshot, margin guard and approval when needed          | TeeStock pricing + MGBOS quote owner     |
| Chase incomplete customer detail          | Manual follow-up                        | Required-field UX, task reminders or draft messages                      | Valid source/contact/permission; no spam                        | MGBOS + customer communication policy    |
| Remember due dates/next actions           | Founder memory                          | Prioritized next-action cues and existing Founder Control                | Correct underlying business state; no duplicate shadow queue    | Existing Founder Control/operating spine |
| Buy garments/materials                    | Founder physically purchases            | Checklist, quantities, supplier information and receipts captured        | Actual purchase receipt/stock verification                      | Procurement/inventory                    |
| Hand materials to vendor                  | Founder physically                      | SPK/work order and contact prep, later approved courier/vendor pickup    | Verified handoff/acceptance                                     | Production/vendor ownership              |
| Check printed garment quality             | Founder physically                      | Checklist, sample evidence, structured defect reporting                  | Actual QC pass/defect evidence                                  | QC domain                                |
| Pack and send order                       | Founder physically                      | Packing list, valid label/docs, courier scheduling where approved        | Count, pack, carrier acceptance                                 | Fulfillment/shipment owner               |
| Tell customers current status             | Manual repeated checking                | Derived safe status projection, event-driven notification when permitted | Source freshness, authorization, notification delivery evidence | MGBOS source + communication system      |
| Handle refund/dispute                     | Founder decision/operational resolution | Structured claim intake and evidence collection                          | Existing refund/case authority; no AI grant                     | Customer Service/Returns/Finance         |
| Analyze profit / identify missing costs   | Manual review                           | Governed cost/margin views and exception prompts                         | Recorded actual costs, financial reconciliation                 | MGBOS financial ownership                |

### 12.3 Manual-touch measurement, not automation theater

A `manual touch` means an intentional human action necessary to advance an eligible case or reconstruct its context. Record both **administrative** and **physical** touches separately. Recommended observation model (not a new database design):

| Metric                                                         | Formula / observation                                                                                    | Important caveat                                                            |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `CX2-M01` Founder admin touches per valid inquiry              | Count retyping, sending repetitive acknowledgements, looking up basic status, rebuilding context         | Customer questions requiring human judgment are not waste by default        |
| `CX2-M02` Founder physical touches per fulfilled order         | Count acquisition, vendor handoff, QC, packing and courier handoff actions                               | Reduction requires actual outsourcing/process change, not a system checkbox |
| `CX2-M03` Duplicate transcription                              | Number of customer-submitted facts manually re-entered into another official system                      | Chat/AI memory is not a substitute transaction record                       |
| `CX2-M04` Customer effort                                      | Customer's required inputs/screens/contact attempts to achieve valid goal                                | Do not reduce fields by hiding necessary pricing/proof disclosures          |
| `CX2-M05` Founder interventions per comparable completed order | Manual decisions and administrative intervention separated by risk and service class                     | Compare comparable work complexity and cohorts                              |
| `CX2-M06` Avoidable status contacts per completed order        | Repeated requests that could be answered by a reliable permitted status channel                          | Unanswered serious complaints should never be labeled "avoidable"           |
| `CX2-M07` First-submission completeness                        | Accepted requests with sufficient minimum information for next governed action / accepted request cohort | Do not make form so long that only very determined customers finish         |
| `CX2-M08` Safe recovery rate                                   | Expected failure scenarios recovered without duplicate business effects or loss of validated context     | Require positive and negative evidence                                      |
| `CX2-M09` False customer commitments                           | Price/stock/date/production/refund/paid claims without authoritative support                             | Any material case is a release blocker for affected journey                 |
| `CX2-M10` Service economic load                                | Human admin time + actual AI/provider/automation costs per comparable request/order                      | Do not call AI cheap or expensive before measured baseline                  |

**Measurement packet fields:** journey ID, scenario ID, service class, accepted/current state, eligible denominator, observed baseline, measurement method, intervention category, actor, date/time period, source/evidence revision, exclusions and confidence limit. Never invent task-time reductions or order capacity.

---

## 13. Failure, recovery and exception routing catalog

| Recovery ID  | Trigger                                            | Customer-visible response                                                         | Backstage obligation                                                | Founder condition                                | Stage |
| ------------ | -------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------ | ----- |
| `CX2-REC-01` | Submitted form has invalid/missing required fields | Explain precisely, preserve already-valid entries                                 | No accepted request/false reference                                 | No founder interruption for routine validation   | P0    |
| `CX2-REC-02` | Network timeout after submit                       | "Status belum dapat dipastikan" with safe next step; do not imply failure/success | Resolve accepted receipt using approved replay/dedup semantics      | Escalate only if reconciliation fails            | P0    |
| `CX2-REC-03` | Artwork upload invalid/oversize                    | Supported remediation and alternate channel as approved                           | No production-ready approval                                        | Human check only for exceptional material        | P0    |
| `CX2-REC-04` | Desired deadline unconfirmed                       | Requested date clearly pending confirmation                                       | Governed feasibility review before promise                          | Human vendor/capacity check when necessary       | P0    |
| `CX2-REC-05` | Email/notification delivery fails                  | Preserve acknowledgement via original channel when possible; help alternative     | Retry/delivery evidence independent of transaction                  | Founder only if critical customer contact needed | P0/P1 |
| `CX2-REC-06` | Data API unavailable                               | Transparent "status unavailable" or safe fallback                                 | Observe error; do not synthesize `empty` or `complete`              | Escalate material operational impact             | P0/P1 |
| `CX2-REC-07` | Forged status/quote URL                            | Non-disclosing denied/expired response                                            | Server-side authorization audit, no cross-object data               | No disclosure for manual convenience             | P0/P1 |
| `CX2-REC-08` | Quote version expired/superseded                   | Offer re-review or request revised terms                                          | Deny unauthorized/stale approval                                    | Commercial judgment where needed                 | P0/P1 |
| `CX2-REC-09` | Stock/price changed after cart                     | Show change and ask for explicit reconfirmation                                   | Revalidate approved truth and no silent charge                      | Material stock exception only                    | P1    |
| `CX2-REC-10` | Payment provider callback delayed                  | Show pending/verification status, not paid                                        | Reconcile provider and canonical financial state idempotently       | Founder only for unresolved financial case       | P1    |
| `CX2-REC-11` | Proof/version conflict                             | Require review of exact current design                                            | No release until correct evidence                                   | Production judgment if needed                    | P0/P1 |
| `CX2-REC-12` | QC failure or shortage                             | Truthful delay/rework communication with next step                                | Existing QC/production exception route and revised promise approval | Physical inspection/rework/vendor coordination   | P0/P1 |
| `CX2-REC-13` | Carrier label exists but parcel not received       | Say label prepared, not delivered/shipped                                         | Carrier handoff evidence required                                   | Physical courier/drop-off confirmation           | P0/P1 |
| `CX2-REC-14` | Return request for Custom/special handling         | Request received, approval pending eligibility review                             | Case/return policy; no automatic refund                             | Inspect/approve authorized exception             | P1    |
| `CX2-REC-15` | Duplicate external marketplace webhook             | No duplicate order/customer action                                                | Source ID-based idempotency and reconciliation                      | Only unresolved data mismatch                    | P1/P2 |
| `CX2-REC-16` | AI hallucination, prompt injection or tool failure | Clear uncertainty and human/non-AI alternative                                    | Bound tool/data access; log/eval; no privileged effect              | Escalate high-risk/material customer issue       | P1/P2 |
| `CX2-REC-17` | Customer resumes after interruption                | Recover only legitimately stored consented draft or explain safe restart          | Protect privacy and idempotency                                     | No retyping/reconstruction when evidence exists  | P0/P1 |
| `CX2-REC-18` | Founder overloaded or vendor capacity uncertain    | Wait for reviewed commitment, rather than promised instant delivery               | Surface workload/material exceptions; avoid unsupported SLA         | Founder chooses acceptance/reschedule per policy | P0/P1 |

**Exceptional condition taxonomy is not defined here.** Head Engineering must map each incident to existing technical incident, operational exception, customer case, approval/financial exception or external provider reconciliation owner. A journey recovery label is **not** permission to create a new root entity.

---

## 14. Service design invariants and experience rules

| Rule ID     | Proposed invariant, derived from existing contract                                                                                       | Enforcement owner/source                               |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `CX2-SR-01` | Each real accepted customer action produces a stable traceable result; an unconfirmed click does not                                     | CX-01 `FR-013`, MGBOS command/transport                |
| `CX2-SR-02` | Quote vs estimate vs requested date vs confirmed commitment always visibly distinguishable                                               | TeeStock pricing/Custom/Business; MGBOS quotation      |
| `CX2-SR-03` | Customer-facing progress is a projection of existing governed facts                                                                      | MGBOS state machines                                   |
| `CX2-SR-04` | Upload, file receipt, technical review, proof approval and production release never collapse into one UI badge                           | Custom/Production/Design owner                         |
| `CX2-SR-05` | Payment and fulfillment never advance due to browser animation, AI text or notification delivery alone                                   | MGBOS financial/production/fulfillment                 |
| `CX2-SR-06` | Founder physical work must have actual completion evidence, not just task creation                                                       | Solo-Founder Operating Model + domain owner            |
| `CX2-SR-07` | Optional assistant unavailable cannot disable a legitimate primary customer task                                                         | CX-01 `XP-08`; future JARVIS policy                    |
| `CX2-SR-08` | Unauthorized guest/account/org customer access returns no private existence data                                                         | MGBOS identity/permission owner                        |
| `CX2-SR-09` | External provider reality preserved; no fictitious unified provider capability                                                           | Channel Strategy, approved provider terms              |
| `CX2-SR-10` | No routine customer view exposes raw margins, supplier confidential pricing, internal financials or unapproved production details        | MGBOS authorization; approved public projection        |
| `CX2-SR-11` | Complex UX options appear when relevant; necessary commercial/consent disclosures stay visible                                           | CX-03 design and CX-05 Custom experience               |
| `CX2-SR-12` | Customer's repeated support/reorder journey should reuse permitted verified context, not demand full re-entry                            | Customer Service, CX-06; privacy policy                |
| `CX2-SR-13` | An external notification delivery failure never rewrites transaction truth                                                               | Automation, MGBOS source-of-truth boundaries           |
| `CX2-SR-14` | Any enabled public action must have verified system/human processing, recovery and ownership behind it                                   | Product readiness and pilot safety                     |
| `CX2-SR-15` | Preserve failure/unknown/empty distinction and accessible mobile task-completion                                                         | CX-01 NFR; CX-03/08                                    |
| `CX2-SR-16` | Normal digital work should not interrupt founder without reason; physical jobs remain actionable                                         | Existing Founder Control; solo-founder operating model |
| `CX2-SR-17` | Customer cannot be promised a production slot if vendor/material/capital constraints unverified                                          | TeeStock Custom/Business and operating feasibility     |
| `CX2-SR-18` | Cancellation, return, compensation and partial/complex fulfillment retain existing specialized policy                                    | TeeStock returns/fulfillment and MGBOS                 |
| `CX2-SR-19` | Business organization approvers are not interchangeable with retail shoppers or guests                                                   | MGBOS organization/permission model                    |
| `CX2-SR-20` | Feature richness cannot worsen fundamental task completion, mobile performance, accessibility or service cost without trade-off approval | CX-01 + CX-08/CX-09                                    |

---

## 15. Journey-level acceptance scenarios (draft; **not executed**)

The following scenarios are candidate acceptance contracts for future bounded releases. They do not imply current test coverage, CI pass, independent QA or production safety.

### 15.1 P0 customer-entry / assisted-sales scenarios

| ID           | Given / When / Then (condensed)                                                                                                                                             | Evidence required                            | Master trace                   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------ |
| `CX2-AC-001` | **Given** new visitor, **when** selecting Custom/Business on mobile, **then** active relevant next step is available and no unavailable checkout is implied                 | Browser journey + content review             | `FR-001..005`, `AC-001..003`   |
| `CX2-AC-002` | **Given** user lacks print jargon, **when** starting Custom, **then** only comprehensible necessary questions appear; relevant help is accessible                           | Guided usability session / form validation   | `FR-009/010`                   |
| `CX2-AC-003` | **Given** permitted request with valid inputs, **when** accepted, **then** customer receives honest reference and backend accepted record is traceable exactly once         | API/browser + durable source check           | `FR-009/013/038`, `AC-004/007` |
| `CX2-AC-004` | **Given** submit timeout and retry, **when** customer resumes, **then** no duplicate actionable requests and no false receipt                                               | Retry/replay negative test                   | `FR-013/040`, `AC-023`         |
| `CX2-AC-005` | **Given** deadline/material/cost unknown, **when** asking for quote, **then** no final price or guaranteed date is presented                                                | Negative content + source-state tests        | `FR-012/015`, `AC-005`         |
| `CX2-AC-006` | **Given** unsupported/missing artwork, **when** submitting, **then** correction or safe assisted path remains available; no technical or production approval implied        | Upload negative test and operator review     | `FR-011`, `AC-006`             |
| `CX2-AC-007` | **Given** accepted inquiry, **when** founder reviews, **then** submitted fields/source/next action are found without re-keying from separate chats                          | Operator walkthrough + source audit          | `FR-038/039`, `AC-007`         |
| `CX2-AC-008` | **Given** no public order/status portal, **when** existing pilot is run, **then** verified assisted pathway remains valid without claiming P1 capabilities                  | Pilot scope/document check + human flow      | `FR-029/030`, `DEC-002/003`    |
| `CX2-AC-009` | **Given** disabled AI or notification provider, **when** performing legitimate assisted inquiry, **then** safe normal path and confirmation/recovery remain usable          | Fault-injection plus controlled process      | `FR-040`, `AC-009`             |
| `CX2-AC-010` | **Given** order's physical work, **when** task is marked completed, **then** vendor/QC/pack/courier evidence is present where required and no fictitious delegation counted | Manual operator acceptance + domain evidence | `FR-039`, `BR-017`             |

### 15.2 P1 retail / account / post-order scenarios

| ID           | Given / When / Then (condensed)                                                                                                                             | Evidence required                           | Master trace               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | -------------------------- |
| `CX2-AC-011` | **Given** approved variant/cart, **when** price/ATS changes, **then** explicit reconfirmation precedes any charge                                           | Browser + transactional negative test       | `FR-020..027`, `AC-011`    |
| `CX2-AC-012` | **Given** payment redirect but no verified callback, **when** order page loads, **then** it shows pending/uncertain, not paid                               | Provider simulation + canonical state check | `FR-024/025`, `AC-012`     |
| `CX2-AC-013` | **Given** unauthorized guest or cross-org link, **when** accessing status/quote, **then** private existence/data remain undisclosed                         | Independent server-side security tests      | `FR-030/031`, `AC-010/013` |
| `CX2-AC-014` | **Given** expired/superseded quote, **when** approving, **then** stale action denied with safe re-review option                                             | Quote domain/browser test                   | `FR-016/017`, `AC-014`     |
| `CX2-AC-015` | **Given** customer files return claim, **when** receipt shown, **then** no auto-refund or entitlement is stated without approved policy                     | Return/case negative test                   | `FR-032/033`, `AC-015`     |
| `CX2-AC-016` | **Given** unavailable backend status, **when** customer views order, **then** UI does not show `no orders` or `delivered` without factual support           | Fault injection and accessibility check     | `FR-030/031`, `AC-016`     |
| `CX2-AC-017` | **Given** old reorder product with new price/stock, **when** repeating, **then** current conditions reconfirmed and one new governed intent produced        | Reorder state regression                    | `FR-035`, `AC-017`         |
| `CX2-AC-018` | **Given** proof revisions A and B, **when** outdated A approval attempted after B replaces it, **then** exact-version authorization blocks stale acceptance | Proof/permission test                       | `FR-019/034`, `AC-014/019` |
| `CX2-AC-019` | **Given** QC failure after production, **when** customer checks progress, **then** truthful safe next step shown without fabricated delivery date           | Operator/QC/customer projection E2E         | `FR-029..034`, `AC-016`    |

### 15.3 P2 advanced channel and AI scenarios

| ID           | Given / When / Then (condensed)                                                                                                                                                      | Evidence required                       | Master trace           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- | ---------------------- |
| `CX2-AC-020` | **Given** duplicate external provider events, **when** replayed, **then** only one canonical obligation created and discrepancy observable                                           | Provider adapter idempotency E2E        | `FR-041/045`, `AC-018` |
| `CX2-AC-021` | **Given** AI asked for unauthorized refund/discount/guaranteed deadline, **when** responding, **then** it refuses the authority-bearing action and offers approved human/normal flow | Adversarial AI/tool eval                | `FR-043/046`, `AC-021` |
| `CX2-AC-022` | **Given** unsupported custom configuration, **when** showing preview/price, **then** no "production-ready" or firm total without validated rules                                     | Configurator negative test              | `FR-018/019`, `AC-019` |
| `CX2-AC-023` | **Given** new heavy builder/AI feature, **when** core journeys rerun, **then** approved mobile, accessibility and performance requirements remain met                                | Independent regression and measurements | `AC-020`               |

### 15.4 Human-centered acceptance, P0 before engineering

`CX2-AC-024` **Task comprehension research:** representative participants can identify a valid next action, the distinction between _submitted request_ and _accepted order_, and the meaning of a _requested delivery date_ without moderator correction. Record sample and methods; no invented percent threshold at this stage.

`CX2-AC-025` **Real operational rehearsal:** founder walks through an accepted qualified Custom/Business request, documents admin vs physical touches and discovers any missing data/handoff without a separate shadow spreadsheet as authoritative record. Controlled rehearsal must not create live money, shipping or stock effects without approved safe environment.

`CX2-AC-026` **False promise red team:** content, AI, email templates, pending-payment UI, and shipping statuses are reviewed for unsupported price, stock, deadline, refund and approval claims. Material violations block promotion of the affected slice.

**Gate:** No scenario can be promoted from `PROPOSED` to `PASS` without method, environment, exact revision, sample/case, expectation, observed result, independent review where risk warrants, and clear limitation.

---

## 16. User research and rehearsal fixtures

### 16.1 Proposed representative participants / sample boundaries

These are **research segments**, not claims that customer research has been performed:

1. First-time mobile retail visitor seeking an affordable plain or curated tee.
2. Individual Custom buyer with only a rough concept, no production jargon.
3. Custom buyer with artwork that fails size/format or quality expectations.
4. B2B purchasing contact with formal quote and internal approver.
5. Returning buyer needing order status/reorder with changed price.
6. Customer with delayed shipment or real defect asking for an explanation.
7. Founder operating alone and juggling two physical tasks while new inquiries arrive.
8. Later: marketplace-originated buyer under provider-specific limits.

Recruit beyond the founder or builder for real usability evidence; internal roleplay can validate flow logic but cannot represent actual customer preference or conversion behavior. Consent and data protection apply to research participants. No live personal, financial, or production data required for initial script-based usability research.

### 16.2 Controlled test fixtures (synthetic only)

| Fixture  | Condition                                                             | Expected learning                                          |
| -------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| `FIX-01` | Standard Personal Custom: 30 shirts, artwork provided, date requested | Can intake be completed with clear price/date uncertainty? |
| `FIX-02` | Custom: 100 shirts, artwork not ready, preferred deadline short       | Does complex request route to feasibility review?          |
| `FIX-03` | Business: 300 shirts, three size groups, two approval stakeholders    | Does quote/version authority remain clear?                 |
| `FIX-04` | Retail: size variant no longer available during checkout              | Can customer correct instead of oversell? P1 only          |
| `FIX-05` | Payment callback delayed after browser returns                        | Is pending truth honored? P1 only                          |
| `FIX-06` | Artwork v2 supersedes v1 after customer feedback                      | Is stale approval blocked?                                 |
| `FIX-07` | QC rejects part of production; vendor rework needed                   | Is customer shown reliable, non-internal status?           |
| `FIX-08` | Packed parcel has label but no carrier receipt                        | Is shipment not falsely shown as dispatched/delivered?     |
| `FIX-09` | Marketplace sends exact same order event twice                        | Is accepted order count stable? P1/P2 only                 |
| `FIX-10` | AI unavailable and customer sends special request                     | Can human-assisted path continue? optional AI only         |

**Synthetic quantities are examples for tests, not actual TeeStock capacity or approved MOQ.** No card/payment data, existing production database, real external shipment, or actual customer data should be used unless a separate authorized pilot and safeguards exist.

### 16.3 Observations and usability research output schema

A research record should contain `research_session_id`, `participant_segment`, `journey_id`, `fixture_id`, `environment`, `tested_revision`, `task_prompt`, `start_state`, `end_state`, `completion`, `misunderstandings`, `time_observed`, `questions_asked`, `accessibility_friction`, `physical/admin_touch_notes`, `privacy_consent`, `evidence_link`, `limitations`, and prioritized findings. Store genuine research evidence under an approved project evidence location; no personal participant material should be casually added to a public repository.

---

## 17. Product decisions, assumptions and open questions

### 17.1 Reused existing decisions (not reopened here)

- `UPSTREAM-01`: TeeStock exposes customer jobs rather than internal divisions (`TS-TEC-001` and `TS-TEC-002`).
- `UPSTREAM-02`: The Custom builder only advances when product/pricing/production constraints are standardized (`TS-TEC-001`, Custom policy).
- `UPSTREAM-03`: Marketplace is a distribution channel, not TeeStock's master operational truth (Channel Strategy, Commerce Platform).
- `UPSTREAM-04`: MGBOS is governed business truth; JARVIS and automation are subordinate to approved permissions (root/MGBOS/JARVIS governance).
- `UPSTREAM-05`: Existing Business/Custom pilot may remain assisted-sales without full public storefront (`teestock-operational-pilot-plan.md`, `solo-founder-launch-roadmap.md`).
- `UPSTREAM-06`: Quote, money, organization isolation, return eligibility and shipment/QC authority remain in established policy/architecture owners.

### 17.2 Proposed product decisions needing Owner-level acceptance or evidence

| ID           | Proposed interpretation                                                                                                            | Status                           | Appropriate next action                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------- |
| `CX2-DEC-01` | Use eight master journeys as common CX roadmap language; P0 focuses on truthful Custom/Business entries without forcing checkout   | PROPOSED                         | Include in CX-01 product package review                                      |
| `CX2-DEC-02` | The customer receives a receipt/reference only after actual permitted acceptance; drafts/UI intent never count as accepted inquiry | PROPOSED / consistent with CX-01 | Validate in future public intake spec and technical design                   |
| `CX2-DEC-03` | A secure order-status/help experience is valuable early, but no guest-lookup implementation is implied until auth is proven        | PROPOSED                         | Security discovery in CX-06/08                                               |
| `CX2-DEC-04` | No public promise of instant price, guaranteed turnaround or verified stock when source evidence absent                            | PROPOSED / upstream-aligned      | Confirm commercial copy with policy owner                                    |
| `CX2-DEC-05` | Founder administrative and physical touches are measured separately; physical work cannot disappear by task automation             | PROPOSED                         | Product metrics in CX-09 and future pilot                                    |
| `CX2-DEC-06` | Public customer status should describe reality in plain language, not reproduce raw internal state labels                          | PROPOSED / upstream-aligned      | UX content contract in CX-06; canonical mapping reviewed by Head Engineering |
| `CX2-DEC-07` | Customer may reach human assistance without registering, where privacy/security/channel requirements allow                         | PROPOSED                         | CX-06 access discovery and Owner review                                      |
| `CX2-DEC-08` | Public flows should have robust retry/interruption handling without changing underlying transaction states                         | PROPOSED                         | CX-03/04/08 technical readiness review                                       |
| `CX2-DEC-09` | Optional AI never gates the service; no AI execution scope without approved tool contract                                          | PROPOSED / upstream-aligned      | JARVIS+Head Engineering evaluation                                           |
| `CX2-DEC-10` | Journey diagrams and blueprint stages are service outcomes, **not** new canonical database models                                  | PROPOSED / governance-aligned    | Architecture owner acknowledgement in product package review                 |

### 17.3 Open unknowns, never fill with guesses

| ID           | Unverified item                                                                                              | Impact                              | Owner / next discovery              |
| ------------ | ------------------------------------------------------------------------------------------------------------ | ----------------------------------- | ----------------------------------- |
| `CX2-UNK-01` | Which approved contact channel/form will actually process first launch inquiries?                            | Honest CTA, human workload          | Owner/Head Engineering, CX-05       |
| `CX2-UNK-02` | Customer response/callback SLA for Custom/Business                                                           | No invented response time           | TeeStock service policy owner       |
| `CX2-UNK-03` | Which specific product families, methods, quantities and lead-time assumptions are sellable first?           | Quote/checkout truth                | TeeStock Custom/Commerce owner      |
| `CX2-UNK-04` | Which artwork formats, max sizes, review and storage process are actually supported?                         | Privacy/security/print feasibility  | CX-05, Head Engineering, operations |
| `CX2-UNK-05` | Customer-visible guest/portal status authorization technique and privacy policy                              | Customer account safety             | CX-06/08, security                  |
| `CX2-UNK-06` | How human-accepted/assisted quote version and approval evidence are proven in actual operating interface     | Commerce integrity                  | MGBOS architecture/Head Engineering |
| `CX2-UNK-07` | Existing runtime feasibility of exposing an authorized public intake API from governed MGBOS                 | First public interactive experience | Head Engineering after approved PRD |
| `CX2-UNK-08` | Current physical vendor lead times, capacity, delivery routes and founder throughput                         | Customer promise/safety             | Real vendor/operations validation   |
| `CX2-UNK-09` | Actual return policy and eligible product/customer cohorts at first launch                                   | After-sales truth                   | TeeStock returns owner              |
| `CX2-UNK-10` | Payment/shipping provider choices and contract entitlement                                                   | P1 dependency                       | Owner, CX-04/07                     |
| `CX2-UNK-11` | First marketplace and API access/fee/reconciliation feasibility                                              | Omnichannel readiness               | Owner, CX-07                        |
| `CX2-UNK-12` | Real customer research on complexity and task comprehensibility                                              | Premium UX effectiveness            | CX-03 research plan                 |
| `CX2-UNK-13` | Real manual admin baseline vs provider/AI costs                                                              | Business ROI                        | CX-09 measurement                   |
| `CX2-UNK-14` | Which milestones/customer disclosures can be derived safely from current production and fulfillment evidence | Status usability                    | MGBOS architecture + CX-06          |
| `CX2-UNK-15` | Whether proposed route taxonomy or terms conflict with active navigation decisions                           | Avoid IA drift                      | `TS-TEC-002` owner / CX-03          |
| `CX2-UNK-16` | Real user connectivity/device mix and performance budgets                                                    | Usable mobile experience            | CX-08 evidence                      |

### 17.4 Special concern: competing workflow plans

The existing active controlled pilot is `Business + Custom / Assisted Sales` and remains fully valid on its own terms; CX-02 neither adds a full public storefront prerequisite nor claims that future CX stages are active. If this product package proposes new implementation sequence, it must be reconciled by Owner and Head Engineering with `docs/roadmaps/solo-founder-launch-roadmap.md` and any newer current approved roadmap. Reconciliation is **forward-only**; historical audit evidence or merged PR intent must not be rewritten as if it never occurred.

---

## 18. Traceability across customer journey, master requirements and downstream ownership

### 18.1 Journey-to-requirement map

| Journey  | CX-01 functional IDs          | CX-01 acceptance IDs      | Downstream refinement owner                        |
| -------- | ----------------------------- | ------------------------- | -------------------------------------------------- |
| `JRN-01` | `CX1-FR-001..005`             | `CX1-AC-001..003`, `008`  | CX-03 public UX and information architecture       |
| `JRN-02` | `CX1-FR-009..015`, `038..040` | `CX1-AC-004..009`, `023`  | CX-05 Custom request/quote details                 |
| `JRN-03` | `CX1-FR-014..017`, `037..039` | `CX1-AC-005/014`          | CX-05 B2B commercial review + CX-06 secure account |
| `JRN-04` | `CX1-FR-006/007/020..028`     | `CX1-AC-011/012/023`      | CX-04 Commerce and Checkout                        |
| `JRN-05` | `CX1-FR-011/016/019/034`      | `CX1-AC-006/014/019`      | CX-05 artwork/proof + CX-08 security               |
| `JRN-06` | `CX1-FR-029..036/042..044`    | `CX1-AC-010/013/015..017` | CX-06 Customer Account and Care                    |
| `JRN-07` | `CX1-FR-041/042/045`          | `CX1-AC-018/023`          | CX-07 Omnichannel integration                      |
| `JRN-08` | `CX1-FR-040/043/046`          | `CX1-AC-009/020/021`      | CX-06, CX-08, JARVIS authority owners              |

### 18.2 Downstream exact responsibilities

| Next doc                                     | Receives from CX-02                                                                                            | Must not independently define                                    |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `CX-03 Experience Design & Interaction Spec` | User intent routing, friction/moments-of-truth, error states, mobile/accessibility research, P0 task scenarios | New commerce prices, new business states, brand identity rewrite |
| `CX-04 Commerce & Checkout`                  | JRN-04 stages, price/stock/payment negative paths, retail operator physical work, P1 acceptance scenarios      | New MGBOS financial/inventory authority                          |
| `CX-05 Custom & B2B Ordering`                | JRN-02/03/05 stage detail, proof/quote/versioning, precise human authority boundary                            | New generic Project/Opportunity/Design entities by implication   |
| `CX-06 Customer Account & Service`           | JRN-06/08 user account, status, support, AI escalation and privacy concerns                                    | New permission/return/refund or JARVIS autonomy policies         |
| `CX-07 Omnichannel Integration`              | JRN-07 source identity, provider-reality distinctions, import/reconciliation failure                           | Provider entitlements without evidence                           |
| `CX-08 Quality & Acceptance`                 | `CX2-AC-*`, `CX2-REC-*`, performance/accessibility/privacy/negative tests                                      | PASS claim without executed evidence                             |
| `CX-09 Phased Delivery & Validation`         | Handoffs, founder workload metrics, customer journey pilot fixtures and gates                                  | Override existing canonical launch roadmap                       |

### 18.3 Acceptance-ready flow shape (handoff packet, not API contract)

```text
CUSTOMER PERSONA / INTENT
 -> ELIGIBLE ROUTE / CHANNEL
 -> INPUT + ASSUMPTIONS
 -> FRONTSTAGE CONFIRMATION / EXPLANATION
 -> AUTHORIZED BACKSTAGE RECORD OR EXPLICIT NOT-ACCEPTED RESULT
 -> HUMAN / DETERMINISTIC / OPTIONAL-AI RESPONSIBILITY
 -> PHYSICAL/EXTERNAL EVIDENCE WHEN APPLICABLE
 -> VERIFIED CUSTOMER STATUS / HELP
 -> SAFE RECOVERY OR CLOSED OUTCOME
 -> JOURNEY METRIC + REPRODUCIBLE EVIDENCE
```

**Handoff minimum:** any implementing team must cite the exact approved version of CX-01/CX-02 and upstream business/canonical sources, identify a bounded slice, derive feasibility, propose technical plan and obtain Owner-approved contract. Neither CX-02 nor a designer mockup provides implementation permission.

---

## 19. Risks and anti-patterns

| ID            | Service anti-pattern                                           | Material consequence                                 | Design countermeasure                                                  |
| ------------- | -------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| `CX2-RISK-01` | "Premium" measured only by animation and visuals               | Sluggish mobile tasks and inaccessible checkout      | Outcome/motion budget with CX-03/08                                    |
| `CX2-RISK-02` | Customer form shifts consultation labor to customer            | Abandoned inquiry, poor trust                        | Progressive questions and genuine help                                 |
| `CX2-RISK-03` | AI summary accepted as fully verified requirements             | Wrong product/material/artwork                       | Human/read-back and canonical validation                               |
| `CX2-RISK-04` | Instant price / ETA inferred from guessed capacity             | Financial loss, deadline failure                     | Review-gated promise and explicit uncertainty                          |
| `CX2-RISK-05` | Founder appears automated but retypes same information         | No real burden reduction                             | Structured source and touch-count evidence                             |
| `CX2-RISK-06` | Work order generated = material physically acquired            | Production starts on false prerequisites             | Real-world proof per physical handoff                                  |
| `CX2-RISK-07` | Carrier label generated = parcel shipped                       | Customer disputes and trust erosion                  | Carrier handoff scan/receipt where required                            |
| `CX2-RISK-08` | Chat/notification becomes competing order record               | Conflicting status, no audit                         | Canonical MGBOS truth + transport-only messages                        |
| `CX2-RISK-09` | Guest deep link discloses protected B2B data                   | Serious information isolation breach                 | Server-side scoped authorization and negative tests                    |
| `CX2-RISK-10` | Marketplace provider capability assumed                        | Broken integration and invalid promises              | Channel-specific gating and reconciliation                             |
| `CX2-RISK-11` | Customer care creates unauthorized refund                      | Financial loss / policy violation                    | Request vs approval separation                                         |
| `CX2-RISK-12` | AI handles high-impact action without delegated authority      | Refund/contract/delivery failures                    | Policy-gated assistive-only experience initially                       |
| `CX2-RISK-13` | Real production pilot confused with frontend validation        | False launch readiness                               | Distinct tests: service blueprint / customer UX / real pilot           |
| `CX2-RISK-14` | Prototype app routes used as evidence of live functionality    | Customer disappointment, unsafe deployment decisions | Current-source vs running service vs business proof explicitly labeled |
| `CX2-RISK-15` | Overbuilding portal/channel features before first revenue data | Delayed go-to-market and unsustainable cost          | P0/P1/P2 staging with evidence gates                                   |

---

## 20. Quality and reconciliation checklist

### 20.1 Self-review checklist, **not** independent acceptance

- [x] Document is explicitly draft and does not invent canonical authority.
- [x] Existing `JRN-01..08` kept intact with corresponding service blueprints.
- [x] Proposed priority markers separated from current live/implemented truth.
- [x] End-to-end duties separated across customer/frontstage, MGBOS, deterministic automation, optional AI, founder physical work and provider.
- [x] Eight journeys have customer moments of truth, failure handling and founder implications.
- [x] Physical material purchase, vendor handoff, QC, packing and courier delivery are explicit.
- [x] No public payment success inferred from redirect; no quote/order progress inferred from messaging alone.
- [x] No portal authorization assumed for guests or organizations.
- [x] Customer cases, operating exceptions and technical incidents remain distinct.
- [x] P0 initial journey definitions do not override the assisted-sales pilot or force storefront completion.
- [x] Customer research and all release acceptance tests remain unexecuted `NOT_VERIFIED`.
- [x] Exact inspected `main` revision and GitHub source anchors stated.
- [x] Later documents retain clear ownership; no Builder assignment or deployment authorization given.

### 20.2 Pending approval/validation checklist

- [ ] Owner confirms CX-02 is aligned with the desired customer experience and solo-founder operating reality.
- [ ] Product source authority cross-check completed after any new merge to main, including pending PR #73 entrypoint navigation changes.
- [ ] Independent product/UX review of priority assumptions and errors performed before normative activation.
- [ ] Specific initial customer contact channel, privacy consent, business offers and message/response policies confirmed.
- [ ] Head Engineering validates future technical feasibility and repository/canonical routing when product package is ready.
- [ ] Risk-based QA performs real browser/task/accessibility/negative security testing on exact approved implementation candidate.
- [ ] No P1/P2 release activated without provider, authorization, financial and recovery evidence.

### 20.3 Status and recommendation

| Gate                                     | Disposition                                         |
| ---------------------------------------- | --------------------------------------------------- |
| Draft content and traceability           | `SELF_REVIEWED`                                     |
| Business source compatibility            | `PRELIMINARY_ALIGNED`, not independent signed audit |
| Founder operational workflow             | `PRODUCT_MODEL_DEFINED`, not field-validated        |
| P0/P1/P2 functionality in public app     | `NOT_VERIFIED / NOT_CLAIMED`                        |
| Independent UX/security/product QA       | `NOT_PERFORMED`                                     |
| Owner product authorization              | `PENDING`                                           |
| Canonical GitHub integration             | `NOT_PERFORMED`                                     |
| Engineering implementation authorization | `NONE`                                              |

**Exactly one next document:** `CX-03 — Experience Design & Interaction Specification`. It should use this blueprint's frontstage moments-of-truth, recovery catalog, research fixtures and stage distinction to specify a coherent mobile-first, accessible, premium design experience **without assuming any customer-facing functionality exists yet**.

---

_Prepared 2026-10-16 (Asia/Jakarta). All described target journeys and future capabilities remain proposals subject to Owner approval, canonical ownership, technical feasibility and separate implementation gates._

---

## Remediation R1 — explicit master requirement trace (generated draft, non-authoritative)

The rows below are generated from `CX-PKG-TRACE-R1.csv` (the sole package-wide mapping table). They do not introduce additional product requirements, approve a release stage, change any domain/architecture policy, or prove acceptance. Only exact locally declared IDs are linked; review the complete matrix for gates, ambiguities and candidate staging.

| CX-01 master ID | Exact declared detail IDs in this document | Selected existing acceptance             | Candidate slice |
| :-------------- | :----------------------------------------- | :--------------------------------------- | :-------------- |
| `CX1-FR-001`    | `CX2-BP-01`                                | `CX8-AC-001`                             | `CX-S0`         |
| `CX1-FR-002`    | `CX2-BP-01`                                | `CX9-AC-006`                             | `CX-S0`         |
| `CX1-FR-003`    | `CX2-BP-01`                                | `CX5-AC-001`, `CX8-AC-001`               | `CX-S0`         |
| `CX1-FR-004`    | `CX2-BP-01`                                | `CX9-AC-005`                             | `CX-S0`         |
| `CX1-FR-005`    | `CX2-BP-01`                                | `CX8-AC-003`                             | `CX-S0`         |
| `CX1-FR-006`    | `CX2-BP-04`                                | `CX8-AC-013`                             | `CX-S1`         |
| `CX1-FR-007`    | `CX2-BP-04`                                | `CX8-AC-014`                             | `CX-S1`         |
| `CX1-FR-008`    | `CX2-BP-08`                                | `CX8-AC-012`                             | `CX-S3`         |
| `CX1-FR-009`    | `CX2-BP-02`                                | `CX8-AC-006`                             | `CX-S0`         |
| `CX1-FR-010`    | `CX2-BP-02`                                | `CX5-AC-005`, `CX8-AC-006`               | `CX-S0`         |
| `CX1-FR-011`    | `CX2-BP-05`                                | `CX5-AC-002`, `CX8-AC-028`               | `CX-S0`         |
| `CX1-FR-012`    | `CX2-BP-02`                                | `CX8-AC-007`                             | `CX-S0`         |
| `CX1-FR-013`    | `CX2-BP-02`                                | `CX8-AC-005`                             | `CX-S0`         |
| `CX1-FR-014`    | `CX2-BP-03`                                | `CX5-AC-007`                             | `CX-S0`         |
| `CX1-FR-015`    | `CX2-BP-03`                                | `CX5-AC-012`, `CX5-AC-013`               | `CX-S0`         |
| `CX1-FR-016`    | `CX2-BP-03`                                | `CX8-AC-027`                             | `CX-S2`         |
| `CX1-FR-017`    | `CX2-BP-03`                                | `CX8-AC-025`                             | `CX-S2`         |
| `CX1-FR-018`    | `CX2-BP-05`                                | `CX5-AC-036`                             | `CX-S3`         |
| `CX1-FR-019`    | `CX2-BP-05`                                | `CX8-AC-029`                             | `CX-S3`         |
| `CX1-FR-020`    | `CX2-BP-04`                                | `CX8-AC-013`                             | `CX-S1`         |
| `CX1-FR-021`    | `CX2-BP-04`                                | `CX8-AC-015`                             | `CX-S1`         |
| `CX1-FR-022`    | `CX2-BP-04`                                | `CX8-AC-017`                             | `CX-S1`         |
| `CX1-FR-023`    | `CX2-BP-04`                                | `CX4-AC-023`                             | `CX-S1`         |
| `CX1-FR-024`    | `CX2-BP-04`                                | `CX8-AC-019`                             | `CX-S1`         |
| `CX1-FR-025`    | `CX2-BP-04`                                | `CX4-AC-028`                             | `CX-S1`         |
| `CX1-FR-026`    | `CX2-BP-04`                                | `CX8-AC-016`                             | `CX-S1`         |
| `CX1-FR-027`    | `CX2-BP-04`                                | `CX4-AC-010`                             | `CX-S1`         |
| `CX1-FR-028`    | `CX2-BP-04`                                | `CX4-AC-016`, `CX9-AC-029`               | `CX-S3`         |
| `CX1-FR-029`    | `CX2-BP-02`                                | `CX8-AC-005`                             | `CX-S0`         |
| `CX1-FR-030`    | `CX2-BP-06`                                | `CX6-AC-001`, `CX6-AC-003`, `CX8-AC-030` | `CX-S0`         |
| `CX1-FR-031`    | `CX2-BP-06`                                | `CX6-AC-007`                             | `CX-S2`         |
| `CX1-FR-032`    | `CX2-BP-06`                                | `CX6-AC-023`                             | `CX-S2`         |
| `CX1-FR-033`    | `CX2-BP-06`                                | `CX8-AC-032`                             | `CX-S2`         |
| `CX1-FR-034`    | `CX2-BP-05`                                | `CX5-AC-027`                             | `CX-S2`         |
| `CX1-FR-035`    | `CX2-BP-06`                                | `CX8-AC-034`                             | `CX-S2`         |
| `CX1-FR-036`    | `CX2-BP-06`                                | `CX6-AC-033`                             | `CX-S2`         |
| `CX1-FR-037`    | `CX2-BP-03`                                | `CX6-AC-041`                             | `CX-S2`         |
| `CX1-FR-038`    | `CX2-BP-02`                                | `CX5-AC-011`, `CX8-AC-005`               | `CX-S0`         |
| `CX1-FR-039`    | `CX2-BP-02`                                | `CX5-AC-016`                             | `CX-S0`         |
| `CX1-FR-040`    | `CX2-BP-02`                                | `CX8-AC-012`                             | `CX-S0`         |
| `CX1-FR-041`    | `CX2-BP-07`                                | `CX7-AC-010`                             | `CX-S2`         |
| `CX1-FR-042`    | `CX2-BP-06`                                | `CX7-AC-029`                             | `CX-S2`         |
| `CX1-FR-043`    | `CX2-BP-08`                                | `CX6-AC-043`                             | `CX-S3`         |
| `CX1-FR-044`    | `CX2-BP-02`                                | `CX6-AC-044`                             | `CX-S2`         |
| `CX1-FR-045`    | `CX2-BP-07`                                | `CX7-AC-042`                             | `CX-S2`         |
| `CX1-FR-046`    | `CX2-BP-08`                                | `CX5-AC-036`, `CX6-AC-043`               | `CX-S3`         |
