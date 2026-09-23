import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ContactForm from "@/components/ContactForm";
import ServiceCatalog, { type ServiceItem } from "@/components/ServiceCatalog";
import SiteNav from "@/components/SiteNav";
import { getRequestLocale } from "@/lib/i18n/server";
import { homeCopy } from "@/lib/i18n/home";

export const dynamic = "force-dynamic";

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
}

const services: ServiceItem[] = [
  {
    number: "01",
    title: "High-Performance Web & App",
    description:
      "Website responsif, cepat, dan teroptimasi SEO dengan Next.js dan Tailwind CSS modern yang mengubah pengunjung menjadi pelanggan loyal.",
    icon: "↗",
    category: "Web Development",
    deliverables: ["Jamstack Architecture", "Performance Review", "CMS Integration"],
  },
  {
    number: "02",
    title: "Brand Strategy & Visual Identity",
    description:
      "Identitas visual premium dan konsisten yang membedakan bisnis Anda dari kompetitor di pasar sejak first impression.",
    icon: "✦",
    category: "Branding",
    deliverables: ["Logo & Brand Guidelines", "Typography & Color System", "Collateral Design Pack"],
  },
  {
    number: "03",
    title: "Content Engine & Conversion Copy",
    description:
      "Narasi dan copywriting tajam yang mengedepankan conversion rate dan kredibilitas jangka panjang tanpa harus mulai dari halaman kosong.",
    icon: "◌",
    category: "Konten",
    deliverables: ["Conversion Copywriting", "Editorial Content Calendar", "SEO Strategic Positioning"],
  },
];

const plans: Plan[] = [
  {
    name: "Starter",
    price: "3,5",
    description: "Solusi ideal bagi brand rintisan yang membutuhkan kehadiran online yang profesional.",
    features: ["One-page website", "Copywriting dasar", "Mobile responsive", "Estimasi jadwal dalam proposal"],
  },
  {
    name: "Growth",
    price: "7,5",
    description: "Akselerator penuh untuk bisnis berkembang yang butuh konversi tinggi dan identitas terpadu.",
    features: ["Website hingga 5 halaman", "Complete Visual Identity", "SEO basic setup", "Estimasi jadwal dalam proposal"],
    featured: true,
  },
  {
    name: "Custom",
    price: "Let's talk",
    description: "Solusi bespoke dengan rekayasa teknologi kustom dan integrasi platform kompleks.",
    features: ["Strategi digital bespoke", "Arsitektur cloud & API", "Dukungan sesuai perjanjian", "Timeline fleksibel"],
  },
];

function ArrowIcon() {
  return <span aria-hidden="true" className="arrow-icon">↗</span>;
}

function resolveProjectSlug(title: string): string | null {
  const conceptSlugs: Record<string, string> = {
    "Nomad Coffee Roasters": "nomad-coffee-roasters",
    "Aura Studio": "aura-studio-fashion",
    "Ruang Pulih": "ruang-pulih-holistic-spa",
  };
  return conceptSlugs[title] || null;
}

