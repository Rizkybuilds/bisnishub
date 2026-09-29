import Link from 'next/link';
import { hasPermission } from '@mgbos/auth';
import {
  quoteContext,
  readRows,
  rupiah,
  marginText,
  type QuoteRow,
  type QuoteVersionRow,
  type RequirementChoice,
  type CostRow,
} from './data';
import { QuoteForm } from './QuoteForm';
import { QuoteCommand } from './QuoteCommand';
import { OrderCreateForm } from '../orders/OrderCreateForm';
export const metadata = { title: 'Penawaran & HPP — MGBOS' };
const guards: Record<string, string> = {
  TARGET: 'Target ≥30%',
  CAUTION: 'Di bawah target 30%',
  WARNING: 'Peringatan: margin di bawah 25%',
  APPROVAL_REQUIRED: 'Wajib persetujuan owner: margin di bawah 20%',
};
export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const ctx = await quoteContext();
  const can = (permission: Parameters<typeof hasPermission>[1]) =>
    hasPermission(ctx.session.role.code, permission);
  const brand = (
    await readRows<{ id: string }>(
      'brands?organization_id=eq.' +
        ctx.session.organization.id +
        '&code=eq.' +
        encodeURIComponent(ctx.session.activeBrand.code) +
        '&status=eq.ACTIVE&select=id',
      ctx,
    )
  )[0];
  if (!brand) return <p role="alert">Brand aktif tidak tersedia.</p>;
  const rows = await readRows<QuoteRow>(
    'quotes?organization_id=eq.' +
      ctx.session.organization.id +
      '&brand_id=eq.' +
      brand.id +
      '&select=id,quote_number,current_version_id,customer_account_id,requirement_id&order=created_at.desc&limit=100',
    ctx,
  );
  const params = await searchParams;
  const selected = rows.find((r) => r.id === params.id);
  const versions = selected
    ? await readRows<QuoteVersionRow>(
        'quote_versions?quote_id=eq.' +
          selected.id +
          '&select=id,quote_id,version_number,requirement_version_id,status,subtotal:subtotal::text,discount_total:discount_total::text,shipping_total:shipping_total::text,grand_total:grand_total::text,estimated_cost_total:estimated_cost_total::text,estimated_gross_profit:estimated_gross_profit::text,pricing_guard,valid_until,terms_snapshot,customer_snapshot&order=version_number.desc',
        ctx,
      )
    : [];
  const current = versions.find((v) => v.id === selected?.current_version_id);
  const parents = can('quotes:create')
    ? await readRows<{
        id: string;
        title: string;
        current_version_id: string;
        customer_account_id: string | null;
      }>(
        'requirements?organization_id=eq.' +
          ctx.session.organization.id +
          '&brand_id=eq.' +
          brand.id +
          '&status=neq.CANCELLED&select=id,title,current_version_id,customer_account_id&order=created_at.desc&limit=100',
        ctx,
      )
    : [];
  const versionIds = parents.map((r) => r.current_version_id).filter(Boolean);
  const reqVersions = versionIds.length
    ? await readRows<{ id: string; quantity: number | null; unit: string }>(
        'requirement_versions?id=in.(' +
          versionIds.join(',') +
          ')&select=id,quantity,unit',
        ctx,
      )
    : [];
  const choices: RequirementChoice[] = parents.flatMap((r) => {
    const v = reqVersions.find((v) => v.id === r.current_version_id);
    return v?.quantity
      ? [
          {
            id: r.id,
            versionId: v.id,
            title: r.title,
            quantity: v.quantity,
            unit: v.unit,
            customerId: r.customer_account_id,
          },
        ]
      : [];
  });
  const customers = can('quotes:create')
    ? await readRows<{ id: string; display_name: string }>(
        'customer_accounts?organization_id=eq.' +
          ctx.session.organization.id +
          '&status=eq.ACTIVE&select=id,display_name&order=display_name&limit=100',
        ctx,
      )
    : [];
  const items = current
    ? await readRows<{ id: string; unit_price: string }>(
        'quote_items?quote_version_id=eq.' +
          current.id +
          '&select=id,unit_price:unit_price::text',
        ctx,
      )
    : [];
  const costs = items[0]
    ? await readRows<CostRow>(
        'quote_cost_components?quote_item_id=eq.' +
          items[0].id +
          '&select=cost_type,description,quantity,unit_cost:unit_cost::text,total_cost:total_cost::text',
        ctx,
      )
    : [];
  const approvals = selected
    ? await readRows<{
        quote_version_id: string;
        reason: string;
        created_at: string;
      }>(
        'quote_price_approvals?quote_version_id=in.(' +
          versions.map((v) => v.id).join(',') +
          ')&select=quote_version_id,reason,created_at',
        ctx,
      )
    : [];
  const existingOrders =
    current && current.status === 'ACCEPTED'
      ? await readRows<{ id: string; order_number: string }>(
          `orders?source_quote_version_id=eq.${current.id}&select=id,order_number`,
          ctx,
        )
      : [];
  const activeOrder = existingOrders[0];
  return (
    <div>
      <h1>Penawaran &amp; HPP</h1>
      <p>
        {ctx.session.activeBrand.name} · Penawaran berbasis versi kebutuhan dan
        biaya langsung. Seluruh angka dalam rupiah.
      </p>
      {can('quotes:create') && (
        <details className="card">
          <summary>Buat penawaran baru</summary>
          {choices.length ? (
            <QuoteForm
              requestId={crypto.randomUUID()}
              requirements={choices}
              customers={customers}
            />
          ) : (
            <p>
              Catat kebutuhan dengan jumlah positif terlebih dahulu di{' '}
              <Link href="/requirements">Kebutuhan pesanan</Link>.
            </p>
          )}
        </details>
      )}
      <section className="card">
        <h2>Daftar penawaran</h2>
        <p>Hingga 100 penawaran terbaru pada brand aktif.</p>
        {rows.length ? (
          <ul>
            {rows.map((q) => (
              <li key={q.id}>
                <Link href={'/quotes?id=' + q.id}>{q.quote_number}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Belum ada penawaran.</p>
        )}
      </section>
      {params.id && !selected && (
        <p role="alert">Penawaran tidak ditemukan pada daftar brand aktif.</p>
      )}
      {selected && current && (
        <section className="card">
          <h2>
            {selected.quote_number} — {current.customer_snapshot.display_name}
          </h2>
          <p>
            Versi aktif {current.version_number} · {current.status}
          </p>
          {can('quotes:create') &&
            !['ACCEPTED', 'CANCELLED'].includes(current.status) && (
              <details>
                <summary>Buat revisi penawaran</summary>
                <QuoteForm
                  key={current.id}
                  requestId={crypto.randomUUID()}
                  quoteId={selected.id}
                  version={current}
                  requirements={choices.filter(
                    (c) => c.id === selected.requirement_id,
                  )}
                  customers={customers.filter(
                    (c) => c.id === selected.customer_account_id,
                  )}
                  customerId={selected.customer_account_id}
                  costs={costs}
                  unitPrice={items[0]?.unit_price}
                />
              </details>
            )}
          <h3>HPP versi aktif (internal)</h3>
          <ul>
            {costs.map((c, i) => (
              <li key={i}>
                {c.description} — {c.quantity} × {rupiah(c.unit_cost)} ={' '}
                {rupiah(c.total_cost ?? '0')}
              </li>
            ))}
          </ul>
          {current.status === 'DRAFT' && (
            <>
              <p>{guards[current.pricing_guard]}</p>
              {current.pricing_guard === 'APPROVAL_REQUIRED' &&
                !approvals.some((a) => a.quote_version_id === current.id) &&
                can('quotes:approve') && (
                  <QuoteCommand operation="approve" versionId={current.id} />
                )}
              {can('quotes:send') && (
                <QuoteCommand operation="send" versionId={current.id} />
              )}
            </>
          )}
          {current.status === 'SENT' && can('quotes:accept') && (
            <div style={{ marginTop: '1rem' }}>
              <QuoteCommand operation="accept" versionId={current.id} />
            </div>
          )}
          {current.status === 'ACCEPTED' && (
            <div style={{ marginTop: '1rem' }}>
              {activeOrder ? (
                <div
                  className="card"
                  style={{
                    borderColor: '#22c55e',
                    background: 'rgba(34, 197, 94, 0.05)',
                  }}
                >
                  <p style={{ margin: 0, color: '#22c55e', fontWeight: 600 }}>
                    ✅ Kontrak Pesanan Aktif:{' '}
                    <Link
                      href={`/orders/${activeOrder.id}`}
                      style={{ textDecoration: 'underline' }}
                    >
                      {activeOrder.order_number}
                    </Link>
                  </p>
                </div>
              ) : can('orders:create') ? (
                <details
                  className="card"
                  open
                  style={{ borderColor: '#38bdf8' }}
                >
                  <summary style={{ fontWeight: 700, color: '#38bdf8' }}>
                    🔒 Konversi ke Kontrak Pesanan Resmi (Order Contract)
                  </summary>
                  <OrderCreateForm
                    quoteVersionId={current.id}
                    customerName={current.customer_snapshot?.display_name}
                  />
                </details>
              ) : null}
            </div>
          )}
          <h3>Riwayat penawaran</h3>
          {versions.map((v) => (
            <article className="requirement-version" key={v.id}>
              <h4>
                Versi {v.version_number} · {v.status}
              </h4>
              <p>
                <Link href={'/quotes/' + selected.id + '/versions/' + v.id}>
                  Lihat dokumen / unduh PDF
                </Link>
              </p>
              <p>
                {guards[v.pricing_guard]} · Margin{' '}
                {marginText(
                  v.estimated_gross_profit,
                  BigInt(v.subtotal) - BigInt(v.discount_total),
                )}
              </p>
              <dl>
                <dt>Pendapatan produk setelah diskon</dt>
                <dd>{rupiah(BigInt(v.subtotal) - BigInt(v.discount_total))}</dd>
                <dt>HPP</dt>
                <dd>{rupiah(v.estimated_cost_total)}</dd>
                <dt>Laba kotor</dt>
                <dd>{rupiah(v.estimated_gross_profit)}</dd>
                <dt>Ongkir pelanggan</dt>
                <dd>{rupiah(v.shipping_total)}</dd>
                <dt>Total pelanggan</dt>
                <dd>{rupiah(v.grand_total)}</dd>
                <dt>Berlaku sampai</dt>
                <dd>{v.valid_until}</dd>
                <dt>Termin pembayaran</dt>
                <dd>{v.terms_snapshot.payment_terms}</dd>
                <dt>Estimasi pengerjaan</dt>
                <dd>{v.terms_snapshot.lead_time}</dd>
              </dl>
              {v.terms_snapshot.notes && <p>{v.terms_snapshot.notes}</p>}
              {approvals
                .filter((a) => a.quote_version_id === v.id)
                .map((a) => (
                  <p key={a.quote_version_id}>Persetujuan owner: {a.reason}</p>
                ))}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
