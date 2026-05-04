import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { fetchTileById, fetchRelatedTiles } from "@/lib/api/tiles";
import QuantitySelector from "@/components/QuantitySelector";
import RelatedTiles from "@/components/RelatedTiles";

/* ── Tag colours ─────────────────────────────────────── */
const TAG_STYLES: Record<string, string> = {
  Featured:   "bg-primary/90 text-primary-content",
  Bestseller: "bg-amber-500/90 text-amber-950",
  New:        "bg-emerald-500/90 text-emerald-950",
  Rare:       "bg-rose-500/85 text-white",
};

/* ── Metadata ────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data: tile } = await fetchTileById(id);
  if (!tile) return { title: "Tile Not Found" };

  return {
    title: tile.title,
    description: tile.description,
    openGraph: {
      title:       `${tile.title} | Tile Gallery`,
      description: tile.description,
      images:      [tile.image],
    },
  };
}

/* ── Spec row helper ─────────────────────────────────── */
function SpecCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 border-r border-b border-base-200 last:border-r-0">
      <p className="font-body text-[9.5px] tracking-[.22em] uppercase
                    text-base-content/40 mb-1.5">
        {label}
      </p>
      <p className="font-body text-[13.5px] text-base-content">{value}</p>
    </div>
  );
}

/* ── Star renderer ───────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  const full  = Math.round(rating);
  const empty = 5 - full;
  return (
    <span className="text-primary text-[14px] tracking-[-0.5px]" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(full)}
      <span className="text-base-content/15">{"★".repeat(empty)}</span>
    </span>
  );
}

/* ── Page ────────────────────────────────────────────── */
export default async function TileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  /* ── Auth gate — redirects to /login if not signed in ── */
  await requireSession(`/all-tiles/${id}`);

  /* ── Data ── */
  const [{ data: tile }, related] = await Promise.all([
    fetchTileById(id),
    fetchRelatedTiles(id, 3),
  ]);

  if (!tile) notFound();

  /* ── Derived values ── */
  const sqm      = (tile.dimensions.width / 100) * (tile.dimensions.height / 100);
  const perSqm   = (tile.price / sqm).toFixed(2);

  const specs = [
    { label: "Material",   value: tile.material },
    { label: "Dimensions", value: `${tile.dimensions.width}×${tile.dimensions.height} ${tile.dimensions.unit}` },
    { label: "Category",   value: tile.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) },
    { label: "Origin",     value: tile.origin ?? "—" },
    { label: "Per m²",     value: `€${perSqm}` },
    { label: "Reviews",    value: tile.reviewCount ? `${tile.reviewCount} reviews` : "—" },
  ];

  /* ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-base-100">

      {/* ── Breadcrumb ── */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-[1200px] mx-auto px-5 md:px-8 pt-5 pb-0"
      >
        <ol className="flex items-center gap-2 list-none">
          {[
            { label: "Home",      href: "/"          },
            { label: "All Tiles", href: "/all-tiles" },
            { label: tile.title,  href: null         },
          ].map(({ label, href }, i) => (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span className="font-body text-[10px] text-base-content/25">›</span>
              )}
              {href ? (
                <Link
                  href={href}
                  className="font-body text-[11px] tracking-[.12em] uppercase
                             text-base-content/40 hover:text-base-content
                             transition-colors duration-200"
                >
                  {label}
                </Link>
              ) : (
                <span className="font-body text-[11px] tracking-[.12em] uppercase
                                 text-base-content/70">
                  {label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* ══════════════ HERO SPLIT ══════════════ */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 border border-base-200
                        animate-[fadeUp_.6s_ease_both]">

          {/* ── LEFT — large image ── */}
          <div className="relative overflow-hidden bg-base-200 min-h-[400px] lg:min-h-[580px]">
            <Image
              src={tile.image}
              alt={tile.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-[8s] ease-linear
                         hover:scale-[1.04]"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            />

            {/* Tag badge */}
            {tile.tag && (
              <span
                className={`absolute top-5 left-5 z-10 font-body text-[9px]
                            tracking-[.22em] uppercase font-medium px-3 py-1.5
                            backdrop-blur-sm ${TAG_STYLES[tile.tag] ?? ""}`}
              >
                {tile.tag}
              </span>
            )}

            {/* Stock chip */}
            <div
              className={`absolute bottom-5 left-5 z-10 inline-flex items-center gap-2
                          font-body text-[10px] tracking-[.15em] uppercase font-medium
                          px-3.5 py-2 bg-base-100/90 backdrop-blur-sm
                          border border-base-content/8`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${tile.inStock ? "bg-emerald-400" : "bg-base-content/30"}`}
              />
              {tile.inStock ? "In Stock" : "Out of Stock"}
            </div>

            {/* Image counter pill */}
            <span className="absolute bottom-5 right-5 z-10 font-body text-[10px]
                             text-base-content/50 bg-base-100/85 backdrop-blur-sm
                             px-2.5 py-1.5 border border-base-content/8">
              1 / 1
            </span>
          </div>

          {/* ── RIGHT — details ── */}
          <div className="flex flex-col p-8 md:p-10 lg:p-12
                          border-t lg:border-t-0 lg:border-l border-base-200">

            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 mb-4">
              <span className="font-body text-[10px] tracking-[.3em] uppercase
                               text-primary/80">
                {tile.category.replace(/-/g, " ")}
              </span>
              <span className="w-px h-3 bg-base-300" />
              <span className="font-body text-[10px] tracking-[.15em] uppercase
                               text-base-content/40">
                {tile.origin}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-[clamp(28px,4vw,48px)] font-light
                           leading-[1] tracking-tight text-base-content mb-3">
              {tile.title.split(" ").slice(0, -1).join(" ")}{" "}
              <em className="italic text-base-content/50">
                {tile.title.split(" ").pop()}
              </em>
            </h1>

            {/* Rating */}
            {tile.rating !== undefined && (
              <div className="flex items-center gap-2 mb-5">
                <Stars rating={tile.rating} />
                <span className="font-body text-[12px] text-base-content/45">
                  {tile.rating} out of 5 ({tile.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Description */}
            <p className="font-body text-[13.5px] leading-[1.75] text-base-content/60
                          border-b border-base-200 pb-6 mb-6">
              {tile.description}
            </p>

            {/* Spec grid — 2 × 3 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 border border-base-200 mb-2">
              {specs.map(({ label, value }) => (
                <SpecCell key={label} label={label} value={value} />
              ))}
            </div>

            {/* Quantity + CTA — client island */}
            <QuantitySelector
              price={tile.price}
              inStock={tile.inStock}
              title={tile.title}
            />
          </div>
        </div>
      </div>

      {/* ══════════════ RELATED TILES ══════════════ */}
      <RelatedTiles tiles={related} />
    </div>
  );
}
