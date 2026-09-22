import Link from "next/link";
import type { Metadata } from "next";
import { logoutAdminAction } from "@/app/actions/auth";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--canvas-cream)",
        color: "var(--ink-primary)",
        fontFamily: "var(--font-geist-sans), Arial, sans-serif",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--border-line)",
          background: "#ffffff",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 2px 10px rgba(16,42,49,0.03)",
        }}
      >
        <div className="section-shell admin-header-inner">
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <Link href="/admin" className="brand">
              <span className="brand-mark">N</span>
              <span>
                Nexa<span className="brand-dot">.</span>
              </span>
            </Link>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                padding: "4px 10px",
                borderRadius: "99px",
                background: "#e8f0ec",
                color: "#275047",
              }}
            >
              CMS Administrator • Single Owner Session
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            {/* Health Indicator Pills */}
            <div className="health-pill" title="Koneksi database PostgreSQL Neon beroperasi prima">
              <span className="health-pill-dot" />
              <span>Database: Connected (200 OK)</span>
            </div>

            <Link
              href="/"
              target="_blank"
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--ink-muted)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Lihat Website ↗
            </Link>

            <form action={logoutAdminAction}>
              <button
                type="submit"
                style={{
                  background: "none",
                  border: "1px solid var(--border-line)",
                  borderRadius: "99px",
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#d04242",
                  cursor: "pointer",
                }}
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <main style={{ padding: "32px 0 80px" }}>{children}</main>
    </div>
  );
}
