import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { getRequestLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return (await getRequestLocale()) === "EN"
    ? { title: "Privacy & Data — Nexa Studio", description: "How Nexa Studio handles inquiry data, notifications, and privacy requests." }
    : { title: "Kebijakan Privasi & Data — Nexa Studio", description: "Informasi tentang data formulir kontak, notifikasi, dan permintaan privasi." };
}

export default async function PrivacyPage() {
  const en = (await getRequestLocale()) === "EN";
  const tr = (id: string, english: string) => en ? english : id;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@nexastudio.id";
  const sections = [
    { title: tr("Data yang Kami Kumpulkan", "Data We Collect"), paragraphs: [
      tr("Ketika Anda mengirim formulir kontak atau brief proyek, kami menyimpan data yang Anda berikan: nama, email, nomor telepon atau WhatsApp jika diisi, dan isi kebutuhan proyek.", "When you submit a contact form or project brief, we store the information you provide: your name, email, phone or WhatsApp number if supplied, and your project requirements."),
      tr("Jangan kirim informasi sensitif yang tidak diperlukan untuk konsultasi awal.", "Please do not send sensitive information that is unnecessary for an initial consultation."),
    ] },
    { title: tr("Tujuan Pemrosesan", "Why We Process It"), paragraphs: [
      tr("Kami menggunakan data tersebut untuk menanggapi pertanyaan, menilai kebutuhan proyek, menyiapkan proposal, dan mengatur komunikasi lanjutan.", "We use this information to respond to inquiries, assess project needs, prepare proposals, and arrange follow-up communication."),
    ] },
    { title: tr("Keamanan dan Pencegahan Spam", "Security and Spam Prevention"), paragraphs: [
      tr("Formulir menggunakan token anti-spam bertanda tangan, pembatasan ukuran permintaan, pembatasan frekuensi, dan kunci idempotensi untuk mengurangi pengiriman otomatis atau berulang. Perlindungan ini tidak menjamin pencegahan semua penyalahgunaan.", "Forms use signed anti-spam tokens, request-size and rate limits, and idempotency keys to reduce automated or repeated submissions. These controls cannot guarantee prevention of every abuse case."),
    ] },
    { title: tr("Penyimpanan dan Penerima Notifikasi", "Storage and Notification Recipients"), paragraphs: [
      tr("Data formulir disimpan di PostgreSQL untuk menindaklanjuti pertanyaan Anda. Jika notifikasi email atau webhook diaktifkan, nama, alamat email, dan isi pesan juga dikirim ke penyedia atau penerima yang dikonfigurasi untuk tujuan tindak lanjut.", "Form data is stored in PostgreSQL so we can follow up on your inquiry. If email or webhook notifications are enabled, your name, email address, and message are also sent to the configured provider or recipient for follow-up."),
      tr("Pengamanan penyimpanan dan lokasi pemrosesan mengikuti konfigurasi infrastruktur yang digunakan. Integrasi pihak ketiga perlu ditinjau sebelum diaktifkan.", "Storage safeguards and processing location depend on the infrastructure configuration. Third-party integrations require review before they are enabled."),
    ] },
    { title: tr("Akses, Koreksi, dan Penghapusan", "Access, Correction, and Deletion"), paragraphs: [
      tr("Anda dapat meminta akses, perbaikan, atau penghapusan data pribadi sesuai ketentuan yang berlaku. Kami akan memverifikasi identitas pemohon dan menindaklanjuti permintaan sesuai ketentuan tersebut.", "You may request access to, correction of, or deletion of your personal data as provided by applicable law. We will verify the requester's identity and respond in accordance with those requirements."),
    ] },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas-cream)", color: "var(--ink-primary)" }}>
      <SiteNav whatsappUrl={whatsappUrl} />
      <main className="section-shell" style={{ maxWidth: 840, paddingBlock: "48px 80px" }}>
        <Link href="/" className="text-link">← {tr("Kembali ke Beranda", "Back to Home")}</Link>
        <header style={{ marginBlock: "32px 40px" }}>
          <span className="eyebrow" style={{ color: "var(--surface-navy)" }}>{tr("Informasi Privasi", "Privacy Information")}</span>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 44px)", lineHeight: 1.15, margin: "12px 0" }}>{tr("Kebijakan Privasi & Data", "Privacy & Data Policy")}</h1>
          <p style={{ color: "var(--ink-muted)" }}>{tr("Terakhir diperbarui: 21 September 2026", "Last updated: 21 September 2026")}</p>
          {en && <p role="note" style={{ padding: 16, border: "1px solid var(--border-line)", borderRadius: 12, background: "white" }}>English translation draft. Pending legal review before release.</p>}
          <p>{tr("Dokumen ini menjelaskan cara Nexa Studio menangani data yang diberikan melalui formulir situs.", "This document explains how Nexa Studio handles data provided through site forms.")}</p>
        </header>
        <div style={{ display: "grid", gap: 32 }}>
          {sections.map((section, index) => (
            <section key={section.title}>
              <span className="eyebrow" style={{ color: "var(--surface-navy)" }}>{String(index + 1).padStart(2, "0")}</span>
              <h2 style={{ fontSize: 22, margin: "6px 0 12px" }}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph} style={{ lineHeight: 1.7, color: "var(--ink-muted)" }}>{paragraph}</p>)}
            </section>
          ))}
        </div>
        <section style={{ marginTop: 48, padding: 24, border: "1px solid var(--border-line)", borderRadius: 16, background: "white" }}>
          <h2 style={{ fontSize: 20 }}>{tr("Kontak Privasi", "Privacy Contact")}</h2>
          <p>{tr("Kirim pertanyaan atau permintaan terkait data pribadi ke:", "Send questions or personal-data requests to:")}</p>
          <a href={`mailto:${contactEmail}`} className="text-link">{contactEmail}</a>
        </section>
        <nav style={{ display: "flex", gap: 24, marginTop: 36 }}>
          <Link href="/" className="text-link">{tr("Beranda", "Home")}</Link>
          <Link href="/terms" className="text-link">{tr("Syarat & Ketentuan", "Terms & Conditions")}</Link>
        </nav>
      </main>
    </div>
  );
}
