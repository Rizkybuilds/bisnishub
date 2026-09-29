---
canonical_id: docs.architecture.master-system-blueprint
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: ecosystem
document_class: canonical-specification
effective_from: 2026-09-29
authoritative_for:
  - ecosystem-level system topology
  - top-level system responsibilities
  - human-ai authority hierarchy
  - MGBOS-JARVIS relationship
  - runtime agent positioning
  - engineering-agent separation
  - top-level information and action flows
  - business continuity boundaries
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - ../governance/documentation-constitution.md
  - ../governance/canonical-source-map.md
  - ../../systems/mgbos/docs/architecture/README.md
  - ../../systems/mgbos/docs/adr/002-postgresql-system-of-record.md
  - ../../systems/mgbos/docs/adr/004-n8n-orchestrator.md
  - ../../systems/mgbos/docs/adr/005-transactional-outbox.md
  - ../../systems/mgbos/docs/adr/006-ai-gateway.md
supersedes: null
---

# DOC-003 — BisnisHub Master System Blueprint

## 1. Purpose

Dokumen ini mendefinisikan arsitektur tingkat tertinggi ekosistem BisnisHub.

Ia menjawab:

> **Bagaimana manusia, JARVIS, agents, skills, tools, MGBOS, automation, external systems, dan real-world operations berhubungan satu sama lain?**

Dokumen ini tidak mendefinisikan implementation detail setiap subsystem.

Detail tersebut dimiliki oleh canonical specification masing-masing.

Master Blueprint menentukan:

- posisi setiap sistem;
- responsibility setiap layer;
- authority hierarchy;
- arah data dan tindakan;
- system boundaries tingkat tinggi;
- hubungan intelligence dengan authoritative business systems;
- hubungan software automation dengan real-world operations;
- dan prinsip continuity ketika salah satu subsystem gagal.

---

# 2. North Star

Target ekosistem BisnisHub adalah:

> **Sistem yang mengubah kompleksitas operasional menjadi sejumlah kecil keputusan berkualitas tinggi untuk founder, sambil menjaga fakta bisnis, authority, execution, verification, dan evidence tetap terpisah dengan jelas.**

Tujuan akhirnya bukan membuat AI mengambil seluruh keputusan.

Tujuannya adalah:

```text id="6h5dbu"
SYSTEM
handles repetition
detects exceptions
collects evidence
analyzes situations
prepares actions
executes permitted work
verifies outcomes

        ↓

FOUNDER
focuses on
judgment
strategy
capital allocation
exceptions
high-impact decisions
```

---

# 3. Primary Architectural Principle

Prinsip utama seluruh blueprint adalah:

> **AI reasons; authoritative systems own facts; humans retain ultimate authority over high-impact decisions.**

Dari prinsip tersebut turun tiga aturan:

```text id="z006zc"
Reasoning
≠ Truth

Capability
≠ Authority

Execution attempt
≠ Verified success
```

Setiap layer harus mengetahui perbedaannya.

---

# 4. Top-Level Architecture

Target architecture:

```text id="h7jqee"
                         RIZKY
               Founder / Ultimate Authority
                           │
                           │
             Decisions / Policies / Goals
                           │
                           ▼
                ┌──────────────────────┐
                │       JARVIS         │
                │ Intelligence &       │
                │ Management Layer     │
                └──────────┬───────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      RUNTIME          MEMORY &         EVENT /
       AGENTS          KNOWLEDGE       CONTEXT
          │
          ▼
       SKILLS
          │
          ▼
      POLICY / RISK / APPROVAL
          │
          ▼
        TOOLS
          │
          ├──────────────────────────────┐
          │                              │
          ▼                              ▼
        MGBOS                     EXTERNAL SYSTEMS
 Business Operating               Channels / SaaS /
 System of Record                 Providers / GitHub
          │                              │
          └──────────────┬───────────────┘
                         │
                         ▼
                AUTOMATION / EVENTS
                     n8n / workers
                         │
                         ▼
                  BUSINESS REALITY
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
     Customer         Vendor        Physical Ops
                                      Production
                                      QC
                                      Inventory
                                      Fulfillment
```

Diagram ini menunjukkan logical responsibilities.

Ia tidak menyatakan seluruh component sudah diimplementasikan.

---

