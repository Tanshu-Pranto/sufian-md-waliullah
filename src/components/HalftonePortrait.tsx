"use client";

import { useEffect, useRef } from "react";
import { mulberry32, prefersReducedMotion, smoothstep } from "@/lib/motion";

const SRC = "/img/sufian-cutout.webp";
const DOT = [236, 236, 239];
const SIGNAL = [255, 79, 18];

type Field = {
  n: number;
  x: Float32Array;
  y: Float32Array;
  v: Float32Array;
  r: Uint8Array;
  g: Uint8Array;
  b: Uint8Array;
  fig: Uint8Array;
  delay: Float32Array;
};

/**
 * The hero portrait, redrawn as a halftone of square dots inside a dithered
 * ring. Dots develop outward from the face on load. Under the pointer the
 * halftone gives way to a true-color mosaic of the real photo.
 */
export default function HalftonePortrait({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const dust = dustRef.current;
    if (!host || !canvas || !dust) return;
    const ctx = canvas.getContext("2d");
    const dctx = dust.getContext("2d");
    if (!ctx || !dctx) return;

    const reduce = prefersReducedMotion();
    let W = 0, H = 0, dpr = 1, cell = 6, lensR = 150;
    let field: Field | null = null;
    let start = 0;
    let introDone = reduce;
    let raf = 0;
    let dustRaf = 0;
    let last = 0;
    let paused = false;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, s: 0, target: 0, seen: false };
    const img = new Image();
    img.decoding = "async";
    img.src = SRC;

    // ---------- build the dot field for the current size ----------
    const build = () => {
      if (!img.complete || !img.naturalWidth) return;
      const rect = host.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const c of [canvas, dust]) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      }
      // Matches the `wide` CSS variant: landscape with room beside the portrait.
      const small = !(W >= 1024 && W / H >= 1.3);
      cell = W < 640 ? 5 : 6;
      lensR = W < 640 ? 96 : 160;

      const cols = Math.ceil(W / cell);
      const rows = Math.ceil(H / cell);
      const aspect = img.naturalWidth / img.naturalHeight;
      let ph = H * (small ? 0.56 : 0.78);
      let pw = ph * aspect;
      const maxW = small ? W * 0.92 : W - 660;
      if (pw > maxW) {
        pw = maxW;
        ph = pw / aspect;
      }
      const px = (W - pw) / 2;
      const py = H - ph;

      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      o.imageSmoothingQuality = "high";
      o.drawImage(img, px / cell, py / cell, pw / cell, ph / cell);
      const data = o.getImageData(0, 0, cols, rows).data;
      const alphaAt = (cx: number, cy: number) =>
        cx < 0 || cy < 0 || cx >= cols || cy >= rows ? 0 : data[(cy * cols + cx) * 4 + 3] / 255;

      // Ring centred on the face, brightest toward the upper right.
      const hx = W / 2;
      const hy = py + ph * 0.36;
      const R = small ? Math.min(W * 0.46, H * 0.3) : Math.min(H * 0.56, W * 0.46);
      const band = R * 0.04;

      const rand = mulberry32(11);
      const xs: number[] = [], ys: number[] = [], vs: number[] = [], rs: number[] = [], gs: number[] = [], bs: number[] = [];
      const figs: number[] = [], delays: number[] = [];

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const i = (cy * cols + cx) * 4;
          const a = data[i + 3] / 255;
          const x = cx * cell + cell / 2;
          const y = cy * cell + cell / 2;
          const dx = x - hx;
          const dy = y - hy;
          const d = Math.hypot(dx, dy);
          const ang = Math.atan2(dy, dx);
          // Lit from the upper right; fades out toward the lower left.
          const light = smoothstep(-0.55, 1, Math.cos(ang + Math.PI / 4));
          const inner = d < R ? 0.22 * Math.exp(-(((R - d) / (R * 0.16)) ** 2)) : 0;
          const outer = d > R ? 0.12 * Math.exp(-(((d - R) / (R * 0.07)) ** 2)) : 0;
          const ring = Math.min(1, light * (Math.exp(-(((d - R) / band) ** 2)) + inner + outer)) * 0.9;

          let v: number;
          let fig = 0;
          if (a > 0.5) {
            fig = 1;
            const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
            // Steep curve so skin shading reads as dot size, not a flat white mask.
            let vp = Math.max(0.05, Math.max(0, Math.min(1, (lum - 0.12) / 0.83)) ** 2.2);
            // Rim light where the figure meets the dark, like a backlit silhouette.
            const edge = Math.min(
              alphaAt(cx - 2, cy), alphaAt(cx + 2, cy), alphaAt(cx, cy - 2), alphaAt(cx, cy + 2),
              alphaAt(cx - 1, cy - 1), alphaAt(cx + 1, cy - 1),
            );
            if (edge < 0.3 && cy < rows - 2) vp = Math.max(vp, 0.42);
            v = vp;
          } else {
            v = ring * (1 - a);
          }
          if (!fig && v < 0.035) continue;

          xs.push(cx * cell);
          ys.push(cy * cell);
          vs.push(v);
          rs.push(data[i]);
          gs.push(data[i + 1]);
          bs.push(data[i + 2]);
          figs.push(fig);
          if (fig) {
            delays.push(120 + d * 0.95 + rand() * 140);
          } else {
            const sweep = ((ang + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2);
            delays.push(420 + sweep * 1100 + rand() * 90);
          }
        }
      }

      field = {
        n: xs.length,
        x: Float32Array.from(xs),
        y: Float32Array.from(ys),
        v: Float32Array.from(vs),
        r: Uint8Array.from(rs),
        g: Uint8Array.from(gs),
        b: Uint8Array.from(bs),
        fig: Uint8Array.from(figs),
        delay: Float32Array.from(delays),
      };
      buildDust();
      kick();
    };

    // ---------- draw one frame; returns true while the intro is still running ----------
    const lens: number[] = [];
    const draw = (now: number) => {
      if (!field) return false;
      const f = field;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const t = now - start;
      let pending = false;
      const lensOn = pointer.s > 0.01;
      const lr2 = lensR * lensR;
      const half = cell / 2;
      lens.length = 0;

      ctx.fillStyle = `rgb(${DOT[0]} ${DOT[1]} ${DOT[2]})`;
      for (let i = 0; i < f.n; i++) {
        let e = 1;
        if (!introDone) {
          const k = (t - f.delay[i]) / 620;
          if (k <= 0) {
            pending = true;
            continue;
          }
          if (k < 1) {
            pending = true;
            e = 1 - (1 - k) ** 3;
          }
        }
        if (lensOn) {
          const dx = f.x[i] + half - pointer.x;
          const dy = f.y[i] + half - pointer.y;
          if (dx * dx + dy * dy < lr2) {
            lens.push(i, e);
            continue;
          }
        }
        const s = cell * 0.92 * Math.sqrt(f.v[i]) * e;
        if (s < 0.7) continue;
        const o = (cell - s) / 2;
        ctx.fillRect(f.x[i] + o, f.y[i] + o, s, s);
      }

      for (let j = 0; j < lens.length; j += 2) {
        const i = lens[j];
        const e = lens[j + 1];
        const d = Math.hypot(f.x[i] + half - pointer.x, f.y[i] + half - pointer.y);
        const l = smoothstep(lensR, lensR * 0.35, d) * pointer.s;
        let s: number;
        let r: number, g: number, b: number;
        if (f.fig[i]) {
          // Halftone size eases toward a full tile in the photo's own color.
          s = (cell * 0.92 * Math.sqrt(f.v[i]) * (1 - l) + cell * 0.86 * l) * e;
          r = DOT[0] + (f.r[i] - DOT[0]) * l;
          g = DOT[1] + (f.g[i] - DOT[1]) * l;
          b = DOT[2] + (f.b[i] - DOT[2]) * l;
        } else {
          s = cell * 0.92 * Math.sqrt(f.v[i]) * (1 + 0.35 * l) * e;
          r = DOT[0] + (SIGNAL[0] - DOT[0]) * l * 0.85;
          g = DOT[1] + (SIGNAL[1] - DOT[1]) * l * 0.85;
          b = DOT[2] + (SIGNAL[2] - DOT[2]) * l * 0.85;
        }
        if (s < 0.7) continue;
        const o = (cell - s) / 2;
        ctx.fillStyle = `rgb(${r | 0} ${g | 0} ${b | 0})`;
        ctx.fillRect(f.x[i] + o, f.y[i] + o, s, s);
      }

      if (!pending && !introDone) introDone = true;
      return pending;
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(64, now - (last || now)) / 1000;
      last = now;
      const k = 1 - Math.exp(-dt * 11);
      pointer.x += (pointer.tx - pointer.x) * k;
      pointer.y += (pointer.ty - pointer.y) * k;
      pointer.s += (pointer.target - pointer.s) * (1 - Math.exp(-dt * 7));
      const moving =
        Math.abs(pointer.tx - pointer.x) > 0.3 ||
        Math.abs(pointer.ty - pointer.y) > 0.3 ||
        Math.abs(pointer.target - pointer.s) > 0.004;
      const pending = draw(now);
      if ((moving || pending) && !paused) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    function kick() {
      if (!start) start = performance.now();
      if (!raf && !paused) raf = requestAnimationFrame(frame);
    }

    // ---------- dust: a few slow specks, on their own cheap layer ----------
    type Speck = { x: number; y: number; s: number; a: number; v: number; p: number };
    let specks: Speck[] = [];
    function buildDust() {
      const rand = mulberry32(3);
      const count = Math.round((W * H) / 16000);
      specks = Array.from({ length: count }, () => ({
        x: rand() * W,
        y: rand() * H,
        s: rand() < 0.85 ? 1.5 : 2.5,
        a: 0.15 + rand() * 0.5,
        v: 3 + rand() * 9,
        p: rand() * Math.PI * 2,
      }));
      drawDust(performance.now(), 0);
    }
    function drawDust(now: number, dt: number) {
      dctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      dctx!.clearRect(0, 0, W, H);
      for (const sp of specks) {
        sp.y -= sp.v * dt;
        if (sp.y < -4) sp.y = H + 4;
        const tw = 0.6 + 0.4 * Math.sin(now / 1400 + sp.p);
        dctx!.fillStyle = `rgb(236 236 239 / ${sp.a * tw})`;
        dctx!.fillRect(sp.x, sp.y, sp.s, sp.s);
      }
    }
    let dustLast = 0;
    const dustFrame = (now: number) => {
      const dt = dustLast ? Math.min(64, now - dustLast) / 1000 : 0;
      dustLast = now;
      drawDust(now, dt);
      dustRaf = requestAnimationFrame(dustFrame);
    };
    const startDust = () => {
      if (reduce || dustRaf || paused) return;
      dustLast = 0;
      dustRaf = requestAnimationFrame(dustFrame);
    };
    const stopDust = () => {
      cancelAnimationFrame(dustRaf);
      dustRaf = 0;
    };

    // ---------- input ----------
    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) / r.width) * W,
        y: ((e.clientY - r.top) / r.height) * H,
        inside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom,
      };
    };
    const onMove = (e: PointerEvent) => {
      if (paused) return;
      if (e.pointerType === "touch" && e.type === "pointermove" && !pointer.target) return;
      const p = toLocal(e);
      pointer.tx = p.x;
      pointer.ty = p.y;
      if (!pointer.seen) {
        pointer.x = p.x;
        pointer.y = p.y;
        pointer.seen = true;
      }
      pointer.target = p.inside ? 1 : 0;
      kick();
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      pointer.target = 0;
      kick();
    };
    const onLeave = () => {
      pointer.target = 0;
      kick();
    };

    // Pause everything once the About panel has fully covered the hero.
    const onScroll = () => {
      const covered = window.scrollY > H * 1.02;
      if (covered === paused) return;
      paused = covered;
      if (paused) {
        cancelAnimationFrame(raf);
        raf = 0;
        stopDust();
      } else {
        kick();
        startDust();
      }
    };

    let resizeFrame = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(build);
    });

    img.onload = () => {
      build();
      ro.observe(host);
      startDust();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeFrame);
      stopDust();
      ro.disconnect();
      img.onload = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={hostRef} className={`no-select ${className}`} aria-hidden>
      <canvas ref={dustRef} className="absolute inset-0 size-full" />
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
