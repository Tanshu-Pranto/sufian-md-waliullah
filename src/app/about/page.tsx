import Image from "next/image";
import portrait from "@/assets/sufian.webp";
import ArrowLink from "@/components/ArrowLink";
import CtaBand from "@/components/CtaBand";
import DotIcon from "@/components/DotIcon";
import JsonLd from "@/components/JsonLd";
import Nav from "@/components/Nav";
import PageHeader from "@/components/PageHeader";
import Panel, { Block } from "@/components/Panel";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { aboutParagraphs, keyFacts, profile, skills, steps } from "@/data/content";
import type { DotIconName } from "@/data/dot-icons";
import { aboutSchema, pageMetadata } from "@/lib/seo";

const description = `About ${profile.name}, an AI engineer in ${profile.location}: background, skills across LLMs, RAG, Next.js, Node.js and MongoDB, and how he works with clients.`;

export const metadata = pageMetadata({ title: "About", description, path: "/about" });

const groupIcons: Record<string, DotIconName> = {
  AI: "lightning",
  Frontend: "browser",
  Backend: "braces",
  Data: "database",
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutSchema(description)} />
      <Nav />
      <main id="main">
        <PageHeader
          crumbs={[{ name: "About", path: "/about" }]}
          title={`About ${profile.name}.`}
          rest="AI engineer in Bangladesh."
          lead={`${profile.name} is an AI engineer based in ${profile.location} (${profile.timeZoneLabel}). He builds AI-powered web applications, with LLM features, retrieval-augmented generation (RAG) and agents, on a full-stack base of Next.js, React, Node.js and MongoDB, and works remotely with clients and teams.`}
          icon="terminal"
        />

        <Panel>
          <Block id="in-short" title="In short." rest="The facts people usually ask for first.">
            <div className="grid gap-12 md:grid-cols-12 md:gap-8">
              <dl className="divide-y divide-paper-line border-y border-paper-line md:col-span-7">
                {keyFacts.map((f) => (
                  <div key={f.label} className="grid grid-cols-[120px_1fr] gap-4 py-4 sm:grid-cols-[160px_1fr]">
                    <dt className="text-[15px] text-mute">{f.label}</dt>
                    <dd className="text-[16px]">
                      {f.label === "Contact" ? (
                        <a href={`mailto:${profile.email}`} className="underline decoration-1 underline-offset-4">
                          {f.value}
                        </a>
                      ) : (
                        f.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <figure className="md:col-span-5">
                <Reveal variant="clip" className="overflow-hidden rounded-[18px] bg-paper-3">
                  <Image
                    src={portrait}
                    alt={`Portrait of ${profile.name} in a navy blazer and white shirt`}
                    placeholder="blur"
                    sizes="(min-width: 768px) 38vw, 100vw"
                    className="aspect-[4/5] h-auto w-full object-cover object-top"
                    preload
                  />
                </Reveal>
                <figcaption className="mt-4 text-[15px] text-mute">{profile.name}</figcaption>
              </figure>
            </div>
          </Block>

          <Block id="background" title="Background." rest="Why full stack.">
            {/* PLACEHOLDER: add education, past roles or notable work here as more paragraphs. */}
            <div className="max-w-[62ch] space-y-5 text-[17px] leading-relaxed">
              {aboutParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>
                Most of my work is in JavaScript and TypeScript from end to end. I pick MongoDB or PostgreSQL based on the
                shape of the data, keep APIs small and documented, and put a working preview link in front of people as
                early as possible.
              </p>
            </div>
          </Block>

          <Block id="skills" title="Skills." rest="What I use, and what for.">
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
              {skills.map((g) => (
                <section key={g.group} aria-labelledby={`skill-${g.group}`}>
                  <div className="flex items-center justify-between gap-4 border-b border-paper-line pb-4">
                    <h3 id={`skill-${g.group}`} className="text-[22px] font-medium">
                      {g.group}
                    </h3>
                    <DotIcon name={groupIcons[g.group]} size={64} className="text-ink" />
                  </div>
                  <ul className="divide-y divide-paper-line">
                    {g.items.map((s) => (
                      <li key={s.name} className="grid grid-cols-[140px_1fr] gap-4 py-3.5">
                        <span className="font-medium">{s.name}</span>
                        <span className="text-mute">{s.note}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </Block>

          <Block id="how-i-work" title="How I work." rest="Four steps, repeated in small loops.">
            <ol className="grid gap-x-8 gap-y-12 md:grid-cols-2">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-6 border-t-2 border-paper-3 pt-6">
                  <span className="font-display text-[48px] font-bold leading-none">
                    <span className="sr-only">Step </span>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[20px] font-medium">{s.title}</h3>
                    <p className="mt-2 max-w-[44ch] text-mute">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-14 flex flex-wrap gap-3">
              <ArrowLink href="/services">See services</ArrowLink>
              <ArrowLink href="/projects">See projects</ArrowLink>
            </div>
          </Block>
        </Panel>

        <CtaBand />
      </main>
      <SiteFooter />
    </>
  );
}
