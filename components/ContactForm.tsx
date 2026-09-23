"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";

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
  const { lang, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });
  const [antiSpamToken, setAntiSpamToken] = useState<string>("");
  const idempotencyKey = useRef<string | null>(null);
  const idempotencyPayload = useRef<string | null>(null);
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
    const payload = JSON.stringify(formData);
    if (!idempotencyKey.current || idempotencyPayload.current !== payload) {
      idempotencyKey.current = crypto.randomUUID();
      idempotencyPayload.current = payload;
    }
    setStatus("loading");
    setErrorMessage("");
    setFieldErrors({});

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const token = antiSpamToken || await fetchAntiSpamToken();
      if (!token) {
        setStatus("error");
        setErrorMessage(lang === "ID" ? "Validasi formulir belum siap. Periksa koneksi lalu coba lagi." : "The form is not ready. Check your connection and try again.");
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
        setErrorMessage(lang === "ID" && typeof data.error === "string" ? data.error : lang === "ID" ? "Gagal mengirim pesan. Silakan coba lagi." : "Unable to send your message. Please try again.");
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
      idempotencyPayload.current = null;
      void fetchAntiSpamToken().then(setAntiSpamToken);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof DOMException && error.name === "AbortError"
          ? (lang === "ID" ? "Permintaan terlalu lama. Silakan coba lagi." : "The request timed out. Please try again.")
          : (lang === "ID" ? "Terjadi masalah jaringan. Silakan periksa koneksi Anda." : "Network error. Please check your connection.")
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
    idempotencyPayload.current = null;
  };

  if (status === "success") {
    return (
      <div className="contact-form-success" role="status">
        <div className="success-icon" aria-hidden="true">✓</div>
        <h3>{lang === "ID" ? "Pesan Tersimpan!" : "Message received!"}</h3>
        <p>
          {lang === "ID" ? "Terima kasih sudah menghubungi Nexa Studio. Pesan kamu telah kami terima dan akan ditinjau oleh tim." : "Thank you for contacting Nexa Studio. Our team has received your message and will review it."}
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="button button-lime"
          style={{ cursor: "pointer", border: "none", marginTop: "16px" }}
        >
          {lang === "ID" ? "Kirim Pesan Lain" : "Send another message"}
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
        <label htmlFor="name">{t.contact.nameLabel}</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={100}
          placeholder={t.contact.namePlaceholder}
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
        <label htmlFor="email">{t.contact.emailLabel}</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={255}
          placeholder={t.contact.emailPlaceholder}
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
        <label htmlFor="message">{t.contact.messageLabel}</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          minLength={10}
          maxLength={2000}
          placeholder={t.contact.messagePlaceholder}
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
        {status === "loading" ? t.contact.sendingBtn : `${t.contact.submitBtn} ↗`}
      </button>

      <p className="form-disclosure">{lang === "ID" ? "Nama, email, dan pesan kamu disimpan agar tim kami dapat menindaklanjuti pertanyaanmu. Jangan kirim informasi sensitif." : "We store your name, email, and message to respond to your inquiry. Do not send sensitive information."} <Link href="/privacy">{lang === "ID" ? "Cara data diproses" : "How we process data"}</Link>.</p>

      {whatsappUrl && <div className="whatsapp-fallback">
        <span>{lang === "ID" ? "Atau lebih suka chat langsung? " : "Prefer to chat directly? "}</span>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="wa-link"
        >
          {lang === "ID" ? "Hubungi via WhatsApp" : "Contact us on WhatsApp"} ↗
        </a>
      </div>}
    </form>
  );
}
