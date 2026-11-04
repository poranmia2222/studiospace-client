import { Suspense } from "react";
import { AlertTriangle, SearchX } from "lucide-react";
import StudioCard, { type Studio } from "@/components/StudioCard";
import StudioFilters from "@/components/StudioFilters";

/* ------------------------------ Data ------------------------------ */

type LoadResult = { studios: Studio[]; error?: string };

/** Fetch + normalize the studios list; never throws, never crashes. */
const loadStudios = async (): Promise<LoadResult> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studios`, {
      cache: "no-store", // always fresh
    });

    if (!res.ok) {
      return {
        studios: [],
        error: `The studio service responded with an error (${res.status}).`,
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
      error: "We couldn't reach the studio service right now.",
    };
  }
};

/* --------------------------- Filtering ---------------------------- */

/** The price bounds for each pill option (from StudioFilters). */
const PRICE_BOUNDS: Record<string, { min: number; max: number }> = {
  "under-30": { min: 0, max: 30 },
  "30-60": { min: 30, max: 60 },
  "60-100": { min: 60, max: 100 },
  "over-100": { min: 100, max: Number.POSITIVE_INFINITY },
};

type Params = Record<string, string | string[] | undefined>;

/** searchParams values can be undefined or arrays — read them safely. */
const readParam = (params: Params, key: string): string => {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value) ?? "";
};

/**
 * Apply the three URL filters to the loaded list:
 * category match → price bounds → sort order.
 * (Copies the array first because .sort() mutates in place.)
 */
const applyFilters = (
  studios: Studio[],
  { category, priceRange, sort }: { category: string; priceRange: string; sort: string },
): Studio[] => {
  const bounds = PRICE_BOUNDS[priceRange];

  const filtered = studios.filter((studio) => {
    if (category && studio.category !== category) return false;
    if (bounds) {
      // "Under $30" / "$30 – $60" style ranges don't overlap: the min is
      // included, the max starts the NEXT range (e.g. $30 lands in $30–$60).
      if (
        studio.hourlyRate < bounds.min ||
        studio.hourlyRate >= bounds.max
      ) {
        return false;
      }
    }
    return true;
  });

  // "" and "recommended" share the same default: best rating first.
  const order = sort === "" || sort === "recommended" ? "rating" : sort;
  return filtered.sort((a, b) => {
    if (order === "price-asc") return a.hourlyRate - b.hourlyRate;
    if (order === "price-desc") return b.hourlyRate - a.hourlyRate;
    return b.rating - a.rating; // "rating" (recommended)
  });
};

/* --------------------------- Small pieces --------------------------- */

/** Gray pulsing placeholders shown while the API request is in flight. */
const StudiosSkeleton = () => (
  <ul aria-hidden="true" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {[0, 1, 2, 3, 4, 5].map((n) => (
      <li
        key={n}
        className="h-[420px] animate-pulse rounded-2xl border border-edge bg-surface"
      />
    ))}
  </ul>
);

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

/**
 * The whole dynamic section: loads fresh data, renders the filter pills,
 * applies the URL filters, then shows the matching cards (or a reason why
 * there's nothing to show).
 */
const StudiosSection = async ({
  category,
  priceRange,
  sort,
}: {
  category: string;
  priceRange: string;
  sort: string;
}) => {
  const { studios, error } = await loadStudios();

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
        title="No studios listed yet"
        description="Studio owners are setting up their spaces — check back soon, or list your own studio first!"
      />
    );
  }

  // Dropdown options straight from the live data, alphabetical — the
  // filter bar can never drift out of sync with what the API returns.
  const categories = [...new Set(studios.map((studio) => studio.category))].sort();
  const filtered = applyFilters(studios, { category, priceRange, sort });

  if (filtered.length === 0) {
    return (
      <>
        <StudioFilters
          categories={categories}
          category={category}
          priceRange={priceRange}
          sort={sort}
        />
        <p className="mt-3 text-sm text-muted">Showing 0 of {studios.length} studios</p>
        <div className="mt-5">
          <StatusCard
            icon={SearchX}
            title="No studios match your filters"
            description="Try a different category, widen the price range, or clear a filter to see everything."
          />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Filter pills (Category / Price range / Sort by) */}
      <StudioFilters
        categories={categories}
        category={category}
        priceRange={priceRange}
        sort={sort}
      />

      {/* Result count helps visitors understand what the pills did */}
      <p className="mt-3 text-sm text-muted" aria-live="polite">
        Showing {filtered.length} of {studios.length} studios
      </p>

      {/* Card grid — 1 column (mobile) → 2 (tablet) → 3 (desktop) */}
      <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((studio, index) => (
          <li key={studio._id ?? `${studio.title}-${index}`} className="h-full">
            <StudioCard studio={studio} />
          </li>
        ))}
      </ul>
    </>
  );
};

/* ------------------------------ Page ------------------------------ */

const StudiosPage = ({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
      {/* Section header (same pattern as the homepage sections) */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          All Studios
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Find the{" "}
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
            Perfect Studio
          </span>{" "}
          for Your Next Project.
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Browse photography, film, podcast, music, and content studios
          available to rent by the hour.
        </p>
      </div>

      {/* Read the current filters from the URL (?category=...&priceRange=...&sort=...)
          and pass them down. The uncached API call streams inside Suspense:
          the header above renders instantly, this section (including the
          skeleton) fills in while the request is in flight. */}
      <Suspense fallback={<StudiosSkeleton />}>
        <StudiosSectionLoader searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

/** Small async wrapper so searchParams is awaited *inside* Suspense. */
const StudiosSectionLoader = async ({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) => {
  const params = await searchParams;
  return (
    <StudiosSection
      category={readParam(params, "category")}
      priceRange={readParam(params, "priceRange")}
      sort={readParam(params, "sort")}
    />
  );
};

export default StudiosPage;
