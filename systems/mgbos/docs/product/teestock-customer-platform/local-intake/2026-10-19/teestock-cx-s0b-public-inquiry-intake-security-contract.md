---
canonical_id: proposed.mgbos.engineering.teestock-cx-s0b-public-inquiry-intake-security-contract
status: DRAFT
version: 1.0.0
owner: Rizky
author: ChatGPT / Head Engineering
approver: PENDING_OWNER_APPROVAL
scope: teestock-customer-platform-cx-s0b-public-inquiry
document_class: engineering-design-contract
normative_authority: NONE_UNTIL_GOVERNED_APPROVAL
implementation_authorization: NONE
production_access_authorization: NONE
deployment_authorization: NONE
repository: Rizkybuilds/bisnishub
source_baseline_commit: 57eaafbb0ceef99a5fc6b2d77d724f6ff510727d
source_checked_at: '2026-10-17'
source_inspection: GITHUB_READ_ONLY_SELECTIVE_SOURCE_AND_CANONICAL_DOCS
last_reviewed: '2026-10-17'
review_cadence: BEFORE_APPROVED_IMPLEMENTATION_OR_MATERIAL_SECURITY_CHANGE
proposed_destination: systems/mgbos/docs/engineering/teestock-cx-s0b-public-inquiry-intake-security-contract.md
depends_on:
  - ../product/teestock-customer-platform/cx-01-master-prd.md
  - ../product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md
  - ../product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md
  - ../product/teestock-customer-platform/cx-05-custom-b2b-ordering-experience.md
  - ../product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md
  - ../product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md
  - ../architecture/domain-map-capability-ownership.md
  - ../architecture/canonical-data-model.md
  - ../architecture/business-state-machines.md
  - ../architecture/permission-authorization-model.md
  - ../architecture/command-event-model.md
  - ../../AGENTS.md
  - ../../../../docs/governance/documentation-constitution.md
supersedes: null
---

# TeeStock CX-S0-B — Public Inquiry & MGBOS Intake Security Contract v1.0.0

> **AUTHOR-REVIEWED FINAL DOCUMENT CANDIDATE — DRAFT / NON-CANONICAL / NO BUILDER AUTHORITY / NO DEPLOY.** This is one bounded engineering design, not an authorization to create a database migration, public API, environment, or production integration. The Owner must approve an implementation work package and its risk treatment separately. No S0-B implementation or live testing is claimed by this document.

## 1. Executive decision

**Recommended next capability:** make the existing TeeStock Custom / Business website capable of receiving *one* secure, traceable **public inquiry** that becomes *one* governed `NEW` Lead in MGBOS and appears in an existing authorized operator workflow. This is a lead inquiry, **not** an accepted order, quotation, customer account, payment, vendor instruction, production job, or guarantee of service capacity.

**What is frozen as a recommended design direction, subject to approval:**

1. Reuse MGBOS `app.leads` and the existing Lead lifecycle as business truth. No parallel CRM, separate canonical inquiry master, or new order entity.
2. Introduce an explicitly restricted **public intake admission boundary**, separate from the existing authenticated MGBOS Lead operator action. Its internal implementation and credential design require an authorization/security review.
3. Commit a stable request identity, payload fingerprint, accepted Lead association and minimal audit evidence **atomically** with the business effect so replay cannot create duplicate actionable Leads.
4. Receive customer PII only on the protected server; the customer sees a safe receipt reference only after durable acceptance. Operators see the complete, authorized record inside MGBOS.
5. Keep upload, payments, quote acceptance, AI qualification, automated messaging and customer account creation **OFF**.
6. Public release requires verified privacy controls, staffed follow-up, tested negative cases, operational readiness and explicit Owner authorization. S0-A remains available as a truthful informational fallback.

**Boundary between decisions:** This document selects a *recommended architecture pattern*. It does not choose a production credential, cloud provider, third-party CAPTCHA product, legal retention period, SLA, commercial promise, or release date without evidence.

## 2. Exact source and implementation truth

### 2.1 Source hierarchy

1. Actual source at `main@57eaafbb0ceef99a5fc6b2d77d724f6ff510727d` for implementation facts.
2. ACTIVE canonical MGBOS architecture (`systems/mgbos/docs/architecture/`) and repository governance for business semantics and security.
3. Newly integrated CX-00..09: **DRAFT product intent only**, not authority to weaken security or activate services.
4. Prior S0-A product/engineering author-reviewed working files: non-canonical companion context, not authoritative repository dependencies.

### 2.2 Exact observations (SOURCE-VERIFIED unless qualified)

| Evidence | Observed fact | Engineering consequence |
|---|---|---|
| `apps/teestock/src/app/page.tsx`, `custom/page.tsx`, `business/page.tsx`, `support/contact/page.tsx` | S0-A informational pages exist; Contact states online channels are being prepared. | Do not imply online intake exists or publish form CTA prematurely. |
| `apps/mgbos/src/app/(app)/leads/actions.ts` | `createLeadAction` requires `requireAuth()` and `checkPermission(session, 'leads:create')`; accesses service-role-backed server REST and sets `NEW`. | **NEVER** reuse this action as a guest/anonymous entrypoint or expose its credential. |
| `packages/validation/src/lead.ts` | `createLeadSchema` expects trusted organization/brand/channel UUIDs, lead title, optional names/contact/raw inquiry, quantity and budget. | Public visitor must not supply privileged tenancy or canonical source IDs. Public schema is distinct. |
| `packages/domain/src/lead.ts` | Lead statuses `NEW`, `CONTACTED`, `QUALIFYING`, `QUALIFIED`, `DISQUALIFIED`, `CONVERTED`, `LOST`; qualification exists but is an internal business operation. | Public submission starts `NEW` only; no automatic qualifying or conversion. |
| `supabase/migrations/20260924040000_leads_pipeline.sql` | `app.leads` has `organization_id`, `brand_id`, `channel_id`, PII columns, `lead_number`, `status`, etc.; service role has full access and authenticated membership policies exist. | Generic table access is too broad for an anonymous intake. |
| `supabase/migrations/20260924050000_atomic_leads_and_customers.sql` | `transition_lead_status` and `convert_lead_to_customer` are separate governed operations. | The public intake must not call either or bypass their guards. |
| `docs/architecture/permission-authorization-model.md` | Organization and capability boundary are authoritative; generalized service-principal capability is a target, not proven implemented everywhere. | Authentication/role choice is a **hard pre-implementation gate**. |
| `docs/architecture/command-event-model.md` | Strong request identity and idempotency are canonical targets; full production outbox/event dispatch is not proven implemented. | Do not depend on unbuilt outbox, agent, or notification services. |
| CX-05 and CX-08 | Accepted inquiry must have durable reference and truthful next action; duplicate retry, notification failure, invalid input, and recovery are explicit product acceptance concerns. | Design must produce test evidence at command, integration, and browser layers. |

