'use client';

import { useState, useActionState, useRef } from 'react';
import type { InventoryCategory, InventoryMutationType } from '@mgbos/domain';
import {
  formatInventoryCategoryLabel,
  formatMutationTypeLabel,
  calculateAvailableStock,
} from '@mgbos/domain';
import {
  createInventoryItemAction,
  recordInventoryMutationAction,
  performStockOpnameAction,
  type InventoryActionResult,
} from './actions';

export function InventoryCategoryBadge({
  category,
}: {
  category: InventoryCategory | string;
}) {
  const label = formatInventoryCategoryLabel(category as InventoryCategory);

  let bg = '#f3f4f6';
  let color = '#374151';
  let border = '#d1d5db';

  switch (category) {
    case 'BLANK_GARMENT':
      bg = '#e0f2fe';
      color = '#0369a1';
      border = '#bae6fd';
      break;
    case 'PRINT_MATERIAL':
      bg = '#fef3c7';
      color = '#b45309';
      border = '#fde68a';
      break;
    case 'PACKAGING':
      bg = '#f3e8ff';
      color = '#7e22ce';
      border = '#e9d5ff';
      break;
    case 'FINISHED_GOOD':
      bg = '#ecfdf5';
      color = '#047857';
      border = '#a7f3d0';
      break;
    case 'OTHER':
    default:
      bg = '#f1f5f9';
      color = '#475569';
      border = '#cbd5e1';
      break;
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 9px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: bg,
        color,
        border: `1px solid ${border}`,
      }}
    >
      {label}
    </span>
  );
}

export function StockStatusBadge({
  quantityOnHand,
  quantityReserved,
  minStockAlert,
}: {
  quantityOnHand: number;
  quantityReserved: number;
  minStockAlert: number;
}) {
  const available = calculateAvailableStock(quantityOnHand, quantityReserved);

  if (quantityOnHand === 0) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          border: '1px solid #fca5a5',
        }}
      >
        HABIS (0)
      </span>
    );
  }

  if (available <= minStockAlert) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          backgroundColor: '#fffbeb',
          color: '#b45309',
          border: '1px solid #fcd34d',
        }}
      >
        MENIPIS ({available})
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: '#f0fdf4',
        color: '#15803d',
        border: '1px solid #bbf7d0',
      }}
    >
      AMAN ({available})
    </span>
  );
}

export function MutationTypeBadge({
  type,
}: {
  type: InventoryMutationType | string;
}) {
  const label = formatMutationTypeLabel(type as InventoryMutationType);

  let bg = '#f1f5f9';
  let color = '#475569';

  if (type === 'INBOUND_PURCHASE') {
    bg = '#dcfce7';
    color = '#15803d';
  } else if (type === 'RESERVATION') {
    bg = '#e0f2fe';
    color = '#0369a1';
  } else if (type === 'RELEASE_RESERVATION') {
    bg = '#fef9c3';
    color = '#854d0e';
  } else if (type === 'CONSUMED_PRODUCTION' || type === 'OUTBOUND_SHIPMENT') {
    bg = '#ede9fe';
    color = '#6d28d9';
  } else if (type === 'SCRAP_DEFECT') {
    bg = '#fee2e2';
    color = '#b91c1c';
  }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: bg,
        color,
      }}
    >
      {label}
    </span>
  );
}

