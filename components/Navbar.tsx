"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "@/components/AuthButton";
import { useEffect, useState } from "react";

/* ─── Config ─────────────────────────────────────────── */
interface NavLink { href: string; label: string }

const NAV_LINKS: NavLink[] = [
  { href: "/",        label: "Home"       },
  { href: "/all-tiles", label: "All Tiles"  },
  { href: "/profile", label: "My Profile" },
];

/* ─── Component ──────────────────────────────────────── */
export default function Navbar() {
  const pathname                = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  /* Close drawer on route change */
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      {/* ══════════════════════════════════════ NAVBAR ══ */}
      <header
        className={[
          "sticky top-0 z-50 w-full transition-all duration-300",
          "bg-base-100/90 backdrop-blur-md border-b border-base-300",
          scrolled ? "shadow-[0_2px_24px_rgba(0,0,0,0.07)]" : "",
        ].join(" ")}
      >
        <div className="navbar max-w-[1200px] mx-auto px-5 md:px-8 min-h-[64px]">

          {/* ── Logo ── */}
          <div className="navbar-start">
            <Link
              href="/"
              aria-label="Tile Gallery – Home"
              className="flex flex-col leading-none group"
            >
              <span className="font-display text-[26px] font-light tracking-[.14em] text-base-content group-hover:text-primary transition-colors duration-300">
                TILE
              </span>
              <span className="text-[8.5px] tracking-[.38em] uppercase text-base-content/40 font-body -mt-0.5">
                Gallery
              </span>
            </Link>
          </div>

          {/* ── Desktop Centre Links ── */}
          <nav className="navbar-center hidden md:flex" aria-label="Main navigation">
            <ul className="flex items-center gap-9 list-none">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "relative font-body text-[11px] tracking-[.22em] uppercase py-1",
                        "transition-colors duration-300",
                        /* underline slide-in */
                        "after:absolute after:-bottom-0.5 after:left-0 after:h-px",
                        "after:bg-primary after:transition-[width] after:duration-300",
                        active
                          ? "text-base-content after:w-full"
                          : "text-base-content/60 hover:text-base-content after:w-0 hover:after:w-full",
                      ].join(" ")}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ── Right: Login + Hamburger ── */}
          <div className="navbar-end flex items-center gap-3">

            {/* Auth button — shows Login or avatar dropdown ── */}
            <AuthButton />

            {/* Animated hamburger – mobile only */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              className="flex md:hidden flex-col gap-[5px] p-1.5 bg-transparent border-none cursor-pointer"
            >
              {[
                menuOpen ? "translate-y-[6.5px] rotate-45"  : "",
                menuOpen ? "opacity-0"                       : "",
                menuOpen ? "-translate-y-[6.5px] -rotate-45": "",
              ].map((extra, i) => (
                <span
                  key={i}
                  className={`block w-[22px] h-[1.5px] bg-base-content transition-all duration-300 ${extra}`}
                />
              ))}
            </button>
          </div>

        </div>
      </header>

      {/* ════════════════════════════════ MOBILE DRAWER ══ */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        className={[
          "fixed inset-0 top-[64px] z-40 md:hidden",
          "bg-base-100/98 backdrop-blur-xl",
          "flex flex-col items-center justify-center gap-8",
          "transition-opacity duration-250",
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className="font-body text-[14px] tracking-[.3em] uppercase
                       text-base-content/70 hover:text-base-content transition-colors duration-200"
          >
            {label}
          </Link>
        ))}
        <Link
          href="/login"
          className="mt-2 font-body text-[10px] tracking-[.2em] uppercase font-medium
                     px-10 py-3 border border-base-content text-base-content
                     hover:bg-base-content hover:text-base-100 transition-all duration-250"
        >
          Log In
        </Link>
      </div>
    </>
  );
}
