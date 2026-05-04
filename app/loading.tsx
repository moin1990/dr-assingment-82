/**
 * app/loading.tsx
 *
 * Root-level loading UI shown by Next.js while any page in the app
 * is streaming / fetching. Automatically wrapped in <Suspense> by the framework.
 *
 * Individual route segments (all-tiles, profile, etc.) have their own
 * loading.tsx files that override this one.
 */

export default function RootLoading() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center
                    justify-center gap-6 bg-base-100"
         role="status"
         aria-label="Loading page…"
    >
      {/* Animated tile hex */}
      <div className="relative">
        <span className="font-display text-[72px] font-light text-base-content/10 leading-none
                         animate-[pulse_2s_ease-in-out_infinite]">
          ⬡
        </span>
        {/* Gold spinner ring */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-10 h-10 rounded-full border-2 border-base-300
                           border-t-primary animate-spin" />
        </span>
      </div>

      {/* Label */}
      <p className="font-body text-[10px] tracking-[.35em] uppercase
                    text-base-content/30 animate-[pulse_2s_ease-in-out_infinite]">
        Loading…
      </p>
    </div>
  );
}
