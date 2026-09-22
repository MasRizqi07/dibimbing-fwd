"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const links = [
  { href: "#services", label: "Layanan" },
  { href: "#work", label: "Portfolio" },
  { href: "#process", label: "Proses" },
  { href: "#pricing", label: "Paket" },
  { href: "#contact", label: "Kontak" },
];

export default function SiteNav({ whatsappUrl }: { whatsappUrl: string | null }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"ID" | "EN">("ID");
  const navPanelRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  // Close on Escape & trap focus
  useEffect(() => {
    if (!open) return;

    // Body scroll lock on mobile
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleBtnRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && navPanelRef.current) {
        const focusable = navPanelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <nav className="site-nav" aria-label="Navigasi utama">
      <Link
        className="brand"
        href="/#top"
        aria-label="Nexa Studio, kembali ke atas"
        onClick={() => setOpen(false)}
      >
        <span className="brand-mark">N</span>
        <span>
          Nexa<span className="brand-dot">.</span>
        </span>
      </Link>

      <div className="nav-links">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          role="group"
          aria-label="Pilihan bahasa"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px",
            background: "rgba(0,0,0,0.04)",
            borderRadius: "99px",
            fontSize: "10px",
            fontWeight: 700,
          }}
        >
          <button
            type="button"
            onClick={() => setLang("ID")}
            aria-pressed={lang === "ID"}
            style={{
              padding: "3px 8px",
              borderRadius: "99px",
              border: "none",
              background: lang === "ID" ? "var(--surface-navy)" : "transparent",
              color: lang === "ID" ? "#ffffff" : "#2c3e43",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "10px",
            }}
          >
            ID
          </button>
          <button
            type="button"
            onClick={() => setLang("EN")}
            aria-pressed={lang === "EN"}
            style={{
              padding: "3px 8px",
              borderRadius: "99px",
              border: "none",
              background: lang === "EN" ? "var(--surface-navy)" : "transparent",
              color: lang === "EN" ? "#ffffff" : "#2c3e43",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "10px",
            }}
          >
            EN
          </button>
        </div>

        <Link className="nav-cta" href="/start">
          Mulai Proyek <span aria-hidden="true">↗</span>
        </Link>

        <button
          ref={toggleBtnRef}
          className="mobile-menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? "Tutup menu" : "Menu"}
        </button>
      </div>

      <div
        ref={navPanelRef}
        id="mobile-navigation"
        className="mobile-nav-panel"
        hidden={!open}
      >
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <Link
          href="/start"
          onClick={() => setOpen(false)}
          style={{
            marginTop: "6px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: "var(--surface-navy)",
            color: "#ffffff",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Mulai Proyek ↗
        </Link>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            style={{
              marginTop: "4px",
              padding: "10px 12px",
              borderRadius: "8px",
              background: "var(--canvas-cream)",
              color: "var(--surface-navy)",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            WhatsApp Konsultasi ↗
          </a>
        )}
      </div>
    </nav>
  );
}
