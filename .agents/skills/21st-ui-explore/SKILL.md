---
name: 21st-ui-explore
description: Explore and compare multiple meaningfully different UI directions grounded in the current project's design system and 21st inspiration. Use when the user wants options, variants, concepts, a redesign direction, visual experimentation, or is unsure how a new interface should look. Trigger for requests such as "show me three directions", "explore alternatives", "what could this page look like", or "generate variants". Do not use for a straightforward implementation with an already-selected direction.
---

# Explore grounded UI directions

Create comparable alternatives when the user asks for options or has not chosen a visual direction. Do not insert a mandatory exploration stage into a straightforward implementation request.

## Ground the alternatives

Read applicable AGENTS and inspect the target workspace, relevant screens, content, tokens and components. Use existing `.21st` context when present; do not initialize over an established design system. MGBOS and the legacy Vite prototype are separate targets.

Keep the product task, required content, business states and accessibility requirements consistent across options. Vary meaningful choices such as hierarchy, density, navigation or interaction, not only color. Follow the user's requested number; otherwise two or three alternatives are usually enough.

## Produce comparable previews

- Use local components and inspectable references. When available and useful, search the 21st catalog; use `21st-cli-use` and verify supported CLI flags before execution.
- Use hosted generation only with verified access and available credits; read `21st-ai` for that workflow. If unavailable, create local previews and report the reference limitation.
- Keep fixtures visibly separate from real operational data. Use the actual stack when previews will be integrated; do not connect exploratory actions to live transactions.
- Put previews in a clearly scoped location that does not replace existing routes or assets without a requested implementation.
- Show consistent viewport/content for each direction, explain the user effect and tradeoff, and recommend the best fit.

## Selection and preservation

An exploration-only request ends with reviewable options; it does not authorize production integration. If the user already selected a direction or authorized a best-judgment choice, proceed within that scope without asking again.

Record the chosen direction in the existing project design source using its supported format. Retain alternatives unless cleanup was requested or they are disposable files created solely for this task and are no longer needed; never remove pre-existing drafts.

Deliver previews with their locations, a concise comparison, reference provenance and any untested interaction or responsive behavior.
