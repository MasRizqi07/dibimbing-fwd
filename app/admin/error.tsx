"use client";

import { useLanguage } from "@/lib/i18n/context";

export default function AdminError({ reset }: { reset: () => void }) {
  const { lang } = useLanguage();
  const tr = (id: string, en: string) => lang === "EN" ? en : id;
  return (
    <div className="section-shell page-error-state" role="alert">
      <p className="eyebrow">{tr("Kesalahan dashboard", "Dashboard error")}</p>
      <h1>{tr("Dashboard belum bisa dimuat.", "The dashboard could not be loaded.")}</h1>
      <p>{tr("Periksa koneksi database atau coba muat ulang halaman.", "Check the database connection or try loading the page again.")}</p>
      <button type="button" className="button button-primary" onClick={reset}>
        {tr("Coba lagi", "Try Again")}
      </button>
    </div>
  );
}
