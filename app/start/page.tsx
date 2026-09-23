"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { useLanguage } from "@/lib/i18n/context";

interface StepData {
  scopes: string[];
  budget: string;
  timeline: string;
  companyName: string;
  companyUrl: string;
  brief: string;
  fullName: string;
  businessEmail: string;
  whatsappNumber: string;
  meetingTimezone: string;
  requireMnda: boolean;
  honeypot: string;
}

const AVAILABLE_SCOPES = [
  {
    id: "web-development",
    label: "Web Development",
    desc: "Website cepat, responsif, dan mudah dikelola.",
  },
  {
    id: "branding",
    label: "Brand Identity",
    desc: "Identitas visual, logo, dan panduan merek.",
  },
  {
    id: "content",
    label: "Content Engine",
    desc: "Strategi konten, copywriting, dan posisi SEO.",
  },
  {
    id: "ui-ux-audit",
    label: "UI/UX Audit",
    desc: "Tinjauan pengalaman pengguna dan peluang perbaikan.",
  },
];

const BUDGET_TIERS = [
  {
    id: "tier-a",
    tier: "Starter",
    bracket: "Rp 3,5 jt – 7,5 jt",
    desc: "Untuk kehadiran online profesional dan kebutuhan awal.",
  },
  {
    id: "tier-b",
    tier: "Growth",
    bracket: "Rp 7,5 jt – 15 jt",
    desc: "Untuk website dan identitas merek yang lebih lengkap.",
    recommended: true,
  },
  {
    id: "tier-c",
    tier: "Custom",
    bracket: "> Rp 15 jt",
    desc: "Untuk kebutuhan khusus dan integrasi yang lebih kompleks.",
  },
];

const TIMELINE_OPTIONS = [
  { id: "urgent", label: "Segera (< 3 minggu)" },
  { id: "ideal", label: "4 – 8 Minggu (Ideal)" },
  { id: "flexible", label: "Fleksibel" },
];

async function fetchAntiSpamToken(): Promise<string> {
  try {
    const res = await fetch("/api/anti-spam");
    const data = await res.json();
    return typeof data.token === "string" ? data.token : "";
  } catch {
    return "";
  }
}

