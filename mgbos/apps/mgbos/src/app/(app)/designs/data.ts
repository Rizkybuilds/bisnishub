import 'server-only';
import { requireAuth } from '@/lib/session.server';
import { publicEnvironment } from '@/lib/env.client';
import { serverEnvironment } from '@/lib/env.server';
import { assertPermission } from '@mgbos/auth';
import type { DemoDesignInput } from '@mgbos/validation';

export async function designContext() {
  const session = await requireAuth();
  assertPermission(session, 'designs:read');
  if (session.activeBrand.code !== 'TS')
    throw new Error('Pilih brand TeeStock untuk membuka library.');
  const url = new URL(
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL ?? 'http://invalid',
  );
  if (
    !['127.0.0.1', 'localhost'].includes(url.hostname) ||
    url.port !== '55431' ||
    url.protocol !== 'http:'
  )
    throw new Error('Library DEMO hanya tersedia pada database lokal MGBOS.');
  const key = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('Database lokal belum dikonfigurasi.');
  return {
    session,
    endpoint: url.origin + '/rest/v1/',
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/json',
      'Accept-Profile': 'app',
      'Content-Profile': 'app',
    },
  };
}
export type DesignVersion = Omit<DemoDesignInput, 'code'> & {
  version_number: number;
  created_at: string;
  created_by: string;
};
export type DesignRow = {
  id: string;
  code: string;
  current_version: number;
  design_asset_versions: DesignVersion[];
};
export async function readDesigns(
  ctx: Awaited<ReturnType<typeof designContext>>,
  id?: string,
) {
  const query = new URLSearchParams({
    organization_id: 'eq.' + ctx.session.organization.id,
    select:
      'id,code,current_version,design_asset_versions!design_asset_versions_asset_id_fkey(title,theme,story,placement,version_number,created_at,created_by)',
    order: 'created_at.desc,id',
    limit: '201',
  });
  if (id) query.set('id', 'eq.' + id);
  const response = await fetch(ctx.endpoint + 'design_assets?' + query, {
    headers: ctx.headers,
    cache: 'no-store',
  });
  if (!response.ok)
    throw new Error(
      'Library belum dapat dimuat. Pastikan migrasi lokal sudah diterapkan.',
    );
  return (await response.json()) as DesignRow[];
}
