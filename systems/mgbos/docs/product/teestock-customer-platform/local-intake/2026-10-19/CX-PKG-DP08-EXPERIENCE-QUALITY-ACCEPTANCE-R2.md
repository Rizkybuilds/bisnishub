---
canonical_id: proposed.mgbos.product.teestock-customer-platform.dp08-experience-quality-acceptance-r2
status: DRAFT
version: 0.2.0
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: PENDING_OWNER_AND_INDEPENDENT_PRODUCT_QA
scope: teestock-customer-platform-cx08-experience-quality-acceptance-deepening
product_program: PROPOSED_TEESTOCK_CUSTOMER_EXPERIENCE_COMMERCE
document_class: product-quality-research-and-change-proposal
normative_authority: NONE
engineering_readiness: NOT_ASSESSED
implementation_status: PRODUCT_DEFINITION_ONLY
repository: Rizkybuilds/bisnishub
source_ref: main
source_baseline_commit: 57eaafbb0ceef99a5fc6b2d77d724f6ff510727d
source_cx08_blob_sha: 96ea99276255189a12fe59084f94f91337b5062d
source_cx09_blob_sha: d0985bf8873c6c0e4086147cd989b783a5b30274
source_cx_trace_blob_sha: e1be5560b99c8b045eb11cbb0b128b1ec0cafa61
source_public_home_blob_sha: baf9b0a82e5c9590855da9f62d354a16b1dad48b
source_support_contact_blob_sha: 2843335b1f78e4a6b42af9f150269f4f7f7e34b2
source_teestock_package_blob_sha: 6e5c31b200a199ea0842a81108b405550ec4c996
baseline_checked: 2026-10-17
proposed_destination: systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DP08-EXPERIENCE-QUALITY-ACCEPTANCE-R2.md
self_review: PERFORMED
independent_review: NOT_PERFORMED
customer_research: NOT_PERFORMED
browser_test_execution: NOT_PERFORMED
performance_field_measurement: NOT_VERIFIED_FIELD
performance_lab_measurement: NOT_PERFORMED
security_test_execution: NOT_PERFORMED
provider_live_assurance: NOT_PERFORMED
local_companion_state: OWNER_COPYING_LOCALLY_NOT_CONFIRMED_IN_GITHUB_MAIN
implementation_authorization: NONE
merge_authorization: NONE
deployment_authorization: NONE
production_access_authorization: NONE
supersedes: null
depends_on:
  - docs/governance/documentation-constitution.md
  - docs/governance/canonical-source-map.md
  - docs/governance/cross-system-risk-classification.md
  - docs/governance/evidence-provenance-model.md
  - docs/engineering/engineering-ai-control-plane.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - systems/mgbos/docs/product/teestock-operational-pilot-plan.md
  - systems/mgbos/docs/architecture/business-invariants.md
  - systems/mgbos/docs/architecture/permission-authorization-model.md
  - bisnis/teestock/12-legal-ip/customer-commerce-policy.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-04-commerce-checkout-experience.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-05-custom-b2b-ordering-experience.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-06-customer-account-service-experience.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-07-omnichannel-external-integration-requirements.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md
  - systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-TRACE-R1.csv
  - systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-DECISIONS-R1.md
---

# DP-08 — TeeStock Experience Quality & Acceptance Deepening R2

**Disposition:** `COPY_READY / AUTHOR_SELF_REVIEWED / DRAFT / NON-CANONICAL`.

**Document intent:** This is a complete, bounded *quality evidence and acceptance deepening proposal* to be reconciled into [CX-08 — Experience Quality & Acceptance Contract v0.1.1](cx-08-experience-quality-acceptance-contract.md) through a separate governed documentation change. It is **not** a duplicate canonical quality standard, a technical test implementation plan, a passed audit, or authorization to build, merge, deploy, use real payments, or access production.

**North star:** **Powerful underneath, effortless on the surface—and demonstrably so.**

**Quality is a customer-and-operator outcome.** A beautiful screen fails if the order is duplicated, the user cannot navigate by keyboard, a false payment success is displayed, or the founder must reconstruct every inquiry manually. Conversely, a correct backend does not prove good UX.

**Preservation guarantee:** The existing CX-08 `CX8-QD-01..10`, `CX8-QR-001..048`, `CX8-BR-001..024`, `CX8-AC-001..048`, and `CX8-GATE-A..F` are retained as the original DRAFT source. This proposal uses **new `DP08-*` IDs** only; it neither renumbers nor authorizes replacement of existing IDs.

---

## 0. Executive Quality Decision Contract

### 0.1 The six questions this program must prove

1. **Comprehension:** Can the customer determine the legitimate next action and its implications?
2. **Accessibility:** Can customers complete that action on representative mobile devices, with keyboard and appropriate assistive technologies?
3. **Performance:** Does the task feel responsive and stable on representative conditions, while advanced features remain isolated?
4. **Truth:** Does every promise, acceptance, payment, proof, production or shipping status correspond to authorized evidence?
5. **Recovery:** After invalid input, timeout, reconnection, stale data or provider outage, can the task continue without a false result or duplicate effect?
6. **Founder leverage:** Does a legitimate customer action create a durable, actionable handoff without transferring avoidable clerical work to the owner?

Every feature has both a **positive path** and a **negative/failure path**. A polished happy path cannot compensate for a dangerous negative path.

### 0.2 Definitions of status (never conflate them)

| Status | Meaning | Required discipline |
| --- | --- | --- |
| `SPECIFIED` | Acceptance statement exists | No runtime outcome implied |
| `NOT_APPLICABLE_TO_SLICE` | Feature excluded by current approved release scope | Explicit decision and release-scope evidence required |
| `NOT_RUN` | Test expected but not executed | Cannot be called PASS |
| `BLOCKED` | Test could not execute due to missing dependency/environment | Blocker and owner recorded |
| `NOT_VERIFIED` | Evidence is insufficient or cannot be authenticated/reproduced | Never silently converted to PASS |
| `NOT_VERIFIED_FIELD` | Real-user field data absent or too limited | Lab data may still support a separately approved pre-launch gate |
| `FAIL` | Reproducible nonconformance against scoped acceptance | Finding, severity, remediation |
| `PASS` | Executed in declared context with sufficient linked evidence | Bound to exact scope, build, environment, tester and test case |
| `WAIVED_NON_BLOCKING` | Scoped exception approved under existing authority | Not permitted for hard invariants; expiry and owner mandatory |

**Avoid vanity QA:** A list with 48 `SPECIFIED` cases is not a report that 48 tests passed. A green CI check may show that only a source/lint subset ran. A screenshot is not evidence of authorization or financial effects.

### 0.3 Who can decide what

- **Owner / Product:** customer outcomes, accepted product scope, business trade-offs and release business acceptance.
- **CX-08 proposed semantic owner:** testable customer quality outcomes, quality reporting language and product acceptance candidates.
- **MGBOS canonical architecture / Finance / Security:** transaction, identity, organization isolation, money, fulfillment and approval invariants.
- **Head Engineering:** actual engineering requirements, risk classification, feasible budgets, CI coverage, executable QA plans and technical assurance routing.
- **Independent QA / accessibility / security reviewers:** evidence-based assessment under the authorized review scope.
- **Antigravity:** bounded implementation or documentation-integration work only after a suitable approved handoff.

CX-08 cannot overrule a security or money gate to improve a UX score.

## 1. Repository Baseline, Evidence, and Non-Duplication

### 1.1 Exactly what was inspected

- GitHub repository: `Rizkybuilds/bisnishub`, `main` commit `57eaafbb0ceef99a5fc6b2d77d724f6ff510727d`, inspected 2026-10-17.
- CX-08 proposed source blob: `96ea99276255189a12fe59084f94f91337b5062d` (v0.1.1, DRAFT).
- Companion: CX-01, CX-02, CX-03, CX-04, CX-05, CX-06, CX-07, CX-09, `CX-PKG-TRACE-R1.csv`, and package governance references.
- Public TeeStock source sample: `systems/mgbos/apps/teestock/src/app/page.tsx`, `/custom/page.tsx`, `/business/page.tsx`, `/support/contact/page.tsx`, `layout.tsx`, `package.json`.
- `package.json` contains build, `typecheck` and a focused Vitest route test script. Their declaration **does not prove** that tests ran successfully, what CI requires, or that full browser/QA assurance exists.
- The observed P0 customer-facing pages are an informative public-entry shell. The support/contact page explicitly states that official contact channels are **not yet operationally activated for public use**. No live customer intake, retail checkout, payment provider, customer portal, or provider-connected runtime is established from this source inspection.
- DP-01..DP-07 have been delivered as local-copy artifacts in the conversation and **were not found on inspected `main`**. They are **local draft inputs**, not repository authority. Do not manufacture GitHub hyperlinks or say they were merged.

**Scope limitation:** This is a focused product and source inspection, **not** a complete monorepo audit, live deployment observation, executable test run, or production capability confirmation. Source files can change after this SHA; future Head Engineering work must re-read exact current HEAD.

### 1.2 Semantic ownership: one source per fact

