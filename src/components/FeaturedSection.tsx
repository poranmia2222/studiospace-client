import React, { Suspense } from "react";
import { AlertTriangle, SearchX } from "lucide-react";
import type { Studio } from "./StudioCard";
import FeaturedCarousel from "./FeaturedCarousel";

/* ------------------------------ Data ------------------------------ */

type LoadResult = { studios: Studio[]; error?: string };

/** Fetch + normalize the featured studios; never throws, never crashes. */
const loadFeatured = async (): Promise<LoadResult> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/featured-studios`,
      {
        cache: "no-store", // always fresh
      },
    );

    if (!res.ok) {
      return {
        studios: [],
        error: `The featured-studios service responded with an error (${res.status}).`,
      };
    }

    // The API may send a bare array, or wrapped (e.g. { data: [...] }) —
    // handle the common shapes so the UI doesn't depend on one exact JSON.
    const body: unknown = await res.json();
    const list: unknown = Array.isArray(body)
      ? body
      : (body as Record<string, unknown>)?.data ??
        (body as Record<string, unknown>)?.studios ??
        (body as Record<string, unknown>)?.results;

    const studios = (Array.isArray(list) ? list : []).filter(
      (studio): studio is Studio => {
        // Very light validation: a studio needs a title to be renderable.
        const s = studio as Studio;
        return Boolean(s && typeof s.title === "string");
      },
    );

    return { studios };
  } catch {
    // Network error, API not running, invalid JSON... render the error card.
    return {
      studios: [],
      error: "We couldn't reach the featured-studios service right now.",
    };
  }
};

/* --------------------------- Small pieces --------------------------- */

/** Friendly full-width message card for error / empty results. */
const StatusCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
}) => (
  <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-edge bg-surface px-8 py-14 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-primary">
      <Icon className="h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
    </span>
    <h2 className="mt-5 text-lg font-semibold">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
  </div>
);

/** Pulsing carousel-card placeholders shown while the request is in flight. */
const FeaturedSkeleton = () => (
  <ul aria-hidden="true" className="flex gap-4 overflow-hidden pb-1">
    {[0, 1, 2].map((n) => (
      <li
        key={n}
        className="h-[420px] w-[86%] shrink-0 animate-pulse rounded-2xl border border-edge bg-surface sm:w-[46%] lg:w-[31.5%]"
      />
    ))}
  </ul>
);

/* ------------------------------ Section ------------------------------ */

const FeaturedSectionContent = async () => {
  const { studios, error } = await loadFeatured();

  if (error) {
    return (
      <StatusCard
        icon={AlertTriangle}
        title="Something went wrong"
        description={`${error} Please try again in a few moments.`}
      />
    );
  }

  if (studios.length === 0) {
    return (
      <StatusCard
        icon={SearchX}
        title="No featured studios yet"
        description="The handpicked selection is being curated — check back soon!"
      />
    );
  }

  return (
    // Same section wrapper as the other homepage blocks (Categories,
    // HowItWorks, AboutUs): full-width band + shared max-w-6xl container
    // so every section's content lines up. The id is a scroll anchor;
    // scroll-mt-24 keeps the sticky navbar clear of the heading.
    <section id="featured" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
        {/* Section header — same eyebrow/heading style as Categories */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Handpicked For You
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Featured{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              Studios
            </span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            The most-loved spaces on StudioSpace, ready to book for
            your next session.
          </p>
        </div>

        {/* Carousel sits inside the shared container, so its slide
            widths match the 3-up rhythm of the category grid. */}
        <div className="mt-12">
          <FeaturedCarousel studios={studios} />
        </div>
      </div>
    </section>
  );
};

/**
 * Exported default: wraps the data fetch in a Suspense boundary so the
 * (uncached, no-store) request streams in while the skeleton shows —
 * same pattern as the studios grid. Without the boundary the homepage
 * can't be prerendered at all under Cache Components.
 */
export default function FeaturedSection() {
  return (
    <Suspense fallback={<FeaturedSkeleton />}>
      <FeaturedSectionContent />
    </Suspense>
  );
}
