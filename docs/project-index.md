---
canonical_id: docs.project-index
status: ACTIVE
version: 1.1
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository
document_class: registry
effective_from: 2026-10-03

authoritative_for:
  - active repository project locations
  - top-level repository navigation
  - repository system locator
  - top-level authority entrypoints
  - top-level engineering navigation

last_reviewed: 2026-10-03
review_cadence: monthly

depends_on:
  - governance/documentation-constitution.md
  - governance/canonical-source-map.md
  - engineering/repository-layout.md
  - decisions/001-repository-organization.md

supersedes: null

repository_snapshot: 26871da802706fba5bc033576fbb0a487f6c9255
---

# BisnisHub Project Index

## 1. Purpose

Dokumen ini adalah **top-level repository locator** untuk BisnisHub.

Ia menjawab:

> **Sistem, business knowledge, engineering governance, operating model, roadmap, dan historical material berada di mana?**

Dokumen ini adalah:

```text
OPERATIONAL REGISTRY
+
NAVIGATION ENTRYPOINT
```

bukan:

```text
business specification
system architecture
runtime evidence
permission grant
deployment authority
```

---

# 2. Authority Boundary

Project Index menentukan:

```text
WHERE TO START
```

Ia tidak menentukan:

```text
WHAT A DOMAIN MEANS
```

Semantic authority tetap mengikuti:

```text
docs/governance/documentation-constitution.md
docs/governance/canonical-source-map.md
```

dan canonical source milik domain terkait.

---

# 3. Current Repository Snapshot

Current repository state reviewed for this index:

```text
REPOSITORY
Rizkybuilds/bisnishub

SNAPSHOT
26871da802706fba5bc033576fbb0a487f6c9255

REVIEW DATE
2026-10-03
```

Snapshot adalah konteks current-state.

Ia bukan jaminan bahwa repository tidak berubah setelah tanggal tersebut.

---

# 4. Active Systems & Runtime Areas

| Sistem / area | Lokasi | Current boundary |
|---|---|---|
| MGBOS | [`systems/mgbos/`](../systems/mgbos/README.md) | Active Next.js + pnpm + Supabase workspace. Governed transactional business system. |
| JARVIS | [`systems/jarvis/docs/`](../systems/jarvis/docs/charter.md) | Canonical architecture/specification exists. Documentation status does not by itself prove runtime implementation. |
| KasKita | `systems/kaskita/` | Independent system workspace with its own application/database boundaries. |
| Engineering Assistant | [`tools/assistant/`](../tools/assistant/README.md) | Existing engineering/assistant tooling. It is not the JARVIS runtime. |
| TeeStock V1 | [`archive/teestock-v1/`](../archive/teestock-v1/README.md) | Retired legacy application/reference. Not an active runtime source. |
| MGBOS Vite Prototype | `archive/mgbos-vite-prototype/` | Retired prototype. Reference only. |

---

# 5. Business Knowledge

Business knowledge lives under:

```text
bisnis/
```

Current top-level business areas include:

```text
bisnis/multigraph/
bisnis/teestock/
bisnis/rizkybuild/
```

These sources own business knowledge within their declared scopes.

They do not automatically define MGBOS implementation semantics.

---

# 6. Repository Governance

Start here for repository-wide documentation authority:

```text
docs/governance/documentation-constitution.md
```

Then:

```text
docs/governance/canonical-source-map.md
```

Responsibilities:

```text
Documentation Constitution
→ how documentation authority works

Canonical Source Map
→ where semantic authority lives
```

---

# 7. Repository Structure

Canonical directory ownership:

```text
docs/engineering/repository-layout.md
```

Canonical repository-organization decision:

```text
docs/decisions/001-repository-organization.md
```

These sources govern physical placement and repository organization.

---

# 8. Cross-System Architecture

Primary architecture entrypoints:

```text
docs/architecture/master-system-blueprint.md
docs/architecture/system-boundaries.md
docs/architecture/architectural-laws.md
```

These own cross-system architecture.

They do not replace system-specific canonical specifications.

---

# 9. Cross-System Governance

Primary repository-wide governance includes:

```text
docs/governance/cross-system-risk-classification.md

docs/governance/autonomy-levels.md

docs/governance/approval-policy.md

docs/governance/evidence-provenance-model.md
```

Use them for:

```text
risk
autonomy
approval
evidence/provenance
```

