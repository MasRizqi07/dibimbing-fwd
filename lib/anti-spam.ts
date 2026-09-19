import crypto from "node:crypto";

const ephemeralSecret = crypto.randomBytes(32).toString("hex");
const SECRET = process.env.ADMIN_SESSION_SECRET || ephemeralSecret;

export function generateAntiSpamToken(): string {
  const timestamp = Date.now();
  const payload = Buffer.from(JSON.stringify({ t: timestamp })).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAntiSpamToken(
  token: string | null | undefined,
  minWaitMs = 2000,
  maxAgeMs = 24 * 60 * 60 * 1000
): { valid: boolean; reason?: string } {
  if (!token || typeof token !== "string") {
    return { valid: false, reason: "Token anti-spam tidak ditemukan." };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, reason: "Format token anti-spam tidak valid." };
  }

  const [payload, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");

  if (signature !== expectedSig) {
    return { valid: false, reason: "Tanda tangan token anti-spam tidak valid." };
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    const issuedAt = Number(decoded.t);
    if (!Number.isFinite(issuedAt)) {
      return { valid: false, reason: "Data waktu token tidak valid." };
    }

    const elapsed = Date.now() - issuedAt;

    if (elapsed < minWaitMs) {
      return {
        valid: false,
        reason: "Formulir dikirim terlalu cepat. Mohon tunggu beberapa detik.",
      };
    }

    if (elapsed > maxAgeMs) {
      return {
        valid: false,
        reason: "Sesi formulir sudah kedaluwarsa. Silakan muat ulang halaman.",
      };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: "Payload token rusak." };
  }
}
