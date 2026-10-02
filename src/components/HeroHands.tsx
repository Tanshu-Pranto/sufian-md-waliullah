"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { prefersReducedMotion } from "@/lib/motion";
import HeroMark from "./HeroMark";

const VIDEO = "/video/hero-hands.mp4";
const STILL = "/video/hero-hands-end.webp";

/**
 * The hero film: a robot hand and a human hand, drawn in dots, reach for each
 * other while the S mark builds itself between them, until a spark jumps the
 * gap and lights it. It plays once and holds on the last frame. Under the
 * pointer the dots turn signal orange, while the dark around them stays dark.
 */
export default function HeroHands({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  // Swap to the last frame as a picture when autoplay is refused
  // (iOS Low Power Mode, data saver). Reduced motion gets it from CSS.
  const [still, setStill] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion()) {
      video.pause();
      return;
    }
    // React only sets `muted` as a property, so be sure before asking to play.
    video.muted = true;
    video.play().catch(() => setStill(true));
  }, []);

  // ---------- the orange lens ----------
  useEffect(() => {
    const host = hostRef.current;
    const lens = lensRef.current;
    // Listen on the whole hero so the lens keeps working over the name and CTA.
    const zone = host?.closest("section");
    if (!host || !lens || !zone) return;

    let W = 0, H = 0, R = 0, raf = 0, last = 0;
    const p = { x: 0, y: 0, tx: 0, ty: 0, s: 0, target: 0 };

    const render = () => {
      lens.style.transform = `translate3d(${p.x - R}px, ${p.y - R}px, 0)`;
      lens.style.opacity = String(p.s);
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(64, now - (last || now)) / 1000;
      last = now;
      const k = 1 - Math.exp(-dt * 11);
      p.x += (p.tx - p.x) * k;
      p.y += (p.ty - p.y) * k;
      p.s += (p.target - p.s) * (1 - Math.exp(-dt * 7));
      const moving =
        Math.abs(p.tx - p.x) > 0.3 || Math.abs(p.ty - p.y) > 0.3 || Math.abs(p.target - p.s) > 0.004;
      if (!moving) {
        p.s = p.target;
        last = 0;
      }
      render();
      if (moving) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const size = () => {
      W = host.offsetWidth;
      H = host.offsetHeight;
      R = Math.round(Math.max(90, Math.min(200, W * 0.11)));
      lens.style.width = lens.style.height = `${R * 2}px`;
      render();
    };

    const aim = (e: PointerEvent) => {
      // The hero scales back as it scrolls away, so map through the live rect.
      const r = host.getBoundingClientRect();
      p.tx = ((e.clientX - r.left) / r.width) * W;
      p.ty = ((e.clientY - r.top) / r.height) * H;
      // Coming back from dark, appear where the pointer is instead of gliding over.
      if (p.s < 0.02) {
        p.x = p.tx;
        p.y = p.ty;
      }
      p.target = 1;
      kick();
    };
    const onMove = (e: PointerEvent) => {
      // A finger only lights the hands while it's pressed.
      if (e.pointerType === "touch" && !p.target) return;
      aim(e);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      p.target = 0;
      kick();
    };
    const onLeave = () => {
      p.target = 0;
      kick();
    };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(host);
    zone.addEventListener("pointermove", onMove, { passive: true });
    zone.addEventListener("pointerdown", aim, { passive: true });
    zone.addEventListener("pointerup", onUp, { passive: true });
    zone.addEventListener("pointercancel", onUp, { passive: true });
    zone.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerdown", aim);
      zone.removeEventListener("pointerup", onUp);
      zone.removeEventListener("pointercancel", onUp);
      zone.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={hostRef} className={`no-select pointer-events-none isolate bg-ink ${className}`} aria-hidden>
      {/* The film is drawn on pure black. Lighten lets that black give way to
          the ink behind it, so the frame's edges never show. */}
      <div className="absolute inset-0 overflow-hidden bg-black mix-blend-lighten [container-type:size]">
        {/* The stage is always the film's own 16:9 box, so the mark can sit in
            film coordinates. Phones and portrait screens: a wide band, cropped
            to the fingertips. Landscape: sized to cover the whole hero. */}
        <div className="absolute left-1/2 top-[62%] aspect-video w-[max(100%,min(200%,110svh))] -translate-x-1/2 -translate-y-1/2 wide:top-1/2 wide:w-[max(100cqw,calc(100cqh*16/9))]">
          <video
            ref={videoRef}
            className={`absolute inset-0 size-full object-cover motion-reduce:hidden ${still ? "hidden" : ""}`}
            autoPlay
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
          >
            <source src={VIDEO} type="video/mp4" />
          </video>
          <Image
            src={STILL}
            alt=""
            fill
            sizes="(min-width: 64rem) 100vw, 200vw"
            className={`object-cover motion-reduce:block ${still ? "block" : "hidden"}`}
          />
          {/* Centred on the gap between the fingertips (960, 538 in the 1920x1080 film). */}
          <HeroMark video={videoRef} still={still} className="absolute left-1/2 top-[49.8%] w-[7%] -translate-x-1/2 -translate-y-1/2" />
        </div>
        {/* Multiply by orange: white dots turn signal, black stays black. */}
        <div
          ref={lensRef}
          className="absolute left-0 top-0 bg-[radial-gradient(closest-side,var(--color-signal)_30%,#fff)] opacity-0 mix-blend-multiply will-change-transform"
        />
      </div>
    </div>
  );
}
