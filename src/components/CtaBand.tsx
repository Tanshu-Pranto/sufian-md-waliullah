import { profile } from "@/data/content";
import ArrowLink from "./ArrowLink";
import SectionHeading from "./SectionHeading";

// Closing prompt on inner pages, sitting just above the footer.
export default function CtaBand() {
  return (
    <section data-nav-theme="dark" className="relative z-10 -mt-7 rounded-t-[28px] bg-ink pb-20 pt-20 text-paper md:pt-28">
      <div className="shell flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <SectionHeading dark lead="Have something to build?" rest="Tell me what it is and when you need it." />
        <div className="flex flex-wrap gap-3">
          <ArrowLink href="/contact" tone="signal">
            Start a project
          </ArrowLink>
          <ArrowLink href={`mailto:${profile.email}`} tone="paper">
            Email me
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
