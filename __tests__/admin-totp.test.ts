import { beforeEach, describe, expect, it, vi } from "vitest";
import { verifyAndConsumeAdminTOTP } from "@/lib/admin-totp";
import { generateTOTP } from "@/lib/totp";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({ prisma: { adminTotpState: { create: vi.fn(), updateMany: vi.fn() } } }));

describe("admin TOTP replay guard", () => {
  const secret = "JBSWY3DPEHPK3PXP";
  beforeEach(() => vi.clearAllMocks());

  it("claims the first use of a step", async () => {
    vi.mocked(prisma.adminTotpState.create).mockResolvedValue({ id: "owner", lastStep: BigInt(1) });
    expect(await verifyAndConsumeAdminTOTP(generateTOTP(secret), secret)).toBe(true);
    expect(prisma.adminTotpState.updateMany).not.toHaveBeenCalled();
  });

  it("rejects a replay after the step was consumed", async () => {
    vi.mocked(prisma.adminTotpState.create).mockRejectedValue({ code: "P2002" });
    vi.mocked(prisma.adminTotpState.updateMany).mockResolvedValue({ count: 0 });
    expect(await verifyAndConsumeAdminTOTP(generateTOTP(secret), secret)).toBe(false);
    expect(prisma.adminTotpState.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ lastStep: { lt: expect.any(BigInt) } }),
    }));
  });
});
