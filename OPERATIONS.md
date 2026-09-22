# Nexa Studio: operasi dan release

Dokumen ini adalah prosedur, bukan bukti bahwa staging atau production sudah diverifikasi. Gunakan database, akun Resend, Redis, dan secret yang berbeda untuk local, staging, dan production. Jangan arahkan perintah migrasi atau seed ke URL database yang belum diidentifikasi.

## Gerbang promosi

1. Catat SHA kandidat, status worktree, dan hasil CI untuk SHA yang sama. CI menjalankan install bersih, migrasi pada PostgreSQL sementara, lint, typecheck, Vitest, build, dan browser E2E.
2. Ambil backup database staging. Jalankan `npm run db:migrate` di job deploy yang hanya memakai `DATABASE_URL` staging. Build tidak menjalankan migrasi.
3. Pada staging, cek `/`, `/privacy`, `/api/live` (liveness), `/api/health` (readiness), redirect `/admin`, login, project create/edit/delete, submit kontak, status inbox, dan cron notifikasi. Gunakan alamat email staging yang dikontrol tim. Uji Upstash/Resend sungguhan dan catat status delivery tanpa mencatat isi pesan.
4. Uji tampilan 320, 375, 768, dan 1440 px; navigasi keyboard, screen reader, `prefers-reduced-motion`, serta audit aksesibilitas dan performa. Simpan hasil ukur dengan perangkat, lokasi, dan SHA.
5. Promosikan SHA yang sama setelah staging lulus. Ambil backup production sebelum migrasi. Jalankan `npm run db:migrate` terhadap database production dalam langkah deploy terpisah; verifikasi status migrasi. Lakukan smoke test baca dan tulis dengan data uji yang dihapus sesuai kebijakan.

Belum ada bukti CI pada commit baru, staging, Redis/Resend live, backup/restore, atau production untuk perubahan di workspace ini. Jangan menyebut release siap sebelum masing-masing gerbang punya hasil.

## Ketersediaan dan notifikasi

- `/api/live` memastikan proses merespons tanpa memanggil database. `/api/health` memastikan query database berhasil. Keduanya `no-store`.
- Kontak dianggap diterima setelah row database tersimpan. Email adalah notifikasi tambahan. Status `pending`, `sending`, `retryable_failed`, `failed`, `sent`, atau `review` dapat diperiksa di database; CMS menampilkan ringkasannya.
- Cron Vercel `GET /api/cron/notifications` memakai `CRON_SECRET` Bearer. Konfigurasi saat ini sekali per hari. Cron mengambil maksimal 20 row tertua setiap eksekusi. Ini **bukan SLA email segera**. Bila trafik melebihi kapasitas itu atau latensi notifikasi perlu lebih rendah, tingkatkan frekuensi/worker berdasarkan paket hosting dan ukur backlog.
- Lease mencegah worker serentak mengklaim row yang sama. Kunci idempotensi Resend dipakai per submission. Karena masa simpan kunci provider terbatas, `sending` ambigu yang sudah melewati jendela aman perlu peninjauan manual; jangan mengirim ulang secara buta.
- Kegagalan Redis menurunkan limiter ke memori per instance, lalu mencatat `rate_limit_memory_fallback`. Tinjau insiden dan pulihkan Redis; batas ini tidak konsisten antar instance.
- Log operasional `contact_request_duration`, `contact_request_failed`, `readiness_failed`, dan `contact_notification_batch` tidak memuat nama, email, pesan, atau token. Pantau rasio 5xx, durasi, readiness, serta antrean notifikasi. Hubungkan alert ke sistem observability deployment yang dipilih.

## Backup, restore, dan rollback

1. Tentukan snapshot/backup provider database dan catat timestamp serta identitas target sebelum migrasi atau purge. Backup harus mencakup `Project`, `ContactSubmission`, dan tabel migrasi Prisma.
2. Lakukan restore drill **ke database staging yang terpisah**: restore snapshot, jalankan `prisma migrate status`, bandingkan jumlah row per tabel, baca sampel data dengan akses terbatas, lalu jalankan smoke test. Catat durasi dan kegagalan. Jangan menguji restore dengan menimpa production.
3. Jika release aplikasi gagal, rollback kode ke SHA sebelumnya. Migrasi `20260921190000_notification_integrity` bersifat additive dan dapat dibiarkan pada rollback aplikasi. Jangan drop kolom/data pada rollback. Jika skema baru sendiri bermasalah, restore dari backup ke database baru lalu alihkan koneksi setelah verifikasi.
4. Saat kontak 5xx atau readiness 503: cek koneksi dan status migrasi database, lalu cek rate limiter/Resend. Simpan submission yang sudah masuk; jangan melakukan seed ulang atau menghapus row untuk “memperbaiki” antrean.

## Retensi pesan

Belum ada jangka retensi produk yang disetujui; saat ini tidak ada penghapusan otomatis. Setelah owner menetapkan jumlah hari dan informasi privasi diperbarui, lakukan backup lalu jalankan skrip dengan environment yang menunjuk database yang telah diverifikasi:

```bash
CONTACT_RETENTION_DAYS=90 node scripts/contact-retention.mjs
CONTACT_RETENTION_DAYS=90 node scripts/contact-retention.mjs --apply --confirm-database=nama_database
```

Perintah pertama hanya menghitung row. Perintah kedua menghapus row lebih tua dari batas tanggal. Catat count, target database, waktu, dan hasil backup sebelum menjalankannya. Untuk volume besar, ubah ke batch terukur dan uji waktu/lock di staging.

## Keputusan yang masih diperlukan

- Bukti dan izin untuk logo klien, angka performa, hasil portofolio, harga paket, dan aset sebelum promosi production.
- Apakah satu owner cukup. Jika multi-operator, migrasi ke akun per orang, sesi yang bisa dicabut, peran, dan audit perubahan.
- Kebijakan retensi, alamat kontak untuk permintaan penghapusan, dan SLA notifikasi/respons lead.
- Paket hosting dan frekuensi worker yang cukup untuk volume notifikasi aktual.
