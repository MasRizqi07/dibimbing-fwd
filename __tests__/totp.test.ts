import { describe, expect, it } from "vitest";
import { generateTOTP, verifyTOTP } from "@/lib/totp";

describe("TOTP 2FA Utility", () => {
  const secret = "JBSWY3DPEHPK3PXP"; // Standard base32 test key

  it("generates a 6-digit numeric string", () => {
    const token = generateTOTP(secret);
    expect(token).toMatch(/^\d{6}$/);
  });

  it("verifies the generated token successfully", () => {
    const token = generateTOTP(secret);
    expect(verifyTOTP(token, secret)).toBe(true);
  });

  it("rejects an invalid token", () => {
    expect(verifyTOTP("000000", secret)).toBe(false);
    expect(verifyTOTP("abcdef", secret)).toBe(false);
    expect(verifyTOTP("", secret)).toBe(false);
  });

  it("tolerates time drift within allowable window", () => {
    const pastToken = generateTOTP(secret, Date.now() - 25 * 1000);
    expect(verifyTOTP(pastToken, secret, 1)).toBe(true);
  });
});

