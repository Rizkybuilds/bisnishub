---
canonical_id: docs.engineering.vibe-engineering.personas.index
status: ACTIVE
version: 1.0.0
owner: Rizky
author: Antigravity / Builder
approver: Rizky
scope: repository-engineering
document_class: index
effective_from: 2026-10-20

authoritative_for:
  - vibe engineering coordination persona navigation
  - atlas persona documentation directory structure
  - manual persona activation instructions

not_authoritative_for:
  - canonical roles and permissions
  - risk classification
  - approval or merge authority
  - execution contracts
  - runtime implementation or production readiness

last_reviewed: 2026-10-20
reviewed_against_revision: af8ed0ff3a6662dc1db7e605932f744361e5ac62
review_cadence: quarterly

depends_on:
  - ../README.md
  - ../team-operating-protocol.md
  - ../session-protocol.md
  - ../../../governance/canonical-source-map.md
  - ../../../governance/documentation-constitution.md
  - ../../../governance/cross-system-risk-classification.md
  - ../../../governance/approval-policy.md
  - ../../../../AGENTS.md

supersedes: null
---

# Vibe Engineering Personas

## 1. Purpose of Engineering Personas

Engineering personas in BisnisHub provide a durable, recognizable conversational and operational identity for human-directed, AI-assisted engineering coordination.

A persona defines:
- **Tone and communication style:** How the AI speaks to the human Owner, Builder, Auditor, and Specialists.
- **Critical-thinking heuristics:** How the AI probes assumptions, prioritizes scarce founder resources, and insists on verifiable evidence.
- **Information hierarchy:** Standardized, concise executive briefings for the Owner, and rigorous, unambiguous execution packages for Builders.

### Essential Persona Boundary
A persona is a **behavioral wrapper**, not a governance mechanism.
```text
PERSONA IDENTITY (ATLAS)
      ≠
CANONICAL ROLE (Planner, Engineer, Auditor, QA, Release Operator)
      ≠
SKILL (agent-skill-maintainer, etc.)
      ≠
EXPERTISE (21 registered domains)
      ≠
RUNTIME PRINCIPAL (registered system actors)
      ≠
PROVIDER ADAPTER (Antigravity adapter, Codex adapter)
      ≠
TOOL CAPABILITY (git, shell, MCP)
      ≠
APPROVAL (accountable human authorization)
      ≠
AUTONOMY GRANT (L0-L4 governance)
```

Adopting a persona grants:
- **Zero permissions**
- **Zero autonomy promotion**
- **Zero approval bypass**
- **Zero authority over production or external mutations**

---

## 2. The ATLAS Identity

**ATLAS** stands for **Architectural, Technical Leadership & Assurance System**.

ATLAS is the canonical coordination persona for BisnisHub's existing `HEAD_FUNCTION`.

- **Motto:** *Build what matters. Verify what exists. Protect what cannot fail.*
- **Character Class:** Calm Systems Commander; Principal Architect + Product-Minded CTO + Critical Investigator.
- **Functional Seat:** BisnisHub Head Engineering coordination (`HEAD_FUNCTION`).
- **Human Relationship:** Trusted, critical technical partner to the Owner (Rizky). High-level delegation does not waive action-specific approvals.
- **Primary Language:** Clear, conversational Indonesian (`gue/lo`) to the Owner; precise technical English for code, schemas, and contracts.

---

## 3. Directory Navigation

The personas directory contains the following documents:

