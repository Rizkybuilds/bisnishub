---
canonical_id: proposed.mgbos.product.teestock-customer-platform.cx-03
status: DRAFT
version: 0.1.1
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: PENDING_OWNER_APPROVAL
scope: teestock-customer-platform-experience-design-and-interaction
document_class: product-specification
normative_authority: NONE_UNTIL_APPROVED_AND_ROUTED
product_program: PROPOSED_TEESTOCK_CUSTOMER_EXPERIENCE_COMMERCE
product_maturity: PROPOSED_EXPERIENCE_DESIGN_CONTRACT
engineering_readiness: NOT_READY_FOR_ENGINEERING
implementation_status: PRODUCT_DEFINITION_ONLY
repository: Rizkybuilds/bisnishub
repository_branch: main
source_baseline_commit: 2800c474563309bda49d84d712f79b68c9dde36a
source_baseline_checked: 2026-10-16
source_inspection: focused_document_and_public_app_source_review_not_full_runtime_audit
created: 2026-10-16
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md
supersedes: null
remediation_package: CX-REM-R1
remediation_review: AUTHOR_SELF_REVIEW_NOT_INDEPENDENT
companion_drafts:
  - cx-00-source-gap-audit.md
  - cx-01-master-prd.md
  - cx-02-customer-journeys-service-blueprint.md
proposed_authoritative_for_after_approval:
  - customer_platform_experience_principles
  - interaction_behavior_and_customer_facing_ui_states
  - experience_level_component_semantics
  - responsive_and_accessible_customer_interaction
  - front_end_design_quality_requirements_and_proposed_acceptance
  - proposed_customer_experience_design_deliverables
not_authoritative_for:
  - teestock_brand_identity_visual_assets_fonts_logos_or_commercial_copy_policy
  - business_pricing_stock_fulfillment_or_production_policies
  - mgbos_entities_state_machines_events_commands_or_permissions
  - exact_css_tokens_component_implementation_or_frontend_architecture
  - customer_identity_session_or_organization_security_rules
  - external_service_capabilities_or_marketplace_policy
  - jarvis_agent_authority_or_model_runtime
  - legal_accessibility_certification_or_provider_compliance
  - implementation_authorization_deployment_or_launch_readiness
  - multigraph_customer_product_definition
source_dependencies:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - docs/operating-model/solo-founder-operating-system.md
  - bisnis/teestock/02-brand/brand-identity-system.md
  - bisnis/teestock/02-brand/voice-and-copy-system.md
  - bisnis/teestock/10-product-tech/digital-product-vision.md
  - bisnis/teestock/10-product-tech/website-information-architecture.md
  - bisnis/teestock/10-product-tech/commerce-platform.md
  - bisnis/teestock/04-services/custom.md
  - bisnis/teestock/04-services/business.md
  - bisnis/teestock/07-operations/customer-service.md
  - bisnis/teestock/07-operations/order-fulfillment.md
  - bisnis/teestock/07-operations/returns-and-warranty.md
  - systems/mgbos/docs/architecture/domain-map-capability-ownership.md
  - systems/mgbos/docs/architecture/business-state-machines.md
  - systems/mgbos/docs/architecture/permission-authorization-model.md
  - systems/mgbos/docs/product/teestock-founder-control-prd.md
  - systems/mgbos/docs/product/teestock-operational-pilot-plan.md
---

# CX-03 — TeeStock Experience Design & Interaction Specification v0.1.1

> **STATE: DRAFT / SELF-REVIEWED / NO CANONICAL OR IMPLEMENTATION AUTHORITY.** This is a proposed customer-experience specification derived from the CX-00 audit, CX-01 Master PRD, CX-02 Customer Journeys & Service Blueprint, selected canonical TeeStock business/brand documents and the active TeeStock shell at the baseline SHA. It does not assert a working checkout, catalog, configurator, customer portal, AI assistant, marketplace adapter or production deployment. It does not update GitHub or authorize a Builder. Existing canonical sources win any conflict until a governed decision changes them.

## 0. Executive experience contract

**Working product:** TeeStock Customer Experience & Commerce Platform.

**Design north star:** **High capability, low cognitive load; premium expression, real utility; fast by default, sophisticated when needed.**

**User promise:** A customer can discover what TeeStock actually offers, understand options and constraints, communicate a need, complete an eligible task and recover from problems without learning internal business domains or waiting for an AI agent to finish an ordinary step.

**Founder promise:** A customer action that is legitimately available online creates the correct, traceable, bounded downstream operational handoff. A beautiful form that still forces the solo founder to re-enter all data is not a completed experience.

**Meaning of "next-level":**

1. Clear intent-based navigation; no invented or dead-end actions.
2. A restrained, recognizable, trustworthy TeeStock identity.
3. Contextual functionality: advanced controls appear only when relevant and eligible.
4. High-quality feedback, recovery and accessibility across input methods.
5. Distinct separation between visual UI state, customer-facing business projection and canonical business truth.
6. Observable, maintainable performance on affordable mobile devices, not desktop-only demos.

**P0 means a premium _assisted-sales_ entry experience**, not a fake complete commerce platform. P1 extends valid retail/customer self-service; P2 adds evidence-gated complex configurators, integrations and AI. Existing operational pilot authority is unchanged.

### 0.1 Authority vocabulary

| Tag                           | Meaning                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `SOURCE_BRAND`                | Derived from existing TeeStock Brand Identity/Voice. CX-03 references; does not overwrite. |
| `SOURCE_IA`                   | Existing TeeStock website information architecture; no covert navigation rewrite.          |
| `CX03_PROPOSED`               | New design behavior offered for Owner review, NOT approved authority.                      |
| `REQUIRES_CX04_05_06`         | Interaction depends on specific downstream commerce/custom/account contract.               |
| `REQUIRES_ENGINEERING_REVIEW` | Cannot freeze until technical and security impact are evaluated.                           |
| `NOT_VERIFIED`                | No real-world/customer/lab field evidence supports a maturity claim yet.                   |

### 0.2 What this document does not do

- Does **not** redesign TeeStock brand or assert specific logo, font license, hexadecimal palette, photography, brand voice or motion asset is approved.
- Does **not** choose Next.js component libraries, CSS framework, rendering mode, API, analytics vendor or database representation.
- Does **not** set business prices, invoice state, SKU semantics, legal terms, stock promise, courier status, production proof authority, refund eligibility or AI autonomy.
- Does **not** require all planned features to appear at launch.
- Does **not** claim laboratory results, usability validation, WCAG conformance, Core Web Vitals success or independent QA.
- Does **not** alter in-flight Founder Control, security, browser QA or documentation-routing pull requests.

## 1. Evidence, product alignment and ownership

### 1.1 Source hierarchy

| Concern                                                     | Upstream/source of truth                                              | CX-03 ownership                                                          |
| ----------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Brand personality, master visual character, approved assets | `bisnis/teestock/02-brand/brand-identity-system.md`                   | Product UI application, not new identity                                 |
| Voice, customer-facing terms and tonal contexts             | `bisnis/teestock/02-brand/voice-and-copy-system.md`                   | Clarity patterns and UI content structure                                |
| Customer jobs, sitemap and navigation priorities            | `bisnis/teestock/10-product-tech/website-information-architecture.md` | Interaction behavior, accessibility, progressive disclosure              |
| Commerce product/stock/pricing truth                        | TeeStock Commerce Platform/Pricing + MGBOS canon                      | Faithful UI representation only                                          |
| Customer journey and handoffs                               | CX-01 `JRN-01..08`; CX-02 `CX2-BP-01..08`                             | Screen/task-level interaction behavior                                   |
| UI/interaction acceptance                                   | CX-01 NFR/AC and this proposed spec                                   | Draft quality acceptance; CX-08 owns test execution contract             |
| Security/auth/customer private data                         | MGBOS permissions and approved security owners                        | Safe failure messages, privacy-aware presentation                        |
| Runtime/integration/AI limits                               | MGBOS/JARVIS/adapter canonical owners                                 | Optional progressive UX and bounded fallbacks                            |
| Current website                                             | `systems/mgbos/apps/teestock/src/app/*` on baseline SHA               | Evidence that public app remains a shell, not a live commerce experience |

### 1.2 Existing identity preserved (`SOURCE_BRAND`)

Brand Identity System establishes **MODERN / CLEAN / STRUCTURED / HUMAN / TACTILE / FUNCTIONAL**, with **Neutral Core + Expressive Product Layer** and a visual position between editorial fashion, product system and modern commerce. It warns against a generic corporate SaaS appearance and against an overly fashion-editorial interface that makes Services impractical.

Voice & Copy System establishes **CLEAR / WARM / DIRECT / INFORMED / CALM / PRACTICAL**. Tone varies by task: editorial product discovery; practical Custom; professional Business; calm/supportive support; expressive Originals. This specification preserves those semantics and does not replace brand content policy.

### 1.3 Baseline implementation evidence

As inspected at `2800c474563309bda49d84d712f79b68c9dde36a`: `systems/mgbos/apps/teestock/src/app/page.tsx` is a launch/preparation message; `/custom-atelier/page.tsx` says ordering is not available; `features/` and `components/` contain only placeholders; workspace `packages/ui`, `packages/ai` and `packages/integrations` export reserved boundaries. This is **source evidence**, not runtime testing and not a claim about unpublished work on other branches.

### 1.4 Trace to CX-01 and CX-02

- CX-01 `XP-01..10`: customer intent first; progressive capability; truthful commitments; mobile usability; confirmation; recovery; accessible design; optional AI; channel fidelity; reduced founder re-entry.
- CX-01 `CX1-FR-001..005`, `009..015`, `038..040`: direct P0 interaction obligations.
- CX-01 `CX1-NFR-001..015`: non-functional guardrails; especially `002`, `003`, `004`, `005`, `011`, `013`.
- CX-02 `CX2-SR-01..20`: truth, handoffs and no-phantom-completion principles.
- CX-04/05/06 own commerce/custom/account domain-specific details; CX-07 owns channel experience expectations; CX-08 owns tested quality thresholds; CX-09 owns phased delivery.

## 2. Experience design principles — `CX3-DP-*`

| ID          | Principle                              | Practical UX consequence                                                              | Anti-pattern                                           |
| ----------- | -------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `CX3-DP-01` | **Content before ornament**            | Offer, eligibility, facts and next action appear before nonessential showpieces       | Beautiful hero hides actual service entry              |
| `CX3-DP-02` | **Calm canvas, expressive products**   | Master UI has visual restraint; photos/campaign stories can be expressive             | Every page uses loud, competing effects                |
| `CX3-DP-03` | **Reveal depth on demand**             | Basic flow first; advanced controls by need and capability                            | Print jargon and every option in first form            |
| `CX3-DP-04` | **One primary task per context**       | Clear primary CTA plus visible alternatives where relevant                            | Four identical high-emphasis buttons                   |
| `CX3-DP-05` | **Truth has visible status**           | Estimate/draft/approved; pending/confirmed; received/reviewed visibly differ          | "Order confirmed" after only form submit               |
| `CX3-DP-06` | **Every wait has a meaning**           | Known progress vs indeterminate wait vs unknown server state shown honestly           | Endless spinner or invented percentage                 |
| `CX3-DP-07` | **Recover where possible**             | Preserve safe entries, explain fixes, provide retry/manual path                       | Entire form clears on server timeout                   |
| `CX3-DP-08` | **Accessible by design**               | Semantic structure, keyboard, focus, contrast and reduced motion are first-class      | Accessibility left to late QA                          |
| `CX3-DP-09` | **Mobile is the baseline**             | Thumb-reachable common actions; inputs unaffected by virtual keyboard                 | Desktop navigation compressed into phone               |
| `CX3-DP-10` | **Lightweight default**                | No paid AI, design editor, 3D/animation package required for normal browsing          | Home blocked by large interactive bundle               |
| `CX3-DP-11` | **Visible capability boundaries**      | Supported, assisted, coming later, temporarily unavailable distinctly labelled        | Disabled buy CTA implying product actually purchasable |
| `CX3-DP-12` | **Consistency without sameness**       | Shared interaction grammar; product/Business/Originals surface personality can differ | Same generic SaaS dashboard for all customers          |
| `CX3-DP-13` | **Explain without exposing internals** | Customer-friendly statuses and next step; no raw state machine                        | "QC_WORK_ORDER_BLOCKED" exposed to user                |
| `CX3-DP-14` | **Make physical reality legible**      | Lead-time, proof, QC and shipping explained as externally verifiable steps            | Animation advances production magically                |
| `CX3-DP-15` | **Measure work eliminated**            | Valid submitted context reaches operations without founder retyping                   | Chat summary lost; founder fills another sheet         |

