# MGBOS Expert Registry & Team Architecture v1

**Status:** PROPOSED CANONICAL  
**Scope:** Engineering organization untuk `systems/mgbos/`  
**Owner / Final Authority:** Rizky  
**Purpose:** Mendefinisikan bagaimana manusia dan AI specialist berkolaborasi membangun MGBOS tanpa mencampur expertise, role, permission, dan business authority.

---

# 1. Prinsip Utama

MGBOS tidak membutuhkan puluhan agent independen.

Model yang digunakan:

```text
ROLE
=
cara bekerja + authority + responsibility

EXPERTISE
=
pengetahuan spesialis

SKILL
=
prosedur reusable

TOOL
=
kemampuan melakukan aksi

AGENT/RUNTIME
=
eksekutor
```

Contoh:

```text
Codex
→ Runtime

Engineer
→ Role

Backend Engineering
→ Expertise

api-backend-engineer
→ Skill

GitHub / shell / editor
→ Tools
```

Satu runtime dapat menjalankan beberapa role dalam waktu berbeda.

Namun satu execution harus memiliki **satu role aktif yang jelas**.

---

# 2. Dua Organisasi yang Harus Dipisahkan

BisnisHub akan memiliki dua kategori AI/agent.

```text
RIZKY
│
├── ENGINEERING ORGANIZATION
│   membangun sistem
│
└── BUSINESS INTELLIGENCE ORGANIZATION
    menjalankan / membantu operasi bisnis
```

Engineering Organization bekerja terhadap:

```text
repository
architecture
database schema
application code
CI
tests
deployment
```

Business Intelligence Organization nantinya bekerja terhadap:

```text
MGBOS read capabilities
business commands
evidence
events
approved tools
```

Mereka tidak berbagi authority secara otomatis.

```text
Engineer dapat mengubah source code payment
≠
Engineer boleh mencatat pembayaran nyata

JARVIS CFO dapat menganalisis pembayaran
≠
JARVIS CFO boleh mengubah repository
```

---

# 3. Engineering Control Plane

MGBOS menggunakan lima role utama.

| Role                    | Fungsi utama                                             | Mutation authority          |
| ----------------------- | -------------------------------------------------------- | --------------------------- |
| **Planner / Architect** | Memahami requirement dan membuat implementation contract | Tidak mengubah runtime code |
| **Engineer**            | Implementasi perubahan                                   | Branch/worktree terisolasi  |
| **Auditor**             | Independent assurance terhadap perubahan                 | Read-only secara default    |
| **QA / Verifier**       | Membuktikan behavior dan acceptance criteria             | Test artifacts saja         |
| **Release Operator**    | Menilai dan menjalankan release yang telah diotorisasi   | Release-specific authority  |

Flow:

```text
Business Need
     ↓
Planner
     ↓
Implementation Contract
     ↓
Engineer
     ↓
Implementation
     ↓
Auditor
     ↓
QA
     ↓
Release Operator
     ↓
Rizky
     ↓
Release
```

Untuk perubahan kecil, beberapa langkah dapat dipersingkat.

Untuk perubahan money, authorization, state transition, database, atau external side effect, workflow tidak boleh dipangkas tanpa alasan eksplisit.

---

# 4. Expert Layer

Expert bukan agent independen.

Expert adalah capability knowledge yang dapat dimuat oleh role sesuai kebutuhan.

Struktur:

```text
ROLE
 │
 └── EXPERTISE
      │
      └── SKILLS
```

Contoh:

```text
Engineer
├── Backend Expert
├── Database Expert
├── Frontend Expert
└── Integration Expert

Auditor
├── Financial Integrity Expert
├── Authorization Expert
├── Security Expert
└── Business Integrity Expert
```

---

# 5. Expert Registry

## EXP-001 — System & Business Architect

**Class:** Core  
**Primary Role:** Planner  
**Secondary Role:** Auditor

**Mission**

Menerjemahkan kebutuhan bisnis menjadi capability MGBOS terkecil yang benar tanpa over-engineering.

**Owns reasoning around**

```text
system boundaries
domain boundaries
aggregate ownership
cross-domain dependencies
canonical architecture
ADR requirements
business → system mapping
technical debt vs necessary complexity
```

**Triggered when**

```text
new domain
new aggregate
major architecture change
cross-system integration
canonical conflict
large refactor
MGBOS ↔ JARVIS boundary
```

