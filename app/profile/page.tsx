import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import ProfileClient from "@/components/ProfileClient";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and update your Tile Gallery account details.",
};

export default async function ProfilePage() {
  /* Redirects to /login?callbackUrl=/profile if not authenticated */
  const session = await requireSession("/profile");
  const user    = session.user;

  /* ── Derived display values (computed server-side) ── */
  const accountType = user.image?.includes("googleusercontent")
    ? "Google account"
    : "Email & password";

  const memberSince = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year:  "numeric",
  }).format(new Date(user.createdAt ?? Date.now()));

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200 px-4 md:px-8 py-12">
      <div className="max-w-[860px] mx-auto">

        {/* Page heading */}
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div>
            <p className="font-body text-[10px] tracking-[.38em] uppercase
                          text-base-content/40 mb-2">
              Account
            </p>
            <h1 className="font-display text-[42px] font-light leading-none">
              My{" "}
              <em className="italic text-primary/70">Profile</em>
            </h1>
          </div>

          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-2 font-body
                       text-[10px] tracking-[.2em] uppercase font-medium
                       h-10 px-6 border border-base-300 text-base-content/55
                       hover:bg-neutral hover:border-neutral hover:text-neutral-content
                       transition-all duration-200 mb-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"/>
            </svg>
            Edit Profile
          </Link>
        </div>

        {/* Client form island — receives server-fetched user as props */}
        <ProfileClient
          initialName={user.name  ?? ""}
          initialImage={user.image ?? ""}
          email={user.email ?? ""}
          accountType={accountType}
          memberSince={memberSince}
        />

      </div>
    </div>
  );
}
