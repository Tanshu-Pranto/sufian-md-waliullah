import { ArrowUpRightIcon, EnvelopeSimpleIcon, GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react/ssr";
import { profile } from "@/data/content";
import ArrowLink from "./ArrowLink";
import CopyEmail from "./CopyEmail";
import LocalTime from "./LocalTime";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const handle = (url: string) => `@${url.replace(/\/$/, "").split("/").pop()}`;

const socials = [
  { label: "GitHub", href: profile.github, detail: handle(profile.github), Icon: GithubLogoIcon, external: true },
  { label: "LinkedIn", href: profile.linkedin, detail: handle(profile.linkedin), Icon: LinkedinLogoIcon, external: true },
  { label: "Email", href: `mailto:${profile.email}`, detail: profile.email, Icon: EnvelopeSimpleIcon, external: false },
];

// On the home page this is the closing section; on /contact the page header
// already says it, so the section heading is dropped.
export default function Contact({ standalone = false }: { standalone?: boolean }) {
  const [user, domain] = profile.email.split("@");

  return (
    <section
      id="contact"
      data-nav="contact"
      data-nav-theme="dark"
      aria-label={standalone ? "Contact details" : undefined}
      className={`relative z-10 overflow-clip bg-ink pb-8 text-paper ${standalone ? "" : "-mt-7 rounded-t-[28px]"}`}
    >
      <div className={`shell ${standalone ? "pt-4" : "pt-24 md:pt-32"}`}>
        {standalone ? null : (
          <Reveal>
            <SectionHeading dark lead="Have something to build?" rest="Email is the fastest way to reach me." />
          </Reveal>
        )}

        <Reveal delay={80}>
          <a
            href={`mailto:${profile.email}`}
            className={`${standalone ? "" : "mt-12"} block w-fit font-display text-[clamp(30px,7.4vw,112px)] font-extrabold leading-[0.95] transition-colors duration-200 hover:text-signal`}
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
            {socials.map(({ label, href, detail, Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer me" : undefined}
                  className="group flex items-center gap-5 py-5 md:gap-8 md:py-6"
                >
                  <Icon
                    size={48}
                    weight="duotone"
                    aria-hidden
                    className="shrink-0 transition-[color,transform] duration-300 ease-out group-hover:-rotate-6 group-hover:text-signal"
                  />
                  <span className="text-[clamp(22px,2.4vw,30px)] font-medium">{label}</span>
                  <span className="hidden text-mute-dark sm:inline">{detail}</span>
                  <ArrowUpRightIcon
                    size={30}
                    weight="bold"
                    aria-hidden
                    className="ml-auto shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                  {external ? <span className="sr-only">(opens in a new tab)</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </section>
  );
}
