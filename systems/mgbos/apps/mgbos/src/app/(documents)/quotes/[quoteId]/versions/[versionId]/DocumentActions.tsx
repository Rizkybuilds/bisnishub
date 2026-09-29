'use client';
import { useState } from 'react';
export function DocumentActions({
  message,
  pdfUrl,
}: {
  message: string;
  pdfUrl: string;
}) {
  const [feedback, setFeedback] = useState('');
  return (
    <aside className="quotation-actions">
      <a href={pdfUrl}>Unduh PDF</a>
      <button onClick={() => window.print()}>
        Cetak / simpan PDF dari browser
      </button>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(message);
            setFeedback(
              'Ringkasan disalin. Tempel dan periksa sebelum mengirim ke pelanggan.',
            );
          } catch {
            setFeedback(
              'Penyalinan diblokir browser. Salin teks dari kotak ringkasan di bawah.',
            );
          }
        }}
      >
        Salin ringkasan pesan
      </button>
      <p role="status">{feedback}</p>
      <details>
        <summary>Lihat ringkasan untuk disalin manual</summary>
        <textarea
          aria-label="Ringkasan penawaran"
          readOnly
          value={message}
          rows={12}
        />
      </details>
    </aside>
  );
}
