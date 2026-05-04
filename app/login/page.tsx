"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

/* ── Google icon ─────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ── Input field ─────────────────────────────────────── */
function Field({
  label, id, type = "text", placeholder, value, onChange, autoComplete,
}: {
  label: string; id: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-body text-[11px] tracking-[.2em] uppercase text-base-content/60"
      >
        {label}
      </label>
      <input
        id={id} type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete} required
        className="h-11 px-4 font-body text-[13px] bg-base-100
                   border border-base-300 text-base-content
                   placeholder:text-base-content/30
                   focus:outline-none focus:border-primary
                   transition-colors duration-200"
      />
    </div>
  );
}

/* ── Page ────────────────────────────────────────────── */
export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // callbackUrl = destination, reason = why they landed here
  const from   = searchParams.get("callbackUrl") ?? searchParams.get("from") ?? "/";
  const reason = searchParams.get("reason");

  /* Show a contextual toast on mount based on middleware reason param */
  useEffect(() => {
    if (reason === "expired") {
      toast.error("Your session expired. Please sign in again.");
    } else if (reason === "unauthorized") {
      toast("Sign in to access that page.", {
        icon: "🔒",
        style: { border: "1px solid #c8a97e" },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [gLoading, setGLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields."); return; }

    setLoading(true);
    const toastId = toast.loading("Signing you in…");
    try {
      const { error } = await signIn.email({ email, password, callbackURL: from });
      if (error) {
        toast.error(friendlyError(error.message ?? "Login failed."), { id: toastId });
      } else {
        toast.success("Welcome back!", { id: toastId });
        router.push(from);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGLoading(true);
    try {
      await signIn.social({ provider: "google", callbackURL: from });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setGLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center
                    bg-base-200 px-4 py-16">
      <div className="w-full max-w-[420px]">
        <div className="bg-base-100 border border-base-300 p-8 md:p-10">

          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex flex-col items-center leading-none mb-6 group">
              <span className="font-display text-[28px] font-light tracking-[.14em]
                               text-base-content group-hover:text-primary transition-colors duration-300">
                TILE
              </span>
              <span className="text-[8px] tracking-[.4em] uppercase text-base-content/35 font-body -mt-0.5">
                Gallery
              </span>
            </Link>
            <h1 className="font-display text-[28px] font-light">Welcome back</h1>
            <p className="font-body text-[12.5px] text-base-content/50 mt-1">
              Sign in to your account
            </p>
            {/* Banner shown when middleware bounces user here from a protected page */}
            {reason && (
              <p className="mt-3 font-body text-[11.5px] text-warning
                            bg-warning/10 border border-warning/20 px-3 py-2">
                Please sign in to continue.
              </p>
            )}
          </div>

          <button type="button" onClick={handleGoogle} disabled={gLoading || loading}
            className="w-full h-11 flex items-center justify-center gap-3
                       font-body text-[12px] tracking-[.1em] font-medium
                       border border-base-300 bg-base-100 text-base-content
                       hover:bg-base-200 hover:border-base-content/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 mb-6">
            {gLoading ? <span className="loading loading-spinner loading-xs" /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <span className="flex-1 h-px bg-base-300" />
            <span className="font-body text-[10px] tracking-[.2em] uppercase text-base-content/30">or</span>
            <span className="flex-1 h-px bg-base-300" />
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Field label="Email address" id="email" type="email"
              placeholder="you@example.com" value={email} onChange={setEmail}
              autoComplete="email" />
            <Field label="Password" id="password" type="password"
              placeholder="••••••••" value={password} onChange={setPassword}
              autoComplete="current-password" />
            <div className="text-right -mt-1">
              <Link href="/forgot-password"
                className="font-body text-[11px] text-base-content/40 hover:text-primary transition-colors">
                Forgot password?
              </Link>
            </div>
            <button type="submit" disabled={loading || gLoading}
              className="h-11 mt-2 w-full flex items-center justify-center gap-2
                         font-body text-[11px] tracking-[.2em] uppercase font-medium
                         bg-primary text-primary-content hover:bg-primary/85
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
              {loading && <span className="loading loading-spinner loading-xs" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="font-body text-center text-[12px] text-base-content/40 mt-7">
            Don&apos;t have an account?{" "}
            <Link href="/register"
              className="text-base-content hover:text-primary underline underline-offset-2 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function friendlyError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid email") || m.includes("user not found"))
    return "No account found with that email address.";
  if (m.includes("invalid password") || m.includes("incorrect password"))
    return "Incorrect password. Please try again.";
  if (m.includes("too many"))
    return "Too many attempts. Please wait a moment and try again.";
  if (m.includes("email not verified"))
    return "Please verify your email before signing in.";
  return msg;
}
