import { describe, it, expect } from 'vitest';
import {
  GARMENT_WEIGHT_TABLE,
  getItemWeightGrams,
  calculateOrderWeight,
  calculateBillableWeightKg,
  calculateShippingFee,
  AVAILABLE_COURIERS,
  getAvailableCouriers
} from '../shippingApi';
import { determineFulfillmentOrigin } from '../../utils/garmentStockRouting';


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

    it('menghitung tarif flat untuk GoSend / Grab Instant lokal satelit', () => {
      const cart = [{ sku: 'TS-BLK-3600', qty: 1 }];
      const result = calculateShippingFee({
        zoneId: 'jabodetabek_jabar',
        cartItems: cart,
        courierName: 'GoSend / Grab Instant'
      });

      expect(result.shippingFee).toBe(25000);
      expect(result.eta).toContain('1-2 Jam');
    });
  });

  describe('Smart Multi-Hub Routing & Filter Kurir (determineFulfillmentOrigin & getAvailableCouriers)', () => {
    it('mengarahkan pesanan kaos grafis ke Central Studio Citayam Hub (wajib heat press)', () => {
      const cart = [
        { sku: 'TS-PRO-001', name: 'Commit & Pray', series: 'profesi', qty: 1 }
      ];
      const origin = determineFulfillmentOrigin(cart, 'Bogor', 'Bogor Tengah');
      expect(origin.hub.id).toBe('citayam_studio');
      expect(origin.isExpressHub).toBe(false);
      expect(origin.supportsInstant).toBe(false);
      expect(origin.hub.name).toBe('TeeStock Studio & Print Lab (Citayam Hub)');
    });

    it('mengarahkan pesanan khusus kaos polos tujuan Bogor ke Express Hub Bogor', () => {
      const cart = [
        { sku: 'TS-BLK-3600', name: 'NSA Softstyle 3600', series: 'blank', qty: 2 }
      ];
      const origin = determineFulfillmentOrigin(cart, 'Kota Bogor', 'Bogor Timur');
      expect(origin.hub.id).toBe('bogor_express');
      expect(origin.isExpressHub).toBe(true);
      expect(origin.supportsInstant).toBe(true);
      expect(origin.supportsSameday).toBe(true);
      expect(origin.hub.name).toBe('TeeStock Express Hub (Bogor)');
    });

    it('mengarahkan keranjang campuran (kaos polos + kaos grafis) tetap ke Central Studio Citayam', () => {
      const cart = [
        { sku: 'TS-BLK-3600', name: 'NSA Softstyle 3600', series: 'blank', qty: 1 },
        { sku: 'TS-KOM-001', name: '7 Summits 3000 MDPL', series: 'komunitas', qty: 1 }
      ];
      // Meskipun tujuannya Bogor, karena ada kaos grafis yang butuh press, wajib Citayam Hub!
      const origin = determineFulfillmentOrigin(cart, 'Kota Bogor', 'Bogor Selatan');
      expect(origin.hub.id).toBe('citayam_studio');
      expect(origin.isExpressHub).toBe(false);
    });

    it('mengarahkan pesanan kaos polos tujuan non-Bogor (cth: Surabaya) ke Central Studio Citayam', () => {
      const cart = [
        { sku: 'TS-BLK-7200', name: 'NSA Heavyweight 7200', series: 'blank', qty: 1 }
      ];
      const origin = determineFulfillmentOrigin(cart, 'Surabaya', 'Gubeng');
      expect(origin.hub.id).toBe('citayam_studio');
      expect(origin.isExpressHub).toBe(false);
    });

    it('memfilter opsi kurir instant/sameday hanya ketika Express Hub aktif', () => {
      const regularCouriers = getAvailableCouriers(false);
      expect(regularCouriers.some(c => c.id === 'gosend_instant')).toBe(false);
      expect(regularCouriers.length).toBe(4); // J&T, SiCepat, JNE, AnterAja

      const expressCouriers = getAvailableCouriers(true);
      expect(expressCouriers.some(c => c.id === 'gosend_instant')).toBe(true);
      expect(expressCouriers.some(c => c.id === 'gosend_sameday')).toBe(true);
      expect(expressCouriers.length).toBe(6);
    });
  });
});

