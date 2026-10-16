---
canonical_id: proposed.mgbos.product.teestock-customer-platform.cx-09
status: DRAFT
version: 0.1.1
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: PENDING_OWNER_APPROVAL
scope: teestock-customer-platform-phased-delivery-and-product-validation
product_program: PROPOSED_TEESTOCK_CUSTOMER_EXPERIENCE_COMMERCE
product_maturity: PROPOSED_DELIVERY_AND_VALIDATION_PLAN
document_class: product-roadmap-proposal
normative_authority: NONE_UNTIL_APPROVED_AND_ROUTED
engineering_readiness: NOT_READY_FOR_ENGINEERING
implementation_status: PRODUCT_PLANNING_ONLY
repository: Rizkybuilds/bisnishub
repository_branch: main
source_baseline_commit: 2800c474563309bda49d84d712f79b68c9dde36a
source_baseline_checked: 2026-10-16
source_inspection_coverage: selected_product_business_architecture_and_app_paths
source_evidence_mode: REMOTE_READ_ONLY_PLUS_CX00_08_DRAFT_REVIEW
qa_status: AUTHOR_SELF_REVIEW_ONLY
independent_review: NOT_PERFORMED
product_activation: NOT_AUTHORIZED
builder_handoff: NOT_AUTHORIZED
merge_authorization: NONE
deployment_authorization: NONE
production_access_authorization: NONE
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md
last_reviewed: 2026-10-16
review_cadence: upon_owner_adoption_or_material_business_architecture_change
authoritative_for: []
supersedes: null
remediation_package: CX-REM-R1
remediation_review: AUTHOR_SELF_REVIEW_NOT_INDEPENDENT
depends_on:
  - cx-00-source-gap-audit.md
  - cx-01-master-prd.md
  - cx-02-customer-journeys-service-blueprint.md
  - cx-03-experience-design-interaction-spec.md
  - cx-04-commerce-checkout-experience.md
  - cx-05-custom-b2b-ordering-experience.md
  - cx-06-customer-account-service-experience.md
  - cx-07-omnichannel-external-integration-requirements.md
  - cx-08-experience-quality-acceptance-contract.md
  - ../../../../../docs/governance/documentation-constitution.md
  - ../../../../../docs/governance/canonical-source-map.md
  - ../../../../../docs/roadmaps/solo-founder-launch-roadmap.md
  - ../../../../../docs/operating-model/solo-founder-operating-system.md
  - ../../architecture/domain-map-capability-ownership.md
  - ../../architecture/permission-authorization-model.md
  - ../../architecture/command-event-model.md
  - ../teestock-operational-pilot-plan.md
  - ../../../../../bisnis/teestock/10-product-tech/digital-product-vision.md
  - ../../../../../bisnis/teestock/10-product-tech/website-information-architecture.md
  - ../../../../../bisnis/teestock/10-product-tech/commerce-platform.md
---

# CX-09 — TeeStock Phased Delivery & Product Validation Plan v0.1.1

> **Status: DRAFT / NON-CANONICAL / NOT IMPLEMENTATION AUTHORIZATION.**
>
> **Product thesis:** Deliver a customer experience that feels simple, premium, reliable and fast while the underlying operations scale through validated MGBOS capabilities, carefully bounded automation, and genuine physical work.
>
> **Key law:** Customer-platform ambitions do **not** replace the existing solo-founder strategic launch roadmap, Founder Control program, or the approved assisted-sales pilot. This document recommends the sequencing of **customer-platform capabilities within those constraints**; only the designated Owner and canonical owners may adopt or change governing priorities.

## 0. Executive decision brief

### 0.1 Objective

Answer five questions without turning a large future product vision into one unbounded build order:

1. Which customer outcomes should TeeStock validate **first**, before expanding storefront or automation?
2. Which capabilities belong in early premium assisted entry, transactional retail, true self-service, and advanced intelligent commerce?
3. Which business/technical/financial dependencies must be **proven**, not assumed, before the next capability is enabled?
4. What evidence demonstrates both **customer improvement** and **founder workload reduction**?
5. How does the accepted product package reach Head Engineering safely without bypassing current engineering governance?

This is **not** a code architecture, repository-wide master roadmap replacement, financial forecast, list of exact software release dates, provider procurement approval, or Antigravity implementation prompt.

### 0.2 Preferred product progression

```text
CURRENT GOVERNED PROGRAM — OUTSIDE CX OWNERSHIP
  MGBOS Founder Control + operational readiness
  ↓
  Real Custom/Business ASSISTED-SALES pilot when existing gates are passed
  (full public storefront is NOT its prerequisite)

PARALLEL CUSTOMER PLATFORM — PROPOSED PRODUCT SLICES
  CX-S0: premium public discovery + truthful structured Custom/Business inquiry
      ↓ evidence, not feature-count ambition
  CX-S1: eligible retail catalog + guarded checkout/payment + basic order visibility
      ↓ repeatability, proven payment/inventory and support
  CX-S2: authenticated self-service + select omnichannel integrations
      ↓ customer demand, stable internal/partner rules and cost-to-serve
  CX-S3: sophisticated guided custom builder + selective governed intelligence
```

The order is a **dependency default**, not a claim that every feature of an earlier slice must be built before all research, design, or prototype work for later slices. Small UX experiments may occur early in disposable environments. Exposure to real transactions or consequential actions is separately governed.

### 0.3 Decisions explicitly *not* made here

- No automatic approval to add customer login, MGBOS entities, autonomous agents, payment providers, marketplace credentials, or billing accounts.
- No exact launch date or commitments to deliver full retail checkout before the existing assisted-sales pilot.
- No change to the approved domain-map positions of Opportunity, Project, Partner, Person identity, or Customer Case.
- No forced 3D rendering, microservice commerce architecture, cross-channel real-time synchronization, or universal loyalty engine.
- No assumption that repository placeholder packages (`@mgbos/integrations`, events, AI, UI) are implemented services.
- No release allowed merely because CX-00..09 are complete or because sample QA scenarios exist.

## 1. Source of truth and authority mapping

### 1.1 Repository-grounded baseline

**Source snapshot:** `Rizkybuilds/bisnishub`, `main` at `2800c474563309bda49d84d712f79b68c9dde36a`, confirmed on 2026-10-16. This is a reproducible documentation planning snapshot; it is not an assertion about subsequent commits, PR merges, deployments, credentials or provider entitlements.

The following are **verified from the selected repository files at that snapshot**:

- `docs/roadmaps/solo-founder-launch-roadmap.md` is authoritative for cross-system strategic sequence; Custom/Business assisted sales and operational truth are ahead of requiring a full storefront.
- `systems/mgbos/docs/product/teestock-operational-pilot-plan.md` explicitly states the pilot is assisted sales and does not validate retail catalog/cart/checkout/public account.
- `systems/mgbos/docs/product/teestock-founder-control-prd.md` has a separate founder-attention objective; a complete TeeStock storefront is outside that PRD's scope.
- `bisnis/teestock/10-product-tech/{digital-product-vision,website-information-architecture,commerce-platform}.md` contain the existing long-term customer and transactional business vision. They are **inputs** to, not products replaced by, this plan.
- `systems/mgbos/apps/teestock/src/app/page.tsx` is a placeholder; `/custom-atelier/page.tsx` says ordering is not yet available there. **No live customer commerce readiness can be inferred from the shell.**
- `systems/mgbos/docs/architecture/command-event-model.md` documents implemented transaction-command patterns, but no verified complete business-event dispatch/outbox runtime. This constrains CX-S2/S3 and some CX-S1 integration routes.
- `systems/mgbos/docs/architecture/permission-authorization-model.md` requires organization and resource-scoped authority; existing internal roles must **not** be copied into public customer access automatically.
- `systems/mgbos/docs/engineering/maintenance-policy.md` and cross-system control plane require revision-bound evidence and risk-appropriate independent assurance.

**Consequence:** planning for all four slices is legitimate; calling all four **ready to implement** is not.

### 1.2 Ownership hierarchy

| Concern / question | Existing authoritative owner | CX-09 is allowed to do | CX-09 must not do |
|---|---|---|---|
| What business is TeeStock? | `bisnis/teestock/00-foundation/`, strategy, brand | Connect customer jobs to offering | Redefine product lines/brand |
| Pricing, commercial terms, returns, IP | TeeStock finance, service, legal/IP sources | Require accurate representation and review | Set margin floor, rights, refund policy or credit authority |
| Solo-founder cross-system launch order | `docs/roadmaps/solo-founder-launch-roadmap.md` | Propose sub-sequencing for customer experience | Quietly override existing roadmap or pilot gates |
| MGBOS state, commands, money, organization scope | `systems/mgbos/docs/architecture/` | State product outcomes/dependencies | Invent schema, permission role, paid status, work-order entity |
| Automation/JARVIS semantics | `systems/jarvis/docs/`, MGBOS and root governance | Define user-facing benefits/guardrails | Grant AI irreversible transaction authority |
| Exact implementation, QA, PR release | Head Engineering + canonical engineering control | Supply testable product-ready problem/scope | Instruct builder directly or certify deployment |
| Experience design | TeeStock brand source + adopted CX-03 | Stage visible patterns and UX research | Replace canonical identity palette/copy policy |
| Evidence and risk language | Root governance evidence and R0-R5 risk policy | Require traceability and appropriate checks | Create an alternative risk scale or waive hard invariants |

If a CX proposal conflicts with a canonical source, mark `SOURCE_CONFLICT` or `ARCHITECTURE_IMPACT_REQUIRED`, stop affected adoption and route to the semantic owner. The existence of a proposed PRD cannot constitute silent supersession.

### 1.3 Package references and reading route

