'use client';

import { startTransition, useActionState, useRef, useEffect } from 'react';
import { quoteCommand } from './actions';

export function QuoteCommand({
  operation,
  versionId,
}: {
  operation: 'approve' | 'send' | 'accept';
  versionId: string;
}) {
  const [state, action, pending] = useActionState(quoteCommand, {});
  const error = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.error) error.current?.focus();
  }, [state]);

  return (
    <form
      className="requirement-form"
      action={action}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <input type="hidden" name="operation" value={operation} />
      <input type="hidden" name="versionId" value={versionId} />

      {state.error && (
        <p role="alert" tabIndex={-1} ref={error} className="error-banner">
          {state.error}
        </p>
      )}
      {state.success && <p role="status">Perubahan tercatat.</p>}

      {operation === 'approve' ? (
        <>
          <label htmlFor={'reason-' + versionId}>
            Alasan owner menyetujui margin di bawah 20%
          </label>
          <textarea
            id={'reason-' + versionId}
            name="reason"
            className="form-input"
            required
            minLength={5}
            maxLength={2000}
          />
        </>
      ) : operation === 'accept' ? (
        <>
          <p>
            Konfirmasi bahwa pelanggan secara resmi menyetujui penawaran harga
            ini. Setelah diterima, penawaran ini dapat dikonversi menjadi
            Kontrak Pesanan Resmi (Order).
          </p>
          <label htmlFor={'method-' + versionId}>Metode Persetujuan</label>
          <select
            id={'method-' + versionId}
            name="acceptanceMethod"
            className="form-input"
            defaultValue="WHATSAPP"
            required
          >
            <option value="WHATSAPP">WhatsApp Chat / Voice Note</option>
            <option value="EMAIL">Email Resmi Perusahaan</option>
            <option value="SIGNATURE">
              Surat Penawaran Bertandatangan / PO
            </option>
            <option value="DIRECT">Konfirmasi Langsung di Studio</option>
          </select>

          <label htmlFor={'notes-' + versionId}>
            Catatan Penerimaan (Opsional)
          </label>
          <input
            id={'notes-' + versionId}
            name="acceptanceNotes"
            type="text"
            className="form-input"
            placeholder="cth. Disetujui via WA chat oleh Bu Sari (Purchasing)"
            maxLength={2000}
          />
        </>
      ) : (
        <p>
          Status ini mencatat bahwa penawaran dikirim secara manual. Sistem akan
          mengunci versi kebutuhan yang dirujuk; tidak mengirim pesan ke
          pelanggan.
        </p>
      )}

      <button className="btn-primary" disabled={pending}>
        {pending
          ? 'Memproses…'
          : operation === 'approve'
            ? 'Setujui pengecualian harga'
            : operation === 'accept'
              ? 'Tandai Penawaran Diterima (Accept)'
              : 'Tandai dikirim'}
      </button>
    </form>
  );
}
