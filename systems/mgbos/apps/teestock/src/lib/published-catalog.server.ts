import 'server-only';
import { publicEnvironment } from './env.client';
import { serverEnvironment } from './env.server';

export interface StorefrontVariant {
  sku: string;
  size: string;
  color: string;
  priceIdr: number;
}
export interface StorefrontProduct {
  slug: string;
  title: string;
  collectionName: string;
  description: string;
  mockupUrl: string;
  variants: StorefrontVariant[];
}

type RawProduct = {
  slug: string;
  title: string;
  collection_name: string;
  description: string;
  mockup_path: string;
  variants: Array<{ sku: string; size: string; color: string; priceIdr: number }>;
};

function validatePublicPath(value: string): boolean {
  return /^[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(png|jpg|webp)$/.test(value);
}

/**
 * Public projection only: NEVER forward full catalog records or cost/artwork fields.
 * Uses a trusted server-to-server key and an explicit brand/org filter.
 * When not configured, keep the existing studio preview experience.
 */
export async function listPublishedProducts(slug?: string): Promise<StorefrontProduct[]> {
  const base = publicEnvironment.NEXT_PUBLIC_SUPABASE_URL;
  const key = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return [];
  const orgCode = process.env.TEESTOCK_CATALOG_ORG_CODE || 'multigraph-group';
  if (!/^[a-z0-9-]{2,64}$/.test(orgCode)) return [];

  const endpoint = base.replace(/\/+$/, '') + '/rest/v1';
  const headers = {
    apikey: key,
    Authorization: 'Bearer ' + key,
    'Accept-Profile': 'app',
  };
  const orgQuery = new URLSearchParams({
    code: 'eq.' + orgCode, status: 'eq.ACTIVE', select: 'id', limit: '1',
  });
  try {
    const orgResponse = await fetch(endpoint + '/organizations?' + orgQuery, {
      headers, cache: 'no-store',
    });
    if (!orgResponse.ok) return [];
    const orgs = await orgResponse.json() as { id: string }[];
    if (!orgs[0]) return [];

    const brandQuery = new URLSearchParams({
      organization_id: 'eq.' + orgs[0].id, code: 'eq.TS',
      status: 'eq.ACTIVE', select: 'id', limit: '1',
    });
    const brandResponse = await fetch(endpoint + '/brands?' + brandQuery, {
      headers, cache: 'no-store',
    });
    if (!brandResponse.ok) return [];
    const brands = await brandResponse.json() as { id: string }[];
    if (!brands[0]) return [];

    const productQuery = new URLSearchParams({
      organization_id: 'eq.' + orgs[0].id,
      brand_id: 'eq.' + brands[0].id,
      status: 'eq.PUBLISHED',
      select: 'slug,title,collection_name,description,mockup_path,variants',
      order: 'updated_at.desc',
      limit: slug ? '1' : '60',
    });
    if (slug) productQuery.set('slug', 'eq.' + slug);
    const response = await fetch(endpoint + '/teestock_catalog_products?' + productQuery, {
      headers, cache: 'no-store',
    });
    if (!response.ok) return [];
    const rows = await response.json() as RawProduct[];
    return rows.flatMap((row): StorefrontProduct[] => {
      if (!row.mockup_path || !validatePublicPath(row.mockup_path) ||
        !Array.isArray(row.variants) || row.variants.length === 0) return [];
      const variants = row.variants
        .filter((variant) => Number.isSafeInteger(variant.priceIdr) && variant.priceIdr > 0)
        .map(({ sku, size, color, priceIdr }) => ({ sku, size, color, priceIdr }));
      if (!variants.length) return [];
      return [{
        slug: row.slug,
        title: row.title,
        collectionName: row.collection_name,
        description: row.description,
        mockupUrl: base.replace(/\/+$/, '') + '/storage/v1/object/public/teestock-mockups/' + row.mockup_path,
        variants,
      }];
    });
  } catch {
    return [];
  }
}
