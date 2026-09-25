---
name: 21st-ui-review
description: Review existing UI against the project's design context, accessibility expectations, responsive behavior, interaction quality, and high-confidence production rules. Use for UI audits, design QA, frontend review, accessibility review, consistency checks, or requests to find and safely fix visual defects. Trigger for requests such as "review this UI", "audit this page", "find design issues", "check responsiveness", or "fix obvious UX problems". Use 21st-ui-build when the request is primarily to create new UI.
---

# Review UI with evidence

Review the requested interface against its real design context and user flows. Separate reproducible defects from subjective recommendations.

## Inspect and verify

1. Read applicable AGENTS, relevant source, existing tokens and `.21st` context when present. Select the correct workspace; do not review the Vite prototype as evidence for MGBOS Next.js behavior.
2. Inspect runtime states when available: normal, loading, empty, error, validation and relevant permissions. Clearly separate code-inspected findings from browser-verified findings.
3. Use the installed 21st review capability if available and verify its command/options first. If unavailable, continue with source and runtime inspection and disclose the limitation. A tool warning is a candidate finding, not proof.
4. Check semantic controls, accessible names, keyboard/focus behavior, responsive overflow, zoom, contrast, reduced motion and feedback. Match tests to the actual component and supported platforms.
5. Confirm token or component drift against established project sources. Use `ui-ux-pro-max` for focused guidance when a specific interaction remains uncertain; generic style rankings do not override product requirements.

## Fix boundaries

A review-only request produces findings without modifying files. When fixes are requested, apply scoped, high-confidence corrections, inspect the diff and verify the affected state. Use automatic fix tooling only after inspecting what it changes. Do not silently redesign identity, alter business states or refactor unrelated components.

For changes, run required workspace checks plus relevant interaction verification. Do not claim full accessibility conformance from a static scan or a screenshot.

## Output

Lead with actionable findings ordered by user impact. Include the affected file/line, trigger, consequence and supporting evidence. Mark subjective suggestions and unverified responsive/runtime risks explicitly. If no issue is proven, state the inspected scope and remaining limits.
