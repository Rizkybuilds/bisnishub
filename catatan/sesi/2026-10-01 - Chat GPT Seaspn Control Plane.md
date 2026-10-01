Setelah gue audit ulang repo terbaru, Expert Registry yang lo kirim, plus dokumentasi resmi Codex, Antigravity, dan Claude Code, arah kita sekarang jauh lebih jelas.

**Kesimpulan utamanya:** kita tidak perlu “membangun agent system dari nol”. Repo lo **sudah punya Engineering Control Plane v0.x**. Yang perlu kita lakukan adalah **mengubahnya menjadi control plane yang lengkap, machine-readable, enforceable, dan portable lintas runtime**.

Snapshot yang gue audit adalah `main` pada commit `49908f1` tanggal 30 September 2026. Di revision itu, check `application`, `database`, `agent-governance`, `migration-immutability`, dan `repository-integrity` semuanya sukses. [Commit 49908f1](https://github.com/Rizkybuilds/bisnishub/commit/49908f102b4f96fc21ec6a7e6386ef348c6557a4?utm_source=chatgpt.com)

# 1. Posisi repo lo sekarang

Repo sudah mempunyai sebagian besar fondasi yang sebelumnya kita bayangkan:

| Layer                          | Kondisi sekarang                                 | Penilaian                                                  |
| ------------------------------ | ------------------------------------------------ | ---------------------------------------------------------- |
| Persistent engineering rules   | `AGENTS.md` root + `systems/mgbos/AGENTS.md`     | **Sudah ada**                                              |
| Role system                    | Planner, Engineer, Auditor, QA, Release Operator | **Sudah ada**                                              |
| Machine-readable role registry | `.agents/roles/contracts.json`                   | **Sudah ada**                                              |
| Skills                         | 42 project skills                                | **Sudah ada, tapi perlu routing lebih disiplin**           |
| Engineering workflow           | `agent-system/workflow.md`                       | **Sudah ada**                                              |
| Permission matrix              | Ada                                              | **Sudah ada**                                              |
| Evidence model                 | Ada                                              | **Sudah ada**                                              |
| Release gates                  | Ada                                              | **Sudah ada + CI**                                         |
| Behavioral eval baseline       | 18 kasus                                         | **Sudah ada tetapi belum dieksekusi sebagai runtime eval** |
| Governance validator           | Python + CI                                      | **Sudah ada**                                              |
| Migration immutability guard   | CI                                               | **Sudah ada**                                              |
| Expertise registry             | Baru di dokumen yang lo kirim                    | **Belum masuk control plane repo**                         |
| Machine task routing           | Mostly prose                                     | **Belum ada**                                              |
| Work-package schema            | Mostly prose                                     | **Belum ada**                                              |
| Artifact/output contracts      | Mostly prose                                     | **Belum machine-readable**                                 |
| Antigravity Rules              | `.agents/rules/` belum ada                       | **Belum ada**                                              |
| Antigravity Workflows          | `.agents/workflows/` belum ada                   | **Belum ada**                                              |
| Claude adapter                 | `CLAUDE.md` / `.claude/` belum ada               | **Belum ada**                                              |
| Runtime eval harness           | Structural validation saja                       | **Belum ada**                                              |

Root `AGENTS.md` sendiri bahkan sudah menyatakan bahwa `.agents` adalah engineering control plane dan bukan runtime JARVIS. Itu adalah boundary yang harus kita pertahankan. [BisnisHub AGENTS.md](https://github.com/Rizkybuilds/bisnishub/blob/main/AGENTS.md?utm_source=chatgpt.com)

Control plane MGBOS juga sudah mendefinisikan dirinya sebagai **provider-neutral working contracts untuk Codex, Antigravity, Hermes, Claude Code, atau human operator**. Jadi desain yang kita diskusikan sebenarnya merupakan kelanjutan alami dari arsitektur yang sudah lo punya, bukan pivot. [MGBOS Engineering Control Plane](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/docs/engineering/agent-system/README.md?utm_source=chatgpt.com)

---

# 2. Temuan paling penting: kita harus menghindari provider-specific architecture

Dokumentasi resmi ketiga runtime justru mendukung pendekatan yang sama.

Codex secara otomatis memuat `AGENTS.md` secara hierarkis dari root menuju current working directory. OpenAI sekarang juga secara eksplisit menyarankan supaya `AGENTS.md` **tetap ringan dan contextual**, bukan memaksa model membaca seluruh architecture docs untuk setiap typo atau perubahan kecil. :chatgpt-content-reference{index="3"}

Antigravity membagi customization menjadi tiga primitive utama:

````text
.agents/rules/
→ always-on workspace guidance

.agents/skills/
→ progressive/on-demand knowledge & procedure

.agents/workflows/
→ user-triggered reusable orchestration
``` :chatgpt-content-reference{index="4"}


Claude Code memiliki pembagian yang hampir identik:

```text
CLAUDE.md
→ persistent context

.claude/rules/
→ path/context-specific rules

.claude/skills/
→ on-demand knowledge/workflows

subagents
→ isolated execution contexts

hooks
→ deterministic enforcement
````

Dan Anthropic secara eksplisit membedakan antara **instruction** dan **enforcement**: aturan seperti “jangan edit `.env`” di prompt bukan jaminan; jika harus benar-benar dipaksa, gunakan permission/hook/guard deterministic. :chatgpt-content-reference{index="5"}

Ini memberi kita hukum desain:

> **Provider files are adapters. They must never become the canonical source of engineering governance.**

Jadi jangan nanti kita punya:

```text
Codex rules
Antigravity rules
Claude rules
```

yang perlahan-lahan berbeda.

Targetnya:

```text
             CANONICAL CONTROL PLANE

 Rules
 Roles
 Expertise
 Skills
 Routing
 Contracts
 Policies
 Evals
 Evidence
 Guards
       │
       ├─────────────┬──────────────┐
       ▼             ▼              ▼
     Codex       Antigravity    Claude Code
```

---

# 3. Model konseptual final yang gue rekomendasikan

Di sini gue akan sedikit mengoreksi rancangan kita sebelumnya.

Control plane kita sebaiknya mempunyai **10 primitive**, bukan cuma Rule/Role/Expertise/Skill.

| Primitive               | Pertanyaan yang dijawab                                     |
| ----------------------- | ----------------------------------------------------------- |
| **Rule / Constitution** | Apa yang selalu benar dan tidak boleh dilanggar?            |
| **Role**                | Dalam execution ini gue bertanggung jawab sebagai siapa?    |
| **Expertise**           | Pengetahuan apa yang harus gue pahami?                      |
| **Skill**               | Bagaimana prosedur reusable melakukan sesuatu?              |
| **Task Type**           | Pekerjaan ini sebenarnya kategori apa?                      |
| **Routing**             | Role/expertise/skill apa yang harus diaktifkan?             |
| **Work Contract**       | Apa exact mission, scope, risk, dan acceptance-nya?         |
| **Tool / Permission**   | Apa yang boleh dilakukan runtime ini?                       |
| **Evidence / Artifact** | Bagaimana hasil kerja dibuktikan dan diserahkan?            |
| **Eval / Guard**        | Bagaimana kita membuktikan dan memaksa behavior yang benar? |

Expert Registry lo sangat cocok dengan model ini karena sejak awal sudah memisahkan Role, Expertise, Skill, Tool, dan Runtime. :chatgpt-content-reference{index="6"}

Dan pembagian lima role utamanya juga jangan diubah:

```text
Planner
Engineer
Auditor
QA
Release Operator
```

:chatgpt-content-reference{index="7"}

Yang bertambah adalah **mechanism di bawahnya**, bukan jumlah role.

---

# 4. Expertise adalah abstraction milik BisnisHub, bukan fitur runtime

Ini penting.

Codex tidak perlu punya fitur bernama `Expertise`.

Antigravity juga tidak.

Claude juga tidak.

Kita yang mendefinisikan:

```text
EXP-006
Financial Integrity
```

sebagai provider-neutral knowledge contract.

Lalu router mengatakan:

```text
Task:
payment allocation change

Role:
Engineer

Load expertise:
- MGBOS Domain
- Backend Command
- PostgreSQL Transaction
- Authorization
- Financial Integrity
```

Runtime adapter kemudian menerjemahkannya menjadi context yang dipahami Codex/Antigravity/Claude.

Jadi:

```text
ROLE
= authority/responsibility mode

EXPERTISE
= what must be understood

SKILL
= how work is performed
```

Pembeda `Expertise = what must be understood` dan `Skill = how a repeatable task is performed` dalam proposal lo menurut gue harus dipertahankan sebagai prinsip canonical. :chatgpt-content-reference{index="8"}

---

# 5. Ada canonical conflict yang harus kita selesaikan dulu

Ini salah satu temuan terbesar audit.

Control plane engineering MGBOS yang sekarang menggunakan:

```text
R0
R1
R2
R3
```

dengan `money / authorization / migration / AI tool` ditempatkan di R2.

Tetapi governance ekosistem terbaru sudah menetapkan **R0–R5 sebagai canonical ecosystem risk semantics**, termasuk:

```text
R0 informational
R1 read-only
R2 reversible low-impact mutation
R3 significant operational/external mutation
R4 sensitive/high-impact mutation
R5 money/security/production-critical
```

dan secara eksplisit menetapkan `mgbos.payment.record` sebagai R5. [Canonical Cross-System Risk Classification](https://github.com/Rizkybuilds/bisnishub/blob/main/docs/governance/cross-system-risk-classification.md?utm_source=chatgpt.com)

Proposal Expert Registry lo juga sudah memakai R0–R5, dengan perubahan payment/ledger sebagai R5. :chatgpt-content-reference{index="10"}

Jadi menurut gue:

**MGBOS engineering risk R0–R3 harus disupersede/reconcile.**

Bukan membuat taxonomy ketiga.

Engineering Control Plane harus menggunakan canonical R0–R5.

Tetapi ada satu nuance:

```text
Runtime Action Risk
≠
Engineering Change Risk
```

Contoh:

```text
mgbos.payment.record
Runtime capability = R5
```

Maka:

```text
change code yang menentukan payment.record
Engineering change minimum risk = R5
```

meskipun developer hanya mengubah 12 baris kode.

Ini cocok dengan prinsip lo sendiri:

> risk mengikuti consequence, bukan jumlah file. :chatgpt-content-reference{index="11"}

---

# 6. Hal berikutnya yang belum ada: Task Routing Engine

Sekarang Planner skill mengatakan:

> route appropriate specialist.

Masalahnya, **“appropriate” masih ditentukan oleh reasoning LLM**.

Kita perlu mengubah:

```text
LLM remembers routing rules
```

menjadi:

```text
LLM proposes classification
       ↓
machine registry validates it
       ↓
hard minimum rules apply
       ↓
runtime gets bounded context
```

Contoh:

```yaml
task_type: business-command-change

domains:
  - payment
  - invoice

affected_capabilities:
  - mgbos.payment.record

effective_risk: R5

role_flow:
  - planner
  - engineer
  - auditor
  - qa

mandatory_expertise:
  - mgbos-domain
  - backend-command
  - postgres-transaction
  - authorization-capability
  - financial-integrity

mandatory_skills:
  - implement-business-command
  - verify-financial-integrity

independent_review: required

founder_gate: required
```

Router bukan AI boss.

Router adalah **constraint resolver**.

AI boleh mengklasifikasikan task, tetapi system menentukan minimum requirement.

---

# 7. Hard rule dan prompt rule harus dibedakan

Ini menurut gue akan menjadi salah satu upgrade paling penting.

Saat ini banyak rules hidup dalam Markdown.

Contoh:

```text
Never modify an applied migration.
```

Bagus untuk reasoning.

Tetapi repo lo juga sudah melakukan hal yang lebih benar:

```text
instruction
+
migration immutability script
+
CI
```

Itu jauh lebih kuat.

Claude Code juga menggunakan filosofi serupa: instruction untuk reasoning, hook/permission untuk behavior yang harus deterministik. :chatgpt-content-reference{index="12"}

Jadi setiap control nantinya sebaiknya memiliki tipe enforcement:

```text
INSTRUCTION
VALIDATOR
LOCAL_GUARD
CI_GATE
HOST_PERMISSION
HUMAN_GATE
```

Misalnya:

```text
Never modify applied migration

Instruction:
AGENTS.md

Validator:
check-migration-immutability.mjs

CI:
migration-immutability

Enforcement strength:
DETERMINISTIC
```

Sedangkan:

```text
Prefer smallest useful slice

Instruction:
Planner role

Enforcement:
REASONING
```

Tidak semua aturan bisa atau perlu menjadi script.

Tetapi **semua aturan kritis yang bisa dibuat deterministic sebaiknya tidak hanya hidup dalam prompt**.

---

# 8. Skills lo sudah banyak — jangan tambah sembarangan

Audit current tree menunjukkan ada **42 project skills** di `.agents/skills/`.

Itu belum otomatis buruk.

Masalahnya adalah routing ambiguity.

OpenAI baru-baru ini juga memperingatkan bahwa terlalu banyak instruksi, skills, dan always-on guidance bisa menghasilkan context bloat dan malah membuat coding agent kurang efektif. :chatgpt-content-reference{index="13"}

Antigravity menggunakan progressive disclosure untuk alasan yang sama: skill tetap dormant sampai deskripsinya cocok dengan request. :chatgpt-content-reference{index="14"}

Jadi kita **tidak perlu membuat skill untuk setiap expert**.

Contoh:

```text
Financial Integrity
```

adalah expertise.

Sedangkan:

```text
audit-payment-integrity
```

boleh menjadi skill.

Itu dua hal berbeda.

Expert Registry justru sudah menangkap distinction ini dengan benar. :chatgpt-content-reference{index="15"}

---

# 9. Eval system repo lo sebenarnya sudah bagus

Current baseline punya 18 synthetic cases:

```text
routing
database
finance
permissions
AI
release
```

Dan setiap case sudah punya:

```text
prompt
context
role
criteria
forbidden behavior
sources
```

Ini menurut gue **fondasi yang sangat tepat**.

Masalahnya saat ini CI hanya memvalidasi struktur baseline tersebut.

Belum:

```text
run Codex
capture tools/actions
grade actual behavior
```

Dokumentasi OpenAI untuk systematic skill eval sekarang secara eksplisit menyarankan pola:

```text
prompt
→ actual agent run
→ trace + artifacts
→ deterministic checks
→ optional rubric grader
→ regression comparison
```

dan menyarankan mengukur bukan hanya final answer, tetapi juga apakah skill benar-benar dipanggil dan command/tool yang seharusnya dijalankan memang terjadi. :chatgpt-content-reference{index="16"}

Ini hampir persis evolusi yang dibutuhkan `.agents/evals/` lo.

Jadi kita **tidak perlu mendesain ulang eval baseline**.

Kita perlu membuat:

```text
Eval Baseline
      ↓
Codex Adapter
      ↓
Actual Execution
      ↓
Trace
      ↓
Grader
      ↓
Result Artifact
```

Lalu Antigravity dan Claude dapat memiliki adapter masing-masing.

---

# 10. Target directory architecture

Setelah audit, struktur yang menurut gue paling cocok adalah:

```text
.agents/
│
├── roles/
│   ├── contracts.json              ← existing
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
│   └── existing procedural skills
│
├── routing/
│   ├── task-types.yaml
│   ├── expertise-routing.yaml
│   └── risk-routing.yaml
│
├── contracts/
│   ├── implementation-contract.schema.json
│   ├── work-package.schema.json
│   ├── engineering-report.schema.json
│   ├── assurance-report.schema.json
│   ├── verification-matrix.schema.json
│   └── release-packet.schema.json
│
├── rules/
│   └── Antigravity-facing workspace rules
│
├── workflows/
│   └── Antigravity-facing slash workflows
│
├── evals/
│   ├── baseline.json
│   ├── runtime/
│   └── results/
│
└── adapters/
    ├── codex/
    ├── antigravity/
    └── claude/
```

Tetapi ada aturan penting:

```text
adapters/
```

**tidak boleh memiliki policy baru.**

Mereka hanya menerjemahkan canonical contract ke runtime tertentu.

---

# 11. Provider integration yang gue rekomendasikan

Untuk **Codex**, kita pertahankan `AGENTS.md` hierarchy sebagai persistent instruction surface. Codex memang native membaca struktur root-to-leaf ini. Skill tetap procedural dan selective; jangan membuat AGENTS menjadi ensiklopedia. :chatgpt-content-reference{index="17"}

Untuk **Antigravity**, kita baru punya kesempatan besar karena struktur repo `.agents/skills/` lo sudah cocok dengan konsep Antigravity. Yang hilang adalah `.agents/rules/` dan `.agents/workflows/`. Rules akan menjadi adapter always-on; Workflows bisa memberi command semacam `/plan-change`, `/implement-work-package`, `/audit-change`, `/verify-change`, `/prepare-release`. Dokumentasi resmi Antigravity memang mendesain folder tersebut untuk workspace-level behavior dan reusable multi-step flows. :chatgpt-content-reference{index="18"}

Untuk **Claude Code**, jangan bikin sistem paralel. Ketika Claude benar-benar masuk stack, buat `CLAUDE.md` tipis yang merujuk/import canonical project instructions, `.claude/rules/` hanya untuk path-specific adapter, dan `.claude/skills/` hanya bila Claude membutuhkan native skill entrypoint. Claude sendiri menyarankan CLAUDE.md tetap ringkas dan memindahkan materi detail ke rules atau skills. :chatgpt-content-reference{index="19"}

---

# 12. Expert Registry lo sebaiknya diapakan?

**Jangan langsung copy seluruh dokumen itu ke `.agents/expertise/`.**

Dokumen tersebut saat ini campuran dari:

```text
architecture explanation
expert definition
routing rules
risk routing
runtime mapping
directory proposal
handoff contract
operating philosophy
```

Ia sangat bagus sebagai design proposal, tetapi untuk control plane machine-usable harus dipecah.

Bagian EXP-001 sampai EXP-021 menjadi basis **Expertise Registry**. Runtime mapping Codex/Claude/Antigravity pindah ke adapters. Risk routing pindah ke routing. One Writer Rule naik menjadi engineering law. Handoff contract pindah ke contracts. Team philosophy tetap menjadi narrative architecture document. :chatgpt-content-reference{index="20"}

Dengan kata lain:

```text
Expert Registry v1
        ↓ decompose
─────────────────────────
Expertise
Routing
Rules
Contracts
Adapters
```

---

# 13. Urutan implementasi yang menurut gue paling aman

1. **Canonical reconciliation.** Jadikan ecosystem R0–R5 sebagai satu-satunya risk taxonomy; ubah MGBOS engineering risk doc menjadi application profile dari canonical risk, bukan taxonomy sendiri.

2. **Engineering Constitution.** Identifikasi 15–30 invariant keras dari root AGENTS, MGBOS AGENTS, risk, evidence, one-writer, authority, migration, money, source-of-truth, dan independent review. Jangan membuat dokumen panjang baru; refactor supaya authority jelas.

3. **Expertise Registry v1.** Pecah Expert Registry menjadi machine-readable `registry.yaml` + knowledge files. Mulai dari expertise yang benar-benar aktif untuk Phase 2, bukan mematerialisasi 21 semuanya sekaligus.

4. **Task + Routing v1.** Tambahkan task taxonomy, risk floor, mandatory expertise, role flow, dan hard escalation rules. Router boleh menggunakan reasoning, tetapi system memvalidasi hasilnya.

5. **Execution Contracts v1.** Formalisasikan Implementation Contract, Work Package, Engineering Report, Assurance Report, Verification Matrix, dan Release Packet sehingga handoff tidak lagi free-form.

6. **Antigravity Adapter v1.** Tambahkan `.agents/rules/` dan `.agents/workflows/` yang membaca control plane canonical; kemudian uji actual execution Antigravity dengan beberapa task sintetis.

7. **Executable Eval Harness v1.** Jalankan 18 baseline scenarios terhadap Codex terlebih dahulu, rekam traces/actions/artifacts, lalu jadikan regression baseline. Setelah stabil, buat adapter Antigravity dan kelak Claude. :chatgpt-content-reference{index="21"}

Ini satu-satunya list yang gue rasa benar-benar perlu karena urutannya penting.

---

# 14. Satu prinsip yang menurut gue harus menjadi pusat seluruh desain

Control plane ini **bukan sistem untuk membuat AI semakin banyak**.

Ia adalah sistem untuk membuat AI semakin **predictable**.

Targetnya bukan:

```text
Codex super pintar
Antigravity super autonomous
Claude super expert
```

Targetnya:

```text
Runtime apa pun masuk
        ↓
memahami authority yang sama
        ↓
mendapat context yang tepat
        ↓
melakukan bounded work
        ↓
menghasilkan evidence standar
        ↓
melewati assurance standar
        ↓
hasil dapat dipercaya
```

Dan itu persis sejalan dengan North Star Expert Registry lo: masalah diberikan ke expertise yang tepat, melalui role yang tepat, dengan authority yang tepat, dan dibuktikan dengan evidence yang tepat. :chatgpt-content-reference{index="22"}

## Keputusan arsitektur v1

Jadi gue akan menetapkan arah kita seperti ini:

```text
MGBOS ENGINEERING AI CONTROL PLANE

CANONICAL / PROVIDER-NEUTRAL
│
├── Governance
├── Constitution
├── Roles
├── Expertise
├── Skills
├── Task Taxonomy
├── Routing
├── Risk
├── Work Contracts
├── Evidence
├── Evals
└── Deterministic Guards
        │
        ▼
RUNTIME ADAPTERS
│
├── Codex
├── Antigravity
├── Claude Code
└── future runtimes
        │
        ▼
EXECUTION
│
├── Plan
├── Implement
├── Audit
├── Verify
└── Release Prepare
        │
        ▼
GIT + CI + EVIDENCE
```

Dan berdasarkan audit ini, **pekerjaan pertama bukan membuat skill baru atau agent baru**.

Pekerjaan pertama adalah **Control Plane v1.1 — Canonical Reconciliation & Foundation**, khususnya:

```text
RISK R0–R5
+
ENGINEERING CONSTITUTION
+
EXPERTISE MODEL
+
ROUTING MODEL
```

Setelah empat fondasi itu benar, baru kita materialisasikan file-file `.agents/` dan adapter Antigravity/Codex. Ini akan mencegah kita membangun automation di atas governance yang masih memiliki conflict internal.
