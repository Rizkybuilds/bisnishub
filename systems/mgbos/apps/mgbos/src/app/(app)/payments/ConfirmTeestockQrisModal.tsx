'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { confirmTeestockQrisAction } from './actions';

export function ConfirmTeestockQrisModal({
  invoiceId,
  invoiceNumber,
  amountIdr,
}: {
  invoiceId: string;
  invoiceNumber: string;
  amountIdr: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [merchant, setMerchant] = useState('');
  const [reference, setReference] = useState('');
  const [verified, setVerified] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const confirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!verified || sending) return;
    setSending(true);
    setError(null);
    try {
      const result = await confirmTeestockQrisAction({
        invoiceId,
        amount: amountIdr,
        merchantName: merchant.trim(),
        referenceNumber: reference.trim(),
        verifiedBankStatement: verified,
      });
      if (result.success) {
        setConfirmation(result.paymentNumber ?? 'Pembayaran tercatat');
        setOpen(false);
        router.refresh();
      } else {
        setError(result.error ?? 'Verifikasi pembayaran gagal.');
      }
    } catch {
      setError('Koneksi terputus. Periksa riwayat pembayaran sebelum mengulang.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn-primary"
        onClick={() => setOpen(true)}
        style={{ background: '#166534', borderColor: '#166534' }}
      >
        Verifikasi QRIS TeeStock
      </button>
      {confirmation && (
        <p role="status" style={{ color: '#86efac', fontSize: '0.85rem' }}>
          Pembayaran tercatat: {confirmation}
        </p>
      )}
      {open && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !sending) setOpen(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            background: 'rgba(0,0,0,.8)',
            display: 'grid',
            placeItems: 'center',
            padding: 16,
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="teestock-qris-title"
            style={{
              width: '100%',
              maxWidth: 520,
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: 11, letterSpacing: '.16em' }}>
                  TEESTOCK / OWNER PAYMENT CHECK
                </p>
                <h2 id="teestock-qris-title" style={{ margin: '9px 0 4px' }}>
                  Konfirmasi QRIS Manual
                </h2>
              </div>
              <button type="button" aria-label="Tutup"
                disabled={sending} onClick={() => setOpen(false)}
                style={{ background: 'transparent', color: '#fff', border: 0, cursor: 'pointer', fontSize: 21 }}>
                ×
              </button>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: '#cbd5e1' }}>
              Hanya klik konfirmasi setelah membuka aplikasi merchant/PJP dan memastikan
              transaksi benar-benar masuk. Screenshot pelanggan saja bukan bukti pelunasan.
            </p>
            <div style={{ padding: 16, background: '#1e293b', border: '1px solid #334155', margin: '18px 0' }}>
              <span style={{ display: 'block', fontSize: 12, color: '#94a3b8' }}>
                Faktur {invoiceNumber}
              </span>
              <strong style={{ display: 'block', fontSize: 25, marginTop: 5 }}>
                Rp {BigInt(amountIdr).toLocaleString('id-ID')}
              </strong>
              <span style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginTop: 5 }}>
                Nominal harus persis sama dengan mutasi masuk. Tanpa biaya kode unik tambahan.
              </span>
            </div>
            <form onSubmit={(event) => void confirm(event)}>
              <label style={{ display: 'grid', gap: 7, fontSize: 13, marginBottom: 16 }}>
                Nama merchant/PJP pada mutasi
                <input
                  required minLength={2} maxLength={100}
                  value={merchant}
                  onChange={(event) => setMerchant(event.target.value)}
                  placeholder="Nama merchant sesuai laporan"
                  autoComplete="off"
                  style={{ background: '#fff', border: '1px solid #64748b', color: '#111', padding: 12 }}
                />
              </label>
              <label style={{ display: 'grid', gap: 7, fontSize: 13, marginBottom: 19 }}>
                Referensi transaksi dari mutasi merchant
                <input
                  required minLength={6} maxLength={100}
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  placeholder="RRN / ID transaksi PJP"
                  autoComplete="off"
                  style={{ background: '#fff', border: '1px solid #64748b', color: '#111', padding: 12 }}
                />
              </label>
              <label style={{ display: 'flex', gap: 11, alignItems: 'start', fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>
                <input type="checkbox" required checked={verified}
                  onChange={(event) => setVerified(event.target.checked)}
                  style={{ marginTop: 4, width: 17, height: 17, flexShrink: 0 }} />
                <span>
                  Saya sudah memeriksa mutasi di akun merchant resmi, memastikan
                  nominal dan referensi transaksi cocok, dan dana benar-benar diterima.
                  Saya setuju mencatat invoice ini lunas.
                </span>
              </label>
              {error && (
                <p role="alert" style={{ color: '#fca5a5', fontSize: 13 }}>
                  {error}
                </p>
              )}
              <button className="btn-primary" type="submit" disabled={!verified || sending}
                style={{ width: '100%', padding: 13, background: '#166534', borderColor: '#166534', opacity: !verified || sending ? .45 : 1 }}>
                {sending ? 'Mencocokkan dan mencatat…' : 'Saya verifikasi dana masuk — Catat Lunas'}
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
