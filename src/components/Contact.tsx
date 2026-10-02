import { ArrowUpRightIcon, GithubLogoIcon, LinkedinLogoIcon, XLogoIcon } from "@phosphor-icons/react/ssr";
import { profile } from "@/data/content";
import ArrowLink from "./ArrowLink";
import CopyEmail from "./CopyEmail";
import DotWordmark from "./DotWordmark";
import LocalTime from "./LocalTime";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const handle = (url: string) => `@${url.replace(/\/$/, "").split("/").pop()}`;

const socials = [
  { label: "GitHub", href: profile.github, Icon: GithubLogoIcon },
  { label: "LinkedIn", href: profile.linkedin, Icon: LinkedinLogoIcon },
  { label: "X", href: profile.x, Icon: XLogoIcon },
];

export default function Contact() {
  const [user, domain] = profile.email.split("@");

  return (
    <section
      id="contact"
      data-nav="contact"
      data-nav-theme="dark"
      className="relative z-10 -mt-7 overflow-clip rounded-t-[28px] bg-ink text-paper"
    >
      <div className="shell pt-24 md:pt-32">
        <Reveal>
          <SectionHeading dark lead="Have something to build?" rest="Email is the fastest way to reach me." />
        </Reveal>

        <Reveal delay={80}>
          <a
            href={`mailto:${profile.email}`}
            className="mt-12 block w-fit font-display text-[clamp(30px,7.4vw,112px)] font-extrabold leading-[0.95] transition-colors duration-200 hover:text-signal"
          >
            <span className="block">{user}@</span>
            <span className="block">{domain}</span>
          </a>
        </Reveal>

        <Reveal delay={140} className="mt-10 flex flex-wrap gap-3">
          <ArrowLink href={`mailto:${profile.email}`} tone="signal">
            Write an email
          </ArrowLink>
          <CopyEmail />
        </Reveal>

        <div className="mt-24 grid gap-10 border-t border-ink-line pt-10 lg:grid-cols-12 lg:gap-8">
          <dl className="space-y-5 lg:col-span-4">
            <div>
              <dt className="text-[14px] text-mute-dark">Based in</dt>
              <dd className="mt-1 text-[17px]">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-[14px] text-mute-dark">Local time</dt>
              <dd className="mt-1 text-[17px]">
                <LocalTime /> <span className="text-mute-dark">({profile.timeZoneLabel})</span>
              </dd>
            </div>
            <div>
              <dt className="text-[14px] text-mute-dark">Open to</dt>
              <dd className="mt-1 max-w-[30ch] text-[17px]">{profile.openTo}</dd>
            </div>
          </dl>

          <ul className="divide-y divide-ink-line border-y border-ink-line lg:col-span-8 lg:border-t-0">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-5 py-5 md:gap-8 md:py-6"
                >
                  <Icon
                    size={48}
                    weight="duotone"
                    aria-hidden
                    className="shrink-0 transition-[color,transform] duration-300 ease-out group-hover:-rotate-6 group-hover:text-signal"
                  />
                  <span className="text-[clamp(22px,2.4vw,30px)] font-medium">{label}</span>
                  <span className="hidden text-mute-dark sm:inline">{handle(href)}</span>
                  <ArrowUpRightIcon
                    size={30}
                    weight="bold"
                    aria-hidden
                    className="ml-auto shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <DotWordmark text="SUFIAN PRANTO" className="shell mt-24 md:mt-32" />

      <div className="shell flex flex-col gap-2 border-t border-ink-line pb-[calc(96px+env(safe-area-inset-bottom,0px))] pt-6 text-[14px] text-mute-dark sm:flex-row sm:justify-between lg:pb-8">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <a href="#top" className="w-fit underline-offset-4 hover:text-paper hover:underline">
          Back to top
        </a>
      </div>
    </section>
  );
}
