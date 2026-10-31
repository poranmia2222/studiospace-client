/**
 * HOW IT WORKS — two sections:
 *   1. "Your Creative Journey Starts Here." — a rounded two-tab selector
 *      (For Creators / For Studio Owners) that switches a panel of four
 *      connected step cards, plus a CTA banner.
 *   2. "Create With Confidence." — four trust & support feature cards.
 *
 * Concepts:
 * • Tabs come from our shadcn/ui-style component (src/components/ui/tabs.tsx).
 *   It is a controlled component: the `active` state decides which tab is
 *   open, and tapping a tab calls onValueChange → React re-renders the other
 *   journey. Tab styling (ARIA roles, keyboard arrows, focus) is handled
 *   inside the ui/tabs wrapper — none of that lives here anymore.
 * • Steps layout is one <ol> that transforms by breakpoint:
 *   - mobile (<sm): vertical timeline (numbered dots on a dashed line)
 *   - tablet (sm–lg): 2-column card grid
 *   - desktop (lg+): 4-column card row with arrow connectors between cards
 * • Reduced motion: every hover animation pairs with motion-reduce:*
 *   utilities that turn it off for users with "reduce motion" enabled
 *   (globals.css also switches smooth scrolling off for them).
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ClipboardList,
  Headset,
  ImagePlus,
  Megaphone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ------------------------------ Content ------------------------------ */

/* Each journey is one "tab". Adding a new tab = copy one object here. */

type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type Journey = {
  /** Value shared by the <TabsTrigger> and its <TabsContent>. */
  value: string;
  label: string;
  /** Sub-heading shown under the section title for this tab. */
  description: string;
  steps: readonly Step[];
};

const JOURNEYS: readonly Journey[] = [
  {
    value: "creators",
    label: "For Creators",
    description: "Book the perfect creative space in four simple steps.",
    steps: [
      {
        icon: Search,
        title: "Discover Spaces",
        description:
          "Explore photography studios, film stages, podcast rooms, music studios, and other creative spaces.",
      },
      {
        icon: SlidersHorizontal,
        title: "Select Shoot Hours",
        description:
          "Compare studio details, check availability, and choose your preferred date and hours.",
      },
      {
        icon: CalendarCheck,
        title: "Book Instantly",
        description:
          "Review your booking details and submit your reservation request.",
      },
      {
        icon: Sparkles,
        title: "Create & Produce",
        description:
          "Visit your confirmed studio and bring your creative ideas to life.",
      },
    ],
  },
  {
    value: "owners",
    label: "For Studio Owners",
    description:
      "Share your creative space with thousands of creators in four simple steps.",
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
        title: "Manage Bookings",
        description:
          "Review incoming booking requests and confirm or manage reservations.",
      },
      {
        icon: TrendingUp,
        title: "Grow Your Business",
        description:
          "Connect with creators, increase visibility, and earn from your available studio space.",
      },
    ],
  },
] as const;

/* Trust & support feature cards (Section 2). */

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURES: readonly Feature[] = [
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    description:
      "Clear booking information and platform guidelines help users understand their responsibilities.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Profiles",
    description:
      "Profile information helps creators and studio owners know who they are connecting with.",
  },
  {
    icon: Wrench,
    title: "Equipment Safety",
    description:
      "Studio details and equipment information help creators prepare before their visit.",
  },
  {
    icon: Headset,
    title: "Host Support",
    description:
      "Helpful support for booking-related questions and issues.",
  },
] as const;

/* --------------------------- Small parts ---------------------------- */

/* Shared hover treatment so every card in this file feels identical.
   motion-reduce:* disables the motion for users who prefer reduced motion. */
const CARD_HOVER =
  "transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-600/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/* The repeated "large purple icon in a rounded container" part.
   mt-6 keeps it clear of the number badge / title above it; the
   group-hover:scale-110 needs the card to have className="group". */
const IconTile = ({ icon: Icon }: { icon: LucideIcon }) => (
  <span className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-primary transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
    <Icon className="h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
  </span>
);

/* The centered heading block both sections start with:
   lead + highlight(word in gradient) + trail e.g.
   "Your Creative" + "Journey" + " Starts Here." */
const SectionHeader = ({
  eyebrow,
  lead,
  highlight,
  trail,
  description,
}: {
  eyebrow: string;
  lead: string;
  highlight: string;
  trail: string;
  description: string;
}) => (
  <div className="mx-auto max-w-2xl text-center">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      {eyebrow}
    </p>
    <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
      {lead}{" "}
      <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
        {highlight}
      </span>
      {trail}
    </h2>
    <p className="mt-4 text-lg leading-8 text-muted">{description}</p>
  </div>
);

