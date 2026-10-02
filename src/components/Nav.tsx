"use client";

import { useEffect, useRef, useState } from "react";
import { navLinks, profile, type NavId } from "@/data/content";
import ArrowLink from "./ArrowLink";

// A 5x7 dot-matrix "S", the site mark.
const MARK = [".###.", "#...#", "#....", ".###.", "....#", "#...#", ".###."];

function Mark() {
  return (
    <svg viewBox="0 0 5 7" width={15} height={21} aria-hidden>
      {MARK.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "#" ? <rect key={`${x}-${y}`} x={x + 0.1} y={y + 0.1} width={0.8} height={0.8} fill="currentColor" /> : null,
        ),
      )}
    </svg>
  );
}

type Box = { left: number; right: number };

export default function Nav() {
  const [active, setActive] = useState<NavId | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const listRef = useRef<HTMLUListElement>(null);

  // Which section sits under the 40% line, and what color is under the header.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const probe = window.innerHeight * 0.4;
      let current: NavId | null = null;
      document.querySelectorAll<HTMLElement>("[data-nav]").forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) current = s.dataset.nav as NavId;
      });
      let tone: "dark" | "light" = "dark";
      document.querySelectorAll<HTMLElement>("[data-nav-theme]").forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top <= 36 && r.bottom > 36) tone = s.dataset.navTheme as "dark" | "light";
      });
      setActive(current);
      setTheme(tone);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Measure each link so the active copy can be clipped to it.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const width = list.offsetWidth;
      const next: Record<string, Box> = {};
      list.querySelectorAll<HTMLElement>("[data-id]").forEach((el) => {
        next[el.dataset.id!] = { left: el.offsetLeft, right: width - el.offsetLeft - el.offsetWidth };
      });
      setBoxes(next);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  const box = active ? boxes[active] : undefined;
  const clip = box ? `inset(0 ${box.right}px 0 ${box.left}px round 8px)` : "inset(0 100% 0 0 round 8px)";
  const onDark = theme === "dark";

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-lg bg-signal px-4 py-2 text-ink focus:translate-y-0"
      >
        Skip to content
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="shell flex h-[72px] items-center justify-between">
          <a
            href="#top"
            className="pointer-events-auto group press flex items-center gap-3"
            aria-label={`${profile.shortName}, back to top`}
          >
            <span className="grid size-10 place-items-center rounded-[10px] bg-ink text-paper ring-1 ring-ink-line">
              <Mark />
            </span>
            <span
              className={`hidden text-[15px] font-medium transition-colors duration-300 lg:block ${
                onDark ? "text-paper" : "text-ink"
              }`}
            >
              {profile.shortName}
            </span>
          </a>

          <ArrowLink href="#contact" tone="signal" className="pointer-events-auto">
            Let&apos;s talk
          </ArrowLink>
        </div>
      </header>

      <nav
        aria-label="Sections"
        className="fixed bottom-[calc(12px+env(safe-area-inset-bottom,0px))] left-1/2 z-50 -translate-x-1/2 lg:bottom-auto lg:top-4"
      >
        <div className="relative rounded-[12px] bg-paper-2 p-1 shadow-[0_8px_28px_rgb(0_0_0/0.16)]">
          <ul ref={listRef} className="flex">
            {navLinks.map((l) => (
              <li key={l.id} data-id={l.id}>
                <a
                  href={`#${l.id}`}
                  aria-current={active === l.id ? "true" : undefined}
                  className="block rounded-[8px] px-3 py-2 text-[14px] font-medium text-ink sm:px-4"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Same list, styled as active, clipped down to the current link. */}
          <ul
            aria-hidden
            className="pointer-events-none absolute inset-1 flex rounded-[8px] bg-ink transition-[clip-path,opacity] duration-[250ms] ease-in-out"
            style={{ clipPath: clip, opacity: box ? 1 : 0 }}
          >
            {navLinks.map((l) => (
              <li key={l.id} className="px-3 py-2 text-[14px] font-medium text-paper sm:px-4">
                {l.label}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
