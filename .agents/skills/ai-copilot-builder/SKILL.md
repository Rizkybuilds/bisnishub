---
name: ai-copilot-builder
description: >-
  Rancang dan bangun AI Copilot interaktif tersemat (Embedded ERP Copilot) di BisnisHub OS.
  Meliputi arsitektur Chat-with-ERP Data, interogasi buku kas/stok dengan bahasa alami (Natural Language to SQL/RPC),
  Gemini Tool/Function Calling untuk aksi ERP (cek stok, simulasikan HPP, buat draf invoice, forecast kas),
  serta perancangan Generative UI (rendering KPI cards, tabel data, & tombol konfirmasi aksi di UI chat).
argument-hint: "[copilot, function-calling, chat-with-data, generative-ui, or executive-brief]"
---

# AI Copilot Builder — Asisten Eksekutif Cerdas ERP Tersemat

Skill spesialis untuk merancang dan membangun **AI Business Copilot & Conversational Interface** di dalam web dashboard **BisnisHub OS** menggunakan **Gemini 3.8 Flash**, Gemini Function Calling, dan Generative UI.

---

## 1. Arsitektur In-App ERP Copilot

Copilot BisnisHub bertindak sebagai **Co-Founder Digital Siaga 24/7** yang dapat diajak berdiskusi, menganalisis performa bisnis, dan mengeksekusi instruksi operasional dengan bahasa Indonesia kasual maupun profesional.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   BISNISHUB OS — FLOATING / EMBEDDED COPILOT                │
│  • Input: "Berapa sisa kas bersih minggu ini dan ada order macet di mana?" │
│  • Input: "Simulasikan HPP kalau order 50 pcs NSA 24s sablon A3 2 sisi"    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 GEMINI 3.8 FLASH WITH TOOL / FUNCTION CALLING               │
│  System Instruction: Karakter Founding C-Suite (CFO + COO)                  │
│  Model mengevaluasi query ➔ Memilih tools ERP yang relevan                  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
     ┌─────────────────────────────────┼─────────────────────────────────┐
     │                                 │                                 │
     ▼                                 ▼                                 ▼
┌──────────────────┐         ┌──────────────────┐              ┌──────────────────┐
│ Tool: queryLedger│         │ Tool: checkStock │              │ Tool: simulateHPP│
│ • Kas per Wallet │         │ • NSA Buffer     │              │ • Formula CFO    │
│ • Burn & Runway  │         │ • Film DTF Roll  │              │ • Floor Margin   │
└────────┬─────────┘         └────────┬─────────┘              └────────┬─────────┘
         │                            │                                 │
         └────────────────────────────┼─────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       STREAMING GENERATIVE UI RESPONSE                      │
│ • Narasi Bahasa Indonesia Natural & Tajam (CFO/COO voice)                   │
│ • Generative UI Components:                                                 │
│   ├── <FinancialSummaryCard wallet="teestock" balance={...} />              │
│   ├── <StockAlertTable items={[...]} />                                     │
│   └── <ActionButton onClick={confirmPO}>Pesan Restok Sekarang</ActionButton>│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Katalog Function Calling Baku ERP BisnisHub

Gunakan SDK `@google/genai` dengan deklarasi fungsi yang terisolasi aman (Read-Only secara default, State Mutation mewajibkan konfirmasi).

### Deklarasi Tools Gemini
```typescript
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';

export const erpTools: FunctionDeclaration[] = [
  {
    name: 'getTreasurySummary',
    description: 'Mendapatkan ringkasan saldo kas, burn rate, dan sisa runway per unit bisnis (teestock, multigraph, holding).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        unit: { type: Type.STRING, enum: ['all', 'teestock', 'multigraph', 'holding'] }
      }
    }
  },
  {
    name: 'checkInventoryAlerts',
    description: 'Mengecek SKU kaos polos NSA atau bahan cetak DTF yang menipis di bawah reorder point.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING, enum: ['all', 'garment', 'dtf_film', 'packaging'] }
      }
    }
  },
  {
    name: 'calculateApparelHPP',
    description: 'Menghitung HPP detail dan rekomendasi harga jual berdasarkan formula baku CFO BisnisHub.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        garment_model: { type: Type.STRING, description: 'Contoh: NSA Heavyweight 24s' },
        print_size: { type: Type.STRING, enum: ['A4', 'A3', 'A3+', 'custom'] },
        custom_print_length_cm: { type: Type.NUMBER },
        target_qty: { type: Type.NUMBER },
        packaging_tier: { type: Type.STRING, enum: ['standard', 'premium_box'] }
      },
      required: ['garment_model', 'print_size', 'target_qty']
    }
  },
  {
    name: 'getProductionKanbanStatus',
    description: 'Melihat status antrean produksi: jumlah order pending_payment, pending, dtf, press, dan pack.',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  }
];
```

---

## 3. Generative UI: Menampilkan Widget Interaktif di Chat

Jangan hanya mengembalikan teks mentah. UI Copilot harus dapat merender elemen interaktif:

```jsx
// Pola Rendering Respons Copilot di Frontend React
export function CopilotMessageRenderer({ message }) {
  return (
    <div className="space-y-3">
      {/* Teks Analisis AI */}
      <div className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
        {message.text}
      </div>

      {/* Render Widget Khusus jika ada payload terstruktur */}
      {message.widget?.type === 'TREASURY_KPI' && (
        <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Kas Tersedia</span>
            <span className="text-xs text-slate-400">Runway: {message.widget.runway_months} bln</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {formatRupiah(message.widget.total_cash)}
          </div>
        </div>
      )}

      {message.widget?.type === 'ACTION_CONFIRM' && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between">
          <span className="text-xs text-amber-300">{message.widget.prompt}</span>
          <button 
            onClick={() => handleExecuteAction(message.widget.actionId)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-md shadow"
          >
            Eksekusi
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 4. Pipeline Executive Morning Brief

Setiap pukul 07.30 WIB, Copilot dapat dipicu otomatis (via pg_cron atau antarmuka dashboard) untuk menghasilkan ringkasan eksekutif 3 poin:
1. **Status Likuiditas Kas**: Saldo efektif & kas titipan ongkir kurir yang harus disetor.
2. **Prioritas Produksi Hari Ini**: Berapa meter film DTF yang harus dipress dan status garmen yang harus ditarik dari Cititex.
3. **Peluang & Ancaman**: Pesanan besar yang belum lunas (follow-up WhatsApp) atau anomali kenaikan defect.
