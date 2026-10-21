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
2. [`cognitive-operating-cycle.md`](cognitive-operating-cycle.md) — **OR2-02:** Intent classifier (`BRAINSTORM`, `CONDITIONAL_PLAN`, `DECISION`, `EXECUTION_REQUEST`), auxiliary `LEARN` posture, O.P.E.N. discovery, N.O.R.T.H. decision pass, evidence reflection, and output budgeting.
3. [`portable-prompt-v2.md`](portable-prompt-v2.md) — **OR2-03:** Concise, layered, portable operational prompt candidate.

---

## 2. Relationship to ORION v1.0

| Attribute | ORION v1.0 (Active Baseline) | ORION v2.0 (Candidate) |
|---|---|---|
| **Location** | `docs/strategy/personas/orion/` | `docs/strategy/personas/orion/v2-candidate/` |
| **Pillars** | 5 Personality Pillars (verbatim) | 5 Original Pillars (verbatim preserved) + 7 Observable Expressive Traits |
| **Reasoning Loops** | N.O.R.T.H. Decision Protocol | O.P.E.N. (Discovery) $\rightarrow$ N.O.R.T.H. (Decisions) $\rightarrow$ Evidence Reflection (In-Session Learning) |
| **Intent Classification** | Tacit / Conversational | Explicit 4-state enum: `BRAINSTORM`, `CONDITIONAL_PLAN`, `DECISION`, `EXECUTION_REQUEST` (with auxiliary `LEARN`) |
| **Output Behavior** | Structured templates by default | Adaptive output budgeting: concise conversational default; structured templates for high-stakes decisions |
| **Evaluation Suite** | 36 scenarios (`NOT_RUN`) | 54 prompt behavioral cases for G2 (10 critical 2/2 PASS) + 9 runtime memory cases for G3; 63 total for release |
| **Memory Strategy** | Ephemeral context | Selective 4-plane typed memory candidate (read-only pilot, no auto-persistence) |
| **Lifecycle Reality** | Merged reference documentation (`status: REVIEW`; evaluation `NOT_RUN`; runtime `NOT_INSTALLED`) | `PROPOSED` candidate (Awaiting Phase B evaluation and Owner approval) |
| **Head Engineering Coordination** | Established Head Engineering function (ATLAS PR #88 candidate status verified at execution time) | Interfaces via Business Outcome Briefs; verifies ATLAS PR #88 dynamically from repository reality |

---

## 3. Governance & Promotion Controls

1. **Non-Normative Candidate:** These documents represent candidate persona specifications. They do NOT confer principal authority, system permissions, financial execution capabilities, or merge rights.
2. **Lifecycle Distinction:** Merged documentation does not equal an evaluated, activated runtime. Canonical v1 documentation on `main` is reference material (`status: REVIEW`). ORION v2 remains `PROPOSED / CANDIDATE_UNTESTED`.
3. **Phase Gating & Evaluation Dependencies:**
   - **G1 (Phase A):** Bounded candidate specification (role contract, cognition cycle, prompt).
   - **G2 (Phase B):** 54-case prompt evaluation (OR-EVAL-01..54); all 10 critical cases must achieve 2/2 PASS with zero tolerated failures before prompt acceptance.
   - **G3–G4 (Phases C–D):** Memory architecture, threat model, and prototype. The 9 runtime memory tests (OR-MEM-EVAL-01..09) are executed only after the G3 memory prototype is available.
   - **G5–G6 (Phases E–F):** Governed tool/handoff pilots, supervised founder pilot, and final release review requiring the complete applicable 63-case evidence suite.
4. **Emergency Rollback:** If any candidate prompt causes unexpected model drift, sycophancy, or boundary confusion, users must immediately revert to the v1.0 operational prompt:
   ```text
   Revert to canonical ORION v1.0: docs/strategy/personas/orion/operational-prompt.md
   ```
