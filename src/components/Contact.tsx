"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { profile } from "@/data/content";

const socials = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "X", href: profile.x },
];

export default function Contact() {
  return (
    <>
      <section id="contact" className="scroll-mt-24 py-32 md:py-44 border-t border-line relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/[0.07] blur-[140px] rounded-full pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.25em] text-accent uppercase mb-6">
              <span className="text-dim mr-3">05</span>
              Contact
            </p>
            <h2 className="font-display font-bold tracking-tight leading-[1.02] text-[clamp(2.6rem,7vw,5rem)]">
              Have an idea?
              <br />
              Let&apos;s <span className="text-outline">build</span> it
              <span className="text-accent">.</span>
            </h2>
            <p className="mt-6 text-muted text-lg max-w-xl mx-auto leading-relaxed">
              I&apos;m currently {profile.availabilityNote.toLowerCase()}.
              Tell me what you&apos;re working on.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href={`mailto:${profile.email}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-accent text-ink font-semibold px-10 py-4 rounded-full text-sm tracking-wide"
              >
                {profile.email}
              </motion.a>
            </div>
            <div className="mt-10 flex items-center justify-center gap-8">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs tracking-[0.18em] uppercase text-muted hover:text-accent transition-colors"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-dim">
            © 2026 {profile.name}
          </p>
          <p className="font-mono text-xs text-dim">
            Built with Next.js &amp; Framer Motion
          </p>
          <a
            href="#top"
            className="font-mono text-xs tracking-[0.18em] uppercase text-muted hover:text-accent transition-colors"
          >
            Back to top ↑
          </a>
        </div>
      </footer>
    </>
  );
}
