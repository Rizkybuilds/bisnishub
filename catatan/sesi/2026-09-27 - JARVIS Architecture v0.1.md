# JARVIS Architecture v0.1

**Version:** 0.1  
**Status:** Architecture Draft / Foundation  
**Tanggal:** 27 September 2026  
**Owner:** Rizky  
**Architecture style:** Provider-neutral, event-driven, tool-oriented, human-governed  
**Primary principle:** AI reasons; authoritative systems own facts.

---

# 1. Vision

JARVIS adalah **Personal Intelligence Operating System** yang menjadi intelligence layer di atas seluruh sistem digital, bisnis, pekerjaan, knowledge, dan automation milik Rizky.

JARVIS bukan sekadar chatbot dan bukan sekadar kumpulan autonomous agent.

JARVIS harus mampu:

- memahami konteks;
- mengingat informasi relevan;
- merencanakan pekerjaan;
- memilih agent, skill, dan tool yang tepat;
- membaca state dari sistem authoritative;
- menjalankan tindakan secara terkendali;
- bereaksi terhadap event;
- memonitor pekerjaan yang sedang berjalan;
- memberikan rekomendasi secara proaktif;
- menjaga audit trail;
- mengetahui batas kewenangannya sendiri.

Long-term vision:

> **Satu intelligence layer yang memahami seluruh ekosistem digital Rizky dan membantu mengoperasikan bisnis, software, knowledge, serta pekerjaan sehari-hari secara aman dan terukur.**

---

# 2. Positioning

JARVIS bukan pengganti MGBOS.

MGBOS dan JARVIS memiliki tanggung jawab berbeda.

```text
                  RIZKY
                    │
                    ▼
             ┌───────────────┐
             │    JARVIS     │
             │ Intelligence  │
             │     Layer     │
             └───────┬───────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
        MGBOS      GitHub     External
        ERP         Dev       Systems
          │
          ▼
      PostgreSQL
```

### MGBOS

Menjawab:

```text
Apa yang benar-benar terjadi di bisnis?
```

Contoh:

- customer;
- lead;
- quotation;
- order;
- invoice;
- payment;
- inventory;
- production;
- QC;
- shipment;
- vendor;
- ledger.

### JARVIS

Menjawab:

```text
Apa artinya?
Apa yang perlu diperhatikan?
Apa yang harus dilakukan?
Siapa atau tool apa yang harus mengerjakannya?
```

Contoh:

```text
"Margin order ini turun."

"Invoice ini perlu follow-up."

"PR ini mengubah financial invariant."

"Stok blank garment berpotensi habis."

"Lo punya tiga prioritas penting pagi ini."
```

---

# 3. Core Architecture Principle

JARVIS menggunakan prinsip:

> **Reason → Verify → Act → Observe → Learn**

Tidak boleh:

```text
AI thinks
→ directly mutates database
```

Harus:

```text
Intent
↓
Context
↓
Reasoning
↓
Plan
↓
Permission Check
↓
Tool / Command
↓
Authoritative System
↓
Verification
↓
Evidence
↓
Response
```

---

# 4. High-Level Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                         INTERFACES                           │
│                                                              │
│ Chat · Web · Desktop · Mobile · Voice · Notifications       │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                       JARVIS CORE                            │
│                                                              │
│ Intent Router                                                │
│ Context Builder                                              │
│ Planner                                                      │
│ Supervisor                                                   │
│ Policy Engine                                                │
│ Execution Engine                                             │
│ Verification Engine                                          │
└───────┬───────────┬──────────────┬───────────────┬───────────┘
        │           │              │               │
        ▼           ▼              ▼               ▼
