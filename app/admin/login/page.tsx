"use client";

import { useActionState } from "react";
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
          width: "min(100%, 420px)",
          padding: "36px 32px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
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
      </div>
    </div>
  );
}
