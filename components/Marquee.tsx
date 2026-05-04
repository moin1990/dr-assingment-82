interface MarqueeProps {
  words: string[];
  /** px/s – lower = slower. Default 60 */
  speed?: number;
}

export default function Marquee({ words, speed = 60 }: MarqueeProps) {
  // Quadruple the items so the loop is truly seamless at any viewport width
  const items = [...words, ...words, ...words, ...words];
  // Derive animation duration from word count × speed factor
  const duration = `${(words.length * 6).toFixed(0)}s`;

  return (
    <div
      className="overflow-hidden bg-primary border-y border-primary-content/10"
      aria-hidden="true"
    >
      <div
        className="flex w-max gap-0 py-[18px]"
        style={{
          animation: `marqueeScroll ${duration} linear infinite`,
        }}
      >
        {items.map((word, i) => (
          <span
            key={i}
            className="flex items-center gap-7 px-7 whitespace-nowrap
                       font-display text-[18px] italic text-primary-content/90
                       tracking-[.04em]"
          >
            {word}
            <span className="w-[5px] h-[5px] rounded-full bg-primary-content/30 shrink-0" />
          </span>
        ))}
      </div>

      {/* keyframe injected once via a <style> tag */}
      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0) }
          to   { transform: translateX(-50%) }
        }
      `}</style>
    </div>
  );
}
