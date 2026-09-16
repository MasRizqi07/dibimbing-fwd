"use client";

import { useState, useEffect } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });
  const [renderTime, setRenderTime] = useState<number>(() => Date.now());
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setFieldErrors({});

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          ...formData,
          renderTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Gagal mengirim pesan. Silakan coba lagi.");
        if (data.details) {
          setFieldErrors(data.details);
        }
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "", honeypot: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof DOMException && error.name === "AbortError"
          ? "Permintaan terlalu lama. Silakan coba lagi."
          : "Terjadi masalah jaringan. Silakan periksa koneksi Anda."
      );
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setErrorMessage("");
    setFieldErrors({});
    setRenderTime(Date.now());
  };

  if (status === "success") {
    return (
      <div className="contact-form-success" role="status">
        <div className="success-icon" aria-hidden="true">✓</div>
        <h3>Pesan Terkirim!</h3>
        <p>
          Terima kasih sudah menghubungi kami. Tim Nexa Studio akan meninjau pesan kamu
          dan merespon secepatnya.
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="button button-lime"
          style={{ cursor: "pointer", border: "none", marginTop: "16px" }}
        >
          Kirim Pesan Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form" noValidate>
      {/* Anti-spam honeypot */}
      <div style={{ display: "none" }} aria-hidden="true">
        <label htmlFor="website">Leave this field blank</label>
        <input
          id="website"
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">Nama Lengkap</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Nama Anda atau Brand"
          value={formData.name}
          onChange={handleChange}
          disabled={status === "loading"}
          className={fieldErrors.name ? "has-error" : ""}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
        />
        {fieldErrors.name && (
          <span id="name-error" className="error-text">
            {fieldErrors.name[0]}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Alamat Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="email@bisnis.com"
          value={formData.email}
          onChange={handleChange}
          disabled={status === "loading"}
          className={fieldErrors.email ? "has-error" : ""}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
        />
        {fieldErrors.email && (
          <span id="email-error" className="error-text">
            {fieldErrors.email[0]}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="message">Ceritakan Kebutuhan Proyek</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Ceritakan tentang bisnis kamu, tantangan yang dihadapi, atau hasil yang ingin dicapai..."
          value={formData.message}
          onChange={handleChange}
          disabled={status === "loading"}
          className={fieldErrors.message ? "has-error" : ""}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
        />
        {fieldErrors.message && (
          <span id="message-error" className="error-text">
            {fieldErrors.message[0]}
          </span>
        )}
      </div>

      {status === "error" && errorMessage && (
        <div className="form-alert-error" role="alert">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="button button-lime contact-submit-btn"
        style={{ cursor: status === "loading" ? "not-allowed" : "pointer", border: "none" }}
      >
        {status === "loading" ? "Mengirim pesan..." : "Kirim Pesan Sekarang ↗"}
      </button>

      <div className="whatsapp-fallback">
        <span>Atau lebih suka chat langsung? </span>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285745717075"}`}
          target="_blank"
          rel="noreferrer"
          className="wa-link"
        >
          Hubungi via WhatsApp ↗
        </a>
      </div>
    </form>
  );
}
