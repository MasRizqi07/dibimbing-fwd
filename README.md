# Nexa Studio

Website **studi konsep agency**, dibangun dengan Next.js 16 App Router, React 19, TypeScript, Prisma 6/PostgreSQL, Zod, Resend opsional, dan Upstash Redis opsional. Portofolio, proses, dan paket adalah contoh; situs ini belum membuktikan hasil bisnis atau mewakili agency yang beroperasi. Form kontak menyimpan data nyata bila database dikonfigurasi, sehingga halaman `/privacy` harus dibaca sebelum mengirim pesan.

## Fitur dan batas produk

- Beranda responsif dengan menu mobile, pencarian layanan, portofolio dari database, contoh cakupan paket, dan form kontak.
- CMS `/admin` untuk satu owner: proyek dengan pilihan aset lokal yang direview, inbox kontak, filter, pagination, dan status. Sesi memakai cookie bertanda tangan; ini belum menyediakan identitas operator individual atau pencabutan per sesi.
- Kontak memakai token anti-spam bertanda tangan, batas ukuran, rate limit, kunci idempotensi, fingerprint payload, serta penyimpanan database sebelum notifikasi email. Key yang sama dengan payload berbeda menghasilkan `409`.
- Notifikasi email memakai claim/lease database, retry terjadwal, dan kunci idempotensi Resend. `vercel.json` menjadwalkan cron sekali per hari; email tidak memiliki SLA segera. Bila Resend tidak dikonfigurasi, pesan tetap tersimpan dan dapat dilihat admin.
- `/api/live` adalah liveness; `/api/health` menguji kesiapan database. Sitemap memuat beranda dan halaman pemrosesan data, tanpa tanggal perubahan fiktif. Gambar Open Graph dan Twitter memakai identitas konsep saat ini.

## Menjalankan lokal

Prasyarat: Node.js 22.12+, npm 10+, PostgreSQL yang **khusus untuk lingkungan lokal**. Periksa tujuan `DATABASE_URL` sebelum menjalankan migrasi atau seed.

```bash
npm ci
# Salin .env.example ke .env.local dan isi DATABASE_URL lokal serta secret yang diperlukan.
npm run db:migrate
node --experimental-strip-types prisma/seed.ts
npm run dev
```

`npm run build` hanya menjalankan `prisma generate && next build` dan tidak mengubah database. `npm run db:migrate` adalah langkah eksplisit. Seed berisi tiga proyek studi konsep; jalankan sekali pada database yang memang disiapkan untuk demo. `prisma.config.ts` membaca `.env.local` saat `DATABASE_URL` belum tersedia; override environment eksplisit untuk CI/staging.

### Variabel lingkungan

| Variabel | Kegunaan |
| --- | --- |
| `DATABASE_URL` | PostgreSQL untuk runtime dan perintah Prisma. |
| `ADMIN_PASSWORD` | Hash bcrypt password owner; wajib berbentuk hash di production. |
| `ADMIN_SESSION_SECRET` | Secret acak untuk cookie sesi dan token anti-spam, sama di semua instance. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate limit terdistribusi. Tanpanya atau saat gagal, fallback memori per proses. |
| `TRUSTED_PROXY_IP_HEADER` | Header IP yang **ditimpa oleh reverse proxy tepercaya**. Biarkan kosong di Vercel; aplikasi memakai `x-vercel-forwarded-for`. |
| `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `RESEND_FROM_EMAIL` | Notifikasi email opsional. Gunakan identitas pengirim yang diverifikasi provider untuk operasi nyata. |
| `CRON_SECRET` | Bearer secret untuk `/api/cron/notifications` di Vercel. |
| `NEXT_PUBLIC_SITE_URL` | URL canonical untuk metadata/sitemap; wajib diisi dengan domain yang disetujui sebelum promosi production. Tanpanya aplikasi memakai `VERCEL_URL` atau localhost. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_INSTAGRAM_URL` | Link publik opsional; CTA kontak internal tetap berfungsi bila kosong. |
| `CONTACT_RETENTION_DAYS` | Hanya untuk skrip purge manual setelah kebijakan disetujui. |

Jangan taruh secret di variabel `NEXT_PUBLIC_*`. Contoh konfigurasi ada di [.env.example](./.env.example). Buat hash bcrypt dengan alat yang aman dan simpan hanya hasil hash pada environment deployment.

## Verifikasi

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=high
git diff --check
```

Browser E2E memakai database PostgreSQL **terisolasi pada host lokal** yang sudah dimigrasi. Set `TEST_DATABASE_URL` ke database itu dan `E2E_TEST_MODE=1`, lalu jalankan `npm run test:e2e`. Harness menolak host database remote, membangun aplikasi dengan konfigurasi uji, menonaktifkan email keluar, dan membuat hash password uji sementara. Jangan mengarahkannya ke database bersama atau production. CI di [.github/workflows/verify.yml](./.github/workflows/verify.yml) menjalankan lint, typecheck, Vitest, build, serta Playwright pada service PostgreSQL sementara.

Verifikasi lokal tidak membuktikan CI pada SHA yang akan dipush, staging, provider email/Redis sungguhan, backup/restore, maupun production. Langkah promosi dan insiden ada di [OPERATIONS.md](./OPERATIONS.md).

`package.json` sementara meng-override `deepmerge-ts` ke versi 8.0.1+ untuk menutup advisory pada dependensi loader konfigurasi Prisma. Lepas override hanya setelah rilis Prisma yang dipakai sudah membawa versi perbaikan, lalu ulangi audit dan semua gate.

## Dokumentasi

- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md): temuan F01–F16, keputusan produk, fase, dan acceptance.
- [PRD.md](./PRD.md): tujuan dan kontrak produk.
- [Design.md](./Design.md) dan [Design_System.md](./Design_System.md): interaksi, responsivitas, dan token visual.
- [Architecture.md](./Architecture.md): arsitektur, alur data, dan batas keamanan.
- [OPERATIONS.md](./OPERATIONS.md): release, observability, backup, restore, retensi, dan respons insiden.
- [session_analysis_report.md](./session_analysis_report.md): analisis sesi sebelumnya, terpisah dari perubahan implementasi ini.

## Kredit aset

Tiga gambar portofolio adalah foto stok dari Unsplash dan **bukan bukti proyek klien**. Sumber: [Kopi Koma, Nathan Dumlao](https://unsplash.com/photos/zUNs99PGDg0), [Sora Studio, Alyssa Strohmann](https://unsplash.com/photos/hanged-top-on-brown-and-white-clothes-horse-TS--uNw-JqE), dan [Ruang Pulih, Engin Akyurt](https://unsplash.com/photos/hot-stone-massage-in-spa-SMwCQZWayj0). Verifikasi izin penggunaan dan kesesuaian identitas sebelum memakai situs sebagai bisnis nyata.
