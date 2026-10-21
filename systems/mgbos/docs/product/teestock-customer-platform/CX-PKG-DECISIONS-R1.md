---
canonical_id: proposed.mgbos.product.teestock-customer-platform.cx-pkg-decisions-r1
status: ACTIVE
version: 0.1.1
owner: Rizky
author: ChatGPT / cross-document self-auditor
document_class: research
normative_authority: CANONICAL_COORDINATION_PACKAGE
source_revision: 2800c474563309bda49d84d712f79b68c9dde36a

approver: Rizky
effective_from: 2026-10-20
---

# CX-PKG-DECISIONS-R1 — Consolidated Owner Decision Packet (PROPOSED)

**Do not treat the proposals below as blanket approvals.** While `CX-DP-01` reflects the Owner's accepted strategic presentation direction registered in `DEC-TS-2026-011`, this entire CX documentation package remains a non-canonical DRAFT (`normative_authority: NONE`). Acceptance of this strategic presentation direction does not imply approval of all proposed decisions (`CX-DP-02..17`), detailed CX requirements, release authorizations, or runtime implementations. All per-document CX1–CX9 `DEC` registers remain proposed, and formal adoption proceeds only under governed stage gates.

## A. Owner decisions needed before CX-S0 product scope freezes

| ID         | Decision                                   | Recommended direction                                                                                                                                                                                                                                                                                            | Why                                                                                                                                                                                    | Final authority / status                                                                                                        |
| ---------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `CX-DP-01` | First public customer presentation / entry | Retail-first customer presentation (apparel collections, discovery, brand identity front-and-center) with Custom and Business pathways clearly visible, discoverable, and directly accessible from navigation; operational priority remains Business/Custom under DEC-TS-2026-009 (sourced from DEC-TS-2026-011) | Aligns storefront with premium brand positioning while preserving cash flow and operational validation via Custom/Business pipeline; retail checkout gated until operational readiness | Owner: Accepted strategic direction (`DEC-TS-2026-011`); document remains non-canonical `DRAFT` subject to governed stage gates |
| `CX-DP-02` | Public intake scope                        | Guided contact/inquiry with only necessary fields, honest response expectations and safe manual fallback                                                                                                                                                                                                         | Removes founder retyping without pretending a checkout exists                                                                                                                          | Owner Product + Head Engineering viability: `OPEN`                                                                              |
| `CX-DP-03` | Sellable launch offer                      | Only approved service categories/garments, quantities and actual vendor/capacity constraints                                                                                                                                                                                                                     | Prevent unsupported promises                                                                                                                                                           | Owner + business policy: `OPEN`                                                                                                 |
| `CX-DP-04` | Customer-facing lead-time/price claims     | Requested dates & indicative estimates only until capacity and formal pricing independently confirmed                                                                                                                                                                                                            | Protect trust/transaction safety                                                                                                                                                       | Owner policy: `OPEN`                                                                                                            |
| `CX-DP-05` | Early service channels                     | Website form and/or approved direct-assisted channels; no dependency on AI                                                                                                                                                                                                                                       | Resilient founder solo-operation                                                                                                                                                       | Owner channel selection: `OPEN`                                                                                                 |
| `CX-DP-06` | Budget/provider commitments for P0         | Do not commit spend/deploy until measured cost, maintenance and readiness proven                                                                                                                                                                                                                                 | Protect runway                                                                                                                                                                         | Owner budget: `OPEN`                                                                                                            |

## B. Conditional Owner decisions only when subsequent capability is ready

