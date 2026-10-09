---
canonical_id: docs.engineering.vibe-engineering.team-operating-protocol
status: ACTIVE
version: 1.0.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository-engineering
document_class: runbook
effective_from: 2026-10-09

authoritative_for:
  - multi-room engineering coordination procedure
  - cross-track assignment and reporting format
  - advisory-room and builder handoff procedure
  - parallel-work collision prevention procedure
  - shared engineering-team operating cadence

not_authoritative_for:
  - canonical role and expertise semantics
  - routing and risk classification
  - approval or merge authority
  - implementation-contract and work-package authorization
  - system architecture and business semantics
  - runtime implementation or production readiness

last_reviewed: 2026-10-09
reviewed_against_revision: 2489b3214e1f456dd32d42f5bfca6b9c2662c3a0
review_cadence: after-material-team-workflow-change

depends_on:
  - ./README.md
  - ./operating-model.md
  - ./session-protocol.md
  - ./change-package-template.md
  - ../engineering-ai-control-plane.md
  - ../../governance/canonical-source-map.md
  - ../../governance/approval-policy.md
  - ../../../.agents/roles/contracts.json
  - ../../../.agents/expertise/registry.yaml
  - ../../../.agents/routing/task-types.yaml
  - ../../../.agents/continuity/README.md
  - ../../../AGENTS.md

supersedes: null
---

# BisnisHub AI Engineering Team — Operating Protocol v1.0

## 1. Purpose

This runbook coordinates the Owner, a single Head Engineering coordination room, read-only specialist advisory rooms, and bounded implementation runtimes across chat or provider boundaries.

The intended result is useful parallel work without split-brain authority, overlapping writers, invented approvals, stale repository assumptions, or an Owner forced to arbitrate low-level engineering details.

This document extends existing Vibe Engineering **coordination procedure only**. It does not introduce new canonical roles, permission grants, risk classes, approval semantics, contract states, or implementation authority. If any statement conflicts with upstream ACTIVE governance, upstream canonical authority wins and the conflict must be reconciled.

## 2. Team Topology

    Owner (Rizky) — business intent, material decisions, final accountability
        |
        v
    Head Engineering function — one coordinated technical decision surface
        |       |
        |       +--> UI/UX specialist advisory room (read-only)
        |       +--> Backend specialist advisory room (read-only)
        |       +--> QA / Verification specialist (task-scoped)
        |       +--> Product / PRD or AI specialist (only when needed)
        |
        +--> governed Implementation Contract / Work Package
                     |
                     v
              Builder function (usually Antigravity)
                     |
                     v
              Exact-revision PR / evidence
                     |
                     v
              Governed review, QA, merge decision, post-merge verification

- Owner is the accountable human authority; high-level delegation does not silently waive action-specific approvals.
- Head Engineering is a coordination **function**, not a sixth canonical role or a second source of policy authority. The Head activates one applicable canonical role per governed execution stage.
- A specialist is an **expertise assignment within a canonical role**, not a permanent, independently authorized Head. A specialist's usual assignment here is read-only planning, critique, or audit; any later engineer/QA assignment must be separately routed and scoped.
- Builder is an execution **function**, normally operating under canonical Engineer role and a bounded authorized package.
- The five existing canonical roles remain Planner, Engineer, Auditor, QA/Verifier, and Release Operator, as defined by the Engineering AI Control Plane and roles registry.
- Having another chat, model, tool, or repository token does not change that room's permissions or create review independence.

## 3. One Head; Many Specialists

Exactly one Head Engineering coordination surface is designated for a given active engineering program. This is an **operational convention**, not a claim that the ChatGPT room itself is durable authority.

The Head:
- restores actual repository and PR state before material planning;
- resolves canonical ownership, risk, role, expertise, and required assurance;
- establishes priorities and non-overlapping work boundaries;
- reconciles specialist recommendations against actual source and existing contracts;
- produces or reviews required canonical planning/authorization artifacts;
- routes bounded implementation to the Builder;
- audits exact PR candidates and coordinates QA, integration, post-merge verification, and reflection;
- escalates only consequential decisions that must be made by the Owner.

The Head does not substitute informal chat approval for a canonical Implementation Contract, Work Package, or required Owner authorization.

Specialists may challenge Head proposals and surface blockers. They cannot independently authorize a Builder, announce readiness, merge, deploy, or alter canonical policy. Disagreements are evidence to be reconciled by the Head under canonical authority, not a voting mechanism.

