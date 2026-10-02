import type { MetadataRoute } from "next";
import { projects, projectUrl, site } from "@/data/content";
import { absolute } from "@/lib/seo";

// Also served at /site.xml (see next.config.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = site.updated;
  const portrait = absolute("/img/sufian-portrait.webp");

  return [
    { url: absolute("/"), lastModified, changeFrequency: "monthly", priority: 1, images: [portrait] },
    { url: absolute("/about"), lastModified, changeFrequency: "monthly", priority: 0.9, images: [portrait] },
    { url: absolute("/services"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: absolute("/projects"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    // Sample projects are noindex, so they stay out of the sitemap too.
    ...projects
      .filter((p) => !p.placeholder)
      .map((p) => ({ url: absolute(projectUrl(p)), lastModified, changeFrequency: "yearly" as const, priority: 0.7 })),
    { url: absolute("/faq"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: absolute("/contact"), lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];
}
