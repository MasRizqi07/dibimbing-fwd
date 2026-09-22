import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseStudy, caseStudies } from "@/lib/case-studies";
import SiteNav from "@/components/SiteNav";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Studi Kasus | Nexa Studio" };
  return {
    title: `${study.title} — Studi Kasus | Nexa Studio`,
    description: study.subtitle,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    notFound();
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas-cream)", color: "var(--ink-primary)" }}>
      <SiteNav whatsappUrl={whatsappUrl} />

      <main style={{ paddingBottom: "80px" }}>
        {/* Case Study Header Banner */}
        <section
          style={{
            background: "rgba(255,255,255,0.6)",
            borderBottom: "1px solid var(--border-line)",
            padding: "48px 0 36px",
          }}
        >
          <div className="section-shell">
            {/* Breadcrumb Navigation */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "24px",
                fontSize: "13px",
              }}
            >
              <Link
                href="/#work"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 600,
                  color: "var(--ink-muted)",
                }}
              >
                ← Kembali ke Semua Studi Kasus
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "99px",
                    background: "#e8f0ec",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    color: "var(--surface-navy)",
                  }}
                >
                  Klien: {study.clientName}
                </span>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "99px",
                    background: "#e8f0ec",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--surface-navy)",
                  }}
                >
                  Tahun {study.year}
                </span>
              </div>
            </div>

            {/* Impact Hero Headline */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px", alignItems: "end" }}>
              <div>
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
                    marginBottom: "14px",
                  }}
                >
                  {study.outcomeBadge}
                </span>
                <h1
                  style={{
                    fontSize: "clamp(32px, 4.5vw, 48px)",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: "-.04em",
                    margin: 0,
                    color: "var(--surface-navy)",
                  }}
                >
                  {study.subtitle}
                </h1>
              </div>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: 1.65,
                  color: "var(--ink-muted)",
                  margin: 0,
                }}
              >
                Mentransformasi kehadiran digital {study.clientName} dengan performa rendering sub-detik, identitas merek konsisten, dan alur konversi tanpa friksi.
              </p>
            </div>

            {/* Project Spec Matrix */}
            <div
              className="spec-matrix-bar"
              style={{ marginTop: "36px" }}
            >
              <div>
                <span style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-muted)", marginBottom: "4px" }}>
                  Industri
                </span>
                <strong style={{ fontSize: "14px", color: "var(--surface-navy)" }}>{study.industry}</strong>
              </div>
              <div>
                <span style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-muted)", marginBottom: "4px" }}>
                  Durasi Kerja
                </span>
                <strong style={{ fontSize: "14px", color: "var(--surface-navy)" }}>{study.duration}</strong>
              </div>
              <div>
                <span style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-muted)", marginBottom: "4px" }}>
                  Teknologi Terpasang
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {study.techStack.map((tech) => (
                    <span className="tech-chip" key={tech}>{tech}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <a
                  href={study.liveUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-primary"
                  style={{ width: "100%", textAlign: "center" }}
                >
                  Kunjungi Situs Live ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Visual Showcase Mockup */}
        <section className="section-shell" style={{ marginTop: "36px" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "clamp(280px, 50vw, 560px)",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid var(--border-line)",
              boxShadow: "0 20px 50px rgba(16,42,49,0.1)",
            }}
          >
            <Image
              src={study.imagePath}
              alt={study.visualAlt}
              fill
              priority
              style={{ objectFit: "cover" }}
              sizes="(max-width: 1160px) 100vw, 1160px"
            />
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                background: "rgba(16, 42, 49, 0.85)",
                color: "#ffffff",
                backdropFilter: "blur(8px)",
                padding: "8px 14px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-lime)" }} />
              <span>Studi Kasus Visual: Packaging Print, Web Storefront & Menu System</span>
            </div>
          </div>
        </section>

        {/* Main Editorial Content Body */}
        <section className="section-shell" style={{ marginTop: "60px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "48px", alignItems: "start" }}>
            {/* Left Column: Scope Deliverables */}
            <aside
              style={{
                background: "#ffffff",
                padding: "28px",
                borderRadius: "18px",
                border: "1px solid var(--border-line)",
                position: "sticky",
                top: "100px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-line)", paddingBottom: "14px", marginBottom: "18px" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-muted)" }}>
                  Cakupan Deliverables
                </span>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", background: "var(--canvas-cream)", borderRadius: "6px" }}>
                  {study.deliverables.length} Modul
                </span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
                {study.deliverables.map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", lineHeight: 1.5 }}>
                    <span style={{ color: "#668300", fontWeight: 900, fontSize: "15px" }}>✓</span>
                    <span style={{ color: "var(--ink-primary)", fontWeight: 500 }}>{item}</span>
                  </li>
                ))}
              </ul>
              <div style={{ borderTop: "1px solid var(--border-line)", marginTop: "20px", paddingTop: "14px", fontSize: "12px", color: "var(--ink-muted)" }}>
                <strong style={{ color: "var(--ink-primary)", display: "block", marginBottom: "4px" }}>Tim Proyek:</strong>
                {study.team}
              </div>
            </aside>

            {/* Right Column: Case Narrative */}
            <div style={{ display: "flex", flexDirection: "column", gap: "54px" }}>
              {/* 01 Challenge */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--ink-muted)" }}>01</span>
                  <div style={{ height: "1px", background: "var(--border-line)", flex: 1 }} />
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--ink-muted)" }}>
                    Latar Belakang & Problem
                  </span>
                </div>
                <h2 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-.03em", color: "var(--surface-navy)", marginBottom: "14px" }}>
                  {study.challenge.heading}
                </h2>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--ink-muted)", marginBottom: "20px" }}>
                  {study.challenge.description}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                  {study.challenge.points.map((point) => (
                    <div
                      key={point.title}
                      style={{
                        padding: "18px",
                        borderRadius: "14px",
                        background: "#fff5f5",
                        border: "1px solid #fed7d7",
                      }}
                    >
                      <strong style={{ display: "block", fontSize: "13px", color: "#c53030", marginBottom: "6px" }}>
                        ⚠ {point.title}
                      </strong>
                      <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.6, color: "#742a2a" }}>
                        {point.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 02 Architectural Solution */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--ink-muted)" }}>02</span>
                  <div style={{ height: "1px", background: "var(--border-line)", flex: 1 }} />
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--ink-muted)" }}>
                    Solusi Rekayasa
                  </span>
                </div>
                <h2 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-.03em", color: "var(--surface-navy)", marginBottom: "14px" }}>
                  {study.solution.heading}
                </h2>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--ink-muted)", marginBottom: "24px" }}>
                  {study.solution.description}
                </p>

                {/* Architecture Diagram Box */}
                <div
                  style={{
                    background: "var(--surface-navy)",
                    color: "#ffffff",
                    padding: "28px",
                    borderRadius: "18px",
                    boxShadow: "0 16px 40px rgba(16,42,49,0.18)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent-lime)" }}>
                      ⚙ {study.solution.architectureTitle}
                    </span>
                    <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", padding: "3px 8px", borderRadius: "99px", background: "rgba(255,255,255,0.1)", color: "var(--accent-lime)" }}>
                      {study.solution.architectureLatency}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    {study.solution.steps.map((step) => (
                      <div
                        key={step.step}
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          padding: "18px",
                          borderRadius: "12px",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <strong style={{ display: "block", fontSize: "13px", color: "var(--accent-lime)", marginBottom: "8px" }}>
                          {step.title}
                        </strong>
                        <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.6, color: "#d2dedc" }}>
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 03 Measurable Impact (KPI Cards) */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--ink-muted)" }}>03</span>
                  <div style={{ height: "1px", background: "var(--border-line)", flex: 1 }} />
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--ink-muted)" }}>
                    Hasil Terukur
                  </span>
                </div>
                <h2 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-.03em", color: "var(--surface-navy)", marginBottom: "20px" }}>
                  Dampak Langsung Terhadap Penjualan dan Loyalitas Pelanggan
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  {study.kpis.map((kpi) => (
                    <div
                      key={kpi.label}
                      style={{
                        padding: "24px",
                        background: "#ffffff",
                        borderRadius: "16px",
                        border: "1px solid var(--border-line)",
                        boxShadow: "0 6px 20px rgba(16,42,49,0.03)",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "36px",
                          fontWeight: 900,
                          lineHeight: 1,
                          color: "var(--surface-navy)",
                          letterSpacing: "-.04em",
                          marginBottom: "8px",
                        }}
                      >
                        {kpi.value}
                      </span>
                      <strong style={{ display: "block", fontSize: "13px", color: "var(--ink-primary)", marginBottom: "6px" }}>
                        {kpi.label}
                      </strong>
                      <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.5, color: "var(--ink-muted)" }}>
                        {kpi.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 04 Client Testimonial */}
              <div
                style={{
                  background: "rgba(255,255,255,0.7)",
                  padding: "32px",
                  borderRadius: "20px",
                  border: "1px solid var(--border-line)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "20px",
                    fontSize: "72px",
                    lineHeight: 1,
                    fontFamily: "serif",
                    color: "rgba(16,42,49,0.06)",
                    pointerEvents: "none",
                  }}
                >
                  “
                </div>
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: 1.7,
                    fontStyle: "italic",
                    color: "var(--surface-navy)",
                    margin: "0 0 20px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {study.testimonial.quote}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "var(--surface-navy)",
                      color: "var(--accent-lime)",
                      fontWeight: 800,
                      fontSize: "14px",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {study.testimonial.initials}
                  </div>
                  <div>
                    <strong style={{ display: "block", fontSize: "13px", color: "var(--surface-navy)" }}>
                      {study.testimonial.author}
                    </strong>
                    <span style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
                      {study.testimonial.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Project Rail */}
        <section className="section-shell" style={{ marginTop: "72px" }}>
          <div
            style={{
              padding: "32px",
              borderRadius: "20px",
              background: "#ffffff",
              border: "1px solid var(--border-line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            <div>
              <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-muted)", display: "block", marginBottom: "4px" }}>
                Studi Kasus Selanjutnya ({study.nextProject.year})
              </span>
              <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 4px", color: "var(--surface-navy)" }}>
                {study.nextProject.title}
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--ink-muted)" }}>
                {study.nextProject.desc}
              </p>
            </div>
            <Link
              href={`/work/${study.nextProject.slug}`}
              className="button button-primary"
              style={{ minWidth: "180px", textAlign: "center" }}
            >
              Lihat Kasus Ini ↗
            </Link>
          </div>
        </section>
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

