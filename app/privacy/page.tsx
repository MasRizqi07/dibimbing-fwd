import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Kebijakan Privasi & Data — Nexa Studio",
  description:
    "Transparansi pemrosesan dan perlindungan data pribadi, enkripsi PostgreSQL, mitigasi spam kriptografis, dan kontak Data Protection Officer (DPO).",
};

export default function PrivacyPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@nexastudio.id";

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas-cream)", color: "var(--ink-primary)" }}>
      <SiteNav whatsappUrl={whatsappUrl} />

      <main style={{ padding: "48px 0 80px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", paddingInline: "20px" }}>
          {/* Top Breadcrumb */}
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
              Kebijakan Privasi & Data
            </span>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-.04em", margin: "0 0 12px", color: "var(--surface-navy)" }}>
              Transparansi Pemrosesan dan Perlindungan Data
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: "12px", color: "var(--ink-muted)" }}>
              <span>Terakhir diperbarui: 21 September 2026</span>
              <span>•</span>
              <span>Versi Dokumen 1.0</span>
              <span>•</span>
              <strong style={{ color: "var(--surface-navy)" }}>Nexa Studio</strong>
            </div>
          </header>

          {/* Commitment Summary Card */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border-line)",
              borderRadius: "16px",
              padding: "24px 28px",
              marginBottom: "40px",
              boxShadow: "0 6px 20px rgba(16,42,49,0.03)",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 10px", color: "var(--surface-navy)" }}>
              Ringkasan Komitmen Kami
            </h2>
            <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.7, color: "var(--ink-muted)" }}>
              Nexa Studio menjamin bahwa formulir kontak dan sistem keterlibatan digital kami dirancang semata-mata untuk mengumpulkan data esensial yang mutlak diperlukan dalam konsultasi proyek awal. Kami menolak praktik pelacakan invasif pihak ketiga dan tidak pernah memperjualbelikan informasi Anda ke pihak mana pun.
            </p>
          </div>

          {/* Structured Policy Articles */}
          <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
            {/* 01 */}
            <article>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>
                01
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0 10px", color: "var(--surface-navy)" }}>
                Data yang Kami Kumpulkan
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--ink-muted)", marginBottom: "16px" }}>
                Saat Anda mengirim formulir kontak atau onboarding brief proyek, kami hanya merekam data yang Anda berikan secara sadar dan sukarela:
              </p>
              <div style={{ display: "grid", gap: "12px", background: "rgba(255,255,255,0.7)", padding: "18px", borderRadius: "14px", border: "1px solid var(--border-line)" }}>
                <div>
                  <strong style={{ display: "block", fontSize: "13px", color: "var(--surface-navy)" }}>Nama Lengkap & Jabatan</strong>
                  <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>Sebagai identitas korespondensi resmi perwakilan bisnis atau inisiator proyek.</span>
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: "13px", color: "var(--surface-navy)" }}>Alamat Email Bisnis</strong>
                  <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>Kanal primer transmisi ringkasan asesmen kebutuhan, dokumen MNDA, dan penawaran teknis.</span>
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: "13px", color: "var(--surface-navy)" }}>Nomor Telepon / WhatsApp (Opsional)</strong>
                  <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>Digunakan khusus jika Anda memilih percepatan koordinasi waktu rapat atau konfirmasi berkas.</span>
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: "13px", color: "var(--surface-navy)" }}>Ringkasan Brief Proyek & Kebutuhan Solusi</strong>
                  <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>Catatan kontekstual untuk membantu lead technologist kami menyusun rekomendasi arsitektur yang tepat.</span>
                </div>
              </div>
            </article>

            {/* 02 */}
            <article>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>
                02
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0 10px", color: "var(--surface-navy)" }}>
                Tujuan Penggunaan Data
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--ink-muted)", marginBottom: "12px" }}>
                Data pemohon diproses secara ketat menurut mandat operasional profesional kami:
              </p>
              <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", lineHeight: 1.6, color: "var(--ink-muted)" }}>
                <li><strong>Merespons Pertanyaan Strategis:</strong> Melakukan analisis kelayakan terhadap scope yang Anda paparkan sebelum sesi konsultasi digelar.</li>
                <li><strong>Penyusunan Proposal Komersial & Teknis:</strong> Merancang timeline pengerjaan, estimasi biaya engineering, serta deployment roadmap yang relevan.</li>
                <li><strong>Komunikasi Terarah:</strong> Koordinasi penjadwalan presentasi konsep dan demonstrasi prototipe via kanal yang Anda tentukan.</li>
              </ul>
            </article>

            {/* 03 */}
            <article>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>
                03
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0 10px", color: "var(--surface-navy)" }}>
                Keamanan & Pencegahan Spam Presisi
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--ink-muted)", marginBottom: "14px" }}>
                Kami mengimplementasikan perimeter keamanan berlapis tanpa membebani pengalaman Anda dengan sistem CAPTCHA visual usang:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                <div style={{ background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-line)" }}>
                  <strong style={{ display: "block", fontSize: "13px", color: "var(--surface-navy)", marginBottom: "4px" }}>Cryptographic Anti-Spam</strong>
                  <span style={{ fontSize: "12px", color: "var(--ink-muted)", lineHeight: 1.5 }}>Setiap pengiriman diverifikasi dengan token bertanda tangan kriptografis berbasis waktu HMAC.</span>
                </div>
                <div style={{ background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-line)" }}>
                  <strong style={{ display: "block", fontSize: "13px", color: "var(--surface-navy)", marginBottom: "4px" }}>Idempotency Hashing</strong>
                  <span style={{ fontSize: "12px", color: "var(--ink-muted)", lineHeight: 1.5 }}>Mencegah duplikasi data submisi dan race conditions dengan hash kunci UUID unik.</span>
                </div>
                <div style={{ background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-line)" }}>
                  <strong style={{ display: "block", fontSize: "13px", color: "var(--surface-navy)", marginBottom: "4px" }}>Strict Payload Quota (32KB)</strong>
                  <span style={{ fontSize: "12px", color: "var(--ink-muted)", lineHeight: 1.5 }}>Ambang batas ketat untuk menolak injeksi muatan biner berbahaya dan script injection.</span>
                </div>
                <div style={{ background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-line)" }}>
                  <strong style={{ display: "block", fontSize: "13px", color: "var(--surface-navy)", marginBottom: "4px" }}>Distributed Rate Limiter</strong>
                  <span style={{ fontSize: "12px", color: "var(--ink-muted)", lineHeight: 1.5 }}>Regulasi frekuensi pada tingkat edge CDN demi menjaga stabilitas dan ketersediaan layanan.</span>
                </div>
              </div>
            </article>

            {/* 04 */}
            <article>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>
                04
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0 10px", color: "var(--surface-navy)" }}>
                Notifikasi & Penyimpanan Enkripsi
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--ink-muted)", margin: 0 }}>
                Data transaksi formulir disimpan secara aman di database PostgreSQL terenkripsi (AES-256 pada level storage). Notifikasi otomatis diteruskan secara terisolasi melalui layanan transaksional berstandar kepatuhan SOC2 dan ISO 27001, dengan riwayat log pengiriman yang terisolasi total dari pangkalan data produksi.
              </p>
            </article>

            {/* 05 */}
            <article>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>
                05
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0 10px", color: "var(--surface-navy)" }}>
                Hak Pengguna & Permohonan Penghapusan (Purge)
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--ink-muted)", marginBottom: "12px" }}>
                Sesuai prinsip kedaulatan data dan regulasi Pelindungan Data Pribadi (UU PDP):
              </p>
              <div style={{ background: "rgba(255,255,255,0.7)", padding: "18px", borderRadius: "14px", border: "1px solid var(--border-line)", fontSize: "13px", lineHeight: 1.7, color: "var(--ink-muted)" }}>
                <p style={{ margin: "0 0 8px" }}>
                  Anda berhak setiap saat untuk meninjau rekaman data Anda, memperbarui kesalahan informasi, atau mengajukan pembersihan menyeluruh (<em style={{ color: "var(--ink-primary)", fontStyle: "italic" }}>permanent cryptographic purge</em>).
                </p>
                <p style={{ margin: 0 }}>
                  Untuk mengeksekusi hak ini, cukup ajukan permintaan tertulis ke <a href={`mailto:${contactEmail}`} style={{ color: "var(--surface-navy)", fontWeight: 700, textDecoration: "underline" }}>{contactEmail}</a> dari alamat email yang bersangkutan. Tim kepatuhan kami akan menyelesaikan audit serta penghapusan dalam jangka waktu maksimal 3x24 jam kerja.
                </p>
              </div>
            </article>
          </div>

          {/* DPO Contact Box */}
          <section
            style={{
              marginTop: "48px",
              padding: "28px",
              borderRadius: "16px",
              background: "#ffffff",
              border: "1px solid var(--border-line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-muted)", display: "block", marginBottom: "4px" }}>
                Otoritas Kepatuhan Data
              </span>
              <h4 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 6px", color: "var(--surface-navy)" }}>
                Data Protection Officer (DPO)
              </h4>
              <p style={{ margin: "0 0 12px", fontSize: "13px", color: "var(--ink-muted)" }}>
                Ada pertanyaan khusus mengenai pemrosesan privasi? DPO Nexa Studio siap membantu.
              </p>
              <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                <a href={`mailto:${contactEmail}`} style={{ color: "var(--surface-navy)", fontWeight: 700, textDecoration: "underline" }}>
                  {contactEmail}
                </a>
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" style={{ color: "var(--surface-navy)", fontWeight: 700, textDecoration: "underline" }}>
                    WhatsApp Hotline ↗
                  </a>
                )}
              </div>
            </div>
            <Link href="/" className="button button-primary">
              Kembali ke Beranda
            </Link>
          </section>
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
