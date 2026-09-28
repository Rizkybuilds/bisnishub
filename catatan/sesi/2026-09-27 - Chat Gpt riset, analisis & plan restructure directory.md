Sudah gue analisa ulang **commit terbaru** dan bandingkan dengan kondisi yang kita audit sebelumnya.

Commit terbaru di `main` sekarang adalah:

`3c3ccb39236c97a2c36093669bedad89ae99a3ce` — **27 September 2026, 08:09 WIB**  
`docs(repo): clarify project ownership and official MGBOS routing`

Commit ini berada **2 commit di depan** revision audit sebelumnya `f4cc36b...`. Kedua workflow terbaru—**MGBOS Foundation** dan **Agent Governance**—berhasil pada revision ini.

Yang penting: dua commit terakhir **belum melakukan perpindahan fisik directory**. Mereka justru sudah melakukan langkah yang benar sebelum refactor: memperjelas ownership, routing, governance, migration immutability, dan merencanakan struktur `projects/`.

Setelah membandingkan struktur aktual, dokumentasi baru tersebut, dependency antar-folder, pola deployment, serta best practice pnpm/Next.js/Supabase/Vercel/GitHub, gue menyarankan **sedikit mengubah target struktur yang sekarang direncanakan**.

## Kesimpulan utama

Struktur repo lo sekarang sebenarnya memuat **tiga hal berbeda dalam satu root**:

1. **Software systems**
   - MGBOS
   - TeeStock existing
   - BisnisHub admin existing
   - Kaskita
   - MGBOS prototype

2. **Business knowledge base**
   - `bisnis/`
   - `catatan/`
   - templates
   - Obsidian

3. **Engineering/AI control plane**
   - `.agents/`
   - `.github/`
   - governance scripts
   - Python assistant
   - prompts/memory

Masalah utama bukan ukuran repo. Masalahnya adalah **semantic boundary**.

Sekarang satu nama folder bisa berarti hal berbeda:

```text
apps/
    aplikasi lama

mgbos/apps/
    aplikasi resmi baru

bisnis/teestock/web/
    aplikasi produksi/existing

packages/
    shared legacy

mgbos/packages/
    shared resmi MGBOS

bisnis/*/
    sebagian dokumentasi bisnis,
    sebagian database,
    sebagian aplikasi,
    sebagian tooling
```

Ini membuat manusia dan coding agent harus mengetahui sejarah repo untuk tahu folder mana yang authoritative.

Itu yang menurut gue harus kita hilangkan.

---

# 1. Kondisi repository terbaru

Revision terbaru memiliki sekitar:

```text
1,069 tracked files
321 directories
```

Top-level directory saat ini:

```text
.agents/
.github/
.obsidian/

apps/
assets/
bisnis/
catatan/
docs/
memory/
mgbos/
packages/
prompts/
scratch/
scripts/
templates/
tools/
```

ditambah cukup banyak root files:

```text
README.md
AGENTS.md
ARCHITECTURE.md
GEMINI.md

main.py
agent.py
requirements.txt

package.json
vercel.json

🏠 BisnisHub Command Center.md
🗺️ BisnisHub Ecosystem.canvas
...
```

Struktur ini masih bisa digunakan, tetapi **root sudah terlalu banyak memiliki tanggung jawab**.

---

# 2. Hal yang sudah diperbaiki commit terbaru

Ada perubahan yang menurut gue tepat dan sebaiknya dipertahankan.

Sekarang `README.md` sudah secara eksplisit menyatakan bahwa:

```text
mgbos/apps/mgbos/
```

adalah MGBOS resmi dan:

```text
apps/mgbos/
```

adalah prototype lama.

Root command juga sudah diperbaiki.

Sekarang:

```bash
npm run dev:mgbos
```

mengarah ke:

```text
mgbos/
```

sementara prototype lama memakai:

```bash
npm run dev:mgbos-prototype
```

Ini jauh lebih aman daripada kondisi audit sebelumnya.

Commit sebelumnya juga sudah menambahkan:

```text
.agents/roles/
.agents/evals/

mgbos/docs/engineering/agent-system/

scripts/governance/
.github/workflows/agent-governance.yml
```

