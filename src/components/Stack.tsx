import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { stackGroups } from "@/data/content";

export default function Stack() {
  return (
    <section
      id="stack"
      className="scroll-mt-24 py-28 md:py-36 border-t border-line bg-surface/40"
    >
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead index="02" eyebrow="Tech stack" title="Tools I reach for" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stackGroups.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 0.08}>
              <div className="rounded-2xl border border-line bg-ink p-7 h-full">
                <p className="font-mono text-xs tracking-[0.22em] uppercase text-accent mb-6">
                  {group.title}
                </p>
                <ul className="space-y-5">
                  {group.items.map((t) => (
                    <li
                      key={t.name}
                      className="group/item border-b border-line/60 pb-4 last:border-0 last:pb-0"
                    >
                      <p className="font-medium text-cream group-hover/item:text-accent transition-colors">
                        {t.name}
                      </p>
                      <p className="text-[13px] text-dim mt-0.5">{t.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
