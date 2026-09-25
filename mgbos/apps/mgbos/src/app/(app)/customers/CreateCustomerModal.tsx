'use client';

import { useActionState, useState } from 'react';
import { createCustomerAction, type CreateCustomerState } from './actions';

export function CreateCustomerModal({
  activeBrandName,
}: {
  activeBrandName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [accountType, setAccountType] = useState<'PERSON' | 'COMPANY'>(
    'COMPANY',
  );

  const [state, formAction, isPending] = useActionState<
    CreateCustomerState,
    FormData
  >(async (prev, formData) => {
    const res = await createCustomerAction(prev, formData);
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
        + Tambah Customer Baru
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
              maxWidth: '560px',
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
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    margin: 0,
                    color: '#f8fafc',
                  }}
                >
                  Tambah Customer Baru
                </h2>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    marginTop: '2px',
                  }}
                >
                  Akan ditautkan ke holding dan brand aktif:{' '}
                  <strong style={{ color: '#38bdf8' }}>
                    {activeBrandName}
                  </strong>
                </div>
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
                  padding: '4px 8px',
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
              {/* Account Type Selector */}
              <div style={{ marginBottom: '16px' }}>
                <label
                  className="input-label"
                  style={{ display: 'block', marginBottom: '8px' }}
                >
                  Tipe Entitas Customer
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      background:
                        accountType === 'COMPANY' ? '#0c4a6e' : '#020617',
                      border: `1px solid ${accountType === 'COMPANY' ? '#38bdf8' : '#1e293b'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.875rem',
                      color: accountType === 'COMPANY' ? '#ffffff' : '#94a3b8',
                      fontWeight: accountType === 'COMPANY' ? 600 : 400,
                    }}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      value="COMPANY"
                      checked={accountType === 'COMPANY'}
                      onChange={() => setAccountType('COMPANY')}
                      style={{ accentColor: '#38bdf8' }}
                    />
                    🏢 Perusahaan / B2B
                  </label>

                  <label
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      background:
                        accountType === 'PERSON' ? '#064e3b' : '#020617',
                      border: `1px solid ${accountType === 'PERSON' ? '#34d399' : '#1e293b'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.875rem',
                      color: accountType === 'PERSON' ? '#ffffff' : '#94a3b8',
                      fontWeight: accountType === 'PERSON' ? 600 : 400,
                    }}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      value="PERSON"
                      checked={accountType === 'PERSON'}
                      onChange={() => setAccountType('PERSON')}
                      style={{ accentColor: '#34d399' }}
                    />
                    👤 Individu / Retail
                  </label>
                </div>
              </div>

              {/* Display Name */}
              <div style={{ marginBottom: '14px' }}>
                <label className="input-label" htmlFor="displayName">
                  {accountType === 'COMPANY'
                    ? 'Nama Brand / Perusahaan'
                    : 'Nama Lengkap Customer'}{' '}
                  *
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  placeholder={
                    accountType === 'COMPANY'
                      ? 'Contoh: PT ABC atau Kopi Kenangan'
                      : 'Contoh: Rendra Pratama'
                  }
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Legal Name (if Company) */}
              {accountType === 'COMPANY' && (
                <div style={{ marginBottom: '14px' }}>
                  <label className="input-label" htmlFor="legalName">
                    Nama Badan Hukum (PT / CV)
                  </label>
                  <input
                    id="legalName"
                    name="legalName"
                    type="text"
                    placeholder="Contoh: PT ABC Kreatif Nusantara"
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              {/* Email & Phone */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '14px',
                }}
              >
                <div>
                  <label className="input-label" htmlFor="primaryEmail">
                    Email Utama
                  </label>
                  <input
                    id="primaryEmail"
                    name="primaryEmail"
                    type="email"
                    placeholder="email@domain.com"
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="input-label" htmlFor="primaryPhone">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    id="primaryPhone"
                    name="primaryPhone"
                    type="tel"
                    placeholder="08123456789"
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Tax ID */}
              {accountType === 'COMPANY' && (
                <div style={{ marginBottom: '16px' }}>
                  <label className="input-label" htmlFor="taxId">
                    NPWP Perusahaan (Opsional)
                  </label>
                  <input
                    id="taxId"
                    name="taxId"
                    type="text"
                    placeholder="01.234.567.8-012.000"
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              {/* Contact Person Details */}
              <div
                style={{
                  background: '#020617',
                  border: '1px solid #1e293b',
                  borderRadius: '6px',
                  padding: '14px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#f8fafc',
                    marginBottom: '10px',
                  }}
                >
                  👤 Kontak Person (PIC / Purchasing)
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <div>
                    <label className="input-label" htmlFor="contactName">
                      Nama PIC
                    </label>
                    <input
                      id="contactName"
                      name="contactName"
                      type="text"
                      placeholder="Budi Santoso"
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label className="input-label" htmlFor="contactPosition">
                      Posisi / Jabatan
                    </label>
                    <input
                      id="contactPosition"
                      name="contactPosition"
                      type="text"
                      placeholder="Purchasing Manager"
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                  }}
                >
                  <div>
                    <label className="input-label" htmlFor="contactEmail">
                      Email PIC
                    </label>
                    <input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      placeholder="pic@perusahaan.com"
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label className="input-label" htmlFor="contactPhone">
                      No. WhatsApp PIC
                    </label>
                    <input
                      id="contactPhone"
                      name="contactPhone"
                      type="tel"
                      placeholder="0811223344"
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
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
                  className="btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary"
                  style={{ padding: '8px 18px' }}
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
