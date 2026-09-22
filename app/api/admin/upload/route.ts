import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin-session";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function verifyMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }
  if (mimeType === "image/webp") {
    const riff = buffer.toString("ascii", 0, 4);
    const webp = buffer.toString("ascii", 8, 12);
    return riff === "RIFF" && webp === "WEBP";
  }
  if (mimeType === "image/avif") {
    const ftyp = buffer.toString("ascii", 4, 8);
    return ftyp === "ftyp";
  }

  return false;
}

export async function POST(req: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return NextResponse.json(
        { error: "Unauthorized: Sesi admin tidak valid atau kedaluwarsa." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Permintaan tidak valid: Berkas gambar tidak ditemukan." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran berkas melebihi batas maksimum 5 MB." },
        { status: 400 }
      );
    }

    const ext = ALLOWED_MIME_TYPES.get(file.type);
    if (!ext) {
      return NextResponse.json(
        { error: "Format berkas tidak didukung. Harap unggah JPEG, PNG, WebP, atau AVIF." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!verifyMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: "Integritas berkas gagal diverifikasi (magic bytes tidak sesuai format gambar)." },
        { status: 400 }
      );
    }

    const randomSuffix = crypto.randomBytes(8).toString("hex");
    const filename = `asset-${Date.now()}-${randomSuffix}.${ext}`;
    const destinationPath = path.join(process.cwd(), "public", "uploads", filename);

    await writeFile(destinationPath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("Error handling admin asset upload:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal saat memproses unggahan berkas." },
      { status: 500 }
    );
  }
}

