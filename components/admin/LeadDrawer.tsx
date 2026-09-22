"use client";

import { useEffect, useRef } from "react";
import type { SubmissionItem } from "./types";
import type { SubmissionStatus } from "@/lib/submission-status";

interface LeadDrawerProps {
  submission: SubmissionItem | null;
  onClose: () => void;
  onStatusChange: (id: string, status: SubmissionStatus) => void;
  pending: boolean;
}

export default function LeadDrawer({
  submission,
  onClose,
  onStatusChange,
  pending,
}: LeadDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!submission) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [submission, onClose]);

  if (!submission) return null;

  // Extract phone number from message if present (e.g. from /start brief: "No WhatsApp: 0812...")
  const phoneMatch = submission.message.match(/(?:WhatsApp|WA|No(?:\s+WhatsApp)?):\s*([+\d\s-]+)/i);
  const cleanPhone = phoneMatch ? phoneMatch[1].replace(/\D/g, "") : null;
  const whatsappTarget = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Halo ${submission.name}, terima kasih telah menghubungi Nexa Studio.`)}`
    : null;

  const mailtoTarget = `mailto:${submission.email}?subject=${encodeURIComponent("Tanggapan Brief Proyek — Nexa Studio")}&body=${encodeURIComponent(`Halo ${submission.name},\n\nTerima kasih telah membagikan parameter kebutuhan proyek Anda.`)}`;

  return (
    <div className="drawer-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="drawer-lead-name">
      <div
        ref={panelRef}
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-line)", paddingBottom: "18px" }}>
          <div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                padding: "3px 8px",
                borderRadius: "99px",
                background: submission.status === "new" ? "var(--accent-lime)" : "#e8f0ec",
                color: "var(--surface-navy)",
                display: "inline-block",
                marginBottom: "8px",
              }}
            >
              Status: {submission.status}
            </span>
            <h2 id="drawer-lead-name" style={{ fontSize: "22px", fontWeight: 800, margin: 0, color: "var(--surface-navy)" }}>
              {submission.name}
            </h2>
            <a
              href={`mailto:${submission.email}`}
              style={{ fontSize: "13px", color: "var(--ink-muted)", textDecoration: "underline" }}
            >
              {submission.email}
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail lead"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "var(--canvas-cream)",
              border: "1px solid var(--border-line)",
              fontSize: "18px",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              color: "var(--surface-navy)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Quick Communication Actions */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {whatsappTarget && (
            <a
              href={whatsappTarget}
              target="_blank"
              rel="noreferrer"
              className="button button-lime"
              style={{ flex: 1, textAlign: "center", fontSize: "12px" }}
            >
              Hubungi via WhatsApp ↗
            </a>
          )}
          <a
            href={mailtoTarget}
            className="button button-primary"
            style={{ flex: 1, textAlign: "center", fontSize: "12px" }}
          >
            Kirim Email Balasan ✉
          </a>
        </div>

        {/* Message Content */}
        <div>
          <strong style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-muted)", marginBottom: "8px" }}>
            Isi Pesan / Parameter Brief:
          </strong>
          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "var(--canvas-cream)",
              border: "1px solid var(--border-line)",
              fontSize: "13px",
              lineHeight: 1.65,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "var(--ink-primary)",
              maxHeight: "320px",
              overflowY: "auto",
            }}
          >
            {submission.message}
          </div>
        </div>

        {/* Change Status Controls */}
        <div>
          <strong style={{ display: "block", fontSize: "12px", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-muted)", marginBottom: "8px" }}>
            Ubah Status Lead:
          </strong>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {(["new", "read", "replied", "archived"] as const).map((st) => {
              const isCurrent = submission.status === st;
              const labelMap: Record<string, string> = {
                new: "Baru",
                read: "Dibaca",
                replied: "Dibalas",
                archived: "Arsip",
              };
              return (
                <button
                  key={st}
                  type="button"
                  disabled={pending || isCurrent}
                  onClick={() => onStatusChange(submission.id, st)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: isCurrent ? "2px solid var(--surface-navy)" : "1px solid var(--border-line)",
                    background: isCurrent ? "var(--surface-navy)" : "#ffffff",
                    color: isCurrent ? "#ffffff" : "var(--ink-primary)",
                    fontWeight: 700,
                    fontSize: "12px",
                    cursor: isCurrent || pending ? "default" : "pointer",
                  }}
                >
                  {labelMap[st]} {isCurrent && "✓"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Technical Metadata & Audit */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "16px",
            borderTop: "1px solid var(--border-line)",
            fontSize: "11px",
            color: "var(--ink-muted)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <div><strong>ID:</strong> {submission.id}</div>
          <div><strong>Diterima Pada:</strong> {new Date(submission.createdAt).toLocaleString("id-ID")}</div>
          <div><strong>Status Pengiriman Email:</strong> {submission.notificationStatus || (submission.emailSent ? "sent" : "pending")}</div>
        </div>
      </div>
    </div>
  );
}

