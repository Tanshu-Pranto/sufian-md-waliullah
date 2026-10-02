import { marqueeItems } from "@/data/content";

export default function Marquee() {
  const row = [...marqueeItems, ...marqueeItems];
  return (
    <div className="border-y border-line bg-surface/60 overflow-hidden py-5 select-none">
      <div className="flex w-max animate-marquee gap-10 items-center">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10 shrink-0">
            <span className="font-mono text-sm tracking-[0.2em] uppercase text-muted">
              {item}
            </span>
            <span className="text-accent font-mono text-xs">{"//"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
