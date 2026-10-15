'use client';

import { useState } from 'react';

export interface CustomerData {
  id: string;
  account_type: 'PERSON' | 'COMPANY';
  display_name: string;
  legal_name: string | null;
  primary_email: string | null;
  primary_phone: string | null;
  tax_id: string | null;
  status: string;
  customer_since: string;
  customer_contacts: Array<{
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    position: string | null;
    is_primary: boolean;
  }>;
  customer_brand_relationships: Array<{
    id: string;
    brand_id: string;
    customer_segment: string;
    relationship_status: string;
    brands?: {
      id: string;
      code: string;
      name: string;
    } | null;
  }>;
}

export type CustomerListTableDataState =
  | { status: 'SUCCESS'; data: CustomerData[] }
  | { status: 'UNAVAILABLE'; message: string };

export interface CustomerFilterOptions {
  search: string;
  typeFilter: 'ALL' | 'COMPANY' | 'PERSON';
  brandFilter: 'ALL' | 'ACTIVE';
  activeBrandCode: string;
}

export function filterCustomers(
  customers: CustomerData[],
  { search, typeFilter, brandFilter, activeBrandCode }: CustomerFilterOptions,
): CustomerData[] {
  return customers.filter((cust) => {
    // Type filter
    if (typeFilter !== 'ALL' && cust.account_type !== typeFilter) {
      return false;
    }

    // Brand filter
    if (brandFilter === 'ACTIVE') {
      const hasBrand = cust.customer_brand_relationships?.some(
        (rel) => rel && rel.brands?.code === activeBrandCode,
      );
      if (!hasBrand) return false;
    }

    // Search filter
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const matchName = cust.display_name?.toLowerCase().includes(q) ?? false;
    const matchLegal = cust.legal_name?.toLowerCase().includes(q) ?? false;
    const matchEmail = cust.primary_email?.toLowerCase().includes(q) ?? false;
    const matchPhone = cust.primary_phone?.toLowerCase().includes(q) ?? false;
    const matchContact =
      cust.customer_contacts?.some(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          (c.position?.toLowerCase().includes(q) ?? false) ||
          (c.email?.toLowerCase().includes(q) ?? false),
      ) ?? false;

    return matchName || matchLegal || matchEmail || matchPhone || matchContact;
  });
}

