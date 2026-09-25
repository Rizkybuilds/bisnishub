# MultiGraph Business OS (MGBOS) — Master Engineering & Architecture Guide

> **Status:** MGBOS-001 s.d. MGBOS-014 implemented locally (see verification boundaries in the MGBOS-007/008/009/010/011/012/013/014 reports) (Next.js 16 + React 19 + Strict TypeScript + pnpm Monorepo)  
> **System of Record:** PostgreSQL 17 / Supabase Local (Project: `mgbos-foundation`, Ports: 55431–55439)  
> **Quality Gates:** 240 pgTAP database tests defined, 162/162 Vitest tests passing, 100% strict TypeScript typechecked & built  
> **Engineering Constitution:** Read [AGENTS.md](AGENTS.md), [ADR-001 (Modular Monolith)](docs/adr/001-modular-monolith.md), and [ADR-007 (Coexistence)](docs/adr/007-workspace-coexistence.md).

---

## 1. Executive Business Vision: MultiGraph Group Holding

MGBOS adalah **Operating System Bisnis & ERP Terpadu** yang dirancang untuk mengendalikan seluruh unit bisnis di bawah naungan **MultiGraph Group**:

```text
                           MULTIGRAPH GROUP HOLDING
                                      │
    ┌─────────────────┬───────────────┼───────────────┬─────────────────┐
    ▼                 ▼               ▼               ▼                 ▼
MultiGraph        TeeStock         NeoPack        Pack Point     Squeegee Studios
(Commercial B2B)  (Apparel & POD)  (Retail Box)   (Master Box)   (Manual Screenprint)
```

### The Double Flywheel Strategy: MultiGraph sebagai Client #0