┌─────────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────┐
│   MEMORY    │ │  AGENTS  │ │   SKILLS   │ │     TOOLS    │
│             │ │          │ │            │ │              │
│ Working     │ │ Planner  │ │ Pricing    │ │ MGBOS        │
│ Episodic    │ │ Engineer │ │ Research   │ │ GitHub       │
│ Semantic    │ │ CFO      │ │ Audit      │ │ Browser      │
│ Preference  │ │ COO      │ │ Payment    │ │ Email        │
│ Evidence    │ │ Auditor  │ │ Release    │ │ Calendar     │
└──────┬──────┘ └──────────┘ └────────────┘ └───────┬──────┘
       │                                             │
       │                                             ▼
       │                                  ┌───────────────────┐
       │                                  │ EXTERNAL SYSTEMS  │
       │                                  │                   │
       │                                  │ MGBOS             │
       │                                  │ Supabase          │
       │                                  │ GitHub            │
       │                                  │ n8n               │
       │                                  │ Email             │
       │                                  │ Calendar          │
       │                                  │ Storage           │
       │                                  └─────────┬─────────┘
       │                                            │
       └──────────────────┐                         │
                          ▼                         ▼
                 ┌─────────────────────────────────────┐
                 │            EVENT LAYER              │
                 │                                     │
                 │ Business Events                     │
                 │ Engineering Events                  │
                 │ Personal Events                     │
                 │ Scheduled Events                    │
                 └─────────────────┬───────────────────┘
                                   │
                                   ▼
                         Proactive Intelligence
```

---

# 5. JARVIS Core

JARVIS Core adalah pusat koordinasi.

Core **bukan agent persona**.

Core tidak berperan sebagai CFO, programmer, marketer, atau researcher.

Core bertanggung jawab terhadap orchestration.

Komponen v0.1:

## 5.1 Intent Router

Menentukan apa yang sebenarnya diminta.

Contoh:

```text
"cek order gue hari ini"
```

menjadi:

```text
intent:
business.operations.review

scope:
orders

time_range:
today
```

Intent Router juga menentukan apakah request:

```text
ANSWER
READ
ANALYZE
PLAN
WRITE
EXECUTE
MONITOR
```

---

# 6. Context Builder

Context Builder membangun working context yang minimum tetapi cukup.

Sumber context dapat berasal dari:

```text
current conversation
user preferences
active project
business identity
recent events
relevant memory
authoritative systems
```

Prinsip:

> Jangan memasukkan seluruh history ke setiap request.

Context harus retrieved berdasarkan kebutuhan.

Contoh request:

```text
"Audit perubahan inventory ini."
```

Context Builder mungkin mengambil:

```text
MGBOS architecture
inventory specification
relevant ADR
PR diff
permission rules
previous audit findings
```

Tidak perlu mengambil:

```text
marketing strategy
YouTube scripts
KasKita roadmap
personal notes yang tidak relevan
```

---

# 7. Planner

Planner mengubah intent menjadi execution plan.

Contoh:

```text
Goal:
Review current business health
```

Plan:

```text
1. Fetch unpaid invoices
2. Fetch overdue production jobs
3. Fetch low inventory
4. Calculate notable margin deviation
5. Retrieve engineering alerts
6. Rank findings by urgency
7. Produce briefing
```

Planner tidak otomatis mendapatkan permission untuk mengeksekusi semua langkah.

Plan tetap diperiksa Policy Engine.

---

# 8. Supervisor

Supervisor mengoordinasikan:

```text
agents
skills
tools
parallel execution
dependencies
verification
failure recovery
```

Supervisor harus tipis.

Supervisor **tidak boleh menjadi giant agent yang mengetahui semuanya**.

Ia memilih specialist berdasarkan capability.

Contoh:

```text
Financial analysis
→ CFO Agent

Code integrity
→ Engineering Auditor

Operational bottleneck
→ COO Agent
```

---

# 9. Agent Model

Agent adalah specialist reasoning role.

Initial taxonomy:

```text
JARVIS
│
├── Cognitive
│   ├── Planner
│   ├── Researcher
│   └── Analyst
│
├── Engineering
│   ├── Engineer
│   ├── Reviewer
│   ├── QA
│   └── Release Operator
│
└── Business
    ├── CFO
    ├── COO
    ├── Sales
    └── Marketing
