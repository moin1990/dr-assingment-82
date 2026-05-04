import { Tile } from "@/types/tile";
import TileCard from "./TileCard";

interface TileGridProps {
  tiles: Tile[];
  /** Stagger in animations */
  animated?: boolean;
}

export default function TileGrid({ tiles, animated }: TileGridProps) {
  if (tiles.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="font-display text-2xl text-base-content/30 font-light">
          No tiles found
        </p>
        <p className="text-sm text-base-content/40 mt-2 font-body">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="gallery-grid">
      {tiles.map((tile, i) => (
        <div
          key={tile.id}
          className={
            animated
              ? `opacity-anim stagger-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}`
              : undefined
          }
        >
          <TileCard
            tile={tile}
            wide={tile.featured && i === 0}
          />
        </div>
      ))}
    </div>
  );
}
