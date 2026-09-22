import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { isIsolatedE2ERuntime } from "@/lib/e2e-runtime";

const COOKIE_NAME = "nexa_admin_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds
const developmentSecret = `nexa-dev-${crypto.randomUUID()}`;

function getSecretKey(): string {
  const configuredSecret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be configured in production.");
  }

  return developmentSecret;
}

// Universal Web Crypto HMAC-SHA256 (supported on Edge and Node)
async function signMessage(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const timestamp = Date.now().toString();
  const signature = await signMessage(timestamp, getSecretKey());
  return `${timestamp}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) return false;

  const now = Date.now();
  const maxAgeMs = SESSION_MAX_AGE * 1000;

  if (timestamp > now || now - timestamp > maxAgeMs) {
    return false;
  }

  const expectedSignature = await signMessage(timestampStr, getSecretKey());
  return signature === expectedSignature;
}

export async function verifyAdminPassword(passwordInput: string): Promise<boolean> {
  const adminPassword = isIsolatedE2ERuntime()
    ? process.env.E2E_ADMIN_PASSWORD_HASH
    : process.env.ADMIN_PASSWORD;
  if (!adminPassword || !passwordInput) return false;

  if (/^\$2[aby]\$\d{2}\$/.test(adminPassword)) {
    return bcrypt.compare(passwordInput, adminPassword);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_PASSWORD must be a bcrypt hash in production.");
  }

  return passwordInput === adminPassword;
}

export async function setAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const token = await createSessionToken();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function removeAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie?.value) return false;
  return verifySessionToken(sessionCookie.value);
}

export { COOKIE_NAME };
