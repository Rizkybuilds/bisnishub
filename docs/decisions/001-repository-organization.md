# ADR-001: Organisasi BisnisHub bertahap

Tanggal: 2026-09-27; diperbarui 2026-09-28. Status: tahap navigasi diterapkan; tahap 1 prototype diarsipkan; migrasi sistem lain belum dilaksanakan.

## Keputusan

Pertahankan satu repositori untuk portofolio software dan pengetahuan bisnis. Pisahkan kepemilikan sistem, dokumen bisnis dan tooling. Tahap sekarang memperbaiki README, indeks, aturan bersama dan alias perintah; lokasi aplikasi, database, lockfile, CI Foundation serta hosting tetap utuh.

MGBOS masih berada di `mgbos/` sesuai [ADR-007](../../systems/mgbos/docs/adr/007-workspace-coexistence.md). Target `systems/` menggantikan usulan awal `projects/` berdasarkan pembahasan 27 September dan kelanjutan perencanaan 28 September. Target bukan lokasi aktif; pelaksanaan mengikuti [rencana migrasi](../engineering/repository-migration-plan.md). ADR-007 tetap berlaku sampai tahap pemindahan MGBOS selesai.

| Lokasi sekarang                                  | Tujuan yang direncanakan                              | Dependensi sebelum pindah                                                                              |
| ------------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `mgbos/`                                         | `systems/mgbos/`                                     | ADR lokasi, CI working-directory, scripts, alias root, tautan canonical source, local database wrapper |
| `bisnis/teestock/web/` dan `apps/bisnishub-web/` | `systems/teestock-v1/apps/`                    | Verifikasi kepemilikan admin, Vercel root/output, import shared, assets dan smoke kedua consumer       |
| `packages/shared/`                               | `systems/teestock-v1/packages/`                | Audit consumer termasuk prototipe; pindahkan hanya setelah seluruh alias/import siap                   |
| `bisnis/teestock/supabase/`                      | `systems/teestock-v1/supabase/`                | Audit CLI/config/link lokal; jangan relink atau mutate remote database                                 |
| `bisnis/kaskita/mobile/`                         | `systems/kaskita/apps/mobile/`                       | Metro/Expo config, assets, import dan build/smoke                                                      |
| `bisnis/kaskita/supabase/`                       | `systems/kaskita/supabase/`                          | Audit pemakai dan target data independen                                                               |
| Tool Python root, `prompts/`, `memory/`          | `tools/assistant/` | Loader path, entrypoint, requirements, test dengan fixture sintetis                                    |
| `apps/mgbos/`                                    | `archive/mgbos-vite-prototype/` jika dipensiunkan                    | Pastikan tak ada consumer, proses atau pekerjaan unik yang masih aktif                                 |

Tidak membuat folder placeholder untuk proyek yang belum memiliki implementasi. Folder bisnis tetap berisi SOP/brand/riset, meski kode suatu saat pindah ke `systems/`.

## Urutan dan acceptance migrasi berikutnya

1. Inventaris consumer/path, file tracked/untracked, proses aktif, target hosting/database dan baseline bukti. Tetapkan sumber serta tujuan satu sistem.
2. Pisahkan perubahan lokasi dari perubahan fitur dan upgrade dependency. Simpan riwayat Git serta perbarui seluruh referensi dalam perubahan yang sama.
3. Jalankan install reproducible, lint/typecheck/test/build, smoke, link/Obsidian check dan pemeriksaan database yang relevan di target lokal aman. Repo/shared consumers yang terdampak wajib diperiksa.
4. Review diff dan hosted CI pada revisi baru. Siapkan pemulihan path/config. Deployment atau perubahan target remote bukan konsekuensi otomatis dari pemindahan file.
5. Integrasikan satu sistem sebelum memigrasikan berikutnya; hapus alias sementara hanya setelah tak ada consumer.

## Dampak tahap sekarang

Alias root `*:mgbos` kini menargetkan MGBOS resmi. Alias `*:mgbos-prototype` dihapus setelah retirement prototype pada 28 September. `install:all` mencakup kelompok legacy dan MGBOS; KasKita tetap diinstal terpisah. Root `dev`/`build` dan Vercel tetap menargetkan TeeStock existing.

Turborepo atau penyatuan semua package manager tidak ditambahkan. Konsolidasi toolchain memerlukan manfaat dan pengujian tersendiri.

## Batas keputusan 28 September

Perubahan ini menetapkan tujuan dan urutan kerja, bukan memindahkan aplikasi. Tidak menyatukan package manager, mengubah domain MGBOS, menghapus konfigurasi hosting atau membuat runtime JARVIS. Riwayat sesi dipertahankan; spesifikasi aktif baru dipromosikan dengan pemetaan sumber dan pembaruan seluruh referensi. `tools/` tetap nama resmi tooling; tidak ada migrasi ke `tooling/`.

Tahap 1 selesai secara lokal: 14 file prototype dipertahankan identik di `archive/mgbos-vite-prototype/`; root install legacy hanya mencakup storefront/admin. Lihat [bukti pramigrasi dan retirement](../engineering/repository-migration-wave-1.md).