## 3. Audience and device contexts

| Audience/context                      | High-value action                     | Interaction focus                                             | Privacy/trust constraint                     |
| ------------------------------------- | ------------------------------------- | ------------------------------------------------------------- | -------------------------------------------- |
| First-time individual buyer           | Choose Shop or Custom                 | Explain offer, avoid jargon, no mandatory account for inquiry | No fake stock or guaranteed price            |
| Repeat retail customer                | Discover/compare/reorder (P1)         | Familiar patterns, contextual history                         | Authenticated authorized history only        |
| Individual Custom buyer               | Express idea; upload optional artwork | Guided questions, preview is not proof                        | Source file privacy and file state clarity   |
| Business purchaser                    | Request quote, specify project        | Structured requirements, commercial review, documents         | Organization role/approver boundaries        |
| Low-bandwidth mobile customer         | Reach action and submit               | Low JS, readable images, recoverable drafts                   | No silent data loss                          |
| Assistive-technology/keyboard user    | Complete same legitimate task         | Native controls, proper names/roles/errors                    | No inaccessible drag-only flow               |
| Customer with partial information     | Seek guidance                         | Explicit unknown/"belum tahu" paths                           | Avoid fabrication of inputs/price            |
| Customer returning after interruption | Continue within approved session      | Clearly scoped persistence and status refresh                 | Shared-device/privacy and stale quote guards |

**Minimum product study contexts (proposed):** Indonesian mobile-first browsing; lower-end Android/desktop reference cohort, slow network, touch + keyboard, screen reader, zoom/reflow, reduced motion, interrupted connection, assistive and cognitive-accessibility evaluation. Sampling protocol defined with CX-08 / UX research owner.

## 4. Information architecture as interaction, not a new sitemap

### 4.1 Canonical primary intents (`SOURCE_IA`)

Per strategic decision `DEC-TS-2026-011`, the public customer presentation is retail-first, leading with curated graphic apparel collections and brand identity, while maintaining prominent, direct access to Custom and Business pathways (`DEC-TS-2026-009` operational priority preserved):

- `SHOP`: Curated graphic apparel showcase, collection storytelling, lookbooks, and garment specs front-and-center. Strictly nontransactional in initial `CX-S0` presentation (no live cart or checkout); transactional catalog and direct purchasing are gated in `CX-S1`.
- `CUSTOMIZE`: Prominent, directly accessible route for personalized/custom apparel inquiries.
- `FOR BUSINESS`: Prominent, directly accessible route for organizational, uniform, and bulk commercial requests.
- `BUILD MERCH`: Dedicated conceptual entry for creator and community merch projects; no fake automated portal.

These are intent labels from TeeStock website IA (`TS-TEC-002`). The eventual URL paths and availability are owned by existing IA and implementation decisions. IA recommendations do not constitute authorization for nonexistent routes or unverified transactional utility features. CX-03 proposes behavior and consistency only.

### 4.2 Header and global navigation interaction rules

| Situation                 | Proposed contract                                                                                                                                                                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop navigation        | Retail brand identity and curated apparel exploration lead, while `Custom` and `For Business` remain immediately visible in the primary navigation bar without scrolling; no internal sub-brand clutter; utility search/account/cart shown only if genuinely active |
| Small-screen navigation   | Mobile-first accessible menu toggle with clear accessible name, expanded state, logical focus order, touch targets $\ge 44 \times 44\text{px}$, close by button/Escape, and restored focus; instant access to Shop collections, Custom, and Business                |
| Deep-link entry           | User can orient via clear page title, brand header, breadcrumb/back navigation where useful, persistent next step; no requirement to visit homepage first                                                                                                           |
| Search unavailable in S0  | Do not render an apparently functioning search control if no reliable index/action exists; provide curated collection browsing and category links                                                                                                                   |
| Cart unavailable in S0    | No persistent empty/disabled cart icon suggesting live ecommerce; truthful CTA routes to collection exploration or assisted inquiry if approved                                                                                                                     |
| Account unavailable in S0 | Do not force signup or expose dummy profile links; guest inquiry still has safe confirmation/contact without account portal dependency                                                                                                                              |
| Sticky header             | Must not cover focused fields, headings, dialogs, anchor targets or touch controls; supports reduced-motion preferences                                                                                                                                             |
| Navigation change         | Preserve semantic landmarks, update document title and manage focus appropriately on route transitions                                                                                                                                                              |
| External marketplace link | Clearly communicate leaving TeeStock/site and any meaningful transaction-policy difference                                                                                                                                                                          |

### 4.3 Journey-level content hierarchy

In accordance with Retail-First customer presentation (`DEC-TS-2026-011`) and governed operational priorities (`DEC-TS-2026-009`):

1. **Brand identity & curated apparel:** Visual showcase of curated graphic collections, garment quality, and aesthetic identity front-and-center.
2. **Clear service pathways:** Prominently discoverable routes to `Custom` and `For Business` without requiring organizational knowledge.
3. **Truthful offer & availability status:** Plain heading and transparent distinction between informational discovery (lookbook, garment specs, drops) and active assisted inquiry; no false instant checkout claims.
4. **What do I do next?** One contextual CTA matching actual capability (explore collection, request custom quote, contact business sales).
5. **What will happen after?** Explicit customer expectations: assisted quote review, human confirmation, or drop notification.
6. **How do I recover/get help?** Contextual support, FAQ, and transparent direct contact routes.

Do not hide policy/fulfillment qualifiers or transactional limitations just to make visual design minimal.

### 4.4 Page complexity budgets (`CX03_PROPOSED`, qualitative)

- First paint/initial viewport: one primary decision and its short supporting context; no wall of filter panels or process diagram.
- Business pages may be longer when the purchase decision needs greater evidence, but first-step inquiry still has a short route.
- Interactive options appear when a customer reaches a decision requiring them; offer accessible "show details" rather than mandatory dense UI.
- An inactive advanced tool is not "feature richness"; hide or explicitly label it until deliverable.
- Essential disclosures, price qualifiers and consent must not be hidden behind optional progressive disclosure.

## 5. Visual language — design-system bridge (not a new brand identity)

### 5.1 Visual foundation and layout semantics

**Product-level recommendation:** stable composition, disciplined spacing, clear typographic hierarchy, generous white/negative space, useful image ratios, visible CTA hierarchy and selective tactility. **Do not** infer a specific color palette, font family, icon pack, exact grid-unit system or dark-mode default from this document. Existing TeeStock brand assets remain authoritative.

| Visual domain             | Required design-system decision                                                                                                    | Acceptance behavior                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Color                     | Approved brand core, surfaces, border, foreground, interactive and semantic feedback tokens; light/dark variants only if supported | Contrast remains sufficient and state does not rely only on color   |
| Typography                | Licensed/applicable brand fonts plus system fallback; display, heading, body, label, caption scale                                 | Text readable when browser fonts fail and at 200% resize            |
| Spacing                   | Consistent responsive spacing/rhythm tokens across page, panel, form and card                                                      | Content hierarchy evident; no cramped interactive touch targets     |
| Layout                    | Responsive content max-width, useful line lengths, image alignment and page container patterns                                     | No essential clipping at tested viewport/zoom                       |
| Imagery                   | Quality real garment/detail/print proof photos; cropping and aspect-ratio rules                                                    | User can evaluate size/material/placement without deceptive render  |
| Shape/elevation           | Purposeful component grouping and overlay layering                                                                                 | Cards distinguish content; shadows not primary information encoding |
| Iconography               | Consistent meaning, labels on ambiguous actions, accessible names                                                                  | Icon-only actionable controls still discoverable and labeled        |
| Motion                    | Subtle state transitions, never required to understand state                                                                       | Reduced motion route equally complete                               |
| Original/label expression | Distinct product/campaign art allowed within stable checkout/interaction grammar                                                   | Cross-brand expression does not compromise trust                    |
| Theme                     | Product owner to confirm supported theme modes                                                                                     | No arbitrary preference mismatch or low-contrast theme flip         |

### 5.2 Proposed token _categories_ (`CX3-DS-001..12`)

The following are **contract names/categories**, not CSS variable declarations or implementation choices. Token names may be translated after engineering/design-system reconciliation.

| ID           | Category         | Minimum semantic variants                                                             |
| ------------ | ---------------- | ------------------------------------------------------------------------------------- |
| `CX3-DS-001` | Brand core       | logo usage, core foreground/accent/reference palette source                           |
| `CX3-DS-002` | Surface          | page, raised panel, subtle panel, inverted/overlay                                    |
| `CX3-DS-003` | Text             | primary, secondary, muted, inverse, interactive                                       |
| `CX3-DS-004` | Borders/dividers | default, subtle, emphasized, focus, error                                             |
| `CX3-DS-005` | Actions          | primary, secondary, tertiary, destructive where legitimate; hover/focus/disabled/busy |
| `CX3-DS-006` | Feedback         | success, information, caution, error, uncertain/unknown, pending                      |
| `CX3-DS-007` | Typography       | heading levels, body, labels, helper/error, numeric display                           |
| `CX3-DS-008` | Spacing/sizing   | section rhythm, content gap, control gap, touch target, responsive margin             |
| `CX3-DS-009` | Radius/elevation | card, sheet/dialog, media, sticky affordance                                          |
| `CX3-DS-010` | Media            | product listing, detail, artwork preview, hero, thumbnail; optimized aspect variants  |
| `CX3-DS-011` | Motion           | duration/easing categories, entry, state change, loading, reduced motion alternatives |
| `CX3-DS-012` | Layering         | base, sticky header, contextual overlay, dialog, system message, skip-link/focus      |

**No magic values:** precise colors, font sizes, spacing pixels, animation durations, elevation levels, breakpoint choices and implementation naming belong in an approved design-system token inventory after review of TeeStock brand assets and real device tests. The goal is to prevent an AI Builder from choosing random brand elements.

### 5.3 Visual hierarchy contract

- P0 landing: customer intent or offer is visual center; no autoplay video required for comprehension.
- Product page: product truth (variant, fit, material, availability, price qualifier) before styling narrative, consistent with `TS-TEC-002`.
- Custom: current selection, requested outcomes, required inputs and next review step visually grouped.
- Business: confidence, evidence, commercial process and relevant documentation visible without pretending all terms are instant/automatic.
- Confirmation/status: clear factual event, reference and next action; not oversized celebration obscuring meaning.
- Error/empty: explain what happened, distinguish absence versus failed retrieval, offer recovery.

### 5.4 Color is not a business state machine

`success`, `warning`, `error`, `pending` semantic colors are **presentational meaning**. They do **not** create or rename MGBOS financial/production/order states. Any mapped customer label must be authorized by the appropriate domain. An unaudited visual-green badge must never imply payment settled, QC passed or package handed to courier.

