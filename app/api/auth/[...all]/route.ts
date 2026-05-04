/**
 * app/api/auth/[...all]/route.ts
 *
 * BetterAuth handles every request under /api/auth/*
 * — sign-in, sign-up, sign-out, OAuth callbacks, session checks, etc.
 *
 * Do NOT add any custom logic here; extend auth behaviour in lib/auth.ts.
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
