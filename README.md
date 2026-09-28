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
| MGBOS internal, Next.js            | `mgbos/apps/mgbos/`      | `npm run dev:mgbos`                            |
| Storefront Next.js dalam MGBOS     | `mgbos/apps/teestock/`   | `npm run dev:mgbos:teestock`                   |
| Storefront TeeStock lama (retired) | `bisnis/teestock/archive/web/` | Arsip referensi; tidak dijalankan/dideploy |
| Admin existing, Vite               | `apps/bisnishub-web/`    | `npm run dev:bisnishub`                        |
| KasKita mobile, Expo               | `bisnis/kaskita/mobile/` | `npm --prefix bisnis/kaskita/mobile run start` |

Keberadaan aplikasi bukan bukti kesiapan produksi. Target hosting dan hasil CI harus diverifikasi pada revisi yang akan dirilis.

## Instalasi dan pemeriksaan

MGBOS menggunakan Node dan pnpm yang dipin di [manifest workspace](mgbos/package.json). Alias root menggunakan pnpm 10.34.5 melalui npm exec; pengambilan pnpm pertama kali dapat memerlukan jaringan.

```sh
npm run install:mgbos
npm run check:mgbos
npm run build:mgbos
```

Perintah tersebut menargetkan workspace `mgbos/`. `check:mgbos` tidak menggantikan production smoke atau pemeriksaan database yang berlaku. Ikuti [panduan MGBOS](mgbos/README.md) dan [database lokal](mgbos/docs/runbooks/local-database.md); database tidak di-reset saat menyiapkan dokumentasi.

Aplikasi existing tetap memakai package manager dan lockfile masing-masing. `npm run install:legacy` memasang storefront dan admin existing. `npm run install:all` kini memasang kelompok tersebut dan MGBOS; KasKita tetap terpisah. Jalankan instalasi hanya untuk target yang diperlukan.

`npm run dev` dan `npm run build` tetap menargetkan storefront TeeStock existing agar entrypoint deployment lama tidak berubah. Root `vercel.json` juga tetap milik storefront tersebut.

## Peta direktori

- `.agents/`: skill, kontrak peran dan eval; [kontrol engineering MGBOS](mgbos/docs/engineering/agent-system/README.md).
- `docs/`: indeks, aturan engineering bersama dan keputusan tingkat repo.
- `mgbos/`: workspace resmi MGBOS beserta paket, database lokal dan dokumentasinya.
- `apps/`, `packages/shared/`: aplikasi/paket existing; batas pemakai tercatat di indeks.
- `bisnis/`: SOP, brand, riset, marketing dan keuangan per bisnis; beberapa aplikasi existing masih berada di sini.
- `catatan/`: riwayat sesi, ide, jurnal dan review. Keputusan yang berlaku ditautkan ke dokumentasi resmi.
- `scripts/`, `tools/`, `prompts/`, `memory/`, `templates/`: lihat [kepemilikan tooling](docs/engineering/repository-layout.md); jangan pindahkan tanpa memeriksa pemakainya.

Root `supabase` adalah link lokal legacy TeeStock dan tidak boleh digunakan untuk MGBOS. Database MGBOS hanya di `mgbos/supabase/`.

## Perubahan nama perintah

`dev:mgbos`, `build:mgbos` dan `install:mgbos` sekarang berarti MGBOS resmi. Prototype Vite dipensiunkan ke [arsip](archive/mgbos-vite-prototype/README.md); alias `*:mgbos-prototype` dihapus. Catatan historis tidak otomatis mengikuti perubahan alias ini.

Prototype sudah dipindahkan ke `archive/mgbos-vite-prototype/`. Pemindahan sistem aktif menuju `systems/` belum dilakukan. Target ini menggantikan usulan `projects/`; lihat [keputusan](docs/decisions/001-repository-organization.md) dan [rencana migrasi bertahap](docs/engineering/repository-migration-plan.md). [Overview sebelumnya](docs/reference/2026-09-23-root-overview.md) dipertahankan sebagai arsip sejarah.
