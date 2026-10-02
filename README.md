# Sufian Md. Waliullah, portfolio

Portfolio site for Sufian Md. Waliullah, MERN stack developer, at [www.mdsufian.me](https://www.mdsufian.me). Next.js 16 (App Router), Tailwind CSS 4, Motion (`framer-motion`). Every page is prerendered as static HTML.

```bash
npm install
npm run dev
```

## Editing content

All copy lives in [`src/data/content.ts`](src/data/content.ts). Lines marked `PLACEHOLDER` need real details: email, social links (these also feed the structured data), location, availability and projects.

Projects have a `placeholder` flag. While it's `true`, that case study page is `noindex` and left out of the sitemap, so sample work never shows up in search. Replace the project with real work, add `links`, then set it to `false`.

When you change page content, bump `site.updated`. It feeds `<lastmod>` in the sitemap and the "Updated" date on each page.

## Pages

| Route | Purpose | Structured data |
| --- | --- | --- |
| `/` | Portfolio home | WebSite, Person, WebPage |
| `/about` | Who Sufian is, key facts, skills | ProfilePage, Person, BreadcrumbList |
| `/services` | Six services with scope and stack | ItemList of Service |
| `/projects`, `/projects/[slug]` | Project index and case studies | CollectionPage, CreativeWork |
| `/faq` | Every question, fully visible | FAQPage |
| `/contact` | Email, profiles, what to include | ContactPage |

## Search and AI engines

- `/sitemap.xml` (also served at `/site.xml`), `/robots.txt` and `/manifest.webmanifest` are generated from `src/app/sitemap.ts`, `robots.ts` and `manifest.ts`.
- `robots.txt` allows all crawlers and names the AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others) explicitly.
- `/llms.txt` and `/llms-full.txt` give language models a plain-text summary and the full site text ([llmstxt.org](https://llmstxt.org)). Built in [`src/lib/llms.ts`](src/lib/llms.ts).
- Titles, canonicals, Open Graph and schema.org JSON-LD come from [`src/lib/seo.ts`](src/lib/seo.ts). Each page has a generated share image (`opengraph-image.tsx`, rendered by [`src/lib/og.tsx`](src/lib/og.tsx)).
- Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to add the Google Search Console meta tag. `NEXT_PUBLIC_SITE_URL` overrides the canonical domain.

## Design system

- **Type:** Doto (dot-matrix display, square dots via `ROND 0`) for names and numbers, IBM Plex Mono for everything else.
- **Color:** ink `#0a0a0b`, paper `#e7e7e9`, one signal orange `#ff4f12`. Tokens are in [`src/app/globals.css`](src/app/globals.css).
- **Logo:** a 6 × 7 dot-matrix S with its first dot in signal orange. [`LogoMark`](src/components/LogoMark.tsx) draws it in the UI; `python3 scripts/make-icons.py` writes the favicon, `icon.svg`, Apple touch icon and PWA icons from the same grid.
- **Motion:** custom curves shared by CSS and [`src/lib/motion.ts`](src/lib/motion.ts). Every effect has a reduced-motion path, and hover effects only run with a fine pointer.

## Pieces worth knowing

| Component | What it does |
| --- | --- |
| `HalftonePortrait` | Canvas that redraws the portrait as halftone dots inside a dithered ring; under the pointer it becomes a true-color mosaic of the photo. |
| `DotIcon` | Rasterizes Phosphor icon paths into a dot-matrix SVG. Add icons in `scripts/extract-icons.mjs`, then run `node scripts/extract-icons.mjs`. |
| `StackTrace` | Sends a pretend request through Client, API and Data so each layer lights up in turn. |
| `PageHeader`, `Panel`, `CtaBand`, `SiteFooter` | The inner-page layout: dark header with breadcrumb, light panel, closing prompt, footer. |

## Images and fonts

Originals are in `assets/source/`. `python3 scripts/process-images.py` rebuilds the cutout, web portrait, ink flower and the halftone used in share images (needs Pillow and numpy). `assets/fonts/` holds static TTFs for share images; `Doto-ExtraBold.ttf` is an instance of the variable font made with `fonttools varLib.instancer`.

The hollyhock is a photo by [Sebastian Schuster on Unsplash](https://unsplash.com/photos/n13s6zcvk6Y), inverted to ink. Icons are from [Phosphor](https://phosphoricons.com) (MIT). Doto and IBM Plex Mono are under the SIL Open Font License.
