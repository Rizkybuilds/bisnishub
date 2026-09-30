import Link from 'next/link';
import {
  atelierMissingInformation,
  isLeadEligibleForRequirement,
  mapLeadToRequirementPrefill,
  type LeadStatus,
} from '@mgbos/domain';
import { customAtelierSchema } from '@mgbos/validation';
import { hasPermission } from '@mgbos/auth';
import {
  requirementContext,
  readRows,
  type RequirementRow,
  type VersionRow,
} from './data';
import { RequirementForm, type RequirementPrefill } from './RequirementForm';
import { AtelierSummary } from './AtelierSummary';
export const metadata = { title: 'Kebutuhan Pesanan — MGBOS' };
const labels: Record<string, string> = {
  DRAFT: 'Draf',
  NEEDS_INFORMATION: 'Perlu informasi',
  READY: 'Siap',
  LOCKED: 'Terkunci',
  CANCELLED: 'Dibatalkan',
};
export default async function RequirementsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; leadId?: string }>;
}) {
  const ctx = await requirementContext();
  const params = await searchParams;
  const brands = await readRows<{ id: string }>(
    'brands?organization_id=eq.' +
      ctx.session.organization.id +
      '&code=eq.' +
      encodeURIComponent(ctx.session.activeBrand.code) +
      '&status=eq.ACTIVE&select=id',
    ctx,
  );
  const brand = brands[0];
  if (!brand) return <p role="alert">Brand aktif tidak tersedia.</p>;
  const rows = await readRows<RequirementRow>(
    'requirements?organization_id=eq.' +
      ctx.session.organization.id +
      '&brand_id=eq.' +
      brand.id +
      '&select=id,title,requirement_number,status,current_version_id,brand_id,lead_id,customer_account_id&order=created_at.desc&limit=100',
    ctx,
  );
  const selected = params.id ? rows.find((r) => r.id === params.id) : undefined;
  const versions = selected
    ? await readRows<VersionRow>(
        'requirement_versions?requirement_id=eq.' +
          selected.id +
          '&select=id,version_number,summary,quantity,unit,target_budget:target_budget::text,target_date,specification,is_locked,locked_reason,created_at&order=version_number.desc',
        ctx,
      )
    : [];
  const current = versions.find((v) => v.id === selected?.current_version_id);
  const can = (permission: Parameters<typeof hasPermission>[1]) =>
    hasPermission(ctx.session.role.code, permission);
  const leads = can('requirements:create')
    ? await readRows<{ id: string; title: string; lead_number?: string }>(
        'leads?organization_id=eq.' +
          ctx.session.organization.id +
          '&brand_id=eq.' +
          brand.id +
          '&select=id,title,lead_number&order=created_at.desc&limit=100',
        ctx,
      )
    : [];
  const customers = can('requirements:create')
    ? await readRows<{ id: string; display_name: string }>(
        'customer_accounts?organization_id=eq.' +
          ctx.session.organization.id +
          '&status=eq.ACTIVE&select=id,display_name&order=display_name&limit=100',
        ctx,
      )
    : [];

  let prefill: RequirementPrefill | undefined = undefined;
  let leadNotice:
    | {
        type: 'error' | 'warning' | 'info';
        message: string;
        linkedRequirements?: Array<{
          id: string;
          requirement_number: string;
          title: string;
          status: string;
        }>;
      }
    | undefined = undefined;

  if (params.leadId && can('requirements:create')) {
    const leadRows = await readRows<{
      id: string;
      lead_number: string;
      title: string;
      raw_inquiry: string | null;
      estimated_quantity: number | null;
      estimated_budget: string | null;
      status: string;
      customer_account_id: string | null;
    }>(
      'leads?organization_id=eq.' +
        ctx.session.organization.id +
        '&brand_id=eq.' +
        brand.id +
        '&id=eq.' +
        encodeURIComponent(params.leadId) +
        '&select=id,lead_number,title,raw_inquiry,estimated_quantity,estimated_budget,status,customer_account_id',
      ctx,
    );
    const lead = leadRows[0];
    if (!lead) {
      leadNotice = {
        type: 'error',
        message:
          'Lead tidak ditemukan pada organisasi atau brand aktif saat ini (akses ditolak atau data tidak valid).',
      };
    } else if (!isLeadEligibleForRequirement(lead.status as LeadStatus)) {
      leadNotice = {
        type: 'warning',
        message: `Lead ${lead.lead_number} belum memenuhi syarat kualifikasi (status: ${lead.status}). Hanya lead QUALIFIED atau CONVERTED yang dapat dilanjutkan ke kebutuhan pesanan.`,
      };
    } else {
      try {
        prefill = mapLeadToRequirementPrefill({
          id: lead.id,
          title: lead.title,
          rawInquiry: lead.raw_inquiry,
          estimatedQuantity: lead.estimated_quantity,
          estimatedBudget: lead.estimated_budget,
          customerAccountId: lead.customer_account_id,
          status: lead.status as LeadStatus,
        });

        const existingLinked = rows.filter((r) => r.lead_id === lead.id);
        if (existingLinked.length > 0) {
          leadNotice = {
            type: 'info',
            message: `Lead ${lead.lead_number} sudah memiliki ${existingLinked.length} kebutuhan terkait sebelumnya. Form di bawah telah diprefill jika Anda ingin membuat kebutuhan baru atau revisi tambahan.`,
            linkedRequirements: existingLinked.map((el) => ({
              id: el.id,
              requirement_number: el.requirement_number,
              title: el.title,
              status: labels[el.status] ?? el.status,
            })),
          };
        }
      } catch (err: unknown) {
        leadNotice = {
          type: 'error',
          message:
            err instanceof Error ? err.message : 'Gagal memproses data lead.',
        };
      }
    }
  }

  const leadChoices = leads.map((l) => ({
    id: l.id,
    label: l.lead_number ? `${l.lead_number} — ${l.title}` : l.title,
  }));
  if (
    prefill?.leadId &&
    prefill?.title &&
    !leadChoices.some((c) => c.id === prefill.leadId)
  ) {
    leadChoices.unshift({ id: prefill.leadId, label: prefill.title });
  }

  const customerChoices = customers.map((c) => ({
    id: c.id,
    label: c.display_name,
  }));
  if (
    prefill?.customerAccountId &&
    !customerChoices.some((c) => c.id === prefill.customerAccountId)
  ) {
    const custRows = await readRows<{ id: string; display_name: string }>(
      'customer_accounts?organization_id=eq.' +
        ctx.session.organization.id +
        '&id=eq.' +
        encodeURIComponent(prefill.customerAccountId) +
        '&select=id,display_name',
      ctx,
    );
    if (custRows[0]) {
      customerChoices.unshift({
        id: custRows[0].id,
        label: custRows[0].display_name,
      });
    }
  }

  return (
    <div>
      <h1>Kebutuhan pesanan</h1>
      <p>
        {ctx.session.activeBrand.name} · Catat spesifikasi, simpan revisi, dan
        kunci versi yang menjadi acuan.
      </p>
      {leadNotice && (
        <div
          role={leadNotice.type === 'error' ? 'alert' : 'status'}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            border:
              leadNotice.type === 'error'
                ? '1px solid #dc2626'
                : leadNotice.type === 'warning'
                  ? '1px solid #d97706'
                  : '1px solid #0284c7',
            background:
              leadNotice.type === 'error'
                ? '#450a0a'
                : leadNotice.type === 'warning'
                  ? '#451a03'
                  : '#082f49',
            color:
              leadNotice.type === 'error'
                ? '#fca5a5'
                : leadNotice.type === 'warning'
                  ? '#fde68a'
                  : '#bae6fd',
          }}
        >
          <div
            style={{
              fontWeight: 600,
              marginBottom: leadNotice.linkedRequirements?.length ? '6px' : 0,
            }}
          >
            {leadNotice.message}
          </div>
          {leadNotice.linkedRequirements &&
            leadNotice.linkedRequirements.length > 0 && (
              <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                {leadNotice.linkedRequirements.map((lr) => (
                  <li key={lr.id}>
                    <Link
                      href={`/requirements?id=${lr.id}`}
                      style={{ color: '#38bdf8', textDecoration: 'underline' }}
                    >
                      {lr.requirement_number} — {lr.title} ({lr.status})
                    </Link>
                  </li>
                ))}
              </ul>
            )}
        </div>
      )}
      {can('requirements:create') && (
        <details className="card" open={Boolean(prefill)}>
          <summary>Tambah kebutuhan baru</summary>
          <RequirementForm
            operation="create"
            prefill={prefill}
            leads={leadChoices}
            customers={customerChoices}
          />
        </details>
      )}
      {ctx.session.activeBrand.code === 'TS' && can('requirements:create') && (
        <details className="card" open={Boolean(prefill)}>
          <summary>Tambah Custom Atelier TeeStock</summary>
          <RequirementForm
            operation="create"
            atelier
            prefill={prefill}
            leads={leadChoices}
            customers={customerChoices}
          />
        </details>
      )}
      <section className="card">
        <h2>Daftar kebutuhan</h2>
        <p>Menampilkan hingga 100 kebutuhan terbaru pada brand aktif.</p>
        {!rows.length ? (
          <p>
            Belum ada kebutuhan. Mulai dari inquiry atau catat kebutuhan
            pelanggan baru.
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nomor</th>
                  <th>Kebutuhan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <Link href={'/requirements?id=' + r.id}>
                        {r.requirement_number}
                      </Link>
                    </td>
                    <td>{r.title}</td>
                    <td>{labels[r.status] ?? r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {params.id && !selected && (
        <p role="alert">Kebutuhan tidak ditemukan pada daftar brand aktif.</p>
      )}
      {selected && (
        <section className="card">
          <h2>{selected.title}</h2>
          <p>
            {selected.requirement_number} · {labels[selected.status]}
          </p>
          {selected.status !== 'CANCELLED' && can('requirements:update') && (
            <div className="requirement-actions">
              {['DRAFT', 'NEEDS_INFORMATION'].includes(selected.status) && (
                <RequirementForm
                  operation="transition"
                  requirementId={selected.id}
                  targetStatus="READY"
                />
              )}
              {['DRAFT', 'READY'].includes(selected.status) && (
                <RequirementForm
                  operation="transition"
                  requirementId={selected.id}
                  targetStatus="NEEDS_INFORMATION"
                />
              )}
              <details>
                <summary>Batalkan kebutuhan</summary>
                <RequirementForm
                  operation="transition"
                  requirementId={selected.id}
                  targetStatus="CANCELLED"
                />
              </details>
            </div>
          )}
          {current &&
            selected.status !== 'CANCELLED' &&
            can('requirements:version') && (
              <details>
                <summary>Buat revisi dari versi aktif</summary>
                <p>
                  Versi lama tetap tersimpan. Revisi baru dimulai sebagai draf
                  dan perlu diperiksa kembali.
                </p>
                <RequirementForm
                  key={current.id}
                  operation="revise"
                  requirementId={selected.id}
                  version={current}
                />
              </details>
            )}
          {current &&
            (() => {
              const parsed = customAtelierSchema.safeParse(
                current.specification,
              );
              if (!parsed.success) return null;
              const missing = atelierMissingInformation(parsed.data);
              return (
                <aside>
                  <h3>Kelengkapan Custom Atelier</h3>
                  <p>
                    {missing.length
                      ? 'Masih perlu dikonfirmasi: ' + missing.join(', ')
                      : 'Rincian ukuran, dekorasi, dimensi, dan referensi artwork sudah tercatat.'}
                  </p>
                </aside>
              );
            })()}
          <h3>Riwayat versi</h3>
          {versions.map((v) => (
            <article key={v.id} className="requirement-version">
              <h4>
                Versi {v.version_number}{' '}
                {v.id === selected.current_version_id ? '· Aktif' : ''} ·{' '}
                {v.is_locked ? 'Terkunci' : 'Belum dikunci'}
              </h4>
              <p className="requirement-summary">{v.summary}</p>
              <dl>
                <dt>Jumlah</dt>
                <dd>
                  {v.quantity ?? 'Belum ditentukan'} {v.unit}
                </dd>
                <dt>Anggaran</dt>
                <dd>
                  {v.target_budget === null
                    ? 'Belum ditentukan'
                    : 'Rp ' + BigInt(v.target_budget).toLocaleString('id-ID')}
                </dd>
                <dt>Target selesai</dt>
                <dd>{v.target_date ?? 'Belum ditentukan'}</dd>
              </dl>
              {v.locked_reason && <p>Alasan kunci: {v.locked_reason}</p>}
              <AtelierSummary specification={v.specification} />
              {!customAtelierSchema.safeParse(v.specification).success &&
                Object.keys(v.specification).length > 0 && (
                  <details>
                    <summary>Rincian spesifikasi tersimpan</summary>
                    <pre className="requirement-summary">
                      {JSON.stringify(v.specification, null, 2)}
                    </pre>
                  </details>
                )}
              {!v.is_locked &&
                selected.status !== 'CANCELLED' &&
                can('requirements:lock') &&
                (v.id !== selected.current_version_id ||
                  selected.status === 'READY') && (
                  <details>
                    <summary>Kunci versi {v.version_number}</summary>
                    <RequirementForm
                      operation="lock"
                      requirementId={selected.id}
                      version={v}
                    />
                  </details>
                )}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
