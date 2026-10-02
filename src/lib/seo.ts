import type { Metadata } from "next";
import { faqs, profile, projects, serviceList, site, skills, type Faq, type Project } from "@/data/content";

export const absolute = (path = "/") => `${site.url}${path === "/" ? "" : path}`;

const ids = {
  person: `${site.url}/#person`,
  website: `${site.url}/#website`,
};

/** Title, description, canonical and social cards for one page. */
export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title?: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  const fullTitle = title ? `${title} | ${profile.name}` : `${profile.name} | MERN Stack Developer in ${profile.location}`;
  // Next replaces (not merges) openGraph and twitter objects per page, so the
  // shared fields are repeated here.
  const asProfile = path === "/" || path === "/about";
  return {
    title: title ? title : { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      ...(asProfile
        ? { type: "profile" as const, firstName: profile.firstName, lastName: profile.lastName }
        : { type: "website" as const }),
      siteName: profile.name,
      locale: "en_US",
      url: path,
      title: fullTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    ...(index ? {} : { robots: { index: false, follow: true } }),
  };
}

// ---------- schema.org (JSON-LD) ----------

const sameAs = [profile.github, profile.linkedin, profile.x];
const knowsAbout = ["MERN stack", "Full-stack web development", ...skills.flatMap((g) => g.items.map((i) => i.name))];

export const personSchema = {
  "@type": "Person",
  "@id": ids.person,
  name: profile.name,
  givenName: profile.firstName,
  familyName: profile.lastName,
  alternateName: profile.alternateNames,
  url: site.url,
  image: absolute("/img/sufian-portrait.webp"),
  email: `mailto:${profile.email}`,
  jobTitle: "MERN Stack Developer",
  description: profile.tagline,
  knowsAbout,
  sameAs,
  homeLocation: {
    "@type": "Country",
    name: profile.location,
    identifier: profile.countryCode,
  },
  hasOccupation: {
    "@type": "Occupation",
    name: "MERN Stack Developer",
    occupationLocation: { "@type": "Country", name: profile.location },
    skills: knowsAbout.join(", "),
  },
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": ids.website,
  url: site.url,
  name: profile.name,
  description: profile.tagline,
  inLanguage: "en",
  author: { "@id": ids.person },
  publisher: { "@id": ids.person },
};

const webPage = (type: string, path: string, name: string, description: string) => ({
  "@type": type,
  "@id": `${absolute(path)}#webpage`,
  url: absolute(path),
  name,
  description,
  inLanguage: "en",
  isPartOf: { "@id": ids.website },
  about: { "@id": ids.person },
  dateModified: site.updated,
});

export const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    item: absolute(t.path),
  })),
});

const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });

export const homeSchema = (description: string) =>
  graph(websiteSchema, personSchema, { ...webPage("WebPage", "/", profile.name, description), mainEntity: { "@id": ids.person } });

export const aboutSchema = (description: string) =>
  graph(
    personSchema,
    {
      ...webPage("ProfilePage", "/about", `About ${profile.name}`, description),
      mainEntity: { "@id": ids.person },
      dateCreated: "2026-10-02",
    },
    breadcrumbs([{ name: "About", path: "/about" }]),
  );

export const servicesSchema = (description: string) =>
  graph(
    personSchema,
    webPage("WebPage", "/services", "Services", description),
    {
      "@type": "ItemList",
      name: `Services by ${profile.name}`,
      itemListElement: serviceList.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          "@id": `${absolute("/services")}#${s.slug}`,
          name: s.title,
          description: s.summary,
          serviceType: s.title,
          provider: { "@id": ids.person },
          areaServed: "Worldwide",
          availableChannel: { "@type": "ServiceChannel", serviceUrl: absolute("/contact") },
        },
      })),
    },
    breadcrumbs([{ name: "Services", path: "/services" }]),
  );

const projectNode = (p: Project) => ({
  "@type": "CreativeWork",
  "@id": `${absolute(`/projects/${p.slug}`)}#work`,
  name: p.title,
  headline: p.summary,
  description: p.detail,
  url: absolute(`/projects/${p.slug}`),
  keywords: p.tags.join(", "),
  creator: { "@id": ids.person },
  author: { "@id": ids.person },
  ...(p.links.length ? { sameAs: p.links.map((l) => l.href) } : {}),
});

export const projectsSchema = (description: string) =>
  graph(
    personSchema,
    {
      ...webPage("CollectionPage", "/projects", "Projects", description),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: projects.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absolute(`/projects/${p.slug}`), name: p.title })),
      },
    },
    breadcrumbs([{ name: "Projects", path: "/projects" }]),
  );

export const projectSchema = (p: Project) =>
  graph(
    personSchema,
    { ...webPage("WebPage", `/projects/${p.slug}`, p.title, p.summary), mainEntity: { "@id": `${absolute(`/projects/${p.slug}`)}#work` } },
    projectNode(p),
    breadcrumbs([
      { name: "Projects", path: "/projects" },
      { name: p.title, path: `/projects/${p.slug}` },
    ]),
  );

export const faqSchema = (description: string, list: Faq[] = faqs) =>
  graph(
    personSchema,
    {
      ...webPage("FAQPage", "/faq", "Frequently asked questions", description),
      mainEntity: list.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    breadcrumbs([{ name: "FAQ", path: "/faq" }]),
  );

export const contactSchema = (description: string) =>
  graph(
    personSchema,
    { ...webPage("ContactPage", "/contact", `Contact ${profile.name}`, description), mainEntity: { "@id": ids.person } },
    breadcrumbs([{ name: "Contact", path: "/contact" }]),
  );
