"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { steps } from "@/data/content";
import DotIcon from "./DotIcon";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });

  return (
    <section id="process" data-nav="work" data-nav-theme="light" className="bg-paper pb-32 pt-16">
      <div className="shell">
        <Reveal>
          <SectionHeading lead="How a project runs." rest="Four steps, repeated in small loops until it ships." />
        </Reveal>
        <div ref={ref} className="relative mt-16">
          {/* Progress rail across the top of the steps, filled by scroll. */}
          <div aria-hidden className="absolute inset-x-0 top-0 hidden h-[2px] bg-paper-3 lg:block">
            <motion.div className="h-full origin-left bg-ink" style={{ scaleX: scrollYProgress }} />
          </div>
          <ol className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Step key={s.title} index={i} progress={scrollYProgress} {...s} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Step({
  index,
  title,
  body,
  icon,
  progress,
}: (typeof steps)[number] & { index: number; progress: MotionValue<number> }) {
  const reached = useTransform(progress, [index / steps.length, index / steps.length + 0.04], [0, 1]);
  const markerScale = useTransform(reached, [0, 1], [0.5, 1]);

  return (
    <li className="relative border-t-2 border-paper-3 pt-8 lg:border-t-0">
      <motion.span
        aria-hidden
        className="absolute -top-[5px] left-0 hidden size-3 bg-signal lg:block"
        style={{ opacity: reached, scale: markerScale }}
      />
      <div className="flex items-start justify-between gap-4">
        <span className="font-display text-[clamp(56px,5vw,72px)] font-bold leading-none">
          <span className="sr-only">Step </span>
          {String(index + 1).padStart(2, "0")}
        </span>
        <DotIcon name={icon} size={92} className="-mr-2 -mt-1 text-ink" />
      </div>
      <h3 className="mt-8 text-[22px] font-medium leading-tight">{title}</h3>
      <p className="mt-3 max-w-[36ch] text-mute">{body}</p>
    </li>
  );
}
