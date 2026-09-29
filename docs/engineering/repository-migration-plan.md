# Repository Cleanup & Directory Migration Plan v1

Tanggal: 2026-09-28. Owner keputusan: Rizky. Status: tahap 0a selesai dan tahap 1 prototype diarsipkan secara lokal; sistem lain belum dipindahkan.

## Tujuan dan baseline

Pisahkan software yang dijalankan ke `systems/`, pengetahuan bisnis ke `bisnis/`, histori ke `catatan/`, serta program bantu ke `tools/`. Keputusan lokasi dimiliki [ADR-001](../decisions/001-repository-organization.md); [indeks proyek](../project-index.md) tetap mencatat lokasi aktif.

Audit awal: checkout `C:/Users/Rizky/bisnishub`, base `ba4a6d2` pada `main`, working tree bersih. Pengerjaan rencana berada di branch `codex/repository-migration-plan`. Dua worktree lain terdaftar di `.temp/mgbos-001-review` dan `.temp/mgbos-agent-governance`; status pekerjaan/prosesnya belum diverifikasi. Jangan memindahkan atau menghapus checkout tersebut.

Sumber pembahasan: seluruh 10 catatan dalam `catatan/sesi/` bertanggal 2026-09-27, terutama catatan riset/restructure directory, MGBOS Control Plane, JARVIS Architecture v0.1, JARVIS v0.2, serta penutup sesi. Catatan adalah konteks desain, bukan bukti kesiapan layanan. Angka pengujian, branch protection, harga/model/provider dan status PR historis tidak dinyatakan sebagai kondisi terkini.

Scope tahap ini: rencana, ADR dan navigasi root. Risiko R0 menurut [klasifikasi aktif](../../systems/mgbos/docs/engineering/agent-system/risk-classification.md), tanpa perubahan kewenangan. Klasifikasi tiap migrasi ditentukan ulang dari diff; pemindahan CI/guard bukan sekadar perubahan dokumentasi. Skala R0–R5 dalam blueprint JARVIS tidak menggantikan skala engineering aktif R0–R3.

## Peta perpindahan

| Sumber aktif | Tujuan | Tahap / syarat |
| --- | --- | --- |
| `apps/mgbos/` | `archive/mgbos-vite-prototype/` | 1; konfirmasi fitur unik, consumer, proses dan deployment |
| `bisnis/teestock/web/` | `systems/teestock-v1/apps/storefront/` | 2; bersama admin/shared |
| `apps/bisnishub-web/` | `systems/teestock-v1/apps/admin/` | 2 |
| `packages/shared/` | `systems/teestock-v1/packages/shared/` | 2; seluruh consumer termasuk prototype |
| `bisnis/teestock/supabase/` | `systems/teestock-v1/supabase/` | 2; junction dan metadata lokal |
| `bisnis/teestock/database/` | `systems/teestock-v1/database/` | 2; pertahankan SQL historis dan consumer test |
| `bisnis/kaskita/mobile/` | `systems/kaskita/apps/mobile/` | 3 |
| `bisnis/kaskita/supabase/` | `systems/kaskita/supabase/` | 3; target database terpisah |
| `mgbos/` | `systems/mgbos/` | 4; guard relokasi harus siap terlebih dahulu |
| `agent.py`, `main.py`, `requirements.txt`, `prompts/`, `memory/` | `tools/assistant/` dengan nama anak tetap | 5; ekspor sesi tetap menuju catatan root |
| Spesifikasi MGBOS dalam catatan | `systems/mgbos/docs/specifications/` | 6; promosi isi terpilih dengan sumber/provenance |
| Laporan historis engineering MGBOS | `systems/mgbos/docs/evidence/` | 6; standar aktif tetap di engineering |
| `systems/mgbos/apps/mgbos/` | `systems/mgbos/apps/backoffice/` | 7; rename app dan package terpisah dari tahap 4 |

`database/` TeeStock tidak digabung otomatis ke migrasi Supabase: berisi schema, patch, seed dan preflight historis; penggabungan dapat mengubah urutan atau menjalankan SQL ulang. `apps/bisnishub-web/scripts/test-audit-database.mjs` membaca schema dan dua migrasi dari folder ini.

`bisnis/teestock/tools/` berisi HTML bisnis dan JSON katalog; klasifikasikan per file sebelum memindahkan. Nama tools tidak membuktikan bahwa seluruh isinya runtime. `scratch/seed_blank_catalog.mjs` dan `tools/setup_external_ssd.ps1` perlu audit target dan consumer sebelum tujuan final ditetapkan. Tidak menjalankannya sebagai bagian cleanup.