| Concern | Existing authority | This DP-08 adds |
| --- | --- | --- |
| Brand and interaction | TeeStock business Brand, CX-03 | Measurable visual/comprehension checks, not a replacement brand |
| Product scope and stages | CX-01 and CX-09, subject to roadmap | Quality applicability matrix per approved slice |
| Customer journeys | CX-02, CX-04..07 | Evidence/test cases for declared journeys |
| Money, order, payment, stock | MGBOS + canonical TeeStock commercial policies | Customer-visible correctness and negative acceptance |
| Identity, data and security | MGBOS authorization/security owners | Required cross-user/cross-org negative outcomes |
| CI, infrastructure and deployments | Engineering governance, Head Engineering | Evidence packet that those authorities must evaluate |
| Operational work/pilot | Solo-founder roadmap and operational pilot | Admin-touch and physical-handoff acceptance |

### 1.3 Safe handling of local drafts

Because Owner is copying documentation locally, this file may coexist on disk with DP-01..07 without requiring any GitHub mutation. Do not update CX-08 existing, its trace CSV, or README solely to link this draft. A later bounded integration PR should adopt only reconciled deltas and verify that the other drafts were actually committed before creating references to them.

---

## 2. Release Slice Quality Applicability and Critical Journey Registry

**`P0/P1/P2` are proposal priorities; `CX-S0..S3` are customer platform slices.** Neither replaces the separate real Custom/Business operational pilot. A missing future P2 editor is not a P0 failure. A fake P0 contact CTA *is* a P0 customer-trust failure if published as working.

| Slice | Quality scope that applies when activated | Explicitly not presumed ready |
| --- | --- | --- |
| `CX-S0` | Public Home, Custom/Business information, accessible navigation, truthful feature states, applicable real assisted channel; intake/reception only if it is actually implemented and approved | Retail cart/checkout, public paid order, account portal, marketplace API, advanced AI |
| `CX-S1` | Approved sellable catalog, PDP, cart, checkout/payment, actual order visibility and security gates **for released subfeatures only** | Full B2B account, universal fulfillment, AI builder |
| `CX-S2` | Eligible account self-service, quote/proof/returns and selected channel integrations where each dependency is approved | Unsupported partner capabilities and unrestricted account roles |
| `CX-S3` | Eligible advanced builder, personalization, AI; mandatory proof that S0/S1/S2 protected routes do not regress | Automatic self-sufficiency, unrestricted financial or production AI autonomy |

### 2.1 Critical customer journeys (inherit `CJ-01..12` from CX-08)

| Source journey | Customer proof required | Applicable source requirements | Release activation |
| --- | --- | --- | --- |
| `CJ-01` Find a valid offer | Identify active path with one legitimate next action | `CX8-QR-002/009/014` | S0 |
| `CJ-02` Custom intake | Valid guided intake and correct validation behavior | `CX8-QR-010/011/017/038` | S0 **only when intake genuinely enabled** |
| `CJ-03` Business inquiry | Distinguish request, quotation, company authority | `CX8-QR-017/019/025` | S0 assisted / later portal |
| `CJ-04` Honest receipt | Backend durable receipt matches presented reference | `CX8-QR-017/034/035` | When public write enabled |
| `CJ-05` Help and recovery | Timeout, unsupported channel, human route truth | `CX8-QR-033/040` | S0 |
| `CJ-06` Product/price | Actual published SKU, variant, offer and current eligibility | `CX8-QR-004/020` | S1 |
| `CJ-07` Checkout/payment | One intended effect, correct amount and verifiable financial status | `CX8-QR-020/021/034` | S1, finance security gate |
| `CJ-08` Account/approval | Scoped access and exact-version approvals | `CX8-QR-025/026/029` | S2 or narrower approved P1 feature |
| `CJ-09` Tracking/returns | Source-backed milestones and legitimate remedy route | `CX8-QR-022/023/037` | S1/S2 as enabled |
| `CJ-10` Channel handoff | Source attribution, identity safety, owned recovery | `CX8-QR-031/036/037` | S2 |
| `CJ-11` Advanced editor | Configuration eligibility + non-critical-path loading | `CX8-QR-007/016` | S3 |
| `CJ-12` Optional AI | Grounded explanations, denied unauthorized actions, human route | `CX8-QR-032/003` | Only if authorized |

### 2.2 Page template coverage registry

| Template | Needed state coverage | First eligible scope | Quality proof |
| --- | --- | --- | --- |
| Home/offer router | initial, active/unavailable service, missing media, menu open, deep link | S0 | Mobile task + lab + keyboard |
| Custom/Business content | service constraints, copy, CTA activation status, support route | S0 | comprehension, accessibility, truthful offer review |
| Real request form (if enabled) | pristine, partial, validation, submitting, success, timeout-unknown, rejected, network loss | Conditional S0 | browser + approved backend evidence; server idempotency |
| Shop/catalog | loaded, no results, fetch unavailable, invalid filtered item, sold out | S1 | search task + source data + responsive metrics |
| Product detail | variant, size, stock unknown, price changed, media failure | S1 | browser/product truth/AT |
| Cart/checkout | empty, stale, no stock, price changed, provider pending, duplicate click, retry | S1 | full financial and security gate |
| Customer portal | login, guest verification, own data, no data, unavailable, wrong actor, stale | S1/S2 | authorization negatives + AT |
| Quote/proof | current version, outdated, unauthorized, approved/not accepted | S2 | version integrity + scoped permission |
| Support/return | request received, being reviewed, evidence required, genuinely resolved | S0 assisted/S2 portal | policy truth + case ownership |
| Integrations/advanced | provider delayed, quota, mismatch, AI/editor disabled | S2/S3 | fault injection + non-regression |

**Activation rule:** Quality must be evaluated against the capabilities that a candidate actually claims to release, not hypothetical files or routes in the future roadmap.

## 3. Quality Model and Defect Severity

The 10 existing dimensions `CX8-QD-01..10` remain the primary taxonomy: clarity, speed, accessibility, commercial integrity, privacy/security, recovery, operational transfer, sustainability, trust/transparency, and observability.

### 3.1 Defect severity is not the engineering R-class

| Product severity | Example | Default disposition proposal |
| --- | --- | --- |
| `BLOCKER` | Wrong customer invoice revealed; duplicate paid effect; false paid/production confirmation; inaccessible sole purchase action; accepted write loses data | Stop affected release; canonical engineering/security owner determines risk classification and required assurance |
| `MAJOR` | Critical journey consistently fails on supported mobile; user cannot recover from stale offer; missing legitimate support escalation | Remediate before acceptance unless authoritative exception route explicitly permits otherwise |
| `MINOR` | Nonessential layout inconsistency with a valid alternative and no material user task obstruction | May be recorded as bounded non-blocking backlog item after review |
| `OBSERVATION` | Usability improvement hypothesis without demonstrated task harm | Route to product research, not falsely mark as failure |

The exact security/financial risk code belongs to BisnisHub's risk classification; this table is **not** a parallel R0–R5 system.

### 3.2 Acceptance artifacts per case

Each candidate test must carry: `case_id`, `requirement_id(s)`, `release_slice`, `feature_flag/config`, `actor`, `preconditions`, `synthetic_fixture`, `action`, `expected_visible_result`, `expected_authoritative_result`, `negative_variant`, `method`, `environment_identity`, `commit_sha`, `test_revision`, `execution_timestamp`, `evidence_uris`, `actual_result`, `status`, `tester`, `reviewer`, `limitations`.

A case with no authoritative backend assertion must **not** claim a durable money, order, support case, or approval effect. A case with only backend assertions must not claim accessible mobile UX.

---

## 4. Performance Evidence Contract: Fast by Measurement

### 4.1 Core Web Vitals (official public standards, proposed adoption)

| Field metric | Good threshold | Evaluation |
| --- | --- | --- |
| Largest Contentful Paint (`LCP`) | ≤ 2.5 seconds | p75 real page visits; loading |
| Interaction to Next Paint (`INP`) | ≤ 200 milliseconds | p75 real user interaction experience; responsiveness |
| Cumulative Layout Shift (`CLS`) | ≤ 0.1 | p75 real page visits; visual stability |

Use **mobile and desktop separately**. Where traffic supports it, report per page template, device class and meaningful customer path. Source: https://web.dev/articles/vitals . Do not cherry-pick one fast homepage to assert checkout is good. Report collection period, sample count, traffic source limitations, RUM instrumentation coverage and threshold interpretation.

**Absolute prohibition:** `Lighthouse performance 95`, laboratory TBT, and desktop synthetic INP are **not interchangeable with p75 field INP**. Field data requires genuine user page visits/interactions. Lab traces diagnose and protect releases before valid field volume exists, but never become fake `FIELD_PASS`. See https://web.dev/articles/lab-and-field-data-differences and https://web.dev/articles/inp .

### 4.2 Pre-launch evidence: reproducible lab, not fake field data

For every activated template declare:

- Exact tested URL/build revision and production-like configuration; implementation/test commit and deployment identity.
- Browser and OS versions, device/emulator versus real hardware, viewport, DPR, locale/timezone and supported assistive setup.
- Throttled and unthrottled network/CPU conditions; warm and cold cache; offline/slow response variants.
- Page and user state; realistic synthetic product photos and content, not tiny placeholders that hide costs.
- Repeat count, summary statistic and individual-run variance; LCP element, CLS contributors, trace/waterfall and slow interactions.
- Critical route interactions, including validation, menu, variant selection, quote/proof, return/checkout (where enabled), not just first render.
- Regressions against a comparable approved pre-change reference build; explain test environment drift.

