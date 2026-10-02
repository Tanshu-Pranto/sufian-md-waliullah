import Link from "next/link";
import ArrowLink from "@/components/ArrowLink";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";

export const metadata = { title: "Page not found", robots: { index: false } };

const links = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "FAQ", href: "/faq" },
];

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main">
        <section id="top" data-nav-theme="dark" className="flex min-h-svh items-center bg-ink pb-28 pt-32 text-paper">
          <div className="shell">
            <p aria-hidden className="font-display text-[clamp(96px,22vw,260px)] font-extrabold leading-none">
              404
            </p>
            <h1 className="mt-6 text-[clamp(28px,3.6vw,44px)] font-medium leading-tight">
              This page doesn&apos;t exist. <span className="text-faint-dark">It may have moved.</span>
            </h1>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ArrowLink href="/" tone="signal">
                Back to home
              </ArrowLink>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="text-mute-dark underline-offset-4 hover:text-paper hover:underline">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