**NOT VERIFIED:** a deployed public intake credential, a restricted guest/service principal, a deployed transactional retry table, canonical form storage for additional S0-B fields, a reliable operator notification endpoint, privacy/retention policy approval, staffed contact channel, real-world hosting/monitoring and public launch authorization. Documentation/CI success is not proof of these capabilities.

### 2.3 Scope and risk

| Category | In scope for a future bounded S0-B work package | Out of scope |
|---|---|---|
| Public experience | `/custom` and `/business` inquiry entry, a single accessible guided form, acceptance/error/retry/help | Checkout, catalog, cart, account login, order/payment tracking |
| Business effect | Exactly one canonical `NEW` Lead plus minimal intake idempotency/audit evidence; operator can view it | Quote/order creation, qualification state change, account auto-creation, inventory, invoice, payment, production |
| Media | Artwork readiness enum and text guidance, including `NOT_READY` | Actual upload, scanning, storage, proof approval, design generation |
| Notifications | Optional post-commit manual notification **only after separately approved**; authoritative operator queue must work without it | n8n as system of record, autonomous AI, unverified email/WhatsApp integrations |
| Runtime | Local/disposable-only tests under repository safety guards; later approved controlled environment | Production access, remote destructive tests, public deploy in this document |

**Preliminary classification:** public anonymous entry + sensitive PII + write to tenant-scoped CRM implies **at least R4 candidate review**, with escalation to R5 wherever production-critical security controls or broad service-role authorization are affected. Final effective risk must be determined from `docs/governance/cross-system-risk-classification.md` and the MGBOS risk profile for the actual implementation WP. Do not classify it R1 merely because the visible UI is a form.

## 3. Single business outcome and source of truth

**Success:** A legitimate prospective customer submits a Custom or Business need; server admission safely accepts it *once*; customer receives a non-sensitive reference and realistic follow-up guidance; an authorized operator retrieves the exact inquiry without retyping and follows up using the existing Lead workflow.

**Not success:** browser shows a green toast; analytics records `submit`; an email or webhook fires; someone copies a WhatsApp message manually; an uncontrolled public DB `INSERT` happens; a quote or order is created.

### 3.1 State semantics (do not duplicate MGBOS state machines)

| Concept | Allowed state/meaning | Prohibited inference |
|---|---|---|
| Public form | Editing / Validating / Sending / Acceptance confirmed / Outcome uncertain / Rejected | Not a stored order status |
| Canonical Lead | `NEW` upon accepted public intake; later changes via existing authorized commands | Never set `QUALIFIED`, `CONVERTED` or `CONTACTED` because visitor clicked Submit |
| Receipt | Evidence that a Lead has been durably accepted for review | Not guaranteed price/date, accepted commercial offer, delivery, or legal identity verification |
| Requested deadline | Visitor's desired date, unconfirmed | Not promised shipment deadline or production slot |
| Contact details | Visitor-provided unverified assertions | Not authorization for accessing an existing customer, quote or order |
| Business intent | Routing hint for an operator | Not organizational membership or credit approval |

### 3.2 One logical intent

A customer can provide either `CUSTOM`, `BUSINESS` or `UNSURE`. All three pass through **one** intake contract. Business-specific extra questions appear only when relevant; `UNSURE` is a valid assisted inquiry, not a forced rejection.

## 4. End-to-end boundary: approved target design

```text
Browser /custom or /business
  1. Form-local interaction; no DB credentials
  2. POST bounded input + stable client-generated opaque submission key
     ↓
TeeStock PUBLIC ADMISSION SERVER (new; unimplemented)
  3. Strict schema, origin/size/abuse policies, no client tenant authority
  4. Trusted server-side TeeStock org/brand/channel resolution
  5. Dedicated narrow MGBOS intake capability / command (new; unimplemented)
     ↓
MGBOS TRANSACTION (new implementation, design subject to authorization review)
  6. Unique request identity + fingerprint + Lead effect + receipt atomically
  7. Audit event / durable operator-findable evidence
     ↓
Public response (sanitized)
  8. ACCEPTED + opaque receipt + next step (only after commit)
  9. On uncertain outcome: reconcile same key, not a second Lead
     ↓
MGBOS OPERATOR (existing authenticated Lead workflow, compatibility verified)
 10. Retrieve trusted brand/channel/intake context
 11. Human follow-up; later existing guarded qualification and commercial flows
```

The exact API path and storage names below are **implementation suggestions**, not deployed APIs or database objects. Do not treat an example as authority to bypass schema/permissions review.

### 4.1 Public admission endpoint (candidate)

`POST /api/public-inquiries` within the TeeStock server runtime is recommended for same-origin submission, with an explicit request/response contract and no anonymous database access from browser. Reject unsupported content types and oversized requests before parsing. Use a request-size ceiling chosen by security review; **no file body permitted**. A server action may be evaluated, but cannot be selected solely because it is convenient; it must meet the same abuse, authorization and replay controls.

