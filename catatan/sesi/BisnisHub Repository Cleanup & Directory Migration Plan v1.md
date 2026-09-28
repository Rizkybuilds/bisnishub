# BisnisHub Repository Cleanup & Directory Migration Plan v1

**Status:** Planning  
**Baseline revision:** `3c3ccb39236c97a2c36093669bedad89ae99a3ce`  
**Tanggal:** 27 September 2026  
**Scope:** Repository structure, ownership boundaries, tooling paths, documentation routing, CI/deployment path migration  
**Non-goal:** Tidak mengubah business behavior, database schema, feature logic, atau production data.

---

## 1. Tujuan

Repository BisnisHub akan ditata ulang agar setiap jenis aset memiliki boundary yang jelas.

Target utamanya:

```text
Runnable software        → systems/
Business knowledge       → bisnis/
Historical notes         → catatan/
Repository governance    → docs/
Agent control plane      → .agents/
CI/CD                     → .github/
Repository automation    → scripts/
Standalone tools         → tools/
Reusable templates       → templates/
Retired implementation   → archive/
```

Hasil akhir harus membuat developer maupun AI agent dapat mengetahui lokasi authoritative tanpa membutuhkan pengetahuan sejarah repository.

---

# 2. Prinsip migrasi

Migrasi dilakukan berdasarkan bounded system, bukan berdasarkan tipe file secara global.

Tidak boleh ada satu PR yang sekaligus:

```text
memindahkan folder
+
mengubah business logic
+
upgrade dependencies
+
mengganti package manager
+
mengubah database schema
```

Setiap migration wave harus mempertahankan behavior sebelum dan sesudah move.

Urutan evidence:

```text
Baseline
→ Path Migration
→ Local Verification
→ Hosted CI
→ Deployment-path Verification
→ Merge
→ Observation
→ Old Path Retirement
```

Semua rename/move sebisa mungkin dilakukan dengan `git mv` agar history tetap terbaca.

---

# 3. Target architecture repository

```text
bisnishub/
│
├── .agents/
│   ├── roles/
│   ├── skills/
│   └── evals/
│
├── .github/
│   ├── CODEOWNERS
│   ├── ISSUE_TEMPLATE/
│   ├── pull_request_template.md
│   └── workflows/
│
├── .obsidian/
│
├── systems/
│   │
│   ├── mgbos/
│   │   ├── apps/
│   │   │   ├── backoffice/
│   │   │   └── teestock/
│   │   ├── packages/
│   │   │   ├── ai/
│   │   │   ├── auth/
│   │   │   ├── config/
│   │   │   ├── database/
│   │   │   ├── domain/
│   │   │   ├── events/
│   │   │   ├── integrations/
│   │   │   ├── ui/
│   │   │   └── validation/
│   │   ├── supabase/
│   │   ├── automation/
│   │   ├── docs/
│   │   ├── scripts/
│   │   ├── package.json
│   │   ├── pnpm-workspace.yaml
│   │   └── pnpm-lock.yaml
│   │
│   ├── teestock-v1/
│   │   ├── apps/
│   │   │   ├── storefront/
│   │   │   └── admin/
│   │   ├── packages/
│   │   │   └── shared/
│   │   ├── supabase/
│   │   ├── docs/
│   │   └── README.md
│   │
│   └── kaskita/
│       ├── apps/
│       │   └── mobile/
│       ├── supabase/
│       ├── docs/
│       └── README.md
│
├── bisnis/
│   ├── multigraph/
│   ├── teestock/
│   ├── rizkybuild/
│   ├── kaskita/
│   └── titik-buta/
│
├── catatan/
│   ├── harian/
│   ├── ide/
│   ├── sesi/
│   └── weekly-review/
│
├── docs/
│   ├── architecture/
│   ├── decisions/
│   ├── engineering/
│   ├── reference/
│   └── project-index.md
│
├── tools/
│   └── assistant/
│       ├── main.py
│       ├── agent.py
│       ├── prompts/
│       ├── memory/
│       └── requirements.txt
│
├── scripts/
│   ├── governance/
│   ├── migration/
│   ├── setup/
│   ├── data/
│   └── maintenance/
│
├── archive/
│   └── mgbos-vite-prototype/
│
├── templates/
├── assets/
│
├── README.md
├── AGENTS.md
├── GEMINI.md
└── package.json
```

---

# 4. Directory ownership contract

