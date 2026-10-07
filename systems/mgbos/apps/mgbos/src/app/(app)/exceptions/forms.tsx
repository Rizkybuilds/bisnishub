'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  OPERATIONAL_EXCEPTION_TYPES,
  OPERATIONAL_EXCEPTION_SEVERITIES,
  OPERATIONAL_EXCEPTION_RESOURCE_TYPES,
  RESPONSIBLE_ROLE_CODES,
  type OperationalExceptionType,
  type OperationalExceptionSeverity,
  type OperationalExceptionResourceType,
  type OperationalExceptionResolutionType,
  type OperationalExceptionDismissalReason,
} from '@mgbos/domain';
import type {
  OpenOperationalExceptionInput,
  AcknowledgeOperationalExceptionInput,
  AssignOperationalExceptionInput,
  ReassignOperationalExceptionInput,
  ChangeOperationalExceptionSeverityInput,
  ResolveOperationalExceptionInput,
  DismissOperationalExceptionInput,
  ReopenOperationalExceptionInput,
  ManualOpeningSourceKind,
} from '@mgbos/validation';
import {
  openOperationalExceptionAction,
  acknowledgeOperationalExceptionAction,
  assignOperationalExceptionAction,
  reassignOperationalExceptionAction,
  changeOperationalExceptionSeverityAction,
  resolveOperationalExceptionAction,
  dismissOperationalExceptionAction,
  reopenOperationalExceptionAction,
  type OperationalExceptionErrorCode,
} from './actions';
import {
  formatExceptionType,
  formatResourceType,
  getAvailableResolutionTypes,
  getResourceTypeForExceptionType,
  generateClientRequestId,
  translateErrorCode,
} from './console';
import type {
  ResourceCandidate,
  EligiblePrincipal,
  ExceptionCandidate,
} from './data';

// ============================================================================
// Common Modal Backdrop & Dialog Shell
// ============================================================================

