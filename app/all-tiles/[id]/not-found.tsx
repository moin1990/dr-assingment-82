import Link from "next/link";

export default function TileNotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center
                    bg-base-100 px-5">
      <div className="text-center max-w-sm">
        {/* Hexagon icon */}
        <p className="font-display text-[80px] font-light text-base-content/10 leading-none mb-6">
          ⬡
        </p>

        <h1 className="font-display text-[32px] font-light leading-tight mb-2">
          Tile Not Found
        </h1>
        <p className="font-body text-[13px] text-base-content/45 leading-relaxed mb-8">
          This tile doesn&apos;t exist or may have been removed from the collection.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/all-tiles"
            className="font-body text-[10.5px] tracking-[.2em] uppercase font-medium
                       px-7 py-3 bg-neutral text-neutral-content
                       hover:bg-primary hover:text-primary-content
                       transition-colors duration-200"
          >
            Browse All Tiles
          </Link>
          <Link
            href="/"
            className="font-body text-[10.5px] tracking-[.2em] uppercase font-medium
                       px-7 py-3 border border-base-300 text-base-content/60
                       hover:border-base-content hover:text-base-content
                       transition-colors duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