export default function StartProjectPage() {
  const { lang } = useLanguage();
  const tr = (id: string, en: string) => lang === "ID" ? id : en;
  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<StepData>({
    scopes: ["Web Development"],
    budget: "Rp 7,5 jt – 15 jt",
    timeline: "4 – 8 Minggu (Ideal)",
    companyName: "",
    companyUrl: "",
    brief: "",
    fullName: "",
    businessEmail: "",
    whatsappNumber: "",
    meetingTimezone: "WIB (Jakarta) — Pagi 09:00 - 12:00",
    requireMnda: true,
    honeypot: "",
  });

  const [antiSpamToken, setAntiSpamToken] = useState<string>("");
  const idempotencyKey = useRef<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    void fetchAntiSpamToken().then((token) => {
      if (active) setAntiSpamToken(token);
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleScope = (scopeLabel: string) => {
    setData((prev) => {
      const exists = prev.scopes.includes(scopeLabel);
      const updated = exists
        ? prev.scopes.filter((s) => s !== scopeLabel)
        : [...prev.scopes, scopeLabel];
      return { ...prev, scopes: updated };
    });
  };

  const validateCurrentStep = (): boolean => {
    setErrorMsg("");
    setFieldErrors({});

    if (step === 1) {
      if (data.scopes.length === 0) {
        setErrorMsg(tr("Silakan pilih minimal 1 cakupan layanan.", "Select at least one service."));
        return false;
      }
    } else if (step === 3) {
      if (!data.companyName.trim()) {
        setFieldErrors({ companyName: [tr("Nama perusahaan atau brand wajib diisi.", "Company or brand name is required.")] });
        return false;
      }
      if (data.brief.trim().length < 10) {
        setFieldErrors({ brief: [tr("Deskripsi kebutuhan minimal 10 karakter.", "Describe your project in at least 10 characters.")] });
        return false;
      }
    } else if (step === 4) {
      const errors: Record<string, string[]> = {};
      if (data.fullName.trim().length < 2) {
        errors.fullName = [tr("Nama minimal 2 karakter.", "Name must have at least 2 characters.")];
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.businessEmail.trim())) {
        errors.businessEmail = [tr("Format email tidak valid.", "Enter a valid email address.")];
      }
      if (data.whatsappNumber.trim().length < 8) {
        errors.whatsappNumber = [tr("Nomor WhatsApp minimal 8 digit.", "WhatsApp number must have at least 8 digits.")];
      }
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (step < 4) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    setErrorMsg("");
    setFieldErrors({});
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    setSubmitting(true);
    setErrorMsg("");

    if (!idempotencyKey.current) {
      idempotencyKey.current = crypto.randomUUID();
    }

    const compiledMessage = [
      `[ONBOARDING BRIEF /start]`,
      `Perusahaan: ${data.companyName} (${data.companyUrl || "Tidak ada URL"})`,
      `Cakupan: ${data.scopes.join(", ")}`,
      `Alokasi Anggaran: ${data.budget}`,
      `Target Waktu: ${data.timeline}`,
      `Zona Waktu / Jadwal: ${data.meetingTimezone}`,
      `MNDA Dibutuhkan: ${data.requireMnda ? "Ya" : "Tidak"}`,
      `No WhatsApp: ${data.whatsappNumber}`,
      `Detail Brief: ${data.brief}`,
    ].join("\n");

    try {
      const token = antiSpamToken || (await fetchAntiSpamToken());
      if (!token) {
        setErrorMsg(tr("Validasi formulir belum siap. Silakan periksa koneksi Anda.", "The form is not ready. Check your connection."));
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.fullName,
          email: data.businessEmail,
          message: compiledMessage,
          honeypot: data.honeypot,
          antiSpamToken: token,
          idempotencyKey: idempotencyKey.current,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        setErrorMsg(lang === "ID" && typeof resData.error === "string" ? resData.error : tr("Gagal mengirim brief. Silakan coba lagi.", "Unable to send the brief. Please try again."));
        if (resData.details) setFieldErrors(resData.details);
        setSubmitting(false);
        return;
      }

      setIsSuccess(true);
      window.scrollTo({ top: 80, behavior: "smooth" });
    } catch {
      setErrorMsg(tr("Terjadi gangguan koneksi jaringan. Coba lagi dalam beberapa saat.", "Network error. Please try again shortly."));
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercent = Math.round((step / 4) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas-cream)", color: "var(--ink-primary)" }}>
      <SiteNav whatsappUrl={null} />

      <main style={{ padding: "40px 0 80px" }}>
        <div className="section-shell">
          {/* Top Session Metadata */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "28px",
            }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-lime)" }} />
              <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-muted)" }}>
                {tr("Brief Interaktif Proyek", "Interactive Project Brief")} • Nexa Studio
              </span>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "99px",
                background: "#ffffff",
                border: "1px solid var(--border-line)",
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--surface-navy)",
              }}
            >
              {tr("Jangan kirim informasi sensitif dalam brief awal", "Do not include sensitive information in the initial brief")}
            </div>
          </div>

          {isSuccess ? (
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--border-line)",
                borderRadius: "20px",
                padding: "64px 32px",
                textAlign: "center",
                maxWidth: "680px",
                margin: "0 auto",
                boxShadow: "0 20px 50px rgba(16,42,49,0.06)",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "var(--accent-lime)",
                  color: "var(--surface-navy)",
                  fontSize: "24px",
                  fontWeight: 900,
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 20px",
                }}
              >
                ✓
              </div>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "99px",
                  background: "var(--surface-navy)",
                  color: "var(--accent-lime)",
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                  marginBottom: "12px",
                }}
              >
                {tr("Brief Diterima", "Brief Received")}
              </span>
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--surface-navy)", margin: "0 0 12px" }}>
                {tr("Terima kasih", "Thank you")}, {data.fullName}!
              </h1>
              <p style={{ color: "var(--ink-muted)", fontSize: "15px", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto 28px" }}>
                {tr("Brief proyek untuk", "We received the project brief for")} <strong>{data.companyName}</strong>. {tr("Tim kami akan meninjau kebutuhan Anda dan menghubungi Anda melalui detail kontak yang diberikan.", "Our team will review your requirements and contact you using the details provided.")}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/" className="button button-primary">
                  {tr("Kembali ke Beranda", "Back to Home")}
                </Link>
                <Link href="/work/nomad-coffee-roasters" className="button button-outline">
                  {tr("Lihat Konsep Visual", "View Visual Concept")} ↗
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px", alignItems: "start" }}>
              {/* Left Column: Form Wizard */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Progress Track Card */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "20px 24px",
                    border: "1px solid var(--border-line)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-muted)" }}>
                      {tr("Langkah", "Step")} {step} {tr("dari", "of")} 4
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--surface-navy)" }}>
                      {progressPercent}% {tr("Lengkap", "Complete")}
                    </span>
                  </div>

                  <div
                    className="wizard-progress-bar"
                    role="progressbar"
                    aria-valuenow={progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div className="wizard-progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginTop: "14px" }}>
                    {(lang === "ID" ? ["Cakupan", "Anggaran", "Spesifikasi", "Kontak"] : ["Scope", "Budget", "Details", "Contact"]).map((label, idx) => {
                      const sNum = idx + 1;
                      const isActive = sNum === step;
                      const isDone = sNum < step;
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => {
                            if (sNum <= step || validateCurrentStep()) setStep(sNum);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: "4px 0",
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                        >
                          <span
                            style={{
                              display: "block",
                              fontSize: "11px",
                              fontWeight: isActive ? 800 : 600,
                              color: isActive ? "var(--surface-navy)" : isDone ? "#668300" : "var(--ink-muted)",
                            }}
                          >
                            {sNum}. {label} {isDone && "✓"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    style={{
                      background: "var(--status-error-bg)",
                      color: "var(--status-error-text)",
                      border: "1px solid var(--status-error-border)",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                {/* Wizard Steps */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    padding: "32px",
                    border: "1px solid var(--border-line)",
                    boxShadow: "0 10px 30px rgba(16,42,49,0.03)",
                  }}
                >
                  {/* STEP 1: SCOPE */}
                  {step === 1 && (
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "#668300" }}>
                        {tr("Langkah 1", "Step 1")}
                      </span>
                      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--surface-navy)", margin: "4px 0 8px" }}>
                        {tr("Pilih Cakupan Layanan", "Choose Your Services")}
                      </h2>
                      <p style={{ color: "var(--ink-muted)", fontSize: "14px", margin: "0 0 24px" }}>
                        {tr("Pilih satu atau beberapa layanan yang ingin Anda diskusikan bersama tim Nexa Studio.", "Choose one or more services you would like to discuss with Nexa Studio.")}
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                        {AVAILABLE_SCOPES.map((item) => {
                          const selected = data.scopes.includes(item.label);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleScope(item.label)}
                              aria-pressed={selected}
                              style={{
                                padding: "18px",
                                borderRadius: "14px",
                                border: selected ? "2px solid var(--surface-navy)" : "1px solid var(--border-line)",
                                background: selected ? "rgba(195, 243, 91, 0.12)" : "var(--canvas-cream)",
                                cursor: "pointer",
                                textAlign: "left",
                                fontFamily: "inherit",
                                transition: "all .2s ease",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                                <strong style={{ fontSize: "14px", color: "var(--surface-navy)" }}>{item.label}</strong>
                                <span
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    background: selected ? "var(--surface-navy)" : "#ffffff",
                                    color: selected ? "var(--accent-lime)" : "transparent",
                                    display: "grid",
                                    placeItems: "center",
                                    fontSize: "12px",
                                    fontWeight: 900,
                                    border: selected ? "none" : "1px solid var(--border-line)",
                                  }}
                                >
                                  ✓
                                </span>
                              </div>
                              <p style={{ margin: 0, fontSize: "12px", color: "var(--ink-muted)", lineHeight: 1.5 }}>
                                {lang === "ID" ? item.desc : ["Fast, responsive websites that are easy to manage.", "Visual identity, logo, and brand guidelines.", "Content strategy, copywriting, and SEO positioning.", "A review of user experience and improvement opportunities."][AVAILABLE_SCOPES.indexOf(item)]}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: BUDGET & TIMELINE */}
                  {step === 2 && (
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "#668300" }}>
                        {tr("Langkah 2", "Step 2")}
                      </span>
                      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--surface-navy)", margin: "4px 0 8px" }}>
                        {tr("Kisaran Anggaran & Target Waktu", "Budget Range and Timeline")}
                      </h2>
                      <p style={{ color: "var(--ink-muted)", fontSize: "14px", margin: "0 0 24px" }}>
                        {tr("Bantu kami memahami kisaran anggaran dan waktu yang Anda rencanakan.", "Tell us your planned budget range and timeline.")}
                      </p>

                      <strong style={{ display: "block", fontSize: "13px", color: "var(--surface-navy)", marginBottom: "12px" }}>
                        {tr("Kisaran Anggaran (IDR)", "Budget Range (IDR)")}
                      </strong>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "28px" }}>
                        {BUDGET_TIERS.map((tier) => {
                          const isSel = data.budget === tier.bracket;
                          return (
                            <button
                              key={tier.id}
                              type="button"
                              onClick={() => setData((p) => ({ ...p, budget: tier.bracket }))}
                              aria-pressed={isSel}
                              style={{
                                padding: "18px",
                                borderRadius: "14px",
                                border: isSel ? "2px solid var(--surface-navy)" : "1px solid var(--border-line)",
                                background: isSel ? "var(--surface-navy)" : "var(--canvas-cream)",
                                color: isSel ? "#ffffff" : "var(--ink-primary)",
                                cursor: "pointer",
                                textAlign: "left",
                                fontFamily: "inherit",
                                transition: "all .2s ease",
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                <span
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    padding: "2px 8px",
                                    borderRadius: "99px",
                                    background: isSel ? "var(--accent-lime)" : "rgba(0,0,0,0.06)",
                                    color: isSel ? "var(--surface-navy)" : "var(--ink-muted)",
                                  }}
                                >
                                  {tier.tier}
                                </span>
                                {isSel && <span style={{ color: "var(--accent-lime)", fontWeight: 900 }}>✓</span>}
                              </div>
                              <strong style={{ display: "block", fontSize: "16px", marginBottom: "6px" }}>{tier.bracket}</strong>
                              <p style={{ margin: 0, fontSize: "11px", lineHeight: 1.5, color: isSel ? "#cfdbd9" : "var(--ink-muted)" }}>
                                {lang === "ID" ? tier.desc : ["For a professional online presence and initial needs.", "For a more complete website and brand identity.", "For custom needs and more complex integrations."][BUDGET_TIERS.indexOf(tier)]}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      <strong style={{ display: "block", fontSize: "13px", color: "var(--surface-navy)", marginBottom: "12px" }}>
                        {tr("Target Peluncuran", "Target Launch")}
                      </strong>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
                        {TIMELINE_OPTIONS.map((opt) => {
                          const isSel = data.timeline === opt.label;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setData((p) => ({ ...p, timeline: opt.label }))}
                              style={{
                                padding: "12px",
                                borderRadius: "10px",
                                border: isSel ? "2px solid var(--surface-navy)" : "1px solid var(--border-line)",
                                background: isSel ? "rgba(195, 243, 91, 0.2)" : "#ffffff",
                                color: "var(--surface-navy)",
                                fontWeight: 700,
                                fontSize: "12px",
                                cursor: "pointer",
                              }}
                            >
                              {lang === "ID" ? opt.label : ["Soon (under 3 weeks)", "4–8 weeks (ideal)", "Flexible"][TIMELINE_OPTIONS.indexOf(opt)]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: CONTEXT & BRIEF */}
                  {step === 3 && (
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "#668300" }}>
                        {tr("Langkah 3", "Step 3")}
                      </span>
                      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--surface-navy)", margin: "4px 0 8px" }}>
                        {tr("Konteks Proyek & Latar Belakang", "Project Context")}
                      </h2>
                      <p style={{ color: "var(--ink-muted)", fontSize: "14px", margin: "0 0 24px" }}>
                        {tr("Ceritakan bisnis dan tujuan yang ingin Anda capai.", "Tell us about your business and what you want to achieve.")}
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "18px" }}>
                        <div>
                          <label htmlFor="companyName" style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                            {tr("Nama Perusahaan / Brand *", "Company / Brand Name *")}
                          </label>
                          <input
                            id="companyName"
                            type="text"
                            value={data.companyName}
                            onChange={(e) => setData((p) => ({ ...p, companyName: e.target.value }))}
                            placeholder={tr("mis. PT Kopi Nusantara", "e.g. Acme Coffee")}
                            style={{
                              width: "100%",
                              padding: "12px 14px",
                              borderRadius: "10px",
                              border: fieldErrors.companyName ? "1px solid #e53e3e" : "1px solid var(--border-line)",
                              background: "var(--canvas-cream)",
                              fontSize: "13px",
                            }}
                          />
                          {fieldErrors.companyName && (
                            <span style={{ color: "#e53e3e", fontSize: "11px", fontWeight: 600, display: "block", marginTop: "4px" }}>
                              {fieldErrors.companyName[0]}
                            </span>
                          )}
                        </div>

                        <div>
                          <label htmlFor="companyUrl" style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                            {tr("Website Saat Ini / Link Referensi", "Current Website / Reference Link")}
                          </label>
                          <input
                            id="companyUrl"
                            type="url"
                            value={data.companyUrl}
                            onChange={(e) => setData((p) => ({ ...p, companyUrl: e.target.value }))}
                            placeholder="https://perusahaan.id"
                            style={{
                              width: "100%",
                              padding: "12px 14px",
                              borderRadius: "10px",
                              border: "1px solid var(--border-line)",
                              background: "var(--canvas-cream)",
                              fontSize: "13px",
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <label htmlFor="brief" style={{ fontSize: "12px", fontWeight: 700 }}>
                            {tr("Deskripsi Singkat Kebutuhan Proyek *", "Brief Project Description *")}
                          </label>
                          <span style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
                            {data.brief.length} / 1000 {tr("Karakter", "Characters")}
                          </span>
                        </div>
                        <textarea
                          id="brief"
                          rows={4}
                          maxLength={1000}
                          value={data.brief}
                          onChange={(e) => setData((p) => ({ ...p, brief: e.target.value }))}
                          placeholder={tr("Ceritakan latar belakang, tantangan konversi saat ini, fitur yang dibutuhkan, atau target peluncuran...", "Tell us about your background, current challenges, needed features, or launch target...")}
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "10px",
                            border: fieldErrors.brief ? "1px solid #e53e3e" : "1px solid var(--border-line)",
                            background: "var(--canvas-cream)",
                            fontSize: "13px",
                            lineHeight: 1.6,
                            resize: "vertical",
                          }}
                        />
                        {fieldErrors.brief && (
                          <span style={{ color: "#e53e3e", fontSize: "11px", fontWeight: 600, display: "block", marginTop: "4px" }}>
                            {fieldErrors.brief[0]}
                          </span>
                        )}
                      </div>

                      {/* File upload mock placeholder */}
                      <div
                        style={{
                          border: "1px dashed var(--border-line)",
                          borderRadius: "12px",
                          padding: "24px",
                          textAlign: "center",
                          background: "var(--canvas-cream)",
                        }}
                      >
                        <span style={{ fontSize: "28px", display: "block", marginBottom: "6px" }}>📄</span>
                        <strong style={{ fontSize: "13px", display: "block", color: "var(--surface-navy)" }}>
                          {tr("Dokumen Pendukung (Opsional)", "Supporting Documents (Optional)")}
                        </strong>
                        <span style={{ fontSize: "11px", color: "var(--ink-muted)", display: "block", marginTop: "4px" }}>
                          {tr("Dokumen pendukung dapat dibagikan setelah tim kami menghubungi Anda. Form ini belum menerima unggahan berkas.", "Supporting documents can be shared after our team contacts you. This form does not accept file uploads.")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: CONTACT & HANDOVER */}
                  {step === 4 && (
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "#668300" }}>
                        {tr("Langkah 4", "Step 4")}
                      </span>
                      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--surface-navy)", margin: "4px 0 8px" }}>
                        {tr("Kontak & Sesi Diskusi", "Contact and Discussion")}
                      </h2>
                      <p style={{ color: "var(--ink-muted)", fontSize: "14px", margin: "0 0 24px" }}>
                        {tr("Tim kami akan meninjau brief dan menghubungi Anda untuk membahas langkah berikutnya.", "Our team will review your brief and contact you to discuss next steps.")}
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                        <div>
                          <label htmlFor="fullName" style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                            {tr("Nama Lengkap Penanggung Jawab *", "Contact Person's Full Name *")}
                          </label>
                          <input
                            id="fullName"
                            type="text"
                            value={data.fullName}
                            onChange={(e) => setData((p) => ({ ...p, fullName: e.target.value }))}
                            placeholder={tr("mis. Budi Pratama", "e.g. Alex Morgan")}
                            style={{
                              width: "100%",
                              padding: "12px 14px",
                              borderRadius: "10px",
                              border: fieldErrors.fullName ? "1px solid #e53e3e" : "1px solid var(--border-line)",
                              background: "var(--canvas-cream)",
                              fontSize: "13px",
                            }}
                          />
                          {fieldErrors.fullName && (
                            <span style={{ color: "#e53e3e", fontSize: "11px", fontWeight: 600, display: "block", marginTop: "4px" }}>
                              {fieldErrors.fullName[0]}
                            </span>
                          )}
                        </div>

                        <div>
                          <label htmlFor="businessEmail" style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                            {tr("Email Bisnis Resmi *", "Business Email *")}
                          </label>
                          <input
                            id="businessEmail"
                            type="email"
                            value={data.businessEmail}
                            onChange={(e) => setData((p) => ({ ...p, businessEmail: e.target.value }))}
                            placeholder="budi@perusahaan.id"
                            style={{
                              width: "100%",
                              padding: "12px 14px",
                              borderRadius: "10px",
                              border: fieldErrors.businessEmail ? "1px solid #e53e3e" : "1px solid var(--border-line)",
                              background: "var(--canvas-cream)",
                              fontSize: "13px",
                            }}
                          />
                          {fieldErrors.businessEmail && (
                            <span style={{ color: "#e53e3e", fontSize: "11px", fontWeight: 600, display: "block", marginTop: "4px" }}>
                              {fieldErrors.businessEmail[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                        <div>
                          <label htmlFor="whatsappNumber" style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                            {tr("Nomor WhatsApp Aktif *", "Active WhatsApp Number *")}
                          </label>
                          <input
                            id="whatsappNumber"
                            type="tel"
                            value={data.whatsappNumber}
                            onChange={(e) => setData((p) => ({ ...p, whatsappNumber: e.target.value }))}
                            placeholder="+62 812-xxxx-xxxx"
                            style={{
                              width: "100%",
                              padding: "12px 14px",
                              borderRadius: "10px",
                              border: fieldErrors.whatsappNumber ? "1px solid #e53e3e" : "1px solid var(--border-line)",
                              background: "var(--canvas-cream)",
                              fontSize: "13px",
                            }}
                          />
                          {fieldErrors.whatsappNumber && (
                            <span style={{ color: "#e53e3e", fontSize: "11px", fontWeight: 600, display: "block", marginTop: "4px" }}>
                              {fieldErrors.whatsappNumber[0]}
                            </span>
                          )}
                        </div>

                        <div>
                          <label htmlFor="meetingTimezone" style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                            {tr("Preferensi Waktu Diskusi", "Preferred Discussion Time")}
                          </label>
                          <select
                            id="meetingTimezone"
                            value={data.meetingTimezone}
                            onChange={(e) => setData((p) => ({ ...p, meetingTimezone: e.target.value }))}
                            style={{
                              width: "100%",
                              padding: "12px 14px",
                              borderRadius: "10px",
                              border: "1px solid var(--border-line)",
                              background: "var(--canvas-cream)",
                              fontSize: "13px",
                            }}
                          >
                            <option value="WIB (Jakarta) — Pagi 09:00 - 12:00">{tr("WIB (Jakarta) — Pagi 09:00 - 12:00", "WIB (Jakarta) — Morning 09:00–12:00")}</option>
                            <option value="WIB (Jakarta) — Siang 13:00 - 16:00">{tr("WIB (Jakarta) — Siang 13:00 - 16:00", "WIB (Jakarta) — Afternoon 13:00–16:00")}</option>
                            <option value="WITA (Bali) — Pagi 10:00 - 13:00">{tr("WITA (Bali) — Pagi 10:00 - 13:00", "WITA (Bali) — Morning 10:00–13:00")}</option>
                            <option value="Sesi Tertulis (Asynchronous via Email)">{tr("Sesi Tertulis (Asynchronous via Email)", "Written discussion by email")}</option>
                          </select>
                        </div>
                      </div>

                      <label
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          padding: "14px",
                          borderRadius: "10px",
                          background: "var(--canvas-cream)",
                          border: "1px solid var(--border-line)",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={data.requireMnda}
                          onChange={(e) => setData((p) => ({ ...p, requireMnda: e.target.checked }))}
                          style={{ marginTop: "3px" }}
                        />
                        <span style={{ fontSize: "12px", lineHeight: 1.5, color: "var(--ink-primary)" }}>
                          {tr("Saya ingin membahas", "I would like to discuss a")} <strong>Mutual Non-Disclosure Agreement (MNDA)</strong> {tr("sebelum berbagi dokumen sensitif.", "before sharing sensitive documents.")}
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Honeypot field for bot protection */}
                  <div style={{ display: "none" }} aria-hidden="true">
                    <input
                      type="text"
                      name="honeypot"
                      tabIndex={-1}
                      value={data.honeypot}
                      onChange={(e) => setData((p) => ({ ...p, honeypot: e.target.value }))}
                    />
                  </div>

                  {/* Navigation Action Buttons */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "32px",
                      paddingTop: "20px",
                      borderTop: "1px solid var(--border-line)",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="button button-outline"
                        style={{ minWidth: "140px" }}
                      >
                        ← {tr("Langkah Sebelumnya", "Previous Step")}
                      </button>
                    ) : (
                      <Link href="/" className="button button-outline">
                        ← {tr("Kembali ke Beranda", "Back to Home")}
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={submitting}
                      className="button button-primary"
                      style={{ minWidth: "160px" }}
                    >
                      {submitting ? tr("Mengirim Brief...", "Sending Brief...") : step === 4 ? tr("Kirim Brief ↗", "Send Brief ↗") : tr("Lanjutkan →", "Continue →")}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Context Sidebar */}
              <aside
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  padding: "28px",
                  border: "1px solid var(--border-line)",
                  position: "sticky",
                  top: "100px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-line)", paddingBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-lime)" }} />
                    <strong style={{ fontSize: "14px", color: "var(--surface-navy)" }}>{tr("Ringkasan Brief", "Brief Summary")}</strong>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", padding: "2px 8px", background: "var(--canvas-cream)", borderRadius: "6px" }}>
                    {tr("Draft Aktif", "Active Draft")}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-muted)", display: "block", marginBottom: "4px" }}>
                    {tr("Perusahaan", "Company")}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--surface-navy)" }}>
                    {data.companyName || tr("(Belum ditentukan)", "(Not specified)")}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-muted)", display: "block", marginBottom: "4px" }}>
                    {tr("Cakupan Terpilih", "Selected Services")}
                  </span>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                    {data.scopes.map((s) => (
                      <li key={s} style={{ fontSize: "12px", color: "var(--ink-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "#668300" }}>✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-muted)", display: "block", marginBottom: "4px" }}>
                    {tr("Alokasi Anggaran", "Budget Range")}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--surface-navy)" }}>
                    {data.budget}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-muted)", display: "block", marginBottom: "4px" }}>
                    {tr("Target Peluncuran", "Target Launch")}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--ink-primary)" }}>
                    {lang === "ID" ? data.timeline : data.timeline === TIMELINE_OPTIONS[0].label ? "Soon (under 3 weeks)" : data.timeline === TIMELINE_OPTIONS[1].label ? "4–8 weeks (ideal)" : "Flexible"}
                  </span>
                </div>

                <div
                  style={{
                    borderTop: "1px solid var(--border-line)",
                    paddingTop: "16px",
                    background: "var(--canvas-cream)",
                    padding: "14px",
                    borderRadius: "10px",
                  }}
                >
                  <strong style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: ".06em", display: "block", color: "var(--surface-navy)", marginBottom: "4px" }}>
                    {tr("Langkah Kerja Nexa Studio:", "How We Work:")}
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: "var(--ink-muted)", lineHeight: 1.6 }}>
                    <li>{tr("Ruang lingkup disepakati sebelum pekerjaan dimulai", "Scope is agreed before work begins")}</li>
                    <li>{tr("Jadwal dan biaya dikonfirmasi dalam proposal", "Timeline and pricing are confirmed in a proposal")}</li>
                    <li>{tr("Dokumen kerja dibahas sebelum pertukaran data sensitif", "Working documents are discussed before sensitive data is shared")}</li>
                  </ul>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

