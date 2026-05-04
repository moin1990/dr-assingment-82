/**
 * app/profile/loading.tsx
 * Skeleton for both /profile and /profile/edit while session is fetched.
 */

function Shimmer({ w, h, className = "" }: { w?: string | number; h?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block rounded-sm ${className}`}
      style={{
        width: w ?? "100%",
        height: h ?? 12,
        background: "linear-gradient(90deg, hsl(var(--b2)) 25%, hsl(var(--b3)) 50%, hsl(var(--b2)) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite linear",
      }}
    />
  );
}

function DarkShimmer({ w, h }: { w?: string | number; h?: number }) {
  return (
    <span
      aria-hidden="true"
      className="block rounded-sm"
      style={{
        width: w ?? "100%",
        height: h ?? 12,
        background:
          "linear-gradient(90deg,rgba(255,255,255,.06) 25%,rgba(255,255,255,.12) 50%,rgba(255,255,255,.06) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s infinite linear",
      }}
    />
  );
}

export default function ProfileLoading() {
  return (
    <div
      className="min-h-[calc(100vh-64px)] bg-base-200 px-4 md:px-8 py-12"
      role="status"
      aria-label="Loading profile…"
    >
      <div className="max-w-[860px] mx-auto">
        {/* Heading */}
        <div className="mb-8">
          <Shimmer w={80} h={10} className="mb-3" />
          <Shimmer w={200} h={40} />
        </div>

        {/* Split card */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] border border-base-200">

          {/* Dark left panel */}
          <div className="bg-neutral px-8 py-10 flex flex-col items-center gap-5
                          border-b lg:border-b-0 lg:border-r border-neutral-content/8">
            <DarkShimmer w={96} h={96} />
            <DarkShimmer w={140} h={20} />
            <DarkShimmer w={180} h={12} />
            <div className="w-full flex flex-col gap-2.5 mt-2">
              {[0, 1, 2].map((i) => (
                <DarkShimmer key={i} w="100%" h={52} />
              ))}
            </div>
            <DarkShimmer w="100%" h={40} />
          </div>

          {/* Light right panel */}
          <div className="bg-base-100 px-8 md:px-10 py-10">
            <Shimmer w={80} h={10} className="mb-6" />
            <div className="flex items-center gap-3 mb-6">
              <Shimmer w={100} h={9} />
              <Shimmer h={1} />
            </div>
            <div className="flex flex-col gap-5">
              {[0, 1].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Shimmer w={80} h={10} />
                  <Shimmer h={44} />
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-base-200 flex gap-3">
              <Shimmer w={160} h={44} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
