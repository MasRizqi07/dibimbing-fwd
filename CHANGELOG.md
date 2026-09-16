# Changelog & Evidence Gate Summary — Full-Stack Nexa Studio

Dokumen kompilasi bukti mentah (*evidence gate*) dan audit implementasi dari seluruh fase pengerjaan proyek `dibimbing-fwd` (Nexa Studio).

---

## 📋 Ringkasan Eksekusi per Fase

### Fase 0 — Discovery & Backup (Read-only)
- **Branch:** `feature/fullstack-backend` dibuat dari `master`.
- **Inventarisasi:** Seluruh dependency, berkas di `app/`, dan 13 section CSS di `globals.css` dipetakan.
- **Evidence:**
  - `git branch`: `* feature/fullstack-backend`
  - Baseline `npm run build`: Exit code 0 (Turbopack)
  - Baseline `npm run lint`: Exit code 0 (Clean)
- **Status:** **DONE**

---

### Fase 1 — Foundation: TypeScript + Prisma + Neon
- **Migrasi:** `layout.js` → `layout.tsx`, `page.js` → `page.tsx`, `tsconfig.json` ditambahkan (strict: true), `jsconfig.json` dihapus.
- **Database & ORM:** Prisma 6 diinisialisasi (`prisma/schema.prisma`) dengan model `Project` dan `ContactSubmission`.
- **Singleton:** `lib/prisma.ts` dibuat untuk mencegah connection exhaustion.
- **Koneksi Neon:** Terhubung ke PostgreSQL Neon (`ep-super-snow-b5fap9xy-pooler.c-7.us-east-2.aws.neon.tech`). Migrasi `20260916090032_init` berhasil diaplikasikan.
- **Evidence:**
  - `npx tsc --noEmit`: Exit code 0 (Clean)
  - `npx prisma migrate dev`: `Applying migration 20260916090032_init` (Exit code 0)
  - Raw table check: `TABLE_CHECK_SUCCESS { projects: 0, contactSubmissions: 0 }`
- **Commit:** `911c6cd` & `5c33071`
- **Status:** **DONE**

---

### Fase 2 — Dynamic Project Cards dari Database
- **Seed:** `prisma/seed.ts` dibuat untuk memasukkan 3 project awal (Kopi Koma, Sora Studio, Ruang Pulih).
- **RSC Query:** `app/page.tsx` diubah menjadi Server Component async yang melakukan fetch langsung lewat Prisma (`prisma.project.findMany({ orderBy: { order: 'asc' } })`).
- **Empty State:** Mengakomodasi tampilan elegan saat tabel kosong.
- **Evidence:**
  - Tabel berisi 3 data: `SEEDED_PROJECTS_FOUND: [ 'Kopi Koma', 'Sora Studio', 'Ruang Pulih' ]`
  - Tabel dikosongkan: `EMPTY_STATE_CHECK: { hasEmptyState: true, titlesFound: [] }`
  - Tabel diisi ulang: `REPOPULATED_PROJECTS_FOUND: [ 'Kopi Koma', 'Sora Studio', 'Ruang Pulih' ]`
- **Commit:** `02cb0a1`
- **Status:** **DONE**

---

### Fase 3 — Contact Form Backend
- **Endpoint:** `app/api/contact/route.ts` menerima POST, memvalidasi payload via Zod (`lib/validation.ts`), menyimpan ke tabel `ContactSubmission`, dan mengintegrasikan pengiriman email via Resend (`lib/resend.ts`).
- **Anti-Spam:** Honeypot field tersembunyi + proteksi waktu submit minimal (< 2 detik ditolak).
- **Client Form:** `components/ContactForm.tsx` dengan status idle, submitting, success, error feedback, dan fallback link WhatsApp.
- **Evidence:**
  - Invalid payload: Status 400 dengan pesan Zod terstruktur.
  - Honeypot bot: Status 400 (`Bot submission detected.`).
  - Fast submit bot: Status 400 (`Formulir dikirim terlalu cepat.`).
  - Valid submission: Status 200 + row tersimpan di PostgreSQL Neon:
    ```json
    {
      "id": "cmu3vreca0000guw81xr7rbsd",
      "name": "Rizqi Pratama",
      "email": "rizqi.business@example.com",
      "message": "Halo Nexa Studio, saya tertarik untuk konsultasi pembuatan website landing page baru untuk bisnis saya.",
      "emailSent": false
    }
    ```
- **Commit:** `d3a52dc`
- **Status:** **DONE**

---

