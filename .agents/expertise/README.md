---
canonical_id: agents.engineering.expertise-registry
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: repository-engineering
document_class: registry-guide
effective_from: 2026-10-01

authoritative_for:
  - engineering expertise registry interpretation
  - engineering expertise identity rules
  - engineering expertise maturity semantics
  - engineering expertise loading rules
  - engineering expertise relationship to roles and skills

last_reviewed: 2026-10-01
review_cadence: quarterly

depends_on:
  - ../../docs/engineering/engineering-ai-control-plane.md
  - ../../docs/governance/documentation-constitution.md
  - ../../docs/governance/canonical-source-map.md
  - ../../docs/governance/cross-system-risk-classification.md
  - ../roles/contracts.json

machine_registry:
  - registry.yaml

supersedes: null
---

# BisnisHub Engineering Expertise Registry v1

## 1. Purpose

Directory ini mendefinisikan specialist engineering knowledge yang dapat dimuat oleh Codex, Antigravity, Claude Code, future engineering runtimes, atau human engineers ketika mengembangkan repository BisnisHub.

Canonical machine-readable registry:

```text
.agents/expertise/registry.yaml
```

Expertise Registry menjawab:

> **Pengetahuan spesialis apa yang harus diterapkan untuk mengerjakan atau menilai suatu engineering problem dengan benar?**

Expertise Registry bukan:

```text
agent registry
role registry
permission registry
tool registry
workflow registry
business authority registry
```

---

# 2. Core Definition

Canonical definition:

> **Expertise adalah bounded specialist knowledge contract yang menentukan perspektif, concepts, failure modes, canonical sources, dan reasoning concerns yang harus dipahami ketika expertise tersebut diaktifkan.**

Expertise membantu runtime memahami masalah.

Expertise tidak memberi runtime authority.

---

# 3. Primitive Separation

BisnisHub Engineering Control Plane membedakan:

```text
ROLE
=
WHO / RESPONSIBILITY MODE

EXPERTISE
=
WHAT MUST BE UNDERSTOOD

SKILL
=
HOW REPEATABLE WORK IS PERFORMED

TOOL
=
WHAT TECHNICAL ACTION CAN BE ATTEMPTED

RUNTIME
=
WHAT EXECUTES THE REASONING
```

Example:

```text
Runtime
Codex

Role
Engineer

Expertise
PostgreSQL / Supabase Transaction

Skill
create-forward-migration

Tool
shell + database CLI
```

Masing-masing concept MUST remain distinct.

---

# 4. Expertise Is Not an Agent

Forbidden architecture:

```text
Backend Agent
Database Agent
Finance Agent
Security Agent
Frontend Agent
QA Agent
```

created solely because corresponding expertise exists.

Correct model:

```text
Engineer
    │
    ├── Backend Expertise
    ├── Database Expertise
    └── Financial Integrity Expertise
```

or:

```text
Auditor
    │
    ├── Authorization Expertise
    ├── Security Expertise
    └── Financial Integrity Expertise
```

Expertise can be reused across roles.

---

# 5. Expertise Is Not a Persona

Expertise MUST NOT be implemented as marketing-style prompting such as:

```text
"You are the world's best database expert."
```

Expertise should instead provide:

```text
canonical sources
domain boundaries
important concepts
known failure modes
reasoning constraints
review concerns
```

The objective is predictable engineering behavior, not role-play.

---

# 6. Expertise Does Not Grant Authority

Loading expertise MUST NOT grant:

```text
repository write access

production access

database mutation authority

merge authority

deployment authority

business permission

business approval

tool access

higher autonomy
```

Canonical:

```text
EXPERTISE
≠
PERMISSION
```

---

# 7. Expertise Does Not Change Role

Example:

```text
active_role: auditor
loaded_expertise:
  - Backend & Command Engineering
  - Financial Integrity
```

The runtime remains:

```text
Auditor
```

It does not become Engineer merely because implementation expertise is loaded.

Auditor's role permissions and responsibilities remain unchanged.

---

# 8. Expertise Does Not Automatically Load Skills

Expertise and Skill selection are independent.

Example:

```text
Financial Integrity Expertise
```

does not automatically load:

```text
every finance-related Skill
```

Future Task Routing decides which Skills are actually required.

This prevents:

```text
context overload
skill conflicts
unnecessary instructions
ambiguous workflow selection
```

---

# 9. Minimum Sufficient Expertise

Canonical loading principle:

> **Load the minimum sufficient expertise set required by the actual engineering consequence.**