rather than redefining those concepts inside subsystem or provider instructions.

---

# 10. Engineering AI Control Plane

Canonical repository-wide engineering governance:

```text
docs/engineering/engineering-ai-control-plane.md
```

It owns engineering semantics including:

```text
canonical engineering roles
expertise model
routing principles
bounded execution
assurance
runtime-adapter principles
engineering autonomy boundaries
```

For material AI-assisted engineering:

```text
READ THIS
```

before relying on provider-specific instructions.

---

# 11. Runtime Adapter Architecture

Canonical source:

```text
docs/engineering/runtime-adapter-architecture.md
```

Use it for:

```text
provider/runtime adaptation
provider-neutral runtime boundaries
adapter responsibilities
```

Provider-specific tools MUST NOT redefine repository engineering governance.

---

# 12. Vibe Engineering

Canonical operating-method entrypoint:

```text
docs/engineering/vibe-engineering/README.md
```

Vibe Engineering defines:

> **How the Owner, Head function, Builder, canonical engineering roles, contracts, evidence, assurance, PR review, remediation, and post-merge reflection are orchestrated into one governed AI-assisted engineering workflow.**

Vibe Engineering is:

```text
ENGINEERING OPERATING METHOD
```

not:

```text
a replacement Control Plane
a new risk taxonomy
a new permission model
a new contract schema
a provider-specific policy
```

---

# 13. Vibe Engineering Document Set

Canonical Vibe family:

```text
docs/engineering/vibe-engineering/
├── README.md
├── state-and-vocabulary.md
├── operating-model.md
├── session-protocol.md
├── change-package-template.md
├── implementation-contract-template.md
├── pr-audit-protocol.md
├── remediation-protocol.md
└── post-merge-reflection.md
```

All nine files are required for the complete operating-method documentation set.

---

# 14. Vibe Reading Order

For general orientation:

```text
README.md
        ↓
operating-model.md
        ↓
state-and-vocabulary.md
```

For starting or continuing work:

```text
session-protocol.md
```

For planning:

```text
change-package-template.md
        ↓
implementation-contract-template.md
```

For PR review:

```text
pr-audit-protocol.md
```

For corrective work:

```text
remediation-protocol.md
```

After merge:

```text
post-merge-reflection.md
```

---

# 15. Vibe vs Control Plane

Canonical relationship:

```text
ENGINEERING AI CONTROL PLANE
defines engineering governance

        ↓

.agents/routing
.agents/contracts
.agents/capabilities
define operational controls

        ↓

VIBE ENGINEERING
defines operating procedure

        ↓

RUNTIME / PROVIDER
executes bounded work
```

Do not invert this hierarchy.

---

# 16. Engineering Operational Registries

Current engineering operational data lives primarily under:

```text
.agents/
```

Important areas include:

```text
.agents/roles/
.agents/expertise/
.agents/routing/
.agents/contracts/
.agents/capabilities/
.agents/skills/
.agents/evals/
```

Read each registry according to its own scope.

---

# 17. Engineering Contracts

Canonical contract navigation:

```text
.agents/contracts/README.md
```

Machine schemas include:

```text
implementation-contract.schema.json
work-package.schema.json
engineering-report.schema.json
assurance-report.schema.json
verification-matrix.schema.json
release-packet.schema.json
```

Vibe Engineering uses these contracts.

It does not replace their schema semantics.

---

# 18. Engineering Routing

Canonical routing entrypoint:

```text
.agents/routing/README.md
```

Current route definitions:

```text
.agents/routing/
```

Routing controls such concepts as:

```text
profile
task type
concern
risk composition
required role
required expertise
assurance requirement
stop condition
```

---

# 19. Current Routing Limitation

At the repository snapshot recorded above, the active routing registry is currently centered on:

```text
mgbos
→ systems/mgbos/
```

Do not assume unrelated targets may borrow this profile.

Targets such as:

```text
repository-engineering
JARVIS engineering
KasKita engineering
```

require matching registered routing when governed implementation depends on routing.

---

# 20. MGBOS Entry Point

System root:

```text
systems/mgbos/
```

Start with:

```text
systems/mgbos/AGENTS.md
systems/mgbos/README.md
```

Then:

```text
systems/mgbos/docs/README.md
```

for documentation routing.

---

# 21. MGBOS Documentation Navigation

Canonical MGBOS Master Index:

```text
systems/mgbos/docs/README.md
```

Architecture index:

