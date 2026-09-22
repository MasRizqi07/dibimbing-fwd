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

  // Layer 1: Client IP rate limit (5 attempts / 15 minutes per client IP)
  const clientRateLimit = await consumeDistributedRateLimit(
    `admin-login:ip:${clientKey}`,
    5,
    15 * 60 * 1000
  );

  if (!clientRateLimit.allowed) {
    return { error: "Terlalu banyak percobaan login dari perangkat ini. Coba lagi beberapa menit lagi." };
  }

  // A short global cap protects the single owner account when requests come
  // from many addresses. Existing authenticated sessions remain usable.
  const portalRateLimit = await consumeDistributedRateLimit(
    "admin-login:portal:attempts",
    100,
    15 * 60 * 1000
  );
  const isValid = await verifyAdminPassword(password);

  if (!isValid) {
    return { error: portalRateLimit.allowed ? "Password salah. Akses ditolak." : "Portal sedang membatasi percobaan login. Coba lagi nanti." };
  }

  await setAdminSessionCookie();
  redirect("/admin");
}

export async function logoutAdminAction() {
  await removeAdminSessionCookie();
  redirect("/admin/login");
}
