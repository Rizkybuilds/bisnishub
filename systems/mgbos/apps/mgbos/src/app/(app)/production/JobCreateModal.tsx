'use client';

import {
  useState,
  startTransition,
  useActionState,
  useRef,
  useEffect,
} from 'react';
import { createProductionJobAction, ProductionActionResult } from './actions';

export function JobCreateModal({
  orderId,
  orderItems,
}: {
  orderId: string;
  orderItems: Array<{ id: string; description: string; quantity: number }>;
}) {
  const [open, setOpen] = useState(false);
  const [jobType, setJobType] = useState<string>('GARMENT');

  const defaultTitles: Record<string, string> = {
    GARMENT: 'Pengadaan Kaos Polos',
    PRINTING: 'Cetak & Press Sablon DTF',
    EMBROIDERY: 'Bordir Komputer Emblem / Dada',
    PACKAGING: 'Packaging Polymailer, Box & Hangtag',
    LABEL: 'Pemasangan Woven & Satin Label',
    FINISHING: 'Steam, Lipat & Barcode Packing',
    OTHER: 'Pekerjaan Kustom Tambahan',
  };

  const [state, action, pending] = useActionState(
    async (
      _prev: ProductionActionResult,
      formData: FormData,
    ): Promise<ProductionActionResult> => {
      const type = String(formData.get('jobType') ?? 'GARMENT');
      const title = String(formData.get('title') ?? '').trim();
      const estimatedCost = String(formData.get('estimatedCost') ?? '0').trim();
      const priority = String(formData.get('priority') ?? 'NORMAL');
      const targetDate = String(formData.get('targetDate') ?? '').trim();
      const notes = String(formData.get('notes') ?? '').trim();

      const items = orderItems.map((oi) => {
        const qty = Number(formData.get(`qty_${oi.id}`) ?? oi.quantity);
        return {
          order_item_id: oi.id,
          quantity: qty > 0 ? qty : oi.quantity,
        };
      });

      const res = await createProductionJobAction({
        orderId,
        jobType: type,
        title,
        estimatedCost: BigInt(estimatedCost || '0'),
        priority,
        targetDate: targetDate || null,
        items,
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

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="btn-primary"
        style={{ padding: '6px 14px', fontSize: '0.9rem' }}
      >
        {open
          ? 'Tutup Formulir Job'
          : '➕ Pecah Menjadi Job Produksi (Split Job)'}
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
            Buat Surat Perintah Kerja (SPK) Sub-Job
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
              <label htmlFor="jobType">Kategori Pengerjaan *</label>
              <select
                id="jobType"
                name="jobType"
                className="form-input"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                required
              >
                <option value="GARMENT">GARMENT (Bahan Kaos Polos)</option>
                <option value="PRINTING">PRINTING (Sablon DTF / Manual)</option>
                <option value="EMBROIDERY">EMBROIDERY (Bordir)</option>
                <option value="PACKAGING">
                  PACKAGING (Kemasan Box/Polymailer)
                </option>
                <option value="LABEL">LABEL (Woven / Tag)</option>
                <option value="FINISHING">FINISHING (QC &amp; Packing)</option>
                <option value="OTHER">OTHER (Lainnya)</option>
              </select>
            </div>

            <div>
              <label htmlFor="title">Judul SPK Pengerjaan *</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                defaultValue={defaultTitles[jobType] ?? ''}
                key={jobType}
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
              <label htmlFor="estimatedCost">
                Estimasi HPP Modal (Rupiah) *
              </label>
              <input
                id="estimatedCost"
                name="estimatedCost"
                type="number"
                min="0"
                className="form-input"
                defaultValue="0"
                required
              />
            </div>

            <div>
              <label htmlFor="priority">Prioritas *</label>
              <select
                id="priority"
                name="priority"
                className="form-input"
                defaultValue="NORMAL"
              >
                <option value="LOW">Rendah (Low)</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">Tinggi (High)</option>
                <option value="URGENT">Mendesak (Urgent)</option>
              </select>
            </div>

            <div>
              <label htmlFor="targetDate">Target Selesai (Opsional)</label>
              <input
                id="targetDate"
                name="targetDate"
                type="date"
                className="form-input"
              />
            </div>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <label>Alokasi Kuantitas Item Pesanan</label>
            {orderItems.map((oi) => (
              <div
                key={oi.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#0f172a',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  marginTop: '4px',
                }}
              >
                <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                  {oi.description}
                </span>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Qty Job:
                  </span>
                  <input
                    type="number"
                    name={`qty_${oi.id}`}
                    defaultValue={oi.quantity}
                    min="1"
                    className="form-input"
                    style={{ width: '80px', padding: '4px 8px', margin: 0 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <label htmlFor="notes">Instruksi Teknis Khusus</label>
            <textarea
              id="notes"
              name="notes"
              className="form-input"
              rows={2}
              placeholder="cth. Suhu press 155C 15 detik cold peel, atau vendor blanks wajib NSA 7200"
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
              {pending ? 'Menerbitkan SPK…' : '✅ Terbitkan Job Produksi'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
