---
canonical_id: proposed.mgbos.engineering.teestock-cx-s0-discovery-implementation-plan
status: DRAFT
version: 1.0.0
owner: Rizky
author: OpenAI / ChatGPT — Head Engineering
authority: planning-only
approver: PENDING_OWNER_AND_APPLICABLE_ENGINEERING_GATES
document_class: engineering-plan
scope: teestock-customer-platform-cx-s0
normative_authority: NONE_UNTIL_APPROVED
prepared_at: 2026-10-17
reviewed_at: 2026-10-17
last_reviewed: 2026-10-17
effective_from: null
source_audit_status: REPOSITORY_PATHS_INSPECTED
technical_discovery_status: S0_A_BOUNDED_S0_B_ARCHITECTURE_OPEN
authoritative_for: []
not_authoritative_for:
  - application behavior
  - security grants and database policy
  - active canonical architecture
  - product business decisions
  - deployment and operational readiness
depends_on:
  - systems/mgbos/docs/product/teestock-customer-platform/cx-s0-premium-assisted-experience-contract.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md
  - docs/roadmaps/solo-founder-launch-roadmap.md
  - systems/mgbos/AGENTS.md
baseline_repository: Rizkybuilds/bisnishub
baseline_main: b9032bc26e8a623e75aa0ef7ab48249b5230bf56
reference_product_pr: 75
reference_product_pr_head: 59476dc2ba47a9ca1ba5347f6fa8554962006192
product_contract: systems/mgbos/docs/product/teestock-customer-platform/cx-s0-premium-assisted-experience-contract.md
proposed_repository_path: systems/mgbos/docs/engineering/teestock-cx-s0-engineering-discovery-and-implementation-plan.md
implementation_authorization: NOT_GRANTED
runtime_verification: NOT_EXECUTED
production_authorization: NOT_GRANTED
supersedes: null
review_cadence: per_material_change_or_new_work_package
---

# TeeStock CX-S0 — Engineering Discovery & Implementation Plan v1.0.0

**Disposition:** `FINAL_AUTHOR_REVIEWED_CANDIDATE / DRAFT / REPO_SOURCE_AUDITED / S0_B_ARCHITECTURE_OPEN`. This file is the engineering preparation companion to the CX-S0 product contract. It does **not** authorize a Builder to write code, create a PR, access production, add database schema or deploy. The Owner/Head Engineering must approve a later bounded work package. The word *final* describes authoring completeness, **not** canonical activation or executed runtime QA.

**One-page executive conclusion:** Build the smallest premium, fast, truthful **S0-A customer entry experience** first after approving genuine public offers, content rights and an attended contact route. A functioning **S0-B online inquiry** is a different, higher-consequence slice and is blocked until a public-safe MGBOS intake command, organization/brand/channel attribution, idempotent acceptance, privacy, anti-abuse and operator recovery are designed and independently verified. Do not build retail checkout or an alternate CRM to satisfy either slice.

## 1. Task, outcome and constraints

| Field | Decision/observation |
|---|---|
| Outcome | TeeStock visitors can understand an approved service and reach a genuine Custom/Business assisted contact path; later, approved S0-B converts qualified submission intent into one durable authorized MGBOS intake record. |
| S0-A first delivery | Responsive Home, Custom, For Business, honest Shop/Merch treatment, support/contact, no fake action, meaningful error/unavailable states. |
| S0-B separate delivery | Short accessible form, server-side public intake, replay-safe durable acknowledgement, managed operator routing, privacy and recovery. |
| Primary product links | `CX1-FR-001..005`, `009..015`, `029..030`, `038..040`; `S0-FR-001..040` and paired `S0-AC-001..040` in product contract. |
| MGBOS ownership | Lead/Requirement/Quote/Order/finance and authorizations stay with canonical MGBOS; this plan never creates an independent TeeStock transaction truth. |
| Operational pilot | Existing Custom/Business assisted pilot is independent; public storefront is **not** its prerequisite. |
| Delivery posture | One well-bounded S0-A implementation PR is preferable to a cluster of speculative foundational PRs; S0-B requires separate approval and tests. |
| Design posture | Customer outcome defines quality. Premium means coherent design, truthful capability, accessible interaction and fast mobile performance, not large animation bundles. |
| Evidence posture | Requirements and acceptance tests are proposals, not execution results. Code/build/CI/field/production/operational claims must be separately evidenced. |

### 1.1 Exactly what this file does

1. Pins a source-based current implementation inventory and gap assessment.
2. Specifies the allowed S0-A implementation boundary and its verifiable end state.
3. Designs the **technical discovery questions and decision gate** for S0-B without pretending an API or safe service identity already exists.
4. Defines a cohesive test matrix and handoff format so a later Builder receives a bounded, unambiguous work package.
5. Prevents hidden expansion into payment, quote acceptance, direct public database writes, universal marketplace synchronization, or platform-wide event runtime.

### 1.2 Explicitly does not do

No approved final brand copy; no product availability commitment; no public address/contact number chosen; no credential provisioning; no database migration design; no new public mutation RPC contract; no UI source modification; no deployment; no confirmation that `main` will remain unchanged. All changes must be reevaluated at exact future execution base.

## 2. Source hierarchy and inspected baselines

### 2.1 Authority hierarchy

1. Current GitHub `main`, active governance and canonical source-of-truth maps; technical code and tests for **implementation truth**.
2. Active TeeStock business policy, brand identity and website IA for **business/public offer truth**.
3. MGBOS architecture: domain ownership, permissions, command/event, business invariants and operational runbooks for **sensitive action truth**.
4. CX-00..CX-09 and CX-S0 product contract as **proposed product requirements**; they remain DRAFT until governed approval.
5. This discovery plan as **engineering analysis/proposal**, not an architecture decision record.

### 2.2 Repository readings made for this candidate

