import { describe, it, expect } from 'vitest';
import {
  GARMENT_WEIGHT_TABLE,
  getItemWeightGrams,
  calculateOrderWeight,
  calculateBillableWeightKg,
  calculateShippingFee,
  AVAILABLE_COURIERS
} from '../shippingApi';

describe('Layanan Kalkulasi Pengiriman Berbasis Berat (shippingApi)', () => {
  describe('Gramasi Satuan Garmen (getItemWeightGrams)', () => {
    it('mengidentifikasi bobot 180g untuk NSA Softstyle 30s (TS-BLK-3600)', () => {
      expect(getItemWeightGrams({ sku: 'TS-BLK-3600' })).toBe(180);
      expect(getItemWeightGrams({ garment: 'NSA Softstyle 30s' })).toBe(180);
    });

    it('mengidentifikasi bobot 220g untuk NSA Heavyweight 24s (TS-BLK-7200)', () => {
      expect(getItemWeightGrams({ sku: 'TS-BLK-7200' })).toBe(220);
      expect(getItemWeightGrams({ garment: 'NSA Heavyweight 24s' })).toBe(220);
    });

    it('mengidentifikasi bobot 550g untuk NSA Hoodie Fleece', () => {
      expect(getItemWeightGrams({ garment: 'NSA Hoodie Fleece 9500' })).toBe(550);
    });

    it('mengidentifikasi bobot 280g untuk Long Sleeve', () => {
      expect(getItemWeightGrams({ garment: 'NSA Long Sleeve 30s' })).toBe(280);
    });

    it('memberikan nilai fallback 200g untuk kaos tanpa spesifikasi', () => {
      expect(getItemWeightGrams({})).toBe(200);
      expect(getItemWeightGrams(null)).toBe(200);
    });
  });

  describe('Aturan Berat Koli Ekspedisi (calculateBillableWeightKg)', () => {
    it('menghitung 1 kg untuk pesanan 1 kaos (kurang dari 1.000 gram)', () => {
      expect(calculateBillableWeightKg(220)).toBe(1);
      expect(calculateBillableWeightKg(1000)).toBe(1);
    });

    it('menerapkan toleransi ekspedisi nasional 1.200 gram (tetap dihitung 1 kg)', () => {
      expect(calculateBillableWeightKg(1200)).toBe(1);
    });

    it('membulatkan ke 2 kg begitu berat melebihi batas toleransi 1.200 gram', () => {
      expect(calculateBillableWeightKg(1201)).toBe(2);
      expect(calculateBillableWeightKg(1500)).toBe(2);
      expect(calculateBillableWeightKg(2200)).toBe(2);
    });

    it('membulatkan ke 3 kg untuk pesanan di atas 2.200 gram', () => {
      expect(calculateBillableWeightKg(2201)).toBe(3);
      expect(calculateBillableWeightKg(3000)).toBe(3);
    });

    it('mengembalikan 0 untuk berat 0 atau negatif', () => {
      expect(calculateBillableWeightKg(0)).toBe(0);
      expect(calculateBillableWeightKg(-10)).toBe(0);
    });
  });

  describe('Total Berat Keranjang (calculateOrderWeight)', () => {
    it('mengembalikan 0 jika keranjang kosong', () => {
      const result = calculateOrderWeight([]);
      expect(result.actualWeightGrams).toBe(0);
      expect(result.billableWeightKg).toBe(0);
    });

    it('menambahkan kemasan polymailer (30g) ke total berat belanjaan', () => {
      const cart = [
        { sku: 'TS-BLK-7200', qty: 2 } // 2 x 220g = 440g
      ];
      const result = calculateOrderWeight(cart);
      expect(result.totalItemsGrams).toBe(440);
      expect(result.packagingGrams).toBe(30);
      expect(result.actualWeightGrams).toBe(470);
      expect(result.billableWeightKg).toBe(1);
    });

    it('menghitung berat pesanan lusinan (12 pcs) secara akurat', () => {
      const cart = [
        { sku: 'TS-BLK-7200', qty: 12 } // 12 x 220g = 2.640g + 30g = 2.670g
      ];
      const result = calculateOrderWeight(cart);
      expect(result.actualWeightGrams).toBe(2670);
      expect(result.billableWeightKg).toBe(3); // 2.670g > 2.200g => 3 kg
    });
  });

  describe('Kalkulasi Tarif Dinamis (calculateShippingFee)', () => {
    it('menghitung ongkir zona Jawa Tengah/Timur (Rp 15.000) untuk pesanan standar 1 kg', () => {
      const cart = [{ sku: 'TS-BLK-7200', qty: 1 }];
      const result = calculateShippingFee({
        zoneId: 'jawa_lainnya',
        cartItems: cart,
        courierName: 'J&T Express'
      });

      expect(result.shippingFee).toBe(15000);
      expect(result.billableWeightKg).toBe(1);
      expect(result.isOverweight).toBe(false);
    });

    it('melipatgandakan tarif ongkir secara proporsional untuk pesanan multi-item >1.2kg (mencegah margin leak)', () => {
      const cart = [{ sku: 'TS-BLK-7200', qty: 6 }]; // 6 x 220g + 30g = 1.350g => 2 kg
      const result = calculateShippingFee({
        zoneId: 'jawa_lainnya',
        cartItems: cart,
        courierName: 'J&T Express'
      });

      // 15.000 x 2 kg = Rp 30.000
      expect(result.billableWeightKg).toBe(2);
      expect(result.shippingFee).toBe(30000);
      expect(result.isOverweight).toBe(true);
    });

    it('menerapkan multiplier kurir (JNE 1.05)', () => {
      const cart = [{ sku: 'TS-BLK-7200', qty: 1 }];
      const result = calculateShippingFee({
        zoneId: 'jabodetabek_jabar', // base rate 10.000
        cartItems: cart,
        courierName: 'JNE Reguler'
      });

      // 10.000 x 1 x 1.05 = 10.500
      expect(result.shippingFee).toBe(10500);
      expect(result.courierName).toBe('JNE Reguler');
    });
  });
});
