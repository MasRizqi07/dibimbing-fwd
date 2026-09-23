"use client";

import Image from "next/image";
import { useState } from "react";
import { projectAssets } from "@/lib/project-assets";
import type { ProjectItem } from "./types";
import { useLanguage } from "@/lib/i18n/context";

interface Props {
  project?: ProjectItem;
  nextOrder: number;
  pending: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, nextOrder, pending, onSubmit, onCancel }: Props) {
  const { lang } = useLanguage();
  const tr = (id: string, en: string) => lang === "EN" ? en : id;
  const prefix = project ? "edit-project" : "new-project";
  const [selectedImage, setSelectedImage] = useState(project?.imagePath || "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const originalImage = project?.imagePath || "";
  const legacyImage = originalImage && !projectAssets.some((asset) => asset.path === originalImage);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        setUploadError(lang === "ID" && json.error ? json.error : tr("Gagal mengunggah berkas", "Upload failed"));
        return;
      }

      setSelectedImage(json.url);
    } catch {
      setUploadError(tr("Gagal menghubungi server unggahan", "Unable to reach the upload server"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="admin-panel" aria-labelledby={`${prefix}-heading`}>
      <h2 id={`${prefix}-heading`}>{project ? `${tr("Edit Proyek", "Edit Project")}: ${project.title}` : tr("Tambah Proyek Baru", "Add New Project")}</h2>
      <form className="admin-project-form" onSubmit={onSubmit}>
        <div className="admin-field">
          <label htmlFor={`${prefix}-title`}>{tr("Nama Project / Brand *", "Project / Brand Name *")}</label>
          <input id={`${prefix}-title`} name="title" defaultValue={project?.title} required minLength={2} maxLength={120} />
        </div>
        <div className="admin-field">
          <label htmlFor={`${prefix}-type`}>{tr("Tipe / Kategori *", "Type / Category *")}</label>
          <input id={`${prefix}-type`} name="type" defaultValue={project?.type} required minLength={2} maxLength={120} />
        </div>
        <div className="admin-field">
          <label htmlFor={`${prefix}-result`}>{tr("Hasil / Keterangan *", "Result / Description *")}</label>
          <input id={`${prefix}-result`} name="result" defaultValue={project?.result} required minLength={2} maxLength={240} />
        </div>
        <div className="admin-field">
          <label htmlFor={`${prefix}-class`}>{tr("Gaya visual", "Visual Style")}</label>
          <select id={`${prefix}-class`} name="className" defaultValue={project?.className || "project-coffee"}>
            <option value="project-coffee">Kopi / cokelat</option>
            <option value="project-fashion">Fashion / hijau</option>
            <option value="project-wellness">Wellness / hangat</option>
          </select>
        </div>
        <div className="admin-field">
          <label htmlFor={`${prefix}-image`}>{tr("Gambar portfolio yang disetujui", "Portfolio Image")}</label>
          <select id={`${prefix}-image`} name={!project || selectedImage !== originalImage ? "imagePath" : undefined} value={selectedImage} onChange={(event) => setSelectedImage(event.target.value)}>
            <option value="">{tr("Tanpa gambar", "No image")}</option>
            {legacyImage && <option value={originalImage}>{tr("Gambar saat ini (di luar katalog)", "Current image (outside catalog)")}</option>}
            {(selectedImage.startsWith("/uploads/") || selectedImage.startsWith("/api/media/")) && <option value={selectedImage}>{tr("Gambar unggahan", "Uploaded image")} ({selectedImage.split("/").at(-1)})</option>}
            {projectAssets.map((asset) => (
              <option key={asset.path} value={asset.path}>{asset.label}</option>
            ))}
          </select>
          <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <label htmlFor={`${prefix}-file-upload`} style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-muted)" }}>
              {tr("Atau unggah gambar baru (maks. 5 MB):", "Or upload a new image (max. 5 MB):")}
            </label>
            <input
              id={`${prefix}-file-upload`}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ fontSize: "12px" }}
            />
            {uploading && <small style={{ color: "var(--navy)" }}>{tr("Sedang memproses dan memvalidasi berkas...", "Processing and validating the file...")}</small>}
            {uploadError && <small style={{ color: "#d32f2f" }}>{uploadError}</small>}
          </div>
          {selectedImage && (
            <div style={{ marginTop: "10px" }}>
              <Image className="admin-image-preview" src={selectedImage} alt={`${tr("Pratinjau", "Preview")} ${project?.title || tr("project baru", "new project")}`} width={160} height={100} style={{ objectFit: "cover", borderRadius: "8px" }} />
            </div>
          )}
        </div>
        <div className="admin-field">
          <label htmlFor={`${prefix}-order`}>{tr("Urutan tampil", "Display Order")}</label>
          <input id={`${prefix}-order`} name="order" type="number" min="0" max="100000" defaultValue={project?.order ?? nextOrder} />
        </div>
        <div className="admin-form-actions">
          <button type="submit" disabled={pending || uploading} className="button button-lime">
            {pending ? tr("Menyimpan...", "Saving...") : project ? tr("Simpan Perubahan", "Save Changes") : tr("Simpan Project", "Save Project")}
          </button>
          <button type="button" onClick={onCancel} className="button button-outline">{tr("Batal", "Cancel")}</button>
        </div>
      </form>
    </section>
  );
}