| Source (relative to repository root) | Read at | What it proves / does not prove |
|---|---|---|
| `systems/mgbos/apps/teestock/src/app/page.tsx` | `main@b9032bc...` | Home exists, minimal heading and `/custom-atelier` link; no real product homepage implemented. |
| `systems/mgbos/apps/teestock/src/app/custom-atelier/page.tsx` | same | Placeholder explicitly says ordering is unavailable; not a functioning inquiry experience. |
| `systems/mgbos/apps/teestock/src/app/layout.tsx` / `globals.css` | same | HTML language Indonesian, basic dark bootstrap CSS; not an adopted premium design-system or accessible full interaction proof. |
| `systems/mgbos/apps/teestock/src/app/health/route.ts` | same | Returns JSON with application/version; existence alone does not prove public readiness. |
| `systems/mgbos/apps/teestock/package.json` / `next.config.ts` | same | Next.js 16.3.6, React 19.3.0, 3102 dev/start and environment parser; no public server mutation evidence. |
| `systems/mgbos/apps/teestock/src/components`, `src/features`, `public` | same | `.gitkeep` bootstrap entries in checked directories; no app-specific public component library or approved marketing media surfaced. |
| `systems/mgbos/packages/validation/src/lead.ts` | same | Internal `createLeadSchema` includes organization, brand and channel UUIDs plus contact/inquiry; schema is **not** an authorization or public-submit contract. |
| `systems/mgbos/packages/validation/src/customAtelier.ts` | same | Strict production-style garment, sizes and decorations spec exists; not appropriate as unmodified mandatory public first-contact questionnaire. |
| `systems/mgbos/packages/domain/src/customAtelier.ts` | same | Reusable garment/decorations vocabulary for later controlled mapping; does not prove supply or sellability. |
| `systems/mgbos/apps/mgbos/src/app/(app)/leads/actions.ts` | same | Internal `createLeadAction` calls `requireAuth()`, checks `leads:create`, resolves brand/channel from logged-in organization and posts via server-held service role. **Not an anonymous public command.** |
| `systems/mgbos/AGENTS.md`, `systems/mgbos/package.json` | same | Code boundaries, safety rules, `pnpm check`, workspace scripts, explicit restrictions on DB/production actions. |
| `systems/mgbos/docs/architecture/command-event-model.md` | same | Authoritative command boundaries exist; full event runtime and transactional outbox are architectural direction, **not verified production implementation**. |
| `systems/mgbos/docs/architecture/permission-authorization-model.md` | same | Generalized nonhuman/service principal is still **NOT YET IMPLEMENTED** in the inspected spec. No blanket delegation for anonymous intake. |
| `docs/roadmaps/solo-founder-launch-roadmap.md`, `systems/mgbos/docs/product/teestock-operational-pilot-plan.md` | same | Assisted-first, genuine transactions and pilot readiness; customer storefront is not an unconditional pilot dependency. |
| `bisnis/teestock/10-product-tech/website-information-architecture.md` | same | Navigation jobs: Shop, Custom, For Business, Build Merch; do not invent alternate business taxonomy. |
| `CX-01`, `CX-02`, `CX-03`, `CX-05`, `CX-08`, `CX-09` inside PR #75 | `PR#75@59476dc2...` | Product intent, experience, customer journeys and quality gates; **DRAFT**, not merged or activated at inspected snapshot. |
| `teestock-cx-s0-premium-assisted-experience-contract.md` | Local author candidate (2026-10-17) | S0-A/S0-B product split and `S0-FR-001..040`/`S0-AC-001..040`; not independently approved or demonstrated live. |

**Recheck requirement:** before code work, refresh `main`, open PRs, changed-path overlap, security policy and related runtime source. An old snapshot is not a current authorization or proof of unchanged behavior.

### 2.3 Current status truth table

| Capability | Implemented at inspected source? | Consequence |
|---|---|---|
| Home bootstrap route | Yes | Replace only within approved S0-A scope. |
| Custom placeholder | Yes | Preserve truthful fallback until real destination approved. |
| Dedicated For Business page | Not observed under `apps/teestock/src/app/` | Candidate new route if Owner approves the public service and actual content. |
| Live customer contact ownership/hours/URL | NOT VERIFIED | **Block public CTA claim** until Operations provides destination and staffed ownership. |
| Public quote/inquiry form | NOT VERIFIED | S0-B not ready. |
| Public lead command / authz | NOT VERIFIED; inspected internal action is signed-in | Public handler must undergo separate discovery and permission review. |
| Inbox/rate-limit/abuse controls | NOT VERIFIED | S0-B safety gate open. |
| Stable public-safe receipt/reconciliation | NOT VERIFIED | Do not show a fabricated request reference. |
| Customer file upload | NOT VERIFIED | No public upload in S0-A, no default upload in S0-B. |
| Real product catalog/cart/payment | NOT VERIFIED | Do not display working purchase controls. |
| Customer identity/account portal | NOT VERIFIED | No private account, tracking or invoice lookup. |
| Event dispatcher/outbox | Full runtime NOT IMPLEMENTED per canonical reference | Do not promise event-driven notifications. |
| Real browser/device/performance evidence | NOT EXECUTED in this authoring task | Cannot claim public release readiness. |

## 3. Product-to-engineering boundary

### 3.1 Adopt the two slices without changing semantics

`S0-A` and `S0-B` are **deployment capability states**, not new customer entity types, new business states, or database schemas.

```text
S0-A  Approved business content → fast public routes → real attended human contact
                                    ↓
                              no authoritative web mutation

S0-B  Approved form → isolated public server admission → authorized MGBOS command
                                                     ↓
                       accepted record/reference + operator handoff + safe retry
```

No public frontend may directly hold or use a service-role credential. No browser receives organization administrative IDs as decision authority. A contact link is not itself a lead, order, payment or promise of response.

### 3.2 Two engineering consequences requiring different gates

| Dimension | S0-A | S0-B |
|---|---|---|
| Changes | Page/layout/style/static content, safe navigation/SEO/help | Plus public mutation boundary, validation, anti-abuse, trusted tenant binding, idempotency, persistence, protected operations |
| Data authority | None from passive web visit | MGBOS mutation with explicit scoped capability |
| Security risk | Public exposure, misinformation, contact/link privacy, web supply chain | Plus PII, abuse, unauthorized write, cross-org misattribution, duplicate/unknown outcome |
| Minimum evidence | Real attended CTA; browser/a11y/performance/content review | In addition, integration and adversarial command tests, operator recovery and approved identity/persistence design |
| Merge/release authority | Separate Owner + engineering and applicable quality gates | New higher-risk approval and independent applicable R3/R4/R5 review as classified, plus readiness evidence |
| Disable/fallback | Revert/hide unsafe route, keep true informational contact | Disable public submission independently; S0-A remains truthful if contact staffed |

**Risk assignment:** determine R0–R5 by actual change consequence under `docs/governance/cross-system-risk-classification.md`. This file does **not** self-declare a low-risk exemption for public PII and authorization. The highest applicable risk dimension wins.

## 4. S0-A — Proposed first bounded implementation package

**Proposed package:** `CX-S0-A / WP-CXS0-A01 / Public Premium Entry`. **STATUS: CANDIDATE FOR APPROVAL; NOT ASSIGNED.**

### 4.1 Business prerequisites to freeze (not invented)

- Which Custom and Business services may truthfully be advertised today, with evidence from TeeStock commercial/operations?
- Is there one real customer contact route per journey (same destination possible) and who monitors it?
- Which price/quantity/date wording is verified vs explicitly provisional?
- Are approved TeeStock logo, media and production examples available with usage rights? If not, launch with strong typography and no fabricated testimonial.
- Which contact/privacy/legal policy links are actually approved, published and maintained?
- Should Shop and Build Merch be visible informational options now, or clearly deferred? No fake cart / unavailable checkout CTA.

