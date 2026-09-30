'use client';

import { useState, useTransition } from 'react';
import {
  acceptProductionAssignmentAction,
  declineProductionAssignmentAction,
  cancelProductionAssignmentAction,
  ProductionActionResult,
} from './actions';

export function AssignmentStatusActions({
  assignmentId,
  status,
  jobStatus,
  canUpdate,
}: {
  assignmentId: string;
  status: string;
  jobStatus: string;
  canUpdate: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'NONE' | 'DECLINE' | 'CANCEL'>(
    'NONE',
  );
  const [reasonInput, setReasonInput] = useState('');

  if (!canUpdate) return null;

  const handleAccept = () => {
    setActionError(null);
    setActionSuccess(null);
    startTransition(async () => {
      const res: ProductionActionResult =
        await acceptProductionAssignmentAction({
          assignmentId,
        });
      if (res.error) {
        setActionError(res.error);
      } else {
        setActionSuccess('Penugasan berhasil diterima.');
      }
    });
  };

  const handleDecline = (e: React.FormEvent) => {
    e.preventDefault();
    if (reasonInput.trim().length < 3) {
      setActionError('Alasan penolakan minimal 3 karakter.');
      return;
    }
    setActionError(null);
    setActionSuccess(null);
    startTransition(async () => {
      const res: ProductionActionResult =
        await declineProductionAssignmentAction({
          assignmentId,
          reason: reasonInput.trim(),
        });
      if (res.error) {
        setActionError(res.error);
      } else {
        setActionSuccess(
          'Penugasan berhasil ditolak. Job kembali ke status READY.',
        );
        setActiveModal('NONE');
        setReasonInput('');
      }
    });
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (reasonInput.trim().length < 3) {
      setActionError('Alasan pembatalan minimal 3 karakter.');
      return;
    }
    setActionError(null);
    setActionSuccess(null);
    startTransition(async () => {
      const res: ProductionActionResult =
        await cancelProductionAssignmentAction({
          assignmentId,
          reason: reasonInput.trim(),
        });
      if (res.error) {
        setActionError(res.error);
      } else {
        setActionSuccess(
          'Penugasan berhasil dibatalkan. Job kembali ke status READY.',
        );
        setActiveModal('NONE');
        setReasonInput('');
      }
    });
  };

  return (
    <div style={{ marginTop: '0.75rem' }}>
      {actionError && (
        <p
          role="alert"
          style={{
            background: '#450a0a',
            color: '#f87171',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '0.85rem',
            marginBottom: '0.5rem',
          }}
        >
          {actionError}
        </p>
      )}

      {actionSuccess && (
        <p
          role="status"
          style={{
            background: '#052e16',
            color: '#4ade80',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '0.85rem',
            marginBottom: '0.5rem',
          }}
        >
          {actionSuccess}
        </p>
      )}

      {status === 'ASSIGNED' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleAccept}
              disabled={isPending}
              style={{
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? 'Memproses...' : '🤝 Terima Penugasan (ACCEPTED)'}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveModal('DECLINE');
                setActionError(null);
              }}
              disabled={isPending}
              style={{
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: isPending ? 'not-allowed' : 'pointer',
              }}
            >
              ❌ Tolak Penugasan
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveModal('CANCEL');
                setActionError(null);
              }}
              disabled={isPending}
              style={{
                background: '#334155',
                color: '#cbd5e1',
                border: '1px solid #475569',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                cursor: isPending ? 'not-allowed' : 'pointer',
              }}
            >
              Batalkan
            </button>
          </div>

          {activeModal === 'DECLINE' && (
            <form
              onSubmit={handleDecline}
              style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                background: '#1e293b',
                borderRadius: '6px',
                border: '1px solid #ea580c',
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#fdba74',
                  marginBottom: '4px',
                }}
              >
                Alasan Penolakan Vendor / Pelaksana:
              </label>
              <input
                type="text"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Contoh: Kapasitas penuh / bahan baku tidak tersedia"
                required
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: '#0f172a',
                  border: '1px solid #475569',
                  borderRadius: '4px',
                  color: '#f8fafc',
                  fontSize: '0.85rem',
                  marginBottom: '8px',
                }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    background: '#ea580c',
                    color: '#ffffff',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Konfirmasi Tolak
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('NONE')}
                  style={{
                    background: 'transparent',
                    color: '#94a3b8',
                    border: '1px solid #475569',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          {activeModal === 'CANCEL' && (
            <form
              onSubmit={handleCancel}
              style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                background: '#1e293b',
                borderRadius: '6px',
                border: '1px solid #64748b',
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#cbd5e1',
                  marginBottom: '4px',
                }}
              >
                Alasan Pembatalan Penugasan:
              </label>
              <input
                type="text"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Contoh: Salah pilih vendor / revisi pesanan"
                required
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: '#0f172a',
                  border: '1px solid #475569',
                  borderRadius: '4px',
                  color: '#f8fafc',
                  fontSize: '0.85rem',
                  marginBottom: '8px',
                }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Konfirmasi Batal
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('NONE')}
                  style={{
                    background: 'transparent',
                    color: '#94a3b8',
                    border: '1px solid #475569',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Kembali
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {status === 'ACCEPTED' && jobStatus === 'ACCEPTED' && (
        <div>
          {activeModal === 'NONE' ? (
            <button
              type="button"
              onClick={() => setActiveModal('CANCEL')}
              disabled={isPending}
              style={{
                background: 'transparent',
                color: '#94a3b8',
                border: '1px dashed #475569',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              ⚠️ Batalkan Penugasan Diterima
            </button>
          ) : (
            <form
              onSubmit={handleCancel}
              style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                background: '#1e293b',
                borderRadius: '6px',
                border: '1px solid #dc2626',
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#fca5a5',
                  marginBottom: '4px',
                }}
              >
                Alasan Pembatalan Sebelum Produksi Fisik:
              </label>
              <input
                type="text"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Alasan vendor/internal tidak dapat melanjutkan"
                required
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  background: '#0f172a',
                  border: '1px solid #475569',
                  borderRadius: '4px',
                  color: '#f8fafc',
                  fontSize: '0.85rem',
                  marginBottom: '8px',
                }}
              />
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Konfirmasi Pembatalan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal('NONE')}
                  style={{
                    background: 'transparent',
                    color: '#94a3b8',
                    border: '1px solid #475569',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
