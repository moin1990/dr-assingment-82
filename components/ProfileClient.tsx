"use client";

import { useState, useCallback, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

/* ── Types ─────────────────────────────────────────────── */
interface ProfileClientProps {
  initialName:  string;
  initialImage: string;
  email:        string;
  accountType:  string;
  memberSince:  string;
}

/* ── Helpers ────────────────────────────────────────────── */
function getInitials(name: string): string {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
}

function isValidUrl(url: string): boolean {
  return /^https?:\/\/.+\..+/.test(url);
}

/* ── Avatar preview (shared between left panel & form) ─── */
function Avatar({
  name,
  imageUrl,
  size = 96,
}: {
  name:     string;
  imageUrl: string;
  size?:    number;
}) {
  const hasImage = imageUrl && isValidUrl(imageUrl);
  const style    = { width: size, height: size } as React.CSSProperties;

  return (
    <div
      className="relative overflow-hidden bg-primary/15 flex items-center justify-center shrink-0"
      style={style}
    >
      {hasImage ? (
        <Image
          src={imageUrl}
          alt={name || "Avatar"}
          fill
          className="object-cover"
          unoptimized
          onError={() => {}} // silently fall back
        />
      ) : (
        <span
          className="font-display font-light text-primary select-none"
          style={{ fontSize: size * 0.37 }}
        >
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}

/* ── Field ──────────────────────────────────────────────── */
function Field({
  label, id, type = "text", placeholder,
  value, onChange, disabled, error, hint, optional,
}: {
  label: string; id: string; type?: string; placeholder?: string;
  value: string; onChange?: (v: string) => void; disabled?: boolean;
  error?: string; hint?: string; optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-body text-[10.5px] tracking-[.18em] uppercase text-base-content/55"
      >
        {label}
        {optional && (
          <span className="ml-1.5 normal-case tracking-normal text-[10px] text-base-content/30">
            (optional)
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        disabled={disabled}
        className={[
          "h-11 px-4 font-body text-[13px] bg-base-100 text-base-content",
          "placeholder:text-base-content/30 focus:outline-none transition-colors duration-200",
          disabled
            ? "bg-base-200 text-base-content/40 cursor-not-allowed border border-base-200"
            : error
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
        <p className="font-body text-[11px] text-base-content/35">{hint}</p>
      )}
    </div>
  );
}

/* ── Section divider ────────────────────────────────────── */
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <span className="font-body text-[9.5px] tracking-[.25em] uppercase text-base-content/40 shrink-0">
        {label}
      </span>
      <span className="flex-1 h-px bg-base-200" />
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function ProfileClient({
  initialName,
  initialImage,
  email,
  accountType,
  memberSince,
}: ProfileClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /* Form state */
  const [name,  setName]  = useState(initialName);
  const [image, setImage] = useState(initialImage);
  const [error, setError] = useState<string | null>(null);

  /* Track whether anything actually changed */
  const isDirty = name !== initialName || image !== initialImage;

  /* ── Cancel — reset to server-provided values ── */
  const handleCancel = useCallback(() => {
    setName(initialName);
    setImage(initialImage);
    setError(null);
  }, [initialName, initialImage]);

  /* ── Submit ── */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Full name cannot be empty.");
      return;
    }
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    if (image && !isValidUrl(image)) {
      setError("Photo URL must start with http:// or https://");
      return;
    }

    const toastId = toast.loading("Saving changes…");
    try {
      const { error: apiError } = await authClient.updateUser({
        name:  name.trim(),
        image: image.trim() || undefined,
      });

      if (apiError) {
        toast.error(apiError.message ?? "Update failed.", { id: toastId });
        return;
      }

      toast.success("Profile updated!", { id: toastId });
      /* Refresh the Server Component above so the left panel
         reflects the new name / avatar immediately.           */
      startTransition(() => router.refresh());
    } catch {
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  }

  /* ─────────────────────────────────────────────────────── */
  return (
    <form onSubmit={handleSave} noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] border border-base-200
                      animate-[fadeUp_.6s_ease_both]">

        {/* ══════════════ LEFT — identity panel ══════════════ */}
        <div className="bg-neutral flex flex-col items-center px-8 py-10
                        border-b lg:border-b-0 lg:border-r border-neutral-content/8">

          {/* Live avatar (updates as user types) */}
          <div className="relative mb-5">
            <Avatar name={name} imageUrl={image} size={96} />
            {/* Active badge */}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full
                             bg-emerald-400 border-2 border-neutral
                             flex items-center justify-center">
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24"
                   stroke="white" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
              </svg>
            </span>
          </div>

          {/* Name + email (also live) */}
          <p className="font-display text-[22px] font-light text-neutral-content
                        text-center leading-tight mb-1">
            {name || "Tile Enthusiast"}
          </p>
          <p className="font-body text-[11.5px] text-neutral-content/40
                        text-center break-all mb-7">
            {email}
          </p>

          {/* Info chips */}
          <div className="w-full flex flex-col gap-2.5 mb-7">
            {[
              {
                label: "Account type",
                value: accountType,
                icon: (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                  </svg>
                ),
              },
              {
                label: "Member since",
                value: memberSince,
                icon: (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                  </svg>
                ),
              },
              {
                label: "Status",
                value: "Active",
                valueClass: "text-emerald-400",
                icon: (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                ),
              },
            ].map(({ label, value, icon, valueClass }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-3.5 py-2.5
                           border border-neutral-content/8 bg-neutral-content/4"
              >
                <span className="text-neutral-content/30 shrink-0">{icon}</span>
                <div className="min-w-0">
                  <p className="font-body text-[9px] tracking-[.22em] uppercase
                                text-neutral-content/30 mb-0.5">
                    {label}
                  </p>
                  <p className={`font-body text-[12px] text-neutral-content/70 truncate
                                 ${valueClass ?? ""}`}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sign out */}
          <SignOutChip />
        </div>

        {/* ══════════════ RIGHT — edit form ══════════════ */}
        <div className="bg-base-100 px-8 md:px-10 py-10 flex flex-col">

          <p className="font-body text-[10px] tracking-[.3em] uppercase
                        text-base-content/40 mb-6">
            Edit Profile
          </p>

          {/* ── Personal info ── */}
          <SectionDivider label="Personal info" />

          <div className="flex flex-col gap-4">
            <Field
              label="Full name"
              id="name"
              placeholder="Jane Doe"
              value={name}
              onChange={setName}
              error={error && !image ? error : undefined}
            />

            <div className="flex flex-col gap-1.5">
              <Field
                label="Photo URL"
                id="image"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={image}
                onChange={setImage}
                optional
                hint="Link to a public image. Leave blank to use your initials."
                error={error && image ? error : undefined}
              />

              {/* Live avatar preview */}
              {(name || image) && (
                <div className="flex items-center gap-3.5 p-3 bg-base-200 border border-base-300 -mt-1">
                  <Avatar name={name} imageUrl={image} size={40} />
                  <div>
                    <p className="font-body text-[12px] text-base-content/60">
                      {image && isValidUrl(image)
                        ? "Photo preview"
                        : "Using initials"}
                    </p>
                    <p className="font-body text-[11px] text-base-content/35">
                      {image && !isValidUrl(image)
                        ? "Enter a valid https:// URL"
                        : image
                        ? "This image will be used as your avatar"
                        : "Enter a URL above to use a photo"}
                    </p>
                  </div>
                  {isDirty && (
                    <span className="ml-auto font-body text-[9px] tracking-[.15em] uppercase
                                     px-2 py-1 bg-primary/10 text-primary/80 border border-primary/20
                                     shrink-0">
                      Changed
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Account details (read-only) ── */}
          <SectionDivider label="Account details" />

          <div className="flex flex-col gap-3">
            <Field
              label="Email address"
              id="email-ro"
              type="email"
              value={email}
              disabled
              hint="Email changes are not supported at this time."
            />
          </div>

          {/* ── CTA row ── */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-base-200 flex-wrap">
            <button
              type="submit"
              disabled={!isDirty || isPending}
              className="h-11 px-8 flex items-center justify-center gap-2.5
                         font-body text-[10.5px] tracking-[.2em] uppercase font-medium
                         bg-neutral text-neutral-content
                         hover:bg-primary hover:text-primary-content
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-200 min-w-[148px]"
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  Saving…
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"/>
                  </svg>
                  Save Changes
                </>
              )}
            </button>

            {isDirty && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="h-11 px-6 font-body text-[10.5px] tracking-[.2em] uppercase
                           border border-base-300 text-base-content/50
                           hover:border-base-content/40 hover:text-base-content
                           disabled:opacity-40 transition-all duration-200"
              >
                Cancel
              </button>
            )}

            {isDirty && (
              <span className="font-body text-[11px] text-base-content/35 ml-auto">
                Unsaved changes
              </span>
            )}
          </div>

        </div>
      </div>
    </form>
  );
}

/* ── Extracted sign-out chip (client sub-component) ──── */
function SignOutChip() {
  const router = useRouter();

  async function handleSignOut() {
    const id = toast.loading("Signing out…");
    try {
      await authClient.signOut();
      toast.success("See you next time!", { id });
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Sign-out failed. Please try again.", { id });
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="w-full h-10 flex items-center justify-center gap-2.5
                 font-body text-[10px] tracking-[.2em] uppercase
                 border border-neutral-content/12 text-neutral-content/40
                 hover:border-error/60 hover:text-error
                 transition-all duration-200"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
           stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/>
      </svg>
      Sign Out
    </button>
  );
}
