interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const entries = new Map<string, RateLimitEntry>();
const MAX_ENTRIES = 10_000;

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

  // 1. x-real-ip is set by edge proxy (e.g. Vercel) and cannot be spoofed by client
  const realIp = headers.get("x-real-ip");
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  // 2. Fallback to rightmost (last) IP in x-forwarded-for
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
