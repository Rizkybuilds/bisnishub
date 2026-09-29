'use client';

import { useActionState, useState } from 'react';
import { createLeadAction, type LeadActionState } from './actions';

export function CreateLeadModal({
  activeBrandName,
}: {
  activeBrandName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [state, formAction, isPending] = useActionState<
    LeadActionState,
    FormData
  >(async (prev, formData) => {
    const res = await createLeadAction(prev, formData);
    if (res.success) {
      setIsOpen(false);
    }
    return res;
  }, {});

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary"
        style={{ padding: '8px 16px', fontSize: '0.875rem' }}
      >
        + Catat Inbound Lead
      </button>

      {isOpen && (
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
              maxWidth: '580px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#0f172a',
              borderColor: '#334155',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>
                  Catat Inbound Lead Baru
                </h3>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    marginTop: '2px',
                  }}
                >
                  Akan dikaitkan langsung ke Brand{' '}
                  <strong>{activeBrandName}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
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

            {state.error && (
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
                {state.error}
              </div>
            )}

            <form action={formAction}>
              {/* Channel Selector */}
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
                  Channel Asal Inquiry *
                </label>
                <select
                  name="channelCode"
                  defaultValue="WHATSAPP"
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
                  <option value="WHATSAPP">WhatsApp Official (+62)</option>
                  <option value="WEBSITE">
                    Website Storefront / Custom Atelier
                  </option>
                  <option value="INSTAGRAM_DM">Instagram Direct Message</option>
                  <option value="DIRECT_SALES">
                    Direct Sales / Offline Meeting
                  </option>
                  <option value="MARKETPLACE">
                    Marketplace (Shopee / Tokopedia)
                  </option>
                </select>
              </div>

              {/* Title / Summary */}
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
                  Judul Ringkasan Kebutuhan *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Kaos Komunitas Motor 75 Pcs Sablon DTF"
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

              {/* Contact Person & Company */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '14px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                      marginBottom: '4px',
                    }}
                  >
                    Nama Kontak / PIC
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    placeholder="Contoh: Denny Siregar"
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

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                      marginBottom: '4px',
                    }}
                  >
                    Nama Perusahaan / Komunitas
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Contoh: Riders Club Jakarta"
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
              </div>

              {/* Phone & Email */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '14px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                      marginBottom: '4px',
                    }}
                  >
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+628123456789"
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

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                      marginBottom: '4px',
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="kontak@perusahaan.com"
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
              </div>

              {/* Raw Inquiry Textarea */}
              <div style={{ marginBottom: '14px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    color: '#cbd5e1',
                    marginBottom: '4px',
                  }}
                >
                  Pesan Asli Masuk (Raw Inquiry)
                </label>
                <textarea
                  name="rawInquiry"
                  rows={3}
                  placeholder="Paste chat WhatsApp / DM atau catatan kebutuhan kustom pelanggan di sini..."
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

              {/* Estimated Quantity & Budget */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                      marginBottom: '4px',
                    }}
                  >
                    Estimasi Kuantiti (Pcs)
                  </label>
                  <input
                    type="number"
                    name="estimatedQuantity"
                    min="1"
                    placeholder="Contoh: 75"
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

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                      marginBottom: '4px',
                    }}
                  >
                    Estimasi Budget (Rp)
                  </label>
                  <input
                    type="number"
                    name="estimatedBudget"
                    step="50000"
                    placeholder="Contoh: 6000000"
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
              </div>

              {/* Actions */}
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
                  disabled={isPending}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.875rem' }}
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
