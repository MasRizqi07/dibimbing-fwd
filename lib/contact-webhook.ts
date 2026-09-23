import { createHmac } from "node:crypto";
import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 5;
const RETRY_DELAYS_MS = [60_000, 5 * 60_000, 30 * 60_000, 2 * 60 * 60_000];
const LEASE_MS = 60_000;

export async function sendContactWebhook(id: string): Promise<boolean> {
  const url = process.env.NOTIFICATION_WEBHOOK_URL;
  const secret = process.env.NOTIFICATION_WEBHOOK_SECRET;
  if (!url || !secret) return false;

  const now = new Date();
  const claimed = await prisma.contactSubmission.updateMany({
    where: {
      id,
      webhookAttempts: { lt: MAX_ATTEMPTS },
      OR: [
        { webhookStatus: "pending" },
        { webhookStatus: "retryable_failed", webhookNextAttempt: { lte: now } },
        { webhookStatus: "sending", webhookLeaseUntil: { lt: now } },
      ],
    },
    data: {
      webhookStatus: "sending",
      webhookAttempts: { increment: 1 },
      webhookLeaseUntil: new Date(now.getTime() + LEASE_MS),
      webhookNextAttempt: null,
    },
  });
  if (claimed.count === 0) return false;

  const submission = await prisma.contactSubmission.findUniqueOrThrow({ where: { id } });
  const lead = {
      id: submission.id,
      name: submission.name,
      email: submission.email,
      message: submission.message,
      createdAt: submission.createdAt.toISOString(),
  };
  const kind = process.env.NOTIFICATION_WEBHOOK_KIND || "generic";
  const body = JSON.stringify(kind === "slack"
    ? { text: `New Nexa Studio lead: ${lead.name} (${lead.email})\n${lead.message}\nID: ${lead.id}` }
    : kind === "discord"
      ? { content: `New Nexa Studio lead: ${lead.name} (${lead.email})\n${lead.message}\nID: ${lead.id}` }
      : { event: "lead.created", submission: lead });
  const signature = createHmac("sha256", secret).update(body).digest("hex");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": `contact/${submission.id}`,
        "X-Nexa-Signature": `sha256=${signature}`,
      },
      body,
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    if (!response.ok) {
      await scheduleRetry(id, submission.webhookAttempts);
      return false;
    }
    const marked = await prisma.contactSubmission.updateMany({
      where: { id, webhookStatus: "sending", webhookAttempts: submission.webhookAttempts },
      data: { webhookStatus: "sent", webhookLeaseUntil: null, webhookNextAttempt: null },
    });
    return marked.count === 1;
  } catch (error) {
    console.error("contact_webhook_transport_failed", { type: error instanceof Error ? error.name : "unknown" });
    await scheduleRetry(id, submission.webhookAttempts);
    return false;
  }
}

async function scheduleRetry(id: string, attempts: number): Promise<void> {
  const delay = RETRY_DELAYS_MS[attempts - 1];
  await prisma.contactSubmission.updateMany({
    where: { id, webhookStatus: "sending", webhookAttempts: attempts },
    data: {
      webhookStatus: delay ? "retryable_failed" : "failed",
      webhookLeaseUntil: null,
      webhookNextAttempt: delay ? new Date(Date.now() + delay) : null,
    },
  });
}

export async function processPendingWebhooks(limit = 20): Promise<{ attempted: number }> {
  if (!process.env.NOTIFICATION_WEBHOOK_URL || !process.env.NOTIFICATION_WEBHOOK_SECRET) {
    return { attempted: 0 };
  }
  const now = new Date();
  const due = await prisma.contactSubmission.findMany({
    where: {
      webhookAttempts: { lt: MAX_ATTEMPTS },
      OR: [
        { webhookStatus: "pending" },
        { webhookStatus: "retryable_failed", webhookNextAttempt: { lte: now } },
        { webhookStatus: "sending", webhookLeaseUntil: { lt: now } },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: limit,
    select: { id: true },
  });
  for (const { id } of due) await sendContactWebhook(id);
  return { attempted: due.length };
}
