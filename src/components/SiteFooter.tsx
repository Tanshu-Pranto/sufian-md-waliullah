import Link from "next/link";
import { profile, projects, projectUrl } from "@/data/content";
import DotWordmark from "./DotWordmark";
import LogoMark from "./LogoMark";

const pages = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const elsewhere = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "X", href: profile.x },
];

const linkClass = "text-[15px] text-paper/85 underline-offset-4 transition-colors duration-200 hover:text-paper hover:underline";

export default function SiteFooter() {
  const upper = profile.name.toUpperCase();
  const [first, ...rest] = upper.split(" ");

  return (
    <footer className="bg-ink text-paper">
      <div className="shell grid gap-12 border-t border-ink-line pt-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex items-center gap-3" aria-label={`${profile.name}, home`}>
            <span className="grid size-10 place-items-center rounded-[10px] bg-ink-2 ring-1 ring-ink-line">
              <LogoMark size={19} />
            </span>
            <span className="text-[16px] font-medium">{profile.name}</span>
          </Link>
          <p className="mt-5 max-w-[36ch] text-[15px] text-mute-dark">{profile.tagline}</p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
          <div>
            <p className="text-[14px] text-mute-dark">Pages</p>
            <ul className="mt-4 space-y-2.5">
              {pages.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className={linkClass}>
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[14px] text-mute-dark">Case studies</p>
            <ul className="mt-4 space-y-2.5">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link href={projectUrl(p)} className={linkClass}>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[14px] text-mute-dark">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              {elsewhere.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer me" className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${profile.email}`} className={linkClass}>
                  Email
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <DotWordmark text={upper} narrowLines={[first, rest.join(" ")]} className="shell mt-20 md:mt-28" />

      <div className="shell flex flex-col gap-2 border-t border-ink-line pb-[calc(96px+env(safe-area-inset-bottom,0px))] pt-6 text-[14px] text-mute-dark sm:flex-row sm:justify-between lg:pb-8">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <a href="#top" className="w-fit underline-offset-4 hover:text-paper hover:underline">
          Back to top
        </a>
      </div>
    </footer>
  );
}
