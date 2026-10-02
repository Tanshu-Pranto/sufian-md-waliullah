// The S mark: a 6 x 7 dot-matrix S whose first dot is lit in signal orange.
// Keep in sync with GLYPH in scripts/make-icons.py (favicon and app icons).
// HeroMark builds the same glyph, dot by dot, in the hero.
export const GLYPH = [".#####", "##....", "##....", ".####.", "....##", "....##", "#####."];
export const ACCENT = "5,0";

const [AX, AY] = ACCENT.split(",").map(Number);

export default function LogoMark({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 6 7" width={(size * 6) / 7} height={size} className={className} aria-hidden focusable="false">
      {GLYPH.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "#" ? <rect key={`${x},${y}`} x={x + 0.09} y={y + 0.09} width={0.82} height={0.82} fill="currentColor" /> : null,
        ),
      )}
      {/* The lit dot sits on top and runs the S on a loop; its twin lights the
          second dot where the S is two wide (.mark-run, .mark-twin in globals.css). */}
      <rect className="mark-twin" x={AX + 0.09} y={AY + 0.09} width={0.82} height={0.82} fill="var(--color-signal)" />
      <rect className="mark-run" x={AX + 0.09} y={AY + 0.09} width={0.82} height={0.82} fill="var(--color-signal)" />
    </svg>
  );
}
