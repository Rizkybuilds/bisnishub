import { supabase } from './supabase';
import { SEED_PRODUCTS } from '../constants/seedData';

const LOCAL_STORAGE_KEY = 'teestock_catalog_products';

export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('ts_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!cached) return SEED_PRODUCTS;
      try {
        const parsed = JSON.parse(cached);
        const seedMap = new Map(SEED_PRODUCTS.map(p => [p.sku, p]));
        const updated = parsed.map(p => {
          const seed = seedMap.get(p.sku);
          if (!seed) return p;
          return {
            ...p,
            variantImages: seed.variantImages,
            generalImages: seed.generalImages,
            colors: seed.colors || p.colors,
            sizes: seed.sizes || p.sizes,
            ...(seed.series === 'blank' ? {
              filePath: seed.filePath,
              cititexCatId: seed.cititexCatId,
              priceRetail: seed.priceRetail,
              priceReseller: seed.priceReseller,
              costBlank: seed.costBlank,
              description: seed.description
            } : {})
          };
        });
        const existingSkus = new Set(updated.map(p => p.sku));
        const missing = SEED_PRODUCTS.filter(p => !existingSkus.has(p.sku));
        const finalProducts = [...updated, ...missing];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalProducts));
        return finalProducts;
      } catch (e) {
        return SEED_PRODUCTS;
      }
    }
    
    // Merge DB products with SEED_PRODUCTS to guarantee full catalog availability
    const seedMap = new Map(SEED_PRODUCTS.map(p => [p.sku, p]));
    const dbSkus = new Set(data.map(p => p.sku));
    const enrichedDb = data.map(p => {
      const seed = seedMap.get(p.sku);
      return {
        ...seed,
        ...p,
        priceRetail: p.price_retail ?? p.priceRetail ?? seed?.priceRetail,
        priceReseller: p.price_reseller ?? p.priceReseller ?? seed?.priceReseller,
        costBlank: p.cost_blank ?? p.costBlank ?? seed?.costBlank,
        costDtf: p.cost_dtf ?? p.costDtf ?? seed?.costDtf,
        filePath: p.file_path ?? p.filePath ?? seed?.filePath,
        seriesName: p.series_name ?? p.seriesName ?? seed?.seriesName,
        seriesColor: p.series_color ?? p.seriesColor ?? seed?.seriesColor,
        variantImages: p.variant_images ?? p.variantImages ?? seed?.variantImages,
        generalImages: p.general_images ?? p.generalImages ?? seed?.generalImages,
        colors: p.colors || seed?.colors,
        sizes: p.sizes || seed?.sizes
      };
    });
    const missing = SEED_PRODUCTS.filter(p => !dbSkus.has(p.sku));
    const finalProducts = [...enrichedDb, ...missing];

    // Cache locally
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalProducts));
    return finalProducts;
  } catch (err) {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!cached) return SEED_PRODUCTS;
    try {
      const parsed = JSON.parse(cached);
      const seedMap = new Map(SEED_PRODUCTS.map(p => [p.sku, p]));
      const updated = parsed.map(p => {
        const seed = seedMap.get(p.sku);
        if (!seed) return p;
        return {
          ...p,
          variantImages: seed.variantImages,
          generalImages: seed.generalImages,
          colors: seed.colors || p.colors,
          sizes: seed.sizes || p.sizes,
          ...(seed.series === 'blank' ? {
            filePath: seed.filePath,
            cititexCatId: seed.cititexCatId,
            priceRetail: seed.priceRetail,
            priceReseller: seed.priceReseller,
            costBlank: seed.costBlank,
            description: seed.description
          } : {})
        };
      });
      const existingSkus = new Set(updated.map(p => p.sku));
      const missing = SEED_PRODUCTS.filter(p => !existingSkus.has(p.sku));
      const finalProducts = [...updated, ...missing];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalProducts));
      return finalProducts;
    } catch (e) {
      return SEED_PRODUCTS;
    }
  }
}

export async function saveProduct(product) {
  // Update local storage first
  const current = await getProducts();
  const index = current.findIndex(p => p.sku === product.sku);
  let updated;
  if (index !== -1) {
    updated = [...current];
    updated[index] = { ...updated[index], ...product };
  } else {
    updated = [product, ...current];
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

  // Try sync to Supabase
  try {
    await supabase.from('ts_products').upsert({
      sku: product.sku,
      name: product.name,
      series: product.series,
      niche: product.niche,
      file_path: product.filePath || product.file_path,
      price_retail: product.priceRetail || product.price_retail,
      price_reseller: product.priceReseller || product.price_reseller,
      status: product.status || 'active'
    });
  } catch (err) {
    console.warn("Could not sync to Supabase:", err);
  }

  return updated;
}
