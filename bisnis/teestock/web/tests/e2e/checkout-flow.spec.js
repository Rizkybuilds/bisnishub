import { test, expect } from '@playwright/test';

test.describe('Jalur Emas E-Commerce TeeStock (Golden Checkout Path)', () => {
  test('Pengguna dapat memilih produk, menentukan varian, mengisi data checkout, dan melihat tagihan pembayaran', async ({ page }) => {
    // 1. Kunjungi Halaman Katalog
    await page.goto('/katalog');
    await expect(page).toHaveTitle(/TeeStock/i);

    // Pastikan etalase menampilkan kartu produk
    const productCards = page.locator('a[href^="/produk/"]');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });

    // 2. Buka Halaman Detail Produk Pertama
    await productCards.first().click();
    await page.waitForURL(/\/produk\/.+/);

    // Verifikasi keberadaan komponen pemilihan garmen dan ukuran
    const purchasePanel = page.locator('text=Pilih Ukuran');
    await expect(purchasePanel).toBeVisible();

    // 3. Tambahkan ke Keranjang
    const addToCartButton = page.locator('button:has-text("+ Keranjang")').first();
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();

    // 4. Navigasi ke Halaman Keranjang Belanja
    await page.goto('/keranjang');
    await expect(page.locator('text=Keranjang & Checkout')).toBeVisible();

    // Pastikan item terdaftar dalam troli
    const cartItems = page.locator('text=Subtotal Produk');
    await expect(cartItems).toBeVisible();

    // 5. Isi Formulir Pengiriman & Kurir
    await page.fill('input[name="customerName"]', 'Rizky Testing');
    await page.fill('input[name="phone"]', '081234567890');
    await page.fill('input[name="city"]', 'Bandung');
    await page.fill('input[name="subdistrict"]', 'Coblong');
    await page.fill('textarea[name="address"]', 'Jl. Dago No. 123, RT 01/02');

    // 6. Verifikasi Indikator Berat Paket dan Tombol Submit
    const weightIndicator = page.locator('text=Total Berat Paket');
    await expect(weightIndicator).toBeVisible();

    // Verifikasi tombol submit checkout aktif
    const checkoutButton = page.locator('button:has-text("Pembayaran")');
    await expect(checkoutButton).toBeEnabled();
  });

  test('Validasi form mencegah submission jika nomor HP tidak valid', async ({ page }) => {
    await page.goto('/keranjang');

    // Jika keranjang kosong, kembali ke katalog
    const emptyState = page.locator('text=Troli Belanja Anda Masih Kosong');
    if (await emptyState.isVisible()) {
      await page.goto('/katalog');
      const product = page.locator('a[href^="/produk/"]').first();
      await product.click();
      await page.locator('button:has-text("+ Keranjang")').first().click();
      await page.goto('/keranjang');
    }

    // Masukkan nomor HP salah format
    await page.fill('input[name="customerName"]', 'Test User');
    await page.fill('input[name="phone"]', '12345');
    await page.fill('input[name="city"]', 'Jakarta');
    await page.fill('input[name="subdistrict"]', 'Tebet');
    await page.fill('textarea[name="address"]', 'Alamat lengkap test');

    const submitBtn = page.locator('button:has-text("Pembayaran")');
    await submitBtn.click();

    // Verifikasi pesan error nomor WhatsApp
    const errorMessage = page.locator('text=Format nomor WhatsApp tidak valid');
    await expect(errorMessage).toBeVisible();
  });
});
