# BisnisHub Engineering AI Control Plane

> **Status:** ACTIVE GOVERNANCE ENGINE  
> **Otoritas Tata Kelola:** Baca [docs/engineering/engineering-ai-control-plane.md](../docs/engineering/engineering-ai-control-plane.md) dan [AGENTS.md](../AGENTS.md).

Direktori `.agents/` memuat seluruh mesin tata kelola teknis (*Control Plane*) untuk agen kecerdasan buatan (AI) dan builder yang bekerja di repositori BisnisHub. Ini memastikan bahwa eksekusi AI tunduk pada batas peran, izin terikat (*scoped permissions*), mitigasi risiko terukur (R0 s.d. R5), dan bukti verifikasi nyata (*verifiable evidence*).

---

## 1. Peta Subsistem Control Plane

| Komponen | Lokasi | Otoritas & Fungsi |
| :--- | :--- | :--- |
| **Routing** | [routing/](routing/README.md) | Registry tipe tugas (`task-types.yaml`), profil sistem (`profiles/`), dan resolusi aturan eksekusi |
| **Contracts** | [contracts/](contracts/README.md) | JSON Schemas kanonikal untuk Implementation Contract, Work Package, dan Engineering Report |
| **Capabilities** | [capabilities/](capabilities/README.md) | Registry kapabilitas teknis (`registry.yaml`), batasan alat (*tool boundaries*), dan larangan global |
| **Roles** | `roles/contracts.json` | Definisi 5 peran kanonikal: `planner`, `engineer`, `auditor`, `qa`, dan `release-operator` |
| **Expertise** | [expertise/](expertise/README.md) | Registry domain keahlian terdaftar (`registry.yaml`) yang wajib dipahami sebelum mengubah sistem |
| **Skills** | [skills/](skills/README.md) | Katalog kemampuan teknis khusus (44 skills) untuk eksekusi domain spesifik |
| **Continuity** | [continuity/](continuity/README.md) | Titik pemulihan kontinuitas lintas sesi (`checkpoint.yaml`) pasca-integrasi |
| **Gateway** | [gateway/](gateway/README.md) | Konfigurasi profil isolasi workstation dan verifikasi pra-eksekusi (*preflight*) |
| **Adapters** | `adapters/` | Adapter runtime netral-penyedia untuk Antigravity dan Codex |
| **Evals** | [evals/](evals/README.md) | Suite evaluasi perilaku agen untuk mencegah regresi tata kelola |

---

## 2. Hukum Utama Rekayasa AI

1. **One Active Canonical Role:** Dalam setiap eksekusi terkelola, hanya ada SATU peran kanonikal yang aktif.
2. **One Writer:** Satu pembagian kerja (*Work Package*) hanya boleh dimodifikasi oleh satu *writer* aktif pada satu branch/worktree.
3. **Tool Available Is Not Permission:** Ketersediaan shell, Git, browser, atau API tidak berarti tindakan tersebut diizinkan tanpa kontrak kerja sah.
4. **No Fake PASS:** Kegagalan, blocker, atau pemeriksaan yang belum dijalankan tidak boleh diubah menjadi status "PASS" demi kenyamanan presentasi.
