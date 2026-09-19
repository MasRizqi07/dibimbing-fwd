import { Redis } from "@upstash/redis";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const entries = new Map<string, RateLimitEntry>();
const MAX_ENTRIES = 10_000;

let redisClient: Redis | null = null;
function getRedis(): Redis | null {
  if (redisClient) return redisClient;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    return redisClient;
  }
  return null;
}

function pruneExpiredEntries(now: number): void {
  for (const [key, entry] of entries) {
    if (entry.resetAt <= now) {
      entries.delete(key);
    }
  }

  if (entries.size <= MAX_ENTRIES) return;

  const oldestEntries = [...entries.entries()]
    .sort(([, left], [, right]) => left.resetAt - right.resetAt)
    .slice(0, entries.size - MAX_ENTRIES);

  for (const [key] of oldestEntries) {
    entries.delete(key);
  }
}

export type HeaderSource =
  | Headers
  | { get(name: string): string | null }
  | Request;

export function getClientIp(source: HeaderSource): string {
  const headers =
    "headers" in source && source.headers
      ? source.headers
      : (source as { get(name: string): string | null });

  // 1. x-vercel-forwarded-for: set exclusively by Vercel edge
  const vercelForwarded = headers.get("x-vercel-forwarded-for");
  if (vercelForwarded && vercelForwarded.trim()) {
    const parts = vercelForwarded
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
  }

  // 2. x-real-ip is set by edge proxy and cannot be spoofed by client
  const realIp = headers.get("x-real-ip");
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  // 3. Fallback to rightmost (last) IP in x-forwarded-for
  // Client can prepend spoofed IPs, but edge/proxies append the verified client IP
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor && forwardedFor.trim()) {
    const parts = forwardedFor
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
  }

  return "unknown";
}

export function getClientIdentifier(request: Request): string {
  return getClientIp(request);
}

export function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  pruneExpiredEntries(now);

  const existing = entries.get(key);
  if (!existing || existing.resetAt <= now) {
    entries.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function consumeDistributedRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const redis = getRedis();
  if (!redis) {
    return consumeRateLimit(key, limit, windowMs);
  }

  try {
    const redisKey = `ratelimit:${key}`;
    const windowSec = Math.ceil(windowMs / 1000);
    const count = await redis.incr(redisKey);
    if (count === 1) {
      await redis.expire(redisKey, windowSec);
    }
    const ttl = await redis.ttl(redisKey);
    const retryAfterSeconds = ttl > 0 ? ttl : windowSec;

    if (count > limit) {
      return { allowed: false, retryAfterSeconds };
    }
    return { allowed: true, retryAfterSeconds: 0 };
  } catch (err) {
    console.error("Upstash rate limit fallback to memory:", err);
    return consumeRateLimit(key, limit, windowMs);
  }
}