The CX package is currently locally drafted under the candidate paths listed below; final path/README routing must be reconciled against live main and active document-entrypoint changes (including PR #73 as relevant at adoption time):

1. `cx-00-source-gap-audit.md` — what exists and what remains uncertain.
2. `cx-01-master-prd.md` — master product promises and `CX1-FR-001..046`.
3. `cx-02-customer-journeys-service-blueprint.md` — customer/frontstage/backstage/physical handoffs.
4. `cx-03-experience-design-interaction-spec.md` — accessible, responsive, premium, lightweight behavior.
5. `cx-04-commerce-checkout-experience.md` — retail eligibility and guarded checkout.
6. `cx-05-custom-b2b-ordering-experience.md` — Custom/Business quote, artwork, proof and capacity.
7. `cx-06-customer-account-service-experience.md` — customer identity, cases, returns, reorder.
8. `cx-07-omnichannel-external-integration-requirements.md` — cross-provider mapping and recovery.
9. `cx-08-experience-quality-acceptance-contract.md` — six release quality gates and revision-bound proof.
10. **This CX-09** — capability sequence, measurements, stop conditions, and product-to-engineering handoff.

**Important:** `CX-S0..S3` labels, P0/P1/P2 priority, and roadmap stages have different meanings. See Section 2.

## 2. Vocabulary and sequencing disciplines

### 2.1 Distinct meanings

| Term | Meaning | Does NOT mean |
|---|---|---|
| `CX-S0` | Premium customer entry and assisted-sales experience slice | Existing MGBOS business pilot itself |
| `CX-S1` | Eligible retail self-checkout and bounded customer visibility | Instant availability of all products |
| `CX-S2` | Select governed self-service and omnichannel capabilities | Every marketplace connected |
| `CX-S3` | Advanced eligible custom configuration and intelligence | Autonomous production or AI financial approval |
| `P0`, `P1`, `P2` | Requirement priority bands inherited from CX-01..08 | Operational readiness, binding calendar dates |
| `READY_FOR_PRODUCT_REVIEW` | Internally coherent candidate requiring review | Canonical ACTIVE status |
| `READY_FOR_ENGINEERING_DISCOVERY` | Owner-accepted product problem, scope and dependencies | Implementation contract, builder authorization |
| `QA_PASS` | Tests passed for named scope/identity/revision | Deployment permission, production acceptance |
| `PILOT_PASS` | Observed limited real operating outcomes, with explicit boundaries | Proven scale or multi-marketplace readiness |
| `NOT_VERIFIED` | Required evidence missing, unrun, unobservable or insufficient | Failure necessarily, or permission to claim success |

### 2.2 Planning horizons instead of invented deadlines

Use **readiness-driven gates**; do not fill a Gantt chart with unverified effort estimates or choose dates because there is a historical capital target. The existing roadmap's late-November/early-December-2026 controlled-launch ambition is a strategic planning horizon **subject to readiness and owner capacity**, not a promise that retail P1, omnichannel P2 or advanced P3 will ship by then.

`Lead time estimate` may be recorded only after Head Engineering provides a bounded scope, current technical audit, dependency risk and available implementation capacity. Product researchers may time their research tasks, but those timings are not software delivery promises.

### 2.3 Constraints to optimize

- **Customer:** find the right next action, understand scope and price, avoid repeated data entry and uncertainty.
- **Founder:** spend attention on decisions, vendors, physical QC and delivery, not copying/answering duplicate information.
- **Business:** never sell unsupported stock/capacity/delivery or erode contribution because an interface looks ready.
- **System:** preserve MGBOS as operational truth; keep provider results, AI proposals and screen states subordinate to authorization and transactions.
- **Engineering:** small reversible changes, exact-revision assurance, no conflicting active PR work.
- **Capital:** validate before increasing fixed SaaS/AI fees, API bills, paid media or inventory exposure.

### 2.4 Quality is not a late-stage add-on

Every enabled customer touchpoint, including a simple P0 intake, must have: coherent visual hierarchy, meaningful loading/error/empty states, keyboard and mobile usability, accurate promise wording, accepted privacy/security behavior, and a recovery path. Do not label low quality as a temporary MVP.

Conversely, a P0 feature **must not** pretend to be a checkout, 3D configurator, customer account or real-time order tracker when those flows are not available.

## 3. Parallel tracks and dependencies

### 3.1 Track A — Existing operational truth and Founder Control (`EXTERNAL_ACTIVE_PROGRAM`)

**Owner:** Head Engineering and existing MGBOS program under Owner approval. **CX-09 authority:** visibility/dependency only.

```text
Operational MGBOS spine
  → Founder Control behavior and security assurance
  → operational readiness and real pilot gates
  → approved Custom/Business assisted-sales real transactions
  → evidence on true sales, payment, vendor, QC, delivery, contribution and founder load
```

Do not delay this track merely because CX-S0 public website is not built. Do not use this track's closed software milestones as evidence that P1 retail or external website have been validated. Public-facing features that consume Track A APIs must pass separate security/product reviews.

### 3.2 Track B — Customer Experience Product Definition (`CURRENT_DOCUMENTATION_TRACK`)

```text
CX-00 source audit
→ CX-01 master requirements
→ CX-02..08 specialized experiences, integration and QA contracts
→ CX-09 this staged validation plan
→ package-wide semantic, UX, documentation and traceability audit
→ Owner product direction acceptance
→ Head Engineering technical feasibility and phased contracts
```

Parallel **research** does not mean parallel uncontrolled **writes** to MGBOS. This entire track is documentation-only until an explicit engineering authorization exists.

### 3.3 Track C — Bounded customer-platform implementation (`FUTURE / UNAUTHORIZED`)

Suggested initial work-package families are defined as **discovery candidates** in Section 11. Work starts only through existing Head Engineering intake and change management, after program/source coordination. No single instruction to “implement CX-00..09” is allowed.

### 3.4 Integration points between tracks

| Dependency from Track A | Track B decision or evidence needed | Track C implication |
|---|---|---|
| Lead/Requirement/Quote commands | What minimum Custom/Business input is valuable and safe? | Reuse verified command boundary; no direct public DB writes |
| Founder Attention | Which founder touches are unavoidable versus avoidable? | Do not create duplicate exception dashboard |
| Customer/organization authorization | Can website visitors safely access owned/private resources? | Public identity model requires security review |
| Payment/order financial invariants | Is payment provider acceptance/reconciliation proven? | No real checkout enablement without hard gate |
| Production vendor/QC/fulfillment | When is a customer status reliable? | Public status is a scoped projection, never manual guess |
| Outbox/event runtime | Can external updates be delivered and replayed safely? | Select reliable mechanism per approved slice; no imaginary global bus |
| Business launch capacity | Can founder actually process incremental demand? | Gate marketing/conversion expansion by physical throughput |

## 4. Product outcome hierarchy and customer cohorts

### 4.1 Target customer cohorts

| Cohort | High-value job | First useful experience | Later justified expansion |
|---|---|---|---|
| Individual Custom buyer | Order legitimate personalized garment without mastering print terminology | Guided request, required inputs, receipt/next step | Standard configurator, proofs, repeat orders |
| Small business operator | Buy uniforms/merch for a team | Business inquiry, quote review, human validation | Organizational approval and reorders |
| Procurement approver | Compare spec, terms, price and approved vendor | Formal versioned quote via governed assisted route | Permission-scoped account quote/PO workspace |
| Apparel shopper | Find size, fit and available product | Accurate published offer information | Catalog, filtered browse, cart, authorized checkout |
| Existing customer | Obtain true status or remedy without repeating identity/requirements | Scoped reference and human support | Tracking, portal, returns/self-service, reorder |
| Marketplace customer | Keep provider-specific rights while receiving fulfillment | Governed manual intake where approved | Normalized inbound orders and source-specific support |
| Founder/operator | Know what demands action versus routine | Governed next-action list and intake completeness | Lower-touch case routing/notifications and reconciliation |

### 4.2 Customer outcome priority

The priority is **successful customer task completion**, not the number of deployed screens. Prefer a clear single-page Custom flow that reliably captures a usable requirement over a sophisticated design editor that delivers incomplete production input.

Protect journey continuity: social/WhatsApp → website → intake → authorized quote → payment → production/QC → courier → support/reorder. Changes must not force the customer to restate reliable facts without cause.

### 4.3 Founder outcome priority

Every proposed capability must be evaluated for the founder's **total** workload, including exception chasing, manual vendor coordination, notification repair, support, returns, content maintenance, API costs and physical delivery.

Avoid “automation theater”: a form that captures details but leaves the founder copying them into MGBOS is not a workload reduction. An AI that answers confidently but causes refund/support disputes is a workload increase.

## 5. Four customer-platform release slices

### 5.1 Slice `CX-S0` — Premium entry and governed assisted Custom/Business

**Purpose:** create trustworthy, low-friction digital entry that routes customers to real offers and captures useful Custom/Business demand, while existing assisted-sales remains usable without a finished public website.

**Target journeys:** `JRN-01`, `JRN-02`, `JRN-03`, `JRN-05` (assisted proof where approved), `JRN-06` (human support); see CX-02.

**Candidate experience capabilities:**

- P0 job-based homepage/navigation with plain-language Shop/Customize/Business orientation and truthful availability.
- Real, approved Custom/Business service explanation, minimum feasible quantities, actual contact channels and transparent next-step process.
- Short, accessible guided Custom and Business inquiry; progressive detail; deadline is request, not guaranteed delivery.
- Approved artwork-upload path **only if** file security, size/type policy and storage capability are ready; otherwise an explicitly safe deferred/manual asset-submission path.
- Received confirmation tied to durable authorized record/reference, qualified action owner, recoverable network failure and duplicate-submission handling.
- Customer status/help through approved assisted communication; **no general public record lookup** merely because order IDs exist.
- Founder sees submitted context and appropriate next action without retyping reliable structured inputs, subject to approved MGBOS write boundary.
- Premium, mobile-first, keyboard-accessible appearance following TeeStock's existing neutral-core visual identity.

**Explicitly excluded:** active public cart/checkout, instant binding Custom price, account/organization portal, native AI decision authority, all-channel live stock synchronization, fake “Order Now” path.

**Entry conditions (`CX09-S0-E`):**

1. Verify actual approved TeeStock offer/customer policy, response-owner availability, and practical physical handling capacity.
2. Establish exact existing MGBOS lead/requirement/quote interface/permissions at current source, not from UI mockup.
3. Adopt or reconcile CX-01..03 and CX-05 requirements specific to S0; settle material conflicts in intake and commercial copy.
4. Verify chosen intake processing/storage/privacy/error-recovery shape in a bounded design and technical discovery.
5. Head Engineering and Owner authorize the exact separately bounded implementation, if any.

**Exit evidence (`CX09-S0-X`):**

- Representative mobile, keyboard and assisted-mode users can identify the correct service and finish or safely exit the inquiry.
- Repeated submission or response loss does not create uncontrolled duplicate actionable leads.
- System correctly preserves approved input and produces a reliable reference/owner/next step; errors are actionable, no false success.
- Founder can process a sampled genuine/synthetic request end to end through governed MGBOS without transcription into an independent truth store.
- Copy has no fictional prices, stock, production dates, response guarantees or unbuilt actions.
- CX-08 applicable A/B/C/D/F gates and P0 security/privacy are evidenced; E applies to enabled external components.

**Success hypothesis:** fewer avoidable clarification contacts and less founder re-entry per qualified inquiry, while trust and completion remain high. **This is a hypothesis, not an observed result.**

**Abort/rollback conditions:** public intake exposes private data, produces duplicate business effects, corrupts quotes, falsely claims a sale, causes persistent missing inquiries, or increases founder handling beyond accepted capacity. Fallback to an approved governed human-assisted contact route; do not send customers to an invisible inbox.

### 5.2 Slice `CX-S1` — Eligible retail commerce and trusted order visibility

**Purpose:** permit ordinary retail shoppers to buy truly eligible products without manual quote handling while keeping transaction effects authoritative.

**Candidate capabilities:** published retail product/variant catalog, size guide, search/filter if necessary, honest availability modes, cart, clear final amount, approved guest checkout, payment initiation/verification, reliable order reference, secure receipt/limited tracking, and support recovery. CX-04 controls detailed product intent, CX-06 the protected views, CX-07 relevant provider trust, CX-08 release quality.

**Entry conditions (`CX09-S1-E`):**

- Eligible published products and versions, SKU/variant mapping, stock/ATS/MTO and price book are real and policy-approved.
- Inventory allocation/reservation rules and race behavior reconciled with MGBOS; cart does not claim physical reservation by itself.
- Applicable checkout/payment/financial idempotency and reconciliation commands, authorization, totals and unknown-outcome handling independently proven.
- Payment provider actual eligibility, sandbox, webhook verification, fees and refund/reconciliation responsibilities confirmed for the named account/environment.
- Customer privacy and return/cancellation/fulfillment terms are current; no unsupported tax or shipping promise.
- Ability to fulfill each accepted product in founder/vendor capacity, including out-of-stock handling and customer support.
- User research has demonstrated retail self-service would reduce material friction versus assisted sale; product scope is small and valid.

**Exit evidence (`CX09-S1-X`):**

- Exact proposed retail cohort can complete eligible flow on supported mobile/keyboard; success states reflect real canonical effects.
- One intended order/payment effect under refresh, timeout, duplicate webhook, retry, network split and relevant concurrency.
- No private customer/org data leakage, no fabricated inventory, no unsupported payment/production status.
- Any provider-induced `UNKNOWN` outcome leads to reconciliation and customer-safe help path instead of double charge.
- Retained order/price snapshot permits operator and finance to determine what was purchased, charged and still owed.
- Existing P0 public route performance has not regressed because checkout SDK/cart components were added.
- Evidence fulfills applicable CX-08 gates A–F and governing high-risk (R4/R5 as applicable) controls.

**Excluded:** blanket free shipping/same-day delivery assertions, speculative split-shipment engine, complex loyalty/bundles, all product types, mandatory account signup, AI-controlled pricing or immediate broad marketplace sync.

**Rollback criteria:** payment integrity, auth boundary or inventory allocation failure is blocking; disable binding purchase entry for impacted slice while retaining truthful browsing/assisted service. Do not silently accept orders into chat while payment truth is unknown.

### 5.3 Slice `CX-S2` — Select self-service and scoped omnichannel integration

**Purpose:** allow repeat customers and approved channel transactions to progress without repeated manual founder coordination, **after** customer demand and backend safety justify the exposure.

**Potential capability cells (each independently gated):**

| Cell | Customer value | Key precondition | Default deferral if absent |
|---|---|---|---|
| `S2-A` Protected order/account overview | Find own order without asking | Public/customer identity, role and org scope | Continue protected assisted inquiry |
| `S2-B` Quote/proof approvals | Review exact terms/assets remotely | Versioned authoritative approval command, stale-action tests | Maintain audited assisted acceptance |
| `S2-C` Returns/support request | Track case and requested resolution | Customer Case/Return domain ownership and rights | Human-assisted support with linked context |
| `S2-D` Reorder | Repeat known configuration | Current price/stock/rights and approval revalidation | New scoped Custom/Business inquiry |
| `S2-E` Marketplace inbound adapter | Consolidate eligible external orders | Provider access, seller scope, idempotent mapping, conflict recovery | Approved manual source-linked intake |
| `S2-F` Logistics/messaging | Show true progress/updates | Carrier and notification truth, consent, recovery | Honest manual/status request |
| `S2-G` B2B account workspace | Reduce procurement friction | Multiple contacts, authorization & approval policies | Formal assisted quote/PO flow |

**No single `S2` go-live is obligatory.** For a solo founder, a robust secure reorder feature may have much greater value than adding a second marketplace. Select cells based on repeated real demand, measured support load and provider economics, not trendiness.

**Entry conditions (`CX09-S2-E`):** factual customer contact volume, customer privacy/security requirements, exact MGBOS command availability, legal data and return policies, provider permission/sandbox, monitoring, reconciliation owner, and bounded work-package feasibility. Full automatic outbox/event dispatch must be built and assured **where technically required**; do not assume current package reservation is a functioning event bus.

**Exit evidence (`CX09-S2-X`):** reduction in qualified avoidable support, unchanged authorization integrity, positive net contribution after fees and operational effort, correct third-party mapping and replay, transparent blocked states, low founder recovery overhead, and no deterioration of S0/S1 UX/performance. Required tests include cross-org deep links, quote-version replay, duplicate marketplace events and carrier out-of-order statuses, according to enabled cells.

**Rollback:** disable individual adapter/self-service cell, not indiscriminately the whole business; preserve durable order/case truth, recovery work owner and policy-correct customer communication.

### 5.4 Slice `CX-S3` — Advanced governed custom builder and selective intelligence

**Purpose:** offer delightfully guided customization without demanding that customers learn print production, and without allowing the interface/AI to commit work that cannot be executed.

**Potential cells:** progressive product/configuration designer, placement selector, print-technique compatibility guidance, actual price basis/eligible quote assist, safe artwork preview with explicit limitations, production recipe handoff, deterministic repeat programs, context-aware recommendations and bounded AI explanations. Rich previews, motion, collaborative review and third-party intelligence may be layered on only where user value is shown.

**Entry conditions (`CX09-S3-E`):**

- Approved, **stable sellable configurations** and production rules; validated constraints for garment, size, decoration, placement, print method, MOQ and capacity.
- Reliable and versioned design rights, artwork preview/proof review and customer authorization for exact revision.
- Deterministic margin/pricing, customer expectation mapping and production-release gate: “looks valid” never equals “ready to manufacture”.
- Representative customer research demonstrating the builder is genuinely better than simpler assisted configuration.
- Defensible ROI and cost-to-serve improvement net of asset-processing/render/API fees; rigorous route-level performance impact evaluation.
- Optional AI/tool grants with least privilege, current policy grounding, fallback, cost limits, evaluations and human escalation.

**Exit evidence (`CX09-S3-X`):** customers complete supported configurations faster and with fewer back-and-forth revisions; approved version/recipe/order correspond; invalid design combinations are blocked; no AI-invented price/delivery/revision rights; standard browsing/checkout stays fast with advanced bundles not eagerly loaded; manual production rules remain safe and executable.

**Hard stop:** if physical print/process variability, vendor capability or price margin cannot be modeled truthfully, keep that configuration *assisted* and surface honest escalation. No 3D/AR/AI investment is justified solely by an impressive demo.

### 5.5 Slice-to-requirement priority coherence

The CX-01 vocabulary sometimes uses `P1/P2` to express intended feature priority and `CX-S1..S3` for release bundles. Priorities do not map one-to-one to whole slices: an otherwise P1 customer-support view may be deferred from CX-S1 until identity/Customer Case readiness is proven; an S2 provider adaptor can be deferred until S3 or indefinitely. This is **not** a contradiction if each deferral is explicit and approved.

The effect of a newly proposed engineering slice must be reversible or isolated where practical. A new checkout capability cannot be bundled with speculative marketing recommendations merely because both share a Next.js app.

## 6. Priority model: demand, risk and founder leverage

### 6.1 Must-have vs attractive

A premium-looking feature is not automatically an early-stage priority. Assess each capability on **observable customer benefit, avoidable founder work, cash consequence, physical feasibility, dependency maturity and operational reversibility**.

**Proposed scoring framework (`CX9-PRI-01`) — for comparative discovery only:**

| Factor | Qualitative rating | Why it matters | Evidence source |
|---|---|---|---|
| Customer job severity/frequency | Low / Medium / High / Unknown | Are real customers blocked or repeatedly asking? | Approved inquiry/case/pilot observations |
| Founder burden reduction | Low / Medium / High / Unknown | Will it save repeat work after maintenance/recovery? | Actual touch/time ledger and owner diary |
| Commercial effect | Unclear / Supporting / Measured | Does it protect contribution, qualified demand, reorders? | Real order economics and valid price data |
| Technical/business dependency maturity | Unknown / Partial / Proven | Can we safely fulfill what the screen offers? | Architecture/source/provider/QA evidence |
| Failure consequence | Governed canonical risk R0–R5 | Is money, organization data or physical output at risk? | Root risk framework; technical review |
| Operating cost/maintenance | Estimate needed / Within budget / Exceeds budget | Does tooling consume runway or add support load? | Quoted/actual fees and owner-approved limits |
| Reversibility | Simple / Controlled / Hard | Can a faulty feature be switched off safely? | Product/engineering fallback exercise |

**Do not turn unknown inputs into false numerical certainty.** Scoring may use transparent ordinal descriptions for research prioritization. Final ordering is **gated**: failure of permission/payment/commercial truth/physical feasibility cannot be outweighed by an attractive customer benefit score.

### 6.2 Stop/go ordering algorithm

```text
1. DOES THIS SUPPORT A REAL CUSTOMER JOB OR VERIFIED PAIN?
   No/unknown → research/prototype, not production build.

2. IS THERE AN APPROVED BUSINESS OFFER/POLICY AND PHYSICAL EXECUTION PATH?
   No → stop, refine business process.

3. DOES MGBOS HAVE THE RIGHT AUTHORITATIVE COMMAND/DATA/PERMISSION MODEL?
   No/unknown → Head Engineering discovery, no frontend promise.

4. DOES THE CAPABILITY ADD MONEY, PRIVATE DATA, AI AUTONOMY OR EXTERNAL PROVIDERS?
   Yes → apply required domain and risk gates.

5. WILL IT REDUCE CUSTOMER EFFORT *AND/OR* MATERIAL FOUNDER WORK,
   NET OF SUPPORT, MAINTENANCE, RISK AND PROVIDER COSTS?
   No/unknown → bounded research or defer.

6. CAN IT BE DELIVERED/VERIFIED AS A SMALL COHERENT VERTICAL SLICE?
   No → split it.

7. IS OWNER CAPACITY/FINANCING AND RELEASE AUTHORIZATION EXPLICIT?
   No → plan only; do not implement or expose.
```

### 6.3 Product candidate sequencing table (`CX9-PRI-02`)

| Capability | Default priority | Real user evidence to seek | Technical dependency | Founder work effect | Product recommendation |
|---|---|---|---|---|---|
| Truthful public service information | CX-S0 | Visitors reach correct offer | Brand and approved business terms | Fewer basic explanations | Early design/validation |
| Structured Custom inquiry | CX-S0 | Reduced missing specs and follow-ups | Secure scoped intake + MGBOS mapping | Lower retyping/triage | First possible customer vertical slice |
| B2B assisted quote progress | CX-S0 | Clients can understand steps | Quote version/authorization and communications | Fewer ad hoc status messages | Include only verified claim surface |
| Enhanced visual design/microinteraction | CX-S0 onwards | Improved comprehension and trust | CX-03 patterns, CX-08 budgets | Better conversion; maintenance risk | Include selectively, never as heavy prerequisite |
| Retail sellable catalog | CX-S1 | Actual retail assortment demand | Product/variant/content/price/ATS truth | Fewer product clarifications | After eligible assortment audited |
| Self-checkout/payment | CX-S1 | Valid direct-purchase use case | Payment, inventory, idempotency, refund and provider readiness | Avoid assisted retail tasks, raises operational risks | High-value but high assurance |
| Authenticated customer status | CX-S1/S2 | Repeated status inquiries | Public identity and organization authorization | Fewer repetitive updates | Gate via secure read model |
| Proof/quote digital approval | CX-S2 | Delays from human document rounds | Exact version command and approver rights | Potentially large saving for repeat B2B | Favor when verified throughput pain |
| Reorder of standardized product | CX-S2 | Repeat customers and stable product | Versioned price/rights/capacity | Reduced requalification | Consider before additional marketplace |
| First inbound marketplace channel | CX-S2 | Profitable validated channel volume | Seller account, adapter, dedupe, reconciliation | Saves manual import, adds monitoring | One provider at a time |
| Outbound inventory/price sync | CX-S3 or later | Frequent oversell/manual sync cost | ATS correctness, events/adapter, provider limits | High potential, high failure consequence | Defer until real need and assurance |
| Customer support automation | CX-S2/S3 | Repeated low-risk tickets | Canonical cases/policy retrieval + safe AI | Reduces routine, can amplify wrong info | Start with deterministic answers and human exit |
| Production-capable visual builder | CX-S3 | Supported configuration repeat rate | Product/recipe/artwork/pricing/QA standardization | Can reduce quote revisions | Conditioned on physical rules |
| Advanced personalization/3D/AR | CX-S3+ | Usability study proves value | Budget, legal/assets, loading/isolation | Unknown/possibly negative | Experiment, not commitment |

### 6.4 Capacity-aware release rule (`CX9-PRI-03`)

If the founder can physically process at most an owner-approved level of qualified demand, raising website conversion beyond capacity can reduce quality and trust. Therefore marketing ramp, stock exposure, automatic payment acceptance and production commitments must be tied to actual capacity signals and an owner-governed stop mechanism. This plan **does not supply or invent** capacity figures.

## 7. Dependency graph and capability readiness ledger

### 7.1 Dependency graph (`CX9-DEP-01`)

```text
BUSINESS OFFER + RIGHTS + COMMERCIAL TERMS
        ↓
CUSTOMER NEED + JOURNEY + CX DESIGN CONTRACT
        ↓
MGBOS REUSE/CAPABILITY FEASIBILITY REVIEW
        ├─ approved Lead/Requirement/Quote path ──→ CX-S0
        ├─ Product/SKU/Price/ATS + Payment/Order → CX-S1
        ├─ Customer/org approval + Case/Return ───→ CX-S2
        ├─ Provider adapter + reconciliation ────→ CX-S2 selective channels
        └─ Recipe/Artwork/Capacity + determinism ─→ CX-S3
        ↓
RISK / SECURITY / ACCESSIBILITY / PERFORMANCE / RECOVERY TESTS
        ↓
OPERATIONAL OWNER + OWNER RELEASE DECISION
        ↓
ACTUAL LIMITED CUSTOMER EXPERIENCE
        ↓
EVIDENCE + LEARNING + NEXT PRODUCT DECISION
```

### 7.2 Readiness classifications

Use `CURRENT_VERIFIED`, `PARTIAL`, `TARGET_DEFINED`, `UNKNOWN`, `BLOCKED`, `NOT_APPLICABLE` only when backed by exact source/evidence. Existing source documents may use their own formal classifications (`CURRENT`, `PARTIAL`, `NEXT`, `CANONICAL_TARGET`, etc.); never rewrite those categories in technical authority.

| Dependency | CX-S0 | CX-S1 | CX-S2 | CX-S3 | Current product evidence status |
|---|---|---|---|---|---|
| Approved offers/policies | REQUIRED | REQUIRED | REQUIRED | REQUIRED | Business source exists; specific active sellable offers need confirmation |
| Existing Lead/Requirement/Quote commands | REQUIRED for integrated intake | Optional | Select tasks | Optional | Transaction spine exists; public exposure NOT_VERIFIED |
| Customer website shell | Not sufficient | Not sufficient | Not sufficient | Not sufficient | Placeholder only at inspected main |
| Public auth/session/ownership | Minimal P0 if no private read | REQUIRED for private checkout/lookup | REQUIRED | REQUIRED for account features | Public customer auth NOT_VERIFIED |
| Canonical product/variant/price/stock | Informational where approved | REQUIRED | REQUIRED for reorder/sync | REQUIRED | Full retail catalog-to-checkout assurance NOT_VERIFIED |
| Financial/payment provider boundary | Assisted governed pilot can operate independently | REQUIRED | For affected features | For affected features | Provider readiness NOT_VERIFIED |
| External events/outbox | Conditional | Conditional | Often important | May be important | Full dispatch/outbox NOT YET IMPLEMENTED at source baseline |
| Return/Customer Case actual model | Human support acceptable | Need supported post-sale path | REQUIRED if self-service returns/cases enabled | Optional | Do not infer canonical entities from business docs |
| Production recipe + price calculation | Human review acceptable | Only for eligible MTO | Reorder revalidation | REQUIRED for instant builder | Rules/eligibility NOT_VERIFIED for public builder |
| QA and production/backup readiness | Per enabled path | Full applicable set | Full applicable set | Full applicable set | NOT_VERIFIED for unbuilt customer platform |

### 7.3 Dependency owner and evidence record (`CX9-DEP-02`)

Every candidate capability entering engineering discovery should have an explicit ledger row:

```yaml
capability_id: CX9-CAP-EXAMPLE
customer_job: "What the customer needs to complete"
slice_candidate: CX-S1
requirement_refs: [CX1-FR-023, CX4-FR-021, CX8-AC-018]
business_policy_owner: "path + version"
mgbos_semantic_owner: "path + version"
current_source_revision: "exact SHA from refreshed main/candidate"
current_evidence: NOT_VERIFIED
provider_or_operational_dependency: "named evidence or NONE"
risk_class: "resolved by canonical engineering process; never default low"
identity_boundary: "actual customer / organization scope"
release_condition: "observable acceptance, not just feature present"
fallback_owner: "named business role or person after approval"
decision_status: PROPOSED
```

The example is a **contract template**, not an assertion that these refs collectively implement a checkout. Any `UNVERIFIED` row blocks claiming the related technical effect is ready, but may allow an earlier unaffected customer path.

### 7.4 Business policies must lead engineering

If the business cannot state a stable permitted fabric/garment, decoration method, quantity, revision limit, delivery expectation or customer-rights policy, a complex interface does not make the unknown policy authoritative. Revisit `bisnis/teestock/` commercial owner first. Then ask MGBOS whether an existing canonical mechanism supports the approved rule.

## 8. Product validation program: experiments before and after release

### 8.1 What constitutes evidence

**Accepted evidence hierarchy:** real observed customer behavior under permission and consent; governed pilot transaction records; task-level usability tests with clear participants, fixtures and dates; reproducible exact-version product/browser QA; provider sandbox evidence when applicable; source checks and operator reconciliation. Interviews and prototypes are useful for discovery but cannot establish financial integrity or production readiness.

Do not fabricate conversion rate, order volume, NPS, checkout success, real-user p75 Core Web Vitals, founder savings, supplier performance or market demand. When absent use `BASELINE_NOT_ESTABLISHED` or `NOT_VERIFIED`.

### 8.2 Validation experiments (`CX9-EXP-*`)

| Experiment ID | Hypothesis | Cohort / method | Primary evidence | Boundary and decision |
|---|---|---|---|---|
| `CX9-EXP-01` | Job-based navigation gets visitor to the right service without reading company structure | Representative first-time apparel and print-intent users; moderated/unmoderated task | Task route, confusion, backtrack and accessibility notes | Prototype; no production backend required |
| `CX9-EXP-02` | Structured Custom intake reduces missing requirements | Comparable real/synthetic Custom inquiry tasks versus approved assisted form | Completeness, correction count, founder follow-up minutes | No hidden direct transactional writes |
| `CX9-EXP-03` | Business quote steps make commitment status understandable | Procurement/requester/approver scenarios | Distinguish estimate vs approved version, PO vs quote and next action | No fabricated approved quotes/credit |
| `CX9-EXP-04` | Customer receipt/status copy reduces avoidable WhatsApp questions | Consented test/approved controlled pilot | Follow-up contacts by reason, accurate status comprehension | Only actual verified state presented |
| `CX9-EXP-05` | Checkout reduces buying effort without incorrect total/payment effects | Eligible retail pilot after financial gates | End-to-end task, reconciliation, cancellations, fees, support cost | Controlled environment; no real charge before authorization |
| `CX9-EXP-06` | Account/quote/reorder helps repeat customers | Repeat B2B customer research, exact-version task | Saved steps, request-to-approval time, mistakes, authorization tests | No premature role grants; P1/P2 gating |
| `CX9-EXP-07` | First marketplace adapter saves net founder effort | Single named channel after access/feasibility confirmed | Duplicate avoidance, import completeness, manual-recovery effort, contribution after platform fee | Sandbox before limited live; no broad sync |
| `CX9-EXP-08` | Enhanced custom builder is better than guided assisted flow | Configurable/complex products in prototype with real rules | Correct configuration rate, time, edit cycles, accessible tasks | Prototype cannot price/commit outside MGBOS |
| `CX9-EXP-09` | Automation/AI reduces support with no unbounded wrong commitments | Non-sensitive repeated support intents plus adversarial prompts | Grounded-answer rate, handoff rate, false promises, cost per resolved case | AI output not source of truth |
| `CX9-EXP-10` | Premium media/motion does not harm completion/performance | Light version vs enhanced version, relevant mobile devices | User task completion, lab route deltas, accessibility and field data only when available | Fallback to lightweight route if costs outweigh benefit |

### 8.3 Research sampling rules

The product researcher SHOULD recruit across distinct user jobs and device/accessibility realities, rather than relying only on friends who already understand printing. For Custom include first-time personal buyers and a customer who supplies imperfect artwork. For Business include both requesters and people who must approve/reconcile a quotation. For retail include variant/size uncertainty and an interrupted payment scenario.

Record recruitment source, limitations, sample size, environment and exact version of prototype/product. **Sample size and statistical decision thresholds must be approved per experiment before outcomes are seen**; no post-hoc success claim from a few convenient testers. Qualitative patterns can motivate improvements but do not prove conversion uplift.

### 8.4 Test fixtures / representative journeys (`CX9-FIX-*`)

- `CX9-FIX-01`: Personal customer requests 12 custom shirts, has uncertain garment size, no finalized artwork, asks for a deadline requiring review.
- `CX9-FIX-02`: Company requester asks for 100 uniform tees with three sizes; procurement approver needs versioned quote and PO reference; production needs supplier and QC routing.
- `CX9-FIX-03`: Retail buyer selects variant that becomes unavailable before checkout; price/shipping total changes and requires consent.
- `CX9-FIX-04`: Network loss after an inquiry/checkout submit; second click must not create duplicate commercial effect.
- `CX9-FIX-05`: Payment redirect says success, provider confirmation is late; UI remains pending and controlled recovery is possible.
- `CX9-FIX-06`: Employee from Business Account A receives Account B's quote deep link; authorization denies exposure and action.
- `CX9-FIX-07`: Marketplace order webhook delivered repeatedly or from wrong seller/tenant; original effect remains one and no unrelated customer data leaks.
- `CX9-FIX-08`: Physical vendor reports produced 100 units but QC only 97 pass; customer does not receive false ready-to-ship status and owner has next action.
- `CX9-FIX-09`: Courier label generated before founder hands over parcel; customer sees the real handoff state, not false shipped event.
- `CX9-FIX-10`: AI provider unavailable or generates an unsafe refund claim; deterministic support and human owner route remain available.

**Fixtures are synthetic and contain no actual customer secrets.** Change them only as tests/operational policy require, preserving validation provenance.

## 9. Product scorecard and founder workload economics

### 9.1 Measurement principles

Track **customer outcomes** and **operator consequences** together. A strong business outcome is not merely increased lead count or GMV: if low-quality requests double manual clarification, seller fees erase contribution or refunds spike, the feature may harm the solo founder.

Proposed event/metric collection must respect privacy/consent and must not become another competing source of order truth. Analytics records observe validated business states; they do not create state or store payment credentials/artwork content.

### 9.2 Scorecard (`CX9-MET-*`)

| Metric | Definition / denominator | Observation method | Baseline today |
|---|---|---|---|
| `CX9-MET-01` Customer job routing | Qualified visits/tasks that find appropriate eligible path / eligible observed visits/tasks | Tested tasks and privacy-compliant analytics | NOT_ESTABLISHED |
| `CX9-MET-02` Inquiry completion | Valid completed inquiries / eligible intentful started inquiries | Accepted form and request record | NOT_ESTABLISHED |
| `CX9-MET-03` Inquiry completeness | Accepted inquiries with minimum production/quote-relevant data / sampled accepted inquiries | Reviewed structured record | NOT_ESTABLISHED |
| `CX9-MET-04` Avoidable follow-up contacts | Contacts caused by missing/unclear information per legitimate inquiry/order | Case/contact reason with consent | NOT_ESTABLISHED |
| `CX9-MET-05` Founder manual touch count | Founder actions necessary for one governed order, excluding deliberate approvals/physical work separately reported | Sampled workflow logs + owner diary | NOT_ESTABLISHED |
| `CX9-MET-06` Founder administrative minutes | Human attention on copying, clarifying, reconciling, status requests per eligible order | Explicit time sample, not AI estimate | NOT_ESTABLISHED |
| `CX9-MET-07` Founder physical handling minutes | Sourcing, receiving, QC, packing, courier handoff | Process sampling; capacity indicator | NOT_ESTABLISHED |
| `CX9-MET-08` Request-to-approved-quote duration | From usable request acceptance to approved customer-facing quote, excluding clearly classified waiting periods | MGBOS timestamp + manual evidence | NOT_ESTABLISHED |
| `CX9-MET-09` Checkout completion | Legitimately initiated eligible checkouts that result in confirmed intended order/payment as defined / eligible starts | Canonical source reconciliation and browser telemetry | NOT_APPLICABLE_P0 |
| `CX9-MET-10` Transaction correction / duplicate effect | Incorrect/duplicate intended business effects per applicable attempts | Audit + negative tests + operational investigation | NOT_VERIFIED |
| `CX9-MET-11` Support self-service success | Correctly resolved low-risk requests without human rework / eligible requests | Case closure and user-reported usefulness | NOT_APPLICABLE_P0 |
| `CX9-MET-12` Reorder friction | Steps/time/support needed to repeat an allowed configuration | Task-level measured comparison | NOT_APPLICABLE_P0 |
| `CX9-MET-13` External-channel import health | Correctly reconciled imports versus eligible provider source records, including retry/conflict time | Provider sandbox/live authorized audit | NOT_APPLICABLE_P0 |
| `CX9-MET-14` Net contribution by channel | Governed revenue less actual applicable direct cost, platform, payment, shipping subsidies, exception cost | Business financial ledger + channel economics | NOT_ESTABLISHED |
| `CX9-MET-15` Experience reliability | User-visible critical task failures and recovery completion per observed task | Browser tests, incidents and approved telemetry | NOT_VERIFIED |
| `CX9-MET-16` Core Web Vitals field | LCP, INP, CLS at p75 segmented as CX-08 requires | Real-user field data when volume exists | NOT_VERIFIED_FIELD |
| `CX9-MET-17` Accessible task success | Critical tasks completed by selected assistive input paths and user cohorts | Manual keyboard/AT + verified browser runs | NOT_VERIFIED |
| `CX9-MET-18` AI cost-to-serve | Provider cost + recovery/QA effort for successfully governed assisted interactions | Invoices/token metrics + human cost record | NOT_APPLICABLE_P0 |

`NOT_APPLICABLE` differs from `NOT_VERIFIED`. The former is for features intentionally absent from the slice; the latter is for applicable claims whose evidence has not been produced.

### 9.3 Founder attention ledger (`CX9-MET-19`)

For sampled customer work use fields:

```text
case_or_order_reference (scoped, no exposed PII)
source_channel
customer_job
funnel_stage
human_touch_type: REQUIRED_APPROVAL | REQUIRED_PHYSICAL | AVOIDABLE_ADMIN | CUSTOMER_RECOVERY | PROVIDER_FAILURE
human_time_minutes_observed
system_time_or_latency_if_relevant
retry_count
status_contacts_count
vendor_hand_offs_count
workflow_or_integration_fees_if_known
root_cause
production_evidence_reference (only when authorized)
user_task_outcome
```

This may initially be a governed research/measurement artifact and **must not** become a second operational source of order/payment truth. Where current instruments are missing, small consented samples can be recorded explicitly as observations, not automated totals.

### 9.4 Net benefit test (`CX9-MET-20`)

For an automation/self-service proposal, compare:

```text
ACTUAL AVOIDABLE HUMAN ADMIN REDUCTION
+ OBSERVED CUSTOMER FRICTION REDUCTION / REPEAT OPPORTUNITY
− NEW HUMAN EXCEPTION / SUPPORT / MONITORING WORK
− PROVIDER / COMPUTE / AI / STORAGE FEES
− SECURITY / QA / CONTENT MAINTENANCE BURDEN
= NET PRODUCT LEVERAGE, expressed using observed inputs
```

Do not assign arbitrary monetary value to qualitative user delight. Economic conversion of time must use an approved assumption/financial source. **Savings never waive a high-risk safety failure.**

### 9.5 Proposed decision thresholds — must be pre-registered

Before each `GO/ITERATE/HOLD/STOP` decision, the product owner and Head Engineering/QA as appropriate should record: cohort, sample, baseline, primary success outcome, minimum material benefit, maximum tolerated negative outcome, critical safety failures that force STOP, measurement confidence limits and the next review trigger.

This draft intentionally **does not invent numeric conversion or time-saving targets** absent real baselines. The quality standards in CX-08 (e.g., adopted accessibility and Core Web Vitals targets) remain separate; performance field p75 cannot be declared PASS before real-user evidence exists.

## 10. Delivery process and product acceptance obligations

### 10.1 Product-level delivery requirements (`CX9-DR-*`)

These requirements govern **sequencing and validation**. They are not replacements for CX-01 customer functional requirements or any existing MGBOS security/transaction contract.

| ID | Proposed product/delivery obligation | Acceptance evidence | Main owner |
|---|---|---|---|
| `CX9-DR-001` | Keep active assisted-sales Founder Control pilot independent of full public storefront readiness | Roadmap/pilot dependency statement and no invented website launch gate | Owner + Head Engineering |
| `CX9-DR-002` | Preserve CX-01 four release-slice names and scope semantics | Trace to `CX-S0..S3` without contradictory new hierarchy | Product |
| `CX9-DR-003` | Enforce one customer job per vertical slice and declare excluded adjacent capability | Brief shows user, start/end, value, non-goals, fallback | Product + Engineering |
| `CX9-DR-004` | Establish current/source, proposed/target and unknown state per dependency | Exact revision and evidence status per dependency ledger | Head Engineering |
| `CX9-DR-005` | Require approved offer and commercial-policy evidence before public promises | Copy-to-source trace with owner review | TeeStock business owner |
| `CX9-DR-006` | Avoid full retail checkout as prerequisite for P0 assisted entry | S0 case completes without cart/payment integration | Product + QA |
| `CX9-DR-007` | Do not expose failed/unimplemented CTA, portal or instant quote | Page/UI inventory demonstrates truthful conditional publication | Product/Frontend |
| `CX9-DR-008` | Check founder capacity before expanding automatic order acceptance | Owner capacity evidence and operational fallback | Owner + Operations |
| `CX9-DR-009` | Record founder unavoidable physical touches apart from avoidable administration | Observed ledger on representative Custom/Business pilot | Operations/Product |
| `CX9-DR-010` | Tie public intake to governed lead/requirement context only after authorization and idempotency review | Repeated submission tests and valid source context | Head Engineering |
| `CX9-DR-011` | Require financial and inventory integrity before P1 paid checkout | Exact-head negative/replay/concurrency/sandbox evidence as applicable | Finance/Security/QA |
| `CX9-DR-012` | Require actual provider eligibility and permitted sandbox before provider-dependent build | Named provider-account/terms/quota/access record | Integration engineer/Owner |
| `CX9-DR-013` | Treat private customer/organization portal as separate public-auth assurance work | Role/membership/resource negative tests | Security/MGBOS architecture |
| `CX9-DR-014` | Allow selective S2 subfeatures rather than monolithic portal/platform | Independently gated S2-A..G cells, explicit deferrals | Product + Head Engineering |
| `CX9-DR-015` | Require actual channel economics before scaling marketplace sync | Provider fees, operational cost, contribution and exception trend | Owner/Finance |
| `CX9-DR-016` | Verify actual event/outbox or alternative reliable integration mechanism before claiming async guarantee | Source, trace and replay evidence, not placeholder export | Head Engineering |
| `CX9-DR-017` | Require stable production and pricing eligibility before advanced custom builder | Confirmed product/method/placement/MOQ/recipe/price test fixtures | TeeStock production + MGBOS architecture |
| `CX9-DR-018` | Keep AI optional and constrained by canonical permissions and cost | No-AI fallback, adversarial tests, provider-cost scope | JARVIS/security/product |
| `CX9-DR-019` | Preserve earlier route speed and task success when later bundles are introduced | Approved comparative browser/performance evidence | Frontend QA |
| `CX9-DR-020` | Pre-register each material product experiment | Hypothesis, sample, primary metric, thresholds before observation | Product research |
| `CX9-DR-021` | Keep simulated/pilot/sandbox/live evidence separate | Evidence package uses explicit environment and assurance status | QA + Evidence owner |
| `CX9-DR-022` | Require cx8 six release gates only for features actually enabled | Applicability matrix, NO broad green from missing features | QA/Head Engineering |
| `CX9-DR-023` | Require observed net founder benefit for repetitive-work automation | Manual-touch and provider cost comparison, including recovery work | Product/Operations |
| `CX9-DR-024` | Use source-of-truth and non-duplication review before new domain or package design | Architecture impact record against current canonical owners | Head Engineering |
| `CX9-DR-025` | Do not change product status to ACTIVE without authorized approval and navigation reconciliation | Owner record, README/source-map and version metadata updated deliberately | Owner/documentation steward |
| `CX9-DR-026` | Route accepted product requirements through engineering discovery and bounded contracts | Exact scope, risk, tests and authorization per IC/WP | Head Engineering |
| `CX9-DR-027` | Do not infer release from passing CI or attractive screenshot | Dated operational, security, provider and owner-gate evidence | QA/Owner |
| `CX9-DR-028` | Maintain safe disable/fallback for every consequential enabled integration | Recovery drill and named recovery owner | Engineering/Operations |
| `CX9-DR-029` | Avoid creating a MultiGraph product PRD inside TeeStock documents by stealth | Reuse patterns only; separate MultiGraph business/customer scope | Owner/Product |
| `CX9-DR-030` | Stop and re-audit evidence when relevant source or PR candidate changes | Latest diff/head and re-verification decisions preserved | Head Engineering/Independent QA |

### 10.2 Definition of Ready (product-to-engineering discovery)

`CX9-DOR-01` — A candidate feature is ready for **engineering discovery**, not implementation, only when:

1. One primary end-user job and explicit target cohort are stated.
2. Required truth-facing business/source owners and customer-rights policies have been identified.
3. User-visible success, error, waiting and human-fallback states are defined.
4. Requirement IDs from CX-01 and detailed CX-02..08 documents are linked, without duplicating norms.
5. Functional boundary, actor/organization context, affected money/capacity/physical state are declared.
6. The applicable readiness ledger is populated with verified vs unknown dependencies.
7. Expected customer and founder benefits and measurement plan are pre-registered.
8. The product owner identifies non-goals, safety stops, first small useful slice and future extensions.
9. Open decisions that materially alter the slice are approved or explicitly block engineering commitment.
10. Owner authorizes **discovery**, under the existing governance and competing program priority.

`DOR_PASS` must not be confused with `IMPLEMENTATION_AUTHORIZED` or `DEPLOY_AUTHORIZED`.

### 10.3 Definition of Done for a product slice (`CX9-DOD-01`)

A slice is **product-accepted for its declared environment** only when:

- The promised customer tasks genuinely work in the exact candidate, with meaningful recovery on supported devices.
- Applicable CX-08 release gates and current system risk/security controls have documented successful evidence.
- Current approved business policies match live/preview copy and state; no fabricated payment, shipment or production status.
- Privacy/authorization, replay/concurrency, versioned approval and provider negatives are covered where relevant.
- Operators can identify and finish all material manual/physical handoffs; no silent chat-only state.
- Monitoring/ownership, bounded fallback, backup/recovery and provider dependencies are proven for the exposed environment.
- Product metrics either have initial valid observations or explicitly state pre-launch `BASELINE_NOT_ESTABLISHED` where this cannot yet be measured; no false field-p75 claims.
- Exact code revision, relevant test artifact and independent audit as required by governance are linked.
- **Owner explicitly accepts the product and release scope**; deployment remains separately authorized.

A customer-facing feature may meet `DOD_TEST_ENVIRONMENT` but be `LIVE_BLOCKED`. Record both statuses truthfully.

## 11. Suggested bounded engineering discovery packages — not instructions

This section helps Head Engineering plan, not Antigravity start coding. It is a **product capability boundary map**, with deliberately small independent investigations.

| Candidate discovery ID | Product problem and likely first slice | Precondition / evidence | Out-of-scope reminder |
|---|---|---|---|
| `CX9-DISC-01` | Check current source/branch, existing TeeStock shell, URL/brand entry and customer-facing app ownership | Docs/adoption reconciliation, active PR review | No code changes yet |
| `CX9-DISC-02` | Verify suitable public Lead/Requirement intake / idempotency / organization context for S0 | MGBOS command audit and unauthorized input negative tests | No public direct DB mutation |
| `CX9-DISC-03` | Build accessible premium service pages and real inquiry entry, **if separately approved** | Owner-approved S0 product copy/UI + bounded frontend plan | No checkout or builder piggyback |
| `CX9-DISC-04` | Evaluate safe artwork file-intake capability | File/private storage/legal rights/limits and malware/URL policy | No auto production approval |
| `CX9-DISC-05` | Define supported retail product publish and price/ATS projection | Source catalog/pricing/inventory and security review | No product master duplication |
| `CX9-DISC-06` | Evaluate authorized guest/retail checkout and financial-effect contract | Payment R5 as classified by current governance, provider sandbox, finance invariants | No charge from UI state |
| `CX9-DISC-07` | Evaluate customer-scoped status/account read and organization roles | Identity/RLS/API/auth negative tests, case boundary | No inherited back-office admin permissions |
| `CX9-DISC-08` | Scope one exact quote/proof approval interaction | Versioning, stale approval, quote/order/business constraints | No implicit project domain |
| `CX9-DISC-09` | Scope one marketplace inbound order adapter | Provider eligibility, seller identity, source mapping, retry conflict | No outbound all-channel sync |
| `CX9-DISC-10` | Scope carrier/status or transactional notification interface | Physical handoff evidence, consent/secret/reliability | No invented real-time promise |
| `CX9-DISC-11` | Evaluate durable async/outbox if one approved integration truly requires it | Canonical ADR/source gap, producer/consumer proof | No generic message bus initiative |
| `CX9-DISC-12` | Evaluate deterministic guided custom configuration before design editor | Approved production recipe, eligible price, artwork handling, vendor/QC | No unconditional 3D/AI builder |
| `CX9-DISC-13` | Assess targeted AI support as a low-risk assist layer | Grounded policy, anti-false-promise evals, token/cost cap and fallback | No universal runtime agent authority |
| `CX9-DISC-14` | Design precise release QA/monitoring for each accepted vertical slice | CX-08 quality matrix, current source/CI, independent roles | No one-time global QA certificate |

For every approved discovery, Head Engineering should issue its own technical plan, impact assessment, risk class under the **existing** risk policy, IC/WP, affected paths, proposed tests and owner authorization boundary. Use the existing PR lifecycle; do not open multiple overlapping modifications to payment/auth/outbox/document entrypoints at once. Neither scope expansion nor deployment is authorized by this table.

### 11.1 Proposed earliest engineering question

> **What is the smallest safe, real S0 customer intake experience that provides the founder with an authorized, non-duplicated usable requirement, while retaining existing Custom/Business pilot flow and satisfying premium UX quality?**

This is a more useful first bounded discovery question than “build the whole TeeStock website.” It lets the Head Engineering team validate existing code and business truth before committing public-data exposure. It is a **recommendation contingent on Owner adoption**, not a forced engineering priority above ongoing R4/R5 assurance work.

## 12. Product acceptance scenarios (`CX9-AC-*`) — draft, NOT EXECUTED

The acceptance catalogue tests **sequencing, decision integrity and product outcomes**; detailed behavior/negative security tests remain owned by CX-02..08 and system-specific canonical QA contracts.

| ID | Given / when / then | Expected evidence |
|---|---|---|
| `CX9-AC-001` | Given active MGBOS assisted-sales pilot, when customer platform remains a shell, then pilot readiness is assessed using its existing approved gates rather than blocked by missing storefront | Roadmap/pilot applicability decision |
| `CX9-AC-002` | Given S0 discovery, when user is unsure whether to Shop or Custom, then job-based navigation leads to an appropriate real next step | Moderated task + IA review |
| `CX9-AC-003` | Given P0 Custom intake, when user has no artwork, then “artwork not ready” path remains truthful if allowed and no pseudo-approval occurs | UI/service task and policy trace |
| `CX9-AC-004` | Given standard inquiry interrupted after submission, when client retries, then only intended accepted business action occurs and reference/next step is recoverable | Source/command replay + browser test |
| `CX9-AC-005` | Given public offer with unknown stock/time/price, when customer reads, then no binding availability or SLA guarantee appears | Copy audit + source fact check |
| `CX9-AC-006` | Given P0 service landing enabled but no checkout, when pressing primary CTA, then customer enters approved inquiry/help, not dead checkout | Real route and browser test |
| `CX9-AC-007` | Given temporary provider outage, when P0 inquiry cannot be delivered, then visible safe failure/help/fallback exists and owner can investigate | Fault exercise and next-owner proof |
| `CX9-AC-008` | Given public S0 feature proposal, when developer exposes direct MGBOS table write, then architecture gate rejects unauthorized shortcut before release | Security/architecture review |
| `CX9-AC-009` | Given first S0 pilot group, when reporting completion, then founder manual re-entry/admin and physical labor are separately measured rather than guessed | Time sample and traceable transaction |
| `CX9-AC-010` | Given high traffic but limited founder capacity, when planned automation would accept more committed production than feasible, then demand/promise exposure is capped or withheld | Owner capacity and product-control review |
| `CX9-AC-011` | Given S1 checkout proposal, when product/stock/price authority is missing, then product remains non-purchasable or approved assisted mode; no fake cart success | Product + inventory readiness inspection |
| `CX9-AC-012` | Given potential payment gateway, when sandbox/merchant eligibility is unverified, then integration remains PROPOSED and does not receive live permission | Provider readiness record |
| `CX9-AC-013` | Given S1 checkout retry, when response is lost after business effect, then exactly one authorized commercial/payment effect is observed | Financial/concurrency test evidence |
| `CX9-AC-014` | Given gateway redirect `success` with unknown verified result, when customer returns, then payment state is pending/uncertain, not confirmed paid | Provider simulation and MGBOS state |
| `CX9-AC-015` | Given new checkout SDK, when comparing P0 critical routes, then adopted performance budgets and accessibility gates remain met or block release | Bundle/browser comparison report |
| `CX9-AC-016` | Given user from organization A, when directly opening organization B portal item, then application denies access regardless of nav visibility | Actual direct-access negative test |
| `CX9-AC-017` | Given S2 account is proposed but roles unresolved, when project planning advances, then source conflict/architecture review blocks public private-data exposure | Security decision record |
| `CX9-AC-018` | Given accepted quote v2, when a stale v1 link is clicked, then outdated approval cannot create new binding commercial state | Quote command/version test |
| `CX9-AC-019` | Given self-service return request, when filed, then request status does not assert completed refund and decision follows policy | Case/return UI and domain assertion |
| `CX9-AC-020` | Given repeated reorder customer, when using past configuration, then current price, capability, rights and material availability are checked again | Reorder mutation + business policy test |
| `CX9-AC-021` | Given a new marketplace channel, when receiving identical external order events, then one intended order effect and recoverable duplicate trace results | Source/adapter effect-count QA |
| `CX9-AC-022` | Given marketplace feed disabled after incident, when operator receives new work, then approved manual intake and external IDs remain traceable without duplicate ledger | Fallback drill |
| `CX9-AC-023` | Given label created but parcel not handed to courier, when customer checks progress, then user is not told item has physically shipped | Proof/handoff state mapping test |
| `CX9-AC-024` | Given AI provider goes offline, when standard support/help initiated, then non-AI governed fallback functions and commercial truth remains unchanged | Fault and operator test |
| `CX9-AC-025` | Given custom builder supports an invalid print area/method combination, when customer selects it, then configuration is rejected or routed for review, never accepted as production-ready | Configuration validation test |
| `CX9-AC-026` | Given quote price cannot be computed deterministically, when guided builder estimates, then price remains estimate/needs review, not accepted final amount | Price/quote cross-check |
| `CX9-AC-027` | Given a pilot sample with no field traffic, when QA report requested, then field p75 remains `NOT_VERIFIED_FIELD`; only actual measured lab outcomes are stated | Evidence-provenance report |
| `CX9-AC-028` | Given experiments `CX9-EXP-01..10`, when research results arrive, then predeclared primary metric/cohort and exclusions can be reproduced | Research plan/protocol |
| `CX9-AC-029` | Given new high-value feature with no user proof, when product priority is reviewed, then it is held for research rather than implemented just for feature count | Priority decision record |
| `CX9-AC-030` | Given attractive new automation but higher founder exception load, when evaluating net leverage, then feature is revised/deferred rather than declared time-saving | Manual touch + fees and recovery ledger |
| `CX9-AC-031` | Given relevant source code SHA changes after prior QA, when release disposition attempted, then affected test evidence is re-evaluated; stale evidence is not reused as PASS | Exact-head evidence register |
| `CX9-AC-032` | Given CX-00..09 drafts are complete, when Owner asks builder to implement all at once, then product-to-architecture/engineering gate blocks unbounded handoff | Governance checkpoint |
| `CX9-AC-033` | Given an active PR modifies document routing, when CX package proposed for adoption, then README/canonical source map changes are reconciled before activation | Repository path and PR review |
| `CX9-AC-034` | Given CI passes but unsafe public customer access remains, when S2 go-live reviewed, then CX8-D and applicable R4 gate block exposure | Independent security QA disposition |
| `CX9-AC-035` | Given vendor work or founder physical QC incomplete, when customer-facing order message sent, then state reflects actual verified progress and an owner is accountable for next action | Vendor/QC/release trace |
| `CX9-AC-036` | Given Owner accepts one public slice, when deployment requested, then only that exact scope/revision/environment may be considered and explicit separate release authorization is required | Owner/release contract and exact revision |

**Result state for `CX9-AC-001..036` at authoring: `TEST_DEFINED / NOT_EXECUTED`.** No PASS or production readiness is asserted.

## 13. Governance and accountability by stage

### 13.1 Role boundaries

| Role | Accountable for | Not authorized by this draft |
|---|---|---|
| Owner / Founder | Customer offer, business priority, cash constraints, final product/implementation/release decisions | Automatic adoption merely by reading this file |
| Product planner / AI Co-Founder | Drafting coherent customer requirements, research/validation hypotheses, impact analysis | Changing canonical domain truth or merging PRs |
| Head Engineering | Exact repo restore, architecture impacts, risk, bounded IC/WP, QA assignment and assurance decision | Bypassing Owner approval, R4/R5 controls or branch policy |
| Antigravity / Builder | Approved bounded implementation once handed off through normal process | Self-initiating full CX-00..09 delivery |
| Independent QA / Security / Accessibility | Verify assigned exact-scope behavior, negative cases, provenance, accessibility | Calling NOT_VERIFIED evidence PASS |
| TeeStock business/operations | Accurate offer, vendor capacity, physical supply/QC/packing/shipping and customer communication | Replacing transactional truth with private spreadsheet/chat |
| JARVIS/n8n runtime (future) | Authorized assistance/notification/integration workflows | Financial, cross-org, autonomous commitments without capability grants |
| External providers | Their own verified upstream payment/marketplace/carrier/message events | MGBOS final authorization, money truth, product pricing policy |

### 13.2 Product vs technical acceptance

Product review checks **customer promise and value**. Technical review checks **whether current source implements it correctly and safely**. Operations review checks **whether founder/vendors can actually fulfill it**. These are independent dimensions of readiness and no one review substitutes for the others.

### 13.3 Owner approval package format (`CX9-OWN-PACKET`)

A request for decision should give the Owner a compact, nontechnical front page:

```text
PROPOSED DECISION:
WHY NOW:
CUSTOMER VALUE:
FOUNDER WORK REDUCED / ADDED:
CAPITAL / RECURRING COST IMPACT:
CURRENT REALITY AND PROOF:
CRITICAL UNKNOWN / RISK:
SMALLEST SAFE SLICE:
WHAT WE WILL NOT BUILD:
FALLBACK:
RECOMMENDATION: GO_TO_DISCOVERY | RESEARCH_MORE | DEFER | REJECT
AUTHORIZED ACTION REQUESTED: exactly one bounded action
```

If the request involves money or access, the Owner packet must not hide payment/security dependencies in an appendix. Once adopted, Head Engineering should preserve the exact decision in the appropriate canonical source/ADR or tracked work item, not only chat memory.

## 14. Product decisions requiring Owner review (`CX9-DEC-*`)

All decisions below are **PROPOSED / OPEN**, unless already explicitly fixed by a separate authoritative source; in that case only the *application* to this CX package remains to be reviewed. The document does not vote on the Owner's behalf.

| ID | Recommended direction | Required resolution / authority |
|---|---|---|
| `CX9-DEC-01` | Keep assisted-sales pilot independent of public storefront | Confirm current roadmap still controls strategic sequence; Owner + Head Engineering |
| `CX9-DEC-02` | Adopt `CX-S0..S3` as TeeStock **customer-platform** product slices | Owner/Product; do not replace broader stages |
| `CX9-DEC-03` | Prefer one S0 real customer job (Custom/Business inquiry) before broad catalog build | Owner after current business offer review |
| `CX9-DEC-04` | Customer UX quality applies from first P0 public touchpoint | Owner/Product/UX; CX-08 criteria |
| `CX9-DEC-05` | Permit no public financial acceptance until existing payment/domain controls pass | Owner with Head Engineering/Finance/Security; cannot waive hard invariant |
| `CX9-DEC-06` | Measure founder **admin** and **physical** effort separately | Owner/Operations agree minimal reporting method |
| `CX9-DEC-07` | Require capacity gate before exposing automatic paid acceptance/delivery promise | Owner + operational vendor/supply review |
| `CX9-DEC-08` | Treat customer account as gated by public identity and organization authorization | Owner + MGBOS Security/Architecture |
| `CX9-DEC-09` | Prefer valuable S2 reorder/proof automation over adding providers by count | Owner based on observed demand/economics |
| `CX9-DEC-10` | Select any marketplace only after access, fees, contribution and support impact are known | Owner + Finance/Integration ownership |
| `CX9-DEC-11` | Make advanced builder conditional on standardized sellable/producible options | Owner + Production/Finance/MGBOS |
| `CX9-DEC-12` | Keep AI optional, no unsupported money/production promises | Owner + JARVIS/Security canonical authorities |
| `CX9-DEC-13` | Agree experiment cohort/baseline/benefit threshold before evaluating work | Owner/Product; measured evidence required |
| `CX9-DEC-14` | Protect S0 speed/accessibility against every later library/SDK addition | Owner/Frontend QA with CX-08 measurement policy |
| `CX9-DEC-15` | Require independent package reconciliation and exact current source audit before ACTIVE | Owner, product/audit steward and Head Engineering |
| `CX9-DEC-16` | Permit **only bounded** engineering discovery after approved PRD adoption | Owner + Head Engineering; explicit action scope |
| `CX9-DEC-17` | Separate MultiGraph B2B printing journey into later distinct product contract | Owner/Business; reuse MGBOS/patterns without copying TeeStock prices |
| `CX9-DEC-18` | No committed timeline until actual dependencies, capital and implementing capacity known | Owner + Head Engineering; preserve existing roadmap targets as non-guarantees |

### 14.1 Product decisions not to reopen casually

Already established repository direction includes: MGBOS canonical operational truth, n8n/JARVIS subordinate to transaction and authorization rules, founder attention by exception, staged Custom builder after product/price/production standardization, and assisted-sales-first pilot. If newly observed customer/production evidence suggests change, create an explicit source-owner review and appropriate superseding decision—do not edit this draft to erase the prior rationale.

## 15. Risks, failure modes and mitigation plan (`CX9-RISK-*`)

| ID | Risk | Consequence | Mitigation / stop |
|---|---|---|---|
| `CX9-RISK-01` | Beautiful customer UI ships unsupported offers | Unfulfilled commitments / lost trust | Publish only verified offers, eligibility and status; stop invalid CTA |
| `CX9-RISK-02` | Public customer write bypasses MGBOS | Tenant leaks, invalid transactions | Governed command and independent security test |
| `CX9-RISK-03` | Full checkout prioritized before price/payment/inventory | Duplicate money effects / overselling | Hard-gate S1 and preserve assisted path |
| `CX9-RISK-04` | Founder capacity not modeled | Bottlenecks, late QC/shipments and burnout | Per-order admin/physical ledger, capacity release check |
| `CX9-RISK-05` | Shipping label/status mistaken for physical handoff | False customer promise | Ground delivery copy in proof and carrier facts |
| `CX9-RISK-06` | Marketing/website metrics celebrated without unit economics | Cash loss masked by GMV | Contribution by channel and provider fees |
| `CX9-RISK-07` | New account inherits internal roles | Cross-org customer data leakage | Separate public auth/resource scope; deny by default |
| `CX9-RISK-08` | Architecture built speculatively for every future feature | ERP complexity before operational proof | Reuse existing semantics and bounded slice review |
| `CX9-RISK-09` | Empty events/outbox package treated as working sync layer | Lost updates/duplicate effects | Verify actual runtime; explicit reliable alternative or defer |
| `CX9-RISK-10` | Builder receives entire CX package | Massive unreviewable changes / PR conflict | One narrow approved IC/WP at a time |
| `CX9-RISK-11` | CX documents silently supersede business/governance | Contradictory policies and AI misrouting | Authority review, metadata and README/index cross-link |
| `CX9-RISK-12` | AI help produces unsafe customer promise | Returns, reputation, money/privacy harm | Grounded limited intent, tool auth, evaluation, human route |
| `CX9-RISK-13` | Premium assets degrade mobile and accessibility | Lost task success/conversion | Progressive loading, CX-08 gates and no-SDK S0 regression |
| `CX9-RISK-14` | Marketplace connectivity chosen on hype | Fees/incident work exceed gain | One provider pilot, source mapping, manual fallback and net-cost review |
| `CX9-RISK-15` | Self-service shifts hard work to customer | More incomplete orders/cases | Measure correction cycles and actual case closure, allow help |
| `CX9-RISK-16` | Timeline inferred from target capital date | Unsafe premature deployment | Readiness-based gates and explicit Owner release decision |
| `CX9-RISK-17` | Documentation accepted with stale main/PR state | Wrong scope/ownership or broken links | Fresh snapshot and PR #73 documentation-routing reconciliation |
| `CX9-RISK-18` | Fake success from test reports lacking environment identity | Production incident despite apparent green QA | Exact head/environment, field-vs-lab separation, independent review |

Product-risk descriptions **do not assign canonical R0–R5 classes**. Head Engineering must classify actual technical changes under `docs/governance/cross-system-risk-classification.md` and highest-consequence rule.

## 16. Whole-package reconciliation after CX-09

### 16.1 Objective (`CX9-PKG-01`)

Before Owner adoption, inspect the **entire** set CX-00..09 as one coherent document package, not ten individually polished files. Catch contradictions, ambiguous authority, stale source claims and missing product commitments that per-document author review may miss.

### 16.2 Required cross-document audit matrix

| Audit dimension | What to check | Pass criterion |
|---|---|---|
| File presence and reading order | CX-00..09 all present, relative links and paths resolve | Navigable package README/index, no orphan file |
| Document identity | Unique stable proposed IDs, consistent lifecycle and owner | No duplicate `canonical_id` or unintended ACTIVE flag |
| Shared status semantics | `P0/P1/P2`, `CX-S0..S3`, `CURRENT/TARGET/NOT_VERIFIED` | No accidentally equated labels |
| Canonical alignment | Business policies, finance, MGBOS/JARVIS permissions, architecture | No duplicate owner of money/stock/roles/cases |
| Parent-to-child requirement | CX1-FR-001..046 and relevant CX1-BR/NFR traced to appropriate CX2..08 | Coverage evidenced; deliberate deferrals explicit |
| Child-to-parent requirement | Child FR/BR/AC mapped to customer job and upstream authority | No orphan consequential commitment |
| Cross-doc conflicts | Compare price, quote, approval, status, return, AI, provider claims | Source conflict resolved or blocking |
| Release scope consistency | CX-01 S0..S3 and CX-04/05/06/07 P0..P2 staging | No feature accidentally made P0 mandatory |
| Test evidence truthfulness | QA assertions, simulations, field p75, actual browser/provider proof | No fabricated PASS or go-live readiness |
| Founder outcomes | Physical/administrative responsibility and recoveries | Measurable net leverage, no skipped human owner |
| Governance compatibility | Risk, independent assurance, auth and source citation/paths | Upstream policies unmodified unless authorized |
| Active development conflicts | PR #68/#70/#72/#73 and current main as applicable | No overlapping unapproved engineering/docs mutations |
| Archive/legacy separation | Active TeeStock app vs `archive/teestock-v1/` | Legacy not represented as active implementation |
| Owner decision queue | All material DECs grouped and simplified | Single actionable prioritized Owner packet |

### 16.3 Recommended package audit outputs

After a separate read-only cross-review (not performed by merely drafting this file), produce:

1. **CX-PKG-AUDIT-01** — per-document outcome, reproducible source SHA, broken links, missing IDs, semantic conflicts and evidence limitations.
2. **CX-PKG-TRACE-01** — machine-checkable product requirements map from CX1 through child acceptance and release slice.
3. **CX-PKG-DECISIONS-01** — deduplicated Owner choices grouped by first release blocker versus future conditional gate.
4. **CX-PKG-ROUTING-01** — approved placement/index additions and source-map update recommendation consistent with current PR routing.
5. **CX-PKG-DISPOSITION-01** — one of `NEEDS_REMEDIATION`, `PRODUCT_REVIEW_READY`, `OWNER_ACCEPTED_FOR_ENGINEERING_DISCOVERY`, or `NOT_APPROVED` with exact authority/evidence.

These are proposed future **review artifacts**, not files represented as created or passed in this turn. Independent UX/accessibility and security review should be scoped according to consequences; no self-review may label itself independent assurance.

### 16.4 Activation rule

Only the Owner can approve adoption within the existing documentation governance. Proposed steps:

```text
DRAFTS COMPLETE
  → CROSS-PACKAGE RECONCILIATION + SOURCE REFRESH
  → FIX MATERIAL CONFLICTS/ROUTING/TRACEABILITY
  → APPROVAL-READY OWNER PRODUCT DECISION
  → CONTROLLED CANONICAL PUBLICATION + INDICES/LINKS (separate authorization)
  → HEAD ENGINEERING ENGINEERING-DISCOVERY INTAKE
  → BOUNDED IMPLEMENTATION CONTRACT + OWNER SCOPE APPROVAL
  → BUILD/QA/RELEASE LIFECYCLE (separate events and evidence)
```

A `DRAFT` or `REVIEW` document must not advertise itself as active governing product authority. Avoid retroactively assigning `ACTIVE` to every draft to speed up implementation.

## 17. Traceability starter matrix to CX-00..08

The matrix below is a *representative route*. The package-wide reviewer must produce complete ID-level coverage, not assume this sample is sufficient.

| Customer capability | Parent requirement | Detailed experience / service source | Applicable acceptance sample | Slice candidate |
|---|---|---|---|---|
| Clear first-time route | `CX1-FR-001..005` | CX-02 BP-01, CX-03 navigation | `CX9-AC-002`, CX8 B/C | CX-S0 |
| Structured Custom inquiry | `CX1-FR-009..015`, `CX1-FR-038..040` | CX-02 BP-02, CX-05 P0 intake | `CX9-AC-003..009` | CX-S0 |
| Business assisted quote | `CX1-FR-014..017` | CX-02 BP-03, CX-05 Business | `CX9-AC-005`, `CX9-AC-018` | CX-S0/S2 |
| Physical founder handoff | `CX1-FR-039` | CX-02 physical operations, CX-05 production | `CX9-AC-009..010`, `CX9-AC-035` | All relevant |
| Retail browsing/checkout | `CX1-FR-020..027` | CX-04 retail and payment, CX-07 payment | `CX9-AC-011..015` | CX-S1 |
| Private order/status support | `CX1-FR-030..034` | CX-06 Account/Service, CX-03 UI | `CX9-AC-016..019` | CX-S1/S2 |
| Reorder | `CX1-FR-035`, `CX1-FR-037` | CX-05/06 repeat B2B | `CX9-AC-020` | CX-S2 |
| Marketplace ingestion | `CX1-FR-041..042` | CX-07 provider mapping/replay | `CX9-AC-021..023` | CX-S2 selected |
| Optional AI help | `CX1-FR-043`, `CX1-FR-046` | CX-06/07 AI boundary and CX-08 | `CX9-AC-024`, `CX9-AC-029` | CX-S2/S3 |
| Advanced custom builder | `CX1-FR-018..019` | CX-05 configuration/proof, CX-03 interaction | `CX9-AC-025..026` | CX-S3 |
| Premium fast accessible quality | CX-01 NFRs | CX-03 + CX-08 | `CX9-AC-015`, `CX9-AC-027` | All slices |
| Release/governance integrity | CX-01 product gates | CX-08 A–F and authoritative engineering policy | `CX9-AC-031..036` | All slices |

**Warning:** `CX8-GATE-A..F` are *product quality gates* that apply alongside existing MGBOS/domain/organization engineering governance; they do not create a second permission to merge, deploy, or waive critical financial and authorization requirements.

## 18. Cross-brand future reuse without false generalization

TeeStock is the current customer-platform planning reference. It can later provide reusable interaction patterns—honest customer status, accessible forms, payment/error language, file upload, task-focused information architecture, quote review, organization-scoped views and quality gates—to MultiGraph.

However, **MultiGraph print services are not TeeStock garments**. Its product/customer definition needs its own confirmed quotation vocabulary, material/size/finishing options, color proof, quantity/technical feasibility, lead times, logistics, supplier/press capacity and margin rules. Reusing an approved component or MGBOS command does not establish identical business policies or independent product readiness.

Do not add MultiGraph screens to CX-S0 as an opportunistic scope expansion. Propose a separate Business/Customer Experience PRD package when Owner approves and its business source is sufficiently mature.

## 19. Rollout, rollback and incident handoff expectations

Every implementation-ready candidate must declare:

- **Audience boundary:** who can see/use the feature (public, selected customer, specific organization or internal only).
- **Exposure scope:** canary/test account/controlled pilot/broader release, chosen by applicable deployment governance.
- **Disabled state:** what real existing route remains if feature is turned off.
- **Existing record preservation:** how quotes, orders, payments and approvals remain authoritative when UI is disabled.
- **Provider uncertainty:** who reconciles attempts and which evidence decides an unknown outcome.
- **Customer communications:** exactly what can be promised and who sends correction for affected users.
- **Operational response:** founder or designated owner, triage queue and whether physical shipment/QC must pause.
- **Evidence and audit:** source SHA, deployment target, relevant CI/tests, incident trace and reactivation conditions.

Rolling back a frontend route **cannot reverse already accepted commercial/financial transactions**. Those must be addressed through governed, auditable business commands and policy. Never attempt ad hoc SQL correction as an ordinary fallback.

## 20. Internal document QA and current disposition

### 20.1 Author verification checklist

At initial draft completion the author should verify:

- [ ] YAML frontmatter parses and lifecycle/status are explicit.
- [ ] Stable IDs are unique and sequential within each document-owned prefix (`CX9-DR`, `CX9-EXP`, `CX9-DEC`, `CX9-RISK`, `CX9-AC`).
- [ ] All `CX1-FR` references point to a defined parent requirement.
- [ ] CX-S0..S3 scope reconciles with CX-01 and does not override authoritative roadmaps.
- [ ] Existing MGBOS command/event/public-shell limitations are described truthfully.
- [ ] No specific provider/account is promised or represented as connected.
- [ ] No release date, conversion figure, sales volume, founder hours or package price is invented.
- [ ] All product experiments and acceptance cases say `NOT_EXECUTED` until real evidence exists.
- [ ] No raw Antigravity implementation or merge/deployment command is included.
- [ ] Relative repo link/path proposals and canonical ownership are explicitly conditional.
- [ ] CX-08 six quality gates and current R4/R5/operational gates remain applicable.
- [ ] Independent review has not been silently claimed.

### 20.2 Claim and evidence status

| Claim | Status as of authoring |
|---|---|
| CX-00..08 local drafted files available to author | OBSERVED IN WORKSPACE |
| CX-09 document authoring | DRAFTED; CHECK STRUCTURAL QA SEPARATELY |
| Selected GitHub current `main` / canonical sources | READ-ONLY VERIFIED AT NAMED SNAPSHOT |
| Active TeeStock public commerce storefront | NOT IMPLEMENTED as full platform at inspected source |
| CX package officially committed/activated in repo | NOT DONE |
| Owner approval of entire CX product plan | NOT GRANTED BY THIS FILE |
| Independent product/UX/security/canonical review | NOT_PERFORMED |
| Implemented customer UX acceptance tests | NOT_EXECUTED |
| Provider sandbox/live financial or channel integration proof | NOT_VERIFIED FOR THIS PACKAGE |
| Production deployment or external customer operations | NOT_AUTHORIZED BY THIS DOCUMENT |

### 20.3 Stop conditions

**Stop adoption or downstream handoff** if source mapping is stale, required business policy conflicts, customer authorization/public payment consequence is under-specified, active PR work overlaps without coordination, the package is unable to trace high-risk requirements, or a deliverable is being represented as deployed solely from prose. Escalate only the affected question to Owner and responsible semantic Head; keep unaffected research and planning available.

## 21. Source and review register

### 21.1 Existing canonical/authority documents reviewed or referenced

- `docs/governance/documentation-constitution.md` — document status, ownership, lifecycle and author/approver separation.
- `docs/governance/canonical-source-map.md` — canonical claim routing and business vs system vs engineering boundaries.
- `docs/governance/cross-system-risk-classification.md` — R0–R5 meaning (do not redefine here).
- `docs/governance/evidence-provenance-model.md` — evidence and exact revision principles.
- `docs/engineering/engineering-ai-control-plane.md` — bounded handoffs, independent assurance, risk source reference.
- `docs/roadmaps/solo-founder-launch-roadmap.md` — binding cross-system strategic sequencing authority.
- `systems/mgbos/docs/product/README.md` — product/architecture/implementation reading boundaries.
- `systems/mgbos/docs/product/teestock-founder-control-prd.md` — different product problem and excluded full storefront.
- `systems/mgbos/docs/product/teestock-operational-pilot-plan.md` — assisted-sales, Custom/Business pilot validity.
- `systems/mgbos/docs/architecture/domain-map-capability-ownership.md` — semantic ownership and anti-ERP expansion.
- `systems/mgbos/docs/architecture/command-event-model.md` — command, event and unimplemented complete outbox reality.
- `systems/mgbos/docs/architecture/permission-authorization-model.md` — least authority, organization/resource scope, denied data access.
- `systems/mgbos/docs/engineering/maintenance-policy.md` — tests, exact revision and production-readiness separation.
- `bisnis/teestock/10-product-tech/digital-product-vision.md` — connected product surfaces and progressive customer self-service.
- `bisnis/teestock/10-product-tech/website-information-architecture.md` — job-based IA, mobile, account/portal stages.
- `bisnis/teestock/10-product-tech/commerce-platform.md` — commerce truth, item/checkout/order/channel semantics.
- `bisnis/teestock/10-product-tech/automation-architecture.md` — automation retry/idempotency and n8n/JARVIS boundaries.
- `bisnis/teestock/11-data-mgbos/mgbos-integration.md` — provider adapters, truth owners and API expectations.
- `bisnis/teestock/04-services/custom.md` and `business.md` — assisted Custom/B2B rules and standardization gates.
- `bisnis/teestock/07-operations/customer-service.md`, `returns-and-warranty.md`, `order-fulfillment.md` — post-sale/physical processes.
- `bisnis/teestock/09-marketing/channel-strategy.md` — channel role/economics and source continuity.
- `bisnis/teestock/02-brand/brand-identity-system.md` — visual direction; CX plan is not brand redefinition.
- `systems/mgbos/apps/teestock/src/app/page.tsx` — customer shell source, not full website evidence.

### 21.2 Reproducibility limits

This is a **selected-source product planning review**, not a complete monorepo line-by-line audit, an independent penetration test, a website usability study, a current provider-API capability verification, or a proof of readiness for any change after the pinned commit. Formal adoption needs a refreshed exact source/PR check. Any requirement referencing legal policies needs an applicable legal/business-owner review before public exposure.

The current proposed destination is intentionally a **candidate** path. The repo's documentation entrypoint reconciliation (`PR #73` was open in the checked snapshot) and canonical source mapping must be read again when publication is authorized. Do not copy this file into a second authoritative location to bypass that review.

## 22. Final disposition and single next recommended action

**CX-09 document status:** `DRAFT_FOR_PACKAGE_RECONCILIATION`.

**Product recommendation:** preserve existing Custom/Business assisted-sales operational program, then preferentially investigate one honest premium S0 intake slice; only advance to eligible retail, account, marketplaces and advanced custom when domain truth, customer demand, founder capacity and engineering assurance justify them.

**Not approved:** any Antigravity coding, PR, database migration, provider connectivity, customer charge, merge, deployment, live notification or production access.

**Next action (one bounded program step):** conduct a **read-only CX-00..09 package-wide coherence, canonical authority and traceability audit** against fresh `main` and active documentation PRs. Deliver an adoption-ready Owner decision packet and actionable, bounded findings. Only if the product package then passes review should Head Engineering receive a request for **one** scoped engineering discovery, with normal governance and explicit Owner authorization.

---

*Prepared 2026-10-16, Asia/Jakarta. A complete product planning proposal does not equate to a verified product, a deployment, or an engineering implementation mandate.*

---

## CX-REM-R1 — governed package traceability correction (draft, non-authoritative)

- The complete bidirectional mapping of **all 46** `CX1-FR-001..046` lives in [`CX-PKG-TRACE-R1.csv`](CX-PKG-TRACE-R1.csv): parent ID, exact existing child ID(s), existing acceptance case, candidate delivery slice, and approval/verification status.
- Prior incomplete direct-reference counting (26/46) must not be read as missing feature coverage. All 46 rows now have exact declared downstream IDs, but **semantic verification is an author self-review, not independent acceptance**.
- Stage and priority interpretation is refined in [`CX-PKG-STAGE-CROSSWALK-R1.md`](CX-PKG-STAGE-CROSSWALK-R1.md). `P0/P1/P2` are requirement priority; `CX-S0..S3` are customer-product slice gates, not implementation approvals.
- Package-wide `R1` status: `DRAFT`, `NOT_AUTHORIZED_FOR_DIRECT_BUILDER_HANDOFF`, source and engineering risk governance remain authoritative.
- Unresolved Owner/product tradeoffs, including master P1 optional AI versus proposed detail P2, belong to [`CX-PKG-DECISIONS-R1.md`](CX-PKG-DECISIONS-R1.md). Do not silently change priorities.
