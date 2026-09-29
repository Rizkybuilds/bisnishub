'use client';

import { useState, useActionState, useRef } from 'react';
import type { PurchaseOrderStatus, VendorBillStatus } from '@mgbos/domain';
import {
  formatPurchaseOrderStatusLabel,
  formatVendorBillStatusLabel,
} from '@mgbos/domain';
import {
  createPurchaseOrderAction,
  receivePurchaseOrderAction,
  payVendorBillAction,
  type ProcurementActionResult,
} from './actions';

export function PurchaseOrderStatusBadge({
  status,
}: {
  status: PurchaseOrderStatus | string;
}) {
  const label = formatPurchaseOrderStatusLabel(status as PurchaseOrderStatus);

  let bg = '#f1f5f9';
  let color = '#475569';
  let border = '#cbd5e1';

  switch (status) {
    case 'ORDERED':
      bg = '#e0f2fe';
      color = '#0369a1';
      border = '#bae6fd';
      break;
    case 'PARTIALLY_RECEIVED':
      bg = '#fef3c7';
      color = '#b45309';
      border = '#fde68a';
      break;
    case 'RECEIVED':
      bg = '#dcfce7';
      color = '#15803d';
      border = '#bbf7d0';
      break;
    case 'CANCELLED':
      bg = '#fee2e2';
      color = '#b91c1c';
      border = '#fca5a5';
      break;
    case 'DRAFT':
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

export function VendorBillStatusBadge({
  status,
}: {
  status: VendorBillStatus | string;
}) {
  const label = formatVendorBillStatusLabel(status as VendorBillStatus);

  let bg = '#f1f5f9';
  let color = '#475569';
  let border = '#cbd5e1';

  switch (status) {
    case 'OPEN':
      bg = '#fee2e2';
      color = '#b91c1c';
      border = '#fca5a5';
      break;
    case 'PARTIALLY_PAID':
      bg = '#fef3c7';
      color = '#b45309';
      border = '#fde68a';
      break;
    case 'PAID':
      bg = '#dcfce7';
      color = '#15803d';
      border = '#bbf7d0';
      break;
    case 'VOID':
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

export interface VendorOption {
  id: string;
  name: string;
  code: string;
}

export interface InventoryItemOption {
  id: string;
  sku: string;
  name: string;
  unit: string;
  costPrice: string;
}

export function CreatePurchaseOrderModal({
  brandId,
  vendors,
  inventoryItems,
}: {
  brandId?: string;
  vendors: VendorOption[];
  inventoryItems: InventoryItemOption[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(
    vendors[0]?.id || '',
  );
  const [selectedItemId, setSelectedItemId] = useState(
    inventoryItems[0]?.id || '',
  );
  const [quantity, setQuantity] = useState('50');
  const [unitCost, setUnitCost] = useState(
    inventoryItems[0]?.costPrice || '38000',
  );
  const [shippingCost, setShippingCost] = useState('0');
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (_prev: ProcurementActionResult, formData: FormData) => {
      const result = await createPurchaseOrderAction({
        brandId: formData.get('brandId') || brandId || undefined,
        vendorId: formData.get('vendorId'),
        items: [
          {
            inventoryItemId: formData.get('inventoryItemId'),
            quantity: Number(formData.get('quantity')),
            unitCost: formData.get('unitCost'),
            notes: formData.get('itemNotes'),
          },
        ],
        shippingCost: formData.get('shippingCost') || '0',
        expectedDeliveryDate: formData.get('expectedDeliveryDate') || undefined,
        paymentTerms: formData.get('paymentTerms') || 'COD',
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

  const handleItemChange = (itemId: string) => {
    setSelectedItemId(itemId);
    const item = inventoryItems.find((i) => i.id === itemId);
    if (item) {
      setUnitCost(item.costPrice);
    }
  };

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
        <span>+ Buat Purchase Order (PO)</span>
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
              maxWidth: '600px',
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
                Terbitkan Purchase Order (PO) Pengadaan
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

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Vendor / Supplier <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="vendorId"
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                  }}
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.code})
                    </option>
                  ))}
                </select>
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
                  Bahan Baku / SKU Yang Dipesan{' '}
                  <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  name="inventoryItemId"
                  value={selectedItemId}
                  onChange={(e) => handleItemChange(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                  }}
                >
                  {inventoryItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.sku} — {item.name} ({item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
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
                    Kuantiti Pesanan
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
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
                    Harga Satuan Beli (HPP) Rp
                  </label>
                  <input
                    type="number"
                    name="unitCost"
                    min="0"
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
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
                  gridTemplateColumns: '1fr 1fr',
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
                    Ongkir Ekspedisi Pengadaan Rp
                  </label>
                  <input
                    type="number"
                    name="shippingCost"
                    min="0"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(e.target.value)}
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
                    Estimasi Tiba (Lead Time)
                  </label>
                  <input
                    type="date"
                    name="expectedDeliveryDate"
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

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Catatan / Instruksi Khusus
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="mis. Pengiriman via ekspedisi J&T Cargo / warna navy pekat..."
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
                  }}
                >
                  {isPending ? 'Menerbitkan...' : 'Terbitkan PO Resmi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function ReceiveGoodsReceiptModal({
  purchaseOrderId,
  poNumber,
  poItemId,
  itemName,
  sku,
  remainingQuantity,
}: {
  purchaseOrderId: string;
  poNumber: string;
  poItemId: string;
  itemName: string;
  sku: string;
  remainingQuantity: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (_prev: ProcurementActionResult, formData: FormData) => {
      const result = await receivePurchaseOrderAction({
        purchaseOrderId,
        items: [
          {
            purchaseOrderItemId: poItemId,
            quantityAccepted: Number(formData.get('quantityAccepted')),
            quantityRejected: Number(formData.get('quantityRejected') || 0),
            rejectionReason: formData.get('rejectionReason'),
          },
        ],
        vendorDeliveryNote: formData.get('vendorDeliveryNote'),
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
          backgroundColor: '#15803d',
          color: '#ffffff',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        + Terima Barang (GR)
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
              maxWidth: '520px',
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
                  Penerimaan Barang Gudang (Goods Receipt)
                </h3>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '0.8rem',
                    color: '#64748b',
                  }}
                >
                  PO: {poNumber} · SKU: {sku} ({itemName})
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
              Sisa kuota pesanan yang belum diterima:{' '}
              <strong>{remainingQuantity}</strong> unit.
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
                    Jumlah Diterima Baik (Lolos)
                  </label>
                  <input
                    type="number"
                    name="quantityAccepted"
                    min="1"
                    max={remainingQuantity}
                    defaultValue={remainingQuantity}
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
                    Jumlah Cacat / Ditolak (Afkir)
                  </label>
                  <input
                    type="number"
                    name="quantityRejected"
                    min="0"
                    defaultValue="0"
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
                    No. Surat Jalan Vendor
                  </label>
                  <input
                    type="text"
                    name="vendorDeliveryNote"
                    placeholder="mis. SJ-NSA-1002"
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
                  Catatan Penerimaan Gudang
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Kondisi kemasan utuh, segel rapi..."
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
                    backgroundColor: '#15803d',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: isPending ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Bukti Penerimaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function PayVendorBillModal({
  vendorBillId,
  billNumber,
  vendorName,
  balanceDue,
}: {
  vendorBillId: string;
  billNumber: string;
  vendorName: string;
  balanceDue: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (_prev: ProcurementActionResult, formData: FormData) => {
      const result = await payVendorBillAction({
        vendorBillId,
        amount: formData.get('amount'),
        paymentMethod: formData.get('paymentMethod') || 'BANK_TRANSFER',
        sourceBank: formData.get('sourceBank'),
        referenceNumber: formData.get('referenceNumber'),
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
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Bayar Tagihan (Kas Keluar)
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
                  Pembayaran Tagihan Vendor (Kas Keluar)
                </h3>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '0.8rem',
                    color: '#64748b',
                  }}
                >
                  Tagihan: {billNumber} · Vendor: {vendorName}
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
                backgroundColor: '#fffbeb',
                borderRadius: '6px',
                border: '1px solid #fde68a',
                fontSize: '0.85rem',
                color: '#92400e',
                marginBottom: '16px',
              }}
            >
              Sisa tagihan yang harus dibayar:{' '}
              <strong>Rp {balanceDue.toLocaleString('id-ID')}</strong>.
              <br />
              <span style={{ fontSize: '0.75rem' }}>
                Pembayaran ini akan otomatis dibukukan ke Financial Ledger
                sebagai Kas Keluar (CREDIT).
              </span>
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
                  Nominal Dibayar Rp <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  min="1"
                  max={balanceDue}
                  defaultValue={balanceDue}
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
                    Metode Bayar
                  </label>
                  <select
                    name="paymentMethod"
                    defaultValue="BANK_TRANSFER"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                    }}
                  >
                    <option value="BANK_TRANSFER">Transfer Bank</option>
                    <option value="QRIS">QRIS Kas Holding</option>
                    <option value="CASH">Tunai / COD</option>
                  </select>
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
                    Bank Sumber Kas
                  </label>
                  <input
                    type="text"
                    name="sourceBank"
                    defaultValue="BCA"
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
                  Catatan Pembayaran
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="mis. Bukti transfer m-banking #882201"
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
                  {isPending ? 'Membukukan...' : 'Konfirmasi Kas Keluar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
