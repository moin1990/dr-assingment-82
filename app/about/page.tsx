import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Tile Gallery.",
};

export default function AboutPage() {
  return (
    <div className="max-w-screen-md mx-auto px-4 md:px-8 py-20">
      <p className="text-[10px] tracking-[0.35em] uppercase text-primary font-body mb-6">
        Our story
      </p>
      <h1 className="section-title mb-10">
        A passion for
        <br />
        <em className="not-italic text-primary">ceramic art</em>
      </h1>

      <div className="prose prose-lg max-w-none font-body text-base-content/70 leading-relaxed space-y-5">
        <p>
          Tile Gallery was born from a simple obsession: the belief that tiles
          are among humanity&apos;s most democratic art forms — functional,
          beautiful, and deeply cultural.
        </p>
        <p>
          From the intricate zellige of Fez to the bold encaustic cement tiles
          of colonial Havana, every piece in our collection tells a story of
          place, craft, and time.
        </p>
        <p>
          We work directly with artisans and heritage workshops to document,
          preserve, and share these traditions with a global audience.
        </p>
      </div>

      <div className="divider-ornament my-10">
        <span className="text-[9px] tracking-[0.3em] uppercase font-body">
          ✦
        </span>
      </div>

      <Link
        href="/gallery"
        className="btn btn-primary rounded-none px-10 text-xs tracking-widest uppercase"
      >
        Explore the collection
      </Link>
    </div>
  );
}