**Must prevent**

```text
premature microservices
duplicate source of truth
unnecessary entity creation
architecture by framework convenience
business policy hidden in UI
```

---

## EXP-002 — MGBOS Domain / ERP Expert

**Class:** Core  
**Primary Role:** Planner / Engineer / Auditor

**Mission**

Menjaga model bisnis MGBOS tetap konsisten antar-domain.

**Expert domains**

```text
Lead
Requirement
Quote
Order
Invoice
Payment
Production
Production Assignment
Vendor
QC
Shipment
Inventory
Procurement
Cost / Margin
```

**Core concerns**

```text
state-machine correctness
business invariants
historical snapshots
cross-domain coordination
Cost Trilogy
shipping pass-through
document identity
business lifecycle separation
```

**Must prevent**

```text
paid invoice = shipped order
UI status becoming source of truth
estimated cost replacing actual cost
cross-domain state collapse
```

---

## EXP-003 — Backend & Command Engineering Expert

**Class:** Core  
**Primary Role:** Engineer

**Mission**

Membangun authoritative application mutation surface.

**Scope**

```text
Next.js server actions
application services
RPC boundaries
validation
authorization
business commands
idempotency
error handling
transaction orchestration
```

Target mutation pattern:

```text
UI / API / Automation
       ↓
Server Boundary
       ↓
Authentication
       ↓
Authorization
       ↓
Validation
       ↓
Business Command
       ↓
Database Transaction
       ↓
Audit / Event
```

**Must prevent**

```text
frontend → arbitrary database mutation
service_role = business permission
duplicate side effects
client supplied organization authority
```

---

## EXP-004 — PostgreSQL / Supabase Transaction Expert

**Class:** Core  
**Primary Role:** Engineer  
**Critical Reviewer:** Auditor

**Mission**

Menjamin PostgreSQL tetap menjadi authoritative transactional system.

**Scope**

```text
PostgreSQL
Supabase
schema design
constraints
RLS
grants
SECURITY DEFINER
transactions
locking
concurrency
migration
pgTAP
generated DB types
```

**Special responsibility**

```text
money integrity
atomic transaction
cross-org isolation
race conditions
document sequence safety
inventory integrity
payment allocation integrity
```

**Migration law**

```text
applied migration
=
immutable history

schema correction
=
new forward migration
```

---

## EXP-005 — Authorization, IAM & Capability Expert

**Class:** Strategic Core  
**Primary Role:** Planner / Engineer  
**Critical Reviewer:** Auditor

**Mission**

Mengembangkan authorization MGBOS dari role-based model menuju bounded capability architecture tanpa merusak RBAC yang sudah bekerja.

Target evolution:

```text
Human / Service Principal
        ↓
Organization Scope
        ↓
Role / Service Identity
        ↓
Capability
        ↓
Risk
        ↓
Approval Policy
        ↓
Business Command
        ↓
Invariant Validation
```

**Owns**

```text
RBAC
capability registry
service principals
JARVIS identity
n8n identity
delegation
approval
revocation
brand scope
read scope
permission audit
```

**Critical principle**

```text
has credential
≠
has authority
```

dan:

```text
Rizky owns business
≠
AI acting for Rizky automatically becomes OWNER
```

---

## EXP-006 — Financial Integrity Expert

**Class:** Critical  
**Primary Role:** Auditor  
**Implementation Role:** Engineer

**Mission**

Melindungi financial truth.

**Scope**

```text
integer Rupiah
invoice
payment
payment allocation
ledger
refund
cost
margin
shipping pass-through
Cost Trilogy
financial snapshot
```

**Mandatory checks**

```text
precision
double posting
idempotency
over-allocation
refund consistency
historical immutability
reconciliation
shipping exclusion
concurrency
```

Perubahan pada:

```text
payment
invoice
ledger
revenue
cost
margin
```

otomatis membutuhkan expertise ini.

---

## EXP-007 — Security & Trust Boundary Expert

**Class:** Critical  
**Primary Role:** Auditor  
**Implementation Role:** Engineer

**Mission**

Menjaga boundary antara trusted authority dan untrusted input.

**Scope**

```text
OWASP
session security
tenant isolation
secret management
service credentials
RLS
privileged RPC
input validation
prompt injection
dependency risk
public/private environment
test data governance
```

