export interface Tile {
  id: string;
  name: string;
  category: string;
  origin: string;
  tag: "Featured" | "Bestseller" | "New" | "Rare";
  material: string;
  dimensions: string;
  imageUrl: string;
  description?: string;
}

/* ─── Dummy data (swap with real API / CMS fetch) ─── */
export const FEATURED_TILES: Tile[] = [
  {
    id: "1",
    name: "Azulejo Estrela",
    category: "Hand-painted",
    origin: "Lisbon, Portugal",
    tag: "Featured",
    material: "Glazed ceramic",
    dimensions: "15×15 cm",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80",
    description:
      "Classic Portuguese star tile with deep cobalt blue hand-painting, inspired by 18th-century Lisbon facades.",
  },
  {
    id: "2",
    name: "Marrakech Grid",
    category: "Geometric",
    origin: "Fez, Morocco",
    tag: "Bestseller",
    material: "Encaustic cement",
    dimensions: "20×20 cm",
    imageUrl:
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=700&q=80",
    description:
      "Geometric encaustic tile inspired by the zellige tradition of Moroccan riads.",
  },
  {
    id: "3",
    name: "Terra Umbra",
    category: "Terracotta",
    origin: "Tuscany, Italy",
    tag: "New",
    material: "Terracotta",
    dimensions: "17×15 cm",
    imageUrl:
      "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=700&q=80",
    description:
      "Raw terracotta hex tile with natural earthy variation, hand-pressed in a Tuscan workshop.",
  },
  {
    id: "4",
    name: "Byzantine Mosaic",
    category: "Mosaic",
    origin: "Istanbul, Turkey",
    tag: "Rare",
    material: "Glass & stone tesserae",
    dimensions: "30×30 cm",
    imageUrl:
      "https://images.unsplash.com/photo-1549887534-1541e9326688?w=700&q=80",
    description:
      "Intricate mosaic fragment reminiscent of Byzantine church interiors, set in white mortar.",
  },
];

export const ALL_TILES: Tile[] = [
  ...FEATURED_TILES,
  {
    id: "5",
    name: "Rose Garden",
    category: "Floral",
    origin: "Staffordshire, England",
    tag: "Featured",
    material: "Porcelain",
    dimensions: "10×10 cm",
    imageUrl:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=700&q=80",
  },
  {
    id: "6",
    name: "Cement Lace",
    category: "Encaustic",
    origin: "Lyon, France",
    tag: "New",
    material: "Encaustic cement",
    dimensions: "20×20 cm",
    imageUrl:
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=700&q=80",
  },
];

export const MARQUEE_WORDS = [
  "Geometric",
  "Encaustic",
  "Hand-painted",
  "Moroccan Zellige",
  "Portuguese Azulejo",
  "Terracotta",
  "Mosaic",
  "Relief",
  "Porcelain",
  "Floral",
  "Art Nouveau",
  "Byzantine",
];