Artinya engineering control plane sekarang mulai mempunyai struktur nyata.

**Gue tidak menyarankan merombak `.agents/` lagi.**

---

# 3. Riset best practice yang relevan

Ada beberapa prinsip dari dokumentasi resmi yang sangat relevan.

pnpm memang dirancang untuk monorepo dan mendukung workspace, filtering, local workspace dependencies, serta single lockfile. Tetapi keuntungan itu paling besar ketika paket memang berada dalam **satu dependency graph**, bukan sekadar kebetulan berada dalam satu Git repository. :chatgpt-content-reference{index="0"}

Jadi gue **tidak menyarankan langsung menyatukan semua package manager sekarang**.

MGBOS boleh tetap menjadi workspace pnpm sendiri sementara legacy masih dimigrasikan.

Untuk Next.js, `src/`, route groups `(group)`, colocated components/data/actions, dan private folders memang merupakan pola yang didukung. Jadi struktur internal aplikasi MGBOS lo sebenarnya tidak perlu dipindah ke pola `controllers/services/repositories` hanya demi terlihat enterprise. :chatgpt-content-reference{index="1"}

Untuk Supabase, project-scoped:

```text
supabase/
├── config.toml
├── migrations/
├── functions/
├── tests/
└── seed.sql
```

memang merupakan struktur resmi yang direkomendasikan. Jadi keputusan untuk menyimpan Supabase **di dalam boundary tiap sistem**, bukan satu global Supabase root, sudah benar. :chatgpt-content-reference{index="2"}

Dan Vercel secara resmi mendukung beberapa project dari satu Git monorepo dengan **Root Directory berbeda untuk masing-masing app**. Jadi kita tidak perlu mempertahankan satu `vercel.json` root yang mengetahui detail aplikasi jauh di bawahnya. :chatgpt-content-reference{index="3"}

---

# 4. Gue setuju dengan ide `projects/`, tapi akan mengubah namanya

ADR terbaru merencanakan:

```text
projects/
├── mgbos/
├── teestock-platform/
└── kaskita/
```

Secara teknis ini valid.

Tapi untuk repo lo, gue lebih merekomendasikan:

```text
systems/
```

daripada:

```text
projects/
```

Alasannya sederhana.

MGBOS bukan proyek sementara.

TeeStock storefront bukan proyek sementara.

Kaskita bukan proyek sementara.

Mereka adalah **long-lived software systems** dengan:

```text
runtime
database
deployment
dependency graph
CI
documentation
ownership
```

Sementara kata `project` di repo lo juga bisa berarti:

```text
proyek marketing
proyek bisnis
eksperimen
campaign
inisiatif
```

Jadi taxonomy yang lebih jelas adalah:

```text
systems/   → software yang dijalankan

bisnis/    → pengetahuan dan operasi bisnis

catatan/   → histori pemikiran / sesi / jurnal

docs/      → governance repository
```

Ini menurut gue paling cocok dengan karakter BisnisHub.

Kalau lo ingin meminimalkan churn, `projects/` tetap acceptable. **Perbedaan teknisnya kecil.** Tapi kalau kita akan melakukan refactor besar sekali, gue memilih `systems/`.

---

# 5. Target structure yang gue rekomendasikan

Long-term target-nya:

```text
bisnishub/
│
├── .agents/
├── .github/
├── .obsidian/
│
├── systems/
│   │
│   ├── mgbos/
│   │   ├── apps/
│   │   │   ├── backoffice/
│   │   │   └── teestock/
│   │   │
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
│   │   │
│   │   ├── supabase/
│   │   │   ├── migrations/
│   │   │   ├── tests/
│   │   │   ├── functions/
│   │   │   └── config.toml
│   │   │
│   │   ├── automation/
│   │   │   └── n8n/
│   │   │
│   │   ├── docs/
│   │   ├── scripts/
│   │   │
│   │   ├── package.json
│   │   ├── pnpm-workspace.yaml
│   │   └── pnpm-lock.yaml
│   │
│   │
│   ├── teestock-v1/
│   │   ├── apps/
│   │   │   ├── storefront/
│   │   │   └── admin/
│   │   │
│   │   ├── packages/
│   │   │   └── shared/
│   │   │
│   │   ├── supabase/
│   │   ├── docs/
│   │   └── README.md
│   │
│   │
│   └── kaskita/
│       ├── apps/
│       │   └── mobile/
│       ├── supabase/
│       ├── docs/
│       └── README.md
│
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
│       ├── agent.py
│       ├── main.py
│       ├── prompts/
│       ├── memory/
│       └── requirements.txt
│
├── scripts/
│   ├── governance/
│   ├── migration/
│   └── setup/
│
├── templates/
├── assets/
│
├── archive/
│   └── mgbos-vite-prototype/
│
├── README.md
├── AGENTS.md
├── GEMINI.md
└── package.json
```

