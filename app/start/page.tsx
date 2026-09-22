"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";

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
    id: "web-app",
    label: "Web App & Headless Storefront",
    desc: "Next.js, Tailwind, integrasi Payment Gateway & ERP lokal.",
  },
  {
    id: "branding",
    label: "Rebranding & Visual Identity",
    desc: "Design system, guideline tipografi, icon set enterprise.",
  },
  {
    id: "audit",
    label: "Product Architecture Audit",
    desc: "Review keamanan ISO, latency database, dan refactor code.",
  },
  {
    id: "retainer",
    label: "Dedicated Squad Retainer",
    desc: "1 Principal Architect, 2 Senior Dev, 1 UI/UX Specialist.",
  },
];

const BUDGET_TIERS = [
  {
    id: "tier-a",
    tier: "Starter Sprint",
    bracket: "IDR 15M – 25M",
    desc: "Sprint terfokus 2–4 minggu. Sangat cocok untuk validasi MVP atau perombakan modul kunci.",
  },
  {
    id: "tier-b",
    tier: "Rekomendasi Bisnis",
    bracket: "IDR 25M – 50M",
    desc: "Komprehensif: Full App + Branding + SLA Kinerja. Solusi ideal scale-up dan UMKM berkembang.",
    recommended: true,
  },
  {
    id: "tier-c",
    tier: "Enterprise Core",
    bracket: "IDR 50M+",
    desc: "Arsitektur multi-region, audit kepatuhan khusus, microservices & dedicated engineering squads.",
  },
];

