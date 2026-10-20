---
canonical_id: proposed.mgbos.product.teestock-customer-platform.cx-08
status: ACTIVE
version: 0.1.1
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: Rizky
scope: teestock-customer-platform-experience-quality-and-product-acceptance
product_program: PROPOSED_TEESTOCK_CUSTOMER_EXPERIENCE_COMMERCE
product_maturity: PROPOSED_EXPERIENCE_QUALITY_CONTRACT
document_class: product-specification
normative_authority: CANONICAL_PRODUCT_SPECIFICATION
engineering_readiness: NOT_READY_FOR_ENGINEERING
implementation_status: PRODUCT_DEFINITION_ONLY
repository: Rizkybuilds/bisnishub
repository_branch: main
source_baseline_commit: 2800c474563309bda49d84d712f79b68c9dde36a
source_baseline_checked: 2026-10-16
source_inspection: SELECTED_CANONICAL_DOCS_PUBLIC_APP_AND_COMPANION_DRAFTS_NOT_EXECUTABLE_QA
draft_created: 2026-10-16
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md
supersedes: null
remediation_package: CX-REM-R1
remediation_review: AUTHOR_SELF_REVIEW_NOT_INDEPENDENT
companion_drafts:
  - cx-00-source-gap-audit.md
  - cx-01-master-prd.md
  - cx-02-customer-journeys-service-blueprint.md
  - cx-03-experience-design-interaction-spec.md
  - cx-04-commerce-checkout-experience.md
  - cx-05-custom-b2b-ordering-experience.md
  - cx-06-customer-account-service-experience.md
  - cx-07-omnichannel-external-integration-requirements.md
depends_on:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/governance/cross-system-risk-classification.md
  - docs/governance/evidence-provenance-model.md
  - docs/engineering/engineering-ai-control-plane.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - systems/mgbos/docs/engineering/maintenance-policy.md
  - systems/mgbos/docs/architecture/business-invariants.md
  - systems/mgbos/docs/architecture/permission-authorization-model.md
  - systems/mgbos/docs/architecture/command-event-model.md
  - bisnis/teestock/02-brand/brand-identity-system.md
  - bisnis/teestock/10-product-tech/website-information-architecture.md
  - bisnis/teestock/12-legal-ip/customer-commerce-policy.md
implementation_authorization: NONE
merge_authorization: NONE
deployment_authorization: NONE
production_access_authorization: NONE

effective_from: 2026-10-20---

# CX-08 — TeeStock Experience Quality & Acceptance Contract v0.1.1

> **Document disposition:** `DRAFT / SELF-REVIEWED / NON-CANONICAL`. This specification defines **proposed measurable product outcomes and acceptance evidence** for TeeStock's eventual public customer experience. It does **not** certify that the website, checkout, customer portal, provider integrations, QA environment, or production operation is ready. Final owners and risk classification follow existing BisnisHub governance. No raw PRD is implementation authority.

## 1. Executive product thesis

The desired TeeStock digital experience is **premium, effortless, capability-rich, trustworthy, accessible and fast on ordinary mobile devices**. Advanced commerce, custom-product tooling and AI must **expand what the user can accomplish without degrading basic navigation, assisted inquiry, payment correctness, information privacy or founder operability**.

An experience cannot be considered high quality if it is visually attractive but:

- loses form entries when the customer receives a call;
- shows a beautiful paid-status animation before the payment is actually verified;
- leaks Company B's invoice through Company A's portal;
- requires an expensive AI call to load the home page;
- hides the necessary action behind a mobile drawer or keyboard;
- claims inventory, a dispatch or a delivery date that the business cannot support;
- passes unit tests but fails on a real mid-range mobile browser;
- fails safely only because the founder manually reconstructs data without a trace.

**Outcome standard:** every released capability should deliver a comprehensible, recoverable, honest customer task, while leaving **one governed next step** in the business system. Product quality is not interchangeable with repository CI status, security gate, operational readiness or a marketing launch decision.

## 2. Scope, authority and baseline

### 2.1 IN — this product quality specification owns

- Customer-perceived speed, interaction responsiveness and visual stability **quality targets** and measurement obligations.
- Accessibility target, manual browser/assistive-technology verification, and interaction-state completeness.
- Usability, task-completion and recovery acceptance definitions for the CX-01..07 scoped customer journeys.
- Product-level truthfulness, error messaging, privacy minimization and role-aware customer presentation.
- Evidence classification, proposed test matrices, product readiness criteria and release-blocking **outcomes**.
- Regression and feature-expansion safeguards protecting P0/P1 customer journeys and solo-founder workload.
- Product-acceptance requirements for synthetic, isolated, and permitted real pilot evidence, clearly distinguished.

### 2.2 OUT — not a source of technical or legal authority

This document MUST NOT define/override: R0–R5 semantics; organization and command authorization; ledger/payment/invoice state machines; database migrations, production-data access; deployment permissions; actual final consumer rights; specific payment/marketplace/carrier provider contracts; CI branch protection; JavaScript framework/tool choice; secret management implementation; compliance certification; production service-level agreement; financial limits or spending approvals.

Canonical owners include:

| Concern                                                   | Source of authority                                                                    | CX-08 ownership                                                                        |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Business offer/brand/copy                                 | `bisnis/teestock/` brand, commerce, service, legal-policy documents                    | Customer comprehension and honest presentation tests                                   |
| Order, invoice, financial, inventory and production truth | `systems/mgbos/docs/architecture/` + actual approved commands/source                   | User-visible outcome and negative acceptance                                           |
| Risk and evidence meaning                                 | Root `docs/governance/` and Engineering Control Plane                                  | Explicit evidence needs; **no new risk scale**                                         |
| Software implementation QA                                | `systems/mgbos/docs/engineering/maintenance-policy.md` + current implementation policy | Additional customer-level outcomes where applicable                                    |
| JARVIS / n8n / external provider                          | Their scoped owners and contracts                                                      | Accessible fallback, safe interaction, honest state and handoff                        |
| Legal and data protection policy                          | Business/legal owners and applicable law                                               | No dark patterns, consent affordances, sensitive-data leaks; escalate policy questions |
| Customer-experience product definition                    | CX-01..CX-07 once approved and routed                                                  | Quality thresholds and evidence mapping                                                |

### 2.3 Revision and current reality

Source inspection used `main` at `2800c474563309bda49d84d712f79b68c9dde36a`, 2026-10-16. The inspected TeeStock public `page.tsx` is a shell saying the new application is being prepared. No active storefront, checkout, field Core Web Vitals data, accessibility certification, or operational acceptance is proven by this package. Existing MGBOS command boundary is more mature, while the MGBOS command/event architecture explicitly records full events/outbox as not yet implemented for a verified production slice. The existing Custom/Business pilot is **assisted-sales-first**, and its launch gates are separately governed.

**Important:** PR #73 was OPEN/DRAFT when this program was inspected. Proposed document location and index links must be reconciled with its final state before any repository adoption. Never copy this draft into multiple competing canonical locations.

## 3. Vocabulary and evidence lifecycle

| Term                     | Meaning                                                                                | Prohibited inference                                                  |
| ------------------------ | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `SPECIFIED`              | Requirement or expected outcome written                                                | Does not mean built or tested                                         |
| `IMPLEMENTED`            | Exact source contains candidate functionality                                          | Does not mean correct                                                 |
| `SELF_REVIEWED`          | Author checked own specification or code                                               | Does not prove independent assurance                                  |
| `LOCAL_VERIFIED`         | Repeatable tests on identified local/disposable target and exact revision              | Does not prove hosted CI or production                                |
| `HOSTED_CI_VERIFIED`     | Required hosted checks passed on exact candidate and real enforcement is checked       | Does not prove business pilot or accessibility conformance            |
| `LAB_MEASURED`           | Controlled browser/profile tests have recorded repeatable results                      | Not real-user Core Web Vitals field p75                               |
| `FIELD_MEASURED`         | Real-user instrumentation has valid, privacy-reviewed sample and cohort                | Not automatically representative without counts and collection period |
| `ACCESSIBILITY_REVIEWED` | Manual keyboard/AT, page-level and flow-level scope recorded                           | Not necessarily full-site WCAG conformity                             |
| `SANDBOX_VERIFIED`       | Approved provider sandbox test for that provider/contract                              | Not permission to charge/notify real customers                        |
| `DEPLOYED`               | Identified release deployed to named environment with deployment evidence              | Not operationally accepted                                            |
| `OPERATIONALLY_ACCEPTED` | Business owners verify actual supported flow, runbooks, recovery and physical handoffs | Not approval for untested future channels                             |
| `NOT_VERIFIED`           | No sufficient valid evidence                                                           | Must never be displayed as `PASS`                                     |
| `BLOCKED`                | Mandatory gate not met, failed or unresolved                                           | Requires documented remediation and re-audit                          |
| `NOT_APPLICABLE`         | Not part of declared release slice, with justification                                 | Cannot be used to hide applicable high-risk checks                    |

**No single synthetic score is an aggregate release verdict.** A green dashboard can coexist with a blocking cross-tenant disclosure, payment mismatch, inaccessible checkout or unsupported customer promise.

## 4. Quality model and product priorities

### 4.1 Quality dimensions

| ID          | Dimension            | User-facing outcome                                                                 | Key evidence                                          |
| ----------- | -------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `CX8-QD-01` | Clarity              | Can select the appropriate Shop/Custom/Business/Merch path without insider language | Task test + content review                            |
| `CX8-QD-02` | Speed                | Important content appears promptly and interaction remains responsive               | Field/lab CWV + traces                                |
| `CX8-QD-03` | Accessibility        | Essential task can be completed with keyboard/AT and expected viewports             | Manual WCAG mapping + browser flows                   |
| `CX8-QD-04` | Commercial integrity | Prices, commitments, approvals and payments reflect authoritative facts             | Domain/API negative tests + customer screens          |
| `CX8-QD-05` | Privacy/security     | User sees only permitted customer/order/company data                                | Server/API and UI negative tests                      |
| `CX8-QD-06` | Recovery             | Interruptions do not silently lose accepted work or duplicate effects               | Fault injection + retry/reconciliation                |
| `CX8-QD-07` | Operational transfer | Accepted customer request yields governed next work, without re-entry               | End-to-end operating evidence                         |
| `CX8-QD-08` | Sustainability       | Added features do not make core pages heavy or force paid AI per visit              | Bundle, CPU, inference and founder-effort measurement |
| `CX8-QD-09` | Trust & transparency | User distinguishes requested, estimated, approved, paid, dispatched, delivered      | State-mapping review + negative scenarios             |
| `CX8-QD-10` | Observability        | Teams can distinguish success, unknown and failure with privacy-aware correlation   | Structured logs/metrics + incident exercise           |

### 4.2 Release slices are **not** general software versions

| Slice                      | Product definition                                                                                                          | Quality applicability                                                                                           |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `P0_ASSISTED_ENTRY`        | Premium public content, clear routes, truthful Custom/Business inquiry, approved contact/receipt/recovery where implemented | All critical relevant P0 tests; public marketing performance and accessible intake; no full checkout obligation |
| `P1_GOVERNED_SELF_SERVICE` | Catalog, eligible cart/checkout, account, support/order status, select providers where explicitly approved                  | Adds transactional, authorization, PII, integration and task/recovery gates for each new surface                |
| `P2_ADVANCED_CAPABILITY`   | Rich custom builder, AI assistance, personalization, broad marketplace/creator extensions where justified                   | Adds editor/AI/provider-specific assurance and **P0/P1 non-regression**                                         |

P0 is an **experience quality target**, not a requirement to delay the existing approved Custom/Business _operational_ pilot until a storefront ships. The current pilot's mandatory security, payment and operational requirements remain applicable even if customer interactions are human-assisted.

### 4.3 Critical journeys under protection

