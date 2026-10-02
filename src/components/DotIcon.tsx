"use client";

import { useEffect, useRef } from "react";
import { dotIcons, type DotIconName } from "@/data/dot-icons";
import { hasFinePointer, prefersReducedMotion, smoothstep } from "@/lib/motion";

type Dot = { x: number; y: number; s: number; accent: boolean };
const cache = new Map<string, Dot[]>();

// Rasterize the vector icon into a grid and turn each covered cell into a
// square dot, sized by how much of the cell the stroke covers.
function rasterize(name: DotIconName, grid: number): Dot[] {
  const key = `${name}:${grid}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const S = 8;
  const W = grid * S;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = W;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  const coverage = (paths: readonly string[]) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, W);
    ctx.setTransform(W / 256, 0, 0, W / 256, 0, 0);
    for (const d of paths) ctx.fill(new Path2D(d));
    const data = ctx.getImageData(0, 0, W, W).data;
    const out = new Float32Array(grid * grid);
    for (let gy = 0; gy < grid; gy++) {
      for (let gx = 0; gx < grid; gx++) {
        let sum = 0;
        for (let y = 0; y < S; y++) {
          const row = ((gy * S + y) * W + gx * S) * 4 + 3;
          for (let x = 0; x < S; x++) sum += data[row + x * 4];
        }
        out[gy * grid + gx] = sum / (S * S * 255);
      }
    }
    return out;
  };

  const line = coverage(dotIcons[name].line);
  const fill = coverage(dotIcons[name].fill);
  const dots: Dot[] = [];
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      const l = line[y * grid + x];
      const f = fill[y * grid + x];
      if (l > 0.28) dots.push({ x, y, s: 0.42 + 0.32 * smoothstep(0.28, 0.75, l), accent: false });
      // Fills are dithered to half density so they read as tone, not a block.
      else if (f > 0.6 && (x + y) % 2 === 0) dots.push({ x, y, s: 0.5, accent: true });
    }
  }
  cache.set(key, dots);
  return dots;
}

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * A large Phosphor icon redrawn as a dot-matrix. Dots assemble in a diagonal
 * sweep the first time it scrolls into view, and ripple out from the pointer
 * on hover. Decorative, so it is hidden from assistive tech.
 */
export default function DotIcon({
  name,
  size = 96,
  grid,
  className = "",
  accent = true,
}: {
  name: DotIconName;
  size?: number;
  grid?: number;
  className?: string;
  accent?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  // Around 20 cells keeps the regular-weight stroke one dot wide, like Doto.
  const g = grid ?? Math.max(16, Math.min(24, Math.round(size / 5)));

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const dots = rasterize(name, g);
    const frag = document.createDocumentFragment();
    for (const d of dots) {
      const r = document.createElementNS(SVG_NS, "rect");
      const o = (1 - d.s) / 2;
      r.setAttribute("x", String(d.x + o));
      r.setAttribute("y", String(d.y + o));
      r.setAttribute("width", String(d.s));
      r.setAttribute("height", String(d.s));
      r.setAttribute("fill", d.accent && accent ? "var(--color-signal)" : "currentColor");
      r.style.setProperty("--d", `${Math.round((d.x + d.y) * (900 / (g * 2)))}ms`);
      frag.appendChild(r);
    }
    svg.replaceChildren(frag);

    let ready = false;
    let lastRipple = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // Two frames so the hidden state paints before we transition out of it.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            svg.dataset.shown = "";
            setTimeout(() => (ready = true), 1300);
          }),
        );
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(svg);

    const onEnter = (e: PointerEvent) => {
      if (!ready || prefersReducedMotion() || !hasFinePointer()) return;
      const now = performance.now();
      if (now - lastRipple < 700) return;
      lastRipple = now;
      const box = svg.getBoundingClientRect();
      const px = ((e.clientX - box.left) / box.width) * g;
      const py = ((e.clientY - box.top) / box.height) * g;
      svg.querySelectorAll("rect").forEach((r, i) => {
        const d = dots[i];
        r.style.setProperty("--r", `${Math.round(Math.hypot(d.x - px, d.y - py) * 22)}ms`);
      });
      delete svg.dataset.ripple;
      void svg.getBoundingClientRect();
      svg.dataset.ripple = "";
    };
    svg.addEventListener("pointerenter", onEnter);
    return () => {
      io.disconnect();
      svg.removeEventListener("pointerenter", onEnter);
    };
  }, [name, g, accent]);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${g} ${g}`}
      width={size}
      height={size}
      className={`dot-icon shrink-0 ${className}`}
      data-assemble=""
      aria-hidden
      focusable="false"
    />
  );
}
