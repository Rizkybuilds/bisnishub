---
name: ui-styling
description: Implement focused CSS, responsive layout, theme integration and accessible component styling using the existing application stack. Use for scoped styling changes; use 21st-ui-build for a broader page implementation.
argument-hint: "[component or layout]"
license: MIT
metadata:
  author: claudekit
  version: "1.0.0"
---

# Focused UI styling and component implementation

Use for scoped layout, CSS, responsive behavior, theme integration or component styling. `21st-ui-build` owns a broader page implementation; this Skill supplies implementation detail without restarting the design process.

## Inspect the existing stack

Read applicable AGENTS, target package files, CSS/theme configuration and nearby components. MGBOS Next.js and legacy Vite are separate workspaces. Reuse installed components and aliases; do not assume shadcn, Radix, Tailwind, React Hook Form or a chart package is present.

Match the installed framework and CSS version. Do not run an initializer, upgrade Tailwind or add a UI library just to style an existing control. Verify current official library documentation when version-specific behavior matters.

## Implement within the contract

- Reuse project tokens and component variants. Use `design-system` only if the token contract itself must change.
- Preserve server/client boundaries and existing business commands. Visual permission states complement server authorization; they cannot replace it.
- Use semantic controls, associated labels, visible focus, correct dialog/menu keyboard behavior and meaningful announcements.
- Preserve loading, empty, error, disabled and validation states. Never log form credentials as a demo submit handler.
- Test long labels, dense tables, zoom and narrow layouts without hiding essential content. Select breakpoints from the content and existing layout rather than device names alone.
- Preserve supported themes and reduced motion. A library's accessible primitives do not prove the composed component is accessible.

## Focused references

Read only the relevant reference and adapt examples to the installed versions and local contract:

- [Components](references/shadcn-components.md), [theming](references/shadcn-theming.md), [accessibility](references/shadcn-accessibility.md).
- [Utilities](references/tailwind-utilities.md), [responsive layout](references/tailwind-responsive.md), [customization](references/tailwind-customization.md).
- [Canvas design](references/canvas-design-system.md) only for an explicitly requested canvas/static visual; use a matching artifact Skill for posters or raster assets.

Optional `scripts/shadcn_add.py` and `scripts/tailwind_config_gen.py` mutate components or configuration. Inspect their options, target directory and existing files before using them. Use only when installation/configuration is needed and in scope; do not overwrite established config or add dependencies from a sample.

## Verification

Inspect the actual interaction and responsive states affected by the change, then run required workspace checks. For review-only requests, report defects without editing files. State what was browser-tested versus inspected in code; do not claim conformance from a screenshot.