**Baseline-first principle:** Specific transferred JS/CSS bytes, CPU main-thread cost, image size limits, memory limits and lab elapsed-time thresholds are **`TBD_BASELINE`** pending an actual representative implementation and Head Engineering/QA profiling. Neither zero nor a guessed number qualifies as a real budget.

### 4.3 Budget approval worksheet (to populate from evidence)

| Template | Realistic test setup | Proposed enforceable JS/CSS/CPU/media budget | Current evidence | Required decision |
| --- | --- | --- | --- | --- |
| Home | Mid-range mobile + representative content | `TBD_BASELINE` | `NOT_MEASURED` | Frontend/Head Engineering |
| Custom/Business | Full active mobile path and conditional inputs | `TBD_BASELINE` | `NOT_MEASURED` | Frontend/Head Engineering |
| Product listing/PDP | Published SKU cohort, image variants | `TBD_BASELINE` | `NOT_APPLICABLE_TO_S0` | Pre-S1 release |
| Checkout | Eligible cart, real provider sandbox only after approval | `TBD_BASELINE` | `NOT_APPLICABLE_TO_S0` | Pre-S1 + financial gate |
| Customer portal | Correct authorized synthetic personal/B2B context | `TBD_BASELINE` | `NOT_APPLICABLE_TO_S0` | Before account release |
| Advanced editor/AI | Real optional bundle, third-party disabled variant | `TBD_BASELINE` | `NOT_APPLICABLE_TO_S0` | Before S3 |

### 4.4 Non-regression/asset guardrails

1. Standard Home, Custom, Business and support pages must **not** download editor engines, AI orchestration SDK, account workspace code or payment SDK merely to render a simple CTA.
2. Prioritize true LCP images; use measured/responsive asset sizes. Defer nonessential below-the-fold media, not likely LCP assets.
3. Fonts have readable fallback and predictable layout; content remains usable when font CDN fails.
4. Third-party scripts have a purpose, owner, privacy approval, cost and failure plan.
5. Compare protected S0/S1 route budgets before accepting an S2/S3 feature; review any material regressions, including INP-related interactions.
6. False stock/price promises cannot be hidden behind a fast cached page. Cache correctness and privacy take priority.
7. Rendering should tolerate missing assets, device rotation, narrow layouts, viewport zoom, reduced motion and longer translated text.
8. Media or AI unavailability must not prevent a legitimate standard inquiry or customer navigation.

### 4.5 Performance disposition examples

- `S0 Home` lab trace exists, field traffic absent: **`LAB_REVIEWED`, `NOT_VERIFIED_FIELD`**. Product prelaunch may proceed only if all applicable approved gates allow it.
- `S1 Checkout` not built: **`NOT_APPLICABLE_TO_S0`**, not FAIL and not PASS.
- `S1 Checkout` built but no actual browser/performance evidence: **`NOT_RUN/BLOCKED`**, cannot report launch ready.
- `S3 Editor` increases S0 LCP beyond an approved guardrail: **regression finding**, feature cannot inherit approval automatically.

---

## 5. Accessibility & Inclusive UX Evidence Contract

### 5.1 Proposed scope of conformance target

Target **WCAG 2.2 Level AA** for every released and controlled customer task, **including error, pending, authentication, quote approval, checkout and recovery states**, where applicable. Reference: https://www.w3.org/TR/WCAG22/ . This draft **does not certify WCAG conformance**. Third-party payment/identity components must be assessed within the actually supported flow and assigned owners for findings.

A scanner (`axe`, Lighthouse, or similar) provides **partial evidence**. Combine it with manual keyboard testing, assistive technology, real-device checks, text resize/reflow and UX task tests. Source: https://playwright.dev/docs/accessibility-testing .

### 5.2 User-critical accessibility matrix

| Category | Must demonstrate | Evidence |
| --- | --- | --- |
| Navigation | Skip link, discernible focus, accessible menu, semantic landmarks, correct heading order | Keyboard trace, screen reader navigation |
| Forms | Labels, help, required/optional, error announcement, correction without retyping unrelated fields | Keyboard, AT, negative validation |
| Status & live updates | Receipt/pending/unknown announced without depending on color, timer, or toast alone | AT live-announcement check |
| Overlays | Dialog name, initial focus, escape when appropriate, focus return and no background focus leak | Modal/task keyboard recording |
| Mobile | Screen width/reflow, 200% text resize, virtual keyboard, sticky CTA does not cover focused field | Physical/declared emulated device |
| Motion | `prefers-reduced-motion`, content comprehensible without animation | OS preference test |
| Touch | Relevant WCAG 2.2 2.5.8 target-size minimum or one of its exceptions; high-frequency buttons may prefer approx. 44 CSS px | Target/spacing examination plus manual touch |
| Dragging | Single-pointer non-drag alternative for functionality under WCAG 2.5.7 as applicable | Editor/slider alternative task |
| Authentication | Accessible authentication and recovery without unjustified cognitive barriers | Auth task with relevant SC 3.3.8 |
| Financial/important approval | Review/confirm/correct or otherwise meet relevant SC 3.3.4 options | Checkout/quote/proof transaction rehearsal |
| Customer support | Human route, contact info and issue submission not gated by inaccessible chat widget | Keyboard/AT and no-AI test |

**Accuracy note:** WCAG 2.2 AA SC 2.5.8 specifies **24×24 CSS pixels with defined exceptions**; a 44×44 target is a product-design preference for frequent touch actions and not a blanket WCAG AA rule. Reference: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum .

### 5.3 Required actual test context

The future accessibility reviewer must record the tested browser/version, OS, screen reader/version, input method, viewport and individual criteria. At minimum propose a keyboard-only desktop pass and a representative screen reader/browser combination; expand based on actual customer mix, technology and risk. Do not invent an unreviewed mandatory brand/device pairing that nobody can execute.

Mark each applicable criterion/test as `PASS`, `FAIL`, `NOT_RUN`, `NOT_APPLICABLE_WITH_RATIONALE`, or `NOT_VERIFIED`; automated clean results cannot produce an unconditional sitewide AA claim.

---

## 6. Usability Research, Content Truth & Founder-Effort Evidence

### 6.1 Research design

Separate synthetic internal walkthroughs (good for logic) from customer research (necessary for claims about understanding and human behavior). Use neutral tasks without telling participants which menu or CTA to click. Obtain appropriate participant consent, minimize sensitive data, and store recordings outside public GitHub unless explicitly sanitized and approved.

| Task ID | Persona/task | Success evidence | Anti-goal |
| --- | --- | --- | --- |
| `DP08-UT-01` | First-time mobile visitor wants personalized shirts | Finds Custom route and understands whether inquiry can actually be sent | Misreads preparatory content as an active order |
| `DP08-UT-02` | B2B buyer needs uniforms and a quote | Identifies Business entry, request-vs-offer distinction and missing details | Assumes instant firm quote |
| `DP08-UT-03` | Visitor wants retail stock that is not activated | Recognizes truthful unavailable state and allowed next step | Tries fake checkout |
| `DP08-UT-04` | Visitor has no artwork | Finds legitimate help/assisted alternative | Blocked by mandatory upload |
| `DP08-UT-05` | Customer corrects a long form | Fixes one error without rebuilding safe inputs | Loses valid answers |
| `DP08-UT-06` | Customer's submitted request times out | Correctly understands unknown outcome and safe next action | Duplicates accepted request |
| `DP08-UT-07` | Retail customer encounters stock/price change | Understands difference and can reconfirm or exit | Charged unexpectedly |
| `DP08-UT-08` | Customer returns from payment provider | Distinguishes pending versus actually paid | False positive payment understanding |
| `DP08-UT-09` | B2B approver reads new quote/proof version | Recognizes exact version and authorized action | Approves old terms or confuses proof and quote |
| `DP08-UT-10` | Customer reports a defect | Can submit a claim and understand review vs refund | Believes complaint means refund paid |
| `DP08-UT-11` | Returning customer asks shipment status | Recognizes last verified fact, stale data and help route | Label mistaken for dispatch |
| `DP08-UT-12` | Founder handles Custom request with vendor | Finds all structured inputs, owner and physical tasks without retyping | Starts unauthorized production from a mockup |

**For each study:** record `study_id`, `tested_revision`, target cohort, actual recruitment method, tasks, environment/devices, sample size, task completion, unprompted understanding, errors, recovery attempts, measured time, help usage, sensitive-data handling, findings and limits. No fabricated conversion rate or sample success rate.

### 6.2 No fixed research threshold without basis

This proposal requires *observation and prioritization*. The numeric acceptable task completion, comprehension, mistake and dropout thresholds should be proposed after initial representative pilots and approved through CX-09/Owner. Do not promote invented `95% success` to canonical acceptance before real research.

### 6.3 Founder operational burden

| Outcome | Proposed method | Avoid false interpretation |
| --- | --- | --- |
| Accepted request handoff | Compare accepted customer submission against governed internal lead/requirement view | Notification received does not equal internal accepted item |
| Manual transcription touches | Count each field re-entry, copied chat summary and repeated lookup per actual transaction | AI-generated summary alone is not saved effort |
| Physical workload | Record vendor sourcing, production coordination, QC, packing and carrier handoff separately | Physical task cannot be assumed automated |
| Repeat inquiry/support burden | Measure substantive follow-up contacts and reasons, not raw ticket count alone | Reduced messages can hide unreachable support |
| Cost-to-serve | Include vendor API/inference costs, notification costs, exception handling and support time | Cheap tokens alone do not prove viable automation |
| Correct promises | Audit actual quote date/price/stock/status statements | Faster response with false commitment is a regression |

