'use client';

import { useState, useActionState, useRef, useEffect } from 'react';
import {
  COURIER_LABELS,
  COURIER_NAMES,
  CourierName,
  SHIPMENT_STATUS_LABELS,
  ShipmentStatus,
} from '@mgbos/domain';
import {
  createDeliveryOrderAction,
  dispatchShipmentAction,
  markShipmentDeliveredAction,
  cancelShipmentAction,
  ShipmentActionResult,
} from './actions';
import { ShipmentRow } from './data';

export function ShipmentStatusBadge({
  status,
}: {
  status: ShipmentStatus | string;
}) {
  const label = SHIPMENT_STATUS_LABELS[status as ShipmentStatus] ?? status;

  let bg = '#f3f4f6';
  let color = '#374151';
  let border = '#d1d5db';

  switch (status) {
    case 'DRAFT':
      bg = '#f3f4f6';
      color = '#4b5563';
      border = '#d1d5db';
      break;
    case 'READY_TO_DISPATCH':
      bg = '#eff6ff';
      color = '#1d4ed8';
      border = '#bfdbfe';
      break;
    case 'DISPATCHED':
      bg = '#fef3c7';
      color = '#b45309';
      border = '#fde68a';
      break;
    case 'IN_TRANSIT':
      bg = '#e0e7ff';
      color = '#4338ca';
      border = '#c7d2fe';
      break;
    case 'DELIVERED':
      bg = '#ecfdf5';
      color = '#047857';
      border = '#a7f3d0';
      break;
    case 'CANCELLED':
    case 'FAILED':
      bg = '#fef2f2';
      color = '#b91c1c';
      border = '#fecaca';
      break;
    case 'RETURNED':
      bg = '#faf5ff';
      color = '#7e22ce';
      border = '#e9d5ff';
      break;
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '0.8rem',
        fontWeight: 600,
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
      }}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
      {label}
    </span>
  );
}

export interface OrderItemForShipment {
  id: string;
  description: string;
  quantity: number;
  previouslyShipped: number;
}

