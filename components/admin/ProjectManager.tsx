"use client";

import { useState, useTransition, useRef } from "react";
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
} from "@/app/actions/projects";
import { updateSubmissionStatusAction } from "@/app/actions/submissions";
import type { SubmissionStatus } from "@/lib/submission-status";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import SubmissionInbox from "./SubmissionInbox";
import type { ProjectItem, SubmissionItem } from "./types";
import { useLanguage } from "@/lib/i18n/context";

interface Props {
  initialProjects: ProjectItem[];
  submissions: SubmissionItem[];
  totalSubmissions: number;
  currentPage: number;
  pageSize: number;
  currentStatusFilter: string;
}

export default function ProjectManager({
  initialProjects,
  submissions,
  totalSubmissions,
  currentPage,
  pageSize,
  currentStatusFilter,
}: Props) {
  const { lang } = useLanguage();
  const tr = (id: string, en: string) => lang === "EN" ? en : id;
  const [pending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "inbox">("projects");

  const projectsRef = useRef<HTMLDivElement>(null);
  const inboxRef = useRef<HTMLDivElement>(null);

  const nextOrder =
    initialProjects.reduce(
      (largest, project) => Math.max(largest, project.order),
      0
    ) + 1;

  function submitProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      try {
        if (editing) {
          await updateProjectAction(editing.id, formData);
        } else {
          await createProjectAction(formData);
        }
        setEditing(null);
        setAdding(false);
      } catch (cause) {
        setError(lang === "ID" && cause instanceof Error ? cause.message : tr("Project gagal disimpan.", "Unable to save project."));
      }
    });
  }

  function deleteProject(project: ProjectItem) {
    if (!window.confirm(tr(`Hapus project "${project.title}"?`, `Delete project "${project.title}"?`))) return;
    setError("");
    startTransition(async () => {
      try {
        await deleteProjectAction(project.id);
      } catch (cause) {
        setError(lang === "ID" && cause instanceof Error ? cause.message : tr("Project gagal dihapus.", "Unable to delete project."));
      }
    });
  }

  function changeStatus(id: string, status: SubmissionStatus) {
    setError("");
    startTransition(async () => {
      try {
        await updateSubmissionStatusAction(id, status);
      } catch (cause) {
        setError(lang === "ID" && cause instanceof Error ? cause.message : tr("Status pesan gagal diperbarui.", "Unable to update inquiry status."));
      }
    });
  }

  const unreadCount = submissions.filter((s) => s.status === "new").length;

  const scrollToProjects = () => {
    setActiveTab("projects");
    projectsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToInbox = () => {
    setActiveTab("inbox");
    inboxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="section-shell admin-dashboard">
      {/* 1. Operational Metric Badges */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        <div className="admin-panel" style={{ padding: "20px" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-muted)", display: "block", marginBottom: "4px" }}>
            {tr("Total Proyek Publik", "Public Projects")}
          </span>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--surface-navy)", display: "flex", alignItems: "baseline", gap: "6px" }}>
            {initialProjects.length}
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#465b00" }}>{tr("Aktif", "Active")}</span>
          </div>
          <small style={{ color: "var(--ink-muted)", fontSize: "12px" }}>{tr("Tampil langsung di homepage", "Shown on the homepage")}</small>
        </div>

        <div className="admin-panel" style={{ padding: "20px" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-muted)", display: "block", marginBottom: "4px" }}>
            {tr("Lead Masuk", "Incoming Leads")}
          </span>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--surface-navy)", display: "flex", alignItems: "baseline", gap: "6px" }}>
            {totalSubmissions}
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink-muted)" }}>Inquiry</span>
          </div>
          <small style={{ color: "var(--ink-muted)", fontSize: "12px" }}>{tr("Total tersimpan di database", "Total stored in the database")}</small>
        </div>

        <div
          className="admin-panel"
          style={{
            padding: "20px",
            background: "var(--surface-navy)",
            color: "#ffffff",
            borderColor: "var(--surface-navy)",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "rgba(255,255,255,0.7)", display: "block", marginBottom: "4px" }}>
            {tr("Pesan Baru di Halaman Ini", "New Messages on This Page")}
          </span>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--accent-lime)" }}>
            {unreadCount}
          </div>
          <small style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>{tr("Dihitung dari halaman inbox aktif", "Calculated from the active inbox page")}</small>
        </div>
      </div>

      {/* 2. Navigation Tabs & Form Trigger */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: "1px solid var(--border-line)",
          paddingBottom: "12px",
        }}
      >
        <div style={{ display: "inline-flex", background: "rgba(0,0,0,0.05)", padding: "4px", borderRadius: "12px", gap: "4px" }}>
          <button
            type="button"
            onClick={scrollToProjects}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "projects" ? "var(--surface-navy)" : "transparent",
              color: activeTab === "projects" ? "#ffffff" : "var(--ink-primary)",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>{tr("Manajemen Proyek", "Project Management")}</span>
            <span
              style={{
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "99px",
                background: activeTab === "projects" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)",
              }}
            >
              {initialProjects.length}
            </span>
          </button>

          <button
            type="button"
            onClick={scrollToInbox}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "inbox" ? "var(--surface-navy)" : "transparent",
              color: activeTab === "inbox" ? "#ffffff" : "var(--ink-primary)",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>{tr("Pesan Masuk / Inbox", "Inquiries / Inbox")}</span>
            {unreadCount > 0 && (
              <span
                style={{
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "99px",
                  background: "var(--accent-lime)",
                  color: "var(--surface-navy)",
                  fontWeight: 800,
                }}
              >
                {unreadCount} {tr("Baru", "New")}
              </span>
            )}
          </button>
        </div>

        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            setAdding(!adding);
            setEditing(null);
          }}
        >
          {adding ? tr("Tutup Form", "Close Form") : tr("+ Tambah Project", "+ Add Project")}
        </button>
      </div>

      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      {/* Form modal/panel for Add/Edit */}
      {(adding || editing) && (
        <ProjectForm
          key={editing?.id || "new"}
          project={editing || undefined}
          nextOrder={nextOrder}
          pending={pending}
          onSubmit={submitProject}
          onCancel={() => {
            setAdding(false);
            setEditing(null);
          }}
        />
      )}

      {/* Projects Section */}
      <div ref={projectsRef}>
        <ProjectList
          projects={initialProjects}
          pending={pending}
          onEdit={(project) => {
            setEditing(project);
            setAdding(false);
            window.scrollTo({ top: 200, behavior: "smooth" });
          }}
          onDelete={deleteProject}
        />
      </div>

      {/* Submissions Inbox Section */}
      <div ref={inboxRef} style={{ marginTop: "16px" }}>
        <SubmissionInbox
          submissions={submissions}
          total={totalSubmissions}
          page={currentPage}
          pageSize={pageSize}
          filter={currentStatusFilter}
          pending={pending}
          onStatusChange={changeStatus}
        />
      </div>
    </div>
  );
}
