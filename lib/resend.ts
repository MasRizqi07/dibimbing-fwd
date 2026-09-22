import { Resend } from "resend";
import { isIsolatedE2ERuntime } from "@/lib/e2e-runtime";

export const resend = isIsolatedE2ERuntime() || !process.env.RESEND_API_KEY
  ? null
  : new Resend(process.env.RESEND_API_KEY);
