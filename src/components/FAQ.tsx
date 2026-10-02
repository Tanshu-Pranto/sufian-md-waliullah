"use client";

import { useId, useState } from "react";
import { PlusIcon } from "@phosphor-icons/react/ssr";
import { faqs, profile, type Faq } from "@/data/content";
import ArrowLink from "./ArrowLink";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * Accordion of questions. Every answer stays in the HTML (collapsed with a
 * grid-rows transition and made inert), so search engines can read them all.
 */
export function FaqList({ items, initiallyOpen = 0 }: { items: Faq[]; initiallyOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(initiallyOpen);
  const uid = useId();

  return (
    <ul className="border-t border-paper-line">
      {items.map((f, i) => {
        const isOpen = open === i;
        const q = `${uid}-q-${i}`;
        const a = `${uid}-a-${i}`;
        return (
          <li key={f.q} className="border-b border-paper-line">
            <h3>
              <button
                id={q}
                type="button"
                aria-expanded={isOpen}
                aria-controls={a}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left text-[clamp(18px,1.7vw,22px)] font-medium leading-snug"
              >
                {f.q}
                <span className="grid size-11 shrink-0 place-items-center rounded-[10px] bg-paper-2 transition-colors duration-200 group-aria-expanded:bg-ink group-aria-expanded:text-paper">
                  <PlusIcon
                    size={22}
                    weight="bold"
                    aria-hidden
                    className="transition-transform duration-200 ease-out group-aria-expanded:rotate-45"
                  />
                </span>
              </button>
            </h3>
            <div
              id={a}
              role="region"
              aria-labelledby={q}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-[240ms] ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[62ch] pb-7 pr-14 text-mute">{f.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function FAQ() {
  return (
    <section id="faq" data-nav="faq" data-nav-theme="light" className="bg-paper pb-40 pt-16">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Reveal>
            <SectionHeading lead="Questions" rest="people ask before we start." />
          </Reveal>
          <Reveal as="p" delay={80} className="mt-6 max-w-[34ch] text-mute">
            Something else on your mind?{" "}
            <a href={`mailto:${profile.email}`} className="text-ink underline decoration-1 underline-offset-4">
              Email me
            </a>{" "}
            and ask.
          </Reveal>
          <Reveal delay={120} className="mt-8">
            <ArrowLink href="/faq" tone="ink">
              All questions
            </ArrowLink>
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          <FaqList items={faqs.filter((f) => f.home)} />
        </div>
      </div>
    </section>
  );
}
