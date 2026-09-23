"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { lang } = useLanguage();
  const tr = (id: string, en: string) => lang === "EN" ? en : id;
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
        {tr("Terjadi Kendala Sistem", "Something Went Wrong")}
      </h1>
      <p style={{ maxWidth: "480px", color: "var(--ink-muted)", fontSize: "14px", lineHeight: 1.6, margin: "0 auto 24px" }}>
        {tr("Aplikasi mengalami kendala tak terduga. Silakan coba lagi atau kembali ke beranda.", "The application encountered an unexpected error. Please try again or return home.")}
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <button type="button" className="button button-primary" onClick={reset}>
          {tr("Coba Lagi ↻", "Try Again ↻")}
        </button>
        <Link href="/" className="button button-outline">
          {tr("Kembali ke Beranda", "Back to Home")}
        </Link>
      </div>
    </main>
  );
}
