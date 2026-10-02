import { mulberry32 } from "@/lib/motion";

// Rows of square dots that grow denser toward the bottom edge, like the
// tail of a halftone print. Deterministic, so server and client agree.
export default function HalftoneFade({ className = "", cols = 56, rows = 12 }: { className?: string; cols?: number; rows?: number }) {
  const rand = mulberry32(5);
  const dots: { x: number; y: number; s: number }[] = [];
  for (let y = 0; y < rows; y++) {
    const t = (y + 1) / rows;
    for (let x = 0; x < cols; x++) {
      if (rand() > t * 1.15 - 0.05) continue;
      const s = 0.22 + 0.62 * t * (0.75 + rand() * 0.25);
      dots.push({ x: x + (1 - s) / 2, y: y + (1 - s) / 2, s });
    }
  }
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden
      focusable="false"
    >
      {dots.map((d, i) => (
        <rect key={i} x={d.x} y={d.y} width={d.s} height={d.s} fill="currentColor" />
      ))}
    </svg>
  );
}
