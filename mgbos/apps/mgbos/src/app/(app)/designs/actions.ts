'use server';
import { revalidatePath } from 'next/cache';
import { assertPermission } from '@mgbos/auth';
import { saveDemoDesignSchema } from '@mgbos/validation';
import { designContext } from './data';

export async function saveDesign(
  input: unknown,
): Promise<{ id?: string; error?: string }> {
  const parsed = saveDemoDesignSchema.safeParse(input);
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? 'Data tidak valid.' };
  const ctx = await designContext();
  assertPermission(ctx.session, 'designs:write');
  const value = parsed.data;
  try {
    const response = await fetch(ctx.endpoint + 'rpc/save_demo_design', {
      method: 'POST',
      headers: ctx.headers,
      body: JSON.stringify({
        p_org: ctx.session.organization.id,
        p_actor: ctx.session.user.id,
        p_request: value.requestId,
        p_asset: value.assetId,
        p_expected: value.expected,
        p_data: value.data,
      }),
    });
    if (!response.ok) {
      const error = (await response.json()) as {
        message?: string;
        code?: string;
      };
      if (error.message === 'Design changed; reload before revising')
        return {
          error:
            'Desain telah berubah. Muat ulang halaman sebelum menyimpan revisi.',
        };
      if (error.code === '23505')
        return { error: 'Kode DEMO sudah digunakan. Pilih kode lain.' };
      if (error.message === 'Request payload mismatch')
        return {
          error:
            'Permintaan sebelumnya sudah tersimpan. Muat ulang sebelum mengubah data.',
        };
      return {
        error: 'Desain gagal disimpan. Periksa data atau muat ulang halaman.',
      };
    }
    const id: unknown = await response.json();
    if (typeof id !== 'string')
      return {
        error: 'Respons tidak valid. Muat ulang untuk memeriksa hasil.',
      };
    revalidatePath('/designs');
    return { id };
  } catch {
    return {
      error:
        'Koneksi terputus. Coba kembali dengan data yang sama; permintaan ulang tidak menggandakan revisi.',
    };
  }
}
