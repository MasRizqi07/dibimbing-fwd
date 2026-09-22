import { timingSafeEqual } from "node:crypto";
import { processPendingNotifications } from "@/lib/contact-notification";

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
  const result = await processPendingNotifications();
  console.info("contact_notification_batch", result);
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
