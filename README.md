# Sufian Pranto, portfolio

Single-page portfolio for Sufian MD Pranto, MERN stack developer. Next.js 16 (App Router), Tailwind CSS 4, Motion (`framer-motion`).

```bash
npm install
npm run dev
```

## Editing content

All copy lives in [`src/data/content.ts`](src/data/content.ts). Lines marked `PLACEHOLDER` need real details: contact links, projects (add `links` to show Code / Live buttons), location and availability.

## Design system

- **Type:** Doto (dot-matrix display, square dots via `ROND 0`) for names and numbers, IBM Plex Mono for everything else.
- **Color:** ink `#0a0a0b`, paper `#e7e7e9`, one signal orange `#ff4f12`. Tokens are in [`src/app/globals.css`](src/app/globals.css).
- **Motion:** custom curves (`--ease-out`, `--ease-in-out`) shared by CSS and [`src/lib/motion.ts`](src/lib/motion.ts). Every effect has a reduced-motion path, and hover effects only run on devices with a fine pointer.

## Pieces worth knowing

| Component | What it does |
| --- | --- |
| `HalftonePortrait` | Canvas that redraws the portrait as square halftone dots inside a dithered ring. Under the pointer it turns into a true-color mosaic of the photo. |
| `DotIcon` | Rasterizes Phosphor icon paths into a dot-matrix SVG. Dots assemble on first view and ripple on hover. Add icons in `scripts/extract-icons.mjs`, then run `node scripts/extract-icons.mjs`. |
| `StackTrace` | Sends a pretend request through Client, API and Data so each layer lights up in turn. |
| `DitherField`, `HalftoneFade`, `DotWordmark` | Ordered-dither and halftone textures that match the dot-matrix type. |
| `vignettes/*` | Small animated UI sketches for each project card. |

## Images

Originals are in `assets/source/`. Regenerate the processed files with `python3 scripts/process-images.py` (needs Pillow and numpy).

The hollyhock is a photo by [Sebastian Schuster on Unsplash](https://unsplash.com/photos/n13s6zcvk6Y), inverted to ink. Icons are from [Phosphor](https://phosphoricons.com) (MIT).