const TIMELINE_OPTIONS = [
  { id: "urgent", label: "Segera (< 3 minggu)" },
  { id: "ideal", label: "4 – 8 Minggu (Ideal)" },
  { id: "flexible", label: "Fleksibel / Q4 2026" },
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
  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<StepData>({
    scopes: ["Web App & Headless Storefront", "Rebranding & Visual Identity"],
    budget: "IDR 25M – 50M",
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
        setErrorMsg("Silakan pilih minimal 1 cakupan layanan.");
        return false;
      }
    } else if (step === 3) {
      if (!data.companyName.trim()) {
        setFieldErrors({ companyName: ["Nama perusahaan atau brand wajib diisi."] });
        return false;
      }
      if (data.brief.trim().length < 10) {
        setFieldErrors({ brief: ["Deskripsi kebutuhan minimal 10 karakter."] });
        return false;
      }
    } else if (step === 4) {
      const errors: Record<string, string[]> = {};
      if (data.fullName.trim().length < 2) {
        errors.fullName = ["Nama minimal 2 karakter."];
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.businessEmail.trim())) {
        errors.businessEmail = ["Format email tidak valid."];
      }
      if (data.whatsappNumber.trim().length < 8) {
        errors.whatsappNumber = ["Nomor WhatsApp minimal 8 digit."];
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
        setErrorMsg("Validasi formulir belum siap. Silakan periksa koneksi Anda.");
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
        setErrorMsg(resData.error || "Gagal mengirim brief. Silakan coba lagi.");
        if (resData.details) setFieldErrors(resData.details);
        setSubmitting(false);
        return;
      }

      setIsSuccess(true);
      window.scrollTo({ top: 80, behavior: "smooth" });
    } catch {
      setErrorMsg("Terjadi gangguan koneksi jaringan. Coba lagi dalam beberapa saat.");
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
                Brief Interaktif Proyek • Nexa Studio
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
              🔒 Kerahasiaan Dokumen ISO/IEC 27001 Terjamin
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
                Brief Diterima
              </span>
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--surface-navy)", margin: "0 0 12px" }}>
                Terima kasih, {data.fullName}!
              </h1>
              <p style={{ color: "var(--ink-muted)", fontSize: "15px", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto 28px" }}>
                Parameter proyek untuk <strong>{data.companyName}</strong> telah kami amankan. Principal Architect kami akan meninjau kelayakan teknis dan menghubungi Anda dalam kurun 24 jam kerja.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/" className="button button-primary">
                  Kembali ke Beranda
                </Link>
                <Link href="/work/nomad-coffee-roasters" className="button button-outline">
                  Lihat Studi Kasus ↗
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
                      Langkah {step} dari 4
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--surface-navy)" }}>
                      {progressPercent}% Lengkap
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
                    {["Cakupan", "Anggaran", "Spesifikasi", "Kontak"].map((label, idx) => {
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
                        Langkah 1
                      </span>
                      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--surface-navy)", margin: "4px 0 8px" }}>
                        Pilih Cakupan Rekayasa & Desain
                      </h2>
                      <p style={{ color: "var(--ink-muted)", fontSize: "14px", margin: "0 0 24px" }}>
                        Pilih satu atau beberapa modul layanan spesifik yang ingin dialokasikan ke tim Nexa Studio.
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                        {AVAILABLE_SCOPES.map((item) => {
                          const selected = data.scopes.includes(item.label);
                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleScope(item.label)}
                              style={{
                                padding: "18px",
                                borderRadius: "14px",
                                border: selected ? "2px solid var(--surface-navy)" : "1px solid var(--border-line)",
                                background: selected ? "rgba(195, 243, 91, 0.12)" : "var(--canvas-cream)",
                                cursor: "pointer",
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
                                {item.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: BUDGET & TIMELINE */}
                  {step === 2 && (
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "#668300" }}>
                        Langkah 2
                      </span>
                      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--surface-navy)", margin: "4px 0 8px" }}>
                        Estimasi Alokasi Investasi & Target Waktu
                      </h2>
                      <p style={{ color: "var(--ink-muted)", fontSize: "14px", margin: "0 0 24px" }}>
                        Bantu kami memahami skala kapabilitas dan kecepatan sprint yang Anda targetkan.
                      </p>

                      <strong style={{ display: "block", fontSize: "13px", color: "var(--surface-navy)", marginBottom: "12px" }}>
                        Kisaran Alokasi Investasi (IDR)
                      </strong>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "28px" }}>
                        {BUDGET_TIERS.map((tier) => {
                          const isSel = data.budget === tier.bracket;
                          return (
                            <div
                              key={tier.id}
                              onClick={() => setData((p) => ({ ...p, budget: tier.bracket }))}
                              style={{
                                padding: "18px",
                                borderRadius: "14px",
                                border: isSel ? "2px solid var(--surface-navy)" : "1px solid var(--border-line)",
                                background: isSel ? "var(--surface-navy)" : "var(--canvas-cream)",
                                color: isSel ? "#ffffff" : "var(--ink-primary)",
                                cursor: "pointer",
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
                                {tier.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <strong style={{ display: "block", fontSize: "13px", color: "var(--surface-navy)", marginBottom: "12px" }}>
                        Target Peluncuran ke Publik
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
                              {opt.label}
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
                        Langkah 3
                      </span>
                      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--surface-navy)", margin: "4px 0 8px" }}>
                        Spesifikasi Proyek & Latar Belakang
                      </h2>
                      <p style={{ color: "var(--ink-muted)", fontSize: "14px", margin: "0 0 24px" }}>
                        Deskripsikan entitas bisnis Anda dan sasaran yang ingin dicapai melalui inisiatif ini.
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "18px" }}>
                        <div>
                          <label htmlFor="companyName" style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                            Nama Perusahaan / Brand *
                          </label>
                          <input
                            id="companyName"
                            type="text"
                            value={data.companyName}
                            onChange={(e) => setData((p) => ({ ...p, companyName: e.target.value }))}
                            placeholder="mis. PT Kopi Nusantara"
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
                            Website Saat Ini / Link Referensi
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
                            Deskripsi Singkat Kebutuhan Proyek *
                          </label>
                          <span style={{ fontSize: "11px", color: "var(--ink-muted)" }}>
                            {data.brief.length} / 1000 Karakter
                          </span>
                        </div>
                        <textarea
                          id="brief"
                          rows={4}
                          maxLength={1000}
                          value={data.brief}
                          onChange={(e) => setData((p) => ({ ...p, brief: e.target.value }))}
                          placeholder="Ceritakan latar belakang, tantangan konversi saat ini, fitur yang dibutuhkan, atau target peluncuran..."
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
                          Lampiran Dokumen RFP / Brand Guidelines (Opsional)
                        </strong>
                        <span style={{ fontSize: "11px", color: "var(--ink-muted)", display: "block", marginTop: "4px" }}>
                          File PDF, DOCX, atau Figma link hingga 25MB dapat dibagikan saat sesi temu awal.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: CONTACT & HANDOVER */}
                  {step === 4 && (
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: "#668300" }}>
                        Langkah 4
                      </span>
                      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--surface-navy)", margin: "4px 0 8px" }}>
                        Kontak Narahubung & Sesi Diskusi
                      </h2>
                      <p style={{ color: "var(--ink-muted)", fontSize: "14px", margin: "0 0 24px" }}>
                        Principal Architect kami akan meninjau parameter dan menjadwalkan konsultasi arsitektur 30 menit.
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                        <div>
                          <label htmlFor="fullName" style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                            Nama Lengkap Penanggung Jawab *
                          </label>
                          <input
                            id="fullName"
                            type="text"
                            value={data.fullName}
                            onChange={(e) => setData((p) => ({ ...p, fullName: e.target.value }))}
                            placeholder="mis. Budi Pratama"
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
                            Email Bisnis Resmi *
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
                            Nomor WhatsApp Aktif *
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
                            Preferensi Waktu Diskusi (Google Meet)
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
                            <option>WIB (Jakarta) — Pagi 09:00 - 12:00</option>
                            <option>WIB (Jakarta) — Siang 13:00 - 16:00</option>
                            <option>WITA (Bali) — Pagi 10:00 - 13:00</option>
                            <option>Sesi Tertulis (Asynchronous via Email)</option>
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
                          Kirimkan draf dokumen <strong>Mutual Non-Disclosure Agreement (MNDA)</strong> sebelum pertukaran dokumentasi arsitektur sensitif.
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
                        ← Langkah Sebelumnya
                      </button>
                    ) : (
                      <Link href="/" className="button button-outline">
                        ← Kembali ke Beranda
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={submitting}
                      className="button button-primary"
                      style={{ minWidth: "160px" }}
                    >
                      {submitting ? "Mengirim Brief..." : step === 4 ? "Kirim Onboarding Brief ↗" : "Lanjutkan →"}
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
                    <strong style={{ fontSize: "14px", color: "var(--surface-navy)" }}>Ringkasan Brief</strong>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", padding: "2px 8px", background: "var(--canvas-cream)", borderRadius: "6px" }}>
                    Draft Aktif
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-muted)", display: "block", marginBottom: "4px" }}>
                    Perusahaan
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--surface-navy)" }}>
                    {data.companyName || "(Belum ditentukan)"}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-muted)", display: "block", marginBottom: "4px" }}>
                    Cakupan Terpilih
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
                    Alokasi Anggaran
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--surface-navy)" }}>
                    {data.budget}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-muted)", display: "block", marginBottom: "4px" }}>
                    Target Peluncuran
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--ink-primary)" }}>
                    {data.timeline}
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
                    Jaminan Layanan Nexa Studio:
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: "var(--ink-muted)", lineHeight: 1.6 }}>
                    <li>100% Hak kepemilikan kode sumber</li>
                    <li>SLA Respon review &lt; 24 jam kerja</li>
                    <li>Masa garansi bug paska rilis 60 hari</li>
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

