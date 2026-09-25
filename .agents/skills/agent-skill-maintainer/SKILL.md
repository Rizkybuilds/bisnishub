---
name: agent-skill-maintainer
description: Merancang, mengaudit, dan memperbarui instruksi Agent serta Skill milik proyek BisnisHub, termasuk pemicu, batas workspace, konflik, dan validasinya. Gunakan untuk perubahan AGENTS.md, SKILL.md, atau konfigurasi Agent; bukan untuk implementasi fitur aplikasi biasa.
---

# Agent & Skill Maintainer

Maintain reusable instructions grounded in the current BisnisHub repository. Keep the requested artifact small enough to maintain and specific enough to change the agent's decisions.

## Establish scope

- Inspect Git status and the affected files before editing. Preserve existing uncommitted content; use a baseline or focused diff to distinguish this task's changes.
- Read root `AGENTS.md`. For MGBOS instructions, also read `mgbos/AGENTS.md`, its README, relevant canonical sources and engineering reports.
- Inspect `.agents/skills/` for an existing owner of the workflow. Read `.agents/agent-skill-audit.md` from the repository root when resolving catalog conflicts; recheck its dated findings against actual files.
- Keep project skills in `.agents/skills/`. Personal and plugin skills are separate installations; a matching name is a possible routing ambiguity, not permission to edit or delete those copies.
- Use shared `AGENTS.md` for durable repository rules, a Skill for a repeatable workflow, and supported runtime configuration for a separately requested Agent. A persona document alone does not register an Agent.

## Design and update

- Define the outcome, trigger, target workspace, required inputs and observable completion criteria. Prefer updating the relevant Skill over adding a synonym.
- Read the available Skill Creator instructions when creating or substantially restructuring a Skill. For runtime configuration or discovery behavior, verify current official documentation before writing configuration; do not invent filenames or schema fields.
- Use a lowercase hyphenated folder and matching `name`, with a concise `description` in YAML frontmatter. Keep automatic discovery unless the user requests explicit-only invocation.
- Preserve supported existing metadata. Treat a validator's narrow field allowlist as a compatibility finding to investigate, not automatic justification to delete metadata.
- Keep instructions in `SKILL.md`; add references, scripts or templates only for a demonstrated reusable need. Link supporting files and state when to read them.
- Separate MGBOS and legacy contracts. Never promote example table names, status labels, deployment commands or pricing assumptions into universal project rules.
- Resolve a conflict using explicit user scope, applicable project instructions and canonical evidence. If evidence is insufficient, record the unresolved issue and its consequence. Do not silently remove verification gates or declare old reports current.
- Do not add approval steps for routine authorized edits, and do not treat maintenance permission as authorization for deployments, messages, publications, remote mutations or changing global installations.

## Validate and deliver

- Run Skill Creator's `scripts/quick_validate.py` on new or changed Skills when available. Report tool limitations separately from actual defects.
- Check referenced paths, frontmatter, unfinished placeholders and the final diff. Verify unrelated pre-existing files remain unchanged by this task.
- Review realistic routing cases: an explicit maintenance request should select this Skill; ordinary application implementation should select its specialist; ambiguous legacy/MGBOS work must resolve workspace before applying examples.
- Distinguish a manual scenario review from an executed agent evaluation. Use independent behavioral evaluation only when complexity and authorization justify it; ordinary edits do not require delegation.
- For instruction-only work, validate instructions and references without running database resets, production releases or the full application suite. If application code changes are explicitly in scope, use that workspace's applicable checks.
- Report changed files, validation actually performed and unresolved conflicts. Update the project audit snapshot when findings change. Do not write personal memory unless explicitly asked.
