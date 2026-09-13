import { supabase } from './supabase';
import { SEED_PRODUCTS } from '../constants/seedData';

const LOCAL_STORAGE_KEY = 'teestock_catalog_products';

/**
 * Filter out any legacy mockup seed products that might be lingering in browser localStorage
 */
function sanitizeCatalog(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(p => {
    if (!p || !p.sku) return false;
    // Reject legacy dummy SKUs from the development mockup phase
    const isMockSku = /^(TS-PRO-|TS-KOM-|TS-LOK-|TS-REC-|TS-FAN-)/.test(p.sku);
    return !isMockSku;
  });
}

/**
 * Standardize product data structure between PostgreSQL snake_case and UI camelCase
 */
export function normalizeProduct(p) {
  if (!p) return null;
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
    colors: p.colors || '',
    sizes: p.sizes || '',
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
    variantImages: p.variant_images ?? p.variantImages ?? null,
    generalImages: p.general_images ?? p.generalImages ?? null,
    sizeGuideUrl: p.size_guide_url ?? p.sizeGuideUrl ?? null
  };
}

export async function getProducts() {
  const getFallback = () => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const sanitized = sanitizeCatalog(parsed);
        if (sanitized.length > 0) return sanitized.map(normalizeProduct);
      } catch (e) {
        // parsing error
      }
    }
    return SEED_PRODUCTS.map(normalizeProduct);
  };

  try {
    const { data, error } = await supabase
      .from('ts_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn("Supabase ts_products fetch error, using local cache / seed fallback:", error.message);
      return getFallback();
    }

    if (!data || data.length === 0) {
      // Supabase returned clean 0 products - use seed products as initial catalog
      return getFallback();
    }

    // Process and normalize real Supabase products
    const normalized = data.map(normalizeProduct);

    // Cache to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch (err) {
    console.warn("Network error during getProducts, checking cache / seed:", err);
    return getFallback();
  }
}

export async function saveProduct(product) {
  const normalizedInput = normalizeProduct(product);

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
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

  // Sync to Supabase
  try {
    await supabase.from('ts_products').upsert({
      sku: normalizedInput.sku,
      name: normalizedInput.name,
      series: normalizedInput.series,
      niche: normalizedInput.niche,
      file_path: normalizedInput.filePath,
      price_retail: normalizedInput.priceRetail,
      price_reseller: normalizedInput.priceReseller,
      cost_blank: normalizedInput.costBlank,
      cost_dtf: normalizedInput.costDtf,
      colors: normalizedInput.colors,
      sizes: normalizedInput.sizes,
      description: normalizedInput.description,
      status: normalizedInput.status || 'active',
      featured: normalizedInput.featured
    });
  } catch (err) {
    console.warn("Could not sync to Supabase:", err);
  }

  return updated;
}
