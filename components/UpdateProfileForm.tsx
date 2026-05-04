"use client";

import {
  useState,
  useCallback,
  useTransition,
  useRef,
  useEffect,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

/* ─── Types ──────────────────────────────────────────────── */
interface UpdateProfileFormProps {
  initialName:  string;
  initialImage: string;
  email:        string;
}

interface FieldErrors {
  name?:  string;
  image?: string;
}

/* ─── Helpers ─────────────────────────────────────────────── */
const MAX_NAME = 60;

function getInitials(name: string): string {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
}

function isValidHttpUrl(url: string): boolean {
  return /^https?:\/\/.+\..+/.test(url.trim());
}

/** 0–4 completeness score for name strength bar */
function nameScore(name: string): number {
  const n = name.trim();
  if (n.length === 0) return 0;
  if (n.length < 2)   return 1;
  if (n.length < 5)   return 2;
  if (n.split(" ").filter(Boolean).length >= 2) return 4;
  return 3;
}

/* ─── Sub-components ──────────────────────────────────────── */

/** Live avatar — shows image or initials */
function LiveAvatar({
  name,
  imageUrl,
  size,
}: {
  name: string; imageUrl: string; size: number;
}) {
  const [imgError, setImgError] = useState(false);
  const hasImage = imageUrl && isValidHttpUrl(imageUrl) && !imgError;

  // Reset error when URL changes
  useEffect(() => { setImgError(false); }, [imageUrl]);

  return (
    <div
      className="relative overflow-hidden bg-primary/15 flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {hasImage ? (
        <Image
          src={imageUrl}
          alt={name || "Avatar"}
          fill
          className="object-cover"
          unoptimized
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className="font-display font-light text-primary select-none z-10"
          style={{ fontSize: Math.round(size * 0.37) }}
        >
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}

/** Inline error message */
function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 font-body text-[11px] text-error mt-1.5">
      <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24"
           stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/>
      </svg>
      {message}
    </p>
  );
}

