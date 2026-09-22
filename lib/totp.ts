import crypto from "crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32ToBuffer(base32: string): Buffer {
  const cleaned = base32.toUpperCase().replace(/[\s=-]/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < cleaned.length; i++) {
    const val = BASE32_ALPHABET.indexOf(cleaned[i]);
    if (val === -1) continue;

    value = (value << 5) | val;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

export function generateTOTP(secret: string, timestampMs = Date.now(), timeStepSec = 30): string {
  const key = /^[A-Z2-7]+=*$/i.test(secret) ? base32ToBuffer(secret) : Buffer.from(secret, "utf-8");
  const counter = Math.floor(timestampMs / 1000 / timeStepSec);

  const counterBuf = Buffer.alloc(8);
  counterBuf.writeBigInt64BE(BigInt(counter));

  const hmac = crypto.createHmac("sha1", key);
  hmac.update(counterBuf);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0x0f;
  const binaryCode =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = binaryCode % 1_000_000;
  return otp.toString().padStart(6, "0");
}

export function verifyTOTP(token: string, secret: string, windowSteps = 1): boolean {
  if (!token || !secret) return false;
  const cleanToken = token.trim();
  if (!/^\d{6}$/.test(cleanToken)) return false;

  const now = Date.now();
  const stepMs = 30 * 1000;

  for (let i = -windowSteps; i <= windowSteps; i++) {
    const candidate = generateTOTP(secret, now + i * stepMs);
    if (crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(cleanToken))) {
      return true;
    }
  }

  return false;
}

