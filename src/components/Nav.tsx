"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile, navLinks } from "@/data/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ink/80 backdrop-blur-xl border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <span className="w-8 h-8 rounded-lg bg-accent text-ink font-display font-bold text-sm flex items-center justify-center group-hover:rotate-6 transition-transform">
            {profile.initials}
          </span>
          <span className="font-display font-semibold tracking-tight hidden sm:block">
            {profile.shortName}
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs tracking-[0.18em] uppercase text-muted hover:text-cream transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <motion.a
          href="#contact"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="font-mono text-xs tracking-[0.14em] uppercase bg-cream text-ink px-5 py-2.5 rounded-full font-semibold hover:bg-accent transition-colors"
        >
          Let&apos;s talk
        </motion.a>
      </nav>
    </motion.header>
  );
}
