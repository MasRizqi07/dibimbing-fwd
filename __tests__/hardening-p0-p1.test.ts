import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClientIp, consumeRateLimit } from "@/lib/rate-limit";
import { updateProjectAction } from "@/app/actions/projects";
import { prisma } from "@/lib/prisma";
import * as adminSession from "@/lib/admin-session";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    project: {
      update: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("P0.2 — Anti-Spoofing Client IP & Rate Limiter", () => {
  beforeEach(() => { delete process.env.TRUSTED_PROXY_IP_HEADER; delete process.env.VERCEL; });

  it("ignores caller supplied IP headers without a trusted proxy", () => {
    const headers = new Headers({
      "x-forwarded-for": "198.51.100.1, 198.51.100.2",
      "x-real-ip": "203.0.113.50",
    });

    expect(getClientIp(headers)).toBe("unknown");
  });

  it("uses only the configured proxy header after validating IP syntax", () => {
    process.env.TRUSTED_PROXY_IP_HEADER = "x-real-ip";
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.99",
      "x-real-ip": "203.0.113.50",
    });
    expect(getClientIp(headers)).toBe("203.0.113.50");
    headers.set("x-real-ip", "spoofed.invalid");
    expect(getClientIp(headers)).toBe("unknown");
  });

  it("should block brute-force attempts even when attacker rotates first x-forwarded-for hop", () => {
    process.env.TRUSTED_PROXY_IP_HEADER = "x-real-ip";
    const trueClientIp = "198.51.100.88";
    const keyPrefix = "test-admin-login";

    // Simulate 5 attempts with different spoofed first IPs but same real edge IP
    for (let i = 1; i <= 5; i++) {
      const headers = new Headers({
        "x-forwarded-for": `spoofed-${i}.evil.com`,
        "x-real-ip": trueClientIp,
      });
      const clientIp = getClientIp(headers);
      const res = consumeRateLimit(`${keyPrefix}:${clientIp}`, 5, 60_000);
      expect(res.allowed).toBe(true);
    }

    // 6th attempt should be blocked
    const blockedHeaders = new Headers({
      "x-forwarded-for": "spoofed-another.evil.com",
      "x-real-ip": trueClientIp,
    });
    const blockedIp = getClientIp(blockedHeaders);
    const blockedRes = consumeRateLimit(`${keyPrefix}:${blockedIp}`, 5, 60_000);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.retryAfterSeconds).toBeGreaterThan(0);
  });
});

describe("P1.1 — Project Update Image Preservation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(adminSession, "isAuthenticatedAdmin").mockResolvedValue(true);
  });

  it("should retain existing imagePath when updating title without imagePath in formData", async () => {
    const formData = new FormData();
    formData.set("title", "Kopi Koma Updated");
    formData.set("type", "F&B · Branding");
    formData.set("result", "+45% sales");
    formData.set("className", "project-coffee");
    formData.set("order", "1");
    // Notice: imagePath is NOT set in formData

    await updateProjectAction("proj-123", formData);

    expect(prisma.project.update).toHaveBeenCalledTimes(1);
    const updateArgs = (prisma.project.update as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(updateArgs.where).toEqual({ id: "proj-123" });
    // imagePath must NOT be present in update payload, ensuring DB value is preserved
    expect(updateArgs.data.imagePath).toBeUndefined();
    expect(updateArgs.data.title).toBe("Kopi Koma Updated");
  });

  it("should preserve existing imagePath when sent via hidden form input", async () => {
    const formData = new FormData();
    formData.set("title", "Kopi Koma Title Change");
    formData.set("type", "F&B · Branding");
    formData.set("result", "+45% sales");
    formData.set("className", "project-coffee");
    formData.set("order", "1");
    formData.set("imagePath", "/projects/kopi-koma.jpg");

    await updateProjectAction("proj-123", formData);

    expect(prisma.project.update).toHaveBeenCalledTimes(1);
    const updateArgs = (prisma.project.update as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(updateArgs.data.imagePath).toBe("/projects/kopi-koma.jpg");
  });
});