Owner may accept **bounded safe defaults**: text-first, no invented service counts or client logos; Custom/Business assisted contact; an informational Shop/Merch route only when it explains reality. An unknown destination cannot default to a guessed WhatsApp number.

### 4.2 Candidate allowed technical files (scope to be confirmed at WP time)

| Area | Existing or candidate path | Allowed intent |
|---|---|---|
| Global metadata/layout | `systems/mgbos/apps/teestock/src/app/layout.tsx` | Accurate page metadata, semantic root, import scoped styles; no auth. |
| Home | `.../src/app/page.tsx` | Job router and truthful actions. |
| Existing Custom | `.../src/app/custom-atelier/page.tsx` | Replace placeholder only when actual assisted route and content are verified. |
| Business | `.../src/app/<approved-business-segment>/page.tsx` | Human-assisted Business explanation; segment chosen after routing review, no invented permanent URL. |
| Help/contact | `.../src/app/<approved-help-segment>/page.tsx` | Public contact and policies only, no private status. |
| Style | `.../src/app/globals.css` / app-local components | Responsive neutral brand system, typography, a11y interaction, no heavy SDK. |
| Shared public primitives | `.../src/components/*` | Reusable nav, footer, link/button, availability notice, copy blocks. |
| Not found | `.../src/app/not-found.tsx` | Helpful safe recovery to genuine route. |
| Tests | app-local or existing workspace test location approved by Head Engineering | Browser/nav/a11y/content and failure tests that actually exercise TeeStock app. |
| Required documentation | Only directly impacted TeeStock implementation/readiness index or report | Record exact scope/evidence, no root README wholesale rewrite. |

`<approved-business-segment>` and `<approved-help-segment>` are **placeholders in this plan**, not literal file names or permission to invent route names. Decide from current IA, existing actual URLs and SEO compatibility during bounded planning.

### 4.3 Suggested component and page behavior

- Shared mobile-first header: visible brand identification, accessible menu, logical keyboard focus, primary job destinations with clear availability wording.
- Home first meaningful content: what TeeStock does, two primary assisted actions, optional supported Shop/Merch information without purchasable appearance.
- Custom: plain-language supported garment/customization examples, artwork-ready/not-ready path to real human assistance, requested timing not guaranteed.
- Business: actual organization use-cases, rough buyer information to prepare, formal quote issued only by reviewed commercial process.
- Help: factual contact channel, policy links if approved, unambiguous confidentiality/recovery text; no private lookup from guessable ID.
- Content/media: strong image placeholders **without fake evidence**; if approved image not available, intentional whitespace/typesetting wins over random stock mockups.
- Deep links and not-found: browser back and direct entry work; old Custom URL remains reachable unless Owner approves redirect policy.
- Progressive enhancement: absence of animations/images/fonts/analytics does not disable navigation/contact. Do not add client JS for static link-only behavior.
- A11y: semantic landmarks, skip link where useful, visible focus, touch targets, contrast, reduced motion, proper alt text, accessible menu behavior.
- SEO: title/description for real pages, semantic hierarchy, sensible canonicals only after hostname confirmed, no misleading structured business hours/ratings.

### 4.4 S0-A single-PR recommendation and exclusions

One bounded pull request **may** include the current Home/Custom replacement, new Business/Help routes, components/styles and directly corresponding tests if all content and contact evidence are available. Split only for real review/risk conflicts, not to inflate process. Keep PR draft until required owner content and quality controls pass.

**Explicit excluded files/effects:** `supabase/migrations/**`, financial schema, `apps/mgbos/src/app/(app)/leads/actions.ts`, packages/domain changes unrelated to static UX, secret `.env` values, new auth/session, service-role exposure, external CRM/AI integration, payment/cart, deployment and production configuration. No direct branch conflict with unrelated active PRs.

### 4.5 S0-A Definition of Done (candidate, gated)

- All active routes render actual truthful content without dummy e-commerce transactions or fabricated metrics.
- Required official contacts lead to a working, owned, supported destination; verification includes human owner evidence, not just valid URL syntax.
- Home, Custom, Business and Help navigate on real narrow/mobile viewports, desktop, keyboard, assistive sample and direct deep links.
- No hidden dependency on AI, third-party script, video or media for tasks to work.
- Response copy distinguishes available/deferred and human consultation from successful submission.
- Tests exercise **TeeStock** routes, not only existing internal MGBOS suite. Results evidence exact SHA/environment.
- No sensitive data in public pages, logs or build artifacts; no protected service key shipped to browser.
- Operations confirms ability to respond within actual, not invented, working practices; rollback/contact fallback established.
- No public release or deploy follows solely from PR merge.

## 5. S0-B — Technical discovery gate, not implementation scope

**Proposed future package:** `CX-S0-B / WP-CXS0-B01 / Governed Public Intake`. **STATE: BLOCKED_FOR_ARCHITECTURE_AND_OWNER_APPROVAL**.

### 5.1 Why existing internal Lead action is not a public endpoint

Inspected `apps/mgbos/src/app/(app)/leads/actions.ts::createLeadAction` requires a logged-in session and `leads:create` permission, determines organization/active brand via session, resolves an internal channel and issues a server-side REST insert using a service-role secret. These properties establish an **internal operator flow**, not safe guest creation semantics. It also returns a basic success/error, not a verified public replay-safe receipt/reconciliation API.

**Forbidden shortcuts:** removing `requireAuth`, allowing caller-selected arbitrary `organizationId` or `brandId`, exposing service-role key to browser, granting public access to `/rest/v1/leads`, proxying service-role REST calls without new governed security policy, or treating client-generated reference as accepted Lead ID. Do not give anonymous callers broad `leads:create` employee privileges.

`@mgbos/validation/createLeadSchema` validates field types, not authorization; `customAtelierRequirementSchema` expects detailed garment/decorations and is not a public minimal-inquiry contract. They may be reused **selectively** after an explicit trusted adapter design, without making customers fill a production work order.

### 5.2 Architecture options requiring choice, not implicit adoption

| Candidate | Benefits | Blocking questions | Disposition |
|---|---|---|---|
| **Option A — Public-safe server admission in TeeStock app → bounded MGBOS command** | Keeps same-site frontend simple and core truth in MGBOS | How is anonymous identity, trusted organization binding, anti-abuse, command authorization, idempotency, secure server-to-server call proven? | **Preferred direction**, not yet approved |
| Option B — External trusted intake provider → governed MGBOS integration | May enable assisted capture sooner using provider safeguards | Who owns data retention, webhooks, signatures, delivery and replay? Is provider authorized/affordable? | Conditional alternative; not assumed available |
| Option C — Contact-only S0-A with manual authorized operator entry | Low launch surface risk, easy physical fallback | Can founder maintain responsiveness? How are first-contact context and manual touch measured? | Safe fallback if B unready |

