export interface GuestOrderItem {
  slug: string;
  sku: string;
  quantity: number;
  expectedPriceIdr: number;
}

export interface GuestCheckoutPayload {
  requestId: string;
  name: string;
  phone: string;
  email: string;
  items: GuestOrderItem[];
  agreedToPickup: true;
}

type Valid = { ok: true; value: GuestCheckoutPayload };
type Invalid = { ok: false; error: string };
export type CheckoutValidation = Valid | Invalid;

export function validateGuestCheckout(input: unknown): CheckoutValidation {
  const bad = (error: string): Invalid => ({ ok: false, error });
  if (!input || typeof input !== 'object' || Array.isArray(input))
    return bad('Data pesanan tidak valid.');
  const x = input as Record<string, unknown>;
  if (typeof x.honeypot === 'string' && x.honeypot.length > 0)
    return bad('Tidak dapat mengirim pesanan.');
  if (x.agreedToPickup !== true)
    return bad('Setujui pengambilan mandiri dan status pembayaran sebelum melanjutkan.');
  if (typeof x.requestId !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(x.requestId))
    return bad('Sesi checkout tidak valid. Muat ulang halaman.');
  if (typeof x.name !== 'string' || x.name.trim().length < 2 ||
    x.name.trim().length > 100)
    return bad('Nama penerima harus 2–100 karakter.');
  if (typeof x.phone !== 'string' || !/^\+?[0-9]{9,16}$/.test(x.phone))
    return bad('Nomor WhatsApp harus berisi 9–16 digit.');
  if (typeof x.email !== 'string' || x.email.length > 160 ||
    (x.email.length > 0 && !/^[A-Za-z0-9._%+_-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(x.email)))
    return bad('Alamat email tidak valid.');
  if (!Array.isArray(x.items) || x.items.length < 1 || x.items.length > 8)
    return bad('Keranjang harus berisi 1–8 varian.');
  const validated: GuestOrderItem[] = [];
  const seen = new Set<string>();
  let quantity = 0;
  for (const raw of x.items) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw))
      return bad('Varian keranjang tidak valid.');
    const item = raw as Record<string, unknown>;
    if (typeof item.slug !== 'string' || item.slug.length > 80 ||
      !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.slug) ||
      typeof item.sku !== 'string' || !/^[A-Z0-9-]{3,40}$/.test(item.sku) ||
      !Number.isInteger(item.quantity) || Number(item.quantity) < 1 ||
      Number(item.quantity) > 10 ||
      !Number.isSafeInteger(item.expectedPriceIdr) ||
      Number(item.expectedPriceIdr) < 1 ||
      Number(item.expectedPriceIdr) > 9999999999)
      return bad('Varian atau harga keranjang tidak valid.');
    const sku = item.sku as string;
    if (seen.has(sku)) return bad('SKU keranjang tidak boleh duplikat.');
    seen.add(sku);
    quantity += Number(item.quantity);
    validated.push({
      slug: item.slug as string,
      sku,
      quantity: Number(item.quantity),
      expectedPriceIdr: Number(item.expectedPriceIdr),
    });
  }
  if (quantity > 30) return bad('Maksimal 30 kaos dalam satu pesanan.');
  return {
    ok: true,
    value: {
      requestId: x.requestId,
      name: x.name.trim(),
      phone: x.phone,
      email: x.email.trim().toLowerCase(),
      agreedToPickup: true,
      items: validated,
    },
  };
}
