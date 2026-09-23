"use client";

import { useState } from "react";
import type { SubmissionStatus } from "@/lib/submission-status";
import type { SubmissionItem } from "./types";
import LeadDrawer from "./LeadDrawer";
import { useLanguage } from "@/lib/i18n/context";

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
  const { lang } = useLanguage();
  const tr = (id: string, en: string) => lang === "EN" ? en : id;
  const filterLabels: Record<string, string> = lang === "EN"
    ? { all: "All", new: "New", read: "Read", replied: "Replied", archived: "Archived" }
    : Object.fromEntries(filters.map((item) => [item.id, item.label]));
  const notificationLabel = (status: string, emailSent: boolean): string => {
    if (emailSent || status === "sent") return tr("terkirim", "sent");
    if (status === "sending") return tr("diproses", "sending");
    if (status === "retryable_failed") return tr("menunggu percobaan ulang", "waiting to retry");
    if (status === "failed") return tr("gagal, perlu ditinjau", "failed, review required");
    if (status === "review") return tr("perlu ditinjau", "review required");
    return tr("menunggu pengiriman", "pending delivery");
  };
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
            {tr("Pesan Kontak Masuk", "Incoming Inquiries")} ({total})
          </h2>
          <small style={{ color: "var(--ink-muted)" }}>
            {tr("Inquiry dan brief proyek yang dikirimkan calon mitra.", "Inquiries and project briefs from prospective partners.")}
          </small>
        </div>
        <nav className="admin-filters" aria-label={tr("Filter pesan", "Inquiry filters")}>
          {filters.map((item) => (
            <a
              key={item.id}
              href={`/admin?status=${item.id}&page=1`}
              aria-current={activeFilter === item.id ? "page" : undefined}
            >
              {filterLabels[item.id]}
            </a>
          ))}
        </nav>
      </div>

      {submissions.length === 0 ? (
        <p style={{ margin: "24px 0", color: "var(--ink-muted)" }}>
          {tr("Belum ada pesan untuk filter ini.", "No inquiries match this filter.")}
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
                  <small>{new Date(submission.createdAt).toLocaleString(lang === "EN" ? "en-US" : "id-ID")}</small>
                </div>
              </div>

              <p>{submission.message}</p>
              <small>
                {tr("Notifikasi email", "Email notification")}: {" "}
                {notificationLabel(submission.notificationStatus, submission.emailSent)}
              </small>

              <div
                className="admin-row-actions"
                aria-label={`${tr("Ubah status pesan dari", "Change inquiry status for")} ${submission.name}`}
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
                  {tr("Detail CRM Drawer ↗", "Open CRM Details ↗")}
                </button>
                {(["new", "read", "replied", "archived"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={pending || submission.status === status}
                    onClick={() => onStatusChange(submission.id, status)}
                  >
                    {filterLabels[status]}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {total > 0 && (
        <nav className="admin-pagination" aria-label={tr("Halaman pesan", "Inquiry pages")}>
          <span>
            {tr("Halaman", "Page")} {Math.min(page, totalPages)} {tr("dari", "of")} {totalPages}
          </span>
          <div>
            {page > 1 && (
              <a href={`/admin?status=${activeFilter}&page=${page - 1}`}>
                ← {tr("Sebelumnya", "Previous")}
              </a>
            )}
            {page < totalPages && (
              <a href={`/admin?status=${activeFilter}&page=${page + 1}`}>
                {tr("Selanjutnya", "Next")} →
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
