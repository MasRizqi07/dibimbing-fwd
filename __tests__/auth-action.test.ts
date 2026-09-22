import { beforeEach, describe, expect, it, vi } from "vitest";
import { loginAdminAction } from "@/app/actions/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { consumeDistributedRateLimit } from "@/lib/rate-limit";
import { setAdminSessionCookie, verifyAdminPassword } from "@/lib/admin-session";

vi.mock("next/headers", () => ({ headers: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/rate-limit", () => ({
  getClientIp: vi.fn(() => "203.0.113.10"),
  consumeDistributedRateLimit: vi.fn(),
}));
vi.mock("@/lib/admin-session", () => ({
  verifyAdminPassword: vi.fn(),
  setAdminSessionCookie: vi.fn(),
  removeAdminSessionCookie: vi.fn(),
}));

describe("admin login global limit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(headers).mockResolvedValue(new Headers() as never);
  });

  it("does not verify even a correct password after the portal cap is exhausted", async () => {
    vi.mocked(consumeDistributedRateLimit)
      .mockResolvedValueOnce({ allowed: true, retryAfterSeconds: 0 })
      .mockResolvedValueOnce({ allowed: false, retryAfterSeconds: 900 });
    vi.mocked(verifyAdminPassword).mockResolvedValue(true);

    const form = new FormData();
    form.set("password", "correct-password");
    await expect(loginAdminAction(null, form)).resolves.toEqual({
      error: "Portal sedang membatasi percobaan login. Coba lagi nanti.",
    });
    expect(verifyAdminPassword).not.toHaveBeenCalled();
    expect(setAdminSessionCookie).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
