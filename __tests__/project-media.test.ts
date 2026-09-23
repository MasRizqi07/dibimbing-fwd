import { describe, expect, it } from "vitest";
import sharp from "sharp";
import { prepareProjectImage } from "@/lib/project-media";

describe("project image processing", () => {
  it("decodes and normalizes a real PNG to WebP", async () => {
    const png = await sharp({ create: { width: 2, height: 2, channels: 4, background: "red" } }).png().toBuffer();
    const output = await prepareProjectImage(new Blob([new Uint8Array(png)], { type: "image/png" }));
    expect((await sharp(output).metadata()).format).toBe("webp");
  });

  it("rejects a forged image payload", async () => {
    await expect(prepareProjectImage(new Blob(["not a png"], { type: "image/png" }))).rejects.toThrow("Berkas gambar");
  });
});