The admission handler may read a carefully scoped nonpublic configuration for a **single approved TeeStock organization/brand/source channel**. Resolve that mapping from server-owned configuration and verified persisted identities, never from user-submitted `organizationId`, `brandId`, `channelId`, role, price, or status. Missing or stale configuration must fail closed.

**Principal/credential choice: HARD GATE.** Prefer a dedicated, explicitly authorized intake capability with the least possible ability to create one eligible Lead in one tenant. The generalized service-principal model is not assumed to exist. If the only practical bridge uses a privileged server secret, Head Engineering must first approve the concrete command boundary, privilege/revocation model, audit trace and cross-organization adversarial tests. Browser-accessible variables, client bundles, public headers, n8n, or a general service-role REST insert are never acceptable substitutes.

Do **not** make `anon` a member of an organization, grant anonymous `INSERT/SELECT` over `app.leads`, or publish a `SECURITY DEFINER` RPC callable by arbitrary anonymous clients with unchecked organization/brand inputs. Authorization must be enforced by both the server capability and the governed MGBOS mutation boundary, not just by an Origin header or secret URL.

### 4.2 Candidate public input contract (not `createLeadSchema`)

| Field | Rule | Internal mapping candidate | Guard |
|---|---|---|---|
| `intent` | Required enum: `CUSTOM`, `BUSINESS`, `UNSURE` | Lead title/source context; optional operator routing | Cannot become organization membership |
| `contact_name` | Required human-readable name (bounded text) | `contact_name` | Normalize whitespace; prevent dangerous display/HTML injection |
| `contact_method` | `EMAIL` or `PHONE` | Contact preference only | One corresponding valid reachable-format value required |
| `email` / `phone` | Only what method needs; optionally alternate if explicitly supplied | `email`, `phone` | Never place in public URL, analytics, success response or debug logs |
| `need_summary` | Required non-empty need, length bounded to compatibility with internal `raw_inquiry` max 3000 | `title`, `raw_inquiry` | Don't require an artificial fixed-budget threshold |
| `garment_interest` | Optional approved category or `UNKNOWN` | Existing Lead text/spec where lossless and permissible | Do not fabricate SKU/inventory truth |
| `estimated_quantity` | Optional positive integer or `UNKNOWN` | `estimated_quantity` if supplied | Unknown maps to `NULL`, never `0` |
| `requested_date` | Optional date or `UNKNOWN` | **Requires reviewed durable placement**; may be structured intake note | Must remain a request, not an agreed delivery date |
| `artwork_readiness` | `READY`, `NOT_READY`, `NEED_HELP` | **Requires reviewed representation**; no file upload | `NOT_READY` remains valid |
| `company_name` | Optional; contextually shown for Business | `company_name` | Must not auto-create customer account or imply legal proof |
| `delivery_city` | Optional | Reviewed minimal intake text if needed | Avoid full address unless specifically approved |
| `note` | Optional bounded plain text | reviewed `raw_inquiry` or note composition | No secrets, ID documents, credentials, payment details |
| `service_notice_ack` | Clear, required acknowledgement of service handling/privacy notice | Consent evidence only if policy defines lawful records | Not blanket marketing permission |
| `marketing_opt_in` | **Not displayed in first slice** | None | Never precheck or combine with service inquiry |
| `submission_key` | Required opaque random unique key for one logical submit intent | Dedicated idempotency identity | Not an authentication credential; bounded storage lifecycle |

**Contract implementation requirement:** Choose *one* reviewed durable mapping for each accepted field before coding storage. If `requested_date`, `artwork_readiness`, or other values cannot be represented without misleading or destroying meaning, either add a separately approved narrowly scoped representation or reduce the public form to what can be preserved faithfully. Never silently discard fields after displaying a success receipt. Never insert a new customer/order/requirement merely to hold missing form fields.

### 4.3 Field interaction and accessibility

- Progressive disclosure: Business company/procurement details only when needed; unknown quantity/artwork must not block a valid assisted request.
- Form control labels, explicit required/optional indicators, non-destructive field validation, error summary, focus management, keyboard and screen-reader support.
- In-flight submit disables accidental double-click but **is not** a replacement for server-side idempotency.
- When switching intent, preserve semantically shared answers; clear contradictory hidden answers intentionally and explain it.
- Mobile virtual keyboard, 200% zoom, slow network, reduced motion, and interrupted submission must be tested.
- No public drafts containing PII in analytics or localStorage. Optional client session persistence may store only the **opaque submission key** with scoped expiry; no secret credentials or raw contact fields.
- Copy must distinguish: `belum dikirim`, `sedang diproses`, `diterima untuk ditinjau`, `status pengiriman belum dapat dipastikan`, `gagal karena input`. Do not display “Pesanan berhasil” or “Penawaran diterima”.

## 5. Command identity, atomicity and replay safety

A basic `POST` to `app.leads` is **not idempotent** merely because the client has a disabled button. The canonical Lead table has unique `(organization_id, lead_number)`, which prevents duplicate numbers, **not duplicate business intents**.

### 5.1 Recommended transactional record pattern

Propose a **technical command-receipt/idempotency ledger** (working name `public_lead_intake_commands`), narrowly attached to MGBOS Lead intake. It is **not** a customer-facing master entity and not a second Lead source of truth.

Required logical fields (physical schema to be separately approved): trusted organization/brand, command type/version, stable `submission_key`, server canonical payload fingerprint, canonical `lead_id`, safe opaque `receipt_reference`, committed result class, created/updated timestamps, bounded security/audit metadata. PII must not be duplicated unnecessarily. No raw secrets or full contact payload in generic audit fields.