/** 4-segment name strength bar */
function NameStrengthBar({ score }: { score: number }) {
  const colours = [
    "bg-base-300",   // empty
    "bg-error",      // 1
    "bg-warning",    // 2
    "bg-primary",    // 3
    "bg-success",    // 4
  ];
  const active = colours[score] ?? "bg-base-300";

  return (
    <div className="flex gap-1 mt-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-0.5 flex-1 transition-all duration-300 ${
            i < score ? active : "bg-base-300"
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Main form ───────────────────────────────────────────── */
export default function UpdateProfileForm({
  initialName,
  initialImage,
  email,
}: UpdateProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name,    setName]    = useState(initialName);
  const [image,   setImage]   = useState(initialImage);
  const [errors,  setErrors]  = useState<FieldErrors>({});
  const [saved,   setSaved]   = useState(false);

  const isDirty  = name !== initialName || image !== initialImage;
  const score    = nameScore(name);
  const imgValid = !image || isValidHttpUrl(image);

  /* ── Real-time field validation ── */
  const validateName = useCallback((val: string) => {
    if (!val.trim())          return "Full name cannot be empty.";
    if (val.trim().length < 2) return "Name must be at least 2 characters.";
    if (val.length > MAX_NAME) return `Name must be ${MAX_NAME} characters or fewer.`;
    return null;
  }, []);

  const validateImage = useCallback((val: string) => {
    if (val && !isValidHttpUrl(val)) return "Must be a valid http:// or https:// URL.";
    return null;
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSaved(false);
    setErrors((prev) => ({ ...prev, name: validateName(val) ?? undefined }));
  };

  const handleImageChange = (val: string) => {
    setImage(val);
    setSaved(false);
    setErrors((prev) => ({ ...prev, image: validateImage(val) ?? undefined }));
  };

  /* ── Cancel ── */
  const handleCancel = useCallback(() => {
    setName(initialName);
    setImage(initialImage);
    setErrors({});
    setSaved(false);
  }, [initialName, initialImage]);

  /* ── Submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Final validation pass
    const nameErr  = validateName(name);
    const imageErr = validateImage(image);
    if (nameErr || imageErr) {
      setErrors({ name: nameErr ?? undefined, image: imageErr ?? undefined });
      toast.error("Please fix the errors above.");
      return;
    }

    const toastId = toast.loading("Saving changes…");

    try {
      const { error } = await authClient.updateUser({
        name:  name.trim(),
        image: image.trim() || undefined,
      });

      if (error) {
        toast.error(error.message ?? "Update failed. Please try again.", {
          id: toastId,
        });
        return;
      }

      toast.success("Profile updated!", { id: toastId });
      setSaved(true);

      // Re-run the parent Server Component so navbar / profile page
      // immediately reflect the new name and avatar.
      startTransition(() => router.refresh());
    } catch {
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  }

  const canSave = isDirty && !errors.name && !errors.image && !isPending;

  /* ─────────────────────────────────────────────────────────── */
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-[560px] animate-[fadeUp_.6s_ease_both]"
    >
      {/* ── Back link ── */}
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 font-body text-[11px]
                   tracking-[.15em] uppercase text-base-content/40
                   hover:text-base-content transition-colors duration-200 mb-7"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
             stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
        </svg>
        Back to Profile
      </Link>

      {/* ── Page title ── */}
      <div className="mb-8">
        <p className="font-body text-[10px] tracking-[.38em] uppercase
                      text-base-content/40 mb-2">
          Account
        </p>
        <h1 className="font-display text-[42px] font-light leading-none">
          Update{" "}
          <em className="italic text-primary/70">Profile</em>
        </h1>
      </div>

      {/* ══════════════════════ CARD ══════════════════════ */}
      <div className="border border-base-200">

        {/* ── Live avatar strip ── */}
        <div className="bg-neutral px-8 py-7 flex items-center gap-5">
          <LiveAvatar name={name} imageUrl={image} size={68} />

          <div className="min-w-0 flex-1">
            <p className="font-display text-[22px] font-light text-neutral-content
                          leading-tight truncate">
              {name.trim() || "Tile Enthusiast"}
            </p>
            <p className="font-body text-[11.5px] text-neutral-content/40 truncate mt-0.5">
              {email}
            </p>
          </div>

          {/* "Unsaved" pill — visible when dirty */}
          {isDirty && (
            <span className="shrink-0 inline-flex items-center gap-1.5 font-body
                             text-[9px] tracking-[.18em] uppercase
                             px-2.5 py-1.5 bg-primary/15 text-primary/80
                             border border-primary/25">
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"/>
              </svg>
              Unsaved
            </span>
          )}

          {/* "Saved" check — visible after successful save */}
          {saved && !isDirty && (
            <span className="shrink-0 inline-flex items-center gap-1.5 font-body
                             text-[9px] tracking-[.18em] uppercase
                             px-2.5 py-1.5 bg-success/10 text-success
                             border border-success/25">
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
              </svg>
              Saved
            </span>
          )}
        </div>

        {/* ── Form fields ── */}
        <div className="bg-base-100 px-8 py-8">

          {/* Success banner */}
          {saved && !isDirty && (
            <div className="flex items-center gap-3 px-4 py-3 mb-6
                            bg-success/8 border border-success/25 text-success">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-body text-[13px]">
                Profile updated successfully!
              </span>
            </div>
          )}

          {/* Section label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="font-body text-[9.5px] tracking-[.28em] uppercase
                             text-base-content/40 shrink-0">
              Edit details
            </span>
            <span className="flex-1 h-px bg-base-200" />
          </div>

          {/* ── Name ── */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <label
                htmlFor="up-name"
                className="font-body text-[10.5px] tracking-[.18em] uppercase
                           text-base-content/55"
              >
                Full name
              </label>
              <span
                className={`font-body text-[10px] tabular-nums transition-colors ${
                  name.length > MAX_NAME - 10
                    ? "text-error"
                    : "text-base-content/35"
                }`}
              >
                {name.length} / {MAX_NAME}
              </span>
            </div>

            <input
              id="up-name"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              maxLength={MAX_NAME}
              placeholder="Your full name"
              autoComplete="name"
              className={[
                "w-full h-11 px-4 font-body text-[13.5px] bg-base-100",
                "text-base-content placeholder:text-base-content/30",
                "focus:outline-none transition-colors duration-200",
                errors.name
                  ? "border border-error focus:border-error"
                  : "border border-base-300 focus:border-primary",
              ].join(" ")}
            />

            {/* Name strength bar */}
            <NameStrengthBar score={score} />

            {errors.name && <FieldError message={errors.name} />}
          </div>

          {/* ── Image URL ── */}
          <div className="mb-2">
            <div className="flex items-baseline justify-between mb-2">
              <label
                htmlFor="up-image"
                className="font-body text-[10.5px] tracking-[.18em] uppercase
                           text-base-content/55"
              >
                Photo URL
                <span className="ml-1.5 normal-case tracking-normal text-[10px]
                                 text-base-content/30">
                  (optional)
                </span>
              </label>
            </div>

            <input
              id="up-image"
              type="url"
              value={image}
              onChange={(e) => handleImageChange(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              autoComplete="photo"
              className={[
                "w-full h-11 px-4 font-body text-[13.5px] bg-base-100",
                "text-base-content placeholder:text-base-content/30",
                "focus:outline-none transition-colors duration-200",
                errors.image
                  ? "border border-error focus:border-error"
                  : "border border-base-300 focus:border-primary",
              ].join(" ")}
            />

            <p className="font-body text-[11px] text-base-content/35 mt-2 leading-relaxed">
              Paste a direct link to a public image (JPG, PNG, WebP).
              Leave blank to display your initials.
            </p>

            {errors.image && <FieldError message={errors.image} />}

            {/* Live URL preview — shown when URL is non-empty and valid */}
            {image && imgValid && (
              <div className="flex items-center gap-3.5 mt-3 p-3
                              bg-base-200 border border-base-300">
                <LiveAvatar name={name} imageUrl={image} size={38} />
                <div className="min-w-0">
                  <p className="font-body text-[12px] text-base-content/70 truncate">
                    {image && isValidHttpUrl(image)
                      ? "This photo will be used as your avatar"
                      : "No photo — initials will be shown"}
                  </p>
                  <p className="font-body text-[10.5px] text-base-content/40 truncate">
                    {image
                      ? new URL(image).hostname
                      : "enter a URL above"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CTA row ── */}
        <div className="bg-base-100 border-t border-base-200 px-8 py-5
                        flex items-center gap-3 flex-wrap">
          <button
            type="submit"
            disabled={!canSave}
            className="h-11 px-8 inline-flex items-center justify-center gap-2.5
                       font-body text-[10.5px] tracking-[.22em] uppercase font-medium
                       bg-neutral text-neutral-content
                       hover:bg-primary hover:text-primary-content
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-200 min-w-[160px]"
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
            <span className="font-body text-[11.5px] text-base-content/35 ml-auto">
              Unsaved changes
            </span>
          )}
        </div>

      </div>
    </form>
  );
}
