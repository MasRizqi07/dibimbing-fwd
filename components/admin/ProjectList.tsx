"use client";

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
      <h2 id="project-list-heading">Portfolio ({projects.length})</h2>
      {projects.length === 0 ? <p>Belum ada project.</p> : (
        <ul className="admin-project-list">
          {projects.map((project) => (
            <li key={project.id}>
              <div>
                <strong>{project.title}</strong>
                <span>{project.type}</span>
                <small>Urutan {project.order} · {project.result}</small>
              </div>
              <div className="admin-row-actions">
                <button type="button" disabled={pending} onClick={() => onEdit(project)}>Edit</button>
                <button type="button" disabled={pending} onClick={() => onDelete(project)} className="danger">Hapus</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
