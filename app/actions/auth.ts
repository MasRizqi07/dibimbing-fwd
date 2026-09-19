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
  const { consumeRateLimit, getClientIp } = await import("@/lib/rate-limit");
  const clientKey = getClientIp(requestHeaders);
  const rateLimit = consumeRateLimit(`admin-login:${clientKey}`, 5, 15 * 60 * 1000);

  if (!rateLimit.allowed) {
    return { error: "Terlalu banyak percobaan login. Coba lagi beberapa menit lagi." };
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
