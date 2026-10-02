---
canonical_id: docs.engineering.runtime-adapter-architecture
status: ACTIVE
version: 1.1
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository-engineering
document_class: canonical-specification
effective_from: 2026-10-01

authoritative_for:
  - engineering runtime adapter architecture
  - Codex engineering adapter semantics
  - Antigravity engineering adapter semantics
  - runtime context loading boundaries
  - runtime-to-control-plane mapping
  - runtime artifact handoff rules
  - provider-specific adapter constraints

last_reviewed: 2026-10-02
review_cadence: quarterly

depends_on:
  - engineering-ai-control-plane.md
  - ../governance/cross-system-risk-classification.md
  - ../governance/evidence-provenance-model.md
  - ../../AGENTS.md
  - ../../.agents/roles/contracts.json
  - ../../.agents/expertise/registry.yaml
  - ../../.agents/routing/task-types.yaml
  - ../../.agents/contracts/README.md
  - ../../systems/mgbos/docs/engineering/agent-system/workflow.md

verified_provider_surfaces:
  codex:
    verified_at: 2026-10-01
    mechanisms:
      - AGENTS.md hierarchy
      - Agent Skills / SKILL.md
  antigravity:
    verified_at: 2026-10-02
    mechanisms:
      - .agents/rules/
      - .agents/skills/

implementation_status: PARTIALLY_IMPLEMENTED
initial_adapters:
  - codex
  - antigravity
---

# BisnisHub Engineering Runtime Adapter Architecture v1.1

## 1. Purpose

Dokumen ini mendefinisikan bagaimana provider engineering runtime menggunakan BisnisHub Engineering AI Control Plane tanpa membuat versi governance mereka sendiri.

Initial runtime targets:

```text
Codex
Antigravity
```

Future targets MAY include:

```text
Claude Code
Hermes
other engineering runtimes
```

setelah mekanisme resminya diverifikasi.

---

# 2. Core Principle

> Provider runtimes adapt to BisnisHub governance.  
> BisnisHub governance does not adapt its semantics to provider brands.

Canonical:

```text
CONTROL PLANE
      ↓
RUNTIME ADAPTER
      ↓
PROVIDER RUNTIME
```

Not:

```text
Codex policy
Antigravity policy
Claude policy
     ↓
conflicting repository governance
```

---

# 3. Adapter Is Translation

Runtime Adapter translates:

```text
canonical repository policy
        ↓
provider-native context surfaces
```

It MAY define:

```text
where instructions are loaded

how workflow is triggered

how Skills become discoverable

how execution artifacts are supplied

how runtime identity is recorded
```

It MUST NOT redefine:

```text
risk semantics

role authority

business invariants

permission

expertise meaning

release gates

assurance independence

artifact semantics
```

---

# 4. Canonical Authority

Provider-specific adapter instructions are subordinate to:

```text
docs/governance/

docs/architecture/

docs/engineering/engineering-ai-control-plane.md

.agents/roles/

.agents/expertise/

.agents/routing/

.agents/contracts/

system-owned specifications
```

If adapter instruction conflicts with canonical repository governance:

```text
CANONICAL REPOSITORY GOVERNANCE WINS
```

and adapter drift must be corrected.

---

# 5. Thin Adapter Requirement

Runtime adapters SHOULD remain small.

They SHOULD primarily contain:

```text
entrypoint

context-loading instructions

artifact-loading instructions

runtime-specific workflow mechanics

provider-specific caveats
```

They SHOULD NOT duplicate entire:

```text
risk model

permission matrix

business invariants

role definitions

expertise definitions

routing registry
```

---

# 6. Shared Engineering Skills

Project Skills remain:

```text
.agents/skills/
```

They are shared reusable engineering procedures.

Provider adapters SHOULD consume the same Skill source where supported.

Do not maintain:

```text
Codex version of api-backend-engineer

Antigravity version of api-backend-engineer
```

unless an unavoidable provider-specific format requires a generated adapter.

Canonical Skill remains project-owned.

---

# 7. Runtime Identity

Every material execution SHOULD record:

```text
runtime

provider

runtime/model version where available

active role
```

Example:

```yaml
runtime: Codex
provider: OpenAI
active_role: engineer
```

or:

```yaml
runtime: Antigravity
provider: Google
active_role: planner
```

Runtime brand does not determine authority.

---

# 8. One Active Role

At any engineering execution moment:

```text
ONE RUNTIME EXECUTION
=
ONE ACTIVE ROLE
```

A runtime MAY switch role over time.

Example:

```text
Planner
→ Engineer
```

But responsibility boundary must remain explicit.

Switching role does not create review independence.

---

# 9. One Writer

Any implementation runtime MUST preserve:

```text
ONE WRITER
=
ONE BRANCH
=
ONE WORKTREE
=
ONE BOUNDED WORK PACKAGE
```

Two runtime sessions MUST NOT concurrently modify overlapping mutable scope without explicit integration design.