```

Tidak semua agent perlu diimplementasikan pada v0.1.

### Agent ≠ Tool

CFO boleh berpikir tentang keuangan.

Tetapi CFO tidak otomatis memiliki akses:

```text
record_payment
issue_refund
change_price
```

Akses ditentukan Permission Engine.

### Agent ≠ Skill

Agent adalah:

```text
WHO reasons
```

Skill adalah:

```text
HOW a known task should be performed
```

Tool adalah:

```text
WHAT capability can affect/read the outside world
```

---

# 10. Skill Architecture

Skill harus berkembang dari instruction document menjadi **executable governance contract**.

Target struktur:

```text
skill-name/
├── SKILL.md
├── contract.json
├── examples/
├── evals/
└── tests/
```

### SKILL.md

Human-readable operating instruction.

### contract.json

Machine-readable contract.

Contoh konseptual:

```json
{
  "id": "mgbos-record-payment",
  "version": "1.0",
  "risk": "R5",
  "permissions": [
    "mgbos.payment.read",
    "mgbos.payment.record"
  ],
  "human_confirmation": true,
  "idempotency_required": true,
  "evidence_required": true
}
```

### Skill contract dapat menentukan

```text
input schema
output schema
allowed tools
forbidden tools
risk level
required permissions
confirmation requirement
environment restrictions
idempotency policy
verification policy
evidence policy
```

---

# 11. Tool Architecture

Tool merupakan capability terhadap external world.

Tool tidak diorganisasikan berdasarkan provider saja.

Gunakan capability-oriented naming.

Contoh:

```text
github.repository.read
github.branch.create
github.pull_request.create

mgbos.customer.read
mgbos.order.read
mgbos.quote.create
mgbos.payment.record

email.message.read
email.message.send

calendar.event.read
calendar.event.create
```

Bukan hanya:

```text
GitHub tool
MGBOS tool
Email tool
```

Tool Registry harus mengetahui:

```text
tool ID
description
input schema
output schema
provider
permission
risk level
environment availability
side effects
idempotency characteristics
```

---

# 12. Tool Registry

Semua tool harus masuk registry.

Contoh:

```text
Tool Registry
│
├── mgbos.order.read
│     risk: R1
│     mutation: false
│
├── mgbos.payment.record
│     risk: R5
│     mutation: true
│     confirmation: required
│
├── github.branch.create
│     risk: R2
│     mutation: true
│
└── github.main.push
      risk: forbidden
```

Dengan model ini, agent tidak memerlukan hardcoded knowledge tentang provider implementation.

Implementasi dapat berubah:

```text
GitHub REST
→ MCP
→ internal gateway
```

tanpa mengubah agent reasoning contract.

---

# 13. Permission Model

Permission adalah komponen fundamental.

Default:

> **Least privilege.**

Permission tidak hanya berdasarkan user.

Harus mempertimbangkan:

```text
actor
agent
skill
tool
environment
resource
risk
```

Contoh evaluasi:

```text
Actor:
Rizky

Agent:
CFO

Skill:
record-payment

Environment:
PRODUCTION

Tool:
mgbos.payment.record

Risk:
R5
```

Policy Engine menghasilkan:

```text
ALLOW
DENY
REQUIRE_CONFIRMATION
REQUIRE_REVIEW
```

---

# 14. Risk Classification

Initial model:

```text
R0 — informational
R1 — read-only
R2 — reversible low-impact mutation
R3 — significant operational mutation
R4 — sensitive/high-impact mutation
R5 — money/security/production-critical
```

Contoh:

```text
Read GitHub file
R1

Create development branch
R2

Send customer email
R3

Deploy staging
R3

Production deployment
R4

Record payment
R5

Refund customer
R5

Modify production database schema
R5
```

Semakin tinggi risk:

```text
more verification
more evidence
more human involvement
```

---

# 15. Human-in-the-Loop Model

Autonomy bukan binary.

Gunakan level:

```text
L0 — Observe
L1 — Recommend
L2 — Prepare
L3 — Execute with approval
L4 — Execute automatically within policy
```

Contoh:

### Payment

```text
Detect unpaid invoice
L0

Recommend follow-up
L1

Prepare WhatsApp message
L2

