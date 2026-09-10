# 📊 Master Skema Pricing, HPP Dinamis & Sistem Keuangan TeeStock

> **Dokumen Strategis C-Suite (CFO, COO, CTO, CMO, Mentor Bisnis)**  
> **Target:** Solopreneur Command Center — TeeStock Apparel  
> **Status:** Production Blueprint & Database Architecture  
> **Tanggal:** September 2026

---

## 1. Executive Summary & Visi Sistem

Sebagai solopreneur yang mengelola 3 bisnis (TeeStock, MultiGraph, Titik Buta), waktu dan fokus Anda sangat berharga. Anda tidak butuh sistem akuntansi korporat (ERP) yang rumit dan menyita waktu berjam-jam setiap hari. Yang Anda butuhkan adalah **Mesin Cerdas (Smart Automation Engine)** yang:

1. **Menghitung HPP Kaos Secara Otomatis** dengan metode *Moving Average Cost* (biaya rata-rata bergerak), sehingga belanja eceran maupun lusinan langsung tercatat akurat tanpa pusing.
2. **Mengurai Biaya DTF Roll 58 cm** menjadi HPP cetak presisi per ukuran desain (A6 hingga Double A3).
3. **Mengunci Margin Aman dengan Aturan ARB (Auto Rijek Bawah)**: Tim marketing atau sistem promo bebas bermain diskon agresif (voucher pemula, bundling, flash sale), namun sistem **menolak keras dan mengunci harga** agar tidak pernah tembus di bawah `HPP + 10% Profit Bersih`.
4. **Memisahkan Kas Bisnis vs Dompet Pribadi** melalui modul buku kas satu pintu (Founder Admin Hub) dengan pelacakan modal masuk, belanja pengadaan, laba bersih pesanan, hingga penarikan *Prive* (gaji pemilik).

---

## 2. CFO & COO: Struktur HPP (Harga Pokok Penjualan) Riil

### A. Solusi Masalah Belanja Kaos: Satuan vs Lusinan (Moving Average Cost)
Ketika menjalankan bisnis POD dan ready-stock apparel, pola belanja vendor NSA sering bervariasi:
- **Pola Ecer (JIT / Just-In-Time):** Membeli 1-3 pcs ukuran/warna khusus sesuai order masuk (harga lebih tinggi, misal NSA 7200 @ Rp 42.000).
- **Pola Grosir / Lusinan (Buffer):** Membeli 12-24 pcs warna laris (Hitam L, Hitam XL) untuk menekan harga beli (misal NSA 7200 @ Rp 37.000).

#### Formula Moving Average Cost (MAC):
Setiap kali pengadaan baru dicatat di panel admin, sistem menghitung HPP rata-rata baru:

$$\text{HPP Rata-Rata Baru} = \frac{(\text{Stok Lama} \times \text{HPP Lama}) + (\text{Qty Beli Baru} \times \text{Harga Beli Baru})}{\text{Stok Lama} + \text{Qty Beli Baru}}$$

#### Simulasi Nyata:
1. Stok awal di gudang: **3 pcs** NSA 7200 Hitam L sisa beli ecer @ **Rp 42.000** (Nilai aset = Rp 126.000).
2. Anda belanja stok 1 lusin (**12 pcs**) @ **Rp 37.000** (Total belanja = Rp 444.000).
3. HPP baru per pcs:
   $$\frac{126.000 + 444.000}{3 + 12} = \frac{570.000}{15} = \mathbf{Rp\ 38.000 / pcs}$$
4. Saat kaos tersebut terjual 1 pcs ke pelanggan, sistem secara otomatis mencatat COGS/HPP Kaos = **Rp 38.000**. Tidak ada estimasi fiktif; angka laba bersih 100% akurat.

---

### B. Dekomposisi HPP DTF Meteran (Roll 58 cm x 100 cm @ Rp 35.000)
Vendor cetak DTF mengenakan tarif meteran roll:
- **Dimensi Roll:** Lebar cetak efektif $58\text{ cm} \times 100\text{ cm} = 5.800\text{ cm}^2$.
- **Tarif Vendor:** **Rp 35.000 per meter lari**.
- **Biaya Dasar per $\text{cm}^2$:** $\frac{\text{Rp } 35.000}{5.800\text{ cm}^2} \approx \text{Rp } 6,03\text{ / cm}^2$.
- **Allowance / Gap & Waste Factor (15%):** Jarak antar desain dan margin potong $\rightarrow$ Biaya efektif $\approx \mathbf{Rp\ 7,00\text{ / cm}^2}$.