---

# 10. Artifact-Based Handoff

Runtime handoff SHOULD happen through canonical artifacts rather than conversational recollection.

Preferred:

```text
Planner
→ Implementation Contract

Planner / Coordinator
→ Work Package

Engineer
→ Engineering Report

Auditor
→ Assurance Report

QA
→ Verification Matrix

Release Operator
→ Release Packet
```

A runtime receiving work SHOULD read the artifact representing its inbound contract.

---

# 11. Conversation Is Not Durable Authority

Prompt history may provide useful context.

It MUST NOT substitute for:

```text
exact revision

accepted scope

risk

canonical sources

Work Package

verification evidence
```

for material engineering work.

---

# 12. Codex Adapter

Codex adapter uses existing repository-native sources:

```text
AGENTS.md

system-level AGENTS.md

.agents/skills/

canonical repository documents

.agents/contracts/
```

No separate:

```text
CODEX_POLICY.md
```

is required.

---

# 13. Codex Instruction Hierarchy

Codex SHOULD consume applicable hierarchical AGENTS instructions.

For MGBOS work:

```text
AGENTS.md
        ↓
systems/mgbos/AGENTS.md
```

plus task-relevant canonical sources.

Do not force Codex to preload every architecture document for every small change.

---

# 14. Codex Context Economy

Codex SHOULD load:

```text
minimum sufficient canonical context
```

based on:

```text
task type

concerns

risk

affected system

affected capabilities
```

Routine UI work should not automatically load:

```text
financial integrity

database transaction

release recovery
```

unless they actually become relevant.

---

# 15. Codex Planning Activation

For material MGBOS change planning, Codex SHOULD load:

```text
root AGENTS.md

systems/mgbos/AGENTS.md

Engineering AI Control Plane

routing registry

relevant canonical system sources

Planner role

mgbos-change-planner Skill
```

Then produce or consume:

```text
Implementation Contract
```

---

# 16. Codex Implementation Activation

Engineer-mode Codex SHOULD receive:

```text
accepted Implementation Contract

one Work Package

base revision

branch/worktree identity

required expertise IDs

selected relevant Skills
```

before material implementation.

The Work Package is the execution boundary.

---

# 17. Codex Review Activation

Auditor-mode Codex SHOULD consume:

```text
Implementation Contract

Engineering Report

exact candidate revision

raw applicable evidence

canonical sources
```

and produce:

```text
Assurance Report
```

If the same Codex execution implemented the change:

```text
independence = SELF_REVIEW
```

not:

```text
INDEPENDENT
```

---

# 18. Codex QA Activation

QA-mode Codex SHOULD consume:

```text
Implementation Contract

exact candidate revision

acceptance criteria

risk

Engineering Report

applicable Assurance Report
```

and produce:

```text
Verification Matrix
```

Tests that were not executed remain:

```text
NOT_RUN
```

or:

```text
BLOCKED
```

---

# 19. Codex Release Activation

Release Operator mode is activated only when release preparation is actually in scope.

Implementation completion does NOT implicitly activate deployment.

Input:

```text
exact clean candidate revision

Assurance Report

Verification Matrix

target

recovery evidence

release gates
```

Output:

```text
Release Packet
```

---

# 20. Antigravity Adapter

Antigravity adapter uses:

```text
.agents/rules/

.agents/skills/
```

as provider-native surfaces.

Legacy `.agents/workflows/` is no longer part of the active adapter surface.

Canonical shared Skills remain:

```text
.agents/skills/
```

No duplicated Antigravity Skill catalog is required.

---

# 21. Antigravity Rule

Initial always-on adapter rule:

```text
.agents/rules/engineering-control-plane.md
```

Its purpose is only to:

```text
route Antigravity toward canonical governance

establish material-work activation

prevent provider-specific policy forks
```

It MUST remain significantly smaller than canonical control-plane documentation.

---

# 22. Antigravity Governed Change Skill

Current reusable orchestration entrypoint:

```text
.agents/skills/mgbos-change/SKILL.md
```

Expected Antigravity invocation:

```text
/mgbos-change <objective>
```

The legacy workflow:

```text
.agents/workflows/mgbos.change.md
```

and its slash command:

```text
/mgbos.change
```

were retired during CP-007A.2 because Agent Skills names use lowercase letters, numbers, and hyphens and must match the parent directory.

The Skill is reusable orchestration knowledge.

It is NOT:

```text
permission

release authorization

production access

automatic independent review
```

---

# 23. Antigravity Skill Responsibility

The mgbos-change Skill SHOULD coordinate:

```text
preflight

classification

planning

bounded implementation

evidence

review routing

QA routing

optional release preparation
```

while delegating actual semantics to canonical repository files.

---

# 24. Antigravity Planning

The mgbos-change Skill first resolves:

```text
target system

primary task type

concerns

effective risk

role flow

expertise

stop conditions
```

