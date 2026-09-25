'use client';

import {
  useState,
  startTransition,
  useActionState,
  useRef,
  useEffect,
} from 'react';
import { upsertVendorRateCardAction, VendorActionResult } from './actions';

export function RateCardModal({
  vendorId,
  initialServiceCode,
  initialDescription,
  initialUnit,
  initialUnitCost,
  initialMinQty,
  initialNotes,
}: {
  vendorId: string;
  initialServiceCode?: string;
  initialDescription?: string;
  initialUnit?: string;
  initialUnitCost?: string;
  initialMinQty?: number;
  initialNotes?: string;
}) {
  const [open, setOpen] = useState(false);

  const [state, action, pending] = useActionState(
    async (
      _prev: VendorActionResult,
      formData: FormData,
    ): Promise<VendorActionResult> => {
      const serviceCode = String(formData.get('serviceCode') ?? '').trim();
      const description = String(formData.get('description') ?? '').trim();
      const unit = String(formData.get('unit') ?? 'pcs');
      const unitCost = String(formData.get('unitCost') ?? '0').trim();
      const minOrderQuantity = Number(formData.get('minOrderQuantity') ?? 1);
      const notes = String(formData.get('notes') ?? '').trim();

      const res = await upsertVendorRateCardAction({
        vendorId,
        serviceCode,
        description,
        unit,
        unitCost: BigInt(unitCost || '0'),
        minOrderQuantity,
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

  const isEdit = Boolean(initialServiceCode);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={isEdit ? 'btn-secondary' : 'btn-primary'}
        style={{
          padding: isEdit ? '3px 8px' : '6px 14px',
          fontSize: isEdit ? '0.75rem' : '0.85rem',
        }}
      >
        {isEdit ? 'Edit Tarif' : '➕ Tambah Layanan &amp; Rate Card'}
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
            marginTop: '1rem',
            border: '1px solid #38bdf8',
            padding: '1.25rem',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.03)',
          }}
        >
          <h3 style={{ margin: '0 0 0.75rem', color: '#38bdf8' }}>
            {isEdit
              ? 'Perbarui Rate Card Layanan'
              : 'Daftarkan Rate Card Layanan Baru'}
          </h3>

          {state.error && (
            <p
              role="alert"
              tabIndex={-1}
              ref={errorRef}
              className="error-banner"
            >
              {state.error}
            </p>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '1rem',
            }}
          >
            <div>
              <label htmlFor="serviceCode">Kode Layanan / SKU *</label>
              <input
                id="serviceCode"
                name="serviceCode"
                type="text"
                className="form-input"
                defaultValue={initialServiceCode ?? ''}
                readOnly={isEdit}
                placeholder="cth. DTF_PRINT_58CM"
                required
                minLength={2}
              />
            </div>
            <div>
              <label htmlFor="description">Deskripsi Layanan *</label>
              <input
                id="description"
                name="description"
                type="text"
                className="form-input"
                defaultValue={initialDescription ?? ''}
                placeholder="cth. Cetak DTF Roll 58cm Tinta Original &amp; Serbuk Lem PU"
                required
                minLength={3}
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
              <label htmlFor="unit">Satuan Ukur *</label>
              <select
                id="unit"
                name="unit"
                className="form-input"
                defaultValue={initialUnit ?? 'pcs'}
                required
              >
                <option value="pcs">pcs (Per Potong)</option>
                <option value="meter">meter (Per Meter Lari)</option>
                <option value="cm">cm (Per Centimeter)</option>
                <option value="sheet">sheet (Per Lembar)</option>
                <option value="roll">roll (Per Gulung)</option>
                <option value="lot">lot (Per Paket/Lot)</option>
              </select>
            </div>
            <div>
              <label htmlFor="unitCost">Tarif Satuan (Rupiah) *</label>
              <input
                id="unitCost"
                name="unitCost"
                type="number"
                min="0"
                className="form-input"
                defaultValue={initialUnitCost ?? '0'}
                required
              />
            </div>
            <div>
              <label htmlFor="minOrderQuantity">Min. Order Qty (MOQ) *</label>
              <input
                id="minOrderQuantity"
                name="minOrderQuantity"
                type="number"
                min="1"
                className="form-input"
                defaultValue={initialMinQty ?? 1}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <label htmlFor="notes">Catatan Spesifikasi Teknis</label>
            <input
              id="notes"
              name="notes"
              type="text"
              className="form-input"
              defaultValue={initialNotes ?? ''}
              placeholder="cth. Termasuk hot peel, file wajib siap cetak 300 DPI"
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '1rem',
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
              {pending ? 'Menyimpan…' : '✅ Simpan Rate Card'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
