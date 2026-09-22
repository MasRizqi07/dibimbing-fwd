import { Redis } from "@upstash/redis";
import { isIP } from "node:net";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const entries = new Map<string, RateLimitEntry>();
const MAX_ENTRIES = 10_000;
let lastPruneAt = 0;

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
  if (now - lastPruneAt < 60_000) return;
  lastPruneAt = now;
  for (const [key, entry] of entries) {
    if (entry.resetAt <= now) {
      entries.delete(key);
    }
  }
}

export type HeaderSource =
  | Headers
  | { get(name: string): string | null }
  | Request;

export function getClientIp(source: HeaderSource): string {
  const headers = source instanceof Request ? source.headers : source;

  // Only a deployment-controlled proxy header may identify a client. The
  // default outside Vercel is a shared bucket, never an arbitrary client value.
  const configuredHeader = process.env.TRUSTED_PROXY_IP_HEADER;
  const trustedHeader = configuredHeader || (process.env.VERCEL === "1" ? "x-vercel-forwarded-for" : "");
  if (!trustedHeader || !["x-vercel-forwarded-for", "x-real-ip", "x-forwarded-for"].includes(trustedHeader)) {
    return "unknown";
  }
  const candidate = headers.get(trustedHeader)?.split(",").at(-1)?.trim();
  if (candidate && isIP(candidate)) return candidate;
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
    if (entries.size > MAX_ENTRIES) {
      const oldest = entries.keys().next().value;
      if (oldest !== undefined) entries.delete(oldest);
    }
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
    let ttl = await redis.ttl(redisKey);

    // If key has no TTL (-1) or was newly created, restore the intended expiration
    if (ttl < 0) {
      await redis.expire(redisKey, windowSec);
      ttl = windowSec;
    }

    const retryAfterSeconds = ttl > 0 ? ttl : windowSec;

    if (count > limit) {
      return { allowed: false, retryAfterSeconds };
    }
    return { allowed: true, retryAfterSeconds: 0 };
  } catch (err) {
    console.error("rate_limit_memory_fallback", { type: err instanceof Error ? err.name : "unknown" });
    return consumeRateLimit(key, limit, windowMs);
  }
}