from canonical registries.

For material work it then establishes:

```text
Implementation Contract
```

before implementation.

---

# 25. Antigravity Implementation

If implementation is in scope:

```text
one Work Package
        ↓
one writer
        ↓
one branch
        ↓
one worktree
```

Antigravity MUST audit existing dirty work before editing.

It MUST preserve unrelated work.

---

# 26. Antigravity Parallelism

Antigravity MAY coordinate parallel work only when Work Packages are non-overlapping.

Allowed:

```text
WP-A
frontend files

WP-B
independent documentation files
```

when integration is planned.

Forbidden default:

```text
Agent A edits payment command

Agent B edits same payment command concurrently
```

---

# 27. Antigravity Multi-Agent Does Not Imply Independence

Parallel or separate agent labels do not automatically prove:

```text
INDEPENDENT REVIEW
```

Assurance independence must be factually recorded.

Same runtime/session/model performing implementation and review remains:

```text
SELF_REVIEW
```

unless actual independent-executor criteria are satisfied.

---

# 28. No Assumed Codex Invocation

Antigravity adapter MUST NOT assume it can programmatically spawn or control Codex.

Likewise Codex MUST NOT assume it can invoke Antigravity.

Until an officially supported integration is implemented:

```text
handoff = artifact-based
```

not provider-to-provider RPC.

---

# 29. Cross-Runtime Handoff

Example:

```text
Antigravity Planner
        ↓
IC + WP
        ↓
Codex Engineer
        ↓
ER
        ↓
independent Auditor runtime
        ↓
AR
```

Runtime transition is explicit.

The receiving runtime re-establishes:

```text
revision

role

scope

risk

canonical sources
```

before continuing.

---

# 30. Risk Cannot Be Lowered by Runtime

A runtime MAY discover higher consequence and escalate risk.

It MUST NOT lower below:

```text
task floor

concern floor

capability floor

environment floor

canonical policy floor
```

because a provider believes the task looks simple.

---

# 31. Tool Access Is Not Permission

Provider runtime may expose:

```text
shell

GitHub

browser

database client

MCP
```

Tool availability does not grant business or production authority.

Canonical:

```text
CAN_EXECUTE_TOOL
≠
MAY_EXECUTE_ACTION
```

---

# 32. Unknown Environment

If runtime cannot establish whether a target is:

```text
local

staging

production

shared

disposable
```

for a consequential mutation:

```text
ENVIRONMENT_UNVERIFIED
```

applies.

Do not guess toward a safer label.

---

# 33. Runtime-Specific Generated Artifacts

Provider UI may generate proprietary artifacts.

Those MAY be useful.

For canonical handoff, material facts SHOULD still be representable in BisnisHub canonical contracts.

Provider artifact:

```text
may supplement
```

but MUST NOT silently replace:

```text
Implementation Contract

Engineering Report

Assurance Report

Verification Matrix
```

where those are required.

---

# 34. Runtime Drift

Adapter behavior may become stale when provider behavior changes.

Triggers include:

```text
provider update

instruction-loading change

Skill-discovery change

Skill-format change

permission model change

model upgrade
```

Such change SHOULD trigger:

```text
adapter review

affected behavioral eval rerun
```

---

# 35. Provider Documentation Verification

Before adding provider-specific runtime configuration:

```text
verify current official provider documentation
```

Do not infer unsupported config file names or schema fields from memory.

---

# 36. Runtime Behavioral Evaluation

Structural validation proves only:

```text
files and references are coherent
```

Runtime evaluation must verify behavior such as:

```text
correct role chosen

correct expertise selected

risk not downgraded

forbidden action avoided

scope respected

artifact produced correctly

blocked state reported honestly
```

---

# 37. Initial Adapter State

Initial state:

```text
Codex
→ existing AGENTS.md hierarchy
→ existing .agents/skills/
→ canonical contracts

Antigravity
→ .agents/rules/engineering-control-plane.md
→ .agents/skills/mgbos-change/SKILL.md
→ existing shared .agents/skills/
```

---

# 38. Non-Goals

CP-003 does NOT:

```text
create autonomous business agents

create JARVIS runtime

create Hermes supervisor

install Claude Code adapter

grant production access

enable deployment

create cross-provider RPC

create 21 permanent expert agents
```

---

# 39. Acceptance Criteria

CP-003 is correctly implemented when:

```text
Codex consumes repository governance without policy duplication

Antigravity has thin always-on routing context

Antigravity has a reusable MGBOS change Skill with the /mgbos-change command

shared Skills remain single-source

provider adapters cannot lower risk or authority controls

one active role is explicit

one-writer discipline survives runtime orchestration

cross-runtime handoff is artifact-based

self-review cannot become independent review

provider-specific configuration remains subordinate to canonical control plane
```

---

# 40. Final Principle

> **Providers execute.  
> BisnisHub governs.**

The runtime can change.

The engineering contract should not.