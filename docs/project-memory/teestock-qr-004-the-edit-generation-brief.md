# QR-004 — The Edit / Selected Column
**TeeStock Originals — Quiet Rebellion — Image-generation execution brief v1.0**  
**Date:** 2026-11-11 (Asia/Jakarta)  
**Status:** ACTIVE FOR CREATIVE EXPLORATION ONLY — NOT FOUNDER-APPROVED ARTWORK; NOT RIGHTS-CLEARED; NOT SAMPLED OR COMMERCIALLY READY  
**Canonical ID:** `QR-004` (retain, do not allocate a new ID)  
**Record origin:** `fix/tdl-canonical-registry-reconciliation`, `bisnis/teestock/design-lab/05_REGISTRY/02_DESIGNS.csv`, where QR-004 was DRAFT/PENDING/NOT_TESTED/NOT_READY when inspected 2026-11-11. This branch is NOT `main`.  

> This execution-ready creative brief is parked alongside the lean project memory until the Design Lab content is integrated. Do not silently import/overwrite canonical collection and registry rows. When the owning Design Lab branch becomes active, move/reconcile this brief into the proper creative-brief location and keep only a pointer in project memory. This brief does not approve a product, artwork, vendor, print file or launch.

## Concept

**Underlying truth:** The world will not stop demanding your attention. Choosing what gets through is a form of autonomy.

**Visual mechanism:** Masses of editorial/typographic fragments compete for space. A deliberately carved, unprinted *negative-space corridor* forms a strong central figure between asymmetrical masses. That physical absence, showing the garment color, expresses selective attention. A tiny muted-red intervention establishes a deliberate choice. No radio, antenna, Wi-Fi, phone, notification icon, generic waveform, skull, statue, generic glitch or motivational quote.

**Why this is apparel:** Bold graphic silhouette and broken typography are readable at 2–3 m, with generous black fabric visible; the art is neither a framed poster nor a screen/UI screenshot. Design should remain desirable as a fashion graphic without explanatory copy.

**External design inspiration (do not copy/trace):** Swiss typographic discipline: grids, geometry, hierarchy and restraint, plus humanly irregular post-punk editorial interruption. Background: https://www.nb.admin.ch/en/the-international-style-1950-1970 ; https://opentextbc.ca/graphicdesign/chapter/3-2-visual-elements-basic-things-that-can-be-seen/ . The general “less noise/no action required” apparel niche already exists, e.g. https://www.un-viral.com/products/no-action-required-t-shirt-black ; do NOT adopt its wording, branding, composition or graphics.

## Fixed exploration constraints

| Property | Working instruction |
| --- | --- |
| Output | Two **separate** standalone transparent artworks: main back and restrained front motif; **do not** generate a T-shirt mockup as the production file |
| Print-field proportions | Back **270 × 310 mm** (aspect **27:31**) as a sampling hypothesis; front ~**60 × 65 mm**; rescale only after testing fit and supplier print limits |
| Resolution target | Back **at least 3189 × 3662 effective pixels** for ~300 PPI at 270 × 310 mm. Front 709 × 768 pixels or higher at 300 PPI. If generator output is smaller, it is **not automatically print-ready** |
| Background | **True alpha transparency** throughout unprinted areas. No printed black rectangle, faux checkerboard, cream paper, garment silhouette, photograph or mockup |
| Fabric | Black relaxed-boxy cotton tee candidate, not yet selected, sampled or purchased |
| Palette | Warm Ivory `#E9E5DA` main ink; muted vermilion `#C8543E` tiny selection marker; no other colors unless tested and explicitly revised |
| Ink density | Open, airy fabric-first design. Avoid broad continuous solid ink that could create stiff DTF hand feel |
| Exact optional readable line | `NOT EVERYTHING GETS THROUGH` — only secondary supporting copy, never a dominant headline; visual artwork must work without this line. This is provisional copy, not trademark-cleared |
| Secondary fragment whitelist | `NOW`, `MORE`, `REACT`, `LATEST` as carefully truncated *real* typographic shapes, not AI-gibberish; if text integrity cannot be achieved, remove these words rather than invent malformed text |
| Letterforms | Bold neo-grotesk/condensed sans shapes for hero fragments; occasional clean monospace index marks. No forced imitation of specific copyrighted typeface designs, no illegible type |
| Visual exclusions | No grid of equal bars, no symmetric newspaper columns, no framed poster margins, no fake distressed texture, no digital glitch, 3D lighting, raster blur, gradients or shadows |
| Printing | Current TeeStock TDL-04 and **actual vendor** technical profile override these proposals. Actual line/gap, color and ink/underbase behavior must be proofed |

## Back composition — precise art direction

