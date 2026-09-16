"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="section-shell page-error-state" role="alert">
      <p className="eyebrow">Terjadi kendala</p>
      <h1>Halaman belum bisa dimuat.</h1>
      <p>Silakan coba lagi. Data sensitif dan detail teknis tidak ditampilkan.</p>
      <button type="button" className="button button-primary" onClick={reset}>
        Coba lagi
      </button>
    </main>
  );
}
