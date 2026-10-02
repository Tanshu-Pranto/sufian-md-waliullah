// Plain-text summaries for AI engines, following the llms.txt convention
// (https://llmstxt.org): a title, a one-paragraph summary, then link lists.
import { faqs, keyFacts, profile, projects, projectUrl, serviceList, site, skills, steps } from "@/data/content";
import { absolute } from "./seo";

const pages = [
  { name: "About", path: "/about", note: `Who ${profile.name} is, key facts, skills and how he works` },
  { name: "Services", path: "/services", note: "AI features with LLMs and RAG, full-stack MERN apps, REST APIs, Next.js front ends, database design, deployment" },
  { name: "Projects", path: "/projects", note: "Case studies of full-stack builds" },
  { name: "FAQ", path: "/faq", note: "Availability, remote work, the MERN stack, choosing a database" },
  { name: "Contact", path: "/contact", note: `How to reach ${profile.firstName} and what to include` },
];

const facts = () => keyFacts.map((f) => `- ${f.label}: ${f.value}`).join("\n");

export function llmsTxt() {
  return `# ${profile.name}

> ${profile.tagline} He works remotely from ${profile.location} (${profile.timeZoneLabel}) and is open to ${profile.openTo.toLowerCase()}.

${facts()}

## Pages

${pages.map((p) => `- [${p.name}](${absolute(p.path)}): ${p.note}`).join("\n")}

## Services

${serviceList.map((s) => `- [${s.title}](${absolute(`/services#${s.slug}`)}): ${s.summary}`).join("\n")}

## Profiles

- [GitHub](${profile.github})
- [LinkedIn](${profile.linkedin})

## Optional

- [Full text of this site for language models](${absolute("/llms-full.txt")})
- [Sitemap](${absolute("/sitemap.xml")})
`;
}

export function llmsFullTxt() {
  const realProjects = projects.filter((p) => !p.placeholder);
  return `# ${profile.name}: full profile

> ${profile.tagline}

Last updated: ${site.updated}
Canonical site: ${site.url}

## Key facts

${facts()}

## About

${profile.name} is an AI engineer based in ${profile.location}. He builds AI-powered web applications: the model calls, the data they draw on, and the interface. He works remotely and communicates in writing, with preview links after each piece of work.

## Skills

${skills.map((g) => `### ${g.group}\n\n${g.items.map((i) => `- ${i.name}: ${i.note}`).join("\n")}`).join("\n\n")}

## Services

${serviceList
  .map(
    (s) => `### ${s.title}

${s.summary}

Good for: ${s.forWho}

Includes:
${s.includes.map((i) => `- ${i}`).join("\n")}

Stack: ${s.stack.join(", ")}`,
  )
  .join("\n\n")}

## How a project runs

${steps.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`).join("\n")}
${
  realProjects.length
    ? `
## Projects

${realProjects
  .map(
    (p) => `### ${p.title}

${p.summary} ${p.detail}

Features:
${p.features.map((f) => `- ${f}`).join("\n")}

Stack: ${p.tags.join(", ")}
Case study: ${absolute(projectUrl(p))}`,
  )
  .join("\n\n")}
`
    : ""
}
## Frequently asked questions

${faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Contact

Email: ${profile.email}
Contact page: ${absolute("/contact")}
`;
}
