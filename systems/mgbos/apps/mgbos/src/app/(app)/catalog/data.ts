import 'server-only';
import { requireAuth } from '@/lib/session.server';
import { publicEnvironment } from '@/lib/env.client';
import { serverEnvironment } from '@/lib/env.server';
import type {
  CatalogProductDetails,
  CatalogVariantInput,
} from '@mgbos/validation';

export interface CatalogProductRow {
  id: string;
  slug: string;
  title: string;
  collection_name: string;
  description: string;
  details: CatalogProductDetails;
  mockup_path: string | null;
  artwork_path: string | null;
  rights_status: 'PENDING' | 'APPROVED';
  sample_status: 'PENDING' | 'PASSED';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  variants: CatalogVariantInput[];
  version: number;
  updated_at: string;
}

export async function catalogContext() {
  const session = await requireAuth();
  if (
    session.activeBrand.code !== 'TS' ||
    !['OWNER', 'ADMIN'].includes(session.role.code)
  ) {
    throw new Error('Hanya Owner/Admin TeeStock yang boleh mengelola katalog.');
  }
  const base = publicEnvironment.NEXT_PUBLIC_SUPABASE_URL;
  const key = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error('Database katalog belum dikonfigurasi.');

  const endpoint = base.replace(/\/+$/, '') + '/rest/v1';
  const headers = {
    apikey: key,
    Authorization: 'Bearer ' + key,
    'Content-Type': 'application/json',
    'Accept-Profile': 'app',
    'Content-Profile': 'app',
  };
  const query = new URLSearchParams({
    organization_id: 'eq.' + session.organization.id,
    code: 'eq.TS',
    status: 'eq.ACTIVE',
    select: 'id',
    limit: '1',
  });
  const response = await fetch(endpoint + '/brands?' + query, {
    headers,
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Brand TeeStock belum bisa diverifikasi.');
  const rows = (await response.json()) as { id: string }[];
  if (!rows[0]) throw new Error('Brand TeeStock aktif tidak ditemukan.');
  return {
    session,
    base: base.replace(/\/+$/, ''),
    endpoint,
    headers,
    brandId: rows[0].id,
  };
}

export async function listCatalogProducts(): Promise<{
  products: CatalogProductRow[];
  base: string;
}> {
  const ctx = await catalogContext();
  const query = new URLSearchParams({
    organization_id: 'eq.' + ctx.session.organization.id,
    brand_id: 'eq.' + ctx.brandId,
    select:
      'id,slug,title,collection_name,description,details,mockup_path,artwork_path,rights_status,sample_status,status,variants,version,updated_at',
    order: 'updated_at.desc',
    limit: '100',
  });
  const response = await fetch(
    ctx.endpoint + '/teestock_catalog_products?' + query,
    {
      headers: ctx.headers,
      cache: 'no-store',
    },
  );
  if (!response.ok)
    throw new Error('Katalog belum dapat dimuat. Periksa migrasi database.');
  return {
    products: (await response.json()) as CatalogProductRow[],
    base: ctx.base,
  };
}

export function publicMockupUrl(
  base: string,
  path: string | null,
): string | null {
  if (
    !path ||
    !/^[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(png|jpg|webp)$/.test(path)
  )
    return null;
  return (
    base.replace(/\/+$/, '') +
    '/storage/v1/object/public/teestock-mockups/' +
    path
  );
}
