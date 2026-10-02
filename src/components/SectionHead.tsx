import { Reveal } from "./Reveal";

export function SectionHead({
  index,
  eyebrow,
  title,
}: {
  index: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <Reveal>
      <div className="mb-12 md:mb-16">
        <p className="font-mono text-xs tracking-[0.25em] text-accent uppercase mb-4">
          <span className="text-dim mr-3">{index}</span>
          {eyebrow}
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
          {title}
        </h2>
      </div>
    </Reveal>
  );
}
