export default function TileGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                    gap-px bg-base-300 border border-base-300">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-base-100 flex flex-col">
          {/* Image placeholder */}
          <div className="aspect-square bg-gradient-to-br from-base-200 to-base-300
                          animate-[shimmer_1.6s_infinite_linear]
                          [background-size:200%_100%]" />
          {/* Body placeholder */}
          <div className="p-[18px] border-t border-base-200 flex flex-col gap-3">
            <div className="h-2.5 w-2/5 rounded-sm bg-base-300 animate-pulse" />
            <div className="h-4   w-4/5 rounded-sm bg-base-300 animate-pulse" />
            <div className="h-2.5 w-1/3 rounded-sm bg-base-300 animate-pulse" />
            <div className="h-9   w-full rounded-sm bg-base-200 animate-pulse mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
