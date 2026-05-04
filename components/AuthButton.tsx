"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, signOut } from "@/lib/auth-client";

export default function AuthButton() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const user   = session?.user;

  async function handleSignOut() {
    const id = toast.loading("Signing out…");
    try {
      await signOut();
      toast.success("See you next time!", { id });
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Sign-out failed.", { id });
    }
  }

  /* Loading shimmer */
  if (isPending) {
    return (
      <div className="w-20 h-8 bg-base-300 animate-pulse" />
    );
  }

  /* Logged-out state */
  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden md:inline-flex items-center justify-center
                   font-body text-[10px] tracking-[.2em] uppercase font-medium
                   px-[22px] py-2.5 border border-base-content text-base-content
                   hover:bg-base-content hover:text-base-100
                   transition-all duration-250"
      >
        Log In
      </Link>
    );
  }

  /* Logged-in state — avatar dropdown */
  const initials = (user.name ?? "?")
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="dropdown dropdown-end hidden md:block">
      {/* Trigger */}
      <button
        tabIndex={0}
        className="flex items-center gap-2.5 group"
        aria-label="Account menu"
      >
        {/* Avatar circle */}
        <div className="relative w-8 h-8 overflow-hidden bg-primary/15
                        flex items-center justify-center shrink-0">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "Avatar"}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="font-display text-[13px] font-light text-primary leading-none">
              {initials}
            </span>
          )}
        </div>
        {/* Name — hidden on small-ish desktops */}
        <span className="hidden lg:block font-body text-[11px] tracking-[.1em]
                         text-base-content/70 group-hover:text-base-content
                         transition-colors duration-200 max-w-[100px] truncate">
          {user.name?.split(" ")[0] ?? "Account"}
        </span>
        {/* Chevron */}
        <svg className="w-3 h-3 text-base-content/40" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 border border-base-300
                   shadow-lg mt-3 w-52 z-50 p-1 font-body text-[12px]"
      >
        {/* User info header */}
        <li className="px-3 py-2.5 border-b border-base-300 mb-1 pointer-events-none">
          <div>
            <p className="font-medium text-[13px] text-base-content truncate">
              {user.name ?? "Tile Enthusiast"}
            </p>
            <p className="text-[11px] text-base-content/40 truncate">
              {user.email}
            </p>
          </div>
        </li>

        <li>
          <Link href="/profile"
                className="tracking-[.05em] hover:bg-base-200 rounded-none px-3 py-2">
            My Profile
          </Link>
        </li>
        <li>
          <Link href="/favorites"
                className="tracking-[.05em] hover:bg-base-200 rounded-none px-3 py-2">
            Favorites
          </Link>
        </li>
        <li>
          <Link href="/settings"
                className="tracking-[.05em] hover:bg-base-200 rounded-none px-3 py-2">
            Settings
          </Link>
        </li>

        {/* Divider */}
        <li className="border-t border-base-300 mt-1 pt-1">
          <button
            onClick={handleSignOut}
            className="w-full text-left tracking-[.05em] text-error/80
                       hover:text-error hover:bg-error/5 rounded-none px-3 py-2"
          >
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
}
