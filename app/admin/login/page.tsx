"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAdminAction } from "@/app/actions/auth";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, null);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "var(--navy)",
        color: "#fff",
        fontFamily: "var(--font-geist-sans), Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          width: "min(100%, 440px)",
          padding: "36px 32px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, var(--accent-lime), #8bab19, var(--surface-navy-elevated))",
          }}
        />

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.07)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "4px 12px",
              borderRadius: "99px",
              marginBottom: "16px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--accent-lime)",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-lime)" }} />
            CMS Management Portal
          </div>

          <div>
            <div
              style={{
                display: "inline-grid",
                placeItems: "center",
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "var(--lime)",
                color: "var(--navy)",
                fontSize: "24px",
                fontWeight: 900,
                marginBottom: "16px",
              }}
            >
              N
            </div>
          </div>
          <h1 style={{ fontSize: "22px", margin: "0 0 6px", fontWeight: 800 }}>
            Nexa Studio CMS
          </h1>
          <p style={{ margin: 0, color: "#8b9c9b", fontSize: "13px" }}>
            Masuk untuk mengelola portfolio & submissions
          </p>
        </div>

        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              htmlFor="password"
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#a9bcba",
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Password Admin
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Masukkan password admin"
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <label
                htmlFor="totpCode"
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#a9bcba",
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                Kode 2FA / TOTP (Jika Diaktifkan)
              </label>
              <span style={{ fontSize: "10px", color: "#a9bcba" }}>Opsional</span>
            </div>
            <input
              id="totpCode"
              name="totpCode"
              type="text"
              maxLength={6}
              placeholder="Contoh: 123456"
              autoComplete="one-time-code"
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#fff",
                fontSize: "14px",
                letterSpacing: ".1em",
                outline: "none",
              }}
            />
          </div>

          {state?.error && (
            <div
              role="alert"
              style={{
                padding: "11px 14px",
                borderRadius: "10px",
                background: "rgba(255, 100, 100, 0.15)",
                border: "1px solid rgba(255, 100, 100, 0.3)",
                color: "#ffbcbc",
                fontSize: "12px",
              }}
            >
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="button button-lime"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "13px",
              fontWeight: 800,
              cursor: isPending ? "not-allowed" : "pointer",
              border: "none",
              marginTop: "6px",
            }}
          >
            {isPending ? "Memverifikasi..." : "Masuk ke Dashboard ↗"}
          </button>
        </form>

        <div
          style={{
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <p style={{ margin: 0, fontSize: "11px", color: "#8b9c9b", lineHeight: 1.5 }}>
            Akses terbatas untuk administrator resmi Nexa Studio. Sesi diamankan dengan cookie bertanda tangan HMAC.
          </p>
          <Link
            href="/"
            style={{
              color: "var(--accent-lime)",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ← Kembali ke Situs Publik
          </Link>
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#8b9c9b",
          fontSize: "11px",
        }}
      >
        <span>NEXA CMS v2.4.9</span>
        <span>•</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-lime)" }} />
          JKT01 Gateway
        </span>
        <span>•</span>
        <span>TLS 1.3 / ECH</span>
      </div>
    </div>
  );
}
