/**
 * ABOUT US — the "About Us" section on the homepage (scroll target:
 * "/#about-us", rendered by src/app/page.tsx).
 *
 * Concepts a recruiter might ask about:
 * • Server Component: no "use client" here because there is no state, no
 *   event handlers and no browser-only hooks — it runs only on the server
 *   and ships zero JavaScript to the browser.
 * • Content-driven rendering: the mission and feature cards come from
 *   plain arrays below, rendered with .map() — editing copy means editing
 *   one array, not JSX in multiple places.
 * • next/image: <Image> optimizes photos automatically. `fill` + a
 *   fixed-aspect parent box (`aspect-[4/3]`) crops the photo cleanly at
 *   any screen size (`object-cover`), and `sizes` tells the browser how
 *   big the image will be so it downloads a right-sized version.
 * • Responsive layout with Tailwind prefixes: `lg:grid-cols-2` means "two
 *   columns only from the lg breakpoint (1024px) up"; below that each
 *   block stacks into one readable column.
 * • One <section> with three inner blocks (Story / Mission / Features),
 *   separated by borders and alternating card-tinted backgrounds — the
 *   same rhythm the rest of the homepage uses.
 */

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { CalendarCheck, Eye, ImagePlus, Info, Search, Target } from "lucide-react";

/* ------------------------------ Content ------------------------------ */

type Card = {
  icon: LucideIcon;
  title: string;
  description: string;
};

// MISSION & VISION — two simple content cards (same shape, one array).
const VALUES: readonly Card[] = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "Make creative spaces easier to find and help studio owners reach more creators.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "Build a platform where creators and studio owners can connect and grow together.",
  },
] as const;

// WHY CHOOSE — four feature cards.
const FEATURES: readonly Card[] = [
  {
    icon: Search,
    title: "Easy Studio Discovery",
    description: "Find studios for different creative needs.",
  },
  {
    icon: CalendarCheck,
    title: "Simple Booking",
    description: "Request studio reservations easily.",
  },
  {
    icon: Info,
    title: "Detailed Information",
    description: "Explore studio photos, prices, locations, and amenities.",
  },
  {
    icon: ImagePlus,
    title: "Become a Host",
    description: "List your studio and connect with creators.",
  },
];

// The "eyebrow" label above each block heading — one class string reused
// so every block looks identical (same style as the HowItWorks section).
const EYEBROW_CLASSES =
  "text-xs font-semibold uppercase tracking-[0.2em] text-primary";

// Card shell shared by both card grids.
const CARD_CLASSES =
  "flex h-full flex-col rounded-2xl border border-edge bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-600/10";

/* ------------------------------ Component ------------------------------ */

const AboutUs = () => {
  return (
    // The id is the navbar scroll anchor ("/#about-us"); scroll-mt-24 stops
    // the sticky navbar from covering the heading after scrolling.
    <section id="about-us" className="scroll-mt-24 border-t border-edge">
      {/* Block 1 — OUR STORY: text left, photo right on desktop
                 (stacks vertically on mobile). */}
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className={EYEBROW_CLASSES}>Our Story</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              What is StudioSpace?
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              StudioSpace is a peer-to-peer marketplace for creative spaces.
              Great studios — for photography, filmmaking, podcasting, music
              and other creative work — are often hard to find, while studio
              owners struggle to reach the creators who need them.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
              StudioSpace brings both sides together: creators browse real
              listings with photos, rates, locations and amenities, then
              request a booking in a few clicks — and owners list their space
              once and connect with creators who are already looking for
              exactly what they offer.
            </p>
          </div>

          {/* Fixed-aspect box + fill image: the photo is cropped to fit
              whatever size the box takes on each screen (object-cover). */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-edge bg-surface shadow-2xl shadow-black/40">
            <Image
              src="/banner_images/banner3.jpg"
              alt="A creative workshop space with colorful painted walls and canvases on easels"
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Block 2 — MISSION & VISION: two cards side by side from sm up.
          bg-surface/50 alternates the tint, like HowItWorks above. */}
      <div className="border-t border-edge bg-surface/50">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map((value) => (
              <article key={value.title} className={CARD_CLASSES}>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-primary">
                  <value.icon className="h-7 w-7" strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 text-xl font-semibold">{value.title}</h3>
                <p className="mt-3 leading-7 text-muted">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Block 3 — WHY CHOOSE: four cards, grid goes
          1 column (mobile) → 2 (sm) → 4 (lg). */}
      <div className="border-t border-edge">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className={EYEBROW_CLASSES}>Why StudioSpace</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                StudioSpace?
              </span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <article key={feature.title} className={CARD_CLASSES}>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-primary">
                  <feature.icon className="h-7 w-7" strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
