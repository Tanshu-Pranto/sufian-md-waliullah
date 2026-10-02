import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { aboutCards, profile } from "@/data/content";

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead index="01" eyebrow="About" title="The basics" />

        <div className="grid md:grid-cols-3 gap-5">
          {aboutCards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-line bg-surface p-8 hover:border-accent/40 hover:-translate-y-1 transition-all duration-300">
                <p className="font-mono text-xs text-accent tracking-[0.2em] mb-5">
                  0{i + 1}
                </p>
                <h3 className="font-display text-xl font-semibold mb-4">
                  {c.title}
                </h3>
                <p className="text-muted leading-relaxed text-[15px]">
                  {c.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 font-mono text-sm text-dim">
            <span>
              <span className="text-muted">location</span> — {profile.location}
            </span>
            <span>
              <span className="text-muted">role</span> — {profile.role}
            </span>
            <span>
              <span className="text-muted">status</span> —{" "}
              <span className="text-accent">open to work</span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
