"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutGroup, motion, useInView } from "framer-motion";
import { CheckIcon, HandGrabbingIcon } from "@phosphor-icons/react/ssr";
import { prefersReducedMotion, wait } from "@/lib/motion";

type Col = "todo" | "doing" | "done";
const COLS: { id: Col; label: string }[] = [
  { id: "todo", label: "To do" },
  { id: "doing", label: "Doing" },
  { id: "done", label: "Done" },
];
const BASE = [
  { id: "a", title: "Email receipts", col: "todo" as Col },
  { id: "b", title: "Search filters", col: "todo" as Col },
  { id: "c", title: "Checkout flow", col: "doing" as Col },
  { id: "d", title: "Avatar upload", col: "doing" as Col },
  { id: "e", title: "Login page", col: "done" as Col },
];
const move = { type: "spring", duration: 0.6, bounce: 0.12 } as const;

// A card gets picked up from Doing and dropped at the top of Done.
export default function KanbanVignette() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  const play = useCallback(async () => {
    const quick = prefersReducedMotion();
    setPhase(0);
    await wait(quick ? 100 : 500);
    setPhase(1);
    await wait(quick ? 100 : 450);
    setPhase(2);
    await wait(quick ? 100 : 650);
    setPhase(3);
  }, []);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(play, 200);
    return () => clearTimeout(t);
  }, [inView, play]);

  const cards = BASE.map((c) => (c.id === "c" && phase >= 2 ? { ...c, col: "done" as Col } : c));
  const ordered = [...cards].sort((x, y) => (x.id === "c" && phase >= 2 ? -1 : y.id === "c" && phase >= 2 ? 1 : 0));

  return (
    <div ref={ref} className="h-full min-h-[320px] p-5 md:p-7" onPointerEnter={() => phase === 3 && play()}>
      <LayoutGroup>
        <div className="grid h-full grid-cols-3 gap-3">
          {COLS.map((col) => {
            const list = ordered.filter((c) => c.col === col.id);
            return (
              <div key={col.id} className="flex flex-col gap-2.5 rounded-[12px] bg-paper-3/60 p-2.5">
                <p className="flex items-center justify-between px-1 text-[13px] font-medium">
                  {col.label}
                  <span className="text-mute">{list.length}</span>
                </p>
                {list.map((c) => {
                  const lifted = c.id === "c" && (phase === 1 || phase === 2);
                  const finished = c.col === "done";
                  return (
                    <motion.div
                      key={c.id}
                      layout
                      transition={move}
                      animate={{
                        rotate: lifted ? -3 : 0,
                        scale: lifted ? 1.05 : 1,
                        boxShadow: lifted ? "0 14px 30px rgb(10 10 11 / 0.18)" : "0 0px 0px rgb(10 10 11 / 0)",
                      }}
                      className={`relative rounded-[10px] bg-paper-2 p-2.5 ${lifted ? "z-10" : ""}`}
                    >
                      <p className={`text-[13px] leading-snug ${finished ? "text-mute line-through" : ""}`}>{c.title}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="h-1.5 w-8 rounded-full bg-paper-3" />
                        <span className={`size-2 ${c.id === "c" ? "bg-signal" : "bg-ink"}`} />
                      </div>
                      {c.id === "c" && phase === 3 && (
                        <motion.span
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", duration: 0.35, bounce: 0.3 }}
                          className="absolute right-2 top-2 grid size-5 place-items-center rounded-[6px] bg-ink text-paper"
                        >
                          <CheckIcon size={12} weight="bold" />
                        </motion.span>
                      )}
                      {lifted && (
                        <HandGrabbingIcon
                          size={26}
                          weight="fill"
                          className="absolute -bottom-3 -right-2 text-ink drop-shadow-[0_2px_3px_rgb(0_0_0/0.25)]"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