| Ukuran Desain | Dimensi Rata-Rata | Luas Cetak ($\text{cm}^2$) | Yield per Meter Roll | HPP DTF Satuan |
|---|---|---|---|---|
| **A6 (Logo Dada / Leher)** | $10 \times 15\text{ cm}$ | $150\text{ cm}^2$ | $\approx 28\text{ pcs}$ | **Rp 2.000** |
| **A5 (Dada Sedang / Lengan)** | $15 \times 21\text{ cm}$ | $315\text{ cm}^2$ | $\approx 12\text{ pcs}$ | **Rp 4.500** |
| **A4 (Sedang Standar)** | $21 \times 30\text{ cm}$ | $630\text{ cm}^2$ | $\approx 6\text{ pcs}$ | **Rp 7.500** |
| **A3 (Distro Standard)** | $28 \times 40\text{ cm}$ | $1.120\text{ cm}^2$ | $\approx 3 - 4\text{ pcs}$ | **Rp 12.500** |
| **Depan A6 + Belakang A3** | Gabungan A6 + A3 | $1.270\text{ cm}^2$ | $\approx 3\text{ set}$ | **Rp 14.500** |
| **Double A3 (Full 2 Sisi)** | $2 \times (28 \times 40\text{ cm})$ | $2.240\text{ cm}^2$ | $\approx 1,5 - 2\text{ set}$ | **Rp 24.000** |

---

### C. Biaya Kemasan (Packing) & Operasional Listrik
1. **Komponen Kemasan (Packing) — Kerjasama dengan MultiGraph:**
   - Polymailer doff hitam/putih tebal $30 \times 40\text{ cm}$: **Rp 800**
   - Stiker Vinyl Die-Cut bonus pelanggan ($7\text{ cm}$): **Rp 600**
   - Lakban perekat + Label Thermal Shipping A6 ($100 \times 150\text{ mm}$): **Rp 600**
   - **Total Biaya Kemasan:** $\mathbf{Rp\ 2.000 / pcs}$

2. **Operasional Listrik (Mesin Heat Press 900 Watt In-House):**
   - Waktu kerja mesin per kaos: Press 1 ($15\text{ detik}$) + Press Curing Finishing ($5\text{ detik}$) = $20\text{ detik}$.
   - Konsumsi energi kerja: $0,9\text{ kW} \times \frac{20}{3600}\text{ jam} = 0,005\text{ kWh}$.
   - Ditambah konsumsi pemanasan awal (preheating) & lampu kerja: dianggarkan **Rp 1.000 / pcs**.
   - **Total Biaya Operasional Listrik:** $\mathbf{Rp\ 1.000 / pcs}$

---

## 3. CFO & CMO: Formula Pricing & Hard Floor ARB (Auto Rijek Bawah)

### A. Definisi Formula Baku
1. **HPP Kaos Polos (Blank):**
   $$\text{HPP Blank} = \text{HPP Kaos (MAC)} + \text{Packing (Rp 2.000)}$$

2. **HPP Kaos Grafis (Printed Apparel):**
   $$\text{HPP Katalog Grafis} = \text{HPP Kaos (MAC)} + \text{HPP DTF (Ukuran)} + \text{Packing (Rp 2.000)} + \text{Operasional Listrik (Rp 1.000)}$$

3. **Harga Jual (Etalase / Anchor Price):**
   - **Anchor Price (Harga Coret Distro):** Rp 139.000 (Membentuk *perceived value* tinggi).
   - **Display Retail Standar Web:** Rp 99.000 (Kaos Grafis) / Rp 49.000 (NSA 3600) / Rp 59.000 (NSA 7200).

4. **Harga ARB (Auto Rijek Bawah / Floor Price):**
   $$\text{Harga ARB} = \text{HPP Total} \times 1.10 = \text{HPP Total} + 10\% \text{ Profit Bersih Minimal}$$
   *(Catatan: Dibulatkan ke atas / `Math.ceil` ke kelipatan Rp 1.000 terdekat untuk menjaga kebersihan nominal kas).*

---

