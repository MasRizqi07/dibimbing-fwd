"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="section-shell page-error-state" role="alert">
      <p className="eyebrow">Dashboard error</p>
      <h1>Dashboard belum bisa dimuat.</h1>
      <p>Periksa koneksi database atau coba muat ulang halaman.</p>
      <button type="button" className="button button-primary" onClick={reset}>
        Coba lagi
      </button>
    </div>
  );
}
