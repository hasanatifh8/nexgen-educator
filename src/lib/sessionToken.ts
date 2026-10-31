import { createHmac, timingSafeEqual } from "node:crypto";

/** Cookie-free token helpers so they can be shared by Proxy and server code. */
export const SESSION_COOKIE = "nge_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** iat is epoch ms (so a password reset revokes even same-second sessions); exp is epoch seconds. */
export type SessionPayload = { uid: string; iat: number; exp: number };

const DEV_FALLBACK_SECRET = "dev-only-insecure-secret-change-me";

function secret() {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set (32+ chars) in production. See .env.example.");
  }
  return DEV_FALLBACK_SECRET;
}

const sign = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

export function signSession(uid: string): string {
  const now = Date.now();
  const payload: SessionPayload = { uid, iat: now, exp: Math.floor(now / 1000) + SESSION_MAX_AGE };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = Buffer.from(sign(data));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as SessionPayload;
    if (typeof payload.uid !== "string" || typeof payload.iat !== "number" || payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Generic signed value (e.g. exam attempt tokens), using the session secret. */
export function signValue(value: object) {
  const data = Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifyValue<T>(token: string): T | null {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = Buffer.from(sign(data));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    return JSON.parse(Buffer.from(data, "base64url").toString()) as T;
  } catch {
    return null;
  }
}

/** Where to send a learner who still has to complete their profile, without nesting /onboarding in its own `next`. */
export function onboardingPath(next: string | null) {
  if (next?.startsWith("/onboarding")) return next;
  return `/onboarding${next ? `?next=${encodeURIComponent(next)}` : ""}`;
}

/** Only allow same-origin relative paths as post-login destinations. */
export function safeNextPath(next: unknown): string | null {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : null;
}