export function CreateInventoryItemModal({ brandId }: { brandId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (_prev: InventoryActionResult, formData: FormData) => {
      const result = await createInventoryItemAction({
        brandId: formData.get('brandId') || brandId || undefined,
        sku: formData.get('sku'),
        name: formData.get('name'),
        category: formData.get('category'),
        unit: formData.get('unit'),
        costPrice: formData.get('costPrice'),
        minStockAlert: formData.get('minStockAlert'),
        initialStock: formData.get('initialStock'),
        locationCode: formData.get('locationCode'),
        binLocation: formData.get('binLocation'),
      });
      if (result.success) {
        setIsOpen(false);
        formRef.current?.reset();
      }
      return result;
    },
    {},
  );

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '6px',
          fontWeight: 600,
          fontSize: '0.875rem',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span>+ Tambah SKU Baru</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              maxWidth: '640px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '12px',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                Tambah Master SKU Persediaan
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            {state?.error && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #f87171',
                  borderRadius: '6px',
                  color: '#991b1b',
                  fontSize: '0.875rem',
                  marginBottom: '16px',
                }}
              >
                {state.error}
              </div>
            )}

            <form ref={formRef} action={formAction}>
              {brandId && (
                <input type="hidden" name="brandId" value={brandId} />
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Kategori Persediaan{' '}
                    <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    name="category"
                    required
                    defaultValue="BLANK_GARMENT"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                    }}
                  >
                    <option value="BLANK_GARMENT">
                      Kaos Polos (Blank Garment)
                    </option>
                    <option value="PRINT_MATERIAL">
                      Bahan Cetak (DTF / Film / Tinta)
                    </option>
                    <option value="PACKAGING">Kemasan & Packaging</option>
                    <option value="FINISHED_GOOD">
                      Barang Jadi (Finished Good)
                    </option>
                    <option value="OTHER">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Kode SKU <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="sku"
                    required
                    placeholder="mis. TS-NSA-7200-BLK-L"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Nama Barang / Deskripsi{' '}
                  <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="mis. Kaos Polos New States Apparel 7200 Black L"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Satuan
                  </label>
                  <input
                    type="text"
                    name="unit"
                    defaultValue="pcs"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Harga Pokok (HPP) Rp
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    min="0"
                    defaultValue="38000"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Alert Minimum Stok
                  </label>
                  <input
                    type="number"
                    name="minStockAlert"
                    min="0"
                    defaultValue="10"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Stok Awal Fisik
                  </label>
                  <input
                    type="number"
                    name="initialStock"
                    min="0"
                    defaultValue="0"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Kode Lokasi
                  </label>
                  <input
                    type="text"
                    name="locationCode"
                    defaultValue="MAIN_WORKSHOP"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Bin / Rak Lokasi
                  </label>
                  <input
                    type="text"
                    name="binLocation"
                    placeholder="mis. RAK-A1"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '16px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    padding: '8px 20px',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    opacity: isPending ? 0.7 : 1,
                  }}
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Master SKU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdjustStockModal({
  inventoryItemId,
  sku,
  name,
}: {
  inventoryItemId: string;
  sku: string;
  name: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (_prev: InventoryActionResult, formData: FormData) => {
      const result = await recordInventoryMutationAction({
        inventoryItemId,
        mutationType: formData.get('mutationType'),
        quantity: formData.get('quantity'),
        locationCode: formData.get('locationCode') || 'MAIN_WORKSHOP',
        notes: formData.get('notes'),
      });
      if (result.success) {
        setIsOpen(false);
        formRef.current?.reset();
      }
      return result;
    },
    {},
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          padding: '6px 12px',
          backgroundColor: '#0284c7',
          color: '#ffffff',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        + Mutasi Masuk / Keluar
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '12px',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
                  Catat Mutasi Stok
                </h3>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '0.8rem',
                    color: '#64748b',
                  }}
                >
                  SKU: {sku} - {name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            {state?.error && (
              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #f87171',
                  borderRadius: '6px',
                  color: '#991b1b',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                }}
              >
                {state.error}
              </div>
            )}

            <form ref={formRef} action={formAction}>
              <div style={{ marginBottom: '14px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Tipe Mutasi
                </label>
                <select
                  name="mutationType"
                  required
                  defaultValue="INBOUND_PURCHASE"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="INBOUND_PURCHASE">
                    Penerimaan Pembelian / Inbound Restock (+)
                  </option>
                  <option value="SCRAP_DEFECT">
                    Afkir Rusak / Cacat Tekstil (-)
                  </option>
                  <option value="OUTBOUND_SHIPMENT">
                    Pengeluaran Kirim Manual (-)
                  </option>
                </select>
              </div>

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
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Jumlah Fisik
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    required
                    placeholder="mis. 50"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Lokasi Workshop
                  </label>
                  <input
                    type="text"
                    name="locationCode"
                    defaultValue="MAIN_WORKSHOP"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Catatan / Keterangan
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="mis. Nomor DO vendor / alasan barang rusak..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '14px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    padding: '8px 18px',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: isPending ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isPending ? 'Mencatat...' : 'Simpan Mutasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function StockOpnameModal({
  inventoryItemId,
  sku,
  name,
  currentOnHand,
}: {
  inventoryItemId: string;
  sku: string;
  name: string;
  currentOnHand: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (_prev: InventoryActionResult, formData: FormData) => {
      const result = await performStockOpnameAction({
        inventoryItemId,
        actualPhysicalCount: formData.get('actualPhysicalCount'),
        locationCode: formData.get('locationCode') || 'MAIN_WORKSHOP',
        reason: formData.get('reason'),
      });
      if (result.success) {
        setIsOpen(false);
        formRef.current?.reset();
      }
      return result;
    },
    {},
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          padding: '6px 12px',
          backgroundColor: '#475569',
          color: '#ffffff',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Opname Fisik
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '12px',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
                  Stock Opname Fisik
                </h3>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '0.8rem',
                    color: '#64748b',
                  }}
                >
                  SKU: {sku} - {name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                padding: '10px',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem',
                marginBottom: '16px',
              }}
            >
              Stok sistem saat ini: <strong>{currentOnHand}</strong> unit
              on-hand.
            </div>

            {state?.error && (
              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #f87171',
                  borderRadius: '6px',
                  color: '#991b1b',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                }}
              >
                {state.error}
              </div>
            )}

            <form ref={formRef} action={formAction}>
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
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Hasil Hitung Fisik Riil
                  </label>
                  <input
                    type="number"
                    name="actualPhysicalCount"
                    min="0"
                    defaultValue={currentOnHand}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Lokasi Workshop
                  </label>
                  <input
                    type="text"
                    name="locationCode"
                    defaultValue="MAIN_WORKSHOP"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Alasan Penyesuaian (Wajib){' '}
                  <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  name="reason"
                  rows={2}
                  required
                  placeholder="mis. Audit berkala mingguan: selisih 2 pcs rusak saat proses press"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '14px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    padding: '8px 18px',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: isPending ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isPending ? 'Memperbarui...' : 'Simpan Opname'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
