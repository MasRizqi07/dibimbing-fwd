import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/cron/notifications/route";
import { processPendingNotifications } from "@/lib/contact-notification";

vi.mock("@/lib/contact-notification", () => ({ processPendingNotifications: vi.fn() }));

const priorSecret = process.env.CRON_SECRET;
afterEach(() => {
  if (priorSecret === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = priorSecret;
  vi.clearAllMocks();
});

describe("notification cron authorization", () => {
  it("rejects missing or incorrect bearer token without touching the queue", async () => {
    process.env.CRON_SECRET = "test-cron-key";
    expect((await GET(new Request("http://localhost/api/cron/notifications"))).status).toBe(401);
    expect((await GET(new Request("http://localhost/api/cron/notifications", { headers: { authorization: "Bearer wrong" } }))).status).toBe(401);
    expect(processPendingNotifications).not.toHaveBeenCalled();
  });

  it("processes authorized batch", async () => {
    process.env.CRON_SECRET = "test-cron-key";
    vi.mocked(processPendingNotifications).mockResolvedValue({ attempted: 2 });
    const response = await GET(new Request("http://localhost/api/cron/notifications", { headers: { authorization: "Bearer test-cron-key" } }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ attempted: 2 });
  });
});
