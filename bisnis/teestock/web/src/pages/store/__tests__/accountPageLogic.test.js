import { describe, it, expect } from 'vitest';
import {
  ORDER_STATUS_BADGES,
  validateProfileUpdate,
  formatAccountOrderSummary
} from '../AccountPage';
import { getBioLinks } from '../BioLinkPage';

describe('AccountPage & Global Shell Logic (Checkpoint C-10)', () => {
  describe('ORDER_STATUS_BADGES Constant', () => {
    it('memiliki 6 tahapan status siklus pesanan terstandarisasi', () => {
      expect(ORDER_STATUS_BADGES.pending).toBeDefined();
      expect(ORDER_STATUS_BADGES.dtf).toBeDefined();
      expect(ORDER_STATUS_BADGES.press).toBeDefined();
      expect(ORDER_STATUS_BADGES.pack).toBeDefined();
      expect(ORDER_STATUS_BADGES.shipped).toBeDefined();
      expect(ORDER_STATUS_BADGES.completed).toBeDefined();
    });

    it('setiap badge memiliki label deskriptif, color class, dan step urutan', () => {
      Object.values(ORDER_STATUS_BADGES).forEach(badge => {
        expect(badge.label).toBeDefined();
        expect(badge.color).toBeDefined();
        expect(badge.step).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('validateProfileUpdate (Profile Form Validation)', () => {
    const validProfile = {
      fullName: 'Budi Santoso',
      phone: '081234567890',
      address: 'Jl. Margonda Raya No. 123',
      city: 'Depok',
      postalCode: '16424'
    };

    it('meloloskan data profil yang lengkap dan valid', () => {
      const res = validateProfileUpdate(validProfile);
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors)).toHaveLength(0);
    });

    it('menolak jika nama lengkap kosong', () => {
      const res = validateProfileUpdate({ ...validProfile, fullName: '' });
      expect(res.isValid).toBe(false);
      expect(res.errors.fullName).toContain('wajib diisi');
    });

    it('menolak jika nomor WhatsApp tidak sesuai format Indonesia', () => {
      const resEmpty = validateProfileUpdate({ ...validProfile, phone: '' });
      expect(resEmpty.isValid).toBe(false);
      expect(resEmpty.errors.phone).toContain('wajib diisi');

      const resInvalid = validateProfileUpdate({ ...validProfile, phone: '021-998877' });
      expect(resInvalid.isValid).toBe(false);
      expect(resInvalid.errors.phone).toContain('Format nomor WhatsApp');
    });

    it('menolak jika alamat atau kota kosong', () => {
      const resNoAddress = validateProfileUpdate({ ...validProfile, address: '   ' });
      expect(resNoAddress.isValid).toBe(false);
      expect(resNoAddress.errors.address).toBeDefined();

      const resNoCity = validateProfileUpdate({ ...validProfile, city: '' });
      expect(resNoCity.isValid).toBe(false);
      expect(resNoCity.errors.city).toBeDefined();
    });

    it('memvalidasi kode pos harus 5 digit jika diisi', () => {
      const resInvalidPostal = validateProfileUpdate({ ...validProfile, postalCode: 'ABC12' });
      expect(resInvalidPostal.isValid).toBe(false);
      expect(resInvalidPostal.errors.postalCode).toContain('5 digit angka');

      // Kosong diperbolehkan karena opsional
      const resEmptyPostal = validateProfileUpdate({ ...validProfile, postalCode: '' });
      expect(resEmptyPostal.isValid).toBe(true);
    });
  });

  describe('formatAccountOrderSummary (Order Metrics Engine)', () => {
    it('menghitung statistik pesanan dengan akurat', () => {
      const mockOrders = [
        { id: 'TS-01', status: 'completed', price: 99000 },
        { id: 'TS-02', status: 'shipped', price: 115000 },
        { id: 'TS-03', status: 'press', price: 150000 },
        { id: 'TS-04', status: 'pending', price: 75000 }
      ];

      const summary = formatAccountOrderSummary(mockOrders);
      expect(summary.totalOrders).toBe(4);
      expect(summary.completedOrders).toBe(2); // completed + shipped
      expect(summary.inProgressOrders).toBe(2); // press + pending
      expect(summary.totalSpent).toBe(439000); // 99k + 115k + 150k + 75k
    });

    it('menangani daftar pesanan kosong atau non-array secara elegan', () => {
      const summaryEmpty = formatAccountOrderSummary([]);
      expect(summaryEmpty.totalOrders).toBe(0);
      expect(summaryEmpty.completedOrders).toBe(0);
      expect(summaryEmpty.totalSpent).toBe(0);

      const summaryNull = formatAccountOrderSummary(null);
      expect(summaryNull.totalOrders).toBe(0);
    });
  });

  describe('getBioLinks (Bio Link Configuration Engine)', () => {
    it('menghasilkan 7 tautan resmi storefront dengan UTM tracking', () => {
      const links = getBioLinks({ cleanPhone: '6285220274968', shopeeUrl: 'https://shopee.co.id/teestock.id' });
      expect(links).toHaveLength(7);

      const ids = links.map(l => l.id);
      expect(ids).toContain('drop');
      expect(ids).toContain('katalog');
      expect(ids).toContain('blanks');
      expect(ids).toContain('custom');
      expect(ids).toContain('partner');
      expect(ids).toContain('creator');
      expect(ids).toContain('shopee');
    });

    it('memisahkan rute internal dan tautan eksternal secara tepat', () => {
      const links = getBioLinks();
      const internalLinks = links.filter(l => l.internal);
      const externalLinks = links.filter(l => !l.internal);

      expect(internalLinks.length).toBe(6);
      expect(externalLinks.length).toBe(1); // Shopee
      expect(externalLinks[0].id).toBe('shopee');
      expect(externalLinks[0].href).toContain('shopee.co.id');
    });
  });
});
