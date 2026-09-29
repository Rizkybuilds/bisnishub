import { describe, it, expect } from 'vitest';
import {
  CREATOR_ROYALTY_CONFIG,
  CREATOR_NICHE_CATEGORIES,
  CREATOR_FAQS,
  calculateCreatorRoyalty,
  validateCreatorSubmission,
  generateCreatorSubmissionWaText,
  generateCreatorSubmissionWaUrl
} from '../CreatorPage';

describe('CreatorPage Logic & Royalty Engine (Checkpoint C-09)', () => {
  describe('CREATOR_ROYALTY_CONFIG & Constants', () => {
    it('memiliki konfigurasi royalti standar Rp 25.000/pcs dan payout tgl 5', () => {
      expect(CREATOR_ROYALTY_CONFIG.royaltyPerPcs).toBe(25000);
      expect(CREATOR_ROYALTY_CONFIG.minPayoutThreshold).toBe(100000);
      expect(CREATOR_ROYALTY_CONFIG.payoutScheduleDay).toBe(5);
      expect(CREATOR_ROYALTY_CONFIG.garmentBase).toContain('NSA');
      expect(CREATOR_ROYALTY_CONFIG.printSpec).toContain('DTF 155°C');
    });

    it('memiliki opsi kategori niche karya yang terstruktur', () => {
      expect(CREATOR_NICHE_CATEGORIES.length).toBeGreaterThanOrEqual(6);
      const ids = CREATOR_NICHE_CATEGORIES.map(c => c.id);
      expect(ids).toContain('kopi_kafe');
      expect(ids).toContain('tech_dev');
      expect(ids).toContain('tipografi');
    });

    it('memiliki FAQ komprehensif penanganan keberatan hak cipta & royalti', () => {
      expect(CREATOR_FAQS.length).toBeGreaterThanOrEqual(5);
      const questions = CREATOR_FAQS.map(f => f.question.toLowerCase());
      expect(questions.some(q => q.includes('hak cipta'))).toBe(true);
      expect(questions.some(q => q.includes('royalti'))).toBe(true);
      expect(questions.some(q => q.includes('biaya'))).toBe(true);
    });
  });

  describe('calculateCreatorRoyalty (Royalty Projection Engine)', () => {
    it('menghitung estimasi royalti bulanan dan tahunan dengan benar (40 pcs)', () => {
      const res = calculateCreatorRoyalty({ monthlySalesQty: 40, royaltyPerPcs: 25000 });
      expect(res.monthlySalesQty).toBe(40);
      expect(res.royaltyPerPcs).toBe(25000);
      expect(res.monthlyRoyalty).toBe(1000000); // 40 * 25.000
      expect(res.annualRoyalty).toBe(12000000); // 1.000.000 * 12
      expect(res.dailyEquivalent).toBe('1.3'); // 40 / 30
    });

    it('menghitung estimasi royalti untuk target volume besar (200 pcs)', () => {
      const res = calculateCreatorRoyalty({ monthlySalesQty: 200, royaltyPerPcs: 25000 });
      expect(res.monthlyRoyalty).toBe(5000000); // 200 * 25.000
      expect(res.annualRoyalty).toBe(60000000); // 5.000.000 * 12
      expect(res.dailyEquivalent).toBe('6.7');
    });

    it('menangani input 0, negatif, atau string secara aman', () => {
      const resZero = calculateCreatorRoyalty({ monthlySalesQty: 0 });
      expect(resZero.monthlyRoyalty).toBe(0);
      expect(resZero.annualRoyalty).toBe(0);
      expect(resZero.dailyEquivalent).toBe('0.0');

      const resNegative = calculateCreatorRoyalty({ monthlySalesQty: -10 });
      expect(resNegative.monthlyRoyalty).toBe(0);

      const resString = calculateCreatorRoyalty({ monthlySalesQty: '50' });
      expect(resString.monthlyRoyalty).toBe(1250000);
    });
  });

  describe('validateCreatorSubmission (Form Validation)', () => {
    const validData = {
      creatorName: 'Rian Illustrator',
      creatorWhatsapp: '081234567890',
      creatorEmail: 'rian@illustrator.id',
      designTitle: 'Coffee & Code Overdrive',
      driveLink: 'https://drive.google.com/drive/folders/123xyz',
      agreedTerms: true
    };

    it('meloloskan data formulir yang lengkap dan valid', () => {
      const res = validateCreatorSubmission(validData);
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors)).toHaveLength(0);
    });

    it('menolak jika nama kreator kosong', () => {
      const res = validateCreatorSubmission({ ...validData, creatorName: '   ' });
      expect(res.isValid).toBe(false);
      expect(res.errors.creatorName).toBeDefined();
    });

    it('menolak jika nomor WhatsApp kosong atau format tidak valid', () => {
      const resEmpty = validateCreatorSubmission({ ...validData, creatorWhatsapp: '' });
      expect(resEmpty.isValid).toBe(false);
      expect(resEmpty.errors.creatorWhatsapp).toContain('wajib diisi');

      const resInvalid = validateCreatorSubmission({ ...validData, creatorWhatsapp: '12345' });
      expect(resInvalid.isValid).toBe(false);
      expect(resInvalid.errors.creatorWhatsapp).toContain('Format WhatsApp');
    });

    it('menolak jika format email salah saat diisi', () => {
      const resInvalidEmail = validateCreatorSubmission({ ...validData, creatorEmail: 'bukan-email' });
      expect(resInvalidEmail.isValid).toBe(false);
      expect(resInvalidEmail.errors.creatorEmail).toContain('Format email');

      // Tapi jika email dibiarkan kosong (karena opsional), tetap valid
      const resEmptyEmail = validateCreatorSubmission({ ...validData, creatorEmail: '' });
      expect(resEmptyEmail.isValid).toBe(true);
    });

    it('menolak jika tautan Google Drive tidak diawali http:// atau https://', () => {
      const resInvalidLink = validateCreatorSubmission({ ...validData, driveLink: 'drive.google.com/xxx' });
      expect(resInvalidLink.isValid).toBe(false);
      expect(resInvalidLink.errors.driveLink).toContain('http:// atau https://');
    });

    it('menolak jika belum mencentang persetujuan hak cipta', () => {
      const resUnagreed = validateCreatorSubmission({ ...validData, agreedTerms: false });
      expect(resUnagreed.isValid).toBe(false);
      expect(resUnagreed.errors.agreedTerms).toContain('pernyataan keaslian karya');
    });
  });

  describe('generateCreatorSubmissionWaText & generateCreatorSubmissionWaUrl', () => {
    it('membuat naskah submission kurasi WhatsApp dengan rapi', () => {
      const text = generateCreatorSubmissionWaText({
        creatorName: 'Arif Desain',
        creatorWhatsapp: '081298765432',
        socialHandle: '@arifdesain_studio',
        designTitle: 'Urban Coffee Warrior',
        nicheCategory: '☕ Kopi & Kafe',
        driveLink: 'https://drive.google.com/file/d/abc/view'
      });

      expect(text).toContain('Kurator TeeStock');
      expect(text).toContain('Arif Desain');
      expect(text).toContain('081298765432');
      expect(text).toContain('@arifdesain_studio');
      expect(text).toContain('Urban Coffee Warrior');
      expect(text).toContain('☕ Kopi & Kafe');
      expect(text).toContain('New States Apparel (NSA)');
    });

    it('membuat tautan wa.me dengan nomor toko yang tersanitasi', () => {
      const url = generateCreatorSubmissionWaUrl('0852-2027-4968', {
        creatorName: 'Maya Art',
        designTitle: 'Botanical Fern'
      });

      expect(url).toContain('https://wa.me/6285220274968?text=');
      expect(url).toContain(encodeURIComponent('Maya Art'));
      expect(url).toContain(encodeURIComponent('Botanical Fern'));
    });
  });
});
