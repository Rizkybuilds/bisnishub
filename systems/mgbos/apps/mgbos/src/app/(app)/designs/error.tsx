'use client';
export default function DesignError({ reset }: { reset: () => void }) {
  return (
    <section className="card">
      <h1>Library belum dapat dibuka</h1>
      <p>
        Gunakan akun Owner/Admin, pilih brand TeeStock, dan pastikan database
        lokal aktif serta migrasi terpasang.
      </p>
      <button className="btn-secondary" onClick={reset}>
        Coba kembali
      </button>
    </section>
  );
}
