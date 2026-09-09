---
name: web-app-architect
description: >-
  Perancangan arsitektur web apps, pemodelan sistem, information architecture,
  user flows, pemilihan tech stack (React/Vite/Next.js/Node/Supabase), struktur folder modular,
  hierarki komponen, state management (Zustand/TanStack Query), dan spesifikasi API.
  Gunakan saat merancang web app baru dari nol, merestrukturisasi codebase,
  atau menentukan desain sistem.
argument-hint: "[architecture, stack, schema, userflow, or system-design]"
---

# Web App Architect — System Design & Architecture Specialist

Skill spesialis untuk merancang arsitektur aplikasi web modern yang lean, modular, scalable, dan hemat biaya (*cost-effective*) bagi solopreneur dan startup.

---

## 1. Prinsip Perancangan: Pragmatic & Lean Architecture

Bagi tim kecil atau solopreneur, arsitektur terbaik adalah arsitektur yang:
1. **Zero Dev-Ops Overhead**: Maksimalkan serverless / BaaS (Supabase, Vercel, Cloudflare) sebelum membangun infrastruktur server sendiri.
2. **Type Safety End-to-End**: Selalu gunakan TypeScript strict mode di client, server, dan skema database untuk mencegah runtime bug.
3. **Modular Feature-Driven**: Kelompokkan kode berdasarkan domain fitur (*feature folder*), bukan hanya jenis file (*layer folder*).

```
src/
├── features/               # Modul fitur terisolasi
│   ├── catalog/            # e.g. Katalog produk
│   │   ├── components/     # UI khusus fitur ini
│   │   ├── hooks/          # Custom hooks (data fetching/state)
│   │   ├── types/          # TypeScript interface fitur
│   │   └── api/            # Query/mutation functions
│   ├── checkout/           # e.g. Keranjang & Alur Pembayaran
│   └── auth/               # e.g. Login, Profile, Session
├── shared/                 # Komponen & utilitas global
│   ├── components/ui/      # Komponen dasar (Button, Modal, Input)
│   ├── lib/                # Konfigurasi Supabase, API client, utils
│   └── hooks/              # Global hooks (useMediaQuery, useDebounce)
└── App.tsx / routes.tsx    # Router & Top-level provider
```

---

## 2. Blueprint Pemilihan Stack (Decision Framework)

Pilih arsitektur sesuai tipe produk web yang sedang dibangun:

| Kebutuhan Web App | Rekomendasi Stack | Alasan & Keunggulan |
|---|---|---|
| **E-Commerce / Katalog / Dashboard Internal** (e.g. TeeStock Web) | **React + Vite + Tailwind + Supabase** | Build ultra-cepat, SPA ringan, deployment statis gratis (Vercel/Cloudflare Pages), BaaS PostgreSQL gratis. |
| **Portal B2B / Multi-tenant SaaS** (e.g. Titik Buta / MultiGraph Portal) | **Next.js (App Router) + Supabase/Postgres** | Mendukung SSR untuk SEO publik, Server Actions untuk keamanan backend tanpa setup API terpisah. |
| **High-Traffic Landing Page / Kampanye** | **Astro / HTML + Tailwind** | Zero JavaScript footprint secara default, kecepatan load instan untuk konversi iklan tinggi. |

---

## 3. Strategi State Management: 3-Layer Separation

Hindari menumpuk semua data ke dalam satu global state. Pisahkan menjadi 3 layer:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. SERVER STATE (Data dari Database / API)                             │
│ • Tool: TanStack Query (React Query) atau Supabase Realtime            │
│ • Karakter: Asynchronous, butuh caching, refetching, background update │
│ • Contoh: Data produk, riwayat pesanan, status stok                    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴─────────────────────────────────────┐
│ 2. CLIENT APP STATE (State Global UI)                                  │
│ • Tool: Zustand (sederhana & ringan) atau React Context                │
│ • Karakter: Synchronous, persisten di sesi browser, lintas halaman     │
│ • Contoh: Keranjang belanja (cart items), theme, filter aktif          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴─────────────────────────────────────┐
│ 3. LOCAL COMPONENT STATE (State Lokal)                                 │
│ • Tool: React useState, useReducer                                     │
│ • Karakter: Hanya hidup di dalam komponen saat dirender                │
│ • Contoh: Modal isOpen, tab index aktif, input form sementara          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Alur Perancangan Sistem (System Design Checklist)

Ketika merancang fitur atau web app baru, jalankan urutan ini:

1. **User Flow & State Diagram:**
   Gambarkan diagram alur bagaimana pengguna berpindah dari satu tahap ke tahap berikutnya beserta kondisi error/edge case.
2. **Data Entity Relationship (ERD):**
   Tentukan entitas data, tipe primary key (UUID v4), relasi foreign key, dan indeks yang dibutuhkan.
3. **API Contract (Request & Response):**
   Definisikan payload JSON dan schema validasi (menggunakan **Zod**) sebelum menulis baris kode UI.
4. **Hierarki Komponen:**
   Pecah desain UI menjadi komponen *Container* (mengurus data fetching) dan *Presentational* (pure UI tanpa side-effect).
5. **Edge Cases & Failure Recovery:**
   Rencanakan tampilan:
   - *Loading State*: Skeleton shimmer daripada spinner polos.
   - *Empty State*: Ajakan bertindak (*Call-to-Action*) yang jelas ketika data kosong.
   - *Error State*: Pesan ramah pengguna dengan tombol *Retry*.