- Uniqueness: immutable `(trusted organization, command, submission_key)` and any additional scope required by the approved command contract.
- **Same key + same canonical payload:** return the same stable accepted result; no second Lead, number, operator task or notification effect.
- **Same key + materially different payload:** explicit `IDEMPOTENCY_CONFLICT`, no overwrite, no silent merge.
- **Concurrent same-key requests:** lock/unique constraint serializes effects; exactly one durable Lead.
- **Precommit failure:** neither Lead nor a falsely accepted receipt survives; eligible retry uses the same key.
- **Postcommit response loss:** subsequent same-key reconciliation returns the original accepted receipt, without creating a second Lead.
- **Fingerprint inputs:** strictly server-normalized, versioned accepted business fields only; avoid accidental variation due to formatting/order; fingerprint raw key and PII safely using reviewed cryptographic strategy (never treat a bare unsalted hash of low-entropy email as anonymization).
- **Key lifecycle:** client retains logical key across retry; expiry and cleanup require a published policy that **does not remove necessary duplicate protection too soon** or delete canonical Leads. Retrying beyond retained identity must have explicitly defined safe behavior.

Business write, acceptance-result linkage, and idempotency receipt **must commit in one database transaction**, not as separate Next.js requests or an n8n sequence. A failure after a DB commit cannot roll back a separate email/analytics action. Do not claim full transactional outbox exists merely because a technical ledger is built.

### 5.2 Safe public responses (illustrative protocol)

| Outcome | Client-visible result | Durable truth | Action |
|---|---|---|---|
| First accepted | `ACCEPTED` + opaque reference + realistic human review next step | Exactly one `NEW` Lead and receipt exist | Show confirmation, retain no exposed PII |
| Same-key replay, same payload | `ACCEPTED` + **same** reference | No second Lead | Show same confirmation |
| Same-key reuse, changed payload | `CONFLICT` with safe correction instructions | Existing accepted Lead remains unchanged | New explicit intent must be user-driven; no automatic silent new key |
| Invalid field | `VALIDATION_ERROR` with safe field descriptions | No Lead | Preserve form input and focus |
| Throttled/abusive | `RATE_LIMITED` with neutral messaging | No accepted effect for rejected request | Slow down; do not reveal spam scoring internals |
| Definitively failed precommit | `UNAVAILABLE` / `NOT_ACCEPTED` | No effect | Safe retry of same key if eligible |
| Network timeout / unknown server response | `OUTCOME_UNKNOWN` | Unknown until reconciled | Reconcile same key through protected boundary; **do not automatically create a new key** |
| Notification provider failure after acceptance | `ACCEPTED` remains valid | Lead and receipt persist | Operator queue is primary; manual follow-up recovery |

**Privacy:** Do not expose the canonical `lead_id`, raw `lead_number`, full Lead row, tenant IDs, arbitrary status lookups, or existence of other users' records from a public endpoint. If an opaque receipt is retrievable anonymously, a separately reviewed proof-of-possession and rate/entropy policy is needed; default S0-B may simply display it after submission and require human verification for later follow-up.

## 6. Security model and negative capabilities

### 6.1 Attacker model

Untrusted Internet visitor can forge JSON and headers, tamper origin/referrer, replay traffic, brute-force receipts, use other tenant/brand IDs, submit spam/HTML/SQL-like strings, run concurrent requests, and induce lost responses. Anonymous identity is **not** proof of a customer organization or authorized employee.

### 6.2 Mandatory controls

| Control | Contract |
|---|---|
| Trusted tenant resolution | App/server binds a verified TeeStock organization, brand and channel; rejects public organization/brand/role IDs even if syntactically valid. |
| Narrow authority | Only create one eligible `NEW` Lead/receipt for configured tenant and source. No generic DB table write or unrestricted service role. |
| RLS/permissions | Preserve current internal organization isolation and role rules; do not relax existing policies to allow `anon` generic Lead CRUD. |
| Strict input | Explicit whitelist, schema/version validation and size limits; server regenerates every privileged field; no trust in client `status`, scores, price or assignments. |
| Abuse | Edge/server rate caps by more than one signal, bounded quotas, backoff, burst simulation, bot mitigation and manual disable. Exact limits evidence-based and adjustable. |
| CSRF/origin | Same-site/Origin/content-type constraints appropriate to deployment, but **not treated as primary authorization**. |
| Privacy | TLS, approved storage access, minimum retained fields, redacted errors/logs, no PII in query strings, browser telemetry, CDN caches or third-party AI prompts. |
| No public reads | Deny anonymous Lead list/search/status, other-tenant reads, enumeration and arbitrary receipt inspection. |
| Server credentials | Server-side only, env-isolated; no secret in `NEXT_PUBLIC_*`, client bundle, source, screenshots or exported build. |
| Operator authority | Existing MGBOS active organization membership and Lead permissions govern operator reads/updates. |
| Manual response | Fail closed if authorized intake or monitoring absent; leave truthful S0-A page in place. |
| Audit | Record trusted channel, command identity, accepted canonical Lead association and bounded outcome; no forged actor identity. |

### 6.3 Authentication and authorization review before implementation

The actual builder must answer these with evidence, **not assumption**:

1. What principal authorizes the new intake command? If service identity is not physically implemented, how is a narrow server capability enforced and audited?
2. Which exact SQL grants, RLS paths, `SECURITY DEFINER` ownership/search path, and effective roles are active after **all** migrations? No forward-only grant should silently expose RPC to `PUBLIC` or `anon`.
3. Can the new command create a Lead only for the configured brand/organization/channel, without modifying financial or order state?
4. How does the command avoid impersonating a real user? A visitor contact name is **not** `p_actor_id` or an MGBOS member.
5. What happens when tenant config is wrong, deleted, or rotated? Default deny and alert operator.
6. Is any privileged credential unavoidable in the server runtime? If yes, require independent security review and explicit bounded risk acceptance before implementation/deployment; document blast radius and revocation.

**Stop condition:** Without demonstrated authorization that is narrower than a guest invoking existing `createLeadAction` / generic service-role REST, S0-B implementation **does not proceed**. Reuse only compatible validation/domain rules, not the trusted operator action boundary.