**No actual founder savings are claimed by this document.** The existing operational pilot has its own real-transaction gates; CX-08 does not replace them.

## 7. Financial Truth, Security, Identity & Privacy Quality Gates

### 7.1 Mandatory negative tests when the applicable feature is released

| Domain | Required negative outcome | Authoritative source required |
| --- | --- | --- |
| Customer intake | Duplicate click or response timeout cannot create uncontrolled duplicate accepted lead/requirement | Governed intake command and durable receipt |
| Retail purchase | Two competing buyers of the last item cannot both obtain invalid stock commitments | Canonical inventory/order reservation rules |
| Checkout | Changed total or shipment cost must be presented for appropriate reconfirmation | Approved pricing/fulfillment authority |
| Payment | Browser redirect alone does not mark paid; duplicate webhook cannot multiply effects | Financial/payment command, provider evidence and ledger invariants |
| Payment unknown | Outcome is reconciled before any risky second charge | Idempotency and payment status source |
| Account | Wrong customer, organization, expired/revoked role or guessed link cannot read private objects | MGBOS resource/tenant authorization |
| Proof/quote | Version superseded or actor unauthorized cannot approve later/other object | Exact-version, actor and approval evidence |
| Files/artwork | Untrusted active content, MIME mismatch and cross-actor file references denied | Approved secure upload/processing + IP policy |
| Return/refund | Complaint or request does not create automatic refund/cancellation | TeeStock legal/return policy and financial authority |
| Fulfillment | Generated label or elapsed time cannot imply dispatched/delivered | Physical handoff/carrier evidence |
| Marketplace | Duplicate/wrong seller/source ID cannot create duplicate or cross-org order | Provider proof, source mapping and MGBOS invariants |
| AI | Prompting cannot bypass resource scopes, approve discount/refund or invent delivery commitment | JARVIS tool policy + deterministic backend authorization |

**Hard stop:** Do not execute destructive or financial negative tests against any existing database merely because a reviewer labels it staging. Isolation must be verified as disposable and authorized; real-money/provider operations require separately scoped explicit approval. No production credentials, genuine customer data or live side effects are allowed by this document.

### 7.2 UI state truth taxonomy

| Customer-visible state | Allowed after | Must not imply |
| --- | --- | --- |
| `Sedang diproses` | Local asynchronous action started | Accepted business effect |
| `Permintaan diterima` | Durable accepted intake reference from authorized source | Quote issued/order placed/payment received |
| `Belum dapat dikonfirmasi` | Outcome truly unknown or verification source unavailable | Success or definite failure |
| `Penawaran resmi diterbitkan` | Approved versioned quote actually available to recipient | Order accepted |
| `Desain diterima untuk diperiksa` | File receipt verified | Safe/print-ready/proof accepted |
| `Pratinjau desain` | Non-authoritative customer visual depiction | Guaranteed printed colors/placement |
| `Desain disetujui` | Current scoped proof accepted by authorized actor | Payment satisfied or production released |
| `Pembayaran terverifikasi` | Canonical verified financial evidence | Shipment already dispatched |
| `Label pengiriman dibuat` | Authorized label created | Parcel handed to carrier |
| `Diserahkan ke kurir` | Verified physical custody handoff | Delivered |
| `Permintaan retur diterima` | Legitimate return inquiry accepted | Return approved/refund settled |

These are **illustrative copy patterns**, not new MGBOS entity states or authorized terms; CX-03/04/05/06 and business owner must reconcile final vocabulary.

### 7.3 Privacy and confidentiality evidence

Test public URLs, deep links, browser referrers, service logs, web analytics, error monitoring, notification templates, downloadable PDFs/files, cache on shared devices, session switching and external provider payloads. Privileged data must not leak merely because UI has hidden a button. Separate authentication, organization membership, capability, and resource-level authorization checks. Deny-by-default semantics belong to canonical MGBOS authorization.

---

## 8. Failure, Recovery and Operational Resilience

| Failure ID | Trigger | Customer experience contract | Operator evidence |
| --- | --- | --- | --- |
| `DP08-FAIL-01` | Content/image/font failure | Meaningful copy and CTA survive; layout stays comprehensible | Asset and render trace |
| `DP08-FAIL-02` | Network offline during form | Preserve safe fields as policy allows; no fictitious receipt | Submission correlation and stored outcome |
| `DP08-FAIL-03` | Timeout after request accepted | Show uncertain state until authoritative lookup; safe idempotent recovery | Durable request and deduplicated attempt evidence |
| `DP08-FAIL-04` | Backend returns 5xx for history | `Tidak dapat memuat` or comparable uncertainty, not `Tidak ada pesanan` | Fetch failure logged without PII leakage |
| `DP08-FAIL-05` | Session expired or user revoked | Scoped denial and useful re-auth/recovery; remove stale privileged view | Server resource denial |
| `DP08-FAIL-06` | Quote/artwork version superseded | Prompt review of latest permitted version | Version conflict evidence |
| `DP08-FAIL-07` | Stock/price/fee changed | Review and reconfirm updated terms; no silent replacement | Canonical price/stock evaluation |
| `DP08-FAIL-08` | Payment provider slow/unknown | Pending/uncertain state, no blind second charge | Provider reconciliation evidence |
| `DP08-FAIL-09` | Duplicate payment/webhook | One intended effect, observable duplicate, no repeated fulfillment | Financial/ledger assertions |
| `DP08-FAIL-10` | Shipping tracking stale | Last known verified state with timestamp and support route | Carrier and physical handoff provenance |
| `DP08-FAIL-11` | Messaging/notification down | Canonical accepted transaction remains; recovery assigned | Notification attempt and exception ownership |
| `DP08-FAIL-12` | Marketplace API unavailable | Scope-limited degraded function; unrelated Home/Custom remain | Isolation and adapter recovery logs |
| `DP08-FAIL-13` | AI/editor fails | Lightweight normal browsing/assisted service still works | Fault-injection + route regression |
| `DP08-FAIL-14` | Vendor QC issue | Customer receives honest safe next step, no invented delivery | Real QC exception/owner evidence |
| `DP08-FAIL-15` | Retur/claim unclear | Request captured for authorized review; no fake refund | Case/policy trace |
| `DP08-FAIL-16` | Analytics service blocked | Conversion core flows still work; no PII leaked | Network/security trace |

**Recovery invariant:** The customer should always be able to answer: What has actually happened? What remains uncertain? What can I safely do next? Who is accountable? If a provider/state cannot answer, do not invent certainty.

### 8.1 Manual fallback must be real

When a channel is declared available, the fallback must point to an approved operationally monitored method. As of inspected public `main`, official public contact channels are **not activated**; a design cannot treat the current contact page as proven live handoff. Owners must approve active contact capacity and copy before enabling a functional promise.

---

## 9. Test Architecture & Quality Evidence Pyramid

| Layer | Primary proof | What it cannot prove alone | Risk note |
| --- | --- | --- | --- |
| Documentation and source audit | References, exact IDs, static claims, defined states | Runtime behavior | Can run now read-only |
| Component/unit | Validation, formatting, mapping, UI state logic | Full authorization, hosted release readiness | Synthetic fixture |
| Contract/API | Source command boundary, response and invariant behavior | Actual accessible end-user task | Need authorized isolated environment |
| Integration | Provider signatures, webhooks, retries, accounting source | Actual merchant production entitlement | Scoped sandbox only |
| Browser E2E | Real navigation, forms, failure states and focus | Financial effect correctness unless backend inspected | Must bind to exact build |
| Security negative | Cross-org read/write, token, file, concurrency and bypass | Usability comprehension | Independent R-class as required |
| Performance lab | Repeatable template/interaction diagnostics | Field p75, real customer conversion | Profiles/assets recorded |
| Accessibility manual/AT | Whole task, focus, meaning, inclusive recovery | Full site certification without scope report | Real reviewer/device matrix |
| Customer research | Actual understanding, friction and behavioral outcomes | Financial/security correctness | Consent/representative cohort |
| Founder operating rehearsal | Data handoff, physical/administrative separation, workload | Unreleased end-to-end provider production | Real pilot separately governed |
| Live monitoring | Observed provider/CWV/quality after activation | Historical untested feature readiness | Explicit Owner release required |

### 9.1 Automated tests are necessary but insufficient

- Automated code quality checks verify only the assertions they contain. Do not label entire customer journeys tested because one page renders.
- UI screenshot comparisons are useful for hierarchy/layout regressions but not payment truth or access rights.
- Browser a11y scanners detect only a subset of issues; manual task and assistive-tech evaluation is required for claimed scope.
- Frontend mock tests cannot establish that an order/payment/authorization command is safe under concurrency.
- A provider sandbox pass does not prove that a live account is permitted, enabled or operationally affordable.
- QA reports must include skipped tests and the reason—not hide them behind total passing counts.

### 9.2 Evidence provenance minimum

```text
EVIDENCE_RECORD
  case_id / requirement_ids / approved_release_slice
  exact_app_head_sha / related_qa_head_sha / build_and_deployment_id
  test_source_revision / run_id / artifact_digest
  environment_type_and_disposable_identity / provider_account_scope
  browser_device_locale_profile / dataset_classification
  execution_timestamp / tester / independent_reviewer
  expected / observed / status / skip_reason
  linked_artifacts / known_limitations / reassessment_trigger
```

