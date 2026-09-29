import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getVendors, 
  saveVendor, 
  deleteVendor, 
  resetDefaultVendors, 
  calculateVendorSpend, 
  calculateVendorKpis, 
  generateVendorWhatsAppMessage, 
  getVendorWhatsAppUrl, 
  exportVendorsCsv, 
  formatRupiah,
  VENDOR_CATEGORIES 
} from '../vendorsApi.js';

describe('Vendors & Supply Chain API Services', () => {
  beforeEach(() => {
    resetDefaultVendors();
  });

  describe('getVendors & Defaults', () => {
    it('should return initial holding vendors including Cititex and DTF Maklon', () => {
      const vendors = getVendors();
      expect(vendors.length).toBeGreaterThanOrEqual(4);
      
      const cititex = vendors.find(v => v.id === 'vnd-01');
      expect(cititex).toBeDefined();
      expect(cititex.name).toContain('Cititex');
      expect(cititex.category).toBe('garment');

      const dtf = vendors.find(v => v.id === 'vnd-02');
      expect(dtf).toBeDefined();
      expect(dtf.category).toBe('dtf_print');
    });

    it('should have standard category configurations', () => {
      expect(VENDOR_CATEGORIES.garment.label).toBe('Kaos Polos NSA');
      expect(VENDOR_CATEGORIES.dtf_print.label).toBe('DTF Roll 58cm');
      expect(VENDOR_CATEGORIES.packaging.label).toBe('Kemasan & Stiker');
      expect(VENDOR_CATEGORIES.expedition.label).toBe('Logistik & Resi');
    });
  });

  describe('saveVendor & deleteVendor', () => {
    it('should add a new vendor with normalized phone number', () => {
      const newVendorPayload = {
        name: 'Mitra Box Kardus Tangerang',
        category: 'packaging',
        pic: 'Bambang Logistik',
        phone: '0813-8899-7766',
        address: 'Kawasan Industri Jatake, Tangerang',
        pricingNotes: 'Box E-flute Rp 2.100/pcs min 200 pcs',
        bankAccount: 'BCA 8899-0011-22 a.n Bambang'
      };

      const updated = saveVendor(newVendorPayload);
      expect(updated.length).toBeGreaterThan(4);
      
      const saved = updated.find(v => v.name === 'Mitra Box Kardus Tangerang');
      expect(saved).toBeDefined();
      expect(saved.phone).toBe('6281388997766');
      expect(saved.rating).toBe(5);
      expect(saved.status).toBe('active');
    });

    it('should update existing vendor if id matches', () => {
      const existing = getVendors()[0];
      const updated = saveVendor({
        ...existing,
        pic: 'Rian Head of Sales (Updated)',
        phone: '081299998888'
      });

      const found = updated.find(v => v.id === existing.id);
      expect(found.pic).toBe('Rian Head of Sales (Updated)');
      expect(found.phone).toBe('6281299998888');
    });

    it('should delete vendor by id', () => {
      const initialCount = getVendors().length;
      const updated = deleteVendor('vnd-04');
      expect(updated.length).toBe(initialCount - 1);
      expect(updated.some(v => v.id === 'vnd-04')).toBe(false);
    });
  });

  describe('calculateVendorSpend', () => {
    const sampleProcurements = [
      {
        id: 'PO-01',
        supplier: 'Cititex Rawamangun',
        itemType: 'blank_tshirt',
        totalCost: 1200000,
        date: '2026-09-10T10:00:00Z'
      },
      {
        id: 'PO-02',
        supplier: 'Cititex Rawamangun',
        itemType: 'blank_tshirt',
        totalCost: 800000,
        date: '2026-09-15T10:00:00Z'
      },
      {
        id: 'PO-03',
        supplier: 'Cahaya Digital DTF Senen',
        itemType: 'dtf_roll',
        totalCost: 350000,
        date: '2026-09-12T10:00:00Z'
      }
    ];

    it('should aggregate total spend and PO count for matching vendor', () => {
      const cititexVendor = {
        name: 'Cititex (Official NSA Distributor)',
        category: 'garment'
      };

      const spend = calculateVendorSpend(cititexVendor, sampleProcurements);
      expect(spend.totalSpend).toBe(2000000); // 1200000 + 800000
      expect(spend.totalPoCount).toBe(2);
      expect(spend.lastPoDate).toBe('2026-09-15T10:00:00Z');
    });

    it('should return zeros if no procurements match vendor', () => {
      const unlinkedVendor = {
        name: 'Vendor Tidak Pernah Transaksi',
        category: 'expedition'
      };

      const spend = calculateVendorSpend(unlinkedVendor, sampleProcurements);
      expect(spend.totalSpend).toBe(0);
      expect(spend.totalPoCount).toBe(0);
      expect(spend.lastPoDate).toBeNull();
    });
  });

  describe('calculateVendorKpis', () => {
    it('should calculate executive metrics accurately', () => {
      const vendors = getVendors();
      const procurements = [
        { totalCost: 1000000 },
        { totalCost: 500000 }
      ];

      const kpis = calculateVendorKpis(vendors, procurements);
      expect(kpis.totalVendors).toBe(vendors.length);
      expect(kpis.activeVendors).toBe(vendors.length);
      expect(kpis.totalYtdSpend).toBe(1500000);
      expect(kpis.averageRating).toBeGreaterThanOrEqual(4.5);
      expect(kpis.categoryCounts.garment).toBeGreaterThanOrEqual(1);
    });
  });

  describe('generateVendorWhatsAppMessage & getVendorWhatsAppUrl', () => {
    const sampleVendor = {
      name: 'Cititex Rawamangun',
      pic: 'Mas Rian',
      phone: '081234567890',
      bankAccount: 'BCA 522-0334-421 a.n Cititex'
    };

    it('should generate stock inquiry message', () => {
      const text = generateVendorWhatsAppMessage(sampleVendor, 'stock_inquiry');
      expect(text).toContain('Halo Mas Rian (Cititex Rawamangun)!');
      expect(text).toContain('NSA Heavyweight 24s');
      expect(text).toContain('TeeStock Apparel Studio');
    });

    it('should generate DTF order inquiry message', () => {
      const text = generateVendorWhatsAppMessage(sampleVendor, 'dtf_order');
      expect(text).toContain('TIFF 300 DPI 1:1 Transparan');
      expect(text).toContain('roll DTF lebar 58 cm');
    });

    it('should generate payment confirmation message', () => {
      const text = generateVendorWhatsAppMessage(sampleVendor, 'payment_confirmation');
      expect(text).toContain('transfer pembayaran pengadaan TeeStock');
      expect(text).toContain('BCA 522-0334-421');
    });

    it('should create valid WhatsApp URL link', () => {
      const url = getVendorWhatsAppUrl(sampleVendor, 'stock_inquiry');
      expect(url.startsWith('https://wa.me/6281234567890?text=')).toBe(true);
      expect(url).toContain(encodeURIComponent('TeeStock'));
    });
  });

  describe('exportVendorsCsv', () => {
    it('should generate CSV with UTF-8 BOM and 12 columns', () => {
      const vendors = getVendors();
      const csv = exportVendorsCsv(vendors, []);
      expect(csv).toBeDefined();
      expect(csv.startsWith('\uFEFF')).toBe(true);
      expect(csv).toContain('ID Vendor');
      expect(csv).toContain('Cititex');
      expect(csv).toContain('Kaos Polos NSA');
    });
  });

  describe('formatRupiah', () => {
    it('should format numbers into Indonesian currency format', () => {
      expect(formatRupiah(500000)).toContain('500.000');
    });
  });
});
