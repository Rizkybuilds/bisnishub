'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  OrderStatus,
  getAllowedOrderTransitions,
  isOrderTerminalState,
  formatOrderStatusLabel,
  evaluateOrderCompletionEligibility,
} from '@mgbos/domain';
import { transitionOrderStatusAction } from './actions';

interface OrderStatusActionsProps {
  orderId: string;
  orderNumber: string;
  currentStatus: OrderStatus;
  canUpdateOrder: boolean;
  openJobsCount: number;
  openShipmentsCount: number;
  unpaidInvoicesCount: number;
}

export function OrderStatusActions({
  orderId,
  orderNumber,
  currentStatus,
  canUpdateOrder,
  openJobsCount,
  openShipmentsCount,
  unpaidInvoicesCount,
}: OrderStatusActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);
  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allowedTransitions = getAllowedOrderTransitions(currentStatus);
  const isTerminal = isOrderTerminalState(currentStatus);

  const completionEligibility = evaluateOrderCompletionEligibility({
    openProductionJobsCount: openJobsCount,
    openShipmentsCount: openShipmentsCount,
    unpaidInvoicesCount: unpaidInvoicesCount,
  });

  const handleOpenModal = (target: OrderStatus) => {
    setTargetStatus(target);
    setReason('');
    setErrorMessage(null);
  };

  const handleCloseModal = () => {
    setTargetStatus(null);
    setReason('');
    setErrorMessage(null);
  };

  const handleExecuteTransition = () => {
    if (!targetStatus) return;

    setErrorMessage(null);
    startTransition(async () => {
      const res = await transitionOrderStatusAction({
        orderId,
        targetStatus,
        reason: reason.trim() ? reason.trim() : null,
      });

      if (!res.success) {
        setErrorMessage(res.error ?? 'Gagal memperbarui status pesanan.');
        return;
      }

      handleCloseModal();
      router.refresh();
    });
  };

  if (!canUpdateOrder) {
    return null;
  }

  if (isTerminal) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8rem',
          color: '#64748b',
          background: '#0f172a',
          padding: '4px 10px',
          borderRadius: '6px',
          border: '1px solid #1e293b',
        }}
      >
        🔒 Status Akhir (Terminal)
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {allowedTransitions.map((target) => {
          let btnStyle: React.CSSProperties = {
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontWeight: 600,
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease-in-out',
            border: 'none',
          };
          let label = formatOrderStatusLabel(target);

          if (target === 'ACTIVE') {
            btnStyle = {
              ...btnStyle,
              background: '#0284c7',
              color: '#ffffff',
            };
            label = currentStatus === 'ON_HOLD' ? '▶️ Lanjutkan Pesanan' : '🚀 Aktifkan Pesanan';
          } else if (target === 'COMPLETED') {
            btnStyle = {
              ...btnStyle,
              background: completionEligibility.eligible ? '#16a34a' : '#065f46',
              color: '#ffffff',
            };
            label = '✅ Selesaikan Pesanan';
          } else if (target === 'ON_HOLD') {
            btnStyle = {
              ...btnStyle,
              background: '#334155',
              color: '#f8fafc',
              border: '1px solid #475569',
            };
            label = '⏸️ Tahan Pesanan';
          } else if (target === 'CANCELLED') {
            btnStyle = {
              ...btnStyle,
              background: '#450a0a',
              color: '#fca5a5',
              border: '1px solid #7f1d1d',
            };
            label = '❌ Batalkan Pesanan';
          } else if (target === 'CONFIRMED') {
            btnStyle = {
              ...btnStyle,
              background: '#059669',
              color: '#ffffff',
            };
            label = '✓ Konfirmasi Pesanan';
          }

          return (
            <button
              key={target}
              type="button"
              onClick={() => handleOpenModal(target)}
              style={btnStyle}
            >
              {label}
            </button>
          );
        })}
      </div>

      {targetStatus && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              border: '1px solid #334155',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>
                  Perbarui Status Pesanan
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  {orderNumber} · {currentStatus} &rarr;{' '}
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                    {targetStatus}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isPending}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                }}
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem' }}>
              {errorMessage && (
                <div
                  style={{
                    backgroundColor: '#450a0a',
                    border: '1px solid #991b1b',
                    color: '#fca5a5',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  ⚠️ {errorMessage}
                </div>
              )}

              {/* Special Checklist for COMPLETED */}
              {targetStatus === 'COMPLETED' && (
                <div
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1.25rem',
                    border: '1px solid #334155',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#f8fafc',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Syarat Kelayakan Penyelesaian (Completion Guards):
                  </div>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.2rem',
                      fontSize: '0.82rem',
                      color: '#cbd5e1',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <li>
                      {openJobsCount === 0 ? (
                        <span style={{ color: '#4ade80' }}>
                          ✓ Seluruh pekerjaan produksi (SPK) telah selesai
                        </span>
                      ) : (
                        <span style={{ color: '#f87171' }}>
                          ✗ Masih ada {openJobsCount} SPK produksi yang belum
                          selesai
                        </span>
                      )}
                    </li>
                    <li>
                      {openShipmentsCount === 0 ? (
                        <span style={{ color: '#4ade80' }}>
                          ✓ Seluruh pengiriman / surat jalan telah terkirim
                        </span>
                      ) : (
                        <span style={{ color: '#f87171' }}>
                          ✗ Masih ada {openShipmentsCount} pengiriman yang belum
                          terkirim
                        </span>
                      )}
                    </li>
                    <li>
                      {unpaidInvoicesCount === 0 ? (
                        <span style={{ color: '#4ade80' }}>
                          ✓ Seluruh tagihan / faktur komersial telah lunas
                        </span>
                      ) : (
                        <span style={{ color: '#f87171' }}>
                          ✗ Masih ada {unpaidInvoicesCount} faktur komersial yang
                          belum lunas
                        </span>
                      )}
                    </li>
                  </ul>
                  {!completionEligibility.eligible && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        fontSize: '0.78rem',
                        color: '#f87171',
                        backgroundColor: '#450a0a',
                        padding: '6px 10px',
                        borderRadius: '4px',
                      }}
                    >
                      Peringatan: Pesanan belum memenuhi kewajiban operasional di
                      atas. Sistem akan menolak penyelesaian sampai semua
                      kewajiban terselesaikan.
                    </div>
                  )}
                </div>
              )}

              {/* Reason input */}
              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="transition-reason"
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#f8fafc',
                    marginBottom: '6px',
                  }}
                >
                  {targetStatus === 'CANCELLED'
                    ? 'Alasan Pembatalan (Wajib Dicatat):'
                    : targetStatus === 'ON_HOLD'
                      ? 'Alasan Penahanan (On Hold):'
                      : 'Catatan / Referensi Transisi (Opsional):'}
                </label>
                <textarea
                  id="transition-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    targetStatus === 'CANCELLED'
                      ? 'Contoh: Permintaan pelanggan karena perubahan timeline'
                      : targetStatus === 'ON_HOLD'
                        ? 'Contoh: Menunggu keputusan warna bordir dari pelanggan'
                        : 'Tambahkan catatan jika diperlukan'
                  }
                  rows={3}
                  style={{
                    width: '100%',
                    backgroundColor: '#020617',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Warning for cancellation */}
              {targetStatus === 'CANCELLED' && (
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#fca5a5',
                    backgroundColor: '#450a0a',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                  }}
                >
                  ⚠️ Perhatian: Pembatalan pesanan bersifat permanen (terminal).
                  Pesanan yang dibatalkan tidak dapat diaktifkan kembali.
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid #1e293b',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
                backgroundColor: '#0b1120',
              }}
            >
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isPending}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#334155',
                  color: '#f8fafc',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: isPending ? 'not-allowed' : 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteTransition}
                disabled={isPending}
                style={{
                  padding: '8px 16px',
                  backgroundColor:
                    targetStatus === 'CANCELLED'
                      ? '#dc2626'
                      : targetStatus === 'COMPLETED'
                        ? '#16a34a'
                        : '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? 'Menyimpan...' : 'Konfirmasi Transisi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
