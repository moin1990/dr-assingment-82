import Image from "next/image";
import Link from "next/link";
import type { Tile } from "@/types/tile";

interface RelatedTilesProps {
  tiles: Tile[];
}

export default function RelatedTiles({ tiles }: RelatedTilesProps) {
  if (!tiles.length) return null;

  return (
    <section className="border-t border-base-200 mt-16 pt-14 pb-20
                        max-w-[1200px] mx-auto px-5 md:px-8">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="font-display text-[32px] font-light leading-tight">
          Related{" "}
          <em className="italic text-base-content/40">Tiles</em>
        </h2>
        <Link
          href="/all-tiles"
          className="font-body text-[10px] tracking-[.2em] uppercase
                     text-base-content/40 border-b border-base-300 pb-px
                     hover:text-primary hover:border-primary transition-colors duration-200"
        >
          View all →
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px
                      bg-base-300 border border-base-300">
        {tiles.map((tile) => (
          <Link
            key={tile.id}
            href={`/all-tiles/${tile.id}`}
            className="group bg-base-100 flex flex-col overflow-hidden"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-base-200">
              <Image
                src={tile.image}
                alt={tile.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-600
                           ease-[cubic-bezier(.25,.46,.45,.94)]
                           group-hover:scale-[1.05]"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              />
            </div>

            {/* Body */}
            <div className="p-4 border-t border-base-200 flex flex-col gap-1">
              <span className="font-body text-[9px] tracking-[.22em] uppercase
                               text-base-content/40">
                {tile.category}
              </span>
              <span className="font-display text-[18px] font-light
                               text-base-content group-hover:text-primary
                               transition-colors duration-200 line-clamp-1">
                {tile.title}
              </span>
              <span className="font-body text-[13px] font-medium text-base-content mt-0.5">
                €{tile.price.toFixed(2)}
                <span className="text-[10px] font-normal text-base-content/40 ml-0.5">
                  /tile
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
