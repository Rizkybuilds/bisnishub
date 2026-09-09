---
name: api-backend-engineer
description: >-
  Perancangan dan pembuatan API backend yang aman, modular, dan skalabel (REST/tRPC),
  Edge Functions, integrasi payment gateway (Midtrans, Xendit, QRIS dinamis),
  logistik ongkir (RajaOngkir, Biteship), webhook idempotency,
  dan autentikasi berbasis token/Supabase Auth.
argument-hint: "[api, endpoint, webhook, payment, shipping, or auth]"
---

# API & Backend Engineer — Serverless, Payment & Integration Specialist

Skill spesialis untuk merancang endpoint API backend, Edge Functions, integrasi sistem pembayaran Indonesia, kurir logistik, dan webhook gateway yang tangguh (*fault-tolerant*).

---

## 1. Arsitektur API Standar (Format Respon & Error Handling)

Setiap endpoint API harus mengembalikan struktur payload seragam (*JSend standard*):

```typescript
// Sukses
{
  "status": "success",
  "data": { ... },
  "meta": { "timestamp": "2026-09-09T12:00:00Z" }
}

// Gagal
{
  "status": "error",
  "message": "Deskripsi error yang jelas dan ramah pengguna",
  "code": "INVALID_COUPON_CODE",
  "details": [ ... ] // Optional validation errors
}
```

---

## 2. Integrasi Payment Gateway Indonesia (Midtrans / QRIS)

### Pola Pembuatan Transaksi (Snap Token)
```typescript
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!
});

export async function createPaymentTransaction(order: {
  id: string;
  grossAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}) {
  const parameter = {
    transaction_details: {
      order_id: order.id,
      gross_amount: order.grossAmount
    },
    customer_details: {
      first_name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone
    },
    enabled_payments: ['gopay', 'shopeepay', 'qris', 'bca_va', 'mandiri_va', 'bni_va']
  };

  const transaction = await snap.createTransaction(parameter);
  return {
    token: transaction.token,
    redirectUrl: transaction.redirect_url
  };
}
```

### Validasi Webhook & Proteksi Idempotensi (Wajib!)
> [!CAUTION]
> Vendor payment gateway akan mengirim webhook berulang kali jika jaringan tidak stabil (*retry mechanism*). Tanpa kunci idempotensi (*idempotency key*) dan validasi signature, saldo dapat terproses ganda!

```typescript
import crypto from 'crypto';

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string,
  serverKey: string
): boolean {
  const hash = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');

  return hash === signatureKey;
}
```

---

## 3. Integrasi Logistik & Ongkir (RajaOngkir / Biteship)

Pola perhitungan ongkir dinamis berdasarkan berat garmen apparel (misal: 1 kaos NSA 24s ≈ 200–220 gram):

```typescript
export async function calculateShippingRates({
  originCityId,
  destinationCityId,
  totalWeightGrams,
  couriers = ['jne', 'sicepat', 'jnt']
}: {
  originCityId: string;
  destinationCityId: string;
  totalWeightGrams: number;
  couriers?: string[];
}) {
  // Pastikan berat minimal dihitung 1.000 gram (kebijakan kurir nasional)
  const billableWeight = Math.max(1000, totalWeightGrams);

  const results = await Promise.all(
    couriers.map(async (courier) => {
      const response = await fetch('https://api.rajaongkir.com/starter/cost', {
        method: 'POST',
        headers: {
          'key': process.env.RAJAONGKIR_API_KEY!,
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          origin: originCityId,
          destination: destinationCityId,
          weight: billableWeight.toString(),
          courier: courier
        })
      });
      return response.json();
    })
  );

  return results;
}
```

---

## 4. Keamanan Endpoint & Rate Limiting

1. **Autentikasi Bearer JWT / Supabase Auth:**
   Validasi token pengguna sebelum mengeksekusi operasi database yang bersifat mutatif.
2. **Rate Limiting:**
   Terapkan pembatasan request pada endpoint publik (terutama checkout, cek ongkir, dan login): maksimal 10 request per menit per IP untuk mencegah scraping bot dan denial of service.
3. **Audit Log:**
   Catat setiap webhook masuk ke tabel audit log (`core_audit_logs`) lengkap dengan status, payload raw, dan timestamp.
