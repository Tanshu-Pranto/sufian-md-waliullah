"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MapPinIcon } from "@phosphor-icons/react/ssr";
import { heroIntro, profile } from "@/data/content";
import HeroHands from "./HeroHands";
import ArrowLink from "./ArrowLink";
import LocalTime from "./LocalTime";

// Lines on phones; one line from `sm` up. Real spaces stay in the DOM so the
// name reads correctly to crawlers even though letters are split for the effect.
const LINES = [["Sufian"], ["Md.", "Waliullah"]];
const WORDS = LINES.flat();
const offset = (w: number) => WORDS.slice(0, w).join("").length;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // As the About panel slides up over the hero, the hero sinks back a little.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.9]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.75]);

  return (
    <section
      ref={ref}
      id="top"
      data-nav-theme="dark"
      className="sticky top-0 h-svh min-h-[620px] overflow-hidden bg-ink text-paper"
    >
      <motion.div className="absolute inset-0 origin-[50%_30%]" style={{ scale }}>
        <HeroHands className="absolute inset-0" />
      </motion.div>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: shade }} />

      <div className="shell relative flex h-full flex-col pb-28 pt-[clamp(96px,13svh,168px)] wide:pb-10">
        {/* Real text in the h1 (the letters are split only for the flicker), with an
            aria-label so screen readers say the name once, not letter by letter. */}
        <h1 className="text-center" aria-label={`${profile.name}, ${profile.role}`}>
          <span className="power-on block font-display text-[min(9.6vw,48px)] font-extrabold leading-[0.95] sm:text-[clamp(38px,4vw,60px)]">
            {LINES.map((line, l) => (
              <span key={l} className="whitespace-nowrap">
                {line.map((word, k) => (
                  <span key={word}>
                    {k > 0 ? " " : null}
                    {[...word].map((ch, j) => (
                      <span key={j} className="ch" style={{ ["--i" as string]: offset(WORDS.indexOf(word)) + j }}>
                        {ch}
                      </span>
                    ))}
                  </span>
                ))}
                {l < LINES.length - 1 ? (
                  <>
                    {" "}
                    <br className="sm:hidden" />
                  </>
                ) : null}
              </span>
            ))}
          </span>
          <span className="sr-only">, </span>
          <span
            className="fade-up mt-5 block font-mono text-[17px] font-normal text-mute-dark"
            style={{ ["--delay" as string]: "900ms" }}
          >
            {profile.role}
          </span>
        </h1>

        {/* Phones: location and CTA sit under the role so nothing covers the hands. */}
        <div className="mt-5 flex flex-col items-center gap-4 wide:mt-auto wide:flex-row wide:items-end wide:justify-between">
          <div className="fade-up" style={{ ["--delay" as string]: "1300ms" }}>
            <p className="hidden max-w-[40ch] text-[16px] leading-relaxed text-paper/90 wide:block">
              {heroIntro}
            </p>
            <p className="flex items-center gap-2 whitespace-nowrap text-[15px] text-mute-dark wide:mt-3">
              <MapPinIcon size={18} weight="bold" aria-hidden />
              {profile.location} <span aria-hidden>·</span> <LocalTime /> local time
            </p>
          </div>
          <div className="fade-up" style={{ ["--delay" as string]: "1450ms" }}>
            <ArrowLink href="/contact" tone="signal">
              Start a project
            </ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
