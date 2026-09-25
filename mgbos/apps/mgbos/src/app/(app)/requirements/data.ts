import 'server-only';
import { serverEnvironment } from '@/lib/env.server';
import { publicEnvironment } from '@/lib/env.client';
import { requireAuth } from '@/lib/session.server';
import { assertPermission } from '@mgbos/auth';

export async function requirementContext() {
  const session = await requireAuth();
  assertPermission(session, 'requirements:read');
  const base = publicEnvironment.NEXT_PUBLIC_SUPABASE_URL;
  const key = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error('Database belum dikonfigurasi.');
  const headers = {
    apikey: key,
    Authorization: 'Bearer ' + key,
    'Content-Type': 'application/json',
    'Accept-Profile': 'app',
    'Content-Profile': 'app',
  };
  return { session, endpoint: base.replace(/\/+$/, '') + '/rest/v1', headers };
}
export async function readRows<T>(
  path: string,
  ctx: Awaited<ReturnType<typeof requirementContext>>,
): Promise<T[]> {
  const response = await fetch(ctx.endpoint + '/' + path, {
    headers: ctx.headers,
    cache: 'no-store',
  });
  if (!response.ok)
    throw new Error('Data requirement tidak dapat dimuat. Coba lagi.');
  return response.json() as Promise<T[]>;
}
export interface RequirementRow {
  id: string;
  title: string;
  requirement_number: string;
  status: string;
  current_version_id: string | null;
  brand_id: string;
  lead_id: string | null;
  customer_account_id: string | null;
}
export interface VersionRow {
  id: string;
  version_number: number;
  summary: string;
  quantity: number | null;
  unit: string;
  target_budget: string | null;
  target_date: string | null;
  specification: Record<string, unknown>;
  is_locked: boolean;
  locked_reason: string | null;
  created_at: string;
}
