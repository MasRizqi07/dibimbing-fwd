# Bukti implementasi plan Nexa Studio

**Diperbarui:** 2026-09-22. **Baseline:** `5dfde3bfa03af173d16671a507176e969ff82d37`, branch `fix/build-and-bot-audit`. Perubahan `session_analysis_report.md` telah ada sebelum implementasi ini dan tidak diubah sebagai bagian fase baru.

| Temuan | Perubahan | Bukti lokal / batas |
| --- | --- | --- |
| F01 | Token form diambil async tanpa synchronous setState dalam effect; key per payload tersimpan sepanjang retry. | Lint hijau; browser submit sukses. |
| F02 | Build dipisah dari `db:migrate`. | Build berjalan tanpa migrasi; migrasi diuji pada PostgreSQL lokal terisolasi. |
| F03 | Limit IP dan portal login benar-benar diperiksa; password valid tetap dapat diverifikasi saat batas portal penuh. | Unit limiter, browser login gagal/sukses. Masih ada trade-off beban bcrypt dan shared owner credential. |
| F04 | `renderTime` klien dihapus; token HMAC server wajib. | Unit menolak fallback timestamp, browser token dan submit. |
| F05 | Fingerprint payload ditautkan ke UUID key; konflik mengembalikan `409`. | 25 request paralel ke database uji menghasilkan satu row; payload berbeda `409`. |
| F06 | State notifikasi, claim/lease atomik, retry cron, kunci idempotensi provider. | Unit lease/success/failure; migrasi lokal. Resend dan cron live belum diuji; scheduler harian tidak menjamin delivery cepat. |
| F07 | Status dan ID Server Action divalidasi runtime. | Unit forged status dan unauthorized. |
| F08 | IP hanya dari header proxy tepercaya; fallback limiter O(1) pada request normal. | Unit spoof header dan batas. Upstash nyata belum diuji. |
| F09 | Owner tunggal dipertahankan sesuai default D2; batas sesi dan rencana migrasi per operator dicatat. | Browser login; identitas multi-operator menunggu keputusan produk. |
| F10 | Gambar proyek dipilih dari aset lokal whitelist dengan pratinjau; path divalidasi server. | Browser create+gambar, edit, delete, reload. Upload baru bergantung keputusan D4. |
| F11 | CI dengan PostgreSQL sementara dan E2E browser bermakna. | Lokal Vitest dan Playwright lulus; CI pada commit belum ada. |
| F12 | Menu mobile nyata dan CTA berarah ke section yang ada. | Browser 320/375/768/1440px, keyboard menu, search. |
| F13 | Metrik/logo/harga/hasil yang tidak terbukti diganti label studi konsep; privacy notice dan OG/Twitter image konsep ditambah. | Review source, render image, dan browser. Keputusan identitas/izin aset tetap perlu pemilik. |
| F14 | Sitemap tidak lagi memakai `new Date()` fiktif; homepage tetap dynamic. | Ukur lokal dan ulangi dengan traffic/staging sebelum cache. Tidak ada bukti kebutuhan cache atau invalidasi production. |
| F15 | CMS 720 baris dipecah ke form/list/inbox; CSS admin dikonsolidasikan; navigasi publik terpisah. | Lint/typecheck/browser desktop+mobile. |
| F16 | README, PRD, Design, Design System, Architecture, env example, dan runbook diselaraskan. | Review dokumen dan gate lokal; konfigurasi deployment belum diisi. |

## Pengujian dan release

Pada snapshot lokal ini: migrasi `20260921190000_notification_integrity` diterapkan ke database `dibimbing_fwd_codex_20260921` di PostgreSQL lokal; `prisma migrate status` menyatakan schema mutakhir. Seed tiga konsep berhasil. Instalasi bersih `npm ci` exit 0. `npm run verify` exit 0: audit dependency 0 vulnerability, lint/typecheck lulus, 39 test unit lulus, dan build lulus tanpa menjalankan migrasi. `npm run test:e2e` exit 0: 13 test browser lulus, termasuk audit axe, 25 request kontak paralel, dan state CMS setelah reload. Audit dependency sempat menemukan advisory pada loader konfigurasi Prisma; override `deepmerge-ts` 8.0.1+ diterapkan. Dry run retensi 90 hari menemukan 0 row yang cocok; tidak ada penghapusan dijalankan.

Drill backup/restore **lokal** berhasil: `pg_dump -Fc` dari database uji, `pg_restore --exit-on-error` ke database restore terpisah, jumlah row sumber dan hasil sama (`Project=3`, `ContactSubmission=12`, `_prisma_migrations=4`), dan `prisma migrate status` pada restore menyatakan schema mutakhir. Database restore sementara dihapus setelah verifikasi; database uji utama tetap tersedia. Drill staging dengan backup provider nyata masih belum dilakukan.

Pengukuran lokal `GET /` dengan Node fetch pada satu mesin dan database lokal: perkiraan waktu sampai header 179,9 ms pada request pertama, lalu 39,8 / 18,3 / 27,6 / 12,5 ms. Ini bukan Core Web Vitals maupun angka staging. Cache portofolio belum ditambahkan karena belum ada bukti bottleneck; invalidasi dan ukuran trafik harus diuji di staging sebelum memilih cache.

E2E tidak mengirim email keluar dan tidak menguji Redis/Resend sungguhan. Audit axe menutup aturan WCAG otomatis pada beranda, privacy, login, dan dashboard; review screen reader manual serta performa lapangan tetap diperlukan. CI exact commit, staging, backup/restore drill, provider nyata, dan production belum dinilai. Ikuti [OPERATIONS.md](./OPERATIONS.md) untuk promosi dan incident response.