MGBOS tidak dibangun di atas asumsi abstrak. MGBOS berfungsi ganda sebagai **Laboratorium Internal (Client #0)** untuk pilar bisnis personal brand & automasi **RizkyBuild**:

1. **Business Asset:** Mengotomasi transaksi fisik, HPP garmen, dan pekerjaan multi-vendor MultiGraph.
2. **Content Asset:** Bukti implementasi nyata untuk konten _Build in Public_ (_"Gue bikin AI quotation bot untuk bisnis garmen gue"_).
3. **Product Asset:** Modul software yang teruji di pabrik sendiri dapat diprodukkan menjadi AI Services dan Micro-SaaS untuk klien luar.

---

## 2. Monorepo Topology & Boundaries

MGBOS menggunakan arsitektur **Modular Monolith** dengan batasan paket yang sangat ketat:

```text
mgbos/
├── apps/
│   ├── mgbos/           --> Internal Operating System Shell (Next.js 16, Port 3101)
│   └── teestock/        --> Public Storefront & Custom Atelier Shell (Next.js 16, Port 3102)
│
├── packages/
│   ├── domain/          --> PURE TypeScript business rules (Zero framework/DB imports)
│   ├── config/          --> Environment validation using Zod (server-only guards)
│   ├── database/        --> Introspected Supabase types & client factories
│   ├── validation/      --> Reusable Zod schemas for contracts & forms
│   ├── auth/            --> Authentication & role-based authority boundaries
│   ├── events/          --> Canonical business event envelopes & outbox types
│   ├── integrations/    --> External gateways (WhatsApp, RajaOngkir, Midtrans)
│   ├── ai/              --> AI orchestration interfaces (LLM/Vision - non-authoritative)
│   └── ui/              --> Shared design tokens & foundational components
│
├── supabase/            --> Isolated local Supabase configuration, migrations, & pgTAP tests
├── automation/n8n/      --> Documentation & orchestration boundaries
└── docs/                --> Architecture, Product, Engineering specs, ADRs, & runbooks
```

---

## 3. Location and Workspace Coexistence (ADR-007)

> [!important]
> **Selalu jalankan perintah MGBOS di dalam direktori `mgbos/` (`cd mgbos`).**
>
> - Direktori `apps/mgbos/` di root repositori adalah **Vite prototype** terdahulu yang tetap dipertahankan sebagai referensi UI (Port 3001).
> - Workspace `mgbos/` ini adalah **fondasi Next.js resmi** (Port 3101/3102).
> - Workspace ini memiliki database Supabase lokal terisolasi dan **dilarang keras menyentuh `../supabase`** (link database TeeStock live).

---

## 4. Prerequisites

- **Node.js:** `22.23.2` (dipin di `.node-version` dan `.nvmrc`).
- **pnpm:** `10.34.5` (dipin di `packageManager` dan `engines`).
- **Docker-compatible runtime:** Diperlukan untuk menjalankan stack database lokal Supabase (`pnpm db:start`).

---

## 5. Quick Start

Dari root repositori Bisnis Hub:

```sh
cd mgbos
pnpm install --frozen-lockfile
pnpm db:start
pnpm dev
```

_Jika versi global pnpm berbeda di sistem Anda, gunakan prefix npm exec:_

```sh
npm exec --yes --package=pnpm@10.34.5 -- pnpm check
```

- **MGBOS Internal Shell:** Buka [http://localhost:3101](http://localhost:3101)
- **TeeStock Public Shell:** Jalankan `pnpm dev:teestock`, buka [http://localhost:3102](http://localhost:3102)

---

## 6. Environment Configuration

- Salin `.env.example` di masing-masing aplikasi (`apps/mgbos/.env.example` dan `apps/teestock/.env.example`) ke `.env.local` di dalam folder aplikasi yang sama.
- Validasi environment dijalankan saat build via `packages/config` berbasis Zod. URL yang tidak valid atau bocornya secret-key ke client akan menggagalkan build secara otomatis.

---

## 7. Developer Commands

| Command                     | Purpose                                                   |
| --------------------------- | --------------------------------------------------------- |
| `pnpm dev`                  | Menjalankan MGBOS Internal Shell (Port 3101)              |
| `pnpm dev:teestock`         | Menjalankan TeeStock Public Shell (Port 3102)             |
| `pnpm build`                | Production build kedua aplikasi Next.js                   |
| `pnpm lint`                 | ESLint checks (Next.js, React, TypeScript strict)         |
| `pnpm typecheck`            | Strict TypeScript verification di seluruh apps & packages |
| `pnpm test` / `test:unit`   | Vitest unit tests (packages/config, scripts)              |
| `pnpm test:integration`     | HTTP smoke tests untuk kedua server produksi              |
| `pnpm check`                | Full pipeline: Format + Lint + Typecheck + Test + Build   |
| `pnpm db:start` / `db:stop` | Start / stop local Supabase stack                         |
| `pnpm db:reset`             | Reset database lokal MGBOS & apply migrasi bersih         |
| `pnpm db:test`              | Menjalankan pgTAP unit tests di database lokal            |
| `pnpm db:types`             | Introspeksi skema database menjadi TypeScript types       |

---

## 8. Pilot Scope: TeeStock Custom Atelier (MVP 0.5)

Pilot pertama MGBOS membuktikan satu transaksi nyata dari hulu ke hilir:
$$\text{WhatsApp Inquiry} \rightarrow \text{Lead} \rightarrow \text{Requirement} \rightarrow \text{Quotation (CFO Floor)} \rightarrow \text{Order Snapshot} \rightarrow \text{Invoice/DP} \rightarrow \text{Production Job} \rightarrow \text{QC} \rightarrow \text{Shipment} \rightarrow \text{Actual Margin}$$

Lihat dokumentasi lengkap di:

- 📖 [Arsitektur Sistem & Data](docs/architecture/README.md)
- 🛍️ [Spesifikasi Produk Custom Atelier](docs/product/README.md)
- ⚙️ [Standar Rekayasa & CI](docs/engineering/README.md)
- 🛡️ [Local Database Runbook](docs/runbooks/local-database.md)

## 9. Maintenance and operational readiness

Follow the [maintenance policy](docs/engineering/maintenance-policy.md) and [readiness register](docs/engineering/operational-readiness.md). Release, backup/restore and incident procedures are linked there. Written policy is not evidence of configured services or production readiness; the local-only database boundary remains in force.
