"use client";

import { useEffect, useRef } from "react";
import { bayer8, noise3, prefersReducedMotion, smoothstep } from "@/lib/motion";

/**
 * Slow organic blobs, ordered-dithered into square dots. The pointer swells
 * the field under it. Runs only while on screen.
 */
export default function DitherField({ className = "", label }: { className?: string; label?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = prefersReducedMotion();
    const cell = 5;
    let W = 0, H = 0, cols = 0, rows = 0, dpr = 1;
    let raf = 0, t = 0, last = 0, visible = false;
    const pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, s: 0, target: 0 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      cols = Math.ceil(W / cell);
      rows = Math.ceil(H / cell);
      draw();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#f4f4f5";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#0a0a0b";
      const s = cell * 0.78;
      const o = (cell - s) / 2;
      const pr = 70 * 70;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const nx = x * 0.045, ny = y * 0.06;
          let v = noise3(nx, ny, t) * 0.65 + noise3(nx * 2.1, ny * 2.1, t * 1.6 + 9) * 0.35;
          if (pointer.s > 0.01) {
            const dx = x * cell - pointer.x, dy = y * cell - pointer.y;
            v += 0.45 * pointer.s * Math.exp(-(dx * dx + dy * dy) / pr);
          }
          v = smoothstep(0.32, 0.72, v);
          if (v > bayer8[(y & 7) * 8 + (x & 7)]) ctx.fillRect(x * cell + o, y * cell + o, s, s);
        }
      }
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) / 1000 : 0;
      last = now;
      if (!reduce) t += dt * 0.12;
      const k = 1 - Math.exp(-dt * 10);
      pointer.x += (pointer.tx - pointer.x) * k;
      pointer.y += (pointer.ty - pointer.y) * k;
      pointer.s += (pointer.target - pointer.s) * (1 - Math.exp(-dt * 6));
      draw();
      const settling = Math.abs(pointer.target - pointer.s) > 0.004;
      if (visible && (!reduce || settling)) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - r.left;
      pointer.ty = e.clientY - r.top;
      if (pointer.s < 0.02) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
      pointer.target = 1;
      kick();
    };
    const onLeave = () => {
      pointer.target = 0;
      kick();
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}
