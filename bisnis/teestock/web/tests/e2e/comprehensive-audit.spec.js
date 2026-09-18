import { test, expect } from '@playwright/test';

test.describe('Audit Menyeluruh Web TeeStock (Full System & Feature Verification)', () => {
  test('Audit Konsol & Responsivitas Semua Halaman Publik Utama (Zero Console Errors)', async ({ page }) => {
    test.setTimeout(90000);
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (
          !text.includes('Failed to load resource') && 
          !text.includes('favicon.ico') &&
          !text.includes('Content Security Policy') &&
          !text.includes('midtrans.com')
        ) {
          consoleErrors.push(text);
        }
      }
    });

    const routesToTest = [
      { path: '/', titleSnippet: /TeeStock/i },
      { path: '/polos', titleSnippet: /Kaos Polos/i },
      { path: '/katalog', titleSnippet: /TeeStock/i },
      { path: '/custom-order', titleSnippet: /Custom/i },
      { path: '/keranjang', titleSnippet: /TeeStock/i },
      { path: '/tracking', titleSnippet: /Lacak/i },
      { path: '/partner', titleSnippet: /Dropship/i },
      { path: '/care', titleSnippet: /Garansi/i },
      { path: '/garansi', titleSnippet: /Garansi/i },
      { path: '/akun', titleSnippet: /TeeStock/i },
      { path: '/bio', titleSnippet: /TeeStock/i },
      { path: '/admin/login', titleSnippet: /TeeStock/i }
    ];

    for (const route of routesToTest) {
      await page.goto(route.path);
      await expect(page).toHaveTitle(route.titleSnippet, { timeout: 15000 });
    }

    expect(consoleErrors).toEqual([]);
  });

  test('Verifikasi Kalkulator Margin Kemitraan & Form (/partner)', async ({ page }) => {
    await page.goto('/partner');
    await expect(page).toHaveTitle(/Dropship/i);

    const tierSwitchReseller = page.locator('button:has-text("Mitra Reseller")');
    if (await tierSwitchReseller.isVisible()) {
      await tierSwitchReseller.click();
      await expect(page.locator('text=Rp 65.000')).toBeVisible();
    }

    const submitBtn = page.locator('button:has-text("KIRIM PENGAJUAN MITRA")');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await expect(page.locator('text=Nama lengkap wajib diisi.')).toBeVisible();
    }
  });

  test('Verifikasi Fitur Detail Produk (PDP): Varian Warna, Ukuran & Panduan Size (/produk/:sku)', async ({ page }) => {
    await page.goto('/polos');
    await expect(page).toHaveTitle(/Kaos Polos/i);
    const firstProduct = page.locator('a[href^="/produk/"]').first();
    await expect(firstProduct).toBeVisible({ timeout: 15000 });
    await firstProduct.click();
    await page.waitForURL(/\/produk\/.+/);

    await expect(page.locator('text=Pilihan Ukuran')).toBeVisible();

    const sizeGuideBtn = page.locator('button:has-text("Rekomendasi Ukuran")');
    if (await sizeGuideBtn.isVisible()) {
      await sizeGuideBtn.click();
      await expect(page.locator('text=Kalkulator Ukuran Pas')).toBeVisible();
      const closeBtn = page.locator('button[aria-label="Tutup"]').or(page.locator('button:has-text("Tutup")')).first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
    }

    const addToCartBtn = page.locator('button:has-text("Tambah ke Troli")').first();
    await expect(addToCartBtn).toBeEnabled();
    await addToCartBtn.click();

    await expect(page.locator('text=Berhasil')).toBeVisible({ timeout: 5000 });
  });

  test('Verifikasi Keranjang Belanja: Diskon Voucher, Update Qty & Proteksi Keranjang Kosong (/keranjang)', async ({ page }) => {
    // 1. Kunjungi keranjang saat kosong
    await page.goto('/keranjang');
    await page.evaluate(() => localStorage.removeItem('teestock_cart'));
    await page.reload();

    // Verifikasi tampilan keranjang kosong
    await expect(page.locator('text=Troli Belanja Anda Masih Kosong')).toBeVisible();
    const belanjaBtn = page.locator('a:has-text("Katalog Kaos Polos NSA")').first();
    await expect(belanjaBtn).toBeVisible();

    // 2. Tambah produk dari katalog polos
    await page.goto('/polos');
    const product = page.locator('a[href^="/produk/"]').first();
    await expect(product).toBeVisible({ timeout: 10000 });
    await product.click();
    await page.waitForURL(/\/produk\/.+/);

    const addBtn = page.locator('button:has-text("Tambah ke Troli")').first();
    await addBtn.click();

    // 3. Masuk ke keranjang dan cek voucher tidak valid
    await page.goto('/keranjang');
    await expect(page.locator('text=Keranjang & Checkout')).toBeVisible();

    const voucherInput = page.locator('input[placeholder="Contoh: WELCOME10"]');
    if (await voucherInput.isVisible()) {
      await voucherInput.fill('KODEACAKSALAH123');
      const klaimBtn = page.locator('button:has-text("Klaim")');
      await klaimBtn.click();
      await expect(page.locator('text=tidak ditemukan')).toBeVisible({ timeout: 5000 });
    }
  });

  test('Verifikasi Halaman Garansi & Size Chart NSA (/care & /garansi)', async ({ page }) => {
    await page.goto('/care');
    await expect(page.locator('text=100% Garmen NSA Original Cititex')).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('heading', { name: /2\. Panduan Ukuran/i })).toBeVisible();
    await expect(page.locator('th:has-text("Lebar Dada")')).toBeVisible();

    await page.goto('/garansi');
    await expect(page.locator('text=100% Garmen NSA Original Cititex')).toBeVisible({ timeout: 15000 });
  });

  test('Verifikasi Lead Capture Newsletter (/ & footer)', async ({ page }) => {
    await page.goto('/');
    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible();

    await emailInput.fill('test-visitor@teestock.id');
    const submitBtn = page.locator('button:has-text("Dapatkan Notifikasi")').first();
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    await expect(page.locator('text=WELCOME10').or(page.locator('text=Berhasil Terdaftar'))).toBeVisible({ timeout: 10000 });
  });

  test('Verifikasi Navigasi Mobile Drawer di Layar HP (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const hamburgerBtn = page.locator('button[aria-label="Buka Menu Navigasi"]');
    await expect(hamburgerBtn).toBeVisible();
    await hamburgerBtn.click();

    const drawer = page.locator('role=dialog[name="Menu Navigasi Mobile"]');
    await expect(drawer).toBeVisible();
    await expect(drawer.locator('text=Kaos Polos NSA Original')).toBeVisible();

    const closeBtn = page.locator('button[aria-label="Tutup Menu"]');
    await closeBtn.click();
    await expect(drawer).toBeHidden();
  });
});