## 4. Rooms and Activation Policy

| Room / runtime | Primary assignment | Default access in this operating model | Trigger |
| --- | --- | --- | --- |
| Engineering HQ / Head | Coordination and governed planning/audit lifecycle | Read, analyze; mutation only under separately applicable role and authorization | Always, for active program |
| Frontend / UI-UX Specialist | UX research, current-code audit, user journeys, interface acceptance proposals | Read-only advisory | When frontend usability work is active |
| Backend Specialist | Backend integrity/security review, architectural dependencies, regression findings | Read-only advisory | When backend risk or future backend planning materially benefits |
| QA / Verification Specialist | Browser walkthroughs, test design, negative cases, evidence review | Read-only by default; safe tests only when separately authorized | For candidate PR or a defined QA gate |
| Product / PRD Specialist | Requirements clarification and business-flow analysis | Read-only advisory | On demand |
| JARVIS / AI Specialist | Future AI capability research and design | Read-only advisory | On demand after applicable program gate |
| Antigravity / Builder | One bounded implementation slice | Explicit write paths and environment only | After a governed package is authorized |

A room is not considered active because its name appears here. Active assignments and implementation authority must be resolved from current repository artifacts and explicit Head routing.

No mandate exists to keep all rooms open or running. Start with the minimum helpful specialists. Avoid meetings or status reporting that add more overhead than engineering value.

## 5. Shared Truth Across Chats

Independent ChatGPT conversations are not automatically synchronized. A chat cannot assume it sees another room's newer messages, files, pending edits, or completion status. A chat also does not continue working in the background merely because a work assignment is written here.

For durable coordination use:
1. current GitHub repository state and canonical documents for engineering truth;
2. exact PR links, head/base SHAs, CI and runtime evidence for implementation results;
3. repository issues or existing governed coordination artifacts for discoverable assignments and handoffs;
4. the continuity checkpoint for a last-known snapshot, explicitly not live head;
5. chat transcript or Owner-transferred text only as non-authoritative context.

No new application, always-on agent server, task database, automated multi-room messaging service, or GitHub label schema is required by v1.0.

## 6. Assignment Issuance: Head-Only Coordination

A specialist should receive a **bounded advisory assignment**, not a copy of the entire project roadmap.

A discoverable assignment record may be kept in an existing GitHub issue or relevant change package. The format below is a coordination envelope, **not** a new canonical execution contract:

    ASSIGNMENT_ID: TEAM-<date>-<short-topic>
    REQUESTER: Head Engineering
    TARGET: <room or specialist expertise>
    CANONICAL_ROLE_FOR_THIS_EXECUTION: <planner | auditor | qa | engineer | release-operator>
    PROFILE: <active routing profile>
    PURPOSE: <single concrete question or result>
    READ_SCOPE: <directories / documents>
    WRITE_SCOPE: NONE (default specialist advisory)
    BASELINE: <observed main SHA + observation date>
    RELATED_PR_OR_WP: <number / link / identifier, or NONE>
    RISK_AND_ASSURANCE: <routing result or NOT_RESOLVED>
    IN_SCOPE: <bounded>
    OUT_OF_SCOPE: <explicit exclusions>
    DELIVERABLE: <report / critique / test plan>
    EVIDENCE: <links + file paths + exact revisions>
    COLLISION_DEPENDENCIES: <affected paths / other track>
    STOP_CONDITIONS: <canonical conflict / scope growth / stale baseline>
    NEXT_RECIPIENT: Head Engineering

A preliminary, read-only research assignment may precede full risk routing but must not be mistaken for implementation authorization.

Only canonical contracts and applicable governance authorize mutation where such authorization is required. Assignment records cannot silently open new Work Packages or approve actions.

## 7. Parallel Work / Single-Writer Rule

Parallel read-only research or review of the same module is allowed. Parallel mutations of **overlapping mutable scope** are not allowed by default.

Before Builder execution, Head or designated implementing role must verify:
- current main and open PRs;
- candidate base/branch/worktree and dirty state;
- exact or directory-level write scope;
- existing work package/implementation contract, if required;
- shared files, imports, schemas, generated artifacts, and cross-module dependencies;
- whether another writer owns or is editing affected paths.

**One active writer per overlapping mutable scope.** Different branches alone are not proof of non-overlap. Shared CSS, app shell, auth, database, API contracts, and common UI components can collide even if feature screens differ.