**No default database design:** whether a new public-specific command, gateway, service principal, token, quarantine row or adapter is needed must be resolved by MGBOS architecture/security owners after source-level discovery. This file does not invent tables or grant an ADR.

### 5.3 Server trust-boundary contract (target requirements)

```text
Customer (untrusted browser)
  → explicit public-safe server admission
       → authenticated server identity / bounded tenant binding
       → input schema + origin/request-context/anti-abuse checks
       → stable logical request identity + conflict/replay handling
       → authorized MGBOS mutation command
       → durable accepted record + customer-safe reference
       → recoverable assigned operator work
  ← accepted / rejected / unknown outcome (three distinct outcomes)
```

Required properties before enabling a public submit button:

1. **Tenant and brand binding:** trusted server configuration identifies permitted TeeStock organization/brand/channel. Ignore arbitrary client claims of tenant, staff role or target record.
2. **Public authority:** anonymous submit is an explicitly approved *narrow create-inquiry* capability, never a general `leads:create` operator privilege; subject to tested cross-org and abuse isolation.
3. **Customer identity:** contact data is a self-asserted claim pending verification, not an authenticated B2B user or approver.
4. **Admission:** bounded payload sizes, type/schema validation, bot/rate/volume controls, request origin policy suited to deployment, and safe error messages; no raw SQL or broad REST from browser.
5. **Command semantics:** same stable logical intent/retry identity cannot create duplicate actionable Lead. Same key with materially different input must resolve explicitly rather than silently conflate customers.
6. **Atomic observable effect:** only durable accepted MGBOS mutation can authorize customer receipt. A webhook/email/analytics event is insufficient.
7. **Uncertain outcome:** lost server response after commit is `UNKNOWN`, not automatically failed; reconcile before permitting new business effect.
8. **Operator routing:** accepted record must be findable by permitted role with source/channel, fields, contact, next action and age. Notification is secondary and may fail without deleting canonical work.
9. **Data privacy:** no contact/artwork/order details in URLs, public analytics, client errors, CDN cache, workflow logs, AI prompts or anonymous lookup responses.
10. **Disable/restore:** feature flag/traffic gate and documented rollback to S0-A, while preserving any already accepted records.

### 5.4 Logical input mapping — NOT an invented API shape

| Public input | Existing internal target candidate | Gate |
|---|---|---|
| Visitor need/title | Lead title/raw inquiry | Sanitization, length, meaningful consent; do not infer accepted order. |
| Customer contact name | Lead contact name | Not a verified actor; private storage. |
| Phone/email | Lead phone/email | At least one usable means where policy requires; no public lookups. |
| Company/Business context | Lead company name and free-text/spec fields | Business routing does not confer account membership. |
| Quantity or size split | Lead estimated quantity / downstream Requirement | Preserve unknowns; no silent zero/size mismatch; never force production spec at initial inquiry. |
| Requested date | Proposed explicit safe requirement field or structured intake text mapping | Exact durable representation unknown; must prove nothing becomes committed ship date. |
| Artwork readiness | Proposed safe representation for no-artwork vs have-artwork | Do not enable file upload without independent security/storage policy. |
| Source / campaign | Trusted channel + bounded attribution | Never accept arbitrary org/channel authority from client. |
| Marketing preference | Dedicated permission/consent record where law/policy requires | Do not conflate with transactional contact necessity. |
| Retry/request identity | Governed external command identity | Command-level stable key and fingerprint semantics; no assumption existing Lead POST is idempotent. |

**Gap:** current `createLeadSchema` does not, by itself, represent all desired public UX fields, consent, stable request identity, unknown outcome or versioned scope. Decide what belongs to governed Lead vs Requirement vs contact evidence without creating duplicate business identity.

### 5.5 Provider, orchestration and AI boundaries

- WhatsApp deep link is a **contact handoff**; unless governed capture integration is approved, it is not a confirmed Lead write.
- Email delivery may carry a follow-up message after durable acceptance but must not be the sole source of truth.
- n8n may notify/coordinate after a trusted signal; it must not unilaterally write MGBOS Lead/Quote state using unrestricted credentials.
- AI may help classify or draft only with governed data access; it cannot qualify a Lead as accepted commercial order or set final price/date.
- Existing general event package is reserved; full transactional outbox not yet verified. S0-B design cannot depend on nonexistent event dispatch.

### 5.6 S0-B stop/go decision gates

| Gate | Required evidence | On failure |
|---|---|---|
| B-G01 Trusted tenant/brand mapping | Exact source and synthetic multi-tenant negative tests | Keep S0-B disabled. |
| B-G02 Narrow command authorization | Approved service/guest principal contract, deny cases | Keep S0-B disabled. |
| B-G03 Idempotent record acceptance | Same key/retry/conflict/concurrent requests in disposable environment | Keep S0-B disabled. |
| B-G04 Error/reconciliation | Lost response, precommit failure, postcommit unknown, operator lookup | Keep S0-B disabled. |
| B-G05 Anti-abuse/privacy | Burst spam, malformed payload, injection, sensitive logs/URLs | Keep S0-B disabled. |
| B-G06 Operator readiness | Role can recover accepted records and take next action without chat retyping | Keep S0-B disabled. |
| B-G07 Legal and asset safety | Contact notice, retention, upload OFF unless independently approved | Keep S0-B disabled. |
| B-G08 Runtime/environment readiness | Isolated QA environment and release/restore evidence | Keep S0-B disabled. |

Passing a mocked browser form alone is **not** passing B-G01..08. No production/test remote DB traffic without verified authorization and environment identity.

## 6. Engineering requirements and direct acceptance pairing

Each `ENG-REQ` is a **technical acceptance obligation**, not an instruction that the corresponding implementation exists. One native `ENG-AC` directly checks each obligation. Business scenarios remain governed by `S0-AC-001..040`; this table provides a concise engineering test scope, not a second master PRD.