# 5. Current State vs Target State

## CURRENT

Saat dokumen ini diaktifkan:

```text id="knr1cu"
Repository Governance    ACTIVE

MGBOS                     ACTIVE implementation
                          + canonical architecture

MGBOS Engineering
Control Plane             ACTIVE governance

Engineering Skills        PRESENT

JARVIS                    DESIGN INPUT /
                          NOT YET canonical runtime implementation

Runtime Business Agents   NOT YET registered

Runtime Skill System      NOT YET established

Runtime Tool Registry     NOT YET established

Founder Decision Inbox    TARGET

Advanced Memory           TARGET

Event Intelligence        TARGET
```

## TARGET

Target architecture adalah:

```text id="46k87d"
Authoritative Business System
        +
Intelligence Layer
        +
Governed Digital Workforce
        +
Capability Registry
        +
Policy / Approval
        +
Event / Automation Layer
        +
Verification / Evidence
        +
Founder Command Interface
```

CURRENT dan TARGET MUST NOT disamakan.

---

# 6. Human Authority Plane

Puncak authority berada pada human owner.

Saat ini:

```text id="l5wdh0"
RIZKY
```

bertindak sebagai:

```text id="zu6xq5"
Founder
Owner
Final Business Authority
Strategic Decision Maker
Capital Allocator
High-Risk Approval Authority
```

AI dapat:

```text id="e67s4m"
observe
analyze
recommend
prepare
coordinate
execute authorized capabilities
```

tetapi reasoning ability tidak menciptakan authority.

---

# 7. Founder-by-Exception Model

Target operating model adalah:

```text id="0jutd6"
NORMAL WORK
      ↓
SYSTEM

EXCEPTION
      ↓
JARVIS

MATERIAL DECISION
      ↓
FOUNDER
```

Founder tidak seharusnya menjadi router manual seluruh pekerjaan.

JARVIS bertugas mengompresi kompleksitas menjadi:

```text id="j4z9nx"
What happened?

What changed?

What is abnormal?

What can the system handle?

What requires attention?

What decision is required?

What are the options?

What evidence supports them?
```

---

# 8. JARVIS Position

JARVIS adalah:

> **Intelligence, management, and orchestration layer.**

JARVIS bukan:

```text id="4e3ikr"
business database
ERP
payment ledger
inventory ledger
workflow database
LLM persona
single AI model
single agent
```

JARVIS bertanggung jawab secara konseptual terhadap:

```text id="7u900x"
intent interpretation
context assembly
planning
reasoning orchestration
agent selection
skill selection
tool selection
policy coordination
approval routing
execution coordination
verification
evidence synthesis
prioritization
briefing
exception management
```

---

# 9. JARVIS Core Is Not an Agent

JARVIS Core MUST NOT menjadi giant specialist agent.

Core adalah coordinator.

Conceptual flow:

```text id="iu95qj"
REQUEST / EVENT
      ↓
INTENT
      ↓
CONTEXT
      ↓
PLAN
      ↓
POLICY
      ↓
CAPABILITY SELECTION
      ↓
EXECUTION
      ↓
VERIFICATION
      ↓
EVIDENCE
      ↓
SYNTHESIS
```

Specialist reasoning dapat didelegasikan ke runtime agents.

Authority tetap dibatasi oleh policy dan capabilities.

---

# 10. Runtime Agent Plane

Runtime agent adalah:

> **specialist reasoning role with bounded responsibility.**

Contoh future roles:

```text id="swhrgp"
CFO Agent
COO Agent
CMO Agent
Sales Agent
Customer Service Agent
Procurement Agent
Vendor Agent
Content Agent
Research Agent
```

Agent menentukan:

```text id="p1qj64"
WHO reasons
```

Agent bukan permission.

Agent bukan tool.

Agent bukan source of truth.

---

# 11. Skill Plane

Skill menentukan:

```text id="o8z9w3"
HOW a known type of work is performed
```

Contoh:

```text id="pw2n6f"
analyze_cashflow

compare_vendor

qualify_lead

prepare_quotation

detect_margin_anomaly

create_content_brief
```

Skill dapat digunakan oleh lebih dari satu compatible agent jika contract mengizinkan.

Skill SHOULD mendefinisikan:

```text id="drd52v"
input
output
rules
allowed capabilities
risk
verification
evidence
failure behavior
```

