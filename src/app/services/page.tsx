import CtaBand from "@/components/CtaBand";
import DotIcon from "@/components/DotIcon";
import { FaqList } from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import Nav from "@/components/Nav";
import PageHeader from "@/components/PageHeader";
import Panel, { Block } from "@/components/Panel";
import SiteFooter from "@/components/SiteFooter";
import { faqs, profile, serviceList, steps } from "@/data/content";
import { pageMetadata, servicesSchema } from "@/lib/seo";

const description = `Services from ${profile.name}, a MERN stack developer in ${profile.location}: full-stack web apps, REST APIs with Node.js and Express, Next.js and React front ends, database design, and deployment.`;

export const metadata = pageMetadata({ title: "Services", description, path: "/services" });

const working = [
  { label: "Where", value: `Remote, from ${profile.location} (${profile.timeZoneLabel})` },
  { label: "Updates", value: "Short written notes and a preview link after each slice of work" },
  { label: "Code", value: "Your repository from day one, with clear commits and pull requests" },
  { label: "Start", value: "An email with what you're building, who it's for and any deadline" },
];

const serviceFaqs = faqs.filter((f) =>
  ["Which database should my project use?", "Can you work on an existing codebase?", "Do you work with clients outside Bangladesh?", "Do you build with Next.js as well as plain React?"].includes(f.q),
);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={servicesSchema(description)} />
      <Nav />
      <main id="main">
        <PageHeader
          crumbs={[{ name: "Services", path: "/services" }]}
          title="Services."
          rest="Full-stack web development with the MERN stack."
          lead="I build and ship web applications with MongoDB, Express, React and Node.js. Hire me for a whole product, or for one layer of it: the API, the database, the front end or the deploy."
          icon="stack"
        />

        <Panel>
          <div className="shell">
            <nav aria-label="Services on this page">
              <ul className="flex flex-wrap gap-2">
                {serviceList.map((s) => (
                  <li key={s.slug}>
                    <a href={`#${s.slug}`} className="block rounded-[8px] bg-paper-2 px-3 py-1.5 text-[14px] transition-colors hover:bg-paper-3">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="shell mt-16 divide-y divide-paper-line border-y border-paper-line">
            {serviceList.map((s) => (
              <article
                key={s.slug}
                id={s.slug}
                aria-labelledby={`${s.slug}-title`}
                className="grid gap-8 py-14 md:grid-cols-12 md:gap-8 md:py-16"
              >
                <div className="md:col-span-5">
                  <DotIcon name={s.icon} size={96} className="-ml-2 text-ink" />
                  <h2 id={`${s.slug}-title`} className="mt-6 text-[clamp(26px,2.6vw,34px)] font-medium leading-tight">
                    {s.title}
                  </h2>
                  <p className="mt-4 max-w-[44ch] text-[17px] leading-relaxed">{s.summary}</p>
                </div>
                <div className="md:col-span-7 md:pl-8 lg:pl-16">
                  <h3 className="text-[15px] text-mute">Good for</h3>
                  <p className="mt-2 max-w-[56ch]">{s.forWho}</p>
                  <h3 className="mt-8 text-[15px] text-mute">What&apos;s included</h3>
                  <ul className="mt-3 space-y-2.5">
                    {s.includes.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden className="mt-[0.55em] size-2 shrink-0 bg-signal" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <h3 className="mt-8 text-[15px] text-mute">Stack</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {s.stack.map((t) => (
                      <li key={t} className="rounded-[8px] bg-paper-2 px-3 py-1.5 text-[14px]">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <Block id="process" title="How a project runs." rest="Four steps, repeated until it ships.">
            <ol className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title} className="border-t-2 border-paper-3 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-display text-[52px] font-bold leading-none">
                      <span className="sr-only">Step </span>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <DotIcon name={s.icon} size={72} className="text-ink" />
                  </div>
                  <h3 className="mt-6 text-[20px] font-medium">{s.title}</h3>
                  <p className="mt-2 text-mute">{s.body}</p>
                </li>
              ))}
            </ol>
          </Block>

          <Block id="working-together" title="Working together." rest="What to expect.">
            <dl className="max-w-[880px] divide-y divide-paper-line border-y border-paper-line">
              {working.map((w) => (
                <div key={w.label} className="grid grid-cols-[110px_1fr] gap-4 py-4 sm:grid-cols-[160px_1fr]">
                  <dt className="text-[15px] text-mute">{w.label}</dt>
                  <dd>{w.value}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block id="questions" title="Questions about services.">
            <div className="max-w-[920px]">
              <FaqList items={serviceFaqs} initiallyOpen={null} />
            </div>
          </Block>
        </Panel>

        <CtaBand />
      </main>
      <SiteFooter />
    </>
  );
}
