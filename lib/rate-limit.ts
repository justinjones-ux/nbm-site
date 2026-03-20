/**
 * Simple in-memory rate limiter.
 * For production at scale, swap with Redis-backed solution.
 */

const hits = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  windowMs?: number;  // time window in ms (default: 60s)
  max?: number;       // max requests per window (default: 5)
}

export function rateLimit(
  key: string,
  opts: RateLimitOptions = {}
): { allowed: boolean; remaining: number } {
  const { windowMs = 60_000, max = 5 } = opts;
  const now = Date.now();

  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }

  entry.count++;

  if (entry.count > max) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: max - entry.count };
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) hits.delete(key);
  }
}, 300_000);
