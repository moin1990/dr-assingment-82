# 🏛️ Tile Gallery

A curated Next.js 14 (App Router) gallery website for ceramic art & design tiles.

## ✨ Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 14 (App Router) | Framework |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3.4 | Utility styling |
| DaisyUI | 4 | Component library |
| Cormorant Garamond | — | Display font |
| DM Sans | — | Body font |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

---

## 📁 Folder Structure

```
tile-gallery/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (Navbar + Footer)
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles + Tailwind directives
│   ├── gallery/
│   │   └── page.tsx            # Gallery listing page
│   └── about/
│       └── page.tsx            # About page
│
├── components/                 # Shared UI components
│   ├── Navbar.tsx              # Sticky nav with theme toggle
│   ├── Footer.tsx              # Footer with links + social
│   ├── TileCard.tsx            # Individual tile card
│   ├── TileGrid.tsx            # Responsive tile grid
│   └── ui/                     # Low-level primitives (add as needed)
│
├── lib/
│   ├── utils.ts                # `cn()` class merge helper
│   └── data.ts                 # Mock tile data (replace with API)
│
├── types/
│   └── tile.ts                 # Tile, Collection, Filter types
│
├── public/
│   └── tiles/                  # Local tile images (if needed)
│
├── tailwind.config.ts          # Tailwind + DaisyUI theming
├── next.config.mjs             # Next.js image domains
└── tsconfig.json
```

---

## 🎨 Theming

Two DaisyUI themes are included:
- `gallery` — warm off-white light theme
- `gallery-dark` — deep charcoal dark theme

Toggle is available in the Navbar. Theme persists via `localStorage`.

To change theme colors, edit `tailwind.config.ts` under `daisyui.themes`.

---

## 🧩 Key Components

### `<TileCard />`
Renders a single tile with hover overlay, featured badge, and image.

### `<TileGrid />`
Responsive CSS grid with optional stagger-in animations.

### `<Navbar />`
Sticky header with scroll shadow, theme toggle, mobile dropdown.

### `<Footer />`
Three-column link grid with social icons and copyright bar.

---

## 🔌 Replacing Mock Data

Edit `lib/data.ts` or replace `MOCK_TILES` with a `fetch()` call in any
Server Component. The `Tile` type in `types/tile.ts` defines the shape.

```ts
// Example: fetch from your CMS or API
const tiles = await fetch("https://your-api.com/tiles").then(r => r.json());
```

---

## 📦 Adding Pages

```
app/
├── collections/
│   └── page.tsx        # /collections
├── contact/
│   └── page.tsx        # /contact
└── gallery/
    └── [id]/
        └── page.tsx    # /gallery/:id (tile detail)
```
