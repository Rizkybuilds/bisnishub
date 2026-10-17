# BisnisHub Project Skills Catalog

> **Status:** ACTIVE SKILL REGISTRY  
> **Otoritas Tata Kelola:** Baca [AGENTS.md](../../AGENTS.md) dan [../routing/task-types.yaml](../routing/task-types.yaml).

Direktori `.agents/skills/` berisi 43 spesialisasi teknis (*project skills*) yang dapat dimuat secara selektif oleh AI agent sesuai kebutuhan tugas rekayasa, audit, perancangan antarmuka, strategi bisnis, atau operasional.

---

## 1. Aturan Penggunaan Skill (*Skill Economy*)

1. **Load on Demand:** Muat hanya keahlian yang relevan dengan tugas aktif (*minimum sufficient context*). Jangan memuat seluruh keahlian sekaligus.
2. **Skill Is Not Permission:** Kepemilikan suatu skill tidak memberikan izin untuk rilis produksi, mutasi database jarak jauh (*remote*), atau tindakan bisnis tanpa persetujuan Founder.
3. **Penyelarasan Workspace:** Skill berawalan `mgbos-*` dikhususkan untuk workspace [systems/mgbos/](../../systems/mgbos/README.md) dan tidak boleh dipinjam untuk sistem lain tanpa pemetaan kanonikal.

---

## 2. Taksonomi Keahlian per Domain

### A. MGBOS Engineering, Governance & Audit
- [mgbos-change](mgbos-change/SKILL.md) — Orkestrasi perubahan MGBOS melalui kontrak kerja kontrol plane kanonikal.
- [mgbos-change-planner](mgbos-change-planner/SKILL.md) — Perencanaan perubahan terikat (*bounded change*) dan dekomposisi task di MGBOS.
- [mgbos-business-integrity-auditor](mgbos-business-integrity-auditor/SKILL.md) — Audit integritas finansial, state machine, izin, dan mutasi atomik di database/aplikasi MGBOS.
- [mgbos-pr-reviewer](mgbos-pr-reviewer/SKILL.md) — Review pull request MGBOS terhadap batas skop, kanonikalitas, dan bukti revisi.
- [agent-skill-maintainer](agent-skill-maintainer/SKILL.md) — Perancangan, audit, dan pemeliharaan instruksi Agent dan Skill BisnisHub.

### B. Arsitektur & Rekayasa Software (Web & Backend)
- [web-app-architect](web-app-architect/SKILL.md) — Perancangan arsitektur web app modular, hierarki komponen, dan desain sistem.
- [api-backend-engineer](api-backend-engineer/SKILL.md) — Pembuatan API modular (REST/tRPC), payment gateway (Midtrans/Xendit/QRIS), dan ongkir (RajaOngkir).
- [supabase-architect](supabase-architect/SKILL.md) — Desain skema DDL PostgreSQL, RLS policies, trigger, database views, dan indeks.
- [fullstack-web-dev](fullstack-web-dev/SKILL.md) — Implementasi interaktif React 18/19, Next.js App Router, TypeScript ketat, dan hooks.
- [integrated-erp-engine](integrated-erp-engine/SKILL.md) — Perancangan modul ERP terintegrasi: General Ledger, Procurement, BOM, dan Kanban produksi.
- [ai-copilot-builder](ai-copilot-builder/SKILL.md) — Perancangan embedded copilot ERP dengan scoped reads dan tool proposal tervalidasi.
- [ai-automation-engine](ai-automation-engine/SKILL.md) — Desain orkestrasi AI intake, OCR, parsing webhook, dan background pipeline.
- [web-qa-testing](web-qa-testing/SKILL.md) — Perancangan dan eksekusi pengujian otomatis UI, domain, transaksi, dan regresi.
- [web-sec-perf](web-sec-perf/SKILL.md) — Audit dan optimalisasi keamanan web serta metrik performa (Core Web Vitals).
- [git-deploy-ops](git-deploy-ops/SKILL.md) — Persiapan Git, verifikasi PR, migrasi database, dan checklist rilis.