function ModalShell({
  title,
  isOpen,
  onClose,
  children,
  maxWidth = '600px',
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '1px solid #334155',
            paddingBottom: '0.75rem',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            aria-label="Tutup"
            style={{
              padding: '4px 8px',
              fontSize: '0.85rem',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormErrorAlert({
  code,
  message,
  onReload,
}: {
  code: OperationalExceptionErrorCode | null;
  message: string | null;
  onReload?: () => void;
}) {
  if (!message) return null;

  return (
    <div
      role="alert"
      style={{
        backgroundColor: '#450a0a',
        border: '1px solid #dc2626',
        borderRadius: '6px',
        padding: '10px 14px',
        marginBottom: '1rem',
        color: '#fca5a5',
        fontSize: '0.85rem',
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: '2px' }}>
        Gagal Memproses Permintaan
      </div>
      <div>{message}</div>
      {code === 'STALE_REVISION' && onReload && (
        <button
          type="button"
          onClick={onReload}
          className="btn-primary"
          style={{
            marginTop: '8px',
            padding: '4px 10px',
            fontSize: '0.78rem',
            backgroundColor: '#dc2626',
          }}
        >
          Muat Ulang Halaman Sekarang
        </button>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '6px',
  color: '#f8fafc',
  padding: '8px 12px',
  fontSize: '0.88rem',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '4px',
  fontSize: '0.82rem',
  fontWeight: 600,
  color: '#cbd5e1',
};

// ============================================================================
// 1. Manual Open Form Modal
// ============================================================================

export function ManualOpenModal({
  candidatesByResource,
  eligiblePrincipals,
}: {
  candidatesByResource: Record<
    OperationalExceptionResourceType,
    ResourceCandidate[]
  >;
  eligiblePrincipals: EligiblePrincipal[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [requestId, setRequestId] = useState(() => generateClientRequestId());

  // Form Fields
  const [exceptionType, setExceptionType] = useState<OperationalExceptionType>(
    'production.deadline_breached',
  );
  const [primaryResourceType, setPrimaryResourceType] =
    useState<OperationalExceptionResourceType>('PRODUCTION_JOB');
  const [selectedResourceId, setSelectedResourceId] = useState<string>('');
  const [severity, setSeverity] =
    useState<OperationalExceptionSeverity>('HIGH');
  const [sourceKind, setSourceKind] =
    useState<ManualOpeningSourceKind>('HUMAN_REPORT');
  const [responsibleRoleCode, setResponsibleRoleCode] =
    useState<string>('OPERATIONS');
  const [responsibleUserId, setResponsibleUserId] = useState<string>('');
  const [summary, setSummary] = useState('');
  const [businessImpact, setBusinessImpact] = useState('');
  const [observationText, setObservationText] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [detectedAt, setDetectedAt] = useState('');
  const [otherCategoryReason, setOtherCategoryReason] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCode, setErrorCode] =
    useState<OperationalExceptionErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync resource type when exception type changes
  const handleExceptionTypeChange = (type: OperationalExceptionType) => {
    setExceptionType(type);
    const mapped = getResourceTypeForExceptionType(type);
    if (mapped) {
      setPrimaryResourceType(mapped);
      const candidates = candidatesByResource[mapped] || [];
      setSelectedResourceId(candidates[0]?.id || '');
    }
  };

  const handleOpen = () => {
    setRequestId(generateClientRequestId());
    setErrorCode(null);
    setErrorMessage(null);
    const initialMapped = getResourceTypeForExceptionType(exceptionType);
    if (initialMapped) {
      setPrimaryResourceType(initialMapped);
      const candidates = candidatesByResource[initialMapped] || [];
      setSelectedResourceId(candidates[0]?.id || '');
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setErrorCode(null);
    setErrorMessage(null);
  };

  const currentCandidates = candidatesByResource[primaryResourceType] || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResourceId) {
      setErrorCode('VALIDATION_ERROR');
      setErrorMessage('Pilih resource yang menjadi sumber abnormalitas.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      requestId,
      exceptionType,
      primaryResourceType,
      primaryResourceId: selectedResourceId,
      severity,
      sourceKind,
      responsibleRoleCode:
        responsibleRoleCode as (typeof RESPONSIBLE_ROLE_CODES)[number],
      responsibleUserId: responsibleUserId ? responsibleUserId : null,
      summary: summary.trim(),
      businessImpact: businessImpact.trim(),
      observation: observationText.trim() ? observationText.trim() : null,
      rootCause: rootCause.trim() ? rootCause.trim() : null,
      detectedAt: detectedAt ? new Date(detectedAt).toISOString() : null,
      otherCategoryReason:
        exceptionType === 'other.operational_abnormality'
          ? otherCategoryReason.trim() || null
          : null,
      supplementaryEvidence: null,
    } satisfies OpenOperationalExceptionInput;

    try {
      const res = await openOperationalExceptionAction(payload);
      if (res.success) {
        setIsOpen(false);
        // Reset form for future opens
        setSummary('');
        setBusinessImpact('');
        setObservationText('');
        setRootCause('');
        router.refresh();
      } else {
        setErrorCode(res.error?.code || 'UNKNOWN_FAILURE');
        setErrorMessage(
          res.error?.message || translateErrorCode(res.error?.code),
        );
      }
    } catch {
      setErrorCode('UNKNOWN_FAILURE');
      setErrorMessage('Terjadi kesalahan jaringan atau server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="btn-primary"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: 600,
        }}
      >
        <span>+</span> Buka Exception Manual
      </button>

      <ModalShell
        title="Buka Operational Exception Baru"
        isOpen={isOpen}
        onClose={handleClose}
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit}>
          <FormErrorAlert code={errorCode} message={errorMessage} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <div>
              <label htmlFor="manual-exception-type" style={labelStyle}>
                Tipe Abnormalitas *
              </label>
              <select
                id="manual-exception-type"
                value={exceptionType}
                onChange={(e) =>
                  handleExceptionTypeChange(
                    e.target.value as OperationalExceptionType,
                  )
                }
                style={inputStyle}
                required
              >
                {OPERATIONAL_EXCEPTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {formatExceptionType(t)} ({t})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="manual-severity" style={labelStyle}>
                Tingkat Keparahan (Severity) *
              </label>
              <select
                id="manual-severity"
                value={severity}
                onChange={(e) =>
                  setSeverity(e.target.value as OperationalExceptionSeverity)
                }
                style={inputStyle}
                required
              >
                {OPERATIONAL_EXCEPTION_SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
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
              <label htmlFor="manual-resource-type" style={labelStyle}>
                Tipe Resource Terkait *
              </label>
              <select
                id="manual-resource-type"
                value={primaryResourceType}
                onChange={(e) => {
                  const rt = e.target.value as OperationalExceptionResourceType;
                  setPrimaryResourceType(rt);
                  const cands = candidatesByResource[rt] || [];
                  setSelectedResourceId(cands[0]?.id || '');
                }}
                disabled={exceptionType !== 'other.operational_abnormality'}
                style={{
                  ...inputStyle,
                  opacity:
                    exceptionType !== 'other.operational_abnormality' ? 0.7 : 1,
                }}
                required
              >
                {OPERATIONAL_EXCEPTION_RESOURCE_TYPES.map((r) => (
                  <option key={r} value={r}>
                    {formatResourceType(r)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="manual-resource-id" style={labelStyle}>
                Pilih Resource (No. SPK / Order / Resi) *
              </label>
              <select
                id="manual-resource-id"
                value={selectedResourceId}
                onChange={(e) => setSelectedResourceId(e.target.value)}
                style={inputStyle}
                required
              >
                {currentCandidates.length === 0 ? (
                  <option value="">
                    Tidak ada candidate {primaryResourceType}
                  </option>
                ) : (
                  currentCandidates.map((cand) => (
                    <option key={cand.id} value={cand.id}>
                      {cand.label}
                    </option>
                  ))
                )}
              </select>
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
              <label htmlFor="manual-source-kind" style={labelStyle}>
                Sumber Deteksi *
              </label>
              <select
                id="manual-source-kind"
                value={sourceKind}
                onChange={(e) =>
                  setSourceKind(e.target.value as ManualOpeningSourceKind)
                }
                style={inputStyle}
                required
              >
                <option value="HUMAN_REPORT">Laporan Manual Operator</option>
                <option value="RECONCILIATION">Rekonsiliasi Operasional</option>
              </select>
            </div>

            <div>
              <label htmlFor="manual-detected-at" style={labelStyle}>
                Waktu Terdeteksi (Opsional)
              </label>
              <input
                id="manual-detected-at"
                type="datetime-local"
                value={detectedAt}
                onChange={(e) => setDetectedAt(e.target.value)}
                style={inputStyle}
              />
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
              <label htmlFor="manual-role" style={labelStyle}>
                Peran Bertanggung Jawab
              </label>
              <select
                id="manual-role"
                value={responsibleRoleCode}
                onChange={(e) => setResponsibleRoleCode(e.target.value)}
                style={inputStyle}
              >
                {RESPONSIBLE_ROLE_CODES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="manual-principal" style={labelStyle}>
                Petugas Penanggung Jawab (Opsional)
              </label>
              <select
                id="manual-principal"
                value={responsibleUserId}
                onChange={(e) => setResponsibleUserId(e.target.value)}
                style={inputStyle}
              >
                <option value="">Belum Ditugaskan (Opsional)</option>
                {eligiblePrincipals.map((p) => (
                  <option key={p.userId} value={p.userId}>
                    {p.name} ({p.roleCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="manual-summary" style={labelStyle}>
              Ringkasan Abnormalitas (5 - 200 karakter) *
            </label>
            <input
              id="manual-summary"
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Contoh: Keterlambatan proses jahit SPK TS-O-2026-0001"
              style={inputStyle}
              minLength={5}
              maxLength={200}
              required
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="manual-impact" style={labelStyle}>
              Dampak Bisnis (5 - 500 karakter) *
            </label>
            <input
              id="manual-impact"
              type="text"
              value={businessImpact}
              onChange={(e) => setBusinessImpact(e.target.value)}
              placeholder="Contoh: Berisiko melanggar komitmen pengiriman ke pelanggan B2B"
              style={inputStyle}
              minLength={5}
              maxLength={500}
              required
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="manual-observation" style={labelStyle}>
              Observasi &amp; Fakta Lapangan (5 - 4000 karakter) *
            </label>
            <textarea
              id="manual-observation"
              rows={3}
              value={observationText}
              onChange={(e) => setObservationText(e.target.value)}
              placeholder="Catatan observasi kronologis mengenai kejadian abnormalitas..."
              style={{ ...inputStyle, resize: 'vertical' }}
              minLength={5}
              maxLength={4000}
              required
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="manual-root-cause" style={labelStyle}>
              Dugaan Penyebab Awal / Root Cause (Opsional)
            </label>
            <input
              id="manual-root-cause"
              type="text"
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              placeholder="Contoh: Mesin obras mengalami gangguan teknis sejak pagi"
              style={inputStyle}
              maxLength={500}
            />
          </div>

          {exceptionType === 'other.operational_abnormality' && (
            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="manual-other-reason" style={labelStyle}>
                Alasan Kategori Lainnya (Wajib untuk tipe OTHER) *
              </label>
              <input
                id="manual-other-reason"
                type="text"
                value={otherCategoryReason}
                onChange={(e) => setOtherCategoryReason(e.target.value)}
                placeholder="Jelaskan alasan mengapa abnormality ini tidak masuk kategori standar"
                style={inputStyle}
                minLength={5}
                maxLength={500}
                required
              />
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '1.25rem',
              borderTop: '1px solid #334155',
              paddingTop: '1rem',
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || !selectedResourceId}
            >
              {isSubmitting ? 'Menyimpan...' : 'Buka Exception'}
            </button>
          </div>
        </form>
      </ModalShell>
    </>
  );
}

// ============================================================================
// 2. Acknowledge Modal
// ============================================================================

export function AcknowledgeModal({
  exceptionId,
  currentRevision,
}: {
  exceptionId: string;
  currentRevision: number;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [requestId, setRequestId] = useState(() => generateClientRequestId());
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCode, setErrorCode] =
    useState<OperationalExceptionErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpen = () => {
    setRequestId(generateClientRequestId());
    setErrorCode(null);
    setErrorMessage(null);
    setNote('');
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      requestId,
      exceptionId,
      expectedRevision: currentRevision,
      note: note.trim() || null,
    } satisfies AcknowledgeOperationalExceptionInput;

    try {
      const res = await acknowledgeOperationalExceptionAction(payload);

      if (res.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setErrorCode(res.error?.code || 'UNKNOWN_FAILURE');
        setErrorMessage(
          res.error?.message || translateErrorCode(res.error?.code),
        );
      }
    } catch {
      setErrorCode('UNKNOWN_FAILURE');
      setErrorMessage('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="btn-secondary"
        style={{ fontWeight: 600 }}
      >
        Acknowledge
      </button>

      <ModalShell
        title="Konfirmasi Mengetahui Exception (Acknowledge)"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <FormErrorAlert
            code={errorCode}
            message={errorMessage}
            onReload={() => window.location.reload()}
          />
          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: 0 }}>
            Tandai bahwa exception ini telah diketahui oleh operator atau tim
            terkait untuk segera ditindaklanjuti.
          </p>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="ack-note" style={labelStyle}>
              Catatan Acknowledge (Opsional)
            </label>
            <input
              id="ack-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Sudah dikoordinasikan dengan tim sewing"
              style={inputStyle}
              maxLength={500}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              borderTop: '1px solid #334155',
              paddingTop: '1rem',
            }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : 'Konfirmasi Acknowledge'}
            </button>
          </div>
        </form>
      </ModalShell>
    </>
  );
}

// ============================================================================
// 3. Assign / Reassign Modal
// ============================================================================

export function AssignModal({
  exceptionId,
  currentRevision,
  eligiblePrincipals,
  isReassign = false,
  currentRoleCode,
  currentUserId,
}: {
  exceptionId: string;
  currentRevision: number;
  eligiblePrincipals: EligiblePrincipal[];
  isReassign?: boolean;
  currentRoleCode?: string | null;
  currentUserId?: string | null;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [requestId, setRequestId] = useState(() => generateClientRequestId());
  const [roleCode, setRoleCode] = useState(currentRoleCode || 'OPERATIONS');
  const [userId, setUserId] = useState(currentUserId || '');
  const [noteOrReason, setNoteOrReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCode, setErrorCode] =
    useState<OperationalExceptionErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpen = () => {
    setRequestId(generateClientRequestId());
    setErrorCode(null);
    setErrorMessage(null);
    setNoteOrReason('');
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (isReassign) {
        if (!userId) {
          setErrorCode('VALIDATION_ERROR');
          setErrorMessage('Pilih petugas penanggung jawab baru.');
          setIsSubmitting(false);
          return;
        }
        if (!noteOrReason.trim() || noteOrReason.trim().length < 5) {
          setErrorCode('VALIDATION_ERROR');
          setErrorMessage(
            'Alasan penugasan ulang wajib diisi minimal 5 karakter.',
          );
          setIsSubmitting(false);
          return;
        }
        const payload = {
          requestId,
          exceptionId,
          expectedRevision: currentRevision,
          newResponsibleRoleCode:
            roleCode as (typeof RESPONSIBLE_ROLE_CODES)[number],
          newResponsibleUserId: userId,
          reason: noteOrReason.trim(),
        } satisfies ReassignOperationalExceptionInput;

        const res = await reassignOperationalExceptionAction(payload);
        if (res.success) {
          setIsOpen(false);
          router.refresh();
        } else {
          setErrorCode(res.error?.code || 'UNKNOWN_FAILURE');
          setErrorMessage(
            res.error?.message || translateErrorCode(res.error?.code),
          );
        }
      } else {
        if (!userId) {
          setErrorCode('VALIDATION_ERROR');
          setErrorMessage('Pilih petugas penanggung jawab.');
          setIsSubmitting(false);
          return;
        }
        const payload = {
          requestId,
          exceptionId,
          expectedRevision: currentRevision,
          responsibleRoleCode:
            roleCode as (typeof RESPONSIBLE_ROLE_CODES)[number],
          responsibleUserId: userId,
          reason: noteOrReason.trim() ? noteOrReason.trim() : null,
        } satisfies AssignOperationalExceptionInput;

        const res = await assignOperationalExceptionAction(payload);
        if (res.success) {
          setIsOpen(false);
          router.refresh();
        } else {
          setErrorCode(res.error?.code || 'UNKNOWN_FAILURE');
          setErrorMessage(
            res.error?.message || translateErrorCode(res.error?.code),
          );
        }
      }
    } catch {
      setErrorCode('UNKNOWN_FAILURE');
      setErrorMessage('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="btn-secondary"
        style={{ fontWeight: 600 }}
      >
        {isReassign ? 'Tugaskan Ulang (Reassign)' : 'Tugaskan (Assign)'}
      </button>

      <ModalShell
        title={
          isReassign
            ? 'Tugaskan Ulang Penanggung Jawab'
            : 'Tugaskan Penanggung Jawab'
        }
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <FormErrorAlert
            code={errorCode}
            message={errorMessage}
            onReload={() => window.location.reload()}
          />
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="assign-role" style={labelStyle}>
              Peran Bertanggung Jawab *
            </label>
            <select
              id="assign-role"
              value={roleCode}
              onChange={(e) => setRoleCode(e.target.value)}
              style={inputStyle}
              required
            >
              {RESPONSIBLE_ROLE_CODES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="assign-user" style={labelStyle}>
              Petugas Penanggung Jawab *
            </label>
            <select
              id="assign-user"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={inputStyle}
              required
            >
              <option value="">-- Pilih Petugas (Wajib) --</option>
              {eligiblePrincipals.map((p) => (
                <option key={p.userId} value={p.userId}>
                  {p.name} ({p.roleCode})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="assign-note" style={labelStyle}>
              {isReassign
                ? 'Alasan Penugasan Ulang (5 - 500 karakter) *'
                : 'Catatan Penugasan (Opsional)'}
            </label>
            <input
              id="assign-note"
              type="text"
              value={noteOrReason}
              onChange={(e) => setNoteOrReason(e.target.value)}
              placeholder={
                isReassign
                  ? 'Contoh: Dialihkan ke Kepala Gudang karena penyesuaian tim'
                  : 'Catatan tambahan penugasan'
              }
              style={inputStyle}
              minLength={isReassign ? 5 : undefined}
              maxLength={500}
              required={isReassign}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              borderTop: '1px solid #334155',
              paddingTop: '1rem',
            }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Memproses...'
                : isReassign
                  ? 'Simpan Penugasan Ulang'
                  : 'Simpan Penugasan'}
            </button>
          </div>
        </form>
      </ModalShell>
    </>
  );
}

// ============================================================================
// 4. Change Severity Modal
// ============================================================================

export function ChangeSeverityModal({
  exceptionId,
  currentRevision,
  currentSeverity,
}: {
  exceptionId: string;
  currentRevision: number;
  currentSeverity: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [requestId, setRequestId] = useState(() => generateClientRequestId());

  const otherSeverities = OPERATIONAL_EXCEPTION_SEVERITIES.filter(
    (s) => s !== currentSeverity,
  );
  const [newSeverity, setNewSeverity] = useState<OperationalExceptionSeverity>(
    otherSeverities[0] || 'CRITICAL',
  );
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCode, setErrorCode] =
    useState<OperationalExceptionErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpen = () => {
    setRequestId(generateClientRequestId());
    setErrorCode(null);
    setErrorMessage(null);
    setReason('');
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedReason = reason.trim();
    if (trimmedReason.length < 5) {
      setErrorCode('VALIDATION_ERROR');
      setErrorMessage('Alasan perubahan tingkat keparahan minimal 5 karakter.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        requestId,
        exceptionId,
        expectedRevision: currentRevision,
        newSeverity,
        reason: trimmedReason,
      } satisfies ChangeOperationalExceptionSeverityInput;

      const res = await changeOperationalExceptionSeverityAction(payload);

      if (res.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setErrorCode(res.error?.code || 'UNKNOWN_FAILURE');
        setErrorMessage(
          res.error?.message || translateErrorCode(res.error?.code),
        );
      }
    } catch {
      setErrorCode('UNKNOWN_FAILURE');
      setErrorMessage('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="btn-secondary"
        style={{ fontWeight: 600 }}
      >
        Ubah Keparahan (Severity)
      </button>

      <ModalShell
        title="Ubah Tingkat Keparahan Exception"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <FormErrorAlert
            code={errorCode}
            message={errorMessage}
            onReload={() => window.location.reload()}
          />
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="change-severity-select" style={labelStyle}>
              Tingkat Keparahan Baru *
            </label>
            <select
              id="change-severity-select"
              value={newSeverity}
              onChange={(e) =>
                setNewSeverity(e.target.value as OperationalExceptionSeverity)
              }
              style={inputStyle}
              required
            >
              {otherSeverities.map((s) => (
                <option key={s} value={s}>
                  {s} (saat ini: {currentSeverity})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="change-severity-reason" style={labelStyle}>
              Alasan Perubahan Keparahan (5 - 500 karakter) *
            </label>
            <input
              id="change-severity-reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Dampak keterlambatan meluas ke pesanan lainnya"
              style={inputStyle}
              minLength={5}
              maxLength={500}
              required
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              borderTop: '1px solid #334155',
              paddingTop: '1rem',
            }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </ModalShell>
    </>
  );
}

// ============================================================================
// 5. Resolve Modal
// ============================================================================

export function ResolveModal({
  exceptionId,
  currentRevision,
  roleCode,
  exceptionCandidates,
}: {
  exceptionId: string;
  currentRevision: number;
  roleCode: string;
  exceptionCandidates: ExceptionCandidate[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [requestId, setRequestId] = useState(() => generateClientRequestId());

  const availableResolutions = getAvailableResolutionTypes(roleCode);
  const [resolutionType, setResolutionType] =
    useState<OperationalExceptionResolutionType>(
      availableResolutions[0] || 'REMEDIATED',
    );
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [supersededById, setSupersededById] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCode, setErrorCode] =
    useState<OperationalExceptionErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpen = () => {
    setRequestId(generateClientRequestId());
    setErrorCode(null);
    setErrorMessage(null);
    setResolutionSummary('');
    setSupersededById(exceptionCandidates[0]?.id || '');
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSummary = resolutionSummary.trim();
    if (trimmedSummary.length < 5) {
      setErrorCode('VALIDATION_ERROR');
      setErrorMessage('Ringkasan resolusi minimal 5 karakter.');
      return;
    }

    if (resolutionType === 'SUPERSEDED' && !supersededById) {
      setErrorCode('VALIDATION_ERROR');
      setErrorMessage('Pilih exception pengganti yang masih aktif.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        requestId,
        exceptionId,
        expectedRevision: currentRevision,
        resolutionType,
        resolutionSummary: trimmedSummary,
        supersededByExceptionId:
          resolutionType === 'SUPERSEDED' ? supersededById : null,
        closureEvidence: null,
      } satisfies ResolveOperationalExceptionInput;

      const res = await resolveOperationalExceptionAction(payload);

      if (res.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setErrorCode(res.error?.code || 'UNKNOWN_FAILURE');
        setErrorMessage(
          res.error?.message || translateErrorCode(res.error?.code),
        );
      }
    } catch {
      setErrorCode('UNKNOWN_FAILURE');
      setErrorMessage('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="btn-primary"
        style={{
          backgroundColor: '#16a34a',
          borderColor: '#15803d',
          fontWeight: 600,
        }}
      >
        Selesaikan (Resolve)
      </button>

      <ModalShell
        title="Selesaikan Operational Exception"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <FormErrorAlert
            code={errorCode}
            message={errorMessage}
            onReload={() => window.location.reload()}
          />
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="resolve-type" style={labelStyle}>
              Tipe Penyelesaian *
            </label>
            <select
              id="resolve-type"
              value={resolutionType}
              onChange={(e) =>
                setResolutionType(
                  e.target.value as OperationalExceptionResolutionType,
                )
              }
              style={inputStyle}
              required
            >
              {availableResolutions.map((res) => (
                <option key={res} value={res}>
                  {res === 'ACCEPTED_RISK'
                    ? 'ACCEPTED_RISK (Otoritas Khusus Owner)'
                    : res}
                </option>
              ))}
            </select>
          </div>

          {resolutionType === 'SUPERSEDED' && (
            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="resolve-superseded-by" style={labelStyle}>
                Pilih Exception Pengganti (Superseding Exception) *
              </label>
              <select
                id="resolve-superseded-by"
                value={supersededById}
                onChange={(e) => setSupersededById(e.target.value)}
                style={inputStyle}
                required
              >
                {exceptionCandidates.length === 0 ? (
                  <option value="">
                    Tidak ada exception lain yang tersedia
                  </option>
                ) : (
                  exceptionCandidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="resolve-summary" style={labelStyle}>
              Ringkasan Penyelesaian (5 - 500 karakter) *
            </label>
            <textarea
              id="resolve-summary"
              rows={3}
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              placeholder="Jelaskan tindakan korektif atau mitigasi yang telah dilakukan..."
              style={{ ...inputStyle, resize: 'vertical' }}
              minLength={5}
              maxLength={500}
              required
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              borderTop: '1px solid #334155',
              paddingTop: '1rem',
            }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ backgroundColor: '#16a34a', borderColor: '#15803d' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : 'Konfirmasi Selesai'}
            </button>
          </div>
        </form>
      </ModalShell>
    </>
  );
}

// ============================================================================
// 6. Dismiss Modal
// ============================================================================

export function DismissModal({
  exceptionId,
  currentRevision,
  exceptionCandidates,
}: {
  exceptionId: string;
  currentRevision: number;
  exceptionCandidates: ExceptionCandidate[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [requestId, setRequestId] = useState(() => generateClientRequestId());
  const [dismissalReason, setDismissalReason] =
    useState<OperationalExceptionDismissalReason>('FALSE_POSITIVE');
  const [dismissalNote, setDismissalNote] = useState('');
  const [duplicateOfId, setDuplicateOfId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCode, setErrorCode] =
    useState<OperationalExceptionErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpen = () => {
    setRequestId(generateClientRequestId());
    setErrorCode(null);
    setErrorMessage(null);
    setDismissalNote('');
    setDuplicateOfId(exceptionCandidates[0]?.id || '');
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNote = dismissalNote.trim();
    if (trimmedNote.length < 5) {
      setErrorCode('VALIDATION_ERROR');
      setErrorMessage('Penjelasan penolakan minimal 5 karakter.');
      return;
    }

    if (dismissalReason === 'DUPLICATE' && !duplicateOfId) {
      setErrorCode('VALIDATION_ERROR');
      setErrorMessage('Pilih exception rujukan duplikasi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        requestId,
        exceptionId,
        expectedRevision: currentRevision,
        dismissalReason,
        reasonSummary: trimmedNote,
        duplicateOfExceptionId:
          dismissalReason === 'DUPLICATE' ? duplicateOfId : null,
        closureEvidence: null,
      } satisfies DismissOperationalExceptionInput;

      const res = await dismissOperationalExceptionAction(payload);

      if (res.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setErrorCode(res.error?.code || 'UNKNOWN_FAILURE');
        setErrorMessage(
          res.error?.message || translateErrorCode(res.error?.code),
        );
      }
    } catch {
      setErrorCode('UNKNOWN_FAILURE');
      setErrorMessage('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="btn-secondary"
        style={{
          color: '#fca5a5',
          borderColor: '#7f1d1d',
          fontWeight: 600,
        }}
      >
        Tolak (Dismiss)
      </button>

      <ModalShell
        title="Tolak Operational Exception (Dismiss)"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <FormErrorAlert
            code={errorCode}
            message={errorMessage}
            onReload={() => window.location.reload()}
          />
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="dismiss-reason" style={labelStyle}>
              Alasan Penolakan *
            </label>
            <select
              id="dismiss-reason"
              value={dismissalReason}
              onChange={(e) =>
                setDismissalReason(
                  e.target.value as OperationalExceptionDismissalReason,
                )
              }
              style={inputStyle}
              required
            >
              <option value="FALSE_POSITIVE">
                FALSE_POSITIVE (Bukan masalah sebenarnya)
              </option>
              <option value="DUPLICATE">
                DUPLICATE (Duplikasi dari exception lain)
              </option>
              <option value="NOT_APPLICABLE">
                NOT_APPLICABLE (Tidak berlaku)
              </option>
              <option value="OPENED_IN_ERROR">
                OPENED_IN_ERROR (Salah input oleh operator)
              </option>
            </select>
          </div>

          {dismissalReason === 'DUPLICATE' && (
            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="dismiss-duplicate-of" style={labelStyle}>
                Pilih Exception Rujukan Duplikasi *
              </label>
              <select
                id="dismiss-duplicate-of"
                value={duplicateOfId}
                onChange={(e) => setDuplicateOfId(e.target.value)}
                style={inputStyle}
                required
              >
                {exceptionCandidates.length === 0 ? (
                  <option value="">
                    Tidak ada exception lain yang tersedia
                  </option>
                ) : (
                  exceptionCandidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="dismiss-note" style={labelStyle}>
              Penjelasan Penolakan (5 - 500 karakter) *
            </label>
            <textarea
              id="dismiss-note"
              rows={3}
              value={dismissalNote}
              onChange={(e) => setDismissalNote(e.target.value)}
              placeholder="Jelaskan alasan mengapa exception ini ditolak..."
              style={{ ...inputStyle, resize: 'vertical' }}
              minLength={5}
              maxLength={500}
              required
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              borderTop: '1px solid #334155',
              paddingTop: '1rem',
            }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ backgroundColor: '#b91c1c', borderColor: '#991b1b' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : 'Konfirmasi Penolakan'}
            </button>
          </div>
        </form>
      </ModalShell>
    </>
  );
}

// ============================================================================
// 7. Reopen Modal
// ============================================================================

export function ReopenModal({
  exceptionId,
  currentRevision,
}: {
  exceptionId: string;
  currentRevision: number;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [requestId, setRequestId] = useState(() => generateClientRequestId());
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCode, setErrorCode] =
    useState<OperationalExceptionErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpen = () => {
    setRequestId(generateClientRequestId());
    setErrorCode(null);
    setErrorMessage(null);
    setReason('');
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedReason = reason.trim();
    if (trimmedReason.length < 5) {
      setErrorCode('VALIDATION_ERROR');
      setErrorMessage('Alasan pembukaan kembali minimal 5 karakter.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        requestId,
        exceptionId,
        expectedRevision: currentRevision,
        reason: trimmedReason,
        supportingEvidence: null,
      } satisfies ReopenOperationalExceptionInput;

      const res = await reopenOperationalExceptionAction(payload);

      if (res.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setErrorCode(res.error?.code || 'UNKNOWN_FAILURE');
        setErrorMessage(
          res.error?.message || translateErrorCode(res.error?.code),
        );
      }
    } catch {
      setErrorCode('UNKNOWN_FAILURE');
      setErrorMessage('Terjadi kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="btn-secondary"
        style={{ fontWeight: 600 }}
      >
        Buka Kembali (Reopen)
      </button>

      <ModalShell
        title="Buka Kembali Exception (Reopen)"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <form onSubmit={handleSubmit}>
          <FormErrorAlert
            code={errorCode}
            message={errorMessage}
            onReload={() => window.location.reload()}
          />
          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: 0 }}>
            Mengaktifkan kembali exception yang telah selesai atau ditolak
            karena masalah berulang atau muncul temuan baru.
          </p>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="reopen-reason" style={labelStyle}>
              Alasan Pembukaan Kembali (5 - 500 karakter) *
            </label>
            <input
              id="reopen-reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Terjadi regresi kendala setelah perbaikan awal"
              style={inputStyle}
              minLength={5}
              maxLength={500}
              required
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              borderTop: '1px solid #334155',
              paddingTop: '1rem',
            }}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : 'Buka Kembali Exception'}
            </button>
          </div>
        </form>
      </ModalShell>
    </>
  );
}
