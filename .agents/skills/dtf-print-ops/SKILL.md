---
name: dtf-print-ops
description: >-
  Menyiapkan gang sheet, preflight artwork, profil heat press dan QC DTF sesuai vendor, bahan serta mesin yang digunakan. Gunakan untuk layout cetak, pemeriksaan file atau diagnosis transfer; parameter produksi harus bersumber pada profil yang terverifikasi.
argument-hint: "[gangsheet, heatpress, preflight, or packaging]"
---

# DTF Print Ops — Artwork, layout and process control

Prepare an inspectable print layout or process plan for the specified transfer system. Do not turn one vendor's dimensions, prices or application settings into universal DTF requirements.

## Establish the job and material profile

Read the order artwork/version, final physical size, placement, quantity, garment material, supplier/film identity and press model. For TeeStock, inspect `bisnis/teestock/operasional/sop-penyimpanan-film-dtf-dan-posisi-press.md` and current supplier instructions.

The existing studio SOP records a local profile. Preserve it unless revision is requested; do not assume its settings cover a new film, fabric or machine. If sources conflict, identify the exact materials and applicable revision before giving a production-ready setting. Continue artwork/layout work independently while application parameters are unresolved.

A profile records printable width, margins/gaps, file/color requirements, price unit/minimum increment, press temperature/time/pressure convention, peel type, finishing and care instructions. Mark unverified fields as unknown.

## Gang sheet geometry and cost

Use measured effective printable width, not nominal roll width. Record edge margins, inter-design gaps, permitted rotation and cut allowance. Keep scale fixed unless resizing is explicitly allowed.

Provide dimensions or coordinates that demonstrate each item fits without overlap, including quantities and orientation. Sum of artwork areas alone does not prove a packing fits. Distinguish artwork-area utilization from bounding-box utilization and state the denominator.

Calculate billed length using the vendor's actual rounding/minimum order rules. Allocate sheet cost consistently across jobs, including wasted length and reprints where relevant. Do not claim an optimal packing unless it is demonstrated, and do not quote historical per-meter prices as current.

Only compatible textile transfers share a textile DTF sheet. Treat vinyl stickers, paper hangtags and other packaging as separate material/process jobs; leftover textile-film space is not interchangeable packaging stock.

## Artwork preflight

- Check final dimensions and effective raster resolution: pixels divided by physical inches. Changing DPI metadata alone does not add detail.
- Inspect transparency, stray pixels, fine details, white areas/underbase implications and edge quality at output size. Use supplier limits for line/gap size and transparency behavior; do not invent a universal opacity cutoff.
- Follow the vendor's accepted format and color-profile workflow. Do not demand a CMYK PNG; choose a supported format/profile combination and request a proof when color matching matters.
- Verify artwork orientation and which party performs mirroring; avoid double mirroring.
- Record missing assets, substitutions and preflight exceptions. A generated mockup is not automatically a print-ready source file.

## Press profile and QC

Use current instructions for the exact film, garment and press. Do not prescribe universal temperature, duration, pressure in bar or cold/hot peel. Machine pressure indicators are not interchangeable measurements without the machine's specification.

For a new or uncertain combination, prepare a small controlled sample using the applicable supplier procedure before batch production. Record actual settings, material lot and outcome. Inspect adhesion, edges, position, color and fabric marking. Follow the material's care/cure instructions when defining wash/stretch checks; a few successful cycles do not establish lifetime durability.

Diagnose failures from observed evidence and controlled changes. Do not assign one definite cause or automatically sell defective garments at a fixed discount. Use the business QC procedure for hold, rework, scrap or release and record costs separately from vendor recovery.

## Delivery and evidence

Deliver the requested layout/preflight report/profile with dimensions, quantities, source dates and unresolved fields. Distinguish digital checks, supplier confirmation and physical test results; do not claim press or wash tests were performed by producing a document.

Supplier examples checked on 2026-09-25: [application instructions](https://www.transferexpress.com/videos/ultracolor-max-application-instructions) and [artwork guidelines](https://blog.transferexpress.com/art-guidelines/). These demonstrate product-specific requirements, not an endorsement or a replacement for the actual TeeStock supplier's profile. Recheck applicable instructions before production.