| ID         | Trigger                                             | Decision                                            | Recommended gate                                                       | Status  |
| ---------- | --------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------- | ------- |
| `CX-DP-07` | Ready-stock assortment + payment/fulfillment proven | Retail checkout & payment providers                 | CX-S1 separate consent after R5/transaction assurance where applicable | `DEFER` |
| `CX-DP-08` | Customer identity/read model secured                | Guest lookup vs authenticated accounts              | Favor low friction but only security-verified                          | `DEFER` |
| `CX-DP-09` | Repeat B2B demand                                   | Proof/quote digital approvals and account workspace | Actual approver identity and exact-version authority                   | `DEFER` |
| `CX-DP-10` | Repeatable product/configuration                    | B2B reorder capability                              | Current price, stock, permissions, rights                              | `DEFER` |
| `CX-DP-11` | Profitable validated channel demand                 | First marketplace adapter                           | One provider, inbound first, dedupe/reconciliation/manual fallback     | `DEFER` |
| `CX-DP-12` | Standardized production and proof rules             | Advanced builder, instant price and AI assistance   | CX-S3 isolated, task benefit proven vs load/maintenance                | `DEFER` |

## C. Delegate to Head Engineering/semantic owners — not a founder technology questionnaire

| Theme                                  | Required output                                                                     | Owner involvement                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Public identity and role model         | Threat model, role/resource authorization, tenant boundary and lifecycle decision   | Approve only product consequences/business role matrix     |
| Customer Case vs Operational Exception | Product/architecture separation, no speculative root entities                       | Escalate semantic conflict only                            |
| Upload/asset storage                   | File eligibility, scanning/quotas, privacy, rights, versioning and access contracts | Approve legal/business upload rights and customer promises |
| Commerce commands/events               | Idempotency, outbox, provider adapters, ledger/return/reconciliation control        | Approve scope/cost; no founder SQL decision                |
| Performance and accessibility          | Quality budget and evaluation plan matching CX-08                                   | Approve qualitative experience level and budget            |
| Release and rollback                   | Exact SHA, independent test/QA, fallback, operational readiness gates               | Explicit launch/no-launch authority                        |

## D. Decisions that cannot be responsibly settled without evidence

- Actual pricing, lead times, production-capacity thresholds and margin floors.
- User task-completion benchmarks and current baseline support/contact volume.
- Selected provider fee, reliability, seller eligibility and legal/consent terms.
- Product conversion and net founder minutes saved per fulfilled order.
- Release dates; the active roadmap uses readiness gates rather than invented commitments.

**Simplified current Owner ask:** approve/adjust the CX-S0 direction and authorize **documentation-only remediation**, not all 12 conditional feature decisions. Final product scope adoption and GitHub publication are separate explicit actions.

## E. R1 priority-alignment and adoption decisions (not answered on Owner's behalf)

| ID         | Question                                                                                         | Recommended disposition                                                                            | Owner of answer                              | Status  |
| ---------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------- |
| `CX-DP-13` | Master P1 AI vs detailed P2 AI: when is **new** AI actually needed?                              | Park full AI in CX-S3; keep grounded human-assisted FAQs/service in CX-S0                          | Owner Product + Head Engineering feasibility | `OPEN`  |
| `CX-DP-14` | When should complete founder-work telemetry ship?                                                | Baseline manually in S0; evaluate automatic telemetry for S2 once measurement quality demonstrated | Owner + operating pilot owner                | `OPEN`  |
| `CX-DP-15` | Is advanced B2B role workspace part of S2?                                                       | Feature by feature, only after organization auth and repeated B2B value are proven                 | Owner + Head Engineering/security            | `DEFER` |
| `CX-DP-16` | How quickly to sync listings, price and ATS outbound?                                            | One eligible provider, separate opt-in, and R4/R5/integration recovery evidence as applicable      | Owner channel choice + Head Engineering      | `DEFER` |
| `CX-DP-17` | Does the customer need a visual proof generator or merely accurate human-reviewed artwork proof? | Validate workflow and proof issue rate first; never bundle earlier human proof with S3 builder     | Owner after pilot insight                    | `DEFER` |

### Narrow owner decision contract

The current user instruction authorizes **local documentation continuation only**; it does not constitute agreement to these product alternatives. Owner's only near-term decision is whether to advance this R1 package for independent review and (separately) authorize a repository publication proposal after PR #73 routing reconciliation. Architecture changes, customer launch and payment/provisioning remain their own formal approvals.