export function CreateShipmentModal({
  orderId,
  orderNumber,
  items,
  defaultCourier = 'JNT',
  defaultService = 'REGULER',
}: {
  orderId: string;
  orderNumber: string;
  items: OrderItemForShipment[];
  defaultCourier?: string;
  defaultService?: string;
}) {
  const [open, setOpen] = useState(false);
  const [courierName, setCourierName] = useState<string>(defaultCourier);
  const [courierService, setCourierService] = useState<string>(defaultService);
  const [packageCount, setPackageCount] = useState<number>(1);
  const [packageWeight, setPackageWeight] = useState<string>('1000');
  const [notes, setNotes] = useState<string>('');

  // Item quantities map: orderItemId -> quantity to ship
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(
    () => {
      const initial: Record<string, number> = {};
      for (const item of items) {
        const remaining = Math.max(0, item.quantity - item.previouslyShipped);
        initial[item.id] = remaining; // default to remaining
      }
      return initial;
    },
  );

  const totalQtyToShip = Object.values(itemQuantities).reduce(
    (a, b) => a + (Number(b) || 0),
    0,
  );

  const [state, formAction, pending] = useActionState(
    async (): Promise<ShipmentActionResult> => {
      const selectedItems = items
        .filter((item) => (itemQuantities[item.id] ?? 0) > 0)
        .map((item) => ({
          orderItemId: item.id,
          quantity: itemQuantities[item.id] ?? 0,
        }));

      if (selectedItems.length === 0) {
        return { error: 'Pilih minimal 1 item untuk dikirim (jumlah > 0).' };
      }

      // Check ceiling
      for (const item of items) {
        const qty = itemQuantities[item.id] ?? 0;
        const remaining = item.quantity - item.previouslyShipped;
        if (qty > remaining) {
          return {
            error: `Kuantitas kirim untuk "${item.description}" (${qty} pcs) melebihi sisa kuota (${remaining} pcs).`,
          };
        }
      }

      const res = await createDeliveryOrderAction({
        orderId,
        courierName,
        courierService: courierService || undefined,
        items: selectedItems,
        packageWeightGrams: packageWeight
          ? parseInt(packageWeight, 10)
          : undefined,
        packageCount: packageCount || 1,
        notes: notes || undefined,
      });

      if (res.success) {
        setOpen(false);
      }
      return res;
    },
    {},
  );

  const errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (state.error) errorRef.current?.focus();
  }, [state]);

  const allFulfilled = items.every((i) => i.previouslyShipped >= i.quantity);

  if (allFulfilled) {
    return (
      <div
        style={{
          padding: '8px 14px',
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '6px',
          color: '#065f46',
          fontSize: '0.85rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>✅</span>
        <strong>
          Semua Item Pesanan Sudah Lengkap Dikirim (100% Fulfilled)
        </strong>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="btn-primary"
        style={{ padding: '8px 16px', fontSize: '0.9rem' }}
      >
        {open ? 'Tutup Formulir Surat Jalan' : '📦 Buat Surat Jalan (DO)'}
      </button>

      {open && (
        <form
          action={formAction}
          className="requirement-form"
          style={{
            marginTop: '16px',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
              Formulir Pembuatan Surat Jalan (Delivery Order)
            </h3>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '0.85rem',
                color: '#6b7280',
              }}
            >
              Pesanan: <strong>{orderNumber}</strong>. Alokasikan jumlah barang
              yang akan disiapkan untuk pengiriman ini.
            </p>
          </div>

          {state.error && (
            <p
              ref={errorRef}
              tabIndex={-1}
              style={{
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                border: '1px solid #fecaca',
                marginBottom: '16px',
              }}
            >
              ⚠️ {state.error}
            </p>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                Ekspedisi / Kurir *
              </label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                }}
              >
                {COURIER_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {COURIER_LABELS[name as CourierName] ?? name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                Layanan Kurir (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: REG, Cargo, Instant, NextDay"
                value={courierService}
                onChange={(e) => setCourierService(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                Jumlah Koli / Kardus *
              </label>
              <input
                type="number"
                min="1"
                value={packageCount}
                onChange={(e) =>
                  setPackageCount(parseInt(e.target.value, 10) || 1)
                }
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                Estimasi Berat Total (Gram)
              </label>
              <input
                type="number"
                min="1"
                placeholder="1000 (= 1 kg)"
                value={packageWeight}
                onChange={(e) => setPackageWeight(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              Alokasi Item Pengiriman
            </label>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.875rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', textAlign: 'left' }}>
                  <th
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    Deskripsi Item
                  </th>
                  <th
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid #e5e7eb',
                      width: '90px',
                      textAlign: 'center',
                    }}
                  >
                    Dipesan
                  </th>
                  <th
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid #e5e7eb',
                      width: '100px',
                      textAlign: 'center',
                    }}
                  >
                    Terkirim
                  </th>
                  <th
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid #e5e7eb',
                      width: '90px',
                      textAlign: 'center',
                    }}
                  >
                    Sisa
                  </th>
                  <th
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid #e5e7eb',
                      width: '140px',
                      textAlign: 'right',
                    }}
                  >
                    Kirim Sekarang
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const remaining = Math.max(
                    0,
                    item.quantity - item.previouslyShipped,
                  );
                  const currentQty = itemQuantities[item.id] ?? 0;
                  const isExceeded = currentQty > remaining;

                  return (
                    <tr
                      key={item.id}
                      style={{ borderBottom: '1px solid #f3f4f6' }}
                    >
                      <td style={{ padding: '10px 12px' }}>
                        <strong>{item.description}</strong>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        {item.quantity} pcs
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          textAlign: 'center',
                          color: '#6b7280',
                        }}
                      >
                        {item.previouslyShipped} pcs
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          textAlign: 'center',
                          fontWeight: 600,
                          color: remaining === 0 ? '#9ca3af' : '#1d4ed8',
                        }}
                      >
                        {remaining} pcs
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        <input
                          type="number"
                          min="0"
                          max={remaining}
                          disabled={remaining === 0}
                          value={currentQty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setItemQuantities((prev) => ({
                              ...prev,
                              [item.id]: val,
                            }));
                          }}
                          style={{
                            width: '90px',
                            padding: '6px 8px',
                            textAlign: 'right',
                            borderRadius: '4px',
                            border: isExceeded
                              ? '2px solid #ef4444'
                              : '1px solid #d1d5db',
                            backgroundColor:
                              remaining === 0 ? '#f3f4f6' : '#ffffff',
                          }}
                        />
                        {isExceeded && (
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: '#dc2626',
                              marginTop: '2px',
                            }}
                          >
                            Maks {remaining}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#f9fafb', fontWeight: 600 }}>
                  <td
                    colSpan={4}
                    style={{ padding: '10px 12px', textAlign: 'right' }}
                  >
                    Total Item yang Dikirim:
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      textAlign: 'right',
                      color: '#1d4ed8',
                    }}
                  >
                    {totalQtyToShip} pcs
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '6px',
              }}
            >
              Catatan Pengiriman (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Instruksi penanganan, nomor kontak penerima tambahan, atau keterangan gudang..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-secondary"
              style={{ padding: '8px 16px' }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={pending || totalQtyToShip <= 0}
              className="btn-primary"
              style={{ padding: '8px 20px' }}
            >
              {pending
                ? 'Membuat Dokumen DO...'
                : `Konfirmasi Buat DO (${totalQtyToShip} pcs)`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function DispatchShipmentModal({
  shipmentId,
  shipmentNumber,
  courierName,
  defaultShippingCost = '0',
}: {
  shipmentId: string;
  shipmentNumber: string;
  courierName: string;
  defaultShippingCost?: string | number;
}) {
  const [open, setOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [actualCost, setActualCost] = useState(defaultShippingCost.toString());
  const [notes, setNotes] = useState('');

  const isInternal =
    courierName.includes('INTERNAL') || courierName.includes('PICKUP');

  const [state, formAction, pending] = useActionState(
    async (): Promise<ShipmentActionResult> => {
      const res = await dispatchShipmentAction({
        shipmentId,
        trackingNumber: trackingNumber || undefined,
        actualShippingCost: actualCost ? BigInt(actualCost) : undefined,
        notes: notes || undefined,
      });

      if (res.success) {
        setOpen(false);
      }
      return res;
    },
    {},
  );

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="btn-primary"
        style={{
          padding: '6px 14px',
          fontSize: '0.85rem',
          backgroundColor: '#d97706',
          borderColor: '#b45309',
        }}
      >
        {open ? 'Tutup' : '🚀 Serahkan ke Kurir (Dispatch)'}
      </button>

      {open && (
        <form
          action={formAction}
          style={{
            marginTop: '12px',
            padding: '16px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <h4
              style={{
                margin: 0,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#92400e',
              }}
            >
              Serah Terima Dokumen {shipmentNumber}
            </h4>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '0.8rem',
                color: '#b45309',
              }}
            >
              Kurir: <strong>{courierName}</strong>. Masukkan nomor resi dan
              ongkir riil jika dibayarkan langsung.
            </p>
          </div>

          {state.error && (
            <p
              style={{
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                border: '1px solid #fecaca',
                marginBottom: '12px',
              }}
            >
              ⚠️ {state.error}
            </p>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '4px',
                color: '#78350f',
              }}
            >
              Nomor Resi / AWB {!isInternal && '*'}
            </label>
            <input
              type="text"
              required={!isInternal}
              placeholder={
                isInternal
                  ? 'Opsional untuk kurir internal/pickup'
                  : 'Contoh: JP1234567890'
              }
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '4px',
                color: '#78350f',
              }}
            >
              Biaya Ongkir Riil Dibayarkan (Rupiah)
            </label>
            <input
              type="number"
              min="0"
              placeholder="0 jika cash on delivery atau ditagihkan bulanan"
              value={actualCost}
              onChange={(e) => setActualCost(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.9rem',
              }}
            />
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '0.75rem',
                color: '#92400e',
              }}
            >
              💡 Catatan Keuangan: Jika diisi &gt; 0, otomatis dicatat di Buku
              Kas sebagai pengeluaran titipan kurir (Pass-through
              reimbursement).
            </p>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '4px',
                color: '#78350f',
              }}
            >
              Catatan Serah Terima (Opsional)
            </label>
            <input
              type="text"
              placeholder="Nama kurir penjemput, plat nomor, dll."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={pending}
              className="btn-primary"
              style={{
                padding: '6px 14px',
                fontSize: '0.85rem',
                backgroundColor: '#b45309',
                borderColor: '#92400e',
              }}
            >
              {pending ? 'Memproses...' : 'Konfirmasi Dispatch'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function MarkDeliveredModal({
  shipmentId,
  shipmentNumber,
}: {
  shipmentId: string;
  shipmentNumber: string;
}) {
  const [open, setOpen] = useState(false);
  const [receivedBy, setReceivedBy] = useState('');
  const [notes, setNotes] = useState('');

  const [state, formAction, pending] = useActionState(
    async (): Promise<ShipmentActionResult> => {
      const res = await markShipmentDeliveredAction({
        shipmentId,
        receivedBy: receivedBy || undefined,
        notes: notes || undefined,
      });

      if (res.success) {
        setOpen(false);
      }
      return res;
    },
    {},
  );

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="btn-primary"
        style={{
          padding: '6px 14px',
          fontSize: '0.85rem',
          backgroundColor: '#059669',
          borderColor: '#047857',
        }}
      >
        {open ? 'Tutup' : '✅ Konfirmasi Diterima (Delivered)'}
      </button>

      {open && (
        <form
          action={formAction}
          style={{
            marginTop: '12px',
            padding: '16px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <h4
              style={{
                margin: 0,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#065f46',
              }}
            >
              Konfirmasi Selesai / Terkirim ({shipmentNumber})
            </h4>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '0.8rem',
                color: '#047857',
              }}
            >
              ⚠️ Status DELIVERED bersifat <strong>permanen & immutable</strong>{' '}
              (dokumen tidak dapat lagi diedit atau dihapus).
            </p>
          </div>

          {state.error && (
            <p
              style={{
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                border: '1px solid #fecaca',
                marginBottom: '12px',
              }}
            >
              ⚠️ {state.error}
            </p>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '4px',
                color: '#064e3b',
              }}
            >
              Nama Penerima Barang
            </label>
            <input
              type="text"
              placeholder="Contoh: Pak Budi (Security) / Ibu Siska"
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '4px',
                color: '#064e3b',
              }}
            >
              Catatan Penerimaan (Opsional)
            </label>
            <input
              type="text"
              placeholder="Kondisi kemasan utuh, segel baik..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={pending}
              className="btn-primary"
              style={{
                padding: '6px 14px',
                fontSize: '0.85rem',
                backgroundColor: '#047857',
                borderColor: '#065f46',
              }}
            >
              {pending ? 'Menyimpan...' : 'Kunci Status: DELIVERED'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function CancelShipmentModal({
  shipmentId,
  shipmentNumber,
}: {
  shipmentId: string;
  shipmentNumber: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');

  const [state, formAction, pending] = useActionState(
    async (): Promise<ShipmentActionResult> => {
      const res = await cancelShipmentAction({
        shipmentId,
        reason,
      });

      if (res.success) {
        setOpen(false);
      }
      return res;
    },
    {},
  );

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: '6px 12px',
          fontSize: '0.85rem',
          backgroundColor: '#ffffff',
          color: '#dc2626',
          border: '1px solid #fca5a5',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        {open ? 'Batal' : 'Batalkan DO'}
      </button>

      {open && (
        <form
          action={formAction}
          style={{
            marginTop: '12px',
            padding: '16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <h4
              style={{
                margin: 0,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#991b1b',
              }}
            >
              Batalkan Dokumen {shipmentNumber}
            </h4>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '0.8rem',
                color: '#b91c1c',
              }}
            >
              Pembatalan DO akan mengembalikan kuota item ke status belum
              dikirim.
            </p>
          </div>

          {state.error && (
            <p
              style={{
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                border: '1px solid #fecaca',
                marginBottom: '12px',
              }}
            >
              ⚠️ {state.error}
            </p>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '4px',
                color: '#991b1b',
              }}
            >
              Alasan Pembatalan *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Salah alamat / ganti kurir / pesanan direvisi"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={pending || !reason.trim()}
              style={{
                padding: '6px 14px',
                fontSize: '0.85rem',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {pending ? 'Membatalkan...' : 'Konfirmasi Batal'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function PrintableSuratJalanA4({
  shipment,
  items,
  brandName,
  orderNumber,
}: {
  shipment: ShipmentRow;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    notes?: string | null;
  }>;
  brandName: string;
  orderNumber: string;
}) {
  const printAction = () => {
    window.print();
  };

  const addr = shipment.shipping_address_snapshot;

  return (
    <div style={{ marginTop: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '12px',
        }}
      >
        <button
          onClick={printAction}
          className="btn-secondary"
          style={{
            padding: '8px 18px',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🖨️</span> Cetak Surat Jalan A4
        </button>
      </div>

      <div
        className="printable-surat-jalan"
        style={{
          backgroundColor: '#ffffff',
          padding: '36px',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          color: '#111827',
          maxWidth: '800px',
          margin: '0 auto',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        }}
      >
        {/* Header Kop */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #111827',
            paddingBottom: '16px',
            marginBottom: '20px',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '1.4rem',
                fontWeight: 800,
                letterSpacing: '-0.5px',
              }}
            >
              {brandName.toUpperCase()}
            </h2>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '0.8rem',
                color: '#4b5563',
              }}
            >
              MultiGraph Printing & Apparel Holding · Fulfillment Hub
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '1px',
                color: '#1f2937',
              }}
            >
              SURAT JALAN
            </h1>
            <p
              style={{
                margin: '2px 0 0 0',
                fontSize: '0.9rem',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#1d4ed8',
              }}
            >
              {shipment.shipment_number}
            </p>
            <p
              style={{
                margin: '2px 0 0 0',
                fontSize: '0.8rem',
                color: '#6b7280',
              }}
            >
              Tanggal:{' '}
              {new Date(shipment.created_at).toLocaleDateString('id-ID', {
                dateStyle: 'long',
              })}
            </p>
          </div>
        </div>

        {/* Info Dua Kolom */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px',
            fontSize: '0.85rem',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{ fontWeight: 700, marginBottom: '6px', color: '#374151' }}
            >
              TUJUAN PENGIRIMAN:
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {addr.recipient_name ?? 'Pelanggan'}
            </div>
            <div style={{ color: '#4b5563', margin: '2px 0' }}>
              {addr.phone ?? '-'}
            </div>
            <div
              style={{ color: '#4b5563', marginTop: '4px', lineHeight: 1.4 }}
            >
              {addr.street ?? '-'}
              {addr.city ? `, ${addr.city}` : ''}
              {addr.province ? `, ${addr.province}` : ''}
              {addr.postal_code ? ` ${addr.postal_code}` : ''}
            </div>
          </div>

          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{ fontWeight: 700, marginBottom: '6px', color: '#374151' }}
            >
              DETAIL LOGISTIK:
            </div>
            <div>
              <strong>No. Pesanan:</strong> {orderNumber}
            </div>
            <div style={{ marginTop: '2px' }}>
              <strong>Kurir / Ekspedisi:</strong>{' '}
              {COURIER_LABELS[shipment.courier_name as CourierName] ??
                shipment.courier_name}
              {shipment.courier_service ? ` (${shipment.courier_service})` : ''}
            </div>
            <div style={{ marginTop: '2px' }}>
              <strong>No. Resi (AWB):</strong>{' '}
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                {shipment.tracking_number ?? 'Menunggu Serah Terima'}
              </span>
            </div>
            <div style={{ marginTop: '2px' }}>
              <strong>Jumlah Koli:</strong> {shipment.package_count} koli /
              paket
              {shipment.package_weight_grams
                ? ` (${shipment.package_weight_grams / 1000} kg)`
                : ''}
            </div>
          </div>
        </div>

        {/* Tabel Barang */}
        <div style={{ marginBottom: '32px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
            }}
          >
            <thead>
              <tr
                style={{ borderBottom: '2px solid #374151', textAlign: 'left' }}
              >
                <th style={{ padding: '8px 10px', width: '40px' }}>No</th>
                <th style={{ padding: '8px 10px' }}>
                  Deskripsi Barang / Spesifikasi
                </th>
                <th
                  style={{
                    padding: '8px 10px',
                    width: '100px',
                    textAlign: 'center',
                  }}
                >
                  Jumlah
                </th>
                <th
                  style={{
                    padding: '8px 10px',
                    width: '80px',
                    textAlign: 'center',
                  }}
                >
                  Satuan
                </th>
                <th style={{ padding: '8px 10px', width: '180px' }}>
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 10px', color: '#6b7280' }}>
                    {idx + 1}
                  </td>
                  <td style={{ padding: '10px 10px', fontWeight: 600 }}>
                    {item.description}
                  </td>
                  <td
                    style={{
                      padding: '10px 10px',
                      textAlign: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      padding: '10px 10px',
                      textAlign: 'center',
                      color: '#6b7280',
                    }}
                  >
                    pcs
                  </td>
                  <td
                    style={{
                      padding: '10px 10px',
                      fontSize: '0.8rem',
                      color: '#6b7280',
                    }}
                  >
                    {item.notes ?? '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid #374151', fontWeight: 700 }}>
                <td
                  colSpan={2}
                  style={{ padding: '10px 10px', textAlign: 'right' }}
                >
                  Total Barang:
                </td>
                <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                  {items.reduce((acc, i) => acc + i.quantity, 0)}
                </td>
                <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                  pcs
                </td>
                <td style={{ padding: '10px 10px' }} />
              </tr>
            </tfoot>
          </table>
        </div>

        {shipment.notes && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#fefce8',
              border: '1px solid #fef08a',
              borderRadius: '6px',
              fontSize: '0.8rem',
              marginBottom: '32px',
              color: '#854d0e',
            }}
          >
            <strong>Catatan:</strong> {shipment.notes}
          </div>
        )}

        {/* Tanda Tangan 3 Pihak */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            textAlign: 'center',
            fontSize: '0.8rem',
            marginTop: '40px',
          }}
        >
          <div>
            <div style={{ color: '#6b7280', marginBottom: '60px' }}>
              Disiapkan Oleh (Gudang):
            </div>
            <div
              style={{
                borderTop: '1px solid #9ca3af',
                paddingTop: '4px',
                fontWeight: 600,
              }}
            >
              ( ..................................... )
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Staff Logistik
            </div>
          </div>
          <div>
            <div style={{ color: '#6b7280', marginBottom: '60px' }}>
              Dibawa Oleh (Kurir):
            </div>
            <div
              style={{
                borderTop: '1px solid #9ca3af',
                paddingTop: '4px',
                fontWeight: 600,
              }}
            >
              ( ..................................... )
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Sopir / Ekspedisi
            </div>
          </div>
          <div>
            <div style={{ color: '#6b7280', marginBottom: '60px' }}>
              Diterima Oleh (Penerima):
            </div>
            <div
              style={{
                borderTop: '1px solid #9ca3af',
                paddingTop: '4px',
                fontWeight: 600,
              }}
            >
              ( ..................................... )
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Tanda Tangan & Cap
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrintableThermalLabelA6({
  shipment,
  items,
  brandName,
  orderNumber,
}: {
  shipment: ShipmentRow;
  items: Array<{ id: string; description: string; quantity: number }>;
  brandName: string;
  orderNumber: string;
}) {
  const printAction = () => {
    window.print();
  };

  const addr = shipment.shipping_address_snapshot;
  const courierLabel =
    COURIER_LABELS[shipment.courier_name as CourierName] ??
    shipment.courier_name;

  return (
    <div style={{ marginTop: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '12px',
        }}
      >
        <button
          onClick={printAction}
          className="btn-secondary"
          style={{
            padding: '8px 18px',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🏷️</span> Cetak Thermal Label A6 (100x150mm)
        </button>
      </div>

      <div
        className="printable-thermal-label-a6"
        style={{
          width: '380px',
          minHeight: '560px',
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '4px',
          border: '2px solid #000000',
          color: '#000000',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Header Kurir */}
        <div
          style={{
            borderBottom: '2px solid #000000',
            paddingBottom: '10px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                letterSpacing: '-0.5px',
              }}
            >
              {courierLabel.toUpperCase()}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              {shipment.courier_service
                ? shipment.courier_service.toUpperCase()
                : 'STANDARD'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>KOLI</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>
              1 / {shipment.package_count}
            </div>
          </div>
        </div>

        {/* Resi & Barcode Simulation */}
        <div
          style={{
            borderBottom: '2px solid #000000',
            paddingBottom: '12px',
            marginBottom: '10px',
            textAlign: 'center',
          }}
        >
          {/* Simulated Barcode */}
          <div
            style={{
              height: '42px',
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'center',
              gap: '2px',
              margin: '6px 0',
              overflow: 'hidden',
            }}
          >
            {Array.from({ length: 42 }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: i % 3 === 0 ? '4px' : i % 2 === 0 ? '2px' : '1px',
                  backgroundColor: '#000000',
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              letterSpacing: '1px',
            }}
          >
            {shipment.tracking_number ?? shipment.shipment_number}
          </div>
          <div
            style={{ fontSize: '0.75rem', color: '#374151', marginTop: '2px' }}
          >
            DO: {shipment.shipment_number} · Order: {orderNumber}
          </div>
        </div>

        {/* Destination City Highlight */}
        <div
          style={{
            borderBottom: '2px solid #000000',
            paddingBottom: '8px',
            marginBottom: '10px',
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: '6px 10px',
            textAlign: 'center',
            borderRadius: '2px',
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}
          >
            KOTA / TUJUAN PENGIRIMAN
          </div>
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 900,
              letterSpacing: '0.5px',
            }}
          >
            {(addr.city ?? 'INDONESIA').toUpperCase()}
          </div>
          {addr.postal_code && (
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              KODEPOS: {addr.postal_code}
            </div>
          )}
        </div>

        {/* Penerima & Pengirim */}
        <div
          style={{
            borderBottom: '1px solid #000000',
            paddingBottom: '10px',
            marginBottom: '10px',
            fontSize: '0.8rem',
            lineHeight: 1.35,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: '0.75rem',
              marginBottom: '2px',
            }}
          >
            PENERIMA:
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>
            {addr.recipient_name ?? 'Pelanggan'}
          </div>
          <div style={{ fontWeight: 700 }}>{addr.phone ?? '-'}</div>
          <div style={{ marginTop: '4px' }}>
            {addr.street ?? '-'}
            {addr.city ? `, ${addr.city}` : ''}
            {addr.province ? `, ${addr.province}` : ''}
          </div>
        </div>

        <div
          style={{
            borderBottom: '1px solid #000000',
            paddingBottom: '8px',
            marginBottom: '10px',
            fontSize: '0.75rem',
            lineHeight: 1.3,
          }}
        >
          <div
            style={{ fontWeight: 800, fontSize: '0.7rem', marginBottom: '2px' }}
          >
            PENGIRIM:
          </div>
          <div style={{ fontWeight: 800 }}>
            {brandName.toUpperCase()} APPAREL & MERCH
          </div>
          <div>MultiGraph Fulfillment Hub · CS: 0812-8888-0000</div>
          <div>Jakarta, Indonesia</div>
        </div>

        {/* Package summary */}
        <div style={{ fontSize: '0.75rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 700,
              marginBottom: '4px',
            }}
          >
            <span>
              ISI PAKET ({items.reduce((a, b) => a + b.quantity, 0)} pcs):
            </span>
            <span>
              {shipment.package_weight_grams
                ? `${shipment.package_weight_grams / 1000} kg`
                : '1 kg'}
            </span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: 1.35 }}>
            {items.slice(0, 4).map((it) => (
              <li key={it.id}>
                {it.description} ({it.quantity}x)
              </li>
            ))}
            {items.length > 4 && (
              <li>...dan {items.length - 4} item lainnya</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