## 6. Component behavior contract and state matrix

### 6.1 Required component anatomy

Every interactive reusable component needs: semantic purpose, accessible name, displayed label/copy, focus order, state descriptions, keyboard/touch behavior, responsive behavior, and screenshot/prototype for default/error/loading/disabled where relevant. Scope-specific business effects and server command authorization are **not** defined by the component.

| Family                  | UX contract                                                                                    | Common error to avoid                               |
| ----------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Link vs button          | Link navigates; button acts; both discernible and focusable                                    | Clickable `div` with no keyboard behavior           |
| Primary CTA             | Exactly one primary action per local decision context; supporting links remain discoverable    | Several same-color checkout/order CTAs              |
| Navigation/menu         | Clear expanded/collapsed state; Escape/focus rules for true dialogs                            | Hover-only dropdown unusable on mobile              |
| Product card            | Image, title, key attributes, reliable price/availability representation, one legitimate entry | Entire card ambiguous and hides unavailable product |
| Product variant picker  | Selected option text/shape, unavailable explanation, keyboard semantics                        | Color chip alone conveys selection                  |
| Quantity selector       | Numeric input, bounds shown, correction guidance, affected price qualifiers                    | Direct uncontrolled negative/zero quantity          |
| Form field              | Visible label, optional/required cue, helper, validation and error association                 | Placeholder used as sole label                      |
| Conditional group       | Reveals only relevant questions and explains why; retains/revalidates suitable values          | Hidden stale fields sent silently                   |
| Upload                  | Approved type/size guidance, upload/scan/review state separation, cancel/retry                 | Progress animation says "artwork approved"          |
| Alert/banner            | Severity, action, accessible announcement proportional to urgency                              | Every warning is a blocking modal                   |
| Toast                   | Only transient, non-critical acknowledgement; persistent confirmations remain visible          | "Order placed" only in disappearing toast           |
| Dialog/sheet            | Accessible title, focus trap as appropriate, Escape/cancel behavior and restore focus          | Dialog traps user or loses work                     |
| Tabs/accordion          | Correct roles, keyboard operation and progressive disclosure; critical info accessible         | Tabs hiding essential terms/CTA                     |
| Skeleton/progress       | Preserved layout, clear loading meaning, non-fabricated progress                               | Endless loading replacing error                     |
| Empty state             | No legitimate items found; context + next useful action                                        | "Belum ada pesanan" when server down                |
| Status stepper          | Customer-friendly projection from governed facts; unknown state explicit                       | Stepper advances because local timer completed      |
| Sticky action bar       | Contextual action remains reachable without blocking inputs, focus or content                  | Buy bar covers keyboard and summary                 |
| Search/filter/sort (P1) | Query state, active filters, reset, no-results vs failure, shareable state where valid         | Decorative search with no real index                |
| AI entry (optional)     | Clearly AI-assisted, limitations, handoff, dismissible                                         | Chat panel blocks purchase route                    |

### 6.2 Universal presentational state set — `CX3-STATE-01..12`

| ID             | UI state            | Visible requirement                                               | Never imply                                       |
| -------------- | ------------------- | ----------------------------------------------------------------- | ------------------------------------------------- |
| `CX3-STATE-01` | `READY`             | Enabled input/action with known prerequisites                     | Current inventory/payment validity without check  |
| `CX3-STATE-02` | `NOT_APPLICABLE`    | Control omitted/explained when irrelevant                         | User did something wrong                          |
| `CX3-STATE-03` | `UNAVAILABLE`       | Why feature/offer cannot be used now; alternative                 | Legitimate backend operation exists               |
| `CX3-STATE-04` | `LOADING`           | Waiting feedback without fixed invented percentage                | Data known/empty                                  |
| `CX3-STATE-05` | `SUBMITTING`        | Prevent accidental extra intent and signal processing             | Transaction committed                             |
| `CX3-STATE-06` | `RECEIVED`          | Acknowledgement only after authorized durable receipt evidence    | Quote/order/payment approved                      |
| `CX3-STATE-07` | `VALIDATION_ERROR`  | Field-level guidance; preserved non-sensitive entries             | Backend is unavailable                            |
| `CX3-STATE-08` | `UNAVAILABLE_DATA`  | Data could not be fetched; retry/contact                          | "No records"                                      |
| `CX3-STATE-09` | `EMPTY_RESULT`      | Legitimate successful fetch returned none; clear filter/next step | Server failed                                     |
| `CX3-STATE-10` | `UNAUTHORIZED`      | Safe refusal or re-authentication without exposing existence      | User's organization/customer records are present  |
| `CX3-STATE-11` | `STALE`             | Recheck/review changed price, quote, stock, proof or session      | Old action is still valid                         |
| `CX3-STATE-12` | `RECOVERY_REQUIRED` | Visible source of uncertainty and stable next action              | An uncertain external operation already succeeded |

**State namespace is UI-only.** `CX3-STATE-*` cannot be reused as canonical status values in databases or cross-domain commands. `UNAVAILABLE_DATA` and `EMPTY_RESULT` must remain distinct, aligning with ongoing internal UXR data-state QA concerns without extending their PR scope.

### 6.3 Component behavior inventory — `CX3-IC-01..20`

| ID          | Interaction contract                                          | Stage                 | Trace                   |
| ----------- | ------------------------------------------------------------- | --------------------- | ----------------------- |
| `CX3-IC-01` | Discoverable primary CTA with real destination                | P0                    | `FR-001..003`, `JRN-01` |
| `CX3-IC-02` | Accessible responsive menu with orientation and focus control | P0                    | `FR-001/005`            |
| `CX3-IC-03` | Visible eligibility and non-purchasability cues               | P0                    | `FR-002/004`            |
| `CX3-IC-04` | Form labels, field guidance, required/optional distinction    | P0                    | `FR-009/010`            |
| `CX3-IC-05` | Progressive disclosure for Custom/Business                    | P0                    | `FR-010/014`            |
| `CX3-IC-06` | File selection/status/error/alternative affordance            | P0 where approved     | `FR-011`                |
| `CX3-IC-07` | Requested-date vs confirmed-date presentation                 | P0                    | `FR-012`                |
| `CX3-IC-08` | Explicit authenticated receipt/unknown-submit recovery        | P0                    | `FR-013`                |
| `CX3-IC-09` | Estimated vs reviewed/accepted quote visual grammar           | P0/P1                 | `FR-015/016`            |
| `CX3-IC-10` | Useful backend-empty vs backend-error screens                 | P0/P1                 | `BR-007`, `NFR-006`     |
| `CX3-IC-11` | Catalog filter/search/sort state and recovery                 | P1                    | `FR-006/007`            |
| `CX3-IC-12` | Variant selection/availability qualification                  | P1                    | `FR-020..022`           |
| `CX3-IC-13` | Cart verification/reconfirmation of changed terms             | P1                    | `FR-023..027`           |
| `CX3-IC-14` | Pending vs verified payment outcome display                   | P1                    | `FR-024/025`            |
| `CX3-IC-15` | Protected customer status/history projection                  | P0 assisted/P1 portal | `FR-029..031`           |
| `CX3-IC-16` | Support/case creation and human fallback                      | P0 basic/P1           | `FR-032..034`           |
| `CX3-IC-17` | Proof preview vs exact version approval                       | P1/P2 gated           | `FR-019/034`            |
| `CX3-IC-18` | Auth/role-aware B2B account navigation                        | P1/P2 gated           | `FR-017`                |
| `CX3-IC-19` | Graceful optional assistant with handoff                      | P1/P2 optional        | `FR-040/043/046`        |
| `CX3-IC-20` | Modular heavy builder isolated from regular route performance | P2 gated              | `FR-018/019`, `NFR-004` |

## 7. Interaction grammar — `CX3-IX-*`

These are **customer-facing interaction expectations**, not code handlers, API contracts or authorization decisions.

### 7.1 Feedback timing and intent

| ID          | Trigger                                    | Expected interaction                                                                           | Guardrail                                                |
| ----------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `CX3-IX-01` | Press valid local action                   | Immediate visual/semantic acknowledgement that action was triggered                            | Feedback must not claim durable external success         |
| `CX3-IX-02` | Start asynchronous request                 | Determinate only when real progress is known; otherwise honest indeterminate progress          | No fake progress 80% for unknown backend                 |
| `CX3-IX-03` | Repeated click/tap on submit               | Guard duplicate user intent; preserve actual retry availability if unresolved                  | Client suppression does not replace server idempotency   |
| `CX3-IX-04` | Request accepted by authoritative endpoint | Stable receipt, relevant reference, next step, allowed contact/recovery                        | Receipt not interchangeable with quote/order             |
| `CX3-IX-05` | Request timeout, outcome unknown           | Show "unable to confirm" and safe retry/check path                                             | No blind retry that duplicates financial effect          |
| `CX3-IX-06` | Invalid user input                         | Focusable error summary where appropriate, inline correction, retain safe fields               | No destructive form reset                                |
| `CX3-IX-07` | Validation or source rule changes          | Explain what needs reconfirmation; retain compatible user intent                               | No hidden acceptance of stale quote                      |
| `CX3-IX-08` | Network disconnect                         | Non-alarming connection state, saved draft only if permitted, retry path                       | Never show last cached order as fresh verified truth     |
| `CX3-IX-09` | Navigate back or change step               | Preserve entered data where lawful/feasible; warn before truly destructive exit                | Do not add modal confirmation for every harmless action  |
| `CX3-IX-10` | Modal opens/closes                         | Deliberate initial focus; accessible label; focus return after dismissal                       | No focus loss behind overlay                             |
| `CX3-IX-11` | Task completes                             | Visible durable summary and next action, with accessible announcement                          | Not toast-only if reference/terms must be retained       |
| `CX3-IX-12` | User enables advanced experience           | Explain loading/capability and preserve regular alternate path                                 | Optional feature cannot monopolize primary interaction   |
| `CX3-IX-13` | Price/status/availability update           | Update from governed data; preserve context; request reconfirmation if terms materially change | No silent price increase at payable action               |
| `CX3-IX-14` | User requests human assistance             | Provide valid channel/hand-off status, not pretend a human already responded                   | No invented guaranteed response time                     |
| `CX3-IX-15` | User selects a destructive action          | Explain consequences; require confirmation only when irreversible/material                     | No ambiguous icon-only cancellation                      |
| `CX3-IX-16` | User activates external checkout/channel   | Set expectation about leaving TeeStock and who governs transaction                             | No fabricated in-platform cancellation/return privileges |

### 7.2 Disabled versus unavailable versus unauthorized

- **Disabled:** The action is legitimate but a required precondition is currently unmet; explanation must be discoverable even if the control itself is not focusable. Example: required quantity empty.
- **Unavailable:** Feature/provider/business offer cannot be supported now; do not render fake submit/buy behavior. Explain alternative; no artificial "coming soon" as a reliable fulfillment promise.
- **Unauthorized:** User's identity/role/session does not allow action or access. Provide safe sign-in/authorization route where appropriate without disclosing protected object existence.
- **Pending/unknown:** The request may be processing; do not duplicate intent or assert success. Present a useful check path based on approved idempotency and confirmation semantics.

### 7.3 Notification and announcement severity

| Severity                         | UI treatment                                                 | Announce behavior                                      | Persistence                                |
| -------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------ |
| Helpful hint                     | Inline/helper                                                | No interruptive live region                            | Available when context useful              |
| Non-critical success             | Inline status or nonblocking toast                           | Polite, only as needed                                 | Critical reference also shown persistently |
| Validation error                 | Error summary and field association                          | Announce errors after action; move focus intentionally | Until corrected                            |
| Processing/unknown               | Inline ongoing status                                        | Avoid repeating messages as animation updates          | Until authoritative outcome or next step   |
| Material safety/commitment issue | Persistent banner/clear blocking summary where necessary     | Appropriate accessible announcement                    | Until reviewed or resolved                 |
| Critical outage                  | Clear outage/recovery surface, unaffected navigation/support | Announce once appropriately                            | Until service truth restores               |