## 7. Operator handoff and genuine recovery

**Authorized source of truth:** existing MGBOS Lead list/detail and guarded transitions; a Lead `NEW` must be visible to a permitted user in the right organization/brand, with source attribution, contact, need, and next action. No shadow spreadsheet is required to discover a customer.

Required operator experience:

1. A new public request is clearly distinguishable from manual, WhatsApp, or later marketplace Leads using an approved immutable channel/source mapping.
2. Operator can open it, inspect required intake context, determine if follow-up is possible, and take a next action using canonical Lead capabilities.
3. Operator identity and permission must be checked; unauthorized employees/tenants see no private record.
4. Queue works when email, WhatsApp, n8n, JARVIS, analytics, or notifications fail.
5. Duplicate public retries do not create multiple actionable rows or spam operator tasks.
6. Failed notifications and dead letters (if notifications are introduced later) have a human-visible recovery method; they cannot mutate Lead truth.
7. If the owner is absent, approved fallback staffing/operating procedure exists before public activation; do not invent a response-time SLA.

**Acceptance semantics:** Customer service follow-up is separately authorized and governed; never reveal Lead details based solely on a guessable receipt reference or phone number. Store privacy consent evidence only under an approved policy, without claiming a legal retention rule that has not been accepted.

## 8. Failure model and rollback

| Failure | Expected invariant | Recovery/evidence |
|---|---|---|
| Validation error | No business effect | Specific field corrections; entered values kept |
| Unsupported media attempt | No file accepted or stored | Explain upload is not enabled and artwork may be discussed later |
| Rate-limit failure | No accepted effect | Retry guidance without disclosure of internal thresholds |
| Tenant config mismatch | No cross-tenant write | Alert operator; disable public submit |
| DB unavailable before commit | No false receipt | Safe unavailable state and retained opaque request key |
| Commit succeeds, response lost | One Lead only | Reconcile same key to original receipt |
| Concurrent identical requests | One Lead only | Unique constraint / transaction evidence |
| Same key different payload | Never overwrite prior accepted inquiry | Conflict response, logged with redaction |
| Notification outage | Lead still visible | Queue-based manual action |
| Feature disabled mid-flight | Previously committed requests remain valid | Inflight response/recovery, no record deletion |
| Malicious multi-tenant input | No authority gained | Deny + audit + negative cross-tenant test |
| Release rollback | Route reverts to safe S0-A content; canonical Leads remain intact | Versioned feature flag and release rollback evidence |

Rollback is **not** deleting Leads or changing business states. The first ship may be internal-only/preview; external exposure must remain disabled until separately authorized.

## 9. Requirement register — one requirement, one primary acceptance

`S0B-REQ-001..026` are **this bounded design's proposed engineering obligations**. `S0B-AC-001..026` are the paired independent-test statements in §10. A requirement may also use cross-document CX acceptance scenarios, but those links never replace its own direct acceptance.

| ID | Requirement | Primary acceptance | CX trace | Gate |
|---|---|---|---|---|
| S0B-REQ-001 | Only approved Custom/Business public intent triggers a submit flow | S0B-AC-001 | CX1-FR-009; CX8-AC-006 | UX |
| S0B-REQ-002 | Form collects minimum permitted contact and need | S0B-AC-002 | CX5-FR-003 | UX |
| S0B-REQ-003 | Conditional questions do not destroy valid prior answers | S0B-AC-003 | CX1-FR-010; CX8-AC-006 | UX |
| S0B-REQ-004 | Artwork not-ready works without upload | S0B-AC-004 | CX1-FR-011; CX5-AC-002 | UX |
| S0B-REQ-005 | Requested date never becomes commitment | S0B-AC-005 | CX1-FR-012; CX8-AC-007 | Data |
| S0B-REQ-006 | Client cannot choose organization/brand/channel/actor | S0B-AC-006 | CX7-FR-003; MGBOS auth | Security |
| S0B-REQ-007 | Server validates strict allowlisted input and size | S0B-AC-007 | CX8-AC-006 | Security |
| S0B-REQ-008 | Narrow server command capability controls writes | S0B-AC-008 | MGBOS permission model | Security |
| S0B-REQ-009 | Public never sees service key or unrestricted REST | S0B-AC-009 | MGBOS security | Security |
| S0B-REQ-010 | Accepted request produces exactly one `NEW` Lead | S0B-AC-010 | CX1-FR-038; CX8-AC-005 | Transaction |
| S0B-REQ-011 | Identity + same payload replays same result | S0B-AC-011 | CX8-AC-009 | Transaction |
| S0B-REQ-012 | Same key + changed payload conflicts | S0B-AC-012 | Command-event model | Transaction |
| S0B-REQ-013 | Concurrent retry cannot create duplicate | S0B-AC-013 | CX8-AC-009 | Transaction |
| S0B-REQ-014 | Lead + receipt effect commits atomically | S0B-AC-014 | CX8-AC-005/010 | Transaction |
| S0B-REQ-015 | Lost response is reconciled without second Lead | S0B-AC-015 | CX8-AC-009/010 | Resilience |
| S0B-REQ-016 | Customer sees receipt only after durable success | S0B-AC-016 | CX1-FR-013; CX8-AC-005 | Truth |
| S0B-REQ-017 | Anonymous public cannot enumerate/read Lead or receipt | S0B-AC-017 | CX6-AC-003 | Security |
| S0B-REQ-018 | Cross-org and invalid brand/source requests fail closed | S0B-AC-018 | MGBOS org isolation | Security |
| S0B-REQ-019 | Abuse throttling and manual disable work | S0B-AC-019 | CX8-AC-010 | Security |
| S0B-REQ-020 | Private data excluded from URLs/logs/analytics/errors | S0B-AC-020 | CX8-AC-028; privacy | Privacy |
| S0B-REQ-021 | Operator can find accepted record and next action | S0B-AC-021 | CX5-AC-011; CX1-FR-038 | Operations |
| S0B-REQ-022 | Operator read/action stays organization-scoped | S0B-AC-022 | Permission model | Security |
| S0B-REQ-023 | Notification outage doesn't erase or duplicate Lead | S0B-AC-023 | CX8-AC-008 | Resilience |
| S0B-REQ-024 | Valid keyboard/mobile/screen-reader task completes | S0B-AC-024 | CX8-AC-004/011 | UX |
| S0B-REQ-025 | Disabled/unavailable intake falls back truthfully | S0B-AC-025 | CX1-FR-040; CX8-AC-012 | Release |
| S0B-REQ-026 | No public release without approved operator/privacy/security gates | S0B-AC-026 | CX-09; MGBOS governance | Release |

