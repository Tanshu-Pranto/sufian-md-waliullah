"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { projects, type Project } from "@/data/content";
import ArrowLink from "./ArrowLink";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ChatVignette from "./vignettes/ChatVignette";
import KanbanVignette from "./vignettes/KanbanVignette";
import ShopVignette from "./vignettes/ShopVignette";

const TONES = [
  { card: "bg-ink text-paper", panel: "bg-ink-2", muted: "text-mute-dark", chip: "bg-ink-3" },
  { card: "bg-paper-2 text-ink", panel: "bg-paper", muted: "text-mute", chip: "bg-paper" },
  { card: "bg-paper-3 text-ink", panel: "bg-paper-2", muted: "text-mute", chip: "bg-paper-2" },
];
const VIGNETTES = { shop: ShopVignette, kanban: KanbanVignette, chat: ChatVignette };

// Cards stack on large screens only, and never for reduced motion.
const query = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useStacking = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);

export default function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const stacking = useStacking();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section
      id="work"
      data-nav="work"
      data-nav-theme="light"
      className="relative z-10 -mt-7 rounded-t-[28px] bg-paper pt-24 md:pt-32"
    >
      <div className="shell">
        <Reveal>
          <SectionHeading lead="Selected work." rest="Three builds that each cover the whole stack." />
        </Reveal>
        <div ref={ref} className="mt-14 pb-16 lg:pb-[8vh]">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.title}
              project={p}
              index={i}
              total={projects.length}
              progress={scrollYProgress}
              stacking={stacking}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  total,
  progress,
  stacking,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  stacking: boolean;
}) {
  const tone = TONES[index % TONES.length];
  const Vignette = VIGNETTES[project.vignette];
  // Each card sinks back a little as the ones after it slide over.
  const scale = useTransform(progress, [index / total, 1], [1, stacking ? 1 - (total - 1 - index) * 0.04 : 1]);

  return (
    <div
      className="mb-4 lg:sticky lg:mb-[10vh] lg:h-[min(620px,calc(100svh-150px))]"
      style={{ top: `${112 + index * 20}px` }}
    >
      <motion.article
        style={{ scale }}
        className={`grid h-full origin-top gap-8 rounded-[24px] p-5 md:p-8 lg:grid-cols-[5fr_7fr] lg:gap-10 lg:p-10 ${tone.card}`}
      >
        <div className="flex flex-col">
          <h3 className="text-[clamp(28px,3vw,40px)] font-medium leading-[1.1]">{project.title}</h3>
          <p className="mt-4 max-w-[36ch] text-[19px] leading-snug">{project.summary}</p>
          <p className={`mt-4 max-w-[46ch] ${tone.muted}`}>{project.detail}</p>
          <ul className="mt-8 flex flex-wrap gap-2 lg:mt-auto">
            {project.tags.map((t) => (
              <li key={t} className={`rounded-[8px] px-3 py-1.5 text-[14px] ${tone.chip}`}>
                {t}
              </li>
            ))}
          </ul>
          {project.links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {project.links.map((l) => (
                <ArrowLink key={l.href} href={l.href} external tone={index === 0 ? "paper" : "ink"}>
                  {l.label}
                </ArrowLink>
              ))}
            </div>
          )}
        </div>
        <div className={`overflow-hidden rounded-[16px] ${tone.panel}`}>
          <Vignette />
        </div>
      </motion.article>
    </div>
  );
}
