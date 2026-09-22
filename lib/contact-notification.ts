import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

const LEASE_MS = 60_000;
const MAX_ATTEMPTS = 5;
const RETRY_DELAYS_MS = [60_000, 5 * 60_000, 30 * 60_000, 2 * 60 * 60_000];

export async function sendContactNotification(id: string): Promise<boolean> {
  const recipient = process.env.CONTACT_EMAIL_TO;
  if (!resend || !recipient) return false;

  const now = new Date();
  const claimed = await prisma.contactSubmission.updateMany({
    where: {
      id,
      notificationAttempts: { lt: MAX_ATTEMPTS },
      OR: [
        { notificationStatus: "pending" },
        {
          notificationStatus: "retryable_failed",
          notificationNextAttempt: { lte: now },
        },
        {
          notificationStatus: "sending",
          notificationLeaseUntil: { lt: now },
          // Provider idempotency keys are retained for 24 hours. An older
          // ambiguous send needs manual review rather than a blind retry.
          createdAt: { gt: new Date(now.getTime() - 23 * 60 * 60_000) },
        },
      ],
    },
    data: {
      notificationStatus: "sending",
      notificationAttempts: { increment: 1 },
      notificationLeaseUntil: new Date(now.getTime() + LEASE_MS),
      notificationNextAttempt: null,
    },
  });
  if (claimed.count === 0) return false;

  const submission = await prisma.contactSubmission.findUniqueOrThrow({ where: { id } });
  const sender = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  try {
    const result = await resend.emails.send(
      {
        from: sender,
        to: recipient,
        subject: `Pesan Baru dari ${submission.name} — Nexa Studio`,
        replyTo: submission.email,
        text: `Halo Tim Nexa Studio,\n\nAda pesan baru yang masuk melalui website:\n\nNama: ${submission.name}\nEmail: ${submission.email}\nPesan:\n${submission.message}\n\nID Pengiriman: ${submission.id}\nWaktu: ${submission.createdAt.toISOString()}`,
      },
      { idempotencyKey: `contact/${submission.id}` },
    );
    if (result.error) {
      console.error("Contact notification provider error:", result.error.name);
      await scheduleRetry(id, submission.notificationAttempts);
      return false;
    }

    const markedSent = await prisma.contactSubmission.updateMany({
      where: { id, notificationStatus: "sending", notificationAttempts: submission.notificationAttempts },
      data: {
        emailSent: true,
        notificationStatus: "sent",
        notificationLeaseUntil: null,
        notificationNextAttempt: null,
      },
    });
    return markedSent.count === 1;
  } catch (error) {
    console.error("Contact notification transport error:", error instanceof Error ? error.name : "unknown");
    // Delivery may have succeeded before the transport failed. Keep the
    // sending lease so retries stay inside the provider-key window; stale
    // ambiguous sends are moved to review by processPendingNotifications.
    return false;
  }
}

async function scheduleRetry(id: string, attempts: number): Promise<void> {
  const retryDelay = RETRY_DELAYS_MS[attempts - 1];
  await prisma.contactSubmission.updateMany({
    where: { id, notificationStatus: "sending", notificationAttempts: attempts },
    data: {
      notificationStatus: retryDelay ? "retryable_failed" : "failed",
      notificationLeaseUntil: null,
      notificationNextAttempt: retryDelay ? new Date(Date.now() + retryDelay) : null,
    },
  });
}

export async function processPendingNotifications(limit = 20): Promise<{ attempted: number }> {
  const now = new Date();
  await prisma.contactSubmission.updateMany({
    where: {
      notificationStatus: "sending",
      notificationLeaseUntil: { lt: now },
      createdAt: { lte: new Date(now.getTime() - 23 * 60 * 60_000) },
    },
    data: { notificationStatus: "review", notificationLeaseUntil: null },
  });
  const due = await prisma.contactSubmission.findMany({
    where: {
      notificationAttempts: { lt: MAX_ATTEMPTS },
      OR: [
        { notificationStatus: "pending" },
        { notificationStatus: "retryable_failed", notificationNextAttempt: { lte: now } },
        {
          notificationStatus: "sending",
          notificationLeaseUntil: { lt: now },
          createdAt: { gt: new Date(now.getTime() - 23 * 60 * 60_000) },
        },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: limit,
    select: { id: true },
  });

  for (const { id } of due) {
    await sendContactNotification(id);
  }
  return { attempted: due.length };
}
