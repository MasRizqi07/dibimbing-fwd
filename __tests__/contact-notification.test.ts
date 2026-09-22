import { beforeEach, describe, expect, it, vi } from "vitest";
import { processPendingNotifications, sendContactNotification } from "@/lib/contact-notification";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

vi.mock("@/lib/prisma", () => ({
  prisma: { contactSubmission: { updateMany: vi.fn(), findUniqueOrThrow: vi.fn(), findMany: vi.fn() } },
}));
vi.mock("@/lib/resend", () => ({ resend: { emails: { send: vi.fn() } } }));

const saved = {
  id: "saved-1", name: "Original Name", email: "original@example.test",
  message: "Original database message", createdAt: new Date("2026-09-21T00:00:00Z"),
  notificationAttempts: 1,
};

describe("contact notification lease", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CONTACT_EMAIL_TO = "inbox@example.test";
    vi.mocked(prisma.contactSubmission.updateMany).mockResolvedValue({ count: 1 });
    vi.mocked(prisma.contactSubmission.findUniqueOrThrow).mockResolvedValue(saved as never);
  });

  it("does not send when another worker owns the lease", async () => {
    vi.mocked(prisma.contactSubmission.updateMany).mockResolvedValueOnce({ count: 0 });
    expect(await sendContactNotification(saved.id)).toBe(false);
    expect(resend!.emails.send).not.toHaveBeenCalled();
  });

  it("sends persisted content with a stable provider key and marks sent", async () => {
    vi.mocked(resend!.emails.send).mockResolvedValue({ data: { id: "mail-1" }, error: null } as never);
    expect(await sendContactNotification(saved.id)).toBe(true);
    expect(resend!.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({ replyTo: saved.email, text: expect.stringContaining(saved.message) }),
      { idempotencyKey: "contact/saved-1" },
    );
    expect(prisma.contactSubmission.updateMany).toHaveBeenLastCalledWith(expect.objectContaining({
      where: { id: saved.id, notificationStatus: "sending", notificationAttempts: 1 },
      data: expect.objectContaining({ notificationStatus: "sent", emailSent: true }),
    }));
  });

  it("schedules a retry after provider failure without claiming delivery", async () => {
    vi.mocked(resend!.emails.send).mockResolvedValue({ data: null, error: { name: "test-error" } } as never);
    expect(await sendContactNotification(saved.id)).toBe(false);
    expect(prisma.contactSubmission.updateMany).toHaveBeenLastCalledWith(expect.objectContaining({
      data: expect.objectContaining({ notificationStatus: "retryable_failed", notificationNextAttempt: expect.any(Date) }),
    }));
  });

  it("keeps an ambiguous transport failure in sending for guarded retry", async () => {
    vi.mocked(resend!.emails.send).mockRejectedValue(new Error("response lost"));
    expect(await sendContactNotification(saved.id)).toBe(false);
    expect(prisma.contactSubmission.updateMany).toHaveBeenCalledTimes(1);
    expect(prisma.contactSubmission.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ notificationStatus: "sending" }),
    }));
  });

  it("moves an old ambiguous send to manual review", async () => {
    vi.mocked(prisma.contactSubmission.findMany).mockResolvedValue([]);
    await processPendingNotifications();
    expect(prisma.contactSubmission.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ notificationStatus: "sending" }),
      data: { notificationStatus: "review", notificationLeaseUntil: null },
    }));
  });
});
