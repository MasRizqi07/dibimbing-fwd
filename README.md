# Nexa Studio — Full-Stack Digital Agency Web Platform

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
└── __tests__/                  # Vitest unit & integration test suites
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

## 🚢 Panduan Deployment ke Vercel

1. Push branch `feature/fullstack-backend` ke GitHub.
2. Buka dashboard [Vercel](https://vercel.com) dan buat proyek baru yang mengarah ke repositori ini.
3. Di tab **Settings > Environment Variables**, tambahkan:
   - `DATABASE_URL` (dari Neon)
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL_TO`
   - `NEXT_PUBLIC_SITE_URL` (contoh: `https://nexa-studio.vercel.app`)
4. Jalankan Deploy.
