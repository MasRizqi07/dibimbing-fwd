"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  verifyAdminPassword,
  setAdminSessionCookie,
  removeAdminSessionCookie,
} from "@/lib/admin-session";

export async function loginAdminAction(
  _prevState: { error?: string } | null,
  formData: FormData
) {
  const passwordValue = formData.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!password) {
    return { error: "Password tidak boleh kosong." };
  }

  const requestHeaders = await headers();
  const { consumeDistributedRateLimit, getClientIp } = await import("@/lib/rate-limit");
  const clientKey = getClientIp(requestHeaders);

  // Layer 1: Client IP rate limit (5 attempts / 15 minutes)
  const clientRateLimit = await consumeDistributedRateLimit(
    `admin-login:ip:${clientKey}`,
    5,
    15 * 60 * 1000
  );

  if (!clientRateLimit.allowed) {
    return { error: "Terlalu banyak percobaan login dari perangkat ini. Coba lagi beberapa menit lagi." };
  }

  // Layer 2: Global portal rate limit (25 attempts / 15 minutes across all IPs)
  // Completely prevents bypass via IP rotation / proxy botnets
  const portalRateLimit = await consumeDistributedRateLimit(
    "admin-login:portal:global",
    25,
    15 * 60 * 1000
  );

  if (!portalRateLimit.allowed) {
    return { error: "Portal login sementara dikunci untuk keamanan sistem. Silakan coba lagi nanti." };
  }

  const isValid = await verifyAdminPassword(password);

  if (!isValid) {
    return { error: "Password salah. Akses ditolak." };
  }

  await setAdminSessionCookie();
  redirect("/admin");
}

export async function logoutAdminAction() {
  await removeAdminSessionCookie();
  redirect("/admin/login");
}