Send after approval
L3
```

Production financial mutation mungkin tidak pernah mencapai L4.

### Low-risk engineering

```text
run tests
L4

create feature branch
L4

push main
FORBIDDEN
```

---

# 16. Memory Architecture

Memory dipisahkan berdasarkan fungsi.

```text
Memory
│
├── Working
├── Episodic
├── Semantic
├── Preference
└── Evidence
```

## Working Memory

Temporary context untuk pekerjaan aktif.

Contoh:

```text
current objective
current branch
files being analyzed
active business question
```

Expire setelah context selesai.

---

## Episodic Memory

Apa yang terjadi sebelumnya.

Contoh:

```text
"Pada 26 September dilakukan audit MGBOS."
```

Digunakan untuk continuity.

Bukan source of truth transaksi.

---

## Semantic Memory

Pengetahuan relatif stabil:

```text
architecture
business rules
company relationships
terminology
product knowledge
```

---

## Preference Memory

Cara Rizky bekerja.

Contoh:

```text
preferred communication style
preferred development process
approval preferences
preferred technical conventions
```

Preference tidak boleh menggantikan permission/security policy.

---

## Evidence Memory

Referensi terhadap hasil yang telah diverifikasi.

Contoh:

```text
CI run
audit result
deployment revision
database test result
document version
```

Evidence harus menunjuk source yang bisa ditelusuri.

---

# 17. Memory Golden Rule

> **AI remembers context. Systems of record remember facts.**

Tidak boleh:

```text
Memory says:
Invoice A sudah dibayar
```

kemudian dianggap sebagai current truth.

Harus:

```text
JARVIS remembers:
Invoice A pernah dibahas.

JARVIS verifies:
MGBOS current payment state.
```

Authoritative business facts tetap berasal dari MGBOS/PostgreSQL.

---

# 18. Knowledge Architecture

Tidak semua knowledge harus masuk vector database.

Gunakan hierarchy:

```text
Structured fact
→ PostgreSQL

Code
→ Git / GitHub

Canonical documentation
→ repository/docs

Files
→ object/document storage

Semantic retrieval
→ embeddings/vector index when useful

Transient conversation
→ working memory
```

Vector retrieval adalah **search optimization**, bukan source of truth.

---

# 19. Event Architecture

JARVIS harus akhirnya mampu bereaksi tanpa selalu dipanggil melalui chat.

Sources:

```text
MGBOS events
GitHub events
calendar events
email events
scheduled events
monitoring events
manual triggers
```

Initial envelope:

```text
event_id
event_type
source
subject
timestamp
organization
correlation_id
payload_reference
risk
```

Contoh:

```text
payment.overdue
production.delayed
inventory.low
margin.threshold_breached

github.pull_request.opened
github.ci.failed

calendar.meeting.upcoming
```

---

# 20. Proactive Intelligence

Event tidak langsung menghasilkan action.

Flow:

```text
EVENT
↓
Filter
↓
Context
↓
Relevance scoring
↓
Policy
↓
Reasoning
↓
Ignore / Notify / Recommend / Execute
```

Tujuannya menghindari JARVIS menjadi sistem notification spam.

Contoh:

```text
inventory.low
```

tidak selalu harus memberi notifikasi.

Jika:

```text
inventory low
+
open orders demand high
+
lead time supplier 7 days
```

maka urgency meningkat.

---

# 21. Environment Architecture

Empat environment resmi:

```text
LOCAL
TEST
STAGING
PRODUCTION
```

## LOCAL

Tujuan:

```text
development
experimentation
agent evaluation
```

Characteristics:

```text
synthetic/local data
destructive operations permitted inside sandbox
no production credentials
```

---

## TEST / CI

Tujuan:

```text
deterministic verification
```

Characteristics:

```text
ephemeral environment
synthetic fixtures
automated testing
no external side effects
```

---

## STAGING

Tujuan:

```text
realistic integration verification
```

Characteristics:

```text
sandbox external providers
test customer identities
controlled integrations
near-production configuration
```

---

## PRODUCTION

Characteristics:

```text
real customers
real money
real communication
real operational consequences
```

Rules:

```text
least privilege
audit mandatory
high-risk confirmation
no autonomous schema mutation
no direct arbitrary SQL
```

---

# 22. Model Provider Architecture

JARVIS harus provider-neutral.

Core menggunakan abstraction:

```text
ModelGateway
```

bukan:

```text
OpenAIClient everywhere
ClaudeClient everywhere
GeminiClient everywhere
```

Model selection berdasarkan task.

Contoh capability:

```text
reasoning
coding
fast classification
vision
speech
embedding
```

Router dapat memilih provider/model berdasarkan:

```text
capability
cost
latency
privacy
availability
task complexity
```

Agent contract tidak boleh bergantung pada nama model tertentu.

---

# 23. Execution Engine

Execution Engine bertugas menjalankan approved plan.

Concept:

```text
Plan
│
├── Step 1
│   dependency: none
│
├── Step 2
│   dependency: Step 1
│
└── Step 3
    dependency: Step 1 + 2