Trust model:

```text
Browser
Email
WhatsApp
PDF
AI Output
External API
Webhook
GitHub Issue
Uploaded Document

=
UNTRUSTED DATA
```

sampai diverifikasi oleh boundary yang sesuai.

---

## EXP-008 — Frontend Product Engineering Expert

**Class:** Core Product  
**Primary Role:** Engineer

**Mission**

Membangun frontend Next.js yang merepresentasikan authoritative business state secara benar.

**Scope**

```text
Next.js
React
server/client boundary
form architecture
state presentation
error states
loading
navigation
accessibility
responsive behavior
performance
```

Frontend tidak boleh menjadi pemilik business rules.

```text
button disabled
≠
authorization

hidden UI
≠
security
```

---

## EXP-009 — Product UX & Operator Workflow Expert

**Class:** Product  
**Primary Role:** Planner / Engineer / QA

**Mission**

Mengurangi founder/operator cognitive load.

Focus:

```text
workflow continuity
next-action discoverability
information hierarchy
error prevention
exception handling
operator context
decision friction
```

North-star question:

```text
Apakah operator harus menjadi middleware manusia
untuk menyambungkan dua bagian sistem?
```

Jika iya, UX/workflow belum selesai.

---

## EXP-010 — QA & Reliability Engineering Expert

**Class:** Core Assurance  
**Primary Role:** QA

**Mission**

Membuktikan behavior, bukan sekadar membuat test hijau.

**Testing dimensions**

```text
happy path
negative path
permission denial
cross-org attempt
illegal state
boundary money
duplicate request
lost response
rollback
concurrency
partial failure
recovery
```

Evidence states harus dipisahkan:

```text
TEST_DEFINED
LOCALLY_VERIFIED
HOSTED_CI_VERIFIED
DEPLOYED
OPERATIONALLY_ACCEPTED
```

---

## EXP-011 — Independent Business Integrity Auditor

**Class:** Critical Assurance  
**Primary Role:** Auditor

**Mission**

Memberikan independent assurance terhadap exact revision.

Audit path:

```text
Requirement
   ↓
Implementation Contract
   ↓
Canonical Sources
   ↓
Actual Diff
   ↓
Business Invariants
   ↓
Security / Finance / State
   ↓
Tests
   ↓
Evidence
```

Output minimal:

```text
revision
risk class
review coverage
findings
severity
evidence
residual risk
release blocker
```

Auditor tidak memperbaiki code ketika sedang melakukan independent review.

Fix menghasilkan revision baru yang harus direview ulang.

---

# 6. Phase 2 Specialist Experts

Expert berikut tidak perlu menjadi permanent runtime role.

Mereka diaktifkan berdasarkan roadmap.

---

## EXP-012 — Operational Exception Expert

**Priority:** P1

**Mission**

Membangun sistem yang memahami business abnormality.

Examples:

```text
vendor rejection
vendor delay
machine downtime
rush order
QC failure
partial defect
rework
late shipment
payment overdue
inventory shortage
supplier failure
```

Exception bukan state machine baru untuk semua hal.

Exception adalah:

```text
abnormal condition
+
business impact
+
owner
+
priority
+
next action
+
resolution
```

Target:

> Founder tidak mencari masalah. Sistem membawa masalah ke founder.

---

## EXP-013 — Founder Decision Intelligence / Read Model Expert

**Priority:** P1

**Mission**

Mengubah operational truth menjadi founder attention.

Example projections:

```text
Sales Attention
Quote Attention
Payment Attention
Production Attention
Vendor Attention
Shipment Attention
Margin Attention
Inventory Attention
```

Target output:

```text
3 hal butuh perhatian
```

bukan:

```text
47 dashboard widgets
```

Expert ini nantinya menjadi jembatan utama antara MGBOS dan JARVIS.

---

## EXP-014 — Vendor Capability & SLA Expert

**Priority:** P1

**Mission**

Mengembangkan vendor dari sekadar master data menjadi operational partner intelligence.

Scope:

```text
capabilities
machine/process capability
capacity
lead time
rate card
quality history
acceptance speed
on-time performance
downtime
SLA
historical performance
```

---

## EXP-015 — Customer Case & Service Recovery Expert

**Priority:** P1

**Mission**

Menangani lifecycle setelah delivery ketika bisnis tidak selesai dengan shipment.

