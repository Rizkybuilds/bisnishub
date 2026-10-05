---
canonical_id: docs.engineering.repository-release-gates
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository-engineering
document_class: standard
effective_from: 2026-10-05

authoritative_for:
  - repository-level engineering release gates
  - repository engineering integration flow
  - repository scope isolation and verification
  - repository governance pre-merge and post-merge gates

last_reviewed: 2026-10-05
review_cadence: quarterly

depends_on:
  - ../governance/documentation-constitution.md
  - ../governance/canonical-source-map.md
  - ../governance/cross-system-risk-classification.md
  - ../governance/evidence-provenance-model.md
  - ./engineering-ai-control-plane.md
  - ./vibe-engineering/README.md
  - ../../.agents/routing/task-types.yaml
  - ../../AGENTS.md

supersedes: null
---

# Repository Engineering Release Gates & Integration Standard

## 1. Purpose

This document establishes canonical integration and release gates for changes routed under:

```text
profile: repository-engineering
workspace: ./
```

It defines the integration criteria, evidence requirements, and stop conditions for repository-level engineering, governance, architecture, and developer-tooling work.

This document is repository-owned. It intentionally does not duplicate MGBOS transactional business semantics (such as integer-money representation, quote states, PostgreSQL system of record, or DTF/apparel manufacturing invariants).

---

## 2. Core Integration Flow

Every governed repository-level change must traverse the canonical integration flow:

```text
BOUNDED OBJECTIVE
        ↓
CANONICAL AUTHORITY RESOLVED
        ↓
ROUTING / RISK RESOLVED
        ↓
SCOPE ISOLATION
        ↓
REPOSITORY INTEGRITY
        ↓
ENGINEERING GOVERNANCE
        ↓
APPLICABLE SYSTEM-SPECIFIC CHECKS
        ↓
EXACT REVISION AUDIT
        ↓
QA / VERIFICATION
        ↓
HOSTED CI
        ↓
OWNER MERGE DECISION
        ↓
POST-MERGE VERIFICATION
```

No stage in this sequence may be bypassed or assumed.

---

## 3. Preserved Governance Invariants

The following canonical invariants must be explicitly preserved across all repository-level work:

```text
CI PASS ≠ MERGE AUTHORIZATION
```

Green hosted CI proves only that designated automated checks passed on a specific commit. It does not authorize integration into `main`.

```text
MERGED ≠ POST-MERGE VERIFIED
```

A merged pull request is an integration event, not evidence that post-merge verification has passed.

```text
POST-MERGE VERIFIED ≠ PRODUCTION VERIFIED
```

Post-merge verification proves repository integrity on `main`. It does not prove external deployment health or production outcome.

```text
REPOSITORY PROFILE ≠ SYSTEM-SPECIFIC GOVERNANCE BYPASS
```

The `repository-engineering` profile exists to govern repository-level infrastructure. It must never serve as an easier route or bypass for work that belongs to a governed system runtime.

---

## 4. System-Specific Boundaries and Scope Isolation

When a repository-level task reveals that changes are required inside a governed system workspace (such as `systems/mgbos/`):

1. **System-Specific Gates Apply Unconditionally:** Repository-level routing must never downgrade, replace, or bypass system-specific release gates (e.g., MGBOS migration immutability, application builds, business integrity audits).
2. **No Silent Absorption:** A repository engineering package must not silently absorb runtime system modifications.
3. **Required Action on Boundary Cross:**
   ```text
   STOP → SCOPE_EXPANSION_REQUIRED → re-plan / split package
   ```
   The runtime change must be isolated into a properly routed, system-specific change package.

---

## 5. Repository Integration Gate Matrix

| Gate | Scope | Required Evidence | Blocking Condition |
|---|---|---|---|
| **1. Bounded Objective & Authority** | Repository | Accepted Implementation Contract, exact base SHA bound, canonical semantic owner identified | Ambiguous objective, unverified assumptions, competing authority |
| **2. Routing & Risk Resolution** | Repository | Active `repository-engineering` profile, canonical task type and concerns, effective risk computed (minimum R1 floor for governance changes) | Unknown profile, borrowed profile, unverified low risk, unauthorized role delegation |
| **3. Scope Isolation** | Repository | Strict adherence to declared allowed paths, zero out-of-scope edits | Unexpected file mutations, silent scope creep, cross-system bleed |
| **4. Repository Integrity** | Repository | Valid Markdown links, zero merge conflict markers, zero unfinished placeholder scaffolds, correct directory placement | Broken relative links, git conflict markers, invalid directory layout |
| **5. Engineering Governance** | Repository | Structural and semantic validator passes (`validate-agent-governance.py`, contract validators, continuity validators) | Schema failure, invalid role/expertise mapping, inactive profile reference |
| **6. System-Specific Protection** | Cross-System | Confirmation that governed system boundaries (`systems/mgbos/**`, etc.) remain uncompromised | Undetected runtime modifications, weakened system guards |
| **7. Exact-Revision Audit** | Repository | Exact PR head SHA audited, diff inspected line-by-line, Assurance Report recorded | Stale audit SHA, unreviewed head changes, self-review masquerading as independent |
| **8. QA & Verification** | Repository | Clean execution of local test suites, negative bypass tests, regression verification | Failing unit tests, missing negative tests, unverified bypass risks |
| **9. Hosted CI** | Repository | Required GitHub Actions workflows green on the exact candidate commit (`Agent Governance`, `Repository Integrity`) | Failing CI, missing workflow runs, stale check status |
| **10. Owner Merge Decision** | Repository | Explicit, informed merge decision by repository Owner (Rizky) | Automated merge attempt, assumed approval, self-merging agent |
| **11. Post-Merge Verification** | Repository | Reconciled `main` SHA, verified integration commit, post-merge continuity update | Unconfirmed merge, post-merge interference, missing reflection |

---

## 6. Self-Modifying Governance Safety

When an engineering change modifies governance validators, CI workflows, or release gates themselves:

- The modified validator passing itself is **not sufficient evidence** of safety.
- Positive tests must prove intended behavior works as designed.
- Negative tests must prove deliberate bypasses, misconfigurations, and boundary violations are rejected fail-closed.
- Human Owner and Head Engineering exact-diff review are required prior to merge consideration.

---

## 7. Canonical Local Verification Suite

Before submitting any repository-level change for PR audit, the following checks must be executed in a local non-production environment:

```sh
# Syntax verification
python -m py_compile scripts/governance/validate-agent-governance.py scripts/governance/test_agent_governance.py

# Structural governance validation
python scripts/governance/validate-agent-governance.py

# Governance unit and mutation regression test suite
python -m unittest discover -s scripts/governance -p 'test_agent_governance.py'
python -m unittest discover -s scripts/governance -p 'test_*.py'

# Continuity checkpoint validation
python scripts/governance/validate_vibe_continuity.py

# Repository reference and link integrity
python scripts/governance/check_document_references.py
```

---

## 8. Authority & Execution Boundaries

Tool availability (e.g., shell access, git credentials, GitHub API, MCP tools) does **not** constitute authorization for:
- remote repository mutation without review;
- merging pull requests;
- modifying branch protection rules;
- executing production operations;
- or altering repository security policies.

All release and integration actions remain strictly governed by repository permissions and Owner authorization.
