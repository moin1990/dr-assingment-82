/**
 * app/all-tiles/loading.tsx
 *
 * Shown while the All Tiles server component fetches tile data.
 * Matches the real page layout pixel-for-pixel to prevent layout shift.
 */

/* ── Shimmer block ─────────────────────────────────────── */
function Shimmer({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={`block rounded-sm ${className}`}
      style={{
        background:
          "linear-gradient(90deg, hsl(var(--b2)) 25%, hsl(var(--b3)) 50%, hsl(var(--b2)) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite linear",
        ...style,
      }}
    />
  );
}

/* ── Skeleton tile card ────────────────────────────────── */
function SkeletonCard({ delay }: { delay: number }) {
  return (
    <div
      className="bg-base-100 flex flex-col"
      style={{ animationDelay: `${delay}s` }}
    >
      <div
        className="aspect-square w-full"
        style={{
          background:
            "linear-gradient(90deg, hsl(var(--b2)) 25%, hsl(var(--b3)) 50%, hsl(var(--b2)) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.6s infinite linear",
        }}
      />
      <div className="p-[18px] border-t border-base-200 flex flex-col gap-2.5">
        <Shimmer style={{ width: "45%", height: 9 }} />
        <Shimmer style={{ width: "75%", height: 14 }} />
        <Shimmer style={{ width: "35%", height: 9 }} />
        <Shimmer style={{ width: "100%", height: 36, marginTop: 8 }} />
      </div>
    </div>
  );
}

export default function AllTilesLoading() {
  return (
    <div
      className="min-h-screen bg-base-100"
      role="status"
      aria-label="Loading tiles…"
    >
      {/* ── Dark header skeleton ── */}
      <div className="bg-neutral border-b border-neutral-content/10">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-14 pb-10">
          <Shimmer
            style={{
              width: 120,
              height: 11,
              marginBottom: 14,
              background:
                "linear-gradient(90deg, rgba(255,255,255,.06) 25%, rgba(255,255,255,.12) 50%, rgba(255,255,255,.06) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
          <Shimmer
            style={{
              width: 280,
              height: 48,
              marginBottom: 20,
              background:
                "linear-gradient(90deg, rgba(255,255,255,.06) 25%, rgba(255,255,255,.12) 50%, rgba(255,255,255,.06) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <Shimmer
              style={{
                width: 300,
                height: 13,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,.06) 25%, rgba(255,255,255,.12) 50%, rgba(255,255,255,.06) 75%)",
                backgroundSize: "200% 100%",
              }}
            />
            <div className="flex gap-2.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    width: 72,
                    height: 58,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,.06) 25%, rgba(255,255,255,.12) 50%, rgba(255,255,255,.06) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.6s infinite linear",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Controls bar skeleton ── */}
      <div className="bg-base-100/95 border-b border-base-200 px-5 md:px-8 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center gap-2.5 flex-wrap">
          <Shimmer style={{ width: 220, height: 40 }} />
          {[80, 90, 75, 85].map((w, i) => (
            <Shimmer key={i} style={{ width: w, height: 32 }} />
          ))}
          <Shimmer style={{ width: 130, height: 40, marginLeft: "auto" }} />
        </div>
      </div>

      {/* ── Results bar skeleton ── */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-5 pb-1">
        <Shimmer style={{ width: 160, height: 11 }} />
      </div>

      {/* ── Grid skeleton — 8 cards ── */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-6 pb-20">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                     gap-px border border-base-300"
          style={{ background: "hsl(var(--b3))" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} delay={i * 0.05} />
          ))}
        </div>
      </div>

      {/* Keyframe (inline so it works without globals.css being loaded yet) */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