Tetap di root: `.agents/`, `.github/`, `.obsidian/`, `bisnis/`, `catatan/`, `templates/`, `assets/`, README, AGENTS dan GEMINI. Tidak membuat placeholder JARVIS, mengganti package manager, memperbarui dependency atau mengubah aturan bisnis dalam migrasi lokasi.

## Temuan path yang menentukan urutan

1. Root `package.json` dan `vercel.json` menunjuk storefront lama. Menghapus konfigurasi root sebelum target hosting terverifikasi berisiko memutus build. Konfigurasi lokal harus mengikuti path baru; perpindahan Vercel Root Directory merupakan pekerjaan rilis terpisah.
2. Ketiga aplikasi Vite mengacu ke `packages/shared/src` melalui konfigurasi alias. Audit juga tsconfig, Tailwind content globs, Vitest, imports, assets dan `scripts/sync-shared.ps1`. Prototype mempunyai dependency `bisnishub: file:../..`; status archived tidak otomatis menghapus dependency tersebut.
3. Root `supabase` adalah junction lokal ke `C:/Users/Rizky/bisnishub/bisnis/teestock/supabase`, diabaikan Git. Relokasi folder target memutus junction. Dokumentasikan prosedur pemulihan lokal setelah memverifikasi target absolut, tanpa recursive delete atau relink remote. CI tidak membuktikan junction mesin pengguna benar.
4. `scripts/governance/check-migration-immutability.mjs` mengunci `mgbos/supabase/migrations` dan menolak rename. Mengganti konstanta saja dapat mengosongkan baseline dan melemahkan perlindungan. Tahap 4 membutuhkan pemetaan old/new yang memverifikasi setiap nama relatif, blob, mode dan type, menolak edit/hapus/duplikasi, serta tetap melindungi migrasi pada perbandingan berikutnya. Jangan menambah bypass atau menulis ulang SQL lama.
5. `scripts/governance/validate-agent-governance.py`, `.agents/roles/contracts.json`, eval baseline, skill links dan kedua workflow mengikat path MGBOS. Foundation memakai working-directory, Node file, lockfile cache dan artifact path berawalan `mgbos/`. Semua diperbarui sebagai satu perubahan konsisten.
6. `mgbos/scripts/database.mjs` menentukan root relatif lokasi skrip dan memakai perintah lokal saja. Pertahankan isolasi ini, project ID dan port; worktree berbeda tidak otomatis berarti database berbeda.
7. `agent.py` memakai `BASE_DIR` untuk prompts, memory dan `catatan/sesi`. Setelah program pindah, path ekspor catatan harus tetap menunjuk root repo secara eksplisit. Audit juga resolusi `.env` dan peluncuran dari root maupun direktori tool; gunakan fixture sintetis tanpa API eksternal.
8. Tautan spesifikasi MGBOS menuju catatan, dokumen root, Obsidian dan canvas perlu diperiksa. Catatan lama tetap histori; jangan mengganti semua kemunculan path secara massal dalam laporan historis.

## Tahap dan acceptance

### 0 — Persiapan migrasi

Tahap 0a: rencana ini, penyelarasan target ADR dan navigasi, validasi dokumen/aturan. Tidak memerlukan database reset atau build aplikasi.

Tahap 0b, sebelum tahap 1: catat revision, seluruh file tracked/untracked/ignored yang perlu dipertahankan, proses/checkout aktif, baseline build/smoke dan target hosting/database yang relevan. Jangan menyalin atau mencetak secret. Inventaris file lokal seperti `.env`, `.vercel`, Supabase metadata dan dependency/build cache harus dilakukan sebelum move; Git tidak melindunginya.

Verifikasi remote branch protection, required checks, CI pada revision yang dituju dan ownership. Status saat penulisan: belum diverifikasi. Perubahan pengaturan remote bukan bagian dokumen ini. Baseline gagal harus dibedakan dari regresi migrasi dan ditangani sebelum acceptance sistem terkait.

### 1 — Prototype

Scope: prototype, alias root, navigasi dan konfigurasi yang langsung memakai path-nya. Audit penggunaan aktif/fitur unik lebih dahulu; bila belum dapat dipensiunkan, hentikan tahap ini dengan daftar dependensi, jangan menandainya RETIRED.

Jika retirement terbukti: simpan referensi revision terakhir dan replacement di README archive, keluarkan dari install/build aktif. Putuskan apakah archive menjadi snapshot referensi tanpa dukungan eksekusi; jangan menjanjikan build archive setelah shared pindah. Verifikasi tidak ada workflow/deployment/consumer aktif yang bergantung pada lokasi lama.

### 2 — TeeStock existing

Pindahkan storefront, admin, shared, Supabase dan database historis dalam satu perubahan. Perbarui root aliases, Vercel lokal, config aplikasi, database test loader dan shared verifier. Audit pemakai HTML/katalog bisnis secara terpisah.

