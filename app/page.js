const services = [
  {
    number: "01",
    title: "Website yang menjual",
    description:
      "Landing page dan company profile yang cepat, mudah dipahami, dan dibuat untuk mengubah pengunjung menjadi pelanggan.",
    icon: "↗",
  },
  {
    number: "02",
    title: "Brand yang berkesan",
    description:
      "Identitas visual yang rapi dan konsisten agar bisnis kamu terlihat lebih dipercaya sejak first impression.",
    icon: "✦",
  },
  {
    number: "03",
    title: "Konten yang relevan",
    description:
      "Strategi dan template konten yang membantu kamu tampil rutin tanpa harus mulai dari halaman kosong.",
    icon: "◌",
  },
];

const projects = [
  {
    type: "F&B · Branding + Website",
    title: "Kopi Koma",
    result: "+38% online orders",
    className: "project-coffee",
  },
  {
    type: "Fashion · E-commerce",
    title: "Sora Studio",
    result: "2.4x conversion rate",
    className: "project-fashion",
  },
  {
    type: "Wellness · Landing page",
    title: "Ruang Pulih",
    result: "Booked out in 12 days",
    className: "project-wellness",
  },
];

const plans = [
  {
    name: "Starter",
    price: "3,5",
    description: "Untuk bisnis yang baru mulai membangun eksistensi online.",
    features: ["One-page website", "Copywriting dasar", "Mobile responsive", "7 hari pengerjaan"],
  },
  {
    name: "Growth",
    price: "7,5",
    description: "Untuk bisnis yang siap terlihat lebih serius dan profesional.",
    features: ["Website hingga 5 halaman", "Brand direction", "SEO basic setup", "14 hari pengerjaan"],
    featured: true,
  },
  {
    name: "Custom",
    price: "Let's talk",
    description: "Solusi yang disesuaikan dengan kebutuhan dan target bisnis kamu.",
    features: ["Strategi digital", "Fitur custom", "Support prioritas", "Timeline fleksibel"],
  },
];

