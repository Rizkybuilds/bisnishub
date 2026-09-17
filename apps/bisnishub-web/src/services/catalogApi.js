/**
 * Master Catalog & PIM Services (TeeStock & MultiGraph OS)
 * Unit Economics Engine, Executive KPIs, and CSV Export
 */

import { isProductBlank } from '../constants/pricing.js';

/**
 * Kalkulasi lengkap Unit Economics & CFO Guardrails untuk sebuah produk
 * Formula Resmi:
 * HPP Fisik = Garmen NSA + Film DTF + Kemasan (Rp 3.500) + Biaya Press (Rp 1.000) + Buffer Defect (5%)
 * Beban Desain = Amortisasi Lisensi (Flat-Fee) ATAU Royalti Tunai (Kolab Kreator) ATAU Rp 0 (In-House)
 * Total HPP Riil = HPP Fisik + Beban Desain
 * Margin Bersih Retail = (Harga Retail - Total HPP Riil - Fee Gateway 2%) / Harga Retail
 */
export function calculateProductEconomics(product) {
  if (!product) {
    return {
      isBlank: false,
      cBlank: 0,
      cDtf: 0,
      cPackaging: 0,
      cOps: 0,
      cDefect: 0,
      physicalHpp: 0,
      designModel: 'in_house',
      designBurden: 0,
      totalRealHpp: 0,
      retailPrice: 0,
      gatewayFee: 0,
      netProfitRetail: 0,
      marginRetail: 0,
      resellerPrice: 0,
      netProfitReseller: 0,
      marginReseller: 0,
      cfoStatus: 'critical'
    };
  }

  const isBlank = isProductBlank(product);

  const cBlank = Number(product.costBlank ?? product.cost_blank ?? (isBlank ? 38000 : 42000));
  const cDtf = isBlank ? 0 : Number(product.costDtf ?? product.cost_dtf ?? 14500);
  const cPackaging = isBlank ? 0 : 3500; // Polymailer, hangtag, sticker pack
  const cOps = isBlank ? 0 : 1000; // Listrik & depresiasi mesin press
  const cDefect = isBlank ? 0 : Math.round((cBlank + cDtf) * 0.05); // 5% defect safety buffer
  const physicalHpp = cBlank + cDtf + cPackaging + cOps + cDefect;

  // Resolve Design Sourcing Model
  const pModel = product.designSource || product.design_source || 
    (product.creatorName || product.creator_name ? 'creator_collab' : 
    (product.licenseSource || product.license_source || product.designCost ? 'flat_fee' : 'in_house'));

  let designBurden = 0;
  if (!isBlank) {
    if (pModel === 'flat_fee') {
      const dCost = Number(product.designCost ?? product.design_cost ?? 0);
      const dTarget = Math.max(1, Number(product.amortizationTarget ?? product.amortization_target ?? 25));
      designBurden = Math.round(dCost / dTarget);
    } else if (pModel === 'creator_collab') {
      designBurden = Number(product.royaltyAmount ?? product.royalty_amount ?? 0);
    }
  }

  const totalRealHpp = physicalHpp + designBurden;
  const retailPrice = Number(product.priceRetail ?? product.price_retail ?? (isBlank ? 45000 : 99000));
  const gatewayFee = isBlank ? 0 : Math.round(retailPrice * 0.02); // 2% payment gateway
  const netProfitRetail = retailPrice - totalRealHpp - gatewayFee;
  const marginRetail = retailPrice > 0 ? Number(((netProfitRetail / retailPrice) * 100).toFixed(1)) : 0;

  // Reseller calculations
  const resellerPrice = Number(product.priceReseller ?? product.price_reseller ?? (isBlank ? (cBlank + 1000) : Math.round(retailPrice * 0.75)));
  const netProfitReseller = resellerPrice - physicalHpp;
  const marginReseller = resellerPrice > 0 ? Number(((netProfitReseller / resellerPrice) * 100).toFixed(1)) : 0;

  // CFO Compliance Status
  let cfoStatus = 'healthy';
  if (isBlank) {
    cfoStatus = 'blank_pass';
  } else if (marginRetail >= 35) {
    cfoStatus = 'healthy'; // Lolos target utama (>= 35%)
  } else if (marginRetail >= 25) {
    cfoStatus = 'warning'; // Cukup namun perlu pantauan (25% - 35%)
  } else {
    cfoStatus = 'critical'; // Di bawah floor (< 25%)
  }

  return {
    isBlank,
    cBlank,
    cDtf,
    cPackaging,
    cOps,
    cDefect,
    physicalHpp,
    designModel: pModel,
    designBurden,
    totalRealHpp,
    retailPrice,
    gatewayFee,
    netProfitRetail,
    marginRetail,
    resellerPrice,
    netProfitReseller,
    marginReseller,
    cfoStatus
  };
}

/**
 * 📊 Agregasi 4 Executive KPI Ribbon Cards untuk Halaman Katalog & PIM
 */
