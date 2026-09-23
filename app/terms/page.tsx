import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { getRequestLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return (await getRequestLocale()) === "EN"
    ? { title: "Terms & Conditions — Nexa Studio", description: "Nexa Studio service scope, ownership, support, and confidentiality terms." }
    : { title: "Syarat & Ketentuan — Nexa Studio", description: "Ruang lingkup layanan, kepemilikan, dukungan, dan kerahasiaan proyek Nexa Studio." };
}

export default async function TermsPage() {
  const en = (await getRequestLocale()) === "EN";
  const tr = (id: string, english: string) => en ? english : id;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;
  const sections = [
    { title: tr("Ruang Lingkup dan Tahapan Kerja", "Scope and Delivery Stages"), body: tr("Ruang lingkup, hasil kerja, jadwal, biaya, dan titik persetujuan tiap proyek ditetapkan dalam Statement of Work (SOW) yang disepakati para pihak. Tahapan discovery, desain, pengembangan, dan peluncuran disesuaikan dengan SOW tersebut.", "Each project's scope, deliverables, schedule, fees, and approval points are defined in a Statement of Work (SOW) agreed by the parties. Discovery, design, development, and launch stages follow that SOW.") },
    { title: tr("Kepemilikan Hasil Kerja", "Ownership of Deliverables"), body: tr("Pengalihan hak atas kode sumber dan aset proyek, termasuk waktu pengalihan, pengecualian untuk komponen pihak ketiga, dan izin penggunaan, mengikuti SOW serta perjanjian tertulis yang berlaku. Hasil kerja yang telah dibayar penuh diserahkan sesuai ketentuan tersebut.", "Transfer of rights in source code and project assets, including timing, third-party component exclusions, and usage permissions, follows the applicable SOW and written agreement. Fully paid deliverables are handed over under those terms.") },
    { title: tr("Perbaikan Bug dan Dukungan", "Bug Fixes and Support"), body: tr("Masa dan cakupan perbaikan bug setelah peluncuran, termasuk pengecualian untuk perubahan pihak ketiga dan permintaan fitur baru, ditentukan dalam SOW. Janji garansi 60 hari hanya berlaku jika dicantumkan secara tegas di perjanjian proyek.", "Post-launch bug-fix periods and coverage, including exclusions for third-party changes and new feature requests, are set out in the SOW. A 60-day warranty applies only where expressly included in the project agreement.") },
    { title: tr("Kerahasiaan", "Confidentiality"), body: tr("Informasi proyek yang bersifat rahasia diperlakukan sesuai perjanjian kerahasiaan tertulis yang berlaku. Perjanjian kerahasiaan timbal balik (MNDA) berlaku jika telah ditandatangani oleh kedua pihak.", "Confidential project information is handled under the applicable written confidentiality agreement. A mutual non-disclosure agreement (MNDA) applies when signed by both parties.") },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas-cream)", color: "var(--ink-primary)" }}>
      <SiteNav whatsappUrl={whatsappUrl} />
      <main className="section-shell" style={{ maxWidth: 840, paddingBlock: "48px 80px" }}>
        <Link href="/" className="text-link">← {tr("Kembali ke Beranda", "Back to Home")}</Link>
        <header style={{ marginBlock: "32px 40px" }}>
          <span className="eyebrow" style={{ color: "var(--surface-navy)" }}>{tr("Ketentuan Layanan", "Service Terms")}</span>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 44px)", lineHeight: 1.15, margin: "12px 0" }}>{tr("Syarat & Ketentuan", "Terms & Conditions")}</h1>
          <p style={{ color: "var(--ink-muted)" }}>{tr("Terakhir diperbarui: 21 September 2026", "Last updated: 21 September 2026")}</p>
          {en && <p role="note" style={{ padding: 16, border: "1px solid var(--border-line)", borderRadius: 12, background: "white" }}>English translation draft. Pending legal review before release.</p>}
          <p>{tr("Ringkasan berikut perlu dibaca bersama SOW dan perjanjian proyek yang ditandatangani.", "Read this summary together with the signed SOW and project agreement.")}</p>
        </header>
        <div style={{ display: "grid", gap: 32 }}>
          {sections.map((section, index) => (
            <section key={section.title}>
              <span className="eyebrow" style={{ color: "var(--surface-navy)" }}>{String(index + 1).padStart(2, "0")}</span>
              <h2 style={{ fontSize: 22, margin: "6px 0 12px" }}>{section.title}</h2>
              <p style={{ lineHeight: 1.7, color: "var(--ink-muted)" }}>{section.body}</p>
            </section>
          ))}
        </div>
        <nav style={{ display: "flex", gap: 24, marginTop: 36 }}>
          <Link href="/" className="text-link">{tr("Beranda", "Home")}</Link>
          <Link href="/privacy" className="text-link">{tr("Kebijakan Privasi", "Privacy Policy")}</Link>
        </nav>
      </main>
    </div>
  );
}
