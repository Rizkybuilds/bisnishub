'use server';

import { revalidatePath } from 'next/cache';
import { catalogProductSchema } from '@mgbos/validation';
import { catalogContext, publicMockupUrl } from './data';

export type CatalogSaveResult = { id?: string; version?: number; error?: string };
export type CatalogUploadResult = {
  path?: string;
  previewUrl?: string;
  error?: string;
};

export async function saveCatalogProductAction(input: unknown): Promise<CatalogSaveResult> {
  const parsed = catalogProductSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Data produk tidak valid.' };
  }
  const p = parsed.data;
  try {
    const ctx = await catalogContext();
    const prefix = ctx.session.organization.id + '/' + ctx.brandId + '/';
    if ((p.mockupPath && !p.mockupPath.startsWith(prefix)) ||
        (p.artworkPath && !p.artworkPath.startsWith(prefix))) {
      return { error: 'File produk harus berasal dari TeeStock organisasi aktif.' };
    }
    const response = await fetch(ctx.endpoint + '/rpc/save_teestock_catalog_product', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_org: ctx.session.organization.id,
        p_actor: ctx.session.user.id,
        p_product: p.id,
        p_expected_version: p.expectedVersion,
        p_payload: {
          slug: p.slug, title: p.title, collectionName: p.collectionName,
          description: p.description, mockupPath: p.mockupPath,
          artworkPath: p.artworkPath, rightsStatus: p.rightsStatus,
          sampleStatus: p.sampleStatus, status: p.status, variants: p.variants,
        },
      }),
      cache: 'no-store',
    });
    if (!response.ok) {
      const details = await response.json().catch(() => null) as { message?: string; code?: string } | null;
      if (details?.code === '23505') return { error: 'Slug produk sudah dipakai. Gunakan slug lain.' };
      if (details?.message?.includes('changed or unavailable')) {
        return { error: 'Produk telah berubah. Muat ulang sebelum mengedit.' };
      }
      return { error: 'Tidak dapat menyimpan produk. Periksa hak, sampel, varian, dan data lainnya.' };
    }
    const result = await response.json() as { id?: string; version?: number };
    if (!result.id || !result.version) return { error: 'Respons penyimpanan tidak valid.' };
    revalidatePath('/catalog');
    return { id: result.id, version: result.version };
  } catch {
    return { error: 'Koneksi atau otorisasi katalog gagal. Coba muat ulang.' };
  }
}

function detectFileType(bytes: Uint8Array): { type: string; extension: string } | null {
  const starts = (signature: number[]) => signature.every((n, i) => bytes[i] === n);
  if (starts([137, 80, 78, 71, 13, 10, 26, 10])) {
    return { type: 'image/png', extension: 'png' };
  }
  if (starts([255, 216, 255])) {
    return { type: 'image/jpeg', extension: 'jpg' };
  }
  if (starts([82, 73, 70, 70]) &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP') {
    return { type: 'image/webp', extension: 'webp' };
  }
  if (starts([37, 80, 68, 70, 45])) {
    return { type: 'application/pdf', extension: 'pdf' };
  }
  return null;
}

export async function uploadCatalogAssetAction(form: FormData): Promise<CatalogUploadResult> {
  try {
    const ctx = await catalogContext();
    const kind = form.get('kind');
    const asset = form.get('file');
    if ((kind !== 'mockup' && kind !== 'artwork') || !(asset instanceof File)) {
      return { error: 'Pilih jenis file dan berkas yang sesuai.' };
    }
    const maxBytes = kind === 'mockup' ? 5 * 1024 * 1024 : 20 * 1024 * 1024;
    if (asset.size < 1 || asset.size > maxBytes) {
      return { error: kind === 'mockup' ? 'Maksimum mockup 5 MB.' : 'Maksimum artwork 20 MB.' };
    }
    const bytes = new Uint8Array(await asset.arrayBuffer());
    const detected = detectFileType(bytes);
    const allow = kind === 'mockup' ?
      ['image/png', 'image/jpeg', 'image/webp'] : ['image/png', 'application/pdf'];
    if (!detected || !allow.includes(detected.type) || asset.type !== detected.type) {
      return { error: 'Format berkas tidak sesuai. Mockup: PNG/JPG/WebP. Artwork: PNG/PDF.' };
    }
    const bucket = kind === 'mockup' ? 'teestock-mockups' : 'teestock-print-assets';
    const path = ctx.session.organization.id + '/' + ctx.brandId + '/' +
      crypto.randomUUID() + '.' + detected.extension;
    const response = await fetch(ctx.base + '/storage/v1/object/' + bucket + '/' + path, {
      method: 'POST',
      headers: {
        apikey: ctx.headers.apikey,
        Authorization: ctx.headers.Authorization,
        'Content-Type': detected.type,
        'x-upsert': 'false',
      },
      body: bytes,
      cache: 'no-store',
    });
    if (!response.ok) return { error: 'Upload gagal. Periksa bucket penyimpanan dan koneksi.' };
    return {
      path,
      previewUrl: kind === 'mockup' ? publicMockupUrl(ctx.base, path) ?? undefined : undefined,
    };
  } catch {
    return { error: 'File tidak dapat diunggah. Periksa akses dan koneksi.' };
  }
}
