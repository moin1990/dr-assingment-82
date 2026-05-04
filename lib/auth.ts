/**
 * lib/auth.ts
 *
 * BetterAuth server-side configuration.
 * Import `auth` here for server actions / route handlers.
 * Import `authClient` from lib/auth-client.ts for client components.
 */

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import clientPromise from "@/lib/mongodb";

export const auth = betterAuth({
  /* ── Database ─────────────────────────────────────── */
  database: mongodbAdapter(clientPromise),

  /* ── Email + Password ─────────────────────────────── */
  emailAndPassword: {
    enabled: true,
    /**
     * Allow extra fields (name, image) during sign-up.
     * BetterAuth stores these directly on the user document.
     */
    requireEmailVerification: false,
  },

  /* ── Social providers ─────────────────────────────── */
  socialProviders: {
    google: {
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  /* ── Session ──────────────────────────────────────── */
  session: {
    expiresIn:        60 * 60 * 24 * 7,  // 7 days
    updateAge:        60 * 60 * 24,       // refresh if older than 1 day
    cookieCache: {
      enabled:   true,
      maxAge:    60 * 5, // client-side cookie cache: 5 min
    },
  },

  /* ── User ─────────────────────────────────────────── */
  user: {
    additionalFields: {
      /** Display name (populated from register form or Google profile) */
      name: {
        type:     "string",
        required: false,
        defaultValue: "",
      },
      /** Avatar — either uploaded URL or Google picture */
      image: {
        type:     "string",
        required: false,
        defaultValue: "",
      },
    },
  },

  /* ── Trusted origins (add your production URL here) ── */
  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ],
});

/* ── Inferred types (use across the app) ─────────────── */
export type Session = typeof auth.$Infer.Session;
export type User    = typeof auth.$Infer.Session.user;
