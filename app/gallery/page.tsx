import { Metadata } from "next";
import TileGrid from "@/components/TileGrid";
import { MOCK_TILES } from "@/lib/data";
import { TileCategory } from "@/types/tile";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our full collection of curated tiles.",
};

const CATEGORIES: { label: string; value: TileCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Geometric", value: "geometric" },
  { label: "Floral", value: "floral" },
  { label: "Encaustic", value: "encaustic" },
  { label: "Mosaic", value: "mosaic" },
  { label: "Terracotta", value: "terracotta" },
  { label: "Porcelain", value: "porcelain" },
  { label: "Hand-painted", value: "hand-painted" },
  { label: "Relief", value: "relief" },
];

interface GalleryPageProps {
  searchParams: { category?: string; search?: string };
}

export default function GalleryPage({ searchParams }: GalleryPageProps) {
  const activeCategory = searchParams.category || "all";

  const filtered =
    activeCategory === "all"
      ? MOCK_TILES
      : MOCK_TILES.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* ── Page header ── */}
      <div className="bg-base-200 border-b border-base-300 py-12">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <p className="text-[10px] tracking-[0.35em] uppercase text-base-content/40 font-body mb-2">
            {filtered.length} tiles
          </p>
          <h1 className="section-title">Gallery</h1>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="sticky top-16 z-40 bg-base-100/90 backdrop-blur-md border-b border-base-300">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-3 overflow-x-auto">
          <div className="flex gap-1.5 min-w-max">
            {CATEGORIES.map(({ label, value }) => (
              <a
                key={value}
                href={value === "all" ? "/gallery" : `/gallery?category=${value}`}
                className={`btn btn-xs rounded-none text-[9px] tracking-widest uppercase font-body transition-all ${
                  activeCategory === value
                    ? "btn-primary"
                    : "btn-ghost border border-base-content/15 hover:btn-primary"
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-screen-xl mx-auto py-8">
        <TileGrid tiles={filtered} animated />
      </div>
    </div>
  );
}
