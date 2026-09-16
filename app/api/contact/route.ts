import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { contactFormSchema } from "@/lib/validation";
import { consumeRateLimit, getClientIdentifier } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 32 * 1024;

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, error: "Payload terlalu besar." },
        { status: 413 }
      );
    }

    const rateLimit = consumeRateLimit(
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

    const bodyBuffer = await request.arrayBuffer();
    if (bodyBuffer.byteLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, error: "Payload terlalu besar." },
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

    const { name, email, message, honeypot, renderTime } = validationResult.data;

    if (honeypot && honeypot.length > 0) {
      return NextResponse.json(
        { success: false, error: "Bot submission detected." },
        { status: 400 }
      );
    }

    // Anti-spam Check 2: Minimum submit time check (> 2 seconds)
    if (renderTime && Date.now() - renderTime < 2000) {
      return NextResponse.json(
        {
          success: false,
          error: "Formulir dikirim terlalu cepat. Mohon tunggu beberapa detik.",
        },
        { status: 400 }
      );
    }

    // 1. Save submission to PostgreSQL database
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        message,
        emailSent: false,
      },
    });

    // 2. Dispatch email notification via Resend if configured
    let emailSent = false;
    const recipientEmail = process.env.CONTACT_EMAIL_TO;
    const senderEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    if (resend && recipientEmail) {
      try {
        const { error: resendError } = await resend.emails.send({
          from: senderEmail,
          to: recipientEmail,
          subject: `Pesan Baru dari ${name} — Nexa Studio`,
          replyTo: email,
          text: `Halo Tim Nexa Studio,\n\nAda pesan baru yang masuk melalui website:\n\nNama: ${name}\nEmail: ${email}\nPesan:\n${message}\n\nID Pengiriman: ${submission.id}\nWaktu: ${new Date().toISOString()}`,
        });

        if (!resendError) {
          emailSent = true;
          await prisma.contactSubmission.update({
            where: { id: submission.id },
            data: { emailSent: true },
          });
        } else {
          console.error("Resend API returned error:", resendError);
        }
      } catch (err) {
        console.error("Failed to send email via Resend:", err);
      }
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
