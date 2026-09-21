---
name: ai-automation-engine
description: >-
  Rancang dan bangun otomasi proses bisnis cerdas (AI Automation) pada ERP BisnisHub.
  Meliputi ekstraksi cerdas struk & faktur vendor via Gemini Multimodal OCR ke Buku Kas/Ledger,
  auto-parsing chat WhatsApp order ke pesanan Kanban, background event triggers via Supabase Edge Functions,
  reorder point prediction, serta guardrail idempotency dan audit log otomatis.
argument-hint: "[ocr, receipt-intake, whatsapp-parser, edge-functions, or workflow-automation]"
---

# AI Automation Engine — Otomasi Proses Bisnis Cerdas & Agentic Pipelines

Skill spesialis untuk merancang, mengimplementasikan, dan mengelola alur kerja **AI Automation** pada ERP **BisnisHub OS** menggunakan **Google Gemini API (`@google/genai`)**, Supabase Edge Functions, dan Database Webhooks.

---

## 1. Arsitektur AI Automation ERP

Otomasi AI di BisnisHub beroperasi sebagai pekerja latar belakang (*background autonomous workers*) dengan pengawasan terstruktur (*Human-in-the-Loop*):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EVENT SOURCES & TRIGGERS                          │
│  • Struk Belanja / Invoice PDF/Foto (Upload Admin / Foto Kamera HP)          │
│  • Pesanan Masuk via Chat WhatsApp (Fonnte / Wablas Webhook)                │
│  • Perubahan Status Stok Database (Supabase Database Webhooks / pg_cron)   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUPABASE EDGE FUNCTION / BACKEND WORKER                  │
│  1. Autentikasi Payload & Idempotency Check (Key / Hash SHA256)             │
│  2. Multimodal Prompting ke Google Gemini 3.8 Flash                         │
│  3. Strict Structured JSON Output (Zod Schema Validation)                  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                     │
           [Akurasi / Confidence]                [Akurasi / Confidence]
                 >= 90%                                 < 90%
                    ▼                                     ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────────┐
│     AUTO-RECORD WITH AUDIT LOG       │  │       HUMAN-IN-THE-LOOP           │
│ • Insert ke ts_ledger_entries        │  │ • Simpan sebagai status 'draft'   │
│ • Update ts_inventory & status order │  │ • Notifikasi ke WhatsApp Founder  │
│ • Set created_by: 'ai_automation'    │  │ • Tombol 1-klik "Approve / Edit"  │
└──────────────────────────────────────┘  └───────────────────────────────────┘
```

---

## 2. Pipeline 1: Multimodal OCR Struk & Faktur Vendor ke Ledger

### Alur Kerja
Founder memotret nota pembelian kaos polos di Cititex atau struk tinta DTF & packaging. Gemini 3.8 Flash mengekstrak metadata secara instan dengan output terstruktur.

### Implementasi TypeScript (`@google/genai`)
```typescript
import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({});

// Schema Output Baku Struk Pembelian
const receiptSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    vendor_name: { type: Type.STRING, description: 'Nama toko/distributor, misal: Cititex, Mulia DTF' },
    transaction_date: { type: Type.STRING, description: 'Format YYYY-MM-DD' },
    total_amount: { type: Type.NUMBER, description: 'Total nominal rupiah yang dibayar' },
    payment_method: { type: Type.STRING, enum: ['transfer', 'qris', 'cash'] },
    business_unit: { type: Type.STRING, enum: ['teestock', 'multigraph', 'holding'] },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item_name: { type: Type.STRING, description: 'Contoh: Kaos NSA 24s Black L' },
          quantity: { type: Type.NUMBER },
          unit_price: { type: Type.NUMBER },
          subtotal: { type: Type.NUMBER },
          category: { type: Type.STRING, enum: ['garment_blank', 'dtf_film', 'packaging', 'operational'] }
        },
        required: ['item_name', 'quantity', 'unit_price', 'subtotal']
      }
    },
    tax_or_fees: { type: Type.NUMBER },
    confidence_score: { type: Type.NUMBER, description: 'Skala 0.0 - 1.0 kelayakan pembacaan gambar' }
  },
  required: ['vendor_name', 'transaction_date', 'total_amount', 'items', 'confidence_score']
};

export async function processReceiptOCR(imageBuffer: Buffer, mimeType: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Kamu adalah Senior Accounting Auditor ERP BisnisHub. Ekstrak seluruh rincian belanja operasional dari gambar struk berikut ke dalam format data keuangan baku.`
          },
          {
            inlineData: {
              data: imageBuffer.toString('base64'),
              mimeType
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: receiptSchema,
      temperature: 0.1 // Rendah untuk determinisme ekstraksi angka
    }
  });

  return JSON.parse(response.text);
}
```

---

## 3. Pipeline 2: WhatsApp Chat Order Auto-Parser

### Alur Kerja
Pelanggan yang memesan via WhatsApp sering mengirim format tidak beraturan. AI Automation mem-parsing pesan chat menjadi draf pesanan resmi di database.

### Schema Output Chat Parser
```typescript
export interface ParsedWhatsAppOrder {
  customer_name: string;
  customer_phone: string; // Dinormalisasi format 628...
  shipping_address: {
    recipient: string;
    street: string;
    subdistrict: string; // Kecamatan (wajib untuk cek ongkir)
    city: string;
    province: string;
    postal_code?: string;
  };
  order_items: Array<{
    product_title: string;
    garment_model: string; // misal: 'NSA Heavyweight 24s'
    color: string;
    size: 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL';
    quantity: number;
    custom_notes?: string;
  }>;
  preferred_payment: 'qris' | 'bca_manual';
  delivery_service?: string; // misal: 'J&T REG', 'SiCepat'
  confidence_score: number;
}
```

---

## 4. Guardrails & Aturan Keamanan AI Automation

1. **Idempotency Verification**:
   Setiap dokumen atau webhook pesan wajib memiliki hash unik (`sha256(image_bytes)` atau `message_id`). Dilarang memproses ulang dokumen yang sama untuk mencegah duplikasi pencatatan kas atau stok.
2. **Audit Trail Wajib**:
   Setiap data yang dimasukkan oleh otomasi AI wajib mengisi kolom audit:
   - `created_by: 'ai_automation'`
   - `meta: { model: 'gemini-3.8-flash', confidence: 0.94, source_id: '...' }`
3. **Plafon Human Approval (Persetujuan Founder)**:
   - Pengeluaran kas $> \text{Rp 500.000}$ hasil scan struk wajib masuk status `pending_review` dan meminta konfirmasi founder sebelum saldo buku kas terpotong secara permanen.
   - Pengurangan atau penghapusan inventori di atas $10\text{ pcs}$ wajib diverifikasi manual.
