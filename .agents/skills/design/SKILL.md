---
name: design
description: Route multi-deliverable design requests across BisnisHub brand, UI, visual assets and presentation workflows. Use when choosing or coordinating the right design workflow; use a focused specialist directly for a narrow UI or token task.
argument-hint: "[design-type] [context]"
license: MIT
metadata:
  author: claudekit
  version: "2.1.0"
---

# Design routing for BisnisHub

Use this Skill for a design request spanning several deliverables or needing a choice of workflow. Choose the smallest relevant specialist; do not activate every design Skill for one page.

Read [design-routing.md](references/design-routing.md) when selecting among overlapping workflows. Inspect the target brand, application and existing assets before proposing a new identity.

## Available workflows

- UI alternatives: `21st-ui-explore`; implementation: `21st-ui-build`; review: `21st-ui-review`.
- Token architecture and component specifications: `design-system`.
- Focused component styling: `ui-styling`; focused interaction/accessibility research: `ui-ux-pro-max`.
- Brand identity/voice: `brand`; campaign composition: `creative-director`; banners: `banner-design`.
- HTML presentations: project `slides`; PowerPoint/Google Slides artifacts: the available Presentations Skill. Do not substitute HTML for a requested presentation file.
- Raster logos, illustrations and mockups: use the available `imagegen` Skill/tool. Do not require a particular provider, model or local API key from an old template.
- SVG icons: inspect the existing icon library first; create scoped vector assets when requested. A raster mockup is not an editable vector deliverable.

## Reusable references

Load only the relevant source. Supporting references are design background; any host-specific commands, unavailable skills, model names, platform limits or example output paths in them must be verified before use. They do not override the current workspace or requested format.

| Need | Reference |
| --- | --- |
| Logo brief and style | [Logo guide](references/logo-design.md), [styles](references/logo-style-guide.md) |
| Corporate identity deliverables | [CIP guide](references/cip-design.md), [deliverables](references/cip-deliverable-guide.md) |
| HTML slide composition | [Creation](references/slides-create.md), [layouts](references/slides-layout-patterns.md) |
| Banner composition | [Sizes and styles](references/banner-sizes-and-styles.md) |
| Social imagery | [Social photos](references/social-photos-design.md) |
| Vector icons | [Icon guide](references/icon-design.md) |

Preserve bundled scripts, data and assets. Before using a script, inspect its dependencies, output paths and supported options; resolve paths relative to this Skill, not a presumed `.claude` installation. Do not install a provider SDK or repair an unrelated generator unless it is necessary for the requested output and in scope.

## Delivery

Use the requested dimensions, background, transparency and export format. Verify current platform requirements when they affect delivery; old size tables and advertising claims are not current specifications.

Create previews that help review the artifact without adding a mandatory confirmation step. Ask only for missing choices that materially affect the result. Do not require white backgrounds, centered text, a fixed number of alternatives or a universal chart library.

Inspect the resulting artifact at its intended size. Report output files and any export/visual limitations. Creating assets does not authorize publishing them, sending them externally or modifying personal Skill installations.
