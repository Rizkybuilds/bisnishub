import { requireAuth } from '@/lib/session.server';
import { serverEnvironment } from '@/lib/env.server';
import { publicEnvironment } from '@/lib/env.client';
import { CreateLeadModal } from './CreateLeadModal';
import { LeadListTable, type LeadListTableDataState } from './LeadListTable';
import type { LeadDetailData } from './LeadDetailModal';

export const metadata = {
  title: 'Inbound Leads & Qualification — MultiGraph Business OS',
};

function isValidLeadRequirement(req: unknown): boolean {
  if (typeof req !== 'object' || req === null || Array.isArray(req))
    return false;
  const r = req as Record<string, unknown>;
  if (typeof r.id !== 'string') return false;
  if (r.title !== undefined && typeof r.title !== 'string') return false;
  if (
    r.requirement_number !== undefined &&
    typeof r.requirement_number !== 'string'
  ) {
    return false;
  }
  if (r.status !== undefined && typeof r.status !== 'string') return false;
  return true;
}

function isValidLeadRecord(record: unknown): record is LeadDetailData {
  if (typeof record !== 'object' || record === null) return false;
  const r = record as Record<string, unknown>;
  if (
    typeof r.id !== 'string' ||
    typeof r.lead_number !== 'string' ||
    typeof r.title !== 'string' ||
    typeof r.status !== 'string'
  ) {
    return false;
  }

  // Optional string / number / date fields
  if (
    r.contact_name !== undefined &&
    r.contact_name !== null &&
    typeof r.contact_name !== 'string'
  ) {
    return false;
  }
  if (
    r.company_name !== undefined &&
    r.company_name !== null &&
    typeof r.company_name !== 'string'
  ) {
    return false;
  }
  if (
    r.phone !== undefined &&
    r.phone !== null &&
    typeof r.phone !== 'string'
  ) {
    return false;
  }
  if (
    r.email !== undefined &&
    r.email !== null &&
    typeof r.email !== 'string'
  ) {
    return false;
  }
  if (
    r.raw_inquiry !== undefined &&
    r.raw_inquiry !== null &&
    typeof r.raw_inquiry !== 'string'
  ) {
    return false;
  }
  if (
    r.estimated_budget !== undefined &&
    r.estimated_budget !== null &&
    typeof r.estimated_budget !== 'number'
  ) {
    return false;
  }
  if (
    r.estimated_quantity !== undefined &&
    r.estimated_quantity !== null &&
    typeof r.estimated_quantity !== 'number'
  ) {
    return false;
  }
  if (
    r.qualification_result !== undefined &&
    r.qualification_result !== null &&
    typeof r.qualification_result !== 'string'
  ) {
    return false;
  }
  if (
    r.qualification_score !== undefined &&
    r.qualification_score !== null &&
    typeof r.qualification_score !== 'number'
  ) {
    return false;
  }
  if (
    r.qualification_notes !== undefined &&
    r.qualification_notes !== null &&
    typeof r.qualification_notes !== 'string'
  ) {
    return false;
  }
  if (
    r.disqualification_reason !== undefined &&
    r.disqualification_reason !== null &&
    typeof r.disqualification_reason !== 'string'
  ) {
    return false;
  }
  if (
    r.created_at !== undefined &&
    r.created_at !== null &&
    typeof r.created_at !== 'string'
  ) {
    return false;
  }
  if (
    r.qualified_at !== undefined &&
    r.qualified_at !== null &&
    typeof r.qualified_at !== 'string'
  ) {
    return false;
  }
  if (
    r.disqualified_at !== undefined &&
    r.disqualified_at !== null &&
    typeof r.disqualified_at !== 'string'
  ) {
    return false;
  }
  if (
    r.converted_at !== undefined &&
    r.converted_at !== null &&
    typeof r.converted_at !== 'string'
  ) {
    return false;
  }

  // Optional nested brands
  if (r.brands !== undefined && r.brands !== null) {
    if (typeof r.brands !== 'object' || Array.isArray(r.brands)) return false;
    const b = r.brands as Record<string, unknown>;
    if (b.id !== undefined && typeof b.id !== 'string') return false;
    if (b.code !== undefined && typeof b.code !== 'string') return false;
    if (b.name !== undefined && typeof b.name !== 'string') return false;
  }

  // Optional nested channels
  if (r.channels !== undefined && r.channels !== null) {
    if (typeof r.channels !== 'object' || Array.isArray(r.channels))
      return false;
    const c = r.channels as Record<string, unknown>;
    if (c.id !== undefined && typeof c.id !== 'string') return false;
    if (c.code !== undefined && typeof c.code !== 'string') return false;
    if (c.name !== undefined && typeof c.name !== 'string') return false;
    if (c.channel_type !== undefined && typeof c.channel_type !== 'string') {
      return false;
    }
  }

  // Optional nested customer_accounts
  if (r.customer_accounts !== undefined && r.customer_accounts !== null) {
    if (
      typeof r.customer_accounts !== 'object' ||
      Array.isArray(r.customer_accounts)
    ) {
      return false;
    }
    const ca = r.customer_accounts as Record<string, unknown>;
    if (typeof ca.id !== 'string') return false;
    if (typeof ca.display_name !== 'string') return false;
    if (typeof ca.account_type !== 'string') return false;
  }

  // Optional nested requirements
  if (r.requirements !== undefined && r.requirements !== null) {
    if (
      !Array.isArray(r.requirements) ||
      !r.requirements.every(isValidLeadRequirement)
    ) {
      return false;
    }
  }

  return true;
}

