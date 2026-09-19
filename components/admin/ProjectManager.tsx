"use client";

import { useState, useTransition } from "react";
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
} from "@/app/actions/projects";

interface Project {
  id: string;
  title: string;
  type: string;
  result: string;
  imagePath: string | null;
  className: string | null;
  order: number;
}

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  emailSent: boolean;
  createdAt: Date;
}

export default function ProjectManager({
  initialProjects,
  submissions,
}: {
  initialProjects: Project[];
  submissions: Submission[];
}) {
  const [isPending, startTransition] = useTransition();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [actionError, setActionError] = useState<string>("");

  const nextOrder =
    initialProjects.length > 0
      ? Math.max(...initialProjects.map((p) => p.order), 0) + 1
      : 1;

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionError("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        await createProjectAction(formData);
        setShowAddForm(false);
        form.reset();
      } catch (err: unknown) {
        setActionError(err instanceof Error ? err.message : "Gagal menambahkan project");
      }
    });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;
    setActionError("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        await updateProjectAction(editingProject.id, formData);
        setEditingProject(null);
      } catch (err: unknown) {
        setActionError(err instanceof Error ? err.message : "Gagal mengupdate project");
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Hapus project "${title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteProjectAction(id);
      } catch (err: unknown) {
        setActionError(err instanceof Error ? err.message : "Gagal menghapus project");
      }
    });
  };

  return (
    <div className="section-shell">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>Kelola Portfolio</h1>
          <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: "14px" }}>
            Perubahan data di sini langsung ditampilkan secara real-time di halaman utama.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingProject(null);
          }}
          className="button button-primary"
          style={{ cursor: "pointer", border: "none" }}
        >
          {showAddForm ? "Tutup Form" : "+ Tambah Project Baru"}
        </button>
      </div>

      {actionError && (
        <div
          role="alert"
          style={{
            padding: "14px 18px",
            borderRadius: "12px",
            background: "#fee2e2",
            border: "1px solid #f87171",
            color: "#991b1b",
            fontSize: "13px",
            marginBottom: "24px",
          }}
        >
          {actionError}
        </div>
      )}

      {/* Add Project Form */}
      {showAddForm && (
        <div
          style={{
            padding: "24px",
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid var(--line)",
            marginBottom: "36px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >
          <h2 style={{ fontSize: "18px", margin: "0 0 18px" }}>Tambah Project Baru</h2>
          <form className="admin-project-form" onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>
                Nama Project / Brand *
              </label>
              <input
                name="title"
                required
                placeholder="Contoh: Kopi Koma"
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>
                Tipe / Kategori *
              </label>
              <input
                name="type"
                required
                placeholder="Contoh: F&B · Branding + Website"
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>
                Hasil / Dampak *
              </label>
              <input
                name="result"
                required
                placeholder="Contoh: +38% online orders"
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>
                CSS Visual Class
              </label>
              <select
                name="className"
                defaultValue="project-coffee"
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)" }}
              >
                <option value="project-coffee">project-coffee (Nuansa Brown/Kopi)</option>
                <option value="project-fashion">project-fashion (Nuansa Sage/Fashion)</option>
                <option value="project-wellness">project-wellness (Nuansa Warm/Wellness)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>
                Urutan Tampil (Order)
              </label>
              <input
                name="order"
                type="number"
                defaultValue={nextOrder}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
              <button
                type="submit"
                disabled={isPending}
                className="button button-lime"
                style={{ padding: "12px 24px", border: "none", cursor: isPending ? "not-allowed" : "pointer" }}
              >
                {isPending ? "Menyimpan..." : "Simpan Project"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="button button-outline"
                style={{ padding: "12px 20px", cursor: "pointer" }}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal / Form */}
      {editingProject && (
        <div
          style={{
            padding: "24px",
            background: "#fff",
            borderRadius: "16px",
            border: "2px solid var(--lime)",
            marginBottom: "36px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ fontSize: "18px", margin: "0 0 18px" }}>Edit Project: {editingProject.title}</h2>
          <form className="admin-project-form" onSubmit={handleUpdate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <input
              type="hidden"
              name="imagePath"
              value={editingProject.imagePath || ""}
            />
            <div style={{ gridColumn: "1 / -1", padding: "8px 12px", background: "var(--cream, #f9fbf9)", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "12px", color: "var(--muted)" }}>
              <span>Gambar saat ini: </span>
              <strong style={{ color: "var(--ink)" }}>{editingProject.imagePath || "Tidak ada file gambar (menggunakan CSS placeholder)"}</strong>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>
                Nama Project / Brand *
              </label>
              <input
                name="title"
                defaultValue={editingProject.title}
                required
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>
                Tipe / Kategori *
              </label>
              <input
                name="type"
                defaultValue={editingProject.type}
                required
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>
                Hasil / Dampak *
              </label>
              <input
                name="result"
                defaultValue={editingProject.result}
                required
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>
                CSS Visual Class
              </label>
              <select
                name="className"
                defaultValue={editingProject.className || "project-coffee"}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)" }}
              >
                <option value="project-coffee">project-coffee (Nuansa Brown/Kopi)</option>
                <option value="project-fashion">project-fashion (Nuansa Sage/Fashion)</option>
                <option value="project-wellness">project-wellness (Nuansa Warm/Wellness)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, marginBottom: "6px" }}>
                Urutan Tampil (Order)
              </label>
              <input
                name="order"
                type="number"
                defaultValue={editingProject.order}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
              <button
                type="submit"
                disabled={isPending}
                className="button button-lime"
                style={{ padding: "12px 24px", border: "none", cursor: isPending ? "not-allowed" : "pointer" }}
              >
                {isPending ? "Menyimpan Perubahan..." : "Update Project"}
              </button>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="button button-outline"
                style={{ padding: "12px 20px", cursor: "pointer" }}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div
        className="admin-project-table"
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid var(--line)",
          overflow: "hidden",
          marginBottom: "48px",
        }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)", fontWeight: 700, fontSize: "14px" }}>
          Daftar Project Aktif ({initialProjects.length})
        </div>

        {initialProjects.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
            Belum ada project di database. Silakan klik tombol Tambah Project di atas.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--line)" }}>
                <th style={{ padding: "12px 20px", color: "var(--muted)", width: "60px" }}>Order</th>
                <th style={{ padding: "12px 20px", color: "var(--muted)" }}>Judul Project</th>
                <th style={{ padding: "12px 20px", color: "var(--muted)" }}>Kategori</th>
                <th style={{ padding: "12px 20px", color: "var(--muted)" }}>Hasil</th>
                <th style={{ padding: "12px 20px", color: "var(--muted)" }}>Visual Theme</th>
                <th style={{ padding: "12px 20px", color: "var(--muted)", textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {initialProjects.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "16px 20px", fontWeight: 700 }}>#{p.order}</td>
                  <td style={{ padding: "16px 20px", fontWeight: 800 }}>{p.title}</td>
                  <td style={{ padding: "16px 20px", color: "var(--muted)" }}>{p.type}</td>
                  <td style={{ padding: "16px 20px", color: "#6e8e00", fontWeight: 700 }}>{p.result}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <code style={{ fontSize: "11px", background: "#f0f4f3", padding: "3px 6px", borderRadius: "4px" }}>
                      {p.className || "default"}
                    </code>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject(p);
                          setShowAddForm(false);
                        }}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "#fff",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.title)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid #fca5a5",
                          background: "#fef2f2",
                          color: "#b91c1c",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Submissions Section */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid var(--line)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)", fontWeight: 700, fontSize: "14px" }}>
          Pesan Kontak Masuk ({submissions.length})
        </div>

        {submissions.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
            Belum ada pesan yang masuk.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {submissions.map((sub) => (
              <div
                key={sub.id}
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid var(--line)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "15px" }}>{sub.name}</strong>
                    <span style={{ marginLeft: "10px", color: "var(--muted)", fontSize: "13px" }}>
                      &lt;{sub.email}&gt;
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "99px",
                        background: sub.emailSent ? "#dcfce7" : "#fef3c7",
                        color: sub.emailSent ? "#15803d" : "#b45309",
                      }}
                    >
                      {sub.emailSent ? "✓ Email Terkirim" : "Belum Kirim Email"}
                    </span>
                    <small style={{ color: "var(--muted)", fontSize: "11px" }}>
                      {new Date(sub.createdAt).toLocaleString("id-ID")}
                    </small>
                  </div>
                </div>
                <p style={{ margin: 0, color: "#374151", fontSize: "13px", lineHeight: "1.6" }}>
                  {sub.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
