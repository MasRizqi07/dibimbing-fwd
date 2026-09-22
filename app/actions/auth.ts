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

  // A short global cap also blocks attempts spread across many source IPs.
  // Existing authenticated sessions remain usable while login is limited.
  const portalRateLimit = await consumeDistributedRateLimit(
    "admin-login:portal:attempts",
    100,
    15 * 60 * 1000
  );
  if (!portalRateLimit.allowed) {
    return { error: "Portal sedang membatasi percobaan login. Coba lagi nanti." };
  }

  const isValid = await verifyAdminPassword(password);

  if (!isValid) {
    return { error: "Password salah. Akses ditolak." };
  }

  const totpSecret = process.env.ADMIN_TOTP_SECRET;
  if (totpSecret) {
    const totpCode = formData.get("totpCode");
    const { verifyTOTP } = await import("@/lib/totp");
    if (typeof totpCode !== "string" || !verifyTOTP(totpCode, totpSecret)) {
      return { error: "Kode autentikasi 2FA tidak valid atau kedaluwarsa." };
    }
  }

  await setAdminSessionCookie();
  redirect("/admin");
}

export async function logoutAdminAction() {
  await removeAdminSessionCookie();
  redirect("/admin/login");
}
