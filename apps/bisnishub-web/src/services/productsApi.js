import { supabase } from './supabase.js';

const LOCAL_STORAGE_KEY = 'teestock_catalog_products';
const DELETED_SKUS_KEY = 'teestock_deleted_products';

// Known initial demo/mockup SKUs that must never appear in live production
const LEGACY_SEED_SKUS = new Set([
  'TS-STM-001', 'TS-STM-002',
  'TS-SUB-001', 'TS-SUB-002',
  'TS-OUT-001', 'TS-OUT-002',
  'TS-BLK-7200', 'TS-BLK-3600',
  'TS-PRO-001', 'TS-PRO-002',
  'TS-KOM-001', 'TS-KOM-002',
  'TS-LOK-001', 'TS-LOK-002',
  'TS-REC-001', 'TS-FAN-001'
]);

export function getDeletedSkus() {
  if (typeof localStorage === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(DELETED_SKUS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function markSkuAsDeleted(sku) {
  if (typeof localStorage === 'undefined') return;
  const current = getDeletedSkus();
  if (!current.includes(sku)) {
    localStorage.setItem(DELETED_SKUS_KEY, JSON.stringify([...current, sku]));
  }
}

export function unmarkSkuAsDeleted(sku) {
  if (typeof localStorage === 'undefined') return;
  const current = getDeletedSkus();
  localStorage.setItem(DELETED_SKUS_KEY, JSON.stringify(current.filter(s => s !== sku)));
}

/**
 * Filter out user-deleted products
 */
function sanitizeCatalog(list) {
  if (!Array.isArray(list)) return [];
  const deletedSkus = new Set(getDeletedSkus());
  return list.filter(p => {
    if (!p || !p.sku) return false;
    if (deletedSkus.has(p.sku)) return false;
    return true;
  });
}

/**
 * Standardize product data structure between PostgreSQL snake_case and UI camelCase
 */
function normalizeProduct(p) {
  if (!p) return null;

  // Extract extra metadata if packed as JSON inside story_behind
  let meta = {};
  if (typeof p.story_behind === 'string' && p.story_behind.trim().startsWith('{')) {
    try {
      meta = JSON.parse(p.story_behind);
    } catch (e) {
      // fallback if pure string
    }
  }

  const designSource = p.design_source ?? p.designSource ?? meta.designSource ?? 
    (p.creator_name || p.creatorName ? 'creator_collab' : (p.license_source || meta.designCost ? 'flat_fee' : 'in_house'));
  const designCost = Number(p.design_cost ?? p.designCost ?? meta.designCost ?? 0);
  const amortizationTarget = Number(p.amortization_target ?? p.amortizationTarget ?? meta.amortizationTarget ?? 25);
  const royaltyAmount = Number(p.royalty_amount ?? p.royaltyAmount ?? meta.royaltyAmount ?? 0);
  const creatorName = p.creator_name ?? p.creatorName ?? meta.creatorName ?? '';
  const creatorHandle = p.creator_handle ?? p.creatorHandle ?? meta.creatorHandle ?? '';
  const creatorPayoutAccount = p.creator_payout_account ?? p.creatorPayoutAccount ?? meta.creatorPayoutAccount ?? '';
  const licenseSource = p.license_source ?? p.licenseSource ?? meta.licenseSource ?? '';

  // Auto-pricing & customization metadata
  const printSize = p.print_size ?? p.printSize ?? meta.printSize ?? 'a3_plus';
  const primaryGarment = p.primary_garment ?? p.primaryGarment ?? meta.primaryGarment ?? 'nsa_heavyweight_24s';
  const compatibleGarments = p.compatible_garments ?? p.compatibleGarments ?? meta.compatibleGarments ?? ['nsa_heavyweight_24s', 'nsa_softstyle_30s'];
  const curatedColors = p.curated_colors ?? p.curatedColors ?? meta.curatedColors ?? 
    (p.colors ? p.colors.split(',').map(s => s.trim()).filter(Boolean) : ['Hitam', 'Krem', 'Charcoal', 'Forest Green']);
  const designTier = p.design_tier ?? p.designTier ?? meta.designTier ?? 'tier2_signature';
  const designValue = Number(p.design_value ?? p.designValue ?? meta.designValue ?? 16000);
  const resellerDiscountPercent = Number(p.reseller_discount_percent ?? p.resellerDiscountPercent ?? meta.resellerDiscountPercent ?? 25);

  // Multi-placement & Mockup Metadata
  const printPreset = p.print_preset ?? p.printPreset ?? meta.printPreset ?? 'back_a3_plus';
  const printPlacements = p.print_placements ?? p.printPlacements ?? meta.printPlacements ?? {
    front: 'none',
    back: printSize || 'a3_plus',
    sleeve: 'none'
  };

  let variantImages = p.variant_images ?? p.variantImages ?? meta.variantImages ?? null;
  if (typeof variantImages === 'string' && variantImages.trim().startsWith('{')) {
    try {
      variantImages = JSON.parse(variantImages);
    } catch (e) {
      // fallback
    }
  }

  // Calculate per-unit design burden
  let designBurdenPerPiece = 0;
  if (designSource === 'flat_fee') {
    designBurdenPerPiece = amortizationTarget > 0 ? Math.round(designCost / amortizationTarget) : 0;
  } else if (designSource === 'creator_collab') {
    designBurdenPerPiece = royaltyAmount;
  }

  return {
    ...p,
    sku: p.sku,
    name: p.name,
    series: p.series || 'blank',
    seriesName: p.series_name ?? p.seriesName ?? (p.series === 'blank' ? 'NSA Blank Apparel' : 'Curated'),
    seriesColor: p.series_color ?? p.seriesColor ?? '#EBE3D5',
    niche: p.niche || '',
    batch: p.batch || '',
    template: p.template || 'blank',
    status: p.status || 'active',
    filePath: p.file_path ?? p.filePath ?? '',
    file_path: p.file_path ?? p.filePath ?? '',
    colors: Array.isArray(curatedColors) && curatedColors.length > 0 ? curatedColors.join(', ') : (p.colors || ''),
    sizes: p.sizes || 'S, M, L, XL, XXL',
    priceRetail: Number(p.price_retail ?? p.priceRetail ?? 0),
    price_retail: Number(p.price_retail ?? p.priceRetail ?? 0),
    priceReseller: Number(p.price_reseller ?? p.priceReseller ?? 0),
    price_reseller: Number(p.price_reseller ?? p.priceReseller ?? 0),
    costBlank: Number(p.cost_blank ?? p.costBlank ?? 0),
    cost_blank: Number(p.cost_blank ?? p.costBlank ?? 0),
    costDtf: Number(p.cost_dtf ?? p.costDtf ?? 0),
    cost_dtf: Number(p.cost_dtf ?? p.costDtf ?? 0),
    featured: Boolean(p.featured),
    description: p.description || '',

    // Curated Design Sourcing & Financial Economics
    designSource,
    design_source: designSource,
    designCost,
    design_cost: designCost,
    amortizationTarget,
    amortization_target: amortizationTarget,
    royaltyAmount,
    royalty_amount: royaltyAmount,
    creatorName,
    creator_name: creatorName,
    creatorHandle,
    creator_handle: creatorHandle,
    creatorPayoutAccount,
    creator_payout_account: creatorPayoutAccount,
    licenseSource,
    license_source: licenseSource,
    designBurdenPerPiece,

    // Auto-Pricing & Customization Metadata
    printSize,
    print_size: printSize,
    primaryGarment,
    primary_garment: primaryGarment,
    compatibleGarments,
    compatible_garments: compatibleGarments,
    curatedColors,
    curated_colors: curatedColors,
    designTier,
    design_tier: designTier,
    designValue,
    design_value: designValue,
    resellerDiscountPercent,
    reseller_discount_percent: resellerDiscountPercent,
    printPreset,
    print_preset: printPreset,
    printPlacements,
    print_placements: printPlacements,

    variantImages,
    variant_images: variantImages,
    generalImages: p.general_images ?? p.generalImages ?? null,
    sizeGuideUrl: p.size_guide_url ?? p.sizeGuideUrl ?? null,
    story_behind: p.story_behind ?? ''
  };
}

export async function getProducts() {
  const getFallback = () => {
    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const sanitized = sanitizeCatalog(parsed);
          return sanitized.map(normalizeProduct);
        } catch (e) {
          // parsing error
        }
      }
    }
    return [];
  };

  try {
    const { data, error } = await supabase
      .from('ts_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn("Supabase ts_products fetch notice, using clean cache fallback:", error.message);
      return getFallback();
    }

    if (!data || data.length === 0) {
      return getFallback();
    }

    // Process and filter real Supabase products (removes legacy demo seeds)
    const sanitized = sanitizeCatalog(data);
    const normalized = sanitized.map(normalizeProduct);

    // Cache to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch (err) {
    console.warn("Network notice during getProducts, checking clean cache:", err);
    return getFallback();
  }
}

