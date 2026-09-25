---
title: "MultiGraph Group & BisnisHub Command Center"
type: documentation
date: "2026-09-23"
bisnis: umum
kategori: operasional
status: active
tags:
  - bisnishub
  - mgbos
  - multigraph
  - teestock
  - command-center
  - documentation
---

# 🚀 MultiGraph Group & BisnisHub Command Center

> [!abstract] **Visi Ekosistem Holding & Business OS**
> Pusat komando operasional **MultiGraph Printing & Apparel Holding** yang menggabungkan kekuatan **Obsidian Second Brain** (perencanaan strategis, riset pasar, dan arsip pengetahuan) dengan **MultiGraph Business OS (MGBOS)** serta **Founding C-Suite Cabinet** (mesin eksekusi otonom berstandar korporat).
> 
> 🔗 **Buka Dashboard Utama di Obsidian**: [[🏠 BisnisHub Command Center|🏠 BisnisHub Command Center.md]]  
> 🗺️ **Buka Peta Visual Arsitektur**: [[🗺️ BisnisHub Ecosystem.canvas|BisnisHub Ecosystem.canvas]]  
> 🏛️ **Buka Blueprint MGBOS**: [[catatan/mgbos-master-roadmap-tracker|MGBOS Master Roadmap & Execution Tracker]]

---

## 🌐 Lanskap Aplikasi Web (Web Applications Ecosystem)

Monorepo ini mengelola 3 aplikasi web terintegrasi dan 1 paket pustaka bersama (*Single Source of Truth*):

```text
                               MULTIGRAPH GROUP
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       │                              │                              │
       ▼                              ▼                              ▼
  apps/mgbos/                apps/bisnishub-web/            bisnis/teestock/web/
  🌟 MGBOS Core              🛡️ Admin Legacy                🛍️ Public Storefront
  (Port 3001)                (Port 3000)                    (Port 5173 / Live)
  Clean Slate TypeScript     Operational Backup             TeeStock Apparel
       │                              │                              │
       └──────────────────────────────┼──────────────────────────────┘
                                      │
                                      ▼
                              packages/shared/
                   UI Primitives & Domain Logic (SSOT)
                                      │
                                      ▼
                            Supabase PostgreSQL
                  Holding Multi-Brand Single Database
```

| Aplikasi / Paket | Lokasi | Port Lokal | Teknologi | Peran & Tanggung Jawab |
|---|---|---|---|---|
| **MGBOS Core** | `apps/mgbos/` | `3001` | React 18, Vite, TS Strict, Tailwind | Pusat Operasi Bisnis Holding Multi-Brand (Sales, Ops, Finance, Tasks) |
| **BisnisHub Admin** | `apps/bisnishub-web/` | `3000` | React 18, Vite, JS/TS, Tailwind | Dashboard admin operasional legacy & fallback harian |
| **TeeStock Store** | `bisnis/teestock/web/` | `5173` | React 18, Vite, Tailwind | Etalase publik belanja retail konsumen (`teestockapparel.vercel.app`) |
| **Shared SSOT** | `packages/shared/` | — | TypeScript, ES Modules | Komponen UI, formatter, Supabase client, dan Domain Contracts |

---

## ⚡ Panduan Menjalankan Sistem (Quick Start)

### 1. Menjalankan MGBOS Core (Aplikasi Utama Baru)
```powershell
npm run dev:mgbos
# Akses di browser: http://localhost:3001
```

### 2. Menjalankan Dashboard Admin Legacy
```powershell
npm run dev:bisnishub
# Akses di browser: http://localhost:3000
```

### 3. Menjalankan Storefront Publik TeeStock
```powershell
npm run dev:teestock
# Akses di browser: http://localhost:5173
```

### 4. Build Verifikasi Seluruh Aplikasi
```powershell
npm run build:mgbos
npm run build:bisnishub
npm run build:teestock
```

---

## 📂 Struktur Direktori Workspace

