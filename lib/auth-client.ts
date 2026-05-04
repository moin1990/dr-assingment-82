/**
 * lib/auth-client.ts
 *
 * BetterAuth browser-side client.
 * Use this in "use client" components for sign-in, sign-up, sign-out, etc.
 *
 * Example:
 *   import { authClient } from "@/lib/auth-client";
 *   await authClient.signIn.email({ email, password });
 */

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});

/* Named re-exports for convenience */
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
