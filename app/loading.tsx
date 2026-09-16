export default function Loading() {
  return (
    <main className="section-shell" aria-busy="true" aria-live="polite">
      <div className="page-loading-state">
        <span className="loading-spinner" aria-hidden="true" />
        <p>Memuat Nexa Studio...</p>
      </div>
    </main>
  );
}
