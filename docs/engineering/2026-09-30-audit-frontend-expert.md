Sudah gue audit repo `Rizkybuilds/bisnishub` dari perspektif **Frontend Architecture + UI/UX + accessibility + frontend QA + product experience**. Basis audit adalah `main`; commit terbaru yang terbaca saat audit adalah `9aa8a698` tanggal 29 September 2026. **Gue belum mengubah kode apa pun.** [Commit audit baseline](https://github.com/Rizkybuilds/bisnishub/commit/9aa8a698b9b9daab6103a9e4139cd08adbb09fb4?utm_source=chatgpt.com)

## Executive finding

Secara engineering, kondisi repo sekarang jauh lebih sehat daripada arsitektur Vite lama. Source of truth aktif sudah benar-benar berada di `systems/mgbos/`: Next.js 16, React 19, strict TypeScript, server actions, domain packages, auth/permission boundary, database contract, dan pemisahan MGBOS internal vs TeeStock public. Arsip Vite/TeeStock lama sudah diposisikan dengan benar sebagai referensi saja. [Current repository map](https://github.com/Rizkybuilds/bisnishub/blob/main/README.md?utm_source=chatgpt.com) [MGBOS engineering guide](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/README.md?utm_source=chatgpt.com)

Masalahnya: **maturity frontend tertinggal cukup jauh dari maturity backend/domain**.

MGBOS hari ini sudah punya banyak business capability, tetapi presentation layer-nya masih terasa seperti **engineering admin console yang terus ditambah per modul**, bukan sebuah coherent Business Operating System. Sementara active TeeStock Next.js belum bisa disebut storefront—masih placeholder.

Jadi gue **tidak merekomendasikan rewrite**. Fondasinya justru layak dipertahankan. Yang dibutuhkan sekarang adalah satu fase khusus: **Frontend Foundation / Experience Architecture**.

## Temuan utama

| Priority | Temuan | Dampak |
|---|---|---|
| **P0 / Critical** | Seed password disimpan di repo publik dan bahkan diprefill ke field login client-side | Release blocker sebelum MGBOS pernah diekspos ke network/public environment |
| **P1 / High** | `@mgbos/ui` masih kosong; mayoritas UI dibuat ad-hoc dengan raw hex + inline styles | Visual drift, maintenance makin mahal, redesign lintas modul sangat sulit |
| **P1 / High** | Shell belum benar-benar responsive | MGBOS berisiko buruk di tablet/HP, terutama Inventory, Production, Shipment, POS |
| **P1 / High** | Modal custom tidak memenuhi dialog accessibility | Keyboard/focus/screen-reader flow bermasalah |
| **P1 / High** | Active frontend hampir tidak punya automated UI testing | Regression UI/UX bisa lolos meskipun `pnpm check` hijau |
| **P1 / High** | TeeStock aktif hanyalah placeholder | Belum ada consumer product experience yang bisa dirilis |
| **P2 / Medium** | Navigation active state salah dan information architecture mulai padat | Orientasi user melemah seiring jumlah modul bertambah |
| **P2 / Medium** | Static config/UI data berpotensi drift dari database | UI bisa menampilkan kenyataan berbeda dari system of record |
| **P2 / Medium** | Loading/error architecture tidak konsisten | Navigasi berbasis server-fetch dapat terasa “diam” |
| **P2 / Medium** | Engineering status bocor ke product UI | Sistem terasa seperti development console, bukan operating product |

---

# 1. P0 — ada credential yang tidak boleh lolos ke deployment

Ini temuan paling mendesak.

`LoginForm.tsx` mempunyai `defaultValue` untuk email **dan password seed**. Password yang sama terdapat di `supabase/seed.sql`. Karena repository bersifat public, credential tersebut pada dasarnya sudah dianggap exposed. [LoginForm.tsx](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/apps/mgbos/src/app/%28auth%29/login/LoginForm.tsx?utm_source=chatgpt.com) [MGBOS seed.sql](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/supabase/seed.sql?utm_source=chatgpt.com)

Kabar baiknya, repo saat ini memang masih menjaga MGBOS sebagai local-oriented environment dan root Vercel sengaja dibuat tidak menjadi deployment target. Jadi gue tidak menyimpulkan ada production account yang saat ini bisa dieksploitasi. [Root deployment guard](https://github.com/Rizkybuilds/bisnishub/blob/main/vercel.json?utm_source=chatgpt.com)

Tetapi sebelum hosted staging sekalipun, ini harus dibereskan: password jangan pernah diprefill, fixture local harus dipisahkan dari credential deployable, dan password development sebaiknya dihasilkan/setup dari environment atau local bootstrap.

---

# 2. Frontend tidak punya design system sungguhan

Arsitekturnya sebenarnya sudah menyediakan boundary yang tepat:

`packages/ui`

Tetapi implementasinya sekarang hanya:

```ts
// Reserved boundary. Implement only when an approved slice needs it.
export {};
```

[Current @mgbos/ui boundary](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/packages/ui/src/index.ts?utm_source=chatgpt.com)

Akibatnya masing-masing feature membuat tampilan sendiri.

Contoh konkret yang gue ukur dari current source:

| File | Ukuran | Inline style |
|---|---:|---:|
| Dashboard | 447 lines | 47 |
| Retail POS Modal | **878 lines** | **53** |
| Inventory components | **1,224 lines** | **83** |
| Procurement page | 514 lines | 68 |
| Ledger page | 537 lines | 73 |
| Payments page | 459 lines | 54 |

Ini sudah menjadi **frontend scaling problem**, bukan sekadar masalah selera coding.

Lebih terlihat lagi dari visual language. Shell utama memakai dark UI, tetapi sejumlah modal inventory/POS berubah menjadi white/light interface. Status badge, form field, spacing, button, card dan table sering didefinisikan ulang memakai hex literal.

Targetnya seharusnya:

`@mgbos/ui → tokens → primitives → patterns → feature UI`

Contohnya Button, IconButton, Badge, Input, Select, FormField, Dialog, Sheet, Card, KPI Card, DataTable, PageHeader, EmptyState, Alert, Skeleton dan StatusBadge.

Baru setelah itu feature modules compose primitives tersebut.

---

# 3. Responsive design saat ini belum memenuhi product spec

Ini menarik karena spesifikasi MGBOS sendiri menyebut:

> “Layout MGBOS Shell dirancang responsif”

Tetapi implementasinya belum sampai ke sana. [MGBOS product screen architecture](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/docs/product/README.md?utm_source=chatgpt.com)

`globals.css` mempunyai sidebar fixed `260px`, topbar yang cukup padat, content padding desktop, dan gue tidak menemukan responsive media-query architecture di file global tersebut. [Current MGBOS globals.css](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/apps/mgbos/src/app/globals.css?utm_source=chatgpt.com)

Masalahnya diperkuat beberapa page yang menggunakan grid fixed seperti:

```css
grid-template-columns: repeat(4, 1fr)
```

atau POS line item:

```text
2.5fr | 1fr | 1.2fr | 1fr | auto
```

Tabel memang sudah punya horizontal overflow—itu positif—tetapi shell, action bars, form, KPI, brand switcher dan operational modal belum punya adaptive pattern.

Untuk ERP semacam MGBOS ini sangat penting. Inventory, QC, shipping, stock opname, dan quick POS justru merupakan workflow yang sangat mungkin disentuh dari HP/tablet.

Target shell menurut gue:

**Desktop ≥ 1200:** persistent sidebar.

**Tablet 768–1199:** collapsible/sidebar sheet.

**Mobile < 768:** compact topbar + drawer, page action dibuat sticky bila penting, KPI 1–2 kolom, data presentation memakai priority columns/card adaptation.

---

# 4. Accessibility modal adalah High Priority

Gue inspect beberapa modal aktif seperti Create Customer, Create Lead, Retail POS, dan Inventory.

Pattern-nya hampir sama: fixed `<div>` overlay + `<div>` card.

Tetapi container tersebut tidak mempunyai semantic dialog behavior yang lengkap: tidak ada `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trapping, Escape-to-close, dan reliable focus return. Beberapa tombol `✕` juga tidak punya accessible label.

Create Customer: [CreateCustomerModal.tsx](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/apps/mgbos/src/app/%28app%29/customers/CreateCustomerModal.tsx?utm_source=chatgpt.com)

Retail POS bahkan mempunyai banyak field yang menggunakan placeholder sebagai satu-satunya petunjuk field, khususnya bagian alamat pengiriman. [RetailOrderCreateModal.tsx](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/apps/mgbos/src/app/%28app%29/orders/RetailOrderCreateModal.tsx?utm_source=chatgpt.com)

Ada fondasi a11y yang bagus: `<html lang="id">`, `focus-visible`, login error dengan `role="alert"`, dan status biasanya tidak bergantung hanya pada warna. Jadi ini bukan situasi “aksesibilitas nol”; tinggal distandarkan.

---

# 5. Navigation sudah mulai terlalu implementation-oriented

Grouping sidebar-nya sebenarnya logis:

Sales → Operations → Finance → System.

Tapi ada beberapa problem.

Di `layout.tsx`, link **Command Center selalu diberi class `active`**, terlepas user sedang berada di Leads, Inventory, Procurement, atau halaman lain. Itu bug navigation state yang konkret. [Active MGBOS application shell](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/apps/mgbos/src/app/%28app%29/layout.tsx?utm_source=chatgpt.com)

Selain itu sidebar masih membawa badge seperti:

`ACTIVE`

`MGBOS-017`

`MGBOS-018`

`MGBOS-019`

Itu berguna untuk developer, tetapi tidak memberi value pada operator. Di production UI, area tersebut jauh lebih berguna untuk menunjukkan sesuatu seperti jumlah overdue invoice, low-stock alerts, pending QC, shipment yang harus dikirim, atau bahkan tidak ada badge sama sekali.

Brand switcher juga selalu melakukan redirect ke `/dashboard`. Jadi user yang sedang mengelola inventory lalu mengganti brand kehilangan task context.

Targetnya: centralized typed navigation config + permission + pathname + brand capability. Jangan hardcode navigation decision di JSX panjang.

---

# 6. UI test coverage menjadi blind spot terbesar CI

Current Vitest config hanya memasukkan:

```text
packages/**/*.test.ts
scripts/**/*.test.ts
```

Bukan `apps/**/*.tsx`. [Current Vitest config](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/vitest.config.ts?utm_source=chatgpt.com)

Current HTTP smoke test hanya memeriksa status response, string tertentu, health route dan 404. [Current smoke test](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/scripts/smoke.mjs?utm_source=chatgpt.com)

Jadi sekarang bisa terjadi:

**database benar + domain benar + build benar + typecheck benar + CI hijau**, tetapi modal tidak bisa digunakan keyboard, mobile layout rusak, button tidak terlihat, navigation salah, atau form action UX regress.

Ini sangat penting karena repo backend/database justru sudah mempunyai testing discipline yang bagus.

Frontend sekarang perlu test pyramid-nya sendiri: component interaction → accessibility → real browser E2E → responsive screenshots.

---

# 7. Business logic preview di UI mulai terduplikasi

Di Retail POS, frontend menghitung subtotal, discount, estimated cost, gross profit, margin, bahkan default unit price secara manual menggunakan `Number()`.

Padahal domain layer sudah punya pure calculation helpers dan arsitektur MGBOS sangat eksplisit soal business rule sebagai shared/domain authority.

Server/database tetap tampaknya authoritative—bagus. Jadi ini bukan berarti transaksi saat ini otomatis salah.

Masalahnya adalah **preview UX bisa drift dari server decision**.

Frontend sebaiknya tidak punya formula “versi sendiri”. Gunakan helper dari domain package untuk semua deterministic previews, sementara server tetap final authority.

---

# 8. Settings terlihat seperti konfigurasi, tetapi sebenarnya static presentation

`/settings` bernama **Holding Configuration**, tetapi brands, channels dan roles ditulis sebagai arrays langsung di page source.

Itu berpotensi bertentangan dengan filosofi MGBOS bahwa PostgreSQL adalah system of record. [Current Holding Configuration page](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/apps/mgbos/src/app/%28app%29/settings/page.tsx?utm_source=chatgpt.com)

Pilih salah satu semantics:

**Configuration UI** → baca dari database dan punya permissioned actions.

atau

**System Reference** → read-only, tetapi tetap baca canonical data.

Jangan static mirror dari DB karena akan menjadi sumber drift kedua.

---

# 9. Loading/error UX belum dibangun secara sistemik

Gue tidak menemukan global/root atau `(app)` `loading.tsx` dan `error.tsx` pada active workspace. Beberapa feature punya error boundary lokal, tetapi coverage tidak konsisten.

Padahal sebagian pages melakukan server-side database access cukup banyak.

Next.js server-first yang sekarang dipilih sebenarnya cocok. Tinggal dilengkapi dengan route-level Suspense/loading skeleton dan error recovery supaya perpindahan modul tidak terasa freeze.

---

# 10. TeeStock active frontend belum menjadi TeeStock product

Ini perlu dipisahkan tegas dari MGBOS.

Current active `apps/teestock` hanya punya home dan `/custom-atelier`.

Home saat ini:

> “Ruang untuk ide berikutnya.”

> “Aplikasi baru TeeStock sedang disiapkan.”

Custom Atelier:

> “Layanan Custom Atelier akan hadir di sini.”

[Current TeeStock homepage](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/apps/teestock/src/app/page.tsx?utm_source=chatgpt.com) [Current Custom Atelier](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/apps/teestock/src/app/custom-atelier/page.tsx?utm_source=chatgpt.com)

Metadata-nya pun masih:

`description: "MGBOS repository foundation"`

Jadi **TeeStock Next app saat ini adalah placeholder shell**, bukan storefront yang siap untuk user.

Yang menarik, canonical business/brand documentation TeeStock justru sudah jauh lebih matang. Brand identity sudah mendefinisikan neutral-dominant UI, responsive 4/8/12-column grid, spacing system, hierarchy, photography principles, accessibility, medium-density commerce, dan accent yang bermakna. Commerce document juga sudah punya architecture yang jelas: Catalog → Checkout → Customer → Order → Fulfillment. [TeeStock brand system](https://github.com/Rizkybuilds/bisnishub/blob/main/bisnis/teestock/02-brand/brand-identity-system.md?utm_source=chatgpt.com) [TeeStock Commerce architecture](https://github.com/Rizkybuilds/bisnishub/blob/main/bisnis/teestock/03-commerce/commerce-overview.md?utm_source=chatgpt.com)

Dengan kata lain: **design/product intent sudah ada; implementasinya yang belum diturunkan ke active Next.js storefront.**

Arsip TeeStock lama boleh dijadikan visual research, tetapi jangan dihidupkan kembali atau dicopy wholesale. Governance repo dan `AGENTS.md` sudah benar melarang pola itu. [MGBOS engineering rules](https://github.com/Rizkybuilds/bisnishub/blob/main/systems/mgbos/AGENTS.md?utm_source=chatgpt.com)

---

# Target frontend architecture yang gue rekomendasikan

Secara sederhana:

```text
systems/mgbos/
│
├── apps/
│   ├── mgbos
│   │   └── Internal Product Experience
│   │
│   └── teestock
│       └── Consumer Commerce Experience
│
└── packages/
    └── ui
        ├── tokens/
        ├── primitives/
        ├── forms/
        ├── feedback/
        ├── data-display/
        └── layout/
```

Tetapi `@mgbos/ui` **jangan berarti TeeStock dan MGBOS harus terlihat sama**.

Shared layer seharusnya menyimpan behavior/primitives/accessibility contracts. MGBOS boleh punya high-density operational theme; TeeStock memakai consumer brand tokens sendiri.

Itu jauh lebih sehat daripada membuat sebuah “global design system” yang memaksa ERP dan fashion storefront terlihat identik.

## Roadmap frontend yang gue sarankan

| Phase | Scope | Hasil |
|---|---|---|
| **P0 — Release Safety** | Hilangkan exposed seeded credential dari client, benahi dev bootstrap/secret handling | MGBOS aman untuk menuju staging |
| **P1 — UI Foundation** | Tokens, Button, FormField, Dialog, Badge, Card, DataTable, Alert, Skeleton, PageHeader | Satu language UI |
| **P1 — Responsive Shell** | Real active navigation, mobile drawer, adaptive topbar, brand context, responsive layouts | MGBOS usable desktop/tablet/mobile |
| **P1 — Accessibility** | Dialog semantics, keyboard/focus, labels, error messaging, touch targets | Baseline WCAG-ready interaction |
| **P2 — Feature Refactor** | Pecah POS, Inventory, Procurement, Ledger besar menjadi compositions | Maintainability jauh meningkat |
| **P2 — Frontend QA** | Browser E2E + axe + responsive golden journeys + visual regression | UI regression masuk CI |
| **P2 — Experience States** | loading/error/empty/success/optimistic/pending standards | Interaksi terasa matang |
| **P3 — TeeStock** | Brand tokens → storefront shell → catalog → PDP → cart/checkout → account/tracking | Consumer-facing TeeStock baru |

## Status keseluruhan

**Arsitektur frontend:** fondasinya tepat.

**Frontend engineering:** sehat di framework/type/server boundary, tetapi belum punya UI architecture yang setara dengan complexity aplikasinya.

**MGBOS UI/UX:** functional internal beta, belum production-grade experience.

**Accessibility:** ada baseline, tetapi modal/forms perlu remediation serius.

**Responsive:** gap besar.

**Frontend testing:** gap besar.

**TeeStock public UI:** belum diimplementasikan sebagai commerce product.

**Backend ↔ frontend separation:** salah satu bagian terkuat repo.

**Rekomendasi besar:** **jangan tambah modul MGBOS baru dulu sebelum Frontend Foundation v1 selesai.** Kalau terus menambah feature dengan pattern UI sekarang, technical debt presentation layer akan tumbuh jauh lebih cepat daripada domain layer.

Dan satu catatan soal `@Browser`: gue tidak memberikan skor Lighthouse/Core Web Vitals palsu. Active Next.js apps dikonfigurasi sebagai local shells di port 3101/3102, root Vercel sengaja memblok deployment, dan gue tidak menemukan hosted build aktif yang dapat diverifikasi dari environment browser ini. Jadi temuan visual/responsive di atas adalah **source-level audit**, bukan pengukuran production browser.

Tahap paling logis setelah audit ini adalah merumuskan **`MGBOS Frontend Architecture & Design System v1`** terlebih dahulu—tokens, component contracts, responsive shell, navigation architecture, accessibility rules, dan frontend QA gates—baru kita mulai refactor implementasinya.