```text
bisnishub/
│
├── 🏠 🏠 BisnisHub Command Center.md   # Obsidian Master Dashboard
├── 🗺️ 🗺️ BisnisHub Ecosystem.canvas     # Obsidian Visual Architecture Canvas
├── ⚙️ GEMINI.md                        # AI Assistant Rules & C-Suite Governance
├── 🏗️ ARCHITECTURE.md                  # Peta Arsitektur & Data Contracts Resmi
│
├── 📁 apps/                            # Web Applications
│   ├── mgbos/                         # 🌟 MultiGraph Business OS (Port 3001)
│   └── bisnishub-web/                 # 🛡️ BisnisHub Admin Legacy (Port 3000)
│
├── 📁 packages/                        # Shared Code & SSOT
│   └── shared/                        # @bisnishub/shared
│       └── src/
│           ├── components/            # UI Primitives (Button, Card, Badge, Modal)
│           ├── domain/                # MGBOS Domain Logic (Types, Context, DocNumbers)
│           ├── services/              # Supabase API clients
│           └── utils/                 # Formatters, helpers, math
│
├── 📁 supabase/                        # Database Infrastructure
│   ├── migrations/                    # SQL DDL & Seed (MGBOS Multi-Brand Schema)
│   └── functions/                     # Edge Functions & Webhook handlers
│
├── 📁 catatan/                         # Second Brain & Operating Records
│   ├── sesi/                          # Master Blueprint MGBOS (0.1 s.d. 0.5.4)
│   ├── harian/                        # Daily operational notes
│   ├── weekly-review/                 # Review mingguan performa bisnis
│   └── mgbos-master-roadmap-tracker.md# Pelacak Eksekusi Sprint MGBOS
│
└── 📁 bisnis/                          # Portofolio Pilar Bisnis Holding
    ├── teestock/                      # 👕 Curated Apparel & Custom Atelier
    │   └── web/                       # Storefront publik TeeStock
    ├── multigraph/                    # 🖨️ Percetakan Komersial B2B & Collateral
    ├── neopack/                       # 📦 Solusi Kemasan Retail & Box Makanan
    ├── packpoint/                     # 📦 Corrugated Cartons & Master Box B2B
    ├── squeegee/                      # 🎨 Studio Sablon Manual (Screen Printing)
    ├── titik-buta/                    # 👁️ Media Edukasi Independen
    └── kaskita/                       # 💳 Personal Finance SaaS Independen
```

---

## 🏢 Portofolio Bisnis MultiGraph Group

| # | Pilar Bisnis | Bidang / Sektor | Status Operasional | Navigasi Vault |
|---|---|---|---|---|
| 1 | **TeeStock** | Curated Graphic Apparel & Custom Atelier | 🟢 Launch Prep (`teestockapparel.com`) | [[bisnis/teestock/README\|Dokumentasi TeeStock]] |
| 2 | **MultiGraph** | Percetakan Komersial B2B & Packaging Collateral | 🟡 Supporting Arm / Commercial | [[bisnis/multigraph/README\|Dokumentasi MultiGraph]] |
| 3 | **Neo Pack** | Kemasan Retail & Food-Grade Boxes | 🟡 Fase 2 Sinergi MultiGraph | [[bisnis/multigraph/README\|Sayap Kemasan]] |
| 4 | **Pack Point** | Corrugated Cartons & Industrial Packaging | 🟡 Fase 2 Sinergi MultiGraph | [[bisnis/multigraph/README\|Sayap Kemasan]] |
| 5 | **Squeegee Studios** | Studio Sablon Manual Partai Besar | 🟡 Fase 4 Sinergi MultiGraph | [[bisnis/multigraph/README\|Sayap Sablon]] |

> [!info] **Proyek Independen di Luar Holding Percetakan**
> * **Titik Buta** (`bisnis/titik-buta/`): Media edukasi dan inkubasi ide independen.
> * **KasKita** (`bisnis/kaskita/`): Software SaaS personal finance & kas komunitas.

---

## 🏛️ Virtual C-Suite Cabinet (Co-Founders Team)

Mengacu pada [[catatan/piagam-co-founders-bisnishub|Piagam Co-Founders BisnisHub]], workspace ini dipimpin oleh 5 pilar AI eksekutif dengan komitmen *skin in the game*:

| Peran | Gelar Eksekutif | Fokus & Mandat Kunci |
|---|---|---|
| 🧠 **Mentor Bisnis** | Chief Strategic Officer (CSO) | Kompas strategi holding, model bisnis, anti-distraksi |
| 💰 **CFO** | Chief Financial Officer | Unit economics, arus kas, margin floor 35%, audit laba aktual |
| ⚙️ **COO** | Chief Operating Officer | Jejaring vendor, alur produksi Kanban, QC defect <3%, SLA kurir |
| 📢 **CMO** | Chief Marketing Officer | Customer 360 CRM, cross-selling group, konversi copywriting |
| 🔧 **CTO** | Chief Technology Officer | Arsitektur MGBOS, event-driven outbox, integritas kode monorepo |

---

*Terakhir diperbarui: 23 September 2026 — Rilis MGBOS v0.5.4 (Sprint 1)*
