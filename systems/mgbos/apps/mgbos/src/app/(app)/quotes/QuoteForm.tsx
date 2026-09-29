'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveQuoteSchema, type SaveQuoteInput } from '@mgbos/validation';
import { QUOTE_COST_TYPES, quotePricing } from '@mgbos/domain';
import { saveQuote, type QuoteResult } from './actions';
import type { RequirementChoice, QuoteVersionRow, CostRow } from './data';
const costLabels: Record<string, string> = {
  GARMENT: 'Pakaian / bahan',
  PRINTING: 'Sablon / cetak',
  EMBROIDERY: 'Bordir',
  LABEL: 'Label',
  PACKAGING: 'Kemasan',
  SHIPPING: 'Transport produksi',
  VENDOR: 'Jasa vendor',
  LABOR: 'Tenaga kerja',
  OTHER: 'Lainnya',
  BUFFER: 'Cadangan biaya',
};
const money = (n: bigint) => 'Rp ' + n.toLocaleString('id-ID');
export function QuoteForm({
  requestId,
  requirements,
  customers,
  quoteId,
  version,
  costs = [],
  unitPrice = '0',
  customerId,
}: {
  requestId: string;
  requirements: RequirementChoice[];
  customers: { id: string; display_name: string }[];
  quoteId?: string;
  version?: QuoteVersionRow;
  costs?: CostRow[];
  unitPrice?: string;
  customerId?: string;
}) {
  const router = useRouter();
  const [result, setResult] = useState<QuoteResult>({});
  const [pending, startTransition] = useTransition();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SaveQuoteInput>({
    resolver: zodResolver(saveQuoteSchema),
    defaultValues: {
      requestId,
      quoteId: quoteId ?? null,
      expectedVersionId: version?.id ?? null,
      requirementVersionId:
        requirements.find(
          (r) => r.versionId === version?.requirement_version_id,
        )?.versionId ??
        requirements[0]?.versionId ??
        '',
      customerId: customerId ?? requirements[0]?.customerId ?? '',
      unitPrice,
      discount: version?.discount_total ?? '0',
      shipping: version?.shipping_total ?? '0',
      validUntil: version?.valid_until ?? '',
      terms:
        version?.terms_snapshot.payment_terms ??
        'DP 50%, pelunasan sebelum pengiriman',
      leadTime: version?.terms_snapshot.lead_time ?? '',
      notes: version?.terms_snapshot.notes ?? '',
      costs: costs.length
        ? costs.map((c) => ({
            description: c.description,
            quantity: c.quantity,
            unit_cost: c.unit_cost,
            cost_type:
              c.cost_type as SaveQuoteInput['costs'][number]['cost_type'],
          }))
        : [
            {
              cost_type: 'GARMENT',
              description: 'Blank pakaian',
              quantity: requirements[0]?.quantity ?? 1,
              unit_cost: '0',
            },
          ],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'costs' });
  const values = useWatch({ control });
  const source = requirements.find(
    (r) => r.versionId === values.requirementVersionId,
  );
  let preview: ReturnType<typeof quotePricing> | undefined;
  try {
    if (source) {
      const cost = (values.costs ?? []).reduce(
        (sum, c) => sum + BigInt(c.quantity ?? 0) * BigInt(c.unit_cost ?? ''),
        0n,
      );
      preview = quotePricing(
        source.quantity,
        BigInt(values.unitPrice ?? ''),
        BigInt(values.discount ?? ''),
        BigInt(values.shipping ?? ''),
        cost,
      );
    }
  } catch {
    /* Incomplete input is expected while typing. */
  }
  const prefix = quoteId ?? 'new-quote';
  return (
    <form
      className="requirement-form"
      onSubmit={handleSubmit((data) =>
        startTransition(async () => {
          const response = await saveQuote(data);
          setResult(response);
          if (response.success && response.quoteId) {
            router.push('/quotes?id=' + response.quoteId);
            router.refresh();
          }
        }),
      )}
    >
      {result.error && (
        <p role="alert" className="error-banner">
          {result.error}
        </p>
      )}
      {Object.keys(errors).length > 0 && (
        <p role="alert" className="error-banner">
          Periksa isian wajib, tanggal, jumlah, dan nominal rupiah bulat. Setiap
          komponen HPP memerlukan nama, jumlah, dan biaya satuan.
        </p>
      )}
      {result.success && <p role="status">Versi penawaran tersimpan.</p>}
      <label htmlFor={prefix + 'req'}>Versi kebutuhan pesanan</label>
      <select
        className="form-input"
        id={prefix + 'req'}
        {...register('requirementVersionId')}
      >
        {requirements.map((r) => (
          <option key={r.versionId} value={r.versionId}>
            {r.title} — {r.quantity} {r.unit}
          </option>
        ))}
      </select>
      <p>
        Harga satuan mengikuti jumlah pada versi kebutuhan terpilih. Revisi
        tidak mengubah penawaran lama.
      </p>
      <label htmlFor={prefix + 'customer'}>Pelanggan</label>
      <select
        className="form-input"
        id={prefix + 'customer'}
        {...register('customerId')}
      >
        <option value="">Pilih pelanggan</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.display_name}
          </option>
        ))}
      </select>
      <div className="requirement-grid">
        {(
          [
            ['unitPrice', 'Harga jual per satuan (Rp)'],
            ['discount', 'Diskon total produk (Rp)'],
            ['shipping', 'Ongkir pelanggan (Rp, di luar margin)'],
          ] as const
        ).map(([name, label]) => (
          <div key={name}>
            <label htmlFor={prefix + name}>{label}</label>
            <input
              className="form-input"
              id={prefix + name}
              inputMode="numeric"
              {...register(name)}
            />
          </div>
        ))}
      </div>
      <fieldset>
        <legend>Rincian HPP internal</legend>
        <p>
          Biaya ini hanya untuk tim internal. Transport produksi masuk HPP;
          ongkir titipan pelanggan dicatat terpisah di atas.
        </p>
        {fields.map((field, index) => (
          <fieldset key={field.id}>
            <legend>Komponen {index + 1}</legend>
            <div className="requirement-grid">
              <div>
                <label htmlFor={prefix + 'type' + index}>Jenis biaya</label>
                <select
                  className="form-input"
                  id={prefix + 'type' + index}
                  {...register(`costs.${index}.cost_type`)}
                >
                  {QUOTE_COST_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {costLabels[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={prefix + 'description' + index}>
                  Nama biaya
                </label>
                <input
                  className="form-input"
                  id={prefix + 'description' + index}
                  {...register(`costs.${index}.description`)}
                />
              </div>
              <div>
                <label htmlFor={prefix + 'qty' + index}>Jumlah komponen</label>
                <input
                  className="form-input"
                  id={prefix + 'qty' + index}
                  type="number"
                  min="1"
                  step="1"
                  {...register(`costs.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <label htmlFor={prefix + 'cost' + index}>
                  Biaya satuan (Rp)
                </label>
                <input
                  className="form-input"
                  id={prefix + 'cost' + index}
                  inputMode="numeric"
                  {...register(`costs.${index}.unit_cost`)}
                />
              </div>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Hapus komponen {index + 1}
            </button>
          </fieldset>
        ))}
        <button
          type="button"
          className="btn-secondary"
          disabled={fields.length >= 30}
          onClick={() =>
            append({
              cost_type: 'OTHER',
              description: '',
              quantity: 1,
              unit_cost: '0',
            })
          }
        >
          Tambah komponen HPP
        </button>
      </fieldset>
      <aside className="card" aria-live="polite">
        <h3>Estimasi penawaran</h3>
        {preview ? (
          <>
            <p>
              Pendapatan produk: {money(preview.revenue)} · HPP:{' '}
              {money(preview.cost)}
            </p>
            <p>
              Laba kotor: {money(preview.profit)} · Total pelanggan:{' '}
              {money(preview.grandTotal)}
            </p>
            <p>
              {preview.guard === 'APPROVAL_REQUIRED'
                ? 'Margin di bawah 20%: persetujuan owner wajib sebelum ditandai dikirim.'
                : preview.guard === 'WARNING'
                  ? 'Margin 20–24,99%: peringatan kuat.'
                  : preview.guard === 'CAUTION'
                    ? 'Margin 25–29,99%: di bawah target 30%.'
                    : 'Margin mencapai target minimal 30%.'}
            </p>
          </>
        ) : (
          <p>Isi jumlah, harga dan HPP positif untuk melihat estimasi.</p>
        )}
      </aside>
      <label htmlFor={prefix + 'valid'}>Berlaku sampai</label>
      <input
        className="form-input"
        id={prefix + 'valid'}
        type="date"
        {...register('validUntil')}
      />
      <label htmlFor={prefix + 'terms'}>Termin pembayaran</label>
      <textarea
        className="form-input"
        id={prefix + 'terms'}
        {...register('terms')}
      />
      <label htmlFor={prefix + 'lead'}>Estimasi waktu pengerjaan</label>
      <input
        className="form-input"
        id={prefix + 'lead'}
        {...register('leadTime')}
      />
      <label htmlFor={prefix + 'notes'}>
        Catatan untuk pelanggan (masuk dokumen)
      </label>
      <textarea
        className="form-input"
        id={prefix + 'notes'}
        {...register('notes')}
      />
      <button
        className="btn-primary"
        disabled={pending || result.success || requirements.length === 0}
      >
        {pending
          ? 'Menyimpan…'
          : version
            ? 'Simpan revisi penawaran'
            : 'Simpan draf penawaran'}
      </button>
    </form>
  );
}