| Directory | Fungsi | Boleh berisi executable code? | Deployable? |
|---|---|---:|---:|
| `systems/` | Software systems | Ya | Ya |
| `bisnis/` | SOP, finance, brand, marketing, research | Tidak | Tidak |
| `catatan/` | Session/history/journal | Tidak | Tidak |
| `docs/` | Repository-level governance | Tidak | Tidak |
| `.agents/` | Agent skills, roles, evals | Scripts pendukung terbatas | Tidak |
| `.github/` | GitHub automation | Workflow | Tidak |
| `tools/` | Standalone internal tools | Ya | Opsional |
| `scripts/` | Repeatable repository commands | Ya | Tidak |
| `archive/` | Retired implementations | Bisa, tetapi tidak aktif | Tidak |
| `templates/` | Reusable content templates | Tidak | Tidak |

Rule penting:

> `bisnis/`, `catatan/`, dan `archive/` tidak boleh menjadi dependency runtime production system.

---

# 5. Migration Wave 0 — Safety & Baseline

**Tujuan:** Menyiapkan repository sebelum large path changes.

Tidak ada file application yang dipindahkan pada tahap ini.

### Perubahan

Tambahkan:

```text
.github/CODEOWNERS
```

Baseline ownership awal:

```text
/systems/mgbos/          @Rizkybuilds
/systems/teestock-v1/    @Rizkybuilds
/systems/kaskita/        @Rizkybuilds

/.agents/                @Rizkybuilds
/.github/                @Rizkybuilds
/scripts/governance/     @Rizkybuilds
/docs/                   @Rizkybuilds
```

Karena `systems/` belum ada, CODEOWNERS dapat memuat current path dan future path selama migration.

Aktifkan branch protection `main`:

```text
Require pull request
Require status checks
Block force push
Block deletion
```

Required checks minimal:

```text
MGBOS Foundation / application
MGBOS Foundation / database
Agent Governance / agent-governance
Agent Governance / migration-immutability
```

### Baseline evidence

Simpan:

```text
commit SHA
CI result
build result
known deployment roots
known database targets
app URLs/environment target
```

### Acceptance

```text
main tidak dapat direct push
current main CI hijau
deployment root tercatat
database ownership tercatat
```

### Rollback

Tidak diperlukan untuk code karena belum ada physical move.

---

# 6. Migration Wave 1 — MGBOS Prototype Retirement

## Current

```text
apps/mgbos/
```

## Target

```text
archive/mgbos-vite-prototype/
```

### Path changes

```text
apps/mgbos
→ archive/mgbos-vite-prototype
```

Tambahkan:

```text
archive/mgbos-vite-prototype/README.md
```

isi minimal:

```text
Status: RETIRED
Replacement: mgbos/apps/mgbos
Deployment: FORBIDDEN
Database authority: NONE
Purpose: historical UI/prototype reference only
```

### Root script changes

Current:

```text
dev:mgbos-prototype
build:mgbos-prototype
install:mgbos-prototype
```

Keputusan:

Setelah satu periode compatibility, hapus scripts tersebut.

Jika masih diperlukan sementara:

```text
dev:archive:mgbos-prototype
```

lebih eksplisit.

### Verification

Audit references untuk:

```text
apps/mgbos
@bisnishub/shared
mgbos-prototype
```

Pastikan:

```text
root install:legacy
```

tidak lagi meng-install prototype setelah retirement final.

### Acceptance

Tidak ada:

```text
CI
Vercel
script default
runtime import
deployment
```

yang menggunakan archive.

---

# 7. Migration Wave 2 — TeeStock v1 Consolidation

Ini physical migration paling besar setelah MGBOS.

## Current

```text
bisnis/teestock/web/
apps/bisnishub-web/
packages/shared/
bisnis/teestock/supabase/
bisnis/teestock/database/
```

## Target

```text
systems/teestock-v1/
├── apps/
│   ├── storefront/
│   └── admin/
├── packages/
│   └── shared/
├── supabase/
├── docs/
└── README.md
```

## Move map

```text
bisnis/teestock/web/
→ systems/teestock-v1/apps/storefront/

apps/bisnishub-web/
→ systems/teestock-v1/apps/admin/

packages/shared/
→ systems/teestock-v1/packages/shared/

bisnis/teestock/supabase/
→ systems/teestock-v1/supabase/
```

`bisnis/teestock/database/` harus diaudit terlebih dahulu.

Jika isinya migration/source database historical tetapi masih canonical:

```text
merge/migrate → systems/teestock-v1/supabase/
```

Jika hanya docs/legacy:

```text
systems/teestock-v1/docs/database/
```

Jangan memiliki dua migration authorities setelah cleanup.

## Import changes

Storefront current:

```text
../../../packages/shared/src
```

menjadi kira-kira:

```text
../../packages/shared/src
```

Admin:

```text
../../packages/shared/src
```

