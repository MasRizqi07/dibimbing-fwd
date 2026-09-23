import { cookies } from "next/headers";
import type { Locale } from "./types";

export async function getRequestLocale(): Promise<Locale> {
  return (await cookies()).get("nexa_locale")?.value === "EN" ? "EN" : "ID";
}