### B. Matriks HPP & ARB Baseline TeeStock (September 2026)

| Tipe Produk | Basis Garmen | HPP Kaos | HPP DTF | Pack + Listrik | Total HPP | **Harga ARB (Min Floor)** | **Harga Jual Web** | **Gross Margin @ Web** |
|---|---|---|---|---|---|---|---|---|
| **Kaos Polos NSA 3600** | NSA Softstyle 30s | Rp 33.000 | Rp 0 | Rp 2.000 (Pack) | **Rp 35.000** | **Rp 39.000** | Rp 49.000 | 28,5% |
| **Kaos Polos NSA 7200** | NSA Heavyweight 24s | Rp 38.000 | Rp 0 | Rp 2.000 (Pack) | **Rp 40.000** | **Rp 44.000** | Rp 59.000 | 32,2% |
| **Kaos Grafis A4 (30s)** | NSA Softstyle 30s | Rp 33.000 | Rp 7.500 | Rp 3.000 | **Rp 43.500** | **Rp 48.000** | Rp 89.000 | 51,1% |
| **Kaos Grafis A3 (30s)** | NSA Softstyle 30s | Rp 33.000 | Rp 12.500 | Rp 3.000 | **Rp 48.500** | **Rp 54.000** | Rp 99.000 | 51,0% |
| **Kaos Grafis A3 (24s)** | NSA Heavyweight 24s | Rp 38.000 | Rp 12.500 | Rp 3.000 | **Rp 53.500** | **Rp 59.000** | Rp 109.000 | 50,9% |
| **Kaos Grafis 2x A3 (24s)**| NSA Heavyweight 24s | Rp 38.000 | Rp 24.000 | Rp 3.000 | **Rp 65.000** | **Rp 72.000** | Rp 129.000 | 49,6% |

---

## 4. CMO: Skema Permainan Promo & Marketing (Taat Aturan ARB)

Dengan adanya pagu ARB, tim marketing memiliki keleluasaan penuh (*freedom within boundaries*) untuk menciptakan promo agresif tanpa rasa takut boncos.

### 1. Promo Sambutan / First Purchase
- **Mekanisme:** Voucher `WELCOME10` (Diskon 10%) atau `PERDANA15` (Potongan Rp 15.000 min. order Rp 99.000).
- **Simulasi:** Kaos Grafis 30s (Display Rp 99.000) $\rightarrow$ Harga setelah diskon **Rp 84.000 - Rp 89.100**.
- **Audit ARB:** Rp 84.000 jauh di atas ARB (Rp 54.000). Profit bersih masih Rp 30.000+/pcs! **[LOLOS]**

### 2. Promo Bundling (AOV Booster - Khusus Kaos Grafis)
- **Paket Duo (2 Pcs):** @Rp 90.000/pcs (Hemat Rp 18.000). Harga per pcs Rp 90.000 $\ge$ ARB Rp 54.000. **[LOLOS]**
- **Paket Trio (3 Pcs):** @Rp 85.000/pcs (Hemat Rp 42.000). Harga per pcs Rp 85.000 $\ge$ ARB Rp 54.000. **[LOLOS]**
- **Proteksi Kaos Polos:** Promo bundling grafis otomatis diabaikan pada kaos polos agar margin kaos polos tidak tergerus.

### 3. Skema Multi-Tier Partner (Dropship & Reseller)
- **Dropship (Satuan Tanpa Stok):** Diberi diskon 15% dari retail $\rightarrow$ **Rp 84.000 / pcs**.
  - ARB Check: Rp 84.000 $\ge$ ARB Rp 54.000. Laba TeeStock = Rp 30.500/pcs.
- **Reseller (Minimal 12 Pcs):** Diberi harga grosir $\rightarrow$ **Rp 70.000 / pcs**.
  - ARB Check: Rp 70.000 $\ge$ ARB Rp 54.000. Laba TeeStock = Rp 16.500/pcs $\times 12 = \mathbf{Rp\ 198.000}$ per transaksi cepat tanpa risiko retur.

