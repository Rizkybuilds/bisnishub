# Zero-Downtime Migrations, Connection Pooling & RLS Hardening

> **Status:** `CANONICAL REFERENCE`  
> **Parent Skill:** [`supabase-architect`](../SKILL.md)  
> **Target Environment:** Supabase PostgreSQL 15+, PgBouncer / Supavisor, RLS  
> **Scope:** Safe production DDL, connection pool tuning, and Row Level Security privilege boundaries.

---

## 1. Aturan Migrasi Skema Zero-Downtime (Expand and Contract)

Mengubah skema pada database produksi berisiko mengunci tabel (*table lock*) dan mematikan antrean transaksi live kasir/toko jika tidak dilakukan secara benar.

### 1.1 Larangan Keras PostgreSQL: `CREATE INDEX CONCURRENTLY`
> [!CAUTION]
> PostgreSQL secara tegas **melarang** `CREATE INDEX CONCURRENTLY` di dalam blok transaksi (`BEGIN ... COMMIT`). Menjalankannya di dalam transaksi akan langsung memicu error:  
> `ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block`

**Aturan Penulisan Migrasi:**
1. Pisahkan pembuatan indeks konkuren ke file migrasi tersendiri dengan flag non-transaksional (`transaction: false` pada migration runner).
2. Pasang batas waktu tunggu kunci (`SET lock_timeout = '2s';`) sebelum eksekusi DDL agar migrasi otomatis mundur jika tabel sedang padat, bukan menahan antrean query lain:

```sql
-- Migration: 20261021_idx_orders_customer_concurrently.sql
-- Runner Flag: transaction = false
SET lock_timeout = '2s';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_customer_created 
ON orders (customer_id, created_at DESC);
```

### 1.2 Aturan Menambah Kolom Tanpa Downtime
* **PostgreSQL 11+:** Menambahkan kolom dengan nilai `DEFAULT` adalah operasi metadata instan ($O(1)$) tanpa menulis ulang tabel.
  ```sql
  -- AMAN & INSTAN di PG 11+
  ALTER TABLE orders ADD COLUMN discount_amount BIGINT NOT NULL DEFAULT 0;
  ```
* **Larangan:** Menambahkan kolom `NOT NULL` **tanpa** `DEFAULT` pada tabel besar akan mengunci tabel secara eksklusif (`ACCESS EXCLUSIVE LOCK`).

### 1.3 Siklus Aman Rename / Drop Kolom (5 Langkah)
1. **Expand:** Tambahkan kolom baru (`new_column`).
2. **Dual-Write:** Update kode aplikasi untuk menulis ke kolom lama dan kolom baru secara bersamaan.
3. **Backfill:** Jalankan background script bertahap untuk menyalin data historis dari kolom lama ke baru.
4. **Read Switch:** Ubah kode aplikasi untuk membaca dari kolom baru.
5. **Contract:** Hapus kolom lama (`old_column`) di sprint rilis berikutnya setelah verifikasi selesai.

---

## 2. Supabase Connection Pooling & Serverless Context

Di lingkungan serverless (Next.js App Router di Vercel), setiap request baru dapat membuat koneksi direct ke database. Jika lonjakan trafik terjadi, koneksi langsung akan memicu *connection exhaustion*.

### 2.1 Mode Pooling Supavisor / PgBouncer
* **Port 6543 (Transaction Pooling Mode):**  
  * **Wajib** digunakan untuk Next.js Server Actions dan Route Handlers.
  * Koneksi database hanya ditahan selama satu transaksi berlangsung, lalu langsung dikembalikan ke pool.
  * *Perhatian:* Tidak mendukung fitur berbasis sesi seperti temporary tables, session-level advisory locks, atau session variables. Gunakan parameterized queries.
* **Port 5432 (Session Mode / Direct):**  
  * Khusus untuk migration runner, backend daemons bertipe *long-lived*, atau batch workers terisolasi.

### 2.2 Statement Timeout Mandat
Setiap konfigurasi koneksi aplikasi wajib menetapkan batas waktu query agar query lambat tidak menggantung koneksi selamanya:
```sql
ALTER ROLE authenticated SET statement_timeout = '5000ms';
```

---

## 3. Hardened Row Level Security (RLS) & Function Privileges

### 3.1 Pilihan Baku: `SECURITY INVOKER`
Secara default, seluruh function pembantu yang dipanggil di dalam kebijakan RLS wajib bertipe **`SECURITY INVOKER`**. Hal ini memastikan hak akses dan kebijakan RLS dari tabel yang dipanggil tetap berlaku sesuai hak akses pemanggil.

### 3.2 Aturan Ketat Penggunaan `SECURITY DEFINER`
Gunakan `SECURITY DEFINER` HANYA jika fungsi tersebut harus membaca tabel sistem terisolasi (misal: memeriksa tabel privat hak akses user). Jika terpaksa menggunakan `SECURITY DEFINER`, tiga syarat mutlak berikut wajib dipenuhi:

```sql
CREATE OR REPLACE FUNCTION public.get_auth_tenant_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = '' -- MENCEGAH SEARCH_PATH HIJACKING (MUTLAK)
AS $$
DECLARE
    v_tenant_id UUID;
BEGIN
    -- AMBIL HANYA DARI app_metadata (DIKONTROL SISTEM / BACKEND)
    -- DILARANG MENGAMBIL DARI raw_user_meta_data (DAPAT DIEDIT OLEH USER CLIENT)
    v_tenant_id := (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID;
    
    IF v_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Unauthenticated or tenant claim missing';
    END IF;
    
    RETURN v_tenant_id;
END;
$$;

-- BATASI HAK EKSEKUSI
REVOKE ALL ON FUNCTION public.get_auth_tenant_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_auth_tenant_id() TO authenticated;
```
