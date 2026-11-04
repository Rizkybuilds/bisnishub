# HC-001: The Dangerous Species — Master Artwork Specification

**Design ID:** `HC-001`  
**Master Asset:** `HC-001_THE-DANGEROUS-SPECIES_MASTER_V01`  
**Collection:** `TSO-01 HUMAN CONDITION` (`TSO-COL-001`)  
**Canvas Dimensions:** $280\text{ mm} \times 390\text{ mm}$ ($3300 \times 4600\text{ px}$ @ 300 PPI native)  
**Print Specification:** Direct-to-Film (DTF) Industrial Transfer  
**Garment Target:** 235 gsm Heavyweight Cotton Tee (Washed Vintage Black / Charcoal `#1C1B19`)  
**Separation Policy:** 100% Knockout Black (0% Black ink deposition on dark fabric)  

---

## 1. Layer Architecture Specification

```
HC-001_MASTER_V01 (Root 3300x4600 @ 300 PPI)
├── [05] LAYER_METADATA_AND_ANNOTATIONS (Opacity 100%, Blend: Normal)
│   ├── Outer Archival Reference Box (2600 x 140 px, stroke 2 px #D2C8B4)
│   ├── Line 1: Monospace Caps (Consolas Bold 24 pt, #E8DFC9, Tracking +50)
│   └── Line 2: Monospace Spec Index (Consolas Regular 24 pt, #A09A8E, Tracking +40)
│
├── [04] LAYER_TYPOGRAPHY_EDITORIAL (Opacity 100%, Blend: Normal)
│   ├── Primary Punchline: Georgia Bold 66 pt (#E8DFC9, Tracking +60)
│   │   └── Text: "INTELLIGENCE IS NOT IMMUNITY AGAINST STUPIDITY"
│   ├── Sub-editorial Paragraph: Georgia Regular 36 pt (#A09A8E, Tracking +40)
│   │   ├── "We split the atom, mapped our genome, and created machines that reason,"
│   │   └── "yet we remain entirely defenseless in the presence of our own vanity."
│   └── Header Taxonomy:
│       ├── Collection Index: Consolas Regular 28 pt (#A09A8E, Tracking +80)
│       ├── Main Title: Georgia Bold 88 pt (#E8DFC9, Tracking +140)
│       └── Latin Subtitle: Consolas Bold 34 pt (#A09A8E, Tracking +60)
│
├── [03] LAYER_ARCHIVAL_FRAMEWORK (Opacity 90%, Blend: Normal)
│   ├── Outer Double Hairline Frame (Margin 120 px, stroke 6 px #D2C8B4)
│   ├── Inner Hairline Frame (Margin 150 px, stroke 2 px #D2C8B4)
│   ├── Corner Registration Crosshairs (4x, 60 px span, stroke 2 px)
│   ├── Horizontal Metric Dividers (Top y:480/490, Bottom y:3080/3090)
│   └── Bilateral Vernier Caliper Tick Marks (30 px tick, 150 px interval)
│
├── [02] LAYER_CENTRAL_ILLUSTRATION (Opacity 100%, Knockout Alpha Channel)
│   ├── Intaglio Copperplate Etching: Classical Roman Philosopher Bust & Caliper
│   ├── Color Palette: Aged Ivory (#E8DFC9) highlights, Muted Slate (#A09A8E) midtones
│   ├── Alpha Ramp: Smooth anti-aliased threshold [15 - 70 luminance]
│   └── Native Resolution: 1792 x 2400 px, Lanczos resampled to focal center
│
└── [01] LAYER_GARMENT_KNOCKOUT (Alpha = 0, Transparent)
    └── Zero underbase ink in garment zone; fabric provides pure natural shadow.
```

---

## 2. Color Palette & Formula

| Color Name | Hex Code | RGB | DTF Ink Channel | Function |
| :--- | :---: | :---: | :---: | :--- |
| **Aged Ivory** | `#E8DFC9` | `232, 223, 201` | CMYK Tone + White Base | Primary typography, key highlights, bust forehead & caliper tool |
| **Muted Slate** | `#A09A8E` | `160, 154, 142` | CMYK Midtone + Half White Base | Monospace metadata, secondary narrative copy, frame ticks |
| **Archival Line** | `#D2C8B4` | `210, 200, 180` | CMYK Vector Tint | Precision hairline borders, crosshair marks, dividers |
| **Knockout Garment** | Transparent | `0, 0, 0, 0` | 0% Tinta (Bebas Tinta) | Menghilangkan efek "sablon kaku/panas" di punggung pemakai |

---

## 3. Production Master Re-generation Command
Master dapat diregenerasi atau diubah sewaktu-waktu dengan menjalankan script otomasi:
```bash
python C:\Users\Rizky\bisnishub\bisnis\teestock\design-lab\01_COLLECTIONS\TEESTOCK_ORIGINAL\01_HUMAN_CONDITION\07_ARTWORK_DEVELOPMENT\HC-001_THE-DANGEROUS-SPECIES\04_EDITABLE_MASTER\rebuild_master.py
```
Aset print siap cetak selalu tersimpan di:
- Master Back Hero ($280 \times 390\text{ mm}$): `05_EXPORTS/HC-001_THE-DANGEROUS-SPECIES_PRINT_V01.png`
- Master Front Crest ($80 \times 80\text{ mm}$): `05_EXPORTS/HC-001_THE-DANGEROUS-SPECIES_CREST_V01.png`
