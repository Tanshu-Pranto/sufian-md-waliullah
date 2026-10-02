// ============================================================
//  ALL SITE CONTENT LIVES HERE.
//  Lines marked PLACEHOLDER need Sufian's real info swapped in.
// ============================================================

import type { DotIconName } from "./dot-icons";

export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mdsufian.me").replace(/\/$/, ""),
  // Bump when page content changes; feeds sitemap <lastmod> and page dates.
  updated: "2026-10-02",
};

export const profile = {
  name: "Sufian Md. Waliullah",
  firstName: "Sufian",
  lastName: "Waliullah",
  // Other spellings people search for. Helps search and AI engines match the name.
  alternateNames: ["Sufian Waliullah", "Md. Sufian", "Md Sufian Waliullah"],
  role: "MERN stack developer",
  tagline:
    "Sufian Md. Waliullah is a MERN stack developer in Bangladesh who builds full-stack web apps with MongoDB, Express, React, Node.js and Next.js.",
  // PLACEHOLDER: confirm location and time zone
  location: "Bangladesh",
  countryCode: "BD",
  timeZone: "Asia/Dhaka",
  timeZoneLabel: "GMT+6",
  // PLACEHOLDER: real contact details. These also feed the structured data
  // (schema.org sameAs), so wrong links here hurt search, not just the page.
  email: "hello@mdsufian.me",
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

// Short, quotable facts. Shown on /about and used for llms.txt.
export const keyFacts = [
  { label: "Name", value: profile.name },
  { label: "Role", value: "MERN stack developer (MongoDB, Express, React, Node.js)" },
  { label: "Based in", value: `${profile.location}, working remotely` },
  { label: "Time zone", value: `${profile.timeZoneLabel} (${profile.timeZone})` },
  { label: "Core stack", value: "Next.js, React, TypeScript, Node.js, Express, MongoDB, PostgreSQL" },
  { label: "Open to", value: profile.openTo },
  { label: "Contact", value: profile.email },
];

export const skills: { group: string; items: { name: string; note: string }[] }[] = [
  {
    group: "Frontend",
    items: [
      { name: "React", note: "Components, hooks, state" },
      { name: "Next.js", note: "App Router, server rendering, routing" },
      { name: "TypeScript", note: "Typed props, APIs and data models" },
      { name: "Tailwind CSS", note: "Responsive, utility-first styling" },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "Node.js", note: "Runtime for APIs and scripts" },
      { name: "Express", note: "Routing, middleware, validation" },
      { name: "REST APIs", note: "Resource design, status codes, errors" },
      { name: "JWT auth", note: "Sessions, refresh tokens, protected routes" },
    ],
  },
  {
    group: "Data",
    items: [
      { name: "MongoDB", note: "Document modeling and indexes" },
      { name: "Mongoose", note: "Schemas and validation" },
      { name: "PostgreSQL", note: "Relational data and joins" },
      { name: "Prisma", note: "Type-safe queries and migrations" },
    ],
  },
  {
    group: "Tooling",
    items: [
      { name: "Git & GitHub", note: "Branches, reviews, history" },
      { name: "Docker", note: "Reproducible environments" },
      { name: "Postman", note: "API testing and collections" },
      { name: "Vercel", note: "Previews and production deploys" },
    ],
  },
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

// The /services page. Each entry becomes a schema.org Service.
export const serviceList: {
  slug: string;
  title: string;
  icon: DotIconName;
  summary: string;
  forWho: string;
  includes: string[];
  stack: string[];
}[] = [
  {
    slug: "mern-web-apps",
    title: "Full-stack MERN web apps",
    icon: "stack",
    summary:
      "A complete web application built on MongoDB, Express, React and Node.js: data model, API, interface and deployment, owned by one developer.",
    forWho: "Founders and small teams who need a working product, not just a front end or just a back end.",
    includes: [
      "Data model and API design written down before the UI",
      "Authentication, roles and protected routes",
      "Responsive interface built in React or Next.js",
      "Preview deployments you can click from the first week",
    ],
    stack: ["MongoDB", "Express", "React", "Node.js", "Next.js"],
  },
  {
    slug: "rest-api-development",
    title: "REST API development",
    icon: "braces",
    summary:
      "Node.js and Express APIs with input validation, JWT authentication, consistent error responses and documentation your front end team can rely on.",
    forWho: "Teams with a front end or mobile app that needs a dependable back end.",
    includes: [
      "Resource and route design with clear status codes",
      "Validation and error messages that explain what went wrong",
      "JWT sign-in, refresh tokens and permission checks",
      "A Postman collection or written docs for every endpoint",
    ],
    stack: ["Node.js", "Express", "JWT", "Postman"],
  },
  {
    slug: "nextjs-react-frontends",
    title: "Next.js and React front ends",
    icon: "browser",
    summary:
      "Fast, accessible interfaces in Next.js and React, built mobile first and connected to your existing API.",
    forWho: "Products with a working back end that need a better interface, or a marketing site that needs to load fast.",
    includes: [
      "Server-rendered pages that search engines can read",
      "Layouts tested from 320px phones up to wide screens",
      "Keyboard support, visible focus and readable contrast",
      "Typed data fetching against your API",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "database-design",
    title: "Database design",
    icon: "database",
    summary:
      "Schemas for MongoDB or PostgreSQL that match how the app reads and writes data, with indexes for the queries that matter.",
    forWho: "New projects choosing a database, and existing apps slowed down by their data model.",
    includes: [
      "Collections or tables mapped from real use cases",
      "Indexes for the slow queries, checked with explain plans",
      "Migrations with Prisma or schema validation with Mongoose",
      "A written recommendation on MongoDB versus PostgreSQL for your case",
    ],
    stack: ["MongoDB", "Mongoose", "PostgreSQL", "Prisma"],
  },
  {
    slug: "deployment",
    title: "Deployment and upkeep",
    icon: "rocket",
    summary:
      "Getting an app to production and keeping it there: environments, preview links, Docker where needed, and small fixes after launch.",
    forWho: "Apps that work on a laptop but not yet on the internet, or that need someone to keep them healthy.",
    includes: [
      "Production and preview environments on Vercel",
      "Environment variables and secrets kept out of the code",
      "Docker setup for servers that need it",
      "Bug fixes and small features after launch",
    ],
    stack: ["Vercel", "Docker", "Git & GitHub"],
  },
  {
    slug: "existing-codebases",
    title: "Work on an existing codebase",
    icon: "branch",
    summary:
      "Joining a JavaScript or TypeScript project already in progress to fix bugs, add features or clean up the parts that slow the team down.",
    forWho: "Teams that need another pair of hands on a React, Next.js or Node.js codebase.",
    includes: [
      "Reading and running the project locally before changing anything",
      "A small first fix so you can see how I work",
      "Pull requests with short, clear descriptions",
      "Notes on risky areas I find along the way",
    ],
    stack: ["React", "Next.js", "Node.js", "TypeScript"],
  },
];

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
  slug: string;
  title: string;
  summary: string;
  detail: string;
  features: string[];
  stackNotes: { name: string; use: string }[];
  tags: string[];
  vignette: "shop" | "kanban" | "chat";
  links: { label: string; href: string }[];
  // While true the case study page is kept out of search (noindex, not in
  // the sitemap). Set to false once the project is real.
  placeholder: boolean;
};

export const projects: Project[] = [
  // PLACEHOLDER: replace with Sufian's real projects, add links, then set placeholder: false
  {
    slug: "storefront",
    title: "Storefront",
    summary: "An online store with a product catalog, cart, checkout and an admin dashboard.",
    detail:
      "Next.js on the front, an Express API behind it, MongoDB for products and orders. The cart survives a refresh and checkout validates stock on the server.",
    features: [
      "Product catalog with categories and search",
      "Cart that persists across refreshes and devices",
      "Checkout that re-checks stock and prices on the server",
      "Admin dashboard for products, orders and inventory",
    ],
    stackNotes: [
      { name: "Next.js", use: "Server-rendered catalog pages that search engines can index" },
      { name: "Express", use: "Cart, order and admin API with role checks" },
      { name: "MongoDB", use: "Products and orders as documents, indexed by category" },
    ],
    tags: ["Next.js", "Express", "MongoDB"],
    vignette: "shop",
    links: [],
    placeholder: true,
  },
  {
    slug: "taskboard",
    title: "Taskboard",
    summary: "A kanban board for small teams with drag and drop and shared workspaces.",
    detail:
      "React with optimistic updates, so cards move instantly and roll back if the server says no. PostgreSQL keeps the ordering of cards consistent.",
    features: [
      "Boards, columns and cards with drag and drop",
      "Shared workspaces with member roles",
      "Optimistic moves that roll back on a server error",
      "Card ordering stored so it stays consistent for everyone",
    ],
    stackNotes: [
      { name: "React", use: "Drag and drop board with optimistic state" },
      { name: "Node.js", use: "API for boards, cards and memberships" },
      { name: "PostgreSQL", use: "Relational workspaces, members and card positions" },
    ],
    tags: ["React", "Node.js", "PostgreSQL"],
    vignette: "kanban",
    links: [],
    placeholder: true,
  },
  {
    slug: "roomchat",
    title: "Roomchat",
    summary: "Multi-room chat with typing indicators, message history and JWT sign-in.",
    detail:
      "Messages are stored per room in MongoDB and paged as you scroll up. Auth tokens refresh quietly, so a long session never drops you mid-conversation.",
    features: [
      "Public and private rooms",
      "Typing indicators and read receipts",
      "Message history that loads older pages as you scroll up",
      "JWT sign-in with silent token refresh",
    ],
    stackNotes: [
      { name: "React", use: "Chat interface with paged history" },
      { name: "Express", use: "Rooms, messages and auth endpoints" },
      { name: "MongoDB", use: "Messages stored per room with a time index" },
    ],
    tags: ["React", "Express", "MongoDB"],
    vignette: "chat",
    links: [],
    placeholder: true,
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

export type Faq = { q: string; a: string; home?: boolean };

// `home: true` questions also appear on the home page. All appear on /faq.
export const faqs: Faq[] = [
  {
    q: "Who is Sufian Md. Waliullah?",
    a: "Sufian Md. Waliullah is a MERN stack developer based in Bangladesh. He builds full-stack web applications with MongoDB, Express, React and Node.js, uses Next.js for production front ends, and works remotely with clients and teams.",
  },
  {
    q: "What kind of work do you take on?",
    a: "Full-stack web apps: REST APIs, database design, React and Next.js front ends, and getting all of it deployed. I'm happy to own a whole project or join an existing codebase.",
    home: true,
  },
  {
    q: "Are you available right now?",
    // PLACEHOLDER: confirm with Sufian
    a: "Yes. I'm open to internships, freelance projects and collaborations. Email me what you're building and roughly when you need it.",
    home: true,
  },
  {
    q: "What is the MERN stack?",
    a: "MERN is a JavaScript stack for web apps: MongoDB stores the data, Express handles HTTP routes on the server, React builds the interface, and Node.js runs the server. Because every layer uses JavaScript or TypeScript, one developer can work across the whole app.",
  },
  {
    q: "Which database should my project use?",
    a: "If your data is mostly self-contained documents, like posts, products or messages, MongoDB is quick to build with. If it's full of relationships and reports, like orders, invoices or permissions, PostgreSQL is the safer choice. I'll explain the trade-off for your case before we pick.",
    home: true,
  },
  {
    q: "Do you work remotely?",
    a: "Yes. I'm in Bangladesh (GMT+6) and used to working async. You'll get short written updates and a preview link, so you never have to wait for a call to see progress.",
    home: true,
  },
  {
    q: "Do you work with clients outside Bangladesh?",
    a: "Yes. Everything happens remotely over email, chat and shared preview links, so location doesn't matter. I overlap with European mornings and Asian working hours, and can schedule calls for the Americas.",
  },
  {
    q: "Can you work on an existing codebase?",
    a: "Yes. I start by reading the code and running it locally, then I fix something small first so we both see how I work before I touch anything big.",
    home: true,
  },
  {
    q: "Do you build with Next.js as well as plain React?",
    a: "Yes. I use Next.js when pages need server rendering, good SEO or API routes next to the front end, and plain React with Vite for apps that live behind a login.",
  },
  {
    q: "How do I hire you or start a project?",
    a: `Email ${profile.email} with what you're building, who it's for, any deadline, and links to designs or an existing repo. I'll reply with questions or a rough plan for the first slice.`,
  },
];

export const navLinks = [
  { id: "about", label: "About", href: "/about" },
  { id: "services", label: "Services", href: "/services" },
  { id: "work", label: "Work", href: "/projects" },
  { id: "faq", label: "FAQ", href: "/faq" },
  { id: "contact", label: "Contact", href: "/contact" },
] as const;

export type NavId = (typeof navLinks)[number]["id"];

export const projectUrl = (p: Pick<Project, "slug">) => `/projects/${p.slug}`;