Ini menurut gue target paling sehat untuk repo lo.

---

# 6. Prinsip terpenting: `bisnis/` jangan berisi executable system lagi

Ini salah satu perubahan paling penting.

Sekarang:

```text
bisnis/teestock/
```

berisi:

```text
brand/
keuangan/
marketing/
operasional/
riset/

web/
database/
supabase/
tools/
```

Jadi satu folder adalah sekaligus:

```text
business knowledge
+
software
+
database infrastructure
+
developer tooling
```

Itu harus dipisahkan.

Setelah migrasi:

```text
bisnis/teestock/
```

hanya:

```text
brand/
keuangan/
marketing/
operasional/
riset/
README.md
```

Sedangkan implementation-nya:

```text
systems/teestock-v1/
```

Ini membuat rule yang sangat sederhana:

> **Folder `bisnis/` tidak pernah dibuild dan tidak pernah dideploy.**

Itu rule yang sangat bagus untuk coding agent juga.

---

# 7. TeeStock legacy harus dijadikan satu bounded system

Sekarang aplikasi TeeStock existing tersebar di tiga tempat:

```text
bisnis/teestock/web/
apps/bisnishub-web/
packages/shared/
```

Padahal ketiganya saling terkait.

`apps/bisnishub-web/vite.config.ts` mengimpor:

```text
../../packages/shared/src
```

sedangkan TeeStock web mengimpor:

```text
../../../packages/shared/src
```

Bahkan UI admin existing menyebut dirinya **TeeStock Admin Hub**.

Jadi secara ownership mereka seharusnya:

```text
systems/teestock-v1/
├── apps/
│   ├── storefront/
│   └── admin/
│
├── packages/
│   └── shared/
│
└── supabase/
```

Ini akan menghilangkan tiga top-level semantic leaks sekaligus:

```text
apps/
packages/
bisnis/.../web
```

---

# 8. `apps/mgbos/` prototype harus dipensiunkan ke `archive/`

Sekarang kita punya:

```text
apps/mgbos/        ← Vite prototype

mgbos/apps/mgbos/  ← actual MGBOS
```

Meskipun dokumentasi sekarang sudah menjelaskan perbedaannya, nama ini tetap berbahaya.

Manusia baru atau AI agent masih akan melihat:

```text
apps/mgbos
```

dan secara intuitif menganggapnya canonical.

Setelah memastikan tidak ada feature unik/consumer aktif:

```text
apps/mgbos/
```

pindahkan ke:

```text
archive/mgbos-vite-prototype/
```

Di dalam archive tambahkan:

```text
README.md

Status: RETIRED
Replacement: systems/mgbos/apps/backoffice
Last active version: ...
Do not deploy
```

Dan keluarkan dari:

```text
install:all
build
CI
deployment
```

Archive seharusnya **referensi**, bukan secondary executable path.

---

# 9. Rename `mgbos/apps/mgbos`

Ada satu redundancy kecil:

Jika MGBOS akhirnya berada di:

```text
systems/mgbos/
```

maka:

```text
systems/mgbos/apps/mgbos/
```

menjadi sedikit membingungkan.

Nama app sebaiknya mencerminkan **deployable unit**, bukan nama system induk.

Gue lebih merekomendasikan:

```text
systems/mgbos/apps/backoffice/
```

atau:

```text
systems/mgbos/apps/ops/
```

