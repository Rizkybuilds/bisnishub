## Backend Deep Audit — `Rizkybuilds/bisnishub`

Gue sudah membedah repository, struktur MGBOS, migration PostgreSQL/Supabase, auth/session, Server Actions, permission model, transaction flow, test suite, CI/CD, branch protection, PR aktif, dan deployment state. Gue juga cross-check beberapa keputusan teknis dengan dokumentasi resmi Supabase, PostgreSQL, Next.js, dan Vercel.

Repository yang diaudit: [Rizkybuilds/bisnishub](https://github.com/Rizkybuilds/bisnishub?utm_source=chatgpt.com). Audit ini **read-only**; gue belum mengubah repository.

### Kesimpulan utama

Secara arsitektur, backend MGBOS sudah jauh lebih matang daripada typical MVP. Pilihan **modular monolith + PostgreSQL sebagai source of truth + transaction-heavy RPC + domain package murni + strict TypeScript** menurut gue tepat untuk fase MultiGraph sekarang. Gue **tidak menyarankan microservices, Redis, event broker, atau ORM** saat ini.

Tapi ada perbedaan besar antara **arsitektur yang bagus** dan **backend yang siap memegang transaksi bisnis nyata**. Saat ini status yang paling tepat adalah:

> **Architecture-ready dan implementation-capable, tetapi belum production-ready.**

Bottleneck berikutnya bukan menambah modul ERP. Bottleneck-nya adalah **transaction integrity, auth/session lifecycle, tenant isolation, idempotency, deployment, dan happy-path end-to-end**.

### Backend yang gue temukan

| Area | Kondisi |
|---|---|
| Architecture | Kuat — modular monolith jelas |
| Domain model | Sudah substantif |
| PostgreSQL design | Kuat |
| Financial integrity | Banyak guard sudah bagus |
| Concurrency handling | Sudah memakai `FOR UPDATE` dan advisory locks di beberapa flow |
| Validation | Zod + database invariants |
| Authorization | RBAC TS + DB-side role checking |
| Tenant isolation | Ada, tetapi terlalu bergantung pada discipline aplikasi |
| Idempotency | **Belum konsisten / ada gap serius** |
| Auth/session | **Perlu diperbaiki sebelum production** |
| Outbox/events | Arsitektur ada, implementasi belum matang |
| CI governance | Sangat bagus untuk ukuran project ini |
| Business E2E | Belum menjadi green production gate |
| Deployment | Legacy config masih drift |
| Backup/restore/monitoring | Belum terverifikasi |
| Production readiness | Belum |

---

## 1. Arsitektur backend-nya sudah benar

Runtime resmi sekarang berada di:

```text
systems/mgbos/
├── apps/
│   ├── mgbos/
│   └── teestock/
├── packages/
│   ├── domain/
│   ├── auth/
│   ├── validation/
│   ├── database/
│   ├── config/
│   ├── events/
│   ├── integrations/
│   ├── ai/
│   └── ui/
├── supabase/
├── scripts/
├── automation/
└── docs/
```

Core stack juga masuk akal:

```text
Next.js 16.3.6
React 19.3
TypeScript 5.9 strict
pnpm workspace
PostgreSQL / Supabase
Vitest
pgTAP
```

Yang paling gue suka adalah business authority tidak diletakkan di React. Polanya secara umum sudah:

```text
UI
 ↓
Server Action
 ↓
Zod validation
 ↓
Authentication
 ↓
RBAC
 ↓
PostgreSQL RPC / transaction
 ↓
state validation
 ↓
FOR UPDATE / locking
 ↓
audit
 ↓
canonical state
```

Ini jauh lebih sehat daripada:

```text
UI → Supabase table.update()
```

untuk sistem bisnis yang akan mengendalikan order, invoice, payment, inventory, procurement, dan produksi.

Next.js sendiri memang memperlakukan Server Actions sebagai server-side mutation endpoints; melakukan validation dan authorization di boundary tersebut merupakan pola yang tepat. :chatgpt-content-reference{index="1"}

---

# 2. P0 — Session implementation sekarang punya lifecycle mismatch

Ini salah satu temuan yang paling jelas.

Login sekarang menerima:

```text
access_token
```

lalu menyimpannya sebagai:

```text
mgbos_session
```

dengan cookie:

```text
maxAge = 24 jam
```

Tetapi Supabase local config memakai:

```text
jwt_expiry = 3600
```

atau **1 jam**.

Yang tidak disimpan adalah:

```text
refresh_token
```

Akibatnya secara desain:

```text
Login
 ↓
access token valid ±1 jam
 ↓
cookie masih ada sampai 24 jam
 ↓
verifySessionToken()
 ↓
access token expired
 ↓
session dianggap invalid
 ↓
user harus login lagi
```

Jadi cookie 24 jam tidak benar-benar menghasilkan session 24 jam.

Supabase mendefinisikan session sebagai pasangan access token + refresh token. Access token memang short-lived—biasanya 5 menit sampai 1 jam—dan refresh token digunakan untuk melanjutkan session. Default 1 jam juga merupakan nilai yang direkomendasikan untuk banyak aplikasi. :chatgpt-content-reference{index="2"}

### Target arsitektur

Jangan menaikkan JWT menjadi 24 jam hanya untuk menutupi masalah.

Lebih benar:

```text
access token
+
refresh token
+
server-side refresh flow
+
proper logout/revocation
```

Untuk MGBOS internal app gue akan menjadikan ini **P0 sebelum real operational usage**.

---

# 3. P0 — Idempotency sekarang belum benar-benar end-to-end

Database justru sudah lumayan bagus.

Contohnya order/quote sudah punya konsep:

```text
request_id
unique constraints
advisory lock
retry result
```

Masalahnya ada di application boundary.

Pada `createOrderFromQuoteAction()` dan `createRetailOrderAction()`:

```ts
const requestId = crypto.randomUUID();
```

dibuat **di dalam Server Action**.

Sekilas benar.

Tetapi bayangkan:

```text
user submit
 ↓
Server Action requestId = A
 ↓
DB commit sukses
 ↓
network timeout sebelum browser menerima response
 ↓
user retry
 ↓
Server Action requestId = B
 ↓
database melihat request baru
 ↓
ORDER KEDUA BISA DIBUAT
```

Itu bukan idempotency terhadap retry pengguna/network. Itu hanya idempotency bila **request ID yang sama** dikirim ulang.

Idempotency key harus merepresentasikan:

```text
business intent
```

bukan:

```text
individual HTTP attempt
```

### Lebih serius lagi

Beberapa consequential commands belum terlihat membawa idempotency key sama sekali, termasuk flow seperti:

```text
record payment
inventory mutation
stock opname
purchase order
goods receipt
vendor bill payment
```

Database sudah punya locking dan banyak state guard, tetapi locking ≠ idempotency.

Untuk transaksi uang/stok:

```text
at-least-once request
+
non-idempotent command
=
possible duplicate side effect
```

Ini salah satu hardening paling penting sebelum AI/n8n nanti mulai menjalankan command.

---

# 4. P0 — `service_role` membuat tenant isolation bergantung pada kode aplikasi

Pola database read MGBOS sekarang banyak menggunakan:

```text
SUPABASE_SERVICE_ROLE_KEY
```

sebagai:

```http
apikey: serviceKey
Authorization: Bearer serviceKey
```

Kemudian query diberi filter:

```text
organization_id=eq.<current-org>
```

Ini aman **selama setiap query benar**.

Masalahnya, Supabase service role secara eksplisit memiliki `BYPASSRLS`. Jadi RLS tidak menyelamatkan kita kalau developer suatu hari lupa:

```text
organization_id=...
```

Supabase sendiri menegaskan service/secret key melewati RLS dan hanya boleh berada di trusted server components. :chatgpt-content-reference{index="3"}

Jadi model sekarang pada dasarnya:

```text
Application authorization
        ↓
service-role query
        ↓
manual organization filter
```

Bukan:

```text
Authenticated DB identity
        ↓
RLS
        ↓
organization boundary
```

Ini **bukan vulnerability otomatis**, karena key memang tetap server-only dan aplikasi melakukan auth checks.

Tapi blast radius programmer error menjadi jauh lebih besar.

### Rekomendasi gue

MGBOS perlu memilih dan mendokumentasikan satu pola secara eksplisit:

```text
Normal user query
→ user JWT
→ RLS

Privileged command
→ server boundary
→ carefully scoped SECURITY DEFINER RPC / secret key
```

atau kalau tetap seluruhnya server-authoritative:

```text
Server-only DB Gateway
→ mandatory OrganizationContext
→ impossible-to-call query without org
→ no raw arbitrary service-role fetch scattered in pages
```

Pilihan kedua masih valid untuk internal ERP, tetapi database access perlu dipusatkan.

Supabase juga sekarang merekomendasikan backend baru memakai **secret API keys** dibanding legacy JWT `service_role` key saat tersedia. :chatgpt-content-reference{index="4"}

---

# 5. Ada authorization coupling yang sebaiknya dibongkar

Beberapa module context menggunakan:

```ts
requirementContext()
```

sebagai generic database context.

Lalu:

```text
orderContext()
→ requirementContext()
→ requires requirements:read
→ requires orders:read
```

Hal yang sama terjadi pada payment/inventory/procurement context.

Sekarang belum terlalu terlihat karena hampir semua role kebetulan punya `requirements:read`.

Tetapi secara architecture:

```text
permission A
accidentally required
for domain B
```

adalah hidden coupling.

Lebih sehat:

```text
authenticatedDatabaseContext()
        │
        ├── orderContext → orders:read
        ├── paymentContext → payments:read
        ├── inventoryContext → inventory:read
        └── requirementContext → requirements:read
```

Ini refactor kecil dengan leverage besar.

---

# 6. Multi-organization session belum deterministic

Database memperbolehkan user mempunyai membership ke beberapa organization karena uniqueness-nya pada prinsipnya:

```text
organization_id + user_id
```

Tetapi `getSession()` sekarang mencari:

```ts
activeMembership = organization_members.find(...)
```

alias mengambil active membership pertama yang ditemukan.

Tidak ada:

```text
active organization cookie
organization selector
canonical primary organization
```

Kalau MultiGraph sekarang hanya punya satu org, masalahnya belum muncul.

Tetapi jika nanti satu account bisa masuk ke:

```text
MultiGraph Group
client organization
sandbox organization
business lain
```

session dapat menjadi ambigu.

Solusinya salah satu:

```text
enforce exactly-one organization membership
```

atau future-proof:

```text
mgbos_active_organization
+
membership validation
+
organization switch command
```

Jangan biarkan array order dari database secara implisit memilih tenant aktif.

---

# 7. Money model bagus di database, tetapi ada satu boundary leak

Prinsip engineering repo mengatakan money menggunakan integer.

Mayoritas backend memang konsisten:

```ts
amount.toString()
```

dan SQL:

```sql
bigint
```

Bagus.

Namun `createRetailOrderAction()` melakukan:

```ts
unit_price: Number(i.unitPrice)
discount_total: Number(...)
p_shipping_cost: Number(...)
```

Padahal Zod menerima angka uang sebagai **digit string**.

Ini mengubah:

```text
decimal integer string
→ JS IEEE-754 Number
→ JSON
→ PostgreSQL
```

Untuk nominal normal mungkin aman.

Tetapi secara invariant itu salah karena JavaScript `Number` tidak bisa merepresentasikan semua integer secara presisi setelah `Number.MAX_SAFE_INTEGER`.

Lebih penting: codebase sudah punya convention integer/string yang benar.

Jadi flow retail seharusnya memakai:

```text
string / bigint-safe serialization
```

end-to-end.

---

# 8. Database transaction design-nya justru sudah kuat

Ini sisi yang sangat positif.

Gue menemukan cukup banyak command yang sudah menggunakan:

```sql
FOR UPDATE
```

untuk serialize concurrent mutation.

Ada juga:

```sql
pg_advisory_xact_lock(...)
```

pada flow seperti quotation/order.

PostgreSQL memang menyediakan row-level locks seperti `FOR UPDATE` untuk mencegah conflicting concurrent modifications sampai transaksi selesai. Ini tepat untuk order/payment/inventory workflows. :chatgpt-content-reference{index="5"}

Database juga sudah memiliki pola bagus seperti:

```text
immutable quote versions
order snapshots
payment reversal instead of deletion
append-only inventory mutation log
invoice/payment audits
anti-overselling
over-allocation protection
document sequence generation
vendor bill balance control
```

Jadi gue tidak melihat alasan memindahkan business logic keluar dari PostgreSQL secara besar-besaran.

Justru:

> **pertahankan transactional core ini.**

---

# 9. `SECURITY DEFINER` perlu satu hardening sweep

Banyak function yang lebih baru sudah menggunakan pola bagus:

```sql
SECURITY DEFINER
SET search_path = app, pg_temp
```

Tetapi beberapa migration lama masih memiliki:

```sql
SET search_path = app, public
```

PostgreSQL secara eksplisit merekomendasikan `SECURITY DEFINER` memakai trusted schemas dan menaruh `pg_temp` terakhir, sekaligus mencabut default `PUBLIC EXECUTE` dan memberi execute hanya kepada role yang memang diperlukan. :chatgpt-content-reference{index="6"}

Gue sarankan satu security migration:

```text
SECURITY DEFINER INVENTORY
        ↓
search_path audit
        ↓
PUBLIC EXECUTE audit
        ↓
authenticated execute audit
        ↓
service-role-only audit
        ↓
schema USAGE audit
```

Bukan rewrite historical migration.

Tetap:

```text
forward migration only
```

sesuai aturan repo sendiri.

---

# 10. Ada privilege-model inconsistency yang layak dibersihkan

Foundation migration melakukan:

```sql
revoke all on schema app
from public, anon, authenticated;
```

Yang menunjukkan intent:

```text
app schema = server-controlled
```

Tetapi beberapa migration berikutnya mempunyai:

```text
RLS policy TO authenticated
GRANT EXECUTE ... TO authenticated
```

Padahal aplikasi runtime saat ini sendiri banyak memakai service role.

Ini belum tentu bug runtime, tetapi menunjukkan dua authorization models sedang hidup bersamaan:

```text
MODEL A
authenticated user → RLS

MODEL B
server → service role → command authorization
```

Sebelum production, gue akan memaksa architecture memilih mana yang berlaku untuk setiap object.

Bukan dibiarkan berkembang organik.

---

# 11. Transactional Outbox masih merupakan architecture promise

Repo sudah punya:

```text
ADR-005 transactional outbox
packages/events
```

dan engineering rules juga menyebut transactional outbox.

Tetapi pada main branch sekarang gue belum melihat actual canonical:

```text
event_outbox
outbox_event
event dispatcher
delivery status
retry count
claimed_at
published_at
```

yang menjadi operational event infrastructure.

Sebaliknya yang sudah ada adalah:

```text
audit tables
ledger events
state history
```

Audit dan outbox bukan hal yang sama.

Ini belum urgent untuk operator manusia.

Tetapi **harus ada sebelum** pola seperti ini berkembang:

```text
MGBOS state change
 ↓
n8n
 ↓
WhatsApp
 ↓
AI agent
 ↓
shipping provider
 ↓
JARVIS
```

Tanpa outbox:

```text
DB commit success
+
external event failure
=
split-brain operational state
```

Jadi gue akan implement outbox tepat sebelum Phase Automation, bukan sekarang secara prematur.

---

# 12. CI/CD foundation sangat bagus

Branch `main` sekarang protected.

Required checks yang terpasang mencakup:

```text
application
database
pr-gate
agent-governance
migration-immutability
repository-integrity
```

Ini level governance yang bagus.

`MGBOS Foundation` juga menjalankan:

```text
pnpm install --frozen-lockfile
pnpm check
production HTTP smoke
migration lint
Supabase start/reset
pgTAP
database type generation reproducibility
```

Dan migration history dilindungi oleh dedicated migration immutability gate.

Untuk solo-founder repository, ini sudah sangat disiplin.

---

# 13. Tetapi PR #15 saat ini tidak boleh dianggap green

PR aktif:

[PR #15 — current Phase-1 work](https://github.com/Rizkybuilds/bisnishub/pull/15?utm_source=chatgpt.com)

PR ini sebenarnya penting karena menambahkan:

```text
authoritative order lifecycle
vendor-backed assignment
production assignment lifecycle
fulfillment readiness
work order / SPK
happy-path E2E foundations
```

Itu tepat sesuai arah MGBOS sekarang.

Tetapi pada run terbaru yang gue periksa:

| Gate | Status |
|---|---|
| Repository Integrity | ✅ Success |
| Agent Governance | ✅ Success |
| PR Gate | ❌ Failure |
| MGBOS application | ❌ Failure |
| MGBOS database | ❌ Failure |
| Vercel legacy projects | ❌ Failure |

Application job bahkan berhenti di:

```text
prettier --check
```

dengan **24 files tidak formatted**.

Artinya tahap berikutnya:

```text
lint
typecheck
Vitest
build
HTTP smoke
```

belum sempat dijalankan pada run tersebut.

Jadi kita belum boleh mengatakan application implementation di PR #15 valid hanya karena code-nya ada.

---

# 14. Database PR #15 punya empat broken test suites

Ini lebih substantif daripada formatting.

Pada CI terbaru, database reset berhasil dan semua migrations termasuk empat migration baru berhasil diaplikasikan.

Tetapi pgTAP gagal.

Empat suite baru bermasalah:

| Test | Failure |
|---|---|
| `assignment_lifecycle.test.sql` | `check_order_type_sources` violation |
| `fulfillment_readiness.test.sql` | `check_order_type_sources` violation |
| `order_lifecycle.test.sql` | SQL syntax error dekat `insert` |
| `vendor_assignment.test.sql` | mencoba column `organizations.name` yang tidak ada |

Yang menarik: banyak test lama tetap green, termasuk:

```text
payments
inventory
procurement
quotes
orders snapshots
production
shipment
ledger
requirements
customers
```

Jadi PR #15 lebih terlihat seperti:

> **new lifecycle implementation/test fixtures belum sepenuhnya diselaraskan dengan canonical schema**, bukan foundation database lama runtuh.

Ini relatif mudah diperbaiki, tetapi PR tetap belum layak merge sampai green.

---

# 15. PR hygiene juga sedang menghalangi merge

PR #15 berjudul:

```text
update 2026-09-20 11-24
```

Sementara PR Gate mengharuskan conventional format:

```text
feat(mgbos): ...
fix(mgbos): ...
docs(mgbos): ...
```

Jadi PR Gate gagal tepat pada title validation.

Untuk perubahan sebesar ini, judul yang lebih representatif misalnya:

```text
feat(mgbos): connect phase-1 operating spine lifecycle
```

Selain lolos gate, itu jauh lebih baik secara audit trail.

---

# 16. Deployment config sedang drift dari repository architecture

Root `vercel.json` sekarang secara sengaja menjalankan:

```text
scripts/retired-storefront.mjs
```

dengan:

```json
"framework": null
```

Sementara status Vercel menunjukkan project legacy masih gagal deploy.

Bot metadata juga menunjukkan salah satu Vercel project masih menunjuk ke root lama seperti:

```text
apps/bisnishub-web
```

yang sudah bukan runtime canonical.

Jadi failure tersebut **bukan bukti bahwa MGBOS Next.js tidak bisa dideploy**.

Lebih tepat:

> deployment projects lama belum mengikuti repository restructuring.

Vercel sendiri mendukung satu monorepo memiliki independent projects dengan Root Directory masing-masing. :chatgpt-content-reference{index="8"}

Nanti model deployment-nya harus seperti:

```text
BisnisHub repository
        │
        ├── MGBOS internal project
        │      → systems/mgbos/...
        │
        └── TeeStock public project
               → systems/mgbos/...
```

dengan build filtering yang aware terhadap workspace packages.

Legacy Vercel projects sebaiknya di-retire atau dikonfigurasi ulang supaya failure noise tidak terus muncul pada setiap PR.

---

# 17. Testing strategy sudah kuat di bawah, masih kurang di atas

Sekarang testing pyramid-nya kira-kira:

```text
        real operator E2E      ← masih lemah
       ─────────────────
      application command tests
     ─────────────────────
    domain / validation tests
   ─────────────────────────
  PostgreSQL pgTAP invariants  ← kuat
```

`vitest.config.ts` menjalankan:

```text
packages/**/*.test.ts
scripts/**/*.test.ts
```

dan database punya 22 pgTAP suites di main branch.

Namun `test:integration` sekarang lebih dekat ke HTTP health smoke daripada full business E2E.

Target berikutnya harus membuktikan:

```text
Login
→ Lead
→ Requirement
→ Quote
→ Quote Accepted
→ Order
→ Invoice
→ Payment
→ Production
→ Vendor Assignment
→ Work Order
→ QC
→ Shipment
→ Actual Cost
→ Realized Margin
→ COMPLETED
```

dengan **satu business transaction nyata/synthetic** yang menggunakan application boundary, bukan hanya memanggil SQL functions langsung.

Ini sangat sesuai dengan arah Phase 1 yang sudah mulai muncul di PR #15.

---

# 18. Operational readiness belum selesai

Repo sendiri sebenarnya sudah jujur mengenai ini.

`operational-readiness.md` masih mencatat beberapa area belum verified:

```text
staging / production
backup automation
restore drill
RPO / RTO
monitoring
incident escalation
production acceptance
```

Ada satu hal yang sudah berubah sejak dokumen itu dibuat:

```text
branch protection
```

sekarang bisa gue verifikasi memang sudah aktif.

Jadi readiness register perlu diperbarui berdasarkan evidence terbaru.

---

# 19. Satu hal yang jangan dilakukan: expand ERP lagi

Sekarang sudah ada:

```text
Customer
Lead
Requirement
Quote
Order
Production
Vendor
QC
Invoice
Payment
Ledger
Shipment
Inventory
Procurement
Retail Ordering
```

Dan PR #15 sedang menambahkan lifecycle glue.

Gue akan menghentikan penambahan domain baru sementara.

Bukan karena arsitekturnya kurang.

Justru sebaliknya.

Yang sekarang harus dibuktikan:

```text
EXISTING MODULES
       ↓
ONE COHERENT TRANSACTION
       ↓
NO MANUAL FOUNDER ROUTING
       ↓
TRUSTWORTHY BUSINESS STATE
```

baru setelah itu:

```text
Automation
→ Outbox
→ n8n
→ AI workers
→ JARVIS
```

---

# Prioritas eksekusi backend

Urutan yang menurut gue paling rasional sekarang adalah:

1. **Fix PR #15 sampai seluruh required CI green**, mulai dari Prettier lalu empat pgTAP failures, baru lihat typecheck/Vitest/build/smoke yang saat ini tertutup oleh early failure.
2. **Hardening transaksi P0:** persistent idempotency key untuk order/payment/inventory/procurement, hilangkan money `Number()` conversion, dan test duplicate/concurrent retries.
3. **Perbaiki auth session:** proper refresh-token lifecycle, true logout/revocation, deterministic active organization, dan session tests.
4. **Refactor database access boundary:** generic authenticated DB context, domain-specific permissions, tenant-scoped access by construction, lalu audit semua service-role query.
5. **Security database sweep:** `SECURITY DEFINER`, `search_path`, execute grants, schema privileges, RLS vs service-role authority.
6. **Selesaikan Phase-1 happy-path E2E** melalui application boundary dan jadikan test itu required release evidence.
7. **Rapikan deployment:** retire Vercel legacy roots, buat deployment path khusus MGBOS/TeeStock, staging, secret isolation, lalu backup/restore + monitoring.
8. Setelah operating spine stabil, baru implementasikan **transactional outbox → n8n → JARVIS/AI automation**.

### Bottom line

Gue melihat fondasi backend ini **layak diteruskan**, bukan dirombak.

Kesalahan terbesar sekarang justru kalau kita tergoda melakukan:

```text
microservices
more modules
AI agents
automation
more abstractions
```

sebelum memperkeras:

```text
SESSION
TENANT
IDEMPOTENCY
MONEY
TRANSACTIONS
E2E
DEPLOYMENT
RECOVERY
```

Arsitektur MGBOS sudah cukup kuat. **Fase berikutnya adalah membuat operating spine yang sudah kita punya menjadi boring, deterministic, retry-safe, auditable, dan benar-benar bisa dipercaya.**

Langkah teknis paling tepat dari titik ini adalah **mulai dari PR #15 dan menjadikannya green tanpa memperluas scope**. Setelah itu baru gue akan masuk ke **Backend Hardening Sprint 0** untuk idempotency + auth + tenant boundary.