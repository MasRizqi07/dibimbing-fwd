import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { contactFormSchema } from "@/lib/validation";
import { consumeDistributedRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { verifyAntiSpamToken } from "@/lib/anti-spam";

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

    const { name, email, message, honeypot, renderTime, antiSpamToken, idempotencyKey } =
      validationResult.data;

    if (honeypot && honeypot.length > 0) {
      return NextResponse.json(
        { success: false, error: "Bot submission detected." },
        { status: 400 }
      );
    }

    // Anti-spam Verification
    if (antiSpamToken) {
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
    } else if (renderTime && Date.now() - renderTime < 2000) {
      // Fallback for legacy clients / tests
      return NextResponse.json(
        {
          success: false,
          error: "Formulir dikirim terlalu cepat. Mohon tunggu beberapa detik.",
        },
        { status: 400 }
      );
    }

    // Idempotency: Check if this submission has already been processed
    if (idempotencyKey) {
      const existing = await prisma.contactSubmission.findUnique({
        where: { idempotencyKey },
      });
      if (existing) {
        return NextResponse.json(
          {
            success: true,
            message: "Terima kasih! Pesan Anda telah kami terima dan akan segera kami balas.",
            data: {
              id: existing.id,
              emailSent: existing.emailSent,
            },
          },
          { status: 200 }
        );
      }
    }

    // 1. Save submission to database with status 'new' and idempotencyKey
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        message,
        status: "new",
        idempotencyKey: idempotencyKey || null,
        emailSent: false,
      },
    });

    // 2. Dispatch email notification via Resend if configured (with 3s timeout protection)
    let emailSent = false;
    const recipientEmail = process.env.CONTACT_EMAIL_TO;
    const senderEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    if (resend && recipientEmail) {
      const sendEmailPromise = resend.emails
        .send({
          from: senderEmail,
          to: recipientEmail,
          subject: `Pesan Baru dari ${name} — Nexa Studio`,
          replyTo: email,
          text: `Halo Tim Nexa Studio,\n\nAda pesan baru yang masuk melalui website:\n\nNama: ${name}\nEmail: ${email}\nPesan:\n${message}\n\nID Pengiriman: ${submission.id}\nWaktu: ${new Date().toISOString()}`,
        })
        .then(async (result) => {
          if (!result.error) {
            await prisma.contactSubmission.update({
              where: { id: submission.id },
              data: { emailSent: true },
            });
            return true;
          }
          console.error("Resend API returned error:", result.error);
          return false;
        })
        .catch((err) => {
          console.error("Failed to send email via Resend:", err);
          return false;
        });

      const timeoutPromise = new Promise<false>((resolve) =>
        setTimeout(() => resolve(false), 3000)
      );

      emailSent = await Promise.race([sendEmailPromise, timeoutPromise]);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Terima kasih! Pesan Anda telah kami terima dan akan segera kami balas.",
        data: {
          id: submission.id,
          emailSent,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
