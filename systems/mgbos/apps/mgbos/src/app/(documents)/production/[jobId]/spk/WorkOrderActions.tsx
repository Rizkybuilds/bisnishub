'use client';

import { useState } from 'react';

export function WorkOrderActions({
  message,
  spkNumber,
}: {
  message: string;
  spkNumber: string;
}) {
  const [feedback, setFeedback] = useState('');

  return (
    <aside className="spk-actions no-print">
      <button
        type="button"
        className="btn-action print-btn"
        onClick={() => window.print()}
      >
        🖨️ Cetak / Simpan PDF
      </button>
      <button
        type="button"
        className="btn-action copy-btn"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(message);
            setFeedback(
              `Format WhatsApp untuk SPK ${spkNumber} berhasil disalin ke clipboard!`,
            );
          } catch {
            setFeedback(
              'Akses clipboard diblokir browser. Silakan salin manual dari kotak teks di bawah.',
            );
          }
        }}
      >
        📱 Salin Format WhatsApp Vendor
      </button>

      {feedback && (
        <p role="status" className="action-feedback">
          {feedback}
        </p>
      )}

      <details className="manual-copy-box">
        <summary>Lihat format pesan WhatsApp (untuk salin manual)</summary>
        <textarea
          aria-label="Format WhatsApp SPK"
          readOnly
          value={message}
          rows={10}
        />
      </details>
    </aside>
  );
}
