'use client';

import {
  useState,
  startTransition,
  useActionState,
  useRef,
  useEffect,
} from 'react';
import { createVendorAction, VendorActionResult } from './actions';

export function VendorCreateModal() {
  const [open, setOpen] = useState(false);

  const [state, action, pending] = useActionState(
    async (
      _prev: VendorActionResult,
      formData: FormData,
    ): Promise<VendorActionResult> => {
      const code = String(formData.get('code') ?? '').trim();
      const name = String(formData.get('name') ?? '').trim();
      const category = String(formData.get('category') ?? 'GARMENT_SUPPLIER');
      const contactPerson = String(formData.get('contactPerson') ?? '').trim();
      const phone = String(formData.get('phone') ?? '').trim();
      const email = String(formData.get('email') ?? '').trim();
      const address = String(formData.get('address') ?? '').trim();
      const leadTimeDays = Number(formData.get('leadTimeDays') ?? 3);
      const paymentTerms = String(formData.get('paymentTerms') ?? 'COD');
      const notes = String(formData.get('notes') ?? '').trim();

      const res = await createVendorAction({
        code,
        name,
        category,
        contactPerson: contactPerson || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
        leadTimeDays,
        paymentTerms,
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
        style={{ padding: '8px 16px', fontSize: '0.9rem' }}
      >
        {open ? 'Tutup Pendaftaran' : '➕ Daftarkan Mitra Vendor Baru'}
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
          <h3 style={{ margin: '0 0 1rem', color: '#38bdf8' }}>
            Registrasi Mitra Vendor &amp; Subkontraktor
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
              <label htmlFor="code">Kode Vendor *</label>
              <input
                id="code"
                name="code"
                type="text"
                className="form-input"
                placeholder="cth. VND-NSA-01"
                required
                minLength={3}
              />
            </div>
            <div>
              <label htmlFor="name">Nama Vendor / Badan Usaha *</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="cth. PT Mulia Garmen Blanks Indonesia"
                required
                minLength={2}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginTop: '0.75rem',
            }}
          >
            <div>
              <label htmlFor="category">Kategori Layanan *</label>
              <select
                id="category"
                name="category"
                className="form-input"
                required
              >
                <option value="GARMENT_SUPPLIER">
                  GARMENT_SUPPLIER (Penyedia Kaos Polos)
                </option>
                <option value="PRINT_STUDIO">
                  PRINT_STUDIO (Sablon DTF / Manual)
                </option>
                <option value="EMBROIDERY">EMBROIDERY (Bordir Komputer)</option>
                <option value="PACKAGING">
                  PACKAGING (Box &amp; Polymailer)
                </option>
                <option value="TRIMS_LABELS">
                  TRIMS_LABELS (Woven / Tag / Aksesoris)
                </option>
                <option value="LOGISTICS">
                  LOGISTICS (Ekspedisi &amp; Kargo)
                </option>
                <option value="OTHER">OTHER (Lainnya)</option>
              </select>
            </div>
            <div>
              <label htmlFor="paymentTerms">Termin Pembayaran *</label>
              <select
                id="paymentTerms"
                name="paymentTerms"
                className="form-input"
                defaultValue="COD"
              >
                <option value="COD">COD (Cash on Delivery)</option>
                <option value="NET_7">NET 7 (Jatuh tempo 7 hari)</option>
                <option value="NET_14">NET 14 (Jatuh tempo 14 hari)</option>
                <option value="NET_30">NET 30 (Jatuh tempo 30 hari)</option>
                <option value="DP_50_50">DP 50% / Pelunasan 50%</option>
              </select>
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
              <label htmlFor="contactPerson">Nama Kontak PIC</label>
              <input
                id="contactPerson"
                name="contactPerson"
                type="text"
                className="form-input"
                placeholder="cth. Pak Hendra"
              />
            </div>
            <div>
              <label htmlFor="phone">Nomor Telepon / WA</label>
              <input
                id="phone"
                name="phone"
                type="text"
                className="form-input"
                placeholder="0812xxxx"
              />
            </div>
            <div>
              <label htmlFor="leadTimeDays">Estimasi Lead Time (Hari) *</label>
              <input
                id="leadTimeDays"
                name="leadTimeDays"
                type="number"
                min="0"
                defaultValue="3"
                className="form-input"
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <label htmlFor="address">Alamat Workshop / Gudang</label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-input"
              placeholder="Jl. Raya Kopo No. 123, Bandung"
            />
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <label htmlFor="notes">Catatan &amp; Keunggulan Teknis</label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              className="form-input"
              placeholder="cth. Spesialisasi NSA Heavyweight, kapasitas sablon 1.000 pcs/hari"
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
              {pending ? 'Menyimpan…' : '✅ Simpan Data Vendor'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
