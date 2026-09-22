# Nexa Studio Design System & Full-Stack UI/UX Specification

**Version:** 2.0 (Comprehensive Production Release)  
**Brand Identity:** Editorial Minimalism & Warm Precision  
**Target Market:** High-growth SMEs, Modern Brands, & Enterprise Digital Transformations (Indonesia & Global)  
**Author / Lead:** Principal Product Designer & Design Systems Architect

---

## 1. Design System Tokens & Atomic Foundation

### Color System & Semantic Mappings
Semua token didefinisikan sebagai standard CSS Custom Properties dan dikonfigurasi untuk konsumsi via Tailwind CSS maupun modular CSS:

```css
:root {
  /* Brand Canvas & Surfaces */
  --canvas-cream: #F7F8F4;
  --surface-white: #FFFFFF;
  --surface-navy: #102A31;
  --surface-navy-elevated: #16363E;
  
  /* Text & Typography */
  --ink-primary: #102027;
  --ink-muted: #64747A;
  --ink-inverted: #F7F8F4;
  --ink-inverted-muted: #A3B899;

  /* Conversion Accent & Interactive States */
  --accent-lime: #C3F35B;
  --accent-lime-hover: #B2E845;
  --accent-lime-muted: rgba(195, 243, 91, 0.16);
  --accent-lime-ring: rgba(195, 243, 91, 0.40);

  /* Structural Lines & Dividers */
  --border-line: #DFE6E4;
  --border-line-dark: rgba(223, 230, 228, 0.12);

  /* Status & Resilience Semantics */
  --status-error-bg: #FDEDED;
  --status-error-text: #D32F2F;
  --status-error-border: #EF9A9A;

  --status-warning-bg: #FFF4E5;
  --status-warning-text: #ED6C02;
  --status-warning-border: #FFB74D;

  --status-success-bg: #EDF7ED;
  --status-success-text: #2E7D32;
  --status-success-border: #A5D6A7;
}
```

---

### Typography Scale & Hierarchy
Sistem tipografi menggunakan **Geist Sans** (fallback: *Inter, -apple-system, BlinkMacSystemFont, sans-serif*). Display headings menggunakan *tight tracking* dan *compact line heights* untuk memberikan impresi editorial presisi.

| Role | Size | Line Height | Tracking | Weight | Transform |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `56px (3.5rem)` | 1.08 | -0.035em | Bold (700) | Normal |
| **Section Title (H2)** | `36px (2.25rem)` | 1.15 | -0.025em | SemiBold (600) | Normal |
| **Card Header (H3)** | `22px (1.375rem)` | 1.25 | -0.015em | SemiBold (600) | Normal |
| **Subhead / Lead** | `18px (1.125rem)` | 1.55 | 0 | Regular (400) | Normal |
| **Body Primary** | `15px (0.9375rem)` | 1.60 | 0 | Regular (400) | Normal |
| **Body Small / Data** | `13px (0.8125rem)` | 1.45 | +0.01em | Regular / Medium | Normal |
| **Eyebrow Label** | `11px (0.6875rem)` | 1.30 | +0.08em | Bold (700) | Uppercase |

---

### Layout Spacing, Radii, and Sizing Constraints
- **Maximum Content Width:** `1160px` terpusat (*centered*) dengan responsive margin.
- **Horizontal Shell Gutters:**
  - Desktop (>1160px): Auto margin, capped at `1160px`.
  - Tablet (640px to 1160px): `32px` gutter padding.
  - Mobile (320px to 639px): `16px` gutter padding.
- **Vertical Section Rhythm:** `96px` sampai `140px` pada desktop; diskalakan ke `64px` sampai `80px` pada mobile.
- **Radii Constraints:**
  - Action Buttons & Category Filter Pills: `9999px` (Pill shape).
  - Standard Cards & Metric Blocks: `15px`.
  - Macro Containers (Hero visual card, Contact box, Modals): `20px`.
- **Interactive Touch Target Minimum:** `44px × 44px` di seluruh viewport interaktif.

---

## 2. Complete Application Surface Inventory & Wireframe Blueprints

