import { afterAll, describe, expect, it, vi } from "vitest";
import { consumeDistributedRateLimit } from "@/lib/rate-limit";

vi.mock("@upstash/redis", () => ({
  Redis: class {
    incr() { throw new Error("provider-unavailable"); }
  },
}));

const previousUrl = process.env.UPSTASH_REDIS_REST_URL;
const previousToken = process.env.UPSTASH_REDIS_REST_TOKEN;
afterAll(() => {
  if (previousUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL;
  else process.env.UPSTASH_REDIS_REST_URL = previousUrl;
  if (previousToken === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN;
  else process.env.UPSTASH_REDIS_REST_TOKEN = previousToken;
});

describe("distributed limiter outage", () => {
  it("uses the bounded local limiter when Redis fails", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.invalid";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
    const key = `outage:${crypto.randomUUID()}`;
    expect((await consumeDistributedRateLimit(key, 2, 60_000)).allowed).toBe(true);
    expect((await consumeDistributedRateLimit(key, 2, 60_000)).allowed).toBe(true);
    expect((await consumeDistributedRateLimit(key, 2, 60_000)).allowed).toBe(false);
  });
});
