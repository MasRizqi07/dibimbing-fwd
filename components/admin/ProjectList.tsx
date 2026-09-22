"use client";

import Image from "next/image";
import type { ProjectItem } from "./types";

interface Props {
  projects: ProjectItem[];
  pending: boolean;
  onEdit: (project: ProjectItem) => void;
  onDelete: (project: ProjectItem) => void;
}

export default function ProjectList({ projects, pending, onEdit, onDelete }: Props) {
  return (
    <section className="admin-panel" aria-labelledby="project-list-heading">
      <div className="admin-panel-header" style={{ marginBottom: "16px" }}>
        <div>
          <h2 id="project-list-heading" style={{ margin: 0 }}>
            Katalog Portfolio Publik ({projects.length})
          </h2>
          <small style={{ color: "var(--ink-muted)" }}>
            Urutan menentukan posisi kartu showcase pada beranda utama.
          </small>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: "99px",
            background: "#e8f0ec",
            color: "#275047",
          }}
        >
          ● Live Sync Terhubung
        </span>
      </div>

      {projects.length === 0 ? (
        <p style={{ margin: "20px 0", color: "var(--ink-muted)" }}>Belum ada project.</p>
      ) : (
        <ul className="admin-project-list">
          {projects.map((project) => (
            <li key={project.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", padding: "16px 0", borderTop: "1px solid var(--border-line)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                {/* Order Badge */}
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    background: "var(--canvas-cream)",
                    border: "1px solid var(--border-line)",
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "var(--surface-navy)",
                  }}
                >
                  #{project.order}
                </span>

                {/* Thumbnail Preview */}
                {project.imagePath ? (
                  <div
                    style={{
                      width: "64px",
                      height: "44px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                      border: "1px solid var(--border-line)",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={project.imagePath}
                      alt={project.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="64px"
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "64px",
                      height: "44px",
                      borderRadius: "8px",
                      background: "var(--canvas-cream)",
                      border: "1px solid var(--border-line)",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "10px",
                      color: "var(--ink-muted)",
                      flexShrink: 0,
                    }}
                  >
                    No Img
                  </div>
                )}

                {/* Project Details */}
                <div>
                  <strong style={{ fontSize: "14px", color: "var(--surface-navy)", display: "block" }}>
                    {project.title}
                  </strong>
                  <span style={{ fontSize: "12px", color: "var(--ink-muted)", display: "block" }}>
                    {project.type}
                  </span>
                  <small style={{ fontSize: "11px", color: "#668300", fontWeight: 700 }}>
                    {project.result}
                  </small>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="admin-row-actions">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => onEdit(project)}
                  style={{ fontWeight: 700 }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => onDelete(project)}
                  className="danger"
                  style={{ fontWeight: 700 }}
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
