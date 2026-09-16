import { describe, it, expect } from "vitest";
import {
  createSessionToken,
  verifySessionToken,
  verifyAdminPassword,
} from "@/lib/admin-session";

describe("Admin Session & Security", () => {
  it("should create and verify valid session token", async () => {
    const token = await createSessionToken();
    expect(typeof token).toBe("string");
    expect(token).toContain(".");

    const isValid = await verifySessionToken(token);
    expect(isValid).toBe(true);
  });

  it("should reject tampered session tokens", async () => {
    const token = await createSessionToken();
    const tampered = token.slice(0, -4) + "abcd";

    const isValid = await verifySessionToken(tampered);
    expect(isValid).toBe(false);
  });

  it("should reject malformed tokens", async () => {
    expect(await verifySessionToken("")).toBe(false);
    expect(await verifySessionToken("invalid-token-no-dot")).toBe(false);
    expect(await verifySessionToken("abc.def.ghi")).toBe(false);
  });

  it("should verify admin password against environment variable", async () => {
    const originalPass = process.env.ADMIN_PASSWORD;
    process.env.ADMIN_PASSWORD = "test-secret-password-123";

    expect(await verifyAdminPassword("test-secret-password-123")).toBe(true);
    expect(await verifyAdminPassword("wrong-password")).toBe(false);
    expect(await verifyAdminPassword("")).toBe(false);

    process.env.ADMIN_PASSWORD = originalPass;
  });
});
