---

canonical_id: proposed.mgbos.product.teestock-customer-platform.cx-pkg-stage-crosswalk-r1
status: ACTIVE
version: 0.1.1
owner: Rizky
author: ChatGPT / bounded documentation remediation
approver: Rizky
document_class: research
normative_authority: CANONICAL_COORDINATION_PACKAGE
scope: teestock-cx-delivery-priority-reconciliation
source_revision: 2800c474563309bda49d84d712f79b68c9dde36a
implementation_authorization: NONE

effective_from: 2026-10-20---

# CX-PKG-STAGE-CROSSWALK-R1 — Priority vs Delivery Stage

`P0/P1/P2` express CX-01 product priority, **not** a semantic upgrade to an operational launch or an entitlement to build. `CX-S0..CX-S3` denote proposed product capability slices, **not** dates, spending approval or engineering approval. The existing MGBOS Custom/Business pilot stays separately gated by the canonical Solo-Founder Launch Roadmap.

| Proposed product slice | Intended user-value boundary                                                | Critical evidence / gate                                                                                                                   | What remains excluded                                                                   |
| ---------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `CX-S0`                | Premium, fast service discovery and safe assisted Custom/Business inquiry   | Durable intake, approved channel/policy, human fallback, minimal founder re-entry                                                          | Public automated checkout, portal-wide private read, instant guaranteed price           |
| `CX-S1`                | Eligible retail catalog, cart, checkout, payment, confirmation              | SKU/ATS, truthful pricing, payment/ledger authorization, provider sandbox, operator recovery and independent R5 assurance where applicable | B2B portal, unapproved marketplaces, advanced builder                                   |
| `CX-S2`                | Secure customer/organization support and selectively justified integrations | Resource-scoped identity, exact-version approvals, provider replay/reconciliation, independent R4 or higher gates                          | Universal marketplace synchronization, autonomous refunds, indiscriminate notifications |
| `CX-S3`                | Verified high-leverage builder, AI and personalization                      | Standardized product rules, deterministic pricing and production eligibility, field benefit, performance limits, role-bounded AI           | Uncontrolled AI commitments or speculative complex ERP domains                          |

## Granular capability split — no premature bundling

| Customer capability | Assisted first                                                                  | Secure self-service                                                                             | Advanced automation                                                               |
| ------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Artwork/proof       | `CX-S0`: human-supplied artifact or assisted review; no customer portal promise | `CX-S2`: identity-scoped exact-version quote/proof decision, if separately authorized           | `CX-S3`: rich visual configurator/preview, with visible fidelity limits           |
| Pricing             | `CX-S0`: indicative or reviewed formal quote by operator                        | `CX-S1`: governed retail total; `CX-S2`: B2B quote review                                       | `CX-S3`: deterministic instant custom estimate on qualified configurations only   |
| Customer status     | `CX-S0`: verified assisted status/contact with necessary privacy checks         | `CX-S1`: immediate post-order truth; `CX-S2`: persistent scoped account history                 | `CX-S3`: optional proactive grounded assistance                                   |
| Channel integration | `CX-S0`: capture channel/source and manual external reference                   | `CX-S2`: one bounded inbound provider integration with safe replay, then optional outbound sync | `CX-S3`: richer multi-provider orchestration only if operating evidence justifies |
| Customer support    | `CX-S0`: human access and approved FAQs                                         | `CX-S2`: contextual case/return/reorder workflows                                               | `CX-S3`: evaluated AI support proposals with human escalation                     |

## All 46 master requirements: candidate first eligible slice

**Note:** candidate is the earliest intended slice of the full parent FR unless the row calls out an earlier manual/human subset. It does not establish implementation, scope acceptance, or release readiness.

