"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut } from "@/lib/auth-client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const toastId = toast.loading("Signing out…");
    try {
      await signOut();
      toast.success("You've been signed out.", { id: toastId });
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Sign-out failed. Please try again.", { id: toastId });
    }
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full h-11 flex items-center justify-center gap-2
                 font-body text-[11px] tracking-[.2em] uppercase font-medium
                 border border-base-content/20 text-base-content/60
                 hover:border-error hover:text-error hover:bg-error/5
                 transition-all duration-200"
    >
      {/* Door-exit icon */}
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
           stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </svg>
      Sign Out
    </button>
  );
}