---

# 12. Tool / Capability Plane

Tool menentukan:

```text id="hjhejq"
WHAT the system can read or affect
```

Examples:

```text id="lzwp5z"
mgbos.order.read

mgbos.vendor.read

mgbos.payment.record

github.pull_request.read

email.message.send

social.content.publish
```

Tool identity SHOULD be capability-oriented rather than provider-oriented.

Example:

Prefer:

```text id="csxy7v"
email.message.send
```

over:

```text id="8rgkba"
gmail_specific_send
```

when the provider is implementation detail.

---

# 13. Capability Does Not Grant Authority

Having access to a tool does not automatically authorize its use.

Conceptual rule:

```text id="g97p27"
AGENT
  +
SKILL
  +
TOOL EXISTS

      ≠

ACTION AUTHORIZED
```

Authorization additionally depends on:

```text id="mrsvm2"
actor
policy
risk
environment
business state
approval requirements
capability scope
```

---

# 14. Policy and Approval Plane

Before consequential execution:

```text id="iqilv6"
PLAN
 ↓
POLICY CHECK
 ↓
PERMISSION CHECK
 ↓
RISK EVALUATION
 ↓
APPROVAL REQUIREMENT
 ↓
EXECUTION
```

Policy MUST execute outside free-form model reasoning where deterministic enforcement is possible.

Model recommendation does not replace policy enforcement.

---

# 15. MGBOS Position

MGBOS is:

> **MultiGraph Business Operating System and authoritative business control plane.**

MGBOS owns business reality represented digitally.

Its scope includes concepts such as:

```text id="mod4aj"
customers
leads
requirements
quotations
orders
invoices
payments
financial events
vendors
procurement
inventory
production
quality
shipments
business events
```

MGBOS business invariants remain inside MGBOS.

---

# 16. MGBOS as System of Record

Canonical business facts live in authoritative systems, principally MGBOS/PostgreSQL for MGBOS-controlled domains.

Example:

```text id="5ps5ev"
"Invoice is PAID"
```

must ultimately be supported by authoritative business state.

JARVIS remembering:

```text id="ngchgl"
"Customer sudah bayar"
```

does not establish payment truth.

Correct flow:

```text id="ex9bav"
Memory / Message / External Signal
             ↓
        JARVIS inquiry
             ↓
        MGBOS capability
             ↓
     authoritative state
```

---

# 17. Rules Before AI

Deterministic business rules SHOULD remain deterministic.

Examples:

```text id="zx0atb"
money arithmetic
margin floor
inventory availability
valid state transitions
authorization
invoice balance
payment allocation
order ceiling
idempotency
```

AI may interpret results.

AI SHOULD NOT calculate or invent canonical transactional truth when deterministic systems can produce it reliably.

---

# 18. JARVIS ↔ MGBOS Boundary

JARVIS MUST NOT arbitrarily mutate MGBOS storage.

Correct interaction:

```text id="11xldk"
JARVIS
   ↓
typed capability / command
   ↓
MGBOS authorization
   ↓
business invariant checks
   ↓
transaction
   ↓
state transition
   ↓
audit / outbox
```

Incorrect interaction:

```text id="xbyo5g"
LLM
 ↓
direct SQL mutation
 ↓
business database
```

Reasoning layer must never bypass authoritative command boundaries merely for convenience.

---

# 19. Business Projection Principle

JARVIS SHOULD request meaningful business concepts rather than unrestricted raw-table access where possible.

Prefer:

```text id="pbg9xj"
mgbos.finance.summary.read

mgbos.inventory.alerts.read

mgbos.production.exceptions.read
```

instead of:

```text id="r9yvt3"
arbitrary SQL over all tables
```

The authoritative system should expose stable projections when repeated interpretation requires them.

---

# 20. External Systems Plane

External systems include:

```text id="1h8mzd"
marketplaces
payment providers
shipping providers
email
WhatsApp
social platforms
GitHub
calendar
cloud storage
analytics
AI providers
other SaaS
```

Each external system may own facts within its own domain.

Example:

```text id="aptqgx"
Courier
→ courier-side delivery state

Payment Provider
→ provider-side transaction acknowledgement

GitHub
→ CI / repository state
```