juga akan berubah sesuai posisi baru.

Target desirable:

```text
@teestock/shared
```

Tetapi package rename dilakukan hanya setelah physical move stabil.

## Vercel

Current root `vercel.json` mengetahui:

```text
bisnis/teestock/web
```

Target:

Vercel project:

```text
Root Directory:
systems/teestock-v1/apps/storefront
```

Admin jika dideploy terpisah:

```text
systems/teestock-v1/apps/admin
```

Setelah project configuration diverifikasi, root `vercel.json` dapat dihapus.

## Verification

Storefront:

```text
npm ci
npm test
npm run build
npm run test:e2e
```

Admin:

```text
npm ci
npm test
npm run build
```

Shared:

semua consumer harus build.

Supabase:

```text
target project
config
functions
migrations
RLS
```

harus dipastikan unchanged.

### Acceptance

`bisnis/teestock/` akhirnya hanya berisi business knowledge:

```text
brand/
keuangan/
marketing/
operasional/
riset/
README.md
```

---

# 8. Migration Wave 3 — KasKita separation

## Current

```text
bisnis/kaskita/mobile/
bisnis/kaskita/supabase/
```

## Target

```text
systems/kaskita/
├── apps/
│   └── mobile/
├── supabase/
├── docs/
└── README.md
```

Business/product notes tetap:

```text
bisnis/kaskita/
```

Relevant technical PRD dapat:

```text
copy/promote canonical version
→ systems/kaskita/docs/
```

sementara business strategy tetap di:

```text
bisnis/kaskita/
```

### Verification

```text
npm ci
Expo config check
typecheck
test
build/dev smoke
Supabase config target validation
asset path validation
```

---

# 9. Migration Wave 4 — MGBOS System Move

## Current

```text
mgbos/
```

## Target

```text
systems/mgbos/
```

Ini adalah pure bounded-system move.

Jangan mengubah internal architecture pada PR ini.

## Affected paths

GitHub Workflow:

```text
working-directory: mgbos
```

menjadi:

```text
working-directory: systems/mgbos
```

Node version:

```text
mgbos/.node-version
→ systems/mgbos/.node-version
```

Cache:

```text
mgbos/pnpm-lock.yaml
→ systems/mgbos/pnpm-lock.yaml
```

Generated DB artifact:

```text
mgbos/packages/database/generated/database.types.ts
```

menjadi:

```text
systems/mgbos/packages/database/generated/database.types.ts
```

Root scripts:

```text
pnpm --dir mgbos
```

menjadi:

```text
pnpm --dir systems/mgbos
```

Migration immutability guard:

current prefix:

```text
mgbos/supabase/migrations/
```

menjadi:

```text
systems/mgbos/supabase/migrations/
```

Documentation links harus ikut berubah.

## Critical verification

```text
pnpm install --frozen-lockfile

pnpm check

pnpm db:start
pnpm db:reset
pnpm db:test
pnpm db:types

production HTTP smoke

business E2E when available
```

Kemudian hosted:

```text
MGBOS Foundation
Agent Governance
migration immutability
```

wajib hijau.

## ADR

ADR baru:

```text
ADR-015: MGBOS Canonical System Location
```

atau repository-level decision baru.

ADR-007 kemudian diberi status:

```text
SUPERSEDED
```

bukan dihapus.

---

# 10. Migration Wave 5 — Python Assistant Consolidation

## Current

```text
main.py
agent.py
requirements.txt
prompts/
memory/
```

## Target

```text
tools/assistant/
├── main.py
├── agent.py
├── requirements.txt
├── prompts/
└── memory/
```

Karena `agent.py` menggunakan:

```python
BASE_DIR = Path(__file__).parent
```

maka relative lookup `prompts/` dan `memory/` akan tetap konsisten bila seluruh unit dipindah bersama.

## Root cleanup

Tambahkan root alias bila diperlukan:

```json
"assistant": "python tools/assistant/main.py"
```

### Verification

```text
Python dependency install
assistant startup
persona load
memory read/write dengan fixture test
path test
```

Jangan gunakan data personal/live untuk automated tests.

---

# 11. Migration Wave 6 — Documentation Canonicalization

Ini bukan sekadar move.

Saat ini beberapa canonical MGBOS sources masih berasal dari:

```text
catatan/sesi/
```

Target baru:

```text
systems/mgbos/docs/specifications/
```

struktur:

```text
specifications/
├── canonical-data-model.md
├── business-state-machines.md
├── money-and-ledger.md
├── tenant-model.md
├── commercial-rules.md
├── production-and-qc.md
├── inventory-and-procurement.md
└── teestock-pilot.md
```

Historical session:

