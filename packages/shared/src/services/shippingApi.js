import { SHIPPING_ZONES } from '../constants/pricing';

/**
 * Standard Garment Weights in Grams
 * Based on New States Apparel distributor specs & garment thickness
 */
export const GARMENT_WEIGHT_TABLE = {
  // Softstyle 30s (~150 gsm)
  'nsa_softstyle_30s': 180,
  'NSA-30S': 180,
  'TS-BLK-3600': 180,

  // Heavyweight 24s (~180 gsm)
  'nsa_heavyweight_24s': 220,
  'NSA-24S': 220,
  'TS-BLK-7200': 220,

  // Heavyweight 20s (~210 gsm)
  'nsa_heavyweight_20s': 230,
  'NSA-5400': 230,

  // Long Sleeve
  'nsa_longsleeve': 280,
  'NSA-LS': 280,
  'nsa_heavy_longsleeve': 300,
  'NSA-5480': 300,

  // Polo & Raglan
  'nsa_polo': 260,
  'NSA-POL': 260,
  'nsa_raglan': 210,
  'NSA-7260': 210,
  'nsa_ringer': 200,
  'NSA-7250': 200,

  // Outerwear (Fleece)
  'nsa_hoodie': 550,
  'NSA-HOD': 550,
  'nsa_crewneck': 480,
  'NSA-9000': 480,

  // Performance / Youth
  'nsa_drifit': 160,
  'NSA-2700': 160,
  'nsa_youth': 130,
  'NSA-72Y00': 130,

  // Default fallback
  'default_tshirt': 200,
  'packaging_material': 30
};

/**
 * National & Local Express Courier Providers with Service Slugs and Rate Adjusters
 */
export const AVAILABLE_COURIERS = [
  { id: 'jnt', name: 'J&T Express', service: 'EZ', rateMultiplier: 1.0, isRecommended: true, badge: 'Rekomendasi Cepat', category: 'regular' },
  { id: 'sicepat', name: 'SiCepat Reguler', service: 'REG', rateMultiplier: 1.0, isRecommended: false, badge: 'Standar', category: 'regular' },
  { id: 'jne', name: 'JNE Reguler', service: 'REG', rateMultiplier: 1.05, isRecommended: false, badge: 'Jaringan Luas', category: 'regular' },
  { id: 'anteraja', name: 'AnterAja', service: 'Reguler', rateMultiplier: 0.95, isRecommended: false, badge: 'Hemat', category: 'regular' },
  { id: 'gosend_sameday', name: 'GoSend / Grab Sameday', service: 'Sameday (6-8 Jam)', rateMultiplier: 1.8, isRecommended: false, badge: '⚡ Tiba Hari Ini (Bogor)', category: 'express_hub_only', flatSurcharge: 16000 },
  { id: 'gosend_instant', name: 'GoSend / Grab Instant', service: 'Instant (1-2 Jam)', rateMultiplier: 2.5, isRecommended: false, badge: '🚀 Kilat Super Cepat', category: 'express_hub_only', flatSurcharge: 25000 }
];

/**
 * Filter available couriers based on fulfillment hub capabilities
 * @param {boolean} supportsExpress - Whether the current hub supports sameday / instant delivery
 */
export function getAvailableCouriers(supportsExpress = false) {
  if (supportsExpress) {
    return AVAILABLE_COURIERS;
  }
  return AVAILABLE_COURIERS.filter(c => c.category !== 'express_hub_only');
}


/**
 * Identify weight of a single item in grams
 */
export function getItemWeightGrams(item) {
  if (!item) return GARMENT_WEIGHT_TABLE.default_tshirt;

  // Direct weight override if present
  if (typeof item.weight_grams === 'number' && item.weight_grams > 0) {
    return item.weight_grams;
  }

  // Check by garment code or garment id
  const garmentKey = item.garment_code || item.garment_id || item.garment || '';
  const garmentLower = String(garmentKey).toLowerCase();

  if (garmentLower.includes('hoodie') || garmentLower.includes('9500')) {
    return GARMENT_WEIGHT_TABLE.nsa_hoodie;
  }
  if (garmentLower.includes('crewneck') || garmentLower.includes('9000')) {
    return GARMENT_WEIGHT_TABLE.nsa_crewneck;
  }
  if (garmentLower.includes('long') || garmentLower.includes('ls')) {
    return GARMENT_WEIGHT_TABLE.nsa_longsleeve;
  }
  if (garmentLower.includes('polo') || garmentLower.includes('8100')) {
    return GARMENT_WEIGHT_TABLE.nsa_polo;
  }
  if (garmentLower.includes('3600') || garmentLower.includes('30s') || garmentLower.includes('softstyle')) {
    return GARMENT_WEIGHT_TABLE.nsa_softstyle_30s;
  }
  if (garmentLower.includes('7200') || garmentLower.includes('24s') || garmentLower.includes('heavyweight')) {
    return GARMENT_WEIGHT_TABLE.nsa_heavyweight_24s;
  }

  // Check SKU matches
  const sku = String(item.sku || item.product_sku || '').toUpperCase();
  if (sku.includes('3600')) return GARMENT_WEIGHT_TABLE['TS-BLK-3600'];
  if (sku.includes('7200')) return GARMENT_WEIGHT_TABLE['TS-BLK-7200'];

  return GARMENT_WEIGHT_TABLE.default_tshirt;
}

