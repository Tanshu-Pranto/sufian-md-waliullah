"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChecksIcon } from "@phosphor-icons/react/ssr";
import { easeOut, prefersReducedMotion, wait } from "@/lib/motion";

type Msg = { id: number; me: boolean; text: string };
type Step = Msg | { typing: "me" | "them" };
const SCRIPT: Step[] = [
  { id: 1, me: false, text: "Did the pagination fix land?" },
  { typing: "me" },
  { id: 2, me: true, text: "Yes, it's on the preview link." },
  { id: 3, me: true, text: "Older messages load as you scroll up." },
  { typing: "them" },
  { id: 4, me: false, text: "Perfect. Merging now." },
];

// A short conversation plays out, with typing indicators between turns.
export default function ChatVignette() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState<null | "me" | "them">(null);
  const [done, setDone] = useState(false);

  const play = useCallback(async () => {
    const quick = prefersReducedMotion();
    setMsgs([]);
    setDone(false);
    await wait(300);
    for (const step of SCRIPT) {
      if ("typing" in step) {
        setTyping(step.typing);
        await wait(quick ? 200 : 1100);
        setTyping(null);
        continue;
      }
      setMsgs((m) => [...m, step]);
      await wait(quick ? 200 : 700);
    }
    setDone(true);
  }, []);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(play, 200);
    return () => clearTimeout(t);
  }, [inView, play]);

  return (
    <div
      ref={ref}
      className="flex h-full min-h-[320px] flex-col p-5 md:p-7"
      onPointerEnter={() => done && play()}
    >
      <div className="flex items-center justify-between border-b border-paper-line pb-4">
        <span className="text-[15px] font-medium"># launch</span>
        <span className="flex items-center gap-2 text-[13px] text-mute">
          <span className="flex -space-x-1.5">
            <span className="grid size-7 place-items-center rounded-full bg-ink text-[11px] text-paper ring-2 ring-paper-2">RA</span>
            <span className="grid size-7 place-items-center rounded-full bg-signal text-[11px] text-ink ring-2 ring-paper-2">SP</span>
          </span>
          2 here
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-6">
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: easeOut }}
              className={`max-w-[80%] rounded-[14px] px-3.5 py-2.5 text-[14px] leading-snug ${
                m.me ? "self-end rounded-br-[4px] bg-ink text-paper" : "self-start rounded-bl-[4px] bg-paper text-ink"
              }`}
            >
              {m.text}
            </motion.div>
          ))}
          {typing && (
            <motion.div
              key={`typing-${typing}`}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              className={`flex gap-1 rounded-[14px] px-3.5 py-3.5 ${typing === "me" ? "self-end bg-ink" : "self-start bg-paper"}`}
              aria-hidden
            >
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className={`size-1.5 ${typing === "me" ? "bg-paper" : "bg-ink"}`}
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15, ease: "easeInOut" }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.p
          initial={false}
          animate={{ opacity: done ? 1 : 0 }}
          className="flex items-center justify-end gap-1 text-[12px] text-mute"
        >
          <ChecksIcon size={14} weight="bold" /> Seen
        </motion.p>
      </div>
    </div>
  );
}
