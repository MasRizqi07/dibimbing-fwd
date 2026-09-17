# Nexa Studio — Full-Stack Digital Agency Web Platform

> 🌐 **Live Production URL:** [https://dibimbing-fwd.vercel.app](https://dibimbing-fwd.vercel.app)

Nexa Studio adalah website digital agency yang membantu UMKM dan brand lokal
terlihat lebih profesional, dipercaya, dan menghasilkan. Repository ini
menggabungkan landing page marketing, katalog layanan dengan search/filter,
portfolio yang dikelola melalui CMS admin, serta contact pipeline berbasis
PostgreSQL.

## Documentation map

- [PRD.md](./PRD.md) — tujuan produk, persona, scope, requirement, dan acceptance criteria.
- [Design.md](./Design.md) — user flow, wireframe tekstual, interaction pattern, dan responsive behavior.
- [Design_System.md](./Design_System.md) — visual token, component state, dan accessibility rules.
- [Architecture.md](./Architecture.md) — boundary aplikasi, data flow, security, deployment, dan operational concerns.
- [session_analysis_report.md](./session_analysis_report.md) — audit dan hardening yang sudah dilakukan.

Platform web full-stack modern untuk agency fiktif **Nexa Studio**, dibangun dengan **Next.js 16 (App Router)**, **TypeScript**, **PostgreSQL (Neon)** via **Prisma ORM**, **Zod**, **Resend**, dan **Vitest**.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 16.3.5](https://nextjs.org) (App Router, Server Components & Server Actions, Next.js Proxy)
- **Language:** TypeScript (Strict mode enabled)
- **Database:** PostgreSQL via [Neon](https://neon.tech) (Serverless Database)
- **ORM:** [Prisma ORM 6](https://www.prisma.io)
- **Validation:** [Zod](https://zod.dev) (Double-layer client & API validation)
- **Email:** [Resend](https://resend.com)
- **Authentication:** Admin session signed cookie (HMAC-SHA256 Web Crypto) + Bcrypt
- **Operations:** Database readiness endpoint at `/api/health`
- **Testing:** [Vitest](https://vitest.dev)
- **Styling:** Vanilla CSS + Tailwind CSS 4

---

## 📁 Struktur Arsitektur

```
dibimbing-fwd/
├── app/
│   ├── layout.tsx              # Root layout, Geist font, SEO metadata, JSON-LD
│   ├── page.tsx                # Homepage RSC (Dynamic fetch project dari Neon DB)
│   ├── sitemap.ts              # Dynamic sitemap.xml generator
│   ├── robots.ts               # Dynamic robots.txt generator
│   ├── api/
│   │   └── contact/
│   │       └── route.ts        # POST endpoint: Zod validation, anti-spam, Neon DB, Resend
│   ├── admin/
│   │   ├── layout.tsx          # Admin shell & navigation header
│   │   ├── page.tsx            # Admin dashboard: Portfolio & submission management
│   │   └── login/
│   │       └── page.tsx        # Single-password login form
│   └── actions/
│       ├── auth.ts             # Server actions untuk login & logout admin
│       └── projects.ts         # Server actions untuk CRUD project (revalidatePath)
├── components/
│   ├── ContactForm.tsx         # Interactive client form dengan honeypot anti-spam
│   ├── ServiceCatalog.tsx      # Search/filter katalog layanan dan CTA konsultasi
│   └── admin/
│       └── ProjectManager.tsx  # CMS UI untuk CRUD project & monitoring pesan masuk
├── lib/
│   ├── prisma.ts               # Singleton Prisma client
│   ├── resend.ts               # Resend client wrapper
│   ├── validation.ts           # Zod schema validasi form kontak
│   └── admin-session.ts        # HMAC session token signing & verification
├── prisma/
│   ├── schema.prisma           # Prisma schema (Project & ContactSubmission)
│   ├── prisma.config.ts        # Prisma CLI schema, migration, and seed configuration
│   ├── seed.ts                 # Database seed script (Kopi Koma, Sora Studio, Ruang Pulih)
│   └── migrations/             # SQL migrations PostgreSQL
├── proxy.ts                    # Next.js 16 Proxy untuk proteksi route /admin
├── public/
│   └── projects/               # Aset gambar portfolio teroptimasi (< 500KB)
├── __tests__/                  # Vitest unit & integration test suites
├── PRD.md                      # Product requirements document
├── Design.md                   # UX flow dan wireframe plan
├── Design_System.md            # UI tokens dan component standards
└── Architecture.md             # Technical architecture dan operational model
```

---

## 🛠️ Panduan Setup Lokal

### 1. Prasyarat
- **Node.js:** Versi 20.6.0+ (disarankan Node.js 22+)
- **NPM:** Versi 10+
- **Akun Neon:** Database PostgreSQL

### 2. Kloning & Branch
```bash
git clone https://github.com/MasRizqi07/dibimbing-fwd.git
cd dibimbing-fwd
git checkout feature/fullstack-backend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel pada `.env.local`:
```env
# Database Neon PostgreSQL (Pooler connection string)
DATABASE_URL="postgresql://[user]:[password]@[endpoint-pooler].neon.tech/neondb?sslmode=require"

# Resend Email Service
RESEND_API_KEY="re_your_api_key"
CONTACT_EMAIL_TO="email-anda@domain.com"
RESEND_FROM_EMAIL="onboarding@resend.dev"

# Admin CMS Credentials
ADMIN_PASSWORD="bcrypt-hash-password-admin-anda"
ADMIN_SESSION_SECRET="string-acak-unik-minimal-32-karakter"

# Public URL & Kontak
NEXT_PUBLIC_WHATSAPP_NUMBER="628xxxxxxxxxx"
NEXT_PUBLIC_CONTACT_EMAIL="contact@yourbusiness.com"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 5. Migrasi & Seed Database
Jalankan migrasi Prisma untuk membuat tabel di database Neon:
```bash
node --env-file=.env.local ./node_modules/prisma/build/index.js migrate dev --name init
```

Jalankan script seed untuk mengisi 3 data project awal:
```bash
node --env-file=.env.local --experimental-strip-types prisma/seed.ts
```

Untuk environment staging/production, jalankan migration yang sudah direview:
```bash
node --env-file=.env.local ./node_modules/prisma/build/index.js migrate deploy
```

Konfigurasi Prisma CLI berada di `prisma.config.ts`; environment variable `DATABASE_URL`
tetap harus tersedia ketika command Prisma dijalankan.

Generate bcrypt hash untuk password admin sebelum production:
```bash
node -e "require('bcryptjs').hash(process.argv[1], 12).then(console.log)" "password-kuat-anda"
```

### 6. Jalankan Server Development
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🧪 Pengujian & Linting

Jalankan seluruh test suite unit & integrasi (Vitest):
```bash
npm test
```

Jalankan type-check dan linting:
```bash
npx tsc --noEmit
npm run lint
```

Jalankan build produksi:
```bash
npm run build
```

---

## 🔐 Akses Admin CMS

1. Buka [http://localhost:3000/admin](http://localhost:3000/admin).
2. Jika belum login, Anda akan otomatis dialihkan ke `/admin/login`.
3. Masukkan password admin sesuai konfigurasi `ADMIN_PASSWORD` pada `.env.local`.
4. Di dashboard `/admin`, Anda dapat:
   - Melihat daftar project aktif.
   - Menambahkan project baru.
   - Mengedit data project yang sudah ada.
   - Menghapus project.
   - Memantau pesan kontak yang dikirim oleh pengunjung melalui website.

Health check deployment:
- `GET /api/health` mengembalikan `200` jika aplikasi dan database siap.
- Endpoint mengembalikan `503` jika koneksi database sedang tidak tersedia dan tidak menyimpan response di cache.

Catatan keamanan:
- Production menolak `ADMIN_SESSION_SECRET` yang tidak dikonfigurasi.
- Production mengharuskan `ADMIN_PASSWORD` berupa bcrypt hash.
- Login dan contact submission memiliki bounded in-memory rate limiting. Untuk deployment multi-instance, ganti limiter ini dengan provider terdistribusi seperti Redis/Upstash.

---

## 🚢 Deployment ke Vercel (Production)

Website Nexa Studio telah aktif dan dideploy ke Vercel di domain:
- **Live URL:** [https://dibimbing-fwd.vercel.app](https://dibimbing-fwd.vercel.app)
- **Health Check Endpoint:** [https://dibimbing-fwd.vercel.app/api/health](https://dibimbing-fwd.vercel.app/api/health)
- **Admin CMS:** [https://dibimbing-fwd.vercel.app/admin](https://dibimbing-fwd.vercel.app/admin) (terproteksi auth redirect ke `/admin/login`)

Langkah setup environment variables di dashboard [Vercel](https://vercel.com) (Settings > Environment Variables):
- `DATABASE_URL`: Connection string PostgreSQL Neon (dengan `sslmode=require`)
- `ADMIN_PASSWORD`: Bcrypt hash dari password admin
- `ADMIN_SESSION_SECRET`: String acak kriptografis (minimal 32 karakter)
- `RESEND_API_KEY`: API key Resend untuk pengiriman email
- `CONTACT_EMAIL_TO`: Alamat email penerima notifikasi pesan kontak (`sembarangananak@gmail.com`)
- `RESEND_FROM_EMAIL`: Alamat sender Resend (`onboarding@resend.dev`)
- `NEXT_PUBLIC_SITE_URL`: `https://dibimbing-fwd.vercel.app`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Nomor WhatsApp bisnis
- `NEXT_PUBLIC_CONTACT_EMAIL`: Email kontak publik bisnis


---

## 📸 Kredit Gambar

Seluruh gambar mockup portfolio menggunakan stok foto fotografi asli berlisensi bebas royalti dari [Unsplash](https://unsplash.com) (Unsplash License — bebas digunakan untuk keperluan komersial dan non-komersial tanpa watermark AI):

1. **Kopi Koma (`public/projects/kopi-koma.jpg`)**
   - **Fotografer:** [Nathan Dumlao](https://unsplash.com/@nate_dumlao)
   - **Sumber:** [Unsplash (zUNs99PGDg0)](https://unsplash.com/photos/zUNs99PGDg0)
   - **Deskripsi:** Specialty coffee latte art di atas cangkir keramik pada meja kayu kedai kopi.

2. **Sora Studio (`public/projects/sora-studio.jpg`)**
   - **Fotografer:** [Alyssa Strohmann](https://unsplash.com/@anotherlovely)
   - **Sumber:** [Unsplash (TS--uNw-JqE)](https://unsplash.com/photos/hanged-top-on-brown-and-white-clothes-horse-TS--uNw-JqE)
   - **Deskripsi:** Minimalist apparel rack & clothing boutique studio display.

3. **Ruang Pulih (`public/projects/ruang-pulih.jpg`)**
   - **Fotografer:** [Engin Akyurt](https://unsplash.com/@enginakyurt)
   - **Sumber:** [Unsplash (SMwCQZWayj0)](https://unsplash.com/photos/hot-stone-massage-in-spa-SMwCQZWayj0)
   - **Deskripsi:** Hot stone spa treatment & holistic relaxation therapy setting.