## 10. Acceptance register — directly testable criteria

The following scenarios are **NOT EXECUTED** at document-writing time. Actual WP evidence must identify test environment, command, commit SHA, actor/tenant, asserted database effect and result. A test of source text alone is not equivalent to transaction/security assurance.

| ID | Given / When / Then | Evidence required |
|---|---|---|
| S0B-AC-001 | Given `/custom` or `/business`, when intent chosen and public intake enabled, then user opens correct guided flow; unsupported Shop/cart has no submit endpoint. | Browser route + negative navigation |
| S0B-AC-002 | Given minimum valid need and contact, when submitted, then no unsupported inventory/finance fields are forced and full need is preserved. | Browser + inspected canonical Lead |
| S0B-AC-003 | Given Business fields visible, when switching to Custom/unknown, then shared valid values survive, invalid hidden values are handled explicitly. | Keyboard/browser form-state trace |
| S0B-AC-004 | Given `NOT_READY` artwork, when submitting, then request can be accepted without upload; no file storage side-effect exists. | Browser + storage negative assertion |
| S0B-AC-005 | Given requested date, when accepted, then stored text/data remains requested/unconfirmed; no delivery promise is emitted. | Lead read + public copy test |
| S0B-AC-006 | Given forged tenant/brand/channel/actor fields, when posted, then server ignores/rejects authority and uses only trusted mapping. | API adversarial test + DB scope inspection |
| S0B-AC-007 | Given malformed JSON, oversized body, unknown fields or invalid contact, when posted, then no Lead is written and safe errors returned. | API negative matrix |
| S0B-AC-008 | Given anonymous/low-privilege actor, when calling protected command or trying internal action, then no generic Lead mutation occurs outside narrow approved admission. | Actual effective permission/RPC/REST negative tests |
| S0B-AC-009 | Given built application and network capture, when inspected, then neither service secrets nor admin endpoints are exposed to client/browser. | Bundle scan + runtime request audit |
| S0B-AC-010 | Given one legitimate valid request, when admission commits, then exactly one `NEW` Lead with expected trusted provenance exists. | Transactional DB assertion |
| S0B-AC-011 | Given an accepted key and identical normalized payload, when retried, then original opaque receipt and original Lead are returned. | Command/API + DB count |
| S0B-AC-012 | Given accepted key with changed material need or contact, when retried, then explicit conflict and zero additional effects occur. | Fingerprint collision negative test |
| S0B-AC-013 | Given simultaneous same-key calls, when raced, then only one committed Lead/receipt exists and all resolved responses are consistent. | True concurrent transactional test |
| S0B-AC-014 | Given injected failure between prepare/write/receipt stages, when transaction fails, then no orphan Lead or orphan accepted receipt remains. | Fault-injection DB assertions |
| S0B-AC-015 | Given commit succeeds but network response is dropped, when original key retries, then original accepted receipt is safely recovered without another Lead. | Post-commit fault injection |
| S0B-AC-016 | Given uncommitted/timeout scenario, when UI responds, then it does **not** say accepted; committed result shows safe reference and human next step only. | Browser + network interception + DB |
| S0B-AC-017 | Given public access with guessed references, when attempting any lookup/list/read, then no Lead existence, identity, contact or other tenant information leaks. | API enumeration/permission probes |
| S0B-AC-018 | Given wrong/deleted tenant configuration or cross-org injection, when submitting, then no write to other org/brand and an internal alert is available. | Multi-tenant disposable DB test |
| S0B-AC-019 | Given scripted burst/spam or feature shutdown, when exceeding approved admission limits, then writes are bounded and public path fails closed gracefully. | Rate/abuse integration tests |
| S0B-AC-020 | Given real-looking PII in test payload, when inspecting browser URLs, headers, caches, analytics, error and log traces, then prohibited disclosure is absent. | Redaction/privacy scan with disposable data |
| S0B-AC-021 | Given accepted Lead, when permitted operator opens MGBOS list/detail, then request context, source, contact and next action are retrievable without copying from another system. | Authenticated operator end-to-end test |
| S0B-AC-022 | Given unauthorized tenant/member, when reading/updating same Lead, then operation denied without revealing private fields. | Role/organization negative test |
| S0B-AC-023 | Given email/n8n/third party offline after accepted request, when operator checks queue, then original Lead still exists once and is actionable. | Provider outage simulation |
| S0B-AC-024 | Given 390px phone, 200% zoom, keyboard, screen reader and reduced motion, when completing/correcting form, then controls, feedback and submitted outcome remain perceivable/operable. | Real browser and assistive-tech evidence |
| S0B-AC-025 | Given unapproved service/tenant or disabled intake, when navigating, then no inert submit appears; safe informational S0-A content is available without pretending an inquiry was saved. | Feature-toggle + browser fallback test |
| S0B-AC-026 | Given code+CI success but missing approved channel/operator/privacy/rollback or unreviewed credential, when attempting release, then release is **blocked**, no production changes or public activation. | Release gate with signed Owner decision |

### 10.1 Required composite proof, not merely test count