Avoid modal overuse, forced marketing popups, autoplay chat greetings, automatic scroll jumps, and animation-induced context changes.

## 8. Form, configuration and upload experience

### 8.1 Structured Custom/Business request pattern (`P0`)

**Entry:** customer understands what is required for the next step. **Submission:** only approved minimum inputs are mandatory; advanced details conditional. **Exit:** durable, authorized receipt + explanation of review and next step. **Backstage:** founder can use submitted context without manual transcription; CX-02 owns handoff.

| Stage                   | Screen behavior                                                                          | Error state                                             | Avoid                                          |
| ----------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------- |
| 1. Intent               | Choose `Custom`/`Business` on legitimate offer                                           | Unsupported offer routes to explanatory human option    | Company jargon                                 |
| 2. Essentials           | Product kind, rough quantity, contact, purpose, requested timeline as appropriate        | Field-specific errors; visible optionality              | Forcing expert print method choices            |
| 3. Progressive details  | Garment/style, size split, artwork readiness, business specifics only if necessary       | Can choose "butuh bantuan" / unknown options where safe | Implicitly treating blanks as final artwork    |
| 4. Upload (conditional) | Allowed file criteria, upload receipt, no proof-approval assertion                       | Retry/replace/review with secure alternative            | Raw file URL displayed to unauthorized viewers |
| 5. Review               | Concise summary: input, possible missing items, **requested** date, estimate/quote state | Correct/back without losing fields                      | Fine print hiding a price change               |
| 6. Submit               | Explicit customer consent where appropriate, processing state, duplicate-intent guard    | Unknown-outcome recovery                                | Fake "order accepted"                          |
| 7. Receipt              | Reference, meaning of receipt, next human/system step                                    | Support/recovery if confirmation unavailable            | Promised response SLA without policy           |

### 8.2 Field-level rules

- Ask for one decision at a time, but avoid a rigid multi-step wizard when a short form is clearer. The choice must be tested.
- Support familiar Indonesian input vocabulary. Label units such as `pcs`, `cm`, and `Rp` explicitly; never assume units from numbers alone.
- Distinguish optional field from unknown/"belum ditentukan" intentional input. Business validation decides whether that path is acceptable.
- Present field errors adjacent to fields with programmatic association, without destroying other fields. Summary focus behavior determined by form length/impact.
- Use input types/autocomplete appropriately subject to privacy and security review; mask sensitive values and do not include them in analytics.
- For conditional fields, state whether hidden answers will be discarded or retained; never secretly submit stale values that alter quote terms.
- Avoid misleading calculated totals when required business pricing or material rules are not yet stable.
- Steps/back controls must preserve safe fields while avoiding unapproved persistent storage of PII/artwork on shared devices.

### 8.3 Artwork: five visually distinct concepts

| Term              | Meaning in customer UX                              | Visual/copy distinction                                   | Authority                       |
| ----------------- | --------------------------------------------------- | --------------------------------------------------------- | ------------------------------- |
| Selected file     | Local user chose an asset                           | "File dipilih" only                                       | Browser/local state             |
| Uploaded/received | Server confirmed permitted file receipt             | "File diterima; belum diperiksa"                          | Approved upload flow            |
| Reviewed          | Authorized assessment/technical verification exists | "File sedang/dinyatakan diperiksa" with precise qualifier | Design/production owner         |
| Proof presented   | Specific version offered for review                 | Version identity and preview disclaimer                   | Approved proof artifact owner   |
| Proof approved    | Authorized actor approves exact current version     | Clear irreversible consequence and audit outcome          | MGBOS/approved business command |

Preview, placement mockup or AI artwork feedback **cannot** claim production feasibility, design ownership, copyright permission or proof approval. A customer can proceed via assisted option if visual tooling fails.

### 8.4 Secure drafts, resume and interruption

- **P0 aspiration:** avoid retyping after normal back/forward navigation. Whether a draft persists after reload/session loss needs CX-05, CX-06 and security/privacy review.
- Local draft is _not_ an accepted lead/order. Show unsent status and explicit re-submission if needed.
- On resume, revalidate any price, legal term, promised date, inventory or eligibility with authoritative service. Stale data is a warning, not automatically reconfirmed.
- Do not store payment secrets, raw artwork tokens or sensitive business pricing in browser analytics or unapproved local storage.
- Support a safe abandon/restart path; not every partial form has to be retained forever.

## 9. Page and screen patterns — `CX3-SP-*`

Patterns below define the **experience contract** for possible surfaces. A stage designation is not authorization to launch the page or enable its controls. Routes align conceptually with `TS-TEC-002`; final paths must be resolved with the IA owner.

### `CX3-SP-01` — Public home / offer router (`P0`)

**Primary outcome:** Within the first screen and subsequent straightforward scrolling, visitor encounters a premium retail apparel brand showcase front-and-center (`DEC-TS-2026-011`), understands TeeStock's garment standards, and can choose a real customer job without confusion.

- **Retail-led visual hierarchy:** Curated apparel collections, lookbooks, drop stories, and brand identity front-and-center; conveys design excellence and garment quality immediately.
- **Prominent service routing:** Clearly visible, persistent pathways to `Customize` and `For Business` (`DEC-TS-2026-009` operational priority preserved); visitor can jump directly to custom or B2B inquiry from hero and global navigation.
- **Truthful customer expectations:** Headlines and CTAs reflect genuine capability; no invented "instant print", same-day shipping, or live instant checkout promises prior to operational readiness.
- **Responsive & accessible standards:** Mobile-first layout; touch targets $\ge 44 \times 44\text{px}$; logical keyboard tab order with visible high-contrast focus rings; respects `prefers-reduced-motion`.
- **Resilient rendering:** First-screen comprehension survives image load failure (meaningful semantic alt text and fallback styling), ad blockers, font loading delays, and disabled script enhancements.
- **Footer & trust evidence:** Trust elements must be factual, attributable, and verifiable; clear contact, support, and legal information appropriate to active business readiness.
- **Visual success metric:** Customer perceives a high-standard apparel brand and can navigate to either retail discovery or assisted custom/business inquiry within 5 seconds on mobile.

**Anti-pattern:** Oversized autoplay video or heavy 3D canvas that degrades mobile performance, blocks keyboard navigation, or obscures `Customize`/`For Business` pathways.

### `CX3-SP-02` — Shop landing / collection discovery (`P0 limited / P1`)

- **Nontransactional discovery boundary (P0 / CX-S0):** Prior to verified retail operational readiness, Shop landing provides curated collection storytelling, lookbooks, garment quality education, and design showcase. It is strictly non-transactional: no live cart, automated checkout, payment processing, or unverified inventory claims.
- **Truthful availability & purchasing states:** Items are displayed with transparent status cues (e.g., lookbook preview, collection showcase, upcoming drop announcement, or assisted inquiry); no false "Buy Now" or "Add to Cart" affordances.
- **Static preview vs interactive PDP boundary:** Simple static collection and garment content previews may be displayed in S0; however, complete interactive product-detail and variant configuration (`CX1-FR-007`) remains strictly **P1** (earliest delivery candidate `CX-S1`).
- **Resilience and accessibility:** Visual empty states distinctly differentiate no published collections (`EMPTY_RESULT`) versus failed data retrieval (`UNAVAILABLE_DATA`); layouts survive missing images with clean text fallbacks; all interactive controls meet mobile touch ($\ge 44 \times 44\text{px}$) and keyboard accessibility criteria.
- **When live (P1 / CX-S1):** Expand to verified sellable catalog with category filtering, sorting, price basis disclosures, and governed inventory checks as specified by CX-04.

### `CX3-SP-03` — Product listing / product detail (`P1`)

- Product card and PDP display useful confirmed attributes before narrative; color and size not conveyed solely by visual swatches.
- Variant selection updates detail using governed availability/price context; uncertain data must be labeled rather than guessed.
- Appropriate zoom/fullscreen image interactions provide keyboard/touch alternatives.
- When option is unavailable, explain why and offer equivalent accessible next step where supported.
- Customer sees quantity/price basis and any material caveat before eligible cart action.
- Related items/recommendations cannot delay product evaluation or steal focus.

### `CX3-SP-04` — Custom landing and structured inquiry (`P0`)

- Plain-language offer, approved product/customization choices, process and limitations before intake.
- Form begins with minimum requirements; advanced options hidden until relevant; requested date not displayed as committed ship date.
- Customer can say "belum punya desain" if business process permits and understand human assistance.
- Submission receipt is not an order confirmation; no fake payment link or guaranteed turnaround.
- Founder receives enough structured data to avoid manual retyping; response channel expectation is honest.

### `CX3-SP-05` — Business landing / assisted quote (`P0`)

- Business use-cases and proof of capabilities must be real; avoid unsupported vendor/capacity promises.
- Business request clarifies contact, company context, rough volume, needed date and procurement requirements only as necessary.
- Show how review and quote approval works conceptually, without promising advanced account workspace in P0.
- Longer information is permissible because decision value is higher, yet CTA remains quickly accessible.
- No auto-credit, approved volume discount or contract acceptance through decorative UI.

### `CX3-SP-06` — Confirmation and next-step page (`P0`)

- Explicit headline states **what actually happened**: inquiry received, not accepted order.
- Stable approved reference if one exists, plus permitted summary and what happens next.
- Explain contact channel and correction route without displaying other users' private data.
- If server success cannot be verified, display recovery state rather than constructing a reference in the browser.
- Information remains available long enough to act; transient toast alone is insufficient.

### `CX3-SP-07` — Artwork upload / assisted proof (`P0 assisted / P1+`)

- Upload surface: permitted file formats/limits, receipt state, replace option, explain review.
- Proof surface (only once approved capability exists): exact version, review history as authorized, action consequences, fresh confirmation.
- Preview may include "simulasi visual" notice; not production proof or print-color guarantee unless authoritative proof states say so.
- If preview service fails, customer can continue with an approved assisted route.

### `CX3-SP-08` — Cart and eligible checkout (`P1`)

- Checkout UI must use finalized permitted product data/price/stock and approved business state transition; product design does not create these contracts.
- Guest/account choice grounded in security/privacy policy; no account wall without validated need.
- Cart/checkout states distinguish provisional pricing, expired session, changed stock and final authorized payment instruction.
- Data retry requires reconciliation rather than duplicate charge/order.
- Support payment-pending/failed/succeeded distinction based on backend/provider verification.
- Material legal/financial disclosure accessible before customer commitment.

### `CX3-SP-09` — Order tracking / status (`P0 assisted / P1 portal`)

- Show one factual, customer-friendly state plus last verified update where appropriate.
- Keep details layered: summary first, explanation and support route next.
- A graphical progress bar must derive from canonical facts, not a time estimate, frontend timer or optimistic cache.
- Distinguish no order, unavailable data, login/authorization required and delayed external updates.
- Do not expose raw production financials, vendor rates, internal exception taxonomy or another customer's shipment.

### `CX3-SP-10` — Customer account, quotes and reorder (`P1/P2`)

- Navigation grouped by customer jobs, not MGBOS modules.
- Explicit session/organization context when multiple authorized identities apply.
- Reorder uses current eligibility/stock/price: old order snapshot is reference, not present authority.
- Quote acceptance requires exact version, legitimate approver and clear consequence.
- Financial/private data stays behind independently verified authorization; UX alone is not control.

### `CX3-SP-11` — Help, support and returns (`P0 basic / P1`)

