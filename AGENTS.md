# Bisnis Hub agent routing

Audit the current working tree before editing; this repository contains active, uncommitted work.
The MGBOS Next.js workspace is in `systems/mgbos/`. Read `systems/mgbos/AGENTS.md` and `systems/mgbos/README.md` before MGBOS work.
Archived `archive/mgbos-vite-prototype/` is a retired Vite prototype, not the new Next.js workspace.
The obsolete root `supabase` junction has been removed. Do not recreate or use a root database fallback. TeeStock historical SQL is preserved under `archive/teestock-v1/`; MGBOS uses only `systems/mgbos/supabase/`.
Legacy storefront/shared code is retired under `archive/teestock-v1/`; the old admin was removed. Do not restore runtime aliases or use archive SQL. Preserve business notes and session history.

## Repository navigation

Read [project index](docs/project-index.md) and [directory ownership](docs/engineering/repository-layout.md) before choosing a target. `systems/` replaces the earlier `projects/` proposal. MGBOS lives at `systems/mgbos/`, JARVIS specifications at `systems/jarvis/docs/`, and independent KasKita at `systems/kaskita/`. The Python assistant is in `tools/assistant/` and is not the JARVIS runtime. Follow the [migration plan](docs/engineering/repository-migration-plan.md) before physical moves. Root `*:mgbos` scripts target official Next.js; prototype aliases have been removed. The archive is reference-only and must not be deployed. Keep business notes and each system's database/toolchain boundaries separate.

## Agent and skill maintenance

Project-owned skills live in `.agents/skills/`. For creating, updating or auditing agent instructions and skills, read `.agents/skills/agent-skill-maintainer/SKILL.md`.
The inventory and prioritized findings are in `.agents/agent-skill-audit.md`; this is an audit snapshot, not runtime configuration or proof of application readiness.
`AGENTS.md` contains shared project instructions; it does not itself create independent agents. Add agent runtime configuration only for an explicitly scoped need and a verified supported format.
Prefer updating an existing project skill over creating another skill for the same workflow. Do not synchronize personal or plugin copies without explicit scope.

## Skill routing and workspace boundaries

Choose skills by the requested outcome and target workspace. Read the selected skill before applying it; avoid loading every overlapping specialist.
Legacy examples in skills are not MGBOS contracts: derive table names, money types, state transitions and commands from the target workspace's specifications and implementation.
`integrated-erp-engine`, `supabase-architect`, `api-backend-engineer`, `web-qa-testing` and `git-deploy-ops` distinguish legacy and MGBOS workflows. Apply the branch matching the target workspace.
`ai-automation-engine`, `ai-copilot-builder` and `web-sec-perf` route MGBOS to canonical commands, independent state machines and Next.js; their historical examples are scoped to legacy references.
For UI work, use `21st-ui-explore` for directions, `21st-ui-build` for implementation, or `21st-ui-review` for review; load token, accessibility or catalog specialists only when needed.
Use `design-system` when token/component contracts change, `ui-styling` for focused implementation details, and `ui-ux-pro-max` for a specific research gap. Existing application tokens and components take precedence over generated design proposals; a new page does not automatically require a new design system.
Skill examples do not authorize staging unrelated work, pushing to main, deploying, publishing assets or mutating remote databases. Use explicit file paths when staging authorized changes.

## MGBOS engineering control plane

For MGBOS change planning use `mgbos-change-planner`; for transaction integrity audits use `mgbos-business-integrity-auditor`; for PR/diff review use `mgbos-pr-reviewer`.
Read [agent-system workflow](systems/mgbos/docs/engineering/agent-system/workflow.md) and the selected [role contract](systems/mgbos/docs/engineering/agent-system/roles.md). The provider-neutral contracts in `.agents/roles/` are explicitly loaded instructions, not automatic runtime registration or permission grants.
Governance/CI changes require the focused validators and negative tests documented in [release gates](systems/mgbos/docs/engineering/agent-system/release-gates.md). `.agents/evals/` is a behavioral baseline; structural validation alone is not an executed agent evaluation.

## Repository integrity

Run `npm run check:repository` after directory changes. Business knowledge stays in `bisnis/`; runtime code belongs to its system/tool, and retired code to root `archive/`. Read the documentation constitution and canonical source map under `docs/governance/` for authority routing. Specification status does not prove implementation or deployment.
