'use client';
export default function RequirementError({ reset }: { reset: () => void }) {
  return (
    <section className="card">
      <h1>Data belum dapat dimuat</h1>
      <p role="alert">
        Koneksi atau akses database bermasalah. Data yang sudah tersimpan tidak
        diubah.
      </p>
      <button className="btn-primary" onClick={reset}>
        Coba lagi
      </button>
    </section>
  );
}