If overlap exists:
1. keep advisory tracks read-only;
2. serialize dependent implementation or explicitly partition distinct files and contracts;
3. reconcile baseline and dependency order before proceeding;
4. stop on unresolved ownership or risk instead of rebasing away someone else's changes.

Never reset, clean, stash, overwrite, revert, or delete someone else's work as a convenience.

## 8. Practical Track Separation

The following is an **example**, not a permanent authorization or claim of a live PR:

| Track | Good parallel activity | Collision boundary |
| --- | --- | --- |
| UI foundation Builder | Shared UI tokens, shell, foundational components in its own bounded package | Only one writer for shared CSS/layout/components |
| UI/UX advisory room | Analyze commercial and operations workflows; recommend future UX packages | No competing implementation of shell or current Builder files |
| Backend advisory room | Audit business integrity, test evidence, security boundaries, future backend dependencies | No speculative backend mutations or production actions |
| QA room | Prepare cases, inspect candidate evidence, safely exercise approved test environment | No hidden corrective code changes during purported independent review |

UX findings requiring backend work must be reported as **BACKEND_DEPENDENCY**; they do not authorize server command, database, permission, or money changes.

Business-changing backend work cannot be downgraded merely because it is requested by the UX track.

## 9. Handoff Contract Between Rooms

Every delivered specialist report should be concise at the top and reproducible below. At minimum include:

    ASSIGNMENT_ID:
    TRACK:
    ACTIVE_CANONICAL_ROLE:
    OBSERVED_REPOSITORY_MAIN:
    RELEVANT_PR_BASE_AND_HEAD:
    SOURCES_INSPECTED:
    FINDINGS: <IDs, severity, affected path/flow, observed evidence>
    FACTS_VS_INFERENCE: <clearly separated>
    PROPOSED_DIRECTION:
    CROSS_TRACK_DEPENDENCIES:
    OVERLAPPING_FILES_OR_CONTRACTS:
    TESTS_OR_BROWSER_EVIDENCE: <executed / not executed>
    RESIDUAL_RISK_AND_UNKNOWN:
    OWNER_LEVEL_DECISIONS_REQUIRED:
    HEAD_ENGINEERING_DECISIONS_REQUIRED:
    IMPLEMENTATION_AUTHORITY: NONE unless separately governed
    NEXT_RECIPIENT: Head Engineering

Use real source URLs, file paths, traceable test output, and exact revisions. If a browser was not exercised, say SOURCE-ONLY REVIEW; do not claim UX was visually or functionally validated. If a tool cannot access the repository, return BLOCKED / evidence unavailable, not a speculative PASS.

## 10. Decision and Change Lifecycle

    Owner intent
        -> Head restores current repo and program state
        -> Head issues bounded research/audit assignments
        -> Specialists deliver evidence and proposals
        -> Head reconciles conflicts and technical trade-offs
        -> Canonical routing, risk, assurance, contract/WP gates as applicable
        -> One bounded Builder per mutable scope
        -> Exact-head PR audit and QA
        -> Applicable Owner / authorized-actor integration decision
        -> Post-merge CI, revision, artifact verification
        -> Reflection and durable program-state update as appropriate

Specialist findings can be rejected with an explained reason. A specialist report is not a decision record until reconciled in the governed engineering workflow.

Do not equate CI success with usability, security certification, production readiness, or real business pilot success.

## 11. Risk, Roles, and Assurance

This document does not create a separate specialist risk scale, QA bar, definition of independent review, or merge policy.

For each material change:
- use the currently ACTIVE target routing profile in .agents/routing/task-types.yaml;
- use highest applicable risk and the union of concerns/required roles;
- activate one canonical role at a time for each execution;
- execute required assurance at the applicable strength;
- bind audits, tests, evidence, and conclusions to exact revisions;
- do not call a separate chat an independent reviewer solely because it has a different conversation ID;
- only actual review provenance supports an independence claim.

Security, finance, authorization, organization isolation, schema/migrations, state-machine or production changes trigger their canonical escalations and cannot be laundered through a frontend or documentation assignment.

## 12. Collision and Escalation Rules

Stop or return to Head Engineering rather than self-expanding if:
- current main / PR head changed materially since the assignment;
- another implementation PR overlaps intended write scope;
- canonical sources disagree or a required source is absent;
- proposed work requires changing business semantics, auth, payment, schema, or deployment authority;
- the task exceeds assigned files, risk, or environment;
- access, credentials, or local data boundaries are unclear;
- required QA evidence is unavailable;
- owner-level business, scope, cost, privileged, or release decision is required.

