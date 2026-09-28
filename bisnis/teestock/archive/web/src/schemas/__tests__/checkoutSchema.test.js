import { describe, it, expect } from 'vitest';
import { checkoutSchema, customOrderSchema, indonesianPhoneRegex } from '../checkoutSchema';

describe('Checkout & Order Validation Schemas', () => {
  describe('indonesianPhoneRegex', () => {
    it('menerima nomor HP Indonesia yang valid', () => {
      expect(indonesianPhoneRegex.test('08123456789')).toBe(true);
      expect(indonesianPhoneRegex.test('085220274968')).toBe(true);
      expect(indonesianPhoneRegex.test('628123456789')).toBe(true);
      expect(indonesianPhoneRegex.test('+6281234567890')).toBe(true);
    });

    it('menolak nomor telepon rumah atau format tidak valid', () => {
      expect(indonesianPhoneRegex.test('0211234567')).toBe(false); // Telepon rumah Jakarta
      expect(indonesianPhoneRegex.test('0812')).toBe(false);        // Kurang digit
      expect(indonesianPhoneRegex.test('abc123456')).toBe(false);    // Huruf
      expect(indonesianPhoneRegex.test('1234567890')).toBe(false);   // Tanpa 08 / 628
    });
  });

  describe('checkoutSchema', () => {
    const validPayload = {
      customerName: 'Budi Santoso',
      phone: '081234567890',
      city: 'Bandung',
      subdistrict: 'Coblong',
      address: 'Jl. Dago No. 120, RT 02/05',
      shippingZone: 'jawa_lainnya',
      courier: 'J&T Express'
    };

    it('memvalidasi payload lengkap dengan sukses', () => {
      const result = checkoutSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.customerName).toBe('Budi Santoso');
        expect(result.data.shippingZone).toBe('jawa_lainnya');
      }
    });

    it('menolak jika nama penerima kurang dari 3 karakter', () => {
      const result = checkoutSchema.safeParse({ ...validPayload, customerName: 'Bo' });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('minimal 3 karakter');
    });

    it('menolak nomor WhatsApp yang salah', () => {
      const result = checkoutSchema.safeParse({ ...validPayload, phone: '0812' });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('Nomor WhatsApp tidak valid');
    });

    it('menolak alamat yang terlalu pendek', () => {
      const result = checkoutSchema.safeParse({ ...validPayload, address: 'Rumah' });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('minimal 8 karakter');
    });
  });

  describe('customOrderSchema', () => {
    it('memvalidasi order custom yang benar', () => {
      const result = customOrderSchema.safeParse({
        name: 'Siti Rahma',
        phone: '085220274968',
        city: 'Surabaya',
        qty: 12
      });
      expect(result.success).toBe(true);
    });

    it('menolak order custom dengan kuantitas kurang dari 1', () => {
      const result = customOrderSchema.safeParse({
        name: 'Siti Rahma',
        phone: '085220274968',
        city: 'Surabaya',
        qty: 0
      });
      expect(result.success).toBe(false);
    });
  });
});
