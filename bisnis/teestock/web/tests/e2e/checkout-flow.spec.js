import { test, expect } from '@playwright/test';

test.describe('Jalur Emas E-Commerce TeeStock (Golden Customer Journey)', () => {
  test('Alur Lengkap Transaksi: Katalog -> PDP -> Keranjang -> Voucher -> Checkout QRIS -> Tracking Status', async ({ page }) => {
    // 1. Kunjungi Halaman Katalog Kaos Polos NSA Original (Real Supabase Catalog)
    await page.goto('/polos');
    await expect(page).toHaveTitle(/TeeStock/i);

    // Pastikan etalase menampilkan kartu produk NSA
    const productCards = page.locator('a[href^="/produk/"]');
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });

    // 2. Buka Halaman Detail Produk Pertama
    await productCards.first().click();
    await page.waitForURL(/\/produk\/.+/);

    // Verifikasi komponen pemilihan varian
    const purchasePanel = page.locator('text=Pilihan Ukuran');
    await expect(purchasePanel).toBeVisible({ timeout: 15000 });

    // 3. Tambahkan ke Keranjang
    const addToCartButton = page.locator('button:has-text("Tambah ke Troli")').first();
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();

    // 4. Navigasi ke Halaman Keranjang Belanja
    await page.goto('/keranjang');
    await expect(page.locator('text=Keranjang & Checkout')).toBeVisible();

    // Pastikan item terdaftar dalam troli
    const cartItems = page.locator('text=Subtotal Produk');
    await expect(cartItems).toBeVisible();

    // 5. Klaim Voucher Diskon
    const voucherInput = page.locator('input[placeholder="Contoh: WELCOME10"]');
    if (await voucherInput.isVisible()) {
      await voucherInput.fill('WELCOME10');
      const klaimBtn = page.locator('button:has-text("Klaim")');
      await klaimBtn.click();
      await expect(page.locator('text=AKTIF: WELCOME10')).toBeVisible({ timeout: 5000 });
    }

    // 6. Isi Formulir Pengiriman & Kurir
    await page.fill('input[name="customerName"]', 'Rizky Testing QA');
    await page.fill('input[name="phone"]', '081234567890');
    await page.fill('input[name="city"]', 'Bandung');
    await page.fill('input[name="subdistrict"]', 'Coblong');
    await page.fill('textarea[name="address"]', 'Jl. Dago No. 123, RT 01/02');

    // 7. Verifikasi Indikator Berat Paket dan Tombol Submit
    const weightIndicator = page.locator('text=Total Berat Paket');
    await expect(weightIndicator).toBeVisible();

    // 8. Submit Pesanan & Tampilkan Layar QRIS
    const checkoutButton = page.locator('button:has-text("Pembayaran")');
    await expect(checkoutButton).toBeEnabled();
    await checkoutButton.click();

    // Verifikasi Layar Sukses Pesanan & Box Pembayaran QRIS
    await expect(page.locator('text=Pesanan Berhasil Dicatat!')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Nominal Transfer Persis')).toBeVisible();
    await expect(page.locator('text=Verifikasi Otomatis via Kode Unik')).toBeVisible();

    // Verifikasi Tombol Konfirmasi WhatsApp & Tombol Lacak Pesanan
    const waConfirmBtn = page.locator('a:has-text("Saya Sudah Bayar")');
    await expect(waConfirmBtn).toBeVisible();
    const waHref = await waConfirmBtn.getAttribute('href');
    expect(waHref).toContain('wa.me');

    const trackOrderBtn = page.locator('a:has-text("Lacak Status Pesanan")');
    await expect(trackOrderBtn).toBeVisible();

    // 9. Klik Lacak Status Pesanan dan Verifikasi Halaman Tracking
    await trackOrderBtn.click();
    await page.waitForURL(/\/tracking\?order=.+/);
    await expect(page.locator('h1:has-text("Lacak Status Pesanan")')).toBeVisible();
    await expect(page.locator('text=Nomor Pesanan:')).toBeVisible();
    await expect(page.locator('text=Order Diterima')).toBeVisible();
  });

  test('Validasi form mencegah submission jika nomor HP tidak valid', async ({ page }) => {
    // 1. Kunjungi katalog polos dan masukkan produk ke troli
    await page.goto('/polos');
    const product = page.locator('a[href^="/produk/"]').first();
    await expect(product).toBeVisible({ timeout: 10000 });
    await product.click();
    await page.waitForURL(/\/produk\/.+/);

    const addBtn = page.locator('button:has-text("Tambah ke Troli")').first();
    await expect(addBtn).toBeVisible({ timeout: 15000 });
    await addBtn.click();

    // 2. Buka keranjang
    await page.goto('/keranjang');
    await expect(page.locator('input[name="customerName"]')).toBeVisible({ timeout: 10000 });

    // Masukkan nomor HP salah format
    await page.fill('input[name="customerName"]', 'Test User');
    await page.fill('input[name="phone"]', '12345');
    await page.fill('input[name="city"]', 'Jakarta');
    await page.fill('input[name="subdistrict"]', 'Tebet');
    await page.fill('textarea[name="address"]', 'Alamat lengkap test');

    const submitBtn = page.locator('button:has-text("Pembayaran")');
    await submitBtn.click();

    // Verifikasi pesan error nomor WhatsApp
    const errorMessage = page.locator('text=Nomor WhatsApp tidak valid');
    await expect(errorMessage).toBeVisible();
  });

  test('Customer Journey Studio Custom Order (/custom-order)', async ({ page }) => {
    await page.goto('/custom-order');
    await expect(page).toHaveTitle(/Custom Sablon/i);

    // Langkah 1 -> Langkah 2
    const nextBtn1 = page.locator('button:has-text("Lanjut ke Area Sablon")');
    await expect(nextBtn1).toBeVisible();
    await nextBtn1.click();

    // Langkah 2 -> Langkah 3
    const nextBtn2 = page.locator('button:has-text("Lanjut ke Data & Artwork")');
    await expect(nextBtn2).toBeVisible();
    await nextBtn2.click();

    // Langkah 3: Isi identitas pemesan
    await page.fill('input#customName', 'Komunitas Motor Bandung');
    await page.fill('input#customPhone', '081298765432');
    await page.fill('input[placeholder*="Jakarta Selatan"]', 'Bandung');

    // Verifikasi estimasi total di summary card
    await expect(page.locator('text=Total Estimasi:')).toBeVisible();

    // Submit form custom order
    const submitBtn = page.locator('button:has-text("KIRIM JOB ORDER CUSTOM")');
    await submitBtn.click();

    // Verifikasi konfirmasi diterima
    await expect(page.locator('text=Permintaan Custom Diterima!')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('a:has-text("Konfirmasi Order ke WhatsApp Studio")')).toBeVisible();
  });

  test('Customer Journey Bio Link TikTok & Instagram (/bio)', async ({ page }) => {
    await page.goto('/bio');
    await expect(page).toHaveTitle(/TeeStock/i);
    await expect(page.getByRole('heading', { name: 'TeeStock', exact: true })).toBeVisible();
    await expect(page.locator('text=DROP #01: RAW IDENTITY')).toBeVisible();
    await expect(page.locator('text=Katalog Grafis & Blank NSA')).toBeVisible();
    await expect(page.locator('text=TeeStock Atelier (Custom & Merch)')).toBeVisible();
  });

  test('Customer Journey Navigasi Katalog NSA Blanks (/polos)', async ({ page }) => {
    await page.goto('/polos');
    await expect(page).toHaveTitle(/Kaos Polos New States Apparel/i);
    await expect(page.locator('text=Pilih Model & Ketebalan Bahan NSA:')).toBeVisible();

    const blankCards = page.locator('a[href^="/produk/"]');
    await expect(blankCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('Halaman Katalog Grafis (/katalog) menampilkan etalase produk atau status kurasi', async ({ page }) => {
    await page.goto('/katalog');
    await expect(page).toHaveTitle(/TeeStock/i);
    const productOrCuration = page.locator('a[href^="/produk/"]').or(page.locator('text=Koleksi Drop Grafis Sedang Dikurasi')).first();
    await expect(productOrCuration).toBeVisible({ timeout: 15000 });
  });
});
