@AGENTS.md

# kochfit-redesign

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4. Redesign of kochfit.ru driven from a Figma file, replacing an old Tilda site.

## Running

- `npm run dev` — dev server on **port 3400** (`http://localhost:3400`), not 3000.
- `npm run build` — normal build. `npm run build:server` — static export under `/kochfit` base path (shared-host preview), via `KOCHFIT_BASE_PATH`/`NEXT_PUBLIC_BASE_PATH`.
- `npm run lint` — eslint. `npx tsc --noEmit` for type-check.
- `npm run test:e2e` / `npm run test:e2e:ui` — Playwright (`e2e/`).

## Design system

- Figma file `E33rLVjz9QeBWkBf1AHDvj` ("Редизайн август сентябрь 2025"), canvas `441:7898`. Current palette is the **"голубой цвет" (blue)** section — never use the old green/olive palette.
- Design tokens live in `src/app/globals.css`: `--color-ink`, `--color-ink-secondary`, `--color-ink-muted`, `--color-accent`, `--color-surface`, `--color-surface-blue`, plus `--gradient-primary`/`--gradient-soft`.
- Fonts in `src/lib/fonts.ts`: `font-display` = Evolventa (headings/buttons), base = Nunito Sans.
- Desktop layout baseline is 1200px: outer container `max-w-[1400px]`, content `max-w-[1160px]`. Avoid absolute-positioned elements that overflow at 1200px — check `scrollWidth`.
- `"use client"` only for components with actual state (popups, switches) — default to server components.
- External links go through `src/content/links.ts` (kochfit.ru domain) only; internal links use `next/link`, external use `<a>`.

## Figma → code workflow (per section/page)

1. Figma MCP `get_metadata` on the frame node id.
2. `get_design_context` per major section (a whole page won't fit one response / assets get dropped).
3. Save the response to a temp file, download assets: `node scripts/fetch-figma-assets.mjs <response.txt> public/images/<dir>`.
4. Build a server component in `src/components/<page>/`, page route in `src/app/<route>/page.tsx`.
5. Visually check at `http://localhost:3400` against the Figma frame screenshot.
6. Tag each section with `data-figma-node="<id>"` and a JSDoc comment with the node id. Images: `const img = (name: string) => "/images/<dir>/" + name;`.

Full pattern: `.cursor/rules/figma-to-code.mdc`.

## Migrating pages from the old site

- Old Tilda export lives in `old-site/` (gitignored, reference only — never edit).
- URL → old file mapping: `docs/old-site-url-map.md`. Migration/status notes: `docs/HANDOFF.md`.
- When porting a page: keep content/structure from the old page, but colors/typography/components always come from the new blue Figma system (green → blue, always).

## Structure

- `src/app/` — routes (App Router). `src/components/` — grouped by domain (`basket`, `beauty`, `equipment`, `home`, `pelvic`, `postpartum`, `pregnancy`, `site`, `ui`, …). `src/content/` — data/config (nav, routes, equipment, blog, courses, payments, migrated redirects). `src/lib/`, `src/types/`.
- `docs/` — handoff notes, URL/equipment audits, screenshots. `e2e/` — Playwright specs + screenshots.
- Root `tmp-*.png` / `tmp-assets/` — scratch before/after screenshots from layout comparisons, not part of the app.