### 4. Flash Sale / Payday Crazy Drop (Diskon Ekstrem)
- Misal ingin membuat event heboh 24 jam: "Flash Sale Kaos Distro Cuma Rp 65.000".
- ARB Check: Rp 65.000 $\ge$ ARB Rp 54.000. Masih menghasilkan laba bersih bersih Rp 11.000/pcs + ribuan pengunjung toko baru!
- **Jika ada konfigurasi diskon salah input hingga harga menjadi Rp 49.000:**
  - **Sistem ARB Guard Engine seketika mengunci harga di Rp 54.000** dan menampilkan feedback:  
    `"Diskon maksimal telah diterapkan untuk menjamin kualitas material terbaik."`

---

## 5. CTO: Arsitektur Database Pencatatan Pengadaan & Buku Kas

Untuk mendukung founder solopreneur dalam mencatat pengadaan barang dan memisahkan uang pribadi vs bisnis, kita merancang 2 tabel inti PostgreSQL di Supabase:
1. `ts_procurements` (Pencatatan Belanja Bahan & Update Otomatis Moving Average).
2. `ts_cash_ledger` (Buku Kas Satu Pintu: Kas Masuk, Kas Keluar, Injeksi Modal, & Prive).

### A. SQL Migration Schema (Supabase DDL)

```sql
-- ====================================================================
-- 1. TABEL: ts_procurements (Pencatatan Belanja / Pengadaan Barang)
-- ====================================================================
CREATE TABLE IF NOT EXISTS ts_procurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procurement_no VARCHAR(50) UNIQUE NOT NULL,      -- Contoh: PO-2609-001
    item_type VARCHAR(50) NOT NULL,                  -- blank_tshirt, dtf_film, packaging, electricity, other
    item_sku VARCHAR(50),                            -- SKU di ts_inventory / ts_products
    item_name VARCHAR(150) NOT NULL,
    supplier_name VARCHAR(100) NOT NULL,             -- Distributor NSA, Vendor DTF, MultiGraph, PLN
    purchase_type VARCHAR(30) DEFAULT 'lusinan',     -- satuan, lusinan, partai, roll_meter
    qty NUMERIC(10, 2) NOT NULL CHECK (qty > 0),
    unit_measure VARCHAR(20) DEFAULT 'pcs',          -- pcs, meter, roll, lembar, paket
    unit_cost NUMERIC(12, 2) NOT NULL CHECK (unit_cost >= 0),
    shipping_cost NUMERIC(12, 2) DEFAULT 0,          -- Ongkir pengadaan dari vendor
    total_cost NUMERIC(12, 2) NOT NULL,              -- (qty * unit_cost) + shipping_cost
    payment_source VARCHAR(50) DEFAULT 'business_bank', -- business_bank, personal_pocket, petty_cash
    receipt_url TEXT,                                -- URL foto nota / struk
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ts_procurements_date ON ts_procurements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ts_procurements_sku ON ts_procurements(item_sku);


-- ====================================================================
-- 2. TABEL: ts_cash_ledger (Buku Kas Pemisahan Keuangan Bisnis vs Pribadi)
-- ====================================================================
CREATE TABLE IF NOT EXISTS ts_cash_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_no VARCHAR(50) UNIQUE NOT NULL,      -- Contoh: TX-2609-001
    transaction_date DATE DEFAULT CURRENT_DATE,
    type VARCHAR(20) NOT NULL,                       -- CASH_IN, CASH_OUT
    category VARCHAR(50) NOT NULL,                   -- sales_order, procurement, personal_injection, owner_prive, operational
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    source_account VARCHAR(50) NOT NULL,             -- bank_teestock, qris_midtrans, dompet_pribadi
    destination_account VARCHAR(50),                 -- vendor_nsa, vendor_dtf, rekening_pribadi_founder
    related_id VARCHAR(50),                          -- order_number atau procurement_no
    description TEXT NOT NULL,
    is_personal_wallet BOOLEAN DEFAULT false,        -- True jika transaksi melibatkan dompet pribadi (Injeksi / Prive)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ts_cash_ledger_date ON ts_cash_ledger(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_ts_cash_ledger_type ON ts_cash_ledger(type);
CREATE INDEX IF NOT EXISTS idx_ts_cash_ledger_category ON ts_cash_ledger(category);


-- ====================================================================
-- 3. FUNCTION & TRIGGER: Update Otomatis Moving Average Cost ke Inventory
-- ====================================================================
CREATE OR REPLACE FUNCTION public.apply_procurement_moving_average()
RETURNS TRIGGER AS $$
DECLARE
    current_stock INT;
    current_cost NUMERIC(12, 2);
    real_unit_cost NUMERIC(12, 2);
    new_avg_cost NUMERIC(12, 2);
    new_stock INT;
BEGIN
    -- Hitung unit cost riil termasuk alokasi ongkir pengadaan
    real_unit_cost := NEW.unit_cost + (COALESCE(NEW.shipping_cost, 0) / NEW.qty);

    -- Cek stok dan HPP saat ini di ts_inventory
    SELECT stock_qty, cost_per_unit INTO current_stock, current_cost
    FROM public.ts_inventory
    WHERE sku_item = NEW.item_sku;

    IF FOUND THEN
        -- Jika stok lama ada, hitung moving average
        IF current_stock > 0 THEN
            new_avg_cost := ROUND(((current_stock * current_cost) + (NEW.qty * real_unit_cost)) / (current_stock + NEW.qty), 2);
        ELSE
            new_avg_cost := real_unit_cost;
        END IF;

        new_stock := current_stock + ROUND(NEW.qty);

        -- Perbarui inventory stok dan HPP
        UPDATE public.ts_inventory
        SET stock_qty = new_stock,
            cost_per_unit = new_avg_cost,
            updated_at = NOW()
        WHERE sku_item = NEW.item_sku;

        -- Jika item_type adalah blank_tshirt, perbarui juga cost_blank di ts_products & unit_economics
        IF NEW.item_type = 'blank_tshirt' THEN
            UPDATE public.ts_products
            SET cost_blank = new_avg_cost,
                updated_at = NOW()
            WHERE sku = NEW.item_sku OR sku LIKE '%' || NEW.item_sku || '%';

            UPDATE public.ts_unit_economics
            SET cost_blank = new_avg_cost,
                updated_at = NOW()
            WHERE product_sku = NEW.item_sku OR product_sku LIKE '%' || NEW.item_sku || '%';
        END IF;
    END IF;

    -- Catat otomatis pengeluaran belanja ini ke ts_cash_ledger
    INSERT INTO public.ts_cash_ledger (
        transaction_no, 
        transaction_date, 
        type, 
        category, 
        amount, 
        source_account, 
        destination_account, 
        related_id, 
        description, 
        is_personal_wallet
    ) VALUES (
        'TX-PO-' || SUBSTRING(NEW.procurement_no FROM 4),
        CURRENT_DATE,
        'CASH_OUT',
        'procurement',
        NEW.total_cost,
        NEW.payment_source,
        NEW.supplier_name,
        NEW.procurement_no,
        'Pengadaan: ' || NEW.item_name || ' (' || NEW.qty || ' ' || NEW.unit_measure || ' @ Rp ' || NEW.unit_cost || ')',
        (NEW.payment_source = 'personal_pocket')
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_procurement_moving_average ON public.ts_procurements;
CREATE TRIGGER trg_procurement_moving_average
    AFTER INSERT ON public.ts_procurements
    FOR EACH ROW EXECUTE FUNCTION public.apply_procurement_moving_average();


-- ====================================================================
-- 4. RLS POLICIES: Keamanan Data Keuangan (Hanya Admin)
-- ====================================================================
ALTER TABLE ts_procurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_cash_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_procurements" ON ts_procurements FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin_all_cash_ledger" ON ts_cash_ledger FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
```