Acceptance sebelum/sesudah: `npm ci` pada kedua app dengan lockfile existing; storefront `npm test`, `npm run build`, `npm run test:e2e`; admin `npm test`, `npm run build`, `npm run test:database`. Jalankan dari direktori app yang sesuai tahap. Browser/e2e hanya dengan target lokal dan data sintetis terverifikasi. Periksa imports, asset loading, routing dan shared verifier. Jangan menganggap skrip lint/typecheck tersedia jika manifest tidak menyediakannya. SQL dan target remote tetap sama; tidak apply/reset database remote.

### 3 — KasKita

Pindahkan mobile dan Supabase sebagai sistem independen. Periksa Expo entrypoint, assets, tsconfig, URL lingkungan dan scripts. Manifest saat ini hanya menyediakan start/android/ios/web, tanpa test/lint script.

Acceptance: `npm ci`, `npx tsc --noEmit`, ekspor Expo untuk platform yang dependensinya tersedia, serta smoke pada perangkat/emulator target. Catat keterbatasan platform bila tidak bisa dijalankan; jangan mengklaim semua platform lulus. Migrasi database tetap identik dan tidak menyentuh TeeStock/MGBOS.

### 4 — MGBOS

Prasyarat khusus: rancangan dan negative tests untuk guard relokasi, audit seluruh path CI/roles/skills/docs, ADR-007 dan environment lokal. Pisahkan perubahan guard persiapan dari move bila dibutuhkan, tetapi perlindungan path lama harus tetap aktif selama transisi.

Pindahkan workspace utuh, tanpa rename app/package atau perubahan domain. Acceptance: toolchain pin tetap; `pnpm install --frozen-lockfile`, `pnpm check`, production HTTP smoke dengan kedua server berjalan, `pnpm test:integration`, serta database replay/pgTAP/reproducible types pada target disposable lokal yang telah diidentifikasi. Jalankan guard positif/negatif dan kedua hosted workflow pada revision baru. Ikuti [release gates](../../systems/mgbos/docs/engineering/agent-system/release-gates.md); tidak ada exemption migration immutability.

### 5 — Asisten Python

Pindahkan sebagai satu unit dan perbaiki lokasi ekspor sesi. Validasi syntax/import, pembacaan persona/profile, penyimpanan memory dan ekspor ke fixture catatan dari dua working-directory. Stub provider; jangan menjalankan percakapan berbayar atau menulis fixture ke sesi nyata. Pembaruan model/provider berada di luar scope.

### 6 — Dokumentasi

Buat matriks sumber lama → pemilik kanonikal baru → status. Promosi bukan salinan kedua yang tetap sama-sama authoritative. Pertahankan histori dan tautkan penggantinya; perbarui seluruh consumer sebelum mengubah status catatan. Pisahkan evidence berdasarkan revision dari standar aktif. Periksa Markdown links, Obsidian wikilinks/embed dan canvas; jangan mengganti nama massal.

### 7 — Nama internal

Setelah tahap 4 stabil: rename app MGBOS menjadi backoffice dan `@mgbos/app` menjadi `@mgbos/backoffice` dalam perubahan tersendiri. Perbarui filter pnpm, lock metadata yang relevan, CI smoke, tests/config dan deploy target. Jalankan acceptance aplikasi dan pemeriksaan database yang terdampak; tidak mengubah domain package.

## Rollback dan bukti tiap tahap

- Catat base/head, daftar move, hash file sumber, referensi/config yang berubah, hasil sebelum/sesudah dan file lokal yang tidak terlacak. Satu tahap harus terintegrasi dan stabil sebelum tahap berikutnya.
- Sebelum integrasi, pulihkan perubahan milik tahap saja dari base yang tercatat atau batalkan commit tahap di branch terisolasi; jangan reset seluruh checkout yang mungkin berisi pekerjaan baru.
- Setelah integrasi, gunakan revert perubahan tahap beserta path/config yang berpasangan, lalu ulangi checks terdampak. Untuk MGBOS, rollback path harus didukung/verifikasi guard; jangan mematikan gate agar revert lolos.
- Pulihkan junction/environment lokal melalui prosedur terpisah dengan target absolut yang diperiksa. Git revert tidak mengembalikan secrets, metadata lokal atau konfigurasi hosting remote.
- Tidak ada rollback SQL karena migrasi lokasi tidak mengeksekusi perubahan database. Bila deployment sudah dilakukan dalam pekerjaan terpisah, rollback deployment mengikuti runbook pemilik sistem.

## Status handoff

Planner menghasilkan rencana dan perubahan navigasi saja. Engineer berikutnya memulai tahap 0b dan audit retirement prototype; belum diperbolehkan menyimpulkan prototype tidak dipakai atau menjalankan move besar dari daftar target saja.

