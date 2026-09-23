import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";
import { sendContactWebhook } from "@/lib/contact-webhook";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: { contactSubmission: { updateMany: vi.fn(), findUniqueOrThrow: vi.fn() } },
}));

const fetchMock = vi.fn();
const originalFetch = global.fetch;

describe("durable contact webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NOTIFICATION_WEBHOOK_URL = "https://example.test/leads";
    process.env.NOTIFICATION_WEBHOOK_SECRET = "test-webhook-secret";
    global.fetch = fetchMock;
    vi.mocked(prisma.contactSubmission.updateMany).mockResolvedValue({ count: 1 });
    vi.mocked(prisma.contactSubmission.findUniqueOrThrow).mockResolvedValue({
      id: "lead-1", name: "Ada", email: "ada@example.test", message: "Hello",
      createdAt: new Date("2026-09-22T00:00:00Z"), webhookAttempts: 1,
    } as never);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.NOTIFICATION_WEBHOOK_URL;
    delete process.env.NOTIFICATION_WEBHOOK_SECRET;
  });

  it("does not send when another worker owns the lease", async () => {
    vi.mocked(prisma.contactSubmission.updateMany).mockResolvedValueOnce({ count: 0 });
    expect(await sendContactWebhook("lead-1")).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("signs persisted content and marks a successful delivery", async () => {
    fetchMock.mockResolvedValue({ ok: true });
    expect(await sendContactWebhook("lead-1")).toBe(true);
    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers["Idempotency-Key"]).toBe("contact/lead-1");
    expect(options.headers["X-Nexa-Signature"]).toBe(`sha256=${createHmac("sha256", "test-webhook-secret").update(options.body).digest("hex")}`);
    expect(prisma.contactSubmission.updateMany).toHaveBeenLastCalledWith(expect.objectContaining({
      data: expect.objectContaining({ webhookStatus: "sent" }),
    }));
  });

  it("persists a retry after a failed HTTP response", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503 });
    expect(await sendContactWebhook("lead-1")).toBe(false);
    expect(prisma.contactSubmission.updateMany).toHaveBeenLastCalledWith(expect.objectContaining({
      data: expect.objectContaining({ webhookStatus: "retryable_failed", webhookNextAttempt: expect.any(Date) }),
    }));
  });
});
