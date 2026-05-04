"use client";

import { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AllTilesError({ error, reset }: ErrorProps) {
  useEffect(() => {
    toast.error("Failed to load tiles. Please try again.");
    console.error("[AllTilesError]", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center
                    px-5 py-20">
      <div className="text-center max-w-[420px] animate-[fadeUp_.5s_ease_both]">

        <div className="w-14 h-14 mx-auto mb-5 rounded-full
                        bg-error/8 border border-error/20
                        flex items-center justify-center">
          <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"/>
          </svg>
        </div>

        <h2 className="font-display text-[30px] font-light mb-2">
          Failed to load tiles
        </h2>
        <p className="font-body text-[13px] text-base-content/45 leading-relaxed mb-7">
          We couldn&apos;t fetch the tile collection. Check your connection and try again.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="h-10 px-7 inline-flex items-center gap-2 font-body
                       text-[10px] tracking-[.2em] uppercase font-medium
                       bg-neutral text-neutral-content
                       hover:bg-primary hover:text-primary-content
                       transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
            </svg>
            Retry
          </button>
          <Link
            href="/"
            className="h-10 px-6 inline-flex items-center font-body
                       text-[10px] tracking-[.2em] uppercase
                       border border-base-300 text-base-content/50
                       hover:border-base-content/40 hover:text-base-content
                       transition-all duration-200"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
