import Link from 'next/link';
import { hasPermission } from '@mgbos/auth';
import { requireAuth } from '@/lib/session.server';
import { handleLogout, handleSwitchBrand } from '../(auth)/login/actions';

const HOLDING_BRANDS = [
  { code: 'TS', name: 'TeeStock' },
  { code: 'MG', name: 'MultiGraph' },
  { code: 'NP', name: 'NeoPack' },
  { code: 'PP', name: 'Pack Point' },
  { code: 'SQ', name: 'Squeegee' },
] as const;

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <div className="shell-wrapper">
      <header className="shell-topbar">
        <div className="topbar-brand">
          <Link
            href="/dashboard"
            style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f8fafc' }}
          >
            MultiGraph Business OS
          </Link>
          <span className="topbar-badge">
            {session.organization.displayName}
          </span>
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

      <div className="shell-body">
        <aside className="shell-sidebar">
          <div>
            <div className="sidebar-section-title">Navigasi Utama</div>
            <nav className="sidebar-nav">
              <Link href="/dashboard" className="sidebar-link active">
                <span>🏠 Command Center</span>
              </Link>
            </nav>
          </div>

          <div>
            <div className="sidebar-section-title">Sales Pipeline</div>
            <nav className="sidebar-nav">
              <Link href="/leads" className="sidebar-link">
                <span>Leads &amp; Inquiries</span>
                <span
                  className="nav-badge"
                  style={{ background: '#052e16', color: '#4ade80' }}
                >
                  ACTIVE
                </span>
              </Link>
              <Link href="/customers" className="sidebar-link">
                <span>Customer 360</span>
                <span
                  className="nav-badge"
                  style={{ background: '#052e16', color: '#4ade80' }}
                >
                  ACTIVE
                </span>
              </Link>
              <Link href="/requirements" className="sidebar-link">
                Kebutuhan pesanan
              </Link>
              {hasPermission(session.role.code, 'quotes:read') && (
                <Link href="/quotes" className="sidebar-link">
                  <span>Penawaran &amp; HPP</span>
                </Link>
              )}
            </nav>
          </div>

          <div>
            <div className="sidebar-section-title">Operations</div>
            <nav className="sidebar-nav">
              {hasPermission(session.role.code, 'orders:read') ? (
                <Link href="/orders" className="sidebar-link">
                  <span>Order Contracts</span>
                  <span
                    className="nav-badge"
                    style={{ background: '#052e16', color: '#4ade80' }}
                  >
                    ACTIVE
                  </span>
                </Link>
              ) : (
                <div className="sidebar-link">
                  <span>Order Contracts</span>
                  <span className="nav-badge">MGBOS-011</span>
                </div>
              )}
              {hasPermission(session.role.code, 'production:read') ? (
                <Link href="/production" className="sidebar-link">
                  <span>Production &amp; QC</span>
                  <span
                    className="nav-badge"
                    style={{ background: '#052e16', color: '#4ade80' }}
                  >
                    ACTIVE
                  </span>
                </Link>
              ) : (
                <div className="sidebar-link">
                  <span>Production &amp; QC</span>
                  <span className="nav-badge">MGBOS-012</span>
                </div>
              )}
              {hasPermission(session.role.code, 'vendors:read') ? (
                <Link href="/vendors" className="sidebar-link">
                  <span>Vendor Network</span>
                  <span
                    className="nav-badge"
                    style={{ background: '#052e16', color: '#4ade80' }}
                  >
                    ACTIVE
                  </span>
                </Link>
              ) : (
                <div className="sidebar-link">
                  <span>Vendor Network</span>
                  <span className="nav-badge">MGBOS-013</span>
                </div>
              )}
            </nav>
          </div>

          <div>
            <div className="sidebar-section-title">Finance &amp; Cash</div>
            <nav className="sidebar-nav">
              {hasPermission(session.role.code, 'invoices:read') ? (
                <Link href="/invoices" className="sidebar-link">
                  <span>Invoices &amp; Piutang</span>
                  <span
                    className="nav-badge"
                    style={{ background: '#052e16', color: '#4ade80' }}
                  >
                    ACTIVE
                  </span>
                </Link>
              ) : (
                <div className="sidebar-link">
                  <span>Invoices &amp; Piutang</span>
                  <span className="nav-badge">MGBOS-014</span>
                </div>
              )}
              {hasPermission(session.role.code, 'payments:read') ? (
                <Link href="/payments" className="sidebar-link">
                  <span>Payments &amp; Kas Masuk</span>
                  <span
                    className="nav-badge"
                    style={{ background: '#052e16', color: '#4ade80' }}
                  >
                    ACTIVE
                  </span>
                </Link>
              ) : (
                <div className="sidebar-link">
                  <span>Payments &amp; Kas Masuk</span>
                  <span className="nav-badge">MGBOS-015</span>
                </div>
              )}
              {hasPermission(session.role.code, 'ledger:read') ? (
                <Link href="/ledger" className="sidebar-link">
                  <span>Buku Kas &amp; Margin</span>
                  <span
                    className="nav-badge"
                    style={{ background: '#052e16', color: '#4ade80' }}
                  >
                    ACTIVE
                  </span>
                </Link>
              ) : (
                <div className="sidebar-link">
                  <span>Buku Kas &amp; Margin</span>
                  <span className="nav-badge">MGBOS-016</span>
                </div>
              )}
            </nav>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div className="sidebar-section-title">Sistem &amp; Holding</div>
            <nav className="sidebar-nav">
              <Link href="/settings" className="sidebar-link">
                <span>⚙️ Holding Config</span>
                <span className="nav-badge">MGBOS-002</span>
              </Link>
            </nav>
          </div>
        </aside>

        <main className="shell-content">{children}</main>
      </div>
    </div>
  );
}
