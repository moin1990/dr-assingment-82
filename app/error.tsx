"use client";

/**
 * app/error.tsx
 *
 * Root-level error boundary. Catches any unhandled error thrown by a
 * Server or Client Component anywhere in the app.
 *
 * Must be "use client" — Next.js requires error boundaries to be client components.
 * Route-specific error.tsx files can override this for individual segments.
 */

import { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

interface ErrorPageProps {
  error:  Error & { digest?: string };
  reset:  () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  /* Show a toast the moment the error boundary mounts */
  useEffect(() => {
    toast.error(
      error.message?.length < 80
        ? error.message
        : "An unexpected error occurred.",
      { duration: 6000 }
    );
    /* Log to your error monitoring service here, e.g.:
       Sentry.captureException(error);               */
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex items-center justify-center
                 bg-base-100 px-5"
      role="alert"
      aria-live="assertive"
    >
      <div className="text-center max-w-[480px] animate-[fadeUp_.5s_ease_both]">

        {/* Error icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full
                        bg-error/8 border border-error/20
                        flex items-center justify-center">
          <svg className="w-7 h-7 text-error" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"/>
          </svg>
        </div>

        {/* Label */}
        <p className="font-body text-[10px] tracking-[.38em] uppercase
                      text-error/50 mb-4">
          Application error
        </p>

        {/* Title */}
        <h1 className="font-display text-[38px] font-light leading-[1.05]
                       tracking-tight mb-3">
          Something went{" "}
          <em className="italic text-error/70">wrong</em>
        </h1>

        {/* Description */}
        <p className="font-body text-[14px] text-base-content/45 leading-relaxed
                      max-w-sm mx-auto mb-5">
          An unexpected error occurred. It has been logged. You can try again
          or return to the home page.
        </p>

        {/* Error detail (dev-friendly, collapsed in prod) */}
        {error.message && (
          <details className="text-left mb-6 group">
            <summary className="font-body text-[11px] tracking-[.15em] uppercase
                                text-base-content/30 cursor-pointer
                                hover:text-base-content/50 transition-colors
                                list-none flex items-center gap-2 justify-center">
              <svg
                className="w-3 h-3 transition-transform group-open:rotate-90"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
              </svg>
              Error details
            </summary>
            <pre
              className="mt-3 px-4 py-3 bg-base-200 border border-base-300
                         font-mono text-[11px] text-base-content/50
                         text-left overflow-x-auto whitespace-pre-wrap break-all"
            >
              {error.message}
              {error.digest && `\n\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="w-full sm:w-auto h-11 px-8 inline-flex items-center
                       justify-center gap-2 font-body text-[10.5px] tracking-[.2em]
                       uppercase font-medium bg-neutral text-neutral-content
                       hover:bg-primary hover:text-primary-content
                       transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
            </svg>
            Try Again
          </button>

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

        {/* Error digest */}
        {error.digest && (
          <p className="font-body text-[10.5px] text-base-content/25 mt-6">
            Error ID: {error.digest}
          </p>
        )}

      </div>
    </div>
  );
}