Scope:

```text
complaint
defect claim
reprint
refund request
investigation
customer communication
resolution
customer satisfaction
```

---

# 7. Automation & Integration Experts

## EXP-016 — Integration Reliability & Eventing Expert

**Priority:** P2

**Mission**

Membangun reliable boundary untuk external systems.

Scope:

```text
transactional outbox
event envelope
event versioning
webhook verification
idempotency
deduplication
retry
unknown outcome
reconciliation
dead-letter handling
external provider adapter
```

Principle:

```text
external action returned success
≠
business outcome verified
```

Required pattern:

```text
EXECUTE
 ↓
VERIFY
 ↓
RECORD EVIDENCE
```

---

## EXP-017 — Workflow Automation / n8n Expert

**Priority:** P2

**Mission**

Mengotomatisasi deterministic orchestration.

Suitable:

```text
schedule
routing
reminder
follow-up
notification
provider coordination
retry
workflow wait
```

Not suitable as owner of:

```text
orders
payments
inventory
production truth
```

n8n orchestrates.

MGBOS owns business state.

---

# 8. AI & JARVIS Experts

## EXP-018 — AI Systems / AI Builder Expert

**Priority:** P2/P3

**Mission**

Membangun provider-neutral AI capabilities tanpa menjadikan AI sebagai business authority.

Scope:

```text
model gateway
structured output
OCR
classification
information extraction
tool calling
context management
model routing
prompt injection resistance
AI evaluation
provider abstraction
```

AI flow:

```text
UNTRUSTED INPUT
      ↓
AI INTERPRETATION
      ↓
STRUCTURED PROPOSAL
      ↓
VALIDATION
      ↓
POLICY
      ↓
AUTHORIZED COMMAND
```

Bukan:

```text
AI
 ↓
Database
```

---

## EXP-019 — JARVIS Runtime Architect

**Priority:** P3

**Mission**

Membangun intelligence runtime terpisah dari MGBOS.

Canonical conceptual flow:

```text
Intent
 ↓
Context
 ↓
Planning
 ↓
Policy
 ↓
Capability
 ↓
Execution
 ↓
Verification
 ↓
Evidence
 ↓
Synthesis
```

Initial JARVIS should remain:

```text
READ
ANALYZE
RECOMMEND
DRAFT
```

sebelum mutation authority diberikan.

---

## EXP-020 — Agent Evaluation & AI Governance Expert

**Priority:** P3

**Mission**

Membuktikan agent berperilaku sesuai kontrak.

Scope:

```text
behavior eval
tool-use eval
prompt injection eval
authority eval
regression eval
adversarial cases
model/runtime comparison
evidence capture
autonomy promotion
```

Agent tidak dinilai berdasarkan:

```text
"jawabannya kelihatan bagus"
```

tetapi:

```text
observable behavior
+
tool actions
+
criteria
+
forbidden behavior
```

---

# 9. Platform, Release & Operations

## EXP-021 — Platform / SRE / Recovery Expert

**Class:** Pre-Production Critical  
**Primary Role:** Release Operator / Engineer

**Mission**

Mengubah MGBOS dari software yang teruji menjadi layanan yang dapat dioperasikan.

Owns:

```text
development isolation
staging
production
deployment
secret management
observability
monitoring
alerts
backup
retention
restore
RPO
RTO
rollback
incident response
capacity
dependency operations
```

Production readiness membutuhkan:

```text
CODE READY
+
CI READY
+
ENVIRONMENT READY
+
RECOVERY READY
+
OBSERVABILITY READY
+
OPERATIONALLY ACCEPTED
```

---

# 10. Expertise Activation Matrix

| Change             | Mandatory expertise                             |
| ------------------ | ----------------------------------------------- |
| UI visual only     | Frontend + UX + QA                              |
| New server action  | Backend + Domain + QA                           |
| Order lifecycle    | Domain + Backend + DB + Auditor + QA            |
| Payment            | Finance + Backend + DB + Auth + Auditor + QA    |
| Migration          | Database + Domain + Auditor + QA                |
| Permission         | IAM + Security + Backend + Auditor              |
| Inventory          | Domain + DB + Reliability                       |
| Vendor assignment  | Domain + Vendor Ops + DB                        |
| n8n integration    | Integration + Automation + Security             |
| AI OCR             | AI Builder + Security + Domain                  |
| JARVIS read tool   | JARVIS + IAM + Domain + AI Governance           |
| JARVIS mutation    | JARVIS + IAM + Domain + Security + Auditor + QA |
| Production release | SRE + Release Operator + Auditor + QA           |

