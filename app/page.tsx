import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ContactForm from "@/components/ContactForm";
import ServiceCatalog from "@/components/ServiceCatalog";
import SiteNav from "@/components/SiteNav";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Service {
  number: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
}

const services: Service[] = [
  {
    number: "01",
    title: "Website yang menjual",
    description:
      "Landing page dan company profile yang cepat, mudah dipahami, dan dibuat untuk mengubah pengunjung menjadi pelanggan.",
    icon: "↗",
    category: "Website",
  },
  {
    number: "02",
    title: "Brand yang berkesan",
    description:
      "Identitas visual yang rapi dan konsisten agar bisnis kamu terlihat lebih dipercaya sejak first impression.",
    icon: "✦",
    category: "Branding",
  },
  {
    number: "03",
    title: "Konten yang relevan",
    description:
      "Strategi dan template konten yang membantu kamu tampil rutin tanpa harus mulai dari halaman kosong.",
    icon: "◌",
    category: "Konten",
  },
];

const plans: Plan[] = [
  {
    name: "Starter",
    price: "Diskusi dulu",
    description: "Untuk bisnis yang baru mulai membangun eksistensi online.",
    features: ["One-page website", "Copywriting dasar", "Mobile responsive", "Ruang lingkup disepakati"],
  },
  {
    name: "Growth",
    price: "Diskusi dulu",
    description: "Untuk bisnis yang siap terlihat lebih serius dan profesional.",
    features: ["Website multi-halaman", "Brand direction", "SEO basic setup", "Ruang lingkup disepakati"],
    featured: true,
  },
  {
    name: "Custom",
    price: "Diskusi dulu",
    description: "Solusi yang disesuaikan dengan kebutuhan dan target bisnis kamu.",
    features: ["Strategi digital", "Fitur custom", "Support prioritas", "Timeline fleksibel"],
  },
];

function ArrowIcon() {
  return <span aria-hidden="true" className="arrow-icon">↗</span>;
}

