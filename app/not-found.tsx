import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function NotFound() {
  const en = (await getRequestLocale()) === "EN";
  const tr = (id: string, english: string) => en ? english : id;
  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas-cream)", color: "var(--ink-primary)" }}>
      <SiteNav whatsappUrl={null} />

      <main className="section-shell" style={{ minHeight: "65vh", display: "grid", placeItems: "center", padding: "64px 0", textAlign: "center" }}>
        <div style={{ maxWidth: "540px" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "clamp(64px, 12vw, 120px)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-.06em",
              color: "var(--surface-navy)",
              marginBottom: "12px",
            }}
          >
            404
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--surface-navy)", margin: "0 0 12px" }}>
            {tr("Halaman Tidak Ditemukan", "Page Not Found")}
          </h1>
          <p style={{ fontSize: "15px", lineHeight: 1.6, color: "var(--ink-muted)", margin: "0 0 28px" }}>
            {tr("Tautan yang Anda tuju mungkin telah dipindahkan, diperbarui, atau alamat yang dimasukkan belum tepat.", "The page may have moved, changed, or the address may be incorrect.")}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
            <Link href="/" className="button button-primary">
              {tr("Kembali ke Beranda ↗", "Back to Home ↗")}
            </Link>
            <Link href="/start" className="button button-lime">
              {tr("Mulai Proyek Baru ↗", "Start a Project ↗")}
            </Link>
          </div>
        </div>
      </main>

      <footer className="site-footer section-shell">
        <Link className="brand" href="/#top">
          <span className="brand-mark">N</span>
          <span>
            Nexa<span className="brand-dot">.</span>
          </span>
        </Link>
        <p>
          Designing digital experiences
          <br />
          that move businesses forward.
        </p>
        <div className="footer-links">
          <Link href="/privacy">{tr("Kebijakan Privasi", "Privacy Policy")}</Link>
          <Link href="/terms">{tr("Syarat & Ketentuan", "Terms & Conditions")}</Link>
        </div>
        <small>© {new Date().getFullYear()} Nexa Studio. Made with intention.</small>
      </footer>
    </div>
  );
}

