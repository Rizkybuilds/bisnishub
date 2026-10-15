import { requireAuth } from '@/lib/session.server';
import { serverEnvironment } from '@/lib/env.server';
import { publicEnvironment } from '@/lib/env.client';
import { CreateCustomerModal } from './CreateCustomerModal';
import {
  CustomerListTable,
  type CustomerData,
  type CustomerListTableDataState,
} from './CustomerListTable';

export const metadata = {
  title: 'Customer 360 — MultiGraph Business OS',
};

function isValidCustomerContact(c: unknown): boolean {
  if (typeof c !== 'object' || c === null) return false;
  const contact = c as Record<string, unknown>;
  if (typeof contact.id !== 'string') return false;
  if (typeof contact.name !== 'string') return false;
  if (typeof contact.is_primary !== 'boolean') return false;
  if (
    contact.email !== undefined &&
    contact.email !== null &&
    typeof contact.email !== 'string'
  ) {
    return false;
  }
  if (
    contact.phone !== undefined &&
    contact.phone !== null &&
    typeof contact.phone !== 'string'
  ) {
    return false;
  }
  if (
    contact.position !== undefined &&
    contact.position !== null &&
    typeof contact.position !== 'string'
  ) {
    return false;
  }
  return true;
}

function isValidCustomerBrandRelationship(rel: unknown): boolean {
  if (typeof rel !== 'object' || rel === null) return false;
  const r = rel as Record<string, unknown>;
  if (typeof r.id !== 'string') return false;
  if (r.brand_id !== undefined && typeof r.brand_id !== 'string') return false;
  if (
    r.customer_segment !== undefined &&
    r.customer_segment !== null &&
    typeof r.customer_segment !== 'string'
  ) {
    return false;
  }
  if (
    r.relationship_status !== undefined &&
    r.relationship_status !== null &&
    typeof r.relationship_status !== 'string'
  ) {
    return false;
  }
  if (r.brands !== undefined && r.brands !== null) {
    if (typeof r.brands !== 'object') return false;
    const b = r.brands as Record<string, unknown>;
    if (b.code !== undefined && typeof b.code !== 'string') return false;
    if (b.name !== undefined && typeof b.name !== 'string') return false;
  }
  return true;
}

function isValidCustomerRecord(record: unknown): record is CustomerData {
  if (typeof record !== 'object' || record === null) return false;
  const r = record as Record<string, unknown>;
  if (typeof r.id !== 'string') return false;
  if (r.account_type !== 'PERSON' && r.account_type !== 'COMPANY') return false;
  if (typeof r.display_name !== 'string') return false;
  if (typeof r.status !== 'string') return false;

  if (
    r.legal_name !== undefined &&
    r.legal_name !== null &&
    typeof r.legal_name !== 'string'
  ) {
    return false;
  }
  if (
    r.primary_email !== undefined &&
    r.primary_email !== null &&
    typeof r.primary_email !== 'string'
  ) {
    return false;
  }
  if (
    r.primary_phone !== undefined &&
    r.primary_phone !== null &&
    typeof r.primary_phone !== 'string'
  ) {
    return false;
  }
  if (
    r.tax_id !== undefined &&
    r.tax_id !== null &&
    typeof r.tax_id !== 'string'
  ) {
    return false;
  }
  if (
    r.customer_since !== undefined &&
    r.customer_since !== null &&
    typeof r.customer_since !== 'string'
  ) {
    return false;
  }

  if (
    !Array.isArray(r.customer_contacts) ||
    !r.customer_contacts.every(isValidCustomerContact)
  ) {
    return false;
  }

  if (
    !Array.isArray(r.customer_brand_relationships) ||
    !r.customer_brand_relationships.every(isValidCustomerBrandRelationship)
  ) {
    return false;
  }

  return true;
}

async function fetchCustomersData(
  supabaseUrl: string,
  serviceKey: string | undefined,
  organizationId: string,
): Promise<CustomerListTableDataState> {
  if (!serviceKey) {
    return {
      status: 'UNAVAILABLE',
      message: 'Layanan data customer tidak tersedia saat ini.',
    };
  }

  const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/customer_accounts?organization_id=eq.${organizationId}&select=id,account_type,display_name,legal_name,primary_email,primary_phone,tax_id,status,customer_since,customer_contacts(id,name,email,phone,position,is_primary),customer_brand_relationships(id,brand_id,customer_segment,relationship_status,brands(id,code,name))&order=display_name.asc`;

  const headers: Record<string, string> = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Accept-Profile': 'app',
  };

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        status: 'UNAVAILABLE',
        message: 'Layanan data customer tidak dapat diakses saat ini.',
      };
    }

    const json = await response.json();
    if (!Array.isArray(json) || !json.every(isValidCustomerRecord)) {
      return {
        status: 'UNAVAILABLE',
        message: 'Format data customer tidak valid.',
      };
    }

    return {
      status: 'SUCCESS',
      data: json,
    };
  } catch {
    return {
      status: 'UNAVAILABLE',
      message: 'Terjadi gangguan jaringan saat memuat data customer.',
    };
  }
}

interface CustomerKpis {
  total: number | null;
  companyCount: number | null;
  personCount: number | null;
  activeBrandCustomers: number | null;
}

function computeCustomerKpis(
  state: CustomerListTableDataState,
  activeBrandCode: string,
): CustomerKpis {
  if (state.status !== 'SUCCESS') {
    return {
      total: null,
      companyCount: null,
      personCount: null,
      activeBrandCustomers: null,
    };
  }
  const customers = state.data;
  return {
    total: customers.length,
    companyCount: customers.filter((c) => c.account_type === 'COMPANY').length,
    personCount: customers.filter((c) => c.account_type === 'PERSON').length,
    activeBrandCustomers: customers.filter((c) =>
      c.customer_brand_relationships?.some(
        (r) => r && r.brands?.code === activeBrandCode,
      ),
    ).length,
  };
}

export default async function CustomersPage() {
  const session = await requireAuth();
  const supabaseUrl =
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:55431';
  const serviceKey = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;

  const customersState = await fetchCustomersData(
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
          dataState={customersState}
          activeBrandCode={session.activeBrand.code}
        />
      </div>
    </div>
  );
}