Do not collect production secrets or customer PII into public evidence. Follow `docs/governance/evidence-provenance-model.md` and current engineering runtime governance; this diagram is illustrative, not a replacement repository data schema.

---

## 10. Six Quality Gates — Inherited CX8-GATE-A..F

**The six existing CX-08 gates are preserved.** This section deepens *what can count as proof* without defining new engineering approval authority.

### `CX8-GATE-A` — Product scope and canonical reconciliation

**Input:** approved target slice; truthful offered services; exact existing requirement/trace map; owner decision and policy references. **Evidence:** signoff of scoped capability matrix and state/copy review. **Block if:** fake purchase/submit/contact claim, contradictory policy, or unresolved material product authority conflict.

### `CX8-GATE-B` — UX and inclusive task completion

**Input:** documented core tasks and supported contexts. **Evidence:** full browser traces, manual keyboard/AT findings, mobile/orientation/text-zoom checks and representative comprehension tasks. **Block if:** active sole path inaccessible or falsifies action meaning. Tests may be `NOT_RUN` when feature not in current slice, with rationale.

### `CX8-GATE-C` — Performance and non-regression

**Input:** actual approved reference implementation, named route budgets, representative network/device profiles. **Evidence:** repeatable lab traces, measured budget comparisons and field p75 only where sample valid. **Block if:** severe unapproved regression on active critical path, unreviewed loading of heavy optional SDK, or missing mandatory lab evidence. Do not invent field data prelaunch.

### `CX8-GATE-D` — Transaction, authorization and security

**Input:** canonical MGBOS command/finance/permission rules and risk classification. **Evidence:** exact-head backend/SQL/API tests, negative access, replay/concurrency and destructive isolation assurance as applicable. **Block if:** unauthorized access/approval, duplicate economic effect, unsafe file or incorrect payment/production truth. **No product waiver** of hard invariants.

### `CX8-GATE-E` — Integrations, observability and owned recovery

**Input:** actual scoped enabled providers and failure model. **Evidence:** provider sandbox/entitlement, retry/replay, discrepancy ownership, notification semantics, monitoring and safe fallback. **Block if:** false success, provider state drift without safe recovery, or core path depends on optional service failure.

### `CX8-GATE-F` — Pilot, operational and release authority

**Input:** current roadmap's required launch gates, actual founder capacity, service availability, environment/backup/rollback and release approvals. **Evidence:** operator rehearsal and signed gates under exact candidate. **Block if:** no valid Owner/deployment permission or missing mandatory operational safety. The separate Founder Control real-pilot requirements remain fully in force.

### 10.1 Gate decision logic

```text
APPROVED CAPABILITY SLICE
  -> exact source / product scope / correct authority
  -> applicable CX8 gates / required risk-controlled tests
  -> evidence collection with honest NOT_RUN / NOT_VERIFIED / FAIL
  -> material failure or missing mandatory evidence? -> BLOCK
  -> independent QA and security if required
  -> product and engineering dispositions reconciled
  -> Owner's specific release decision
  -> deployment permission is separate and explicit
```

A `PASS_WITH_LIMITATIONS` disposition requires documented contractual basis, scoped evidence and acceptable non-blocking findings. It is not an excuse to skip time-consuming tests. Re-review is required when exact HEAD or tested contract materially changes.

## 11. Scope-to-Gate Evidence Matrix for Each Increment

| Candidate capability | Product validation | Technical/financial/security assurance | Minimum negative/recovery | Required before enabling |
| --- | --- | --- | --- | --- |
| S0 public information | Can find correct offer; honest CTA | Source/brand/content audit, browser accessibility | Missing image, unavailable contact, bad deep link | Gates A/B/C/F as applicable |
| S0 public intake **if implemented** | Task completion + submitted summary | Server receipt, authorized intake, PII policy | Timeout, double submit, invalid field, notification failure | A/B/C/D/E/F applicable |
| S1 sellable catalog | Search/variant understanding | Actual published product data, authorization, budget | No matches vs failed fetch, stale stock | A/B/C/D/F |
| S1 checkout/payment | Comprehend payable amount and outcome | Existing finance command/R5 risk assurance as assigned, provider sandbox and accounting invariants | Price change, concurrency, replay, timeout, fraud | All applicable A–F; no bypass |
| S1/S2 portal/guest access | Correct next action and data scope | Identity/resource/tenant authz, private file access | Cross-account, expired/revoked token, cache leak | A/B/C/D/F, E for channels |
| S2 proof/quote | Understand exact version/consequence | Actor/version authorization, audit, proof/file controls | Old version/forwarded link, approval race | A/B/C/D/F |
| S2 marketplace/courier | Source ownership and truthful status | Provider eligibility, event correlation, ledger/fulfillment preservation | Forged, duplicated, delayed, wrong account | A/B/C/D/E/F |
| S3 advanced builder | Better completion, reduced rework | Allowed combination proof, heavy-bundle isolation | Invalid config, preview mismatch, no AI, slow device | A/B/C/D/E/F as relevant |

**Never transfer a PASS from one capability to an unrelated one.** In particular, MGBOS historical payment tests do not by themselves validate customer browser payment UX, provider integration or a production merchant account.

---

## 12. Proposed Quality Refinements (`DP08-QR-01..20`)

These 20 candidate refinements **do not replace** any `CX8-QR` or `CX8-AC` and do not create new backend semantics. They become authoritative only after cross-document reconciliation and acceptance.

| ID | Proposed quality refinement | Inherited owner/trace | Acceptance evidence |
| --- | --- | --- | --- |
| `DP08-QR-01` | Every quality report states precisely which capability slice, routes and actions were active and tested; future capabilities are neither PASS nor blanket FAIL | `CX8-QR-041/042` | Scope-to-case ledger with exclusions |
| `DP08-QR-02` | Customer success state must correlate to real authoritative receipt, separated from transient UI/request and notification | `CX8-QR-017/035` | Browser/API correlation with accepted reference |
| `DP08-QR-03` | Frontend distinguishes successful empty dataset from backend failure, stale view and unauthorized result | `CX8-QR-014/033` | Fault-injected UI states and server evidence |
| `DP08-QR-04` | Each public route's primary action actually works or is truthfully identified as unavailable, never deceptive | `CX8-QR-002/017` | Route/CTA audit on exact build |
| `DP08-QR-05` | Performance reporting explicitly separates field p75 from laboratory diagnostics, including sample sufficiency | `CX8-QR-001/005` | Provenance-marked metrics report |
| `DP08-QR-06` | Protected route performance regression evaluates navigation and real interaction under declared conditions | `CX8-QR-005/008` | Baseline comparison with trace |
| `DP08-QR-07` | Optional editor/AI/marketing scripts cannot be required by P0 paths or break fallback | `CX8-QR-003/007` | Block/disable scripts and compare P0 |
| `DP08-QR-08` | Accessibility evidence covers error, timeout, pending, active modal, virtual keyboard and result states—not just default screenshot | `CX8-QR-009..013` | Manual AT/keyboard full-task report |
| `DP08-QR-09` | Reviewer checks applicable WCAG 2.2 AA criteria and documents every exception and third-party scope | `CX8-QR-009/015` | Criteria matrix and reviewer signature |
| `DP08-QR-10` | Existing customer statements clearly distinguish requested date, estimated terms, approved quote, actual payment and courier handoff | `CX8-QR-018..023` | Content/financial/fulfillment fact map |
| `DP08-QR-11` | Unknown payment/provider outcome cannot yield fabricated success or uncontrolled extra charge | `CX8-QR-021/033/034` | Financial fault/reconciliation evidence |
| `DP08-QR-12` | Concurrent retry and version-conflict tests must assert *durable business effects*, not merely duplicate buttons disabled | `CX8-QR-034/019` | Concurrency source assertions |
| `DP08-QR-13` | Guest, personal account, organization and file/document access must be tested through direct URLs/API bypasses and revoked sessions | `CX8-QR-025/026/029` | Independent negative resource-access tests |
| `DP08-QR-14` | Artwork file processing and preview truth are two independent concerns with separate test outcomes | `CX8-QR-027/028` | Unsafe-file negatives, UI copy review |
| `DP08-QR-15` | External provider account entitlement, sandbox behavior and actual merchant/live readiness remain separate evidence statuses | `CX8-QR-031/047` | Provider-scoped readiness register |
| `DP08-QR-16` | All repeat support/returns paths preserve source-owned customer rights, case owner and factual milestone separation | `CX8-QR-023/040` | Policy/case/return end-to-end review |
| `DP08-QR-17` | Every accepted customer inquiry should be traceable to a governed operator action without unnecessary founder re-entry | `CX8-QR-038/039/040` | Founder walkthrough, touch/time measurement |
| `DP08-QR-18` | Fault injection covers at least one disabled optional service and one degraded critical dependency per relevant release path | `CX8-QR-033/036` | Controlled outage browser/contract tests |
| `DP08-QR-19` | Evidence report separates actual test execution, skipped tests, source revisions and independent reviewer scope | `CX8-QR-041..045` | Auditable report with exact SHA and missing evidence |
| `DP08-QR-20` | Customer/owner release decision requires explicit gate status and non-waivable invariant confirmation under canonical governance | `CX8-QR-045/048` | Signed scoped release disposition |

