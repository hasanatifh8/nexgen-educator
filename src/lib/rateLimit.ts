import { headers } from "next/headers";

/**
 * Fixed-window, in-memory rate limiter for auth endpoints.
 * Per-process only: behind several instances or serverless, move this to Redis/Upstash with the same keys.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function hit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 10_000) for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterMs: 0 };
  }
  b.count++;
  return { ok: b.count <= limit, retryAfterMs: b.resetAt - now };
}

export function clear(key: string) {
  buckets.delete(key);
}

export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}