Pilihan gue:

```text
backoffice
```

Sehingga:

```text
@mgbos/backoffice
```

lebih informatif daripada:

```text
@mgbos/app
```

Dan pasangannya:

```text
apps/
├── backoffice
└── teestock
```

langsung dapat dimengerti.

Ini sebaiknya PR tersendiri setelah physical migration selesai.

---

# 10. Internal `mgbos/packages/` jangan dirombak

Bagian ini justru sudah bagus:

```text
packages/
├── ai
├── auth
├── config
├── database
├── domain
├── events
├── integrations
├── ui
└── validation
```

Ini jelas dan sesuai modular-monolith boundary.

Gue **tidak menyarankan** mengubahnya menjadi:

```text
services/
controllers/
repositories/
models/
helpers/
utils/
```

karena itu malah mengaburkan domain boundary.

`domain` sebagai pure TypeScript package sangat tepat.

`database` sebagai infrastructure boundary tepat.

`validation`, `events`, `integrations`, `ai` juga cukup jelas.

---

# 11. Jangan membuat `src/features/` hanya karena sedang cleanup

Struktur aplikasi Next.js sekarang secara umum menggunakan:

```text
src/app/
```

dengan route groups seperti:

```text
(auth)
(app)
(documents)
```

Ini merupakan fitur resmi Next.js untuk organisasi routes. :chatgpt-content-reference{index="4"}

Jadi jangan berubah menjadi:

```text
src/features/customers/
src/features/orders/
src/features/payments/
...
```

hanya agar terlihat lebih modern.

Colocation:

```text
orders/
├── page.tsx
├── actions.ts
├── data.ts
├── OrderCreateForm.tsx
└── [orderId]/
```

masih masuk akal.

Kalau file internal mulai banyak, baru gunakan:

```text
orders/
├── page.tsx
├── _components/
├── _actions/
└── _lib/
```

Private folders memang didukung Next.js untuk memisahkan implementation detail dari routing. :chatgpt-content-reference{index="5"}

---

# 12. MGBOS docs juga perlu dirapikan

Sekarang:

```text
mgbos/docs/engineering/
```

berisi:

```text
maintenance-policy.md
operational-readiness.md
agent-system/

mgbos-001-report.md
mgbos-002-report.md
...
mgbos-020-report.md

foundation-recheck
pre-implementation-audit
```

Ada dua jenis document bercampur:

### Living engineering standard

```text
maintenance-policy
agent-system
operational-readiness
```

dan:

### Historical evidence/report

```text
mgbos-001-report
...
mgbos-020-report
foundation-recheck
```

Sebaiknya:

```text
docs/
├── adr/
├── architecture/
├── product/
├── engineering/
├── runbooks/
│
├── evidence/
│   ├── mgbos-001.md
│   ├── mgbos-002.md
│   ├── ...
│   ├── mgbos-020.md
│   └── 2026-09-26-foundation-recheck.md
│
└── archive/
```

Sehingga:

```text
engineering/
```

selalu berarti **aturan yang masih berlaku**.

Dan:

```text
evidence/
```

berarti **bukti pelaksanaan pada revision tertentu**.

Ini sangat membantu AI agent karena report lama tidak keliru dianggap aturan canonical.

---

# 13. `catatan/` tidak boleh menjadi source of truth MGBOS selamanya

Sekarang beberapa spesifikasi penting masih berada di:

```text
catatan/sesi/
```

misalnya:

```text
MGBOS 0.2 Canonical Data Model
MGBOS 0.3 Business State Machines
MGBOS 0.4 System Architecture
MGBOS 0.5.x
```

Saat ini MGBOS instructions bahkan harus berkata:

> beberapa source notes lama masih canonical.

Ini transitional smell.

Long term:

```text
catatan/sesi/
```

harus menjadi **history** saja.

Canonical material dipromosikan ke:

```text
systems/mgbos/docs/specifications/
```

misalnya:

```text
specifications/
├── canonical-data-model.md
├── state-machines.md
├── commercial-rules.md
├── tenant-model.md
├── money-and-ledger.md
└── teestock-pilot.md
```