How those facts affect internal business truth is determined by the relevant authoritative internal system.

---

# 21. Automation Plane

n8n and similar workflow runtimes exist to:

```text id="btrnl4"
schedule
trigger
route
transform
coordinate
retry
connect systems
```

They are orchestration infrastructure.

They are not business truth.

Canonical rule:

> **Automation moves work. Authoritative systems own state.**

---

# 22. Event Architecture

Business systems SHOULD emit meaningful events when state changes.

Example:

```text id="fdv9mn"
ORDER_CONFIRMED
PAYMENT_RECORDED
PRODUCTION_DELAYED
INVENTORY_LOW
SHIPMENT_DELIVERED
```

Preferred flow:

```text id="ftrtpb"
MGBOS TRANSACTION
       │
       ├── state mutation
       │
       └── outbox event
              ↓
        event delivery
              ↓
        automation/event layer
              ↓
          JARVIS / integrations
```

Canonical state and outbox event SHOULD be committed atomically where applicable.

---

# 23. Events Are Signals, Not Automatic Authority

Receiving an event does not automatically authorize action.

Correct:

```text id="9q4sq4"
EVENT
 ↓
CONTEXT
 ↓
POLICY
 ↓
DECISION
 ↓
ACTION if allowed
```

Incorrect:

```text id="3m9p5p"
EVENT
 ↓
unconditional high-risk action
```

This prevents automation chains from amplifying bad input.

---

# 24. Physical Reality Plane

MultiGraph-related operations include real physical state that software cannot infer safely from digital workflow alone.

Examples:

```text id="egulkr"
material physically received
production completed
QC passed
goods packed
shipment handed to courier
stock physically counted
```

Real-world facts may enter systems through:

```text id="so3ywq"
human confirmation
barcode / scanner
photo evidence
provider signal
sensor / IoT where justified
```

Digital workflow state MUST NOT automatically be assumed to equal physical reality unless the process explicitly guarantees it.

---

# 25. Physical-to-Digital Bridge

Target pattern:

```text id="dm17te"
PHYSICAL EVENT
     ↓
OBSERVATION / CONFIRMATION
     ↓
AUTHORIZED BUSINESS COMMAND
     ↓
MGBOS
     ↓
BUSINESS EVENT
     ↓
JARVIS CONTEXT
```

AI may assist interpretation.

The authoritative state transition remains governed by business rules.

---

# 26. Memory Plane

JARVIS memory is intended for context continuity.

Future categories may include:

```text id="c7n9hl"
working memory
episodic memory
semantic memory
preference memory
evidence references
```

Golden rule:

> **Memory remembers context. Authoritative systems preserve facts.**

Memory MUST NOT silently override current authoritative state.

---

# 27. Knowledge Plane

Knowledge may originate from:

```text id="bhjzrs"
canonical documentation
business documents
research
external sources
historical sessions
human instructions
```

Knowledge systems help JARVIS understand context.

They do not automatically create operational authority.

Documentation authority follows DOC-001 and DOC-002.

---

# 28. Model Provider Plane

Models are replaceable cognitive compute.

They are not JARVIS itself.

Target architecture:

```text id="i52fi7"
JARVIS
  ↓
MODEL GATEWAY / ROUTER
  ↓
Capability Profile
  ↓
Provider / Model
```

Logical profiles may include:

```text id="2htp4e"
FAST
BALANCED
DEEP
CRITIC
CREATIVE
VISION
VOICE
```

Specific provider/model selection is operational configuration informed by evaluation, cost, latency, privacy, and capability.

---

# 29. Provider Independence

Business logic MUST NOT depend unnecessarily on a specific AI provider.

Instead of:

```text id="9qgos9"
Business Rule
→ provider model name
```

prefer:

```text id="jjqn1z"
Business Need
→ cognitive profile
→ model router
→ provider adapter
```

Provider replacement SHOULD NOT require rewriting domain architecture.

---

# 30. Verification Plane

Successful tool invocation is not sufficient evidence of successful business outcome.

Pattern:

```text id="9vycuv"
EXECUTE
  ↓
VERIFY
  ↓
RECORD EVIDENCE
```

Verification may include:

```text id="hni0br"
schema validation
state re-read
external acknowledgement
business invariant check
freshness validation
expected side-effect check
```

---

