/**
 * Utility Generator Nomor Pesanan Standar TeeStock
 * Format: TS-YYMMDD-XXXX (contoh: TS-260913-A8F2)
 * Menggantikan epoch 6-digit untuk mencegah tabrakan ID pada konkurensi transaksi tinggi.
 */

export function generateOrderNumber(prefix = 'TS') {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const randomHex = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  return `${prefix}-${yy}${mm}${dd}-${randomHex}`;
}

export function isValidOrderNumber(orderNumber) {
  if (!orderNumber || typeof orderNumber !== 'string') return false;
  // Format TS-YYMMDD-XXXX or legacy WEB-XXXXXX / TS-XXXXXX
  return /^[A-Z]{2,3}-\d{6}-[0-9A-F]{4}$/i.test(orderNumber) || /^(WEB|TS)-\d{6,}$/i.test(orderNumber);
}
