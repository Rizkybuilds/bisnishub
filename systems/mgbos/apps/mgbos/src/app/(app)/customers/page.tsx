import { requireAuth } from '@/lib/session.server';
import { serverEnvironment } from '@/lib/env.server';
import { publicEnvironment } from '@/lib/env.client';
import { CreateCustomerModal } from './CreateCustomerModal';
import {
  CustomerListTable,
  loadCustomersData,
  computeCustomerKpis,
} from './CustomerListTable';

export const metadata = {
  title: 'Customer 360 — MultiGraph Business OS',
};

export default async function CustomersPage() {
  const session = await requireAuth();
  const supabaseUrl =
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:55431';
  const serviceKey = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;

  const customersState = await loadCustomersData(
    supabaseUrl,
    serviceKey,
    session.organization.id,
  );

  const kpis = computeCustomerKpis(customersState, session.activeBrand.code);

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
            {session.organization.displayName} • SALES PIPELINE (MGBOS-005)
          </small>
          <h1
            style={{
              fontSize: '1.85rem',
              margin: '6px 0 8px',
              color: '#f8fafc',
            }}
          >
            Customer 360 &amp; CRM Master
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
            Database akun pelanggan terpusat holding multi-brand, mendukung
            entitas perusahaan (multi-contact) dan individu retail.
          </p>
        </div>

        <CreateCustomerModal activeBrandName={session.activeBrand.name} />
      </div>

      {/* Unavailable Alert Banner if server-side data fetch was unsuccessful */}
      {customersState.status === 'UNAVAILABLE' && (
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
                Layanan data customer tidak dapat diakses saat ini
              </div>
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                  marginTop: '2px',
                }}
              >
                {customersState.message}
              </div>
            </div>
          </div>
          <a
            href="/customers"
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
          <div className="kpi-title">TOTAL CUSTOMER HOLDING</div>
          <div className="kpi-value" style={{ color: '#38bdf8' }}>
            {kpis.total !== null ? `${kpis.total} Akun` : '—'}
          </div>
          <div className="kpi-desc">MultiGraph Group Central CRM</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">B2B / CORPORATE ACCOUNTS</div>
          <div className="kpi-value">
            {kpis.companyCount !== null
              ? `${kpis.companyCount} Perusahaan`
              : '—'}
          </div>
          <div className="kpi-desc">Akun dengan Multi-Contact PIC</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">RETAIL / PERSON ACCOUNTS</div>
          <div className="kpi-value">
            {kpis.personCount !== null ? `${kpis.personCount} Individu` : '—'}
          </div>
          <div className="kpi-desc">Pembeli Ritel &amp; Kolaborator</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">AKTIF DI {session.activeBrand.code}</div>
          <div className="kpi-value" style={{ color: '#4ade80' }}>
            {kpis.activeBrandCustomers !== null
              ? `${kpis.activeBrandCustomers} Customer`
              : '—'}
          </div>
          <div className="kpi-desc">
            Relasi Brand {session.activeBrand.name}
          </div>
        </div>
      </div>

      {/* Customer List Card */}
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
              Daftar Customer Terdaftar
            </h2>
            <div
              style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}
            >
              Pusat data pelanggan holding dengan segmentasi per brand
            </div>
          </div>
        </div>

        <CustomerListTable
          customers={
            customersState.status === 'SUCCESS' ? customersState.data : []
          }
          dataState={customersState}
          activeBrandCode={session.activeBrand.code}
        />
      </div>
    </div>
  );
}
