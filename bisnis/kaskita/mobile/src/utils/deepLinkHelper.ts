// ============================================================================
// WHATSAPP DEEP LINK HELPER
// File: src/utils/deepLinkHelper.ts
// ============================================================================

/**
 * Menghasilkan tautan deep link WhatsApp ramah (wa.me)
 * @param phone Nomor telepon tujuan (format 08... atau 628...)
 * @param message Teks pesan yang sudah terformat rapi
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  let cleanPhone = phone.replace(/[^0-9]/g, '');

  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Template pesan pengingat iuran ramah / sopan anti-sungkan
 */
export function getFriendlyDuesReminderText(
  wargaName: string,
  groupName: string,
  period: string,
  amount: number,
  guestLink: string
): string {
  return (
    `Halo ${wargaName}, sekadar informasi tagihan iuran ${groupName} periode ${period} ` +
    `sebesar Rp ${amount.toLocaleString('id-ID')} sudah dapat dibayarkan.\n\n` +
    `Untuk melihat rincian & upload bukti transfer tanpa install aplikasi, silakan klik tautan resmi berikut:\n` +
    `${guestLink}\n\n` +
    `Terima kasih banyak atas kerjasamanya! 🙏`
  );
}

/**
 * Template pengumuman pemenang kocokan arisan digital
 */
export function getArisanWinnerBroadcastText(
  groupName: string,
  roundNumber: number,
  winnerName: string,
  potAmount: number
): string {
  return (
    `🎉 PENGUMUMAN KOCOKAN ARISAN DIGITAL 🎉\n\n` +
    `Alhamdulillah, pengundian putaran ke-${roundNumber} untuk ${groupName} telah selesai dilakukan secara acak & adil via KasKita.\n\n` +
    `Selamat kepada pemenang periode ini:\n` +
    `🏆 ${winnerName}\n` +
    `💰 Total Tarikan: Rp ${potAmount.toLocaleString('id-ID')}\n\n` +
    `Terima kasih kepada seluruh peserta yang sudah tertib menyetor. Semoga berkah untuk kita semua! ✨`
  );
}
