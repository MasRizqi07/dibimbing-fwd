export default function AdminLoading() {
  return (
    <div className="section-shell page-loading-state" aria-busy="true" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <p>Memuat dashboard admin...</p>
    </div>
  );
}