`CJ-01` find proper offer → entry; `CJ-02` submit Custom inquiry; `CJ-03` submit Business inquiry; `CJ-04` receive a truthful durable reference; `CJ-05` recover from errors or use help; `CJ-06` inspect product/stock/price (P1); `CJ-07` checkout and payment (P1); `CJ-08` authorized account/quote/proof (P1); `CJ-09` tracking/returns/case resolution (P1); `CJ-10` cross-channel handoff (P1/P2); `CJ-11` advanced custom editor (P2); `CJ-12` optional AI assistance (P1/P2).

## 5. Core Web Vitals and performance methodology

### 5.1 Customer experience goals proposed for approval

| Metric                            |                 Target | Basis                                 | What it means                            |
| --------------------------------- | ---------------------: | ------------------------------------- | ---------------------------------------- |
| Largest Contentful Paint (`LCP`)  |      **≤ 2.5 seconds** | Google Core Web Vitals good threshold | Major visible content loaded promptly    |
| Interaction to Next Paint (`INP`) | **≤ 200 milliseconds** | Google Core Web Vitals good threshold | Interactions respond promptly            |
| Cumulative Layout Shift (`CLS`)   |              **≤ 0.1** | Google Core Web Vitals good threshold | Visual elements do not jump unexpectedly |

Measurement interpretation: **75th percentile of relevant real page visits**, separately reported for **mobile and desktop**. Per-template/route-group segmentation is a product diagnostic requirement; low-volume groups may be `NOT_VERIFIED_FIELD`. Report collection period, sample size, URL/template coverage, geography and device/cohort limitations. Site-wide aggregate can conceal a failing checkout or Custom form. Do not substitute averages, desktop-only scores or one best lab result.

**Before launch:** if actual real-user traffic is absent or insufficient, field status is `NOT_VERIFIED_FIELD`. This does **not necessarily block an approved P0 pre-launch release by itself**; it requires explicitly accepted lab evidence, instrumentation and a later field-review plan. Lab p75 is **not** field p75.

Official technical sources consulted during drafting:

- Google, Core Web Vitals threshold methodology: https://web.dev/articles/defining-core-web-vitals-thresholds/
- Google, web vitals measurement and mobile/desktop interpretation: https://web.dev/articles/vitals

### 5.2 Reproducible laboratory contract

Each tested route must record all of the following:

1. Exact source revision, target URL/build/deployment identity, time and cache/CDN configuration.
2. Real browser and version, OS, viewport, DPR, language/locale, screen-reader mode where applicable.
3. Named and saved network/CPU profile, connection throttling, cache cold/warm case, device/emulation vs physical device distinction.
4. Test-script revision, run count, run median and spread, known third-party calls, screenshots and waterfall/traces.
5. Page template, representative asset sizes and user state (guest, authenticated, authorized org, variant, error case).
6. Content availability: legitimate production-like **synthetic** records; never fake empty datasets to achieve green scores.
7. A tested interaction sequence for form field entry, open/close navigation, validation, upload and route transitions; not page load alone.
8. Regression comparison to prior approved baseline, with full trace when a budget is exceeded.

**Proposed lab acceptance:** no reproducible severe slowness or blocking interaction on the signed-off representative mobile profile; LCP/CLS measured and reviewed for every relevant template; input response and upload/progress states function. Hard lab time, CPU, transferred JS/CSS, memory and media budgets must be set by Head Engineering **after a representative reference implementation and profiling**, then Owner-approved in the implementation work package. This draft intentionally does not manufacture thresholds from an app shell.

### 5.3 Route-level performance budget registry (template, not invented numbers)

| Template         | LCP element                  | Main risks                                   | Initial lab budget | Budget owner / activation                      |
| ---------------- | ---------------------------- | -------------------------------------------- | ------------------ | ---------------------------------------------- |
| Home/landing     | Main hero/copy/primary image | image/fonts, campaign video, personalization | `TBD_BASELINE`     | Head Engineering + Frontend QA before P0 slice |
| Custom request   | Form title/main content      | unnecessary editor SDK, upload previews      | `TBD_BASELINE`     | Head Engineering before P0 custom slice        |
| Business request | CTA/form area                | CRM widget/third-party embed                 | `TBD_BASELINE`     | Head Engineering before P0 business slice      |
| Product listing  | First visible product cards  | images/search facets/cross-sell scripts      | `TBD_BASELINE`     | Before P1 catalog                              |
| Product detail   | Hero product media           | hi-res media/variant rerenders               | `TBD_BASELINE`     | Before P1 PDP                                  |
| Cart/checkout    | Order summary/payment start  | dynamic pricing/provider SDK/hydration       | `TBD_BASELINE`     | Before P1 checkout                             |
| Customer portal  | Main dashboard/status        | unnecessary broad data fetch/polling         | `TBD_BASELINE`     | Before P1 account                              |
| Custom editor    | Canvas/preview               | fonts/rendering/image memory                 | `TBD_BASELINE`     | Before P2 editor                               |

**Rule:** never mark `TBD_BASELINE` as passed, yet do not block unrelated P0 public landing for a future P2 editor budget.

### 5.4 Performance invariants

- Basic routes must not require rendering a 3D garment model, interactive print canvas, AI assistant, customer portal code or SDK not used by that route.
- Hero/LCP imagery should be prioritized appropriately; decorative/below-the-fold media may be deferred; no forced heavy autoplay.
- Website works meaningfully when optional recommendation, personalization, analytics, marketing tags or AI are blocked.
- Fonts have readable fallback and stable geometry; brand font compliance does not excuse content invisibility or layout shifts.
- Resizing/translation/error messages and sticky CTAs must not generate uncontrolled layout shifts or hide focused inputs.
- Media formats and sizes adapt to device and viewport; visual quality should remain acceptable under constrained connections.
- Third-party scripts must have inventories, owners, failure isolation, privacy justification and measured performance impact.
- Cache strategies must not serve another user's private quote/cart/order or imply availability is guaranteed after it becomes stale.
- P1/P2 additions must rerun the relevant P0 core critical-path lab tests; adverse differences require remediation or explicit risk-governed decision, **not silent acceptance**.

### 5.5 Image, script and network fault matrix

Simulate: missing hero image; slow image CDN; failed brand font; blocked analytics; disabled AI; stale cache; JS delayed; mobile low-memory tab; offline after form entry; and server slow response. Each must preserve task meaning and avoid fabricated success. **Do not require no-JS payment checkout without its own approved engineering capability contract.**

## 6. Accessibility and inclusive experience contract

### 6.1 Normative target vs verified claim

**Proposed target:** customer-controlled screens/flows conform to **WCAG 2.2 Level AA**, which includes Level A and Level AA success criteria, according to defined applicable content and supported technology. A W3C standard reference is not a certification. The independent assessment must declare pages, states, viewports, embedded third-party components, assistive technologies and any findings. All relevant critical customer tasks should remain achievable without a mouse where supported.

Official W3C references:

- WCAG 2.2 recommendation: https://www.w3.org/TR/WCAG22/
- New criteria in WCAG 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

### 6.2 Test coverage matrix

| Area                   | Test contract                                                                                                                                       | Evidence                        |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Keyboard navigation    | Tab/Shift+Tab logical order, visible focus, no traps; Escape behavior for cancellable overlays                                                      | Manual keyboard recording       |
| Dialog/drawer          | Appropriate semantics; focus moves in, stays managed, returns on close; background does not receive unintended focus                                | Browser + AT tests              |
| Semantic structure     | Headings, landmarks, buttons/links, labels, status roles reflect meaning                                                                            | Accessibility tree inspection   |
| Form instructions      | Required/optional clear, not placeholders alone; per-field errors associated and announced; validation preserves values                             | Keyboard/AT/browser task test   |
| Pointer/touch          | No hover-only action; drag alternative where needed; targets meet applicable WCAG minimum and generous design goal                                  | Mobile + accessible input test  |
| Focus obscured         | Fixed header/sticky CTA/keyboard do not fully obscure focus; mobile input remains accessible                                                        | Viewport/focus test             |
| Resize/reflow/zoom     | Core tasks survive supported narrow viewport, zoom and text spacing without hidden content or horizontal scroll unless legitimate content exception | Browser responsive tests        |
| Contrast and status    | Text/UI contrast meets applicable WCAG; state not conveyed only by color, shape or animation                                                        | Contrast + visual review        |
| Motion                 | `prefers-reduced-motion` honored where relevant; loading/progress understandable without motion                                                     | Reduced-motion test             |
| Time limits            | Session expiry warns where relevant; user receives accessible recovery without unauthorized persistence                                             | Expiry simulation               |
| Authentication         | Accessible login and alternative consistent with applicable WCAG; prevent unnecessary cognitive reauthentication tasks                              | Browser/AT flow                 |
| Dynamic updates        | Async errors/progress/confirmations have screen-reader discoverable status, not only toast disappearance                                            | Live-region and focus test      |
| Media/imagery          | Correct alt text/empty alt, captions where relevant, no essential information exclusively inside promotional imagery                                | Content/AT test                 |
| Language               | Correct document language and understandable wording for chosen Indonesian cohort                                                                   | Content/DOM review              |
| Third-party components | Payment/auth widgets tested in the real intended embed/redirect context; limitations escalated                                                      | Provider scope + full-flow test |

**Important distinction:** target `~44px` frequent touch controls in CX-03 is a product-design preference; it is **not** a quotation of the exact WCAG 2.2 AA target-size criterion. Test WCAG 2.2's applicable Success Criterion **2.5.8 Target Size (Minimum)**, including defined exceptions, rather than incorrectly claiming that 44px is mandatory AA.

### 6.3 Required assistive and device sample

Minimum **proposed** pre-release review includes desktop keyboard-only; screen reader/browser combination on a supported desktop OS; mobile screen reader on a supported mobile OS where relevant; browser zoom/reflow; reduced-motion; and a real or representative mid-range mobile device. Final combinations, versions and coverage must be recorded and approved by QA based on intended Indonesian customer reach, maintenance costs and available devices; do not label an unspecified combination as tested.

### 6.4 Automated tools are screening, not full assurance

Static analyzer, DOM inspection and automated accessibility scans must be paired with manual task testing. A clean scan does **not** prove WCAG conformance. A visually consistent screenshot does **not** prove readable screen-reader behavior.

## 7. Usability, task understanding and content quality

### 7.1 User task acceptance protocol

For each release slice, test its actual user jobs with representative customers or defensible proxy participants and report limitations. The task runner **does not coach toward the correct CTA**. Capture:

- Task statement, user role/familiarity, recruitment method and device.
- Starting point, destination, whether task completed, severity of errors, help requests and time/steps when meaningful.
- Misunderstanding of price, size, quantity, lead time, payment status or what happens next.
- Whether users can recover from mistakes without abandoning or contacting founder.
- Accessibility implications and preference for assisted support.
- Exact revisions/screens tested and notes on prior familiarity with the product.

**Proposed P0 exit:** no observed **critical** comprehension/task blocker remains for declared must-work paths in the reviewed sample; all high-severity failures are triaged and remediated or handled under explicit risk governance. Do not invent a conversion percentage, completion target or median task time from a nonexistent cohort. Define numeric improvement goals after a representative baseline and owner-approved trial protocol.

### 7.2 Mandatory comprehension questions

A customer should accurately answer in their own words:

1. “Apa yang bisa gue pesan sekarang, dan mana yang masih perlu konfirmasi?”
2. “Apakah angka ini harga final atau estimasi?”
3. “Apakah deadline yang gue isi sudah disetujui?”
4. “Setelah kirim request, langkah berikutnya apa?”
5. “Kalau desain ditolak atau perlu revisi, harus ngapain?”
6. “Kalau pembayaran belum tercatat, statusnya apa?”
7. “Siapa yang perlu dihubungi ketika sistem belum bisa menyelesaikan masalah?”

For an assisted-only P0 flow, do not ask testers to perform nonexistent checkout or enter production. Test truthful next steps instead.

### 7.3 UX state completeness

Every interactive page/element in its approved scope must specify and test: default, focus, hover as optional enhancement, disabled (reason visible), loading, empty, validation error, conflict/stale, timeout/unknown outcome, success-with-proof, provider unavailable, and retry/human fallback. States may be `NOT_APPLICABLE` with explanation; never silently omit error/unknown-state testing for money, approval or request submission.