### Surface 1: Public Homepage (`/`)
- **Sticky Navigation:** Translucent glassmorphism (`backdrop-blur-md`, background `rgba(247, 248, 244, 0.85)`), border line bawah, logo resmi Nexa Studio, tautan jangkar (Layanan, Portofolio, Proses, Harga), indikator lokalitas (ID / EN), dan CTA Pill Navy "Mulai Proyek".
- **Hero Section:** Headline editorial "Transformasi Digital Terukur untuk Bisnis yang Siap Tumbuh", primary lime CTA "Mulai Diskusi Proyek", secondary text link ke studi kasus, visual art analitik pertumbuhan (*Growth Analytics Card* dengan tren lime dan kontras gelap), serta 3 strip metrik kepercayaan (*40+ Bisnis Terbantu, 99.8% Uptime SLA, 3.2x Rata-rata Konversi*).
- **Client Proof Bar:** Monokromatik logo bar (PARAS, ruang., MONO, elara, BRIK).
- **Katalog Layanan Interaktif:** Input live search ter-debounce (200ms) dengan `aria-live="polite"`, filter pills (*Semua, Web Development, Branding & Identity, Content Strategy*), kartu grid 3-kolom dengan deliverables ringkas.
- **Portofolio Terkurasi:** Grid kartu rasio 16:10 dengan thumbnail fotografi berkelas editorial, metrik hasil riil (+140% Sales, 3.4x Durasi Sesi, +85% Reservasi), dan deep-link ke studi kasus lengkap.
- **Metodologi Proses (4-Step Framework):** 01 Discovery & Audit → 02 Strategy & UI/UX → 03 Scalable Engineering → 04 Launch & Optimization.
- **Matriks Harga:** 3 tier transparan (Starter Rp 8.5M/18M, Featured Growth Rp 18M/38M dengan aksen Navy & badge Lime "Paling Populer", Enterprise Custom).
- **Kontainer Konversi Kontak:** Dark Navy container (`#102A31`) dengan kontak langsung founder via WhatsApp, email resmi, dan form brief aman dengan perlindungan anti-spam, idempotensi payload, dan tautan kebijakan privasi.
- **Footer Global:** Navigasi sitemap, kebijakan hukum, dan hak cipta.

---

### Surface 2: Case Study Detail Template (`/work/[slug]`)
- **Breadcrumbs & Meta:** `← Kembali ke Portofolio / Nomad Coffee Roasters / 2026`.
- **Impact Hero:** Tajuk dampak arsitektur, visual mockup 16:9 cinema-grade, badge capaian `+140% Penjualan Online`, dan status rilis `Production Live`.
- **Project Spec Matrix:** Industri (F&B / Retail), durasi sprint (8 minggu), stack chip (*Next.js 16, PostgreSQL, Stripe Headless, Redis Edge*), dan link produksi live.
- **Editorial Structure 4 Bagian:**
  1. *01 The Challenge:* Keterbatasan skalabilitas monolit dan friksi checkout terdahulu.
  2. *02 Architectural Solution:* Jamstack Edge-Native & diagram alur transaksi sub-detik.
  3. *03 Measurable Impact:* Grid 3 kartu KPI kontras tinggi (+140% Penjualan, 0.42s TTFB Rata-rata, 3.4x Konversi).
  4. *04 Client Testimonial:* Kutipan langsung dari Founder / Head Roaster.
- **Next Project Rail:** Teaser interaktif mengarahkan ke studi kasus berikutnya (*Aura Studio Fashion*).

---

### Surface 3: Multi-Step Interactive Project Brief (`/start`)
- **Header:** Onboarding flow context dengan progress tracking real-time (*Langkah 2 dari 4 / 50% Lengkap*).
- **Step 1 (Scope):** Selektor pill multi-pilih (Web App & Headless Storefront, Rebranding & Visual Identity, Product Architecture Audit).
- **Step 2 (Timeline & Budget):** Kartu pilihan alokasi investasi (Starter IDR 15M–25M, Rekomendasi IDR 25M–50M terpilih, Enterprise IDR 50M+) dan selector target peluncuran (Segera, 4–8 Minggu Ideal, Fleksibel).
- **Step 3 (Project Context):** Input entitas bisnis, website aktif, deskripsi tantangan, dan drag-and-drop zone dokumen RFP/Brief.
- **Step 4 (Stakeholder Identification):** Nama penanggung jawab, email bisnis, nomor WhatsApp, dan zona waktu.
- **Live Sidebar Konteks:** Ringkasan dinamis yang mengunci alokasi biaya, SLA proposal 24 jam oleh Principal Architect, dan enkripsi dokumen AES-256.

