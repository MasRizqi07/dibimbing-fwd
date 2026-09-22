"use client";

import { useMemo, useState, useTransition } from "react";

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  deliverables?: string[];
}

interface ServiceCatalogProps {
  services: ServiceItem[];
  whatsappUrl: string;
}

function ArrowIcon() {
  return <span aria-hidden="true" className="arrow-icon">↗</span>;
}

export default function ServiceCatalog({ services, whatsappUrl }: ServiceCatalogProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [, startTransition] = useTransition();

  const categories = useMemo(
    () => ["Semua", ...new Set(services.map((service) => service.category))],
    [services],
  );

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return services.filter((service) => {
      const matchesCategory = category === "Semua" || service.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${service.title} ${service.description} ${service.category} ${service.deliverables?.join(" ") || ""}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query, services]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    startTransition(() => {
      setQuery(val);
    });
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <>
      <div className="service-explorer" role="search" aria-label="Cari layanan Nexa Studio">
        <div className="service-search-field">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <label className="sr-only" htmlFor="service-search">Cari layanan</label>
          <input
            id="service-search"
            type="search"
            value={query}
            onChange={handleSearchChange}
            placeholder="Cari website, branding, atau konten..."
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={handleClear}
              aria-label="Hapus pencarian"
            >
              ×
            </button>
          )}
        </div>
        <div className="service-filters" aria-label="Filter kategori layanan">
          {categories.map((item) => (
            <button
              type="button"
              className={category === item ? "active" : ""}
              key={item}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="service-result-count" aria-live="polite">
        {filteredServices.length} layanan tersedia
      </p>

      {filteredServices.length > 0 ? (
        <div className="service-grid">
          {filteredServices.map((service) => (
            <article className="service-card" key={service.number}>
              <div className="service-number">
                {service.number}
                <span className="service-icon">{service.icon}</span>
              </div>
              <span className="service-category">{service.category}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              {service.deliverables && service.deliverables.length > 0 && (
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {service.deliverables.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        color: "var(--ink-primary)",
                      }}
                    >
                      <span style={{ color: "#668300", fontSize: "14px" }}>✓</span> {item}
                    </div>
                  ))}
                </div>
              )}
              <a
                href={whatsappUrl}
                target={whatsappUrl.startsWith("https://") ? "_blank" : undefined}
                rel={whatsappUrl.startsWith("https://") ? "noreferrer" : undefined}
                style={{ marginTop: "16px", display: "inline-block" }}
              >
                Diskusikan kebutuhan <ArrowIcon />
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="service-empty-state" role="status">
          <strong>Belum menemukan layanan yang cocok.</strong>
          <span>Coba kata kunci lain atau pilih kategori Semua.</span>
          <button type="button" onClick={() => { setQuery(""); setCategory("Semua"); }}>
            Reset pencarian
          </button>
        </div>
      )}
    </>
  );
}
