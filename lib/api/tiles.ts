/**
 * lib/api/tiles.ts
 *
 * Simulated tile API. All functions mirror the signature you would use
 * against a real REST or GraphQL endpoint, so swapping in a real fetch()
 * later requires only changing the internals of each function — not any
 * call site in the app.
 *
 * Simulated network delay:  80–200 ms  (configurable via SIMULATE_DELAY_MS)
 * Simulated error rate:     0 %        (set SIMULATE_ERROR_RATE to test UI)
 */

import RAW_DATA from "@/lib/tiles-data.json";
import type {
  Tile,
  TileFilters,
  PaginationParams,
  FetchTilesResult,
  TileDetailResult,
  SortOption,
} from "@/types/tile";

/* ─── Config ─────────────────────────────────────────────── */

const SIMULATE_DELAY_MS  = { min: 80, max: 200 };
const SIMULATE_ERROR_RATE = 0; // 0–1 fraction, e.g. 0.1 = 10 % random failures

/* ─── Internal helpers ───────────────────────────────────── */

/** Cast the raw JSON import to the typed Tile array */
const DB: Tile[] = RAW_DATA as Tile[];

/** Artificial network latency */
function delay(): Promise<void> {
  const ms =
    SIMULATE_DELAY_MS.min +
    Math.random() * (SIMULATE_DELAY_MS.max - SIMULATE_DELAY_MS.min);
  return new Promise((r) => setTimeout(r, ms));
}

/** Optionally throw a simulated network error */
function maybeThrow(): void {
  if (SIMULATE_ERROR_RATE > 0 && Math.random() < SIMULATE_ERROR_RATE) {
    throw new Error("Simulated network error — please try again.");
  }
}

/** Apply all active filters to the full dataset */
function applyFilters(tiles: Tile[], filters: TileFilters): Tile[] {
  return tiles.filter((t) => {
    if (filters.category && filters.category !== "all") {
      if (t.category !== filters.category) return false;
    }
    if (filters.inStock !== undefined) {
      if (t.inStock !== filters.inStock) return false;
    }
    if (filters.minPrice !== undefined) {
      if (t.price < filters.minPrice) return false;
    }
    if (filters.maxPrice !== undefined) {
      if (t.price > filters.maxPrice) return false;
    }
    if (filters.tag) {
      if (t.tag !== filters.tag) return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const hit =
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.origin ?? "").toLowerCase().includes(q) ||
        t.material.toLowerCase().includes(q);
      if (!hit) return false;
    }
    return true;
  });
}

/** Sort a tile array in place and return it */
function applySort(tiles: Tile[], sortBy: SortOption = "newest"): Tile[] {
  return [...tiles].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":   return a.price - b.price;
      case "price-desc":  return b.price - a.price;
      case "rating-desc": return (b.rating ?? 0) - (a.rating ?? 0);
      case "title-asc":   return a.title.localeCompare(b.title);
      case "newest":
      default:
        // "newest" = reverse insertion order in the JSON (last id first)
        return b.id.localeCompare(a.id);
    }
  });
}

/** Slice a sorted array into a single page */
function paginate<T>(
  items: T[],
  { page, pageSize }: PaginationParams
): { slice: T[]; total: number } {
  const total  = items.length;
  const start  = (page - 1) * pageSize;
  const slice  = items.slice(start, start + pageSize);
  return { slice, total };
}

/* ─── Public API functions ───────────────────────────────── */

/**
 * fetchTiles
 *
 * Returns a paginated, filtered, sorted list of tiles.
 *
 * @example
 * const result = await fetchTiles(
 *   { category: "geometric", inStock: true, sortBy: "price-asc" },
 *   { page: 1, pageSize: 6 }
 * );
 * console.log(result.data);        // Tile[]
 * console.log(result.total);       // total matching tiles
 * console.log(result.totalPages);  // pages available
 */
