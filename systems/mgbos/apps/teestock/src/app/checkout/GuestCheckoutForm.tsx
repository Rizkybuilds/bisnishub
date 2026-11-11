'use client';

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useLiveCart } from '../../components/LiveCartProvider';
import { formatProductPrice } from '../../lib/storefront-product';
import { submitGuestCheckoutAction } from './actions';
import type { GuestOrderResult } from '../../lib/checkout.server';

export function GuestCheckoutForm({ enabled }: { enabled: boolean }) {
  const { lines, count, subtotal, loaded, clear } = useLiveCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<GuestOrderResult | null>(null);
  const lastFingerprint = useRef('');
  const requestId = useRef('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending || !enabled || !loaded || lines.length === 0) return;
    const items = lines.map((item) => ({
      slug: item.slug,
      sku: item.sku,
      quantity: item.quantity,
      expectedPriceIdr: item.priceIdr,
    }));
    const fingerprint = JSON.stringify({ items, name, phone, email });
    if (lastFingerprint.current !== fingerprint) {
      requestId.current = crypto.randomUUID();
      lastFingerprint.current = fingerprint;
    }
    setSending(true);
    setResult(null);
    try {
      const returned = await submitGuestCheckoutAction({
        requestId: requestId.current,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        honeypot,
        agreedToPickup: agreed,
        items,
      });
      setResult(returned);
      if (returned.success) clear();
    } catch {
      setResult({
        success: false,
        error:
          'Koneksi terputus. Coba lagi dengan data yang sama untuk menghindari pesanan ganda.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="ts-cart-wrap">
      <div className="ts-checkout-heading">
        <span className="ts-public-kicker">TEESTOCK / GUEST CHECKOUT</span>
        <h1>Pesan sebagai tamu.</h1>
        <p>
          Tanpa akun. Harga diverifikasi server; pembayaran hanya melalui
          konfirmasi manual.
        </p>
      </div>
      {result?.success ? (
        <div className="ts-checkout-success" role="status">
          <span className="ts-public-kicker">ORDER RECEIVED / UNPAID</span>
          <h2>Pesanan tercatat.</h2>
          <p>Nomor pesanan</p>
          <strong className="ts-checkout-number">{result.orderNumber}</strong>
          <p>
            Nilai produk {formatProductPrice(result.totalIdr)} · Pengambilan
            mandiri
          </p>
          <div className="ts-checkout-warning">
            <strong>Menunggu pembayaran manual</strong>
            <p>
              Tidak ada QRIS atau instruksi transfer aktif pada tahap ini.
              Jangan mengirim uang sebelum mendapatkan instruksi resmi dari
              TeeStock. Pesanan belum diproduksi dan belum dianggap lunas.
            </p>
          </div>
          <p>
            Simpan nomor pesanan ini untuk menghubungi admin. Jangan membagikan
            nomor telepon atau data pelanggan di ruang publik.
          </p>
          <Link href="/shop" className="ts-cart-primary">
            Kembali ke koleksi ↗
          </Link>
        </div>
      ) : (
        <div className="ts-cart-layout">
          <div className="ts-checkout-form-panel">
            {!enabled && (
              <div className="ts-checkout-warning" role="status">
                <strong>Checkout belum diaktifkan.</strong>
                <p>
                  Katalog dan keranjang bisa dijelajahi, tetapi belum ada
                  pesanan yang dapat dikirim hingga pilot checkout disetujui dan
                  environment MGBOS siap.
                </p>
              </div>
            )}
            {!loaded ? (
              <p role="status">Memuat keranjang…</p>
            ) : lines.length === 0 ? (
              <div className="ts-cart-empty">
                <p>Keranjang masih kosong.</p>
                <Link href="/shop">Cari produk di koleksi →</Link>
              </div>
            ) : (
              <form onSubmit={(event) => void handleSubmit(event)}>
                <h2>01 / Kontak penerima</h2>
                <div className="ts-checkout-fields">
                  <label>
                    Nama lengkap <span aria-hidden="true">*</span>
                    <input
                      required
                      value={name}
                      autoComplete="name"
                      maxLength={100}
                      placeholder="Nama penerima"
                      onChange={(event) => setName(event.target.value)}
                    />
                  </label>
                  <label>
                    Nomor WhatsApp <span aria-hidden="true">*</span>
                    <input
                      required
                      value={phone}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      minLength={9}
                      maxLength={17}
                      placeholder="08xxxxxxxxxx"
                      onChange={(event) =>
                        setPhone(event.target.value.replace(/[\s()-]/g, ''))
                      }
                    />
                  </label>
                  <label>
                    Email (opsional)
                    <input
                      type="email"
                      value={email}
                      autoComplete="email"
                      maxLength={160}
                      placeholder="nama@email.com"
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </label>
                  <label className="ts-honeypot" aria-hidden="true">
                    Nama website
                    <input
                      value={honeypot}
                      tabIndex={-1}
                      autoComplete="off"
                      onChange={(event) => setHoneypot(event.target.value)}
                    />
                  </label>
                </div>
                <h2>02 / Metode penerimaan</h2>
                <div className="ts-checkout-pickup">
                  <strong>Ambil sendiri di workshop</strong>
                  <p>
                    Tanpa biaya kirim. Lokasi serta jadwal pengambilan akan
                    dikonfirmasi admin sebelum penyerahan. Kurir belum tersedia
                    pada pilot ini.
                  </p>
                </div>
                <h2>03 / Persetujuan</h2>
                <label className="ts-checkout-consent">
                  <input
                    type="checkbox"
                    checked={agreed}
                    required
                    onChange={(event) => setAgreed(event.target.checked)}
                  />
                  <span>
                    Saya memahami bahwa pesanan ini untuk pengambilan mandiri,
                    barang dibuat setelah pembayaran diverifikasi, dan tidak ada
                    metode pembayaran aktif pada halaman ini.
                  </span>
                </label>
                {result && !result.success && (
                  <p className="ts-checkout-error" role="alert">
                    {result.error}
                  </p>
                )}
                <button
                  className="ts-cart-primary ts-checkout-submit"
                  type="submit"
                  disabled={!enabled || !agreed || sending}
                >
                  {sending
                    ? 'Mencatat pesanan…'
                    : 'Buat pesanan — Menunggu Pembayaran'}
                </button>
              </form>
            )}
          </div>
          <aside className="ts-cart-summary">
            <span className="ts-public-kicker">ORDER PREVIEW</span>
            <h2>Ringkasan.</h2>
            {lines.map((line) => (
              <div className="ts-checkout-summary-line" key={line.sku}>
                <div>
                  <strong>{line.productTitle}</strong>
                  <span>
                    {line.color} · {line.size} × {line.quantity}
                  </span>
                </div>
                <strong>
                  {formatProductPrice(line.priceIdr * line.quantity)}
                </strong>
              </div>
            ))}
            <div className="ts-cart-summary-row">
              <span>Subtotal ({count} kaos)</span>
              <strong>{formatProductPrice(subtotal)}</strong>
            </div>
            <div className="ts-cart-summary-row">
              <span>Pengambilan di workshop</span>
              <strong>Rp0</strong>
            </div>
            <div className="ts-cart-summary-total">
              <span>Total estimasi</span>
              <strong>{formatProductPrice(subtotal)}</strong>
            </div>
            <p>
              Server akan memeriksa harga dan status produk saat pesanan dibuat.
              Belum ada pembayaran otomatis.
            </p>
            <Link href="/cart" className="ts-cart-back">
              ← Periksa keranjang
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
