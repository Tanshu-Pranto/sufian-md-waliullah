"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { prefersReducedMotion } from "@/lib/motion";

// Drifts its child against the scroll so it reads as a layer behind the page.
export default function Parallax({
  children,
  distance = 100,
  className = "",
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Read after mount so the server and first client render agree.
  const still = useRef(false);
  useEffect(() => {
    still.current = prefersReducedMotion();
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, (p) => (still.current ? 0 : distance * (1 - 2 * p)));
  const transform = useMotionTemplate`translate3d(0, ${y}px, 0)`;

  return (
    <motion.div ref={ref} className={className} style={{ transform }}>
      {children}
    </motion.div>
  );
}
