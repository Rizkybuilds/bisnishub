# ADR-001: Organisasi BisnisHub bertahap

Tanggal: 2026-09-27. Status: tahap navigasi diterapkan; pemindahan fisik belum dilaksanakan.

## Keputusan

Pertahankan satu repositori untuk portofolio software dan pengetahuan bisnis. Pisahkan kepemilikan sistem, dokumen bisnis dan tooling. Tahap sekarang memperbaiki README, indeks, aturan bersama dan alias perintah; lokasi aplikasi, database, lockfile, CI Foundation serta hosting tetap utuh.

MGBOS masih berada di `mgbos/` sesuai [ADR-007](../../mgbos/docs/adr/007-workspace-coexistence.md). Tujuan `projects/` di bawah adalah rancangan migrasi berikutnya, bukan lokasi yang sudah aktif.

| Lokasi sekarang                                  | Tujuan yang direncanakan                              | Dependensi sebelum pindah                                                                              |
| ------------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `mgbos/`                                         | `projects/mgbos/`                                     | ADR lokasi, CI working-directory, scripts, alias root, tautan canonical source, local database wrapper |
| `bisnis/teestock/web/` dan `apps/bisnishub-web/` | `projects/teestock-platform/apps/`                    | Verifikasi kepemilikan admin, Vercel root/output, import shared, assets dan smoke kedua consumer       |
| `packages/shared/`                               | `projects/teestock-platform/packages/`                | Audit consumer termasuk prototipe; pindahkan hanya setelah seluruh alias/import siap                   |
| `bisnis/teestock/supabase/`                      | `projects/teestock-platform/supabase/`                | Audit CLI/config/link lokal; jangan relink atau mutate remote database                                 |
| `bisnis/kaskita/mobile/`                         | `projects/kaskita/apps/mobile/`                       | Metro/Expo config, assets, import dan build/smoke                                                      |
| `bisnis/kaskita/supabase/`                       | `projects/kaskita/supabase/`                          | Audit pemakai dan target data independen                                                               |
| Tool Python root, `prompts/`, `memory/`          | Subdirektori `tooling/` yang disepakati setelah audit | Loader path, entrypoint, requirements, test dengan fixture sintetis                                    |
| `apps/mgbos/`                                    | `archive/` hanya jika dipensiunkan                    | Pastikan tak ada consumer, proses atau pekerjaan unik yang masih aktif                                 |

Tidak membuat folder placeholder untuk proyek yang belum memiliki implementasi. Folder bisnis tetap berisi SOP/brand/riset, meski kode suatu saat pindah ke `projects/`.

## Urutan dan acceptance migrasi berikutnya

1. Inventaris consumer/path, file tracked/untracked, proses aktif, target hosting/database dan baseline bukti. Tetapkan sumber serta tujuan satu sistem.
2. Pisahkan perubahan lokasi dari perubahan fitur dan upgrade dependency. Simpan riwayat Git serta perbarui seluruh referensi dalam perubahan yang sama.
3. Jalankan install reproducible, lint/typecheck/test/build, smoke, link/Obsidian check dan pemeriksaan database yang relevan di target lokal aman. Repo/shared consumers yang terdampak wajib diperiksa.
4. Review diff dan hosted CI pada revisi baru. Siapkan pemulihan path/config. Deployment atau perubahan target remote bukan konsekuensi otomatis dari pemindahan file.
5. Integrasikan satu sistem sebelum memigrasikan berikutnya; hapus alias sementara hanya setelah tak ada consumer.

## Dampak tahap sekarang

Alias root `*:mgbos` kini menargetkan MGBOS resmi. Alias `*:mgbos-prototype` mempertahankan akses Vite sebelumnya. `install:all` mencakup kelompok legacy dan MGBOS; KasKita tetap diinstal terpisah. Root `dev`/`build` dan Vercel tetap menargetkan TeeStock existing.

Turborepo atau penyatuan semua package manager tidak ditambahkan. Konsolidasi toolchain memerlukan manfaat dan pengujian tersendiri.
