# 🚀 AI Mentor Bisnis — Command Center

> Workspace utama untuk 3 bisnis yang sedang dirintis oleh solo founder.
> Dilengkapi **Virtual C-Suite Team** — 5 peran AI yang siap jadi thinking partner.

---

## 🤖 Virtual C-Suite Team

| Peran | Kode | Fokus |
|-------|------|-------|
| 🧠 **Mentor Bisnis** | `mentor` | Thinking partner & strategi bisnis keseluruhan |
| 🔧 **CTO** | `cto` | Teknologi, arsitektur produk, development roadmap |
| ⚙️ **COO** | `coo` | Operasional, SOP, supply chain, eksekusi |
| 💰 **CFO** | `cfo` | Keuangan, pricing, budgeting, profitability |
| 📢 **CMO** | `cmo` | Marketing, branding, growth, customer acquisition |

### Cara Pakai

```bash
python main.py
```

1. Pilih peran yang ingin diajak bicara
2. Pilih konteks bisnis (opsional)
3. Mulai berdiskusi!

### Perintah yang Tersedia

| Perintah | Fungsi |
|----------|--------|
| `/team` | Lihat semua peran yang tersedia |
| `/switch <role>` | Ganti peran (contoh: `/switch cto`) |
| `/bisnis` | Pilih/ganti konteks bisnis |
| `/consult` | Konsultasi ke peran lain tanpa ganti peran |
| `/profile` | Tampilkan business profile |
| `/save` | Simpan sesi |
| `/exit` | Keluar & simpan sesi |
| `/help` | Daftar perintah |

### Fitur Cross-Role Consultation

Peran-peran C-suite bisa saling berkonsultasi! Gunakan `/consult` untuk
mengirim pertanyaan ke peran lain dan mendapat jawaban tanpa harus berpindah
peran. Contoh: CTO bisa konsultasi ke CFO soal budget teknologi.

---

## 📂 Struktur Direktori

```
ai-mentor-bisnis/
│
├── 🤖 AI Mentor (root)
│   ├── agent.py              # AI multi-role agent
│   ├── main.py               # Entry point + CLI menu
│   ├── prompts/              # Persona per peran
│   │   ├── mentor_persona.md
│   │   ├── cto_persona.md
│   │   ├── coo_persona.md
│   │   ├── cfo_persona.md
│   │   └── cmo_persona.md
│   ├── memory/               # Business profile & session history (per-role)
│   └── requirements.txt
│
└── bisnis/                   # ← SEMUA BISNIS DI SINI
    │
    ├── teestock/             # 👕 Apparel POD Brand
    │   ├── riset/            # Analisis bisnis, pasar, website, niche
    │   ├── brand/            # Brand guide, logo, palet warna
    │   ├── tools/            # HPP calculator, business plan
    │   ├── operasional/      # SOP, rencana operasional, struktur
    │   ├── keuangan/         # Laporan keuangan, invoice
    │   ├── desain/           # File desain per series
    │   └── marketing/        # Konten kalender, aset sosmed
    │
    ├── multigraph/           # 🖨️ Printing Business
    │   ├── riset/
    │   ├── brand/
    │   ├── tools/
    │   ├── operasional/
    │   ├── keuangan/
    │   └── marketing/
    │
    └── titik-buta/           # 👁️ Titik Buta
        ├── riset/
        ├── brand/
        ├── tools/
        ├── operasional/
        ├── keuangan/
        └── marketing/
```

## 🏢 Portfolio Bisnis

| # | Bisnis | Bidang | Status |
|---|--------|--------|--------|
| 1 | **TeeStock** | Apparel POD & Blanks House | 🟢 Launch Prep — Web App Live, Direction A Lookbook, In-House Heat Press Active, Authentic Master Logo Integrated |
| 2 | **MultiGraph** | Printing & Packaging Collateral | 🟡 Supporting Arm — Riset B2B & Pasokan Kemasan Unboxing TeeStock |
| 3 | **Titik Buta** | TBD | 🔴 Ideation |

## 📌 Konvensi Folder

Setiap bisnis punya sub-folder yang sama:

| Folder | Isi |
|--------|-----|
| `riset/` | Analisis pasar, kompetitor, validasi ide |
| `brand/` | Logo, brand guide, identitas visual |
| `tools/` | Kalkulator, template, tools interaktif |
| `operasional/` | SOP, rencana operasional, vendor, produksi |
| `keuangan/` | HPP, pricing, laporan keuangan, invoice |
| `desain/` | File desain produk (opsional, per bisnis) |
| `marketing/` | Konten kalender, copywriting, aset sosmed |

---

*Last updated: September 2026*
