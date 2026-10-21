# BisnisHub

Repositori bersama untuk MGBOS, rancangan JARVIS, pengetahuan bisnis MultiGraph
Group dan alat pendukung. Setiap sistem memiliki kode, dependency, data dan
dokumentasinya sendiri.

Mulai dari [indeks proyek](docs/project-index.md), [aturan direktori](docs/engineering/repository-layout.md),
[peta sumber kanonikal](docs/governance/canonical-source-map.md), dan [AGENTS.md](AGENTS.md).

| Bagian | Lokasi | Status |
| --- | --- | --- |
| MGBOS | [systems/mgbos](systems/mgbos/README.md) | Implementasi Next.js; validasi kesiapan per revisi |
| TeeStock Storefront | `systems/mgbos/apps/teestock` | Aplikasi publik Next.js (port 3102) di bawah workspace MGBOS |
| JARVIS | [systems/jarvis/docs](systems/jarvis/docs/charter.md) | Dokumentasi arsitektur; belum ada runtime yang diverifikasi |
| KasKita | `systems/kaskita/` | Sistem independen di luar holding |
| Asisten Python | [tools/assistant](tools/assistant/README.md) | CLI existing, terpisah dari JARVIS |
| Pengetahuan bisnis | `bisnis/` | Brand, SOP, riset, keuangan dan perencanaan |
| Catatan sesi | `catatan/` | Histori, termasuk dokumentasi 27 September |
| Implementasi retired (TeeStock v1) | [archive](archive/teestock-v1/README.md) | Referensi historis; bukan dependency atau deployment aktif |

## Menjalankan dan memeriksa

```sh
npm run install:mgbos
npm run dev:mgbos
npm run dev:mgbos:teestock
npm run check:mgbos
npm run check:repository
```

Alias MGBOS memakai pnpm 10.34.5 di `systems/mgbos/`. Node mengikuti pin workspace.
`npm run dev` dan `npm run build` juga menargetkan MGBOS. Pemeriksaan aplikasi
tidak menggantikan HTTP smoke, database gates atau kesiapan operasional.
Perintah root `npm run check:repository` hanya menjalankan validasi tata letak direktori
repositori (`scripts/governance/check_repository_layout.py`); validasi dependensi dokumen,
checkpoint kontinuitas, dan supply-chain CI dijalankan terpisah melalui skrip terkait
dan workflow CI repositori.

Python: `python tools/assistant/main.py`; dependency dimiliki tool tersebut.
KasKita tetap menggunakan npm/lockfile sendiri. Tidak ada root pnpm workspace
atau instalasi gabungan seluruh sistem.

## Kepemilikan

- `systems/`: software dan dokumentasi milik sistem.
- `docs/`: governance, arsitektur lintas sistem dan keputusan repositori.
- `.agents/`: skill, kontrak peran dan baseline evaluasi engineering.
- `bisnis/`: pengetahuan bisnis; `catatan/`: histori.
- `tools/`: program mandiri; `scripts/`: pemeliharaan/pemeriksaan/setup repositori.
- `archive/`: implementasi yang dipensiunkan; `templates/` dan `assets/`: materi bersama.

Root Supabase legacy tidak boleh digunakan. Database MGBOS hanya di
`systems/mgbos/supabase/`. Root Vercel sengaja menolak deployment; konfigurasi
hosting baru memerlukan target rilis yang diverifikasi. Cleanup tidak mengubah
database atau deployment remote.
