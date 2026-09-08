---
name: whatsapp-automation
description: >-
  Rancang otomasi percakapan WhatsApp untuk e-commerce Indonesia, template pesan
  transaksional (instruksi QRIS kode unik, notifikasi konfirmasi bayar, resi ekspedisi),
  kalkulator quoter custom instan, dan integrasi webhook gateway (Waha, Fonnte, Wablas).
  Gunakan saat membuat alur notifikasi pelanggan, format chat CS otomatis,
  atau integrasi webhook Supabase ke WhatsApp.
argument-hint: "[template, webhook, quoter, or notification]"
---

# WhatsApp Automation Skill — E-Commerce & Transactional Messaging

Skill spesialis untuk merancang alur pesan transaksional WhatsApp otomatis, quoter kalkulasi harga kustom instan, dan integrasi webhook gateway untuk brand e-commerce Indonesia.

---

## 1. Standar Pesan Transaksional (High-Converting & Clear)

Pesan WhatsApp harus bernada ramah, profesional, ringkas, dan menyertakan instruksi pembayaran yang jelas tanpa menimbulkan keraguan.

### Template 1: Tagihan Pesanan Baru (QRIS + Kode Unik 3 Digit)
```text
Halo kak {{customer_name}}! 👋
Terima kasih sudah memesan di *TeeStock Originals*.

Berikut rincian pesananmu:
🔖 *No. Pesanan:* #{{order_id}}
👕 *Item:* {{item_name}} (Size {{size}}) x {{qty}} pcs
💰 *Subtotal:* Rp {{subtotal}}
🏷️ *Kode Unik Pembayaran:* Rp {{unique_code}} (pengurang/penanda)
━━━━━━━━━━━━━━━━━━
💳 *TOTAL TRANSFER: Rp {{total_with_code}}*
━━━━━━━━━━━━━━━━━━

⚠️ *Penting:* Mohon transfer tepat hingga 3 digit terakhir agar sistem dapat memverifikasi pembayaran secara otomatis.

📌 *Metode Pembayaran:*
• *QRIS (Semua E-Wallet / M-Banking):* {{qris_image_link}}
• *BCA:* 123-456-7890 a.n TeeStock Studio

Setelah transfer, mohon kirimkan bukti transfer di chat ini ya kak. Pesanan akan segera masuk antrean produksi! ⚡
```

### Template 2: Verifikasi Pembayaran Berhasil & Masuk Antrean
```text
Halo kak {{customer_name}}! 🎉
Pembayaran untuk pesanan *#{{order_id}}* sebesar *Rp {{total_amount}}* telah *TERVERIFIKASI*.

⚙️ *Status Saat Ini:* Masuk Antrean Produksi Heat Press In-House.
Est. Selesai & Kirim: {{est_ship_date}} (H+0 / H+1).

Kamu bisa memantau status pesanan secara live di tautan berikut:
🔗 {{tracking_url}}

Terima kasih atas kepercayaannya mendukung brand apparel lokal independen! ✨
```

### Template 3: Notifikasi Paket Dikirim & Nomor Resi
```text
Paketmu sudah meluncur kak {{customer_name}}! 🚀📦

Pesanan *#{{order_id}}* telah diserahkan ke kurir *{{courier_name}}*.
🔖 *Nomor Resi:* `{{tracking_number}}`
📍 *Lacak Pengiriman:* {{courier_tracking_url}}

Mohon siapkan video unboxing tanpa jeda saat paket diterima ya kak untuk garansi penukaran 100% jika ada kendala. Selamat menikmati kaos barumu! 👕🔥
```

### Template 4: Follow-up Unboxing & Review (H+3 Setelah Diterima)
```text
Halo kak {{customer_name}}! Semoga kaos TeeStock-nya sudah mendarat dengan aman ya. 

Bagaimana dengan fitting kain NSA 24s dan hasil sablonnya? Kami sangat menghargai ulasan jujurmu! 

Beri ulasan dan rating bintang 5 di sini:
⭐ {{review_url}}

Dapatkan kupon voucher diskon *15%* (`LOVALTEESTOCK`) untuk pesananmu berikutnya! Terima kasih banyak! 🙌
```

---

## 2. Instant WhatsApp Quoter (Pesanan Custom Kaos)

Gunakan logika formula berikut untuk merespons chat konsumen yang menanyakan harga kaos custom satuan/komunitas secara instan:

```javascript
/**
 * Menghitung harga pesanan custom instan untuk respons chat WhatsApp
 */
function calculateCustomQuote({ blankType = 'NSA_24S', printArea = 'A3', qty = 1 }) {
  // Biaya dasar bahan
  const blankCost = blankType === 'NSA_24S' ? 42000 : 38000;
  
  // Biaya sablon DTF
  const printCostTable = {
    'LOGO_DADA': 4000,
    'A4': 8000,
    'A3': 14000,
    'A3_PLUS_LOGO': 17000
  };
  const printCost = printCostTable[printArea] || 14000;
  const baseCogs = blankCost + printCost + 5000; // Listrik + Packing + Overhead

  let unitPrice = 0;
  if (qty === 1) {
    unitPrice = 129000; // Satuan premium
  } else if (qty >= 2 && qty <= 5) {
    unitPrice = 115000; // Tier personal bundling
  } else if (qty >= 6 && qty <= 11) {
    unitPrice = 99000;  // Tier komunitas kecil
  } else if (qty >= 12 && qty <= 23) {
    unitPrice = 85000;  // Tier lusinan
  } else {
    unitPrice = 75000;  // Tier partai besar (>24 pcs)
  }

  const totalPrice = unitPrice * qty;
  const totalCogs = baseCogs * qty;
  const grossProfit = totalPrice - totalCogs;

  return {
    unitPrice,
    totalPrice,
    grossProfit,
    marginPercent: ((grossProfit / totalPrice) * 100).toFixed(1) + '%'
  };
}
```

---

## 3. Spesifikasi Integrasi Webhook Gateway (Fonnte / Waha)

### Pola Integrasi Payload Outbound (Kirim Pesan Otomatis):

```javascript
// Contoh Payload kirim pesan via Fonnte API
async function sendWhatsAppMessage({ phone, message }) {
  const FONNTE_TOKEN = process.env.FONNTE_TOKEN;
  
  // Format nomor HP ke 62xxxx
  let formattedPhone = phone.replace(/^0/, '62').replace(/\D/g, '');

  const response = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      'Authorization': FONNTE_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      target: formattedPhone,
      message: message,
      countryCode: '62',
    }),
  });

  return await response.json();
}
```

---

## 4. Helper Link Click-to-WhatsApp Generator

Untuk ditempatkan di web app, bio link TikTok, atau Instagram:

```javascript
export function generateWhatsAppOrderLink({ phone = '628123456789', sku, size, title }) {
  const text = `Halo Admin TeeStock! Saya mau order produk ini:%0A%0A` +
               `👕 *Model:* ${encodeURIComponent(title)}%0A` +
               `🔖 *SKU:* ${encodeURIComponent(sku)}%0A` +
               `📏 *Ukuran:* ${encodeURIComponent(size)}%0A%0A` +
               `Apakah stok masih tersedia? Terima kasih!`;
  
  return `https://wa.me/${phone}?text=${text}`;
}
```
