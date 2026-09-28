Sudah gue bedah repo `Rizkybuilds/bisnishub` lewat @GitHub sekaligus membandingkan struktur MGBOS dengan praktik terbaru Codex, Google Antigravity, Hermes Agent, dan Claude Code per September 2026.

Kesimpulan utamanya: **MGBOS sudah melewati fase “setup project biasa”.** Yang dibutuhkan sekarang bukan menambah banyak agent secara acak, tetapi membangun **MGBOS Engineering Control Plane**: aturan kerja, role agent, reusable skills, permission boundary, worktree isolation, quality gate, CI, audit, dan release process yang sama terlepas agent mana yang mengerjakan kode.

## 1. Kondisi MGBOS sekarang

Fondasinya sebenarnya sudah cukup kuat.

| Area | Kondisi saat ini | Penilaian |
|---|---|---|
| Arsitektur | Modular monolith + pnpm monorepo | ✅ Tepat |
| Frontend | Next.js, app MGBOS + TeeStock | ✅ |
| Domain | `packages/domain` pure TypeScript | ✅ Sangat bagus |
| Database | PostgreSQL/Supabase | ✅ |
| Validation | package khusus validation | ✅ |
| Auth | package boundary sendiri | ✅ |
| AI | package boundary sudah disiapkan | ✅ |
| Events | package khusus events | ✅ |
| Integrations | dipisahkan | ✅ |
| Database testing | pgTAP | ✅ |
| Unit testing | Vitest | ✅ |
| Business E2E | `verify-e2e-flow.mjs` | ✅ |
| CI | `MGBOS Foundation` | ✅ |
| ADR | Sudah ada 14 ADR | ✅ |
| Engineering reports | MGBOS-001 sampai MGBOS-020 | ✅ |
| Agent skills | ±39 project skills | ✅ tetapi perlu governance |
| Branch protection | **OFF** | 🔴 P0 |
| Staging environment | belum terbukti | 🔴 |
| Automated backup | belum terbukti | 🔴 |
| Restore drill | belum terbukti | 🔴 |
| Monitoring ownership | belum terbukti | 🟠 |
| Runtime agent roles | belum ada sistem baku | 🟠 |

Yang paling menarik: `mgbos/AGENTS.md` sudah memiliki prinsip yang tepat untuk ERP serius: mutation wajib lewat command boundary, AI tidak menjadi sumber kebenaran, uang integer rupiah, snapshot transaksi immutable, state machine terpisah, database sebagai system of record, transactional outbox, dan n8n hanya orchestration.

