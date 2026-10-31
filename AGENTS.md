<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository notes

## Stack

- Next.js **16** App Router + React 19 + TypeScript, code in `src/` (routes under `src/app`). UI-phase project: static marketing pages + the start of the marketplace UI. No tests, no CI.
- Path alias: `@/*` → `src/*`; `cn()` utility in `@/lib/utils`.

## Tailwind v4

- No `tailwind.config.js`. Theme lives CSS-first in `src/app/globals.css` via `@import "tailwindcss"` and `@theme inline` (tokens like `--color-background`, `--font-sans`); add custom colors/fonts there, not in a JS config.
- Loaded through the `@tailwindcss/turbopack` loader rule in `next.config.ts` — don't add v3 PostCSS setup.

## shadcn on Base UI (not Radix)

- `components.json` uses the `base-nova` style: shadcn CLI components wrap **Base UI** (`@base-ui/react/*`) primitives, not Radix. Don't import from `radix-ui`; installed components live in `@/components/ui`.
- Styling hooks off Base UI's data attributes (e.g. `data-[active]:`), not Radix's, when styling states.

## Cache Components is enabled (next.config.ts)

`cacheComponents: true` + `partialPrefetching: true` — this changes how data and rendering work vs. the classic App Router model:

- Async components and uncached data must be wrapped in a `<Suspense>` boundary, or the build fails the prerender check.
- Caching is done with the `use cache` directive (pair with `cacheLife`); `cacheComponents`-era APIs differ from `unstable_cache`/`revalidate` patterns in older code. `GET` route handlers follow the same prerendering model.
- Reference guide: `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`.

## Commands

- `npm run dev` — Turbopack dev server (default in Next 16) on localhost:3000.
- `npm run lint` — runs `eslint` (flat config in `eslint.config.mjs`, run from repo root).
- No typecheck script; use `npx tsc --noEmit`. No test framework installed.
- Build: `npm run build`. Generated route types live in `.next/dev/types/` (imported by `next-env.d.ts`); a dev server or build must have run for typed route helpers (`PageProps`, `LayoutProps` — used in `src/app/layout.tsx`) to resolve.
- Next 16 typed routes are on: `href` values in `<Link>` are type-checked against real routes, so a wrong path fails the build, not just the browser.

## Backend API

- `.env` sets `NEXT_PUBLIC_API_URL=http://localhost:8000` — the separate backend this client fetches from (e.g. `GET /studios` in `src/app/studios/page.tsx` with `cache: "no-store"`).
- Fetches are failure-tolerant by design: unreachable API surfaces an inline error card, not a crashed page. No API needed to run `npm run dev`, but `/studios` shows no data without it.
- `next.config.ts` allows any HTTPS host in `remotePatterns` because studio photos come from backend-provided URLs hosted anywhere.
