"use client";

import { useState, useMemo, useTransition, useCallback } from "react";
import TileCard from "@/components/TileCard";
import TileGridSkeleton from "@/components/TileGridSkeleton";
import type { Tile, TileCategory, SortOption } from "@/types/tile";

/* ── Data ────────────────────────────────────────────── */
const CATEGORIES: { value: TileCategory | "all"; label: string }[] = [
  { value: "all",          label: "All"         },
  { value: "hand-painted", label: "Hand-painted" },
  { value: "geometric",    label: "Geometric"    },
  { value: "terracotta",   label: "Terracotta"   },
  { value: "mosaic",       label: "Mosaic"       },
  { value: "floral",       label: "Floral"       },
  { value: "encaustic",    label: "Encaustic"    },
  { value: "porcelain",    label: "Porcelain"    },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest",      label: "Newest"              },
  { value: "price-asc",   label: "Price: Low → High"   },
  { value: "price-desc",  label: "Price: High → Low"   },
  { value: "rating-desc", label: "Top Rated"            },
  { value: "title-asc",   label: "A → Z"               },
];

/* ── Props ───────────────────────────────────────────── */
interface AllTilesClientProps {
  tiles: Tile[];
}

/* ── Component ───────────────────────────────────────── */
export default function AllTilesClient({ tiles }: AllTilesClientProps) {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState<TileCategory | "all">("all");
  const [sortBy,   setSortBy]   = useState<SortOption>("newest");
  const [isPending, startTransition] = useTransition();

  /* ── Derived filtered + sorted list ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return [...tiles]
      .filter((t) => {
        // Category filter
        if (category !== "all" && t.category !== category) return false;
        // Search filter — title, material, origin
        if (q) {
          const hit =
            t.title.toLowerCase().includes(q)    ||
            t.material.toLowerCase().includes(q) ||
            (t.origin ?? "").toLowerCase().includes(q);
          if (!hit) return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":   return a.price  - b.price;
          case "price-desc":  return b.price  - a.price;
          case "rating-desc": return (b.rating ?? 0) - (a.rating ?? 0);
          case "title-asc":   return a.title.localeCompare(b.title);
          default:            return b.id.localeCompare(a.id); // newest
        }
      });
  }, [tiles, search, category, sortBy]);

  /* ── Handlers ── */
  const handleSearch = useCallback((val: string) => {
    startTransition(() => setSearch(val));
  }, []);

  const handleCategory = useCallback((val: TileCategory | "all") => {
    startTransition(() => setCategory(val));
  }, []);

  const handleSort = useCallback((val: SortOption) => {
    startTransition(() => setSortBy(val));
  }, []);

  const resetAll = useCallback(() => {
    startTransition(() => {
      setSearch("");
      setCategory("all");
      setSortBy("newest");
    });
  }, []);

  /* ─────────────────────────────────────────────────── */
  return (
    <>
      {/* ══════════════════════════ CONTROLS BAR ══ */}
      <div
        className="sticky top-[64px] z-40 bg-base-100/95 backdrop-blur-md
                   border-b border-base-200"
      >
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-3
                        flex items-center gap-2.5 flex-wrap">

          {/* Search input */}
          <div className="relative flex-1 min-w-[180px] max-w-[340px]">
            {/* Search icon */}
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5
                         text-base-content/35 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
            >
              <circle cx="11" cy="11" r="8"/>
              <path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
            </svg>

            <input
              type="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search tiles…"
              aria-label="Search tiles by name, material or origin"
              className="w-full h-10 pl-9 pr-8 font-body text-[13px]
                         bg-base-200 border border-base-200 text-base-content
                         placeholder:text-base-content/30
                         focus:outline-none focus:border-primary focus:bg-base-100
                         transition-colors duration-200"
            />

            {/* Clear button */}
            {search && (
              <button
                onClick={() => handleSearch("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2
                           text-base-content/30 hover:text-base-content transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          {/* Category pills — horizontally scrollable */}
          <div
            className="flex gap-1.5 overflow-x-auto scrollbar-none flex-1"
            role="group"
            aria-label="Filter by category"
          >
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleCategory(value)}
                aria-pressed={category === value}
                className={[
                  "shrink-0 h-8 px-3.5 font-body text-[9.5px] tracking-[.18em]",
                  "uppercase font-medium border transition-all duration-200",
                  category === value
                    ? "bg-neutral border-neutral text-neutral-content"
                    : "bg-transparent border-base-300 text-base-content/55 hover:border-base-content/40 hover:text-base-content",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value as SortOption)}
            aria-label="Sort tiles"
            className="h-10 px-3 font-body text-[11px] tracking-[.08em]
                       bg-base-200 border border-base-200 text-base-content/70
                       focus:outline-none focus:border-primary
                       transition-colors duration-200 cursor-pointer ml-auto shrink-0"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ══════════════════════ RESULTS COUNT BAR ══ */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-5 pb-1
                      flex items-center justify-between gap-4">
        <p className="font-body text-[12px] text-base-content/40">
          Showing{" "}
          <span className="font-medium text-base-content/70">{filtered.length}</span>
          {" "}of{" "}
          <span className="font-medium text-base-content/70">{tiles.length}</span>
          {" "}tiles
          {search && (
            <span className="text-base-content/40">
              {" "}for &ldquo;<em className="not-italic text-base-content/60">{search}</em>&rdquo;
            </span>
          )}
        </p>

        {(search || category !== "all") && (
          <button
            onClick={resetAll}
            className="font-body text-[10px] tracking-[.15em] uppercase
                       text-base-content/40 hover:text-primary transition-colors duration-200"
          >
            Clear filters ×
          </button>
        )}
      </div>

      {/* ════════════════════════════════ GRID ══ */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-6 pb-20">
        {isPending ? (
          <TileGridSkeleton count={filtered.length || 12} />
        ) : filtered.length === 0 ? (
          /* ── Empty state ── */
          <div className="py-24 flex flex-col items-center justify-center gap-4
                          text-center border border-base-200">
            <span className="font-display text-5xl font-light text-base-content/15">
              ⬡
            </span>
            <div>
              <p className="font-display text-2xl font-light text-base-content/40 mb-1">
                No tiles found
              </p>
              <p className="font-body text-[13px] text-base-content/30">
                Try adjusting your search or filters
              </p>
            </div>
            <button
              onClick={resetAll}
              className="font-body text-[10px] tracking-[.2em] uppercase font-medium
                         px-6 py-2.5 border border-base-content/20 text-base-content/50
                         hover:bg-neutral hover:border-neutral hover:text-neutral-content
                         transition-all duration-200 mt-2"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          /* ── Tile grid ── */
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                       gap-px bg-base-300 border border-base-300"
          >
            {filtered.map((tile, i) => (
              <TileCard key={tile.id} tile={tile} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
