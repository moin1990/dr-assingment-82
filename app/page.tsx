import type { Metadata } from "next";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import HomeTileCard from "@/components/HomeTileCard";
import { FEATURED_TILES, MARQUEE_WORDS } from "@/lib/tiles";

export const metadata: Metadata = {
  title: "Tile Gallery — Discover Your Perfect Aesthetic",
  description:
    "Curated ceramic art from around the world — Moroccan zellige, Portuguese azulejos, terracotta, mosaic, and more.",
};

/* ─── Small server components ─────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-body text-[10px] tracking-[.4em] uppercase text-primary/80 mb-3">
      {children}
    </span>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-[52px] font-light text-primary leading-none mb-2">
        {num}
      </p>
      <p className="font-body text-[10px] tracking-[.3em] uppercase text-neutral-content/35">
        {label}
      </p>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════ BANNER ══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral">

        {/* Animated tile-grid overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-[gridDrift_30s_linear_infinite]"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(0deg,rgba(255,255,255,.04) 0,rgba(255,255,255,.04) 1px,transparent 1px,transparent 72px)",
              "repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0,rgba(255,255,255,.04) 1px,transparent 1px,transparent 72px)",
            ].join(","),
          }}
        />

        {/* Warm glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 60%,rgba(200,169,126,.12) 0%,transparent 70%)",
          }}
        />

        {/* Corner ornaments */}
        {[
          "top-8 left-8 border-t border-l",
          "top-8 right-8 border-t border-r",
          "bottom-8 left-8 border-b border-l",
          "bottom-8 right-8 border-b border-r",
        ].map((cls, i) => (
          <div
            key={i}
            aria-hidden="true"
            className={`absolute w-[120px] h-[120px] opacity-15 border-primary ${cls}`}
          />
        ))}

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 py-20 max-w-4xl mx-auto">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 mb-9 font-body text-[10px] tracking-[.4em] uppercase text-white/35 opacity-0 animate-[fadeUp_.7s_.2s_ease_forwards]">
            <span className="block w-9 h-px bg-primary/60" />
            Curated Ceramic Art
            <span className="block w-9 h-px bg-primary/60" />
          </div>

          {/* Heading */}
          <h1 className="font-display font-light leading-[.95] tracking-[-0.02em] text-white mb-10 text-[clamp(48px,9vw,110px)] opacity-0 animate-[fadeUp_.8s_.4s_ease_forwards]">
            Discover Your
            <br />
            <em className="italic text-primary">Perfect Aesthetic</em>
          </h1>

          {/* Sub-copy */}
          <p className="font-body text-[15px] text-white/40 leading-relaxed max-w-[440px] mx-auto mb-14 opacity-0 animate-[fadeUp_.7s_.6s_ease_forwards]">
            Centuries of ceramic heritage — from Moroccan zellige to Portuguese
            azulejos — curated for the discerning eye.
          </p>

          {/* CTA */}
          <Link
            href="/all-tiles"
            className="group inline-flex items-center gap-3 font-body text-[11px] tracking-[.25em] uppercase font-medium px-11 py-[18px] bg-primary text-primary-content hover:bg-primary/85 transition-[background,gap] duration-300 opacity-0 animate-[fadeUp_.7s_.8s_ease_forwards]"
          >
            Browse Now
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Scroll hint */}
        <div
          aria-hidden="true"
          className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-[fadeUp_.6s_1.2s_ease_forwards]"
        >
          <span className="font-body text-[9px] tracking-[.3em] uppercase text-white/20">
            Scroll
          </span>
          <span className="w-px h-10 bg-gradient-to-b from-white/15 to-transparent animate-[scrollPulse_1.8s_ease-in-out_infinite]" />
        </div>
      </section>

      {/* ══════════════════════════════════════ MARQUEE ══ */}
      <Marquee words={MARQUEE_WORDS} />

      {/* ════════════════════════════ FEATURED TILES ══ */}
      <section className="bg-base-100 py-[100px] px-5 md:px-8">
        <div className="max-w-[1200px] mx-auto">

          {/* Section header */}
          <div className="flex items-end justify-between mb-14 gap-5 flex-wrap">
            <div>
              <SectionLabel>Handpicked for You</SectionLabel>
              <h2 className="font-display text-[clamp(36px,5vw,58px)] font-light leading-[1.05]">
                Featured{" "}
                <em className="italic text-base-content/40">Tiles</em>
              </h2>
            </div>
            <Link
              href="/all-tiles"
              className="font-body text-[10px] tracking-[.25em] uppercase self-end mb-1 text-base-content/50 border-b border-base-300 pb-0.5 hover:text-primary hover:border-primary transition-colors duration-250"
            >
              View All Tiles →
            </Link>
          </div>

          {/* 4-column tile grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5">
            {FEATURED_TILES.map((tile, i) => (
              <HomeTileCard key={tile.id} tile={tile} delay={i * 120} />
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════ STATS STRIP ══ */}
      <div className="bg-neutral py-16 px-5">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10">
          <Stat num="2,400+" label="Tiles Catalogued" />
          <Stat num="38"    label="Countries of Origin" />
          <Stat num="12"    label="Style Categories" />
          <Stat num="2024"  label="Year Founded" />
        </div>
      </div>
    </>
  );
}