| Engineering ID | Slice | Testable engineering requirement | Direct acceptance ID |
|---|---|---|---|
| `ENG-REQ-001` | A | Public Home shows true available/deferred job routes. | `ENG-AC-001` |
| `ENG-REQ-002` | A | Existing Custom route remains deep-linkable and truthful. | `ENG-AC-002` |
| `ENG-REQ-003` | A | Business route has approved real content/contact if active. | `ENG-AC-003` |
| `ENG-REQ-004` | A | Public help/contact is human-owned and reachable without login. | `ENG-AC-004` |
| `ENG-REQ-005` | A | Navigation supports keyboard, touch and small viewport. | `ENG-AC-005` |
| `ENG-REQ-006` | A | Unknown/unavailable route recovers safely with orientation. | `ENG-AC-006` |
| `ENG-REQ-007` | A | Content uses approved offer/capacity/rights with no fake proof. | `ENG-AC-007` |
| `ENG-REQ-008` | A | No checkout, fake quote or account interface is exposed. | `ENG-AC-008` |
| `ENG-REQ-009` | A | Core task works without heavy assets, JS enhancement or AI. | `ENG-AC-009` |
| `ENG-REQ-010` | A | Metadata/SEO titles and public privacy links are meaningful. | `ENG-AC-010` |
| `ENG-REQ-011` | A | Accessible focus, forms/links, contrast and reduced motion. | `ENG-AC-011` |
| `ENG-REQ-012` | A | Measured lab performance includes tested mobile conditions. | `ENG-AC-012` |
| `ENG-REQ-013` | A | Safe service fallback if contact destination becomes unavailable. | `ENG-AC-013` |
| `ENG-REQ-014` | A | Deployment/rollback and operations owner are identifiable. | `ENG-AC-014` |
| `ENG-REQ-015` | B | Public admission does not reuse internal logged-in Lead action as anonymous. | `ENG-AC-015` |
| `ENG-REQ-016` | B | Trusted server binds org/brand/channel without client authority. | `ENG-AC-016` |
| `ENG-REQ-017` | B | Minimum public input is validated without production-spec coercion. | `ENG-AC-017` |
| `ENG-REQ-018` | B | Progressive Custom/Business fields retain legitimate input. | `ENG-AC-018` |
| `ENG-REQ-019` | B | No-artwork inquiry remains valid and upload disabled unless approved. | `ENG-AC-019` |
| `ENG-REQ-020` | B | Same logical submission retries have one intended accepted effect. | `ENG-AC-020` |
| `ENG-REQ-021` | B | Same key/different payload conflicts are explicitly handled. | `ENG-AC-021` |
| `ENG-REQ-022` | B | Source-issued durable acceptance reference gates success UI. | `ENG-AC-022` |
| `ENG-REQ-023` | B | Lost response outcome is uncertain and safely reconciled. | `ENG-AC-023` |
| `ENG-REQ-024` | B | Anti-abuse limits and data minimization protect public writes. | `ENG-AC-024` |
| `ENG-REQ-025` | B | Private/cross-org lookup and status guessing do not leak data. | `ENG-AC-025` |
| `ENG-REQ-026` | B | Operator can find canonical accepted input and next action. | `ENG-AC-026` |
| `ENG-REQ-027` | B | Notification failure does not erase or duplicate accepted work. | `ENG-AC-027` |
| `ENG-REQ-028` | B | Failure disables form without breaking S0-A assisted route. | `ENG-AC-028` |
| `ENG-REQ-029` | B | Inquiry does not mutate quote/order/payment/production authority. | `ENG-AC-029` |
| `ENG-REQ-030` | B | S0-B is verified under exact test revision/environment and approved risk gate. | `ENG-AC-030` |

### 6.1 Acceptance scenarios — `ENG-AC-001..030` (NOT EXECUTED)

| Acceptance ID | Observable test with expected result | Evidence minimum |
|---|---|---|
| `ENG-AC-001` | Open Home on mobile and desktop; active/deferred intent cards point only to truthful endpoints; no dead purchase path. | Browser navigation + approved content registry. |
| `ENG-AC-002` | Enter Custom via direct URL, reload, browser back, and stale link; existing Custom permalink resolves without fake ordering. | HTTP/browser routes + state screenshots. |
| `ENG-AC-003` | Visit Business from nav and direct URL; offer facts and human contact are verified; when not approved, route is honestly unavailable. | Copy provenance + real route check. |
| `ENG-AC-004` | With no login, navigate help; human owner confirms tested destination and fallback. | Browser/contact proof with no private data. |
| `ENG-AC-005` | Tap/keyboard traverse mobile menu, expanded text, narrow viewport and focus cycle; no clipping/hidden action. | Browser/keyboard + viewport recording. |
| `ENG-AC-006` | Request unknown path; route provides valid back-to-service navigation and no private context. | HTTP 404 + keyboard browser. |
| `ENG-AC-007` | Audit every claim/logo/sample against approved Owner source; unproved assets omitted rather than fabricated. | Content/rights checklist with Owner sign-off. |
| `ENG-AC-008` | Search current public route graph for executable cart/payment/quote acceptance; none appears or works without corresponding approved capability. | Route/source inspection + browser negative. |
| `ENG-AC-009` | Disable video, webfonts, analytics, optional JavaScript enhancements, motion and imagery; primary text/contact still usable. | Browser degraded-mode test. |
| `ENG-AC-010` | Inspect titles, descriptions, headings, policy destinations and robots; no guessed hours, fake review schema or private indexed URL. | Static/HTTP inspection. |
| `ENG-AC-011` | Manual keyboard/focus and screen-reader sample plus automated WCAG 2.2 AA screening; blockers logged and fixed/accepted. | A11y audit records, not just Lighthouse score. |
| `ENG-AC-012` | Repeat mobile/desktop lab measurements per CX-08 on actual routes; report LCP/INP/CLS inputs and any NOT_VERIFIED_FIELD honestly. | Tool/run/version/device/network/artifact. |
| `ENG-AC-013` | Disable contact destination in safe test/fixture; UI does not advertise unavailable channel and shows approved recovery. | Browser/content failure test. |
| `ENG-AC-014` | Simulate content rollback / feature disable; identify Owner, deploy target, monitoring/check route and tested recoverability before public exposure. | Runbook + deployment-specific operator evidence. |
| `ENG-AC-015` | Anonymous user cannot execute existing `createLeadAction` or obtain employee `leads:create` through a public page. | Source review + authorization negative test. |
| `ENG-AC-016` | Send forged organization/brand/channel/user ID; backend ignores authority fields and writes only to trusted scoped TeeStock target or rejects. | Server-command + cross-org negative tests. |
| `ENG-AC-017` | Try minimal valid, invalid contact, bad quantity, oversized notes and unknown print method; retain legitimate inquiry, reject invalid effect. | Validation + browser + backend tests. |
| `ENG-AC-018` | Switch Custom↔Business, reveal/hide invoice/size fields, correct input and review; retained fields consistent and accessible. | Keyboard/mobile test with state assertions. |
| `ENG-AC-019` | Select artwork not ready; form remains viable. Attempt upload while unapproved; upload is unavailable, not silently accepted. | Browser negative + policy review. |
| `ENG-AC-020` | Rapid clicks and concurrent same-logical-request calls; at most one accepted intended canonical effect. | Disposable DB + exact command evidence. |
| `ENG-AC-021` | Reuse idempotency identity with altered material input; explicit conflict or governed new intent, never silent reuse/cross-customer disclosure. | Server contract/negative concurrency. |
| `ENG-AC-022` | Verify success/reference matches accepted MGBOS record; precommit failure and frontend mock cannot show received. | End-to-end record + UI comparison. |
| `ENG-AC-023` | Persist request then drop response; UI shows UNKNOWN, approved retry/reconciliation preserves one effect and safe next action. | Fault injection + authoritative read evidence. |
| `ENG-AC-024` | Burst spam, malformed payload, SSRF/file injection attempts and error/log inspection; intake bounded, no raw PII or secret leakage. | Rate/security/privacy tests. |
| `ENG-AC-025` | Guessed/foreign reference and cross-organization actor cannot enumerate requests or private status. | Negative access + non-enumeration tests. |
| `ENG-AC-026` | An authorized operator opens one accepted submission; intent/contact/source/notes and pending review next action available without transcription. | Operator walkthrough + canonical record. |
| `ENG-AC-027` | Provider notification fails or duplicates; canonical Lead remains one and operator still discovers it; no fabricated confirmation. | Fault injection + record and queue evidence. |
| `ENG-AC-028` | Disable S0-B route/flag after staged error; S0-A Custom/Business contact stays reachable, old accepted records still accessible to operators. | Feature disable + recovery test. |
| `ENG-AC-029` | Submit valid inquiry with quote/payment/production stores under observation; no downstream financial/work effect without separate authorized command. | Cross-domain invariants/negative E2E. |
| `ENG-AC-030` | Read exact HEAD, environment guard, hosted required CI and owner/security approval; unverified high-risk prerequisite blocks S0-B. | Revision-bound release gate record. |