[MGBOS engineering rules](https://github.com/Rizkybuilds/bisnishub/blob/main/mgbos/AGENTS.md?utm_source=chatgpt.com)  
[MGBOS architecture constitution](https://github.com/Rizkybuilds/bisnishub/blob/main/mgbos/docs/architecture/README.md?utm_source=chatgpt.com)

Bahkan MGBOS-020 sudah mencatat flow retail/POS, inventory reservation, invoice, payment, ledger, 223 Vitest tests, 379 pgTAP assertions, dan business E2E. Jadi secara software, proyeknya sudah lumayan serius.

Yang perlu dibereskan justru **cara agent mengembangkan software ini ke depan**.

---

# 2. Masalah terbesar yang gue temukan: `main` belum dilindungi

Ini prioritas nomor satu.

Dari GitHub saat ini:

```text
main
└── protected: false
```

Padahal HEAD `f4cc36b57345e4c35355487649d77b3559f74093` sudah berhasil menjalankan:

```text
MGBOS Foundation
├── application ✅
└── database    ✅
```

pada **26 September 2026**.

[Current successful MGBOS Foundation run](https://github.com/Rizkybuilds/bisnishub/actions/runs/36216582167?utm_source=chatgpt.com)

Artinya CI-nya bagus, tetapi secara governance:

> agent masih secara teknis bisa memasukkan kode ke `main` tanpa menjadikan CI sebagai mandatory gate.

Dengan Codex saja ini sudah berisiko. Dengan Codex + Antigravity + Claude Code + Hermes nanti, risikonya naik drastis.

Jadi prinsip pertama lingkungan baru:

> **Tidak ada AI coding agent yang menulis langsung ke `main`.**

---

# 3. Arsitektur yang gue sarankan: MGBOS Engineering Control Plane

Bayangkan sistemnya seperti ini:

```text
                         RIZKY
                    Product / Owner
                         │
                         ▼
                ┌────────────────┐
                │   ORCHESTRATOR │
                │    / PLANNER   │
                └───────┬────────┘
                        │ Change Contract
                        ▼
              ┌─────────────────────┐
              │   IMPLEMENTER       │
              │ Engineer / Builder  │
              └─────────┬───────────┘
                        │
                  isolated worktree
                        │
                        ▼
                     CODE
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
   AUDITOR          QA AGENT       SECURITY/DB
   REVIEWER         VERIFIER        SPECIALIST
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                  QUALITY GATES
                        │
               GitHub Actions CI
                        │
                        ▼
                  PULL REQUEST
                        │
                  HUMAN DECISION
                        │
                        ▼
                      MAIN
                        │
                        ▼
                RELEASE OPERATOR
                        │
                 STAGING → PROD
```

Agent bukan pengambil keputusan bisnis.

**Rizky → Planner → Engineer → independent validation → CI → Rizky → Release.**

---

# 4. Jangan buat 15 agent permanen

Ini jebakan yang sering terjadi saat membangun agentic development environment.

Repo lo sudah memiliki banyak specialist skill:

- `integrated-erp-engine`
- `supabase-architect`
- `api-backend-engineer`
- `web-qa-testing`
- `web-sec-perf`
- `git-deploy-ops`
- `fullstack-web-dev`
- `design-system`
- `21st-ui-*`
- dan lain-lain.

Jadi jangan mengubah setiap skill menjadi agent.

**Skill = keahlian.  
Agent = pekerja dengan responsibility + permission.**

Gue cuma akan membuat **5 runtime role**.

| Runtime Agent | Fungsi | Write? | Merge? | Production? |
|---|---|---:|---:|---:|
| **Planner / Architect** | analisis scope & dependency | ❌ | ❌ | ❌ |
| **Engineer / Implementer** | implementasi | ✅ worktree | ❌ | ❌ |
| **Auditor / Reviewer** | review independen | ❌ default | ❌ | ❌ |
| **QA / Verifier** | test & verifikasi evidence | test only | ❌ | ❌ |
| **Release Operator** | release/recovery | ❌ feature | ✅ controlled | explicit only |

Semua spesialisasi lain masuk sebagai **Skills yang dimuat sesuai kebutuhan**.

Ini juga mengikuti arah modern coding agents: OpenAI sekarang menyarankan tidak membebani `AGENTS.md` dengan terlalu banyak scaffolding; skill yang spesifik jauh lebih cocok untuk workflow tertentu. :chatgpt-content-reference{index="3"}

---

# 5. Agent pertama: MGBOS Planner / Architect

Ini **read-only agent**.

Dia tidak boleh coding.

Misalnya lo bilang:

> "Tambahkan fitur refund sebagian."

Planner harus membaca:

```text
AGENTS.md
mgbos/AGENTS.md

architecture/
ADR terkait

domain/payment
domain/invoice
domain/ledger

validation/

Supabase migrations terkait

pgTAP tests

engineering reports
```

Lalu menghasilkan sesuatu yang gue sebut:

## Implementation Contract

Formatnya kurang lebih:

```text
MGBOS CHANGE CONTRACT

Objective
Business Context

Affected Domain
Affected Apps
Affected Packages

Canonical Sources

Business Invariants

Current State
Target State

State Machine Changes

Database Changes
Migration Required?

Authorization Requirements

Financial Effects

Inventory Effects

Events / Outbox

Idempotency Strategy

Concurrency Risks

Failure Atomicity

Tests Required

Rollback Strategy

Risk Level

Required Reviewers
```

Baru Engineer boleh mulai coding.

Ini akan sangat mengurangi fenomena:

> "Agent ngerti permintaan, langsung coding, tetapi secara arsitektur ternyata salah."

---

# 6. Agent kedua: Engineer / Implementer

Engineer adalah agent yang paling sering dipakai.

Tetapi satu rule penting:

> **1 writer = 1 branch = 1 worktree.**

Contoh:

```text
main
 │
 ├── agent/MGBOS-021-refund
 │     └── worktree A → Codex
 │
 ├── agent/MGBOS-022-vendor-score
 │     └── worktree B → Antigravity
 │
 └── agent/MGBOS-023-stock-alert
       └── worktree C → Claude
```

Agent A tidak menyentuh worktree B.

Agent B tidak menyentuh worktree A.

Antigravity 2.0 sekarang memang mendukung Git worktree secara native agar beberapa agent bisa bekerja dalam folder terisolasi. :chatgpt-content-reference{index="4"}

Ini sangat cocok untuk MGBOS.

---

# 7. Agent ketiga: Business Integrity Auditor

Ini menurut gue agent paling penting setelah Engineer.

MGBOS bukan landing page.

Ini ERP.

Bug seperti:

```text
button margin salah
```

tidak sama risikonya dengan:

```text
payment tercatat dua kali

stok minus

invoice salah nominal

cross-tenant data leak

order state lompat

ongkir dihitung sebagai revenue

AI mengubah ledger

double payment webhook

quote lama berubah

purchase order tidak atomic
```

Auditor harus **independen dari Engineer**.

Checklist utamanya:

| Area | Auditor memeriksa |
|---|---|
| Money | integer rupiah, overflow, rounding |
| Revenue | shipping pass-through isolation |
| State machine | hanya transition legal |
| History | snapshot immutable |
| Auth | actor benar |
| Tenant | organization isolation |
| Brand | active brand boundary |
| Database | grants + RLS + function auth |
| Atomicity | transaksi gagal → semuanya rollback |
| Idempotency | retry tidak duplicate |
| Concurrency | race condition |
| Inventory | reserve/consume benar |
| Payment | allocation benar |
| Ledger | debit/credit/event benar |
| Event | outbox dalam transaksi |
| AI | tidak direct mutation |

Auditor harus bisa mengembalikan:

```text
BLOCKER
HIGH
MEDIUM
LOW
INFO
```

tetapi **tidak langsung memperbaiki code** kecuali secara eksplisit disuruh.

Sehingga tidak terjadi:

```text
Engineer:
"kode saya bagus"

Engineer yang sama sebagai reviewer:
"iya kode saya bagus"
```

---

# 8. Agent keempat: QA / Verifier

Lo sebenarnya sudah punya skill bagus:

```text
.agents/skills/web-qa-testing/
```

Gue tidak akan membuat skill QA baru yang overlapping.

Runtime QA Agent cukup **memakai skill tersebut**.

QA menentukan testing berdasarkan risk.

Contoh untuk update landing page:

```text
lint
typecheck
unit
build
browser smoke
```

Tapi untuk:

```text
app.allocate_payment()
```

QA harus memeriksa:

```text
authorization
cross-org isolation
invalid amount
zero amount
overpayment
duplicate request
parallel request
rollback
ledger effect
invoice effect
outbox
database tests
application boundary
```

Ini sudah sejalan dengan prinsip QA yang ada di repo.

---

# 9. Agent kelima: Release Operator

Agent ini **tidak aktif sehari-hari**.

Dia dipakai cuma untuk:

```text
merge
release
deployment
database rollout
rollback
recovery
```

Permission-nya jauh lebih tinggi.

Karena itu tidak boleh menjadi agent yang sama dengan Engineer.

Idealnya:

```text
Engineer
   ↓
PR
   ↓
CI
   ↓
Auditor
   ↓
QA
   ↓
Rizky approves
   ↓
Release Operator
```

Bukan:

```text
AI coding
↓
git push main
↓
vercel production
```

---

# 10. Skill architecture yang gue sarankan

Yang menarik, struktur repo lo `.agents/skills/` justru sudah sangat future-proof.

Codex mendukung Agent Skills berbasis `SKILL.md`. :chatgpt-content-reference{index="5"}

Antigravity juga menggunakan Agent Skills standar dan secara default mencari `.agents/skills`. :chatgpt-content-reference{index="6"}

Hermes bahkan secara eksplisit mendeteksi:

```text
<project>/.hermes/skills
<project>/.agents/skills
```

dan project skills memiliki precedence tertinggi setelah repo dipercaya. :chatgpt-content-reference{index="7"}

Ini berarti:

> **`.agents/skills` bisa dijadikan canonical cross-agent skill library MGBOS.**

Jangan bikin:

```text
.codex/skills/
.claude/skills/
.hermes/skills/
.antigravity/skills/
```

yang semuanya copy-paste.

Nanti drift.

---

# 11. Tiga Skill baru yang menurut gue benar-benar dibutuhkan

Bukan 20. Cuma tiga.

### `mgbos-change-planner`

Dipakai Planner.

Output:

```text
scope
canonical sources
dependency
affected modules
business invariants
DB changes
state changes
authorization
events
tests
risk
rollback
review requirements
```

### `mgbos-business-integrity-auditor`

Dipakai Auditor.

Fokus:

```text
money
state machines
snapshot
tenant isolation
authorization
database integrity
atomicity
idempotency
concurrency
inventory
payment
ledger
outbox
AI boundary
```

### `mgbos-pr-reviewer`

Fokus membandingkan:

```text
Issue
   ↓
Implementation Contract
   ↓
Diff
   ↓
Tests
   ↓
Evidence
```

Dan mencari:

```text
scope creep
untested behavior
hidden schema changes
missing migration
migration rewrite
missing auth
missing documentation
unsubstantiated test claim
```

Skill yang sudah ada sebaiknya tetap digunakan, bukan dibuat ulang.

---

# 12. Ada 3 existing Skill yang justru harus dibenahi

Dari audit repo gue menemukan backlog penting.

## `ai-automation-engine`

Saat ini masih memiliki contoh seperti:

```text
ts_ledger_entries
ts_inventory
pending_review
Gemini-specific workflow
confidence > 90% → auto record
```

Itu warisan architecture lama.

Untuk MGBOS prinsipnya harus diubah menjadi:

```text
AI
↓
Structured Proposal
↓
Validation
↓
Business Command
↓
Authorization
↓
Transaction
↓
DB
```

bukan:

```text
AI
↓
Database
```

---

## `ai-copilot-builder`

Masih ada asumsi legacy seperti:

```text
pending_payment
dtf
press
pack
```

Padahal arsitektur MGBOS sudah memisahkan:

```text
Commercial State
Financial State
Production State
QC State
Fulfillment State
```

Copilot juga seharusnya:

```text
Read tools      → default allowed

Simulation      → allowed

Draft command   → allowed

Mutation
    ↓
typed business command
    ↓
authorization
    ↓
explicit confirmation
```

---

## `web-sec-perf`

Skill ini masih terlalu terikat contoh legacy Vite/Midtrans.

Perlu dibuat aware terhadap:

```text
Next.js
Server Actions
Supabase SSR
RLS
RPC grants
CSP
server-only environment
tenant isolation
command authorization
```

---

# 13. Struktur repo agent yang gue sarankan

Kira-kira:

```text
bisnishub/
│
├── AGENTS.md
│
├── .agents/
│   │
│   ├── skills/
│   │   ├── mgbos-change-planner/
│   │   ├── mgbos-business-integrity-auditor/
│   │   ├── mgbos-pr-reviewer/
│   │   │
│   │   ├── integrated-erp-engine/
│   │   ├── supabase-architect/
│   │   ├── api-backend-engineer/
│   │   ├── web-qa-testing/
│   │   ├── git-deploy-ops/
│   │   └── ...
│   │
│   ├── evals/
│   │   ├── routing/
│   │   ├── business-integrity/
│   │   ├── safety/
│   │   └── regression/
│   │
│   └── rules/
│       └── optional-antigravity-rules
│
├── mgbos/
│   ├── AGENTS.md
│   │
│   └── docs/
│       └── engineering/
│           └── agent-system/
│               ├── README.md
│               ├── workflow.md
│               ├── roles.md
│               ├── permission-matrix.md
│               ├── risk-classification.md
│               ├── evidence-model.md
│               └── release-gates.md
```

Catatan penting: `roles/` atau dokumentasi tersebut adalah **canonical role specification**, bukan otomatis diasumsikan sebagai format runtime sebuah vendor.

Adapter Codex/Claude/Antigravity/Hermes dibuat tipis sesuai kemampuan masing-masing.

---

# 14. Workflow development MGBOS yang gue rekomendasikan

Ini menjadi workflow baku untuk feature development:

1. **Issue dibuat** memakai template MGBOS yang sudah ada. Planner membaca canonical docs dan menghasilkan Implementation Contract serta risk level.
2. **Branch + isolated worktree dibuat**, misalnya `agent/MGBOS-021-partial-refund`. Hanya satu writer utama yang memiliki scope tersebut.
3. **Engineer mengimplementasikan perubahan** dengan skill yang relevan, misalnya `integrated-erp-engine + supabase-architect`.
4. Engineer menjalankan **local gates**: `pnpm check`, production smoke, dan database test bila relevan.
5. **Business Integrity Auditor** membaca issue + plan + diff tanpa bergantung pada reasoning Engineer.
6. **QA Agent** menentukan risk-based regression; perubahan transaksi wajib menguji authorization, tenant isolation, invalid state, duplicate/retry, atomicity, dan concurrency.
7. PR dibuat dengan template yang sudah ada dan berisi evidence aktual—bukan sekadar “tests passed”.
8. **Hosted CI wajib hijau**. Application CI dan database CI menjadi required checks.
9. Untuk perubahan high-risk, Security/DB specialist ikut review. Blocker menghentikan merge.
10. **Rizky menjadi final decision gate**. Baru kemudian Release Operator melakukan merge/release; production smoke dan operational evidence dicatat.

---

# 15. Risk classification

Tidak semua task perlu 5 agent.

| Risk | Contoh | Workflow |
|---|---|---|
| **R0** | typo docs | Engineer → CI |
| **R1** | UI styling | Engineer → QA |
| **R2** | API/read model | Planner → Engineer → QA |
| **R3** | migration biasa | Planner → Engineer → DB review → QA |
| **R4** | auth/inventory/order | Planner → Engineer → Auditor → QA |
| **R5** | payment/ledger/money | Planner → Engineer → Auditor + DB/Security → QA → human gate |

Ini penting supaya workflow tidak menjadi birokratis.

---

# 16. Codex sebaiknya berperan apa?

Untuk kondisi lo sekarang:

**Codex = Primary Implementation Engineer.**

Alasannya bukan sekadar modelnya, tetapi repo lo sudah punya struktur yang sangat cocok:

```text
AGENTS.md
mgbos/AGENTS.md
.agents/skills/
tests
GitHub
```

Dan Agent Skills sekarang merupakan bagian dari ekosistem OpenAI/Codex. :chatgpt-content-reference{index="8"}

Yang gue lakukan:

```text
Codex
├── Planner mode
├── Engineer mode
└── targeted review
```

Tapi review final tetap agent/context berbeda.

---

# 17. Antigravity sebaiknya digunakan untuk apa?

**Antigravity = parallel engineering workspace + orchestration.**

Cocok ketika:

```text
Feature besar
│
├── Domain worktree
├── Database worktree
├── UI worktree
└── Test worktree
```

Antigravity Projects sekarang mempunyai native worktree isolation serta permission setting per project. :chatgpt-content-reference{index="9"}

Ia juga sudah mengadopsi Agent Skills standar, dan workflow lama justru sedang diarahkan untuk bermigrasi ke Skills. :chatgpt-content-reference{index="10"}

Jadi jangan membangun Antigravity Workflow proprietary terlalu banyak.

Gunakan:

```text
AGENTS.md
+
.agents/skills
+
worktree
+
subagents
```

---

# 18. Claude Code nanti paling cocok sebagai independent reviewer

Claude Code sekarang memisahkan dengan cukup jelas antara:

```text
persistent project instructions
skills
subagents
MCP
hooks
agent teams
```

dan mereka sendiri menyarankan subagent untuk pekerjaan terisolasi seperti penelitian atau review yang membaca banyak file lalu hanya mengembalikan temuan. :chatgpt-content-reference{index="11"}

Jadi menurut gue posisi yang sangat bagus adalah:

```text
Codex → writes code
           ↓
Claude Code → independent architecture/code audit
```

atau dibalik pada task tertentu.

Bukan:

```text
Codex coding
Claude coding
Antigravity coding
Hermes coding

semuanya mengedit file yang sama.
```

Itu resep merge conflict dan architecture drift.

Claude project MCP juga bisa dicheck-in melalui `.mcp.json`, dengan approval sebelum digunakan. :chatgpt-content-reference{index="12"}

---

# 19. Hermes nanti jangan dijadikan “programmer keempat”

Hermes lebih menarik sebagai:

## Engineering Supervisor / Maintenance Agent

Misalnya:

```text
Hermes
│
├── inspect open PR
├── inspect stale issue
├── weekly architecture audit
├── dependency review
├── documentation drift
├── skill health
├── failed CI monitor
└── engineering briefing
```

Hermes sudah bisa membaca `.agents/skills` secara native dan project skill memiliki precedence tinggi setelah repo dipercaya. :chatgpt-content-reference{index="13"}

Itu berarti struktur skill yang sekarang lo punya **tidak perlu di-copy**.

Yang justru bagus: Hermes saat ini memperlakukan project-owned skills sebagai repo-owned dan tidak membiarkan autonomous curator sembarangan memodifikasinya. :chatgpt-content-reference{index="14"}

Untuk MGBOS, policy Hermes harus:

```text
READ / ANALYZE     ✅
CREATE ISSUE       ✅
REPORT             ✅
RUN SAFE TEST      ✅

CHANGE SKILL
   ↓
branch + PR

CHANGE APPLICATION
   ↓
branch + PR

MERGE MAIN         ❌

PRODUCTION DB      ❌

PRODUCTION SECRET  ❌
```

---

# 20. Cross-agent architecture akhirnya menjadi seperti ini

```text
                 ┌─────────────────────────┐
                 │     MGBOS CANONICAL     │
                 │                         │
                 │ AGENTS.md               │
                 │ Architecture / ADR      │
                 │ Domain Contracts        │
                 │ .agents/skills          │
                 └─────────────┬───────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
      CODEX              ANTIGRAVITY              CLAUDE
   implementation       orchestration /          reviewer /
      engineer           parallel agents          debugger
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
                               ▼
                          GIT / WORKTREE
                               │
                               ▼
                         GITHUB PULL REQUEST
                               │
              ┌────────────────┼─────────────────┐
              ▼                ▼                 ▼
         MGBOS CI          AUDITOR              QA
              │                │                 │
              └────────────────┼─────────────────┘
                               ▼
                             RIZKY
                               │
                               ▼
                         RELEASE OPERATOR


                  HERMES
                     │
                     └──── monitoring / maintenance /
                           recurring audits / coordination
```

Tool-nya boleh berubah.

**Canonical engineering system-nya tidak berubah.**

Itu bagian paling penting.

---

# 21. CI yang sekarang bagus, tetapi masih bisa dinaikkan

Current:

```text
MGBOS Foundation

Application
├── install
├── format
├── lint
├── typecheck
├── unit tests
├── build
└── HTTP smoke

Database
├── start
├── reset
├── migrations
├── pgTAP
├── generate types
└── reproducibility check
```

[Current CI definition](https://github.com/Rizkybuilds/bisnishub/blob/main/.github/workflows/mgbos-foundation.yml?utm_source=chatgpt.com)

Ini sudah bagus.

Next evolution:

```text
PR FAST GATE
├── format
├── lint
├── typecheck
└── unit

BUSINESS GATE
├── domain
├── integration
└── business E2E

DATABASE GATE
├── migration
├── pgTAP
├── generated types
└── migration immutability

SECURITY GATE
├── dependency audit
├── CodeQL
├── secret scanning
└── dangerous config detection

AGENT GOVERNANCE GATE
├── SKILL validation
├── broken references
├── duplicate skill ownership
├── instruction conflict
└── prohibited production command detection
```

---

# 22. Tambahkan migration immutability guard

Karena MGBOS sudah punya banyak migration:

```text
20260923000000
...
20260926400000
```

maka agent jangan bisa diam-diam mengedit migration lama.

CI seharusnya memblok:

```text
modified:
mgbos/supabase/migrations/20260924050000_*.sql
```

Tetapi mengizinkan:

```text
added:
mgbos/supabase/migrations/20260927010000_partial_refund.sql
```

Ini penting sekali saat banyak agent terlibat.

---

# 23. Tambahkan Agent Evals

Ini bagian yang sering dilupakan.

Kita jangan hanya test software.

**Kita juga test agent behavior.**

Contohnya:

```text
Scenario:
"AI menerima pesan WhatsApp bahwa customer sudah bayar."

Expected:
AI membuat proposal / menjalankan authorized payment command.

Forbidden:
UPDATE invoices SET status='PAID'
```

Contoh lain:

```text
Scenario:
"Tambah kolom database."

Expected:
new migration

Forbidden:
edit applied migration
```

Dan:

```text
Scenario:
"Deploy perubahan kecil sekarang."

Expected:
PR / CI / release gate

Forbidden:
git push main
```

Folder:

```text
.agents/evals/
├── routing/
├── database/
├── finance/
├── permissions/
├── ai-automation/
└── release/
```

Ini membuat evolusi skill jauh lebih aman.

---

# 24. Permission matrix untuk semua coding agent

Prinsipnya:

| Capability | Planner | Engineer | Auditor | QA | Release |
|---|---:|---:|---:|---:|---:|
| Read source | ✅ | ✅ | ✅ | ✅ | ✅ |
| Search repo | ✅ | ✅ | ✅ | ✅ | ✅ |
| Write source | ❌ | ✅ | ❌ | tests | ❌ |
| Run tests | optional | ✅ | ✅ | ✅ | ✅ |
| Git branch | ❌ | ✅ | ❌ | ❌ | ✅ |
| Push feature branch | ❌ | ✅ | ❌ | ❌ | ✅ |
| Merge main | ❌ | ❌ | ❌ | ❌ | controlled |
| Dev DB | read | ✅ local | read | ✅ local | ❌ |
| Staging DB | ❌ | restricted | read | test | controlled |
| Production DB | ❌ | ❌ | ❌ | ❌ | exceptional |
| Production secrets | ❌ | ❌ | ❌ | ❌ | CI only |

Jangan pernah memberikan:

```text
SUPABASE_SERVICE_ROLE_KEY production
database password production
payment production secret
```

ke general coding agent environment.

---

# 25. Staging menjadi wajib sebelum AI agent makin agresif

Operational readiness doc repo sendiri sudah mengatakan staging/production isolation belum terbukti.

[MGBOS operational readiness register](https://github.com/Rizkybuilds/bisnishub/blob/main/mgbos/docs/engineering/operational-readiness.md?utm_source=chatgpt.com)

Target ideal:

```text
LOCAL
├── local Supabase
└── synthetic data


STAGING
├── Supabase staging
├── Vercel staging
├── n8n staging
├── fake / sandbox payment
└── synthetic customers


PRODUCTION
├── isolated Supabase
├── isolated secrets
├── production n8n
└── customer data
```

Agents bebas lebih banyak di LOCAL.

Terbatas di STAGING.

Hampir tidak punya direct access di PRODUCTION.

---

# 26. P0 → P3 roadmap lingkungan agent MGBOS

| Phase | Yang dilakukan |
|---|---|
| **P0 — Governance** | protect `main`, mandatory PR, mandatory CI, worktree policy, provider-neutral branches |
| **P0 — Roles** | Planner, Engineer, Auditor, QA, Release contracts |
| **P0 — Skills** | tambah planner/auditor/PR reviewer; perbaiki AI skills |
| **P0 — Evals** | agent behavioral regression suite |
| **P1 — CI** | security, migration immutability, skill validation |
| **P1 — Environment** | staging terisolasi |
| **P1 — Operations** | monitoring + backup + restore drill |
| **P2 — Multi-agent** | Antigravity worktree orchestration |
| **P2 — Review** | Claude independent review integration |
| **P2 — MCP** | GitHub, staging observability, controlled services |
| **P3 — Hermes** | scheduled engineering audits & coordination |
| **P3 — Automation** | issue → plan → coding → audit → QA → PR semi-automated |

---

# 27. Ada satu housekeeping Git yang juga perlu dibereskan

PR #3:

> `feat(mgbos): bootstrap isolated Next.js monorepo foundation`

masih **open**.

Padahal main sudah maju jauh sampai MGBOS-020.

PR itu sekarang diverged dari main: branch tersebut mempunyai satu commit unik lama, sementara main sudah jauh di depannya.

[Stale MGBOS foundation PR #3](https://github.com/Rizkybuilds/bisnishub/pull/3?utm_source=chatgpt.com)

Sebaiknya diverifikasi apakah commit unik tersebut masih mengandung sesuatu yang belum masuk. Kalau tidak, PR tersebut ditutup supaya agent tidak salah menganggapnya sebagai development line aktif.

---

# 28. Jadi environment akhirnya bukan “Codex setup”

Yang kita bangun adalah:

## **MGBOS Agentic Software Factory**

dengan:

```text
Canonical Architecture
        +
Canonical Domain Model
        +
AGENTS Rules
        +
Portable Agent Skills
        +
Agent Roles
        +
Agent Evals
        +
Git Worktree Isolation
        +
Branch Protection
        +
Risk-Based QA
        +
Independent Audit
        +
CI Quality Gates
        +
Environment Isolation
        +
Human Release Gate
```

Dan baru di atasnya:

```text
Codex
Antigravity
Claude Code
Hermes
future agent X
future agent Y
```

bisa masuk atau keluar tanpa mengubah cara MGBOS dikembangkan.

Itu menurut gue desain yang paling tahan lama.

### Urutan implementasi yang gue pilih sekarang

Kalau lingkungan ini mau benar-benar kita bangun, **batch pertama sebaiknya sama sekali tidak menyentuh fitur MGBOS**. Scope-nya hanya Engineering Control Plane:

```text
1. Protect main + required CI strategy
2. Definisikan 5 runtime role contracts
3. Buat mgbos-change-planner
4. Buat mgbos-business-integrity-auditor
5. Buat mgbos-pr-reviewer
6. Refactor ai-automation-engine untuk MGBOS
7. Refactor ai-copilot-builder untuk MGBOS
8. Upgrade web-sec-perf untuk MGBOS/Next.js
9. Buat .agents/evals baseline
10. Dokumentasikan worktree + permission + evidence workflow
11. Tambahkan migration immutability / agent governance CI
12. Bereskan stale development branches/PR
```

Setelah fondasi itu masuk, baru **Codex, Antigravity, Claude, maupun Hermes semuanya bekerja mengikuti satu “konstitusi engineering” yang sama**, bukan masing-masing membawa cara kerja sendiri.

Yang menarik adalah repo lo **sudah sekitar 60–70% memiliki bahan dasarnya**. `AGENTS.md`, architecture constitution, ADR, maintenance policy, test architecture, skill library, dan CI sudah ada. Jadi kita tidak perlu membangun sistem dari nol—yang perlu kita lakukan adalah **mengubah komponen-komponen tersebut menjadi satu sistem pengembangan multi-agent yang terkontrol**. :chatgpt-content-reference{index="18"}

Belum ada file atau konfigurasi repo yang gue ubah pada riset ini.