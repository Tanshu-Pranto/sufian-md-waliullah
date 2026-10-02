import About from "@/components/About";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import Nav from "@/components/Nav";
import Process from "@/components/Process";
import Services from "@/components/Services";
import SiteFooter from "@/components/SiteFooter";
import StackTrace from "@/components/StackTrace";
import Work from "@/components/Work";
import { profile } from "@/data/content";
import { homeSchema, pageMetadata } from "@/lib/seo";

const description = `${profile.tagline} Open to internships, freelance projects and collaborations.`;

export const metadata = pageMetadata({ description, path: "/" });

export default function Home() {
  return (
    <>
      <JsonLd data={homeSchema(description)} />
      <Nav />
      <main id="main">
        {/* The hero stays pinned while the About panel slides up over it. */}
        <div className="relative">
          <Hero />
          <About />
        </div>
        <Services />
        <StackTrace />
        <Work />
        <Process />
        <FAQ />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
