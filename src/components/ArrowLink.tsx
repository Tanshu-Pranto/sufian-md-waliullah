import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

const tones = {
  // Orange tile on a dark chip. The primary call to action.
  signal: { chip: "bg-ink-2 text-paper ring-1 ring-ink-line", tile: "bg-signal text-ink", swap: "" },
  // Dark chip for light sections.
  ink: { chip: "bg-ink text-paper", tile: "bg-ink-3 text-paper", swap: "tile-swap" },
  // Light chip for dark sections.
  paper: { chip: "bg-paper-2 text-ink", tile: "bg-ink text-paper", swap: "tile-swap" },
};

export default function ArrowLink({
  href,
  children,
  tone = "ink",
  external,
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: keyof typeof tones;
  external?: boolean;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`group press inline-flex items-center gap-3 rounded-[12px] p-1.5 pr-5 text-[15px] font-medium ${t.chip} ${className}`}
    >
      <span className={`grid size-9 place-items-center rounded-[8px] ${t.tile} ${t.swap}`}>
        <CaretRightIcon size={16} weight="bold" className="tile-arrow" aria-hidden />
      </span>
      {children}
    </a>
  );
}
