"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, profile, type NavId } from "@/data/content";
import ArrowLink from "./ArrowLink";
import LogoMark from "./LogoMark";

type Box = { left: number; right: number };

// Which nav item a path belongs to, e.g. /projects/storefront → work.
const fromPath = (path: string): NavId | null =>
  navLinks.find((l) => path === l.href || path.startsWith(`${l.href}/`))?.id ?? null;

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [spied, setSpied] = useState<NavId | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [atTop, setAtTop] = useState(true);
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const listRef = useRef<HTMLUListElement>(null);
  const active = onHome ? spied : fromPath(pathname);

  // On the home page, light up the item for the section under the 40% line.
  // Everywhere, track whether the header sits over a dark or light section.
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
      setSpied(current);
      setTheme(tone);
      setAtTop(window.scrollY < 48);
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
  }, [pathname]);

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
          <Link
            href="/"
            className="pointer-events-auto group press flex items-center gap-3"
            aria-label={`${profile.name}, home`}
          >
            <span className="grid size-10 place-items-center rounded-[10px] bg-ink text-paper ring-1 ring-ink-line">
              <LogoMark size={19} />
            </span>
            {/* The name floats with no backdrop, so it steps aside once content scrolls under it. */}
            <span
              className={`hidden text-[15px] font-medium transition-[color,opacity,transform] duration-300 ease-out lg:block ${
                onDark ? "text-paper" : "text-ink"
              } ${atTop ? "" : "pointer-events-none -translate-x-1 opacity-0"}`}
            >
              {profile.name}
            </span>
          </Link>

          <ArrowLink href="/contact" tone="signal" className="pointer-events-auto">
            Let&apos;s talk
          </ArrowLink>
        </div>
      </header>

      <nav
        aria-label="Main"
        className="fixed bottom-[calc(12px+env(safe-area-inset-bottom,0px))] left-1/2 z-50 -translate-x-1/2 lg:bottom-auto lg:top-4"
      >
        <div className="relative rounded-[12px] bg-paper-2 p-1 shadow-[0_8px_28px_rgb(0_0_0/0.16)]">
          <ul ref={listRef} className="flex">
            {navLinks.map((l) => (
              <li key={l.id} data-id={l.id}>
                <Link
                  href={l.href}
                  aria-current={!onHome && active === l.id ? "page" : undefined}
                  className="block rounded-[8px] px-2.5 py-2 text-[14px] font-medium text-ink sm:px-4"
                >
                  {l.label}
                </Link>
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
              <li key={l.id} className="px-2.5 py-2 text-[14px] font-medium text-paper sm:px-4">
                {l.label}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