# 31. Evidence Plane

Evidence records:

```text id="v11zlx"
what was requested
what was decided
who/what acted
which capability ran
what system responded
what was verified
what changed
```

Evidence enables:

```text id="71py9q"
audit
debugging
trust
reconciliation
autonomy evaluation
human review
```

JARVIS SHOULD be able to explain factual recommendations using evidence references.

---

# 32. Decision Flow

Target founder decision flow:

```text id="g3k4tw"
BUSINESS STATE / EVENT
        ↓
      JARVIS
        ↓
ANALYSIS + OPTIONS
        ↓
RECOMMENDATION
        ↓
RISK / IMPACT / EVIDENCE
        ↓
DECISION INBOX
        ↓
      RIZKY
        ↓
APPROVE / REJECT / EDIT / DEFER
        ↓
AUTHORIZED EXECUTION
        ↓
VERIFICATION
```

Decision Inbox is the target interface for meaningful human governance.

---

# 33. Automatic Action Flow

For capabilities eventually approved for bounded autonomy:

```text id="bczg0e"
EVENT / SCHEDULE
      ↓
JARVIS
      ↓
PLAN
      ↓
POLICY
      ↓
ACTION ALLOWED?
      ↓ YES
EXECUTE
      ↓
VERIFY
      ↓
EVIDENCE
      ↓
REPORT / EXCEPTION
```

If policy fails:

```text id="3y2cnx"
ASK HUMAN
```

If verification fails:

```text id="k9lpss"
EXCEPTION / RECONCILIATION
```

---

# 34. Read / Analysis Flow

A typical intelligence request:

```text id="3d2q48"
RIZKY
  ↓
JARVIS
  ↓
identify required business concepts
  ↓
TOOLS
  ↓
MGBOS / EXTERNAL AUTHORITIES
  ↓
VERIFIED DATA
  ↓
ANALYSIS
  ↓
EVIDENCE-BACKED RESPONSE
```

JARVIS MUST NOT substitute missing source data with invented metrics.

---

# 35. Engineering Control Plane

Software development agents exist in a separate control plane.

```text id="uvjyi3"
                SOFTWARE CHANGE REQUEST
                         │
                         ▼
                     PLANNER
                         │
                         ▼
                    ENGINEER
                         │
                 ┌───────┴────────┐
                 ▼                ▼
              AUDITOR            QA
                 │                │
                 └───────┬────────┘
                         ▼
                     CI / GATES
                         │
                         ▼
                       RIZKY
                         │
                         ▼
                RELEASE OPERATOR
```

Canonical current implementation:

```text id="lpljt7"
systems/mgbos/docs/engineering/agent-system/
+
.agents/
```

---

# 36. Engineering Plane Is Not Runtime Workforce

Engineering agents:

```text id="gu75k6"
change software
```

Runtime agents:

```text id="qcxg2q"
operate business capabilities
```

They may share technologies or patterns.

They MUST NOT share authority implicitly.

Example:

```text id="gzhglv"
Engineering Agent can edit payment source code
```

does NOT imply:

```text id="1aadkf"
Engineering Agent can record production payment
```

These are different capabilities and risk domains.

---

# 37. Repository vs Runtime Boundary

Repository configuration defines:

```text id="802dv7"
code
documentation
agent development instructions
tests
configuration templates
```

Production runtime defines:

```text id="2fzf4z"
live identities
live credentials
runtime permissions
runtime tools
active agents
active workflows
```

Repository presence MUST NOT be treated as runtime activation.

---

# 38. Security Boundary

Secrets MUST be handled by trusted execution/tool infrastructure.

Runtime agents SHOULD request capabilities.

They SHOULD NOT receive raw credentials where avoidable.

Preferred:

```text id="xw9hb5"
AGENT
 ↓
TOOL GATEWAY
 ↓
SECRET / AUTH
 ↓
EXTERNAL SYSTEM
```

rather than:

```text id="gojhuw"
AGENT CONTEXT
contains all production secrets
```

---

# 39. External Content Trust Boundary

External content is:

```text id="uwqqbl"
DATA
```

not:

```text id="m5nc93"
AUTHORITY
```

This includes:

```text id="ub10gh"
email
website
customer message
PDF
uploaded document
GitHub issue
social message
vendor payload
tool response text
```