**No automatic priority promotion:** Requirements inherited from S2/S3 still require their own availability and Owner decisions. A candidate quality refinement for a future capability does not silently become P0 implementation work.

## 13. Additional Acceptance Scenarios (`DP08-AC-01..28`)

All scenarios below are **`SPECIFIED / NOT_EXECUTED`**. They test quality gaps across source, browser, backend, privacy and operational handoff; they are not execution results or an implementation test file.

| ID | Given / when / then | Scope | Required future evidence |
| --- | --- | --- | --- |
| `DP08-AC-01` | Given S0 Shop is not sellable, when visitor enters its route, then no enabled Buy/cart or fabricated stock promise appears | S0 | Exact build route + content audit |
| `DP08-AC-02` | Given official contact not activated, when visitor seeks to contact TeeStock, then interface does not claim a message can already reach support | S0 now | Source/browser route + owner confirmation |
| `DP08-AC-03` | Given a permitted active intake route, when the request is accepted, then browser receipt/reference matches one stored authoritative request and its next action | Conditional S0 | Browser+API+operator trace |
| `DP08-AC-04` | Given a request whose server outcome is unknown, when user refreshes or retries, then no false success/failure and no duplicate effect occur | Conditional S0 | Timeout injection/idempotent backend |
| `DP08-AC-05` | Given an invalid long Custom form, when one field is corrected, then non-sensitive valid values remain while error is announced accessibly | Conditional S0 | Mobile+keyboard/AT + form negative |
| `DP08-AC-06` | Given missing font/hero imagery, when P0 Home is loaded on constrained mobile, then readable brand/offer/CTA and stable layout remain | S0 | Media fault trace + mobile review |
| `DP08-AC-07` | Given a disabled external analytics/AI package, when a mobile customer navigates Home/Custom/Business, then the declared standard task still works | S0+ | Network interception + browser replay |
| `DP08-AC-08` | Given a release report with no sufficient real-user samples, when CWV is summarized, then field metrics say `NOT_VERIFIED_FIELD` and are not replaced by lab TBT | S0+ | Evidence/measurement audit |
| `DP08-AC-09` | Given a new feature loads a heavy builder only on its own route, when P0 pages are profiled, then the optional SDK is not required on their critical path | S3 with S0 regression | Build asset graph + waterfall |
| `DP08-AC-10` | Given keyboard-only, zoomed mobile or reduced-motion context, when the full active flow runs, then no essential action is obscured and all outcomes remain perceivable | Each release | Accessibility manual task recording |
| `DP08-AC-11` | Given automated accessibility scan is clear but keyboard task fails, when gate B is assessed, then product acceptance is blocked or formally addressed under valid authority—not declared WCAG PASS | Each release | Independent mixed-method evaluation |
| `DP08-AC-12` | Given customer changes variant/filter, when catalog query fails, then UI identifies source unavailability instead of zero products | S1 | Fault injection and accessible UI |
| `DP08-AC-13` | Given price or shipping fee changes after review, when buyer initiates commitment, then current terms need deliberate reconfirmation | S1 | Pricing-source and browser negative |
| `DP08-AC-14` | Given two buyers race for the final item, when both commit, then source invariants prevent inconsistent accepted stock/order state | S1 | Isolated concurrency proof |
| `DP08-AC-15` | Given payment provider redirects as success but settlement is unverified, when customer returns, then website shows pending/unknown rather than paid | S1 | Provider simulator+ledger/customer UI |
| `DP08-AC-16` | Given payment API timeout after attempt creation, when user seeks retry, then prior attempt is safely reconciled before risking another charge | S1 | Disposable financial environment and traces |
| `DP08-AC-17` | Given customer A probes B's order, invoice, artwork or company quote through direct API/file URL, when request executes, then no protected fact or existence clue leaks | S1/S2 | Independent object-level security suite |
| `DP08-AC-18` | Given role revoked while a tab is open, when B2B actor loads or acts again, then server denies outdated entitlement and visible private content is not retained improperly | S2 | Revocation and cache/role negative tests |
| `DP08-AC-19` | Given quotation/proof v2 supersedes v1, when stale approval submitted, then no commitment or production release occurs and customer receives safe current-version action | S2 | Exact-version/actor audit + UI |
| `DP08-AC-20` | Given a customer uploaded a file, when transfer completes but technical review is absent, then UI says file received, not print-ready or approved proof | Conditional S0/S2 | Upload source + copy review |
| `DP08-AC-21` | Given tracking label but no carrier acceptance, when customer opens timeline, then shipped/delivered statements remain unasserted | S1/S2 | Fulfillment evidence and UI mapping |
| `DP08-AC-22` | Given return request is captured, when its status is rendered, then claim pending is distinct from authorized return, refund approval and settlement | S2 | Case/finance source and customer screen |
| `DP08-AC-23` | Given repeated/forged/wrong-tenant marketplace events, when processed, then no second or cross-org commercial effect occurs | S2 | Provider-scoped security/idempotency |
| `DP08-AC-24` | Given provider message accepted but undelivered, when viewed, then no definitive statement of customer receipt/read is shown | S2 | Messaging provider status and copy review |
| `DP08-AC-25` | Given an unauthorized AI request for refund, discount or cross-account data, when assistant attempts it, then deterministic tool guard denies action and normal human path works | Optional S3 | Adversarial eval+command denial |
| `DP08-AC-26` | Given accepted Custom/Business inquiry, when founder opens governed operational view, then specification is present once and unnecessary transcription touches are measurable | Conditional S0/pilot | Operator walkthrough and touch ledger |
| `DP08-AC-27` | Given a QA candidate HEAD changes after test, when assurance is reused, then affected evidence is marked stale and exact-diff-based re-review occurs before acceptance | All | Source/QA manifest and review |
| `DP08-AC-28` | Given mandatory finance/security/ops gate is missing, when UI demo and superficial CI look green, then release remains blocked without a production/merge permission claim | All | Gate review and owner authorization |

### 13.1 Required synthetic fixtures (not real transactions)

- `DP08-FIX-01`: visitor on low-end Android emulator with missing hero font/image.
- `DP08-FIX-02`: first-time Custom visitor with no artwork and requested urgent date.
- `DP08-FIX-03`: valid inquiry accepted by backend but response lost; repeat button clicked twice.
- `DP08-FIX-04`: company buyer with quote v2 and forwarded stale v1 link.
- `DP08-FIX-05`: last unit stock contested by two customers.
- `DP08-FIX-06`: provider says successful redirect, canonical payment still pending.
- `DP08-FIX-07`: unauthorized customer/org attempts to fetch another's invoice/proof.
- `DP08-FIX-08`: label created, carrier has not physically received parcel.
- `DP08-FIX-09`: return complaint with no approved refund and seller/marketplace boundary.
- `DP08-FIX-10`: AI disabled; customer can still obtain a safe human route.
- `DP08-FIX-11`: duplicate marketplace event, then real later revision.
- `DP08-FIX-12`: founder manually reviews 100 custom shirts with vendor/QC/packing responsibilities.

Fixture quantities are illustrative only; they are **not** TeeStock business policy, current sellable capacity or proof of an executable environment. All destructive/financial tests require separately approved disposable setup.

## 14. Existing CX-08 ID Preservation and Reconciliation

**This matrix is intentionally explicit:** It lists every existing quality requirement, business/experience rule and acceptance case by exact ID rather than claiming coverage from a range alone. `SOURCE_PRESERVED` describes a documentation relationship, not executed verification. No existing semantics, priority, Owner decision, or gate is changed.

### 14.1 Existing `CX8-QR-001..048` → proposed evidence discipline

