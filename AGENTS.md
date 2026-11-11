# BisnisHub — Agent & Developer Instructions

**Default process:** [Lean Feature Delivery](docs/engineering/lean-feature-delivery.md) (ACTIVE, owner decision 2026-11-11).

Build **one useful feature at a time**. ChatGPT can inspect, edit and commit directly through GitHub when connected and authorized. Antigravity, ATLAS, ORION, formal multi-agent routing and long governance handoffs are **optional**, not prerequisites.

## Start here

1. Identify the target project and read relevant code, README, tests and nearby instructions. [Project index](docs/project-index.md) and [repository layout](docs/engineering/repository-layout.md) help locate files.
2. Check current branch/revision and existing/concurrent changes. Do not rely on remembered PR status.
3. Define a small observable outcome and non-goals in a few sentences; implement it. Prefer existing components, patterns and dependencies.
4. Verify with **focused** build/tests and basic UX or API checks appropriate to the actual changes.
5. Commit and report the link, outcome, checks and unresolved risk. Use a PR when required by branch protection, concurrency or risk; never claim unrun checks passed.

## Do less ceremony

For routine features and bug fixes, **do not require** an implementation contract, work package, change package, role handoff, separate auditor, QA packet, continuity checkpoint, ADR or post-merge reflection. Documentation changes are optional unless needed to explain changed behavior, schema, operational steps or an important architectural decision.

The older [Engineering AI Control Plane](docs/engineering/engineering-ai-control-plane.md), [Vibe Engineering](docs/engineering/vibe-engineering/README.md), .agents registries and historical reports remain available for reference or explicitly resumed legacy work. They do **not** block new routine features because an old routing profile, document or role artifact is missing.

## Never compromise these

- Preserve unrelated work; do not reset, clean, delete, force-push or overwrite unknown changes.
- Respect code ownership and project boundaries; one writer per overlapping scope.
- Keep server-side authorization, tenant separation, secret protection, data integrity and clear validation.
- Payment, financial records, RLS, authentication, database migrations, deletion and production operations require appropriately stronger checks. Small diff is not necessarily low risk.
- Never infer production deployment, destructive DB actions, live financial effects or other consequential permission from a routine feature request.
- Keep applicable CI and branch protection; do not remove tests or security safeguards just to speed development.
- State current vs proposed vs actually implemented honestly; self-review is not independent review.

## Projects and boundaries

- **MGBOS / TeeStock:** `systems/mgbos/`; follow [MGBOS instructions](systems/mgbos/AGENTS.md) for **technical/business invariants**, not automatic role ceremony. TeeStock web: `systems/mgbos/apps/teestock/`.
- **JARVIS:** `systems/jarvis/` — do not assume a fully implemented runtime.
- **Business documentation:** `bisnis/`; **historical archives:** `archive/`, `catatan/`.
- Do not use legacy root Supabase. MGBOS database assets live under `systems/mgbos/supabase/`.

## Initial commerce direction

Use existing merchant QRIS with **owner-confirmed manual payment**; no automatic payment verification or gateway integration without a new explicit decision. Last-three-digit identifiers never prove receipt of funds. Verify policy compliance, collision handling and amount calculations before coding the checkout.

**Working rule:** Inspect → Build → Test → Ship. No unnecessary governance loops.