Bad:

```text
load all 21 expertises
for every task
```

Correct:

```text
Task:
payment command change

Load:
MGBOS Domain
Backend Command
PostgreSQL Transaction
Authorization
Financial Integrity
```

Another task:

```text
Task:
button spacing fix

Load:
Frontend Product Engineering
Product UX
```

---

# 10. Expertise Selection Inputs

Future routing MAY select expertise based on:

```text
task type

affected system

affected domain

affected capability

risk

changed paths

business invariants

security boundary

external integration

release consequence
```

Expertise selection MUST NOT rely solely on filename keywords.

---

# 11. Explicit vs Automatic Selection

Expertise may be loaded through:

```text
explicit Planner selection

machine routing

review escalation

runtime-discovered consequence
```

If implementation reveals a new material domain:

```text
Engineer MUST escalate or update the Work Contract
```

rather than silently ignoring required expertise.

---

# 12. Registry Authority

Machine-readable registry:

```text
.agents/expertise/registry.yaml
```

is the operational authority for:

```text
registered expertise IDs

expertise names

maturity

grouping

primary/secondary role affinity

knowledge mission

activation signals

canonical source references

non-responsibilities
```

Narrative prose elsewhere MUST NOT create a second competing Expertise Registry.

---

# 13. Stable Expertise IDs

Expertise uses stable IDs:

```text
EXP-001
EXP-002
...
EXP-021
```

IDs SHOULD remain stable when:

```text
display name changes

description improves

canonical sources move
```

If semantic meaning materially changes, perform an explicit registry revision.

Do not recycle retired expertise IDs for unrelated expertise.

---

# 14. Slug

Each expertise has a machine-friendly stable slug.

Example:

```text
EXP-006

slug:
financial-integrity
```

Slug SHOULD:

```text
use lowercase

use hyphens

remain semantic

avoid provider names
```

---

# 15. Provider Independence

Forbidden IDs/names:

```text
gpt-backend-expert

claude-database-expert

antigravity-security-expert
```

Correct:

```text
backend-command-engineering

postgresql-supabase-transaction

security-trust-boundary
```

Provider is runtime implementation.

Expertise belongs to BisnisHub.

---

# 16. Expertise Maturity

Registry uses:

```text
ACTIVE

PROVISIONAL

DEFERRED
```

These describe maturity of the Expertise definition.

They do NOT describe runtime implementation status of the system being discussed.

---

# 17. ACTIVE

`ACTIVE` means:

```text
expertise definition is sufficiently grounded
for normal engineering selection
```

It may be selected explicitly or by future routing.

ACTIVE does NOT mean:

```text
an agent is running

a Skill exists

a runtime is registered

implementation exists
```

---

# 18. PROVISIONAL

`PROVISIONAL` means:

```text
the expertise domain is legitimate
but canonical engineering semantics remain incomplete
or current implementation need is not yet mature
```

PROVISIONAL expertise:

```text
MAY be loaded explicitly

MUST NOT become automatic mandatory routing
without Planner justification

MUST expose missing or incomplete canonical authority
```

It must not invent missing system semantics.

---

# 19. DEFERRED

`DEFERRED` means:

```text
the expertise is intentionally preserved
but not currently expected to participate
in normal engineering routing
```

It MAY later become ACTIVE through an explicit registry change.

---

# 20. Maturity Does Not Grant Authority

An ACTIVE expertise has no more permission than a PROVISIONAL expertise.

Maturity controls:

```text
routing eligibility
```

not:

```text
execution authority
```

---

# 21. Expertise Groups

Registry groups expertise for navigation only.

Current groups:

```text
core

founder-control

automation

ai

platform
```

Group does not affect permission or risk.

---

# 22. Core Expertise

Core expertise covers engineering concerns broadly needed by MGBOS development:

```text
System & Business Architecture

MGBOS Domain / ERP

Backend & Command Engineering

PostgreSQL / Supabase Transaction

Authorization / IAM / Capability

Financial Integrity

Security & Trust Boundary

Frontend Product Engineering

Product UX / Operator Workflow

QA & Reliability

Independent Business Integrity Assurance
```

---

# 23. Founder-Control Expertise

Founder-control expertise supports the current roadmap direction:

```text
Operational Exception

Founder Decision Intelligence

Vendor Capability & SLA

Customer Case & Service Recovery
```

Not all founder-control domains are equally mature.

Registry maturity MUST remain explicit.

---

# 24. Automation Expertise