function ArrowIcon() {
  return <span aria-hidden="true" className="arrow-icon">↗</span>;
}

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Navigasi utama">
        <a className="brand" href="#top" aria-label="Nexa Studio, kembali ke atas">
          <span className="brand-mark">N</span>
          <span>Nexa<span className="brand-dot">.</span></span>
        </a>
        <div className="nav-links">
          <a href="#services">Layanan</a>
          <a href="#work">Portfolio</a>
          <a href="#process">Proses</a>
          <a href="#pricing">Harga</a>
        </div>
        <a className="nav-cta" href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">
          Ngobrol yuk <ArrowIcon />
        </a>
      </nav>

      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Digital partner untuk bisnis ambisius</p>
          <h1>Bikin bisnis kamu <em>terlihat</em> dan dipilih.</h1>
          <p className="hero-description">
            Kami membantu UMKM dan brand lokal membangun identitas digital yang
            bukan cuma cantik, tapi juga menghasilkan.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">
              Mulai konsultasi <ArrowIcon />
            </a>
            <a className="text-link" href="#work">Lihat hasil kerja <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true"><span>R</span><span>A</span><span>D</span></div>
            <p><strong>Dipercaya 40+ bisnis</strong><br /><span>untuk tumbuh lebih cepat</span></p>
          </div>
        </div>
        <div className="hero-art" aria-label="Ilustrasi dashboard pertumbuhan bisnis">
          <div className="art-glow" />
          <div className="growth-card">
            <div className="card-topline"><span>Monthly growth</span><span className="positive">+24.8%</span></div>
            <div className="chart-value">Rp 84.6<span>jt</span></div>
            <div className="chart">
              <div className="chart-grid" />
              <svg viewBox="0 0 450 180" role="img" aria-label="Grafik pertumbuhan naik">
                <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#baf34a" stopOpacity=".34" /><stop offset="100%" stopColor="#baf34a" stopOpacity="0" /></linearGradient></defs>
                <path d="M0 151 C35 140 48 145 72 120 S110 130 139 99 S172 115 199 91 S236 104 263 62 S302 89 326 52 S361 65 383 31 S425 42 450 8 V180 H0Z" fill="url(#chartFill)" />
                <path d="M0 151 C35 140 48 145 72 120 S110 130 139 99 S172 115 199 91 S236 104 263 62 S302 89 326 52 S361 65 383 31 S425 42 450 8" fill="none" stroke="#baf34a" strokeWidth="4" strokeLinecap="round" />
                <circle cx="383" cy="31" r="6" fill="#101b20" stroke="#baf34a" strokeWidth="4" />
              </svg>
            </div>
            <div className="chart-labels"><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span></div>
          </div>
          <div className="floating-card floating-card-top"><span className="mini-icon">↗</span><span><strong>+38%</strong><small>new customers</small></span></div>
          <div className="floating-card floating-card-bottom"><span className="mini-ring">✓</span><span><strong>Goal reached</strong><small>Keep it going!</small></span></div>
          <div className="art-tag">nexa<span>.</span></div>
        </div>
      </section>

      <section className="logo-strip section-shell" aria-label="Klien kami">
        <span>Dipilih oleh brand yang ingin <strong>melangkah lebih jauh</strong></span>
        <div className="client-logos"><b>PARAS</b><b>ruang.</b><b>MONO</b><b>elara</b><b>BRIK</b></div>
      </section>

      <section className="services section-shell" id="services">
        <div className="section-heading">
          <p className="eyebrow">Yang kami kerjakan</p>
          <h2>Semua yang kamu butuhkan untuk <em>naik level.</em></h2>
          <p>Tanpa jargon ribet. Tanpa proses berbelit. Hanya strategi dan eksekusi yang benar-benar relevan buat bisnismu.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <div className="service-number">{service.number}<span className="service-icon">{service.icon}</span></div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a href="#contact" aria-label={`Pelajari ${service.title}`}>Pelajari lebih lanjut <ArrowIcon /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="work section-shell" id="work">
        <div className="section-heading work-heading">
          <div><p className="eyebrow">Selected work</p><h2>Kerja bagus berbicara <em>lebih keras.</em></h2></div>
          <a className="text-link" href="#contact">Lihat semua project <ArrowIcon /></a>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className={`project-card ${project.className}`} key={project.title}>
              <div className="project-visual"><div className="visual-window"><span /><span /><span /></div><div className="visual-title">{project.title}</div><div className="visual-shape" /></div>
              <p>{project.type}</p><h3>{project.title}</h3><strong>{project.result}</strong>
            </article>
          ))}
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
        <div className="section-heading centered-heading"><p className="eyebrow">Investasi untuk bertumbuh</p><h2>Pilih langkah <em>pertamamu.</em></h2><p>Semua paket bisa disesuaikan. Ceritakan saja apa yang ingin kamu capai.</p></div>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className={`pricing-card ${plan.featured ? "featured" : ""}`} key={plan.name}>
              {plan.featured && <span className="popular-badge">Paling populer</span>}
              <h3>{plan.name}</h3><p>{plan.description}</p>
              <div className="price">{plan.price !== "Let's talk" && <small>Rp </small>}{plan.price}{plan.price !== "Let's talk" && <small> jt</small>}</div>
              <ul>{plan.features.map((feature) => <li key={feature}>✓ <span>{feature}</span></li>)}</ul>
              <a className={`button ${plan.featured ? "button-primary" : "button-outline"}`} href="#contact">Pilih paket <ArrowIcon /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="contact section-shell" id="contact">
        <div><p className="eyebrow">Ready when you are</p><h2>Bisnis besar dimulai dari <em>langkah kecil.</em></h2></div>
        <div><p>Gak perlu menunggu semuanya sempurna. Ceritakan idemu, kita cari cara terbaik untuk mewujudkannya.</p><a className="button button-lime" href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">Mulai ngobrol <ArrowIcon /></a></div>
      </section>

      <footer className="site-footer section-shell">
        <a className="brand" href="#top"><span className="brand-mark">N</span><span>Nexa<span className="brand-dot">.</span></span></a>
        <p>Designing digital experiences<br />that move businesses forward.</p>
        <div className="footer-links"><a href="mailto:hello@nexa.studio">hello@nexa.studio</a><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">WhatsApp ↗</a></div>
        <small>© 2025 Nexa Studio. Made with intention.</small>
      </footer>
    </main>
  );
}
