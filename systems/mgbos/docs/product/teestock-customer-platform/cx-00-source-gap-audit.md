---
canonical_id: proposed.mgbos.product.teestock-customer-platform.cx-00
status: ACTIVE
version: 0.1.1
owner: Rizky
author: ChatGPT / Co-Founder Strategy & Product Planning
approver: Rizky
scope: teestock-customer-experience-and-commerce-product-discovery
document_class: research
normative_authority: CANONICAL_PRODUCT_RESEARCH
repository: Rizkybuilds/bisnishub
repository_ref: main
source_inspection_coverage: selected_relevant_paths_not_full_monorepo
repository_revision: 2800c474563309bda49d84d712f79b68c9dde36a
audit_date: 2026-10-16
audit_mode: READ_ONLY_SOURCE_AND_DOCUMENT_INSPECTION
implementation_authorization: NONE
merge_authorization: NONE
deployment_authorization: NONE
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/cx-00-source-gap-audit.md
depends_on:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - bisnis/teestock/10-product-tech/digital-product-vision.md
  - bisnis/teestock/10-product-tech/website-information-architecture.md
  - bisnis/teestock/10-product-tech/commerce-platform.md
  - systems/mgbos/docs/product/teestock-founder-control-prd.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
supersedes: null
remediation_package: CX-REM-R1
remediation_review: AUTHOR_SELF_REVIEW_NOT_INDEPENDENT

effective_from: 2026-10-20
---

# CX-00 — TeeStock Customer Experience & Commerce: Existing Source, Requirements & Gap Audit v0.1.1

## 0. Document contract

**Status:** DRAFT / proposed research evidence, **not** a new canonical PRD, architecture decision, engineering change package, implementation contract, or work package.

**Purpose:** reconcile the Owner's intended customer experience—_feature-rich but fast, premium, self-service, integrated, and founder-efficient_—with existing BisnisHub/TeeStock documentation and active source code. Establish exactly which product requirements must be reused, refined, newly specified, or deferred before writing a new customer-facing PRD.

**Boundary:** this artifact evaluates **TeeStock customer-facing product requirements and the interfaces connecting them with MGBOS**. It does not re-specify MGBOS transactional semantics, business pricing policies, JARVIS permissions, or MultiGraph's future printing-specific product. Those remain with their existing semantic owners.

**Important distinction:** `DRAFT` and proposed IDs do not grant canonical authority. Publishing this file would not automatically approve any CX implementation or amend the approved Founder Control roadmap. Existing documents retain their authority until an explicitly approved reconciliation occurs.

### 0.1 Primary evidence and reproducibility