| Existing ID | Existing topic (compact, non-normative) | DP-08 discipline / proposed evidence |
| --- | --- | --- |
| `CX8-QR-001` | Field/lab CWV provenance | Performance measurement; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-002` | Mobile primary action | Comprehension/mobile; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-003` | Optional feature isolation | Performance/reliability; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-004` | Images/fonts stability | Performance/media; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-005` | Per-template lab budgets | Performance baselines; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-006` | Catalog/checkout responsive at scale | Performance commerce; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-007` | Advanced editor lazy isolated | Performance advanced; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-008` | No silent regressions | Performance CI; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-009` | WCAG 2.2 AA target | Accessibility; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-010` | Keyboard-only task | Accessibility; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-011` | Screen reader labels/errors | Accessibility; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-012` | Zoom/reflow/virtual keyboard | Accessibility; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-013` | Reduced motion/noncolor | Accessibility; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-014` | Error copy and field preservation | Accessibility/recovery; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-015` | Accessible checkout/approval/account | Accessibility action; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-016` | Drag alternative | Accessible advanced; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-017` | Receipt after durable acceptance | Transaction truth; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-018` | Requested versus confirmed time | Trust copy; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-019` | Estimate/quote/production distinctions | Commercial truth; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-020` | Price/stock revalidation | Checkout; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-021` | Verified payment fact | Payment truth; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-022` | Shipment physical evidence | Fulfillment truth; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-023` | Return/refund stages | Return truth; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-024` | Fresh reorder eligibility | Reorder; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-025` | No cross-actor data exposure | Privacy; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-026` | Org membership/capability | Authorization; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-027` | Artwork file/IP safety | File security; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-028` | Secrets and redirects | Privacy/security; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-029` | Guest proof of access | Guest security; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-030` | Consent purpose | Consent; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-031` | Provider source verification | Integration security; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-032` | AI bounded tools | AI governance; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-033` | Offline/unknown recovery | Recovery; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-034` | Idempotent effects | Concurrency; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-035` | Notification separate from acceptance | Messaging; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-036` | Provider outage isolation | Resilience; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-037` | Cross-channel freshness | Status provenance; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-038` | Request data into operations | Founder handoff; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-039` | Physical evidence | Real-world operations; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-040` | Founder exception ownership | Founder Control; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-041` | Exact build/environment | Evidence provenance; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-042` | Positive/negative coverage | Evidence matrix; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-043` | Real browser/user flows | Experience QA; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-044` | Pilot separated from frontend | Release scope; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-045` | Independent review | Assurance; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-046` | Observability privacy | Instrumentation; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-047` | Provider sandbox/live separation | Provider QA; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-QR-048` | Owner release authority | Release governance; §§2–11; `DP08-QR-*` relevant; remains `SOURCE_PRESERVED / NOT_EXECUTED` |

### 14.2 Existing `CX8-BR-001..024` → non-duplication guard

The business/experience rules are not rewritten here; each remains a source-rule candidate pending CX-08 product approval. They are mapped to the DP-08 section that tests their visible consequences.

| Existing ID | Review topic (not verbatim source) | Quality evidence focus |
| --- | --- | --- |
| `CX8-BR-001` | Specification vs proof lifecycle | §0, §3; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-002` | No fake measured metrics | §0, §4; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-003` | Slice-gated scope | §2; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-004` | Hard money/tenant invariants | §7, §10; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-005` | A11y full-state manual coverage | §5; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-006` | Core service without optional widget | §4, §8; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-007` | Success only after source | §7; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-008` | Receipt not order/payment | §7; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-009` | No silent stale promotion | §7–8; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-010` | Client UI not authz | §7; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-011` | Safe retry/idempotency | §7–8; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-012` | Truthful unknown state | §0, §8; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-013` | No sensitive analytics leakage | §7, §9; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-014` | Live P0 channel honesty | §1–2, §8; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-015` | Shared UX grammar | §5–6; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-016` | Physical milestone evidence | §7–8; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-017` | AI bounded authority | §7; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-018` | Guest friction ≠ auth bypass | §7; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-019` | Optional advanced feature isolation | §4; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-020` | NOT_VERIFIED remains explicit | §0, §10; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-021` | Engineering findings can block release | §10–11; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-022` | Product review can block despite green CI | §5–6, §10–11; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-023` | Owner draft approval is not build/deploy authority | §0, §16; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-BR-024` | No numerical budget without baseline/owner review | §4; `SOURCE_PRESERVED / NOT_EXECUTED` |

### 14.3 Existing `CX8-AC-001..048` → acceptance ownership

Existing acceptance tests are recorded in the following exact-ID coverage ledger. Their detailed Given/When/Then text remains in `cx-08-experience-quality-acceptance-contract.md`; the shortened labels below are navigation aids, **not replacements**.

| Existing ID | Source acceptance topic | DP-08 assessment lane / state |
| --- | --- | --- |
| `CX8-AC-001` | Home intent comprehension | P0 / Core task; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-002` | Mobile landing lab performance | P0 / Core task; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-003` | Navigation/deep-link focus | P0 / Core task; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-004` | Accessible form error | P0 / Core task; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-005` | Durable Custom receipt | P0 / Core task; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-006` | Conditional fields validation | P0 / Core task; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-007` | Requested date truth | P0 / Core task; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-008` | Notification failure isolation | P0 / Core task; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-009` | Duplicate intake effect | P0 / Core task; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-010` | Pre-acceptance network loss | P0 / Core task; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-011` | Zoom/reduced-motion mobile | P0 / Core task; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-012` | Optional AI/media outage | P0 / Core task; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-013` | Catalog filter and inventory truth | P1 / Commerce; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-014` | PDP legibility/layout | P1 / Commerce; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-015` | Checkout price change | P1 / Commerce; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-016` | Oversell prevention | P1 / Commerce; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-017` | Guest access proof | P1 / Commerce; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-018` | Duplicate checkout effect | P1 / Commerce; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-019` | Payment redirect uncertainty | P1 / Commerce; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-020` | Webhook authenticity and replay | P1 / Commerce; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-021` | Payment timeout reconciliation | P1 / Commerce; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-022` | Notification vs accepted payment | P1 / Commerce; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-023` | Accessible provider checkout | P1 / Commerce; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-024` | SDK non-regression | P1 / Commerce; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-025` | Cross-org quote protection | P1–P2 / Account and operations; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-026` | B2B approver authorization | P1–P2 / Account and operations; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-027` | Quote-version stale approval | P1–P2 / Account and operations; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-028` | Unsafe artwork handling | P1–P2 / Account and operations; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-029` | Proof not production release | P1–P2 / Account and operations; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-030` | Carrier label not dispatch | P1–P2 / Account and operations; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-031` | Out-of-order scans | P1–P2 / Account and operations; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-032` | Return request not refund | P1–P2 / Account and operations; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-033` | Case owner/notes privacy | P1–P2 / Account and operations; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-034` | Reorder revalidation | P1–P2 / Account and operations; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-035` | Guest token expiry/guessing | P1–P2 / Account and operations; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-036` | Unresolved QC/shipping claim | P1–P2 / Account and operations; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-037` | Marketplace replay + revision | Integration / cross-cutting governance; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-038` | Wrong seller/tenant deny | Integration / cross-cutting governance; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-039` | Provider outages and fallback | Integration / cross-cutting governance; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-040` | Promotional consent enforcement | Integration / cross-cutting governance; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-041` | Message accepted vs read | Integration / cross-cutting governance; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-042` | AI tool privilege denial | Integration / cross-cutting governance; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-043` | Analytics PII minimization | Integration / cross-cutting governance; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-044` | CI or R4/R5 missing blocks | Integration / cross-cutting governance; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-045` | Accessibility failure despite green CI | Integration / cross-cutting governance; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-046` | SHA change invalidates evidence | Integration / cross-cutting governance; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-047` | Absent field metrics honest | Integration / cross-cutting governance; `SOURCE_PRESERVED / NOT_EXECUTED` |
| `CX8-AC-048` | Operational readiness before release | Integration / cross-cutting governance; `SOURCE_PRESERVED / NOT_EXECUTED` |

### 14.4 Preserve product responsibility across CX-01..09

| Existing document | Consumed quality input | No semantic takeover by this DP-08 |
| --- | --- | --- |
| CX-01 | 46 parent FRs, 15 NFRs, journeys and capabilities | Product scope and priority |
| CX-02 | 8 service blueprints, physical work and recovery | New lifecycle/schema semantics |
| CX-03 | Interaction patterns, states, 12 screen patterns and visual system bridge | Master brand identity |
| CX-04 | 42 Commerce FRs, 22 BRs, 38 ACs | Money, inventory, payment authority |
| CX-05 | 46 Custom/B2B FRs, 26 BRs, 40 ACs | Quote/production/approval semantics |
| CX-06 | 48 Account/Service FRs, 28 BRs, 44 ACs | Identity, customer case/return policy |
| CX-07 | 48 Omnichannel FRs, 28 BRs, 14 NFRs, 44 ACs | Provider capability and connector implementation |
| CX-08 | 10 dimensions, 48 QR, 24 BR, 48 AC, 6 existing gates | Existing quality contract remains original source |
| CX-09 | CX-S0..S3 and validation/decision sequencing | Canonical roadmap or Owner release approval |

**Traceability rule:** A future approved PR that integrates a DP08 refinement must identify exact existing CX8 IDs, parent CX1 IDs, capability slice, changed owner document, and source-diff impact. No parallel canonical numbering is permitted.

## 15. Owner Decisions, Unknowns and Risks

### 15.1 Material decisions (not decided by author)

| Decision | Recommended direction | Accountable owner / trigger |
| --- | --- | --- |
| `DP08-DEC-01` | Adopt WCAG 2.2 AA as product quality target; record honest assessment scope | Owner/UX/QA/legal as applicable, before release acceptance |
| `DP08-DEC-02` | Adopt official CWV good thresholds at p75 real visits; separate prelaunch lab | Owner/Product, Head Engineering performance QA |
| `DP08-DEC-03` | S0 contact/submit claims enabled only after a real monitored channel and backend/human owner exist | Owner/operating owner + Head Engineering |
| `DP08-DEC-04` | Select representative device/network/AT matrix from customer evidence and available QA capability | UX/QA/Head Engineering |
| `DP08-DEC-05` | Set enforceable per-template budgets after profiling representative build, not from shell placeholders | Head Engineering/Frontend/Product |
| `DP08-DEC-06` | Define UX critical-task acceptance thresholds after first legitimate research study | Owner/Product research |
| `DP08-DEC-07` | Define privacy-appropriate RUM/error analytics rollout and retention | Security/privacy/Operations |
| `DP08-DEC-08` | Preserve `CX8-GATE-A..F` and existing engineering risk gates; this doc cannot waive them | Head Engineering/Owner |
| `DP08-DEC-09` | Set founder contact capacity and legitimate customer response wording before activation | Owner/TeeStock operations |
| `DP08-DEC-10` | Only activate S1/S2/S3 assurance per explicit approved capability, not speculative date | Product/roadmap Owner |