**Coverage interpretation:** these 30 scenarios are named proposed tests. They are not proofs and do not replace 40 `S0-AC` product outcomes. An implementer may use equivalent test names only if every applicable behavior and evidence requirement remains covered.

## 7. Public copy and visual quality — approval without guesswork

### 7.1 Content provenance registry (required before S0-A public release)

| Public claim | Owner evidence | Default when unknown |
|---|---|---|
| Apparel types currently serviceable | Operations/vendor capability, brand/offer policy | Use broad conditional service description; omit unsupported specifics. |
| Printing methods | Confirmed production/vendor support | Offer explanation/consultation, not guaranteed method. |
| Minimum quantity and bulk threshold | Actual supported commercial policy | “Jumlah akan ditinjau”, not invented minimum. |
| Production/delivery estimate | Current lead-time/capacity evidence | Requested/unconfirmed; no hours/days SLA. |
| Contact channel | Verified owned URL/account with attention owner | Block actionable CTA until provided. |
| Location/hours | Verified public operations data | Omit instead of inventing. |
| Sample portfolio/brand/customer logos | Rights and provenance approval | Use non-deceptive text-first design. |
| Pricing/discount claim | Approved commercial price policy | No binding price or automatic promo. |
| Privacy/returns/policies | Active approved policy and public destination | Don't publish unsupported legal statement. |
| Website release status | Exact deployed source and monitoring proof | State planned/internal if not deployed. |

### 7.2 Design decisions are bounded to component form

Layout spacing, card composition, small-screen responsive patterns, accessible menu mechanics, iconography, typography implementation and modest interaction animation MAY be selected by Builder within **approved TeeStock brand identity and CX-03/CX-08 constraints**. Brand strategy, final claims, new revenue model, product price, legal/privacy rights and production commitment MAY NOT be invented by Builder to fill blank sections.

### 7.3 Performance discipline

- Prioritize actual meaningful content and nav before interactive decoration; prefer server-rendered static content where feasible.
- Keep JS and hydration only for interactions needing it (e.g. accessible mobile menu). Do not implement a 3D configurator, image slider library or AI chatbot in S0-A.
- Avoid unapproved external fonts/remote image/CDN dependencies with legal/performance unknowns.
- Measure routes, not only global score. CX-08 proposes **LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at real-user p75**, mobile and desktop separately.
- Before real eligible traffic, mark field `NOT_VERIFIED`; lab results must include device, throttling, build/commit and tested path. No hard-coded “all green” statement.
- Accessibility target per approved CX quality contract is WCAG 2.2 AA; automated scanners are not comprehensive.

## 8. Tests, CI and environment contract

### 8.1 Source-proven commands and precautions

Workspace `systems/mgbos/package.json` includes `pnpm check` (format, lint, SQL lint, typecheck, unit tests, build). TeeStock app has `pnpm --filter @mgbos/teestock build` and `typecheck` via the workspace. Scripts exist for browser QA, but **their existence does not show that they currently exercise TeeStock public routes**.

Suggested verification sequence for future authorized S0-A WP:

1. `git status`, exact base/head, changed file inventory, current PR and branch protection; preserve all unrelated/untracked work.
2. Run applicable focused static/unit/route tests for new S0-A pages and components.
3. From `systems/mgbos/`, run `pnpm check` with supported Node 22.23.2 / pnpm 10.34.5 as declared, and report failures precisely.
4. Build TeeStock in the real production build mode; test HTTP page/health on an isolated local test server on 3102 or properly configured equivalent.
5. Execute actual TeeStock mobile/keyboard/deep-link/404/degraded-media browser flows, not only the internal MGBOS app browser suite.
6. Inspect public bundle/HTTP output for secret/PII exposure. Verify no cross-scope diff.
7. Validate required hosted CI and exact SHA, then obtain applicable independent review before any production release.

**Do not run** DB reset, destructive service-role E2E, production writes, deployment or live-customer communications as a side effect of static S0-A QA. Any later S0-B database tests must use a newly verified isolated disposable environment and obey one-shot destructive-test guard when applicable.

### 8.2 Evidence levels must not be conflated

| State | What counts | What does NOT count |
|---|---|---|
| `PLAN_READY` | Reviewed source/requirements and bounded plan | Feature coded |
| `IMPLEMENTED` | Actual diff and exact head | Builder says done |
| `LOCAL_VERIFIED` | Command outputs + browser tests + exact environment | Markdown test checklist |
| `HOSTED_CI_VERIFIED` | Required checks on exact HEAD | Older successful run |
| `REVIEWED` | Applicable independent review for actual consequence | Same-author self-review claimed independent |
| `DEPLOYED` | Exact deploy target/SHA/health | Merge or CI alone |
| `OPERATIONALLY_ACCEPTED` | Owner contact/response process, monitoring, recovery | Visually good demo or synthetic screenshot |

### 8.3 Required negative test matrix per capability

| Test class | S0-A | S0-B |
|---|---|---|
| Unavailable external contact | Required | Required fallback |
| Broken deep link/404 | Required | Required |
| Keyboard/mobile/focus | Required | Required including form |
| Unapproved marketing claim | Required | Required |
| Provider image/font/AI failure | Required | Required |
| Wrong/cross-org principal | Not applicable to static site (verify no private APIs) | Blocking server auth negative |
| Duplicate submit/network timeout | No web submit | Blocking transaction replay/fault test |
| Burst spam/injection/PII logs | Public content/safe links review | Blocking abuse/security suite |
| Email/notification outage | Not applicable to write | Blocking queue/recovery proof |
| Money/quote/production effects | Assert none exposed | Prove none introduced by inquiry |
| Rollback | Route/content rollback | Disable mutation but preserve accepted records |

