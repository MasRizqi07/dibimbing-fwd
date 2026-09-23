import { describe, expect, it } from "vitest";
import { readLimitedFormData } from "@/app/api/admin/upload/route";

describe("upload multipart byte limit", () => {
  it("rejects actual bytes beyond the limit even when the declared length is small", async () => {
    const oversized = new Uint8Array(5 * 1024 * 1024 + 64 * 1024 + 1);
    const request = new Request("http://localhost/api/admin/upload", {
      method: "POST",
      headers: { "content-type": "multipart/form-data; boundary=sample", "content-length": "1" },
      body: oversized,
    });
    await expect(readLimitedFormData(request)).rejects.toThrow("Ukuran unggahan melebihi batas 5 MB.");
  });
});