### 15.2 Unknown register

| ID | Unverified fact | What evidence closes it |
| --- | --- | --- |
| `DP08-UNK-01` | Customer traffic/device and field CWV | Privacy-approved RUM + sample characterization |
| `DP08-UNK-02` | Current measured bundle, CPU/network performance | Exact build reproducible lab runs |
| `DP08-UNK-03` | Official public contact channel and operating owner | Approved activated channel/process |
| `DP08-UNK-04` | Valid customer-facing transactional intake API | Head Engineering exact implementation/security audit |
| `DP08-UNK-05` | Current CI scope and actual hosted execution for TeeStock | Exact SHA workflow/job logs, not script names alone |
| `DP08-UNK-06` | Customer authentication and guest verification model | Architecture/threat model/negative tests |
| `DP08-UNK-07` | Payment/provider live eligibility and settlement proof | Merchant account entitlement + sandbox + finance controls |
| `DP08-UNK-08` | Real customer comprehension and abandonment | Representative user research and pilot |
| `DP08-UNK-09` | Actual founder admin-touch savings and capacity | Controlled operator and live pilot evidence |
| `DP08-UNK-10` | Whether local DP-01..07 are in any versioned branch | Owner-approved GitHub push/PR and fresh source read |

### 15.3 Risk register

| ID | Risk | Severity candidate / response |
| --- | --- | --- |
| `DP08-RISK-01` | Quality “PASS” fabricated from unspecified or unexecuted tests | Block report; require evidence ledger and reviewer |
| `DP08-RISK-02` | Live public CTA points to unavailable channel | Block active claim; approve and test real handoff first |
| `DP08-RISK-03` | Attractive fast frontend produces duplicate financial effect | Hard stop via governed finance assurance |
| `DP08-RISK-04` | One customer sees another organization's quote/order | Hard stop via server authorization tests |
| `DP08-RISK-05` | Lab Lighthouse substituted for true field p75 | Explicit measurement provenance |
| `DP08-RISK-06` | Scanner-only WCAG claim hides inaccessible critical journey | Manual keyboard/AT and criteria trace |
| `DP08-RISK-07` | P2 builder or SDK slows P0 | Bundle isolation, route regression, kill-switch plan |
| `DP08-RISK-08` | Founder receives unowned cases or too many false alerts | Owner/exception routing and manual-touch measurement |
| `DP08-RISK-09` | QA runs destructive cases in existing environment | Disposable environment proof and stop condition |
| `DP08-RISK-10` | DP docs locally copied but treated as approved merged canon | Baseline and source status labels |

No risk label in this table is a formal engineering risk classification; applicable R4/R5 and governance obligations must come from the canonical engineering owner.

## 16. Integration, Antigravity Handoff and Stop Conditions

### 16.1 Current action: local-only document adoption

Create this **new DRAFT file** at its exact proposed path. Do not overwrite `cx-08-experience-quality-acceptance-contract.md`. Owner may store DP-01..08 together locally without immediate GitHub push. `main` remains authoritative for code and canonical documentation until real commits are reviewed.

### 16.2 When Antigravity is appropriate

Head Engineering may issue a **bounded, documentation-only** integration handoff after Owner chooses to version the accumulated local DP documents. Handoff should require:

1. Confirm actual local DP files and exact hashes; inspect latest `main` and open documentation PRs; do not assume local content is already present on GitHub.
2. Work on separate branch, with only approved document paths (initially DP-08 new file if adopting this exact draft), explicit excluded application/data paths and no other PR scope overlap.
3. Check frontmatter against `DOC-001`, source refs, duplicate canonical IDs, broken links, source `CX8` IDs and Markdown table structural correctness.
4. Produce delta/reconciliation matrix for any proposed CX-08 edits; review impact on CX-01..09, README, trace CSV and Source Map; edit indices only under a separately approved scope when PR #73 is resolved.
5. Run only safe repository documentation validators. No implementation changes, migrations, provider connections, destructive DB tests or production access.
6. Return exact branch, base/head SHAs, changed-file list, validator outputs, scope deviations, review issues and PR URL; do not merge/deploy.

**No Antigravity handoff is required merely to read `main`** when the GitHub connector supports read-only retrieval. Request Antigravity only for a bounded work package with an actual gap in this session or for later repository integration.

### 16.3 Mandatory stops

- The local draft differs materially from the version reviewed here; reconcile before committing.
- A mandatory document/source citation or reference ID cannot be verified.
- The proposed PR overlaps an active documentation-routing PR or touches unrelated existing semantics.
- A proposed test would require live money/customer data, existing DB destructive access, credentials, unsafe webhooks or production.
- QA report asserts a PASS that lacks exact scope/build/run/reviewer evidence.
- Product copy implies instant checkout or live contact while the operational channel is not ready.
- Security, financial, organization-isolation or accessibility hard blocker is being dismissed as a UX preference.

---

## 17. Author Self-Review and Current Disposition

**Author self-review performed 2026-10-17.** This quality statement concerns **this Markdown artifact**, not TeeStock software implementation.

| Check | State | Evidence / limit |
| --- | --- | --- |
| DP-08 new destination path absent at inspected GitHub SHA | `PASS_SOURCE_INSPECTION` | Exact path checked read-only; not yet committed |
| Existing CX-08 quality requirements `CX8-QR-001..048` preserved | `PASS_DOCUMENT_MAPPING` | All 48 exact IDs present in §14.1 |
| Existing CX-08 rules `CX8-BR-001..024` preserved | `PASS_DOCUMENT_MAPPING` | All 24 exact IDs present in §14.2 |
| Existing CX-08 scenarios `CX8-AC-001..048` preserved | `PASS_DOCUMENT_MAPPING` | All 48 exact IDs present in §14.3 |
| Quality dimensions and gates | `PASS_DOCUMENT_MAPPING` | 10 QD dimensions and A–F gates referenced |
| Proposed new `DP08-QR` / `DP08-AC` IDs | `PASS_STRUCTURAL_CHECK` | 20 QR candidates and 28 AC candidates, unique |
| Owner decision and unknown evidence boundaries | `PASS_AUTHOR_REVIEW` | Explicit OPEN/unverified; no false signoff |
| Current app-source observations | `PASS_SOURCE_INSPECTION` | Focused Home/Custom/Business/Support/package reads only |
| WCAG/CWV external methodology | `PASS_REFERENCE_REVIEW` | Links to W3C, web.dev, Playwright; no conformance claim |
| YAML/Markdown structural validity | `VALIDATE_DURING_ARTIFACT_GENERATION` | Document file check and ID audit; see author QA output |
| Actual browser, CI and performance execution | `NOT_PERFORMED` | No runtime or test run in drafting |
| Actual user interviews or founder operating pilot | `NOT_PERFORMED` | No observed participant or real transaction evidence |
| Independent UX/Security/QA assessment | `NOT_PERFORMED` | Cannot imply independent acceptance |
| Implementation, merge and deployment | `NONE_AUTHORIZED` | Source-only research and local artifact delivery |

**Release recommendation:** `COPY_READY / AUTHOR_SELF_REVIEWED / DRAFT`. **CX-08 canonical adoption and actual website release: NOT_APPROVED_BY_THIS_DOCUMENT**.

**Next documentation stage:** `DP-09 — Phased Delivery & Product Validation Deepening`, then a separate comprehensive `DP-10` source/traceability/decision reconciliation. None of these stages alone approves code changes, merchant integrations, or production deployment.

---

## 18. References and Evidence Reading Order

### 18.1 Repository references (pin to inspected commit for reproducibility)

- [CX-08 current DRAFT source](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md)
- [CX-09 delivery plan](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md)
- [CX package trace](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/docs/product/teestock-customer-platform/CX-PKG-TRACE-R1.csv)
- [TeeStock Home source](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/apps/teestock/src/app/page.tsx)
- [TeeStock Support status source](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/apps/teestock/src/app/support/contact/page.tsx)
- [TeeStock package test declarations](https://github.com/Rizkybuilds/bisnishub/blob/57eaafbb0ceef99a5fc6b2d77d724f6ff510727d/systems/mgbos/apps/teestock/package.json)
- `docs/governance/documentation-constitution.md`
- `docs/governance/canonical-source-map.md`
- `docs/governance/cross-system-risk-classification.md`
- `docs/governance/evidence-provenance-model.md`
- `docs/roadmaps/solo-founder-launch-roadmap.md`
- `systems/mgbos/docs/product/teestock-operational-pilot-plan.md`
- `systems/mgbos/docs/architecture/permission-authorization-model.md`
- `bisnis/teestock/12-legal-ip/customer-commerce-policy.md`

### 18.2 External standards (quality methodology, not proof of TeeStock implementation)

- Core Web Vitals and p75 targets: https://web.dev/articles/vitals
- CWV threshold methodology: https://web.dev/articles/defining-core-web-vitals-thresholds
- Differences between lab and field: https://web.dev/articles/lab-and-field-data-differences
- Interaction to Next Paint: https://web.dev/articles/inp
- WCAG 2.2 normative standard: https://www.w3.org/TR/WCAG22/
- WCAG 2.2 AA pointer targets: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- WCAG financial/data error prevention: https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data
- Playwright accessibility testing guidance: https://playwright.dev/docs/accessibility-testing
- OWASP Web Security Testing Guide: https://owasp.org/www-project-web-security-testing-guide/

**End of DP-08.**
