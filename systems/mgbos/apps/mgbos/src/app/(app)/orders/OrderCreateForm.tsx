'use client';

import { startTransition, useActionState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { createOrderFromQuoteAction, CreateOrderResult } from './actions';

export function OrderCreateForm({
  quoteVersionId,
  customerName,
  customerPhone,
}: {
  quoteVersionId: string;
  customerName?: string;
  customerPhone?: string;
}) {
  const [state, action, pending] = useActionState(
    async (
      _prev: CreateOrderResult,
      formData: FormData,
    ): Promise<CreateOrderResult> => {
      const recipient_name = String(
        formData.get('recipient_name') ?? '',
      ).trim();
      const phone = String(formData.get('phone') ?? '').trim();
      const street = String(formData.get('street') ?? '').trim();
      const city = String(formData.get('city') ?? '').trim();
      const province = String(formData.get('province') ?? '').trim();
      const postal_code = String(formData.get('postal_code') ?? '').trim();
      const courier_service = String(
        formData.get('courier_service') ?? '',
      ).trim();
      const notes = String(formData.get('notes') ?? '').trim();

      return createOrderFromQuoteAction({
        quoteVersionId,
        shippingAddress: {
          recipient_name,
          phone,
          street,
          city,
          province: province || null,
          postal_code: postal_code || null,
          courier_service: courier_service || null,
          notes: notes || null,
        },
      });
    },
    {},
  );

  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.error) errorRef.current?.focus();
  }, [state]);

  if (state.success && state.orderId) {
    return (
      <div
        className="card"
        style={{
          borderColor: '#22c55e',
          background: 'rgba(34, 197, 94, 0.05)',
        }}
      >
        <h3 style={{ color: '#22c55e' }}>
          🎉 Kontrak Pesanan Berhasil Dibekukan
        </h3>
        <p>
          Nomor Pesanan:{' '}
          <strong>
            <Link href={`/orders/${state.orderId}`}>{state.orderNumber}</Link>
          </strong>
        </p>
        <p>
          Seluruh detail harga, spesifikasi garmen, dan alamat pengiriman telah
          dibekukan secara permanen (immutable) sebagai dasar Surat Perintah
          Kerja (SPK) produksi.
        </p>
        <Link
          href={`/orders/${state.orderId}`}
          className="btn-primary"
          style={{ display: 'inline-block' }}
        >
          Buka Lembar Kontrak Pesanan
        </Link>
      </div>
    );
  }

  return (
    <form
      className="requirement-form"
      action={action}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <input type="hidden" name="quoteVersionId" value={quoteVersionId} />

      {state.error && (
        <p role="alert" tabIndex={-1} ref={errorRef} className="error-banner">
          {state.error}
        </p>
      )}

      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
        Isi alamat pengiriman fisik pesanan ini. Alamat ini akan dibekukan
        secara permanen ke dalam kontrak dan tidak akan terpengaruh jika data
        pelanggan diubah di masa mendatang.
      </p>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
      >
        <div>
          <label htmlFor="recipient_name">Nama Penerima Paket *</label>
          <input
            id="recipient_name"
            name="recipient_name"
            type="text"
            className="form-input"
            defaultValue={customerName ?? ''}
            required
            minLength={2}
          />
        </div>
        <div>
          <label htmlFor="phone">Nomor Telepon Penerima *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="form-input"
            defaultValue={customerPhone ?? ''}
            required
            minLength={5}
          />
        </div>
      </div>

      <div>
        <label htmlFor="street">Alamat Jalan &amp; Nomor Bangunan *</label>
        <textarea
          id="street"
          name="street"
          className="form-input"
          rows={2}
          placeholder="cth. Gedung Gandaria 8 Lt. 15, Jl. Sultan Iskandar Muda No. 8"
          required
          minLength={5}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1rem',
        }}
      >
        <div>
          <label htmlFor="city">Kota / Kabupaten *</label>
          <input
            id="city"
            name="city"
            type="text"
            className="form-input"
            placeholder="cth. Jakarta Selatan"
            required
            minLength={2}
          />
        </div>
        <div>
          <label htmlFor="province">Provinsi</label>
          <input
            id="province"
            name="province"
            type="text"
            className="form-input"
            placeholder="cth. DKI Jakarta"
          />
        </div>
        <div>
          <label htmlFor="postal_code">Kode Pos</label>
          <input
            id="postal_code"
            name="postal_code"
            type="text"
            className="form-input"
            placeholder="cth. 12240"
          />
        </div>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
      >
        <div>
          <label htmlFor="courier_service">Layanan Ekspedisi / Kurir</label>
          <input
            id="courier_service"
            name="courier_service"
            type="text"
            className="form-input"
            placeholder="cth. J&T Cargo, Lalamove, Ambil di Studio"
          />
        </div>
        <div>
          <label htmlFor="notes">Instruksi Pengiriman (Opsional)</label>
          <input
            id="notes"
            name="notes"
            type="text"
            className="form-input"
            placeholder="cth. Hubungi security loading dock sebelum kirim"
          />
        </div>
      </div>

      <button
        className="btn-primary"
        disabled={pending}
        style={{ marginTop: '0.5rem' }}
      >
        {pending
          ? 'Membekukan Kontrak…'
          : '🔒 Konversi & Bekukan Menjadi Order Contract'}
      </button>
    </form>
  );
}
