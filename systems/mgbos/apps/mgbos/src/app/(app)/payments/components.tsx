'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  PaymentMethod,
} from '@mgbos/domain';
import { recordPaymentAction, revertPaymentAction } from './actions';

export function RecordPaymentModal({
  brandId,
  customerAccountId,
  prefilledInvoice,
  defaultDestinationBank,
  defaultDestinationAccount,
  buttonLabel = '+ Catat Pembayaran Masuk',
}: {
  brandId: string;
  customerAccountId?: string;
  prefilledInvoice?: {
    id: string;
    invoiceNumber: string;
    balanceDue: string;
  };
  defaultDestinationBank?: string;
  defaultDestinationAccount?: string;
  buttonLabel?: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [method, setMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [amount, setAmount] = useState(prefilledInvoice?.balanceDue ?? '');
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [referenceNumber, setReferenceNumber] = useState('');
  const [destinationBank, setDestinationBank] = useState(
    defaultDestinationBank || 'Bank Central Asia (BCA)',
  );
  const [destinationAccountNumber, setDestinationAccountNumber] = useState(
    defaultDestinationAccount || '7770123899',
  );
  const [payerName, setPayerName] = useState('');
  const [payerBank, setPayerBank] = useState('');
  const [payerAccountNumber, setPayerAccountNumber] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const numericAmount = amount.replace(/[^\d]/g, '');
    if (!numericAmount || BigInt(numericAmount) <= 0n) {
      setError('Nominal pembayaran harus lebih besar dari 0');
      setIsSubmitting(false);
      return;
    }

    const allocations = prefilledInvoice
      ? [
          {
            invoiceId: prefilledInvoice.id,
            amount: numericAmount,
            notes: `Alokasi pembayaran untuk ${prefilledInvoice.invoiceNumber}`,
          },
        ]
      : [];

    const res = await recordPaymentAction({
      brandId,
      customerAccountId: customerAccountId || null,
      paymentMethod: method,
      amount: numericAmount,
      paymentDate: paymentDate || null,
      referenceNumber: referenceNumber.trim() || null,
      destinationBank: destinationBank.trim() || null,
      destinationAccountNumber: destinationAccountNumber.trim() || null,
      payerName: payerName.trim() || null,
      payerBank: payerBank.trim() || null,
      payerAccountNumber: payerAccountNumber.trim() || null,
      notes: notes.trim() || null,
      allocations,
    });

    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn-primary"
        style={{
          background: '#0284c7',
          color: '#ffffff',
          fontWeight: 600,
          padding: '8px 14px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {buttonLabel}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '12px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              color: '#f8fafc',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Catat Penerimaan Kas / Pembayaran
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {prefilledInvoice && (
              <div
                style={{
                  background: '#1e293b',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  borderLeft: '4px solid #38bdf8',
                }}
              >
                <div>
                  Faktur Dituju:{' '}
                  <strong>{prefilledInvoice.invoiceNumber}</strong>
                </div>
                <div>
                  Sisa Piutang:{' '}
                  <span style={{ color: '#fb923c', fontWeight: 700 }}>
                    Rp{' '}
                    {BigInt(prefilledInvoice.balanceDue).toLocaleString(
                      'id-ID',
                    )}
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div
                style={{
                  background: '#450a0a',
                  border: '1px solid #dc2626',
                  color: '#fca5a5',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      marginBottom: '4px',
                    }}
                  >
                    Metode Pembayaran *
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    style={{
                      width: '100%',
                      background: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      padding: '8px',
                      color: '#f8fafc',
                    }}
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {PAYMENT_METHOD_LABELS[m]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      marginBottom: '4px',
                    }}
                  >
                    Tanggal Bayar *
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      padding: '8px',
                      color: '#f8fafc',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    marginBottom: '4px',
                  }}
                >
                  Nominal Masuk (Rp) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 5000000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                    padding: '10px',
                    color: '#4ade80',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                  }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      marginBottom: '4px',
                    }}
                  >
                    No. Referensi / Mutasi Bank
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: BCA-TRX-12345"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      padding: '8px',
                      color: '#f8fafc',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      marginBottom: '4px',
                    }}
                  >
                    Bank &amp; No. Rekening Tujuan
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1fr',
                      gap: '6px',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Bank Tujuan"
                      value={destinationBank}
                      onChange={(e) => setDestinationBank(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        padding: '8px',
                        color: '#f8fafc',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="No. Rekening"
                      value={destinationAccountNumber}
                      onChange={(e) =>
                        setDestinationAccountNumber(e.target.value)
                      }
                      style={{
                        width: '100%',
                        background: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        padding: '8px',
                        color: '#f8fafc',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      marginBottom: '4px',
                    }}
                  >
                    Nama Pengirim (Payer)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama di rekening pengirim"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      padding: '8px',
                      color: '#f8fafc',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      marginBottom: '4px',
                    }}
                  >
                    Bank &amp; No. Rekening Pengirim
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '6px',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Bank"
                      value={payerBank}
                      onChange={(e) => setPayerBank(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        padding: '8px',
                        color: '#f8fafc',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="No. Rekening"
                      value={payerAccountNumber}
                      onChange={(e) => setPayerAccountNumber(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        padding: '8px',
                        color: '#f8fafc',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    marginBottom: '4px',
                  }}
                >
                  Catatan Internal Transaksi
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan verifikasi transfer..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                    padding: '8px',
                    color: '#f8fafc',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: '#334155',
                    color: '#cbd5e1',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: isSubmitting ? '#0369a1' : '#0284c7',
                    color: '#ffffff',
                    fontWeight: 700,
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '6px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Konfirmasi Pembayaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function RevertPaymentButton({
  paymentId,
  paymentNumber,
}: {
  paymentId: string;
  paymentNumber: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRevert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 5) {
      setError('Alasan pembatalan minimal 5 karakter.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await revertPaymentAction({
      paymentId,
      reason: reason.trim(),
    });

    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          background: '#991b1b',
          color: '#ffffff',
          fontWeight: 600,
          padding: '8px 14px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Batalkan Pembayaran (Revert)
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #7f1d1d',
              borderRadius: '12px',
              maxWidth: '480px',
              width: '100%',
              padding: '1.5rem',
              color: '#f8fafc',
            }}
          >
            <h2 style={{ fontSize: '1.15rem', color: '#f87171', margin: 0 }}>
              Konfirmasi Pembatalan Pembayaran
            </h2>
            <p
              style={{
                fontSize: '0.85rem',
                color: '#cbd5e1',
                marginTop: '8px',
              }}
            >
              Anda akan membatalkan mutasi pembayaran{' '}
              <strong>{paymentNumber}</strong>. Semua dana yang telah
              dialokasikan ke faktur terkait akan ditarik kembali dan sisa
              piutang akan bertambah.
            </p>

            {error && (
              <div
                style={{
                  background: '#450a0a',
                  color: '#fca5a5',
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  marginBottom: '10px',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleRevert}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    marginBottom: '4px',
                  }}
                >
                  Alasan Pembatalan *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: Transfer dibatalkan oleh bank / salah input nominal"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                    padding: '8px',
                    color: '#f8fafc',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: '#334155',
                    color: '#cbd5e1',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    fontWeight: 700,
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? 'Membatalkan...' : 'Ya, Batalkan Pembayaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
