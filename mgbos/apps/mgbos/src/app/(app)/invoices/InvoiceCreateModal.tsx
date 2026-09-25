'use client';

import {
  useState,
  startTransition,
  useActionState,
  useRef,
  useEffect,
} from 'react';
import { createInvoiceAction, InvoiceActionResult } from './actions';

export function InvoiceCreateModal({
  orderId,
  orderNumber,
  grandTotal,
  alreadyInvoiced = '0',
  defaultType = 'DOWN_PAYMENT',
  suggestedSubtotal,
  suggestedShipping = '0',
  defaultDueDate = '',
}: {
  orderId: string;
  orderNumber: string;
  grandTotal: string;
  alreadyInvoiced?: string;
  defaultType?: 'DOWN_PAYMENT' | 'FINAL_PAYMENT' | 'FULL_PAYMENT' | 'PROGRESS';
  suggestedSubtotal?: string;
  suggestedShipping?: string;
  defaultDueDate?: string;
}) {
  const [open, setOpen] = useState(false);
  const [invoiceType, setInvoiceType] = useState<string>(defaultType);

  const remainingQuota = BigInt(grandTotal) - BigInt(alreadyInvoiced);

  const [subtotalInput, setSubtotalInput] = useState<string>(
    suggestedSubtotal ??
      (remainingQuota > 0n ? (remainingQuota / 2n).toString() : '0'),
  );
  const [shippingInput, setShippingInput] = useState<string>(suggestedShipping);
  const [taxInput, setTaxInput] = useState<string>('0');
  const [dueDateInput, setDueDateInput] = useState<string>(defaultDueDate);

  const calcTotal =
    BigInt(subtotalInput || '0') +
    BigInt(shippingInput || '0') +
    BigInt(taxInput || '0');

  const [state, action, pending] = useActionState(
    async (
      _prev: InvoiceActionResult,
      formData: FormData,
    ): Promise<InvoiceActionResult> => {
      const type = String(formData.get('invoiceType') ?? 'DOWN_PAYMENT');
      const subtotal = String(formData.get('amountSubtotal') ?? '0').trim();
      const shipping = String(formData.get('amountShipping') ?? '0').trim();
      const tax = String(formData.get('amountTax') ?? '0').trim();
      const dueDate = String(formData.get('dueDate') ?? '').trim();
      const notes = String(formData.get('notes') ?? '').trim();

      const res = await createInvoiceAction({
        orderId,
        invoiceType: type,
        amountSubtotal: BigInt(subtotal || '0'),
        amountShipping: BigInt(shipping || '0'),
        amountTax: BigInt(tax || '0'),
        dueDate: dueDate || null,
        notes: notes || null,
      });

      if (res.success) {
        setOpen(false);
      }
      return res;
    },
    {},
  );

  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.error) errorRef.current?.focus();
  }, [state]);

  const money = (n: bigint | string | number) =>
    'Rp ' + BigInt(n).toLocaleString('id-ID');

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="btn-primary"
        style={{ padding: '8px 16px', fontSize: '0.9rem' }}
      >
        {open ? 'Tutup Formulir Tagihan' : '📄 Terbitkan Tagihan (Invoice)'}
      </button>

      {open && (
        <form
          className="requirement-form"
          action={action}
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            startTransition(() => action(data));
          }}
          style={{
            marginTop: '1.25rem',
            border: '1px solid #38bdf8',
            padding: '1.5rem',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.03)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, color: '#38bdf8' }}>
              Penerbitan Invoice Komersial — {orderNumber}
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Sisa Plafon Pesanan:{' '}
              <strong style={{ color: '#4ade80' }}>
                {money(remainingQuota)}
              </strong>
            </span>
          </div>

          {state.error && (
            <p
              role="alert"
              tabIndex={-1}
              ref={errorRef}
              className="error-banner"
              style={{ marginTop: '1rem' }}
            >
              {state.error}
            </p>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <div>
              <label htmlFor="invoiceType">Termin / Tipe Tagihan *</label>
              <select
                id="invoiceType"
                name="invoiceType"
                className="form-input"
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value)}
                required
              >
                <option value="DOWN_PAYMENT">
                  DOWN_PAYMENT (Uang Muka 50%)
                </option>
                <option value="FINAL_PAYMENT">
                  FINAL_PAYMENT (Pelunasan Akhir &amp; Ongkir)
                </option>
                <option value="FULL_PAYMENT">
                  FULL_PAYMENT (100% Pembayaran Penuh)
                </option>
                <option value="PROGRESS">
                  PROGRESS (Termin Bertahap / Milestones)
                </option>
                <option value="RETENTION">
                  RETENTION (Retensi Jaminan Proyek)
                </option>
              </select>
            </div>
            <div>
              <label htmlFor="dueDate">Jatuh Tempo Pembayaran *</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                className="form-input"
                value={dueDateInput}
                onChange={(e) => setDueDateInput(e.target.value)}
                required
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem',
              marginTop: '0.75rem',
            }}
          >
            <div>
              <label htmlFor="amountSubtotal">Nilai Pokok Produk (Rp) *</label>
              <input
                id="amountSubtotal"
                name="amountSubtotal"
                type="number"
                min="0"
                className="form-input"
                value={subtotalInput}
                onChange={(e) => setSubtotalInput(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="amountShipping">Alokasi Ongkir Kurir (Rp)</label>
              <input
                id="amountShipping"
                name="amountShipping"
                type="number"
                min="0"
                className="form-input"
                value={shippingInput}
                onChange={(e) => setShippingInput(e.target.value)}
              />
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Pass-through escrow
              </span>
            </div>
            <div>
              <label htmlFor="amountTax">PPN / Pajak (Rp)</label>
              <input
                id="amountTax"
                name="amountTax"
                type="number"
                min="0"
                className="form-input"
                value={taxInput}
                onChange={(e) => setTaxInput(e.target.value)}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: '1rem',
              padding: '12px 16px',
              background: '#0f172a',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #334155',
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Total Nilai Faktur Tagihan:
            </span>
            <span
              style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4ade80' }}
            >
              {money(calcTotal)}
            </span>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <label htmlFor="notes">Catatan &amp; Instruksi Khusus</label>
            <input
              id="notes"
              name="notes"
              type="text"
              className="form-input"
              placeholder="cth. Mohon transfer sebelum tanggal cut-off jadwal sablon"
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '1.25rem',
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-secondary"
            >
              Batal
            </button>
            <button className="btn-primary" disabled={pending}>
              {pending ? 'Menerbitkan…' : '✅ Simpan Draf Tagihan'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
