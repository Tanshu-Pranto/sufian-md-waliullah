// The S mark: a 6 x 7 dot-matrix S whose first dot is lit in signal orange.
// Keep in sync with GLYPH in scripts/make-icons.py (favicon and app icons).
const GLYPH = [".#####", "##....", "##....", ".####.", "....##", "....##", "#####."];
const ACCENT = "5,0";

export default function LogoMark({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 6 7" width={(size * 6) / 7} height={size} className={className} aria-hidden focusable="false">
      {GLYPH.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "#" ? (
            <rect
              key={`${x},${y}`}
              x={x + 0.09}
              y={y + 0.09}
              width={0.82}
              height={0.82}
              fill={`${x},${y}` === ACCENT ? "var(--color-signal)" : "currentColor"}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