1. **Hierarchy:** design should initially read as one striking black corridor interrupting two contrasting ivory information masses. On second glance, the viewer finds selectivity and a tiny red signal. On third glance, the optional quiet statement is readable.
2. **Field:** clean isolated art within 270 × 310 mm. Reserve visually balanced outer space with no enclosing border or edge-to-edge printed rectangle.
3. **Left mass:** around 55–60% of typographic weight. Three **unequal** clusters, 4–7 meaningful fragments each. Different scale, tracking and cropping. Upper-left creates impact; center-left carries tension; bottom-left resolves into more breathing room. Avoid an ordinary readable paragraph.
4. **Right mass:** around 40–45% of typographic weight. Offset and comparatively sparse; intentional tension rather than mirror symmetry. At least one large typographic *shape*, not just miniature dashes. Different lengths and vertical cadence.
5. **Corridor:** a continuous black/unprinted negative-space form roughly between the masses, offset slightly from center. It widens and narrows **twice with intentional hard-edged notches**, but should not become an even vertical stripe, a simple slash, a letterform, a lightning bolt or an obvious pause icon. It must remain visibly open as actual transparency against the garment.
6. **Decision marker:** precisely one slim muted-vermilion line/dash attached to the boundary of an intentional notch; very small (<~3% graphic color footprint as a visual aim, not a measured fact). Do not use several decorative accent shapes.
7. **Supporting copy:** if typography renders correctly, small `NOT EVERYTHING GETS THROUGH` near lower-left or lower-right aligned to existing visual axes. The copy is not the main subject. No `NO ACTION REQUIRED`, `LESS NOISE MORE SIGNAL`, `UNFOLLOW THE NOISE` as main headline.
8. **Quality:** maintain strong organic editorial rhythm—no random bars, generic distortion, artificial paper grain, or appearance of a flat PowerPoint infographic. The piece must be wearable and graphically confident.

## Exact image-generation prompt — back / main artwork

Use the following **verbatim as starting prompt** for a fresh illustration. If output fails typography/transparent background requirements, reject/regenerate; do not assert print readiness.

```text
Create a wholly original, premium experimental typography artwork intended to be printed on the BACK of a black relaxed-boxy contemporary fashion T-shirt. Deliver ONLY the isolated artwork with REAL transparent alpha background; do not depict a T-shirt, clothing mockup, person, room, paper, poster, camera or background.

Creative concept: THE EDIT — freedom is the ability to choose what deserves your attention. Make the visual mechanism itself express that thought. Imagine competing editorial fragments and urgent typographic demands that are intentionally interrupted by one continuous zone of ABSENCE. The black fabric of the T-shirt will literally be visible through that absence. This negative-space corridor is the hero of the entire composition. It must feel human-directed, sharply art-directed, and emotionally clear, rather than an ordinary two-column layout.

Art style: exceptional Swiss editorial typography discipline crossed with contemporary underground/post-punk print design: memorable strong silhouette, nuanced asymmetry, confident typography, carefully controlled tension, premium fashion graphics. No vintage radio. No tech symbols. No visual cliches. This is collectible wearable graphic art, NOT an infographic or a gallery event poster.

Format: portrait artwork aspect ratio 27:31, intended physical placement approximately 270 mm wide by 310 mm high. Leave natural transparent breathing space on all sides, with no printed border or surrounding box. Composition should appear intentionally shaped for a T-shirt back panel.

Make two radically asymmetric masses of fragmented typography. LEFT: visually denser and more assertive with three clusters of different scales; a very large bold condensed neo-grotesk typographic shape anchors the top-left. RIGHT: lighter, offset vertically, fewer but stronger fragments, with one larger isolated block to maintain visual balance. Rhythm must feel surprising but meticulously controlled, NOT a regular grid of horizontal bars.

Between the masses, carve one continuous irregular VERTICAL CORRIDOR of truly transparent, UNPRINTED black-fabric negative space. The corridor sits slightly off center and has precisely two purposeful changes of width, using clean stepped cuts and sharp edges. Let this missing area become the unmistakable visual focal point. It must be wide enough to recognize from across a room. Do not draw the corridor using black ink; it must be genuine transparency.

Use only solid warm ivory (#E9E5DA) for main forms and ONE tiny muted-vermilion (#C8543E) decision marker—a thin vertical dash touching one deliberate notch of the corridor. The red marker must be restrained, not a decorative theme. Avoid excessive ink coverage; much of the design should remain open to fabric.

Typographic components may contain only accurately spelled, intentionally cropped fragments of these exact words: NOW, MORE, REACT, LATEST. Use the letters as compelling editorial graphic shapes, never as a normal paragraph or a repeated wallpaper. No nonsensical fake text, random glyphs or illegible AI letterforms. Optionally, integrate ONE smaller clearly readable supporting statement in a refined condensed sans: "NOT EVERYTHING GETS THROUGH". If text accuracy is uncertain, prioritize beautiful and correct abstract typographic shapes over incorrect text.

No heavy rectangular background fills. No full-page layout. No poster frame. No generic glitch, static noise, scanlines, random grunge, floating particles, pixelation, gradients, shadows, fake halftones, neon colors, chrome, 3D, photographs, skulls, statues, angels, radio devices, antennas, Wi-Fi icons, bells, notification symbols, stock clipart, existing brand logos, watermarks or garment illustration.

Produce a decisive, fashion-forward graphic with originality, deliberate negative space, spectacular hierarchy, clean hard edges, a high-end design-studio sensibility, and a truly transparent background suitable for print-file preflight. Every letter must be correct. Every visible shape must serve the story.
```

