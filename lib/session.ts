/**
 * lib/session.ts
 *
 * Server-side session utilities.
 * Import in Server Components, Server Actions, and Route Handlers.
 *
 * NEVER import this in "use client" files — use lib/auth-client.ts instead.
 */

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Returns the current session or null.
 * Safe anywhere server-side — never throws.
 */
export async function getServerSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session ?? null;
  } catch {
    return null;
  }
}

/**
 * Returns the session or redirects to /login.
 * Use at the top of protected Server Components.
 *
 * @example
 * const session = await requireSession("/profile");
 * // guaranteed non-null below this line
 */
export async function requireSession(currentPath = "/") {
  const session = await getServerSession();
  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
  }
  return session;
}
