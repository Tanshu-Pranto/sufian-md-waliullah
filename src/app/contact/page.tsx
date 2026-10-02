import Link from "next/link";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";
import Nav from "@/components/Nav";
import PageHeader from "@/components/PageHeader";
import Panel, { Block } from "@/components/Panel";
import SiteFooter from "@/components/SiteFooter";
import { profile } from "@/data/content";
import { contactSchema, pageMetadata } from "@/lib/seo";

const description = `Contact ${profile.name}, an AI engineer in ${profile.location}, about freelance projects, internships or collaborations. Email ${profile.email}.`;

export const metadata = pageMetadata({ title: "Contact", description, path: "/contact" });

const include = [
  { title: "What you're building", body: "A few sentences on the product and who uses it." },
  { title: "Where it stands", body: "An idea, designs, or an existing codebase. Links help." },
  { title: "When you need it", body: "A deadline or a rough timeline, even if it's flexible." },
  { title: "What you need from me", body: "The whole app, or one part: API, database, front end or deploy." },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactSchema(description)} />
      <Nav />
      <main id="main">
        <PageHeader
          crumbs={[{ name: "Contact", path: "/contact" }]}
          title={`Contact ${profile.name}.`}
          rest="Email is the fastest way to reach me."
          lead={`I'm open to ${profile.openTo.toLowerCase()}. Write to ${profile.email} and I'll reply with questions or a rough plan for the first slice of work.`}
          fade={false}
        />
        <Contact standalone />

        <Panel>
          <Block id="what-to-include" title="What to include." rest="So I can reply with something useful.">
            <ol className="grid max-w-[1000px] gap-x-8 gap-y-10 md:grid-cols-2">
              {include.map((item, i) => (
                <li key={item.title} className="flex gap-5 border-t-2 border-paper-3 pt-6">
                  <span className="font-display text-[40px] font-bold leading-none">{i + 1}</span>
                  <div>
                    <h3 className="text-[20px] font-medium">{item.title}</h3>
                    <p className="mt-2 text-mute">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-14 max-w-[60ch] text-[17px] text-mute">
              Not sure yet? The{" "}
              <Link href="/faq" className="text-ink underline decoration-1 underline-offset-4">
                FAQ
              </Link>{" "}
              covers availability, remote work and how projects run, and{" "}
              <Link href="/services" className="text-ink underline decoration-1 underline-offset-4">
                services
              </Link>{" "}
              lists the kinds of work I take on.
            </p>
          </Block>
        </Panel>
      </main>
      <SiteFooter />
    </>
  );
}