```

Support long-term:

```text
parallel execution
retries
timeouts
idempotency
cancellation
checkpoint
resume
```

Pada v0.1 cukup synchronous execution dahulu.

Jangan langsung membangun distributed workflow engine.

---

# 24. Verification Engine

Tool result bukan otomatis dianggap sukses.

Setiap mutation penting harus memiliki postcondition.

Contoh:

```text
Action:
create GitHub branch

Verification:
branch exists
correct base SHA
```

Contoh:

```text
Action:
record payment

Verification:
payment exists
invoice allocation correct
ledger emitted
invoice status expected
```

Pattern:

```text
ACTION
→ VERIFY
→ RECORD EVIDENCE
```

---

# 25. Audit & Evidence

Semua significant execution menghasilkan:

```text
execution_id
actor
agent
skill
tool
request
environment
risk
decision
timestamp
result
verification
evidence references
```

JARVIS harus mampu menjawab:

```text
"Kenapa tindakan ini dilakukan?"

"Siapa yang mengizinkan?"

"Tool apa yang digunakan?"

"Data apa yang berubah?"

"Apakah hasilnya diverifikasi?"
```

---

# 26. Observability

Minimal telemetry:

```text
request latency
model latency
tool latency
tool failure rate
token usage
estimated AI cost
agent used
skill used
permission decisions
execution result
verification result
```

Long-term:

```text
trace_id
request
→ planner
→ agent
→ skill
→ tool
→ external system
```

harus bisa ditelusuri end-to-end.

---

# 27. Failure Architecture

JARVIS harus didesain dengan asumsi failure normal.

Potential failure:

```text
model unavailable
tool unavailable
network timeout
invalid tool response
permission rejected
partial execution
external API rate limit
stale context
verification failure
```

Rule:

> Unknown state is not success.

Jika mutation gagal diverifikasi:

```text
status:
NEEDS_RECONCILIATION
```

bukan otomatis retry secara buta.

---

# 28. Security Principles

JARVIS mengikuti:

```text
least privilege
zero implicit trust
explicit environment boundaries
secret isolation
auditability
idempotent mutations
human confirmation for critical actions
```

LLM tidak menerima raw secret jika tidak diperlukan.

Tool gateway menangani authentication.

Model menerima capability abstraction, bukan credential.

---

# 29. JARVIS ↔ MGBOS Boundary

JARVIS tidak boleh:

```text
UPDATE orders SET ...
```

JARVIS harus:

```text
mgbos.order.confirm(...)
```

atau:

```text
mgbos.payment.record(...)
```

MGBOS command layer tetap bertanggung jawab terhadap:

```text
authentication
authorization
validation
business invariants
transaction
audit
idempotency
```

JARVIS hanya orchestration/intelligence layer.

---

# 30. n8n Position

n8n berperan sebagai:

```text
integration orchestration
event trigger
scheduled workflow
simple deterministic automation
```

Bukan:

```text
business source of truth
business rules engine
JARVIS brain
```

Contoh:

```text
MGBOS event
→ outbox
→ n8n
→ WhatsApp provider
```

atau:

```text
scheduled trigger
→ JARVIS briefing workflow
```

---

# 31. MCP Position

MCP dapat menjadi salah satu standardized tool interface.

Contoh:

```text
JARVIS
→ Tool Registry
→ MCP Adapter
→ GitHub / Files / Browser / External Tools
```

Namun architecture tidak boleh bergantung 100% pada MCP.

Tool Registry harus mendukung:

```text
native API adapter
MCP adapter
internal function
HTTP service
```

---

# 32. Proposed Repository Architecture

Saat runtime benar-benar mulai dibangun:

```text
systems/
└── jarvis/
    ├── apps/
    │   ├── gateway/
    │   └── command-center/
    │
    ├── packages/
    │   ├── core/
    │   ├── agents/
    │   ├── skills/
    │   ├── tools/
    │   ├── memory/
    │   ├── events/
    │   ├── policy/
    │   ├── model-gateway/
    │   └── observability/
    │
    ├── docs/
    ├── tests/
    ├── scripts/
    └── package.json