Use existing repository stop terminology (e.g. STALE_BASELINE, SCOPE_EXPANSION_REQUIRED, UNRELATED_WORK_COLLISION) as applicable. Do not invent new canonical runtime status enums in this team runbook.

## 13. Owner Communication

Default Owner summary should answer in plain Indonesian:
1. what is being built or audited and why it matters;
2. what is verified and what remains unknown;
3. whether there is a blocker or material risk;
4. whether any Owner decision is genuinely required;
5. the single safe next action.

Do not ask the Owner to adjudicate CSS architecture, React patterns, routine test choices, or PR diffs. Head Engineering owns technical recommendation and coordination; Owner retains final human accountability and consequential approval.

An Owner message such as "lanjut" triggers restoration and the next governed action. "PR #N updated" triggers fresh exact-head audit. "merged" triggers verification, not an assumption of success.

## 14. Practical Activation Checklist

For each newly opened specialist room:
- Provide the role-specific advisory prompt and repository URL.
- Explicitly state the room is not a second Head Engineering.
- Provide one bounded assignment with read scope and deliverable.
- Require the room to inspect current main, relevant canonical sources, and active PR collision.
- Require the room to return a grounded handoff to Head, not a direct Builder prompt.
- Record substantive reports in a durable GitHub issue or relevant governed artifact when needed.
- Do not assume the Head sees room outputs until linked, handed off, or retrieved.

For a Builder assignment:
- Require the accepted implementation plan/contract/WP as applicable.
- Confirm exact base, allowed paths, environment, risk, and stop conditions.
- No unbounded coding, merge, deployment, or production mutation.
- Return exact PR head and verification evidence for Head/QA review.

## 15. Specialist Room Bootstrap (Reusable)

UI/UX Specialist:

    Act as BisnisHub UI/UX Specialist in read-only advisory capacity.
    Repo: https://github.com/Rizkybuilds/bisnishub
    Single Head Engineering: main engineering room.
    Before analysis, restore actual main/PR state, read applicable AGENTS and MGBOS docs.
    Analyze only the bounded assignment provided by Head, distinguishing source review from browser tests.
    Do not modify files, open PRs, authorize Builder, or claim merge authority.
    Return evidence and the Section 9 handoff format.

Backend Specialist:

    Act as BisnisHub Backend Specialist in read-only advisory capacity.
    Repo: https://github.com/Rizkybuilds/bisnishub
    Single Head Engineering: main engineering room.
    Restore exact repository state and applicable MGBOS architecture/security governance.
    Identify defects, integrity risks, test gaps, and bounded recommendations.
    No mutation, production access, contract approval, or competing implementation authority.
    Return evidence and the Section 9 handoff format.

QA Specialist:

    Act as BisnisHub QA/Verification Specialist for one explicitly scoped candidate.
    Repo: https://github.com/Rizkybuilds/bisnishub
    Single Head Engineering: main engineering room.
    Verify exact PR head and required source/runtime gates.
    Execute only safe tests authorized for the selected environment.
    Distinguish missing browser evidence, local test results, hosted CI, and actual user acceptance.
    Do not quietly fix implementation while representing the result as independent QA.
    Return findings, evidence, and the Section 9 handoff format.

## 16. Team v1.0 Completion Criteria

This coordination protocol is operationally useful when:
- one Head coordination surface and scoped specialist assignments are explicit;
- specialist outputs arrive in a consistent, revision-grounded handoff;
- any active Builder has one bounded, non-overlapping write scope;
- parallel research does not become unauthorized parallel implementation;
- new chats can restore truth from GitHub without relying on each other's memories;
- Owner decisions are limited to genuinely consequential matters;
- conflicts, stale baselines, and missing evidence produce stops, not fabricated PASS claims;
- no policy, permission, or production authority is inferred from the existence of this document.

No repository merge of this document by itself proves that chat rooms were created, tasks are autonomously scheduled, agents can message one another, or operational acceptance was completed.

## 17. Change Control

Review this runbook when adding new specialist rooms, changing assignment format, or discovering recurring coordination conflicts.

Changes to role semantics, routing, risk, approval authority, implementation contract states, or release permission must be made at their respective canonical owners under full applicable governance. Do not edit this runbook to evade those controls.

**Final principle:** One Head coordination function, explicit canonical roles, bounded specialists, one writer per overlapping mutable scope, repository truth, exact-revision evidence, and Owner accountability.