## 9. Dependencies, risks and explicit decisions

### 9.1 Narrow decision register

| ID | Question | Recommended working direction | Can implementation start without it? |
|---|---|---|---|
| `S0E-DEC-01` | What real Custom/Business offer is public? | Advertise only capability backed by TeeStock Operations | No active offer claim until validated |
| `S0E-DEC-02` | What exact contact URL/account and response owner? | One attended source-of-truth channel per service, may be shared | No active contact CTA without it |
| `S0E-DEC-03` | What routes stay visible for Shop/Merch? | Honest informational/deferred, no fake purchase | Yes, use safe hidden/deferred with approval |
| `S0E-DEC-04` | Which media/logo/testimonial rights? | Text-first until usable rights-cleared assets | Yes, omit questionable media |
| `S0E-DEC-05` | Which public legal/privacy pages? | Link existing approved policy only | Public publication needs verified disclosure |
| `S0E-DEC-06` | S0-A route layout/metadata/quality? | Approved brand + IA, small fast UI, no new frameworks | Yes, normal bounded UI discretion |
| `S0E-DEC-07` | Is S0-B public form authorized? | Separate design, security/risk review and WP | **No**, hard gate |
| `S0E-DEC-08` | Guest command identity, tenant/brand/channel binding? | Trusted narrow server-mediated admission | **No**, hard gate |
| `S0E-DEC-09` | Request replay/idempotency and unknown-response recovery? | Stable identity + collision policy + reconciliation | **No**, hard gate |
| `S0E-DEC-10` | Artwork file handling? | Off for first S0-B unless authorized secure pipeline | Yes, retain no-artwork/assisted path |
| `S0E-DEC-11` | Which provider communications are enabled? | Human first; only approved transactional notifications later | Yes, no unverified automatic sending |
| `S0E-DEC-12` | Who approves public release and monitors it? | Owner + Head Engineering + operations readiness | No deployment authorization until explicit |

**Operational shorthand for nontechnical Owner:** the only immediately necessary human inputs for S0-A publication are *what you actually offer, where real inquiries go, who answers them, and which truthful policy/media facts can be published*. Technical route/menu implementation is engineering work, not a questionnaire to the Owner.

### 9.2 Risk register — preventative action

| ID | Failure | Business impact | Mitigation |
|---|---|---|---|
| `S0E-RISK-01` | Fancy landing implies non-existent checkout | Trust and customer confusion | True capability labels and negative link test |
| `S0E-RISK-02` | Dead WhatsApp/email destination | Lost customer inquiries | Owner-confirmed destination and ongoing monitoring |
| `S0E-RISK-03` | Invented production promise/portfolio | Economic, legal and brand risk | Content-source registry, omit unsupported proof |
| `S0E-RISK-04` | Heavy video/scripts delay CTA | Low mobile conversion | Progressive enhancement and CX-08 performance tests |
| `S0E-RISK-05` | Mobile nav hides or blocks CTA | Failed task/a11y | Real keyboard/mobile/zoom coverage |
| `S0E-RISK-06` | Anonymous caller reuses employee Lead action | Tenant/security breach | Separate public admission, deny service-role exposure |
| `S0E-RISK-07` | Same request inserted twice | Founder overhead/duplicate follow-up | Command idempotency, collision/replay tests |
| `S0E-RISK-08` | Lost response produces false failure or success | Duplicate lead/poor trust | UNKNOWN + reconciliation |
| `S0E-RISK-09` | Contact/PII leaks through analytics/logs | Privacy harm | Minimize, isolate, mask and test |
| `S0E-RISK-10` | Artwork upload enabled without policy | Security/IP risk | Upload off until approved |
| `S0E-RISK-11` | Notification outage hides accepted inquiry | Lost sales / hidden work | Canonical inbox independent of messaging |
| `S0E-RISK-12` | Site release treated as real-pilot completion | Governance and financial risk | Separate operational pilot gates |
| `S0E-RISK-13` | Storefront work collides with PR #75 or #73 | Lost work/review churn | Exact PR-diff/changed-path check before branch |
| `S0E-RISK-14` | Team confuses DRAFT spec with implementation approval | Unauthorized scope | Explicit Owner-approved bounded WP required |

## 10. Small, useful delivery sequence (recommendation only)

### Step 0 — Final source and owner input check

- Refresh `main`, PR #75, PR #73, routing docs and changed-path conflicts.
- Confirm the CX-S0 product contract has been placed in repository and reviewed for actual selected scope.
- Validate public offer, real staffed contact and minimal rights-safe public copy.
- Head Engineering classifies risk per proposed path and selects exactly one bounded S0-A work package.

### Step 1 — `WP-CXS0-A01`: Premium public entry candidate

- Scope: static/semistatic customer pages, responsive header/footer, honest content, publicly safe help/404 and directly applicable tests.
- Excludes: customer form/API writes, new DB, login, uploads, AI, checkout, production, payment.
- Deliverable: one bounded app PR + evidence, **not deployment**.
- Verification: source-to-page copy trace, actual browser navigation/mobile/keyboard, production build, `pnpm check`, focused route tests, independent review as required.
- Stop if real CTA destination or content policy absent, or new source reveals materially different route architecture.

### Step 2 — Public-facing S0-A acceptance before exposure

- Owner/Operations confirms contact is monitored and capacity for response is available.
- Independent reviewer checks relevant UX/brand/privacy/performance and no misleading capability, proportional to risk.
- Engineering verifies environment, monitoring, exact deploy target and rollback according to runbooks.
- Only a separately approved release operator/authority may publish it.

### Step 3 — S0-B technical architecture discovery, only when justified

- Audit current source for public command entry, server principal strategy, trusted brand/channel mapping, idempotency key support, durable receipt/lookup, operator routing and anti-abuse.
- Produce a bounded architecture impact analysis against canonical owner; do not invent generalized Service Principal implementation merely because this plan mentions it.
- Select minimal safe adapter option, owner/privacy policies and acceptance fixtures.
- Obtain owner and appropriate R-level engineering authorization for a **separate** `WP-CXS0-B01`.

### Step 4 — S0-B implementation and independent acceptance, after Step 3

- Build only an approved public-safe intake integration, not a generic customer CRM.
- Demonstrate all B-G01..08 and applicable `ENG-AC-015..030` in a safe disposable test environment and targeted browser suite.
- Feature disable/rollback must retain already committed MGBOS leads. Public success must remain truth-based.
- Publish via explicit future permission; no automatic progression because S0-A shipped.

## 11. Bounded Builder handoff template — to be instantiated only after approval

