"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MapPinIcon } from "@phosphor-icons/react/ssr";
import { heroIntro, profile } from "@/data/content";
import HalftonePortrait from "./HalftonePortrait";
import ArrowLink from "./ArrowLink";
import LocalTime from "./LocalTime";

const NAME = ["Sufian", "Pranto"];

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
        <HalftonePortrait className="absolute inset-0" />
      </motion.div>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: shade }} />

      <div className="shell relative flex h-full flex-col pb-28 pt-[clamp(96px,13svh,168px)] wide:pb-10">
        <h1 className="text-center">
          <span className="sr-only">
            {profile.shortName}, {profile.role}
          </span>
          <span
            aria-hidden
            className="power-on block font-display text-[clamp(56px,6.6vw,100px)] font-extrabold leading-[0.9]"
          >
            {NAME.map((word, w) => (
              <span key={word} className="block sm:mx-[0.2em] sm:inline-block">
                {[...word].map((ch, j) => (
                  <span key={j} style={{ ["--i" as string]: w * NAME[0].length + j }}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </span>
        </h1>
        <p
          className="fade-up mt-5 text-center text-[17px] text-mute-dark"
          style={{ ["--delay" as string]: "900ms" }}
          aria-hidden
        >
          {profile.role}
        </p>

        {/* Phones: location and CTA sit under the role so nothing covers the portrait. */}
        <div className="mt-5 flex flex-col items-center gap-4 wide:mt-auto wide:flex-row wide:items-end wide:justify-between">
          <div className="fade-up" style={{ ["--delay" as string]: "1300ms" }}>
            <p className="hidden max-w-[min(40ch,calc((100vw-49.6svh)/2-72px))] text-[16px] leading-relaxed text-paper/90 wide:block">
              {heroIntro}
            </p>
            <p className="flex items-center gap-2 whitespace-nowrap text-[15px] text-mute-dark wide:mt-3">
              <MapPinIcon size={18} weight="bold" aria-hidden />
              {profile.location} <span aria-hidden>·</span> <LocalTime /> local time
            </p>
          </div>
          <div className="fade-up" style={{ ["--delay" as string]: "1450ms" }}>
            <ArrowLink href="#contact" tone="signal">
              Start a project
            </ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
