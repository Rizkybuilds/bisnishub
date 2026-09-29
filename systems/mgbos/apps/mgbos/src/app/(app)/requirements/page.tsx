import Link from 'next/link';
import { atelierMissingInformation } from '@mgbos/domain';
import { customAtelierSchema } from '@mgbos/validation';
import { hasPermission } from '@mgbos/auth';
import {
  requirementContext,
  readRows,
  type RequirementRow,
  type VersionRow,
} from './data';
import { RequirementForm } from './RequirementForm';
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
  searchParams: Promise<{ id?: string }>;
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
    ? await readRows<{ id: string; title: string }>(
        'leads?organization_id=eq.' +
          ctx.session.organization.id +
          '&brand_id=eq.' +
          brand.id +
          '&select=id,title&order=created_at.desc&limit=100',
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
  return (
    <div>
      <h1>Kebutuhan pesanan</h1>
      <p>
        {ctx.session.activeBrand.name} · Catat spesifikasi, simpan revisi, dan
        kunci versi yang menjadi acuan.
      </p>
      {can('requirements:create') && (
        <details className="card">
          <summary>Tambah kebutuhan baru</summary>
          <RequirementForm
            operation="create"
            leads={leads.map((l) => ({ id: l.id, label: l.title }))}
            customers={customers.map((c) => ({
              id: c.id,
              label: c.display_name,
            }))}
          />
        </details>
      )}
      {ctx.session.activeBrand.code === 'TS' && can('requirements:create') && (
        <details className="card">
          <summary>Tambah Custom Atelier TeeStock</summary>
          <RequirementForm
            operation="create"
            atelier
            leads={leads.map((l) => ({ id: l.id, label: l.title }))}
            customers={customers.map((c) => ({
              id: c.id,
              label: c.display_name,
            }))}
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
