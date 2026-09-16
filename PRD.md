# Product Requirements Document — Nexa Studio

**Status:** Implemented baseline  
**Product type:** Marketing website + service catalog + lightweight admin CMS  
**Primary market:** UMKM dan brand lokal Indonesia  
**Last updated:** 2026-09-16

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
- Menampilkan bukti kerja melalui portfolio yang dikelola admin.
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
| Owner Nexa | Mengelola proof of work tanpa deploy ulang | CRUD project berhasil dari `/admin` |
| Admin/operator | Memantau inquiry yang masuk | Submission tersimpan dan email optional terkirim |

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
- Portfolio membaca `Project` dari database berdasarkan `order`.
- Contact form memvalidasi nama, email, message, honeypot, dan render time.
- CTA eksternal membuka WhatsApp dengan `rel="noreferrer"`.

### Admin experience

- `/admin` hanya dapat dibuka setelah signed session tervalidasi.
- Admin dapat create, read, update, dan delete project.
- Admin dapat melihat contact submissions yang tersimpan.
- Mutation harus melewati auth guard dan shared validation.

### Operations

- `GET /api/health` mengembalikan readiness database.
- Invalid payload menghasilkan error yang aman dan dapat ditampilkan ke user.
- Rate limit diterapkan pada login dan contact submission.

## 7. Non-functional requirements

- TypeScript strict mode dan lint tanpa error.
- Responsive pada 320px sampai desktop ultra-wide.
- Tidak ada horizontal overflow pada public page.
- Password production menggunakan bcrypt hash.
- Session cookie HTTP-only, secure di production, dan SameSite Lax.
- Database mutation tidak boleh dipanggil tanpa authorization.
- Build, tests, Prisma validation, dan migration status harus pass sebelum
  release.

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

Prioritas berikutnya adalah distributed rate limiting, browser E2E tests, lead
status workflow, observability, dan optional client account architecture.
Setiap item harus dirancang terpisah agar tidak memperluas shared admin password
model secara tidak aman.
