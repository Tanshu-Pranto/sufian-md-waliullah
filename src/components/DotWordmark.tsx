"use client";

import { useEffect, useRef } from "react";
import { smoothstep } from "@/lib/motion";

const BASE = [44, 44, 50];
const SIGNAL = [255, 79, 18];

/**
 * The name set as a field of square dots across the footer. Dots near the
 * pointer swell and warm to the signal color.
 */
export default function DotWordmark({
  text,
  narrowLines,
  className = "",
}: {
  text: string;
  // How to break the text on phones; defaults to one word per line.
  narrowLines?: string[];
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  // A string, so a new array with the same lines doesn't rebuild the canvas.
  const narrow = narrowLines?.join("\n");

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let W = 0, H = 0, dpr = 1, cell = 8;
    let dots: { x: number; y: number; c: number }[] = [];
    let raf = 0, last = 0;
    const p = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, s: 0, target: 0 };

    const build = () => {
      const w = canvas.clientWidth;
      if (!w) return;
      W = w;
      cell = W < 640 ? 5 : W < 1024 ? 7 : 9;
      const family = getComputedStyle(document.body).fontFamily;
      const lines = W < 640 ? (narrow?.split("\n") ?? text.split(" ")) : [text];
      const measure = document.createElement("canvas").getContext("2d")!;
      measure.font = `600 100px ${family}`;
      const widest = Math.max(...lines.map((l) => measure.measureText(l).width));
      const size = (W / widest) * 100 * 0.98;
      const lineH = size * 0.78;
      H = Math.ceil(lineH * lines.length + size * 0.08);

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.height = `${H}px`;

      const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.font = `600 ${size / cell}px ${family}`;
      o.textBaseline = "alphabetic";
      o.fillStyle = "#fff";
      lines.forEach((l, i) => {
        const lw = o.measureText(l).width;
        o.fillText(l, (cols - lw) / 2, (lineH * (i + 1) - size * 0.04) / cell);
      });
      const data = o.getImageData(0, 0, cols, rows).data;
      dots = [];
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const a = data[(y * cols + x) * 4 + 3] / 255;
          if (a > 0.25) dots.push({ x: x * cell, y: y * cell, c: a });
        }
      draw();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const R = W < 640 ? 70 : 150;
      const half = cell / 2;
      ctx.fillStyle = `rgb(${BASE.join(" ")})`;
      const hot: number[] = [];
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dx = d.x + half - p.x, dy = d.y + half - p.y;
        if (p.s > 0.01 && dx * dx + dy * dy < R * R) {
          hot.push(i);
          continue;
        }
        const s = cell * 0.72 * Math.min(1, d.c * 1.2);
        ctx.fillRect(d.x + (cell - s) / 2, d.y + (cell - s) / 2, s, s);
      }
      for (const i of hot) {
        const d = dots[i];
        const l = smoothstep(R, R * 0.2, Math.hypot(d.x + half - p.x, d.y + half - p.y)) * p.s;
        const s = cell * (0.72 + 0.2 * l) * Math.min(1, d.c * 1.2);
        const c = BASE.map((b, k) => Math.round(b + (SIGNAL[k] - b) * l));
        ctx.fillStyle = `rgb(${c.join(" ")})`;
        ctx.fillRect(d.x + (cell - s) / 2, d.y + (cell - s) / 2, s, s);
      }
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) / 1000 : 0.016;
      last = now;
      const k = 1 - Math.exp(-dt * 12);
      p.x += (p.tx - p.x) * k;
      p.y += (p.ty - p.y) * k;
      p.s += (p.target - p.s) * (1 - Math.exp(-dt * 6));
      draw();
      const moving = Math.abs(p.tx - p.x) > 0.3 || Math.abs(p.ty - p.y) > 0.3 || Math.abs(p.target - p.s) > 0.004;
      if (moving) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      p.tx = e.clientX - r.left;
      p.ty = e.clientY - r.top;
      if (p.s < 0.02) {
        p.x = p.tx;
        p.y = p.ty;
      }
      p.target = 1;
      kick();
    };
    const onLeave = () => {
      p.target = 0;
      kick();
    };

    let ro: ResizeObserver | null = null;
    document.fonts.ready.then(() => {
      build();
      let lastW = canvas.clientWidth;
      ro = new ResizeObserver(() => {
        if (canvas.clientWidth === lastW) return;
        lastW = canvas.clientWidth;
        build();
      });
      ro.observe(canvas);
    });
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [text, narrow]);

  return (
    <div className={className}>
      <canvas ref={ref} className="block w-full" role="img" aria-label={text} />
    </div>
  );
}