| Bukti | Status pada penyusunan |
| --- | --- |
| Working tree awal, manifest, workflow dan path utama | Diperiksa lokal pada base `ba4a6d2` |
| Proses aktif, inventaris lengkap ignored/untracked, fitur unik prototype | Belum diverifikasi; wajib sebelum move |
| Hosting/database remote, branch protection, CI terbaru | Belum diverifikasi |
| App builds, smoke, database gates | Tidak dijalankan pada tahap dokumentasi |
| Deployment / perubahan database | Tidak dilakukan |

Keberhasilan tahap 0a berarti rencana dapat ditinjau dan navigasi konsisten; bukan seluruh tahap 0 selesai atau sistem siap dimigrasikan/dirilis.

## Verifikasi tahap 0a — 28 September 2026

- Validator governance: PASS struktural (6 skills, 5 roles, 18 cases, 25 Markdown). Peringatan kompatibilitas `argument-hint` pada tiga skill existing tetap ada; tidak ada skill yang diubah.
- Regression governance Python: 13 tests PASS.
- Migration guard regression: 10 PASS, 1 SKIP (symlink filesystem pada Windows), 0 gagal; pengujian committed symlink mode lulus.
- Guard terhadap HEAD/base `ba4a6d2`: 23 migrasi existing identik pada index dan working tree.
- Tautan Markdown lokal pada enam dokumen perubahan: PASS. `git diff --check`: PASS. Skenario routing diperiksa manual: lokasi MGBOS aktif tetap `mgbos/`, prototype tetap legacy, `systems/` hanya target, root Supabase bukan MGBOS.
- Review merupakan self-review; bukan independent agent evaluation. Tidak ada commit/push, hosted CI atau deployment untuk perubahan ini.

## Update tahap 1

Owner mengonfirmasi retirement prototype; audit dan hasil aktual dicatat di [laporan tahap 1](repository-migration-wave-1.md). Daftar sumber dalam peta adalah lokasi sebelum migrasi. Indeks proyek mencatat archive sebagai lokasi terkini. Tahap 0b untuk TeeStock masih memiliki gap E2E/hosting; tidak dianggap selesai seluruhnya.

## Keputusan lanjutan owner — 28 September 2026

Owner mengonfirmasi TeeStock lama sudah dipensiunkan dan dipertahankan sebagai arsip. Karena itu rencana relokasi runtime TeeStock pada tahap 2 diganti dengan pengarsipan di `bisnis/teestock/archive/`; bukan aktivasi ulang di `systems/teestock-v1/`. Admin/shared tetap di lokasi aktifnya. Lokasi MGBOS, KasKita dan asisten Python belum dipindahkan; tahap berikutnya tetap mengikuti acceptance masing-masing. Hasil kelanjutan dicatat di [laporan retirement TeeStock](repository-migration-teestock-retirement.md).

## Implementasi tahap 3 — KasKita

Aplikasi dan Supabase KasKita dipindahkan ke `systems/kaskita/` sebagai satu unit. Source, assets, lockfile, SQL, dan metadata lokal diverifikasi dengan hash sebelum/sesudah. Lihat [laporan tahap 3](repository-migration-wave-3.md) untuk bukti dan batas pengujian perangkat. Tahap 4 MGBOS belum dimulai.

## Update 29 September 2026 — MGBOS relocation

The official workspace has moved to `systems/mgbos/` with its runtime, database and toolchain boundaries preserved. Root aliases, CI, instructions and links follow that location. Existing historical path statements above describe earlier stages; the project index records the current layout. Verification is recorded in the relocation report. Owner has also retired the legacy admin/shared runtime; subsequent cleanup archives that implementation and moves the Python assistant without modifying business notes.

## Update 29 September 2026 — struktur utama

MGBOS berada di `systems/mgbos/`; JARVIS kini memiliki dokumentasi arsitektur
milik owner di `systems/jarvis/docs/`. Admin lama telah dihapus owner pada
`05e8b18`. Sisa storefront/shared/SQL dipisahkan ke `archive/teestock-v1/`,
asisten Python ke `tools/assistant/`, dan tipe KasKita yang tertinggal ke
`systems/kaskita/shared/`. Root aliases legacy dihapus. Sumber bisnis dan
catatan sesi dipertahankan.

[Bukti cleanup](repository-cleanup-2026-09-29.md) membedakan hasil lokal dari
integrasi main/CI. Promosi semantic dokumen dan rename internal app menjadi
backoffice tetap perubahan terpisah; tidak mengubah dokumen arsitektur owner
secara otomatis saat cleanup fisik. Lokasi internal `apps/mgbos/` tetap valid
sebagai anak workspace `systems/mgbos/`.