/**
 * Calculate total order weight including packaging material
 */
export function calculateOrderWeight(cartItems = []) {
  if (!cartItems || cartItems.length === 0) {
    return {
      totalItemsGrams: 0,
      packagingGrams: 0,
      actualWeightGrams: 0,
      billableWeightKg: 0,
      totalQty: 0
    };
  }

  let totalItemsGrams = 0;
  let totalQty = 0;

  for (const item of cartItems) {
    const qty = Number(item.qty || 1);
    const weightPerUnit = getItemWeightGrams(item);
    totalItemsGrams += weightPerUnit * qty;
    totalQty += qty;
  }

  const packagingGrams = totalQty > 0 ? GARMENT_WEIGHT_TABLE.packaging_material : 0;
  const actualWeightGrams = totalItemsGrams + packagingGrams;
  const billableWeightKg = calculateBillableWeightKg(actualWeightGrams);

  return {
    totalItemsGrams,
    packagingGrams,
    actualWeightGrams,
    billableWeightKg,
    totalQty
  };
}

/**
 * Indonesian Courier Billable Weight Rule:
 * - Minimum billable weight: 1.000 grams (1 kg)
 * - Tolerance window: 1.200 grams still billable as 1 kg
 * - > 1.200 grams rounded up to next integer kg
 */
export function calculateBillableWeightKg(weightInGrams) {
  if (!weightInGrams || weightInGrams <= 0) return 0;
  if (weightInGrams <= 1200) return 1;

  // Beyond 1.200g, round up with 200g tolerance per kg
  return Math.ceil((weightInGrams - 200) / 1000);
}

/**
 * Calculate Dynamic Shipping Fee based on Zone, Cart Items, Courier, and Origin Hub
 */
export function calculateShippingFee({
  zoneId = 'jawa_lainnya',
  cartItems = [],
  courierName = 'J&T Express',
  originHubId = 'citayam_studio'
}) {
  if (!cartItems || cartItems.length === 0) {
    return {
      baseZoneRate: 0,
      billableWeightKg: 0,
      actualWeightGrams: 0,
      courierName,
      shippingFee: 0,
      eta: '1-3 Hari',
      zoneName: '',
      originHubId
    };
  }

  const zone = SHIPPING_ZONES.find(z => z.id === zoneId) || SHIPPING_ZONES[1];
  const weightInfo = calculateOrderWeight(cartItems);
  const billableKg = Math.max(1, weightInfo.billableWeightKg);

  const matchedCourier = AVAILABLE_COURIERS.find(
    c => c.name.toLowerCase() === String(courierName).toLowerCase() || c.id === String(courierName).toLowerCase()
  ) || AVAILABLE_COURIERS[0];

  let rawFee = zone.rate * billableKg * matchedCourier.rateMultiplier;

  // If courier is express hub local delivery (GoSend/Grab Instant or Sameday)
  if (matchedCourier.flatSurcharge) {
    const extraKgSurcharge = billableKg > 1 ? (billableKg - 1) * 5000 : 0;
    rawFee = Math.max(rawFee, matchedCourier.flatSurcharge + extraKgSurcharge);
  }

  // Round to nearest 500 for clean Indonesian billing
  const shippingFee = Math.round(rawFee / 500) * 500;

  const eta = matchedCourier.service.includes('Jam')
    ? matchedCourier.service
    : zone.eta;

  return {
    baseZoneRate: zone.rate,
    billableWeightKg: billableKg,
    actualWeightGrams: weightInfo.actualWeightGrams,
    courierName: matchedCourier.name,
    shippingFee,
    eta,
    zoneName: zone.name,
    isOverweight: billableKg > 1,
    originHubId
  };
}

