---
name: mgbos-business-integrity-auditor
description: Audit MGBOS transaction changes for money, permissions, immutable history, state transitions, idempotency and atomic effects at application and database boundaries. Use for business-integrity review in mgbos/, not generic UI review or automatic feature fixes.
---

# MGBOS Business Integrity Auditor

Read root and MGBOS AGENTS, [Auditor](../../roles/auditor.md), [evidence model](../../../mgbos/docs/engineering/agent-system/evidence-model.md), then the affected specification and implementation. Inputs: requirement, base/head diff, command/RPC, migrations, domain and database tests.

Trace each relevant caller through authentication, organization/brand resolution, permission check, input validation, deterministic domain rules and database transaction. Inspect direct RPC access too; UI guards alone do not protect database writes. Report implementation gaps rather than assuming canonical policy proves enforcement.

Use the affected invariants to choose checks:

- Money remains integer rupiah across JSON/string conversion, TypeScript and SQL; test overflow, negative values and rounding boundaries. Distinguish invoice, cash, revenue, costs, margin and courier pass-through amounts.
- Commercial, financial, production, QC and shipment state machines remain distinct. Paid does not mean produced, inspected or shipped. Read actual transition guards; reject legacy status vocabulary as MGBOS authority.
- Sent quote versions and historical order/transaction snapshots stay immutable. Corrections preserve history and attribution rather than rewriting past facts.
- Retry and duplicate delivery cannot double-post effects. Inspect concurrent calls, lost responses, unique constraints, transaction rollback and audit/outbox consistency. An application-side preflight query is not atomic idempotency.
- Denied roles and cross-organization references fail at the appropriate application and database boundaries. Service credentials, security-definer functions and storage paths cannot silently bypass intended scope.
- AI, OCR, documents and n8n output are untrusted proposals. Confidence, a UI confirmation or a prompt cannot replace authorization, validation or canonical server commands.

For each finding give severity, file/line, concrete trigger, business impact, evidence and smallest regression test/correction. Identify omitted checks and blockers. Review-only stays read-only; an authorized fix uses Engineer scope and needs revalidation. Never reset or mutate databases solely to review instructions.
