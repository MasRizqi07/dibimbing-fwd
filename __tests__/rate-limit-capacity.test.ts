import { describe, expect, it } from "vitest";
import { consumeRateLimit } from "@/lib/rate-limit";

describe("fallback limiter capacity", () => {
  it("evicts the oldest key when the 10,000-entry cap is exceeded", () => {
    const prefix = `capacity-${crypto.randomUUID()}`;
    for (let index = 0; index <= 10_000; index += 1) {
      expect(consumeRateLimit(`${prefix}:${index}`, 2, 60_000).allowed).toBe(true);
    }

    const oldestKey = `${prefix}:0`;
    expect(consumeRateLimit(oldestKey, 2, 60_000).allowed).toBe(true);
    expect(consumeRateLimit(oldestKey, 2, 60_000).allowed).toBe(true);
    expect(consumeRateLimit(oldestKey, 2, 60_000).allowed).toBe(false);
  });
});
