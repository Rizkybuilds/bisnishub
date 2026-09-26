'use client';

import { useState, useActionState, useRef } from 'react';
import { createRetailOrderAction, CreateRetailOrderResult } from './actions';
import { RetailItemOption } from './data';

export interface CustomerOption {
  id: string;
  display_name: string;
  primary_phone: string | null;
}

export function RetailOrderCreateModal({
  brandId,
  customers,
  inventoryItems,
}: {
  brandId: string;
  customers: CustomerOption[];
  inventoryItems: RetailItemOption[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers[0]?.id || '',
  );

  // Line items state
  const [items, setItems] = useState<
    {
      inventoryItemId: string;
      quantity: number;
      unitPrice: string;
      discountTotal: string;
      notes: string;
    }[]
  >([
    {
      inventoryItemId: inventoryItems[0]?.id || '',
      quantity: 1,
      unitPrice: inventoryItems[0]
        ? String(
            Math.round((Number(inventoryItems[0].cost_price) * 1.6) / 1000) *
              1000,
          )
        : '75000',
      discountTotal: '0',
      notes: '',
    },
  ]);

  // Shipping & fulfillment
  const [isStorePickup, setIsStorePickup] = useState(true);
  const [shippingCost, setShippingCost] = useState('0');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');

  // POS Immediate Payment
  const [autoPay, setAutoPay] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<
    'CASH' | 'QRIS' | 'BANK_TRANSFER'
  >('CASH');
  const [paymentReference, setPaymentReference] = useState('');

  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (): Promise<CreateRetailOrderResult> => {
      const payload = {
        brandId,
        customerAccountId: selectedCustomerId,
        items: items.map((it) => ({
          inventoryItemId: it.inventoryItemId,
          quantity: Number(it.quantity),
          unitPrice: it.unitPrice,
          discountTotal: it.discountTotal || '0',
          notes: it.notes || null,
        })),
        shippingAddress: isStorePickup
          ? null
          : {
              recipient_name: recipientName || 'Pelanggan Ritel',
              phone: phone || '-',
              street: street || 'Alamat Kirim',
              city: city || 'Kota Tujuan',
            },
        shippingCost: isStorePickup ? '0' : shippingCost || '0',
        autoPay,
        paymentMethod,
        paymentReference: paymentReference || null,
      };

      const res = await createRetailOrderAction(payload);
      if (res.success) {
        setIsOpen(false);
      }
      return res;
    },
    {},
  );

  const handleAddItem = () => {
    const first = inventoryItems[0];
    setItems([
      ...items,
      {
        inventoryItemId: first?.id || '',
        quantity: 1,
        unitPrice: first
          ? String(Math.round((Number(first.cost_price) * 1.6) / 1000) * 1000)
          : '75000',
        discountTotal: '0',
        notes: '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: string,
    val: string | number,
  ) => {
    const updated = [...items];
    const current = updated[index];
    if (!current) return;
    const target = { ...current };

    if (field === 'inventoryItemId') {
      target.inventoryItemId = String(val);
      const inv = inventoryItems.find((i) => i.id === String(val));
      if (inv) {
        target.unitPrice = String(
          Math.round((Number(inv.cost_price) * 1.6) / 1000) * 1000,
        );
      }
    } else if (field === 'quantity') {
      target.quantity = Math.max(1, Number(val));
    } else if (field === 'unitPrice') {
      target.unitPrice = String(val);
    } else if (field === 'discountTotal') {
      target.discountTotal = String(val);
    } else if (field === 'notes') {
      target.notes = String(val);
    }

    updated[index] = target;
    setItems(updated);
  };

  // Calculations
  let subtotal = 0;
  let totalDiscount = 0;
  let totalEstimatedCost = 0;

  for (const it of items) {
    const qty = Number(it.quantity) || 0;
    const price = Number(it.unitPrice) || 0;
    const disc = Number(it.discountTotal) || 0;
    subtotal += qty * price;
    totalDiscount += disc;

    const inv = inventoryItems.find((i) => i.id === it.inventoryItemId);
    if (inv) {
      totalEstimatedCost += qty * Number(inv.cost_price);
    }
  }

  const shipping = isStorePickup ? 0 : Number(shippingCost) || 0;
  const grandTotal = Math.max(0, subtotal - totalDiscount + shipping);
  const netRevenue = subtotal - totalDiscount;
  const grossProfit = netRevenue - totalEstimatedCost;
  const marginPct =
    netRevenue > 0 ? ((grossProfit / netRevenue) * 100).toFixed(1) : '0';

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: '#047857',
          color: '#ffffff',
          borderRadius: '6px',
          fontWeight: 600,
          fontSize: '0.875rem',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span>⚡ + Order Ritel Cepat (POS)</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              maxWidth: '750px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxHeight: '92vh',
              overflowY: 'auto',
              color: '#0f172a',
            }}
          >
            {/* Header */}
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
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                  ⚡ Kasir &amp; Order Ritel Langsung (Fast POS)
                </h2>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '0.8rem',
                    color: '#64748b',
                  }}
                >
                  Penerbitan pesanan ritel instan untuk Kaos Polos NSA &amp;
                  Curated Merch tanpa quotation manual.
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
                  padding: '12px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #f87171',
                  borderRadius: '6px',
                  color: '#991b1b',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                  fontWeight: 500,
                }}
              >
                {state.error}
              </div>
            )}

            <form ref={formRef} action={formAction}>
              {/* Customer Selector */}
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Pelanggan / Customer Pembeli{' '}
                  <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                  }}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.display_name}{' '}
                      {c.primary_phone ? `(${c.primary_phone})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items Section */}
              <div
                style={{
                  marginBottom: '16px',
                  padding: '14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                    Produk / SKU Ritel Yang Dibeli
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    style={{
                      fontSize: '0.8rem',
                      padding: '4px 10px',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    + Tambah Baris Produk
                  </button>
                </div>

                {items.map((it, idx) => {
                  const inv = inventoryItems.find(
                    (i) => i.id === it.inventoryItemId,
                  );
                  const isLow = inv
                    ? inv.quantity_available < Number(it.quantity)
                    : false;

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2.5fr 1fr 1.2fr 1fr auto',
                        gap: '8px',
                        alignItems: 'center',
                        marginBottom: '8px',
                        paddingBottom: '8px',
                        borderBottom:
                          idx < items.length - 1
                            ? '1px dashed #cbd5e1'
                            : 'none',
                      }}
                    >
                      <div>
                        <select
                          value={it.inventoryItemId}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              'inventoryItemId',
                              e.target.value,
                            )
                          }
                          required
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8rem',
                          }}
                        >
                          {inventoryItems.map((invItem) => (
                            <option key={invItem.id} value={invItem.id}>
                              {invItem.sku} — {invItem.name} (Tersedia:{' '}
                              {invItem.quantity_available} {invItem.unit})
                            </option>
                          ))}
                        </select>
                        {isLow && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: '#b91c1c',
                              fontWeight: 600,
                            }}
                          >
                            ⚠️ Stok tidak cukup (Tersedia:{' '}
                            {inv?.quantity_available})
                          </span>
                        )}
                      </div>

                      <div>
                        <input
                          type="number"
                          min="1"
                          value={it.quantity}
                          onChange={(e) =>
                            handleItemChange(idx, 'quantity', e.target.value)
                          }
                          required
                          placeholder="Qty"
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8rem',
                            textAlign: 'center',
                          }}
                        />
                      </div>

                      <div>
                        <input
                          type="number"
                          min="0"
                          value={it.unitPrice}
                          onChange={(e) =>
                            handleItemChange(idx, 'unitPrice', e.target.value)
                          }
                          required
                          placeholder="Harga Rp"
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8rem',
                            textAlign: 'right',
                          }}
                        />
                      </div>

                      <div>
                        <input
                          type="number"
                          min="0"
                          value={it.discountTotal}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              'discountTotal',
                              e.target.value,
                            )
                          }
                          placeholder="Diskon Rp"
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8rem',
                            textAlign: 'right',
                          }}
                        />
                      </div>

                      <div>
                        <button
                          type="button"
                          disabled={items.length <= 1}
                          onClick={() => handleRemoveItem(idx)}
                          style={{
                            padding: '6px 8px',
                            backgroundColor: '#fee2e2',
                            color: '#b91c1c',
                            border: 'none',
                            borderRadius: '4px',
                            cursor:
                              items.length <= 1 ? 'not-allowed' : 'pointer',
                            fontSize: '0.8rem',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Shipping & Delivery Option */}
              <div
                style={{
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '8px',
                  }}
                >
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="radio"
                      name="shippingOption"
                      checked={isStorePickup}
                      onChange={() => setIsStorePickup(true)}
                    />
                    🏪 Ambil di Toko / Workshop (Pickup Rp 0)
                  </label>
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="radio"
                      name="shippingOption"
                      checked={!isStorePickup}
                      onChange={() => setIsStorePickup(false)}
                    />
                    📦 Kirim via Ekspedisi Kurir (J&amp;T / SiCepat / JNE)
                  </label>
                </div>

                {!isStorePickup && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      marginTop: '10px',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Nama Penerima"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.8rem',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="No. Telepon / WA"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.8rem',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Alamat Jalan Lengkap"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.8rem',
                        gridColumn: 'span 2',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Kota / Kecamatan Tujuan"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.8rem',
                      }}
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Ongkir Kurir Rp"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.8rem',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Instant POS Payment Option */}
              <div
                style={{
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '6px',
                  border: '1px solid #bbf7d0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#15803d',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={autoPay}
                      onChange={(e) => setAutoPay(e.target.checked)}
                    />
                    ✓ Langsung Lunas di Kasir (POS Immediate Settlement)
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#166534' }}>
                    Otomatis menerbitkan Invoice &amp; mencatat Kas Masuk
                  </span>
                </div>

                {autoPay && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.5fr 2fr',
                      gap: '10px',
                      marginTop: '10px',
                    }}
                  >
                    <select
                      value={paymentMethod}
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value as 'CASH' | 'QRIS' | 'BANK_TRANSFER',
                        )
                      }
                      style={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                      }}
                    >
                      <option value="CASH">💵 Uang Tunai (Cash)</option>
                      <option value="QRIS">📱 QRIS Kas Holding</option>
                      <option value="BANK_TRANSFER">
                        🏦 Transfer Bank BCA
                      </option>
                    </select>

                    <input
                      type="text"
                      placeholder="Ref / Catatan (mis. Struk POS / m-BCA #1029)"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Financial Summary & CFO Projection */}
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '18px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ color: '#64748b' }}>
                    Subtotal Kotor (
                    {items.reduce(
                      (acc, it) => acc + (Number(it.quantity) || 0),
                      0,
                    )}{' '}
                    pcs):
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                {totalDiscount > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      marginBottom: '4px',
                      color: '#b91c1c',
                    }}
                  >
                    <span>Potongan Diskon:</span>
                    <span>- Rp {totalDiscount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {shipping > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ color: '#64748b' }}>
                      Ongkos Kirim Kurir (Pass-Through):
                    </span>
                    <span>+ Rp {shipping.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid #e2e8f0',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                  }}
                >
                  <span>TOTAL TAGIHAN RITEL:</span>
                  <span style={{ color: '#0f172a' }}>
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginTop: '6px',
                  }}
                >
                  <span>
                    Estimasi HPP Bahan: Rp{' '}
                    {totalEstimatedCost.toLocaleString('id-ID')}
                  </span>
                  <span>
                    Gross Profit: Rp {grossProfit.toLocaleString('id-ID')} (
                    {marginPct}%)
                  </span>
                </div>
              </div>

              {/* Buttons */}
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
                    padding: '8px 20px',
                    backgroundColor: '#047857',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: isPending ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isPending
                    ? 'Menerbitkan...'
                    : '✓ Terbitkan Pesanan Ritel Langsung'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
