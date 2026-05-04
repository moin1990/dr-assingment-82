/**
 * middleware.ts
 *
 * Three jobs — all run at the edge before any React code:
 *
 *  1. PROTECTED routes  → redirect to /login if no valid session cookie
 *  2. AUTH routes       → redirect to / if already logged in
 *  3. EXPIRED sessions  → add a `reason=expired` param so the login page
 *                         can show an "Your session expired" toast
 */

import { NextRequest, NextResponse } from "next/server";

/* ─── Protected route prefixes ────────────────────────────
   Order matters: more specific prefixes should come first.  */
const PROTECTED_PREFIXES = [
  "/all-tiles/",   // detail pages (/all-tiles/tile-001) — listing is public
  "/profile",      // covers /profile AND /profile/edit
  "/dashboard",
  "/favorites",
  "/settings",
];

/* ─── Auth pages — logged-in users bounce to home ───────── */
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

/* ─── BetterAuth cookie names ────────────────────────────── */
const SESSION_COOKIE = "better-auth.session_token";

/* ─── Paths that should NEVER be intercepted ─────────────── */
const BYPASS_PREFIXES = [
  "/api/auth",   // BetterAuth's own endpoints
  "/_next",
];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  /* Skip internal Next.js and BetterAuth paths */
  if (BYPASS_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  const isLoggedIn   = Boolean(sessionToken);

  /* ── 1. Bounce logged-in users away from auth pages ── */
  if (isLoggedIn && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    const destination = searchParams.get("callbackUrl") ?? "/";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  /* ── 2. Protect private routes ── */
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);

    /* Preserve the originally requested path for post-login redirect */
    loginUrl.searchParams.set("callbackUrl", pathname);

    /* Hint the login page to show a specific message.
       "unauthorized" = user tried to access a private page without logging in.
       "expired"      = a previous session cookie existed but has since been cleared
                        (detected by presence of a stale/malformed cookie value). */
    const reason =
      request.cookies.get(SESSION_COOKIE) !== undefined ? "expired" : "unauthorized";
    loginUrl.searchParams.set("reason", reason);

    const response = NextResponse.redirect(loginUrl);

    /* Clear a stale/invalid session cookie so the login page starts fresh */
    if (reason === "expired") {
      response.cookies.delete(SESSION_COOKIE);
    }

    return response;
  }

  /* ── 3. Add security headers to every response ── */
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  /*
   * Run on every route EXCEPT static assets and Next.js internals.
   * api/auth is already handled by the BYPASS_PREFIXES check above,
   * but excluding it from the matcher entirely is more efficient.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)",
  ],
};
