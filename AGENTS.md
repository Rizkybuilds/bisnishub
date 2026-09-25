# Bisnis Hub agent routing

Audit the current working tree before editing; this repository contains active, uncommitted work.
The MGBOS Next.js workspace is in `mgbos/`. Read `mgbos/AGENTS.md` and `mgbos/README.md` before MGBOS work.
Existing `apps/mgbos/` is a Vite prototype, not the new Next.js workspace.
Root `supabase` is a link to TeeStock's existing Supabase directory. Never use it for MGBOS work.
Keep legacy application, deployment configuration, migrations and business notes unchanged unless explicitly in scope.

## Agent and skill maintenance

Project-owned skills live in `.agents/skills/`. For creating, updating or auditing agent instructions and skills, read `.agents/skills/agent-skill-maintainer/SKILL.md`.
The inventory and prioritized findings are in `.agents/agent-skill-audit.md`; this is an audit snapshot, not runtime configuration or proof of application readiness.
`AGENTS.md` contains shared project instructions; it does not itself create independent agents. Add agent runtime configuration only for an explicitly scoped need and a verified supported format.
Prefer updating an existing project skill over creating another skill for the same workflow. Do not synchronize personal or plugin copies without explicit scope.

## Skill routing and workspace boundaries

Choose skills by the requested outcome and target workspace. Read the selected skill before applying it; avoid loading every overlapping specialist.
Legacy examples in skills are not MGBOS contracts: derive table names, money types, state transitions and commands from the target workspace's specifications and implementation.
`integrated-erp-engine`, `supabase-architect`, `api-backend-engineer`, `web-qa-testing` and `git-deploy-ops` distinguish legacy and MGBOS workflows. Apply the branch matching the target workspace.
`ai-automation-engine` and `ai-copilot-builder` still contain legacy examples requiring the contract check above.
For UI work, use `21st-ui-explore` for directions, `21st-ui-build` for implementation, or `21st-ui-review` for review; load token, accessibility or catalog specialists only when needed.
Use `design-system` when token/component contracts change, `ui-styling` for focused implementation details, and `ui-ux-pro-max` for a specific research gap. Existing application tokens and components take precedence over generated design proposals; a new page does not automatically require a new design system.
Skill examples do not authorize staging unrelated work, pushing to main, deploying, publishing assets or mutating remote databases. Use explicit file paths when staging authorized changes.
