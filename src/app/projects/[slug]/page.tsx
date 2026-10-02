import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import ArrowLink from "@/components/ArrowLink";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import Nav from "@/components/Nav";
import PageHeader from "@/components/PageHeader";
import Panel, { Block } from "@/components/Panel";
import SiteFooter from "@/components/SiteFooter";
import Vignette, { vignetteTone } from "@/components/Vignette";
import { profile, projects, projectUrl } from "@/data/content";
import { pageMetadata, projectSchema } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const find = (slug: string) => projects.find((p) => p.slug === slug);

export async function generateMetadata(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const p = find(slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.title} case study`,
    description: `${p.summary} Built by ${profile.name} with ${p.tags.join(", ")}.`,
    path: projectUrl(p),
    // Sample projects stay out of search until they're replaced with real work.
    index: !p.placeholder,
  });
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const p = find(slug);
  if (!p) notFound();

  const i = projects.indexOf(p);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <>
      <JsonLd data={projectSchema(p)} />
      <Nav />
      <main id="main">
        <PageHeader
          crumbs={[
            { name: "Projects", path: "/projects" },
            { name: p.title, path: projectUrl(p) },
          ]}
          title={`${p.title}.`}
          rest="Case study."
          lead={`${p.summary} ${p.detail}`}
        >
          <ul className="mt-8 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <li key={t} className="rounded-[8px] bg-ink-3 px-3 py-1.5 text-[14px]">
                {t}
              </li>
            ))}
          </ul>
        </PageHeader>

        <Panel>
          <div className="shell">
            <div className={`h-[380px] overflow-hidden rounded-[22px] md:h-[440px] ${vignetteTone(p.vignette)}`}>
              <Vignette kind={p.vignette} />
            </div>
          </div>

          <Block id="features" title="What it does.">
            <ul className="grid max-w-[920px] gap-x-8 gap-y-4 md:grid-cols-2">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3 border-t border-paper-line pt-4">
                  <span aria-hidden className="mt-[0.55em] size-2 shrink-0 bg-signal" />
                  {f}
                </li>
              ))}
            </ul>
          </Block>

          <Block id="stack" title="The stack," rest="and what each part does.">
            <dl className="max-w-[920px] divide-y divide-paper-line border-y border-paper-line">
              {p.stackNotes.map((s) => (
                <div key={s.name} className="grid grid-cols-[120px_1fr] gap-4 py-4 sm:grid-cols-[160px_1fr]">
                  <dt className="font-medium">{s.name}</dt>
                  <dd className="text-mute">{s.use}</dd>
                </div>
              ))}
            </dl>
            {p.links.length > 0 ? (
              <div className="mt-10 flex flex-wrap gap-3">
                {p.links.map((l) => (
                  <ArrowLink key={l.href} href={l.href} external>
                    {l.label}
                  </ArrowLink>
                ))}
              </div>
            ) : null}
          </Block>

          <nav aria-label="More projects" className="shell mt-28 grid gap-3 sm:grid-cols-2 md:mt-36">
            <Link href={projectUrl(prev)} className="group press flex items-center gap-4 rounded-[18px] bg-paper-2 p-5">
              <ArrowLeftIcon size={22} weight="bold" aria-hidden className="transition-transform duration-200 group-hover:-translate-x-1" />
              <span>
                <span className="block text-[14px] text-mute">Previous</span>
                <span className="text-[19px] font-medium">{prev.title}</span>
              </span>
            </Link>
            <Link
              href={projectUrl(next)}
              className="group press flex items-center justify-end gap-4 rounded-[18px] bg-paper-2 p-5 text-right"
            >
              <span>
                <span className="block text-[14px] text-mute">Next</span>
                <span className="text-[19px] font-medium">{next.title}</span>
              </span>
              <ArrowRightIcon size={22} weight="bold" aria-hidden className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </nav>
        </Panel>

        <CtaBand />
      </main>
      <SiteFooter />
    </>
  );
}
