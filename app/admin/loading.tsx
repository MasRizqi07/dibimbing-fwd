"use client";

import { useLanguage } from "@/lib/i18n/context";

export default function AdminLoading() {
  const { lang } = useLanguage();
  return (
    <div className="section-shell page-loading-state" aria-busy="true" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <p>{lang === "EN" ? "Loading the admin dashboard..." : "Memuat dashboard admin..."}</p>
    </div>
  );
}
