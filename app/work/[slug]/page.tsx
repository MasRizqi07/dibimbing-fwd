import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";
import { getRequestLocale } from "@/lib/i18n/server";

interface PageProps { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getRequestLocale()]);
  const study = getCaseStudy(slug);
  if (!study) return { title: locale === "EN" ? "Concept not found | Nexa Studio" : "Konsep tidak ditemukan | Nexa Studio" };
  return {
    title: `${study.title} — ${locale === "EN" ? "Visual concept" : "Konsep visual"} | Nexa Studio`,
    description: locale === "EN" ? study.categoryEn : study.categoryId,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const [{ slug }, locale] = await Promise.all([params, getRequestLocale()]);
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const en = locale === "EN";
  const tr = (id: string, english: string) => en ? english : id;
  const next = caseStudies[study.nextSlug];
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas-cream)", color: "var(--ink-primary)" }}>
      <SiteNav whatsappUrl={whatsappUrl} />
      <main className="section-shell" style={{ paddingBlock: "48px 80px" }}>
        <Link href="/#work" className="text-link">← {tr("Kembali ke portofolio", "Back to portfolio")}</Link>
        <header style={{ maxWidth: 760, marginBlock: "36px 28px" }}>
          <span className="eyebrow" style={{ color: "var(--surface-navy)" }}>{tr("Eksplorasi Desain", "Design Exploration")}</span>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 58px)", margin: "12px 0" }}>{study.title}</h1>
          <p style={{ fontSize: 18 }}>{en ? study.categoryEn : study.categoryId}</p>
          <p style={{ color: "var(--ink-muted)", lineHeight: 1.7 }}>
            {tr("Gambar ini berasal dari prototipe di folder Design/. Halaman ini menampilkan arah visual dan belum membuktikan proyek klien, teknologi yang telah diterapkan, hasil bisnis, atau dukungan dari merek yang disebut.", "This image comes from a prototype in the Design/ folder. This page presents a visual direction; it does not establish a client engagement, deployed technology, business results, or endorsement by the named brand.")}
          </p>
        </header>
        <div style={{ position: "relative", width: "100%", minHeight: "min(60vw, 580px)", borderRadius: 20, overflow: "hidden", border: "1px solid var(--border-line)" }}>
          <Image src={study.imagePath} alt={en ? `${study.title} visual concept` : study.visualAlt} fill priority sizes="(max-width: 1160px) 100vw, 1160px" style={{ objectFit: "cover" }} />
        </div>
        <section style={{ marginTop: 48, padding: 28, borderRadius: 18, background: "white", border: "1px solid var(--border-line)" }}>
          <h2>{tr("Apa yang ditampilkan", "What this shows")}</h2>
          <p style={{ lineHeight: 1.7, color: "var(--ink-muted)" }}>
            {tr("Komposisi, tipografi, warna, dan tata letak pada mockup ini menjadi bahan diskusi awal. Ruang lingkup dan hasil proyek nyata ditentukan bersama melalui brief dan perjanjian kerja.", "The composition, typography, colors, and layout in this mockup provide a starting point for discussion. The scope and outcomes of a real project are agreed through a brief and work agreement.")}
          </p>
          <Link href="/start" className="button button-primary">{tr("Diskusikan Proyek ↗", "Discuss a Project ↗")}</Link>
        </section>
        <nav style={{ marginTop: 48, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <Link href="/#work" className="text-link">{tr("Semua konsep", "All concepts")}</Link>
          <Link href={`/work/${next.slug}`} className="text-link">{tr("Konsep berikutnya", "Next concept")}: {next.title} →</Link>
        </nav>
      </main>
    </div>
  );
}
