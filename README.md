---
title: "BisnisHub Command Center"
type: documentation
date: "2026-09-14"
bisnis: umum
kategori: operasional
status: active
tags:
  - bisnishub
  - command-center
  - documentation
---

# 🚀 BisnisHub Command Center

> [!abstract] **Visi Workspace**
> Workspace utama untuk mengelola **3 bisnis solopreneur** (TeeStock, MultiGraph, Titik Buta) yang terintegrasi penuh antara **Obsidian Vault** (Second Brain) dan **Google Antigravity & Virtual C-Suite** (Execution Engine).
> 
> 🔗 **Buka Dashboard Utama di Obsidian**: [[🏠 BisnisHub Command Center|🏠 BisnisHub Command Center.md]]  
> 🗺️ **Buka Peta Visual Arsitektur**: [[🗺️ BisnisHub Ecosystem.canvas|BisnisHub Ecosystem.canvas]]  
> 📘 **Panduan Sinergi AI & Obsidian**: [[catatan/panduan-antigravity-obsidian|Panduan Antigravity & Obsidian]]

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

## 📂 Struktur Direktori & Obsidian Vault

```
bisnishub/
│
├── 🏠 🏠 BisnisHub Command Center.md   # Obsidian Master Dashboard
├── 🗺️ 🗺️ BisnisHub Ecosystem.canvas     # Obsidian Visual Canvas
├── 🤖 agent.py & main.py               # AI Multi-Role C-Suite CLI Engine
├── ⚙️ GEMINI.md                        # AI Assistant Rules & Skills Registry
│
├── 📁 memory/                          # Persistent Memory Layer
│   ├── business_profile.json          # Master data 3 bisnis & unit economics
│   ├── growth_log.json                # Self-improvement log
│   ├── history.json                   # Sesi CLI context cache
│   └── README.md                      # Dokumentasi sistem memory
│
├── 📁 templates/                       # Obsidian Master Templates
│   ├── Template - Catatan Harian.md
│   ├── Template - Weekly Business Review.md
│   ├── Template - Sesi Konsultasi C-Suite.md
│   ├── Template - SOP Operasional.md
│   ├── Template - Riset & Benchmarking.md
│   ├── Template - Marketing & Konten Kampanye.md
│   └── Template - Validasi & Riset Ide.md
│
├── 📁 catatan/                         # Jurnal & Output Konsultasi
│   ├── harian/                        # Daily notes (auto YYYY-MM-DD.md)
│   ├── weekly-review/                 # Review mingguan bisnis
│   ├── sesi/                          # Transkrip sesi konsultasi C-Suite
│   ├── ide/                           # Scratchpad ide & backlog
│   └── panduan-antigravity-obsidian.md# Panduan lengkap sinergi AI & Obsidian
│
└── 📁 bisnis/                          # Portofolio 3 Bisnis
    ├── teestock/                      # 👕 Apparel POD & Blanks House
    │   ├── riset/                     # Analisis pasar & benchmarking
    │   ├── brand/                     # Brand guide & master copywriting
    │   ├── tools/                     # HPP calculator & simulasi
    │   ├── operasional/               # SOP heat press & fulfillment
    │   ├── keuangan/                  # Skema pricing & fee gateway
    │   └── web/                       # React 18 + Vite storefront
    ├── multigraph/                    # 🖨️ Printing & Packaging Collateral
    │   ├── operasional/               # Katalog kemasan unboxing TeeStock
    │   └── riset/                     # Riset pasar B2B packaging
    └── titik-buta/                    # 👁️ Project Incubator
        └── riset/                     # Validasi ide & pain points
```

---

## 🏢 Portfolio Bisnis

| # | Bisnis | Bidang | Status | Navigasi |
|---|--------|--------|--------|----------|
| 1 | **TeeStock** | Apparel POD & Blanks House | 🟢 Launch Prep | [[bisnis/teestock/README\|Dokumentasi TeeStock]] |
| 2 | **MultiGraph** | Printing & Packaging Collateral | 🟡 Supporting Arm | [[bisnis/multigraph/README\|Dokumentasi MultiGraph]] |
| 3 | **Titik Buta** | Project Incubator | 🔴 Ideation | [[bisnis/titik-buta/README\|Dokumentasi Titik Buta]] |

---

## 📌 Konvensi Folder Sub-Direktori Bisnis

Setiap bisnis memiliki struktur sub-folder standar untuk konsistensi operasional:

| Folder | Isi & Tanggung Jawab |
|--------|----------------------|
| `riset/` | Analisis pasar, benchmarking kompetitor, validasi hipotesis |
| `brand/` | Identitas visual, tone of voice, panduan aset, copywriting |
| `tools/` | Kalkulator interaktif, spreadsheet, template perhitungan |
| `operasional/` | SOP teknis, supply chain, alur kerja produksi & QC |
| `keuangan/` | HPP, unit economics, analisis fee payment gateway, laporan laba |
| `desain/` | Master file aset grafis, mockup produk, gang sheet DTF |
| `marketing/` | Kalender peluncuran, formula bundling, materi promosi |

---

*Last updated: September 2026*

