# Product Requirements Document — Nexa Studio

**Status:** Website agency; implementasi lokal diperbarui, release eksternal belum diverifikasi
**Product type:** Marketing website + service catalog + lightweight admin CMS  
**Primary market:** UMKM dan brand lokal Indonesia  
**Last updated:** 2026-09-21

## 1. Product summary

Nexa Studio membantu pemilik bisnis yang membutuhkan website, branding, atau
konten untuk bergerak dari “ingin terlihat profesional” menjadi lead yang siap
berkonsultasi. Conversion utama adalah percakapan konsultasi melalui form
kontak dan WhatsApp, bukan checkout otomatis.

## 2. Problem statement

Target customer sering kesulitan menjelaskan kebutuhan digital, membandingkan
jenis layanan, dan mempercayai vendor baru. Website harus menjawab dengan cepat:

1. Apakah Nexa memahami bisnis saya?
2. Layanan apa yang paling relevan?
3. Bagaimana saya memulai tanpa proses rumit?

## 3. Goals and non-goals

### Goals

- Menjelaskan positioning dan value proposition dalam beberapa detik.
- Membantu user menemukan layanan melalui search dan category filter.
- Menampilkan portofolio dan hasil kerja melalui konten yang dikelola admin. Pemilik bertanggung jawab memvalidasi izin logo, angka performa, dan klaim hasil sebelum publikasi.
- Mengubah intent menjadi lead melalui contact form atau WhatsApp.
- Memberikan owner/admin workflow minimal untuk mengelola portfolio dan membaca
  submission.
- Memenuhi baseline accessibility, responsive design, security, dan SEO.

### Non-goals for current release

- Tidak ada checkout, payment gateway, cart, atau order fulfillment otomatis.
- Tidak ada akun client individual atau multi-tenant workspace.
- Tidak ada marketplace vendor atau review publik.
- Tidak ada CRM lifecycle lengkap untuk status lead, assignment, dan retention.

## 4. Personas

| Persona | Need | Success signal |
| --- | --- | --- |
| Pemilik UMKM | Website dan branding yang mudah dipahami | Mengirim brief yang cukup detail |
| Brand lokal yang tumbuh | Portfolio dan positioning lebih premium | Memilih paket Growth atau Custom |
| Owner agency | Mengelola portofolio tanpa deploy ulang | CRUD project berhasil dari `/admin` |
| Owner agency | Memantau inquiry yang masuk | Submission tersimpan; status email terlihat terpisah |

## 5. User journeys

### Visitor to lead

```text
Landing page -> memahami value -> mencari layanan
-> membaca portfolio/pricing -> memilih CTA
-> mengisi contact form atau membuka WhatsApp -> lead tersimpan
```

### Admin content loop

```text
Admin login -> dashboard -> create/update/delete project
-> homepage membaca project terurut -> visitor melihat proof terbaru
```

## 6. Functional requirements

### Public experience

- Homepage memiliki navigation, hero, services, portfolio, process, pricing,
  contact, dan footer.
- Search layanan bekerja real-time pada title, description, dan category.
- Category filter menyediakan `Semua`, `Website`, `Branding`, dan `Konten`.
- Empty search state menyediakan reset action.
- Portfolio membaca `Project` dari database berdasarkan `order`, lalu `id` sebagai tie-breaker.
- Contact form memvalidasi nama, email, pesan, honeypot, token anti-spam server, dan UUID idempotensi.
- Beranda menampilkan logo klien, harga Starter/Growth/Custom, serta angka performa dan hasil proyek yang disetujui pemilik. Form menjelaskan pemrosesan data dan menuju `/privacy`.
- CTA eksternal membuka WhatsApp dengan `rel="noreferrer"`.

### Admin experience

- `/admin` hanya dapat dibuka setelah signed session tervalidasi.
- Admin dapat create, read, update, dan delete project.
- Admin memilih gambar dari katalog aset lokal yang direview; upload belum tersedia.
- Admin dapat melihat contact submissions yang tersimpan.
- Admin dapat mengubah status `new`, `read`, `replied`, `archived` dengan validasi server.
- Mutation harus melewati auth guard dan shared validation.

### Operations

- `GET /api/health` mengembalikan readiness database.
- `GET /api/live` mengembalikan liveness tanpa query database.
- Invalid payload menghasilkan error yang aman dan dapat ditampilkan ke user.
- Rate limit diterapkan pada login dan contact submission. Redis opsional; fallback memori per proses harus dipantau.
- Email adalah proses terpisah; pesan sukses hanya menjamin penyimpanan database. Cron mengulang notifikasi sesuai kapasitas/frekuensi hosting.

## 7. Non-functional requirements

- TypeScript strict mode dan lint tanpa error.
- Responsive pada 320px sampai desktop ultra-wide.
- Tidak ada horizontal overflow pada public page.
- Password production menggunakan bcrypt hash.
- Session cookie HTTP-only, secure di production, dan SameSite Lax.
- Database mutation tidak boleh dipanggil tanpa authorization.
- Build, tests, migrasi pada database terisolasi, CI exact commit, staging, dan smoke production adalah gerbang terpisah sebelum klaim release.

## 8. Success metrics

| Metric | Baseline target |
| --- | --- |
| Homepage response | HTTP 200 |
| Health response | HTTP 200 saat database ready |
| Form completion | User dapat submit valid brief tanpa error UI |
| Search feedback | Result count berubah saat query/filter berubah |
| Responsive quality | 0 horizontal overflow pada target breakpoints |
| Regression suite | Semua test pass |

## 9. Acceptance criteria

- User dapat menemukan layanan dengan query `branding`.
- User dapat reset query dan kembali melihat semua layanan.
- User dapat mengirim contact form valid dan melihat success state.
- Payload invalid tidak membuat server crash atau membocorkan detail internal.
- Unauthenticated request ke `/admin` diarahkan ke login.
- Portfolio baru dari admin tampil sesuai urutan setelah revalidation.
- `npm run lint`, `npx tsc --noEmit`, `npm test`, dan `npm run build` pass.

## 10. Future backlog

Keputusan produk berikutnya: identitas bisnis/izin klaim, kebijakan retensi dan SLA respons, serta kebutuhan multi-operator. Jika operasi nyata membutuhkan banyak admin, ganti shared password dengan akun per orang, sesi yang dapat dicabut, peran, dan audit. Uji provider Redis/Resend, backup/restore, aksesibilitas, performa, dan release di staging sebelum promosi production.
