"use client";

import { useLanguage } from "@/lib/i18n/context";

export default function LanguageToggle({ inverse = false }: { inverse?: boolean }) {
  const { lang, setLang } = useLanguage();
  return (
    <div role="group" aria-label={lang === "EN" ? "Language selector" : "Pilihan bahasa"} style={{ display: "inline-flex", gap: 4 }}>
      {(["ID", "EN"] as const).map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => setLang(locale)}
          aria-pressed={lang === locale}
          style={{
            minWidth: 44,
            minHeight: 44,
            borderRadius: 99,
            border: inverse ? "1px solid rgba(255,255,255,.25)" : "1px solid var(--border-line)",
            background: lang === locale ? "var(--accent-lime)" : "transparent",
            color: lang === locale ? "var(--surface-navy)" : inverse ? "#fff" : "var(--surface-navy)",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
