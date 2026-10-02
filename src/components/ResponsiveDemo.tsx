"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { prefersReducedMotion } from "@/lib/motion";

const spring = { type: "spring", duration: 0.7, bounce: 0.1 } as const;

// A wireframe page that narrows to a phone and back, reflowing as it goes.
export default function ResponsiveDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    const id = setInterval(() => setNarrow((n) => !n), 2600);
    return () => clearInterval(id);
  }, [inView]);

  const block = "rounded-[4px] bg-paper-3";

  return (
    <div ref={ref} aria-hidden className="relative h-[300px] w-full lg:h-[340px]">
      <motion.span
        key={narrow ? "phone" : "desktop"}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute right-0 top-0 text-[13px] text-mute"
      >
        {narrow ? "320px" : "1280px"}
      </motion.span>

      <motion.div
        layout
        transition={spring}
        className={`absolute bottom-0 left-0 top-7 overflow-hidden rounded-[12px] border-2 border-ink bg-paper ${
          narrow ? "w-[38%]" : "w-full"
        }`}
      >
        <motion.div layout transition={spring} className="flex items-center gap-1.5 border-b-2 border-ink px-2.5 py-2">
          <span className="size-1.5 bg-ink" />
          <span className="size-1.5 bg-ink" />
          <span className="size-1.5 bg-signal" />
        </motion.div>

        <motion.div layout transition={spring} className="flex flex-col gap-2.5 p-3">
          <motion.div layout transition={spring} className="flex items-center justify-between">
            <span className="size-3 bg-ink" />
            {narrow ? (
              <motion.span layout className="flex flex-col gap-[3px]">
                <span className="h-[2px] w-3.5 bg-ink" />
                <span className="h-[2px] w-3.5 bg-ink" />
                <span className="h-[2px] w-3.5 bg-ink" />
              </motion.span>
            ) : (
              <motion.span layout className="flex gap-2">
                <span className={`h-2 w-7 ${block}`} />
                <span className={`h-2 w-7 ${block}`} />
                <span className="h-2 w-7 rounded-[4px] bg-ink" />
              </motion.span>
            )}
          </motion.div>

          <motion.div layout transition={spring} className={`flex gap-2.5 ${narrow ? "flex-col" : "flex-row"}`}>
            <motion.div layout transition={spring} className="flex flex-1 flex-col gap-1.5 pt-1">
              <span className="h-3 w-[85%] rounded-[4px] bg-ink" />
              <span className="h-3 w-[60%] rounded-[4px] bg-ink" />
              <span className={`mt-1 h-2 w-[70%] ${block}`} />
              <span className="mt-1.5 h-4 w-12 rounded-[4px] bg-signal" />
            </motion.div>
            <motion.div layout transition={spring} className={`${block} ${narrow ? "h-14" : "h-[74px] w-[42%]"}`} />
          </motion.div>

          <motion.div layout transition={spring} className={`flex gap-2 ${narrow ? "flex-col" : "flex-row"}`}>
            {[0, 1, 2].map((i) => (
              <motion.div key={i} layout transition={spring} className={`h-12 flex-1 ${block}`} />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
