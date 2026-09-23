import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { contactFormSchema } from "@/lib/validation";
import { consumeDistributedRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { verifyAntiSpamToken } from "@/lib/anti-spam";
import { sendContactNotification } from "@/lib/contact-notification";

const MAX_BODY_BYTES = 32 * 1024;

async function readBodyWithLimit(
  request: Request,
  maxBytes: number
): Promise<{ buffer?: Uint8Array; error?: string }> {
  if (!request.body) {
    return { buffer: new Uint8Array(0) };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel();
          return { error: "Payload terlalu besar." };
        }
        chunks.push(value);
      }
    }
  } catch {
    return { error: "Gagal membaca stream request." };
  }

  const combined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { buffer: combined };
}

export async function POST(request: Request) {
  const startedAt = performance.now();
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, error: "Payload terlalu besar." },
        { status: 413 }
      );
    }

    const rateLimit = await consumeDistributedRateLimit(
      `contact:${getClientIdentifier(request)}`,
      5,
      15 * 60 * 1000
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak percobaan. Coba lagi nanti." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const { buffer: bodyBuffer, error: readError } = await readBodyWithLimit(
      request,
      MAX_BODY_BYTES
    );

    if (readError || !bodyBuffer) {
      return NextResponse.json(
        { success: false, error: readError || "Payload terlalu besar." },
        { status: 413 }
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(new TextDecoder().decode(bodyBuffer));
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    if (
      typeof body === "object" &&
      body !== null &&
      "honeypot" in body &&
      typeof body.honeypot === "string" &&
      body.honeypot.trim().length > 0
    ) {
      return NextResponse.json(
        { success: false, error: "Bot submission detected." },
        { status: 400 }
      );
    }

    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          error: "Validasi gagal. Periksa kembali data yang dimasukkan.",
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, message, honeypot, antiSpamToken, idempotencyKey } =
      validationResult.data;

    if (honeypot && honeypot.length > 0) {
      return NextResponse.json(
        { success: false, error: "Bot submission detected." },
        { status: 400 }
      );
    }

    const antiSpamCheck = verifyAntiSpamToken(antiSpamToken);
    if (!antiSpamCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          error: antiSpamCheck.reason || "Validasi anti-spam gagal.",
        },
        { status: 400 }
      );
    }

    const payloadHash = createHash("sha256")
      .update(JSON.stringify({ name, email, message }))
      .digest("hex");
    let submission = await prisma.contactSubmission.findUnique({
      where: { idempotencyKey },
    });

    if (!submission) {
      try {
        submission = await prisma.contactSubmission.create({
          data: {
            name,
            email,
            message,
            status: "new",
            idempotencyKey,
            payloadHash,
            emailSent: false,
            webhookStatus: process.env.NOTIFICATION_WEBHOOK_URL && process.env.NOTIFICATION_WEBHOOK_SECRET ? "pending" : "disabled",
          },
        });
      } catch (err: unknown) {
        // Catch concurrent race condition where another request created row with same key
        if (
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          err.code === "P2002" &&
          idempotencyKey
        ) {
          const winner = await prisma.contactSubmission.findUnique({
            where: { idempotencyKey },
          });
          if (winner) {
            submission = winner;
          } else {
            throw err;
          }
        } else {
          throw err;
        }
      }
    }

    if (submission.payloadHash !== payloadHash) {
      return NextResponse.json(
        { success: false, error: "Kunci pengiriman sudah dipakai untuk pesan yang berbeda." },
        { status: 409 },
      );
    }

    // The database row is the source of truth for email content. The lease and
    // provider idempotency key protect retries across concurrent requests.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const emailSent = submission.emailSent || await Promise.race([
      sendContactNotification(submission.id).catch((error: unknown) => {
        console.error("contact_notification_failed", { type: error instanceof Error ? error.name : "unknown" });
        return false;
      }),
      new Promise<false>((resolve) => {
        timer = setTimeout(() => resolve(false), 3000);
      }),
    ]);
    if (timer) clearTimeout(timer);

    return NextResponse.json(
      {
        success: true,
        message: "Terima kasih! Pesan Anda telah kami terima.",
        data: {
          id: submission.id,
          emailSent,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("contact_request_failed", { type: error instanceof Error ? error.name : "unknown" });
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server. Silakan coba lagi nanti." },
      { status: 500 }
    );
  } finally {
    console.info("contact_request_duration", { durationMs: Math.round(performance.now() - startedAt) });
  }
}
