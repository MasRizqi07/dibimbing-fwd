"use client";

import Image from "next/image";
import { useState } from "react";
import { projectAssets } from "@/lib/project-assets";
import type { ProjectItem } from "./types";

interface Props {
  project?: ProjectItem;
  nextOrder: number;
  pending: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, nextOrder, pending, onSubmit, onCancel }: Props) {
  const prefix = project ? "edit-project" : "new-project";
  const [selectedImage, setSelectedImage] = useState(project?.imagePath || "");
  const originalImage = project?.imagePath || "";
  const legacyImage = originalImage && !projectAssets.some((asset) => asset.path === originalImage);
  return (
    <section className="admin-panel" aria-labelledby={`${prefix}-heading`}>
      <h2 id={`${prefix}-heading`}>{project ? `Edit Project: ${project.title}` : "Tambah Project Baru"}</h2>
      <form className="admin-project-form" onSubmit={onSubmit}>
        <div className="admin-field">
          <label htmlFor={`${prefix}-title`}>Nama Project / Brand *</label>
          <input id={`${prefix}-title`} name="title" defaultValue={project?.title} required minLength={2} maxLength={120} />
        </div>
        <div className="admin-field">
          <label htmlFor={`${prefix}-type`}>Tipe / Kategori *</label>
          <input id={`${prefix}-type`} name="type" defaultValue={project?.type} required minLength={2} maxLength={120} />
        </div>
        <div className="admin-field">
          <label htmlFor={`${prefix}-result`}>Hasil / Keterangan *</label>
          <input id={`${prefix}-result`} name="result" defaultValue={project?.result} required minLength={2} maxLength={240} />
        </div>
        <div className="admin-field">
          <label htmlFor={`${prefix}-class`}>Gaya visual</label>
          <select id={`${prefix}-class`} name="className" defaultValue={project?.className || "project-coffee"}>
            <option value="project-coffee">Kopi / cokelat</option>
            <option value="project-fashion">Fashion / hijau</option>
            <option value="project-wellness">Wellness / hangat</option>
          </select>
        </div>
        <div className="admin-field">
          <label htmlFor={`${prefix}-image`}>Gambar portfolio yang disetujui</label>
          <select id={`${prefix}-image`} name={!project || selectedImage !== originalImage ? "imagePath" : undefined} value={selectedImage} onChange={(event) => setSelectedImage(event.target.value)}>
            <option value="">Tanpa gambar</option>
            {legacyImage && <option value={originalImage}>Gambar saat ini (di luar katalog)</option>}
            {projectAssets.map((asset) => (
              <option key={asset.path} value={asset.path}>{asset.label}</option>
            ))}
          </select>
          <small>Gunakan hanya aset yang telah direview. Upload baru belum tersedia.</small>
          {selectedImage && projectAssets.some((asset) => asset.path === selectedImage) && (
            <Image className="admin-image-preview" src={selectedImage} alt={`Pratinjau ${project?.title || "project baru"}`} width={160} height={100} />
          )}
        </div>
        <div className="admin-field">
          <label htmlFor={`${prefix}-order`}>Urutan tampil</label>
          <input id={`${prefix}-order`} name="order" type="number" min="0" max="100000" defaultValue={project?.order ?? nextOrder} />
        </div>
        <div className="admin-form-actions">
          <button type="submit" disabled={pending} className="button button-lime">
            {pending ? "Menyimpan..." : project ? "Simpan Perubahan" : "Simpan Project"}
          </button>
          <button type="button" onClick={onCancel} className="button button-outline">Batal</button>
        </div>
      </form>
    </section>
  );
}
