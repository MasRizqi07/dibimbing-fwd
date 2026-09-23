import crypto from "node:crypto";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const STEP_SECONDS = 30;

function decodeSecret(secret: string): Buffer {
  const normalized = secret.trim().toUpperCase().replace(/=+$/, "");
  if (!/^[A-Z2-7]{16,}$/.test(normalized)) throw new Error("Invalid TOTP secret");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const character of normalized) {
    value = (value << 5) | ALPHABET.indexOf(character);
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
      value &= (1 << bits) - 1;
    }
  }
  return Buffer.from(bytes);
}

function tokenAtStep(key: Buffer, step: number): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const digest = crypto.createHmac("sha1", key).update(counter).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const number = digest.readUInt32BE(offset) & 0x7fffffff;
  return (number % 1_000_000).toString().padStart(6, "0");
}

export function generateTOTP(secret: string, timestampMs = Date.now(), timeStepSec = STEP_SECONDS): string {
  return tokenAtStep(decodeSecret(secret), Math.floor(timestampMs / 1000 / timeStepSec));
}

export function matchTOTP(token: string, secret: string, timestampMs = Date.now(), windowSteps = 1): number | null {
  if (!/^\d{6}$/.test(token) || !Number.isInteger(windowSteps) || windowSteps < 0 || windowSteps > 1) return null;
  const key = decodeSecret(secret);
  const current = Math.floor(timestampMs / 1000 / STEP_SECONDS);
  let matched: number | null = null;
  for (let offset = -windowSteps; offset <= windowSteps; offset++) {
    const step = current + offset;
    if (step < 0) continue;
    const candidate = tokenAtStep(key, step);
    if (crypto.timingSafeEqual(Buffer.from(token), Buffer.from(candidate))) matched = step;
  }
  return matched;
}

export function verifyTOTP(token: string, secret: string, windowSteps = 1): boolean {
  try {
    return matchTOTP(token, secret, Date.now(), windowSteps) !== null;
  } catch {
    return false;
  }
}

