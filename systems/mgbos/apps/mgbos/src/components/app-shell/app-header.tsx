import Link from 'next/link';
import type { SessionContext } from '@mgbos/domain';
import { handleLogout, handleSwitchBrand } from '@/app/(auth)/login/actions';

export const HOLDING_BRANDS = [
  { code: 'TS', name: 'TeeStock' },
  { code: 'MG', name: 'MultiGraph' },
  { code: 'NP', name: 'NeoPack' },
  { code: 'PP', name: 'Pack Point' },
  { code: 'SQ', name: 'Squeegee' },
] as const;

export interface AppHeaderProps {
  session: SessionContext;
}

export function AppHeader({ session }: AppHeaderProps) {
  return (
    <header className="shell-topbar">
      <div className="topbar-brand">
        <Link
          href="/dashboard"
          style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f8fafc' }}
        >
          MultiGraph Business OS
        </Link>
        <span className="topbar-badge">{session.organization.displayName}</span>
      </div>

      <div className="topbar-actions">
        <div className="brand-switcher" title="Pilih Brand Aktif">
          <span
            style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}
          >
            BRAND:
          </span>
          {HOLDING_BRANDS.map((brand) => (
            <form
              key={brand.code}
              action={handleSwitchBrand}
              style={{ display: 'inline' }}
            >
              <input type="hidden" name="brandCode" value={brand.code} />
              <button
                type="submit"
                className={`brand-btn ${session.activeBrand.code === brand.code ? 'active' : ''}`}
                title={brand.name}
              >
                {brand.code}
              </button>
            </form>
          ))}
        </div>

        <div className="user-profile">
          <span style={{ color: '#cbd5e1', fontWeight: 500 }}>
            {session.user.name}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              color: '#38bdf8',
              background: '#0c4a6e',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 700,
            }}
          >
            {session.role.code}
          </span>
        </div>

        <form action={handleLogout}>
          <button
            type="submit"
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
          >
            Keluar
          </button>
        </form>
      </div>
    </header>
  );
}