---

## 6. CTO: Implementasi ARB Guard Engine di Kode Frontend (`pricing.js`)

Untuk memastikan tidak ada celah di UI atau manipulasi client-side, kita siapkan kalkulator ARB dan guard function di [`src/constants/pricing.js`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/web/src/constants/pricing.js):

```javascript
/**
 * Standar Biaya Operasional & Kemasan TeeStock (September 2026)
 */
export const UNIT_COST_STANDARDS = {
  packaging: 2000,    // Polymailer + Vinyl Sticker + Label A6
  electricity: 1000,  // Heat Press in-house 900W + curing
  dtfRates: {
    a6: 2000,
    a5: 4500,
    a4: 7500,
    a3: 12500,
    a3_plus_a6: 14500,
    double_a3: 24000
  }
};

/**
 * Hitung HPP dan Harga ARB (Auto Rijek Bawah)
 * @param {Object} params - Parameter produk
 * @param {number} params.garmentCost - HPP Kaos dari Moving Average (cth: 33000 atau 38000)
 * @param {string} params.printSize - 'none' | 'a6' | 'a5' | 'a4' | 'a3' | 'a3_plus_a6' | 'double_a3'
 * @param {boolean} params.isBlank - True jika kaos polos tanpa sablon
 */
export function calculateProductHPPAndARB({ garmentCost, printSize = 'a3', isBlank = false }) {
  const packCost = UNIT_COST_STANDARDS.packaging;
  const electCost = isBlank ? 0 : UNIT_COST_STANDARDS.electricity;
  const dtfCost = isBlank ? 0 : (UNIT_COST_STANDARDS.dtfRates[printSize] || 12500);

  const totalHPP = garmentCost + dtfCost + packCost + electCost;

  // ARB = HPP + 10% Profit Bersih, dibulatkan ke kelipatan Rp 1.000 ke atas
  const rawARB = totalHPP * 1.10;
  const arbFloorPrice = Math.ceil(rawARB / 1000) * 1000;

  return {
    garmentCost,
    dtfCost,
    packCost,
    electCost,
    totalHPP,
    arbFloorPrice
  };
}

/**
 * ARB Guard Engine: Validasi apakah harga setelah promo aman
 * Menolak pemotongan harga yang tembus di bawah floor price!
 */
export function applyARBGuard(calculatedPrice, arbFloorPrice) {
  if (calculatedPrice < arbFloorPrice) {
    return {
      finalPrice: arbFloorPrice,
      isFloorClamped: true,
      message: 'Diskon optimal maksimal telah diterapkan untuk menjaga standar kualitas material.'
    };
  }
  return {
    finalPrice: calculatedPrice,
    isFloorClamped: false,
    message: null
  };
}
```

