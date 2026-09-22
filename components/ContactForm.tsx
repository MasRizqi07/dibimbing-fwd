"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

async function fetchAntiSpamToken(): Promise<string> {
  try {
    const res = await fetch("/api/anti-spam");
    const data = await res.json();
    return typeof data.token === "string" ? data.token : "";
  } catch {
    return "";
  }
}

export default function ContactForm({ whatsappUrl }: { whatsappUrl: string | null }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });
  const [antiSpamToken, setAntiSpamToken] = useState<string>("");
  const idempotencyKey = useRef<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    let active = true;
    void fetchAntiSpamToken().then((token) => {
      if (active) setAntiSpamToken(token);
    });
    return () => { active = false; };
  }, []);

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
    idempotencyKey.current ??= crypto.randomUUID();
    setStatus("loading");
    setErrorMessage("");
    setFieldErrors({});

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const token = antiSpamToken || await fetchAntiSpamToken();
      if (!token) {
        setStatus("error");
        setErrorMessage("Validasi formulir belum siap. Periksa koneksi lalu coba lagi.");
        return;
      }
      setAntiSpamToken(token);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          ...formData,
          antiSpamToken: token,
          idempotencyKey: idempotencyKey.current,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Gagal mengirim pesan. Silakan coba lagi.");
        if (data.details) {
          setFieldErrors(data.details);
        }
        // If token was rejected or expired, immediately request a fresh token
        if (data.error && /kedaluwarsa|anti-spam/i.test(data.error)) {
          void fetchAntiSpamToken().then(setAntiSpamToken);
        }
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "", honeypot: "" });
      idempotencyKey.current = null;
      void fetchAntiSpamToken().then(setAntiSpamToken);
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
    setFormData({ name: "", email: "", message: "", honeypot: "" });
    void fetchAntiSpamToken().then(setAntiSpamToken);
    idempotencyKey.current = null;
  };

  if (status === "success") {
    return (
      <div className="contact-form-success" role="status">
        <div className="success-icon" aria-hidden="true">✓</div>
        <h3>Pesan Tersimpan!</h3>
        <p>
          Pesan kamu telah tersimpan. Nexa Studio adalah studi konsep; respons pribadi tidak dijanjikan.
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
    <form onSubmit={handleSubmit} className="contact-form">
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
          minLength={2}
          maxLength={100}
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
          maxLength={255}
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
          minLength={10}
          maxLength={2000}
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

      <p className="form-disclosure">Ini formulir studi konsep. Nama, email, dan pesan disimpan untuk demonstrasi alur kontak. Jangan kirim informasi sensitif. <Link href="/privacy">Cara data diproses</Link>.</p>

      {whatsappUrl && <div className="whatsapp-fallback">
        <span>Atau lebih suka chat langsung? </span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="wa-link"
        >
          Hubungi via WhatsApp ↗
        </a>
      </div>}
    </form>
  );
}