```text
catatan/sesi/2026-09-23 - MGBOS 0.3 — Business State Machines.md
```

tidak dihapus.

Tambahkan header:

```text
Status: Historical
Canonical source:
systems/mgbos/docs/specifications/business-state-machines.md
```

Tujuannya:

```text
catatan = how decision happened
docs = what current decision is
```

---

# 12. Migration Wave 7 — MGBOS Internal Naming

Baru setelah path stabil.

## Rename

```text
systems/mgbos/apps/mgbos/
→ systems/mgbos/apps/backoffice/
```

Package:

```text
@mgbos/app
→ @mgbos/backoffice
```

Scripts:

```text
pnpm --filter @mgbos/app
→ pnpm --filter @mgbos/backoffice
```

CI dan documentation ikut berubah.

App pairing menjadi:

```text
apps/
├── backoffice
└── teestock
```

Lebih jelas secara deployable responsibility.

Tidak ada business logic change di PR ini.

---

# 13. Engineering documentation cleanup

Current:

```text
mgbos/docs/engineering/
├── maintenance-policy.md
├── operational-readiness.md
├── mgbos-001-report.md
├── ...
└── mgbos-020-report.md
```

Target:

```text
docs/
├── engineering/
│   ├── maintenance-policy.md
│   ├── operational-readiness.md
│   └── agent-system/
│
├── evidence/
│   ├── mgbos-001.md
│   ├── ...
│   ├── mgbos-020.md
│   └── foundation/
│
├── architecture/
├── specifications/
├── adr/
└── runbooks/
```

Rule:

```text
engineering = current standard
evidence = what was verified historically
ADR = why architecture changed
specifications = canonical business/system contract
runbooks = how to operate system
```

---

# 14. `scratch/` cleanup

Current:

```text
scratch/seed_blank_catalog.mjs
```

Jika reusable:

```text
scripts/data/seed-blank-catalog.mjs
```

Jika one-time:

hapus dari tracked tree setelah evidence/reference disimpan.

New scratch harus memakai:

```text
.temp/
```

yang sudah gitignored.

---

# 15. Scripts taxonomy

Target:

```text
scripts/
├── governance/
│   ├── validate-agent-governance.py
│   └── check-migration-immutability.mjs
│
├── migration/
│   └── ...
│
├── setup/
│   └── external-ssd.ps1
│
├── data/
│   └── seed-blank-catalog.mjs
│
└── maintenance/
```

`tools/setup_external_ssd.ps1`

menjadi:

```text
scripts/setup/external-ssd.ps1
```

karena itu script, bukan application/tool.

---

# 16. Root target

Setelah seluruh migration:

```text
/
├── .agents/
├── .github/
├── .obsidian/
│
├── systems/
├── bisnis/
├── catatan/
├── docs/
├── tools/
├── scripts/
├── templates/
├── assets/
├── archive/
│
├── README.md
├── AGENTS.md
├── GEMINI.md
├── package.json
├── .gitignore
└── .gitattributes
```

Root tidak lagi memiliki:

```text
application source
database
business runtime
Python program files
legacy deploy config
prototype app
```

---

# 17. Root package.json setelah migration

Root `package.json` tetap berfungsi sebagai command router, bukan dependency workspace.

Contoh target:

```json
{
  "name": "bisnishub",
  "private": true,
  "scripts": {
    "dev:mgbos": "npm exec --yes --package=pnpm@10.34.5 -- pnpm --dir systems/mgbos dev",
    "check:mgbos": "npm exec --yes --package=pnpm@10.34.5 -- pnpm --dir systems/mgbos check",
    "build:mgbos": "npm exec --yes --package=pnpm@10.34.5 -- pnpm --dir systems/mgbos build",

    "dev:teestock-v1": "npm --prefix systems/teestock-v1/apps/storefront run dev",
    "build:teestock-v1": "npm --prefix systems/teestock-v1/apps/storefront run build",

    "dev:teestock-admin": "npm --prefix systems/teestock-v1/apps/admin run dev",

    "dev:kaskita": "npm --prefix systems/kaskita/apps/mobile run start",

    "assistant": "python tools/assistant/main.py"
  }
}
```

Root **tidak** dijadikan pnpm workspace dalam migration ini.

---

# 18. CI target setelah migration

GitHub workflows secara konseptual menjadi:

```text
.github/workflows/
├── mgbos-ci.yml
├── teestock-v1-ci.yml
├── kaskita-ci.yml
├── agent-governance.yml
└── repository-integrity.yml
```

`repository-integrity.yml` nantinya dapat mengecek:

