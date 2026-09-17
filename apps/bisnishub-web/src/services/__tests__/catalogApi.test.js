import { describe, it, expect, vi } from 'vitest';
import { 
  calculateProductEconomics, 
  getCatalogKpis, 
  exportCatalogCsv 
} from '../catalogApi.js';

describe('Catalog & PIM API Services', () => {
  describe('calculateProductEconomics', () => {
    it('should correctly calculate economics for blank NSA t-shirt', () => {
      const blankProduct = {
        sku: 'TS-BLK-7200-BLK-L',
        name: 'NSA 7200 Premium Cotton - Black',
        series: 'blank',
        costBlank: 42000,
        priceRetail: 45000,
        priceReseller: 43000
      };

      const econ = calculateProductEconomics(blankProduct);

      expect(econ.isBlank).toBe(true);
      expect(econ.cDtf).toBe(0);
      expect(econ.cPackaging).toBe(0);
      expect(econ.cOps).toBe(0);
      expect(econ.cDefect).toBe(0);
      expect(econ.physicalHpp).toBe(42000);
      expect(econ.designBurden).toBe(0);
      expect(econ.totalRealHpp).toBe(42000);
      expect(econ.retailPrice).toBe(45000);
      expect(econ.netProfitRetail).toBe(3000); // 45000 - 42000 - 0 (no gateway for blank in formula)
      expect(econ.cfoStatus).toBe('blank_pass');
    });

    it('should calculate in-house graphic apparel with zero design burden', () => {
      const inHouseProduct = {
        sku: 'TS-PRO-001',
        name: 'Code & Coffee',
        series: 'profesi',
        costBlank: 42000,
        costDtf: 14500,
        priceRetail: 99000,
        designSource: 'in_house'
      };

      const econ = calculateProductEconomics(inHouseProduct);

      expect(econ.isBlank).toBe(false);
      expect(econ.designModel).toBe('in_house');
      expect(econ.designBurden).toBe(0);
      // physicalHpp = 42000 (blank) + 14500 (dtf) + 3500 (pack) + 1000 (press) + round((42000+14500)*0.05=2825) = 63825
      expect(econ.physicalHpp).toBe(63825);
      expect(econ.totalRealHpp).toBe(63825);
      // gateway = round(99000 * 0.02) = 1980
      expect(econ.gatewayFee).toBe(1980);
      // netProfit = 99000 - 63825 - 1980 = 33195
      expect(econ.netProfitRetail).toBe(33195);
      // margin = (33195 / 99000) * 100 = 33.5%
      expect(econ.marginRetail).toBe(33.5);
      expect(econ.cfoStatus).toBe('warning'); // between 25% and 35%
    });

    it('should calculate flat-fee design with amortization target', () => {
      const flatFeeProduct = {
        sku: 'TS-RET-002',
        name: 'Retro Sunset',
        series: 'retro',
        costBlank: 42000,
        costDtf: 14500,
        priceRetail: 119000,
        designSource: 'flat_fee',
        designCost: 150000,
        amortizationTarget: 25
      };

      const econ = calculateProductEconomics(flatFeeProduct);

      expect(econ.designModel).toBe('flat_fee');
      // designBurden = round(150000 / 25) = 6000
      expect(econ.designBurden).toBe(6000);
      expect(econ.totalRealHpp).toBe(63825 + 6000); // 69825
      // gateway = round(119000 * 0.02) = 2380
      expect(econ.gatewayFee).toBe(2380);
      // netProfit = 119000 - 69825 - 2380 = 46795
      expect(econ.netProfitRetail).toBe(46795);
      // margin = (46795 / 119000) * 100 = 39.3%
      expect(econ.marginRetail).toBe(39.3);
      expect(econ.cfoStatus).toBe('healthy'); // >= 35%
    });

    it('should calculate creator collaboration royalty burden', () => {
      const collabProduct = {
        sku: 'TS-COL-003',
        name: 'Cyberpunk Oni',
        series: 'anime',
        costBlank: 42000,
        costDtf: 14500,
        priceRetail: 129000,
        designSource: 'creator_collab',
        creatorName: 'Ardi',
        royaltyAmount: 20000
      };

      const econ = calculateProductEconomics(collabProduct);

      expect(econ.designModel).toBe('creator_collab');
      expect(econ.designBurden).toBe(20000);
      expect(econ.totalRealHpp).toBe(63825 + 20000); // 83825
      // gateway = round(129000 * 0.02) = 2580
      expect(econ.gatewayFee).toBe(2580);
      // netProfit = 129000 - 83825 - 2580 = 42595
      expect(econ.netProfitRetail).toBe(42595);
      // margin = (42595 / 129000) * 100 = 33.0%
      expect(econ.marginRetail).toBe(33.0);
      expect(econ.cfoStatus).toBe('warning');
    });
  });

  describe('getCatalogKpis', () => {
    it('should aggregate catalog metrics and check DTF inventory buffer correctly', () => {
      const sampleCatalog = [
        {
          sku: 'TS-PRO-001',
          name: 'Code & Coffee',
          series: 'profesi',
          costBlank: 42000,
          costDtf: 14500,
          priceRetail: 119000,
          designSource: 'in_house'
        },
        {
          sku: 'TS-RET-002',
          name: 'Retro Sunset',
          series: 'retro',
          costBlank: 42000,
          costDtf: 14500,
          priceRetail: 119000,
          designSource: 'flat_fee',
          designCost: 150000,
          amortizationTarget: 25
        },
        {
          sku: 'TS-BLK-001',
          name: 'NSA 7200 Black L',
          series: 'blank',
          costBlank: 42000,
          priceRetail: 45000
        }
      ];

      const sampleInventory = {
        dtf_films: {
          'TS-PRO-001': { ready: 10, unitCost: 12000 },
          'TS-RET-002': { ready: 0, unitCost: 12000 }
        }
      };

      const kpis = getCatalogKpis(sampleCatalog, sampleInventory);

      expect(kpis.totalProducts).toBe(3);
      expect(kpis.graphicProducts).toBe(2);
      expect(kpis.blankProducts).toBe(1);
      expect(kpis.readyDtfCount).toBe(1); // Only TS-PRO-001 has ready > 0
      expect(kpis.readyDtfPercent).toBe(50); // 1 out of 2 graphic products = 50%
      expect(kpis.totalReadySheets).toBe(10);
      expect(kpis.flatFeeCount).toBe(1);
      expect(kpis.portfolioCollabCount).toBe(1);
      expect(kpis.avgRetailMargin).toBeGreaterThan(0);
    });
  });

  describe('exportCatalogCsv', () => {
    it('should generate valid CSV content without crashing', () => {
      const sampleCatalog = [
        {
          sku: 'TS-PRO-001',
          name: 'Code & Coffee',
          series: 'profesi',
          costBlank: 42000,
          costDtf: 14500,
          priceRetail: 119000,
          designSource: 'in_house',
          colors: 'Hitam, Krem'
        }
      ];

      const csv = exportCatalogCsv(sampleCatalog, {});
      expect(csv).toBeDefined();
      expect(csv).toContain('TS-PRO-001');
      expect(csv).toContain('Code & Coffee');
      expect(csv).toContain('119000');
    });
  });
});
