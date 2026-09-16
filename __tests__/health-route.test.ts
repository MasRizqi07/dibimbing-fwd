import { describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/health/route";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

describe("GET /api/health", () => {
  it("returns an ok response when the database is reachable", async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([]);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({
      success: true,
      status: "ok",
      checks: { database: "ok" },
    });
  });

  it("returns degraded without leaking database details when the probe fails", async () => {
    vi.mocked(prisma.$queryRaw).mockRejectedValue(new Error("database secret"));

    const response = await GET();

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      success: false,
      status: "degraded",
      checks: { database: "unavailable" },
    });
  });
});
