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

export function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "unknown";
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