export async function saveProduct(product) {
  const normalizedInput = normalizeProduct(product);

  // Unmark if previously deleted
  unmarkSkuAsDeleted(normalizedInput.sku);

  // Update local storage first for instant feedback
  const current = await getProducts();
  const index = current.findIndex(p => p.sku === normalizedInput.sku);
  let updated;
  if (index !== -1) {
    updated = [...current];
    updated[index] = { ...updated[index], ...normalizedInput };
  } else {
    updated = [normalizedInput, ...current];
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }

  // Sync to Supabase
  try {
    const metaPayload = {
      designSource: normalizedInput.designSource,
      designCost: normalizedInput.designCost,
      amortizationTarget: normalizedInput.amortizationTarget,
      royaltyAmount: normalizedInput.royaltyAmount,
      creatorName: normalizedInput.creatorName,
      creatorHandle: normalizedInput.creatorHandle,
      creatorPayoutAccount: normalizedInput.creatorPayoutAccount,
      licenseSource: normalizedInput.licenseSource,
      // Auto-pricing & customization metadata
      printSize: normalizedInput.printSize,
      primaryGarment: normalizedInput.primaryGarment,
      compatibleGarments: normalizedInput.compatibleGarments,
      curatedColors: normalizedInput.curatedColors,
      designTier: normalizedInput.designTier,
      designValue: normalizedInput.designValue,
      resellerDiscountPercent: normalizedInput.resellerDiscountPercent,
      printPreset: normalizedInput.printPreset,
      printPlacements: normalizedInput.printPlacements,
      variantImages: normalizedInput.variantImages
    };

    const supabasePayload = {
      sku: normalizedInput.sku,
      name: normalizedInput.name,
      series: normalizedInput.series,
      series_name: normalizedInput.seriesName || normalizedInput.name,
      series_color: normalizedInput.seriesColor || '#4A4A47',
      niche: normalizedInput.niche,
      batch: normalizedInput.batch || 'Batch 1',
      template: normalizedInput.template || 'blank',
      file_path: normalizedInput.filePath,
      price_retail: normalizedInput.priceRetail,
      price_reseller: normalizedInput.priceReseller,
      cost_blank: normalizedInput.costBlank,
      cost_dtf: normalizedInput.costDtf,
      colors: normalizedInput.colors,
      sizes: normalizedInput.sizes,
      description: normalizedInput.description,
      status: normalizedInput.status || 'active',
      featured: normalizedInput.featured,
      variant_images: normalizedInput.variantImages || null,
      // Curated columns natively in Supabase
      creator_name: normalizedInput.creatorName,
      royalty_amount: normalizedInput.royaltyAmount,
      license_source: normalizedInput.licenseSource,
      story_behind: JSON.stringify(metaPayload),
      design_source: normalizedInput.designSource || 'in_house',
      design_cost: normalizedInput.designCost || 0,
      amortization_target: normalizedInput.amortizationTarget || 25,
      creator_handle: normalizedInput.creatorHandle || null,
      creator_payout_account: normalizedInput.creatorPayoutAccount || null
    };

    const { error: sbError } = await supabase.from('ts_products').upsert(supabasePayload);
    if (sbError) {
      console.error("Supabase ts_products upsert error:", sbError);
      throw new Error(`Supabase (${sbError.code}): ${sbError.message}`);
    }

    // Also sync to ts_unit_economics in Supabase
    try {
      await supabase.from('ts_unit_economics').upsert({
        product_sku: normalizedInput.sku,
        cost_blank: normalizedInput.costBlank,
        cost_dtf: normalizedInput.costDtf,
        cost_press: 2000,
        cost_pack: 3000,
        cost_overhead: 1000,
        cost_design: normalizedInput.designValue || 16000,
        price_retail: normalizedInput.priceRetail,
        price_reseller: normalizedInput.priceReseller,
        price_dropship: Math.round(normalizedInput.priceRetail * 0.88),
        print_area: normalizedInput.printPreset || normalizedInput.printSize || 'A3+',
        updated_at: new Date().toISOString()
      }, { onConflict: 'product_sku' });
    } catch (ueErr) {
      console.warn("Notice updating ts_unit_economics in Supabase:", ueErr);
    }
  } catch (err) {
    console.warn("Could not sync to Supabase:", err);
    throw err;
  }

  return updated;
}

export async function deleteProduct(sku) {
  markSkuAsDeleted(sku);

  // Sync delete to Supabase
  try {
    await supabase.from('ts_products').delete().eq('sku', sku);
  } catch (err) {
    console.warn("Could not delete from Supabase:", err);
  }

  // Update local storage
  const current = await getProducts();
  const updated = current.filter(p => p.sku !== sku);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export async function clearAllProducts() {
  const current = await getProducts();
  current.forEach(p => markSkuAsDeleted(p.sku));

  try {
    await supabase.from('ts_products').delete().neq('sku', 'KEEP_NONE');
  } catch (err) {
    console.warn("Could not clear products from Supabase:", err);
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
  return [];
}
