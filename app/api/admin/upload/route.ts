import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin-session";
import { MAX_IMAGE_BYTES, prepareProjectImage, saveProjectImage } from "@/lib/project-media";
import { ImageThreatError } from "@/lib/media-scan";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const MAX_MULTIPART_BYTES = MAX_IMAGE_BYTES + 64 * 1024;

export async function readLimitedFormData(request: Request): Promise<FormData> {
  if (!request.body) throw new Error("Berkas gambar tidak ditemukan.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_MULTIPART_BYTES) {
      await reader.cancel();
      throw new Error("Ukuran unggahan melebihi batas 5 MB.");
    }
    chunks.push(value);
  }
  const body = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), bytes);
  return new Request(request.url, { method: "POST", headers: request.headers, body }).formData();
}

export async function POST(request: Request) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ error: "Sesi admin tidak valid." }, { status: 401 });
  }
  const contentLength = Number(request.headers.get("content-length"));
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) {
    return NextResponse.json({ error: "Gunakan formulir unggahan gambar." }, { status: 415 });
  }
  if (!request.headers.has("content-length") || !Number.isFinite(contentLength) || contentLength <= 0) {
    return NextResponse.json({ error: "Ukuran unggahan harus dinyatakan." }, { status: 411 });
  }
  if (contentLength > MAX_MULTIPART_BYTES) {
    return NextResponse.json({ error: "Ukuran unggahan melebihi batas 5 MB." }, { status: 413 });
  }
  try {
    const file = (await readLimitedFormData(request)).get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Berkas gambar tidak ditemukan." }, { status: 400 });
    }
    const image = await prepareProjectImage(file);
    const url = await saveProjectImage(image);
    return NextResponse.json({ success: true, url, size: image.length, mimeType: "image/webp" }, { status: 201 });
  } catch (error) {
    if (error instanceof ImageThreatError || (error instanceof Error && (error.message.startsWith("Gunakan gambar") || error.message.startsWith("Berkas gambar") || error.message.startsWith("Ukuran unggahan")))) {
      return NextResponse.json({ error: error.message }, { status: error.message.startsWith("Ukuran unggahan") ? 413 : 400 });
    }
    console.error("project_media_upload_failed", { type: error instanceof Error ? error.name : "unknown" });
    return NextResponse.json({ error: "Penyimpanan gambar belum tersedia." }, { status: 503 });
  }
}
