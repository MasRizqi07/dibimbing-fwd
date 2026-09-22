"use client";

import { useState, useTransition } from "react";
import { createProjectAction, updateProjectAction, deleteProjectAction } from "@/app/actions/projects";
import { updateSubmissionStatusAction } from "@/app/actions/submissions";
import type { SubmissionStatus } from "@/lib/submission-status";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import SubmissionInbox from "./SubmissionInbox";
import type { ProjectItem, SubmissionItem } from "./types";

interface Props {
  initialProjects: ProjectItem[];
  submissions: SubmissionItem[];
  totalSubmissions: number;
  currentPage: number;
  pageSize: number;
  currentStatusFilter: string;
}

export default function ProjectManager({ initialProjects, submissions, totalSubmissions, currentPage, pageSize, currentStatusFilter }: Props) {
  const [pending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [error, setError] = useState("");
  const nextOrder = initialProjects.reduce((largest, project) => Math.max(largest, project.order), 0) + 1;

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
        setError(cause instanceof Error ? cause.message : "Project gagal disimpan.");
      }
    });
  }

  function deleteProject(project: ProjectItem) {
    if (!window.confirm(`Hapus project "${project.title}"?`)) return;
    setError("");
    startTransition(async () => {
      try {
        await deleteProjectAction(project.id);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Project gagal dihapus.");
      }
    });
  }

  function changeStatus(id: string, status: SubmissionStatus) {
    setError("");
    startTransition(async () => {
      try {
        await updateSubmissionStatusAction(id, status);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Status pesan gagal diperbarui.");
      }
    });
  }

  return (
    <div className="section-shell admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h1>Kelola Portfolio</h1>
          <p>Perubahan yang disimpan tampil pada halaman utama setelah data diperbarui.</p>
        </div>
        <button type="button" className="button button-primary" onClick={() => { setAdding(!adding); setEditing(null); }}>
          {adding ? "Tutup Form" : "+ Tambah Project"}
        </button>
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {(adding || editing) && (
        <ProjectForm
          key={editing?.id || "new"}
          project={editing || undefined}
          nextOrder={nextOrder}
          pending={pending}
          onSubmit={submitProject}
          onCancel={() => { setAdding(false); setEditing(null); }}
        />
      )}
      <ProjectList
        projects={initialProjects}
        pending={pending}
        onEdit={(project) => { setEditing(project); setAdding(false); }}
        onDelete={deleteProject}
      />
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
  );
}
