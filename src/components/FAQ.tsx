"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { faqs } from "@/data/content";

function Item({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-line">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
        aria-expanded={open}
      >
        <span
          className={`font-display text-lg md:text-xl font-medium transition-colors ${
            open ? "text-accent" : "text-cream group-hover:text-accent"
          }`}
        >
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`shrink-0 w-9 h-9 rounded-full border flex items-center justify-center text-xl transition-colors ${
            open
              ? "border-accent bg-accent text-ink"
              : "border-line text-muted group-hover:border-accent/50"
          }`}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-7 text-muted leading-relaxed max-w-2xl text-[15px]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="scroll-mt-24 py-28 md:py-36 border-t border-line bg-surface/40"
    >
      <div className="max-w-3xl mx-auto px-6">
        <SectionHead
          index="04"
          eyebrow="FAQ"
          title="Questions, answered"
        />
        <Reveal delay={0.1}>
          <div className="border-t border-line">
            {faqs.map((f, i) => (
              <Item
                key={f.q}
                q={f.q}
                a={f.a}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
