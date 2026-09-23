import { randomUUID } from "node:crypto";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { scanProjectImage } from "@/lib/media-scan";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 24_000_000;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const keyPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.webp$/i;

function storage() {
  const bucket = process.env.PROJECT_MEDIA_BUCKET;
  if (!bucket) throw new Error("PROJECT_MEDIA_BUCKET is not configured");
  const endpoint = process.env.PROJECT_MEDIA_ENDPOINT;
  const accessKeyId = process.env.PROJECT_MEDIA_ACCESS_KEY_ID;
  const secretAccessKey = process.env.PROJECT_MEDIA_SECRET_ACCESS_KEY;
  if (endpoint && (!accessKeyId || !secretAccessKey)) {
    throw new Error("S3-compatible endpoint requires access credentials");
  }
  return {
    bucket,
    client: new S3Client({
      region: process.env.PROJECT_MEDIA_REGION || "us-east-1",
      ...(endpoint ? { endpoint, forcePathStyle: true, credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! } } : {}),
    }),
  };
}

export async function prepareProjectImage(file: Blob): Promise<Buffer> {
  if (!allowedTypes.has(file.type) || file.size === 0 || file.size > MAX_IMAGE_BYTES) {
    throw new Error("Gunakan gambar JPEG, PNG, WebP, atau AVIF berukuran maksimal 5 MB.");
  }
  const input = Buffer.from(await file.arrayBuffer());
  await scanProjectImage(input);
  let output: Buffer;
  try {
    const pipeline = sharp(input, { limitInputPixels: MAX_IMAGE_PIXELS, failOn: "error" });
    const metadata = await pipeline.metadata();
    const expectedFormat = file.type.slice("image/".length);
    if (metadata.format !== expectedFormat || !metadata.width || !metadata.height) {
      throw new Error("Format gambar tidak sesuai dengan isi berkas.");
    }
    // Re-encoding drops metadata and any trailing payload before publication.
    output = await pipeline.rotate().webp({ quality: 82 }).toBuffer();
    if (output.length > MAX_IMAGE_BYTES) throw new Error("Output image too large");
  } catch {
    throw new Error("Berkas gambar tidak valid atau tidak dapat diproses.");
  }
  await scanProjectImage(output);
  return output;
}

export async function saveProjectImage(image: Buffer): Promise<string> {
  const { bucket, client } = storage();
  const filename = `${randomUUID()}.webp`;
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: `projects/${filename}`,
    Body: image,
    ContentType: "image/webp",
    CacheControl: "public, max-age=31536000, immutable",
  }));
  return `/api/media/${filename}`;
}

export async function readProjectImage(filename: string) {
  if (!keyPattern.test(filename)) return null;
  const { bucket, client } = storage();
  return client.send(new GetObjectCommand({ Bucket: bucket, Key: `projects/${filename}` }));
}
