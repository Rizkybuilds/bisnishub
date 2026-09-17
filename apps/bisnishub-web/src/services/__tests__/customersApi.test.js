import { describe, it, expect, vi } from 'vitest';
import { 
  normalizePhoneNumber, 
  getDaysSinceDate, 
  aggregateCustomersFromOrders, 
  calculateCustomerKpis, 
  generateCustomerWhatsAppText, 
  getCustomerWhatsAppUrl,
  exportCustomersCsv,
  formatRupiah 
} from '../customersApi.js';

describe('Customers & CRM API Services', () => {
  describe('normalizePhoneNumber', () => {
    it('should normalize Indonesian 08xx phone numbers to 628xx', () => {
      expect(normalizePhoneNumber('081234567890')).toBe('6281234567890');
      expect(normalizePhoneNumber('0857-1122-3344')).toBe('6285711223344');
    });

    it('should normalize international +628xx and 628xx properly', () => {
      expect(normalizePhoneNumber('+62 812-3456-7890')).toBe('6281234567890');
      expect(normalizePhoneNumber('6281234567890')).toBe('6281234567890');
    });

    it('should prefix bare 8xx numbers with 62', () => {
      expect(normalizePhoneNumber('81234567890')).toBe('6281234567890');
    });

    it('should return empty string for invalid or empty inputs', () => {
      expect(normalizePhoneNumber('')).toBe('');
      expect(normalizePhoneNumber(null)).toBe('');
      expect(normalizePhoneNumber(undefined)).toBe('');
      expect(normalizePhoneNumber('abc-def')).toBe('');
    });
  });

  describe('getDaysSinceDate', () => {
    it('should calculate correct number of days passed', () => {
      const refDate = new Date('2026-09-18T12:00:00Z');
      const orderDate = '2026-09-08T12:00:00Z'; // 10 days earlier
      expect(getDaysSinceDate(orderDate, refDate)).toBe(10);
    });

    it('should return 0 for same day or future dates', () => {
      const refDate = new Date('2026-09-18T12:00:00Z');
      expect(getDaysSinceDate('2026-09-18T12:00:00Z', refDate)).toBe(0);
      expect(getDaysSinceDate('2026-09-20T12:00:00Z', refDate)).toBe(0);
    });

    it('should return 999 for invalid date string', () => {
      expect(getDaysSinceDate('invalid-date')).toBe(999);
      expect(getDaysSinceDate(null)).toBe(999);
    });
  });

  describe('aggregateCustomersFromOrders', () => {
    const fixedNow = new Date('2026-09-18T12:00:00Z');

    it('should return empty array when given empty orders', () => {
      expect(aggregateCustomersFromOrders([])).toEqual([]);
      expect(aggregateCustomersFromOrders(null)).toEqual([]);
    });

    it('should correctly aggregate single customer order', () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer_name: 'Budi Santoso',
          customer_phone: '081234567890',
          customer_city: 'Jakarta Selatan',
          customer_address: 'Jl. Melawai No. 10',
          total_amount: 110000,
          qty: 1,
          status: 'shipped',
          channel: 'web',
          garment: 'NSA Heavyweight 24s',
          created_at: '2026-09-10T10:00:00Z'
        }
      ];

      const customers = aggregateCustomersFromOrders(mockOrders, fixedNow);
      expect(customers).toHaveLength(1);

      const cust = customers[0];
      expect(cust.name).toBe('Budi Santoso');
      expect(cust.phone).toBe('6281234567890');
      expect(cust.city).toBe('Jakarta Selatan');
      expect(cust.totalOrders).toBe(1);
      expect(cust.completedOrders).toBe(1);
      expect(cust.totalPcs).toBe(1);
      expect(cust.ltv).toBe(110000);
      expect(cust.aov).toBe(110000);
      expect(cust.daysSinceLastOrder).toBe(8);
      expect(cust.tier).toBe('new'); // <= 30 days & completedOrders <= 1
    });

    it('should group multiple orders with the same phone into one customer with cumulative LTV', () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: 'Ahmad Dani',
          phone: '0811998877',
          city: 'Bandung',
          price: 110000,
          qty: 1,
          status: 'shipped',
          channel: 'web',
          date: '2026-08-01T10:00:00Z'
        },
        {
          id: 'ORD-002',
          customer: 'Ahmad Dani',
          phone: '+62 811-9988-77',
          city: 'Bandung',
          price: 220000,
          qty: 2,
          status: 'shipped',
          channel: 'web',
          date: '2026-09-15T10:00:00Z'
        }
      ];

      const customers = aggregateCustomersFromOrders(mockOrders, fixedNow);
      expect(customers).toHaveLength(1);

      const cust = customers[0];
      expect(cust.totalOrders).toBe(2);
      expect(cust.completedOrders).toBe(2);
      expect(cust.totalPcs).toBe(3);
      expect(cust.ltv).toBe(330000);
      expect(cust.aov).toBe(165000); // 330000 / 2
      expect(cust.tier).toBe('vip'); // LTV >= 300,000
      expect(cust.tags).toContain('Repeat Buyer');
      expect(cust.tags).toContain('High LTV');
      expect(cust.orders).toHaveLength(2);
    });

    it('should qualify for Reseller tier when ordering >= 12 pcs or channel is reseller', () => {
      const mockOrders = [
        {
          id: 'ORD-RES-01',
          customer: 'Toko Sablon Jaya',
          phone: '0855667788',
          city: 'Surabaya',
          price: 950000,
          qty: 12,
          status: 'press',
          channel: 'reseller',
          date: '2026-09-12T10:00:00Z'
        }
      ];

      const customers = aggregateCustomersFromOrders(mockOrders, fixedNow);
      expect(customers[0].tier).toBe('reseller');
      expect(customers[0].tierLabel).toBe('Mitra Reseller/Grosir');
      expect(customers[0].tags).toContain('Reseller B2B');
    });

    it('should qualify for Churn Risk when last order is > 60 days ago', () => {
      const mockOrders = [
        {
          id: 'ORD-OLD-01',
          customer: 'Siti Rahma',
          phone: '0877112233',
          city: 'Yogyakarta',
          price: 99000,
          qty: 1,
          status: 'shipped',
          channel: 'web',
          date: '2026-06-01T10:00:00Z' // > 100 days ago from 2026-09-18
        }
      ];

      const customers = aggregateCustomersFromOrders(mockOrders, fixedNow);
      expect(customers[0].tier).toBe('churn_risk');
      expect(customers[0].tierLabel).toBe('Perhatian / Churn Risk');
      expect(customers[0].tags).toContain('Tidak Aktif >60 Hari');
    });

    it('should ignore cancelled orders from LTV, totalPcs, and completedOrders count', () => {
      const mockOrders = [
        {
          id: 'ORD-001',
          customer: 'Riko Pratama',
          phone: '0899887766',
          price: 110000,
          qty: 1,
          status: 'shipped',
          date: '2026-09-01T10:00:00Z'
        },
        {
          id: 'ORD-002',
          customer: 'Riko Pratama',
          phone: '0899887766',
          price: 350000,
          qty: 3,
          status: 'cancelled', // Cancelled
          date: '2026-09-05T10:00:00Z'
        }
      ];

      const customers = aggregateCustomersFromOrders(mockOrders, fixedNow);
      const cust = customers[0];
      expect(cust.totalOrders).toBe(2);
      expect(cust.completedOrders).toBe(1);
      expect(cust.ltv).toBe(110000); // Only non-cancelled included
      expect(cust.totalPcs).toBe(1);
    });
  });

  describe('calculateCustomerKpis', () => {
    it('should return zeros for empty customer array', () => {
      const kpis = calculateCustomerKpis([]);
      expect(kpis.totalCustomers).toBe(0);
      expect(kpis.totalLtv).toBe(0);
      expect(kpis.overallAov).toBe(0);
      expect(kpis.vipAndResellerCount).toBe(0);
    });

    it('should correctly calculate aggregate executive metrics', () => {
      const mockCustomers = [
        { tier: 'reseller', ltv: 1200000, completedOrders: 2 },
        { tier: 'vip', ltv: 450000, completedOrders: 3 },
        { tier: 'new', ltv: 110000, completedOrders: 1 },
        { tier: 'churn_risk', ltv: 99000, completedOrders: 1 }
      ];

      const kpis = calculateCustomerKpis(mockCustomers);
      expect(kpis.totalCustomers).toBe(4);
      expect(kpis.totalLtv).toBe(1859000); // 1200000 + 450000 + 110000 + 99000
      expect(kpis.resellerCount).toBe(1);
      expect(kpis.vipCount).toBe(1);
      expect(kpis.vipAndResellerCount).toBe(2);
      expect(kpis.churnRiskCount).toBe(1);
      expect(kpis.newCustomerCount).toBe(1);
      // Total completed orders = 2 + 3 + 1 + 1 = 7. Overall AOV = 1859000 / 7 = 265571
      expect(kpis.overallAov).toBe(265571);
      // Repeat customers: 2 have >= 2 orders (reseller and vip). Repeat rate = 2/4 = 50%
      expect(kpis.repeatCustomerRate).toBe(50);
    });
  });

  describe('generateCustomerWhatsAppText & getCustomerWhatsAppUrl', () => {
    const sampleCustomer = {
      name: 'Rizky Founder',
      phone: '6281234567890',
      lastOrderDate: '2026-09-15T00:00:00Z',
      orders: [{ id: 'TS-2026-0099' }]
    };

    it('should generate Unboxing Care Guide text with NSA washing tips and voucher', () => {
      const text = generateCustomerWhatsAppText(sampleCustomer, 'unboxing_care');
      expect(text).toContain('Halo Kak Rizky Founder!');
      expect(text).toContain('TS-2026-0099');
      expect(text).toContain('Tips Perawatan Kaos NSA & Sablon DTF');
      expect(text).toContain('VIPREPEAT10');
    });

    it('should generate Reseller Restock text with wholesale offer', () => {
      const text = generateCustomerWhatsAppText(sampleCustomer, 'reseller_restock');
      expect(text).toContain('Mitra Reseller TeeStock');
      expect(text).toContain('Minimal order 12 pcs');
    });

    it('should generate VIP Early Access text with exclusive voucher', () => {
      const text = generateCustomerWhatsAppText(sampleCustomer, 'vip_early_access');
      expect(text).toContain('Akses Eksklusif Awal (VIP Early Access)');
      expect(text).toContain('VIPDROP15');
    });

    it('should generate Churn Reactivation text with win-back incentive', () => {
      const text = generateCustomerWhatsAppText(sampleCustomer, 'churn_reactivation');
      expect(text).toContain('Kami kangen bikin kaos bareng Kakak!');
      expect(text).toContain('BACKTOSTYLE');
    });

    it('should create valid WhatsApp URL with encoded message', () => {
      const url = getCustomerWhatsAppUrl(sampleCustomer, 'unboxing_care');
      expect(url.startsWith('https://wa.me/6281234567890?text=')).toBe(true);
      expect(url).toContain(encodeURIComponent('VIPREPEAT10'));
    });
  });

  describe('formatRupiah', () => {
    it('should format numbers into Indonesian Rupiah format', () => {
      const formatted = formatRupiah(150000);
      expect(formatted).toContain('150.000');
    });
  });

  describe('exportCustomersCsv', () => {
    it('should export valid CSV content with 11 columns and UTF-8 BOM', () => {
      const mockCustomers = [
        {
          id: 'cust-6281234567890',
          name: 'Dimas Anggara',
          phone: '6281234567890',
          city: 'Jakarta Barat',
          tierLabel: 'VIP Ritel',
          completedOrders: 3,
          totalPcs: 4,
          ltv: 440000,
          aov: 146667,
          lastOrderDate: '2026-09-14T10:00:00Z',
          daysSinceLastOrder: 4
        }
      ];

      const csv = exportCustomersCsv(mockCustomers);
      expect(csv).toBeDefined();
      expect(csv.startsWith('\uFEFF')).toBe(true);
      expect(csv).toContain('ID Pelanggan');
      expect(csv).toContain('Dimas Anggara');
      expect(csv).toContain('6281234567890');
      expect(csv).toContain('440000');
    });
  });
});
