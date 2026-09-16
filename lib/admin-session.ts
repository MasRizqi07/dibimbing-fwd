import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "nexa_admin_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "nexa-studio-admin-fallback-session-secret-key"
  );
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

  // Check 7-day expiration
  if (Date.now() - timestamp > SESSION_MAX_AGE * 1000) {
    return false;
  }

  const expectedSignature = await signMessage(timestampStr, getSecretKey());
  return signature === expectedSignature;
}

export async function verifyAdminPassword(passwordInput: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !passwordInput) return false;

  if (adminPassword.startsWith("$2a$") || adminPassword.startsWith("$2b$")) {
    return bcrypt.compare(passwordInput, adminPassword);
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
