---
name: business-ops-engine
description: >-
  Merancang fulfillment, inventori, procurement, work slip, label pengiriman dan pencatatan QC berdasarkan SOP serta kontrak workspace. Gunakan untuk detail operasional pesanan; jangan menjadikan contoh vendor, status atau jadwal sebagai aturan universal.
argument-hint: "[inventory, kanban, fulfillment, label, or qc]"
---

# Business Ops Engine — Fulfillment and inventory

Translate an approved business process into usable inventory, procurement, production handoff and fulfillment procedures. Use COO for broader process/capacity decisions and ERP/backend Skills for application changes.

## Identify the source contract

Read applicable AGENTS and the target business SOPs before choosing status names or data fields.

- **Legacy TeeStock:** inspect actual application states, stock/payment guards and `bisnis/teestock/operasional/`. The film storage/press SOP is a local process reference, not proof every order or vendor follows the same process.
- **MGBOS:** use `mgbos/` canonical specifications, relevant ADRs and implementation. Read ADR-012 for vendor/QC context and the applicable state-machine sources. Do not port legacy `ts_*` tables or a single combined Kanban status into MGBOS.
- Keep payment authorization, order commitment, production readiness, QC release and shipping handoff separate. Resolve specification/code discrepancies explicitly instead of silently selecting whichever label is convenient.

## Inventory and procurement

Distinguish physical on-hand, reserved, available, incoming, quarantined and consumed quantities using the project's actual definitions. Vendor catalog availability is not owned stock and needs a timestamp or fresh confirmation.

Use studio buffer, JIT purchasing or a hybrid when supported by demand and lead-time evidence. Reorder calculations should state demand rate, replenishment lead time, variability/safety stock, MOQ and cash constraints. Do not set a universal three-piece reorder point or promise same-day delivery from stock alone.

Compare landed cost and service timing for batch versus urgent pickup. Allocate inbound transport using a stated, consistent basis and avoid double-counting. Confirm current vendor stock, cutoff, capacity and terms before presenting a purchase or delivery plan as executable.

Purchasing, reservations and stock deduction must follow their authorized event and command. Do not deduct twice on retry or infer paid status from a chat screenshot, UI label or production activity.

## Work slips and shipping labels

Choose the actual printer/media and carrier specification. 100 x 150 mm media and ISO A6 (105 x 148 mm) are different sizes; use the requested/verified dimensions rather than treating their names as interchangeable.

- Work slip: order/job reference, design/version, SKU/size/color, quantities, placement/specification, materials and required checks.
- Carrier label: use the authorized carrier's label/tracking data, sender/recipient fields and barcode format. An internal order barcode is not a carrier tracking number.
- Include only necessary personal data. Use a verified sender or authorized white-label sender; do not invent contact details or expose internal costs on customer-facing labels.
- Verify page size, clipping, scaling, legibility and barcode readability using the intended output path. Do not claim a successful physical scan from a digital preview.

## QC and exception handling

Record affected quantity, job/order reference, material/vendor lot, evidence, observed defect, suspected cause and disposition. Suspected causes remain hypotheses until tested.

Keep held/rework/scrap units separate from shippable stock. Re-inspection and release require the appropriate role and contract. Track material loss, labor, replacement and recovery separately; a vendor claim is not zero loss or a guaranteed credit until resolved.

Do not write sample SQL directly into a live database. MGBOS critical changes use validated, authorized commands with required audit/idempotency behavior. A QC result must not fabricate payment or shipment completion.

## Deliver and verify

Provide the requested SOP, batch plan, stock calculation, work slip or label with source dates and assumptions. Where a plan depends on missing vendor capacity or stock, identify the dependency and complete independent work.

For application changes, follow workspace gates and risk-based tests. For documents, inspect layout and consistency. For an operational trial, report actual measured outcomes separately from expected improvement. Messages, purchases and shipments need the user's actual action scope.
