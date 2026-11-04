import { Suspense } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  LogIn,
  PlusCircle,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import StudioListingCard from "@/components/StudioListingCard";
import type { Studio } from "@/components/StudioCard";

/* ------------------------------ Data ------------------------------ */

type LoadResult = { listings: Studio[]; error?: string };

/**
 * Fetch + normalize the signed-in user's studio listings; never throws,
 * never crashes.
 *
 * The backend exposes GET /studios with the owner `email` on each studio
 * (that's the field the detail page uses for ownership checks too), so
 * the user's listings are filtered out of that response.
 */
const loadListings = async (email?: string): Promise<LoadResult> => {
  if (!email) return { listings: [], error: "auth" };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studios`, {
      cache: "no-store", // always fresh
    });

    if (!res.ok) {
      return {
        listings: [],
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

    const listings = (Array.isArray(list) ? list : []).filter(
      (listing): listing is Studio => {
        // A listing must have a title AND be owned by the signed-in user.
        const s = listing as Studio;
        return Boolean(s && typeof s.title === "string" && s.email === email);
      },
    );

    return { listings };
  } catch {
    // Network error, API not running, invalid JSON... render the error card.
    return {
      listings: [],
      error: "We couldn't reach the studio service right now.",
    };
  }
};

/* --------------------------- Small pieces --------------------------- */

/** Gray pulsing placeholders shown while the API request is in flight. */
const ListingsSkeleton = () => (
  <ul aria-hidden="true" className="grid gap-5">
    {[0, 1, 2].map((n) => (
      <li
        key={n}
        className="h-[228px] animate-pulse rounded-2xl border border-edge bg-surface"
      />
    ))}
  </ul>
);

/** Friendly full-width message card for error / empty results. */
const StatusCard = ({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
  action?: React.ReactNode;
}) => (
  <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-edge bg-surface px-8 py-14 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-primary">
      <Icon className="h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
    </span>
    <h2 className="mt-5 text-lg font-semibold">{title}</h2>
    <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    {action}
  </div>
);

/**
 * The whole dynamic section: resolves the session, loads fresh listings,
 * then shows the cards (or a reason why there's nothing to show).
 */
const ListingsSection = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email;

  const { listings, error } = await loadListings(email);

  // Not signed in — nothing to look up.
  if (error === "auth") {
    return (
      <StatusCard
        icon={LogIn}
        title="You're not signed in"
        description="Sign in to manage the studios you've listed."
      />
    );
  }

  if (error) {
    return (
      <StatusCard
        icon={AlertTriangle}
        title="Something went wrong"
        description={`${error} Please try again in a few moments.`}
      />
    );
  }

  if (listings.length === 0) {
    return (
      <StatusCard
        icon={Building2}
        title="No studios listed yet"
        description="You haven't listed any studios yet — add your first one and it will appear here."
        action={
          <Link
            href="/add-new-studio"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/30 transition-all hover:brightness-110 active:scale-[.98]"
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            Add a new studio
          </Link>
        }
      />
    );
  }

  return (
    <>
      <p className="text-sm text-muted" aria-live="polite">
        You have {listings.length}{" "}
        {listings.length === 1 ? "listing" : "listings"}
      </p>

      {/* Card list — one studio per row, same layout as My Bookings */}
      <ul className="mt-5 grid gap-5">
        {listings.map((studio, index) => (
          <li key={studio._id ?? `${studio.title}-${index}`} className="h-full">
            <StudioListingCard studio={studio} />
          </li>
        ))}
      </ul>
    </>
  );
};

/* ------------------------------ Page ------------------------------ */

const MyStudioListing = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
      {/* Section header (same pattern as the /my-bookings page) */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          My Account
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          My{" "}
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
            Studio Listing
          </span>
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Manage the studios you host — edit their details or remove them from
          the marketplace.
        </p>
      </div>

      {/* The session lookup + uncached API call stream inside Suspense:
          the header above renders instantly, this section (including the
          skeleton) fills in while the request is in flight. */}
      <div className="mt-10">
        <Suspense fallback={<ListingsSkeleton />}>
          <ListingsSection />
        </Suspense>
      </div>
    </div>
  );
};

export default MyStudioListing;