export function getCatalogKpis(catalog = [], inventory = {}) {
  const totalProducts = catalog.length;
  if (totalProducts === 0) {
    return {
      totalProducts: 0,
      graphicProducts: 0,
      blankProducts: 0,
      avgRetailMargin: 0,
      cfoHealthyCount: 0,
      readyDtfCount: 0,
      readyDtfPercent: 0,
      totalReadySheets: 0,
      collabCount: 0,
      flatFeeCount: 0,
      inHouseCount: 0,
      portfolioCollabCount: 0
    };
  }

  let graphicProducts = 0;
  let blankProducts = 0;
  let marginSum = 0;
  let cfoHealthyCount = 0;
  let readyDtfCount = 0;
  let totalReadySheets = 0;
  let collabCount = 0;
  let flatFeeCount = 0;
  let inHouseCount = 0;

  const dtfFilms = inventory?.dtf_films || {};

  catalog.forEach(p => {
    const isBlank = isProductBlank(p);
    const econ = calculateProductEconomics(p);

    if (isBlank) {
      blankProducts++;
    } else {
      graphicProducts++;
      marginSum += econ.marginRetail;
      if (econ.cfoStatus === 'healthy') {
        cfoHealthyCount++;
      }

      // Check DTF film buffer in physical inventory
      const filmStock = dtfFilms[p.sku]?.ready || 0;
      if (filmStock > 0) {
        readyDtfCount++;
        totalReadySheets += filmStock;
      }

      if (econ.designModel === 'creator_collab') {
        collabCount++;
      } else if (econ.designModel === 'flat_fee') {
        flatFeeCount++;
      } else {
        inHouseCount++;
      }
    }
  });

  const avgRetailMargin = graphicProducts > 0 
    ? Number((marginSum / graphicProducts).toFixed(1)) 
    : (totalProducts > 0 ? 6.7 : 0);

  const readyDtfPercent = graphicProducts > 0 
    ? Math.round((readyDtfCount / graphicProducts) * 100) 
    : 100;

  return {
    totalProducts,
    graphicProducts,
    blankProducts,
    avgRetailMargin,
    cfoHealthyCount,
    readyDtfCount,
    readyDtfPercent,
    totalReadySheets,
    collabCount,
    flatFeeCount,
    inHouseCount,
    portfolioCollabCount: collabCount + flatFeeCount
  };
}

/**
 * 📥 Ekspor CSV Master PIM & Price List (17 Kolom Lengkap Ber-BOM UTF-8)
 */
export function exportCatalogCsv(catalog = [], inventory = {}) {
  const headers = [
    'SKU',
    'Nama Desain',
    'Series',
    'Niche',
    'Tipe Produk',
    'Model Lisensi',
    'Sumber / Kreator',
    'Preset Sablon',
    'Warna Rekomendasi',
    'Buffer DTF Siap Press (Lembar)',
    'HPP Fisik (Rp)',
    'Beban Desain (Rp)',
    'Total HPP Riil (Rp)',
    'Harga Retail (Rp)',
    'Laba Bersih Retail (Rp)',
    'Margin Bersih Retail (%)',
    'Harga Reseller (Rp)',
    'Status Kepatuhan CFO'
  ];

  const dtfFilms = inventory?.dtf_films || {};

  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = catalog.map(p => {
    const econ = calculateProductEconomics(p);
    const isBlank = econ.isBlank;
    const filmReady = isBlank ? '-' : (dtfFilms[p.sku]?.ready || 0);

    let sourceInfo = 'Internal';
    if (econ.designModel === 'creator_collab') {
      sourceInfo = `${p.creatorName || p.creator_name || 'Kreator'} (${p.creatorHandle || p.creator_handle || '-'})`;
    } else if (econ.designModel === 'flat_fee') {
      sourceInfo = p.licenseSource || p.license_source || 'Etsy/Freelance';
    } else if (isBlank) {
      sourceInfo = 'Distributor Cititex NSA';
    }

    let cfoStatusLabel = 'Lolos (Healthy >= 35%)';
    if (isBlank) cfoStatusLabel = 'Kaos Polos NSA (Fixed Margin)';
    else if (econ.cfoStatus === 'warning') cfoStatusLabel = 'Cukup (25% - 35%)';
    else if (econ.cfoStatus === 'critical') cfoStatusLabel = 'Di Bawah Floor (< 25%)';

    const colorsStr = p.colors || (Array.isArray(p.curatedColors) ? p.curatedColors.join(', ') : '-');

    return [
      escapeCsv(p.sku),
      escapeCsv(p.name),
      escapeCsv(p.series || 'profesi'),
      escapeCsv(p.niche || '-'),
      escapeCsv(isBlank ? 'Kaos Polos Blank' : 'Kaos Grafis DTF'),
      escapeCsv(isBlank ? 'Blank' : econ.designModel),
      escapeCsv(sourceInfo),
      escapeCsv(p.printPreset || p.printSize || (isBlank ? 'None' : 'A3+')),
      escapeCsv(colorsStr),
      escapeCsv(filmReady),
      econ.physicalHpp,
      econ.designBurden,
      econ.totalRealHpp,
      econ.retailPrice,
      Math.round(econ.netProfitRetail),
      `${econ.marginRetail}%`,
      econ.resellerPrice,
      escapeCsv(cfoStatusLabel)
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return csvContent;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `TeeStock_Master_Katalog_PIM_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return csvContent;
}
