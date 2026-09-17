/**
 * Utility Generator Nomor Pesanan Standar TeeStock
 * Format: TS-YYMMDD-XXXXXX (contoh: TS-260914-A8F2C1)
 * Entropi 6-digit hex (16,7 juta kombinasi per hari) untuk mencegah tabrakan & brute-force ID.
 */

export function generateOrderNumber(prefix = 'TS') {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const randomHex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
  return `${prefix}-${yy}${mm}${dd}-${randomHex}`;
}

export function isValidOrderNumber(orderNumber) {
  if (!orderNumber || typeof orderNumber !== 'string') return false;
  // Format TS-YYMMDD-XXXX (4-8 karakter hex acak) atau legacy WEB-XXXXXX / TS-XXXXXX
  return /^[A-Z]{2,3}-\d{6}-[0-9A-F]{4,8}$/i.test(orderNumber) || /^(WEB|TS)-\d{6,}$/i.test(orderNumber);
}

