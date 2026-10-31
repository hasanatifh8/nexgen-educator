import { cookies, headers } from "next/headers";
import { connection } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySessionToken } from "./sessionToken";

/** Secure cookies on HTTPS; plain HTTP (e.g. `next start` on localhost) can't send them back. */
async function isHttps() {
  const proto = (await headers()).get("x-forwarded-proto");
  return proto ? proto.includes("https") : process.env.NODE_ENV === "production";
}

export async function createSession(uid: string) {
  (await cookies()).set(SESSION_COOKIE, signSession(uid), {
    httpOnly: true,
    secure: await isHttps(),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  // Expiry checks read the clock, so this must never run during prerendering.
  await connection();
  return verifySessionToken(token);
}
