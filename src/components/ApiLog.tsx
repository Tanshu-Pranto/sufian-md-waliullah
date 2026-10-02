"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { apiLog } from "@/data/content";
import { easeOut, prefersReducedMotion } from "@/lib/motion";

const VISIBLE = 5;

// A request log that keeps ticking while the card is on screen.
export default function ApiLog({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [count, setCount] = useState(VISIBLE);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const id = setInterval(() => setCount((c) => c + 1), 1900);
    return () => clearInterval(id);
  }, [inView]);

  const rows = Array.from({ length: VISIBLE }, (_, k) => count - VISIBLE + k).map((i) => ({
    ...apiLog[i % apiLog.length],
    key: i,
  }));

  return (
    <div ref={ref} className={className}>
      <p className="sr-only">Example API request log with methods, paths, status codes and response times.</p>
      <ol aria-hidden className="font-mono text-[14px]">
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map((r) => (
            <motion.li
              key={r.key}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: easeOut }}
              className="grid grid-cols-[58px_1fr_auto_48px] items-baseline gap-3 border-b border-ink-line py-2.5"
            >
              <span className="text-mute-dark">{r.method}</span>
              <span className="truncate">{r.path}</span>
              <span className={r.status >= 400 ? "text-signal" : "text-paper"}>{r.status}</span>
              <span className="text-right text-mute-dark">{r.ms}ms</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </div>
  );
}
