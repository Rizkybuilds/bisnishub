'use client';
export default function QuoteError({ reset }: { reset: () => void }) {
  return (
    <section>
      <h1>Penawaran belum dapat dimuat</h1>
      <p>
        Pastikan akun memiliki akses penawaran dan koneksi database tersedia.
      </p>
      <button className="btn-primary" onClick={reset}>
        Coba lagi
      </button>
    </section>
  );
}
