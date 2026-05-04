"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signUp, signIn } from "@/lib/auth-client";

/* ─── Types ──────────────────────────────────────────── */
interface FormState {
  name:     string;
  email:    string;
  photoURL: string;
  password: string;
  confirm:  string;
}

interface FieldError {
  name?:     string;
  email?:    string;
  photoURL?: string;
  password?: string;
  confirm?:  string;
}

/* ─── Google icon ────────────────────────────────────── */
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

/* ─── Password strength ───────────────────────────────── */
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8)               score++;
  if (/[A-Z]/.test(pw))             score++;
  if (/[0-9]/.test(pw))             score++;
  if (/[^A-Za-z0-9]/.test(pw))      score++;

  const map = [
    { label: "Too short",  color: "bg-error"   },
    { label: "Weak",       color: "bg-error"   },
    { label: "Fair",       color: "bg-warning" },
    { label: "Good",       color: "bg-info"    },
    { label: "Strong",     color: "bg-success" },
  ];
  return { score, ...map[score] };
}

/* ─── Reusable field ─────────────────────────────────── */
function Field({
  label, id, type = "text", placeholder,
  value, onChange, error, autoComplete, hint,
}: {
  label: string; id: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void;
  error?: string; autoComplete?: string; hint?: string;
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
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={[
          "h-11 px-4 font-body text-[13px] bg-base-100",
          "text-base-content placeholder:text-base-content/30",
          "focus:outline-none transition-colors duration-200",
          error
            ? "border border-error focus:border-error"
            : "border border-base-300 focus:border-primary",
        ].join(" ")}
      />
      {error && (
        <p className="font-body text-[11px] text-error flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
      {hint && !error && (
        <p className="font-body text-[11px] text-base-content/40">{hint}</p>
      )}
    </div>
  );
}

/* ─── Avatar preview ─────────────────────────────────── */
function AvatarPreview({ url, name }: { url: string; name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  const isValidUrl = url.startsWith("http://") || url.startsWith("https://");

  return (
    <div className="flex items-center gap-3 p-3 bg-base-200 border border-base-300">
      <div className="relative w-11 h-11 shrink-0 overflow-hidden bg-primary/15
                      flex items-center justify-center">
        {isValidUrl ? (
          <Image
            src={url}
            alt={name || "Avatar"}
            fill
            className="object-cover"
            onError={() => {}} // silently fall back to initials
            unoptimized        // photo URL is user-supplied, skip optimization
          />
        ) : (
          <span className="font-display text-[16px] font-light text-primary">
            {initials}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-body text-[12px] text-base-content/50 truncate">
          {isValidUrl ? "Photo preview" : "Initials used (no valid URL)"}
        </p>
        {name && (
          <p className="font-body text-[13px] font-medium truncate">{name}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Validation ─────────────────────────────────────── */
function validate(f: FormState): FieldError {
  const e: FieldError = {};

  if (!f.name.trim())
    e.name = "Full name is required.";
  else if (f.name.trim().length < 2)
    e.name = "Name must be at least 2 characters.";

  if (!f.email.trim())
    e.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = "Enter a valid email address.";

  if (f.photoURL && !/^https?:\/\/.+\..+/.test(f.photoURL))
    e.photoURL = "Must be a valid http/https URL.";

  if (!f.password)
    e.password = "Password is required.";
  else if (f.password.length < 8)
    e.password = "Password must be at least 8 characters.";

  if (!f.confirm)
    e.confirm = "Please confirm your password.";
  else if (f.confirm !== f.password)
    e.confirm = "Passwords do not match.";

  return e;
}

/* ─── Page ───────────────────────────────────────────── */
export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: "", email: "", photoURL: "", password: "", confirm: "",
  });
  const [errors,   setErrors]   = useState<FieldError>({});
  const [loading,  setLoading]  = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [showPw,   setShowPw]   = useState(false);

  const set = useCallback(
    (key: keyof FormState) => (val: string) => {
      setForm((prev) => ({ ...prev, [key]: val }));
      // clear the specific error as user types
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    []
  );

  const strength = getStrength(form.password);

  /* ── Submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      toast.error("Please fix the errors below.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating your account…");

    try {
      const { error } = await signUp.email({
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        password: form.password,
        image:    form.photoURL.trim() || undefined,
        callbackURL: "/",
      });

      if (error) {
        toast.error(friendlyError(error.message ?? "Registration failed."), {
          id: toastId,
        });
      } else {
        toast.success("Account created! Welcome to Tile Gallery.", { id: toastId });
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  /* ── Google ── */
  async function handleGoogle() {
    setGLoading(true);
    try {
      await signIn.social({ provider: "google", callbackURL: "/" });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setGLoading(false);
    }
  }

  /* ─── Render ─────────────────────────────────────── */
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center
                    bg-base-200 px-4 py-16">
      <div className="w-full max-w-[460px]">
        <div className="bg-base-100 border border-base-300 p-8 md:p-10">

          {/* ── Header ── */}
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
            <h1 className="font-display text-[28px] font-light leading-tight">
              Create an account
            </h1>
            <p className="font-body text-[12.5px] text-base-content/50 mt-1">
              Join thousands of tile enthusiasts
            </p>
          </div>

          {/* ── Google ── */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={gLoading || loading}
            className="w-full h-11 flex items-center justify-center gap-3
                       font-body text-[12px] tracking-[.1em] font-medium
                       border border-base-300 bg-base-100 text-base-content
                       hover:bg-base-200 hover:border-base-content/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 mb-6"
          >
            {gLoading
              ? <span className="loading loading-spinner loading-xs" />
              : <GoogleIcon />}
            Continue with Google
          </button>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 mb-6">
            <span className="flex-1 h-px bg-base-300" />
            <span className="font-body text-[10px] tracking-[.2em] uppercase text-base-content/30">
              or register with email
            </span>
            <span className="flex-1 h-px bg-base-300" />
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {/* Name */}
            <Field
              label="Full name"
              id="name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={set("name")}
              error={errors.name}
              autoComplete="name"
            />

            {/* Email */}
            <Field
              label="Email address"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
              autoComplete="email"
            />

            {/* Photo URL */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="photoURL"
                className="font-body text-[11px] tracking-[.2em] uppercase text-base-content/60"
              >
                Photo URL
                <span className="ml-1.5 normal-case tracking-normal text-base-content/30">
                  (optional)
                </span>
              </label>
              <input
                id="photoURL"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={form.photoURL}
                onChange={(e) => set("photoURL")(e.target.value)}
                autoComplete="photo"
                className={[
                  "h-11 px-4 font-body text-[13px] bg-base-100",
                  "text-base-content placeholder:text-base-content/30",
                  "focus:outline-none transition-colors duration-200",
                  errors.photoURL
                    ? "border border-error focus:border-error"
                    : "border border-base-300 focus:border-primary",
                ].join(" ")}
              />
              {errors.photoURL && (
                <p className="font-body text-[11px] text-error flex items-center gap-1">
                  <span aria-hidden="true">⚠</span> {errors.photoURL}
                </p>
              )}

              {/* Live avatar preview */}
              {(form.name || form.photoURL) && (
                <AvatarPreview url={form.photoURL} name={form.name} />
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="font-body text-[11px] tracking-[.2em] uppercase text-base-content/60"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => set("password")(e.target.value)}
                  autoComplete="new-password"
                  className={[
                    "w-full h-11 pl-4 pr-10 font-body text-[13px] bg-base-100",
                    "text-base-content placeholder:text-base-content/30",
                    "focus:outline-none transition-colors duration-200",
                    errors.password
                      ? "border border-error focus:border-error"
                      : "border border-base-300 focus:border-primary",
                  ].join(" ")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-base-content/30 hover:text-base-content
                             transition-colors duration-200"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Strength meter */}
              {form.password && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1 flex-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={[
                          "h-1 flex-1 transition-all duration-300",
                          i < strength.score ? strength.color : "bg-base-300",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                  <span className="font-body text-[10px] text-base-content/40 w-12 text-right">
                    {strength.label}
                  </span>
                </div>
              )}

              {errors.password && (
                <p className="font-body text-[11px] text-error flex items-center gap-1">
                  <span aria-hidden="true">⚠</span> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <Field
              label="Confirm password"
              id="confirm"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={set("confirm")}
              error={errors.confirm}
              autoComplete="new-password"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || gLoading}
              className="h-11 mt-2 w-full flex items-center justify-center gap-2
                         font-body text-[11px] tracking-[.2em] uppercase font-medium
                         bg-primary text-primary-content
                         hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
            >
              {loading && <span className="loading loading-spinner loading-xs" />}
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          {/* ── Footer ── */}
          <p className="font-body text-center text-[12px] text-base-content/40 mt-7">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-base-content hover:text-primary
                         underline underline-offset-2 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

/* ── Friendly error mapper ───────────────────────────── */
function friendlyError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("email") && m.includes("exist"))
    return "An account with this email already exists. Try signing in instead.";
  if (m.includes("password") && m.includes("weak"))
    return "Password is too weak. Use at least 8 characters with mixed case and numbers.";
  if (m.includes("invalid email"))
    return "Please enter a valid email address.";
  return msg;
}
