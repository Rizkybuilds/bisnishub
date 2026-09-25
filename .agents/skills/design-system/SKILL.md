---
name: design-system
description: Maintain design tokens, semantic theme roles and component state specifications in the selected project. Use when the token or component contract changes; page implementation and finished presentations use their own workflows.
argument-hint: "[component or token]"
license: MIT
metadata:
  author: claudekit
  version: "1.0.0"
---

# Design tokens and component contracts

Define or maintain the selected project's tokens and component specifications. For page implementation use `21st-ui-build`; for a finished deck use the Skill matching the requested output format. This Skill supports those workflows when token work is needed.

## Establish the source of truth

Read applicable AGENTS, actual CSS/theme configuration, package versions, shared components and brand sources. MGBOS and legacy applications may have different token systems; do not merge them merely because they share a repository.

Reuse the existing token architecture. Missing `assets/design-tokens.json` or `.21st` files is not evidence that no design system exists. Avoid generating a second master document or rewriting theme configuration as a prerequisite to a small component change.

## Model the contract

- Separate raw values, semantic purposes and component aliases where that fits the existing system. Do not require three layers for every isolated value.
- Prefer semantic tokens for user-facing roles such as text, background, border, focus and status. Preserve naming and format used by the actual CSS engine rather than forcing HSL or a different Tailwind version.
- Cover relevant states: default, hover, focus, active, disabled, loading, error and selected. Include dark theme only where supported or requested.
- Check contrast and meaning in context; do not encode status with color alone. Specify keyboard/focus and reduced-motion behavior alongside visual variants.
- Before renaming or removing a token, inspect consumers and compatibility. Avoid leaving old and new components with conflicting meanings.

## References and helpers

Read only the material needed for the change:

- [Token architecture](references/token-architecture.md), [primitive](references/primitive-tokens.md), [semantic](references/semantic-tokens.md) and [component tokens](references/component-tokens.md).
- [Component specifications](references/component-specs.md) and [states/variants](references/states-and-variants.md).
- [Tailwind integration](references/tailwind-integration.md): check against the installed version before applying examples.

The bundled `scripts/generate-tokens.cjs`, `scripts/validate-tokens.cjs` and `templates/design-tokens-starter.json` are optional helpers. Inspect accepted input/output paths and existing files before generation. Resolve script paths from this Skill directory; run against the intended application only. A hardcoded-value warning may be an intentional primitive, not a defect to autofix.

Bundled slide scripts/data remain available for an HTML-deck task after inspecting their contract. They do not require every presentation to use Chart.js, fixed asset paths, persuasive copy or centered text. Keep the requested presentation format and actual data sources.

## Verify and report

Inspect the diff for changed consumers, render affected component states and run applicable workspace checks for code changes. For specification-only changes, validate references and internal consistency without running a full application build.

Report token decisions, affected components, compatibility implications and evidence actually collected. Do not publish a theme through `21st-design-sync` unless publication is requested.