**Purpose:** eliminate repeated Owner copy-paste of incomplete requirements. Head Engineering should fill this minimal work contract once S0-A content gates are closed; do not give Antigravity the whole speculative S0-B mandate.

```text
ROLE: Antigravity — Bounded Implementation Engineer
REPOSITORY: Rizkybuilds/bisnishub
BASE: <fresh full SHA, inspected immediately before assignment>
WP: WP-CXS0-A01 (only after Owner/Head Engineering approval)
OBJECTIVE: Implement approved S0-A premium public entry; do not build form/API.
ALLOWED PATHS: exact app-local pages/components/styles + tests and directly necessary docs
DENIED: DB/SQL/migrations, service principals, public lead writes, secrets,
        auth bypass, fake checkout, payment, AI, unrelated PR files, production
SOURCE: active TeeStock business/brand/IA + CX-S0 product + this engineering plan
ACCEPTANCE: applicable S0-AC and ENG-AC-001..014, CI, browser, privacy/content review
RULES: preserve other work; no force push; exact risk/branch protection policies
STOP: scope conflict, unapproved CTA, new architecture need, unsafe identity or data
RETURN: exact base/head, diff, test outputs, browser evidence, unresolved blocker, PR URL
NO MERGE / NO DEPLOY unless separately authorized.
```

This template is **not an issued work package**. Antigravity must not execute it solely because it is present in a DRAFT document.

## 12. Internal author QA and acceptance-readiness register

### 12.1 What was actually reviewed

- Existing CX-S0 product contract as a complete local file, including S0-FR/S0-AC 40-pair matrix, capability split, owner decisions and gates.
- Source of actual TeeStock app bootstrap, dependencies, environment placeholders, CSS and basic health route.
- Existing internal `createLeadAction` and Lead/Custom Atelier validation/domain sources, with explicit documented prohibition on treating internal auth as public.
- Relevant MGBOS permission/event architecture and `AGENTS.md` runtime safety restrictions.
- Existing canonical roadmap, assisted operational pilot, website IA and product CX-slice constraints.
- One-to-one `ENG-REQ-001..030` ↔ `ENG-AC-001..030` correctness by primary behavior, gated slice and reference integrity.

### 12.2 Known limitations that stay visible

- No repo writes, test execution, runtime page screenshots, real end-user research, email/WhatsApp ownership verification, S0-A content approval or production health checks were performed.
- Existing internal MGBOS Lead mutation uses server-role REST credentials in an **authenticated application action**; no evidence in the inspected source that a public caller may securely invoke it.
- The CX-00..09 package is a referenced **DRAFT PR**, not source of binding technical authorization; status should be checked again before promotion.
- The external CX-S0 product contract may exist locally but is not assumed merged into GitHub; actual availability at selected path needs checking before work assignment.
- This plan does not fix pre-existing MGBOS security/risk findings or authorize any live-customer test.

### 12.3 Self-review completion gates (document quality only)

| Check | Author disposition |
|---|---|
| Source observations refer to inspected real paths | REVIEWED; check refresh gate explicit |
| S0-A vs S0-B boundaries do not overlap | REVIEWED |
| No schema/API design invented as existing truth | REVIEWED |
| No anonymous use of employee action or service-role credentials permitted | REVIEWED |
| 30 ENG requirements each have one directly corresponding acceptance row | STRUCTURAL CHECK REQUIRED IN FILE QA |
| All risk/decision IDs unique and consecutive | STRUCTURAL CHECK REQUIRED IN FILE QA |
| No redefinition of business status/payment/production | REVIEWED |
| No unauthorized work package, PR/merge/deploy approval | REVIEWED |
| Scope and path appropriate for engineering plan | REVIEWED |
| Fresh repo state, actual browser and CI acceptance | NOT EXECUTED / LATER |

## 13. Engineering-ready disposition and next action

**This document is ready for Owner review and copy-paste as a finished technical planning candidate. It is not ready to trigger a full implementation without gates.**

`CURRENT_STATE = ENGINEERING_DISCOVERY_PREPARED_FOR_CX_S0`  
`FIRST_RECOMMENDED_BUILD = S0-A PREMIUM PUBLIC ENTRY`  
`S0_B_PUBLIC_MUTATION = BLOCKED_UNTIL_APPROVED_SECURITY_AND_COMMAND_BOUNDARY`  
`NEXT_AUTHORIZED_ACTION = OWNER_REVIEWS_S0_A_CONTENT_AND_EXPLICITLY_APPROVES_BOUNDED_WP`  
`MERGE_AND_DEPLOY_AUTHORIZATION = NONE`

Once the narrow public offer/contact facts are confirmed and a fresh base checked, Head Engineering may issue a **single** exact-scope Antigravity handoff for `WP-CXS0-A01`. S0-B remains separate, with its own architecture and verification gates. This avoids turning documentation into an endless PRD cycle while still protecting real customers and authoritative MGBOS transactions.

## 14. Source register and crosslinks

**Repository:** `https://github.com/Rizkybuilds/bisnishub`  
**Checked implementation baseline:** `main@b9032bc26e8a623e75aa0ef7ab48249b5230bf56`  
**Checked product-reference HEAD:** `PR#75@59476dc2ba47a9ca1ba5347f6fa8554962006192`

| Logical area | Canonical or draft source path |
|---|---|
| Roadmap | `docs/roadmaps/solo-founder-launch-roadmap.md` |
| Engineering policy | `systems/mgbos/AGENTS.md`; `systems/mgbos/docs/engineering/maintenance-policy.md` |
| Risk | `docs/governance/cross-system-risk-classification.md` |
| Architecture | `systems/mgbos/docs/architecture/command-event-model.md`; `permission-authorization-model.md` |
| Operational pilot | `systems/mgbos/docs/product/teestock-operational-pilot-plan.md` |
| TeeStock business IA | `bisnis/teestock/10-product-tech/website-information-architecture.md` |
| Brand | `bisnis/teestock/02-brand/brand-identity-system.md` |
| Product package | `systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md` through `cx-09-phased-delivery-product-validation-plan.md` (individual paths) |
| S0 product contract | `systems/mgbos/docs/product/teestock-customer-platform/cx-s0-premium-assisted-experience-contract.md` (candidate) |
| TeeStock source | `systems/mgbos/apps/teestock/src/app/*`; `systems/mgbos/apps/teestock/package.json` |
| Internal Lead action | `systems/mgbos/apps/mgbos/src/app/(app)/leads/actions.ts` |
| Existing validation | `systems/mgbos/packages/validation/src/lead.ts`; `customAtelier.ts` |
| Existing domain | `systems/mgbos/packages/domain/src/lead.ts`; `customAtelier.ts` |

**Change policy:** if current code, governance, owner decisions or CX package diff conflict with this document, update this plan at a new version after inspecting the authoritative change. Do not silently rewrite history or promote planning statements into runtime truth.
