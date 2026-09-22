import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — Nexa Studio",
  description:
    "Ketentuan layanan, transfer kepemilikan kode sumber 100%, garansi perbaikan bug 60 hari, dan kerangka kerja rekayasa digital Nexa Studio.",
};

export default function TermsPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@nexastudio.id";

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas-cream)", color: "var(--ink-primary)" }}>
      <SiteNav whatsappUrl={whatsappUrl} />

      <main style={{ padding: "48px 0 80px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", paddingInline: "20px" }}>
          {/* Breadcrumbs */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", fontSize: "13px" }}>
            <Link href="/" style={{ color: "var(--ink-muted)", fontWeight: 600 }}>
              ← Kembali ke Beranda
            </Link>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-muted)" }}>
              Dokumen Hukum Resmi
            </span>
          </div>

          {/* Document Header */}
          <header style={{ marginBottom: "36px" }}>
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "99px",
                background: "var(--accent-lime)",
                color: "var(--surface-navy)",
                fontSize: "11px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".06em",
                marginBottom: "12px",
              }}
            >
              Syarat & Ketentuan Layanan
            </span>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.04em", margin: "0 0 12px", color: "var(--surface-navy)" }}>
              Kerangka Kerja Operasional & Hak Kekayaan Intelektual
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "12px", color: "var(--ink-muted)" }}>
              <span>Terakhir diperbarui: 21 September 2026</span>
              <span>•</span>
              <span>Versi Dokumen 1.0</span>
              <span>•</span>
              <strong style={{ color: "var(--surface-navy)" }}>Nexa Studio</strong>
            </div>
          </header>

          {/* Main Sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
            <article>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>
                01
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0 10px", color: "var(--surface-navy)" }}>
                Ruang Lingkup Kemitraan & Tahapan Kerja (Sprint Delivery)
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--ink-muted)", margin: 0 }}>
                Setiap proyek rekayasa digital bersama Nexa Studio diikat dalam Statement of Work (SOW) terperinci. Alur pengerjaan mengadopsi 4-Step Framework (Discovery & Audit, Strategy & UI/UX, Scalable Engineering, Launch & Optimize) dengan checkpoint demo mingguan yang disepakati bersama.
              </p>
            </article>

            <article>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>
                02
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0 10px", color: "var(--surface-navy)" }}>
                100% Kepemilikan Kode Sumber & Aset Intelektual
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--ink-muted)", margin: 0 }}>
                Setelah pelunasan invoice final diselesaikan, seluruh hak cipta kode sumber (Next.js components, backend logic, basis data) serta aset grafis (Figma files, brand assets, packaging print) dialihkan secara penuh dan tanpa syarat ke akun repositori GitHub / organisasi bisnis klien. Klien berhak memodifikasi, mendistribusikan, atau menghosting aplikasi di infrastruktur pilihan mereka.
              </p>
            </article>

            <article>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>
                03
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0 10px", color: "var(--surface-navy)" }}>
                Masa Garansi Bug 60 Hari Pasca Peluncuran
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--ink-muted)", margin: 0 }}>
                Kami menjamin fungsionalitas sistem berjalan stabil. Setiap cacat kode (bug), inkonsistensi rendering lintas peramban modern, atau kendala integrasi API pihak ketiga yang tercakup dalam ruang lingkup awal akan diperbaiki tanpa biaya tambahan selama 60 hari kalender sejak tanggal rilis produksi.
              </p>
            </article>

            <article>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>
                04
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0 10px", color: "var(--surface-navy)" }}>
                Kerahasiaan Data & Perjanjian Non-Disclosure (MNDA)
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--ink-muted)", margin: 0 }}>
                Semua rahasia dagang, strategi bisnis, metrik konversi internal, dan dokumen RFP yang dibagikan kepada tim kami diperlakukan dengan standar kerahasiaan paling ketat dan dilindungi Mutual Non-Disclosure Agreement (MNDA) formal.
              </p>
            </article>
          </div>

          <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid var(--border-line)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <Link href="/" className="button button-outline">
              ← Kembali ke Beranda
            </Link>
            <Link href="/privacy" className="text-link">
              Baca Kebijakan Privasi Data →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
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
          {contactEmail && <a href={`mailto:${contactEmail}`}>{contactEmail}</a>}
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp ↗
            </a>
          )}
          <Link href="/privacy">Kebijakan Privasi</Link>
          <Link href="/terms">Syarat & Ketentuan</Link>
        </div>
        <small>© {new Date().getFullYear()} Nexa Studio. Made with intention.</small>
      </footer>
    </div>
  );
}

