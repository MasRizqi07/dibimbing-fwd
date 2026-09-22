import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ContactForm from "@/components/ContactForm";
import ServiceCatalog, { type ServiceItem } from "@/components/ServiceCatalog";
import SiteNav from "@/components/SiteNav";

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
    deliverables: ["Jamstack Architecture", "Core Web Vitals < 1.2s", "CMS Integration"],
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
    features: ["One-page website", "Copywriting dasar", "Mobile responsive", "7 hari pengerjaan"],
  },
  {
    name: "Growth",
    price: "7,5",
    description: "Akselerator penuh untuk bisnis berkembang yang butuh konversi tinggi dan identitas terpadu.",
    features: ["Website hingga 5 halaman", "Complete Visual Identity", "SEO basic setup", "14 hari pengerjaan"],
    featured: true,
  },
  {
    name: "Custom",
    price: "Let's talk",
    description: "Solusi bespoke dengan rekayasa teknologi kustom dan integrasi platform kompleks.",
    features: ["Strategi digital bespoke", "Arsitektur cloud & API", "Support prioritas SLA", "Timeline fleksibel"],
  },
];

function ArrowIcon() {
  return <span aria-hidden="true" className="arrow-icon">↗</span>;
}

function resolveProjectSlug(title: string, index: number): string {
  const normalized = title.toLowerCase();
  if (normalized.includes("kopi") || normalized.includes("nomad")) {
    return "nomad-coffee-roasters";
  }
  if (normalized.includes("sora") || normalized.includes("aura") || normalized.includes("fashion")) {
    return "aura-studio-fashion";
  }
  if (normalized.includes("ruang") || normalized.includes("pulih") || normalized.includes("wellness")) {
    return "ruang-pulih-holistic-spa";
  }
  const defaultSlugs = ["nomad-coffee-roasters", "aura-studio-fashion", "ruang-pulih-holistic-spa"];
  return defaultSlugs[index % defaultSlugs.length];
}