### C. Desain UI/UX & Design System
- [21st-ui-build](21st-ui-build/SKILL.md) — Pembuatan antarmuka web produksi berbasis design context dan inspirasi 21st.
- [21st-ui-review](21st-ui-review/SKILL.md) — Audit UI, review frontend, konsistensi token desain, dan aksesibilitas.
- [21st-ui-explore](21st-ui-explore/SKILL.md) — Eksplorasi alternatif dan variasi konsep visual UI sebelum implementasi.
- [21st-cli-use](21st-cli-use/SKILL.md) — Pencarian dan instalasi komponen React/shadcn dari 21st.dev via CLI.
- [21st-registry](21st-registry/SKILL.md) — Manajemen dan publikasi komponen ke 21st registry.
- [21st-design-sync](21st-design-sync/SKILL.md) — Sinkronisasi token desain Tailwind/shadcn ke 21st theme.
- [21st-ai](21st-ai/SKILL.md) — Pembuatan draf dan preview iteratif antarmuka via 21st AI.
- [design](design/SKILL.md) — Pengarah rute perancangan multi-deliverable visual, brand, dan presentasi.
- [design-system](design-system/SKILL.md) — Pemeliharaan design tokens, semantic theme roles, dan state komponen.
- [ui-styling](ui-styling/SKILL.md) — Implementasi CSS terarah, layout responsif, dan styling aksesibel.
- [ui-ux-pro-max](ui-ux-pro-max/SKILL.md) — Pedoman pola interaksi, tipografi, visualisasi chart, dan UX pattern.
- [banner-design](banner-design/SKILL.md) — Perancangan banner digital, aset promosi media sosial, dan materi cetak.
- [creative-director](creative-director/SKILL.md) — Pengarah estetika visual koleksi drop, art direction photoshoot, dan storyboard.
- [slides](slides/SKILL.md) — Pembuatan presentasi strategis interaktif HTML berorientasi konversi.

### D. Founding C-Suite & Strategi Bisnis
- [mentor-bisnis](mentor-bisnis/SKILL.md) — Mitra berpikir strategis Founder, validasi ide bisnis, dan pemodelan kanvas.
- [cfo](cfo/SKILL.md) — Analisis HPP riil, simulasi pricing, unit economics, arus kas, dan margin bersih.
- [coo](coo/SKILL.md) — Perancangan SOP operasional, kapasitas produksi, evaluasi vendor, dan eliminasi bottleneck.
- [cmo](cmo/SKILL.md) — Strategi pemasaran holistik, akuisisi pelanggan, peluncuran kampanye, dan funnel penjualan.
- [cto](cto/SKILL.md) — Evaluasi teknologi, build vs buy, pencegahan technical debt, dan roadmap arsitektur.

### E. Operasional, Produksi & Percetakan
- [business-ops-engine](business-ops-engine/SKILL.md) — Perancangan fulfillment, inventori, procurement, work slip, dan kontrol QC pesanan.
- [dtf-print-ops](dtf-print-ops/SKILL.md) — Penyiapan gang sheet, preflight artwork, profil heat press, dan QC sablon DTF.

### F. Marketing, Copywriting, Ads & CRM
- [copywriter-pro](copywriter-pro/SKILL.md) — Direct-response copywriting konversi tinggi untuk landing page, PDP, dan skrip video.
- [marketing-promo-engine](marketing-promo-engine/SKILL.md) — Perancangan promo peluncuran drop, bundling diskon tanpa bakar margin, dan alur closing.
- [performance-ads-specialist](performance-ads-specialist/SKILL.md) — Media buying di Meta Ads, TikTok Ads, dan Shopee Ads dengan efisiensi anggaran ketat.
- [content-strategist](content-strategist/SKILL.md) — Perancang strategi konten viral organik harian, pilar 4E, dan Social SEO.
- [brand](brand/SKILL.md) — Nada suara (*tone of voice*), kerangka pesan merek, dan kepatuhan identitas visual.
- [retention-crm-expert](retention-crm-expert/SKILL.md) — Pengalaman unboxing viral, automasi pasca-beli WhatsApp/Email, dan retensi re-order.
- [whatsapp-automation](whatsapp-automation/SKILL.md) — Otomasi alur WhatsApp transaksi e-commerce, quoter kilat, dan webhook gateway.
