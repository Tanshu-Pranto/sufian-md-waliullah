import About from "@/components/About";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Process from "@/components/Process";
import Services from "@/components/Services";
import StackTrace from "@/components/StackTrace";
import Work from "@/components/Work";

export default function Home() {
  return (
    <>
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
    </>
  );
}