- GitHub repository: [Rizkybuilds/bisnishub](https://github.com/Rizkybuilds/bisnishub).
- Inspected `main` revision: [`2800c474563309bda49d84d712f79b68c9dde36a`](https://github.com/Rizkybuilds/bisnishub/commit/2800c474563309bda49d84d712f79b68c9dde36a) (GitHub branch ref checked on 2026-10-16).
- Inspected evidence: exact-revision file contents, repository directories, selected product/business/governance sources, and PR metadata for #68, #70, #72, #73.
- **Not performed:** live browser execution, production deployment inspection, API-access feasibility tests for individual marketplaces, independent user research, revenue/customer validation, performance measurements, and full source-by-source review of the entire monorepo.
- All `CURRENT` source claims below are limited to the inspected revision and paths. Other branches/PRs and future changes do not inherit this assessment.
- To reproduce: inspect the paths in Sections 2 and 8 at the pinned commit, then compare with current `main` before any later promotion.

### 0.2 Terminology

| Label                                | Meaning                                                                                                               |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `CURRENT_SOURCE`                     | Directly observed in files/directories at pinned revision.                                                            |
| `CANONICAL_BUSINESS_INTENT`          | Business-level requirement or direction described by an existing authoritative TeeStock source in its declared scope. |
| `PRODUCT_DEFINED`                    | Documented product objective/specification; does not prove implementation.                                            |
| `IMPLEMENTED_SCOPE`                  | Software behavior whose source exists within the observed scope; runtime correctness is a separate claim.             |
| `PROPOSED`                           | Recommendation for future product definition, not approved.                                                           |
| `NOT_VERIFIED`                       | Evidence not inspected/available, including runtime, measurements, and provider capabilities.                         |
| `REUSE` / `REFINE` / `NEW` / `DEFER` | CX-00 disposition recommendations, not decisions to change canonical sources.                                         |

## 1. Executive product verdict

**Verdict: DIRECTIONALLY_ALIGNED / CUSTOMER_PRODUCT_CONTRACT_INCOMPLETE / PUBLIC_COMMERCE_NOT_IMPLEMENTED_IN_INSPECTED_APP.**

BisnisHub's business knowledge already describes much of the envisioned customer platform. The gap is **not absence of an ambitious digital vision**. The gap is the missing, implementation-oriented **customer experience product contract** that defines user scenarios, state transitions at the interface, edge cases, performance/accessibility guarantees, dependency gates, and evidence-based release acceptance—without re-owning transactional business rules.

The strongest established assets are:

1. TeeStock Digital Product Vision (`TS-TEC-001`) — multiple experiences over one business truth, commerce, custom, business customer experience, self-service, mobile-first and AI boundaries.
2. Website Information Architecture (`TS-TEC-002`) — information hierarchy, site journeys, navigation, V1 page/flow recommendations, responsive and accessibility principles.
3. Commerce Platform (`TS-TEC-003`) — product/SKU/availability/checkout/order/channel architecture and marketplace order normalization.
4. TeeStock Custom/Business operating specifications and existing MGBOS domain architecture — domain constraints that must be preserved.

The visible customer-facing software currently **does not match the desired premium self-service platform**: the active `systems/mgbos/apps/teestock/src/app/page.tsx` is a launch placeholder; `/custom-atelier` explicitly says ordering is not available. Within the inspected tree, no active cart, checkout, account or product catalog routes were found. These observations do not make claims about retired archived storefronts, uninspected environments, or future PRs.

### 1.1 Material scope clarification

- **Founder Control PRD is not defective because it excludes storefront.** Its explicit scope is founder attention and operational exceptions, not customer commerce. This is a **different product track**, not a contradiction.
- The solo-founder roadmap currently favors **assisted-sales first** and says the complete storefront is **not a prerequisite** for initial Custom/Business validation. This remains a valid authorized sequencing principle until changed by the appropriate process.
- A premium customer experience should be planned **in parallel at product-definition level**, not used to bypass the existing implementation and security gates.
- A large feature inventory does not require an enormous initial release. Premium quality can coexist with phased capability rollout.

## 2. Source-of-truth inventory and authority map

Links below are pinned to the audited commit wherever source-level traceability matters.

| Ref  | Source (exact-revision link)                                                                                                                                                                                                        | Owns / contributes                                                                 | CX-00 decision                                     |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------- |
| G-01 | [`docs/governance/documentation-constitution.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/governance/documentation-constitution.md)                                             | Documentation governance, semantic ownership, reference-over-duplication           | **REUSE; NEVER REDEFINE**                          |
| G-02 | [`docs/governance/canonical-source-map.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/governance/canonical-source-map.md)                                                         | Routing to authoritative business, system, engineering sources                     | **REUSE; NEVER REDEFINE**                          |
| G-03 | [`docs/engineering/repository-layout.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/engineering/repository-layout.md)                                                             | Directory ownership, navigation, workspace coexistence                             | **REUSE**                                          |
| B-01 | [`bisnis/teestock/10-product-tech/digital-product-vision.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/digital-product-vision.md)                     | TeeStock digital business vision, surface types, CX principles, staged experiences | **REUSE / REFINE into product contracts**          |
| B-02 | [`bisnis/teestock/10-product-tech/website-information-architecture.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/website-information-architecture.md) | Site navigation, information hierarchy, product routes, customer-job routing       | **REUSE / REFINE into flow and acceptance maps**   |
| B-03 | [`bisnis/teestock/10-product-tech/commerce-platform.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/commerce-platform.md)                               | Commerce policy/direction; product, price context, checkout and channel contracts  | **REUSE / DO NOT DUPLICATE COMMERCIAL RULES**      |
| B-04 | [`bisnis/teestock/10-product-tech/automation-architecture.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/automation-architecture.md)                   | Staged automation, non-authoritative AI, events, integration principles            | **REUSE**                                          |
| B-05 | [`bisnis/teestock/04-services/custom.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/04-services/custom.md)                                                             | Custom service policy, standardization, future builder eligibility                 | **REUSE**                                          |
| B-06 | [`bisnis/teestock/04-services/business.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/04-services/business.md)                                                         | B2B qualification, commercial boundaries, quote/order expectations                 | **REUSE**                                          |
| B-07 | [`bisnis/teestock/09-marketing/channel-strategy.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/09-marketing/channel-strategy.md)                                       | Website/marketplace roles, distribution economics, policies                        | **REUSE**                                          |
| B-08 | [`bisnis/teestock/07-operations/customer-service.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/07-operations/customer-service.md)                                     | Support/case semantics and potential self-service opportunities                    | **REUSE**                                          |
| B-09 | [`bisnis/teestock/07-operations/returns-and-warranty.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/07-operations/returns-and-warranty.md)                             | Returns eligibility, human review, after-sales policy                              | **REUSE**                                          |
| B-10 | [`bisnis/teestock/07-operations/order-fulfillment.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/07-operations/order-fulfillment.md)                                   | Fulfillment promise, status and notification policies                              | **REUSE**                                          |
| B-11 | [`bisnis/teestock/08-finance/pricing-framework.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/08-finance/pricing-framework.md)                                         | Pricing policy, margin/offer constraints                                           | **REFERENCE ONLY**                                 |
| B-12 | [`bisnis/teestock/11-data-mgbos/mgbos-integration.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/11-data-mgbos/mgbos-integration.md)                                   | TeeStock → MGBOS integration needs and source-of-truth mapping                     | **REUSE / VALIDATE WITH MGBOS ARCHITECTURE**       |
| B-13 | [`bisnis/teestock/10-product-tech/creator-platform.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/creator-platform.md)                                 | Creator participant experience; not launch prerequisite                            | **DEFER unless active cohort**                     |
| B-14 | [`bisnis/teestock/10-product-tech/partner-platform.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/10-product-tech/partner-platform.md)                                 | Partner participant experience; not customer UI scope                              | **REFERENCE / DEFER**                              |
| P-01 | [`systems/mgbos/docs/product/teestock-founder-control-prd.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/product/teestock-founder-control-prd.md)                   | Founder-facing product contract; storefront explicitly OUT                         | **PRESERVE; SIBLING PROGRAM**                      |
| P-02 | [`systems/mgbos/docs/product/founder-attention-experience-spec.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/product/founder-attention-experience-spec.md)         | Founder attention and UI-specific semantic rules                                   | **REFERENCE; NO REDEFINITION**                     |
| P-03 | [`systems/mgbos/docs/product/operational-exception-spec.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/product/operational-exception-spec.md)                       | Abnormal business work vs customer cases                                           | **REFERENCE; NO REDEFINITION**                     |
| P-04 | [`systems/mgbos/docs/product/teestock-operational-pilot-plan.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/product/teestock-operational-pilot-plan.md)             | Bounded assisted-sales product pilot                                               | **PRESERVE**                                       |
| A-01 | [`systems/mgbos/docs/architecture/domain-map-capability-ownership.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/docs/architecture/domain-map-capability-ownership.md)   | Canonical business-domain ownership and scope decisions                            | **PRESERVE; ARCHITECTURE REVIEW GATE**             |
| A-02 | [`docs/architecture/master-system-blueprint.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/architecture/master-system-blueprint.md)                                               | MGBOS/JARVIS/external-systems responsibility hierarchy                             | **PRESERVE**                                       |
| R-01 | [`docs/roadmaps/solo-founder-launch-roadmap.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/docs/roadmaps/solo-founder-launch-roadmap.md)                                               | Controlled-launch sequencing authority; assisted-sales first                       | **PRESERVE; FLAG PRODUCT DELIVERY DEPENDENCIES**   |
| R-02 | [`bisnis/teestock/14-roadmap/master-roadmap.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/14-roadmap/master-roadmap.md)                                               | TeeStock capability progression                                                    | **REUSE**                                          |
| R-03 | [`bisnis/teestock/14-roadmap/capability-roadmap.md`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/bisnis/teestock/14-roadmap/capability-roadmap.md)                                       | Capability maturity vs software presence                                           | **REUSE**                                          |
| S-01 | [`systems/mgbos/apps/teestock/src/app/`](https://github.com/Rizkybuilds/bisnishub/tree/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/apps/teestock/src/app)                                                                | Direct source evidence for public TeeStock app                                     | **CURRENT_SOURCE**                                 |
| S-02 | [`systems/mgbos/apps/mgbos/src/app/(app)/`](https://github.com/Rizkybuilds/bisnishub/tree/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/apps/mgbos/src/app/%28app%29)                                                      | Internal MGBOS routes and domain UI presence                                       | **CURRENT_SOURCE; NOT CUSTOMER PORTAL**            |
| S-03 | [`systems/mgbos/packages/integrations/src/index.ts`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/packages/integrations/src/index.ts)                                       | Shared integration package is a reserved boundary                                  | **CURRENT_SOURCE; NO PROVIDER INTEGRATION PROVEN** |
| S-04 | [`systems/mgbos/packages/ai/src/index.ts`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/packages/ai/src/index.ts)                                                           | Shared AI package is a reserved boundary                                           | **CURRENT_SOURCE; NO CUSTOMER AGENT PROVEN**       |
| S-05 | [`systems/mgbos/packages/ui/src/index.ts`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/packages/ui/src/index.ts)                                                           | Shared UI package is a reserved boundary                                           | **CURRENT_SOURCE; NOT A COMPLETE DESIGN SYSTEM**   |

**Additional examined source families:** operations, channel, pricing, product/roadmap, MGBOS Product Index and pilot specifications. In-scope review is substantial but not a claim that every file in the entire repository was inspected.

## 3. Observed implementation and active engineering boundary

### 3.1 Public TeeStock app

At the audited SHA:

- [`page.tsx`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/apps/teestock/src/app/page.tsx#L1-L14) says **"Aplikasi baru TeeStock sedang disiapkan"** and links only to Custom Atelier.
- [`custom-atelier/page.tsx`](https://github.com/Rizkybuilds/bisnishub/blob/2800c474563309bda49d84d712f79b68c9dde36a/systems/mgbos/apps/teestock/src/app/custom-atelier/page.tsx#L1-L15) says **"Pemesanan belum tersedia pada aplikasi ini"**.
- Inspected `src/app` directory contains `page.tsx`, `custom-atelier/`, `health/`, `layout.tsx`, `not-found.tsx`, `globals.css`; no customer commerce routes such as catalog, cart, checkout, orders/account are present in that directory tree.
- `src/components` and `src/features` contain `.gitkeep` placeholders in the inspected tree.
- `@mgbos/integrations`, `@mgbos/ai`, and `@mgbos/ui` inspected `src/index.ts` each contain a **reserved-boundary** comment with an empty export. This does not imply equivalent implementations cannot exist elsewhere; it establishes that these exact packages are not evidence of the advertised capabilities.

**Classification:** public storefront **NOT IMPLEMENTED within the inspected active app surface**; premium CX, conversion funnel, shopper behavior, and production performance **NOT VERIFIED**.

### 3.2 Internal MGBOS

`apps/mgbos/src/app/(app)` has routes for leads, customers, requirements, quotes, orders, production, vendors, inventory, procurement, invoices, payments, ledger, shipments, exceptions and dashboard. This is meaningful **internal software groundwork**, but a private MGBOS route cannot be counted as a public customer capability.

### 3.3 PR / concurrency scope

At audit time, open PRs included:

- [PR #68](https://github.com/Rizkybuilds/bisnishub/pull/68) — CRM data-state UX; draft.
- [PR #72](https://github.com/Rizkybuilds/bisnishub/pull/72) — UXR02-A browser acceptance CI companion.
- [PR #70](https://github.com/Rizkybuilds/bisnishub/pull/70) — organization isolation hardening.
- [PR #73](https://github.com/Rizkybuilds/bisnishub/pull/73) — repository/documentation entrypoint reconciliation; draft.

These are **not part of CX-00**. No conclusion here grants merge or alters their contract. A future PR introducing this product package must re-check `main` and coordinate navigation/index changes, particularly with #73.

## 4. Requirements and experience gap matrix

The matrix distinguishes existing vision/business logic from **customer-facing implementation-ready requirements**. `Priority` is a **proposed product-definition priority**, not an approved delivery schedule.

| Area / intent                              | Grounded source                         | Present definition                                            | Material gap to close                                                                                       | Disposition                            | Proposed owning document / priority           |
| ------------------------------------------ | --------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------- |
| CX positioning and customer jobs           | B-01, B-02                              | Jobs and simplicity principles exist                          | Unified segments, measurable customer outcomes, brand/product boundaries, non-goals                         | **REFINE**                             | CX-01 / P0                                    |
| User segments and assisted vs self-service | B-01, B-05, B-06, R-01                  | Different flows recognized                                    | Explicit routing/eligibility/hand-off states and actor-specific journeys                                    | **REFINE**                             | CX-02 / P0                                    |
| Premium design language                    | B-02 and TeeStock brand identity family | High-level IA and content hierarchy exist                     | Testable visual foundation, tokens, responsive patterns, interaction rules, design governance               | **NEW**                                | CX-03 / P0                                    |
| Information architecture/navigation        | B-02                                    | Proposed sitemap, main jobs, PLP/PDP patterns                 | Task-based flow validation, V1 exact route inventory, small-screen error/empty states                       | **REFINE**                             | CX-02/03 / P0                                 |
| Product discovery, filtering, search       | B-02, B-03                              | Search/filter/taxonomy concepts exist                         | Screen behavior, relevance, stock/price freshness, no-results, accessibility                                | **REFINE**                             | CX-04 / P1                                    |
| Product detail & configuration             | B-02, B-03                              | Product/variant/availability/sellable configuration defined   | Exact PDP UX, selections/constraints, draft pricing, responsive image handling                              | **REFINE**                             | CX-04 / P1                                    |
| Cart and checkout                          | B-03                                    | Commerce transaction and checkout structure exist             | Guest flow, address, payment failure, idempotency feedback, expired session, re-entry, receipts             | **REFINE**                             | CX-04 / P1                                    |
| Assisted Custom inquiry                    | B-01, B-02, B-05, R-01                  | Early landing/form/WhatsApp → human quote defined             | Step-by-step intake UX, artwork conditions, failure/recovery, founder handoff                               | **REFINE**                             | CX-05 / P0                                    |
| Interactive Custom builder                 | B-01, B-05                              | Explicit future staged builder and standardization gate       | Tool scope, visual preview fidelity, mobile perf, supported product/print options, feasibility verification | **DEFER BUILD; DEFINE GATES**          | CX-05 / P2                                    |
| B2B quotation and approval                 | B-01, B-06                              | Quote-led B2B experience exists                               | Customer-facing quote versions, revisions, acceptance, deadline communication, document visibility          | **REFINE**                             | CX-05 / P0/P1                                 |
| Customer account, order history, tracking  | B-01, B-02, B-08, B-10                  | Self-service concepts and statuses exist                      | Identity/guest linking, status mapping, timeline, help actions, account data isolation                      | **REFINE**                             | CX-06 / P1                                    |
| Reorder, support and returns               | B-06, B-08, B-09                        | Business/return policies and future self-service exist        | UI eligibility, case evidence, fallback to human, service recovery, blocked/partial outcomes                | **REFINE**                             | CX-06 / P1                                    |
| Customer-facing AI                         | B-01, B-04, A-02                        | AI assistance and approval boundaries documented              | Knowledge/source freshness, tool permissions, hallucination safeguards, escalation, evaluation              | **NEW PRODUCT BEHAVIOR; REUSE POLICY** | CX-06/08 / P2 unless low-risk pilot justified |
| Marketplace omnichannel                    | B-03, B-07, B-12                        | Adapter, external ID/SKU, reconciliation direction exists     | Platform-by-platform eligibility, workflows, conflicts, order/import failures, cost and operations          | **REFINE**                             | CX-07 / P1/P2                                 |
| Payments/logistics/communications          | B-10, B-12, B-03                        | Integration categories/roles are known                        | Provider capability study, callbacks, retries, settlement and delivery customer states                      | **REFINE**                             | CX-07 / P0/P1 by channel                      |
| Performance, accessibility, reliability    | B-01, B-02                              | Principles exist, not measurement-based UX contract           | Approved thresholds, budgets, test equipment, p75 RUM, a11y audits, recovery criteria                       | **NEW ACCEPTANCE DETAIL**              | CX-08 / P0                                    |
| Founder effort reduction                   | P-01, R-01, B-04                        | Attention compression and automation direction strong         | Customer-action → staff/AI/system split, manual touch count, exception routing & savings measure            | **REFINE**                             | CX-02/09 / P0                                 |
| Release maturity and staged validation     | R-01, R-02, R-03                        | Assisted-sales first, maturity stages, capability gates exist | Customer-program V0/V1/V2 exit gates, target cohort, experiment and evidence mapping                        | **REFINE**                             | CX-09 / P0                                    |
| Creator/partner extended workspaces        | B-13, B-14                              | Rich participant vision exists                                | Requires actual participant cohorts and economic justification                                              | **DEFER**                              | Future separate product definition            |
| MultiGraph printing frontend               | `bisnis/multigraph/` and A-02           | Separate business identity and MGBOS reuse premise            | Dedicated B2B print-order customer research and domain journeys                                             | **SEPARATE PRODUCT TRACK**             | NOT in CX-01 canonical TeeStock PRD           |

**Priority semantics:** P0 = define now to support minimum high-quality assisted-sales/launch plan; P1 = later self-service transactional capabilities; P2 = advanced capabilities whose implementation depends on evidence and gates. These are **definition priorities**, not permission to start development.

## 5. Evidence-backed principal findings

### CXF-01 — Product vision exists, but an executable customer PRD is absent from the inspected product-package boundary

**Evidence:** B-01/B-02/B-03 are extensive business and platform descriptions; P-01 expressly excludes full storefront; `systems/mgbos/docs/product/` currently centers on Founder Control. **Impact:** the Builder cannot be given one approved, tested contract for public customer behaviors. **Disposition:** **PRODUCT GAP — NEW CX-01 product contract, referencing existing business sources.** Do not recast Founder Control as flawed or replace it.

### CXF-02 — Public storefront implementation is materially behind the business vision

**Evidence:** S-01 placeholder pages and missing routes in inspected active `src/app`. **Impact:** cannot currently claim customer purchase, catalog, cart, or account workflows from active app. **Disposition:** **CURRENT-SOURCE GAP**; propose implementation only after product, architecture and engineering gates. No speculative live-readiness claims.

### CXF-03 — Premium UX is not yet a testable design system contract

**Evidence:** B-02 has IA/mobile/accessibility principles; S-05 shared UI boundary remains reserved. **Impact:** different screens/builders could produce inconsistent or heavyweight experiences. **Disposition:** **NEW CX-03** with interaction states, typography/layout/token standards, component accessibility, content guidance, visual acceptance, reduced-motion behavior and progressive disclosure. Brand identity must be referenced, not rewritten.

### CXF-04 — "Feature-rich but fast" needs real performance and accessibility acceptance

**Evidence:** B-01 states fast loading affects trust, conversion and SEO; B-02 lists critical pages and keyboard/semantic accessibility. No measured performance proof for a commerce website was inspected. **Impact:** performance promises may become decorative requirements. **Disposition:** **NEW CX-08** defining provisional targets and a way to measure them via browser tests and real-user monitoring; Head Engineering must approve implementation budgets. Do not claim present Lighthouse/Core Web Vitals scores.

### CXF-05 — Website assisted-sales and full commerce are deliberately different stages

**Evidence:** R-01 assisted-sales-first; B-01 staged Custom and B2B; B-03 V1 marketplace partially manual/advanced features deferred. **Impact:** risk of overbuilding or mistakenly downgrading long-term ambition. **Disposition:** **REFINE CX-09**, maintaining a P0 premium assisted-sales route and formal gates for P1/P2 commerce. No automatic roadmap re-baseline.

### CXF-06 — Custom builder must follow sellable configuration standardization

**Evidence:** B-01 sections 30–36; B-05 sections 68–71. **Impact:** inaccurate previews, false automated pricing, unproducible orders or high founder intervention. **Disposition:** **REFINE CX-05** and preserve standardization gates; only advanced configuration concept is in P2 until product/pricing/production rules are demonstrably stable.

### CXF-07 — Marketplace normalization is documented; provider-level readiness is not

**Evidence:** B-03 sections 142–157; B-12 sections 119–121; S-03 reserved integration package. **Impact:** overstating automatic cross-platform stock/order sync could create oversell and reconciliation risk. **Disposition:** **REFINE CX-07**; first define order identity, failure cases, manual fallback and economic viability. Provider API permissions/support are **NOT_VERIFIED** in this audit.

### CXF-08 — Customer self-service must not invent MGBOS business or permission states

**Evidence:** B-01 customer-facing status mapping, B-08 customer support, B-09 return eligibility, A-01 architecture ownership. **Impact:** leaked data, contradictory order status, unauthorized acceptance/refund promises. **Disposition:** **REFINE CX-06**; all mutations through authorized commands; view models are projections, not second truth; authorization independently reviewed.

### CXF-09 — AI must be optional, auditable and subordinate to deterministic business correctness

**Evidence:** B-04, A-02, P-01; S-04 AI package reserved. **Impact:** AI could imply false quotes, shipping SLAs or approvals. **Disposition:** **NEW CX AI behavior/evaluation only when justified**. Tool access and customer-facing promise authority remain explicitly gated and must reuse JARVIS/MGBOS policy.

### CXF-10 — Documentation routing requires conflict-aware integration

**Evidence:** G-01/G-02 require one canonical semantic owner; active PR #73 edits documentation entrypoints. **Impact:** copied definitions and stale README links. **Disposition:** **NEW CX package as DRAFT only**; route through Head Engineering before publishing indexes, and refresh `main`/PR #73 scope at promotion time.

### CXF-11 — Frontend economics and founder workload are part of product quality

**Evidence:** owner intent for solo founder, P-01 attention/automation, R-01, B-07 marketplace fees. **Impact:** an elegant UX can still cause founder workload or negative margin. **Disposition:** **REFINE CX-02 and CX-09** with manual touch count, escalation, quote preparation time, success/abandonment, per-channel margin and cost-to-serve measures. Baselines **NOT_VERIFIED** until empirical observation.

## 6. Risk, conflict and unknown register

| ID     | Description                                                                 | Classification                                          | Proposed resolution / owner                                                          |
| ------ | --------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| CX-R01 | Customer-facing product may bypass current transaction/security contracts   | MATERIAL RISK                                           | Head Engineering architecture/authorization review before implementation             |
| CX-R02 | UI ambition creates excess JS/rendering/media cost                          | MATERIAL RISK                                           | CX-03/08 progressive loading, tested budgets, staged interaction acceptance          |
| CX-R03 | Product scope expands into generic ERP or parallel business data model      | MATERIAL RISK                                           | Link to A-01 and canonical system invariants; no new root entities by PRD fiat       |
| CX-R04 | Duplicate PRD/business policies compete for authority                       | DOCUMENTATION RISK                                      | Source ownership in CX-00, single normative owner, cross-reference not restatement   |
| CX-R05 | Full-storefront expectations conflict with assisted-sales pilot scheduling  | SEQUENCING TENSION (not an architectural contradiction) | CX-09 proposes gated parallel product planning; roadmap change only by Owner         |
| CX-R06 | Marketplace platform access/rate limits/policy vary                         | NOT_VERIFIED EXTERNAL DEPENDENCY                        | Platform-specific technical/business discovery before connector commitment           |
| CX-R07 | Customer AI gives non-authoritative advice or makes promises                | MATERIAL RISK                                           | Prompt/tool/evaluation contract, human escalation, no autonomous financial authority |
| CX-R08 | Founder manually repeats actions across customer/order systems              | PRODUCT QUALITY RISK                                    | Customer-ops swimlanes, measurable manual touches, exception-first UX                |
| CX-R09 | Public-account identity and privacy are assumed from internal user system   | NOT_VERIFIED DESIGN DEPENDENCY                          | Design guest/account and organization isolation with auth/security specialists       |
| CX-R10 | Older TeeStock V1 is treated as active/current solution                     | SOURCE PROVENANCE RISK                                  | Archived implementation is reference only; test active app at exact revision         |
| CX-R11 | PR #73 and subsequent document changes cause overlapping source/index edits | CONCURRENCY RISK                                        | Refresh and coordinate integration with active documentation PR before any write     |
| CX-R12 | No customer research/real operational timing baseline                       | NOT_VERIFIED VALIDATION GAP                             | Design synthetic rehearsals and actual controlled pilot; clearly separate both       |

**Interpretation:** these are discovery findings, not an independent R4/R5 security audit; severity and engineering risk class must be assigned by the canonical risk framework at handoff.

## 7. Proposed CX package: responsibilities and non-duplication

### CX-00 — Existing Source & Gap Audit (this document)

- **Owns:** source inventory, exact-source observations, gaps, unknowns, recommended dispositions.
- **Does not own:** customer behavior normativity, business pricing policy, implementation authorization.
- **Next state:** audited draft candidate; revalidate source SHA before promotion.

### CX-01 — Customer Platform Master PRD

- **Owns:** scope, segments, personas/jobs-to-be-done, customer outcome hierarchy, bounded product requirements, capability tiers, product success gates, non-goals and decisions.
- **References, not duplicates:** TS-TEC-001/B-01 digital vision; pricing/service policy; MGBOS domain truth.
- **Must reconcile:** premium quality vs rollout scope, assisted-sales vs self-service, TeeStock vs future MultiGraph.

### CX-02 — Customer Journeys & Service Blueprint

- **Owns:** end-to-end visitor/customer/business flow, backstage MGBOS/AI/founder/manual responsibilities, recovery and handoffs.
- **Deliverable:** scenario narratives and swimlanes for discover→qualify→quote→accept→pay→produce→ship→support/reorder, including physical handoffs.

### CX-03 — Experience Design & Interaction Specification

- **Owns:** interface quality, UX patterns, responsive/accessibility behavior, state design, progressive disclosure and design quality acceptance.
- **References:** TeeStock brand identity (visual authority), existing site IA (navigation authority).

### CX-04 — Commerce & Checkout Experience

- **Owns:** public-screen/user flow behavior for catalog/PDP/variant/cart/checkout/guest/order confirmation and failure recovery.
- **Does not own:** monetary ledger, core inventory truth, pricing algorithm, or payment security implementation.

### CX-05 — Custom & B2B Ordering Experience

- **Owns:** structured inquiry, eligible configuration UX, file/artwork intake, quote display, revision/approval, time expectations, assisted escalation, builder eligibility gates.
- **Does not own:** production execution states or unsupported automated price promises.

### CX-06 — Customer Account & Service Experience

- **Owns:** profile, order history, guest status, tracking, support entry, returns request, reorder and customer-readable state projections.
- **Does not own:** internal customer case or exception lifecycle semantics.

### CX-07 — Omnichannel & External Integration Requirements

- **Owns:** customer-facing channel consistency requirements, adapter expectations, manual fallback, external ID traceability, reconciliation and provider dependency register.
- **Does not own:** specific API adapter designs or external-provider contractual rules.

### CX-08 — Experience Quality & Acceptance Contract

- **Owns:** UX performance budgets as proposals for review, accessibility and state testing matrix, browser acceptance criteria, resilience/error UX, security/privacy test needs.
- **Must distinguish:** laboratory/synthetic QA, hosted CI, production observation and real-user validation.

### CX-09 — Phased Delivery & Product Validation Plan

- **Owns:** P0/P1/P2 product delivery recommendations, dependencies, user validation plans, exit gates, evidence targets, measurable founder-load reduction.
- **Does not override:** repository strategic roadmap without explicit Owner approval.

### README.md — Package index, not an eleventh normative specification

- **Owns:** routing, reading order, lifecycle, dependency/status register, and links to source authorities.
- **Does not own:** duplicate product rules.

## 8. Candidate requirements to promote (NOT YET CANONICAL)

The following are _discovery candidates_, not numbered approved PRD requirements. Assign permanent IDs only within CX-01–CX-08 after normalization and review.

| Candidate | Required product behavior / measurable intent                                                             | Source / proposed destination |
| --------- | --------------------------------------------------------------------------------------------------------- | ----------------------------- |
| CAND-01   | Customers can identify a primary task without navigating internal organizational structure                | B-01/B-02 → CX-01/03          |
| CAND-02   | Mobile user can complete the agreed P0 inquiry on constrained network/device                              | B-01/B-02 → CX-02/08          |
| CAND-03   | Customer receives truthful availability, price status, and delivery qualification                         | B-03/B-10/B-11 → CX-04/05     |
| CAND-04   | Custom order intake captures only the minimum viable production/quote inputs and protects unfinished work | B-02/B-05 → CX-05             |
| CAND-05   | Files/artwork have clear format, size, failure, review and revision outcomes                              | B-05 → CX-05/08               |
| CAND-06   | Complex/uncertain configurations are routed to assisted quote rather than false self-service certainty    | B-01/B-05/B-06 → CX-05        |
| CAND-07   | Customer-visible quotes preserve price/status/version and meaningful acceptance/rejection outcomes        | B-06/A-01 → CX-05             |
| CAND-08   | Customers can recover from form/network/payment failures without unwanted duplicate submission            | B-03/A-01 → CX-04/08          |
| CAND-09   | Customer order status is projected from canonical MGBOS truth with safe wording                           | B-01/B-08/A-01 → CX-06        |
| CAND-10   | Guest-to-account journeys do not leak orders across identities or organizations                           | G-01/A-01 → CX-06/08          |
| CAND-11   | Support/return flows preserve policy eligibility and human review where necessary                         | B-08/B-09 → CX-06             |
| CAND-12   | Feature-rich surfaces use progressive disclosure rather than loading all features for all customers       | Owner intent/B-02 → CX-03/08  |
| CAND-13   | Website pages have measurable, repeatable performance and accessibility exit gates                        | B-01/B-02 → CX-08             |
| CAND-14   | Omnichannel order intake preserves source/channel IDs and supports idempotent replay/reconciliation       | B-03/B-12 → CX-07             |
| CAND-15   | Founder's manual touch count and interruption burden are measurable across customer journeys              | P-01/R-01 → CX-02/09          |
| CAND-16   | Customer AI is useful without being the authority for price, financial terms, or unsupported deadlines    | B-04/A-02 → CX-06/08          |
| CAND-17   | Product can operate in assisted/manual fallback when integrations or AI are unavailable                   | B-04/R-01 → CX-02/07/08       |
| CAND-18   | Launch and later self-service/omnichannel releases require evidence-driven, bounded gates                 | R-01/R-02/R-03 → CX-09        |

## 9. Decisions and research questions for subsequent PRDs

### 9.1 Product decisions that belong with Owner (only if changing strategy)

| Decision                                                 | Working default for drafting                                                                                      | Final owner                        |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Which customer promise defines premium?                  | **Fast, clear, trustworthy, effortless**; aesthetics and sophistication should support these outcomes             | Owner                              |
| Which customer track ships first?                        | Existing controlled **Custom/Business assisted-sales** baseline preserved; customer UX definition can be parallel | Owner if changing roadmap          |
| Should retail commerce ship with first controlled pilot? | **Not automatically**; await validation/dependency decisions                                                      | Owner                              |
| Should Custom Builder launch in V1?                      | **No default**; define gate and preview roadmap, not autonomous pricing promise                                   | Owner + relevant commercial policy |
| Which channel to integrate first?                        | **Undecided** until business unit economics, access and workload are assessed                                     | Owner for cost/business choice     |
| Does premium require animation-heavy UI?                 | **No**; motion must add usability, respect accessibility and performance                                          | Product design decision            |
| Is MultiGraph within CX-01?                              | **No**; common patterns reusable, separate future customer-product contract                                       | Owner if program scope expands     |

### 9.2 Evidence still required before implementation

1. Primary P0 customer scenarios with concrete inputs, actor identity, expected customer output, and founder action count.
2. Product/service combinations actually offered at launch, including supported artwork requirements and quote pricing policies.
3. Evidence of realistic device/network environment and measurable UX/performance budgets for critical journeys.
4. Reviewed account/guest ownership, personal data protection, organization isolation, and public API boundaries.
5. Browser proof of customer journeys at candidate HEAD using genuinely isolated and authorized test environments.
6. Marketplace-specific technical rights/rate limits/webhooks/settlement and policies before committing to external connector timelines.
7. Transaction-level duplication/error recovery, including submitted-but-response-lost and payment status pending.
8. Independent pilot/user feedback, actual quote-processing time, and founder effort baseline.

**No fabricated targets:** quantitative acceptance limits for latency, conversion, automation ROI or reliability are deferred to CX-08/CX-09 and must cite their baseline/method. Common industry benchmarks may inform targets but do not establish current measured performance.

## 10. Sequencing, gates and ownership

**Stage 1 — Reconciliation (this CX-00):** close source inventory, classify authority, and freeze a non-duplicative product-package outline.

**Stage 2 — Product contract (CX-01):** define a unified, customer-facing PRD; preserve the upstream TeeStock business vision and roadmap gates.

**Stage 3 — Journey and UI behavior (CX-02 through CX-06):** derive use cases, state transitions, error handling, handoffs and UX quality; trace every requirement to its normative owner.

**Stage 4 — Quality, integration and rollout (CX-07 through CX-09):** define measurable acceptance, safe channel interfaces, and staged customer validation.

**Stage 5 — Engineering adoption:** Head Engineering independently reconciles capabilities with current source, MGBOS canonical architecture and governance, risk classification, then creates bounded implementation contracts/work packages only after required Owner approvals.

At every stage:

- **Product / Co-Founder:** customer needs, outcomes, user journey, product trade-offs, package preparation.
- **Head Engineering:** architecture ownership, technical feasibility, risk/gates, engineering contracts and independent assurance.
- **Antigravity:** implementation only within approved bounded package.
- **Owner:** major business scope, capital/cost, irreversible/security/autonomy decisions, or roadmap deviations.

**Stop conditions:** conflicting canonical authority; material missing source evidence; active PR overlap; proposal implying unauthorized auth/payment/security changes; unsupported external platform availability; source HEAD changes invalidating an audit finding. Stop and re-evaluate instead of silently treating the plan as approved.

## 11. Proposed repository placement and promotion checklist

**Proposed location (not yet created):**

```text
systems/mgbos/docs/product/teestock-customer-platform/
  README.md
  cx-00-source-gap-audit.md
  cx-01-master-prd.md
  cx-02-customer-journeys-service-blueprint.md
  cx-03-experience-design-interaction-spec.md
  cx-04-commerce-checkout-experience.md
  cx-05-custom-b2b-ordering-experience.md
  cx-06-customer-account-service-experience.md
  cx-07-omnichannel-integration-requirements.md
  cx-08-experience-quality-acceptance.md
  cx-09-phased-delivery-validation-plan.md
```

All files other than CX-00 are **PLANNED OUTPUT NAMES**, not claims that files exist. The directory should be created only with the first authorized repository documentation integration; do **not** create empty placeholders.

Before integration into repository:

- [ ] Verify current `main` and check PR #73/index overlap; reconcile destination with current docs routing.
- [ ] Confirm package ownership (`systems/mgbos/docs/product/` vs any newly governed alternate) under G-01/G-02.
- [ ] Correct any changed file links, version metadata, and source claims since the pinned snapshot.
- [ ] Ensure no new document falsely overrides TeeStock commerce/pricing policy or MGBOS architecture.
- [ ] Resolve relevant product decisions with Owner; retain unresolved items as PROPOSED/NOT_VERIFIED.
- [ ] Validate relative links, frontmatter and available docs checks on an authorized documentation PR.
- [ ] Obtain appropriate engineering/governance review before the PR is merged.
- [ ] Do not trigger implementation, database updates, deployment, or production access through documentation-only approval.

## 12. Acceptance of CX-00 and next action

**CX-00 analytical acceptance criteria** (for review, not self-certified independent QA):

- `AC-00-01`: Identifies exact repository snapshot, inspection scope and limits.
- `AC-00-02`: Separates source implementation from documented intent and future capability.
- `AC-00-03`: Contains an authority-respecting upstream source table.
- `AC-00-04`: Contains explicit `REUSE / REFINE / NEW / DEFER` dispositions for customer-facing needs.
- `AC-00-05`: Distinguishes genuine contradictions from valid sibling-scope differences and sequencing tensions.
- `AC-00-06`: Preserves Founder Control/MGBOS/JARVIS/business ownership and approval boundaries.
- `AC-00-07`: Lists the minimum product/evidence decisions necessary before implementation.
- `AC-00-08`: Produces bounded ownership and a single next documentation step.

**CX-00 disposition:** `DRAFT_ANALYSIS_COMPLETE_WITH_DECLARED_LIMITATIONS` — suitable input to draft CX-01, **not yet owner-approved canonical documentation**, and not independently QA-certified.

**Exactly one recommended next action:** draft **CX-01 Customer Platform Master PRD** from the `REFINE`/`NEW` findings in CX-00. CX-01 must explicitly reference B-01/B-02/B-03 and preserve assisted-sales-first constraints unless the Owner changes the product strategy. Do not hand CX-01 directly to Antigravity.

---

_Prepared 2026-10-16. Source baseline is pinned for audit traceability; always verify live repository state again before publication or implementation._