---

# 11. Risk → Review Routing

```text
R0
Docs / wording
→ Planner or Engineer
→ focused checks

R1
UI / low-risk application
→ Engineer
→ QA

R2
API / business behavior
→ Planner
→ Engineer
→ QA

R3
Database / migration / operational data
→ Planner
→ Engineer
→ Database Expert
→ Auditor
→ QA

R4
Authorization / inventory / lifecycle
→ Planner
→ Engineer
→ Business Integrity Auditor
→ Security/IAM
→ QA

R5
Payment / Ledger / Financial Truth
→ Planner
→ Engineer
→ Finance Expert
→ Database Expert
→ Authorization Expert
→ Independent Auditor
→ QA
→ Rizky
```

Risk class mengikuti consequence, bukan jumlah file.

---

# 12. Runtime Mapping

Tools/model tidak menentukan role permanen.

Recommended mapping:

```text
CODEX
Primary:
Engineer
Planner

CLAUDE CODE
Primary:
Auditor
Architecture Critic
Debug Reviewer

ANTIGRAVITY
Primary:
Engineer orchestration
isolated implementation worktree
parallel bounded tasks

HERMES
Primary:
Engineering Supervisor
Repository Health
Architecture Drift
Skill/Eval Maintenance
CI / Issue monitoring
```

Mapping ini bukan exclusive.

Yang penting:

```text
ROLE CONTRACT
>
MODEL BRAND
```

---

# 13. One Writer Rule

Parallel agent development menggunakan:

```text
ONE WRITER
=
ONE BRANCH
=
ONE WORKTREE
=
ONE BOUNDED SCOPE
```

Tidak:

```text
Codex
+
Claude
+
Antigravity

editing same mutable checkout
```

Parallelism dilakukan berdasarkan bounded work package.

Contoh:

```text
worktree A
Operational Exception schema

worktree B
Founder Attention read-model research

worktree C
independent audit
```

Integrasi tetap melalui reviewed Git changes.

---

# 14. Expert Handoff Contract

Setiap handoff engineering minimal membawa:

```text
FROM_ROLE
TO_ROLE

objective
scope

base revision
head revision

risk class

canonical sources

files changed

business invariants

tests run

tests not run

known failures

open questions

residual risk

allowed next action
```

Tidak boleh ada handoff:

```text
"Udah beres, lanjut ya."
```

tanpa evidence.

---

# 15. Independent Assurance Standard

Untuk high-risk change:

```text
IMPLEMENTER
≠
INDEPENDENT AUDITOR
```

Jika runtime yang sama melakukan kedua role:

```text
SELF REVIEW
```

bukan:

```text
INDEPENDENT REVIEW
```

Audit artifact harus terikat ke:

```text
exact HEAD SHA
```

Perubahan setelah audit membatalkan assurance untuk area terdampak.

---

# 16. Expert Output Contracts

Planner menghasilkan:

```text
IMPLEMENTATION CONTRACT
```

Engineer menghasilkan:

```text
IMPLEMENTATION
+
ENGINEERING REPORT
```

Auditor menghasilkan:

```text
ASSURANCE REPORT
```

QA menghasilkan:

```text
VERIFICATION MATRIX
```

Release Operator menghasilkan:

```text
RELEASE PACKET
```

Rizky menghasilkan keputusan:

```text
APPROVE
REJECT
DEFER
REQUEST CHANGE
```

---

# 17. Expert Registry Machine Shape

Target registry nantinya dapat direpresentasikan seperti:

```yaml
id: EXP-006

name: financial-integrity

class: critical

allowed_roles:
  - planner
  - engineer
  - auditor

primary_role: auditor

activation:
  any_of:
    - payment
    - invoice
    - ledger
    - cost
    - margin
    - refund

canonical_sources:
  - business-invariants
  - canonical-data-model
  - command-event-model

required_checks:
  - integer-money
  - allocation-integrity
  - idempotency
  - concurrency
  - historical-integrity

forbidden:
  - floating-authoritative-money
  - direct-ledger-edit
  - unverifiable-financial-side-effect

outputs:
  - financial-integrity-review
```

