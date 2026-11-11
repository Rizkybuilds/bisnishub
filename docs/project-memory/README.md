# BisnisHub — Lean Project Memory

**Status:** ACTIVE working-context entrypoint (introduced 2026-11-11)  
**Repository:** `Rizkybuilds/bisnishub` (PUBLIC)  
**Purpose:** Restore useful business/product/engineering context across ChatGPT, Antigravity and other AI sessions **without** making transcripts, new governance layers, or parallel sources of truth.

## Start here (relevant sessions only)

1. Read [root agent instructions](../../AGENTS.md) and this index.
2. Open **only the relevant project memory** below (not the entire repository).
3. Follow its pointers to canonical business/product documents; for implementation status, inspect **live** `main`, open PRs, code, CI, and deployed environment as applicable.
4. State what is **founder-decided**, **working hypothesis**, **verified fact**, or **unknown** before making consequential recommendations.

| Project | Quick memory | Existing deeper sources |
| --- | --- | --- |
| TeeStock | [teestock.md](teestock.md) | [Business knowledge](../../bisnis/teestock/README.md), [decision register](../../bisnis/teestock/00-foundation/decision-register.md), [storefront](../../systems/mgbos/apps/teestock/) |
| MultiGraph / MGBOS | Not yet summarized here; add when next materially discussed | [MGBOS](../../systems/mgbos/README.md), [portfolio knowledge](../../bisnis/) |
| Little Treat | Not yet summarized here; add when next materially discussed | [Food Ventures](../../bisnis/food-ventures/README.md); [Kitchen OS PR #105](https://github.com/Rizkybuilds/bisnishub/pull/105) was OPEN when checked 2026-11-11—verify status, do not assume it exists on `main` |
| Other projects | Add a small project file **only when needed** | [Project index](../project-index.md) |

## Memory policy: selective, not a transcript archive

**Capture** when a conversation reaches a material outcome:
- A founder-confirmed choice or meaningful reversal, including **why**, **date** and impact.
- A critical requirement, non-goal, constraint, customer insight or verified lesson likely to matter again.
- A consequential unresolved question or active blocker, clearly labeled.
- A short pointer to the primary specification, PR, issue or evidence instead of copying it.

**Do not capture:** casual chat, every brainstorm variant, redundant reports, live PR status without an observed date, unverified market claims as facts, speculative financial figures as settled prices, secrets or personal/customer information.

**Privacy:** This repository is PUBLIC. Never commit raw conversation logs, addresses, account numbers, salaries or personal budgets, credentials, tokens, API keys, private supplier/customer contacts, private contracts, screenshots of payments, or customer/order PII. If a memory depends on such facts, record a safe abstract operational constraint instead—or keep it out of Git entirely. Git history is not a reliable place to erase mistakenly committed secrets.

## Status vocabulary

- **FOUNDER_DECIDED** — the founder explicitly selected this direction. This is not authorization to deploy, take payments or change production.
- **HYPOTHESIS** — suggested/testable, not approved or validated.
- **VERIFIED_AT** — repository/code/test/operational observation with date and source; re-check before relying on it.
- **OPEN** — unresolved decision, task, risk or question.
- **SUPERSEDED** — replaced by a later decision; preserve a short explanation and point to the successor, not competing current assertions.

## Update protocol

1. At the end of a **substantive** project discussion or shipped change, identify only the durable deltas. No Git update is needed if nothing important changed.
2. If founder has explicitly decided, record it as **FOUNDER_DECIDED**; otherwise keep proposals as **HYPOTHESIS**. Never silently promote a suggestion to a decision.
3. Edit only the affected project memory and, where appropriate, the **actual owning canonical document**. Memory is a navigation/synthesis layer; it does **not** replace the TeeStock decision register, live code, source migrations, production truth or transaction records.
4. Add an observed/updated date and links. Resolve conflicting entries rather than appending duplicates. Prefer updating one small file over creating session-by-session documents.
5. Use the [lean feature workflow](../engineering/lean-feature-delivery.md): focused diff, GitHub commit/PR if needed, no routine multi-agent handoff. Do not auto-merge, deploy or mutate production by implication.
6. On the next session **retrieve GitHub again**. Do not assume previous chat memory or this snapshot is current. GitHub updates occur only in an active, authorized interaction; there is **no always-on background synchronization**.

**Evidence precedence:** verified live repository/deployment evidence > active canonical business decisions and specifications > dated project-memory summary > model/chat recollection. If sources disagree, surface the conflict instead of choosing the most convenient story.

## Cross-chat restart prompt

> Buka repo `Rizkybuilds/bisnishub`, baca `AGENTS.md`, `docs/project-memory/README.md`, dan memori proyek yang relevan. Verifikasi kondisi aktual GitHub sebelum melanjutkan. Lanjutkan diskusi/implementasi dari keputusan yang masih berlaku; jangan mengulang diskusi yang sudah diputuskan. Di akhir pembahasan penting, tawarkan/terapkan pembaruan memori yang aman dan ringkas.

This is a **lightweight retrieval habit**, not a claim that ChatGPT automatically reads GitHub before every message or persists every conversation without tool access.
