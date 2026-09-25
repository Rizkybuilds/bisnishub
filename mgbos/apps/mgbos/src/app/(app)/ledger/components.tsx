'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { recordActualJobCostAction } from './actions';
import { rupiah, percent } from './formatters';

export function MarginHealthBadge({
  health,
  marginPct,
}: {
  health: 'HEALTHY' | 'MODERATE' | 'LOW_MARGIN' | 'CRITICAL';
  marginPct: number;
}) {
  const getBadgeStyle = () => {
    switch (health) {
      case 'HEALTHY':
        return {
          bg: '#052e16',
          color: '#4ade80',
          border: '#166534',
          label: 'HEALTHY (≥35%)',
        };
      case 'MODERATE':
        return {
          bg: '#082f49',
          color: '#38bdf8',
          border: '#0369a1',
          label: 'MODERATE (25-34%)',
        };
      case 'LOW_MARGIN':
        return {
          bg: '#451a03',
          color: '#fb923c',
          border: '#9a3412',
          label: 'LOW MARGIN (20-24%)',
        };
      case 'CRITICAL':
      default:
        return {
          bg: '#450a0a',
          color: '#f87171',
          border: '#991b1b',
          label: 'CRITICAL (<20%)',
        };
    }
  };

  const badge = getBadgeStyle();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: badge.bg,
        color: badge.color,
        border: `1px solid ${badge.border}`,
        padding: '3px 8px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 700,
      }}
    >
      <span>{percent(marginPct)}</span>
      <span style={{ fontSize: '0.65rem', opacity: 0.85 }}>
        ({badge.label})
      </span>
    </span>
  );
}

export function RecordActualCostModal({
  jobId,
  jobNumber,
  estimatedCost,
  committedCost,
  currentActualCost,
  buttonLabel = 'Catat Biaya Aktual',
}: {
  jobId: string;
  jobNumber: string;
  estimatedCost: string | number;
  committedCost?: string | number | null;
  currentActualCost?: string | number | null;
  buttonLabel?: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseCost = committedCost ?? estimatedCost;
  const [actualCost, setActualCost] = useState(
    currentActualCost?.toString() ?? baseCost?.toString() ?? '',
  );
  const [notes, setNotes] = useState('');

  const numericActual = actualCost.replace(/[^\d]/g, '');
  const parsedActual = numericActual ? BigInt(numericActual) : 0n;
  const parsedBase = baseCost ? BigInt(baseCost) : 0n;
  const variance = parsedActual - parsedBase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (parsedActual < 0n) {
      setError('Biaya aktual tidak boleh negatif');
      setIsSubmitting(false);
      return;
    }

    const res = await recordActualJobCostAction({
      jobId,
      actualCost: numericActual,
      notes: notes.trim() || null,
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
        className="btn-secondary"
        style={{
          padding: '4px 10px',
          fontSize: '0.8rem',
          color: currentActualCost ? '#38bdf8' : '#fb923c',
          borderColor: currentActualCost ? '#0284c7' : '#ea580c',
          background: currentActualCost
            ? 'transparent'
            : 'rgba(234, 88, 12, 0.1)',
        }}
      >
        {currentActualCost ? 'Ubah Biaya Aktual' : buttonLabel}
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
              maxWidth: '520px',
              width: '100%',
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
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                  Realisasi Biaya Modal Aktual
                </h2>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    fontFamily: 'monospace',
                  }}
                >
                  {jobNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                background: '#1e293b',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}
              >
                <span style={{ color: '#94a3b8' }}>
                  Biaya Estimasi (Quote):
                </span>
                <span style={{ fontWeight: 600 }}>{rupiah(estimatedCost)}</span>
              </div>
              {committedCost && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ color: '#94a3b8' }}>
                    Biaya Komitmen (SPK):
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {rupiah(committedCost)}
                  </span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #334155',
                  paddingTop: '6px',
                  marginTop: '6px',
                }}
              >
                <span style={{ color: '#cbd5e1' }}>
                  Variansi Biaya Realisasi:
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    color:
                      variance > 0n
                        ? '#f87171'
                        : variance < 0n
                          ? '#4ade80'
                          : '#cbd5e1',
                  }}
                >
                  {variance > 0n
                    ? `+${rupiah(variance)} (Bengkak)`
                    : variance < 0n
                      ? `-${rupiah(-variance)} (Hemat)`
                      : 'Sesuai Budget (Rp 0)'}
                </span>
              </div>
            </div>

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

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    marginBottom: '4px',
                  }}
                >
                  Biaya Aktual Riil (Rp) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 3800000"
                  value={actualCost}
                  onChange={(e) => setActualCost(e.target.value)}
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

              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    marginBottom: '4px',
                  }}
                >
                  Catatan / Bukti Faktur Vendor
                </label>
                <textarea
                  rows={2}
                  placeholder="No. invoice vendor atau keterangan selisih biaya..."
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
                    background: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 700,
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting
                    ? 'Menyimpan...'
                    : 'Simpan & Bukukan ke Buku Kas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
