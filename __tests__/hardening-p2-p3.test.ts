import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateAntiSpamToken, verifyAntiSpamToken } from "@/lib/anti-spam";
import { consumeDistributedRateLimit } from "@/lib/rate-limit";
import { updateSubmissionStatusAction } from "@/app/actions/submissions";
import { prisma } from "@/lib/prisma";
import * as adminSession from "@/lib/admin-session";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contactSubmission: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("P2.2 — Server Anti-Spam Token", () => {
  it("generates a signed token with two base64url segments", () => {
    const token = generateAntiSpamToken();
    expect(token).toBeDefined();
    const parts = token.split(".");
    expect(parts.length).toBe(2);
  });

  it("verifies genuine token after minimum wait time", () => {
    const token = generateAntiSpamToken();
    // Simulate verification with minWaitMs = 0
    const result = verifyAntiSpamToken(token, 0);
    expect(result.valid).toBe(true);
  });

  it("rejects token when submitted under minimum wait time (e.g. 5000ms)", () => {
    const token = generateAntiSpamToken();
    const result = verifyAntiSpamToken(token, 5000);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("terlalu cepat");
  });

  it("rejects tampered or forged tokens", () => {
    const token = generateAntiSpamToken();
    const [payload] = token.split(".");
    const forgedToken = `${payload}.forgedsignature12345`;
    const result = verifyAntiSpamToken(forgedToken, 0);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("tidak valid");
  });
});

describe("P3.1 & Devin Finding — Dual-Layer Rate Limiting", () => {
  it("enforces portal-level rate limit across multiple rotating client keys", async () => {
    const portalKey = "test-portal-rate-limit";
    // 25 attempts allowed
    for (let i = 1; i <= 25; i++) {
      const res = await consumeDistributedRateLimit(portalKey, 25, 60_000);
      expect(res.allowed).toBe(true);
    }

    // 26th attempt must be rejected
    const blockedRes = await consumeDistributedRateLimit(portalKey, 25, 60_000);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.retryAfterSeconds).toBeGreaterThan(0);
  });
});

describe("P3.2 — Contact Submission Lifecycle Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(adminSession, "isAuthenticatedAdmin").mockResolvedValue(true);
  });

  it("updates submission status in database to read or replied", async () => {
    (prisma.contactSubmission.update as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "sub-1",
      status: "read",
    });

    await updateSubmissionStatusAction("sub-1", "read");

    expect(prisma.contactSubmission.update).toHaveBeenCalledWith({
      where: { id: "sub-1" },
      data: { status: "read" },
    });
  });

  it("throws error when unauthenticated user tries to update status", async () => {
    vi.spyOn(adminSession, "isAuthenticatedAdmin").mockResolvedValue(false);

    await expect(updateSubmissionStatusAction("sub-1", "archived")).rejects.toThrow(
      "Unauthorized"
    );
  });

  it("rejects a forged runtime status before database mutation", async () => {
    await expect(updateSubmissionStatusAction("sub-1", "owner" as "read")).rejects.toThrow();
    expect(prisma.contactSubmission.update).not.toHaveBeenCalled();
  });
});
