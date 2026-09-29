'use client';

import { useState, useTransition } from 'react';
import {
  qualifyLeadAction,
  disqualifyLeadAction,
  convertLeadAction,
} from './actions';
import {
  formatLeadStatus,
  getLeadStatusBadgeColor,
  formatDisqualificationReason,
  type LeadStatus,
  type DisqualificationReason,
} from '@mgbos/domain';

export interface LeadDetailData {
  id: string;
  lead_number: string;
  title: string;
  contact_name: string | null;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  raw_inquiry: string | null;
  estimated_quantity: number | null;
  estimated_budget: number | null;
  status: LeadStatus;
  qualification_result: string | null;
  qualification_score: number | null;
  qualification_notes: string | null;
  disqualification_reason: DisqualificationReason | null;
  created_at: string;
  qualified_at: string | null;
  disqualified_at: string | null;
  converted_at: string | null;
  channels?: {
    id: string;
    code: string;
    name: string;
    channel_type: string;
  } | null;
  brands?: {
    id: string;
    code: string;
    name: string;
  } | null;
  customer_accounts?: {
    id: string;
    display_name: string;
    account_type: string;
  } | null;
}

export function LeadDetailModal({
  lead,
  isOpen,
  onClose,
}: {
  lead: LeadDetailData;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    'VIEW' | 'QUALIFY' | 'DISQUALIFY' | 'CONVERT'
  >('VIEW');
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  if (!isOpen) return null;

  const badgeColor = getLeadStatusBadgeColor(lead.status);

  const handleQualify = (formData: FormData) => {
    setActionError(null);
    startTransition(async () => {
      const res = await qualifyLeadAction({}, formData);
      if (res.success) {
        onClose();
      } else {
        setActionError(res.error || 'Gagal memverifikasi lead');
      }
    });
  };

  const handleDisqualify = (formData: FormData) => {
    setActionError(null);
    startTransition(async () => {
      const res = await disqualifyLeadAction({}, formData);
      if (res.success) {
        onClose();
      } else {
        setActionError(res.error || 'Gagal mendiskualifikasi lead');
      }
    });
  };

  const handleConvert = (formData: FormData) => {
    setActionError(null);
    startTransition(async () => {
      const res = await convertLeadAction({}, formData);
      if (res.success) {
        onClose();
      } else {
        setActionError(res.error || 'Gagal mengonversi lead');
      }
    });
  };

  const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : null;
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#0f172a',
          borderColor: '#334155',
          padding: '24px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '16px',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#38bdf8',
                  background: '#082f49',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid #0284c7',
                }}
              >
                {lead.lead_number}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: badgeColor.bg,
                  color: badgeColor.text,
                  border: `1px solid ${badgeColor.border}`,
                }}
              >
                {formatLeadStatus(lead.status)}
              </span>
              {lead.brands && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    background: '#1e293b',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {lead.brands.name}
                </span>
              )}
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>
              {lead.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>

        {actionError && (
          <div
            style={{
              background: '#450a0a',
              border: '1px solid #dc2626',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            {actionError}
          </div>
        )}

        {/* Tab Actions Bar */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid #1e293b',
            paddingBottom: '12px',
            marginBottom: '16px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('VIEW')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: activeTab === 'VIEW' ? '#1e293b' : 'transparent',
              color: activeTab === 'VIEW' ? '#f8fafc' : '#94a3b8',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Detail Kebutuhan
          </button>

          {(lead.status === 'NEW' ||
            lead.status === 'CONTACTED' ||
            lead.status === 'QUALIFYING' ||
            lead.status === 'DISQUALIFIED') && (
            <button
              type="button"
              onClick={() => setActiveTab('QUALIFY')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: activeTab === 'QUALIFY' ? '#052e16' : 'transparent',
                color: activeTab === 'QUALIFY' ? '#4ade80' : '#4ade80',
                border: '1px solid #16a34a',
                cursor: 'pointer',
              }}
            >
              ✓ Loloskan Kualifikasi
            </button>
          )}

          {(lead.status === 'NEW' ||
            lead.status === 'CONTACTED' ||
            lead.status === 'QUALIFYING') && (
            <button
              type="button"
              onClick={() => setActiveTab('DISQUALIFY')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background:
                  activeTab === 'DISQUALIFY' ? '#450a0a' : 'transparent',
                color: activeTab === 'DISQUALIFY' ? '#f87171' : '#f87171',
                border: '1px solid #dc2626',
                cursor: 'pointer',
              }}
            >
              ✕ Diskualifikasi
            </button>
          )}

          {lead.status === 'QUALIFIED' && (
            <button
              type="button"
              onClick={() => setActiveTab('CONVERT')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: activeTab === 'CONVERT' ? '#3b0764' : 'transparent',
                color: activeTab === 'CONVERT' ? '#c084fc' : '#c084fc',
                border: '1px solid #9333ea',
                cursor: 'pointer',
              }}
            >
              ⚡ Konversi ke Akun Customer
            </button>
          )}
        </div>

        {/* View Tab */}
        {activeTab === 'VIEW' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Raw Inquiry Box */}
            <div
              style={{
                background: '#020617',
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid #1e293b',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  marginBottom: '6px',
                  fontWeight: 600,
                }}
              >
                PESAN MASUK ASLI (RAW INQUIRY)
              </div>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#e2e8f0',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                }}
              >
                {lead.raw_inquiry || 'Tidak ada catatan raw inquiry.'}
              </p>
            </div>

            {/* Grid 2 Columns: Identity & Specs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
              }}
            >
              <div
                style={{
                  background: '#020617',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #1e293b',
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    marginBottom: '8px',
                    fontWeight: 600,
                  }}
                >
                  IDENTITAS PROSPEK / KONTAK
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#cbd5e1',
                    marginBottom: '6px',
                  }}
                >
                  <strong>Nama:</strong> {lead.contact_name || '-'}
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#cbd5e1',
                    marginBottom: '6px',
                  }}
                >
                  <strong>Perusahaan:</strong> {lead.company_name || '-'}
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#cbd5e1',
                    marginBottom: '6px',
                  }}
                >
                  <strong>WhatsApp:</strong>{' '}
                  {lead.phone ? (
                    <a
                      href={waLink || '#'}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#38bdf8', textDecoration: 'underline' }}
                    >
                      {lead.phone}
                    </a>
                  ) : (
                    '-'
                  )}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <strong>Email:</strong> {lead.email || '-'}
                </div>
              </div>

              <div
                style={{
                  background: '#020617',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #1e293b',
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    marginBottom: '8px',
                    fontWeight: 600,
                  }}
                >
                  ESTIMASI &amp; CHANNEL
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#cbd5e1',
                    marginBottom: '6px',
                  }}
                >
                  <strong>Channel:</strong> {lead.channels?.name || 'Direct'}
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#cbd5e1',
                    marginBottom: '6px',
                  }}
                >
                  <strong>Estimasi Kuantiti:</strong>{' '}
                  {lead.estimated_quantity
                    ? `${lead.estimated_quantity} pcs`
                    : '-'}
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#cbd5e1',
                    marginBottom: '6px',
                  }}
                >
                  <strong>Estimasi Nilai:</strong>{' '}
                  {lead.estimated_budget
                    ? `Rp ${lead.estimated_budget.toLocaleString('id-ID')}`
                    : '-'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <strong>Akun Customer:</strong>{' '}
                  {lead.customer_accounts ? (
                    <span style={{ color: '#4ade80' }}>
                      {lead.customer_accounts.display_name} (
                      {lead.customer_accounts.account_type})
                    </span>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>Belum Terhubung</span>
                  )}
                </div>
              </div>
            </div>

            {/* Qualification Review Card */}
            {(lead.qualification_notes || lead.disqualification_reason) && (
              <div
                style={{
                  background: '#020617',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #1e293b',
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    marginBottom: '6px',
                    fontWeight: 600,
                  }}
                >
                  CATATAN KUALIFIKASI / REVIEW
                </div>
                {lead.qualification_score != null && (
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: '#38bdf8',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>Skor Kualifikasi:</strong>{' '}
                    {lead.qualification_score} / 100
                  </div>
                )}
                {lead.disqualification_reason && (
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: '#f87171',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>Alasan Diskualifikasi:</strong>{' '}
                    {formatDisqualificationReason(lead.disqualification_reason)}
                  </div>
                )}
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  {lead.qualification_notes}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Qualify Tab Form */}
        {activeTab === 'QUALIFY' && (
          <form action={handleQualify}>
            <input type="hidden" name="leadId" value={lead.id} />
            <div style={{ marginBottom: '14px' }}>
              <div
                style={{
                  padding: '10px 14px',
                  background: '#052e16',
                  border: '1px solid #16a34a',
                  borderRadius: '6px',
                  color: '#86efac',
                  fontSize: '0.85rem',
                  marginBottom: '14px',
                }}
              >
                Loloskan lead ini ke status <strong>QUALIFIED</strong> agar siap
                diproses menjadi penawaran harga resmi (Quotation MGBOS-009).
              </div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: '#cbd5e1',
                  marginBottom: '4px',
                }}
              >
                Skor Kualifikasi (0 - 100)
              </label>
              <input
                type="number"
                name="qualificationScore"
                defaultValue={lead.qualification_score || 85}
                min="0"
                max="100"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#020617',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: '#cbd5e1',
                  marginBottom: '4px',
                }}
              >
                Catatan Kualifikasi
              </label>
              <textarea
                name="qualificationNotes"
                rows={3}
                defaultValue="Kebutuhan spesifikasi jelas, kontak terkonfirmasi, siap dibuatkan penawaran."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#020617',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  fontSize: '0.875rem',
                  resize: 'vertical',
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
                onClick={() => setActiveTab('VIEW')}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.875rem' }}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="btn-primary"
                style={{
                  padding: '8px 18px',
                  fontSize: '0.875rem',
                  background: '#16a34a',
                  borderColor: '#15803d',
                }}
              >
                {isPending ? 'Memproses...' : 'Setujui Kualifikasi'}
              </button>
            </div>
          </form>
        )}

        {/* Disqualify Tab Form */}
        {activeTab === 'DISQUALIFY' && (
          <form action={handleDisqualify}>
            <input type="hidden" name="leadId" value={lead.id} />
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: '#cbd5e1',
                  marginBottom: '4px',
                  fontWeight: 600,
                }}
              >
                Alasan Diskualifikasi *
              </label>
              <select
                name="reason"
                defaultValue="OUT_OF_SCOPE"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#020617',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  fontSize: '0.875rem',
                }}
              >
                <option value="OUT_OF_SCOPE">
                  Di Luar Kapasitas / Scope Produksi
                </option>
                <option value="SPAM">Spam / Bot / Promosi Ilegal</option>
                <option value="INVALID_CONTACT">
                  Nomor / Kontak Tidak Valid
                </option>
                <option value="QUANTITY_NOT_SUPPORTED">
                  Kuantiti Tidak Memenuhi Minimum
                </option>
                <option value="DEADLINE_IMPOSSIBLE">
                  Deadline Terlalu Mepet / Tidak Terkejar
                </option>
                <option value="BUDGET_MISMATCH">Budget Terlalu Rendah</option>
                <option value="OTHER">Alasan Lainnya</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  color: '#cbd5e1',
                  marginBottom: '4px',
                  fontWeight: 600,
                }}
              >
                Catatan Alasan Diskualifikasi *
              </label>
              <textarea
                name="qualificationNotes"
                required
                rows={3}
                placeholder="Jelaskan alasan mengapa inquiry ini tidak dapat diproses lebih lanjut..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#020617',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  fontSize: '0.875rem',
                  resize: 'vertical',
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
                onClick={() => setActiveTab('VIEW')}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.875rem' }}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="btn-primary"
                style={{
                  padding: '8px 18px',
                  fontSize: '0.875rem',
                  background: '#dc2626',
                  borderColor: '#b91c1c',
                }}
              >
                {isPending ? 'Memproses...' : 'Konfirmasi Diskualifikasi'}
              </button>
            </div>
          </form>
        )}

        {/* Convert Tab Form */}
        {activeTab === 'CONVERT' && (
          <form action={handleConvert}>
            <input type="hidden" name="leadId" value={lead.id} />
            <input type="hidden" name="createNewAccount" value="true" />
            <div
              style={{
                padding: '12px 14px',
                background: '#3b0764',
                border: '1px solid #7e22ce',
                borderRadius: '6px',
                color: '#e9d5ff',
                fontSize: '0.85rem',
                marginBottom: '16px',
                lineHeight: 1.5,
              }}
            >
              Konversi lead ini ke{' '}
              <strong>Customer Master (Customer 360)</strong>. Sistem akan
              otomatis membuat akun pelanggan holding, kontak PIC, dan relasi
              brand untuk {lead.brands?.name || 'TeeStock'}.
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
                onClick={() => setActiveTab('VIEW')}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.875rem' }}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="btn-primary"
                style={{
                  padding: '8px 18px',
                  fontSize: '0.875rem',
                  background: '#9333ea',
                  borderColor: '#7e22ce',
                }}
              >
                {isPending
                  ? 'Mengonversi...'
                  : 'Konfirmasi Konversi ke Customer'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
