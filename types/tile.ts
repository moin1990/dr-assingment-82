/* ─────────────────────────────────────────────────────────
   types/tile.ts — single source of truth for all tile types
   ───────────────────────────────────────────────────────── */

export type TileCategory =
  | "hand-painted"
  | "geometric"
  | "terracotta"
  | "mosaic"
  | "floral"
  | "encaustic"
  | "porcelain";

export type TileTag = "Featured" | "Bestseller" | "New" | "Rare";

export type SortOption =
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "newest"
  | "title-asc";

/* ── Core tile shape (mirrors tiles-data.json) ── */
export interface TileDimensions {
  width:  number;
  height: number;
  unit:   "cm" | "in";
}

export interface Tile {
  id:          string;
  title:       string;
  description: string;
  image:       string;
  category:    TileCategory;
  price:       number;
  dimensions:  TileDimensions;
  material:    string;
  inStock:     boolean;
  origin?:      string;
  tag?:         TileTag;
  rating?:      number;
  reviewCount?: number;
}

/* ── Query / response shapes ── */
export interface TileFilters {
  category?:  TileCategory | "all";
  inStock?:   boolean;
  minPrice?:  number;
  maxPrice?:  number;
  tag?:       TileTag;
  search?:    string;
  sortBy?:    SortOption;
}

export interface PaginationParams {
  page:     number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data:       T[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
  hasNext:    boolean;
  hasPrev:    boolean;
}

export type FetchTilesResult = PaginatedResult<Tile>;

export interface TileDetailResult {
  data:  Tile | null;
  error: string | null;
}