```

Tetapi tidak perlu membuat semua package pada hari pertama.

Mulai minimal:

```text
systems/jarvis/
├── apps/
│   └── gateway/
│
├── packages/
│   ├── core/
│   ├── tools/
│   ├── policy/
│   └── memory/
│
└── docs/
```

Extract package baru hanya setelah responsibility nyata muncul.

---

# 33. JARVIS Core Request Contract

Conceptual request:

```json
{
  "request_id": "uuid",
  "actor": "rizky",
  "channel": "chat",
  "intent": "business.daily_briefing",
  "environment": "production",
  "input": "...",
  "context": {}
}
```

Response:

```json
{
  "request_id": "uuid",
  "status": "completed",
  "summary": "...",
  "findings": [],
  "actions_taken": [],
  "actions_proposed": [],
  "evidence": []
}
```

---

# 34. Execution Status Model

Canonical execution states:

```text
RECEIVED
↓
PLANNING
↓
AWAITING_PERMISSION
↓
EXECUTING
↓
VERIFYING
↓
COMPLETED
```

Alternate states:

```text
REJECTED
FAILED
CANCELLED
NEEDS_RECONCILIATION
```

---

# 35. Example: Daily Business Briefing

User:

```text
"Jarvis, briefing pagi."
```

Flow:

```text
Intent Router
↓
business.daily_briefing

Context Builder
↓
current date
business scope
priorities

Planner
↓
financial
operations
sales
engineering

Tools
↓
MGBOS
GitHub
Calendar

Agents
↓
CFO
COO
Engineering Analyst

Verification
↓
cross-check data timestamps

Output
↓
Top priorities
Risks
Opportunities
Suggested actions
```

Possible response:

```text
Ada tiga hal penting pagi ini.

1. Dua invoice overdue senilai Rp18,5 juta.
2. Job TS-143 terlambat satu hari di vendor finishing.
3. CI inventory branch gagal pada integration test.

Gue sudah menyiapkan draft follow-up invoice
dan ringkasan failure CI.

Belum ada tindakan eksternal yang dieksekusi.
```

---

# 36. Example: Engineering Task

User:

```text
"Jarvis, implementasikan fitur X."
```

Flow:

```text
Planner
↓
change scope

Engineering Agent
↓
implementation

Reviewer
↓
independent review

QA
↓
verification

Release Operator
↓
prepare PR

Policy
↓
main push forbidden
production deployment requires approval
```

---

# 37. Example: Financial Alert

Event:

```text
margin.actual_below_threshold
```

JARVIS:

```text
fetch order economics
↓
compare estimated/committed/actual
↓
CFO analysis
↓
determine materiality
↓
notify only if relevant
```

Output:

```text
Order MG-2026-417 turun dari estimasi margin 29%
menjadi 18%.

Penyebab utama:
vendor finishing +Rp620.000.