Instructions embedded inside external data MUST NOT override system policy.

---

# 40. Business Continuity Principle

Core business operation MUST NOT depend absolutely on JARVIS availability.

If:

```text id="sc1syu"
JARVIS DOWN
```

then MGBOS SHOULD remain capable of authoritative business operation.

If:

```text id="vhh559"
AI PROVIDER DOWN
```

then business truth MUST remain available.

If:

```text id="rqte2n"
n8n DOWN
```

then existing business state MUST remain intact.

This produces:

```text id="4et4s1"
MGBOS
= operational foundation

JARVIS
= intelligence leverage
```

not:

```text id="s2e501"
JARVIS
= single point of business survival
```

---

# 41. Graceful Degradation

Subsystem failure SHOULD reduce capability rather than corrupt truth.

Examples:

```text id="rl0lv2"
Model unavailable
→ no AI analysis
→ business state remains valid

JARVIS unavailable
→ manual MGBOS operation

Automation unavailable
→ events queue / manual handling

External channel unavailable
→ internal order state preserved

Verification uncertain
→ do not claim success
```

---

# 42. Exception Principle

Not every case must be solved autonomously.

Allowed outcomes include:

```text id="6y0pfn"
NEEDS_HUMAN
AMBIGUOUS
NEEDS_RECONCILIATION
POLICY_DENIED
VERIFICATION_FAILED
EXTERNAL_SYSTEM_UNAVAILABLE
```

Escalating safely is a valid system behavior.

---

# 43. Autonomy Direction

Autonomy is granted per capability, not per agent globally.

Conceptual progression:

```text id="hh0oxb"
Observe
   ↓
Recommend
   ↓
Prepare
   ↓
Execute after approval
   ↓
Execute automatically within policy
```

Detailed autonomy semantics belong to dedicated governance documentation.

Master Blueprint only establishes the architectural rule:

> **Autonomy must remain bounded, evidence-based, and capability-specific.**

---

# 44. Feedback Loop

Human decisions and execution outcomes create improvement signals.

```text id="28us2g"
RECOMMEND
   ↓
APPROVE / EDIT / REJECT
   ↓
EXECUTE
   ↓
OUTCOME
   ↓
EVALUATE
   ↓
IMPROVE
```

Feedback may improve:

```text id="0m4xfy"
skills
prompting
model routing
tool selection
priority rules
workflow design
```

Feedback MUST NOT silently weaken policy or security boundaries.

---

# 45. Multi-Business Isolation

BisnisHub may contain multiple businesses and independent projects.

Context MUST NOT automatically cross organizational boundaries.

Examples:

```text id="cqotpe"
TeeStock context
≠ automatically MultiGraph context

MultiGraph context
≠ automatically KasKita context
```

Cross-business access must be explicit and policy-governed.

---

# 46. Entity Identity Direction

Future architecture must use stable entity identity.

Examples:

```text id="lq9ewk"
Person
Organization
Brand
Business
Customer
Vendor
Project
Repository
Campaign
Order
Account
```

JARVIS SHOULD reason over stable IDs and relationships rather than relying only on names.

Detailed entity graph semantics belong to a future canonical specification.

---

# 47. Time and Scheduling Direction

Future proactive workflows require explicit semantics for:

```text id="xhjg8x"
timezone
business day
deadline
recurrence
SLA
quiet hours
missed execution
duplicate execution
```

Time MUST NOT remain an implicit assumption once JARVIS begins scheduled or proactive work.

---

# 48. Durable Workflow Direction

Long-running business workflows must eventually tolerate:

```text id="gcvxzs"
restart
timeout
duplicate delivery
partial execution
provider acknowledgement uncertainty
callback loss
retry
reconciliation
```

Automation maturity is not measured only by:

```text id="a56dfk"
"tool returned success"
```

but by whether business outcome can be safely recovered and verified.

---

# 49. Architecture Planes Summary

The ecosystem consists of distinct planes:

```text id="30kl5p"
1. HUMAN AUTHORITY PLANE
   Founder / accountable humans

2. INTELLIGENCE PLANE
   JARVIS

3. DIGITAL WORKFORCE PLANE
   Runtime Agents

4. KNOWLEDGE / CAPABILITY PLANE
   Skills + Memory + Knowledge

5. CONTROL PLANE
   Policy + Risk + Permission + Approval

6. ACTION PLANE
   Tools / Capabilities

7. BUSINESS SYSTEM PLANE
   MGBOS / authoritative systems

8. AUTOMATION & EVENT PLANE
   n8n / workers / queues / integrations

9. EXTERNAL SYSTEM PLANE
   SaaS / channels / providers

10. PHYSICAL REALITY PLANE
    production / inventory / vendor / logistics / people

11. ENGINEERING CONTROL PLANE
    Planner / Engineer / Auditor / QA / Release
```

These planes interact.

They MUST NOT collapse into one giant AI system.

---

# 50. Canonical Responsibility Matrix

| Component | Think | Own Facts | Mutate Business State | Orchestrate | Verify | Final Authority |
|---|---:|---:|---:|---:|---:|---:|
| Rizky / Human Owner | ✅ | policy/decision | ✅ | ✅ | ✅ | ✅ |
| JARVIS | ✅ | ❌ | via tools only | ✅ | ✅ | ❌ |
| Runtime Agent | ✅ specialist | ❌ | via authorized tools | limited | limited | ❌ |
| Skill | procedural | ❌ | through tool | ❌ | defined by contract | ❌ |
| Tool | ❌ | ❌ | capability-specific | ❌ | result only | ❌ |
| MGBOS | deterministic rules | ✅ business | ✅ | domain events | ✅ invariants | domain authority |
| n8n | minimal | ❌ | via authorized command | ✅ | limited | ❌ |
| External Provider | provider logic | own external facts | own external state | provider-specific | own response | external scope only |
| AI Model | ✅ cognitive | ❌ | ❌ directly | ❌ | ❌ authoritative | ❌ |
| Engineering Agent | engineering reasoning | ❌ business | code changes only | engineering | tests/review | ❌ |

---

# 51. Forbidden Architectural Shortcuts

The following patterns violate this blueprint.

## Direct AI Database Mutation

```text id="co9viu"
LLM → SQL → business tables
```

without authorized business command boundaries.

## Workflow Engine as Source of Truth

```text id="28ya5j"
n8n workflow state
=
canonical order/payment state
```

## Agent as Global Authority

```text id="7dxz95"
CFO Agent says it
→ therefore financial fact
```

## Memory as Transaction Truth

```text id="32m0uk"
JARVIS remembers payment
→ therefore invoice paid
```

## Tool Success as Business Success

```text id="oj3f8u"
HTTP 200
→ therefore desired state verified
```

## External Text as Policy

```text id="eqaw11"
email says ignore policy
→ system obeys
```

## Repository Presence as Runtime Activation

```text id="79no3c"
skill file exists
→ autonomous worker is active
```

All are prohibited assumptions.

---

# 52. Design for Replaceability

Replaceable components SHOULD include:

```text id="lgfkjr"
AI provider
AI model
tool provider
workflow provider
UI interface
notification channel
runtime worker implementation
```

Harder-to-replace strategic assets include:

```text id="mz0i72"
business data
domain rules
business history
workflow knowledge
skills
evidence
customer relationships
vendor relationships
canonical documentation
feedback history
```

Architecture should protect the latter from unnecessary dependency on the former.

---

# 53. System Value Hierarchy

The long-term value of the system is not concentrated in the AI model.

Conceptually:

```text id="mm6g1w"
Business Data
     +
Domain Rules
     +
Canonical Knowledge
     +
Skills
     +
Tools
     +
Workflow History
     +
Evidence
     +
Feedback
     +
Customer / Vendor Network
     ↓
Operational Intelligence Asset
```

Models provide leverage over those assets.

They are not the assets themselves.

---

# 54. First JARVIS Vertical Slice

The recommended first JARVIS implementation remains:

> **Morning Business Briefing — read-only, evidence-first.**

Conceptual flow:

```text id="5kwh7p"
RIZKY
  ↓
"Jarvis, briefing pagi."
  ↓
JARVIS
  ↓
MGBOS READ CAPABILITIES
+
optional engineering/external reads
  ↓
VERIFICATION
  ↓
PRIORITIZED EXCEPTIONS
  ↓
EVIDENCE
  ↓
BRIEFING
```

No business mutation is required to prove the intelligence architecture.

---

