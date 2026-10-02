"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { profile, rotatingRoles, stats } from "@/data/content";

type Seg = { text: string; className?: string };

const CODE: Seg[] = [
  { text: "{\n" },
  { text: '  "name"', className: "text-sky-300" },
  { text: ": " },
  { text: '"Sufian MD Pranto"', className: "text-accent" },
  { text: ",\n" },
  { text: '  "role"', className: "text-sky-300" },
  { text: ": " },
  { text: '"MERN Stack Developer"', className: "text-accent" },
  { text: ",\n" },
  { text: '  "stack"', className: "text-sky-300" },
  { text: ": [" },
  { text: '"Next.js"', className: "text-amber-200" },
  { text: ", " },
  { text: '"React"', className: "text-amber-200" },
  { text: ", " },
  { text: '"Node"', className: "text-amber-200" },
  { text: ", " },
  { text: '"MongoDB"', className: "text-amber-200" },
  { text: "],\n" },
  { text: '  "focus"', className: "text-sky-300" },
  { text: ": " },
  { text: '"clean code, great UX"', className: "text-accent" },
  { text: ",\n" },
  { text: '  "hireable"', className: "text-sky-300" },
  { text: ": " },
  { text: "true", className: "text-violet-300" },
  { text: "\n}" },
];

function useTyped(segments: Seg[], active: boolean, speed = 26) {
  const total = segments.reduce((n, s) => n + s.text.length, 0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || count >= total) return;
    const t = setTimeout(
      () => setCount((c) => Math.min(c + 1, total)),
      speed
    );
    return () => clearTimeout(t);
  }, [active, count, total, speed]);
  return { count, done: count >= total };
}

function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { count, done } = useTyped(CODE, inView);

  let remaining = count;
  const body = CODE.map((s, i) => {
    const take = Math.min(remaining, s.text.length);
    remaining -= take;
    if (take <= 0) return null;
    return (
      <span key={i} className={s.className}>
        {s.text.slice(0, take)}
      </span>
    );
  });

  return (
    <div ref={ref} className="relative">
      <div className="absolute -inset-4 bg-accent/10 blur-3xl rounded-3xl pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ rotate: -0.5, transition: { duration: 0.3 } }}
        className="relative rounded-2xl border border-line bg-surface/90 backdrop-blur shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-line">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-dim">
            developer.json
          </span>
        </div>
        <pre className="p-6 font-mono text-[13px] md:text-sm leading-7 min-h-[300px] whitespace-pre-wrap">
          {body}
          {!done && <span className="animate-blink text-accent">▍</span>}
        </pre>
        <div className="px-6 py-3 border-t border-line flex items-center justify-between">
          <span className="font-mono text-[11px] text-dim">
            utf-8 · json
          </span>
          <span className="font-mono text-[11px] text-accent flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-accent" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            ready to ship
          </span>
        </div>
      </motion.div>
    </div>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const t = setInterval(
      () => setRoleIdx((i) => (i + 1) % rotatingRoles.length),
      2600
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-accent/10 blur-[140px] animate-drift pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[560px] h-[560px] rounded-full bg-violet-600/10 blur-[160px] animate-drift-slow pointer-events-none" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center w-full"
      >
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="mb-7">
            <span className="inline-flex items-center gap-2.5 border border-line bg-surface/70 backdrop-blur rounded-full pl-3 pr-4 py-1.5">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-accent" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted">
                {profile.availabilityNote}
              </span>
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display font-bold tracking-tight leading-[0.95] text-[clamp(3.2rem,8.5vw,6.5rem)]"
          >
            Sufian MD
            <br />
            <span className="text-outline">Pranto</span>
            <span className="text-accent">.</span>
          </motion.h1>

          <motion.div
            variants={item}
            className="mt-7 font-mono text-sm md:text-base text-muted h-7"
          >
            <span className="text-dim">$</span> I build{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIdx}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="text-cream font-medium"
              >
                {rotatingRoles[roleIdx]}
              </motion.span>
            </AnimatePresence>
            <span className="animate-blink text-accent">▍</span>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-4 text-muted text-lg leading-relaxed max-w-xl"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <motion.a
              href="#work"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-accent text-ink font-semibold px-8 py-4 rounded-full text-sm tracking-wide"
            >
              View my work
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="border border-line text-cream px-8 py-4 rounded-full text-sm tracking-wide hover:border-accent/60 hover:bg-accent-dim transition-colors"
            >
              Get in touch
            </motion.a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-14 flex gap-10 border-t border-line pt-8"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-accent">
                  {s.value}
                </p>
                <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-dim mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <Terminal />
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dim hover:text-muted transition-colors"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">
          Scroll
        </span>
        <motion.span
          animate={reduce ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-lg"
        >
          ↓
        </motion.span>
      </motion.a>
    </section>
  );
}
