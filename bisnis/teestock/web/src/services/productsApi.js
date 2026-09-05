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
          if (seed && seed.series === 'blank') {
            return {
              ...p,
              colors: seed.colors,
              sizes: seed.sizes,
              filePath: seed.filePath,
              cititexCatId: seed.cititexCatId,
              priceRetail: seed.priceRetail,
              priceReseller: seed.priceReseller,
              costBlank: seed.costBlank,
              description: seed.description
            };
          }
          return p;
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
    
    // Cache locally
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch (err) {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!cached) return SEED_PRODUCTS;
    try {
      const parsed = JSON.parse(cached);
      const seedMap = new Map(SEED_PRODUCTS.map(p => [p.sku, p]));
      const updated = parsed.map(p => {
        const seed = seedMap.get(p.sku);
        if (seed && seed.series === 'blank') {
          return {
            ...p,
            colors: seed.colors,
            sizes: seed.sizes,
            filePath: seed.filePath,
            cititexCatId: seed.cititexCatId,
            priceRetail: seed.priceRetail,
            priceReseller: seed.priceReseller,
            costBlank: seed.costBlank,
            description: seed.description
          };
        }
        return p;
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