```text
systems/mgbos/docs/architecture/README.md
```

Implementation index:

```text
systems/mgbos/docs/implementation/README.md
```

---

# 22. MGBOS Canonical Architecture

Core canonical architecture includes:

```text
systems/mgbos/docs/architecture/canonical-data-model.md

systems/mgbos/docs/architecture/business-state-machines.md

systems/mgbos/docs/architecture/business-invariants.md

systems/mgbos/docs/architecture/command-event-model.md

systems/mgbos/docs/architecture/permission-authorization-model.md

systems/mgbos/docs/architecture/domain-map-capability-ownership.md
```

Dedicated specifications own their respective semantics.

---

# 23. MGBOS Current Implementation Focus

Current implementation planning entrypoint:

```text
systems/mgbos/docs/implementation/phase-1-operating-spine/README.md
```

Current operating-spine audit:

```text
systems/mgbos/docs/implementation/phase-1-operating-spine/current-operating-spine-audit.md
```

These sources do not replace MGBOS architecture.

---

# 24. MGBOS Engineering Control

MGBOS-specific engineering documentation lives under:

```text
systems/mgbos/docs/engineering/
```

and system-specific agent guidance under:

```text
systems/mgbos/AGENTS.md
```

For MGBOS engineering, apply:

```text
repository-wide engineering governance
+
Vibe Engineering
+
MGBOS-specific engineering requirements
```

where applicable.

System-specific rules may be stricter.

They may not weaken repository governance.

---

# 25. JARVIS Entry Point

Start with:

```text
systems/jarvis/docs/charter.md
systems/jarvis/docs/architecture.md
systems/jarvis/docs/core-runtime.md
```

Then read only relevant architecture contracts.

---

# 26. JARVIS Architecture Directory

Canonical architecture lives under:

```text
systems/jarvis/docs/architecture/
```

Important examples include:

```text
agent-registry.md
skill-registry.md
tool-capability.md
memory.md
model-gateway-routing.md
entity-identity-resolution.md
event-proactive-intelligence.md
execution-verification-recovery.md
observability-audit-incident.md
security-secrets-environment.md
data-privacy-retention.md
ai-evaluation-regression-autonomy-promotion.md
human-accountability-ownership-operating-model.md
command-center-decision-experience.md
integration-api-interoperability.md
```

Use current repository contents rather than assuming this list is permanently exhaustive.

---

# 27. JARVIS Specification vs Runtime

Canonical JARVIS documentation may be:

```text
ACTIVE
```

without proving equivalent runtime implementation exists.

Always distinguish:

```text
SPECIFICATION
```

from:

```text
IMPLEMENTATION
```

and:

```text
RUNTIME EVIDENCE
```

---

# 28. KasKita

Current active workspace:

```text
systems/kaskita/
```

KasKita remains operationally independent from MGBOS unless an explicit cross-system contract establishes integration.

Do not reuse MGBOS database/runtime assumptions automatically.

---

# 29. Engineering Assistant

Existing assistant tooling:

```text
tools/assistant/
```

This is not JARVIS merely because both involve AI/assistant behavior.

Respect their separate boundaries.

---

# 30. Solo-Founder Operating Model

Canonical operating-model source:

```text
docs/operating-model/solo-founder-operating-system.md
```

This governs founder operating principles such as:

```text
founder-by-exception
delegation boundaries
human accountability
workload allocation
```

It is not an engineering contract.

---

# 31. Solo-Founder Launch Roadmap

Canonical cross-system launch roadmap:

```text
docs/roadmaps/solo-founder-launch-roadmap.md
```

Correct directory:

```text
docs/roadmaps/
```

not:

```text
docs/roadmap/
```

Roadmap defines planned direction.

It does not certify implementation.

---

# 32. Business Knowledge Navigation

Primary business locations:

```text
bisnis/multigraph/
bisnis/teestock/
bisnis/rizkybuild/
```

Business documentation answers:

```text
what business should exist?
how should it operate commercially?
what outcomes matter?
```

MGBOS answers how governed operational truth is represented.

---

# 33. TeeStock ↔ MGBOS Boundary

TeeStock business docs may define:

```text
business requirements
commercial concepts
journey stages
service rules
```

MGBOS canonical sources define:

```text
transactional entities
state machines
invariants
authorization
commands/events
financial integrity
```

For MGBOS-owned transactional semantics:

```text
MGBOS CANONICAL SOURCES
WIN
```

---

# 34. Historical Notes

Historical/session material lives primarily under:

```text
catatan/
catatan/sesi/
```

Default interpretation:

```text
HISTORICAL
DESIGN_INPUT
RESEARCH
SESSION_MEMORY
```

unless explicitly promoted through governance.

---

# 35. Archive

Retired material lives under:

```text
archive/
```

Archive is reference-only unless an explicit migration/recovery task says otherwise.

Do not restore archived runtime code merely because it still exists.

---

# 36. Repository Reading Order — New Engineering Work

For material AI-assisted engineering:

```text
1. AGENTS.md

2. this Project Index

3. Documentation Constitution

4. Canonical Source Map

5. Engineering AI Control Plane

6. Vibe Engineering

7. current routing / contracts / capabilities

8. target-system AGENTS / README / canonical specs

9. actual implementation / tests / evidence
```

Use minimum sufficient context.

Do not load the entire repository by default.

---

# 37. Repository Reading Order — Continue Existing Work

When continuing existing engineering:

```text
1. Vibe Session Protocol

2. current repository state

3. current VECP / Implementation Contract / Work Package

4. active PR if any

5. current routing

6. current evidence

7. affected canonical sources
```

Repository reality outranks conversation memory.

---

# 38. Repository Reading Order — PR Audit

For PR audit:

```text
1. Vibe PR Audit Protocol

2. actual PR

3. exact PR base/head

4. parent Implementation Contract

5. Work Package

6. Engineering Report

7. relevant canonical sources

8. current CI

9. Assurance / Verification artifacts
```

Do not audit from Builder summary alone.

---

# 39. Repository Reading Order — Remediation

For remediation:

```text
1. Vibe Remediation Protocol

2. finding / failure evidence

3. current candidate

4. parent Implementation Contract

5. current remediation Work Package

6. affected canonical sources

7. current evidence
```

---

# 40. Repository Reading Order — After Merge

When Owner says:

```text
merged
```

use:

```text
1. Vibe Post-Merge Verification & Reflection

2. actual PR merge state

3. integration revision

4. current main

5. relevant CI/evidence

6. target-system release/recovery runbook if applicable
```

Do not assume merge from conversation alone.

---

# 41. Current vs Target

Repository documentation MUST distinguish:

```text
CURRENT
TARGET
PROPOSED
EXPERIMENTAL
NOT VERIFIED
```

according to Documentation Constitution.

Do not infer that a detailed design is implemented.

---

# 42. Navigation Does Not Grant Permission

A link in this Project Index does not authorize:

```text
deployment
push
merge
database mutation
production mutation
customer communication
business transaction
```

Permission and approval are separate.

---

# 43. Tool Availability Does Not Grant Permission

Likewise:

```text
tool available
≠
action permitted
```

Consult current capability/permission governance.

---

# 44. Vibe Activation State

When all nine Vibe files, Canonical Source Map v1.2, this Project Index, and root `AGENTS.md` activation routing are persisted together and repository validation remains healthy:

```text
VIBE ENGINEERING
=
ACTIVE REPOSITORY OPERATING METHOD
```

within its declared scope.

---

# 45. Partial Activation

If this Project Index links to Vibe files that are not actually present:

```text
DOCUMENTATION_DRIFT
```

exists.

Do not infer missing methodology from memory.

Until activation is complete, fall back to:

```text
Engineering AI Control Plane
routing registry
contract schemas
capability governance
target-system engineering rules
```

---

# 46. Navigation Health

This index is healthy when a competent human or AI can determine:

```text
Where is the target system?

Where is its documentation entrypoint?

Where is repository governance?

Where is engineering governance?

Where is Vibe Engineering?

Where are operational engineering registries?

Where is business knowledge?

Where is historical material?
```

without guessing.

---

# 47. Maintenance

Update this index when:

```text
active system moves
canonical navigation entrypoint changes
new top-level authority domain is introduced
engineering entrypoint changes
a listed location is retired
```

Do not update it for every implementation detail.

---

# 48. Final Principle

> **Project Index tells you where to go. Canonical Source Map tells you whom to trust. Canonical specifications tell you what should be true. Repository/runtime evidence tells you what is actually true.**

For engineering:

> **Engineering AI Control Plane defines the governance. Vibe Engineering defines the operating procedure. Target-system documentation defines system semantics. Evidence determines what actually happened.**