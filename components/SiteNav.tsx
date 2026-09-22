"use client";

import { useState } from "react";

const links = [
  { href: "#services", label: "Layanan" },
  { href: "#work", label: "Portfolio" },
  { href: "#process", label: "Proses" },
  { href: "#pricing", label: "Paket" },
  { href: "#contact", label: "Kontak" },
];

export default function SiteNav({ whatsappUrl }: { whatsappUrl: string | null }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="site-nav" aria-label="Navigasi utama">
      <a className="brand" href="#top" aria-label="Nexa Studio, kembali ke atas" onClick={() => setOpen(false)}>
        <span className="brand-mark">N</span><span>Nexa<span className="brand-dot">.</span></span>
      </a>
      <div className="nav-links">
        {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
      </div>
      <a className="nav-cta" href={whatsappUrl || "#contact"} target={whatsappUrl ? "_blank" : undefined} rel={whatsappUrl ? "noreferrer" : undefined}>
        Ngobrol yuk <span aria-hidden="true">↗</span>
      </a>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Tutup menu" : "Menu"}
      </button>
      <div id="mobile-navigation" className="mobile-nav-panel" hidden={!open}>
        {links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
      </div>
    </nav>
  );
}
