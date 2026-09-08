---
name: brand
description: Brand voice, visual identity, messaging frameworks, asset management, brand consistency. Activate for branded content, tone of voice, marketing assets, brand compliance, style guides.
argument-hint: "[update|review|create] [args]"
metadata:
  author: claudekit
  version: "1.0.0"
---

# Brand

Brand identity, voice, messaging, asset management, and consistency frameworks.

## When to Use

- Brand voice definition and content tone guidance
- Visual identity standards and style guide development
- Messaging framework creation
- Brand consistency review and audit
- Asset organization, naming, and approval
- Color palette management and typography specs

## Brand DNA & Tone of Voice (Hub 3 Bisnis)

### 1. TeeStock (Curated POD Streetwear & Blanks)
* **Archetype:** *The Creator & Street Stylist*
* **Tone of Voice:** Raw, authentic, honest, witty, relatable. Hindari gaya bahasa kaku korporat atau klaim palsu berlebihan.
* **Core Palette:** Hitam Charcoal (`#161513`), Krem/Sand (`#F4F0EA`), Terracotta Rust (`#B84220`), Mustard (`#D99B26`), Teal (`#14B8A6`).
* **Visual Style:** Monokrom minimalis, typografi tajam (Plus Jakarta Sans + JetBrains Mono), visual close-up tekstur garmen NSA & presisi sablon DTF.

### 2. MultiGraph (Printing & Packaging Studio)
* **Archetype:** *The Precision Craftsman*
* **Tone of Voice:** Solutif, presisi, cepat, meyakinkan, deadline-oriented.
* **Peran Sinergi:** Memproduksi kemasan fisik (stiker vinyl, segel polymailer, hangtag tebal) untuk mengangkat nilai jual TeeStock.

### 3. Titik Buta (TBD — Ideation)
* **Archetype:** *The Challenger & Insight Seeker*
* **Tone of Voice:** Reflektif, provokatif, analitis, mendalam.

## Quick Start

**Inject brand context into prompts:**
```bash
node scripts/inject-brand-context.cjs
node scripts/inject-brand-context.cjs --json
```

**Validate an asset:**
```bash
node scripts/validate-asset.cjs <asset-path>
```

**Extract/compare colors:**
```bash
node scripts/extract-colors.cjs --palette
node scripts/extract-colors.cjs <image-path>
```

## Brand Sync Workflow

```bash
# 1. Edit docs/brand-guidelines.md (or use /brand update)
# 2. Sync to design tokens
node scripts/sync-brand-to-tokens.cjs
# 3. Verify
node scripts/inject-brand-context.cjs --json | head -20
```

**Files synced:**
- `docs/brand-guidelines.md` → Source of truth
- `assets/design-tokens.json` → Token definitions
- `assets/design-tokens.css` → CSS variables

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `update` | Update brand identity and sync to all design systems | `references/update.md` |

## References

| Topic | File |
|-------|------|
| Voice Framework | `references/voice-framework.md` |
| Visual Identity | `references/visual-identity.md` |
| Messaging | `references/messaging-framework.md` |
| Consistency | `references/consistency-checklist.md` |
| Guidelines Template | `references/brand-guideline-template.md` |
| Asset Organization | `references/asset-organization.md` |
| Color Management | `references/color-palette-management.md` |
| Typography | `references/typography-specifications.md` |
| Logo Usage | `references/logo-usage-rules.md` |
| Approval Checklist | `references/approval-checklist.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/inject-brand-context.cjs` | Extract brand context for prompt injection |
| `scripts/sync-brand-to-tokens.cjs` | Sync brand-guidelines.md → design-tokens.json/css |
| `scripts/validate-asset.cjs` | Validate asset naming, size, format |
| `scripts/extract-colors.cjs` | Extract and compare colors against palette |

## Templates

| Template | Purpose |
|----------|---------|
| `templates/brand-guidelines-starter.md` | Complete starter template for new brands |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