export function CustomerListTable({
  dataState,
  customers,
  activeBrandCode,
}: {
  dataState?: CustomerListTableDataState;
  customers?: CustomerData[];
  activeBrandCode: string;
}) {
  const resolvedState: CustomerListTableDataState = dataState ?? {
    status: 'SUCCESS',
    data: customers ?? [],
  };
  const allCustomers =
    resolvedState.status === 'SUCCESS' ? resolvedState.data : [];

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'COMPANY' | 'PERSON'>(
    'ALL',
  );
  const [brandFilter, setBrandFilter] = useState<'ALL' | 'ACTIVE'>('ALL');

  const filtered = filterCustomers(allCustomers, {
    search,
    typeFilter,
    brandFilter,
    activeBrandCode,
  });

  const handleResetFilters = () => {
    setSearch('');
    setTypeFilter('ALL');
    setBrandFilter('ALL');
  };

  return (
    <div>
      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div
          style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '260px' }}
        >
          <input
            type="text"
            placeholder="Cari customer, nama legal, kontak PIC, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={resolvedState.status === 'UNAVAILABLE'}
            className="input-field"
            style={{
              width: '100%',
              opacity: resolvedState.status === 'UNAVAILABLE' ? 0.6 : 1,
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Account Type Toggle */}
          <div
            style={{
              display: 'flex',
              background: '#020617',
              padding: '3px',
              borderRadius: '6px',
              border: '1px solid #1e293b',
            }}
          >
            <button
              onClick={() => setTypeFilter('ALL')}
              disabled={resolvedState.status === 'UNAVAILABLE'}
              style={{
                background: typeFilter === 'ALL' ? '#1e293b' : 'transparent',
                color: typeFilter === 'ALL' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor:
                  resolvedState.status === 'UNAVAILABLE'
                    ? 'not-allowed'
                    : 'pointer',
                opacity: resolvedState.status === 'UNAVAILABLE' ? 0.6 : 1,
              }}
            >
              Semua (
              {resolvedState.status === 'SUCCESS' ? allCustomers.length : '—'})
            </button>
            <button
              onClick={() => setTypeFilter('COMPANY')}
              disabled={resolvedState.status === 'UNAVAILABLE'}
              style={{
                background:
                  typeFilter === 'COMPANY' ? '#0c4a6e' : 'transparent',
                color: typeFilter === 'COMPANY' ? '#38bdf8' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor:
                  resolvedState.status === 'UNAVAILABLE'
                    ? 'not-allowed'
                    : 'pointer',
                opacity: resolvedState.status === 'UNAVAILABLE' ? 0.6 : 1,
              }}
            >
              🏢 Perusahaan
            </button>
            <button
              onClick={() => setTypeFilter('PERSON')}
              disabled={resolvedState.status === 'UNAVAILABLE'}
              style={{
                background: typeFilter === 'PERSON' ? '#064e3b' : 'transparent',
                color: typeFilter === 'PERSON' ? '#34d399' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor:
                  resolvedState.status === 'UNAVAILABLE'
                    ? 'not-allowed'
                    : 'pointer',
                opacity: resolvedState.status === 'UNAVAILABLE' ? 0.6 : 1,
              }}
            >
              👤 Retail / Person
            </button>
          </div>

          {/* Brand Scope Toggle */}
          <div
            style={{
              display: 'flex',
              background: '#020617',
              padding: '3px',
              borderRadius: '6px',
              border: '1px solid #1e293b',
            }}
          >
            <button
              onClick={() => setBrandFilter('ALL')}
              disabled={resolvedState.status === 'UNAVAILABLE'}
              style={{
                background: brandFilter === 'ALL' ? '#1e293b' : 'transparent',
                color: brandFilter === 'ALL' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor:
                  resolvedState.status === 'UNAVAILABLE'
                    ? 'not-allowed'
                    : 'pointer',
                opacity: resolvedState.status === 'UNAVAILABLE' ? 0.6 : 1,
              }}
            >
              Semua Brand
            </button>
            <button
              onClick={() => setBrandFilter('ACTIVE')}
              disabled={resolvedState.status === 'UNAVAILABLE'}
              style={{
                background:
                  brandFilter === 'ACTIVE' ? '#0284c7' : 'transparent',
                color: brandFilter === 'ACTIVE' ? '#ffffff' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                cursor:
                  resolvedState.status === 'UNAVAILABLE'
                    ? 'not-allowed'
                    : 'pointer',
                fontWeight: brandFilter === 'ACTIVE' ? 600 : 400,
                opacity: resolvedState.status === 'UNAVAILABLE' ? 0.6 : 1,
              }}
            >
              {activeBrandCode} Only
            </button>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Tipe</th>
              <th>Kontak Utama / PIC</th>
              <th>Relasi Brand Holding</th>
              <th>Email &amp; Telepon</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {resolvedState.status === 'UNAVAILABLE' ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: 'center',
                    padding: '40px 16px',
                    color: '#94a3b8',
                  }}
                >
                  <div
                    style={{
                      color: '#f87171',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      marginBottom: '4px',
                    }}
                  >
                    Data Customer Tidak Dapat Dimuat
                  </div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: '#94a3b8',
                      marginBottom: '16px',
                    }}
                  >
                    {resolvedState.message}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.location.reload();
                      }
                    }}
                    style={{
                      background: '#0284c7',
                      border: '1px solid #38bdf8',
                      color: '#f8fafc',
                      padding: '6px 14px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Muat Ulang
                  </button>
                </td>
              </tr>
            ) : allCustomers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: 'center',
                    padding: '40px 16px',
                    color: '#94a3b8',
                  }}
                >
                  <div
                    style={{
                      color: '#e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      marginBottom: '4px',
                    }}
                  >
                    Belum ada customer yang terdaftar.
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Gunakan tombol pendaftaran customer untuk menambahkan
                    entitas holding atau kontak retail.
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: 'center',
                    padding: '40px 16px',
                    color: '#94a3b8',
                  }}
                >
                  <div
                    style={{
                      color: '#e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      marginBottom: '4px',
                    }}
                  >
                    Tidak ada customer yang sesuai dengan filter pencarian saat
                    ini.
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#64748b',
                      marginBottom: '14px',
                    }}
                  >
                    Coba ubah kata kunci pencarian atau sesuaikan pilihan tipe
                    akun/brand.
                  </div>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      color: '#38bdf8',
                      padding: '6px 14px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Reset Filter
                  </button>
                </td>
              </tr>
            ) : (
              filtered.map((cust) => {
                const primaryContact =
                  cust.customer_contacts?.find((c) => c && c.is_primary) ??
                  cust.customer_contacts?.[0];
                const otherContactsCount =
                  (cust.customer_contacts?.length ?? 0) > 1
                    ? cust.customer_contacts.length - 1
                    : 0;

                return (
                  <tr key={cust.id}>
                    <td>
                      <div
                        style={{
                          fontWeight: 700,
                          color: '#f8fafc',
                          fontSize: '0.95rem',
                        }}
                      >
                        {cust.display_name}
                      </div>
                      {cust.legal_name && (
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: '#94a3b8',
                            marginTop: '2px',
                          }}
                        >
                          {cust.legal_name}
                        </div>
                      )}
                      {cust.tax_id && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            marginTop: '2px',
                            fontFamily: 'monospace',
                          }}
                        >
                          NPWP: {cust.tax_id}
                        </div>
                      )}
                    </td>

                    <td>
                      {cust.account_type === 'COMPANY' ? (
                        <span
                          style={{
                            background: '#0c4a6e',
                            color: '#38bdf8',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          🏢 COMPANY
                        </span>
                      ) : (
                        <span
                          style={{
                            background: '#064e3b',
                            color: '#34d399',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          👤 PERSON
                        </span>
                      )}
                    </td>

                    <td>
                      {primaryContact ? (
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: '#e2e8f0',
                              fontSize: '0.875rem',
                            }}
                          >
                            {primaryContact.name}
                          </div>
                          {primaryContact.position && (
                            <div
                              style={{ fontSize: '0.8rem', color: '#94a3b8' }}
                            >
                              {primaryContact.position}
                            </div>
                          )}
                          {otherContactsCount > 0 && (
                            <div
                              style={{
                                fontSize: '0.7rem',
                                color: '#38bdf8',
                                marginTop: '3px',
                                display: 'inline-block',
                              }}
                            >
                              +{otherContactsCount} kontak lainnya
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                          —
                        </span>
                      )}
                    </td>

                    <td>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                        }}
                      >
                        {cust.customer_brand_relationships?.map((rel) => {
                          const isCurrentActive =
                            rel.brands?.code === activeBrandCode;
                          return (
                            <div
                              key={rel.id}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: isCurrentActive
                                  ? '#0284c7'
                                  : '#1e293b',
                                color: isCurrentActive ? '#ffffff' : '#cbd5e1',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              <span>{rel.brands?.code ?? 'BRAND'}</span>
                              <span
                                style={{ opacity: 0.7, fontSize: '0.7rem' }}
                              >
                                ({rel.customer_segment})
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                        {cust.primary_email || '—'}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: '#94a3b8',
                          marginTop: '2px',
                        }}
                      >
                        {cust.primary_phone || '—'}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          background:
                            cust.status === 'ACTIVE' ? '#052e16' : '#1e293b',
                          color:
                            cust.status === 'ACTIVE' ? '#4ade80' : '#94a3b8',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {cust.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