Session lama kemudian hanya berkata:

```text
Superseded/promoted to:
../../systems/mgbos/docs/specifications/state-machines.md
```

Ini akan mengurangi ambiguity sangat besar.

---

# 14. Python assistant harus keluar dari root

Sekarang:

```text
agent.py
main.py
requirements.txt

prompts/
memory/
```

semuanya merupakan **satu aplikasi/tool**.

`agent.py` sendiri mendefinisikan:

```python
BASE_DIR = Path(__file__).parent
PROMPTS_DIR = BASE_DIR / "prompts"
MEMORY_DIR = BASE_DIR / "memory"
```

Jadi sebenarnya sangat mudah dipindahkan sebagai satu unit:

```text
tools/assistant/
├── agent.py
├── main.py
├── prompts/
├── memory/
└── requirements.txt
```

Tidak perlu langsung mengubah source-nya karena relative path tetap bekerja.

Ini clean migration yang risikonya relatif rendah.

---

# 15. `scratch/` tidak seharusnya menyimpan tracked operational script

Sekarang:

```text
scratch/seed_blank_catalog.mjs
```

adalah tracked script.

Kalau script penting dan reusable:

```text
scripts/data/
seed-blank-catalog.mjs
```

Kalau one-off:

```text
.tmp/
```

dan gitignored.

Rule-nya:

```text
scratch = disposable
scripts = reproducible
```

Saat ini boundary tersebut belum jelas.

---

# 16. `tools/` dan `scripts/` perlu dibedakan

Gue sarankan:

### `scripts/`

Command yang dieksekusi untuk repo:

```text
scripts/
├── governance/
├── migration/
├── setup/
└── maintenance/
```

Contohnya:

```text
setup_external_ssd.ps1
```

lebih tepat:

```text
scripts/setup/external-ssd.ps1
```

### `tools/`

Software/tool yang punya lifecycle sendiri:

```text
tools/
└── assistant/
```

Jadi:

> script = command  
> tool = program

---

# 17. Root harus sangat membosankan

Root yang sehat harus bisa dipahami dalam 10 detik.

Idealnya:

```text
.agents/
.github/
.obsidian/

systems/
bisnis/
catatan/
docs/
tools/
scripts/
templates/
assets/
archive/

README.md
AGENTS.md
GEMINI.md
package.json
.gitignore
```

Bukan 15 executable entrypoint dari berbagai era.

Root adalah **control plane**, bukan application directory.

---

# 18. Root `vercel.json` sebaiknya akhirnya dihapus

Sekarang root:

```text
vercel.json
```

masih hardcode:

```text
bisnis/teestock/web
```

Ini mempertahankan sejarah lokasi aplikasi ke dalam root.

Setelah TeeStock dipindah:

```text
systems/teestock-v1/apps/storefront/
```

lebih baik Vercel project menggunakan **Root Directory** ke app tersebut.

Vercel memang dirancang untuk satu monorepo yang mempunyai banyak project dengan root directory masing-masing. :chatgpt-content-reference{index="6"}

Kemudian:

```text
systems/mgbos/apps/backoffice
systems/mgbos/apps/teestock
systems/teestock-v1/apps/storefront
```

masing-masing dapat menjadi independent deployment target.

Root repo tidak perlu mengetahui detail build masing-masing.

---

# 19. Jangan dulu membuat satu root pnpm workspace

Ini mungkin terdengar berlawanan dengan best practice monorepo, tetapi untuk kondisi lo sekarang **ini keputusan yang lebih aman**.

Sekarang ada:

```text
MGBOS → pnpm

TeeStock legacy → npm

BisnisHub admin → npm

MGBOS prototype → npm

Kaskita → npm
```

Langsung menyatukannya berarti sekaligus mengubah:

```text
directory
package manager
lockfiles
dependency resolution
CI
Vercel behavior
build graph
```

Itu terlalu banyak variable dalam satu migration.

Gue sarankan:

### Stage 1

```text
physical boundary cleanup
```

### Stage 2

```text
stabilize
```

### Stage 3

baru evaluasi:

```text
one root pnpm workspace
```