### 7.4 Brand and copy

Use existing `brand-identity-system.md` (`Neutral Core + Expressive Product Layer`) and `voice-and-copy-system.md` (clear, warm, direct, informed) as direction. A premium screen must preserve actual product truth, accessible typography, truthful copy, realistic imagery, and functioning CTA. This document does not choose new brand colors/fonts or replace brand authority.

## 8. Transaction integrity, security and privacy product outcomes

**Primary authorities:** actual MGBOS invariants, command/event and permission models, legal/customer policies and risk standards. CX-08 defines what must be proven in relevant end-user journeys, not how database transactions are designed.

### 8.1 Security verification reference

OWASP **ASVS 5.0.0** is an external reference for security verification planning (https://github.com/OWASP/ASVS/releases/tag/v5.0.0). It does **not** replace BisnisHub's canonical risk model or grant blanket ASVS compliance. Applicable ASVS requirements, verification level/scope, exceptions and test owner must be selected by security leadership for each bounded slice. “Uses OWASP” is not a pass result.

### 8.2 Negative outcome contracts by capability

| Capability        | Mandatory failure test                                                               | Block condition                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Public inquiry    | Duplicate submit, invalid input, lost response, unauthorized upload                  | Two committed requests for one intended submission; fabricated receipt; data loss beyond approved policy |
| Quote acceptance  | Wrong company/actor, stale version, expired quote, altered payload                   | Quote accepted or production released without authorized version-specific decision                       |
| Customer account  | Cross-customer/cross-org direct object ID, revoked membership, deep link and API     | Protected information readable through URL/API even if hidden in UI                                      |
| Artwork           | Malicious/invalid MIME, active content, unauthorized file URL, wrong version         | Private artwork exposed, unsafe rendering, or unreviewed file treated as approved                        |
| Cart/checkout     | Stale stock/price, invalid coupons, double-click, order retry                        | Silent price change, oversell, duplicate economic effect, bypassed guard                                 |
| Payment           | Spoofed/duplicate/out-of-order callback, unknown timeout, refund/settlement mismatch | Paid/refunded shown or recorded without verified authoritative effect                                    |
| Shipment/tracking | Label created vs physical handoff, out-of-order carrier events                       | Customer told shipped/delivered without verified appropriate evidence                                    |
| Returns/support   | Return request vs approved return vs refund, missing owner                           | Refund or claim approval fabricated; case closed without resolution trace                                |
| Marketplace       | Duplicate import, wrong seller scope, stock sync lag, auth expiration                | Wrong-tenant order, duplicate effects, unsupported availability promise                                  |
| Messaging         | Wrong recipient, duplicated high-impact send, opt-out mismatch                       | Data disclosure, marketing sent under transactional basis, false delivery claim                          |
| AI advice/action  | Prompt injection, stale evidence, unauthorized tool call, model unavailable          | Autonomous money/contract authority; invented stock/status; no fallback                                  |
| Analytics         | PII in URL, log, metric labels or third-party event; consent gap                     | Sensitive artwork/customer data exposure or unjustified tracking                                         |

### 8.3 Canonical truth and trust boundaries

1. Browser display is not MGBOS business state. UI form validation does not replace server/domain validation.
2. A payment provider redirect, marketplace webhook, e-mail “sent” response or logistics label is not automatically final business truth.
3. A customer approval must refer to an exact accessible, current and authorized quote/artwork version; do not cross-approve other versions or substitute for payment.
4. Guest order lookup must be strongly scoped, expiring and rate-limited as approved; a guessable order number alone is not authority.
5. B2B organization role, user authentication, business authorization and approval are distinct checks.
6. External content, artwork, provider webhooks and AI instructions are untrusted data until validated by their owning boundary.
7. Business logic for credit, refund, price floors, inventory reservation and production readiness remains deterministic and governed; no provider/AI shortcut.
8. Logs, dashboards, public URLs, metadata and browser storage must not leak raw credentials, card data, private quotes, cross-tenant identifiers or artwork.
9. Destructive privacy requests follow actual legal and retention authority; delete/anonymize only through approved procedure, not arbitrary customer toggles.
10. At least one accessible, safe path to human support exists when autonomous help is unsuitable. Provider outages should not erase the ability to submit the allowed P0 assisted task.

### 8.4 Isolation of test environments and data

Security/transaction integration tests use a **proven new disposable database** or an expressly approved isolated test environment and **synthetic data**. A Git worktree, `.env` filename or `localhost` label is not proof that the target DB is disposable. Establish actual host/project, identity, schema and expected absence of real data **before** destructive tests. If cannot prove safety, DO NOT RUN and mark `NOT_VERIFIED`. Tests do not send actual messages, charge real cards, or touch live vendor inventory without owner-authorized staging/sandbox policy. No production access is authorized by this document.

## 9. Reliability, graceful degradation and recovery

### 9.1 Product-level failure classes

| Class                          | Example                                                  | Customer experience                                                   | Behind-the-scenes expectation                         |
| ------------------------------ | -------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------- |
| `UNAVAILABLE_BEFORE_COMMIT`    | Request API fails before durable acceptance              | Explain not accepted; preserve permissible inputs, retry/manual route | No orphan accepted record                             |
| `UNKNOWN_AFTER_SEND`           | Timeout after customer submits or payment attempt        | “Sedang diperiksa”/unknown; avoid duplicate resubmit                  | Query/reconcile by stable logical intent before retry |
| `ACCEPTED_NOTIFICATION_FAILED` | Inquiry accepted, WhatsApp/email fails                   | Durable reference still shown; next step truthful                     | Failed notification visible for recovery              |
| `EXTERNAL_STALE`               | Courier/marketplace data delayed                         | Timestamp/qualification, no fabricated status                         | Reconcile source and stale age                        |
| `AUTH_EXPIRED`                 | Session expires mid-form                                 | Clear re-auth/recovery without unauthorized persistence               | Revalidate authorization on every mutation            |
| `RECONCILIATION_BLOCKED`       | Provider data conflicts with internal payment            | Pending/manual review, no double charge                               | Ownership, escalation, audit trail                    |
| `CAPABILITY_UNAVAILABLE`       | AI/editor/marketplace integration down                   | Core website usable; assisted fallback                                | Feature isolated/circuit-breaker where designed       |
| `PHYSICAL_HOLD`                | Vendor unconfirmed, QC unresolved, courier not collected | Honest progress/hold wording where permissible                        | Handoff requires actual physical evidence             |

### 9.2 Retry and exactly-once customer effect

A repeated click, lost response, background retry, duplicated webhook or concurrent request **must not** create unintended duplicate payment, order, inventory reservation, vendor assignment or customer support action. Distributed delivery may be _at-least-once_; correctness is achieved by governed idempotency/replay semantics and reconciliation rather than pretending the network is exactly-once. An unknown outcome requires inquiry/reconciliation, not blind high-risk retry.

### 9.3 Quality of fallback

An explicit manual-assisted fallback is acceptable for P0/P1 where policy allows. It must have a named owner, a truthful customer acknowledgment, a safe canonical record or clearly documented pending state, a workable contact route, and eventual reconciliation. **“Chat WhatsApp saja nanti diurus” is not a complete fallback** if the entire order/price/approval disappears from governed records.

### 9.4 Capacity and service commitments

No numerical 99.x% uptime, sub-second payment confirmation, “instant production”, 24/7 SLA or one-hour customer-response promise may be marketed or used as hard acceptance without reviewed provider/operational evidence and an approved owner/cost model. Record measured service availability/latency/failure rates where permitted; propose SLOs after baseline. Capacity must respect founder and vendor load even if software could take more orders.

## 10. Proposed functional/non-functional quality requirements

Each row is a **product acceptance candidate**, not an instruction to implement new architecture. Requirement IDs are stable within this proposed draft and intentionally prefixed `CX8-` to avoid collision with MGBOS canonical commands, risk classes and earlier CX documents. `P0`, `P1` and `P2` mean **apply when that capability is within an approved release slice**, not “build the feature now.”

### 10.1 Performance and operational efficiency (`CX8-QR-001..008`)

| ID           | Tier | Requirement                                                                                       | Observable acceptance obligation                                                                                     |
| ------------ | ---- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `CX8-QR-001` | P0+  | Every released public route reports LCP/INP/CLS with separate field/lab provenance                | Field p75 values only when sample valid; otherwise `NOT_VERIFIED_FIELD`; reproducible lab evidence remains available |
| `CX8-QR-002` | P0+  | Representative mobile user can load key content and reach primary action without unnecessary work | Real/mobile or explicitly labelled emulation task, waterfall, visual recording and critical-action trace             |
| `CX8-QR-003` | P0+  | Basic route remains independent of optional AI/editor/recommendation services                     | Disable those services; home, offer and assisted inquiry work within scoped fallback                                 |
| `CX8-QR-004` | P0+  | Images, fonts and media remain usable without unexpected movement or illegible fallback           | Asset/CLS review in cold/warm cache, relevant viewports and slow connection                                          |
| `CX8-QR-005` | P0+  | Every approved page template has a reproducible lab budget and named owner before code approval   | Signed budget registry with baseline evidence; no invented budget for unbuilt templates                              |
| `CX8-QR-006` | P1   | Catalog/cart/checkout responsiveness maintained under realistic item/variant volumes              | Task trace with synthetic representative list/cart sizes and stale-state transitions                                 |
| `CX8-QR-007` | P2   | Advanced editor/AI is lazily isolated and its failure cannot block standard journeys              | Bundle comparison + disabled-feature test + fallback evidence                                                        |
| `CX8-QR-008` | P0+  | New release does not regress existing protected customer critical paths silently                  | Exact-revision before/after comparison; failing cases remediated or independently dispositioned                      |

### 10.2 Accessibility and content (`CX8-QR-009..016`)

| ID           | Tier | Requirement                                                                             | Observable acceptance obligation                                                                 |
| ------------ | ---- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `CX8-QR-009` | P0+  | WCAG 2.2 AA target applies to all released customer-controlled states and full paths    | Item-level manual/automated findings and scope; no blanket conformance claim from scanning alone |
| `CX8-QR-010` | P0+  | Every critical task works with keyboard-only navigation, including error and retry      | Keyboard record shows reachability, order, focus visibility and restoration                      |
| `CX8-QR-011` | P0+  | Screen reader can identify task, required inputs, errors, live status and result        | Explicit assistive tech/browser profile, role/name/state checks and manual task evidence         |
| `CX8-QR-012` | P0+  | Zoom, narrow layouts, virtual keyboards and touch do not hide actions                   | Device matrix: no major inaccessible CTA, scroll trap, covered focus or text loss                |
| `CX8-QR-013` | P0+  | Reduced motion and non-color-only status cues preserve meaning                          | OS preference simulation and status comprehension check                                          |
| `CX8-QR-014` | P0+  | Errors contain helpful Indonesian copy and preserve recoverable fields                  | Negative form UX test; labels and remedy understood without internal codes                       |
| `CX8-QR-015` | P1   | Authentication, checkout, proof review and portal retain accessible completion path     | End-to-end keyboard/AT tasks, third-party embed or redirect included                             |
| `CX8-QR-016` | P2   | Rich editor uses operable alternative for any nonessential drag/canvas-dependent action | Applicable keyboard/mobile assistive task or expressly approved equivalent service path          |

### 10.3 Transaction truth and critical state (`CX8-QR-017..024`)

| ID           | Tier  | Requirement                                                                                        | Observable acceptance obligation                                                              |
| ------------ | ----- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `CX8-QR-017` | P0    | Inquiry success only shown after durable, traceable acceptance                                     | Simulated lost/failed response does not create fabricated reference or uncontrolled duplicate |
| `CX8-QR-018` | P0    | Requested delivery date is distinguished from confirmed feasibility                                | Customer copy and governed state inspection agree; no unconditional promise                   |
| `CX8-QR-019` | P0+   | Estimate, current quote, accepted quote and production approval are visually/semantically distinct | Stale/version/rejected states tested against authoritative source                             |
| `CX8-QR-020` | P1    | Cart price and stock are revalidated before order commitment                                       | Changed price/stock prompts appropriate review; no silent charge/oversell                     |
| `CX8-QR-021` | P1    | Payment state uses verified governed evidence, not gateway redirect                                | Duplicate/spoofed/late callback and unknown outcome all fail safely                           |
| `CX8-QR-022` | P1    | Shipment status distinguishes label created, handoff, transit and delivery                         | Simulated out-of-order carrier signal does not cause false confirmation                       |
| `CX8-QR-023` | P1    | Return request, approved return, refund and resolution remain separate in customer copy            | Distinct transitions and negative financial outcome verified                                  |
| `CX8-QR-024` | P1/P2 | Reorder is a fresh transaction with current checks, not blind copying of old terms                 | Historical price/rights/configuration/organization changes trigger revalidation               |

### 10.4 Privacy, security and authorization (`CX8-QR-025..032`)

| ID           | Tier  | Requirement                                                                                            | Observable acceptance obligation                                                        |
| ------------ | ----- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `CX8-QR-025` | P0+   | Customer content/private business data inaccessible to unrelated actors                                | API/direct URL, guessed object ID and nested-resource negative tests where relevant     |
| `CX8-QR-026` | P1    | B2B user actions checked by identity, membership, capability and resource scope                        | Cross-organization and revoked membership tests; request submitter ≠ automatic approver |
| `CX8-QR-027` | P0/P1 | Artwork intake and storage cannot bypass file and IP/privacy review                                    | Invalid type, malicious active content, oversized and unauthorized-link test            |
| `CX8-QR-028` | P0+   | Public input, redirects and errors cannot expose secrets/private documents                             | Server-side validation and secure-response review; adverse traces redact sensitive data |
| `CX8-QR-029` | P1    | Guest tracking requires a specifically approved proof-of-access mechanism                              | Enumeration/rate/expiry tests and no authorization from guessable order ID alone        |
| `CX8-QR-030` | P0+   | Consent and communication purpose cannot be silently conflated                                         | Transactional/marketing opt-out negative matrix and logging audit                       |
| `CX8-QR-031` | P1/P2 | External integrations validate identity, signature, replay and tenant mapping under approved contracts | Spoofed callback, wrong seller/tenant, duplicate signal tests                           |
| `CX8-QR-032` | P1/P2 | AI has no implicit authority for financial, refund, credit, price or production commitments            | Tool/direct API denial and prompt-injection/unsupported-claim tests                     |

### 10.5 Recovery, channels and physical handoff (`CX8-QR-033..040`)

| ID           | Tier | Requirement                                                                            | Observable acceptance obligation                                                               |
| ------------ | ---- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `CX8-QR-033` | P0+  | Customer receives truthful recovery actions for offline, timeout and unknown outcome   | Cannot lose accepted action silently; can resume or get owned assistance                       |
| `CX8-QR-034` | P0+  | Repeat submission and concurrency cannot duplicate intended business effect            | Same-intent replay with concurrency and lost response; inspect durable effect count            |
| `CX8-QR-035` | P0+  | Notification failure never rolls back/erases already accepted customer request         | Accepted reference persists; alert/queue is recoverable                                        |
| `CX8-QR-036` | P1   | Provider outages are isolated with monitoring, retry/reconcile and explicit owner      | Synthetic sandbox fault exercise shows no blind retry of high-risk action                      |
| `CX8-QR-037` | P1   | Customer sees accurate freshness/uncertainty of cross-channel order and shipment facts | Stale and conflicting sources produce qualified state, not invented real-time data             |
| `CX8-QR-038` | P0+  | Customer request context persists into governed operations without founder retyping    | Source-to-operator trace/reconciliation and exception handoff evidence                         |
| `CX8-QR-039` | P0+  | Physical work completion requires appropriate real-world evidence                      | No software-only “QC passed”, “packed”, “dispatched” by timer, animated screen or AI guess     |
| `CX8-QR-040` | P0+  | Founder must be able to identify and resolve relevant exceptional work                 | Pilot/bounded ops test identifies owner, next action, unknowns and no shadow spreadsheet truth |

### 10.6 Measurement and release evidence (`CX8-QR-041..048`)

| ID           | Tier  | Requirement                                                                                    | Observable acceptance obligation                                                           |
| ------------ | ----- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `CX8-QR-041` | P0+   | Every candidate release declares exact commit/build/environment/scope                          | QA artifact has provenance; changes invalidate affected evidence                           |
| `CX8-QR-042` | P0+   | Applicable test matrix covers positive, negative, authorized/unauthorized and failure recovery | AC traceability, fixtures, results, blocked/not-run statuses; no unsourced 100%            |
| `CX8-QR-043` | P0+   | Product acceptance includes a real browser/user workflow, not tests or screenshots alone       | Recorded task completion, UX comprehension and assistive test where applicable             |
| `CX8-QR-044` | P0+   | Operational pilot readiness remains separate from public customer frontend readiness           | Launch gate checklist cites exact authoritative business roadmap; no cross-gate assumption |
| `CX8-QR-045` | P0+   | Independent review required where risk governance demands it                                   | Reviewer identity/context, exact HEAD, scope, unresolved findings and explicit disposition |
| `CX8-QR-046` | P0+   | Relevant failures and customer effort can be observed without leaking sensitive information    | Telemetry dictionary, retention/consent review, correlation and alert verification         |
| `CX8-QR-047` | P1/P2 | Provider sandbox result and later live readiness are separately recorded                       | Provider/version/tenant/sandbox details; no live PASS inferred from mocks                  |
| `CX8-QR-048` | P0+   | Only Owner or authorized release governance can permit promotion after mandatory gates         | Written decision, known `NOT_VERIFIED`, exceptions, release/rollback owner                 |

## 11. Business and experience rules (`CX8-BR-001..024`)

| ID           | Rule                                                                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CX8-BR-001` | `DRAFT` docs, accepted product definition, implemented code, verified QA and operational launch are different statuses.                                  |
| `CX8-BR-002` | No quality badge, claim or CI report may imply a metric was measured when it was not.                                                                    |
| `CX8-BR-003` | Product quality scopes follow approved capability slices; absent P1/P2 features are not automatic P0 blockers.                                           |
| `CX8-BR-004` | A release-blocking cross-organization leak, duplicate financial effect or unauthorized approval cannot be waived by visual quality or Lighthouse scores. |
| `CX8-BR-005` | Full-page WCAG target includes interaction states and relevant third-party components; automated scans are supporting evidence only.                     |
| `CX8-BR-006` | A critical mobile journey remains usable despite optional rich-feature or provider outage.                                                               |
| `CX8-BR-007` | UI success means only the business fact independently and durably proven at the relevant layer.                                                          |
| `CX8-BR-008` | A receipt reference implies actual receipt only; it does not itself mean quote accepted, payment received or production started.                         |
| `CX8-BR-009` | Stale quote, artwork, price, capacity and shipment data cannot be silently promoted to current authorized state.                                         |
| `CX8-BR-010` | Input validation and hiding UI controls do not replace server-side authorization or invariants.                                                          |
| `CX8-BR-011` | Strong retry/reconciliation must preserve logical business intent and avoid duplicate economic effects.                                                  |
| `CX8-BR-012` | The customer may receive a safe unknown/pending status rather than a false success or false failure.                                                     |
| `CX8-BR-013` | Sensitive financial, organization and artwork fields never become analytics labels or third-party URLs without approved policy.                          |
| `CX8-BR-014` | P0 minimum assisted contact must be truthful and actually routed to a responsible owner; avoid dead “coming soon” transactional CTAs.                    |
| `CX8-BR-015` | Brand expression may vary, but accessible interaction grammar, status semantics and reasonable performance are shared.                                   |
| `CX8-BR-016` | A production or courier milestone must be derived from authenticated human/provider/physical evidence, never merely elapsed time.                        |
| `CX8-BR-017` | AI may explain and recommend within approved policy but cannot invent records or override deterministic money/permission controls.                       |
| `CX8-BR-018` | Guest checkout/inquiry is low-friction; guest access to private results is not an authorization bypass.                                                  |
| `CX8-BR-019` | P2 editor/AI cannot impose a new global dependency or unacceptable regression on approved P0/P1 journeys.                                                |
| `CX8-BR-020` | Unknown CI enforcement, environment identity, third-party terms or test result must remain `NOT_VERIFIED`, not inferred PASS.                            |
| `CX8-BR-021` | An engineering finding can block a release even when a product acceptance script succeeds.                                                               |
| `CX8-BR-022` | A product acceptance review can block a customer release even when the software build/security/CI checks pass.                                           |
| `CX8-BR-023` | The Owner does not authorize implementation, financial exposure or production merely by accepting this draft's wording.                                  |
| `CX8-BR-024` | No new numerical SLO, performance lab budget or legal policy is finalized without baseline, domain owner and evidence review.                            |

## 12. Measurement plan and proposed experience scorecard

| Key       | Question                                       | Measure                                                                 | Baseline             | Review cadence                      |
| --------- | ---------------------------------------------- | ----------------------------------------------------------------------- | -------------------- | ----------------------------------- |
| `CX8-M01` | Is mobile page loading performant?             | p75 mobile LCP by route group + sample counts                           | `NOT_VERIFIED_FIELD` | Post-launch with valid volume       |
| `CX8-M02` | Can people interact promptly?                  | p75 mobile/desktop INP by group                                         | `NOT_VERIFIED_FIELD` | Post-launch with valid volume       |
| `CX8-M03` | Does UI visually jump?                         | p75 CLS by device and route group                                       | `NOT_VERIFIED_FIELD` | Post-launch with valid volume       |
| `CX8-M04` | Are pages light on target mobile?              | Lab route budget, load trace, JS/media bytes                            | `NOT_MEASURED`       | Every scoped frontend change        |
| `CX8-M05` | Can customers finish the task unaided?         | Task completion, reason for error and observed friction                 | `NOT_TESTED`         | Pre-launch + post-change            |
| `CX8-M06` | Are key tasks inclusive?                       | Severity and incidence of WCAG/AT blockers in tested scope              | `NOT_REVIEWED`       | Before each applicable release      |
| `CX8-M07` | Is quote/checkout truth correct?               | Contradictory status defects and negative tests                         | `NOT_TESTED`         | Each transactional change           |
| `CX8-M08` | Are requests being lost/duplicated?            | Durable unique-intent acceptance and duplicate effect rate              | `NOT_MEASURED`       | Relevant P0/P1 release + live pilot |
| `CX8-M09` | Are founders manually reconstructing requests? | Manual re-entry count and minutes per accepted request                  | `NOT_MEASURED`       | Pilot, before/after automation      |
| `CX8-M10` | Is provider failure recoverable?               | Unknown-outcome age, recovery time and unresolved attempts              | `NOT_MEASURED`       | Each live provider launch           |
| `CX8-M11` | Does support become less repetitive?           | Avoidable status inquiries and repeat-contact rate                      | `NOT_MEASURED`       | P1 after enough cases               |
| `CX8-M12` | Do customers trust the information?            | Comprehension of quote/price/status/lead time                           | `NOT_TESTED`         | Pre-launch user task tests          |
| `CX8-M13` | Is AI useful enough to justify complexity?     | Resolved task % without unsupported claims, escalation and cost         | `NOT_MEASURED`       | Only if AI feature approved         |
| `CX8-M14` | Is demand within capacity?                     | Open actionable work vs capacity, delayed promises, founder escalations | `NOT_MEASURED`       | Operational pilot and launch review |

**Telemetry implementation direction only:** product analytics events must be privacy reviewed and must never be confused with authoritative payment/order events. Do not invent `customer_success` if the customer merely viewed a thank-you screen. High-risk error/correlation logs require pseudonymization, access control and retention review. A telemetry SDK itself is a new privacy/performance dependency that must pass CX8-QR-003/028/030.

## 13. Acceptance test catalogue — candidate scenarios, not executed

All tests below are **requirements for future bounded engineering slices**, not claims that fixtures, automation, CI, environments or actual results already exist. The correct result of these proposed rows as of CX-08 drafting is `NOT_RUN`. Every applicable scenario must be linked to a requirement, exact candidate commit, test level, environment identity, evidence locator and independent reviewer disposition where required.

### 13.1 P0 customer entry, mobile and inquiry (`CX8-AC-001..012`)

| ID           | Given / When / Then                                                                                                                                                                                                                                                                                                                                                                                                                          | Required evidence                                         |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `CX8-AC-001` | **Given** unfamiliar mobile user; **when** they open Home; **then** they identify actual Shop/Custom/Business/Merch entry and know which is currently supported, without navigating an internal department taxonomy                                                                                                                                                                                                                          | Moderated/unmoderated task + mobile recording             |
| `CX8-AC-002` | **Given** approved P0 landing; **when** loaded cold under declared mobile profile; **then** meaningful hero, CTA and content are measured with trace, loading errors and layout stability documented                                                                                                                                                                                                                                         | Lab trace, browser/snapshot, LCP/CLS                      |
| `CX8-AC-003` | **Given** mobile or keyboard user accessing Home, Custom/Business, or direct customer links; **when** customer navigates via menu/CTA/form or revisits/refreshes deep links (quotes, proofs, tracking, cart, order); **then** correct order, visible focus, accessible labels, state restoration, and clean recovery on invalid/expired links without credential leakage are verified                                                        | Accessible navigation and deep-link recovery evidence     |
| `CX8-AC-004` | **Given** a screen reader user; **when** required form errors occur; **then** error reason, field and correction are discoverable without sight; values remain intact                                                                                                                                                                                                                                                                        | AT recording + form/API negative test                     |
| `CX8-AC-005` | **Given** user submits a valid Custom inquiry; **when** durable acceptance succeeds; **then** one correct reference, next action and human-owned follow-up appear; no order/payment/production status is implied                                                                                                                                                                                                                             | Browser acceptance + canonical record inspection          |
| `CX8-AC-006` | **Given** custom inquiry form with conditional inputs or missing quantity/invalid contact/artwork; **when** customer toggles options or submits form; **then** advanced fields (quantity breakdown, print placement, deadline qualifiers, tax/invoice) reveal or collapse progressively without loss of valid prior inputs, validation errors are specific and non-destructive, and no accepted business effect occurs on invalid submission | Negative browser/API + progressive disclosure state proof |
| `CX8-AC-007` | **Given** deadline requested sooner than approved feasibility; **when** customer submits; **then** system preserves request as unconfirmed rather than promising date or enabling unsupported rush purchase                                                                                                                                                                                                                                  | Content review + domain handoff trace                     |
| `CX8-AC-008` | **Given** accepted request but message provider offline; **when** notification fails; **then** receipt remains valid and failed follow-up is visible for recovery without duplicate lead                                                                                                                                                                                                                                                     | Simulated provider failure + state inspection             |
| `CX8-AC-009` | **Given** user clicks submit twice/loses response; **when** stable-intent request retries; **then** exactly one intended accepted effect exists, including concurrent retry                                                                                                                                                                                                                                                                  | Concurrency + duplicate-effect assertion                  |
| `CX8-AC-010` | **Given** network drops before acceptance; **when** request cannot be persisted; **then** UI does not claim receipt; customer sees permitted restore/retry/human route                                                                                                                                                                                                                                                                       | Fault injection + task recording                          |
| `CX8-AC-011` | **Given** `prefers-reduced-motion`, large text and virtual keyboard; **when** mobile visitor submits; **then** no motion-only feedback or covered action, and complete result is readable                                                                                                                                                                                                                                                    | Real/mobile browser matrix                                |
| `CX8-AC-012` | **Given** AI, analytics and rich editor unreachable; **when** visitor opens and uses declared P0 routes; **then** the core browsing and assisted inquiry remain usable                                                                                                                                                                                                                                                                       | Network interception + no-third-party flow                |

### 13.2 P1 retail/catalog and payments (`CX8-AC-013..024`)

| ID           | Given / When / Then                                                                                                                                                                                                                                                                                                                                                                                                        | Required evidence                               |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `CX8-AC-013` | **Given** published catalog with valid/invalid variants and stock states; **when** customer searches, applies category/material/fit/price filters, sorts, or resets controls; **then** only active sellable items appear, filter/sort state persists and resets cleanly, variant selection reflects real SKU, and empty or out-of-stock results offer helpful next steps without exposing hidden internal inventory states | Catalog contract and discovery filter/sort test |
| `CX8-AC-014` | **Given** current product photo/font assets; **when** constrained mobile user sees PDP; **then** selected item and purchase controls are legible and accessible without severe layout jump                                                                                                                                                                                                                                 | Media trace + browser/AT review                 |
| `CX8-AC-015` | **Given** item in cart and price changes before checkout; **when** validation occurs; **then** customer reviews correct new terms and cannot silently pay old/new unexpected price                                                                                                                                                                                                                                         | UI + domain transaction test                    |
| `CX8-AC-016` | **Given** stock runs out after item selected; **when** checkout commits; **then** system prevents unapproved oversell and shows appropriate alternate action                                                                                                                                                                                                                                                               | Reservation/race + UI test                      |
| `CX8-AC-017` | **Given** customer uses guest checkout; **when** personal/contact details processed; **then** no forced account solely for vanity; private order later accessed only through approved proof-of-access                                                                                                                                                                                                                      | UX task + security negative test                |
| `CX8-AC-018` | **Given** duplicate checkout action; **when** user retries under concurrency; **then** exactly one intended commercial order/charge occurs and response aligns with durable result                                                                                                                                                                                                                                         | Idempotency + financial-effect assertion        |
| `CX8-AC-019` | **Given** gateway redirect says success but verified provider outcome missing; **when** user returns; **then** UI shows pending/unknown and does not falsely assert payment recorded                                                                                                                                                                                                                                       | Provider sandbox/simulator + finance read       |
| `CX8-AC-020` | **Given** payment callback signed incorrectly/duplicated/out of order; **when** processed; **then** canonical amount/state remains valid, malicious events denied, later valid correction reconciled properly                                                                                                                                                                                                              | Signature/auth, replay, domain ledger test      |
| `CX8-AC-021` | **Given** provider creates attempt then network times out; **when** customer retries; **then** system determines prior outcome before potential new charge and preserves trace                                                                                                                                                                                                                                             | Unknown-outcome fault injection + sandbox       |
| `CX8-AC-022` | **Given** payment accepted; **when** notification fails; **then** payment truth remains and user can retrieve status, not trigger a duplicate charge via notification resend                                                                                                                                                                                                                                               | Message outage + end-to-end accounting read     |
| `CX8-AC-023` | **Given** screen-reader/keyboard-only customer; **when** full supported checkout runs; **then** delivery, payment, error, redirect/return and confirmation are accessible in intended provider context                                                                                                                                                                                                                     | Full-path AT + browser test                     |
| `CX8-AC-024` | **Given** new checkout SDK bundle; **when** compared with approved P0 routes; **then** P0 remains within approved performance budgets with no global provider dependency                                                                                                                                                                                                                                                   | Template bundle/waterfall diff                  |

### 13.3 Account, quote, artwork, service, and fulfillment (`CX8-AC-025..036`)

| ID           | Given / When / Then                                                                                                                                                                                    | Required evidence                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `CX8-AC-025` | **Given** logged-in user from Company A; **when** opening Company B quote via deep link/API; **then** content and existence details are not leaked and no mutation permitted                           | Cross-organization API/direct-route negative tests |
| `CX8-AC-026` | **Given** valid company requester lacking approval capability; **when** approving quote; **then** request is denied even if the UI displays an old button or forwarded link                            | Authorization + API bypass attempt                 |
| `CX8-AC-027` | **Given** approved quote v1 superseded by v2; **when** stale v1 approve clicked; **then** commercial commitment not made silently; latest terms require active review                                  | Version concurrency + customer UI outcome          |
| `CX8-AC-028` | **Given** artwork upload MIME mismatch, malicious SVG or unauthorized URL; **when** file submitted/viewed; **then** safe rejection/quarantine or approved sanitized handling; no unintended disclosure | File/URL security + UI recovery test               |
| `CX8-AC-029` | **Given** proof preview accepted by customer; **when** operational production gate unmet; **then** UI does not claim production-ready or start vendor work by implication                              | Proof-version acceptance + production guard test   |
| `CX8-AC-030` | **Given** customer accesses own order status; **when** shipment label exists but parcel not handed over; **then** no “shipped” assertion unsupported by handoff proof                                  | State mapping + carrier synthetic test             |
| `CX8-AC-031` | **Given** delivered scan followed by older transit scan; **when** adapter updates; **then** truthful customer status and event history preserved without unsupported regression                        | Out-of-order event test                            |
| `CX8-AC-032` | **Given** valid customer raises return request; **when** submitted; **then** reference links to request/case, not necessarily approved return/refund                                                   | Customer journey + state inspection                |
| `CX8-AC-033` | **Given** support case needs finance/production action; **when** escalated; **then** a responsible case owner remains visible and private internal notes stay hidden from customer                     | Role-based UI/API + operator case test             |
| `CX8-AC-034` | **Given** historical Custom/B2B order; **when** customer reorders; **then** old price, stock, artwork rights, capacity, payment and roles are revalidated as required                                  | Fresh quote/order + negative test                  |
| `CX8-AC-035` | **Given** guest receives valid tracking link; **when** link expires/is enumerated; **then** no order info leaks and accessible re-verification path appears                                            | Expiry, enumeration and assistive UI tests         |
| `CX8-AC-036` | **Given** customer requests physical state correction; **when** QC or courier evidence unresolved; **then** safe pending/assisted state persists without fake completion                               | Service-to-operations end-to-end trace             |

### 13.4 Integrations, AI, observability, and release process (`CX8-AC-037..048`)

| ID           | Given / When / Then                                                                                                                                                                                                      | Required evidence                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| `CX8-AC-037` | **Given** marketplace order webhook repeated 10 times; **when** replayed plus one legitimate revision; **then** one original order effect, subsequent revision separately governed, no duplicate inventory/vendor effect | Integration concurrency/idempotency test        |
| `CX8-AC-038` | **Given** wrong-seller or wrong-tenant external event; **when** received; **then** no cross-org mutation, event quarantined/denied without leaking private order existence                                               | Provider scope/security test                    |
| `CX8-AC-039` | **Given** payment, courier or WhatsApp provider unavailable; **when** a scoped customer task starts; **then** truthful blocked/pending path and owned recovery exist                                                     | Sandbox/fault exercise + operational owner      |
| `CX8-AC-040` | **Given** recipient opted out of marketing only; **when** promotion is scheduled; **then** system blocks promotional send despite transactional message eligibility                                                      | Consent purpose + negative send test            |
| `CX8-AC-041` | **Given** provider says message “accepted”; **when** UI/ops view shows delivery; **then** system distinguishes accepted, sent and actual delivered evidence                                                              | Provider state mapping + UI copy review         |
| `CX8-AC-042` | **Given** an AI prompt asks for refund or reveals private quote; **when** model/tool attempts action; **then** approved deterministic authorization denies forbidden action and human fallback works                     | Adversarial AI/tool authorization test          |
| `CX8-AC-043` | **Given** customer analytics enabled; **when** events recorded; **then** no card data, quote contents, private artwork, credentials or raw PII in event labels/URLs                                                      | Privacy and outbound-request inspection         |
| `CX8-AC-044` | **Given** all named product test cases pass; **when** hosted required CI or R4/R5 gate is unproven; **then** overall release remains blocked/not verified, not green by aggregation                                      | Evidence-gate audit exercise                    |
| `CX8-AC-045` | **Given** all required hosted CI checks pass; **when** keyboard customer cannot submit P0 form; **then** product release blocks until remediated or formally addressed per authority                                     | Independent accessibility/product gate evidence |
| `CX8-AC-046` | **Given** previously approved candidate HEAD is changed; **when** review package is reused; **then** affected assurance is stale and reverification scope is recorded before merge                                       | Revision diff/evidence audit                    |
| `CX8-AC-047` | **Given** customer pilot without valid real-user sample; **when** performance report generated; **then** field p75 is `NOT_VERIFIED_FIELD`, never a fabricated zero or PASS                                              | Analytics evidence-provenance review            |
| `CX8-AC-048` | **Given** a production release request; **when** operational owner, backup/recovery, environment isolation or capacity gate is missing; **then** deployment/launch does not proceed despite passing demo flows           | Launch-gate rehearsal + Owner decision          |

### 13.5 Additional mandatory edge-case coverage on actual scoped features

These are testing **categories**, not separate promises to implement absent functionality. For any approved feature: ensure representative happy path; bad inputs; unauthorized actor; inactive/revoked actor; wrong organization; duplicate/replay; concurrency; delayed/expired data; partial provider failure; recovery; data retention/privacy; and mobile/keyboard error states. If a category is not applicable, provide a reason signed by its relevant owner. For money and external effects, test the actual **resulting business effect** rather than a mocked UI `200` alone.

### 13.6 Acceptance coverage registry format

Each executable future case SHOULD be registered like:

```yaml
case_id: CX8-AC-019
capability: verified_payment_confirmation
product_phase: P1_GOVERNED_SELF_SERVICE
parent_requirements: [CX8-QR-021, CX1-NFR-007]
source_of_truth: systems/mgbos/docs/architecture/command-event-model.md
implementation_work_package: NOT_ASSIGNED
test_level: provider_sandbox_plus_api_plus_browser
exact_commit_sha: NOT_AVAILABLE
environment: NOT_AVAILABLE
test_data: synthetic_only
expected: redirect_does_not_prove_paid
actual: NOT_RUN
status: NOT_VERIFIED
evidence_uri: null
independent_auditor: NOT_ASSIGNED
```

Do not assign historical CI records to a newly written product case unless they demonstrably cover the exact contract and candidate revision.

## 14. Test coverage matrix and quality evidence pyramid

| Level                    | Main responsibility                                                        | Typical fixtures                                    | Does NOT prove                              |
| ------------------------ | -------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------- |
| Product/editorial review | Requirements, status semantics, copy, consent and expected task            | PRD references, screen specimens, policy map        | UI or backend implementation                |
| Unit/component           | Field/error behavior, state view, formatting, form help                    | Synthetic isolated components                       | Whole transactional flow                    |
| Domain/DB                | Invariants, permission, version/amount/role, rollback/idempotency          | New disposable DB and isolated transaction fixtures | Customer understands interface              |
| API/integration          | Transport + validated command boundary, provider mapping/retry             | Mock/sandbox with controlled contract               | Live provider performance or field UX       |
| Browser E2E              | Actual clicks, focus, submit/confirm, navigation/recovery                  | Production-like synthetic content                   | WCAG conformance without manual AT review   |
| Accessibility audit      | Full page/flow, screen reader, keyboard, zoom/contrast                     | Approved device/AT matrix                           | Backend authorization correctness           |
| Performance lab          | Repeatable cold/warm mobile/desktop template load and interaction          | Captured CPU/network/device profiles                | Representative real-world p75               |
| Field analytics          | Real visitor experience where lawful/sample sufficient                     | Privacy-reviewed real-user data                     | Transaction truth or security assurance     |
| UX research              | Understanding, usability, actual user effort and confidence                | Representative recruited cohorts                    | Correct database state or deployment safety |
| Independent security QA  | Adversarial/negative tests and architecture/invariant gate                 | Exact HEAD, isolated environment                    | Production operational readiness            |
| Operational pilot        | Customer-to-founder handoff, physical proof, recovery, capacity            | Controlled real or formally approved pilot          | Universal ecommerce scale                   |
| Live provider/canary     | Provider delivery/settlement and monitoring under controlled authorization | Explicit account/environment and release plan       | All future feature/provider readiness       |

**Do not flatten these levels into “48/48 tests PASS” without identifying which were only specified, which ran, what skipped, what failed, and the exact environment.** Historical MGBOS CI or security evidence may help establish existing engine readiness but cannot automatically prove customer-facing checkout, field metrics, guest authorization or third-party operation.

## 15. Proposed release gates and disposition algorithm

The Head Engineering team translates these product outcomes to the project's **existing** risk-governed technical process. CX-08 does not create a new risk class, redefine the canonical launch sequence or bypass existing PR/branch protection.

### `CX8-GATE-A` — Product scope and canonical reconciliation

- Current launch slice, target actor, user jobs and non-goals listed.
- CX-01..07 draft requirements mapped, duplicates/collisions resolved, business and architectural authority preserved.
- Customer-facing service offers, prices, policies, capability availability and next steps are accurate.
- Open Product/Owner decisions which affect flow acceptance are resolved or formally marked blocking/deferred.
- Compliance/legal consumer policy reviewed for applicable claims.

**FAIL if:** UI promises unsupported capability or specification silently contradicts canonical business policy.

### `CX8-GATE-B` — UX and inclusive task completion

- Real browser flows for declared target jobs with error, loading and recovery states.
- Representative mobile/keyboard/AT/manual accessibility coverage with dated recorded findings.
- No unresolved critical task blocker; severity and triage decisions transparent.
- Brand expression supports clarity and trustworthy status interpretation.

**FAIL if:** essential current customer task unreachable on supported mobile/AT or false success/price shown.

### `CX8-GATE-C` — Performance and non-regression

- Route inventory, template budgets and test profiles approved for release slice.
- Reproducible relevant performance lab evidence and approved regression comparison.
- Current field p75 recorded only where actually available, segmented and statistically interpretable.
- P2 additions do not silently burden already-approved P0/P1 routes.

**FAIL if:** unreviewed severe regression on required route or no necessary pre-launch lab evidence. **Do not force field p75 PASS when no traffic exists.**

### `CX8-GATE-D` — Transaction, identity and security

- Applicable MGBOS command/invariant and organization/role/permission tests run at exact revision.
- Negative replay/concurrency, duplicate payment, stale approvals, malicious upload and provider spoofing tested where affected.
- Existing canonical R4/R5 assurance, hosted CI and QA independence followed exactly as required.
- No production credentials or real customer data in destructive tests.

**FAIL if:** cross-org disclosure, unauthorized action, duplicate financial effect, data loss, invalid payment/production truth or material unresolved hard gate.

### `CX8-GATE-E` — Integrations, observability and failure recovery

- Actual provider and contract readiness verified **only for enabled providers**; provider sandboxes/integration isolation evidence recorded.
- Timeouts, unknown outcomes, replay, reconciliation and notification recovery demonstrated as applicable.
- Service owner, error monitoring, trace/correlation and incident handoff present.
- Core assisted path remains usable without optional AI/recommendations.

**FAIL if:** enabled provider creates uncontrolled duplicate effect or unrecoverable unknown outcome.

### `CX8-GATE-F` — Pilot/operational readiness and release authority

- Current roadmap Launch Gates A–I assessed where applicable; production-security/environment boundaries, backups/restore, monitoring and manual fallback checked.
- Founder/vendor/physical work has verifiable ownership and real constraints; demand does not exceed handling capacity.
- Branch protection, required hosted CI, exact revision and deployment/rollback plan verified, not inferred from YAML.
- Owner authorizes **the specific release** through the existing engineering process; no general approval from CX-08 drafting.

**FAIL if:** operational readiness/backup/environment/owner approval missing when required, regardless of UI polish.

### 15.1 Decision model

```text
APPROVED RELEASE SLICE
  ↓
IDENTIFY CANONICAL SOURCE + RISK OWNERSHIP
  ↓
MAP ALL APPLICABLE PRODUCT + ENGINEERING GATES
  ↓
COLLECT EXACT-HEAD EVIDENCE; MARK NOT_RUN/NOT_VERIFIED EXPLICITLY
  ↓
ANY MANDATORY BLOCKING FAILURE?
  ├─ YES → BLOCKED / BOUNDED REMEDIATION / RE-AUDIT
  └─ NO  → REQUIRED INDEPENDENT REVIEW AND OWNER DECISION
              ↓
         DEPLOYMENT PERMISSION ONLY IF EXPLICITLY GIVEN
              ↓
         OPERATIONAL ACCEPTANCE IS A SEPARATE VERIFICATION
```

`PASS_WITH_LIMITATIONS` may be an acceptable technical or product disposition **only when** each limitation is non-blocking under applicable authoritative contracts, not because reviewers lack time. Never relabel an unresolved hard finding as acceptable “documented NOT_VERIFIED” without contractual justification.

### 15.2 Waivers and exceptions

A narrowly documented, authorized exception must identify exact scope/revision, known risk, who owns it, mitigating control, expiry/revisit trigger, expected evidence, and a specific canonical policy permitting exception. **This product draft cannot waive canonical financial, tenant or permission hard invariants.** User-facing accessibility and safety blockers should not be minimized merely to meet an arbitrary release date.

### 15.3 No separate hard dependency on absent storefront for assisted-sales pilot

Existing `docs/roadmaps/solo-founder-launch-roadmap.md` and `systems/mgbos/docs/product/teestock-operational-pilot-plan.md` already provide a controlled Custom/Business assisted-sales path. If current pilot does **not** expose a CX-08-proposed P1 web checkout or portal, its absence is not a QA failure. The pilot must still satisfy **its actual** operational safety/security/customer-promise gates, and any public P0 intake added must pass its corresponding UX/accessibility/data safety outcomes.

## 16. Decisions requiring formal owner and domain review

| ID           | Proposed direction (not yet binding)                                                                                              | Decision owner / condition                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `CX8-DEC-01` | Treat customer **trust and transaction truth** as release blockers, not nice-to-have                                              | Owner + Head Engineering; reconcile canonical R4/R5 gates |
| `CX8-DEC-02` | Use Google's good CWV LCP/INP/CLS **p75** targets for real user field measurements                                                | Owner + Frontend/QA; approve measurement policy           |
| `CX8-DEC-03` | Adopt WCAG 2.2 Level AA as default customer-experience accessibility quality target                                               | Owner + accessibility/QA/legal as relevant                |
| `CX8-DEC-04` | Declare P0 as premium **assisted entry**, independent of full checkout/portal completion                                          | Owner; comply with existing roadmap                       |
| `CX8-DEC-05` | Require representative mobile-device lab profiling before public feature acceptance                                               | Head Engineering + QA; select actual devices/profiles     |
| `CX8-DEC-06` | Set JS/CSS/CPU/network/media route budgets only **after representative baseline**, not from current shell                         | Frontend Architect + QA + Owner budget approval           |
| `CX8-DEC-07` | Manual keyboard and assistive-tech tests are mandatory for critical customer paths                                                | Accessibility specialist + QA; device/AT selection        |
| `CX8-DEC-08` | Treat source state and customer presentation as separate: no redirected payment success or estimated delivery as confirmed truth  | Product + business and MGBOS domain owners                |
| `CX8-DEC-09` | Gate higher-risk scenarios through current BisnisHub risk/assurance, not a separate CX risk scale                                 | Head Engineering / governance authority                   |
| `CX8-DEC-10` | Allow truthful owned assisted fallback rather than demanding full self-service in P0                                              | Product Owner + operating owner                           |
| `CX8-DEC-11` | Protect P0 performance whenever adding P1/P2 SDK, assistant, editor or personalization                                            | Product + Frontend QA / acceptance                        |
| `CX8-DEC-12` | Distinguish lab verification, field p75 and provider sandbox/production evidence in every release report                          | QA/Head Engineering / evidence model                      |
| `CX8-DEC-13` | Require UX comprehension/critical path review in addition to CI for customer release                                              | Product Owner + independent UX reviewer when needed       |
| `CX8-DEC-14` | Select explicit human-service availability and customer-response wording based on **real owner capacity**, not marketing ambition | Owner + operations                                        |
| `CX8-DEC-15` | Use selected OWASP ASVS 5.0 requirements as a **reference**, never generic compliance claim                                       | Security/Head Engineering; scoped control mapping         |
| `CX8-DEC-16` | Define named performance/quality/incident monitors and data retention rules before live analytics                                 | QA/Operations/Security/Privacy                            |

Any decision affecting existing canonical business rights, authorization, customer policy or roadmap must follow the actual owner/ADR/governance mechanism. A Product Owner choosing “yes” to this draft is **not** automatic permission for Antigravity to make database, auth, payment or production changes.

## 17. Risks and planned response

| Risk ID       | Severity proposal | Risk                                                                        | Risk treatment / closure evidence                                      |
| ------------- | ----------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `CX8-RISK-01` | Critical          | Nice UI masks false paid/order/production status                            | Require authoritative source trace + negative transactional tests      |
| `CX8-RISK-02` | Critical          | Guest/B2B portal leaks unrelated customer data                              | Server-side isolation and object-level direct API/deep-link tests      |
| `CX8-RISK-03` | Critical          | Repeat/timeout creates duplicate financial effect                           | Strong idempotency + replay/commit race evidence on isolated DB        |
| `CX8-RISK-04` | High              | Accessibility scanner PASS misrepresented as full WCAG AA conformance       | Manual keyboard/AT + criteria mapping and scope declaration            |
| `CX8-RISK-05` | High              | Lighthouse/one desktop score misrepresented as p75 actual UX                | Field/lab provenance, mobile cohort segmentation and unverified status |
| `CX8-RISK-06` | High              | Third-party payment/marketplace SDK burdens P0                              | Route bundle ownership, optional loading, regression budget            |
| `CX8-RISK-07` | High              | Missing CI or R4/R5 verification silently waived by product enthusiasm      | Risk ownership, exact SHA + independent disposition before release     |
| `CX8-RISK-08` | High              | Artwork upload enables active content/exfiltration or rights breach         | File quarantine, server validation and legal owner approval            |
| `CX8-RISK-09` | High              | Overpromised delivery or support hours exceed solo founder capacity         | Honest UX copy, demand/capacity gate, fallback owner                   |
| `CX8-RISK-10` | High              | UI success persists after canonical request failed                          | Browser/API trace, unknown-outcome failure exercise                    |
| `CX8-RISK-11` | High              | Customer self-service creates unowned support/return cases                  | Case owner/next-action, customer notification, reconciliation          |
| `CX8-RISK-12` | High              | AI authorizes or fabricates financial/operational outcome                   | Governed tool denial tests, grounded responses, human route            |
| `CX8-RISK-13` | High              | Baselines absent; team invents budgets to get green dashboard               | Baseline-first protocol, `TBD_BASELINE`, explicit approval             |
| `CX8-RISK-14` | Medium/High       | Sensitive analytics exhausts privacy, cost or frontend performance          | Telemetry minimization, outbound audit, vendor/retention review        |
| `CX8-RISK-15` | Medium/High       | Test data labeled synthetic but targets an existing non-disposable database | Proven environment identity and destructive-test stop rule             |
| `CX8-RISK-16` | Medium/High       | Doc indexing collides with PR #73 and creates contradictory authority       | Defer repository adoption until routing reconciliation                 |

Severity values above are **product-impact descriptions only**, not BisnisHub engineering R-classifications. Final risk levels must be assigned using `docs/governance/cross-system-risk-classification.md` by the responsible engineering owner.

## 18. Open research and engineering unknowns

| ID           | Open question                                                                                                 | Why it matters                                | Owner / next evidence                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------- |
| `CX8-UNK-01` | What exact approved P0 public routes and capabilities will be available on the first customer-facing release? | Cannot test nonexistent surfaces              | Product Owner + roadmap review                          |
| `CX8-UNK-02` | What representative Android/iOS/desktop device/browser matrix matches actual target customers?                | Determines realistic performance/AT coverage  | UX research + QA                                        |
| `CX8-UNK-03` | What are current mobile CWV field values?                                                                     | No production customer traffic evidence       | Instrument after launch; meanwhile `NOT_VERIFIED_FIELD` |
| `CX8-UNK-04` | What initial per-template JS/media/CPU lab budgets are feasible?                                              | Prevents invented size/time gates             | Profile approved reference build                        |
| `CX8-UNK-05` | Which supported screen-reader/browser combinations can reliably be tested?                                    | Accessibility evidence completeness           | UX/accessibility QA                                     |
| `CX8-UNK-06` | Which exact reusable design components/assets already meet brand and copyright requirements?                  | Image/font load, visual consistency           | Brand/content + Frontend                                |
| `CX8-UNK-07` | Which approved customer identity/guest-link mechanics will be used in P1?                                     | Prevents data leakage                         | Security, architecture, product                         |
| `CX8-UNK-08` | Does every live payment provider and merchant account support required sandbox/reconciliation controls?       | Payment readiness                             | Financial/Backend + provider evidence                   |
| `CX8-UNK-09` | Which MGBOS commands and outbox/event capabilities are actually ready at the P1 implementation date?          | Avoid imaginary cross-channel event readiness | Head Engineering fresh exact-source audit               |
| `CX8-UNK-10` | What legal/contractual product return/refund/customer policy is approved for the intended audience?           | Determines user rights, tests and copy        | Legal/business owner                                    |
| `CX8-UNK-11` | What are real business hours, response capacity and customer case ownership?                                  | Avoid false SLA promises                      | Owner/Operations                                        |
| `CX8-UNK-12` | How will browser UX metrics be collected with appropriate consent, storage, sampling and redaction?           | Privacy and operating cost                    | Product Analytics + Security                            |
| `CX8-UNK-13` | Who independently signs UX/accessibility acceptance for a solo-founder engineering workflow?                  | Independence and provenance                   | Head Engineering governance routing                     |
| `CX8-UNK-14` | Which CI browser/E2E runners and branch rules are actually enforced for TeeStock app?                         | No false coverage claims                      | Engineering + hosted CI proof                           |
| `CX8-UNK-15` | What proof of physical handoff, vendor acceptance and QC is adequate for customer status?                     | Prevent false production/delivery signals     | Operations/Production/QC owners                         |
| `CX8-UNK-16` | What release rollback/safe disable action is supported for each new provider/AI/widget?                       | Outage containment                            | Ops + Engineering                                       |
| `CX8-UNK-17` | Can proposed package paths be adopted without PR #73 routing conflicts?                                       | Canonical source ownership                    | Docs owner + Head Engineering after PR result           |
| `CX8-UNK-18` | How much founder time is removed vs added per order and exception?                                            | Solo founder viability                        | Pilot measurement, CX-09 roadmap                        |

Do not resolve an unknown by inventing an implementation detail, choosing a provider without research, or describing an unfinished integration as “already supported.”

## 19. Dependency and traceability map

### 19.1 CX package responsibilities

| Product spec                   | Quality cases most directly linked                                       | Scope boundary                                                             |
| ------------------------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| CX-00 audit                    | `CX8-GATE-A`, provenance and documentation conflict checks               | Research input, not implementation evidence                                |
| CX-01 Master PRD               | All `CX8-QD-*`; `CX8-QR-001..048`; `CX8-GATE-A..F`                       | Parent outcomes and capability definitions                                 |
| CX-02 Customer Journeys        | `CX8-AC-001..012`, `030..036`, `039`                                     | End-to-end customer/backstage/physical truth                               |
| CX-03 Experience Design        | `CX8-QR-001..016`, `CX8-AC-001..004`, `011..014`, `023..024`             | Visual/interaction standards, not new brand authority                      |
| CX-04 Commerce & Checkout      | `CX8-QR-017`, `020..024`, `CX8-AC-013..024`                              | Retail commerce only when P1 approved                                      |
| CX-05 Custom & B2B             | `CX8-QR-017..019`, `027`, `CX8-AC-005..010`, `025..029`, `034`           | Approvals/quotes/print proof rules remain canonical elsewhere              |
| CX-06 Customer Account/Service | `CX8-QR-025..030`, `CX8-AC-025..036`                                     | Identity/cases/refunds architecture remains MGBOS-owned                    |
| CX-07 Omnichannel Integrations | `CX8-QR-031..037`, `CX8-AC-037..043`                                     | Provider actual capability must be separately proven                       |
| CX-08 (this)                   | All product quality goals, evidence and release-gate outcomes            | No technical implementation permissions                                    |
| CX-09 (next)                   | Slice selection, dependencies, validation roadmap, measurable investment | Must not change canonical business roadmap without approved reconciliation |

### 19.2 Machine and human reading order

```text
DOC-001 Documentation Constitution
  → DOC-002 Canonical Source Map
  → Cross-system Risk + Evidence Governance
  → TeeStock canonical business/customer legal policies
  → MGBOS canonical architecture and current actual code
  → CX-00 evidence-bound audit (DRAFT research)
  → CX-01 Master PRD (DRAFT)
  → CX-02 Journeys (DRAFT)
  → CX-03 Design/Interaction (DRAFT)
  → CX-04..07 feature contracts (DRAFT)
  → CX-08 measurable quality and acceptance (DRAFT)
  → CX-09 phased validation and roadmap (not yet authored)
  → Head Engineering discovery, current source audit, architecture impact
  → approved bounded IC/WP → Builder → independent QA/security → Owner release
```

### 19.3 Product requirement-to-engineering mapping rule

Each bounded feature proposal must provide: customer job ID; parent CX1 FR/NFR; applicable CX8 QR/AC; actual business and MGBOS source owner; risk classification by canonical risk document; explicit positive and negative scenarios; acceptance/test level; required disposable env/provider sandbox; budget owner; expected operator fallback; observable success; and exact revision evidence. Re-using MGBOS existing commands is preferred to inventing data entities because a PRD contains a desired user experience.

## 20. Illustrative evaluation fixtures (synthetic, non-production)

### 20.1 Mobile Custom inquiry with lost response

**Setup:** Synthetic valid Custom form, approved mock intake command; repeated request identity known; mobile mid-range profile captured. On first request, backend commits but response is dropped; browser retries.

**Expected user outcome:** no fake order, one durable inquiry reference after reconciliation; allowed inputs preserved; accessible pending/success messaging. **Business proof:** exactly one logical intake; no duplicate sales notification effect if not intended; no founder retyping. **Failure:** two records, misleading success, infinite spinner, hidden resend danger.

### 20.2 Company A vs Company B account documents

**Setup:** Two distinct synthetic organization profiles, similar document IDs, Company A and B actors, inactive membership variant. Attempt UI deep link and direct API for every private document type.

**Expected:** Company A actor cannot read/approve B data and should not reliably enumerate B existence. **Business proof:** server/command permission denial; no bad caches or cross-account browser leaks. **Failure:** frontend hides button but API still returns B invoice or quote.

### 20.3 Provider payment completed after timeout

**Setup:** Merchant sandbox (only if approved and correctly isolated), one logical checkout payment request, an unknown client response, duplicate signed callback and replay.

**Expected:** retry reconciles original attempt, exactly one authorized economic effect, accurate pending then confirmed customer display, no fabricated settlement; customer support can trace issue. **Failure:** customer charged twice, paid-status from redirect, unreconciled ledger.

### 20.4 Accessibility focus and screen-reader error path

**Setup:** Custom form on a supported phone viewport plus desktop AT environment; force unsupported artwork, field error, modal guidance, and timeout.

**Expected:** focus stays meaningful; invalid field announced; typed non-sensitive context preserved within approved retention; Escape and focus return work; screen reader recognizes final result; no visual-only success or hidden CTA. **Failure:** form becomes unusable despite zero automated scanner violations.

### 20.5 AI/advanced custom tool unavailable

**Setup:** Block model endpoint, rich editor bundle, recommendation widget and analytics tracking; keep approved P0 paths online.

**Expected:** home/copy/service discovery and normal inquiry still function; honest fallback; no AI generated quote/production promise; lab trace records reduction/no catastrophic regression. **Failure:** entire website hangs while waiting for AI provider or editor.

### 20.6 Founder receives a false QC completion signal

**Setup:** Synthetic accepted custom order; vendor production job exists but QC inspection evidence absent. Trigger any proposed status notification.

**Expected:** no customer notification saying “QC passed” or “shipped”; proper blocker/next action is visible to authorized operator, physical evidence required. **Failure:** a timer, optimistic UI event, or AI message moves the order to completed state.

### 20.7 Pristine staging vs stale CI evidence

**Setup:** A proposed PR at known exact HEAD; separate old CI run passed previous SHA; current browser task was not executed; database target ambiguous.

**Expected:** CI and unsafe DB test remain NOT_VERIFIED/NOT_RUN; no “all green” or production release; fresh controlled proof or explicit blocked disposition. **Failure:** historical 100% pass and prose imply live readiness.

## 21. Evidence package template for future Head Engineering acceptance

Create one evidence report per approved work package / release candidate. Minimum fields:

```yaml
package_id: TBD_BY_ENGINEERING
release_slice: P0_ASSISTED_ENTRY
business_owner: TBD
reviewer_identity: TBD
repository: Rizkybuilds/bisnishub
base_sha: TBD
candidate_head_sha: TBD
candidate_diff_scope: TBD
risk_classification_source: docs/governance/cross-system-risk-classification.md
actual_risk_classification: NOT_CLASSIFIED
implementation_contract: NOT_CREATED
runtime_environment_identity: NOT_VERIFIED
production_access: NOT_AUTHORIZED
scope:
  included_customer_jobs: []
  excluded_customer_jobs: []
  parent_requirements: []
  source_of_truth_owners: []
verification:
  static_and_build: NOT_RUN
  domain_and_database: NOT_RUN
  browser_end_to_end: NOT_RUN
  accessibility_manual: NOT_RUN
  performance_lab: NOT_RUN
  performance_field: NOT_VERIFIED_FIELD
  security_independent: NOT_RUN
  provider_sandbox: NOT_APPLICABLE
  support_and_fallback: NOT_RUN
  production_recovery: NOT_RUN
  hosted_ci_required_checks: NOT_VERIFIED
findings:
  release_blocking: []
  non_blocking: []
  not_verified: []
decision:
  product_acceptance: NOT_GRANTED
  technical_merge_approval: NOT_GRANTED
  deployment_approval: NOT_GRANTED
  operational_acceptance: NOT_GRANTED
```

**Rules:** link to exact trace/CI/run URL, not a screenshot of an unsourced “green check”; attach date, environment identity, test cases and failures. Preserve actual skipped tests separately from tests passed. A reopened PR or changed HEAD requires scoped fresh assurance; unrelated previous pass counts must not be silently reused.

## 22. Recommended bounded handoff shape and stop conditions

When and only when the Owner authorizes engineering **planning** for a feature, Head Engineering should:

1. Restore fresh protected `main`, open PRs, canonical source map, active runtime and applicable governance.
2. Select one user-visible slice that removes a verified founder/customer bottleneck; **not the entire CX package**.
3. Check requirement ownership, security/finance/permission impact, dependencies and actual implementation source.
4. Draft bounded implementation contract with exact files/commands, test matrix and risk classification.
5. Obtain explicit owner implementation approval before assigning Antigravity.
6. Require exact-head independent QA/security assurance as risk mandates, including CX8-AC scenarios applicable to the slice.
7. Permit deployment only via separate approved release and readiness processes.

**STOP** if required architecture semantics or business-policy ownership are unresolved; if test environment isolation cannot be proven; if existing PR scope would be silently expanded; if cross-tenant/financial integrity cannot be verified; or if customer copy depends on a provider promise that is not supported. Document the stop, do not “keep shipping” under an attractive UI.

## 23. Self-review checklist, provenance and current verification status

| Item                                                                     | CX-08 author check                              | Current classification         |
| ------------------------------------------------------------------------ | ----------------------------------------------- | ------------------------------ |
| Identified customer/business goal and bounded quality dimensions         | Written                                         | `DRAFT_DEFINED`                |
| Reused CX-01..07 identifiers as inputs, without treating them as canon   | Reviewed selected companion documents           | `SELF_REVIEWED`                |
| Authoritative root documentation, MGBOS governance and roadmap consulted | Read-only at pinned revision                    | `SOURCE_REVIEWED`              |
| CWV thresholds checked against Google official guidance                  | URLs documented; p75, field/lab split explicit  | `EXTERNAL_STANDARD_REFERENCED` |
| WCAG 2.2 AA guidance checked against W3C                                 | URL and manual-review caveat documented         | `EXTERNAL_STANDARD_REFERENCED` |
| OWASP ASVS version/usage caveat                                          | Stable 5.0 external reference only              | `EXTERNAL_STANDARD_REFERENCED` |
| Protected actual TeeStock source inspected                               | Public app is placeholder in inspected snapshot | `READ_ONLY_SOURCE_INSPECTED`   |
| Test cases described                                                     | Candidate expected outcomes, no execution       | `SPECIFIED_NOT_RUN`            |
| Current Core Web Vitals field data                                       | No justified real-user data                     | `NOT_VERIFIED_FIELD`           |
| Actual customer UX/AT/device trials                                      | Not conducted                                   | `NOT_RUN`                      |
| Actual live provider sandbox/payment/marketplace                         | Not conducted                                   | `NOT_RUN`                      |
| Independent review of CX-08 and exact candidate code                     | Not conducted                                   | `NOT_VERIFIED`                 |
| Actual package status, product authority activation                      | Not submitted to owner for formal adoption      | `DRAFT`                        |
| GitHub changed, PR merged, deployment performed                          | None by this drafting activity                  | `NOT_PERFORMED`                |

**No evidence row above should be interpreted as an engineering test pass.** Content completeness/self-review is not independent QA. The QA audit for adopting the whole CX program remains a follow-on work package, not a task silently completed here.

## 24. Stable source register and relevant references

### 24.1 Repository documents, pinned at `main` revision shown in frontmatter

- `docs/governance/documentation-constitution.md` — lifecycle, authority and metadata.
- `docs/governance/canonical-source-map.md` — cross-system and product ownership routing.
- `docs/governance/cross-system-risk-classification.md` — sole R-class meanings; referenced by Engineering Control Plane.
- `docs/governance/evidence-provenance-model.md` — authoritative evidence model; referenced by Engineering Control Plane.
- `docs/engineering/engineering-ai-control-plane.md` — exact-revision evidence, independence, risk ownership.
- `docs/roadmaps/solo-founder-launch-roadmap.md` — controlled Custom/Business pilot and operational launch gates A–I.
- `systems/mgbos/docs/engineering/maintenance-policy.md` — actual maintenance, QA, security and environment constraints.
- `systems/mgbos/docs/implementation/README.md` — code QA and product-to-implementation gate.
- `systems/mgbos/docs/architecture/business-invariants.md` — deterministic critical truth and test ownership.
- `systems/mgbos/docs/architecture/permission-authorization-model.md` — actor, scope, organization and permission testing.
- `systems/mgbos/docs/architecture/command-event-model.md` — command identity, replay, event/outbox maturity and external signal controls.
- `bisnis/teestock/02-brand/brand-identity-system.md` — brand character and visual hierarchy.
- `bisnis/teestock/02-brand/voice-and-copy-system.md` — language and tone.
- `bisnis/teestock/10-product-tech/website-information-architecture.md` — mobile, performance and accessibility intention.
- `bisnis/teestock/12-legal-ip/customer-commerce-policy.md` — customer-facing transaction and legal business policy.
- `systems/mgbos/apps/teestock/src/app/page.tsx` — observed public shell, not a completed customer store.

Repository reference: https://github.com/Rizkybuilds/bisnishub/tree/2800c474563309bda49d84d712f79b68c9dde36a

### 24.2 External standards, reference scope only

1. **Google web.dev** — [How Core Web Vitals metric thresholds were defined](https://web.dev/articles/defining-core-web-vitals-thresholds/). Distinguishes LCP/INP/CLS thresholds and p75. Never use outdated FID in place of INP.
2. **Google web.dev** — [Web Vitals](https://web.dev/articles/vitals). Field/mobile/desktop measurement direction.
3. **W3C** — [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Testable A/AA conformance framework and full-page requirement.
4. **W3C WAI** — [What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/). Relevant newer focus, target-size and input/error criteria.
5. **OWASP** — [ASVS v5.0.0 stable release](https://github.com/OWASP/ASVS/releases/tag/v5.0.0). Security assurance mapping reference, not an independent approval.

### 24.3 Companion draft reading order

`CX-00 → CX-01 → CX-02 → CX-03 → CX-04 → CX-05 → CX-06 → CX-07 → CX-08 (this) → CX-09 → package README and proposed repository routing reconciliation`.

## 25. Final CX-08 disposition and next work

**Document:** `DRAFT_COMPLETE_FOR_INTERNAL_PRODUCT_REVIEW`.

**Current product readiness:** `NOT_VERIFIED`, because public customer experience, financial checkout, portal, provider integration, mobile field metrics and independent accessibility tests are not proven in this scoped inspection.

**Authority:** `NONE_UNTIL_OWNER_APPROVAL_AND_CANONICAL_ROUTING`.

**Engineering handoff:** `NOT_AUTHORIZED`.

**Merge, deployment, production access:** `NONE`.

**Next product artifact:** **CX-09 — Phased Delivery & Product Validation Plan.** Reconcile approved P0 assisted/customer-quality definition with the actual Q4 2026 roadmap and MGBOS security/operating gates, identify the **smallest next bounded slice**, ensure realistic founder/capital constraints, and define decision points for P1/P2 without inventing schedules or provider readiness.

**After CX-09:** execute a separate whole-package editorial/canonicalization audit (`CX-00..09`), confirm path and README routing after PR #73, remove any duplicate authority, resolve material Owner decisions, and only then deliver a scoped engineering planning proposal to Head Engineering. Do not ask Antigravity to “implement CX-01..09” in one pass.

---

## Remediation R1 — explicit master requirement trace (generated draft, non-authoritative)

The rows below are generated from `CX-PKG-TRACE-R1.csv` (the sole package-wide mapping table). They do not introduce additional product requirements, approve a release stage, change any domain/architecture policy, or prove acceptance. Only exact locally declared IDs are linked; review the complete matrix for gates, ambiguities and candidate staging.

| CX-01 master ID | Exact declared detail IDs in this document | Selected existing acceptance             | Candidate slice |
| :-------------- | :----------------------------------------- | :--------------------------------------- | :-------------- |
| `CX1-FR-001`    | `CX8-QR-002`                               | `CX8-AC-001`                             | `CX-S0`         |
| `CX1-FR-003`    | `CX8-QR-002`                               | `CX5-AC-001`, `CX8-AC-001`               | `CX-S0`         |
| `CX1-FR-005`    | `CX8-QR-010`, `CX8-QR-012`                 | `CX8-AC-003`                             | `CX-S0`         |
| `CX1-FR-008`    | `CX8-QR-007`                               | `CX8-AC-012`                             | `CX-S3`         |
| `CX1-FR-011`    | `CX8-QR-027`                               | `CX5-AC-002`, `CX8-AC-028`               | `CX-S0`         |
| `CX1-FR-027`    | `CX8-QR-022`                               | `CX4-AC-010`                             | `CX-S1`         |
| `CX1-FR-030`    | `CX8-QR-025`                               | `CX6-AC-001`, `CX6-AC-003`, `CX8-AC-030` | `CX-S0`         |
| `CX1-FR-038`    | `CX8-QR-038`                               | `CX5-AC-011`, `CX8-AC-005`               | `CX-S0`         |
| `CX1-FR-039`    | `CX8-QR-039`                               | `CX5-AC-016`                             | `CX-S0`         |
| `CX1-FR-043`    | `CX8-QR-032`                               | `CX6-AC-043`                             | `CX-S3`         |
| `CX1-FR-044`    | `CX8-QR-046`                               | `CX6-AC-044`                             | `CX-S2`         |
