"use client";

import { useEffect, useRef, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { ACCENT, GLYPH } from "./LogoMark";

const DOT = "#ececef";
const SIGNAL = "#ff4f12";
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";

// Beats on the film's clock, in seconds.
const TILE_IN = 0.45; // the empty tile settles in as the hands enter
const BUILD = 0.8; // first dot
const STEP = 0.06; // between dots, so the S finishes as the hands come to rest
const IGNITE = 3.0; // the spark lands between the fingertips
const END = 5;

const GW = GLYPH[0].length;
const GH = GLYPH.length;
const [AX, AY] = ACCENT.split(",").map(Number);

// One dot's box at grid cell (x, y), as a share of the glyph box.
const cell = (x: number, y: number) => ({
  left: `${((x + 0.09) / GW) * 100}%`,
  top: `${((y + 0.09) / GH) * 100}%`,
  width: `${(0.82 / GW) * 100}%`,
  height: `${(0.82 / GH) * 100}%`,
});

// The dots in stroke order: start at the lit dot and keep stepping to the
// nearest unbuilt one, so the S is laid down the way you'd draw it.
const STROKE = (() => {
  const left = GLYPH.flatMap((row, y) => [...row].flatMap((c, x) => (c === "#" ? [{ x, y }] : [])));
  const out = left.splice(left.findIndex((d) => d.x === AX && d.y === AY), 1);
  while (left.length) {
    const { x, y } = out[out.length - 1];
    let best = 0;
    left.forEach((d, i) => {
      if (Math.hypot(d.x - x, d.y - y) < Math.hypot(left[best].x - x, left[best].y - y)) best = i;
    });
    out.push(...left.splice(best, 1));
  }
  return out;
})();

/**
 * The S mark, standing in for the title between the fingertips. It is built
 * dot by dot while the hands reach in, then pops and lights up when the spark
 * lands. Every beat is scrubbed by the film's own clock, so a stalled video
 * never leaves the mark ahead of the hands. When the film ends, the lit dot
 * starts running the S on a loop, like the one in the nav.
 */
export default function HeroMark({
  video,
  still,
  className = "",
}: {
  video: RefObject<HTMLVideoElement | null>;
  still: boolean;
  className?: string;
}) {
  const popRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const runnerRef = useRef<HTMLDivElement>(null);
  const twinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = video.current;
    const pop = popRef.current;
    const tile = tileRef.current;
    const runner = runnerRef.current;
    const twin = twinRef.current;
    const dots = dotsRef.current;
    if (!v || !pop || !tile || !runner || !twin) return;

    const at = (s: number) => s * 1000;
    const anims: Animation[] = [
      tile.animate(
        [
          { opacity: 0, transform: "scale(0.9)" },
          { opacity: 1, transform: "none" },
        ],
        { delay: at(TILE_IN), duration: 500, easing: EASE_OUT, fill: "both" },
      ),
      // The rim flares as the spark lands, then cools back to a hairline.
      tile.animate(
        [
          { boxShadow: "0 0 0 1px rgb(255 255 255 / 0.12)" },
          { boxShadow: "0 0 0 1px rgb(255 79 18 / 0.9), 0 0 32px 2px rgb(255 79 18 / 0.35)", offset: 0.18 },
          { boxShadow: "0 0 0 1px rgb(255 255 255 / 0.12)" },
        ],
        { delay: at(IGNITE), duration: 900, easing: EASE_OUT, fill: "both" },
      ),
      pop.animate(
        [
          { transform: "none", easing: EASE_OUT },
          { transform: "scale(1.14)", offset: 0.28, easing: EASE_IN_OUT },
          { transform: "none" },
        ],
        { delay: at(IGNITE), duration: 560, fill: "both" },
      ),
    ];

    let lit: Animation | undefined;
    STROKE.forEach((_, i) => {
      const dot = dots[i];
      if (!dot) return;
      // Each block pops up into its slot: a little rise, a little overshoot.
      anims.push(
        dot.animate(
          [
            { opacity: 0, transform: "translateY(45%) scale(0.4)", easing: EASE_OUT },
            { opacity: 1, transform: "translateY(-8%) scale(1.15)", offset: 0.55, easing: EASE_IN_OUT },
            { opacity: 1, transform: "none" },
          ],
          { delay: at(BUILD + i * STEP), duration: 380, fill: "both" },
        ),
      );
      // The charge runs down the stroke from the lit dot, which stays lit.
      const charge = dot.animate(
        i === 0
          ? [{ backgroundColor: DOT }, { backgroundColor: SIGNAL }]
          : [{ backgroundColor: DOT }, { backgroundColor: SIGNAL, offset: 0.2 }, { backgroundColor: DOT }],
        { delay: at(IGNITE + i * 0.024), duration: i === 0 ? 220 : 460, easing: EASE_OUT, fill: "both" },
      );
      anims.push(charge);
      if (i === 0) lit = charge;
    });

    const seek = (s: number) => {
      for (const a of anims) a.currentTime = at(s);
    };
    const cancel = () => {
      for (const a of anims) a.cancel();
    };
    for (const a of anims) a.pause();

    // Once the film is over, the lit dot hands over to the runner, which sits
    // exactly on top of it, in the same frame, and starts running the S.
    const home = dots[0];
    const runLoop = () => {
      lit?.cancel();
      if (home) home.style.backgroundColor = DOT;
      runner.classList.replace("opacity-0", "mark-run");
      twin.classList.add("mark-twin");
    };
    const stopLoop = () => {
      if (home) home.style.backgroundColor = SIGNAL;
      runner.classList.replace("mark-run", "opacity-0");
      twin.classList.remove("mark-twin");
    };

    const reduce = prefersReducedMotion();
    if (still || reduce) {
      seek(END);
      if (!reduce) runLoop();
      return () => {
        stopLoop();
        cancel();
      };
    }

    // Follow the film frame by frame where the browser can tell us when one is
    // shown; otherwise poll its clock each animation frame.
    let raf = 0;
    let vfc = 0;
    const byFrame = "requestVideoFrameCallback" in v;
    const onFrame = (_: number, meta: VideoFrameCallbackMetadata) => {
      seek(meta.mediaTime);
      vfc = v.requestVideoFrameCallback(onFrame);
    };
    const onTick = () => {
      seek(v.currentTime);
      if (!v.ended) raf = requestAnimationFrame(onTick);
    };
    const onEnded = () => {
      seek(END);
      runLoop();
    };

    seek(v.currentTime);
    if (byFrame) vfc = v.requestVideoFrameCallback(onFrame);
    else raf = requestAnimationFrame(onTick);
    v.addEventListener("ended", onEnded);

    return () => {
      cancelAnimationFrame(raf);
      if (byFrame) v.cancelVideoFrameCallback(vfc);
      v.removeEventListener("ended", onEnded);
      stopLoop();
      cancel();
    };
  }, [video, still]);

  return (
    <div className={`hero-mark aspect-square ${className}`}>
      <div ref={popRef} className="relative size-full">
        <div
          ref={tileRef}
          data-piece
          className="absolute inset-0 rounded-[23%] bg-ink/80"
          style={{ boxShadow: "0 0 0 1px rgb(255 255 255 / 0.12)" }}
        />
        {/* Same proportions as the app icon: the glyph fills 58% of the tile. */}
        <div className="absolute left-1/2 top-1/2 aspect-[6/7] h-[58%] -translate-x-1/2 -translate-y-1/2">
          {STROKE.map(({ x, y }, i) => (
            <div
              key={`${x},${y}`}
              ref={(el) => {
                dotsRef.current[i] = el;
              }}
              data-piece
              className="absolute"
              style={{ ...cell(x, y), backgroundColor: i === 0 ? SIGNAL : DOT }}
            />
          ))}
          {/* The runner and its twin: hidden through the film, then they run
              the S on a loop (.mark-run, .mark-twin). A dot is 0.82 of a
              cell, so one --cell is 100%/0.82. */}
          <div
            ref={twinRef}
            className="absolute opacity-0"
            style={{ ...cell(AX, AY), backgroundColor: SIGNAL, ["--cell" as string]: "calc(100% / 0.82)" }}
          />
          <div
            ref={runnerRef}
            className="absolute opacity-0"
            style={{ ...cell(AX, AY), backgroundColor: SIGNAL, ["--cell" as string]: "calc(100% / 0.82)" }}
          />
        </div>
      </div>
    </div>
  );
}