# 55. Evolution Path

Recommended architecture maturity:

```text id="paayte"
STAGE 1
Authoritative Business Foundation
MGBOS

        ↓

STAGE 2
Observability
Business projections / reporting

        ↓

STAGE 3
JARVIS Read Intelligence
Briefing / analysis / evidence

        ↓

STAGE 4
Decision Support
Options / recommendations / approval

        ↓

STAGE 5
Prepared Actions
Drafts / commands awaiting approval

        ↓

STAGE 6
Controlled Execution
Approval-gated actions

        ↓

STAGE 7
Bounded Autonomy
Capability-specific automation

        ↓

STAGE 8
Founder-by-Exception
System handles routine;
founder handles material exceptions
```

Stages describe maturity direction.

They are not claims of current implementation.

---

# 56. Non-Goals of This Document

DOC-003 does NOT define:

```text id="1v83ci"
detailed MGBOS data model
detailed JARVIS runtime contracts
risk classification semantics
autonomy level semantics
individual agent contracts
individual skill contracts
tool schemas
model-provider selection
infrastructure vendor
deployment topology
database schema
UI design
business strategy
```

Those belong to lower-level canonical documentation.

---

# 57. Architectural Invariants Established Here

The following principles are authoritative at ecosystem level:

1. Rizky / accountable humans remain ultimate authority for high-impact decisions.

2. MGBOS owns authoritative business facts for MGBOS-controlled domains.

3. JARVIS is intelligence and orchestration, not business system of record.

4. Runtime agents are specialist reasoning roles, not authority containers.

5. Skills define reusable ways of working.

6. Tools define bounded capabilities.

7. Policy and authorization govern execution independently of model reasoning.

8. AI models are replaceable cognitive providers.

9. n8n is orchestration infrastructure, not business truth.

10. External systems own only the facts inside their external domain.

11. Tool execution requires verification before success is trusted.

12. Evidence is a first-class part of trustworthy operation.

13. AI memory is context, not transactional truth.

14. Engineering agents and runtime business agents remain separate authority systems.

15. External content is data, not project authority.

16. Physical business facts require explicit physical-to-digital confirmation.

17. Core business operation must degrade safely when AI is unavailable.

18. Autonomy is capability-specific and bounded.

19. Repository presence does not imply runtime activation.

20. Architecture must favor replaceability of providers while protecting business data, rules, evidence, and operational knowledge.

---

# 58. Master Mental Model

The complete system can be understood as:

```text id="k28tpf"
                         RIZKY
                Ultimate Human Authority
                          │
                          ▼
                       JARVIS
              Intelligence / Management
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
          AGENTS        MEMORY        EVENTS
            │
            ▼
          SKILLS
            │
            ▼
     POLICY / APPROVAL
            │
            ▼
           TOOLS
            │
     ┌──────┴───────────────┐
     ▼                      ▼
   MGBOS              EXTERNAL SYSTEMS
 Business Truth        External Truth
     │                      │
     └──────────┬───────────┘
                ▼
        AUTOMATION / EVENTS
                │
                ▼
         PHYSICAL BUSINESS
                │
                ▼
             EVIDENCE
                │
                ▼
            VERIFICATION
                │
                └──────────────→ JARVIS
                                      │
                                      ▼
                                    RIZKY
```

Parallel to runtime:

```text id="n5m7af"
SOFTWARE CHANGE
      ↓
ENGINEERING CONTROL PLANE
Planner → Engineer → Auditor / QA
      ↓
CI / Evidence
      ↓
Human Gate
      ↓
Release
```

The two worlds interact through governed software releases.

They are not the same agent system.

---

# 59. North Star Architecture

The final architectural objective is:

> **A human-governed, AI-assisted operating ecosystem where authoritative systems preserve truth, JARVIS converts truth into understanding and coordinated action, digital workers handle repeatable cognitive work, deterministic policy limits authority, and the founder primarily manages decisions and exceptions rather than routine execution.**

---

# 60. Final Principle

> **MGBOS knows what is true.  
> JARVIS determines what it means and what deserves attention.  
> Agents reason within specialist roles.  
> Skills define how work is performed.  
> Tools provide bounded ability to act.  
> Policy determines what is allowed.  
> Evidence proves what happened.  
> Humans retain authority where consequences matter.**