export default async function Home() {
  const locale = await getRequestLocale();
  const copy = homeCopy[locale];
  const visibleServices = locale === "ID" ? services : services.map((service, index) => ({
    ...service,
    category: index === 2 ? "Content" : service.category,
    description: [
      "Fast, responsive, SEO-friendly websites built with modern Next.js and Tailwind CSS to help visitors become loyal customers.",
      "A distinctive, consistent visual identity that helps your business stand out from the first impression.",
      "Focused stories and copy that support conversions and build long-term trust.",
    ][index],
  }));
  const visiblePlans = locale === "ID" ? plans : plans.map((plan, index) => ({
    ...plan,
    description: [
      "A professional online presence for an emerging brand.",
      "A complete growth package for businesses seeking stronger conversion and a cohesive identity.",
      "Tailored engineering and integrations for complex needs.",
    ][index],
    features: [
      ["One-page website", "Basic copywriting", "Mobile responsive", "Schedule estimate in proposal"],
      ["Up to five website pages", "Complete visual identity", "Basic SEO setup", "Schedule estimate in proposal"],
      ["Tailored digital strategy", "Cloud and API architecture", "Support defined by agreement", "Flexible timeline"],
    ][index],
  }));
  let projects: Array<Awaited<ReturnType<typeof prisma.project.findMany>>[number]> = [];
  try {
    projects = await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
  } catch (error) {
    console.error("Database connection fallback on homepage:", error);
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  return (
    <>
      <SiteNav whatsappUrl={whatsappUrl} />

      <main id="main-content">
        {/* 1. HERO SECTION */}
        <section className="hero section-shell" id="top">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> {copy.heroEyebrow}
            </p>
            <h1>{copy.heroTitle}</h1>
            <p className="hero-description">
              {copy.heroDescription}
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/start">
                {copy.startDiscussion} <ArrowIcon />
              </Link>
            <a className="text-link" href="#work">
              {copy.seeWork} <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>R</span>
              <span>A</span>
              <span>D</span>
            </div>
            <p>
              <strong>{copy.trusted}</strong>
              <br />
              <span>{copy.growFaster}</span>
            </p>
          </div>
        </div>

        <div className="hero-art" aria-label={locale === "ID" ? "Ilustrasi dashboard pertumbuhan bisnis" : "Business growth dashboard illustration"}>
          <div className="art-glow" />
          <div className="growth-card">
            <div className="card-topline">
              <span>{copy.growth}</span>
              <span className="positive">+24.8%</span>
            </div>
            <div className="chart-value">
              Rp 84.6<span>jt</span>
            </div>
            <div className="chart">
              <div className="chart-grid" />
              <svg viewBox="0 0 450 180" role="img" aria-label={copy.chartLabel}>
                <defs>
                  <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#c3f35b" stopOpacity=".34" />
                    <stop offset="100%" stopColor="#c3f35b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 151 C35 140 48 145 72 120 S110 130 139 99 S172 115 199 91 S236 104 263 62 S302 89 326 52 S361 65 383 31 S425 42 450 8 V180 H0Z"
                  fill="url(#chartFill)"
                />
                <path
                  d="M0 151 C35 140 48 145 72 120 S110 130 139 99 S172 115 199 91 S236 104 263 62 S302 89 326 52 S361 65 383 31 S425 42 450 8"
                  fill="none"
                  stroke="#c3f35b"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="383" cy="31" r="6" fill="#101b20" stroke="#c3f35b" strokeWidth="4" />
              </svg>
            </div>
            <div className="chart-labels">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
            </div>
          </div>
          <div className="floating-card floating-card-top">
            <span className="mini-icon">↗</span>
            <span>
              <strong>+38%</strong>
              <small>{copy.newCustomers}</small>
            </span>
          </div>
          <div className="floating-card floating-card-bottom">
            <span className="mini-ring">✓</span>
            <span>
              <strong>{copy.goalReached}</strong>
              <small>{copy.keepGoing}</small>
            </span>
          </div>
          <div className="art-tag">
            nexa<span>.</span>
          </div>
        </div>
      </section>

      {/* 2. CLIENT PROOF BAR */}
      <section className="logo-strip section-shell" aria-label={locale === "ID" ? "Contoh wordmark" : "Wordmark concepts"}>
        <span>
          {copy.clients} <strong>{copy.clientsStrong}</strong>
        </span>
        <div className="client-logos">
          <b>PARAS</b>
          <b>ruang.</b>
          <b>MONO</b>
          <b>elara</b>
          <b>BRIK</b>
        </div>
      </section>

      {/* 3. SERVICE CATALOG */}
      <section className="services section-shell" id="services">
        <div className="section-heading">
          <p className="eyebrow">{copy.servicesEyebrow}</p>
          <h2>
            {copy.servicesTitle} <em>{copy.servicesAccent}</em>
          </h2>
          <p>
            {copy.servicesDescription}
          </p>
        </div>
        <ServiceCatalog services={visibleServices} whatsappUrl={whatsappUrl || "#contact"} />
      </section>

      {/* 4. SELECTED WORK / PORTFOLIO */}
      <section className="work section-shell" id="work">
        <div className="section-heading work-heading">
          <div>
            <p className="eyebrow">{copy.workEyebrow}</p>
            <h2>
              {copy.workTitle} <em>{copy.workAccent}</em>
            </h2>
          </div>
          <Link className="text-link" href="/start">
            {copy.startProject} <ArrowIcon />
          </Link>
        </div>
        <div className="project-grid">
          {projects.length === 0 ? (
            <div
              className="empty-projects-state"
              style={{
                gridColumn: "1 / -1",
                padding: "60px 20px",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.5)",
                borderRadius: "16px",
                border: "1px dashed var(--line)",
                color: "var(--muted)",
                fontSize: "14px",
              }}
            >
              {copy.noProjects}
            </div>
          ) : (
            projects.map((project) => {
              const slug = resolveProjectSlug(project.title);
              const visual = (
                <div className="project-visual">
                  {project.imagePath ? (
                    <Image src={project.imagePath} alt={`${project.title} — ${project.type}`} fill sizes="(max-width: 800px) 100vw, 360px" style={{ objectFit: "cover" }} priority={project.order <= 2} />
                  ) : (
                    <><div className="visual-window"><span /><span /><span /></div><div className="visual-title">{project.title}</div><div className="visual-shape" /></>
                  )}
                </div>
              );
              return (
                <article className={`project-card ${project.className || ""}`} key={project.id}>
                  {slug ? <Link href={`/work/${slug}`} style={{ display: "block" }}>{visual}</Link> : visual}
                  <p>{project.type}</p>
                  {slug ? <Link href={`/work/${slug}`}><h3>{project.title}</h3></Link> : <h3>{project.title}</h3>}
                  <strong>{["Kopi Koma", "Sora Studio", "Ruang Pulih", "Nomad Coffee Roasters", "Aura Studio"].includes(project.title) ? (locale === "ID" ? "Konsep visual" : "Visual concept") : project.result}</strong>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* 5. PROCESS SECTION */}
      <section className="process section-shell" id="process">
        <div className="process-intro">
          <p className="eyebrow">{copy.processEyebrow}</p>
          <h2>
            Simple process.
            <br />
            <em>Serious results.</em>
          </h2>
          <p>{copy.processDescription}</p>
        </div>
        <div className="process-list">
          {[
            { step: "01", title: "Discovery & Audit", desc: "Analisis target audiens & objektif bisnis" },
            { step: "02", title: "Strategy & UI/UX", desc: "Arsitektur informasi & visual prototype presisi" },
            { step: "03", title: "Scalable Engineering", desc: "Kode Next.js terstruktur dengan fokus pada performa" },
            { step: "04", title: "Launch & Optimize", desc: "Deployment stabil, QA, dan pelacakan konversi" },
          ].map((item) => (
            <div className="process-step" key={item.step}>
              <span>{item.step}</span>
              <div>
                <h3>{item.title}</h3>
              </div>
              <ArrowIcon />
            </div>
          ))}
        </div>
      </section>

      {/* 6. PRICING MATRIX */}
      <section className="pricing section-shell" id="pricing">
        <div className="section-heading centered-heading">
          <p className="eyebrow">{copy.pricingEyebrow}</p>
          <h2>
            {copy.pricingTitle} <em>{copy.pricingAccent}</em>
          </h2>
          <p>{copy.pricingDescription}</p>
        </div>
        <div className="pricing-grid">
          {visiblePlans.map((plan) => (
            <article className={`pricing-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
              {plan.featured && <span className="popular-badge">{copy.popular}</span>}
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <div className="price">
                {plan.price !== "Let's talk" && <small>Rp </small>}
                {plan.price}
                {plan.price !== "Let's talk" && <small> jt</small>}
              </div>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    ✓ <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link className={`button ${plan.featured ? "button-primary" : "button-outline"}`} href="/start">
                {copy.choosePlan} <ArrowIcon />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 7. CONTACT SECTION */}
      <section className="contact section-shell" id="contact">
        <div>
          <p className="eyebrow">{copy.contactEyebrow}</p>
          <h2>
            {copy.contactTitle} <em>{copy.contactAccent}</em>
          </h2>
          <p style={{ marginTop: "20px", color: "#b4c5c3", fontSize: "14px", lineHeight: "1.65" }}>
            {copy.contactDescription}
          </p>
          <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {whatsappUrl && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                <span style={{ color: "var(--accent-lime)" }}>WhatsApp:</span>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" style={{ color: "#ffffff", fontWeight: 700, textDecoration: "underline" }}>
                  {copy.contactDirect} ↗
                </a>
              </div>
            )}
            {contactEmail && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                <span style={{ color: "var(--accent-lime)" }}>Email:</span>
                <a href={`mailto:${contactEmail}`} style={{ color: "#ffffff", fontWeight: 700 }}>
                  {contactEmail}
                </a>
              </div>
            )}
          </div>
        </div>
        <div>
          <ContactForm whatsappUrl={whatsappUrl} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer section-shell">
        <Link className="brand" href="/#top">
          <span className="brand-mark">N</span>
          <span>
            Nexa<span className="brand-dot">.</span>
          </span>
        </Link>
        <p>
          {copy.footer}
        </p>
        <div className="footer-links">
          {contactEmail && <a href={`mailto:${contactEmail}`}>{contactEmail}</a>}
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noreferrer">
              Instagram ↗
            </a>
          )}
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp ↗
            </a>
          )}
          <Link href="/privacy">{copy.privacy}</Link>
          <Link href="/terms">{copy.terms}</Link>
        </div>
        <small>© {new Date().getFullYear()} Nexa Studio. Made with intention.</small>
      </footer>
    </main>
    </>
  );
}
