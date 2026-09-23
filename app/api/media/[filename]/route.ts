import { readProjectImage } from "@/lib/project-media";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ filename: string }> }) {
  const { filename } = await context.params;
  try {
    const object = await readProjectImage(filename);
    if (!object?.Body) return new Response("Not found", { status: 404 });
    return new Response(object.Body.transformToWebStream() as ReadableStream, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof Error && (error.name === "NoSuchKey" || error.name === "NotFound")) {
      return new Response("Not found", { status: 404 });
    }
    console.error("project_media_read_failed", { type: error instanceof Error ? error.name : "unknown" });
    return new Response("Media unavailable", { status: 503 });
  }
}
