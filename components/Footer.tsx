import Link from "next/link";

/* ─── Data ───────────────────────────────────────────── */
const EXPLORE_LINKS = [
  { href: "/",                        label: "Home"        },
  { href: "/gallery",                 label: "All Tiles"   },
  { href: "/collections",             label: "Collections" },
  { href: "/gallery?filter=new",      label: "New Arrivals"},
  { href: "/gallery?filter=featured", label: "Featured"    },
  { href: "/about",                   label: "About"       },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
           className="w-3.5 h-3.5">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.1.119.114.223.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

/* ─── Sub-components ─────────────────────────────────── */

/** Outline-circle social icon button */
function SocialButton({
  href, label, children,
}: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="w-9 h-9 rounded-full flex items-center justify-center
                 border border-neutral-content/15 text-neutral-content/40
                 hover:border-primary hover:text-primary hover:bg-primary/8
                 transition-all duration-300"
    >
      {children}
    </a>
  );
}

/** Icon + text contact row */
function ContactRow({
  icon, text,
}: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-primary/80 shrink-0">{icon}</span>
      <span className="font-body text-[12.5px] text-neutral-content/55">{text}</span>
    </div>
  );
}

/* ─── Footer ─────────────────────────────────────────── */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral text-neutral-content border-t border-neutral-content/6 mt-auto">

      {/* ── Main grid ── */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-14 pb-12
                      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {/* ── Brand + Socials ── */}
        <div className="space-y-5">
          {/* Logo */}
          <Link href="/" className="inline-flex flex-col leading-none group" aria-label="Tile Gallery Home">
            <span className="font-display text-[28px] font-light tracking-[.16em] text-neutral-content group-hover:text-primary transition-colors duration-300">
              TILE
            </span>
            <span className="text-[8px] tracking-[.4em] uppercase text-neutral-content/30 font-body -mt-0.5">
              Gallery
            </span>
          </Link>

          <p className="font-body text-[12.5px] text-neutral-content/45 leading-relaxed max-w-[220px]">
            A curated world of exceptional tiles, patterns, and ceramic art from across the globe.
          </p>

          {/* Social icons */}
          <div className="flex gap-2.5 pt-1" aria-label="Social media">
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <SocialButton key={label} href={href} label={label}>
                {icon}
              </SocialButton>
            ))}
          </div>
        </div>

        {/* ── Explore links ── */}
        <div>
          <h3 className="font-body text-[9px] tracking-[.3em] uppercase text-neutral-content/30 font-normal mb-5">
            Explore
          </h3>
          <ul className="space-y-[11px] list-none">
            {EXPLORE_LINKS.map(({ href, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="font-body text-[13px] text-neutral-content/55 hover:text-primary transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Contact + Newsletter ── */}
        <div className="space-y-4">
          <h3 className="font-body text-[9px] tracking-[.3em] uppercase text-neutral-content/30 font-normal mb-5">
            Contact
          </h3>

          <ContactRow
            text="hello@tilegallery.com"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                   className="w-3.5 h-3.5">
                <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
              </svg>
            }
          />
          <ContactRow
            text="+880 1700 000 000"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                   className="w-3.5 h-3.5">
                <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
              </svg>
            }
          />
          <ContactRow
            text="Dhaka, Bangladesh"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                   className="w-3.5 h-3.5">
                <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
              </svg>
            }
          />

          {/* Newsletter */}
          <div className="pt-3">
            <h4 className="font-body text-[9px] tracking-[.3em] uppercase text-neutral-content/30 font-normal mb-4">
              Newsletter
            </h4>
            {/* NOTE: wire up onSubmit to your email service */}
            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Email address for newsletter"
                className="flex-1 bg-neutral-content/6 border border-neutral-content/12
                           border-r-0 px-3.5 py-2.5 font-body text-[12px] text-neutral-content
                           placeholder:text-neutral-content/25
                           outline-none focus:border-primary/50 transition-colors"
              />
              <button
                type="submit"
                className="bg-primary text-primary-content font-body
                           text-[9px] tracking-[.2em] uppercase font-medium
                           px-4 border border-primary
                           hover:bg-primary/85 transition-colors duration-200"
              >
                Join
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-neutral-content/6">
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-4
                        flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-[11px] text-neutral-content/22 tracking-wide">
            © {year} Tile Gallery. All rights reserved.
          </p>
          <p className="font-body text-[10px] tracking-[.25em] uppercase text-neutral-content/15">
            Crafted with care
          </p>
        </div>
      </div>

    </footer>
  );
}
