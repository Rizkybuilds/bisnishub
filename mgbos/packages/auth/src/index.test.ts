import { describe, it, expect, vi } from 'vitest';
import { authenticateWithPassword, verifySessionToken } from './index';

describe('Auth client functions', () => {
  it('rejects invalid email formats without network request', async () => {
    const result = await authenticateWithPassword(
      { email: 'bad-email', password: 'password123' },
      { supabaseUrl: 'http://localhost:55431', publishableKey: 'test-key' },
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Invalid email');
    }
  });

  it('rejects empty or missing token in verifySessionToken', async () => {
    const result = await verifySessionToken('', {
      supabaseUrl: 'http://localhost:55431',
      publishableKey: 'test-key',
    });

    expect(result.valid).toBe(false);
  });

  it('handles simulated successful authentication', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: 'fake-jwt-token',
        user: {
          id: '00000000-0000-0000-0000-000000000099',
          email: 'founder@multigraph.id',
        },
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await authenticateWithPassword(
      { email: 'founder@multigraph.id', password: 'mgbos-founder-2026' },
      { supabaseUrl: 'http://localhost:55431', publishableKey: 'test-key' },
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.accessToken).toBe('fake-jwt-token');
      expect(result.user.email).toBe('founder@multigraph.id');
    }

    vi.unstubAllGlobals();
  });

  describe('Role-based Authority & Permissions', () => {
    const mockSession = (roleCode: string) => ({
      user: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        authUserId: '123e4567-e89b-12d3-a456-426614174002',
        name: 'Test User',
        email: 'test@example.com',
      },
      organization: {
        id: '123e4567-e89b-12d3-a456-426614174003',
        code: 'multigraph-group',
        displayName: 'MultiGraph Group',
      },
      role: {
        code: roleCode,
        name: `${roleCode} Role`,
      },
      activeBrand: {
        code: 'TS',
        name: 'TeeStock',
      },
    });

    it('grants full lead and customer mutation permissions to OWNER, ADMIN, and SALES', async () => {
      const { hasPermission, checkPermission } = await import('./index');

      for (const role of ['OWNER', 'ADMIN', 'SALES']) {
        expect(hasPermission(role, 'leads:create')).toBe(true);
        expect(hasPermission(role, 'leads:qualify')).toBe(true);
        expect(hasPermission(role, 'leads:disqualify')).toBe(true);
        expect(hasPermission(role, 'leads:convert')).toBe(true);
        expect(hasPermission(role, 'customers:create')).toBe(true);
        expect(hasPermission(role, 'requirements:create')).toBe(true);
        expect(hasPermission(role, 'requirements:version')).toBe(true);
        expect(hasPermission(role, 'requirements:lock')).toBe(true);

        const session = mockSession(role);
        expect(checkPermission(session, 'leads:convert').allowed).toBe(true);
        expect(checkPermission(session, 'requirements:create').allowed).toBe(
          true,
        );
      }
    });

    it('denies lead and customer mutations to QC, FINANCE, and OPERATIONS roles', async () => {
      const { hasPermission, checkPermission } = await import('./index');

      for (const role of ['QC', 'FINANCE', 'OPERATIONS']) {
        expect(hasPermission(role, 'leads:create')).toBe(false);
        expect(hasPermission(role, 'leads:qualify')).toBe(false);
        expect(hasPermission(role, 'leads:disqualify')).toBe(false);
        expect(hasPermission(role, 'leads:convert')).toBe(false);
        expect(hasPermission(role, 'customers:create')).toBe(false);
        expect(hasPermission(role, 'requirements:create')).toBe(false);

        // But read access is allowed
        expect(hasPermission(role, 'leads:read')).toBe(true);
        expect(hasPermission(role, 'customers:read')).toBe(true);
        expect(hasPermission(role, 'requirements:read')).toBe(true);

        const session = mockSession(role);
        const check = checkPermission(session, 'leads:convert');
        expect(check.allowed).toBe(false);
        if (!check.allowed) {
          expect(check.error).toContain(
            `peran '${role}' tidak memiliki izin 'leads:convert'`,
          );
        }
      }
    });

    it('allows OPERATIONS to create requirement versions for atelier collaboration', async () => {
      const { hasPermission, checkPermission } = await import('./index');

      expect(hasPermission('OPERATIONS', 'requirements:version')).toBe(true);
      const session = mockSession('OPERATIONS');
      expect(checkPermission(session, 'requirements:version').allowed).toBe(
        true,
      );
    });

    it('safely denies undefined or unrecognized roles', async () => {
      const { hasPermission, checkPermission } = await import('./index');

      expect(hasPermission(null, 'leads:create')).toBe(false);
      expect(hasPermission(undefined, 'leads:create')).toBe(false);
      expect(hasPermission('GUEST', 'leads:create')).toBe(false);

      const session = mockSession('GUEST');
      expect(checkPermission(session, 'leads:create').allowed).toBe(false);
    });
  });
});