export default async function Home() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  return (
    <main>
      <SiteNav whatsappUrl={whatsappUrl} />

      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Digital partner untuk bisnis ambisius</p>
          <h1>Bikin bisnis kamu <em>terlihat</em> dan dipilih.</h1>
          <p className="hero-description">
            Kami membantu UMKM dan brand lokal membangun identitas digital yang
            bukan cuma cantik, tapi juga menghasilkan.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={whatsappUrl || "#contact"} target={whatsappUrl ? "_blank" : undefined} rel={whatsappUrl ? "noreferrer" : undefined}>
              Mulai konsultasi <ArrowIcon />
            </a>
            <a className="text-link" href="#work">Lihat hasil kerja <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-proof"><p><strong>Contoh website agency</strong><br /><span>Portfolio dan hasil di bawah adalah studi konsep.</span></p></div>
        </div>
        <div className="hero-art" aria-label="Ilustrasi dashboard pertumbuhan bisnis">
          <div className="art-glow" />
          <div className="growth-card">
            <div className="card-topline"><span>Ilustrasi proses digital</span><span className="positive">Konsep</span></div>
            <div className="chart-value">Ide <span>→ hasil</span></div>
            <div className="chart">
              <div className="chart-grid" />
              <svg viewBox="0 0 450 180" role="img" aria-label="Ilustrasi alur pekerjaan dari ide menuju hasil">
                <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#baf34a" stopOpacity=".34" /><stop offset="100%" stopColor="#baf34a" stopOpacity="0" /></linearGradient></defs>
                <path d="M0 151 C35 140 48 145 72 120 S110 130 139 99 S172 115 199 91 S236 104 263 62 S302 89 326 52 S361 65 383 31 S425 42 450 8 V180 H0Z" fill="url(#chartFill)" />
                <path d="M0 151 C35 140 48 145 72 120 S110 130 139 99 S172 115 199 91 S236 104 263 62 S302 89 326 52 S361 65 383 31 S425 42 450 8" fill="none" stroke="#baf34a" strokeWidth="4" strokeLinecap="round" />
                <circle cx="383" cy="31" r="6" fill="#101b20" stroke="#baf34a" strokeWidth="4" />
              </svg>
            </div>
            <div className="chart-labels"><span>Riset</span><span>Rancang</span><span>Bangun</span><span>Uji</span><span>Rilis</span></div>
          </div>
          <div className="floating-card floating-card-top"><span className="mini-icon">↗</span><span><strong>Riset kebutuhan</strong><small>Kenali masalahnya</small></span></div>
          <div className="floating-card floating-card-bottom"><span className="mini-ring">✓</span><span><strong>Siap diluncurkan</strong><small>Ukur dan perbaiki</small></span></div>
          <div className="art-tag">nexa<span>.</span></div>
        </div>
      </section>

      <section className="logo-strip section-shell" aria-label="Tahapan kerja">
        <span>Proses yang membantu bisnis <strong>melangkah lebih jauh</strong></span>
        <div className="client-logos"><b>Riset</b><b>Desain</b><b>Bangun</b><b>Ukur</b></div>
      </section>

      <section className="services section-shell" id="services">
        <div className="section-heading">
          <p className="eyebrow">Yang kami kerjakan</p>
          <h2>Semua yang kamu butuhkan untuk <em>naik level.</em></h2>
          <p>Tanpa jargon ribet. Tanpa proses berbelit. Hanya strategi dan eksekusi yang benar-benar relevan buat bisnismu.</p>
        </div>
        <ServiceCatalog services={services} whatsappUrl={whatsappUrl || "#contact"} />
      </section>

      <section className="work section-shell" id="work">
        <div className="section-heading work-heading">
          <div><p className="eyebrow">Selected work</p><h2>Kerja bagus berbicara <em>lebih keras.</em></h2></div>
          <a className="text-link" href="#contact">Ceritakan projectmu <ArrowIcon /></a>
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
            projects.map((project) => (
              <article className={`project-card ${project.className || ""}`} key={project.id}>
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
                <p>Studi konsep · {project.type}</p>
                <h3>{project.title}</h3>
                <strong>{project.result}</strong>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="process section-shell" id="process">
        <div className="process-intro"><p className="eyebrow">Cara kami bekerja</p><h2>Simple process.<br /><em>Serious results.</em></h2><p>Kamu tetap fokus menjalankan bisnis. Kami yang bantu mengurus bagaimana bisnis itu terlihat dan ditemukan.</p></div>
        <div className="process-list">
          {["Kenalan & gali kebutuhan", "Susun strategi", "Design & build", "Launch & grow"].map((step, index) => (
            <div className="process-step" key={step}><span>0{index + 1}</span><h3>{step}</h3><ArrowIcon /></div>
          ))}
        </div>
      </section>

      <section className="pricing section-shell" id="pricing">
        <div className="section-heading centered-heading"><p className="eyebrow">Contoh cakupan layanan</p><h2>Pilih langkah <em>pertamamu.</em></h2><p>Ini contoh paket untuk memulai diskusi. Harga dan waktu pengerjaan ditentukan setelah kebutuhan disepakati.</p></div>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className={`pricing-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
              {plan.featured && <span className="popular-badge">Contoh paket</span>}
              <h3>{plan.name}</h3><p>{plan.description}</p>
              <div className="price">{plan.price}</div>
              <ul>{plan.features.map((feature) => <li key={feature}>✓ <span>{feature}</span></li>)}</ul>
              <a className={`button ${plan.featured ? "button-primary" : "button-outline"}`} href="#contact">Pilih paket <ArrowIcon /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="contact section-shell" id="contact">
        <div>
          <p className="eyebrow">Ready when you are</p>
          <h2>Bisnis besar dimulai dari <em>langkah kecil.</em></h2>
          <p style={{ marginTop: "20px", color: "#b4c5c3", fontSize: "14px", lineHeight: "1.65" }}>
            Gak perlu menunggu semuanya sempurna. Ceritakan idemu, kita cari cara terbaik untuk mewujudkannya.
          </p>
        </div>
        <div>
          <ContactForm whatsappUrl={whatsappUrl} />
        </div>
      </section>

      <footer className="site-footer section-shell">
        <a className="brand" href="#top"><span className="brand-mark">N</span><span>Nexa<span className="brand-dot">.</span></span></a>
        <p>Designing digital experiences<br />that move businesses forward.</p>
        <div className="footer-links">
          {contactEmail && <a href={`mailto:${contactEmail}`}>{contactEmail}</a>}
          {instagramUrl && <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a>}
          {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp ↗</a>}
          <Link href="/privacy">Pemrosesan data kontak</Link>
        </div>
        <small>© {new Date().getFullYear()} Nexa Studio. Studi konsep website agency.</small>
      </footer>
    </main>
  );
}
