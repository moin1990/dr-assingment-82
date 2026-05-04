/**
 * lib/api.ts
 * ─────────────────────────────────────────────────────────
 * Simulated API layer for tile data.
 *
 * All functions return Promises with a realistic artificial
 * delay so they behave identically to real HTTP calls.
 * Swap the import at the top for a `fetch("/api/tiles")`
 * and every call-site stays unchanged.
 */

import RAW_TILES from "./tiles-data.json";

/* ═══════════════════════════════════════════ TYPES ══════ */

export type TileCategory =
  | "hand-painted"
  | "geometric"
  | "terracotta"
  | "mosaic"
  | "floral"
  | "porcelain";

export interface Tile {
  id:          string;
  title:       string;
  description: string;
  image:       string;
  category:    TileCategory;
  price:       number;
  dimensions:  string;
  material:    string;
  inStock:     boolean;
}

export interface TileFilters {
  category?:    TileCategory;
  inStock?:     boolean;
  minPrice?:    number;
  maxPrice?:    number;
  search?:      string;  // matched against title + description
}

export type SortKey = "price-asc" | "price-desc" | "title-asc" | "title-desc";

export interface PaginatedResult<T> {
  data:        T[];
  total:       number;   // total matching records (before pagination)
  page:        number;
  perPage:     number;
  totalPages:  number;
  hasNext:     boolean;
  hasPrev:     boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data:    T;
  error?:  string;
}

/* ═══════════════════════════════════════════ INTERNALS ══ */

/** Typed in-memory dataset */
const DB: Tile[] = RAW_TILES as Tile[];

/**
 * Simulates network latency.
 * Pass `forceError: true` to test error-handling paths.
 */
function delay(ms = 400, forceError = false): Promise<void> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (forceError) {
        reject(new Error("Simulated network error"));
      } else {
        resolve();
      }
    }, ms)
  );
}

/** Apply filters to the in-memory dataset */
function applyFilters(tiles: Tile[], filters: TileFilters): Tile[] {
  return tiles.filter((t) => {
    if (filters.category !== undefined && t.category !== filters.category)
      return false;
    if (filters.inStock !== undefined && t.inStock !== filters.inStock)
      return false;
    if (filters.minPrice !== undefined && t.price < filters.minPrice)
      return false;
    if (filters.maxPrice !== undefined && t.price > filters.maxPrice)
      return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !t.title.toLowerCase().includes(q) &&
        !t.description.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

/** Sort a mutable copy of the array */
function applySort(tiles: Tile[], sort?: SortKey): Tile[] {
  const copy = [...tiles];
  switch (sort) {
    case "price-asc":  return copy.sort((a, b) => a.price - b.price);
    case "price-desc": return copy.sort((a, b) => b.price - a.price);
    case "title-asc":  return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc": return copy.sort((a, b) => b.title.localeCompare(a.title));
    default:           return copy; // preserve insertion order
  }
}

/** Wrap any value in a standard ApiResponse envelope */
function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

/* ═══════════════════════════════════════════ PUBLIC API ═ */

/**
 * fetchAllTiles
 * Returns every tile in the dataset.
 *
 * @example
 * const res = await fetchAllTiles();
 * if (res.success) console.log(res.data); // Tile[]
 */
export async function fetchAllTiles(): Promise<ApiResponse<Tile[]>> {
  await delay(350);
  return ok([...DB]);
}

/**
 * fetchTileById
 * Resolves with a single tile or null if not found.
 *
 * @example
 * const res = await fetchTileById("tile-003");
 * if (res.success && res.data) console.log(res.data.title);
 */
export async function fetchTileById(
  id: string
): Promise<ApiResponse<Tile | null>> {
  await delay(250);
  const tile = DB.find((t) => t.id === id) ?? null;
  return ok(tile);
}

/**
 * fetchTiles
 * Full-featured query: filter, sort, and paginate.
 *
 * @param filters  - Optional field-level filters
 * @param sort     - Optional sort key
 * @param page     - 1-based page number (default: 1)
 * @param perPage  - Items per page (default: 6)
 *
 * @example
 * const res = await fetchTiles(
 *   { category: "geometric", inStock: true },
 *   "price-asc",
 *   1,
 *   4
 * );
 */
export async function fetchTiles(
  filters: TileFilters = {},
  sort?: SortKey,
  page = 1,
  perPage = 6
): Promise<ApiResponse<PaginatedResult<Tile>>> {
  await delay(400);

  const filtered   = applyFilters(DB, filters);
  const sorted     = applySort(filtered, sort);
  const total      = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage   = Math.min(Math.max(1, page), totalPages);
  const start      = (safePage - 1) * perPage;
  const data       = sorted.slice(start, start + perPage);

  return ok({
    data,
    total,
    page:       safePage,
    perPage,
    totalPages,
    hasNext:    safePage < totalPages,
    hasPrev:    safePage > 1,
  });
}

/**
 * fetchFeaturedTiles
 * Returns the first N in-stock tiles (used on the Home page).
 *
 * @param limit - How many to return (default: 4)
 *
 * @example
 * const res = await fetchFeaturedTiles(4);
 * if (res.success) renderCards(res.data);
 */
export async function fetchFeaturedTiles(
  limit = 4
): Promise<ApiResponse<Tile[]>> {
  await delay(300);
  const featured = DB.filter((t) => t.inStock).slice(0, limit);
  return ok(featured);
}

/**
 * fetchTilesByCategory
 * Convenience wrapper — returns all tiles in a given category.
 *
 * @example
 * const res = await fetchTilesByCategory("mosaic");
 */
export async function fetchTilesByCategory(
  category: TileCategory
): Promise<ApiResponse<Tile[]>> {
  await delay(300);
  const tiles = DB.filter((t) => t.category === category);
  return ok(tiles);
}

/**
 * fetchCategories
 * Returns all unique category slugs present in the dataset.
 *
 * @example
 * const res = await fetchCategories();
 * // res.data → ["hand-painted", "geometric", ...]
 */
export async function fetchCategories(): Promise<ApiResponse<TileCategory[]>> {
  await delay(200);
  const cats = [...new Set(DB.map((t) => t.category))] as TileCategory[];
  return ok(cats);
}

/**
 * fetchPriceRange
 * Returns the global min and max price across the whole dataset.
 *
 * @example
 * const res = await fetchPriceRange();
 * // res.data → { min: 9.9, max: 89.0 }
 */
export async function fetchPriceRange(): Promise<
  ApiResponse<{ min: number; max: number }>
> {
  await delay(150);
  const prices = DB.map((t) => t.price);
  return ok({ min: Math.min(...prices), max: Math.max(...prices) });
}

/**
 * searchTiles
 * Full-text search across title and description.
 *
 * @example
 * const res = await searchTiles("moroccan");
 */
export async function searchTiles(
  query: string
): Promise<ApiResponse<Tile[]>> {
  await delay(300);
  const q = query.trim().toLowerCase();
  if (!q) return ok([...DB]);
  const results = DB.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.material.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
  );
  return ok(results);
}
