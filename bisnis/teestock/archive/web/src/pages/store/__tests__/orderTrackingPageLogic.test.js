import { describe, it, expect } from 'vitest';
import {
  TRACKING_STEPS,
  resolveTimelineStep,
  verifyPhoneLast4Digits,
  maskPhoneNumber,
  getTrackingCourierUrl,
  generateOrderTrackingWaUrl
} from '../OrderTrackingPage';

describe('OrderTrackingPage Logic & State Machine Engine (Checkpoint C-05)', () => {
  describe('TRACKING_STEPS Constant', () => {
    it('memiliki 5 tahapan standar produksi studio DTF dan fulfillment', () => {
      expect(TRACKING_STEPS).toHaveLength(5);
      expect(TRACKING_STEPS[0].id).toBe('pending');
      expect(TRACKING_STEPS[1].id).toBe('dtf');
      expect(TRACKING_STEPS[2].id).toBe('press');
      expect(TRACKING_STEPS[3].id).toBe('pack');
      expect(TRACKING_STEPS[4].id).toBe('shipped');
    });
  });

  describe('resolveTimelineStep (Status Normalization & Resolver)', () => {
    it('memetakan status pending/pending_payment ke Tahap 0', () => {
      const res1 = resolveTimelineStep('pending');
      expect(res1.stepIndex).toBe(0);
      expect(res1.stepId).toBe('pending');
      expect(res1.isCompleted).toBe(false);

      const res2 = resolveTimelineStep('pending_payment');
      expect(res2.stepIndex).toBe(0);
      expect(res2.stepId).toBe('pending');

      const res3 = resolveTimelineStep(null);
      expect(res3.stepIndex).toBe(0);
    });

    it('memetakan status cetak DTF ke Tahap 1', () => {
      const res1 = resolveTimelineStep('dtf');
      expect(res1.stepIndex).toBe(1);
      expect(res1.stepId).toBe('dtf');

      const res2 = resolveTimelineStep('dtf_printing');
      expect(res2.stepIndex).toBe(1);

      const res3 = resolveTimelineStep('cetak');
      expect(res3.stepIndex).toBe(1);
    });

    it('memetakan status heat press 155°C ke Tahap 2', () => {
      const res1 = resolveTimelineStep('press');
      expect(res1.stepIndex).toBe(2);
      expect(res1.stepId).toBe('press');

      const res2 = resolveTimelineStep('heat_press');
      expect(res2.stepIndex).toBe(2);

      const res3 = resolveTimelineStep('sablon');
      expect(res3.stepIndex).toBe(2);
    });

    it('memetakan status QC & packing ke Tahap 3', () => {
      const res1 = resolveTimelineStep('pack');
      expect(res1.stepIndex).toBe(3);
      expect(res1.stepId).toBe('pack');

      const res2 = resolveTimelineStep('qc');
      expect(res2.stepIndex).toBe(3);

      const res3 = resolveTimelineStep('dikemas');
      expect(res3.stepIndex).toBe(3);
    });

    it('memetakan status pengiriman/selesai ke Tahap 4 (Selesai)', () => {
      const res1 = resolveTimelineStep('shipped');
      expect(res1.stepIndex).toBe(4);
      expect(res1.stepId).toBe('shipped');
      expect(res1.isCompleted).toBe(true);

      const res2 = resolveTimelineStep('completed');
      expect(res2.stepIndex).toBe(4);
      expect(res2.isCompleted).toBe(true);
      expect(res2.badgeText).toBe('Pesanan Selesai');

      const res3 = resolveTimelineStep('selesai');
      expect(res3.stepIndex).toBe(4);
      expect(res3.isCompleted).toBe(true);
    });
  });

  describe('verifyPhoneLast4Digits (Privacy Guardrail)', () => {
    it('memvalidasi kecocokan 4 digit terakhir nomor telepon pemesan', () => {
      expect(verifyPhoneLast4Digits('081234567890', '7890')).toBe(true);
      expect(verifyPhoneLast4Digits('+62 852-2027-4968', '4968')).toBe(true);
      expect(verifyPhoneLast4Digits('085220274968', '4968')).toBe(true);
    });

    it('menolak jika 4 digit tidak cocok', () => {
      expect(verifyPhoneLast4Digits('081234567890', '1234')).toBe(false);
      expect(verifyPhoneLast4Digits('085220274968', '0000')).toBe(false);
    });

    it('menolak input yang tidak valid atau kurang dari 4 digit', () => {
      expect(verifyPhoneLast4Digits('081234567890', '789')).toBe(false);
      expect(verifyPhoneLast4Digits('081234567890', '')).toBe(false);
      expect(verifyPhoneLast4Digits(null, '7890')).toBe(false);
    });
  });

  describe('maskPhoneNumber', () => {
    it('menyembunyikan digit tengah nomor HP untuk menjaga kerahasiaan PII', () => {
      expect(maskPhoneNumber('081234567890')).toBe('0812****7890');
      expect(maskPhoneNumber('085220274968')).toBe('0852****4968');
    });

    it('mengembalikan nilai aman untuk string kosong atau nomor terlalu pendek', () => {
      expect(maskPhoneNumber('')).toBe('');
      expect(maskPhoneNumber('0812')).toBe('0812');
      expect(maskPhoneNumber(null)).toBe('');
    });
  });

  describe('getTrackingCourierUrl (Direct Tracking Links)', () => {
    it('mengarahkan pesanan J&T ke portal resmi jet.co.id', () => {
      const url = getTrackingCourierUrl('J&T Express', 'JT1234567890');
      expect(url).toBe('https://www.jet.co.id/track');
    });

    it('mengarahkan pesanan SiCepat ke portal sicepat.com', () => {
      const url = getTrackingCourierUrl('SiCepat REG', '0012345678');
      expect(url).toBe('https://www.sicepat.com/checkAwb');
    });

    it('mengarahkan pesanan JNE ke portal jne.co.id', () => {
      const url = getTrackingCourierUrl('JNE Reguler', 'JNE123456789');
      expect(url).toBe('https://www.jne.co.id/id/tracking/trace');
    });

    it('mengarahkan pesanan Anteraja ke portal anteraja.id', () => {
      const url = getTrackingCourierUrl('Anteraja Regular', '10001234567');
      expect(url).toBe('https://anteraja.id/tracking');
    });

    it('menggunakan fallback universal cekresi.com untuk ekspedisi lain', () => {
      const url = getTrackingCourierUrl('Pos Indonesia', 'POS987654');
      expect(url).toContain('https://cekresi.com/?noresi=POS987654');
    });

    it('mengembalikan null jika nomor resi belum tersedia', () => {
      expect(getTrackingCourierUrl('J&T Express', null)).toBeNull();
      expect(getTrackingCourierUrl('J&T Express', '')).toBeNull();
    });
  });

  describe('generateOrderTrackingWaUrl', () => {
    it('menghasilkan tautan WhatsApp resmi dengan parameter pesanan lengkap', () => {
      const waUrl = generateOrderTrackingWaUrl({
        orderId: 'TS-260918-A7FC89',
        customerName: 'Rizky',
        totalTransfer: 245382,
        uniqueCode: 382,
        storeWhatsapp: '085220274968'
      });

      expect(waUrl).toContain('https://wa.me/6285220274968');
      expect(waUrl).toContain('TS-260918-A7FC89');
      expect(waUrl).toContain('Rizky');
      expect(decodeURIComponent(waUrl)).toContain('+382');
    });
  });
});
