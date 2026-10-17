# BisnisHub Tools & Tooling Gateway

> **Status:** ACTIVE REPOSITORY TOOLING  
> **Navigasi Utama:** Baca masing-masing README di bawah ini dan [docs/engineering/repository-layout.md](../docs/engineering/repository-layout.md).

Direktori `tools/` memuat program mandiri dan utilitas eksekusi lokal yang mendukung alur kerja rekayasa dan operasional repositori. Setiap perkakas memiliki siklus hidup (*lifecycle*), berkas *entrypoint*, dan dependensi (*requirements*) masing-masing.

---

## 1. Daftar Perkakas (*Tools Catalog*)

| Tool | Direktori | Entrypoint Utama | Deskripsi & Batasan |
| :--- | :--- | :--- | :--- |
| **Engineering Assistant** | [assistant/](assistant/README.md) | `tools/assistant/main.py` | Perkakas CLI Python lokal yang menyediakan fungsi asisten rekayasa, context loader, dan eksekusi instruksi terarah. Terpisah sepenuhnya dari arsitektur JARVIS. |
| **Engineering Gateway** | `tools/engineering_gateway/` | `tools/engineering_gateway/launch.py` | Gerbang runtime untuk mengeksekusi profil engineering terisolasi, host hardening (CP-006C), dan validasi kapabilitas sebelum mutasi kode. |

---

## 2. Cara Menjalankan

### Menjalankan Asisten Python
Dari root repositori:
```powershell
python tools/assistant/main.py
```
atau via shortcut npm:
```powershell
npm run assistant
```

### Menjalankan Engineering Gateway
Dari root repositori:
```powershell
python tools/engineering_gateway/launch.py --help
```

---

## 3. Batas Tata Kelola (*Governance Boundary*)

1. **Tool Availability Is Not Permission:** Ketersediaan perkakas CLI atau gateway tidak memberikan otorisasi otomatis untuk melakukan mutasi remote, eksekusi produksi, atau aksi bisnis tanpa kontrak kerja yang sah.
2. **Isolasi Dependensi:** Dependensi Python dimiliki oleh masing-masing perkakas (`requirements.txt` per subdirektori); tidak ada penggabungan dependensi global yang memaksa seluruh repositori.
