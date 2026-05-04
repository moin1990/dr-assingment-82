import type { Metadata } from "next";
import { Suspense } from "react";
import AllTilesClient from "@/components/AllTilesClient";
import TileGridSkeleton from "@/components/TileGridSkeleton";
import { fetchTiles } from "@/lib/api/tiles";

export const metadata: Metadata = {
  title: "All Tiles",
  description:
    "Browse our full collection — ceramic tiles across 7 categories from artisans worldwide.",
};

export default async function AllTilesPage() {
  /* Server-side fetch — swap body for real CMS/DB call when ready */
  const { data: tiles } = await fetchTiles({}, { page: 1, pageSize: 100 });

  const categoryCount = [...new Set(tiles.map((t) => t.category))].length;
  const inStockCount  = tiles.filter((t) => t.inStock).length;
  const featuredCount = tiles.filter((t) => t.tag === "Featured").length;

  return (
    <div className="min-h-screen bg-base-100">

      {/* ── Dark header ── */}
      <div className="bg-neutral border-b border-neutral-content/10">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-14 pb-10">

          <p className="font-body text-[10px] tracking-[.38em] uppercase
                        text-neutral-content/30 mb-3">
            Browse the collection
          </p>

          <h1 className="font-display font-light leading-[.95] tracking-tight
                         text-[clamp(38px,6vw,64px)] text-neutral-content">
            All <em className="italic text-primary">Tiles</em>
          </h1>

          <div className="flex items-end justify-between gap-4 mt-5 flex-wrap">
            <p className="font-body text-[13px] text-neutral-content/40
                          max-w-md leading-relaxed">
              {tiles.length} pieces across {categoryCount} categories —
              sourced from artisans and heritage workshops worldwide.
            </p>

            {/* Stat pills */}
            <div className="flex gap-2.5 flex-wrap">
              {[
                { num: tiles.length,   label: "Tiles"    },
                { num: inStockCount,   label: "In Stock"  },
                { num: featuredCount,  label: "Featured"  },
              ].map(({ num, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center px-5 py-2.5
                             border border-neutral-content/10 min-w-[72px]"
                >
                  <span className="font-display text-[24px] font-light text-primary leading-none">
                    {num}
                  </span>
                  <span className="font-body text-[9px] tracking-[.25em] uppercase
                                   text-neutral-content/30 mt-0.5">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Client shell — search + filter + grid ── */}
      <Suspense
        fallback={
          <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8">
            <TileGridSkeleton count={12} />
          </div>
        }
      >
        <AllTilesClient tiles={tiles} />
      </Suspense>
    </div>
  );
}
