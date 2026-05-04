import Image from "next/image";
import Link from "next/link";
import type { Tile } from "@/types/tile";

/* ── Tag colour map ────────────────────────────────────── */
const TAG_STYLES: Record<string, string> = {
  Featured:   "bg-primary/90   text-primary-content",
  Bestseller: "bg-amber-500/90 text-amber-950",
  New:        "bg-emerald-500/90 text-emerald-950",
  Rare:       "bg-rose-500/85  text-white",
};

/* ── Star renderer ─────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  const full  = Math.round(rating);
  const empty = 5 - full;
  return (
    <span className="text-primary text-[12px] tracking-[-0.5px]" aria-hidden="true">
      {"★".repeat(full)}
      <span className="text-base-content/20">{"★".repeat(empty)}</span>
    </span>
  );
}

/* ── Component ─────────────────────────────────────────── */
interface TileCardProps {
  tile:  Tile;
  index?: number;
}

export default function TileCard({ tile, index = 0 }: TileCardProps) {
  const delay = `${Math.min(index * 0.05, 0.4)}s`;

  return (
    <article
      className="group relative flex flex-col bg-base-100 overflow-hidden
                 opacity-0 animate-[fadeUp_.5s_ease_forwards]"
      style={{ animationDelay: delay }}
    >
      {/* ── Image ── */}
      <div className="relative aspect-square overflow-hidden bg-base-200">
        <Image
          src={tile.image}
          alt={tile.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700
                     ease-[cubic-bezier(.25,.46,.45,.94)]
                     group-hover:scale-[1.07]"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        />

        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60
                        to-transparent opacity-0 transition-opacity duration-400
                        group-hover:opacity-100 pointer-events-none" />

        {/* Tag badge */}
        {tile.tag && (
          <span className={`absolute top-3 left-3 z-10 font-body text-[8.5px]
                            tracking-[.2em] uppercase font-medium px-2.5 py-1.5
                            backdrop-blur-sm ${TAG_STYLES[tile.tag] ?? ""}`}>
            {tile.tag}
          </span>
        )}

        {/* Stock dot */}
        <span
          title={tile.inStock ? "In stock" : "Out of stock"}
          className={`absolute top-3 right-3 z-10 w-2.5 h-2.5 rounded-full
                      border-2 border-white/60
                      ${tile.inStock ? "bg-emerald-400" : "bg-base-content/30"}`}
        />

        {/* Hover "View Details" pill */}
        <Link
          href={`/all-tiles/${tile.id}`}
          tabIndex={-1}
          aria-hidden="true"
          className="absolute bottom-3.5 right-3.5 z-10 font-body
                     text-[9px] tracking-[.22em] uppercase font-medium
                     px-3.5 py-2 bg-primary text-primary-content
                     opacity-0 translate-y-1.5
                     transition-[opacity,transform] duration-300 delay-[40ms]
                     group-hover:opacity-100 group-hover:translate-y-0
                     hover:bg-primary/80"
        >
          View Details →
        </Link>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col gap-1.5 p-[18px] border-t border-base-200 flex-1">

        <span className="font-body text-[9.5px] tracking-[.25em] uppercase
                         text-base-content/40">
          {tile.category}{tile.origin ? ` · ${tile.origin}` : ""}
        </span>

        <h2 className="font-display text-[20px] font-light leading-tight
                       text-base-content line-clamp-1">
          {tile.title}
        </h2>

        <div className="flex items-center justify-between mt-0.5">
          <span className="font-body text-[14px] font-medium">
            €{tile.price.toFixed(2)}
            <span className="text-[10px] font-normal text-base-content/40 ml-0.5">
              /tile
            </span>
          </span>
          <span className="font-body text-[11px] text-base-content/40">
            {tile.dimensions.width}×{tile.dimensions.height} {tile.dimensions.unit}
          </span>
        </div>

        {tile.rating !== undefined && (
          <div className="flex items-center gap-1.5">
            <Stars rating={tile.rating} />
            <span className="font-body text-[11px] text-base-content/50">
              {tile.rating} ({tile.reviewCount})
            </span>
          </div>
        )}

        {/* View Details button — always visible */}
        <Link
          href={`/all-tiles/${tile.id}`}
          className="mt-auto pt-3 w-full h-9 flex items-center justify-center gap-2
                     font-body text-[10px] tracking-[.2em] uppercase font-medium
                     border border-base-content/15 text-base-content/60
                     hover:bg-neutral hover:border-neutral hover:text-neutral-content
                     transition-all duration-200"
        >
          View Details
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
