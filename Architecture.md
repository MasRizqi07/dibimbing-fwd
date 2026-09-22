# Nexa Studio Technical Architecture

## 1. Architecture overview

Nexa Studio menggunakan Next.js App Router dengan boundary sederhana:

```mermaid
flowchart LR
  Browser[Visitor browser] --> Next[Next.js App Router]
  Next --> RSC[Homepage Server Component]
  RSC --> Prisma[Prisma Client]
  Prisma --> DB[(PostgreSQL / Neon)]
  Browser --> Catalog[ServiceCatalog Client Component]
  Browser --> Contact[POST /api/contact]
  Contact --> Validate[Zod + abuse checks]
  Validate --> Prisma
  Validate --> Outbox[Database notification state]
  Cron[Authenticated scheduled retry] --> Outbox
  Outbox --> Resend[Resend optional email]
  Admin[Admin browser] --> Proxy[Next.js proxy]
  Proxy --> Session[Signed session verification]
  Admin --> Actions[Authorized Server Actions]
  Actions --> Prisma
```

## 2. Repository boundaries

```text
app/          presentation, routes, server actions, metadata
components/   interactive UI components
lib/          infrastructure and reusable domain validation
prisma/       schema, migration, seed, CLI config
public/       static assets
__tests__/    unit and route-level regression tests
```

Project belum dipecah menjadi banyak feature package. Scope saat ini cukup kecil
sehingga `app`, `components`, `lib`, dan `prisma` memberikan boundary yang jelas
tanpa indirection yang tidak perlu.

## 3. Rendering model

- `app/page.tsx` adalah dynamic Server Component karena membaca project terurut
  dari Prisma.
- `components/ServiceCatalog.tsx` adalah Client Component karena state
  search/filter harus berubah tanpa server round trip.
- `components/ContactForm.tsx` adalah Client Component karena memiliki form
  state, timeout, validation feedback, dan submission lifecycle.
- Admin mutation menggunakan Server Actions dan revalidate path terkait.
- Root metadata dan JSON-LD didefinisikan di `app/layout.tsx`.

## 4. Data model

### `Project`

Menyimpan portfolio publik:

- `title`, `type`, `result` — display content.
- `imagePath`, `className` — visual presentation.
- `order` — stable public sorting dan indexed query.
- `createdAt`, `updatedAt` — operational timestamps.

### `ContactSubmission`

Menyimpan lead brief:

- `name`, `email`, `message` — validated user input.
- `emailSent` — hasil delivery Resend optional.
- `idempotencyKey` dan `payloadHash` — satu payload per key, konflik `409` untuk isi berbeda.
- `notificationStatus`, `notificationAttempts`, lease, dan next-attempt — klaim atomik dan retry email.
- `createdAt` — submission ordering dan indexed query.

Tidak ada payment atau client-account entity pada scope produk sekarang.

## 5. Request flows

### Contact submission

```text
Browser JSON
 -> stream size check (32 KB)
 -> JSON parse
 -> rate limit
 -> honeypot + signed server token (minimum wait dan expiry)
 -> Zod validation + payload fingerprint
 -> Prisma find/create dengan unique key
 -> atomic email claim dan notifikasi opsional
 -> safe JSON response
```

Database write dipertahankan walaupun optional email delivery gagal agar lead
tidak hilang secara diam-diam.

### Admin authorization

```text
Request /admin
 -> proxy membaca signed cookie
 -> invalid/missing session redirect login
 -> page/action menjalankan authorization guard sendiri
 -> authorized operation mencapai Prisma
```

Proxy adalah routing guard optimistis, bukan satu-satunya security boundary.

## 6. Security controls

- Production membutuhkan `ADMIN_SESSION_SECRET`.
- Production membutuhkan `ADMIN_PASSWORD` berformat bcrypt.
- Session cookie HTTP-only, SameSite Lax, dan secure di production.
- HMAC-SHA256 menandatangani timestamped session token.
- Login dan contact request memakai Upstash Redis jika dikonfigurasi, dengan fallback memori terikat per proses. Header IP hanya dipercaya dari proxy yang dikonfigurasi.
- Contact body size dicek dari actual bytes, bukan hanya `Content-Length`.
- Project image path dibatasi ke katalog aset lokal yang direview.
- Zod memvalidasi public dan admin mutation payload.
- Internal error dilog server-side tetapi tidak dikembalikan ke client.

### Known scale limitation

Saat Redis tidak tersedia, limiter kembali ke memori per instance, sehingga batas global melemah. Cron harian dengan batch maksimal 20 row tidak menjamin notifikasi cepat. Sesi admin masih shared owner tanpa audit per operator atau revocation individual.

## 7. Error and readiness model

- Loading boundaries tersedia global dan admin.
- Error boundaries tersedia global dan admin.
- Contact API mengembalikan `400` untuk malformed/invalid input, `413` untuk
  oversized body, `429` untuk rate limit, dan `500` untuk unexpected failure.
- `/api/health` mengembalikan `200` saat `SELECT 1` berhasil dan `503` saat
  database tidak tersedia.
- `/api/live` hanya memeriksa proses hidup. `/api/cron/notifications` memerlukan Bearer `CRON_SECRET`.

## 8. Deployment topology

```text
Vercel
  ├── Next.js application
  ├── Environment variables
  └── Neon PostgreSQL
       └── Prisma migrations via deploy step
```

Resend adalah external notification dependency. Static asset dilayani aplikasi
Next.js dan dioptimalkan melalui `next/image`.

## 9. Environment contract

| Variable | Scope | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Server | PostgreSQL connection |
| `RESEND_API_KEY` | Server | Optional email notification |
| `CONTACT_EMAIL_TO` | Server | Notification destination |
| `RESEND_FROM_EMAIL` | Server | Sender identity |
| `ADMIN_PASSWORD` | Server | Bcrypt admin credential |
| `ADMIN_SESSION_SECRET` | Server | Session signing secret |
| `CRON_SECRET` | Server | Scheduled notification authorization |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Server | Distributed limiter |
| `TRUSTED_PROXY_IP_HEADER` | Server | Trusted reverse proxy IP header if applicable |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public | WhatsApp CTA destination |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public | Footer contact |
| `NEXT_PUBLIC_SITE_URL` | Public/build | Canonical URL and metadata |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Public | Optional social link |

Jangan expose server-only secrets melalui `NEXT_PUBLIC_*`.

## 10. Verification gates

```bash
npm test
npm run typecheck
npm run lint
npm run build
node ./node_modules/prisma/build/index.js validate
node ./node_modules/prisma/build/index.js migrate status
git diff --check
```

Sebelum deployment, smoke-test `/`, `/api/health`, redirect `/admin`, contact
validation, dan responsive widths dari 320px sampai 1440px.

## 11. Evolution guidelines

1. Ekstrak definisi layanan ke modul data bila masuk CMS.
2. Pindahkan admin ke identitas per orang bila multi-operator disetujui.
3. Ukur backlog notifikasi dan kapasitas cron; tingkatkan frekuensi/worker bila dibutuhkan.
4. Terapkan cache portofolio hanya setelah pengukuran dan pengujian invalidasi mutation.
5. Ikuti gerbang staging dan backup/restore pada `OPERATIONS.md`.
