# BisnisHub Business Knowledge — Portofolio Bisnis

> **Status:** ACTIVE BUSINESS KNOWLEDGE REPOSITORY  
> **Navigasi Utama:** Baca [docs/project-index.md](../docs/project-index.md) dan masing-masing `README.md` per unit bisnis.

Direktori `bisnis/` adalah rumah pengetahuan bisnis, riset pasar, identitas merek, pedoman operasional (SOP), dan kebijakan keuangan untuk seluruh unit usaha di bawah portofolio Founder dan MultiGraph Group.

---

## 1. Batasan & Integritas (*Ownership Boundary*)

1. **Pemilik Kebenaran Bisnis:** Dokumen di dalam direktori ini memiliki otoritas semantik atas aturan komersial, harga, HPP, brand, dan SOP operasional unit bisnis terkait.
2. **Bukan Lokasi Runtime Kode:** Tidak ada aplikasi aktif atau kode eksekusi yang hidup di dalam `bisnis/`. Seluruh implementasi software berada di `systems/` (seperti MGBOS di [systems/mgbos/](../systems/mgbos/README.md) dan runtime KasKita di [systems/kaskita/](../systems/kaskita/README.md)).
3. **Pemisahan dengan Catatan Sesi:** Rekaman diskusi/obrolan temporer disimpan di `catatan/sesi/`, sedangkan keputusan bisnis kanonikal yang telah disahkan dikodifikasikan ke dalam folder unit bisnis di bawah ini.

---

## 2. Portofolio Unit Bisnis & Brand

| Unit Bisnis | Direktori | Status | Fokus & Peran Utama |
| :--- | :--- | :--- | :--- |
| **MultiGraph** | [multigraph/](multigraph/README.md) | 🟡 Active B2B | Holding induk industri percetakan offset, sablon manual, dan packaging collateral B2B. |
| **TeeStock** | [teestock/](teestock/README.md) | 🟢 Active Launch Prep | *Everyday curated graphic apparel*, kaos polos New States Apparel (NSA), dan *Custom Atelier* DTF. |
| **RizkyBuild** | [rizkybuild/](rizkybuild/README.md) | 🟢 Active / Growth | Automasi AI, solusi sistem enterprise, distribusi pengetahuan (*Build in Public*), dan *personal brand*. |
| **KasKita** | [kaskita/](kaskita/README.md) | 🟢 Independent SaaS | Pengetahuan bisnis SaaS pencatatan keuangan pribadi dan kas komunitas (runtime di `systems/kaskita/`). |
| **Titik Buta** | [titik-buta/](titik-buta/README.md) | 🔴 Freeze / Ideation | Inkubator bisnis media edukasi; ditunda sampai arus kas operasional TeeStock tervalidasi positif. |

---

## 3. Konvensi Struktur Folder per Bisnis

Setiap unit bisnis menggunakan sub-folder terstandarisasi:
- `brand/`: Identitas visual, aset logo, tipografi, dan brand guidelines.
- `riset/`: Validasi pasar, riset kompetitor, katalog vendor, dan data harga bahan baku.
- `operasional/` atau `sop/`: Alur kerja fisik, prosedur produksi, dan *service blueprints*.
- `keuangan/`: Matriks HPP, kalkulator margin, kerangka harga jual (*pricing framework*), dan kebijakan diskon.
