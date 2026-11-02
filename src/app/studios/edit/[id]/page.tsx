import { Suspense } from "react";
import EditStudioForm from "@/components/EditStudioForm";
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

    // Light validation: the form needs an id + title to be usable.
    if (!studio || !studio._id || typeof studio.title !== "string") {
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
const EditSkeleton = () => (
  <div aria-hidden="true" className="mx-auto w-full max-w-3xl animate-pulse px-4">
    <div className="mx-auto mt-2 h-4 w-40 rounded-full bg-muted/40" />
    <div className="mx-auto mt-4 h-9 w-2/3 rounded-lg bg-muted/40" />
    <div className="mx-auto mt-4 h-6 w-full max-w-md rounded-lg bg-muted/40" />
    <div className="mt-12 h-[calc(100%-15rem)] rounded-2xl border border-edge bg-surface" />
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
 * The whole dynamic section: fetches the studio fresh, renders the
 * prefilled edit form, or explains why there's nothing to edit.
 */
const EditSection = async ({ id }: { id: string }) => {
  const { studio, error } = await loadStudio(id);

  if (!studio) {
    return <NotFoundCard description={error ?? ""} />;
  }

  return <EditStudioForm studio={studio} />;
};

/* ------------------------------ Page ------------------------------ */

/**
 * Awaits the params Promise *inside* the Suspense boundary — under Cache
 * Components `params` is runtime data and reading it outside would block
 * prerendering (same loader pattern as the /studios grid).
 */
const EditLoader = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <EditSection id={id} />;
};

export default function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="flex-1 bg-background px-4 py-16 sm:py-20">
      {/* The no-store fetch AND the params read both happen inside Suspense:
          the route shell renders instantly and this section fills in while
          the request is in flight (same pattern as /studios/[id]). */}
      <Suspense fallback={<EditSkeleton />}>
        <EditLoader params={params} />
      </Suspense>
    </main>
  );
}
