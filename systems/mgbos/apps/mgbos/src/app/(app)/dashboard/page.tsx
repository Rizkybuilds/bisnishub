import { requireAuth } from '@/lib/session.server';
import { formatDocumentNumber } from '@mgbos/domain';

export const metadata = {
  title: 'Command Center — MultiGraph Business OS',
};

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <small
          style={{
            color: '#38bdf8',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {session.organization.displayName} • FOUNDER COMMAND CENTER
        </small>
        <h1
          style={{
            fontSize: '1.85rem',
            margin: '6px 0 8px',
            color: '#f8fafc',
          }}
        >
          Selamat Datang, {session.user.name}!
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
          Pusat komando operasional MultiGraph Group — Ekosistem Industri
          Percetakan, Apparel, dan Kemasan Retail.
        </p>
      </div>

      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0f172a 100%)',
          borderColor: '#0284c7',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div
              style={{ fontSize: '0.8rem', color: '#7dd3fc', fontWeight: 600 }}
            >
              KONTEKS BRAND AKTIF
            </div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#ffffff',
                marginTop: '2px',
              }}
            >
              {session.activeBrand.name} ({session.activeBrand.code})
            </div>
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: '#e0f2fe',
              background: 'rgba(2, 132, 199, 0.4)',
              padding: '6px 12px',
              borderRadius: '6px',
            }}
          >
            Operasi Berjalan dalam Konteks Brand Ini
          </div>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">STATUS ORGANISASI</div>
          <div className="kpi-value" style={{ color: '#4ade80' }}>
            ACTIVE
          </div>
          <div className="kpi-desc">MultiGraph Group Holding</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">HOLDING BRANDS</div>
          <div className="kpi-value">5 Brand</div>
          <div className="kpi-desc">TS, MG, NP, PP, SQ</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">KANAL TRANSAKSI</div>
          <div className="kpi-value">5 Kanal</div>
          <div className="kpi-desc">WA, Web, IG, Direct, Marketplace</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">PERAN OTORITAS</div>
          <div className="kpi-value" style={{ color: '#38bdf8' }}>
            OWNER
          </div>
          <div className="kpi-desc">Executive Sole Decision Maker</div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Dual-Track Execution Engine</h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
          MGBOS memisahkan dua mesin pertumbuhan holding secara harmonis:
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginTop: '16px',
          }}
        >
          <div
            style={{
              background: '#020617',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #1e293b',
            }}
          >
            <div
              style={{
                color: '#38bdf8',
                fontWeight: 700,
                fontSize: '0.9rem',
                marginBottom: '6px',
              }}
            >
              Track A: Cash Flow Generator
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
              Etalase ritel TeeStock untuk penjualan kaos polos NSA dan koleksi
              grafis terkurasi. Membawa arus kas masuk harian holding.
            </p>
          </div>

          <div
            style={{
              background: '#020617',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #1e293b',
            }}
          >
            <div
              style={{
                color: '#4ade80',
                fontWeight: 700,
                fontSize: '0.9rem',
                marginBottom: '6px',
              }}
            >
              Track B: MGBOS Operating Engine
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
              Sistem B2B Custom Atelier untuk inquiry partai besar, quotation
              berversi dengan batas margin CFO, dan routing vendor tanpa admin
              manual.
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">
          Canonical Document Numbering Service (MGBOS-004)
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Sistem penomoran dokumen resmi MGBOS berbasis sequence atomik di
          PostgreSQL, collision-safe, brand-aware, dan year-aware. Format baku:{' '}
          <code
            style={{
              background: '#020617',
              padding: '2px 6px',
              borderRadius: '4px',
              color: '#38bdf8',
            }}
          >
            {'{BRAND}-{TYPE}-{YEAR}-{SEQUENCE}'}
          </code>
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            marginTop: '16px',
          }}
        >
          {[
            { type: 'L', label: 'Inbound Lead', alias: 'TS-L-2026-000001' },
            { type: 'Q', label: 'Quotation', alias: 'TS-Q-2026-000001' },
            { type: 'O', label: 'Sales Order', alias: 'TS-O-2026-000001' },
            {
              type: 'INV',
              label: 'Commercial Invoice',
              alias: 'TS-INV-2026-000001',
            },
            { type: 'J', label: 'Production Job', alias: 'TS-J-2026-000001' },
            { type: 'PO', label: 'Purchase Order', alias: 'TS-PO-2026-000001' },
          ].map((item) => (
            <div
              key={item.type}
              style={{
                background: '#020617',
                padding: '12px 14px',
                borderRadius: '6px',
                border: '1px solid #1e293b',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {item.label}
              </div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#f8fafc',
                  marginTop: '4px',
                  fontFamily: 'monospace',
                }}
              >
                {formatDocumentNumber({
                  brandCode: session.activeBrand.code,
                  documentType: item.type,
                  sequence: 1,
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Vertical Slices Status</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              background: '#020617',
              borderRadius: '6px',
            }}
          >
            <span style={{ fontSize: '0.875rem' }}>
              MGBOS-001: Repository Foundation &amp; Local Database
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#4ade80',
                fontWeight: 700,
                background: '#052e16',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              CERTIFIED
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              background: '#020617',
              borderRadius: '6px',
            }}
          >
            <span style={{ fontSize: '0.875rem' }}>
              MGBOS-002: Organization &amp; Multi-Brand Foundation
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#4ade80',
                fontWeight: 700,
                background: '#052e16',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              CERTIFIED
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              background: '#020617',
              borderRadius: '6px',
            }}
          >
            <span style={{ fontSize: '0.875rem' }}>
              MGBOS-003: Authentication &amp; Owner Membership
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#4ade80',
                fontWeight: 700,
                background: '#052e16',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              CERTIFIED
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              background: '#020617',
              borderRadius: '6px',
            }}
          >
            <span style={{ fontSize: '0.875rem' }}>
              MGBOS-004: Document Number Service (Atomic &amp; Collision-Safe)
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#4ade80',
                fontWeight: 700,
                background: '#052e16',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              CERTIFIED
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              background: '#020617',
              borderRadius: '6px',
            }}
          >
            <span style={{ fontSize: '0.875rem' }}>
              MGBOS-005: Customer Account &amp; Contact Domain Model (Customer
              360)
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#4ade80',
                fontWeight: 700,
                background: '#052e16',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              CERTIFIED
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              background: '#020617',
              borderRadius: '6px',
            }}
          >
            <span style={{ fontSize: '0.875rem' }}>
              MGBOS-006: Inbound Lead Pipeline &amp; Qualification Engine
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#4ade80',
                fontWeight: 700,
                background: '#052e16',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              CERTIFIED
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              background: '#020617',
              borderRadius: '6px',
            }}
          >
            <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              MGBOS-007–010: Kebutuhan, Custom Atelier, Penawaran &amp; PDF
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#facc15',
                fontWeight: 700,
                background: '#422006',
                padding: '3px 8px',
                borderRadius: '4px',
              }}
            >
              IMPLEMENTED LOCALLY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
