/**
 * app/not-found.tsx
 *
 * Rendered whenever Next.js can't match a URL to a route,
 * OR when any Server Component calls notFound().
 *
 * Route-specific not-found pages (e.g. app/all-tiles/[id]/not-found.tsx)
 * override this one for their own segments.
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
};

export default function NotFound() {
  return (
    <div
      className="min-h-[calc(100vh-64px)] flex items-center justify-center
                 bg-base-100 px-5"
    >
      <div
        className="text-center max-w-[480px] animate-[fadeUp_.6s_ease_both]"
        role="main"
        aria-labelledby="nf-title"
      >
        {/* Decorative hex */}
        <p
          className="font-display text-[96px] font-light text-base-content/8
                     leading-none mb-4 select-none
                     animate-[pulse_3s_ease-in-out_infinite]"
          aria-hidden="true"
        >
          ⬡
        </p>

        {/* Code */}
        <p className="font-body text-[10px] tracking-[.38em] uppercase
                      text-base-content/30 mb-4">
          404 — Page not found
        </p>

        {/* Title */}
        <h1
          id="nf-title"
          className="font-display text-[40px] font-light leading-[1.05]
                     tracking-tight mb-3"
        >
          This tile has{" "}
          <em className="italic text-primary/60">gone missing</em>
        </h1>

        {/* Description */}
        <p className="font-body text-[14px] text-base-content/45 leading-relaxed
                      max-w-sm mx-auto mb-10">
          The page you&apos;re looking for doesn&apos;t exist, may have been moved,
          or the URL might be mistyped.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/all-tiles"
            className="w-full sm:w-auto h-11 px-8 inline-flex items-center
                       justify-center gap-2 font-body text-[10.5px] tracking-[.2em]
                       uppercase font-medium bg-neutral text-neutral-content
                       hover:bg-primary hover:text-primary-content
                       transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
            </svg>
            Browse All Tiles
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto h-11 px-7 inline-flex items-center
                       justify-center font-body text-[10.5px] tracking-[.2em]
                       uppercase border border-base-300 text-base-content/50
                       hover:border-base-content/40 hover:text-base-content
                       transition-all duration-200"
          >
            ← Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
