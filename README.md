# StudioSpace

**Peer-to-peer creative workspace & production studio sharing platform.**
Creatives (photographers, filmmakers, musicians, podcasters…) rent professional
studios by the hour. Studio owners list their spaces and earn when the studio
would otherwise sit empty — booked directly, no middlemen.

> Status: **frontend / UI phase.** Static marketing pages + the beginnings of
> the marketplace UI. Auth, booking and data come next.

## Tech stack

| Layer      | Tool                              | Why |
| ---------- | --------------------------------- | --- |
| Framework  | **Next.js 16** (App Router)       | File-based routing, server + client components, static prerendering |
| UI         | **React 19 + TypeScript**         | Component model with type safety |
| Styling    | **Tailwind CSS v4**               | Utility classes + CSS-first design tokens (no tailwind.config.js) |
| Icons      | **lucide-react**                  | Consistent open-source icon set |
| Components | **shadcn/base-ui (initialized)**  | Prebuilt accessible primitives; custom brand styling on top |

## Run it locally

```bash
npm install    # once
npm run dev    # dev server → http://localhost:3000
```

Other commands: `npm run build` (production build + typecheck),
`npm run lint` (ESLint), `npx tsc --noEmit` (typecheck only).
The site currently ships as fully static pages (see prerender output in the build log).

## Project map — one file, one job

```
src/
  app/
    layout.tsx            # HTML shell: fonts, metadata, <Navbar> (wraps every page)
    globals.css           # design tokens (colors/fonts) + shared animations
    page.tsx              # home route: composes <Banner> + <HowItWorks> + About
    studios/page.tsx      # /studios — "Explore Studios" listing grid (sample data)
    signin|signup/...     # placeholder pages (real auth is a later milestone)
    add-studio/page.tsx   # /add-studio — target of the "List Your Studio" CTA
  components/
    Navbar.tsx            # sticky header, responsive links, active-route highlight
    Banner.tsx            # homepage hero: copy, CTAs, glows, static stat chips
    hero-slider.tsx       # auto-playing image carousel (banner_images/)
    HowItWorks.tsx        # renter/host tabs → 4 step cards + CTA banner
public/
  banner_images/          # hero slide photos (banner1–3.jpg)
```

## Core concepts used (glossary for interviews)

Each file's top has a comment block explaining the concepts below in context.

- **Server vs. Client Components** — pages and static sections run on the
  server and ship no JS; components needing interactivity (`useState`,
  hooks, event handlers) are marked `"use client"` (Navbar, HeroSlider,
  HowItWorks). Mixing them keeps the JS bundle small.
- **File-based routing** — a folder in `src/app` + `page.tsx` file *is* a
  route. `layout.tsx` wraps all of them automatically.
- **State & effects** — slider position = `useState`; auto-play timers live
  in `useEffect` with proper **cleanup** functions; refs (`useRef`) focus
  tabs programmatically for keyboard accessibility.
- **Client-side navigation** — `<Link>` swaps pages without reloading; with
  Next 16's **typed routes**, `href="/studios"` is type-checked against real
  routes, so dead links fail the build.
- **Design tokens** — colors/fonts are CSS variables in `globals.css`
  (`--primary`, `--surface`…) mapped by Tailwind v4's `@theme` into utility
  classes (`bg-primary`, `text-muted`), so restyling is a one-file change.
- **Responsive design** — mobile-first Tailwind breakpoints
  (`sm:` `md:` `lg:`): e.g. the How-It-Works grid is a vertical timeline,
  then 2 columns, then 4 columns with arrow connectors.
- **Accessibility** — tabs follow the WAI-ARIA pattern
  (`role="tablist"`, `aria-selected`, arrow-key navigation), icon-only
  buttons carry `aria-label`s, decorative layers are `aria-hidden`, and
  smooth-scrolling is disabled under `prefers-reduced-motion`. (Per design
  decision, the only continuously animated element is the hero slider.)
- **Image optimization** — `next/image` handles sizing, lazy-loading and
  format conversion; only the first hero slide gets `priority`.

## Demo script (5-minute walkthrough)

1. **Open `/`** — point out the sticky navbar (active-link highlight comes
   from `usePathname`), then the hero: static eyebrow badge, gradient
   headline, floating-looking stat chips, and the image slider (the only
   animated element on the site) that auto-advances, pauses on hover, and
   has dots + arrows.
2. **Scroll to How It Works** — show the two journey tabs ("For Creators" /
   "For Studio Owners"); click a step card, then switch tabs and let the
   staggered entrance animation replay. Mention keyboard: press Tab into the
   tabs and use arrow keys.
3. **Resize or open devtools mobile view** — navbar links collapse, steps
   switch from a 4-connected-card row to a vertical timeline.
4. **Explore Studios** (`/studios`) — sample listing cards with rates +
   amenity tags.
5. **Close with the details** — Lighthouse-style habits baked in: design
   tokens for consistent branding, reduced-motion support, semantic
   elements (`header/nav/main/ol/section`), `npm run build` passing with
   zero type errors.

## What's next (roadmap)

- Real auth (sign up / sign in → accounts for creators & owners)
- Data layer: studio listings DB, search/filter endpoints, booking flow
- Listing detail pages; photo uploads; pricing & availability calendars