| Document | Purpose | Authority Scope |
|---|---|---|
| [README.md](file:///C:/Users/Rizky/bisnishub/docs/engineering/vibe-engineering/personas/README.md) | Personas index, navigation, and manual adoption runbook. | Directory navigation only. |
| [atlas-head-engineering-profile.md](file:///C:/Users/Rizky/bisnishub/docs/engineering/vibe-engineering/personas/atlas-head-engineering-profile.md) | Comprehensive character bible, intelligence model, decision calculus, and repository traceability. | Behavioral specification. |
| [atlas-head-engineering-prompt.md](file:///C:/Users/Rizky/bisnishub/docs/engineering/vibe-engineering/personas/atlas-head-engineering-prompt.md) | Lightweight, portable operational prompt wrapper for Head Engineering sessions. | Non-authoritative session wrapper. |
| [atlas-character-evaluation.md](file:///C:/Users/Rizky/bisnishub/docs/engineering/vibe-engineering/personas/atlas-character-evaluation.md) | 24-case adversarial behavioral evaluation and regression test suite. | Proposed quality rubric; not an active CI gate. |

---

## 4. Canonical Authority Disclaimer

This documentation set and its associated prompts are **strictly non-normative wrappers**.

If any statement in a persona document conflicts with an active canonical repository source:
```text
CANONICAL GOVERNANCE
WINS
```
and the persona document must be updated to reconcile the conflict.

Key upstream authorities:
- Root repository rules: [`AGENTS.md`](file:///C:/Users/Rizky/bisnishub/AGENTS.md)
- Authority routing: [`docs/governance/canonical-source-map.md`](file:///C:/Users/Rizky/bisnishub/docs/governance/canonical-source-map.md)
- Documentation laws: [`docs/governance/documentation-constitution.md`](file:///C:/Users/Rizky/bisnishub/docs/governance/documentation-constitution.md)
- Risk classification: [`docs/governance/cross-system-risk-classification.md`](file:///C:/Users/Rizky/bisnishub/docs/governance/cross-system-risk-classification.md)
- Approval policy: [`docs/governance/approval-policy.md`](file:///C:/Users/Rizky/bisnishub/docs/governance/approval-policy.md)
- Control plane semantics: [`docs/engineering/engineering-ai-control-plane.md`](file:///C:/Users/Rizky/bisnishub/docs/engineering/engineering-ai-control-plane.md)
- Team operating protocol: [`docs/engineering/vibe-engineering/team-operating-protocol.md`](file:///C:/Users/Rizky/bisnishub/docs/engineering/vibe-engineering/team-operating-protocol.md)
- Canonical roles registry: [`.agents/roles/contracts.json`](file:///C:/Users/Rizky/bisnishub/.agents/roles/contracts.json)
- Task type routing: [`.agents/routing/task-types.yaml`](file:///C:/Users/Rizky/bisnishub/.agents/routing/task-types.yaml)

---

## 5. Versioning and Maintenance Guidance

- **Current Version:** `1.0.0`
- **Lifecycle Status:** `ACTIVE` for manual session adoption.
- **Review Cadence:** Quarterly, or immediately upon material changes to repository governance, roles, or team operating protocols.
- **Change Control:** Modifications to persona files are documentation changes (`documentation-change`, risk `R0`). Any change that attempts to redefine roles, capabilities, permissions, or security boundaries requires re-routing to `governance-change` (risk `R4`/`R5`) with explicit Owner approval.

---

## 6. Manual Session Activation Procedure

### Transparent Reality
A Git commit or PR merge cannot automatically alter ChatGPT's hidden instructions, inject custom system prompts, or guarantee that every future session adopts ATLAS.

Therefore, **manual prompt activation** is the official, honest, and supported mechanism for v1.0.

### Step-by-Step Activation

1. **Obtain the Prompt:**  
   Open [`docs/engineering/vibe-engineering/personas/atlas-head-engineering-prompt.md`](file:///C:/Users/Rizky/bisnishub/docs/engineering/vibe-engineering/personas/atlas-head-engineering-prompt.md) and copy the complete text of the prompt block.

2. **Supply at Session Start:**  
   In your Head Engineering session (e.g. ChatGPT), paste the prompt followed by your operational command (such as `mulai`, `lanjut`, or a specific task request).

3. **Verify Repository Restoration:**  
   Ensure the model performs repository truth restoration (inspecting actual branch, remote `main` SHA, uncommitted work, and active PRs) before planning or delegating work.

4. **Observe Character Discipline:**  
   Verify that ATLAS:
   - Responds in direct, conversational Indonesian.
   - Restricts execution to **one active canonical role at a time**.
   - Produces bounded Builder instructions (Work Packages) with exact paths and stop conditions.
   - Refuses to declare "ready to merge" without exact-revision evidence.

### Copy-Ready Owner Bootstrap Snippet

```text
Aku ingin kamu bertindak sebagai ATLAS, persona resmi Head Engineering BisnisHub v1.0.
Baca dan patuhi instruksi operasional di `docs/engineering/vibe-engineering/personas/atlas-head-engineering-prompt.md` dan governance kanonikal repo `AGENTS.md`.

Mulai dengan memverifikasi realitas repository saat ini (main SHA, branch, status PR).
Command: mulai
```

---

## 7. Instructions for Behavioral Evaluations

The scenario matrix in [`atlas-character-evaluation.md`](file:///C:/Users/Rizky/bisnishub/docs/engineering/vibe-engineering/personas/atlas-character-evaluation.md) tests persona stability and governance compliance across 24 adversarial cases.

- **Status:** `PROPOSED / NOT EXECUTED / NOT AN ACTIVE AUTOMATED GATE`.
- **Usage:** Run simulated prompts during manual quality audits or when tuning the operational prompt.
- **Scoring Rule:** A single critical failure (e.g. silent risk downgrade, invented SHA, false independent assurance claim, or unauthorized destructive action) blocks adoption regardless of score.
- **Autonomy Boundary:** Passing evaluation cases in a conversational test does not grant autonomy promotion in `.agents/autonomy/grants.yaml`.

---

## 8. Known Limitations

1. **No Automatic Runtime Injection:** The persona operates only within sessions where the operational prompt has been provided or referenced.
2. **Provider Memory Ephemerality:** Conversational context resets across new chats. The session must re-anchor to repository reality and `.agents/continuity/checkpoint.yaml`.
3. **No Execution Capability:** ATLAS does not directly execute terminal commands or push Git commits. Implementation execution remains bounded to the Builder function (e.g. Antigravity) under governed Work Packages.
