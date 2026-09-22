"use client";

import type { SubmissionStatus } from "@/lib/submission-status";
import type { SubmissionItem } from "./types";

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

export default function SubmissionInbox({ submissions, total, page, pageSize, filter, pending, onStatusChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const activeFilter = filters.some((item) => item.id === filter) ? filter : "all";
  return (
    <section className="admin-panel" aria-labelledby="inbox-heading">
      <div className="admin-panel-header">
        <h2 id="inbox-heading">Pesan Kontak Masuk ({total})</h2>
        <nav className="admin-filters" aria-label="Filter pesan">
          {filters.map((item) => (
            <a key={item.id} href={`/admin?status=${item.id}&page=1`} aria-current={activeFilter === item.id ? "page" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      {submissions.length === 0 ? <p>Belum ada pesan untuk filter ini.</p> : (
        <ul className="admin-submission-list">
          {submissions.map((submission) => (
            <li key={submission.id}>
              <div className="admin-submission-header">
                <div><strong>{submission.name}</strong> <a href={`mailto:${submission.email}`}>{submission.email}</a></div>
                <div><span className="admin-status">{submission.status}</span> <small>{new Date(submission.createdAt).toLocaleString("id-ID")}</small></div>
              </div>
              <p>{submission.message}</p>
              <small>Notifikasi email: {notificationLabel(submission.notificationStatus, submission.emailSent)}</small>
              <div className="admin-row-actions" aria-label={`Ubah status pesan dari ${submission.name}`}>
                {(["new", "read", "replied", "archived"] as const).map((status) => (
                  <button key={status} type="button" disabled={pending || submission.status === status} onClick={() => onStatusChange(submission.id, status)}>
                    {status === "new" ? "Baru" : status === "read" ? "Dibaca" : status === "replied" ? "Dibalas" : "Arsip"}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
      {total > 0 && (
        <nav className="admin-pagination" aria-label="Halaman pesan">
          <span>Halaman {Math.min(page, totalPages)} dari {totalPages}</span>
          <div>
            {page > 1 && <a href={`/admin?status=${activeFilter}&page=${page - 1}`}>← Sebelumnya</a>}
            {page < totalPages && <a href={`/admin?status=${activeFilter}&page=${page + 1}`}>Selanjutnya →</a>}
          </div>
        </nav>
      )}
    </section>
  );
}
