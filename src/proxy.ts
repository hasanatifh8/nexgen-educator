import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/sessionToken";

/**
 * Optimistic gate: bounce visitors without a valid session cookie to the login page.
 * Pages still verify the user server-side via `requireUser`.
 */
export function proxy(req: NextRequest) {
  if (verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();

  const login = new URL("/login", req.url);
  login.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/courses/:courseId/learn/:path*", "/certifications/:path*", "/my-learning/:path*", "/admin/:path*"],
};
