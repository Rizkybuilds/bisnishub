---
name: web-qa-testing
description: >-
  Strategi pengujian web app end-to-end (Playwright), unit & component testing
  (Vitest, React Testing Library), audit alur checkout e-commerce, mock network (MSW),
  validasi responsivitas multi-device, dan skenario regresi edge-case.
argument-hint: "[e2e, test, playwright, vitest, qa, or regression]"
---

# Web QA & Testing Specialist — E2E & Component Test Engineer

Skill spesialis untuk menjamin keandalan aplikasi web melalui pengujian otomatis (*automated testing*), audit skenario kritis pengguna, dan pencegahan regresi kode (*zero broken checkouts*).

---

## 1. Piramida Testing Aplikasi Web Lean

Untuk tim solopreneur atau startup cepat, jangan habiskan waktu membuat ratusan unit test untuk komponen presentasional sederhana. Gunakan rasio 70/20/10:

```
        ▲
       / \      10% E2E Smoke Test (Playwright)
      /   \     Alur Uang & Transaksi Kritis
     /-----\
    /       \   20% Integration Tests
   /         \  Formulir, Custom Hooks, API Client
  /-----------\
 /             \ 70% Unit & Utility Tests (Vitest)
/               \ Perhitungan HPP, Diskon, Formatter Rupiah, Validasi
-----------------
```

---

## 2. End-to-End (E2E) Test dengan Playwright

Fokuskan pengujian E2E pada skenario **"Golden Path" (Jalur Utama Konversi Penjualan)**:

```typescript
// tests/checkout-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('E-Commerce Checkout Flow', () => {
  test('Pengguna dapat memilih produk, menambah ke keranjang, dan mencapai halaman pembayaran', async ({ page }) => {
    // 1. Kunjungi halaman katalog
    await page.goto('/catalog');
    await expect(page).toHaveTitle(/Katalog Produk/);

    // 2. Klik produk pertama dan pilih ukuran
    await page.locator('[data-testid="product-card"]').first().click();
    await page.locator('button:has-text("L")').click();

    // 3. Tambahkan ke keranjang
    await page.locator('button:has-text("Tambah ke Keranjang")').click();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

    // 4. Buka laci keranjang dan klik Checkout
    await page.locator('[data-testid="cart-button"]').click();
    await page.locator('button:has-text("Checkout Sekarang")').click();

    // 5. Isi formulir pengiriman
    await page.fill('input[name="customerName"]', 'Budi Santoso');
    await page.fill('input[name="whatsappNumber"]', '081234567890');
    await page.fill('textarea[name="shippingAddress"]', 'Jl. Merdeka No. 45, Kebayoran Baru, Jakarta Selatan');

    // 6. Validasi bahwa tombol bayar aktif
    const payBtn = page.locator('button[type="submit"]');
    await expect(payBtn).toBeEnabled();
  });
});
```

---

## 3. Unit Testing Perhitungan Transaksi Finansial (Vitest)

Semua fungsi kalkulator harga, diskon, dan ongkir wajib diuji terhadap kondisi pembulatan dan batas nilai:

```typescript
// src/shared/lib/__tests__/pricing.test.ts
import { describe, it, expect } from 'vitest';
import { calculateCartTotal, formatRupiah } from '../pricing';

describe('Kalkulasi Nilai Keranjang Belanja', () => {
  it('menghitung total harga dengan kupon diskon persentase secara tepat', () => {
    const items = [
      { id: '1', price: 120000, quantity: 2 }, // 240.000
      { id: '2', price: 95000, quantity: 1 }   // 95.000
    ];
    const discountPercent = 10; // 10% dari 335.000 = 33.500
    const shippingFee = 15000;

    const result = calculateCartTotal(items, discountPercent, shippingFee);
    expect(result.subtotal).toBe(335000);
    expect(result.discountAmount).toBe(33500);
    expect(result.grandTotal).toBe(316500);
  });

  it('memformat angka rupiah dengan benar', () => {
    expect(formatRupiah(135000)).toBe('Rp 135.000');
    expect(formatRupiah(0)).toBe('Rp 0');
  });
});
```

---

## 4. Checklist QA Rilis Produk Web (Pre-Flight QA)
- [ ] **Alur Checkout Keranjang Kosong**: Pastikan tombol checkout non-aktif atau mengarahkan kembali ke katalog jika keranjang 0 item.
- [ ] **Form Error Handling**: Pastikan nomor WhatsApp yang tidak sesuai format Indonesia (`08...` atau `628...`) menampilkan peringatan merah sebelum disubmit.
- [ ] **Mobile Responsiveness**: Uji tampilan pada viewport 375px (iPhone SE) dan 414px (iPhone Pro Max) — tidak boleh ada overflow horizontal.
- [ ] **Network Slow 3G Emulation**: Pastikan skeleton loading tampil dengan rapi dan tombol submit tidak bisa diklik dua kali (*double click prevention*).
- [ ] **Console Error Audit**: Buka DevTools Console, pastikan 0 pesan error merah yang tidak tertangani saat navigasi antar rute.