/* One step card: number badge + STEP label, purple icon, title, text. */
const StepCard = ({ step, index }: { step: Step; index: number }) => (
  <article
    className={cn(
      "group flex h-full flex-col rounded-2xl border border-edge bg-surface p-7",
      CARD_HOVER,
    )}
  >
    {/* The number circle is hidden on mobile because the timeline dot
        already shows the number — no need to repeat it in the card. */}
    <div className="flex items-center gap-3">
      <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 sm:flex">
        {index + 1}
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
        Step {index + 1}
      </span>
    </div>

    <IconTile icon={step.icon} />

    <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
    <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
  </article>
);

/* The four connected step cards used by BOTH tab panels.
   <ol> = ordered list, because steps have a real-world order. */
const StepsGrid = ({ steps }: { steps: readonly Step[] }) => (
  <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
    {/* Mobile vertical connector (behind the timeline dots) */}
    <span
      aria-hidden="true"
      className="absolute bottom-10 left-6 top-12 w-px border-l border-dashed border-violet-500/30 sm:hidden"
    />

    {steps.map((step, index) => (
      <li key={step.title} className="relative pl-[72px] sm:pl-0">
        {/* Mobile timeline dot (instead of an in-card number).
            Its center lines up with the small "STEP n" label: the card
            padding (28px) + about half the label line ≈ 36px center,
            so top-3 (12px) + half of the 48px dot = 36px. */}
        <span
          aria-hidden="true"
          className="absolute left-0 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-edge bg-surface text-sm font-semibold text-primary sm:hidden"
        >
          {index + 1}
        </span>

        {/* Desktop connector arrow between cards (skipped on the last one) */}
        {index < steps.length - 1 && (
          <span
            aria-hidden="true"
            className="absolute -right-[28px] top-[104px] z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-edge bg-surface text-primary lg:flex"
          >
            <ArrowRight className="h-4 w-4" />
          </span>
        )}

        <StepCard step={step} index={index} />
      </li>
    ))}
  </ol>
);

/* One feature card for Section 2 (same look as steps, without numbers). */
const FeatureCard = ({ feature }: { feature: Feature }) => (
  <article
    className={cn(
      "group flex h-full flex-col rounded-2xl border border-edge bg-surface p-7",
      CARD_HOVER,
    )}
  >
    <IconTile icon={feature.icon} />

    <h3 className="mt-6 text-lg font-semibold">{feature.title}</h3>
    <p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p>
  </article>
);

/* ------------------------------ Component ------------------------------ */

const HowItWorks = () => {
  // Which journey tab is open. Default: "creators" (For Creators).
  // Controlled state: <Tabs value={active} onValueChange=...> in the JSX.
  const [active, setActive] = useState<string>(JOURNEYS[0].value);
  const journey = JOURNEYS.find((item) => item.value === active)!;

  return (
    <>
      {/* =============================================================
          SECTION 1 — HOW IT WORKS (booking journey)
          ============================================================= */}
      <section
        id="how-it-works"
        className="scroll-mt-24 border-t border-edge bg-surface/50"
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
          <SectionHeader
            eyebrow="How StudioSpace Works"
            lead="Your Creative"
            highlight="Journey"
            trail=" Starts Here."
            description={journey.description}
          />

          {/* Journey tabs (styled by ui/tabs; accessibility handled there) */}
          <Tabs value={active} onValueChange={(value) => setActive(value)} className="mt-8">
            <TabsList className="mx-auto">
              {JOURNEYS.map((item) => (
                <TabsTrigger key={item.value} value={item.value}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {JOURNEYS.map((item) => (
              <TabsContent key={item.value} value={item.value}>
                <StepsGrid steps={item.steps} />
              </TabsContent>
            ))}
          </Tabs>

          {/* CTA banner (same for both tabs, so it lives outside them) */}
          <div className="relative mt-16 overflow-hidden rounded-3xl border border-edge bg-surface px-6 py-14 text-center sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
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
                  className="group flex h-12 items-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 px-8 text-base font-medium text-white shadow-xl shadow-violet-600/30 transition-all hover:shadow-violet-500/40 hover:brightness-110 active:scale-[.98] motion-reduce:transition-none"
                >
                  Explore Studios
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </Link>
                <Link
                  href="/add-studio"
                  className="flex h-12 items-center rounded-full border border-edge bg-white/[.02] px-8 text-base font-medium text-foreground transition-colors hover:border-muted hover:bg-white/[.05] motion-reduce:transition-none"
                >
                  List Your Studio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================================
          SECTION 2 — TRUST & SUPPORT (host guarantee & creator support)
          ============================================================= */}
      <section id="trust-support" className="scroll-mt-24 border-t border-edge">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
          <SectionHeader
            eyebrow="Trust & Support"
            lead="Create With"
            highlight="Confidence"
            trail="."
            description="We want every creator and studio owner to have a safe and reliable experience on StudioSpace."
          />

          {/* Feature cards */}
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="h-full">
                <FeatureCard feature={feature} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
