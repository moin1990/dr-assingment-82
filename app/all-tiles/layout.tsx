import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Tiles",
  description:
    "Browse our full curated collection of hand-painted, geometric, terracotta, mosaic and more tiles from around the world.",
};

export default function AllTilesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
