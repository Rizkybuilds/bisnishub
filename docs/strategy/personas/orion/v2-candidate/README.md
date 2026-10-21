---
canonical_id: docs.strategy.personas.orion.v2-candidate.index
status: PROPOSED
version: 2.0.0-candidate.1
owner: Rizky
author: Antigravity / Builder
approver: Rizky
scope: repository-strategy
document_class: index
effective_from: 2026-10-21

authoritative_for:
  - orion v2 candidate navigation
  - v2 candidate document suite
  - v2 testing and evaluation coordination

not_authoritative_for:
  - canonical roles and permissions
  - risk classification
  - approval or merge authority
  - execution contracts
  - runtime implementation or production readiness
  - legal co-founder or fiduciary authority
  - financial transactions or external commitments

last_reviewed: 2026-10-21
reviewed_against_revision: 038539f3f1d2e054f9856dd0760471f58b70574b
review_cadence: quarterly

depends_on:
  - ../README.md
  - ../character-specification.md
  - ../operational-prompt.md
  - ../behavioral-evaluation.md
  - ../decision-and-handoff-templates.md
  - ../../../../project-index.md
  - ../../../../governance/canonical-source-map.md
  - ../../../../governance/documentation-constitution.md
  - ../../../../governance/cross-system-risk-classification.md
  - ../../../../governance/approval-policy.md
  - ../../../../../AGENTS.md

supersedes: null
---

# ORION v2 — Candidate Specification & Staging Suite

> **Document Status:** `PROPOSED` (Candidate for Evaluation; NOT Canonical Active).  
> **Provisional Effective Risk:** `R2` (Isolated candidate documentation mutation; non-normative strategy candidate).  
> **Active Baseline:** ORION v1.0 under [`../README.md`](../README.md) remains the active canonical baseline.  
> **Rollback Invariant:** If v2 candidate evaluation fails any critical gate, canonical sessions immediately revert to [`../operational-prompt.md`](../operational-prompt.md).

---

## 1. Purpose & Scope

This directory contains the staged candidate implementation for **ORION v2.0**, developed under the governed ORION v2 Full Development Campaign.

ORION v2 enhances the strategic reasoning, creative exploration, conversational brevity, and memory discipline of the AI Co-Founder persona while strictly preserving the five core personality pillars, authority boundaries, and zero-tolerance governance rules established in v1.0.

### Candidate Documents
1. [`role-contract-v2.md`](role-contract-v2.md) — **OR2-01:** Twelve-dimensional role contract, character psychology, and anti-pattern boundaries.
2. [`cognitive-operating-cycle.md`](cognitive-operating-cycle.md) — **OR2-02:** Intent classifier (`BRAINSTORM`, `CONDITIONAL_PLAN`, `DECISION`, `EXECUTION_REQUEST`), O.P.E.N. discovery, N.O.R.T.H. decision pass, evidence reflection, and output budgeting.
3. [`portable-prompt-v2.md`](portable-prompt-v2.md) — **OR2-03:** Concise, layered, portable operational prompt candidate.

---

## 2. Relationship to ORION v1.0

| Attribute | ORION v1.0 (Active Baseline) | ORION v2.0 (Candidate) |
|---|---|---|
| **Location** | `docs/strategy/personas/orion/` | `docs/strategy/personas/orion/v2-candidate/` |
| **Pillars** | 5 Personality Pillars | 5 Original Pillars + 7 Observable Expressive Traits |
| **Reasoning Loops** | N.O.R.T.H. Decision Protocol | O.P.E.N. (Discovery) $\rightarrow$ N.O.R.T.H. (Decisions) $\rightarrow$ Evidence Reflection (Learning) |
| **Intent Classification** | Tacit / Conversational | Explicit 4-state enum: `BRAINSTORM`, `CONDITIONAL_PLAN`, `DECISION`, `EXECUTION_REQUEST` |
| **Output Behavior** | Structured templates by default | Adaptive output budgeting: concise conversational default; structured templates for high-stakes decisions |
| **Evaluation Suite** | 36 scenarios (`NOT_RUN`) | 63 scenarios (36 v1 preserved + 18 reasoning + 9 memory) |
| **Memory Strategy** | Ephemeral context | Selective 4-plane typed memory candidate (read-only pilot, no auto-persistence) |
| **Canonical Status** | `REVIEW` (Merged on `main`) | `PROPOSED` (Awaiting OR2-05 Paired Evaluation and Owner Approval) |

---

## 3. Governance & Promotion Controls

1. **Non-Normative Candidate:** These documents represent candidate persona specifications. They do NOT confer principal authority, system permissions, financial execution capabilities, or merge rights.
2. **Phase Gating:** Progression from candidate to active requires:
   - **G1 (Phase A):** Completion and review of candidate role contract, cognition cycle, and prompt.
   - **G2 (Phase B):** 63-case paired evaluation (OR2-04 / OR2-05) with 2/2 passes across all 10 critical cases.
   - **G3–G6 (Phases C–F):** Governed memory, tool boundary, and supervised founder pilot milestones.
3. **Emergency Rollback:** If any candidate prompt causes unexpected model drift, sycophancy, or boundary confusion, users must immediately revert to the v1.0 operational prompt:
   ```text
   Revert to canonical ORION v1.0: docs/strategy/personas/orion/operational-prompt.md
   ```