One end-to-end positive case **must** traverse public browser → actual admission → canonical DB commit → receipt → MGBOS authenticated operator read, with an exact commit/environment binding. One replay case must prove same-key idempotency at database effect level, one concurrent case must prove atomicity, and one denied cross-tenant case must prove scope. Mock-only or source-text checks are supporting evidence, not replacements.

### 10.2 Trace links to upstream product intent

| Upstream | Governed question | S0-B direct requirements |
|---|---|---|
| `CX1-FR-009/010/011/012` | Minimal intake, progressive questions, artwork-not-ready, requested date | `S0B-REQ-001..005` |
| `CX1-FR-013/029/038` | Truthful receipt and structured actionable Lead | `S0B-REQ-010..016`, `021` |
| `CX1-FR-030/040` | Private status/help and human-safe fallback | `S0B-REQ-017`, `022`, `025` |
| `CX5-AC-002/005/011` | Artwork assistance, progressive disclosure, operator fields | `S0B-REQ-003/004/021` |
| `CX8-AC-004..012` | Accessibility, durability, retry, failure and degraded mode | `S0B-REQ-010..025` |
| MGBOS canonical architecture | Organization, authorization, Lead state, command idempotency | `S0B-REQ-006..018`, `022` |

*Crosslinks identify relevant concerns; they do not claim every upstream scenario is fully exercised by the paired acceptance test. Downstream implementation assurance must cover the full upstream CX requirement semantics before claiming the parent requirement complete.*

## 11. Bounded implementation plan (separate Owner approval required)

**One coherent future S0-B integration PR is preferred if the reviewed safe credential/command design and disposable environment are ready.** Do not split into arbitrary ceremonies; split only if hard security dependencies truly require a separate verifiable foundational change.

### WP-S0B-01 candidate — safe admission + transactional contract

1. Verify current `main`, all relevant applied migrations, effective SQL grants and existing Lead command boundaries.
2. Produce concise exact-file plan for narrow admission API, server trusted config, command/receipt persistence and negative permissions, with proposed forward-only migration if necessary.
3. Run a **mandatory authorization design review** before implementing any privileged command, new RPC or server secret path.
4. Implement the approved bounded command, idempotency and minimal audit association with strict organization binding.
5. Verify disposable local database identity and one-shot destructive-test guards before any destructive/concurrency E2E. Never run them against existing/shared/production databases.
6. Add API command, transactional, cross-tenant and concurrency tests; do not alter canonical Lead lifecycle rules.

### WP-S0B-02 candidate — public form + operator evidence

1. Implement approved form UX on existing S0-A Custom/Business routes, only after a working safe admission contract exists.
2. Implement honest `ACCEPTED`, `UNKNOWN`, `VALIDATION_ERROR`, `UNAVAILABLE` and safe recovery screens.
3. Reuse existing authenticated operator Lead list/detail where feasible; add only bounded display support for newly approved intake fields.
4. Add browser, accessibility, mobile, privacy and fault/replay E2E evidence.
5. Run required repository `pnpm check`, applicable DB tests, scope guard and exact-HEAD hosted CI; identify tests skipped or only simulated.
6. Keep feature OFF until explicit rollout authorization, with rollback to S0-A, no public records deleted.

This plan defines logical slices, **not** permission to start either WP. Head Engineering may combine them in one PR only if transaction/security evidence remains reviewable. No new AI, payment or catalog scope may be absorbed opportunistically.

### 11.1 Antigravity implementation freedom (after authorization)

Builder may choose component arrangement, client form-state implementation, error UX and safe testing technique within accepted contracts. Builder may **not** independently choose authorization bypass, MGBOS ownership, service-role privileges, tenant scope, retention policy, external vendor, or business launch promises. Any such material change returns to Head Engineering and Owner where appropriate.

### 11.2 Proposed file ownership (discovery pointers, not preapproved files)

- TeeStock UI and route: `systems/mgbos/apps/teestock/src/app/` and local components.
- Public-only input schema: a new bounded package or module respecting `@mgbos/validation` exports and monorepo dependency rules.
- Authoritative server command: MGBOS-defined authorization/data boundary, potentially a new forward-only SQL migration **if approved**.
- Existing Lead operator screens/actions: `systems/mgbos/apps/mgbos/src/app/(app)/leads/`, subject to no regression of authenticated authority.
- Tests: colocated focused unit/integration plus `systems/mgbos/scripts/` and existing DB-test harness under approved disposable safeguards.

Do not use these pointers to justify touching every folder. An actual WP must define exact changed paths after code discovery.

## 12. Release gates and owner-facing decisions

### 12.1 Mandatory gates (all separate from merge)

| Gate | Must be true | Current document-time state |
|---|---|---|
| S0B-G01 | Owner approves S0-B scope and real offered services; privacy notice and operator contact plan exist | OPEN |
| S0B-G02 | Source-verified narrow public admission/tenant/credential authorization approved | **NOT VERIFIED — BLOCKING** |
| S0B-G03 | Atomic idempotent Lead acceptance, replay and cross-org negatives independently tested in disposable environment | **NOT IMPLEMENTED — BLOCKING** |
| S0B-G04 | Browser/AT, API, DB, concurrency and fault tests PASS with traceable SHA/env | NOT EXECUTED |
| S0B-G05 | Staffed authorized operator and reliable inbound review/recovery queue proven | NOT VERIFIED |
| S0B-G06 | Data minimization, legal/consent text, retention/access/incident handling and audit expectations approved | NOT VERIFIED |
| S0B-G07 | Hosting isolation, secrets, metrics, monitoring, backups/restore and rollback verified | NOT VERIFIED |
| S0B-G08 | Final risk/QA/security and release evidence accepted; Owner approves **public exposure explicitly** | NOT APPROVED |

**Merge and deployment are different.** A future implementation PR may be integrated only under applicable engineering governance/required checks and explicit approval. Its merge does not activate the public form. A code-complete feature disabled in production is a legitimate endpoint of an engineering WP.

### 12.2 Narrow Owner decisions (avoid founder technical questionnaire)

