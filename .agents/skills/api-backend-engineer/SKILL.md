---
name: api-backend-engineer
description: >-
  Perancangan dan pembuatan API backend yang aman, modular, dan skalabel (REST/tRPC),
  Edge Functions, integrasi payment gateway (Midtrans, Xendit, QRIS dinamis),
  logistik ongkir (RajaOngkir, Biteship), webhook idempotency,
  dan autentikasi berbasis token/Supabase Auth.
argument-hint: "[api, endpoint, webhook, payment, shipping, or auth]"
---

# API & Backend Engineer

Implement server commands, endpoints, webhooks and provider adapters without changing unrelated business contracts.

## Locate the contract

- Read applicable `AGENTS.md`, the caller, validation schema, domain rule and existing tests before choosing an API shape.
- **MGBOS:** work in `mgbos/`; use the existing application command boundary and package exports. Domain code stays independent of provider SDKs; adapters belong in the integration boundary.
- **Legacy:** inspect the actual Vite callers and TeeStock Edge Functions. Do not replace existing response formats with a universal envelope or introduce tRPC/another framework without a requirement.
- Check MGBOS prerequisite gates and relevant reports before adding a new slice. This Skill does not authorize production changes.

## Commands and access

Validate untrusted input and authenticate/authorize the actor and resource on the server. Derive tenant/brand scope from trusted membership. UI visibility is not authorization.

Load authoritative prices, order snapshots and outstanding balances server-side. Never accept client totals as proof of a payable amount. Match the workspace's exact money and serialization contract, with explicit safe conversion at provider boundaries.

Route critical mutations through the established transactional command. Return stable caller-compatible errors without secrets or internal SQL. Use rate limits and timeouts appropriate to the endpoint and existing infrastructure; do not impose a universal limit on all traffic.

## Payments and webhooks

1. Inspect the installed adapter and current official provider documentation for signature, raw-body, status, amount/currency and retry requirements. Do not reuse a remembered endpoint, algorithm or SDK version without verification.
2. Select sandbox/production using explicit validated configuration; a production application build alone is not authorization to charge live payments.
3. Authenticate the webhook and bind it to the expected merchant, transaction and order/invoice. Compare authoritative amount and currency before applying financial effects.
4. Implement durable idempotency with an appropriate provider/event key and atomic financial effects. A pre-read followed by an unguarded write is not sufficient under concurrency.
5. Handle repeated, delayed and out-of-order events through the canonical state machine. Payment, order and fulfillment statuses remain distinct.
6. Acknowledge according to provider requirements after durable processing or durable enqueue. Retry transient failures without repeating charges, stock deductions or ledger entries.
7. Store only needed audit fields with correlation identifiers; redact credentials, signatures and unnecessary personal data. Do not blanket-log raw payment payloads.

## Shipping and other integrations

Use the selected provider's current contract, validated destination and actual configured package dimensions/weight. Do not hardcode historical API URLs, minimum billable weights or apparel weight assumptions as universal rules.

Set timeouts, bounded retries and error mapping. Retry mutations only with verified idempotency; surface ambiguous outcomes for reconciliation. Test locally with fixtures/sandbox data before an authorized live integration check.

## Completion evidence

Test invalid identity/signature, unauthorized resources, tampered totals, duplicate and concurrent requests, out-of-order events and provider failures relevant to the change. Confirm application and database effects, not only HTTP success.

Report endpoint/command contracts, changed files, tests executed and remaining integration or deployment steps. Loaded source code is not a deployed function; verify the endpoint and logs after an authorized deployment.