pnpm memang menawarkan single lockfile dan filter untuk monorepo. :chatgpt-content-reference{index="7"}

Tapi itu optimization kedua.

**Directory ownership lebih penting sekarang.**

---

# 20. Turborepo belum perlu

Gue juga tidak menyarankan menambahkan Turborepo dalam cleanup ini.

Sekarang MGBOS workspace belum cukup besar untuk membutuhkan another orchestration layer.

Saat ini:

```text
pnpm --filter
pnpm -r
GitHub Actions
```

sudah cukup.

Turborepo baru masuk akal jika nanti:

```text
1 root pnpm workspace
+
banyak apps
+
banyak packages
+
CI build time tinggi
+
affected dependency graph penting
```

Jangan menggabungkan:

```text
folder migration
+
package-manager migration
+
Turborepo adoption
```

dalam satu initiative.

---

# 21. Tambahkan CODEOWNERS setelah boundary baru tersedia

Repo belum punya:

```text
CODEOWNERS
```

Setelah `systems/` terbentuk, ownership dapat menjadi eksplisit:

```text
/systems/mgbos/          @Rizkybuilds
/systems/teestock-v1/    @Rizkybuilds
/systems/kaskita/        @Rizkybuilds

/.agents/                @Rizkybuilds
/.github/                @Rizkybuilds

/scripts/governance/     @Rizkybuilds
```

GitHub memang mendukung path-based owners melalui `.github/CODEOWNERS`. :chatgpt-content-reference{index="8"}

Saat tim bertambah nanti:

```text
/systems/mgbos/packages/domain/ @finance-team @engineering
```

bisa dibuat lebih granular.

---

# 22. Dan `main` masih belum protected

Revision terbaru masih menunjukkan:

```text
main.protected = false
```

Padahal sekarang repo sudah punya:

```text
MGBOS Foundation
Agent Governance
Migration Immutability
```

Sayang sekali kalau seluruh gate tersebut masih bisa dilewati direct push.

GitHub memungkinkan protected branches mewajibkan required status checks sebelum merge. :chatgpt-content-reference{index="9"}

Sebelum large folder migration, sebaiknya ini dibereskan.

Karena refactor path sebesar ini merupakan tipe perubahan yang paling mudah membuat sesuatu diam-diam rusak.

---

# 23. Move map yang gue rekomendasikan

Secara konkret:

| Sekarang | Target |
|---|---|
| `mgbos/` | `systems/mgbos/` |
| `bisnis/teestock/web/` | `systems/teestock-v1/apps/storefront/` |
| `apps/bisnishub-web/` | `systems/teestock-v1/apps/admin/` |
| `packages/shared/` | `systems/teestock-v1/packages/shared/` |
| `bisnis/teestock/supabase/` | `systems/teestock-v1/supabase/` |
| `bisnis/teestock/database/` | audit → merge ke `supabase/` bila sesuai |
| `bisnis/kaskita/mobile/` | `systems/kaskita/apps/mobile/` |
| `bisnis/kaskita/supabase/` | `systems/kaskita/supabase/` |
| `apps/mgbos/` | `archive/mgbos-vite-prototype/` |
| `agent.py` | `tools/assistant/agent.py` |
| `main.py` | `tools/assistant/main.py` |
| `prompts/` | `tools/assistant/prompts/` |
| `memory/` | `tools/assistant/memory/` |
| root `requirements.txt` | `tools/assistant/requirements.txt` |
| `scratch/seed_blank_catalog.mjs` | `scripts/data/seed-blank-catalog.mjs` |
| `tools/setup_external_ssd.ps1` | `scripts/setup/external-ssd.ps1` |

Yang **tidak pindah**:

```text
.agents/
.github/
.obsidian/

bisnis/
catatan/
templates/

README.md
AGENTS.md
GEMINI.md
```

---

# 24. Tapi jangan lakukan semuanya dalam satu commit

Ini sangat penting.

Jangan membuat:

```text
refactor: reorganize repository
```

dengan 700 file sekaligus.

Buat migration wave.

### Wave 0 — Safety

Tidak pindah file.

Kerjakan:

```text
protect main
CODEOWNERS
baseline CI
record current deployment roots
record database targets
record app smoke baseline
```

---

### Wave 1 — Retire MGBOS prototype

```text
apps/mgbos
→ archive/mgbos-vite-prototype
```

Update:

```text
scripts
README
project index
AGENTS
```

Pastikan tidak ada consumer.

---

### Wave 2 — TeeStock existing consolidation

Pindahkan bersama:

```text
bisnis/teestock/web
apps/bisnishub-web
packages/shared
bisnis/teestock/supabase
```

ke:

```text
systems/teestock-v1/
```

Ini satu bounded system sehingga memang masuk akal menjadi satu migration.

Verifikasi:

```text
storefront build
admin build
unit tests
Playwright
Supabase target
Vercel
shared imports
```

---

### Wave 3 — Kaskita

```text
bisnis/kaskita/mobile
bisnis/kaskita/supabase
```

→

```text
systems/kaskita/
```

---

### Wave 4 — MGBOS physical move

```text
mgbos/
→ systems/mgbos/
```

Ini harus menjadi PR sendiri karena memengaruhi:

```text
CI working-directory
node-version paths
pnpm lock path
Supabase wrapper
AGENTS
root aliases
docs
migration guard
Vercel configs
```

Setelah itu baru ADR-007 coexistence dapat ditutup/replaced.

---

### Wave 5 — Python assistant

Pindahkan sebagai satu unit:

```text
agent.py
main.py
prompts/
memory/
requirements.txt
```

→

```text
tools/assistant/
```

---

### Wave 6 — Canonical documentation

Promosikan source of truth dari:

```text
catatan/sesi/
```

ke:

```text
systems/mgbos/docs/specifications/
```

Lalu session lama hanya menjadi historical record.

---

### Wave 7 — Internal naming cleanup

Baru kemudian:

```text
systems/mgbos/apps/mgbos
→ systems/mgbos/apps/backoffice
```

Dan:

```text
@mgbos/app
→ @mgbos/backoffice
```

---

# 25. Struktur final yang ingin kita capai secara mental

Setelah cleanup, seorang developer atau AI agent seharusnya cukup mengetahui empat aturan:

```text
Mau mengubah software?
→ systems/

Mau mengubah aturan/bisnis/brand?
→ bisnis/

Mau membaca sejarah diskusi?
→ catatan/

Mau mengubah repo automation?
→ .github / .agents / scripts / tools
```

Tidak perlu tahu bahwa:

```text
"dulu MGBOS ada dua"
"TeeStock admin ternyata ada di apps"
"shared package ternyata punya TeeStock"
"web app ternyata ada di folder bisnis"
```

Itulah menurut gue ukuran repository architecture yang bagus.

---

# Rekomendasi akhir

**Jangan menjalankan target `projects/` yang ada di ADR sekarang secara otomatis.**

ADR terbaru sudah mengambil arah yang benar, tetapi sebelum physical migration gue merekomendasikan mengubah target menjadi:

```text
systems/
```

dan menggunakan struktur bounded-system seperti di atas.

Tiga keputusan utama yang gue rekomendasikan adalah:

1. **Runnable software hanya boleh berada di `systems/`.**
2. **`bisnis/` dan `catatan/` tidak boleh berisi executable application/database runtime.**
3. **Setiap system memiliki apps, packages, database/Supabase, docs dan scripts miliknya sendiri.**

Untuk MGBOS sendiri, **jangan melakukan architectural folder rewrite besar**. Struktur `apps + packages + supabase + docs + automation` saat ini justru sudah mendekati bentuk yang benar. Yang perlu kita lakukan hanyalah **memindahkan workspace sebagai satu bounded system dan membersihkan dokumentasi/historical evidence-nya**, bukan membongkar domain package atau Next.js route organization.

Tahap berikut yang paling masuk akal adalah menyusun **Repository Cleanup & Directory Migration Plan v1** yang sangat konkret: daftar setiap folder/file yang pindah, urutan PR, import/path yang terdampak, perubahan CI/Vercel/Supabase, validation command per wave, dan rollback plan—**tanpa memindahkan satu file pun dulu**.