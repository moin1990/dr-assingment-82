import Image from "next/image";
import Link from "next/link";
import type { Tile } from "@/lib/tiles";

/* Tag colour map */
const TAG_STYLES: Record<Tile["tag"], string> = {
  Featured:   "bg-primary/90 text-primary-content",
  Bestseller: "bg-amber-500/90 text-amber-950",
  New:        "bg-emerald-500/90 text-emerald-950",
  Rare:       "bg-rose-500/90 text-rose-950",
};

interface HomeTileCardProps {
  tile: Tile;
  /** Stagger delay in ms */
  delay?: number;
}

export default function HomeTileCard({ tile, delay = 0 }: HomeTileCardProps) {
  return (
    <article
      className="group relative overflow-hidden bg-base-300 aspect-[3/4] cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* ── Image ── */}
      <Image
        src={tile.imageUrl}
        alt={tile.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(.25,.46,.45,.94)]
                   group-hover:scale-[1.06]"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
      />

      {/* ── Permanent gradient base ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/15 to-transparent" />

      {/* ── Hover dark wash ── */}
      <div className="absolute inset-0 bg-stone-950/25 opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

      {/* ── Tag badge ── */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className={`inline-block text-[8.5px] tracking-[.2em] uppercase font-body font-medium
                      px-2.5 py-1.5 backdrop-blur-sm ${TAG_STYLES[tile.tag]}`}
        >
          {tile.tag}
        </span>
      </div>

      {/* ── Info overlay ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 p-6
                   translate-y-2 transition-transform duration-400 ease-out
                   group-hover:translate-y-0"
      >
        <span className="block font-body text-[9px] tracking-[.3em] uppercase
                         text-white/50 mb-1.5">
          {tile.category}&nbsp;·&nbsp;{tile.material}&nbsp;·&nbsp;{tile.dimensions}
        </span>

        <h3 className="font-display text-[22px] font-light text-white leading-tight mb-1">
          {tile.name}
        </h3>

        <p className="font-body text-[11.5px] text-white/45 mb-5">{tile.origin}</p>

        {/* ── View Details CTA – slides up on hover ── */}
        <Link
          href={`/all-tiles/${tile.id}`}
          className="inline-flex items-center gap-2 font-body
                     text-[9.5px] tracking-[.2em] uppercase font-medium
                     px-[18px] py-[9px] bg-primary text-primary-content
                     opacity-0 translate-y-2.5
                     transition-[opacity,transform,background-color] duration-300 delay-[50ms]
                     group-hover:opacity-100 group-hover:translate-y-0
                     hover:bg-primary/80"
        >
          View Details
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
