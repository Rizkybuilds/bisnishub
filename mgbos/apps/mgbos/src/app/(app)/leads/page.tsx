import { requireAuth } from '@/lib/session.server';
import { serverEnvironment } from '@/lib/env.server';
import { publicEnvironment } from '@/lib/env.client';
import { CreateLeadModal } from './CreateLeadModal';
import { LeadListTable } from './LeadListTable';
import type { LeadDetailData } from './LeadDetailModal';

export const metadata = {
  title: 'Inbound Leads & Qualification — MultiGraph Business OS',
};

export default async function LeadsPage() {
  const session = await requireAuth();
  const supabaseUrl =
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:55431';
  const serviceKey = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;

  let leads: LeadDetailData[] = [];

  if (serviceKey) {
    const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/rest/v1/leads?organization_id=eq.${session.organization.id}&select=id,lead_number,title,contact_name,company_name,phone,email,raw_inquiry,estimated_quantity,estimated_budget,status,qualification_result,qualification_score,qualification_notes,disqualification_reason,created_at,qualified_at,disqualified_at,converted_at,channels(id,code,name,channel_type),brands(id,code,name),customer_accounts(id,display_name,account_type)&order=created_at.desc`;

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
      leads = await response.json();
    }
  }

  const newCount = leads.filter((l) => l.status === 'NEW').length;
  const qualifiedCount = leads.filter((l) => l.status === 'QUALIFIED').length;
  const convertedCount = leads.filter((l) => l.status === 'CONVERTED').length;
  const activeBrandLeads = leads.filter(
    (l) => l.brands?.code === session.activeBrand.code,
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

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">TOTAL INBOUND LEADS</div>
          <div className="kpi-value" style={{ color: '#38bdf8' }}>
            {leads.length} Leads
          </div>
          <div className="kpi-desc">MultiGraph Group Inbound Pipeline</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">INQUIRY BARU (UNTOUCHED)</div>
          <div className="kpi-value" style={{ color: '#facc15' }}>
            {newCount} Inquiry
          </div>
          <div className="kpi-desc">Menunggu respon awal / kualifikasi</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">SIAP QUOTE (QUALIFIED)</div>
          <div className="kpi-value" style={{ color: '#4ade80' }}>
            {qualifiedCount} Lead
          </div>
          <div className="kpi-desc">
            Lolos kualifikasi kebutuhan &amp; kontak
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">AKTIF DI {session.activeBrand.code}</div>
          <div className="kpi-value" style={{ color: '#a855f7' }}>
            {activeBrandLeads} Lead
          </div>
          <div className="kpi-desc">
            Pipeline Brand {session.activeBrand.name} ({convertedCount}{' '}
            Terkonversi)
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
          leads={leads}
          activeBrandCode={session.activeBrand.code}
        />
      </div>
    </div>
  );
}
