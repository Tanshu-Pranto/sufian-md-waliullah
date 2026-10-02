import Image from "next/image";
import portrait from "@/assets/sufian.webp";
import { aboutParagraphs, aboutStatement, facts, profile } from "@/data/content";
import ArrowLink from "./ArrowLink";
import Parallax from "./Parallax";
import Reveal from "./Reveal";

export default function About() {
  const words = aboutStatement.split(" ");

  return (
    <section
      id="about"
      data-nav="about"
      data-nav-theme="light"
      className="relative z-10 overflow-clip rounded-t-[28px] bg-paper"
    >
      {/* Ink hollyhock, photo by Sebastian Schuster on Unsplash, inverted to ink. */}
      <Parallax
        distance={70}
        className="pointer-events-none absolute -top-14 right-[-6vw] w-[68vw] md:right-[-2vw] md:w-[min(42vw,600px)]"
      >
        <Image
          src="/img/hollyhock-mask.webp"
          alt=""
          width={900}
          height={1201}
          sizes="(min-width: 768px) 42vw, 68vw"
          className="h-auto w-full"
        />
      </Parallax>

      <div className="shell relative pb-24 pt-[78vw] md:pb-32 md:pt-40">
        <h2 className="words max-w-[22ch] text-[clamp(28px,4.3vw,60px)] font-medium leading-[1.12] tracking-[-0.01em] md:max-w-[min(21ch,54vw)]">
          {words.map((w, i) => (
            <span key={i} className="word" style={{ ["--w" as string]: i / (words.length - 1) }}>
              {w}{" "}
            </span>
          ))}
        </h2>

        <div className="mt-20 grid gap-12 md:grid-cols-12 md:gap-8 lg:mt-28">
          <figure className="md:col-span-5">
            <Reveal variant="clip" className="overflow-hidden rounded-[18px] bg-paper-3">
              <Image
                src={portrait}
                alt={`Portrait of ${profile.name} in a navy blazer and white shirt`}
                placeholder="blur"
                sizes="(min-width: 768px) 40vw, 100vw"
                className="aspect-[4/5] h-auto w-full object-cover object-top"
              />
            </Reveal>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4 text-[15px]">
              <span className="font-medium">{profile.name}</span>
              <span className="text-mute">{profile.role}</span>
            </figcaption>
          </figure>

          <div className="flex flex-col md:col-span-7 md:pl-6 lg:pl-16">
            {aboutParagraphs.map((p, i) => (
              <Reveal key={i} as="p" delay={i * 80} className="mb-5 max-w-[60ch] text-[17px] leading-relaxed">
                {p}
              </Reveal>
            ))}
            <Reveal delay={120}>
              <ArrowLink href="/about" tone="ink" className="mt-3">
                More about me
              </ArrowLink>
            </Reveal>
            <Reveal delay={160} className="mt-auto pt-8">
              <dl className="divide-y divide-paper-line border-y border-paper-line">
                {facts.map((f) => (
                  <div key={f.label} className="grid grid-cols-[112px_1fr] gap-4 py-4 sm:grid-cols-[150px_1fr]">
                    <dt className="text-[15px] text-mute">{f.label}</dt>
                    <dd className="text-[16px]">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