Tidak ada perubahan harga/customer action yang dilakukan.
```

---

# 38. v0.1 Non-Goals

JARVIS v0.1 tidak akan:

```text
menjadi fully autonomous agent
mengontrol production infrastructure tanpa approval
mengelola uang secara otomatis
menjalankan direct production SQL
menggunakan puluhan autonomous agents
membutuhkan Kubernetes
membutuhkan Kafka
membutuhkan dedicated vector database
membutuhkan graph database
membutuhkan microservices
```

---

# 39. Technology Direction

Default stack:

```text
Language
TypeScript

Runtime
Node.js

Validation
Zod

Data
PostgreSQL / Supabase

Web UI
Next.js

Package manager
pnpm

Automation
n8n

CI
GitHub Actions

Tool protocol
MCP + native adapters

AI
Provider-neutral Model Gateway

Semantic retrieval
Postgres + pgvector if justified

Observability
structured logs + traces
```

Prefer boring infrastructure until scale demands otherwise.

---

# 40. JARVIS Maturity Roadmap

```text
0.1 — Architecture
      contracts + boundaries

0.2 — Core Runtime
      request → context → plan → response

0.3 — Tool Runtime
      tool registry + permissions

0.4 — Memory
      working + semantic + episodic memory

0.5 — Specialist Agents
      engineering + business

0.6 — Event Intelligence
      reactive workflows

0.7 — Proactive Intelligence
      anomaly + priority detection

0.8 — Operational Copilot
      controlled execution

0.9 — Ambient Interface
      voice + desktop + mobile

1.0 — Personal Intelligence Operating System
```

---

# 41. JARVIS v0.1 Implementation Scope

Architecture v0.1 dianggap selesai jika kita sudah memiliki canonical specification untuk:

```text
Core Runtime
Agent Model
Skill Contract
Tool Registry
Permission Model
Risk Model
Memory Model
Event Model
Environment Model
Evidence Model
Provider Abstraction
MGBOS Boundary
```

Belum diperlukan production runtime.

---

# 42. Recommended First Implementation

JARVIS v0.2 sebaiknya hanya membuktikan satu vertical slice:

```text
User
↓
JARVIS API
↓
Intent Router
↓
Context Builder
↓
Planner
↓
Tool Registry
↓
READ-ONLY MGBOS TOOL
↓
Verification
↓
Response + Evidence
```

Use case pertama:

> **Morning Business Briefing**

Kenapa?

Karena use case ini menguji:

```text
context
reasoning
multiple data sources
business analysis
tool calling
evidence
memory
```

tanpa memberikan mutation authority ke JARVIS.

---

# 43. Architectural Laws

Semua implementasi JARVIS harus mengikuti hukum berikut.

### Law 1

**Authoritative facts live outside the LLM.**

### Law 2

**Agents never gain authority merely because they can reason about a task.**

### Law 3

**Every external mutation has an explicit tool contract.**

### Law 4

**High-risk actions require stronger permission and evidence.**

### Law 5

**Memory is context, not transactional truth.**

### Law 6

**Business invariants remain inside authoritative business systems.**

### Law 7

**Tool execution must be observable and verifiable.**

### Law 8

**Provider implementation must be replaceable.**

### Law 9

**Autonomy is earned capability-by-capability, not granted globally.**

### Law 10

**When state is uncertain, JARVIS reports uncertainty instead of inventing success.**

---

# 44. North Star

JARVIS tidak dinilai dari:

```text
berapa banyak agent
berapa banyak model
berapa banyak automation
berapa futuristik UI-nya
```

JARVIS dinilai dari:

```text
Apakah dia memahami konteks?

Apakah informasinya benar?

Apakah dia menggunakan tool yang benar?

Apakah tindakannya aman?

Apakah dia bisa menjelaskan apa yang terjadi?

Apakah dia membantu Rizky mengambil keputusan lebih cepat?

Apakah dia dapat dipercaya menangani pekerjaan yang semakin penting?
```

Final principle:

> **JARVIS bukan AI yang melakukan semuanya.  
> JARVIS adalah intelligence system yang mengetahui apa yang harus dilakukan, bagaimana melakukannya, siapa yang seharusnya melakukannya, dan kapan harus meminta manusia mengambil keputusan.**