import { requireAuth } from '@/lib/session.server';
import { serverEnvironment } from '@/lib/env.server';
import { publicEnvironment } from '@/lib/env.client';
import { CreateLeadModal } from './CreateLeadModal';
import { LeadListTable, loadLeadsData, computeLeadKpis } from './LeadListTable';

export const metadata = {
  title: 'Inbound Leads & Qualification — MultiGraph Business OS',
};

export default async function LeadsPage() {
  const session = await requireAuth();
  const supabaseUrl =
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:55431';
  const serviceKey = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;

  const leadsState = await loadLeadsData(
    supabaseUrl,
    serviceKey,
    session.organization.id,
  );

  const kpis = computeLeadKpis(leadsState, session.activeBrand.code);

  return (
    <div>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <small
            style={{
              color: '#38bdf8',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {session.organization.displayName} • SALES PIPELINE (MGBOS-006)
          </small>
          <h1
            style={{
              fontSize: '1.85rem',
              margin: '6px 0 8px',
              color: '#f8fafc',
            }}
          >
            Inbound Leads &amp; Qualification Pipeline
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
            Pusat penangkapan inquiry dari WhatsApp, Website Atelier, dan media
            sosial holding dengan nomor otomatis collision-safe dan evaluasi
            kelayakan.
          </p>
        </div>

        <CreateLeadModal activeBrandName={session.activeBrand.name} />
      </div>

      {/* Unavailable Alert Banner if server-side data fetch was unsuccessful */}
      {leadsState.status === 'UNAVAILABLE' && (
        <div
          role="alert"
          style={{
            background: '#1e1b4b',
            border: '1px solid #4338ca',
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.25rem' }}>⚠️</span>
            <div>
              <div
                style={{
                  color: '#f8fafc',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}
              >
                Layanan data leads tidak dapat diakses saat ini
              </div>
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                  marginTop: '2px',
                }}
              >
                {leadsState.message}
              </div>
            </div>
          </div>
          <a
            href="/leads"
            style={{
              background: '#38bdf8',
              color: '#0f172a',
              padding: '6px 14px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Coba Lagi
          </a>
        </div>
      )}

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">TOTAL INBOUND LEADS</div>
          <div className="kpi-value" style={{ color: '#38bdf8' }}>
            {kpis.total !== null ? `${kpis.total} Leads` : '—'}
          </div>
          <div className="kpi-desc">MultiGraph Group Inbound Pipeline</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">INQUIRY BARU (UNTOUCHED)</div>
          <div className="kpi-value" style={{ color: '#facc15' }}>
            {kpis.newCount !== null ? `${kpis.newCount} Inquiry` : '—'}
          </div>
          <div className="kpi-desc">Menunggu respon awal / kualifikasi</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">SIAP QUOTE (QUALIFIED)</div>
          <div className="kpi-value" style={{ color: '#4ade80' }}>
            {kpis.qualifiedCount !== null ? `${kpis.qualifiedCount} Lead` : '—'}
          </div>
          <div className="kpi-desc">
            Lolos kualifikasi kebutuhan &amp; kontak
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">AKTIF DI {session.activeBrand.code}</div>
          <div className="kpi-value" style={{ color: '#a855f7' }}>
            {kpis.activeBrandLeads !== null
              ? `${kpis.activeBrandLeads} Lead`
              : '—'}
          </div>
          <div className="kpi-desc">
            {kpis.convertedCount !== null
              ? `Pipeline Brand ${session.activeBrand.name} (${kpis.convertedCount} Terkonversi)`
              : `Pipeline Brand ${session.activeBrand.name}`}
          </div>
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <div>
            <h2 className="card-title" style={{ margin: 0 }}>
              Daftar Antrean Inbound Leads
            </h2>
            <div
              style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}
            >
              Semua inquiry masuk dengan nomor canonical unik dan status
              pipeline
            </div>
          </div>
        </div>

        <LeadListTable
          leads={leadsState.status === 'SUCCESS' ? leadsState.data : []}
          dataState={leadsState}
          activeBrandCode={session.activeBrand.code}
        />
      </div>
    </div>
  );
}
