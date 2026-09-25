---
name: 21st-ui-build
description: Build or substantially change production UI using the current project's design context, existing components, and grounded 21st inspiration. Use when implementing a page, section, component, responsive redesign, or visual polish in an existing web project. Trigger for requests such as "build this UI", "implement this screen", "make this page production-ready", or "use 21st to create the interface". Use 21st-ui-explore first when the visual direction is intentionally undecided, and 21st-ui-review for critique-only work.
---

# Build project-aware UI

Implement the requested page or component using its workspace's existing design and business contracts. Use `21st-ui-explore` only when the user wants alternative directions; use `21st-ui-review` for review-only requests.

## Establish project context

Read applicable AGENTS, inspect the route, neighboring components, package files and actual token sources. MGBOS Next.js work belongs in `mgbos/`; root `apps/mgbos/` is the Vite prototype. Preserve each application's stack and imports.

Read `.21st/design.json` and `.21st/DESIGN.md` in the relevant workspace if present. Missing 21st files do not mean the project lacks a design system. Inspect existing CSS and components before initializing anything. Do not overwrite or create competing design sources just to satisfy a tool.

## Implement

1. Reuse installed primitives and established layout patterns. Use `design-system` for token contracts and `ui-styling` for focused CSS/component implementation only when needed.
2. When an external component/reference would improve the result, use available 21st catalog search before hosted generation. Read `21st-cli-use` for catalog operations and verify installed CLI help before using its flags. Keep searches scoped to the target interface.
3. If tools or network are unavailable, continue from inspected local components and state that 21st references were unavailable. Do not invent search results or install dependencies merely to run a review.
4. Use hosted generation only after checking current account capability and available credits through the exposed usage tool or installed CLI. Read `21st-ai` when generation is actually needed. Lack of hosted access does not block local implementation.
5. Integrate selected code into the real framework and contracts. Keep Next.js server/client boundaries and MGBOS command authorization intact. Do not move critical mutations into browser code to make a mockup work.
6. Preserve semantics, keyboard access, focus, reduced motion, responsive layout and loading/empty/error states. Use real copy and data where available; label fixtures in previews and never present them as live business results.
7. Run required workspace checks and inspect the relevant runtime states. If available, use the verified 21st review command as an additional check; it does not replace runtime or accessibility verification.

## Scope and handoff

Preserve identity, density, typography and existing behavior unless the user requests a change. A request to implement a known direction does not require presenting three alternatives first.

Record a selected durable design decision in the existing appropriate project source, using its established schema. Do not force an invented `decisions` field into an unknown configuration format.

Report changed files, components reused, checks actually performed and unverified states. Implementation permission does not imply permission to publish components/themes or deploy the application.