Automation expertise includes:

```text
Integration Reliability & Eventing

Workflow Automation / n8n
```

Automation expertise MUST preserve:

```text
MGBOS authority

business commands

idempotency

failure visibility

verification

recovery
```

Automation does not become business truth.

---

# 25. AI Expertise

AI engineering expertise includes:

```text
AI Systems / AI Builder

JARVIS Runtime Architecture

Agent Evaluation & AI Governance
```

AI expertise MUST preserve:

```text
provider independence

bounded authority

evidence

prompt-injection resistance

structured interfaces

deterministic business boundaries
```

---

# 26. Platform Expertise

Platform / SRE / Recovery covers:

```text
environments

releases

observability

backup

restore

incident response

recovery

operational readiness
```

It does not automatically grant production access.

---

# 27. Primary Roles

Registry field:

```text
primary_roles
```

means:

> Roles most likely to need this expertise as a first-class reasoning perspective.

It does NOT mean:

```text
only these roles may load it
```

---

# 28. Secondary Roles

Registry field:

```text
secondary_roles
```

means:

> Other roles that frequently benefit from the expertise.

Role routing remains governed separately.

---

# 29. Role IDs

Role references MUST resolve to:

```text
.agents/roles/contracts.json
```

Current valid IDs:

```text
planner

engineer

auditor

qa

release-operator
```

Unknown role IDs MUST fail validation once Expertise validation is implemented.

---

# 30. Mission

Registry field:

```text
mission
```

states why the expertise exists.

Mission SHOULD describe:

```text
knowledge responsibility
```

not:

```text
implementation authority
```

Bad:

```text
"Own and change the database."
```

Good:

```text
"Preserve transactional correctness, migrations,
constraints, RLS, locking, and database recovery semantics."
```

---

# 31. Activation Signals

Registry field:

```text
activation_signals
```

contains human-readable indicators that this expertise may matter.

Signals are NOT a machine routing policy.

Example:

```text
payment allocation

financial reconciliation

integer money

refund
```

Future routing registry will define deterministic expertise requirements.

---

# 32. Canonical Sources

Each expertise SHOULD reference the minimum set of canonical or accepted authoritative sources needed to understand its current domain.

Canonical source references MUST:

```text
remain repository-local

resolve to real files

respect semantic ownership

not promote historical notes into authority
```

Historical/session documents SHOULD NOT be listed as canonical sources.

---

# 33. Business Knowledge Sources

An expertise MAY reference:

```text
bisnis/<business>/
```

when understanding business requirements requires it.

Business knowledge remains authoritative only for its declared business scope.

It MUST NOT override MGBOS transactional semantics.

---

# 34. System Documentation Sources

For MGBOS-owned concepts:

```text
systems/mgbos/docs/
```

wins over equivalent historical business/system sketches.

For JARVIS-owned concepts:

```text
systems/jarvis/docs/
```

wins for JARVIS architecture.

---

# 35. Non-Responsibilities

Every expertise defines:

```text
non_responsibilities
```

to prevent specialist knowledge from expanding into authority.

Examples:

```text
Financial Integrity
does not approve payments

Platform / SRE
does not automatically deploy

Security
does not automatically grant privileged access
```

---

# 36. Expertise Composition

Multiple expertise may be composed when a task crosses domains.

Example:

```text
AI extracts payment receipt
and proposes payment recording
```

may require:

```text
AI Systems

Financial Integrity

Backend Command Engineering

Authorization

PostgreSQL Transaction
```

Final effective risk follows canonical risk policy.

---

# 37. Cross-Domain Work

A task crossing several domains SHOULD NOT automatically create a new "combined expert".

Compose existing expertise first.

Create new expertise only when there is a stable knowledge domain not represented elsewhere.

---

# 38. Expertise Conflict

If two expertise perspectives reveal contradictory canonical requirements:

```text
CANONICAL_CONFLICT
```

must be raised.

Runtime MUST NOT resolve the conflict by selecting whichever specialist recommendation appears easier.

Resolve semantic ownership first.

---

# 39. Expertise and Risk

Expertise does not assign canonical risk.

Future routing MAY use risk to require expertise.

Examples:

```text
financial R5
→ Financial Integrity likely mandatory

authorization R4/R5
→ Authorization + Security likely mandatory
```

Risk meaning remains owned by:

```text
docs/governance/cross-system-risk-classification.md
```

---

# 40. Expertise and Assurance

Expertise may be applied during:

```text
planning

implementation

audit

QA

release preparation
```