| Parent       | Priority | Proposed first full slice | Subset / prerequisite / caution                                                                                  |
| ------------ | -------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `CX1-FR-001` | `P0`     | `CX-S0`                   | active customer path, no fake CTA                                                                                |
| `CX1-FR-002` | `P0`     | `CX-S0`                   | do not expose unavailable checkout                                                                               |
| `CX1-FR-003` | `P0`     | `CX-S0`                   | contextual public inquiry CTA                                                                                    |
| `CX1-FR-004` | `P0`     | `CX-S0`                   | only confirmed offer facts                                                                                       |
| `CX1-FR-005` | `P0`     | `CX-S0`                   | mobile and keyboard/deep-link paths                                                                              |
| `CX1-FR-006` | `P1`     | `CX-S1`                   | requires genuinely published catalog                                                                             |
| `CX1-FR-007` | `P1`     | `CX-S1`                   | product-data freshness and media resilience                                                                      |
| `CX1-FR-008` | `P2`     | `CX-S3`                   | optional personalized features cannot block default browse                                                       |
| `CX1-FR-009` | `P0`     | `CX-S0`                   | collect minimum necessary field set                                                                              |
| `CX1-FR-010` | `P0`     | `CX-S0`                   | progressive reveal without making valid request invalid                                                          |
| `CX1-FR-011` | `P0`     | `CX-S0`                   | S0 may use assisted file receipt only; no unsafe public upload                                                   |
| `CX1-FR-012` | `P0`     | `CX-S0`                   | requested deadline distinct from commitment                                                                      |
| `CX1-FR-013` | `P0`     | `CX-S0`                   | real accepted reference; idempotent retry                                                                        |
| `CX1-FR-014` | `P0`     | `CX-S0`                   | Business routing retains Custom intake context                                                                   |
| `CX1-FR-015` | `P0`     | `CX-S0`                   | estimate is not accepted quote                                                                                   |
| `CX1-FR-016` | `P1`     | `CX-S2`                   | secure self-service only after approver/version controls; assisted approval allowed earlier                      |
| `CX1-FR-017` | `P1`     | `CX-S2`                   | private B2B identity/authorization gate                                                                          |
| `CX1-FR-018` | `P2`     | `CX-S3`                   | standardized sellable configuration only                                                                         |
| `CX1-FR-019` | `P2`     | `CX-S3`                   | advanced generated preview only S3; earlier human proof and secure exact-version approval distinct               |
| `CX1-FR-020` | `P1`     | `CX-S1`                   | published sellable product/variant only                                                                          |
| `CX1-FR-021` | `P1`     | `CX-S1`                   | cart is not reserved inventory                                                                                   |
| `CX1-FR-022` | `P1`     | `CX-S1`                   | guest lookup separately verified                                                                                 |
| `CX1-FR-023` | `P1`     | `CX-S1`                   | final commercial terms revalidated                                                                               |
| `CX1-FR-024` | `P1`     | `CX-S1`                   | provider redirect not proof of payment                                                                           |
| `CX1-FR-025` | `P1`     | `CX-S1`                   | order reference follows governed effect; no duplicate                                                            |
| `CX1-FR-026` | `P1`     | `CX-S1`                   | stock/price mismatch blocks unchecked commitment                                                                 |
| `CX1-FR-027` | `P1`     | `CX-S1`                   | ready-stock/MTO/preorder are not equivalent promises                                                             |
| `CX1-FR-028` | `P2`     | `CX-S3`                   | advanced promotions require governed eligibility                                                                 |
| `CX1-FR-029` | `P0`     | `CX-S0`                   | assisted request acknowledgement only when accepted                                                              |
| `CX1-FR-030` | `P0`     | `CX-S0`                   | S0 means authorized human-assisted status/help, not public order portal                                          |
| `CX1-FR-031` | `P1`     | `CX-S2`                   | S1 order confirmation is separate from S2 persistent account view                                                |
| `CX1-FR-032` | `P1`     | `CX-S2`                   | S0 public generic support separate from private contextual case                                                  |
| `CX1-FR-033` | `P1`     | `CX-S2`                   | request not approval/refund                                                                                      |
| `CX1-FR-034` | `P1`     | `CX-S2`                   | human-assisted proof S0; private exact-version review S2; generative preview S3                                  |
| `CX1-FR-035` | `P1`     | `CX-S2`                   | reorder starts fresh governed commercial validation                                                              |
| `CX1-FR-036` | `P1`     | `CX-S2`                   | identity, privacy and consent required                                                                           |
| `CX1-FR-037` | `P2`     | `CX-S2`                   | P2 advanced B2B workspace subset; only when repeated demand/role model proven                                    |
| `CX1-FR-038` | `P0`     | `CX-S0`                   | durable structured intake, no spreadsheet as sole truth                                                          |
| `CX1-FR-039` | `P0`     | `CX-S0`                   | physical evidence remains human/partner-owned                                                                    |
| `CX1-FR-040` | `P0`     | `CX-S0`                   | AI/provider offline cannot remove assisted route                                                                 |
| `CX1-FR-041` | `P1`     | `CX-S2`                   | S0 manual source identity possible; S2 governed marketplace ingestion                                            |
| `CX1-FR-042` | `P1`     | `CX-S2`                   | S0 human follow-up possible; automated notification is conditional                                               |
| `CX1-FR-043` | `P1`     | `CX-S3`                   | PRIORITY_ALIGNMENT_REVIEW: master P1 AI option, detailed CX6-FR-045 P2; defer new AI capability until authorized |
| `CX1-FR-044` | `P1`     | `CX-S2`                   | S0 manual burden measurement; S2 structured tracking; verify CX5/CX6 child P2 priorities                         |
| `CX1-FR-045` | `P2`     | `CX-S2`                   | P2 sync is a gated, optional S2 slice, not automatic marketplace deployment                                      |
| `CX1-FR-046` | `P2`     | `CX-S3`                   | AI tools permission, cost and production safeguards required                                                     |

## Explicit alignment exceptions requiring review

- `CX1-FR-043` is master P1 optional AI, while `CX6-FR-045` is child P2 AI assistance. **Do not assume AI is S2 required.** The customer need for grounded help is separable from a new AI capability; proposal parks new AI implementation at `CX-S3` until Owner/product and Head Engineering reconcile priorities.
- `CX1-FR-044` is master P1 burden telemetry, while `CX5-FR-046` and `CX6-FR-048` detail P2 metrics. Manual baseline can occur in `CX-S0` without instrumentation; proposed full structured trace is `CX-S2`. Product Owner must confirm minimum acceptable instrumentation.
- `CX1-FR-037` is P2 advanced B2B workspace, tentatively `CX-S2` only where repeat demand, private resources and roles are verified; it is not a guaranteed S2 delivery item.
- `CX1-FR-045` is P2 marketplace sync, tentatively an isolated conditional `CX-S2` adapter; do not interpret as simultaneous real-time all-marketplace sync.
- `CX1-FR-019` covers advanced visual proof capability at `CX-S3`; assisted human proof in `CX-S0` and secure exact-version acceptance in `CX-S2` are independent narrower capabilities.

**Disposition:** `PROPOSED_RECONCILIATION_READY_FOR_OWNER_AND_HEAD_ENGINEERING_REVIEW`, not a change to existing strategic roadmap authority.
