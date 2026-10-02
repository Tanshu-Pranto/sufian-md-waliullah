"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react/ssr";
import { profile } from "@/data/content";

const swap = "transition-[opacity,filter,transform] duration-200 ease-out";

export default function CopyEmail() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="group press inline-flex items-center gap-3 rounded-[12px] bg-paper-2 p-1.5 pr-5 text-[15px] font-medium text-ink"
    >
      <span className="relative grid size-9 place-items-center rounded-[8px] bg-ink text-paper">
        <CopyIcon size={18} weight="bold" aria-hidden className={`absolute ${swap} ${copied ? "scale-75 opacity-0 blur-[2px]" : ""}`} />
        <CheckIcon size={18} weight="bold" aria-hidden className={`absolute ${swap} ${copied ? "" : "scale-75 opacity-0 blur-[2px]"}`} />
      </span>
      {/* Both labels share one grid cell so the button never changes width. */}
      <span className="grid" aria-live="polite">
        <span className={`[grid-area:1/1] ${swap} ${copied ? "opacity-0 blur-[2px]" : ""}`}>Copy email</span>
        <span className={`[grid-area:1/1] ${swap} ${copied ? "" : "opacity-0 blur-[2px]"}`} aria-hidden={!copied}>
          Copied
        </span>
      </span>
    </button>
  );
}
