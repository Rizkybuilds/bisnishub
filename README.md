---
title: BisnisHub repository guide
date: "2026-09-27"
bisnis: umum
kategori: operasional
status: active
---

# BisnisHub

Satu repositori untuk proyek software, dokumentasi bisnis dan pengetahuan kerja. Setiap sistem memiliki batas kode, dependency dan database sendiri; satu repo tidak berarti satu database atau satu proses deployment.

Mulai dari [indeks proyek](docs/project-index.md), [aturan direktori](docs/engineering/repository-layout.md), dan [AGENTS.md](AGENTS.md). Untuk bisnis dan perencanaan, buka [[🏠 BisnisHub Command Center]] serta folder `bisnis/` dan `catatan/`.

## Proyek software saat ini

| Sistem                             | Lokasi resmi             | Perintah dari root                             |
| ---------------------------------- | ------------------------ | ---------------------------------------------- |
| MGBOS internal, Next.js            | `systems/mgbos/apps/mgbos/`      | `npm run dev:mgbos`                            |
| Storefront Next.js dalam MGBOS     | `systems/mgbos/apps/teestock/`   | `npm run dev:mgbos:teestock`                   |
| Storefront TeeStock lama (retired) | `bisnis/teestock/archive/web/` | Arsip referensi; tidak dijalankan/dideploy |
| Admin existing, Vite               | `apps/bisnishub-web/`    | `npm run dev:bisnishub`                        |
| KasKita mobile, Expo               | `systems/kaskita/apps/mobile/` | `npm --prefix systems/kaskita/apps/mobile run start` |

Keberadaan aplikasi bukan bukti kesiapan produksi. Target hosting dan hasil CI harus diverifikasi pada revisi yang akan dirilis.

## Instalasi dan pemeriksaan

MGBOS menggunakan Node dan pnpm yang dipin di [manifest workspace](systems/mgbos/package.json). Alias root menggunakan pnpm 10.34.5 melalui npm exec; pengambilan pnpm pertama kali dapat memerlukan jaringan.

```sh
npm run install:mgbos
npm run check:mgbos
npm run build:mgbos
```

Perintah tersebut menargetkan workspace `systems/mgbos/`. `check:mgbos` tidak menggantikan production smoke atau pemeriksaan database yang berlaku. Ikuti [panduan MGBOS](systems/mgbos/README.md) dan [database lokal](systems/mgbos/docs/runbooks/local-database.md); database tidak di-reset saat menyiapkan dokumentasi.

Aplikasi existing tetap memakai package manager dan lockfile masing-masing. `npm run install:legacy` memasang storefront dan admin existing. `npm run install:all` kini memasang kelompok tersebut dan MGBOS; KasKita tetap terpisah. Jalankan instalasi hanya untuk target yang diperlukan.

`npm run dev` dan `npm run build` menargetkan MGBOS resmi. Root `vercel.json` menolak deployment storefront lama; deployment MGBOS harus memakai target workspace yang terverifikasi.

## Peta direktori

- `.agents/`: skill, kontrak peran dan eval; [kontrol engineering MGBOS](systems/mgbos/docs/engineering/agent-system/README.md).
- `docs/`: indeks, aturan engineering bersama dan keputusan tingkat repo.
- `systems/mgbos/`: workspace resmi MGBOS beserta paket, database lokal dan dokumentasinya.
- `apps/`, `packages/shared/`: aplikasi/paket existing; batas pemakai tercatat di indeks.
- `bisnis/`: SOP, brand, riset, marketing dan keuangan per bisnis; beberapa aplikasi existing masih berada di sini.
- `catatan/`: riwayat sesi, ide, jurnal dan review. Keputusan yang berlaku ditautkan ke dokumentasi resmi.
- `scripts/`, `tools/`, `prompts/`, `memory/`, `templates/`: lihat [kepemilikan tooling](docs/engineering/repository-layout.md); jangan pindahkan tanpa memeriksa pemakainya.

Root `supabase` adalah link lokal legacy TeeStock dan tidak boleh digunakan untuk MGBOS. Database MGBOS hanya di `systems/mgbos/supabase/`.

## Perubahan nama perintah

`dev:mgbos`, `build:mgbos` dan `install:mgbos` sekarang berarti MGBOS resmi. Prototype Vite dipensiunkan ke [arsip](archive/mgbos-vite-prototype/README.md); alias `*:mgbos-prototype` dihapus. Catatan historis tidak otomatis mengikuti perubahan alias ini.

Prototype sudah dipindahkan ke `archive/mgbos-vite-prototype/`. MGBOS dan KasKita sudah berada di `systems/`. Target ini menggantikan usulan `projects/`; lihat [keputusan](docs/decisions/001-repository-organization.md) dan [rencana migrasi bertahap](docs/engineering/repository-migration-plan.md). [Overview sebelumnya](docs/reference/2026-09-23-root-overview.md) dipertahankan sebagai arsip sejarah.
