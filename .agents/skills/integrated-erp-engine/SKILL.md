---
name: integrated-erp-engine
description: >-
  Arsitektur, perancangan, dan pengembangan sistem Enterprise Resource Planning (ERP)
  bisnis terintegrasi (BisnisHub OS). Meliputi modul General Ledger multi-unit,
  manajemen rantai pasok (Procurement & JIT Stock), Bill of Materials (BOM) garmen & cetak DTF,
  Kanban routing produksi garmen, B2B Quoter ke Order Pipeline, dan data integrity
  antar-fitur tanpa silo. Gunakan untuk merancang, mengaudit, atau mengimplementasikan modul ERP.
argument-hint: "[ledger, inventory, procurement, production, bom, or erp-architecture]"
---

# Integrated ERP Engine

Design or implement cross-module business behavior: quotation, orders, inventory, procurement, production, invoicing and ledger. Use database or backend specialists only for the affected implementation boundary.

## Resolve the workspace

Read root `AGENTS.md` and inspect the target implementation before proposing contracts.

- **MGBOS:** `mgbos/`. Read its `AGENTS.md`, `README.md`, `docs/architecture/README.md`, `docs/product/README.md` and the applicable engineering report. Follow links to the canonical data model and state machines. Check the prerequisite gates before starting another slice.
- **Legacy:** `apps/bisnishub-web`, `bisnis/teestock/web`, and `packages/shared/src`. Inspect actual callers, migrations and tests. Preserve existing contracts unless changing them is explicitly in scope.
- `apps/mgbos/` is the Vite prototype. Root `supabase` belongs to legacy TeeStock and is never the MGBOS database target.

## MGBOS contracts

- Keep business rules in pure `packages/domain`; use public package exports. Database authority is PostgreSQL, with validated and authorized server commands for critical mutations.
- Model quotation, order, invoice, payment, production, QC and shipment lifecycles separately according to canonical specifications. A payment event is not automatically a production transition.
- Preserve sent quote versions and historical snapshots. Order creation must use the selected immutable commercial version, not mutable current pricing.
- Use integer rupiah and the established BigInt/serialization contract. Define rounding and bounds explicitly; do not coerce large amounts into unsafe JavaScript numbers.
- Distinguish quoted, committed and actual costs. Preserve pass-through shipping treatment and trace each margin input to its source; do not introduce fixed platform fees, defect percentages or deposit rates as universal rules.
- Enforce stock reservation, consumption, payment allocation and ledger effects at their specified business events. Couple required database effects atomically; retain audit and transactional outbox behavior where specified.
- Make replay and concurrent commands safe. Identity, organization and brand access must come from authorized context, not trusted request fields alone.
- AI and n8n may propose or orchestrate actions; they do not authoritatively mutate business states outside the command boundary.

## Legacy contracts

- Names such as `ts_orders` or `ts_ledger_entries` are legacy clues, not mandatory dependencies for every module. Verify the real schema and account model before using them.
- Verify transitions and payment guards in the current code. Do not infer cash receipt from a Kanban move, or convert legacy status labels directly into MGBOS states.
- Check existing shared calculations before changing HPP, shipping, transfers or profit. Avoid copying formulas into parallel UI implementations.
- Vendor schedules, reorder points, DTF dimensions and margin/deposit policies must come from current business sources. Keep assumptions visible when no confirmed value exists.

## Delivery and verification

Map the trigger, authorized actor, prior state, resulting state, financial/stock effects and retry behavior before implementing a critical command. Validate failed authorization, invalid transitions, repeated requests, concurrent effects and rollback where relevant.

Use the workspace's required checks and risk-based tests. Report implementation, executed checks and unresolved gates separately. For an architecture-only task, deliver the contract and decisions without implying it was implemented or deployed.