async function fetchLeadsData(
  supabaseUrl: string,
  serviceKey: string | undefined,
  organizationId: string,
): Promise<LeadListTableDataState> {
  if (!serviceKey) {
    return {
      status: 'UNAVAILABLE',
      message: 'Layanan data leads tidak tersedia saat ini.',
    };
  }

  const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/leads?organization_id=eq.${organizationId}&select=id,lead_number,title,contact_name,company_name,phone,email,raw_inquiry,estimated_quantity,estimated_budget,status,qualification_result,qualification_score,qualification_notes,disqualification_reason,created_at,qualified_at,disqualified_at,converted_at,channels(id,code,name,channel_type),brands(id,code,name),customer_accounts(id,display_name,account_type),requirements(id,requirement_number,status,title)&order=created_at.desc`;

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
        message: 'Layanan data leads tidak dapat diakses saat ini.',
      };
    }

    const json = await response.json();
    if (!Array.isArray(json) || !json.every(isValidLeadRecord)) {
      return {
        status: 'UNAVAILABLE',
        message: 'Format data leads tidak valid.',
      };
    }

    return {
      status: 'SUCCESS',
      data: json,
    };
  } catch {
    return {
      status: 'UNAVAILABLE',
      message: 'Terjadi gangguan jaringan saat memuat data leads.',
    };
  }
}

interface LeadKpis {
  total: number | null;
  newCount: number | null;
  qualifiedCount: number | null;
  activeBrandLeads: number | null;
  convertedCount: number | null;
}

function computeLeadKpis(
  state: LeadListTableDataState,
  activeBrandCode: string,
): LeadKpis {
  if (state.status !== 'SUCCESS') {
    return {
      total: null,
      newCount: null,
      qualifiedCount: null,
      activeBrandLeads: null,
      convertedCount: null,
    };
  }
  const leads = state.data;
  return {
    total: leads.length,
    newCount: leads.filter((l) => l.status === 'NEW').length,
    qualifiedCount: leads.filter((l) => l.status === 'QUALIFIED').length,
    activeBrandLeads: leads.filter(
      (l) => l.brands && l.brands.code === activeBrandCode,
    ).length,
    convertedCount: leads.filter((l) => l.status === 'CONVERTED').length,
  };
}

export default async function LeadsPage() {
  const session = await requireAuth();
  const supabaseUrl =
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:55431';
  const serviceKey = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;

  const leadsState = await fetchLeadsData(
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
          dataState={leadsState}
          activeBrandCode={session.activeBrand.code}
        />
      </div>
    </div>
  );
}