- Help can start with concise FAQ, contact, tracking guidance and accurate policy summary.
- Support request retains permitted order context without requiring redundant explanations.
- Display "permintaan pengembalian diterima untuk ditinjau", not "refund disetujui", unless actual authority exists.
- Evidence upload has privacy/size/state guidance and a failure route.
- Complaint tone calm and helpful; no forced AI chat gate before human option.

### `CX3-SP-12` — AI assistant and advanced custom builder (`P1/P2 optional`)

- Agent disclosure/limitations are clear; optional assistant opens by customer action, not autoplay.
- The ordinary deterministic journey remains accessible even if assistant, model, retrieval, or vector service fails.
- AI drafts/suggestions are distinguishable from verified business offers; no unreviewed pricing, promise, stock, refund or final authority.
- Advanced designer is selectively loaded only inside eligible flow, with accessible non-drag controls, undo/cancel, version clarity, fallback.
- Mobile feature parity means _task success_, not forcing desktop's exact canvas interactions onto narrow screen.
- Adversarial or prompt-injection/unsafe outputs require bounded escalation in separate JARVIS/security contracts.

## 10. Responsive and input adaptation

### 10.1 Responsive is behavioral

A fluid design may use breakpoints, but **these are test fixtures, not locked CSS implementation breakpoints**. Final layout/container and art direction decisions need visual/UI validation and Head Engineering consultation.

| Fixture                        | Proposed evaluation (CSS viewport dimensions/condition)   | Specific concern                                                    |
| ------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------- |
| Compact mobile                 | Width 320 px                                              | No horizontal clip, usable menu/forms/sticky CTA                    |
| Common mobile                  | Width 360–390 px                                          | Keyboard, touch target, copy and image balance                      |
| Larger mobile / compact tablet | Width ~430–768 px                                         | Form grouping, variant selectors, drawer layout                     |
| Tablet/landscape               | Width ~768–1024 px                                        | Two-column choices only when readable                               |
| Desktop                        | Width ~1280–1440 px                                       | Constrained line-length, intentional whitespace and content density |
| Zoom                           | Text zoom 200%; overall zoom and reflow checks            | No hidden/overlapped controls; WCAG reflow evaluation               |
| System settings                | Reduced motion; high contrast/forced colors as applicable | Visible states without animation/color alone                        |
| Input                          | Touch, mouse, keyboard, screen reader                     | Equivalent completion of core tasks                                 |

No assumption that `320px` or `768px` equals a specific device model. Test by actual available browsers/device environments and record exact environment.

### 10.2 Mobile sticky actions

- Sticky CTA only if it materially reduces work and does not cover content, focused input, error summary or system keyboard.
- Provide enough safe-area padding; floating chat must not block CTA or support link.
- Sticky action should explain eligibility and material price qualifiers; contextual scrolling must reveal detail easily.
- If keyboard occupies most screen, docked action is moved/hidden in a way that preserves form submission discovery.
- Rotating screen or changing orientation must not discard input or hide current stage.

### 10.3 Touch and pointer targets

**Product preference:** prominent tap targets around **44 × 44 CSS pixels** for frequently used customer controls, subject to visual and layout suitability. This is a _design preference_, not a claim that WCAG 2.2 AA universally mandates 44px. WCAG 2.2 AA Success Criterion 2.5.8 has a **24 × 24 CSS-pixel minimum with defined exceptions**; the 44px enhanced target is Level AAA SC 2.5.5. Small inline text links follow standard's applicable exceptions. Refer to W3C normative criteria, not folk rules.

### 10.4 Content density and reading

- Hierarchy via heading/spacing/typographic weight, not only font size or colors.
- Keep instructions understandable for nontechnical apparel buyers; explain jargon with contextual short help.
- Numeric input controls present units and current quantity; product information and price qualifiers should be visible near action.
- Layout permits legitimate Indonesian copy expansion, long names and status messages without breaking.
- Avoid truncating critical reference numbers, price units, disclaimer text or form errors.

## 11. Accessibility contract (`CX1-NFR-005`)

**Target (proposed):** WCAG **2.2 Level AA**, evaluated by accessibility specialists including manual checks and assistive-technology journeys; complete conformance cannot be certified by an automated scanner. Source: https://www.w3.org/TR/WCAG22/ . This document establishes expectations but **no certification or legal compliance claim**.

| Area                    | Customer experience obligation                                                                                    | Verification candidate                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Semantics               | Landmarks, meaningful headings, native button/link/form semantics                                                 | DOM and browser inspection              |
| Keyboard                | All essential interactions without mouse; no trap; sensible Tab/Shift+Tab order                                   | Manual-only keyboard run                |
| Focus                   | Visible focus, managed focus after dialog and route changes; not hidden behind sticky UI                          | Manual + screenshot check               |
| Forms                   | Accessible label/help/error, required hints not color-only, sensible summary/inline error                         | Assistive-technology scenario           |
| Visual contrast         | Standard AA thresholds for normal/large text; important UI nontext distinguishability                             | Token and rendered color/contrast audit |
| Zoom and reflow         | Readable at 200% text and required reflow without losing core functionality                                       | Browser zoom/device matrix              |
| Touch                   | Target sizing/spacing meeting applicable WCAG AA criterion; generous preferred targets for high-frequency actions | Measurement + touch test                |
| Dialog and sheets       | Accessible title, focus containment/return as needed, Escape/cancel semantics and background handling             | Keyboard/screen-reader run              |
| Tabs and custom pickers | Appropriate component roles and keyboard pattern; avoid invented semantics                                        | Manual interaction audit                |
| Motion                  | `prefers-reduced-motion` respected; no dependence on motion for critical updates                                  | OS setting + journey replay             |
| Async updates           | Live regions used selectively; no repeated noisy announcements                                                    | Screen-reader check                     |
| Authentication          | No unnecessary memory/cognitive challenge; approved alternatives per applicable standard                          | Security + accessibility review         |
| Dragging/custom editor  | Equivalent controls for functionality when dragging isn't essential                                               | Alternative-input validation            |
| Color/size variants     | Selected and unavailable states in text/shape/semantics                                                           | Keyboard/assistive check                |
| Language                | Document language and multilingual excerpts appropriately identified                                              | Markup and AT speech inspection         |

**Specific high-risk checks:** focus not obscured (`2.4.11` AA), dragging alternatives (`2.5.7` AA), target size (`2.5.8` AA), redundant entry (`3.3.7` A), accessible authentication (`3.3.8` AA). Differences between AA and AAA must be documented precisely. An exception from third-party iframe or provider is not automatically accepted; CX-08 must classify provider responsibility and fallback.

## 12. Motion, microinteraction and progressive enhancement

### 12.1 Motion decision model

| Motion purpose      | Allowed direction                                                             | Constraint                                     |
| ------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------- |
| Orientation         | Gentle reveal of content after user navigation when it does not delay reading | No critical delay or forced scrolling          |
| Selection           | Brief transition/highlight indicating selected variant or field state         | Persistent visible selected state remains      |
| Processing          | Honest spinner/skeleton during unknown duration; determinate only when known  | No fabricated progress or browser-only success |
| Campaign expression | Tasteful optional animation near content                                      | No autoplay blocking tasks or CWV regression   |
| Product image       | Responsive transitions/zoom with accessible still alternatives                | No hover-only information                      |
| Dialog/drawer       | Predictable opening/closing with managed focus                                | Respect reduced-motion settings                |
| Error               | Inline explanation and intentional focus/announcement                         | Never shake-only error indication              |
| Advanced builder    | Optional feedback only inside eligible advanced tool                          | Separate loading and reduced-motion fallback   |

### 12.2 Microinteraction rules

1. Interactive affordances must exist without hover; hover enriches, not reveals essential action.
2. Motion cannot communicate success/failure as the sole signal; text/semantics remain.
3. Confirmations should not interrupt rapid, low-risk browsing; irreversible actions need explicit consequence.
4. No scroll hijacking, mandatory parallax, forced progress animation, or autoplay media on customer critical path.
5. Any animation cost must be tested on target mobile hardware and disabled/replaced when performance degrades.
6. Avoid obligatory third-party widgets/scripts to achieve cosmetic quality.

### 12.3 Progressive enhancement and heavy surfaces

The platform must ship progressively: text, offer clarity, navigation and simple assisted inquiry have priority; optional recommendation engines, previews, video, configurators, AI and personalization are additive. Exact no-JS compatibility commitments depend on CX-08 test matrix and Head Engineering feasibility; do not promise fully functioning no-JS payment checkout by default. Provide **human-usable alternate route** where heavy functionality fails.

## 13. Performance and page-experience safeguards

### 13.1 Required outcome vs not-yet-measured target

**Proposed quality direction reused from CX-01 `CX1-NFR-002`:**

- Largest Contentful Paint (LCP) **≤ 2.5 seconds** at p75.
- Interaction to Next Paint (INP) **≤ 200 milliseconds** at p75.
- Cumulative Layout Shift (CLS) **≤ 0.1** at p75.

