import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import Nav from "@/components/Nav";
import PageHeader from "@/components/PageHeader";
import Panel from "@/components/Panel";
import SiteFooter from "@/components/SiteFooter";
import Vignette, { vignetteTone } from "@/components/Vignette";
import { profile, projects, projectUrl } from "@/data/content";
import { pageMetadata, projectsSchema } from "@/lib/seo";

const description = `Projects by ${profile.name}: full-stack builds with MongoDB, Express, React, Node.js, Next.js and PostgreSQL, each with a short case study of what was built and why.`;

export const metadata = pageMetadata({ title: "Projects", description, path: "/projects" });

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={projectsSchema(description)} />
      <Nav />
      <main id="main">
        <PageHeader
          crumbs={[{ name: "Projects", path: "/projects" }]}
          title="Projects."
          rest="Full-stack builds, front to back."
          lead="Each project covers the whole stack: a data model, an API and an interface. Open one to see the features, the stack and the reasoning behind it."
          icon="kanban"
        />

        <Panel>
          <ul className="shell grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((p) => (
              <li key={p.slug}>
                <article className="group relative flex h-full flex-col">
                  <div className={`h-[340px] overflow-hidden rounded-[20px] ${vignetteTone(p.vignette)}`}>
                    <Vignette kind={p.vignette} />
                  </div>
                  <div className="flex flex-1 flex-col px-1 pt-6">
                    <h2 className="text-[26px] font-medium leading-tight">
                      <Link href={projectUrl(p)} className="after:absolute after:inset-0 after:rounded-[20px]">
                        {p.title}
                      </Link>
                    </h2>
                    <p className="mt-3 text-mute">{p.summary}</p>
                    <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                      <ul className="flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <li key={t} className="rounded-[8px] bg-paper-2 px-3 py-1.5 text-[14px]">
                            {t}
                          </li>
                        ))}
                      </ul>
                      <span
                        aria-hidden
                        className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-ink text-paper transition-colors duration-200 group-hover:bg-signal group-hover:text-ink"
                      >
                        <ArrowUpRightIcon size={18} weight="bold" />
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Panel>

        <CtaBand />
      </main>
      <SiteFooter />
    </>
  );
}
