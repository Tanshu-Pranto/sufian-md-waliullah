import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { profile, site } from "@/data/content";
import type { DotIconName } from "@/data/dot-icons";
import DotIcon from "./DotIcon";
import HalftoneFade from "./HalftoneFade";

const updated = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
  new Date(site.updated),
);

/** Dark opening band for inner pages: breadcrumb, h1, lead, byline. */
export default function PageHeader({
  crumbs,
  title,
  rest,
  lead,
  icon,
  fade = true,
  children,
}: {
  crumbs: { name: string; path: string }[];
  title: string;
  rest?: string;
  lead: string;
  icon?: DotIconName;
  // Halftone tail at the bottom; off when the next section is also dark.
  fade?: boolean;
  children?: ReactNode;
}) {
  const trail = [{ name: "Home", path: "/" }, ...crumbs];

  return (
    <section
      id="top"
      data-nav-theme="dark"
      className={`relative overflow-clip bg-ink pt-32 text-paper md:pt-44 ${fade ? "pb-32 md:pb-40" : "pb-14 md:pb-16"}`}
    >
      <div className="shell relative grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-[14px] text-mute-dark">
              {trail.map((c, i) => {
                const last = i === trail.length - 1;
                return (
                  <li key={c.path} className="flex items-center gap-2">
                    {last ? (
                      <span aria-current="page" className="text-paper">
                        {c.name}
                      </span>
                    ) : (
                      <>
                        <Link href={c.path} className="underline-offset-4 hover:text-paper hover:underline">
                          {c.name}
                        </Link>
                        <CaretRightIcon size={12} weight="bold" aria-hidden />
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <h1 className="fade-up mt-8 max-w-[22ch] text-[clamp(36px,5.2vw,68px)] font-medium leading-[1.05] tracking-[-0.01em] text-balance">
            {title} {rest ? <span className="text-faint-dark">{rest}</span> : null}
          </h1>
          <p
            className="fade-up mt-7 max-w-[60ch] text-[18px] leading-relaxed text-paper/85"
            style={{ ["--delay" as string]: "120ms" }}
          >
            {lead}
          </p>
          <p className="fade-up mt-6 text-[14px] text-mute-dark" style={{ ["--delay" as string]: "200ms" }}>
            By{" "}
            <Link href="/about" className="text-paper underline-offset-4 hover:underline">
              {profile.name}
            </Link>{" "}
            · Updated <time dateTime={site.updated}>{updated}</time>
          </p>
          {children}
        </div>
        {icon ? (
          <div className="hidden lg:col-span-4 lg:flex lg:items-start lg:justify-end">
            <DotIcon name={icon} size={232} className="text-paper" />
          </div>
        ) : null}
      </div>
      {fade ? (
        <HalftoneFade className="pointer-events-none absolute inset-x-0 bottom-0 block h-24 w-full text-ink-3" cols={96} />
      ) : null}
    </section>
  );
}
