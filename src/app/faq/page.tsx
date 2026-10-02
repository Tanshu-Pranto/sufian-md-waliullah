import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import Nav from "@/components/Nav";
import PageHeader from "@/components/PageHeader";
import Panel from "@/components/Panel";
import SiteFooter from "@/components/SiteFooter";
import { faqs, profile } from "@/data/content";
import { faqSchema, pageMetadata } from "@/lib/seo";

const description = `Answers to common questions about ${profile.name}: who he is, the MERN stack, availability, remote work, choosing MongoDB or PostgreSQL, and how to start a project.`;

export const metadata = pageMetadata({ title: "FAQ", description, path: "/faq" });

const slug = (q: string) =>
  q
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(description)} />
      <Nav />
      <main id="main">
        <PageHeader
          crumbs={[{ name: "FAQ", path: "/faq" }]}
          title="Frequently asked questions."
          rest="About me and working together."
          lead="Short, direct answers to the questions people ask before hiring a developer. If yours isn't here, email it."
          icon="chats"
        />

        <Panel>
          <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Every answer is visible, so the page reads well to people and to search engines alike. */}
            <nav aria-label="Questions on this page" className="lg:col-span-4">
              <ol className="space-y-2.5 lg:sticky lg:top-28">
                {faqs.map((f) => (
                  <li key={f.q}>
                    <a href={`#${slug(f.q)}`} className="text-[15px] text-mute underline-offset-4 hover:text-ink hover:underline">
                      {f.q}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="divide-y divide-paper-line border-y border-paper-line lg:col-span-8">
              {faqs.map((f) => (
                <section key={f.q} id={slug(f.q)} aria-labelledby={`${slug(f.q)}-q`} className="py-9">
                  <h2 id={`${slug(f.q)}-q`} className="text-[clamp(20px,2vw,26px)] font-medium leading-snug">
                    {f.q}
                  </h2>
                  <p className="mt-4 max-w-[62ch] text-[17px] leading-relaxed text-mute">{f.a}</p>
                </section>
              ))}
              <p className="py-9 text-[17px]">
                Still have a question?{" "}
                <Link href="/contact" className="underline decoration-1 underline-offset-4">
                  Get in touch
                </Link>
                .
              </p>
            </div>
          </div>
        </Panel>

        <CtaBand />
      </main>
      <SiteFooter />
    </>
  );
}
