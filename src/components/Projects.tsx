import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { projects } from "@/data/content";

export default function Projects() {
  return (
    <section id="work" className="scroll-mt-24 py-28 md:py-36 border-t border-line">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHead index="03" eyebrow="Selected work" title="Things I've built" />

        <div className="grid md:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <article className="group h-full rounded-2xl border border-line bg-surface overflow-hidden hover:border-accent/40 hover:-translate-y-1.5 transition-all duration-300">
                <div
                  className={`h-44 bg-gradient-to-br ${p.accent} to-ink relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-grid opacity-60" />
                  <div className="absolute bottom-4 left-5 font-mono text-xs text-dim">
                    0{i + 1}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-5xl font-bold text-cream/10 group-hover:text-cream/20 group-hover:scale-110 transition-all duration-500 select-none">
                      {p.title.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-muted text-[15px] leading-relaxed mb-6">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[11px] tracking-wide border border-line rounded-full px-3 py-1 text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-8 font-mono text-xs text-dim tracking-wide">
            {"//"} more projects on request, this list grows fast
          </p>
        </Reveal>
      </div>
    </section>
  );
}
