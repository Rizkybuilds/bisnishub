# BisnisHub OS — Operating System & Command Center

Aplikasi ERP & Command Center terpusat untuk mengelola ekosistem **MultiGraph Printing & Apparel Holding** (termasuk TeeStock, MultiGraph B2B, logistik, pengadaan, dan treasury).

---

## Fitur Utama

- 📊 **Executive Dashboard**: Metrik penjualan, profitabilitas per pesanan, dan monitoring arus kas.
- 📋 **Order Kanban**: Pelacakan lifecycle pesanan dari pembayaran terkonfirmasi, antrean cetak DTF, heat press, QC, hingga pengiriman ekspedisi.
- 📦 **Master Inventory & Routing**: Alokasi stok hybrid 2-tier (Buffer Studio vs JIT Vendor NSA).
- 🖨️ **DTF Gang Sheet Planner**: Optimasi layout cetak film 58 cm x N meter untuk meminimalkan sisa film yang terbuang.
- 💰 **Multi-Unit Treasury & Ledger**: Pencatatan kas holding dan unit bisnis terintegrasi.
- 🔒 **Security Gate**: Dual-layer protection menggunakan Google OAuth (Supabase RLS) dan Master Founder PIN.

---

## Deployment ke Vercel (Panduan Setup)

Aplikasi ini dirancang untuk di-deploy secara terpisah di Vercel sebagai project independen menggunakan repository yang sama (`Rizkybuilds/bisnishub`).

### Langkah-langkah Setup di Vercel Dashboard:

1. **Buat Project Baru di Vercel:**
   - Masuk ke [vercel.com](https://vercel.com).
   - Klik **Add New...** -> **Project**.
   - Pilih repository `Rizkybuilds/bisnishub`.

2. **Konfigurasi Project Settings:**
   - **Project Name**: `bisnishub-os` (atau sesuai keinginan).
   - **Framework Preset**: `Vite`.
   - **Root Directory**: Klik **Edit** dan pilih `apps/bisnishub-web`.

3. **Environment Variables:**
   Tambahkan variabel berikut pada menu *Environment Variables*:
   | Key | Value / Contoh | Keterangan |
   |---|---|---|
   | `VITE_SUPABASE_URL` | `https://tovslowsopqtuxmrogeu.supabase.co` | Endpoint Supabase |
   | `VITE_SUPABASE_ANON_KEY` | `sb_publishable_...` | Anon Key Supabase |
   | `VITE_APP_ENV` | `production` | Environment mode |
   | `VITE_DEFAULT_CHANNEL` | `web` | Channel identifier |
   | `VITE_FOUNDER_PIN` | `******` | 6-digit PIN akses Founder |
   | `VITE_ADMIN_EMAILS` | `teestock.apparel@gmail.com,admin@teestock.id` | Email admin berwenang |

4. **Deploy:**
   - Klik tombol **Deploy**.
   - Vercel akan otomatis membaca `apps/bisnishub-web/vercel.json` dan menjalankan `npm run build`.
   - Hasil build SPA akan otomatis diarahkan ke `/index.html` dengan header keamanan lengkap.
