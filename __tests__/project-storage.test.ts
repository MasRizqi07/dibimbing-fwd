import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const aws = vi.hoisted(() => ({ send: vi.fn(), clients: [] as unknown[] }));
vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: class {
    constructor(config: unknown) { aws.clients.push(config); }
    send(command: unknown) { return aws.send(command); }
  },
  PutObjectCommand: class { constructor(public input: unknown) {} },
  GetObjectCommand: class { constructor(public input: unknown) {} },
}));
vi.mock("@/lib/media-scan", () => ({ scanProjectImage: vi.fn(), ImageThreatError: class extends Error {} }));

import { saveProjectImage } from "@/lib/project-media";

const variableNames = [
  "PROJECT_MEDIA_BUCKET", "PROJECT_MEDIA_REGION", "PROJECT_MEDIA_ENDPOINT",
  "PROJECT_MEDIA_ACCESS_KEY_ID", "PROJECT_MEDIA_SECRET_ACCESS_KEY",
] as const;

describe("project object storage", () => {
  beforeEach(() => {
    aws.send.mockReset().mockResolvedValue({});
    aws.clients.length = 0;
    for (const name of variableNames) delete process.env[name];
  });
  afterEach(() => {
    for (const name of variableNames) delete process.env[name];
  });

  it("fails clearly when the bucket is not configured", async () => {
    await expect(saveProjectImage(Buffer.from("image"))).rejects.toThrow("PROJECT_MEDIA_BUCKET");
  });

  it("writes a private normalized object through the configured S3-compatible client", async () => {
    process.env.PROJECT_MEDIA_BUCKET = "portfolio";
    process.env.PROJECT_MEDIA_REGION = "ap-southeast-1";
    const url = await saveProjectImage(Buffer.from("webp"));
    expect(url).toMatch(/^\/api\/media\/[0-9a-f-]+\.webp$/);
    expect(aws.send).toHaveBeenCalledOnce();
    const command = aws.send.mock.calls[0][0] as { input: Record<string, unknown> };
    expect(command.input).toMatchObject({ Bucket: "portfolio", ContentType: "image/webp" });
    expect(command.input.Key).toMatch(/^projects\/[0-9a-f-]+\.webp$/);
  });

  it("requires explicit credentials for a custom endpoint", async () => {
    process.env.PROJECT_MEDIA_BUCKET = "portfolio";
    process.env.PROJECT_MEDIA_ENDPOINT = "https://storage.example.test";
    await expect(saveProjectImage(Buffer.from("webp"))).rejects.toThrow("requires access credentials");
  });
});
