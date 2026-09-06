/**
 * Utility untuk memformat nomor telepon Indonesia dan menghasilkan pesan WhatsApp otomatis
 */

export function sanitizePhoneNumber(phone) {
  if (!phone) return "";
  let clean = phone.replace(/\D/g, "");
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  } else if (clean.startsWith("8")) {
    clean = "62" + clean;
  }
  return clean;
}

export function generateCustomerWhatsAppText(order, stage = null) {
  const currentStage = stage || order.status || "pending";
  const customer = order.customer || "Kak";
  const garment = order.garment || "NSA Softstyle";
  const spec = `${order.productName || order.sku || "Kaos Custom"} (${garment} - ${order.color || "Hitam"} ${order.size || "L"})`;
  const trackingNo = order.trackingNo || order.id;

  switch (currentStage) {
    case "pending":
      return `Halo ${customer}! Terima kasih sudah memesan di *TeeStock Apparel* 😊

Pesananmu (*${order.id}*) untuk:
👕 *${spec}* x${order.qty || 1} pcs
telah kami terima dan masuk ke dalam antrean produksi sablon.

Estimasi pengerjaan: 1-2 hari kerja. Kami akan kabari lagi begitu kaosmu selesai dipress! 🙏`;

    case "dtf":
      return `Halo ${customer}! Update untuk pesanan *${order.id}*:
🎨 Film sablon DTF HD kualitas premium untuk desainmu sedang dicetak.

Setelah film siap, kami akan langsung lanjut ke proses heat press mandiri pada bahan New State Apparel original. Mohon ditunggu ya kak! 😊`;

    case "press":
      return `Halo ${customer}! Update produksi pesanan *${order.id}*:
🔥 Kaosmu sedang masuk tahap *Heat Press & Quality Control* dengan suhu dan tekanan terstandar (155°C).

Kami pastikan daya rekat sablon maksimal, lentur, dan tahan cuci sebelum masuk ke pengemasan!`;

    case "pack":
      return `Halo ${customer}! Kabar baik untuk pesanan *${order.id}*:
📦 Kaos *${order.productName || "pesananmu"}* sudah selesai dipress, lolos QC, dan telah dipacking rapi dengan polymailer tebal!

Paketmu saat ini sedang menunggu jadwal penjemputan oleh kurir ekspedisi hari ini.`;

    case "shipped":
      return `Halo ${customer}! Pesananmu (*${order.id}*) sudah diserahkan ke kurir dan sedang dalam perjalanan! 🚀

📦 *Rincian Pengiriman:*
• No. Resi / ID: *${trackingNo}*
• Channel: *${(order.channel || "TeeStock").toUpperCase()}*

Bila paket sudah sampai, jangan lupa video unboxing ya kak. Terima kasih banyak sudah mendukung brand lokal kami! 🙏`;

    case "review":
      return `Halo ${customer}! Semoga paket kaos dari TeeStock sudah sampai dan nyaman dipakai ya! 😊

Jika kakak puas dengan kelembutan bahan New State Apparel dan hasil sablon kami, boleh bantu kami dengan memberikan *ulasan bintang 5 dan foto testimoni* di marketplace?

Ulasan dari kakak sangat berharga untuk membantu brand kami terus berkembang. Terima kasih banyak kak! ⭐⭐⭐⭐⭐`;

    default:
      return `Halo ${customer}! Terima kasih atas pesananmu di TeeStock Apparel (*${order.id}*). Kami sedang memproses pesananmu dengan sepenuh hati!`;
  }
}

export function getWhatsAppUrl(phone, message) {
  const cleanPhone = sanitizePhoneNumber(phone);
  if (!cleanPhone) return null;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateOrderCheckoutWhatsAppText({
  orderId,
  customerName,
  phone,
  city = 'Indonesia',
  address,
  courier = 'J&T Express',
  items = [],
  baseTotal,
  uniqueCode,
  totalTransfer,
  merchantName = 'TeeStock Apparel'
}) {
  const itemListText = items.length > 0
    ? items.map((item, idx) => `• ${item.name} (${item.garment || 'NSA'} - ${item.color || 'Hitam'} ${item.size || 'L'}) x${item.qty || 1} pcs`).join('\n')
    : `• Pesanan Kaos TeeStock (${orderId})`;

  return `Halo *${merchantName}*! Saya sudah melakukan checkout di website:

📦 *No. Order:* ${orderId}
👤 *Nama:* ${customerName}
📱 *WhatsApp:* ${phone}
📍 *Alamat:* ${address} (${city})
🚚 *Kurir:* ${courier}

🛒 *Rincian Item:*
${itemListText}

💳 *Pembayaran:* QRIS Manual (${merchantName})
🔢 *Kode Unik Verifikasi:* +${uniqueCode}
💰 *Total Transfer Persis:* Rp ${Number(totalTransfer).toLocaleString('id-ID')}

Saya sudah transfer dengan nominal persis *Rp ${Number(totalTransfer).toLocaleString('id-ID')}*. Terlampir bukti transfer QRIS. Mohon segera diproses ya kak! Terima kasih 🙏`;
}

