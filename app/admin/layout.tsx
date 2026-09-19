import Link from "next/link";
import { logoutAdminAction } from "@/app/actions/auth";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--cream)",
        color: "var(--ink)",
        fontFamily: "var(--font-geist-sans), Arial, sans-serif",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--line)",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          className="section-shell admin-header-inner"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
                padding: "3px 8px",
                borderRadius: "6px",
                background: "#e8f0ec",
                color: "#46625d",
              }}
            >
              Admin CMS
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link
              href="/"
              target="_blank"
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--muted)",
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
                  border: "1px solid var(--line)",
                  borderRadius: "99px",
                  padding: "8px 14px",
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

      <main style={{ padding: "40px 0 80px" }}>{children}</main>
    </div>
  );
}
