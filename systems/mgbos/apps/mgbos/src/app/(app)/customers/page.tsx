import { requireAuth } from '@/lib/session.server';
import { serverEnvironment } from '@/lib/env.server';
import { publicEnvironment } from '@/lib/env.client';
import { CreateCustomerModal } from './CreateCustomerModal';
import { CustomerListTable, type CustomerData } from './CustomerListTable';

export const metadata = {
  title: 'Customer 360 — MultiGraph Business OS',
};

export default async function CustomersPage() {
  const session = await requireAuth();
  const supabaseUrl =
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:55431';
  const serviceKey = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;

  let customers: CustomerData[] = [];

  if (serviceKey) {
    // Fetch customers with nested contacts and brand relationships
    const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/customer_accounts?organization_id=eq.${session.organization.id}&select=id,account_type,display_name,legal_name,primary_email,primary_phone,tax_id,status,customer_since,customer_contacts(id,name,email,phone,position,is_primary),customer_brand_relationships(id,brand_id,customer_segment,relationship_status,brands(id,code,name))&order=display_name.asc`;

    const headers: Record<string, string> = {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Accept-Profile': 'app',
    };

    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (response.ok) {
      customers = await response.json();
    }
  }

  const companyCount = customers.filter(
    (c) => c.account_type === 'COMPANY',
  ).length;
  const personCount = customers.filter(
    (c) => c.account_type === 'PERSON',
  ).length;
  const activeBrandCustomers = customers.filter((c) =>
    c.customer_brand_relationships.some(
      (r) => r.brands?.code === session.activeBrand.code,
    ),
  ).length;

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

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">TOTAL CUSTOMER HOLDING</div>
          <div className="kpi-value" style={{ color: '#38bdf8' }}>
            {customers.length} Akun
          </div>
          <div className="kpi-desc">MultiGraph Group Central CRM</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">B2B / CORPORATE ACCOUNTS</div>
          <div className="kpi-value">{companyCount} Perusahaan</div>
          <div className="kpi-desc">Akun dengan Multi-Contact PIC</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">RETAIL / PERSON ACCOUNTS</div>
          <div className="kpi-value">{personCount} Individu</div>
          <div className="kpi-desc">Pembeli Ritel &amp; Kolaborator</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">AKTIF DI {session.activeBrand.code}</div>
          <div className="kpi-value" style={{ color: '#4ade80' }}>
            {activeBrandCustomers} Customer
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
          customers={customers}
          activeBrandCode={session.activeBrand.code}
        />
      </div>
    </div>
  );
}
