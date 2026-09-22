import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/contact-notification";
import { verifyAntiSpamToken } from "@/lib/anti-spam";
import { createHash } from "node:crypto";

vi.mock("@/lib/prisma", () => ({
  prisma: { contactSubmission: { findUnique: vi.fn(), create: vi.fn() } },
}));
vi.mock("@/lib/rate-limit", () => ({
  getClientIdentifier: () => "test-client",
  consumeDistributedRateLimit: vi.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 0 }),
}));
vi.mock("@/lib/anti-spam", () => ({ verifyAntiSpamToken: vi.fn() }));
vi.mock("@/lib/contact-notification", () => ({ sendContactNotification: vi.fn() }));

const input = {
  name: "Rizqi Pratama",
  email: "rizqi@test.com",
  message: "Halo kami ingin membuat website baru bersama Nexa Studio.",
  honeypot: "",
  antiSpamToken: "test-token",
  idempotencyKey: "dfb321a0-0a3b-42d4-bf32-7bda8bbaf73b",
};

function request(body: unknown): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(verifyAntiSpamToken).mockReturnValue({ valid: true });
    vi.mocked(sendContactNotification).mockResolvedValue(false);
  });

  it("rejects invalid JSON and oversized bodies", async () => {
    const invalid = await POST(new Request("http://localhost/api/contact", { method: "POST", body: "not json" }));
    expect(invalid.status).toBe(400);
    const large = await POST(request({ ...input, message: "x".repeat(33_000) }));
    expect(large.status).toBe(413);
  });

  it("rejects malformed data, honeypot, and missing signed token", async () => {
    expect((await POST(request({ ...input, email: "invalid" }))).status).toBe(400);
    expect((await POST(request({ ...input, honeypot: "spam" }))).status).toBe(400);
    expect((await POST(request({ ...input, antiSpamToken: undefined, renderTime: Date.now() - 5000 }))).status).toBe(400);
    expect(prisma.contactSubmission.create).not.toHaveBeenCalled();
  });

  it("rejects an invalid server token before persistence", async () => {
    vi.mocked(verifyAntiSpamToken).mockReturnValue({ valid: false, reason: "Formulir dikirim terlalu cepat." });
    const response = await POST(request(input));
    expect(response.status).toBe(400);
    expect(prisma.contactSubmission.create).not.toHaveBeenCalled();
  });

  it("persists one submission and reports database acceptance even without email", async () => {
    vi.mocked(prisma.contactSubmission.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.contactSubmission.create).mockResolvedValue({
      id: "saved-1",
      payloadHash: createHash("sha256").update(JSON.stringify({ name: input.name, email: input.email, message: input.message })).digest("hex"),
      emailSent: false,
    } as never);
    const response = await POST(request(input));
    expect(response.status).toBe(200);
    expect((await response.json()).data).toEqual({ id: "saved-1", emailSent: false });
    expect(prisma.contactSubmission.create).toHaveBeenCalledTimes(1);
    expect(sendContactNotification).toHaveBeenCalledWith("saved-1");
  });

  it("rejects reuse of a key for a different payload without notification", async () => {
    vi.mocked(prisma.contactSubmission.findUnique).mockResolvedValue({
      id: "saved-1", payloadHash: "other-payload", emailSent: false,
    } as never);
    const response = await POST(request(input));
    expect(response.status).toBe(409);
    expect(sendContactNotification).not.toHaveBeenCalled();
  });

  it("keeps database acceptance successful when notification rejects", async () => {
    vi.mocked(prisma.contactSubmission.findUnique).mockResolvedValue({
      id: "saved-1",
      payloadHash: createHash("sha256").update(JSON.stringify({ name: input.name, email: input.email, message: input.message })).digest("hex"),
      emailSent: false,
    } as never);
    vi.mocked(sendContactNotification).mockRejectedValue(new Error("temporary transport failure"));
    const response = await POST(request(input));
    expect(response.status).toBe(200);
    expect((await response.json()).data.emailSent).toBe(false);
  });

  it("returns stored response after notification timeout", async () => {
    vi.useFakeTimers();
    try {
      vi.mocked(prisma.contactSubmission.findUnique).mockResolvedValue({
        id: "saved-1",
        payloadHash: createHash("sha256").update(JSON.stringify({ name: input.name, email: input.email, message: input.message })).digest("hex"),
        emailSent: false,
      } as never);
      vi.mocked(sendContactNotification).mockReturnValue(new Promise<boolean>(() => {}));
      const pendingResponse = POST(request(input));
      await vi.advanceTimersByTimeAsync(3100);
      const response = await pendingResponse;
      expect(response.status).toBe(200);
      expect((await response.json()).data.emailSent).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});
