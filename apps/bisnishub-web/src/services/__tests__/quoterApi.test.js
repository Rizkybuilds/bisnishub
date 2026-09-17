import { describe, it, expect } from 'vitest';
import { 
  PRINT_POSITIONS, 
  PACKAGING_OPTIONS, 
  VOLUME_TIERS, 
  calculateCustomQuote, 
  generateQuoteWhatsAppText, 
  getQuoteWhatsAppUrl, 
  createKanbanOrderFromQuote, 
  exportQuotationCsv,
  formatRupiah 
} from '../quoterApi.js';

describe('Quoter & WhatsApp Sales API Services', () => {
  describe('Constants Verification', () => {
    it('should have predefined print positions with costs', () => {
      expect(PRINT_POSITIONS.length).toBeGreaterThanOrEqual(8);
      const a3 = PRINT_POSITIONS.find(p => p.id === 'front_a3');
      expect(a3).toBeDefined();
      expect(a3.cost).toBe(12500);
    });

    it('should define volume tiers with progressive discounts', () => {
      expect(VOLUME_TIERS.length).toBe(5);
      expect(VOLUME_TIERS[0].min).toBe(1);
      expect(VOLUME_TIERS[2].min).toBe(12); // Lusinan
      expect(VOLUME_TIERS[4].min).toBe(50); // Partai besar
    });
  });

  describe('calculateCustomQuote', () => {
    it('should calculate accurate economics for 1 pcs single custom t-shirt', () => {
      const quote = calculateCustomQuote({
        garmentKey: 'nsa_softstyle_30s',
        garmentColor: 'Hitam',
        sizeQuantities: { S: 0, M: 1, L: 0, XL: 0, '2XL': 0, '3XL': 0 },
        selectedPlacements: ['front_a3'],
        packagingId: 'standard_poly'
      });

      expect(quote.totalQty).toBe(1);
      expect(quote.baseBlankCost).toBe(37000);
      expect(quote.totalDtfPerPcs).toBe(12500);
      expect(quote.packagingCostPerPcs).toBe(2000);
      expect(quote.pressAndOverheadPerPcs).toBe(6000); // 5000 labor + 1000 overhead
      // unitHpp = 37000 + 12500 + 2000 + 6000 = 57500
      expect(quote.unitHpp).toBe(57500);
      expect(quote.recommendedUnitPrice).toBeGreaterThanOrEqual(90000);
      expect(quote.netMarginPercent).toBeGreaterThanOrEqual(35);
      expect(quote.cfoStatus).toBe('healthy');
      expect(quote.downPayment + quote.remainingPayment).toBe(quote.totalPrice);
    });

    it('should accurately calculate multi-placement print costs (Front A3 + Back A3 + Neck Label)', () => {
      const quote = calculateCustomQuote({
        garmentKey: 'nsa_heavyweight_24s',
        garmentColor: 'Hitam',
        sizeQuantities: { L: 1 },
        selectedPlacements: ['front_a3', 'back_a3', 'neck_label']
      });

      // DTF: 12500 (front A3) + 12500 (back A3) + 2000 (neck label) = 27000
      expect(quote.totalDtfPerPcs).toBe(27000);
      expect(quote.activePlacements).toHaveLength(3);
      expect(quote.unitHpp).toBe(42000 + 27000 + 2000 + 6000); // 77000
    });

    it('should apply jumbo size surcharges (+Rp 5.000 for 2XL, +Rp 10.000 for 3XL)', () => {
      const quote = calculateCustomQuote({
        garmentKey: 'nsa_heavyweight_24s',
        garmentColor: 'Hitam',
        sizeQuantities: {
          M: 2,    // surcharge 0
          '2XL': 2, // surcharge 2 * 5000 = 10000
          '3XL': 1  // surcharge 1 * 10000 = 10000
        },
        selectedPlacements: ['front_a3']
      });

      expect(quote.totalQty).toBe(5);
      expect(quote.totalJumboSurcharge).toBe(20000);
      // Total blank = (42000 * 5) + 20000 = 230000
      expect(quote.totalBlankCost).toBe(230000);
    });

    it('should give wholesale tier pricing for dozen order (12 pcs)', () => {
      const quoteSingle = calculateCustomQuote({
        garmentKey: 'nsa_softstyle_30s',
        sizeQuantities: { L: 1 },
        selectedPlacements: ['front_a3']
      });

      const quoteDozen = calculateCustomQuote({
        garmentKey: 'nsa_softstyle_30s',
        sizeQuantities: { L: 12 },
        selectedPlacements: ['front_a3']
      });

      expect(quoteDozen.totalQty).toBe(12);
      expect(quoteDozen.tier.id).toBe('tier_dozen');
      // Price per pcs for dozen should be lower than single pcs
      expect(quoteDozen.recommendedUnitPrice).toBeLessThan(quoteSingle.recommendedUnitPrice);
      // Net margin must still satisfy CFO floor >= 35%
      expect(quoteDozen.netMarginPercent).toBeGreaterThanOrEqual(35);
      expect(quoteDozen.cfoStatus).toBe('healthy');
    });

    it('should handle zero quantity gracefully by defaulting to 1 pcs', () => {
      const quote = calculateCustomQuote({
        garmentKey: 'nsa_softstyle_30s',
        sizeQuantities: { S: 0, M: 0 }
      });

      expect(quote.totalQty).toBe(1);
      expect(quote.totalPrice).toBeGreaterThan(0);
    });
  });

  describe('generateQuoteWhatsAppText & getQuoteWhatsAppUrl', () => {
    const sampleQuote = calculateCustomQuote({
      garmentKey: 'nsa_heavyweight_24s',
      garmentColor: 'Hitam',
      sizeQuantities: { M: 5, L: 5, XL: 2 },
      selectedPlacements: ['front_a3', 'neck_label']
    });

    const sampleCustomer = {
      name: 'Fauzan Komunitas',
      phone: '0812-9876-5432'
    };

    it('should generate detailed quote WhatsApp message with accurate figures', () => {
      const text = generateQuoteWhatsAppText(sampleQuote, sampleCustomer, 'detailed_quote');
      expect(text).toContain('Halo Kak Fauzan Komunitas!');
      expect(text).toContain('12 pcs');
      expect(text).toContain('NSA Premium Cotton 7200 (24s)');
      expect(text).toContain('Syarat DP 50%');
      expect(text).toContain('TeeStock Apparel x MultiGraph');
      expect(text).toContain('2–3 hari kerja');
    });

    it('should generate DP 50% invoice with payment details', () => {
      const text = generateQuoteWhatsAppText(sampleQuote, sampleCustomer, 'dp_invoice');
      expect(text).toContain('Tagihan Uang Muka (DP 50% Produksi)');
      expect(text).toContain('TOTAL TRANSFER DP (50%)');
      expect(text).toContain('BCA Bisnis');
    });

    it('should generate final balance notice message', () => {
      const text = generateQuoteWhatsAppText(sampleQuote, sampleCustomer, 'final_balance');
      expect(text).toContain('SELESAI DIPRESS');
      expect(text).toContain('Sisa Tagihan (50%)');
    });

    it('should generate valid direct click-to-chat WhatsApp link', () => {
      const url = getQuoteWhatsAppUrl(sampleQuote, sampleCustomer, 'detailed_quote');
      expect(url.startsWith('https://wa.me/6281298765432?text=')).toBe(true);
      expect(url).toContain(encodeURIComponent('Fauzan Komunitas'));
    });
  });

  describe('createKanbanOrderFromQuote', () => {
    it('should create order payload ready for AdminContext pipeline', () => {
      const quote = calculateCustomQuote({
        garmentKey: 'nsa_softstyle_30s',
        garmentColor: 'Hitam',
        sizeQuantities: { M: 6, L: 6 },
        selectedPlacements: ['front_a3']
      });

      const customerInfo = {
        name: 'Budi Custom',
        phone: '0855112233',
        city: 'Bandung',
        address: 'Jl. Riau No. 12'
      };

      const orderPayload = createKanbanOrderFromQuote(quote, customerInfo);

      expect(orderPayload.customer).toBe('Budi Custom');
      expect(orderPayload.phone).toBe('62855112233');
      expect(orderPayload.city).toBe('Bandung');
      expect(orderPayload.channel).toBe('whatsapp');
      expect(orderPayload.tier).toBe('reseller'); // >= 12 pcs
      expect(orderPayload.status).toBe('pending');
      expect(orderPayload.qty).toBe(12);
      expect(orderPayload.price).toBe(quote.totalPrice);
      expect(orderPayload.items).toHaveLength(2); // M and L
      expect(orderPayload.notes).toContain('Custom Order WA');
    });
  });

  describe('exportQuotationCsv', () => {
    it('should export valid CSV format with 16 columns and UTF-8 BOM', () => {
      const quote = calculateCustomQuote({
        garmentKey: 'nsa_softstyle_30s',
        sizeQuantities: { L: 10 },
        selectedPlacements: ['front_a3']
      });

      const csv = exportQuotationCsv(quote, { name: 'Andi Agency', phone: '0812345678' });
      expect(csv).toBeDefined();
      expect(csv.startsWith('\uFEFF')).toBe(true);
      expect(csv).toContain('No. Penawaran');
      expect(csv).toContain('Andi Agency');
      expect(csv).toContain('Total Tagihan Proyek');
    });
  });

  describe('formatRupiah', () => {
    it('should format numbers properly', () => {
      expect(formatRupiah(95000)).toContain('95.000');
    });
  });
});