Registry tersebut nantinya dapat digunakan oleh:

```text
Codex
Antigravity
Claude Code
Hermes
future orchestrator
CI validator
JARVIS engineering supervisor
```

tanpa menyalin rules untuk setiap provider.

---

# 18. Recommended Directory Evolution

```text
.agents/
│
├── roles/
│   ├── planner.md
│   ├── engineer.md
│   ├── auditor.md
│   ├── qa.md
│   └── release-operator.md
│
├── expertise/
│   ├── registry.yaml
│   ├── system-architecture.md
│   ├── mgbos-domain.md
│   ├── backend-command.md
│   ├── postgres-transaction.md
│   ├── authorization-capability.md
│   ├── financial-integrity.md
│   ├── security.md
│   ├── frontend.md
│   ├── product-ux.md
│   ├── operational-exception.md
│   ├── decision-intelligence.md
│   ├── integration-eventing.md
│   ├── ai-systems.md
│   └── platform-sre.md
│
├── skills/
│   └── existing reusable procedural skills
│
└── evals/
    ├── routing/
    ├── finance/
    ├── authorization/
    ├── database/
    ├── security/
    ├── agent-behavior/
    └── release/
```

`expertise/` tidak menggantikan `skills/`.

Perbedaannya:

```text
Expertise
=
what must be understood

Skill
=
how a repeatable task is performed
```

---

# 19. Current Build Priority

Dengan Phase 1 Operating Spine selesai, organizational capability sebaiknya dibangun mengikuti urutan:

```text
NOW

Authorization / Capability
Independent Assurance
Platform / SRE readiness
Operational Exception
Founder Attention Read Models

        ↓

NEXT

Customer Case
Vendor Capability / SLA
Integration Reliability
Deterministic Automation

        ↓

THEN

JARVIS Lite
AI Business Intelligence
Agent Evaluation
Capability-based AI mutation

        ↓

LATER

Higher autonomy
Specialist business agents
```

---

# 20. Team v1

Secara sederhana, “tim” MGBOS bukan 20 agent.

Tim virtual utamanya:

```text
RIZKY
Founder / Final Authority

│
├── Planner / Architect
│
├── Engineer
│
├── Independent Auditor
│
├── QA / Verifier
│
└── Release Operator
```

Di belakang lima role tersebut tersedia specialist expertise:

```text
Architecture
ERP / Domain
Backend
Database
Authorization
Finance
Security
Frontend
UX
QA
Exception Management
Decision Intelligence
Vendor Operations
Customer Case
Integration
Automation
AI Systems
JARVIS Architecture
Agent Evaluation
Platform / SRE
```

Ini membuat sistem dapat berkembang tanpa membuat:

```text
20 agents
20 competing memories
20 overlapping instructions
20 different opinions
20 different permissions
```

---

# 21. Final Operating Principle

Target organisasi bukan:

> membuat sebanyak mungkin AI expert.

Targetnya:

> **membuat sedikit role dengan authority yang sangat jelas, lalu memberi mereka expertise yang tepat sesuai masalah yang sedang dikerjakan.**

Dengan model ini:

```text
Rizky
tidak perlu menjadi developer

Rizky
tidak perlu menjadi QA

Rizky
tidak perlu memahami PostgreSQL

Rizky
tidak perlu memahami CI

Rizky
tidak perlu menjadi system architect
```

tetapi Rizky tetap memegang:

```text
business intent
priority
risk appetite
exception approval
final decision
```

Engineering organization mengurus:

```text
HOW
```

MGBOS menjaga:

```text
TRUTH
```

JARVIS nantinya membantu:

```text
UNDERSTAND
DECIDE
COORDINATE
```

dan manusia tetap memegang ultimate accountability.

---

# 22. North Star

```text
Business intent
      ↓
Expert reasoning
      ↓
Governed engineering
      ↓
Verified system
      ↓
Authoritative MGBOS
      ↓
Trusted business intelligence
      ↓
Founder-by-exception
```

**MGBOS Expert Registry bukan katalog persona.**

Ia adalah mekanisme untuk memastikan:

> **setiap masalah diberikan kepada expertise yang tepat, melalui role yang tepat, dengan authority yang tepat, dan dibuktikan dengan evidence yang tepat.**