export async function fetchTiles(
  filters: TileFilters = {},
  pagination: PaginationParams = { page: 1, pageSize: 12 }
): Promise<FetchTilesResult> {
  await delay();
  maybeThrow();

  const filtered = applyFilters(DB, filters);
  const sorted   = applySort(filtered, filters.sortBy);
  const { slice, total } = paginate(sorted, pagination);

  const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));

  return {
    data:      slice,
    total,
    page:      pagination.page,
    pageSize:  pagination.pageSize,
    totalPages,
    hasNext:   pagination.page < totalPages,
    hasPrev:   pagination.page > 1,
  };
}

/**
 * fetchTileById
 *
 * Returns a single tile by id, or null if not found.
 *
 * @example
 * const { data, error } = await fetchTileById("tile-003");
 * if (error) console.error(error);
 * else console.log(data?.title);
 */
export async function fetchTileById(id: string): Promise<TileDetailResult> {
  await delay();
  try {
    maybeThrow();
    const data = DB.find((t) => t.id === id) ?? null;
    return {
      data,
      error: data ? null : `Tile with id "${id}" was not found.`,
    };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
}

/**
 * fetchFeaturedTiles
 *
 * Convenience wrapper that returns tiles tagged as "Featured",
 * sorted by rating (highest first), limited to `limit` items.
 *
 * @example
 * const tiles = await fetchFeaturedTiles(4);
 */
export async function fetchFeaturedTiles(limit = 4): Promise<Tile[]> {
  const result = await fetchTiles(
    { tag: "Featured", sortBy: "rating-desc" },
    { page: 1, pageSize: limit }
  );
  return result.data;
}

/**
 * fetchTilesByCategory
 *
 * Returns all in-stock tiles in a given category.
 *
 * @example
 * const tiles = await fetchTilesByCategory("geometric");
 */
export async function fetchTilesByCategory(
  category: Tile["category"],
  pagination?: PaginationParams
): Promise<FetchTilesResult> {
  return fetchTiles(
    { category, inStock: true, sortBy: "rating-desc" },
    pagination ?? { page: 1, pageSize: 12 }
  );
}

/**
 * fetchRelatedTiles
 *
 * Given a tile id, returns up to `limit` other tiles that share
 * the same category, excluding the source tile itself.
 *
 * @example
 * const related = await fetchRelatedTiles("tile-002", 3);
 */
export async function fetchRelatedTiles(
  tileId: string,
  limit = 3
): Promise<Tile[]> {
  await delay();
  maybeThrow();

  const source = DB.find((t) => t.id === tileId);
  if (!source) return [];

  return DB
    .filter((t) => t.id !== tileId && t.category === source.category)
    .slice(0, limit);
}

/**
 * searchTiles
 *
 * Full-text search across title, description, origin, and material.
 *
 * @example
 * const result = await searchTiles("cobalt blue");
 * console.log(result.data.map(t => t.title));
 */
export async function searchTiles(
  query: string,
  pagination?: PaginationParams
): Promise<FetchTilesResult> {
  return fetchTiles(
    { search: query, sortBy: "rating-desc" },
    pagination ?? { page: 1, pageSize: 12 }
  );
}

/**
 * fetchAllCategories
 *
 * Returns every distinct category string present in the dataset.
 * Useful for building filter UIs without hardcoding category lists.
 *
 * @example
 * const cats = await fetchAllCategories();
 * // ["hand-painted", "geometric", "terracotta", ...]
 */
export async function fetchAllCategories(): Promise<string[]> {
  await delay();
  return [...new Set(DB.map((t) => t.category))].sort();
}

/**
 * fetchPriceRange
 *
 * Returns the min and max price across the entire dataset,
 * handy for initialising a price-range slider.
 *
 * @example
 * const { min, max } = await fetchPriceRange();
 */
export async function fetchPriceRange(): Promise<{ min: number; max: number }> {
  await delay();
  const prices = DB.map((t) => t.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}