export default async function Home() {
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
              <span className="status-dot" /> Digital agency for growth-ready businesses
            </p>
            <h1>Transformasi Digital Terukur untuk Bisnis yang Siap Tumbuh</h1>
            <p className="hero-description">
              Kami merancang website performa tinggi, identitas visual distingtif, dan strategi konten terarah yang mengubah pengunjung menjadi klien loyal bagi UMKM dan brand berkembang.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/start">
                Mulai Diskusi Proyek <ArrowIcon />
              </Link>
            <a className="text-link" href="#work">
              Lihat hasil kerja <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>R</span>
              <span>A</span>
              <span>D</span>
            </div>
            <p>
              <strong>Dipercaya 40+ bisnis</strong>
              <br />
              <span>untuk tumbuh lebih cepat</span>
            </p>
          </div>
        </div>

        <div className="hero-art" aria-label="Ilustrasi dashboard pertumbuhan bisnis">
          <div className="art-glow" />
          <div className="growth-card">
            <div className="card-topline">
              <span>Monthly growth</span>
              <span className="positive">+24.8%</span>
            </div>
            <div className="chart-value">
              Rp 84.6<span>jt</span>
            </div>
            <div className="chart">
              <div className="chart-grid" />
              <svg viewBox="0 0 450 180" role="img" aria-label="Grafik pertumbuhan naik">
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
              <small>new customers</small>
            </span>
          </div>
          <div className="floating-card floating-card-bottom">
            <span className="mini-ring">✓</span>
            <span>
              <strong>Goal reached</strong>
              <small>Keep it going!</small>
            </span>
          </div>
          <div className="art-tag">
            nexa<span>.</span>
          </div>
        </div>
      </section>

      {/* 2. CLIENT PROOF BAR */}
      <section className="logo-strip section-shell" aria-label="Klien kami">
        <span>
          Dipercaya oleh brand yang ingin <strong>melangkah lebih jauh</strong>
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
          <p className="eyebrow">Yang kami kerjakan</p>
          <h2>
            Semua yang kamu butuhkan untuk <em>naik level.</em>
          </h2>
          <p>
            Tanpa jargon ribet. Tanpa proses berbelit. Hanya strategi dan eksekusi yang benar-benar relevan buat bisnismu.
          </p>
        </div>
        <ServiceCatalog services={services} whatsappUrl={whatsappUrl || "#contact"} />
      </section>

      {/* 4. SELECTED WORK / PORTFOLIO */}
      <section className="work section-shell" id="work">
        <div className="section-heading work-heading">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2>
              Kerja bagus berbicara <em>lebih keras.</em>
            </h2>
          </div>
          <Link className="text-link" href="/start">
            Mulai proyek Anda <ArrowIcon />
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
              Belum ada project yang ditampilkan.
            </div>
          ) : (
            projects.map((project, index) => {
              const slug = resolveProjectSlug(project.title, index);
              return (
                <article className={`project-card ${project.className || ""}`} key={project.id}>
                  <Link href={`/work/${slug}`} style={{ display: "block" }}>
                    <div className="project-visual">
                      {project.imagePath ? (
                        <Image
                          src={project.imagePath}
                          alt={`Showcase portfolio ${project.title} — ${project.type}`}
                          fill
                          sizes="(max-width: 800px) 100vw, 360px"
                          style={{ objectFit: "cover" }}
                          priority={project.order <= 2}
                        />
                      ) : (
                        <>
                          <div className="visual-window">
                            <span />
                            <span />
                            <span />
                          </div>
                          <div className="visual-title">{project.title}</div>
                          <div className="visual-shape" />
                        </>
                      )}
                    </div>
                  </Link>
                  <p>{project.type}</p>
                  <Link href={`/work/${slug}`}>
                    <h3>{project.title}</h3>
                  </Link>
                  <strong>{project.result}</strong>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* 5. PROCESS SECTION */}
      <section className="process section-shell" id="process">
        <div className="process-intro">
          <p className="eyebrow">Metodologi Kerja</p>
          <h2>
            Simple process.
            <br />
            <em>Serious results.</em>
          </h2>
          <p>Kamu tetap fokus menjalankan bisnis. Kami yang bantu mengurus bagaimana bisnis itu terlihat dan ditemukan.</p>
        </div>
        <div className="process-list">
          {[
            { step: "01", title: "Discovery & Audit", desc: "Analisis target audiens & objektif bisnis" },
            { step: "02", title: "Strategy & UI/UX", desc: "Arsitektur informasi & visual prototype presisi" },
            { step: "03", title: "Scalable Engineering", desc: "Kode Next.js bersih dengan performa sub-detik" },
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
          <p className="eyebrow">Investasi untuk bertumbuh</p>
          <h2>
            Pilih langkah <em>pertamamu.</em>
          </h2>
          <p>Semua paket bisa disesuaikan. Ceritakan saja apa yang ingin kamu capai.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className={`pricing-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
              {plan.featured && <span className="popular-badge">Paling populer</span>}
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
                Pilih paket <ArrowIcon />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 7. CONTACT SECTION */}
      <section className="contact section-shell" id="contact">
        <div>
          <p className="eyebrow">Konsultasi Terarah</p>
          <h2>
            Bisnis besar dimulai dari <em>langkah kecil.</em>
          </h2>
          <p style={{ marginTop: "20px", color: "#b4c5c3", fontSize: "14px", lineHeight: "1.65" }}>
            Konsultasi awal gratis tanpa komitmen. Kami membedah peluang konversi dan strategi implementasi dalam waktu maksimal 24 jam kerja.
          </p>
          <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {whatsappUrl && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                <span style={{ color: "var(--accent-lime)" }}>WhatsApp:</span>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" style={{ color: "#ffffff", fontWeight: 700, textDecoration: "underline" }}>
                  Hubungi Langsung ↗
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
          Designing digital experiences
          <br />
          that move businesses forward.
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
          <Link href="/privacy">Kebijakan Privasi</Link>
          <Link href="/terms">Syarat & Ketentuan</Link>
        </div>
        <small>© {new Date().getFullYear()} Nexa Studio. Made with intention.</small>
      </footer>
    </main>
    </>
  );
}
