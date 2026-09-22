import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Pemrosesan Data Kontak" };

export default function PrivacyPage() {
  return (
    <main className="section-shell privacy-page">
      <Link href="/">← Kembali ke beranda</Link>
      <h1>Pemrosesan data kontak</h1>
      <p>Saat Anda mengirim formulir kontak, nama, alamat email, dan isi pesan disimpan dalam database agar Nexa Studio dapat menindaklanjuti pertanyaan Anda. Data tersebut dapat dilihat oleh pemilik akses admin.</p>
      <p>Jika layanan email dikonfigurasi, isi pesan juga dikirim ke alamat notifikasi yang dikonfigurasi. Pengiriman email dapat gagal meskipun pesan sudah tersimpan. Situs ini tidak memakai data formulir untuk membuat akun atau transaksi.</p>
      <p>Jangka penyimpanan belum ditetapkan dan penghapusan otomatis belum aktif. Anda dapat menghubungi Nexa Studio melalui kontak di beranda untuk menanyakan atau meminta penghapusan pesan Anda. Jangan memasukkan data sensitif ke formulir.</p>
      <p>Untuk pertanyaan mengenai pesan Anda, gunakan alamat kontak yang ditampilkan di beranda jika tersedia.</p>
    </main>
  );
}
