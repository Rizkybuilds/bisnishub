# BisnisHub Repository Archive — Retired Implementations

> **Status:** READ-ONLY / RETIRED IMPLEMENTATIONS ONLY  
> **Peringatan Otoritas:** Dilarang men-deploy, menjalankan migrasi database, atau membangkitkan alias runtime dari direktori ini.

Direktori `archive/` adalah tempat penyimpanan implementasi perangkat lunak historis yang telah resmi dipensiunkan (*retired*) oleh Founder. Kode di sini dipertahankan secara utuh semata-mata sebagai referensi historis, perbandingan antarmuka, dan pelacakan audit.

---

## 1. Daftar Implementasi Arsip

| Proyek Arsip | Lokasi | Tanggal Pensiun | Deskripsi & Pengganti Aktif |
| :--- | :--- | :--- | :--- |
| **TeeStock V1** | [teestock-v1/](teestock-v1/README.md) | 2026-09-29 | Aplikasi legacy storefront dan shared packages. Admin lama telah dihapus. Pengganti aktif adalah [systems/mgbos/apps/teestock/](../systems/mgbos/apps/teestock/). |
| **MGBOS Vite Prototype** | [mgbos-vite-prototype/](mgbos-vite-prototype/README.md) | 2026-09-28 | Prototipe antarmuka awal berbasis Vite. Pengganti resmi monorepo Next.js aktif berada di [systems/mgbos/](../systems/mgbos/README.md). |

---

## 2. Batas Tata Kelola Ketat (*Strict Archive Boundaries*)

Mengacu pada [AGENTS.md](../AGENTS.md) aturan 65 s.d. 68:

1. **Dilarang Deploy Ulang:** Jangan pernah men-deploy aplikasi di dalam `archive/` semata-mata karena kodenya masih ada.
2. **Dilarang Menjalankan SQL Arsip ke MGBOS:** Skrip database di `archive/teestock-v1/database/` tidak boleh dijalankan ke database Supabase lokal MGBOS. Sumber database resmi MGBOS hanya berada di `systems/mgbos/supabase/`.
3. **Dilarang Menghidupkan Alias Runtime:** Alias perintah root lama untuk prototype telah dihapus secara permanen; jangan membuat rute alias kembali ke folder arsip ini.
4. **Isolasi Penuh:** Perubahan atau refactoring di repositori aktif tidak berkewajiban menjaga kompatibilitas build mandiri dari kode arsip ini.
