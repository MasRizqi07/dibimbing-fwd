import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Pemrosesan Data Kontak" };

export default function PrivacyPage() {
  return (
    <main className="section-shell privacy-page">
      <Link href="/">← Kembali ke beranda</Link>
      <h1>Pemrosesan data kontak</h1>
      <p>Nexa Studio pada situs ini adalah studi konsep. Jika Anda mengirim formulir, nama, alamat email, dan isi pesan disimpan dalam database untuk memperlihatkan alur kontak dan dapat dilihat oleh pemilik akses admin.</p>
      <p>Jika layanan email dikonfigurasi, isi pesan juga dikirim ke alamat notifikasi yang dikonfigurasi. Pengiriman email dapat gagal meskipun pesan sudah tersimpan. Situs ini tidak memakai data formulir untuk membuat akun atau transaksi.</p>
      <p>Belum ada penghapusan otomatis karena jangka retensi belum ditetapkan. Pemilik situs perlu menetapkan dan menjalankan kebijakan retensi sebelum menerima data publik secara operasional. Jangan memasukkan data sensitif ke formulir demo.</p>
      <p>Untuk pertanyaan mengenai pesan Anda, gunakan alamat kontak yang ditampilkan di beranda jika tersedia.</p>
    </main>
  );
}
