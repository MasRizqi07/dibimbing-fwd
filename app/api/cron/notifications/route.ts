import { timingSafeEqual } from "node:crypto";
import { processPendingNotifications } from "@/lib/contact-notification";
import { processPendingWebhooks } from "@/lib/contact-webhook";

export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const provided = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!secret || !provided) return false;
  const actual = Buffer.from(provided);
  const expected = Buffer.from(secret);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const [email, webhook] = await Promise.all([processPendingNotifications(5), processPendingWebhooks(5)]);
  const result = { email, webhook };
  console.info("contact_notification_batch", result);
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