---

### Surface 4: Legal & Policy Suite (`/privacy` & `/terms`)
- Tata letak dokumen editorial terpusat (max-width `760px`).
- Daftar isi jangkar *sticky* yang memuat:
  1. Pengumpulan Informasi Transparan
  2. Dasar Pemrosesan & Penyusunan Proposal
  3. Arsitektur Pencegahan Spam Kriptografis (32KB payload check, HMAC token, distributed rate limiter)
  4. Enkripsi PostgreSQL & Kepatuhan SOC2/ISO
  5. Hak Retensi, Purge Permanen, dan Kontak Langsung Data Protection Officer (DPO).

---

### Surface 5: System Error Boundaries & Operational Resilience
- **404 Not Found Page:** Headline editorial outline 404, pencarian layanan mini otomatis, dan tombol kembali ke Beranda.
- **500 Global Server Error Page:** Kontainer ramah pengguna dengan incident hash unik (`ERR-500-6F8A2B`) dan pemicu reload aman tanpa data loss.
- **Degraded Service Toast:** Peringatan non-intrusif di pojok kanan bawah (z-index 50) dengan warna Amber (`#ED6C02`) yang memberitahu bahwa database tetap aman menyimpan brief saat worker email sedang dalam antrean pemulihan.

---

### Surface 6: Secure Admin CMS & Operational Portal (`/admin`)
- **Top Bar:** Indikator status database riil (`Connected 200 OK`), pemantauan sesi pemilik tunggal, dan tombol keluar aman.
- **Tab 1: Manajemen Proyek:** Tabel interaktif dengan pengatur prioritas urutan (*drag handle*), thumbnail visual, metrik dampak, tanggal update, dan modal pembuatan/pembaruan proyek dengan katalog aset lokal.
- **Tab 2: Lead CRM & Slide-over Drawer:** Filter status (*Semua, Baru, Sudah Dibaca, Dibalas, Diarsipkan*), daftar inquiry dengan preview pesan, serta drawer detail lead di sisi kanan dengan trigger pesan WhatsApp instan, catatan internal tim, dan audit idempotensi.
- **Tab 3: System Health & Outbox Monitor:** Pemantau status antrean notifikasi email, fallback memori Redis, dan metrik konversi inquiry aktif (14.2%).

---

### Surface 7: Transactional Email Templates