Different roles use the same knowledge differently.

Example:

```text
Engineer + Financial Integrity
→ implement correctly

Auditor + Financial Integrity
→ inspect independently
```

Same expertise.

Different responsibility.

---

# 41. Independent Assurance Expertise

`EXP-011` represents specialist knowledge for:

```text
independent business-integrity assurance
```

It does NOT itself create independence.

Independence depends on execution facts.

Canonical:

```text
same runtime implementing and auditing
=
SELF_REVIEW
```

even when EXP-011 is loaded.

---

# 42. Expertise and Skills

Skills remain under:

```text
.agents/skills/
```

Registry MUST NOT treat similarly named Skills as the expertise definition.

Example:

```text
api-backend-engineer
```

is an engineering Skill.

```text
EXP-003 Backend & Command Engineering
```

is expertise.

They may be related without being equivalent.

---

# 43. Expertise Materialization

V1 does NOT require:

```text
one markdown file per expertise
```

The registry contains enough identity and scope to support initial routing.

Create:

```text
.agents/expertise/<slug>.md
```

only when the domain requires substantial reusable reasoning material not already available from canonical sources.

Avoid creating empty expertise documents.

---

# 44. Expertise File Rule

If a dedicated expertise file is later created, it MUST:

```text
reference its EXP ID

reference canonical sources

avoid redefining role permissions

avoid duplicating canonical architecture

contain specialist interpretation/guidance only
```

Registry remains the inventory authority.

---

# 45. Registry Change

Changing any of these is material:

```text
expertise mission

maturity

canonical sources

primary role affinity

non-responsibilities

semantic identity
```

Changes SHOULD pass:

```text
governance validation

routing impact review

relevant behavioral eval review
```

once tooling exists.

---

# 46. Adding Expertise

Before adding new expertise, answer:

```text
What distinct knowledge domain is missing?

Why can existing expertise not cover it?

Which current engineering tasks require it?

Which canonical sources support it?

Which roles will consume it?

How will routing know when it matters?
```

If there is no current consumer:

```text
DEFER
```

---

# 47. Removing Expertise

Expertise SHOULD NOT simply disappear if referenced by:

```text
routing

work contracts

evaluation evidence

historical engineering reports
```

Preferred lifecycle:

```text
ACTIVE
→ DEFERRED
→ remove only after references are reconciled
```

Stable IDs should remain traceable in history.

---

# 48. No Automatic Specialist Swarm

Registry size MUST NOT determine runtime topology.

Twenty-one registered expertise entries do NOT imply:

```text
21 agents

21 contexts

21 simultaneous model calls

21 separate memories
```

Runtime should activate only what the task requires.

---

# 49. Context Economy

Expertise is designed to reduce context, not enlarge it.

Target:

```text
TASK
  ↓
small expertise set
  ↓
small skill set
  ↓
bounded implementation context
```

Not:

```text
TASK
  ↓
entire repository knowledge
```

---

# 50. Validation Target

Governance validator SHOULD eventually enforce:

```text
schema_version supported

registry ID valid

unique EXP IDs

unique slugs

known maturity

known groups

known role IDs

canonical source paths exist

no repository path escape

nonempty mission

nonempty non-responsibilities

no duplicate YAML keys
```

Validation proves structural consistency.

It does NOT prove expert reasoning quality.

---

# 51. Behavioral Evaluation

Runtime behavior involving expertise SHOULD eventually evaluate:

```text
was correct expertise selected?

was unnecessary expertise avoided?

were canonical sources used?

did expertise alter authority incorrectly?

were missing semantics escalated?

were relevant failure modes considered?
```

Presence of registry entry is not behavioral evidence.

---

# 52. Future Routing

Future:

```text
.agents/routing/task-types.yaml
```

will map:

```text
task type
+
risk
+
domain

→ role flow
→ required expertise IDs
→ required skills
→ assurance
```

Expertise Registry MUST remain independent of provider-specific runtime routing.

---

# 53. Current Registry

V1 registers:

```text
EXP-001 through EXP-021
```

This preserves the complete expert architecture while allowing maturity to remain explicit.

The registry does not create permanent agents.

---

# 54. Final Principle

> **Role determines responsibility.  
> Expertise determines what must be understood.  
> Skill determines how repeatable work is performed.  
> Tools provide actions.  
> Permission determines what may actually happen.**

The purpose of Expertise Registry is not to create more AI identities.

Its purpose is to make the right specialist knowledge available at the right engineering moment.
