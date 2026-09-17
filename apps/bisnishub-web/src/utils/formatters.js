/**
 * Currency formatter for IDR (Indonesian Rupiah)
 */
export function formatRupiah(number) {
  if (number === null || number === undefined || isNaN(number)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);
}

/**
 * Format date to human friendly Indonesian format
 */
export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}