```text
forbidden runnable code under bisnis/
forbidden deployment config under archive/
broken relative documentation links
applied migration modification
generated type drift
agent governance
directory ownership rules
```

Contoh policy:

```text
bisnis/**/package.json
→ FAIL

catatan/**/package.json
→ FAIL

archive/**/vercel.json
→ FAIL / warning

systems/*/
→ expected README / ownership metadata
```

---

# 19. Migration acceptance template

Setiap wave menggunakan evidence template yang sama.

```text
Migration:
Base commit:
Head commit:

Scope:
From:
To:

Runtime consumer audit:
- ...

Path references updated:
- ...

Local verification:
- install:
- lint:
- typecheck:
- unit:
- integration:
- build:
- database:
- smoke:

Hosted CI:
- ...

Deployment configuration:
- verified / not applicable

Database target:
- unchanged / verified

Known issues:
- ...

Rollback:
- revert commit / restore previous root configuration

Acceptance:
- PASS / BLOCKED
```

---

# 20. Rollback strategy

Untuk directory migration, rollback terbaik bukan script custom.

Gunakan:

```text
PR atomic
+
single-system migration
+
git revert
```

Jangan migration database bersama directory move.

Jangan delete old deployment configuration sebelum target baru diverifikasi.

Untuk Vercel misalnya:

```text
1. move code
2. update project root
3. deploy preview
4. verify
5. production cutover
6. baru hapus compatibility config
```

Tidak boleh:

```text
move
+
delete old config
+
production cutover
```

dalam satu langkah tanpa evidence.

---

# 21. Migration dependency graph

```text
Wave 0
Safety
  │
  ├──────────────┐
  ▼              ▼
Wave 1         Wave 3
Prototype      KasKita
retirement
  │
  ▼
Wave 2
TeeStock v1
  │
  ▼
Wave 4
MGBOS move
  │
  ├──────────────┐
  ▼              ▼
Wave 5         Wave 6
Assistant      Docs canonicalization
                 │
                 ▼
               Wave 7
               App rename
```

Wave 4 jangan dikerjakan bersamaan dengan Wave 2.

---

# 22. Perubahan yang sengaja ditunda

Tidak dilakukan pada cleanup ini:

```text
root pnpm workspace
Turborepo
Nx
microservices
ORM
database redesign
dependency upgrades besar
MGBOS business fixes
new features
shared design-system rewrite
AI runtime deployment
n8n production activation
```

Cleanup harus mengurangi complexity, bukan menambah platform baru.

---

# 23. Definition of Done

Repository Cleanup v1 dianggap selesai jika:

```text
1. Semua runnable systems berada di systems/.

2. bisnis/ hanya berisi business knowledge.

3. catatan/ hanya berisi historical/work notes.

4. MGBOS prototype berada di archive/ dan tidak deployable.

5. TeeStock storefront/admin/shared/database berada dalam satu bounded system.

6. MGBOS berada di satu canonical path tanpa duplicate MGBOS runtime.

7. Python assistant berada dalam tools/assistant/.

8. CI tidak lagi bergantung pada historical paths.

9. Deployment configuration menunjuk canonical system paths.

10. Canonical MGBOS specifications tidak bergantung pada catatan/sesi sebagai source of truth.

11. main protected dan required checks aktif.

12. Tidak ada feature/business behavior change yang tersembunyi dalam migration commits.
```

---

# 24. Recommended execution order

Urutan implementasi resmi:

```text
RC-000  Safety baseline + branch protection
RC-001  Retire legacy MGBOS prototype
RC-002  Consolidate TeeStock v1
RC-003  Extract KasKita runtime
RC-004  Move MGBOS to systems/
RC-005  Consolidate Python assistant
RC-006  Promote canonical MGBOS specifications
RC-007  Rename MGBOS internal app to backoffice
RC-008  Final repository integrity cleanup
```

Setiap RC adalah PR terpisah.

---

# 25. Final architecture principle

Repository BisnisHub setelah migration harus memiliki satu aturan yang bisa dijelaskan dengan satu kalimat:

> **`systems/` menjalankan bisnis, `bisnis/` menjelaskan bisnis, `catatan/` menyimpan sejarahnya, dan root mengendalikan semuanya.**


Gue menyarankan **jangan langsung mulai dari memindahkan `mgbos/`**, meskipun itu fokus utama kita. Urutan paling aman adalah **RC-000 → RC-001 → RC-002**, karena setelah prototype dan TeeStock legacy dibereskan, root sudah jauh lebih bersih sebelum MGBOS sendiri dipindahkan.

Setelah itu, `mgbos/ → systems/mgbos/` menjadi perubahan yang jauh lebih mudah diaudit dan risikonya lebih kecil.