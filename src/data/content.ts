// ============================================================
//  ALL SITE CONTENT LIVES HERE.
//  Lines marked PLACEHOLDER need Sufian's real info swapped in.
// ============================================================

import type { DotIconName } from "./dot-icons";

export const profile = {
  name: "Sufian MD Pranto",
  shortName: "Sufian Pranto",
  role: "MERN stack developer",
  tagline:
    "Sufian Pranto builds full-stack web apps with MongoDB, Express, React and Node.js, from the database schema to the screen you tap.",
  // PLACEHOLDER: confirm location and time zone
  location: "Bangladesh",
  timeZone: "Asia/Dhaka",
  timeZoneLabel: "GMT+6",
  // PLACEHOLDER: real contact details
  email: "hello@sufianpranto.dev",
  github: "https://github.com/sufianpranto",
  linkedin: "https://www.linkedin.com/in/sufianpranto",
  x: "https://x.com/sufianpranto",
  // PLACEHOLDER: confirm availability
  openTo: "Internships, freelance projects and collaborations",
};

export const heroIntro =
  "I build full-stack web apps with MongoDB, Express, React and Node.js, from the database schema to the screen you tap.";

// The big statement in the About section. Words fill in as you scroll.
export const aboutStatement =
  "I'm Sufian, a MERN stack developer in Bangladesh. I build complete web apps: the data model, the API, and the interface people use every day.";

// PLACEHOLDER: let Sufian rewrite these in his own voice
export const aboutParagraphs = [
  "I like owning a feature from the first schema sketch to the deploy. Working across the whole stack means fewer handoffs, and it means I understand why the API looks the way it does when I'm building the screen that calls it.",
  "I keep code typed, readable and small enough to change. I deploy early so there's always a working link to click, and I write down decisions so the next person (often me) knows why.",
];

export const facts = [
  { label: "Focus", value: "MERN stack and Next.js, end to end" },
  { label: "Based in", value: "Bangladesh, working remotely" },
  { label: "Open to", value: profile.openTo },
];

export const services = {
  interfaces: {
    title: "Interfaces",
    body: "React and Next.js front ends that load fast, work with a keyboard, and hold together on a 320px phone.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  apis: {
    title: "APIs",
    body: "REST APIs on Node.js and Express with validation, JWT auth and error responses that tell the client what went wrong.",
  },
  data: {
    title: "Data models",
    body: "MongoDB with Mongoose for flexible documents, PostgreSQL with Prisma when the data is relational.",
  },
  deploys: {
    title: "Deploys",
    body: "Preview links on every branch, Docker when the server needs it, and production on Vercel.",
  },
};

// Rows in the API card's live log.
export const apiLog = [
  { method: "GET", path: "/api/projects", status: 200, ms: 18 },
  { method: "POST", path: "/api/auth/login", status: 200, ms: 41 },
  { method: "GET", path: "/api/projects/42", status: 200, ms: 9 },
  { method: "PATCH", path: "/api/tasks/7", status: 204, ms: 22 },
  { method: "GET", path: "/api/users/me", status: 401, ms: 3 },
  { method: "POST", path: "/api/orders", status: 201, ms: 57 },
  { method: "DELETE", path: "/api/cart/3", status: 204, ms: 12 },
];

export type Layer = {
  id: "client" | "api" | "data";
  name: string;
  icon: DotIconName;
  tech: string[];
};

export const layers: Layer[] = [
  { id: "client", name: "Client", icon: "browser", tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { id: "api", name: "API", icon: "braces", tech: ["Node.js", "Express", "REST", "JWT auth"] },
  { id: "data", name: "Data", icon: "database", tech: ["MongoDB", "Mongoose", "PostgreSQL", "Prisma"] },
];

export const tooling = ["Git & GitHub", "Docker", "Postman", "Vercel"];

// One request, step by step. `at` is which layer the packet sits on.
export const traceSteps: { at: Layer["id"]; dir: "down" | "up"; text: string }[] = [
  { at: "client", dir: "down", text: "GET /api/projects  (cookie: session)" },
  { at: "api", dir: "down", text: "express router → verify JWT → ok" },
  { at: "data", dir: "down", text: "db.projects.find({ owner }) → 3 docs" },
  { at: "api", dir: "up", text: "shape JSON → 1.2 kB" },
  { at: "client", dir: "up", text: "200 OK in 42 ms → render list" },
];

export type Project = {
  title: string;
  summary: string;
  detail: string;
  tags: string[];
  vignette: "shop" | "kanban" | "chat";
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  // PLACEHOLDER: replace with Sufian's real projects, and add links
  {
    title: "Storefront",
    summary: "An online store with a product catalog, cart, checkout and an admin dashboard.",
    detail:
      "Next.js on the front, an Express API behind it, MongoDB for products and orders. The cart survives a refresh and checkout validates stock on the server.",
    tags: ["Next.js", "Express", "MongoDB"],
    vignette: "shop",
    links: [],
  },
  {
    title: "Taskboard",
    summary: "A kanban board for small teams with drag and drop and shared workspaces.",
    detail:
      "React with optimistic updates, so cards move instantly and roll back if the server says no. PostgreSQL keeps the ordering of cards consistent.",
    tags: ["React", "Node.js", "PostgreSQL"],
    vignette: "kanban",
    links: [],
  },
  {
    title: "Roomchat",
    summary: "Multi-room chat with typing indicators, message history and JWT sign-in.",
    detail:
      "Messages are stored per room in MongoDB and paged as you scroll up. Auth tokens refresh quietly, so a long session never drops you mid-conversation.",
    tags: ["React", "Express", "MongoDB"],
    vignette: "chat",
    links: [],
  },
];

export const steps: { title: string; body: string; icon: DotIconName }[] = [
  {
    title: "Understand",
    body: "We talk through the problem, who uses it and what done looks like. I write it down so we agree on scope before any code.",
    icon: "search",
  },
  {
    title: "Model the data",
    body: "I sketch the collections or tables and the API routes first. Getting the schema right early saves rewrites later.",
    icon: "tree",
  },
  {
    title: "Build a thin slice",
    body: "One feature working end to end and deployed to a preview link you can click, usually within the first few days.",
    icon: "terminal",
  },
  {
    title: "Ship and iterate",
    body: "Small releases with short notes on what changed. Feedback goes straight into the next slice.",
    icon: "rocket",
  },
];

export const faqs = [
  {
    q: "What kind of work do you take on?",
    a: "Full-stack web apps: REST APIs, database design, React and Next.js front ends, and getting all of it deployed. I'm happy to own a whole project or join an existing codebase.",
  },
  {
    q: "Are you available right now?",
    // PLACEHOLDER: confirm with Sufian
    a: "Yes. I'm open to internships, freelance projects and collaborations. Email me what you're building and roughly when you need it.",
  },
  {
    q: "Which database should my project use?",
    a: "If your data is mostly self-contained documents, like posts, products or messages, MongoDB is quick to build with. If it's full of relationships and reports, like orders, invoices or permissions, PostgreSQL is the safer choice. I'll explain the trade-off for your case before we pick.",
  },
  {
    q: "Do you work remotely?",
    a: "Yes. I'm in Bangladesh (GMT+6) and used to working async. You'll get short written updates and a preview link, so you never have to wait for a call to see progress.",
  },
  {
    q: "Can you work on an existing codebase?",
    a: "Yes. I start by reading the code and running it locally, then I fix something small first so we both see how I work before I touch anything big.",
  },
];

export const navLinks = [
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

export type NavId = (typeof navLinks)[number]["id"];
