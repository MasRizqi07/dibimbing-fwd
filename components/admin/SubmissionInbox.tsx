"use client";

import { useState } from "react";
import type { SubmissionStatus } from "@/lib/submission-status";
import type { SubmissionItem } from "./types";
import LeadDrawer from "./LeadDrawer";

interface Props {
  submissions: SubmissionItem[];
  total: number;
  page: number;
  pageSize: number;
  filter: string;
  pending: boolean;
  onStatusChange: (id: string, status: SubmissionStatus) => void;
}

const filters = [
  { id: "all", label: "Semua" },
  { id: "new", label: "Baru" },
  { id: "read", label: "Dibaca" },
  { id: "replied", label: "Dibalas" },
  { id: "archived", label: "Arsip" },
];

function notificationLabel(status: string, emailSent: boolean): string {
  if (emailSent || status === "sent") return "terkirim";
  if (status === "sending") return "diproses";
  if (status === "retryable_failed") return "menunggu percobaan ulang";
  if (status === "failed") return "gagal, perlu ditinjau";
  if (status === "review") return "perlu ditinjau";
  return "menunggu pengiriman";
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function SubmissionInbox({
  submissions,
  total,
  page,
  pageSize,
  filter,
  pending,
  onStatusChange,
}: Props) {
  const [activeLead, setActiveLead] = useState<SubmissionItem | null>(null);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilter = filters.some((item) => item.id === filter) ? filter : "all";

  // Keep active lead updated if status changed
  const currentActiveLead = activeLead
    ? submissions.find((s) => s.id === activeLead.id) || activeLead
    : null;

  return (
    <section className="admin-panel" aria-labelledby="inbox-heading">
      <div className="admin-panel-header">
        <div>
          <h2 id="inbox-heading" style={{ margin: 0 }}>
            Pesan Kontak Masuk ({total})
          </h2>
          <small style={{ color: "var(--ink-muted)" }}>
            Inquiry dan brief proyek yang dikirimkan calon mitra.
          </small>
        </div>
        <nav className="admin-filters" aria-label="Filter pesan">
          {filters.map((item) => (
            <a
              key={item.id}
              href={`/admin?status=${item.id}&page=1`}
              aria-current={activeFilter === item.id ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {submissions.length === 0 ? (
        <p style={{ margin: "24px 0", color: "var(--ink-muted)" }}>
          Belum ada pesan untuk filter ini.
        </p>
      ) : (
        <ul className="admin-submission-list">
          {submissions.map((submission) => (
            <li key={submission.id}>
              <div className="admin-submission-header">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background:
                        submission.status === "new"
                          ? "var(--accent-lime)"
                          : "var(--canvas-cream)",
                      color: "var(--surface-navy)",
                      fontWeight: 800,
                      fontSize: "12px",
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid var(--border-line)",
                    }}
                  >
                    {getInitials(submission.name)}
                  </div>
                  <div>
                    <strong>{submission.name}</strong>{" "}
                    <a href={`mailto:${submission.email}`}>{submission.email}</a>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    className="admin-status"
                    style={{
                      background:
                        submission.status === "new"
                          ? "rgba(195, 243, 91, 0.25)"
                          : undefined,
                      fontWeight: submission.status === "new" ? 700 : 500,
                    }}
                  >
                    {submission.status}
                  </span>{" "}
                  <small>{new Date(submission.createdAt).toLocaleString("id-ID")}</small>
                </div>
              </div>

              <p>{submission.message}</p>
              <small>
                Notifikasi email:{" "}
                {notificationLabel(submission.notificationStatus, submission.emailSent)}
              </small>

              <div
                className="admin-row-actions"
                aria-label={`Ubah status pesan dari ${submission.name}`}
              >
                <button
                  type="button"
                  onClick={() => setActiveLead(submission)}
                  style={{
                    fontWeight: 700,
                    color: "var(--surface-navy)",
                    borderColor: "var(--surface-navy)",
                  }}
                >
                  Detail CRM Drawer ↗
                </button>
                {(["new", "read", "replied", "archived"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={pending || submission.status === status}
                    onClick={() => onStatusChange(submission.id, status)}
                  >
                    {status === "new"
                      ? "Baru"
                      : status === "read"
                        ? "Dibaca"
                        : status === "replied"
                          ? "Dibalas"
                          : "Arsip"}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {total > 0 && (
        <nav className="admin-pagination" aria-label="Halaman pesan">
          <span>
            Halaman {Math.min(page, totalPages)} dari {totalPages}
          </span>
          <div>
            {page > 1 && (
              <a href={`/admin?status=${activeFilter}&page=${page - 1}`}>
                ← Sebelumnya
              </a>
            )}
            {page < totalPages && (
              <a href={`/admin?status=${activeFilter}&page=${page + 1}`}>
                Selanjutnya →
              </a>
            )}
          </div>
        </nav>
      )}

      {/* Slide-over CRM Drawer */}
      <LeadDrawer
        submission={currentActiveLead}
        onClose={() => setActiveLead(null)}
        onStatusChange={onStatusChange}
        pending={pending}
      />
    </section>
  );
}