| Decision | Head Engineering recommendation | Owner decision needed when |
|---|---|---|
| `S0B-OWN-01` Public inquiry channel | One Custom/Business web form, no anonymous upload, no self-service quote or checkout | Before implementation scope approval |
| `S0B-OWN-02` Operations | One named staffed operator/back-up route capable of real replies and corrections | Before any public activation |
| `S0B-OWN-03` Service/privacy | Approve real available product scope, privacy notice, contact handling and practical retention policy | Before first real customer PII capture |
| `S0B-OWN-04` Risk/cost | Approve bounded credential/hosting/security costs, where new spending or R5 risk is involved | Before provision/commitment |
| `S0B-OWN-05` Release | Explicit go/no-go for public exposure after completed evidence | At release gate |

Owner **does not** need to decide SQL table names, UUID formats, Next.js state library, or rate-limiter algorithm. Head Engineering owns those technical decisions, within canonical permissions and actual evidence.

## 13. Risk and debt register

| ID | Risk / uncertainty | Impact | Mitigation / disposition |
|---|---|---|---|
| S0B-R01 | Privileged credential makes public endpoint omnipotent | Cross-org/PII compromise | Hard security/authorization gate; reject broad bypass |
| S0B-R02 | Client-selectable tenant/source | Tenant leakage and forged attribution | Server binding + multi-org negatives |
| S0B-R03 | Double-click/network retry | Duplicate Leads and wasted solo-founder time | Atomic key/fingerprint/receipt ledger |
| S0B-R04 | Postcommit timeout shown as failure | Duplicate resend or lost trust | Reconcile same intent, honest `UNKNOWN` |
| S0B-R05 | No canonical slot for extra form context | Lost data or fictitious commitments | Approved lossless mapping or cut field |
| S0B-R06 | Spam and bot bursts | Cost/queue pollution | Resource quotas, rate caps, stop switch |
| S0B-R07 | Public receipt enumeration | PII exposure | Opaque receipt; no anonymous general lookup |
| S0B-R08 | PII in analytics/URL/logs | Privacy/security incident | Data minimization and redaction testing |
| S0B-R09 | Unverified operator/channel | Unanswered inquiries | Public activation gate and manual coverage |
| S0B-R10 | Notification as only queue | Lost sales when provider fails | Canonical MGBOS `NEW` list independent of provider |
| S0B-R11 | Fake qualification/automatic quote | Financial and reputational harm | Intake creates `NEW` only; all later effects governed |
| S0B-R12 | Noncanonical product docs treated as full approval | Scope and governance bypass | Separate Owner WP authorization |
| S0B-R13 | Live DB used for negative/load tests | Data loss/operational incident | Disposable instance guard and local-only test rules |
| S0B-R14 | Broad schema rollout before pilot | ERP expansion and maintenance burden | Minimal Lead + technical command receipt; no parallel CRM |

## 14. Evidence, source register and version discipline

### 14.1 Exact repository sources read for this document

- `systems/mgbos/AGENTS.md`
- `systems/mgbos/apps/teestock/src/app/{page.tsx,custom/page.tsx,business/page.tsx,support/contact/page.tsx}`
- `systems/mgbos/apps/mgbos/src/app/(app)/leads/actions.ts`
- `systems/mgbos/packages/{domain,validation}/src/lead.ts`
- `systems/mgbos/supabase/migrations/20260924040000_leads_pipeline.sql`
- `systems/mgbos/supabase/migrations/20260924050000_atomic_leads_and_customers.sql`
- `systems/mgbos/docs/architecture/{permission-authorization-model,business-state-machines,command-event-model}.md`
- `systems/mgbos/docs/engineering/agent-system/risk-classification.md`
- `systems/mgbos/docs/product/teestock-customer-platform/{cx-05-custom-b2b-ordering-experience,cx-08-experience-quality-acceptance-contract,CX-PKG-DECISIONS-R1}.md`
- `docs/governance/documentation-constitution.md`
- Companion author-reviewed S0-A product and engineering files available locally during drafting; **not yet present at the exact canonical GitHub destination on inspected `main`**.

### 14.2 Truth and terminology discipline

`OBSERVED` = present in source at declared SHA; `PROPOSED` = a recommended future requirement or architecture; `BLOCKED` = cannot be implemented/released without a gate; `NOT VERIFIED` = no sufficient evidence. A README or CI result for the old shell cannot be used as a security certificate for new public intake.

**Future reviewer:** Revalidate against then-current `main`, applied migrations, branch protection, actual permission ownership and S0-A delivery when converting this document into a bounded WP. If a referenced draft is approved later, adopt only its explicitly approved scope and route through existing governance. Do not rewrite historical source revision to suggest this author already reviewed a later commit.

## 15. Internal author quality gate (not independent security audit)

- One bounded problem: public Custom/Business inquiry to **one** `NEW` Lead, no transaction/approval/deploy.
- Distinguishes existing operator Lead action from proposed guest admission and respects actual MGBOS tenancy and credential constraints.
- Every `S0B-REQ-001..026` has exactly one paired `S0B-AC-001..026`, with same-number direct behavior tests; testing plan includes positive, denied, duplicate, concurrent and lost-response evidence.
- Identifies no existing public endpoint, generic anon Lead permission, production outbox or service-principal implementation as completed fact.
- Separates customer UX success, durable database acceptance, operator follow-up, PR/CI, and launch permission.
- All listed current gaps remain explicitly **NOT VERIFIED** or **NOT IMPLEMENTED**, never silently approved.
- Source-dependent facts are bound to the declared `main` commit, and the proposed file is ready to copy **without supporting document attachments**.

**FINAL DISPOSITION:** `READY_FOR_OWNER_SCOPE_REVIEW / IMPLEMENTATION_NOT_AUTHORIZED`. This deliverable is complete as a design document; it is not evidence of S0-B code or security testing. A reviewed, approved WP is the next gate—not another broad CX product PRD.
