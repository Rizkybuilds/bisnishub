import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  verifySessionToken,
  SESSION_COOKIE_NAME,
  ACTIVE_BRAND_COOKIE_NAME,
} from '@mgbos/auth';
import type { SessionContext } from '@mgbos/domain';
import { publicEnvironment } from './env.client';
import { serverEnvironment } from './env.server';

interface DbUserLookup {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  status: string;
  organization_members: Array<{
    id: string;
    status: string;
    organization_id: string;
    organizations: {
      id: string;
      code: string;
      display_name: string;
      status: string;
    } | null;
    roles: {
      id: string;
      code: string;
      name: string;
    } | null;
  }>;
}

interface DbBrand {
  id: string;
  code: string;
  name: string;
}

export async function getSession(): Promise<SessionContext | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const supabaseUrl = publicEnvironment.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = publicEnvironment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const serviceKey = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publishableKey || !serviceKey) {
    return null;
  }

  const verification = await verifySessionToken(token, {
    supabaseUrl,
    publishableKey,
  });

  if (!verification.valid) {
    return null;
  }

  // Database verification: Lookup user profile, active organization membership, and real role
  const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1`;
  const headers: Record<string, string> = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Accept-Profile': 'app',
  };

  const userRes = await fetch(
    `${endpoint}/users?auth_user_id=eq.${verification.user.id}&status=eq.ACTIVE&select=id,auth_user_id,name,email,status,organization_members(id,status,organization_id,organizations(id,code,display_name,status),roles(id,code,name))`,
    { headers, cache: 'no-store' },
  );

  if (!userRes.ok) {
    return null;
  }

  const users: DbUserLookup[] = await userRes.json();
  const dbUser = users[0];

  if (!dbUser || dbUser.status !== 'ACTIVE') {
    return null;
  }

  // Reject users without an ACTIVE organization membership
  const activeMembership = dbUser.organization_members?.find(
    (m) =>
      m.status === 'ACTIVE' &&
      m.organizations?.status === 'ACTIVE' &&
      Boolean(m.roles),
  );

  if (
    !activeMembership ||
    !activeMembership.organizations ||
    !activeMembership.roles
  ) {
    return null;
  }

  const org = activeMembership.organizations;
  const role = activeMembership.roles;

  // Resolve active brand within the organization from database
  const brandsRes = await fetch(
    `${endpoint}/brands?organization_id=eq.${org.id}&status=eq.ACTIVE&select=id,code,name&order=code.asc`,
    { headers, cache: 'no-store' },
  );

  const brands: DbBrand[] = brandsRes.ok ? await brandsRes.json() : [];
  const requestedBrandCode = cookieStore.get(ACTIVE_BRAND_COOKIE_NAME)?.value;

  const activeBrand = brands.find((b) => b.code === requestedBrandCode) ??
    brands.find((b) => b.code === 'TS') ??
    brands[0] ?? { code: 'TS', name: 'TeeStock' };

  return {
    user: {
      id: dbUser.id,
      authUserId: verification.user.id,
      name: dbUser.name,
      email: dbUser.email,
    },
    organization: {
      id: org.id,
      code: org.code,
      displayName: org.display_name,
    },
    role: {
      code: role.code,
      name: role.name,
    },
    activeBrand: {
      code: activeBrand.code,
      name: activeBrand.name,
    },
  };
}

export async function requireAuth(): Promise<SessionContext> {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}
