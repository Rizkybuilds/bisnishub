import 'server-only';
import { serverEnvironment } from '@/lib/env.server';
import { publicEnvironment } from '@/lib/env.client';
import { requireAuth } from '@/lib/session.server';
import { assertPermission } from '@mgbos/auth';
import type { Database } from '@mgbos/database';

type AppTables = Database['app']['Tables'];

export type OperationalExceptionRow =
  AppTables['operational_exceptions']['Row'];

export type OperationalExceptionAuditRow =
  AppTables['operational_exception_audit']['Row'];

/**
 * Creates authenticated server-only context for operational exception operations.
 * Requires operational_exceptions:read permission.
 * Uses SUPABASE_SERVICE_ROLE_KEY strictly server-side with app schema profile.
 */
export async function exceptionsContext() {
  const session = await requireAuth();
  assertPermission(session, 'operational_exceptions:read');
  const base = publicEnvironment.NEXT_PUBLIC_SUPABASE_URL;
  const key = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) {
    throw new Error('Database belum dikonfigurasi.');
  }
  const headers = {
    apikey: key,
    Authorization: 'Bearer ' + key,
    'Content-Type': 'application/json',
    'Accept-Profile': 'app',
    'Content-Profile': 'app',
  };
  return {
    session,
    endpoint: base.replace(/\/+$/, '') + '/rest/v1',
    headers,
  };
}

/**
 * Internal scoped row fetcher for PostgREST endpoints within exceptions context.
 * Kept private to enforce that all external calls go through Organization-filtered helpers.
 */
async function readRows<T>(
  path: string,
  ctx: Awaited<ReturnType<typeof exceptionsContext>>,
): Promise<T[]> {
  const response = await fetch(`${ctx.endpoint}/${path}`, {
    headers: ctx.headers,
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(
      'Data operational exception tidak dapat dimuat. Coba lagi.',
    );
  }
  return response.json() as Promise<T[]>;
}

/**
 * Privileged read: list all operational exceptions for the authenticated organization.
 * Explicitly filters by organization_id to enforce organizational boundary.
 */
export async function listOperationalExceptions(
  ctx?: Awaited<ReturnType<typeof exceptionsContext>>,
): Promise<OperationalExceptionRow[]> {
  const context = ctx ?? (await exceptionsContext());
  const orgId = context.session.organization.id;
  const path = `operational_exceptions?organization_id=eq.${encodeURIComponent(
    orgId,
  )}&order=created_at.desc`;
  return readRows<OperationalExceptionRow>(path, context);
}

/**
 * Privileged read: get a single operational exception by ID within the authenticated organization.
 * Fails closed if the exception belongs to another organization.
 */
export async function getOperationalException(
  id: string,
  ctx?: Awaited<ReturnType<typeof exceptionsContext>>,
): Promise<OperationalExceptionRow | null> {
  const context = ctx ?? (await exceptionsContext());
  const orgId = context.session.organization.id;
  const path = `operational_exceptions?id=eq.${encodeURIComponent(
    id,
  )}&organization_id=eq.${encodeURIComponent(orgId)}&limit=1`;
  const rows = await readRows<OperationalExceptionRow>(path, context);
  return rows[0] ?? null;
}

/**
 * Privileged read: read audit/history log for an operational exception.
 * Requires explicit operational_exceptions:history_read permission.
 * Fails closed outside the authenticated organization.
 */
export async function getOperationalExceptionHistory(
  exceptionId: string,
  ctx?: Awaited<ReturnType<typeof exceptionsContext>>,
): Promise<OperationalExceptionAuditRow[]> {
  const context = ctx ?? (await exceptionsContext());
  assertPermission(context.session, 'operational_exceptions:history_read');
  const orgId = context.session.organization.id;
  const path = `operational_exception_audit?operational_exception_id=eq.${encodeURIComponent(
    exceptionId,
  )}&organization_id=eq.${encodeURIComponent(orgId)}&order=created_at.asc`;
  return readRows<OperationalExceptionAuditRow>(path, context);
}