## Exact image-generation prompt — separate front identifier

```text
Create a standalone small premium graphic identifier for the FRONT LEFT CHEST of a black relaxed-boxy T-shirt, conceptually paired with a larger back artwork named THE EDIT. This output is the isolated design ONLY, not a shirt or mockup. Use a REAL transparent alpha background.

Artwork: a completely original tiny geometric editorial mark derived from an interrupted vertical field. Use two asymmetrically offset ivory typographic bars interrupted by one purposeful corridor-shaped void, with a single minimal muted-vermilion selection tick. It must NOT resemble an obvious pause button, Wi-Fi icon, app icon, lightning bolt, cross, political symbol, or existing commercial logo. Design it for a physical print field around 60–65 mm. Every stroke and opening must remain robust enough for the actual transfer vendor.

Palette only warm ivory #E9E5DA and muted vermilion #C8543E. No letters, no text, no mockup, no black ink background, no shadows, no gradients, no halftone or distress, no paper textures. Minimal, beautifully balanced, sophisticated, isolated true transparency.
```

## Post-generation acceptance: hard fail before print

- **Concept/visual:** Without supporting copy, the art still conveys a controlled interruption/selection. It is appealing as clothing, differentiated from existing "no action required" merch and not a generic magazine, radio diagram, or glitch graphic. Inspect at both 100% and ~140-pixel thumbnail.
- **Typography:** Every actual word matches the whitelist or the one approved provisional line exactly. Reject AI hallucinated/spelling errors. A generator is not guaranteed to reproduce typography faithfully; if manual editing is undesirable, regenerate or construct a deterministic typographic overlay via code/SVG and inspect again.
- **File:** Real RGBA transparency; black/unprinted areas have alpha=0, *not* printed black. Detect stray pixels, halos, premultiplied alpha contamination, accidental white paper, and opaque checkerboards. Confirm embedded physical size and effective pixels; merely changing DPI metadata is not resolution.
- **Process:** Confirm minimum line and negative-space gap with actual DTF vendor, including underbase behavior on dark fabric. Check actual print hand feel, adhesion, wash/abrasion durability and color after a physical sample. Only vendor-specific press settings apply.
- **Commercial:** No physical readiness, rights-cleared approval, final price, storefront publication or order acceptance can be inferred from passing creative assessment.

## Release-level evaluation (after artwork exists)

Use existing TeeStock rubric: originality/differentiation 25; commercial appeal 25; art direction/composition 20; visual execution 15; printability 15. `80/100` is a working threshold, **not** proof of demand or print success. Rights conflicts, material defects and typography failure remain hard fails.

**Review against alternates:** If resulting artwork feels like a typographic magazine spread instead of a tee, return to the negative-space mechanism and rework the visual; if concept cannot be understood without long explanation, test the `The Threshold` alternative rather than forcing `The Edit`.

## Next decision

1. Render **back graphic first** as an art-direction test. Review real pixels, not prompt quality.
2. Only if back passes, render matching independent front motif, then show both as *accurate* size-based garment mockups.
3. Founder selects/revises actual art. After selection, run real print-file preflight, rights review, sample and user preference evaluation. **Do not modify `02_DESIGNS.csv` status to approved/readiness on prompt completion alone.**

## Initial visual-generation trial (2026-11-11) — REJECTED

Two initial AI-rendered isolated-back artwork images were produced during the next session. Both are **rejected** as DTF candidates: large ordinary typography dominates, central corridor does not carry the concept, edges include noisy uncontrolled color/texture and the transparency is mostly partial, not clean ink/void. They were ~1170×1344–1345 px and had approximately 64–66% partially transparent pixels. Do not treat them as commercially usable or source-ready artwork.

A separate **deterministically constructed vector-outline study** was then produced with exact readable typography, real alpha negative-space, matching ivory/red palette and 270×310 mm composition; corresponding transparent RGBA export has **3190×3662 pixels at ~300 PPI** with **73.89% zero alpha, 25.10% fully opaque and ~1.01% antialias pixels**. It was provided as PNG/SVG/preview/ZIP files inside the conversation, **not committed to GitHub**. Its technical cleanliness is improved, but visual critique remains: **it may still read as a relatively generic split-column typography poster, not a compelling differentiated fashion statement**. Accordingly this vector study is **CREATIVE EXPERIMENT / NOT APPROVED**, and vendor-proof, line/gap, ink/underbase, hand-feel and washing remain untested.

**Next creative requirement:** Do not simply regenerate the same huge NOW/REACT/MORE/LATEST split-column layout. Reconsider the active negative-space metaphor, image silhouette and originality. Seek a more striking apparel-specific visual hook before selecting a final graphic. If founder asks for a new direction, compare B against C (The Threshold) rather than accumulating near-duplicate prompt iterations.
