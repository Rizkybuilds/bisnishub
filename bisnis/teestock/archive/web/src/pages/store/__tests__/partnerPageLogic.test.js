import { describe, it, expect } from 'vitest';
import {
  PARTNER_TIERS,
  PARTNER_FAQS,
  calculatePartnerProfitSimulation,
  validatePartnerApplication,
  generatePartnerRegistrationWaText,
  generatePartnerRegistrationWaUrl
} from '../PartnerPage';

describe('PartnerPage Logic & Business Simulator (Checkpoint C-07)', () => {
  describe('PARTNER_TIERS Constant', () => {
    it('memiliki konfigurasi tier Dropshipper dan Reseller VIP yang akurat', () => {
      expect(PARTNER_TIERS.dropship).toBeDefined();
      expect(PARTNER_TIERS.reseller).toBeDefined();

      expect(PARTNER_TIERS.dropship.costPerPcs).toBe(75000);
      expect(PARTNER_TIERS.reseller.costPerPcs).toBe(65000);

      expect(PARTNER_TIERS.dropship.features.length).toBeGreaterThanOrEqual(4);
      expect(PARTNER_TIERS.reseller.features.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('calculatePartnerProfitSimulation (Profit Simulator Engine)', () => {
    it('menghitung laba bulanan Dropshipper dengan benar (50 pcs @ Rp 99.000)', () => {
      const res = calculatePartnerProfitSimulation({
        tier: 'dropship',
        targetPcs: 50,
        sellingPrice: 99000
      });

      expect(res.costPerPcs).toBe(75000);
      expect(res.marginPerPcs).toBe(24000); // 99000 - 75000
      expect(res.monthlyProfit).toBe(1200000); // 24000 * 50
      expect(res.monthlyRevenue).toBe(4950000); // 99000 * 50
      expect(res.profitMarginPct).toBe(24); // 24000 / 99000
      expect(res.dailyPcsEquivalent).toBe('1.7'); // 50 / 30
    });

    it('menghitung laba bulanan Reseller VIP dengan benar (100 pcs @ Rp 115.000)', () => {
      const res = calculatePartnerProfitSimulation({
        tier: 'reseller',
        targetPcs: 100,
        sellingPrice: 115000
      });

      expect(res.costPerPcs).toBe(65000);
      expect(res.marginPerPcs).toBe(50000); // 115000 - 65000
      expect(res.monthlyProfit).toBe(5000000); // 50000 * 100
      expect(res.monthlyRevenue).toBe(11500000); // 115000 * 100
      expect(res.profitMarginPct).toBe(43); // 50000 / 115000
      expect(res.dailyPcsEquivalent).toBe('3.3');
    });

    it('mencegah margin negatif jika harga jual di bawah harga modal mitra', () => {
      const res = calculatePartnerProfitSimulation({
        tier: 'dropship',
        targetPcs: 10,
        sellingPrice: 50000 // di bawah cost 75000
      });

      expect(res.marginPerPcs).toBe(0);
      expect(res.monthlyProfit).toBe(0);
    });

    it('menangani input edge case (non-numeric, nol) secara aman', () => {
      const res = calculatePartnerProfitSimulation({
        tier: 'unknown_tier',
        targetPcs: 0,
        sellingPrice: -100
      });

      expect(res.tierConfig.id).toBe('dropship');
      expect(res.monthlyProfit).toBe(0);
    });
  });

  describe('validatePartnerApplication (Form Validation Helper)', () => {
    it('menolak formulir jika nama lengkap kosong atau kurang dari 3 karakter', () => {
      const res1 = validatePartnerApplication({ fullName: '', phone: '081234567890', brandName: 'Brand X' });
      expect(res1.isValid).toBe(false);
      expect(res1.errors.fullName).toBe('Nama lengkap wajib diisi.');

      const res2 = validatePartnerApplication({ fullName: 'AB', phone: '081234567890', brandName: 'Brand X' });
      expect(res2.isValid).toBe(false);
      expect(res2.errors.fullName).toContain('minimal 3 karakter');
    });

    it('menolak nomor WhatsApp yang tidak valid', () => {
      const res1 = validatePartnerApplication({ fullName: 'Budi Santoso', phone: '', brandName: 'Brand X' });
      expect(res1.isValid).toBe(false);
      expect(res1.errors.phone).toBe('Nomor WhatsApp wajib diisi.');

      const res2 = validatePartnerApplication({ fullName: 'Budi Santoso', phone: '123', brandName: 'Brand X' });
      expect(res2.isValid).toBe(false);
      expect(res2.errors.phone).toContain('minimal 8 digit');
    });

    it('menolak formulir jika nama brand kosong', () => {
      const res = validatePartnerApplication({ fullName: 'Budi Santoso', phone: '081234567890', brandName: '' });
      expect(res.isValid).toBe(false);
      expect(res.errors.brandName).toBe('Nama toko / brand wajib diisi.');
    });

    it('menerima pendaftaran yang memenuhi seluruh kriteria', () => {
      const res = validatePartnerApplication({
        fullName: 'Budi Santoso',
        phone: '0812-3456-7890',
        brandName: 'StreetVibe Apparel',
        city: 'Bandung'
      });
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors)).toHaveLength(0);
    });
  });

  describe('generatePartnerRegistrationWaText & generatePartnerRegistrationWaUrl', () => {
    const mockData = {
      fullName: 'Rizky Mitra',
      brandName: 'Indie Apparel Co',
      phone: '081234567890',
      city: 'Surabaya',
      channel: 'Shopee & TikTok Shop',
      partnerTier: 'reseller'
    };

    it('membuat draf pesan WhatsApp pendaftaran mitra yang terstruktur', () => {
      const text = generatePartnerRegistrationWaText(mockData);
      expect(text).toContain('Reseller VIP');
      expect(text).toContain('Rizky Mitra');
      expect(text).toContain('Indie Apparel Co');
      expect(text).toContain('081234567890');
      expect(text).toContain('Surabaya');
      expect(text).toContain('Shopee & TikTok Shop');
    });

    it('menghasilkan tautan wa.me dengan encoding URL yang valid', () => {
      const url = generatePartnerRegistrationWaUrl('085220274968', mockData);
      expect(url).toContain('https://wa.me/6285220274968?text=');
      expect(url).toContain(encodeURIComponent('Indie Apparel Co'));
    });
  });

  describe('PARTNER_FAQS Constant', () => {
    it('memuat 5 pertanyaan dan jawaban esensial untuk objection handling', () => {
      expect(PARTNER_FAQS).toHaveLength(5);
      expect(PARTNER_FAQS[0].q).toContain('biaya pendaftaran');
      expect(PARTNER_FAQS[1].a).toContain('White-Label');
      expect(PARTNER_FAQS[3].a.toLowerCase()).toContain('garansi');
    });
  });
});
