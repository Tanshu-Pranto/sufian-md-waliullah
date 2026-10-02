"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import { layers, tooling, traceSteps, type Layer } from "@/data/content";
import { easeInOut, prefersReducedMotion, wait } from "@/lib/motion";
import DotIcon from "./DotIcon";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function StackTrace() {
  const listRef = useRef<HTMLDivElement>(null);
  const packetRef = useRef<HTMLDivElement>(null);
  const runId = useRef(0);
  const [at, setAt] = useState<Layer["id"] | null>(null);
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const inView = useInView(listRef, { once: true, margin: "-30% 0px" });

  const run = useCallback(async () => {
    const list = listRef.current;
    const packet = packetRef.current;
    if (!list || !packet) return;
    const id = ++runId.current;
    const reduce = prefersReducedMotion();
    const centre = (layer: Layer["id"]) => {
      const row = list.querySelector<HTMLElement>(`[data-layer="${layer}"]`);
      return row ? row.offsetTop + row.offsetHeight / 2 - 6 : 0;
    };

    setRunKey(id);
    setRunning(true);
    setShown(0);
    setAt(null);
    packet.style.transform = `translateY(${centre("client")}px)`;
    packet.style.opacity = "1";

    for (let i = 0; i < traceSteps.length; i++) {
      const step = traceSteps[i];
      if (i > 0) {
        await animate(
          packet,
          { transform: `translateY(${centre(step.at)}px)` },
          { duration: reduce ? 0 : 0.6, ease: easeInOut },
        );
      }
      if (id !== runId.current) return;
      setAt(step.at);
      setShown(i + 1);
      await wait(reduce ? 350 : 750);
      if (id !== runId.current) return;
    }
    setAt(null);
    setRunning(false);
    packet.style.opacity = "0";
  }, []);

  // Play once on its own the first time the diagram is in view.
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(run, 500);
    return () => clearTimeout(t);
  }, [inView, run]);

  return (
    <section
      id="stack"
      data-nav="stack"
      data-nav-theme="dark"
      className="relative z-10 -mt-7 rounded-t-[28px] bg-ink pb-36 pt-24 text-paper md:pt-32"
    >
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionHeading dark lead="The stack," rest="traced through one request." />
          </Reveal>
          <Reveal as="p" delay={80} className="mt-6 max-w-[44ch] text-mute-dark">
            Each layer has one job. Send a request and follow it from the browser to the database and back.
          </Reveal>

          <button
            type="button"
            onClick={run}
            className="group press mt-8 inline-flex items-center gap-3 rounded-[12px] bg-paper-2 p-1.5 pr-5 text-[15px] font-medium text-ink"
          >
            <span className="grid size-9 place-items-center rounded-[8px] bg-signal text-ink">
              <CaretRightIcon size={16} weight="bold" className="tile-arrow" aria-hidden />
            </span>
            {running ? "Restart" : shown ? "Send another" : "Send a request"}
          </button>

          <div className="mt-8 rounded-[16px] bg-ink-2 p-5 font-mono text-[14px] leading-relaxed">
            <p className="text-mute-dark">$ trace GET /api/projects</p>
            <ol aria-live="polite" className="mt-3 min-h-[150px] space-y-1.5">
              {traceSteps.slice(0, shown).map((s, i) => (
                <li key={`${runKey}-${i}`} className="log-line flex gap-3">
                  <span aria-hidden className={s.dir === "down" ? "text-signal" : "text-paper"}>
                    {s.dir === "down" ? "→" : "←"}
                  </span>
                  <span className="w-12 shrink-0 text-mute-dark">{s.at}</span>
                  <span className="min-w-0 break-words">{s.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-10">
          <div ref={listRef} className="relative">
            <ol className="space-y-3">
              {layers.map((l) => {
                const active = at === l.id;
                return (
                  <li
                    key={l.id}
                    data-layer={l.id}
                    className={`flex items-center gap-5 rounded-[18px] p-5 pr-16 ring-1 transition-[background-color,box-shadow] duration-200 ease-out md:gap-8 md:p-7 md:pr-20 ${
                      active ? "bg-ink-3 ring-signal/70" : "bg-ink-2 ring-transparent"
                    }`}
                  >
                    <DotIcon name={l.icon} size={88} className="text-paper max-sm:size-16" />
                    <div className="min-w-0">
                      <h3 className="text-[22px] font-medium leading-tight">{l.name}</h3>
                      <p className="mt-1.5 text-mute-dark">{l.tech.join(" · ")}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            {/* The wire the request travels along, and the request itself. */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-12 right-[27px] top-12 border-l border-dashed border-paper/25 md:right-[35px]"
            />
            <div
              ref={packetRef}
              aria-hidden
              className="pointer-events-none absolute right-[22px] top-0 size-3 bg-signal opacity-0 transition-opacity duration-200 md:right-[30px]"
            />
          </div>

          <div className="mt-6 flex items-center gap-5 rounded-[18px] border border-ink-line p-5 md:gap-8 md:p-7">
            <DotIcon name="branch" size={72} className="text-mute-dark max-sm:size-14" />
            <div className="min-w-0">
              <h3 className="text-[20px] font-medium leading-tight">Around every layer</h3>
              <p className="mt-1.5 text-mute-dark">{tooling.join(" · ")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