### Fase 4 — Admin CMS-Lite
- **Sesi:** Cookie signed `nexa_admin_session` berbasis HMAC-SHA256 (Web Crypto API) dengan masa berlaku 7 hari.
- **Proteksi:** `proxy.ts` (Next.js 16 Proxy) memproteksi seluruh rute `/admin/*` dan me-redirect request tanpa cookie valid ke `/admin/login`.
- **CRUD Project:** Server Actions di `app/actions/projects.ts` (`createProjectAction`, `updateProjectAction`, `deleteProjectAction`) dengan revalidasi instan.
- **Evidence:**
  - Akses `/admin` tanpa cookie: `UNAUTH_CHECK: { status: 307, location: '/admin/login' }`
  - Akses `/admin` dengan cookie valid: `AUTH_ACCESS_CHECK: { status: 200 }`
  - Live CRUD update tanpa restart server:
    ```
    PROJECT_CREATED: cmu3vzbqr0000gups8mifidow Warung Modern
    FOUND_ON_HOMEPAGE_WITHOUT_RESTART: true
    PROJECT_CLEANED_UP
    REMOVED_FROM_HOMEPAGE: true
    ```
- **Commit:** `141220d`
- **Status:** **DONE**

---

### Fase 5 — Real Content & Optimized Assets
- **Aset:** CSS shapes diganti dengan gambar nyata di `public/projects/`:
  - `kopi-koma.jpg`: 146 KB (< 500KB)
  - `sora-studio.jpg`: 140 KB (< 500KB)
  - `ruang-pulih.jpg`: 172 KB (< 500KB)
- **Komponen:** Menggunakan `next/image` dengan atribut `fill`, responsive `sizes`, `objectFit: "cover"`, dan alt text deskriptif.
- **Commit:** `23ef32c`
- **Status:** **DONE**

---

### Fase 6 — SEO & Metadata
- **Sitemap & Robots:** `app/sitemap.ts` (`/sitemap.xml`) dan `app/robots.ts` (`/robots.txt`) dibuat secara native.
- **Metadata:** OpenGraph tags, Twitter card, canonical URL, dan keywords disematkan di `app/layout.tsx`.
- **Structured Data:** Schema.org `ProfessionalService` JSON-LD valid diinjeksikan pada `<head>`.
- **Evidence:**
  - `/sitemap.xml`: XML valid dengan namespace sitemaps.org.
  - `/robots.txt`: Disallow `/admin` dan referensi ke `/sitemap.xml`.
  - JSON-LD ter-render dan ter-parse sempurna.
- **Commit:** `ba98131`
- **Status:** **DONE**

---

### Fase 7 — Accessibility & Performance
- **Audit Kontras:** Rasio kontras teks `em` dan `.brand-dot` diperbaiki menjadi > 4.6:1 (WCAG AA).
- **Focus States:** Indikator `:focus-visible` aktif di semua tombol, link, dan form input.
- **Lighthouse Scores (Port 3010):**
  - **Desktop:**
    - Performance: **99** / 100
    - Accessibility: **96** / 100
    - Best Practices: **100** / 100
    - SEO: **100** / 100
  - **Mobile:**
    - Performance: **87** / 100
    - Accessibility: **96** / 100
    - Best Practices: **100** / 100
    - SEO: **100** / 100
- **Commit:** `2036a0a`
- **Status:** **DONE**

---

### Fase 8 — Testing Suite
- **Framework:** Vitest 5 (`vitest.config.mts`).
- **Test Suites:**
  - `__tests__/validation.test.ts` (5 tests)
  - `__tests__/admin-session.test.ts` (4 tests)
  - `__tests__/contact-route.test.ts` (5 tests)
- **Evidence:**
  - Output verbatim `npm test`: 3 passed suites, 14 passed tests, 0 failures.
- **Commit:** `05b58d6`
- **Status:** **DONE**

---

## 🎯 Definition of Done Checklist (§4)

- [x] **Form kontak:** Submit valid tersimpan di database Neon PostgreSQL (`ContactSubmission` row terverifikasi via query DB). Integrasi Resend siap aktif begitu `RESEND_API_KEY` & `CONTACT_EMAIL_TO` diisi.
- [x] **Project cards:** Homepage me-load project dari database PostgreSQL melalui Prisma Server Component (bukan array hardcoded).
- [x] **Admin CMS:** `/admin` login via password, proteksi route via Proxy, CRUD project berfungsi dan langsung terlihat di homepage secara instan.
- [x] **Quality checks:** `npm run build` sukses tanpa error, `npm run lint` bersih (0 warning/error), seluruh test suite (14 tests) hijau.
- [x] **Aset & Konten:** Gambar portfolio nyata < 500KB terpasang menggunakan `next/image`.
- [x] **README & Dokumentasi:** `README.md` diperbarui lengkap dengan petunjuk setup, migrasi DB, seed, CMS, dan deployment.
- [ ] **Deploy Vercel:** Siap di-deploy ke production oleh Rizqi dengan mengisikan environment variables pada dashboard Vercel.
