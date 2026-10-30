/**
 * HOW IT WORKS — two curated journeys (For Creators / For Studio Owners)
 * rendered as four connected step cards, plus a CTA banner.
 *
 * Concepts:
 * • Tabs: one `active` piece of state switches the whole panel. Switching
 *   tabs = changing state = React re-renders with the other journey.
 * • Accessible tabs (WAI-ARIA pattern): role="tablist"/"tab"/"tabpanel",
 *   aria-selected, roving tabIndex (only the active tab is tabbable) and
 *   full keyboard support (Arrow keys / Home / End) in handleTabKeyDown.
 * • Layout is one <ol> that transforms by breakpoint:
 *   - mobile (<sm): vertical timeline (numbered dots on a dashed line)
 *   - tablet (sm–lg): 2-column card grid
 *   - desktop (lg+): 4-column card row with arrow connectors between cards
 * • No entrance motion per design decision — the only animated section in
 *   the site is the hero slider; cards use hover effects only.
 */

"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  ImagePlus,
  Megaphone,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------ Content ------------------------------ */

type TabKey = "creators" | "owners";

type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type Journey = {
  label: string;
  cta: { label: string; href: string };
  steps: readonly Step[];
};

const JOURNEYS: Record<TabKey, Journey> = {
  creators: {
    label: "For Creators",
    cta: { label: "Explore Studios", href: "/studios" },
    steps: [
      {
        icon: Search,
        title: "Discover Your Space",
        description:
          "Explore photography studios, film stages, podcast rooms, music studios, art workshops, dance studios, and content studios.",
      },
      {
        icon: SlidersHorizontal,
        title: "Find Your Perfect Match",
        description:
          "Compare studio photos, amenities, locations, hourly rates, and facilities.",
      },
      {
        icon: CalendarCheck,
        title: "Request Your Booking",
        description:
          "Select your preferred date and time, review booking details, and submit a reservation request.",
      },
      {
        icon: Sparkles,
        title: "Create Something Amazing",
        description:
          "Once your booking is confirmed, visit the studio and bring your creative ideas to life.",
      },
    ],
  },
  owners: {
    label: "For Studio Owners",
    cta: { label: "List Your Studio", href: "/add-studio" },
    steps: [
      {
        icon: ImagePlus,
        title: "Create Your Listing",
        description:
          "Add studio photos, location, hourly rate, amenities, and studio details.",
      },
      {
        icon: Megaphone,
        title: "Get Discovered",
        description:
          "Showcase your creative space to photographers, filmmakers, musicians, and other creators.",
      },
      {
        icon: ClipboardList,
        title: "Manage Booking Requests",
        description:
          "Review incoming requests and confirm or manage reservations.",
      },
      {
        icon: TrendingUp,
        title: "Grow Your Studio Business",
        description:
          "Connect with creators, increase visibility, and earn from your available studio space.",
      },
    ],
  },
} as const;

const TAB_ORDER: readonly TabKey[] = ["creators", "owners"];

/* ------------------------------ Component ------------------------------ */

const HowItWorks = () => {
  // Which journey tab is open. Default: "creators" (For Creators).
  const [active, setActive] = useState<TabKey>("creators");
  // Refs let us move keyboard focus to a tab programmatically after an
  // Arrow-key switch — part of the accessible tabs pattern.
  const tabRefs = useRef<Partial<Record<TabKey, HTMLButtonElement | null>>>({});

  const journey = JOURNEYS[active];

  // Keyboard navigation for the tab list: arrow keys cycle between tabs,
  // Home/End jump to first/last. preventDefault() stops the page scrolling
  // while using the arrows inside the control.
  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    key: TabKey,
  ) => {
    const index = TAB_ORDER.indexOf(key);
    let next: TabKey | undefined;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = TAB_ORDER[(index + 1) % TAB_ORDER.length];
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = TAB_ORDER[(index - 1 + TAB_ORDER.length) % TAB_ORDER.length];
    } else if (event.key === "Home") {
      next = TAB_ORDER[0];
    } else if (event.key === "End") {
      next = TAB_ORDER[TAB_ORDER.length - 1];
    } else {
      return;
    }

    event.preventDefault();
    if (next) {
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-t border-edge bg-surface/50"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            How It Works
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your Creative{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              Journey
            </span>{" "}
            Starts Here.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            Whether you&apos;re looking for the perfect creative space or
            sharing your own studio, StudioSpace makes everything simple.
          </p>
        </div>

        {/* Journey tabs */}
        <div
          role="tablist"
          aria-label="Choose your journey"
          className="mx-auto mt-8 flex w-fit rounded-full border border-edge bg-surface p-1 shadow-sm"
        >
          {TAB_ORDER.map((key) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                ref={(node) => {
                  tabRefs.current[key] = node;
                }}
                type="button"
                role="tab"
                id={`how-it-works-tab-${key}`}
                aria-selected={isActive}
                aria-controls={`how-it-works-panel-${key}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(key)}
                onKeyDown={(event) => handleTabKeyDown(event, key)}
                className={cn(
                  "h-10 rounded-full px-5 text-sm font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 sm:px-6",
                  isActive
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-600/25"
                    : "text-muted hover:text-foreground",
                )}
              >
                {JOURNEYS[key].label}
              </button>
            );
          })}
        </div>

        {/* Steps panel */}
        <div
          key={active}
          id={`how-it-works-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`how-it-works-tab-${active}`}
        >
          <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {/* Mobile vertical connector */}
            <span
              aria-hidden="true"
              className="absolute bottom-10 left-6 top-10 w-px border-l border-dashed border-violet-500/30 sm:hidden"
            />

            {journey.steps.map((step, index) => (
              <li
                key={step.title}
                className="relative pl-[72px] sm:pl-0"
              >
                {/* Mobile timeline dot */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-edge bg-surface text-sm font-semibold text-primary sm:hidden"
                >
                  {index + 1}
                </span>

                {/* Desktop connector arrow */}
                {index < journey.steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-[28px] top-[104px] z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-edge bg-surface text-primary lg:flex"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}

                {/* Step card */}
                <article className="group flex h-full flex-col rounded-2xl border border-edge bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-600/10">
                  <div className="flex items-center gap-3">
                    <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 sm:flex">
                      {index + 1}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                      Step {index + 1}
                    </span>
                  </div>

                  <span className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    <step.icon className="h-7 w-7" strokeWidth={1.8} />
                  </span>

                  <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {step.description}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA banner */}
        <div className="relative mt-16 overflow-hidden rounded-3xl border border-edge bg-surface px-6 py-14 text-center sm:px-12 sm:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl" />
            <div className="absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />
          </div>

          <div className="relative">
            <h3 className="mx-auto max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Your Next Big Idea Needs the{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                Right Space
              </span>
              .
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Discover inspiring creative spaces or share your own studio with
              a community of creators.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/studios"
                className="group flex h-12 items-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 px-8 text-base font-medium text-white shadow-xl shadow-violet-600/30 transition-all hover:shadow-violet-500/40 hover:brightness-110 active:scale-[.98]"
              >
                Explore Studios
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/add-studio"
                className="flex h-12 items-center rounded-full border border-edge bg-white/[.02] px-8 text-base font-medium text-foreground transition-colors hover:border-muted hover:bg-white/[.05]"
              >
                List Your Studio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
