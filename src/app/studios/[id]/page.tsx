import { Suspense } from "react";
import StudioDetails from "@/components/StudioDetails";
import type { Studio } from "@/components/StudioCard";

/* ------------------------------ Data ------------------------------ */

type LoadResult = { studio: Studio | null; error?: string };

/** Fetch + normalize one studio; never throws, never crashes. */
const loadStudio = async (id: string): Promise<LoadResult> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/studios/${encodeURIComponent(id)}`,
      { cache: "no-store" }, // always fresh
    );

    if (!res.ok) {
      return {
        studio: null,
        error: `The studio service responded with an error (${res.status}).`,
      };
    }

    // The API may send the studio bare, or wrapped ({ data: ... } /
    // { studio: ... }) — the same tolerant unwrapping as the /studios list.
    const body: unknown = await res.json();
    const shape = (body ?? {}) as Record<string, unknown>;
    const studio = (shape.data ?? shape.studio ?? shape) as Studio | null;

    // Light validation: a studio needs a title to be renderable.
    if (!studio || typeof studio.title !== "string") {
      return { studio: null, error: "The studio service sent unexpected data." };
    }

    return { studio };
  } catch {
    // Network error, API not running, invalid JSON...
    return {
      studio: null,
      error: "We couldn't reach the studio service right now.",
    };
  }
};

/* --------------------------- Small pieces --------------------------- */

/** Gray pulsing placeholders shown while the API request is in flight. */
const DetailsSkeleton = () => (
  <div aria-hidden="true" className="animate-pulse">
    <div className="flex items-center justify-between gap-4">
      <div className="w-full">
        <div className="h-6 w-40 rounded-full bg-muted/40" />
        <div className="mt-3 h-9 w-2/3 rounded-lg bg-muted/40" />
      </div>
      <div className="h-9 w-32 shrink-0 rounded-lg bg-muted/40" />
    </div>
    <div className="mt-6 aspect-[2.4/1] max-h-[440px] min-h-56 rounded-2xl border border-edge bg-surface" />
    <div className="mt-2 flex gap-2.5">
      <div className="h-14 w-22 rounded-lg bg-muted/40" />
      <div className="h-14 w-22 rounded-lg bg-muted/40" />
    </div>
    <div className="mt-7 grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <div className="h-24 rounded-2xl border border-edge bg-surface" />
      <div className="h-48 rounded-2xl border border-edge bg-surface" />
    </div>
    <div className="mt-8 h-24 rounded-xl bg-muted/20" />
  </div>
);

/** Friendly full-width message when the studio can't be loaded. */
const NotFoundCard = ({ description }: { description: string }) => (
  <div className="mx-auto mt-10 flex max-w-md flex-col items-center rounded-2xl border border-edge bg-surface px-8 py-14 text-center">
    <h2 className="text-lg font-semibold">Studio not found</h2>
    <p className="mt-2 text-sm leading-6 text-muted">
      {description} It may have been unlisted, or the link is out of date.
    </p>
  </div>
);

/**
 * The whole dynamic section: fetches the studio fresh, renders the detail
 * layout, or explains why there's nothing to show.
 */
const DetailsSection = async ({ id }: { id: string }) => {
  const { studio, error } = await loadStudio(id);

  if (!studio) {
    return <NotFoundCard description={error ?? ""} />;
  }

  return <StudioDetails studio={studio} />;
};

/* ------------------------------ Page ------------------------------ */

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 md:py-12">
      {/* The no-store fetch is uncached data, so it streams inside Suspense:
          the route shell renders instantly and this section fills in while
          the request is in flight (same pattern as the /studios grid). */}
      <Suspense fallback={<DetailsSkeleton />}>
        <DetailsSection id={id} />
      </Suspense>
    </div>
  );
}