---

## 7. Mentor Bisnis & Founder Guide: Pemisahan Kas Pribadi vs Bisnis

Bagi solopreneur yang mengelola 3 bisnis sekaligus, kebocoran terbesar seringkali bukan karena bisnis merugi di atas kertas, melainkan **tercampurnya uang kas operasional dengan dompet pribadi**.

### Golden Rules Keuangan Solopreneur TeeStock:
1. **Rekening Operasional Khusus TeeStock:**
   - Gunakan 1 akun bank digital terpisah (misal Bank Jago Kantong Bisnis, BCA Bisnis, atau Blu by BCA Digital).
   - Semua dana masuk dari pesanan web (QRIS Midtrans / transfer) **wajib mendarat di rekening ini**.
2. **Aturan Injeksi Modal Pribadi (Owner Capital):**
   - Jika saat belanja bahan kas bisnis kurang dan Anda memakai uang pribadi, catat di panel admin dengan tipe:  
     `Kategori: personal_injection | Sumber: dompet_pribadi -> bank_teestock`.
   - Ini tercatat sebagai **Hutang Bisnis ke Founder**, yang sah diganti ketika ada omset masuk.
3. **Aturan Tarik Laba / Gaji Founder (Owner Prive):**
   - Jangan mengambil uang kas untuk jajan harian secara acak.
   - Tetapkan jadwal penarikan *Prive* (misal setiap hari Jumat atau tanggal 25) dari akumulasi Laba Bersih yang tersedia.
   - Catat di sistem: `Kategori: owner_prive | Sumber: bank_teestock -> rekening_pribadi`.
   - Dengan begitu, saldo kas bisnis selalu mencerminkan modal kerja yang aman untuk repeat order bahan.

---

## 8. Rangkuman Langkah Implementasi Minggu Ini
1. ✅ **Jalankan Skrip Database:** Terapkan skema `ts_procurements` dan `ts_cash_ledger` ke Supabase SQL Editor.
2. ✅ **Integrasikan ARB Guard ke Cart & Checkout:** Hubungkan kalkulasi `calculateProductHPPAndARB` dan `applyARBGuard` pada `CartPage.jsx` dan `CheckoutPage.jsx`.
3. ✅ **Tampilan Admin Belanja & Kas:** Buat tab baru di Dashboard Admin khusus Founder (`/admin`):
   - **Tab Pengadaan:** Form input belanja vendor (Kaos ecer/lusin, roll DTF, packing) $\rightarrow$ auto update stok & MAC.
   - **Tab Buku Kas:** Ringkasan Posisi Kas (Cash in Bank, Injeksi Pribadi, Prive Founder, Laba Bersih Real-time).
