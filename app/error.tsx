"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  const incidentId = error.digest ? `ERR-500-${error.digest.slice(0, 8).toUpperCase()}` : "ERR-500-OPERATIONAL";

  return (
    <main className="section-shell page-error-state" role="alert" style={{ minHeight: "65vh" }}>
      <span
        style={{
          display: "inline-block",
          padding: "4px 12px",
          borderRadius: "99px",
          background: "var(--status-warning-bg)",
          color: "#7A3400",
          border: "1px solid var(--status-warning-border)",
          fontSize: "11px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: ".06em",
          marginBottom: "12px",
        }}
      >
        Incident ID: {incidentId}
      </span>
      <h1 style={{ fontSize: "32px", fontWeight: 800, color: "var(--surface-navy)", margin: "0 0 12px" }}>
        Terjadi Kendala Sistem
      </h1>
      <p style={{ maxWidth: "480px", color: "var(--ink-muted)", fontSize: "14px", lineHeight: 1.6, margin: "0 auto 24px" }}>
        Aplikasi mengalami kendala tak terduga. Basis data dan pesan brief yang telah dikirim tetap aman. Silakan muat ulang halaman atau kembali ke beranda.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <button type="button" className="button button-primary" onClick={reset}>
          Muat Ulang Halaman ↻
        </button>
        <Link href="/" className="button button-outline">
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