Report _mobile and desktop separately_ with sample count, time range, route cohort and any missing-field-data limitation. These are Google "good" thresholds (https://web.dev/articles/vitals), not measurements of TeeStock. Pre-launch laboratory runs cannot be treated as real-user p75 success. CX-08 owns reproducible methodology, budgets, gating and exceptions.

### 13.2 Recommended guardrails (`CX03_PROPOSED`)

| Concern            | Product constraint                                                                          | Evidence required later                  |
| ------------------ | ------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Initial JS         | Heavy UI/editor/assistant code absent from basic route's critical path                      | Per-template bundle analysis             |
| Font loading       | Fallback readable and layout stable; licensed brand font choice confirmed                   | Browser render / CLS / asset audit       |
| Image loading      | Responsive encoding/sizes, aspect preservation; hero/LCP asset prioritized; below-fold lazy | Network waterfall + visual review        |
| Media              | Autoplay/large video not required for P0 task                                               | Disabled-media journey remains complete  |
| Third-party embeds | Never block normal customer flow; consent/privacy review                                    | Failure simulation + request inventory   |
| Animation          | Low-cost transforms/state; reduced-motion alternative                                       | CPU/long-task analysis on mobile profile |
| Form hydration     | Critical actions usable promptly after content display; nonessential widgets deferred       | Lab interaction tests                    |
| Dynamic lists      | Avoid rendering long catalogs/projections all at once                                       | P1 interaction/memory checks             |
| Preview customizer | Lazy, optional, recoverable, audited resource/latency burden                                | P2 isolated performance checks           |
| AI assistant       | No mandatory inference for search, product reading or quote form                            | AI-disabled journey test and cost trace  |
| Caching            | Marketing content cache separate from business/customer state freshness policy              | Correctness + stale view tests           |
| Route transitions  | No blank screen, invisible action or lost form content                                      | Browser flows under constrained network  |

**Do not invent fixed transfer/CPU budgets in this draft.** Head Engineering must establish realistic per-template critical-path JS, CSS, media, font and interaction budgets against an actual representative baseline; CX-08 converts them to enforceable release gates. Image lazy loading must **not** defer likely LCP images just to minimize image requests. Source: https://web.dev/articles/lazy-loading-best-practices and https://web.dev/articles/optimize-lcp/ .

### 13.3 Proposed performance regression contract

- Every newly introduced P1/P2 component is measured on P0 home/Custom/Business/confirmation routes before promotion.
- Any new global dependency must justify impact on first-load, CPU, memory, bundle and running cost.
- Design trade-off must be explicit if rich visuals worsen customer task completion or CWV.
- Baseline target and sample method are recorded **before** claiming pass; avoid lab result cherry-picking.
- Full-screen images and high-resolution proofs cannot be loaded by default on unrelated pages.
- Degraded/human-assisted route remains available when heavy features fail.

## 14. Trust, language, privacy and interface security

### 14.1 Copy patterns — illustrative, not approved final brand copy

| Risky/ambiguous                                    | Preferred meaning (illustrative Indonesian)                      | Why                                       |
| -------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------- |
| "Order berhasil" after lead form                   | "Permintaan diterima. Tim akan meninjau detailnya."              | Distinguishes request from contract/order |
| "Harga final Rp…" from unreviewed estimate         | "Estimasi harga—akan dikonfirmasi setelah spesifikasi ditinjau." | Avoids unapproved monetary authority      |
| "Sampai pada 20 November" from requested date      | "Tanggal dibutuhkan: 20 November (belum dikonfirmasi)."          | Desired deadline is not promise           |
| "Pembayaran sukses" after provider redirect        | "Pembayaran sedang diverifikasi." when source pending            | Redirect isn't settlement proof           |
| "Bukti desain disetujui" after preview             | "Pratinjau visual; menunggu peninjauan/approval yang sah."       | Prevents false proof state                |
| "Belum ada pesanan" when API failed                | "Status pesanan belum dapat ditampilkan. Coba lagi."             | Failure ≠ empty                           |
| "Refund pasti dikirim" after claim                 | "Permintaan penanganan diterima dan akan ditinjau."              | Request ≠ refund approval                 |
| "AI sudah mengubah order" without command evidence | "Saya bisa membantu menyiapkan permintaan perubahan."            | AI suggestion ≠ executed action           |

Final wording must be reconciled with TeeStock Voice & Copy System and legal/commercial policy. Copy is a design requirement for comprehension and trustworthy state, not authority to issue guarantees.

### 14.2 Privacy and protected journeys

- Error/empty UI must not leak whether a private quote/order/customer ID exists to unauthorized guest or organization context.
- Form error analytics must exclude artwork content, PII, payment details and private commercial document bodies unless explicitly authorized by policy.
- Session switching and stale page navigation require revalidation; UX client state must never confer permission.
- Upload previews, thumbnails, downloadable assets and deep links are subject to independent authorization/storage controls.
- Cookie/consent patterns must reflect actual legal requirements and approved providers, not a decorative "accept" banner.
- Do not embed unapproved tracking scripts just to measure marketing success.

### 14.3 Unsupported/unverified features must be honest

A feature may be hidden, marked as an upcoming capability or routed to a real assisted service. The correct treatment depends on business truth. A planned custom designer or real-time inventory widget must not be rendered with fake data simply to demonstrate a "premium" product. Demos can be labeled clearly **DEMO / NONTRANSACTIONAL** in a controlled design/research environment.

## 15. Design deliverables and definition of ready

A **product specification alone is not a pixel-perfect asset pack**. After Owner adoption and without assuming implementation, design work should produce the following evidence-rich artifacts. No Figma/other provider is mandated by this document.

| Artifact ID  | Artifact                                 | Minimum contents                                                                                        | Primary reviewer                       |
| ------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `CX3-DEL-01` | Visual direction board                   | Reference brand identity, page mood, example treatments, expressiveness boundaries, explicit exclusions | Brand/Product Owner                    |
| `CX3-DEL-02` | Token decision inventory                 | Color/type/spacing/motion/layout semantic tokens, source and contrast checks                            | Product Designer + Frontend Architect  |
| `CX3-DEL-03` | Component inventory                      | Anatomy, size variants, disabled/loading/error/success/uncertain states, keyboard/touch semantics       | UX + Frontend + A11y reviewer          |
| `CX3-DEL-04` | Responsive wireflows                     | P0 home, Custom, Business, confirmation, failure; P1 conditional later                                  | UX + business operator                 |
| `CX3-DEL-05` | Interaction prototypes                   | Menu, progressive form, upload/error/retry, confirmation, keyboard alternatives                         | UX Researcher                          |
| `CX3-DEL-06` | Content/terminology reference            | Approved customer-visible vocabulary for requested/estimate/approved/pending/unknown                    | Brand Copy + domain owners             |
| `CX3-DEL-07` | Journey-to-component matrix              | Links active screens to `JRN-*`, `CX3-SP-*`, CX-01 FR, acceptance case                                  | Product owner                          |
| `CX3-DEL-08` | Accessibility audit artifacts            | Focus routes, semantic roles, checks for 2.2 AA and manual/AT results                                   | Independent accessibility reviewer     |
| `CX3-DEL-09` | Performance feasibility note             | Asset expectations, likely LCP, loading plans, route-level budget candidates                            | Head Engineering / frontend specialist |
| `CX3-DEL-10` | Usability study pack                     | Tasks, participant criteria, observations, issues, changes and retests                                  | UX Researcher                          |
| `CX3-DEL-11` | High-fidelity P0 specimens               | Mobile + desktop for critical route states, including negative cases                                    | Designer + Owner                       |
| `CX3-DEL-12` | Final UX-to-engineering handoff register | Accepted, unresolved, deferred, blocked requirement and linked tests, versioned assets                  | Head Engineering                       |

**Required distinction:** Draft CX-03 is a _specification for the future design system_. It does not claim `CX3-DEL-01..12` currently exist. Before development of a customer-facing slice, the corresponding specimens must be prepared/reviewed or intentionally waived with risk justification.

### 15.1 High-fidelity screen coverage, proposed initial set

For **P0 entry + assisted Custom/Business**, at minimum design specimens should include: home default; home mobile menu open; inactive/unavailable offer; Custom form simple; Custom progressive advanced; Custom field-error; artwork received-but-not-approved; Business intake; submit in-progress; request accepted; submit outcome unknown; temporary outage; keyboard focus; mobile keyboard open; reduced-motion fallback; and user-facing support/handoff. Each screen specimen is linked to a journey and product acceptance scenario.

For **P1+**, add catalog/PDP variants, cart before/after price change, payment pending/verified, permitted account, guest authorization failure, quote outdated, support case and reorder; do not use incomplete P1 screenshots to assert P0 launch readiness.

### 15.2 Design decision record structure

Every material proposed design choice (navigation structure, modal vs inline form, mandatory signup, color theme, auto-open assistant, animation, builder placement) should record: `decision_id`, `question`, `options`, `chosen_direction`, `canonical_brand/IA_reference`, `user_research_evidence`, `accessibility_impact`, `performance_impact`, `engineering_dependency`, `business_risk`, `owner/approver`, `status`, `supersession_reference`. Nothing in this Draft grants authority to bypass a domain owner.

## 16. Proposed design acceptance scenarios — `CX3-AC-001..030`

All cases are **PROPOSED / NOT_EXECUTED**. A PASS requires test environment, exact source revision, fixture, steps, actual result and limitations. UX acceptance never implies canonical business-transaction/security acceptance; those require independent separate gates.

### 16.1 P0 foundational comprehension and navigation

| ID           | Given / When / Then                                                                                                                                                                                                                           | Evidence category                         | Primary trace           |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ----------------------- |
| `CX3-AC-001` | Given first visitor, when page renders without animation/images, then retail brand identity, curated apparel discovery, and prominent pathways to Custom and Business remain understandable and actionable                                    | Usability + disabled-assets visual review | `SP-01`, `FR-001..004`  |
| `CX3-AC-002` | Given mobile viewport, when opening/closing global navigation with touch/keyboard, then focus/order and active routes (Shop collections, Custom, Business) remain fully usable and accessible                                                 | Browser keyboard/mobile                   | `IC-02`, `FR-005`       |
| `CX3-AC-003` | Given nontransactional Shop discovery in CX-S0, when viewing collections, product previews, or navigation, then no functioning cart, checkout, or instant buy capability is falsely implied, and browsing remains transparently informational | Content state + route test                | `SP-01/02`, `FR-002`    |
| `CX3-AC-004` | Given deep-linked Custom/Business visitor, when landing, then purpose/next action are discoverable without returning home                                                                                                                     | Usability, desktop/mobile                 | `SP-04/05`, `JRN-02/03` |
| `CX3-AC-005` | Given compact mobile screen and expanded text, when rendering P0, then no critical content/action/field is clipped or hidden                                                                                                                  | Viewport + zoom + keyboard                | `NFR-001/005`, `DP-09`  |
| `CX3-AC-006` | Given restricted motion preference, when navigating/form submitting, then information, feedback and progress remain intelligible                                                                                                              | Reduced-motion test                       | `DP-08/10`              |
| `CX3-AC-007` | Given keyboard-only navigation, when reaching all P0 actions, then focus visible, logical, not obscured and not trapped                                                                                                                       | Manual keyboard audit                     | `NFR-005`, `IX-10`      |
| `CX3-AC-008` | Given nonexpert customer, when reading P0 Custom offer, then unknown technical options have plain-language explanation/assisted alternative                                                                                                   | Comprehension study                       | `DP-03`, `FR-010`       |

### 16.2 P0 form, asset handling and truthful confirmation

| ID           | Given / When / Then                                                                                                                                               | Evidence category               | Primary trace         |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | --------------------- |
| `CX3-AC-009` | Given invalid required fields, when submit attempted, then errors associated with fields, meaningful summary and preserved valid input appear                     | UI + accessibility scenario     | `IX-06`, `IC-04`      |
| `CX3-AC-010` | Given irrelevant Business-only details, when personal Custom selected, then hidden fields do not obstruct or silently alter request                               | Conditional flow inspection     | `IC-05`, `FR-010/014` |
| `CX3-AC-011` | Given selected file, when upload only receives server acknowledgement, then customer sees received-not-reviewed, not approved                                     | File UI + source boundary       | `SP-07`, `FR-011`     |
| `CX3-AC-012` | Given unsupported/oversize file, when uploading, then clear secure recovery/help path available and safe entries not erased                                       | Negative upload case            | `IC-06`, `FR-011`     |
| `CX3-AC-013` | Given requested deadline, when reviewing, then UI labels it as requested/unconfirmed unless actual promise authority exists                                       | Copy and business-source review | `IC-07`, `FR-012`     |
| `CX3-AC-014` | Given valid form, when authoritative receipt is accepted, then stable receipt and next human/system step shown; no order guarantee                                | UI + source-of-truth check      | `SP-06`, `FR-013`     |
| `CX3-AC-015` | Given submit timeout with unknown effect, when customer retries/checks, then uncertain state visible and no duplicate authoritative request is created            | Fault injection + backend E2E   | `IX-03/05`, `FR-013`  |
| `CX3-AC-016` | Given mid-form navigation/reload, when safe resume is supported, then approved draft semantics observed; current quote/state revalidated                          | Browser + privacy review        | `NFR-011`, `IX-09`    |
| `CX3-AC-017` | Given reviewer-defined complex business inquiry, when assisted path chosen, then customer understanding and captured context preserved without fake instant quote | UX + operator walkthrough       | `SP-05`, `JRN-03`     |

### 16.3 P1 gated customer commerce / account experience

| ID           | Given / When / Then                                                                                                                                     | Evidence category                 | Primary trace          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------------- |
| `CX3-AC-018` | Given product with variants, when changing option, then updated attributes are available to keyboard/screen reader and unsupported stock isn't asserted | Accessibility + domain state test | `SP-03`, `IC-12`       |
| `CX3-AC-019` | Given filtered catalog, when no product matches, then clear no-results state distinguished from failed search retrieval                                 | Search/negative state test        | `IC-11`, `STATE-08/09` |
| `CX3-AC-020` | Given cart price/stock changes before final commitment, when checkout resumes, then updated terms explicitly re-confirmed                               | UI + transactional test           | `SP-08`, `IC-13`       |
| `CX3-AC-021` | Given provider redirect without verified payment event, when status is viewed, then pending/unknown shown instead of paid                               | UI + financial E2E                | `IC-14`, `SP-08`       |
| `CX3-AC-022` | Given unauthorized guest/org, when opening private status or quote, then no private information/existence leak                                          | Independent security E2E          | `IC-15/18`, `STATE-10` |
| `CX3-AC-023` | Given superseded proof, when old version approval attempted, then stale UX explains re-review and server blocks old approval                            | Proof version + authority test    | `IC-17`, `STATE-11`    |
| `CX3-AC-024` | Given return request receipt, when success UI renders, then customer is not told refund was approved unless actually governed                           | Support/copy/source review        | `SP-11`, `BR-012`      |
| `CX3-AC-025` | Given tracking backend unavailable, when status page loads, then no "no orders"/"delivered" false state appears                                         | Fault injection + UI audit        | `SP-09`, `STATE-08/09` |

### 16.4 P2 advanced and cross-feature nonregression

| ID           | Given / When / Then                                                                                                                                   | Evidence category                | Primary trace        |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------- |
| `CX3-AC-026` | Given AI unavailable, when customer performs ordinary P0/P1 action, then task still usable and no invented AI result appears                          | Fault injection / no-AI scenario | `SP-12`, `DP-10`     |
| `CX3-AC-027` | Given advanced designer, when customer cannot drag, then equivalent controls allow supported configuration, or approved assisted path works           | Keyboard/touch alternate UX      | `SP-12`, WCAG 2.5.7  |
| `CX3-AC-028` | Given new large optional media/builder/AI dependency, when P0 route loads, then it remains outside critical path and meets approved lab/CWV gates     | Bundle + performance regression  | `NFR-002..004`       |
| `CX3-AC-029` | Given marketplace deep link/action, when customer leaves platform, then context/ownership limitations accurately explained                            | Integration UX + policy review   | `IX-16`, `JRN-07`    |
| `CX3-AC-030` | Given UI confirmation/animation or notification, when true domain state is pending/failed, then no transaction/production/shipping success is implied | Adversarial copy/state review    | `DP-05`, `SR-03..06` |

**Case ID lineage:** all `FR-*` and `BR-*` mentions in these tables are shorthand for CX-01 `CX1-FR-*` / `CX1-BR-*`; `SR-*` refers to CX-02 `CX2-SR-*`, and `SP/IC/DP/STATE/IX` refer to CX-03. Preserve these namespaces in future test metadata; do not merge identifiers with actual MGBOS domain test IDs.

## 17. Research, validation and usability hypotheses

### 17.1 Test before pretending a choice is objective

| Hypothesis ID | Proposed hypothesis                                                            | Example user-task evidence                                          |
| ------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `CX3-HYP-01`  | Intent routing is clearer than business division labels                        | Time/confusion/errors when selecting Shop/Custom/Business           |
| `CX3-HYP-02`  | Progressive Custom intake reduces abandonment and irrelevant answers           | Completion, correction, remaining founder clarification per request |
| `CX3-HYP-03`  | Plain terms for estimate/approval reduce mistaken customer expectations        | Comprehension test before confirmation                              |
| `CX3-HYP-04`  | A non-synthetic handoff reduces founder re-keying                              | Count/time admin touches after one validated request                |
| `CX3-HYP-05`  | Restrained motion improves speed without making site feel low quality          | Qualitative preference + load/interaction measurements              |
| `CX3-HYP-06`  | No mandatory AI chat reduces customer blockage                                 | Success with chat disabled vs enabled                               |
| `CX3-HYP-07`  | Trustworthy uncertainty states are preferable to optimistic ambiguous progress | User understanding of unknown/pending/error state                   |
| `CX3-HYP-08`  | Mobile task-first design improves Custom inquiry accessibility                 | End-to-end mobile completion with keyboard/AT cohorts               |

### 17.2 Recommended moderated tasks (proposed fixtures)

1. Starting on the homepage, find how to order 100 custom t-shirts with an unconfirmed delivery date, without a known printing technique.
2. Decide whether an unseen item is currently purchasable versus available only for inquiry.
3. Submit a Custom request with "desain belum siap" and explain what will happen next.
4. Recover from an upload that fails or from a simulated submission timeout.
5. Explain what "file received" means versus "proof approved" from the UI alone.
6. Navigate from mobile homepage to a Business inquiry with keyboard/assistive technology.
7. With AI and animations disabled, complete the same legitimate assisted inquiry.
8. On an eligible future retail flow, identify current availability, payment pending and support routes.

**Research must record:** participants/context, device/browser, task script, data set, intended path, actual path, errors/help, observed outcome, task time, qualitative trust/confusion, accessibility needs, and moderator intervention. Do not invent sample sizes, benchmark wins or conversion uplift. CX-08 determines evidence thresholds.

### 17.3 Quantitative metrics and anti-metrics

Candidate metrics: first-valid-path rate; qualified inquiry task completion; needless field count; errors per form step; customer clarification contacts; abandon/restart; response-time comprehension; mobile keyboard completion; missing-file recovery; manual founder data re-entry; customer promise misunderstanding; route CWV; accessibility-blocking failures. Avoid optimizing superficial click-through, visual engagement or chat turns when user task and founder workload do not improve.

## 18. Open decisions, risk and dependencies

### 18.1 Owner/product decisions — `CX3-DEC-01..10`

| ID           | Decision                     | Proposed default                                                                      | Resolution owner/status                              |
| ------------ | ---------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `CX3-DEC-01` | Visual expression            | Apply TeeStock **Neutral Core + Expressive Product Layer**; do not create a new brand | Brand owner / PROPOSED_APPLICATION                   |
| `CX3-DEC-02` | P0 release appearance        | Premium, functional entry/inquiry pages; no fake checkout                             | Owner after CX-01 approval                           |
| `CX3-DEC-03` | Custom form structure        | Progressive only where justified; compare simple single-page vs guided multi-step     | UX research / UNVERIFIED                             |
| `CX3-DEC-04` | Theme support                | Do not force dark-mode; derive from brand guidance and readability testing            | Brand/product/UX / OPEN                              |
| `CX3-DEC-05` | Typography and exact palette | Respect existing approved brand assets; no new token values presumed                  | Brand owner / OPEN-ASSET-INVENTORY                   |
| `CX3-DEC-06` | Motion intensity             | Restrained, functional, reduced-motion compliant                                      | Product owner / PROPOSED                             |
| `CX3-DEC-07` | Assisted account policy      | Inquiry route without premature mandatory registration, subject to security/privacy   | Owner/security / OPEN                                |
| `CX3-DEC-08` | Accessibility quality        | Aim for WCAG 2.2 AA with full-journey manual verification                             | Product, accessibility, legal/engineering / PROPOSED |
| `CX3-DEC-09` | Mobile touch policy          | Prefer generous ~44px frequent controls; comply with AA as minimum                    | UX/accessibility / PROPOSED                          |
| `CX3-DEC-10` | Global optional tools        | No mandatory chat/video/builder code on P0 critical route                             | Product/Head Engineering / PROPOSED                  |

### 18.2 Material risks — `CX3-RISK-01..10`

| ID            | Risk                                             | Impact                                    | Product mitigation                                      |
| ------------- | ------------------------------------------------ | ----------------------------------------- | ------------------------------------------------------- |
| `CX3-RISK-01` | Brand identity overwritten by random UI kit      | Unrecognizable TeeStock                   | Brand token-source reconciliation, high-fidelity review |
| `CX3-RISK-02` | Premium translated as heavy animations           | Poor mobile CWV, maintenance overhead     | Route performance budgets, optional heavy media         |
| `CX3-RISK-03` | UI implements business states                    | False order/payment/proof/shipping claims | Customer projections only; backend truth checks         |
| `CX3-RISK-04` | Form complexity merely moves labor to customers  | Low conversion and bad service            | Progressive relevance, comprehension tasks              |
| `CX3-RISK-05` | Founder still rekeys everything                  | Negated automation goal                   | Handoff tests and manual touch metrics                  |
| `CX3-RISK-06` | Hidden/accessibility-only failures missed        | Exclusion and task block                  | Manual AT + keyboard + contrast audit                   |
| `CX3-RISK-07` | Asset/font licensing unknown                     | Legal and operational delay               | Brand approval and asset provenance gate                |
| `CX3-RISK-08` | UI paths conflict with official website IA       | Broken navigation/SEO and doc authority   | Canonical routing and ADR if changes needed             |
| `CX3-RISK-09` | Third-party provider outage displayed as success | Customer harm, dispute                    | Explicit pending/unknown/recovery states                |
| `CX3-RISK-10` | P2 editor/chat leaks into all page bundles       | Slow default route; high inference cost   | Feature isolation and performance nonregression         |

### 18.3 Unresolved facts — `CX3-UNK-01..10`

| ID           | Unknown                                                                       | Evidence required before normative freeze                               |
| ------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `CX3-UNK-01` | Exactly approved logo, photography, product imagery and usable webfont assets | Brand asset/licensing register                                          |
| `CX3-UNK-02` | Expected first target customer device mix and network                         | Real customer research / initial target assumptions explicitly recorded |
| `CX3-UNK-03` | Paid/deployed actual web hosting and current metrics                          | Exact environment and measured baseline; do not infer from shell        |
| `CX3-UNK-04` | Functional public Custom intake backend and file-storage authorization        | Engineering discovery and secure tested environment                     |
| `CX3-UNK-05` | Whether guest order status is safely viable at P0                             | Identity/permission decision and privacy threat model                   |
| `CX3-UNK-06` | Valid service level, deadline and quote-review communications                 | Approved commercial/operational policy                                  |
| `CX3-UNK-07` | Which products/methods/artwork inputs are eligible for configurator           | Standardized catalog/price/production rules                             |
| `CX3-UNK-08` | Browser/device/a11y support baseline                                          | CX-08 fixture and QA policy                                             |
| `CX3-UNK-09` | Pilot usability outcomes and founder effort baseline                          | Controlled operator/customer research                                   |
| `CX3-UNK-10` | Whether full storefront/checkout phase should change due to capital/sales     | Owner strategy + current roadmap decision                               |

## 19. Traceability and dependent product documents

### 19.1 Upstream-to-CX03 matrix

| Upstream requirement group            | CX-03 application                         | Future owner for business specifics                    |
| ------------------------------------- | ----------------------------------------- | ------------------------------------------------------ |
| `CX1-FR-001..005` / `JRN-01`          | `SP-01`, `IC-01..03`, `AC-001..008`       | IA/brand owners; CX-08 validation                      |
| `CX1-FR-009..015` / `JRN-02/03`       | `SP-04..06`, `IC-04..10`, `AC-009..017`   | CX-05 Custom/Business                                  |
| `CX1-FR-011/019/034` / `JRN-05`       | `SP-07`, upload/proof distinction         | CX-05 proof/artwork + MGBOS approval                   |
| `CX1-FR-006..008/020..028` / `JRN-04` | `SP-02/03/08`, `IC-11..14`, `AC-018..021` | CX-04 Commerce                                         |
| `CX1-FR-029..037` / `JRN-06`          | `SP-09..11`, `IC-15/16/18`, `AC-022..025` | CX-06 Account & Support                                |
| `CX1-FR-041/045` / `JRN-07`           | `IX-16`, `AC-029`                         | CX-07 Omnichannel                                      |
| `CX1-FR-040/043/046` / `JRN-08`       | `SP-12`, `IC-19/20`, `AC-026..028`        | CX-06/08 + JARVIS governance                           |
| `CX1-NFR-001..015`                    | Sections 10–14, `AC-005..008/028`         | CX-08 Quality & Acceptance                             |
| `CX2-SR-01..20`                       | All truthful/failure patterns             | CX-02 service blueprint and authoritative domain owner |

### 19.2 Downstream discipline boundaries

- **CX-04**: catalog, variants, pricing transparency, search/filter, cart, checkout, payment confirmation and stock-aware experience. Do not redefine canonical commerce business rules here.
- **CX-05**: real Custom/Business intake questions, required fields, artwork review, structured configuration, quote and proof approval rules; implementability depends on domain standardization.
- **CX-06**: identity/protected account, customer history, status/support, returns/reorder and communication preferences under security policy.
- **CX-07**: cross-channel consistency, adapters/providers, integrations, data freshness, customer consequences and provider limitations.
- **CX-08**: explicit quality budgets, supported environments, a11y/CWV evidence, acceptance test design, exception policy and test automation suggestions.
- **CX-09**: staged delivery and customer validation, cost/founder impact and release gate order, within existing canonical roadmap.

### 19.3 Required engineering handoff chain

```text
CX-00 Source Gap Audit
  -> CX-01 Master PRD
  -> CX-02 Service Blueprints
  -> CX-03 Experience & Interaction Spec
  -> CX-04..09 Domain/Quality/Delivery Specifications
  -> Owner product scope acceptance and canonical routing
  -> Head Engineering current source + architecture impact review
  -> bounded technical plan / implementation contract / work package
  -> Antigravity Builder under approved scope
  -> independent QA and revision-bound evidence
  -> separate merge/deploy/production authorization
```

No drafting artifact, prototype, screenshot, or "approved design" substitutes for actual business/financial/security testing.

## 20. Internal author QA, status and next action

### 20.1 Self-review (not independent certification)

| Gate        | Self-review criterion                                                         | Proposed status              |
| ----------- | ----------------------------------------------------------------------------- | ---------------------------- |
| `CX3-QA-01` | Owner, status, provenance, upstream references, authority boundary declared   | SELF-REVIEW                  |
| `CX3-QA-02` | Consistent with brand identity and voice (no fabricated palette/visual asset) | SELF-REVIEW                  |
| `CX3-QA-03` | Homepage/Custom/Business P0 distinguish current reality from target design    | SELF-REVIEW                  |
| `CX3-QA-04` | UI statuses visibly distinct from MGBOS business lifecycle                    | SELF-REVIEW                  |
| `CX3-QA-05` | All core states/error/recovery and optional AI fallbacks addressed            | SELF-REVIEW                  |
| `CX3-QA-06` | A11y AA vs AAA target-size distinctions correctly acknowledged                | SELF-REVIEW                  |
| `CX3-QA-07` | CWV goals are proposed p75 field thresholds, not claimed results              | SELF-REVIEW                  |
| `CX3-QA-08` | No direct APIs/schema/SDK/assets/implementation choices made                  | SELF-REVIEW                  |
| `CX3-QA-09` | Downstream route to CX-04..09 and Owner/Engineering authority preserved       | SELF-REVIEW                  |
| `CX3-QA-10` | Internal IDs and cross-document references structurally checked               | PENDING SCRIPT / SELF-REVIEW |

### 20.2 Canonical promotion prerequisites

Before declaring `ACTIVE` or giving implementation directives:

1. Validate physical doc location and canonical source-map routing, including in-flight PR #73 documentation entrypoint changes.
2. Reconcile CX-01/02 decisions and risk status; independent product/UX reviewer checks this document.
3. Review approved TeeStock visual identity assets and final tokens; freeze only when design decision evidence exists.
4. Conduct at least representative P0 customer research and bounded founder operations rehearsal; record unknowns without substituting guesses.
5. Obtain Owner approval to promote the precise revision and scope. That **does not** approve production execution, deployment or changing business/domain policy.
6. After package maturity, require separate Head Engineering acceptance, source-based architecture impact assessment and bounded work package.

### 20.3 Exact next product document

**CX-04 — Commerce & Checkout Experience** is the next planned product document. It should take approved or explicitly draft CX-01 and CX-02/03 inputs, define commercial customer behavior rigorously, and reference TeeStock/MGBOS commerce authority without modifying current operational pilot scope. CX-04 should not treat `P1` features as implemented.

## 21. Source and evidence register

### 21.1 Repository snapshot (read-only, exact main baseline)

- Repository: https://github.com/Rizkybuilds/bisnishub
- Baseline SHA: `2800c474563309bda49d84d712f79b68c9dde36a` (checked in prior/current product planning work, 2026-10-16); source facts revision-scoped.
- `bisnis/teestock/02-brand/brand-identity-system.md` — TeeStock **Neutral Core + Expressive Product Layer**, visual philosophy.
- `bisnis/teestock/02-brand/voice-and-copy-system.md` — approved voice/tone principles.
- `bisnis/teestock/10-product-tech/digital-product-vision.md` — digital product stages, Customer/Custom/Business and performance direction.
- `bisnis/teestock/10-product-tech/website-information-architecture.md` — customer-intent navigation, mobile and accessibility direction.
- `bisnis/teestock/10-product-tech/commerce-platform.md` — catalog/checkout, marketplace normalization and rollout gates.
- `bisnis/teestock/04-services/custom.md` / `business.md` — custom and B2B service gates.
- `systems/mgbos/docs/architecture/domain-map-capability-ownership.md` — MGBOS ownership/separation.
- `systems/mgbos/docs/product/teestock-founder-control-prd.md` — founder-control scope **excludes** full storefront.
- `systems/mgbos/docs/product/teestock-operational-pilot-plan.md` — assisted-sales Custom/Business pilot, not direct checkout validation.
- `systems/mgbos/apps/teestock/src/app/page.tsx`, `custom-atelier/page.tsx`, `globals.css` — shell-level current source.
- `systems/mgbos/packages/ui/src/index.ts`, `ai/src/index.ts`, `integrations/src/index.ts` — reserved package boundaries at inspected baseline.
- Local companion working drafts (not GitHub authority): `cx-00-source-gap-audit.md`, `cx-01-master-prd.md`, `cx-02-customer-journeys-service-blueprint.md`.

### 21.2 External normative/reference material (accessed 2026-10-16)

- W3C, **Web Content Accessibility Guidelines (WCAG) 2.2** — https://www.w3.org/TR/WCAG22/ (normative accessibility criteria; Level AA vs AAA distinguished).
- W3C WAI, **What's New in WCAG 2.2** — https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ (2.4.11, 2.5.7, 2.5.8, 3.3.7, 3.3.8 context).
- Google web.dev, **Web Vitals** — https://web.dev/articles/vitals (LCP, INP, CLS proposed quality targets; field p75).
- Google web.dev, **How thresholds were defined** — https://web.dev/articles/defining-core-web-vitals-thresholds (methodological reference).
- Google web.dev, **Lazy-loading best practices** — https://web.dev/articles/lazy-loading-best-practices (do not lazily defer LCP image; verify actual measurements).
- Google web.dev, **Optimize LCP** — https://web.dev/articles/optimize-lcp (critical visual resource discoverability and priority).

**Final disposition:** CX-03 v0.1.1 is a **proposed, self-reviewed product specification**, not canonical project state. No code, PR, implementation, external provider action or production data was modified. Product planning can proceed to CX-04 without confusing proposed UX with verified engineering readiness.

## Remediation R1 — explicit master requirement trace (generated draft, non-authoritative)

The rows below are generated from `CX-PKG-TRACE-R1.csv` (the sole package-wide mapping table). They link master requirements (`CX1-FR-*`) to the interaction specifications, responsive/a11y behaviors, and error handling criteria defined natively in this document (`CX3-AC-*`). They do not introduce additional product requirements, approve a release stage, change any domain/architecture policy, or prove acceptance.

| CX-01 master ID | Exact declared detail IDs in this document             | Selected existing acceptance             | Candidate slice |
| :-------------- | :----------------------------------------------------- | :--------------------------------------- | :-------------- |
| `CX1-FR-001`    | `CX3-AC-001`                                           | `CX8-AC-001`                             | `CX-S0`         |
| `CX1-FR-002`    | `CX3-AC-003`                                           | `CX9-AC-006`                             | `CX-S0`         |
| `CX1-FR-003`    | `CX3-AC-001`, `CX3-AC-008`                             | `CX5-AC-001`, `CX8-AC-001`               | `CX-S0`         |
| `CX1-FR-004`    | `CX3-AC-008`                                           | `CX9-AC-005`                             | `CX-S0`         |
| `CX1-FR-005`    | `CX3-AC-002`, `CX3-AC-004`, `CX3-AC-005`, `CX3-AC-007` | `CX8-AC-003`                             | `CX-S0`         |
| `CX1-FR-006`    | `CX3-AC-019`                                           | `CX8-AC-013`                             | `CX-S1`         |
| `CX1-FR-007`    | `CX3-AC-018`                                           | `CX8-AC-014`                             | `CX-S1`         |
| `CX1-FR-009`    | `CX3-AC-009`                                           | `CX8-AC-006`                             | `CX-S0`         |
| `CX1-FR-010`    | `CX3-AC-010`                                           | `CX5-AC-005`, `CX8-AC-006`               | `CX-S0`         |
| `CX1-FR-011`    | `CX3-AC-011`, `CX3-AC-012`                             | `CX5-AC-002`, `CX8-AC-028`               | `CX-S0`         |
| `CX1-FR-012`    | `CX3-AC-013`                                           | `CX8-AC-007`                             | `CX-S0`         |
| `CX1-FR-013`    | `CX3-AC-014`, `CX3-AC-015`                             | `CX8-AC-005`                             | `CX-S0`         |
| `CX1-FR-014`    | `CX3-AC-017`                                           | `CX5-AC-007`                             | `CX-S0`         |
| `CX1-FR-017`    | `CX3-AC-022`                                           | `CX8-AC-025`                             | `CX-S2`         |
| `CX1-FR-018`    | `CX3-AC-027`                                           | `CX5-AC-036`                             | `CX-S3`         |
| `CX1-FR-019`    | `CX3-AC-023`                                           | `CX8-AC-029`                             | `CX-S3`         |
| `CX1-FR-021`    | `CX3-AC-020`                                           | `CX8-AC-015`                             | `CX-S1`         |
| `CX1-FR-024`    | `CX3-AC-021`                                           | `CX8-AC-019`                             | `CX-S1`         |
| `CX1-FR-025`    | `CX3-AC-030`                                           | `CX4-AC-028`                             | `CX-S1`         |
| `CX1-FR-026`    | `CX3-AC-020`                                           | `CX8-AC-016`                             | `CX-S1`         |
| `CX1-FR-029`    | `CX3-AC-014`                                           | `CX8-AC-005`                             | `CX-S0`         |
| `CX1-FR-030`    | `CX3-AC-022`                                           | `CX6-AC-001`, `CX6-AC-003`, `CX8-AC-030` | `CX-S0`         |
| `CX1-FR-031`    | `CX3-AC-025`                                           | `CX6-AC-007`                             | `CX-S2`         |
| `CX1-FR-033`    | `CX3-AC-024`                                           | `CX8-AC-032`                             | `CX-S2`         |
| `CX1-FR-034`    | `CX3-AC-023`                                           | `CX5-AC-027`                             | `CX-S2`         |
| `CX1-FR-040`    | `CX3-AC-026`                                           | `CX8-AC-012`                             | `CX-S0`         |
| `CX1-FR-041`    | `CX3-AC-029`                                           | `CX7-AC-010`                             | `CX-S2`         |
| `CX1-FR-042`    | `CX3-AC-030`                                           | `CX7-AC-029`                             | `CX-S2`         |
| `CX1-FR-043`    | `CX3-AC-026`                                           | `CX6-AC-043`                             | `CX-S3`         |
| `CX1-FR-046`    | `CX3-AC-026`                                           | `CX5-AC-036`, `CX6-AC-043`               | `CX-S3`         |