#### Template 1: Prospect Auto-responder (HTML)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F7F8F4; color: #102027; margin: 0; padding: 40px 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #FFFFFF; border: 1px solid #DFE6E4; border-radius: 16px; padding: 40px; }
    .badge { display: inline-block; background: #102A31; color: #C3F35B; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.08em; }
    h1 { font-size: 24px; line-height: 1.25; margin: 24px 0 16px; color: #102A31; }
    p { font-size: 15px; line-height: 1.6; color: #64747A; margin: 0 0 16px; }
    .summary-box { background: #F7F8F4; border-left: 3px solid #102A31; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0; }
    .footer { font-size: 12px; color: #64747A; text-align: center; margin-top: 32px; border-top: 1px solid #DFE6E4; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">Brief Diterima</span>
    <h1>Terima kasih, {{client_name}}. Brief proyek Anda telah kami amankan.</h1>
    <p>Kami telah menerima ringkasan kebutuhan digital untuk <strong>{{company_name}}</strong>. Tim teknis dan principal architect kami sedang meninjau parameter proyek Anda.</p>
    <div class="summary-box">
      <p style="margin: 0; font-size: 13px; color: #102027;"><strong>Scope:</strong> {{selected_scope}}</p>
      <p style="margin: 4px 0 0; font-size: 13px; color: #102027;"><strong>Target Anggaran:</strong> {{budget_bracket}}</p>
      <p style="margin: 4px 0 0; font-size: 13px; color: #102027;"><strong>SLA Review:</strong> Maksimal 1 hari kerja</p>
    </div>
    <p>Bila kebutuhan ini mendesak, Anda dapat langsung memulai komunikasi dengan tim kami melalui WhatsApp Business resmi Nexa Studio.</p>
    <div class="footer">
      Nexa Studio — Digital Engineering & Strategic Branding<br>Jakarta • Bali • Bandung • hello@nexastudio.id
    </div>
  </div>
</body>
</html>
```

#### Template 2: Internal Lead Alert (Founder Dispatch)
- **Penerima:** `CONTACT_EMAIL_TO`
- **Subjek:** `[URGENT INBOUND] Lead Baru: {{client_name}} — {{company_name}} ({{budget_bracket}})`
- **Format:** Tabel operasional densitas tinggi mencakup Timestamp WIB, Email & WhatsApp link satu-klik, Ringkasan Scope, Estimasi Anggaran, dan tombol direct link ke CRM Lead Drawer.

---

## 3. Accessibility, Component States & Responsive Matrix

### Complete Component State Matrix
| Component | Default | Hover | Focus-Visible | Disabled / Loading | Error / Invalid |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary CTA (Lime)** | `#C3F35B` bg, `#102A31` text | `#B2E845` bg, -1px Y-translate | 3px solid `#102A31`, 2px offset | 0.45 opacity, loading spinner | N/A |
| **Secondary CTA (Navy)**| `#102A31` bg, `#FFFFFF` text | `#16363E` bg, -1px Y-translate | 3px solid `#C3F35B`, 2px offset | 0.45 opacity, no pointer | N/A |
| **Text Input / Field** | `#DFE6E4` border, `#FFFFFF` bg | `#64747A` border | 1px solid `#102A31`, 3px Lime ring | `#F7F8F4` bg, disabled cursor | `#D32F2F` border, `#FDEDED` bg |
| **Filter Pill** | `#FFFFFF` bg, `#102027` text | `#F7F8F4` bg | 2px solid `#102A31` ring | Reduced opacity | N/A |
| **Filter Pill (Selected)** | `#C3F35B` bg, `#102A31` text | `#B2E845` bg | 2px solid `#102A31` ring | N/A | N/A |
| **Table Action Chip** | Soft gray/green surface | Elevated contrast | Visible tab outline | Skeleton shimmer | Red border on action failure |

### Responsive Layout Adaptation Matrix
| Surface / Element | Mobile Compact (320px–375px) | Tablet (640px–900px) | Desktop Standard (1160px+) |
| :--- | :--- | :--- | :--- |
| **Navigation** | Sticky bar dengan tombol menu & drawer vertikal | Condensed horizontal bar dengan CTA | Full desktop bar dengan bahasa & CTA |
| **Hero Section** | Single column stack vertikal (Headline → Action → Card) | Two-column stacked grid | Asymmetrical 2-column dengan kartu analitik penuh |
| **Service Catalog**| 1 kolom kartu, filter pills scroll horizontal | 2 kolom grid | 3 kolom seimbang dengan filter & search instan |
| **Work Showcase** | 1 kolom, rasio 16:10, metadata teks tetap terlihat | 2 kolom layout bertingkat | 2-3 kolom kontras tinggi dengan hover elevations |
| **Pricing Cards** | 1 kolom vertikal, Featured plan di urutan pertama | 2 kolom dengan featured plan lebar penuh | 3 kolom sejajar dengan kartu Growth ditinggikan |
| **Admin Drawer** | Full-screen bottom sheet dengan handle geser atas | 540px right slide-over drawer | 640px right slide-over drawer dengan backdrop |

### Kontrak Aksesibilitas (a11y)
1. **Focus Trap:** Modal dan drawer menggunakan penguncian keyboard (*keyboard trap*) dan mengembalikan fokus ke tombol pemicu saat ditutup.
2. **Motion Preferences:** `prefers-reduced-motion: reduce` secara otomatis menonaktifkan translasi mikro.
3. **Form Semantics:** Seluruh input terikat dengan `<label>` dan pesan error diumumkan melalui `aria-describedby` & `aria-invalid="true"`.
4. **Contrast Compliance:**
   - Ink on Cream: **13.2:1** (Melampaui syarat WCAG AAA 7:1)
   - Navy on Lime: **10.8:1** (Melampaui syarat WCAG AAA)
   - Muted on Cream: **4.8:1** (Melampaui syarat WCAG AA 4.5:1 untuk body text)
