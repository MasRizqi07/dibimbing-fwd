export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  clientName: string;
  year: string;
  industry: string;
  duration: string;
  techStack: string[];
  liveUrl?: string;
  outcomeBadge: string;
  imagePath: string;
  visualAlt: string;
  deliverables: string[];
  team: string;
  challenge: {
    heading: string;
    description: string;
    points: Array<{ title: string; desc: string; icon: string }>;
  };
  solution: {
    heading: string;
    description: string;
    architectureTitle: string;
    architectureLatency: string;
    steps: Array<{ step: string; title: string; desc: string; icon: string }>;
  };
  kpis: Array<{ value: string; label: string; desc: string }>;
  testimonial: {
    quote: string;
    author: string;
    role: string;
    initials: string;
  };
  nextProject: {
    slug: string;
    title: string;
    category: string;
    year: string;
    desc: string;
  };
}

export const caseStudies: Record<string, CaseStudy> = {
  "nomad-coffee-roasters": {
    slug: "nomad-coffee-roasters",
    title: "Nomad Coffee Roasters",
    subtitle:
      "Arsitektur Headless E-Commerce & Identitas Editorial untuk Roastery Kopi Spesialti Terkemuka",
    clientName: "Nomad Coffee Roasters",
    year: "2026",
    industry: "Specialty Coffee & F&B Retail",
    duration: "8 Minggu (Sprint Delivery)",
    techStack: ["Next.js 16", "PostgreSQL", "Stripe Headless", "Redis Edge"],
    liveUrl: "https://nomadcoffee.id",
    outcomeBadge: "+140% Penjualan Online dalam 60 Hari Pasca Rilis",
    imagePath: "/projects/nomad-coffee.png",
    visualAlt:
      "Nomad Coffee Roasters editorial identity packaging and digital storefront showcase.",
    deliverables: [
      "Visual Identity & Editorial Packaging Architecture",
      "Next.js 16 Headless D2C Storefront",
      "Multi-Warehouse POS & Inventory Two-Way Sync",
      "Sub-detik Edge CDN Optimization & Quick WhatsApp Order",
    ],
    team: "1 Principal Architect, 2 Frontend Engineers, 1 Brand Strategist.",
    challenge: {
      heading: "Keterbatasan Skalabilitas Monolit & Disparitas Identitas Merek",
      description:
        "Nomad Coffee Roasters adalah roastery kopi artisanal legendaris di Jakarta Selatan dengan basis penikmat loyal. Namun saat ekspansi digital dicanangkan, sistem e-commerce monolitik berbasis plugin yang mereka gunakan mengalami kendala teknis kritis:",
      points: [
        {
          title: "Latensi Server Ekstrem",
          desc: "Time-to-First-Byte (TTFB) menyentuh 2.8 detik di koneksi seluler 4G, memicu lonjakan tingkat pentalan (bounce rate) hingga 58% pada halaman produk single-origin.",
          icon: "speed",
        },
        {
          title: "Abandonment Checkout",
          desc: "Alur checkout 4 langkah rumit tanpa integrasi QRIS instan dan WhatsApp order menyebabkan 64% keranjang belanja ditinggalkan pembeli potensial.",
          icon: "shopping_cart_off",
        },
      ],
    },
    solution: {
      heading: "Jamstack Edge-Native & Alur Checkout Sub-Detik Terpadu",
      description:
        "Nexa Studio merekayasa ulang seluruh tumpukan teknologi Nomad Coffee Roasters dengan memisahkan total presentation layer (toko publik) dari order engine. Dengan Next.js App Router dan Server Components, halaman katalog biji kopi dikompilasi secara instan melalui 24 node edge CDN regional.",
      architectureTitle: "Skema Alur Transaksi Jamstack Headless",
      architectureLatency: "Latensi < 50ms",
      steps: [
        {
          step: "01. Edge Storefront",
          title: "01. Edge Storefront",
          desc: "Static pre-rendering biji kopi musiman via Next.js 16 CDN. Aset gambar adaptif terkompresi 80%.",
          icon: "bolt",
        },
        {
          step: "02. Order Router",
          title: "02. Order Router",
          desc: "Serverless API edge gateway menyinkronkan stok fisik roastery secara real-time via PostgreSQL & Redis lock.",
          icon: "hub",
        },
        {
          step: "03. Sub-Detik Checkout",
          title: "03. Sub-Detik Checkout",
          desc: "Integrasi instan 1-tap QRIS, e-wallet, dan fallback konfirmasi WhatsApp otomatis ke tim barista.",
          icon: "qr_code_2",
        },
      ],
    },
    kpis: [
      {
        value: "+140%",
        label: "Pertumbuhan D2C",
        desc: "Peningkatan omzet direct-to-consumer dalam 60 hari pertama pasca rilis dibanding periode sama tahun sebelumnya.",
      },
      {
        value: "0.42s",
        label: "Global TTFB Rata-rata",
        desc: "Penurunan latensi server sebesar 85%, menjamin kelancaran penelusuran katalog meski jaringan seluler fluktuatif.",
      },
      {
        value: "3.4x",
        label: "Konversi Checkout",
        desc: "Peningkatan rasio penyelesaian checkout berkat eliminasi form pengisian alamat manual yang repetitif.",
      },
    ],
    testimonial: {
      quote:
        "“Nexa Studio tidak sekadar membuatkan website estetik; mereka membangun infrastruktur penjualan digital yang langsung melipatgandakan pesanan biji kopi kami sejak hari pertama peluncuran. Integrasi sistem ke bar kopi kami berjalan tanpa cela.”",
      author: "Adrian Pratama",
      role: "Co-Founder & Head Roaster, Nomad Coffee Roasters",
      initials: "AP",
    },
    nextProject: {
      slug: "aura-studio-fashion",
      title: "Aura Studio Fashion",
      category: "Fashion & Retail",
      year: "2026",
      desc: "Membangun pengalaman belanja busana kontemporer dengan lookbook interaktif dan sistem inventaris multi-butik.",
    },
  },
  "aura-studio-fashion": {
    slug: "aura-studio-fashion",
    title: "Aura Studio Fashion",
    subtitle:
      "Minimalist Lookbook & Digital Flagship Store untuk Jenama Busana Kontemporer",
    clientName: "Aura Studio",
    year: "2026",
    industry: "Fashion & Apparel Retail",
    duration: "6 Minggu (Design & Build)",
    techStack: ["Next.js 16", "Tailwind CSS v4", "PostgreSQL", "Edge Cache"],
    liveUrl: "https://aurafashion.id",
    outcomeBadge: "3.4x Durasi Sesi Pengguna",
    imagePath: "/projects/aura-studio.png",
    visualAlt:
      "Aura Studio Fashion minimalist lookbook showcase and responsive storefront.",
    deliverables: [
      "Interactive Digital Lookbook",
      "Headless E-Commerce Integration",
      "Brand Guidelines & Micro-Interactions",
      "Mobile-First Touch Optimizations",
    ],
    team: "1 Lead Designer, 2 Frontend Engineers.",
    challenge: {
      heading: "Friksi Navigasi Katalog Tradisional & Pengalaman Belanja Statis",
      description:
        "Katalog busana linen Aura Studio sebelumnya memuat gambar resolusi tinggi tanpa lazy-loading adaptif, menyebabkan drop-off tinggi sebelum calon pembeli sempat melihat variasi warna dan material kain.",
      points: [
        {
          title: "Beban Render Aset Berat",
          desc: "Ukuran halaman mencapai 12MB pada katalog lookbook, menghambat pengunjung mobile di jaringan 4G.",
          icon: "speed",
        },
        {
          title: "Konversi Keranjang Rendah",
          desc: "Transisi antar-halaman yang lambat mematahkan momentum eksplorasi produk pelanggan.",
          icon: "shopping_cart_off",
        },
      ],
    },
    solution: {
      heading: "Arsitektur Editorial Responsif & Touch-Optimized Lookbook",
      description:
        "Kami merancang antarmuka lookbook berbasis gestur satu jempol dengan optimasi kompresi WebP modern dan prefetching cerdas rute produk terpopuler.",
      architectureTitle: "Pipeline Optimasi Media & State Terdistribusi",
      architectureLatency: "Latensi Interaksi < 16ms",
      steps: [
        {
          step: "01. Adaptive Image CDN",
          title: "01. Adaptive Image CDN",
          desc: "Penyajian otomatis ukuran aset presisi berdasarkan DPR dan resolusi layar pengguna.",
          icon: "bolt",
        },
        {
          step: "02. Micro-Cart Drawer",
          title: "02. Micro-Cart Drawer",
          desc: "Slide-over checkout tanpa perlu meninggalkan halaman kurasi editorial.",
          icon: "shopping_bag",
        },
        {
          step: "03. Direct WhatsApp Checkout",
          title: "03. Direct WhatsApp Checkout",
          desc: "Konversi cepat pesanan ke concierge WhatsApp resmi tim penjualan.",
          icon: "chat",
        },
      ],
    },
    kpis: [
      {
        value: "3.4x",
        label: "Durasi Sesi Pengguna",
        desc: "Kenaikan waktu jelajah katalog berkat pengalaman lookbook interaktif tanpa lag.",
      },
      {
        value: "+65%",
        label: "Add-to-Bag Rate",
        desc: "Peningkatan rasio penambahan produk ke keranjang belanja belanja.",
      },
      {
        value: "0.48s",
        label: "Rata-rata TTFB",
        desc: "Pemuatan instan di seluruh node CDN Asia Tenggara.",
      },
    ],
    testimonial: {
      quote:
        "“Desain yang dihadirkan Nexa Studio mengangkat jenama kami ke level internasional. Konsumen kami memuji kelancaran belanja dari lookbook langsung ke WhatsApp.”",
      author: "Maya Indriani",
      role: "Creative Director, Aura Studio Fashion",
      initials: "MI",
    },
    nextProject: {
      slug: "ruang-pulih-holistic-spa",
      title: "Ruang Pulih Holistic Spa",
      category: "Digital Platform",
      year: "2026",
      desc: "Sistem reservasi perawatan terpadu dengan antarmuka menenangkan dan optimasi penuh.",
    },
  },
  "ruang-pulih-holistic-spa": {
    slug: "ruang-pulih-holistic-spa",
    title: "Ruang Pulih Holistic Spa",
    subtitle:
      "Sistem Reservasi Terpadu & Antarmuka Tenang untuk Pusat Terapi Holistik",
    clientName: "Ruang Pulih",
    year: "2026",
    industry: "Wellness & Holistic Healthcare",
    duration: "4 Minggu (Fast Delivery)",
    techStack: ["Next.js 16", "PostgreSQL", "Prisma", "WhatsApp Automation"],
    liveUrl: "https://ruangpulih.id",
    outcomeBadge: "+85% Booking Konsultasi",
    imagePath: "/projects/ruang-pulih.png",
    visualAlt:
      "Ruang Pulih holistic spa serene treatment rooms and booking platform.",
    deliverables: [
      "Appointment Booking Engine",
      "Therapist Schedule Management",
      "Calm Aesthetic Editorial Design System",
      "Automated Reminder Notifications",
    ],
    team: "1 Full-Stack Engineer, 1 Product Designer.",
    challenge: {
      heading: "Penjadwalan Manual yang Rentan Duplikasi & Friksi Klien",
      description:
        "Sebelumnya seluruh reservasi ditangani admin WhatsApp secara manual, menyebabkan penumpukan pesan yang lambat dibalas saat jam sibuk dan jadwal terapis yang tumpang tindih.",
      points: [
        {
          title: "Bottleneck Admin Manual",
          desc: "Waktu tunggu konfirmasi jadwal rata-rata 45 menit menurunkan antusiasme calon klien.",
          icon: "hourglass_empty",
        },
        {
          title: "Double Booking Resiko Tinggi",
          desc: "Terapis spesialis kerap terduplikasi pemesanannya pada jam yang sama.",
          icon: "event_busy",
        },
      ],
    },
    solution: {
      heading: "Kalender Pemesanan Instan dengan Sinkronisasi Kalender Real-time",
      description:
        "Membangun alur reservasi 3 langkah tanpa perlu pendaftaran akun rumit, dengan penguncian slot berbasis database dan konfirmasi otomatis instan.",
      architectureTitle: "Arsitektur Reservasi Real-Time",
      architectureLatency: "Konfirmasi Seketika",
      steps: [
        {
          step: "01. Slot Lock Engine",
          title: "01. Slot Lock Engine",
          desc: "Pencegahan konflik jadwal ganda dengan database transaction locking.",
          icon: "lock_clock",
        },
        {
          step: "02. Frictionless Booking",
          title: "02. Frictionless Booking",
          desc: "Klien cukup memilih jenis terapi, terapis favorit, dan jam kunjungan.",
          icon: "touch_app",
        },
        {
          step: "03. Auto Reminder",
          title: "03. Auto Reminder",
          desc: "Notifikasi otomatis jadwal kunjungan via WhatsApp H-1 dan H-2 jam.",
          icon: "notifications_active",
        },
      ],
    },
    kpis: [
      {
        value: "+85%",
        label: "Booking Konsultasi",
        desc: "Lonjakan volume reservasi mandiri tanpa membebani admin fisik.",
      },
      {
        value: "0%",
        label: "Double Booking Error",
        desc: "Penghapusan total insiden tumpang tindih jadwal terapis.",
      },
      {
        value: "12 Hari",
        label: "Sold Out Schedule",
        desc: "Kapasitas kuota terapis terisi penuh hanya dalam 12 hari pasca peluncuran.",
      },
    ],
    testimonial: {
      quote:
        "“Transformasi digital dari Nexa Studio membebaskan terapis dan staf kami dari beban administrasi. Pasien sangat menyukai kemudahan memilih jadwal reservasi.”",
      author: "Dr. Hendra Gunawan",
      role: "Founder, Ruang Pulih Bandung",
      initials: "HG",
    },
    nextProject: {
      slug: "nomad-coffee-roasters",
      title: "Nomad Coffee Roasters",
      category: "Specialty Coffee & Retail",
      year: "2026",
      desc: "Arsitektur Headless E-Commerce & Identitas Editorial untuk Roastery Kopi Spesialti.",
    },
  },
};

// Helper to resolve a slug from title or slug param
export function getCaseStudy(slugOrTitle: string): CaseStudy | null {
  const normalized = slugOrTitle
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  if (caseStudies[normalized]) {
    return caseStudies[normalized];
  }

  // Fallback mappings for database seed titles
  if (normalized.includes("kopi") || normalized.includes("nomad")) {
    return caseStudies["nomad-coffee-roasters"];
  }
  if (normalized.includes("sora") || normalized.includes("aura") || normalized.includes("fashion")) {
    return caseStudies["aura-studio-fashion"];
  }
  if (normalized.includes("ruang") || normalized.includes("pulih") || normalized.includes("wellness")) {
    return caseStudies["ruang-pulih-holistic-spa"];
  }

  // Default fallback to first case study
  return caseStudies["nomad-coffee-roasters"];
}

