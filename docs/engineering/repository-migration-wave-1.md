# Pramigrasi dan retirement prototype — 2026-09-28

Branch: `codex/repository-migration-plan`. Base: `ba4a6d2c7ed4155b3ff8f5ffee1c4a7a30b796dc`; perubahan tahap 0a dipertahankan. Scope tahap ini: audit 0b yang relevan dan retirement prototype yang dikonfirmasi owner. Tidak memindahkan workspace Next.js, storefront, admin, shared, database atau catatan sesi. Risiko R1 untuk pengubahan root install/routing; tidak mengubah kewenangan atau transaksi bisnis.

## Git dan layanan

- Remote `main` terverifikasi di `0a2befb16aa16a0198d7af603c11e9ea30a8ba7c`. Checkout lokal dua commit di depan, bukan tertinggal: `15ec154` dan `ba4a6d2`, menambah 33 dokumen bisnis TeeStock. Semuanya dipertahankan. Fetch hanya memperbarui referensi; tidak merge/rebase/reset.
- GitHub branch API melaporkan `protected: true`; required contexts `application`, `database`, `pr-gate` (enforcement everyone). Detail aturan lain tidak disimpulkan dari respons ini.
- [MGBOS Foundation](https://github.com/Rizkybuilds/bisnishub/actions/runs/36364254422) dan [Agent Governance](https://github.com/Rizkybuilds/bisnishub/actions/runs/36364254404) sukses pada remote SHA tersebut. API tidak menemukan workflow run untuk base lokal `ba4a6d2`. Ini bukan hosted CI untuk diff migrasi.
- Dua worktree `.temp/mgbos-001-review` dan `.temp/mgbos-agent-governance` bersih saat diperiksa. Tidak dihapus/dipindahkan; kebersihan Git tidak membuktikan chat pemilik selesai.
- Snapshot port lokal sebelum smoke: tidak ada listener di 3000/3001/3101/3102/5173/5174; 55431 aktif. Tidak reset atau menghentikan database tersebut.
- Root Vercel masih menargetkan storefront TeeStock. Metadata/output lokal `.vercel` ditemukan di storefront, tetapi target deployment live belum diverifikasi. Owner mengonfirmasi prototype tidak dipakai lagi dan boleh diarsipkan; tidak ada konfigurasi deployment prototype ditemukan pada file tracked atau folder prototype lokal yang diperiksa.

## Inventaris lokal

Pemindaian tidak membaca isi secret dan tidak mengikuti junction. Folder dependency, build/cache, test outputs dan metadata `.temp` dicatat sebagai kelompok, bukan dihapus. Ini belum merupakan backup atau inventaris setiap file cache.

| Area | File tracked sumber/config | Lokal yang perlu dipertahankan |
| --- | --- | --- |
| Prototype | 14 | node_modules, dist; junction node_modules/bisnishub ke root |
| Admin | 99 | .env, node_modules, dist, supabase/.temp |
| Storefront | 92 | .env, .env.local teramati pada pemeriksaan awal, .vercel metadata/output, dependency/build/test artifacts |
| TeeStock Supabase | 7 | .temp; root junction Supabase tetap di lokasi lama |
| KasKita mobile | 32 | node_modules, .expo log |
| KasKita Supabase | 4 | .temp |
| MGBOS | 383 | .21st design, app .env.local, next-env/typescript cache, .next, dependencies, Supabase branch metadata/.temp, tmp/pdfs |

Hitungan berasal dari penelusuran source yang memang tidak masuk subtree cache/dependency. Root `.env` dan node_modules juga dipertahankan. Pemeriksaan ignored Git awal mengikuti siklus junction prototype dan menghasilkan path terlalu panjang; proses pemindaian milik audit dihentikan dan diganti penelusuran yang memangkas junction. Tidak ada file yang dihapus.

## Baseline yang dijalankan

Windows, Node 22.23.2, npm 10.9.8, dependency existing; belum melakukan clean install `npm ci`.

| Pemeriksaan | Hasil |
| --- | --- |
| Prototype `npm run build` | PASS |
| Prototype HTTP preview | PASS: /, /sales/leads, /finance/payments dan kedua aset JS/CSS mengembalikan 200; bukan browser interaction test |
| Storefront `npm test` | PASS: 19 files, 242 tests |
| Storefront `npm run build` | PASS; warning annotation dependency Zod |
| Admin/shared `npm test` | PASS: 22 files, 222 tests |
| Admin `npm run build` | PASS; warning chunk >500 kB |
| Admin `npm run test:database` | PASS: 14 PGlite tests, database simulasi lokal |
| Storefront checkout E2E | NOT RUN: memakai real Supabase catalog dan submit order/custom order; belum fixture lokal terisolasi |
| MGBOS/KasKita full local gates | NOT RUN; belum dipindahkan |

Unit tests memock Supabase dan memblok fetch sesuai setup kedua app. PGlite bukan bukti RLS/endpoint produksi. Preview prototype hanya menyajikan HTTP lokal, tidak mengirim transaksi; proses preview milik audit dihentikan sesudahnya.

## Implementasi retirement

Owner menjawab: “Tidak dipakai lagi; boleh diarsipkan”. Source diperiksa: home menggunakan array metrik contoh, sepuluh modul placeholder, shell memakai `BRAND_DEFINITIONS` shared dan state brand lokal. Tidak ditemukan fetch/Supabase mutation dalam source prototype; nilai desain shell tetap dipertahankan.

Folder `apps/mgbos/` dipindah ke `archive/mgbos-vite-prototype/` setelah memverifikasi source/destination absolut di dalam repo. Empat belas SHA-256 file tracked sebelum/sesudah identik. Dependencies dan dist lokal ikut pindah; junction dependency tetap menunjuk root yang sama.

Root aliases `dev:mgbos-prototype`, `build:mgbos-prototype`, `install:mgbos-prototype` dihapus. `install:legacy` kini hanya storefront/admin. Root build/dev, Vercel, lockfile, shared source dan database tidak diubah. Panduan aktif, lima skill routing dan dua eval routing diselaraskan; contoh dalam laporan/catatan historis tetap histori. ARCHITECTURE dan ADR coexistence diberi keterangan status terbaru tanpa menulis ulang sejarahnya.

## Batas acceptance dan langkah berikutnya

Retirement bukan acceptance migrasi TeeStock. Sebelum tahap 2: siapkan checkout E2E dengan fixture dan network boundary lokal, verifikasi project hosting live, audit junction/metadata Supabase serta seluruh ignored data yang akan dipindah. Pertahankan SQL historis terpisah dari migration chain. Clean install dan checks setelah relokasi tetap diperlukan.

Rollback tahap 1: pindahkan folder archive kembali ke `apps/mgbos/` setelah memeriksa destination kosong dan proses aktif, lalu balikkan hanya edit alias/routing retirement. Jangan membatalkan dokumen bisnis atau seluruh perubahan tahap 0a. Tidak ada SQL/deployment yang perlu dibalik.

Perubahan belum commit/push. Review mandiri; tidak mengklaim evaluasi agent independen.

## Verifikasi sesudah perubahan

- Empat belas Git blob archive identik dengan sumber pada HEAD; root alias prototype sudah tidak ada, root build tetap storefront.
- Validator governance PASS; 13 regression tests Python PASS. Guard migrasi: 10 PASS, 1 SKIP symlink filesystem Windows; 23 migrasi existing tetap identik.
- Seluruh Markdown yang diubah/ditambah lulus pemeriksaan tautan lokal dan conflict markers. `git diff --check` lulus.
- Quick validator skill: 21st-ui-build dan mgbos-change-planner lulus langsung. git-deploy-ops, integrated-erp-engine, web-qa-testing masih ditolak hanya karena metadata legacy `argument-hint`; salinan sementara tanpa field itu lulus. Source metadata tetap dipertahankan sesuai kebijakan kompatibilitas.

Build verifikasi setelah pemindahan di direktori archive juga PASS, menghasilkan nama/ukuran aset yang sama dengan baseline. Ini membuktikan relokasi saat ini, bukan komitmen mendukung runtime archive setelah tahap berikutnya.
